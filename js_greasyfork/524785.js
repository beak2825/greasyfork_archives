// ==UserScript==
// @name                Xbox Store Price & Deals Filter
// @name:bg             Филтър за цени и сделки в Xbox Store
// @name:cs             Filtr cen a nabídek pro Xbox Store
// @name:da             Pris- og tilbudsfilter til Xbox Store
// @name:de             Preis- und Angebotsfilter für Xbox Store
// @name:el             Φίλτρο τιμών και προσφορών για το Xbox Store
// @name:en             Xbox Store Price & Deals Filter
// @name:eo             Prezo kaj Ofertoj Filtrilo por Xbox Store
// @name:es             Filtros de Precio y Ofertas para Xbox Store
// @name:es-la          Filtros de Precio y Ofertas para Xbox Store
// @name:es-419         Filtros de Precio y Ofertas para Xbox Store
// @name:fi             Xbox Store Hinta- ja Tarjoussuodatin
// @name:fr             Filtres de Prix et Offres pour Xbox Store
// @name:fr-CA          Filtres de Prix et Offres pour Xbox Store
// @name:he             מסנן מחירים ומבצעים לחנות Xbox
// @name:hr             Filter cijena i ponuda za Xbox Store
// @name:hu             Ár- és ajánlatszűrő az Xbox Store-hoz
// @name:id             Filter Harga & Penawaran Xbox Store
// @name:it             Filtri Prezzi e Offerte per Xbox Store
// @name:ja             Xboxストアの価格とお得情報フィルター
// @name:ka             Xbox მაღაზიის ფასებისა და შეთავაზებების ფილტრი
// @name:ko             Xbox 스토어 가격 및 거래 필터
// @name:nb             Pris- og tilbudsfilter for Xbox Store
// @name:nl             Prijs- en Aanbiedingsfilter voor Xbox Store
// @name:pl             Filtr cen i ofert dla Xbox Store
// @name:pt-BR          Filtro de Preços e Ofertas da Xbox Store
// @name:ro             Filtru de Prețuri și Oferte pentru Xbox Store
// @name:sv             Pris- och erbjudandefilter för Xbox Store
// @name:th             ตัวกรองราคาและข้อเสนอของ Xbox Store
// @name:tr             Xbox Store Fiyat ve Teklif Filtresi
// @name:ug             Xbox Store باھاسى ۋە تەكلىپ سۈزگۈچ
// @name:uk             Фільтр цін та пропозицій для Xbox Store
// @name:vi             Bộ lọc Giá & Ưu đãi của Xbox Store
// @name:zh-TW          Xbox 商店價格和優惠篩選器
// @namespace           https://jlcareglio.github.io/
// @version             1.2.1
// @description         Add price range filters and deal filters to Xbox store. Filter by Game Pass discounts, specific discount percentages, and price ranges.
// @description:bg      Добавете филтри за ценови диапазон и сделки в магазина на Xbox. Филтрирайте по отстъпки за Game Pass, конкретни проценти на отстъпка и ценови диапазони.
// @description:cs      Přidejte do obchodu Xbox filtry cenového rozpětí a nabídek. Filtrování podle slev Game Pass, konkrétních procent slev a cenových rozpětí.
// @description:da      Tilføj prisintervalfiltre og tilbudsfiltre til Xbox Store. Filtrer efter Game Pass-rabatter, specifikke rabatprocenter og prisintervaller.
// @description:de      Fügt Preisbereich- und Angebotsfilter zum Xbox-Store hinzu. Filtert nach Game Pass-Rabatten, spezifischen Rabattprozenten und Preisbereichen.
// @description:el      Προσθέστε φίλτρα εύρους τιμών και φίλτρα προσφορών στο κατάστημα Xbox. Φιλτράρετε κατά εκπτώσεις Game Pass, συγκεκριμένα ποσοστά εκπτώσεων και εύρη τιμών.
// @description:en      Add price range filters and deal filters to Xbox store. Filter by Game Pass discounts, specific discount percentages, and price ranges.
// @description:eo      Aldonu prezo-gamajn filtrilojn kaj ofertajn filtrilojn al Xbox Store. Filtru laŭ Game Pass-rabatoj, specifaj rabatprocentoj kaj prezogamoj.
// @description:es      Agrega filtros de rango de precios y ofertas a la tienda Xbox. Filtra por descuentos de Game Pass, porcentajes específicos de descuento y rangos de precios.
// @description:es-la   Agrega filtros de rango de precios y ofertas a la tienda Xbox. Filtra por descuentos de Game Pass, porcentajes específicos de descuento y rangos de precios.
// @description:es-419  Agrega filtros de rango de precios y ofertas a la tienda Xbox. Filtra por descuentos de Game Pass, porcentajes específicos de descuento y rangos de precios.
// @description:fi      Lisää hintaluokkasuodattimet ja tarjousten suodattimet Xbox-kauppaan. Suodata Game Pass -alennusten, tiettyjen alennusprosenttien ja hintaluokkien mukaan.
// @description:fr      Ajoute des filtres de gamme de prix et d'offres au magasin Xbox. Filtre par réductions Game Pass, pourcentages de réduction spécifiques et gammes de prix.
// @description:fr-CA   Ajoute des filtres de gamme de prix et d'offres au magasin Xbox. Filtre par réductions Game Pass, pourcentages de réduction spécifiques et gammes de prix.
// @description:he      הוסף מסנני טווח מחירים ומסנני מבצעים לחנות Xbox. סנן לפי הנחות Game Pass, אחוזי הנחה ספציפיים וטווחי מחירים.
// @description:hr      Dodajte filtre raspona cijena i ponuda u Xbox Store. Filtrirajte prema popustima za Game Pass, određenim postocima popusta i rasponima cijena.
// @description:hu      Adjon hozzá árkategória-szűrőket és ajánlatszűrőket az Xbox áruházhoz. Szűrés Game Pass kedvezmények, meghatározott kedvezmény százalékok és árkategóriák szerint.
// @description:id      Tambahkan filter rentang harga dan filter penawaran ke toko Xbox. Filter berdasarkan diskon Game Pass, persentase diskon tertentu, dan rentang harga.
// @description:it      Aggiunge filtri per fascia di prezzo e offerte allo store Xbox. Filtra per sconti Game Pass, percentuali di sconto specifiche e fasce di prezzo.
// @description:ja      Xboxストアに価格帯フィルターとお得情報フィルターを追加します。Game Passの割引、特定の割引率、価格帯でフィルタリングします。
// @description:ka      დაამატეთ ფასების დიაპაზონის ფილტრები და შეთავაზებების ფილტრები Xbox მაღაზიაში. გაფილტვრა Game Pass-ის ფასდაკლებებით, კონკრეტული ფასდაკლების პროცენტებით და ფასების დიაპაზონებით.
// @description:ko      Xbox 스토어에 가격 범위 필터 및 거래 필터를 추가합니다. Game Pass 할인, 특정 할인 비율 및 가격 범위별로 필터링합니다.
// @description:nb      Legg til prisområdefiltre og tilbudsfiltre i Xbox Store. Filtrer etter Game Pass-rabatter, spesifikke rabattprosenter og prisområder.
// @description:nl      Voeg prijsklassefilters en aanbiedingenfilters toe aan de Xbox Store. Filter op Game Pass-kortingen, specifieke kortingspercentages en prijsklassen.
// @description:pl      Dodaj filtry zakresu cen i filtry ofert do sklepu Xbox. Filtruj według zniżek Game Pass, określonych procentów zniżek i zakresów cen.
// @description:pt-BR   Adicione filtros de faixa de preço e filtros de ofertas à loja Xbox. Filtre por descontos do Game Pass, percentuais de desconto específicos e faixas de preço.
// @description:ro      Adăugați filtre de interval de preț și filtre de oferte în magazinul Xbox. Filtrați după reducerile Game Pass, procentele specifice de reducere și intervalele de preț.
// @description:sv      Lägg till prisintervallfilter och erbjudandefilter till Xbox Store. Filtrera efter Game Pass-rabatter, specifika rabattprocent och prisintervall.
// @description:th      เพิ่มตัวกรองช่วงราคาและตัวกรองข้อเสนอในร้านค้า Xbox กรองตามส่วนลด Game Pass เปอร์เซ็นต์ส่วนลดเฉพาะ และช่วงราคา
// @description:tr      Xbox mağazasına fiyat aralığı filtreleri ve fırsat filtreleri ekleyin. Game Pass indirimlerine, belirli indirim yüzdelerine ve fiyat aralıklarına göre filtreleyin.
// @description:ug      Xbox Store باھاسى ۋە تەكلىپ سۈزگۈچلىرىنى قوشۇڭ. Game Pass چۈشۈرۈملەر، ئالاھىدە چۈشۈرۈم پىرسەنتلىرى ۋە باھا ئارىلىقى بويىچە سۈزۈڭ.
// @description:uk      Додайте фільтри діапазону цін і фільтри пропозицій до магазину Xbox. Фільтруйте за знижками Game Pass, конкретними відсотками знижок і діапазонами цін.
// @description:vi      Thêm bộ lọc phạm vi giá và bộ lọc ưu đãi vào cửa hàng Xbox. Lọc theo giảm giá Game Pass, tỷ lệ phần trăm giảm giá cụ thể và phạm vi giá.
// @description:zh-TW   為 Xbox 商店添加價格範圍篩選器和優惠篩選器。按 Game Pass 折扣、特定折扣百分比和價格範圍篩選。
// @icon                https://www.google.com/s2/favicons?sz=64&domain=xbox.com
// @grant               none
// @author              Jesús Lautaro Careglio Albornoz
// @source              https://gist.githubusercontent.com/JLCareglio/9cbddea558658f695983a64b9cece6a6/raw/01_Xbox-Store-Price-&-Deals-Filter.user.js
// @match               *://www.xbox.com/*/games/all-games*
// @match               *://www.xbox.com/*/games/browse*
// @match               *://www.xbox.com/*/Search/Result*
// @license             MIT
// @compatible          firefox
// @compatible          chrome
// @compatible          opera
// @compatible          safari
// @compatible          edge
// @compatible          brave
// @supportURL          https://gist.github.com/JLCareglio/9cbddea558658f695983a64b9cece6a6/
// @downloadURL https://update.greasyfork.org/scripts/524785/Xbox%20Store%20Price%20%20Deals%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/524785/Xbox%20Store%20Price%20%20Deals%20Filter.meta.js
// ==/UserScript==

