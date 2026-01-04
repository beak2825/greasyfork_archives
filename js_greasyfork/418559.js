// ==UserScript==
// @name            Hebrew-Arabic Dictionary AnkiConnect
// @namespace       http://tampermonkey.net/
// @version         0.3
// @description     Add dictionary entries from Rothfarb's Hebrew-Arabic dictionary directly to Anki
// @author          idane
// @match           https://rothfarb.info/ronen/arabic/*
// @require         https://code.jquery.com/jquery-3.5.1.min.js
// @require         https://cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js
// @require         https://cdn.jsdelivr.net/npm/axios-userscript-adapter@0.0.4/dist/axiosGmxhrAdapter.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.js
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_xmlhttpRequest
// @grant           GM_getValue
// @grant           GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/418559/Hebrew-Arabic%20Dictionary%20AnkiConnect.user.js
// @updateURL https://update.greasyfork.org/scripts/418559/Hebrew-Arabic%20Dictionary%20AnkiConnect.meta.js
// ==/UserScript==

// Axios setup
axios.defaults.adapter = axiosGmxhrAdapter;

// Constants
const currentPage = window.location.pathname.split("/").slice(-1).join("");

// GM_config setup

GM_config.init({
  id: "config",
  fields: {
    ankiConnectUrl: {
      label: "AnkiConnect URL",
      type: "text",
      default: "http://127.0.0.1:8765",
    },
    deckName: {
      label: "Deck Name",
      title: "The name of the deck in Anki",
      type: "text",
    },
    modelName: {
      label: "Model Name",
      title: "The name of the card model in Anki",
      type: "text",
    },
    arabicFieldName: {
      label: "Arabic Field Name",
      title: "The name of the Arabic field in the Anki model",
      type: "text",
      default: "Arabic",
    },
    hebrewFieldName: {
      label: "Hebrew Field Name",
      title: "The name of the Hebrew field in the Anki model",
      type: "text",
      default: "Hebrew",
    },
    englishTransliterationFieldName: {
      label: "English Transliteration Field Name",
      title: "The name of the English Transliteration field in the Anki model",
      type: "text",
      default: "English Transliteration",
    },
    hebrewTransliterationFieldName: {
      label: "Hebrew Transliteration Field Name",
      title: "The name of the Hebrew Transliteration field in the Anki model",
      type: "text",
      default: "Hebrew Transliteration",
    },
    typeFieldName: {
      label: "Type Field Name",
      title: "The name of the Type field in the Anki model",
      type: "text",
      default: "Type",
    },
    pluralityFieldName: {
      label: "Plurality Field Name",
      title: "The name of the Plurality field in the Anki model",
      type: "text",
      default: "Plurality",
    },
    genderFieldName: {
      label: "Gender Field Name",
      title: "The name of the Gender field in the Anki model",
      type: "text",
      default: "Gender",
    },
  },
});
// GM_config.open();

// Functions

// AnkiConnect

class AnkiConnectClient {
  constructor(url) {
    this.url = url;
  }

  async upsertNote(deckName, modelName, fields, ...tags) {
    try {
      await this.addNote(deckName, modelName, fields, ...tags);
    } catch (e) {
      if (e.message === "cannot create note because it is a duplicate") {
        const noteId = await this.findNote(deckName, fields);
        if (!noteId) {
          throw new Error(
            "note is a duplicate, but the original was not found"
          );
        }
      } else {
        throw e;
      }
    }
  }

  async updateNoteFields(id, fields) {
    await this._doAction("updateNoteFields", {
      note: {
        id,
        fields,
      },
    });
  }

  async addNote(deckName, modelName, fields, ...tags) {
    return await this._doAction("addNote", {
      note: {
        deckName,
        modelName,
        fields,
        options: {
          duplicateScope: "deck",
          duplicateScopeOptions: {
            deckName,
            checkChildren: true,
          },
        },
        tags,
      },
    });
  }

  async findNote(deckName, fields) {
    let query = `"deck:${deckName}"`;

    Object.keys(fields).forEach((key) => {
      if (fields[key]) {
        query += `"${key.replace('"', '\\"')}:${fields[key].replace(
          '"',
          '\\"'
        )}"`;
      }
    });
    const result = await this._doAction("findNotes", {
      query,
    });

    if (result && result.length) {
      return result[0];
    }
  }

