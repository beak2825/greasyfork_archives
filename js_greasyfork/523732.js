// ==UserScript==
// @name        ST QR Collection Importer
// @namespace   Violentmonkey Scripts
// @match       http://127.0.0.1:8000/*
// @grant       none
// @version     1.0
// @author      creamy
// @license     MIT
// @description SillyTavern QuickReply preset collection importer.
// @downloadURL https://update.greasyfork.org/scripts/523732/ST%20QR%20Collection%20Importer.user.js
// @updateURL https://update.greasyfork.org/scripts/523732/ST%20QR%20Collection%20Importer.meta.js
// ==/UserScript==
(function() {
  "use strict";


  window.addEventListener("load", init);


  function init() {
    //main cont
    const main = document.createElement("div");
    main.setAttribute("id", "main");
    main.setAttribute("class", "popup");
    Object.assign(main.style, {
      width: "auto",
      height: "auto",
      margin: "auto",
      padding: "5px",
      position: "absolute",
      top: "5px",
      right: "5px",
      zIndex: "99999",
      opacity: "70%"
    })

    const fALink = document.createElement("link");
    fALink.setAttribute("rel", "stylesheet");
    fALink.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
    main.appendChild(fALink);

    //logo button
    const logo = document.createElement("div");
    logo.innerHTML = '<i class="fa-solid fa-file-import"></i>';
    logo.setAttribute("id", "showbtn");
    logo.setAttribute("class", "menu_button");
    Object.assign(logo.style, {
      fontSize: "1.5em",
      float: "right"
    })

    //Update presets title
    const updateLabel = document.createElement("div");
    updateLabel.innerText = "Import QR preset collection";
    Object.assign(updateLabel.style, {
      textAlign: "center",
      fontSize: "1.2em",
      width: "200px",
      display: "none"
    })

    //logo title container
    const logoTitleCont = document.createElement("div");
    logoTitleCont.appendChild(updateLabel);
    logoTitleCont.appendChild(logo);
    Object.assign(logoTitleCont.style, {
      padding: "2px",
      display: "flex",
      gap: "5px",
      alignItems: "center"
    })

    //input
    const inputCol = document.createElement("input");
    inputCol.setAttribute("id", "inputCol");
    inputCol.setAttribute("name", "inputCol");
    inputCol.setAttribute("type", "text");
    inputCol.setAttribute("class", "text-pole")
    Object.assign(inputCol.style, {
      display: "none",
      backgroundColor: "#3a7a41"
    })

    //button
    const button = document.createElement("button");
    button.setAttribute("id", "updatebtn");
    button.setAttribute("type", "button");
    button.setAttribute("class", "menu_button");
    button.innerText = "Import";
    Object.assign(button.style, {
      display: "none",
    })

    //append to document
    main.appendChild(logoTitleCont);
    main.appendChild(inputCol);
    main.appendChild(button);
    document.querySelector("body").appendChild(main);

    logo.addEventListener("click", function() {
      if(updateLabel.style.display === "none") {
        updateLabel.style.display = "block";
        inputCol.style.display = "block";
        button.style.display = "flex";
        logo.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
      }
      else {
        updateLabel.style.display = "none";
        inputCol.style.display = "none";
        button.style.display = "none";
        logo.innerHTML = '<i class="fa-solid fa-file-import"></i>';
      }
    });

    button.addEventListener("click", async function handleImportBtnClick() {
      toastr.info("Importing... Please wait.");
      const presets = await getPresets(inputCol.value)
      importQRS(presets.map((preset) => preset.link))
    });
  }


  const noCacheParam = `${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
  async function getPresets(inputLink) {
    return new Promise(async (resolve, reject) => {
      const corsProxyUrl = `https://corsproxy.io/?url=${inputLink}?nocache=${noCacheParam}`
      const response = await fetch(corsProxyUrl)
      if(response.status === 200) {
        try {
          const presetsFromLink = await response.json()
          resolve([...presetsFromLink])
        }
        catch {
          toastr.error("Import failed.")
        }
      }
      else {
        console.error(`Error with the link: ${inputLink}`)
        toastr.error(`Error with the link: ${inputLink}`)
      }
    })
  }


  //Credits: rentry.org/stscript
  async function importQRS(QR_JSON_URLS) {
    //put your json urls here
    //const QR_JSON_URLS = [];

    /**
     *  DO NOT FUCK AROUND WITH THE STUFF BELOW
     *  UNLESS YOU KNOW WHAT YOU ARE DOING
     */


    /**
     * Loads SillyTavern QuickReply API instance
     *
     * @returns {Promise<QuickReplyApi>}
     */
    const loadQrApi = async () => {
        const { quickReplyApi } = await import('./scripts/extensions/quick-reply/index.js');
        return quickReplyApi;
    }

    /**
     * Fetches JSON object from a given URL
     *
     * @param {string} url - The URL to get the JSON from
     *
     * @returns {Promise<object>} - The parsed Object
     */
    const fetchJson = async (url) => {
        const corsProxyUrl = "https://corsproxy.io/?url=";
        const response = await fetch(`${corsProxyUrl}${url}?nocache=${noCacheParam}`);

        return await response.json();
    }

    /**
     * Update a QuickReply withing a QuickReplySet;
     * This will overwrite the set
     *
     * @param {QuickReplyApi} api - The ST QR API instance
     * @param {QuickReplySet} set - The QuickReplySet in which to update the QuickReply
     * @param {QuickReply} qr - The QuickReply data to update with
     *
     * @returns {Promise<void>}
     */
    const updateQuickReply = async (api, set, qr) => {
        console.log("Updating existing qr", qr, "in set", set);
        api.updateQuickReply(set.name, qr.label, { ...qr });
    };

    /**
     * Create a QuickReply within a QuickReplySet
     *
     * @param {QuickReplyApi} api - The ST QR API instance
     * @param {QuickReplySet} set - The QuickReplySet in which to create the QuickReply
     * @param {QuickReply} qr - The QuickReply to create
     *
     * @returns {Promise<void>}
     */
    const createQuickReply = (api, set, qr) => {
        console.log("Creating new qr", qr, "in set", set);
        api.createQuickReply(set.name, qr.label, { ...qr });
    };

    /**
     * Update an already existing QuickReplySet;
     * This will overwrite the qr
     *
     * @param {QuickReplyApi} api - The ST QR API instance
     * @param {QuickReplySet} set - The already existing QuickReplySet
     * @param {object} data - The data to update the set with
     *
     * @returns {Promise<void>}
     */
    const updateQuickReplySet = async (api, set, data) => {
        console.log("Updating set", set, data);

        await api.updateSet(set.name, { ...data });

        for (const qr of data.qrList) {
            const existingQr = await api.getQrByLabel(set.name, qr.label);

            if (existingQr) {
                await updateQuickReply(api, set, qr);
            } else {
                await createQuickReply(api, set, qr);
            }
        }
    }

    /**
     * Create a new QuickReplySet
     *
     * @param {QuickReplyApi} api - The ST QR API instance
     * @param {object} data - The data to create the set with
     *
     * @returns {Promise<void>}
     */
    const createQuickReplySet = async (api, data) => {
        console.log("Creating new set", data);

        const set = await api.createSet(data.name);
        return updateQuickReplySet(api, set, data);
    }

    // Main
    const api = await loadQrApi();

    for (const url of QR_JSON_URLS) {
        console.log("Loading", url);

        try {
            const data = await fetchJson(url);
            const set = await api.getSetByName(data.name);

            if (set) {
                await updateQuickReplySet(api, set, data);
            } else {
                await createQuickReplySet(api, data);
            }
        } catch (e) {
            console.error("Failed to load", url, e);
            toastr.error("Failed to load: " + url + " " + e);
        }
    }

    toastr.success("QR import success. Reload the page.");
  }


})()