// MARK: CONSTANTS
const SELECTORS = {
  BUTTON_APPLY_FILTERS: "ApplyFiltersButton-module__applyButton___faTvE",
  BUTTON_SHOW_FILTERS: "SortAndFilters-module__button___OeFeU",
  DISCOUNT_TAG: "ProductCard-module__discountTag___OjGFy",
  FILTER_LIST: "SortAndFilters-module__filterList___T81LH",
  FINAL_PRICE: "ProductCard-module__price___cs1xr",
  GAME_PASS_DISCOUNT: "Price-module__afterPriceTextContainer___r7fdq",
  LOAD_MORE_ROW: "BrowsePage-module__loadMoreRow___sx0qx",
  PRODUCT_CARDS: "ProductCard-module__cardWrapper___6Ls86",
  PRODUCT_NAME: "ProductCard-module__title___nHGIp",
  SVG_ARROW: "SelectionDropdown-module__filterInfoContainer___7ktfT",
  XBOX_SPINNER_FILTER: "XboxSpinner-module__xenonFilter___lbfRN",
};
const svgExpanded = `<svg width="1em" height="1em" viewBox="0 0 32 32" aria-hidden="true" class="SelectionDropdown-module__chevronIcon___Z81Q8" style="transform: rotate(180deg);"><path d="M1.132 10.277a1.125 1.125 0 011.493-.088l.098.088 13.381 13.38 13.349-13.349a1.125 1.125 0 011.492-.087l.099.087c.408.408.437 1.051.087 1.493l-.087.098-14.145 14.145a1.125 1.125 0 01-1.493.087l-.098-.087L1.132 11.868a1.125 1.125 0 010-1.591z" fill-rule="evenodd"></path></svg>`;
const svgCollapsed = `<svg width="1em" height="1em" viewBox="0 0 32 32" aria-hidden="true" class="SelectionDropdown-module__chevronIcon___Z81Q8"><path d="M1.132 10.277a1.125 1.125 0 011.493-.088l.098.088 13.381 13.38 13.349-13.349a1.125 1.125 0 011.492-.087l.099.087c.408.408.437 1.051.087 1.493l-.087.098-14.145 14.145a1.125 1.125 0 01-1.493.087l-.098-.087L1.132 11.868a1.125 1.125 0 010-1.591z" fill-rule="evenodd"></path></svg>`;

