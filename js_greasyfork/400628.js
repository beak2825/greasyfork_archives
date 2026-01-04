// ==UserScript==
// @name         广东开放大学，自动抓题交题
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  try to take over the world!
// @author       You
// @match        http://course.ougd.cn/mod/quiz/view.php*
// @match        http://course.ougd.cn/mod/quiz/review.php*
// @match        http://course.ougd.cn/mod/quiz/attempt.php*
// @match        http://course.ougd.cn/mod/quiz/summary.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400628/%E5%B9%BF%E4%B8%9C%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%8A%93%E9%A2%98%E4%BA%A4%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/400628/%E5%B9%BF%E4%B8%9C%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%8A%93%E9%A2%98%E4%BA%A4%E9%A2%98.meta.js
// ==/UserScript==

/*
 * /mod/quiz/view.php     形考任务详情
 * /mod/quiz/review.php   抓题页面
 * /mod/quiz/attempt.php  做题页面
 * /mod/quiz/summary.php  做题提交页面
 */

function textToFile(fileName, text) {
  if (!fileName || !text) {
    return;
  }
  var URL = window.URL || window.webkitURL || window;
  var textStream = new window.Blob([text]);
  var a = document.createElement("a");
  a.style.display = "none";
  a.href = URL.createObjectURL(textStream);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function getQuery() {
  var query = {};
  window.location.search
    .replace("?", "")
    .split("&")
    .map((item) => {
      var spi = item.split("=");
      query[spi[0]] = spi[1];
    });
  return query;
}

var loc = window.location;
loc.query = getQuery();

function databaseExists(db_name) {
  return new Promise((resolve) => {
    var req = indexedDB.open(db_name);
    var existed = true;
    req.onsuccess = () => {
      req.result.close();
      if (!existed) {
        indexedDB.deleteDatabase(db_name);
      }
      setTimeout(() => {
        resolve(existed);
      }, 1000);
    };
    req.onupgradeneeded = () => {
      existed = false;
      setTimeout(() => {
        resolve(existed);
      }, 1000);
    };
  });
}

function openDB() {
  return new Promise((resolve, reject) => {
    databaseExists("test_db")
      .then((db_exist) => {
        var open_db = window.indexedDB.open("test_db", 1);
        open_db.onerror = () => {
          reject();
          console.log("数据库打开失败");
        };
        open_db.onsuccess = () => {
          if (db_exist) {
            resolve(open_db.result);
          }
          console.log("数据库打开成功");
        };
        open_db.onupgradeneeded = (event) => {
          var db = event.target.result;
          var transaction = event.target.transaction;

          var store = db.createObjectStore("test_table", { keyPath: "id" });
          store.createIndex("id", "id", { unique: false });
          store.createIndex("answer_map", "answer_map", { unique: true });

          transaction.oncomplete = () => {
            if (!db_exist) {
              resolve(db);
            }
          };
        };
      })
      .catch((e) => {
        reject(e);
      });
  });
}

var getStore = (db, table_id) => {
  return new Promise((resolve, reject) => {
    var request = db
      .transaction(["test_table"], "readwrite")
      .objectStore("test_table");

    if (table_id) {
      request = request.get(table_id);
    } else {
      request = request.getAll();
    }

    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result);
      } else {
        resolve(null);
        console.log("未获得数据记录");
      }
    };

    request.onerror = () => {
      reject();
      console.log("事务失败");
    };
  });
};
var setStore = (db, table_id, answer_map, instr) => {
  return new Promise((resolve, reject) => {
    var request = "";

    getStore(db, table_id)
      .then((res) => {
        if (res === null) {
          request = db
            .transaction(["test_table"], "readwrite")
            .objectStore("test_table")
            .add({ id: table_id, answer_map: answer_map, instr: instr });
        } else {
          request = db
            .transaction(["test_table"], "readwrite")
            .objectStore("test_table")
            .put({ id: table_id, answer_map: answer_map, instr: instr });
        }

        request.onsuccess = () => {
          resolve();
          console.log("数据写入成功");
        };
        request.onerror = (error) => {
          reject();
          console.log("数据写入失败");
        };
      })
      .catch(() => {
        reject();
      });
  });
};

