// ==UserScript==
// @name            Steam valute to RUB convertation
// @name:ru         Перевод валюты в рубли в Steam
// @version         1.2.0
// @namespace       https://store.steampowered.com/
// @description     Steam tourists, rejoice!
// @description:ru  Путешественники в Steam, объединяйтесь!
// @author          CJMAXiK
// @license         MIT
// @homepage        https://cjmaxik.com/steam-valute
// @match           https://store.steampowered.com/*
// @match           https://steamcommunity.com/*
// @icon            https://icons.duckduckgo.com/ip3/steampowered.com.ico
// @grant           GM_xmlhttpRequest
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @grant           GM_addStyle
// @connect         cdn.jsdelivr.net
// @tag             productivity
// @downloadURL https://update.greasyfork.org/scripts/521550/%D0%9F%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%20%D0%B2%D0%B0%D0%BB%D1%8E%D1%82%D1%8B%20%D0%B2%20%D1%80%D1%83%D0%B1%D0%BB%D0%B8%20%D0%B2%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/521550/%D0%9F%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%20%D0%B2%D0%B0%D0%BB%D1%8E%D1%82%D1%8B%20%D0%B2%20%D1%80%D1%83%D0%B1%D0%BB%D0%B8%20%D0%B2%20Steam.meta.js
// ==/UserScript==

const signToValute = {
  "₸": "KZT",
  TL: "TRY",
  "€": "EUR",
  "£": "GBP",
  ARS$: "ARS",
  "₴": "UAH",
  $: "USD",
};

// https://github.com/IsThereAnyDeal/AugmentedSteam/blob/develop/src/js/Core/Currencies.ts
const steamCurrencies = [
  { id: 1, abbr: "USD", symbol: "$", hint: "United States Dollars" },
  { id: 2, abbr: "GBP", symbol: "£", hint: "British Pound" },
  { id: 3, abbr: "EUR", symbol: "€", hint: "European Union Euro" },
  { id: 4, abbr: "CHF", symbol: "CHF", hint: "Swiss Francs" },
  { id: 5, abbr: "RUB", symbol: "pуб", hint: "Russian Rouble" },
  { id: 6, abbr: "PLN", symbol: "zł", hint: "Polish Złoty" },
  { id: 7, abbr: "BRL", symbol: "R$", hint: "Brazilian Reals" },
  { id: 8, abbr: "JPY", symbol: "¥", hint: "Japanese Yen" },
  { id: 9, abbr: "NOK", symbol: "kr", hint: "Norwegian Krone" },
  { id: 10, abbr: "IDR", symbol: "Rp", hint: "Indonesian Rupiah" },
  { id: 11, abbr: "MYR", symbol: "RM", hint: "Malaysian Ringgit" },
  { id: 12, abbr: "PHP", symbol: "P", hint: "Philippine Pes" },
  { id: 13, abbr: "SGD", symbol: "S$", hint: "Singapore Dollar" },
  { id: 14, abbr: "THB", symbol: "฿", hint: "Thai Baht" },
  { id: 15, abbr: "VND", symbol: "₫", hint: "Vietnamese Dong" },
  { id: 16, abbr: "KRW", symbol: "₩", hint: "South Korean Won" },
  { id: 17, abbr: "TRY", symbol: "TL", hint: "Turkish Lira" },
  { id: 18, abbr: "UAH", symbol: "₴", hint: "Ukrainian Hryvnia" },
  { id: 19, abbr: "MXN", symbol: "Mex$", hint: "Mexican Peso" },
  { id: 20, abbr: "CAD", symbol: "CDN$", hint: "Canadian Dollars" },
  { id: 21, abbr: "AUD", symbol: "A$", hint: "Australian Dollars" },
  { id: 22, abbr: "NZD", symbol: "NZ$", hint: "New Zealand Dollar" },
  { id: 23, abbr: "CNY", symbol: null, hint: "Chinese Renminbi (yuan)" },
  { id: 24, abbr: "INR", symbol: "₹", hint: "Indian Rupee" },
  { id: 25, abbr: "CLP", symbol: "CLP$", hint: "Chilean Peso" },
  { id: 26, abbr: "PEN", symbol: "S/.", hint: "Peruvian Nuevo Sol" },
  { id: 27, abbr: "COP", symbol: "COL$", hint: "Colombian Peso" },
  { id: 28, abbr: "ZAR", symbol: "R ", hint: "South African Rand" },
  { id: 29, abbr: "HKD", symbol: "HK$", hint: "Hong Kong Dollar" },
  { id: 30, abbr: "TWD", symbol: "NT$", hint: "New Taiwan Dollar" },
  { id: 31, abbr: "SAR", symbol: "SR", hint: "Saudi Riyal" },
  { id: 32, abbr: "AED", symbol: "DH", hint: "United Arab Emirates Dirham" },
  { id: 34, abbr: "ARS", symbol: "ARS$", hint: "Argentine Peso" },
  { id: 35, abbr: "ILS", symbol: "₪", hint: "Israeli New Shekel" },
  { id: 37, abbr: "KZT", symbol: "₸", hint: "Kazakhstani Tenge" },
  { id: 38, abbr: "KWD", symbol: "KD", hint: "Kuwaiti Dinar" },
  { id: 39, abbr: "QAR", symbol: "QR", hint: "Qatari Riyal" },
  { id: 40, abbr: "CRC", symbol: "₡", hint: "Costa Rican Colón" },
  { id: 41, abbr: "UYU", symbol: "$U", hint: "Uruguayan Peso" },
];

