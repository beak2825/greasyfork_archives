// ==UserScript==
// @name         e6ai Auto Tag
// @icon         https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/72x72/1f3f7.png
// @description  Automatically fills in the e6ai upload form with tags and other info from the image.
// @license      MIT
// @version      1
// @match        https://e6ai.net/uploads/new
// @grant        GM_xmlhttpRequest
// @connect      e621.net
// @require      https://cdn.jsdelivr.net/npm/exifreader@4.20.0
// @namespace https://greasyfork.org/users/25864
// @downloadURL https://update.greasyfork.org/scripts/486900/e6ai%20Auto%20Tag.user.js
// @updateURL https://update.greasyfork.org/scripts/486900/e6ai%20Auto%20Tag.meta.js
// ==/UserScript==

// @ts-check // use `deno check` to type-check this file
/// <reference lib="DOM" />
/// <reference lib="DOM.Iterable" />

(() => {
  // only for types
  import("npm:@types/greasemonkey@4.0.7");
  import("npm:exifreader@4.20.0");
});

// Constants - Modify them to your liking
/**
 * Put your name here
 * @type {string | undefined}
 */
const DEFAULT_DIRECTOR = undefined;
/**
 * @type {string | null | undefined}
 */
const DEFAULT_SOURCE = undefined;
/**
 * Tags/words that you use but they don't actually change anything
 * @type {Array<string | RegExp>}
 */
const IGNORE_TAGS = ["view", /^hi_?res$/, "photorealism", /$realistic/];
/**
 * @type {boolean}
 */
const ADD_PARAMS_IN_DESC = true;
/**
 * @type {boolean}
 */
const INCLUDE_ARTISTS = false;

{
  // make file input bigger for easier drag and drop
  const style = document.createElement("style");
  style.textContent = `
  input[type="file"] {
    border: 2px dashed #ccc;
    padding: 32px;
    background-color: transparent;
  }
  `;
  document.head.appendChild(style);
}

{
  // add file input event listener
  const fileInput = document.querySelector("input[type=file]");
  if (!(fileInput instanceof HTMLInputElement)) {
    throw new Error("File input not found");
  }
  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    handleFile(file);
  });
}

/**
 * @param {File} file
 */
async function handleFile(file) {
  // get prompt from image
  const buffer = await file.arrayBuffer();
  const infoString = getImageInfo(buffer);
  if (!infoString) throw new Error("Image info not found");
  const info = parseImageInfo(infoString);
  const promptTags = info.prompt;
  if (!promptTags) throw new Error("Prompt is empty");

  // fill in form - source
  if (DEFAULT_SOURCE !== undefined) {
    if (DEFAULT_SOURCE != null) {
      const elem = document.querySelector(".upload-source-row input");
      if (elem instanceof HTMLInputElement) {
        elem.scrollIntoView({ behavior: "smooth", block: "nearest" });
        await setInputValue(elem, DEFAULT_SOURCE);
        await delay(250);
      }
    } else {
      const elem = document.getElementById("no_source");
      if (elem instanceof HTMLInputElement && !elem.checked) {
        elem.scrollIntoView({ behavior: "smooth", block: "nearest" });
        elem.click();
        await delay(250);
      }
    }
  }
  // fill in form - director
  if (DEFAULT_DIRECTOR) {
    const elem = document.getElementById("post_directors");
    if (elem instanceof HTMLTextAreaElement) {
      elem.scrollIntoView({ behavior: "smooth", block: "nearest" });
      await setInputValue(elem, DEFAULT_DIRECTOR);
      await delay(250);
    }
  }
  // fill in form - tags
  const tagsField = document.getElementById("post_tags");
  if (!(tagsField instanceof HTMLTextAreaElement)) {
    throw new Error("Tags field not found");
  }
  try {
    await setInputValue(tagsField, "");
    tagsField.disabled = true;
    tagsField.scrollIntoView({ behavior: "smooth", block: "nearest" });
    for await (const tag of cleanTags(promptTags)) {
      if (
        IGNORE_TAGS.some((ignore) =>
          typeof ignore == "string" ? tag === ignore : tag.match(ignore)
        )
      ) continue;
      await setInputValue(tagsField, tag, true);
    }
  } finally {
    tagsField.disabled = false;
  }
  // fill in form - description
  if (ADD_PARAMS_IN_DESC) {
    const elem = document.getElementById("post_description");
    if (elem instanceof HTMLTextAreaElement) {
      elem.scrollIntoView({ behavior: "smooth", block: "nearest" });
      await setInputValue(
        elem,
        "\n[section=Parameters]\n" + infoString + "\n[/section]",
      );
    }
  }
}