var panelDom = (
  ansNum,
  instr,
  timeout,
  catchCb,
  answerCb,
  exportCb,
  importCb
) => {
  var panelBackground = document.createElement("div");
  panelBackground.style.width = "100%";
  panelBackground.style.height = "100%";
  panelBackground.style.position = "fixed";
  panelBackground.style.top = 0;
  panelBackground.style.bottom = 0;
  panelBackground.style.left = 0;
  panelBackground.style.right = 0;
  panelBackground.style.backgroundColor = "rgba(0,0,0,.45)";
  var panel = document.createElement("div");
  panel.style.width = "500px";
  panel.style.height = "300px";
  panel.style.position = "fixed";
  panel.style.top = "50%";
  panel.style.bottom = "50%";
  panel.style.left = "50%";
  panel.style.right = "50%";
  panel.style.marginTop = "-150px";
  panel.style.marginLeft = "-250px";
  panel.style.padding = "20px";
  panel.style.textAlign = "center";
  panel.style.backgroundColor = "white";
  panel.style.borderRadius = "8px";
  panel.style.boxShadow =
    "0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08), 0 9px 28px 8px rgba(0,0,0,.05)";

  var title_text = document.querySelector(".page-header-headings").innerText;
  var titleDom = document.createElement("h3");
  titleDom.innerHTML = "当前课程：" + title_text;

  var answerDom = document.createElement("p");
  answerDom.innerHTML =
    '当前课程已采集题库：<span style="color: red;font-size: 16px">' +
    ansNum +
    "</span>题";

  var descDom = document.createElement("p");
  descDom.innerHTML =
    '你上次的操作指令为<span style="color: red;font-size: 16px">' +
    (instr ? "抓题" : "做题") +
    "</span>，请点击下方按钮进行操作，如果不操作，" +
    timeout +
    "秒后自动进行上一次的操作";

  var btnCatch = document.createElement("button");
  btnCatch.innerHTML = "抓题";
  btnCatch.style.cursor = "pointer";
  btnCatch.onclick = () => {
    clearTimeout(clock);
    catchCb();
  };

  var btnAnswer = document.createElement("button");
  btnAnswer.innerHTML = "做题";
  btnAnswer.style.cursor = "pointer";
  btnAnswer.style.marginLeft = "10px";
  btnAnswer.onclick = () => {
    clearTimeout(clock);
    answerCb();
  };

  var btnStop = document.createElement("button");
  btnStop.innerHTML = "不玩了";
  btnStop.style.cursor = "pointer";
  btnStop.style.marginLeft = "10px";
  btnStop.onclick = () => {
    clearTimeout(clock);
    document.body.removeChild(panelBackground);
  };

  var btnExport = document.createElement("button");
  btnExport.innerHTML = "导出题库";
  btnExport.style.cursor = "pointer";
  btnExport.style.marginLeft = "10px";
  btnExport.onclick = () => {
    clearTimeout(clock);
    exportCb();
  };

  var btnImport = document.createElement("button");
  btnImport.style.cursor = "pointer";
  btnImport.style.marginLeft = "10px";
  btnImport.style.position = "relative";
  var importFileDom = document.createElement("input");
  importFileDom.type = "file";
  importFileDom.accept = ".txt";
  importFileDom.style.position = "absolute";
  importFileDom.style.left = "0";
  importFileDom.style.right = "0";
  importFileDom.style.top = "0";
  importFileDom.style.bottom = "0";
  importFileDom.style.display = "block";
  importFileDom.style.width = "100%";
  importFileDom.style.height = "100%";
  importFileDom.style.opacity = "0";
  importFileDom.style.cursor = "pointer";
  importFileDom.onchange = (event) => {
    var file = event.target.files[0];
    var fr = new window.FileReader();
    fr.readAsText(file);
    fr.onload = () => {
      importCb(fr.result);
    };
  };
  btnImport.append("导入题库");
  btnImport.appendChild(importFileDom);

  var btnsDom = document.createElement("div");
  btnsDom.appendChild(btnCatch);
  btnsDom.appendChild(btnAnswer);
  btnsDom.appendChild(btnStop);
  btnsDom.appendChild(btnExport);
  btnsDom.appendChild(btnImport);

  panel.appendChild(titleDom);
  panel.appendChild(answerDom);
  panel.appendChild(descDom);
  panel.appendChild(btnsDom);
  panelBackground.appendChild(panel);
  document.body.appendChild(panelBackground);

  var clock = setTimeout(() => {
    instr ? catchCb() : answerCb();
  }, timeout * 1000);
};

