// ==UserScript==
// @name         Play video on hover
// @namespace    https://lukaszmical.pl/
// @version      0.6.0
// @description  Facebook, Vimeo, Youtube, Streamable, Tiktok, Instagram, Twitter, X, Dailymotion, Coub, Spotify, SoundCloud, Apple Podcasts, Amazon Music, Deezer, Tidal, Ted, Pbs, Odysee, Playeur, Bitchute, Rss - play on hover
// @author       Łukasz Micał
// @match        *://*/*
// @icon         https://static-00.iconduck.com/assets.00/cursor-hover-icon-512x439-vou7bdac.png
// @downloadURL https://update.greasyfork.org/scripts/419400/Play%20video%20on%20hover.user.js
// @updateURL https://update.greasyfork.org/scripts/419400/Play%20video%20on%20hover.meta.js
// ==/UserScript==

// libs/share/src/ui/SvgComponent.ts
const SvgComponent = class {
  constructor(tag, props = {}) {
    this.element = Dom.createSvg({ tag, ...props });
  }

  addClassName(...className) {
    this.element.classList.add(...className);
  }

  event(event, callback) {
    this.element.addEventListener(event, callback);
  }

  getElement() {
    return this.element;
  }

  mount(parent) {
    parent.appendChild(this.element);
  }
};

// libs/share/src/ui/Dom.ts
var Dom = class _Dom {
  static appendChildren(element, children, isSvgMode = false) {
    if (children) {
      element.append(
        ..._Dom.array(children).map((item) => {
          if (typeof item === 'string') {
            return document.createTextNode(item);
          }
          if (item instanceof HTMLElement || item instanceof SVGElement) {
            return item;
          }
          if (item instanceof Component || item instanceof SvgComponent) {
            return item.getElement();
          }
          const isSvg =
            'svg' === item.tag
              ? true
              : 'foreignObject' === item.tag
              ? false
              : isSvgMode;
          if (isSvg) {
            return _Dom.createSvg(item);
          }
          return _Dom.create(item);
        })
      );
    }
  }

  static applyAttrs(element, attrs) {
    if (attrs) {
      Object.entries(attrs).forEach(([key, value]) => {
        if (value === void 0 || value === false) {
          element.removeAttribute(key);
        } else {
          element.setAttribute(key, `${value}`);
        }
      });
    }
  }

  static applyClass(element, classes) {
    if (classes) {
      element.classList.add(...classes.split(' ').filter(Boolean));
    }
  }

  static applyEvents(element, events) {
    if (events) {
      Object.entries(events).forEach(([name, callback]) => {
        element.addEventListener(name, callback);
      });
    }
  }

  static applyStyles(element, styles) {
    if (styles) {
      Object.entries(styles).forEach(([key, value]) => {
        const name = key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
        element.style.setProperty(name, value);
      });
    }
  }

  static array(element) {
    return Array.isArray(element) ? element : [element];
  }

  static create(data) {
    const element = document.createElement(data.tag);
    _Dom.appendChildren(element, data.children);
    _Dom.applyClass(element, data.classes);
    _Dom.applyAttrs(element, data.attrs);
    _Dom.applyEvents(element, data.events);
    _Dom.applyStyles(element, data.styles);
    return element;
  }

  static createSvg(data) {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      data.tag
    );
    _Dom.appendChildren(element, data.children, true);
    _Dom.applyClass(element, data.classes);
    _Dom.applyAttrs(element, data.attrs);
    _Dom.applyEvents(element, data.events);
    _Dom.applyStyles(element, data.styles);
    return element;
  }

  static element(tag, classes, children) {
    return _Dom.create({ tag, children, classes });
  }

  static elementSvg(tag, classes, children) {
    return _Dom.createSvg({ tag, children, classes });
  }
};

// libs/share/src/ui/Component.ts
var Component = class {
  constructor(tag, props = {}) {
    this.element = Dom.create({ tag, ...props });
  }

  addClassName(...className) {
    this.element.classList.add(...className);
  }

  event(event, callback) {
    this.element.addEventListener(event, callback);
  }

  getElement() {
    return this.element;
  }

  mount(parent) {
    parent.appendChild(this.element);
  }
};

