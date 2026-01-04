// ==UserScript==
// @name           Pxer: the tool for pixiv.net
// @name:zh-CN     像素猎手: Pixiv 批量下载工具
// @name:en-US     Pxer: the tool for pixiv.net
// @name:ja-JP     Pxer: Pixiv に向くクローラー
// @description    Maybe the best tool for pixiv.net for capture pictures
// @description:zh-CN 可能是目前最好用的P站批量抓图工具
// @description:en-US Maybe the best tool for pixiv.net for capture pictures
// @description:ja-JP Pixiv の全てのツールで一番使いやすいバッチキャプチャーソフトかもしれない
// @icon           https://pxer-app.pea3nut.org/public/favicon.ico
// @version        7.1.0
// @namespace      http://pxer.pea3nut.org/sfp
// @homepageURL    http://pxer.pea3nut.org/
// @supportURL     https://github.com/FoXZilla/Pxer/issues/new/choose
// @author         pea3nut / eternal-flame-AD
// @license        MIT
// @grant          none
// @noframes
// @require        https://cdn.jsdelivr.net/npm/vue@2.6/dist/vue.min.js
// @include        https://www.pixiv.net*
// @include        http://www.pixiv.net**
// @downloadURL https://update.greasyfork.org/scripts/467206/Pxer%3A%20the%20tool%20for%20pixivnet.user.js
// @updateURL https://update.greasyfork.org/scripts/467206/Pxer%3A%20the%20tool%20for%20pixivnet.meta.js
// ==/UserScript==
javascript: void(function() {

window['PXER_URL'] = 'https://pxer-app.pea3nut.org/';
window['PXER_MODE'] = 'sfp';

window["pxer"] = window["pxer"] || {};
pxer.util = pxer.util || {};
pxer.util.afterLoad = function (fn) {
  if (document.readyState !== "loading") {
    setTimeout(fn);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
};
pxer.util.compile = function (str, scope = window) {
  let matchResult = null;
  while ((matchResult = str.match(/{{\s*([\w_]+)\s*}}/))) {
    str = str.replace(matchResult[0], scope[matchResult[1]]);
  }
  return str;
};
pxer.util.set = function (obj, key, val) {
  const keys = key.split(".");
  let pointer = obj;
  for (let i = 0; i < keys.length; i++) {
    if (i === keys.length - 1) {
      pointer[keys[i]] = val;
    } else {
      pointer[keys[i]] = pointer[keys[i]] || {};
      pointer = pointer[keys[i]];
    }
  }
};
// @ref https://www.jianshu.com/p/162dad820f48
pxer.util.get = function self(data, f) {
  if (f.substr) f = f.split(/\.|\\|\//);

  if (f.length && data) {
    return self(data[f.shift()], f);
  } else if (!f.length && data) {
    return data;
  } else {
    return "";
  }
};
pxer.util.chunk = function self(data, chunkSize) {
  let R = [];
  for (let i = 0; i < data.length; i += chunkSize)
    R.push(data.slice(i, i + chunkSize));
  return R;
};
pxer.util.addFile = async function (url) {
  const sector = url.includes("?") ? "&" : "?";
  const pxerVersion = /*@auto-fill*/"7.1.0"/*@auto-fill*/

  if (!/^(https?:)?\/\//.test(url)) url = pxer.url + url;
  url = url + sector + `pxer-version=${pxerVersion}`;

  const createScript = () =>
    new Promise(function (resolve, reject) {
      const elt = document.createElement("script");
      elt.addEventListener("error", reject);
      elt.addEventListener("load", resolve);
      elt.addEventListener("load", () => pxer.log("Loaded " + url));
      elt.src = url;
      elt.crossOrigin = "anonymous";
      document.documentElement.appendChild(elt);
      return elt;
    });
  const createCss = () =>
    new Promise(function (resolve) {
      const elt = document.createElement("link");
      elt.rel = "stylesheet";
      elt.href = url;
      document.documentElement.appendChild(elt);
      resolve();
    });
  const createIcon = () =>
    new Promise(function (resolve) {
      pxer.util.afterLoad(() => {
        Array.from(document.querySelectorAll("link[rel*='icon']")).forEach(
          (elt) => (elt.href = url)
        );
      });
      (document.head || document.documentElement).appendChild(
        (function () {
          const elt = document.createElement("link");
          elt.rel = "shortcut icon";
          elt.type = "image/x-icon";
          elt.href = url;
          return elt;
        })()
      );
      resolve();
    });

  const fileFormat = url.match(/\.([^.]+?)(\?.+?)?$/)[1];
  switch (fileFormat) {
    case "js":
      return createScript();
    case "css":
      return createCss();
    case "ico":
      return createIcon();
    case "json":
      return fetch(url).then((res) => res.json());
    default:
      return fetch(url).then((res) => res.text());
  }
};

(async function () {
  window["PXER_URL"] = window["PXER_URL"] || "https://pxer-app.pea3nut.org/";
  window["PXER_MODE"] = window["PXER_MODE"] || "native";
  window["PXER_LANG"] =
    window["PXER_LANG"] ||
    (document.documentElement.lang || window.navigator.language).split("-")[0];

  pxer.url = PXER_URL;
  pxer.mode = PXER_MODE;
  pxer.lang = PXER_LANG;
  pxer.log = (...msg) => console.log("[Pxer]", ...msg);

  switch (PXER_MODE) {
    case "dev":
    case "master":
      // old version doesn't declare "@require vuejs"
      await pxer.util.addFile(
        "https://cdn.jsdelivr.net/npm/vue@2.6/dist/vue.min.js"
      );
    case "native":
      await pxer.util.addFile("native.js");
      break;
    case "local":
      await pxer.util.addFile("src/local.js");
      break;
    case "sfp":
      break;
  }
})().catch(console.error);


// package.json
pxer.util.set(pxer, 'package', {
  "name": "pxer",
  "version": "7.1.0",
  "private": false,
  "scripts": {
    "dev": "npm run build && ws --https --port 18125 --cors.origin=https://www.pixiv.net",
    "build": "sass src/:src/ --no-source-map && node build/build-launcher && node build/build-native && node build/build-sfp",
    "test-build": "ws --directory dist/ --https --port 18125 --cors.origin *",
    "prettier": "prettier --write ."
  },
  "dependencies": {
    "request": "^2.88.0",
    "vue": "^2.6.10"
  },
  "devDependencies": {
    "bootstrap": "^4.6.2",
    "ejs": "^2.7.1",
    "local-web-server": "^3.0.7",
    "sass": "^1.62.1",
    "prettier": "^2.8.8"
  }
}
)
;


// src/view/template.html
pxer.util.set(pxer, 'uiTemplate', `<div id="pxerApp" class="pxer-app">
  <div class="pxer-nav">
    <div class="pn-header">
      <a href="https://github.com/renmu123/Pxer" target="_blank"
        >Pxer <small>{{ pxerVersion }}</small></a
      >
    </div>
    <div v-if="errmsg" class="pn-message" v-text="errmsg">
      oops~ get some error
    </div>
    <div v-if="showAll || canCrawl" class="pn-buttons">
      <div
        v-show="showAll || isRunning || ['ready','re-ready'].includes(state)"
        class="pnb-progress"
      >
        <span
          >{{ finishCount >= 0 ? finishCount : '-' }} / {{ taskCount }}</span
        >
      </div>
      <button
        v-show="showAll || ['ready'].includes(state)"
        class="btn btn-outline-info"
        @click="showTaskOption = !showTaskOption"
      >
        {{ t('button.option') }}
      </button>

      <div v-if="state==='init' || showLoadingButton" id="wave">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
      <button
        v-else-if="canCrawlDirectly"
        class="btn btn-outline-primary"
        @click="crawlDirectly"
      >
        {{ t('button.crawl') }}
      </button>
      <template v-else>
        <button
          v-if="state==='standby'&&showLoadBtn"
          class="btn btn-outline-success"
          @click="load"
        >
          {{ t('button.load') }}
        </button>
        <button
          v-if="state==='ready' || (state==='re-ready'&&pxer.taskList.length)"
          class="btn btn-outline-primary"
          @click="run"
        >
          {{ t('button.crawl') }}
        </button>
        <button v-if="isRunning" class="btn btn-outline-danger" @click="stop">
          {{ t('button.stop') }}
        </button>
        <template v-if="showAll || showFailTaskList.length">
          <button
            class="btn btn-outline-warning"
            @click="showPxerFailWindow=!showPxerFailWindow"
          >
            {{ t('button.successBut') }}
          </button>
          <span
            class="pnb-warn-number"
            v-text="showFailTaskList.length>99?99:showFailTaskList.length"
          ></span>
        </template>
      </template>
    </div>
  </div>

  <div
    v-if="showAll ||(showPxerFailWindow &&showFailTaskList.length)"
    class="pxer-fail"
  >
    <table class="table">
      <thead class="pft-head">
        <tr>
          <td>{{ t('label.pictureId') }}</td>
          <td width="100">{{ t('label.reason') }}</td>
          <td>{{ t('label.way') }}</td>
          <td class="text-right" width="170">
            <button
              class="btn btn-outline-secondary"
              @click="checkedFailWorksList =pxer.failList"
            >
              {{ t('button.selectAll') }}
            </button>
            <button class="btn btn-outline-success" @click="tryCheckedPfi">
              {{ t('button.retryTheSelected') }}
            </button>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pfi of showFailTaskList">
          <td><a :href="pfi.url">{{ pfi.task.id }}</a></td>
          <td v-text="formatFailType(pfi.type)"></td>
          <td v-html="formatFailSolution(pfi.type)"></td>
          <td class="text-right">
            <input
              v-model="checkedFailWorksList"
              :value="pfi"
              type="checkbox"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div
    v-if="showAll ||(showTaskOption&&state==='ready')"
    class="pxer-task-option form-inline"
  >
    <div class="form-group">
      <label class="pcf-title">{{ t('label.onlyGetTop') }}</label>
      <input v-model="taskOption.limit" class="form-control" type="number" />
    </div>
    <div class="form-group">
      <label class="pcf-title">{{ t('label.onlyGetBeforeId') }}</label>
      <input v-model="taskOption.stopId" class="form-control" type="number" />
    </div>
    <div
      class="form-group"
      title="快速模式下速度约快二十倍，但是下载时会出现下载失败的图片，不会实际影响图片"
    >
      <svg
        t="1685161225381"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2338"
        width="18"
        height="18"
      >
        <path
          d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
          p-id="2339"
        ></path>
        <path
          d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7c0-19.7 12.4-37.7 30.9-44.8 59-22.7 97.1-74.7 97.1-132.5 0.1-39.3-17.1-76-48.3-103.3z"
          p-id="2340"
        ></path>
        <path
          d="M512 732m-40 0a40 40 0 1 0 80 0 40 40 0 1 0-80 0Z"
          p-id="2341"
        ></path>
      </svg>
      <label class="pcf-title">快速模式：</label>
      <input
        v-model="taskOption.isQuick"
        class="form-control"
        type="checkbox"
      />
    </div>
    <div class="form-group ptp-buttons">
      <button class="btn btn-outline-success" @click="useTaskOption">
        {{ t('button.apply') }}
      </button>
    </div>
  </div>

  <div v-if="showAll ||['finish'].indexOf(state)!==-1" class="pxer-print">
    <div class="pp-filter pxer-class-fieldset">
      <div class="ppf-title pcf-title">{{ t('title.filterOptions') }}</div>
      <div class="ppf-form">
        <div class="form-row">
          <div class="form-row">
            <template v-if="!taskOption.isQuick">
              <div class="form-group col">
                <label>{{ t('label.likeCount') }} ≥</label>
                <input
                  v-model.number="pxer.pfConfig.rated"
                  class="form-control"
                  type="number"
                />
              </div>
              <div class="form-group col">
                <label>{{ t('label.viewCount') }} ≥</label>
                <input
                  v-model.number="pxer.pfConfig.view"
                  class="form-control"
                  type="number"
                />
              </div>
              <div class="form-group col">
                <label>{{ t('label.likeProportion') }} ≥</label>
                <input
                  v-model.number="pxer.pfConfig.rated_pro"
                  :placeholder="t('phrase.likeProportion')"
                  class="form-control"
                  type="number"
                />
              </div>
            </template>
          </div>
        </div>
        <div class="card ppf-tag-card">
          <div class="card-header">
            {{ t('title.filterByTag') }}
            <div class="float-right">
              <span class="badge badge-secondary"
                >{{ t('label.whatever') }}</span
              >
              <span class="badge badge-danger">{{ t('label.exclude') }}</span>
              <span class="badge badge-success"
                >{{ t('label.mustInclude') }}</span
              >
            </div>
          </div>
          <div
            :style="tagFilterFolded ? 'height: 500px' : ''"
            class="card-body"
          >
            <button
              v-for="tagName in tagInfo.tags"
              :class="countTagTheme(tagName)"
              class="btn btn-sm ppf-tag"
              @click="onTagClick(tagName)"
              @dblclick.stop
            >
              {{ tagName }}
              <span class="badge badge-light"
                >{{ tagInfo.count[tagName] }}</span
              >
            </button>
            <div
              v-if="tagFilterFolded"
              class="ppf-show-all-tag"
              @click="showAllTagFilter = true"
            >
              {{ t('button.showAll') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pp-print pxer-class-fieldset">
      <div class="ppp-title pcf-title">{{ t('title.printOptions') }}</div>
      <div class="ppp-form">
        <div class="form-group">
          <label>{{ t('label.singleIllust') }}</label>
          <select v-model="pxer.ppConfig.illust_single" class="form-control">
            <option value="max">{{ t('option.max') }}</option>
            <option value="600p">600p</option>
            <option value="no">{{ t('option.no') }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>{{ t('label.multipleIllust') }}</label>
          <select v-model="pxer.ppConfig.illust_multiple" class="form-control">
            <option value="max">{{ t('option.max') }}</option>
            <option value="1200p">1200p</option>
            <option value="cover_600p">{{ t('option.cover600p') }}</option>
            <option value="no">{{ t('option.no') }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>{{ t('label.singleManga') }}</label>
          <select v-model="pxer.ppConfig.manga_single" class="form-control">
            <option value="max">{{ t('option.max') }}</option>
            <option value="600p">600p</option>
            <option value="no">{{ t('option.no') }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>{{ t('label.multipleManga') }}</label>
          <select v-model="pxer.ppConfig.manga_multiple" class="form-control">
            <option value="max">{{ t('option.max') }}</option>
            <option value="1200p">1200p</option>
            <option value="cover_600p">{{ t('option.cover600p') }}</option>
            <option value="no">{{ t('option.no') }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>{{ t('label.ugoira') }}</label>
          <select v-model="printConfigUgoira" class="form-control">
            <option value="max-no">{{ t('option.ugoiraMax') }}</option>
            <option value="600p-no">{{ t('option.ugoira600p') }}</option>
            <option value="max-yes">
              {{ t('option.ugoiraMax') }} + {{ t('option.ugoiraConfig') }}
            </option>
            <option value="600p-yes">
              {{ t('option.ugoira600p') }} + {{ t('option.ugoiraConfig') }}
            </option>
            <option value="no-no">{{ t('option.no') }}</option>
          </select>
        </div>
        <div class="pppf-buttons">
          <p v-if="taskInfo" class="pppfb-msg" v-html="taskInfo"></p>
          <button class="btn btn-outline-info" @click="count">
            {{ t('button.preview') }}
          </button>
          <button class="btn btn-outline-success" @click="printWorks">
            {{ t('button.print') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
`)
;


// src/view/style.css
document.documentElement.appendChild(
    document.createElement('style')
).innerHTML = `.pxer-app {
  /*!
   * Bootstrap Grid v4.6.2 (https://getbootstrap.com/)
   * Copyright 2011-2022 The Bootstrap Authors
   * Copyright 2011-2022 Twitter, Inc.
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   */
  max-width: 970px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  color: #212529;
  font-size: 14px;
}
.pxer-app html {
  box-sizing: border-box;
  -ms-overflow-style: scrollbar;
}
.pxer-app *,
.pxer-app *::before,
.pxer-app *::after {
  box-sizing: inherit;
}
.pxer-app .container,
.pxer-app .container-fluid,
.pxer-app .container-xl,
.pxer-app .container-lg,
.pxer-app .container-md,
.pxer-app .container-sm {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}
@media (min-width: 576px) {
  .pxer-app .container-sm, .pxer-app .container {
    max-width: 540px;
  }
}
@media (min-width: 768px) {
  .pxer-app .container-md, .pxer-app .container-sm, .pxer-app .container {
    max-width: 720px;
  }
}
@media (min-width: 992px) {
  .pxer-app .container-lg, .pxer-app .container-md, .pxer-app .container-sm, .pxer-app .container {
    max-width: 960px;
  }
}
@media (min-width: 1200px) {
  .pxer-app .container-xl, .pxer-app .container-lg, .pxer-app .container-md, .pxer-app .container-sm, .pxer-app .container {
    max-width: 1140px;
  }
}
.pxer-app .row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}
.pxer-app .no-gutters {
  margin-right: 0;
  margin-left: 0;
}
.pxer-app .no-gutters > .col,
.pxer-app .no-gutters > [class*=col-] {
  padding-right: 0;
  padding-left: 0;
}
.pxer-app .col-xl,
.pxer-app .col-xl-auto, .pxer-app .col-xl-12, .pxer-app .col-xl-11, .pxer-app .col-xl-10, .pxer-app .col-xl-9, .pxer-app .col-xl-8, .pxer-app .col-xl-7, .pxer-app .col-xl-6, .pxer-app .col-xl-5, .pxer-app .col-xl-4, .pxer-app .col-xl-3, .pxer-app .col-xl-2, .pxer-app .col-xl-1, .pxer-app .col-lg,
.pxer-app .col-lg-auto, .pxer-app .col-lg-12, .pxer-app .col-lg-11, .pxer-app .col-lg-10, .pxer-app .col-lg-9, .pxer-app .col-lg-8, .pxer-app .col-lg-7, .pxer-app .col-lg-6, .pxer-app .col-lg-5, .pxer-app .col-lg-4, .pxer-app .col-lg-3, .pxer-app .col-lg-2, .pxer-app .col-lg-1, .pxer-app .col-md,
.pxer-app .col-md-auto, .pxer-app .col-md-12, .pxer-app .col-md-11, .pxer-app .col-md-10, .pxer-app .col-md-9, .pxer-app .col-md-8, .pxer-app .col-md-7, .pxer-app .col-md-6, .pxer-app .col-md-5, .pxer-app .col-md-4, .pxer-app .col-md-3, .pxer-app .col-md-2, .pxer-app .col-md-1, .pxer-app .col-sm,
.pxer-app .col-sm-auto, .pxer-app .col-sm-12, .pxer-app .col-sm-11, .pxer-app .col-sm-10, .pxer-app .col-sm-9, .pxer-app .col-sm-8, .pxer-app .col-sm-7, .pxer-app .col-sm-6, .pxer-app .col-sm-5, .pxer-app .col-sm-4, .pxer-app .col-sm-3, .pxer-app .col-sm-2, .pxer-app .col-sm-1, .pxer-app .col,
.pxer-app .col-auto, .pxer-app .col-12, .pxer-app .col-11, .pxer-app .col-10, .pxer-app .col-9, .pxer-app .col-8, .pxer-app .col-7, .pxer-app .col-6, .pxer-app .col-5, .pxer-app .col-4, .pxer-app .col-3, .pxer-app .col-2, .pxer-app .col-1 {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}
.pxer-app .col {
  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%;
}
.pxer-app .row-cols-1 > * {
  flex: 0 0 100%;
  max-width: 100%;
}
.pxer-app .row-cols-2 > * {
  flex: 0 0 50%;
  max-width: 50%;
}
.pxer-app .row-cols-3 > * {
  flex: 0 0 33.3333333333%;
  max-width: 33.3333333333%;
}
.pxer-app .row-cols-4 > * {
  flex: 0 0 25%;
  max-width: 25%;
}
.pxer-app .row-cols-5 > * {
  flex: 0 0 20%;
  max-width: 20%;
}
.pxer-app .row-cols-6 > * {
  flex: 0 0 16.6666666667%;
  max-width: 16.6666666667%;
}
.pxer-app .col-auto {
  flex: 0 0 auto;
  width: auto;
  max-width: 100%;
}
.pxer-app .col-1 {
  flex: 0 0 8.33333333%;
  max-width: 8.33333333%;
}
.pxer-app .col-2 {
  flex: 0 0 16.66666667%;
  max-width: 16.66666667%;
}
.pxer-app .col-3 {
  flex: 0 0 25%;
  max-width: 25%;
}
.pxer-app .col-4 {
  flex: 0 0 33.33333333%;
  max-width: 33.33333333%;
}
.pxer-app .col-5 {
  flex: 0 0 41.66666667%;
  max-width: 41.66666667%;
}
.pxer-app .col-6 {
  flex: 0 0 50%;
  max-width: 50%;
}
.pxer-app .col-7 {
  flex: 0 0 58.33333333%;
  max-width: 58.33333333%;
}
.pxer-app .col-8 {
  flex: 0 0 66.66666667%;
  max-width: 66.66666667%;
}
.pxer-app .col-9 {
  flex: 0 0 75%;
  max-width: 75%;
}
.pxer-app .col-10 {
  flex: 0 0 83.33333333%;
  max-width: 83.33333333%;
}
.pxer-app .col-11 {
  flex: 0 0 91.66666667%;
  max-width: 91.66666667%;
}
.pxer-app .col-12 {
  flex: 0 0 100%;
  max-width: 100%;
}
.pxer-app .order-first {
  order: -1;
}
.pxer-app .order-last {
  order: 13;
}
.pxer-app .order-0 {
  order: 0;
}
.pxer-app .order-1 {
  order: 1;
}
.pxer-app .order-2 {
  order: 2;
}
.pxer-app .order-3 {
  order: 3;
}
.pxer-app .order-4 {
  order: 4;
}
.pxer-app .order-5 {
  order: 5;
}
.pxer-app .order-6 {
  order: 6;
}
.pxer-app .order-7 {
  order: 7;
}
.pxer-app .order-8 {
  order: 8;
}
.pxer-app .order-9 {
  order: 9;
}
.pxer-app .order-10 {
  order: 10;
}
.pxer-app .order-11 {
  order: 11;
}
.pxer-app .order-12 {
  order: 12;
}
.pxer-app .offset-1 {
  margin-left: 8.33333333%;
}
.pxer-app .offset-2 {
  margin-left: 16.66666667%;
}
.pxer-app .offset-3 {
  margin-left: 25%;
}
.pxer-app .offset-4 {
  margin-left: 33.33333333%;
}
.pxer-app .offset-5 {
  margin-left: 41.66666667%;
}
.pxer-app .offset-6 {
  margin-left: 50%;
}
.pxer-app .offset-7 {
  margin-left: 58.33333333%;
}
.pxer-app .offset-8 {
  margin-left: 66.66666667%;
}
.pxer-app .offset-9 {
  margin-left: 75%;
}
.pxer-app .offset-10 {
  margin-left: 83.33333333%;
}
.pxer-app .offset-11 {
  margin-left: 91.66666667%;
}
@media (min-width: 576px) {
  .pxer-app .col-sm {
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
  }
  .pxer-app .row-cols-sm-1 > * {
    flex: 0 0 100%;
    max-width: 100%;
  }
  .pxer-app .row-cols-sm-2 > * {
    flex: 0 0 50%;
    max-width: 50%;
  }
  .pxer-app .row-cols-sm-3 > * {
    flex: 0 0 33.3333333333%;
    max-width: 33.3333333333%;
  }
  .pxer-app .row-cols-sm-4 > * {
    flex: 0 0 25%;
    max-width: 25%;
  }
  .pxer-app .row-cols-sm-5 > * {
    flex: 0 0 20%;
    max-width: 20%;
  }
  .pxer-app .row-cols-sm-6 > * {
    flex: 0 0 16.6666666667%;
    max-width: 16.6666666667%;
  }
  .pxer-app .col-sm-auto {
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
  }
  .pxer-app .col-sm-1 {
    flex: 0 0 8.33333333%;
    max-width: 8.33333333%;
  }
  .pxer-app .col-sm-2 {
    flex: 0 0 16.66666667%;
    max-width: 16.66666667%;
  }
  .pxer-app .col-sm-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }
  .pxer-app .col-sm-4 {
    flex: 0 0 33.33333333%;
    max-width: 33.33333333%;
  }
  .pxer-app .col-sm-5 {
    flex: 0 0 41.66666667%;
    max-width: 41.66666667%;
  }
  .pxer-app .col-sm-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
  .pxer-app .col-sm-7 {
    flex: 0 0 58.33333333%;
    max-width: 58.33333333%;
  }
  .pxer-app .col-sm-8 {
    flex: 0 0 66.66666667%;
    max-width: 66.66666667%;
  }
  .pxer-app .col-sm-9 {
    flex: 0 0 75%;
    max-width: 75%;
  }
  .pxer-app .col-sm-10 {
    flex: 0 0 83.33333333%;
    max-width: 83.33333333%;
  }
  .pxer-app .col-sm-11 {
    flex: 0 0 91.66666667%;
    max-width: 91.66666667%;
  }
  .pxer-app .col-sm-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  .pxer-app .order-sm-first {
    order: -1;
  }
  .pxer-app .order-sm-last {
    order: 13;
  }
  .pxer-app .order-sm-0 {
    order: 0;
  }
  .pxer-app .order-sm-1 {
    order: 1;
  }
  .pxer-app .order-sm-2 {
    order: 2;
  }
  .pxer-app .order-sm-3 {
    order: 3;
  }
  .pxer-app .order-sm-4 {
    order: 4;
  }
  .pxer-app .order-sm-5 {
    order: 5;
  }
  .pxer-app .order-sm-6 {
    order: 6;
  }
  .pxer-app .order-sm-7 {
    order: 7;
  }
  .pxer-app .order-sm-8 {
    order: 8;
  }
  .pxer-app .order-sm-9 {
    order: 9;
  }
  .pxer-app .order-sm-10 {
    order: 10;
  }
  .pxer-app .order-sm-11 {
    order: 11;
  }
  .pxer-app .order-sm-12 {
    order: 12;
  }
  .pxer-app .offset-sm-0 {
    margin-left: 0;
  }
  .pxer-app .offset-sm-1 {
    margin-left: 8.33333333%;
  }
  .pxer-app .offset-sm-2 {
    margin-left: 16.66666667%;
  }
  .pxer-app .offset-sm-3 {
    margin-left: 25%;
  }
  .pxer-app .offset-sm-4 {
    margin-left: 33.33333333%;
  }
  .pxer-app .offset-sm-5 {
    margin-left: 41.66666667%;
  }
  .pxer-app .offset-sm-6 {
    margin-left: 50%;
  }
  .pxer-app .offset-sm-7 {
    margin-left: 58.33333333%;
  }
  .pxer-app .offset-sm-8 {
    margin-left: 66.66666667%;
  }
  .pxer-app .offset-sm-9 {
    margin-left: 75%;
  }
  .pxer-app .offset-sm-10 {
    margin-left: 83.33333333%;
  }
  .pxer-app .offset-sm-11 {
    margin-left: 91.66666667%;
  }
}
@media (min-width: 768px) {
  .pxer-app .col-md {
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
  }
  .pxer-app .row-cols-md-1 > * {
    flex: 0 0 100%;
    max-width: 100%;
  }
  .pxer-app .row-cols-md-2 > * {
    flex: 0 0 50%;
    max-width: 50%;
  }
  .pxer-app .row-cols-md-3 > * {
    flex: 0 0 33.3333333333%;
    max-width: 33.3333333333%;
  }
  .pxer-app .row-cols-md-4 > * {
    flex: 0 0 25%;
    max-width: 25%;
  }
  .pxer-app .row-cols-md-5 > * {
    flex: 0 0 20%;
    max-width: 20%;
  }
  .pxer-app .row-cols-md-6 > * {
    flex: 0 0 16.6666666667%;
    max-width: 16.6666666667%;
  }
  .pxer-app .col-md-auto {
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
  }
  .pxer-app .col-md-1 {
    flex: 0 0 8.33333333%;
    max-width: 8.33333333%;
  }
  .pxer-app .col-md-2 {
    flex: 0 0 16.66666667%;
    max-width: 16.66666667%;
  }
  .pxer-app .col-md-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }
  .pxer-app .col-md-4 {
    flex: 0 0 33.33333333%;
    max-width: 33.33333333%;
  }
  .pxer-app .col-md-5 {
    flex: 0 0 41.66666667%;
    max-width: 41.66666667%;
  }
  .pxer-app .col-md-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
  .pxer-app .col-md-7 {
    flex: 0 0 58.33333333%;
    max-width: 58.33333333%;
  }
  .pxer-app .col-md-8 {
    flex: 0 0 66.66666667%;
    max-width: 66.66666667%;
  }
  .pxer-app .col-md-9 {
    flex: 0 0 75%;
    max-width: 75%;
  }
  .pxer-app .col-md-10 {
    flex: 0 0 83.33333333%;
    max-width: 83.33333333%;
  }
  .pxer-app .col-md-11 {
    flex: 0 0 91.66666667%;
    max-width: 91.66666667%;
  }
  .pxer-app .col-md-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  .pxer-app .order-md-first {
    order: -1;
  }
  .pxer-app .order-md-last {
    order: 13;
  }
  .pxer-app .order-md-0 {
    order: 0;
  }
  .pxer-app .order-md-1 {
    order: 1;
  }
  .pxer-app .order-md-2 {
    order: 2;
  }
  .pxer-app .order-md-3 {
    order: 3;
  }
  .pxer-app .order-md-4 {
    order: 4;
  }
  .pxer-app .order-md-5 {
    order: 5;
  }
  .pxer-app .order-md-6 {
    order: 6;
  }
  .pxer-app .order-md-7 {
    order: 7;
  }
  .pxer-app .order-md-8 {
    order: 8;
  }
  .pxer-app .order-md-9 {
    order: 9;
  }
  .pxer-app .order-md-10 {
    order: 10;
  }
  .pxer-app .order-md-11 {
    order: 11;
  }
  .pxer-app .order-md-12 {
    order: 12;
  }
  .pxer-app .offset-md-0 {
    margin-left: 0;
  }
  .pxer-app .offset-md-1 {
    margin-left: 8.33333333%;
  }
  .pxer-app .offset-md-2 {
    margin-left: 16.66666667%;
  }
  .pxer-app .offset-md-3 {
    margin-left: 25%;
  }
  .pxer-app .offset-md-4 {
    margin-left: 33.33333333%;
  }
  .pxer-app .offset-md-5 {
    margin-left: 41.66666667%;
  }
  .pxer-app .offset-md-6 {
    margin-left: 50%;
  }
  .pxer-app .offset-md-7 {
    margin-left: 58.33333333%;
  }
  .pxer-app .offset-md-8 {
    margin-left: 66.66666667%;
  }
  .pxer-app .offset-md-9 {
    margin-left: 75%;
  }
  .pxer-app .offset-md-10 {
    margin-left: 83.33333333%;
  }
  .pxer-app .offset-md-11 {
    margin-left: 91.66666667%;
  }
}
@media (min-width: 992px) {
  .pxer-app .col-lg {
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
  }
  .pxer-app .row-cols-lg-1 > * {
    flex: 0 0 100%;
    max-width: 100%;
  }
  .pxer-app .row-cols-lg-2 > * {
    flex: 0 0 50%;
    max-width: 50%;
  }
  .pxer-app .row-cols-lg-3 > * {
    flex: 0 0 33.3333333333%;
    max-width: 33.3333333333%;
  }
  .pxer-app .row-cols-lg-4 > * {
    flex: 0 0 25%;
    max-width: 25%;
  }
  .pxer-app .row-cols-lg-5 > * {
    flex: 0 0 20%;
    max-width: 20%;
  }
  .pxer-app .row-cols-lg-6 > * {
    flex: 0 0 16.6666666667%;
    max-width: 16.6666666667%;
  }
  .pxer-app .col-lg-auto {
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
  }
  .pxer-app .col-lg-1 {
    flex: 0 0 8.33333333%;
    max-width: 8.33333333%;
  }
  .pxer-app .col-lg-2 {
    flex: 0 0 16.66666667%;
    max-width: 16.66666667%;
  }
  .pxer-app .col-lg-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }
  .pxer-app .col-lg-4 {
    flex: 0 0 33.33333333%;
    max-width: 33.33333333%;
  }
  .pxer-app .col-lg-5 {
    flex: 0 0 41.66666667%;
    max-width: 41.66666667%;
  }
  .pxer-app .col-lg-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
  .pxer-app .col-lg-7 {
    flex: 0 0 58.33333333%;
    max-width: 58.33333333%;
  }
  .pxer-app .col-lg-8 {
    flex: 0 0 66.66666667%;
    max-width: 66.66666667%;
  }
  .pxer-app .col-lg-9 {
    flex: 0 0 75%;
    max-width: 75%;
  }
  .pxer-app .col-lg-10 {
    flex: 0 0 83.33333333%;
    max-width: 83.33333333%;
  }
  .pxer-app .col-lg-11 {
    flex: 0 0 91.66666667%;
    max-width: 91.66666667%;
  }
  .pxer-app .col-lg-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  .pxer-app .order-lg-first {
    order: -1;
  }
  .pxer-app .order-lg-last {
    order: 13;
  }
  .pxer-app .order-lg-0 {
    order: 0;
  }
  .pxer-app .order-lg-1 {
    order: 1;
  }
  .pxer-app .order-lg-2 {
    order: 2;
  }
  .pxer-app .order-lg-3 {
    order: 3;
  }
  .pxer-app .order-lg-4 {
    order: 4;
  }
  .pxer-app .order-lg-5 {
    order: 5;
  }
  .pxer-app .order-lg-6 {
    order: 6;
  }
  .pxer-app .order-lg-7 {
    order: 7;
  }
  .pxer-app .order-lg-8 {
    order: 8;
  }
  .pxer-app .order-lg-9 {
    order: 9;
  }
  .pxer-app .order-lg-10 {
    order: 10;
  }
  .pxer-app .order-lg-11 {
    order: 11;
  }
  .pxer-app .order-lg-12 {
    order: 12;
  }
  .pxer-app .offset-lg-0 {
    margin-left: 0;
  }
  .pxer-app .offset-lg-1 {
    margin-left: 8.33333333%;
  }
  .pxer-app .offset-lg-2 {
    margin-left: 16.66666667%;
  }
  .pxer-app .offset-lg-3 {
    margin-left: 25%;
  }
  .pxer-app .offset-lg-4 {
    margin-left: 33.33333333%;
  }
  .pxer-app .offset-lg-5 {
    margin-left: 41.66666667%;
  }
  .pxer-app .offset-lg-6 {
    margin-left: 50%;
  }
  .pxer-app .offset-lg-7 {
    margin-left: 58.33333333%;
  }
  .pxer-app .offset-lg-8 {
    margin-left: 66.66666667%;
  }
  .pxer-app .offset-lg-9 {
    margin-left: 75%;
  }
  .pxer-app .offset-lg-10 {
    margin-left: 83.33333333%;
  }
  .pxer-app .offset-lg-11 {
    margin-left: 91.66666667%;
  }
}
@media (min-width: 1200px) {
  .pxer-app .col-xl {
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
  }
  .pxer-app .row-cols-xl-1 > * {
    flex: 0 0 100%;
    max-width: 100%;
  }
  .pxer-app .row-cols-xl-2 > * {
    flex: 0 0 50%;
    max-width: 50%;
  }
  .pxer-app .row-cols-xl-3 > * {
    flex: 0 0 33.3333333333%;
    max-width: 33.3333333333%;
  }
  .pxer-app .row-cols-xl-4 > * {
    flex: 0 0 25%;
    max-width: 25%;
  }
  .pxer-app .row-cols-xl-5 > * {
    flex: 0 0 20%;
    max-width: 20%;
  }
  .pxer-app .row-cols-xl-6 > * {
    flex: 0 0 16.6666666667%;
    max-width: 16.6666666667%;
  }
  .pxer-app .col-xl-auto {
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
  }
  .pxer-app .col-xl-1 {
    flex: 0 0 8.33333333%;
    max-width: 8.33333333%;
  }
  .pxer-app .col-xl-2 {
    flex: 0 0 16.66666667%;
    max-width: 16.66666667%;
  }
  .pxer-app .col-xl-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }
  .pxer-app .col-xl-4 {
    flex: 0 0 33.33333333%;
    max-width: 33.33333333%;
  }
  .pxer-app .col-xl-5 {
    flex: 0 0 41.66666667%;
    max-width: 41.66666667%;
  }
  .pxer-app .col-xl-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
  .pxer-app .col-xl-7 {
    flex: 0 0 58.33333333%;
    max-width: 58.33333333%;
  }
  .pxer-app .col-xl-8 {
    flex: 0 0 66.66666667%;
    max-width: 66.66666667%;
  }
  .pxer-app .col-xl-9 {
    flex: 0 0 75%;
    max-width: 75%;
  }
  .pxer-app .col-xl-10 {
    flex: 0 0 83.33333333%;
    max-width: 83.33333333%;
  }
  .pxer-app .col-xl-11 {
    flex: 0 0 91.66666667%;
    max-width: 91.66666667%;
  }
  .pxer-app .col-xl-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  .pxer-app .order-xl-first {
    order: -1;
  }
  .pxer-app .order-xl-last {
    order: 13;
  }
  .pxer-app .order-xl-0 {
    order: 0;
  }
  .pxer-app .order-xl-1 {
    order: 1;
  }
  .pxer-app .order-xl-2 {
    order: 2;
  }
  .pxer-app .order-xl-3 {
    order: 3;
  }
  .pxer-app .order-xl-4 {
    order: 4;
  }
  .pxer-app .order-xl-5 {
    order: 5;
  }
  .pxer-app .order-xl-6 {
    order: 6;
  }
  .pxer-app .order-xl-7 {
    order: 7;
  }
  .pxer-app .order-xl-8 {
    order: 8;
  }
  .pxer-app .order-xl-9 {
    order: 9;
  }
  .pxer-app .order-xl-10 {
    order: 10;
  }
  .pxer-app .order-xl-11 {
    order: 11;
  }
  .pxer-app .order-xl-12 {
    order: 12;
  }
  .pxer-app .offset-xl-0 {
    margin-left: 0;
  }
  .pxer-app .offset-xl-1 {
    margin-left: 8.33333333%;
  }
  .pxer-app .offset-xl-2 {
    margin-left: 16.66666667%;
  }
  .pxer-app .offset-xl-3 {
    margin-left: 25%;
  }
  .pxer-app .offset-xl-4 {
    margin-left: 33.33333333%;
  }
  .pxer-app .offset-xl-5 {
    margin-left: 41.66666667%;
  }
  .pxer-app .offset-xl-6 {
    margin-left: 50%;
  }
  .pxer-app .offset-xl-7 {
    margin-left: 58.33333333%;
  }
  .pxer-app .offset-xl-8 {
    margin-left: 66.66666667%;
  }
  .pxer-app .offset-xl-9 {
    margin-left: 75%;
  }
  .pxer-app .offset-xl-10 {
    margin-left: 83.33333333%;
  }
  .pxer-app .offset-xl-11 {
    margin-left: 91.66666667%;
  }
}
.pxer-app .d-none {
  display: none !important;
}
.pxer-app .d-inline {
  display: inline !important;
}
.pxer-app .d-inline-block {
  display: inline-block !important;
}
.pxer-app .d-block {
  display: block !important;
}
.pxer-app .d-table {
  display: table !important;
}
.pxer-app .d-table-row {
  display: table-row !important;
}
.pxer-app .d-table-cell {
  display: table-cell !important;
}
.pxer-app .d-flex {
  display: flex !important;
}
.pxer-app .d-inline-flex {
  display: inline-flex !important;
}
@media (min-width: 576px) {
  .pxer-app .d-sm-none {
    display: none !important;
  }
  .pxer-app .d-sm-inline {
    display: inline !important;
  }
  .pxer-app .d-sm-inline-block {
    display: inline-block !important;
  }
  .pxer-app .d-sm-block {
    display: block !important;
  }
  .pxer-app .d-sm-table {
    display: table !important;
  }
  .pxer-app .d-sm-table-row {
    display: table-row !important;
  }
  .pxer-app .d-sm-table-cell {
    display: table-cell !important;
  }
  .pxer-app .d-sm-flex {
    display: flex !important;
  }
  .pxer-app .d-sm-inline-flex {
    display: inline-flex !important;
  }
}
@media (min-width: 768px) {
  .pxer-app .d-md-none {
    display: none !important;
  }
  .pxer-app .d-md-inline {
    display: inline !important;
  }
  .pxer-app .d-md-inline-block {
    display: inline-block !important;
  }
  .pxer-app .d-md-block {
    display: block !important;
  }
  .pxer-app .d-md-table {
    display: table !important;
  }
  .pxer-app .d-md-table-row {
    display: table-row !important;
  }
  .pxer-app .d-md-table-cell {
    display: table-cell !important;
  }
  .pxer-app .d-md-flex {
    display: flex !important;
  }
  .pxer-app .d-md-inline-flex {
    display: inline-flex !important;
  }
}
@media (min-width: 992px) {
  .pxer-app .d-lg-none {
    display: none !important;
  }
  .pxer-app .d-lg-inline {
    display: inline !important;
  }
  .pxer-app .d-lg-inline-block {
    display: inline-block !important;
  }
  .pxer-app .d-lg-block {
    display: block !important;
  }
  .pxer-app .d-lg-table {
    display: table !important;
  }
  .pxer-app .d-lg-table-row {
    display: table-row !important;
  }
  .pxer-app .d-lg-table-cell {
    display: table-cell !important;
  }
  .pxer-app .d-lg-flex {
    display: flex !important;
  }
  .pxer-app .d-lg-inline-flex {
    display: inline-flex !important;
  }
}
@media (min-width: 1200px) {
  .pxer-app .d-xl-none {
    display: none !important;
  }
  .pxer-app .d-xl-inline {
    display: inline !important;
  }
  .pxer-app .d-xl-inline-block {
    display: inline-block !important;
  }
  .pxer-app .d-xl-block {
    display: block !important;
  }
  .pxer-app .d-xl-table {
    display: table !important;
  }
  .pxer-app .d-xl-table-row {
    display: table-row !important;
  }
  .pxer-app .d-xl-table-cell {
    display: table-cell !important;
  }
  .pxer-app .d-xl-flex {
    display: flex !important;
  }
  .pxer-app .d-xl-inline-flex {
    display: inline-flex !important;
  }
}
@media print {
  .pxer-app .d-print-none {
    display: none !important;
  }
  .pxer-app .d-print-inline {
    display: inline !important;
  }
  .pxer-app .d-print-inline-block {
    display: inline-block !important;
  }
  .pxer-app .d-print-block {
    display: block !important;
  }
  .pxer-app .d-print-table {
    display: table !important;
  }
  .pxer-app .d-print-table-row {
    display: table-row !important;
  }
  .pxer-app .d-print-table-cell {
    display: table-cell !important;
  }
  .pxer-app .d-print-flex {
    display: flex !important;
  }
  .pxer-app .d-print-inline-flex {
    display: inline-flex !important;
  }
}
.pxer-app .flex-row {
  flex-direction: row !important;
}
.pxer-app .flex-column {
  flex-direction: column !important;
}
.pxer-app .flex-row-reverse {
  flex-direction: row-reverse !important;
}
.pxer-app .flex-column-reverse {
  flex-direction: column-reverse !important;
}
.pxer-app .flex-wrap {
  flex-wrap: wrap !important;
}
.pxer-app .flex-nowrap {
  flex-wrap: nowrap !important;
}
.pxer-app .flex-wrap-reverse {
  flex-wrap: wrap-reverse !important;
}
.pxer-app .flex-fill {
  flex: 1 1 auto !important;
}
.pxer-app .flex-grow-0 {
  flex-grow: 0 !important;
}
.pxer-app .flex-grow-1 {
  flex-grow: 1 !important;
}
.pxer-app .flex-shrink-0 {
  flex-shrink: 0 !important;
}
.pxer-app .flex-shrink-1 {
  flex-shrink: 1 !important;
}
.pxer-app .justify-content-start {
  justify-content: flex-start !important;
}
.pxer-app .justify-content-end {
  justify-content: flex-end !important;
}
.pxer-app .justify-content-center {
  justify-content: center !important;
}
.pxer-app .justify-content-between {
  justify-content: space-between !important;
}
.pxer-app .justify-content-around {
  justify-content: space-around !important;
}
.pxer-app .align-items-start {
  align-items: flex-start !important;
}
.pxer-app .align-items-end {
  align-items: flex-end !important;
}
.pxer-app .align-items-center {
  align-items: center !important;
}
.pxer-app .align-items-baseline {
  align-items: baseline !important;
}
.pxer-app .align-items-stretch {
  align-items: stretch !important;
}
.pxer-app .align-content-start {
  align-content: flex-start !important;
}
.pxer-app .align-content-end {
  align-content: flex-end !important;
}
.pxer-app .align-content-center {
  align-content: center !important;
}
.pxer-app .align-content-between {
  align-content: space-between !important;
}
.pxer-app .align-content-around {
  align-content: space-around !important;
}
.pxer-app .align-content-stretch {
  align-content: stretch !important;
}
.pxer-app .align-self-auto {
  align-self: auto !important;
}
.pxer-app .align-self-start {
  align-self: flex-start !important;
}
.pxer-app .align-self-end {
  align-self: flex-end !important;
}
.pxer-app .align-self-center {
  align-self: center !important;
}
.pxer-app .align-self-baseline {
  align-self: baseline !important;
}
.pxer-app .align-self-stretch {
  align-self: stretch !important;
}
@media (min-width: 576px) {
  .pxer-app .flex-sm-row {
    flex-direction: row !important;
  }
  .pxer-app .flex-sm-column {
    flex-direction: column !important;
  }
  .pxer-app .flex-sm-row-reverse {
    flex-direction: row-reverse !important;
  }
  .pxer-app .flex-sm-column-reverse {
    flex-direction: column-reverse !important;
  }
  .pxer-app .flex-sm-wrap {
    flex-wrap: wrap !important;
  }
  .pxer-app .flex-sm-nowrap {
    flex-wrap: nowrap !important;
  }
  .pxer-app .flex-sm-wrap-reverse {
    flex-wrap: wrap-reverse !important;
  }
  .pxer-app .flex-sm-fill {
    flex: 1 1 auto !important;
  }
  .pxer-app .flex-sm-grow-0 {
    flex-grow: 0 !important;
  }
  .pxer-app .flex-sm-grow-1 {
    flex-grow: 1 !important;
  }
  .pxer-app .flex-sm-shrink-0 {
    flex-shrink: 0 !important;
  }
  .pxer-app .flex-sm-shrink-1 {
    flex-shrink: 1 !important;
  }
  .pxer-app .justify-content-sm-start {
    justify-content: flex-start !important;
  }
  .pxer-app .justify-content-sm-end {
    justify-content: flex-end !important;
  }
  .pxer-app .justify-content-sm-center {
    justify-content: center !important;
  }
  .pxer-app .justify-content-sm-between {
    justify-content: space-between !important;
  }
  .pxer-app .justify-content-sm-around {
    justify-content: space-around !important;
  }
  .pxer-app .align-items-sm-start {
    align-items: flex-start !important;
  }
  .pxer-app .align-items-sm-end {
    align-items: flex-end !important;
  }
  .pxer-app .align-items-sm-center {
    align-items: center !important;
  }
  .pxer-app .align-items-sm-baseline {
    align-items: baseline !important;
  }
  .pxer-app .align-items-sm-stretch {
    align-items: stretch !important;
  }
  .pxer-app .align-content-sm-start {
    align-content: flex-start !important;
  }
  .pxer-app .align-content-sm-end {
    align-content: flex-end !important;
  }
  .pxer-app .align-content-sm-center {
    align-content: center !important;
  }
  .pxer-app .align-content-sm-between {
    align-content: space-between !important;
  }
  .pxer-app .align-content-sm-around {
    align-content: space-around !important;
  }
  .pxer-app .align-content-sm-stretch {
    align-content: stretch !important;
  }
  .pxer-app .align-self-sm-auto {
    align-self: auto !important;
  }
  .pxer-app .align-self-sm-start {
    align-self: flex-start !important;
  }
  .pxer-app .align-self-sm-end {
    align-self: flex-end !important;
  }
  .pxer-app .align-self-sm-center {
    align-self: center !important;
  }
  .pxer-app .align-self-sm-baseline {
    align-self: baseline !important;
  }
  .pxer-app .align-self-sm-stretch {
    align-self: stretch !important;
  }
}
@media (min-width: 768px) {
  .pxer-app .flex-md-row {
    flex-direction: row !important;
  }
  .pxer-app .flex-md-column {
    flex-direction: column !important;
  }
  .pxer-app .flex-md-row-reverse {
    flex-direction: row-reverse !important;
  }
  .pxer-app .flex-md-column-reverse {
    flex-direction: column-reverse !important;
  }
  .pxer-app .flex-md-wrap {
    flex-wrap: wrap !important;
  }
  .pxer-app .flex-md-nowrap {
    flex-wrap: nowrap !important;
  }
  .pxer-app .flex-md-wrap-reverse {
    flex-wrap: wrap-reverse !important;
  }
  .pxer-app .flex-md-fill {
    flex: 1 1 auto !important;
  }
  .pxer-app .flex-md-grow-0 {
    flex-grow: 0 !important;
  }
  .pxer-app .flex-md-grow-1 {
    flex-grow: 1 !important;
  }
  .pxer-app .flex-md-shrink-0 {
    flex-shrink: 0 !important;
  }
  .pxer-app .flex-md-shrink-1 {
    flex-shrink: 1 !important;
  }
  .pxer-app .justify-content-md-start {
    justify-content: flex-start !important;
  }
  .pxer-app .justify-content-md-end {
    justify-content: flex-end !important;
  }
  .pxer-app .justify-content-md-center {
    justify-content: center !important;
  }
  .pxer-app .justify-content-md-between {
    justify-content: space-between !important;
  }
  .pxer-app .justify-content-md-around {
    justify-content: space-around !important;
  }
  .pxer-app .align-items-md-start {
    align-items: flex-start !important;
  }
  .pxer-app .align-items-md-end {
    align-items: flex-end !important;
  }
  .pxer-app .align-items-md-center {
    align-items: center !important;
  }
  .pxer-app .align-items-md-baseline {
    align-items: baseline !important;
  }
  .pxer-app .align-items-md-stretch {
    align-items: stretch !important;
  }
  .pxer-app .align-content-md-start {
    align-content: flex-start !important;
  }
  .pxer-app .align-content-md-end {
    align-content: flex-end !important;
  }
  .pxer-app .align-content-md-center {
    align-content: center !important;
  }
  .pxer-app .align-content-md-between {
    align-content: space-between !important;
  }
  .pxer-app .align-content-md-around {
    align-content: space-around !important;
  }
  .pxer-app .align-content-md-stretch {
    align-content: stretch !important;
  }
  .pxer-app .align-self-md-auto {
    align-self: auto !important;
  }
  .pxer-app .align-self-md-start {
    align-self: flex-start !important;
  }
  .pxer-app .align-self-md-end {
    align-self: flex-end !important;
  }
  .pxer-app .align-self-md-center {
    align-self: center !important;
  }
  .pxer-app .align-self-md-baseline {
    align-self: baseline !important;
  }
  .pxer-app .align-self-md-stretch {
    align-self: stretch !important;
  }
}
@media (min-width: 992px) {
  .pxer-app .flex-lg-row {
    flex-direction: row !important;
  }
  .pxer-app .flex-lg-column {
    flex-direction: column !important;
  }
  .pxer-app .flex-lg-row-reverse {
    flex-direction: row-reverse !important;
  }
  .pxer-app .flex-lg-column-reverse {
    flex-direction: column-reverse !important;
  }
  .pxer-app .flex-lg-wrap {
    flex-wrap: wrap !important;
  }
  .pxer-app .flex-lg-nowrap {
    flex-wrap: nowrap !important;
  }
  .pxer-app .flex-lg-wrap-reverse {
    flex-wrap: wrap-reverse !important;
  }
  .pxer-app .flex-lg-fill {
    flex: 1 1 auto !important;
  }
  .pxer-app .flex-lg-grow-0 {
    flex-grow: 0 !important;
  }
  .pxer-app .flex-lg-grow-1 {
    flex-grow: 1 !important;
  }
  .pxer-app .flex-lg-shrink-0 {
    flex-shrink: 0 !important;
  }
  .pxer-app .flex-lg-shrink-1 {
    flex-shrink: 1 !important;
  }
  .pxer-app .justify-content-lg-start {
    justify-content: flex-start !important;
  }
  .pxer-app .justify-content-lg-end {
    justify-content: flex-end !important;
  }
  .pxer-app .justify-content-lg-center {
    justify-content: center !important;
  }
  .pxer-app .justify-content-lg-between {
    justify-content: space-between !important;
  }
  .pxer-app .justify-content-lg-around {
    justify-content: space-around !important;
  }
  .pxer-app .align-items-lg-start {
    align-items: flex-start !important;
  }
  .pxer-app .align-items-lg-end {
    align-items: flex-end !important;
  }
  .pxer-app .align-items-lg-center {
    align-items: center !important;
  }
  .pxer-app .align-items-lg-baseline {
    align-items: baseline !important;
  }
  .pxer-app .align-items-lg-stretch {
    align-items: stretch !important;
  }
  .pxer-app .align-content-lg-start {
    align-content: flex-start !important;
  }
  .pxer-app .align-content-lg-end {
    align-content: flex-end !important;
  }
  .pxer-app .align-content-lg-center {
    align-content: center !important;
  }
  .pxer-app .align-content-lg-between {
    align-content: space-between !important;
  }
  .pxer-app .align-content-lg-around {
    align-content: space-around !important;
  }
  .pxer-app .align-content-lg-stretch {
    align-content: stretch !important;
  }
  .pxer-app .align-self-lg-auto {
    align-self: auto !important;
  }
  .pxer-app .align-self-lg-start {
    align-self: flex-start !important;
  }
  .pxer-app .align-self-lg-end {
    align-self: flex-end !important;
  }
  .pxer-app .align-self-lg-center {
    align-self: center !important;
  }
  .pxer-app .align-self-lg-baseline {
    align-self: baseline !important;
  }
  .pxer-app .align-self-lg-stretch {
    align-self: stretch !important;
  }
}
@media (min-width: 1200px) {
  .pxer-app .flex-xl-row {
    flex-direction: row !important;
  }
  .pxer-app .flex-xl-column {
    flex-direction: column !important;
  }
  .pxer-app .flex-xl-row-reverse {
    flex-direction: row-reverse !important;
  }
  .pxer-app .flex-xl-column-reverse {
    flex-direction: column-reverse !important;
  }
  .pxer-app .flex-xl-wrap {
    flex-wrap: wrap !important;
  }
  .pxer-app .flex-xl-nowrap {
    flex-wrap: nowrap !important;
  }
  .pxer-app .flex-xl-wrap-reverse {
    flex-wrap: wrap-reverse !important;
  }
  .pxer-app .flex-xl-fill {
    flex: 1 1 auto !important;
  }
  .pxer-app .flex-xl-grow-0 {
    flex-grow: 0 !important;
  }
  .pxer-app .flex-xl-grow-1 {
    flex-grow: 1 !important;
  }
  .pxer-app .flex-xl-shrink-0 {
    flex-shrink: 0 !important;
  }
  .pxer-app .flex-xl-shrink-1 {
    flex-shrink: 1 !important;
  }
  .pxer-app .justify-content-xl-start {
    justify-content: flex-start !important;
  }
  .pxer-app .justify-content-xl-end {
    justify-content: flex-end !important;
  }
  .pxer-app .justify-content-xl-center {
    justify-content: center !important;
  }
  .pxer-app .justify-content-xl-between {
    justify-content: space-between !important;
  }
  .pxer-app .justify-content-xl-around {
    justify-content: space-around !important;
  }
  .pxer-app .align-items-xl-start {
    align-items: flex-start !important;
  }
  .pxer-app .align-items-xl-end {
    align-items: flex-end !important;
  }
  .pxer-app .align-items-xl-center {
    align-items: center !important;
  }
  .pxer-app .align-items-xl-baseline {
    align-items: baseline !important;
  }
  .pxer-app .align-items-xl-stretch {
    align-items: stretch !important;
  }
  .pxer-app .align-content-xl-start {
    align-content: flex-start !important;
  }
  .pxer-app .align-content-xl-end {
    align-content: flex-end !important;
  }
  .pxer-app .align-content-xl-center {
    align-content: center !important;
  }
  .pxer-app .align-content-xl-between {
    align-content: space-between !important;
  }
  .pxer-app .align-content-xl-around {
    align-content: space-around !important;
  }
  .pxer-app .align-content-xl-stretch {
    align-content: stretch !important;
  }
  .pxer-app .align-self-xl-auto {
    align-self: auto !important;
  }
  .pxer-app .align-self-xl-start {
    align-self: flex-start !important;
  }
  .pxer-app .align-self-xl-end {
    align-self: flex-end !important;
  }
  .pxer-app .align-self-xl-center {
    align-self: center !important;
  }
  .pxer-app .align-self-xl-baseline {
    align-self: baseline !important;
  }
  .pxer-app .align-self-xl-stretch {
    align-self: stretch !important;
  }
}
.pxer-app .m-0 {
  margin: 0 !important;
}
.pxer-app .mt-0,
.pxer-app .my-0 {
  margin-top: 0 !important;
}
.pxer-app .mr-0,
.pxer-app .mx-0 {
  margin-right: 0 !important;
}
.pxer-app .mb-0,
.pxer-app .my-0 {
  margin-bottom: 0 !important;
}
.pxer-app .ml-0,
.pxer-app .mx-0 {
  margin-left: 0 !important;
}
.pxer-app .m-1 {
  margin: 0.25rem !important;
}
.pxer-app .mt-1,
.pxer-app .my-1 {
  margin-top: 0.25rem !important;
}
.pxer-app .mr-1,
.pxer-app .mx-1 {
  margin-right: 0.25rem !important;
}
.pxer-app .mb-1,
.pxer-app .my-1 {
  margin-bottom: 0.25rem !important;
}
.pxer-app .ml-1,
.pxer-app .mx-1 {
  margin-left: 0.25rem !important;
}
.pxer-app .m-2 {
  margin: 0.5rem !important;
}
.pxer-app .mt-2,
.pxer-app .my-2 {
  margin-top: 0.5rem !important;
}
.pxer-app .mr-2,
.pxer-app .mx-2 {
  margin-right: 0.5rem !important;
}
.pxer-app .mb-2,
.pxer-app .my-2 {
  margin-bottom: 0.5rem !important;
}
.pxer-app .ml-2,
.pxer-app .mx-2 {
  margin-left: 0.5rem !important;
}
.pxer-app .m-3 {
  margin: 1rem !important;
}
.pxer-app .mt-3,
.pxer-app .my-3 {
  margin-top: 1rem !important;
}
.pxer-app .mr-3,
.pxer-app .mx-3 {
  margin-right: 1rem !important;
}
.pxer-app .mb-3,
.pxer-app .my-3 {
  margin-bottom: 1rem !important;
}
.pxer-app .ml-3,
.pxer-app .mx-3 {
  margin-left: 1rem !important;
}
.pxer-app .m-4 {
  margin: 1.5rem !important;
}
.pxer-app .mt-4,
.pxer-app .my-4 {
  margin-top: 1.5rem !important;
}
.pxer-app .mr-4,
.pxer-app .mx-4 {
  margin-right: 1.5rem !important;
}
.pxer-app .mb-4,
.pxer-app .my-4 {
  margin-bottom: 1.5rem !important;
}
.pxer-app .ml-4,
.pxer-app .mx-4 {
  margin-left: 1.5rem !important;
}
.pxer-app .m-5 {
  margin: 3rem !important;
}
.pxer-app .mt-5,
.pxer-app .my-5 {
  margin-top: 3rem !important;
}
.pxer-app .mr-5,
.pxer-app .mx-5 {
  margin-right: 3rem !important;
}
.pxer-app .mb-5,
.pxer-app .my-5 {
  margin-bottom: 3rem !important;
}
.pxer-app .ml-5,
.pxer-app .mx-5 {
  margin-left: 3rem !important;
}
.pxer-app .p-0 {
  padding: 0 !important;
}
.pxer-app .pt-0,
.pxer-app .py-0 {
  padding-top: 0 !important;
}
.pxer-app .pr-0,
.pxer-app .px-0 {
  padding-right: 0 !important;
}
.pxer-app .pb-0,
.pxer-app .py-0 {
  padding-bottom: 0 !important;
}
.pxer-app .pl-0,
.pxer-app .px-0 {
  padding-left: 0 !important;
}
.pxer-app .p-1 {
  padding: 0.25rem !important;
}
.pxer-app .pt-1,
.pxer-app .py-1 {
  padding-top: 0.25rem !important;
}
.pxer-app .pr-1,
.pxer-app .px-1 {
  padding-right: 0.25rem !important;
}
.pxer-app .pb-1,
.pxer-app .py-1 {
  padding-bottom: 0.25rem !important;
}
.pxer-app .pl-1,
.pxer-app .px-1 {
  padding-left: 0.25rem !important;
}
.pxer-app .p-2 {
  padding: 0.5rem !important;
}
.pxer-app .pt-2,
.pxer-app .py-2 {
  padding-top: 0.5rem !important;
}
.pxer-app .pr-2,
.pxer-app .px-2 {
  padding-right: 0.5rem !important;
}
.pxer-app .pb-2,
.pxer-app .py-2 {
  padding-bottom: 0.5rem !important;
}
.pxer-app .pl-2,
.pxer-app .px-2 {
  padding-left: 0.5rem !important;
}
.pxer-app .p-3 {
  padding: 1rem !important;
}
.pxer-app .pt-3,
.pxer-app .py-3 {
  padding-top: 1rem !important;
}
.pxer-app .pr-3,
.pxer-app .px-3 {
  padding-right: 1rem !important;
}
.pxer-app .pb-3,
.pxer-app .py-3 {
  padding-bottom: 1rem !important;
}
.pxer-app .pl-3,
.pxer-app .px-3 {
  padding-left: 1rem !important;
}
.pxer-app .p-4 {
  padding: 1.5rem !important;
}
.pxer-app .pt-4,
.pxer-app .py-4 {
  padding-top: 1.5rem !important;
}
.pxer-app .pr-4,
.pxer-app .px-4 {
  padding-right: 1.5rem !important;
}
.pxer-app .pb-4,
.pxer-app .py-4 {
  padding-bottom: 1.5rem !important;
}
.pxer-app .pl-4,
.pxer-app .px-4 {
  padding-left: 1.5rem !important;
}
.pxer-app .p-5 {
  padding: 3rem !important;
}
.pxer-app .pt-5,
.pxer-app .py-5 {
  padding-top: 3rem !important;
}
.pxer-app .pr-5,
.pxer-app .px-5 {
  padding-right: 3rem !important;
}
.pxer-app .pb-5,
.pxer-app .py-5 {
  padding-bottom: 3rem !important;
}
.pxer-app .pl-5,
.pxer-app .px-5 {
  padding-left: 3rem !important;
}
.pxer-app .m-n1 {
  margin: -0.25rem !important;
}
.pxer-app .mt-n1,
.pxer-app .my-n1 {
  margin-top: -0.25rem !important;
}
.pxer-app .mr-n1,
.pxer-app .mx-n1 {
  margin-right: -0.25rem !important;
}
.pxer-app .mb-n1,
.pxer-app .my-n1 {
  margin-bottom: -0.25rem !important;
}
.pxer-app .ml-n1,
.pxer-app .mx-n1 {
  margin-left: -0.25rem !important;
}
.pxer-app .m-n2 {
  margin: -0.5rem !important;
}
.pxer-app .mt-n2,
.pxer-app .my-n2 {
  margin-top: -0.5rem !important;
}
.pxer-app .mr-n2,
.pxer-app .mx-n2 {
  margin-right: -0.5rem !important;
}
.pxer-app .mb-n2,
.pxer-app .my-n2 {
  margin-bottom: -0.5rem !important;
}
.pxer-app .ml-n2,
.pxer-app .mx-n2 {
  margin-left: -0.5rem !important;
}
.pxer-app .m-n3 {
  margin: -1rem !important;
}
.pxer-app .mt-n3,
.pxer-app .my-n3 {
  margin-top: -1rem !important;
}
.pxer-app .mr-n3,
.pxer-app .mx-n3 {
  margin-right: -1rem !important;
}
.pxer-app .mb-n3,
.pxer-app .my-n3 {
  margin-bottom: -1rem !important;
}
.pxer-app .ml-n3,
.pxer-app .mx-n3 {
  margin-left: -1rem !important;
}
.pxer-app .m-n4 {
  margin: -1.5rem !important;
}
.pxer-app .mt-n4,
.pxer-app .my-n4 {
  margin-top: -1.5rem !important;
}
.pxer-app .mr-n4,
.pxer-app .mx-n4 {
  margin-right: -1.5rem !important;
}
.pxer-app .mb-n4,
.pxer-app .my-n4 {
  margin-bottom: -1.5rem !important;
}
.pxer-app .ml-n4,
.pxer-app .mx-n4 {
  margin-left: -1.5rem !important;
}
.pxer-app .m-n5 {
  margin: -3rem !important;
}
.pxer-app .mt-n5,
.pxer-app .my-n5 {
  margin-top: -3rem !important;
}
.pxer-app .mr-n5,
.pxer-app .mx-n5 {
  margin-right: -3rem !important;
}
.pxer-app .mb-n5,
.pxer-app .my-n5 {
  margin-bottom: -3rem !important;
}
.pxer-app .ml-n5,
.pxer-app .mx-n5 {
  margin-left: -3rem !important;
}
.pxer-app .m-auto {
  margin: auto !important;
}
.pxer-app .mt-auto,
.pxer-app .my-auto {
  margin-top: auto !important;
}
.pxer-app .mr-auto,
.pxer-app .mx-auto {
  margin-right: auto !important;
}
.pxer-app .mb-auto,
.pxer-app .my-auto {
  margin-bottom: auto !important;
}
.pxer-app .ml-auto,
.pxer-app .mx-auto {
  margin-left: auto !important;
}
@media (min-width: 576px) {
  .pxer-app .m-sm-0 {
    margin: 0 !important;
  }
  .pxer-app .mt-sm-0,
  .pxer-app .my-sm-0 {
    margin-top: 0 !important;
  }
  .pxer-app .mr-sm-0,
  .pxer-app .mx-sm-0 {
    margin-right: 0 !important;
  }
  .pxer-app .mb-sm-0,
  .pxer-app .my-sm-0 {
    margin-bottom: 0 !important;
  }
  .pxer-app .ml-sm-0,
  .pxer-app .mx-sm-0 {
    margin-left: 0 !important;
  }
  .pxer-app .m-sm-1 {
    margin: 0.25rem !important;
  }
  .pxer-app .mt-sm-1,
  .pxer-app .my-sm-1 {
    margin-top: 0.25rem !important;
  }
  .pxer-app .mr-sm-1,
  .pxer-app .mx-sm-1 {
    margin-right: 0.25rem !important;
  }
  .pxer-app .mb-sm-1,
  .pxer-app .my-sm-1 {
    margin-bottom: 0.25rem !important;
  }
  .pxer-app .ml-sm-1,
  .pxer-app .mx-sm-1 {
    margin-left: 0.25rem !important;
  }
  .pxer-app .m-sm-2 {
    margin: 0.5rem !important;
  }
  .pxer-app .mt-sm-2,
  .pxer-app .my-sm-2 {
    margin-top: 0.5rem !important;
  }
  .pxer-app .mr-sm-2,
  .pxer-app .mx-sm-2 {
    margin-right: 0.5rem !important;
  }
  .pxer-app .mb-sm-2,
  .pxer-app .my-sm-2 {
    margin-bottom: 0.5rem !important;
  }
  .pxer-app .ml-sm-2,
  .pxer-app .mx-sm-2 {
    margin-left: 0.5rem !important;
  }
  .pxer-app .m-sm-3 {
    margin: 1rem !important;
  }
  .pxer-app .mt-sm-3,
  .pxer-app .my-sm-3 {
    margin-top: 1rem !important;
  }
  .pxer-app .mr-sm-3,
  .pxer-app .mx-sm-3 {
    margin-right: 1rem !important;
  }
  .pxer-app .mb-sm-3,
  .pxer-app .my-sm-3 {
    margin-bottom: 1rem !important;
  }
  .pxer-app .ml-sm-3,
  .pxer-app .mx-sm-3 {
    margin-left: 1rem !important;
  }
  .pxer-app .m-sm-4 {
    margin: 1.5rem !important;
  }
  .pxer-app .mt-sm-4,
  .pxer-app .my-sm-4 {
    margin-top: 1.5rem !important;
  }
  .pxer-app .mr-sm-4,
  .pxer-app .mx-sm-4 {
    margin-right: 1.5rem !important;
  }
  .pxer-app .mb-sm-4,
  .pxer-app .my-sm-4 {
    margin-bottom: 1.5rem !important;
  }
  .pxer-app .ml-sm-4,
  .pxer-app .mx-sm-4 {
    margin-left: 1.5rem !important;
  }
  .pxer-app .m-sm-5 {
    margin: 3rem !important;
  }
  .pxer-app .mt-sm-5,
  .pxer-app .my-sm-5 {
    margin-top: 3rem !important;
  }
  .pxer-app .mr-sm-5,
  .pxer-app .mx-sm-5 {
    margin-right: 3rem !important;
  }
  .pxer-app .mb-sm-5,
  .pxer-app .my-sm-5 {
    margin-bottom: 3rem !important;
  }
  .pxer-app .ml-sm-5,
  .pxer-app .mx-sm-5 {
    margin-left: 3rem !important;
  }
  .pxer-app .p-sm-0 {
    padding: 0 !important;
  }
  .pxer-app .pt-sm-0,
  .pxer-app .py-sm-0 {
    padding-top: 0 !important;
  }
  .pxer-app .pr-sm-0,
  .pxer-app .px-sm-0 {
    padding-right: 0 !important;
  }
  .pxer-app .pb-sm-0,
  .pxer-app .py-sm-0 {
    padding-bottom: 0 !important;
  }
  .pxer-app .pl-sm-0,
  .pxer-app .px-sm-0 {
    padding-left: 0 !important;
  }
  .pxer-app .p-sm-1 {
    padding: 0.25rem !important;
  }
  .pxer-app .pt-sm-1,
  .pxer-app .py-sm-1 {
    padding-top: 0.25rem !important;
  }
  .pxer-app .pr-sm-1,
  .pxer-app .px-sm-1 {
    padding-right: 0.25rem !important;
  }
  .pxer-app .pb-sm-1,
  .pxer-app .py-sm-1 {
    padding-bottom: 0.25rem !important;
  }
  .pxer-app .pl-sm-1,
  .pxer-app .px-sm-1 {
    padding-left: 0.25rem !important;
  }
  .pxer-app .p-sm-2 {
    padding: 0.5rem !important;
  }
  .pxer-app .pt-sm-2,
  .pxer-app .py-sm-2 {
    padding-top: 0.5rem !important;
  }
  .pxer-app .pr-sm-2,
  .pxer-app .px-sm-2 {
    padding-right: 0.5rem !important;
  }
  .pxer-app .pb-sm-2,
  .pxer-app .py-sm-2 {
    padding-bottom: 0.5rem !important;
  }
  .pxer-app .pl-sm-2,
  .pxer-app .px-sm-2 {
    padding-left: 0.5rem !important;
  }
  .pxer-app .p-sm-3 {
    padding: 1rem !important;
  }
  .pxer-app .pt-sm-3,
  .pxer-app .py-sm-3 {
    padding-top: 1rem !important;
  }
  .pxer-app .pr-sm-3,
  .pxer-app .px-sm-3 {
    padding-right: 1rem !important;
  }
  .pxer-app .pb-sm-3,
  .pxer-app .py-sm-3 {
    padding-bottom: 1rem !important;
  }
  .pxer-app .pl-sm-3,
  .pxer-app .px-sm-3 {
    padding-left: 1rem !important;
  }
  .pxer-app .p-sm-4 {
    padding: 1.5rem !important;
  }
  .pxer-app .pt-sm-4,
  .pxer-app .py-sm-4 {
    padding-top: 1.5rem !important;
  }
  .pxer-app .pr-sm-4,
  .pxer-app .px-sm-4 {
    padding-right: 1.5rem !important;
  }
  .pxer-app .pb-sm-4,
  .pxer-app .py-sm-4 {
    padding-bottom: 1.5rem !important;
  }
  .pxer-app .pl-sm-4,
  .pxer-app .px-sm-4 {
    padding-left: 1.5rem !important;
  }
  .pxer-app .p-sm-5 {
    padding: 3rem !important;
  }
  .pxer-app .pt-sm-5,
  .pxer-app .py-sm-5 {
    padding-top: 3rem !important;
  }
  .pxer-app .pr-sm-5,
  .pxer-app .px-sm-5 {
    padding-right: 3rem !important;
  }
  .pxer-app .pb-sm-5,
  .pxer-app .py-sm-5 {
    padding-bottom: 3rem !important;
  }
  .pxer-app .pl-sm-5,
  .pxer-app .px-sm-5 {
    padding-left: 3rem !important;
  }
  .pxer-app .m-sm-n1 {
    margin: -0.25rem !important;
  }
  .pxer-app .mt-sm-n1,
  .pxer-app .my-sm-n1 {
    margin-top: -0.25rem !important;
  }
  .pxer-app .mr-sm-n1,
  .pxer-app .mx-sm-n1 {
    margin-right: -0.25rem !important;
  }
  .pxer-app .mb-sm-n1,
  .pxer-app .my-sm-n1 {
    margin-bottom: -0.25rem !important;
  }
  .pxer-app .ml-sm-n1,
  .pxer-app .mx-sm-n1 {
    margin-left: -0.25rem !important;
  }
  .pxer-app .m-sm-n2 {
    margin: -0.5rem !important;
  }
  .pxer-app .mt-sm-n2,
  .pxer-app .my-sm-n2 {
    margin-top: -0.5rem !important;
  }
  .pxer-app .mr-sm-n2,
  .pxer-app .mx-sm-n2 {
    margin-right: -0.5rem !important;
  }
  .pxer-app .mb-sm-n2,
  .pxer-app .my-sm-n2 {
    margin-bottom: -0.5rem !important;
  }
  .pxer-app .ml-sm-n2,
  .pxer-app .mx-sm-n2 {
    margin-left: -0.5rem !important;
  }
  .pxer-app .m-sm-n3 {
    margin: -1rem !important;
  }
  .pxer-app .mt-sm-n3,
  .pxer-app .my-sm-n3 {
    margin-top: -1rem !important;
  }
  .pxer-app .mr-sm-n3,
  .pxer-app .mx-sm-n3 {
    margin-right: -1rem !important;
  }
  .pxer-app .mb-sm-n3,
  .pxer-app .my-sm-n3 {
    margin-bottom: -1rem !important;
  }
  .pxer-app .ml-sm-n3,
  .pxer-app .mx-sm-n3 {
    margin-left: -1rem !important;
  }
  .pxer-app .m-sm-n4 {
    margin: -1.5rem !important;
  }
  .pxer-app .mt-sm-n4,
  .pxer-app .my-sm-n4 {
    margin-top: -1.5rem !important;
  }
  .pxer-app .mr-sm-n4,
  .pxer-app .mx-sm-n4 {
    margin-right: -1.5rem !important;
  }
  .pxer-app .mb-sm-n4,
  .pxer-app .my-sm-n4 {
    margin-bottom: -1.5rem !important;
  }
  .pxer-app .ml-sm-n4,
  .pxer-app .mx-sm-n4 {
    margin-left: -1.5rem !important;
  }
  .pxer-app .m-sm-n5 {
    margin: -3rem !important;
  }
  .pxer-app .mt-sm-n5,
  .pxer-app .my-sm-n5 {
    margin-top: -3rem !important;
  }
  .pxer-app .mr-sm-n5,
  .pxer-app .mx-sm-n5 {
    margin-right: -3rem !important;
  }
  .pxer-app .mb-sm-n5,
  .pxer-app .my-sm-n5 {
    margin-bottom: -3rem !important;
  }
  .pxer-app .ml-sm-n5,
  .pxer-app .mx-sm-n5 {
    margin-left: -3rem !important;
  }
  .pxer-app .m-sm-auto {
    margin: auto !important;
  }
  .pxer-app .mt-sm-auto,
  .pxer-app .my-sm-auto {
    margin-top: auto !important;
  }
  .pxer-app .mr-sm-auto,
  .pxer-app .mx-sm-auto {
    margin-right: auto !important;
  }
  .pxer-app .mb-sm-auto,
  .pxer-app .my-sm-auto {
    margin-bottom: auto !important;
  }
  .pxer-app .ml-sm-auto,
  .pxer-app .mx-sm-auto {
    margin-left: auto !important;
  }
}
@media (min-width: 768px) {
  .pxer-app .m-md-0 {
    margin: 0 !important;
  }
  .pxer-app .mt-md-0,
  .pxer-app .my-md-0 {
    margin-top: 0 !important;
  }
  .pxer-app .mr-md-0,
  .pxer-app .mx-md-0 {
    margin-right: 0 !important;
  }
  .pxer-app .mb-md-0,
  .pxer-app .my-md-0 {
    margin-bottom: 0 !important;
  }
  .pxer-app .ml-md-0,
  .pxer-app .mx-md-0 {
    margin-left: 0 !important;
  }
  .pxer-app .m-md-1 {
    margin: 0.25rem !important;
  }
  .pxer-app .mt-md-1,
  .pxer-app .my-md-1 {
    margin-top: 0.25rem !important;
  }
  .pxer-app .mr-md-1,
  .pxer-app .mx-md-1 {
    margin-right: 0.25rem !important;
  }
  .pxer-app .mb-md-1,
  .pxer-app .my-md-1 {
    margin-bottom: 0.25rem !important;
  }
  .pxer-app .ml-md-1,
  .pxer-app .mx-md-1 {
    margin-left: 0.25rem !important;
  }
  .pxer-app .m-md-2 {
    margin: 0.5rem !important;
  }
  .pxer-app .mt-md-2,
  .pxer-app .my-md-2 {
    margin-top: 0.5rem !important;
  }
  .pxer-app .mr-md-2,
  .pxer-app .mx-md-2 {
    margin-right: 0.5rem !important;
  }
  .pxer-app .mb-md-2,
  .pxer-app .my-md-2 {
    margin-bottom: 0.5rem !important;
  }
  .pxer-app .ml-md-2,
  .pxer-app .mx-md-2 {
    margin-left: 0.5rem !important;
  }
  .pxer-app .m-md-3 {
    margin: 1rem !important;
  }
  .pxer-app .mt-md-3,
  .pxer-app .my-md-3 {
    margin-top: 1rem !important;
  }
  .pxer-app .mr-md-3,
  .pxer-app .mx-md-3 {
    margin-right: 1rem !important;
  }
  .pxer-app .mb-md-3,
  .pxer-app .my-md-3 {
    margin-bottom: 1rem !important;
  }
  .pxer-app .ml-md-3,
  .pxer-app .mx-md-3 {
    margin-left: 1rem !important;
  }
  .pxer-app .m-md-4 {
    margin: 1.5rem !important;
  }
  .pxer-app .mt-md-4,
  .pxer-app .my-md-4 {
    margin-top: 1.5rem !important;
  }
  .pxer-app .mr-md-4,
  .pxer-app .mx-md-4 {
    margin-right: 1.5rem !important;
  }
  .pxer-app .mb-md-4,
  .pxer-app .my-md-4 {
    margin-bottom: 1.5rem !important;
  }
  .pxer-app .ml-md-4,
  .pxer-app .mx-md-4 {
    margin-left: 1.5rem !important;
  }
  .pxer-app .m-md-5 {
    margin: 3rem !important;
  }
  .pxer-app .mt-md-5,
  .pxer-app .my-md-5 {
    margin-top: 3rem !important;
  }
  .pxer-app .mr-md-5,
  .pxer-app .mx-md-5 {
    margin-right: 3rem !important;
  }
  .pxer-app .mb-md-5,
  .pxer-app .my-md-5 {
    margin-bottom: 3rem !important;
  }
  .pxer-app .ml-md-5,
  .pxer-app .mx-md-5 {
    margin-left: 3rem !important;
  }
  .pxer-app .p-md-0 {
    padding: 0 !important;
  }
  .pxer-app .pt-md-0,
  .pxer-app .py-md-0 {
    padding-top: 0 !important;
  }
  .pxer-app .pr-md-0,
  .pxer-app .px-md-0 {
    padding-right: 0 !important;
  }
  .pxer-app .pb-md-0,
  .pxer-app .py-md-0 {
    padding-bottom: 0 !important;
  }
  .pxer-app .pl-md-0,
  .pxer-app .px-md-0 {
    padding-left: 0 !important;
  }
  .pxer-app .p-md-1 {
    padding: 0.25rem !important;
  }
  .pxer-app .pt-md-1,
  .pxer-app .py-md-1 {
    padding-top: 0.25rem !important;
  }
  .pxer-app .pr-md-1,
  .pxer-app .px-md-1 {
    padding-right: 0.25rem !important;
  }
  .pxer-app .pb-md-1,
  .pxer-app .py-md-1 {
    padding-bottom: 0.25rem !important;
  }
  .pxer-app .pl-md-1,
  .pxer-app .px-md-1 {
    padding-left: 0.25rem !important;
  }
  .pxer-app .p-md-2 {
    padding: 0.5rem !important;
  }
  .pxer-app .pt-md-2,
  .pxer-app .py-md-2 {
    padding-top: 0.5rem !important;
  }
  .pxer-app .pr-md-2,
  .pxer-app .px-md-2 {
    padding-right: 0.5rem !important;
  }
  .pxer-app .pb-md-2,
  .pxer-app .py-md-2 {
    padding-bottom: 0.5rem !important;
  }
  .pxer-app .pl-md-2,
  .pxer-app .px-md-2 {
    padding-left: 0.5rem !important;
  }
  .pxer-app .p-md-3 {
    padding: 1rem !important;
  }
  .pxer-app .pt-md-3,
  .pxer-app .py-md-3 {
    padding-top: 1rem !important;
  }
  .pxer-app .pr-md-3,
  .pxer-app .px-md-3 {
    padding-right: 1rem !important;
  }
  .pxer-app .pb-md-3,
  .pxer-app .py-md-3 {
    padding-bottom: 1rem !important;
  }
  .pxer-app .pl-md-3,
  .pxer-app .px-md-3 {
    padding-left: 1rem !important;
  }
  .pxer-app .p-md-4 {
    padding: 1.5rem !important;
  }
  .pxer-app .pt-md-4,
  .pxer-app .py-md-4 {
    padding-top: 1.5rem !important;
  }
  .pxer-app .pr-md-4,
  .pxer-app .px-md-4 {
    padding-right: 1.5rem !important;
  }
  .pxer-app .pb-md-4,
  .pxer-app .py-md-4 {
    padding-bottom: 1.5rem !important;
  }
  .pxer-app .pl-md-4,
  .pxer-app .px-md-4 {
    padding-left: 1.5rem !important;
  }
  .pxer-app .p-md-5 {
    padding: 3rem !important;
  }
  .pxer-app .pt-md-5,
  .pxer-app .py-md-5 {
    padding-top: 3rem !important;
  }
  .pxer-app .pr-md-5,
  .pxer-app .px-md-5 {
    padding-right: 3rem !important;
  }
  .pxer-app .pb-md-5,
  .pxer-app .py-md-5 {
    padding-bottom: 3rem !important;
  }
  .pxer-app .pl-md-5,
  .pxer-app .px-md-5 {
    padding-left: 3rem !important;
  }
  .pxer-app .m-md-n1 {
    margin: -0.25rem !important;
  }
  .pxer-app .mt-md-n1,
  .pxer-app .my-md-n1 {
    margin-top: -0.25rem !important;
  }
  .pxer-app .mr-md-n1,
  .pxer-app .mx-md-n1 {
    margin-right: -0.25rem !important;
  }
  .pxer-app .mb-md-n1,
  .pxer-app .my-md-n1 {
    margin-bottom: -0.25rem !important;
  }
  .pxer-app .ml-md-n1,
  .pxer-app .mx-md-n1 {
    margin-left: -0.25rem !important;
  }
  .pxer-app .m-md-n2 {
    margin: -0.5rem !important;
  }
  .pxer-app .mt-md-n2,
  .pxer-app .my-md-n2 {
    margin-top: -0.5rem !important;
  }
  .pxer-app .mr-md-n2,
  .pxer-app .mx-md-n2 {
    margin-right: -0.5rem !important;
  }
  .pxer-app .mb-md-n2,
  .pxer-app .my-md-n2 {
    margin-bottom: -0.5rem !important;
  }
  .pxer-app .ml-md-n2,
  .pxer-app .mx-md-n2 {
    margin-left: -0.5rem !important;
  }
  .pxer-app .m-md-n3 {
    margin: -1rem !important;
  }
  .pxer-app .mt-md-n3,
  .pxer-app .my-md-n3 {
    margin-top: -1rem !important;
  }
  .pxer-app .mr-md-n3,
  .pxer-app .mx-md-n3 {
    margin-right: -1rem !important;
  }
  .pxer-app .mb-md-n3,
  .pxer-app .my-md-n3 {
    margin-bottom: -1rem !important;
  }
  .pxer-app .ml-md-n3,
  .pxer-app .mx-md-n3 {
    margin-left: -1rem !important;
  }
  .pxer-app .m-md-n4 {
    margin: -1.5rem !important;
  }
  .pxer-app .mt-md-n4,
  .pxer-app .my-md-n4 {
    margin-top: -1.5rem !important;
  }
  .pxer-app .mr-md-n4,
  .pxer-app .mx-md-n4 {
    margin-right: -1.5rem !important;
  }
  .pxer-app .mb-md-n4,
  .pxer-app .my-md-n4 {
    margin-bottom: -1.5rem !important;
  }
  .pxer-app .ml-md-n4,
  .pxer-app .mx-md-n4 {
    margin-left: -1.5rem !important;
  }
  .pxer-app .m-md-n5 {
    margin: -3rem !important;
  }
  .pxer-app .mt-md-n5,
  .pxer-app .my-md-n5 {
    margin-top: -3rem !important;
  }
  .pxer-app .mr-md-n5,
  .pxer-app .mx-md-n5 {
    margin-right: -3rem !important;
  }
  .pxer-app .mb-md-n5,
  .pxer-app .my-md-n5 {
    margin-bottom: -3rem !important;
  }
  .pxer-app .ml-md-n5,
  .pxer-app .mx-md-n5 {
    margin-left: -3rem !important;
  }
  .pxer-app .m-md-auto {
    margin: auto !important;
  }
  .pxer-app .mt-md-auto,
  .pxer-app .my-md-auto {
    margin-top: auto !important;
  }
  .pxer-app .mr-md-auto,
  .pxer-app .mx-md-auto {
    margin-right: auto !important;
  }
  .pxer-app .mb-md-auto,
  .pxer-app .my-md-auto {
    margin-bottom: auto !important;
  }
  .pxer-app .ml-md-auto,
  .pxer-app .mx-md-auto {
    margin-left: auto !important;
  }
}
@media (min-width: 992px) {
  .pxer-app .m-lg-0 {
    margin: 0 !important;
  }
  .pxer-app .mt-lg-0,
  .pxer-app .my-lg-0 {
    margin-top: 0 !important;
  }
  .pxer-app .mr-lg-0,
  .pxer-app .mx-lg-0 {
    margin-right: 0 !important;
  }
  .pxer-app .mb-lg-0,
  .pxer-app .my-lg-0 {
    margin-bottom: 0 !important;
  }
  .pxer-app .ml-lg-0,
  .pxer-app .mx-lg-0 {
    margin-left: 0 !important;
  }
  .pxer-app .m-lg-1 {
    margin: 0.25rem !important;
  }
  .pxer-app .mt-lg-1,
  .pxer-app .my-lg-1 {
    margin-top: 0.25rem !important;
  }
  .pxer-app .mr-lg-1,
  .pxer-app .mx-lg-1 {
    margin-right: 0.25rem !important;
  }
  .pxer-app .mb-lg-1,
  .pxer-app .my-lg-1 {
    margin-bottom: 0.25rem !important;
  }
  .pxer-app .ml-lg-1,
  .pxer-app .mx-lg-1 {
    margin-left: 0.25rem !important;
  }
  .pxer-app .m-lg-2 {
    margin: 0.5rem !important;
  }
  .pxer-app .mt-lg-2,
  .pxer-app .my-lg-2 {
    margin-top: 0.5rem !important;
  }
  .pxer-app .mr-lg-2,
  .pxer-app .mx-lg-2 {
    margin-right: 0.5rem !important;
  }
  .pxer-app .mb-lg-2,
  .pxer-app .my-lg-2 {
    margin-bottom: 0.5rem !important;
  }
  .pxer-app .ml-lg-2,
  .pxer-app .mx-lg-2 {
    margin-left: 0.5rem !important;
  }
  .pxer-app .m-lg-3 {
    margin: 1rem !important;
  }
  .pxer-app .mt-lg-3,
  .pxer-app .my-lg-3 {
    margin-top: 1rem !important;
  }
  .pxer-app .mr-lg-3,
  .pxer-app .mx-lg-3 {
    margin-right: 1rem !important;
  }
  .pxer-app .mb-lg-3,
  .pxer-app .my-lg-3 {
    margin-bottom: 1rem !important;
  }
  .pxer-app .ml-lg-3,
  .pxer-app .mx-lg-3 {
    margin-left: 1rem !important;
  }
  .pxer-app .m-lg-4 {
    margin: 1.5rem !important;
  }
  .pxer-app .mt-lg-4,
  .pxer-app .my-lg-4 {
    margin-top: 1.5rem !important;
  }
  .pxer-app .mr-lg-4,
  .pxer-app .mx-lg-4 {
    margin-right: 1.5rem !important;
  }
  .pxer-app .mb-lg-4,
  .pxer-app .my-lg-4 {
    margin-bottom: 1.5rem !important;
  }
  .pxer-app .ml-lg-4,
  .pxer-app .mx-lg-4 {
    margin-left: 1.5rem !important;
  }
  .pxer-app .m-lg-5 {
    margin: 3rem !important;
  }
  .pxer-app .mt-lg-5,
  .pxer-app .my-lg-5 {
    margin-top: 3rem !important;
  }
  .pxer-app .mr-lg-5,
  .pxer-app .mx-lg-5 {
    margin-right: 3rem !important;
  }
  .pxer-app .mb-lg-5,
  .pxer-app .my-lg-5 {
    margin-bottom: 3rem !important;
  }
  .pxer-app .ml-lg-5,
  .pxer-app .mx-lg-5 {
    margin-left: 3rem !important;
  }
  .pxer-app .p-lg-0 {
    padding: 0 !important;
  }
  .pxer-app .pt-lg-0,
  .pxer-app .py-lg-0 {
    padding-top: 0 !important;
  }
  .pxer-app .pr-lg-0,
  .pxer-app .px-lg-0 {
    padding-right: 0 !important;
  }
  .pxer-app .pb-lg-0,
  .pxer-app .py-lg-0 {
    padding-bottom: 0 !important;
  }
  .pxer-app .pl-lg-0,
  .pxer-app .px-lg-0 {
    padding-left: 0 !important;
  }
  .pxer-app .p-lg-1 {
    padding: 0.25rem !important;
  }
  .pxer-app .pt-lg-1,
  .pxer-app .py-lg-1 {
    padding-top: 0.25rem !important;
  }
  .pxer-app .pr-lg-1,
  .pxer-app .px-lg-1 {
    padding-right: 0.25rem !important;
  }
  .pxer-app .pb-lg-1,
  .pxer-app .py-lg-1 {
    padding-bottom: 0.25rem !important;
  }
  .pxer-app .pl-lg-1,
  .pxer-app .px-lg-1 {
    padding-left: 0.25rem !important;
  }
  .pxer-app .p-lg-2 {
    padding: 0.5rem !important;
  }
  .pxer-app .pt-lg-2,
  .pxer-app .py-lg-2 {
    padding-top: 0.5rem !important;
  }
  .pxer-app .pr-lg-2,
  .pxer-app .px-lg-2 {
    padding-right: 0.5rem !important;
  }
  .pxer-app .pb-lg-2,
  .pxer-app .py-lg-2 {
    padding-bottom: 0.5rem !important;
  }
  .pxer-app .pl-lg-2,
  .pxer-app .px-lg-2 {
    padding-left: 0.5rem !important;
  }
  .pxer-app .p-lg-3 {
    padding: 1rem !important;
  }
  .pxer-app .pt-lg-3,
  .pxer-app .py-lg-3 {
    padding-top: 1rem !important;
  }
  .pxer-app .pr-lg-3,
  .pxer-app .px-lg-3 {
    padding-right: 1rem !important;
  }
  .pxer-app .pb-lg-3,
  .pxer-app .py-lg-3 {
    padding-bottom: 1rem !important;
  }
  .pxer-app .pl-lg-3,
  .pxer-app .px-lg-3 {
    padding-left: 1rem !important;
  }
  .pxer-app .p-lg-4 {
    padding: 1.5rem !important;
  }
  .pxer-app .pt-lg-4,
  .pxer-app .py-lg-4 {
    padding-top: 1.5rem !important;
  }
  .pxer-app .pr-lg-4,
  .pxer-app .px-lg-4 {
    padding-right: 1.5rem !important;
  }
  .pxer-app .pb-lg-4,
  .pxer-app .py-lg-4 {
    padding-bottom: 1.5rem !important;
  }
  .pxer-app .pl-lg-4,
  .pxer-app .px-lg-4 {
    padding-left: 1.5rem !important;
  }
  .pxer-app .p-lg-5 {
    padding: 3rem !important;
  }
  .pxer-app .pt-lg-5,
  .pxer-app .py-lg-5 {
    padding-top: 3rem !important;
  }
  .pxer-app .pr-lg-5,
  .pxer-app .px-lg-5 {
    padding-right: 3rem !important;
  }
  .pxer-app .pb-lg-5,
  .pxer-app .py-lg-5 {
    padding-bottom: 3rem !important;
  }
  .pxer-app .pl-lg-5,
  .pxer-app .px-lg-5 {
    padding-left: 3rem !important;
  }
  .pxer-app .m-lg-n1 {
    margin: -0.25rem !important;
  }
  .pxer-app .mt-lg-n1,
  .pxer-app .my-lg-n1 {
    margin-top: -0.25rem !important;
  }
  .pxer-app .mr-lg-n1,
  .pxer-app .mx-lg-n1 {
    margin-right: -0.25rem !important;
  }
  .pxer-app .mb-lg-n1,
  .pxer-app .my-lg-n1 {
    margin-bottom: -0.25rem !important;
  }
  .pxer-app .ml-lg-n1,
  .pxer-app .mx-lg-n1 {
    margin-left: -0.25rem !important;
  }
  .pxer-app .m-lg-n2 {
    margin: -0.5rem !important;
  }
  .pxer-app .mt-lg-n2,
  .pxer-app .my-lg-n2 {
    margin-top: -0.5rem !important;
  }
  .pxer-app .mr-lg-n2,
  .pxer-app .mx-lg-n2 {
    margin-right: -0.5rem !important;
  }
  .pxer-app .mb-lg-n2,
  .pxer-app .my-lg-n2 {
    margin-bottom: -0.5rem !important;
  }
  .pxer-app .ml-lg-n2,
  .pxer-app .mx-lg-n2 {
    margin-left: -0.5rem !important;
  }
  .pxer-app .m-lg-n3 {
    margin: -1rem !important;
  }
  .pxer-app .mt-lg-n3,
  .pxer-app .my-lg-n3 {
    margin-top: -1rem !important;
  }
  .pxer-app .mr-lg-n3,
  .pxer-app .mx-lg-n3 {
    margin-right: -1rem !important;
  }
  .pxer-app .mb-lg-n3,
  .pxer-app .my-lg-n3 {
    margin-bottom: -1rem !important;
  }
  .pxer-app .ml-lg-n3,
  .pxer-app .mx-lg-n3 {
    margin-left: -1rem !important;
  }
  .pxer-app .m-lg-n4 {
    margin: -1.5rem !important;
  }
  .pxer-app .mt-lg-n4,
  .pxer-app .my-lg-n4 {
    margin-top: -1.5rem !important;
  }
  .pxer-app .mr-lg-n4,
  .pxer-app .mx-lg-n4 {
    margin-right: -1.5rem !important;
  }
  .pxer-app .mb-lg-n4,
  .pxer-app .my-lg-n4 {
    margin-bottom: -1.5rem !important;
  }
  .pxer-app .ml-lg-n4,
  .pxer-app .mx-lg-n4 {
    margin-left: -1.5rem !important;
  }
  .pxer-app .m-lg-n5 {
    margin: -3rem !important;
  }
  .pxer-app .mt-lg-n5,
  .pxer-app .my-lg-n5 {
    margin-top: -3rem !important;
  }
  .pxer-app .mr-lg-n5,
  .pxer-app .mx-lg-n5 {
    margin-right: -3rem !important;
  }
  .pxer-app .mb-lg-n5,
  .pxer-app .my-lg-n5 {
    margin-bottom: -3rem !important;
  }
  .pxer-app .ml-lg-n5,
  .pxer-app .mx-lg-n5 {
    margin-left: -3rem !important;
  }
  .pxer-app .m-lg-auto {
    margin: auto !important;
  }
  .pxer-app .mt-lg-auto,
  .pxer-app .my-lg-auto {
    margin-top: auto !important;
  }
  .pxer-app .mr-lg-auto,
  .pxer-app .mx-lg-auto {
    margin-right: auto !important;
  }
  .pxer-app .mb-lg-auto,
  .pxer-app .my-lg-auto {
    margin-bottom: auto !important;
  }
  .pxer-app .ml-lg-auto,
  .pxer-app .mx-lg-auto {
    margin-left: auto !important;
  }
}
@media (min-width: 1200px) {
  .pxer-app .m-xl-0 {
    margin: 0 !important;
  }
  .pxer-app .mt-xl-0,
  .pxer-app .my-xl-0 {
    margin-top: 0 !important;
  }
  .pxer-app .mr-xl-0,
  .pxer-app .mx-xl-0 {
    margin-right: 0 !important;
  }
  .pxer-app .mb-xl-0,
  .pxer-app .my-xl-0 {
    margin-bottom: 0 !important;
  }
  .pxer-app .ml-xl-0,
  .pxer-app .mx-xl-0 {
    margin-left: 0 !important;
  }
  .pxer-app .m-xl-1 {
    margin: 0.25rem !important;
  }
  .pxer-app .mt-xl-1,
  .pxer-app .my-xl-1 {
    margin-top: 0.25rem !important;
  }
  .pxer-app .mr-xl-1,
  .pxer-app .mx-xl-1 {
    margin-right: 0.25rem !important;
  }
  .pxer-app .mb-xl-1,
  .pxer-app .my-xl-1 {
    margin-bottom: 0.25rem !important;
  }
  .pxer-app .ml-xl-1,
  .pxer-app .mx-xl-1 {
    margin-left: 0.25rem !important;
  }
  .pxer-app .m-xl-2 {
    margin: 0.5rem !important;
  }
  .pxer-app .mt-xl-2,
  .pxer-app .my-xl-2 {
    margin-top: 0.5rem !important;
  }
  .pxer-app .mr-xl-2,
  .pxer-app .mx-xl-2 {
    margin-right: 0.5rem !important;
  }
  .pxer-app .mb-xl-2,
  .pxer-app .my-xl-2 {
    margin-bottom: 0.5rem !important;
  }
  .pxer-app .ml-xl-2,
  .pxer-app .mx-xl-2 {
    margin-left: 0.5rem !important;
  }
  .pxer-app .m-xl-3 {
    margin: 1rem !important;
  }
  .pxer-app .mt-xl-3,
  .pxer-app .my-xl-3 {
    margin-top: 1rem !important;
  }
  .pxer-app .mr-xl-3,
  .pxer-app .mx-xl-3 {
    margin-right: 1rem !important;
  }
  .pxer-app .mb-xl-3,
  .pxer-app .my-xl-3 {
    margin-bottom: 1rem !important;
  }
  .pxer-app .ml-xl-3,
  .pxer-app .mx-xl-3 {
    margin-left: 1rem !important;
  }
  .pxer-app .m-xl-4 {
    margin: 1.5rem !important;
  }
  .pxer-app .mt-xl-4,
  .pxer-app .my-xl-4 {
    margin-top: 1.5rem !important;
  }
  .pxer-app .mr-xl-4,
  .pxer-app .mx-xl-4 {
    margin-right: 1.5rem !important;
  }
  .pxer-app .mb-xl-4,
  .pxer-app .my-xl-4 {
    margin-bottom: 1.5rem !important;
  }
  .pxer-app .ml-xl-4,
  .pxer-app .mx-xl-4 {
    margin-left: 1.5rem !important;
  }
  .pxer-app .m-xl-5 {
    margin: 3rem !important;
  }
  .pxer-app .mt-xl-5,
  .pxer-app .my-xl-5 {
    margin-top: 3rem !important;
  }
  .pxer-app .mr-xl-5,
  .pxer-app .mx-xl-5 {
    margin-right: 3rem !important;
  }
  .pxer-app .mb-xl-5,
  .pxer-app .my-xl-5 {
    margin-bottom: 3rem !important;
  }
  .pxer-app .ml-xl-5,
  .pxer-app .mx-xl-5 {
    margin-left: 3rem !important;
  }
  .pxer-app .p-xl-0 {
    padding: 0 !important;
  }
  .pxer-app .pt-xl-0,
  .pxer-app .py-xl-0 {
    padding-top: 0 !important;
  }
  .pxer-app .pr-xl-0,
  .pxer-app .px-xl-0 {
    padding-right: 0 !important;
  }
  .pxer-app .pb-xl-0,
  .pxer-app .py-xl-0 {
    padding-bottom: 0 !important;
  }
  .pxer-app .pl-xl-0,
  .pxer-app .px-xl-0 {
    padding-left: 0 !important;
  }
  .pxer-app .p-xl-1 {
    padding: 0.25rem !important;
  }
  .pxer-app .pt-xl-1,
  .pxer-app .py-xl-1 {
    padding-top: 0.25rem !important;
  }
  .pxer-app .pr-xl-1,
  .pxer-app .px-xl-1 {
    padding-right: 0.25rem !important;
  }
  .pxer-app .pb-xl-1,
  .pxer-app .py-xl-1 {
    padding-bottom: 0.25rem !important;
  }
  .pxer-app .pl-xl-1,
  .pxer-app .px-xl-1 {
    padding-left: 0.25rem !important;
  }
  .pxer-app .p-xl-2 {
    padding: 0.5rem !important;
  }
  .pxer-app .pt-xl-2,
  .pxer-app .py-xl-2 {
    padding-top: 0.5rem !important;
  }
  .pxer-app .pr-xl-2,
  .pxer-app .px-xl-2 {
    padding-right: 0.5rem !important;
  }
  .pxer-app .pb-xl-2,
  .pxer-app .py-xl-2 {
    padding-bottom: 0.5rem !important;
  }
  .pxer-app .pl-xl-2,
  .pxer-app .px-xl-2 {
    padding-left: 0.5rem !important;
  }
  .pxer-app .p-xl-3 {
    padding: 1rem !important;
  }
  .pxer-app .pt-xl-3,
  .pxer-app .py-xl-3 {
    padding-top: 1rem !important;
  }
  .pxer-app .pr-xl-3,
  .pxer-app .px-xl-3 {
    padding-right: 1rem !important;
  }
  .pxer-app .pb-xl-3,
  .pxer-app .py-xl-3 {
    padding-bottom: 1rem !important;
  }
  .pxer-app .pl-xl-3,
  .pxer-app .px-xl-3 {
    padding-left: 1rem !important;
  }
  .pxer-app .p-xl-4 {
    padding: 1.5rem !important;
  }
  .pxer-app .pt-xl-4,
  .pxer-app .py-xl-4 {
    padding-top: 1.5rem !important;
  }
  .pxer-app .pr-xl-4,
  .pxer-app .px-xl-4 {
    padding-right: 1.5rem !important;
  }
  .pxer-app .pb-xl-4,
  .pxer-app .py-xl-4 {
    padding-bottom: 1.5rem !important;
  }
  .pxer-app .pl-xl-4,
  .pxer-app .px-xl-4 {
    padding-left: 1.5rem !important;
  }
  .pxer-app .p-xl-5 {
    padding: 3rem !important;
  }
  .pxer-app .pt-xl-5,
  .pxer-app .py-xl-5 {
    padding-top: 3rem !important;
  }
  .pxer-app .pr-xl-5,
  .pxer-app .px-xl-5 {
    padding-right: 3rem !important;
  }
  .pxer-app .pb-xl-5,
  .pxer-app .py-xl-5 {
    padding-bottom: 3rem !important;
  }
  .pxer-app .pl-xl-5,
  .pxer-app .px-xl-5 {
    padding-left: 3rem !important;
  }
  .pxer-app .m-xl-n1 {
    margin: -0.25rem !important;
  }
  .pxer-app .mt-xl-n1,
  .pxer-app .my-xl-n1 {
    margin-top: -0.25rem !important;
  }
  .pxer-app .mr-xl-n1,
  .pxer-app .mx-xl-n1 {
    margin-right: -0.25rem !important;
  }
  .pxer-app .mb-xl-n1,
  .pxer-app .my-xl-n1 {
    margin-bottom: -0.25rem !important;
  }
  .pxer-app .ml-xl-n1,
  .pxer-app .mx-xl-n1 {
    margin-left: -0.25rem !important;
  }
  .pxer-app .m-xl-n2 {
    margin: -0.5rem !important;
  }
  .pxer-app .mt-xl-n2,
  .pxer-app .my-xl-n2 {
    margin-top: -0.5rem !important;
  }
  .pxer-app .mr-xl-n2,
  .pxer-app .mx-xl-n2 {
    margin-right: -0.5rem !important;
  }
  .pxer-app .mb-xl-n2,
  .pxer-app .my-xl-n2 {
    margin-bottom: -0.5rem !important;
  }
  .pxer-app .ml-xl-n2,
  .pxer-app .mx-xl-n2 {
    margin-left: -0.5rem !important;
  }
  .pxer-app .m-xl-n3 {
    margin: -1rem !important;
  }
  .pxer-app .mt-xl-n3,
  .pxer-app .my-xl-n3 {
    margin-top: -1rem !important;
  }
  .pxer-app .mr-xl-n3,
  .pxer-app .mx-xl-n3 {
    margin-right: -1rem !important;
  }
  .pxer-app .mb-xl-n3,
  .pxer-app .my-xl-n3 {
    margin-bottom: -1rem !important;
  }
  .pxer-app .ml-xl-n3,
  .pxer-app .mx-xl-n3 {
    margin-left: -1rem !important;
  }
  .pxer-app .m-xl-n4 {
    margin: -1.5rem !important;
  }
  .pxer-app .mt-xl-n4,
  .pxer-app .my-xl-n4 {
    margin-top: -1.5rem !important;
  }
  .pxer-app .mr-xl-n4,
  .pxer-app .mx-xl-n4 {
    margin-right: -1.5rem !important;
  }
  .pxer-app .mb-xl-n4,
  .pxer-app .my-xl-n4 {
    margin-bottom: -1.5rem !important;
  }
  .pxer-app .ml-xl-n4,
  .pxer-app .mx-xl-n4 {
    margin-left: -1.5rem !important;
  }
  .pxer-app .m-xl-n5 {
    margin: -3rem !important;
  }
  .pxer-app .mt-xl-n5,
  .pxer-app .my-xl-n5 {
    margin-top: -3rem !important;
  }
  .pxer-app .mr-xl-n5,
  .pxer-app .mx-xl-n5 {
    margin-right: -3rem !important;
  }
  .pxer-app .mb-xl-n5,
  .pxer-app .my-xl-n5 {
    margin-bottom: -3rem !important;
  }
  .pxer-app .ml-xl-n5,
  .pxer-app .mx-xl-n5 {
    margin-left: -3rem !important;
  }
  .pxer-app .m-xl-auto {
    margin: auto !important;
  }
  .pxer-app .mt-xl-auto,
  .pxer-app .my-xl-auto {
    margin-top: auto !important;
  }
  .pxer-app .mr-xl-auto,
  .pxer-app .mx-xl-auto {
    margin-right: auto !important;
  }
  .pxer-app .mb-xl-auto,
  .pxer-app .my-xl-auto {
    margin-bottom: auto !important;
  }
  .pxer-app .ml-xl-auto,
  .pxer-app .mx-xl-auto {
    margin-left: auto !important;
  }
}
.pxer-app *,
.pxer-app *::before,
.pxer-app *::after {
  box-sizing: border-box;
}
.pxer-app html {
  font-family: sans-serif;
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.pxer-app article, .pxer-app aside, .pxer-app figcaption, .pxer-app figure, .pxer-app footer, .pxer-app header, .pxer-app hgroup, .pxer-app main, .pxer-app nav, .pxer-app section {
  display: block;
}
.pxer-app body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: left;
  background-color: #fff;
}
.pxer-app [tabindex="-1"]:focus:not(:focus-visible) {
  outline: 0 !important;
}
.pxer-app hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}
.pxer-app h1, .pxer-app h2, .pxer-app h3, .pxer-app h4, .pxer-app h5, .pxer-app h6 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}
.pxer-app p {
  margin-top: 0;
  margin-bottom: 1rem;
}
.pxer-app abbr[title],
.pxer-app abbr[data-original-title] {
  text-decoration: underline;
  text-decoration: underline dotted;
  cursor: help;
  border-bottom: 0;
  text-decoration-skip-ink: none;
}
.pxer-app address {
  margin-bottom: 1rem;
  font-style: normal;
  line-height: inherit;
}
.pxer-app ol,
.pxer-app ul,
.pxer-app dl {
  margin-top: 0;
  margin-bottom: 1rem;
}
.pxer-app ol ol,
.pxer-app ul ul,
.pxer-app ol ul,
.pxer-app ul ol {
  margin-bottom: 0;
}
.pxer-app dt {
  font-weight: 700;
}
.pxer-app dd {
  margin-bottom: 0.5rem;
  margin-left: 0;
}
.pxer-app blockquote {
  margin: 0 0 1rem;
}
.pxer-app b,
.pxer-app strong {
  font-weight: bolder;
}
.pxer-app small {
  font-size: 80%;
}
.pxer-app sub,
.pxer-app sup {
  position: relative;
  font-size: 75%;
  line-height: 0;
  vertical-align: baseline;
}
.pxer-app sub {
  bottom: -0.25em;
}
.pxer-app sup {
  top: -0.5em;
}
.pxer-app a {
  color: #007bff;
  text-decoration: none;
  background-color: transparent;
}
.pxer-app a:hover {
  color: #0056b3;
  text-decoration: underline;
}
.pxer-app a:not([href]):not([class]) {
  color: inherit;
  text-decoration: none;
}
.pxer-app a:not([href]):not([class]):hover {
  color: inherit;
  text-decoration: none;
}
.pxer-app pre,
.pxer-app code,
.pxer-app kbd,
.pxer-app samp {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 1em;
}
.pxer-app pre {
  margin-top: 0;
  margin-bottom: 1rem;
  overflow: auto;
  -ms-overflow-style: scrollbar;
}
.pxer-app figure {
  margin: 0 0 1rem;
}
.pxer-app img {
  vertical-align: middle;
  border-style: none;
}
.pxer-app svg {
  overflow: hidden;
  vertical-align: middle;
}
.pxer-app table {
  border-collapse: collapse;
}
.pxer-app caption {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  color: #6c757d;
  text-align: left;
  caption-side: bottom;
}
.pxer-app th {
  text-align: inherit;
  text-align: -webkit-match-parent;
}
.pxer-app label {
  display: inline-block;
  margin-bottom: 0.5rem;
}
.pxer-app button {
  border-radius: 0;
}
.pxer-app button:focus:not(:focus-visible) {
  outline: 0;
}
.pxer-app input,
.pxer-app button,
.pxer-app select,
.pxer-app optgroup,
.pxer-app textarea {
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}
.pxer-app button,
.pxer-app input {
  overflow: visible;
}
.pxer-app button,
.pxer-app select {
  text-transform: none;
}
.pxer-app [role=button] {
  cursor: pointer;
}
.pxer-app select {
  word-wrap: normal;
}
.pxer-app button,
.pxer-app [type=button],
.pxer-app [type=reset],
.pxer-app [type=submit] {
  -webkit-appearance: button;
}
.pxer-app button:not(:disabled),
.pxer-app [type=button]:not(:disabled),
.pxer-app [type=reset]:not(:disabled),
.pxer-app [type=submit]:not(:disabled) {
  cursor: pointer;
}
.pxer-app button::-moz-focus-inner,
.pxer-app [type=button]::-moz-focus-inner,
.pxer-app [type=reset]::-moz-focus-inner,
.pxer-app [type=submit]::-moz-focus-inner {
  padding: 0;
  border-style: none;
}
.pxer-app input[type=radio],
.pxer-app input[type=checkbox] {
  box-sizing: border-box;
  padding: 0;
}
.pxer-app textarea {
  overflow: auto;
  resize: vertical;
}
.pxer-app fieldset {
  min-width: 0;
  padding: 0;
  margin: 0;
  border: 0;
}
.pxer-app legend {
  display: block;
  width: 100%;
  max-width: 100%;
  padding: 0;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  line-height: inherit;
  color: inherit;
  white-space: normal;
}
.pxer-app progress {
  vertical-align: baseline;
}
.pxer-app [type=number]::-webkit-inner-spin-button,
.pxer-app [type=number]::-webkit-outer-spin-button {
  height: auto;
}
.pxer-app [type=search] {
  outline-offset: -2px;
  -webkit-appearance: none;
}
.pxer-app [type=search]::-webkit-search-decoration {
  -webkit-appearance: none;
}
.pxer-app ::-webkit-file-upload-button {
  font: inherit;
  -webkit-appearance: button;
}
.pxer-app output {
  display: inline-block;
}
.pxer-app summary {
  display: list-item;
  cursor: pointer;
}
.pxer-app template {
  display: none;
}
.pxer-app [hidden] {
  display: none !important;
}
.pxer-app .table {
  width: 100%;
  margin-bottom: 1rem;
  color: #212529;
}
.pxer-app .table th,
.pxer-app .table td {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}
.pxer-app .table thead th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
}
.pxer-app .table tbody + tbody {
  border-top: 2px solid #dee2e6;
}
.pxer-app .table-sm th,
.pxer-app .table-sm td {
  padding: 0.3rem;
}
.pxer-app .table-bordered {
  border: 1px solid #dee2e6;
}
.pxer-app .table-bordered th,
.pxer-app .table-bordered td {
  border: 1px solid #dee2e6;
}
.pxer-app .table-bordered thead th,
.pxer-app .table-bordered thead td {
  border-bottom-width: 2px;
}
.pxer-app .table-borderless th,
.pxer-app .table-borderless td,
.pxer-app .table-borderless thead th,
.pxer-app .table-borderless tbody + tbody {
  border: 0;
}
.pxer-app .table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
.pxer-app .table-hover tbody tr:hover {
  color: #212529;
  background-color: rgba(0, 0, 0, 0.075);
}
.pxer-app .table-primary,
.pxer-app .table-primary > th,
.pxer-app .table-primary > td {
  background-color: #b8daff;
}
.pxer-app .table-primary th,
.pxer-app .table-primary td,
.pxer-app .table-primary thead th,
.pxer-app .table-primary tbody + tbody {
  border-color: #7abaff;
}
.pxer-app .table-hover .table-primary:hover {
  background-color: #9fcdff;
}
.pxer-app .table-hover .table-primary:hover > td,
.pxer-app .table-hover .table-primary:hover > th {
  background-color: #9fcdff;
}
.pxer-app .table-secondary,
.pxer-app .table-secondary > th,
.pxer-app .table-secondary > td {
  background-color: #d6d8db;
}
.pxer-app .table-secondary th,
.pxer-app .table-secondary td,
.pxer-app .table-secondary thead th,
.pxer-app .table-secondary tbody + tbody {
  border-color: #b3b7bb;
}
.pxer-app .table-hover .table-secondary:hover {
  background-color: #c8cbcf;
}
.pxer-app .table-hover .table-secondary:hover > td,
.pxer-app .table-hover .table-secondary:hover > th {
  background-color: #c8cbcf;
}
.pxer-app .table-success,
.pxer-app .table-success > th,
.pxer-app .table-success > td {
  background-color: #c3e6cb;
}
.pxer-app .table-success th,
.pxer-app .table-success td,
.pxer-app .table-success thead th,
.pxer-app .table-success tbody + tbody {
  border-color: #8fd19e;
}
.pxer-app .table-hover .table-success:hover {
  background-color: #b1dfbb;
}
.pxer-app .table-hover .table-success:hover > td,
.pxer-app .table-hover .table-success:hover > th {
  background-color: #b1dfbb;
}
.pxer-app .table-info,
.pxer-app .table-info > th,
.pxer-app .table-info > td {
  background-color: #bee5eb;
}
.pxer-app .table-info th,
.pxer-app .table-info td,
.pxer-app .table-info thead th,
.pxer-app .table-info tbody + tbody {
  border-color: #86cfda;
}
.pxer-app .table-hover .table-info:hover {
  background-color: #abdde5;
}
.pxer-app .table-hover .table-info:hover > td,
.pxer-app .table-hover .table-info:hover > th {
  background-color: #abdde5;
}
.pxer-app .table-warning,
.pxer-app .table-warning > th,
.pxer-app .table-warning > td {
  background-color: #ffeeba;
}
.pxer-app .table-warning th,
.pxer-app .table-warning td,
.pxer-app .table-warning thead th,
.pxer-app .table-warning tbody + tbody {
  border-color: #ffdf7e;
}
.pxer-app .table-hover .table-warning:hover {
  background-color: #ffe8a1;
}
.pxer-app .table-hover .table-warning:hover > td,
.pxer-app .table-hover .table-warning:hover > th {
  background-color: #ffe8a1;
}
.pxer-app .table-danger,
.pxer-app .table-danger > th,
.pxer-app .table-danger > td {
  background-color: #f5c6cb;
}
.pxer-app .table-danger th,
.pxer-app .table-danger td,
.pxer-app .table-danger thead th,
.pxer-app .table-danger tbody + tbody {
  border-color: #ed969e;
}
.pxer-app .table-hover .table-danger:hover {
  background-color: #f1b0b7;
}
.pxer-app .table-hover .table-danger:hover > td,
.pxer-app .table-hover .table-danger:hover > th {
  background-color: #f1b0b7;
}
.pxer-app .table-light,
.pxer-app .table-light > th,
.pxer-app .table-light > td {
  background-color: #fdfdfe;
}
.pxer-app .table-light th,
.pxer-app .table-light td,
.pxer-app .table-light thead th,
.pxer-app .table-light tbody + tbody {
  border-color: #fbfcfc;
}
.pxer-app .table-hover .table-light:hover {
  background-color: #ececf6;
}
.pxer-app .table-hover .table-light:hover > td,
.pxer-app .table-hover .table-light:hover > th {
  background-color: #ececf6;
}
.pxer-app .table-dark,
.pxer-app .table-dark > th,
.pxer-app .table-dark > td {
  background-color: #c6c8ca;
}
.pxer-app .table-dark th,
.pxer-app .table-dark td,
.pxer-app .table-dark thead th,
.pxer-app .table-dark tbody + tbody {
  border-color: #95999c;
}
.pxer-app .table-hover .table-dark:hover {
  background-color: #b9bbbe;
}
.pxer-app .table-hover .table-dark:hover > td,
.pxer-app .table-hover .table-dark:hover > th {
  background-color: #b9bbbe;
}
.pxer-app .table-active,
.pxer-app .table-active > th,
.pxer-app .table-active > td {
  background-color: rgba(0, 0, 0, 0.075);
}
.pxer-app .table-hover .table-active:hover {
  background-color: rgba(0, 0, 0, 0.075);
}
.pxer-app .table-hover .table-active:hover > td,
.pxer-app .table-hover .table-active:hover > th {
  background-color: rgba(0, 0, 0, 0.075);
}
.pxer-app .table .thead-dark th {
  color: #fff;
  background-color: #343a40;
  border-color: #454d55;
}
.pxer-app .table .thead-light th {
  color: #495057;
  background-color: #e9ecef;
  border-color: #dee2e6;
}
.pxer-app .table-dark {
  color: #fff;
  background-color: #343a40;
}
.pxer-app .table-dark th,
.pxer-app .table-dark td,
.pxer-app .table-dark thead th {
  border-color: #454d55;
}
.pxer-app .table-dark.table-bordered {
  border: 0;
}
.pxer-app .table-dark.table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(255, 255, 255, 0.05);
}
.pxer-app .table-dark.table-hover tbody tr:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.075);
}
@media (max-width: 575.98px) {
  .pxer-app .table-responsive-sm {
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .pxer-app .table-responsive-sm > .table-bordered {
    border: 0;
  }
}
@media (max-width: 767.98px) {
  .pxer-app .table-responsive-md {
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .pxer-app .table-responsive-md > .table-bordered {
    border: 0;
  }
}
@media (max-width: 991.98px) {
  .pxer-app .table-responsive-lg {
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .pxer-app .table-responsive-lg > .table-bordered {
    border: 0;
  }
}
@media (max-width: 1199.98px) {
  .pxer-app .table-responsive-xl {
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .pxer-app .table-responsive-xl > .table-bordered {
    border: 0;
  }
}
.pxer-app .table-responsive {
  display: block;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.pxer-app .table-responsive > .table-bordered {
  border: 0;
}
.pxer-app .form-control {
  display: block;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
@media (prefers-reduced-motion: reduce) {
  .pxer-app .form-control {
    transition: none;
  }
}
.pxer-app .form-control::-ms-expand {
  background-color: transparent;
  border: 0;
}
.pxer-app .form-control:focus {
  color: #495057;
  background-color: #fff;
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
.pxer-app .form-control::placeholder {
  color: #6c757d;
  opacity: 1;
}
.pxer-app .form-control:disabled, .pxer-app .form-control[readonly] {
  background-color: #e9ecef;
  opacity: 1;
}
.pxer-app input[type=date].form-control,
.pxer-app input[type=time].form-control,
.pxer-app input[type=datetime-local].form-control,
.pxer-app input[type=month].form-control {
  appearance: none;
}
.pxer-app select.form-control:-moz-focusring {
  color: transparent;
  text-shadow: 0 0 0 #495057;
}
.pxer-app select.form-control:focus::-ms-value {
  color: #495057;
  background-color: #fff;
}
.pxer-app .form-control-file,
.pxer-app .form-control-range {
  display: block;
  width: 100%;
}
.pxer-app .col-form-label {
  padding-top: calc(0.375rem + 1px);
  padding-bottom: calc(0.375rem + 1px);
  margin-bottom: 0;
  font-size: inherit;
  line-height: 1.5;
}
.pxer-app .col-form-label-lg {
  padding-top: calc(0.5rem + 1px);
  padding-bottom: calc(0.5rem + 1px);
  font-size: 1.25rem;
  line-height: 1.5;
}
.pxer-app .col-form-label-sm {
  padding-top: calc(0.25rem + 1px);
  padding-bottom: calc(0.25rem + 1px);
  font-size: 0.875rem;
  line-height: 1.5;
}
.pxer-app .form-control-plaintext {
  display: block;
  width: 100%;
  padding: 0.375rem 0;
  margin-bottom: 0;
  font-size: 1rem;
  line-height: 1.5;
  color: #212529;
  background-color: transparent;
  border: solid transparent;
  border-width: 1px 0;
}
.pxer-app .form-control-plaintext.form-control-sm, .pxer-app input.form-control-plaintext.form-control,
.pxer-app select.form-control-plaintext.form-control, .pxer-app .form-control-plaintext.form-control-lg {
  padding-right: 0;
  padding-left: 0;
}
.pxer-app .form-control-sm, .pxer-app input.form-control,
.pxer-app select.form-control {
  height: calc(1.5em + 0.5rem + 2px);
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.2rem;
}
.pxer-app .form-control-lg {
  height: calc(1.5em + 1rem + 2px);
  padding: 0.5rem 1rem;
  font-size: 1.25rem;
  line-height: 1.5;
  border-radius: 0.3rem;
}
.pxer-app select.form-control[size], .pxer-app select.form-control[multiple] {
  height: auto;
}
.pxer-app textarea.form-control {
  height: auto;
}
.pxer-app .form-group {
  margin-bottom: 1rem;
}
.pxer-app .form-text {
  display: block;
  margin-top: 0.25rem;
}
.pxer-app .form-row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -5px;
  margin-left: -5px;
}
.pxer-app .form-row > .col,
.pxer-app .form-row > [class*=col-] {
  padding-right: 5px;
  padding-left: 5px;
}
.pxer-app .form-check {
  position: relative;
  display: block;
  padding-left: 1.25rem;
}
.pxer-app .form-check-input {
  position: absolute;
  margin-top: 0.3rem;
  margin-left: -1.25rem;
}
.pxer-app .form-check-input[disabled] ~ .form-check-label, .pxer-app .form-check-input:disabled ~ .form-check-label {
  color: #6c757d;
}
.pxer-app .form-check-label {
  margin-bottom: 0;
}
.pxer-app .form-check-inline {
  display: inline-flex;
  align-items: center;
  padding-left: 0;
  margin-right: 0.75rem;
}
.pxer-app .form-check-inline .form-check-input {
  position: static;
  margin-top: 0;
  margin-right: 0.3125rem;
  margin-left: 0;
}
.pxer-app .valid-feedback {
  display: none;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #28a745;
}
.pxer-app .valid-tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 5;
  display: none;
  max-width: 100%;
  padding: 0.25rem 0.5rem;
  margin-top: 0.1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #fff;
  background-color: rgba(40, 167, 69, 0.9);
  border-radius: 0.25rem;
}
.form-row > .col > .pxer-app .valid-tooltip, .form-row > [class*=col-] > .pxer-app .valid-tooltip {
  left: 5px;
}
.was-validated .pxer-app:valid ~ .valid-feedback,
.was-validated .pxer-app:valid ~ .valid-tooltip, .pxer-app.is-valid ~ .valid-feedback,
.pxer-app.is-valid ~ .valid-tooltip {
  display: block;
}
.was-validated .pxer-app .form-control:valid, .pxer-app .form-control.is-valid {
  border-color: #28a745;
  padding-right: calc(1.5em + 0.75rem) !important;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}
.was-validated .pxer-app .form-control:valid:focus, .pxer-app .form-control.is-valid:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}
.was-validated .pxer-app select.form-control:valid, .pxer-app select.form-control.is-valid {
  padding-right: 3rem !important;
  background-position: right 1.5rem center;
}
.was-validated .pxer-app textarea.form-control:valid, .pxer-app textarea.form-control.is-valid {
  padding-right: calc(1.5em + 0.75rem);
  background-position: top calc(0.375em + 0.1875rem) right calc(0.375em + 0.1875rem);
}
.was-validated .pxer-app .custom-select:valid, .pxer-app .custom-select.is-valid {
  border-color: #28a745;
  padding-right: calc(0.75em + 2.3125rem) !important;
  background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e") right 0.75rem center/8px 10px no-repeat, #fff url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e") center right 1.75rem/calc(0.75em + 0.375rem) calc(0.75em + 0.375rem) no-repeat;
}
.was-validated .pxer-app .custom-select:valid:focus, .pxer-app .custom-select.is-valid:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}
.was-validated .pxer-app .form-check-input:valid ~ .form-check-label, .pxer-app .form-check-input.is-valid ~ .form-check-label {
  color: #28a745;
}
.was-validated .pxer-app .form-check-input:valid ~ .valid-feedback,
.was-validated .pxer-app .form-check-input:valid ~ .valid-tooltip, .pxer-app .form-check-input.is-valid ~ .valid-feedback,
.pxer-app .form-check-input.is-valid ~ .valid-tooltip {
  display: block;
}
.was-validated .pxer-app .custom-control-input:valid ~ .custom-control-label, .pxer-app .custom-control-input.is-valid ~ .custom-control-label {
  color: #28a745;
}
.was-validated .pxer-app .custom-control-input:valid ~ .custom-control-label::before, .pxer-app .custom-control-input.is-valid ~ .custom-control-label::before {
  border-color: #28a745;
}
.was-validated .pxer-app .custom-control-input:valid:checked ~ .custom-control-label::before, .pxer-app .custom-control-input.is-valid:checked ~ .custom-control-label::before {
  border-color: #34ce57;
  background-color: #34ce57;
}
.was-validated .pxer-app .custom-control-input:valid:focus ~ .custom-control-label::before, .pxer-app .custom-control-input.is-valid:focus ~ .custom-control-label::before {
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}
.was-validated .pxer-app .custom-control-input:valid:focus:not(:checked) ~ .custom-control-label::before, .pxer-app .custom-control-input.is-valid:focus:not(:checked) ~ .custom-control-label::before {
  border-color: #28a745;
}
.was-validated .pxer-app .custom-file-input:valid ~ .custom-file-label, .pxer-app .custom-file-input.is-valid ~ .custom-file-label {
  border-color: #28a745;
}
.was-validated .pxer-app .custom-file-input:valid:focus ~ .custom-file-label, .pxer-app .custom-file-input.is-valid:focus ~ .custom-file-label {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}
.pxer-app .invalid-feedback {
  display: none;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}
.pxer-app .invalid-tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 5;
  display: none;
  max-width: 100%;
  padding: 0.25rem 0.5rem;
  margin-top: 0.1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #fff;
  background-color: rgba(220, 53, 69, 0.9);
  border-radius: 0.25rem;
}
.form-row > .col > .pxer-app .invalid-tooltip, .form-row > [class*=col-] > .pxer-app .invalid-tooltip {
  left: 5px;
}
.was-validated .pxer-app:invalid ~ .invalid-feedback,
.was-validated .pxer-app:invalid ~ .invalid-tooltip, .pxer-app.is-invalid ~ .invalid-feedback,
.pxer-app.is-invalid ~ .invalid-tooltip {
  display: block;
}
.was-validated .pxer-app .form-control:invalid, .pxer-app .form-control.is-invalid {
  border-color: #dc3545;
  padding-right: calc(1.5em + 0.75rem) !important;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}
.was-validated .pxer-app .form-control:invalid:focus, .pxer-app .form-control.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}
.was-validated .pxer-app select.form-control:invalid, .pxer-app select.form-control.is-invalid {
  padding-right: 3rem !important;
  background-position: right 1.5rem center;
}
.was-validated .pxer-app textarea.form-control:invalid, .pxer-app textarea.form-control.is-invalid {
  padding-right: calc(1.5em + 0.75rem);
  background-position: top calc(0.375em + 0.1875rem) right calc(0.375em + 0.1875rem);
}
.was-validated .pxer-app .custom-select:invalid, .pxer-app .custom-select.is-invalid {
  border-color: #dc3545;
  padding-right: calc(0.75em + 2.3125rem) !important;
  background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e") right 0.75rem center/8px 10px no-repeat, #fff url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e") center right 1.75rem/calc(0.75em + 0.375rem) calc(0.75em + 0.375rem) no-repeat;
}
.was-validated .pxer-app .custom-select:invalid:focus, .pxer-app .custom-select.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}
.was-validated .pxer-app .form-check-input:invalid ~ .form-check-label, .pxer-app .form-check-input.is-invalid ~ .form-check-label {
  color: #dc3545;
}
.was-validated .pxer-app .form-check-input:invalid ~ .invalid-feedback,
.was-validated .pxer-app .form-check-input:invalid ~ .invalid-tooltip, .pxer-app .form-check-input.is-invalid ~ .invalid-feedback,
.pxer-app .form-check-input.is-invalid ~ .invalid-tooltip {
  display: block;
}
.was-validated .pxer-app .custom-control-input:invalid ~ .custom-control-label, .pxer-app .custom-control-input.is-invalid ~ .custom-control-label {
  color: #dc3545;
}
.was-validated .pxer-app .custom-control-input:invalid ~ .custom-control-label::before, .pxer-app .custom-control-input.is-invalid ~ .custom-control-label::before {
  border-color: #dc3545;
}
.was-validated .pxer-app .custom-control-input:invalid:checked ~ .custom-control-label::before, .pxer-app .custom-control-input.is-invalid:checked ~ .custom-control-label::before {
  border-color: #e4606d;
  background-color: #e4606d;
}
.was-validated .pxer-app .custom-control-input:invalid:focus ~ .custom-control-label::before, .pxer-app .custom-control-input.is-invalid:focus ~ .custom-control-label::before {
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}
.was-validated .pxer-app .custom-control-input:invalid:focus:not(:checked) ~ .custom-control-label::before, .pxer-app .custom-control-input.is-invalid:focus:not(:checked) ~ .custom-control-label::before {
  border-color: #dc3545;
}
.was-validated .pxer-app .custom-file-input:invalid ~ .custom-file-label, .pxer-app .custom-file-input.is-invalid ~ .custom-file-label {
  border-color: #dc3545;
}
.was-validated .pxer-app .custom-file-input:invalid:focus ~ .custom-file-label, .pxer-app .custom-file-input.is-invalid:focus ~ .custom-file-label {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}
.pxer-app .form-inline {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
}
.pxer-app .form-inline .form-check {
  width: 100%;
}
@media (min-width: 576px) {
  .pxer-app .form-inline label {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0;
  }
  .pxer-app .form-inline .form-group {
    display: flex;
    flex: 0 0 auto;
    flex-flow: row wrap;
    align-items: center;
    margin-bottom: 0;
  }
  .pxer-app .form-inline .form-control {
    display: inline-block;
    width: auto;
    vertical-align: middle;
  }
  .pxer-app .form-inline .form-control-plaintext {
    display: inline-block;
  }
  .pxer-app .form-inline .input-group,
  .pxer-app .form-inline .custom-select {
    width: auto;
  }
  .pxer-app .form-inline .form-check {
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    padding-left: 0;
  }
  .pxer-app .form-inline .form-check-input {
    position: relative;
    flex-shrink: 0;
    margin-top: 0;
    margin-right: 0.25rem;
    margin-left: 0;
  }
  .pxer-app .form-inline .custom-control {
    align-items: center;
    justify-content: center;
  }
  .pxer-app .form-inline .custom-control-label {
    margin-bottom: 0;
  }
}
.pxer-app .btn {
  display: inline-block;
  font-weight: 400;
  color: #212529;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
@media (prefers-reduced-motion: reduce) {
  .pxer-app .btn {
    transition: none;
  }
}
.pxer-app .btn:hover {
  color: #212529;
  text-decoration: none;
}
.pxer-app .btn:focus, .pxer-app .btn.focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
.pxer-app .btn.disabled, .pxer-app .btn:disabled {
  opacity: 0.65;
}
.pxer-app .btn:not(:disabled):not(.disabled) {
  cursor: pointer;
}
.pxer-app a.btn.disabled,
.pxer-app fieldset:disabled a.btn {
  pointer-events: none;
}
.pxer-app .btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}
.pxer-app .btn-primary:hover {
  color: #fff;
  background-color: #0069d9;
  border-color: #0062cc;
}
.pxer-app .btn-primary:focus, .pxer-app .btn-primary.focus {
  color: #fff;
  background-color: #0069d9;
  border-color: #0062cc;
  box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);
}
.pxer-app .btn-primary.disabled, .pxer-app .btn-primary:disabled {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}
.pxer-app .btn-primary:not(:disabled):not(.disabled):active, .pxer-app .btn-primary:not(:disabled):not(.disabled).active, .show > .pxer-app .btn-primary.dropdown-toggle {
  color: #fff;
  background-color: #0062cc;
  border-color: #005cbf;
}
.pxer-app .btn-primary:not(:disabled):not(.disabled):active:focus, .pxer-app .btn-primary:not(:disabled):not(.disabled).active:focus, .show > .pxer-app .btn-primary.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);
}
.pxer-app .btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}
.pxer-app .btn-secondary:hover {
  color: #fff;
  background-color: #5a6268;
  border-color: #545b62;
}
.pxer-app .btn-secondary:focus, .pxer-app .btn-secondary.focus {
  color: #fff;
  background-color: #5a6268;
  border-color: #545b62;
  box-shadow: 0 0 0 0.2rem rgba(130, 138, 145, 0.5);
}
.pxer-app .btn-secondary.disabled, .pxer-app .btn-secondary:disabled {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}
.pxer-app .btn-secondary:not(:disabled):not(.disabled):active, .pxer-app .btn-secondary:not(:disabled):not(.disabled).active, .show > .pxer-app .btn-secondary.dropdown-toggle {
  color: #fff;
  background-color: #545b62;
  border-color: #4e555b;
}
.pxer-app .btn-secondary:not(:disabled):not(.disabled):active:focus, .pxer-app .btn-secondary:not(:disabled):not(.disabled).active:focus, .show > .pxer-app .btn-secondary.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(130, 138, 145, 0.5);
}
.pxer-app .btn-success {
  color: #fff;
  background-color: #28a745;
  border-color: #28a745;
}
.pxer-app .btn-success:hover {
  color: #fff;
  background-color: #218838;
  border-color: #1e7e34;
}
.pxer-app .btn-success:focus, .pxer-app .btn-success.focus {
  color: #fff;
  background-color: #218838;
  border-color: #1e7e34;
  box-shadow: 0 0 0 0.2rem rgba(72, 180, 97, 0.5);
}
.pxer-app .btn-success.disabled, .pxer-app .btn-success:disabled {
  color: #fff;
  background-color: #28a745;
  border-color: #28a745;
}
.pxer-app .btn-success:not(:disabled):not(.disabled):active, .pxer-app .btn-success:not(:disabled):not(.disabled).active, .show > .pxer-app .btn-success.dropdown-toggle {
  color: #fff;
  background-color: #1e7e34;
  border-color: #1c7430;
}
.pxer-app .btn-success:not(:disabled):not(.disabled):active:focus, .pxer-app .btn-success:not(:disabled):not(.disabled).active:focus, .show > .pxer-app .btn-success.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(72, 180, 97, 0.5);
}
.pxer-app .btn-info {
  color: #fff;
  background-color: #17a2b8;
  border-color: #17a2b8;
}
.pxer-app .btn-info:hover {
  color: #fff;
  background-color: #138496;
  border-color: #117a8b;
}
.pxer-app .btn-info:focus, .pxer-app .btn-info.focus {
  color: #fff;
  background-color: #138496;
  border-color: #117a8b;
  box-shadow: 0 0 0 0.2rem rgba(58, 176, 195, 0.5);
}
.pxer-app .btn-info.disabled, .pxer-app .btn-info:disabled {
  color: #fff;
  background-color: #17a2b8;
  border-color: #17a2b8;
}
.pxer-app .btn-info:not(:disabled):not(.disabled):active, .pxer-app .btn-info:not(:disabled):not(.disabled).active, .show > .pxer-app .btn-info.dropdown-toggle {
  color: #fff;
  background-color: #117a8b;
  border-color: #10707f;
}
.pxer-app .btn-info:not(:disabled):not(.disabled):active:focus, .pxer-app .btn-info:not(:disabled):not(.disabled).active:focus, .show > .pxer-app .btn-info.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(58, 176, 195, 0.5);
}
.pxer-app .btn-warning {
  color: #212529;
  background-color: #ffc107;
  border-color: #ffc107;
}
.pxer-app .btn-warning:hover {
  color: #212529;
  background-color: #e0a800;
  border-color: #d39e00;
}
.pxer-app .btn-warning:focus, .pxer-app .btn-warning.focus {
  color: #212529;
  background-color: #e0a800;
  border-color: #d39e00;
  box-shadow: 0 0 0 0.2rem rgba(222, 170, 12, 0.5);
}
.pxer-app .btn-warning.disabled, .pxer-app .btn-warning:disabled {
  color: #212529;
  background-color: #ffc107;
  border-color: #ffc107;
}
.pxer-app .btn-warning:not(:disabled):not(.disabled):active, .pxer-app .btn-warning:not(:disabled):not(.disabled).active, .show > .pxer-app .btn-warning.dropdown-toggle {
  color: #212529;
  background-color: #d39e00;
  border-color: #c69500;
}
.pxer-app .btn-warning:not(:disabled):not(.disabled):active:focus, .pxer-app .btn-warning:not(:disabled):not(.disabled).active:focus, .show > .pxer-app .btn-warning.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(222, 170, 12, 0.5);
}
.pxer-app .btn-danger {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
}
.pxer-app .btn-danger:hover {
  color: #fff;
  background-color: #c82333;
  border-color: #bd2130;
}
.pxer-app .btn-danger:focus, .pxer-app .btn-danger.focus {
  color: #fff;
  background-color: #c82333;
  border-color: #bd2130;
  box-shadow: 0 0 0 0.2rem rgba(225, 83, 97, 0.5);
}
.pxer-app .btn-danger.disabled, .pxer-app .btn-danger:disabled {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
}
.pxer-app .btn-danger:not(:disabled):not(.disabled):active, .pxer-app .btn-danger:not(:disabled):not(.disabled).active, .show > .pxer-app .btn-danger.dropdown-toggle {
  color: #fff;
  background-color: #bd2130;
  border-color: #b21f2d;
}
.pxer-app .btn-danger:not(:disabled):not(.disabled):active:focus, .pxer-app .btn-danger:not(:disabled):not(.disabled).active:focus, .show > .pxer-app .btn-danger.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(225, 83, 97, 0.5);
}
.pxer-app .btn-light {
  color: #212529;
  background-color: #f8f9fa;
  border-color: #f8f9fa;
}
.pxer-app .btn-light:hover {
  color: #212529;
  background-color: #e2e6ea;
  border-color: #dae0e5;
}
.pxer-app .btn-light:focus, .pxer-app .btn-light.focus {
  color: #212529;
  background-color: #e2e6ea;
  border-color: #dae0e5;
  box-shadow: 0 0 0 0.2rem rgba(216, 217, 219, 0.5);
}
.pxer-app .btn-light.disabled, .pxer-app .btn-light:disabled {
  color: #212529;
  background-color: #f8f9fa;
  border-color: #f8f9fa;
}
.pxer-app .btn-light:not(:disabled):not(.disabled):active, .pxer-app .btn-light:not(:disabled):not(.disabled).active, .show > .pxer-app .btn-light.dropdown-toggle {
  color: #212529;
  background-color: #dae0e5;
  border-color: #d3d9df;
}
.pxer-app .btn-light:not(:disabled):not(.disabled):active:focus, .pxer-app .btn-light:not(:disabled):not(.disabled).active:focus, .show > .pxer-app .btn-light.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(216, 217, 219, 0.5);
}
.pxer-app .btn-dark {
  color: #fff;
  background-color: #343a40;
  border-color: #343a40;
}
.pxer-app .btn-dark:hover {
  color: #fff;
  background-color: #23272b;
  border-color: #1d2124;
}
.pxer-app .btn-dark:focus, .pxer-app .btn-dark.focus {
  color: #fff;
  background-color: #23272b;
  border-color: #1d2124;
  box-shadow: 0 0 0 0.2rem rgba(82, 88, 93, 0.5);
}
.pxer-app .btn-dark.disabled, .pxer-app .btn-dark:disabled {
  color: #fff;
  background-color: #343a40;
  border-color: #343a40;
}
.pxer-app .btn-dark:not(:disabled):not(.disabled):active, .pxer-app .btn-dark:not(:disabled):not(.disabled).active, .show > .pxer-app .btn-dark.dropdown-toggle {
  color: #fff;
  background-color: #1d2124;
  border-color: #171a1d;
}
.pxer-app .btn-dark:not(:disabled):not(.disabled):active:focus, .pxer-app .btn-dark:not(:disabled):not(.disabled).active:focus, .show > .pxer-app .btn-dark.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(82, 88, 93, 0.5);
}
.pxer-app .btn-outline-primary {
  color: #007bff;
  border-color: #007bff;
}
.pxer-app .btn-outline-primary:hover {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}
.pxer-app .btn-outline-primary:focus, .pxer-app .btn-outline-primary.focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5);
}
.pxer-app .btn-outline-primary.disabled, .pxer-app .btn-outline-primary:disabled {
  color: #007bff;
  background-color: transparent;
}
.pxer-app .btn-outline-primary:not(:disabled):not(.disabled):active, .pxer-app .btn-outline-primary:not(:disabled):not(.disabled).active, .show > .pxer-app .btn-outline-primary.dropdown-toggle {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}
.pxer-app .btn-outline-primary:not(:disabled):not(.disabled):active:focus, .pxer-app .btn-outline-primary:not(:disabled):not(.disabled).active:focus, .show > .pxer-app .btn-outline-primary.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5);
}
.pxer-app .btn-outline-secondary {
  color: #6c757d;
  border-color: #6c757d;
}
.pxer-app .btn-outline-secondary:hover {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}
.pxer-app .btn-outline-secondary:focus, .pxer-app .btn-outline-secondary.focus {
  box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.5);
}
.pxer-app .btn-outline-secondary.disabled, .pxer-app .btn-outline-secondary:disabled {
  color: #6c757d;
  background-color: transparent;
}
.pxer-app .btn-outline-secondary:not(:disabled):not(.disabled):active, .pxer-app .btn-outline-secondary:not(:disabled):not(.disabled).active, .show > .pxer-app .btn-outline-secondary.dropdown-toggle {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}
.pxer-app .btn-outline-secondary:not(:disabled):not(.disabled):active:focus, .pxer-app .btn-outline-secondary:not(:disabled):not(.disabled).active:focus, .show > .pxer-app .btn-outline-secondary.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.5);
}
.pxer-app .btn-outline-success {
  color: #28a745;
  border-color: #28a745;
}
.pxer-app .btn-outline-success:hover {
  color: #fff;
  background-color: #28a745;
  border-color: #28a745;
}
.pxer-app .btn-outline-success:focus, .pxer-app .btn-outline-success.focus {
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.5);
}
.pxer-app .btn-outline-success.disabled, .pxer-app .btn-outline-success:disabled {
  color: #28a745;
  background-color: transparent;
}
.pxer-app .btn-outline-success:not(:disabled):not(.disabled):active, .pxer-app .btn-outline-success:not(:disabled):not(.disabled).active, .show > .pxer-app .btn-outline-success.dropdown-toggle {
  color: #fff;
  background-color: #28a745;
  border-color: #28a745;
}
.pxer-app .btn-outline-success:not(:disabled):not(.disabled):active:focus, .pxer-app .btn-outline-success:not(:disabled):not(.disabled).active:focus, .show > .pxer-app .btn-outline-success.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.5);
}
.pxer-app .btn-outline-info {
  color: #17a2b8;
  border-color: #17a2b8;
}
.pxer-app .btn-outline-info:hover {
  color: #fff;
  background-color: #17a2b8;
  border-color: #17a2b8;
}
.pxer-app .btn-outline-info:focus, .pxer-app .btn-outline-info.focus {
  box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5);
}
.pxer-app .btn-outline-info.disabled, .pxer-app .btn-outline-info:disabled {
  color: #17a2b8;
  background-color: transparent;
}
.pxer-app .btn-outline-info:not(:disabled):not(.disabled):active, .pxer-app .btn-outline-info:not(:disabled):not(.disabled).active, .show > .pxer-app .btn-outline-info.dropdown-toggle {
  color: #fff;
  background-color: #17a2b8;
  border-color: #17a2b8;
}
.pxer-app .btn-outline-info:not(:disabled):not(.disabled):active:focus, .pxer-app .btn-outline-info:not(:disabled):not(.disabled).active:focus, .show > .pxer-app .btn-outline-info.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5);
}
.pxer-app .btn-outline-warning {
  color: #ffc107;
  border-color: #ffc107;
}
.pxer-app .btn-outline-warning:hover {
  color: #212529;
  background-color: #ffc107;
  border-color: #ffc107;
}
.pxer-app .btn-outline-warning:focus, .pxer-app .btn-outline-warning.focus {
  box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.5);
}
.pxer-app .btn-outline-warning.disabled, .pxer-app .btn-outline-warning:disabled {
  color: #ffc107;
  background-color: transparent;
}
.pxer-app .btn-outline-warning:not(:disabled):not(.disabled):active, .pxer-app .btn-outline-warning:not(:disabled):not(.disabled).active, .show > .pxer-app .btn-outline-warning.dropdown-toggle {
  color: #212529;
  background-color: #ffc107;
  border-color: #ffc107;
}
.pxer-app .btn-outline-warning:not(:disabled):not(.disabled):active:focus, .pxer-app .btn-outline-warning:not(:disabled):not(.disabled).active:focus, .show > .pxer-app .btn-outline-warning.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.5);
}
.pxer-app .btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
}
.pxer-app .btn-outline-danger:hover {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
}
.pxer-app .btn-outline-danger:focus, .pxer-app .btn-outline-danger.focus {
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5);
}
.pxer-app .btn-outline-danger.disabled, .pxer-app .btn-outline-danger:disabled {
  color: #dc3545;
  background-color: transparent;
}
.pxer-app .btn-outline-danger:not(:disabled):not(.disabled):active, .pxer-app .btn-outline-danger:not(:disabled):not(.disabled).active, .show > .pxer-app .btn-outline-danger.dropdown-toggle {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
}
.pxer-app .btn-outline-danger:not(:disabled):not(.disabled):active:focus, .pxer-app .btn-outline-danger:not(:disabled):not(.disabled).active:focus, .show > .pxer-app .btn-outline-danger.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5);
}
.pxer-app .btn-outline-light {
  color: #f8f9fa;
  border-color: #f8f9fa;
}
.pxer-app .btn-outline-light:hover {
  color: #212529;
  background-color: #f8f9fa;
  border-color: #f8f9fa;
}
.pxer-app .btn-outline-light:focus, .pxer-app .btn-outline-light.focus {
  box-shadow: 0 0 0 0.2rem rgba(248, 249, 250, 0.5);
}
.pxer-app .btn-outline-light.disabled, .pxer-app .btn-outline-light:disabled {
  color: #f8f9fa;
  background-color: transparent;
}
.pxer-app .btn-outline-light:not(:disabled):not(.disabled):active, .pxer-app .btn-outline-light:not(:disabled):not(.disabled).active, .show > .pxer-app .btn-outline-light.dropdown-toggle {
  color: #212529;
  background-color: #f8f9fa;
  border-color: #f8f9fa;
}
.pxer-app .btn-outline-light:not(:disabled):not(.disabled):active:focus, .pxer-app .btn-outline-light:not(:disabled):not(.disabled).active:focus, .show > .pxer-app .btn-outline-light.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(248, 249, 250, 0.5);
}
.pxer-app .btn-outline-dark {
  color: #343a40;
  border-color: #343a40;
}
.pxer-app .btn-outline-dark:hover {
  color: #fff;
  background-color: #343a40;
  border-color: #343a40;
}
.pxer-app .btn-outline-dark:focus, .pxer-app .btn-outline-dark.focus {
  box-shadow: 0 0 0 0.2rem rgba(52, 58, 64, 0.5);
}
.pxer-app .btn-outline-dark.disabled, .pxer-app .btn-outline-dark:disabled {
  color: #343a40;
  background-color: transparent;
}
.pxer-app .btn-outline-dark:not(:disabled):not(.disabled):active, .pxer-app .btn-outline-dark:not(:disabled):not(.disabled).active, .show > .pxer-app .btn-outline-dark.dropdown-toggle {
  color: #fff;
  background-color: #343a40;
  border-color: #343a40;
}
.pxer-app .btn-outline-dark:not(:disabled):not(.disabled):active:focus, .pxer-app .btn-outline-dark:not(:disabled):not(.disabled).active:focus, .show > .pxer-app .btn-outline-dark.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(52, 58, 64, 0.5);
}
.pxer-app .btn-link {
  font-weight: 400;
  color: #007bff;
  text-decoration: none;
}
.pxer-app .btn-link:hover {
  color: #0056b3;
  text-decoration: underline;
}
.pxer-app .btn-link:focus, .pxer-app .btn-link.focus {
  text-decoration: underline;
}
.pxer-app .btn-link:disabled, .pxer-app .btn-link.disabled {
  color: #6c757d;
  pointer-events: none;
}
.pxer-app .btn-lg {
  padding: 0.5rem 1rem;
  font-size: 1.25rem;
  line-height: 1.5;
  border-radius: 0.3rem;
}
.pxer-app .btn-sm, .pxer-app .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.2rem;
}
.pxer-app .btn-block {
  display: block;
  width: 100%;
}
.pxer-app .btn-block + .btn-block {
  margin-top: 0.5rem;
}
.pxer-app input[type=submit].btn-block,
.pxer-app input[type=reset].btn-block,
.pxer-app input[type=button].btn-block {
  width: 100%;
}
.pxer-app .badge {
  display: inline-block;
  padding: 0.25em 0.4em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
@media (prefers-reduced-motion: reduce) {
  .pxer-app .badge {
    transition: none;
  }
}
a.pxer-app .badge:hover, a.pxer-app .badge:focus {
  text-decoration: none;
}

.pxer-app .badge:empty {
  display: none;
}
.pxer-app .btn .badge {
  position: relative;
  top: -1px;
}
.pxer-app .badge-pill {
  padding-right: 0.6em;
  padding-left: 0.6em;
  border-radius: 10rem;
}
.pxer-app .badge-primary {
  color: #fff;
  background-color: #007bff;
}
a.pxer-app .badge-primary:hover, a.pxer-app .badge-primary:focus {
  color: #fff;
  background-color: #0062cc;
}
a.pxer-app .badge-primary:focus, a.pxer-app .badge-primary.focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5);
}

.pxer-app .badge-secondary {
  color: #fff;
  background-color: #6c757d;
}
a.pxer-app .badge-secondary:hover, a.pxer-app .badge-secondary:focus {
  color: #fff;
  background-color: #545b62;
}
a.pxer-app .badge-secondary:focus, a.pxer-app .badge-secondary.focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.5);
}

.pxer-app .badge-success {
  color: #fff;
  background-color: #28a745;
}
a.pxer-app .badge-success:hover, a.pxer-app .badge-success:focus {
  color: #fff;
  background-color: #1e7e34;
}
a.pxer-app .badge-success:focus, a.pxer-app .badge-success.focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.5);
}

.pxer-app .badge-info {
  color: #fff;
  background-color: #17a2b8;
}
a.pxer-app .badge-info:hover, a.pxer-app .badge-info:focus {
  color: #fff;
  background-color: #117a8b;
}
a.pxer-app .badge-info:focus, a.pxer-app .badge-info.focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5);
}

.pxer-app .badge-warning {
  color: #212529;
  background-color: #ffc107;
}
a.pxer-app .badge-warning:hover, a.pxer-app .badge-warning:focus {
  color: #212529;
  background-color: #d39e00;
}
a.pxer-app .badge-warning:focus, a.pxer-app .badge-warning.focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.5);
}

.pxer-app .badge-danger {
  color: #fff;
  background-color: #dc3545;
}
a.pxer-app .badge-danger:hover, a.pxer-app .badge-danger:focus {
  color: #fff;
  background-color: #bd2130;
}
a.pxer-app .badge-danger:focus, a.pxer-app .badge-danger.focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5);
}

.pxer-app .badge-light {
  color: #212529;
  background-color: #f8f9fa;
}
a.pxer-app .badge-light:hover, a.pxer-app .badge-light:focus {
  color: #212529;
  background-color: #dae0e5;
}
a.pxer-app .badge-light:focus, a.pxer-app .badge-light.focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(248, 249, 250, 0.5);
}

.pxer-app .badge-dark {
  color: #fff;
  background-color: #343a40;
}
a.pxer-app .badge-dark:hover, a.pxer-app .badge-dark:focus {
  color: #fff;
  background-color: #1d2124;
}
a.pxer-app .badge-dark:focus, a.pxer-app .badge-dark.focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(52, 58, 64, 0.5);
}

.pxer-app .align-baseline {
  vertical-align: baseline !important;
}
.pxer-app .align-top {
  vertical-align: top !important;
}
.pxer-app .align-middle {
  vertical-align: middle !important;
}
.pxer-app .align-bottom {
  vertical-align: bottom !important;
}
.pxer-app .align-text-bottom {
  vertical-align: text-bottom !important;
}
.pxer-app .align-text-top {
  vertical-align: text-top !important;
}
.pxer-app .bg-primary {
  background-color: #007bff !important;
}
.pxer-app a.bg-primary:hover, .pxer-app a.bg-primary:focus,
.pxer-app button.bg-primary:hover,
.pxer-app button.bg-primary:focus {
  background-color: #0062cc !important;
}
.pxer-app .bg-secondary {
  background-color: #6c757d !important;
}
.pxer-app a.bg-secondary:hover, .pxer-app a.bg-secondary:focus,
.pxer-app button.bg-secondary:hover,
.pxer-app button.bg-secondary:focus {
  background-color: #545b62 !important;
}
.pxer-app .bg-success {
  background-color: #28a745 !important;
}
.pxer-app a.bg-success:hover, .pxer-app a.bg-success:focus,
.pxer-app button.bg-success:hover,
.pxer-app button.bg-success:focus {
  background-color: #1e7e34 !important;
}
.pxer-app .bg-info {
  background-color: #17a2b8 !important;
}
.pxer-app a.bg-info:hover, .pxer-app a.bg-info:focus,
.pxer-app button.bg-info:hover,
.pxer-app button.bg-info:focus {
  background-color: #117a8b !important;
}
.pxer-app .bg-warning {
  background-color: #ffc107 !important;
}
.pxer-app a.bg-warning:hover, .pxer-app a.bg-warning:focus,
.pxer-app button.bg-warning:hover,
.pxer-app button.bg-warning:focus {
  background-color: #d39e00 !important;
}
.pxer-app .bg-danger {
  background-color: #dc3545 !important;
}
.pxer-app a.bg-danger:hover, .pxer-app a.bg-danger:focus,
.pxer-app button.bg-danger:hover,
.pxer-app button.bg-danger:focus {
  background-color: #bd2130 !important;
}
.pxer-app .bg-light {
  background-color: #f8f9fa !important;
}
.pxer-app a.bg-light:hover, .pxer-app a.bg-light:focus,
.pxer-app button.bg-light:hover,
.pxer-app button.bg-light:focus {
  background-color: #dae0e5 !important;
}
.pxer-app .bg-dark {
  background-color: #343a40 !important;
}
.pxer-app a.bg-dark:hover, .pxer-app a.bg-dark:focus,
.pxer-app button.bg-dark:hover,
.pxer-app button.bg-dark:focus {
  background-color: #1d2124 !important;
}
.pxer-app .bg-white {
  background-color: #fff !important;
}
.pxer-app .bg-transparent {
  background-color: transparent !important;
}
.pxer-app .border {
  border: 1px solid #dee2e6 !important;
}
.pxer-app .border-top {
  border-top: 1px solid #dee2e6 !important;
}
.pxer-app .border-right {
  border-right: 1px solid #dee2e6 !important;
}
.pxer-app .border-bottom {
  border-bottom: 1px solid #dee2e6 !important;
}
.pxer-app .border-left {
  border-left: 1px solid #dee2e6 !important;
}
.pxer-app .border-0 {
  border: 0 !important;
}
.pxer-app .border-top-0 {
  border-top: 0 !important;
}
.pxer-app .border-right-0 {
  border-right: 0 !important;
}
.pxer-app .border-bottom-0 {
  border-bottom: 0 !important;
}
.pxer-app .border-left-0 {
  border-left: 0 !important;
}
.pxer-app .border-primary {
  border-color: #007bff !important;
}
.pxer-app .border-secondary {
  border-color: #6c757d !important;
}
.pxer-app .border-success {
  border-color: #28a745 !important;
}
.pxer-app .border-info {
  border-color: #17a2b8 !important;
}
.pxer-app .border-warning {
  border-color: #ffc107 !important;
}
.pxer-app .border-danger {
  border-color: #dc3545 !important;
}
.pxer-app .border-light {
  border-color: #f8f9fa !important;
}
.pxer-app .border-dark {
  border-color: #343a40 !important;
}
.pxer-app .border-white {
  border-color: #fff !important;
}
.pxer-app .rounded-sm {
  border-radius: 0.2rem !important;
}
.pxer-app .rounded {
  border-radius: 0.25rem !important;
}
.pxer-app .rounded-top {
  border-top-left-radius: 0.25rem !important;
  border-top-right-radius: 0.25rem !important;
}
.pxer-app .rounded-right {
  border-top-right-radius: 0.25rem !important;
  border-bottom-right-radius: 0.25rem !important;
}
.pxer-app .rounded-bottom {
  border-bottom-right-radius: 0.25rem !important;
  border-bottom-left-radius: 0.25rem !important;
}
.pxer-app .rounded-left {
  border-top-left-radius: 0.25rem !important;
  border-bottom-left-radius: 0.25rem !important;
}
.pxer-app .rounded-lg {
  border-radius: 0.3rem !important;
}
.pxer-app .rounded-circle {
  border-radius: 50% !important;
}
.pxer-app .rounded-pill {
  border-radius: 50rem !important;
}
.pxer-app .rounded-0 {
  border-radius: 0 !important;
}
.pxer-app .clearfix::after {
  display: block;
  clear: both;
  content: "";
}
.pxer-app .d-none {
  display: none !important;
}
.pxer-app .d-inline {
  display: inline !important;
}
.pxer-app .d-inline-block {
  display: inline-block !important;
}
.pxer-app .d-block {
  display: block !important;
}
.pxer-app .d-table {
  display: table !important;
}
.pxer-app .d-table-row {
  display: table-row !important;
}
.pxer-app .d-table-cell {
  display: table-cell !important;
}
.pxer-app .d-flex {
  display: flex !important;
}
.pxer-app .d-inline-flex {
  display: inline-flex !important;
}
@media (min-width: 576px) {
  .pxer-app .d-sm-none {
    display: none !important;
  }
  .pxer-app .d-sm-inline {
    display: inline !important;
  }
  .pxer-app .d-sm-inline-block {
    display: inline-block !important;
  }
  .pxer-app .d-sm-block {
    display: block !important;
  }
  .pxer-app .d-sm-table {
    display: table !important;
  }
  .pxer-app .d-sm-table-row {
    display: table-row !important;
  }
  .pxer-app .d-sm-table-cell {
    display: table-cell !important;
  }
  .pxer-app .d-sm-flex {
    display: flex !important;
  }
  .pxer-app .d-sm-inline-flex {
    display: inline-flex !important;
  }
}
@media (min-width: 768px) {
  .pxer-app .d-md-none {
    display: none !important;
  }
  .pxer-app .d-md-inline {
    display: inline !important;
  }
  .pxer-app .d-md-inline-block {
    display: inline-block !important;
  }
  .pxer-app .d-md-block {
    display: block !important;
  }
  .pxer-app .d-md-table {
    display: table !important;
  }
  .pxer-app .d-md-table-row {
    display: table-row !important;
  }
  .pxer-app .d-md-table-cell {
    display: table-cell !important;
  }
  .pxer-app .d-md-flex {
    display: flex !important;
  }
  .pxer-app .d-md-inline-flex {
    display: inline-flex !important;
  }
}
@media (min-width: 992px) {
  .pxer-app .d-lg-none {
    display: none !important;
  }
  .pxer-app .d-lg-inline {
    display: inline !important;
  }
  .pxer-app .d-lg-inline-block {
    display: inline-block !important;
  }
  .pxer-app .d-lg-block {
    display: block !important;
  }
  .pxer-app .d-lg-table {
    display: table !important;
  }
  .pxer-app .d-lg-table-row {
    display: table-row !important;
  }
  .pxer-app .d-lg-table-cell {
    display: table-cell !important;
  }
  .pxer-app .d-lg-flex {
    display: flex !important;
  }
  .pxer-app .d-lg-inline-flex {
    display: inline-flex !important;
  }
}
@media (min-width: 1200px) {
  .pxer-app .d-xl-none {
    display: none !important;
  }
  .pxer-app .d-xl-inline {
    display: inline !important;
  }
  .pxer-app .d-xl-inline-block {
    display: inline-block !important;
  }
  .pxer-app .d-xl-block {
    display: block !important;
  }
  .pxer-app .d-xl-table {
    display: table !important;
  }
  .pxer-app .d-xl-table-row {
    display: table-row !important;
  }
  .pxer-app .d-xl-table-cell {
    display: table-cell !important;
  }
  .pxer-app .d-xl-flex {
    display: flex !important;
  }
  .pxer-app .d-xl-inline-flex {
    display: inline-flex !important;
  }
}
@media print {
  .pxer-app .d-print-none {
    display: none !important;
  }
  .pxer-app .d-print-inline {
    display: inline !important;
  }
  .pxer-app .d-print-inline-block {
    display: inline-block !important;
  }
  .pxer-app .d-print-block {
    display: block !important;
  }
  .pxer-app .d-print-table {
    display: table !important;
  }
  .pxer-app .d-print-table-row {
    display: table-row !important;
  }
  .pxer-app .d-print-table-cell {
    display: table-cell !important;
  }
  .pxer-app .d-print-flex {
    display: flex !important;
  }
  .pxer-app .d-print-inline-flex {
    display: inline-flex !important;
  }
}
.pxer-app .embed-responsive {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  overflow: hidden;
}
.pxer-app .embed-responsive::before {
  display: block;
  content: "";
}
.pxer-app .embed-responsive .embed-responsive-item,
.pxer-app .embed-responsive iframe,
.pxer-app .embed-responsive embed,
.pxer-app .embed-responsive object,
.pxer-app .embed-responsive video {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
.pxer-app .embed-responsive-21by9::before {
  padding-top: 42.85714286%;
}
.pxer-app .embed-responsive-16by9::before {
  padding-top: 56.25%;
}
.pxer-app .embed-responsive-4by3::before {
  padding-top: 75%;
}
.pxer-app .embed-responsive-1by1::before {
  padding-top: 100%;
}
.pxer-app .flex-row {
  flex-direction: row !important;
}
.pxer-app .flex-column {
  flex-direction: column !important;
}
.pxer-app .flex-row-reverse {
  flex-direction: row-reverse !important;
}
.pxer-app .flex-column-reverse {
  flex-direction: column-reverse !important;
}
.pxer-app .flex-wrap {
  flex-wrap: wrap !important;
}
.pxer-app .flex-nowrap {
  flex-wrap: nowrap !important;
}
.pxer-app .flex-wrap-reverse {
  flex-wrap: wrap-reverse !important;
}
.pxer-app .flex-fill {
  flex: 1 1 auto !important;
}
.pxer-app .flex-grow-0 {
  flex-grow: 0 !important;
}
.pxer-app .flex-grow-1 {
  flex-grow: 1 !important;
}
.pxer-app .flex-shrink-0 {
  flex-shrink: 0 !important;
}
.pxer-app .flex-shrink-1 {
  flex-shrink: 1 !important;
}
.pxer-app .justify-content-start {
  justify-content: flex-start !important;
}
.pxer-app .justify-content-end {
  justify-content: flex-end !important;
}
.pxer-app .justify-content-center {
  justify-content: center !important;
}
.pxer-app .justify-content-between {
  justify-content: space-between !important;
}
.pxer-app .justify-content-around {
  justify-content: space-around !important;
}
.pxer-app .align-items-start {
  align-items: flex-start !important;
}
.pxer-app .align-items-end {
  align-items: flex-end !important;
}
.pxer-app .align-items-center {
  align-items: center !important;
}
.pxer-app .align-items-baseline {
  align-items: baseline !important;
}
.pxer-app .align-items-stretch {
  align-items: stretch !important;
}
.pxer-app .align-content-start {
  align-content: flex-start !important;
}
.pxer-app .align-content-end {
  align-content: flex-end !important;
}
.pxer-app .align-content-center {
  align-content: center !important;
}
.pxer-app .align-content-between {
  align-content: space-between !important;
}
.pxer-app .align-content-around {
  align-content: space-around !important;
}
.pxer-app .align-content-stretch {
  align-content: stretch !important;
}
.pxer-app .align-self-auto {
  align-self: auto !important;
}
.pxer-app .align-self-start {
  align-self: flex-start !important;
}
.pxer-app .align-self-end {
  align-self: flex-end !important;
}
.pxer-app .align-self-center {
  align-self: center !important;
}
.pxer-app .align-self-baseline {
  align-self: baseline !important;
}
.pxer-app .align-self-stretch {
  align-self: stretch !important;
}
@media (min-width: 576px) {
  .pxer-app .flex-sm-row {
    flex-direction: row !important;
  }
  .pxer-app .flex-sm-column {
    flex-direction: column !important;
  }
  .pxer-app .flex-sm-row-reverse {
    flex-direction: row-reverse !important;
  }
  .pxer-app .flex-sm-column-reverse {
    flex-direction: column-reverse !important;
  }
  .pxer-app .flex-sm-wrap {
    flex-wrap: wrap !important;
  }
  .pxer-app .flex-sm-nowrap {
    flex-wrap: nowrap !important;
  }
  .pxer-app .flex-sm-wrap-reverse {
    flex-wrap: wrap-reverse !important;
  }
  .pxer-app .flex-sm-fill {
    flex: 1 1 auto !important;
  }
  .pxer-app .flex-sm-grow-0 {
    flex-grow: 0 !important;
  }
  .pxer-app .flex-sm-grow-1 {
    flex-grow: 1 !important;
  }
  .pxer-app .flex-sm-shrink-0 {
    flex-shrink: 0 !important;
  }
  .pxer-app .flex-sm-shrink-1 {
    flex-shrink: 1 !important;
  }
  .pxer-app .justify-content-sm-start {
    justify-content: flex-start !important;
  }
  .pxer-app .justify-content-sm-end {
    justify-content: flex-end !important;
  }
  .pxer-app .justify-content-sm-center {
    justify-content: center !important;
  }
  .pxer-app .justify-content-sm-between {
    justify-content: space-between !important;
  }
  .pxer-app .justify-content-sm-around {
    justify-content: space-around !important;
  }
  .pxer-app .align-items-sm-start {
    align-items: flex-start !important;
  }
  .pxer-app .align-items-sm-end {
    align-items: flex-end !important;
  }
  .pxer-app .align-items-sm-center {
    align-items: center !important;
  }
  .pxer-app .align-items-sm-baseline {
    align-items: baseline !important;
  }
  .pxer-app .align-items-sm-stretch {
    align-items: stretch !important;
  }
  .pxer-app .align-content-sm-start {
    align-content: flex-start !important;
  }
  .pxer-app .align-content-sm-end {
    align-content: flex-end !important;
  }
  .pxer-app .align-content-sm-center {
    align-content: center !important;
  }
  .pxer-app .align-content-sm-between {
    align-content: space-between !important;
  }
  .pxer-app .align-content-sm-around {
    align-content: space-around !important;
  }
  .pxer-app .align-content-sm-stretch {
    align-content: stretch !important;
  }
  .pxer-app .align-self-sm-auto {
    align-self: auto !important;
  }
  .pxer-app .align-self-sm-start {
    align-self: flex-start !important;
  }
  .pxer-app .align-self-sm-end {
    align-self: flex-end !important;
  }
  .pxer-app .align-self-sm-center {
    align-self: center !important;
  }
  .pxer-app .align-self-sm-baseline {
    align-self: baseline !important;
  }
  .pxer-app .align-self-sm-stretch {
    align-self: stretch !important;
  }
}
@media (min-width: 768px) {
  .pxer-app .flex-md-row {
    flex-direction: row !important;
  }
  .pxer-app .flex-md-column {
    flex-direction: column !important;
  }
  .pxer-app .flex-md-row-reverse {
    flex-direction: row-reverse !important;
  }
  .pxer-app .flex-md-column-reverse {
    flex-direction: column-reverse !important;
  }
  .pxer-app .flex-md-wrap {
    flex-wrap: wrap !important;
  }
  .pxer-app .flex-md-nowrap {
    flex-wrap: nowrap !important;
  }
  .pxer-app .flex-md-wrap-reverse {
    flex-wrap: wrap-reverse !important;
  }
  .pxer-app .flex-md-fill {
    flex: 1 1 auto !important;
  }
  .pxer-app .flex-md-grow-0 {
    flex-grow: 0 !important;
  }
  .pxer-app .flex-md-grow-1 {
    flex-grow: 1 !important;
  }
  .pxer-app .flex-md-shrink-0 {
    flex-shrink: 0 !important;
  }
  .pxer-app .flex-md-shrink-1 {
    flex-shrink: 1 !important;
  }
  .pxer-app .justify-content-md-start {
    justify-content: flex-start !important;
  }
  .pxer-app .justify-content-md-end {
    justify-content: flex-end !important;
  }
  .pxer-app .justify-content-md-center {
    justify-content: center !important;
  }
  .pxer-app .justify-content-md-between {
    justify-content: space-between !important;
  }
  .pxer-app .justify-content-md-around {
    justify-content: space-around !important;
  }
  .pxer-app .align-items-md-start {
    align-items: flex-start !important;
  }
  .pxer-app .align-items-md-end {
    align-items: flex-end !important;
  }
  .pxer-app .align-items-md-center {
    align-items: center !important;
  }
  .pxer-app .align-items-md-baseline {
    align-items: baseline !important;
  }
  .pxer-app .align-items-md-stretch {
    align-items: stretch !important;
  }
  .pxer-app .align-content-md-start {
    align-content: flex-start !important;
  }
  .pxer-app .align-content-md-end {
    align-content: flex-end !important;
  }
  .pxer-app .align-content-md-center {
    align-content: center !important;
  }
  .pxer-app .align-content-md-between {
    align-content: space-between !important;
  }
  .pxer-app .align-content-md-around {
    align-content: space-around !important;
  }
  .pxer-app .align-content-md-stretch {
    align-content: stretch !important;
  }
  .pxer-app .align-self-md-auto {
    align-self: auto !important;
  }
  .pxer-app .align-self-md-start {
    align-self: flex-start !important;
  }
  .pxer-app .align-self-md-end {
    align-self: flex-end !important;
  }
  .pxer-app .align-self-md-center {
    align-self: center !important;
  }
  .pxer-app .align-self-md-baseline {
    align-self: baseline !important;
  }
  .pxer-app .align-self-md-stretch {
    align-self: stretch !important;
  }
}
@media (min-width: 992px) {
  .pxer-app .flex-lg-row {
    flex-direction: row !important;
  }
  .pxer-app .flex-lg-column {
    flex-direction: column !important;
  }
  .pxer-app .flex-lg-row-reverse {
    flex-direction: row-reverse !important;
  }
  .pxer-app .flex-lg-column-reverse {
    flex-direction: column-reverse !important;
  }
  .pxer-app .flex-lg-wrap {
    flex-wrap: wrap !important;
  }
  .pxer-app .flex-lg-nowrap {
    flex-wrap: nowrap !important;
  }
  .pxer-app .flex-lg-wrap-reverse {
    flex-wrap: wrap-reverse !important;
  }
  .pxer-app .flex-lg-fill {
    flex: 1 1 auto !important;
  }
  .pxer-app .flex-lg-grow-0 {
    flex-grow: 0 !important;
  }
  .pxer-app .flex-lg-grow-1 {
    flex-grow: 1 !important;
  }
  .pxer-app .flex-lg-shrink-0 {
    flex-shrink: 0 !important;
  }
  .pxer-app .flex-lg-shrink-1 {
    flex-shrink: 1 !important;
  }
  .pxer-app .justify-content-lg-start {
    justify-content: flex-start !important;
  }
  .pxer-app .justify-content-lg-end {
    justify-content: flex-end !important;
  }
  .pxer-app .justify-content-lg-center {
    justify-content: center !important;
  }
  .pxer-app .justify-content-lg-between {
    justify-content: space-between !important;
  }
  .pxer-app .justify-content-lg-around {
    justify-content: space-around !important;
  }
  .pxer-app .align-items-lg-start {
    align-items: flex-start !important;
  }
  .pxer-app .align-items-lg-end {
    align-items: flex-end !important;
  }
  .pxer-app .align-items-lg-center {
    align-items: center !important;
  }
  .pxer-app .align-items-lg-baseline {
    align-items: baseline !important;
  }
  .pxer-app .align-items-lg-stretch {
    align-items: stretch !important;
  }
  .pxer-app .align-content-lg-start {
    align-content: flex-start !important;
  }
  .pxer-app .align-content-lg-end {
    align-content: flex-end !important;
  }
  .pxer-app .align-content-lg-center {
    align-content: center !important;
  }
  .pxer-app .align-content-lg-between {
    align-content: space-between !important;
  }
  .pxer-app .align-content-lg-around {
    align-content: space-around !important;
  }
  .pxer-app .align-content-lg-stretch {
    align-content: stretch !important;
  }
  .pxer-app .align-self-lg-auto {
    align-self: auto !important;
  }
  .pxer-app .align-self-lg-start {
    align-self: flex-start !important;
  }
  .pxer-app .align-self-lg-end {
    align-self: flex-end !important;
  }
  .pxer-app .align-self-lg-center {
    align-self: center !important;
  }
  .pxer-app .align-self-lg-baseline {
    align-self: baseline !important;
  }
  .pxer-app .align-self-lg-stretch {
    align-self: stretch !important;
  }
}
@media (min-width: 1200px) {
  .pxer-app .flex-xl-row {
    flex-direction: row !important;
  }
  .pxer-app .flex-xl-column {
    flex-direction: column !important;
  }
  .pxer-app .flex-xl-row-reverse {
    flex-direction: row-reverse !important;
  }
  .pxer-app .flex-xl-column-reverse {
    flex-direction: column-reverse !important;
  }
  .pxer-app .flex-xl-wrap {
    flex-wrap: wrap !important;
  }
  .pxer-app .flex-xl-nowrap {
    flex-wrap: nowrap !important;
  }
  .pxer-app .flex-xl-wrap-reverse {
    flex-wrap: wrap-reverse !important;
  }
  .pxer-app .flex-xl-fill {
    flex: 1 1 auto !important;
  }
  .pxer-app .flex-xl-grow-0 {
    flex-grow: 0 !important;
  }
  .pxer-app .flex-xl-grow-1 {
    flex-grow: 1 !important;
  }
  .pxer-app .flex-xl-shrink-0 {
    flex-shrink: 0 !important;
  }
  .pxer-app .flex-xl-shrink-1 {
    flex-shrink: 1 !important;
  }
  .pxer-app .justify-content-xl-start {
    justify-content: flex-start !important;
  }
  .pxer-app .justify-content-xl-end {
    justify-content: flex-end !important;
  }
  .pxer-app .justify-content-xl-center {
    justify-content: center !important;
  }
  .pxer-app .justify-content-xl-between {
    justify-content: space-between !important;
  }
  .pxer-app .justify-content-xl-around {
    justify-content: space-around !important;
  }
  .pxer-app .align-items-xl-start {
    align-items: flex-start !important;
  }
  .pxer-app .align-items-xl-end {
    align-items: flex-end !important;
  }
  .pxer-app .align-items-xl-center {
    align-items: center !important;
  }
  .pxer-app .align-items-xl-baseline {
    align-items: baseline !important;
  }
  .pxer-app .align-items-xl-stretch {
    align-items: stretch !important;
  }
  .pxer-app .align-content-xl-start {
    align-content: flex-start !important;
  }
  .pxer-app .align-content-xl-end {
    align-content: flex-end !important;
  }
  .pxer-app .align-content-xl-center {
    align-content: center !important;
  }
  .pxer-app .align-content-xl-between {
    align-content: space-between !important;
  }
  .pxer-app .align-content-xl-around {
    align-content: space-around !important;
  }
  .pxer-app .align-content-xl-stretch {
    align-content: stretch !important;
  }
  .pxer-app .align-self-xl-auto {
    align-self: auto !important;
  }
  .pxer-app .align-self-xl-start {
    align-self: flex-start !important;
  }
  .pxer-app .align-self-xl-end {
    align-self: flex-end !important;
  }
  .pxer-app .align-self-xl-center {
    align-self: center !important;
  }
  .pxer-app .align-self-xl-baseline {
    align-self: baseline !important;
  }
  .pxer-app .align-self-xl-stretch {
    align-self: stretch !important;
  }
}
.pxer-app .float-left {
  float: left !important;
}
.pxer-app .float-right {
  float: right !important;
}
.pxer-app .float-none {
  float: none !important;
}
@media (min-width: 576px) {
  .pxer-app .float-sm-left {
    float: left !important;
  }
  .pxer-app .float-sm-right {
    float: right !important;
  }
  .pxer-app .float-sm-none {
    float: none !important;
  }
}
@media (min-width: 768px) {
  .pxer-app .float-md-left {
    float: left !important;
  }
  .pxer-app .float-md-right {
    float: right !important;
  }
  .pxer-app .float-md-none {
    float: none !important;
  }
}
@media (min-width: 992px) {
  .pxer-app .float-lg-left {
    float: left !important;
  }
  .pxer-app .float-lg-right {
    float: right !important;
  }
  .pxer-app .float-lg-none {
    float: none !important;
  }
}
@media (min-width: 1200px) {
  .pxer-app .float-xl-left {
    float: left !important;
  }
  .pxer-app .float-xl-right {
    float: right !important;
  }
  .pxer-app .float-xl-none {
    float: none !important;
  }
}
.pxer-app .user-select-all {
  user-select: all !important;
}
.pxer-app .user-select-auto {
  user-select: auto !important;
}
.pxer-app .user-select-none {
  user-select: none !important;
}
.pxer-app .overflow-auto {
  overflow: auto !important;
}
.pxer-app .overflow-hidden {
  overflow: hidden !important;
}
.pxer-app .position-static {
  position: static !important;
}
.pxer-app .position-relative {
  position: relative !important;
}
.pxer-app .position-absolute {
  position: absolute !important;
}
.pxer-app .position-fixed {
  position: fixed !important;
}
.pxer-app .position-sticky {
  position: sticky !important;
}
.pxer-app .fixed-top {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;
}
.pxer-app .fixed-bottom {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1030;
}
@supports (position: sticky) {
  .pxer-app .sticky-top {
    position: sticky;
    top: 0;
    z-index: 1020;
  }
}
.pxer-app .sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.pxer-app .sr-only-focusable:active, .pxer-app .sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
.pxer-app .shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}
.pxer-app .shadow {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
.pxer-app .shadow-lg {
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important;
}
.pxer-app .shadow-none {
  box-shadow: none !important;
}
.pxer-app .w-25 {
  width: 25% !important;
}
.pxer-app .w-50 {
  width: 50% !important;
}
.pxer-app .w-75 {
  width: 75% !important;
}
.pxer-app .w-100 {
  width: 100% !important;
}
.pxer-app .w-auto {
  width: auto !important;
}
.pxer-app .h-25 {
  height: 25% !important;
}
.pxer-app .h-50 {
  height: 50% !important;
}
.pxer-app .h-75 {
  height: 75% !important;
}
.pxer-app .h-100 {
  height: 100% !important;
}
.pxer-app .h-auto {
  height: auto !important;
}
.pxer-app .mw-100 {
  max-width: 100% !important;
}
.pxer-app .mh-100 {
  max-height: 100% !important;
}
.pxer-app .min-vw-100 {
  min-width: 100vw !important;
}
.pxer-app .min-vh-100 {
  min-height: 100vh !important;
}
.pxer-app .vw-100 {
  width: 100vw !important;
}
.pxer-app .vh-100 {
  height: 100vh !important;
}
.pxer-app .m-0 {
  margin: 0 !important;
}
.pxer-app .mt-0,
.pxer-app .my-0 {
  margin-top: 0 !important;
}
.pxer-app .mr-0,
.pxer-app .mx-0 {
  margin-right: 0 !important;
}
.pxer-app .mb-0,
.pxer-app .my-0 {
  margin-bottom: 0 !important;
}
.pxer-app .ml-0,
.pxer-app .mx-0 {
  margin-left: 0 !important;
}
.pxer-app .m-1 {
  margin: 0.25rem !important;
}
.pxer-app .mt-1,
.pxer-app .my-1 {
  margin-top: 0.25rem !important;
}
.pxer-app .mr-1,
.pxer-app .mx-1 {
  margin-right: 0.25rem !important;
}
.pxer-app .mb-1,
.pxer-app .my-1 {
  margin-bottom: 0.25rem !important;
}
.pxer-app .ml-1,
.pxer-app .mx-1 {
  margin-left: 0.25rem !important;
}
.pxer-app .m-2 {
  margin: 0.5rem !important;
}
.pxer-app .mt-2,
.pxer-app .my-2 {
  margin-top: 0.5rem !important;
}
.pxer-app .mr-2,
.pxer-app .mx-2 {
  margin-right: 0.5rem !important;
}
.pxer-app .mb-2,
.pxer-app .my-2 {
  margin-bottom: 0.5rem !important;
}
.pxer-app .ml-2,
.pxer-app .mx-2 {
  margin-left: 0.5rem !important;
}
.pxer-app .m-3 {
  margin: 1rem !important;
}
.pxer-app .mt-3,
.pxer-app .my-3 {
  margin-top: 1rem !important;
}
.pxer-app .mr-3,
.pxer-app .mx-3 {
  margin-right: 1rem !important;
}
.pxer-app .mb-3,
.pxer-app .my-3 {
  margin-bottom: 1rem !important;
}
.pxer-app .ml-3,
.pxer-app .mx-3 {
  margin-left: 1rem !important;
}
.pxer-app .m-4 {
  margin: 1.5rem !important;
}
.pxer-app .mt-4,
.pxer-app .my-4 {
  margin-top: 1.5rem !important;
}
.pxer-app .mr-4,
.pxer-app .mx-4 {
  margin-right: 1.5rem !important;
}
.pxer-app .mb-4,
.pxer-app .my-4 {
  margin-bottom: 1.5rem !important;
}
.pxer-app .ml-4,
.pxer-app .mx-4 {
  margin-left: 1.5rem !important;
}
.pxer-app .m-5 {
  margin: 3rem !important;
}
.pxer-app .mt-5,
.pxer-app .my-5 {
  margin-top: 3rem !important;
}
.pxer-app .mr-5,
.pxer-app .mx-5 {
  margin-right: 3rem !important;
}
.pxer-app .mb-5,
.pxer-app .my-5 {
  margin-bottom: 3rem !important;
}
.pxer-app .ml-5,
.pxer-app .mx-5 {
  margin-left: 3rem !important;
}
.pxer-app .p-0 {
  padding: 0 !important;
}
.pxer-app .pt-0,
.pxer-app .py-0 {
  padding-top: 0 !important;
}
.pxer-app .pr-0,
.pxer-app .px-0 {
  padding-right: 0 !important;
}
.pxer-app .pb-0,
.pxer-app .py-0 {
  padding-bottom: 0 !important;
}
.pxer-app .pl-0,
.pxer-app .px-0 {
  padding-left: 0 !important;
}
.pxer-app .p-1 {
  padding: 0.25rem !important;
}
.pxer-app .pt-1,
.pxer-app .py-1 {
  padding-top: 0.25rem !important;
}
.pxer-app .pr-1,
.pxer-app .px-1 {
  padding-right: 0.25rem !important;
}
.pxer-app .pb-1,
.pxer-app .py-1 {
  padding-bottom: 0.25rem !important;
}
.pxer-app .pl-1,
.pxer-app .px-1 {
  padding-left: 0.25rem !important;
}
.pxer-app .p-2 {
  padding: 0.5rem !important;
}
.pxer-app .pt-2,
.pxer-app .py-2 {
  padding-top: 0.5rem !important;
}
.pxer-app .pr-2,
.pxer-app .px-2 {
  padding-right: 0.5rem !important;
}
.pxer-app .pb-2,
.pxer-app .py-2 {
  padding-bottom: 0.5rem !important;
}
.pxer-app .pl-2,
.pxer-app .px-2 {
  padding-left: 0.5rem !important;
}
.pxer-app .p-3 {
  padding: 1rem !important;
}
.pxer-app .pt-3,
.pxer-app .py-3 {
  padding-top: 1rem !important;
}
.pxer-app .pr-3,
.pxer-app .px-3 {
  padding-right: 1rem !important;
}
.pxer-app .pb-3,
.pxer-app .py-3 {
  padding-bottom: 1rem !important;
}
.pxer-app .pl-3,
.pxer-app .px-3 {
  padding-left: 1rem !important;
}
.pxer-app .p-4 {
  padding: 1.5rem !important;
}
.pxer-app .pt-4,
.pxer-app .py-4 {
  padding-top: 1.5rem !important;
}
.pxer-app .pr-4,
.pxer-app .px-4 {
  padding-right: 1.5rem !important;
}
.pxer-app .pb-4,
.pxer-app .py-4 {
  padding-bottom: 1.5rem !important;
}
.pxer-app .pl-4,
.pxer-app .px-4 {
  padding-left: 1.5rem !important;
}
.pxer-app .p-5 {
  padding: 3rem !important;
}
.pxer-app .pt-5,
.pxer-app .py-5 {
  padding-top: 3rem !important;
}
.pxer-app .pr-5,
.pxer-app .px-5 {
  padding-right: 3rem !important;
}
.pxer-app .pb-5,
.pxer-app .py-5 {
  padding-bottom: 3rem !important;
}
.pxer-app .pl-5,
.pxer-app .px-5 {
  padding-left: 3rem !important;
}
.pxer-app .m-n1 {
  margin: -0.25rem !important;
}
.pxer-app .mt-n1,
.pxer-app .my-n1 {
  margin-top: -0.25rem !important;
}
.pxer-app .mr-n1,
.pxer-app .mx-n1 {
  margin-right: -0.25rem !important;
}
.pxer-app .mb-n1,
.pxer-app .my-n1 {
  margin-bottom: -0.25rem !important;
}
.pxer-app .ml-n1,
.pxer-app .mx-n1 {
  margin-left: -0.25rem !important;
}
.pxer-app .m-n2 {
  margin: -0.5rem !important;
}
.pxer-app .mt-n2,
.pxer-app .my-n2 {
  margin-top: -0.5rem !important;
}
.pxer-app .mr-n2,
.pxer-app .mx-n2 {
  margin-right: -0.5rem !important;
}
.pxer-app .mb-n2,
.pxer-app .my-n2 {
  margin-bottom: -0.5rem !important;
}
.pxer-app .ml-n2,
.pxer-app .mx-n2 {
  margin-left: -0.5rem !important;
}
.pxer-app .m-n3 {
  margin: -1rem !important;
}
.pxer-app .mt-n3,
.pxer-app .my-n3 {
  margin-top: -1rem !important;
}
.pxer-app .mr-n3,
.pxer-app .mx-n3 {
  margin-right: -1rem !important;
}
.pxer-app .mb-n3,
.pxer-app .my-n3 {
  margin-bottom: -1rem !important;
}
.pxer-app .ml-n3,
.pxer-app .mx-n3 {
  margin-left: -1rem !important;
}
.pxer-app .m-n4 {
  margin: -1.5rem !important;
}
.pxer-app .mt-n4,
.pxer-app .my-n4 {
  margin-top: -1.5rem !important;
}
.pxer-app .mr-n4,
.pxer-app .mx-n4 {
  margin-right: -1.5rem !important;
}
.pxer-app .mb-n4,
.pxer-app .my-n4 {
  margin-bottom: -1.5rem !important;
}
.pxer-app .ml-n4,
.pxer-app .mx-n4 {
  margin-left: -1.5rem !important;
}
.pxer-app .m-n5 {
  margin: -3rem !important;
}
.pxer-app .mt-n5,
.pxer-app .my-n5 {
  margin-top: -3rem !important;
}
.pxer-app .mr-n5,
.pxer-app .mx-n5 {
  margin-right: -3rem !important;
}
.pxer-app .mb-n5,
.pxer-app .my-n5 {
  margin-bottom: -3rem !important;
}
.pxer-app .ml-n5,
.pxer-app .mx-n5 {
  margin-left: -3rem !important;
}
.pxer-app .m-auto {
  margin: auto !important;
}
.pxer-app .mt-auto,
.pxer-app .my-auto {
  margin-top: auto !important;
}
.pxer-app .mr-auto,
.pxer-app .mx-auto {
  margin-right: auto !important;
}
.pxer-app .mb-auto,
.pxer-app .my-auto {
  margin-bottom: auto !important;
}
.pxer-app .ml-auto,
.pxer-app .mx-auto {
  margin-left: auto !important;
}
@media (min-width: 576px) {
  .pxer-app .m-sm-0 {
    margin: 0 !important;
  }
  .pxer-app .mt-sm-0,
  .pxer-app .my-sm-0 {
    margin-top: 0 !important;
  }
  .pxer-app .mr-sm-0,
  .pxer-app .mx-sm-0 {
    margin-right: 0 !important;
  }
  .pxer-app .mb-sm-0,
  .pxer-app .my-sm-0 {
    margin-bottom: 0 !important;
  }
  .pxer-app .ml-sm-0,
  .pxer-app .mx-sm-0 {
    margin-left: 0 !important;
  }
  .pxer-app .m-sm-1 {
    margin: 0.25rem !important;
  }
  .pxer-app .mt-sm-1,
  .pxer-app .my-sm-1 {
    margin-top: 0.25rem !important;
  }
  .pxer-app .mr-sm-1,
  .pxer-app .mx-sm-1 {
    margin-right: 0.25rem !important;
  }
  .pxer-app .mb-sm-1,
  .pxer-app .my-sm-1 {
    margin-bottom: 0.25rem !important;
  }
  .pxer-app .ml-sm-1,
  .pxer-app .mx-sm-1 {
    margin-left: 0.25rem !important;
  }
  .pxer-app .m-sm-2 {
    margin: 0.5rem !important;
  }
  .pxer-app .mt-sm-2,
  .pxer-app .my-sm-2 {
    margin-top: 0.5rem !important;
  }
  .pxer-app .mr-sm-2,
  .pxer-app .mx-sm-2 {
    margin-right: 0.5rem !important;
  }
  .pxer-app .mb-sm-2,
  .pxer-app .my-sm-2 {
    margin-bottom: 0.5rem !important;
  }
  .pxer-app .ml-sm-2,
  .pxer-app .mx-sm-2 {
    margin-left: 0.5rem !important;
  }
  .pxer-app .m-sm-3 {
    margin: 1rem !important;
  }
  .pxer-app .mt-sm-3,
  .pxer-app .my-sm-3 {
    margin-top: 1rem !important;
  }
  .pxer-app .mr-sm-3,
  .pxer-app .mx-sm-3 {
    margin-right: 1rem !important;
  }
  .pxer-app .mb-sm-3,
  .pxer-app .my-sm-3 {
    margin-bottom: 1rem !important;
  }
  .pxer-app .ml-sm-3,
  .pxer-app .mx-sm-3 {
    margin-left: 1rem !important;
  }
  .pxer-app .m-sm-4 {
    margin: 1.5rem !important;
  }
  .pxer-app .mt-sm-4,
  .pxer-app .my-sm-4 {
    margin-top: 1.5rem !important;
  }
  .pxer-app .mr-sm-4,
  .pxer-app .mx-sm-4 {
    margin-right: 1.5rem !important;
  }
  .pxer-app .mb-sm-4,
  .pxer-app .my-sm-4 {
    margin-bottom: 1.5rem !important;
  }
  .pxer-app .ml-sm-4,
  .pxer-app .mx-sm-4 {
    margin-left: 1.5rem !important;
  }
  .pxer-app .m-sm-5 {
    margin: 3rem !important;
  }
  .pxer-app .mt-sm-5,
  .pxer-app .my-sm-5 {
    margin-top: 3rem !important;
  }
  .pxer-app .mr-sm-5,
  .pxer-app .mx-sm-5 {
    margin-right: 3rem !important;
  }
  .pxer-app .mb-sm-5,
  .pxer-app .my-sm-5 {
    margin-bottom: 3rem !important;
  }
  .pxer-app .ml-sm-5,
  .pxer-app .mx-sm-5 {
    margin-left: 3rem !important;
  }
  .pxer-app .p-sm-0 {
    padding: 0 !important;
  }
  .pxer-app .pt-sm-0,
  .pxer-app .py-sm-0 {
    padding-top: 0 !important;
  }
  .pxer-app .pr-sm-0,
  .pxer-app .px-sm-0 {
    padding-right: 0 !important;
  }
  .pxer-app .pb-sm-0,
  .pxer-app .py-sm-0 {
    padding-bottom: 0 !important;
  }
  .pxer-app .pl-sm-0,
  .pxer-app .px-sm-0 {
    padding-left: 0 !important;
  }
  .pxer-app .p-sm-1 {
    padding: 0.25rem !important;
  }
  .pxer-app .pt-sm-1,
  .pxer-app .py-sm-1 {
    padding-top: 0.25rem !important;
  }
  .pxer-app .pr-sm-1,
  .pxer-app .px-sm-1 {
    padding-right: 0.25rem !important;
  }
  .pxer-app .pb-sm-1,
  .pxer-app .py-sm-1 {
    padding-bottom: 0.25rem !important;
  }
  .pxer-app .pl-sm-1,
  .pxer-app .px-sm-1 {
    padding-left: 0.25rem !important;
  }
  .pxer-app .p-sm-2 {
    padding: 0.5rem !important;
  }
  .pxer-app .pt-sm-2,
  .pxer-app .py-sm-2 {
    padding-top: 0.5rem !important;
  }
  .pxer-app .pr-sm-2,
  .pxer-app .px-sm-2 {
    padding-right: 0.5rem !important;
  }
  .pxer-app .pb-sm-2,
  .pxer-app .py-sm-2 {
    padding-bottom: 0.5rem !important;
  }
  .pxer-app .pl-sm-2,
  .pxer-app .px-sm-2 {
    padding-left: 0.5rem !important;
  }
  .pxer-app .p-sm-3 {
    padding: 1rem !important;
  }
  .pxer-app .pt-sm-3,
  .pxer-app .py-sm-3 {
    padding-top: 1rem !important;
  }
  .pxer-app .pr-sm-3,
  .pxer-app .px-sm-3 {
    padding-right: 1rem !important;
  }
  .pxer-app .pb-sm-3,
  .pxer-app .py-sm-3 {
    padding-bottom: 1rem !important;
  }
  .pxer-app .pl-sm-3,
  .pxer-app .px-sm-3 {
    padding-left: 1rem !important;
  }
  .pxer-app .p-sm-4 {
    padding: 1.5rem !important;
  }
  .pxer-app .pt-sm-4,
  .pxer-app .py-sm-4 {
    padding-top: 1.5rem !important;
  }
  .pxer-app .pr-sm-4,
  .pxer-app .px-sm-4 {
    padding-right: 1.5rem !important;
  }
  .pxer-app .pb-sm-4,
  .pxer-app .py-sm-4 {
    padding-bottom: 1.5rem !important;
  }
  .pxer-app .pl-sm-4,
  .pxer-app .px-sm-4 {
    padding-left: 1.5rem !important;
  }
  .pxer-app .p-sm-5 {
    padding: 3rem !important;
  }
  .pxer-app .pt-sm-5,
  .pxer-app .py-sm-5 {
    padding-top: 3rem !important;
  }
  .pxer-app .pr-sm-5,
  .pxer-app .px-sm-5 {
    padding-right: 3rem !important;
  }
  .pxer-app .pb-sm-5,
  .pxer-app .py-sm-5 {
    padding-bottom: 3rem !important;
  }
  .pxer-app .pl-sm-5,
  .pxer-app .px-sm-5 {
    padding-left: 3rem !important;
  }
  .pxer-app .m-sm-n1 {
    margin: -0.25rem !important;
  }
  .pxer-app .mt-sm-n1,
  .pxer-app .my-sm-n1 {
    margin-top: -0.25rem !important;
  }
  .pxer-app .mr-sm-n1,
  .pxer-app .mx-sm-n1 {
    margin-right: -0.25rem !important;
  }
  .pxer-app .mb-sm-n1,
  .pxer-app .my-sm-n1 {
    margin-bottom: -0.25rem !important;
  }
  .pxer-app .ml-sm-n1,
  .pxer-app .mx-sm-n1 {
    margin-left: -0.25rem !important;
  }
  .pxer-app .m-sm-n2 {
    margin: -0.5rem !important;
  }
  .pxer-app .mt-sm-n2,
  .pxer-app .my-sm-n2 {
    margin-top: -0.5rem !important;
  }
  .pxer-app .mr-sm-n2,
  .pxer-app .mx-sm-n2 {
    margin-right: -0.5rem !important;
  }
  .pxer-app .mb-sm-n2,
  .pxer-app .my-sm-n2 {
    margin-bottom: -0.5rem !important;
  }
  .pxer-app .ml-sm-n2,
  .pxer-app .mx-sm-n2 {
    margin-left: -0.5rem !important;
  }
  .pxer-app .m-sm-n3 {
    margin: -1rem !important;
  }
  .pxer-app .mt-sm-n3,
  .pxer-app .my-sm-n3 {
    margin-top: -1rem !important;
  }
  .pxer-app .mr-sm-n3,
  .pxer-app .mx-sm-n3 {
    margin-right: -1rem !important;
  }
  .pxer-app .mb-sm-n3,
  .pxer-app .my-sm-n3 {
    margin-bottom: -1rem !important;
  }
  .pxer-app .ml-sm-n3,
  .pxer-app .mx-sm-n3 {
    margin-left: -1rem !important;
  }
  .pxer-app .m-sm-n4 {
    margin: -1.5rem !important;
  }
  .pxer-app .mt-sm-n4,
  .pxer-app .my-sm-n4 {
    margin-top: -1.5rem !important;
  }
  .pxer-app .mr-sm-n4,
  .pxer-app .mx-sm-n4 {
    margin-right: -1.5rem !important;
  }
  .pxer-app .mb-sm-n4,
  .pxer-app .my-sm-n4 {
    margin-bottom: -1.5rem !important;
  }
  .pxer-app .ml-sm-n4,
  .pxer-app .mx-sm-n4 {
    margin-left: -1.5rem !important;
  }
  .pxer-app .m-sm-n5 {
    margin: -3rem !important;
  }
  .pxer-app .mt-sm-n5,
  .pxer-app .my-sm-n5 {
    margin-top: -3rem !important;
  }
  .pxer-app .mr-sm-n5,
  .pxer-app .mx-sm-n5 {
    margin-right: -3rem !important;
  }
  .pxer-app .mb-sm-n5,
  .pxer-app .my-sm-n5 {
    margin-bottom: -3rem !important;
  }
  .pxer-app .ml-sm-n5,
  .pxer-app .mx-sm-n5 {
    margin-left: -3rem !important;
  }
  .pxer-app .m-sm-auto {
    margin: auto !important;
  }
  .pxer-app .mt-sm-auto,
  .pxer-app .my-sm-auto {
    margin-top: auto !important;
  }
  .pxer-app .mr-sm-auto,
  .pxer-app .mx-sm-auto {
    margin-right: auto !important;
  }
  .pxer-app .mb-sm-auto,
  .pxer-app .my-sm-auto {
    margin-bottom: auto !important;
  }
  .pxer-app .ml-sm-auto,
  .pxer-app .mx-sm-auto {
    margin-left: auto !important;
  }
}
@media (min-width: 768px) {
  .pxer-app .m-md-0 {
    margin: 0 !important;
  }
  .pxer-app .mt-md-0,
  .pxer-app .my-md-0 {
    margin-top: 0 !important;
  }
  .pxer-app .mr-md-0,
  .pxer-app .mx-md-0 {
    margin-right: 0 !important;
  }
  .pxer-app .mb-md-0,
  .pxer-app .my-md-0 {
    margin-bottom: 0 !important;
  }
  .pxer-app .ml-md-0,
  .pxer-app .mx-md-0 {
    margin-left: 0 !important;
  }
  .pxer-app .m-md-1 {
    margin: 0.25rem !important;
  }
  .pxer-app .mt-md-1,
  .pxer-app .my-md-1 {
    margin-top: 0.25rem !important;
  }
  .pxer-app .mr-md-1,
  .pxer-app .mx-md-1 {
    margin-right: 0.25rem !important;
  }
  .pxer-app .mb-md-1,
  .pxer-app .my-md-1 {
    margin-bottom: 0.25rem !important;
  }
  .pxer-app .ml-md-1,
  .pxer-app .mx-md-1 {
    margin-left: 0.25rem !important;
  }
  .pxer-app .m-md-2 {
    margin: 0.5rem !important;
  }
  .pxer-app .mt-md-2,
  .pxer-app .my-md-2 {
    margin-top: 0.5rem !important;
  }
  .pxer-app .mr-md-2,
  .pxer-app .mx-md-2 {
    margin-right: 0.5rem !important;
  }
  .pxer-app .mb-md-2,
  .pxer-app .my-md-2 {
    margin-bottom: 0.5rem !important;
  }
  .pxer-app .ml-md-2,
  .pxer-app .mx-md-2 {
    margin-left: 0.5rem !important;
  }
  .pxer-app .m-md-3 {
    margin: 1rem !important;
  }
  .pxer-app .mt-md-3,
  .pxer-app .my-md-3 {
    margin-top: 1rem !important;
  }
  .pxer-app .mr-md-3,
  .pxer-app .mx-md-3 {
    margin-right: 1rem !important;
  }
  .pxer-app .mb-md-3,
  .pxer-app .my-md-3 {
    margin-bottom: 1rem !important;
  }
  .pxer-app .ml-md-3,
  .pxer-app .mx-md-3 {
    margin-left: 1rem !important;
  }
  .pxer-app .m-md-4 {
    margin: 1.5rem !important;
  }
  .pxer-app .mt-md-4,
  .pxer-app .my-md-4 {
    margin-top: 1.5rem !important;
  }
  .pxer-app .mr-md-4,
  .pxer-app .mx-md-4 {
    margin-right: 1.5rem !important;
  }
  .pxer-app .mb-md-4,
  .pxer-app .my-md-4 {
    margin-bottom: 1.5rem !important;
  }
  .pxer-app .ml-md-4,
  .pxer-app .mx-md-4 {
    margin-left: 1.5rem !important;
  }
  .pxer-app .m-md-5 {
    margin: 3rem !important;
  }
  .pxer-app .mt-md-5,
  .pxer-app .my-md-5 {
    margin-top: 3rem !important;
  }
  .pxer-app .mr-md-5,
  .pxer-app .mx-md-5 {
    margin-right: 3rem !important;
  }
  .pxer-app .mb-md-5,
  .pxer-app .my-md-5 {
    margin-bottom: 3rem !important;
  }
  .pxer-app .ml-md-5,
  .pxer-app .mx-md-5 {
    margin-left: 3rem !important;
  }
  .pxer-app .p-md-0 {
    padding: 0 !important;
  }
  .pxer-app .pt-md-0,
  .pxer-app .py-md-0 {
    padding-top: 0 !important;
  }
  .pxer-app .pr-md-0,
  .pxer-app .px-md-0 {
    padding-right: 0 !important;
  }
  .pxer-app .pb-md-0,
  .pxer-app .py-md-0 {
    padding-bottom: 0 !important;
  }
  .pxer-app .pl-md-0,
  .pxer-app .px-md-0 {
    padding-left: 0 !important;
  }
  .pxer-app .p-md-1 {
    padding: 0.25rem !important;
  }
  .pxer-app .pt-md-1,
  .pxer-app .py-md-1 {
    padding-top: 0.25rem !important;
  }
  .pxer-app .pr-md-1,
  .pxer-app .px-md-1 {
    padding-right: 0.25rem !important;
  }
  .pxer-app .pb-md-1,
  .pxer-app .py-md-1 {
    padding-bottom: 0.25rem !important;
  }
  .pxer-app .pl-md-1,
  .pxer-app .px-md-1 {
    padding-left: 0.25rem !important;
  }
  .pxer-app .p-md-2 {
    padding: 0.5rem !important;
  }
  .pxer-app .pt-md-2,
  .pxer-app .py-md-2 {
    padding-top: 0.5rem !important;
  }
  .pxer-app .pr-md-2,
  .pxer-app .px-md-2 {
    padding-right: 0.5rem !important;
  }
  .pxer-app .pb-md-2,
  .pxer-app .py-md-2 {
    padding-bottom: 0.5rem !important;
  }
  .pxer-app .pl-md-2,
  .pxer-app .px-md-2 {
    padding-left: 0.5rem !important;
  }
  .pxer-app .p-md-3 {
    padding: 1rem !important;
  }
  .pxer-app .pt-md-3,
  .pxer-app .py-md-3 {
    padding-top: 1rem !important;
  }
  .pxer-app .pr-md-3,
  .pxer-app .px-md-3 {
    padding-right: 1rem !important;
  }
  .pxer-app .pb-md-3,
  .pxer-app .py-md-3 {
    padding-bottom: 1rem !important;
  }
  .pxer-app .pl-md-3,
  .pxer-app .px-md-3 {
    padding-left: 1rem !important;
  }
  .pxer-app .p-md-4 {
    padding: 1.5rem !important;
  }
  .pxer-app .pt-md-4,
  .pxer-app .py-md-4 {
    padding-top: 1.5rem !important;
  }
  .pxer-app .pr-md-4,
  .pxer-app .px-md-4 {
    padding-right: 1.5rem !important;
  }
  .pxer-app .pb-md-4,
  .pxer-app .py-md-4 {
    padding-bottom: 1.5rem !important;
  }
  .pxer-app .pl-md-4,
  .pxer-app .px-md-4 {
    padding-left: 1.5rem !important;
  }
  .pxer-app .p-md-5 {
    padding: 3rem !important;
  }
  .pxer-app .pt-md-5,
  .pxer-app .py-md-5 {
    padding-top: 3rem !important;
  }
  .pxer-app .pr-md-5,
  .pxer-app .px-md-5 {
    padding-right: 3rem !important;
  }
  .pxer-app .pb-md-5,
  .pxer-app .py-md-5 {
    padding-bottom: 3rem !important;
  }
  .pxer-app .pl-md-5,
  .pxer-app .px-md-5 {
    padding-left: 3rem !important;
  }
  .pxer-app .m-md-n1 {
    margin: -0.25rem !important;
  }
  .pxer-app .mt-md-n1,
  .pxer-app .my-md-n1 {
    margin-top: -0.25rem !important;
  }
  .pxer-app .mr-md-n1,
  .pxer-app .mx-md-n1 {
    margin-right: -0.25rem !important;
  }
  .pxer-app .mb-md-n1,
  .pxer-app .my-md-n1 {
    margin-bottom: -0.25rem !important;
  }
  .pxer-app .ml-md-n1,
  .pxer-app .mx-md-n1 {
    margin-left: -0.25rem !important;
  }
  .pxer-app .m-md-n2 {
    margin: -0.5rem !important;
  }
  .pxer-app .mt-md-n2,
  .pxer-app .my-md-n2 {
    margin-top: -0.5rem !important;
  }
  .pxer-app .mr-md-n2,
  .pxer-app .mx-md-n2 {
    margin-right: -0.5rem !important;
  }
  .pxer-app .mb-md-n2,
  .pxer-app .my-md-n2 {
    margin-bottom: -0.5rem !important;
  }
  .pxer-app .ml-md-n2,
  .pxer-app .mx-md-n2 {
    margin-left: -0.5rem !important;
  }
  .pxer-app .m-md-n3 {
    margin: -1rem !important;
  }
  .pxer-app .mt-md-n3,
  .pxer-app .my-md-n3 {
    margin-top: -1rem !important;
  }
  .pxer-app .mr-md-n3,
  .pxer-app .mx-md-n3 {
    margin-right: -1rem !important;
  }
  .pxer-app .mb-md-n3,
  .pxer-app .my-md-n3 {
    margin-bottom: -1rem !important;
  }
  .pxer-app .ml-md-n3,
  .pxer-app .mx-md-n3 {
    margin-left: -1rem !important;
  }
  .pxer-app .m-md-n4 {
    margin: -1.5rem !important;
  }
  .pxer-app .mt-md-n4,
  .pxer-app .my-md-n4 {
    margin-top: -1.5rem !important;
  }
  .pxer-app .mr-md-n4,
  .pxer-app .mx-md-n4 {
    margin-right: -1.5rem !important;
  }
  .pxer-app .mb-md-n4,
  .pxer-app .my-md-n4 {
    margin-bottom: -1.5rem !important;
  }
  .pxer-app .ml-md-n4,
  .pxer-app .mx-md-n4 {
    margin-left: -1.5rem !important;
  }
  .pxer-app .m-md-n5 {
    margin: -3rem !important;
  }
  .pxer-app .mt-md-n5,
  .pxer-app .my-md-n5 {
    margin-top: -3rem !important;
  }
  .pxer-app .mr-md-n5,
  .pxer-app .mx-md-n5 {
    margin-right: -3rem !important;
  }
  .pxer-app .mb-md-n5,
  .pxer-app .my-md-n5 {
    margin-bottom: -3rem !important;
  }
  .pxer-app .ml-md-n5,
  .pxer-app .mx-md-n5 {
    margin-left: -3rem !important;
  }
  .pxer-app .m-md-auto {
    margin: auto !important;
  }
  .pxer-app .mt-md-auto,
  .pxer-app .my-md-auto {
    margin-top: auto !important;
  }
  .pxer-app .mr-md-auto,
  .pxer-app .mx-md-auto {
    margin-right: auto !important;
  }
  .pxer-app .mb-md-auto,
  .pxer-app .my-md-auto {
    margin-bottom: auto !important;
  }
  .pxer-app .ml-md-auto,
  .pxer-app .mx-md-auto {
    margin-left: auto !important;
  }
}
@media (min-width: 992px) {
  .pxer-app .m-lg-0 {
    margin: 0 !important;
  }
  .pxer-app .mt-lg-0,
  .pxer-app .my-lg-0 {
    margin-top: 0 !important;
  }
  .pxer-app .mr-lg-0,
  .pxer-app .mx-lg-0 {
    margin-right: 0 !important;
  }
  .pxer-app .mb-lg-0,
  .pxer-app .my-lg-0 {
    margin-bottom: 0 !important;
  }
  .pxer-app .ml-lg-0,
  .pxer-app .mx-lg-0 {
    margin-left: 0 !important;
  }
  .pxer-app .m-lg-1 {
    margin: 0.25rem !important;
  }
  .pxer-app .mt-lg-1,
  .pxer-app .my-lg-1 {
    margin-top: 0.25rem !important;
  }
  .pxer-app .mr-lg-1,
  .pxer-app .mx-lg-1 {
    margin-right: 0.25rem !important;
  }
  .pxer-app .mb-lg-1,
  .pxer-app .my-lg-1 {
    margin-bottom: 0.25rem !important;
  }
  .pxer-app .ml-lg-1,
  .pxer-app .mx-lg-1 {
    margin-left: 0.25rem !important;
  }
  .pxer-app .m-lg-2 {
    margin: 0.5rem !important;
  }
  .pxer-app .mt-lg-2,
  .pxer-app .my-lg-2 {
    margin-top: 0.5rem !important;
  }
  .pxer-app .mr-lg-2,
  .pxer-app .mx-lg-2 {
    margin-right: 0.5rem !important;
  }
  .pxer-app .mb-lg-2,
  .pxer-app .my-lg-2 {
    margin-bottom: 0.5rem !important;
  }
  .pxer-app .ml-lg-2,
  .pxer-app .mx-lg-2 {
    margin-left: 0.5rem !important;
  }
  .pxer-app .m-lg-3 {
    margin: 1rem !important;
  }
  .pxer-app .mt-lg-3,
  .pxer-app .my-lg-3 {
    margin-top: 1rem !important;
  }
  .pxer-app .mr-lg-3,
  .pxer-app .mx-lg-3 {
    margin-right: 1rem !important;
  }
  .pxer-app .mb-lg-3,
  .pxer-app .my-lg-3 {
    margin-bottom: 1rem !important;
  }
  .pxer-app .ml-lg-3,
  .pxer-app .mx-lg-3 {
    margin-left: 1rem !important;
  }
  .pxer-app .m-lg-4 {
    margin: 1.5rem !important;
  }
  .pxer-app .mt-lg-4,
  .pxer-app .my-lg-4 {
    margin-top: 1.5rem !important;
  }
  .pxer-app .mr-lg-4,
  .pxer-app .mx-lg-4 {
    margin-right: 1.5rem !important;
  }
  .pxer-app .mb-lg-4,
  .pxer-app .my-lg-4 {
    margin-bottom: 1.5rem !important;
  }
  .pxer-app .ml-lg-4,
  .pxer-app .mx-lg-4 {
    margin-left: 1.5rem !important;
  }
  .pxer-app .m-lg-5 {
    margin: 3rem !important;
  }
  .pxer-app .mt-lg-5,
  .pxer-app .my-lg-5 {
    margin-top: 3rem !important;
  }
  .pxer-app .mr-lg-5,
  .pxer-app .mx-lg-5 {
    margin-right: 3rem !important;
  }
  .pxer-app .mb-lg-5,
  .pxer-app .my-lg-5 {
    margin-bottom: 3rem !important;
  }
  .pxer-app .ml-lg-5,
  .pxer-app .mx-lg-5 {
    margin-left: 3rem !important;
  }
  .pxer-app .p-lg-0 {
    padding: 0 !important;
  }
  .pxer-app .pt-lg-0,
  .pxer-app .py-lg-0 {
    padding-top: 0 !important;
  }
  .pxer-app .pr-lg-0,
  .pxer-app .px-lg-0 {
    padding-right: 0 !important;
  }
  .pxer-app .pb-lg-0,
  .pxer-app .py-lg-0 {
    padding-bottom: 0 !important;
  }
  .pxer-app .pl-lg-0,
  .pxer-app .px-lg-0 {
    padding-left: 0 !important;
  }
  .pxer-app .p-lg-1 {
    padding: 0.25rem !important;
  }
  .pxer-app .pt-lg-1,
  .pxer-app .py-lg-1 {
    padding-top: 0.25rem !important;
  }
  .pxer-app .pr-lg-1,
  .pxer-app .px-lg-1 {
    padding-right: 0.25rem !important;
  }
  .pxer-app .pb-lg-1,
  .pxer-app .py-lg-1 {
    padding-bottom: 0.25rem !important;
  }
  .pxer-app .pl-lg-1,
  .pxer-app .px-lg-1 {
    padding-left: 0.25rem !important;
  }
  .pxer-app .p-lg-2 {
    padding: 0.5rem !important;
  }
  .pxer-app .pt-lg-2,
  .pxer-app .py-lg-2 {
    padding-top: 0.5rem !important;
  }
  .pxer-app .pr-lg-2,
  .pxer-app .px-lg-2 {
    padding-right: 0.5rem !important;
  }
  .pxer-app .pb-lg-2,
  .pxer-app .py-lg-2 {
    padding-bottom: 0.5rem !important;
  }
  .pxer-app .pl-lg-2,
  .pxer-app .px-lg-2 {
    padding-left: 0.5rem !important;
  }
  .pxer-app .p-lg-3 {
    padding: 1rem !important;
  }
  .pxer-app .pt-lg-3,
  .pxer-app .py-lg-3 {
    padding-top: 1rem !important;
  }
  .pxer-app .pr-lg-3,
  .pxer-app .px-lg-3 {
    padding-right: 1rem !important;
  }
  .pxer-app .pb-lg-3,
  .pxer-app .py-lg-3 {
    padding-bottom: 1rem !important;
  }
  .pxer-app .pl-lg-3,
  .pxer-app .px-lg-3 {
    padding-left: 1rem !important;
  }
  .pxer-app .p-lg-4 {
    padding: 1.5rem !important;
  }
  .pxer-app .pt-lg-4,
  .pxer-app .py-lg-4 {
    padding-top: 1.5rem !important;
  }
  .pxer-app .pr-lg-4,
  .pxer-app .px-lg-4 {
    padding-right: 1.5rem !important;
  }
  .pxer-app .pb-lg-4,
  .pxer-app .py-lg-4 {
    padding-bottom: 1.5rem !important;
  }
  .pxer-app .pl-lg-4,
  .pxer-app .px-lg-4 {
    padding-left: 1.5rem !important;
  }
  .pxer-app .p-lg-5 {
    padding: 3rem !important;
  }
  .pxer-app .pt-lg-5,
  .pxer-app .py-lg-5 {
    padding-top: 3rem !important;
  }
  .pxer-app .pr-lg-5,
  .pxer-app .px-lg-5 {
    padding-right: 3rem !important;
  }
  .pxer-app .pb-lg-5,
  .pxer-app .py-lg-5 {
    padding-bottom: 3rem !important;
  }
  .pxer-app .pl-lg-5,
  .pxer-app .px-lg-5 {
    padding-left: 3rem !important;
  }
  .pxer-app .m-lg-n1 {
    margin: -0.25rem !important;
  }
  .pxer-app .mt-lg-n1,
  .pxer-app .my-lg-n1 {
    margin-top: -0.25rem !important;
  }
  .pxer-app .mr-lg-n1,
  .pxer-app .mx-lg-n1 {
    margin-right: -0.25rem !important;
  }
  .pxer-app .mb-lg-n1,
  .pxer-app .my-lg-n1 {
    margin-bottom: -0.25rem !important;
  }
  .pxer-app .ml-lg-n1,
  .pxer-app .mx-lg-n1 {
    margin-left: -0.25rem !important;
  }
  .pxer-app .m-lg-n2 {
    margin: -0.5rem !important;
  }
  .pxer-app .mt-lg-n2,
  .pxer-app .my-lg-n2 {
    margin-top: -0.5rem !important;
  }
  .pxer-app .mr-lg-n2,
  .pxer-app .mx-lg-n2 {
    margin-right: -0.5rem !important;
  }
  .pxer-app .mb-lg-n2,
  .pxer-app .my-lg-n2 {
    margin-bottom: -0.5rem !important;
  }
  .pxer-app .ml-lg-n2,
  .pxer-app .mx-lg-n2 {
    margin-left: -0.5rem !important;
  }
  .pxer-app .m-lg-n3 {
    margin: -1rem !important;
  }
  .pxer-app .mt-lg-n3,
  .pxer-app .my-lg-n3 {
    margin-top: -1rem !important;
  }
  .pxer-app .mr-lg-n3,
  .pxer-app .mx-lg-n3 {
    margin-right: -1rem !important;
  }
  .pxer-app .mb-lg-n3,
  .pxer-app .my-lg-n3 {
    margin-bottom: -1rem !important;
  }
  .pxer-app .ml-lg-n3,
  .pxer-app .mx-lg-n3 {
    margin-left: -1rem !important;
  }
  .pxer-app .m-lg-n4 {
    margin: -1.5rem !important;
  }
  .pxer-app .mt-lg-n4,
  .pxer-app .my-lg-n4 {
    margin-top: -1.5rem !important;
  }
  .pxer-app .mr-lg-n4,
  .pxer-app .mx-lg-n4 {
    margin-right: -1.5rem !important;
  }
  .pxer-app .mb-lg-n4,
  .pxer-app .my-lg-n4 {
    margin-bottom: -1.5rem !important;
  }
  .pxer-app .ml-lg-n4,
  .pxer-app .mx-lg-n4 {
    margin-left: -1.5rem !important;
  }
  .pxer-app .m-lg-n5 {
    margin: -3rem !important;
  }
  .pxer-app .mt-lg-n5,
  .pxer-app .my-lg-n5 {
    margin-top: -3rem !important;
  }
  .pxer-app .mr-lg-n5,
  .pxer-app .mx-lg-n5 {
    margin-right: -3rem !important;
  }
  .pxer-app .mb-lg-n5,
  .pxer-app .my-lg-n5 {
    margin-bottom: -3rem !important;
  }
  .pxer-app .ml-lg-n5,
  .pxer-app .mx-lg-n5 {
    margin-left: -3rem !important;
  }
  .pxer-app .m-lg-auto {
    margin: auto !important;
  }
  .pxer-app .mt-lg-auto,
  .pxer-app .my-lg-auto {
    margin-top: auto !important;
  }
  .pxer-app .mr-lg-auto,
  .pxer-app .mx-lg-auto {
    margin-right: auto !important;
  }
  .pxer-app .mb-lg-auto,
  .pxer-app .my-lg-auto {
    margin-bottom: auto !important;
  }
  .pxer-app .ml-lg-auto,
  .pxer-app .mx-lg-auto {
    margin-left: auto !important;
  }
}
@media (min-width: 1200px) {
  .pxer-app .m-xl-0 {
    margin: 0 !important;
  }
  .pxer-app .mt-xl-0,
  .pxer-app .my-xl-0 {
    margin-top: 0 !important;
  }
  .pxer-app .mr-xl-0,
  .pxer-app .mx-xl-0 {
    margin-right: 0 !important;
  }
  .pxer-app .mb-xl-0,
  .pxer-app .my-xl-0 {
    margin-bottom: 0 !important;
  }
  .pxer-app .ml-xl-0,
  .pxer-app .mx-xl-0 {
    margin-left: 0 !important;
  }
  .pxer-app .m-xl-1 {
    margin: 0.25rem !important;
  }
  .pxer-app .mt-xl-1,
  .pxer-app .my-xl-1 {
    margin-top: 0.25rem !important;
  }
  .pxer-app .mr-xl-1,
  .pxer-app .mx-xl-1 {
    margin-right: 0.25rem !important;
  }
  .pxer-app .mb-xl-1,
  .pxer-app .my-xl-1 {
    margin-bottom: 0.25rem !important;
  }
  .pxer-app .ml-xl-1,
  .pxer-app .mx-xl-1 {
    margin-left: 0.25rem !important;
  }
  .pxer-app .m-xl-2 {
    margin: 0.5rem !important;
  }
  .pxer-app .mt-xl-2,
  .pxer-app .my-xl-2 {
    margin-top: 0.5rem !important;
  }
  .pxer-app .mr-xl-2,
  .pxer-app .mx-xl-2 {
    margin-right: 0.5rem !important;
  }
  .pxer-app .mb-xl-2,
  .pxer-app .my-xl-2 {
    margin-bottom: 0.5rem !important;
  }
  .pxer-app .ml-xl-2,
  .pxer-app .mx-xl-2 {
    margin-left: 0.5rem !important;
  }
  .pxer-app .m-xl-3 {
    margin: 1rem !important;
  }
  .pxer-app .mt-xl-3,
  .pxer-app .my-xl-3 {
    margin-top: 1rem !important;
  }
  .pxer-app .mr-xl-3,
  .pxer-app .mx-xl-3 {
    margin-right: 1rem !important;
  }
  .pxer-app .mb-xl-3,
  .pxer-app .my-xl-3 {
    margin-bottom: 1rem !important;
  }
  .pxer-app .ml-xl-3,
  .pxer-app .mx-xl-3 {
    margin-left: 1rem !important;
  }
  .pxer-app .m-xl-4 {
    margin: 1.5rem !important;
  }
  .pxer-app .mt-xl-4,
  .pxer-app .my-xl-4 {
    margin-top: 1.5rem !important;
  }
  .pxer-app .mr-xl-4,
  .pxer-app .mx-xl-4 {
    margin-right: 1.5rem !important;
  }
  .pxer-app .mb-xl-4,
  .pxer-app .my-xl-4 {
    margin-bottom: 1.5rem !important;
  }
  .pxer-app .ml-xl-4,
  .pxer-app .mx-xl-4 {
    margin-left: 1.5rem !important;
  }
  .pxer-app .m-xl-5 {
    margin: 3rem !important;
  }
  .pxer-app .mt-xl-5,
  .pxer-app .my-xl-5 {
    margin-top: 3rem !important;
  }
  .pxer-app .mr-xl-5,
  .pxer-app .mx-xl-5 {
    margin-right: 3rem !important;
  }
  .pxer-app .mb-xl-5,
  .pxer-app .my-xl-5 {
    margin-bottom: 3rem !important;
  }
  .pxer-app .ml-xl-5,
  .pxer-app .mx-xl-5 {
    margin-left: 3rem !important;
  }
  .pxer-app .p-xl-0 {
    padding: 0 !important;
  }
  .pxer-app .pt-xl-0,
  .pxer-app .py-xl-0 {
    padding-top: 0 !important;
  }
  .pxer-app .pr-xl-0,
  .pxer-app .px-xl-0 {
    padding-right: 0 !important;
  }
  .pxer-app .pb-xl-0,
  .pxer-app .py-xl-0 {
    padding-bottom: 0 !important;
  }
  .pxer-app .pl-xl-0,
  .pxer-app .px-xl-0 {
    padding-left: 0 !important;
  }
  .pxer-app .p-xl-1 {
    padding: 0.25rem !important;
  }
  .pxer-app .pt-xl-1,
  .pxer-app .py-xl-1 {
    padding-top: 0.25rem !important;
  }
  .pxer-app .pr-xl-1,
  .pxer-app .px-xl-1 {
    padding-right: 0.25rem !important;
  }
  .pxer-app .pb-xl-1,
  .pxer-app .py-xl-1 {
    padding-bottom: 0.25rem !important;
  }
  .pxer-app .pl-xl-1,
  .pxer-app .px-xl-1 {
    padding-left: 0.25rem !important;
  }
  .pxer-app .p-xl-2 {
    padding: 0.5rem !important;
  }
  .pxer-app .pt-xl-2,
  .pxer-app .py-xl-2 {
    padding-top: 0.5rem !important;
  }
  .pxer-app .pr-xl-2,
  .pxer-app .px-xl-2 {
    padding-right: 0.5rem !important;
  }
  .pxer-app .pb-xl-2,
  .pxer-app .py-xl-2 {
    padding-bottom: 0.5rem !important;
  }
  .pxer-app .pl-xl-2,
  .pxer-app .px-xl-2 {
    padding-left: 0.5rem !important;
  }
  .pxer-app .p-xl-3 {
    padding: 1rem !important;
  }
  .pxer-app .pt-xl-3,
  .pxer-app .py-xl-3 {
    padding-top: 1rem !important;
  }
  .pxer-app .pr-xl-3,
  .pxer-app .px-xl-3 {
    padding-right: 1rem !important;
  }
  .pxer-app .pb-xl-3,
  .pxer-app .py-xl-3 {
    padding-bottom: 1rem !important;
  }
  .pxer-app .pl-xl-3,
  .pxer-app .px-xl-3 {
    padding-left: 1rem !important;
  }
  .pxer-app .p-xl-4 {
    padding: 1.5rem !important;
  }
  .pxer-app .pt-xl-4,
  .pxer-app .py-xl-4 {
    padding-top: 1.5rem !important;
  }
  .pxer-app .pr-xl-4,
  .pxer-app .px-xl-4 {
    padding-right: 1.5rem !important;
  }
  .pxer-app .pb-xl-4,
  .pxer-app .py-xl-4 {
    padding-bottom: 1.5rem !important;
  }
  .pxer-app .pl-xl-4,
  .pxer-app .px-xl-4 {
    padding-left: 1.5rem !important;
  }
  .pxer-app .p-xl-5 {
    padding: 3rem !important;
  }
  .pxer-app .pt-xl-5,
  .pxer-app .py-xl-5 {
    padding-top: 3rem !important;
  }
  .pxer-app .pr-xl-5,
  .pxer-app .px-xl-5 {
    padding-right: 3rem !important;
  }
  .pxer-app .pb-xl-5,
  .pxer-app .py-xl-5 {
    padding-bottom: 3rem !important;
  }
  .pxer-app .pl-xl-5,
  .pxer-app .px-xl-5 {
    padding-left: 3rem !important;
  }
  .pxer-app .m-xl-n1 {
    margin: -0.25rem !important;
  }
  .pxer-app .mt-xl-n1,
  .pxer-app .my-xl-n1 {
    margin-top: -0.25rem !important;
  }
  .pxer-app .mr-xl-n1,
  .pxer-app .mx-xl-n1 {
    margin-right: -0.25rem !important;
  }
  .pxer-app .mb-xl-n1,
  .pxer-app .my-xl-n1 {
    margin-bottom: -0.25rem !important;
  }
  .pxer-app .ml-xl-n1,
  .pxer-app .mx-xl-n1 {
    margin-left: -0.25rem !important;
  }
  .pxer-app .m-xl-n2 {
    margin: -0.5rem !important;
  }
  .pxer-app .mt-xl-n2,
  .pxer-app .my-xl-n2 {
    margin-top: -0.5rem !important;
  }
  .pxer-app .mr-xl-n2,
  .pxer-app .mx-xl-n2 {
    margin-right: -0.5rem !important;
  }
  .pxer-app .mb-xl-n2,
  .pxer-app .my-xl-n2 {
    margin-bottom: -0.5rem !important;
  }
  .pxer-app .ml-xl-n2,
  .pxer-app .mx-xl-n2 {
    margin-left: -0.5rem !important;
  }
  .pxer-app .m-xl-n3 {
    margin: -1rem !important;
  }
  .pxer-app .mt-xl-n3,
  .pxer-app .my-xl-n3 {
    margin-top: -1rem !important;
  }
  .pxer-app .mr-xl-n3,
  .pxer-app .mx-xl-n3 {
    margin-right: -1rem !important;
  }
  .pxer-app .mb-xl-n3,
  .pxer-app .my-xl-n3 {
    margin-bottom: -1rem !important;
  }
  .pxer-app .ml-xl-n3,
  .pxer-app .mx-xl-n3 {
    margin-left: -1rem !important;
  }
  .pxer-app .m-xl-n4 {
    margin: -1.5rem !important;
  }
  .pxer-app .mt-xl-n4,
  .pxer-app .my-xl-n4 {
    margin-top: -1.5rem !important;
  }
  .pxer-app .mr-xl-n4,
  .pxer-app .mx-xl-n4 {
    margin-right: -1.5rem !important;
  }
  .pxer-app .mb-xl-n4,
  .pxer-app .my-xl-n4 {
    margin-bottom: -1.5rem !important;
  }
  .pxer-app .ml-xl-n4,
  .pxer-app .mx-xl-n4 {
    margin-left: -1.5rem !important;
  }
  .pxer-app .m-xl-n5 {
    margin: -3rem !important;
  }
  .pxer-app .mt-xl-n5,
  .pxer-app .my-xl-n5 {
    margin-top: -3rem !important;
  }
  .pxer-app .mr-xl-n5,
  .pxer-app .mx-xl-n5 {
    margin-right: -3rem !important;
  }
  .pxer-app .mb-xl-n5,
  .pxer-app .my-xl-n5 {
    margin-bottom: -3rem !important;
  }
  .pxer-app .ml-xl-n5,
  .pxer-app .mx-xl-n5 {
    margin-left: -3rem !important;
  }
  .pxer-app .m-xl-auto {
    margin: auto !important;
  }
  .pxer-app .mt-xl-auto,
  .pxer-app .my-xl-auto {
    margin-top: auto !important;
  }
  .pxer-app .mr-xl-auto,
  .pxer-app .mx-xl-auto {
    margin-right: auto !important;
  }
  .pxer-app .mb-xl-auto,
  .pxer-app .my-xl-auto {
    margin-bottom: auto !important;
  }
  .pxer-app .ml-xl-auto,
  .pxer-app .mx-xl-auto {
    margin-left: auto !important;
  }
}
.pxer-app .stretched-link::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  pointer-events: auto;
  content: "";
  background-color: rgba(0, 0, 0, 0);
}
.pxer-app .text-monospace {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
}
.pxer-app .text-justify {
  text-align: justify !important;
}
.pxer-app .text-wrap {
  white-space: normal !important;
}
.pxer-app .text-nowrap {
  white-space: nowrap !important;
}
.pxer-app .text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pxer-app .text-left {
  text-align: left !important;
}
.pxer-app .text-right {
  text-align: right !important;
}
.pxer-app .text-center {
  text-align: center !important;
}
@media (min-width: 576px) {
  .pxer-app .text-sm-left {
    text-align: left !important;
  }
  .pxer-app .text-sm-right {
    text-align: right !important;
  }
  .pxer-app .text-sm-center {
    text-align: center !important;
  }
}
@media (min-width: 768px) {
  .pxer-app .text-md-left {
    text-align: left !important;
  }
  .pxer-app .text-md-right {
    text-align: right !important;
  }
  .pxer-app .text-md-center {
    text-align: center !important;
  }
}
@media (min-width: 992px) {
  .pxer-app .text-lg-left {
    text-align: left !important;
  }
  .pxer-app .text-lg-right {
    text-align: right !important;
  }
  .pxer-app .text-lg-center {
    text-align: center !important;
  }
}
@media (min-width: 1200px) {
  .pxer-app .text-xl-left {
    text-align: left !important;
  }
  .pxer-app .text-xl-right {
    text-align: right !important;
  }
  .pxer-app .text-xl-center {
    text-align: center !important;
  }
}
.pxer-app .text-lowercase {
  text-transform: lowercase !important;
}
.pxer-app .text-uppercase {
  text-transform: uppercase !important;
}
.pxer-app .text-capitalize {
  text-transform: capitalize !important;
}
.pxer-app .font-weight-light {
  font-weight: 300 !important;
}
.pxer-app .font-weight-lighter {
  font-weight: lighter !important;
}
.pxer-app .font-weight-normal {
  font-weight: 400 !important;
}
.pxer-app .font-weight-bold {
  font-weight: 700 !important;
}
.pxer-app .font-weight-bolder {
  font-weight: bolder !important;
}
.pxer-app .font-italic {
  font-style: italic !important;
}
.pxer-app .text-white {
  color: #fff !important;
}
.pxer-app .text-primary {
  color: #007bff !important;
}
.pxer-app a.text-primary:hover, .pxer-app a.text-primary:focus {
  color: #0056b3 !important;
}
.pxer-app .text-secondary {
  color: #6c757d !important;
}
.pxer-app a.text-secondary:hover, .pxer-app a.text-secondary:focus {
  color: #494f54 !important;
}
.pxer-app .text-success {
  color: #28a745 !important;
}
.pxer-app a.text-success:hover, .pxer-app a.text-success:focus {
  color: #19692c !important;
}
.pxer-app .text-info {
  color: #17a2b8 !important;
}
.pxer-app a.text-info:hover, .pxer-app a.text-info:focus {
  color: #0f6674 !important;
}
.pxer-app .text-warning {
  color: #ffc107 !important;
}
.pxer-app a.text-warning:hover, .pxer-app a.text-warning:focus {
  color: #ba8b00 !important;
}
.pxer-app .text-danger {
  color: #dc3545 !important;
}
.pxer-app a.text-danger:hover, .pxer-app a.text-danger:focus {
  color: #a71d2a !important;
}
.pxer-app .text-light {
  color: #f8f9fa !important;
}
.pxer-app a.text-light:hover, .pxer-app a.text-light:focus {
  color: #cbd3da !important;
}
.pxer-app .text-dark {
  color: #343a40 !important;
}
.pxer-app a.text-dark:hover, .pxer-app a.text-dark:focus {
  color: #121416 !important;
}
.pxer-app .text-body {
  color: #212529 !important;
}
.pxer-app .text-muted {
  color: #6c757d !important;
}
.pxer-app .text-black-50 {
  color: rgba(0, 0, 0, 0.5) !important;
}
.pxer-app .text-white-50 {
  color: rgba(255, 255, 255, 0.5) !important;
}
.pxer-app .text-hide {
  font: 0/0 a;
  color: transparent;
  text-shadow: none;
  background-color: transparent;
  border: 0;
}
.pxer-app .text-decoration-none {
  text-decoration: none !important;
}
.pxer-app .text-break {
  word-break: break-word !important;
  word-wrap: break-word !important;
}
.pxer-app .text-reset {
  color: inherit !important;
}
.pxer-app .visible {
  visibility: visible !important;
}
.pxer-app .invisible {
  visibility: hidden !important;
}
.pxer-app .card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
}
.pxer-app .card > hr {
  margin-right: 0;
  margin-left: 0;
}
.pxer-app .card > .list-group {
  border-top: inherit;
  border-bottom: inherit;
}
.pxer-app .card > .list-group:first-child {
  border-top-width: 0;
  border-top-left-radius: calc(0.25rem - 1px);
  border-top-right-radius: calc(0.25rem - 1px);
}
.pxer-app .card > .list-group:last-child {
  border-bottom-width: 0;
  border-bottom-right-radius: calc(0.25rem - 1px);
  border-bottom-left-radius: calc(0.25rem - 1px);
}
.pxer-app .card > .card-header + .list-group,
.pxer-app .card > .list-group + .card-footer {
  border-top: 0;
}
.pxer-app .card-body {
  flex: 1 1 auto;
  min-height: 1px;
  padding: 1.25rem;
}
.pxer-app .card-title {
  margin-bottom: 0.75rem;
}
.pxer-app .card-subtitle {
  margin-top: -0.375rem;
  margin-bottom: 0;
}
.pxer-app .card-text:last-child {
  margin-bottom: 0;
}
.pxer-app .card-link:hover {
  text-decoration: none;
}
.pxer-app .card-link + .card-link {
  margin-left: 1.25rem;
}
.pxer-app .card-header {
  padding: 0.75rem 1.25rem;
  margin-bottom: 0;
  background-color: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}
.pxer-app .card-header:first-child {
  border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
}
.pxer-app .card-footer {
  padding: 0.75rem 1.25rem;
  background-color: rgba(0, 0, 0, 0.03);
  border-top: 1px solid rgba(0, 0, 0, 0.125);
}
.pxer-app .card-footer:last-child {
  border-radius: 0 0 calc(0.25rem - 1px) calc(0.25rem - 1px);
}
.pxer-app .card-header-tabs {
  margin-right: -0.625rem;
  margin-bottom: -0.75rem;
  margin-left: -0.625rem;
  border-bottom: 0;
}
.pxer-app .card-header-pills {
  margin-right: -0.625rem;
  margin-left: -0.625rem;
}
.pxer-app .card-img-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1.25rem;
  border-radius: calc(0.25rem - 1px);
}
.pxer-app .card-img,
.pxer-app .card-img-top,
.pxer-app .card-img-bottom {
  flex-shrink: 0;
  width: 100%;
}
.pxer-app .card-img,
.pxer-app .card-img-top {
  border-top-left-radius: calc(0.25rem - 1px);
  border-top-right-radius: calc(0.25rem - 1px);
}
.pxer-app .card-img,
.pxer-app .card-img-bottom {
  border-bottom-right-radius: calc(0.25rem - 1px);
  border-bottom-left-radius: calc(0.25rem - 1px);
}
.pxer-app .card-deck .card {
  margin-bottom: 15px;
}
@media (min-width: 576px) {
  .pxer-app .card-deck {
    display: flex;
    flex-flow: row wrap;
    margin-right: -15px;
    margin-left: -15px;
  }
  .pxer-app .card-deck .card {
    flex: 1 0 0%;
    margin-right: 15px;
    margin-bottom: 0;
    margin-left: 15px;
  }
}
.pxer-app .card-group > .card {
  margin-bottom: 15px;
}
@media (min-width: 576px) {
  .pxer-app .card-group {
    display: flex;
    flex-flow: row wrap;
  }
  .pxer-app .card-group > .card {
    flex: 1 0 0%;
    margin-bottom: 0;
  }
  .pxer-app .card-group > .card + .card {
    margin-left: 0;
    border-left: 0;
  }
  .pxer-app .card-group > .card:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .pxer-app .card-group > .card:not(:last-child) .card-img-top,
  .pxer-app .card-group > .card:not(:last-child) .card-header {
    border-top-right-radius: 0;
  }
  .pxer-app .card-group > .card:not(:last-child) .card-img-bottom,
  .pxer-app .card-group > .card:not(:last-child) .card-footer {
    border-bottom-right-radius: 0;
  }
  .pxer-app .card-group > .card:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .pxer-app .card-group > .card:not(:first-child) .card-img-top,
  .pxer-app .card-group > .card:not(:first-child) .card-header {
    border-top-left-radius: 0;
  }
  .pxer-app .card-group > .card:not(:first-child) .card-img-bottom,
  .pxer-app .card-group > .card:not(:first-child) .card-footer {
    border-bottom-left-radius: 0;
  }
}
.pxer-app .card-columns .card {
  margin-bottom: 0.75rem;
}
@media (min-width: 576px) {
  .pxer-app .card-columns {
    column-count: 3;
    column-gap: 1.25rem;
    orphans: 1;
    widows: 1;
  }
  .pxer-app .card-columns .card {
    display: inline-block;
    width: 100%;
  }
}
.pxer-app .accordion {
  overflow-anchor: none;
}
.pxer-app .accordion > .card {
  overflow: hidden;
}
.pxer-app .accordion > .card:not(:last-of-type) {
  border-bottom: 0;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.pxer-app .accordion > .card:not(:first-of-type) {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.pxer-app .accordion > .card > .card-header {
  border-radius: 0;
  margin-bottom: -1px;
}
.pxer-app > * {
  background-color: #fff;
  border: 1px solid #d6dee5;
  border-radius: 5px;
  margin-top: 10px;
  margin-bottom: 10px;
  min-height: 40px;
  display: flex;
}
.pxer-app .pxer-nav {
  background-color: #fff;
  justify-content: space-between;
  padding: 5px 12px;
  align-items: center;
}
.pxer-app .pxer-nav .pn-header a,
.pxer-app .pxer-nav .pn-header a:active,
.pxer-app .pxer-nav .pn-header a:hover {
  text-decoration: none;
  color: #258fb8;
  font-family: sans-serif;
  font-size: 24px;
}
.pxer-app .pxer-nav .pn-header a small,
.pxer-app .pxer-nav .pn-header a:active small,
.pxer-app .pxer-nav .pn-header a:hover small {
  font-size: 0.3em;
}
.pxer-app .pxer-nav .pn-header a:hover {
  color: #24749c;
}
.pxer-app .pxer-nav .pn-buttons {
  display: flex;
  align-items: center;
}
.pxer-app .pxer-nav .pn-buttons .btn {
  margin-left: 10px;
}
.pxer-app .pxer-nav .pn-buttons .pnb-warn-number {
  background-color: #fd7e14;
  font-family: sans-serif;
  width: 20px;
  height: 20px;
  font-size: 14px;
  transform: scale(0.7);
  line-height: 20px;
  color: #fff;
  border-radius: 1000px;
  display: inline-block;
  text-align: center;
  margin-left: -20px;
  position: relative;
  top: -10px;
  left: 8px;
}
.pxer-app .pxer-fail > table thead tr td {
  padding: 3px 12px;
  vertical-align: middle;
  font-size: 16px;
}
.pxer-app .pxer-task-option {
  padding: 5px 0;
}
.pxer-app .pxer-task-option > * {
  margin-left: 12px;
}
.pxer-app .pxer-task-option .ptp-buttons {
  margin-left: auto;
  margin-right: 12px;
}
.pxer-app .pxer-task-option .ptp-buttons button {
  margin-left: 10px;
}
.pxer-app .pxer-print > * {
  flex-grow: 1;
  margin: 12px;
}
.pxer-app .pxer-print .pp-filter,
.pxer-app .pxer-print .pp-print {
  margin-top: 1.5em;
  padding: 12px;
}
.pxer-app .pxer-print .pp-print {
  width: 35%;
}
.pxer-app .pxer-print .pp-print .pppf-buttons {
  text-align: right;
}
.pxer-app .pxer-print .pp-print .pppf-buttons .pppfb-msg {
  padding: 5px;
  text-align: left;
  border: 1px solid #e9ecef;
  color: #6c757d;
  border-radius: 1px;
}
.pxer-app .pxer-print .pp-filter {
  width: 55%;
}
.pxer-app .pxer-print .pp-filter .ppf-tag-card .card-body {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 5px;
  position: relative;
  overflow: hidden;
}
.pxer-app .pxer-print .pp-filter .ppf-tag-card .ppf-show-all-tag {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: block;
  padding: 20px 0 5px;
  text-align: center;
  cursor: pointer;
  color: #258fb8;
  background: linear-gradient(rgba(255, 255, 255, 0), white 50%);
}
.pxer-app .pxer-print .pp-filter .ppf-tag-card .ppf-tag {
  margin: 5px 2px;
  cursor: pointer;
}
.pxer-app .pxer-print .pp-filter .ppf-tag-card .ppf-tag:last-child {
  margin-right: auto;
}
.pxer-app input.form-control,
.pxer-app select.form-control {
  height: 24px;
  padding-top: 1px;
  padding-bottom: 1px;
  line-height: 1em;
}
.pxer-app .pxer-class-fieldset {
  border: 1px solid #ccc;
  position: relative;
  padding-top: 1em;
  margin-top: 1em;
}
.pxer-app .pxer-class-fieldset .pcf-title {
  background-color: #fff;
  display: inline-block;
  position: absolute;
  top: -0.75em;
  left: 0.45em;
  font-size: 16px;
}
.pxer-app .text-right {
  text-align: right;
}

div#wave {
  position: relative;
  margin-left: auto;
  margin-right: auto;
}
div#wave .dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  margin-right: 3px;
  background: #303131;
  animation: wave 1.3s linear infinite;
}
div#wave .dot:nth-child(2) {
  animation-delay: -1.1s;
}
div#wave .dot:nth-child(3) {
  animation-delay: -0.9s;
}

@keyframes wave {
  0%, 60%, 100% {
    transform: initial;
  }
  30% {
    transform: translateY(-8px);
  }
}
`;

;


// public/favicon.ico
pxer.util.addFile('public/favicon.ico')
;


// https://point.pea3nut.org/sdk/1.0/browser.js
"use strict";
var EventSender = /** @class */ (function () {
    function EventSender(remoteUrl, userOptions) {
        this.remoteUrl = remoteUrl;
        this.userOptions = userOptions;
        this.startTime = new Date;
        this.content = {};
        var that = this;
        this.defaultOptions = {
            sdk_version: '1.0',
            get time() { return new Date; },
            get duration() { return new Date().getTime() - that.startTime.getTime(); },
        };
    }
    EventSender.prototype.setContent = function (content) {
        Object.assign(this.content, content);
    };
    EventSender.prototype.send = function (eventFlag, content) {
        var mergedContent = Object.assign({}, this.content, content);
        var body = Object.assign({}, this.defaultOptions, this.userOptions, {
            content: JSON.stringify(mergedContent),
            event_flag: eventFlag,
        });
        this.sendRequest(body);
    };
    EventSender.prototype.sendRequest = function (body) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', this.remoteUrl);
        xhr.onload = function () {
            if (['2', '3'].includes(xhr.status.toString()[0])) {
                var res = JSON.parse(xhr.responseText);
                if (res.errcode) {
                    console.error("Error in point sent! Server response " + xhr.responseText);
                }
            }
            else {
                console.error("Error in point sent! Server response HTTP code " + xhr.status);
            }
        };
        xhr.send(JSON.stringify(body));
    };
    return EventSender;
}());
//# sourceMappingURL=browser.js.map
;


// src/app/util.js
"use strict";

pxer.util = pxer.util || {};

// 全局函数
pxer.util.blinkTitle = function (addMsg, spaceMsg) {
  var addMsg = addMsg || "[ ＯＫ ] ";
  var spaceMsg = spaceMsg || "[ 　　 ] ";
  var timer = setInterval(() => {
    if (document.title.indexOf(addMsg) !== -1) {
      document.title = document.title.replace(addMsg, spaceMsg);
    } else if (document.title.indexOf(spaceMsg) !== -1) {
      document.title = document.title.replace(spaceMsg, addMsg);
    } else {
      document.title = addMsg + document.title;
    }
  }, 500);
  window.addEventListener("mousemove", function _self() {
    window.addEventListener("mousemove", _self);
    clearInterval(timer);
    document.title = document.title.replace(spaceMsg, "").replace(addMsg, "");
  });
};
pxer.util.parseURL = function (url = document.URL) {
  var arr = url.match(
    /^(?:(https?):)?\/\/([\w_\d.:\-]+?)((?:\/[^\/?]*)*)\/?(?:\?(.+))?$/
  );
  var data = {
    protocol: arr[1],
    domain: arr[2],
    path: arr[3],
    query: arr[4],
  };
  if (data.query && data.query.indexOf("=") !== -1) {
    data.query = {};
    for (let item of arr[4].split("&")) {
      let tmp = item.split("=");
      data.query[tmp[0]] = tmp[1];
    }
  }
  return data;
};
pxer.util.createScript = function (url) {
  if (!/^(https?:)?\/\//.test(url)) url = window["PXER_URL"] + url;
  var elt = document.createElement("script");
  elt.charset = "utf-8";
  return function (resolve, reject) {
    elt.addEventListener("load", resolve);
    elt.addEventListener("load", function () {
      if (window["PXER_MODE"] === "dev") console.log("Loaded " + url);
    });
    elt.addEventListener("error", reject);
    elt.src = url;
    document.documentElement.appendChild(elt);
    return elt;
  };
};
pxer.util.createResource = function (url) {
  if (!/^(https?:)?\/\//.test(url)) url = window["PXER_URL"] + url;
  let fx = url.match(/\.([^\.]+?)$/)[1];
  let elt = document.createElement("link");
  switch (fx) {
    case "css":
      elt.rel = "stylesheet";
      break;
    case "ico":
      elt.rel = "shortcut icon";
      elt.type = "image/x-icon";
      break;
    default:
      throw new Error(`unknown filename extension "${fx}"`);
  }
  return function (resolve, reject) {
    elt.href = url;
    document.documentElement.appendChild(elt);
    if (window["PXER_MODE"] === "dev") console.log("Linked " + url);
    resolve();
  };
};
pxer.util.execPromise = function (taskList, call) {
  var promise = Promise.resolve();
  if (Array.isArray(taskList) && Array.isArray(taskList[0])) {
    for (let array of taskList) {
      promise = promise.then(() =>
        Promise.all(array.map((item) => new Promise(call(item))))
      );
    }
  } else if (Array.isArray(taskList)) {
    for (let item of taskList) {
      promise = promise.then(() => new Promise(call(item)));
    }
  } else {
    promise = promise.then(() => new Promise(call(taskList)));
  }

  return promise;
};

/**
 * 当前页面类型。可能的值
 * - bookmark_user  自己/其他人关注的用户列表
 * - bookmark_works 自己/其他人收藏的作品
 * - member_info    自己/其他人的主页
 * - works_medium   查看某个作品
 * - works_manga    查看某个多张作品的多张页
 * - works_big      查看某个作品的某张图片的大图
 * - member_works   自己/其他人作品列表页
 * - member_works_new 自己/其他人作品列表页
 * - search         检索页
 * - index          首页
 * - discovery      探索
 * - rank           排行榜
 * - bookmark_new   关注的新作品
 * - unknown        未知
 * @param {Document} doc
 * @return {string} - 页面类型
 * */
pxer.util.getPageType = function (doc = document) {
  const url = doc.URL;
  var URLData = pxer.util.parseURL(url);

  switch (true) {
    case pxer.regexp.urlWorkDetail.test(URLData.path):
      return "works_medium";
  }

  var type = null;
  var isnew = !(
    Boolean(document.querySelector(".count-badge")) ||
    Boolean(document.querySelector(".profile"))
  );
  if (URLData.domain !== "www.pixiv.net") return "unknown";

  if (pxer.regexp.isBookmarksUrl.test(URLData.path)) {
    type = "bookmark_works";
  } else if (URLData.path.startsWith("/users/")) {
    type = "member_works_new";
  } else if (URLData.path.startsWith("/tags/")) {
    type = "search_tag";
  } else if (URLData.path === "/bookmark.php") {
    if (URLData.query && URLData.query.type) {
      switch (URLData.query.type) {
        case "user":
          type = "bookmark_user";
          break;
        default:
          type = "unknown";
      }
    } else {
      type = "bookmark_works";
    }
  } else if (URLData.path === "/bookmark_new_illust.php") {
    type = "bookmark_new";
  } else if (URLData.path === "/member.php") {
    type = isnew ? "member_works_new" : "member_info";
  } else if (URLData.path === "/ranking.php") {
    type = "rank";
  } else if (URLData.path === "/member_illust.php") {
    if (URLData.query && URLData.query.mode) {
      switch (URLData.query.mode) {
        case "medium":
          type = "works_medium";
          break;
        case "manga":
          type = "works_manga";
          break;
        case "manga_big":
          type = "works_big";
          break;
        default:
          type = "unknown";
      }
    } else {
      type = isnew ? "member_works_new" : "member_works";
    }
  } else if (URLData.path === "/search.php") {
    // TODO: Not all of search is carried in SPA
    //       But new version seems batter?
    type = "search_spa";
  } else if (URLData.path === "/discovery") {
    type = "discovery";
  } else if (URLData.path === "/") {
    type = "index";
  } else {
    type = "unknown";
  }
  return type;
};
/**
 * 查询对应页面类型每页作品数量
 * @param {string} type - 作品类型
 * @return {number} - 每页作品数
 */
pxer.util.getOnePageWorkCount = function (type) {
  switch (type) {
    case "search_spa":
      return 48;
    case "search_tag":
      return 60;
    case "search":
      return 40;
    case "rank":
      return 50;
    case "discovery":
      return 3000;
    case "bookmark_works":
      return 48;
    case "bookmark_new":
      return 60;
    case "member_works_new":
      return Number.MAX_SAFE_INTEGER;
    default:
      return 20;
  }
};
pxer.util.getIDfromURL = function (key = "id", url = document.URL) {
  const urlInfo = new URL(url, document.URL);
  var query = urlInfo.search;
  var params = new URLSearchParams(query);

  const result = params.get(key);

  if (result) return result;

  // read id from url
  const matchResult = url.match(/\d{4,}/);

  return matchResult ? matchResult[0] : null;
};
pxer.util.fetchPixivApi = async function (url) {
  return (await (await fetch(url, { credentials: "include" })).json()).body;
};

Object.assign(window, pxer.util);

;


// src/app/regexp.js
pxer.regexp = pxer.regexp || {};
pxer.regexp.urlWorkDetail = /\/artworks\/(\d+)/;
pxer.regexp.parseKeyword = /\/tags\/([^\/]+?)\//;
pxer.regexp.isBookmarksUrl = /users\/\d+\/bookmarks\/artworks/;

;


// src/app/PxerData.js
"use strict";

/**
 * Pxer任务队列中的任务对象
 * @constructor
 * @abstract
 * */
class PxerRequest {
  constructor({ url, html } = {}) {
    this.url = url;
    this.html = html;
    this.completed = false;
  }
}

/**
 * 页面任务对象
 * @constructor
 * @extends {PxerRequest}
 * */
class PxerPageRequest extends PxerRequest {
  constructor(...argn) {
    super(...argn);
    this.type = argn[0].type;
  }
}

/**
 * 作品任务对象
 * @constructor
 * @extends {PxerRequest}
 * */
class PxerWorksRequest extends PxerRequest {
  constructor({ url = [], html = {}, type, isMultiple, id } = {}) {
    super({ url, html });
    this.type = type; //[manga|ugoira|illust]
    this.isMultiple = isMultiple; //[true|false]
    this.id = id;
  }
}

/**
 * 作品任务对象
 * @constructor
 * @extends {PxerRequest}
 * */
class PxerFailInfo {
  constructor({ url, type, task } = {}) {
    this.url = url;
    this.type = type;
    this.task = task;
  }
}

/**
 * 抓取到的作品对象
 * @constructor
 * */
class PxerWorks {
  constructor(
    { id, type, date, domain, tagList, viewCount, ratedCount, fileFormat } = {},
    strict = true
  ) {
    /**作品ID*/
    this.id = id;
    /**
     * 投稿日期，格式：Y/m/d/h/m/s
     * @type {string}
     * */
    this.date = date;
    this.type = type; //[manga|ugoira|illust]
    /**作品存放的域名*/
    this.domain = domain;
    /**
     * 作品标签列表
     * @type {Array}
     * */
    this.tagList = tagList;
    /**作品被浏览的次数*/
    this.viewCount = viewCount;
    /**作品被赞的次数*/
    this.ratedCount = ratedCount;
    /**作品的图片文件扩展名*/
    this.fileFormat = fileFormat;
  }
}

/**
 * 抓取到的多张插画/漫画作品对象
 * @extends {PxerWorks}
 * @constructor
 * */
class PxerMultipleWorks extends PxerWorks {
  constructor(data = {}) {
    super(data, false);
    /**作品的图片张数*/
    this.isMultiple = true;
    this.multiple = data.multiple;
  }
}

/**
 * 抓取到的动图作品对象
 * @extends {PxerWorks}
 * @constructor
 * */
class PxerUgoiraWorks extends PxerWorks {
  constructor(data = {}) {
    super(data, false);
    this.type = "ugoira";
    this.fileFormat = "zip";
    /**动图动画参数*/
    this.frames = data.frames;
  }
}

;


// src/app/PxerEvent.js
"use strict";

class PxerEvent {
  constructor(eventList = [], shortName = true) {
    this._pe_eventList = eventList;

    this._pe_event = {};
    this._pe_oneEvent = {};

    if (!shortName || typeof Proxy === "undefined") return this;
    else
      return new Proxy(this, {
        get(target, property) {
          if (property in target) {
            return target[property];
          } else if (target._pe_eventList.indexOf(property) !== -1) {
            return target.dispatch.bind(target, property);
          } else {
            return target[property];
          }
        },
      });
  }

  on(type, listener) {
    if (!PxerEvent.check(this, type, listener)) return false;
    if (!this._pe_event[type]) this._pe_event[type] = [];
    this._pe_event[type].push(listener);
    return true;
  }

  one(type, listener) {
    if (!PxerEvent.check(this, type, listener)) return false;
    if (!this._pe_oneEvent[type]) this._pe_oneEvent[type] = [];
    this._pe_oneEvent[type].push(listener);
    return true;
  }

  dispatch(type, ...data) {
    if (this._pe_eventList.indexOf(type) === -1) return false;
    if (this._pe_event[type]) this._pe_event[type].forEach((fn) => fn(...data));
    if (this._pe_oneEvent[type]) {
      this._pe_oneEvent[type].forEach((fn) => fn(...data));
      delete this._pe_oneEvent[type];
    }
    if (this._pe_event["*"]) this._pe_event["*"].forEach((fn) => fn(...data));
    if (this._pe_oneEvent["*"]) {
      this._pe_oneEvent["*"].forEach((fn) => fn(...data));
      delete this._pe_oneEvent["*"];
    }
    return true;
  }

  off(eventType, listener) {
    if (!PxerEvent.checkEvent(this, eventType)) return false;
    if (listener && !PxerEvent.checkListener(listener)) return false;

    if (eventType === true) {
      this._pe_event = {};
      this._pe_oneEvent = {};
      return true;
    }

    if (listener === true || listener === "*") {
      delete this._pe_event[eventType];
      delete this._pe_oneEvent[eventType];
      return true;
    }

    let index1 = this._pe_event[type].lastIndexOf(listener);
    if (index1 !== -1) {
      this._pe_event[type].splice(index1, 1);
    }

    let index2 = this._pe_oneEvent[type].lastIndexOf(listener);
    if (index2 !== -1) {
      this._pe_oneEvent[type].splice(index2, 1);
    }

    return true;
  }
}

PxerEvent.check = function (pe, eventType, listener) {
  return (
    PxerEvent.checkEvent(pe, eventType) && PxerEvent.checkListener(listener)
  );
};
PxerEvent.checkEvent = function (pe, eventType) {
  if (eventType !== "*" && pe._pe_eventList.indexOf(eventType) === -1) {
    console.warn(
      `PxerEvent : "${eventType}" is not in eventList[${pe._pe_eventList}]`
    );
    return false;
  }

  return true;
};
PxerEvent.checkListener = function (listener) {
  if (
    !(listener instanceof Function || listener === true || listener === "*")
  ) {
    console.warn(`PxerEvent: "${listener}" is not a function`);
    return false;
  }

  return true;
};

;


// src/view/i18n.js
pxer.t = function (key) {
  const defaultLang = "en";

  return (
    pxer.util.get(pxer.i18nMap[pxer.lang], key) ||
    pxer.util.get(pxer.i18nMap[defaultLang], key) ||
    key
  );
};

;


// public/i18n/en.json
pxer.util.set(pxer, 'i18nMap.en', {
    "phrase": {
        "taskInfo": "`There are ${worksNum} works and ${address} picture address.<br />The single works is ${(single/worksNum*100).toFixed(1)}%<br /> and the multiple works ${(multiple/worksNum*100).toFixed(1)}%<br />`",
        "blockOpen": "Pxer:\nThe browser blocked Pup-up window. Please check the hint of browser and allow it.",
        "likeProportion": "Input a number less than 1",
        "pointPage": "There is a page to show url of pictures. <strong>Don't</strong> openning in the browser. You can copy them to the downloader tools for download picture.<br />Have no idea? Look at <a href=\"https://github.com/FoXZilla/Pxer/issues/166\" target=\"_blank\">there</a> for what does the senior .<br />"
    },
    "button": {
        "selectAll": "Select All",
        "retryTheSelected": "Retry Selected",
        "preview": "Preview",
        "print": "Print",
        "showAll": "Show All",
        "crawl": "Get",
        "load": "Load",
        "stop": "Stop",
        "option": "Option",
        "apply": "Apply",
        "successBut": "Trouble"
    },
    "option": {
        "ugoiraMax": "Max ZIP",
        "ugoira600p": "600p ZIP",
        "ugoiraConfig": "config",
        "max": "MAX",
        "cover600p": "Cover Only(600p)",
        "no": "No"
    },
    "label": {
        "pictureId": "ID",
        "reason": "Reason",
        "way": "Way",
        "onlyGetTop": "Only get top:",
        "onlyGetBeforeId": "Only get the picture before id (newer than that):",
        "likeCount": "Like Count",
        "viewCount": "View Count",
        "singleIllust": "Single Illust",
        "multipleIllust": "Multiple Illust",
        "singleManga": "Single Manga",
        "multipleManga": "Multiple Manga",
        "ugoira": "Ugoira",
        "likeProportion": "Like Proportion",
        "whatever": "Whatever",
        "exclude": "Exclude",
        "mustInclude": "Must Include"
    },
    "title": {
        "printOptions": "Print Options",
        "filterByTag": "Filter by tag",
        "filterOptions": "Filter Options"
    },
    "pageType": {
        "member_works": "List of Works",
        "member_works_new": "SPA List of Works",
        "search": "Search",
        "search_spa": "SPA Tag Search",
        "search_tag": "Tag Search",
        "bookmark_works": "List of bookmark",
        "rank": "Rank",
        "bookmark_new": "New Works",
        "discovery": "Discovery",
        "unknown": "Unknown"
    },
    "hello": "yahello"
})
;


// public/i18n/zh.json
pxer.util.set(pxer, 'i18nMap.zh', {
    "phrase": {
        "taskInfo": "`共计${worksNum}个作品，${address}个下载地址。<br />单张图片作品占 ${(single/worksNum*100).toFixed(1)}%<br />多张图片作品占 ${(multiple/worksNum*100).toFixed(1)}%<br />`",
        "blockOpen": "Pxer:\n浏览器拦截了弹出窗口，请检查浏览器提示，设置允许此站点的弹出式窗口。",
        "likeProportion": "若输入，则必须为一个小于1的数字",
        "pointPage": "这个页面是抓取到的下载地址，<strong>不要</strong>直接在浏览器打开，你可以将它们复制到第三方下载工具中下载<br />不知道用什么工具？<a href=\"https://github.com/FoXZilla/Pxer/issues/8\" target=\"_blank\">访问这里</a>来看看大家都在用什么工具下载<br />"
    },
    "button": {
        "selectAll": "全选",
        "retryTheSelected": "重试选中",
        "preview": "预览",
        "print": "输出",
        "showAll": "展开全部",
        "crawl": "抓取",
        "load": "载入",
        "stop": "停止",
        "option": "设置",
        "apply": "保存",
        "successBut": "部分成功"
    },
    "option": {
        "ugoiraMax": "最大压缩包",
        "ugoira600p": "600p压缩包",
        "ugoiraConfig": "参数",
        "max": "最大",
        "cover600p": "仅封面（600p）",
        "no": "不输出"
    },
    "label": {
        "pictureId": "图片ID",
        "reason": "失败原因",
        "way": "解决方案",
        "onlyGetTop": "仅抓取前x副：",
        "onlyGetBeforeId": "仅抓取id为x之前的（比x更加新的）：",
        "likeCount": "点赞数",
        "viewCount": "浏览数",
        "singleIllust": "单张插画",
        "multipleIllust": "多张插画",
        "singleManga": "单张漫画",
        "multipleManga": "多张漫画",
        "ugoira": "动图",
        "likeProportion": "点赞率",
        "whatever": "无所谓",
        "exclude": "不能包含",
        "mustInclude": "必须包含"
    },
    "title": {
        "printOptions": "输出选项",
        "filterByTag": "按标签过滤",
        "filterOptions": "过滤选项"
    },
    "pageType": {
        "member_works": "作品列表页",
        "member_works_new": "作品列表页_",
        "search": "检索页",
        "search_spa": "SPA检索页",
        "search_tag": "标签搜索页",
        "bookmark_works": "收藏列表页",
        "rank": "排行榜",
        "bookmark_new": "关注的新作品",
        "discovery": "探索",
        "unknown": "未知"
    },
    "hello": "你好"
})
;


// public/i18n/ja.json
pxer.util.set(pxer, 'i18nMap.ja', {
    "phrase": {
        "taskInfo": "`小計${worksNum}個作品，${address}個ダウンロードアドレス。<br />シングル画像作品割合 ${(single/worksNum*100).toFixed(1)}%<br />複数画像作品割合 ${(multiple/worksNum*100).toFixed(1)}%<br />`",
        "blockOpen": "Pxer:\nブラウザでポップアップがブロックされています。ブラウザのプロンプトを確認して、このサイトのポップアップブロックを許可する操作を行ってください。",
        "likeProportion": "1 未満の数値を入力してください。",
        "pointPage": "このページはクロールされたダウンロードアドレスです。ブラウザで直接<strong>開かないで下さい</strong>。サードパーティのダウンロードツールにコピーして実行します。<br />適用ツールが分からない場合<a href=\"https://github.com/FoXZilla/Pxer/issues/8\" target=\"_blank\">こちら</a>皆さんはどんなツールが使用していますか<br />"
    },
    "button": {
        "selectAll": "全て選択",
        "retryTheSelected": "選択を再試行",
        "preview": "プレビュー",
        "print": "プリント",
        "showAll": "全て表示",
        "crawl": "クロール",
        "load": "ロード",
        "stop": "ストップ",
        "option": "設定",
        "apply": "適用",
        "successBut": "トラブル"
    },
    "option": {
        "ugoiraMax": "Max ZIP",
        "ugoira600p": "600p ZIP",
        "ugoiraConfig": "config",
        "max": "Max",
        "cover600p": "カバーのみ（600p）",
        "no": "プリント不要"
    },
    "label": {
        "pictureId": "画像ID",
        "reason": "失敗原因",
        "way": "解決方法",
        "onlyGetTop": "Top X 枚のみ：",
        "onlyGetBeforeId": "ID＜Xの画像のみ：",
        "likeCount": "いいね！数",
        "viewCount": "ビュー数",
        "singleIllust": "シングルイラスト",
        "multipleIllust": "複数のイラスト",
        "singleManga": "シングル漫画",
        "multipleManga": "複数の漫画",
        "ugoira": "うごイラ",
        "likeProportion": "いいね！割合",
        "whatever": "何でもOK",
        "exclude": "含まない",
        "mustInclude": "含む必要"
    },
    "title": {
        "printOptions": "プリントオプション",
        "filterByTag": "タグでフィルター",
        "filterOptions": "フィルターオプション"
    },
    "pageType": {
        "member_works": "作品リスト",
        "member_works_new": "SPA 作品リスト",
        "search": "検索",
        "search_spa": "SPA タグ検索",
        "search_tag": "タグ検索",
        "bookmark_works": "お気に入りリスト",
        "rank": "ランク",
        "bookmark_new": "お気に入り新作品",
        "discovery": "発見",
        "unknown": "アンノウン"
    },
    "hello": "ようこそ"
})
;


// src/app/PxerFilter.js
"use strict";

class PxerFilter {
  /**
   * @param {Object} config - 过滤参数
   * @see PxerFilter.filterInfo
   * @see PxerFilter.filterTag
   * */
  constructor(config) {
    /**
     * 每次过滤后得到的累计的作品集合
     * @type {PxerWorks[]}
     * */
    this.passWorks = [];

    /**
     * 过滤的配置信息
     * @see PxerFilter.filterInfo
     * @see PxerFilter.filterTag
     * */
    this.config = Object.assign(PxerFilter.defaultConfig(), config);
  }

  /**
   * 对作品进行过滤
   * @param {PxerWorks[]} worksList - 要过滤的作品数组
   * @return {PxerWorks[]} - 过滤后的结果
   * */
  filter(worksList) {
    var resultSet = PxerFilter.filterInfo(
      PxerFilter.filterTag(worksList, this.config),
      this.config
    );
    this.passWorks.push(...resultSet);
    return resultSet;
  }
}

/**
 * 返回PxerFilter的默认配置参数
 * @see PxerFilter.filterInfo
 * @see PxerFilter.filterTag
 * */
PxerFilter.defaultConfig = function () {
  return {
    rated: 0, //赞的数量
    rated_pro: 0, //点赞率
    view: 0, //浏览数
    has_tag_every: [], // 作品中不能含有以下任意一个标签
    has_tag_some: [], // 作品中不能同时含有以下所有标签
    no_tag_any: [], // 作品中必须含有以下任意一个标签
    no_tag_every: [], // 作品中必须同时含有以下所有标签
  };
};

/**
 * 根据标签作品信息过滤作品
 * @param {PxerWorks[]} worksList
 * @param {number} rated      - 作品不小于的赞的数量
 * @param {number} rated_pro  - 作品不小于的点赞率，小于0的数字
 * @param {number} view       - 作品不小于的浏览数
 * @return {PxerWorks[]}
 * */
PxerFilter.filterInfo = function (
  worksList,
  { rated = 0, rated_pro = 0, view = 0 }
) {
  return worksList.filter(function (works) {
    return (
      works.ratedCount >= rated &&
      works.viewCount >= view &&
      works.ratedCount / works.viewCount >= rated_pro
    );
  });
};

/**
 * 根据标签过滤作品
 * @param {PxerWorks[]} worksList
 * @param {string[]} no_tag_any    - 作品中不能含有里面的任意一个标签
 * @param {string[]} no_tag_every  - 作品中不能同时含有里面的所有标签
 * @param {string[]} has_tag_some  - 作品中必须含有有里面的任意一个标签
 * @param {string[]} has_tag_every - 作品中必须同时含有里面的所有标签
 * @return {PxerWorks[]}
 * */
PxerFilter.filterTag = function (
  worksList,
  { has_tag_every, has_tag_some, no_tag_any, no_tag_every }
) {
  var passWorks = worksList;

  if (has_tag_every && has_tag_every.length !== 0) {
    passWorks = passWorks.filter(function (works) {
      return has_tag_every.every((tag) => works.tagList.indexOf(tag) !== -1);
    });
  }

  if (has_tag_some && has_tag_some.length !== 0) {
    passWorks = passWorks.filter(function (works) {
      return has_tag_some.some((tag) => works.tagList.indexOf(tag) !== -1);
    });
  }

  if (no_tag_any && no_tag_any.length !== 0) {
    passWorks = passWorks.filter(function (works) {
      return !no_tag_any.some((tag) => works.tagList.indexOf(tag) !== -1);
    });
  }

  if (no_tag_every && no_tag_every.length !== 0) {
    passWorks = passWorks.filter(function (works) {
      return !no_tag_every.every((tag) => works.tagList.indexOf(tag) !== -1);
    });
  }

  return passWorks;
};

;


// src/app/PxerHtmlParser.js
"use strict";

class PxerHtmlParser {
  constructor() {
    throw new Error("PxerHtmlParse could not construct");
  }
}

/**
 * 解析页码任务对象
 * @param {PxerPageRequest} task - 抓取后的页码任务对象
 * @return {PxerWorksRequest[]|false} - 解析得到的作品任务对象
 * */
PxerHtmlParser.parsePage = function (task) {
  if (!(task instanceof PxerPageRequest)) {
    window["PXER_ERROR"] =
      "PxerHtmlParser.parsePage: task is not PxerPageRequest";
    return false;
  }
  if (!task.url || !task.html) {
    window["PXER_ERROR"] = "PxerHtmlParser.parsePage: task illegal";
    return false;
  }

  const parseList = function (elt) {
    return JSON.parse(elt.getAttribute("data-items")).filter(
      (i) => !i.isAdContainer
    ); // skip AD
  };

  var taskList = [];
  switch (task.type) {
    case "userprofile_manga":
    case "userprofile_illust":
    case "userprofile_all":
      var response = JSON.parse(task.html).body;
      if (task.type !== "userprofile_illust") {
        for (let elt in response.manga) {
          let tsk = new PxerWorksRequest({
            html: {},
            type: null,
            isMultiple: null,
            id: elt,
          });
          tsk.url = PxerHtmlParser.getUrlList(tsk);
          taskList.push(tsk);
        }
      }

      if (task.type !== "userprofile_manga") {
        for (let elt in response.illusts) {
          var tsk = new PxerWorksRequest({
            html: {},
            type: null,
            isMultiple: null,
            id: elt,
          });
          tsk.url = PxerHtmlParser.getUrlList(tsk);
          taskList.push(tsk);
        }
      }
      break;

    case "bookmark_works":
      var response = JSON.parse(task.html).body;
      for (let worki in response.works) {
        let work = response.works[worki];
        let tsk = new PxerWorksRequest({
          html: {},
          type: this.parseIllustType(work.illustType),
          isMultiple: work.pageCount > 1,
          id: work.id,
        });
        tsk.url = PxerHtmlParser.getUrlList(tsk);
        taskList.push(tsk);
      }
      break;
    case "member_works":
      var dom = PxerHtmlParser.HTMLParser(task.html);
      var elts = dom.body.querySelectorAll("a.work._work");
      for (let elt of elts) {
        var task = new PxerWorksRequest({
          html: {},
          type: (function (elt) {
            switch (true) {
              case elt.matches(".ugoku-illust"):
                return "ugoira";
              case elt.matches(".manga"):
                return "manga";
              default:
                return "illust";
            }
          })(elt),
          isMultiple: elt.matches(".multiple"),
          id: elt.getAttribute("href").match(/illust_id=(\d+)/)[1],
        });

        task.url = PxerHtmlParser.getUrlList(task);

        taskList.push(task);
      }

      break;
    case "rank":
      var data = JSON.parse(task.html);
      for (var task of data["contents"]) {
        var task = new PxerWorksRequest({
          html: {},
          type: this.parseIllustType(task["illust_type"]),
          isMultiple: task["illust_page_count"] > 1,
          id: task["illust_id"].toString(),
        });
        task.url = PxerHtmlParser.getUrlList(task);

        taskList.push(task);
      }

      break;
    case "discovery":
      var data = JSON.parse(task.html);
      for (var id of data.recommendations) {
        var task = new PxerWorksRequest({
          html: {},
          type: null,
          isMultiple: null,
          id: id.toString(),
        });
        task.url = PxerHtmlParser.getUrlList(task);

        taskList.push(task);
      }

      break;
    case "search":
      var dom = PxerHtmlParser.HTMLParser(task.html);
      var searchData = parseList(
        dom.body.querySelector("input#js-mount-point-search-result-list")
      );
      for (var searchItem of searchData) {
        var task = new PxerWorksRequest({
          html: {},
          type: this.parseIllustType(searchItem.illustType),
          isMultiple: searchItem.pageCount > 1,
          id: searchItem.illustId,
        });
        task.url = PxerHtmlParser.getUrlList(task);
        taskList.push(task);
      }

      break;
    case "bookmark_new":
      var data = JSON.parse(task.html);
      for (var task of data.body.thumbnails.illust) {
        var task = new PxerWorksRequest({
          html: {},
          type: this.parseIllustType(task.illustType),
          isMultiple: task.pageCount > 1,
          id: task.id,
        });
        task.url = PxerHtmlParser.getUrlList(task);

        taskList.push(task);
      }

      break;
    case "search_spa":
    case "search_tag":
      var response = JSON.parse(task.html).body;
      for (let illust of response.illustManga.data) {
        var tsk = new PxerWorksRequest({
          html: {},
          type: null,
          isMultiple: null,
          id: illust.id,
        });
        tsk.url = PxerHtmlParser.getUrlList(tsk);
        taskList.push(tsk);
      }
      break;
    default:
      const msg = `Unknown PageWorks type ${task.type}`;
      pxer.log(msg);
      throw new Error(msg);
  }

  if (taskList.length < 1) {
    window["PXER_ERROR"] = "PxerHtmlParser.parsePage: result empty";
    return false;
  }

  return taskList;
};

/**
 * 解析作品任务对象
 * @param {PxerWorksRequest} task - 抓取后的页码任务对象
 * @return {PxerWorks} - 解析得到的作品任务对象
 * */
PxerHtmlParser.parseWorks = function (task, options) {
  if (!(task instanceof PxerWorksRequest)) {
    window["PXER_ERROR"] =
      "PxerHtmlParser.parseWorks: task is not PxerWorksRequest";
    return false;
  }
  if (!task.url.every((item) => task.html[item])) {
    window["PXER_ERROR"] = "PxerHtmlParser.parseWorks: task illegal";
    return false;
  }

  for (let url in task.html) {
    if (options.isQuick) {
      let works = Object.entries(JSON.parse(task.html[url]).body.works);
      works = works.map(([id, work]) => {
        work.tags = {
          tags: work.tags.map((tag) => {
            return {
              tag,
            };
          }),
        };
        work.viewCount = work.viewCount ?? 100000000;
        work.bookmarkCount = work.bookmarkCount ?? 100000000;
        work.urls = {
          original: work.url.replace("_square1200", ""),
        };
        let tsk = new PxerWorksRequest({
          html: {
            [`https://www.pixiv.net/ajax/illust/${id}`]: JSON.stringify({
              body: work,
            }),
          },
          type: null,
          isMultiple: null,
          id: id,
          completed: true,
        });
        return tsk;
      });
      const pw = [];

      for (let work of works) {
        let data = {
          dom: "",
          task: work,
        };
        try {
          pw.push(PxerHtmlParser.parseMediumHtml(data));
        } catch (e) {
          pxer.log(`Error in parsing task of`, task);
          pxer.log(e);
          window["PXER_ERROR"] = `${task.id}:${e.message}`;
          if (window["PXER_MODE"] === "dev") console.error(task, e);
          continue;
        }
      }
      return pw;
    } else {
      let data = {
        dom: PxerHtmlParser.HTMLParser(task.html[url]),
        task: task,
      };
      try {
        var pw = PxerHtmlParser.parseMediumHtml(data);
      } catch (e) {
        pxer.log(`Error in parsing task of`, task);
        pxer.log(e);
        window["PXER_ERROR"] = `${task.id}:${e.message}`;
        if (window["PXER_MODE"] === "dev") console.error(task, e);
        return false;
      }
    }
    return pw;
  }
};

/**
 * @param {PxerWorksRequest} task
 * @return {Array}
 * */
PxerHtmlParser.getUrlList = function (task) {
  return [
    pxer.URLGetter.illustInfoById(task.id),
    // "https://www.pixiv.net/member_illust.php?mode=medium&illust_id=" + task.id,
  ];
};

PxerHtmlParser.parseMediumHtml = function ({ task, dom }) {
  var illustData = JSON.parse(
    task.html[pxer.URLGetter.illustInfoById(task.id)]
  ).body;

  var pw;
  switch (true) {
    case illustData.illustType === 2:
      pw = new PxerUgoiraWorks();
      break;
    case illustData.pageCount > 1:
      pw = new PxerMultipleWorks();
      break;
    default:
      pw = new PxerWorks();
      break;
  }

  pw.id = task.id;
  pw.type = this.parseIllustType(illustData.illustType);
  pw.tagList = illustData.tags.tags.map((e) => e.tag);
  pw.viewCount = illustData.viewCount;
  pw.ratedCount = illustData.bookmarkCount;
  if (pw instanceof PxerMultipleWorks) {
    pw.multiple = illustData.pageCount;
  }

  if (pw.type === "ugoira") {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://www.pixiv.net/ajax/illust/" + task.id + "/ugoira_meta",
      false
    );
    xhr.send();
    var meta = JSON.parse(xhr.responseText);
    let src = meta["body"]["originalSrc"];
    let URLObj = parseURL(src);

    pw.domain = URLObj.domain;
    pw.date = src.match(PxerHtmlParser.REGEXP["getDate"])[1];
    pw.frames = {
      framedef: meta["body"]["frames"],
      height: illustData.height,
      width: illustData.width,
    };
  } else {
    let src = illustData.urls.original;
    let URLObj = parseURL(src);

    pw.domain = URLObj.domain;
    pw.date = src.match(PxerHtmlParser.REGEXP["getDate"])[1];
    pw.fileFormat = src.match(/\.(jpg|gif|png)$/)[1];
  }

  return pw;
};

PxerHtmlParser.parseIllustType = function (type) {
  switch (type.toString()) {
    case "0":
    case "illust":
      return "illust";
    case "1":
    case "manga":
      return "manga";
    case "2":
    case "ugoira":
      return "ugoira";
  }
  return null;
};

PxerHtmlParser.REGEXP = {
  getDate: /img\/((?:\d+\/){5}\d+)/,
  getInitData: /\{token:.*\}(?=\);)/,
};

PxerHtmlParser.HTMLParser = function (aHTMLString) {
  var dom = document.implementation.createHTMLDocument("");
  dom.documentElement.innerHTML = aHTMLString;
  return dom;
};

/**@param {Element} img*/
PxerHtmlParser.getImageUrl = function (img) {
  return img.getAttribute("src") || img.getAttribute("data-src");
};

PxerHtmlParser.parseObjectLiteral = (function () {
  // Javascript object literal parser
  // Splits an object literal string into a set of top-level key-value pairs
  // (c) Michael Best (https://github.com/mbest)
  // License: MIT (http://www.opensource.org/licenses/mit-license.php)
  // Version 2.1.0
  // https://github.com/mbest/js-object-literal-parse
  // This parser is inspired by json-sans-eval by Mike Samuel (http://code.google.com/p/json-sans-eval/)

  // These two match strings, either with double quotes or single quotes
  var stringDouble = '"(?:[^"\\\\]|\\\\.)*"',
    stringSingle = "'(?:[^'\\\\]|\\\\.)*'",
    // Matches a regular expression (text enclosed by slashes), but will also match sets of divisions
    // as a regular expression (this is handled by the parsing loop below).
    stringRegexp = "/(?:[^/\\\\]|\\\\.)*/w*",
    // These characters have special meaning to the parser and must not appear in the middle of a
    // token, except as part of a string.
    specials = ",\"'{}()/:[\\]",
    // Match text (at least two characters) that does not contain any of the above special characters,
    // although some of the special characters are allowed to start it (all but the colon and comma).
    // The text can contain spaces, but leading or trailing spaces are skipped.
    everyThingElse = "[^\\s:,/][^" + specials + "]*[^\\s" + specials + "]",
    // Match any non-space character not matched already. This will match colons and commas, since they're
    // not matched by "everyThingElse", but will also match any other single character that wasn't already
    // matched (for example: in "a: 1, b: 2", each of the non-space characters will be matched by oneNotSpace).
    oneNotSpace = "[^\\s]",
    // Create the actual regular expression by or-ing the above strings. The order is important.
    token = RegExp(
      stringDouble +
        "|" +
        stringSingle +
        "|" +
        stringRegexp +
        "|" +
        everyThingElse +
        "|" +
        oneNotSpace,
      "g"
    ),
    // Match end of previous token to determine whether a slash is a division or regex.
    divisionLookBehind = /[\])"'A-Za-z0-9_$]+$/,
    keywordRegexLookBehind = { in: 1, return: 1, typeof: 1 };

  function trim(string) {
    return string == null
      ? ""
      : string.trim
      ? string.trim()
      : string.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
  }

  return function (objectLiteralString) {
    // Trim leading and trailing spaces from the string
    var str = trim(objectLiteralString);

    // Trim braces '{' surrounding the whole object literal
    if (str.charCodeAt(0) === 123) str = str.slice(1, -1);

    // Split into tokens
    var result = [],
      toks = str.match(token),
      key,
      values = [],
      depth = 0;

    if (toks) {
      // Append a comma so that we don't need a separate code block to deal with the last item
      toks.push(",");

      for (var i = 0, tok; (tok = toks[i]); ++i) {
        var c = tok.charCodeAt(0);
        // A comma signals the end of a key/value pair if depth is zero
        if (c === 44) {
          // ","
          if (depth <= 0) {
            if (!key && values.length === 1) {
              key = values.pop();
            }
            result.push([key, values.length ? values.join("") : undefined]);
            key = undefined;
            values = [];
            depth = 0;
            continue;
          }
          // Simply skip the colon that separates the name and value
        } else if (c === 58) {
          // ":"
          if (!depth && !key && values.length === 1) {
            key = values.pop();
            continue;
          }
          // A set of slashes is initially matched as a regular expression, but could be division
        } else if (c === 47 && i && tok.length > 1) {
          // "/"
          // Look at the end of the previous token to determine if the slash is actually division
          var match = toks[i - 1].match(divisionLookBehind);
          if (match && !keywordRegexLookBehind[match[0]]) {
            // The slash is actually a division punctuator; re-parse the remainder of the string (not including the slash)
            str = str.substr(str.indexOf(tok) + 1);
            toks = str.match(token);
            toks.push(",");
            i = -1;
            // Continue with just the slash
            tok = "/";
          }
          // Increment depth for parentheses, braces, and brackets so that interior commas are ignored
        } else if (c === 40 || c === 123 || c === 91) {
          // '(', '{', '['
          ++depth;
        } else if (c === 41 || c === 125 || c === 93) {
          // ')', '}', ']'
          --depth;
          // The key will be the first token; if it's a string, trim the quotes
        } else if (!key && !values.length && (c === 34 || c === 39)) {
          // '"', "'"
          tok = tok.slice(1, -1);
        }
        values.push(tok);
      }
    }
    return result;
  };
})();

PxerHtmlParser.getKeyFromStringObjectLiteral = function (s, key) {
  var resolvedpairs = this.parseObjectLiteral(s);
  for (var pair of resolvedpairs) {
    if (pair[0] === key) return pair[1];
  }
  return false;
};

pxer.URLGetter = {
  illustInfoById(id) {
    return "https://www.pixiv.net/ajax/illust/" + id;
  },
  search({ url = document.URL, page = 0 } = {}) {
    const defaultQueryString = "s_mode=s_tag_full";
    const queryString = url.split("?")[1];
    const query = new URLSearchParams(queryString);
    const tagsMatch = url.match(pxer.regexp.parseKeyword);

    let word = null;
    if (tagsMatch) {
      word = tagsMatch[1];
    } else {
      word = encodeURIComponent(query.get("word"));
    }

    return `https://www.pixiv.net/ajax/search/artworks/${word}?${defaultQueryString}&${queryString}&p=${
      page + 1
    }`;
  },
  bookmarkNew({ page = 0 }) {
    return (
      "https://www.pixiv.net/ajax/follow_latest/illust?mode=all&lang=zh&p=" +
      (page + 1)
    );
  },
};

;


// src/app/PxerPrinter.js
﻿class PxerPrinter {
  constructor(config, taskOption) {
    this.taskOption = taskOption;

    /**
     * 计算得到的下载地址
     * @type {string[]}
     * */
    this.address = [];
    /**计算得到的任务信息*/
    this.taskInfo = "";
    /**剥离的动图参数*/
    this.ugoiraFrames = {};

    /**配置信息*/
    this.config = PxerPrinter.defaultConfig();
    config && this.setConfig(config);
  }

  /**
   * 设置配置信息
   * @param {string|Object} key - 要设置的key或是一个将被遍历合并的对象
   * @param {string} [value] - 要设置的value
   * */
  setConfig(key, value) {
    if (arguments.length === 1 && typeof key === "object") {
      let obj = key;
      for (let objKey in obj) {
        if (objKey in this.config) this.config[objKey] = obj[objKey];
        else console.warn(`PxerPrinter.setConfig: skip key "${objKey}"`);
      }
    } else {
      if (!(key in this.config))
        throw new Error(`PxerPrinter.setConfig: ${key} is not in config`);
      this.config[key] = value;
    }
    return this;
  }
}

/**
 * 根据作品列表将下载地址填充到PxerPrinter#address
 * @param {PxerWorks[]} worksList
 * @return {void}
 * */
PxerPrinter.prototype["fillAddress"] = function (worksList) {
  for (let works of worksList) {
    let configKey = PxerPrinter.getWorksKey(works);
    if (configKey === "ugoira_zip" && this.config["ugoira_frames"] === "yes") {
      this.ugoiraFrames[works.id] = works.frames;
    }
    if (!(configKey in this.config))
      throw new Error(`PxerPrinter.fillAddress: ${configKey} in not in config`);
    if (this.config[configKey] === "no") continue;
    this.address.push(
      ...PxerPrinter.countAddress(
        works,
        this.taskOption,
        this.config[configKey]
      )
    );
  }
};

/**
 * 根据作品将可读的下载信息填充到PxerPrinter#taskInfo
 * @param {PxerWorks[]} worksList
 * @return {void}
 * */
PxerPrinter.prototype["fillTaskInfo"] = function (worksList) {
  var [manga, ugoira, illust, multiple, single, worksNum, address] = new Array(
    20
  ).fill(0);
  for (let works of worksList) {
    let configKey = PxerPrinter.getWorksKey(works);
    if (this.config[configKey] === "no") continue;

    worksNum++;

    switch (works.type) {
      case "manga":
        manga++;
        break;
      case "ugoira":
        ugoira++;
        break;
      case "illust":
        illust++;
        break;
      default:
        console.error(works);
        throw new Error(`PxerPrinter.fillTaskInfo: works.type illegal`);
        break;
    }

    if (works.isMultiple) {
      multiple++;
      address += works.multiple;
    } else {
      address++;
      single++;
    }
  }

  this.taskInfo = eval(pxer.t("phrase.taskInfo"));
};
/**
 * 将结果输出
 * 确保下载地址和任务信息已被填充
 * */
PxerPrinter.prototype["print"] = function () {
  /**判断输出动图参数*/
  if (
    this.config["ugoira_frames"] === "yes" &&
    Object.keys(this.ugoiraFrames).length !== 0
  ) {
    let win = window.open(document.URL, "_blank");
    if (!win) {
      alert(pxer.t("phrase.blockOpen"));
      return;
    }

    var scriptname = "";
    switch (navigator.platform) {
      case "Win32":
        scriptname = "bat批处理";
        break;
      default:
        scriptname = "bash";
        break;
    }
    let str = [
      "<p>/** 这个页面是自动生成的使用FFmpeg自行合成动图的" +
        scriptname +
        '脚本，详细使用教程见<a href="http://pxer.pea3nut.org/md/ugoira_concat" target="_blank" >http://pxer.pea3nut.org/md/ugoira_concat</a> */</p>',
      '<textarea style="height:100%; width:100%" readonly>',
      ...this.generateUgoiraScript(this.ugoiraFrames),
      "</textarea>",
    ];
    win.document.write(str.join("\n"));
  }

  {
    /**输出下载地址*/
    let win = window.open(document.URL, "_blank");
    if (!win) {
      alert(pxer.t("phrase.blockOpen"));
      return;
    }

    let str = [
      `<p>${pxer.t("phrase.pointPage")}</p>`,
      `<p>${this.taskInfo}</p>`,
      '<textarea style="height:100%; width:100%" readonly>',
      this.address.join("\n"),
      "</textarea>",
    ];
    win.document.write(str.join("\n"));
  }
};

/**
 * 根据作品类型，生成配置信息的key
 * @param {PxerWorks} works
 * @return {string}
 * @see PxerPrinter.defaultConfig
 * */
PxerPrinter.getWorksKey = function (works) {
  var configKey = null;
  if (works.type === "ugoira") {
    configKey = "ugoira_zip";
  } else {
    configKey = works.type + (works.isMultiple ? "_multiple" : "_single");
  }

  return configKey;
};

/**
 * 根据动图参数，生成ffmpeg脚本
 * @param 动图参数
 * @return {String[]} 生成的脚本行
 * @see PxerPrinter.prototype['print']
 */
PxerPrinter.prototype["generateUgoiraScript"] = function (frames) {
  var lines = [];
  var resstring;
  var ffmpeg;
  var isWindows =
    ["Win32", "Win64", "Windows", "WinCE"].indexOf(navigator.platform) !== -1;
  switch (this.config.ugoira_zip) {
    case "max":
      resstring = "1920x1080";
      break;
    case "600p":
      resstring = "600x338";
      break;
  }
  var slashstr = "";
  if (isWindows) {
    slashstr = "^";
    ffmpeg = "ffmpeg";
    lines.push("@echo off");
    lines.push("set /p ext=请输入输出文件扩展名(mp4/gif/...):");
  } else {
    slashstr = "\\";
    ffmpeg = "$ffmpeg";
    lines.push("#!/bin/bash");
    lines.push("");
    lines.push(
      '{ hash ffmpeg 2>/dev/null && ffmpeg=ffmpeg;} || { [ -x ./ffmpeg ] && ffmpeg=./ffmpeg;} || { echo >&2 "Failed to locate ffmpeg executable. Aborting."; exit 1;}'
    );
    lines.push("read -p '请输入输出文件扩展名(mp4/gif/...):' ext");
  }
  for (let key in frames) {
    var foldername = key + "_ugoira" + resstring;
    var confpath = foldername + "/config.txt";
    var height = frames[key].height;
    var width = frames[key].width;
    if (this.config.ugoira_zip === "600p") {
      var scale = Math.max(height, width) / 600;
      height = parseInt(height / scale);
      width = parseInt(width / scale);
    }
    lines.push(
      isWindows
        ? "del " + foldername + "\\config.txt >nul 2>nul"
        : "rm " + foldername + "/config.txt &> /dev/null"
    );
    for (let frame of frames[key].framedef) {
      lines.push(
        "echo file " +
          slashstr +
          "'" +
          frame["file"] +
          slashstr +
          "' >> " +
          confpath
      );
      lines.push("echo duration " + frame["delay"] / 1000 + " >> " + confpath);
    }
    lines.push(
      "echo file " +
        slashstr +
        "'" +
        frames[key].framedef[frames[key].framedef.length - 1]["file"] +
        slashstr +
        "' >> " +
        confpath
    );
    lines.push(isWindows ? "if %ext%==gif (" : 'if [ $ext == "gif"]; then');
    lines.push(
      ffmpeg +
        " -f concat -i " +
        confpath +
        " -vf palettegen " +
        foldername +
        "/palette.png"
    );
    lines.push(
      ffmpeg +
        " -f concat -i " +
        confpath +
        " -i " +
        foldername +
        "/palette.png -lavfi paletteuse -framerate 30 -vsync -1 -s " +
        width +
        "x" +
        height +
        " " +
        foldername +
        "/remux." +
        (isWindows ? "%ext%" : "$ext")
    );
    lines.push(isWindows ? ") else (" : "else");
    lines.push(
      ffmpeg +
        " -f concat -i " +
        confpath +
        " -framerate 30 -vsync -1 -s " +
        width +
        "x" +
        height +
        " " +
        foldername +
        "/remux." +
        (isWindows ? "%ext%" : "$ext")
    );
    lines.push(isWindows ? ")" : "fi");
  }
  if (isWindows) {
    lines.push("echo 完成 & pause");
  } else {
    lines.push('read  -n 1 -p "完成，按任意键退出" m && echo');
  }
  return lines;
};

/**返回默认的配置对象*/
PxerPrinter.defaultConfig = function () {
  return {
    manga_single: "max", //[max|600p|no]
    manga_multiple: "max", //[max|1200p|cover_600p|no]
    illust_single: "max", //[max|600p|no]
    illust_multiple: "max", //[max|1200p|cover_600p|no]
    ugoira_zip: "no", //[max|600p|no]
    ugoira_frames: "no", //[yes|no]
  };
};
/**作品页跳过过滤 */
PxerPrinter.printAllConfig = function () {
  return {
    manga_single: "max", //[max|600p|no]
    manga_multiple: "max", //[max|1200p|cover_600p|no]
    illust_single: "max", //[max|600p|no]
    illust_multiple: "max", //[max|1200p|cover_600p|no]
    ugoira_zip: "max", //[max|600p|no]
    ugoira_frames: "yes", //[yes|no]
  };
};

/**
 * 拼装动图原始地址
 * @param {PxerUgoiraWorks} works - 作品
 * @param {string} [type] - 拼装类型 [max|600p]
 * @return {Array}
 * */
PxerPrinter.getUgoira = function (works, taskOption, type = "max") {
  const tpl = {
    max: "https://#domain#/img-zip-ugoira/img/#date#/#id#_ugoira1920x1080.zip",
    "600p": "https://#domain#/img-zip-ugoira/img/#date#/#id#_ugoira600x600.zip",
  };

  var address = tpl[type];
  if (!address) throw new Error(`PxerPrint.getUgoira: unknown type "${type}"`);

  for (let key in works) {
    address = address.replace(`#${key}#`, works[key]);
  }

  return [address];
};
/**
 * 拼装多副原始地址
 * @param {PxerMultipleWorks} works - 作品
 * @param {string} [type] - 拼装类型 [max|1200p|cover_600p]
 * @return {Array}
 * */
PxerPrinter.getMultiple = function (works, taskOption, type = "max") {
  const tpl = {
    max: "https://#domain#/img-original/img/#date#/#id#_p#index#.#fileFormat#",
    "1200p":
      "https://#domain#/c/1200x1200/img-master/img/#date#/#id#_p#index#_master1200.jpg",
    cover_600p:
      "https://#domain#/c/600x600/img-master/img/#date#/#id#_p0_master1200.jpg",
  };

  if (taskOption.isQuick) {
    let address = tpl[type];
    if (!address)
      throw new Error(`PxerPrint.getMultiple: unknown type "${type}"`);

    // 由于不知道是jpg还是png，所以要渲染两次
    works["fileFormat"] = "jpg";
    for (let key in works) {
      address = address.replace(`#${key}#`, works[key]);
    }
    //渲染多张
    var addressList1 = [];
    for (let i = 0; i < works.multiple; i++) {
      addressList1.push(address.replace("#index#", i));
    }

    address = tpl[type];
    works["fileFormat"] = "png";
    for (let key in works) {
      address = address.replace(`#${key}#`, works[key]);
    }
    //渲染多张
    var addressList2 = [];
    for (let i = 0; i < works.multiple; i++) {
      addressList2.push(address.replace("#index#", i));
    }

    console.log([...addressList1, ...addressList2]);
    return [...addressList1, ...addressList2];
  } else {
    let address = tpl[type];
    if (!address)
      throw new Error(`PxerPrint.getMultiple: unknown type "${type}"`);

    for (let key in works) {
      address = address.replace(`#${key}#`, works[key]);
    }

    //渲染多张
    var addressList = [];
    for (let i = 0; i < works.multiple; i++) {
      addressList.push(address.replace("#index#", i));
    }

    return addressList;
  }
};
/**
 * 拼装单副原始地址
 * @param {PxerWorks} works - 作品
 * @param {string=max} [type] - 拼装类型 [max|600p]
 * @return {Array}
 * */
PxerPrinter.getWorks = function (works, taskOption, type = "max") {
  const tpl = {
    max: "https://#domain#/img-original/img/#date#/#id#_p0.#fileFormat#",
    "600p":
      "https://#domain#/c/600x600/img-master/img/#date#/#id#_p0_master1200.jpg",
  };
  if (taskOption.isQuick) {
    const addressList = [];
    var addressTemplate = tpl[type];
    if (!addressTemplate)
      throw new Error(`PxerPrint.getWorks: unknown type "${type}"`);

    works["fileFormat"] = "jpg";
    let address = addressTemplate;
    for (let key in works) {
      address = address.replace(`#${key}#`, works[key]);
    }
    addressList.push(address);

    works["fileFormat"] = "png";
    address = addressTemplate;
    for (let key in works) {
      address = address.replace(`#${key}#`, works[key]);
    }
    addressList.push(address);

    return addressList;
  } else {
    let address = tpl[type];
    if (!address) throw new Error(`PxerPrint.getWorks: unknown type "${type}"`);

    for (let key in works) {
      address = address.replace(`#${key}#`, works[key]);
    }

    return [address];
  }
};
/**
 * 智能拼装原始地址，对上述的简单封装
 * @param {PxerWorks} [works]
 * @param {...arguments} [argn]
 * @return {Array}
 * */
PxerPrinter.countAddress = function (works, taskOption, argn) {
  switch (true) {
    case works.type === "ugoira":
      return PxerPrinter.getUgoira(...arguments);
    case works.isMultiple:
      return PxerPrinter.getMultiple(...arguments);
    default:
      return PxerPrinter.getWorks(...arguments);
  }
};

;


// src/app/PxerThread.js
class PxerThread extends PxerEvent {
  /**
   * @param id {string} 线程的ID，便于调试
   * @param {Object} config 线程的配置信息
   * */
  constructor({ id, config } = {}) {
    super(["load", "error", "fail"]);
    /**当前线程的ID*/
    this.id = id;
    /**
     * 当前线程的状态
     * - free
     * - ready
     * - error
     * - fail
     * - running
     * */
    this.state = "free";
    /**线程执行的任务*/
    this.task = null;

    /**
     *
     * */
    this.config = config || {
      /**ajax超时重试时间*/
      timeout: 8000,
      /**最多重试次数*/
      retry: 5,
    };

    /**运行时参数*/
    this.runtime = {};

    /**使用的xhr对象*/
    this.xhr = null;
  }
}

/**
 * 对抓取到的URL和HTML进行校验
 * @param {string} url
 * @param {string} html
 * @return {string|true} 返回字符串表示失败
 * */
PxerThread.checkRequest = function (url, html) {
  if (!html) return "empty";
  if (html.indexOf("_no-item _error") !== -1) {
    if (html.indexOf("sprites-r-18g-badge") !== -1) return "r-18g";
    if (html.indexOf("sprites-r-18-badge") !== -1) return "r-18";
  }

  if (html.indexOf("sprites-mypixiv-badge") !== -1) return "mypixiv";
  return true;
};

/**终止线程的执行*/
PxerThread.prototype["stop"] = function () {
  this.xhr.abort();
};

/**
 * 初始化线程
 * @param {PxerRequest} task
 * */
PxerThread.prototype["init"] = function (task) {
  this.task = task;

  this.runtime = {};
  this.state = "ready";

  // 必要的检查
  if (Number.isNaN(+this.config.timeout) || Number.isNaN(+this.config.retry)) {
    throw new Error(`PxerThread#init: ${this.id} config illegal`);
  }

  //判断行为，读取要请求的URL
  if (this.task instanceof PxerWorksRequest) {
    this.runtime.urlList = this.task.url.slice();
    // this.runtime.urlList.push(pxer.URLGetter.illustInfoById(this.task.id));
  } else if (this.task instanceof PxerPageRequest) {
    this.runtime.urlList = [this.task.url];
  } else {
    this.dispatch("error", `PxerThread#${this.id}.init: unknown task`);
    return false;
  }
};

/**
 * 使用PxerThread#xhr发送请求
 * @param {string} url
 * */
PxerThread.prototype["sendRequest"] = function (url) {
  this.state = "running";
  this.xhr.open("GET", url, true);
  // 单副漫画请求需要更改Referer头信息
  if (
    this.task instanceof PxerWorksRequest &&
    this.task.type === "manga" &&
    this.task.isMultiple === false &&
    /mode=big/.test(url)
  ) {
    var referer = this.task.url.find(
      (item) => item.indexOf("mode=medium") !== -1
    );
    var origin = document.URL;
    if (!referer) {
      this.dispatch("error", "PxerThread.sendRequest: cannot find referer");
    }

    history.replaceState({}, null, referer);
    this.xhr.send();
    history.replaceState({}, null, origin);
  } else {
    this.xhr.send();
  }
};
/**运行线程*/
PxerThread.prototype["run"] = function _self(oldUrl) {
  const startTime = +new Date();
  const URL = oldUrl || this.runtime.urlList.shift();
  if (!URL) {
    this.state = "free";
    this.task.completed = true;
    this.dispatch("load", this.task);
    return true;
  }

  const XHR = new XMLHttpRequest();

  this.xhr = XHR;
  XHR.timeout = this.config.timeout;
  XHR.responseType = "text";

  var retry = 0;
  XHR.addEventListener("timeout", () => {
    if (++retry > this.config.retry) {
      this.state = "fail";
      this.dispatch(
        "fail",
        new PxerFailInfo({
          task: this.task,
          url: URL,
          type: "timeout",
          xhr: XHR,
        })
      );
      return false;
    } else {
      this.sendRequest(URL);
    }
  });
  XHR.addEventListener("load", () => {
    if (XHR.status === 429) {
      setTimeout(() => {
        _self.call(this, URL); //递归
      }, 5000);
      return false;
    }
    if (XHR.status.toString()[0] !== "2" && XHR.status !== 304) {
      this.state = "fail";
      this.dispatch(
        "fail",
        new PxerFailInfo({
          task: this.task,
          url: URL,
          type: "http:" + XHR.status,
        })
      );
      return false;
    }

    // 判断是否真的请求成功
    var msg = PxerThread.checkRequest(URL, XHR.responseText);
    if (msg !== true) {
      this.state = "fail";
      this.dispatch("fail", {
        task: this.task,
        url: URL,
        type: msg,
      });
      return false;
    }

    // 执行成功回调
    if (this.task instanceof PxerWorksRequest) {
      this.task.html[URL] = XHR.responseText;
    } else {
      this.task.html = XHR.responseText;
    }

    setTimeout(() => {
      _self.call(this); //递归
    }, 2000 - (+new Date() - startTime));

    return true;
  });
  XHR.addEventListener("error", () => {
    this.state = "error";
    this.dispatch("error", {
      task: this.task,
      url: URL,
    });
  });

  this.sendRequest(URL);
};

;


// src/app/PxerThreadManager.js
class PxerThreadManager extends PxerEvent {
  /**
   * @param {number} timeout - 超时时间
   * @param {number} retry   - 重试次数
   * @param {number} thread  - 线程数
   * */
  constructor({ timeout = 5000, retry = 3, thread = 1 } = {}) {
    super(["load", "error", "fail", "warn"]);

    this.config = { timeout, retry, thread };

    /**
     * 任务列表
     * @type {PxerRequest[]}
     * */
    this.taskList = [];
    /**执行的任务列表的指针，指派了下一条要执行的任务*/
    this.pointer = 0;
    /**
     * 存放的线程对象
     * @type {PxerThread[]}
     * */
    this.threads = [];
    /**
     * 每当执行任务开始前调用的中间件
     * @type {Function[]} 返回true继续执行，false终止执行
     * */
    this.middleware = [
      function (task) {
        return !!task;
      },
    ];

    /**运行时用到的变量*/
    this.runtime = {};
  }
}

/**
 * 停止线程的执行，实际上假装任务都执行完了
 * 停止后还会触发load事件，需要一段时间
 * */
PxerThreadManager.prototype["stop"] = function () {
  this.pointer = this.taskList.length + 1;
};

/**
 * 初始化线程管理器
 * @param {PxerRequest[]} taskList
 * */
PxerThreadManager.prototype["init"] = function (taskList) {
  if (!this.taskList.every((request) => request instanceof PxerRequest)) {
    this.dispatch("error", "PxerThreadManager.init: taskList is illegal");
    return false;
  }

  // 初始任务与结果
  this.taskList = taskList;
  this.runtime = {};
  this.pointer = 0;

  // 建立线程对象
  this.threads = [];
  for (let i = 0; i < this.config.thread; i++) {
    this.threads.push(
      new PxerThread({
        id: i,
        config: {
          timeout: this.config.timeout,
          retry: this.config.retry,
        },
      })
    );
  }

  return this;
};
/**
 * 运行线程管理器
 * */
PxerThreadManager.prototype["run"] = function () {
  if (this.taskList.length === 0) {
    this.dispatch("warn", "PxerApp#run: taskList.length is 0");
    this.dispatch("load", []);
    return false;
  }

  for (let thread of this.threads) {
    thread.on("load", (data) => {
      next(this, thread);
    });
    thread.on("fail", (pfi) => {
      this.dispatch("fail", pfi);
      next(this, thread);
    });
    thread.on("error", this.dispatch.bind(this, "error"));

    next(this, thread);
  }

  function next(ptm, thread) {
    if (ptm.middleware.every((fn) => fn(ptm.taskList[ptm.pointer]))) {
      thread.init(ptm.taskList[ptm.pointer++]);
      thread.run();
    } else if (
      ptm.threads.every(
        (thread) => ["free", "fail", "error"].indexOf(thread.state) !== -1
      )
    ) {
      ptm.dispatch("load", ptm.taskList);
    }
  }
};

;


// src/app/PxerApp.js
"use strict";

/**
 * Pxer主程序对象，与所有模块都是强耦合关系
 * 若你想阅读源码，建议不要从这个类开始
 * @class
 * */
class PxerApp extends PxerEvent {
  constructor() {
    /**
     * 可能被触发的事件
     * - stop 被终止时
     * - error 出错时
     * - executeWroksTask 执行作品抓取时
     * - finishWorksTask  完成作品抓取时
     * - executePageTask  执行页码抓取时
     * - finishPageTask   完成页码抓取时
     * - finishTask 完成所有任务
     * */
    super([
      "executeWroksTask",
      "executePageTask",
      "finishWorksTask",
      "finishPageTask",
      "error",
      "stop",
    ]);

    /**
     * 当前页面类型。可能的值
     * @type {string}
     * */
    this.pageType = getPageType(document);
    /**
     * 页面的作品数量
     * @type {number|null}
     * @see PxerApp.init
     * */
    this.worksNum = null;

    /**
     * 任务队列
     * @type {PxerRequest[]}
     * */
    this.taskList = [];
    /**
     * 失败的任务信息
     * @type {PxerFailInfo[]}
     * */
    this.failList = [];
    /**
     * 抓取到的结果集
     * @type {PxerWorks[]}
     * */
    this.resultSet = [];
    /**
     * 过滤得到的结果集
     * @type {PxerWorks[]}
     * */
    this.filterResult = [];

    /**
     * 任务配置选项，用来指派任务执行过程中的一些逻辑
     * 必须在PxerApp#initPageTask调用前配置
     * */
    this.taskOption = {
      /**仅抓取前几副作品*/
      limit: null,
      /**遇到id为x的作品停止后续，不包括本id*/
      stopId: null,
      isQuick: true,
    };

    // 其他对象的配置参数
    this.ptmConfig = {
      //PxerThreadManager
      timeout: 5000,
      retry: 3,
      thread: 2,
    };

    this.ppConfig = this.pageType.startsWith("works_")
      ? PxerPrinter.printAllConfig()
      : PxerPrinter.defaultConfig(); //PxerPrinter
    this.pfConfig = PxerFilter.defaultConfig(); //PxerFilter

    // 使用的PxerThreadManager实例
    this.ptm = null;

    pxer.app = this;
  }

  static canCrawl(doc = document) {
    return [
      "search",
      "search_spa",
      "search_tag",
      "works_medium",
      "rank",
      "bookmark_new",
      "discovery",
      "bookmark_works",
      "member_works_new",
    ].includes(pxer.util.getPageType(doc));
  }

  /**
   * 初始化时的耗时任务
   */
  async init() {
    this.worksNum = await PxerApp.getWorksNum(document);
  }

  /**
   * 停止执行当前任务
   * 调用后仍会触发对应的finish*事件
   * */
  stop() {
    this.dispatch("stop");
    this.ptm.stop();
  }

  /**初始化批量任务*/
  initPageTask() {
    if (
      typeof this.pageType !== "string" ||
      typeof this.worksNum !== "number"
    ) {
      this.dispatch(
        "error",
        "PxerApp.initPageTask: pageType or number illegal"
      );
      return false;
    }

    let onePageWorksNumber = getOnePageWorkCount(this.pageType);

    var pageNum =
      Math.ceil(this.taskOption.limit ? this.taskOption.limit : this.worksNum) /
      onePageWorksNumber;

    if (this.pageType === "discovery") {
      var mode;
      switch (true) {
        case document.URL.match(/mode=(r18|safe|all)/) === null:
          mode = "all";
          break;
        default:
          mode = document.URL.match(/mode=(r18|safe|all)/)[1];
          break;
      }
      var recomCount = this.taskOption.limit
        ? this.taskOption.limit
        : this.worksNum;
      this.taskList.push(
        new PxerPageRequest({
          url: `https://www.pixiv.net/rpc/recommender.php?type=illust&sample_illusts=auto&num_recommendations=${recomCount}&page=discovery&mode=${mode}&tt=${pixiv.context.token}`,
          type: this.pageType,
        })
      );
    } else if (this.pageType === "member_works_new") {
      var uid = getIDfromURL();
      var type = document.URL.match(/type=(\w+)/)
        ? document.URL.match(/type=(\w+)/)[1]
        : "all";
      this.taskList.push(
        new PxerPageRequest({
          url: `https://www.pixiv.net/ajax/user/${uid}/profile/all`,
          type: type ? `userprofile_${type}` : "userprofile_all",
        })
      );
    } else if (this.pageType === "bookmark_works") {
      const queryInfo = new URLSearchParams(location.search);
      for (let offset = 0; offset < 48 * pageNum; offset += 48) {
        let id =
          getIDfromURL() ||
          getIDfromURL(
            "id",
            document.querySelector("a.user-name").getAttribute("href")
          ); // old bookmark page
        this.taskList.push(
          new PxerPageRequest({
            type: this.pageType,
            url: `https://www.pixiv.net/ajax/user/${id}/illusts/bookmarks?tag=&offset=${offset}&limit=48&rest=${
              queryInfo.get("rest") || "show"
            }`,
          })
        );
      }
    } else if (["search_spa", "search_tag"].includes(this.pageType)) {
      for (let page = 0; page < pageNum; page++) {
        this.taskList.push(
          new PxerPageRequest({
            url: pxer.URLGetter.search({ page }),
            type: this.pageType,
          })
        );
      }
    } else if (this.pageType === "bookmark_new") {
      for (let page = 0; page < pageNum; page++) {
        this.taskList.push(
          new PxerPageRequest({
            url: pxer.URLGetter.bookmarkNew({ page }),
            type: this.pageType,
          })
        );
      }
    } else {
      var separator = document.URL.includes("?") ? "&" : "?";
      var extraparam = this.pageType === "rank" ? "&format=json" : "";
      for (var i = 0; i < pageNum; i++) {
        this.taskList.push(
          new PxerPageRequest({
            type: this.pageType,
            url: document.URL + separator + "p=" + (i + 1) + extraparam,
          })
        );
      }
    }
  }

  /**抓取页码*/
  executePageTask() {
    if (this.taskList.length === 0) {
      this.dispatch("error", "PxerApp.executePageTask: taskList is empty");
      return false;
    }

    if (!this.taskList.every((request) => request instanceof PxerPageRequest)) {
      this.dispatch("error", "PxerApp.executePageTask: taskList is illegal");
      return false;
    }

    this.dispatch("executePageTask");

    var ptm = (this.ptm = new PxerThreadManager(this.ptmConfig));
    ptm.on("error", (...argn) => this.dispatch("error", argn));
    ptm.on("warn", (...argn) => this.dispatch("error", argn));
    ptm.on("load", () => {
      var parseResult = [];
      for (let result of this.taskList) {
        result = PxerHtmlParser.parsePage(result);
        if (!result) {
          this.dispatch("error", window["PXER_ERROR"]);
          continue;
        }
        parseResult.push(...result);
      }
      this.resultSet = this.filterWorks(parseResult);

      this.dispatch("finishPageTask", this.resultSet);
    });
    ptm.on("fail", (pfi) => {
      ptm.pointer--; //失败就不停的尝试
    });
    ptm.init(this.taskList);
    ptm.run();
  }

  // 作品筛选
  filterWorks(parseResult = this.resultSet) {
    let data = parseResult;
    if (this.taskOption.limit) {
      data = data.slice(0, this.taskOption.limit);
    }
    if (this.taskOption.stopId) {
      data = data.filter((item) => item.id > this.taskOption.stopId);
    }

    this.worksNum = data.length;
    return data;
  }

  /**
   * 抓取作品
   * @param {PxerWorksRequest[]} tasks - 要执行的作品请求数组
   * */
  executeWroksTask(tasks = this.taskList) {
    if (tasks.length === 0) {
      this.dispatch("error", "PxerApp.executeWroksTask: taskList is empty");
      return false;
    }

    if (!tasks.every((request) => request instanceof PxerWorksRequest)) {
      this.dispatch("error", "PxerApp.executeWroksTask: taskList is illegal");
      return false;
    }

    // 任务按ID降序排列(#133)
    if (
      ["member_info", "member_works_new", "member_works"].includes(
        this.pageType
      )
    ) {
      tasks.sort((a, b) => Number(b.id) - Number(a.id));
    }

    this.dispatch("executeWroksTask");

    var ptm = (this.ptm = new PxerThreadManager(this.ptmConfig));
    ptm.on("error", (...argn) => this.dispatch("error", argn));
    ptm.on("warn", (...argn) => this.dispatch("error", argn));

    ptm.on("load", () => {
      this.resultSet = [];

      let tl = this.taskList;
      if (!this.taskOption.isQuick) {
        tl = this.taskList.slice(
          //限制结果集条数
          0,
          this.taskOption.limit ? this.taskOption.limit : undefined
        );
      }

      for (let pwr of tl) {
        if (!pwr.completed) continue; //跳过未完成的任务
        let pw = PxerHtmlParser.parseWorks(pwr, this.taskOption);
        if (!pw) {
          pwr.completed = false;
          ptm.dispatch(
            "fail",
            new PxerFailInfo({
              type: "parse",
              task: pwr,
              url: pwr.url[0],
            })
          );
          this.dispatch("error", window["PXER_ERROR"]);
          continue;
        }
        if (this.taskOption.isQuick) {
          this.resultSet.push(...pw);
        } else {
          this.resultSet.push(pw);
        }
      }
      this.dispatch("finishWorksTask", this.resultSet);
    });
    ptm.on("fail", (pfi) => {
      this.failList.push(pfi);
    });

    if (this.taskOption.isQuick) {
      tasks = pxer.util.chunk(tasks, 48).map((chunk) => {
        let tsk = new PxerWorksRequest({
          html: {},
          type: null,
          isMultiple: null,
          id: chunk[0].id,
        });
        tsk.url = [
          `https://www.pixiv.net/ajax/user/7356311/profile/illusts?${chunk
            .map((c) => `ids[]=${c.id}&`)
            .join("")}work_category=illustManga&is_first_page=0`,
        ];
        return tsk;
      });
      this.taskList = tasks;
    }
    ptm.init(tasks);
    ptm.run();

    return true;
  }

  /**对失败的作品进行再抓取*/
  executeFailWroks(list = this.failList) {
    // 把重试的任务从失败列表中减去
    this.failList = this.failList.filter((pfi) => list.indexOf(pfi) === -1);
    // 执行抓取
    this.executeWroksTask(list.map((pfi) => pfi.task));
  }

  /**抓取页码完成后，初始化，准备抓取作品*/
  switchPage2Works(len = this.resultSet.length) {
    this.taskList = this.resultSet.slice(0, len);
    this.resultSet = [];
  }

  /**
   * 获取当前抓取到的可读的任务信息
   * @return {string}
   * */
  getWorksInfo() {
    var pp = new PxerPrinter(this.ppConfig, this.taskOption);
    var pf = new PxerFilter(this.pfConfig);
    pp.fillTaskInfo(pf.filter(this.resultSet));
    return pp.taskInfo;
  }

  /**
   * 输出抓取到的作品
   * */
  printWorks() {
    var pp = new PxerPrinter(this.ppConfig, this.taskOption);
    var pf = new PxerFilter(this.pfConfig);
    var works = pf.filter(this.resultSet);
    pp.fillTaskInfo(works);
    pp.fillAddress(works);
    pp.print();
  }
}

/**直接抓取本页面的作品*/
PxerApp.prototype["getThis"] = async function () {
  // 生成任务对象
  var id =
    pxer.util.getIDfromURL("illust_id") ||
    document.URL.match(pxer.regexp.urlWorkDetail)[1];
  var initdata = await pxer.util.fetchPixivApi(
    pxer.URLGetter.illustInfoById(id)
  );

  var type = initdata.illustType;
  var pageCount = initdata.pageCount;
  var pwr = new PxerWorksRequest({
    isMultiple: pageCount > 1,
    id: id,
  }); //[manga|ugoira|illust]
  switch (type) {
    case 2:
      pwr.type = "ugoira";
      break;
    case 1:
      pwr.type = "illust";
      break;
    case 0:
      pwr.type = "manga";
      break;
    default:
      throw new Error("Unknown work type. id:" + id);
  }
  pwr.url = PxerHtmlParser.getUrlList(pwr);
  // 添加执行
  this.taskList = [pwr];
  this.one("finishWorksTask", () => this.printWorks());
  this.executeWroksTask();
  return true;
};

/**
 * 获取当前页面的总作品数
 * @param {Document=document} dom - 页面的document对象
 * @return {number} - 作品数
 * */
PxerApp.getWorksNum = function async(dom = document) {
  return new Promise((resolve, reject) => {
    const pageType = pxer.util.getPageType(dom);

    if (pageType === "rank") {
      let queryurl = dom.URL + "&format=json";
      let xhr = new XMLHttpRequest();
      xhr.open("GET", queryurl);
      xhr.onload = (e) => resolve(JSON.parse(xhr.responseText)["rank_total"]);
      xhr.send();
    } else if (pageType === "bookmark_new") {
      // 关注的新作品页数最多100页
      // 因为一般用户关注的用户数作品都足够填满100页，所以从100开始尝试页数
      // 如果没有100页进行一次二分查找
      this.getFollowingBookmarkWorksNum(0, 100).then((res) => resolve(res));
    } else if (pageType === "discovery") {
      resolve(3000);
    } else if (pageType === "bookmark_works") {
      const queryInfo = new URLSearchParams(location.search);
      let id =
        getIDfromURL("id", dom.URL) ||
        getIDfromURL(
          "id",
          dom.querySelector("a.user-name").getAttribute("href")
        ); // old bookmark page
      let queryurl = `https://www.pixiv.net/ajax/user/${id}/illusts/bookmarks?tag=&offset=0&limit=48&rest=${
        queryInfo.get("rest") || "show"
      }`;
      let xhr = new XMLHttpRequest();
      xhr.open("GET", queryurl);
      xhr.onload = (e) => {
        resolve(JSON.parse(xhr.responseText).body.total);
      };
      xhr.send();
    } else if (pageType === "member_works_new") {
      let queryurl = `https://www.pixiv.net/ajax/user/${getIDfromURL()}/profile/all`;
      let xhr = new XMLHttpRequest();
      xhr.open("GET", queryurl);
      xhr.onload = (e) => {
        var resp = JSON.parse(xhr.responseText).body;
        var type = dom.URL.match(/type=(manga|illust)/);
        var getKeyCount = function (obj) {
          return Object.keys(obj).length;
        };
        if (!type) {
          resolve(getKeyCount(resp.illusts) + getKeyCount(resp.manga));
        } else if (type[1] === "illust") {
          resolve(getKeyCount(resp.illusts));
        } else {
          resolve(getKeyCount(resp.manga));
        }
      };
      xhr.send();
    } else if (["search_spa", "search_tag"].includes(pageType)) {
      pxer.util.fetchPixivApi(pxer.URLGetter.search()).then((data) => {
        resolve(data.illustManga.total);
      });
    } else {
      let elt = dom.querySelector(".count-badge");
      if (!elt) resolve(null);
      resolve(parseInt(elt.innerHTML));
    }
  });
};

/**
 * 获取关注的新作品页的总作品数
 * @param {number} startPage - 最小页数
 * @param {number} maxPage - 最大页数
 * @return {number} - 作品数
 */
PxerApp.getFollowingBookmarkWorksNum = async function (startPage, maxPage) {
  const requestForCount = async (page = 0) => {
    const data = await fetch(pxer.URLGetter.bookmarkNew({ page }));
    return (await data.json()).body.page.ids.length;
  };

  // count how many item per page
  const pageSize = await requestForCount();

  // dichotomy search for the last page
  const [lastPage, lastPageSize] = await (async () => {
    const maxPageSize = await requestForCount(maxPage);
    if (maxPageSize > 0) return [maxPage, maxPageSize];

    let currentMinPage = startPage;
    let currentMaxPage = maxPage;
    let currentPage = ~~(maxPage / 2);
    while (true) {
      const currentPageSize = await requestForCount(currentPage);
      if (currentPageSize > 0 && currentPageSize < pageSize) {
        return [currentPage, currentPageSize];
      }
      if (currentPage === startPage || currentPage === maxPage) {
        return [currentPage, pageSize];
      }
      if (currentPageSize === 0) {
        currentMaxPage = currentPage;
        currentPage -= Math.ceil((currentPage - currentMinPage - 1) / 2);
      } else if (currentPageSize === pageSize) {
        currentMinPage = currentPage;
        currentPage += Math.ceil((currentMaxPage - currentPage) / 2);
      }
    }
  })();

  return (lastPage - startPage) * pageSize + lastPageSize;
};

;


// src/view/AutoSuggestControl.js
"use strict";
/*!
 * Copyright (c) 2013 Profoundis Labs Pvt. Ltd., and individual contributors.
 *
 * All rights reserved.
 */
/*
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 *     1. Redistributions of source code must retain the above copyright notice,
 *        this list of conditions and the following disclaimer.
 *
 *     2. Redistributions in binary form must reproduce the above copyright
 *        notice, this list of conditions and the following disclaimer in the
 *        documentation and/or other materials provided with the distribution.
 *
 *     3. Neither the name of autojs nor the names of its contributors may be used
 *        to endorse or promote products derived from this software without
 *        specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * reuses a lot of code from Nicholas C. Zakas textfield autocomplete example found here
 * http://oak.cs.ucla.edu/cs144/projects/javascript/suggest1.html
 *
 */

/*
 * An autosuggest textbox control.
 * @class
 * @scope public
 */
class AutoSuggestControl {
  constructor(id_or_element, provider) {
    this.provider = provider;
    /**
     * The textbox to capture, specified by element_id.
     * @scope private
     */
    this.textbox /*:HTMLInputElement*/ =
      typeof id_or_element == "string"
        ? document.getElementById(id_or_element)
        : id_or_element;

    //initialize the control
    this.init();
  }
}

/**
 * Autosuggests one or more suggestions for what the user has typed.
 * If no suggestions are passed in, then no autosuggest occurs.
 * @scope private
 * @param aSuggestions An array of suggestion strings.
 */
AutoSuggestControl.prototype.autosuggest = function (aSuggestions /*:Array*/) {
  //make sure there's at least one suggestion

  if (aSuggestions.length > 0) {
    this.typeAhead(aSuggestions[0]);
  }
};

/**
 * Handles keyup events.
 * @scope private
 * @param oEvent The event object for the keyup event.
 */
AutoSuggestControl.prototype.handleKeyUp = function (oEvent /*:Event*/) {
  var iKeyCode = oEvent.keyCode;
  var evtobj = oEvent;
  window.eventobj = evtobj;
  if (
    (iKeyCode != 16 && iKeyCode < 32) ||
    (iKeyCode >= 33 && iKeyCode <= 46) ||
    (iKeyCode >= 112 && iKeyCode <= 123) ||
    (iKeyCode == 65 && evtobj.ctrlKey) ||
    (iKeyCode == 90 && evtobj.ctrlKey)
  ) {
    //ignore
    if (iKeyCode == 90 && evtobj.ctrlKey) {
      // window.getSelection().deleteFromDocument();
      // TODO: need to find a way to select the rest of the text and delete.
    }
  } else {
    //request suggestions from the suggestion provider
    this.requestSuggestions(this);
  }
};

/**
 * Initializes the textarea with event handlers for
 * auto suggest functionality.
 * @scope private
 */
AutoSuggestControl.prototype.init = function () {
  //save a reference to this object
  var oThis = this;
  //assign the onkeyup event handler
  var lastDate = new Date();
  oThis.textbox.onkeyup = function (oEvent) {
    //check for the proper location of the event object
    if (!oEvent) {
      oEvent = window.event;
    }
    var newDate = new Date();
    if (newDate.getTime() > lastDate.getTime() + 200) {
      oThis.handleKeyUp(oEvent);
      lastDate = newDate;
    }
  };
};

/**
 * Selects a range of text in the textarea.
 * @scope public
 * @param iStart The start index (base 0) of the selection.
 * @param iLength The number of characters to select.
 */
AutoSuggestControl.prototype.selectRange = function (
  iStart /*:int*/,
  iLength /*:int*/
) {
  //use text ranges for Internet Explorer
  if (this.textbox.createTextRange) {
    var oRange = this.textbox.createTextRange();
    oRange.moveStart("character", iStart);
    oRange.moveEnd("character", iLength);
    oRange.select();

    //use setSelectionRange() for Mozilla
  } else if (this.textbox.setSelectionRange) {
    this.textbox.setSelectionRange(iStart, iLength);
  }

  //set focus back to the textbox
  this.textbox.focus();
};

/**
 * Inserts a suggestion into the textbox, highlighting the
 * suggested part of the text.
 * @scope private
 * @param sSuggestion The suggestion for the textbox.
 */
AutoSuggestControl.prototype.typeAhead = function (sSuggestion /*:String*/) {
  //check for support of typeahead functionality
  if (this.textbox.createTextRange || this.textbox.setSelectionRange) {
    var lastSpace = this.textbox.value.lastIndexOf(" ");
    var lastQuote = this.textbox.value.lastIndexOf("'");
    var lastHypen = this.textbox.value.lastIndexOf("-");
    var lastDoubleQuote = this.textbox.value.lastIndexOf('"');
    var lastEnter = this.textbox.value.lastIndexOf("\n");
    var lastIndex =
      Math.max(lastSpace, lastEnter, lastQuote, lastHypen, lastDoubleQuote) + 1;
    var contentStripped = this.textbox.value.substring(0, lastIndex);
    var lastWord = this.textbox.value.substring(
      lastIndex,
      this.textbox.value.length
    );
    this.textbox.value = contentStripped + sSuggestion; //.replace(lastWord,"");
    var start =
      this.textbox.value.length - sSuggestion.replace(lastWord, "").length;
    var end = this.textbox.value.length;
    this.selectRange(start, end);
  }
};

/**
 * Request suggestions for the given autosuggest control.
 */
AutoSuggestControl.prototype.requestSuggestions = function () {
  this.words = this.provider();
  var aSuggestions = [];
  var sTextbox = this.textbox.value;
  var sTextboxSplit = sTextbox.split(/\s+/);
  var sTextboxLast = sTextboxSplit[sTextboxSplit.length - 1];
  var sTextboxValue = sTextboxLast;
  if (sTextboxValue.length > 0) {
    //search for matching words
    for (var i = 0; i < this.words.length; i++) {
      if (this.words[i].indexOf(sTextboxValue.toLowerCase()) == 0) {
        if (this.words[i].indexOf(sTextboxValue) == 0) {
          aSuggestions.push(this.words[i]);
        } else if (
          this.words[i].indexOf(
            sTextboxValue.charAt(0).toLowerCase() + sTextboxValue.slice(1)
          ) == 0
        ) {
          aSuggestions.push(
            this.words[i].charAt(0).toUpperCase() + this.words[i].slice(1)
          );
        }
      }
    }
  }

  //provide suggestions to the control
  this.autosuggest(aSuggestions);
};

;


// src/view/vm.js
pxer.util.afterLoad(function () {
  const el = document.createElement("div");
  const component = {
    template: pxer.uiTemplate,
    watch: {
      currentUrl() {
        this.state = "standby";
        this.taskInfo = "";
        this.errmsg = "";
        this.pageType = pxer.util.getPageType();
      },
      isRunning(value) {
        if (value && this.runTimeTimer === null) {
          this.runTimeTimer = setInterval(() => this.runTimeTimestamp++, 1000);
        } else {
          clearInterval(this.runTimeTimer);
          this.runTimeTimer = null;
        }
      },
      tagFilterInfo: {
        deep: true,
        handler: "onTagFilterInfoChange",
      },
    },
    data() {
      return {
        pxer: null,
        showAll: false,
        state: "standby", //[standby|init|ready|page|works|finish|re-ready|stop|error]
        stateMap: {
          standby: "待命",
          init: "初始化",
          ready: "就绪",
          page: "抓取页码中",
          works: "抓取作品中",
          finish: "完成",
          "re-ready": "再抓取就绪",
          stop: "用户手动停止",
          error: "出错",
        },
        pxerVersion: pxer.package.version,
        showPxerFailWindow: false,
        runTimeTimestamp: 0,
        runTimeTimer: null,
        checkedFailWorksList: [],
        taskInfo: "",
        tryFailWroksList: [],
        showTaskOption: false,
        taskOption: {
          limit: "",
          stopId: "",
          isQuick: true,
        },
        showLoadBtn: true,
        errmsg: "",

        pageType: pxer.util.getPageType(),
        currentUrl: document.URL,
        showAllTagFilter: false,
        showLoadingButton: false,
        /**
         * @property {'NECESSARY' | 'EXCLUDE' | 'WHATEVER'} [tagName] - default by WHATEVER
         * */
        tagFilterInfo: {},
      };
    },
    computed: {
      isRunning() {
        var runState = ["page", "works"];
        return runState.indexOf(this.state) !== -1;
      },
      worksNum() {
        return this.pxer.taskOption.limit || this.pxer.worksNum;
      },
      taskCount() {
        if (!this.pxer) return null;
        var pageWorkCount = getOnePageWorkCount(this.pxer.pageType);

        // return Math.ceil(this.worksNum / pageWorkCount) + +this.worksNum;
        // 不知道为什么要加上这一段，先注释了吧Math.ceil(this.worksNum / pageWorkCount)
        return +this.worksNum;
      },
      // TODO:这里需要修改
      finishCount() {
        if (this.state === "page") {
          return this.pxer.taskList.filter((pr) => pr.completed).length;
        } else if (this.state === "works") {
          return (
            this.pxer.taskList.filter((pr) => pr.completed).length +
            ~~(this.worksNum / 20) +
            this.pxer.failList.length
          );
        } else {
          return -1;
        }
      },
      forecastTime() {
        if (this.isRunning && this.finishCount) {
          return Math.ceil(
            (this.runTimeTimestamp / this.finishCount) * this.taskCount -
              this.runTimeTimestamp
          );
        } else {
          return -1;
        }
      },
      printConfigUgoira: {
        get() {
          return (
            this.pxer.ppConfig.ugoira_zip +
            "-" +
            this.pxer.ppConfig.ugoira_frames
          );
        },
        set(value) {
          var arr = value.split("-");
          this.pxer.ppConfig.ugoira_zip = arr[0];
          this.pxer.ppConfig.ugoira_frames = arr[1];
        },
      },
      no_tag_any: {
        get() {
          return this.pxer.pfConfig.no_tag_any.join(" ");
        },
        set(value) {
          this.pxer.pfConfig.no_tag_any = value.split(" ");
        },
      },
      no_tag_every: {
        get() {
          return this.pxer.pfConfig.no_tag_every.join(" ");
        },
        set(value) {
          this.pxer.pfConfig.no_tag_every = value.split(" ");
        },
      },
      has_tag_some: {
        get() {
          return this.pxer.pfConfig.has_tag_some.join(" ");
        },
        set(value) {
          this.pxer.pfConfig.has_tag_some = value.split(" ");
        },
      },
      has_tag_every: {
        get() {
          return this.pxer.pfConfig.has_tag_every.join(" ");
        },
        set(value) {
          this.pxer.pfConfig.has_tag_every = value.split(" ");
        },
      },
      showFailTaskList() {
        if (!this.pxer) return [];
        return this.pxer.failList.filter((pfi) => {
          return this.tryFailWroksList.indexOf(pfi) === -1;
        });
      },

      canCrawlDirectly() {
        this.currentUrl;
        return this.pageType === "works_medium";
      },
      canCrawl() {
        this.currentUrl;
        return PxerApp.canCrawl();
      },

      /**
       * @return {TagInfo}
       *
       * @typedef TagInfo
       * @property {Array.<string>} tags - all tags without repeat
       * @property {Object.<string, number>} count - The times of tag included in works
       * */
      tagInfo() {
        const allTags = this.pxer.resultSet.reduce(
          (result, works) => result.concat(works.tagList),
          []
        );
        const countMap = {};
        const noRepeatTags = [];

        allTags.forEach((tag) => {
          if (!noRepeatTags.includes(tag)) {
            noRepeatTags.push(tag);
          }
          countMap[tag] = countMap[tag] || 0;
          countMap[tag]++;
        });

        noRepeatTags.sort((tag1, tag2) => countMap[tag2] - countMap[tag1]);

        return {
          tags: noRepeatTags,
          count: countMap,
        };
      },
      needFoldTagFilter() {
        return this.tagInfo.tags.length > 60;
      },
      tagFilterFolded() {
        return this.needFoldTagFilter && !this.showAllTagFilter;
      },
    },
    methods: {
      createPxerApp() {
        this.pxer = new PxerApp();
        this.pxer.on("error", (error) => {
          this.errmsg = error;
        });
        this.pxer.on("finishWorksTask", (result) => {});
      },
      crawlDirectly() {
        this.createPxerApp();
        this.showLoadingButton = true;
        this.pxer.one("finishWorksTask", () => {
          this.showLoadingButton = false;
          this.state = "standby";
        });
        this.pxer.getThis();
      },

      load() {
        this.createPxerApp();
        this.state = "init";
        this.pxer
          .init({
            isQuick: true,
          })
          .then(() => (this.state = "ready"));
        this.pxer.on("finishWorksTask", () => {
          window.blinkTitle();
        });
      },
      run() {
        if (this.state === "ready") {
          this.state = "page";
          this.pxer.initPageTask();
          this.pxer.one("finishPageTask", () => {
            this.state = "works";
            this.pxer.switchPage2Works();
            this.pxer.executeWroksTask();
          });
          this.pxer.one("finishWorksTask", () => {
            this.state = "finish";
          });
          this.pxer.executePageTask();
        } else if (this.state === "re-ready") {
          this.state = "works";
          this.pxer.one("finishWorksTask", () => {
            this.state = "finish";
          });
          this.pxer.executeFailWroks(this.tryFailWroksList);
          this.tryFailWroksList = [];
        }
      },
      stop() {
        this.state = "stop";
        this.pxer.stop();
      },
      count() {
        this.taskInfo = this.pxer.getWorksInfo();
      },
      printWorks() {
        this.pxer.printWorks();
        var sanitizedpfConfig = {};
        for (let key in this.pxer.pfConfig) {
          sanitizedpfConfig[key] = this.pxer.pfConfig[key].length
            ? this.pxer.pfConfig[key].length
            : this.pxer.pfConfig[key];
        }
      },
      useTaskOption() {
        this.showTaskOption = false;

        Object.assign(this.pxer.taskOption, this.taskOption);
      },
      formatFailType(type) {
        return (
          {
            empty: "获取内容失败",
            timeout: "获取超时",
            "r-18": "限制级作品（R-18）",
            "r-18g": "怪诞作品（R-18G）",
            mypixiv: "仅好P友可见的作品",
            parse: "解析错误",
          }[type] || type
        );
      },
      formatFailSolution(type) {
        return (
          {
            empty: "点击左侧链接确认内容正确，再试一次~",
            timeout: "增加最大等待时间再试一次~",
            "r-18": "开启账号R-18选项",
            "r-18g": "开启账号R-18G选项",
            mypixiv: "添加画师好友再尝试",
            parse:
              '再试一次，若问题依旧，请<a href="https://github.com/pea3nut/Pxer/issues/5" target="_blank">反馈</a>给花生',
          }[type] || "要不。。。再试一次？"
        );
      },
      tryCheckedPfi() {
        this.tryFailWroksList.push(...this.checkedFailWorksList);

        this.checkedFailWorksList = [];
        this.state = "re-ready";
      },
      formatTime(s) {
        return `${~~(s / 60)}:${s % 60 >= 10 ? s % 60 : "0" + (s % 60)}`;
      },

      t: pxer.t,
      listenUrlChange() {
        const vm = this;
        const historyPushState = history.pushState;
        const historyReplaceState = history.replaceState;

        history.pushState = function (...args) {
          historyPushState.apply(history, args);
          setTimeout(() => (vm.currentUrl = document.URL), 0);
        };
        history.replaceState = function (...args) {
          historyReplaceState.apply(history, args);
          setTimeout(() => (vm.currentUrl = document.URL), 0);
        };
      },

      // about filter by tag
      countTagTheme(tagName) {
        switch (this.tagFilterInfo[tagName]) {
          default:
          case "WHATEVER":
            return "btn-secondary";
          case "EXCLUDE":
            return "btn-danger";
          case "NECESSARY":
            return "btn-success";
        }
      },
      onTagFilterInfoChange(value) {
        this.pxer.pfConfig.no_tag_any = [];
        this.pxer.pfConfig.has_tag_some = [];
        for (let [tagName, filterOption] of Object.entries(value)) {
          switch (filterOption) {
            case "EXCLUDE":
              this.pxer.pfConfig.no_tag_any.push(tagName);
              break;
            case "NECESSARY":
              this.pxer.pfConfig.has_tag_some.push(tagName);
              break;
          }
        }
      },
      onTagClick(tagName) {
        switch (this.tagFilterInfo[tagName]) {
          default:
          case "WHATEVER":
            this.$set(this.tagFilterInfo, tagName, "EXCLUDE");
            break;
          case "EXCLUDE":
            this.$set(this.tagFilterInfo, tagName, "NECESSARY");
            break;
          case "NECESSARY":
            this.$set(this.tagFilterInfo, tagName, "WHATEVER");
            break;
        }
      },
    },
    mounted() {
      this.listenUrlChange();
      pxer.loaded = true;
    },
  };

  // find a element as anchor
  [
    (elt) => {
      const target = document.querySelector("#root > header");
      if (!target) return false;

      target.appendChild(elt);
      return true;
    },
    (elt) => {
      const target = document.querySelector("._global-header");
      if (!target) return false;

      target.appendChild(elt);
      return true;
    },
    (elt) => {
      const target = document.getElementById("wrapper");
      if (!target) return false;

      target.insertBefore(elt, target.firstChild);

      return true;
    },
    (elt) => {
      document.body.insertBefore(elt, document.body.firstChild);
      return true;
    },
  ].some((fn) => fn(el));

  // mount UI
  pxer.vm = new Vue(component).$mount(el);
});

;


}());