/**
 * Just setting `input.value = value` doesn't always work for some reason.
 *
 * @param {Element} input
 * @param {string} value
 * @param {boolean} [add=false]
 */
async function setInputValue(input, value, add = false) {
  if (
    !(input instanceof HTMLInputElement) &&
    !(input instanceof HTMLTextAreaElement)
  ) return;

  // retry setting value until it actually changes
  let attempts = 0;
  while (true) {
    attempts++;
    const newValue = add && input.value ? input.value + " " + value : value;
    input.value = newValue;
    await delay(100);
    if (input.value === newValue) {
      if (attempts > 1) {
        console.warn(
          `Set ${input.id ?? input.tagName} value after ${attempts} attempts`,
        );
      }
      break;
    }
  }

  // dispatch events so the js on the page runs too
  input.dispatchEvent(new InputEvent("input"));
  input.dispatchEvent(new InputEvent("change"));
}

/**
 * @param {number} t
 */
const delay = (t) => new Promise((resolve) => setTimeout(resolve, t));

/**
 * Uses ExifReader to read the text embedded in the image.
 * For JPG reads the "UserComment" tag, for PNG reads the "parameters" tag.
 *
 * @param {ArrayBuffer} imageBuffer
 */
function getImageInfo(imageBuffer) {
  const info = globalThis.ExifReader.load(imageBuffer);
  if (info.UserComment?.value && Array.isArray(info.UserComment.value)) {
    // JPEG image
    return String.fromCharCode(
      ...info.UserComment.value
        .filter(/** @returns {val is number} */ (val) => typeof val == "number")
        .filter((char) => char !== 0),
    ).replace("UNICODE", "");
  }
  if (info.parameters?.description) {
    // PNG image
    return info.parameters.description;
  }
}

/**
 * Reads the parameters string that stable-diffusion-webui puts in images.
 *
 * Example:
 * ```
 * foo, bar, baz
 * Negative prompt: a, b, c
 * Param: 1
 * ```
 * returns:
 * ```
 * {
 *   prompt: ["foo", "bar", "baz"],
 *   "negative prompt": ["a", "b", "c"],
 *   param: ["1"],
 * }
 * ```
 *
 * @param {string} infoString
 */
function parseImageInfo(infoString) {
  const tags = infoString.split(/[,;\n]/)
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
  let lastKey = "prompt";
  const info = /** @type {Record<string, string[]>} */ ({});
  for (const tag of tags) {
    const parts = tag.split(/:\s+/)
      .map((part) => part.trim().toLowerCase());
    const [key, value] = parts.length === 1
      ? [null, parts[0]]
      : [parts[0], parts.slice(1).join(": ")];
    if (key) lastKey = key;
    if (value) {
      if (!info[lastKey]) info[lastKey] = [];
      info[lastKey].push(value);
    }
  }
  return info;
}

/**
 * Takes tags from prompt and turns them into tags that exist on e621.
 *
 * @param {string[]} promptTags
 */
