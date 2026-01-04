// ==UserScript==
// @name            Youtube Auto Play Unwatched Videos in search results.
// @name:ar         تشغيل تلقائي للفيديوهات غير المشاهدة في نتائج البحث على يوتيوب.
// @name:zh         YouTube 自动播放搜索结果中的未观看视频。
// @name:fr         Lecture automatique des vidéos non regardées dans les résultats de recherche YouTube.
// @name:ru         Автоматическое воспроизведение непросмотренных видео в результатах поиска YouTube.
// @name:es         Reproducción automática de videos no vistos en los resultados de búsqueda de YouTube.
// @namespace       snomiao@gmail.com
// @match           https://www.youtube.com/*
// @grant           none
// @version         1.1.1
// @author          snomiao@gmail.com
// @supportURL      https://github.com/snomiao/youtube-unwatched-playlist
// @supportURL      https://gist.github.com/snomiao/e01612efad527a08c5aec327889c0d2f
// @description     Automatically Play all unwatched search results in a queue, useful to learn language from randomly videos by your everyday.
// @description:ar  تشغيل تلقائي لجميع نتائج البحث غير المشاهدة في قائمة انتظار، مفيد لتعلم اللغة من الفيديوهات العشوائية يومياً.
// @description:zh  自动以队列方式播放所有未观看的搜索结果，有助于通过随机视频学习语言。
// @description:fr  Joue automatiquement toutes les vidéos non regardées dans les résultats de recherche en file d'attente, utile pour apprendre une langue à partir de vidéos aléatoires au quotidien.
// @description:ru  Автоматически воспроизводит все непросмотренные результаты поиска в очереди, полезно для изучения языка из случайных видео каждый день.
// @description:es  Reproduce automáticamente todos los resultados de búsqueda no vistos en una cola, útil para aprender idiomas de videos aleatorios todos los días.
// @downloadURL https://update.greasyfork.org/scripts/529565/Youtube%20Auto%20Play%20Unwatched%20Videos%20in%20search%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/529565/Youtube%20Auto%20Play%20Unwatched%20Videos%20in%20search%20results.meta.js
// ==/UserScript==

const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const tap =
  (fn, ...rest) =>
  (value) => (fn(value, ...rest), value);
const waitFor = async (fn) =>
  (await fn()) ||
  (await new Promise((r) => setTimeout(() => r(waitFor(fn)), 200)));
const waitForFallingEdge = async (fn) =>
  (await waitFor(fn)) && (await waitFor(async () => !(await fn())));
const timeLog =
  (fn, name = fn.name ?? String(fn)) =>
  async () => {
    console.log(`${name}: start`);
    console.time(name);
    await fn().finally(() => console.timeEnd(name));
  };

const clearQueue = async () =>
  $$(".ytp-miniplayer-close-button")
    .filter((e) => e.checkVisibility())
    .map(tap((e) => e.click()))
    .at(0) &&
  (await waitForFallingEdge(() =>
    $$("button[aria-label='Close player']")
      .filter((e) => e.checkVisibility())
      .map(tap((e) => e.click()))
      .at(0),
  )) &&
  (await waitForFallingEdge(() =>
    $$("tp-yt-paper-toast")
      .filter((e) => e.textContent.match(/Queue cleared/))
      .filter((e) => e.checkVisibility())
      .at(0),
  ));

const clickUnwatched = async () =>
  // wait for filters btn
  ((await waitFor(() =>
    $$("[role=text]")
      .filter((e) => e.textContent.match(/Filters/))
      ?.at(0),
  )) &&
    // return if already unwatched
    $$("button[aria-selected=true]")
      .filter((e) => e.textContent.match(/Unwatched|未視聴/))
      ?.at(0)) ||
  // check unwatched btn and click it
  ($$("button")
    .filter((e) => e.textContent.match(/Unwatched|未視聴/))
    .map(tap((e) => e.click()))
    .at(0) &&
    // if exist, wait for reload and already unwatched
    (await waitForFallingEdge(
      () => $$("ytd-search[continuation-is-reloading]")[0],
    )) &&
    (await waitFor(() =>
      $$("button[aria-selected=true]")
        .filter((e) => e.textContent.match(/Unwatched|未視聴/))
        ?.at(0),
    )));

