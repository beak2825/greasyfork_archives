// ==UserScript==
// @name           ReYohoho – No Ads + Enhancements [Ath]
// @name:ru        ReYohoho – Без Рекламы + Улучшения [Ath]
// @name:uk        ReYohoho – Без Реклами + Покращення [Ath]
// @name:be        ReYohoho – Без Рэкламы + Паляпшэнні [Ath]
// @name:bg        ReYohoho – Без Реклами + Подобрения [Ath]
// @name:tt        ReYohoho – Рекламасыз + Яхшыртулар [Ath]
// @name:sl        ReYohoho – Brez Oglasov + Izboljšave [Ath]
// @name:sr        ReYohoho – Bez Reklama + Poboljšanja [Ath]
// @name:ka        ReYohoho – რეკლამის გარეშე + გაუმჯობესებები [Ath]
// @description    Removes video ads from online streaming services in ReYohoho (Rezka, Alloha, Collaps, VideoCDN etc.). Also applies minor enhancements, if possible (extra play speeds etc.).
// @description:ru Убирает рекламные ролики онлайн-кинотеатров в ReYohoho (Rezka, Alloha, Collaps, VideoCDN и т.д.). Также применяет небольшие улучшения, если возможно (дополнительные скорости проигрывания и т.п.).
// @description:uk Видаляє рекламні ролики з онлайн-сервісів для перегляду відео у ReYohoho (Rezka, Alloha, Collaps, VideoCDN тощо). Також застосовує додаткові покращення, якщо це можливо (додаткові швидкості відтворення тощо).
// @description:be Выдаляе рэкламныя ролікі з анлайн-стрымінгавых паслуг у ReYohoho (Rezka, Alloha, Collaps, VideoCDN і г.д.). Таксама ўжывае дробныя паляпшэнні, калі гэта магчыма (дадатковыя хуткасці прайгравання і г.д.).
// @description:bg Премахва видео рекламите от онлайн стрийминг услугите в ReYohoho (Rezka, Alloha, Collaps, VideoCDN и т.н.). Така също прилага малки подобрения, ако е възможно (допълнителни скорости на възпроизвеждане и т.н.).
// @description:tt Онлайн-трансляция хезмәтләрендәге ReYohoho (Rezka, Alloha, Collaps, VideoCDN һ.б.) видео рекламаларны бетерә. Шулай ук мөмкин булганда кечкенә яхшыртулар кертә (өстәмә уйнату тизлекләре һ.б.).
// @description:sl Odstrani video oglase iz spletnih pretočnih storitev v ReYohoho (Rezka, Alloha, Collaps, VideoCDN itd.). Prav tako omogoča manjše izboljšave, če je to mogoče (dodatne hitrosti predvajanja itd.).
// @description:sr Uklanja video reklame sa online striming servisa u ReYohoho (Rezka, Alloha, Collaps, VideoCDN itd.). Takođe primenjuje manja poboljšanja, ako je to moguće (dodatne brzine reprodukcije itd.).
// @description:ka ამოიღებს ვიდეო რეკლამებს ონლაინ სტრიმინგის სერვისებიდან ReYohoho-ში (Rezka, Alloha, Collaps, VideoCDN და ა.შ.). ასევე იღებს პატარა გაუმჯობესებებს, თუ ეს შესაძლებელია (დამატებითი დაკვრის სიჩქარეები და ა.შ.).
// @namespace      athari
// @author         Athari (https://github.com/Athari)
// @copyright      © Prokhorov ‘Athari’ Alexander, 2024–2025
// @license        MIT
// @homepageURL    https://github.com/Athari/AthariUserJS
// @supportURL     https://github.com/Athari/AthariUserJS/issues
// @version        1.0.1
// @icon           https://reyohoho.github.io/reyohoho/icons/favicon-32x32.png
// @match          https://*.allarknow.online/*
// @match          https://*.obrut.show/*
// @match          https://*.embess.ws/*
// @match          https://*.fotpro135alto.com/*
// @match          https://*.videoframe1.com/*
// @match          https://*.videoframe*.com/*
// @match          https://*.lumex.space/*
// @match          https://*.tv-2-kinoserial.net/*
// @match          https://*-kinoserial.net/*
// @match          https://*.rezka.*/*
// @match          https://*.hdrezka.*/*
// @match          https://*.kinopub.*/*
// @match          https://*.rezkify.*/*
// @match          https://*.rezkery.*/*
// @grant          unsafeWindow
// @run-at         document-start
// @sandbox        raw
// @require        https://cdn.jsdelivr.net/npm/@athari/monkeyutils@0.4.3/monkeyutils.u.min.js
// @resource       script-urlpattern https://cdn.jsdelivr.net/npm/urlpattern-polyfill/dist/urlpattern.js
// @tag            athari
// @downloadURL https://update.greasyfork.org/scripts/526228/ReYohoho%20%E2%80%93%20No%20Ads%20%2B%20Enhancements%20%5BAth%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/526228/ReYohoho%20%E2%80%93%20No%20Ads%20%2B%20Enhancements%20%5BAth%5D.meta.js
// ==/UserScript==