async function* cleanTags(promptTags) {
  for (let tag of promptTags) {
    if (tag.length < 3) continue;

    // skip lora tags
    if (tag.startsWith("<lora:")) continue;
    // change spaces to underscores
    tag = tag.replace(/\s+/g, "_");
    // remove (tag) and (tag:strength) syntax
    const strengthRegexp = /\((.*?)(:[\d.]+)?\)/;
    while (tag.match(strengthRegexp)) {
      tag = tag.replace(strengthRegexp, "$1");
    }
    // remove [tag] and [tag:strength] syntax
    const strengthRegexp2 = /\[(.*?)(:[\d.]+)?\]/;
    while (tag.match(strengthRegexp2)) {
      tag = tag.replace(strengthRegexp2, "$1");
    }
    // remove "by_" prefix
    if (tag.startsWith("by_")) tag = tag.slice("by_".length);

    // search for tag on e621
    try {
      const tagStats = await getTagStatsMemoized(tag);
      if (
        tagStats?.post_count && tagStats.category !== 6 &&
        (INCLUDE_ARTISTS || tagStats.category !== 1)
      ) {
        yield tagStats.name;
      }

      const words = tag.split("_");
      if (words.length > 1) {
        // also try every word separately
        for (const word of words) {
          if (word.length < 3) continue;
          const wordStats = await getTagStatsMemoized(word);
          if (
            wordStats?.post_count && wordStats.category !== 6 &&
            (INCLUDE_ARTISTS || wordStats.category !== 1)
          ) {
            yield wordStats.name;
          }
        }
      }
    } catch (err) {
      console.error(`Failed to get data for tag ${tag}:`, err);
      continue;
    }
  }
}

const getTagStatsMemoized = localStorageMemoize("e6tag", getTagStats);

/**
 * @param {string} tagName
 * @returns {Promise<E6Tag | null>}
 */
async function getTagStats(tagName) {
  // request main tag
  /** @type {E6Tag[]} */
  const [tag] = await fetchE6("/tags.json?", {
    "search[name_matches]": tagName,
  })
    // returns an object when empty for some reason
    .then((data) => Array.isArray(data) ? data : []);
  if (tag) {
    return tag;
  }

  // no main tag found. try to find an alias
  /** @type {E6TagAlias[]} */
  const [alias] = await fetchE6("/tag_aliases.json", {
    "search[name_matches]": tagName,
  }).then((data) => Array.isArray(data) ? data : []);
  if (alias) {
    const [tag] = await fetchE6("/tags.json?", {
      "search[name_matches]": alias.antecedent_name,
    }).then((data) => Array.isArray(data) ? data : []);
    return tag;
  }

  return null;
}

/**
 * Make a function remember its return value for a given set of arguments.
 *
 * @template {Array<string | number>} Args
 * @template Result
 * @param {string} keyPrefix
 * @param {(...args: Args) => Promise<Result>} fn
 * @returns {(...args: Args) => Promise<Result>}
 */
function localStorageMemoize(keyPrefix, fn) {
  return async (...args) => {
    const key = `${keyPrefix}:${args.join(":")}`;
    const json = localStorage.getItem(key);
    if (json != null) return JSON.parse(json);
    const value = await fn(...args);
    if (value !== undefined) localStorage.setItem(key, JSON.stringify(value));
    return value;
  };
}

/**
 * @typedef {object} E6Tag
 * @prop {string} name
 * @prop {number} post_count
 * @prop {number} category - 0 = general, 1 = artist, 6 = invalid
 */

/**
 * @typedef {object} E6TagAlias
 * @prop {string} antecedent_name
 * @prop {string} consequent_name
 * @prop {number} post_count
 */

/**
 * @param {string} path
 * @param {Record<string, string>} [params]
 */
function fetchE6(path, params) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, "https://e621.net/");
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.append(key, value);
      }
    }
    // return fetch(url.href, {
    //   .then((resp) =>
    //     resp.status === 200 ? resp.json() : Promise.reject(resp.statusText)
    //   );
    GM.xmlHttpRequest({
      method: "GET",
      url: url.href,
      responseType: "json",
      timeout: 10_000,
      onload: (resp) => {
        if (resp.status === 200) {
          resolve(resp.response);
        } else {
          reject(new Error(resp.statusText));
        }
      },
      onerror: (err) => {
        reject(err);
      },
    });
  });
}
