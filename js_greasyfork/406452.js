// ==UserScript==
// @name         优化tapd故事墙
// @namespace    https://github.com/Dcatfly/Tampermonkey.git
// @version      0.5
// @description  1. 在tapd故事墙中添加story预估时间 2. 在故事墙中增加【新需求】与【实现中】的时间统计 3.在故事墙中显示custom_field_one字段值。4.显示时间统计时增加高优先级高亮显示
// @author       Dcatfly
// @match        https://www.tapd.cn/*/storywalls*
// @downloadURL https://update.greasyfork.org/scripts/406452/%E4%BC%98%E5%8C%96tapd%E6%95%85%E4%BA%8B%E5%A2%99.user.js
// @updateURL https://update.greasyfork.org/scripts/406452/%E4%BC%98%E5%8C%96tapd%E6%95%85%E4%BA%8B%E5%A2%99.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const timeCountArr = [
    { label: "新需求", key: "new" },
    { label: "实现中", key: "developing" },
  ];
  const reopenField = "custom_field_one";
  const high_priority = "High";
  const high_priority_color = "#fe5050";
  window.onload = function () {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target: tr, isIntersecting }) => {
          if (isIntersecting) {
            observer.unobserve(tr);
            const user = tr.querySelector("td.charge > div > ul");
            const stories = tr.querySelectorAll("li[story_id]");
            Promise.all(
              Array.from(stories).map((li) => {
                const storyId = li.getAttribute("story_id");
                const type = li.getAttribute("transition");
                const url = `https://www.tapd.cn/${_workspace_id}/prong/entity_preview/story_preview_data?id=${storyId}&from=iteration_storywall`;
                return fetch(url)
                  .then((rep) => rep.json())
                  .then((data) => {
                    if (data.code === 200) {
                      const title = li.querySelector(".note_head");
                      const effort = data.data.story.effort;
                      const reopen = data.data.story[reopenField];
                      const priority = data.data.story.priority;

                      const span = document.createElement("span");
                      span.append(`${effort}人时`);
                      if (Number(reopen)) {
                        const reopenSpan = document.createElement("span");
                        reopenSpan.style.color = "red";
                        span.append("|");
                        reopenSpan.append(`${reopen}次`);
                        span.append(reopenSpan);
                      }

                      title.style.display = "flex";
                      title.style.justifyContent = "space-between";
                      title.append(span);

                      return {
                        [type]: Number(effort),
                        [`${type}_${priority}`]: Number(effort),
                      };
                    }
                  });
              })
            ).then((times) => {
              const timeCounts = times.reduce((pre, next) => {
                Object.keys(next).forEach((key) => {
                  pre[key] = (pre[key] || 0) + next[key];
                });
                return pre;
              }, {});
              timeCountArr.forEach(({ label, key }) => {
                const timeCount = timeCounts[key];
                if (timeCount) {
                  const highPriorityCount =
                    timeCounts[`${key}_${high_priority}`];
                  const li = document.createElement("li");
                  li.style.overflow = "unset";
                  li.append(`${label}: `);
                  if (highPriorityCount) {
                    const highCountSpan = document.createElement("span");
                    highCountSpan.style.color = high_priority_color;
                    highCountSpan.append(highPriorityCount);
                    li.append(highCountSpan);
                    li.append("/");
                  }
                  li.append(`${timeCount}人时`);

                  user.append(li);
                }
              });
            });
          }
        });
      },
      { rootMargin: "200px 0px 200px 0px" }
    );
    document.querySelectorAll("#resource_table > tbody > tr").forEach((tr) => {
      observer.observe(tr);
    });
  };
})();
