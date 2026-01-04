// ==UserScript==
// @name            Bypass Paywalls Clean - fr
// @version         4.2.7.1
// @description     Bypass Paywalls of news sites
// @author          magnolia1234
// @homepageURL     https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters
// @supportURL      https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters
// @license         MIT; https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=LICENSE
// @noframes
// @match           *://*.fr/*
// @match           *://*.aoc.media/*
// @match           *://*.arcinfo.ch/*
// @match           *://*.bienpublic.com/*
// @match           *://*.businessam.be/*
// @match           *://*.connaissancedesarts.com/*
// @match           *://*.courrierinternational.com/*
// @match           *://*.dhnet.be/*
// @match           *://*.femmesdaujourdhui.be/*
// @match           *://*.flair.be/fr/*
// @match           *://*.jeuneafrique.com/*
// @match           *://*.journaldunet.com/*
// @match           *://*.la-croix.com/*
// @match           *://*.lacote.ch/*
// @match           *://*.lalibre.be/*
// @match           *://*.lavenir.net/*
// @match           *://*.lecho.be/*
// @match           *://*.ledauphine.com/*
// @match           *://*.ledevoir.com/*
// @match           *://*.legrandcontinent.eu/*
// @match           *://*.lejsl.com/*
// @match           *://*.lenouvelliste.ch/*
// @match           *://*.lerevenu.com/*
// @match           *://*.lesinrocks.com/*
// @match           *://*.lesoir.be/*
// @match           *://*.letemps.ch/*
// @match           *://*.levif.be/*
// @match           *://*.loeildelaphotographie.com/*
// @match           *://*.marianne.net/*
// @match           *://*.monacomatin.mc/*
// @match           *://*.moustique.be/*
// @match           *://*.parismatch.com/*
// @match           *://*.philonomist.com/fr/*
// @match           *://*.pourleco.com/*
// @match           *://*.science-et-vie.com/*
// @match           *://*.sudinfo.be/*
// @match           *://*.valeursactuelles.com/*
// @connect         archive.fo
// @connect         archive.is
// @connect         archive.li
// @connect         archive.md
// @connect         archive.ph
// @connect         archive.vn
// @connect         apps.lemonde.fr
// @exclude         *://*.poool.fr/*
// @exclude         *://*.weborama.fr/*
// @grant           GM.xmlHttpRequest
// @namespace https://greasyfork.org/users/1493917
// @downloadURL https://update.greasyfork.org/scripts/542354/Bypass%20Paywalls%20Clean%20-%20fr.user.js
// @updateURL https://update.greasyfork.org/scripts/542354/Bypass%20Paywalls%20Clean%20-%20fr.meta.js
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

