// ==UserScript==
// @name         RamisAmuki-Utils
// @description  RamisAmuki Utils.
// @author       RamisAmuki
// @grant        none
// ==/UserScript==

function check_rate_price(liqs, querys) {
  const li_rate_node = liqs(querys.rate);
  const li_rate = li_rate_node != null ? parseInt(li_rate_node.innerText) : 0;
  const li_price = parseInt(liqs(querys.price).innerText.replace(",", ""));
  const base_rate = Number(localStorage.getItem("rate-input") || 90);
  const base_price = Number(localStorage.getItem("price-input") || 100);
  const result_array = [
    li_rate >= base_rate, // 割引率が基準以上のときTrue
    li_price <= base_price, // 価格が基準以下のときTrue
  ];
  let result;
  if (checkboxEnable("toggle-and-or"))
    result = result_array[0] && result_array[1];
  else result = result_array[0] || result_array[1];
  return !result; // Trueなら表示しないなので、反転させる
}

function disabling(li) {
  li.style.display = "none";
}

function enabling(li) {
  li.style.display = "";
}

function all_enable(querys) {
  document.querySelectorAll(querys.lists).forEach((li) => enabling(li));
}

function filter(checker, querys) {
  document.querySelectorAll(querys.lists).forEach((li) => {
    checker((q) => li.querySelector(q)) ? disabling(li) : enabling(li);
  });
}

function appendButton(
  onclick,
  querys,
  innerHTML = "Filter",
  margin = null,
  float = "right",
  height = "30px",
  color = "#000",
  backgroundColor = "#f6dbae"
) {
  // ボタン要素を作成
  const btn = document.createElement("button");
  const label = document.createElement("label");

  // ボタンを装飾
  btn.innerHTML = innerHTML;
  btn.id = innerHTML + "-btn";
  btn.style.float = float;
  btn.style.height = height;
  btn.style.color = color;
  btn.style.backgroundColor = backgroundColor;
  if (margin != null) btn.style.margin = margin;

  // 実行する関数
  btn.onclick = onclick;

  // ボタンを追加
  document.querySelector(querys.button_parent).appendChild(label);
  label.appendChild(btn);
}

function appendFilterButton(
  checker,
  querys,
  margin = null,
  innerHTML = "Filter",
  float = "right",
  height = "30px",
  color = "#000",
  backgroundColor = "#f6dbae"
) {
  appendButton(
    () => filter(checker, querys),
    querys,
    innerHTML,
    margin,
    float,
    height,
    color,
    backgroundColor
  );
}

function appendRatePriceInput(querys) {
  appendInput(querys, "rate", 99, 0, 90);
  appendInput(querys, "price", null, 1, 100, "100px");
  appendToggleAndOrButton(querys, "false");
}

function appendInput(querys, text, max, min, default_val, width = "55px") {
  const input = document.createElement("input");
  const label = document.createElement("label");

  input.type = "number";
  input.id = text + "-input";
  if (max != null) input.max = max;
  input.min = min;
  input.step = 1;
  input.style.width = width;
  input.value = localStorage.getItem(input.id) || default_val; // nullだった場合、初期値にする
  input.onchange = () => {
    localStorage.setItem(input.id, input.value);
    document.querySelector("#Filter-btn").click();
  };
  label.htmlFor = input.id;
  label.style.fontSize = "13px";
  label.style.maxWidth = "150px";
  label.style.marginLeft = label.style.marginRight = "5px";
  label.innerText = text + " : ";

  document.querySelector(querys.button_parent).appendChild(label);
  label.appendChild(input);
}

function appendToggleButton(querys, text, default_val) {
  const input = document.createElement("input");
  const label = document.createElement("label");

  input.type = "checkbox";
  input.id = text + "-checkbox";
  input.checked = JSON.parse(localStorage.getItem(input.id) || default_val);
  input.onchange = () => {
    localStorage.setItem(input.id, input.checked);
    document.querySelector("#Filter-btn").click();
  };
  label.htmlFor = input.id;
  label.style.fontSize = "13px";
  label.style.maxWidth = "150px";
  label.style.marginLeft = label.style.marginRight = "5px";
  label.innerText = text + " : ";

  document.querySelector(querys.button_parent).appendChild(label);
  label.appendChild(input);
}

function appendToggleAndOrButton(querys, default_val) {
  const label = document.createElement("label");
  const input = document.createElement("input");
  const span = document.createElement("span");

  input.type = "checkbox";
  input.id = "toggle-and-or-checkbox";
  input.className = "switch-input";
  input.style.display = "none";
  input.checked = JSON.parse(localStorage.getItem(input.id) || default_val);
  input.onchange = () => {
    localStorage.setItem(input.id, input.checked);
    document.querySelector("#Filter-btn").click();
  };

  span.className = "switch-label";
  span.style.display = "flex";
  span.style.userSelect = "none";
  span.innerHTML =
    '<span class="switch-text switch-and">AND</span><span class="switch-text switch-or">OR</span>';

  label.style.display = "inline-block";
  label.htmlFor = input.id;

  document.querySelector(querys.button_parent).appendChild(label);
  label.appendChild(input);
  label.appendChild(span);

  const css = `
span.switch-text {
  padding: 0 4px;
  min-height: 20px;
  display: flex;
  align-items: center;
  color: white;
  background-color: rgb(53, 57, 59);
}
.switch-input:checked + .switch-label .switch-and, .switch-input:not(:checked) + .switch-label .switch-or {
  background-color: rgb(10, 106, 182);
}
`;
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
}

function checkboxEnable(text) {
  return JSON.parse(localStorage.getItem(text + "-checkbox"));
}

function waitForElement(selector, callback, intervalMs, timeoutMs) {
  const startTimeInMs = Date.now();
  findLoop();

  function findLoop() {
    if (document.querySelector(selector) != null) {
      callback();
      return;
    } else {
      setTimeout(() => {
        if (timeoutMs && Date.now() - startTimeInMs > timeoutMs) return;
        findLoop();
      }, intervalMs);
    }
  }
}
