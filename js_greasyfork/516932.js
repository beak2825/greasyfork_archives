// ==UserScript==
// @name WF ToolBox
// @description Workflowy 插件集成
// @namespace https://github.com/bekafka/WorkflowyToolBox
// @version 20241129V0.6
// @author YYYYang
// @license MIT
// @match http://workflowy.com/*
// @match https://workflowy.com/*
// @match http://*.workflowy.com/*
// @match https://*.workflowy.com/*
// @icon  https://www.google.com/s2/favicons?sz=64&domain=workflowy.com
// @grant GM_setClipboard
// @grant GM_notification
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/516932/WF%20ToolBox.user.js
// @updateURL https://update.greasyfork.org/scripts/516932/WF%20ToolBox.meta.js
// ==/UserScript==

// 整体工具箱菜单代码来自 @稻米鼠（https://greasyfork.org/zh-CN/users/36055）的【洗白白插件】

/* 弹出通知 */
// const dmsCLNotification = function (text) {
//   GM_notification(text, 'Success! ', 'data:image/png;base64,iVxxxxxxxxxxxxxxxCYII=');
// };

/** 获取是否显示页面工具栏 **/
// SHow_page_bar 为外置插件变量
let isShowPageBar = GM_getValue('SHow_page_bar', true);

GM_registerMenuCommand('显示/隐藏页面工具条', () => {
  GM_setValue('SHow_page_bar', !isShowPageBar);
  isShowPageBar = GM_getValue('SHow_page_bar', true);
  alert(
    '页面工具条已被设置为【' +
    (isShowPageBar ? '显示' : '隐藏') +
    '】，仅在此后新打开页面中生效。'
  );
});


// ————————————————————————————


