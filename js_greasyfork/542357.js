// ==UserScript==
// @name            Bypass Paywalls Clean - pl
// @version         4.2.4.0
// @description     Bypass Paywalls of news sites
// @author          magnolia1234
// @homepageURL     https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters
// @supportURL      https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters
// @license         MIT; https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=LICENSE
// @noframes
// @match           *://*.auto-swiat.pl/*
// @match           *://*.businessinsider.com.pl/*
// @match           *://*.forbes.pl/*
// @match           *://*.komputerswiat.pl/*
// @match           *://*.magazyn-kuchnia.pl/*
// @match           *://*.newsweek.pl/*
// @match           *://*.onet.pl/*
// @match           *://*.parkiet.com/*
// @match           *://*.pb.pl/*
// @match           *://*.rp.pl/*
// @match           *://*.wyborcza.biz/*
// @match           *://*.wyborcza.pl/*
// @match           *://*.wysokieobcasy.pl/*
// @connect         archive.fo
// @connect         archive.is
// @connect         archive.li
// @connect         archive.md
// @connect         archive.ph
// @connect         archive.vn
// @grant           GM.xmlHttpRequest
// @namespace https://greasyfork.org/users/1493917
// @downloadURL https://update.greasyfork.org/scripts/542357/Bypass%20Paywalls%20Clean%20-%20pl.user.js
// @updateURL https://update.greasyfork.org/scripts/542357/Bypass%20Paywalls%20Clean%20-%20pl.meta.js
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

var pl_ringier_domains = ['auto-swiat.pl', 'businessinsider.com.pl', 'forbes.pl', 'komputerswiat.pl', 'newsweek.pl', 'onet.pl'];

if (matchDomain('pb.pl')) {
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    paywall.classList.remove('paywall');
    let article_hidden = paywall.querySelector('section.o-article-content');
    if (article_hidden)
      article_hidden.removeAttribute('class');
    let loader = document.querySelector('div.o-piano-template-loader-box');
    removeDOMElement(loader);
  }
}

else if (matchDomain(pl_ringier_domains)) {
  if (matchDomain('businessinsider.com.pl')) {
    let paywall = document.querySelector('div#content-premium-offer');
    removeDOMElement(paywall);
  }
  let premium = document.querySelector('div.contentPremium[style]');
  if (premium) {
    premium.removeAttribute('class');
    premium.removeAttribute('style');
  }
  let ads = 'div.adPlaceholder , div[class^="Ad"][class*="Placeholder_"], div[data-placeholder-caption], div[data-run-module$=".floatingAd"], aside[data-ad-container], aside.adsContainer, [class^="pwAds"], .hide-for-paying, div.onet-ad, div.bottomBar, ad-default';
  hideDOMStyle(ads);
}

else if (matchDomain(['rp.pl', 'parkiet.com'])) {
  let paywall = document.querySelector('div.paywallComp');
  if (paywall) {
    removeDOMElement(paywall);
    let article = document.querySelector('div.article--content');
    if (article) {
      let url = window.location.href;
      article.firstChild.before(googleSearchToolLink(url));
    }
  }
}

else if (matchDomain(['wyborcza.biz', 'wyborcza.pl', 'wysokieobcasy.pl', 'magazyn-kuchnia.pl'])) {
  func_post = function () {
    let block_quotes = document.querySelectorAll('blockquote > a[href]');
    for (let elem of block_quotes) {
      if (!elem.innerText.trim())
        elem.innerText = elem.href;
    }
    let empty_spans = document.querySelectorAll('figure > a > span:empty');
    removeDOMElement(...empty_spans);
    header_nofix('div.mrf-article-body', 'span[style*="linear-gradient"]', 'BPC > no archive-fix');
  }
  let url = window.location.href;
  getArchive(url, 'div.article--content-fadeout', {rm_attrib: 'class'}, 'div.container[class*="pt"]', '', 'div.body > div:not([style*="background-color:"]):not([old-position]):not([name]):not([id])');
  let ads = 'div[id^="adUnit"], div[id^="ads-"]';
  hideDOMStyle(ads);
}

ads_hide();
leaky_paywall_unhide();

}, 1000);

// General Functions

// import (see @require)

})();