// apps/on-hover-preview/src/components/PreviewPopup.ts
const PreviewPopup = class _PreviewPopup extends Component {
  constructor() {
    super('div', {
      attrs: {
        id: _PreviewPopup.ID,
      },
      children: {
        tag: 'iframe',
        attrs: {
          allow:
            'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share',
          allowFullscreen: true,
        },
        styles: {
          width: '100%',
          border: 'none',
          height: '100%',
        },
      },
      styles: {
        width: '500px',
        background: '#444',
        boxShadow: 'rgb(218, 218, 218) 1px 1px 5px',
        display: 'none',
        height: '300px',
        overflow: 'hidden',
        position: 'absolute',
        zIndex: '9999',
      },
    });
    this.iframeActive = false;
    this.iframe = this.element.children[0];
    if (!document.querySelector(`#${_PreviewPopup.ID}`)) {
      this.mount(document.body);
      document.addEventListener('click', this.hidePopup.bind(this));
    }
  }

  static {
    this.ID = 'play-on-hover-popup';
  }

  hidePopup() {
    this.iframeActive = false;
    this.iframe.src = '';
    this.element.style.display = 'none';
  }

  showPopup(e, url, service) {
    if (!this.iframeActive) {
      this.iframe.src = url;
      this.iframeActive = true;
      Dom.applyStyles(this.element, {
        display: 'block',
        left: `${e.pageX}px`,
        top: `${e.pageY}px`,
        ...service.styles,
      });
    }
  }
};

// libs/share/src/ui/Events.ts
const Events = class {
  static intendHover(validate, mouseover, mouseleave, timeout = 500) {
    let hover = false;
    let id = 0;
    const onHover = (event) => {
      if (!event.target || !validate(event.target)) {
        return;
      }
      const element = event.target;
      hover = true;
      element.addEventListener(
        'mouseleave',
        (ev) => {
          mouseleave?.call(element, ev);
          clearTimeout(id);
          hover = false;
        },
        { once: true }
      );
      clearTimeout(id);
      id = window.setTimeout(() => {
        if (hover) {
          mouseover.call(element, event);
        }
      }, timeout);
    };
    document.body.addEventListener('mouseover', onHover);
  }
};

// apps/on-hover-preview/src/helpers/LinkHover.ts
const LinkHover = class {
  constructor(services, onHover) {
    this.services = services;
    this.onHover = onHover;
    Events.intendHover(
      this.isValidLink.bind(this),
      this.onAnchorHover.bind(this)
    );
  }

  anchorElement(node) {
    if (!(node instanceof HTMLElement)) {
      return void 0;
    }
    if (node instanceof HTMLAnchorElement) {
      return node;
    }
    const parent = node.closest('a');
    if (parent instanceof HTMLElement) {
      return parent;
    }
    return void 0;
  }

  findService(url = '') {
    return this.services.find((service) => service.isValidUrl(url));
  }

  isValidLink(node) {
    const anchor = this.anchorElement(node);
    if (!anchor || !anchor.href || anchor.href === '#') {
      return false;
    }
    return true;
  }

  async onAnchorHover(ev) {
    const anchor = this.anchorElement(ev.target);
    if (!anchor) {
      return;
    }
    const service = this.findService(anchor.href);
    if (!service) {
      return;
    }
    const previewUrl = await service.embeddedVideoUrl(anchor);
    if (!previewUrl) {
      return;
    }
    this.onHover(ev, previewUrl, service);
  }
};

// apps/on-hover-preview/src/services/base/BaseService.ts
const defaultServiceStyle = {
  width: '500px',
  height: '282px',
};
const BaseService = class {
  createUrl(url, params) {
    if (params) {
      return `${url}?${this.params(params)}`;
    }
    return url;
  }

  extractId(url, match) {
    const result = this.match(url, match);
    return result?.id || '';
  }

  isDarkmode() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  match(url, match) {
    const result = url.match(match);
    if (result && result.groups) {
      return result.groups;
    }
    return void 0;
  }

  params(params) {
    return Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }

  theme(light, dark) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? dark
      : light;
  }
};