window.setTimeout(function () {

var be_groupe_ipm_domains = ['dhnet.be', 'lalibre.be', 'lavenir.net', 'moustique.be'];
var be_roularta_domains = ['femmesdaujourdhui.be', 'flair.be', 'levif.be'];
var fr_be_groupe_rossel_domains = ['aisnenouvelle.fr', 'courrier-picard.fr', 'lardennais.fr', 'lavoixdunord.fr', 'lemessager.fr', 'lesoir.be', 'lest-eclair.fr', 'liberation-champagne.fr', 'lunion.fr', 'nordlittoral.fr', 'paris-normandie.fr', 'sudinfo.be'];
var fr_gcf_custom_domains = ['larep.fr', 'leberry.fr', 'lechorepublicain.fr', 'lejdc.fr', 'lepopulaire.fr', 'leveil.fr', 'lyonne.fr'];
var fr_groupe_ebra_domains = ['bienpublic.com', 'dna.fr', 'estrepublicain.fr', 'lalsace.fr', 'ledauphine.com', 'lejsl.com', 'leprogres.fr', 'republicain-lorrain.fr', 'vosgesmatin.fr'];
var fr_groupe_la_depeche_domains = ['centrepresseaveyron.fr', 'journaldemillau.fr', 'ladepeche.fr', 'lindependant.fr', 'midilibre.fr', 'nrpyrenees.fr', 'petitbleu.fr', 'rugbyrama.fr'];
var fr_groupe_la_manche_libre_custom_domains = ['echoancenis.fr', 'echoduberry.fr', 'hautanjou.fr', 'larenaissancehebdo.fr', 'lecourriercauchois.fr', 'lecourrierdelamayenne.fr'];
var fr_groupe_nice_matin_domains = ['monacomatin.mc', 'nicematin.com', 'varmatin.com'];

if (matchDomain('alternatives-economiques.fr')) {
  window.setTimeout(function () {
    let paywall = document.querySelector('#temp-paywall');
    removeDOMElement(paywall);
    let data_ae_poool = document.querySelector('div[data-ae-poool]');
    if (data_ae_poool)
      data_ae_poool.removeAttribute('style');
  }, 1000); // Delay (in milliseconds)
}

else if (matchDomain('aoc.media')) {
  func_post = function () {
    let article = document.querySelector('section.bottom-article');
    if (article)
      article.style = 'margin-bottom: 25px;';
  }
  getJsonUrl('section.article-payant', '', 'div.premium-article');
}

else if (matchDomain(['arcinfo.ch', 'lacote.ch', 'lenouvelliste.ch'])) {// Groupe ESH Médias
  window.setTimeout(function () {
  let paywall = document.querySelector('section#paywall-articles');
  if (paywall) {
    removeDOMElement(paywall);
    let url_id = window.location.pathname.match(/\d+$/).pop();
    let html = document.documentElement.outerHTML;
    let json;
    if (html.includes('window.__NUXT__=')) {
      json = html.split('window.__NUXT__=')[1].split('</script>')[0].trim().replace(/blocs:\[\{.*?\}\],/g, '');
      if (url_id && !json.includes('{"' + url_id + '":'))
        refreshCurrentTab();
    }
    let article = document.querySelector('div.html-content');
    let no_intro = false;
    if (!article) {
      article = document.querySelector('div.container-mobile-full');
      no_intro = true;
    }
    if (article && json) {
      let content = '';
      if (json.includes('text_1="'))
        content = json.split('text_1="').pop().split('";')[0];
      else {
        let parts = json.split('html:"');
        parts.splice(0, 1);
        for (let part of parts)
          content += part.split('",has_pre_content')[0];
      }
      if (content) {
        content = content.replace(/\\u003C/g, '<').replace(/\\u003E/g, '>').replace(/\\u002F/g, '/').replace(/\\"/g, '"').replace(/\\r\\n/g, '');
        let parser = new DOMParser();
        let content_new = parser.parseFromString('<div class="html-content">' + content + '</div>', 'text/html');
        let iframely = content_new.querySelectorAll('div > div.fr-iframely');
        for (let elem of iframely) {
          let url_dom = elem.querySelector('[data-iframely-url]');
          if (url_dom) {
            let iframe = document.createElement('iframe');
            iframe.src = url_dom.getAttribute('data-iframely-url');
            iframe.style = 'width: 100%; height: 400px;';
            elem.parentNode.replaceChild(iframe, elem);
          }
        }
        let article_top;
        if (!no_intro) {
          article_top = article.parentNode.parentNode;
          removeDOMElement(article.parentNode);
        } else
          article_top = article;
        article_top.appendChild(content_new.querySelector('div'));
      } else {
        refreshCurrentTab();
      }
    }
  }
  }, 2000);
  let ads = 'div[class*="ads_type_"]';
  hideDOMStyle(ads);
}

else if (matchDomain('atlantico.fr')) {
  let ads = 'div#pv_atf, div#infeed';
  hideDOMStyle(ads);
}

else if (matchDomain('autohebdo.fr')) {
  if (window.location.hostname.startsWith('www.') && window.location.pathname.endsWith('.html'))
    getJsonUrl('div.box-info.yellow', '', 'div.editor', {art_append: 1});
}

else if (matchDomain(be_groupe_ipm_domains)) {
  let paywall = document.querySelector('div.is-preview');
  if (paywall) {
    paywall.classList.remove('is-preview');
    window.setTimeout(function () {
      let div_hidden = document.querySelector('div.is-hidden');
      if (div_hidden)
        div_hidden.classList.remove('is-hidden');
    }, 500);
  }
  let ads = 'div.ap-AdContainer';
  hideDOMStyle(ads);
}

else if (matchDomain('businessam.be')) {
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div.text-gradient');
    if (article) {
      let filter = /window\.fullcontent64\s?=\s?"/;
      let content_script = getSourceJsonScript(filter);
      if (content_script) {
        try {
          let content = decode_utf8(atob(content_script.text.split(filter)[1].split('";')[0]));
          let parser = new DOMParser();
          let doc = parser.parseFromString('<div>' + content + '</div>', 'text/html');
          let content_new = doc.querySelector('div');
          article.parentNode.replaceChild(content_new, article);
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
}

else if (matchDomain('capital.fr')) {
  let paywall = document.querySelector('div#articleWall-wrapper');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div#articleWall > div#articleWall-paid');
    if (article) {
      article.removeAttribute('class');
      article.removeAttribute('hidden');
      article.style['margin-top'] = '40px';
      article.parentNode.removeAttribute('class');
    }
  }
  let videos = document.querySelectorAll('div > div#prisma-player-leader[data-ads-core*="Dailymotion"]');
  for (let video of videos) {
    try {
      let json = JSON.parse(video.getAttribute('data-ads-core'));
      if (json && json.playerVideoId) {
        let iframe = document.createElement('iframe');
        iframe.src = 'https://www.dailymotion.com/embed/video/' + json.playerVideoId;
        iframe.style = 'height: ' + video.offsetHeight + 'px; width: ' + video.offsetWidth + 'px;';
        video.parentNode.replaceChild(iframe, video);
      }
    } catch (err) {
      console.log(err);
    }
  }
  let ads = 'div.ad, div.ads-display, div.outbrain-ads';
  hideDOMStyle(ads);
}

else if (matchDomain(['challenges.fr', 'sciencesetavenir.fr'])) {
  if (window.location.pathname.endsWith('.amp')) {
    amp_unhide_access_hide('="paywall.access OR cha.access"', '="NOT (paywall.access OR cha.access)"');
  } else {
    let content = document.querySelectorAll('.user-paying-content');
    for (let elem of content) {
      elem.classList.remove('user-paying-content');
      elem.removeAttribute('hidden');
    }
    let paywall = document.querySelector('.temp-paywall');
    removeDOMElement(paywall);
    let amorce = 'div.amorce.manual';
    let ads = 'div[class*="pub-container"], div[id^="moneytag-"], div.pub-banniere-haute';
    hideDOMStyle(amorce + ', ' + ads);
  }
}

else if (matchDomain('charliehebdo.fr')) {
  let paywall = document.querySelector('div#paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('article[id^="post-"]');
    if (article) {
      let article_id = article.id.split('post-')[1];
      if (article_id) {
        let intro_pars = article.querySelectorAll('div#principal > p');
        if (intro_pars.length) {
          let url = window.location.href;
          let json_url = 'https://charliehebdo.fr/wp-json/wp/v2/posts/' + article_id + '?appkey=' + 'JeSuisCharlie2023';
          fetch(json_url)
          .then(response => {
            if (response.ok) {
              response.json().then(json => {
                let json_text = json.content.rendered;
                if (json_text) {
                  let parser = new DOMParser();
                  let doc = parser.parseFromString('<div>' + json_text + '</div>', 'text/html');
                  let article_new = doc.querySelector('div');
                  intro_pars[0].before(article_new);
                  removeDOMElement(...intro_pars);
                }
              });
            }
          });
        }
      }
    }
  }
}

else if (matchDomain('connaissancedesarts.com')) {
  let ads = 'div[class*="banniere"]';
  hideDOMStyle(ads);
}

else if (matchDomain('courrierinternational.com')) {
  let paywall = document.querySelector('div#bloc_paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let article_sel = 'div.article-text';
    let article = document.querySelector(article_sel);
    if (article) {
      let url = window.location.href;
      let url_src = 'https://apps.courrierinternational.com/cri/v1/premium-android-phone/article?id=' + encodeURIComponent(window.location.pathname);
      let json_key = 'templates.raw_content.content';
      getExtFetch(url_src, json_key, {}, main_cri);
      function main_cri(url, data) {
        try {
          if (data) {
            let parser = new DOMParser();
            let doc = parser.parseFromString(data, 'text/html');
            let article_new = doc.querySelector(article_sel);
            if (article_new) {
              article_new.querySelectorAll('a[href^="crifr://article?id="]').forEach(e => e.href = decodeURIComponent(e.href.split('crifr://article?id=')[1].split('&')[0]).split('?')[0]);
              article.parentNode.replaceChild(article_new, article);
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
  let ads = 'div.dfp-slot, div.dfp__container';
  hideDOMStyle(ads);
}

else if (matchDomain('elle.fr')) {
  if (window.location.hostname.startsWith('amp.')) {
    amp_unhide_access_hide('="poool.access OR cmi_premium.access"');
  } else {
    let hidden_images = document.querySelectorAll('img[src^="data:image/"][data-src]');
    for (let hidden_image of hidden_images)
      hidden_image.setAttribute('src', hidden_image.getAttribute('data-src'));
    let subscription_bar = document.querySelector('.tc-subscription-bar');
    removeDOMElement(subscription_bar);
  }
  let ads = 'div[class*="--placeholder"]';
  hideDOMStyle(ads);
}

else if (matchDomain(fr_be_groupe_rossel_domains)) {
  let paywall = document.querySelector('r-panel.r-panel--paywall');
  if (paywall) {
    removeDOMElement(paywall);
    hideDOMStyle('r-mini-panel.r-mini-panel--froomle, div.r-paywall', 2);
    let article = document.querySelector('article.r-article > r-article--section, div.r-content, div#article_paywall_es, div.qiota_reserve');
    if (article) {
      article.removeAttribute('class');
      article.removeAttribute('id');
      let article_id;
      let url_src;
      let match = window.location.pathname.match(/^\/(art\/|id)?(\d+)\//);
      if (match) {
        article_id = match[2];
        let apps = 'apps';
        let apps_list = {
          'aisnenouvelle.fr': 'an',
          'courrier-picard.fr': 'cp',
          'lardennais.fr': 'ar',
          'lest-eclair.fr': 'ee',
          'liberation-champagne.fr': 'lc',
          'lunion.fr': 'un'
        };
        for (let domain in apps_list) {
          if (matchDomain(domain))
            apps += '_' + apps_list[domain];
        }
        url_src = window.location.origin + '/api/article/' + apps + '/' + article_id + '.json';
      } else {
        let match_archive = window.location.pathname.match(/\/art\/(d-\d+-\w+)$/);
        if (match_archive) {
          article_id = match_archive[1];
          url_src = window.location.origin + '/api/archive-detail/apps/' + article_id + '.json';
        }
      }
      if (url_src) {
        fetch(url_src)
        .then(response => {
          if (response.ok) {
            response.json().then(json => {
              if (json.body) {
                let parser = new DOMParser();
                let doc = parser.parseFromString('<div>' + json.body + '</div>', 'text/html');
                let article_new = doc.querySelector('div');
                article_new.querySelectorAll('iframe[allow*="fullscreen"][allowfullscreen]').forEach(e => e.removeAttribute('allowfullscreen'));
                if (json.package_type && json.package_type.includes('multimedia') && json.medias_first_urls && json.medias_first_urls.video) {
                  let video = document.createElement('iframe');
                  video.src = json.medias_first_urls.video;
                  video.style = 'width: 100%; aspect-ratio: 16 / 9; border: 0; margin: 20px 0px;';
                  article_new.firstChild.before(video);
                }
                article.innerHTML = '';
                article.appendChild(article_new);
              }
            })
          } else
            header_nofix(article, '', 'BPC > no fix (source file)');
        }).catch(err => console.log(err));
      } else
        header_nofix(article);
    }
  }
  let ads = 'r-pub, div.adm-ad-loading';
  hideDOMStyle(ads);
}

else if (matchDomain(fr_groupe_ebra_domains)) {
  function ebra_main() {
    window.setTimeout(function () {
      let url_src = window.location.origin + "/services/grdc/detail?key=" + getWebContentKey();
      fetch(url_src)
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            if (json.html) {
            let article = document.querySelector('article.viewPartial:not(.done)');
            if (article) {
              article.classList.add('done');
              let intro = article.querySelectorAll('div.fullDetailActions, div.illustration, div.videoComponent');
              removeDOMElement(...intro)
              let parser = new DOMParser();
              let doc = parser.parseFromString('<div>' + json.html + '</div>', 'text/html');
              let article_new = doc.querySelector('div');
              let infos = article.querySelector('div.infos');
              if (infos)
                infos.after(article_new);
              let body_content = document.querySelector('div.retrievedBodyContent');
              if (body_content) {
                let widget = article.querySelector('div.col_main div#poool-widget');
                if (widget)
                  body_content.before(widget);
              }
              article.classList.remove('locked');
              let preview = document.querySelector('div.previewContent');
              removeDOMElement(preview);
              if (typeof $ !== 'undefined') {
                $("head").append(json.js);
                formatWsContent();
              } else {
                let carousel = article.querySelector('ul.carousel-wrapper__slides');
                if (carousel) {
                  carousel.removeAttribute('class');
                  carousel.querySelectorAll('li > figure').forEach(e => e.removeAttribute('class'));
                  removeDOMElement(carousel.querySelector('figure:has(img[src^="data:image"])'));
                }
              }
              let accroche = document.querySelector('.mainContent .accroche');
              if (accroche)
                accroche.classList.add('unlocked');
              article.querySelectorAll('iframe[src=""][data-src]').forEach(e => e.src = e.getAttribute('data-src'));
            }
            }
          })
        }
      }).catch(err => console.log(err));
    }, 1000);
  }
  let paywall = document.querySelector('div#paywall-dynamic');
  if (paywall) {
    removeDOMElement(paywall);
    insert_script(ebra_main);
  }
  let ads = 'div.wrapperPub';
  hideDOMStyle(ads);
}

else if (matchDomain(fr_groupe_la_depeche_domains)) {
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div.article-full__body-content');
    if (article) {
      article.removeAttribute('style');
      article.removeAttribute('data-state');
    }
  }
  let ads = 'div.ad';
  hideDOMStyle(ads);
}

else if (matchDomain(fr_groupe_nice_matin_domains)) {
  if (window.location.pathname.startsWith('/amp/')) {
    amp_iframes_replace();
    let qiota_script = document.querySelector('amp-script.i-amphtml-layout-size-defined[src$="/qiota-amp.js"]');
    if (qiota_script) {
      qiota_script.classList.remove('i-amphtml-layout-size-defined');
      let amp_images = document.querySelectorAll('amp-img > img.i-amphtml-fill-content');
      for (let elem of amp_images)
        elem.removeAttribute('class');
      let sizers = document.querySelectorAll('i-amphtml-sizer');
      removeDOMElement(...sizers);
    }
  }
  let ads = 'div[class^="ad-slot-"]';
  hideDOMStyle(ads);
}

else if (matchDomain('humanite.fr')) {
  let paywall = document.querySelector('div.message-paywall');
  if (paywall) {
    let js_vars_script = document.querySelector('script[id="module-sage-index.js-js-extra"]');
    if (js_vars_script && js_vars_script.text.match(/js_vars\s?=\s?/)) {
      removeDOMElement(paywall);
      let js_vars = js_vars_script.text.split(/js_vars\s?=\s?/)[1].split('};')[0] + '}';
      try {
        let json = JSON.parse(js_vars);
        if (json && json.ajaxUrl && json.ajaxNonce && json.postId) {
          fetch(json.ajaxUrl, {
            method: "POST",
            body: new URLSearchParams({
              action: 'unlock-post-content',
              security: json.ajaxNonce,
              post_id: json.postId
            })
          }).then(response => {
            if (response.ok) {
              response.json().then(json => {
                if (json.success) {
                  let article = document.querySelector('div#post-content');
                  if (article) {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString('<div>' + json.data + '</div>', 'text/html');
                    let article_new = doc.querySelector('div');
                    article.innerHTML = '';
                    article.appendChild(article_new);
                  }
                }
              })
            }
          })
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  let banners = 'div#form_don';
  hideDOMStyle(banners);
}

else if (matchDomain('jeuneafrique.com')) {
  let now_date = (new Date()).toISOString().split('T')[0];
  let ls_date = localStorage.getItem('###_json_date') || '';
  let ls_json_articles = {};
  let ls_json_urls = {};
  function show_data(article, body, ls_json_urls) {
    let parser = new DOMParser();
    let doc = parser.parseFromString('<div>' + body + '</div>', 'text/html');
    let article_new = doc.querySelector('div');
    let readmore_links = article_new.querySelectorAll('div.sc-lire-aussi');
    for (let elem of readmore_links) {
      elem.style = 'margin-bottom: 20px';
      let app_link = elem.querySelector('a[href^="jeuneafrique://article/"');
      if (app_link) {
        let match = app_link.href.match(/\d+$/);
        if (match && ls_json_urls[match[0]])
          app_link.href = ls_json_urls[match[0]];
      }
    }
    article.innerHTML = '';
    article.parentNode.replaceChild(article_new, article);
  }
  function store_data(json, limit, limit_low = 100, article_id = '', article = '') {
    try {
      let src_articles = json.articles.filter(x => !x.content_status_open);
      if (src_articles) {
        if (article_id) {
          let src_article = src_articles.filter(x => x.id == article_id)[0];
          if (src_article)
            show_data(article, src_article.content_full, ls_json_urls);
          else
            header_nofix(article, '', 'BPC > no fix (source file)');
        }
        if (!ls_date || limit > limit_low || now_date > ls_date) {
          ls_json_articles = {};
          ls_json_urls = {};
        } else if (ls_date && !Object.keys(ls_json_articles).length) {
          let ls_articles = localStorage.getItem('###_json');
          ls_json_articles = JSON.parse(ls_articles);
          let ls_urls = localStorage.getItem('###_json_urls') || {};
          ls_json_urls = JSON.parse(ls_urls);
        }
        for (let art of src_articles)
          ls_json_articles[art.id] = art.content_full;
        for (let art of json.articles)
          ls_json_urls[art.id] = art.url;
        localStorage.setItem('###_json', JSON.stringify(ls_json_articles));
        localStorage.setItem('###_json_date', now_date);
        localStorage.setItem('###_json_urls', JSON.stringify(ls_json_urls));
      }
    } catch (err) {
      console.log(err);
    }
  }
  if (true) {
    let paywall = document.querySelector('div#poool-widget');
    if (paywall) {
      removeDOMElement(paywall);
      let article = document.querySelector('div.article__content > div[data-mrf-recirculation]');
      let article_id = window.location.pathname.split('/')[1];
      if (article && article_id) {
        let limit_low = 50 + randomInt(50);
        let limit_high = 600 + randomInt(100);
        function fetch_data(limit) {
          let url_src = 'https://www.jeuneafrique.com/api/mobile/v6.0/featured/?limit=' + limit + '&rel=' + randomInt(100000);
          fetch(url_src, {headers: {"x-exp": "1741079242710", "x-sig": "b431724e94023a6969c5427133e1614db2cbe90e"}})
          .then(response => {
            if (response.ok) {
              response.json().then(json => {
                store_data(json, limit, limit_low, article_id, article);
              })
            } else {
              header_nofix(article, '', 'BPC > no fix (source file)');
            }
          }).catch(x => header_nofix(article, '', 'BPC > no fix (source file)'))
        }
        let json_date;
        let json_script = document.querySelector('script[type="application/ld+json"]');
        if (json_script) {
          try {
            let json = JSON.parse(json_script.text);
            if (json && json['@graph']) {
              let date_arr = json['@graph'].filter(x => x.datePublished);
              if (date_arr.length)
                json_date = date_arr[0].datePublished;
            }
          } catch (err) {
            console.log(err);
          }
        }
        let art_date = json_date ? json_date.split('T')[0] : now_date;
        if (ls_date) {
          let ls_articles = localStorage.getItem('###_json');
          ls_json_articles = JSON.parse(ls_articles);
          let ls_urls = localStorage.getItem('###_json_urls') || {};
          ls_json_urls = JSON.parse(ls_urls);
          let art_data = ls_json_articles[article_id];
          if (art_data)
            show_data(article, art_data, ls_json_urls);
          else if (ls_date < art_date)
            fetch_data(limit_high);
          else if (now_date === art_date)
            fetch_data(limit_low);
          else
            header_nofix(article, '', 'BPC > no fix (source file)')
        } else {
          fetch_data(limit_high);
        }
      }
    }
    let ads = 'div.banner-ad, div.box-ad-brand';
    hideDOMStyle(ads);
  }
}

else if (matchDomain('journaldunet.com')) {
  let reg_wall = document.querySelector('div.reg_wall');
  removeDOMElement(reg_wall);
  let entry_reg_wall = document.querySelector('div.entry_reg_wall[style]');
  if (entry_reg_wall)
    entry_reg_wall.removeAttribute('style');
}

else if (matchDomain('la-croix.com')) {
  function lacroix_main() {
    fetch('/extend_access', {
      method: "POST"
    }).then(x => window.location.reload())
  }
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    removeDOMElement(paywall);
    insert_script(lacroix_main);
  }
  let ads = 'div[data-gam]';
  hideDOMStyle(ads);
}

else if (domain = matchDomain('lamanchelibre.fr') || matchDomain(fr_groupe_la_manche_libre_custom_domains)) {
  let paywall = document.querySelector('div#paywall_ctn');
  if (paywall) {
    removeDOMElement(paywall);
    let article_id_match = window.location.pathname.match(/^\/\w+-(\d+)-/);
    if (article_id_match) {
      let article_id = article_id_match[1];
      let article = document.querySelector('div.article_txt');
      if (article_id && article) {
        let url_src = 'https://app-api.' + domain + '/v1/getNew.php?id=' + article_id;
        fetch(url_src)
        .then(response => {
          if (response.ok) {
            response.json().then(json => {
              try {
                let parser = new DOMParser();
                let doc = parser.parseFromString('<div>' + json.result[0].body + '</div>', 'text/html');
                let article_new = doc.querySelector('div');
                article_new.className = article.className;
                article_new.classList.remove('melody');
                let ng_images = article_new.querySelectorAll('div.picture_container > p > img[ng-src]:not([src])');
                for (let elem of ng_images) {
                  elem.src = elem.getAttribute('ng-src');
                  let fs_button = elem.parentNode.parentNode.querySelector('div.fullscreen_button');
                  removeDOMElement(fs_button);
                }
                article.parentNode.replaceChild(article_new, article);
              } catch (err) {
                console.log(err);
              }
            })
          }
        })
      }
    }
  }
  let ads = 'div.class_pub, div#tbl-next-up';
  hideDOMStyle(ads);
}

else if (matchDomain('lecho.be')) {
  let url = window.location.href;
  func_post = function () {
    if (mobile) {
      document.querySelectorAll('figure img[loading="lazy"][style]').forEach(e => e.style = 'width: 95%;');
    }
    let pars = document.querySelectorAll('div[itemprop="articleBody"] > div');
    if (pars.length) {
      if (pars.length < 5) {
        let header = document.querySelector('article header');
        if (header)
          header.before(googleSearchToolLink(url));
      }
    } else {
      let main = document.querySelector('main');
      if (main)
        main.after(googleSearchToolLink(url));
    }
    clear_inert();
  }
  if (matchDomain('investisseur.lecho.be')) {
    if (window.location.pathname.endsWith('.html')) {
      getArchive(url, 'html.paywalled', {rm_class: 'paywalled'}, 'main');
      addStyle('body {overflow: auto !important}');
    }
    let banner = document.querySelector('div[data-id="react-paywall-auth0"]');
    removeDOMElement(banner);
  } else {
    window.setTimeout(function () {
      let close_button = document.querySelector('button.ds-modal__top-bar__closebutton');
      if (close_button)
        close_button.click();
    }, 1000);
    let paywall_sel = 'html.paywall-active';
    let paywall = document.querySelector(paywall_sel);
    if (paywall) {
      if (!window.location.href.includes('/live-blog/'))
        getArchive(url, paywall_sel, {rm_class: 'paywall-active'}, 'article');
      else {
        paywall.classList.remove('paywall-active');
        let main = document.querySelector('main');
        if (main)
          main.after(googleSearchToolLink(url));
      }
    }
  }
  function clear_inert() {
    document.querySelectorAll('[inert]').forEach(e => e.removeAttribute('inert'));
  }
  clear_inert();
}

else if (matchDomain('lecourrierdesstrateges.fr')) {
  let paywall = document.querySelector('div.jpw-truncate-btn');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = json.articleBody;
        let content = document.querySelector('div.content-inner');
        if (json_text && content) {
          let parser = new DOMParser();
          let doc = parser.parseFromString('<div>' + json_text + '</div>', 'text/html');
          let content_new = doc.querySelector('div');
          content.parentNode.replaceChild(content_new, content);
          let hidden_images = document.querySelectorAll('img[src][srcset]');
          for (let elem of hidden_images)
            elem.removeAttribute('srcset');
          let entry_content = document.querySelector('div.entry-content[style]');
          if (entry_content)
            entry_content.removeAttribute('style');
        }
      }
    }
  }
}

else if (matchDomain('ledevoir.com')) {
  setCookie('pw6', '', 'ledevoir.com', '/', 0);
  let counter = document.querySelector('.paywall-breakpoint-wrapper');
  removeDOMElement(counter);
}

else if (matchDomain('lefigaro.fr')) {
  let paywall = document.querySelector('div#fig-premium-paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div[data-component="fig-content-body"]');
    if (article) {
      let resource_key = '34e68a3419a876e36729503e2107dfa556e1a105892e27010130a30018ccbe60';
      let url = window.location.href.split([/\?#/])[0];
      let url_src = 'https://api-graphql.lefigaro.fr/graphql?id=FigaroCoreMobile_resourceByUrl_persistent_' + resource_key + '&variables={%22url%22:%20%22' + url + '%22}';
      fetch(url_src)
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            try {
              let pars = json.data.resource.body.structured;
              if (pars.length)
                article.innerHTML = '';
              let parser = new DOMParser();
              for (let par of pars) {
                let elem;
                let sub_elem;
                let par_type = par.__typename;
                if (['Heading', 'Paragraph', 'ParagraphWithPaywall'].includes(par_type)) {
                  if (par.paywall)
                    par = par.paywall;
                  if (par.text.replace(/&nbsp;/g, '')) {
                    let doc = parser.parseFromString('<p class="fig-paragraph">' + par.text + '</p>', 'text/html');
                    elem = doc.querySelector('p');
                    if (par_type === 'Heading')
                      elem.style = 'font-weight: bold; font-size: 1.85rem;';
                  }
                } else if (['Photo', 'VideoFigaro'].includes(par_type)) {
                  if (par.thumbnail)
                    par = par.thumbnail;
                  if (par.image) {
                    elem = document.createElement('p');
                    elem.className = 'fig-paragraph';
                    let img = makeFigure(par.image.url, par.caption.replace(/<[^<]*>/g, '') + ' ' + par.credit, '', {class: 'fig-media__legend'});
                    elem.append(img, document.createElement('br'));
                  }
                } else if (par_type === 'Frame') {
                  if (par.text) {
                    elem = document.createElement('p');
                    elem.className = 'fig-paragraph';
                    let title = document.createElement('p');
                    title.innerText = par.title;
                    title.className = 'fig-paragraph';
                    title.style = 'font-weight: bold;';
                    let doc = parser.parseFromString('<div>' + par.text + '</div>', 'text/html');
                    let text = doc.querySelector('div');
                    elem.append(title, text);
                  }
                } else if (par_type.endsWith('Link')) {
                  if (par.link)
                    par = par.link;
                  if (par.title && par.url) {
                    elem = document.createElement('p');
                    if (par.prefix) {
                      let prefix = document.createElement('span');
                      prefix.innerText = par.prefix + ' ';
                      elem.append(prefix);
                    }
                    let link_elem = document.createElement('a');
                    link_elem.href = par.url;
                    link_elem.innerText = par.title.replace(/<[^<]*>/g, '');
                    link_elem.target = '_blank';
                    elem.append(link_elem);
                  }
                } else if (par.sourceCode) {
                  let doc = parser.parseFromString('<div>' + par.sourceCode + '</div>', 'text/html');
                  elem = doc.querySelector('div');
                  let tweet_link = elem.querySelector('a[href^="https://twitter.com/"], a[href^="https://x.com/"]');
                  if (tweet_link) {
                    tweet_link.innerText = tweet_link.href;
                    tweet_link.target = '_blank';
                  }
                } else if (par_type === 'Youtube') {
                  if (par.id) {
                    elem = document.createElement('iframe');
                    elem.src = 'https://www.youtube.com/embed/' + par.id;
                    elem.style = 'width: 100%; height: 400px;';
                  }
                } else if (par_type === 'List') {
                  if (par.list) {
                    elem = document.createElement('ul');
                    elem.style = 'list-style: inside;';
                    for (let item of par.list) {
                      let li = document.createElement('li');
                      li.style = 'margin: 10px 0px;';
                      let doc = parser.parseFromString('<span>' + item + '</span>', 'text/html');
                      let span = doc.querySelector('span');
                      li.appendChild(span);
                      elem.appendChild(li);
                    }
                  }
                } else if (par_type === 'HorizontalRule') {
                  elem = document.createElement('hr');
                } else if (par_type === 'Quote') {
                  elem = document.createElement('blockquote');
                  elem.style = 'margin: 30px;';
                  let qtext = document.createElement('p');
                  qtext.innerText = parseHtmlEntities(par.text);
                  qtext.style = 'font-weight: bold; font-size: 28px; margin: 15px 0px;';
                  let qcredit = document.createElement('p');
                  qcredit.innerText = par.credit ? parseHtmlEntities(par.credit) : '';
                  elem.append(qtext, qcredit);
                } else if (!['Brightcove'].includes(par_type)) {
                  console.log(par);
                }
                if (elem)
                  article.appendChild(elem);
              }
            } catch (err) {
              console.log(err);
            }
          })
        }
      }).catch(x => header_nofix(article, '', 'BPC > no fix (source file)'))
    }
  }
}

else if (matchDomain('legrandcontinent.eu')) {
  let paywall = document.querySelector('body.paywall, body.pw, body.softwall');
  if (paywall)
    paywall.classList.remove('paywall', 'pw', 'softwall');
  let banners = document.querySelectorAll('div#fix-pw, div.disposableBanner');
  removeDOMElement(...banners);
}

else if (matchDomain(['lejdd.fr', 'parismatch.com', 'public.fr'])) {
  let banners = '.forbidden';
  let ads = 'div[class^="lmn-"], div.premium-hidden, div.p-aside--placeholder, section.outbrain-container';
  hideDOMStyle(banners + ', ' + ads);
  let bottom_hide = document.querySelector('.cnt[data-poool-mode="hide"]');
  if (bottom_hide) {
    bottom_hide.removeAttribute('data-poool-mode');
    bottom_hide.removeAttribute('style');
  }
}

else if (matchDomain('lemagit.fr')) {
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    paywall.classList.remove('paywall');
    let banners = document.querySelectorAll('p#firstP, div#inlineRegistrationWrapper');
    removeDOMElement(...banners);
  }
}

else if (matchDomain('lemonde.fr')) {
  let url = window.location.href.split(/[\?#]/)[0];
  let paywall = document.querySelector('section.lmd-paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('.article__content');
    if (article) {
      let match = url.match(/article.*_(\d+)_/);
      if (match) {
        let id = match[1];
        let url_base = 'https://apps.lemonde.fr/aec/v1/' + (window.location.pathname.startsWith('/en/') ? 'en/' : '') + 'premium-android-phone/article/';
        let url_src = url_base + id;
        let json_key = 'template_vars.content';
        getExtFetch(url_src, json_key, {}, main_lemonde);
        function main_lemonde(url, data) {
          try {
            if (data) {
              let parser = new DOMParser();
              let doc = parser.parseFromString(data, 'text/html');
              let article_new = doc.querySelector('.article_content');
              if (article_new) {
                article_new.className = 'article__content';
                article_new.querySelectorAll('p').forEach(e => e.className = 'article__paragraph');
                article_new.querySelectorAll('h2').forEach(e => e.className = 'article__sub-title');
                article_new.querySelectorAll('h3.question').forEach(e => e.className = 'article__question');
                article_new.querySelectorAll('figure').forEach(e => e.style = 'margin: 0px 10px;');
                article_new.querySelectorAll('div.see-also-container, div.reference').forEach(e => e.style = 'margin: 20px 0px;');
                let image_divs = article_new.querySelectorAll('div.image');
                for (let elem of image_divs) {
                  elem.style = 'margin: 20px 0px;';
                  let img = elem.querySelector('a > img[data-src]');
                  if (img) {
                    if (img.src.startsWith('data:image/'))
                      img.src = img.getAttribute('data-src');
                    img.parentNode.before(img);
                  }
                }
                let videos = article_new.querySelectorAll('div.video-container');
                for (let video of videos) {
                  let video_id_dom = video.querySelector('div[data-provider="dailymotion"][data-id]');
                  if (video_id_dom) {
                    let iframe = document.createElement('iframe');
                    iframe.src = 'https://www.dailymotion.com/embed/video/' + video_id_dom.getAttribute('data-id');
                    iframe.style = 'height: 400px; width: 100%; margin: 20px 0px;';
                    video.parentNode.replaceChild(iframe, video);
                  }
                }
                let cartes = article_new.querySelectorAll('div.cartes > div.carte > img[src_700][src_350]');
                for (let elem of cartes) {
                  elem.parentNode.parentNode.removeAttribute('class');
                  elem.src = mobile ? elem.getAttribute('src_350') : elem.getAttribute('src_700');
                  elem.style = 'width: 90%; margin: auto;';
                }
                let inread = article_new.querySelectorAll('div.inread-container');
                removeDOMElement(...inread);
                let links = article_new.querySelectorAll('div.link-container > a[href^="lmfr://"]');
                function link_lemonde(url, data, elem) {
                  if (data)
                    elem.href = data;
                }
                for (let elem of links) {
                  let url_link = elem.href;
                  let url_match = url_link.split(/[\?#]/)[0].match(/^lmfr:\/\/.*element\/article\/(\d+)/);
                  if (url_match) {
                    let id = url_match[1];
                    let url_src = url_base + id;
                    let json_key = 'element.url';
                    getExtFetch(url_src, json_key, {}, link_lemonde, [elem]);
                  } else if (url_link.match(/^lmfr:\/.*\/live\/\d+\?/) && url_link.includes('www.lemonde.fr')) {
                    url_link = decodeURIComponent('https://www.lemonde.fr' + url_link.replace(/%25/g, '%').split('www.lemonde.fr')[1].split('.html')[0] + '.html');
                    link_lemonde(url, url_link, elem);
                  }
                }
                article_new.querySelectorAll('div.reference > a[href^="lmfr://"][href*="/open-url?"][href*="&url="]').forEach(e => e.href = decodeURIComponent(e.href.split('&url=')[1].split('&')[0]).split('?')[0]);
                article.innerHTML = '';
                article.parentNode.replaceChild(article_new, article);
              }
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  }
  let ads = 'div.dfp-slot, div.dfp__container, div.media-notice';
  hideDOMStyle(ads);
}

else if (matchDomain('leparisien.fr')) {
  func_post = function () {
    let ads = 'section#left div[style^="background-color:"]';
    hideDOMStyle(ads, 2);
  }
  let url = window.location.href;
  getArchive(url, 'div.paywall', '', 'section#left');
  let ads = 'div.ad_element';
  hideDOMStyle(ads);
}

else if (matchDomain('lepoint.fr')) {
  function lepoint_main() {
    function decryptVariable(a) {
      var t = ["point", "les", "payants", "top"],
      n = ["le", "avec", "articles", "c"],
      o = (function () {
        var o = [];
        for (var e = 0; e < 4; e++)
          o.push(n[e]), o.push(t[e]);
        return o
      })(),
      e = {
        stringify: function (o) {
          var e = {
            ct: o.ciphertext.toString(CryptoJS.enc.Base64)
          };
          return o.iv && (e.iv = o.iv.toString()),
          o.salt && (e.s = o.salt.toString()),
          JSON.stringify(e)
        },
        parse: function (o) {
          var e = JSON.parse(o),
          t = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Base64.parse(e.ct)
          });
          return e.iv && (t.iv = CryptoJS.enc.Hex.parse(e.iv)),
          e.s && (t.salt = CryptoJS.enc.Hex.parse(e.s)),
          t
        }
      };
      return JSON.parse(CryptoJS.AES.decrypt(JSON.stringify(a), o.join(" "), {
          format: e
        }).toString(CryptoJS.enc.Utf8))
    }
    let article = document.querySelector('div#contenu');
    if (article && window.variable_article_poool) {
      article.innerHTML = decryptVariable(window.variable_article_poool);
      let videos = document.querySelectorAll('figure.video-dailymotion > blockquote[data-videoid]');
      for (let elem of videos) {
        let elem_new = document.createElement('iframe');
        elem_new.src = 'https://www.dailymotion.com/embed/video/' + elem.getAttribute('data-videoid');
        elem_new.style = 'height: 400px;';
        elem.parentNode.replaceChild(elem_new, elem);
      }
    }
  }
  if (!matchDomain(['journal.lepoint.fr'])) {
    let paywall = document.querySelectorAll('aside.paywall');
    if (paywall.length) {
      removeDOMElement(...paywall);
      insert_script(lepoint_main);
    }
    let ads = 'div[id*="WRAP_"], div#StickyPaywall, div#paywall-sticky, #article-body div.slotpub, div.sticky-block';
    hideDOMStyle(ads);
  } else {
    let url = window.location.href;
    getArchive(url, 'div.accnt-cmp', '', 'article');
  }
}

else if (matchDomain('lequipe.fr')) {
  let paywall = document.querySelector('article.Article--limited div.Article__gradient');
  if (paywall) {
    removeDOMElement(paywall);
    hideDOMStyle('div.Article__paywall', 2);
    addStyle('div.Article__paragraph--limited {visibility: visible !important; height: auto !important; margin: 0 0 20px !important;}');
    let article_id = window.location.pathname.match(/\d+$/)[0];
    let article = document.querySelector('div.article__body');
    if (article_id && article) {
      let url_src = 'https://dwh.lequipe.fr/api/v4/efr/news/' + article_id;
      fetch(url_src)
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            try {
              let pars = json.items.filter(x => x.layout === 'article_body')[0].objet.paragraphs;
              pars.shift();
              article.innerHTML = '';
              article.className += ' Article__paragraph';
              article.appendChild(document.createElement('br'));
              addStyle('div.article__body > div.Paragraph {font-family: "DINNextLTPro-Regular", sans-serif; font-size: 18px; font-weight: 400; line-height: 26px;}', 2);
              let parser = new DOMParser();
              for (let par of pars) {
                let elem;
                if (par.content || par.note) {
                  if (!par.content)
                    par.content = '';
                  if ((par.content.match(/(^<div|\/div>$)/g) || []).length !== 1) {
                    let elem_type = 'div';
                    if (par.title) {
                      par.content = '<h2>' + par.title + '</h2>' + par.content;
                    } else if (par.note) {
                      if (par.note.label && par.note.rating) {
                        let par_img = par.note.image || par.note.picture;
                        let img = (par_img && par_img.url) ? '<img src="' + par_img.url.replace('{width}', '200').replace('{height}', 200).replace('{quality}', '75') + '" >' : '';
                        par.content = '<h2>' + par.note.label + ': ' + par.note.rating + '</h2>' + img + par.content;
                      }
                    }
                    let doc = parser.parseFromString('<div class="Paragraph">' + par.content + '</div>', 'text/html');
                    elem = doc.querySelector(elem_type);
                  }
                } else if (par.title) {
                  elem = document.createElement('h2');
                  elem.innerText = par.title;
                } else if (par.media) {
                  if (par.media.url && par.media.ratio) {
                    let ratio = par.media.ratio;
                    if (!parseInt(ratio))
                      ratio = 1.5;
                    let url = par.media.url.replace(/\\u002F/g, '/').replace('{width}', '400').replace('{height}', parseInt(400 / ratio)).replace('{quality}', '75');
                    let caption = par.media.legende && par.media.legende.length > 2 ? par.media.legende : '';
                    elem = makeFigure(url, caption, {}, {'style': 'font-weight: bold;'});
                  } else if (par.media.__type === 'video' && par.media.id) {
                    let url = par.media.image.url.replace('{width}', '400').replace('{height}', 400).replace('{quality}', '75');
                    elem = makeFigure(url, par.media.legend);
                    let video_link = document.createElement('a');
                    video_link.href = video_link.innerText = 'https://geo.dailymotion.com/player.html?video=' + par.media.id;
                    video_link.style = 'text-decoration: underline;';
                    video_link.target = '_blank';
                    elem.appendChild(video_link);
                  }
                } else if (par.__type === 'article_paragraph_playing_field') {
                  if (par.data) {
                    let url = par.data;
                    fetch(url)
                    .then(response => {
                      if (response.ok) {
                        response.json().then(json => {
                          if (json.arbitre && json.titulaires) {
                            let ids = [json.arbitre].concat(json.titulaires);
                            if (json.banc)
                              for (let elem of json.banc)
                                ids = ids.concat([elem.entraineur], elem.remplacants);
                            let notes = document.querySelectorAll('span.EditorRatingsField__note');
                            for (let note of notes) {
                              let name_dom = note.parentNode.querySelector('span[class$="--name"]');
                              if (name_dom) {
                                let name = (name_dom.innerText.includes(':') ? name_dom.innerText.split(':')[1] : name_dom.innerText).trim();
                                let json_note = ids.find(x => x.nom === name);
                                if (json_note)
                                  note.innerText = json_note.note;
                              }
                            }
                          }
                        })
                      }
                    })
                  }
                } else if (!['article_paragraph_pub'].includes(par.__type))
                  console.log(par);
                if (elem)
                  article.appendChild(elem);
              }
            } catch (err) {
              console.log(err);
            }
          })
        }
      }).catch(x => header_nofix(article, '', 'BPC > no fix (source file)'))
    }
  }
  let ads = 'div.AmPlaceholder, div.Modal[data-modal="amsBlock"]';
  hideDOMStyle(ads);
  let noscroll = document.querySelector('html');
  if (noscroll)
    noscroll.style.overflow = 'auto';
}

else if (matchDomain('lerevenu.com')) {
  let ads = 'div.wrapperAd';
  hideDOMStyle(ads);
}

else if (matchDomain(['lesechos.fr', 'historia.fr'])) {
  if (window.location.pathname.startsWith('/amp/')) {
    ampToHtml();
  } else {
    window.setTimeout(function () {
      let paywall = document.querySelector('div#paywall, div#registerWall');
      if (paywall) {
        removeDOMElement(paywall);
        let filter = /window\.__REACT_QUERY_STATE__\s?=\s?/;
        let json_script = getSourceJsonScript(filter);
        if (json_script) {
          try {
            let json = JSON.parse(json_script.text.split(filter)[1].split('};')[0] + '}');
            let data_article = json.queries.filter(x => x.state.data.stripes)[0].state;
            let url = window.location.href;
            let url_loaded = data_article.data.path;
            if (url_loaded && (!url_loaded.slice(-7).match(/\d+/) || !url.includes(url_loaded.slice(-7))))
              refreshCurrentTab();
            else {
              let json_text = data_article.data.stripes[0].mainContent[0].data.description;
              let article = document.querySelector('div.post-paywall');
              if (article) {
                let contentNode = document.createElement('div');
                let parser = new DOMParser();
                let doc = parser.parseFromString('<div class="' + article.className + '">' + json_text + '</div>', 'text/html');
                let article_new = doc.querySelector('div');
                let videos = article_new.querySelectorAll('iframe[allow*="fullscreen"][allowfullscreen]');
                for (let elem of videos) {
                  elem.removeAttribute('allowfullscreen');
                  if (mobile)
                    elem.style.width = '100%';
                }
                if (article.parentNode && article_new) {
                  article.parentNode.replaceChild(article_new, article);
                  let article_lastnode = document.querySelector('.post-paywall  > :last-child');
                  if (article_lastnode) {
                    article_lastnode.setAttribute('style', 'height: auto !important; overflow: hidden !important; max-height: none !important;');
                  }
                }
              }
              let styleElem = document.head.appendChild(document.createElement('style'));
              styleElem.innerText = ".post-paywall::after {height: auto !important;}";
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
      let ads = 'div.sc-1u9r8h-0';
      hideDOMStyle(ads);
    }, 500);
  }
}

else if (matchDomain('lesinrocks.com')) {
  if (window.location.search.match(/(\?|&)amp/)) {
    let size_defined = document.querySelector('amp-script.i-amphtml-layout-size-defined');
    if (size_defined)
      size_defined.style = 'overflow:visible !important;';
    let overlays = document.querySelectorAll('section.learn_more, div.sidebar, div.menu-footer, div.tooltip_bib, footer.content-info');
    removeDOMElement(...overlays);
  }
}

else if (matchDomain('letelegramme.fr')) {
  let paywall = document.querySelectorAll('div.tlg-paywalled');
  for (let elem of paywall)
    elem.classList.remove('tlg-paywalled');
  let ads = 'div[id^="pub_"]';
  hideDOMStyle(ads);
}

else if (matchDomain('letemps.ch')) {
  let url = window.location.href;
  getArchive(url, 'div.post-subscribe', '', 'div#article-body-wrapper');
  let fade = document.querySelector('div.post__content--faded');
  if (fade)
    fade.classList.remove('post__content--faded');
  let top_ad = document.querySelector('div.topad');
  removeDOMElement(top_ad);
}

else if (matchDomain(be_roularta_domains)) {
  let paywall = document.querySelector('div[id*="wall-modal"]');
  if (paywall) {
    removeDOMElement(paywall);
    let html = document.querySelector('html[class]');
    if (html)
      html.removeAttribute('class');
    function roularta_noscroll(node) {
      node.removeAttribute('style');
      node.removeAttribute('class');
    }
    waitDOMAttribute('html', 'html', 'class', roularta_noscroll, true);
    let intro = document.querySelectorAll('div.article-body > p, div.article-body > style');
    removeDOMElement(...intro);
    let locked = document.querySelector('body.locked');
    if (locked)
      locked.classList.remove('locked');
  }
  if (!window.navigator.userAgent.toLowerCase().includes('chrome') && window.location.href.match(/\/(\w+-){2,}/)) {
    let lazy_images = document.querySelectorAll('img[src^="data:image/"][data-lazy-src]');
    for (let elem of lazy_images) {
      elem.src = elem.getAttribute('data-lazy-src');
    }
  }
  let ads = 'div.rmgAd, div.c-header__ad';
  hideDOMStyle(ads);
}

else if (matchDomain('lexpress.fr')) {
  let ads = 'div[class^="block_pub"], div[class^="bottom-bar"], div.teads__block, div.ban-bottom, div[class^="placeholder--ban-atf"]';
  hideDOMStyle(ads);
}

else if (matchDomain('liberation.fr')) {
  let paywall = document.querySelector('div.article-body-paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('article[data-datawall-status]') || document.querySelector('div[class^="default__Main-sc-"] div:empty:not([class], [style])');
    if (article) {
      let url_src = 'https://arc.api.liberation.fr/content/v4/?website=liberation&website_url=' + encodeURIComponent(window.location.pathname);
      let x_api_key = 'a7X29mBvQeP1Ld98CgF2rK5uTzWY4h';
      fetch(url_src, {headers: {"x-api-key": x_api_key}})
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            if (json && json.content_elements) {
              let pars = json.content_elements;
              if (pars.length)
                article.innerHTML = '';
              let parser = new DOMParser();
              for (let par of pars) {
                let elem = document.createElement('p');
                let sub_elem;
                if (['header', 'raw_html', 'text'].includes(par.type)) {
                  if (par.content) {
                    let doc = parser.parseFromString('<div>' + par.content + '</div>', 'text/html');
                    sub_elem = doc.querySelector('div');
                    if (par.type === 'header')
                      sub_elem.style = 'font-weight: bold; font-size: 1.85rem;';
                  }
                } else if (par.type === 'correction') {
                  if (par.text) {
                    sub_elem = document.createElement('span');
                    elem.innerText = par.text;
                  }
                } else if (par.type === 'image') {
                  if (par.url) {
                    sub_elem = document.createElement('img');
                    sub_elem.src = par.url;
                  }
                } else if (par.type === 'custom_embed') {
                  if (par.embed && par.embed.config) {
                    let config = par.embed.config;
                    sub_elem = document.createElement('div');
                    sub_elem.style = 'border: 1px solid black;';
                    if (config.title) {
                      let sub_item = document.createElement('p');
                      sub_item.innerText = config.title;
                      sub_item.style = 'font-weight: bold; margin: 20px;';
                      sub_elem.appendChild(sub_item);
                    }
                    if (config.content) {
                      let sub_item = document.createElement('p');
                      sub_item.innerText = config.content;
                      sub_item.style = 'margin: 20px;';
                      sub_elem.appendChild(sub_item);
                    }
                  } else
                    console.log(par);
                } else if (par.type === 'oembed_response') {
                  if (par.raw_oembed && par.raw_oembed.html) {
                    if (!par.subtype === 'twitter') {
                      let doc = parser.parseFromString('<div>' + par.raw_oembed.html + '</div>', 'text/html');
                      sub_elem = doc.querySelector('div');
                    } else if (par.raw_oembed.url) {
                      sub_elem = document.createElement('a');
                      sub_elem.href = sub_elem.innerText = par.raw_oembed.url;
                      sub_elem.target = '_blank';
                    }
                  }
                } else if (par.type === 'link_list') {
                  if (par.items) {
                    sub_elem = document.createElement('p');
                    sub_elem.appendChild(document.createElement('hr'));
                    sub_elem.appendChild(document.createTextNode('Lire aussi'));
                    sub_elem.appendChild(document.createElement('br'));
                    for (let item of par.items) {
                      if (item.content && item.url) {
                        let item_link = document.createElement('a');
                        item_link.href = item.url;
                        item_link.innerText = item.content;
                        sub_elem.appendChild(item_link);
                        sub_elem.appendChild(document.createElement('br'));
                      }
                    }
                    sub_elem.appendChild(document.createElement('hr'));
                  }
                } else if (!['quote'].includes(par.type)) {
                  console.log(par);
                }
                if (sub_elem) {
                  elem.appendChild(sub_elem);
                  article.appendChild(elem);
                }
              }
            }
          })
        }
      }).catch(x => header_nofix(article, '', 'BPC > no fix (source file)'))
    }
  }
  let ads = 'div[class^="StickyAd"], div[class^="default__OutbrainWrapper"]';
  hideDOMStyle(ads);
}

else if (matchDomain('loeildelaphotographie.com')) {
  let paywall = document.querySelector('.paywall');
  if (paywall) {
    paywall.removeAttribute('class');
  }
  let premium_pic_boxes = document.querySelectorAll('.premium-pic-box');
  let banners = document.querySelectorAll('.membership-promo-container, .login_form_litle');
  removeDOMElement(...premium_pic_boxes, ...banners);
  let blurred_images = document.querySelectorAll('img[style*="blur"]');
  for (let blurred_image of blurred_images)
    blurred_image.removeAttribute('style');
}

else if (matchDomain('lopinion.fr')) {
  let url = window.location.href;
  getArchive(url, 'div.paywall-premium', '', 'div.mainBody', '', 'div[style*=";line-height:1.8;"] div[style*=";line-height:1.8;"]');
  let ads = 'div.ResponsiveAd';
  hideDOMStyle(ads);
}

else if (matchDomain('marianne.net')) {
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div > div.js-poool-wrapper');
    if (article) {
      let limit_low = 50;
      let limit_high = 400;
      function show_data(article, body) {
        let parser = new DOMParser();
        let doc = parser.parseFromString('<div>' + body + '</div>', 'text/html');
        let article_new = doc.querySelector('div');
        let lazy_images = article_new.querySelectorAll('img.lazyload[data-src]:not([src])');
        for (let elem of lazy_images) {
          elem.src = elem.getAttribute('data-src');
          elem.classList.remove('lazyload');
        }
        article.innerHTML = '';
        article.parentNode.replaceChild(article_new, article);
      }
      function fetch_data(limit, offset = 0) {
        let url_src = 'https://mobile.marianne.net/premium?limit=' + limit + '&offset=' + offset;
        fetch(url_src)
        .then(response => {
          if (response.ok) {
            response.json().then(json => {
              try {
                let src_articles = json.feed_auto;
                if (src_articles) {
                  let src_article = src_articles.filter(x => x.urlWeb === url)[0];
                  let ls_update = true;
                  if (src_article)
                    show_data(article, src_article.body);
                  else if (limit === limit_low) {
                    ls_update = false;
                    fetch_data(limit_high);
                  } else
                    header_nofix(article, '', 'BPC > no fix (source file)');
                  if (ls_update) {
                    let now_date = (new Date()).toISOString().split('T')[0];
                    if (!ls_date || limit > limit_low || now_date > ls_date)
                      ls_json_articles = {};
                    for (let art of src_articles)
                      ls_json_articles[art.urlWeb] = art.body;
                    localStorage.setItem('###_json_date', now_date);
                    localStorage.setItem('###_json', JSON.stringify(ls_json_articles));
                  }
                }
              } catch (err) {
                console.log(err);
              }
            })
          }
        }).catch(x => header_nofix(article, '', 'BPC > no fix (source file)'))
      }
      let url = window.location.href.split(/[#\?]/)[0];
      let meta_date = document.querySelector('head > meta[property="article:published_time"][content]');
      let art_date = '';
      if (meta_date)
        art_date = meta_date.content.split('T')[0];
      let ls_date = localStorage.getItem('###_json_date') || '';
      let ls_json_articles = {};
      if (ls_date) {
        let ls_articles = localStorage.getItem('###_json');
        ls_json_articles = JSON.parse(ls_articles);
        if (ls_date <= art_date)
          fetch_data(limit_low);
        else {
          let art_data = ls_json_articles[url];
          if (art_data)
            show_data(article, art_data);
          else if (Object.keys(ls_json_articles).length <= limit_low)
            fetch_data(limit_high);
          else
            header_nofix(article, '', 'BPC > no fix (source file)')
        }
      } else {
        fetch_data(limit_low);
      }
    }
  }
  let ads = 'div[class*="--placeholder"]';
  hideDOMStyle(ads);
}

else if (matchDomain('ouest-france.fr')) {
  if (matchDomain('www.ouest-france.fr')) {
    function ouest_france_main() {
      window.cmsfetch.push({
        url: window.cms_bypass_rpc_url,
        params: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: 'platform/bypass-payant/get',
            jsonrpc: '2.0',
            method: 'getToken',
            params: {
              publicitaire: !0,
              id_contenu: window.dataLayer[0].mdId
            }
          })
        },
        fn: function (e) {
          let data = JSON.parse(e);
          let newURL = new URL(window.location.href);
          newURL.searchParams.append('token', data.result.token);
          window.location.href = newURL.toString();
        }
      });
    }
    if (!window.location.search.includes('token=')) {
      let paywall = document.querySelector('div.mur');
      if (paywall) {
        removeDOMElement(paywall);
        insert_script(ouest_france_main);
      }
    } else {
      document.querySelectorAll('iframe:not([src])[data-embed-src]').forEach(e => e.src = e.getAttribute('data-embed-src'));
    }
  } else {
    function ouest_france_sub() {
      if (window.location.pathname.includes('/video-')) {
        let video = document.querySelector('article figure');
        if (video) {
          let og_video_dom = document.querySelector('head > meta[property="og:video"][content]');
          if (og_video_dom) {
            let video_new = document.createElement('video');
            video_new.src = og_video_dom.content;
            video_new.style = 'width: 100%;';
            video_new.setAttribute('controls', '');
            video.parentNode.replaceChild(video_new, video);
          }
        }
      } else {
        let title_dom = document.querySelector('head > meta[name="twitter:title"][content]');
        if (title_dom) {
          let title = encodeURIComponent(title_dom.content);
          let app_id = window.sessionStorage.getItem('###_app_id');
          fetch('https://' + app_id + '-dsn.algolia.net/1/indexes/*/queries', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-algolia-api-key": window.bp_algolia_articles,
              "x-algolia-application-id": app_id.toUpperCase()
            },
            body: JSON.stringify({
              requests: [{
                  indexName: "articles",
                  params: 'query=' + title
                }
              ]
            })
          })
          .then(response => {
            if (response.ok) {
              response.json().then(json => {
                let results = json.results[0].hits;
                let article = results.find((result) => result.articleId == window.dataLayer[0].mdId);
                if (article) {
                  let body = document.querySelector('div#article-detail > div.su-article');
                  if (body) {
                    body.parentNode.classList.remove('cache');
                    let article_text = article.texte;
                    let pars = body.querySelectorAll('p, h2');
                    for (let par of pars) {
                      let par_text = par.innerText.replace(/\u00a0/g, ' '); //&nbsp;
                      if (article_text.startsWith(par_text)) {
                        article_text = article_text.replace(par_text, '').trim();
                      } else if (par.tagName === 'P' && par_text.endsWith('...')) {
                        par.remove();
                        break;
                      }
                    }
                    let par_new = document.createElement('p');
                    par_new.innerText = article_text;
                    body.appendChild(par_new);
                    if (article.photos && article.photos.length > 1) {
                      let header_img = document.querySelector('article figure img[src]');
                      if (header_img && header_img.src.includes('/pictures/')) {
                        let img_base = header_img.src.split('/pictures/')[0] + '/pictures/';
                        let img_first = true;
                        for (let img of article.photos) {
                          if (!img_first) {
                            let figure = document.createElement('figure');
                            figure.style = 'margin: 20px 0px;';
                            let img_new = document.createElement('img');
                            img_new.src = img_base + img.id;
                            let caption = document.createElement('figcaption');
                            caption.innerText = img.legende + ' | ' + img.credits;
                            figure.append(img_new, caption);
                            body.appendChild(figure);
                          } else
                            img_first = false;
                        }
                      }
                    }
                    if (article.hasVideo)
                      console.log('hasVideo');
                  }
                }
              })
            }
          }).catch(err => console.log(err));
        }
      }
    }
    let paywall = document.querySelector('div.mur');
    if (paywall) {
      removeDOMElement(paywall);
      window.sessionStorage.setItem('###_app_id', 'c8kp7jv01t');
      insert_script(ouest_france_sub);
    }
  }
  let ads = 'div.pub, div.feed-taboola';
  hideDOMStyle(ads);
  let banner = document.querySelector('div#pub_megabanner');
  removeDOMElement(banner);
}