const Find_Replace = () => {
  // alert("查找与替换");

  (function FR_2_4() {
    function toastMsg(str, sec, err) {
      WF.showMessage(str, err);
      setTimeout(WF.hideMessage, (sec || 3) * 1000);
    }
    function applyToEachItem(functionToApply, parent) {
      functionToApply(parent);
      for (let child of parent.getChildren()) {
        applyToEachItem(functionToApply, child);
      }
    }
    function findMatchingItems(itemPredicate, parent) {
      const matches = [];
      function addIfMatch(item) {
        if (itemPredicate(item)) {
          matches.push(item);
        }
      }
      applyToEachItem(addIfMatch, parent);
      return matches;
    }
    function editableItemWithVisibleMatch(item) {
      const isVisible = WF.completedVisible() || !item.isWithinCompleted();
      return item.data.search_result && item.data.search_result.matches && isVisible && !item.isReadOnly()
    }
    const escapeForRegExp = str => str.replace(/[-\[\]{}()*+?.,\\^$|#]/g, "\\$&");
    function countMatches(items, rgx) {
      let matchCount = 0;
      items.forEach(item => {
        let result = item.data.search_result;
        if (result.nameMatches) {
          let nameMatch = item.getName().match(rgx);
          if (nameMatch) matchCount += nameMatch.length;
        }
        if (result.noteMatches) {
          let noteMatch = item.getNote().match(rgx);
          if (noteMatch) matchCount += noteMatch.length;
        }
      });
      return matchCount;
    }
    const htmlEscTextForContent = str => str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/\u00A0/g, "&nbsp;");
    function replaceMatches(items, rgx, r) {
      WF.editGroup(function () {
        items.forEach(item => {
          let result = item.data.search_result;
          if (result.nameMatches) WF.setItemName(item, item.getName().replace(rgx, htmlEscTextForContent(r)));
          if (result.noteMatches) WF.setItemNote(item, item.getNote().replace(rgx, htmlEscTextForContent(r)));
        });
      });
      r === "" ? WF.clearSearch() : WF.search(tQuery.replace(find, r));
    }
    const htmlEscText = str => str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    function getColors() {
      const p = document.querySelector(".page.active");
      return p ? `color:${getComputedStyle(p).color};background:${getComputedStyle(p).backgroundColor};` : "";
    }
    function showFindReplaceDialog(BODY, TITLE, aCount, cCount, searchValue) {
      const addButton = (num, name) => `<button type="button" class="btnX" id="btn${num.toString()}">${name}</button>`;
      const boxStyle = `#inputBx{${getColors()}width:95%;height:20px;display:block;margin-top:5px;border:1px solid #ccc;border-radius:4px;padding:4px}`;
      const btnStyle = `.btnX{font-size:18px;background-color:gray;border:2px solid;border-radius:20px;color:#fff;padding:5px 15px;margin-top:16px;margin-right:16px}.btnX:focus,.btnX:hover{border-color:#c4c4c4;background-color:steelblue}`;
      const box = `<div><b>替换文本:</b><input value="${htmlEscText(searchValue)}" id="inputBx" type="text" spellcheck="false"></div>`;
      const buttons = addButton(1, `替换: 全部 (${aCount})`) + addButton(2, `替换: 区分大小写 (${cCount})`);
      WF.showAlertDialog(`<style>${boxStyle + btnStyle}</style><div>${BODY}</div>${box}<div>${buttons}</div>`, TITLE);
      const intervalId = setInterval(function () {
        let inputBx = document.getElementById("inputBx");
        if (inputBx) {
          clearInterval(intervalId);
          let userInput;
          const btn1 = document.getElementById("btn1");
          const btn2 = document.getElementById("btn2");
          inputBx.select();
          inputBx.addEventListener("keyup", function (event) {
            if (event.key === "Enter") {
              btn1.click();
            }
          });
          btn1.onclick = function () {
            userInput = inputBx.value;
            WF.hideDialog();
            setTimeout(function () {
              replaceMatches(Matches, rgx_gi, userInput)
            }, 50);
          };
          btn2.onclick = function () {
            userInput = inputBx.value;
            WF.hideDialog();
            setTimeout(function () {
              replaceMatches(Matches, rgx_g, userInput)
            }, 50);
          };
        }
      }, 50);
    }
    if (!WF.currentSearchQuery()) {
      return void toastMsg('请先使用搜索框键入关键词  ⇒  <a href="https://workflowy.com/s/findreplace-bookmark/ynKNSb5dA77p2siT" target="_blank">更多信息请查看</a>', 4, true);
    }
    const tQuery = WF.currentSearchQuery().trim();
    const Matches = findMatchingItems(editableItemWithVisibleMatch, WF.currentItem());
    const isQuoted = tQuery.match(/(")(.+)(")/);
    const find = isQuoted ? isQuoted[2] : tQuery.includes(" ") ? false : tQuery;
    if (find === false) {
      if (confirm('The search contains at least one space.\n\n1. Press OK to convert your search to "exact match".\n\n2. Activate Find/Replace again.')) {
        WF.search('"' + tQuery + '"');
      }
      return;
    }
    const title = "查找与替换 / Find&Replace";
    const modeTxt = isQuoted ? "Exact Match, " : "Single Word/Tag, ";
    const compTxt = `Completed: ${WF.completedVisible() ? "Included" : "Excluded"}`;
    const findTxt = isQuoted ? isQuoted[0] : tQuery;
    const body = `<p><b>模式 / Mode：</b><br>${modeTxt + compTxt}</p><p><b>匹配关键词 / Find：</b><br>${htmlEscText(findTxt)}</p>`;
    const findRgx = escapeForRegExp(htmlEscTextForContent(find));
    const rgx_gi = new RegExp(findRgx, "gi");
    const rgx_g = new RegExp(findRgx, "g");
    const allCount = countMatches(Matches, rgx_gi);
    const caseCount = countMatches(Matches, rgx_g);
    if (allCount > 0) {
      showFindReplaceDialog(body, title, allCount, caseCount, find);
    } else {
      WF.showAlertDialog(`${body}<br><br><i>😞 没有匹配的搜索结果。 / No matches found.</i>`, title);
    }
  })();

};

const WF_Sort = () => {
  // alert("WF节点排序");

  (function sortWF_4_0(maxChildren = 1000) {
    function toastMsg(str, sec, err) {
      WF.showMessage(str, err);
      setTimeout(WF.hideMessage, (sec || 2) * 1000);
    }

    function sortAndMove(items, reverse) {
      WF.hideDialog();
      setTimeout(() => {
        items.sort((a, b) => reverse ? b.getNameInPlainText().localeCompare(a.getNameInPlainText()) : a.getNameInPlainText().localeCompare(b.getNameInPlainText()));
        WF.editGroup(() => {
          items.forEach((item, i) => {
            if (item.getPriority() !== i) WF.moveItems([item], parent, i);
          });
        });
        // set focus to parent after sort
        WF.editItemName(parent);
        toastMsg(`已按 ${reverse ? "倒序（Z-A）" : "正序（A-Z）"} 进行重新排列`, 3)
      }, 50);
    }

    const htmlEscText = str => str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

    function showSortDialog(bodyHtml, title) {
      const addButton = (num, name) => `<button type="button" class="btnX" id="btn${num.toString()}">${name}</button>`;
      const style = '.btnX{font-size:18px;background-color:gray;border:2px solid;border-radius:20px;color:#fff;padding:5px 15px;margin-top:16px;margin-right:16px}.btnX:focus,.btnX:hover{border-color:#c4c4c4;background-color:steelblue}';
      const buttons = addButton(1, "正序 A-Z") + addButton(2, "倒序 Z-A");

      WF.showAlertDialog(`<style>${htmlEscText(style)}</style><div>${bodyHtml}</div><div>${buttons}</div>`, title);

      const intervalId = setInterval(
        function () {
          let btn1 = document.getElementById("btn1");
          if (btn1) {
            clearInterval(intervalId);
            const btn2 = document.getElementById("btn2");
            // btn1.focus();
            btn1.onclick = function () { sortAndMove(children) };
            btn2.onclick = function () { sortAndMove(children, true) };
          }
        }, 50);
    }

    if (WF.currentSearchQuery()) return void toastMsg("Sorting is disabled when search is active.", 4, true);
    const parent = WF.currentItem();
    if (parent.isReadOnly()) return void toastMsg("Parent 是只读的，不能被排序。", 4, true);
    const children = parent.getChildren();
    if (children.length < 2) return void toastMsg("Nothing to sort.", 4, true);
    if (children.length > maxChildren) return void toastMsg(`Sorting more than ${maxChildren} children upsets the WorkFlowy gods, and has been disabled.`, 5, true);
    const sortInfo = `当前页面有 <b>${children.length}</b> 个子节点，你要如何排序它们?`;

    showSortDialog(sortInfo, parent.getNameInPlainText());

  })();

};

const NodeWord_Count = () => {
  // alert("节点与字数统计");

  function e(a) {
    let b = a.getName().trim().length, c = a.getNote().trim().length;
    // console.log(b, c, a.getName());
    for (
      let f of a.getChildren()
    )
      a = e(f), b += a[0], c += a[1];
    return [b, c]
  }

  let d = WF.currentItem(), [g, h] = e(d);

  WF.showMessage(
    `🔘【本页节点总数 <b>${d.getNumDescendants()}</b>
      ，本页根节点个数 <b>${d.getChildren().length}</b>】
      &nbsp;&nbsp;&nbsp;&nbsp;🅰️【文本字数 <b>${g}</b>
      ，注释字数 <b>${h}</b>】`
  )

};

const FlatFlowy = () => {
  // alert("扁平展示搜索结果");

  (function flatFlowy_3_2() {

    function toastMsg(str, sec, err) {
      WF.showMessage(str, err);
      setTimeout(WF.hideMessage, (sec || 3) * 1000);
    }
    function getNameForBreadcrumb(item) {
      const plainName = item.getNameInPlainText().trim();
      var replaceName = "Untitled";
      // if image/file has no title use uploaded filename 
      if (plainName.length === 0 && item.data.metadata.s3File && item.data.metadata.s3File.fileName) replaceName = item.data.metadata.s3File.fileName;
      return plainName.length === 0 ? replaceName : plainName
    }
    function getBreadcrumbsAsString(item) {
      const ancestors = item.getAncestors().reverse();
      return ancestors.length > 1 ? ancestors.splice(1).map(ancestor => getNameForBreadcrumb(ancestor)).join(" > ") : "Home";
    }
    function addBreadcrumbsToMatches() {
      const matches = document.querySelectorAll('.project.matches,.project.metaMatches');
      matches.forEach(match => {
        const pID = match.getAttribute("projectid");
        const item = WF.getItemById(pID);
        match.firstChild.title = getBreadcrumbsAsString(item) // .name node gets titled
      });
    }
    const css = `.page.searching .project>.name,.page.searching .project>.notes{height:0;opacity:0}.page.searching .project.matches .name.matches,.page.searching .project.matches.noted .name,.page.searching .project.metaMatches .name{height:100%;opacity:1}.page.searching .children{margin:0;padding:0;border:0}.page.searching .addSiblingButton,.page.searching .expand{display:none}.done .fullMatch .content .contentMatch,.fullMatch .content .contentMatch,.project.metaMatches>.name.with-updates.annotationAdded>.content>.innerContentContainer,.project.metaMatches>.name>.content>.innerContentContainer{background-color:transparent}`;
    const ID = "FlatFlowy";
    const ff = document.getElementById(ID);
    const NO_SEARCH = WF.currentSearchQuery() === null;
    if (ff) {
      NO_SEARCH ? toastMsg(`FlatFlowy 功能状态： ${ff.disabled ? "ON" : "OFF"}`) : addBreadcrumbsToMatches();
      return void (ff.disabled = !ff.disabled);
    }
    const s = document.createElement('style');
    s.innerText = css;
    s.id = ID;
    document.head.appendChild(s);
    NO_SEARCH ? toastMsg("FlatFlowy 功能状态： ON") : addBreadcrumbsToMatches();

  })();


};

const TagIndex = () => {
  // alert("标签统计与索引生成");

  (function tagCounter_1_7(

    sortByCount = false, showCompleted = true) {
    if (typeof sortByCount !== "boolean") sortByCount = false;
    if (typeof showCompleted !== "boolean") showCompleted = true;

    function toastMsg(str, sec, err) {
      WF.showMessage(str.bold(), err);
      setTimeout(() => WF.hideMessage(), (sec || 2) * 1e3)
    }
    function applyToEachItem(functionToApply, parent) {
      functionToApply(parent);
      for (let child of parent.getChildren()) {
        applyToEachItem(functionToApply, child)
      }
    }
    function findMatchingItems(itemPredicate, parent) {
      const matches = [];
      function addIfMatch(item) {
        if (itemPredicate(item)) {
          matches.push(item)
        }
      } applyToEachItem(addIfMatch, parent);
      return matches
    }
    function isVisibleSearchResult(item) {
      const isVisible = WF.completedVisible() || !item.isWithinCompleted();
      return item.data.search_result && isVisible
    }
    function getWfTagsList(item) {
      const tagCounts = item.isMainDocumentRoot() ? getRootDescendantTagCounts() : item.getTagManager().descendantTagCounts;
      const tagsList = tagCounts ? tagCounts.getTagList() : [];
      return tagsList.sort((a, b) => a.tag.localeCompare(b.tag))
    }
    function getItemTags(item) {
      return WF.getItemNameTags(item).concat(WF.getItemNoteTags(item)).map(t => t.tag.toLowerCase())
    }
    function getAllTags(items) {
      const tags = [];
      items.forEach(item => {
        tags.push(...getItemTags(item))
      });
      return tags
    }
    function getVisibleTagsList(item) {
      const visibleItems = findMatchingItems(isVisibleSearchResult, item), tags = getAllTags(visibleItems), uniqueTags = new Set(tags), tagList = [];
      uniqueTags.forEach(uTag => {
        let uCount = tags.filter(t => t === uTag).length;
        tagList.push({
          tag: uTag, count: uCount
        })
      });
      return tagList.sort((a, b) => a.tag.localeCompare(b.tag))
    }
    if (!WF.completedVisible() && showCompleted) WF.toggleCompletedVisible();
    const current = WF.currentItem();
    const tagCounts = WF.currentSearchQuery() ? getVisibleTagsList(current) : getWfTagsList(current);
    if (tagCounts.length === 0) {
      return void toastMsg("未找到任何标签", 3, true)
    }
    if (sortByCount) tagCounts.sort((a, b) => b.count - a.count);

    const addButton = (num, name) => `<button type="button" class="btnX" id="btn${num.toString()}">${name}</button>`;
    const btnXstyle = '.btnX{font-size:18px;background-color:gray;border:2px solid;border-radius:20px;color:#fff;padding:5px 15px;margin-top:16px;margin-right:16px}.btnX:focus,.btnX:hover{border-color:#c4c4c4;background-color:steelblue}';
    const button1 = addButton(1, "创建标签索引？");


    const url = `${current.getUrl()}${current.isMainDocumentRoot() ? "#" : ""}`;
    const total = tagCounts.reduce((sum, t) => t.count + sum, 0), padMax = total.toString().length, search = WF.currentSearchQuery() ? WF.currentSearchQuery() + " : " : "";
    const tagPre = tagCounts.map(t => `${t.count.toString().padStart(padMax, " ")}\t<a class="tagLinks" href="${url}?q=${encodeURIComponent(t.tag)}">${t.tag}</a>`);
    WF.showAlertDialog(`<style>${btnXstyle}</style><pre><br>${tagPre.join('<br>')}<br><br><b>${total}\t总 计</b></pre><div>${button1}</div>`, search + current.getNameInPlainText());


    const intervalId = setInterval((
      function () {
        let tagLinks = document.getElementsByClassName("tagLinks");
        if (tagLinks) {
          clearInterval(intervalId);
          for (let tagLink of tagLinks) {
            tagLink.addEventListener('click', (function () {
              WF.hideDialog()
            }), false)
          }
        }
      }
    ), 50);



    const intervalId2 = setInterval(
      function () {
        let btn1 = document.getElementById("btn1");
        if (btn1) {
          clearInterval(intervalId2);

          btn1.onclick = function () {

            // ————————  并生成索引目录  ————————
            (function tagIndex_3_8(separator = '"_separator_"') {

              if (separator === '"_separator_"') separator = " ";

              function toastMsg(str, sec, err) {
                WF.showMessage(str, err);
                setTimeout(WF.hideMessage, (sec || 3) * 1000);
              }
              function getDescendantTags(item) {
                const tagCounts = item.isMainDocumentRoot() ? getRootDescendantTagCounts() : item.getTagManager().descendantTagCounts;
                const tagList = tagCounts ? tagCounts.getTagList() : [];
                const tagArr = tagList.map(Tag => Tag.tag);
                // Filter out template tags
                return tagArr.filter(tag => tag.toLowerCase() !== "#template" && !tag.toLowerCase().startsWith("#use-template"));
              }
              const htmlEscTextForContent = str => str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/\u00A0/g, " ");
              function newTopBullet(str) {
                WF.editGroup(() => {
                  const newBullet = WF.createItem(WF.currentItem(), 0);
                  WF.setItemName(newBullet, htmlEscTextForContent(str));
                });
              }
              const current = WF.currentItem();
              const tagNames = getDescendantTags(current);
              if (tagNames.length === 0) return void toastMsg("No tags found.", 2, true);
              if (current.isEmbedded()) return void toastMsg("Tag Index is disabled for added shares.", 5, true);
              tagNames.sort((a, b) => a.localeCompare(b));
              newTopBullet(tagNames.join(separator));
            })();

          };

          btn1.addEventListener('click', (function () {
            WF.hideDialog()
          }), false)
        }

      }, 50);

  })();


};


