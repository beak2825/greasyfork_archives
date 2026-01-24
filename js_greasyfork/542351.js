// ==UserScript==
// @name            Bypass Paywalls Clean - en
// @version         4.2.9.0
// @description     Bypass Paywalls of news sites
// @author          magnolia1234
// @homepageURL     https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters
// @supportURL      https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters
// @license         MIT; https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=LICENSE
// @match           *://*.com/*
// @match           *://*.co.uk/*
// @match           *://*.com.au/*
// @match           *://*.co/*
// @match           *://*.io/*
// @match           *://*.net/*
// @match           *://*.net.au/*
// @match           *://*.org/*
// @match           *://*.pub/*
// @match           *://*.businessdesk.co.nz/*
// @match           *://*.businesspost.ie/*
// @match           *://*.businesstimes.com.sg/*
// @match           *://*.capital.bg/*
// @match           *://*.denik.cz/*
// @match           *://*.dnevnik.bg/*
// @match           *://*.epoch.org.il/*
// @match           *://*.europower.no/*
// @match           *://*.fiskeribladet.no/*
// @match           *://*.forbes.ua/*
// @match           *://*.ftm.eu/*
// @match           *://*.gitflic.ru/*
// @match           *://*.haaretz.co.il/*
// @match           *://*.iai.tv/*
// @match           *://*.independent.ie/*
// @match           *://*.indiatoday.in/*
// @match           *://*.intrafish.no/*
// @match           *://*.ipolitics.ca/*
// @match           *://*.japantimes.co.jp/*
// @match           *://*.livelaw.in/*
// @match           *://*.nation.africa/*
// @match           *://*.nautil.us/*
// @match           *://*.niagarafallsreview.ca/*
// @match           *://*.nv.ua/*
// @match           *://*.nzherald.co.nz/*
// @match           *://*.puck.news/*
// @match           *://*.sloanreview.mit.edu/*
// @match           *://*.stcatharinesstandard.ca/*
// @match           *://*.theleaflet.in/*
// @match           *://*.uxdesign.cc/*
// @match           *://*.wellandtribune.ca/*
// @connect         archive.fo
// @connect         archive.is
// @connect         archive.li
// @connect         archive.md
// @connect         archive.ph
// @connect         archive.vn
// @connect         djservices.io
// @exclude         *://*.amazon-adsystem.com/*
// @exclude         *://*.consentmanager.net/*
// @exclude         *://*.centrefrance.com/*
// @exclude         *://*.criteo.com/*
// @exclude         *://*.dailymotion.com/*
// @exclude         *://*.doubleclick.net/*
// @exclude         *://*.dwcdn.net/*
// @exclude         *://*.facebook.com/*
// @exclude         *://*.google.com/*
// @exclude         *://*.googleapis.com/*
// @exclude         *://*.googletagmanager.com/*
// @exclude         *://*.instagram.com/*
// @exclude         *://*.klarna.com/*
// @exclude         *://*.mediafire.com/*
// @exclude         *://*.openx.net/*
// @exclude         *://*.outbrain.com/*
// @exclude         *://*.pinterest.com/*
// @exclude         *://*.pubmatic.com/*
// @exclude         *://*.rubiconproject.com/*
// @exclude         *://*.seedtag.com/*
// @exclude         *://*.smartadserver.com/*
// @exclude         *://*.stripe.com/*
// @exclude         *://*.taboola.com/*
// @exclude         *://*.tinypass.com/*
// @exclude         *://*.twitter.com/*
// @exclude         *://*.ultimedia.com/*
// @exclude         *://*.youtube.com/*
// @exclude         *://*.abcmais.com/*
// @exclude         *://*.bienpublic.com/*
// @exclude         *://*.cambiocolombia.com/*
// @exclude         *://*.clarin.com/*
// @exclude         *://*.connaissancedesarts.com/*
// @exclude         *://*.cronista.com/*
// @exclude         *://*.diariocordoba.com/*
// @exclude         *://*.diariovasco.com/*
// @exclude         *://*.elconfidencial.com/*
// @exclude         *://*.elcorreo.com/*
// @exclude         *://*.elespanol.com/*
// @exclude         *://*.elespectador.com/*
// @exclude         *://*.elmercurio.com/*
// @exclude         *://*.elpais.com/*
// @exclude         *://elpais.com/*
// @exclude         *://*.elperiodico.com/*
// @exclude         *://*.elperiodicodearagon.com/*
// @exclude         *://*.elperiodicoextremadura.com/*
// @exclude         *://*.elperiodicomediterraneo.com/*
// @exclude         *://*.eltiempo.com/*
// @exclude         *://*.eltribuno.com/*
// @exclude         *://*.eluniverso.com/*
// @exclude         *://*.exame.com/*
// @exclude         *://*.expansion.com/*
// @exclude         *://*.faz.net/*
// @exclude         *://*.globo.com/*
// @exclude         *://*.handelsblatt.com/*
// @exclude         *://*.ilsole24ore.com/*
// @exclude         *://*.jeuneafrique.com/*
// @exclude         *://*.journaldunet.com/*
// @exclude         *://*.la-croix.com/*
// @exclude         *://*.larioja.com/*
// @exclude         *://*.lasegunda.com/*
// @exclude         *://*.latercera.com/*
// @exclude         *://*.lavenir.net/*
// @exclude         *://*.ledauphine.com/*
// @exclude         *://*.ledevoir.com/*
// @exclude         *://*.lejsl.com/*
// @exclude         *://*.lerevenu.com/*
// @exclude         *://*.lesinrocks.com/*
// @exclude         *://*.levante-emv.com/*
// @exclude         *://*.loeildelaphotographie.com/*
// @exclude         *://*.marca.com/*
// @exclude         *://*.marianne.net/*
// @exclude         *://*.parismatch.com/*
// @exclude         *://*.parkiet.com/*
// @exclude         *://*.politicaexterior.com/*
// @exclude         *://*.pourleco.com/*
// @exclude         *://*.projectcargojournal.com/*
// @exclude         *://*.quotidiano.net/*
// @exclude         *://*.railfreight.cn/*
// @exclude         *://*.railfreight.com/*
// @exclude         *://*.railtech.com/*
// @exclude         *://*.reforme.net/*
// @exclude         *://*.revistaoeste.com/*
// @exclude         *://*.science-et-vie.com/*
// @exclude         *://*.semana.com/*
// @exclude         *://*.topagrar.com/*
// @exclude         *://*.tt.com/*
// @exclude         *://*.tuttosport.com/*
// @exclude         *://*.valeursactuelles.com/*
// @exclude         *://*.wochenblatt.com/*
// @grant           GM.xmlHttpRequest
// @namespace https://greasyfork.org/users/1493917
// @downloadURL https://update.greasyfork.org/scripts/542351/Bypass%20Paywalls%20Clean%20-%20en.user.js
// @updateURL https://update.greasyfork.org/scripts/542351/Bypass%20Paywalls%20Clean%20-%20en.meta.js
// ==/UserScript==

/* @require-inline https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=userscript/bpc_func.js */
//"use strict";
var func_post;
var fetch_headers = {};
var domain;
var mobile = window.navigator.userAgent.toLowerCase().includes('mobile');
var csDoneOnce;
var cs_param = {};

function removeDOMElement(...elements) {
  for (let element of elements) {
    if (element)
      element.remove();
  }
}

function hideDOMElement(...elements) {
  for (let element of elements) {
    if (element)
      element.style = 'display:none !important;';
  }
}

function hideDOMStyle(selector, id = 1) {
  let style = document.querySelector('head > style#ext'+ id);
  if (!style && document.head) {
    let sheet = document.createElement('style');
    sheet.id = 'ext' + id;
    sheet.innerText = selector + ' {display: none !important;}';
    document.head.appendChild(sheet);
  }
}

function addStyle(css, id = 1) {
  let style = document.querySelector('head > style#add'+ id);
  if (!style && document.head) {
    let sheet = document.createElement('style');
    sheet.id = 'add' + id;
    sheet.innerText = css;
    document.head.appendChild(sheet);
  }
}

function waitDOMElement(selector, tagName = '', callback, multiple = false) {
  new window.MutationObserver(function (mutations) {
    for (let mutation of mutations) {
      for (let node of mutation.addedNodes) {
        if (!tagName || (node.tagName === tagName)) {
          if (node.matches(selector)) {
            callback(node);
            if (!multiple)
              this.disconnect();
          }
        }
      }
    }
  }).observe(document, {
    subtree: true,
    childList: true
  });
}

function waitDOMAttribute(selector, tagName = '', attributeName = '', callback, multiple = false) {
  let targetNode = document.querySelector(selector);
  if (!targetNode)
    return;
  new window.MutationObserver(function (mutations) {
    for (let mutation of mutations) {
      if (mutation.target.attributes[attributeName]) {
        callback(mutation.target);
        if (!multiple)
          this.disconnect();
      }
    }
  }).observe(targetNode, {
    attributes: true,
    attributeFilter: [attributeName]
  });
}

function matchDomain(domains, hostname = window.location.hostname) {
  if (typeof domains === 'string')
    domains = [domains];
  return domains.find(domain => hostname === domain || hostname.endsWith('.' + domain)) || false;
}

function urlHost(url) {
  if (/^http/.test(url)) {
    try {
      return new URL(url).hostname;
    } catch (e) {
      console.log(`url not valid: ${url} error: ${e}`);
    }
  }
  return url;
}

function matchUrlDomain(domains, url) {
  return matchDomain(domains, urlHost(url));
}

function makeFigure(url, caption_text, img_attrib = {}, caption_attrib = {}) {
  let elem = document.createElement('figure');
  let img = document.createElement('img');
  img.src = url;
  for (let attrib in img_attrib)
    if (img_attrib[attrib])
      img.setAttribute(attrib, img_attrib[attrib]);
  elem.appendChild(img);
  if (caption_text) {
    let caption = document.createElement('figcaption');
    for (let attrib in caption_attrib)
      if (caption_attrib[attrib])
        caption.setAttribute(attrib, caption_attrib[attrib]);
    let cap_par = document.createElement('p');
    cap_par.innerText = caption_text;
    caption.appendChild(cap_par);
    elem.appendChild(caption);
  }
  return elem;
}

function header_nofix(header, cond_sel = '', msg = 'BPC > no fix') {
  if (header && typeof header === 'string')
    header = document.querySelector(header);
  if (header && !document.querySelector('div#bpc_nofix')) {
    if (cond_sel) {
      let elem = document.querySelectorAll(cond_sel);
      if (elem.length)
        removeDOMElement(...elem);
      else
        return false;
    }
    let nofix_div = document.createElement('div');
    nofix_div.id = 'bpc_nofix';
    nofix_div.style = 'margin: 20px; font-size: 20px; font-weight: bold; color: red;';
    nofix_div.innerText = msg;
    header.before(nofix_div);
  }
}

function clearPaywall(paywall, paywall_action) {
  if (paywall) {
    if (!paywall_action)
      removeDOMElement(...paywall);
    else {
      for (let elem of paywall) {
        if (paywall_action.rm_class)
          elem.classList.remove(paywall_action.rm_class);
        else if (paywall_action.rm_attrib)
          elem.removeAttribute(paywall_action.rm_attrib);
      }
    }
  }
}

function getArticleSrc(url, url_src, proxy, base64, selector, text_fail = '', selector_source = selector, selector_archive = selector) {
  let url_fetch = url_src || url;
  GM.xmlHttpRequest({
    method: "GET",
    url: url_fetch,
    headers: fetch_headers,
    onload: function (response) {
      let html = response.responseText;
      if (proxy && base64) {
        html = decode_utf8(atob(html));
        selector_source = 'body';
      }
      let recursive;
      if (url.startsWith('https://archive.')) {
        if (url_fetch.includes('/https')) {
          if (html.includes('<div class="TEXT-BLOCK"')) {
            url_src = html.split('<div class="TEXT-BLOCK"')[1].split('</div>')[0].split('href="')[1].split('"')[0];
            getArticleSrc(url, url_src, proxy, base64, selector, text_fail, selector_source, selector_archive);
            recursive = true;
          } else
            html = '';
        }
      }
      if (!recursive)
        replaceDomElementExtSrc(url, url_src, html, proxy, base64, selector, text_fail, selector_source, selector_archive);
    }
  });
}

