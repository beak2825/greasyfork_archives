// ==UserScript==
// @name         知乎首页信息流过滤
// @namespace    https://zhaoji.wang/
// @version      0.2.2
// @description  可以按照标签过滤知乎首页信息流，隐藏含不喜欢标签的回答、文章及视频。并且可以在信息流标题下显示发布时间与编辑时间。
// @author       Zhaoji Wang
// @license      Apache-2.0
// @match        https://www.zhihu.com/
// @match        https://www.zhihu.com/follow
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/vue/2.6.14/vue.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/localforage/1.9.0/localforage.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/dayjs/1.10.6/dayjs.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/dayjs/1.10.6/locale/zh-cn.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/dayjs/1.10.6/plugin/duration.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/dayjs/1.10.6/plugin/relativeTime.min.js
// @grant        GM_xmlhttpRequest
// @connect      www.zhihu.com
// @connect      zhuanlan.zhihu.com
// @downloadURL https://update.greasyfork.org/scripts/430427/%E7%9F%A5%E4%B9%8E%E9%A6%96%E9%A1%B5%E4%BF%A1%E6%81%AF%E6%B5%81%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/430427/%E7%9F%A5%E4%B9%8E%E9%A6%96%E9%A1%B5%E4%BF%A1%E6%81%AF%E6%B5%81%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==
"use strict";