const TextMosaic = () => {
  // alert("文字马赛克");

  // const TMstyle = '.innerContentContainer, .innerContentContainer .contentTag, .innerContentContainer span, .contentLink { color: transparent !important; background: none !important; text-shadow: #A5A1A1 0 0 6px; }';

  // GM_addStyle(`${TMstyle}`);


  // const intervalStyle = setInterval(
  //   function () {

  //     document.head.appendChild(TMstyle);
  //   }, 5000);


  // clearInterval(intervalStyle);
}




if (isShowPageBar) {

  /** 添加样式 **/
  GM_addStyle(`
#dms-link-cleaner {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 99999999;
  pointer-events: none;
}
#dms-link-cleaner * {
  pointer-events: auto;
}
#dms-lc-button {
  position: relative;
  margin: 0 auto;
  width: 44px;
  height: 20px;
  color: rgba(0, 0, 0, .4);
  font-size: 20px;
  line-height: 13px;
  cursor: pointer;
  text-align: center;
  border: 1px solid #AAA;
  border-radius: 16px 16px 0 0;
  background-color: rgba(255, 255, 255, .3);
  box-shadow: 0 0 5px rgba(0, 0, 0, .1);
}
#dms-lc-button:hover {
  color: rgba(0, 0, 0, .8);
  box-shadow: 0 0 5px rgba(0, 0, 0, .5);
}
#dms-lc-panel {
  display: none;
  border-top: 5px solid #65adff;
  box-shadow: 0 0 5px rgba(0, 0, 0, .1);
}
body._theme-default #dms-lc-panel{
  background-color: #FFF;
}
body._theme-dark #dms-lc-panel{
  background-color: rgb(24 25 28 / 90%);
}
#dms-lc-panel > #dms-lc-panel-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 1 none;
  flex-wrap: wrap;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 16px 0;
  text-align: center;
  position: relative;
}
#dms-lc-panel > #dms-lc-panel-content > .dms-lc-button {
  position: relative;
  padding: 8px 16px;
  margin: 0 8px 0 0;
  font-size: 16px;
  line-height: 1.2em;
  font-weight: lighter;
  border: 1px solid #65adff;
  border-radius: 8px;
  cursor: pointer;
}
#dms-lc-panel > #dms-lc-panel-content > .dms-lc-button:hover {
  border: 1px solid #0062d1;
  background-color: #0062d1;
  color: #FFF;
  font-weight: normal;
}
#dms-lc-panel > #dms-lc-panel-content > .dms-lc-button:hover::before {
  content: attr(data-tip);
  background-color: rgba(0, 0, 0, .9);
  border-radius:3px;
  color: #fff;
  padding: 10px;
  position: absolute;
  width: calc(100% + 20px);
  left: 50%;
  bottom: calc(100% + 10px);
  margin-left: calc(-50% - 20px);
  white-space: pre;
}
#dms-lc-panel > #dms-lc-panel-content > .dms-lc-button:hover::after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  left: calc(50% - 8px);
  top: -10px;
  border-top: 8px solid rgba(0, 0, 0, .8);
  border-right: 8px solid transparent;
  border-left: 8px solid transparent;
}
#dms-lc-panel > #dms-lc-panel-content > .dms-lc-hr {
  width: 100%;
  margin: 5px 0;
}
#dms-lc-panel > #dms-lc-panel-content > #dmsCLButtonCoffee {
  padding: 0;
  margin: 0;
}
#dms-lc-panel > #dms-lc-panel-content > #dmsCLButtonCoffee > svg {
  width: 35px;
  height: 35px;
}
#dms-lc-panel > #dms-lc-panel-content > #dms-lc-qrcode {
  display: none;
  width: 100%;

  position: absolute;
  left: 0;
  bottom: calc(100% + 24px);
  padding: 16px;
  color: #333;
  font-size: 18px;
  line-height: 1.2em;
  border: 1px solid #CCC;
  border-radius: 12px 12px 0 0;
  background-color: #FFF;
  box-shadow: 0 6px 36px 5px rgba(0, 0, 0, .16);
}
#dms-lc-panel > #dms-lc-panel-content > #dms-lc-qrcode > img {
  width: 30%;
  max-width: 180px;
}
  `);

  /** 添加界面 **/
  const dmsLCPopPanel = document.createElement('div');
  dmsLCPopPanel.id = 'dms-link-cleaner';
  dmsLCPopPanel.innerHTML = `<div id="dms-lc-button">
  ︽
</div>
<div id="dms-lc-panel">
  <div id="dms-lc-panel-content">
    <div class="dms-lc-button" id="dmsCLFR" data-tip="查找与替换">
      查找与替换
    </div>
    <div class="dms-lc-button" id="dmsCLST" data-tip="节点排序">
      节点排序
    </div>
    <div class="dms-lc-button" id="dmsCLNWC" data-tip="节点与字数统计">
      节点与字数统计
    </div> 
    <div class="dms-lc-hr"></div>
    <div class="dms-lc-button" id="dmsCLFF" data-tip="扁平展示搜索结果">
      扁平展示搜索结果
    </div>
    <div class="dms-lc-button" id="dmsCLTI" data-tip="标签统计与索引生成">
      标签统计与索引生成
    </div>
    <div class="dms-lc-button" id="dmsCLButtonCopyTitle" data-tip="预留功能">
      预留功能
    </div>
    <div class="dms-lc-button" id="dmsCLTM" data-tip="文字马赛克">
      文字马赛克
    </div>
    <div class="dms-lc-hr"></div>
    <div class="dms-lc-button" id="dmsCLButtonCleanAll" data-tip="预留功能">
      预留功能
    </div>
    <div class="dms-lc-button" id="dmsCLButtonLink" data-tip="联系作者">Issues</div>
    <div class="dms-lc-button" id="dmsCLButtonCoffee" data-tip="Coffee">
      <svg t="1539507279741" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1618" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M237.717333 320L277.333333 597.333333h469.333334l39.616-277.333333z" fill="#FFC107" p-id="1619"></path><path d="M832 320v-53.333333a32 32 0 0 0-32-32h-576A32 32 0 0 0 192 266.666667V320h640z" fill="#795548" p-id="1620"></path><path d="M280.384 618.666667L320 896h384l39.616-277.333333z" fill="#77574F" p-id="1621"></path><path d="M512 597.333333m-106.666667 0a106.666667 106.666667 0 1 0 213.333334 0 106.666667 106.666667 0 1 0-213.333334 0Z" fill="#77574F" p-id="1622"></path><path d="M426.666667 597.333333c0-15.616 4.501333-30.058667 11.84-42.666666h-167.253334l15.232 106.666666h169.621334A84.778667 84.778667 0 0 1 426.666667 597.333333zM585.493333 554.666667c7.338667 12.608 11.84 27.050667 11.84 42.666666a84.778667 84.778667 0 0 1-29.44 64h169.621334l15.232-106.666666h-167.253334zM768 128H256l-21.333333 106.666667h554.666666z" fill="#4E342E" p-id="1623"></path><path d="M512 448a149.333333 149.333333 0 1 1 0 298.666667 149.333333 149.333333 0 0 1 0-298.666667m0-21.333333c-94.101333 0-170.666667 76.565333-170.666667 170.666666s76.565333 170.666667 170.666667 170.666667 170.666667-76.565333 170.666667-170.666667-76.565333-170.666667-170.666667-170.666666z" fill="#5D4037" p-id="1624"></path><path d="M512 448a149.333333 149.333333 0 1 0 0 298.666667 149.333333 149.333333 0 0 0 0-298.666667z m0 234.666667a85.333333 85.333333 0 1 1 0-170.666667 85.333333 85.333333 0 0 1 0 170.666667z" fill="#FFF3E0" p-id="1625"></path></svg>
    </div>
    <div id="dms-lc-qrcode">
      Workflowy ToolBox<br />
      （Demo）
      <hr />
      敬请期待……
    </div>
  </div>
</div>`;

  document.body.insertBefore(
    dmsLCPopPanel,
    document.body.lastChild.nextSibling
  );

  /** 事件响应函数 **/

  /* 定义元素 */

  const FR = document.getElementById('dmsCLFR');
  const ST = document.getElementById('dmsCLST');
  const NWC = document.getElementById('dmsCLNWC');
  const FF = document.getElementById('dmsCLFF');
  const TI = document.getElementById('dmsCLTI');
  const TM = document.getElementById('dmsCLTM');



  const button = document.getElementById('dms-lc-button');
  const panel = document.getElementById('dms-lc-panel');
  const qrcode = document.getElementById('dms-lc-qrcode');
  const buttonTitle = document.getElementById('dmsCLButtonTitle');
  const buttonPure = document.getElementById('dmsCLButtonPure');
  const buttonCopyT = document.getElementById('dmsCLButtonCopyTitle');
  const buttonCopyL = document.getElementById('dmsCLButtonCopyLink');
  const buttonCleanLink = document.getElementById('dmsCLButtonCleanAll');
  const buttonLink = document.getElementById('dmsCLButtonLink');
  const buttonCoffee = document.getElementById('dmsCLButtonCoffee');

  /**
   * 面板切换
   */
  const dmsLCToggleEl = function (el) {
    const elStyle = getComputedStyle(el, '');
    if (elStyle.display === 'none') {
      el.style.display = 'block';
    } else {
      el.style.display = '';
    }
  };

  /** 添加监听器 **/
  /* 面板切换按钮 */
  button.addEventListener(
    'click',
    () => {
      dmsLCToggleEl(panel);
    },
    false
  );
  /* 买咖啡 */
  buttonCoffee.addEventListener(
    'click',
    () => {
      dmsLCToggleEl(qrcode);
    },
    false
  );



  // 查找与替换 https://rawbytz.github.io/find-replace/
  FR.addEventListener('click', Find_Replace, false);

  // 节点排序 https://rawbytz.github.io/sort/
  ST.addEventListener('click', WF_Sort, false);

  // 节点与字数统计 @rawbytz @seyee
  NWC.addEventListener('click', NodeWord_Count, false);

  // 扁平展示搜索结果 https://rawbytz.github.io/flatflowy/
  FF.addEventListener('click', FlatFlowy, false);

  // 标签统计与索引生成 https://rawbytz.github.io/tag-index/
  TI.addEventListener('click', TagIndex, false);

  // 文字马赛克
  TM.addEventListener('click', TextMosaic, false);



  /* 支持链接 */
  buttonLink.addEventListener('click', goToSupport, false);
  /* 净化并复制标题和链接 */
  buttonTitle.addEventListener('click', getCleanUrlAndTitle, false);
  /* 净化并复制链接 */
  buttonPure.addEventListener('click', getCleanUrl, false);
  /* 复制当前链接和标题 */
  buttonCopyT.addEventListener('click', getUrlAndTitle, false);
  /* 复制当前链接 */
  buttonCopyL.addEventListener('click', getUrlOnly, false);
  /* 清理整个页面 */
  buttonCleanLink.addEventListener('click', cleanAllPage, false);


  /* 全屏隐藏按钮 */
  document.addEventListener('fullscreenchange', function (event) {
    if (document.fullscreenElement) {
      button.style.display = 'none';
    } else {
      button.style.display = '';
    }
  });


}

