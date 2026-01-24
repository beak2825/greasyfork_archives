// ==UserScript==
// @name            Bypass Paywalls Clean - nl/be
// @version         4.2.8.7
// @description     Bypass Paywalls of news sites
// @author          magnolia1234
// @homepageURL     https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters
// @supportURL      https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters
// @license         MIT; https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=LICENSE
// @noframes
// @match           *://*.nl/*
// @match           *://*.businessam.be/*
// @match           *://*.demorgen.be/*
// @match           *://*.doorbraak.be/*
// @match           *://*.flair.be/nl/*
// @match           *://*.gva.be/*
// @match           *://*.hbvl.be/*
// @match           *://*.hln.be/*
// @match           *://*.humo.be/*
// @match           *://*.knack.be/*
// @match           *://*.kw.be/*
// @match           *://*.libelle.be/*
// @match           *://*.nieuwsblad.be/*
// @match           *://*.projectcargojournal.com/*
// @match           *://*.railfreight.cn/*
// @match           *://*.railfreight.com/*
// @match           *://*.railtech.be/*
// @match           *://*.railtech.com/*
// @match           *://*.standaard.be/*
// @match           *://*.taxipro.be/*
// @match           *://*.tijd.be/*
// @connect         archive.fo
// @connect         archive.is
// @connect         archive.li
// @connect         archive.md
// @connect         archive.ph
// @connect         archive.vn
// @grant           GM.xmlHttpRequest
// @namespace https://greasyfork.org/users/1493917
// @downloadURL https://update.greasyfork.org/scripts/542356/Bypass%20Paywalls%20Clean%20-%20nlbe.user.js
// @updateURL https://update.greasyfork.org/scripts/542356/Bypass%20Paywalls%20Clean%20-%20nlbe.meta.js
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

var be_mediahuis_domains = ['gva.be', 'hbvl.be', 'nieuwsblad.be', 'standaard.be'];
var be_roularta_domains = ['beleggersbelangen.nl', 'flair.be', 'knack.be', 'kw.be', 'libelle.be'];
var nl_dpg_adr_domains = ['ad.nl', 'bd.nl', 'bndestem.nl', 'destentor.nl', 'ed.nl', 'gelderlander.nl', 'pzc.nl', 'tubantia.nl'];
var nl_dpg_media_domains = ['demorgen.be', 'flair.nl', 'humo.be', 'libelle.nl', 'margriet.nl', 'parool.nl', 'trouw.nl', 'volkskrant.nl'];
var nl_mediahuis_region_domains = ['gooieneemlander.nl', 'haarlemsdagblad.nl', 'ijmuidercourant.nl', 'leidschdagblad.nl', 'limburger.nl', 'noordhollandsdagblad.nl'];

if (matchDomain('adformatie.nl')) {
  document.querySelectorAll('iframe[uc-src]').forEach(e => e.src = e.getAttribute('uc-src'));
  let ads = 'div.c-ad-slot';
  hideDOMStyle(ads);
}