var catchQuestionFun = (storeMap) => {
  var list = document.querySelectorAll(
    "[id^=q][id*=answer], [id^=q][id*=choice]"
  );

  var listMap = {};

  list.forEach((_) => {
    var nameId = _.name.split("_")[0];
    listMap[nameId] = listMap[nameId] || {};
    listMap[nameId]["ques_ans"] = listMap[nameId]["ques_ans"] || [];

    var dom = _.parentElement.parentElement.parentElement.parentElement.querySelector(
      ".qtext"
    );

    if (!dom) {
      dom = [];
    } else if (dom.querySelectorAll("p").length > 0) {
      dom = dom.querySelectorAll("p");
    } else {
      dom = [dom];
    }

    Array.from(dom)
      .map((item) => item.innerText)
      .map((item) => (item = item.replace(/\n/gi, "")))
      .map((item) => (item = item.replace(/[ | ]/gi, "")))
      .map((item) => (item = item.replace(/A\./, "")))
      .map((item) => (item = item.replace(/B\./, "")))
      .map((item) => (item = item.replace(/C\./, "")))
      .map((item) => (item = item.replace(/D\./, "")))
      .map((item) => (item = item.replace(/E\./, "")))
      .map((item) => (item = item.replace(/F\./, "")))
      .map((item) => (item = item.replace(/G\./, "")))
      .map((item) => (item = item.replace(/a\./, "")))
      .map((item) => (item = item.replace(/b\./, "")))
      .map((item) => (item = item.replace(/c\./, "")))
      .map((item) => (item = item.replace(/d\./, "")))
      .map((item) => (item = item.replace(/e\./, "")))
      .map((item) => (item = item.replace(/f\./, "")))
      .map((item) => (item = item.replace(/g\./, "")))
      .map((item) => (item = item.replace(/[\.|\'|\"]/g, "")))
      .filter((item) => item)
      .forEach((item) => {
        if (!listMap[nameId]["ques_ans"].includes(item)) {
          listMap[nameId]["ques_ans"].push(item);
        }
      });

    if (_.id === _.nextSibling.getAttribute("for")) {
      var text = _.nextSibling.innerText
        .replace(/[ | |\n|\r]/gi, "")
        .replace(/A\./, "")
        .replace(/B\./, "")
        .replace(/C\./, "")
        .replace(/D\./, "")
        .replace(/E\./, "")
        .replace(/F\./, "")
        .replace(/G\./, "")
        .replace(/a\./, "")
        .replace(/b\./, "")
        .replace(/c\./, "")
        .replace(/d\./, "")
        .replace(/e\./, "")
        .replace(/f\./, "")
        .replace(/g\./, "");
      // .map(item => item = item.replace(/[\.|\'|\"]/g, ''))

      listMap[nameId]["ques_ans"].push(text);
    }
  });

  var rightAnsList = Array.from(document.querySelectorAll(".feedback"))
    .map((item) => item.innerText)
    .filter((item) => !item.includes("→"))
    .map((item) => {
      if (
        !item.startsWith("正确的答案是") &&
        item.indexOf("正确的答案是") > 0
      ) {
        item = item.split("正确的答案是")[1];
      }
      if (
        !item.startsWith("正确答案是：") &&
        item.indexOf("正确答案是：") > 0
      ) {
        item = item.split("正确答案是：")[1];
      }
      return item;
    })
    .map((item) => (item = item.replace(/A\./, "")))
    .map((item) => (item = item.replace(/B\./, "")))
    .map((item) => (item = item.replace(/C\./, "")))
    .map((item) => (item = item.replace(/D\./, "")))
    .map((item) => (item = item.replace(/E\./, "")))
    .map((item) => (item = item.replace(/F\./, "")))
    .map((item) => (item = item.replace(/G\./, "")))
    .map((item) => (item = item.replace(/a\./, "")))
    .map((item) => (item = item.replace(/b\./, "")))
    .map((item) => (item = item.replace(/c\./, "")))
    .map((item) => (item = item.replace(/d\./, "")))
    .map((item) => (item = item.replace(/e\./, "")))
    .map((item) => (item = item.replace(/f\./, "")))
    .map((item) => (item = item.replace(/g\./, "")))
    .map((item) => (item = item.replace("你的回答正确", "")))
    .map((item) => (item = item.replace("你的回答不正确", "")))
    .map((item) => (item = item.replace(/\n/gi, "")))
    .map((item) => (item = item.replace(/[ | ]/gi, "")))
    .map((item) => (item = item.replace("正确答案是：", "")))
    .map((item) => (item = item.replace("正确的答案是", "")))
    .map((item) => (item = item.replace("“错”。", "错")))
    .map((item) => (item = item.replace("“对”。", "对")))
    .map((item) => (item = item.replace(/[\.|\'|\"]/g, "")));

  Object.keys(listMap).forEach((key, idx) => {
    if (!rightAnsList[idx]) {
      return;
    }
    listMap[key]["right_ans"] = rightAnsList[idx];
    var match = rightAnsList[idx].match(/,/g);

    if (match && Array.isArray(match) && match.length > 0) {
      listMap[key]["right_ans"] = rightAnsList[idx].split(",");
    }
  });

  var formatMap = storeMap || {};
  Object.keys(listMap).forEach((key) => {
    var q_text =
      (listMap[key] &&
        listMap[key]["ques_ans"] &&
        listMap[key]["ques_ans"][0]) ||
      "";
    var a_text = (listMap[key] && listMap[key].right_ans) || "";
    if (q_text && a_text) {
      formatMap[q_text] = a_text;
    }
  });
  return formatMap;
};

var catchCaseQuestionFun = (storeMap) => {
  var list = document.querySelectorAll('[id^="menuq"]');

  if (!list.length) {
    return storeMap;
  }

  var ansList = document.querySelectorAll(".rightanswer");

  var ansStr = "";

  for (var i = 0; i < ansList.length; i++) {
    if (ansList[i].innerText.indexOf("→ A") !== -1) {
      ansStr = ansList[i].innerText;
    }
  }

  var ansArr = ansStr
    .replace(/→ A/g, "①")
    .replace(/→ B/g, "②")
    .replace(/→ C/g, "③")
    .replace(/→ D/g, "④")
    .replace(/→ E/g, "⑤")
    .replace(/→ F/g, "⑥")
    .replace(/→ G/g, "⑦")
    .replace(/[^①②③④⑤⑥⑦]/g, "")
    .replace(/①/g, "A")
    .replace(/②/g, "B")
    .replace(/③/g, "C")
    .replace(/④/g, "D")
    .replace(/⑤/g, "E")
    .replace(/⑥/g, "F")
    .replace(/⑦/g, "G")
    .split("");

  var listMap = {};

  list.forEach((_, idx) => {
    var qtext = _.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
      .querySelector(".qtext")
      .innerText.replace(/[\n\r  \.\'\"]/g, "");
    var nameId = _.name.split("_")[1];
    listMap[qtext + nameId] = ansArr[idx];
  });

  var formatMap = Object.assign(listMap, storeMap || {});

  return formatMap;
};

var catchCaseQuestionFun2 = (storeMap) => {
  var list = document.querySelectorAll('[id^="menuq"]');

  if (!list.length) {
    return storeMap;
  }

  var ansList = document.querySelectorAll(".rightanswer");

  var ansStrArr = [];

  for (var i = 0; i < ansList.length; i++) {
    if (ansList[i].innerText.indexOf("→") !== -1) {
      ansStrArr.push(ansList[i].innerText);
    }
  }

  var ansArr = [];

  ansStrArr.forEach((ansStr) => {
    var ansArrItem = ansStr
      .replace(/正确答案是：1\./, "①")
      .replace(/, 2\./, "①")
      .replace(/, 3\./, "①")
      .replace(/, 4\./, "①")
      .replace(/, 5\./, "①")
      .replace(/, 6\./, "①")
      .replace(/, 7\./, "①")
      .replace(/, 8\./, "①")
      .replace(/, 9\./, "①")
      .replace(/, 10\./, "①")
      .replace(/, 11\./, "①")
      .replace(/, 12\./, "①")
      .replace(/, 13\./, "①")
      .replace(/, 14\./, "①")
      .replace(/, 15\./, "①")
      .replace(/, 16\./, "①")
      .replace(/, 17\./, "①")
      .replace(/, 18\./, "①")
      .replace(/, 19\./, "①")
      .replace(/, 20\./, "①")
      .split("①")
      .filter((item) => item.includes("→"))
      .map((item) => item.split(" → ")[1]);
    ansArr = ansArr.concat(...ansArrItem);
  });

  var listMap = {};

  list.forEach((_, idx) => {
    var qtextDom = _.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(
      ".qtext"
    );
    var qtext = qtextDom.innerText.replace(/[\n\r  \.\'\"]/g, "");
    var qtextImgs = qtextDom.querySelectorAll("img");
    if (qtextImgs.length > 0) {
      qtextImgs.forEach((img) => {
        var src = img.getAttribute("src").split("/").splice(-2).join("/");
        qtext += src;
      });
    }

    var nameId = _.name.split("_")[1];
    listMap[qtext + nameId] = ansArr[idx];
  });

  var formatMap = Object.assign(listMap, storeMap || {});

  return formatMap;
};

var answerQuestionFun = (storeMap) => {
  storeMap = storeMap || {};

  var list = document.querySelectorAll(
    "[id^=q][id*=answer], [id^=q][id*=choice]"
  );

  var listMap = {};

  list.forEach((_) => {
    var nameId = _.name.split("_")[0];
    listMap[nameId] = listMap[nameId] || {};
    listMap[nameId]["ques_ans"] = listMap[nameId]["ques_ans"] || [];

    var dom = _.parentElement.parentElement.parentElement.parentElement.querySelector(
      ".qtext"
    );

    if (!dom) {
      dom = [];
    } else if (dom.querySelectorAll("p").length > 0) {
      dom = dom.querySelectorAll("p");
    } else {
      dom = [dom];
    }

    Array.from(dom)
      .map((item) => item.innerText)
      .map((item) => (item = item.replace(/\n/gi, "")))
      .map((item) => (item = item.replace(/[ | ]/gi, "")))
      .map((item) => (item = item.replace(/A\./, "")))
      .map((item) => (item = item.replace(/B\./, "")))
      .map((item) => (item = item.replace(/C\./, "")))
      .map((item) => (item = item.replace(/D\./, "")))
      .map((item) => (item = item.replace(/E\./, "")))
      .map((item) => (item = item.replace(/F\./, "")))
      .map((item) => (item = item.replace(/G\./, "")))
      .map((item) => (item = item.replace(/a\./, "")))
      .map((item) => (item = item.replace(/b\./, "")))
      .map((item) => (item = item.replace(/d\./, "")))
      .map((item) => (item = item.replace(/d\./, "")))
      .map((item) => (item = item.replace(/e\./, "")))
      .map((item) => (item = item.replace(/f\./, "")))
      .map((item) => (item = item.replace(/g\./, "")))
      .map((item) => (item = item.replace(/[\.|\'|\"]/g, "")))
      .filter((item) => item)
      .forEach((item) => {
        if (!listMap[nameId]["ques_ans"].includes(item)) {
          listMap[nameId]["ques_ans"].push(item);
        }
      });

    if (_.getAttribute("type") === "text") {
      _.setAttribute("value", storeMap[listMap[nameId]["ques_ans"][0]]);
    } else if (_.id === _.nextSibling.getAttribute("for")) {
      var text = _.nextSibling.innerText
        .replace(/[ | |\n|\r]/gi, "")
        .replace(/A\./, "")
        .replace(/B\./, "")
        .replace(/C\./, "")
        .replace(/D\./, "")
        .replace(/E\./, "")
        .replace(/F\./, "")
        .replace(/G\./, "")
        .replace(/a\./, "")
        .replace(/b\./, "")
        .replace(/c\./, "")
        .replace(/d\./, "")
        .replace(/e\./, "")
        .replace(/f\./, "")
        .replace(/g\./, "");
      // .map(item => item = item.replace(/[\.|\'|\"]/g, ''))

      if (listMap[nameId]["ques_ans"][0] in storeMap) {
        var ansItem = storeMap[listMap[nameId]["ques_ans"][0]];
        if (Array.isArray(ansItem)) {
          if (ansItem.includes(text)) {
            _.setAttribute("checked", "checked");
          }
        } else {
          if (ansItem === text) {
            _.setAttribute("checked", "checked");
          }
        }
      }
    }
  });
};

var answerCaseQuestionFun = (storeMap) => {
  storeMap = storeMap || {};
  var list = document.querySelectorAll('[id^="menuq"]');

  if (!list.length) {
    return;
  }

  list.forEach((_) => {
    _.querySelectorAll("option").forEach((opt) => {
      var qtext = _.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
        .querySelector(".qtext")
        .innerText.replace(/[\n\r  \.\'\"]/g, "");
      var nameId = _.name.split("_")[1];
      opt.innerText === storeMap[qtext + nameId]
        ? opt.setAttribute("selected", "selected")
        : opt.removeAttribute("selected");
    });
  });
};

var answerCaseQuestionFun2 = (storeMap) => {
  storeMap = storeMap || {};
  var list = document.querySelectorAll('[id^="menuq"]');

  if (!list.length) {
    return;
  }

  list.forEach((_) => {
    _.querySelectorAll("option").forEach((opt) => {
      var qtextDom = _.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(
        ".qtext"
      );
      var qtext = qtextDom.innerText.replace(/[\n\r  \.\'\"]/g, "");
      var qtextImgs = qtextDom.querySelectorAll("img");
      if (qtextImgs.length > 0) {
        qtextImgs.forEach((img) => {
          var src = img.getAttribute("src").split("/").splice(-2).join("/");
          qtext += src;
        });
      }

      var nameId = _.name.split("_")[1];
      opt.innerText === storeMap[qtext + nameId]
        ? opt.setAttribute("selected", "selected")
        : opt.removeAttribute("selected");
    });
  });
};

(async function () {
  "use strict";
  var db = await openDB();
  var data = {};

  switch (loc.pathname) {
    case "/mod/quiz/view.php": {
      data = await getStore(db, loc.query.id);
      break;
    }
    case "/mod/quiz/attempt.php":
    case "/mod/quiz/summary.php":
    case "/mod/quiz/review.php": {
      data = await getStore(db, loc.query.cmid);
      break;
    }
    default: {
      break;
    }
  }

  data = data || {};
  data.answer_map = data.answer_map !== undefined ? data.answer_map : {};
  data.instr = data.instr !== undefined ? data.instr : 1;

  if (loc.pathname == "/mod/quiz/view.php") {
    var data_len = Object.keys(data.answer_map).length;
    panelDom(
      data_len,
      data.instr,
      10,
      () => {
        setStore(db, loc.query.id, data.answer_map, 1).then(() => {
          document
            .querySelector("button[type=submit][class*=btn-secondary]")
            .click();
          document.querySelector("#id_submitbutton").click();
        });
      },
      () => {
        setStore(db, loc.query.id, data.answer_map, 0).then(() => {
          document
            .querySelector("button[type=submit][class*=btn-secondary]")
            .click();
          document.querySelector("#id_submitbutton").click();
        });
      },
      () => {
        getStore(db).then((res) => {
          console.log(JSON.stringify(res));
          textToFile("indexDB.txt", JSON.stringify(res));
        });
      },
      (data_string) => {
        var db_data = JSON.parse(data_string);
        var promiseList = [];
        for (var i = 0; i < db_data.length; i++) {
          promiseList.push(
            setStore(
              db,
              db_data[i]["id"],
              db_data[i]["answer_map"],
              db_data[i]["instr"]
            )
          );
        }
        Promise.all(promiseList)
          .then(() => {
            alert("导入数据成功，请刷新页面");
          })
          .catch((e) => {
            alert("导入数据失败，请检查");
          });
      }
    );
  }

  if (loc.pathname == "/mod/quiz/attempt.php") {
    if (data.instr) {
      document.querySelector(".endtestlink").click();
    } else {
      answerQuestionFun(data.answer_map);
      answerCaseQuestionFun(data.answer_map);
      answerCaseQuestionFun2(data.answer_map);
      let btns = document.querySelectorAll("input[type=submit]");
      btns.forEach((btn) => {
        if (btn.value == "下一页" || btn.value == "结束答题…") {
          btn.click();
        }
      });
    }
  }

  if (loc.pathname == "/mod/quiz/summary.php") {
    let btns = document.querySelectorAll(
      "button[type=submit][class*=btn-secondary]"
    );
    btns.forEach((btn) => {
      if (btn.innerText == "提交所有答案并结束") {
        btn.click();
        setTimeout(() => {
          document.querySelector("input[id^=id_yuiconfirmyes]").click();
        }, 11500);
      }
    });
  }

  if (loc.pathname == "/mod/quiz/review.php") {
    if (data.instr) {
      var map = catchQuestionFun(data.answer_map);
      map = catchCaseQuestionFun(map);
      map = catchCaseQuestionFun2(map);
      console.log(map);
      await setStore(db, loc.query.cmid, map, data.instr);
      document.querySelector(".mod_quiz-next-nav").click();
    } else {
      document.querySelector(".mod_quiz-next-nav").click();
    }
  }

  // Your code here...
})();
