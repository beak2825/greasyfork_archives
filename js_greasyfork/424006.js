// ==UserScript==
// @name         Poipiku Remark
// @namespace    https://greasyfork.org/zh-CN/users/8659-fc4soda
// @version      20210329
// @description  给 poipiku 作品添加备注
// @author       fc4soda
// @match        https://poipiku.com/*
// @grant        GM.info
// @grant        GM_info
// @grant        GM.getValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM_setValue
// @grant        GM.deleteValue
// @grant        GM_deleteValue
// @grant        GM.listValues
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @license      GNU General Public License v3.0 or later
// @downloadURL https://update.greasyfork.org/scripts/424006/Poipiku%20Remark.user.js
// @updateURL https://update.greasyfork.org/scripts/424006/Poipiku%20Remark.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

// TODO 用户备注
// TODO 悬浮按钮拖动
// TODO 数据下载

const AddonName = '8659-pr-';
const ICON = {};
const PAGE_TYPE = {
  'USER1': 'USER1', // https://poipiku.com/928521/
  'WORK1': 'WORK1', // https://poipiku.com/IllustViewPcV.jsp?ID=928521&TD=3996609
  'WORK2': 'WORK2', // https://poipiku.com/928521/2382608.html
};

// id:用户id td:作品id
const EditboxClass = AddonName + 'editbox', WorkItemClassUser = 'IllustThumbImg', IdSelector = 'data-' + AddonName + 'id',
  TdSelector = 'data-' + AddonName + 'td', WorkItemClassWork = 'IllustItemThumb',
  StoreKeyWorkGroupAll = AddonName + 'workgroupall', StoreKeyWorkGroup = AddonName + 'workgroup-',
  StoreKeyAll = AddonName + 'all', StoreKeyWork = AddonName + 'work-', EditboxChangeEvent = 'blur', EditboxContentSelector = 'textContent';

(function () {
  'use strict';

  // 判断不同页面使用不同选择器
  var url = window.location.href;
  var pageReturn = checkPage(url);
  if (pageReturn == null) {
    return
  }
  var pageType = pageReturn[0];
  switch (pageType) {
    case PAGE_TYPE.USER1:
      userPageFunc();
      break;
    case PAGE_TYPE.WORK1:
    case PAGE_TYPE.WORK2:
      var id = pageReturn[1], td = pageReturn[2];
      workPageFunc(id, td);
      break;
  }

  var btn = fixedBtn()
  document.body.appendChild(btn);
})();

function workPageFunc(id, td) {
  //console.log("workPageFunc");
  var work = document.getElementsByClassName(WorkItemClassWork);
  for (let item of work) {
    var key = StoreKeyWork + id + '-' + td;
    var oldVal = GM.getValue(key);
    oldVal.then((val) => {
      //console.log("getVal", StoreKeyWork + id + '-' + td, val);
      if (val != null) {
        var oldEditor = document.getElementById(StoreKeyWork + id + '-' + td);
        if (oldEditor != null) {
          oldEditor.textContent = val;
        } else {
          var editboxContainer = newEditbox(StoreKeyWork, id, td);
          editboxContainer.children[0].textContent = val;
          editboxContainer.children[0].addEventListener(EditboxChangeEvent, storeVal);
          item.parentElement.insertBefore(editboxContainer, item);
        }
      }
    });
    var editboxContainer = newEditbox(StoreKeyWork, id, td);
    editboxContainer.children[0].addEventListener(EditboxChangeEvent, storeVal);
    item.parentElement.insertBefore(editboxContainer, item);
  }
}

function userPageFunc() {
  //console.log("userPageFunc");
  var elements = document.getElementsByClassName(WorkItemClassUser);
  for (let item of elements) {
    var href = item.href;
    if (href == null) {
      continue;
    }

    let regex = /(\d+)/g;
    let idtd = href.match(regex);
    var key = StoreKeyWork + idtd[0] + '-' + idtd[1];
    var oldVal = GM.getValue(key);
    oldVal.then((val) => {
      //console.log("getVal", StoreKeyWork + idtd[0] + '-' + idtd[1], val);
      if (val != null) {
        var oldEditor = document.getElementById(StoreKeyWork + idtd[0] + '-' + idtd[1]);
        if (oldEditor != null) {
          oldEditor.textContent = val;
        } else {
          var editboxContainer = newEditbox(StoreKeyWork, idtd[0], idtd[1]);
          editboxContainer.children[0].textContent = val;
          editboxContainer.children[0].addEventListener(EditboxChangeEvent, storeVal);
          item.parentElement.insertBefore(editboxContainer, item.nextSibling);
        }
      }
    });
    var editboxContainer = newEditbox(StoreKeyWork, idtd[0], idtd[1]);
    editboxContainer.children[0].addEventListener(EditboxChangeEvent, storeVal);
    item.parentElement.insertBefore(editboxContainer, item.nextSibling);
  }
}