// apps/on-hover-preview/src/services/base/ServiceFactory.ts
const ServiceFactory = class extends BaseService {
  constructor(config, styles = defaultServiceStyle) {
    super();
    this.config = config;
    this.styles = styles;
    this.initialStyles = styles;
  }

  bindParams(url, params) {
    return Object.entries(params).reduce(
      (acc, [key, value]) =>
        acc.replace(`:${key}`, value !== void 0 ? `${value}` : ''),
      url
    );
  }

  async embeddedVideoUrl(element) {
    const isDarkMode = this.isDarkmode();
    const patternParams = this.match(element.href, this.config.pattern) || {};
    const urlParams = {
      ...patternParams,
      ...this.urlParams(element),
      theme: isDarkMode ? 'dark' : 'light',
    };
    this.styles = {
      ...this.initialStyles,
      height: this.getHeight(urlParams),
    };
    const embedUrl = this.bindParams(
      this.createUrl(this.config.embedUrl, this.config.queryParams),
      urlParams
    );
    if (this.config.urlFunction) {
      return this.config.urlFunction({
        ...urlParams,
        url: embedUrl,
      });
    }
    return embedUrl;
  }

  isValidUrl(url) {
    return this.config.pattern.test(url);
  }

  getHeight(urlParams) {
    if (this.config.heightFunction) {
      return this.config.heightFunction(urlParams);
    }
    if (this.config.typeHeight && urlParams.type in this.config.typeHeight) {
      return this.config.typeHeight[urlParams.type];
    }
    return this.initialStyles.height;
  }

  urlParams(element) {
    return {
      href: element.href,
      pathname: element.pathname,
      search: element.search,
    };
  }
};

// apps/on-hover-preview/src/services/AmazonMusic.ts
const AmazonMusic = class extends ServiceFactory {
  constructor() {
    super(
      {
        embedUrl: 'https://music.amazon.com/embed/:id',
        pattern:
          /music\.amazon\.com\/(?<type>albums|tracks|artists|playlists)\/(?<id>[^/?]+)/,
        typeHeight: { tracks: '250px' },
      },
      {
        width: '500px',
        borderRadius: '12px',
        height: '372px',
      }
    );
  }
};

// apps/on-hover-preview/src/services/AppleMusic.ts
const AppleMusic = class extends ServiceFactory {
  constructor() {
    super(
      {
        embedUrl: 'https://embed.:service.apple.com:pathname',
        pattern:
          /(?<service>music|podcasts)\.apple\.com\/.{2}\/(?<type>song|music-video|artist|album|podcast)/,
        typeHeight: {
          'music-video': '281px',
          song: '175px',
        },
      },
      {
        width: '500px',
        borderRadius: '12px',
        height: '450px',
      }
    );
  }
};

// apps/on-hover-preview/src/services/Bitchute.ts
const Bitchute = class extends ServiceFactory {
  constructor() {
    super({
      embedUrl: 'https://bitchute.com/embed/:id',
      pattern: /bitchute\.com\/video\/(?<id>[^/?]+)\/?/,
    });
  }
};

// apps/on-hover-preview/src/services/Coub.ts
const Coub = class extends ServiceFactory {
  constructor() {
    super({
      embedUrl: 'https://coub.com/embed/:id',
      pattern: /coub\.com\/view\/(?<id>[^/]+)\/?/,
      queryParams: {
        autostart: 'true',
        muted: 'false',
        originalSize: 'false',
        startWithHD: 'true',
      },
    });
  }
};

// apps/on-hover-preview/src/services/Dailymotion.ts
const Dailymotion = class extends ServiceFactory {
  constructor() {
    super({
      embedUrl: 'https://geo.dailymotion.com/player.html?video=:id',
      pattern: /dailymotion\.com\/video\/(?<id>[^/?]+)/,
    });
  }
};

// apps/on-hover-preview/src/services/Deezer.ts
const Deezer = class extends ServiceFactory {
  constructor() {
    super(
      {
        embedUrl: 'https://widget.deezer.com/widget/:theme/:type/:id',
        pattern:
          /deezer\.com\/.{2}\/(?<type>album|playlist|track|artist|show|episode)\/(?<id>\d+)/,
        queryParams: {
          autoplay: 'true',
          radius: 'true',
          tracklist: 'false',
        },
      },
      {
        width: '500px',
        borderRadius: '10px',
        height: '300px',
      }
    );
  }
};

// apps/on-hover-preview/src/services/Facebook.ts
const Facebook = class extends ServiceFactory {
  constructor() {
    super({
      embedUrl: 'https://www.facebook.com/plugins/video.php',
      pattern: /https:\/\/(www\.|m\.)?facebook\.com\/[\w\-_]+\/videos\//,
      queryParams: {
        width: '500',
        autoplay: 'true',
        href: ':href',
        show_text: 'false',
      },
    });
  }
};

