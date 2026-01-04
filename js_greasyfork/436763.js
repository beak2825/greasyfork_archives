// ==UserScript==
// @name         玫枫跟打器（小鹤音形提示）
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  给玫枫跟打器添加一个小鹤音形提示
// @author       magicwenli
// @match        https://kylebing.cn/tools/typepad/
// @icon         https://www.google.com/s2/favicons?domain=kylebing.cn
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @connect      *github*
// @downloadURL https://update.greasyfork.org/scripts/436763/%E7%8E%AB%E6%9E%AB%E8%B7%9F%E6%89%93%E5%99%A8%EF%BC%88%E5%B0%8F%E9%B9%A4%E9%9F%B3%E5%BD%A2%E6%8F%90%E7%A4%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/436763/%E7%8E%AB%E6%9E%AB%E8%B7%9F%E6%89%93%E5%99%A8%EF%BC%88%E5%B0%8F%E9%B9%A4%E9%9F%B3%E5%BD%A2%E6%8F%90%E7%A4%BA%EF%BC%89.meta.js
// ==/UserScript==

var xhyx = "";
var max_items = 5;

const getItems = (input) => {
  const data = xhyx[input];
  if (data === "未收录") {
    return [
      {
        title: `${input}：    未收录的字`,
        subtitle: "非《通用规范汉字表》国发〔2013〕23号文规定用字，故未收录",
        arg: input,
      },
    ];
  } else if (data && data.length > 0) {
    return [
      {
        title: data[0],
        arg: input,
      },
      {
        title: `拆　分：     ${data[1]}`,
        arg: input,
      },
      {
        title: `首　末：     ${data[2]}     ${data[3]}`,
        arg: input,
      },
      {
        title: `编　码：     ${data[4]}     ${data[5]}`,
        arg: input,
      },
    ];
  } else {
    return [
      {
        title: "查询错误",
        arg: input,
      },
    ];
  }
};

const modify = (input) => {
  var news = "";
  let index = 0;
  for (let c in input) {
    if (xhyx.hasOwnProperty(input[c])) {
      let data = xhyx[input[c]];
      news =
        news + `${input[c]}[ ${data[2]}${data[4]}\t${data[3]}${data[5]} ]  `;
      if (index % max_items === max_items - 1) {
        news = news + "<br>";
      }
      index += 1;
    }
  }
  return news;
};

window.onload = function () {
  jQuery.ajaxSetup({ async: false });
  jQuery.get(
    "https://raw.githubusercontent.com/liubiantao/alfred-workflow-xhyx/master/xhyx.json",
    (resp) => {
      xhyx = jQuery.parseJSON(resp);
    }
  );

  var elem = `<div class="template"><p class="text"></p></div>`;
  jQuery(".template").after(elem);
  var $after = jQuery(".template").last();

  var txt = jQuery(".template").first().first().text().trim();
  $after.first().html(modify(txt));

  jQuery(".template")
    .first()
    .on("DOMSubtreeModified", function () {
      txt = jQuery(".template").first().first().text().trim();
      $after.first().html(modify(txt));
    });
};
