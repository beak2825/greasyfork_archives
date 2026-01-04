// ==UserScript==
// @name         Grind Sale Items Into Gems
// @namespace    steam
// @version      1.2.3
// @description  Choose how many and what sale items you want to grind into gems in few clicks
// @author       Flo4604, original by Lutymane
// @license MIT
// @match        https://steamcommunity.com/*/*/inventory*
// @match        https://steamcommunity.com/*/*/inventory/
// @icon         https://cdn.steamsets.com/logo.ico
// @source       https://github.com/SteamSets/SteamScripts/raw/main/GrindSaleItemsIntoGems/index.js
// @homepage     https://steamsets.com
// @website      https://steamsets.com
// @downloadURL https://update.greasyfork.org/scripts/470871/Grind%20Sale%20Items%20Into%20Gems.user.js
// @updateURL https://update.greasyfork.org/scripts/470871/Grind%20Sale%20Items%20Into%20Gems.meta.js
// ==/UserScript==

const sales = {
  2017: {
    summer: 639900,
    winter: 762800,
  },
  2018: {
    summer: 876740,
    winter: 991980,
  },
  2019: {
    summer: null,
    winter: 1195670,
  },
  2020: {
    summer: 1343890,
    winter: 1465680,
  },
  2021: {
    summer: 1658760,
    winter: 1797760,
  },
  2022: {
    summer: 2021850,
    winter: 2243720,
  },
  2023: {
    summer: 2459330,
    winter: 2640280,
  },
  2024: {
    summer: 2861690,
    winter: null,
  },
  2025: {
    summer: 3558920,
    winter: null,
  },
};

const timeout = 225; // ms (Changed by Nivq & Flo, works fine for 350k+ inventory)

let assetIDsToGrind = [];
let salesToGrind = [];
let modal = null;

let grinded = 0;
let errored = 0;
let limit = 0;

let startTime = 0;

function msToTimeStr(_t) {
  let ret = "";
  ret = `${_t % 1000} ms`;

  _t = Math.floor(_t / 1000);

  const sec = _t % 60;
  if (sec > 0) {
    ret = `${sec} sec ${ret}`;
  }

  _t = Math.floor(_t / 60);

  const min = _t % 60;

  if (min > 0) {
    ret = `${min} min ${ret}`;
  }

  _t = Math.floor(_t / 60);

  if (_t > 0) {
    ret = `${_t} h ${ret}`;
  }

  return ret;
}

function GrindAssetID(appId, assetId, currentIndex) {
  const formData = {
    sessionid: g_sessionID,
    appid: appId,
    assetid: assetId,
    contextid: 6,
    goo_value_expected: 100,
  };

  $J.post(`${g_strProfileURL}/ajaxgrindintogoo/`, formData)
    .done((data) => {
      if (data.success) {
        grinded += 1;
      } else {
        errored += 1;
      }
    })
    .fail((data) => {
      console.log(data);
      errored += 1;
    })
    .always(() => {
      modal.Dismiss();
      modal = ShowBlockingWaitDialog(
        "Grinding",
        '<div style="display: inline-block;margin-left: 20px;">' +
          `Grinding items: <span style="color:#b698cc;">${errored + grinded}</span>/<span style="color: lightseagreen;">${limit}</span>${
            errored
              ? `<br>Failed: <span style="color:#d25d67;">${errored}</span>`
              : ""
          }</div>`,
      );

      if (grinded + errored == limit) {
        modal.Dismiss();

        const timePassed = msToTimeStr(new Date().getTime() - startTime);

        modal = ShowConfirmDialog(
          "Completed!",
          `Successfully grinded: <span style="color: lightseagreen;">${grinded} item${grinded == 1 ? "" : "s"}</span>
                    <br>Gems earned: <span style="color: lightseagreen;">${grinded * 100} <span style="color:#d25d67;">(+${errored * 100})</span></span>
                    <br>Time passed: <span style="color: lightseagreen;">${timePassed}</span>
                    <br>Percentage of successful requests: <span style="color: lightseagreen;">${+`${Math.round(`${grinded / limit}e+4`)}e-2`}%</span>${
                      errored
                        ? `<br><br><span style="color:#d25d67;">Failed ${errored} request${errored == 1 ? "" : "s"}. Check console log for more info`
                        : ""
                    }`,
          "OK",
          "Close",
          "Made by Luty, modified by Flo4604",
        ).done((btn_type) => {
          if (btn_type == "SECONDARY") {
            location.href = "https://github.com/Flo4604";
          }
        });

        grinded = 0;
        errored = 0;
        assetIDsToGrind = [];
      }
    });
}

let batch = 1;