  async _doAction(action, params) {
    const payload = {
      action,
      version: 6,
      params,
    };
    console.log("Sending", payload);
    const response = await axios.post(this.url, payload);

    const {
      data: { error, result },
    } = response;
    console.log(response);
    if (error) {
      throw new Error(error);
    }
    return result;
  }
}

// Others
function getFieldValue(key, defaultValue) {
  return GM_config.get(key) || defaultValue;
}
function appendFieldIfExists(object, key, value) {
  const fieldName = getFieldValue(key);
  if (fieldName) {
    object[fieldName] = value;
  }
}

function injectStylesheet(url) {
  $("head").append(`<link rel="stylesheet" href="${url}" type="text/css" />`);
}

function cleanText(text) {
  if (!text) {
    return "";
  }

  return text.trim();
}

function extractPayloadFromElement(element) {
  const attrElement = $(element).find(".attr");
  let arabicKey = ".arb > .harm";
  let hebrewKey = ".heb";
  let hebrewTransliterationKey = ".arb > .keter";
  if (currentPage !== "word.asp") {
    arabicKey = ".arb.harm";
    hebrewKey = ".heb > a";
    hebrewTransliterationKey = ".arb.keter";
  }
  const hebrew = $(element).find(hebrewKey).text();
  const arabic = $(element).find(arabicKey).text();
  const hebrewTransliteration = $(element)
    .find(hebrewTransliterationKey)
    .text();
  const englishTransliteration = $(element).find(".eng").text();
  const type = $(attrElement).find(".pos").text();
  const gender = $(attrElement).find(".gender").text();
  const plurality = $(attrElement).find(".number").text();

  return {
    hebrew: cleanText(hebrew),
    arabic: cleanText(arabic),
    hebrewTransliteration: cleanText(hebrewTransliteration),
    englishTransliteration: cleanText(englishTransliteration),
    type: cleanText(type),
    gender: cleanText(gender),
    plurality: cleanText(plurality),
  };
}

// Main body
window.addEventListener(
  "load",
  function () {
    injectStylesheet(
      "https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.css"
    );

    if(!getFieldValue("deckName") || !getFieldValue("modelName") || !getFieldValue("ankiConnectUrl")) {
      alert("Please configure the script!");
      GM_config.open();
    }

    const settingsLink = $("<li><a href='#'>Anki</a></li>");
    settingsLink.click(() => GM_config.open());
    $("#nav > ul").prepend(settingsLink)
    $(".result").each((i, element) => {
      const link = $(`<a href='#'>הוסף ל-Anki</a>`);
      const attrElement = $(element).find(".attr");
      if(!attrElement.length) {
        return;
      }
      link.click(async function (e) {
        e.preventDefault();
        e.stopPropagation();
        try {
          const payload = extractPayloadFromElement(element);
          const fields = {};

          const ankiConnectUrl = getFieldValue("ankiConnectUrl");
          if (!ankiConnectUrl) {
            throw new Error("AnkiConnect URL is not set, check settings!");
          }

          const deckName = getFieldValue("deckName");
          if (!deckName) {
            throw new Error("Deck name is not set, check settings!");
          }

          const modelName = getFieldValue("modelName");
          if (!modelName) {
            throw new Error("Model name is not set, check settings!");
          }

          appendFieldIfExists(fields, "arabicFieldName", payload.arabic);
          appendFieldIfExists(fields, "hebrewFieldName", payload.hebrew);
          appendFieldIfExists(
            fields,
            "englishTransliterationFieldName",
            payload.englishTransliteration
          );
          appendFieldIfExists(
            fields,
            "hebrewTransliterationFieldName",
            payload.hebrewTransliteration
          );
          appendFieldIfExists(fields, "typeFieldName", payload.type);
          appendFieldIfExists(fields, "pluralityFieldName", payload.plurality);
          appendFieldIfExists(fields, "genderFieldName", payload.gender);
          const client = new AnkiConnectClient(ankiConnectUrl);
          await client.addNote(deckName, modelName, fields, "rothfarb");
          $.toast({
            heading: "Success",
            text: "Card added successfully!",
            showHideTransition: "slide",
            icon: "success",
          });
        } catch (e) {
          $.toast({
            heading: "Error",
            text: e.message,
            showHideTransition: "slide",
            icon: "error",
          });
        }
      });
      const linkContainer = $("<div></div>");
      link.css({
            "font-size": "24px",
            "text-decoration": "none",
            "color": "grey"
      });
      linkContainer.append(link);
      $(linkContainer).insertAfter($(element).find(".eng"));
    });
  },
  false
);