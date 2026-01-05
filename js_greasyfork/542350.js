// ==UserScript==
// @name            Bypass Paywalls Clean - de/at/ch
// @version         4.2.7.3
// @description     Bypass Paywalls of news sites
// @author          magnolia1234
// @homepageURL     https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters
// @supportURL      https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters
// @license         MIT; https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=LICENSE
// @noframes
// @match           *://*.de/*
// @match           *://*.beobachter.ch/*
// @match           *://*.blick.ch/*
// @match           *://*.faz.net/*
// @match           *://*.handelsblatt.com/*
// @match           *://*.handelszeitung.ch/*
// @match           *://*.kurier.at/*
// @match           *://*.nzz.ch/*
// @match           *://*.profil.at/*
// @match           *://*.schweizermonat.ch/*
// @match           *://*.themarket.ch/*
// @match           *://*.vn.at/*
// @match           *://*.vol.at/*
// @match           *://*.wochenblatt.com/*
// @connect         archive.fo
// @connect         archive.is
// @connect         archive.li
// @connect         archive.md
// @connect         archive.ph
// @connect         archive.vn
// @connect         fnetcore-api-prod.azurewebsites.net
// @connect         funkemedien.de
// @grant           GM.xmlHttpRequest
// @namespace https://greasyfork.org/users/1493917
// @downloadURL https://update.greasyfork.org/scripts/542350/Bypass%20Paywalls%20Clean%20-%20deatch.user.js
// @updateURL https://update.greasyfork.org/scripts/542350/Bypass%20Paywalls%20Clean%20-%20deatch.meta.js
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

if (matchDomain('automobilwoche.de')) {
  function automobilwoche_main() {
    if (window.Fusion) {
      window.Fusion.globalContent._id = 0;
      window.Fusion.globalContent.content_restrictions = {};
    }
  }
  window.setTimeout(function () {
    insert_script(automobilwoche_main);
  }, 100);
}

window.setTimeout(function () {

var de_funke_medien_domains = ['abendblatt.de', 'braunschweiger-zeitung.de', 'harzkurier.de', 'ikz-online.de', 'morgenpost.de', 'nrz.de', 'otz.de', 'thueringer-allgemeine.de', 'tlz.de', 'waz.de', 'wp.de', 'wr.de'];
var de_ippen_media_domains = ['fr.de', 'merkur.de', 'ovb-online.de'];
var de_lv_domains = ['profi.de', 'wochenblatt.com'];
var de_madsack_domains = ['haz.de', 'kn-online.de', 'ln-online.de', 'lvz.de', 'maz-online.de', 'neuepresse.de', 'ostsee-zeitung.de', 'rnd.de', 'saechsische.de'];
var de_motor_presse_domains = ['aerokurier.de', 'auto-motor-und-sport.de', 'flugrevue.de', 'motorradonline.de', 'womenshealth.de'];
var de_rp_medien_domains = ['ga.de', 'rp-online.de', 'saarbruecker-zeitung.de', 'volksfreund.de'];
var de_smn_domains = ['schwarzwaelder-bote.de', 'stuttgarter-nachrichten.de', 'stuttgarter-zeitung.de'];
var de_smn_custom_domains = ['cannstatter-zeitung.de', 'esslinger-zeitung.de', 'frankenpost.de', 'insuedthueringen.de', 'krzbb.de', 'kurier.de', 'np-coburg.de'];
var de_vrm_domains = ['allgemeine-zeitung.de', 'echo-online.de', 'wiesbadener-kurier.de'];
var de_vrm_custom_domains = ['buerstaedter-zeitung.de', 'hochheimer-zeitung.de', 'lampertheimer-zeitung.de', 'lauterbacher-anzeiger.de', 'main-spitze.de', 'mittelhessen.de', 'oberhessische-zeitung.de', 'wormser-zeitung.de'];

if (matchDomain('aachener-zeitung.de')) {
  let url = window.location.href;
  getArchive(url, 'div[data-testid="paywall-position-popover"]', '', 'article');
  let shade = document.querySelector('div.paywalled-article');
  if (shade)
    shade.classList.remove('paywalled-article');
  let noscroll = document.querySelectorAll('html[class], body[class]');
  for (let elem of noscroll)
    elem.removeAttribute('class');
  let ads = 'section[data-theme-sponsored-content]';
  hideDOMStyle(ads);
}

else if (matchDomain('aerztezeitung.de')) {
  let paywall = document.querySelector('div.AZLoginModule');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = json.articleBody;
        let content = document.querySelector('p.intro');
        if (json_text && content) {
          let article_new = document.createElement('p');
          article_new.innerText = json_text;
          content.after(article_new);
        }
      }
    }
  }
}

else if (matchDomain('automobilwoche.de')) {
  let banners = 'div#piano-paywall-container';
  hideDOMStyle(banners);
}