(async () => {
  'use strict'

  const { isFunction, isObject, isString, assignDeep,
    waitForCallback, waitForEvent, waitFor, withTimeout,
    matchLocation,
    throwError, attempt,
    overrideProperty, overrideFunction,
    ress, scripts, els, opts, } =
    //require("../@athari-monkeyutils/monkeyutils.u"); // TODO
    athari.monkeyutils;

  const win = unsafeWindow;
  const res = ress(), script = scripts(res);
  const el = els(document);

  Object.assign(globalThis, globalThis.URLPattern ? null : await script.urlpattern);

  const anySubdomain = "(.*\\.)?";
  const globMap = { ".": "\\.", "*": "[^\\.]+" };
  const globDomain = (s) => s.replace(/\.|\*/g, ([m]) => globMap[m] ?? m);
  const oneOfDomains = (...ds) => `(${ds.map(globDomain).join("|")})`;
  const host = {
    alloha: `${anySubdomain}${oneOfDomains("allarknow.online")}`,
    collaps: `${anySubdomain}${oneOfDomains("embess.ws")}`,
    hdvb: `${anySubdomain}${oneOfDomains("fotpro135alto.com")}`,
    turbo: `${anySubdomain}${oneOfDomains("obrut.show")}`,
    vibix: `${anySubdomain}${oneOfDomains("videoframe*.com")}`,
    videocdn: `${anySubdomain}${oneOfDomains("lumex.space")}`,
    videoseed: `${anySubdomain}${oneOfDomains("*-kinoserial.net")}`,
    hdrezka: `${anySubdomain}${oneOfDomains("rezka.*", "hdrezka.*", "kinopub.*", "rezkify.*", "rezkery.*")}`,
  };

  const loggingProxy = (o, level = 0, root = null, path = []) => new Proxy(o, new class {
    construct() {
      console.log("proxy", { o, level, root, path });
    }
    #proxies = {}
    #logProp(act, t, prop, value, args = []) {
      console.log(act, "{", root, "}", `${path.join(".")}.{`, t, `}.${prop} = `, value, ` (${typeof value})`, args);
    }
    get(t, prop) {
      let proxy = this.#proxies[prop];
      if (proxy != null) {
        this.#logProp("get", t, prop, proxy.value);
        return proxy.proxy;
      }
      const value = Reflect.get(t, prop);
      this.#logProp("get", t, prop, value);
      if (level > 1 && (isObject(value) || isFunction(value))) {
        proxy = { value, proxy: loggingProxy(value, level - 1, root ?? value, path.concat(prop)) };
        this.#proxies[prop] = proxy;
        return proxy.proxy;
      } else {
        return value;
      }
    }
    set(t, prop, value) {
      this.#logProp("set", t, prop, value);
      return Reflect.set(t, prop, value);
    }
    apply(t, self, args) {
      const value = Reflect.apply(t, self, args);
      this.#logProp("fun", t, "()", value, args);
      return value;
    }
    construct(t, args) {
      const value = Reflect.construct(t, args);
      this.#logProp("new", t, "new()", value, args);
      return value;
    }
  });

  const playSpeeds = [ 0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 3.5, 4 ];

  const configPlayerJS = {
    settings: {
      customspeeds: 1, speeds: playSpeeds.join(","),
    },
    volume: 1,
    postmessage: 1, log: 1, eventstracker: 1, // logging & messaging
    vast: 0, vast_timeout: 0, vast_volume: 0, // ad config
    preroll: "", prerolls: 0, midroll: [], midrolls: 0, // ad urls
    yamtr: 0, // counters
  };

  const fixPlayerJS = (player) => {
    if (player == null)
      return console.error("playerjs not found");
    player.api('update:vast', false);
    player.api('log', true);
    player.api('volume', 1);
    const options = overrideFunction(win.console, 'log', null, (_, v) => v, () => player.api('options'));
    if (options == null)
      return console.error("playerjs options not found");
    const elPlayer = document.querySelector(`#${options.id}`);
    assignDeep(win, { player, options });
    console.info({ player, options, el: elPlayer });
    assignDeep(options, configPlayerJS, {
      events: options.events || /*'onPlayerJSEvent'*/'PlayerjsEvents',
    });
    if (elPlayer)
      elPlayer.oncontextmenu = null;
    if (isString(options.events)) {
      const originalEvents = options.events; // gets reset for some reason
      overrideFunction(win, options.events, (onPlayerJSEvent, event, playerId, data) => {
        options.events = originalEvents;
        const ignore = event.startsWith('vast_');
        if (![ 'time' ].includes(event))
          console.info(ignore ? "event nay" : "event yay", { e: event, data, id: playerId });
        if (ignore)
          return;
        (onPlayerJSEvent ?? win.PlayerjsEvents)?.(event, playerId, data);
      })
    }
  };

  const fixPlyrConfig = (player) =>
    assignDeep(player, {
      controls: [
        'play-large',
        'play', 'rewind', 'fast-forward', 'progress', 'current-time', 'duration',
        'mute', 'volume',
        'captions', 'settings', 'pip', 'airplay', 'fullscreen',
      ],
      ads: { enabled: false, midroll: [], preroll: "" },
      speed: { options: playSpeeds },
      settings: [ 'quality', 'audio', 'captions', 'speed', 'loop', 'scale', 'bugReport' ],
      volume: 1,
      disableContextMenu: false,
      debug: false,
    });

  console.info("reyohoho no ads", location.href);

  // Alloha: Plyr
  // Configs parsed from JSON strings
  if (matchLocation(host.alloha)) {
    overrideFunction(win.JSON, 'parse', (parse, text) => {
      const json = parse(text);
      if (json.ads && json.controls) {
        console.info("plyr config original", structuredClone(json));
        fixPlyrConfig(json);
        console.info("plyr config modified", structuredClone(json));
      } else if (json.active && json.all) {
        console.info("fileList original", json);
      } else {
        console.debug("parsed json", json);
      }
      return json;
    });
  }
  // Collaps: VenomPlayer
  // Configs passed to makePlayer wrapper function. Override function after var assignments.
  else if (matchLocation(host.collaps)) {
    const adTimeouts = { loading: 0, starting: 0, toNextImp: 0, global: 0 };
    overrideProperty(win, 'adTimeouts', { log: true, set: v => assignDeep(v, adTimeouts) });
    const adCfg = { maxImpressions: 0, urls: [], exitFullscreenVideo: false, vast: { timeouts: adTimeouts } };
    overrideProperty(win, 'adsConfig', { log: true, set: v => assignDeep(v, { volume: 0, pre: adCfg, middle: adCfg, post: adCfg }) });
    const modifiedOpts = { speed: playSpeeds, theme: 'modern', /* venom/classic/metro/modern */ };
    overrideProperty(win, 'middleCount', _ => {
      overrideFunction(win, 'makePlayer', (makePlayer, opts) =>
        makePlayer(new Proxy(assignDeep(opts, modifiedOpts), new class {
          set(t, prop, v) {
            return Object.hasOwn(modifiedOpts, prop) ? true : Reflect.set(t, prop, v);
          }
        })));
      return 0;
    });
  }
  // HDVB: PlayerJS
  // Configs provided as `let` variables. Private "rek" ads config. Break script, run manually.
  else if (matchLocation(host.hdvb)) {
    let fail = true;
    const tag = { conf: { banner_show: false }, key: "", script: "" };
    const banner = { show: false, key: "", script: "" };
    const roll = { time: "", url: "" };
    overrideProperty(win, 'playerConfigs', {
      log: "player config",
      set: v => fail ? throwError("nope") : assignDeep(v, configPlayerJS, {
        events: v.events || 'onPlayerJSEvent',
        rek: {
          endtag: tag, starttag: tag, start2tag: tag, start3tag: tag,
          pausebanner: banner,
          push_roll: roll,
          midroll: [], preroll: [], pushbanner: [],
        },
      }),
    });
    const script = await waitFor(() => el.all.tag.script.filter(s => s.innerText.includes("let playerConfigs"))[0], 10000);
    if (script == null)
      return console.error("player script not found");
    fail = false;
    win.eval(script.innerText.replace("let playerConfigs", "playerConfigs"));
    fixPlayerJS(win.player);
  }
  // Turbo: PlayerJS
  // Config provided as encrypted string passed to global Player function. Wait for pljssglobal[0] assignment.
  else if (matchLocation(host.turbo)) {
    //overrideProperty(win, 'pljssglobal', v => loggingProxy(v, 3));
    let [ player0SetWait, player0Set ] = waitForCallback();
    overrideProperty(win, 'pljssglobal', v => new Proxy(v, new class {
      set(t, prop, value) {
        if (prop == "0")
          player0Set(value);
        return Reflect.set(t, prop, value);
      }
    }));
    const player = win.player = win.pljssglobal?.[0] ?? await withTimeout(player0SetWait, 10000);
    fixPlayerJS(player);
  }
  // TODO Vibix: PlayerJS
  // Configs provided as constants and passed to Playerjs constructor. Break script, run manually.
  else if (matchLocation(host.vibix)) {
    // TODO Find a way to add download  button
    overrideProperty(win, 'DownloadVideo', { get: () => (file) => win.DownloadVideo_(file) });
    await waitForEvent(document, 'DOMContentLoaded');
    const script = await waitFor(() => el.all.tag.script.filter(s => s.innerText.includes("DownloadVideo"))[0], 10000);
    if (script == null)
      return console.error("player script not found");
    overrideFunction(win, 'Playerjs', (Playerjs, opts) => new Playerjs(assignDeep(opts, configPlayerJS)));
    win.eval(script.innerText.replace("DownloadVideo", "DownloadVideo_"));
    fixPlayerJS(win.player);
  }
  // VideoCDN/Lumex: VideoJS
  // Configs provided as HTML elements, player created in external script. Wait for variables.
  else if (matchLocation(host.videocdn)) {
    await waitForEvent(document, 'DOMContentLoaded');
    const videojs = await waitFor(() => win.videojs, 10000);
    videojs.deregisterPlugin('vast');
    const player = win.player = await waitFor(() => videojs.getAllPlayers()[0], 10000);
    player.activePlugins_.vast = false;
    player.playbackRates(playSpeeds); // TODO figure out why setting playbackRates doesn't work
    const options = win.options = player.options({ playbackRates: playSpeeds });
  }
  // VideoSeed: PlayerJS
  // Configs passed to Playerjs constructor.
  else if (matchLocation(host.videoseed)) {
    overrideFunction(win, 'Playerjs', (Playerjs, opts) => new Playerjs(assignDeep(opts, configPlayerJS)));
    await waitFor(() => win.player, 10000);
    fixPlayerJS(win.player);
  }
  // Rezka: PlayerJS
  // Configs provided as `var` variables. Override assignments.
  else if (matchLocation(host.hdrezka)) {
    overrideProperty(win, 'CDNPlayerInfo', v => assignDeep(v, { preroll: "", midroll: "[]" }));
  }
  // Unknown domain
  // TODO: Try guessing provider and/or read ReYohoho's config.
  else {
    console.warn("Unexpected domain");
  }
})();