// MARK: DOM HELPER
const DOMHelper = {
  waitForElement(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    });
  },
};

// MARK: FILTER CREATOR
const FilterCreator = {
  createFilter(id, title, options, additionalContent = "") {
    const li = document.createElement("li");
    li.className = "SortAndFilters-module__li___aV+Oo";

    li.innerHTML = `
      <div class="SelectionDropdown-module__container___XzkIx" id="${id}">
        <button class="SelectionDropdown-module__titleContainer___YyoD0" aria-expanded="false">
          <span class="typography-module__xdsSubTitle2___6d6Da SelectionDropdown-module__titleText___PN6s9">${title}</span>
          <div class="${SELECTORS.SVG_ARROW}">
            ${svgCollapsed}
          </div>
        </button>
        <div style="max-height: 20rem; overflow-y: auto" class="hidden" hidden>
          <ul class="Selections-module__options___I24e7" role="listbox">
            ${options
              .map(
                (opt, index) => `
              <li>
                <button class="Selections-module__selectionContainer___m2xzM" 
                        id="${opt.id}" 
                        role="${opt.type || "checkbox"}" 
                        aria-selected="${
                          opt.defaultSelected ? "true" : "false"
                        }" 
                        aria-checked="${opt.defaultSelected ? "true" : "false"}"
                        aria-label="${opt.label.replace(/<[^>]*>/g, "")}, ${
                  index + 1
                } de ${options.length}">
                  <label class="Selections-module__icon___IBPqb">
                    <input type="${opt.type || "checkbox"}" 
                           id="${opt.id}_${opt.type || "checkbox"}" 
                           name="${opt.group || opt.id}" 
                           value="${opt.id}" 
                           ${opt.defaultSelected ? "checked" : ""}>
                    <span class="typography-module__xdsSubTitle2___6d6Da Selections-module__label___CpN0F Selections-module__textColor___CnMSs">
                      ${opt.label}
                    </span>
                  </label>
                </button>
              </li>
            `
              )
              .join("")}
          </ul>
          ${additionalContent}
        </div>
      </div>
    `;

    return li;
  },

  addFilterHandlers(filterElement, filterFn, stateManager) {
    const button = filterElement.querySelector(
      ".SelectionDropdown-module__titleContainer___YyoD0"
    );
    const optionsDiv = filterElement.querySelector("div[style]");
    const options = filterElement.querySelectorAll(
      ".Selections-module__selectionContainer___m2xzM"
    );

    button.addEventListener("click", () => {
      let isExpanded = button.getAttribute("aria-expanded") === "true";
      isExpanded = !isExpanded;
      button.setAttribute("aria-expanded", isExpanded);
      optionsDiv.hidden = !isExpanded;
      optionsDiv.classList.toggle("hidden", !isExpanded);

      const svgContainer = button.querySelector(`.${SELECTORS.SVG_ARROW}`);
      svgContainer.innerHTML = isExpanded ? svgExpanded : svgCollapsed;
    });

    options.forEach((option) => {
      const input = option.querySelector("input");
      if (!input) return;

      const toggleFilter = () => {
        const isSelected = option.getAttribute("aria-selected") === "true";
        const newState = !isSelected;

        if (input.type === "radio") {
          options.forEach((opt) => {
            const otherInput = opt.querySelector('input[type="radio"]');
            if (otherInput && otherInput.name === input.name) {
              opt.setAttribute("aria-selected", "false");
              opt.setAttribute("aria-checked", "false");
              otherInput.checked = false;
            }
          });
        }

        option.setAttribute("aria-selected", newState);
        option.setAttribute("aria-checked", newState);
        input.checked = newState;

        filterFn();
        stateManager.save();
      };

      option.addEventListener("click", (e) => {
        if (e.target !== input) {
          e.preventDefault();
          toggleFilter();
        }
      });

      input.addEventListener("change", () => {
        if (input.type === "radio") {
          options.forEach((opt) => {
            const otherInput = opt.querySelector('input[type="radio"]');
            if (otherInput && otherInput.name === input.name) {
              opt.setAttribute("aria-selected", otherInput.checked);
              opt.setAttribute("aria-checked", otherInput.checked);
            }
          });
        } else {
          option.setAttribute("aria-selected", input.checked);
          option.setAttribute("aria-checked", input.checked);
        }

        filterFn();
        stateManager.save();
      });
    });
  },
};