// apps/on-hover-preview/src/services/Instagram.ts
const Instagram = class extends ServiceFactory {
  constructor() {
    super(
      {
        embedUrl: 'https://www.instagram.com/p/:id/embed/',
        pattern: /instagram\.com\/(.+\/)?reel\/(?<id>[^/?]+)/,
      },
      {
        width: '300px',
        height: '500px',
      }
    );
  }
};

// apps/on-hover-preview/src/services/Odysee.ts
const Odysee = class extends ServiceFactory {
  constructor() {
    super({
      embedUrl: 'https://odysee.com/$/embed:pathname',
      pattern: /odysee\.com\/@/,
      queryParams: {
        autoplay: 'true',
      },
    });
  }
};

// apps/on-hover-preview/src/services/Pbs.ts
const Pbs = class extends ServiceFactory {
  constructor() {
    super({
      embedUrl: 'https://player.pbs.org/portalplayer/:id',
      pattern: /pbs\.org\/video\/(?<id>.+)?/,
    });
  }
};

// apps/on-hover-preview/src/services/Playeur.ts
const Playeur = class extends ServiceFactory {
  constructor() {
    super({
      embedUrl: 'https://playeur.com/embed/:id',
      pattern: /playeur\.com\/(v|embed)\/(?<id>[^/]+)\/?/,
    });
  }
};

// apps/on-hover-preview/src/services/Podbean.ts
const Podbean = class extends ServiceFactory {
  constructor() {
    super(
      {
        embedUrl: 'https://www.podbean.com/player-v2',
        pattern: /podbean\.com\/.+\/(?<type>dir|pb)-(?<id>[^/?]+)\/?/,
        queryParams: {
          i: ':id-:type',
        },
      },
      {
        width: '500px',
        height: '150px',
      }
    );
  }
};

// apps/on-hover-preview/src/services/Rss.ts
const Rss = class extends ServiceFactory {
  constructor() {
    super(
      {
        embedUrl: 'https://player.rss.com/:show/:id',
        heightFunction: ({ id }) => (id ? '152px' : '320px'),
        pattern: /rss\.com\/podcasts\/(?<show>[^/]+)\/(?<id>\d*)/,
        queryParams: {
          theme: ':theme',
        },
      },
      {
        width: '500px',
        borderRadius: '8px',
        height: '152px',
      }
    );
  }
};

// apps/on-hover-preview/src/services/SoundCloud.ts
const SoundCloud = class extends ServiceFactory {
  constructor() {
    super(
      {
        embedUrl: 'https://w.soundcloud.com/player',
        pattern: /soundcloud\.com\/[^/]+\/[^/?]+/,
        queryParams: {
          hide_related: 'true',
          auto_play: 'true',
          show_artwork: 'true',
          show_comments: 'false',
          show_teaser: 'false',
          url: ':href',
          visual: 'false',
        },
      },
      {
        width: '600px',
        height: '166px',
      }
    );
  }
};

// apps/on-hover-preview/src/services/Spotify.ts
const Spotify = class extends ServiceFactory {
  constructor() {
    super(
      {
        embedUrl: 'https://open.spotify.com/embed/:type/:id',
        pattern:
          /spotify\.com\/(.+\/)?(?<type>track|album|playlist|episode|artist|show)\/(?<id>[\w-]+)/,
        typeHeight: { track: '152px' },
        urlFunction: ({ type, url }) =>
          ['episode', 'show'].includes(type) ? `${url}/video` : url,
      },
      {
        width: '600px',
        borderRadius: '12px',
        height: '352px',
      }
    );
  }
};

// apps/on-hover-preview/src/services/Streamable.ts
const Streamable = class extends ServiceFactory {
  constructor() {
    super({
      embedUrl: 'https://streamable.com/o/:id',
      pattern: /streamable\.com\/([s|o]\/)?(?<id>[^?/]+).*$/,
      queryParams: {
        autoplay: '1',
      },
    });
  }
};

// apps/on-hover-preview/src/services/Ted.ts
const Ted = class extends ServiceFactory {
  constructor() {
    super({
      embedUrl: 'https://embed.ted.com/talks/:id',
      pattern: /ted\.com\/talks\/(?<id>[^/]+)\/?/,
    });
  }
};

