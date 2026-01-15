// ==UserScript==
// @name         E-commerce Panel Helper
// @namespace    http://tampermonkey.net/
// @version      0.86
// @description  Add a movable and dockable modal to e-commerce product editing panel
// @author       Marcin
// @match        https://butosklep.pl/panel/product.php?*
// @match        https://butosklep.iai-shop.com/panel/product.php?*
// @require https://update.greasyfork.org/scripts/511010/1685801/My%20consts.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486005/E-commerce%20Panel%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/486005/E-commerce%20Panel%20Helper.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let messageTimeout;

  const dockedToolbar = document.createElement("div");
  dockedToolbar.id = "customDockedToolbar";
  dockedToolbar.style.cssText = DOCKED_TOOLBAR_CSS;
  dockedToolbar.innerHTML = DOCKED_TOOLBAR_HTML;

  document.body.appendChild(dockedToolbar);

  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = PANEL_STYLESHEET;
  document.head.appendChild(styleSheet);
  /********************************************
                EVENT LISTENERS
********************************************/
  document
    .querySelector(".toolbar-buttons")
    .addEventListener("click", function (event) {
      if (event.target.tagName.toLowerCase() === "a") {
        event.preventDefault();
      }

      console.log("Clicked element:", event.target);

      const mainColorOption = event.target.closest(".main-color-option");
      if (mainColorOption && this.contains(mainColorOption)) {
        handleColorSelection("main", mainColorOption.dataset.color, "249512");
        // console.log(
        //   "Handled main color option:",
        //   mainColorOption.dataset.color
        // );
        return;
      }

      const insoleColorOption = event.target.closest(".insole-color-option");
      if (insoleColorOption && this.contains(insoleColorOption)) {
        handleColorSelection(
          "insole",
          insoleColorOption.dataset.color,
          "232289"
        );
        // console.log(
        //   "Handled insole color option:",
        //   insoleColorOption.dataset.color
        // );
        return;
      }

      const dropaElement = event.target.closest(".dropa");
      if (dropaElement && this.contains(dropaElement)) {
        const targetId = dropaElement.id;

        // console.log("Resolved dropa element:", dropaElement);
        // console.log("Element ID:", targetId);

        switch (targetId) {
          case "btnCopyTable":
            try {
              copyTable();
              showMessage("Tabela została uzupełniona!");
            } catch (error) {
              showMessage("Wystąpił błąd: " + error.message, "error");
              console.error("Error in copyTable:", error);
            }
            break;

          case "btnTableAllegro":
            try {
              processTableAllegro();
              showMessage("Długości wkładek zostały uzupełnione!");
            } catch (error) {
              showMessage("Wystąpił błąd: " + error.message, "error");
              console.error("Error in processTableAllegro:", error);
            }
            break;

          case "btnEanToAllegro":
          case "btnEanToAllegroClothing":
            try {
              eanToAllegro();
              showMessage("EANy zostały uzupełnione!");
            } catch (error) {
              showMessage("Wystąpił błąd: " + error.message, "error");
              console.error("Error in eanToAllegro:", error);
            }
            break;

          case "btnSizesAllegroClothing":
            try {
              setSizesClothing();
              showMessage("Rozmiary zostały uzupełnione");
            } catch (error) {
              showMessage("Wystąpił błąd: " + error.message, "error");
              console.error("Error in setSizesClothing:", error);
            }
            break;

          case "btnProducerToAllegro":
          case "btnProducerToAllegroClothing":
            try {
              producerCodeToAllegro();
              showMessage("Kody producenta zostały uzupełnione");
            } catch (error) {
              showMessage("Wystąpił błąd: " + error.message, "error");
              console.error("Error in producerCodeToAllegro:", error);
            }
            break;

          default:
            console.warn(`Unhandled dropa element ID: ${targetId}`);
        }
        return;
      }

      const customProducerButton = event.target.closest(
        "#customProducerButton, #customProducerButtonClothing"
      );
      if (customProducerButton && this.contains(customProducerButton)) {
        //console.log("Custom Producer Button Clicked:", customProducerButton.id);
        const targetId = customProducerButton.id;
        const inputId =
          targetId === "customProducerButton"
            ? "customProducerInput"
            : "customProducerInputClothing";
        const customProducerInput = document.getElementById(inputId);
        const customProducer = customProducerInput
          ? customProducerInput.value.trim()
          : "";

        try {
          if (customProducer) {
            producerCodeToAllegro(customProducer);
            showMessage("Kody producenta zostały uzupełnione");
            console.log("Producer code set:", customProducer);
          } else {
            showMessage("Wpisz kod producenta", "error");
            console.warn("No producer code entered.");
          }
        } catch (error) {
          showMessage("Wystąpił błąd: " + error.message, "error");
          console.error(
            "Error in producerCodeToAllegro with custom input:",
            error
          );
        }
        return;
      }

      const langDescriptionOption = event.target.closest(
        ".d-bulgarski, .d-czeski, .d-niderlandzki, .d-angielski, .d-estonski, .d-francuski, .d-niemiecki, .d-grecki, .d-wegierski, .d-wloski, .d-lotewski, .d-litewski, .d-rumunski, .d-chorwacki, .d-slowacki, .d-slowenski, .d-hiszpanski, .d-ukrainski, .d-wszystkie"
      );
      if (langDescriptionOption && this.contains(langDescriptionOption)) {
        const isShoe = checkCategory();
        if (langDescriptionOption.classList.contains("d-wszystkie")) {
          setLangDescription(null, true, isShoe);
          //console.log("Handled language description: Wszystkie");
        } else {
          const desc = CONST_VARIABLES.DESCRIPTIONS.find((desc) =>
            langDescriptionOption.classList.contains(desc.className)
          );
          if (desc) {
            setLangDescription(desc.index, false, isShoe);
            //console.log(`Handled language description: ${desc.className}`);
          } else {
            console.warn(
              "No matching description found for class:",
              langDescriptionOption.className
            );
          }
        }
        return;
      }

      const langNameOption = event.target.closest(
        ".bulgarski, .czeski, .niderlandzki, .angielski, .estonski, .francuski, .niemiecki, .grecki, .wegierski, .wloski, .lotewski, .litewski, .rumunski, .chorwacki, .slowacki, .slowenski, .hiszpanski, .ukrainski, .wszystkie"
      );
      if (langNameOption && this.contains(langNameOption)) {
        if (langNameOption.classList.contains("wszystkie")) {
          setLangNames(null, true);
          //console.log("Handled language name: Wszystkie");
        } else {
          const lang = CONST_VARIABLES.LANGUAGES.find((lang) =>
            langNameOption.classList.contains(lang.className)
          );
          if (lang) {
            setLangNames(lang.index);
            //console.log(`Handled language name: ${lang.className}`);
          } else {
            console.warn(
              "No matching language found for class:",
              langNameOption.className
            );
          }
        }
        return;
      }

      console.log("Click not on a relevant button or link.");
    });
  /********************************************
           COLOR ALLEGRO HANDLER AND FUNCTIONS
    ********************************************/
  function handleColorSelection(type, selectedColor, idPrefix) {
    const colorFromSelection = COLORS_ALLEGRO[selectedColor];
    try {
      setColorAllegro(type, colorFromSelection, idPrefix);
      showMessage(
        `${type === "main" ? "Główny" : "Podeszwy"} kolor został uzupełniony!`
      );
    } catch (error) {
      showMessage("Wystąpił błąd: " + error.message, "error");
    }
  }

  function setColorAllegro(type, color, idPrefix) {
    document
      .querySelector("#tr_itemSpecificsMode")
      .lastChild.lastChild.firstChild.click();

    const setColors = (color, node) => {
      const colorSpan = node.querySelector(
        `[id^='td_t_fid_1_${idPrefix}_'] select+span>span>span>span`
      );
      const selectElement = node.querySelector(
        `.auction_additional_param_1_${idPrefix}`
      );

      colorSpan.textContent = color;

      const optionIndex = Array.from(selectElement.options).findIndex(
        (option) => option.text === color
      );
      if (optionIndex !== -1) {
        selectElement.options[optionIndex].selected = true;
      }
    };

    const sizesMainNodes = document.querySelectorAll(
      "[id^='item_specifics']:not([id$='_default'])"
    );
    sizesMainNodes.forEach((node) => setColors(color, node));
  }
  /********************************************

           BRAND ALLEGRO HANDLER AND FUNCTIONS

    ********************************************/
  const getCurrentCategory = () => {
    const categoryElement = document.querySelector(
      "#select2-category-container"
    );
    if (!categoryElement) {
      console.error(
        `Element with selector "${"#select2-category-container"}" not found.`
      );
      return null;
    }
    const categoryTitle = categoryElement.title;
    return categoryTitle;
  };

  const isClothingCategory = (category) => {
    const normalizedCategory = category.toLowerCase();
    const containsClothingTerm = CLOTHING_TERMS.some((term) =>
      normalizedCategory.includes(term.toLowerCase())
    );
    return containsClothingTerm;
  };

  const getSexSelector = (category) => {
    console.log("Kategoria: ", category);
    const lowercasedCategory = category.toLowerCase();

    if (
      lowercasedCategory.includes("damskie") &&
      !isClothingCategory(lowercasedCategory)
    ) {
      return "[id^='td_t_fid_1_248811_']";
    } else if (
      lowercasedCategory.includes("męskie") &&
      !isClothingCategory(lowercasedCategory)
    ) {
      return "[id^='td_t_fid_1_248811_']";
    } else if (
      lowercasedCategory.includes("dziecięce") &&
      !isClothingCategory(lowercasedCategory)
    ) {
      return "[id^='td_t_fid_1_7174_']";
    } else if (
      lowercasedCategory.includes("dziecięce") &&
      isClothingCategory(lowercasedCategory)
    ) {
      return "[id^='td_t_fid_1_7174_']";
    } else {
      return "[id^='td_t_fid_1_3786_']";
    }
  };

  const setBrand = (
    query,
    brandText,
    sexSelector,
    isCustom = false,
    customBrand = ""
  ) => {
    const sizesMainNodes = document.querySelectorAll(
      "[id^='item_specifics']:not([id$='_default'])"
    );
    //console.log("Query: ", query);
    //console.log("BrandText: ", brandText);
    //console.log("SexSelector: ", sexSelector);
    //console.log("isCustom: ", isCustom);
    //console.log("customBrand: ", customBrand);

    sizesMainNodes.forEach((node) => {
      const brandSpan = node.querySelector(
        `${sexSelector} select+span>span>span>span:nth-child(1)`
      );
      if (brandSpan) {
        brandSpan.textContent = brandText;
      } else {
        console.warn(
          `Brand span not found using selector: ${sexSelector} select+span>span>span>span:nth-child(1)`
        );
      }

      const optionElement = node.querySelector(query);
      if (optionElement) {
        const selectElement = node.querySelector(`${sexSelector} select`);
        if (selectElement) {
          selectElement.value = optionElement.value;
          selectElement.dispatchEvent(new Event("change", { bubbles: true }));
        } else {
          console.warn(
            `Select element not found using selector: ${sexSelector} select`
          );
        }
      } else {
        console.warn(`Option element not found using query: ${query}`);
      }

      if (isCustom && customBrand) {
        const inputField = node.querySelector(
          `${sexSelector} input[id^='fg_auction']`
        );
        if (inputField) {
          inputField.value = customBrand;
        } else {
          console.warn(
            `Input field not found using selector: ${sexSelector} input[id^='fg_auction']`
          );
        }
      }
    });
  };

  const processBrandSelection = (brand, brandType) => {
    const category = getCurrentCategory();
    if (!category) return;

    const clothing = isClothingCategory(category);

    const brandMappings = clothing ? BRANDS_ALLEGRO_CLOTHING : BRANDS_ALLEGRO;
    const queries = brandMappings[brandType];
    //console.log("BrandMapping: ", queries);

    if (!queries || !queries.length) {
      showMessage(`Brak zapytań dla typu marki: ${brandType}`, "error");
      return;
    }

    let query;
    if (
      category.toLowerCase().includes("damskie") ||
      category.toLowerCase().includes("męskie")
    ) {
      query = queries[0];
    } else {
      query = queries[1] || queries[0];
    }

    const sexSelector = getSexSelector(category);

    try {
      const isCustom = typeof brand === "string" && brand.trim() !== "";
      setBrand(query, brand, sexSelector, isCustom, isCustom ? brand : "");
      showMessage("Marka została uzupełniona!");
    } catch (error) {
      showMessage("Wystąpił błąd: " + error.message, "error");
    }
  };

  const setupBrandOptionListeners = () => {
    const brandOptions = document.querySelectorAll(".brand-option");
    if (!brandOptions.length) {
      console.warn('No elements found with class ".brand-option".');
    }

    brandOptions.forEach((option) => {
      option.addEventListener("click", (event) => {
        event.preventDefault();
        const brand = event.target.dataset.brand;
        if (!brand) {
          showMessage("Brak danych marki.", "error");
          return;
        }
        const category = getCurrentCategory();
        if (!category) {
          showMessage("Nie można pobrać kategorii.", "error");
          return;
        }

        const isClothing = isClothingCategory(category);
        //console.log("Is Clothing:", isClothing);
        const brandMappings = isClothing
          ? BRANDS_ALLEGRO_CLOTHING
          : BRANDS_ALLEGRO;
        const queries = brandMappings[brand];
        if (!queries || !queries.length) {
          showMessage(`Brak zapytań dla marki: ${brand}`, "error");
          return;
        }
        let query;
        if (
          category.toLowerCase().includes("damskie") ||
          category.toLowerCase().includes("męskie")
        ) {
          query = queries[0];
        } else {
          query = queries[1] || queries[0];
        }
        const sexSelector = getSexSelector(category);
        try {
          setBrand(query, brand, sexSelector);
          showMessage("Marka została uzupełniona!");
        } catch (error) {
          showMessage("Wystąpił błąd: " + error.message, "error");
        }
      });
    });
  };

  const setupCustomBrandButtonListener = (buttonId, inputId) => {
    const button = document.getElementById(buttonId);
    const input = document.getElementById(inputId);
    if (!button) {
      console.warn(`Button with ID "${buttonId}" not found.`);
      return;
    }
    if (!input) {
      console.warn(`Input with ID "${inputId}" not found.`);
      return;
    }
    button.addEventListener("click", () => {
      const customBrand = input.value.trim();
      const brandType = input.dataset.brand;
      const brandTypeChildren = input.dataset.brandchildren;

      if (!brandType) {
        showMessage("Brak danych typu marki.", "error");
        return;
      }

      const category = getCurrentCategory();
      if (!category) {
        showMessage("Nie można pobrać kategorii.", "error");
        return;
      }

      const brandTypeToUse = category.includes("Dziecięce")
        ? brandTypeChildren
        : brandType;

      try {
        if (customBrand) {
          processBrandSelection(customBrand, brandTypeToUse);
        } else {
          showMessage("Wpisz markę", "error");
        }
      } catch (error) {
        showMessage("Wystąpił błąd: " + error.message, "error");
      }
    });
  };
  /********************************************
                ALLEGRO, DOCK, UTILS
********************************************/
  function extractProductInfo(headerText) {
    const cleanText = headerText
      .trim()
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ");

    const regex = /Edycja produktu (.+) \(ID: (\d+)\)/;
    const match = cleanText.match(regex);

    if (match) {
      let fullProductName = match[1].trim();
      const productId = parseInt(match[2], 10);

      return {
        product_name: fullProductName,
        id: productId,
      };
    } else {
      console.error("Unable to extract product information from header text");
      return null;
    }
  }

  function showMessage(message, type = "success") {
    const messageArea = document.getElementById("messageArea");

    if (messageTimeout) {
      clearTimeout(messageTimeout);
    }

    messageArea.textContent = message;
    messageArea.classList.remove("success", "error");
    messageArea.classList.add(type);
    messageArea.style.visibility = "visible";
    messageArea.style.opacity = "1";

    if (type === "success") {
      messageTimeout = setTimeout(() => {
        messageArea.style.opacity = "0";
        messageArea.style.visibility = "hidden";
        messageArea.classList.remove("success");
      }, 3000);
    }
  }

  function checkCategory() {
    const categoryText =
      document.querySelector("#select2-sizes-container")?.textContent || "";
    return categoryText.startsWith("Obuwie");
  }

  function transformSize(size) {
    return size === "2XL" ? "XXL" : size;
  }

  function getTableRows(
    selector = "#table_product-edit-aceform-basic-elem-68 tbody tr"
  ) {
    return document.querySelectorAll(selector);
  }

  function getItemSpecificNodes() {
    return document.querySelectorAll(
      "[id^='item_specifics']:not([id$='_default'])"
    );
  }

  function findOptionIndex(selectElement, text) {
    const normalizedText = text.trim();

    const exactMatchIndex = Array.from(selectElement.options).findIndex(
      (option) => option.text.trim() === normalizedText
    );

    if (exactMatchIndex !== -1) {
      return exactMatchIndex;
    }

    return Array.from(selectElement.options).findIndex((option) =>
      option.text.trim().includes(normalizedText)
    );
  }

  function setSelectValue(selectElement, text) {
    const index = findOptionIndex(selectElement, text);
    if (index !== -1) {
      selectElement.selectedIndex = index;
      selectElement.dispatchEvent(new Event("change"));
    } else {
      console.error(`Option "${text}" not found in select element.`);
    }
  }

  function setInputValue(node, selector, value) {
    const input = node.querySelector(selector);
    if (input) {
      input.value = value;
    } else {
      console.error(`Input element "${selector}" not found.`);
    }
  }

  function parseSizeText(text) {
    return text.split(" ")[1].split("[")[0];
  }

  function setSizesClothing() {
    const category = checkCategory();
    const data = [];

    getTableRows().forEach((tr) => {
      let size = transformSize(
        tr.querySelector(".ace-text").textContent.trim()
      );
      data.push({ size });
    });
    console.log(data);

    const sizesMainNodes = getItemSpecificNodes();

    if (!category) {
      sizesMainNodes.forEach((node) => {
        let sizeText = parseSizeText(
          node.querySelector("td").textContent.trim()
        );
        let transformedSize = transformSize(sizeText);
        const matchingItem = data.find((item) => item.size === transformedSize);

        if (matchingItem) {
          let selectElement = node.querySelector(
            ".auction_additional_param_1_54"
          );
          if (selectElement === null || selectElement === undefined) {
            selectElement = node.querySelector(
              ".auction_additional_param_1_246033"
            );
          }
          setSelectValue(selectElement, transformedSize);
        }
      });
      return;
    }
  }

  function producerCodeToAllegro(producerValue = "") {
    const category = checkCategory();
    const data = [];
    const producerCode =
      producerValue || document.querySelector("#code")?.value || "";

    getTableRows().forEach((tr) => {
      let size = tr.querySelector(".ace-text").textContent.trim();
      size = transformSize(size);
      data.push({ size, producer: producerCode });
    });

    const sizesMainNodes = getItemSpecificNodes();

    if (!category) {
      sizesMainNodes.forEach((node) => {
        let sizeText = parseSizeText(
          node.querySelector("td").textContent.trim()
        );
        let transformedSize = transformSize(sizeText);
        data.forEach((item) => {
          if (item.size.startsWith(transformedSize)) {
            setInputValue(
              node,
              "[id^='td_t_fid_1_224017_'] input",
              item.producer
            );
          }
        });
      });
      return;
    }

    if (sizesMainNodes.length < 2) {
      setInputValue(
        sizesMainNodes[0],
        "[id^='td_t_fid_1_224017_'] input",
        data[0]?.producer || ""
      );
    } else {
      sizesMainNodes.forEach((node) => {
        let sizeMatch = node.querySelector("td").textContent.match(/\d+/g);
        if (!sizeMatch) return;

        let allegroSize = sizeMatch.join("");

        let transformedSize;
        if (allegroSize.length > 3) {
          transformedSize = `${allegroSize[0]}${allegroSize[1]}`;
        } else {
          transformedSize = allegroSize.includes(",")
            ? allegroSize.replace(/,/g, "/")
            : allegroSize;
        }

        data.forEach((item) => {
          if (item.size.startsWith(transformedSize)) {
            setInputValue(
              node,
              "[id^='td_t_fid_1_224017_'] input",
              item.producer
            );
          }
        });
      });
    }
  }

  function eanToAllegro() {
    const category = checkCategory();
    const data = [];

    getTableRows().forEach((tr) => {
      const size = tr.querySelector(".ace-text").textContent.trim();
      const ean = tr.querySelector("[name^='codes_producer']").value.trim();
      data.push({ size, ean });
    });
    const sizesMainNodes = getItemSpecificNodes();

    if (!category) {
      sizesMainNodes.forEach((node) => {
        let sizeText = parseSizeText(
          node.querySelector("td").textContent.trim()
        );
        data.forEach((item) => {
          if (item.size.startsWith(sizeText)) {
            setInputValue(node, "[id^='td_t_fid_1_225693_'] input", item.ean);
          }
        });
      });
      return;
    }

    sizesMainNodes.forEach((node) => {
      let sizeMatch = node.querySelector("td").textContent.match(/\d+/g);
      if (!sizeMatch) return;

      let allegroSize = sizeMatch.join("");
      let transformedSize;
      if (allegroSize.length > 3) {
        transformedSize = `${allegroSize[0]}${allegroSize[1]}`;
      } else {
        transformedSize = allegroSize.includes(",")
          ? allegroSize.replace(/,/g, "/")
          : allegroSize;
      }

      data.forEach((item) => {
        if (item.size.startsWith(transformedSize)) {
          setInputValue(node, "[id^='td_t_fid_1_225693_'] input", item.ean);
        }
      });
    });
  }

  function copyTable() {
    const sizeChart =
      document
        .querySelector("#select2-sizeschart-container")
        ?.textContent.trim() || "";
    const sizeChartPattern = `<p>${sizeChart}cm</p>`;
    const regexPattern = /<p>.*?\d+-\d+,*\d*cm<\/p>/;

    const languageTabs = Array.from(
      document.querySelectorAll(
        "#mainTabsIdTrId [id^='tableRowTextEditTabs_tab_html']"
      )
    ).filter((el) => !el.id.includes("auction"));

    languageTabs.forEach((lang) => lang.click());

    const edits = document.querySelectorAll(
      "#mainTabsIdTrId [id^='tableRowTextEditTabs_container_html_area_']"
    );
    edits.forEach((edit) => {
      if (!regexPattern.test(edit.value)) {
        edit.value += ` ${sizeChartPattern}`;
      } else {
        edit.value =
          edit.value.replace(/<p>[^<]*?cm<\/p>/g, "") + ` ${sizeChartPattern}`;
      }
    });

    const previews = document.querySelectorAll(
      "#mainTabsIdTrId [id^='tableRowTextEditTabs_tab_preview']"
    );
    previews.forEach((preview) => preview.click());
  }

  function processTableAllegro() {
    const itemSpecificsMode = document.querySelector("#tr_itemSpecificsMode");
    itemSpecificsMode?.lastElementChild?.firstElementChild?.click();

    const sizeChartText =
      document
        .querySelector("#select2-sizeschart-container")
        ?.textContent.trim() || "";
    const sizeChart = parseSizeChart(sizeChartText);
    const sex =
      document
        .querySelector("#select2-category-container")
        ?.textContent.split(" ")[1] || "";

    const sizesMainNodes = Array.from(getItemSpecificNodes());

    sizesMainNodes.forEach((node) => {
      const sizeMatch = node
        .querySelector("td")
        .textContent.match(/\d+(?:\/\d+)?/g);
      if (!sizeMatch) return;

      const allegroSize = sizeMatch.join("/");
      const matchedSize = findMatchedSize(allegroSize, sizeChart);

      if (matchedSize) {
        const [size, insole] = matchedSize.split("-");
        const isCrossed = size.includes("/") && isDifferenceWithinRange(size);

        if (isCrossed) {
          setCrossedValues(sex, node, insole.replace(/,/g, "."), size);
        } else {
          setValues(sex, node, insole.replace(/,/g, "."), size);
        }
      }
    });
  }

  function parseSizeChart(sizeChartText) {
    const sizeChart = [];
    const parts = sizeChartText.split("/");

    for (let i = 0; i < parts.length; i++) {
      if (parts[i].includes("-")) {
        sizeChart.push(parts[i]);
      } else if (i + 1 < parts.length && parts[i + 1].includes("-")) {
        sizeChart.push(`${parts[i]}/${parts[i + 1]}`);
        i++;
      }
    }

    return sizeChart;
  }

  function findMatchedSize(allegroSize, sizeChart) {
    for (const sizeEntry of sizeChart) {
      const [sizePart] = sizeEntry.split("-");
      if (allegroSize === sizePart) {
        return sizeEntry;
      }
    }
    console.warn("No match found for:", allegroSize);
    return null;
  }

  function isDifferenceWithinRange(size) {
    const [num1, num2] = size.split("/").map(Number);
    const difference = Math.abs(num1 - num2);
    console.log("Difference:", difference, "for size:", size);
    return difference >= 0.5 && difference <= 2;
  }

  function setValues(sex, node, insole, size) {
    const selectIds = {
      Damskie: "1_26388",
      Męskie: "1_26388",
      Dziecięce: "1_26388", // "1_246029", "1_26388"
    };

    const insoleIds = {
      Damskie: "1_203093",
      Męskie: "1_203093",
      Dziecięce: "1_295",
    };

    const selectId = selectIds[sex];
    const insoleId = insoleIds[sex];

    if (selectId && insoleId) {
      setInputValue(node, `.auction_additional_param_${insoleId}`, insole);
      const selectElement = node.querySelector(
        `.auction_additional_param_${selectId}`
      );
      setSelectValue(selectElement, size);
    } else {
      setInputValue(node, "[id^='td_t_fid_1_295_'] input", insole);
      setInputValue(node, "[id^='td_t_fid_1_5389_'] input", size);
    }
  }

  function setCrossedValues(sex, node, insole, size) {
    const selectIds = {
      Dziecięce: "1_26388", // "1_246029", "1_26388"
      Damskie: "1_26388",
      Męskie: "1_127048",
    };

    const insoleIds = {
      Damskie: "1_203093",
      Męskie: "1_203093",
      Dziecięce: "1_295",
    };

    const selectId = selectIds[sex];
    const insoleId = insoleIds[sex];

    if (selectId && insoleId) {
      setInputValue(node, `.auction_additional_param_${insoleId}`, insole);
      const selectElement = node.querySelector(
        `.auction_additional_param_${selectId}`
      );
      if (selectElement) {
        setSelectValue(selectElement, size.replace("/", "-"));
      } else {
        console.error(`Select element for crossed size "${size}" not found.`);
      }
    } else {
      setInputValue(node, "[id^='td_t_fid_1_295_'] input", insole);
      setInputValue(node, "[id^='td_t_fid_1_5389_'] input", size);
    }
  }
  /********************************************
                TRANSLATIONS
    ********************************************/

  function transformDescription(text, isShoe) {
    return text;
  }

  async function translateText(
    sourceText,
    targetLangs,
    isProductDescription,
    isShoe
  ) {
    const headerText = document.querySelector(".page-header").textContent;
    const productInfo = extractProductInfo(headerText);

    if (!productInfo) {
      console.log("Failed to extract product information");
    }

    const { product_name, id } = productInfo;
    const properSourceText = isProductDescription
      ? transformDescription(sourceText, isShoe)
      : sourceText;

    const translateType = isProductDescription ? "description" : "name";

    const payload = {
      userPrompt: properSourceText,
      translateType: translateType,
      languages: targetLangs,
      isShoe: isShoe,
      productName: product_name,
      productId: id,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${CONST_VARIABLES.BLEBLE}`,
      },
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch(
        "https://butosklep.cfolks.pl/app/proxy",
        requestOptions
      );
      const data = await response.json();
      console.log("Tokeny: " + data.tokens);
      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Translation request failed.");
    }
  }

  async function setLangDescription(
    id = null,
    translateAll = false,
    isShoe = true
  ) {
    IAI.aceForm.loaderOn();
    const base = getLangBaseDescription();

    const targetLangs = translateAll
      ? Object.values(CONST_VARIABLES.LANG_ARRAY)
      : [
          CONST_VARIABLES.LANG_ARRAY[
            Object.keys(CONST_VARIABLES.LANG_ARRAY)[id]
          ],
        ];

    const translations = await translateText(base, targetLangs, true, isShoe);
    console.log(translations);

    const langsToProcess = translateAll
      ? Object.keys(CONST_VARIABLES.LANG_ARRAY).slice(1)
      : [Object.keys(CONST_VARIABLES.LANG_ARRAY)[id]];

    for (let langKey of langsToProcess) {
      const langId = Object.keys(CONST_VARIABLES.LANG_ARRAY).indexOf(langKey);
      const isShoes = checkCategory();
      const lastPart = isShoes ? CONST_VARIABLES.DESC_LANGUAGES[langId] : "";

      let totalTranslate;
      if (!isShoe) {
        totalTranslate = translations[CONST_VARIABLES.LANG_ARRAY[langKey]];
      } else {
        totalTranslate =
          "<p>" + translations[CONST_VARIABLES.LANG_ARRAY[langKey]] + lastPart + "</p>";
      }

      const htmlTabs = document.querySelectorAll(
        "#mainTabsIdTrId [id^='tableRowTextEditTabs_tab_html']"
      );
      htmlTabs[langId].click();
      const container = document.querySelector(
        `#mainTabsIdTrId [id^='tableRowTextEditTabs_container_html_area_']`
      );
      container.value = totalTranslate;
      const previewTab = document.querySelector(
        `#mainTabsIdTrId [id^='tableRowTextEditTabs_tab_preview_${langId}']`
      );
      previewTab.click();
    }

    IAI.aceForm.loaderOff();
  }

  function getLangBaseDescription() {
    const htmlTab = document.querySelector(
      "#mainTabsIdTrId [id^='tableRowTextEditTabs_tab_html']"
    );
    htmlTab.click();
    const container = document.querySelector(
      "#mainTabsIdTrId [id^='tableRowTextEditTabs_container_html_area_']"
    );
    const previewTab = document.querySelector(
      "#mainTabsIdTrId [id^='tableRowTextEditTabs_tab_preview_0']"
    );
    previewTab.click();
    return container.value;
  }

  function getLangInput(lang) {
    const inputSelector = `.input-group [id*=${lang}].hasValidation`;
    return (document.querySelector(inputSelector) || {}).value || "";
  }

  async function setLangNames(id = null, translateAll = false) {
    IAI.aceForm.loaderOn();
    const baseLang = Object.keys(CONST_VARIABLES.LANG_ARRAY)[0];
    const BASE_TEXT = getLangInput(baseLang);

    const targetLangs = translateAll
      ? Object.values(CONST_VARIABLES.LANG_ARRAY)
      : [
          CONST_VARIABLES.LANG_ARRAY[
            Object.keys(CONST_VARIABLES.LANG_ARRAY)[id]
          ],
        ];

    const translations = await translateText(BASE_TEXT, targetLangs, false);
    console.log(translations);

    const langsToProcess = translateAll
      ? Object.keys(CONST_VARIABLES.LANG_ARRAY).slice(1)
      : [Object.keys(CONST_VARIABLES.LANG_ARRAY)[id]];

    for (let langKey of langsToProcess) {
      const translatedText = translations[CONST_VARIABLES.LANG_ARRAY[langKey]];
      const inputSelector = `.input-group [id*=${langKey}].hasValidation`;
      const input = document.querySelector(inputSelector);
      if (input) {
        input.value = translatedText;
      }
    }

    IAI.aceForm.loaderOff();
  }

  function setText(id) {
    const baseLang =
      id === 1
        ? Object.keys(CONST_VARIABLES.LANG_ARRAY)[3]
        : Object.keys(CONST_VARIABLES.LANG_ARRAY)[0];
    const baseText = getLangInput(baseLang);
    const lang = CONST_VARIABLES.COPY_ARRAY[id];
    const inputSelector = `.input-group [id*=${lang}].hasValidation`;
    const input = document.querySelector(inputSelector);
    if (input) {
      input.value = baseText;
    }
  }

  setupBrandOptionListeners();
  setupCustomBrandButtonListener("customBrandButton", "customBrandInput");
  setupCustomBrandButtonListener(
    "customBrandButtonClothing",
    "customBrandInputClothing"
  );
})();