function FetchAssetIDs(start = 0) {
  modal = ShowBlockingWaitDialog(
    "Processing inventory",
    `Batch: <span style="color:#b698cc;">${batch}</span>`,
  );

  $J.get(`/inventory/${g_steamID}/753/6?count=2000&start_assetid=${start}`)
    .done((inventory) => {
      const assetIds = {};

      inventory.assets.forEach((a) => {
        if (!assetIds[a.classid]) {
          assetIds[a.classid] = [];
        }

        assetIds[a.classid].push(a.assetid);
      });

      inventory.descriptions.forEach((d) => {
        if (!salesToGrind.includes(d.market_fee_app)) {
          return;
        }

        if (!d?.owner_actions?.some((a) => a.name === "Turn into Gems...")) {
          return;
        }

        if (!assetIds[d.classid]) {
          return;
        }

        const allowedItemClasses = [
          "item_class_3", // Backgrounds
          "item_class_4", // Emoticon
        ];

        // check if the tags array has a internal_name that is in the allowedItemClasses array
        if (!d.tags.some((t) => allowedItemClasses.includes(t.internal_name))) {
          delete assetIds[d.classid];
          return;
        }

        assetIds[d.classid].forEach((assetId) => {
          assetIDsToGrind.push({
            assetId,
            appId: d.market_fee_app,
          });
        });

        delete assetIds[d.classid];
      });

      if (inventory.more_items) {
        modal.Dismiss();

        batch += 1;

        FetchAssetIDs(inventory.last_assetid);
      } else {
        batch = 0;

        let modalInput = null;
        modal.Dismiss();
        modal = ShowConfirmDialog(
          "Items fetched",
          `Found <span style="color:#b698cc;">${assetIDsToGrind.length}</span> sale items!` +
            "<br><br>Limit grinding" +
            '<input type="number" id="items_limit" style="margin-left: 20px;"><br><br>',
          assetIDsToGrind.length > 0 ? "Start" : "OK",
          "Exit",
        ).done(() => {
          if (modalInput.val()) {
            limit = parseInt(modalInput.val());

            if (limit > assetIDsToGrind.length) {
              limit = assetIDsToGrind.length;
            }

            if (limit > 0) {
              startTime = new Date().getTime();

              modal.Dismiss();
              modal = ShowBlockingWaitDialog(
                "Grinding",
                '<div style="display: inline-block;margin-left: 20px;">' +
                  `Grinding items: <span style="color:#b698cc;">${errored + grinded}</span>/<span style="color: lightseagreen;">${limit}</span>${
                    errored
                      ? `<br>Failed: <span style="color:#d25d67;">${errored}</span>`
                      : ""
                  }</div>`,
              );
              // weird code
              if (limit !== assetIDsToGrind.length) {
                assetIDsToGrind = assetIDsToGrind.slice(
                  limit,
                  assetIDsToGrind.length,
                );
              }
            }

            // delay each item with the timeout
            assetIDsToGrind.forEach((a, index) => {
              setTimeout(() => {
                GrindAssetID(a.appId, a.assetId, index);
              }, timeout * index);
            });
          }
        });

        modalInput = $J("#items_limit");
        modalInput.val(assetIDsToGrind.length);
      }
    })
    .fail((data) => {
      console.log(data);
      alert("Error loading the inventory!");
    });
}

const buttonIdSelector = "grind_sale";
const buttonHtml = `<div class="btn_darkred_white_innerfade btn_medium" id="${buttonIdSelector}" style="margin-right: 12px;"><span>Grind Sale Items</span></div>`;

let years = "";

Object.keys(sales).forEach((y) => {
  years += `<option>${y}</option>`;
});

years += "<option>All Years & Seasons</option>";

const modalMenu = `
<div>
    <select id="year" class="checkout_content_box gray_bevel dynInput" style="width:130px;height:32px;margin-right: 12px;">
        ${years}
    </select>
    Year
</div>
<div>
    <select id="season" class="checkout_content_box gray_bevel dynInput" style="width:130px;height:32px;margin-right: 12px;">
        <option value="summer">Summer</option>
        <option value="winter">Winter</option>
    </select>
    Season
</div>
`;

$J(() => {
  $J(".inventory_rightnav").prepend(buttonHtml);

  $J(`#${buttonIdSelector}`).click(() => {
    let year = null;
    let season = null;

    modal = ShowConfirmDialog(
      "Select Sale",
      modalMenu,
      "Check Items",
      "Exit",
    ).done(() => {
      if (year.val() === "All Years & Seasons") {
        salesToGrind = Object.values(sales)
          .map((seasons) => Object.values(seasons).map((db) => db))
          .flat(2)
          .flat(1)
          .filter((x) => x !== null && x !== undefined);
      } else {
        const db = sales[year.val()][season.val()];

        if (db === null) {
          ShowAlertDialog(
            "Hold up!",
            "This event didn't have any grindable items!",
          );
          return;
        }

        salesToGrind.push(db);
      }

      assetIDsToGrind = [];

      FetchAssetIDs();
    });

    year = $J("#year");
    season = $J("#season");
  });
});