else if (matchDomain(be_mediahuis_domains)) {
  window.setTimeout(function () {
    let video = document.querySelector('div.video, div[data-testid="article-video"]');
    func_post = function () {
      let article = document.querySelector(article_sel);
      if (article) {
        if (video) {
          if (matchDomain(['gva.be', 'nieuwsblad.be'])) {
            let placeholder = video.querySelector('div[class^="Placeholder_placeholder"]');
            if (placeholder)
              placeholder.removeAttribute('class');
          }
          let video_new = article.querySelector('div[id$="-streamone"], div[id^="video-player-"], div[id^="player_"]');
          if (video_new && video_new.parentNode)
            video_new.parentNode.replaceChild(video, video_new);
          else {
            let header = article.querySelector('h1');
            let br = document.createElement('br');
            if (header)
              header.after(br, video, br);
          }
        }
        let gallery, img_width, captions, next, next_images, next_img_width;
        let gallery_new = document.createElement('div');
        let figure_nr = 0;
        let gallery_figures = document.querySelectorAll('div > ul > li > figure');
        for (let figure of gallery_figures) {
          if (!figure_nr) {
            gallery = figure.parentNode.parentNode.parentNode;
            captions = Array.from(gallery.querySelectorAll('span')).filter(e => e.innerText.includes('©'));
            next = gallery.nextSibling;
            if (next)
              next_images = next.querySelectorAll('img[currentsourceurl]');
          }
          let img = figure.querySelector('img[currentsourceurl]');
          if (img && next_images) {
            let img_src = img.getAttribute('currentsourceurl');
            if (img_src) {
              if (img_src.includes('/alternates/'))
                img_width = img_src.split('/alternates/')[1].split('/')[0];
            } else if (img_width && next_images[figure_nr]) {
              img_src = next_images[figure_nr].getAttribute('currentsourceurl');
              if (img_src && img_src.includes('/alternates/')) {
                next_img_width = img_src.split('/alternates/')[1].split('/')[0];
                img_src = img_src.replace(next_img_width, img_width);
              }
            }
            let figure_new = makeFigure(img_src, captions && captions[figure_nr] ? captions[figure_nr].parentNode.innerText : '', {style: 'height: 500px;'});
            figure_new.style = 'margin: 20px 0px;';
            gallery_new.appendChild(figure_new);
          }
          figure_nr++;
        }
        if (gallery && next) {
          next.after(gallery_new);
          removeDOMElement(gallery, next);
        }
        let errors = document.querySelectorAll('div[height][old-src]:not([src]):has(div#__next_error__)');
        for (let elem of errors) {
          let iframe = document.createElement('iframe');
          iframe.src = elem.getAttribute('old-src');
          iframe.style = 'width: 100%; height: ' + elem.getAttribute('height') + 'px;';
          elem.parentNode.replaceChild(iframe, elem);
        }
        if (mobile) {
          if (article_main) {
            let div_next = document.querySelector('div[id="__next"]');
            if (div_next)
              article.style.width = div_next.offsetWidth + 'px';
          }
          let lazy_images = article.querySelectorAll('figure img[loading="lazy"][style]');
          for (let elem of lazy_images)
            elem.style = 'width: 95%;';
          let figures = article.querySelectorAll('figure div');
          for (let elem of figures) {
            elem.removeAttribute('style');
            let svg = elem.querySelector('svg');
            removeDOMElement(svg);
          }
        }
        let pars = article.querySelectorAll('div[style*="font-size"]');
        if (pars.length < 5)
          article.before(googleSearchToolLink(url));
      }
    }
    let url = window.location.href;
    let paywall_sel = 'head > meta[name$="article_ispaidcontent"][content="true"], div[data-testid="paywall-position-inline-paywall"]:not(:empty)';
    let article_sel = 'main > article';
    let article_main = document.querySelector(article_sel);
    if (!article_main)
      article_sel = 'article[role="article"] div[id]';
    getArchive(url, paywall_sel, '', article_sel);
    let popup = document.querySelector('div[data-testid="close-popup-button"]');
    if (popup)
      popup.click();
  }, 1500);
  let ads = 'div[id^="ad_inline-"]';
  hideDOMStyle(ads);
}

