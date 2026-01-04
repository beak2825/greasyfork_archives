// ==UserScript==
// @name         neodb 收藏单 筛选、排序
// @namespace    https://github.com/LesslsMore/neodb-collection
// @version      0.0.1
// @author       lesslsmore
// @description  neodb 收藏单 筛选: 全选、已标记、未标记，排序: 年份、人数、评分, 升序、降序, 便于寻找出收藏单中未标记的条目
// @license      MIT
// @match        https://neodb.social/collection/*
// @downloadURL https://update.greasyfork.org/scripts/494732/neodb%20%E6%94%B6%E8%97%8F%E5%8D%95%20%E7%AD%9B%E9%80%89%E3%80%81%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/494732/neodb%20%E6%94%B6%E8%97%8F%E5%8D%95%20%E7%AD%9B%E9%80%89%E3%80%81%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  console.log("hello world");
  const grid_path = ".entity-list";
  const list_path = ".item-list";
  const item_path = ".item-card";
  let grid = document.querySelector(grid_path);
  console.log(grid);
  let observer = new MutationObserver(function(mutationsList, observer2) {
    console.log("节点已加载");
    observer2.disconnect();
    let list = document.querySelector(list_path);
    if (list) {
      let listItems = list.querySelectorAll(item_path);
      var selectAllCheckbox = document.createElement("input");
      selectAllCheckbox.type = "checkbox";
      selectAllCheckbox.addEventListener("change", function() {
        listItems.forEach(function(item, index) {
          var checkbox = item.querySelector('input[type="checkbox"]');
          checkbox.checked = selectAllCheckbox.checked;
          if (checkbox.checked) {
            console.log("Checkbox " + (index + 1) + " is checked.");
          }
        });
      });
      list.parentNode.insertBefore(selectAllCheckbox, list);
      listItems.forEach(function(item, index) {
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        item.insertBefore(checkbox, item.firstChild);
        checkbox.addEventListener("change", function() {
          var allChecked = true;
          listItems.forEach(function(checkbox2) {
            if (!checkbox2.checked) {
              allChecked = false;
            }
          });
          selectAllCheckbox.checked = allChecked;
          console.log("Checkbox " + (index + 1) + " is " + (checkbox.checked ? "checked" : "unchecked") + ".");
        });
      });
    }
    add_button(list);
    add_button_sort(list, "year");
    add_button_sort(list, "vote");
    add_button_sort(list, "rate");
  });
  observer.observe(grid, { childList: true });
  function get_item_info(item) {
    let activated = item.querySelector("span > span > a").classList.contains("activated");
    let year = item.querySelector("div > div:nth-child(2) > hgroup > h5 > small").textContent.split("\n")[1].trim().slice(1, -1);
    let vote = item.querySelector("div > div:nth-child(2) > div > div.brief > div > span.solo-hidden > small").textContent.slice(1, -4);
    let rate = item.querySelector("div > div:nth-child(2) > div > div.brief > div > span.solo-hidden").textContent.split(" ")[0];
    return {
      activated,
      year: parseInt(year),
      vote: parseInt(vote),
      rate: parseFloat(rate)
    };
  }
  function add_button(list) {
    let div = document.createElement("div");
    let label = document.createElement("label");
    let btn = document.createElement("button");
    btn.innerHTML = "全部";
    let btn_act = document.createElement("button");
    btn_act.innerHTML = "标记";
    let btn_un = document.createElement("button");
    btn_un.innerHTML = "未标记";
    btn.onclick = function() {
      let i = 0;
      list.querySelectorAll(item_path).forEach(
        (item) => {
          item.style.display = "block";
          i++;
        }
      );
      label.innerHTML = i;
    };
    btn_un.onclick = function() {
      let i = 0;
      list.querySelectorAll(item_path).forEach(
        (item) => {
          let { activated } = get_item_info(item);
          if (activated) {
            item.style.display = "none";
          } else {
            item.style.display = "block";
            i++;
          }
        }
      );
      label.innerHTML = i;
    };
    btn_act.onclick = function() {
      let i = 0;
      list.querySelectorAll(item_path).forEach(
        (item) => {
          let { activated } = get_item_info(item);
          if (activated) {
            item.style.display = "block";
            i++;
          } else {
            item.style.display = "none";
          }
        }
      );
      label.innerHTML = i;
    };
    div.append(label, btn, btn_act, btn_un);
    list.parentNode.insertBefore(div, list);
  }
  function add_button_sort(list, key) {
    let btn_sort = document.createElement("label");
    let btn_sort_asc = document.createElement("button");
    let btn_sort_desc = document.createElement("button");
    btn_sort.innerHTML = key;
    btn_sort_asc.innerHTML = "▲∆";
    btn_sort_desc.innerHTML = "▼∇";
    btn_sort_asc.onclick = function() {
      let listItems = list.querySelectorAll(item_path);
      reorderItems(list, listItems, key, 1);
    };
    btn_sort_desc.onclick = function() {
      let listItems = list.querySelectorAll(item_path);
      reorderItems(list, listItems, key, -1);
    };
    btn_sort.append(btn_sort_asc, btn_sort_desc);
    list.parentNode.insertBefore(btn_sort, list);
  }
  function reorderItems(container, listItems, key, type) {
    var items = Array.from(listItems);
    items.sort(function(a, b) {
      let orderA = get_item_info(a);
      var orderB = get_item_info(b);
      return (orderA[key] - orderB[key]) * type;
    });
    container.innerHTML = "";
    items.forEach(function(item) {
      container.appendChild(item);
    });
  }

})();