// MARK: FILTER LOGIC
const FilterLogic = {
  applyAllFilters() {
    const productCards = document.querySelectorAll(
      `.${SELECTORS.PRODUCT_CARDS}`
    );

    const selectedDiscountFilter =
      document.querySelector('input[name="discountGroup"]:checked')?.value ||
      "none";

    const customDiscountPercent = parseInt(
      document.querySelector("#customDiscountPercent")?.value || "0"
    );

    const ignoredEnabled =
      document.querySelector("#ignoredEnabled_checkbox")?.checked || false;
    const ignoredGamesText =
      document.querySelector("#ignoredGames")?.value || "";
    const ignoredGames = ignoredGamesText
      .split(/(?<!\\),/)
      .map((name) => name.replace(/\\,/g, ",").trim().toLowerCase())
      .filter(Boolean);

    productCards.forEach((card) => {
      const productNameElement = card.querySelector(`.${SELECTORS.PRODUCT_NAME}`);
      const productName = productNameElement
        ? productNameElement.textContent.trim().toLowerCase()
        : "";

      if (ignoredEnabled && ignoredGames.includes(productName)) {
        card.parentElement.style.display = "none";
        return;
      }

      const minPrice =
        parseFloat(document.querySelector("#priceMin").value) || 0;
      const maxPrice =
        parseFloat(document.querySelector("#priceMax").value) || Infinity;
      const showFree = document.querySelector("#free_checkbox").checked;
      const showPaid = document.querySelector("#paid_checkbox").checked;
      const showUnpurchasable = document.querySelector(
        "#unpurchasable_checkbox"
      ).checked;

      const priceElement = card.querySelector(`.${SELECTORS.FINAL_PRICE}`);
      let shouldShow = true;

      if (!priceElement) {
        shouldShow = showUnpurchasable;
      } else {
        const priceText = priceElement.innerText;
        const hasNumbers = /\d/.test(priceText);
        const isFree = !hasNumbers;

        if (isFree) {
          shouldShow = showFree;
        } else {
          shouldShow = showPaid;
          if (shouldShow) {
            const priceString = priceText.trim().replace(/[^\d.,]/g, "");
            let price;

            const match = priceString.match(/^(.*?)[\.,](\d{2})$/);
            if (match) {
              const integerPart = match[1].replace(/[.,]/g, "");
              const decimalPart = match[2];
              price = parseFloat(`${integerPart}.${decimalPart}`);
            } else {
              price = parseFloat(priceString.replace(/[.,]/g, ""));
            }
            shouldShow =
              !isNaN(price) &&
              price >= minPrice &&
              (maxPrice === 0 || price <= maxPrice);
          }
        }
      }

      // Verificar descuentos
      if (shouldShow) {
        const discountTag = card.querySelector(`.${SELECTORS.DISCOUNT_TAG}`);
        const hasGamePassDiscount = card.querySelector(
          `.${SELECTORS.GAME_PASS_DISCOUNT}`
        );
        const discountPercentage = discountTag
          ? parseInt(discountTag.innerText.replace(/[^0-9]/g, ""))
          : 0;

        if (selectedDiscountFilter !== "none") {
          switch (selectedDiscountFilter) {
            case "anyDiscount":
              shouldShow = discountTag !== null;
              break;
            case "discount50plus":
              shouldShow = discountPercentage >= 50;
              break;
            case "discount75plus":
              shouldShow = discountPercentage >= 75;
              break;
            case "discountCustom":
              shouldShow = discountPercentage >= customDiscountPercent;
              break;
          }
        }
      }

      card.parentElement.style.display = shouldShow ? "" : "none";
    });
  },
};