// apps/on-hover-preview/src/services/Tidal.ts
const Tidal = class extends ServiceFactory {
  constructor() {
    super(
      {
        embedUrl: 'https://embed.tidal.com/:types/:id',
        pattern:
          /tidal\.com\/(.+\/)?(?<type>track|album|video|playlist)\/(?<id>\d+|[\w-]+)/,
        typeHeight: {
          video: '281px',
          playlist: '400px',
          track: '120px',
        },
      },
      {
        width: '500px',
        borderRadius: '10px',
        height: '300px',
      }
    );
  }
};

// apps/on-hover-preview/src/services/Tiktok.ts
const Tiktok = class extends ServiceFactory {
  constructor() {
    super(
      {
        embedUrl: 'https://www.tiktok.com/player/v1/:id',
        pattern: /tiktok\.com\/.+\/video\/(?<id>\d+)/,
        queryParams: {
          autoplay: 1,
          rel: 0,
        },
      },
      {
        width: '338px',
        height: '575px',
      }
    );
  }
};

// apps/on-hover-preview/src/services/Twitter.ts
const Twitter = class extends ServiceFactory {
  constructor() {
    super(
      {
        embedUrl: 'https://platform.:platform.com/embed/Tweet.html',
        pattern: /(?<platform>twitter|x)\.com\/.+\/status\/(?<id>\d+)\/video/,
        queryParams: {
          id: ':id',
          maxWidth: 480,
          width: 480,
          theme: ':theme',
        },
      },
      {
        width: '500px',
        height: '300px',
      }
    );
  }
};

// apps/on-hover-preview/src/services/Vimeo.ts
const Vimeo = class extends ServiceFactory {
  constructor() {
    super({
      embedUrl: 'https://player.vimeo.com/video/:id',
      pattern: /vimeo\.com(.+)*\/(?<id>\d+)\/?$/,
    });
  }
};

// apps/on-hover-preview/src/services/Youtube.ts
const YoutubeHelper = class {
  static getId(search) {
    return new URLSearchParams(search).get('v') || '';
  }

  static getStartTime(search) {
    const start = new URLSearchParams(search).get('t') || '0s';
    const result = start.match(/(?:(?<h>\d+)h)?(?:(?<m>\d+)m)?(?<s>\d+)s/);
    if (result && result.groups) {
      return (
        Number(result.groups.h || '0') * 3600 +
        Number(result.groups.m || '0') * 60 +
        Number(result.groups.s || '0')
      );
    }
    return 0;
  }
};
const Youtube = class extends ServiceFactory {
  constructor() {
    super({
      embedUrl: 'https://www.youtube.com/embed/:id',
      pattern: /youtube\.com\/watch/,
      queryParams: {
        autoplay: 1,
        start: ':start',
      },
      urlFunction: ({ search, url }) =>
        this.bindParams(url, {
          id: YoutubeHelper.getId(search),
          start: YoutubeHelper.getStartTime(search),
        }),
    });
  }
};
const YoutubeShortcut = class extends ServiceFactory {
  constructor() {
    super({
      embedUrl: 'https://www.youtube.com/embed/:id',
      pattern: /youtu\.be\/(?<id>[^?/]+)/,
      queryParams: {
        autoplay: 1,
        start: ':start',
      },
      urlFunction: ({ search, url }) =>
        this.bindParams(url, {
          start: YoutubeHelper.getStartTime(search),
        }),
    });
  }
};
const YoutubeShorts = class extends ServiceFactory {
  constructor() {
    super(
      {
        embedUrl: 'https://www.youtube.com/embed/:id',
        pattern: /youtube\.com\/shorts\/(?<id>[^?/]+).*$/,
        queryParams: {
          autoplay: 1,
        },
      },
      {
        width: '256px',
        height: '454px',
      }
    );
  }
};

// apps/on-hover-preview/src/main.ts
function run() {
  const services = [
    Youtube,
    YoutubeShortcut,
    YoutubeShorts,
    Vimeo,
    Streamable,
    Facebook,
    Tiktok,
    Instagram,
    Twitter,
    Dailymotion,
    Dailymotion,
    Coub,
    Spotify,
    SoundCloud,
    AppleMusic,
    Deezer,
    Tidal,
    Ted,
    Pbs,
    Odysee,
    Playeur,
    Bitchute,
    Podbean,
    Rss,
    AmazonMusic,
    // Rumble,
  ].map((Service) => new Service());
  const previewPopup = new PreviewPopup();
  new LinkHover(services, previewPopup.showPopup.bind(previewPopup));
}

if (window.top == window.self) {
  run();
}
