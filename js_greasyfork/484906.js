// ==UserScript==
// @name         Edycja opisów
// @namespace    http://tampermonkey.net/
// @version      0.94
// @description  Nowa zakladka do edycji opisow idosell
// @author       Marcin
// @match        https://butosklep.pl/panel/product.php?*
// @match        https://butosklep.iai-shop.com/panel/product.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=butosklep.pl
// @require https://update.greasyfork.org/scripts/511010/1640427/My%20consts.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484906/Edycja%20opis%C3%B3w.user.js
// @updateURL https://update.greasyfork.org/scripts/484906/Edycja%20opis%C3%B3w.meta.js
// ==/UserScript==

(function () {
  ("use strict");
  const script = document.createElement('script');
  script.src = 'https://butosklep.cfolks.pl/app_test/static/constants.js';
  document.head.appendChild(script);

  const addTabAndContent = () => {
    return new Promise((resolve) => {
      const loadingOverlay = createElementFromHTML(LOADING_OVERLAY_HTML);
      const baseHTML = createElementFromHTML(BASE_HTML);

      let descTabCode =
        createElementFromHTML(DESC_TAB_CODE_HTML);

      let modalImagesGenerate = createElementFromHTML(MODAL_IMAGES_GENERATE_HTML);

      let modalRephrase = createElementFromHTML(MODAL_REPHRASE);

      document.querySelector("li#mainTabs-tab-11").after(baseHTML);
      document.querySelector("div#mainTabs-tab-content-11").after(descTabCode);
      document.querySelector("body").after(loadingOverlay);
      document.querySelector("body").after(modalImagesGenerate);
      document.querySelector("body").after(modalRephrase);
      resolve();
    });
  };

  const appendCustomStyles = () => {
    return new Promise((resolve) => {
      const styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.innerText = CUSTOM_CSS;
      document.head.appendChild(styleSheet);
      resolve();
    });
  };

  const createElementFromHTML = (htmlString) => {
    const div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  };

  function updateInputStyle(input) {
    if (input.value.trim() === "") {
      input.classList.add("empty-field");
    } else {
      input.classList.remove("empty-field");
    }
  }

  const toggleLoadingOverlay = (show) => {
    const overlay = document.getElementById("loadingOverlay");
    if (show) {
      overlay.classList.add("active");
    } else {
      overlay.classList.remove("active");
    }
  };
  ////////////////////////////////////////
  //       MODAL IMAGES GENERATION      //
  ////////////////////////////////////////
  const modalPartGenerate = async () => {
    const modalImagesModal = document.getElementById("imagesModal");
    const btnImagesModal = document.getElementById("generateButton");
    const saveDescriptionBtnGenerate = document.getElementById(
      "saveDescriptionButtonGenerate"
    );
    const spanImagesModal =
      document.getElementsByClassName("modal-images-close")[0];
    const imageContainer = document.getElementById("imagesModalContainer");
    const webcamVideo = document.getElementById("webcamVideo");
    const cameraContainer = document.getElementById("cameraContainer");

    btnImagesModal.onclick = async function () {
      modalImagesModal.setAttribute("style", "display: flex !important;");
      let polishData = await fetchPolishProductData();
      if (polishData) {
        let value =
          polishData[0].productDescriptionsLangData.pol[0]
            .productLongDescription;
        document.getElementById("oldDescriptionArea-generate").value = value;
      } else {
        document.getElementById("oldDescriptionArea-generate").value =
          "Brak domyślnego opisu";
      }
    };

    spanImagesModal.onclick = function () {
      modalImagesModal.setAttribute("style", "display: none !important;");
    };

    window.onclick = function (event) {
      if (event.target == modalImagesModal) {
        modalImagesModal.setAttribute("style", "display: none !important;");
      }
    };

    document.getElementById("fetchImagesButton").onclick = function () {
      fetchImages();
    };

    document.getElementById("uploadImagesButton").onclick = function () {
      document.getElementById("imageUpload").click();
    };

    document.getElementById("imageUpload").onchange = function (event) {
      handleImageUpload(event.target.files);
    };

    document.getElementById("openCameraButton").onclick = function () {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          webcamVideo.srcObject = stream;
          cameraContainer.hidden = false;
        })
        .catch(function (error) {
          console.error("Error accessing the webcam", error);
          alert("Brak kamerki lub brak uprawnień do kamerki");
        });
    };

    document.getElementById("captureImageButton").onclick = function () {
      const canvas = document.createElement("canvas");
      canvas.width = webcamVideo.videoWidth;
      canvas.height = webcamVideo.videoHeight;
      canvas.getContext("2d").drawImage(webcamVideo, 0, 0);
      const imageDataUrl = canvas.toDataURL("image/png");

      webcamVideo.srcObject.getTracks().forEach((track) => track.stop());
      webcamVideo.srcObject = null;
      cameraContainer.hidden = true;

      handleImageUpload([imageDataUrl]);
    };

    imageContainer.addEventListener("click", function (event) {
      if (event.target.tagName === "IMG") {
        event.target.classList.toggle("selected-image");
        let selectedImages = document.querySelectorAll(".selected-image");
        if (selectedImages.length > 3) {
          event.target.classList.remove("selected-image");
          alert("Możesz zaznaczyć maksymalnie 3 zdjęcia");
        }
      }
    });

    saveDescriptionBtnGenerate.onclick = function () {
      if (document.querySelector("#descriptionArea-generate").value == "") {
        alert("Brak wygenerowanego opisu");
        return;
      } else {
        updatePolishProductData((modal = "generate"));
      }
    };

    function handleImageUpload(input) {
      if (input.length > 3) {
        alert("Możesz wgrać maksymalnie 3 zdjęcia");
        return;
      }

      imageContainer.innerHTML = "";

      if (input[0] instanceof File || input[0] instanceof Blob) {
        const base64Promises = Array.from(input).map((file) =>
          convertToBase64(file)
        );
        Promise.all(base64Promises).then((base64Images) => {
          displayImages(base64Images);
          prepareDescriptionGeneration(base64Images);
        });
      } else {
        displayImages(input);
        prepareDescriptionGeneration(input);
      }
    }

    function convertToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    }

    function displayImages(images) {
      images.forEach((img, index) => {
        if (img) {
          const existingImage = imageContainer.querySelector(
            `img[src="${img}"]`
          );
          if (!existingImage) {
            let imageElement = document.createElement("img");
            imageElement.src = img;
            imageElement.alt = `Fotka ${index + 1}`;
            imageElement.style.margin = "15px";
            imageElement.style.maxWidth = "150px";
            imageElement.style.maxHeight = "150px";
            imageContainer.appendChild(imageElement);
          }
        }
      });
    }

    async function fetchImages() {
      const productId = extractProductIdFromURL();
      const apiEndpoint = `${API_BASE_URL}/images/${productId}`;
      toggleLoadingOverlay(true);
      try {
        const response = await fetchWithAuth(apiEndpoint);
        if (!response.ok) {
          throw new Error(
            "Network response was not ok: " + response.statusText
          );
        }
        const images = await response.json();
        displayImages(images.map((img) => img.productImageMediumUrl));
        prepareDescriptionGeneration(
          images.map((img) => img.productImageMediumUrl)
        );
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
        alert("Błąd przy pobieraniu zdjęć");
      } finally {
        toggleLoadingOverlay(false);
      }
    }

    function prepareDescriptionGeneration(images) {
      const generateDescriptionButton = document.getElementById(
        "generateDescriptionButton"
      );
      const descriptionArea = document.getElementById(
        "descriptionArea-generate"
      );
      const saveDescriptionButton = document.getElementById(
        "saveDescriptionButtonGenerate"
      );

      generateDescriptionButton.disabled = false;
      generateDescriptionButton.onclick = async () => {
        const selectedImages = document.querySelectorAll(".selected-image");
        if (selectedImages.length === 0) {
          alert("Zaznacz przynajmniej jedno zdjęcie.");
          return;
        }

        toggleLoadingOverlay(true);
        try {
          const description = await generateDescriptionWithVisionAPI(
            [...selectedImages].map((img) => img.src)
          );
          const label = document.getElementById("labelDescriptionGenerate");
          label.textContent = "Wygenerowany opis na podstawie zdjęć: ";
          descriptionArea.value = description;
          descriptionArea.disabled = false;
          saveDescriptionButton.disabled = false;
        } catch (error) {
          console.error("Failed to generate description: ", error);
          alert("Błąd przy generowaniu opisu");
        } finally {
          toggleLoadingOverlay(false);
        }
      };
    }

    async function generateDescriptionWithVisionAPI(imageData) {
      const apiEndpoint = `${API_BASE_URL}/generate-description`;
      let preHTML = "<p>";
      let postHTML = `${LANG_SPECIFIC_HTML.pol}</p>${PRODUCT_SIZE_CHART}`;

      try {
        const response = await fetchWithAuth(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrls: imageData }),
        });
        if (!response.ok) {
          throw new Error("Failed to generate description");
        }

        const data = await response.json();
        return preHTML + data.description + postHTML;
      } catch (error) {
        console.error("Error generating description:", error);
        throw error;
      }
    }
  };
  ////////////////////////////////////////
  //     MODAL REPHRASE DESCRIPTION     //
  ////////////////////////////////////////
  const modalPartRephrase = async () => {
    const modalRephraseModal = document.getElementById("rephraseModal");
    const btnRephraseModal = document.getElementById("rephraseButton");
    const saveDescriptionBtnRephrase = document.getElementById(
      "saveDescriptionButtonRephrase"
    );
    const rephraseDescriptionBtn = document.getElementById(
      "rephraseDescriptionButton"
    );
    const spanRephraseModal = document.getElementsByClassName(
      "modal-rephrase-close"
    )[0];
    const keywordsInput = document.getElementById("keywords-rephrase");
    const keywordsContainer = document.getElementById("keywords-container");
    const toneSelect = document.getElementById("tone-rephrase");

    let keywords = [];

    function addKeyword(keyword) {
      const keywordElement = document.createElement("div");
      keywordElement.classList.add(
        "badge",
        "badge-primary",
        "mr-2",
        "mb-2",
        "d-flex",
        "align-items-center"
      );

      const keywordText = document.createElement("span");
      keywordText.textContent = keyword;

      const removeButton = document.createElement("button");
      removeButton.classList.add("close", "ml-2");
      removeButton.innerHTML = "&times;";
      removeButton.addEventListener("click", () => removeKeyword(keyword));

      keywordElement.appendChild(keywordText);
      keywordElement.appendChild(removeButton);
      keywordsContainer.appendChild(keywordElement);
      keywords.push(keyword);
    }

    function removeKeyword(keyword) {
      const keywordElement = Array.from(keywordsContainer.children).find(
        (el) => el.querySelector("span").textContent.trim() === keyword
      );
      keywordsContainer.removeChild(keywordElement);
      keywords = keywords.filter((k) => k !== keyword);
    }

    keywordsInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const keyword = keywordsInput.value.trim();
        if (keyword) {
          addKeyword(keyword);
          keywordsInput.value = "";
        }
      }
    });

    function getKeywordsAndTone() {
      const tone = toneSelect.value;
      return { keywords, tone };
    }

    btnRephraseModal.onclick = async function () {
      modalRephraseModal.setAttribute("style", "display: flex !important;");
      let polishData = await fetchPolishProductData();
      if (polishData) {
        let value =
          polishData[0].productDescriptionsLangData.pol[0]
            .productLongDescription;
        document.getElementById("oldDescriptionArea-rephrase").value = value;
      } else {
        document.getElementById("oldDescriptionArea-rephrase").value =
          "Brak domyślnego opisu";
      }
    };

    spanRephraseModal.onclick = function () {
      modalRephraseModal.setAttribute("style", "display: none !important;");
    };

    window.onclick = function (event) {
      if (event.target == modalRephraseModal) {
        modalRephraseModal.setAttribute("style", "display: none !important;");
      }
    };

    rephraseDescriptionBtn.onclick = async function () {
      if (!document.querySelector("#oldDescriptionArea-rephrase").value == "") {
        const value = document.querySelector(
          "#oldDescriptionArea-rephrase"
        ).value;
        const { keywords, tone } = getKeywordsAndTone();
        const options = { keywords, tone };
        const newDescription = await rephraseDescription(value, options);

        const label = document.getElementById("labelDescriptionRephrase");
        label.textContent = "Nowy opis: ";
        document.querySelector("#descriptionArea-rephrase").value =
          newDescription;
        const saveDescriptionButtonRephrase = document.getElementById(
          "saveDescriptionButtonRephrase"
        );
        saveDescriptionButtonRephrase.disabled = false;
      }
    };

    saveDescriptionBtnRephrase.onclick = function () {
      if (document.querySelector("#descriptionArea-rephrase").value == "") {
        alert("Brak wygenerowanego opisu");
        return;
      } else {
        updatePolishProductData((modal = "rephrase"));
      }
    };

    async function rephraseDescription(description, options = {}) {
      const apiEndpoint = `${API_BASE_URL}/rephrase-description`;

      toggleLoadingOverlay(true);
      try {
        const response = await fetchWithAuth(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: description, options }),
        });
        if (!response.ok) {
          throw new Error("Failed to rephrase description");
        }

        const data = await response.json();
        return data.description;
      } catch (error) {
        console.error("Error rephrasing description:", error);
        throw error;
      } finally {
        toggleLoadingOverlay(false);
      }
    }
  };
  ////////////////////////////////////////
  //     EVENT LISTENERS AND HANDLERS   //
  ////////////////////////////////////////
  const setupEventListeners = async () => {
    return new Promise((resolve) => {
      const fetchDataButton = document.getElementById("fetchDataButton");
      const shopIdDropdown = document.getElementById("shopIdDropdown");
      const langDropdown = document.getElementById("langDropdown");
      const fieldsDropdown = document.getElementById("fieldsDropdown");
      const htmlTab = document.getElementById("mainTabs-tab-12");

      if (
        !fetchDataButton ||
        !shopIdDropdown ||
        !langDropdown ||
        !fieldsDropdown ||
        !htmlTab
      ) {
        console.error("One or more elements are missing from the DOM.");
        return resolve();
      }

      [shopIdDropdown, langDropdown, fieldsDropdown].forEach((element) => {
        element.addEventListener("change", async () => {
          localStorage.removeItem("lastActiveTab");
          await fetchProductData();
        });
      });

      fetchDataButton.addEventListener("click", async function () {
        const activeTab = document.querySelector(".tab-trans.active");
        const activeTabId = activeTab
          ? activeTab.getAttribute("data-lang")
          : null;
        if (activeTabId) {
          saveCurrentTab(activeTabId);
        }

        const result = await fetchProductData();
        if (result) {
          restoreLastActiveTab();
          showMessage({ message: "Dane odświeżone!" });
        }
      });

      htmlTab.addEventListener("click", async function () {
        await fetchProductData();
      });

      document
        .getElementById("translateButton")
        .addEventListener("click", async function () {
          let translatedData = await translateProductData();
          updateTranslatedProductData(translatedData);
        });

      document
        .getElementById("tabContent")
        .addEventListener("input", function (event) {
          if (event.target.classList.contains("editable-field")) {
            updateInputStyle(event.target);
          }
        });

      document
        .getElementById("savingButton")
        .addEventListener("click", function () {
          updateProductData();
        });

      resolve();
    });
  };

  ////////////////////////////////////////
  //      FETCH AND TOKEN FUNCTIONS     //
  ////////////////////////////////////////
  const fetchWithAuth = async (url, options = {}) => {
    const token = await getAuthToken();
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: token,
      },
    });
  };

  const getAuthToken = async () => {
    const tokenInfo = JSON.parse(localStorage.getItem("tokenInfo"));
    const now = Date.now();

    if (
      tokenInfo &&
      now < new Date(tokenInfo.fetchTime).getTime() + TOKEN_EXPIRY_TIME
    ) {
      return tokenInfo.token;
    }

    const response = await fetch(TOKEN_API_URL);
    const data = await response.json();
    const token = data.token;

    localStorage.setItem(
      "tokenInfo",
      JSON.stringify({ token, fetchTime: new Date() })
    );
    return token;
  };

  const fetchProductData = async () => {
    const productId = extractProductIdFromURL();
    const shopId = document.getElementById("shopIdDropdown").value;
    const lang = document.getElementById("langDropdown").value;
    const fields = document.getElementById("fieldsDropdown").value;
    const apiEndpoint = `${API_BASE_URL}/product-data/${productId}?shopid=${shopId}&langid=${lang}&fields=${fields}`;

    toggleLoadingOverlay(true);
    try {
      const response = await fetchWithAuth(apiEndpoint);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      displayProductData(data);
      return true;
    } catch (error) {
      console.error("Error fetching product data:", error);
      showMessage({ error: error.toString() });
      return false;
    } finally {
      toggleLoadingOverlay(false);
    }
  };

  const fetchPolishProductData = async () => {
    const productId = extractProductIdFromURL();
    const shopId = 0;
    const lang = "pol";
    const apiEndpoint = `${API_BASE_URL}/product-data/${productId}?shopid=${shopId}&langid=${lang}&fields=productName,productLongDescription,productMetaTitle,productMetaDescription,productMetaKeywords`;

    toggleLoadingOverlay(true);
    try {
      const response = await fetchWithAuth(apiEndpoint);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching product data:", error);
      localStorage.removeItem("tokenInfo");
      showMessage({ error: error.toString() });
      return false;
    } finally {
      toggleLoadingOverlay(false);
    }
  };

  function updateTranslatedProductData(jsonData) {
    if (
      !jsonData.params ||
      !jsonData.params.products ||
      jsonData.params.products.length === 0
    ) {
      console.error("Invalid JSON structure");
      return;
    }

    const productData = jsonData.params.products[0];
    const productDescriptions = productData.productDescriptionsLangData;
    let fields = document.getElementById("fieldsDropdown").value.split(",");

    productDescriptions.forEach((description) => {
      const langId = description.langId;

      fields.forEach((field) => {
        const elementId =
          field === "productLongDescription" ||
          field === "productMetaDescription"
            ? `textarea_${field}_${langId}`
            : `input_${field}_${langId}`;

        const element = document.getElementById(elementId);
        if (element) {
          let value = description[field].replace(/\\'/g, "'") || "";

          if (field === "productLongDescription" && langId !== "pol") {
            const langHtml = LANG_SPECIFIC_HTML[langId] || "";
            value += `${langHtml}${PRODUCT_SIZE_CHART}`;
          }

          element.value = value;
        }
      });
    });
  }

  const displayProductData = (dataArray) => {
    const tabs = document.getElementById("languageTabs");
    const tabContent = document.getElementById("tabContent");

    tabs.innerHTML = "";
    tabContent.innerHTML = "";

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      tabContent.innerHTML = "<p>Nie znaleziono danych w odpowiedzi</p>";
      return;
    }

    let data = dataArray[0];
    if (!data.productDescriptionsLangData) {
      tabContent.innerHTML =
        "<p>Brak 'productDescriptionsLangData' w odpowiedzi</p>";
      return;
    }

    const languageOrder = Object.keys(LANGUAGE_NAMES);
    const fields = document.getElementById("fieldsDropdown").value.split(",");

    languageOrder.forEach((lang) => {
      if (data.productDescriptionsLangData.hasOwnProperty(lang)) {
        let languageData = data.productDescriptionsLangData[lang][0];
        createTab(lang, tabs);
        createTabContent(lang, languageData, fields, tabContent);
      }
    });

    activateFirstTab(tabs, tabContent);
    setupTabEventListeners();
  };

  const createTab = (lang, tabs) => {
    let tab = document.createElement("li");
    tab.className = "tab-trans";
    tab.dataset.lang = lang;
    let tabLink = document.createElement("a");
    tabLink.href = "#tab_" + lang;
    tabLink.dataset.toggle = "tab";
    tabLink.textContent = LANGUAGE_NAMES[lang] || lang.toUpperCase();
    tab.appendChild(tabLink);
    tabs.appendChild(tab);
  };

  const createTabContent = (lang, languageData, fields, tabContent) => {
    let tabPane = document.createElement("div");
    tabPane.id = "tab_" + lang;
    tabPane.className = "tab-pane fade";

    fields.forEach((field) => {
      let contentElement = document.createElement("div");
      contentElement.id = field;

      let label = document.createElement("label");
      label.innerHTML = `<b>${FIELD_NAMES[field] || field}:</b>`;
      label.htmlFor = `input_${field}_${lang}`;

      contentElement.appendChild(label);

      let fieldElement;
      if (languageData[field]) {
        fieldElement = createFieldElement(field, lang, languageData[field]);
      } else {
        fieldElement = createEmptyFieldElement(field, lang);
      }

      contentElement.appendChild(fieldElement);
      tabPane.appendChild(contentElement);
    });

    tabContent.appendChild(tabPane);
  };

  const createFieldElement = (field, lang, value) => {
    let fieldElement;
    if (
      field === "productLongDescription" ||
      field === "productMetaDescription"
    ) {
      fieldElement = document.createElement("textarea");
      fieldElement.id = `textarea_${field}_${lang}`;
    } else {
      fieldElement = document.createElement("input");
      fieldElement.type = "text";
      fieldElement.id = `input_${field}_${lang}`;
    }
    fieldElement.className = "editable-field";
    fieldElement.value = value;
    return fieldElement;
  };

  const createEmptyFieldElement = (field, lang) => {
    let element;
    if (
      field === "productLongDescription" ||
      field === "productMetaDescription"
    ) {
      element = document.createElement("textarea");
      element.className = "empty-field editable-field";
      element.placeholder = "Brak wartości";
      element.id = `textarea_${field}_${lang}`;
    } else {
      element = document.createElement("input");
      element.type = "text";
      element.className = "empty-field editable-field";
      element.placeholder = "Brak wartości";
      element.id = `input_${field}_${lang}`;
    }
    return element;
  };

  const extractProductIdFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("idt");
  };

  function saveCurrentTab(tabId) {
    localStorage.setItem("lastActiveTab", tabId);
  }

  function restoreLastActiveTab() {
    const lastActiveTab = localStorage.getItem("lastActiveTab");
    if (lastActiveTab) {
      const tabToActivate = document.querySelector(
        `[data-lang="${lastActiveTab}"]`
      );
      if (tabToActivate) {
        tabToActivate.click();
      }
    }
  }

  function activateFirstTab(tabs, tabContent) {
    const lastActiveTabId = localStorage.getItem("lastActiveTab");

    if (lastActiveTabId) {
      const savedTab = document.querySelector(
        `[data-lang="${lastActiveTabId}"]`
      );
      if (savedTab) {
        savedTab.classList.add("active");
        const relatedContent = document.getElementById(
          "tab_" + lastActiveTabId
        );
        if (relatedContent) {
          relatedContent.classList.add("active", "in");
        }
        return;
      }
    }

    if (tabs.firstChild && tabContent.firstChild) {
      tabs.firstChild.classList.add("active");
      tabContent.firstChild.classList.add("active", "in");
    }
  }

  const showMessage = (responseData, place = "default") => {
    const containerId =
      place === "modal" ? "messageContainerModal" : "messageContainer";
    const container = document.getElementById(containerId);

    if (container) {
      container.innerHTML = "";

      const messageElement = document.createElement("span");

      if (responseData.message) {
        messageElement.innerText = responseData.message;
        messageElement.style.color = "green";
      } else if (responseData.error) {
        messageElement.innerText = responseData.error;
        messageElement.style.color = "red";
      }

      container.appendChild(messageElement);

      setTimeout(() => container.removeChild(messageElement), 3000);
    }
  };

  function setupTabEventListeners() {
    document.querySelectorAll(".tab-trans").forEach((tab) => {
      tab.addEventListener("click", function () {
        const lang = this.getAttribute("data-lang");
        saveCurrentTab(lang);
      });
    });
  }

  const constructPayload = () => {
    const productId = extractProductIdFromURL();
    const productCategory = document.querySelector(
      "#select2-category-container"
    ).textContent;

    let productDescription = {
      productIdent: {
        productIdentType: "id",
        identValue: productId,
      },
      productInfo: {
        category: productCategory,
      },
      productDescriptionsLangData: [],
    };

    const panes = document.querySelectorAll(".tab-pane");
    panes.forEach((tabPane) => {
      const langIdMatch = tabPane.id.match(/tab_(\w+)/);
      if (!langIdMatch) return;
      const langId = langIdMatch[1];
      const shopId = parseInt(document.getElementById("shopIdDropdown").value);
      let langData = { langId, shopId };
      tabPane.querySelectorAll(".editable-field").forEach((field) => {
        let fieldId = field.id.split("_")[1];
        langData[fieldId] = field.value;
      });

      if (Object.keys(langData).length > 2) {
        productDescription.productDescriptionsLangData.push(langData);
      }
    });

    return { params: { products: [productDescription] } };
  };

  async function constructTranslationPayload(languageIds = []) {
    const productId = extractProductIdFromURL();
    const polishData = await fetchPolishProductData();
    const productCategory = document.querySelector(
      "#select2-category-container"
    ).textContent;

    let productDescription = {
      productIdent: {
        productIdentType: "id",
        identValue: productId,
      },
      productInfo: {
        description:
          polishData[0].productDescriptionsLangData.pol[0]
            .productLongDescription,
        name: polishData[0].productDescriptionsLangData.pol[0].productName,
        category: productCategory,
      },
      productDescriptionsLangData: [],
    };

    const panes = document.querySelectorAll(".tab-pane");

    panes.forEach((tabPane) => {
      const langIdMatch = tabPane.id.match(/tab_(\w+)/);
      if (!langIdMatch) {
        return;
      }
      const langId = langIdMatch[1];
      if (languageIds.length > 0 && !languageIds.includes(langId)) {
        return;
      }
      const shopId = parseInt(shopIdDropdown.value);
      let langData = { langId, shopId };
      tabPane.querySelectorAll(".editable-field").forEach((field) => {
        let fieldId = field.id.split("_")[1];
        langData[fieldId] = field.value;
      });

      if (Object.keys(langData).length > 2) {
        productDescription.productDescriptionsLangData.push(langData);
      }
    });

    return { params: { products: [productDescription] } };
  }

  function constructProductPayload(langId, shopId, modal) {
    const productId = extractProductIdFromURL();
    const productCategory = document.querySelector(
      "#select2-category-container"
    ).textContent;

    let productDescription = {
      productIdent: {
        productIdentType: "id",
        identValue: productId,
      },
      productInfo: {
        category: productCategory,
      },
      productDescriptionsLangData: [],
    };

    let description = "";
    if (modal == "generate") {
      description = document.querySelector("#descriptionArea-generate").value;
    } else if (modal == "rephrase") {
      description = document.querySelector("#descriptionArea-rephrase").value;
    }
    if (!description.trim()) {
      return {
        error: true,
        message: "Polish description cannot be empty.",
      };
    }

    let langData = { langId, shopId };
    langData["productLongDescription"] = description;

    if (Object.keys(langData).length > 1) {
      productDescription.productDescriptionsLangData.push(langData);
    }

    return { params: { products: [productDescription] } };
  }

  const translateProductData = async () => {
    const payload = await constructTranslationPayload();
    const apiEndpoint = `${API_BASE_URL}/translate`;

    toggleLoadingOverlay(true);
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorText}`
        );
      }

      const data = await response.json();
      showMessage({ message: "Wszystko przetłumaczone!" });
      return data;
    } catch (error) {
      console.error("Error translating product data:", error);
      showMessage({ error: error.toString() });
    } finally {
      toggleLoadingOverlay(false);
    }
  };

  const updateProductData = async () => {
    const productId = extractProductIdFromURL();
    const payload = constructPayload();
    const apiEndpoint = `${API_BASE_URL}/product-data/${productId}`;

    toggleLoadingOverlay(true);
    try {
      const response = await fetchWithAuth(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      showMessage(data);
      return true;
    } catch (error) {
      console.error("Error updating product data:", error);
      showMessage({ error: error.toString() });
      return false;
    } finally {
      toggleLoadingOverlay(false);
    }
  };

  const updatePolishProductData = async (modal = "") => {
    const productId = extractProductIdFromURL();
    const shopId = document.querySelector("#shopIdDropdown").value;
    const langId =
      document.querySelector("#langDropdown").value === "all"
        ? "pol"
        : document.querySelector("#langDropdown").value;
    const payload = constructProductPayload(langId, shopId, modal);
    const apiEndpoint = `${API_BASE_URL}/product-data/${productId}`;

    toggleLoadingOverlay(true);
    try {
      const response = await fetchWithAuth(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      showMessage(data, (place = "modal"));
      return true;
    } catch (error) {
      console.error("Error updating product data:", error);
      showMessage({ error: error.toString() }, (place = "modal"));
      localStorage.removeItem("tokenInfo");
      return false;
    } finally {
      toggleLoadingOverlay(false);
    }
  };

  const initializeScript = async () => {
    await appendCustomStyles();
    await addTabAndContent();
    modalPartGenerate();
    modalPartRephrase();
    await setupEventListeners();
  };

  initializeScript();
})();