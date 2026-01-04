// ==UserScript==
// @name         bilibili订阅+
// @namespace    https://github.com/YanxinTang/Tampermonkey
// @version      0.7.9
// @description  bilibili导航添加订阅按钮以及订阅列表
// @author       tyx1703
// @license      MIT
// @noframes
// @require     https://cdn.jsdelivr.net/npm/vue@2/dist/vue.min.js
// @match      *.bilibili.com/*
// @exclude     *://live.bilibili.com/*
// @exclude     *://manga.bilibili.com/*
// @exclude     *://bw.bilibili.com/*
// @exclude     *://show.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/30283/bilibili%E8%AE%A2%E9%98%85%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/30283/bilibili%E8%AE%A2%E9%98%85%2B.meta.js
// ==/UserScript==

(async function () {
  const DedeUserID = getCookie("DedeUserID");
  const loginStatus = DedeUserID !== "";
  if (!loginStatus) {
    log("少侠请先登录~  哔哩哔哩 (゜-゜)つロ 干杯~");
    return;
  }

  const PER_PAGE = 15;
  try {
    const lastPopoverButton = await getLastPopoverButton();
    const subscribeMenuEl = document.createElement("li");
    subscribeMenuEl.setAttribute("id", "subscribe");
    lastPopoverButton.after(subscribeMenuEl);

    const getBangumis = (page) => {
      return fetch(
        `//api.bilibili.com/x/space/bangumi/follow/list?type=1&follow_status=0&pn=${page}&ps=${PER_PAGE}&vmid=${DedeUserID}`,
        {
          method: "GET",
          credentials: "include",
        }
      )
        .then((response) => response.json())
        .then((response) => response.data)
        .then(({ list, ...rest }) => {
          return {
            list: list.map((item) => ({ ...item, id: item.media_id })),
            ...rest,
          };
        });
    };

    const getCinemas = (page) => {
      return fetch(
        `//api.bilibili.com/x/space/bangumi/follow/list?type=2&follow_status=0&pn=${page}&ps=${PER_PAGE}&vmid=${DedeUserID}`,
        {
          method: "GET",
          credentials: "include",
        }
      )
        .then((response) => response.json())
        .then((response) => response.data)
        .then(({ list, ...rest }) => {
          return {
            list: list.map((item) => ({ ...item, id: item.media_id })),
            ...rest,
          };
        });
    };

    const getFloowings = (page) => {
      return fetch(
        `//api.bilibili.com/x/relation/followings?&pn=${page}&ps=${PER_PAGE}&vmid=${DedeUserID}&order=desc`,
        {
          method: "GET",
          credentials: "include",
        }
      )
        .then((response) => response.json())
        .then((response) => {
          return {
            list: response.data.list.map((item) => ({
              ...item,
              id: item.mid,
            })),
            total: response.data.total,
            pn: page,
          };
        });
    };

    const VideoItem = {
      props: ["item"],
      computed: {
        coverURL() {
          return this.item.cover.replace("http:", "");
        },
      },
      template: `
          <a
            target="_blank"
            class="header-history-card header-history-video"
            :href="item.url"
          >
            <div class="header-history-video__image">
              <picture class="v-img">
                <source :srcset="coverURL + '@256w_144h_1c.webp'" type="image/webp" />
                <img :src="coverURL + '@256w_144h_1c'" />
              </picture>
              <div
                class="header-history-live__tag header-history-live__tag--red"
                v-if="item?.new_ep?.index_show ?? false"
              >
                <span class="header-history-live__tag--text">
                  {{item.new_ep.index_show}}
                </span>
              </div>
            </div>
            <div class="header-history-card__info">
              <div :title="item.title" class="header-history-card__info--title">
                {{item.title}}
              </div>
              <div class="header-history-card__info--date">
                <span>{{item.time}}</span>
              </div>
              <div class="header-history-card__info--name">
                <span>{{item?.new_ep?.long_title ?? '' }}</span>
              </div>
            </div>
          </a>
        `,
    };

    const UserItem = {
      props: ["item"],
      computed: {
        spaceURL() {
          return `https://space.bilibili.com/${this.item.mid}`;
        },
        avatarURL() {
          return this.item.face.replace("http:", "");
        },
      },
      template: `
          <a
            target="_blank"
            class="header-history-card header-history-video"
            :href="spaceURL"
          >
            <div class="header-history-video__image">
              <picture class="v-img"">
                <source :srcset="avatarURL + '@256w_144h_1c.webp'" type="image/webp" />
                <img :src="avatarURL + '@256w_144h_1c'" />
              </picture>
            </div>
            <div class="header-history-card__info">
              <div :title="item.title" class="header-history-card__info--title">
                {{item.uname}}
              </div>
              <div class="header-history-card__info--name">
                <span>{{item.sign }}</span>
              </div>
            </div>
          </a>
        `,
    };

    new Vue({
      el: subscribeMenuEl,
      components: { VideoItem, UserItem },
      data() {
        return {
          isPanelVisible: false,
          loading: false,
          inLeaveAnimation: false,
          activeTab: "bangumis",
          tabs: [
            { key: "bangumis", name: "追番" },
            { key: "cinemas", name: "追剧" },
            { key: "floowings", name: "关注" },
          ],
          dataset: {
            bangumis: {
              list: [],
              total: 0,
              page: 0,
              component: "VideoItem",
            },
            cinemas: {
              list: [],
              total: 0,
              page: 0,
              component: "VideoItem",
            },
            floowings: {
              list: [],
              total: 0,
              page: 0,
              component: "UserItem",
            },
          },
        };
      },
      created() {
        this.load();
      },
      computed: {
        list() {
          return this.dataset[this.activeTab].list;
        },
        total() {
          return this.dataset[this.activeTab].total;
        },
        page() {
          return this.dataset[this.activeTab].page;
        },
        tabComponent() {
          return this.dataset[this.activeTab].component;
        },
      },
      methods: {
        async load() {
          const tab = this.activeTab;
          let request;
          if (tab === "bangumis") {
            request = getBangumis;
          }
          if (tab === "cinemas") {
            request = getCinemas;
          }
          if (tab === "floowings") {
            request = getFloowings;
          }
          try {
            this.loading = true;
            const { list, total, pn } = await request(this.page + 1);
            this.dataset[tab].list = [...this.dataset[tab].list, ...list];
            this.dataset[tab].total = total;
            this.dataset[tab].page = pn;
          } catch (error) {
            throw error;
          } finally {
            this.loading = false;
          }
        },
        changeTabHandler(tab) {
          this.activeTab = tab.key;
          if (this.list.length <= 0) {
            this.load();
          }
        },
        onMouseoverHandler() {
          if (!this.inLeaveAnimation) {
            this.isPanelVisible = true;
          }
        },
        onMouseleaveHandler() {
          this.isPanelVisible = false;
        },
        onContentBeforeLeaveHandler() {
          this.inLeaveAnimation = true;
        },
        onContentAfterLeaveHandler() {
          this.inLeaveAnimation = false;
        },
        onScrollHandler() {
          const panelContent = this.$refs.panelContent;
          if (
            !this.loading &&
            this.list.length < this.total &&
            panelContent.scrollHeight - panelContent.scrollTop - 50 <=
              panelContent.clientHeight
          ) {
            this.load();
          }
        },
      },
      template: `
        <li
          class="v-popover-wrap"
          @mouseover="onMouseoverHandler"
          @mouseleave="onMouseleaveHandler"
        >
          <a
            href="//www.bilibili.com/account/history"
            target="_blank" class="right-entry__outside"
          >
            <svg class="right-entry-icon" viewBox="0 0 1182 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2974" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="21"><path d="M1088.792893 96.259987A330.610168 330.610168 0 0 0 622.44343 96.259987l-31.600682 31.600683L560.199662 96.259987A330.370769 330.370769 0 0 0 93.132002 96.259987c-128.557321 128.557321-121.854146 345.692312 6.703175 474.249634l23.939911 23.939911 401.472304 402.429901a92.886854 92.886854 0 0 0 131.190712 0L1058.149807 595.167729l23.939911-23.939911c128.317922-128.317922 135.260496-345.452913 6.703175-474.967831z m-23.939911 247.299279a220.486579 220.486579 0 0 1-66.313553 140.527277l-25.136906 26.333902-383.038573 383.038573-383.038573-383.038573-24.41871-25.376306a220.725978 220.725978 0 0 1-66.552952-140.527276A210.671215 210.671215 0 0 1 340.191882 120.199898a219.528982 219.528982 0 0 1 140.527276 67.031751l25.615705 25.376305L550.623698 256.896789l63.201364 63.201365a62.483167 62.483167 0 1 0 88.338271-88.57767l-22.742915-23.939911 26.8127-25.615705a210.671215 210.671215 0 0 1 359.098662 162.551995z" fill="currentColor" p-id="2975"></path><path d="M249.030112 413.615829m42.320183-42.320184l0 0q42.320183-42.320183 84.640366 0l107.323985 107.323985q42.320183 42.320183 0 84.640367l0 0q-42.320183 42.320183-84.640367 0l-107.323984-107.323985q-42.320183-42.320183 0-84.640367Z" fill="currentColor" p-id="2976"></path></svg>
            <span class="right-entry-text">订阅</span>
          </a>
          <transition
            name="v-popover_bottom"
            enter-active-class="v-popover_bottom-enter-from"
            leave-active-class="v-popover_bottom-leave-from"
            @before-leave="onContentBeforeLeaveHandler"
            @after-leave="onContentAfterLeaveHandler"
          >
            <div
              v-show="isPanelVisible"
              class="v-popover is-bottom"
              style="padding-top: 15px; margin-left: -50px;"
            >
              <div class="v-popover-content">
                <div class="history-panel-popover">
                  <div class="header-tabs-panel">
                    <div
                      v-for="tab in tabs"
                      :key="tab.key"
                      class="header-tabs-panel__item"
                      :class="{'header-tabs-panel__item--active': activeTab === tab.key }"
                      @click="changeTabHandler(tab)"
                    >{{tab.name}}</div>
                  </div>
                  <div class="header-tabs-panel__content" ref="panelContent" @scroll="onScrollHandler">
                    <component
                      :is="tabComponent"
                      v-for="item in list"
                      :item="item"
                      :key="item.id"
                    />
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </li>
        `,
    });
  } catch (error) {
    log(error);
  }

  function getLastPopoverButton(count = 1) {
    if (count >= 30) {
      return Promise.reject("获取顶部按列表超时");
    }
    return new Promise((resolve) => {
      const popoverButtons = document.body.querySelectorAll(
        ".bili-header .bili-header__bar .right-entry>.v-popover-wrap"
      );
      if (popoverButtons.length) {
        resolve(popoverButtons[popoverButtons.length - 1]);
        return;
      }
      setTimeout(() => {
        resolve(getLastPopoverButton(count++));
      }, 100);
    });
  }

  /**
   * Get cookie by name
   * @param {string} name
   */
  function getCookie(name) {
    const value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length == 2) {
      return parts.pop().split(";").shift();
    }
    return "";
  }

  /**
   * print something in console with custom style
   * @param {*} stuff
   */
  function log(stuff) {
    console.log(
      "%cbilibili订阅+:",
      "background: #f25d8e; border-radius: 3px; color: #fff; padding: 0 8px",
      stuff
    );
  }
})();
