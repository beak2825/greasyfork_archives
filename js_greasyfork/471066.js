// ==UserScript==
// @name         FanzaFilterUtil
// @description  filtering util on Fanza doujin
// @author       RamisAmuki
// @license      MIT
// ==/UserScript==

// ignore list
const is_bookmark_page = location.pathname === "/dc/doujin/-/bookmark/";
const ignore_querys = [
  "span.u-common__ico--basketDone",
  "span.listPurchased__btn",
];
const ignore_genres_exp = /ボイス|AI|動画/;
const ignore_authors_exp = new RegExp(
  [
    "TGA",
    "聖華快楽書店",
    "ブルースカイ",
    "産婆",
    "マサヂロー",
    "私立 七つ星中",
    "100日後に絵が上手",
    "デジタルワイフPro",
    "ブリーフアワー",
    "なでしこさん",
    "塩屋",
    "アオキアカ",
    "アオイ",
    "ルーマニー",
    "クリームソーダ",
    "あいどるたいむ",
    "魔の王野口営業二課",
    "たまねぎ",
    "勇者チキン",
    "ラビットバナナ",
    "AgeRatum",
    "光沢3Dっ娘クラブ",
    "ハードコア001",
    "鳥居座",
    "サンダー・マテリアル",
    "ハガバラッド",
    "うったけ",
    "ライジングフォース",
    "狼中年",
    "窪リオンの部屋",
  ].join("|")
);
const ignore_titles_exp = new RegExp(
  [
    "体験版",
    "無料版",
    "ぼうけんのしょ",
    "君との夏休み〜",
    "催●カノジョ",
    "巨乳地味子はその",
    "つむぎがドS男に調教されてた。",
    "童貞処女卒業式",
  ].join("|")
);

// query
const querys = !is_bookmark_page
  ? {
      lists: "ul.fn-productList > li.productList__item",
      genre: "div.c_icon_genre",
      author: "div.tileListTtl__txt--author",
      title: "div.tileListTtl__txt > a",
      rate: "span.c_icon_priceStatus",
      price: "p.c_txt_price",
      button_parent: "div.pageNation__item",
    }
  : {
      lists: "ul.basket-list-tile > li.basket-listItem-tile",
      genre: "span.c_icon_genre",
      author: "p.basket-circle-tile",
      title: "b.basket-name-tile",
      rate: "span.c_icon_priceStatus",
      price: "p.c_txt_price",
      button_parent: "div.basket-btnAreaCol1",
    };

const IGNORE_TITLE_LOCALSTORAGE_KEY = "ignore_titles";
const ignore_local_storage_titles_exp = new RegExp(
  localStorage.getItem(IGNORE_TITLE_LOCALSTORAGE_KEY) === null
    ? ""
    : `^(${localStorage.getItem(IGNORE_TITLE_LOCALSTORAGE_KEY)})$`
);

const checker = (liqs) => {
  const auhtor = liqs(querys.author).innerText.trim();
  const title = liqs(querys.title).innerText.trim();
  if (liqs(querys.rate) === null) return true;
  // checking
  return [
    check_rate_price(liqs, querys),
    ignore_querys.some((query) => liqs(query) !== null),
    ignore_genres_exp.test(liqs(querys.genre).innerText),
    checkboxEnable("author") ? ignore_authors_exp.test(auhtor) : false,
    ignore_titles_exp.test(title),
    ignore_local_storage_titles_exp.test(title),
  ].some((b) => b);
};

const add_ignore_title = (title) => {
  const pre_exp = localStorage.getItem(IGNORE_TITLE_LOCALSTORAGE_KEY);
  const new_exp = pre_exp === null ? title : title + "|" + pre_exp;
  localStorage.setItem(IGNORE_TITLE_LOCALSTORAGE_KEY, new_exp);
};

const add_ignore_title_button = (card) => {
  var parent = card.querySelector(querys.title).parentElement;
  parent.style.display = "flex";
  parent.style.justifyContent = "space-between";
  var button = document.createElement("button");
  button.onclick = () => {
    title = parent.querySelector("a").innerText.trim();
    if (window.confirm(`次のタイトルを除外リストに登録しますか？\n${title}`))
      add_ignore_title(title);
  };
  button.innerHTML = "+";
  button.style.width = button.style.height = "16px";
  button.style.lineHeight = "0";
  button.style.padding = "0";
  button.style.fontSize = "16px";
  parent.appendChild(button);
};