else if (matchDomain('businessam.be')) {
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div.text-gradient');
    if (article) {
      let scripts = document.querySelectorAll('script:not([src]):not([type])');
      let content_script;
      for (let script of scripts) {
        if (script.text.match(/window\.fullcontent64\s?=\s?"/)) {
          content_script = script;
          break;
        }
      }
      if (content_script) {
        try {
          let content = decode_utf8(atob(content_script.text.split(/window\.fullcontent64\s?=\s?"/)[1].split('";')[0]));
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

else if (matchDomain('businessinsider.nl')) {
  getJsonUrl('div.piano-article__paywall', '', 'div.piano-article__content');
}

else if (matchDomain('doorbraak.be')) {
  window.setTimeout(function () {
    let plus = document.querySelector('h1 > svg');
    let article = document.querySelector('div > div.prose');
    if (plus && article) {
      let paywall_sel = 'div.paywall';
      let paywall = document.querySelector(paywall_sel);
      let pars = article.querySelectorAll('p');
      if (paywall || pars.length < 2) {
        removeDOMElement(paywall);
        waitDOMElement(paywall_sel, 'DIV', removeDOMElement, false);
        let json_script = document.querySelector('script#__NUXT_DATA__');
        if (json_script) {
          try {
            if (!json_script.text.substr(0, 500).includes(window.location.pathname))
              refreshCurrentTab();
            let json = JSON.parse(json_script.text);
            json = json.filter(x => typeof x === 'string' && x.startsWith('<p>'));
            let json_text = json[0];
            if (json_text) {
              let parser = new DOMParser();
              let doc = parser.parseFromString('<div>' + json_text + '</div>', 'text/html');
              let content_new = doc.querySelector('div');
              article.appendChild(content_new);
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  }, 1000);
}

else if (matchDomain(be_roularta_domains)) {
  if (matchDomain('beleggersbelangen.nl')) {
    let paywall = document.querySelector('div.unlimited-access');
    if (paywall) {
      removeDOMElement(paywall);
      let no_account = document.querySelector('div.no-account');
      if (no_account)
        no_account.classList.remove('no-account');
      let content_inner = document.querySelector('div.content-inner[style]');
      if (content_inner)
        content_inner.removeAttribute('style');
    }
  } else {
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
    if (!window.navigator.userAgent.toLowerCase().includes('chrome') && !matchDomain(['kw.be']) && window.location.href.match(/\/(\w+-){2,}/)) {
      let lazy_images = document.querySelectorAll('img[src^="data:image/"][data-lazy-src]');
      for (let elem of lazy_images) {
        elem.src = elem.getAttribute('data-lazy-src');
      }
    }
  }
  let ads = 'div.rmgAd, div.c-header__ad';
  hideDOMStyle(ads);
}

else if (matchDomain('ftm.nl')) {
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

else if (matchDomain('groene.nl')) {
  let url = window.location.href;
  getArchive(url, 'div#closed-block', '', 'article');
  let more = pageContains('div.wrapper > h2', 'Verder lezen?');
  if (more.length) {
    let link_text = 'https://www.groene.nl/populair';
    let a_link = document.createElement('a');
    a_link.href = link_text;
    a_link.innerText = 'BPC > ' + link_text.split('www.')[1];
    more[0].parentNode.append(document.createElement('br'), a_link);
  }
}

else if (matchDomain(['lc.nl', 'dvhn.nl']) || document.querySelector('head > link[href*=".ndcmediagroep.nl/"]')) {
  let paywall = document.querySelector('div.signupPlus, div.pw-wrapper:not(.pw-none)');
  if (paywall && !window.location.pathname.includes('/live-')) {
    let intro = document.querySelector('div.startPayWall');
    let html = document.documentElement.outerHTML;
    if (html.includes('window.__NUXT__=')) {
      removeDOMElement(paywall, intro);
      try {
        let json = html.split('window.__NUXT__=')[1].split('</script>')[0].trim();
        let json_match = json.includes('type:"article",');
        if (json_match) {
          let path_match = window.location.pathname.match(/-(\d+)\./);
          if (path_match) {
            let article_id = path_match[1];
            json_match = json.includes(',id:"' + article_id + '",');
            if (!json_match) {
              let path_regex_str = '-' + article_id + '\\.';
              if (json.match(/[(,]null,/)) {
                let art_match = json.split(/[(,]null,/)[1].match(new RegExp(path_regex_str, 'g'));
                json_match = art_match && art_match.length > 1;
              }
              if (!json_match) {
                if (json.includes(',routePath:"')) {
                  json_match = json.split(',routePath:"')[1].split('"')[0].match(new RegExp(path_regex_str));
                } else if (json.includes(',relativeUrl:"')) {
                  let json_split = json.split(',relativeUrl:"');
                  json_match = json_split.some(e => e.split(/[",]/)[0].match(new RegExp(path_regex_str)));
                }
              }
            }
          }
        }
        if (!json_match)
          refreshCurrentTab();
        else if (json.includes(',body:')) {
          let nuxt_vars = json.split(/^\(function\(/)[1].split('){')[0].split(',');
          let nuxt_values = json.split('}}(')[1].split('));')[0].replace(/(^|,)(true|false|\.?\d+|{}),/g, ',"$1$2",').replace(/,(null),/g, ',"$1",').replace(/,(void\s\d),/g, ',"$1",').split(/\\?",\\?"/);
          function findNuxtText(str, attributes = false) {
            if (nuxt_vars.length && nuxt_values.length && !(attributes && str.length === 1 && str === str.toUpperCase())) {
              let index = nuxt_vars.indexOf(str);
              if (nuxt_values[index])
                str = nuxt_values[index].replace(/\\u002F/g, '/');
            }
            return str;
          }
          let intro;
          let intro_match = json.match(/,leadtext_raw:"([^"]+)",/);
          let intro_meta_dom = document.querySelector('head > meta[data-hid="description"][content]');
          if (intro_match || intro_meta_dom) {
            intro = document.createElement('p');
            intro.innerText = intro_match ? intro_match[1].replace(/\\u002F/g, '/') : intro_meta_dom.content;
            intro.style = 'font-weight: bold;';
          }
          let json_text = json.split(',body:')[1].split(/,(leadText|brand_key|tts|pianoKeywords):/)[0].replace(/([{,])(\w+)(?=:(["\{\[]|[\w$]{1,2}[,\}]))/g, "$1\"$2\"").replace(/(Image\\":)(\d)([,}])/g, '$1\\"$2\\"$3').replace(/\":(\[)?([\w\$\.]+)([\]},])/g, "\":$1\"$2\"$3");
          let article = document.querySelector('div.content');
          if (article) {
            article.innerHTML = '';
            if (intro)
              article.appendChild(intro);
            let pars = JSON.parse(json_text);
            function addParText(elem, par_text, add_br = false, attributes = false) {
              if (par_text) {
                if (par_text.length <= 2)
                  par_text = findNuxtText(par_text, attributes);
                let span = document.createElement('span');
                span.innerText = par_text;
                elem.appendChild(span);
                if (add_br)
                  elem.appendChild(document.createElement('br'));
              }
            }
            function addLink(elem, link_text, href, add_br = false) {
              let par_link = document.createElement('a');
              par_link.href = href;
              par_link.innerText = link_text.replace(/\\n$/, '');
              elem.appendChild(par_link);
              if (add_br)
                elem.appendChild(document.createElement('br'));
            }
            function addImage(elem, child) {
              let figure = document.createElement('figure');
              let img = document.createElement('img');
              if (child.relation.href.length <= 2)
                child.relation.href = findNuxtText(child.relation.href);
              img.src = child.relation.href;
              figure.appendChild(img);
              if (child.relation.caption) {
                if (child.relation.caption.length <= 2)
                  child.relation.caption = findNuxtText(child.relation.caption).replace(/\\"/g, '"').replace(/\\n/g, ' - ').replace(/\\u002F/g, '/');
                if (child.relation.photographer) {
                  if (child.relation.photographer.length <= 2)
                    child.relation.photographer = findNuxtText(child.relation.photographer).replace(/\\u002F/g, '/');
                  child.relation.caption += ' - ' + child.relation.photographer;
                }
                let caption = document.createElement('figcaption');
                caption.innerText = child.relation.caption;
                figure.appendChild(caption);
              }
              elem.appendChild(figure);
            }
            function addChildren(elem, children, add_br = false, attributes = false) {
              for (let child of children) {
                if (child.text) {
                  addParText(elem, child.text, add_br, attributes);
                } else if (child.relation && (child.type === 'img' || child.relation.caption) && child.relation.href) {
                  let img_par = document.createElement('p');
                  addImage(img_par, child);
                  elem.appendChild(img_par);
                } else if (child.relation && child.relation.link) {
                  if (child.relation.link.length <= 2)
                    child.relation.link = findNuxtText(child.relation.link).replace(/\\u002F/g, '/');
                  if (child.relation.title.length <= 2)
                    child.relation.title = findNuxtText(child.relation.title);
                  if (matchDomain('frieschdagblad.nl'))
                    child.relation.title = child.relation.link;
                  addLink(elem, child.relation.title, child.relation.link);
                } else if (child.children) {
                  if (child.children.length) {
                    for (let item of child.children) {
                      if (item.text) {
                        if ((child.href && child.href.length > 2) || (child.relation && child.relation.follow && child.relation.follow.url)) {
                          if (item.text.length > 2)
                            addLink(elem, item.text, child.href || child.relation.follow.url, add_br);
                        } else
                          addParText(elem, item.text, add_br, child.attributes && child.attributes.length);
                      } else if (findNuxtText(item.type) === 'br') {
                        elem.appendChild(document.createElement('br'));
                      } else
                        addChildren(elem, item.children, false, item.attributes && item.attributes.length);
                    }
                  } else
                    elem.appendChild(document.createElement('br'));
                }
              }
            }
            for (let par of pars) {
              let elem = document.createElement('p');
              if (par.code) {
                if (par.code.includes('flourish-embed') && par.code.includes(' data-src=\"')) {
                  elem = document.createElement('div');
                  let sub_elem = document.createElement('iframe');
                  sub_elem.src = 'https://public.flourish.studio/' + par.code.split(' data-src=\"')[1].split('"')[0];
                  sub_elem.style = 'width: 100%; height: 600px;';
                  elem.appendChild(sub_elem);
                } else {
                  let parser = new DOMParser();
                  let doc = parser.parseFromString('<div>' + par.code + '</div>', 'text/html');
                  elem = doc.querySelector('div');
                }
              } else if (par.insertbox_head || par.insertbox_text) {
                if (par.insertbox_head && par.insertbox_head.length > 2)
                  addParText(elem, par.insertbox_head, true);
                if (par.insertbox_text) {
                  for (let item of par.insertbox_text) {
                    if (item.children)
                      addChildren(elem, item.children, true);
                  }
                }
              } else if (par.text) {
                if (findNuxtText(par.type) !== 'streamer')
                  addParText(elem, par.text);
              } else if (par.children) {
                addChildren(elem, par.children);
              } else if (par.typename.length > 2)
                console.log(par);
              if (elem.hasChildNodes()) {
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
  let ads = 'div.top__ad, div.marketingblock-article';
  hideDOMStyle(ads);
}

else if (matchDomain('linda.nl')) {
  window.setTimeout(function () {
    let paywall = document.querySelector('div.premium-login-box_loginBox');
    if (paywall) {
      removeDOMElement(paywall);
      let article = document.querySelector('div[class*="_loginRequired"]');
      if (article) {
        let filter = /^window\.__INITIAL_PROPS__\s?=\s?/;
        let json_script = getSourceJsonScript(filter);
        if (json_script) {
          try {
            let json = JSON.parse(json_script.text.split(filter)[1]);
            if (json) {
              let slug = json.slug;
              if ((slug && !window.location.pathname.includes(slug)) || !json.viewData)
                refreshCurrentTab();
              if (json && json.viewData.article) {
                function replace_also_read(str) {
                  return str.replace(/{also-read title="([^}]+)" url="([^}]+)" [^}]+"}/g, "<div style='margin: 15px 0px'><a href=\"$2\">Lees ook: $1</a></div>");
                }
                article.className = article.className.replace(/[-\w]+_loginRequired/, '');
                if (json.viewData.article.modules) {
                  let modules = json.viewData.article.modules;
                  article.innerHTML = '';
                  for (let elem of modules) {
                    let type = elem.acf_fc_layout;
                    if (type) {
                      let item = document.createElement('div');
                      if (['body_text', 'intro', 'quote'].includes(type)) {
                        if (elem.text) {
                          let parser = new DOMParser();
                          let doc = parser.parseFromString('<div style="margin: 20px;">' + replace_also_read((elem.title ? elem.title : '') + elem.text.replace(/\r\n/g, '<br>')) + '</div>', 'text/html');
                          item = doc.querySelector('div');
                          if (type === 'intro') {
                            let intro = item.querySelector('p');
                            if (intro)
                              intro.style = 'font-weight: bold; ';
                          } else if (type === 'quote')
                            item.style['text-align'] = 'center';
                          article.append(item);
                        }
                      } else if (type === 'image') {
                        let elem_images = elem.images_portrait || elem.images_landscape;
                        if (elem_images && elem_images.length) {
                          for (let img of elem_images) {
                            let url = img.image.sizes.large;
                            let caption_text = img.credits ? img.credits.replace(/(\n|<[^<]*>)/g, '') : '';
                            item = makeFigure(url, caption_text, {style: 'width: 100%;'});
                            article.append(item);
                          }
                        }
                      } else
                        console.log(elem);
                    }
                  }
                } else if (json.viewData.article.body) {
                  let parser = new DOMParser();
                  let doc = parser.parseFromString('<div>' + replace_also_read(json.viewData.article.body) + '</div>', 'text/html');
                  let article_new = doc.querySelector('div');
                  if (article_new) {
                    article.innerHTML = '';
                    article.appendChild(article_new);
                  }
                } else
                  header_nofix('div.article-content_base');
              }
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  }, 1000);
}

else if (matchDomain(nl_dpg_adr_domains.concat(['hln.be']))) {
  func_post = function () {
    let article = document.querySelector(article_sel);
    if (article) {
      let shades = article.querySelectorAll('div[style*="background-color"][style*=";width"]');
      for (let elem of shades)
        elem.style.width = '85%';
      let lazy_images = article.querySelectorAll('img[loading="lazy"][style]');
      for (let elem of lazy_images) {
        elem.style = 'width: 95%;';
        if ((!elem.src || elem.src.startsWith('data:image/')) && elem.getAttribute('currentsourceurl'))
          elem.src = elem.getAttribute('currentsourceurl');
      }
      let widgets = article.querySelectorAll('div > div > div[old-src]:not([src])');
      for (let elem of widgets) {
        let iframe = document.createElement('iframe');
        iframe.src = elem.getAttribute('old-src');
        iframe.style = 'width: 100%; border: none;';
        if (iframe.src.includes('/widgets/') || iframe.src.includes('/playlists/'))
          iframe.style.height = '400px';
        elem.parentNode.replaceChild(iframe, elem);
      }
      let errors = article.querySelectorAll('div > div[old-src]:not([src]):has(div#main-frame-error)');
      for (let elem of errors) {
        let elem_new = document.createElement('iframe');
        elem_new.src = elem.getAttribute('old-src');
        elem_new.style = 'width: 100%; height: 400px; border: none;';
        elem.parentNode.removeAttribute('style');
        elem.parentNode.replaceChild(elem_new, elem);
      }
      let picture_divs = article.querySelectorAll('picture > div[style*="min-height:"]:has(svg)');
      for (let elem of picture_divs) {
        elem.parentNode.removeAttribute('style');
        removeDOMElement(elem);
      }
      let video_buttons = article.querySelectorAll('button[type="button"]');
      removeDOMElement(...video_buttons);
      if (comments)
        article.appendChild(comments);
      if (readmore)
        article.appendChild(readmore);
    }
    let article_divs = document.querySelectorAll(article_sel + ' > div:not(:empty)');
    if (article_divs.length < 3)
      article.before(googleSearchToolLink(url));
    let ads = 'span[style*="background-color:"]:has(> span[style*="min-height:"]), span > br';
    hideDOMStyle(ads, 2);
  }
  let comments = document.querySelector('div[data-content-type="SHARE"]');
  let readmore = document.querySelector('div[data-content-type="CROSS_PROMOTION"]');
  let url = window.location.href;
  let article_sel = 'article';
  let paywall_sel = article_sel + ' svg.media-top__premium-indicator';
  let paywall_action = {rm_class: 'media-top__premium-indicator'};
  if (!document.querySelector(paywall_sel)) { // regwall
    let pars = document.querySelectorAll(article_sel + ' div[data-content-type="PARAGRAPH"]');
    if (pars.length < 3) {
      header_nofix('section.grid', '', 'BPC > regwall (use free account)');
      paywall_sel = article_sel + '.article';
      paywall_action = {rm_class: 'article'};
      getArchive(url, paywall_sel, paywall_action, article_sel);
    }
  } else
    getArchive(url, paywall_sel, paywall_action, article_sel);
  let ads = 'div.dfp-space';
  hideDOMStyle(ads);
}

else if (matchDomain(nl_dpg_media_domains)) {
  setCookie('TID_ID', '', '', '/', 0);
  let banners = 'aside[data-temptation-position^="ARTICLE_"], div[data-temptation-position^="PAGE_"], div[class^="ad--"], div[id^="article_paragraph_"]';
  hideDOMStyle(banners);
  window.setTimeout(function () {
    document.querySelectorAll('[class^="artstyle__"][style="display: none;"]').forEach(e => e.removeAttribute('style'));
  }, 500);
}

else if (matchDomain(nl_mediahuis_region_domains)) {
  let video = document.querySelector('div.video, div[data-testid="article-video"]');
  func_post = function () {
    let article = document.querySelector(article_sel);
    if (article) {
      if (video) {
        let video_new = article.querySelector('div[id$="-streamone"], div[id^="video-player-"], div[id^="player_"]');
        if (video_new && video_new.parentNode)
          video_new.parentNode.replaceChild(video, video_new);
        else {
          let header = article.querySelector('h1');
          let br = document.createElement('br');
          if (header)
            header.after(br, video, br);
        }
      }
      if (mobile) {
        let div_next = document.querySelector('div[id="__next"]');
        if (div_next)
          article.style.width = div_next.offsetWidth - 20 + 'px';
        let lazy_images = article.querySelectorAll('figure img[loading="lazy"][style]');
        for (let elem of lazy_images)
          elem.style = 'width: 95%;';
        let figures = article.querySelectorAll('figure div');
        for (let elem of figures) {
          elem.removeAttribute('style');
          let svg = elem.querySelector('svg');
          removeDOMElement(svg);
        }
      }
      if (article.innerText.length < 1000) {
        let header = article.querySelector('hgroup');
        if (header)
          header.before(googleSearchToolLink(url));
      }
    }
  }
  let paywall_sel = 'head > meta[name$="article_ispaidcontent"][content="true"]';
  let article_sel = 'main > article';
  let url = window.location.href;
  getArchive(url, paywall_sel, '', article_sel);
  window.setTimeout(function () {
    let noscroll = document.querySelector('body[class*="style_disable-scroll-popup"]');
    if (noscroll)
      noscroll.style = 'position: static !important; overflow: visible !important';
  }, 500);
  let banners = 'div[class*="style_popover"]';;
  hideDOMStyle(banners);
}

else if (matchDomain('nrc.nl')) {
  setCookie('counter', '', '', '/', 0, true);
  let banners = 'div[id$="modal__overlay"], div.header__subscribe-bar, div.banner, dialog.dmt-login-modal';
  hideDOMStyle(banners);
}

else if (matchDomain('telegraaf.nl')) {
  let url = window.location.href.split(/[#\?]/)[0];
  window.setTimeout(function () {
    let paywall_sel = 'div[data-testid="paywall-position-popover"]:not(:empty)';
    let paywall = document.querySelector(paywall_sel);
    if (paywall) {
      removeDOMElement(paywall);
      let article = document.querySelector('article');
      if (article) {
        let url_postfix = '-30-web';
        if (window.location.pathname.startsWith('/video/') && document.querySelector('div[data-testid="article-video"]')) {
          window.location.href = url + url_postfix;
        } else {
          let url_src = url + url_postfix;
          fetch(url_src)
          .then(response => {
            if (response.ok) {
              response.text().then(html => {
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, 'text/html');
                let article_new = doc.querySelector('article');
                if (article_new.querySelector('div[class^="gallery_wrapper"], div[id^="player_"], div[data-testid="social-embed-fallbackmessage"], div[class^="map_"]'))
                  window.location.href = url + url_postfix;
                else
                  article.parentNode.replaceChild(article_new, article);
              })
            }
          })
        }
      }
      let noscroll = document.querySelector('body[class]');
      if (noscroll)
        noscroll.removeAttribute('class');
    }
  }, 1000);
  let ads = 'div[id^="ad_"], div[class^="scrollable-ads"], iframe#ecommerce-ad-iframe, div[data-pym-src], div.mh-ad-label';
  hideDOMStyle(ads);
}

else if (matchDomain('tijd.be')) {
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
  if (matchDomain('belegger.tijd.be')) {
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

else if (matchDomain('vn.nl')) {
  let paywall = document.querySelectorAll('section[class^="c-paywall"]');
  if (paywall.length) {
    removeDOMElement(...paywall);
    let article = document.querySelector('div.c-article-content__container');
    if (article) {
      let json_script = document.querySelector('script#__NEXT_DATA__');
      if (json_script) {
        try {
          let json = JSON.parse(json_script.text);
          if (json && json.props.pageProps.article && json.props.pageProps.article.content) {
            let parser = new DOMParser();
            let doc = parser.parseFromString('<div>' + json.props.pageProps.article.content + '</div>', 'text/html');
            let content_new = doc.querySelector('div');
            article.innerHTML = '';
            article.appendChild(content_new);
            let audio = document.querySelector('div.c-author-info__audio-player');
            if (audio) {
              if (json.props.pageProps.article.audioplayer.audioFile.node.mediaItemUrl) {
                let audio_new = document.createElement('audio');
                audio_new.src = json.props.pageProps.article.audioplayer.audioFile.node.mediaItemUrl;
                audio_new.style = 'height: 50px; width: 60%;';
                audio_new.setAttribute('controls', '');
                audio.parentNode.replaceChild(audio_new, audio);
              }
            }
          } else
            refreshCurrentTab();
        } catch (err) {
          console.log(err);
        }
      }
    }
    let noscroll = document.querySelector('html[class]');
    if (noscroll)
      noscroll.removeAttribute('class');
  }
}

ads_hide();
leaky_paywall_unhide();

}, 1000);

// General Functions

// import (see @require)

})();