$(() => {
  // 加载 Day.js
  dayjs.locale("zh-cn");
  dayjs.extend(dayjs_plugin_duration);
  dayjs.extend(dayjs_plugin_relativeTime); // 将 GM_xmlhttpRequest 函数 Promise 化

  const get = (url) =>
    new Promise((resolve, reject) =>
      GM_xmlhttpRequest({
        method: "GET",
        url,

        onload(response) {
          resolve(response.responseText);
        },

        onerror(error) {
          reject(error);
        }
      })
    );

  $(".Topstory-mainColumn").prepend('<div id="filter-rules"></div>');
  const app = new Vue({
    el: "#filter-rules",
    template: `
        <div
            id="filter-rules"
            style="background: #fff; box-shadow: 0 1px 3px rgb(18 18 18 / 10%); padding: 20px; border-bottom: 1px solid #f0f2f7; margin-bottom: 10px; border-radius: 2px;"
            v-if="isLoadConfigDone"
        >
            <div class="header" style="position: relative;">
                <div style="font-size: 18px; font-weight: 600; line-height: 1.6;">
                    过滤规则
                </div>
                <div
                    class="action-bar"
                    style="position: absolute; right: 0; top: 2px;"
                >
                    <button
                        @click="addRule()"
                        style="line-height: 2; padding: 0 12px; color: #06f; text-align: center; border: 1px solid; border-radius: 3px; cursor: pointer; font-size: 12px;"
                    >
                        添加标签
                    </button>
                    <button
                        @click="toggleBarDisplayStatus()"
                        style="line-height: 2; padding: 0 12px; color: #06f; text-align: center; border: 1px solid; border-radius: 3px; cursor: pointer; font-size: 12px;"
                    >
                        {{ barIsShown ? '折叠' : '展开' }}
                    </button>
                </div>
            </div>
            <div
                v-show="barIsShown"
                style="line-height: 1.67; margin-top: 9px;"
            >
                <div
                    class="rule-tag"
                    title="点击可删除该标签"
                    style="position: relative; display: inline-block; height: 30px; padding: 0 12px; font-size: 14px; line-height: 30px; color: #06f; border-radius: 100px; background: rgba(0,102,255,.1); margin: 3px 5px 3px 0; vertical-align: middle; cursor: pointer;"
                    v-if="rules.length"
                    v-for="(v, i) in rules"
                    :key="v"
                    @click="removeRule(i)"
                >
                    {{ v }}
                </div>
                <p v-if="!rules.length">
                    当前尚未设置规则
                </p>
            </div>
        </div>
        `,

    data() {
      return {
        isLoadConfigDone: false,
        rules: [],
        titles: [],
        tags: {},
        times: {},
        barIsShown: true
      };
    },

    methods: {
      async loadConfig() {
        let config = await localforage.getItem("zhihu-filter-config");

        if (!config) {
          config = await localforage.setItem("zhihu-filter-config", {
            barIsShown: true,
            rules: []
          });
        }

        this.barIsShown = config.barIsShown;
        this.rules = config.rules;
        this.isLoadConfigDone = true;
      },

      async saveConfig() {
        await localforage.setItem("zhihu-filter-config", {
          barIsShown: this.barIsShown,
          rules: this.rules
        });
      },

      async toggleBarDisplayStatus() {
        this.barIsShown = !this.barIsShown;
        await this.saveConfig();
      },

      async addRule() {
        const newTag = prompt("请输入需要被过滤的标签");

        if (newTag) {
          this.rules = Array.from(new Set([...this.rules, newTag]));
          await this.saveConfig();
        }
      },

      async removeRule(index) {
        this.rules.splice(index, 1);
        await this.saveConfig();
      },

      updateTitles() {
        this.titles = Array.from($(".ContentItem-title a")).map((v) => ({
          title: $(v).text(),
          href: $(v).attr("href")
        }));
        setTimeout(this.updateTitles, 100);
      },

      updateTagsAndTimes() {
        this.titles.forEach(async (v) => {
          if (!this.tags[v.title]) {
            if (v.href.includes("question") && !v.href.includes("answer")) {
              // 知乎问题
              const html = await get(v.href);
              const tags = Array.from($(".QuestionTopic", html)).map((e) =>
                $(e).text()
              );
              const { created: createdTime, updatedTime } = Object.values(
                JSON.parse(
                  Array.from($(html)).filter(
                    (v) => v.id === "js-initialData"
                  )[0].innerHTML
                ).initialState.entities.questions
              )[0];
              this.tags[v.title] = tags;
              this.times[v.title] = {
                createdTime,
                updatedTime
              };
            } else if (v.href.includes("question") && v.href.includes("answer")) {
              // 知乎问题的回答
              const html = await get(v.href);
              const tags = Array.from($(".QuestionTopic", html)).map((e) =>
                $(e).text()
              );
              const { createdTime, updatedTime } = Object.values(
                JSON.parse(
                  Array.from($(html)).filter(
                    (v) => v.id === "js-initialData"
                  )[0].innerHTML
                ).initialState.entities.answers
              )[0];
              this.tags[v.title] = tags;
              this.times[v.title] = {
                createdTime,
                updatedTime
              };
            } else if (v.href.includes("zhuanlan")) {
              // 知乎专栏的文章
              const html = await get(v.href);
              const tags = Array.from($(".Tag.Topic", html)).map((e) =>
                $(e).text()
              );
              const { created: createdTime, updated: updatedTime } =
                Object.values(
                  JSON.parse(
                    Array.from($(html)).filter(
                      (v) => v.id === "js-initialData"
                    )[0].innerHTML
                  ).initialState.entities.articles
                )[0];
              this.tags[v.title] = tags;
              this.times[v.title] = {
                createdTime,
                updatedTime
              };
            } else if (v.href.includes("zvideo")) {
              // 知乎视频
              const html = await get(v.href);
              const tags = Array.from($(".ZVideoTag", html)).map((e) =>
                $(e).text()
              );
              const { publishedAt: createdTime, updatedAt: updatedTime } =
                Object.values(
                  JSON.parse(
                    Array.from($(html)).filter(
                      (v) => v.id === "js-initialData"
                    )[0].innerHTML
                  ).initialState.entities.zvideos
                )[0];
              this.tags[v.title] = tags;
              this.times[v.title] = {
                createdTime,
                updatedTime
              };
            } else {
              this.tags[v.title] = true;
            }
          }
        });
        setTimeout(this.updateTagsAndTimes, 1000);
      },

      updateQuestionsDisplayStatus() {
        Array.from($(".TopstoryItem")).forEach((v, i) => {
          const title = $(v).find(".ContentItem-title a").text();

          if (
            !$(v).is(":hidden") &&
            this.tags[title] &&
            this.tags[title] !== true &&
            this.tags[title].some((tag) => this.rules.includes(tag))
          ) {
            $(v).hide();
            console.log("已过滤问题:", title);
          }
        });
        setTimeout(this.updateQuestionsDisplayStatus, 100);
      },

      updateQuestionsTimeMark() {
        Array.from($(".TopstoryItem")).forEach((v, i) => {
          const $title = $(v).find(".ContentItem-title a");
          const title = $title.text();

          if (
            !$(v).is(":hidden") &&
            !$(v).find(".time-mark").length &&
            this.times[title] &&
            this.times[title] !== true
          ) {
            const createdTime = this.times[title].createdTime;
            const updatedTime = this.times[title].updatedTime;
            const createdTimeStr = `${dayjs
              .duration(dayjs().diff(this.times[title].createdTime * 1000))
              .humanize()}前`;
            const updatedTimeStr = `${dayjs
              .duration(dayjs().diff(this.times[title].updatedTime * 1000))
              .humanize()}前`;

            if (createdTime === updatedTime) {
                $title.parent().after(
                  `<div class="time-mark" style="font-size: 14px; color: #8590a6; line-height: 1.67; margin-top: 5px; font-weight: 400;">发布于 ${createdTimeStr}</div>`
                );
            } else {
              if (createdTimeStr === updatedTimeStr) {
                $title.parent().after(
                  `<div class="time-mark" style="font-size: 14px; color: #8590a6; line-height: 1.67; margin-top: 5px; font-weight: 400;">编辑于 ${updatedTimeStr}</div>`
                );
              } else {
                $title.parent().after(
                  `<div class="time-mark" style="font-size: 14px; color: #8590a6; line-height: 1.67; margin-top: 5px; font-weight: 400;">发布于 ${createdTimeStr} → 编辑于 ${updatedTimeStr}</div>`
                );
              }
            }
          }
        });
        setTimeout(this.updateQuestionsTimeMark, 100);
      }
    },

    async created() {
      await this.loadConfig();
      this.updateTitles();
      this.updateTagsAndTimes();
      this.updateQuestionsDisplayStatus();
      this.updateQuestionsTimeMark();
    }
  });
});
