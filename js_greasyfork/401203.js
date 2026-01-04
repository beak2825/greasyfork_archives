// ==UserScript==
// @name         YouTube Subscription Page Filter
// @namespace    http://xiniha.github.io
// @version      1.0.2
// @description  Applies filter to the subscription page's video list on YouTube.
// @author       XiNiHa
// @match        https://www.youtube.com/feed/subscriptions*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/vue
// @downloadURL https://update.greasyfork.org/scripts/401203/YouTube%20Subscription%20Page%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/401203/YouTube%20Subscription%20Page%20Filter.meta.js
// ==/UserScript==

(function () {
  const listElement = document.querySelector(
    "ytd-section-list-renderer[page-subtype=subscriptions]>#contents"
  );

  let appDiv = document.createElement("div");
  appDiv.id = "app";
  let placeholder = document.createElement("div");
  placeholder.style.height = "50px";
  listElement.parentElement.prepend(placeholder);
  listElement.parentElement.prepend(appDiv);

  window.vapp = new Vue({
    el: "#app",
    template: `
      <div id="app" :style="styles.app">
        <div v-if="filters.length > 0" v-for="(filter, i) in filters" :key="i" :style="styles.filterItem">
          {{filter.display}}
          <button type="button" :style="styles.filterBtn" @click="filters.splice(i, 1)">x</button>
        </div>
        <div v-if="filters.length == 0" :style="styles.filterItem">No Filters Applied!</div>
        <div :style="styles.filterItem">
          <select v-model="type">
            <option value="title">Title</option>
            <option value="channel">Channel</option>
          </select>
          <input v-model="expr" placeholder="Query Text or RegEx">
          <button type="button" :style="styles.filterBtn" @click="addFilter">+</button>
        </div>
      </div>
    `,
    data: {
      filters: [],
      type: "title",
      expr: "",
      styles: {
        app: {
          width: "80%",
          height: "50px",
          display: "flex",
          fontFamily: "sans-serif",
          fontSize: "16px",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          top: "56px",
          zIndex: "10",
          background: "#f9f9f9"
        },
        filterItem: {
          height: "30px",
          margin: "0 4px",
          padding: "4px 8px 4px 8px",
          borderRadius: "30px",
          backgroundColor: "#e0e0e0",
          cursor: "default"
        },
        filterBtn: {
          background: "#aaa",
          border: 0,
          height: "20px",
          width: "20px",
          borderRadius: "50%",
          padding: 0,
          margin: "0 -4px 0 4px",
          cursor: "pointer",
        }
      }
    },
    watch: {
      filters() {
        this.updateFilter()
      }
    },
    methods: {
      addFilter() {
        switch(this.type){
          case "title":
            this.filters.push(this.createTitleFilter(this.expr))
            break;
          case "channel":
            this.filters.push(this.createChannelFilter(this.expr))
            break;
        }
      },
      updateFilter() {
        for (let section of document.querySelectorAll(
          "ytd-section-list-renderer[page-subtype=subscriptions]>#contents>ytd-item-section-renderer"
        )) {
          let targets = Array.prototype.map.call(
            section.querySelectorAll("ytd-grid-video-renderer"),
            (element) => {
              return {
                title: element.querySelector("#video-title").title,
                channel: element.querySelector(
                  "yt-formatted-string.ytd-channel-name>a"
                ).innerText,
                element: element,
              };
            }
          );

          let atLeastOne = false;

          for (let target of targets) {
            if (this.testFilters(target, this.filters)) atLeastOne = true;
          }

          if (this.filters.length === 0) continue;
          section.style.display = atLeastOne ? "block" : "none";
        }
      },
      testFilters(target, filters) {
        for (let filter of filters) {
          if (!filter.test(target)) {
            target.element.style.display = "none";
            return false;
          }
        }
        target.element.style.display = "inline-block";
        return true;
      },
      createORFilter(filter1, filter2) {
        return {
          get display() {
            return this.filter1.display + " OR " + this.filter2.display;
          },
          filter1,
          filter2,
          test: (target) => filter1.test(target) || filter2.test(target),
        };
      },
      createTitleFilter(initialExpr) {
        return {
          get display() {
            return `Title - ${this.expr.toString()}`;
          },
          expr: initialExpr,
          test: function (target) {
            return target.title.match(this.expr);
          },
        };
      },
      createChannelFilter(initialExpr) {
        return {
          get display() {
            return `Channel - ${this.expr.toString()}`;
          },
          expr: initialExpr,
          test: function (target) {
            return target.channel.match(this.expr);
          },
        };
      }
    },
  });

  const observer = new MutationObserver((list, observer) => {
    for (let mutation of list) {
      if (
        mutation.type === "childList" &&
        mutation.addedNodes[0].nodeName == "YTD-ITEM-SECTION-RENDERER"
      ) {
        window.vapp.updateFilter();
      }
    }
  });

  observer.observe(listElement, { childList: true });
})();
