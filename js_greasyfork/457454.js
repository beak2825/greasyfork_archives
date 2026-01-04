// ==UserScript==
// @name         Gelbooru Tag Copyer
// @namespace    https://greasyfork.org/zh-CN/scripts/439308
// @version      1.5
// @description  复制 Gelbooru 的 tags，支持自定义选择 tag 类型 / Quickly copy tags from gelbooru's post so you can use thoes tags to generate AI images.
// @author       3989364
// @include      *://gelbooru.com/index.php*
// @icon         https://gelbooru.com/favicon.ico
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/457454/Gelbooru%20Tag%20Copyer.user.js
// @updateURL https://update.greasyfork.org/scripts/457454/Gelbooru%20Tag%20Copyer.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const tagListEle = document.querySelector("#tag-list");

    const DEFAULT_CHECKED_TAGS = ["general", "copyright", "character"];
    const DEFAULT_QUALITY_TAG = ''; // `((masterpiece)), (((best quality))), ((ultra-detailed)), ((illustration)), (an extremely delicate and beautiful), `;

    const attriTags = ["hair", "eyes", "dress", "sleeves", "bow"];

    const EXCLUDED_TAGS = ["censor", "out-of-frame", "speech bubble"];

    function initUI(tagListEle, defultCheckedTags) {
        /**
     * @param tagListEle
     * @returns [String, ...]
     */
        function parseTags(tagListEle) {
            const tags = Object.create(null);

            tagListEle
                .querySelectorAll('li[class^="tag-type"]')
                .forEach((tagItem) => {
                const tagEle = tagItem.querySelector(".sm-hidden + a");
                const tag = tagEle.textContent;

                const tagCount = parseInt(tagEle.nextElementSibling.textContent) || 0;

                const tagType = tagItem.className.replace("tag-type-", "");
                if (!tags[tagType]) {
                    tags[tagType] = [];
                }

                tags[tagType].push({ tag, tagCount });
            });

            // sort general tags by count
            if ("general" in tags) {
                tags["general"].sort((a, b) => b.tagCount - a.tagCount);
            }

            for (const key in tags) {
                tags[key] = tags[key].map((item) => item.tag);
            }

            // add attr tag
            tags["attrTag"] = [];
            return tags;
        }

        function createTagCheckbox(tagType, checked = false) {
            const el = document.createElement("div");

            el.innerHTML = `
        <input
        type="checkbox"
        name="${tagType}"
        ${checked ? "checked" : ""}>${tagType}
    `;

        el.style.marginBottom = "0.15rem";
        el.style.display = "flex";
        el.style.alignItems = "center";

        return [el, el.querySelector("input")];
    }

      const tagCheckboxList = [];
      const tagsObj = parseTags(tagListEle);

      // emphasis character
      if ("character" in tagsObj) {
          tagsObj["character"] = tagsObj["character"].map(
              (character) => `${character}`
      );
    }

      // exclude special tags & resort tag
      if ("general" in tagsObj) {
          tagsObj["attrTag"] = tagsObj["general"].filter((tag) =>
                                                         attriTags.some((attrTag) => tag.includes(attrTag))
                                                        );

          tagsObj["general"] = tagsObj["general"]
              .filter(
              (name) => !EXCLUDED_TAGS.some((exTags) => name.includes(exTags))
          )
              .filter((tag) => !attriTags.some((attrTag) => tag.includes(attrTag)));
      }

      const tagCheckboxContainer = document.createElement("li");

      for (const tagType in tagsObj) {
          if (tagType === "attrTag") {
              continue;
          }

          tagsObj[tagType] = tagsObj[tagType].map(item => item.replaceAll('(', '\\(').replaceAll(')', '\\)'))
          // console.log(tagsObj)
          const [wrapper, ckbox] = createTagCheckbox(
              tagType,
              defultCheckedTags.includes(tagType)
          );

          tagCheckboxContainer.appendChild(wrapper);
          tagCheckboxList.push(ckbox);
      }

      const copyBtn = document.createElement("button");

      copyBtn.innerText = "Copy";
      tagCheckboxContainer.appendChild(copyBtn);
      tagListEle.insertBefore(tagCheckboxContainer, tagListEle.firstChild);

      return {
          copyBtn,
          tagCheckboxList,
          tagsObj,
      };
  }

    const ui = initUI(tagListEle, DEFAULT_CHECKED_TAGS);

    const tagTypeOrderMap = {
        character: 1,
        copyright: 1,
        artist: 1,
        attrTag: 1,
        general: 2,
    };

    ui.copyBtn.addEventListener("click", () => {
        const checkedTagsType = ui.tagCheckboxList
        .filter((item) => item.checked)
        .map((item) => item.name);

        if(checkedTagsType.includes('character')) {
            checkedTagsType.push("attrTag");
        }

        // sort tags by type
        // checkedTagsType.sort((a, b) => {
        //    return tagTypeOrderMap[a] - tagTypeOrderMap[b];
        // });

        const tags =
              DEFAULT_QUALITY_TAG +
              "\n" +
              checkedTagsType
        .map((type) => {
            return ui.tagsObj[type].join(", ");
        })
        .join(",\n");

        navigator.clipboard.writeText(tags).then(() => {
            window.notice && window.notice('Tags copied.')
        }).catch((e) => {
            // alert('failed copy tags:', e)
            prompt("copied tags:", tags);
        })
    });
})();
