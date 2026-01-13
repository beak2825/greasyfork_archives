// ==UserScript==
// @name            Bypass Paywalls Clean - es/pt/south america
// @version         4.2.8.0
// @description     Bypass Paywalls of news sites
// @author          magnolia1234
// @homepageURL     https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters
// @supportURL      https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters
// @license         MIT; https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=LICENSE
// @noframes
// @match           *://*.es/*
// @match           *://*.abcmais.com/*
// @match           *://*.abril.com.br/*
// @match           *://*.ara.cat/*
// @match           *://*.arabalears.cat/*
// @match           *://*.cartacapital.com.br/*
// @match           *://*.clarin.com/*
// @match           *://*.correiodopovo.com.br/*
// @match           *://*.cronista.com/*
// @match           *://*.crusoe.com.br/*
// @match           *://*.diaridegirona.cat/*
// @match           *://*.diariocordoba.com/*
// @match           *://*.diariocorreo.pe/*
// @match           *://*.diariovasco.com/*
// @match           *://*.diplomatique.org.br/*
// @match           *://*.dn.pt/*
// @match           *://*.elcomercio.pe/*
// @match           *://*.elconfidencial.com/*
// @match           *://*.elcorreo.com/*
// @match           *://*.elespanol.com/*
// @match           *://*.elespectador.com/*
// @match           *://*.elmercurio.com/*
// @match           *://*.elobservador.com.uy/*
// @match           *://*.elpais.com/*
// @match           *://*.elperiodico.com/*
// @match           *://*.elperiodicodearagon.com/*
// @match           *://*.elperiodicoextremadura.com/*
// @match           *://*.elperiodicomediterraneo.com/*
// @match           *://*.eltiempo.com/*
// @match           *://*.eltribuno.com/*
// @match           *://*.eluniverso.com/*
// @match           *://*.em.com.br/*
// @match           *://*.emporda.info/*
// @match           *://*.estadao.com.br/*
// @match           *://*.exame.com/*
// @match           *://*.expansion.com/*
// @match           *://*.expresso.pt/*
// @match           *://*.gauchazh.clicrbs.com.br/*
// @match           *://*.gazetadopovo.com.br/*
// @match           *://*.gestion.pe/*
// @match           *://*.globo.com/*
// @match           *://*.lanacion.com.ar/*
// @match           *://*.larioja.com/*
// @match           *://*.lasegunda.com/*
// @match           *://*.latercera.com/*
// @match           *://*.lavoz.com.ar/*
// @match           *://*.levante-emv.com/*
// @match           *://*.losandes.com.ar/*
// @match           *://*.marca.com/*
// @match           *://*.nsctotal.com.br/*
// @match           *://*.observador.pt/*
// @match           *://*.ole.com.ar/*
// @match           *://*.politicaexterior.com/*
// @match           *://*.regio7.cat/*
// @match           *://*.revistaoeste.com/*
// @match           *://*.sabado.pt/*
// @match           *://*.semana.com/*
// @match           *://*.uol.com.br/*
// @connect         archive.fo
// @connect         archive.is
// @connect         archive.li
// @connect         archive.md
// @connect         archive.ph
// @connect         archive.vn
// @grant           GM.xmlHttpRequest
// @namespace https://greasyfork.org/users/1493917
// @downloadURL https://update.greasyfork.org/scripts/542352/Bypass%20Paywalls%20Clean%20-%20esptsouth%20america.user.js
// @updateURL https://update.greasyfork.org/scripts/542352/Bypass%20Paywalls%20Clean%20-%20esptsouth%20america.meta.js
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

var ar_grupo_clarin_domains =['clarin.com', 'lavoz.com.ar', 'losandes.com.ar', 'ole.com.ar'];
var es_epiberica_domains = ['diariodemallorca.es', 'eldia.es', 'elperiodico.com', 'epe.es', 'farodevigo.es', 'informacion.es', 'laprovincia.es', 'levante-emv.com', 'lne.es', 'mallorcazeitung.es', 'superdeporte.es'];
var es_epiberica_custom_domains = ['diaridegirona.cat', 'diariocordoba.com', 'diariodeibiza.es', 'elcorreogallego.es', 'elcorreoweb.es', 'elperiodicodearagon.com', 'elperiodicoextremadura.com', 'elperiodicomediterraneo.com', 'emporda.info', 'laopinioncoruna.es', 'laopiniondemalaga.es', 'laopiniondemurcia.es', 'laopiniondezamora.es', 'regio7.cat'];
var es_grupo_vocento_domains = ['abc.es', 'canarias7.es', 'diariosur.es', 'diariovasco.com', 'elcomercio.es', 'elcorreo.com', 'eldiariomontanes.es', 'elnortedecastilla.es', 'hoy.es', 'ideal.es', 'larioja.com', 'lasprovincias.es', 'laverdad.es', 'lavozdigital.es'];
var es_unidad_domains = ['elmundo.es', 'expansion.com', 'marca.com'];
var pe_grupo_elcomercio_domains = ['diariocorreo.pe', 'elcomercio.pe', 'gestion.pe'];

