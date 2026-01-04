// ==UserScript==
// @name Weryfikacja zamówienia | Dodatki
// @namespace http://tampermonkey.net/
// @version 0.50
// @description Labele na stronie weryfikacji
// @author Marcin
// @match https://butosklep.pl/panel/order-verification.php?idt=*
// @icon https://butosklep.pl/gfx/pol/favicon.ico
// @grant none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/446958/Weryfikacja%20zam%C3%B3wienia%20%7C%20Dodatki.user.js
// @updateURL https://update.greasyfork.org/scripts/446958/Weryfikacja%20zam%C3%B3wienia%20%7C%20Dodatki.meta.js
// ==/UserScript==

(function () {
  ("use strict");

  const SERVICES = {
    PAXY: [
      "Kurier 1 (Rumunia)",
      "Kurier 2 (Rumunia)",
      "Hermes Paket",
      "Slovenská pošta",
      "Kurier 2 (Słowacja)",
      "Sieć punktów odbioru 2 (Czechy)",
      "Sieć punktów odbioru 1 (Czechy)",
      "Česká pošta - Parcel Delivery To Hand",
      "Hrvatska pošta",
      "Kurier 1 (Chorwacja)",
      "Sieć punktów odbioru 1 (Chorwacja)",
      "Sieć punktów odbioru 2 (Chorwacja)"
    ],
    PACKETA: [
      "Packeta - punkty odbioru (Czechy)",
      "Packeta - CZ Packeta Home HD (Czechy)",
    ],
    "GLS CZECHY": ["Kurier 3 (Czechy)", "Kurier 3 (Słowacja)"],
  };

  const SPECIFICATION = [
    "IE3795593AH",
    "LT100016458613",
    "LT100016656014",
    "SK1020025413",
    "SK1078769725",
    "SK2120859642",
  ];

  const SHOPS = {
    1: "Butosklep",
    2: "Bugo",
    4: "Hurtownia",
    5: "Botoshop",
    8: "Zazoo",
    9: "Butymalucha",
    10: "Butosklep.com",
    11: "Obutik",
    13: "Allegrobs.iai-shop.com",
  };

  const ZOMBIES = ["CZ27393941"];

  function injectModalHTML() {
    const modalHTML = `
            <div id="imageModalCustom" class="modal-custom" style="display:none;">
              <img class="modal-content-custom" id="modalImageCustom">
              <div id="caption"></div>
            </div>
        `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  function injectModalCSS() {
    const modalCSS = `
            .modal-custom {
              display: none;
              position: fixed;
              z-index: 999999;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              overflow: auto;
              background-color: rgba(0, 0, 0, 0.8);
            }
            .modal-content-custom {
              margin: auto;
              display: block;
              width: 70%;
              max-width: 600px;
            }
        `;
    const style = document.createElement("style");
    style.textContent = modalCSS;
    document.head.appendChild(style);
  }

  function createStyledElement(tagName, options = {}) {
    const el = document.createElement(tagName);
    if (options.styles) Object.assign(el.style, options.styles);
    if (options.text) el.textContent = options.text;
    if (options.id) el.id = options.id;
    if (options.parent) options.parent.appendChild(el);
    return el;
  }

  function displayMessage({
    element = "div",
    text,
    isError = false,
    parent,
    id,
    className,
    customStyles = {},
  }) {
    const defaultStyles = isError
      ? {
          flex: "1 1 0px",
          maxWidth: "calc(33.333% - 20px)",
          boxSizing: "border-box",
          fontSize: "2rem",
          color: "red",
          fontWeight: "bold",
          textAlign: "center",
        }
      : {
          flex: "1 1 0px",
          maxWidth: "calc(33.333% - 20px)",
          boxSizing: "border-box",
          fontSize: "2rem",
          color: "blue",
          fontWeight: "bold",
          textAlign: "center",
        };

    const styles = { ...defaultStyles, ...customStyles };

    return createStyledElement(element, {
      text,
      styles,
      parent,
      id,
      className,
    });
  }

  async function fetchAPI(url, options = {}, handleError = true) {
    try {
      const response = await fetch(url, options);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      if (handleError) console.error("Error fetching data:", error);
      throw error;
    }
  }

  function ensureMainDiv() {
    let mainDiv = document.querySelector("#customMainDiv");

    if (!mainDiv) {
      const pageContentDiv = document.querySelector("#pageContent > div");
      mainDiv = createStyledElement("div", {
        id: "customMainDiv",
        styles: {
          maxWidth: "1500px",
          margin: "0 auto",
          padding: "10px",
          borderTop: "1px solid #ccc",
          borderRight: "1px solid #ccc",
          borderLeft: "1px solid #ccc",
          backgroundColor: "#f9f9f9",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          alignItems: "flex-start",
        },
        parent: pageContentDiv.firstChild ? undefined : pageContentDiv,
      });

      if (pageContentDiv.firstChild) {
        pageContentDiv.insertBefore(mainDiv, pageContentDiv.firstChild);
      }
    }

    return mainDiv;
  }

  function findCourierKey(searchValue) {
    for (const [key, values] of Object.entries(SERVICES)) {
      if (values.includes(searchValue)) {
        return key;
      }
    }
    return "";
  }

  function findInpost() {
    const inpostTextContent =
      document.querySelector(".delivery-icon")?.parentElement.textContent || "";

    return inpostTextContent.includes("InPost Paczkomaty");
  }

  function setCourierText() {
    let tdElement = document.querySelector("img.delivery-icon").parentElement;
    let fullText = tdElement.textContent;
    let cleanedText = fullText.replace(/\[.*?\]/g, "").trim();

    return cleanedText;
  }

  function checkShop() {
    if (!IAI || !IAI._panel || !IAI._panel.shopIheritedId) return "";
    const shopInheritedId = IAI._panel.shopIheritedId.toString();
    if (shopInheritedId === "4") return "BEZ ULOTKI I FOLIOPAK BEZ LOGO";
    return Object.keys(SHOPS).includes(shopInheritedId)
      ? `${SHOPS[shopInheritedId]} ulotka`
      : "";
  }

  function checkCroatia() {
    const searchNIP = "HR58589646983";
    return document.querySelector("#invAddr").textContent.includes(searchNIP);
  }

  function setLabel(mainDiv) {
    const text = document.querySelector("#invAddr").textContent;
    const match = text.match(/\(([^)(]+)\)(?!.*\()/);
    let labelContent = "Country not found";
    const shopInfo = checkShop();

    const textNode = document.querySelectorAll(".description")[3].nextSibling;
    const textAllegro = textNode.textContent;

    if (shopInfo.startsWith("Bugo") && textAllegro.startsWith("Allegro")) {
      displayMessage({
        text: `Bugo ${textAllegro} ulotka`,
        isError: false,
        parent: mainDiv,
      });
      return;
    }

    if (textAllegro.startsWith("Allegro") || textAllegro.startsWith("Amazon")) {
      displayMessage({
        text: `Butosklep ${textAllegro} ulotka`,
        isError: false,
        parent: mainDiv,
      });
      return;
    }

    if (match && match[1]) {
      labelContent = shopInfo !== "" ? shopInfo : match[1] + " ulotka";
    }

    displayMessage({
      text: labelContent,
      isError: labelContent === "Country not found",
      parent: mainDiv,
    });
  }

  function setCourierService(mainDiv) {
    const courierServiceMessage = checkCroatia()
      ? "GLS CHORWACJA - WYSYŁKA WTOREK i PIĄTEK"
      : findCourierKey(setCourierText()) || "Courier Service Not Identified";

    if (courierServiceMessage !== "Courier Service Not Identified") {
      displayMessage({
        text: courierServiceMessage,
        isError: courierServiceMessage === "Courier Service Not Identified",
        parent: mainDiv,
      });
    }
  }

  function setSpecification(mainDiv) {
    const text = document.querySelector("#invAddr").textContent;
    const match = text.match(/NIP:\s*([A-Z]{2}[A-Z0-9]+)/);
    let nipNumber = "";
    let specExists = document.body.textContent.includes("Specyfikacja (PDF)");

    if (match && match[1]) {
      nipNumber = match[1];
    }

    const orderID = IAI._orderdata.order_number;
    const shopID = IAI._panel.shopIheritedId;

    if (nipNumber !== "" && SPECIFICATION.includes(nipNumber) && !specExists) {
      displayMessage({
        element: "button",
        text: "Generuj specyfikacje",
        parent: mainDiv,
        isError: false,
        styles: {
          cursor: "pointer",
          padding: "10px 20px",
        },
      }).addEventListener("click", function () {
        console.log("Generowanie...");
        IAI._orderd.generate_odt(
          "pol",
          "56_Specyfikacja",
          "orders_docs",
          orderID,
          shopID,
          "html"
        );
      });
    } else if (specExists) {
      displayMessage({
        text: "Specyfikacja jest wygenerowana",
        isError: false,
        parent: mainDiv,
        customStyles: {
          color: "green",
        },
      });
    } else {
      console.log(
        "Specyfikacja nie jest wymagana lub NIP nie znajduje się na liście."
      );
    }
  }

  function getPackageID() {
    let onclickAttributeValue = document
      .querySelector("#btn_doc_verify")
      ?.getAttribute("onclick");

    if (!onclickAttributeValue) {
      return null;
    }

    const idValueMatch = onclickAttributeValue.match(/'id':'([^']+)'/);
    return idValueMatch ? idValueMatch[1] : null;
  }

  async function getGabarytData(id) {
    let formData = new FormData();
    formData.append("action", "getParams");
    formData.append("id", id);

    try {
      const response = await fetch(
        "https://butosklep.pl/panel/ajax/order-shipping.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      const parcelGauge = data?.value?.package_parameters?.defaultParcelGauge;

      const gaugeMapping = {
        small: "A",
        medium: "B",
        large: "C",
      };

      return gaugeMapping[parcelGauge] || "Brak informacji o gabarycie";
    } catch (error) {
      console.error("Error retrieving gabaryt: ", error);
      return "Error retrieving gabaryt";
    }
  }

  async function showGabaryt(mainDiv) {
    let packageId = getPackageID();
    if (!packageId) {
      console.error("Package ID could not be determined.");
      return;
    }
    let gabarytData = await getGabarytData(packageId);

    displayMessage({
      text: `Gabaryt ${gabarytData}`,
      parent: mainDiv,
      isError: gabarytData.startsWith("Error"),
      styles: gabarytData.startsWith("Error")
        ? undefined
        : {
            padding: "10px 20px",
            color: "green",
          },
    });
  }

  async function addVIESInfo(mainDiv) {
    function showLoadingMessage(parent) {
      let loadingMessage = "Ładowanie informacji o VIES";
      const loadingDiv = displayMessage({
        text: loadingMessage,
        parent: parent,
        isError: false,
      });

      return loadingDiv;
    }

    if (IAI._orderdata.vat_exists === "n") {
      const text = document.querySelector("#invAddr").textContent;
      const match = text.match(/NIP:\s*([A-Z]{2}[A-Z0-9]+)/);
      if (match && match[1]) {
        const vatNumber = match[1];
        const countryCode = vatNumber.substring(0, 2);
        const vatNum = vatNumber.substring(2);

        const loadingDiv = showLoadingMessage(mainDiv);

        try {
          const isValid = await fetchAPI(
            `https://butosklep.cfolks.pl/app_test/vies`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                country_code: countryCode,
                vat_number: vatNum,
              }),
            }
          );

          mainDiv.removeChild(loadingDiv);

          displayMessage({
            text: isValid.valid ? "VIES OK" : "VAT EU nieważny!",
            parent: mainDiv,
            customStyles: {
              color: isValid.valid ? "green" : "red",
            },
          });
        } catch (error) {
          console.error("Error fetching VIES data:", error);
          mainDiv.removeChild(loadingDiv);
          displayMessage({
            text: "Błąd przy sprawdzaniu VIES",
            isError: true,
            parent: mainDiv,
          });
        }
      } else {
        console.log("NIP: not found.");
      }
    } else {
      console.log("VAT exists, no need to check VIES.");
    }
  }
  function checkZombies() {
    const text = document.querySelector("#invAddr").textContent;
    const match = text.match(/NIP:\s*([A-Z]{2}[A-Z0-9]+)/);
    if (match && match[1]) {
      const nipNumber = match[1];
      return ZOMBIES.includes(nipNumber);
    }
    return false;
  }

  function checkProductID() {
    let table = document.querySelector("#products-list table");
    let rows = table.querySelectorAll("tbody.yui-dt-data tr");

    let productFound = false;

    rows.forEach(function (row) {
      if (row.innerHTML.includes("23905")) {
        productFound = true;
      }
    });

    if (productFound) {
      let targetElement = document.querySelector(".formGeneratorFormContainer");
      let newDiv = document.createElement("div");

      newDiv.classList.add("table-parent-wrapper");

      newDiv.style.backgroundColor = "yellow";
      newDiv.style.color = "black";
      newDiv.style.padding = "10px";
      newDiv.style.marginTop = "10px";
      newDiv.style.border = "2px solid black";
      newDiv.style.fontSize = "16px";
      newDiv.style.fontWeight = "bold";
      newDiv.style.maxWidth = "1500px";
      newDiv.style.textAlign = "center";

      let newSpan = document.createElement("span");
      newSpan.textContent = "SPRAWDŹ PASKI W LL274429!";

      newDiv.appendChild(newSpan);

      targetElement.parentNode.insertBefore(newDiv, targetElement.nextSibling);
    }
  }

  function waitForIAILoaded(callback) {
    const checkIAI = setInterval(() => {
      if (typeof IAI !== "undefined" && IAI && IAI._panel) {
        clearInterval(checkIAI);
        callback();
      }
    }, 100);
  }

  async function switchIcon() {
    let table = document.querySelector("#products-list table");
    let rows = table.querySelectorAll("tbody.yui-dt-data tr");

    for (let row of rows) {
      let productIdElement = row.querySelector("td.yui-dt0-col-code a");
      if (!productIdElement) continue;

      let onclickAttr = productIdElement.getAttribute("onclick");
      let productIdMatch = onclickAttr.match(
        /IAI\.formGenerator\.showProductInfo\(`(\d+)`/
      );

      if (!productIdMatch) continue;

      let productId = productIdMatch[1];

      try {
        let newIconUrl = await fetchIconUrl(productId);

        let imgElement = row.querySelector("td.yui-dt0-col-icon img");
        if (imgElement) {
          imgElement.src = newIconUrl;
        }

        let anchorElement = row.querySelector("td.yui-dt0-col-icon a");
        if (anchorElement) {
          let newAnchorElement = anchorElement.cloneNode(true);
          newAnchorElement.href = newIconUrl;
          newAnchorElement.dataset.modalLink = "true";

          newAnchorElement.addEventListener("click", function (event) {
            event.preventDefault();
            openModal(newIconUrl);
          });

          anchorElement.parentNode.replaceChild(
            newAnchorElement,
            anchorElement
          );
        }
      } catch (error) {
        console.error(
          `Error fetching icon for product ID ${productId}:`,
          error
        );
      }
    }
  }

  function openModal(imageUrl) {
    const modal = document.getElementById("imageModalCustom");
    const modalImage = document.getElementById("modalImageCustom");
    modal.style.display = "block";
    modalImage.src = imageUrl;

    modal.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }

  async function fetchIconUrl(productId) {
    const response = await fetch(
      `https://butosklep.pl/ajax/projector.php?action=get&product=${productId}&get=product`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const iconPath = data.product.icon;
    const iconUrl = `/${iconPath}`;

    return iconUrl;
  }

  async function initializeScript() {
    const mainDiv = ensureMainDiv();
    injectModalHTML();
    injectModalCSS();
    if (checkZombies()) {
      displayMessage({
        text: "BEZ ULOTKI I FOLIOPAK BEZ LOGO",
        isError: false,
        parent: mainDiv,
      });
    } else {
      setLabel(mainDiv);
      setCourierService(mainDiv);
      setSpecification(mainDiv);
      await addVIESInfo(mainDiv);
      if (findInpost()) {
        await showGabaryt(mainDiv);
      }
    }
  }

  waitForIAILoaded(() => {
    initializeScript()
      .then(() => {
        setTimeout(() => {
          checkProductID();
          switchIcon();
        }, 1500);
      })
      .catch(console.error);
  });
})();