const reset = () =>
  $$("ytd-menu-renderer>*>button").forEach((e) => {
    e.style.background = "";
  });

const clickDotsAndGetNextMenuBtns = async () =>
  $$("ytd-menu-renderer>*>button")
    .filter((e) => e.style.background !== "yellow")
    .slice(0, 1)
    .map(
      tap((e) =>
        console.log(
          "video menu btn",
          e.parentElement.parentElement.parentElement.parentElement.textContent
            .replace(/\s+/g, "")
            .trim(),
          e,
        ),
      ),
    )
    .map(
      tap((e) => {
        e.style.background = "yellow";
      }),
    )
    .map(tap((e) => e.click()))
    .at(0) &&
  (await waitFor(() =>
    $$(".ytd-menu-popup-renderer")
      .filter((e) => e?.checkVisibility())
      .at(0),
  )) &&
  $$(".ytd-menu-popup-renderer[role=menuitem]");

const clickMenuItemForAllVideos = async (action) =>
  (await clickDotsAndGetNextMenuBtns())
    ?.filter((btn) => btn.textContent.match(action))
    ?.filter((btn) => btn?.checkVisibility())
    .slice(0, 1)
    .map(tap((e) => e.click()))
    .map(tap((e) => console.log("action btn", e)))
    // .map(() => waitFor(() => !e?.checkVisibility())) // wait for disapeared
    .at(0) && (await clickMenuItemForAllVideos(action));
// ?.then((e) => e && clickMenuItemForAllVideos(action)); // recursive

const addAllToQueue = async () =>
  (await clickMenuItemForAllVideos("Add to queue")) &&
  (await waitForFallingEdge(() =>
    $$("tp-yt-paper-toast")
      .filter((e) => e.textContent.match(/Added to Queue/))
      .filter((e) => e.checkVisibility())
      .at(0),
  ));

const playIt = async () =>
  (await waitFor(() =>
    $$(
      "button.ytp-play-button.ytp-button.ytp-play-button-playlist[data-title-no-tooltip=Play]",
    )
      .filter((e) => e.checkVisibility())
      .map(tap((e) => e.click()))
      .at(0),
  )) &&
  (await waitFor(
    () =>
      !$$(
        "button.ytp-play-button.ytp-button.ytp-play-button-playlist[data-title-no-tooltip=Play]",
      )
        .filter((e) => e.checkVisibility())
        .at(0),
  ));

const expandIt = async () =>
  await waitFor(() =>
    $$(
      'button[aria-keyshortcuts="i"]', // play
    )
      .filter((e) => e.checkVisibility())
      .map(tap((e) => e.click()))
      .at(0),
  );

const onPageFinished = async () => {
  if (!location.pathname.match(/^\/results/)) return;

  reset();
  await timeLog(clickUnwatched)();
  await sleep(1000);
  await timeLog(clearQueue)();
  await timeLog(addAllToQueue)();
  // ensure its playing
  await timeLog(playIt)();
  await timeLog(expandIt)();
};

const throttled = (ms, fn, last = 0) => {
  return () => {
    if (last + ms >= Date.now()) return; // skip if ran recently
    last = +Infinity; // lock so only one instance will be running
    return fn().finally(() => {
      last = Date.now();
    });
  };
};

const main = throttled(200, onPageFinished);
const ac = new AbortController();
globalThis.YAPU_ac?.abort();
globalThis.YAPU_ac = ac;
const signal = ac.signal;
document.addEventListener("yt-page-data-updated", main, {
  signal,
  capture: false,
});
document.addEventListener("yt-navigate-finish", main, {
  signal,
  capture: false,
});
document.addEventListener("spfdone", main, { signal, capture: false });
main();
