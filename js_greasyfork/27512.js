// ==UserScript==
// @name         turkoptiscript
// @author       feihtality
// @namespace    https://greasyfork.org/en/users/12709
// @version      1.0.0-rc3
// @description  User script for Turkopticon -- review requesters on Amazon Mechanical Turk
// @license      ISC
// @include      https://*.mturk.com/*
// @exclude      https://www.mturk.com/mturk/findhits?*hit_scraper
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27512/turkoptiscript.user.js
// @updateURL https://update.greasyfork.org/scripts/27512/turkoptiscript.meta.js
// ==/UserScript==
(function () {
'use strict';

function qs(selector, ctx) {
  return (ctx || document).querySelector(selector);
}

function qsa(selector, ctx) {
  return Array.from((ctx || document).querySelectorAll(selector));
}

function make(tag, attrs = {}, namespace) {
  const el = namespace ? document.createElementNS(namespace, tag) : document.createElement(tag);
  Object.keys(attrs).forEach(attr => el.setAttribute(attr, attrs[attr]));
  return el;
}

function format(data, attr) {
  const payRate = (p, t, total) => t > 0 ? '$' + ((p/t)*60**2).toFixed(2) : '--',
        toDays  = (t) => t > 0 ? (t/86400.0).toFixed(2) : '--',
        percent = (x,n) => n > 0 ? Math.round(100*x/n) + '%' : '--';

  switch (attr) {
    case 'pending':
      return `${toDays(data)} days`;
    case 'reward':
      return `${payRate(...data)}/hr`;
    case 'tos':
    case 'broken':
    case 'rejected':
      return data[0];
    default:
      return `${percent(data[0],data[1])} of ${data[1]}`
  }
}

class HITCapsule {
  constructor(el, lockup) {
    this.elRef = el;
    this.attrs   = {};
    this._lockup = lockup;
  }

  init(selector) {
    if (selector) this.elRef = this.elRef.closest(selector);
    return this;
  }

  inject(data) { this._lockup.inject(data || {}, this.attrs).attach(this.elRef); }

  extract(attrs, env, data) {
    const { root, leaf } = env,
          method = leaf === 'preview' ? '_extractPreview' : '_extractDefault';
    if (root === 'next')
      Object.assign(this.attrs, attrs.reduce((a, b) => (a[b] = data[b]) && a, {}));
    else
      attrs.forEach(attr => this.attrs[attr] = this[method](attr, env));
    return this;
  }

  _extractDefault(attr, env) {
    if (env.leaf === 'statusdetail' && attr === 'title')
      return this._get('.statusdetailTitleColumnValue').textContent;

    switch (attr) {
      case 'reward':
        return this._get('span.reward').textContent.slice(1);
      case 'rid':
        return this._get('[href*="requesterId"]').href.match(/requesterId=([^=&]+)/)[1];
      case 'name':
        return this._get('.requesterIdentity').textContent;
      case 'title':
        return this._get('a.capsulelink').textContent.trim();
    }
  }

  _extractPreview(attr) {
    switch (attr) {
      case 'reward':
        return this._get('span.reward').textContent.slice(1);
      case 'rid':
        return qs('input[name=requesterId]').value;
      case 'name':
        return qs('input[name=prevRequester]').value;
      case 'title':
        return this._get('.capsulelink_bold').textContent.trim();
    }
  }

  _get(selector) { return qs(selector, this.elRef); }
}

class Extractor$$1 {
  constructor() {
    this._selector = new Selector();
  }

  init() {
    this.env     = Extractor$$1.getEnv();
    this._lockup = new Lockup(this.env);
    this._selector.init(this.env);

    const isNext = this.env.root === 'next',
          model = isNext ? JSON.parse(qs(this._selector.anchor).closest('div').dataset['reactProps']) : null;
    this._data   = model ? Extractor$$1.pruneReactModel(model, this.env) : null;
    return this;
  }

  collect(fn) {
    let collection;
    if (fn && typeof fn === 'function')
      collection = fn(this._selector.anchor);
    else throw new TypeError('expected a function');

    const keys      = 'title name rid reward'.split(' ');
    this.collection = collection
      .map((c, i) => {
        const data = this._data ? this._data[i] : null;
        return new HITCapsule(c, this._lockup)
          .init(this._selector.base)
          .extract(keys, this.env, data);
      })
      .reduce((a, b) => (a[b.attrs.rid] ? a[b.attrs.rid].push(b) : (a[b.attrs.rid] = [b])) && a, {});
    return this;
  }

  static getEnv() {
    const strat = { root: 'legacy', leaf: 'default' },
          path  = document.location.pathname;
    if (document.domain.includes('worker') || qs('body > .container-fluid'))
      strat.root = 'next';
    if (path.includes('statusdetail'))
      strat.leaf = 'statusdetail';
    else if (/(myhits|tasks)/.test(path))
      strat.leaf = 'queue';
    else if (qs('#theTime'))
      strat.leaf = 'preview';
    return strat;
  }

  static pruneReactModel(model, env) {
    return model['bodyData'].map(d => {
      const src = env.leaf === 'queue' ? d['project'] : d;

      const { monetary_reward: { amount_in_dollars:reward }, requester_id:rid, title, requester_name:name } = src;

      return { rid: rid, name: name, title: title, reward: reward };
    });
  }

}

class Selector {
  constructor() {
    this.selectors = {
      next  : {
        default: { anchor: 'li.table-row', base: null },
        queue  : { anchor: 'li.table-row', base: null }
      },
      legacy: {
        default     : { anchor: '.requesterIdentity', base: 'table[height]' },
        preview     : { anchor: 'a[id|="requester.tooltip"]', base: 'table[style]' },
        queue       : { anchor: '.requesterIdentity', base: 'table[height]' },
        statusdetail: {
          anchor: '.statusdetailRequesterColumnValue',
          base  : 'tr',
          inject: '.statusdetailRequesterColumnValue'
        }
      }
    };
  }

  init(env) { this.env = env; }

  get anchor() {
    const { root, leaf } = this.env;
    return this.selectors[root][leaf].anchor;
  }

  get base() {
    const { root, leaf } = this.env;
    return this.selectors[root][leaf].base;
  }

  get inject() {
    const { root, leaf } = this.env;
    return this.selectors[root][leaf].inject || '.capsule_field_text';
  }
}

class Lockup {
  constructor(env) {
    this.env  = env;
    this.idol = createLockup(env);
  }

  inject({ aggregates:agg }, scrapeData) {
    this.clone     = this.idol.cloneNode(true);
    const selector = '.to-fc';

    if (agg) {
      [].forEach.call(qs(selector, this.clone).children, el => el.classList.toggle('hidden'));
      qs('a.hidden', this.clone).classList.toggle('hidden');
      ['all', 'recent'].forEach(range => {
        Object.keys(agg[range]).forEach(attr => {
          const val = agg[range][attr],
                sel = `[data-range=${range}][data-attr=${attr}]`;

          qs(sel, this.clone).textContent = format(val, attr);
        });
      });
    }

    [].forEach.call(qsa('a', this.clone), el => buildLink(el, k => scrapeData[k]));
    qs('.to-rn', this.clone).textContent = scrapeData.name;
    return this;
  }

  attach(context) {
    const ref = context instanceof HTMLLIElement
      ? qs('span>span', context)
      : (qs('.capsule_field_text', context) || qs('a', context));
    ref.parentNode.insertBefore(this.clone, ref);
  }
}

// should use custom elements which would be much cleaner, but waiting on FF/Edge to implement
function createLockup(env) {
  const
    pos    = env.root === 'legacy' ? 'to-rel' : 'to-abs',
    root   = make('div', { class: `to-hdi ${pos}` }),
    lockup = make('div', { class: 'to-lockup to-abs' }),
    flex   = lockup.appendChild(make('div', { class: 'to-fc' })),
    labels = ['pay rate', 'time pending', 'response', 'recommend', 'rejected', 'tos', 'broken' ],
    attrs  = ['reward', 'pending', 'comm', 'recommend', 'rejected', 'tos', 'broken'];

  root.appendChild(make('svg', { height: 20, width: 20 }, 'http://www.w3.org/2000/svg'))
      .appendChild(make('path', {
        fill: '#657b83',
        d   : 'M10 0c-5.52 0-10 4.48-10 10 0 5.52 4.48 10 10 10 5.52 0 10-4.48 10-10 0-5.52-4.48-10-10-10zm4.22 5.38c1.34 0 2.41 0.42 3.22 1.25 0.81 0.83 1.22 2.02 1.22 3.5 0 1.47-0.39 2.61-1.19 3.44-0.8 0.83-1.88 1.25-3.22 1.25-1.36 0-2.45-0.42-3.25-1.25-0.8-0.83-1.19-1.95-1.19-3.41 0-0.93 0.13-1.71 0.41-2.34 0.21-0.46 0.49-0.88 0.84-1.25 0.36-0.37 0.76-0.63 1.19-0.81 0.57-0.24 1.23-0.37 1.97-0.37zm-12.47 0.16h7.25v1.56h-2.72v7.56h-1.84v-7.56h-2.69v-1.56zm12.5 1.44c-0.76 0-1.38 0.26-1.84 0.78-0.46 0.52-0.69 1.29-0.69 2.34 0 1.03 0.21 1.81 0.69 2.34 0.48 0.53 1.11 0.81 1.84 0.81 0.73 0 1.31-0.28 1.78-0.81 0.47-0.53 0.72-1.32 0.72-2.37 0-1.05-0.23-1.83-0.69-2.34-0.46-0.51-1.05-0.75-1.81-0.75z'
      }, 'http://www.w3.org/2000/svg'));
  root.appendChild(lockup);
  lockup.insertBefore(make('div', { class: 'to-rn' }), flex);

  let tmp, tagAttrs;
  tmp           = flex.appendChild(make('div', { style: 'margin:10px 0 0' }));
  tmp.innerHTML = 'This requester has not been reviewed yet.';

  tmp           = flex.appendChild(make('div', { class: 'hidden' }));
  tmp.innerHTML = '<span class="to-th">&nbsp;</span>' + labels.map(v => `<span>${v}</span>`).join('');

  ['recent', 'all'].forEach(range => {
    tmp           = flex.appendChild(make('div', { class: 'hidden' }));
    const label   = `<span class="to-th">${range === 'all' ? 'All time' : 'Last 90 days'}</span>`;
    let inner     = attrs.map((attr, i) => `<span data-range="${range}" data-attr="${attr}">---</span>`);
    tmp.innerHTML = label + inner.join('');
  });

  tagAttrs        = {
    class      : 'hidden',
    'data-rid' : '',
    'data-path': '/requesters',
    target     : '_blank',
  };
  tmp             = lockup.appendChild(make('a', tagAttrs));
  tmp.textContent = 'View on Turkopticon';

  tagAttrs        = {
    'data-rid'   : '',
    'data-name' : '',
    'data-title' : '',
    'data-reward': '',
    'data-path'  : '/reviews/new',
    target       : '_blank',
  };
  tmp             = lockup.appendChild(make('a', tagAttrs));
  tmp.textContent = 'Add a new review';

  return root;
}

function buildLink(el, cb) {
  const ds   = Object.keys(el.dataset).filter(k => k !== 'path'),
        href = 'https://turkopticon.info' + el.dataset.path;

  ds.forEach(k => el.dataset[k] = cb(k));
  if (el.dataset.path === '/requesters')
    el.href = href + '/' + ds.map(k => el.dataset[k]).join('/');
  else
    el.href = href + '?' + ds.map(k => `${k}=${el.dataset[k]}`).join('&');

  return el;
}

class ApiQuery {
  constructor(action, method) {
    this.URI     = 'https://api.turkopticon.info/' + (action || '');
    this.method  = method || 'GET';
    this.version = '2';
  }

  send(params) {
    this.params = params ? new Params(params) : null;

    return new Promise((accept, reject) => {
      const xhr = new XMLHttpRequest(),
            url = this.params ? `${this.URI}?${this.params.toString()}` : this.URI;
      xhr.open(this.method, url);
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', `application/vnd.turkopticon.v${this.version}+json`);
      xhr.send();
      xhr.onload = ({ target:{ response } }) => accept(response);
      xhr.onerror = e => reject(e);
    });
  }
}

class Params {
  constructor(params) { this.params = params; }

  toString() { return Params.toParams(this.params); }

  static toParams(obj, scope) {
    if (typeof obj === 'object' && !(obj instanceof Array))
      return Object.keys(obj).map(k => Params.toParams(obj[k], scope ? `${scope}[${k}]` : k)).join('&');
    else
      return `${scope}=${obj.toString()}`;
  }
}

try {
  appendCss();
  const extr = new Extractor$$1().init().collect(qsa),
        rids = Object.keys(extr.collection);

  new ApiQuery('requesters')
    .send({ rids: rids, fields: { requesters: ['rid', 'aggregates'] } })
    .then(response => response.data.reduce((a, b) => (a[b.attributes.rid] = b.attributes) && a, {}))
    .then(data => rids.forEach(rid => extr.collection[rid].forEach(capsule => capsule.inject(data[rid]))))
    .catch(console.error.bind(console, '#apierror'));
} catch(err) {
  console.error(err);
}

function appendCss() {
  const style     = document.head.appendChild(make('style'));
  style.innerHTML = `
  .to-rel { position:relative; }
  .to-abs { position:absolute; }
  .to-hdi { display:inline-block; font-size:12px; cursor:default; line-height:14px; }
  .to-hdi:hover > svg { float:left; z-index:3; position:relative; }
  .to-hdi:hover > .to-lockup { display:block; z-index:2; }
  .to-hdi .hidden, .to-nhdi .hidden { display:none }
  .to-nhdi { font-size:12px; }
  .to-lockup { display:none; width:300px; top:-1px; left:-5px; background:#fff; padding:5px; box-shadow:0px 2px 10px 1px rgba(0,0,0,0.7); }
  .to-lockup a { display:inline-block; width:50%; text-align:center; margin-top:10px; color:crimson; }
  .to-rn { margin:0 0 3px 25px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .to-fc { display:flex; }
  .to-fc > div { flex:1; }
  .to-fc .to-th { font-weight:700; width:100%; background:#6a8ca3; color:#fff }
  .to-fc span { display:block; padding:3px 0; margin:0; }
`;
}

}());