// MARK: STATE MANAGER
class FilterStateManager {
  constructor() {
    this.storageKey = "xboxStoreFilterState";
    this.state = this.load();
  }

  save() {
    const currentState = {
      priceMin: document.querySelector("#priceMin")?.value || "",
      priceMax: document.querySelector("#priceMax")?.value || "",
      free: document.querySelector("#free_checkbox")?.checked || false,
      paid: document.querySelector("#paid_checkbox")?.checked || false,
      unpurchasable:
        document.querySelector("#unpurchasable_checkbox")?.checked || false,
      discountGroup:
        document.querySelector('input[name="discountGroup"]:checked')?.value ||
        "none",
      customDiscountPercent:
        document.querySelector("#customDiscountPercent")?.value || "",
      ignoredGames: document.querySelector("#ignoredGames")?.value || "",
      ignoredEnabled:
        document.querySelector("#ignoredEnabled_checkbox")?.checked || false,
    };
    localStorage.setItem(this.storageKey, JSON.stringify(currentState));
    this.state = currentState;
  }

  load() {
    const savedState = localStorage.getItem(this.storageKey);
    if (savedState) {
      return JSON.parse(savedState);
    }
    return {
      priceMin: "",
      priceMax: "",
      free: true,
      paid: true,
      unpurchasable: true,
      discountGroup: "none",
      customDiscountPercent: "",
      ignoredGames: "",
      ignoredEnabled: true,
    };
  }

