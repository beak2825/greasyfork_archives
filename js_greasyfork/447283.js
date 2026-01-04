// ==UserScript==
// @name        realsspider
// @namespace   Violentmonkey Scripts
// @description auto to down csv
// @match       https://*.ura.gov.sg/*
// @match       https://*.ura.gov.sg/reis/home
// @version     0.0.6
// @author      fangang
// @require     https://unpkg.com/@violentmonkey/dom@1
// @require     https://unpkg.com/@violentmonkey/ui@0.5
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/447283/realsspider.user.js
// @updateURL https://update.greasyfork.org/scripts/447283/realsspider.meta.js
// ==/UserScript==

(function () {
'use strict';

/**
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
function to(promise, errorExt) {
    return promise
        .then(function (data) { return [null, data]; })
        .catch(function (err) {
        if (errorExt) {
            Object.assign(err, errorExt);
        }
        return [err, undefined];
    });
}

(function () {
  // v2.12.5 and newer return an `id` equal to `caption` for compatibility with TM
  //GM_registerMenuCommand("Auto down all Csv", auto)

  GM_registerMenuCommand('Down all Csv', start);
  GM_registerMenuCommand('Down this Page Csv', DownCsv);
})();
let Year = 2022;
let Month = 1;

async function start() {
  // 查询开始日期
  let prefix = "sale";

  if (window.location.href.indexOf('residentialRentalSearch') > -1) {
    prefix = "contract";
  }

  let from = `#${prefix}YearFrom`;
  let to = `#${prefix}YearTo`;
  let fromMth = `#${prefix}MonthFrom`;
  let toMth = `#${prefix}MonthTo`;
  let yearFrom = $(`#${prefix}YearFrom option`);
  $(`#${prefix}MonthFrom option:first`).prop("selected", 'selected');
  $(`#${prefix}MonthTo option:last`).prop("selected", 'selected');

  for (let i = 1; i < yearFrom.length; i++) {
    var year = $(yearFrom[i]).val();
    $(from).val(year);
    $(to).val(year);
    Year = year;

    for (let m = 1; m <= 12; m++) {
      $(fromMth).val(m);
      $(toMth).val(m);
      Month = m;
      await sleep(2000);
      $(".btn.btn-primary[type='submit']").trigger("click"); //$("#submitSearch").trigger("click");

      while ($(".inProgress").length != 0) {
        await sleep(1000);
      }

      await DownCsv();
      console.log(`${year}-${i}`);
    }
  } // 查询结束日期

}

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
} // function DownCsv() {
//     d().then((r) => { })
// }


async function DownCsv() {
  let csvs = $(".downloadCSV");
  let action = $("#resultForm1").attr("action");
  let retryCont = 0;
  let csvCount = csvs.length;

  for (let i = 0; i < csvs.length; i++) {
    const form = $('#resultForm1');
    const page = form.children("input[name=page]").val();
    const gotoPage = form.children("input[name=gotoPage]").val();
    form.children("input[name=gotoPage]").val(csvs[i].getAttribute('data-page-dlPage'));
    form.children("input[name=downloadType]").val(csvs[i].getAttribute('class'));
    const formValue = form.serialize();
    form.children("input[name=page]").val(page);
    form.children("input[name=gotoPage]").val(gotoPage);
    const [err, response] = await to(fetch(action, {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "max-age=0",
        "content-type": "application/x-www-form-urlencoded",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1"
      },
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": formValue,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    }));

    if (response && response.status == 200) {
      await createCsv(response, csvCount, i);
      retryCont = 0;
    }

    if (err != null && retryCont <= 10) {
      i--;
      retryCont++;

      if (retryCont == 10) {
        retryCont = 0;
      }
    }
  }
}

async function createCsv(response, csvCount, item) {
  const blob = await response.blob();
  new Blob([blob], {
    type: 'text/csv'
  });
  const fileNameEncode = response.headers.get('content-disposition').split('filename=')[1]; // 解码

  const fileName = `${Year}-${Month}-${csvCount}-${item + 1}-${decodeURIComponent(fileNameEncode)}`;
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(link.href);
}

}());
