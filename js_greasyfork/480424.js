// ==UserScript==
// @name        BulkRepairs
// @version     0.2.3
// @author      Loafoant
// @license     MIT
// @description	Adds UI for sending bulk arts to repair
// @match       https://www.heroeswm.ru/inventory.php*
// @match       https://www.lordswm.com/inventory.php*
// @grant       unsafeWindow
// @run-at      document-end
// @namespace https://greasyfork.org/users/853482
// @downloadURL https://update.greasyfork.org/scripts/480424/BulkRepairs.user.js
// @updateURL https://update.greasyfork.org/scripts/480424/BulkRepairs.meta.js
// ==/UserScript==

let script = document.createElement("script");

const BASE_SCRIPT = `function h(el, attrs = {}, ...children) {
  let element = document.createElement(el);
  Object.entries(attrs).forEach(([key, value]) => {
    element[key] = value;
  });
  if (children.length > 0) {
    element.append(...children);
  }
  return element;
}`;

const MAIN_SCRIPT = `const REPAIR_COSTS = {
  coldring_n: 6400,
  clover_amul: 11000,
  coldamul: 11000,
  wind_helm: 7400,
  wind_armor: 9500,
  wind_boots: 8700,
  lbow: 10100,
  sun_armor: 9500,
  sun_boots: 8700,
  sun_helm: 7400,
  sun_ring: 6400,
  sun_staff: 17600,
  finecl: 10000,
  mirror: 16000,
  cold_sword2014: 17600,
  cold_shieldn: 10400,
  super_dagger: 10400,
  ssword10: 4854,
  dagger_myf: 8626,
  composite_bow: 8246,
  mm_staff: 16986,
  mm_sword: 17195,
  mstaff13: 4797,
  ssword13: 5985,
  bow14: 9946,
  xymhelmet15: 6612,
  myhelmet15: 6583,
  firsword15: 17670,
  ffstaff15: 17679,
  smstaff16: 4883,
  ssword16: 6051,
  dagger16: 9120,
  helmet17: 7239,
  mhelmet17: 7239,
  bow17: 10108,
  sword18: 17755,
  staff18: 17746,
  scroll18: 10307,
  dagger20: 9291,
};

/**
 *
 * @param el {HTMLElement}
 */
function addHints(el) {
  el.addEventListener("mousemove", show_hwm_hint);
  el.addEventListener("touchstart", show_hwm_hint);
  el.addEventListener("mouseout", hide_hwm_hint);
  el.addEventListener("touchend", hide_hwm_hint);
}

let broken_arts = [];
for (let art of arts) {
  if (art.durability1 == 0) {
    let artEl = h("div", {
      innerHTML: art.html,
      className: "inventory_item_div",
    });
    if (REPAIR_COSTS[art.art_id] === undefined) {
      artEl.querySelector(".cre_mon_image1").style.filter =
        "sepia(0.3) grayscale(0.7)";
      artEl.querySelector(".cre_mon_image2").style.filter =
        "sepia(1) grayscale(0.3)";
    } else {
      artEl.addEventListener("click", () => {
        art.bulk_repair_selected = !art.bulk_repair_selected;
        artEl.classList.toggle("lwm_GM_selected_border");
      });
      addHints(artEl.querySelector(".cre_mon_image2"));
    }
    broken_arts.push(artEl);
  }
}

let enterSmithName = h("input", {
  type: "text",
  required: "true",
  name: "nick",
});

let transferBulkIcon = h("img", {
  src: "https://dcdn.lordswm.com/i/inv_im/btn_art_transfer.png",
  className: "show_hint inv_item_select_img",
});
transferBulkIcon.setAttribute("hwm_hint_added", "1");
transferBulkIcon.setAttribute("hint", "Transfer");
addHints(transferBulkIcon);

let transferBulk = h(
  "button",
  { className: "inv_item_select inv_item_select_img", type: "submit" },
  transferBulkIcon
);

transferBulk.style.border = "none";
transferBulk.style.background = "none";

if (broken_arts.length === 0) {
  transferBulk.disabled = "true";
  transferBulk.classList.toggle("inv_menu_but_disabled");
}

let REPAIR_PRICE = 101;

function addBump(event) {
  if (event.target.dataset.mode === "bump") {
    REPAIR_PRICE = REPAIR_PRICE + Number(event.target.dataset.size);
  } else {
    REPAIR_PRICE = Number(event.target.dataset.size);
  }
  document.getElementById("rep_price").value =
    "The repair cost is set to " + REPAIR_PRICE + "%";
}
function createRepairPriceTable() {
  let table = [];
  for (let i = 10; i <= 100; i += 10) {
    let btn = h("button", { textContent: i + "%", type: "button" });
    btn.dataset.mode = "fixed";
    btn.dataset.size = i;
    btn.addEventListener("click", addBump);
    table.push(btn);
  }
  let plusOneBtn = h("button", { textContent: "+" + 1 + "%", type: "button" });
  plusOneBtn.dataset.mode = "bump";
  plusOneBtn.dataset.size = 1;
  plusOneBtn.addEventListener("click", addBump);
  table.push(plusOneBtn);
  let plusTenBtn = h("button", { textContent: "+" + 10 + "%", type: "button" });
  plusTenBtn.dataset.mode = "bump";
  plusTenBtn.dataset.size = 10;
  plusTenBtn.addEventListener("click", addBump);
  table.push(plusTenBtn);
  let resetBtn = h("button", { textContent: "Reset", type: "button" });
  resetBtn.dataset.mode = "fixed";
  resetBtn.dataset.size = 101;
  resetBtn.addEventListener("click", addBump);
  table.push(resetBtn);
  return table;
}

//#region MainContainer

let actions = h(
  "form",
  { className: "filter_tabs_block_outer" },
  h("div", { className: "lwm_GM_smith_name" }, enterSmithName, transferBulk),
  h("div", { className: "separator2" }),
  h("input", {
    id: "rep_price",
    type: "text",
    className: "lwm_GM_repair_price",
    readonly: true,
    value: "The repair cost is set to " + REPAIR_PRICE + "%",
  }),
  h("div", { className: "separator2" }),
  h("div", { className: "lwm_GM_pricing_table" }, ...createRepairPriceTable())
);

actions.addEventListener("submit", async (event) => {
  transferBulk.type = "button";
  event.preventDefault();
  event.stopPropagation();
  let form = new FormData(event.target);
  let selectedArts = arts.filter((_) => _.bulk_repair_selected);
  let toBeFixed =
    selectedArts.length > 0
      ? selectedArts
      : arts.filter(
          (_) => _.durability1 == 0 && REPAIR_COSTS[_.art_id] !== undefined
        );
  for (const artToBeFixed of toBeFixed) {
    let body = new URLSearchParams();
    body.set("nick", form.get("nick"));
    body.set("id", artToBeFixed.id);
    body.set("sendtype", "5");
    body.set("dtime", "0");
    body.set("bcount", "0");
    body.set("art_id", "");
    body.set(
      "rep_price",
      (REPAIR_COSTS[artToBeFixed.art_id] * (REPAIR_PRICE / 100)).toFixed(0)
    );
    body.set("sign", sign);
    await fetch("https://www.lordswm.com/art_transfer.php", {
      method: "POST",
      credentials: "include",
      headers: {
        referer:
          "https://www.lordswm.com/art_transfer.php?id=" + artToBeFixed.id,
        "content-type": "application/x-www-form-urlencoded",
      },
      redirect: "manual",
      body,
    }).catch(() => {});
  }
  window.location.reload();
});

let container = h(
  "div",
  { className: "container_block_right" },
  h(
    "div",
    { className: "container_block" },
    h(
      "div",
      { className: "arts_predmeti" },
      document.createTextNode(
        "Broken Items: " +
          broken_arts.length +
          " / " +
          arts.filter((_) => _.slot >= 0).length
      )
    ),
    h("div", { className: "separator2" }),
    actions,
    h("div", { className: "separator2" }),
    h("div", { className: "inventory_block" }, ...broken_arts)
  )
);

container.style.width = "";
container.style.flex = "1";
container.style.height = "fit-content";

//#endregion MainContainer

//#region DOMChanges

container_inventory.querySelector(".container_block_right").style.width = "";
container_inventory.querySelector(".container_block_right").style.flex = "2";
container_inventory.querySelector(".container_block_right").style.height =
  "fit-content";
container_inventory.appendChild(container);

//#endregion DOMChanges
`;

script.innerHTML = `
${BASE_SCRIPT}
${MAIN_SCRIPT}
`;

let style = document.createElement("style");
style.innerText = `
.lwm_GM_selected_border {
  border: 2px solid green;
}
.lwm_GM_smith_name {
  display: flex;
  align-items: center;
  gap: 0.4em;
}
.lwm_GM_pricing_table {
  width: min-content;
  gap: 0.4em 0.4em;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  place-items: center;
}
.lwm_GM_pricing_table > button {
  padding: 1em;
  width: 70px;
  border: 1px #5d413a solid;
  background: none;
  cursor: pointer;
  font-size: 9pt;
  color: #592c08;
  font-weight: bold;
  text-decoration: underline;
  font-family: verdana, geneva, arial cyr;
}
input.lwm_GM_repair_price {
  width: 300px;
  background: none;
  border: none;
}
`;

document.head.appendChild(style);
document.body.appendChild(script);