  apply() {
    if (!this.state) return;

    if (document.querySelector("#priceMin"))
      document.querySelector("#priceMin").value = this.state.priceMin;
    if (document.querySelector("#priceMax"))
      document.querySelector("#priceMax").value = this.state.priceMax;
    if (document.querySelector("#free_checkbox"))
      document.querySelector("#free_checkbox").checked = this.state.free;
    if (document.querySelector("#paid_checkbox"))
      document.querySelector("#paid_checkbox").checked = this.state.paid;
    if (document.querySelector("#unpurchasable_checkbox"))
      document.querySelector("#unpurchasable_checkbox").checked =
        this.state.unpurchasable;
    if (
      this.state.discountGroup !== "none" &&
      document.querySelector(`#${this.state.discountGroup}_radio`)
    ) {
      document.querySelector(
        `#${this.state.discountGroup}_radio`
      ).checked = true;
    }
    if (document.querySelector("#customDiscountPercent"))
      document.querySelector("#customDiscountPercent").value =
        this.state.customDiscountPercent;
    if (document.querySelector("#ignoredGames"))
      document.querySelector("#ignoredGames").value = this.state.ignoredGames;
    if (document.querySelector("#ignoredEnabled_checkbox"))
      document.querySelector("#ignoredEnabled_checkbox").checked =
        this.state.ignoredEnabled;
  }
}

// MARK: MAIN
class XboxStoreFilter {
  constructor() {
    this.isInitialized = false;
    this.stateManager = new FilterStateManager();
    this.lastFilterList = null;
    this.lastProductCount = 0;
  }