else if (matchDomain(['beobachter.ch', 'handelszeitung.ch'])) {
  window.setTimeout(function () {
  let paywall = document.querySelector('div#piano-inlined');
  if (paywall) {
    removeDOMElement(paywall);
    let fade = document.querySelector('div.article-body > div.paywall-wrapper-with-print-info');
    removeDOMElement(paywall, fade);
    let json_script = document.querySelector('script#hydrationdata');
    if (json_script) {
      try {
        let json = JSON.parse(json_script.text);
        if (json) {
          let url_id = json_script.text.includes('"gcid":"') ? json_script.text.split('"gcid":"')[1].split('"')[0] : '';
          if (url_id && !window.location.pathname.endsWith(url_id))
            refreshCurrentTab();
          let pars = json.state;
          let paragraphs = document.querySelectorAll('div.paragraph');
          let article = paragraphs[0];
          if (article) {
            article.setAttribute('class', 'paragraph text-paragraph');
            for (let paragraph of paragraphs)
              paragraph.innerHTML = '';
            let parser = new DOMParser();
            let img_first = true;
            let img_use = false;
            let img_caption;
            for (let par in pars) {
              let par_elem = pars[par];
              let elem = document.createElement('div');
              elem.style = 'font-size: 1.7rem; margin: 25px;';
              let sub_elem;
              if (par_elem.__typename === 'TextParagraph' && par_elem.text) {
                let content_new = parser.parseFromString('<div>' + par_elem.text + '</div>', 'text/html');
                sub_elem = content_new.querySelector('div');
              } else if (par_elem.__typename === 'EmbedParagraph' && par_elem.embedCode) {
                let content_new = parser.parseFromString('<div>' + par_elem.embedCode + '</div>', 'text/html');
                sub_elem = content_new.querySelector('div');
                let iframe = sub_elem.querySelector('iframe[width]');
                if (iframe) {
                  let ratio = iframe.width / (mobile ? 320 : 640);
                  iframe.width = iframe.width / ratio;
                  iframe.height = iframe.height / ratio;
                }
              } else if (par_elem.__typename === 'ImageFile') {
                if (par_elem.origin) {
                  if (!img_first) {
                    let img_attrib = {alt: par_elem.alt};
                    if (par_elem.width) {
                      let ratio = par_elem.width / (mobile ? 320 : 640);
                      img_attrib.width = par_elem.width / ratio;
                      img_attrib.height = par_elem.height / ratio;
                    }
                    sub_elem = makeFigure(par_elem.origin, '_', img_attrib);
                    img_caption = sub_elem.querySelector('figcaption');
                    img_use = true;
                  } else
                    img_first = false;
                }
              } else if (par_elem.__typename === 'Image') {
                if (img_use && img_caption && par_elem.credit)
                  img_caption.after('Quelle: ', par_elem.credit);
              } else if (par_elem.__typename === 'ImageParagraph') {
                if (img_use && img_caption && par_elem.caption)
                  img_caption.innerText = par_elem.caption.replace(/(<\/?[^>]+>)/g, '');
              } else if (par_elem.__typename === 'MinistageParagraph') {
                if (par_elem.ministage && par_elem.ministage.headline) {
                  sub_elem = document.createElement('p');
                  sub_elem.append(par_elem.ministage.headline, ' - ' + par_elem.ministage.lead);
                  if (par_elem.ministage.link) {
                    let sub_link = document.createElement('a');
                    sub_link.href = par_elem.ministage.link.path;
                    sub_link.innerText = par_elem.ministage.link.label;
                    sub_elem.append(document.createElement('br'), sub_link);
                  }
                }
              } else if (par_elem.__typename === 'ListicleItemParagraph') {
                if (par_elem.title &&par_elem.text && par_elem.link && par_elem.link.path) {
                  sub_elem = document.createElement('a');
                  sub_elem.href = par_elem.link.path;
                  sub_elem.innerText = par_elem.title + ' - ' + par_elem.text.replace(/(<\/?[^>]+>)/g, '');
                }
              } else if (par_elem.__typename === 'Product') {
                if (par_elem.title && par_elem.link && par_elem.link.path) {
                  sub_elem = document.createElement('a');
                  sub_elem.href = par_elem.link.path;
                  sub_elem.innerText = (par_elem.shortTitle ? par_elem.shortTitle + ' - ' : '') + par_elem.title;
                }
              } else if (!['Article', 'Author', 'BlockquoteParagraph', 'Channel', 'InfoBoxParagraph', 'LandingPage', 'Query', 'TeaserParagraph', 'TeaserStageParagraph'].includes(par_elem.__typename)) {
                console.log(par_elem);
              }
              if (sub_elem) {
                elem.appendChild(sub_elem);
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
  }, 1000);
  let ads = 'div.ad-wrapper, div[id^="apn-ad-slot-"], div[class^="piano-article-aside"]';
  hideDOMStyle(ads);
}

else if (matchDomain('berliner-zeitung.de')) {
  let url = window.location.href;
  getArchive(url, 'div[class^="soft-paywall_wrapper_"]', '', 'div#articleBody');
  let ads = 'div[class^="traffective_"], div[class^="article_billboard-"], div[class*="_ad_"], div[class^="outbrain_"], div[id^="qmn-ad-"], div[style]:empty, div[data-height]';
  hideDOMStyle(ads);
}

else if (matchDomain('bild.de')) {
  func_post = function () {
    if (mobile) {
      let lazy_images = document.querySelectorAll('figure img[loading="lazy"][style]');
      for (let elem of lazy_images) {
        elem.style = 'width: 95%; margin: 10px;';
        elem.parentNode.removeAttribute('style');
      }
      let header = document.querySelector('article > h2 > span:last-child');
      if (header)
        header.style = 'margin: 10px;';
      let content = document.querySelector('article time ~ div');
      if (content)
        content.style = 'margin: 10px;';
    }
    let div_empty = document.querySelectorAll('div[style]');
    for (let elem of div_empty)
      if (!elem.innerText.length)
        removeDOMElement(elem);
    let article = document.querySelector('main > article');
    if (article && article.innerText.length < 1000)
      header_nofix('h2', '', 'BPC > no archive-fix');
  }
  let url = window.location.href;
  getArchive(url, 'div.offer-module', '', 'article');
}

else if (matchDomain('blick.ch')) {
  let ads = 'aside[class*="slot-code"], aside[class*="_teaser_"][class*="slot-code"]';
  hideDOMStyle(ads);
}

else if (matchDomain('bnn.de')) {
  func_post = function () {
    if (mobile) {
      document.querySelectorAll('picture img[loading="lazy"][style]').forEach(e => e.style = 'width: 95%;');
    }
    header_nofix('article section', 'section > span[style*="filter:blur"]', 'BPC > no archive-fix');
  }
  let url = window.location.href;
  getArchive(url, 'section.paywall', '', 'article');
}

else if (matchDomain('boersen-zeitung.de')) {
  window.setTimeout(function () {
    let paywall = document.querySelector('storefront-section#paywall');
    if (paywall) {
      removeDOMElement(paywall);
      let url = window.location.href;
      replaceDomElementExt(url, false, false, 'article');
    }
  }, 2000);
}

else if (matchDomain('cicero.de')) {
  if (!window.location.search.startsWith('?amp')) {
    let url = window.location.href;
    getArchive(url, 'div.plenigo-paywall', '', 'article > div:has(> div.ad-container)', '', 'article > div:has(h3)');
  } else if (document.querySelector('div.paywall-fadeout'))
    ampToHtml();
}

else if (matchDomain('faz.net')) {
  let paywall = document.querySelector('div.wall');
  if (paywall) {
    removeDOMElement(paywall);
    let art_match = window.location.pathname.match(/-(\d+)\.html$/);
    if (art_match) {
      let article_id = art_match[1];
      let article_sel = 'div[data-external-selector="body-elements"]';
      let article = document.querySelector(article_sel);
      if (article) {
        article.removeAttribute('class');
        let intro = article.querySelector('[class][data-selector="body-paragraph"]');
        if (intro) {
          let par_class = intro.className;
          let url = window.location.href;
          let url_src = 'https://fnetcore-api-prod.azurewebsites.net/api/v3/article?id=' + article_id;
          getExtFetch(url_src, '', {}, main_faz);
          function main_faz(url, data) {
            try {
              if (data && intro) {
                let json_data = JSON.parse(data);
                let pars = json_data.content_elements;
                let parser = new DOMParser();
                let elem;
                for (let par of pars) {
                  if (par.html) {
                    let doc = parser.parseFromString(par.html, 'text/html');
                    let elem_type_match = par.html.match(/^<(\w+)/);
                    if (elem_type_match) {
                      let elem_type = elem_type_match[1];
                      elem = doc.querySelector(elem_type);
                      if (elem_type !== 'iframe')
                        elem.className = par_class;
                      if (elem_type.match(/h\d/))
                        elem.style = 'font-weight: bold;';
                    }
                  } else if (par.image && par.image.url) {
                    elem = makeFigure(par.image.url, par.image.caption + ' ' + par.image.source);
                    elem.style = 'margin: 20px 0px;';
                  } else if (!par.adItem && !par.articleIds && par.isBlurred)
                    console.log(par);
                  if (elem && intro.parentNode)
                    intro.parentNode.append(elem);
                }
                removeDOMElement(intro);
                if (window.location.pathname.startsWith('/podcasts/')) {
                  let audio = document.querySelector('button[track-label="Podcast"]');
                  if (audio && json_data.podcastAudioInfo && json_data.podcastAudioInfo.url) {
                    let audio_new = document.createElement('audio');
                    audio_new.src = json_data.podcastAudioInfo.url;
                    audio_new.setAttribute('controls', '');
                    audio.parentNode.replaceChild(audio_new, audio);
                  }
                } else {
                  let audio = document.querySelector('button[track-label="TTS"]');
                  if (audio && json_data.audioInfo && json_data.audioInfo.url) {
                    let audio_new = document.createElement('audio');
                    audio_new.src = json_data.audioInfo.url;
                    audio_new.setAttribute('controls', '');
                    audio.parentNode.replaceChild(audio_new, audio);
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
  }
  let ads = 'div.lay-PaySocial, div.iqadtile_wrapper, div.iqdcontainer';
  hideDOMStyle(ads);
}

else if (matchDomain('freitag.de')) {
  let paywall = document.querySelector('section.qa-paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let related = document.querySelector('div.c-teaser-plus-related--paywall');
    if (related)
      related.classList.remove('c-teaser-plus-related--paywall');
    let article = document.querySelector('div.bo-article-text');
    if (article) {
      let json_script = getArticleJsonScript();
      if (json_script) {
        let json = JSON.parse(json_script.text);
        if (json) {
          let json_text = breakText_headers(json.articleBody);
          let pars = json_text.split(/\n\n/g);
          if (json_text) {
            article.innerHTML = '';
            for (let par of pars) {
              if (!par.startsWith('Placeholder ')) {
                let par_new = document.createElement('p');
                par_new.innerText = par;
                article.appendChild(par_new);
              }
            }
          }
        }
      } else {
        let hidden_article = document.querySelector('div.o-paywall');
        if (hidden_article) {
          let par_first = true;
          let pars = breakText_headers(hidden_article.innerText).split(/\n\n/g);
          for (let par of pars) {
            let par_new = document.createElement('p');
            let overlap = '';
            if (par_first) {
              let intro = article.querySelectorAll('p');
              let intro_last = intro[intro.length - 1];
              par = par.trim();
              overlap = findOverlap(intro_last.innerText, par);
              if (overlap)
                intro_last.innerText = intro_last.innerText.replace(new RegExp(overlap + '$'), '') + par;
              par_first = false;
            }
            if (!overlap && !par.startsWith('Placeholder ')) {
              par_new.innerText = par;
              article.appendChild(par_new);
            }
          }
        }
      }
    }
  }
}

else if (matchDomain('handelsblatt.com')) {
  let paywall = document.querySelector('app-paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('article');
    if (article) {
      let url = window.location.href;
      article.after(googleSearchToolLink(url));
      header_nofix('article', '', 'BPC > refresh page');
    }
  }
  window.localStorage.removeItem('HB.METERING');
  let overlay = document.querySelector('div[id^="sp_message_container_"]');
  removeDOMElement(overlay);
  let noscroll = document.querySelector('html[class]');
  if (noscroll)
    noscroll.removeAttribute('class');
}

else if (matchDomain('heise.de')) {
  func_post = function () {
    header_nofix('article', paywall_sel, 'BPC > no archive-fix');
    let dark_mode = document.querySelector('html.dark');
    if (dark_mode)
      dark_mode.classList.remove('dark');
    if (mobile) {
      document.querySelectorAll('figure img[loading="lazy"][style]').forEach(e => e.style = 'width: 95%;');
    }
  }
  let paywall_sel = 'a-gift:has(div.paywall-delimiter)';
  let url = window.location.href;
  getArchive(url, paywall_sel, '', 'article');
  let ads = 'div.ad-ldb-container, div.inread-cls-reduc, aside.img-ad';
  hideDOMStyle(ads);
}

else if (matchDomain('jacobin.de')) {
  let paywall = pageContains('h3.m-auto', 'Dieser Artikel ist nur mit Abo zugänglich.');
  if (paywall.length) {
    let slash = document.querySelector('div.slash');
    removeDOMElement(paywall[0].parentNode, slash);
    let json_script = document.querySelector('script#__NEXT_DATA__');
    if (json_script) {
      try {
        let json = JSON.parse(json_script.text);
        if (json && json.props.pageProps.sections && json.props.pageProps.sections[1].content) {
          let url_next = json.query.slug;
          if (url_next && !window.location.pathname.includes(url_next))
            refreshCurrentTab();
          let pars = json.props.pageProps.sections[1].content;
          let first_par = document.querySelector('body > div#__next p.bodyText');
          if (first_par) {
            let par_class = first_par.getAttribute('class');
            let article = first_par.parentNode;
            if (article) {
              let add_par = false;
              for (let par of pars) {
                if (!add_par) {
                  if (par.type === 'paywall')
                    add_par = true;
                } else {
                  if (par.text) {
                    let elem_type = 'p';
                    let elem_class = par_class;
                    let elem_style;
                    if (['paragraph', 'quote'].includes(par.type)) {
                      if (par.type === 'quote')
                        elem_style = 'font-size: 36px; font-weight: bold;';
                    } else if (par.type === 'header') {
                      elem_type = 'h2';
                      elem_class = 'content-element font-headline h2 my-1em';
                    }
                    let content = par.text.replace(/&nbsp;/g, '');
                    let parser = new DOMParser();
                    let content_new = parser.parseFromString('<' + elem_type + ' class="' + elem_class + (elem_style ? '" style="' + elem_style : '') + '">' + content + '</' + elem_type + 'p>', 'text/html');
                    article.appendChild(content_new.querySelector(elem_type));
                  } else
                    console.log(par);
                }
              }
              let author_footer = article.querySelector('div.content-element > div > h3');
              if (author_footer)
                article.appendChild(author_footer.parentNode.parentNode);
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
}

else if (matchDomain('krautreporter.de')) {
  let paywall = document.querySelector('section.js-access-wall');
  if (paywall) {
    removeDOMElement(paywall);
    window.setTimeout(function () {
      document.querySelectorAll('.blurred').forEach(e => e.classList.remove('blurred', 'json-ld-paywall-marker', 'hidden@print'));
    }, 500);
    let banners = 'div.js-paywall-divider, #steady-checkout';
    hideDOMStyle(banners);
  }
}

else if (domain = matchDomain(['ksta.de', 'rundschau-online.de'])) {
  setCookie('anon_cookie', '', domain, '/', 0);
  function unhide_article(node) {
    removeDOMElement(node);
    let article = document.querySelector('div[data-article-content][style]');
    if (article)
      article.removeAttribute('style');
  }
  waitDOMElement('div[data-type="paywall"]', 'DIV', unhide_article, true);
  let banners = 'div.dm-slot, div.dm-zephr-banner';
  hideDOMStyle(banners);
}

else if (matchDomain('kurier.at')) {
  let paywall = document.querySelector('div#cfs-paywall-container');
  if (paywall) {
    removeDOMElement(paywall);
    let div_hidden = document.querySelector('div.paywall');
    if (div_hidden) {
      div_hidden.classList.remove('paywall');
      div_hidden.removeAttribute('style');
    }
  }
  let ads = 'div[data-ad], div[data-outbrain]';
  hideDOMStyle(ads);
}

else if (matchDomain(['mittelbayerische.de', 'pnp.de'])) {
  let url = window.location.href;
  getArchive(url, 'div.paywall-layer', '', 'div#article-body');
  let ads = 'div.d-sm-block';
  hideDOMStyle(ads);
}

else if (matchDomain('motorradonline.de')) {
  if (window.location.pathname.endsWith('/amp/'))
    ampToHtml();
}

else if (matchDomain('nw.de')) {
  let paywall = document.querySelector('div[class*="paywall-overlay"]');
  if (paywall) {
    paywall.removeAttribute('class');
    let json_script = getArticleJsonScript();
    if (json_script) {
      try {
        let json = JSON.parse(json_script.text);
        let json_text = parseHtmlEntities(json.articleBody.replace(/\n/g, '\n\n').replace(/\.responsive[-@%{}()\.:;\w\s]+}\s?}/g, ''));
        paywall.innerText = json_text;
      } catch (err) {
        console.log(err);
      }
    }
  }
}

else if (matchDomain('nwzonline.de')) {
  let ads = 'div.adslot';
  hideDOMStyle(ads);
}

else if (matchDomain(['nzz.ch', 'themarket.ch'])) {
  let fade = document.querySelectorAll('.nzzinteraction');
  for (let elem of fade)
    elem.classList.remove('nzzinteraction');
  let fade_new = document.querySelector('div.barrier');
  if (fade_new)
    fade_new.removeAttribute('class');
  let ads = 'div.resor';
  hideDOMStyle(ads);
}

else if (matchDomain('philomag.de')) {
  let paywall = document.querySelector('div[id^="block-paywall"]');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = json.articlebody.replace(/%paywall%/g, '').replace(/(\\r)?\\n/g, '<br><br>');
        let content = document.querySelector('div.content-center > div.description');
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

else if (matchDomain('profil.at')) {
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    paywall.removeAttribute('class');
    paywall.removeAttribute('style');
    let fade = 'div#cfs-paywall-container';
    hideDOMStyle(fade);
  }
  let overlay = 'div.consentOverlay';
  hideDOMStyle(overlay, 2);
}

else if (matchDomain('schweizermonat.ch')) {
  getJsonUrl('div.entry-paywall-login', '', 'div.entry-main > div.entry__post-content');
}

else if (matchDomain('spektrum.de')) {
  let paywall = document.querySelector('article.pw-premium');
  if (paywall)
    paywall.classList.remove('pw-premium');
}

else if (matchDomain(['spiegel.de', 'manager-magazin.de'])) {
  let url = window.location.href;
  func_post = function () {
    let failed_iframes = document.querySelectorAll('div > div[x-show="!iframeIsLoaded"]');
    for (let elem of failed_iframes)
      hideDOMElement(elem.parentNode);
    let body_dark = document.querySelector('body[class*="dark:"]');
    if (body_dark)
      removeClassesByPrefix(body_dark, 'dark:');
    let charts = document.querySelectorAll('section div[x-data*="{isLoaded:"]');
    for (let elem of charts)
      elem.style.height = elem.offsetHeight + 'px';
    if (mobile) {
      let lazy_images = document.querySelectorAll('picture img[loading="lazy"][style]');
      for (let elem of lazy_images)
        elem.style = 'width: 95%;';
    }
    header_nofix('article', 'svg[id*="-plus-paywall-"]', 'BPC > no archive-fix');
  }
  getArchive(url, 'div[data-area="paywall"]', '', 'article');
}

else if (matchDomain('springermedizin.de')) {
  let paywall = document.querySelector('div#pay-wall');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = json.articleBody;
        let article = document.querySelector('div > p.intro--paragraph');
        if (json_text && article) {
          let article_new = document.createElement('p');
          article_new.innerText = json_text;
          article.parentNode.replaceChild(article_new, article);
        }
      }
    }
  }
}

else if (matchDomain('stern.de')) {
  func_post = function () {
    header_nofix(link_sel, paywall_sel, 'BPC > no archive-fix');
    if (mobile) {
      let article = document.querySelector(article_src_sel);
      if (article) {
        let lazy_images = article.querySelectorAll('figure > img[loading="lazy"][style]');
        for (let elem of lazy_images) {
          elem.style = 'width: 95%;';
          elem.parentNode.style = 'margin-bottom: 20px';
          let caption = elem.parentNode.querySelector('figcaption');
          if (caption)
            caption.style = 'width: 95%;';
        }
        let article_recs = article.querySelectorAll('article');
        for (let elem of article_recs)
          elem.style = 'width: 95%;';
        let article_opulent = document.querySelector('div.page-opulent__body-inner > div > div');
        if (article_opulent) {
          article_opulent.removeAttribute('style');
          let gradient = 'span[style*="linear-gradient"]';
          hideDOMStyle(gradient);
        }
      }
    }
    let widgets = document.querySelectorAll('ws-socialwidget > slot > slot[slot="content"]');
    for (let elem of widgets) {
      let parser = new DOMParser();
      let doc = parser.parseFromString('<div style="margin: 20px 0px;">' + elem.innerText + '</div>', 'text/html');
      let elem_new = doc.querySelector('div');
      let container = elem.parentNode.parentNode;
      container.parentNode.replaceChild(elem_new, container);
    }
  }
  let paywall_sel = 'main > article ws-paywall';
  let article_sel = 'div.article__body';
  let article_src_sel = 'main > article > div:last-child';
  let link_sel = 'div.page__content-inner, div.page-opulent';
  let url = window.location.href;
  getArchive(url, paywall_sel, '', article_sel, '', article_src_sel, link_sel);
}

else if (matchDomain('sueddeutsche.de')) {
  let url = window.location.href;
  if (matchDomain('sz-magazin.sueddeutsche.de')) {
    func_post = function () {
      header_nofix('main', 'div#sz-paywall:not(:empty)', 'BPC > no archive-fix');
    }
    getArchive(url, 'div.offerpage-container', '', 'main');
  } else if (window.location.pathname.startsWith('/projekte/artikel/')) {
    func_post = function () {
      let lazy_images = document.querySelectorAll('img[loading="lazy"][style*="min-width:"]');
      for (let elem of lazy_images)
        elem.style = 'width: 80%; margin: auto;';
      let sticky = document.querySelectorAll('div > div > div[old-position="sticky"]');
      for (let elem of sticky) {
        let div_hidden = elem.parentNode.parentNode.querySelector('div[style^="display:none;"]');
        if (div_hidden)
          div_hidden.removeAttribute('style');
        removeDOMElement(elem.parentNode);
      }
      if (intro) {
        let intro_old = document.querySelector(intro_sel);
        if (intro_old && intro_old.parentNode)
          intro_old.parentNode.replaceChild(intro, intro_old);
      }
      header_nofix('main', 'div#sz-paywall', 'BPC > no archive-fix');
    }
    let intro_sel = 'section#module-0';
    let intro = document.querySelector(intro_sel);
    getArchive(url, 'div.offer-page', '', 'main');
  } else {
    getArchive(url, 'head > meta[content="locked"]', '', 'div[itemprop="articleBody"]');
  }
  let ads = 'er-ad-slot, div.iqdcontainer';
  hideDOMStyle(ads);
}

else if (matchDomain('suedkurier.de')) {
  func_post = function () {
    let article = document.querySelector(article_sel);
    if (article) {
      let pars = article.querySelectorAll('section > div > div[style^="box-sizing:"]');
      if (pars && pars.length < 3)
        header_nofix(article_sel, '', 'BPC > no archive-fix');
    }
  }
  let url = window.location.href;
  let article_sel = 'main > article';
  getArchive(url, 'aside.article-paywall', '', article_sel);
}

else if (matchDomain('t3n.de')) {
  let paywall = document.querySelector('div.c-paywall__wrapper');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = json.articleBody;
        if (json_text.includes('[embed]'))
          json_text = json_text.replace(/\[embed\]([^\[]+)\[\/embed\]/g, '$1\n');
        json_text = json_text.replace(/\[[^\]]+\]/g, '');
        let article = document.querySelector('div.paywall-blur > p');
        if (json_text && article) {
          article.innerText = parseHtmlEntities(json_text);
          article.parentNode.removeAttribute('class');
        }
      }
    }
  }
}

else if (matchDomain('tagesspiegel.de')) {
  let paywall_sel = 'div#paywall';
  let article_sel = 'div#story-elements';
  let url = window.location.href;
  if (matchDomain('www.tagesspiegel.de')) {
    func_post = function () {
      let pars = document.querySelectorAll(article_sel + ' > div[style*="font-variant-numeric:"]');
      if (pars.length < 3) {
        let article = document.querySelector(article_sel);
        if (article)
          article.before(googleSearchToolLink(url));
      } else {
        let videos = document.querySelectorAll('div[old-src]:not([src])');
        for (let elem of videos) {
          let iframe = document.createElement('iframe');
          iframe.src = elem.getAttribute('old-src');
          iframe.style = 'width: 100%; height: 400px;';
          elem.parentNode.replaceChild(iframe, elem);
        }
        let opinionary = document.querySelector('div > div#opinary-automation-placeholder');
        if (opinionary)
          hideDOMElement(opinionary.parentNode);
        if (mobile) {
          let lazy_images = document.querySelectorAll('figure img[loading="lazy"][style]');
          for (let elem of lazy_images)
            elem.style = 'width: 95%;';
        }
      }
    }
    getArchive(url, paywall_sel, '', article_sel);
  } else if (matchDomain('interaktiv.tagesspiegel.de')) {
    let paywall = document.querySelector(paywall_sel);
    if (paywall) {
      removeDOMElement(paywall);
      let article = document.querySelector('main.tslr-article p');
      if (article) {
        article.before(googleSearchToolLink(url));
        article.before(archiveLink(url));
      }
    }
  }
  let ads = 'div.iqdcontainer';
  hideDOMStyle(ads);
}

else if (matchDomain('vn.at')) {
  if (window.location.href.match(/\.vn\.at\/.+\/\d{4}\//)) {
    let paywall = document.querySelector('div.paywalled-content');
    if (paywall) {
      let par = paywall.querySelector('p');
      if (!par) {
        refreshCurrentTab();
      } else {
        let lazy_images = document.querySelectorAll('img[src^="data:image/"][lazy-src]');
        for (let elem of lazy_images) {
          elem.src = elem.getAttribute('lazy-src');
        }
      }
    } else
      refreshCurrentTab();
  }
}

else if (matchDomain('vol.at')) {
  if (!window.location.pathname.match(/\/amp\/?$/)) {
    window.setTimeout(function () {
      let paywall = document.querySelector('div.vodl-region-article__premium-content');
      if (paywall) {
        paywall.removeAttribute('class');
        if (!paywall.hasChildNodes()) {
          let json_script = document.querySelector('script#externalPostDataNode');
          if (json_script) {
            try {
              let json = JSON.parse(json_script.text);
              let json_text = json.content.data.post.content;
              let parser = new DOMParser();
              let doc = parser.parseFromString('<div class="entry-content">' + json_text + '</div>', 'text/html');
              let article_new = doc.querySelector('div');
              let hidden_images = article_new.querySelectorAll('img[src^="/"][srcset]');
              let json_domain = json.content.data.post.thumbnail.src.match(/https:\/\/(www\.)?\w+\.at/)[0];
              for (let elem of hidden_images) {
                elem.src = elem.src.replace('https://www.vol.at', json_domain);
                elem.removeAttribute('srcset');
              }
              let hidden_comments = document.querySelector('div[class*="backdrop-blur"]');
              if (hidden_comments)
                hidden_comments.removeAttribute('class');
              let article = document.querySelector('div.article-body');
              if (article) {
                article.innerHTML = '';
                article.appendChild(article_new);
              }
            } catch (err) {
              console.log(err);
            }
          }
        }
      }
    }, 500);
    let ads = 'div[id^="rm-adslot-"], div[id^="piano_rec"]';
    hideDOMStyle(ads);
  } else
    ampToHtml();
}

else if (matchDomain('weltkunst.de')) {
  let paywall = document.querySelector('section.paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let json_url_dom = document.querySelector('head > link[rel="alternate"][type="application/json"][href]');
    if (json_url_dom) {
      let json_url = json_url_dom.href;
      fetch(json_url)
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            let json_text = json.content.rendered;
            let content = document.querySelector('div.article div.text');
            if (json_text) {
              if (content) {
                let parser = new DOMParser();
                let doc = parser.parseFromString('<div>' + json_text + '</div>', 'text/html');
                let content_new = doc.querySelector('div');
                content.innerHTML = '';
                content.appendChild(content_new);
              }
            } else
              header_nofix(content);
          });
        }
      });
    }
  }
  let par_initial = document.querySelector('p.initial');
  removeDOMElement(par_initial);
}

else if (matchDomain('welt.de')) {
  func_post = function () {
    if (mobile) {
      let headers = document.querySelectorAll('main header, main header ~ div');
      for (let elem of headers)
        elem.removeAttribute('style');
      let main_divs = document.querySelectorAll('main div[style] > div > div[id]');
      for (let elem of main_divs) {
        if (elem.querySelector('img'))
          elem.parentNode.parentNode.removeAttribute('style');
      }
      let lazy_images = document.querySelectorAll('main img[loading="lazy"][style]');
      for (let elem of lazy_images)
        elem.style = 'width: 95%;';
    }
    header_nofix('main header', 'img[alt^="WELTplus"][loading]', 'BPC > no archive-fix');
    let ads = pageContains('span', 'Anzeige');
    removeDOMElement(...ads);
  }
  let url = window.location.href;
  getArchive(url, 'div.contains_walled_content, div.c-article-paywall', '', 'main header + div');
  let ads = 'div[data-component="Outbrain"], div[class*="c-ad"]';
  hideDOMStyle(ads);
}

else if (matchDomain('weser-kurier.de')) {
  let ads = 'div.ad-wrapper, div.anyad, div.msn-ads';
  hideDOMStyle(ads);
}

else if (matchDomain('wiwo.de')) {
  window.setTimeout(function () {
  let paywall = document.querySelector('app-paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('app-blind-text');
    if (article) {
      let url = window.location.href;
      article.before(googleSearchToolLink(url));
      let json_script = getArticleJsonScript();
      if (json_script) {
        let json = JSON.parse(json_script.text);
        if (json) {
          let json_text = json.find(x => x.articleBody).articleBody;
          let article_new = document.createElement('div');
          article_new.innerText = json_text.replace(/[\r\n]/g, '\r\n\r\n');
          article_new.style = 'margin: 20px;';
          article.parentNode.replaceChild(article_new, article);
        }
      }
    }
  }
  }, 2000);
  let ads = 'div.iqadtile';
  hideDOMStyle(ads);
}

else if (matchDomain('zeit.de')) {
  let header_sel = 'article > header';
  let header = document.querySelector(header_sel);
  func_post = function () {
    if (header) {
      let header_new = document.querySelector(header_sel);
      if (header_new)
        header_new.parentNode.replaceChild(header, header_new);
    }
    let comments_link = document.querySelector('div[style*="align-items"] a[href$="#comments"]');
    if (comments_link)
      comments_link.href = '#comments';
    document.querySelectorAll('div[style*="padding-bottom:"]:has(figure), div[style*="grid-template-columns:"]:has(figure)').forEach(e => e.removeAttribute('style'));
    let gst_link = false;
    let figures = document.querySelectorAll('figure:has(img[loading="lazy"][style])');
    for (let figure of figures) {
      let lazy_image = figure.querySelector('img');
      if (lazy_image.src.startsWith('data:image/')) {
        let json_script = figure.querySelector('script[type="application/ld+json"]:not(:empty)');
        if (json_script && json_script.text.match(/"url":\s?"/)) {
          let img_url = json_script.text.split(/"url":\s?"/)[1].split('",')[0];
          if (!img_url.includes('.zeit.de/newsletter/')) {
            lazy_image.src = img_url;
            lazy_image.style = 'width: 95%;';
            figure.removeAttribute('style');
          }
        } else if (!gst_link && !figure.querySelector('figcaption[style*="display:none;"]')) {
          gst_link = true;
          header.append(googleSearchToolLink(url));
          header_nofix('div#bpc_archive', '', 'BPC > no images (see GST-link)');
        }
      } else
        lazy_image.style = 'width: 95%;';
    }
    let videos = document.querySelectorAll('div > div[allowfullscreen][old-src]');
    for (let elem of videos) {
      let iframe = document.createElement('iframe');
      iframe.src = elem.getAttribute('old-src');
      iframe.style = 'width: 100%; height: 400px;';
      elem.parentNode.replaceChild(iframe, elem);
    }
    let charts = document.querySelectorAll('div > div[id^="datawrapper-chart-"][old-src]');
    for (let elem of charts) {
      let iframe = document.createElement('iframe');
      iframe.src = elem.getAttribute('old-src');
      iframe.style = 'width: 100%; height: 400px; border: none;';
      elem.parentNode.replaceChild(iframe, elem);
    }
    if (mobile) {
      let span_empty = document.querySelectorAll('span:empty');
      removeDOMElement(...span_empty);
    }
    let ads = 'div[style*=";min-height:"]:has( > div[id^="iqadtile"])';
    hideDOMStyle(ads, 2);
  }
  let url = window.location.href.split(/[#\?]/)[0];
  if (document.querySelector('head > link[rel="next"]'))
    url += '/komplettansicht';
  getArchive(url, 'aside#paywall', '', 'main', '', 'main', 'article > div');
  let ads = 'div[id^="iqadtile"], .iqdcontainer';
  hideDOMStyle(ads);
}

else if (matchDomain(de_funke_medien_domains)) {
  let paywall = document.querySelector('div#paywall-container');
  if (paywall) {
    removeDOMElement(paywall);
    let spark_script = document.querySelector('script#__SPARK__');
    if (spark_script) {
      let match = spark_script.text.match(/PUBLICATION:\s?'([\w-]+)',/);
      if (match) {
        func_post = function () {
          document.querySelectorAll('div[data-carousel-id-slider]').forEach(x => x.removeAttribute('class'));
          let embed_templates = document.querySelectorAll('div[data-embed-id] > template[data-embedbox-id-embed-template]');
          for (let elem of embed_templates) {
            let parser = new DOMParser();
            let doc = parser.parseFromString('<div>' + elem.innerHTML + '</div>', 'text/html');
            let blockquote = doc.querySelector('div');
            elem.parentNode.before(blockquote);
            removeDOMElement(elem.parentNode);
          }
          let charts = document.querySelectorAll('aside > div[id^="datawrapper-vis-"]');
          for (let elem of charts) {
            let img = elem.querySelector('noscript > img[src]');
            if (img) {
              elem.parentNode.before(img);
              removeDOMElement(elem.parentNode);
            }
          }
        }
        let spark_domain = match[1];
        let url_src = 'https://app-webview.sparknews.funkemedien.de/' + spark_domain + window.location.pathname;
        fetch_headers = {"Authorization": "Basic YXBpOkNTeGxxRG1YM2xCTmRsS1l6allRcWZqTnFZMkhQVUVm"};
        replaceDomElementExt(url_src, true, false, 'div.article-body', 'BPC > no fix (source file)');
      }
    }
  }
  let ads = 'aside[data-module-id="SparkAdSlotModule"]';
  hideDOMStyle(ads);
}

else if (matchDomain(de_lv_domains)) {
  let paywall = document.querySelector('div[id^="paymentprocess-"]');
  if (paywall) {
    let intro = document.querySelector('div.m-paywall__textFadeOut');
    removeDOMElement(paywall, intro);
    let div_hidden = document.querySelector('div.paywall-full-content[style]');
    if (div_hidden) {
      div_hidden.removeAttribute('class');
      div_hidden.removeAttribute('style');
    }
  }
  let ads = 'div.adZone';
  hideDOMStyle(ads);
}

else if (matchDomain(de_motor_presse_domains)) {
  let ads = 'div#ads-container, div.va-sponsored, div.mps_markAd';
  hideDOMStyle(ads);
}

else if (matchDomain(de_rp_medien_domains)) {
  func_post = function () {
    header_nofix('article', 'div#park-paywall', 'BPC > no archive-fix');
    let videos = 'glomex-player';
    hideDOMStyle(videos, 5);
  }
  let url = window.location.href;
  getArchive(url, 'div.park-paywall-content', '', 'article');
  let ads = 'div.portal-slot';
  hideDOMStyle(ads);
}

else if (matchDomain(de_madsack_domains) || document.querySelector('head > link[href*=".rndtech.de/"]')) {
  if (!window.location.search.includes('outputType=valid_amp')) {
    let ads = 'div[class^="Adstyled__AdWrapper"]';
    hideDOMStyle(ads);
  } else {
    ampToHtml();
  }
}

else if (matchDomain(de_smn_domains) || matchDomain(de_smn_custom_domains)) {
  if (matchDomain(de_smn_domains)) {
    let restricted = document.querySelector('div.restricted-area');
    if (restricted)
      restricted.classList.remove('restricted-area');
  } else {
    func_post = function () {
      if (mobile) {
        document.querySelectorAll('figure > img[loading="lazy"][style]').forEach(e => e.style = 'width: 95%;');
      }
    }
    let url = window.location.href;
    getArchive(url, 'div.mod-paywall, div.upscore-paywall-placeholder', '', 'article, div#article-container');
  }
  let ads = 'div.mod-paywall, div.Billboard, div[id*="board"], div.ad, div[id^="traffective-ad-"], div.glomex';
  hideDOMStyle(ads);
}

else if (matchDomain(de_ippen_media_domains) || document.querySelector('header a[href^="https://www.ippen.media"]')) {
  let ads = 'div[class^="id-TBeepSlot-"], div[data-id-advertdfpconf]';
  hideDOMStyle(ads);
}

else if (matchDomain(de_vrm_domains) || matchDomain(de_vrm_custom_domains)) {
  func_post = function () {
    let article = document.querySelector(article_sel);
    if (article) {
      article.querySelectorAll('div > div[role="button"]').forEach(e => removeDOMElement(e.parentNode));
      if (mobile) {
        let pictures = document.querySelectorAll('picture > img[style]');
        for (let elem of pictures) {
          elem.style = 'width: 95%; margin: 10px;';
          elem.parentNode.removeAttribute('style');
        }
      }
    }
  }
  let article_sel = 'article section';
  let url = window.location.href;
  window.setTimeout(function () {
    getArchive(url, 'div.--blurredContent', {rm_attrib: 'class'}, article_sel);
  }, 1000);
  let ads = 'div.adSlot, div.loadingBanner';
  hideDOMStyle(ads);
}

ads_hide();
leaky_paywall_unhide();

}, 1000);

// General Functions

// import (see @require)

function breakText_headers(str) {
  str = breakText(str, true);
  // exceptions: names with alternating lower/uppercase (no general fix)
  let str_rep_arr = ['AstraZeneca', 'BaFin', 'BerlHG', 'BfArM', 'BilMoG', 'BioNTech', 'ChatGPT', 'DiGA', 'EuGH', 'FinTechRat', 'GlaxoSmithKline', 'IfSG', 'medRxiv', 'mmHg', 'OpenAI', 'PlosOne', 'StVO', 'TikTok'];
  let str_rep_split;
  let str_rep_src;
  for (let str_rep of str_rep_arr) {
    str_rep_split = str_rep.split(/([a-z]+)(?=[A-Z](?=[A-Za-z]+))/);
    str_rep_src = str_rep_split.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue + ((currentValue !== currentValue.toUpperCase()) ? '\n\n' : '');
      });
    if (str_rep_src.endsWith('\n\n'))
      str_rep_src = str_rep_src.slice(0, -2);
    str = str.replace(new RegExp(str_rep_src, "g"), str_rep);
  }
  str = str.replace(/De\n\n([A-Z])/g, "De$1");
  str = str.replace(/La\n\n([A-Z])/g, "La$1");
  str = str.replace(/Le\n\n([A-Z])/g, "Le$1");
  str = str.replace(/Mc\n\n([A-Z])/g, "Mc$1");
  return str;
}

})();