function newEditbox(key, id, td) {
  let editboxContainer = document.createElement("div");
  editboxContainer.style.boxSizing = 'border-box';
  editboxContainer.style.width = '100%';
  editboxContainer.style.display = 'flex';
  editboxContainer.style.justifyContent = 'center';
  editboxContainer.style.alignItems = 'center';
  let editbox = document.createElement("div");
  editbox.id = key + id + '-' + td;
  editbox.class = EditboxClass;
  editbox.contentEditable = true;
  editbox.style.boxSizing = 'border-box';
  editbox.style.backgroundColor = 'lemonchiffon';
  editbox.style.width = '99%';
  editbox.style.display = 'inline-block';
  editbox.style.border = '1px darkgrey solid';
  editbox.style.margin = '1px';
  editbox.style.wordWarp = 'break-word';
  editbox.style.maxHeight = '2.5rem';
  editbox.style.overflow = 'auto';
  editbox.setAttribute(IdSelector, id);
  editbox.setAttribute(TdSelector, td);
  editboxContainer.appendChild(editbox);
  return editboxContainer
}

function fixedBtn() {
  let d = document.createElement("div");
  d.style.boxSizing = 'border-box';
  d.style.maxWidth = '2rem';
  d.style.maxHeight = '2rem';
  d.style.position = 'fixed';
  d.style.padding = '2px';
  d.style.bottom = '2rem';
  d.style.right = '2rem';
  d.textContent = '备注';
  d.style.cursor = 'pointer';
  d.style.zIndex = 1000;
  d.style.backgroundColor = 'red';
  d.style.opacity = 0.8;
  d.addEventListener('click', listAllData);
  return d;
}

function newScreenDiv() {
  let editbox = document.createElement("div");
  editbox.id = StoreKeyAll;
  editbox.style.boxSizing = 'border-box';
  editbox.style.backgroundColor = 'grey';
  editbox.style.width = '50%';
  editbox.style.border = '1px darkgrey solid';
  editbox.style.margin = '1px';
  editbox.style.wordWarp = 'break-word';
  editbox.style.overflow = 'auto';
  editbox.style.position = 'fixed';
  editbox.style.top = '4rem';
  editbox.style.left = '4rem';
  return editbox
}


function listAllData() {
  var d = document.getElementById(StoreKeyAll);
  //console.log(d)
  if (d != null) {
    console.log(d.style.display)
    if (d.style.display != 'none') {
      d.style.display = 'none';
    } else {
      d.style.display = 'block';
    }
    return
  }
  // 查出存的所有id和td
  let all = GM.getValue(StoreKeyAll);
  all.then((val) => {
    //console.log("getAll", StoreKeyAll, val);
    if (val != null) {
      let allObj = JSON.parse(val)
      let d = newScreenDiv();
      for (let id in allObj) {
        let ul = document.createElement("ul");
        ul.innerHTML = '用户 <a style="color:cyan" target="_blank" href="https://poipiku.com/' + id + '">' + id + '</a>';
        for (let td in allObj[id]) {
          //console.log(id, td)
          let li = document.createElement("li");
          li.innerHTML = '作品 <a style="color:cyan" target="_blank" href="https://poipiku.com/' + id + '/' + td + '.html">' + td + '</a>';
          ul.appendChild(li);
        }
        d.appendChild(ul);
      }
      document.body.appendChild(d);
    } else {
      alert('无备注数据!')
    }
  });

}

function storeVal(event) {
  var element = event.target;
  //console.log(EditboxChangeEvent, element);
  if (element.class == EditboxClass) {
    var id = element.getAttribute(IdSelector);
    var td = element.getAttribute(TdSelector);
    var val = element[EditboxContentSelector];
    var key = StoreKeyWork + id + '-' + td;
    //console.log('set', key, val);
    if (val != null) {
      GM.setValue(key, val);
      let oldAll = GM.getValue(StoreKeyAll);
      oldAll.then((oldVal) => {
        //console.log("getVal", StoreKeyAll, val);
        let now = Date.now();
        var allObj = {};
        if (oldVal != null) {
          allObj = JSON.parse(oldVal);
        }
        let idObj = allObj[id];
        if (idObj == null) {
          idObj = {};
          idObj[td] = { 'ct': now };
        } else {
          let tdObj = idObj[td];
          if (tdObj == null) {
            tdObj = {};
            tdObj.ct = now;
          } else {
            tdObj.ut = now;
          }
          idObj[td] = tdObj;
        }
        allObj[id] = idObj;
        let newVal = JSON.stringify(allObj)
        //console.log('setVal', StoreKeyAll, allObj, newVal)
        GM.setValue(StoreKeyAll, newVal);
      });
    }
  }
}

// 返回数组:[页面类型, id, td]
function checkPage(url) {
  var arr;
  var work1Regex = /poipiku\.com\/IllustViewPcV\.jsp\?ID=(\d+)\&TD=(\d+)$/;
  arr = url.match(work1Regex);
  if (arr != null && arr.length == 3) {
    return [PAGE_TYPE.WORK1, arr[1], arr[2]];
  }

  var work2Regex = /poipiku\.com\/(\d+)\/(\d+)\.html$/;
  arr = url.match(work2Regex);
  if (arr != null && arr.length == 3) {
    return [PAGE_TYPE.WORK2, arr[1], arr[2]];
  }

  var user1Regex = /poipiku\.com\/(\d+)\/?$/;
  arr = url.match(user1Regex);
  if (arr != null && arr.length == 2) {
    return [PAGE_TYPE.USER1, arr[1]];
  }
  return null;
}
