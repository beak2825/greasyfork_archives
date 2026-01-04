// ==UserScript==
// @name         WaniKani Coming Up
// @namespace    wk_lai
// @version      1.11
// @description  Shows upcoming progression reviews concisely
// @author       lai
// @match        *://www.wanikani.com/*
// @match        *://preview.wanikani.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/394665/WaniKani%20Coming%20Up.user.js
// @updateURL https://update.greasyfork.org/scripts/394665/WaniKani%20Coming%20Up.meta.js
// ==/UserScript==

function RunInPage(func) {
  var s = document.createElement("script");
  s.textContent = "(" + func + ")();";
  document.body.appendChild(s);
  setTimeout(function(){document.body.removeChild(s)}, 0);
}

function bootstrap() {
  const console = /preview\./.test(window.location.href) ? window.console : new Proxy({}, {get: () => () => {}});

// Defined by WaniKani
  const unlockedAtKey = "unlockedAt";
  const availableAtKey = "availableAt";
  const passedAtKey = "passedAt";
  const srsStageKey = "srsStage";

// Defined locally
  const valuesKey = "values";
  const availableAtMsKey = "availableAtMs";
  const amountKey = "amount";
  const srsKey = "srs";
  const tagsKey = "tags";
  const passedKey = "passed";
  const allPassedKey = "allPassed";

  const srsScoresByStage = [0, 14400000, 43200000, 126000000, 295200000, 896400000, 2102400000, 4690800000, 15055200000];
  const timescaleSetHours = [6, 12, 24, 48, 72, 96, 168, 336];

  const groupBy = function (xs, key) {
    const getOrSetEmpty = (map, key) => {
      const result = map.get(key);
      if (result) return result;
      const newValue = [];
      map.set(key, newValue);
      return newValue
    };
    return xs.reduce((map, x) => {
      const group = getOrSetEmpty(map, x[key]);
      group.push(x);
      return map;
    }, new Map());
  };

  const first = (arr) => arr[0];
  const remove = (arr, obj) => {
    for (let i = 0; i < arr; i++) {
      if (arr[i] === obj) {
        arr.splice(i, 1);
        return true;
      }
    }
    return false;
  };
  const orderBy = (arr, predicate) => arr.slice().sort(predicate);

  const Time = {
    getTime: (dateTime) => new Date(dateTime).getTime(),
    hoursToMs: (h) => h * 1000 * 60 * 60,
    getFriendlyTime: (ms) => {
      const minutes = Math.ceil(ms / 1000 / 60);
      if (minutes <= 0) {
        return {value: 'now'};
      }
      if (minutes <= 60) {
        return {unit: 'minutes', value: minutes};
      }
      const hours = Math.ceil(minutes / 60);
      if (hours <= 48) {
        return {unit: 'hours', value: hours};
      }
      const days = Math.ceil(hours / 24);
      return {unit: 'days', value: days};
    },
    getFriendlyTimeLiteral(ms) {
      const time = Time.getFriendlyTime(ms);
      switch (time.unit) {
        case 'minutes':
          const suffix = time.value === 1 ? 'minute' : 'minutes';
          return `${time.value} ${suffix}`;
        case 'hours':
          return `${time.value} hours`;
        case 'days':
          return `${time.value} days`;
        default:
          return time.value;
      }
    }
  };


  class PubSub {
    constructor() {
      this.events = {};
    }

    subscribe(event, callback) {
      const self = this;

      if (!self.events.hasOwnProperty(event)) {
        self.events[event] = [];
      }

      return self.events[event].push(callback);
    }

    unsubscribe(event, callback) {
      const self = this;

      if (!self.events.hasOwnProperty(event)) {
        return false;
      }

      return remove(self.events[event], callback);

    }

    publish(event, data = {}) {
      const self = this;

      if (!self.events.hasOwnProperty(event)) {
        return [];
      }

      return self.events[event].map(callback => callback(data));
    }
  }

  class Store {
    constructor(params) {
      const self = this;
      self.actions = params.actions || {};
      self.mutations = params.mutations || {};
      self.state = {};
      self.status = 'resting';

      self.events = new PubSub();

      const handler = {
        get(target, key) {
          if (typeof target[key] === 'object' && target[key] !== null) {
            return new Proxy(target[key], handler)
          } else {
            return target[key];
          }
        },
        set: function (state, key, value) {
          state[key] = value;

          console.log(`stateChange: ${key}: ${value}`);

          self.events.publish('stateChange', self.state);

          if (self.status !== 'mutation') {
            console.warn(`${key} was not set via mutation.`);
          }

          self.status = 'resting';

          return true;
        }
      };
      self.state = new Proxy((params.state || {}), handler);
    }

    dispatch(actionKey, payload) {

      const self = this;

      if (typeof self.actions[actionKey] !== 'function') {
        console.warn(`Action "${actionKey}" doesn't exist.`);
        return false;
      }

      console.groupCollapsed(`ACTION: ${actionKey}`);

      self.status = 'action';

      self.actions[actionKey](self, payload);

      console.groupEnd();

      return true;
    }

    commit(mutationKey, payload) {
      const self = this;

      if (typeof self.mutations[mutationKey] !== 'function') {
        console.warn(`Mutation "${mutationKey}" doesn't exist`);
        return false;
      }

      self.status = 'mutation';

      const newState = self.mutations[mutationKey](self.state, payload);

      self.state = Object.assign(self.state, newState);

      return true;
    }
  }

  class Component extends HTMLElement {
    constructor(props = {}) {
      super();
      const self = this;

      self.$element = $(self);

      if (props.store instanceof Store) {
        props.store.events.subscribe('stateChange', () => self._render());
      }
    }

    connectedCallback() {
      this._render();
      this.componentDidMount();
    }

    disconnectedCallback() {
      this.componentDidDismount();
    }

    render() {
    };

    componentDidMount() {
    };

    componentDidDismount() {
    };

    _render() {
      $(this).html(this.render());
    }
  }

  const cuSettings = {
    load() {
      const storedSettings = JSON.parse(localStorage.getItem("cu-settings"));
      const defaultSettings = {maxGroups: 4, showTimeline: true, showPassedItems: false, indicatorStyle: "cone", staticTimescaleMs: Time.hoursToMs(48)};
      return Object.assign(defaultSettings, storedSettings);
    },
    save(settings) {
      const settingsJson = JSON.stringify(settings);
      localStorage.setItem("cu-settings", settingsJson);
    }
  };

  const actions = {
    setMaxGroups(context, payload) {
      context.commit("setMaxGroups", payload);
      context.dispatch("storeSettings");
      context.dispatch("refreshDomainModel");
      context.dispatch("updateUi");
    },
    setStaticTimescale(context, payload) {
      context.commit("setStaticTimescale", payload);
      context.dispatch("storeSettings");
      context.dispatch("updateUi");
    },
    setShowTimeline(context, payload) {
      context.commit("setShowTimeline", payload);
      context.dispatch("storeSettings");
      context.dispatch("updateUi");
    },
    setShowPassedItems(context, payload) {
      context.commit("setShowPassedItems", payload);
      context.dispatch("storeSettings");
      context.dispatch("refreshDomainModel");
      context.dispatch("updateUi");
    },
    setIndicatorStyle(context, payload) {
      context.commit("setIndicatorStyle", payload);
      context.dispatch("storeSettings");
      context.dispatch("refreshDomainModel");
      context.dispatch("updateUi");
    },
    showOverflow(context, payload) {
      context.commit("setShowOverflow", payload);
      context.dispatch("updateUi");
    },
    storeSettings(context) {
      cuSettings.save(context.state.settings);
    },
    refreshTimestamp(context) {
      const now = new Date().getTime();
      context.commit("setTimestamp", now);
    },
    updateUi(context) {
      context.dispatch("refreshTimestamp");
      context.dispatch("refreshTimescale");
      context.events.publish("refresh-ui");
    },
    refreshTimescale(context) {
      function fitToGroups(groups) {
        const availableIn = groups.map(v => v[availableAtMsKey] - context.state.timestamp);
        return availableIn.reduce((prev, cur) => context.state.timescaleSet.find(x => x > cur) || prev, 0);
      }
      function calculateTimescale() {
        switch (context.state.settings.showTimeline) {
          case "hidden":
            return null;
          case "fitGroups":
            const relevantGroups = context.state.domainModel.slice(0, context.state.settings.maxGroups);
            return fitToGroups(relevantGroups);
          case "fitAll":
            return fitToGroups(context.state.domainModel);
          case "static":
            return context.state.settings.staticTimescaleMs;
        }
      }
      const timescale = calculateTimescale();
      context.commit("setTimescale", timescale);
    },
    refreshDomainModel(context) {
      const unlockedItems = context.state.levelData.filter(v => v[unlockedAtKey]);
      const notYetPassedItems = filterPassedItems(unlockedItems);
      const groupedData = Array.from(groupBy(notYetPassedItems, availableAtKey));
      const filteredData = groupedData.filter(x => x[0] != null).filter(x => x[1].length);
      if (!filteredData.length){
        return context.commit("setDomainModel", []);
      }
      const domainModel = filteredData.map(d => createDomainModel(d));
      const sorted = tagGroupsAndSort(domainModel);
      context.commit("setDomainModel", sorted);

      function filterPassedItems(items) {
        if (context.state.settings.showPassedItems) {
          return items;
        }
        return items.filter(i => !i[passedAtKey]);
      }

      function calculateSrsData(availableAt, values) {
        const srs = values.map(v => {
          const stage = v[srsStageKey];
          const score = srsScoresByStage[stage] - availableAt;
          return { stage, score };
        });
        const lowOrdered = orderBy(srs, (a, b) => a.score - b.score);
        const lowestSrs = first(lowOrdered);
        const isStageHomogeneous = srs.every(s => s.stage === lowestSrs.stage);
        return { ...lowestSrs, isStageHomogeneous };
      }

      function sortByLowestLevel(groups) {
        return orderBy(groups, (a, b) => a[srsKey].score - b[srsKey].score);
      }

      function sortByLargestAmount(groups) {
        return orderBy(groups, (a, b) => b[amountKey] - a[amountKey]);
      }

      function sortByFirstAvailable(groups) {
        return orderBy(groups, (a, b) => a[availableAtMsKey] - b[availableAtMsKey]);
      }

      function createDomainModel(x) {
        const values = x[1];
        const allPassed = values.every(x => x[passedKey]);
        const availableAt = Time.getTime(x[0]);
        const srsData = calculateSrsData(availableAt, values);

        return {
          [valuesKey]: values,
          [availableAtMsKey]: availableAt,
          [amountKey]: values.length,
          [srsKey]: srsData,
          [allPassedKey]: allPassed,
          [tagsKey]: []
        };
      }

      function tagGroupsAndSort(groups) {
        const lowestGroup = first(sortByLowestLevel(groups));
        const largestGroup = first(sortByLargestAmount(groups));
        const groupsSortedByEarliest = sortByFirstAvailable(groups);
        const earliestGroup = first(groupsSortedByEarliest);

        earliestGroup.isEarliest = true;
        largestGroup.isLargest = true;
        lowestGroup.isLowest = true;

        return groupsSortedByEarliest;
      }
    }
  };

  const mutations = {
    setMaxGroups(state, payload) {
      state.settings.maxGroups = payload;
    },
    setShowTimeline(state, payload) {
      state.settings.showTimeline = payload;
    },
    setStaticTimescale(state, payload) {
      state.settings.staticTimescaleMs = payload;
    },
    setShowPassedItems(state, payload) {
      state.settings.showPassedItems = payload;
    },
    setIndicatorStyle(state, payload) {
      state.settings.indicatorStyle = payload;
    },
    setDomainModel(state, payload) {
      state.domainModel = payload;
    },
    setTimestamp(state, payload) {
      state.timestamp = payload;
    },
    setTimescale(state, payload) {
      state.timescale = payload;
    },
    setShowOverflow(state, {index, flag}) {
      state.showOverflow[index] = flag;
    },
  };

  const levelData = $("[data-react-class='Progress/Progress']").data("react-props").data;
  const store = new Store({
    actions,
    mutations,
    state: {
      levelData,
      settings: cuSettings.load(),
      timescaleSet: timescaleSetHours.map(Time.hoursToMs),
      showOverflow: {}
    }
  });
  store.dispatch("refreshDomainModel");


  class GroupGridComponent extends Component {
    constructor() {
      super({
        store
      });

      this.refresh = this.refresh.bind(this);
      this.resizeUpdate = this.resizeUpdate.bind(this);
    }

    componentDidMount() {
      store.events.subscribe("refresh-ui", this.refresh);
      store.events.subscribe("resizeUpdate", this.resizeUpdate);
      this.refresh();
    }

    componentDidDismount() {
      store.events.unsubscribe("refresh-ui", this.refresh);
      store.events.unsubscribe("resizeUpdate", this.resizeUpdate);
    }

    refresh() {
      this.updateGroupTimes();
      this.resizeUpdate(); // updating group times might have resized the grid ...
    }

    render() {
      return store.state.domainModel
        .slice(0, store.state.settings.maxGroups)
        .map((g, i) => this.renderGroup(g, i));
    }

    renderGroup(group, index) {
      const $head = this.renderGroupHead(group, index);
      const $body = this.renderBody(group, index);

      return $("<div class='group' />")
        .append($head)
        .append($body);
    };

    getShowOverflowData(index){
      if (store.state.showOverflow[index]) {
        const $collapseButton = $("<div class='value btn icon overflow-icon icon-close' />");
        $collapseButton.on('click', () => store.dispatch("showOverflow", {index, flag: false}));
        return {
          className: "show-overflow",
          $element: $collapseButton
        };
      }
      return { className: null, $element: null };
    }

    renderBody(group, index) {
      const gridValues = group[valuesKey].map(v => this.renderGridValue(v));
      const { className, $element } = this.getShowOverflowData(index);
console.log(className, $element);
      return $("<div class='grid' />")
        .addClass(className)
        .append(gridValues)
        .append($element);
    };

    renderTag(tagContent, title) {
      return $("<div class='tag' />")
        .append(tagContent)
        .attr("title", title);
    }

    renderSrsStageTag(group) {
      const text = ["Stage"];
      const title = ["The SRS stage of this group."];
      const srsData = group[srsKey];
      text.push(srsData.stage);
      if (!srsData.isStageHomogeneous) {
        text.push("+");
        title.push("A '+' indicates at least one item of a higher stage.")
      }
      if (group[allPassedKey]) {
        title.push("You have passed all items in this group.");
      } else {
        title.push("Upon reaching stage 5 items are guru'ed and therefore passed.");
      }
      return this.renderTag(document.createTextNode(text.join(' ')), title.join(' '));
    }
    renderCriticalTag(group) {
      if (!group.isLowest) {
        return;
      }
      const content = $("<i class='icon icon-bolt' />");
      return this.renderTag(content, "This group contains items with the lowest SRS Score. The SRS Score is calculated by SRS Stage and time until the review is available.");
    }
    renderTags(group) {
      const srsStageTag = this.renderSrsStageTag(group);
      const criticalTag = this.renderCriticalTag(group);
      return [srsStageTag, criticalTag];
    };

    renderTimeToGo(group) {
      return $("<div class='group-time' />")
        .data(availableAtMsKey, group[availableAtMsKey])
    };

    renderGridItemContent(value) {
      if (value.characterImage) {
        return $("<img src='' class='character-image'/>")
          .attr("src", value.characterImage);
      } else {
        return $(document.createTextNode(value.characters));
      }
    }

    renderGridValue(value) {
      const className = this.getClassName(value.type);
      const $itemContent = this.renderGridItemContent(value);

      return $("<div class='value' />")
        .addClass(className)
        .append($itemContent);
    };

    renderGroupNumber(group, index) {
      return $("<div class='group-number' />")
        .attr("all-passed", group[allPassedKey])
        .text(index + 1);
    }

    renderGroupHead(group, index) {
      const tags = this.renderTags(group);
      const $number = this.renderGroupNumber(group, index);
      const $spacer = $("<div class='spacer' />");
      const $timeToGo = this.renderTimeToGo(group);

      return $("<div class='group-head' />")
        .append($number)
        .append(tags)
        .append($spacer)
        .append($timeToGo);
    }

    getClassName(type) {
      switch (type) {
        case "Kanji":
          return "kanji-icon";
        case "Radical":
          return "radical-icon";
      }
    };

    updateGroupTimes() {
      this.$element.find(".group-time").each((i, e) => {
        const $groupTime = $(e);
        const availableAt = $groupTime.data(availableAtMsKey);
        const availableIn = (availableAt - store.state.timestamp);
        const text = this.getGroupTimeText(availableIn);
        $groupTime.text(text);
      });
    }

    resizeUpdate() {
      this.$element.find(".group").each((i, e) => {
        if (store.state.showOverflow[i]) return;

        const $group = $(e);
        $group.find(".overflow-icon").remove();
        const $grid = $group.find(".grid");
        const $values = $group.find(".value");
        const bounds = {x: $grid.width(), y: $grid.height()};

        const $visibles = $values.filter((i, v) => {
          return v.offsetLeft < bounds.x && v.offsetTop < bounds.y;
        });
        if ($visibles.length === $values.length) return;

        const lastVisible = $visibles.last();
        const numInvisible = $values.length - $visibles.length + 1; // +1 because the last visible element now gets obscured.

        const $overflowIndicator = this.renderOverflowIndicator(i, numInvisible);

        $(lastVisible).append($overflowIndicator);
      });
    };
    renderOverflowIndicator(index, numInvisible){
      return $("<div class='btn overflow-icon' />")
        .text(`+${numInvisible}`)
        .on("click", () => store.dispatch("showOverflow", {index, flag: true}))
    }

    getGroupTimeText(availableIn) {
      if (availableIn <= 0) {
        return "available now";
      } else {
        const text = Time.getFriendlyTimeLiteral(availableIn);
        return `in ${text}`;
      }
    }
  }

  class TimelineComponent extends Component {
    constructor() {
      super({
        store
      });
      this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
      store.events.subscribe("refresh-ui", this.refresh);
      this.refresh();
    }

    componentDidDismount() {
      store.events.unsubscribe("refresh-ui", this.refresh);
    }

    refresh() {
      this.updateTimelineIndicator();
    }

    render() {
      if (!store.state.settings.showTimeline) return null;
      if (!store.state.timescale) return null;

      const time = Time.getFriendlyTime(store.state.timescale);
      const $timeAxis = $("<div class='time-axis' />");
      const $scaleEnd = $("<div class='scale-end' />");
      const $head = $("<div class='scale-head' />")
        .text(`${time.value} ${time.unit}`);

      const indicators = store.state.domainModel.map((g, i) => this.renderIndicator(g, i));
      const scales = Array(time.value).fill().map((_, i) => this.renderScale(i, time.value));

      return $("<div class='timeline' />")
        .append($head)
        .append($timeAxis)
        .append(scales)
        .append($scaleEnd)
        .append(indicators)
        .attr("cu-style", store.state.settings.indicatorStyle);
    };

    renderIndicator(group, index) {
      const isInactive = index >= store.state.settings.maxGroups;
      return $("<div class='indicator' />")
        .attr("all-passed", group[allPassedKey])
        .attr("inactive", isInactive)
        .text(index + 1)
        .data(availableAtMsKey, group[availableAtMsKey]);
    };

    renderScale(index, total) {
      const left = index / total * 100;
      return $("<div class='scale' />").css({'left': `calc(${left}% - 1px)`}); // -1 to center
    }

    getIndicatorCss(relative, halfIndicatorWidth) {
      if (relative < 0) {
        return {
          'left': `-${halfIndicatorWidth}px`
        };
      }
      if (relative > 100) {
        return {
          'visibility': 'hidden'
        }
      }
      return {
        'left': `calc(${relative}% - ${halfIndicatorWidth}px)`
      }
    };

    updateTimelineIndicator() {
      const timescale = store.state.timescale;
      this.$element.find(".indicator").each((i, e) => {
        const $indicator = $(e);
        const availableAt = $indicator.data(availableAtMsKey);
        const relative = (availableAt - store.state.timestamp) / timescale * 100;
        const halfIndicatorWidth = $indicator.outerWidth() / 2;
        $indicator.css(this.getIndicatorCss(relative, halfIndicatorWidth));
      });
    }
  }

  class MainComponent extends Component {
    constructor() {
      super()
    }
    intervalUpdate() {
      store.dispatch("updateUi");
    };

    resizeUpdate() {
      store.events.publish("refresh-ui");
    };

    getShadowRoot() {
      return this.shadowRoot || this.attachShadow({mode: 'open'});
    }

    componentDidMount() {
      window.addEventListener("resize", this.resizeUpdate);
      this.intervalId = setInterval(this.intervalUpdate, 1000 * 60); // 60s
      store.dispatch("updateUi");
    }

    componentDidDismount() {
      window.removeEventListener("resize", this.resizeUpdate);
      clearInterval(this.intervalId);
    }

    _render() {
      $(this.getShadowRoot())
        .html(this.render());
    }

    render() {
      const $head = this.createHeading();
      const $styles = this.renderStyles();

      if (!store.state.domainModel.length){
        return null;
      }

      return $("<div class='root' />")
        .append($styles)
        .append($head)
        .append("<cu-settings class='hidden' />")
        .append("<cu-timeline />")
        .append("<cu-group-grid />");
    }

    createHeading() {
      const $settingsBtn = $("<span class='btn btn-settings'><i class='icon icon-cog' /></span>")
        .on("click", (e) => store.events.publish("settings-btn-clicked", e));
      return $("<h2 />")
        .append("<span>Upcoming</span>")
        .append($settingsBtn)
    }

    renderStyles() {
      return $("<style/>").text(
        '.value { position: relative; font-size: 20px; height: 30px; line-height: 30px; text-align: center; box-shadow: inset 0 -2px 0 rgba(0,0,0,0.2); color: #fff; text-shadow: 0 2px 0 rgba(0,0,0,0.3); font-family: "Hiragino Kaku Gothic Pro", "Meiryo", "Source Han Sans Japanese", "NotoSansCJK", "TakaoPGothic", "Yu Gothic", "ヒラギノ角ゴ Pro W3", "メイリオ", "Osaka", "MS PGothic", "ＭＳ Ｐゴシック", "Noto Sans JP", sans-serif;}' +
        '.radical-icon { background-color: #00a1f1; background-image: linear-gradient(to bottom, #0af, #0093dd); background-repeat: repeat-x; }' +
        '.kanji-icon { background-color: #f100a1; background-image: linear-gradient(to bottom, #f0a, #dd0093); background-repeat: repeat-x; }' +
        'cu-group-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, auto)); grid-gap: 15px 20px; }' +
        '.grid { position: relative; display: grid; grid-gap: 4px 4px; grid-template-columns: repeat(auto-fill, 30px); height: 30px; justify-content: space-between; overflow: hidden; }' +
        '.root { font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif; }' +
        'h2 { color: #555; font-weight: 400; font-size: 20.25px; margin-bottom: 5px; }' +
        '.root:hover .btn-settings { opacity: 1; }' +
        '.btn { user-select: none; cursor: pointer; }' +
        '.btn-settings { opacity:0; transition: opacity .3s ease-out; padding: 4px 12px; font-size: 16px; line-height: 20px; color: #888; }' +
        '.icon { font-family: FontAwesome; font-style: normal; }' +
        '.icon-bolt::before { content: "\\f0e7" }' +
        '.icon-cog::before { content: "\\f013"; }' +
        '.icon-close::before { content: "\\f00d"; }' +
        '.btn-settings:hover { color: #333; }' +
        '.settings { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, auto)); grid-gap: 15px 20px; align-items: center; margin-bottom: 10px; }' +
        '.setting {  display: grid; grid-template-columns: 120px auto; column-gap: 10px; align-items: center; }' +
        '.select { width: 120px; border: 2px solid; padding: 4px 6px; border-radius: 4px; }' +
        '.aside { font-family: "Ubuntu", Helvetica, Arial, sans-serif; }' +
        '.group-head { position: relative; display: flex; padding-top: 2px; background: linear-gradient(180deg, #fff 0%, transparent calc(100%)); margin-bottom: 5px; box-shadow: 0px 1px 0 0 rgba(0,0,0,0.2); }' +
        '.group-number { width: 18px; text-align: center; color: #fff; font-size: 11.844px; font-weight: bold; line-height: 18px; vertical-align: baseline; text-shadow: 0 -1px 0 rgba(0,0,0,0.25); }' +
        '.group-number[all-passed="true"] { background-color: #08C66C; }' +
        '.group-number[all-passed="false"] { background-color: #7000a9; }' +
        '.group-head .group-number { border-radius: 0; }' +
        '.group-time { font-size: 11.844px; color: rgba(0,0,0,0.6); padding: 2px 3px 0; line-height: 14px; }' +
        '.character-image { height: 1em; vertical-align: middle; }' +
        '.timeline { height: 16px; margin-bottom: 13px; position: relative; }' +
        '.timeline:empty { display: none; }' +
        '.time-axis { position: absolute; left: 0; right: 0; top: 0; height: 1px; border-top: 1px solid white; border-bottom: 1px solid white; box-shadow: inset 0px 2px 0 0 rgba(0,0,0,0.1); background-color: #d8d8d8; }' +
        '.indicator { position: absolute; transition: left .5s ease-out; }' +
        '[inactive="true"] { opacity: .3; }' +
        '[cu-style="circle"] { margin-left: 8px; margin-right: 8px; }' +
        '[cu-style="circle"] .time-axis { margin-left: -8px; margin-right: -8px; }' +
        '[cu-style="circle"] .indicator { top: 2px; width: 16px; padding: 1px 0; font-size: 11.844px; line-height: 14px; border-radius: 8px; color: #fff; text-align: center; }' +
        '[cu-style="circle"] .indicator[all-passed="true"] { background-color: #08C66C; }' +
        '[cu-style="circle"] .indicator[all-passed="false"] { background-color: #7000a9; }' +
        '[cu-style="circle"] .scale-end { width: 8px; }' +
        '[cu-style="cone"] { margin-left: 5px; margin-right: 5px; }' +
        '[cu-style="cone"] .time-axis { margin-left: -5px; margin-right: -5px; }' +
        '[cu-style="cone"] .indicator { top: 3px; padding: 0; width: 0px;  height: 0px; color: transparent; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: 10px solid; }' +
        '[cu-style="cone"] .indicator[all-passed="true"] { border-bottom-color: #08C66C; }' +
        '[cu-style="cone"] .indicator[all-passed="false"] { border-bottom-color: #7000a9; }' +
        '[cu-style="cone"] .scale-end { width: 5px; }' +
        '.tag { background-color: #fff; color: rgba(0,0,0,0.6); line-height: 14px; padding: 2px 4px; font-size: 11.844px; }' +
        '.spacer { flex-grow: 1; }' +
        '.scale { position: absolute; top: 2px; height: 6px; border-left: 1px solid #c8c8c8; border-right: 1px solid white; }' +
        '.scale-end { position: absolute; left: 100%; top: 2px; height: 6px; width: 8px; background: linear-gradient(135deg, #d8d8d8 50%, transparent calc(50% + 1px)); }' +
        '.scale-head { position: absolute; right: 0; bottom: 100%; font-size: 11.844px; line-height: 1em; color: #777; font-weight: 300; text-shadow: 0 1px 0 #fff;}' +
        '.overflow-icon { font-size: 12px; width: 100%; background: linear-gradient(to bottom, #5571e2, #294ddb); }' +
        '.value .overflow-icon { position: absolute; top:0; left: 0; }' +
        '.show-overflow { height: auto; }'+
        '.hidden { display: none; }'
      );
    }
  }

  class SettingsComponent extends Component {
    constructor() {
      super({
        store
      });
      this.toggleSettings = this.toggleSettings.bind(this);
    }

    componentDidMount() {
      store.events.subscribe("settings-btn-clicked", this.toggleSettings)
    }

    componentDidDismount() {
      store.events.unsubscribe("settings-btn-clicked", this.toggleSettings)
    }

    render() {
      const $maxGroups = this.renderDropdown({
        options: [
          {text: "2", value: 2},
          {text: "4", value: 4},
          {text: "6", value: 6},
          {text: "8", value: 8},
          {text: "10", value: 10},
          {text: "99", value: 99}],
        id: "max-groups",
        label: "Max No. of groups displayed",
        selected: store.state.settings.maxGroups,
        action: "setMaxGroups"
      });
      const $showTimeline = this.renderDropdown({
        options: [
          {text: "Hidden", value: "hidden"},
          {text: "Fit Groups", value: "fitGroups"},
          {text: "Fit All", value: "fitAll"},
          {text: "Static", value: "static"}],
        id: "show-timeline",
        label: "Timeline Style",
        selected: store.state.settings.showTimeline,
        action: "setShowTimeline"
      });
      const $staticTimescale = this.renderStaticTimescaleDropdown();
      const $showPassedItems = this.renderDropdown({
        options: [
          {text: "Yes", value: true},
          {text: "No", value: false}],
        id: "show-passed-items",
        label: "Show Passed Items",
        description: "Include items of this level that you already guru'ed.",
        selected: store.state.settings.showPassedItems,
        action: "setShowPassedItems"
      });
      const $indicatorStyle = this.renderDropdown({
        options: [
          {text: "Circle", value: "circle"},
          {text: "Cone", value: "cone"}],
        id: "select-indicator-style",
        label: "Timeline Indicator Style",
        selected: store.state.settings.indicatorStyle,
        action: "setIndicatorStyle"
      });

      return $("<div class='settings' />")
        .append($showTimeline)
        .append($staticTimescale)
        .append($showPassedItems)
        .append($indicatorStyle)
        .append($maxGroups)
    }
    renderStaticTimescaleDropdown() {
      return this.renderDropdown({
        options: timescaleSetHours.map(this.createTimescaleOption),
        id: "static-timescale",
        label: "Static Timescale",
        selected: store.state.settings.staticTimescaleMs,
        action: "setStaticTimescale",
        disabled: (store.state.settings.showTimeline !== "static")
      });
    }
    createTimescaleOption(h) {
      const ms = Time.hoursToMs(h);
      return {
        text: Time.getFriendlyTimeLiteral(ms),
        value: ms
      };
    }
    renderDropdown(opt) {
      const options$ = opt.options.map(o => this.createOption(opt, o));
      const $label = $("<label class='label' />")
        .text(opt.label)
        .attr("for", opt.id);
      const $aside = $("<aside class='aside' />")
        .text(opt.description);
      const $description = $("<div />")
        .append($label)
        .append($aside);
      const $select = $("<select class='select' />")
        .attr("id", opt.id)
        .prop("disabled", opt.disabled)
        .addClass(opt.className)
        .append(options$)
        .on("change", (e) => store.dispatch(opt.action, JSON.parse(e.target.value)));
      return $("<div class='setting' />")
        .append($select)
        .append($description);
    }

    createOption(options, option) {
      return $("<option />")
        .attr("value", JSON.stringify(option.value))
        .text(option.text)
        .prop("selected", options.selected === option.value);
    }

    toggleSettings(e) {
      this.$element.toggleClass("hidden");
    }
  }

// set up
  customElements.define('cu-main', MainComponent);
  customElements.define('cu-group-grid', GroupGridComponent);
  customElements.define('cu-settings', SettingsComponent);
  customElements.define('cu-timeline', TimelineComponent);

  $("[data-react-class='Progress/Progress'] > div > div")
    .first()
    .after("<cu-main />");

}

if (window.chrome && window.chrome.runtime && window.chrome.runtime.id) {
  // Sandbox
  RunInPage(bootstrap);
} else {
  bootstrap();
}