  async loadAllProducts(btnLoadAll) {
    let stoppedByUser = false;
    const btnShowFilters = document.querySelector(
      `.${SELECTORS.BUTTON_SHOW_FILTERS}`
    );
    const stopLoadingDiv = createStopLoadingOverlay();
    document.body.appendChild(stopLoadingDiv);
    if (btnShowFilters) {
      btnShowFilters.click();
      const filterList = await DOMHelper.waitForElement(
        `.${SELECTORS.FILTER_LIST}`
      );
      filterList.parentElement.parentElement.parentElement.style.display =
        "none";
      const reachPortal = document.querySelector("body > reach-portal");
      if (reachPortal) reachPortal.style.display = "none";
    }

    const clickLoadMore = async () => {
      const loadMoreRow = document.querySelector(`.${SELECTORS.LOAD_MORE_ROW}`);
      if (stoppedByUser || !loadMoreRow || loadMoreRow.childElementCount <= 1) {
        stopLoadingDiv.remove();
        const btnApplyFilters = document.querySelector(
          `.${SELECTORS.BUTTON_APPLY_FILTERS}`
        );
        if (btnApplyFilters) btnApplyFilters.click();
        if (!stoppedByUser) btnLoadAll?.remove();
        return false;
      }

      const productCount = document.querySelectorAll(
        `.${SELECTORS.PRODUCT_CARDS}`
      ).length;
      stopLoadingDiv.querySelector(
        "#overlay-count"
      ).textContent = `loaded: ${productCount}`;

      loadMoreRow.querySelector("button")?.click();
      return true;
    };

    stopLoadingDiv.addEventListener("click", () => {
      stoppedByUser = true;
      stopLoadingDiv.querySelector(
        "#overlay-text"
      ).textContent = `stopping, please wait...`;
    });

    const waitForSpinner = () => {
      return new Promise((resolve) => {
        const observer = new MutationObserver((mutations, obs) => {
          const spinner = document.querySelector(
            `.${SELECTORS.XBOX_SPINNER_FILTER}`
          );
          if (!spinner) {
            obs.disconnect();
            resolve();
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      });
    };

    while (await clickLoadMore()) await waitForSpinner();

    function createStopLoadingOverlay() {
      const div = document.createElement("div");
      div.style.cssText = `position: fixed;top: 0;left: 0;width: 100vw;height: 100vh;padding: 20px;display: flex;flex-direction: column;justify-content: center;align-items: center;z-index: 9999;cursor: pointer;background: rgba(0, 0, 0, 0.6);box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);backdrop-filter: blur(7px);-webkit-backdrop-filter: blur(7px);`;

      const text = document.createElement("div");
      text.id = "overlay-text";
      text.style.cssText = `color: white;font-size: 24px;margin-bottom: 16px;text-align: center;text-wrap: balance;text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);`;
      text.textContent = `tap to stop auto-loading or wait for it to finish`;

      const counter = document.createElement("div");
      counter.id = "overlay-count";
      counter.style.cssText = `color: white;font-size: 18px;text-align: center;text-wrap: balance;text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);`;
      counter.textContent = "loaded: 0";

      div.appendChild(text);
      div.appendChild(counter);

      return div;
    }
  }

  async initialize() {
    const btnLoadAll = document.createElement("button");
    btnLoadAll.className = `Button-module__buttonBase___olICK Button-module__sizeMedium___T+8s+`;
    btnLoadAll.innerHTML = `<div class="typography-module__xdsButtonText___T7YHc">Load All</div>`;
    btnLoadAll.addEventListener("click", () =>
      this.loadAllProducts(btnLoadAll)
    );

    const loadMoreRow = await DOMHelper.waitForElement(
      `.${SELECTORS.LOAD_MORE_ROW}`
    );
    if (loadMoreRow && loadMoreRow.childElementCount > 1) {
      loadMoreRow.style.height = "3rem";
      loadMoreRow.parentNode.appendChild(btnLoadAll);
    }

    const filterList = await DOMHelper.waitForElement(
      `.${SELECTORS.FILTER_LIST}`
    );
    if (filterList) {
      this.setupFilters(filterList);
      this.setupObservers();
      this.setupEventListeners();
    }
  }

  setupFilters(filterList) {
    const existingPriceFilter = filterList.querySelector("#PriceRange");
    const existingOffersFilter = filterList.querySelector("#Offers");
    const existingIgnoredFilter = filterList.querySelector("#IgnoredGames");
    if (existingPriceFilter) existingPriceFilter.closest("li")?.remove();
    if (existingOffersFilter) existingOffersFilter.closest("li")?.remove();
    if (existingIgnoredFilter) existingIgnoredFilter.closest("li")?.remove();

    const priceFilterFn = () => {
      FilterLogic.applyAllFilters();
      this.stateManager.save();
      return true;
    };

    const offersFilterFn = () => {
      FilterLogic.applyAllFilters();
      this.stateManager.save();
      return true;
    };

    const priceFilter = FilterCreator.createFilter(
      "PriceRange",
      "Price",
      [
        {
          id: "free",
          label: "Show Free",
          defaultSelected: this.stateManager.state.free,
        },
        {
          id: "paid",
          label: "Show Paid",
          defaultSelected: this.stateManager.state.paid,
        },
        {
          id: "unpurchasable",
          label: "Show Unpurchasable",
          defaultSelected: this.stateManager.state.unpurchasable,
        },
      ],
      `
      <div>
        <div style="display: flex; flex-direction: column; align-items: center">
          <span>More than</span>
          <input type="number" id="priceMin" min="0" />
        </div>
        <div style="display: flex; flex-direction: column; align-items: center">
          <span>Less than</span>
          <input type="number" id="priceMax" min="0" />
        </div>
      </div>
      `
    );

    const offersFilter = FilterCreator.createFilter("Offers", "Deals", [
      {
        id: "anyDiscount",
        label: "With discount",
        type: "radio",
        group: "discountGroup",
      },
      {
        id: "discount50plus",
        label: "50% or more",
        type: "radio",
        group: "discountGroup",
      },
      {
        id: "discount75plus",
        label: "75% or more",
        type: "radio",
        group: "discountGroup",
      },
      {
        id: "discountCustom",
        label: `<input type="number" id="customDiscountPercent" min="0" max="100" style="width: 50px;">% or more`,
        type: "radio",
        group: "discountGroup",
      },
    ]);

    filterList.appendChild(priceFilter);
    filterList.appendChild(offersFilter);

    const ignoredGamesFilter = FilterCreator.createFilter(
      "IgnoredGames",
      "Ignored",
      [
        {
          id: "ignoredEnabled",
          label: "Enabled",
          defaultSelected: this.stateManager.state.ignoredEnabled,
        },
      ],
      `
      <div style="padding: 0px 20px;">
        <textarea id="ignoredGames" 
                  style="width: 100%; height: 100px; border: 1px solid #555; border-radius: 4px;"
                  placeholder="Game names separated by commas. Use '\\,' for commas in names."></textarea>
      </div>
      `
    );
    filterList.appendChild(ignoredGamesFilter);

    FilterCreator.addFilterHandlers(
      ignoredGamesFilter,
      priceFilterFn,
      this.stateManager
    );

    FilterCreator.addFilterHandlers(
      priceFilter,
      priceFilterFn,
      this.stateManager
    );
    FilterCreator.addFilterHandlers(
      offersFilter,
      offersFilterFn,
      this.stateManager
    );

    const priceInputs = document.querySelectorAll("#priceMin, #priceMax");
    priceInputs.forEach((input) => {
      input.addEventListener("change", () => {
        FilterLogic.applyAllFilters();
        this.stateManager.save();
      });
    });

    document
      .querySelector("#customDiscountPercent")
      ?.addEventListener("change", (e) => {
        const radio = document.querySelector("#discountCustom_radio");
        if (radio) {
          radio.checked = true;
          radio.dispatchEvent(new Event("change"));
          this.stateManager.save();
        }
      });

    const ignoredGamesTextarea = document.querySelector("#ignoredGames");
    if (ignoredGamesTextarea) {
      const handler = () => {
        FilterLogic.applyAllFilters();
        this.stateManager.save();
      };
      ignoredGamesTextarea.addEventListener("input", handler);
      ignoredGamesTextarea.addEventListener("change", handler);
    }

    this.stateManager.apply();
    FilterLogic.applyAllFilters();
  }

  setupObservers() {
    const filterListObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          const currentFilterList = document.querySelector(
            `.${SELECTORS.FILTER_LIST}`
          );

          if (currentFilterList && currentFilterList !== this.lastFilterList) {
            this.lastFilterList = currentFilterList;
            this.setupFilters(currentFilterList);
            this.isInitialized = true;
          }

          if (!document.querySelector(`.${SELECTORS.FILTER_LIST}`)) {
            this.isInitialized = false;
            this.lastFilterList = null;
          }
        }
      });
    });

    const productCardsObserver = new MutationObserver(() => {
      const currentProductCount = document.querySelectorAll(
        `.${SELECTORS.PRODUCT_CARDS}`
      ).length;
      if (currentProductCount !== this.lastProductCount) {
        this.lastProductCount = currentProductCount;
        FilterLogic.applyAllFilters();
      }
    });

    filterListObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    productCardsObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  setupEventListeners() {
    const applyButton = document.querySelector(
      `.${SELECTORS.BUTTON_APPLY_FILTERS}`
    );
    if (applyButton) {
      applyButton.addEventListener("click", () => {
        FilterLogic.applyAllFilters();
        this.stateManager.save();
      });
    }
  }
}

// MARK: INITIALIZE APP
(async () => {
  const app = new XboxStoreFilter();
  await app.initialize();
})();