function getArchive(url, paywall_sel, paywall_action = '', selector, text_fail = '', selector_source = selector, selector_archive = selector) {
  let url_archive = 'https://' + archiveRandomDomain() + '/' + url.split(/[#\?]/)[0];
  let paywall = document.querySelectorAll(paywall_sel);
  if (paywall.length) {
    clearPaywall(paywall, paywall_action);
    replaceDomElementExt(url_archive, true, false, selector, text_fail, selector_source, selector_archive);
  }
}

function getExtFetch(url, json_key = '', headers = {}, callback = '', args = []) {
  GM.xmlHttpRequest({
    method: "GET",
    url: url,
    headers: headers,
    onload: function (response) {
      let html = response.responseText;
      if (json_key) {
        try {
          let json = JSON.parse(html);
          if (json)
            html = getNestedKeys(json, json_key);
        } catch (err) {
          console.log(err);
        }
      }
      callback(url, html, ...args);
    }
  })
}

var selector_level = false;
function replaceDomElementExt(url, proxy, base64, selector, text_fail = '', selector_source = selector, selector_archive = selector) {
  let article = document.querySelector(selector);
  let archive_match = url.match(/https:\/\/archive\.\w{2}\//);
  if (!article) {
    if (archive_match && document.body)
      document.body.firstChild.before(archiveLink(url));
    return;
  }
  if (proxy) {
    if (!text_fail) {
      if (archive_match)
        text_fail = 'BPC > Try for full article text (no need to report issue for external site):\r\n';
      else if (!matchUrlDomain(window.location.hostname, url))
        text_fail = 'BPC > failed to load from external site:\r\n';
    }
    getArticleSrc(url, '', proxy, base64, selector, text_fail, selector_source, selector_archive);
  } else {
    fetch(url, {headers: fetch_headers})
    .then(response => {
      let article = document.querySelector(selector);
      if (response.ok) {
        response.text().then(html => {
          replaceDomElementExtSrc(url, '', html, false, base64, selector, text_fail, selector_source);
        });
      } else {
        replaceTextFail(url, article, proxy, text_fail);
      }
    }).catch(function (err) {
      replaceTextFail(url, article, proxy, text_fail);
    });
  }
}

function getSelectorLevel(selector) {
  if (selector.replace(/,\s+/g, ',').match(/[>\s]+/) && !selector.includes(':has(>'))
    selector = selector.replace(/,\s+/g, ',').split(',').map(x => x.match(/[>\s]+/) ? x + ', ' + x.split(/[>\s]+/).pop() : x).join(', ');
  return selector;
}

function replaceDomElementExtSrc(url, url_src, html, proxy, base64, selector, text_fail = '', selector_source = selector, selector_archive = selector) {
  let article = document.querySelector(selector);
  let article_link = document.querySelector(selector_archive);
  let no_content_msg = '&nbsp;| no article content found! | :';
  if (html) {
    if (!proxy && base64) {
      html = decode_utf8(atob(html));
      selector_source = 'body';
    }
    let parser = new DOMParser();
    window.setTimeout(function () {
      if (url.startsWith('https://archive.') && url_src) {
        let domain_archive = url.match(/^https:\/\/(archive\.\w{2})/)[1];
        let pathname = new URL(url_src).pathname;
        html = html.replace(new RegExp('https:\\/\\/' + domain_archive.replace('.', '\\.') + '\\/o\\/\\w+\\/', 'g'), '').replace(new RegExp("(src=\"|background-image:url\\(')" + pathname.replace('/', '\\/'), 'g'), "$1" + 'https://' + domain_archive + pathname);
      }
      let doc = parser.parseFromString(html, 'text/html');
      if (selector_level)
        selector_source = getSelectorLevel(selector_source);
      let article_new = doc.querySelector(selector_source);
      if (article_new) {
        if (article && article.parentNode) {
          if (url.startsWith('https://archive.')) {
            let arch_dom = (selector_archive !== selector) ? (article_new.querySelector(selector_archive) || document.querySelector(selector_archive)) : article_new;
            if (arch_dom) {
              if (arch_dom.firstChild)
                arch_dom = arch_dom.firstChild;
              let arch_div = document.createElement('div');
              arch_div.appendChild(archiveLink_renew(url_src));
              arch_div.appendChild(archiveLink(window.location.href.split(/[#\?]/)[0], 'BPC > Full article text fetched from (no need to report issue for external site):\r\n'));
              arch_div.style = 'margin: 0px 0px 50px;';
              arch_dom.before(arch_div);
            }
            let targets = article_new.querySelectorAll('a[target="_blank"][href^="' + window.location.origin + '"]');
            for (let elem of targets)
              elem.removeAttribute('target');
            let invalid_links = article_new.querySelectorAll('link[rel*="preload"]:not([href])');
            removeDOMElement(...invalid_links);
          }
          window.setTimeout(function () {
            if (article.parentNode) {
              article.parentNode.replaceChild(article_new, article);
              if (func_post)
                func_post();
            }
          }, 200);
        }
      } else
        replaceTextFail(url, article_link, proxy, text_fail.replace(':', no_content_msg));
    }, 200);
  } else {
    replaceTextFail(url, article_link, proxy, url_src ? text_fail.replace(':', no_content_msg) : text_fail);
    if (!url_src && url.includes('/https://www.thetimes.com/')) {
      let url_orig = 'https:' + url.split('/https:')[1];
      if (article_link)
        article_link.before(externalLink(['clearthis.page'], 'https://clearthis.page/?u={url}', encodeURIComponent(url_orig), 'BPC > Try for full article text:'));
    }
  }
}

function replaceTextFail(url, article, proxy, text_fail) {
  if (text_fail && article) {
    let text_fail_div = document.createElement('div');
    text_fail_div.id = 'bpc_fail';
    text_fail_div.setAttribute('style', 'margin: 0px 50px; font-weight: bold; color: red;');
    text_fail_div.appendChild(document.createTextNode(text_fail));
    if (proxy) {
      if (url.startsWith('https://archive.')) {
        text_fail_div = archiveLink(url.replace(/^https:\/\/archive\.\w{2}\//, ''), text_fail);
      } else {
        let a_link = document.createElement('a');
        a_link.innerText = url;
        a_link.href = url;
        a_link.target = '_blank';
        text_fail_div.appendChild(a_link);
      }
    }
    if (article.firstChild)
      article.firstChild.before(text_fail_div);
    else
      article.appendChild(text_fail_div);
  }
}

function amp_images_replace() {
  window.setTimeout(function () {
    let amp_images = document.querySelectorAll('figure amp-img[src^="http"]');
    for (let amp_image of amp_images) {
      let elem = document.createElement('img');
      elem.src = amp_image.getAttribute('src');
      elem.alt = amp_image.getAttribute('alt');
      elem.style = 'width: 100%;';
      amp_image.parentNode.replaceChild(elem, amp_image);
    }
  }, 1000);
}

function amp_iframes_replace(weblink = false, source = '') {
  let amp_iframes = document.querySelectorAll('amp-iframe' + (source ? '[src*="' + source + '"]' : ''));
  let par, elem;
  for (let amp_iframe of amp_iframes) {
    if (!weblink) {
      if (amp_iframe.offsetHeight > 10) {
        elem = document.createElement('iframe');
        elem.src = amp_iframe.getAttribute('src').replace(/^http:/, 'https:');
        elem.style = 'height: ' + amp_iframe.offsetHeight + 'px; width: 100%; border: 0px;';
        if (amp_iframe.getAttribute('sandbox'))
          elem.sandbox = amp_iframe.getAttribute('sandbox');
        amp_iframe.parentNode.replaceChild(elem, amp_iframe);
      }
    } else {
      par = document.createElement('p');
      par.style = 'margin: 20px 0px;';
      elem = document.createElement('a');
      elem.innerText = 'Media-link';
      elem.setAttribute('href', amp_iframe.getAttribute('src'));
      elem.setAttribute('target', '_blank');
      par.appendChild(elem);
      amp_iframe.parentNode.replaceChild(par, amp_iframe);
    }
  }
}

function amp_redirect_not_loop(amphtml) {
  if (!check_loop()) {
    window.location.href = amphtml.href;
  } else {
    let header = (document.body && document.body.firstChild) || document.documentElement;
    header_nofix(header, '', 'BPC > redirect to amp failed (disable amp-to-html extension/add-on or browser setting)');
  }
}

function amp_redirect(paywall_sel, paywall_action = '', amp_url = '') {
  let paywall = document.querySelectorAll(paywall_sel);
  let amphtml = document.querySelector('head > link[rel="amphtml"]');
  if (!amphtml && amp_url)
    amphtml = {href: amp_url};
  if (paywall.length && amphtml) {
    clearPaywall(paywall, paywall_action);
    amp_redirect_not_loop(amphtml);
  }
}

function amp_unhide_subscr_section(amp_ads_sel = '', replace_iframes = true, amp_iframe_link = false, source = '') {
  let preview = document.querySelectorAll('[subscriptions-section="content-not-granted"]');
  removeDOMElement(...preview);
  let subscr_section = document.querySelectorAll('[subscriptions-section="content"]');
  for (let elem of subscr_section)
    elem.removeAttribute('subscriptions-section');
  if (amp_ads_sel)
    hideDOMStyle(amp_ads_sel, 5);
  if (replace_iframes)
    amp_iframes_replace(amp_iframe_link, source);
}

function amp_unhide_access_hide(amp_access = '', amp_access_not = '', amp_ads_sel = '', replace_iframes = true, amp_iframe_link = false, source = '') {
  let access_hide = document.querySelectorAll('[amp-access' + amp_access + '][amp-access-hide]:not([amp-access="error"], [amp-access^="message"], .piano)');
  for (let elem of access_hide)
    elem.removeAttribute('amp-access-hide');
  if (amp_access_not) {
    let amp_access_not_dom = document.querySelectorAll('[amp-access' + amp_access_not + ']');
    removeDOMElement(...amp_access_not_dom);
  }
  if (amp_ads_sel)
    hideDOMStyle(amp_ads_sel, 6);
  if (replace_iframes)
    amp_iframes_replace(amp_iframe_link, source);
}

function ampToHtml() {
  window.setTimeout(function () {
    let canonical = document.querySelector('head > link[rel="canonical"][href]');
    if (canonical)
      window.location.href = canonical.href;
  }, 1000);
}

function check_loop(interval = 2000) {
  let loop = true;
  let loop_date = Number(sessionStorage.getItem('###_loop'));
  if (!(loop_date && (Date.now() - loop_date < interval))) {
    sessionStorage.setItem('###_loop', Date.now());
    loop = false;
  }
  return loop;
}

function refreshCurrentTab(not_loop = true, not_loop_msg = true) {
  if (!not_loop || !check_loop(5000)) {
    window.setTimeout(function () {
      window.location.reload(true);
    }, 500);
  } else if (not_loop_msg) {
    let header = (document.body && document.body.firstChild) || document.documentElement;
    header_nofix(header, '', 'BPC > refresh loop stopped');
  }
}

function archiveRandomDomain() {
  let tld_array = ['fo', 'is', 'li', 'md', 'ph', 'vn'];
  let tld = tld_array[randomInt(6)];
  return 'archive.' + tld;
}

function archiveLink(url, text_fail = 'BPC > Try for full article text (no need to report issue for external site):\r\n') {
  return externalLink(['archive.today', archiveRandomDomain()], 'https://{domain}?run=1&url={url}', url, text_fail);
}

function archiveLink_renew(url, text_fail = 'BPC > Only use to renew if text is incomplete or updated:\r\n') {
  return externalLink([new URL(url).hostname], '{url}/again?url=' + window.location.href.split(/[#\?]/)[0], url, text_fail);
}

function googleSearchToolLink(url, text_fail = 'BPC > Try for full article text (test url & copy html (tab) code to [https://codebeautify.org/htmlviewer]):\r\n') {
  return externalLink(['search.google.com'], 'https://search.google.com/test/rich-results?url={url}', encodeURIComponent(url), text_fail);
}

function freediumLink(url, text_fail = 'BPC > Try for full article text:\r\n') {
  return externalLink(['freedium.cfd'], 'https://{domain}/{url}', url, text_fail);
}

function readMediumLink(url, text_fail = 'BPC > Try for full article text:\r\n') {
  return externalLink(['readmedium.com'], 'https://{domain}/{url}', url, text_fail);
}

function externalLink(domains, ext_url_templ, url, text_fail = 'BPC > Full article text:\r\n') {
  let text_fail_div = document.createElement('div');
  text_fail_div.id = 'bpc_archive';
  text_fail_div.setAttribute('style', 'margin: 20px; font-size: 20px; font-weight: bold; color: red;');
  let parser = new DOMParser();
  text_fail = text_fail.replace(/\[(?<url>[^\]]+)\]/g, function (match, url) {
    return "<a href='" + url + "' target='_blank' style='color: red'>" + new URL(url).hostname + "</a>";
  });
  let doc = parser.parseFromString('<span>' + text_fail + '</span>', 'text/html');
  let elem = doc.querySelector('span');
  text_fail_div.appendChild(elem);
  for (let domain of domains) {
    let ext_url = ext_url_templ.replace('{domain}', domain).replace('{url}', url.split('?')[0]);
    let a_link = document.createElement('a');
    a_link.innerText = domain;
    a_link.href = ext_url;
    a_link.target = '_blank';
    text_fail_div.appendChild(document.createTextNode(' | '));
    text_fail_div.appendChild(a_link);
  }
  return text_fail_div;
}

function removeClassesByPrefix(el, prefix) {
  let el_classes = el.classList;
  for (let el_class of el_classes) {
    if (el_class.startsWith(prefix))
      el_classes.remove(el_class);
  }
}

function removeClassesList(list) {
  for (let class_item of list) {
    let elems = document.querySelectorAll('.' + class_item);
    for (let elem of elems)
      elem.classList.remove(class_item);
  }
}

function cookieExists(name) {
  return document.cookie.split(';').some(function (item) {
    return item.trim().indexOf(name + '=') === 0
  })
}

function matchCookies(name) {
  return document.cookie.split(';').filter(x => x.trim().match(name)).map(y => y.split('=')[0].trim())
}

function setCookie(names, value, domain = '', path = '/', days = 0, localstorage_hold = false) {
  var max_age = days * 24 * 60 * 60;
  let ck_names = Array.isArray(names) ? names : [];
  if (names instanceof RegExp)
    ck_names = matchCookies(names);
  else if (typeof names === 'string')
    ck_names = [names];
  for (let ck_name of ck_names) {
    document.cookie = ck_name + "=" + (value || "") + (domain ? "; domain=" + domain : '') + (path ? "; path=" + path : '') + "; max-age=" + max_age;
  }
  if (!localstorage_hold) {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
}

function insert_script(func, insertAfterDom) {
  let bpc_script = document.querySelector('script#bpc_script');
  if (!bpc_script) {
    let script = document.createElement('script');
    script.setAttribute('id', 'bpc_script');
    script.appendChild(document.createTextNode('(' + func + ')();'));
    let insertAfter = insertAfterDom ? insertAfterDom : (document.body || document.head || document.documentElement);
    insertAfter.appendChild(script);
  }
}

function getSourceJsonScript(filter, attributes = ':not([src], [type])') {
  if (typeof filter === 'string')
    filter = new RegExp(filter);
  let scripts = document.querySelectorAll('script' + attributes);
  for (let script of scripts) {
    if (script.text.match(filter))
      return script;
  }
  return false;
}

function getArticleJsonScript() {
  let scripts = document.querySelectorAll('script[type="application/ld+json"]');
  let json_script;
  for (let script of scripts) {
    if (script.innerText.match(/"(articlebody|text)":/i)) {
      json_script = script;
      break;
    }
  }
  return json_script;
}

function restorePugpigLink(node, art_link_sel = '') {
  let art_link = !art_link_sel ? node : node.querySelector(art_link_sel);
  if (art_link)
    art_link.onmousedown = x => window.location.href = art_link.href;
}

function restorePugpigPage() {
  let art_link_sel = 'a.pp-widget-article, a.pp-related__link';
  document.querySelectorAll(art_link_sel).forEach(e => restorePugpigLink(e));
  waitDOMElement(art_link_sel, 'A', restorePugpigLink, true);
  waitDOMElement('li[class^="collection_type-"]', 'LI', node => restorePugpigLink(node, art_link_sel), true);
  let modal = 'section.modal';
  hideDOMStyle(modal);
  let paywall = document.querySelector('div.paywall');
  if (paywall)
    refreshCurrentTab();
}

function getArticleQuintype() {
  let article_new;
  let json_script = document.querySelector('script#static-page');
  if (json_script) {
    try {
      article_new = document.createElement('div');
      let parser = new DOMParser();
      let json = JSON.parse(json_script.text);
      let slug = decodeURIComponent(json.qt.data.story.slug);
      if (slug && !decodeURIComponent(window.location.pathname).includes(slug))
        refreshCurrentTab();
      let pars = json.qt.data.story.cards;
      for (let par of pars) {
        let story_elements = par['story-elements'];
        for (let elem of story_elements) {
          let par_elem;
          if (['text', 'title'].includes(elem.type) && elem.text) {
            let doc = parser.parseFromString('<div style="margin: 25px 0px">' + elem.text + '</div>', 'text/html');
            par_elem = doc.querySelector('div');
          } else if (elem.type === 'image') {
            if (elem['image-s3-key']) {
              par_elem = document.createElement('figure');
              let img = document.createElement('img');
              img.src = 'https://media.assettype.com/' + elem['image-s3-key'];
              par_elem.appendChild(img);
              if (elem.title) {
                let caption = document.createElement('figcaption');
                if (elem.title.includes('</')) {
                  let doc = parser.parseFromString('<div>' + elem.title + '</div>', 'text/html');
                  caption.appendChild(doc.querySelector('div'));
                } else
                  caption.innerText = elem.title;
                par_elem.appendChild(caption);
              }
            }
          } else if (elem.type === 'jsembed') {
            if (elem.subtype === 'tweet') {
              if (elem.metadata && elem.metadata['tweet-url']) {
                par_elem = document.createElement('a');
                par_elem.href = par_elem.innerText = elem.metadata['tweet-url'];
                par_elem.target = '_blank';
              } else
                console.log(elem);
            }
          } else if (elem.type === 'youtube-video') {
            if (elem['embed-url']) {
              par_elem = document.createElement('iframe');
              par_elem.src = elem['embed-url'];
              par_elem.style = 'width: 100%; height: 400px;';
            }
          } else if (elem.type === 'file') {
            if (elem.url && elem['file-name']) {
              par_elem = document.createElement('a');
              par_elem.href = elem.url;
              par_elem.innerText = elem['file-name'];
              par_elem.target = '_blank';
            }
          } else if (!['widget'].includes(elem.type))
            console.log(elem);
          if (par_elem)
            article_new.appendChild(par_elem);
        }
      }
      if (!article_new.hasChildNodes())
        article_new = '';
    } catch (err) {
      console.log(err);
    }
  }
  return article_new;
}

function filterObject(obj, filterFn, mapFn = function (val, key) {
  return [key, val];
}) {
  return Object.fromEntries(Object.entries(obj).
    filter(([key, val]) => filterFn(val, key)).map(([key, val]) => mapFn(val, key)));
}

function matchKeyJson(key, keys) {
  let match = false;
  if (typeof keys === 'string')
    match = (key === keys);
  else if (Array.isArray(keys))
    match = keys.includes(key);
  else if (keys instanceof RegExp)
    match = keys.test(key);
  return match;
}

function findKeyJson(json, keys, min_val_len = 0) {
  let source = '';
  if (Array.isArray(json)) {
    for (let elem of json)
      source = source || findKeyJson(elem, keys, min_val_len);
  } else if (typeof json === 'object') {
    for (let elem in json) {
      let json_elem = json[elem];
      if (typeof json_elem === 'string' && matchKeyJson(elem, keys)) {
        if (json_elem.length > min_val_len)
          return json_elem;
      } else if (Array.isArray(json_elem) && json_elem.length > 1 && matchKeyJson(elem, keys)) {
        return json_elem;
      } else
        source = source || findKeyJson(json_elem, keys, min_val_len);
    }
  }
  return source;
}

function getNestedKeys(obj, key) {
  if (key in obj)
    return obj[key];
  let keys = key.split('.');
  let value = obj;
  for (let i = 0; i < keys.length; i++) {
    value = value[keys[i]];
    if (value === undefined)
      break;
  }
  return value;
}

function getJsonUrlText(article, callback, article_id = '', key = '', url_rest = false, url_slash = false) {
  let json_url_dom = document.querySelector('head > link[rel="alternate"][type="application/json"][href]');
  let json_url;
  if (json_url_dom)
    json_url = json_url_dom.href;
  if (!json_url && article_id)
    json_url = window.location.origin + '/wp-json/wp/v2/posts/' + article_id;
  if (url_rest)
    json_url = json_url.replace('/wp-json/', '/?rest_route=/');
  else if (url_slash)
    json_url = json_url.replace('/wp-json/', '//wp-json/');
  if (json_url) {
    fetch(json_url)
    .then(response => {
      if (response.ok) {
        response.text().then(html => {
          try {
            let json = JSON.parse(html.replace(/<script>[\S\s]+<\/script>/g, ''));
            let json_text = parseHtmlEntities(!key ? json.content.rendered : getNestedKeys(json, key));
            if (json_text && json_text !== 'undefined')
              callback(json_text, article);
          } catch (err) {
            console.log(err);
          }
        });
      }
    });
  }
}

function getJsonUrlAdd(json_text, article, art_options = {}) {
  let art_type = 'div';
  let art_attrib = '';
  if (Object.keys(art_options).length) {
    if (art_options.art_type)
      art_type = art_options.art_type;
    if (art_options.art_class)
      art_attrib += ' class="' + art_options.art_class + '"';
    if (art_options.art_id)
      art_attrib += ' id="' + art_options.art_id + '"';
    if (art_options.art_style)
      art_attrib += ' style="' + art_options.art_style + '"';
    if (art_options.func_text)
      json_text = art_options.func_text(json_text);
  }
  let parser = new DOMParser();
  let doc = parser.parseFromString('<' + art_type + art_attrib + '>' + json_text + '</' + art_type + '>', 'text/html');
  let article_new = doc.querySelector(art_type);
  if (art_options.art_append || !article.parentNode) {
    if (!art_options.art_hold)
      article.innerHTML = '';
    article.appendChild(article_new);
  } else
    article.parentNode.replaceChild(article_new, article);
  if (func_post)
    func_post();
}

function getJsonUrl(paywall_sel, paywall_action = '', article_sel, art_options = {}, article_id = '', key = '', url_rest = false, url_slash = false) {
  let paywall = document.querySelectorAll(paywall_sel);
  let article = document.querySelector(article_sel);
  if (paywall.length && article) {
    clearPaywall(paywall, paywall_action);
    getJsonUrlText(article, (json_text, article) => {
      if (json_text && article)
        getJsonUrlAdd(json_text, article, art_options);
    }, article_id, key, url_rest, url_slash);
  }
}

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomIP(range_low = 0, range_high = 223) {
  let rndmIP = [];
  for (let n = 0; n < 4; n++) {
    if (n === 0)
      rndmIP.push(range_low + randomInt(range_high - range_low + 1));
    else
      rndmIP.push(randomInt(255) + 1);
  }
  return rndmIP.join('.');
}

function pageContains(selector, text) {
  let elements = document.querySelectorAll(selector);
  return Array.prototype.filter.call(elements, function (element) {
    return RegExp(text).test(element.textContent);
  });
}

function findOverlap(a, b) {
  if (b.length === 0)
    return "";
  if (a.endsWith(b))
    return b;
  return findOverlap(a, b.substring(0, b.length - 1));
}

function breakText(str, headers = false) {
  str = str.replace(/(?:^|[A-Za-z\"\“\”\)])(\.+|\?|!)(?=[A-ZÖÜ\„\”\d][A-Za-zÀ-ÿ\„\d]{1,})/gm, "$&\n\n");
  if (headers)
    str = str.replace(/(([a-z]{2,}|[\"\“]))(?=[A-Z](?=[A-Za-zÀ-ÿ]+))/gm, "$&\n\n");
  return str;
}

function parseHtmlEntities(encodedString) {
  let parser = new DOMParser();
  let doc = parser.parseFromString('<textarea>' + encodedString + '</textarea>', 'text/html');
  let dom = doc.querySelector('textarea');
  return dom.value;
}

function encode_utf8(str) {
  return unescape(encodeURIComponent(str));
}

function decode_utf8(str) {
  return decodeURIComponent(escape(str));
}

function ads_hide() {
  var overlay = document.querySelector('body.didomi-popup-open');
  if (overlay)
    overlay.classList.remove('didomi-popup-open');
  var ads = 'div.OUTBRAIN, div[id^="taboola-" i], div.ad-container, div[class*="-ad-container"], div[class*="_ad-container"], div.arc_ad, div[id^="poool-"], amp-ad, amp-embed[type="mgid"], amp-embed[type="outbrain"], amp-embed[type="taboola"]';
  hideDOMStyle(ads, 10);
}

function leaky_paywall_unhide() {
  if (document.querySelector('head > link[href*="/leaky-paywall"], script[src*="/leaky-paywall"], div[id^="issuem-leaky-paywall-"]')) {
    let js_cookie = document.querySelector('script#leaky_paywall_cookie_js-js-extra');
    if (js_cookie && js_cookie.text.includes('"post_container":"')) {
      let post_sel = js_cookie.text.split('"post_container":"')[1].split('"')[0];
      if (post_sel) {
        let post = document.querySelector(post_sel);
        if (post)
          post.removeAttribute('class');
      }
    }
  }
}
/* @require-inline-end */

(function() {
  //'use strict';

if (window.top !== window.self && !matchDomain(['app.historytoday.com', 'appan.newscientist.com']))
  return;

var usa_adv_local_domains = ['al.com', 'cleveland.com', 'lehighvalleylive.com', 'masslive.com', 'mlive.com', 'nj.com', 'oregonlive.com', 'pennlive.com', 'silive.com', 'syracuse.com'];

if (matchDomain(['adage.com', 'autonews.com', 'pionline.com'])) {
  function crain_main() {
    if (window.Fusion) {
      window.Fusion.globalContent._id = 0;
      window.Fusion.globalContent.content_restrictions = {};
    }
  }
  window.setTimeout(function () {
    insert_script(crain_main);
  }, 100);
}

else if (matchDomain('nzherald.co.nz')) {
  function nzherald_main() {
    if (window.Fusion)
      window.Fusion.globalContent.isPremium = false;
  }
  window.setTimeout(function () {
    insert_script(nzherald_main);
  }, 100);
}

else if (matchDomain(['thehindu.com', 'thehindubusinessline.com'])) {
  function hindu_main() {
    if (window) {
      window.Adblock = false;
      window.isNonSubcribed = false;
    }
  }
  window.setTimeout(function () {
    insert_script(hindu_main);
  }, 100);
}

else if (matchDomain(usa_adv_local_domains)) {
  function adv_main() {
    if (window.adiData) {
      window.adiData.entryTags = 0;
    }
  }
  window.setTimeout(function () {
    insert_script(adv_main);
  }, 100);
}

window.setTimeout(function () {

var ca_torstar_domains = ['niagarafallsreview.ca', 'stcatharinesstandard.ca', 'thepeterboroughexaminer.com', 'therecord.com', 'thespec.com', 'thestar.com', 'wellandtribune.ca'];
var ke_nation_media_domains = ['businessdailyafrica.com', 'nation.africa'];
var medium_custom_domains = ['betterprogramming.pub', 'towardsdatascience.com'];
var no_dn_media_domains = ['dn.no', 'europower.no', 'fiskeribladet.no', 'hydrogeninsight.com', 'intrafish.com', 'intrafish.no', 'kystens.no', 'rechargenews.com', 'tradewindsnews.com', 'upstreamonline.com'];
var sg_sph_media_domains = ['businesstimes.com.sg', 'straitstimes.com'];
var uk_dmg_media_domains = ['dailymail.co.uk', 'mailonsunday.co.uk', 'thisismoney.co.uk'];
var uk_iconic_media_domains = ['scotsman.com', 'yorkshirepost.co.uk'];
var usa_arizent_custom_domains = ['accountingtoday.com', 'benefitnews.com', 'bondbuyer.com', 'dig-in.com', 'financial-planning.com', 'nationalmortgagenews.com'];
var usa_conde_nast_domains = ['architecturaldigest.com', 'bonappetit.com', 'cntraveler.com', 'epicurious.com', 'gq.com' , 'newyorker.com', 'vanityfair.com', 'vogue.co.uk', 'vogue.com', 'wired.com'];
var usa_craincomm_domains = ['360dx.com', 'adage.com', 'autonews.com', 'chicagobusiness.com', 'crainscleveland.com', 'crainsdetroit.com', 'crainsgrandrapids.com', 'crainsnewyork.com', 'european-rubber-journal.com', 'genomeweb.com', 'modernhealthcare.com', 'pionline.com', 'plasticsnews.com', 'precisionmedicineonline.com', 'rubbernews.com', 'tirebusiness.com', 'utech-polyurethane.com'];
var usa_gannett_domains = ['azcentral.com', 'cincinnati.com', 'commercialappeal.com', 'courier-journal.com', 'democratandchronicle.com', 'desmoinesregister.com', 'detroitnews.com', 'dispatch.com', 'freep.com', 'indystar.com', 'jacksonville.com', 'jsonline.com', 'knoxnews.com', 'news-press.com', 'northjersey.com', 'oklahoman.com', 'palmbeachpost.com', 'tennessean.com'];
var usa_hearst_comm_domains = ['ctpost.com', 'expressnews.com', 'houstonchronicle.com', 'nhregister.com', 'sfchronicle.com', 'statesman.com', 'timesunion.com'];
var usa_hearst_comm_mag_domains = ['oprahdaily.com', 'popularmechanics.com'];
var usa_lee_ent_domains = ['buffalonews.com', 'journalnow.com', 'journalstar.com', 'madison.com', 'nwitimes.com', 'omaha.com', 'richmond.com', 'stltoday.com', 'tucson.com', 'tulsaworld.com'];
var usa_mcc_domains = ['bnd.com', 'charlotteobserver.com', 'elnuevoherald.com', 'fresnobee.com', 'kansas.com', 'kansascity.com', 'kentucky.com', 'mcclatchydc.com', 'miamiherald.com', 'newsobserver.com', 'sacbee.com', 'star-telegram.com', 'thestate.com', 'tri-cityherald.com'];
var usa_mng_domains = ['bostonherald.com', 'denverpost.com', 'eastbaytimes.com', 'mercurynews.com', 'ocregister.com', 'pressenterprise.com', 'sandiegouniontribune.com', 'twincities.com'];
var usa_nymag_domains = ['curbed.com', 'grubstreet.com', 'nymag.com', 'thecut.com', 'vulture.com'];
var usa_outside_mag_domains = ["backpacker.com", "betamtb.com", "betternutrition.com", "cleaneatingmag.com", "climbing.com", "outsideonline.com", "oxygenmag.com", "skimag.com", "trailrunnermag.com", "triathlete.com", "vegetariantimes.com", "womensrunning.com", "yogajournal.com"];
var usa_penske_media_domains = ['billboard.com', 'rollingstone.com', 'sourcingjournal.com', 'sportico.com', 'variety.com', 'wwd.com'];
var usa_tribune_domains = ['baltimoresun.com', 'capitalgazette.com', 'chicagotribune.com', 'courant.com', 'dailypress.com', 'mcall.com', 'nydailynews.com', 'orlandosentinel.com', 'pilotonline.com', 'sun-sentinel.com'];

if (matchDomain('gitflic.ru')) {
  if (window.location.pathname.startsWith('/project/magnolia1234/bpc_uploads') && document.head) {
    let sheet = document.createElement('style');
    let path_short = window.location.pathname.replace('/project/magnolia1234/bpc_uploads', '');
    if (!path_short)
      sheet.innerText = 'div[data-cell-type="commit"], div[data-cell-type="date"] {display: none !important;} div[data-cell-type="filename"] {flex: 0 0 100% !important;}';
    else if (path_short.match(/^\/(blob|file)/))
      sheet.innerText = 'div.project-files-tree, div.project-files-list {flex: 0 0 50% !important; max-width: 50% !important;}';
    if (sheet.innerText)
      document.head.appendChild(sheet);
  }
}

if (matchDomain('medium.com') || matchDomain(medium_custom_domains) || document.querySelector('head > link[href*=".medium.com/"]')) {
  let url = window.location.href;
  let paywall = document.querySelector('article.meteredContent');
  if (paywall) {
    paywall.removeAttribute('class');
    let header = paywall.querySelector('h1');
    if (header)
      header.before(externalLink(['freedium.cfd', 'freedium-mirror.cfd', 'readmedium.com', 'archive.today'], 'https://{domain}/{url}', url, 'BPC > Try for full article text:'));
  }
  window.setTimeout(function () {
    let banner = pageContains('div > div > p', /author made this story available to/);
    if (banner.length)
      removeDOMElement(banner[0].parentNode.parentNode);
  }, 1000);
}

else if (window.location.hostname.match(/\.(au|nz)$/) || matchDomain(['afr.com'])) {//australia & new zealand

if (matchDomain('afr.com')) {
  let error = document.querySelector('div[data-testid="DefaultError"]');
  if (error)
    refreshCurrentTab();
  let article_sel = '#endOfArticle:not(:empty)';
  let article = document.querySelector(article_sel);
  if (!article) {
    article_sel = '#body-content';
    article = document.querySelector(article_sel);
  }
  if (article) {
    window.setTimeout(function () {
      let pars = article.querySelectorAll('p:not([class]), p[class*="-defaultWrapper"], figure:not(:empty)');
      let pagination = document.querySelector('div > span#pagination-top');
      if ((pars.length && pars.length < 5) || pagination) {
        if (pagination) {
          removeDOMElement(pagination.parentNode);
        } else {
          let loading = pageContains(article_sel + ' div', 'Loading...');
          removeDOMElement(...pars, ...loading);
        }
        let url = window.location.href.split(/[#\?]/)[0];
        fetch(url)
        .then(response => {
          if (response.ok) {
            response.text().then(html => {
              if (html.includes('__REDUX_STATE__=')) {
                try {
                  let json = JSON.parse(html.split('__REDUX_STATE__=')[1].split('};')[0].replace(/:undefined([,}])/g, ':0$1').replace(/new\sMap\(\[[^{]*\]\)/g, 0) + '}');
                  if (json) {
                    let placeholders;
                    function find_item(match, p1, offset, string) {
                      let placeholder_id = p1;
                      let result = '';
                      if (placeholder_id && placeholders[placeholder_id]) {
                        let item = placeholders[placeholder_id];
                        if (item.data) {
                          if (['linkArticle', 'linkExternal'].includes(item.type)) {
                            if (item.data.text) {
                              if (item.data.url)
                                result = '<a href="' + item.data.url + '"' + (item.data.newTab ? 'target="_blank"' : '') + '>' + item.data.text + '</a>';
                              else
                                result = item.data.text;
                            }
                          } else if (item.type === 'image') {
                            if (item.data.fileName) {
                              let credit = (item.data.credit && item.data.credit.trim()) || item.data.source;
                              result = '<figure><img src="https://static.ffx.io/images/w_960/' + item.data.fileName + '" style="width: 100%;"><figcaption>' + (item.data.caption ? item.data.caption : '') + (credit ? '<span style="font-weight: bold;">&nbsp;' + credit + '</span>' : '') + '</figcaption></figure>';
                            }
                          } else if (item.type === 'omny') {
                            if (item.data.src)
                              result = '<embed src="' + item.data.src + '/embed" style="width:100%" frameborder="0">';
                          } else if (item.type === 'youtube') {
                            if (item.data.url) {
                              if (item.data.url.includes('watch?v='))
                                result = '<iframe src="' + item.data.url.replace('watch?v=', 'embed/') + '" style="width: 100%; height: 400px;"></iframe>';
                              else
                                result = '<a href="' + item.data.url + '" target="_blank">' + item.data.url + '</a>';
                            }
                          } else if (['instagram', 'twitter'].includes(item.type)) {
                            if (item.data.url)
                              result = '<a href="' + item.data.url + '" target="_blank">' + item.data.url + '</a>';
                          } else if (item.type === 'iframe') {
                            if (item.data.url)
                              result = '<iframe src="' + item.data.url + '" style="width: 100%; height: 400px; border: none;"></iframe>';
                          } else if (!['callout', 'quote', 'relatedStory', 'video'].includes(item.type)) {
                            console.log(item);
                          }
                        }
                      }
                      return result;
                    }
                    let json_text = json.page.content.asset.body;
                    if (json_text) {
                      placeholders = json.page.content.asset.bodyPlaceholders;
                      if (placeholders)
                        json_text = json_text.replace(/<x-placeholder id="(\w+)"><\/x-placeholder>/g, find_item);
                      let parser = new DOMParser();
                      let doc = parser.parseFromString('<div>' + json_text + '</div>', 'text/html');
                      let content_new = doc.querySelector('div');
                      if (article_sel.startsWith('#endOfArticle')) {
                        let widget = document.querySelector('div[class$="-wrapper"] > div#WidgetContainer');
                        if (widget)
                          content_new.firstChild.before(widget.parentNode);
                        let author = article.querySelector('section[class$="-articleBylineToolsWrapper"]');
                        if (author)
                          content_new.firstChild.before(author);
                        article.parentNode.replaceChild(content_new, article);
                        window.setTimeout(function () {
                          content_new.id = 'endOfArticle';
                        }, 500);
                      } else
                        article.firstChild.before(content_new);
                      addStyle(article_sel + ' p {margin: 20px 0px;}');
                    } else {
                      let parser = new DOMParser();
                      let posts = json.page.content.asset.posts;
                      article.innerHTML = '';
                      for (let post of posts) {
                        let asset = post.asset;
                        if (asset && asset.body) {
                          let json_text = asset.body;
                          placeholders = asset.bodyPlaceholders;
                          if (placeholders)
                            json_text = json_text.replace(/<x-placeholder id="(\w+)"><\/x-placeholder>/g, find_item);
                          let doc = parser.parseFromString('<section>' + json_text + '</section>', 'text/html');
                          let par = doc.querySelector('section');
                          let header;
                          if (asset.headlines && asset.headlines.headline) {
                            header = document.createElement('h2');
                            header.innerText = asset.headlines.headline;
                            header.id = post.id;
                          }
                          let byline;
                          if (asset.byline) {
                            byline = document.createElement('p');
                            byline.innerText = asset.byline;
                            byline.style = 'margin-bottom: 24px;'
                          }
                          article.append(header, byline, par);
                        }
                      }
                      addStyle('section:not([class]) > p {margin: 24px 0px;}');
                      let key_posts = document.querySelectorAll('li > a[href*="?post="]');
                      for (let elem of key_posts)
                        elem.href = elem.href.replace('?post=', '#');
                    }
                  }
                } catch (err) {
                  console.log(err);
                }
              }
            });
          }
        }).catch(function (err) {
          false;
        });
      }
    }, 1000);
  }
}

else if (matchDomain('businessdesk.co.nz')) {
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    paywall.classList.remove('paywall');
    let signup_box = document.querySelector('div.signup-box-container');
    removeDOMElement(signup_box);
    let url = window.location.href.split(/[#\?]/)[0];
    fetch(url, {headers: {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"}})
    .then(response => {
      if (response.ok) {
        response.text().then(html => {
          let match = html.match(/:query="'([^"]+)'"/);
          if (match) {
            let parser = new DOMParser();
            let src_text = breakText(parseHtmlEntities(match[1])).replace(/\n\n/g, '<br><br>').replace(/\.([^\s\d]|&)/g, ". $1");
            let doc = parser.parseFromString('<div>' + src_text + '</div>', 'text/html');
            let content_new = doc.querySelector('div');
            paywall.innerHTML = '';
            paywall.appendChild(content_new);
          }
        })
      }
    })
  }
}

else if (matchDomain(['crikey.com.au', 'smartcompany.com.au', 'themandarin.com.au'])) {
  let paywall_sel = 'div[id^="pmc-zephr-"]';
  let paywall = document.querySelector(paywall_sel);
  if (paywall) {
    let article_sel = 'div.entry-content';
    let article = document.querySelector(article_sel);
    if (article) {
      getJsonUrl(paywall_sel, '', article_sel + ' > p');
      article.style['max-height'] = 'none';
    }
  }
  let ads = 'div.wp-block-pm-ad-placeholder-block, div[style*="linear-gradient"]';
  hideDOMStyle(ads);
}

else if (matchDomain('forbes.com.au')) {
  setCookie('blaize_session', '', 'forbes.com.au', '/', 0);
  getJsonUrl('div[class*="_gate"]', '', 'div.article-page__content-body');
  let fade = document.querySelector('div[style*="background-image: linear-gradient"]');
  removeDOMElement(fade);
}

else if (matchDomain('macrobusiness.com.au')) {
  let paywall = pageContains('div > p', 'The full text of this article is available');
  if (paywall[0]) {
    let fade = document.querySelector('div.bg-gradient-to-t');
    removeDOMElement(paywall[0].parentNode, fade);
    let json_script = document.querySelector('script#__NUXT_DATA__');
    if (json_script) {
      try {
        let json = JSON.parse(json_script.text);
        let json_text = json.filter(x => typeof x === 'string' && x.match(/(<|\\u003C)p>/))[0];
        if (json_text) {
          let parser = new DOMParser();
          let doc = parser.parseFromString('<div>' + json_text + '</div>', 'text/html');
          let content_new = doc.querySelector('div');
          let article = document.querySelector('div.content');
          if (article) {
            article.innerHTML = '';
            article.appendChild(content_new);
          }
        } else
          refreshCurrentTab();
      } catch (err) {
        console.log(err);
      }
    }
  }
}

else if (matchDomain('nzherald.co.nz')) {
  // use bpc adblocker filter
  let premium_toaster = '#premium-toaster';
  hideDOMStyle(premium_toaster);
}

else if (matchDomain('thesaturdaypaper.com.au')) {
  let hide_end = document.querySelector('div.hide-end');
  if (hide_end)
    refreshCurrentTab();
  let paywall = document.querySelector('div.paywall-hard-always-show');
  removeDOMElement(paywall);
}

else if (matchDomain(['brisbanetimes.com.au', 'smh.com.au', 'theage.com.au', 'watoday.com.au'])) {
  if (!window.location.hostname.startsWith('amp.')) {
    amp_redirect('head > meta[content^="FOR SUBSCRIBERS"], #paywall_prompt');
  } else {
    amp_unhide_subscr_section();
  }
}

else {
  // Australian Community Media newspapers
  let au_comm_media_domains = ['bendigoadvertiser.com.au', 'bordermail.com.au', 'canberratimes.com.au', 'centralwesterndaily.com.au', 'dailyadvertiser.com.au', 'dailyliberal.com.au', 'examiner.com.au', 'illawarramercury.com.au', 'newcastleherald.com.au', 'northerndailyleader.com.au', 'standard.net.au', 'theadvocate.com.au', 'thecourier.com.au', 'westernadvocate.com.au'];
  if (matchDomain(au_comm_media_domains) || document.querySelector('div#footer a[href^="https://acm.media/"]')) {
    let mask = document.querySelector('div[class^="gradient-mask-"]');
    if (mask) {
      mask.removeAttribute('class');
      let div_hidden = document.querySelectorAll('div.flex-col div.hidden');
      for (let elem of div_hidden)
        elem.classList.remove('hidden');
    } else {
      let subscribe_truncate = document.querySelector('.subscribe-truncate');
      if (subscribe_truncate)
        subscribe_truncate.classList.remove('subscribe-truncate');
      let subscriber_hiders = document.querySelectorAll('.subscriber-hider');
      for (let subscriber_hider of subscriber_hiders)
        subscriber_hider.classList.remove('subscriber-hider');
    }
    let noscroll = document.querySelectorAll('html[style], body[style]');
    for (let elem of noscroll)
      elem.removeAttribute('style');
    let story_generic_iframe = '.story-generic__iframe';
    let blocker = 'div.blocker';
    let overlays = 'div.transition-all, div[id^="headlessui-dialog"]';
    let ads = '.ad-placeholder, .sticky, [id*="-container"], #hindsight-ads-iframe, div.vf3-conversations-list__promo, div#tbl-next-up, iframe[data-ad-id]';
    hideDOMStyle(story_generic_iframe + ', ' + blocker + ', ' + overlays + ', ' + ads);
  } else if (window.location.hostname.endsWith('.com.au')) {
    // Australia News Corp
    let au_news_corp_domains = ['adelaidenow.com.au', 'cairnspost.com.au', 'codesports.com.au', 'couriermail.com.au', 'dailytelegraph.com.au', 'geelongadvertiser.com.au', 'goldcoastbulletin.com.au', 'heraldsun.com.au', 'ntnews.com.au', 'theaustralian.com.au', 'thechronicle.com.au', 'themercury.com.au', 'townsvillebulletin.com.au', 'weeklytimesnow.com.au'];
    if (matchDomain(au_news_corp_domains)) {
      let url = window.location.href;
      if (window.location.pathname.startsWith('/subscribe/') && !url.includes('/digitalprinteditions')) {
        let og_url = document.querySelector('head > meta[property="og:url"][content]');
        if (og_url) {
          let og_url_obj = new URL(decodeURIComponent(og_url.content));
          let url_new = og_url_obj.origin + '/' + og_url_obj.pathname.replace(/^\//, '').replace(/\//g, '%2F');
          window.setTimeout(function () {
            window.location.href = url_new;
          }, 500);
        }
      } else if (window.location.search.match(/[&\?]amp/)) {
        amp_unhide_subscr_section('[id^="ad-mrec-"]', false);
        let figure_stretch = document.querySelectorAll('figure.stretch');
        for (let elem of figure_stretch)
          elem.classList.remove('stretch');
        let comments = document.querySelector('#comments-load, .comments-module');
        removeDOMElement(comments);
      } else {
        if (window.location.pathname.includes('/video/') && document.querySelector('div.vms-premium-video'))
          header_nofix('div.video-hub');
        let ads = '.header_ads-container, .ad-block';
        hideDOMStyle(ads);
      }
    } else {
      // Australian Seven West Media
      if (matchDomain('thewest.com.au') || document.querySelector('head > link[href="https://images.thewest.com.au"]')) {
        function thewest_main(node) {
          let filter = /^window\.PAGE_DATA\s?=\s?/;
          let json_script = getSourceJsonScript(filter);
          if (json_script) {
            let json_text = json_script.text.split(filter)[1];
            json_text = json_text.replace(/:undefined([,}])/g, ':"undefined"$1');
            try {
              let json_article = JSON.parse(json_text);
              let json_pub;
              for (let key in json_article) {
                let json_resolution = json_article[key].data.result.resolution;
                if (json_resolution && json_resolution.publication) {
                  json_pub = json_resolution.publication;
                  break;
                }
              }
              let json_content = [];
              let url_loaded;
              if (json_pub) {
                json_content = json_pub.content.blocks;
                url_loaded = json_pub._self;
              } else
                refreshCurrentTab();
              //let json_video = json_pub.mainVideo;
              let url = window.location.href;
              if (!url_loaded || !url.includes(url_loaded.slice(-10)))
                refreshCurrentTab();
              let par_elem, par_sub1, par_sub2;
              let par_dom = document.createElement('div');
              let tweet_id = 1;
              for (let par of json_content) {
                par_elem = '';
                if (par.kind === 'text') {
                  par_elem = document.createElement('p');
                  par_elem.innerText = par.text;
                } else if (par.kind === 'subhead') {
                  par_elem = document.createElement('h2');
                  par_elem.innerText = par.text;
                } else if (par.kind === 'pull-quote') {
                  par_elem = document.createElement('i');
                  par_elem.innerText = (par.attribution ? par.attribution + ': ' : '') + par.text;
                } else if (par.kind === 'embed') {
                  if (par.reference.includes('https://omny.fm/') || par.reference.includes('https://docdro.id/')) {
                    par_elem = document.createElement('embed');
                    par_elem.src = par.reference;
                    par_elem.style = 'height:500px; width:100%';
                    par_elem.frameborder = '0';
                  } else {
                    par_elem = document.createElement('a');
                    par_elem.href = par.reference;
                    par_elem.innerText = par.reference.split('?')[0];
                  }
                } else if (par.kind === 'unordered-list') {
                  if (par.items) {
                    par_elem = document.createElement('ul');
                    for (let item of par.items)
                      if (item.text) {
                        par_sub1 = document.createElement('li');
                        if (item.intentions[0] && item.intentions[0].href) {
                          par_sub2 = document.createElement('a');
                          par_sub2.href = item.intentions[0].href;
                        } else {
                          par_sub2 = document.createElement('span');
                        }
                        par_sub2.innerText = item.text;
                        par_sub1.appendChild(par_sub2);
                        par_elem.appendChild(par_sub1);
                      }
                  }
                } else if (par.kind === 'inline') {
                  if (par.asset.kind === 'image' && par.asset.original && par.asset.original.reference) {
                    par_elem = makeFigure(par.asset.original.reference, par.asset.captionText, {style: 'width:100%'});
                  }
                } else if (par.kind === 'inline-related') {
                  par_elem = document.createElement('p');
                  if (par.publications) {
                    for (let elem of par.publications) {
                      let par_link = document.createElement('a');
                      par_link.href = elem._self;
                      par_link.innerText = elem.heading;
                      par_elem.appendChild(par_link);
                      par_elem.appendChild(document.createElement('br'));
                    }
                  }
                } else {
                  par_elem = document.createElement('p');
                  par_elem.innerText = par.text;
                  console.log(par.kind);
                }
                if (par_elem)
                  par_dom.appendChild(par_elem);
              }
              let content = document.querySelector('div[class*="StyledArticleContent"]');
              if (content) {
                content.innerHTML = '';
                content.appendChild(par_dom);
              } else {
                par_dom.setAttribute('style', 'margin: 20px;');
                node.before(par_dom);
              }
            } catch (err) {
              console.log(err);
            }
          }
          removeDOMElement(node);
        }
        let paywall_sel = 'div.paywall div[data-testid*="BreachScreen"], div[class*="StyledBreachWallContent"]';
        let paywall = document.querySelector(paywall_sel);
        if (paywall)
          thewest_main(paywall);
        waitDOMElement(paywall_sel, 'DIV', thewest_main, true);
        let ads = 'div.headerAdvertisement, div.disabled-ad, div.ad-no-notice';
        hideDOMStyle(ads);
      } else if (document.querySelector('head > link[rel="dns-prefetch"][href="//static.ew.mmg.navigacloud.com"]')) { // McPherson Media Group
        let paywall = document.querySelector('div#content-Load-message');
        if (paywall) {
          removeDOMElement(paywall);
          let lockable = document.querySelectorAll('div[id^="lockable-"]');
          for (let elem of lockable) {
            elem.removeAttribute('style');
            elem.removeAttribute('id');
          }
          let gradient = document.querySelector('div.gradienttext');
          if (gradient)
            gradient.removeAttribute('class');
        }
      }
    }
  }
}

} else if ((window.location.hostname.match(/\.(ie|uk)$/) && !matchDomain(['vogue.co.uk'])) || matchDomain(['autosport.com', 'decanter.com', 'fnlondon.com', 'ft.com', 'gbnews.com', 'granta.com', 'iai.tv', 'irishexaminer.com', 'motorsportmagazine.com', 'newstatesman.com', 'scotsman.com', 'tes.com', 'the-tls.com', 'thelawyer.com', 'thetimes.com', 'unherd.com'])) {//united kingdom/ireland

if (matchDomain('autocar.co.uk')) {
  let paywall = document.querySelector('div.ms-block, div.register-block');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = json.articleBody;
        let article = document.querySelector('div.block-node');
        if (json_text && article) {
          article.innerHTML = '';
          let article_new = document.createElement('p');
          article_new.innerText = json_text;
          let fade = document.querySelector('div.article-section > div[style*="max-height"]');
          removeDOMElement(fade);
          let url = window.location.href;
          article.append(article_new, 'Text-only > for missing media/links: ', googleSearchToolLink(url));
        }
      }
    }
  }
  let ads = 'div[class*="-ads-"]';
  hideDOMStyle(ads);
}

else if (matchDomain('autosport.com')) {
  header_nofix('div.ms-article-content > p', 'div.ms-piano_article-banner');
}

else if (matchDomain(['belfasttelegraph.co.uk', 'independent.ie'])) {
  let paywall = document.querySelector('div[class*="_fadetowhite"]');
  if (paywall) {
    let content = document.querySelector('script[data-fragment-type="ArticleContent"]');
    if (content) {
      removeDOMElement(paywall);
      let flip_pay = 'div#flip-pay';
      hideDOMStyle(flip_pay, 5);
      let intro = document.querySelector('div > div[data-auth-intro="article"]');
      if (intro) {
        let intro_par = intro.querySelector('p[class]');
        let intro_par_class;
        if (intro_par)
          intro_par_class = intro_par.getAttribute('class');
        let content_text = content.innerText;
        if (content_text.includes('__PRELOADED_STATE_GRAPH')) {
          content_text = content_text.replace(/window\["__PRELOADED_STATE_GRAPH__.+"\]\s=\s/, '');
          try {
            let json = JSON.parse(content_text);
            if (Object.keys(json).length) {
              let key = Object.keys(json)[0];
              let pars = json[key].data.article.body;
              let parser = new DOMParser();
              for (let par of pars) {
                for (let type in par) {
                  let item = par[type];
                  let elem = document.createElement('p');
                  elem.setAttribute('style', "margin: 10px;");
                  if (type === 'bullet_list') {
                    let ul = document.createElement('ul');
                    for (let sub_item of item) {
                      li.innerText = parseHtmlEntities(sub_item.replace(/<[^<]*>/g, ''));
                      li.innerText = sub_item;
                      ul.appendChild(li);
                    }
                    elem.appendChild(ul);
                  } else if (type === 'image') {
                    let url = item.url;
                    if (item.cropped && item.cropped.url)
                      url = item.cropped.url;
                    let figure = makeFigure(url, item.caption);
                    elem.appendChild(figure);
                  } else if (type === 'related') {
                    if (item.articles) {
                      let articles = item.articles;
                      for (let article of articles) {
                        let elem_link = document.createElement('a');
                        elem_link.href = article.webcmsRelativeUrl;
                        elem_link.innerText = article.title;
                        elem_link.style = 'text-decoration: underline;';
                        elem.append(elem_link, document.createElement('br'));
                      }
                    }
                  } else if (!['ad', 'quote', 'streamone'].includes(type)) {
                    let html = parser.parseFromString('<p class="' + intro_par_class + '">' + item + '</p>', 'text/html');
                    elem = html.querySelector('p');
                    elem.querySelectorAll('iframe[allow*="fullscreen"][allowfullscreen]').forEach(e => e.removeAttribute('allowfullscreen'));
                    if (!['p', 'subhead', 'legacy-ml'].includes(type)) {
                      console.log(type);
                      console.log(item);
                    }
                  }
                  window.setTimeout(function () {
                    if (elem)
                      intro.parentNode.appendChild(elem);
                  }, 500);
                }
              }
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  }
  let ads = 'div.ad';
  hideDOMStyle(ads);
}

else if (matchDomain('businesspost.ie')) {
  func_post = function () {
    if (mobile) {
      let lazy_images = document.querySelectorAll('div[style] > img[loading="lazy"][style]');
      for (let elem of lazy_images) {
        elem.style = 'width: 95%;';
        elem.parentNode.removeAttribute('style');
      }
    }
  }
  let url = window.location.href;
  getArchive(url, 'div#bp_piano_article_subscription_offer', '', 'div[itemprop="articleBody"]');
  let ads = 'div[id^="Inline-MPU-article-"]';
  hideDOMStyle(ads);
}

else if (matchDomain('decanter.com')) {
  let paywall = document.querySelector('div[id^="react_subscriber_content_"]');
  if (paywall) {
    removeDOMElement(paywall);
    let data = document.querySelector('div[data-dom-id^="react_subscriber_content_"][data-props]');
    if (data) {
      try {
        let json = JSON.parse(data.getAttribute('data-props'));
        if (json && json.content) {
          let content = decode_utf8(atob(json.content));
          let parser = new DOMParser();
          let doc = parser.parseFromString('<div>' + content + '</div>', 'text/html');
          let content_new = doc.querySelector('div');
          data.before(content_new);
          header_nofix('div.collection-wrapper', '', 'BPC > no fix for reviews');
          let fade = 'div.piano-container-fade';
          hideDOMStyle(fade);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
}

else if (matchDomain('fnlondon.com')) {
  let paywall = document.querySelector('div#cx-snippet');
  if (paywall) {
    removeDOMElement(paywall);
    window.setTimeout(function () {
      let article_sel = 'article section';
      let article = document.querySelector(article_sel);
      if (article) {
        addStyle(article_sel + ' p {margin: 20px 0px !important;}');
        let article_id_dom = document.querySelector('head > meta[name="article.id"][content]');
        if (article_id_dom) {
          let article_id = article_id_dom.content;
          let url_src = 'https://fn.djmedia.djservices.io/apps/finnews/theaters/default-article?screen_ids=' + article_id;
          let x_access_token = cs_param['x-access-token'] || "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJBVVRIX1BIUkFTRV9QUk9EX0lPUyI6IlZlRXRaemRIaGF4bzhKRWpzaHlEIn0.bxWGVMaft1RN0_qWAnzoNBLx12sc0Jt4rLBaoG5n08AQTS9RibwlJlZrqUca_tm0lSCwl3Z1ehJcVepVH_YcNgRJsujt49JVFSGBO8B69zFDERS05x2RM_n0k8Jg9cyErhfsgWTsb8ObR6iRhHmw702_VcEzJrmdXwq44Bw3NgkBPOgIAZn37SA7hx__gvd8Hdxd5LLgZwxXTG1kWFW4S--vf4CxUt-uEY94m1VqaUyyMTEMvXTmktS2wReBH8mawDvBdyBDkQrPx7oaFP1zq4h-B1mQCj_wMRfR-QUls6BTpBPQUjO02FaTf-2RbHzAYn3xTpmxs0GE12iD4QBSbg";
          getExtFetch(url_src, '', {"app-identifier": "com.news.screens", "device-type": "phone", "x-access-token": x_access_token}, fix_dowjones_fetch, data_ext_fetch_id++, [article]);
        }
      }
    }, 1000);
  }
  function fnlondon_main(node) {
    window.setTimeout(function () {
      let signin_links = node.querySelectorAll('a[href^="https://www.fnlondon.com/client/login"][href*="target="]');
      for (let elem of signin_links) {
        elem.href = '#'; //decodeURIComponent(elem.href.split('target=')[1].split('&')[0]);
        elem.innerText = 'Open';
        elem.addEventListener('click', function () { window.location.reload(); });
      }
    }, 500);
  }
  waitDOMElement('div[id^="continuous_article_"]', 'DIV', fnlondon_main, true);
  let ads = 'div.grid__rail_top';
  hideDOMStyle(ads);
}

else if (matchDomain('ft.com')) {
  func_post = function () {
    let lazy_images = document.querySelectorAll('figure > picture > img[loading="lazy"][src^="data:image/gif"][new-cursrc]');
    for (let elem of lazy_images) {
      elem.removeAttribute('loading');
      elem.style = 'width: 100%;';
      let figure = elem.parentNode.parentNode;
      if (figure.parentNode && figure.parentNode.nodeName === 'DIV')
        figure.parentNode.removeAttribute('style');
      elem.src = elem.getAttribute('new-cursrc');
    }
    if (mobile) {
      let grids = document.querySelectorAll('div[style*="grid-template-areas"], article#site-content');
      for (let elem of grids)
        elem.style = 'margin: 10px;';
    }
  }
  let url = window.location.href;
  getArchive(url, 'div#barrier-page', '', 'div.n-layout__row--content', '', 'div[style*="article-body"]', 'body');
  let banners = '.js-article-ribbon, div.o-ads, pg-slot';
  hideDOMStyle(banners);
}

else if (matchDomain('gbnews.com')) {
  let ads = 'div.ad--billboard, div.ad--placeholder, div.video-inbody';
  hideDOMStyle(ads);
}

else if (matchDomain('granta.com')) {
  getJsonUrl('div.article-sign-up-container', '', 'div.article-excerpt');
}

else if (matchDomain('iai.tv')) {
  let paywall = document.querySelector('div.article-paywall-main');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div > div.iai-article--content-inner');
    if (article) {
      let content_new = document.querySelector('head > meta[name="twitter:description"][content]');
      if (content_new) {
        let parser = new DOMParser();
        let doc = parser.parseFromString('<div>' + content_new.content + '</div>', 'text/html');
        let article_new = doc.querySelector('div');
        article.parentNode.replaceChild(article_new, article);
      }
    }
  }
}

else if (matchDomain('irishexaminer.com')) {
  setCookie('blaize_session', '', 'irishexaminer.com', '/', 0);
  let premium = document.querySelector('head > meta[name="isPremium"][content="true"]');
  let article = document.querySelector('article');
  if (premium && article) {
    removeDOMElement(premium);
    function stripAppLinks(story) {
      story.querySelectorAll('a.readmore-event[href$="?type=app"]').forEach(e => e.href = e.href.split('?')[0]);
    }
    let url = window.location.href;
    let app = window.location.search.startsWith('?type=app');
    if (!app) {
      let paywall = document.querySelector('div#paywall-premium');
      if (paywall) {
        let body_hide = article.querySelector('style:not(:empty)');
        removeDOMElement(paywall, body_hide);
        let url_src = url.split(/[#\?]/)[0] + '?type=app';
        let story = article.querySelector('story');
        if (story) {
          let podcast = article.querySelector('.bbw-embed');
          if (!podcast) {
            fetch(url_src)
            .then(response => {
              if (response.ok) {
                response.text().then(html => {
                  if (html.includes('<story')) {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(html, 'text/html');
                    let story_new = doc.querySelector('story');
                    if (story_new) {
                      stripAppLinks(story_new);
                      story.parentNode.replaceChild(story_new, story);
                    }
                  }
                });
              }
            });
          } else
            window.location.href = url_src;
        } else
          window.location.href = url_src;
      }
    } else {
      let longread = document.querySelector('head > meta[name="isLongRead"][content="true"]');
      if (longread) {
        removeDOMElement(longread);
        let row = article.querySelector('div.row');
        if (row)
          row.append(googleSearchToolLink(url.split('?')[0]));
      } else {
        let div = document.createElement('div');
        div.style.margin = '20px';
        let home = document.createElement('a');
        home.innerText = window.location.hostname;
        home.href = 'https://' + window.location.hostname;
        div.append(home);
        article.before(div);
        let story = article.querySelector('story');
        if (story)
          stripAppLinks(story);
        hideDOMStyle('.bbw-embed');
      }
    }
  }
}

else if (matchDomain('literaryreview.co.uk')) {
  getJsonUrl('p.subscribe-for-more', '', 'div#_articlereview');
}

else if (matchDomain('motorsportmagazine.com')) {
  getJsonUrl('aside.paywall', '', 'div[data-behaviour="post-content"]');
  let banner = document.querySelector('div[data-behaviour="react-paywall-threshold"]');
  removeDOMElement(banner);
  let ads = 'aside.ad-space';
  hideDOMStyle(ads);
}

else if (matchDomain('newstatesman.com')) {
  let ads = 'div.ad';
  hideDOMStyle(ads);
}

else if (matchDomain('observer.co.uk')) {
  let ads = 'div._minH-50px:has(> div#landing-top)';
  hideDOMStyle(ads);
}

else if (matchDomain('stylist.co.uk')) {
  let paywall = document.querySelector('div[data-testid="paywall-component"]');
  if (paywall) {
    removeDOMElement(paywall);
    let paywall_inline = document.querySelector('div.paywall--inline');
    if (paywall_inline)
      paywall_inline.removeAttribute('class');
    let json_script = document.querySelector('script#__NEXT_DATA__');
    if (json_script) {
      try {
        let json = JSON.parse(json_script.text);
        if (json.props.pageProps.data.post.acf.widgets) {
          let url_next = json.props.pageProps.data.post.id;
          if (url_next && !window.location.pathname.endsWith(url_next))
            refreshCurrentTab();
          let pars = json.props.pageProps.data.post.acf.widgets;
          let first_par = document.querySelector('main div[data-column="true"] > p');
          if (first_par) {
            let article = first_par.parentNode;
            let teaser = article.querySelectorAll('div > p:not([class])');
            removeDOMElement(...teaser);
            if (article) {
              let parser = new DOMParser();
              for (let par of pars) {
                let elem = document.createElement('p');
                if (par.paragraph) {
                  let content = par.paragraph;
                  let content_new = parser.parseFromString('<div>' + content + '</div>', 'text/html');
                  elem = content_new.querySelector('div');
                } else if (par.acf_fc_layout === 'heading') {
                  if (par.text)
                    elem.appendChild(document.createTextNode(par.text));
                } else if (['image', 'interactive_image'].includes(par.acf_fc_layout)) {
                  let image_array = [];
                  if (par.image)
                    image_array = [par.image];
                  else if (par.image_collection)
                    image_array = par.image_collection;
                  for (let img_elem of image_array) {
                    let figure = makeFigure(img_elem.url, img_elem.caption ? (img_elem.caption + ' ' + img_elem.description) : img_elem.alt, {alt: img_elem.alt, style: 'width: 95%;'});
                    elem.appendChild(figure);
                  }
                } else if (par.acf_fc_layout === 'listicle') {
                  let ul = document.createElement('ul');
                  for (let sub_item of par.item) {
                    let li = document.createElement('li');
                    if (sub_item.url) {
                      let par_link = document.createElement('a');
                      par_link.href = sub_item.url;
                      par_link.innerText = sub_item.title;
                      par_link.target = '_blank';
                      li.appendChild(par_link);
                    } else
                      li.innerText = sub_item.title;
                    if (sub_item.paragraph) {
                      let content = sub_item.paragraph;
                      let content_new = parser.parseFromString('<div>' + content + '</div>', 'text/html');
                      let par_elem = content_new.querySelector('div');
                      li.appendChild(par_elem);
                    }
                    if (sub_item.image) {
                      let img = document.createElement('img');
                      img.src = sub_item.image.url;
                      img.alt = sub_item.image.alt;
                      img.style = 'width: 95%;';
                      li.appendChild(img);
                      li.appendChild(document.createElement('br'));
                    }
                    li.style = 'font-size: 20px; margin: 20px 0px;';
                    ul.appendChild(li);
                  }
                  elem.appendChild(ul);
                } else if (par.embed_link) {
                  let par_link = document.createElement('a');
                  par_link.href = par.embed_link;
                  par_link.innerText = 'Embedded link: ' + par.embed_link;
                  par_link.target = '_blank';
                  elem.appendChild(par_link);
                } else if (par.acf_fc_layout === 'divider') {
                  elem.appendChild(document.createElement('hr'));
                } else if (par.acf_fc_layout === 'related_articles') {
                  if (par.posts) {
                    for (let post of par.posts) {
                      if (post.link && post.title.rendered) {
                        let par_link = document.createElement('a');
                        par_link.href = post.link;
                        par_link.innerText = 'You may also like: ' + post.title.rendered;
                        elem.appendChild(par_link);
                        elem.appendChild(document.createElement('br'));
                      }
                    }
                  }
                } else if (!['newsletter_signup', 'pull-quote'].includes(par.acf_fc_layout))
                  console.log(par);
                if (elem.hasChildNodes()) {
                  elem.style = 'font-family: "Source Serif Pro"; font-size: 20px; line-height: 34px;';
                  article.appendChild(elem);
                }
              }
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
}

else if (matchDomain('telegraph.co.uk')) {
  let subwall = '[class^="subwall"]';
  let ads = '.advert, .commercial-unit';
  hideDOMStyle(subwall + ', ' + ads);
}

else if (matchDomain('tes.com')) {
  let paywall = document.querySelector('div.tg-paywall-message');
  if (paywall) {
    removeDOMElement(paywall);
    let overlay = document.querySelector('div.tg-paywall-body-overlay');
    if (overlay)
      overlay.removeAttribute('class');
  }
  let banner = document.querySelector('div.js-paywall-info');
  removeDOMElement(banner);
}

else if (matchDomain('the-tls.com')) {
  getJsonUrl('div.tls-single-article__closed-paywall', '', 'div.tls-article-body', {art_class: 'tls-article-body'});
  let fade = 'div.tls-single-article__closed-paywall-wrapper';
  let ads = 'div[class*="tls-single-article__ad-slot"]';
  hideDOMStyle(fade + ', ' + ads);
}

else if (matchDomain('thelawyer.com')) {
  if (window.location.pathname.startsWith('/mda/')) {
    header_nofix('div.sf-content__post', 'div.sf-login-form');
  } else if (true) {
    let body = document.querySelector('body[class*="postid-"]');
    if (body) {
      let article_id = body.className.split('postid-')[1].split(' ')[0];
      if (article_id) {
        func_post = function () {
          let lazy_images = document.querySelectorAll('img.lazy[data-src]:not([src])');
          for (let elem of lazy_images) {
            elem.src = elem.getAttribute('data-src');
            elem.removeAttribute('class');
          }
        }
        getJsonUrl('div.sf-login-form', '', 'div.sf-content-body__text', {art_append: 1}, article_id, '', false, true);
      }
    }
  }
}

else if (matchDomain('thenewworld.co.uk')) {
  let paywall = document.querySelector('div[data-show-fade-on-noaccess]');
  if (paywall) {
    removeDOMElement(paywall);
    let content = document.querySelector('div[data-show-has-access]');
    if (content)
      content.removeAttribute('data-show-has-access');
  }
  let banners = document.querySelectorAll('div[data-show-subs-blocked]');
  removeDOMElement(...banners);
}

else if (matchDomain('thenewslens.com')) {
  let paywall = document.querySelector('div.article-mask-box');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = json.articleBody;
        let article = document.querySelector('section.article-body');
        if (json_text && article) {
          let article_text = article.innerText.replace(/\n/g, '');
          let split = json_text.split('。');
          for (let elem of split) {
            if (!elem.includes('(function(') && !article_text.includes(elem)) {
              let par_new = document.createElement('p');
              par_new.innerText = elem + '。';
              article.append(par_new);
            }
          }
        }
      }
    }
  }
}

else if (matchDomain('thestage.co.uk')) {
  func_post = function () {
    let paywall = document.querySelector(paywall_sel);
    if (paywall) {
      removeDOMElement(paywall);
      let article = document.querySelector(article_sel);
      if (article)
        article.before(googleSearchToolLink(url));
    }
  }
  let paywall_sel = 'div#ao-MeteringDNAllow';
  let article_sel = 'div[id^="aos-FeatureArticle2Col-"], div[id^="aos-ReviewArticle-"]';
  let url = window.location.href;
  getArchive(url, paywall_sel, '', article_sel);
}

else if (matchDomain(['thesun.co.uk', 'thescottishsun.co.uk'])) {
  let ads = 'div.billboard, div.advert-wrapper';
  hideDOMStyle(ads);
}

else if (matchDomain('thetimes.com')) {
  if (!matchDomain('epaper.thetimes.com')) {
    func_post = function () {
      let article = document.querySelector(article_sel);
      if (article) {
        if (mobile) {
          let inline_images = article.querySelectorAll('img[style]');
          for (let elem of inline_images) {
            elem.style = 'display: block; margin-left: auto; margin-right: auto; width: 90%;';
            let parent_node = elem.parentNode;
            if (parent_node.tagName === 'PICTURE')
              parent_node = parent_node.parentNode;
            parent_node.removeAttribute('style');
          }
          article.querySelectorAll('div[style*=";width:"]').forEach(e => e.style.width = '90%');
          let author = document.querySelector(article_sel + ' div[style^="min-height:"]:has(a[href^="https://www.thetimes.com/profile/"])');
          if (author)
            author.style = 'width: 90%; margin: 20px;';
        }
        let embed_iframes = article.querySelectorAll('div > times-embed-iframe-max[src]');
        for (let elem of embed_iframes) {
          let iframe_new;
          let iframe_src = elem.getAttribute('src');
          if (iframe_src.startsWith('https://youtube.com/')) {
            iframe_new = document.createElement('iframe');
            iframe_new.src = iframe_src;
            iframe_new.style = 'width: 100%; aspect-ratio: 16 / 9; border: none;';
          } else if (iframe_src.startsWith('https://www.tiktok.com/')) {
            iframe_new = document.createElement('iframe');
            iframe_new.src = iframe_src;
            iframe_new.style = 'width: 400px; aspect-ratio: 1 / 2; border: none;';
          } else if (iframe_src.startsWith('https://embed.acast.com/')) {
            iframe_new = document.createElement('iframe');
            iframe_new.src = iframe_src;
            iframe_new.style = 'width: 100%; border: none;';
          } else {
            iframe_new = document.createElement('a');
            iframe_new.href = iframe_new.innerText = iframe_src;
            iframe_new.target = '_blank';
          }
          elem.parentNode.parentNode.replaceChild(iframe_new, elem.parentNode);
        }
      }
    }
    let article_sel = 'article[id]';
    if (!window.location.search.startsWith('?shareToken=')) {
      let teaser = document.querySelector('body[data-view-name="teaser-article"]');
      if (teaser) {
        teaser.classList.remove('TeaserPage');
        let url = window.location.href;
        getArchive(url, 'div#paywall-portal-article-footer', '', article_sel);
        let scroll_style = 'html, body {overflow: auto !important;}';
        addStyle(scroll_style);
      }
    }
    let banners = 'div#paywall-portal-page-footer, .subscription-block';
    let ads = 'div.channel-header-ad, div[id^="advert-"], div[class*="InlineAdWrapper"], div:has(> div > div#ad-header), div[style*="border-bottom-color:"]:has(> div > div[id^="ad-article-inline"])';
    hideDOMStyle(banners + ', ' + ads);
  }
}

else if (matchDomain('unherd.com')) {
  let preview = document.querySelector('div#premiumpreview');
  if (preview) {
    removeDOMElement(preview);
    let premium = document.querySelector('div#premiumcontent');
    if (premium)
      premium.removeAttribute('id');
  }
}

else if (matchDomain(uk_dmg_media_domains)) {
  let paywall = document.querySelector('body.is-paywalled-article');
  if (paywall)
    paywall.classList.remove('is-paywalled-article');
  let ads = 'ad-slot, div.billboard-container';
  hideDOMStyle(ads);
}

else if (matchDomain(uk_iconic_media_domains) || document.querySelector('footer a[href^="https://www.mediaconcierge.co.uk"]')) {
  let premium = document.querySelector('div.premium.no-entitlement');
  if (premium)
    premium.classList.remove('premium', 'no-entitlement');
  let ads = 'div[class^="MarkupAds__Container-"], div[class*="_AdContainer-"], div[class^="Dailymotion__Wrapper-"], div.banner, div#mantis-carousel-wrapper:has( > mantis-ui-widget:empty)';
  hideDOMStyle(ads);
}

} else {

if (matchDomain(usa_adv_local_domains)) {
  if (!window.location.search.startsWith('?outputType=amp')) {
    document.querySelectorAll('.article__paragraph--blur').forEach(e => e.classList.remove('article__paragraph--blur'));
    amp_redirect('div.paywall', '', window.location.pathname + '?outputType=amp');
  }
  let ads = 'div.ad, div.ad-inner, div.ad-unit, div#below-toprail, div[id^="taboola"]';
  hideDOMStyle(ads);
}

else if (matchDomain('adweek.com')) {
  setCookie('blaize_session', '', '.www.adweek.com', '/', 0);
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let fade = 'div.adw-article-body div[style*="linear-gradient"]';
    hideDOMStyle(fade);
    let article = document.querySelector('div.non-paywall');
    if (article) {
      let json_script = getArticleJsonScript();
      if (json_script) {
        try {
          let json = JSON.parse(json_script.text);
          if (json && json.sharedContent) {
            let json_text = json.sharedContent.articleBody;
            if (json_text.match(/\[[^\[]+]/)) {
              let url = window.location.href;
              article.after(googleSearchToolLink(url));
              header_nofix('div#bpc_archive', '', 'BPC > no fix (missing (social) media)');
            }
            json_text = json_text.replace(/\[[^\[]+]/g, '').replace(/((\r)?\n)+/g, '\r\n\r\n');
            if (json_text)
              article.innerText = json_text;
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
}

else if (matchDomain('ajc.com')) {
  let paygate = document.querySelector('div.story-paygate_placeholder');
  if (paygate)
    paygate.removeAttribute('class');
  else {
    let article_paywall = document.querySelectorAll('article.is-paywalled');
    if (article_paywall.length) {
      let intro_len = document.querySelectorAll('article:not(.is-paywalled) > p').length;
      let art_pars = document.querySelectorAll('article.is-paywalled > p');
      article_paywall.forEach(e => e.classList.remove('is-paywalled'));
      let scripts = document.querySelectorAll('script:not([src], [type])');
      let json_script;
      let script_start = 'self.__next_f.push([1,"';
      for (let script of scripts) {
        if (script.text.startsWith(script_start)) {
          if (script.text.includes('{\\"contentData\\":')) {
            json_script = script;
            break;
          }
        }
      }
      if (json_script) {
        let json_pars_text = json_script.text.split('{\\"contentData\\":')[1].split(',\\"contentMeta\\":{')[0].replace(/\\"/g, '"').replace(/\\\"/g, '\"');
        try {
          let json_pars = JSON.parse(json_pars_text).content_elements.filter(e => e.type === 'text' && e.content);
          let par_nr = intro_len;
          for (let par of art_pars) {
            par.innerHTML = json_pars[par_nr].content;
            par_nr++;
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
  let video_blocker = document.querySelector('div.video-blocker');
  removeDOMElement(video_blocker);
  let ads = 'div.arc_ad';
  hideDOMStyle(ads);
}

else if (matchDomain('al-monitor.com')) {
  func_post = function () {
    if (mobile) {
      let article = document.querySelector(article_sel);
      if (article) {
        let lazy_images = article.querySelectorAll('picture > img[loading="lazy"][style]');
        for (let elem of lazy_images) {
          elem.style = 'width: 95%;';
          elem.parentNode.removeAttribute('style');
        }
        let art_width = article.offsetWidth - 20 + 'px';
        let header = document.querySelector('header');
        if (header)
          header.style.width = art_width;
        let elems = article.querySelectorAll(':not(a, svg)[style*="width"]');
        for (elem of elems) {
          elem.style.width = art_width;
          elem.style['grid-template-columns'] = '';
        }
        let lang = article.querySelector('div[style] > ul[style*="align-items"]');
        if (lang)
          lang.parentNode.removeAttribute('style');
        let par = article.querySelector('div[style] > div[dir="ltr"]');
        if (par)
          par.parentNode.style = 'width: ' + art_width;
      }
    }
  }
  let url = window.location.href;
  let article_sel = 'article';
  getArchive(url, 'div.node__paywall-cta', '', article_sel, '', article_sel, article_sel + ' > div');
}

else if (matchDomain('americanbanker.com') || matchDomain(usa_arizent_custom_domains)) {
  let inline_gate = document.querySelector('.inline-gate');
  if (inline_gate) {
    inline_gate.classList.remove('inline-gate');
    let inline_gated = document.querySelectorAll('.inline-gated');
    for (let elem of inline_gated)
      elem.classList.remove('inline-gated');
  }
  let ads = document.querySelectorAll('div.GoogleDfpAd');
  removeDOMElement(...ads);
}

else if (matchDomain('artnet.com')) {
  if (window.location.pathname.endsWith('/amp-page')) {
    amp_unhide_subscr_section();
  } else {
    let body_hidden = document.querySelector('.article-body');
    if (body_hidden)
      body_hidden.style = 'display:block;';
    let banner = document.querySelector('div[id^="issuem-leaky-paywall-"]');
    removeDOMElement(banner);
  }
}

else if (matchDomain('asia.nikkei.com')) {
  let paywall = document.querySelector('div#paywall-offer');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div#article-body-preview > div');
    if (article) {
      let json_script = document.querySelector('script#__NEXT_DATA__');
      if (json_script) {
        try {
          let json = JSON.parse(json_script.text);
          if (json && json.props.pageProps.data.body) {
            let json_text = json.props.pageProps.data.body;
            if (!json_text.includes('<div>'))
              json_text = '<div>' + json_text + '</div>';
            let parser = new DOMParser();
            let doc = parser.parseFromString(json_text, 'text/html');
            let article_new = doc.querySelector('div');
            article.parentNode.replaceChild(article_new, article);
          } else
            refreshCurrentTab();
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
  let banners = 'div#pianoj_ribbon, div#paywall-offer';
  hideDOMStyle(banners);
}

else if (matchDomain('axios.com')) {
  function axios_noscroll(node) {
    node.removeAttribute('style');
    let overlay = 'div[class^="Modal_paywall"], div[class^="Modal_cta"]';
    hideDOMStyle(overlay, 2);
  }
  let noscroll = document.querySelector('html[style]');
  if (noscroll)
    axios_noscroll(noscroll);
  waitDOMAttribute('html', 'HTML', 'style', axios_noscroll, true);
  let banners = 'div[data-cy="pro-paywall"], div.apexAd, div[class*="NativeAd"], span[data-ad-type]';
  hideDOMStyle(banners);
}

else if (matchDomain('balkaninsight.com')) {
  getJsonUrl('div.subscribeWrapper', '', 'div.post_teaser', {art_append: 1, art_hold: 1});
}

else if (matchDomain(['barandbench.com', 'theleaflet.in', 'thenewsminute.com'])) {
  let paywall = document.querySelector('div[id*="paywall-banner"]');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div.paywall');
    if (article) {
      let article_new = getArticleQuintype();
      if (article_new && article.parentNode)
        article.parentNode.replaceChild(article_new, article);
    }
  }
}

else if (matchDomain('barrons.com')) {
  if (window.location.pathname.startsWith('/livecoverage/')) {
    window.setTimeout(function () {
      fix_dowjones_live();
    }, 1500);
  } else {
    let paywall = document.querySelector('div#cx-interstitial-snippet, div[data-id^="ArticleRoadblock_"]');
    if (paywall) {
      removeDOMElement(paywall);
      window.setTimeout(function () {
        let articles = document.querySelectorAll('article > div.crawler');
        let article;
        for (let elem of articles) {
          let paragraph = elem.querySelector('p[class*="Paragraph"]');
          if (paragraph) {
            article = elem;
            break;
          }
        }
        if (article) {
          let article_id_dom = document.querySelector('head > meta[name="article.id"][content]');
          if (article_id_dom) {
            let article_id = article_id_dom.content;
            let url_src = 'https://barrons.djmedia.djservices.io/apps/barrons/theaters/default-article?screen_ids=' + article_id;
            let x_access_token = "eyJhbGciOiJSUzI1NiJ9.WFZsaHN3MXd3Smw0V3kwRXBzclQ.qwwBedAUNXHTQchowQZ5zMwmnXqDKeMhoRJlkB7drjWmb0ktZCScIhq5lpIiWaMyNJA_ODYgHAfIoi7DKWkS8g8GunFNAXpJDUOLdI2rtQkTEi_E3o90rdZHunPR7p0ULjRmHCnDofAdpTQdJtTXjQ9eEDZT2xoooVGdBpoVKhE";
            getExtFetch(url_src, '', {"app-identifier": "http://com.news.screens", "device-type": "phone", "x-access-token": x_access_token}, fix_dowjones_fetch, [article]);
          }
        }
      }, 2000);
    }
  }
  let signin_links = document.querySelectorAll('p > a[href^="https://www.barrons.com/client/login"][href*="target="]');
  for (let elem of signin_links) {
    elem.href = decodeURIComponent(elem.href.split('target=')[1].split('&')[0]);
    elem.innerText = 'Open';
    elem.target = '_top';
  }
  let ads = 'div[class]:has(> div.uds-ad-container)';
  hideDOMStyle(ads);
}

else if (matchDomain('benzinga.com')) {
  function benz_main(node) {
    removeDOMElement(node);
    if (!window.location.pathname.startsWith('/report/')) {
      let blurred = document.querySelector('div.article-content-paywalled');
      if (blurred) {
        blurred.classList.remove('article-content-paywalled');
        let key_points = document.querySelectorAll('li.blur-sm');
        for (let elem of key_points)
          elem.classList.remove('blur-sm');
        let article = document.querySelector('div#article-body');
        if (article) {
          let json_script = document.querySelector('script#__NEXT_DATA__');
          if (json_script) {
            try {
              let json = JSON.parse(json_script.text);
              if (json && json.props.pageProps.article.primaryImage) {
                let img_data = json.props.pageProps.article.primaryImage;
                if (img_data.url) {
                  let img = document.createElement('img');
                  img.src = img_data.url;
                  img.alt = img_data.alt;
                  article.before(img);
                }
              }
            } catch (err) {
              console.log(err);
            }
          }
        }
      }
    } else {
      let blurred = document.querySelector('div.blur-lg');
      if (blurred)
        blurred.classList.remove('blur-lg');
    }
  }
  waitDOMElement('div.paywall-content', 'DIV', benz_main, false);
}

else if (matchDomain('bhaskar.com')) {
  if (!window.location.pathname.startsWith('/amp/')) {
    let paywall_sel = 'div.paywallBlockedContent';
    let paywall = document.querySelector(paywall_sel);
    if (paywall) {
      let banner = document.querySelector(paywall_sel + ' ~ div');
      if (banner)
        removeDOMElement(banner);
      paywall.removeAttribute('class');
    }
    let ads = document.querySelectorAll('div[style*="overflow:hidden"][style*="max-height:"], div[id^="Ad--"], article  div:empty');
    if (ads)
      removeDOMElement(...ads);
  } else
    ampToHtml();
}

else if (matchDomain('bizjournals.com')) {
  if (window.location.pathname.includes('/subscriber-only/')) {
    header_nofix('div.primary');
  } else {
    let paywall = document.querySelector('div.paywall-content:empty');
    if (paywall) {
      paywall.classList.remove('paywall-content');
      let article = document.querySelector('div#ContentTease');
      if (article) {
        let json_script = document.querySelector('script#__NUXT_DATA__');
        if (json_script) {
          try {
            let json = JSON.parse(json_script.text);
            if (json) {
              let pars_index = json.indexOf('paragraph') + 1;
              if (pars_index) {
                let intro = article.querySelector('p[class]');
                let par_class = intro ? intro.className : 'content mb-4';
                article.innerHTML = '';
                let parser = new DOMParser();
                let hl_index = json.indexOf('highlights') + 1;
                if (hl_index) {
                  let container = document.createElement('div');
                  container.className = 'border border-gray-300 p-2 font-sans';
                  container.style = 'margin-bottom: 20px;';
                  let title = document.createElement('h3');
                  title.className = 'pb-4 font-bold';
                  title.innerText = 'Story Highlights';
                  let doc = parser.parseFromString('<div class="' + par_class + '">' + json[hl_index] + '</div>', 'text/html');
                  let highlights = doc.querySelector('div');
                  container.append(title, highlights);
                  article.appendChild(container);
                }
                let json_images = json.filter(x => x && x.ord && x.url);
                for (let i = pars_index; i < json.length; i++) {
                  let par = json[i];
                  if (!par)
                    continue;
                  let style;
                  if (par === 'header') {
                    style = 'font-weight: bold;';
                    i++;
                    par = json[i];
                  } else if (par.type && json[par.type] === 'media') {
                    let json_img = json_images.find(x => x.ord === par.ord);
                    if (json_img) {
                      let figure = makeFigure(json[json_img.url], json[json_img.caption] + (json[json_img.byline] ? '\r\n' + json[json_img.byline].toUpperCase() : ''));
                      figure.className = par_class;
                      article.appendChild(figure);
                    }
                  }
                  if (typeof par === 'string' && !['default', 'embed', 'horizontal_line', 'image', 'list', 'media', 'top25list'].includes(par)) {
                    if (par.match(/^\d{4}-\d{2}-/))
                      break;
                    let doc = parser.parseFromString('<div class="' + par_class + '">' + par + '</div>', 'text/html');
                    let par_new = doc.querySelector('div');
                    par_new.querySelectorAll('iframe[allow*="fullscreen"][allowfullscreen]').forEach(e => e.removeAttribute('allowfullscreen'));
                    if (style)
                      par_new.style = style;
                    article.appendChild(par_new);
                  } else if (par.is_primary || par['primary-channel'])
                    break;
                }
              }
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
    window.setTimeout(function () {
      let dialog = document.querySelector('div[id^="headlessui-dialog-"], div.sheet-overlay');
      if (dialog) {
        removeDOMElement(dialog);
        let html = document.querySelector('html[style]');
        if (html)
          html.removeAttribute('style');
        let overlays = document.querySelectorAll('html.is-overlaid, body.is-overlaid');
        for (let elem of overlays)
          elem.classList.remove('is-overlaid');
        let nuxt_inert = document.querySelector('div#__nuxt[inert]');
        if (nuxt_inert)
          nuxt_inert.removeAttribute('inert');
      }
    }, 1000);
  }
  let ads = 'div.adwrap, div[data-dev="MovableAd"]';
  hideDOMStyle(ads);
}

else if (matchDomain('bloomberg.com')) {
  let paywall_sel = 'div[id^="fortress-"]';
  waitDOMElement(paywall_sel, 'DIV', removeDOMElement, true);
  waitDOMAttribute('body', 'BODY', 'data-paywall-overlay-status', node => node.removeAttribute('data-paywall-overlay-status'), true);
  if (window.location.pathname.startsWith('/live/')) {
    setInterval(function () {
      window.localStorage.clear();
    }, 15 * 60 * 1000);
  } else
    window.localStorage.clear();
  let leaderboard = 'div[id^="leaderboard"], div[class^="leaderboard"], div.canopy-container';
  let shimmering = 'article.first-story div[class*="Placeholder_placeholderParagraphWrapper-"]';
  let ads = 'div[data-ad-status], div[data-ad-type], div[class*="FullWidthAd_"], div.adWrapper';
  hideDOMStyle([paywall_sel, leaderboard, shimmering, ads].join(','));
}

else if (matchDomain('bloombergadria.com')) {
  let article_hidden = document.querySelector('article.single-news[style]');
  if (article_hidden)
    article_hidden.removeAttribute('style');
  let ads = '.banner';
  hideDOMStyle(ads);
}

else if (matchDomain('bostonglobe.com')) {
  if (window.location.search.startsWith('?outputType=amp'))
    amp_unhide_subscr_section();
}

else if (matchDomain('business-standard.com')) {
  function bs_main(node) {
    removeDOMElement(node);
    let audio_tts = document.querySelector('audio[src$="-short.mp3"]');
    if (audio_tts)
      audio_tts.src = audio_tts.src.replace('-short', '');
    let json_script = document.querySelector('script#__NEXT_DATA__');
    if (json_script) {
      try {
        let json = JSON.parse(json_script.text);
        if (json && json.props.pageProps.data.htmlContent) {
          let json_text = json.props.pageProps.data.htmlContent;
          let article = document.querySelector('div[class^="MainStory_storycontent__"], div[class^="blueprint-story-detail_storbpcontent_"]');
          if (json_text && article) {
            removeDOMElement(json_script);
            article.innerHTML = '';
            let parser = new DOMParser();
            let doc = parser.parseFromString('<div>' + json_text + '</div>', 'text/html');
            let article_new = doc.querySelector('div');
            if (article_new) {
              let zoom_images = article_new.querySelectorAll('div > img.zoomimg');
              for (let img of zoom_images) {
                let caption = img.parentNode.querySelector('div[style]');
                if (caption)
                  caption.removeAttribute('style');
              }
              window.setTimeout(function () {
                article.appendChild(article_new);
              }, 1000);
            }
          }
        } else
          refreshCurrentTab();
      } catch (err) {
        console.log(err);
      }
    }
  }
  if (!window.location.pathname.startsWith('/amp/')) {
    if (true) {
      let paywall_sel = 'div[class^="subscription_subscriptionPlan_"], div[class^="BluePrintPaywall_BPstoryPaywall_"]';
      let paywall = document.querySelector(paywall_sel);
      if (paywall) {
        bs_main(paywall);
      } else {
        waitDOMElement(paywall_sel, 'DIV', bs_main, false);
      }
    }
    let banner = 'section.sbcrbtmlfull, div.subscribfixed_artcalLeftBox__hmpMi';
    let ads = 'div.advertisement-bg, div[id^="between_article_content_"]';
    hideDOMStyle(banner + ', ' + ads);
  } else
    ampToHtml();
}

else if (matchDomain('businessinsider.com')) {
  let ads = 'div.masthead-ad, div.l-ad, div.in-post-sticky, aside.has-video-ad, div.ad-callout-wrapper';
  hideDOMStyle(ads);
}

else if (matchDomain('businessinsider.jp')) {
  let paywall = document.querySelector('div.piano-paywall-container[hidden]');
  if (paywall)
    paywall.removeAttribute('hidden');
}

else if (matchDomain('businessoffashion.com')) {
  let ads = 'div[class^="default__AdsBlockWrapper"], div[data-test="common-nbabanner"]';
  hideDOMStyle(ads);
}

else if (matchDomain('capital.bg')) {
  let paywall = document.querySelector('section > article a[href^="/paywall_click/"], section[data-paywall-id]');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = json.articleBody;
        let img_main = document.querySelector('div.story--header picture > img[src]');
        let article = document.querySelector('div.story-content');
        if (json_text && article) {
          article.innerHTML = '';
          let article_new = document.createElement('p');
          let json_pars = parseHtmlEntities(json_text).replace(/\s{2,}/g, '\r\n\r\n').split(/[\[\]]{2}/);
          for (let elem of json_pars) {
            let par;
            if (!elem.match(/[\[\]]{2}/)) {
              if (elem.match(/img:\d+/)) {
                if (img_main) {
                  let img_new_id = elem.split('img:')[1];
                  if (img_new_id) {
                    par = document.createElement('img');
                    par.src = img_main.src.replace(/_\d+\./, '_' + img_new_id + '.').split('?')[0];
                    par.style = 'margin: 20px; width: 90%;';
                  }
                }
              } else if (!elem.match(/(embed|quote):\d+/)) {
                par = document.createElement('p');
                par.innerText = elem;
              }
            }
            if (par)
              article.appendChild(par);
          }
        }
      }
    }
  } else
    header_nofix('div.story-content > p', 'section > header > a[data-referral="Paywall"]');
  let ads = 'div.banner';
  hideDOMStyle(ads);
}

else if (matchDomain(['chronicle.com', 'philanthropy.com'])) {
  let preview = document.querySelector('div[data-content-summary]');
  removeDOMElement(preview);
  let article_hidden = document.querySelector('div[class~="contentBody" i][hidden]');
  if (article_hidden) {
    let attributes = [...article_hidden.attributes].filter(x => x.name !== 'class');
    for (let elem of attributes)
      article_hidden.removeAttribute(elem.name);
  }
  let ads = 'div.GoogleDfpAd-container';
  hideDOMStyle(ads);
}

else if (matchDomain('cnbc.com')) {
  window.setTimeout(function () {
    let paywall = document.querySelector('div.ArticleGate-proGate');
    if (paywall) {
      removeDOMElement(paywall);
      let article = document.querySelector('div.ArticleBody-articleBody');
      if (article) {
        let intro = article.querySelectorAll('div.group > p');
        if (intro.length < 5) {
          removeDOMElement(...intro);
          article.style = "margin: 20px; font-family: Lyon,Helvetica,Arial,sans-serif; font-size: 18px; line-height: 1.66";
          let span_hidden = document.querySelectorAll('span[hidden]');
          for (let elem of span_hidden) {
            elem.removeAttribute('hidden');
            elem.removeAttribute('class');
            if (elem.innerText)
              elem.innerText = elem.innerText.split('DISCLOSURES: (None)')[0];
            article.appendChild(elem);
          }
        }
      }
    }
  }, 2000);
  let ads = 'div.TopBanner-container';
  hideDOMStyle(ads);
}

else if (matchDomain('cnn.com')) {
  let subwall = document.querySelector('div[data-component-id="subwall"]');
  if (subwall) {
    removeDOMElement(subwall);
    let noscroll = document.querySelectorAll('html[style], body[style]');
    for (let elem of noscroll)
      elem.removeAttribute('style');
    waitDOMAttribute('html', 'HTML', 'style', node => node.removeAttribute('style'), true);
    waitDOMAttribute('body', 'BODY', 'style', node => node.removeAttribute('style'), true);
  }
  let regwall_keys = Object.keys(window.localStorage).filter(x => x.match(/reg_?wall/i));
  for (let item of regwall_keys)
    window.localStorage.removeItem(item);
  let ads = 'div[class*="ad-slot-"], div.container__ads';
  hideDOMStyle(ads);
}

else if (matchDomain('columbian.com')) {
  setCookie('blaize_session', '', 'columbian.com', '/', 0);
  header_nofix('story', 'div#inline-paywall');
  let ads = 'div.modal, div#sticky-footer-cta, div.article-inline, div[id^="ad-instory-"], div#onesignal-slidedown-container';
  hideDOMStyle(ads);
}

else if (matchDomain('csmonitor.com')) {
  let paywall = document.querySelector('div.paywall');
  removeDOMElement(paywall);
  window.localStorage.clear();
}

else if (matchDomain('cyclingnews.com')) {
  let paywall = document.querySelector('div.paywall-locker');
  if (paywall) {
    paywall.classList.remove('paywall-locker');
    let banner = 'div.kiosq-main-layer';
    hideDOMStyle(banner);
  }
  let metered_keys = Object.keys(window.localStorage).filter(x => x.match(/^kiosq_article/));
  for (let item of metered_keys)
    window.localStorage.removeItem(item);
}

else if (matchDomain('dailyherald.com')) {
  let ads = 'div.dhTopAd, div[data-widget-host="revcontent"]';
  hideDOMStyle(ads);
}

else if (matchDomain('dailywire.com')) {
  let paywall = document.querySelector('div#payed-article-paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let div_hidden = document.querySelector('#post-body-text > div > div[class]');
    if (div_hidden)
      div_hidden.removeAttribute('class');
  }
  let ads = 'div.ad-wrapper';
  hideDOMStyle(ads);
}

else if (matchDomain('dallasnews.com')) {
  if (window.location.search.startsWith('?outputType=amp')) {
    amp_unhide_subscr_section();
  }
}

else if (matchDomain('defector.com')) {
  let paywall = document.querySelector('div[class^="ContentGate_wrapper__"]');
  if (paywall) {
    removeDOMElement(paywall);
    let article_sel = 'div[class^="PostContent_wrapper__"]';
    let article = document.querySelector(article_sel);
    if (article) {
      window.setTimeout(function () {
        let pars = article.querySelectorAll('p');
        if (pars.length < 3) {
          let url = window.location.href.split('?')[0];
          replaceDomElementExt(url, false, false, article_sel);
        }
      }, 1000);
    }
  }
}

else if (matchDomain('denik.cz')) {
  let paywall = document.querySelector('div#js-subscriptionBox');
  if (paywall) {
    removeDOMElement(paywall);
    let article_sel = 'div.article-content';
    let article = document.querySelector(article_sel);
    if (article) {
      func_post = function () {
        let div_hidden = document.querySelector('div.paywall');
        if (div_hidden)
          div_hidden.removeAttribute('class');
        let videos = document.querySelectorAll('video[id]:not([src])');
        for (let elem of videos) {
          elem.removeAttribute('class');
          let video_button = elem.parentNode.querySelector('button');
          removeDOMElement(video_button);
        }
      }
      let url = window.location.href;
      replaceDomElementExt(url, false, false, article_sel);
    }
  }
  let ads = 'div.leaderboard-top, div.outstream, div[class^="sticky-"], div[class*="wallpaper-"]';
  hideDOMStyle(ads);
}

else if (matchDomain(['digiday.com', 'glossy.co', 'modernretail.co'])) {
  let ads = 'div[class^="ad_"]';
  hideDOMStyle(ads);
}

else if (matchDomain('discovermagazine.com')) {
  window.setTimeout(function () {
    let body = document.querySelector('body');
    if (body)
      body.style = 'overflow: auto !important;';
    let banners = 'div.fIkXwQ, div[style*="fadeIn"], div[role="button"][aria-label="Dismiss Dialog"]';
    hideDOMStyle(banners);
  }, 1000);
}

else if (matchDomain('dnevnik.bg')) {
  window.setTimeout(function () {
    let paywall = document.querySelector('div.paywall-container');
    if (paywall) {
      removeDOMElement(paywall);
      function addGST() {
        let url = window.location.href;
        let article = document.querySelector('div.story-body');
        if (article)
          article.firstChild.before(googleSearchToolLink(url));
      }
      let article_lock = document.querySelector('div.article-lock');
      if (article_lock) {
        let intro = article_lock.querySelector('div[role="paragraph"]');
        let intro_start;
        if (intro)
          intro_start = intro.innerText.substring(0, 25);
        let scripts = document.querySelectorAll('script:not([src], [type])');
        let json_script;
        let link_script;
        let script_start = 'self.__next_f.push([1,"';
        for (let script of scripts) {
          if (script.text.startsWith(script_start)) {
            if (!link_script && script.text.includes('significantLink\\":'))
              link_script = script;
            else if (!json_script && (script.text.includes('[storyid:') || (intro_start && script.text.replace(/\\u003c/g, '<').replace(/\\u003e/g, '>').replace(/<[^<]*>\s?/g, '').replace(/\\"/g, '"').startsWith(script_start + intro_start))))
              json_script = script;
            if (json_script && link_script)
              break;
          }
        }
        if (json_script) {
          article_lock.classList.remove('article-lock');
          let banner = 'div.paywall-content';
          hideDOMStyle(banner);
          let img_main = document.querySelector('div.story-gallery-main figure > img[src]');
          let links;
          if (link_script)
            links = link_script.text.split('significantLink\\":[')[1].split('\\"],')[0].replace(/\\"/g, '').split(',');
          let json_pars = json_script.text.split('self.__next_f.push([1,"')[1].split('"])')[0].replace(/\\u003c/g, '<').replace(/\\u003e/g, '>').replace(/\\"/g, '"').replace(/<br \/>/g, '').split(/[\[\]]{2}/);
          if (json_pars.length) {
            article_lock.innerHTML = '';
            if (json_pars.find(x => x.includes('embed:') || x === 'gallery'))
              addGST();
          }
          let parser = new DOMParser();
          for (let elem of json_pars) {
            let par;
            if (!elem.match(/[\[\]]{2}/)) {
              if (elem.match(/img:\d+/)) {
                if (img_main) {
                  let img_new_id = elem.split('img:')[1];
                  if (img_new_id) {
                    par = document.createElement('img');
                    par.src = img_main.src.replace(/_\d+\./, '_' + img_new_id + '.').split('?')[0];
                    par.style = 'margin: 20px; width: 90%;';
                  }
                }
              } else if (elem.match(/storyid:\d+/)) {
                if (links) {
                  let story_id = elem.split('storyid:')[1];
                  if (story_id) {
                    let story = links.find(x => x.includes(story_id + '_'));
                    if (story) {
                      par = document.createElement('a');
                      par.href = story;
                      par.innerText = story.split(story_id + '_')[1].replace(/_/g, ' ').replace('/', '');
                      par.className = 'story-related';
                      if (!matchUrlDomain(window.location.hostname, story))
                        par.target = '_blank';
                    }
                  }
                }
              } else if (!elem.match(/quote:\d+/)) {
                let doc = parser.parseFromString('<div role="paragraph">' + elem + '</div>', 'text/html');
                par = doc.querySelector('div');
              }
              if (par)
                article_lock.appendChild(par);
            }
          }
        }
      } else
        addGST();
    }
  }, 1000);
}

else if (matchDomain('dwell.com')) {
  if (window.location.pathname.match(/^(\/amp)?\/article\//)) {
    if (!window.location.search.startsWith('?rel=plus')) {
      let paywall = pageContains('div > a', /Try Dwell\+ for FREE/);
      if (paywall.length) {
        removeDOMElement(paywall[0]);
        window.location.href = window.location.pathname.replace(/^\/amp/, '') + '?rel=plus';
      }
    } else {
      let paywall = document.querySelector('div#mainPanel div[class^="FCR_"]');
      let article = document.querySelector('div > section[class]');
      if (paywall && article) {
        removeDOMElement(paywall);
        article.classList.remove('_2S7l9_l2eDI5b8DSR29ijf');
        let filter = /^window\.INITIAL_STATE\s?=\s?/;
        let json_script = getSourceJsonScript(filter);
        if (json_script) {
          let split1 = json_script.text.split(filter)[1];
          let state = (split1.split('};')[0] + '}');
          if (state) {
            try {
              let json = JSON.parse(state);
              if (json) {
                let items = json.articles.items;
                let id = Object.keys(items)[0];
                let photos = json.photos ? json.photos.items : '';
                let json_text = items[id].attributes.body.replace(/(<br>|<span style=".+;">|<\/span>)/g, '');
                function find_img_url(match, p1, p2, offset, string) {
                  let contributorId;
                  let format;
                  if (photos && photos[p1]) {
                    contributorId = photos[p1].attributes.userId;
                    format = photos[p1].attributes.format;
                  }
                  let result = '<p>missing photo: ' + p1 + '</p>';
                  if (contributorId)
                    result = '<figure><img src="https://images2.dwell.com/photos/' + contributorId + '/' + p1 + '/original.' + format + '?auto=format&q=35&w=1280"><figcaption>' + p2 + '</figcaption></figure>';
                  return result;
                }
                json_text = json_text.replace(/<dwell-photo photoId="(\d+)"\scaption="([^"]+)"[^<]+photoUserId="\d*"\/>/g, find_img_url);
                let parser = new DOMParser();
                let doc = parser.parseFromString('<section class="' + article.className + '">' + json_text + '</section>', 'text/html');
                let article_new = doc.querySelector('section');
                article.parentNode.replaceChild(article_new, article);
              }
            } catch (err) {
              console.log(err);
            }
          }
        }
      }
      let photo_links = document.querySelectorAll('div > a[href^="' + window.location.pathname.replace(/\/\d{8,}/, '') + '"]');
      for (let elem of photo_links)
        elem.href += '?rel=plus';
      let close_button = document.querySelector('header > div > span > svg');
      if (!document.querySelector('a#bpc_close') && close_button) {
        let elem = document.createElement('a');
        elem.href = window.location.pathname.split('?')[0].replace(/\/\d{8,}/, '');
        elem.id = 'bpc_close';
        elem.innerText = 'close';
        elem.style.color = 'white';
        close_button.parentNode.parentNode.appendChild(elem);
      }
    }
  }
  let ads = 'div.EYrS5iukqzJMkNAcFQ0ho';
  hideDOMStyle(ads);
}

else if (matchDomain('economictimes.com')) {
  if (window.location.pathname.includes('/amp_')) {
    let paywall = document.querySelector('.paywall_wrap');
    if (paywall) {
      let content = document.querySelector('.paywall[style="display:none;"]');
      if (content) {
        let parser = new DOMParser();
        let doc = parser.parseFromString('<div style="margin: 20px 0px;">' + content.innerText + '</div>', 'text/html');
        let content_new = doc.querySelector('div');
        let charts = content_new.querySelectorAll('iframe[id^="datawrapper-chart-"]');
        for (let elem of charts) {
          elem.width = '100%';
          elem.style.margin = '20px 0px';
        }
        if (content_new && content.parentNode)
          content.parentNode.replaceChild(content_new, content);
      } else
        window.location.href = 'https://economictimes.indiatimes.com' + window.location.pathname.replace('amp_prime', 'prime');
      let intro = document.querySelector('.art_wrap');
      let article_blocker = document.querySelector('.articleBlocker');
      removeDOMElement(paywall, intro, article_blocker);
      let ads = 'amp-ad';
      hideDOMStyle(ads);
    }
  } else {
    window.setTimeout(function () {
      let paywall = document.querySelector('div#blocker_layer');
      let data_prime = document.querySelector('div[data-prime="1"]');
      let amphtml = document.querySelector('head > link[rel="amphtml"]');
      if (paywall || data_prime) {
        removeDOMElement(paywall);
        if (data_prime)
          data_prime.removeAttribute('data-prime');
        if (amphtml)
          amp_redirect_not_loop(amphtml);
        else if (window.location.pathname.startsWith('/epaper/'))
          window.location.href = 'https://economictimes.indiatimes.com' + window.location.pathname;
      } else {
        let ads = '.adContainer';
        hideDOMStyle(ads);
      }
    }, 500);
  }
}

else if (matchDomain('economictimes.indiatimes.com')) {
  let paywall = document.querySelector('section.prime_paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let content = document.querySelector('div.content1, div.artText');
    let full_text = document.querySelector('div.paywall.p1');
    if (content && full_text) {
      if (!full_text.innerText.includes('["datawrapper-height"]'))
        content.innerText = full_text.innerText;
      else {
        let amphtml = document.querySelector('head > link[rel="amphtml"]');
        if (amphtml)
          amp_redirect_not_loop(amphtml)
      }
    }
    addStyle('div.pageContent {height: auto !important;}');
    let article_wrap = document.querySelector('div.article_wrap[style]');
    if (article_wrap)
      article_wrap.removeAttribute('style');
  }
  if (mobile) {
    let pageholder = document.querySelector('main.pageHolder');
    if (pageholder) {
      pageholder.classList.remove('pageHolder');
      let header = document.querySelector('header');
      if (header)
        header.style = 'width: 100% !important;';
      let f_col = document.querySelector('div.f_col');
      removeDOMElement(f_col);
    }
  }
  let ads = 'div.topAdContainer, div.vdo_ai_can_ani, div[data-ad-slot]';
  hideDOMStyle(ads);
}

else if (matchDomain('economist.com')) {
  if (window.location.pathname.includes('/podcasts/')) {
    header_nofix('section[data-body-id]', 'div[aria-labelledby="paywall-heading"]');
  } else if (!window.location.pathname.startsWith('/interactive/')) {
    let paywall_sel = 'div#tp-regwall';
    let article_sel = 'main';
    let video = document.querySelector('iframe[src^="https://www.youtube.com/"]');
    func_post = function () {
      if (video) {
        let video_new = document.querySelector('div[old-src^="https://www.youtube.com/"]');
        if (video_new && video_new.parentNode)
          video_new.parentNode.replaceChild(video, video_new);
      }
      if (mobile) {
        let grids = document.querySelectorAll('div[style*="grid-template-columns"]');
        for (let elem of grids)
          elem.removeAttribute('style');
        let lazy_images = document.querySelectorAll('figure img[loading="lazy"][style]');
        for (let elem of lazy_images)
          elem.style = 'width: 95%;';
      }
    }
    let url = window.location.href;
    getArchive(url, paywall_sel, '', 'main');
  }
  let ads = 'div[class*="adComponent"]';
  hideDOMStyle(ads);
}

else if (matchDomain('enotes.com')) {
  let paywall = document.querySelector('section#enotes-paywall');
  if (paywall) {
    let section_words = pageContains('p', /\(This entire section contains/);
    removeDOMElement(paywall, ...section_words);
    setCookie('ENOTESID', '', 'enotes.com', '/', 0);
    let blurred = document.querySelectorAll('div.u-paywall');
    for (let elem of blurred)
      elem.className = 'o-rte-text u-space--top';
    let ads = document.querySelectorAll('div:not([class]) > div[id^="div-gpt-ad-"]');
    for (let ad of ads)
      hideDOMElement(ad.parentNode);
  }
}

else if (matchDomain('entrepreneur.com')) {
  let ads = 'div.ad__wrapper, div#piano-metered-container';
  hideDOMStyle(ads);
}

else if (matchDomain('epoch.org.il')) {
  getJsonUrl('div.register-login-box', '', 'div.paywall');
}

else if (matchDomain('espn.com')) {
  let url = window.location.href;
  getArchive(url, 'aside.espn-plus-container-wrapper', '', 'section#article-feed > article');
}

else if (matchDomain('euobserver.com')) {
  let paywall = pageContains('div > h4', 'To read this story, log in or subscribe');
  if (paywall.length) {
    removeDOMElement(paywall[0].parentNode);
    let article = document.querySelector('div:has(> p.rte-p)');
    if (article) {
      let filter = /^window\.__basedcache__\s?=\s?/;
      let json_script = getSourceJsonScript(filter);
      if (json_script) {
        try {
          let json = JSON.parse(json_script.text.split(filter)[1]);
          if (json) {
            let body = findKeyJson(json, ['body']);
            if (body) {
              article.innerHTML = '';
              let parser = new DOMParser();
              let doc = parser.parseFromString('<div style="font-size: 18px; line-height: 30px; position: relative;">' + body + '</div>', 'text/html');
              let article_new = doc.querySelector('div');
              article.appendChild(article_new);
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
}

else if (matchDomain('fastcompany.com')) {
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let filter = /\\"content\\":\[/;
    let json_script = getSourceJsonScript(filter, ':not([id], [src], [type])');
    if (json_script) {
      try {
        let json = JSON.parse('[' + json_script.text.split(filter)[1].split(/\],\\"/)[0].replace(/\\\\\\"/g, '\\"').replace(/(\[|,)\\"/g, '$1"').replace(/\\"(\]|,)/g, '"$1').replace(/\\\\n/g, '') + ']');
        if (json) {
          let article = document.querySelector('article');
          if (article) {
            article.innerHTML = '';
            article.className = 'article-container';
            let parser = new DOMParser();
            for (let pars of json)
              for (let par of pars) {
                if (!par.match(/^\$\w{2}$/)) {
                  let content_new = parser.parseFromString('<div class="content-chunk">' + par + '</div>', 'text/html');
                  let elem = content_new.querySelector('div');
                  let img_srcset_drop = elem.querySelectorAll('figure > img[srcset]');
                  for (let img of img_srcset_drop)
                    img.removeAttribute('srcset');
                  article.appendChild(elem);
                }
              }
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  let ads = 'div[class*="ad-wrapper"]';
  hideDOMStyle(ads);
}

else if (matchDomain('fieldandstream.com')) {
  let overlay = document.querySelectorAll('div[class^="mailmunch-"]');
  removeDOMElement(...overlay);
  let noscroll = document.querySelector('html.mailmunch-pop-open');
  if (noscroll)
    noscroll.removeAttribute('class');
}

else if (matchDomain('financialexpress.com')) {
  let paywall = document.querySelector('div.paywall');
  if (paywall)
    paywall.classList.remove('paywall');
  let register = 'div.pcl-wrap';
  let ads_selector = window.location.pathname.endsWith('/lite/') ? '.ad-bg-container' : 'div[class*="-ads-blocks-ad-unit"]';
  hideDOMStyle(register + ', ' + ads_selector);
}

else if (matchDomain('fmrmagazine.com')) {
  let paywall = document.querySelector('div.fr-gate-overlay');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div.issue-article-intro');
    if (article) {
      let url_src = window.location.href.split(/[#\?]/)[0] + '.json';
      fetch(url_src)
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            try {
              let json_text = json.page.body_html;
              if (json_text) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(json_text, 'text/html');
                let article_new = doc.querySelector('div.issue-article-content');
                if (article_new)
                  article.after(article_new);
                addStyle('body {overflow: auto !important;}');
              }
            } catch (err) {
              console.log(err);
            }
          });
        }
      })
    }
  }
}

else if (matchDomain('forbes.com')) {
  waitDOMAttribute('html', 'HTML', 'class', node => node.removeAttribute('class'), true);
  waitDOMAttribute('body', 'BODY', 'class', node => node.removeAttribute('class'), true);
  if (window.location.pathname.startsWith('/newsletters/')) {
    let paywall = document.querySelector('div > div.newsletter-teaser');
    if (paywall) {
      paywall.classList.remove('newsletter-teaser');
      let header = paywall.parentNode;
      header_nofix(header);
    }
  }
  let ads = 'fbs-ad, div[class^="fbs-ad"], div[data-testid^="fbs-ad"], div.inlineAdContainer, div[data-testid="locked-top-ad-container"]';
  hideDOMStyle(ads);
}

else if (matchDomain('forbes.ua')) {
  let paywall = document.querySelector('div.js-closed-part');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = parseHtmlEntities(json.articleBody).replace(/\n/g, "$&\r\n");
        let article = document.querySelector('div.c-post-text');
        if (json_text && article)
          article.innerText = json_text;
      }
    }
  }
}

else if (matchDomain('foreignaffairs.com')) {
  let paywall = document.querySelector('.paywall');
  let loading_indicator = document.querySelector('.loading-indicator');
  let msg_bottom = document.querySelector('.messages--container--bottom');
  removeDOMElement(paywall, loading_indicator, msg_bottom);
  let article_dropcap = document.querySelectorAll('.article-dropcap');
  for (let elem of article_dropcap)
    elem.classList.add('loaded');
}

else if (matchDomain('foreignpolicy.com')) {
  let content_ungated = document.querySelector('div.content-ungated');
  if (content_ungated) {
    removeDOMElement(content_ungated);
    let content_gated = document.querySelector('div.content-gated');
    if (content_gated) {
      let insider = document.querySelector('body.is-fp-insider');
      if (insider) {
        getJsonUrl('div.content-gated', {rm_class: 'content-gated'}, 'div.content-gated');
        window.setTimeout(function () {
          let lazy_images = document.querySelectorAll('img[loading="lazy"]');
          for (let elem of lazy_images)
            elem.removeAttribute('loading');
        }, 1000);
      } else
        content_gated.classList.remove('content-gated');
    }
  }
  let audio_tts_overlay = document.querySelector('div.fp-audio-embed--disabled > div.share-dropdown > span.bigfoot-footnote__container');
  if (audio_tts_overlay) {
    audio_tts_overlay.parentNode.removeAttribute('class');
    removeDOMElement(audio_tts_overlay);
  }
}

else if (matchDomain('fortune.com')) {
  let ads = 'div.leaderboard-ad-wrapper-parent, div.leading-0, div.z-body-popover, div.nativo-wrapper, div#outbrain-container, div[class^="sc-"]:has(> div[data-cy^="in-stream-"], > div > div[data-google-query-id]), div[class^="min-h-"]:has(> div#article-piano-template-plea-container)';
  hideDOMStyle(ads);
}

else if (matchDomain('foxnews.com')) {
  let paywall = document.querySelector('div.article-gating-wrapper');
  removeDOMElement(paywall);
  let overlay = document.querySelector('div[class*="gated-overlay"]');
  if (overlay)
    overlay.removeAttribute('class');
}

else if (matchDomain('ftm.eu')) {
  let videos = document.querySelectorAll('div.body > div.video-pp');
  for (let video of videos) {
    let video_id_dom = video.querySelector('a.video[data-youtube-id]');
    if (video_id_dom) {
      video_new = document.createElement('iframe');
      video_new.src = 'https://www.youtube.com/embed/' + video_id_dom.getAttribute('data-youtube-id');
      video_new.style = 'width: 95%; height: 400px; margin: 0px 20px;';
      video.parentNode.replaceChild(video_new, video);
    }
  }
  let audio_controls = document.querySelectorAll('audio[controls][style]');
  for (let elem of audio_controls)
    elem.removeAttribute('style');
  document.querySelectorAll('div.foldable').forEach(e => e.classList.remove('foldable'));
  let banners = 'div.banner-pp';
  hideDOMStyle(banners);
}

else if (matchDomain(['haaretz.co.il', 'haaretz.com', 'themarker.com'])) {
  if (window.location.pathname.match(/\/ty-article/)) {
    let body_wrapper_sel = 'section[data-testid="article-body-wrapper"]';
    let paywall_sel = 'div[data-test="paywallMidpage"], ' + body_wrapper_sel + ' div[data-testid="logo-loading-indicator"]';
    let article_sel = 'main';
    let article_link_sel = 'main header, main.article-page p:not([id]), h1#article-header, ' + body_wrapper_sel;
    let url = window.location.href;
    if (!mobile) {
      func_post = function () {
        let disabled_items = 'section[data-testid="zoidberg-list"], section#comments-section, div[old-position="sticky"]';
        hideDOMStyle(disabled_items);
      }
      getArchive(url, paywall_sel, '', article_sel, '', article_sel, article_link_sel);
    } else {
      let paywall = document.querySelector(paywall_sel);
      if (paywall) {
        removeDOMElement(paywall);
        let article_link = document.querySelector(article_link_sel);
        if (article_link)
          article_link.before(archiveLink(url));
      }
    }
  }
  let history_keys = Object.keys(window.localStorage).filter(x => x.match(/^(reading(Count)?History|raData)/i));
  for (let item of history_keys)
    window.localStorage.removeItem(item);
}

else if (matchDomain('harpers.org')) {
  setCookie('hr_session', '', 'harpers.org', '/', 0);
  let paywall = document.querySelector('div#full-paywall');
  if (paywall) {
    paywall.removeAttribute('id');
    header_nofix(paywall, '', 'BPC > no fix (for older articles archive may work)');
    let url = window.location.href;
    paywall.before(archiveLink(url));
  }
  let ads = 'div#ctas';
  hideDOMStyle(ads);
}

else if (matchDomain('hbr.org')) {
  if (window.location.pathname.startsWith('/data-visuals')) {
    let feed_entries = document.querySelectorAll('li.feed-entry');
    for (let feed_entry of feed_entries) {
      let download = feed_entry.querySelector('span.entry-download > a[href*="/undefined/"]');
      if (download) {
        let figure = feed_entry.querySelector('figure.entry-image > img[src]');
        if (figure) {
          download.href = figure.src;
          download.setAttribute('download', '');
        }
      }
    }
  } else {
    function hbr_main() {
      window.top.postMessage({type: 'article-paywall:full-content'}, '*');
    }
    let popup = document.querySelector('.persistent-banner');
    removeDOMElement(popup);
    let paywall = document.querySelector('div[id^="paywall"]');
    if (paywall) {
      removeDOMElement(paywall);
      insert_script(hbr_main);
    }
  }
}

else if (matchDomain('hilltimes.com')) {
  function hilltimes_main(node) {
    getJsonUrl('div.paywallcont', '', 'div#entry-content');
  }
  let paywall_sel = 'div.paywallcont';
  let paywall = document.querySelector(paywall_sel);
  if (true) {
    if (paywall)
      hilltimes_main(paywall);
    else
      waitDOMElement(paywall_sel, 'DIV', hilltimes_main, false);
  }
  let banner = 'section.hide_this_section';
  hideDOMStyle(banner);
}

else if (matchDomain('hindustantimes.com')) {
  document.querySelectorAll('.freemiumText').forEach(e => e.classList.remove('freemiumText'));
  let noscroll = document.querySelector('body.open-popup');
  if (noscroll)
    noscroll.classList.remove('open-popup');
  let banners = 'div[class^="sub-paywall-version"], div[class^="adHeight"], .closeStory';
  hideDOMStyle(banners);
}

else if (matchDomain('historyextra.com')) {
  let article_masked = document.querySelector('.template-article__masked');
  if (article_masked) {
    let extra_pars = document.querySelectorAll('div.template-article__masked > p');
    removeDOMElement(...extra_pars);
    article_masked.classList.remove('template-article__masked');
  }
  let ads = 'div.ad-slot, div.ad-banner, div.stitcher-ad--dai-placeholder';
  hideDOMStyle(ads);
}

else if (matchDomain('historytoday.com')) {
  if (window.location.hostname.startsWith('app.')) {
    restorePugpigPage();
  } else {
    let paywall = document.querySelector('div.nopremium-message');
    if (paywall) {
      let app_link = document.createElement('a');
      let app_url = 'app.historytoday.com';
      app_link.href = 'https://' + app_url;
      app_link.innerText = 'BPC > no fix, search article on: ' + app_url;
      app_link.style = 'color: red; font-weight: bold;';
      let app_div = document.createElement('div');
      app_div.style = 'margin: 20px;';
      app_div.appendChild(app_link);
      paywall.before(app_div);
      removeDOMElement(paywall);
    }
  }
}

else if (matchDomain('inc.com')) {
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let locked = document.querySelector('div.article-container--locked');
    if (locked)
      locked.className = 'article-container';
  }
  let ads = 'div.second-scroll-border';
  hideDOMStyle(ads);
}

else if (matchDomain('inc42.com')) {
  if (window.location.pathname.endsWith('/amp/')) {
    amp_unhide_access_hide('="status"', '="NOT status"', 'div.wru-widget');
  } else {
    let banner = document.querySelector('div[id*="_leaderboard_"]');
    removeDOMElement(banner);
  }
}

else if (matchDomain('indianexpress.com')) {
  if (window.location.pathname.endsWith('/lite/'))
    amp_unhide_access_hide('="metering.result=\'ALLOW_ACCESS\'"');
  else {
    let ads = 'div[class^="adsbox"], div.adboxtop, div.add-first, div.osv-ad-class, div.ie-int-campign-ad';
    hideDOMStyle(ads);
  }
}

else if (matchDomain('indiatoday.in')) {
  if (window.location.pathname.match(/(\/amp)?\/magazine\//)) {
    let url = window.location.href;
    if (!url.includes('/amp/')) {
      amp_redirect('div#csc-paywall');
    } else {
      amp_unhide_access_hide('="granted"', '="NOT NOT granted"', 'div[class^="wrapper_main-container_"], div.readmore__box');
    }
  }
}

else if (matchDomain('infzm.com')) {
  let url = window.location.href;
  if (url.includes('.com/wap/#/content/')) {
    let container = document.querySelector('section.container');
    if (container)
      container.classList.remove('container');
    let overlay = document.querySelector('div.article-content[style]');
    if (overlay)
      overlay.removeAttribute('style');
  } else if (url.includes('.com/contents/')) {
    let paywall = document.querySelector('div.nfzm-article-jumbotron--unauth');
    if (paywall) {
      removeDOMElement(paywall);
      window.location.href = url.replace('.com/contents/', '.com/wap/#/content/').split('?')[0];
    }
  }
}

else if (matchDomain('inkl.com')) {
  let url = window.location.href;
  if (url.includes('/signin?') && url.includes('redirect_to=')) {
    window.setTimeout(function () {
      window.location.href = 'https://www.inkl.com' + decodeURIComponent(url.split('redirect_to=')[1]);
    }, 500);
  } else {
    let paywall = document.querySelector('div.paywall');
    if (paywall) {
      paywall.removeAttribute('class');
      let gradient_container = document.querySelector('div.gradient-container');
      removeDOMElement(gradient_container);
    }
    let what_is_inkl = document.querySelector('.what-is-inkl-container, .features-panel');
    let signup = document.querySelectorAll('.article-signup-container, .locked-sign-up-container, div[class*="/inkl-watermark.svg"]');
    let shared_banner = document.querySelector('div.shared-article-inline-banner');
    removeDOMElement(what_is_inkl, ...signup, shared_banner);
    let dismiss_button = document.querySelector('div.dismiss-button-container button.btn');
    if (dismiss_button)
      dismiss_button.click();
    let dive_deeper_summary_bodies = document.querySelectorAll('div.dive-deeper-container div.summary-body');
    if (dive_deeper_summary_bodies) {
      for (let summary_body of dive_deeper_summary_bodies) {
        if (!summary_body.querySelector('a')) {
          let ng_click = summary_body.getAttribute('ng-click').replace("showArticle('", '').replace("')", '');
          let weblink = document.createElement('a');
          weblink.text = 'open';
          weblink.href = 'https://www.inkl.com/news/' + ng_click;
          summary_body.appendChild(weblink);
        }
      }
    }
  }
}

else if (matchDomain('insidehighered.com')) {
  let ads = 'div[id^="block-dfptag"], div.wp-block-ihe-ad, section.section-ad_slot, div#roadblock';
  hideDOMStyle(ads);
}

else if (matchDomain('interestingengineering.com')) {
  addStyle('body {overflow: auto !important; position: relative !important; top: unset !important;}');
  let banners = 'main > div[class*="t-hidden"], div.t-bg-black';
  hideDOMStyle(banners);
}

else if (matchDomain('investors.com')) {
  func_post = function () {
    let videos = document.querySelectorAll('div.jwp-placement[data-jw-video_url]');
    for (let video of videos) {
      let video_new = document.createElement('video');
      video_new.src = video.getAttribute('data-jw-video_url');
      video_new.setAttribute('controls', '');
      video_new.style = 'width: 100%;';
      video.parentNode.replaceChild(video_new, video);
    }
  }
  let paywall_sel = 'div.investors-paywall-overlay';
  let paywall = document.querySelector(paywall_sel);
  if (paywall)  {
    setCookie('__tbc', '', 'investors.com', '/', 0);
    getJsonUrl(paywall_sel, '', 'div.investors-paywall-excerpt');
  }
  let ads = 'div.ads, div.headerAds';
  hideDOMStyle(ads);
}

else if (matchDomain('ipolitics.ca')) {
  let login = document.querySelector('div.login');
  if (login) {
    removeDOMElement(login);
    let json_script = document.querySelector('script#__NEXT_DATA__');
    if (json_script) {
      try {
        let json = JSON.parse(json_script.innerText);
        if (json && json.props.pageProps.post && json.props.pageProps.post.content) {
          let url_next = json.props.pageProps.post.slug;
          if (url_next && !window.location.pathname.includes(url_next))
            refreshCurrentTab();
          let article_new = json.props.pageProps.post.content;
          let article = document.querySelector('.post-body');
          if (article) {
            article.innerHTML = '';
            article.classList.remove('locked');
            let parser = new DOMParser();
            let doc = parser.parseFromString('<div>' + article_new + '</div>', 'text/html');
            let content_new = doc.querySelector('div');
            article.appendChild(content_new);
          }
        } else {
          refreshCurrentTab();
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
}

else if (matchDomain('japantimes.co.jp')) {
  setCookie('xbc', '', 'japantimes.co.jp', '/', 0);
  let url = window.location.href;
  getArchive(url, 'div.blocker', '', 'div#jtarticle');
  let banner = document.querySelector('div.subscribe');
  removeDOMElement(banner);
  let ads = 'div.DisplayAd';
  hideDOMStyle(ads);
}

else if (matchDomain('jpost.com')) {
  let premium_banners = document.querySelectorAll('.hide-for-premium, #hiddenPremiumForm, #hiddenLink');
  removeDOMElement(...premium_banners);
}

else if (matchDomain('kathimerini.gr')) {
  let ads = 'div.nx-billboard-ad-row';
  hideDOMStyle(ads);
}

else if (matchDomain('kompas.id')) {
  let url_artikel = window.location.pathname.startsWith('/artikel/');
  let delay = url_artikel ? 2500 : 0;
  window.setTimeout(function () {
    let paywall = document.querySelector('kompasid-paywall');
    if (paywall) {
      removeDOMElement(paywall);
      if (url_artikel) {
        let intro = document.querySelector('div.paywall');
        removeDOMElement(intro);
        let art_hidden = document.querySelector('div.non-paywall[style]');
        if (art_hidden)
          art_hidden.removeAttribute('style');
      } else {
        let art_hidden = document.querySelector('section.paywall.hidden');
        if (art_hidden)
          art_hidden.classList.remove('hidden');
      }
    }
  }, delay);
}

else if (matchDomain('latimes.com')) {
  let subscribers = pageContains('div.infobox > p.infobox-title', /subscribers/i);
  if (subscribers.length)
    removeDOMElement(subscribers[0].parentNode);
  let ads = 'div.google-dfp-ad-wrapper, div.revcontent';
  hideDOMStyle(ads);
}

else if (matchDomain('law.com')) {
  func_post = function () {
    let pars = document.querySelectorAll(article_sel + ' div[style*="font-family:"]');
    if (pars.length < 5)
      pars[0].after(googleSearchToolLink(url));
    let banner = document.querySelector(article_sel + ' div > div > div > a[href="https://store.law.com/Registration/default.aspx"]');
    if (banner)
      removeDOMElement(banner.parentNode.parentNode.parentNode);
  }
  let url = window.location.href;
  let paywall_sel = 'div.paywall-content';
  let article_sel = 'main:not(:has(main))';
  let paywall = document.querySelector(paywall_sel);
  if (paywall) {
    let podcast = document.querySelector('article > a[href="/podcast/"]');
    if (podcast)
      paywall.removeAttribute('class');
    else
      getArchive(url, paywall_sel, {rm_atrrib: 'class'}, article_sel);
  }
}

else if (matchDomain('livelaw.in')) {
  let amp = window.location.pathname.startsWith('/amp/');
  let paywall = document.querySelector(amp ? 'div.subscribeNow' : 'div#subscription_paid_message');
  if (paywall) {
    let intro = document.querySelector(amp ? 'div.story' : 'div.details-story-wrapper');
    removeDOMElement(paywall, intro);
    let paywall_content = document.querySelector('div.paywall-content.hide');
    if (paywall_content) {
      if (paywall_content.innerText.length) {
        paywall_content.className = amp ? '' : 'news_details_page_row2 details-story-wrapper';
      } else if (!amp) {
        let amphtml = document.querySelector('head > link[rel="amphtml"]');
        if (amphtml)
          window.location.href = amphtml.href;
      }
    }
  }
  let ads = 'inside-post-ad, amp-ad';
  hideDOMStyle(ads);
}

else if (matchDomain('livemint.com')) {
  if (window.location.pathname.includes('/amp-')) {
    let paywall = document.querySelectorAll('[amp-access="NOT subscribed"]');
    removeDOMElement(...paywall);
  } else {
    let paywall = document.querySelector('div.paywall');
    if (paywall)
      paywall.classList.remove('paywall');
    let banners = document.querySelectorAll('div[class^="storyPaywall_paywallStory_"]');
    removeDOMElement(...banners);
    let ads = '[class^="ad"], [id^="ad"], #subscribeAd, .taboolaHeight';
    hideDOMStyle(ads);
  }
}

else if (matchDomain('magazine.atavist.com')) {
  let bottom_notification = document.querySelector('div.bottom-notification');
  let overlay = document.querySelector('div.notification-overlay');
  removeDOMElement(bottom_notification, overlay);
  let paywall = document.querySelector('body.paywall-notification-visible');
  if (paywall)
    paywall.classList.remove('paywall-notification-visible');
  window.localStorage.clear();
}

else if (matchDomain('manoramaonline.com')) {
  if (!window.location.pathname.endsWith('.amp.html')) {
    amp_redirect('ev-engagement');
  } else {
    amp_unhide_access_hide("=\"result='ALLOW_ACCESS'\"");
  }
}

else if (matchDomain('marketwatch.com')) {
  if (window.location.pathname.startsWith('/livecoverage/')) {
    window.setTimeout(function () {
      fix_dowjones_live();
    }, 1500);
  } else {
    let paywall = document.querySelector('div#cx-snippet-container');
    if (paywall) {
      removeDOMElement(paywall);
      window.setTimeout(function () {
        let article_sel = 'section[class*="-Container"]';
        let article = document.querySelector(article_sel);
        if (article) {
          addStyle(article_sel + '::after {background: none !important;}');
          let article_id_dom = document.querySelector('head > meta[name="article.id"][content]');
          if (article_id_dom) {
            let article_id = article_id_dom.content;
            let url_src = 'https://mwatch.djmedia.djservices.io/apps/marketwatch/theaters/article?screen_ids=' + article_id;
            let x_access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJBVVRIX1BIUkFTRV9QUk9EX0FORFJPSUQiOiJjWXhLbURPOENOcm9wOEZINmtkTyJ9.xozUBM2fH4fY5JvdSrpvesZHeNFqS9aIFSZdXsvty5tgE1qb5w26I5Fe-FGQTYQdfPCQmJ60dh-QsxPKmsm3J0l50zF5CiiTAzmvD5D_XWkV_sa_L5eMqLvLyV2Wcrld9-LhKfmyqQlqDSU79276_sgo6yxDA2xqKDzFzwoOj3OILFKdkXvZNbN9NGapoTEV6z8CWt2nOxnBsN-_cXjpeDE_Al2EgWtSLA32nlRcbJ9Nm4ZRpZzCr5AKaUtysnjiAFpWyp1MSnYMJEZImYbt7nm9k2qd3ResXx0vZu-PZkr9bi4zprCUmvbLzopRbVbDwcDJowWpwyo3DnrjOhBKgw";
            getExtFetch(url_src, '', {"app-identifier": "com.news.screens", "device-type": "phone", "x-access-token": x_access_token}, fix_dowjones_fetch, [article]);
          }
        }
      }, 2000);
    }
  }
  let ads = 'div.element--ad, div.j-ad, div.adWrapper, div#cx-articlecover';
  hideDOMStyle(ads);
}

else if (matchDomain('medscape.com')) {
  let ads = 'div.text-ad-unit, div[id^="ads-"], div.adswrapper';
  hideDOMStyle(ads);
}

else if (matchDomain('mexiconewsdaily.com')) {
  let div_hidden = document.querySelector('body.single div.td-post-content > div.tdb-block-inner');
  if (div_hidden)
    div_hidden.classList.remove('tdb-block-inner');
}

else if (matchDomain('mid-day.com')) {
  if (window.location.pathname.startsWith('/amp/')) {
    amp_unhide_access_hide('="granted"', '="NOT granted"', '[class*="BannerAd"], div.midday-wrapper');
  } else {
    amp_redirect('div#myModalFullscreen');
    let read_more = document.querySelector('#read-more-my');
    if (read_more)
      read_more.click();
  }
}

else if (matchDomain('mnimarkets.com')) {
  let paywall = document.querySelector('div.missing-out-overlay');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div.body-html');
    if (article) {
      let twitter_description = document.querySelector('head > meta[name="twitter:description"][content]');
      if (twitter_description && twitter_description.content.length > 200) {
        let par = article.querySelector('p');
        if (par)
          par.innerText = parseHtmlEntities(twitter_description.content);
      } else {
        let intro_start = article.innerText.substring(0, 25);
        let scripts = document.querySelectorAll('script:not([src], [type])');
        let json_script;
        let script_start = 'self.__next_f.push([1,"';
        for (let script of scripts) {
          if (script.text.startsWith(script_start)) {
            if (intro_start && script.text.startsWith(script_start) && (script.text.replace(/\\n/g, ' ').startsWith(script_start + intro_start) || (script.text.replace(/\\n/g, ' ').includes('\\"body_text\\":\\"' + intro_start)))) {
              json_script = script;
              break;
            }
          }
        }
        if (json_script) {
          let json_text;
          if (json_script.text.includes('\\"body_text\\":\\"'))
            json_text = json_script.text.split('\\"body_text\\":\\"')[1].split('\\",\\"body_xhtml\\":')[0];
          else
            json_text = json_script.text.split('self.__next_f.push([1,"')[1].split('"])')[0];
          json_text = json_text.replace(/\\n\\n/g, '\r\n\r\n').replace(/(\\)?\\n/g, ' ').replace(/\\"/g, '"').replace(/\\u0026/g, '&');
          let article_new = document.createElement('p');
          article_new.innerText = parseHtmlEntities(json_text);
          article.innerHTML = '';
          article.appendChild(article_new);
        }
      }
    }
  }
  let body = document.querySelector('body');
  if (body)
    body.style = 'user-select: text !important';
}

else if (matchDomain('nationalgeographic.com')) {
  function natgeo_func(node) {
    removeDOMElement(node);
    let body = document.querySelector('body[class]');
    if (body) {
      body.removeAttribute('class');
      body.removeAttribute('style');
    }
  }
  let paywall = document.querySelector('div[id^="fittPortal"]');
  if (paywall)
    natgeo_func(paywall);
  waitDOMElement('div[id^="fittPortal"]', 'DIV', natgeo_func, false);
  window.setTimeout(function () {
    let url = window.location.href;
    let subscribed = document.querySelector('div.Article__Content--gated');
    let msg = document.querySelector('div#bpc_archive');
    if (subscribed && !msg) {
      subscribed.appendChild(archiveLink(url));
      subscribed.setAttribute('style', 'overflow: visible !important;');
    }
    let overlay = document.querySelector('div.Article__Content__Overlay--gated');
    if (overlay)
      overlay.classList.remove('Article__Content__Overlay--gated');
  }, 2000);
  let ads = 'div.ad-slot, div.InsertedAd, div.natgeo-ad';
  hideDOMStyle(ads);
}

else if (matchDomain('nationalreview.com')) {
  if (!window.location.pathname.endsWith('/amp/')) {
    let paywall_sel = 'div.continue-reading';
    let paywall = document.querySelector(paywall_sel);
    if (paywall) {
      let amphtml = document.querySelector('head > link[rel="amphtml"][href]');
      if (amphtml && !amphtml.href.includes(window.location.pathname)) {
        removeDOMElement(paywall);
        refreshCurrentTab();
      } else
        getJsonUrl(paywall_sel, '', 'div.article-content', {art_class: 'article-content article-content--headless'});
    }
  }
  let banners = 'div.zephr-wrapper, div#bc-root, div.cookie-text';
  let ads = 'amp-ad, .ad-unit, .ad-skeleton, amp-connatix-player, div[class*="-connatix-"]';
  hideDOMStyle(banners + ', ' + ads);
}

else if (matchDomain('nature.com')) {
  func_post = function () {
    header_nofix('article', 'h2#access-options', 'BPC > no archive-fix');
  }
  let url = window.location.href;
  getArchive(url, 'div.app-access-wall, h2#access-options', '', 'article');
}

else if (matchDomain('nautil.us')) {
  window.setTimeout(function () {
    let adm_button = document.querySelector('div[class^="a__sc-np"] button');
    if (adm_button)
      adm_button.click();
  }, 500);
  let ads = 'div.article-ad';
  hideDOMStyle(ads);
}

else if (matchDomain('ndtvprofit.com')) {
  if (window.location.pathname.startsWith('/amp/')) {
    amp_unhide_subscr_section();
  } else {
    window.setTimeout(function () {
      amp_redirect('div[class^="hard-paywall"], div[class*="geotag-container_"]');
    }, 1000);
  }
  let ads = 'div.responsive-ad';
  hideDOMStyle(ads);
}

else if (matchDomain('newcriterion.com')) {
  getJsonUrl('div.paywall-overlay', '', 'div.entry-content');
}

else if (matchDomain('newrepublic.com')) {
  let modal = document.querySelector('div.article-scheduled-modal');
  let pw_popups = document.querySelector('div#pwPopups');
  removeDOMElement(modal, pw_popups);
  let ads = '.ad-unit';
  hideDOMStyle(ads);
}

else if (matchDomain('newscientist.com')) {
  if (!window.location.hostname.startsWith('appan.')) {
    let paywall = document.querySelector('section#subscription-barrier');
    if (paywall) {
      removeDOMElement(paywall);
      let json_script = document.querySelector('script#ns-seo-schema');
      if (json_script) {
        try {
          let json = JSON.parse(json_script.text);
          if (json && json.datePublished) {
            let date = json.datePublished.split(/T\d/)[0].replace(/-/g, '/');
            let path_new = window.location.pathname.split(/\/article\/(\d+-|mg\d+-\d+-)/)[2];
            if (path_new) {
              let url = 'https://appan.newscientist.com/' + date + '/' + path_new + 'content.html';
              func_post = function () {
                let lazy_images = document.querySelectorAll('img[src^="../"][data-src]');
                for (let elem of lazy_images) {
                  elem.src = elem.getAttribute('data-src');
                  elem.removeAttribute('height');
                  elem.removeAttribute('width');
                }
                let videos = document.querySelectorAll('figure > div.pugpig-video[data-video-url]');
                for (let elem of videos) {
                  let iframe = document.createElement('iframe');
                  iframe.src = elem.getAttribute('data-video-url');
                  iframe.style = 'width: 100%; height: 400px; margin: 20px 0px;';
                  elem.parentNode.replaceChild(iframe, elem);
                }
              }
              replaceDomElementExt(url, false, false, 'section.ArticleContent', 'BPC > no fix (source file)', 'section[class$="-article__body"]');
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
    let ads = 'div[class*="Advert"]';
    hideDOMStyle(ads);
  } else {
    restorePugpigPage();
  }
}

else if (matchDomain('newsday.com')) {
  let listen_button = document.querySelector('div.listen-button > button[disabled]');
  if (listen_button) {
    let audio_src_dom = listen_button.parentNode.querySelector('audio > source[src]');
    if (audio_src_dom) {
      let audio = document.createElement('audio');
      audio.src = audio_src_dom.src;
      audio.setAttribute('controls', '');
      listen_button.parentNode.replaceChild(audio, listen_button);
    }
  }
  let nd_lock = document.querySelector('html[class]');
  if (nd_lock)
    nd_lock.removeAttribute('class');
  let ads = 'div.ad';
  hideDOMStyle(ads);
}

else if (matchDomain('newslaundry.com')) {
  let paywall = document.querySelector('div > div > img[alt^="paywall"]');
  if (paywall) {
    let banner = document.querySelector('div.FrsvM');
    removeDOMElement(paywall.parentNode.parentNode, banner);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = parseHtmlEntities(json.articleBody).replace(/<\/p>\./g, '</p>');
        let article = document.querySelector('div.story-element-text');
        if (json_text && article) {
          let parser = new DOMParser();
          let doc = parser.parseFromString('<div>' + json_text + '</div>', 'text/html');
          let article_new = doc.querySelector('div');
          article.innerHTML = '';
          article.appendChild(article_new);
        }
      }
    }
    let video = document.querySelector('a:has(figure)');
    if (video) {
      let scripts = document.querySelectorAll('script[type="application/ld+json"]');
      let video_script;
      for (let script of scripts) {
        if (script.innerText.includes('"embedUrl":"')) {
          video_script = script;
          break;
        }
      }
      if (video_script) {
        let video_new = document.createElement('iframe');
        video_new.src = video_script.innerText.split('"embedUrl":"')[1].split('"')[0];
        video_new.style = 'width: 100%; aspect-ratio: 16 / 9;';
        video_new.setAttribute('frameborder', 0);
        video.parentNode.replaceChild(video_new, video);
      }
    }
  }
}

else if (matchDomain('newsweek.com')) {
  let ads = 'div#topad, div[id^="dfp-ad-"]';
  hideDOMStyle(ads);
}

else if (matchDomain(['nola.com', 'shreveportbossieradvocate.com', 'theadvocate.com'])) {
  if (window.location.pathname.endsWith('.amp.html')) {
    let body_hidden = document.querySelector('.site-container');
    if (body_hidden)
      body_hidden.setAttribute('style', 'display:block;');
  } else {
    let ads = 'div.tnt-ads-container, div.asset-breakout-ads';
    hideDOMStyle(ads);
  }
}

else if (matchDomain('nv.ua')) {
  if (!window.location.pathname.includes('/amp/')) {
    amp_redirect('div[id^="media_paywall"]');
  } else {
    let paywall = document.querySelector('div.paywall-area');
    if (paywall) {
      paywall.removeAttribute('class');
      let subscr = paywall.querySelector('div.make-subscription');
      removeDOMElement(subscr);
    }
    let article = document.querySelector('div.article__content');
    if (article)
      article.removeAttribute('class');
  }
}

else if (matchDomain('nybooks.com')) {
  let paywall_article = document.querySelector('.paywall-article');
  if (paywall_article)
    paywall_article.classList.remove('paywall-article');
  let banners = 'div.toast-cta, div.inline-ad';
  hideDOMStyle(banners);
}

else if (matchDomain('nypost.com')) {
  if (window.location.pathname.includes('/sports/')) {
    let paywall = document.querySelectorAll('head > meta[content*="Sports Plus"]');
    if (paywall.length) {
      removeDOMElement(...paywall);
      let article_sel = 'div.single__content';
      let article = document.querySelector(article_sel);
      if (article) {
        article.classList.remove('entry-content-exclusive-covered');
        let json_url_dom = document.querySelector('head > link[rel="alternate"][type="application/json"][href]'); ;
        if (json_url_dom) {
          let match = json_url_dom.href.match(/\d+$/);
          if (match) {
            let footer = article.querySelector('div.single__footer');
            let article_id = match[0];
            let url_src = 'https://nypost.nypost.djservices.io/apps/nypost-v3/theaters/sports?screen_ids=' + article_id;
            let x_access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJBVVRIX1BIUkFTRV9QUk9EX0FORFJPSUQiOiJGNGYzYnhzZGlIa1M1QzVIWUxUNSJ9.OGooBqisVQznx2FDxZpHAqWu-oG1wPJLUxYBMd3xOKiLakoR2XQC2hXnyS3zb1Dw6AkKcMhWyZfRerUckFjga8Ii59lZtP8Xt92iCUyJjs0yjmLJgkZWEGqZ8szM2UK7jZJ5SsHaYfe2V3c7KrtfbY74aWGwddvg-Ex4O5hwv3aiAJpI_aZMFqniClGM2pYbGNSPxH-I0PMuwTzt-oyofhQsRJWOQES8fmQz1H-opqQVr3B0-ev4MxYZjfk8kKnXxRbf7tDbQvastQh8kLe3KN90ptSp_LWbkPgo0G8Vw9Jzxy1TUd_VNgTE21uNdRAoZbxDly7aw-9CTDtb1OtXVg";
            getExtFetch(url_src, '', {
              "app-identifier": "com.news.screens",
              "device-type": "phone",
              "x-access-token": x_access_token
            }, fix_dowjones_fetch, data_ext_fetch_id++, [article]);
            article.querySelectorAll('p[class]').forEach(e => e.removeAttribute('class'));
            if (footer) {
              window.setTimeout(function () {
                article.appendChild(footer);
              }, 1000);
            }
          }
        }
      }
    }
  }
  let ads = 'div.ad';
  hideDOMStyle(ads);
}

else if (matchDomain('nytimes.com')) {
  if (!window.location.pathname.startsWith('/athletic/')) {
    waitDOMElement('div#dock-container', 'DIV', removeDOMElement, false);
    let ads = 'div[data-testid="inline-message"], div[id^="ad-"], div.pz-ad-box, div[class^="css-"]:has( > div#top-wrapper)';
    hideDOMStyle(ads);
  }
}

else if (matchDomain('on3.com')) {
  let url = window.location.href;
  getArchive(url, 'div[data-template-type="barrier"]', '', 'article');
  let noscroll = document.querySelectorAll('html.scroll-lock, body.scroll-lock');
  for (let elem of noscroll) {
    elem.removeAttribute('class');
    elem.removeAttribute('style');
  }
  hideDOMStyle('div#blocker');
}

else if (matchDomain('outlookbusiness.com')) {
  let paywall = document.querySelector('div#csc-paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = document.querySelector('script#__NEXT_DATA__');
    if (json_script) {
      let json = JSON.parse(json_script.innerText);
      if (json && json.props.initialState.dashboard.ARTICLE_POST_DETAIL_API.data.article_data.description) {
        let article_new = json.props.initialState.dashboard.ARTICLE_POST_DETAIL_API.data.article_data.description;
        let article = document.querySelector('div.story-content');
        if (article) {
          article.innerHTML = '';
          let parser = new DOMParser();
          let doc = parser.parseFromString('<div>' + article_new + '</div>', 'text/html');
          let content_new = doc.querySelector('div');
          article.appendChild(content_new);
        }
      }
    }
  }
}

else if (matchDomain('outlookindia.com')) {
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = parseHtmlEntities(json.articleBody).replace(/\n/g, "$&\r\n");
        let content = document.querySelector('div#articleBody');
        if (json_text && content) {
          content.innerHTML = '';
          let article_new = document.createElement('p');
          article_new.innerText = json_text;
          content.appendChild(article_new);
        }
      }
    }
  }
}

else if (matchDomain('philonomist.com')) {
  let paywall = document.querySelector('div.content-bandeau');
  if (paywall && window.location.pathname.startsWith('/en/')) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = parseHtmlEntities(findKeyJson(json, ['articleBody'])).replace(/\s{2,}/g, '\r\n\r\n');
        let article = document.querySelector('div.main-body');
        if (json_text && article) {
          let par_last = article.querySelector('div > p:last-child');
          if (par_last) {
            let par_last_str = par_last.innerText.substring(0, 50);
            if (json_text.replace(/<[^<]*>/g, '').includes(par_last_str)) {
              par_last.innerText = json_text.substring(json_text.indexOf(par_last_str));
            } else {
              article.innerHTML = ' ';
              let article_new = document.createElement('p');
              article_new.innerText = json_text;
              article.appendChild(article_new);
            }
          }
        }
      }
    }
  }
}

else if (matchDomain('project-syndicate.org')) {
  func_post = function () {
    let hidden_images = document.querySelectorAll('img[src][new-cursrc]');
    for (let elem of hidden_images) {
      if (elem.src.startsWith('data:image/'))
        elem.src = elem.getAttribute('new-cursrc');
      elem.style = 'width: 95%;';
    }
  }
  let url = window.location.href;
  getArchive(url, 'div.paywall--base', '', 'main > article');
}

else if (matchDomain('puck.news')) {
  let url = window.location.href;
  getArchive(url, 'div[class*="paywall"]', '', 'article');
  let modal = document.querySelector('div#paywall-modal');
  removeDOMElement(modal);
  let overlay = document.querySelector('body.paywall-active');
  if (overlay)
    overlay.classList.remove('paywall-active');
}

else if (matchDomain('reuters.com')) {
  let ads = 'div[data-testid="ResponsiveAdSlot"], div[data-testid="Dianomi"]';
  hideDOMStyle(ads);
}

else if (matchDomain('rugbypass.com')) {
  if (window.location.pathname.match(/^\/plus\/\w/)) {
    let paywall = document.querySelector('.premium-fold-bottom');
    if (paywall) {
      paywall.classList.remove('premium-fold-bottom');
      let offer = document.querySelector('.plus-article-offer');
      removeDOMElement(offer);
      let fade = document.querySelector('.fade');
      if (fade)
        fade.classList.remove('fade');
    }
    let lazy_images = document.querySelectorAll('figure > img.lazy[data-src]:not([src])');
    for (let elem of lazy_images) {
      elem.src = elem.getAttribute('data-src');
      elem.removeAttribute('class');
    }
  }
}

else if (matchDomain('scientificamerican.com')) {
  setCookie('article_meter', '', 'scientificamerican.com', '/', 0);
}

else if (matchDomain('scholastic.com')) {
  let paywall = document.querySelector('div.paywallModalElement');
  if (paywall) {
    let modal = document.querySelector('div.modal-backdrop');
    removeDOMElement(paywall, modal);
    let body_modal = document.querySelector('body.modal-open');
    if (body_modal)
      body_modal.removeAttribute('class');
  }
}

else if (matchDomain('science.org')) {
  let paywall = document.querySelector('div.alert-read-limit');
  removeDOMElement(paywall);
  let overlay = document.querySelector('body.alert-read-limit__overlay');
  if (overlay)
    overlay.classList.remove('alert-read-limit__overlay');
}

else if (matchDomain('scmp.com')) {
  window.setTimeout(function () {
    if (matchDomain('amp.scmp.com')) {
      amp_unhide_subscr_section('div.ad-banner, div.advert-fly-carpet-container, div.inline-advert');
      let amp_images = document.querySelectorAll('section.article-body amp-img[src]');
      for (let elem of amp_images) {
        let img = document.createElement('img');
        img.src = elem.getAttribute('src');
        img.alt = elem.getAttribute('alt');
        img.style = 'width: 90%;';
        elem.parentNode.replaceChild(img, elem);
      }
      let default_meters = document.querySelectorAll('div[id^="default-meter-page-views"]');
      removeDOMElement(...default_meters);
    } else {
      let paywall = document.querySelectorAll('div[data-qa="GenericArticle-PaywallContainer"], div.js-reading-0-percent-completion-tracker');
      if (paywall.length) {
        removeDOMElement(...paywall);
        let article = document.querySelector('section[data-qa="ContentBody-ContentBodyContainer"]');
        if (article) {
          let json_script = document.querySelector('script#__NEXT_DATA__');
          if (json_script) {
            try {
              let json = JSON.parse(json_script.text);
              if (json && json.props.pageProps.payload.data.article.body.json) {
                let pars = json.props.pageProps.payload.data.article.body.json;
                if (pars && pars.length)
                  article.innerHTML = '';
                for (let par of pars) {
                  let elem = document.createElement('p');
                  if (window.location.pathname.startsWith('/magazines/'))
                    elem.style = 'margin: 20px 0px;';
                  if (['p', 'h3'].includes(par.type)) {
                    for (let sub_elem of par.children) {
                      if (sub_elem.type === 'text') {
                        if (sub_elem.data)
                          elem.appendChild(document.createTextNode(sub_elem.data));
                      } else if (['a', 'em', 'span', 'strong'].includes(sub_elem.type)) {
                        let first_child = sub_elem.children && sub_elem.children[0];
                        if (sub_elem.children && sub_elem.children.length > 1) {
                          let elem_text = sub_elem.children.map(x => x.data || x.children[0].data).join('');
                          first_child = {type: 'text', data: elem_text};
                        }
                        if (first_child) {
                          if (first_child.type === 'text') {
                            if (first_child.data) {
                              let a_link = document.createElement('span');
                              if (sub_elem.attribs && sub_elem.attribs.href) {
                                a_link = document.createElement('a');
                                a_link.style = 'text-decoration: underline;';
                                a_link.href = sub_elem.attribs.href;
                                if (!matchUrlDomain(window.location.hostname, sub_elem.attribs.href))
                                  a_link.target = '_blank';
                              } else if (sub_elem.type === 'em')
                                a_link.style = 'font-style: italic;';
                              else if (sub_elem.type === 'strong')
                                a_link.style = 'font-weight: bold;';
                              a_link.innerText = first_child.data;
                              elem.appendChild(a_link);
                            }
                          }
                        }
                      } else if (sub_elem.type === 'img') {
                        if (sub_elem.attribs) {
                          let attribs = sub_elem.attribs;
                          if (attribs.src)
                            elem = makeFigure(attribs.src, attribs.title, {alt: attribs.alt, style: 'width: 100%;'}, {style: 'font-size: 80%;'});
                        }
                      } else {
                        console.log(sub_elem);
                      }
                    }
                  } else if (par.type === 'div') {
                    if (par.attribs) {
                      if (par.attribs.class === 'image-inline-container') {
                        if (par.children && par.children[0]) {
                          let attribs = par.children[0].attribs;
                          if (attribs.src)
                            elem = makeFigure(attribs.src, attribs.title, {alt: attribs.alt, style: 'width: 100%;'}, {style: 'font-size: 80%;'});
                        }
                      } else if (par.attribs.class.match(/(methode-html|oembed|video)-wrapper/) && par.children) {
                        addIframe(par.children);
                        function addIframe(par_children) {
                          for (let sub_elem of par_children) {
                            if (sub_elem.children)
                              addIframe(sub_elem.children);
                            if (sub_elem.type === 'iframe') {
                              let attribs = sub_elem.attribs;
                              if (attribs.src) {
                                let figure = document.createElement('figure');
                                let iframe = document.createElement('iframe');
                                iframe.src = attribs.src;
                                if (attribs.width && attribs.height) {
                                  if (!attribs.width.includes('%')) {
                                    let ratio = attribs.width / (article.offsetWidth);
                                    iframe.width = attribs.width / ratio;
                                    iframe.height = attribs.height / ratio;
                                  } else {
                                    iframe.width = attribs.width;
                                    iframe.height = attribs.height;
                                  }
                                } else if (attribs.style) {
                                  iframe.style = attribs.style;
                                  if (attribs.height)
                                    iframe.height = attribs.height;
                                }
                                figure.appendChild(iframe);
                                if (attribs.title) {
                                  let iframe_title = document.createElement('figcaption');
                                  iframe_title.innerText = attribs.title;
                                  iframe_title.style = 'font-size: 80%;';
                                  figure.appendChild(iframe_title);
                                }
                                elem.appendChild(figure);
                              }
                            }
                          }
                        }
                      } else if (par.attribs.class)
                        console.log(par);
                    }
                  } else if (!['blockquote-quote', 'inline-ad-slot', 'inline-plus-widget', 'track-viewed-percentage'].includes(par.type))
                    console.log(par);
                  if (elem.hasChildNodes())
                    article.appendChild(elem);
                }
              }
            } catch (err) {
              console.log(err);
            }
          }
        }
      }
    }
  }, 0);
  let ads = 'div[data-qa*="AdSlot"], div.adblock-message';
  hideDOMStyle(ads);
}

else if (matchDomain('seattletimes.com')) {
  let ads = 'div.top-ad-wrapper, div.ad, div.native-ad-article';
  hideDOMStyle(ads);
}

else if (matchDomain('sfstandard.com')) {
  setCookie('zephr-session', '', 'sfstandard.com', '/', 0);
  let paywall = document.querySelector('div#paywall-container');
  if (paywall) {
    removeDOMElement(paywall);
    refreshCurrentTab();
  }
  let ads = 'div.sticky';
  hideDOMStyle(ads);
}

else if (matchDomain(sg_sph_media_domains)) {
  if (matchDomain('straitstimes.com')) {
    func_post = function () {
      header_nofix('main', 'div#sph_cdp_4:not(:empty)', 'BPC > no archive-fix');
    }
    let url = window.location.href;
    getArchive(url, 'div[id][data-sdkids-campaigntype="pay_wall"]', '', 'main');
  } else if (matchDomain('businesstimes.com.sg')) {
    let article = document.querySelector('div.body-content > div[class]');
    if (article) {
      let par_hidden = article.querySelectorAll('p.hidden');
      if (par_hidden.length) {
        par_hidden[0].parentNode.removeAttribute('class');
        for (let elem of par_hidden)
          elem.classList.remove('hidden');
        let fade = article.querySelector('p[class*="bg-gradient-to-t"]');
        if (fade)
          fade.className = par_hidden[0].className;
      }
    }
  }
  let ads = 'div.ads, div[id^="dfp-ad-"], div.cx_paywall_placeholder, div[data-testid="cas-block-component"]';
  hideDOMStyle(ads);
}

else if (matchDomain('slate.com')) {
  let slate_roadblock = '.slate-roadblock';
  let ads = 'section[class*="-ad"]';
  hideDOMStyle(slate_roadblock + ', ' + ads);
}

else if (matchDomain('slideshare.net')) {
  window.localStorage.clear();
  let limit_overlay = document.querySelector('.limit-overlay');
  if (limit_overlay)
    limit_overlay.classList.remove('limit-overlay');
}

else if (matchDomain('sltrib.com')) {
  let ads = 'div.ad, div.stickyAd, div.stickyTopAd, div[class^="sltrib_medrec"]';
  hideDOMStyle(ads);
}

else if (matchDomain('sloanreview.mit.edu')) {
  if (window.location.pathname.startsWith('/article/')) {
    window.setTimeout(function () {
      let pars = document.querySelectorAll('div.article-content > p');
      if (pars.length && pars.length < 7)
        refreshCurrentTab();
    }, 1000);
  }
}

else if (matchDomain('sofrep.com')) {
  setCookie('sofrep_news_ids', '', 'sofrep.com', '/', 0);
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    paywall.removeAttribute('class');
    let intro = document.querySelector('div.non-paywall');
    removeDOMElement(intro);
    waitDOMElement('div#paywall_wrap', 'DIV', node => removeDOMElement(node.parentNode));
  }
  let banners = document.querySelectorAll('#scrollerCTA, #botCta');
  removeDOMElement(...banners);
}

else if (matchDomain('spglobal.com')) {
  setCookie('count', '', 'spglobal.com', '/', 0);
}

else if (matchDomain('standardmedia.co.ke')) {
  let paywall = document.querySelector('div.paywall-container');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      try {
        let json = JSON.parse(json_script.text.replace(/[\r\n]/g, ''));
        if (json) {
          let json_text = parseHtmlEntities(breakText(json.articleBody)).replace(/[\r\n]/g, '<br>').replace(/[^<]+<br><br>/, '');
          let article = document.querySelector('div.content');
          if (json_text && article) {
            let parser = new DOMParser();
            let doc = parser.parseFromString('<p>' + json_text + '</p>', 'text/html');
            let article_new = doc.querySelector('p');
            let pars_old = article.querySelectorAll('p:not([class]), div.card-text');
            removeDOMElement(...pars_old);
            article.appendChild(article_new);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  let ads = 'div.ad';
  hideDOMStyle(ads);
}

else if (matchDomain('staradvertiser.com')) {
  let paywall = document.querySelectorAll('div.fade');
  if (paywall.length) {
    removeDOMElement(...paywall);
    let div_hidden = document.querySelector('div#hsa-paywall-content[style]');
    if (div_hidden)
      div_hidden.removeAttribute('style');
    let noscroll = document.querySelector('body.overflow-hidden');
    if (noscroll)
      noscroll.classList.remove('overflow-hidden');
  }
  let ads = 'div.promo-container, div.teads-inread';
  hideDOMStyle(ads);
}

else if (matchDomain('startribune.com')) {
  let ads = 'div[data-testid$="-ad"]';
  hideDOMStyle(ads);
}

else if (matchDomain('statnews.com')) {
  let paywall = document.querySelector('div.restricted-content-breaker');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div.entry-content, section.the-content');
    if (article) {
      let url = window.location.href;
      article.before(googleSearchToolLink(url));
    }
  }
  let ads = 'div.header-ad-wrap, div[class*="dfp-ad"]';
  hideDOMStyle(ads);
}

else if (matchDomain('stereogum.com')) {
  let ads = 'div.adthrive-ad';
  hideDOMStyle(ads);
}

else if (matchDomain('stocknews.com')) {
  let hideme = document.querySelector('div#hideme');
  removeDOMElement(hideme);
  let blurmes = document.querySelectorAll('div[id^="blurme"]');
  for (let i = 0; i < blurmes.length; i++)
    blurmes[i].setAttribute('id', 'blurmenot' + i);
}

else if (matchDomain('stratfor.com')) {
  let url = window.location.href;
  getArchive(url, 'div#paywallCTAContainer:not(:empty)', '', 'main', '', 'main', 'h1');
}

else if (matchDomain('study.com')) {
  let faded_content = document.querySelector('div.faded-content');
  if (faded_content)
    faded_content.removeAttribute('class');
  let div_hidden = document.querySelector('div.hidden[ng-non-bindable]');
  if (div_hidden)
    div_hidden.removeAttribute('class');
  let banners = document.querySelectorAll('div.article-cutoff-div');
  removeDOMElement(...banners);
}

else if (matchDomain('swarajyamag.com')) {
  if (!window.location.pathname.startsWith('/amp/')) {
    let paywall = pageContains('h2', /Please Sign In To Continue Reading/);
    let amphtml = document.querySelector('head > link[rel="amphtml"]');
    if (paywall.length) {
      removeDOMElement(...paywall);
      if (amphtml)
        amp_redirect_not_loop(amphtml);
    }
  }
}

else if (matchDomain('techinasia.com')) {
  let paywall = document.querySelector('div.paywall-content');
  if (paywall) {
    hideDOMStyle('div.paywall-content');
    let content_new = paywall.querySelector('div.content');
    let empty_par = content_new.querySelector('a.flourish-credit:not(img), h2:not(:has(~ p))');
    if (!empty_par) {
      let div = document.createElement('div');
      div.className = paywall.className.replace('paywall-content', '');
      div.append(content_new);
      paywall.before(div);
      let container = document.querySelector('div.col div > div.container');
      if (container)
        container.classList.remove('container');
    } else {
      let url = window.location.href;
      let url_xhr = url.replace('.com/', '.com/wp-json/techinasia/2.0/posts/').replace('/visual-story/', '/');
      fetch(url_xhr)
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            let json_text = json.posts[0].content;
            json_text = json_text.replace(/width\=\"(\d){3,}\"/g, 'width="100%"').replace(/height\=\"(\d){3,}\"/g, 'height="100%"');
            if (json_text) {
              let parser = new DOMParser();
              let doc = parser.parseFromString('<div class="content">' + json_text + '</div>', 'text/html');
              let content_new = doc.querySelector('div.content');
              let content = document.querySelector('div.content');
              if (content)
                content_new.className = content.className;
              paywall.before(content_new);
            }
          });
        }
      });
    }
  }
  let splash_subscribe = document.querySelector('div.splash-subscribe');
  let paywall_hard = document.querySelector('div.paywall-hard');
  removeDOMElement(splash_subscribe, paywall_hard);
}

else if (matchDomain(['techtarget.com', 'computerweekly.com'])) {
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    paywall.classList.remove('paywall');
    let banners = document.querySelectorAll('p#firstP, div#inlineRegistrationWrapper');
    removeDOMElement(...banners);
  }
}

else if (matchDomain('the-american-interest.com')) {
  let counter = document.getElementById('article-counter');
  removeDOMElement(counter);
}

else if (matchDomain('the-scientist.com')) {
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    paywall.classList.remove('paywall');
    let fader = document.querySelector('div.gated-fader');
    let modal = document.querySelector('div#Modal');
    removeDOMElement(fader, modal);
  }
}

else if (matchDomain('the-star.co.ke')) {
  if (window.location.pathname.match(/(\d+-){3}/)) {
    let paywall = document.querySelector('div.bg-gradient-to-b');
    if (paywall) {
      removeDOMElement(paywall);
      let article = document.querySelector('div.story-content');
      if (article) {
        article.removeAttribute('class');
        let scripts = document.querySelectorAll('script');
        let json_script
        let script_start = 'self.__next_f.push([1,"';
        for (let script of scripts) {
          if (script.text.startsWith(script_start) && script.text.includes('\\"initialCanonicalUrl\\":\\"')) {
            let json_url = script.text.split('\\"initialCanonicalUrl\\":\\"')[1].split('\\"')[0];
            if (json_url && window.location.pathname !== json_url)
              refreshCurrentTab();
            break;
          }
        }
        for (let script of scripts) {
          if (script.text.startsWith(script_start) && script.text.length > 1000 && !script.text.match(/({|\],?[\[\\]|data:image)/)) {
            json_script = script;
            break;
          }
        }
        if (json_script) {
          let intro_pars = article.querySelectorAll('p');
          removeDOMElement(...intro_pars);
          let json_text = json_script.text.split('self.__next_f.push([1,"')[1].split('"])')[0].replace(/^.+\\n{4,}/, '').replace(/\.\\n((\\r\\n)+)?/g, '.\r\n\r\n').replace(/(\\r)?\\n/g, ' ').replace(/\\"/g, '"').replace(/\\u0026/g, '&');
          let article_new = document.createElement('div');
          article_new.style = 'margin: 20px 0px;';
          article_new.innerText = parseHtmlEntities(json_text);
          article.appendChild(article_new);
        }
      }
    }
  }
}

else if (matchDomain('theamericanconservative.com')) {
  let paywall_sel = 'section.c-blog-post__body--locked';
  let paywall = document.querySelector(paywall_sel);
  if (paywall) {
    let art_options = {
      art_append: 1,
      func_text: function (json_text) {
        if (json_text.includes('<p class="has-drop-cap">')) {
          let split = json_text.split(/(<p class="has-drop-cap">)/);
          json_text = split[1] + split[2];
        };
        return json_text;
      }
    };
    getJsonUrl(paywall_sel, {rm_class: 'c-blog-post__body--locked'}, 'div.c-blog-post__content', art_options);
  } else {
    let img_dark = document.querySelector('div.c-hero-article__image-img.o-image');
    if (img_dark)
      img_dark.removeAttribute('class');
  }
  let modal = document.querySelector('div#emailsub-modal');
  removeDOMElement(modal);
  let noscroll = document.querySelector('body.modal-open');
  if (noscroll)
    noscroll.classList.remove('modal-open');
}

else if (matchDomain('theamericanscholar.org')) {
  getJsonUrl('div.ssagk-form', '', 'div.post_summary');
}

else if (matchDomain('theatlantic.com')) {
  let banners = 'aside#paywall, div[class^="LostInventoryMessage_"]';
  hideDOMStyle(banners);
}

else if (matchDomain('thebaltimorebanner.com')) {
  let ads = 'div.article-body__inline-ad';
  hideDOMStyle(ads);
}

else if (matchDomain('thebulletin.org')) {
  getJsonUrl('div.article--cropped', '', 'div#body-copy', {art_append: 1});
}

else if (matchDomain('thedailybeast.com')) {
  let paywall = document.querySelector('div.Body__paywall-container');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = document.querySelector('script[displayName="initialState"]');
    if (json_script) {
      let json_str = json_script.text.substring(json_script.textContent.indexOf('{'));
      try {
        let json = JSON.parse(json_str);
        if (json.body) {
          let pars = json.body.sections;
          let cards = json.body.cards;
          if (pars) {
            let mobile_doc = document.querySelector('div.Mobiledoc');
            if (mobile_doc) {
              let mobile_doc_text = mobile_doc.innerText.replace(/(\r|\n)/g, '');
              for (let elem of pars) {
                let par_elem = '';
                if (elem[0] === 1) {
                  if (elem[1] === 'p') {
                    let par = '';
                    for (let part of elem[2])
                      par += part[3];
                    if (par && !mobile_doc_text.includes(par)) {
                      par_elem = document.createElement('p');
                      par_elem.innerText = par;
                    }
                  }
                } else if (elem[0] === 10) {
                  if (cards && cards[elem[1]]) {
                    let card = cards[elem[1]];
                    if (card[0] === 'pt-image') {
                      par_elem = document.createElement('p');
                      let par_fig = makeFigure(card[1].url, card[1].title + ' ' + card[1].credit);
                      par_elem.appendChild(par_fig);
                    } else if (card[0] === 'pt-fancy-links-card') {
                      par_elem = document.createElement('p');
                      let par_link = document.createElement('a');
                      par_link.href = card[1].links;
                      par_link.innerText = card[1].linksData[0].long_headline;
                      par_elem.appendChild(par_link);
                    }
                  }
                }
                if (par_elem)
                  mobile_doc.appendChild(par_elem);
              }
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  let ads = document.querySelectorAll('div > div.tdb-ads-block');
  for (let ad of ads)
    hideDOMElement(ad.parentNode);
}

else if (matchDomain('thediplomat.com')) {
  if (matchDomain('magazine.thediplomat.com')) {
    let article = document.querySelector('article > section.h-96');
    if (article) {
      article.classList.remove('h-96');
      let art_body = article.querySelector('div.prose');
      if (art_body) {
        let art_img = article.parentNode.querySelector('figure > picture > img[src]');
        let art_img_src;
        let art_img_match;
        if (art_img) {
          art_img_src = art_img.getAttribute('src');
          let match = art_img.getAttribute('src').match(/\/media\/\d+\/(\w+)\.\w+/);
          if (match)
            art_img_match = match[1];
        }
        let url = window.location.href.split(/[#\?]/)[0];
        fetch(url)
        .then(response => {
          if (response.ok) {
            response.text().then(html => {
              if (html.includes('<script>window.__remixContext.streamController.enqueue("')) {
                try {
                  let source = (html.split('<script>window.__remixContext.streamController.enqueue("')[1].split(/\](\\n)?"\);<\/script>/)[0] + ']').replace(/\\"/g, '"').replace(/\\\\"/g, '\\"');
                  let json = JSON.parse(source);
                  if (json) {
                    let body_index = json.indexOf('body') + 1;
                    if (body_index) {
                      art_body.innerHTML = '';
                      let parser = new DOMParser();
                      for (let i = body_index; i < json.length; i++) {
                        let par = json[i];
                        if (typeof par === 'string') {
                          if (par.startsWith('<p>')) {
                            let doc = parser.parseFromString('<div>' + par + '</div>', 'text/html');
                            let par_new = doc.querySelector('div');
                            let pars = par_new.querySelectorAll('p');
                            for (let par of pars)
                              art_body.appendChild(par);
                          } else if (art_img_match && par !== art_img_match && par.includes(art_img_match.slice(0, -1))) {
                            let caption;
                            for (let n = i - 5; n < i; n++) {
                              let item = json[n];
                              if (typeof item === 'string' && !item.startsWith('<p>') && !['caption', 'credit_name', 'file', 'image'].includes(item) && !item.match(/\d+_\d+/))
                                caption = caption ? caption + '\r\n' + item : item;
                            }
                            let figure = makeFigure(art_img_src.replace(art_img_match, par), caption);
                            figure.style = 'margin: 20px 0px;';
                            art_body.appendChild(figure);
                          }
                        }
                      }
                    }
                  }
                } catch (err) {
                  console.log(err);
                }
              }
            });
          }
        })
      }
      let fade = 'aside.bg-gradient-to-b';
      hideDOMStyle(fade, 2);
      let banner = document.querySelector('section > a[href^="https://thediplomat.com/subscriptions"]');
      if (banner)
        removeDOMElement(banner.parentNode);
    }
  }
  let ads = 'aside.td-ad-container--labeled, div[data-actirise]';
  hideDOMStyle(ads);
}

else if (matchDomain('theglobeandmail.com')) {
  let lazy_images = document.querySelectorAll('img[src^="data:image/"][data-src]');
  for (let elem of lazy_images)
    elem.src = elem.getAttribute('data-src');
  let fusion_script = document.querySelector('script#fusion-metadata');
  if (fusion_script && fusion_script.text.includes('Fusion.globalContent=')) {
    try {
      let json = JSON.parse(fusion_script.text.split('Fusion.globalContent=')[1].split(';Fusion.')[0]);
      window.setTimeout(function () {
        let audio_tts = document.querySelector('div > div#audio-panel > p[class^="ArticlePlayer__LoginCopy"]');
        if (audio_tts) {
          let audio_json = getNestedKeys(json, 'additional_properties.tts_audio');
          if (audio_json) {
            let audio_src = audio_json.url_en_M || audio_json.url_en_F;
            if (audio_src) {
              let audio = document.createElement('audio');
              audio.src = audio_src;
              audio.setAttribute('controls', '');
              audio_tts.parentNode.parentNode.replaceChild(audio, audio_tts.parentNode);
            }
          }
        }
        let video = document.querySelector('div > div.c-video:empty');
        if (video) {
          let streams = findKeyJson(json, 'streams');
          if (streams && streams.length) {
            let stream = streams.pop();
            if (stream.url) {
              let video_new = document.createElement('video');
              video_new.src = stream.url;
              video_new.style = 'width: 90%; margin: 0px 15px;';
              video_new.setAttribute('controls', '');
              video.parentNode.replaceChild(video_new, video);
            }
          }
        }
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  }
  let ads = 'div.c-ad--base';
  hideDOMStyle(ads);
}

else if (matchDomain('thehill.com')) {
  let banners = 'div.civic-science-article-container:empty, aside.ad-unit, iframe#instaread_iframe:not([src])';
  hideDOMStyle(banners);
}

else if (matchDomain(['thehindu.com', 'thehindubusinessline.com'])) {
  if (!window.location.pathname.endsWith('/amp/')) {
    if (window.location.pathname.match(/\/videos\/[-\/\w]+\.ece/)) {
      let video = document.querySelector('div.lead-video-cont');
      if (video) {
        let player = video.querySelector('div.jwplayer');
        if (!player)
          header_nofix(video, '', 'BPC > for videos disable extension');
      }
    }
    let read_more = document.querySelector('div.paywallbox-btn > button');
    if (read_more)
      read_more.click();
    let ads = 'div.ad, div.article-ad, div.dfp-ad, div#paywallbox, div[id^="piano-art-"], #test';
    hideDOMStyle(ads);
  } else {
    let ads = '[class^="height"], [class^="advt"], [id^="piano"]';
    hideDOMStyle(ads);
  }
}

else if (matchDomain('theinformation.com')) {
  func_post = function () {
    if (mobile) {
      document.querySelectorAll('img[loading="lazy"][style], article:has(> a)').forEach(e => e.style = 'width: 95%;');
      let flex_shrink = document.querySelectorAll('div[style] > div[style*="flex-shrink:"]');
      for (let elem of flex_shrink) {
        elem.style = 'width: 95%;';
        elem.parentNode.removeAttribute('style');
        removeDOMElement(elem.parentNode.querySelector('aside'));
      }
      let comments = document.querySelector('div[style*="display:block;margin-right:"]');
      if (comments)
        comments.style['margin-right'] = '0px';
    }
    header_nofix(article_sel + ' > div', article_sel + ' aside div[style*="align-items:"] > button', 'BPC > no archive-fix');
  }
  let article_sel = 'article';
  if (window.location.pathname.startsWith('/forum/'))
    article_sel = 'section';
  let url = window.location.href;
  getArchive(url, 'aside[data-testid="paywall"]', '', article_sel);
}

else if (matchDomain(['thejuggernaut.com', 'jgnt.co'])) {
  let paywall = pageContains('div.font-mono', /(Read this article and many more by subscribing today|Join today to read the full story)/);
  if (paywall.length) {
    removeDOMElement(paywall[0].parentNode);
    let json_script = document.querySelector('script#__NEXT_DATA__');
    if (json_script) {
      try {
        let json = JSON.parse(json_script.text);
        if (json && json.props.pageProps.post.fields) {
          let url_next = json.query.slug;
          if (url_next && !window.location.pathname.includes(url_next))
            refreshCurrentTab();
          let fields = json.props.pageProps.post.fields;
          let pars = fields.fullText ? fields.fullText.content : fields.textEssay.fields.body.content;
          window.setTimeout(function () {
          let article = document.querySelector('div[class*="opacity-"]');
          if (article) {
            article.innerHTML = '';
            article.removeAttribute('class');
            let fade = document.querySelectorAll('div.bg-gradient-to-b');
            for (let elem of fade)
              elem.removeAttribute('class');
            let modal = document.querySelector('div#headlessui-portal-root');
            removeDOMElement(modal);
            let par_first = true;
            function attach_text(sub_item, elem) {
              if (sub_item.value) {
                let sub_elem = document.createElement('span');
                sub_elem.innerText = sub_item.value;
                if (sub_item.marks && sub_item.marks.length) {
                  let style = '';
                  for (let mark of sub_item.marks) {
                    if (mark.type === 'bold')
                      style += 'font-weight: bold;';
                    else if (mark.type === 'italic')
                      style += 'font-style: italic;';
                    else if (mark.type === 'underline')
                      style += 'text-decoration: underline;';
                  }
                  sub_elem.style = style;
                }
                elem.appendChild(sub_elem);
              }
            }
            function attach_hyperlink(sub_item, elem) {
              if (sub_item.content && sub_item.content[0] && sub_item.content[0].value && sub_item.data && sub_item.data.uri) {
                let sub_elem = document.createElement('a');
                sub_elem.href = sub_item.data.uri;
                sub_elem.innerText = sub_item.content[0].value;
                if (!matchUrlDomain(['thejuggernaut.com', 'jgnt.co'], sub_item.data.uri))
                  sub_elem.target = '_blank';
                sub_elem.style = 'text-decoration: underline;';
                elem.appendChild(sub_elem);
              }
            }
            function attach_paragraph(par, elem) {
              if (par.content && par.content.length) {
                let span_elem = document.createElement('span');
                for (let item of par.content) {
                  if (item.nodeType === 'text') {
                    attach_text(item, span_elem);
                  } else if (item.nodeType === 'hyperlink') {
                    attach_hyperlink(item, span_elem);
                  } else
                    console.log(item);
                }
                elem.appendChild(span_elem);
              }
            }
            for (let par of pars) {
              let elem = document.createElement('p');
              if (par.nodeType.match(/^(paragraph|heading-\d)$/)) {
                attach_paragraph(par, elem);
              } else if (['blockquote'].includes(par.nodeType)) {
                if (par.content && par.content.length) {
                  for (let item of par.content) {
                    if (item.nodeType === 'paragraph') {
                      elem.style = 'margin: 0px 20px; font-style: italic;';
                      attach_paragraph(item, elem);
                    } else
                      console.log(item);
                  }
                }
              } else if (par.nodeType === 'hr') {
                elem.appendChild(document.createElement('hr'));
              } else if (par.nodeType === 'embedded-asset-block') {
                if (!par_first) {
                  if (par.data && par.data.target && par.data.target.fields) {
                    if (par.data.target.fields.file && par.data.target.fields.file.url) {
                      let figure = makeFigure(par.data.target.fields.file.url, par.data.target.fields.description);
                      elem.appendChild(figure);
                    }
                  }
                } else
                  par_first = false;
              } else if (par.nodeType === 'unordered-list') {
                if (par.content && par.content.length) {
                  let ul = document.createElement('ul');
                  for (let item of par.content) {
                    if (item.nodeType === 'list-item') {
                      if (item.content) {
                        for (let sub_item_par of item.content) {
                          if (sub_item_par.nodeType === 'paragraph') {
                            let li = document.createElement('li');
                            attach_paragraph(sub_item_par, li);
                            ul.appendChild(li);
                          }
                        }
                      }
                    } else
                      console.log(item);
                  }
                  elem.appendChild(ul);
                }
              } else {
                console.log(par);
              }
              if (elem.hasChildNodes()) {
                article.appendChild(document.createElement('br'));
                article.appendChild(elem);
              }
            }
          }
          }, 1000);
        } else
          refreshCurrentTab();
      } catch (err) {
        console.log(err);
      }
    }
  }
}

else if (matchDomain('thelampmagazine.com')) {
  let paywall = document.querySelector('div.paywall-gradient');
  if (paywall) {
    paywall.removeAttribute('class');
    let banner = document.querySelector('section.p-8');
    removeDOMElement(banner);
  }
  let login = document.querySelectorAll('a.js-login-modal-trigger');
  for (let elem of login) {
    elem.removeAttribute('class');
    let url_search = '/search?q=' + elem.innerText.replace(/\s/g, '+');
    elem.href = url_search;
    elem.onclick = x => window.location.href = url_search;
  }
}

else if (matchDomain('thelogic.co')) {
  setCookie('firstarticle', '', 'thelogic.co', '/', 0);
}

else if (matchDomain('thenewatlantis.com')) {
  let article_gated = document.querySelector('.article-gated');
  if (article_gated)
    article_gated.classList.remove('article-gated');
}

else if (matchDomain('thenewsminute.com')) {
  let paywall = document.querySelector('div#paywall-banner');
  if (paywall) {
    removeDOMElement(paywall);
    let fade = document.querySelector('div[class^="paywall-story-styles-"]');
    if (fade)
      fade.removeAttribute('class');
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = breakText(parseHtmlEntities(json.articleBody.replace(/\.\./g, '.\r\n\r\n')));
        let article = document.querySelector('div.arr--story-page-card-wrapper');
        if (json_text && article) {
          article.innerHTML = '';
          let article_new = document.createElement('p');
          article_new.innerText = json_text;
          article.appendChild(article_new);
        }
      }
    }
  }
}

else if (matchDomain('thepointmag.com')) {
  setCookie('monthly_history', '', 'thepointmag.com', '/', 0);
  let overlay = document.querySelectorAll('div.overlay, div#tpopup-');
  removeDOMElement(...overlay);
}

else if (matchDomain('thequint.com')) {
  window.setTimeout(function () {
    let lock = document.querySelector('div > img[alt^="lock"]');
    if (lock) {
      lock.removeAttribute('alt');
      let paywall = document.querySelector('div#paywall-widget');
      if (paywall) {
        removeDOMElement(paywall);
        let article = document.querySelector('div.story-element');
        if (article) {
          let article_new = getArticleQuintype();
          if (article_new && article.parentNode)
            article.parentNode.replaceChild(article_new, article);
        }
      }
      let body_hidden = document.querySelector('div#story-body-wrapper');
      if (body_hidden) {
        body_hidden.removeAttribute('class');
        body_hidden.removeAttribute('style');
      }
      function thequint_unhide(node) {
        node.removeAttribute('style');
      }
      waitDOMAttribute('div#story-body-wrapper', 'DIV', 'style', thequint_unhide, true);
    }
  }, 4000);
}

else if (matchDomain('theweek.com')) {
  let paywall = document.querySelector('div.kiosq-main-layer');
  removeDOMElement(paywall);
  let locker = document.querySelector('div.paywall-locker');
  if (locker)
    locker.classList.remove('paywall-locker');
}

else if (matchDomain('thewrap.com')) {
  setCookie('blaize_session', '', 'thewrap.com', '/', 0);
  getJsonUrl('div#zephr-payment-form-root', '', 'div.entry-content', {art_append: 1});
  let fade = document.querySelector('div.content-area div[style*="background-image: linear-gradient"]');
  removeDOMElement(fade);
}

else if (matchDomain('timeshighereducation.com')) {
  let paywall = document.querySelector('div.paywall-active');
  if (paywall) {
    removeDOMElement(paywall);
    let fade = document.querySelectorAll('div.paywall-fade');
    for (let elem of fade)
      elem.classList.remove('paywall-fade');
  }
  let hidden_images = document.querySelectorAll('img.b-lazy[src^="data:image/"][data-src]');
  for (let hidden_image of hidden_images) {
    hidden_image.setAttribute('src', hidden_image.getAttribute('data-src'));
    hidden_image.classList.remove('b-lazy');
    hidden_image.parentElement.classList.remove('media--loading');
  }
  let ads = 'div[data-ad-page], section.block-the-dfp';
  hideDOMStyle(ads);
}

else if (matchDomain('epaper.indiatimes.com')) {
  let blocker = document.querySelector('div.epaperBlockerWrap');
  removeDOMElement(blocker);
  if (window.location.pathname.startsWith('/english-news-paper-today-toi-print-edition/')) {
    let paywall = document.querySelector('section#blocker');
    if (paywall) {
      let fq = document.querySelector('section#fq');
      removeDOMElement(paywall, fq);
      let json_script = getArticleJsonScript();
      if (json_script) {
        let json = JSON.parse(json_script.text);
        if (json) {
          let json_text = json.articleBody;
          let content = document.querySelector('section[type="synopsis"]');
          if (json_text && content) {
            let article_new = document.createElement('p');
            article_new.innerText = breakText(json_text);
            content.innerHTML = '';
            addStyle('[type="synopsis"]::after {background: none !important;}');
            content.appendChild(article_new);
          }
        }
      }
    }
  }
}

else if (matchDomain(no_dn_media_domains)) {
  if (matchDomain('tradewindsnews.com') && window.location.pathname.startsWith('/markets/')) {
    let paywall = document.querySelector('iframe[src]');
    removeDOMElement(paywall);
    let overflow = document.querySelector('body[style]');
    if (overflow)
      overflow.removeAttribute('style');
    let blurred = document.querySelector('body > div[style]');
    if (blurred)
      blurred.removeAttribute('style');
  } else {
    window.setTimeout(function () {
      function dn_main(node) {
        let article = document.querySelector('div#dn-content');
        let json_script = document.querySelector('script#__NUXT_DATA__');
        if (article && json_script) {
          removeDOMElement(node.parentNode);
          try {
            let pars = JSON.parse(json_script.text);
            let article_id_index = (pars.indexOf('global-article') + 1) || (pars.indexOf('dn-article') + 1);
            if (article_id_index) {
              let article_id = pars[article_id_index];
              if (article_id && !window.location.pathname.endsWith(article_id)) {
                refreshCurrentTab();
                return;
              }
            } else {
              refreshCurrentTab();
              return;
            }
            article.innerHTML = '';
            article.classList.remove('shadow');
            let img_first = true;
            let parser = new DOMParser();
            for (let par of pars) {
              let elem;
              if (par && par.type) {
                let type = pars[par.type];
                if (['text', 'subhead'].includes(type)) {
                  if (par.html || par.value) {
                    let index = par.html || par.value;
                    let json_text = pars[index];
                    let content_new = parser.parseFromString('<p class="dn-text">' + json_text + '</p>', 'text/html');
                    elem = content_new.querySelector('p');
                    if (par.value)
                      elem.style = 'font-weight: bold;';
                  }
                } else if (type === 'picture') {
                  if (img_first)
                    img_first = false;
                  else {
                    let caption_text = pars[par.caption];
                    if (par.credit)
                      caption_text += ' (' + pars[par.credit] + ')';
                    elem = makeFigure(pars[par.src], caption_text);
                    elem.className = 'dn-image';
                  }
                } else if (type === 'embed') {
                  elem = document.createElement('div');
                  if (par.value) {
                    let content_new = parser.parseFromString('<div>' + pars[par.value] + '</div>', 'text/html');
                    let video = content_new.querySelector('div');
                    elem.appendChild(video);
                  }
                } else if (type === 'factbox') {
                  elem = document.createElement('p');
                  if (par.title)
                    elem.innerText = pars[par.title];
                  if (par.html) {
                    let content_new = parser.parseFromString('<div>' + pars[par.html] + '</div>', 'text/html');
                    let box = content_new.querySelector('div');
                    elem.appendChild(box);
                  }
                } else if (type === 'summary') {
                  if (par.bullets) {
                    elem = document.createElement('ul');
                    for (let item of pars[par.bullets]) {
                      let li = document.createElement('li');
                      li.innerText = pars[item];
                      elem.appendChild(li);
                    }
                  }
                } else if (type === 'news' && par.title && par.url) {
                  elem = document.createElement('p');
                  let sub_elem = document.createElement('a');
                  sub_elem.href = pars[par.url];
                  sub_elem.innerText = 'Related: ' + pars[par.title];
                  sub_elem.style = 'font-weight: bold;';
                  elem.appendChild(sub_elem);
                } else if (!['ad', 'ad_group', 'adobetarget', 'author', 'break', 'Emne', 'job', 'Location', 'ma_frame', 'news', 'Organisasjon', 'Organisation', 'Organization', 'promobox', 'Person', 'Personer', 'quote', 'readpeak', 'Region', 'Regions', 'related', 'Sector', 'Sectors', 'Selskap', 'Shiptype', 'Sted', 'Steder', 'Topic', 'ukens_stilling', 'video'].includes(type)) {
                  for (let item in par) {
                    console.log(item);
                    console.log(pars[par[item]]);
                  }
                }
                if (elem)
                  article.appendChild(elem);
              }
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
      let paywall_sel = 'div#sub-paywall-container';
      let paywall = document.querySelector(paywall_sel);
      if (paywall) {
        if (matchDomain('dn.no') && window.location.pathname.match(/^\/(d2|magasinet|smak)\//)) {
          removeDOMElement(paywall);
          let article = document.querySelector('article');
          if (article) {
            let url = window.location.href;
            article.firstChild.before(googleSearchToolLink(url));
            if (mobile) {
              let body = document.querySelector('body');
              if (body)
                body.style.width = '80%';
            }
          }
        } else {
          if (window.location.pathname.match(/^\/(e-avis|editions)/)) {
            removeDOMElement(paywall);
            header_nofix('section.wrapper');
          } else
            dn_main(paywall);
        }
      }
    }, 1000);
  }
  let ads = 'div.top-ad-placeholder, div.dn-dfp-container';
  hideDOMStyle(ads);
}

else if (matchDomain(usa_conde_nast_domains)) {
  let maps = document.querySelectorAll('div.map_wrapper');
  for (let elem of maps)
    elem.style.visibility = 'visible';
  let banners = 'div.ad, aside.paywall-bar, div[class^="MessageBannerWrapper-"], div.ad-stickyhero, div.ad_wrapper';
  hideDOMStyle(banners);
}

else if (matchDomain(usa_craincomm_domains)) {
  if (matchDomain('european-rubber-journal.com')) {
    let paywall = document.querySelector('div.article-overlay');
    if (paywall) {
      let fade = document.querySelector('div.gradient');
      removeDOMElement(paywall, fade);
      let truncated = document.querySelector('div.truncated');
      if (truncated)
        truncated.classList.remove('truncated');
    }
  } else {
    let sponsored_article = document.querySelector('div.sponsored-article');
    if (sponsored_article)
      sponsored_article.classList.remove('sponsored-article');
  }
  let ads = 'div.footer__ads-footer';
  hideDOMStyle(ads);
}

else if (matchDomain(usa_hearst_comm_mag_domains)) {
  let audio_tts = document.querySelector('audio[data-media-manager-id^="tts-"][style]');
  if (audio_tts) {
    let json_script = document.querySelector('script#__NEXT_DATA__');
    if (json_script) {
      try {
        let json = JSON.parse(json_script.text);
        let audio_src = findKeyJson(json, 'speech_file_url');
        if (audio_src) {
          audio_tts.removeAttribute('style');
          audio_tts.src = audio_src;
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
}

else if (matchDomain(usa_nymag_domains)) {
  document.querySelectorAll('iframe[data-src]:not([src])').forEach(e => e.src = e.getAttribute('data-src'));
  let ads = 'div.m-ad, section.ad-splash, aside.ad_static';
  hideDOMStyle(ads);
}

else if (matchDomain(usa_outside_mag_domains)) {
  let ads = 'div.js-ad';
  hideDOMStyle(ads);
}

else if (matchDomain(usa_penske_media_domains)) {
  let ads = 'div.admz';
  hideDOMStyle(ads);
}

else if (matchDomain(usa_tribune_domains)) {
  getJsonUrl('div.paywall-container', '', 'div.body-copy', {art_class: 'body-copy'});
  let ads = 'div.dfp-ad, div.bx-slab, div.sbn-widget-body, div#mobile-adhesion';
  hideDOMStyle(ads);
}

else if (matchDomain('vice.com')) {
  getJsonUrl('section.unlock-container', '', 'div.entry-content');
  let ads = 'div.lngtd-dyn-ph, div.lngtd-ad-wrapper-banner';
  hideDOMStyle(ads);
}

else if (matchDomain('vikatan.com')) {
  window.setTimeout(function () {
    let paywall = document.querySelector('div#paywallDisplay');
    if (paywall) {
      removeDOMElement(paywall);
      let json_script = getArticleJsonScript();
      if (json_script) {
        try {
          let json = JSON.parse(json_script.text);
          if (json) {
            let article = document.querySelector('div.story-element');
            if (article) {
              let parser = new DOMParser();
              let json_text = parseHtmlEntities(json.articleBody);
              let doc = parser.parseFromString('<div>' + json_text + '</div>', 'text/html');
              let content_new = doc.querySelector('div');
              let content = document.querySelector('div.story-element > div');
              if (content)
                content.parentNode.replaceChild(content_new, content);
              else
                article.appendChild(content_new);
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
      let story_hidden = document.querySelector('div[class^="styles-m__story-card-wrapper_"]');
      if (story_hidden)
        story_hidden.removeAttribute('class');
    }
  }, 1500);
  let ads = 'div[class^="styles-m__popup-wrapper-adb"]';
  hideDOMStyle(ads);
}

else if (matchDomain('voguebusiness.com')) {
  setCookie('userId', '', 'voguebusiness.com', '/', 0);
  let article = document.querySelector('article');
  if (article) {
    let pars = article.querySelectorAll('p:not([class]), p.paywall');
    if (pars.length < 5) {
      removeDOMElement(...pars);
      let filter = /^window\.__PRELOADED_STATE__\s?=\s?/;
      let json_script = getSourceJsonScript(filter, '[type]:not([src])');
      if (json_script) {
        try {
          let json = JSON.parse(json_script.text.split(filter)[1].split('};')[0] + '}');
          let body = document.querySelector('div.body__inner-container');
          if (body) {
            let pars = json.transformed.article.body;
            function makeElem(elem, par_elem) {
              if (Array.isArray(elem) && elem.length) {
                let elem_new;
                let item = elem[0];
                if (typeof item === 'string') {
                  if (['p', 'h2', 'em', 'strong'].includes(item)) {
                    elem_new = document.createElement(item);
                    par_elem.appendChild(elem_new);
                    elem.shift();
                    makeElem(elem, elem_new);
                  } else if (item === 'a' && elem.length > 2) {
                    elem_new = document.createElement('a');
                    let a_data = elem[1];
                    elem_new.href = a_data.href;
                    if (a_data.isExternal)
                      elem_new.target = '_blank';
                    makeElem(elem.slice(2), elem_new);
                    par_elem.appendChild(elem_new);
                  } else if (item === 'inline-embed' || !(['ad', 'cm-unit', 'inline-newsletter', 'journey-inline-newsletter', 'native-ad'].includes(item) || (item.length < 30 && item.includes('inline-embed')))) {
                    if (item === 'inline-embed') {
                      let img_data = elem[1];
                      if (img_data && img_data.type === 'image') {
                        if (img_data.props && img_data.props.image && img_data.props.image.sources) {
                          let caption_text;
                          if (img_data.props.dangerousCaption) {
                            caption_text = img_data.props.dangerousCaption.replace(/<\/?\w+>/g, '');
                            if (img_data.props.dangerousCredit)
                              caption_text += ' ' + img_data.props.dangerousCredit;
                          }
                          let figure = makeFigure(img_data.props.image.sources.lg.url, caption_text);
                          par_elem.appendChild(figure);
                        }
                      }
                    } else {
                      elem_new = document.createTextNode(item);
                      par_elem.appendChild(elem_new);
                      elem.shift();
                      makeElem(elem, par_elem);
                    }
                  }
                } else if (Array.isArray(item)) {
                  if (['a', 'em', 'strong'].includes(item[0])) {
                    makeElem(item, par_elem);
                    elem.shift();
                    makeElem(elem, par_elem);
                  } else {
                    console.log(item);
                  }
                } else if (typeof item === 'object') {
                  if (!item.class)
                    console.log(item);
                  elem.shift();
                  makeElem(elem, par_elem);
                }
              } else if (typeof elem === 'string' && !['div'].includes(elem)) {
                par_elem.appendChild(document.createTextNode(elem));
              }
            }
            for (let par of pars)
              makeElem(par, body);
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
}

else if (matchDomain('vox.com')) {
  let ads = 'div[data-concert]';
  hideDOMStyle(ads);
}

else if (matchDomain('warontherocks.com')) {
  if (window.location.pathname.startsWith('/episode/')) {
    header_nofix('div.single-content-section', 'a[href ^= "https://warontherocks.com/subscribe"]');
  } else {
    let paywall_sel = 'a[href^="https://warontherocks.com/membership"]';
    let article_sel = 'div.tw\\:container.tw\\:mb-20>div';
    getJsonUrl(paywall_sel, '', article_sel);
  }
}

else if (matchDomain('washingtonpost.com')) {
  let paywall_sel = 'div.meteredContent';
  let paywall = document.querySelector(paywall_sel);
  if (paywall) {
    let article = document.querySelector('div:not(.teaser-content) > div.article-body');
    if (!article) {
      let url = window.location.href;
      getArchive(url, paywall_sel, {rm_class: 'meteredContent'}, 'div.teaser-content', '', 'article > div > div[style*="grid-column-end"]');
    }
  }
  let ads = 'wp-ad-wrapper, div[data-qa$="-ad"], div[data-component="Ad"], div[data-qa="outbrain"], div.PJLV-ifmxCWD-css';
  hideDOMStyle(ads);
}

else if (matchDomain('winnipegfreepress.com')) {
  let ads = '.billboard-ad-space, .ad, .article-ad, .fixed-sky';
  hideDOMStyle(ads);
}

else if (matchDomain('wsj.com')) {
  if (window.location.pathname.startsWith('/livecoverage/')) {
    window.setTimeout(function () {
      fix_dowjones_live();
    }, 1500);
  } else {
    let paywall_sel = '.snippet-promotion, div[id*="-snippet-overlay"]';
    let paywall = document.querySelector(paywall_sel);
    if (paywall) {
      let url = window.location.href;
      let article_sel = 'article section';
      let wsj_pro = paywall.querySelector('a[href^="https://wsjpro.com/"]');
      if (wsj_pro)
        article_sel = 'article';
      let article = document.querySelector(article_sel);
      if (article) {
        let video_sel = 'div[data-type="video"]';
        let video = document.querySelector(video_sel);
        let schema_script = document.querySelector('script#articleschema');
        func_post = function () {
          let pars = document.querySelectorAll(article_sel + ' div[style*="font-family:"]');
          if (pars.length < 5)
            header_nofix(article_sel, '', 'BPC > no archive-fix');
          if (video) {
            let video_new = document.querySelector(video_sel);
            if (video_new && video_new.parentNode)
              video_new.parentNode.replaceChild(video, video_new);
          }
          let inline_videos = document.querySelectorAll('div[id^="video"]');
          for (let inline_video of inline_videos) {
            let video_id = inline_video.id.replace('video', '');
            if (video_id && schema_script) {
              try {
                let video_data = JSON.parse(schema_script.text).find(x => x['@type'] === 'VideoObject' && x.embedUrl.includes(video_id));
                if (video_data && inline_video.parentNode) {
                  let elem = document.createElement('iframe');
                  elem.src = video_data.embedUrl;
                  elem.style = 'width: ' + inline_video.offsetWidth + 'px; height: ' + inline_video.offsetWidth * 3 / 4 + 'px;';
                  inline_video.parentNode.replaceChild(elem, inline_video);
                }
              } catch (err) {
                console.log(err);
              }
            }
          }
          if (mobile) {
            let inline_images = document.querySelectorAll('div[style] > figure > picture > img');
            for (let elem of inline_images) {
              elem.style = 'width: 100%;';
              elem.removeAttribute('height');
              elem.removeAttribute('width');
              elem.parentNode.removeAttribute('style');
              elem.parentNode.parentNode.parentNode.removeAttribute('style');
            }
            let inline_data = document.querySelectorAll('div[data-layout="inline"][style]');
            for (let elem of inline_data)
              elem.removeAttribute('style');
          }
          let read_next = document.querySelector('div#cx-what-to-read-next');
          removeDOMElement(read_next);
          let inline_wrappers = document.querySelectorAll('div[style*="background-position"] > div[id^="wrapper-INLINEIMM_"]');
          for (let elem of inline_wrappers)
            removeDOMElement(elem.parentNode);
        }
        getArchive(url, paywall_sel, '', article_sel);
      }
    }
  }
  let ads = 'div.wsj-ad, div.adWrapper, div.css-xgokil-Box, div#cx-article-cover-overlay';
  hideDOMStyle(ads);
}

else if (matchDomain('ynet.co.il')) {
  let paywall = document.querySelector('div.paywall-wrapper');
  if (paywall) {
    removeDOMElement(paywall);
    window.location.href = window.location.pathname + '?rel=plus';
  }
}

else if (matchDomain(ke_nation_media_domains)) {
  let paywall = document.querySelectorAll('div.modal, [id*="wall"], section.wall-guard');
  if (paywall.length) {
    removeDOMElement(...paywall);
    func_post = function () {
      let div_hidden = document.querySelectorAll('div.article-page .nmgp');
      for (let elem of div_hidden)
        elem.classList.remove('nmgp');
      let page_hidden = document.querySelector('div.article-page .hidden');
      if (page_hidden)
        page_hidden.classList.remove('hidden');
      let lazy_images = document.querySelectorAll('img.lazy-img[data-srcset]:not([src])');
      for (let elem of lazy_images) {
        elem.src = elem.getAttribute('data-srcset').split(',').pop().split(' ')[0];
        elem.classList.remove('lazy-img');
        elem.style = 'margin: 0px 20px';
      }
      let videos = document.querySelectorAll('iframe.lazy-iframe_iframe[data-src]:not([src])');
      for (let elem of videos) {
        elem.src = elem.getAttribute('data-src');
        elem.removeAttribute('class');
      }
    }
    let url = window.location.href;
    replaceDomElementExt(url, false, false, 'div.blk-txt');
  }
  let banners = 'div.banner, div.spinner';
  hideDOMStyle(banners);
}

else if ((domain = matchDomain(usa_gannett_domains)) || document.querySelector('head > link[href*="/gannett_net.js"], footer a[href^="https://www.gannett.com"]')) {
  if (!domain)
    domain = window.location.hostname.replace(/^(www|amp|eu)\./, '');
  setCookie('firefly_akamai_meter', '', domain, '/', 0);
  if (window.location.pathname.endsWith('/restricted/') && window.location.search.startsWith('?return=')) {
    let url = decodeURIComponent(window.location.href.split('?return=')[1]);
    let paywall = pageContains('div.message', 'This content is only available to subscribers.');
    if (paywall.length) {
      removeDOMElement(...paywall);
      let article = document.querySelector('article');
      if (article)
        article.firstChild.before(archiveLink(url));
    }
  }
  let ads = 'aside[aria-label="advertisement"]';
  hideDOMStyle(ads);
}

else if (matchDomain(usa_hearst_comm_domains) || document.querySelector('head > script[src*="/treg.hearstnp.com/"]')) {
  addStyle('body {overflow: visible!important;}');
  let ads = 'div[data-block-type="ad"], div[data-widget-host="revcontent"], div.b-gray300, div#mod-target-div';
  hideDOMStyle(ads);
}

else if (matchDomain(usa_lee_ent_domains.concat(ca_torstar_domains, ['abqjournal.com'])) || document.querySelector('head > meta[name="tncms-access-version"]')) {
  if (window.location.pathname.endsWith('.amp.html')) {
    amp_unhide_access_hide('="hasAccess"', '="NOT hasAccess"', '.amp-ads-container');
    let elem_hidden = document.querySelectorAll('html[class], body[class]');
    for (let elem of elem_hidden)
      elem.removeAttribute('class');
    let amp_images = document.querySelectorAll('div.main-content amp-img[src^="https://"]');
    for (let amp_image of amp_images) {
      let elem = document.createElement('img');
      Object.assign(elem, {
        src: amp_image.getAttribute('src'),
        alt: amp_image.getAttribute('alt'),
        height: '400'
      });
      amp_image.parentNode.replaceChild(elem, amp_image);
    }
  } else {
    if (true) {
      function unscramble(t) {
        for (var n = "", i = 0, r = t.length; i < r; i++) {
          var s = t.charCodeAt(i);
          if (s >= 33 && s <= 126) {
            var sTmp = String.fromCharCode(33 + (s - 33 + 47) % 94);
            n += sTmp;
          } else
            n += t.charAt(i);
        }
        return n;
      }
      let paywall = document.querySelector('div.subscriber-offers');
      removeDOMElement(paywall);
      let subscriber_only = document.querySelectorAll('div.subscriber-only');
      for (let elem of subscriber_only) {
        if (elem.classList.contains('encrypted-content')) {
          elem.innerHTML = unscramble(elem.textContent);
        }
        elem.removeAttribute('style');
        elem.removeAttribute('class');
      }
      let banners = document.querySelectorAll('div.subscription-required, div.redacted-overlay');
      removeDOMElement(...banners);
    }
    let ads = 'div.tnt-ads-container, div[class*="adLabelWrapper"], div.globalHeaderBillboard';
    hideDOMStyle(ads);
  }
}

else if (matchDomain(usa_mcc_domains) || document.querySelector('head > link[href^="https://mcclatchy-d.openx.net"], footer a[href^="https://www.mcclatchy.com/privacy-policy"]')) {
  if (window.location.hostname.startsWith('amp.')) {
    amp_unhide_subscr_section();
    let subscriptions_action = document.querySelector('div[subscriptions-action][subscriptions-display="NOT data.hasError"]');
    if (subscriptions_action)
      subscriptions_action.removeAttribute('subscriptions-action');
    let art_cropped = document.querySelector('div.article-body.cropped');
    if (art_cropped)
      art_cropped.classList.remove('cropped');
    let subscr_tag = document.querySelector('div#subscriber-exclusive-tag');
    let amp_players = document.querySelectorAll('amp-connatix-player, amp-iframe.trinity-player');
    removeDOMElement(subscr_tag, ...amp_players);
    let amp_images = document.querySelectorAll('amp-img[srcset]:not([src])');
    for (let elem of amp_images) {
      let img = document.createElement('img');
      img.src = elem.getAttribute('srcset').split(' ')[0],
      img.alt = elem.getAttribute('alt'),
      img.style = 'width: 100%;';
      elem.parentNode.replaceChild(img, elem);
    }
  } else {
    window.setTimeout(function () {
      let paywall = document.querySelector('p#yzwall');
      if (paywall) {
        removeDOMElement(paywall);
        let pars_hidden = document.querySelectorAll('.yzfade, .yzarret');
        for (let elem of pars_hidden)
          elem.removeAttribute('class');
      }
    }, 1000);
  }
  let ads = 'div[data-type="ad"], div.vf-promo, div#ymovrly, div.ad__slot--wrapper, connatix-video-ad, px-sellwild';
  hideDOMStyle(ads);
}

else if (matchDomain(usa_mng_domains) || document.querySelector('head > link[rel="stylesheet"][id^="dfm-accuweather-"], footer li > a[href^="https://www.medianewsgroup.com"]')) {
  if (window.location.pathname.endsWith('/amp/'))
    amp_unhide_subscr_section('div.ampWrapperInside, div#paywall');
  else if (true) {
    let paywall_sel = '#server-paywall';
    let paywall = document.querySelector(paywall_sel);
    let article_sel = 'div.body-copy';
    let article = document.querySelector(article_sel);
    if (paywall && article) {
      func_post = function () {
        let slideshow = article.querySelector('div.article-slideshow');
        if (slideshow) {
          slideshow.removeAttribute('class');
          let image_wrappers = slideshow.querySelectorAll('div.image-wrapper');
          for (let elem of image_wrappers) {
            elem.removeAttribute('class');
            elem.style = 'margin: 20px 0px;';
          }
          let caption = 'div.mng-gallery-information-container, button.icon-close';
          hideDOMStyle(caption, 2);
        }
        if (iframe)
          article.appendChild(iframe);
      }
      let iframe = article.querySelector('iframe');
      getJsonUrl(paywall_sel, '', article_sel, {art_append: 1, art_class: 'body-copy'});
    }
    let ads = 'div.dfp-ad';
    hideDOMStyle(ads);
  }
}

else if (document.querySelector('head > script[src*=".axate.io/"]')) {
  let premium = document.querySelector('.premium, div[class*="-premium"]');
  if (premium)
    premium.removeAttribute('class');
}

else if (document.querySelector('head > meta[property][content^="https://cdn.forumcomm.com/"]')) {
  let ads = 'div.GoogleDfpAd-Content';
  hideDOMStyle(ads);
}

else if (document.querySelector('head > script[src*=".postmedia.digital/"], head > meta[content*=".postmedia.digital/"]')) {
  let ads = 'div.ad__section-border, div[id^="tbl_"], div.js-widget-content, section.ad';
  hideDOMStyle(ads);
}

else if (document.querySelector('head > link[href$=".wallkit.net"]')) {
  let paywall = document.querySelector('div.wkwp-paywall');
  if (paywall)
    paywall.removeAttribute('class');
  hideDOMStyle('div.wkwp-paywall-block');
}

}

ads_hide();
leaky_paywall_unhide();

}, 1000);

// General Functions

// import (see @require)

function fix_dowjones_live() {
  let paywall = document.querySelector('div#cx-lc-snippet');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      try {
        let json = JSON.parse(json_script.text);
        if (json) {
          let article = document.querySelector('div[data-id="StreamBody_index_MainContainer"]');
          if (article) {
            let pars = json[0].liveBlogUpdate;
            for (let par of pars) {
              if (par.headline && par.articleBody) {
                let headline = document.createElement('p');
                headline.innerText = par.headline;
                headline.style = 'font-weight: bold;';
                let author = document.createElement('a');
                if (par.author && par.author.sameAs) {
                  author.href = par.author.sameAs[0];
                  author.innerText = par.author.name;
                }
                let date = document.createElement('p');
                if (par.dateModified && par.datePublished) {
                  date.innerText = 'Updated ' + par.dateModified.replace(/(T|:\d+\.\d+Z$)/g, ' ') + ' ET / Original ' + par.datePublished.replace(/(T|:\d+\.\d+Z$)/g, ' ') + ' ET';
                }
                let body = document.createElement('p');
                body.innerText = par.articleBody;
                article.after(headline, author, date, body);
              }
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    let fade = document.querySelectorAll('div[class*="-CardWrapper"]');
    for (let elem of fade)
      elem.removeAttribute('class');
  }
}

function fix_dowjones_fetch(url_src, data, article) {
  try {
    if (data) {
      let json = JSON.parse(data);
      if (json && json.screens[0] && json.screens[0].frames) {
        let pars = json.screens[0].frames;
        let par_class;
        let intro = article.querySelector('p[class], [data-type="hed"]');
        if (intro) {
          if (intro.tagName === 'P')
            par_class = intro.className;
          else {
            let par_first = article.querySelector('p[class]');
            if (par_first)
              par_class = par_first.className;
          }
        }
        if (matchDomain('barrons.com')) {
          let style_fl = document.querySelector('head > style[data-emotion-css]');
          if (style_fl && style_fl.innerHTML.includes(':first-letter')) {
            let styles_fl = document.querySelectorAll('head > style[data-emotion-css], head > style[data-emotion="emotion"]');
            for (let style of styles_fl) {
              if (style.innerHTML.includes(':first-letter'))
                removeDOMElement(style);
            }
          }
        }
        let body_first = true;
        let img_lead = document.querySelector('div.img__lead img[src], div.featured-image img[src]');
        let img_lead_url;
        if (img_lead)
          img_lead_url = img_lead.src.split('?')[0];
        article.innerHTML = '';
        function addBodyText(elem, par) {
          if (par.body && par.body.text) {
            if (par.body.additions) {
              let items = par.body.additions.filter(x => x.type === 'link' && x.value && x.hasOwnProperty('rangeStart') && x.rangeLength);
              if (items.length) {
                function addLink(item, body_part, start_index) {
                  item.rangeStart = item.rangeStart - start_index;
                  let start = body_part.substring(0, item.rangeStart);
                  let middle = body_part.substring(item.rangeStart, item.rangeStart + item.rangeLength);
                  let end = body_part.substring(item.rangeStart + item.rangeLength);
                  let sub_elem = document.createElement('a');
                  sub_elem.href = item.value;
                  sub_elem.innerText = middle;
                  sub_elem.style = 'text-decoration: underline;';
                  elem.append(document.createTextNode(start.replace(/\s_/g, '')), sub_elem, document.createTextNode(end.replace(/\s_/g, '')));
                }
                let start_index = end_index = 0;
                for (let item of items) {
                  end_index = start_index + item.rangeStart + item.rangeLength;
                  let body_part = par.body.text.substring(start_index, end_index);
                  addLink(item, body_part, start_index);
                  start_index = end_index;
                }
                if (end_index)
                  elem.appendChild(document.createTextNode(par.body.text.substring(end_index).replace(/\s_/g, '')));
              } else
                elem.innerText = par.body.text.replace(/\s_/g, '');
            } else
              elem.innerText = par.body.text.replace(/\s_/g, '');
          }
        }
        for (let par of pars) {
          let elem = document.createElement('p');
          if (par_class)
            elem.className = par_class;
          if (par.type === 'body') {
            if (par.body && par.styleID.match(/(default|bodyFrame|article-body)/)) {
              if (body_first && intro) {
                elem = intro;
                body_first = false;
              } else
                addBodyText(elem, par);
            }
          } else if (par.type === 'listelement') {
            if (par.body) {
              elem.appendChild(document.createTextNode(' • '));
              addBodyText(elem, par);
            }
          } else if (par.type === 'image') {
            if (par.image && par.image.url && !(img_lead_url && par.image.url.startsWith(img_lead_url))) {
              let caption = (par.caption ? par.caption.text + ' - ' : '') + (par.credit ? par.credit.text : '');
              elem = makeFigure(par.image.url, caption, {
                style: 'width: 80%; margin: auto;'
              });
            }
          } else if (['article', 'inlineArticle'].includes(par.type) && par.title && par.title.text && par.shareUrl) {
            let sub_elem = document.createElement('a');
            sub_elem.href = par.shareUrl;
            sub_elem.innerText = par.title.text;
            sub_elem.style = 'font-weight: bold;';
            elem.appendChild(sub_elem);
          } else if (par.type === 'dynamicinset') {
            if (par.webview && par.webview.value) {
              let iframe = document.createElement('iframe');
              iframe.src = par.webview.value;
              iframe.style = 'height: 600px; width: 100%; border: none;';
              elem.appendChild(iframe);
            }
          } else if (par.type === 'screen') {
            if (par.screen && par.screen.frames) {
              elem = document.createElement('p');
              let sub_elem = document.createElement('table');
              let row_new = true;
              let tr;
              for (let frame of par.screen.frames) {
                if (row_new) {
                  tr = document.createElement('tr');
                  row_new = false;
                }
                if (frame.body) {
                  let td = document.createElement('td');
                  td.innerText = frame.body.text;
                  tr.appendChild(td);
                } else if (frame.type === 'divider') {
                  sub_elem.appendChild(tr);
                  row_new = true;
                }
              }
              sub_elem.appendChild(tr);
              elem.appendChild(sub_elem);
            } else
              console.log(par);
          } else if (par.type === 'video') {
            if (par.url) {
              let video = document.createElement('video');
              video.src = par.url;
              video.setAttribute('controls', '');
              video.style = 'width: 100%;';
              elem.appendChild(video);
            }
          } else if (par.type === 'youtube') {
             if (par.videoId) {
               elem = document.createElement('p');
               let sub_elem = document.createElement('iframe');
               sub_elem.src = 'https://www.youtube.com/embed/' + par.videoId;
               sub_elem.style = 'width: 100%; height: 400px;';
               elem.appendChild(sub_elem);
             }
          } else if (!['ad', 'audioplayer', 'authorBios', 'byline', 'caption', 'columnistHeader', 'divider', 'inlineComment', 'paywall-promotion', 'pullquote', 'pullquotebody', 'scrollinggallery', 'sectionTitle', 'tagCloud', 'tags', 'title', 'verticalContainer', 'webview'].includes(par.type)) {
            console.log(par);
          }
          if (elem.hasChildNodes())
            article.appendChild(elem);
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
}

})();
