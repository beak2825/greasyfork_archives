// ==UserScript==
// @name        OMC Profile Rating Icon
// @namespace   
// @version     4.0.16
// @description Add icons to the OnlineMathContest profile page according to ratings, including special gradient styles for 3200+ ratings.
// @author      subaru
// @license     MIT
// @match       https://onlinemathcontest.com/users/*
// @downloadURL https://update.greasyfork.org/scripts/524196/OMC%20Profile%20Rating%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/524196/OMC%20Profile%20Rating%20Icon.meta.js
// ==/UserScript==

const createIconElement = (iconSvg, iconStyle) => {
  const template = document.createElement("template");
  template.innerHTML = iconSvg;
  const iconElement = template.content.firstChild;

  // グラデーションの生成と適用
  if (iconStyle.color && iconStyle.color.includes("linear-gradient")) {
    const gradientId = `gradient-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`; // より一意的なID生成
    const svgNS = "http://www.w3.org/2000/svg";

    // <defs> と <linearGradient> を作成
    const defs = document.createElementNS(svgNS, "defs");
    const gradient = document.createElementNS(svgNS, "linearGradient");
    gradient.setAttribute("id", gradientId);
    gradient.setAttribute("x1", "0%");
    gradient.setAttribute("y1", "0%");
    gradient.setAttribute("x2", "0%");
    gradient.setAttribute("y2", "100%");

    // グラデーションの色を解析して分割
    const gradientColors = iconStyle.color.match(/rgb\(\d+, \d+, \d+\)/g); // CSSからRGBカラーを抽出
    console.log("Parsed Gradient Colors:", gradientColors); // デバッグ用ログ

    if (gradientColors) {
      gradientColors.forEach((color, index) => {
        const stop = document.createElementNS(svgNS, "stop");
        stop.setAttribute("offset", `${(index / (gradientColors.length - 1)) * 100}%`);
        stop.setAttribute("stop-color", color);
        gradient.appendChild(stop);
      });
    }

    defs.appendChild(gradient);
    iconElement.insertBefore(defs, iconElement.firstChild); // <defs> を挿入

    // 塗りつぶしにグラデーションを適用
    const circles = iconElement.querySelectorAll("circle");
    circles.forEach((circle) => circle.setAttribute("fill", `url(#${gradientId})`));

    const paths = iconElement.querySelectorAll("path");
    paths.forEach((path) => path.setAttribute("fill", `url(#${gradientId})`));
  } else if (iconStyle.color) {
    // 単色の場合
    const color = iconStyle.color;
    const circles = iconElement.querySelectorAll("circle");
    circles.forEach((circle) => circle.setAttribute("fill", color));

    const paths = iconElement.querySelectorAll("path");
    paths.forEach((path) => path.setAttribute("fill", color));
  }

  return iconElement;
};


// アイコンSVGを定義
const icons = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" style="fill:currentColor"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g style="fill:currentColor"><path class="b" transform="rotate(-45 8.002 7.996)" d="M7 1.64h2v12.73H7z"/><circle class="b" cx="3.5" cy="3.5" r="3.5"/><circle class="b" cx="12.5" cy="12.5" r="3.5"/></g></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g style="fill:currentColor"><path class="b" d="M8 14.04 1.79 3h12.42L8 14.04ZM5.21 5 8 9.96 10.79 5H5.21Z"/><circle class="b" cx="3.5" cy="4" r="3.5"/><circle class="b" cx="12.5" cy="4" r="3.5"/><circle class="b" cx="8" cy="12" r="3.5"/></g></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g style="fill:currentColor"><path class="b" d="M13.5 13.5h-11v-11h11v11Zm-9-2h7v-7h-7v7Z"/><circle class="b" cx="3.5" cy="3.5" r="3.5"/><circle class="b" cx="3.5" cy="12.5" r="3.5"/><circle class="b" cx="12.5" cy="12.5" r="3.5"/><circle class="b" cx="12.5" cy="3.5" r="3.5"/></g></svg>'
];

// レートに基づいてアイコンを選択
const ratingToRankSvg = (rating) => {
  return icons[rating > 2800 ? 0 : ((rating % 400) / 100) | 0];
};

// 色のルールに基づいてスタイルを取得する関数
const getIconStyle = (rating) => {
  const colorRules = [
    { min: 3600, color: "linear-gradient(to bottom, rgb(255, 150, 0), rgb(255, 220, 70), rgb(255, 150, 0))" }, // 金
    { min: 3200, color: "linear-gradient(to bottom, rgb(110, 110, 110), rgb(200, 200, 200), rgb(110, 110, 110))" }, // 銀
    { min: 2800, color: "#ff0000" },
    { min: 2400, color: "#ff8000" },
    { min: 2000, color: "#c0c000" },
    { min: 1600, color: "#0000ff" },
    { min: 1200, color: "#00c0c0" },
    { min: 800, color: "#008000" },
    { min: 400, color: "#804000" },
    { min: 1, color: "#808080" },
    { min: 0, color: "#000000" }
  ];

  for (let rule of colorRules) {
    if (rating >= rule.min) {
      return rule;
    }
  }
  return colorRules[colorRules.length - 1]; // 最後のルール（最低評価）を適用
};

// プロフィールページにアイコンを挿入
const updateProfile = () => {
  // レートの値を取得
  const ratingElement = document.querySelector("#rating b");
  if (!ratingElement) return;

  const rating = parseInt(ratingElement.innerText.trim(), 10);
  if (isNaN(rating)) return;

  // アイコンを作成
  const iconElement = createIconElement(ratingToRankSvg(rating), getIconStyle(rating));

  // スタイル設定
  iconElement.style.width = "40px";
  iconElement.style.height = "40px";
  iconElement.style.marginRight = "0"; // 余白をなくす

  // rating要素の前にアイコンを挿入
  ratingElement.parentElement.insertBefore(iconElement, ratingElement);

  // 分野別レートにもアイコンを追加
  const rateCells = document.querySelectorAll("td");
  rateCells.forEach((cell) => {
    const ratingInCell = parseInt(cell.innerText.trim(), 10);
    if (!isNaN(ratingInCell)) {
      const fieldIcon = createIconElement(ratingToRankSvg(ratingInCell), getIconStyle(ratingInCell));
      fieldIcon.style.width = "20px"; // サイズを調整
      fieldIcon.style.height = "20px";
      fieldIcon.style.marginRight = "0";

      // アイコンを分野別レートの前に挿入
      cell.insertBefore(fieldIcon, cell.firstChild);
    }
  });
};

// プロフィールページがロードされた時に実行
if (/users\/([^/]+)\/?/.test(document.location.href)) {
  updateProfile();
}