if (window.location.hostname.match(/\.(es|pt|cat)$/) || matchDomain(['diariocordoba.com', 'diariovasco.com', 'elconfidencial.com', 'elcorreo.com', 'elespanol.com', 'elpais.com', 'elperiodico.com', 'elperiodicodearagon.com', 'elperiodicoextremadura.com', 'elperiodicomediterraneo.com', 'emporda.info', 'expansion.com', 'larioja.com', 'levante-emv.com', 'marca.com', 'politicaexterior.com'])) {//spain/portugal

if (matchDomain(['ara.cat', 'arabalears.cat'])) {
  if (!window.location.pathname.endsWith('.amp.html')) {
    amp_redirect('div.paywall');
    let ads = 'div.advertising';
    hideDOMStyle(ads);
  }
}

else if (matchDomain('diariodenavarra.es')) {
  let paywall = document.querySelector('div#paywall_message');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text);
      if (json) {
        let json_text = json.articleBody;
        let article = document.querySelector('div.free-html');
        if (json_text && article)
          article.innerText = parseHtmlEntities(json_text);
      }
    }
  }
}

else if (matchDomain('dn.pt')) {
  let paywall = document.querySelector('div#metered-paywall-banner');
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

else if (matchDomain('elconfidencial.com')) {
  let premium = document.querySelector('div.newsType__content--closed');
  if (premium)
    premium.classList.remove('newsType__content--closed');
  let ads = 'div[id^="mega_"], div[id^="roba_"]';
  hideDOMStyle(ads);
}

else if (matchDomain('eldiario.es')) {
  if (window.location.pathname.endsWith('.amp.html')) {
    amp_unhide_access_hide('^="access"', '="NOT access"');
  } else {
    amp_redirect('aside.paywall');
    let ads = 'div.edi-advertising, div.header-ad, aside.news-sponsored-content, div.report__wrapper';
    hideDOMStyle(ads);
  }
}

else if (matchDomain('elespanol.com')) {
  if (window.location.pathname.endsWith('.amp.html')) {
    amp_unhide_subscr_section();
  } else {
    let paywall = document.querySelector('div.full-suscriptor-container');
    if (paywall) {
      removeDOMElement(paywall);
      let content_hidden = document.querySelector('div.content-not-granted-paywall');
      if (content_hidden)
        content_hidden.classList.remove('content-not-granted-paywall');
    }
    let ads = '[id*="superior"], [class*="adv"]';
    hideDOMStyle(ads);
  }
}

else if (matchDomain(es_unidad_domains)) {
  if (!window.location.hostname.startsWith('amp.')) {
    let url = window.location.href;
    if (!window.location.pathname.startsWith('/mejores-colegios')) {
      amp_redirect('div[class^="ue-c-article__premium"]', '', url.replace('/www.', '/amp.'));
    } else if (matchDomain('elmundo.es')) {
      header_nofix('main p', 'div.ue-c-article__premium');
      header_nofix('table', 'div.ue-c-paywall');
    }
  } else {
    amp_unhide_access_hide('="authorized=true"', '="authorized!=true"');
    amp_unhide_subscr_section('.advertising, .ue-c-ad');
  }
}

else if (matchDomain('elpais.com')) {
  if (window.location.pathname.endsWith('.amp.html') || window.location.search.match(/(\?|&)outputType=amp/)) {
    amp_unhide_access_hide('="vip"], [amp-access="success"', '="NOT vip"], [amp-access="NOT success"', 'div._cf');
  }
  let ads = 'div.ad-giga, aside.outbrain';
  hideDOMStyle(ads);
}

else if (matchDomain(es_grupo_vocento_domains)) {
  let paywall_sel = 'div.voc-paywall, div.container-wall-exclusive__content-login';
  let paywall = document.querySelector(paywall_sel);
  if (!window.location.pathname.endsWith('_amp.html')) {
    if (paywall) {
      let span_break = document.querySelector('span.c-text');
      removeDOMElement(paywall, span_break);
      let art_hidden = document.querySelectorAll('.paywall, div.wpb_column > span');
      for (let elem of art_hidden) {
        let attributes = [...elem.attributes];
        for (let attrib of attributes)
          elem.removeAttribute(attrib.name);
        if (elem.tagName === 'DIV')
          elem.className = 'paywall';
      }
    }
    let ads = '.voc-advertising, div.voc-ob-wrapper, div.voc-discounts, div.ev-em-modal, span.mega-superior, div.v-adv';
    hideDOMStyle(ads, 2);
  } else {
    amp_unhide_access_hide('="result=\'ALLOW_ACCESS\'"', '="result!=\'ALLOW_ACCESS\'"', 'div.v-adv');
    let body_top = document.querySelector('body#top');
    if (body_top)
      body_top.removeAttribute('id');
  }
  let banner = 'div.container-wall-exclusive';
  hideDOMStyle(banner);
}

else if (matchDomain(es_epiberica_domains) || matchDomain(es_epiberica_custom_domains)) {
  let paywall = document.querySelector('p.ft-helper-closenews');
  if (paywall) {
    paywall.classList.remove('ft-helper-closenews');
  }
  if (window.location.pathname.endsWith('.amp.html') || ['amp.elperiodico.com', 'amp.epe.es'].includes(window.location.hostname)) {
    let amp_images = document.querySelectorAll('figure > amp-img[src]');
    for (let amp_image of amp_images) {
      let elem = document.createElement('img');
      elem.src = amp_image.getAttribute('src');
      elem.style = 'width: 75%; margin: 0px 50px;';
      amp_image.parentNode.replaceChild(elem, amp_image);
    }
    document.querySelectorAll('div#the-most').forEach(e => e.removeAttribute('style'));
    let ads = 'amp-next-page, span.ad-signature, div.wrap, .ft-ad';
    hideDOMStyle(ads);
  } else {
    let ads = 'div.commercial-up-full__wrapper, .ft-ad, div[class^="_mo_recs"]';
    hideDOMStyle(ads);
  }
}

else if (matchDomain('expresso.pt')) {
  if (!window.location.hostname.startsWith('amp.')) {
    let article_sel = 'div.article-content';
    let paywall = document.querySelector(article_sel + ' > div.g-premium-blocker');
    if (paywall) {
      removeDOMElement(paywall);
      let article = document.querySelector(article_sel);
      if (article) {
        let url = window.location.href.split(/[#\?]/)[0];
        fetch(url)
        .then(response => {
          if (response.ok) {
            response.text().then(html => {
              if (html.match(/window\.__INITIAL_DATA__\s?=\s?/)) {
                try {
                  article.innerHTML = '';
                  let json = JSON.parse(html.split(/window\.__INITIAL_DATA__\s?=\s?/)[1].split(';window.')[0].replace(/":undefined([,}])/g, "\":\"undefined\"$1")).nodes;
                  let pars = [];
                  for (let elem in json) {
                    let item = json[elem];
                    if (item.type === 'Layout') {
                      for (let elem of item.nodes) {
                        if (elem.type === 'MainBody')
                          pars = elem.nodes[0].data.content.contents;
                      }
                      break;
                    }
                  }
                  let parser = new DOMParser();
                  for (let par of pars) {
                    let par_new;
                    if (par.html) {
                      let doc = parser.parseFromString('<div>' + par.html + '</div>', 'text/html');
                      par_new = doc.querySelector('div');
                    } else if (par.type === 'PICTURE') {
                      if (par.urlOriginal) {
                        par_new = makeFigure(par.urlOriginal, par.caption, {style: 'width:100%'});
                      }
                    } else if (par.link && par.title) {
                      if (par.contents) {
                        par_new = document.createElement('div');
                        for (let elem of par.contents) {
                          let elem_new;
                          if (elem.html) {
                            let doc = parser.parseFromString('<div>' + elem.html + '</div>', 'text/html');
                            elem_new = doc.querySelector('div');
                          } else if (elem.urlOriginal) {
                            elem_new = makeFigure(elem.urlOriginal, elem.caption, {style: 'width:100%'});
                          }
                          if (elem_new)
                            par_new.appendChild(elem_new);
                        }
                      } else {
                        par_new = document.createElement('p');
                        let art_link = document.createElement('a');
                        art_link.innerText = par.title;
                        art_link.href = par.link;
                        par_new.appendChild(art_link);
                      }
                    }
                    if (par_new)
                      article.appendChild(par_new);
                    else
                      console.log(par);
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
    }
  } else
    ampToHtml();
}

else if (matchDomain('infolibre.es')) {
  if (window.location.pathname.endsWith('.amp.html')) {
    amp_unhide_access_hide('^="access"', '="NOT access"');
  } else {
    amp_redirect('div.paywall__wrapper');
    let ads = 'div.edi-advertising, div.header-ad';
    hideDOMStyle(ads);
  }
}

else if (matchDomain(['lavanguardia.com', 'mundodeportivo.com'])) {
  let ads = 'span.content-ad, span.hidden-ad, span.ad-unit, div.ad-div';
  hideDOMStyle(ads);
}

else if (matchDomain('observador.pt')) {
  let ads = 'div.obs-ad-placeholder, obs-toaster-seats, obs-moa-btn-seats';
  hideDOMStyle(ads);
}

else if (matchDomain('politicaexterior.com')) {
  let paywall = document.querySelector('div[class^="paywall-"]');
  if (paywall) {
    let article = document.querySelector('div.entry-content-text');
    let json = document.querySelector('script[type="application/ld+json"]:not([class])');
    if (json) {
      let json_text = JSON.parse(json.text).description.replace(/&amp;nbsp;/g, '');
      let article_new = document.createElement('div');
      article_new.setAttribute('class', 'entry-content-text');
      article_new.innerText = '\r\n' + json_text;
      article.parentNode.replaceChild(article_new, article);
    }
    removeDOMElement(paywall);
  }
}

else if (matchDomain('publico.es')) {
  let ads = 'div.pb-ads';
  hideDOMStyle(ads);
}

else if (matchDomain('sabado.pt')) {
  if (!window.location.pathname.includes('/amp/'))
    amp_redirect('.bloqueio_exclusivos, .container_assinatura, .bloco_bloqueio', '', window.location.href.replace('/detalhe/', '/amp/'));
  else
    amp_unhide_access_hide('="subscriber"', '="NOT subscriber"', 'div.adbox, amp-consent, .detalheAds, .exclusivos_bar');
}

else if (window.location.hostname.endsWith('.es')) {// Sport Life Ibérica sites
  if (document.querySelector('div > ul > li > a[href="https://www.sportlife.es/"]')) {
    let paywall = document.querySelector('div.c-paywall');
    if (paywall) {
      let article = document.querySelector('div.c-mainarticle__body');
      let json_script = getArticleJsonScript();
      if (json_script) {
        let json_text = JSON.parse(json_script.text).articleBody;
        let article_new = document.createElement('div');
        article_new.innerText = json_text;
        article.parentNode.replaceChild(article_new, article);
      }
      removeDOMElement(paywall);
    }
  }
}

} else if (window.location.hostname.match(/\.(ar|br|cl|pe|uy)$/) || matchDomain(['abcmais.com', 'clarin.com', 'cronista.com', 'elespectador.com', 'elmercurio.com', 'eltiempo.com', 'eltribuno.com', 'eluniverso.com', 'exame.com', 'globo.com', 'lasegunda.com', 'latercera.com', 'revistaoeste.com', 'semana.com'])) {//south america

if (matchDomain('abcmais.com')) {
  if (!window.location.pathname.endsWith('/amp/')) {
    getJsonUrl('section#section-iframe-assinante', '', 'div.degressing-opacity');
  } else {
    let paywall = document.querySelector('div.b-vindo');
    if (paywall) {
      removeDOMElement(paywall);
      let template = document.querySelector('template');
      if (template) {
        let article = document.querySelector('section > div.resumo');
        if (article) {
          let parser = new DOMParser();
          let doc = parser.parseFromString('<div>' + template.innerHTML + '</div>', 'text/html');
          let article_new = doc.querySelector('div');
          article.parentNode.replaceChild(article_new, article);
        }
      }
    }
  }
}

else if (matchDomain('abril.com.br')) {
  if (window.location.pathname.endsWith('/amp/')) {
    let paywall = document.querySelector('.piano-modal');
    removeDOMElement(paywall);
  } else {
    let ads = 'div.ads, div[class^="ads-"], div.MGID';
    hideDOMStyle(ads);
  }
}

else if (matchDomain(ar_grupo_clarin_domains)) {
  let ads = 'div.ad-slot, div.box-adv, div.wrapperblock, div.banner, div[id^="div-gpt-ad-"], div.bannerTopHeader, div.sticky, div.SRA';
  hideDOMStyle(ads);
}

else if (matchDomain('cartacapital.com.br')) {
  if (!window.location.pathname.endsWith('/amp/')) {
    let paywall = document.querySelector('aside.paywall');
    if (paywall) {
      removeDOMElement(paywall);
      let json_script = getArticleJsonScript();
      if (json_script) {
        try {
          let json = JSON.parse(json_script.text);
          if (json) {
            let json_text = json[1].articleBody.replace(/\s{2,}/g, '\r\n\r\n');
            let content = document.querySelector('section.s-content__text');
            if (json_text && content) {
              content.innerHTML = '';
              let article_new = document.createElement('p');
              article_new.innerText = json_text;
              content.appendChild(article_new);
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      let content_soft = document.querySelector('div.contentSoft');
      if (content_soft) {
        content_soft.removeAttribute('class');
        let freemium = document.querySelectorAll('div[class^="s-freemium"], div.maggazine-add');
        removeDOMElement(...freemium);
      }
    }
    let ads = 'div.div_ros_topo';
    hideDOMStyle(ads);
  } else
    ampToHtml();
}

else if (matchDomain('cronista.com')) {
  let paywall = document.querySelector('div.article-body--blurred');
  if (paywall)
    paywall.classList.remove('article-body--blurred');
  let ads = 'div#ad-slot-header, div.ad-slot-intext, div#selectMediaNota, div.b-suscription-container, div.paywall-chain--show';
  hideDOMStyle(ads);
}

else if (matchDomain('crusoe.com.br')) {
  getJsonUrl('section.paywall', '', 'div#content_post', {art_append: 1});
  let ads = 'div#gpt-leaderboard, div.ads_desktop, div[class^="container-banner-"], div.catchment-box';
  hideDOMStyle(ads);
}

else if (matchDomain('diplomatique.org.br')) {
  getJsonUrl('div.entry-content div.module_row', '', 'div.entry-content');
}

else if (matchDomain(pe_grupo_elcomercio_domains)) {
  let paywall = document.querySelector('.paywall');
  if (paywall) {
    paywall.removeAttribute('class');
    paywall.removeAttribute('style');
    let fade = document.querySelector('p.story-contents--fade');
    if (fade)
      fade.classList.remove('story-contents--fade');
  }
  let ads = 'div[class^="content_gpt"]';
  hideDOMStyle(ads);
}

else if (matchDomain('elespectador.com')) {
  if (window.location.search.includes('outputType=amp')) {
    amp_unhide_access_hide('="granted"', '="NOT granted"', '[class^="Widget"], amp-fx-flying-carpet, div[style*=";background:"]:has(amp-ad)', false);
    let googledoc_iframes = document.querySelectorAll('div > amp-iframe[src^="https://docs.google.com/viewer"][class]');
    for (let elem of googledoc_iframes) {
      let a_link = document.createElement('a');
      a_link.href = elem.getAttribute('src');
      a_link.innerText = 'pdf-link';
      a_link.target = '_blank';
      elem.removeAttribute('class');
      elem.parentNode.before(a_link);
    }
  } else {
    amp_redirect('div.exclusive_validation');
    let ads = 'div.Ads, div[class^="Ads_"]';
    hideDOMStyle(ads);
  }
}

else if (matchDomain('elmercurio.com')) {
  if (window.location.hostname.startsWith('digital.')) {
    window.setTimeout(function () {
      let elem_hidden = document.querySelectorAll('[style="visibility:hidden"]');
      for (let elem of elem_hidden)
        elem.removeAttribute('style');
      let page_pdf_content = document.querySelector('div.page_pdf_content');
      let close_html = document.querySelector('div.close_html');
      let cont_page_full = document.querySelector('div.cont_page_full');
      removeDOMElement(page_pdf_content, close_html, cont_page_full);
    }, 1000);
    window.setTimeout(function () {
      let cont_articlelight = document.querySelector('div.cont_articlelight');
      if (cont_articlelight)
        cont_articlelight.setAttribute('style', 'height: 100% !important; width: 90% !important');
    }, 3000);
    if (window.location.pathname.startsWith('/mobile')) {
      let lessreadmore = document.querySelectorAll('article.lessreadmore');
      for (let article of lessreadmore)
        article.classList.remove('lessreadmore');
      let bt_readmore = document.querySelectorAll('div[id*="bt_readmore_"]');
      removeDOMElement(...bt_readmore);
    }
  } else if (window.location.pathname.endsWith('/Registro/Login.aspx')) {
    header_nofix('body');
  }
}

else if (matchDomain('elobservador.com.uy')) {
  if (window.location.pathname.endsWith('/amp')) {
    amp_unhide_access_hide('="observador.mostrarNota"');
    let amp_images = document.querySelectorAll('div.fixed-container > amp-img.null');
    for (let amp_image of amp_images) {
      let elem = document.createElement('img');
      Object.assign(elem, {
        src: amp_image.getAttribute('src'),
        alt: amp_image.getAttribute('alt'),
        title: amp_image.getAttribute('title')
      });
      amp_image.parentNode.replaceChild(elem, amp_image);
    }
  } else {
    amp_redirect('div.mensaje_member', '', window.location.pathname + '/amp');
  }
}

else if (matchDomain('eltiempo.com')) {
  let exclusivo = document.querySelector('div.c-articulo-exclusivo');
  if (exclusivo)
    exclusivo.classList.remove('c-articulo-exclusivo');
  let modulos = document.querySelector('div.modulos');
  if (modulos)
    modulos.classList.remove('modulos');
  let ads = '[class^="c-add"]';
  hideDOMStyle(ads);
}

else if (matchDomain('eltribuno.com')) {
  let ads = 'div.container-spot, div.anticipo-cont';
  hideDOMStyle(ads);
}

else if (matchDomain('eluniverso.com')) {
  let paywall = document.querySelectorAll('head > meta[name][content="premium"]');
  let article = document.querySelector('section.article-body');
  if (paywall.length && article) {
    removeDOMElement(...paywall);
    let fusion_script = document.querySelector('script#fusion-metadata');
    if (fusion_script && fusion_script.text.includes('Fusion.globalContent=')) {
      try {
        let json = JSON.parse(fusion_script.text.split('Fusion.globalContent=')[1].split(';Fusion.')[0]);
        if (json) {
          article.innerHTML = '';
          let parser = new DOMParser();
          let pars = json.content_elements;
          for (let par of pars) {
            let par_new;
            if (['header', 'text'].includes(par.type)) {
              if (par.content) {
                let doc = parser.parseFromString('<p class="prose-text">' + par.content + '</p>', 'text/html');
                par_new = doc.querySelector('p');
              }
            } else if (par.type === 'interstitial_link') {
              if (par.url && par.content) {
                par_new = document.createElement('p');
                int_link = document.createElement('a');
                int_link.href = par.url;
                int_link.innerText = par.content;
                par_new.appendChild(int_link);
              }
            } else if (par.type === 'image') {
              if (par.url) {
                let caption_text = par.caption;
                if (par.credits && par.credits.by && par.credits.by[0] && par.credits.by[0].name)
                  caption_text += ' - ' + par.credits.by[0].name;
                par_new = makeFigure(par.url, caption_text);
              }
            } else if (par.type === 'raw_html') {
              let doc = parser.parseFromString('<div>' + par.content + '</div>', 'text/html');
              par_new = doc.querySelector('div');
            } else if (par.raw_oembed) {
              if (par.raw_oembed.html) {
                let doc = parser.parseFromString('<div>' + par.raw_oembed.html + '</div>', 'text/html');
                par_new = doc.querySelector('div');
              }
            } else if (par.type === 'list') {
              if (par.items) {
                par_new = document.createElement('ul');
                for (let item of par.items) {
                  let li = document.createElement('li');
                  let doc = parser.parseFromString('<span>' + item.content + '</span>', 'text/html');
                  let span = doc.querySelector('span');
                  li.appendChild(span);
                  par_new.appendChild(li);
                }
              }
            } else if (par.type === 'table') {
              if (par.header && par.rows) {
                par_new = document.createElement('table');
                let h_row = document.createElement('tr');
                for (let item of par.header) {
                  let th = document.createElement('th');
                  let doc = parser.parseFromString('<span>' + item.content + '</span>', 'text/html');
                  let span = doc.querySelector('span');
                  th.appendChild(span);
                  h_row.appendChild(th);
                }
                par_new.appendChild(h_row);
                for (let row of par.rows) {
                  let tr = document.createElement('tr');
                  for (let item of row) {
                    let td = document.createElement('td');
                    let doc = parser.parseFromString('<span>' + item.content + '</span>', 'text/html');
                    let span = doc.querySelector('span');
                    td.appendChild(span);
                    tr.appendChild(td);
                  }
                  par_new.appendChild(tr);
                }
              }
            } else if (!['quote'].includes(par.type)) {
              console.log(par);
            }
            if (par_new)
              article.appendChild(par_new);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    let banner = pageContains('div > span', /Contenido exclusivo para suscriptores/);
    if (banner.length)
      removeDOMElement(banner[0].parentNode);
  }
  let ads = 'div[id^="ad-"]';
  hideDOMStyle(ads);
}

else if (matchDomain('em.com.br')) {
  if (!window.location.pathname.endsWith('/amp.html')) {
    amp_redirect('.news-blocked-content');
    let ads = 'div.ads, div.containerads, div.edm-banner, div.publicidade-interna-container';
    hideDOMStyle(ads);
  } else {
    amp_unhide_subscr_section('amp-fx-flying-carpet');
    let compress_text = document.querySelector('div.compress-text');
    if (compress_text)
      compress_text.classList.remove('compress-text');
  }
}

else if (matchDomain('estadao.com.br')) {
  if (window.location.pathname.match(/(\.amp$|^\/amp\/)/) || window.location.search.startsWith('?amp')) {
    amp_unhide_access_hide('="outputValue=\'hide_paywall\'"', '="outputValue=\'show_paywall\'"', 'amp-fx-flying-carpet, div[class^="pAd"], div.ads-container');
  } else {
    let paywall = document.getElementById('paywall-wrapper-iframe-estadao');
    removeDOMElement(paywall);
    let ads = 'div[class^="styles__Container-sc-"]';
    hideDOMStyle(ads);
  }
}

else if (matchDomain('exame.com')) {
  let hidden_images = document.querySelectorAll('img[src^="data:image/"');
  for (let elem of hidden_images) {
    let noscript = elem.parentNode.querySelector('noscript');
    if (noscript && noscript.innerText.includes('src="'))
      elem.src = noscript.innerText.split('src="')[1].split('"')[0];
  }
  let ads = 'div[class*="ad-pos-"]';
  hideDOMStyle(ads);
}

else if (matchDomain('uol.com.br')) {
  if (matchDomain('folha.uol.com.br')) {
    if (matchDomain('piaui.folha.uol.com.br')) {
      let audio = document.querySelector('div.audio-player-container:has(audio[src])');
      if (audio) {
        let audio_new = document.createElement('audio');
        audio_new.src = audio.querySelector('audio').src;
        audio_new.setAttribute('controls', '');
        audio.parentNode.replaceChild(audio_new, audio);
      }
      header_nofix('div.paywall__content', 'div.revista--interna__assineonly', 'BPC > no fix' + (audio ? ' (audio-only)' : ''));
    } else if (window.location.pathname.startsWith('/amp/')) {
      amp_unhide_subscr_section('amp-sticky-ad');
    } else {
      let signup = document.querySelector('.c-top-signup');
      removeDOMElement(signup);
    }
  }
  let ads = 'div[class*="advertising"], div.jupiter-ads, div.up-floating, div[data-cp-id$="asfads"], div.ms-hapb, div.ms-apb';
  hideDOMStyle(ads);
}

else if (matchDomain('gauchazh.clicrbs.com.br')) {
  let div_hidden = document.querySelector('div.m-paid-content > div.hidden');
  if (div_hidden)
    div_hidden.removeAttribute('class');
  let ads = 'div.ad-banner, div.animate-pulse, div.slot-superbanner, div.overflow-hidden:has(div.bg-ad-placeholder), section.ads-section-area';
  hideDOMStyle(ads);
}

else if (matchDomain('gazetadopovo.com.br')) {
  if (window.location.pathname.endsWith('/amp/')) {
    amp_unhide_subscr_section('div.ads-amp, div.tpl-wrapper', false);
  } else {
    let ads = 'div[class*="c-ads"]';
    hideDOMStyle(ads);
  }
}

else if (matchDomain('globo.com')) {
  if (matchDomain('valor.globo.com')) {
    if (!window.location.pathname.startsWith('/google/amp/')) {
      amp_redirect('div.paywall');
    } else {
      amp_unhide_subscr_section();
      amp_images_replace();
    }
  } else if (window.location.pathname.includes('/amp/'))
    ampToHtml();
  if (!window.location.pathname.includes('/amp/')) {
    let ads = 'div[id^="ad-container"], div.content-ads, div[class^="block__advertising"], div#pub-in-text-wrapper, div.area_publicidade_container';
    hideDOMStyle(ads);
  }
}

else if (matchDomain('lanacion.com.ar')) {
  setCookie(/^metering_arc/, '', 'lanacion.com.ar', '/', 0);
  if (matchDomain('suscripciones.lanacion.com.ar')) {
    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('callback')) {
      let article_sel = 'main.paywall-container';
      let url = atob(searchParams.get('callback')).split('?')[0];
      getArchive(url, article_sel + '> button', '', article_sel, '', 'div#fusion-app', 'div#wall');
    }
  }
  let ads = 'div.ln-banner-container';
  hideDOMStyle(ads);
}

else if (matchDomain('lasegunda.com')) {
  if (window.location.pathname.endsWith('/Registro/Login.aspx') && window.location.search.startsWith('?urlBack=')) {
    let intro = document.querySelector('body > div > article');
    if (intro) {
      intro.parentNode.removeAttribute('style');
      intro.parentNode.parentNode.style = 'margin: 20px;';
      let mh_new = document.createElement('div');
      mh_new.style = 'font-size: 20px; font-weight: bold; text-align: center; margin: 20px;';
      let main = document.createElement('a');
      main.href = 'https://www.lasegunda.com';
      main.innerText = 'la Segunda';
      mh_new.appendChild(main);
      intro.before(mh_new);
      let page = document.querySelector('div#page');
      if (page) {
        let article_id_match = window.location.search.split('?urlBack=')[1].match(/\/(\d{6,})\//);
        if (article_id_match) {
          let article_id = article_id_match[1];
          let url_src = 'https://newsapi.ecn.cl/NewsApi/lasegunda/noticia/' + article_id;
          fetch(url_src)
          .then(response => {
            if (response.ok) {
              response.json().then(json => {
                try {
                  if (json._source) {
                    let art_source = json._source;
                    let author = document.createElement('span');
                    author.innerText = art_source.autor + (art_source.fechaPublicacion ? '\r\n' + art_source.fechaPublicacion.replace('T', ' ').replace(/:00$/, '') : '');
                    page.appendChild(author);
                    if (art_source.tablas && art_source.tablas.tablaMedios && art_source.tablas.tablaMedios[0]) {
                      let figure = makeFigure(art_source.tablas.tablaMedios[0].Url);
                      figure.style = 'margin: 15px;';
                      intro.firstChild.before(figure);
                    }
                    function make_fig(p1, p2 = '') {
                      let result = '<figure style="margin: 15px 0px"><img src="' + p1 + '"><figcaption>' + (p2 ? p2.replace(/^;\s/, '') : '') + '</figcaption></figure>';
                      return result;
                    }
                    function make_imagen(match, p1, offset, string) {
                      return make_fig(p1);
                    }
                    function make_imagen_credito(match, p1, p2, offset, string) {
                      return make_fig(p1, p2);
                    }
                    function make_video(match, p1, offset, string) {
                      return '<video controls src="' + p1 + '" style="width: 100%; margin: 15px 0px;">';
                    }
                    let art_text = art_source.texto.replace(/&nbsp;/g, ' ').replace(/{IMAGEN?\s([^}]+)}/g, make_imagen);
                    art_text = art_text.replace(/{IMAGENCREDITO\s([^;]+)(;\s[^}]+)}/g, make_imagen_credito);
                    art_text = art_text.replace(/{VIDEO?\s([^}]+)}/g, make_video);
                    art_text = art_text.replace(/{CITA[^}]+}/g, '').replace(/{DESTACAR\s/g, '').replace(/}/g, '');
                    if (!art_text.includes('{'))
                      art_text = art_text.replace(/}/g, '');
                    else
                      console.log('source still has macros');
                    let parser = new DOMParser();
                    let doc = parser.parseFromString('<div style="margin: 20px 0px;">' + art_text + '<br></div>', 'text/html');
                    let article_new = doc.querySelector('div');
                    page.appendChild(article_new);
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
  }
}

else if (matchDomain('latercera.com')) {
  let ads = 'div.ads-block';
  hideDOMStyle(ads);
}

else if (matchDomain('nsctotal.com.br')) {
  let ads = 'div.ad, div[id^="floater"]';
  hideDOMStyle(ads);
}

else if (matchDomain('revistaoeste.com')) {
  if (window.location.pathname.startsWith('/revista/')) {
    let loading_content = document.querySelector('div.loading_content');
    if (loading_content)
      loading_content.removeAttribute('class');
    let spinner = document.querySelector('svg.spinner-eclipse');
    removeDOMElement(spinner);
    let lazy_images = document.querySelectorAll('img[src^="data:image/"][data-src]');
    for (let elem of lazy_images)
      elem.src = elem.getAttribute('data-src');
  } else {
    let div_expandable = document.querySelector('div.expandable');
    if (div_expandable)
      div_expandable.classList.remove('expandable');
    let ads = 'section.ad-wrapper, div.autozep-outer';
    hideDOMStyle(ads);
  }
}

else if (matchDomain('semana.com')) {
  if (!window.location.pathname.startsWith('/amp/'))
    amp_redirect('div.paywall > div:not(.article-body)');
  let ads = 'div.ads-cls, amp-fx-flying-carpet';
  hideDOMStyle(ads);
}

}

ads_hide();
leaky_paywall_unhide();

}, 1000);

// General Functions

// import (see @require)

})();