else if (matchDomain('philonomist.com')) {
  let paywall = document.querySelector('div.content-bandeau');
  if (paywall) {
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

else if (matchDomain('pourleco.com')) {
  let paywall = document.querySelector('div[data-pleco-poool^="paywall"]');
  if (paywall) {
    let intro = document.querySelector('div[data-pleco-transition="fade"]');
    removeDOMElement(paywall, intro);
    let article = document.querySelector('div[class*="article-"][style]');
    if (article)
      article.removeAttribute('style');
  }
}

else if (matchDomain('reforme.net')) {
  let article_sel = 'div.elementor-widget-theme-post-content';
  getJsonUrl(article_sel + ' section', '', article_sel);
  let banner = 'div.free-access-banner';
  hideDOMStyle(banner);
}

else if (matchDomain('science-et-vie.com')) {
  if (window.location.hostname.startsWith('amp.')) {
    let pars = document.querySelectorAll('.qiota_reserve > p, .qiota_reserve > h2');
    let pars_text = [];
    for (let par of pars) {
      if (pars_text.includes(par.innerText))
        removeDOMElement(par);
      else
        pars_text.push(par.innerText);
    }
    let sizer = document.querySelector('div.article-content > amp-script > i-amphtml-sizer');
    removeDOMElement(sizer);
    let replaced_content = document.querySelector('div.i-amphtml-replaced-content');
    if (replaced_content)
      replaced_content.removeAttribute('class');
  }
}

else if (matchDomain(['sudouest.fr', 'charentelibre.fr', 'larepubliquedespyrenees.fr'])) {
  let paywall = document.querySelectorAll('.visible-not-premium');
  if (paywall.length) {
    removeDOMElement(...paywall);
    let visible_premium = document.querySelectorAll('div.visible-premium');
    for (let elem of visible_premium)
      elem.classList.remove('visible-premium');
  }
  let footer_premium = '.footer-premium';
  let ads = 'div.pub, div.ph-easy-subscription';
  hideDOMStyle(footer_premium + ', ' + ads);
}

else if (matchDomain('telerama.fr')) {
  let paywall = document.querySelector('section.paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let article_sel = 'article.article__page-content';
    let article = document.querySelector(article_sel);
    if (article) {
      let url_src = 'https://apps.telerama.fr/tlr/v1/premium-android-tablet/element?id=' + encodeURIComponent(window.location.pathname);
      let json_key = 'templates.raw_content.content';
      getExtFetch(url_src, json_key, {}, main_telerama);
      function main_telerama(url, data) {
        try {
          if (data) {
            let parser = new DOMParser();
            let doc = parser.parseFromString(data, 'text/html');
            let article_new = doc.querySelector(article_sel);
            if (article_new && article.parentNode) {
              article_new.querySelectorAll('a[href^="tlrm://element?id="]').forEach(e => e.href = decodeURIComponent(e.href.split('tlrm://element?id=')[1]));
              article_new.querySelectorAll('figure > img[data-src]:not([src])').forEach(e => e.src = e.getAttribute('data-src'));
              article.parentNode.replaceChild(article_new, article);
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
  let ads = 'div.dfp-slot';
  hideDOMStyle(ads);
}

else if (matchDomain('valeursactuelles.com')) {
  let paywall = document.querySelector('div.qiota');
  if (paywall) {
    removeDOMElement(paywall);
    let qiota_hidden = document.querySelector('div.qiota_reserve');
    if (qiota_hidden)
      qiota_hidden.removeAttribute('class');
  }
  let banners = 'div.subscription-banner, div.stick-sidebar';
  hideDOMStyle(banners);
}

else if (matchDomain('lamontagne.fr') || matchDomain(fr_gcf_custom_domains)) { // Groupe Centre France
  let paywall = document.querySelector('meta[name="premium"][content="true"]');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div#content section > div.flex-col');
    if (article) {
      let div_empty = article.querySelector('div[class^="min-h"]:empty');
      removeDOMElement(div_empty);
      let url = window.location.href;
      fetch(url)
      .then(response => {
        if (response.ok) {
          response.text().then(html => {
            if (html.includes('\\"contentJson\\":')) {
              let html_json = html.split('\\"contentJson\\":')[1].split(']},\\"')[0].replace(/\\"/g, '"').replace(/\\\\"/g, '\\"') + ']}';
              try {
                let json = JSON.parse(html_json);
                if (json && json.content) {
                  let cf_paywall = json.content.find(x => x.type === 'cf-paywall');
                  if (cf_paywall) {
                    let pars = cf_paywall.content;
                    for (let par of pars) {
                      function handle_par(par) {
                        let elem = document.createElement('div');
                        if (['paragraph', 'heading', 'cf-line-heading', 'cf-quote'].includes(par.type)) {
                          if (par.content) {
                            if (par.type === 'heading')
                              elem.style = 'font-weight: bold;';
                            else if (par.type === 'cf-quote')
                              elem.style = 'font-style: italic;';
                            for (let item of par.content) {
                              let sub_elem;
                              if (item.text) {
                                sub_elem = document.createElement('span');
                                let sub_elem_style = '';
                                if (item.marks) {
                                  for (let mark of item.marks) {
                                    if (mark.type === 'link') {
                                      if (mark.attrs && mark.attrs.href) {
                                        sub_elem = document.createElement('a');
                                        sub_elem.href = mark.attrs.href;
                                        sub_elem_style = 'text-decoration:underline;';
                                      }
                                    } else if (mark.type === 'bold')
                                      sub_elem_style += 'font-weight: bold;';
                                    else if (mark.type === 'italic')
                                      sub_elem_style += 'font-style: italic;';
                                    if (sub_elem_style)
                                      sub_elem.style = sub_elem_style;
                                  }
                                }
                                sub_elem.innerText = item.text;
                                if (par.type === 'cf-quote') {
                                  if (par.attrs && par.attrs.author)
                                    sub_elem.innerText += ' - ' + par.attrs.author + (par.attrs.source ? ' ' + par.attrs.source : '');
                                }
                              } else if (item.type === 'hardBreak') {
                                sub_elem = document.createElement('br');
                              } else
                                console.log(item);
                              if (sub_elem)
                                elem.appendChild(sub_elem);
                            }
                          }
                        } else if (par.type === 'cf-image') {
                          if (par.attrs && par.attrs.src) {
                            elem = document.createElement('img');
                            elem.src = par.attrs.src;
                          }
                        } else if (par.type === 'cf-embed') {
                          if (par.attrs && par.attrs.url) {
                            elem = document.createElement('iframe');
                            elem.src = par.attrs.url.replace(/^\/\//, 'https://');
                            if (par.attrs.width)
                              elem.width = par.attrs.width;
                            if (par.attrs.height)
                              elem.height = par.attrs.height;
                          }
                        } else if (par.type === 'cf-read-also') {
                          if (par.attrs && par.attrs.text && par.attrs.url) {
                            elem = document.createElement('a');
                            elem.innerText = 'À lire aussi: ' + par.attrs.text;
                            elem.href = par.attrs.url;
                            elem.style = 'text-decoration:underline;';
                          }
                        } else {
                          console.log(par);
                        }
                        if (elem)
                          article.appendChild(elem);
                      }
                      if (par.type === 'cf-aside' && par.content) {
                        for (let sub_par of par.content)
                          handle_par(sub_par);
                      } else
                        handle_par(par);
                    }
                  }
                }
                if (html.includes(',\\"textToSpeech\\":{')) {
                  let tts_url = html.split(',\\"textToSpeech\\":{')[1].split(',\\"url\\":\\"')[1].split('\\",\\"')[0];
                  if (tts_url) {
                    let audio_div = document.createElement('div');
                    audio_div.innerText = "Écouter l'article";
                    audio_div.style = 'margin-bottom: 20px; font-weight: bold;';
                    let audio = document.createElement('audio');
                    audio.src = tts_url;
                    audio.style = 'width: 100%';
                    audio.setAttribute('controls', '');
                    audio_div.appendChild(audio);
                    article.before(audio_div);
                  }
                }
              } catch (err) {
                console.log(err);
              }
            }
          })
        }
      }).catch(err => console.log(err))
    }
  }
  let ads = 'div.ad-slot, div[class="w-[100vw]"], div.transition-all';
  hideDOMStyle(ads);
}

ads_hide();
leaky_paywall_unhide();

}, 1000);

// General Functions

// import (see @require)

})();