const findCurrencyById = (id) =>
  steamCurrencies.find((currency) => currency.id === id);
const findCurrencyByAbbr = (abbr) =>
  steamCurrencies.find((currency) => currency.abbr === abbr);

let valute = null;
let valuteSign = null;
let valuteID = null;

let currency = null;
let rate = null;

const makeRequest = (url) => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url,
      headers: {
        "Content-Type": "application/json",
      },
      onload: function (response) {
        resolve(response.responseText);
      },
      onerror: function (error) {
        reject(error);
      },
    });
  });
};

const updateRates = async () => {
  const randomNumber = Math.random();
  const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/rub.json?${randomNumber}`;
  const data = await makeRequest(url);
  const value = JSON.parse(data);

  // 6-hour timeout for the value
  GM_setValue("timeout_v2", Date.now() + 6 * 60 * 60 * 1000);
  GM_setValue("currency_v2", value);

  console.log("updateCurrency", value);
  return value;
};

const getRates = async () => {
  if (currency) return;

  const timeout = GM_getValue("timeout_v2", null);
  const cache = GM_getValue("currency_v2", null);
  const rateDate = cache ? Date.parse(cache.date) : Date.now();
  console.log("getCurrency CACHE", timeout, cache);

  // No cache OR no timeout OR timeout is after the current date OR rate internal date is after 1 day from now (failsafe)
  if (
    !cache ||
    !timeout ||
    timeout <= Date.now() ||
    rateDate + 24 * 60 * 60 * 1000 <= Date.now()
  ) {
    currency = await updateRates();
    console.log("getCurrency NEW", currency);
    return;
  }

  currency = cache;
  console.log("getCurrency CACHED", currency);
};

const injectPrice = async (element) => {
  const classList = element.classList.value;

  element.classList.add("done");
  if (classList.includes("es-regprice") || classList.includes("es-converted"))
    return; // Augmented Steam fix
  if (!element.parentElement.innerText.includes(valuteSign)) return;
  if (classList.includes("discount_original_price")) return;
  if (classList.includes("done") && element.innerText.includes("₽")) return;

  let inline = false;
  if (
    element.parentElement?.parentElement?.classList.value.includes(
      "item_market_actions"
    )
  )
    inline = true;

  let price;
  if (element.dataset && element.dataset.priceFinal) {
    price = element.dataset.priceFinal / 100;
  } else {
    const removeDiscountedPrice = element.querySelector("span > strike");
    if (removeDiscountedPrice) {
      removeDiscountedPrice.remove();
      element.classList.remove("discounted");
      element.style.color = "#BEEE11";
    }

    let text = element.innerText
      .trim()
      .split(/\r?\n|\r|\n/g)[0]
      .replace(/[^0-9.,-]+/g, "");
    if (valute !== "USD") {
      text = text.replace(".", "").replace(",", ".");
    }
    price = Number(text);
  }

  if (!price) return;

  let convertedPrice = Math.ceil(price / rate) * 100;
  let formattedPrice = null;
  try {
    formattedPrice = GStoreItemData.fnFormatCurrency(convertedPrice, true);
  } catch (e) {
    // Skip
  }

  if (!formattedPrice) {
    try {
      formattedPrice = v_currencyformat(convertedPrice, valute);
    } catch (e) {
      // Skip
    }
  }

  formattedPrice = formattedPrice
    .replace(valuteSign, "")
    .replace(" ", "")
    .replace("USD", "")
    .trim();

  suffix = "";
  if (window.location.href.includes("account/history")) {
    if (element.innerText.includes("Credit")) {
      suffix =
        element.querySelector("div.wth_payment").cloneNode(true).outerHTML ||
        "";
    }
  }

  if (inline) {
    element.innerHTML = `
      ${element.innerHTML}(≈${formattedPrice}&nbsp;₽)${suffix}
    `;
  } else {
    element.innerHTML = `
      <span style="font-size: 11px;">
        ${element.innerText
          .replace(" ", "&nbsp;")
          .replace("ARS$ ", "$")
          .replace("Credit", "")
          .trim()}
      </span>
      <span style="padding-left: 5px;">
        ≈${formattedPrice}&nbsp;₽
      </span>${suffix}
    `;
  }
};

const grabCurrentCurrency = () => {
  if (valute) return;

  let currency = document.querySelector('meta[itemprop="priceCurrency"]');

  if (currency && currency.content) {
    valute = currency.content;
    valuteSign = Object.keys(signToValute).find(
      (key) => signToValute[key] === valute
    );

    return;
  }

  currency = null;
  try {
    // eslint-disable-next-line no-undef
    currency = GStoreItemData.fnFormatCurrency(12345)
      .replace("123,45", "")
      .replace("123.45", "")
      .trim();
    valute = signToValute[currency];
    valuteSign = currency;

    return;
  } catch (e) {
    console.warn(e);
  }

  currency = findCurrencyById(g_rgWalletInfo.wallet_currency);
  if (currency) {
    valute = currency.abbr;
    valuteSign = currency.symbol;
  }

  return;
};

const globalClasses = [
  "#header_wallet_balance",
  "div[class*=StoreSalePriceBox]",
  ".game_purchase_price",
  ".discount_final_price:not(:has(> .your_price_label))",
  ".discount_final_price > div:not([class])",
  ".search_price",
  ".price:not(.spotlight_body):not(.similar_grid_price)",
  ".match_subtitle",
  ".game_area_dlc_price:not(:has(> *))",
  ".savings.bundle_savings",
  ".wallet_column",
  ".wht_total",
  ".normal_price:not(.market_table_value)",
  ".sale_price",
  ".StoreSalePriceWidgetContainer:not(.Discounted) div",
  ".StoreSalePriceWidgetContainer.Discounted div:nth-child(2) > div:nth-child(2)",
  // Market
  "#marketWalletBalanceAmount",
  ".market_commodity_order_summary > span:nth-child(2)",
  ".market_commodity_orders_table tr > td:first-child",
  ".market_listing_price_with_fee",
  ".market_activity_price",
  // Inventory
  ".item_market_actions > div > div:nth-child(2)",
  // eslint-disable-next-line no-return-assign
]
  .map((x) => (x += ":not(.done)"))
  .join(", ");

const observerInject = async () => {
  const prices = document.querySelectorAll(globalClasses);
  if (!prices) return;
  for (const price of prices) await injectPrice(price);
};

const main = async () => {
  "use strict";

  // Updating currency
  await getRates();
  console.log("Current rates", currency);

  // Grabbing
  await grabCurrentCurrency();
  console.log("Current valute", valute);
  console.log("Current valute sign", valuteSign);
  if (valute === "RUB") {
    console.log("Привет, земляк ;)");
    return;
  }
  if (!valute) throw new Error("No valute detected!");

  // Grabbing the rate
  rate = Math.round(currency.rub[valute.toLowerCase()] * 100) / 100;
  console.log("Effective rate", rate);

  if (!currency || !valute || !rate) return;

  // Add styles
  let css = `
    .tab_item_discount { width: 160px !important; } .tab_item_discount .discount_prices { width: 100% !important; } .tab_item_discount .discount_final_price { padding: 0 !important; }
    .home_marketing_message.small .discount_block { height: auto !important; } .discount_block_inline { white-space: nowrap !important; }
    .curator #RecommendationsRows .store_capsule.price_inline .discount_block { min-width: 200px !important }
    .market_listing_their_price { min-width: 130px !important; }
  `;
  GM_addStyle(css);

  // Injecting prices for the first time
  await observerInject();

  // Dynamically inject prices
  const observer = new MutationObserver(async (mutations, _observer) => {
    try {
      await observerInject();

      for (const mutation of mutations) {
        // Checking added elements
        for (const node of mutation.addedNodes) {
          observerInject();
          // if (node.nodeType === Node.TEXT_NODE) {
          //   if (!node.parentElement?.innerText.includes(valuteSign)) continue;
          //   await injectPrice(node.parentElement);
          // }
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });
};

window.onload = main();
