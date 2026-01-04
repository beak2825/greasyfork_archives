// ==UserScript==
// @name           audioz-utils
// @author         Metaller
// @description    Batch downloading, post hiding, etc. for AudioZ
// @grant          GM_xmlhttpRequest
// @match          https://audioz.download/*
// @run-at         document-end
// @version        1.1.0
// @license        MIT
// @namespace https://greasyfork.org/users/753942
// @downloadURL https://update.greasyfork.org/scripts/509326/audioz-utils.user.js
// @updateURL https://update.greasyfork.org/scripts/509326/audioz-utils.meta.js
// ==/UserScript==
function getTextArrayFromInput(input) {
  return input.trim().split(",").map((category) => category.trim()).filter((category) => category !== "" && category !== ",");
}
function shouldFilterPostByCategory(post, filteredCategories) {
  const categories = post.querySelectorAll("header > span > a");
  for (const category of categories)
    if (shouldFilterCategory(category, filteredCategories))
      return !0;
  return !1;
}
function shouldFilterCategory(category, filteredCategories) {
  const href = category.getAttribute("href");
  if (href === null)
    return !1;
  for (const filteredCategory of filteredCategories)
    if (href.includes(filteredCategory))
      return !0;
  return !1;
}
function shouldFilterPostByText(post, filteredTexts) {
  const innerText = post.innerText;
  for (const filteredText of filteredTexts)
    if (innerText.includes(filteredText))
      return !0;
  return !1;
}
function createInputForm({ title, inputFields, idPrefix }) {
  const inputForm = document.createElement("div");
  inputForm.style.fontSize = "14px";
  const inputFieldsHtml = inputFields.map(
    (field) => `
    <label for="${idPrefix}-${field.storageKey}" style="margin-bottom: 5px;">${field.title}:</label>
    <textarea id="${idPrefix}-${field.storageKey}" type="text" title="Separate the entries with ','" style="font-size: 12px; width: 100%; background: none; overflow: hidden">
${field.values.join(", ")},
    </textarea>
  `
  ).join("");
  inputForm.innerHTML = `
    <div style="padding-left: 5px; display: inline-flex; flex-direction: column; align-items: center; width: 100%; font-family: tradegothic,century gothic,CenturyGothic,AppleGothic,sans-serif">
        <h4 style="color: #997e33; align-self: start; padding-left: 10px; margin-bottom: 5px;">${title}</h4>
        <form id="hiddenPostsForm" class="post neon nBrown" style="margin-top: 5px; display: flex; flex-direction: column; width: 95%; font-size: 12px; word-wrap: break-word;">
            ${inputFieldsHtml}
            <input id="${idPrefix}-save-btn" type="button" style="font-size: 12px; margin-bottom: 10px;" class="fbutton doaddcomment" value="Save and Refresh">
        </form>
    <div/>
    `;
  const saveButton = inputForm.querySelector(`#${idPrefix}-save-btn`);
  if (!(saveButton instanceof HTMLInputElement))
    return;
  saveButton.onclick = () => {
    for (const field of inputFields) {
      const inputElement = inputForm.querySelector(`#${idPrefix}-${field.storageKey}`);
      inputElement && window.localStorage.setItem(field.storageKey, inputElement.value);
    }
    window.location.reload();
  };
  const menu = document.getElementById("StickyNav");
  menu == null || menu.appendChild(inputForm);
}
const categoryStorageKey$1 = "AudiozUtils_HiddenPosts_categories", textStorageKey$1 = "AudiozUtils_HiddenPosts_texts";
function hidePosts() {
  hidePostsByCategory(
    getTextArrayFromInput(window.localStorage.getItem(categoryStorageKey$1) ?? "samples/loop"),
    getTextArrayFromInput(window.localStorage.getItem(textStorageKey$1) ?? "REQ")
  );
}
function hidePostsByCategory(filteredCategories, filteredTexts) {
  var _a;
  const posts = document.querySelectorAll("article"), postsToHide = [];
  for (const post of posts) {
    if (((_a = post.parentElement) == null ? void 0 : _a.id) === "inside")
      return;
    (shouldFilterPostByCategory(post, filteredCategories) || shouldFilterPostByText(post, filteredTexts)) && postsToHide.push(post);
  }
  createPostContainer$1(postsToHide), createInputForm({
    title: "Hidden Posts",
    idPrefix: "hidden-posts",
    inputFields: [
      {
        title: "Hidden Categories",
        storageKey: categoryStorageKey$1,
        values: filteredCategories
      },
      {
        title: "Hidden Words",
        storageKey: textStorageKey$1,
        values: filteredTexts
      }
    ]
  });
}
function createPostContainer$1(posts) {
  if (posts.length === 0)
    return;
  const container = document.createElement("div");
  container.setAttribute("id", "hidden"), container.className = "post neon nBrown";
  const containerTitle = document.createElement("h3");
  containerTitle.innerHTML = `
  <span>hidden posts<span>
  `, container.appendChild(containerTitle);
  for (const originalPost of posts) {
    const originalPostLink = originalPost.querySelector("article > a");
    if (originalPostLink === null)
      continue;
    const originalTitle = originalPostLink.firstElementChild.innerText, postSummary = originalPostLink.cloneNode();
    postSummary.style.fontSize = "14px", postSummary.innerText = originalTitle, container.appendChild(postSummary), originalPost.style.display = "none";
  }
  const main2 = document.querySelector("main"), nav = (main2 == null ? void 0 : main2.lastElementChild) ?? void 0;
  main2 !== null && nav !== void 0 && main2.insertBefore(container, nav);
}
const downloadHosterStorageKey = "AudiozUtils_DownloadLinks_host", categoryStorageKey = "AudiozUtils_DownloadLinks_categories", textStorageKey = "AudiozUtils_DownloadLinks_texts", checkboxStateStorageKey = "AudiozUtils_DownloadLinks_enabled";
function extractDownloadLinks() {
  const selectedHoster = getTextArrayFromInput(window.localStorage.getItem(downloadHosterStorageKey) ?? "katfile"), filteredCategories = getTextArrayFromInput(window.localStorage.getItem(categoryStorageKey) ?? ""), filteredTexts = getTextArrayFromInput(window.localStorage.getItem(textStorageKey) ?? "");
  createInputForm({
    title: "Download Links",
    idPrefix: "download-links",
    inputFields: [
      {
        title: "Hosts",
        storageKey: downloadHosterStorageKey,
        values: selectedHoster
      },
      {
        title: "Selected Categories",
        storageKey: categoryStorageKey,
        values: filteredCategories
      },
      {
        title: "Selected Words",
        storageKey: textStorageKey,
        values: filteredTexts
      }
    ]
  });
  const posts = document.querySelectorAll("article:not([style*='display: none'])");
  return processPosts(Array.from(posts), selectedHoster, filteredCategories, filteredTexts);
}
async function processPosts(posts, hosts, filteredCategories, filteredTexts) {
  const foundLinks = /* @__PURE__ */ new Set(), { container, checkbox } = createDownloadLinksSection();
  if (!checkbox.checked)
    return;
  addCopyLinksButton(foundLinks, container);
  const { progressElm, startElm } = addProgressElement(container);
  await Promise.all(
    posts.map(async (post) => {
      const postLink = post.querySelector("a.permalink");
      if (!(postLink instanceof HTMLAnchorElement))
        return;
      const postProgressElm = addPostProgressMessage(postLink, progressElm);
      let found = 1;
      try {
        found = await processPost(
          foundLinks,
          postLink,
          container,
          progressElm,
          hosts,
          filteredCategories,
          filteredTexts
        );
      } catch (error) {
        console.error(`Error processing post ${postLink.href}`, error), found = 1;
      }
      postProgressElm.remove(), !(found === 0 || found === 2 || postLink.href === window.location.href) && addPostErrorMessage(postLink, post, progressElm);
    })
  ), startElm.remove();
}
function createDownloadLinksSection() {
  const container = createPostContainer(), checkbox = addCheckbox(container), main2 = document.querySelector("main"), header = (main2 == null ? void 0 : main2.querySelector("header")) ?? void 0;
  return main2 !== null && header !== void 0 && header.appendChild(container), { container, checkbox };
}
function addCheckbox(container) {
  const checkboxLabel = document.createElement("label");
  checkboxLabel.style.margin = "10px", checkboxLabel.className = "fbutton";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox", checkbox.style.margin = "10px";
  const savedCheckboxState = localStorage.getItem(checkboxStateStorageKey);
  return checkbox.checked = savedCheckboxState === null ? !0 : JSON.parse(savedCheckboxState), checkboxLabel.innerText = checkbox.checked ? "Disable and Refresh" : "Enable and Refresh", checkbox.addEventListener("change", (event) => {
    localStorage.setItem(checkboxStateStorageKey, JSON.stringify(checkbox.checked)), window.location.reload();
  }), checkboxLabel.appendChild(checkbox), container.appendChild(checkboxLabel), checkbox;
}
function addProgressElement(container) {
  const progressElm = document.createElement("div"), startElm = document.createElement("p");
  return startElm.innerHTML = "Extracting download links... (grant permissions if prompted)", progressElm.appendChild(startElm), container.appendChild(progressElm), { progressElm, startElm };
}
function addCopyLinksButton(foundLinks, container) {
  const copyButton = document.createElement("button");
  copyButton.innerText = "Copy all download links", copyButton.style.margin = "10px", copyButton.style.fontSize = "14px", copyButton.className = "fbutton", copyButton.addEventListener("click", () => {
    const downloadLinks = [...foundLinks].map((link) => link.downloadLink).join(`
`);
    navigator.clipboard.writeText(downloadLinks).catch((err) => {
      console.error("Failed to copy text: ", err);
    });
  }), container.appendChild(copyButton);
}
function addPostProgressMessage(postLink, progressElm) {
  const postProgressElm = document.createElement("p");
  return postProgressElm.innerHTML = `Processing ${postLink.href}...`, postProgressElm.style.fontSize = "8px", progressElm.appendChild(postProgressElm), postProgressElm;
}
function addPostErrorMessage(postLink, post, progressElm) {
  var _a;
  const noPeeplink = document.createElement("div");
  noPeeplink.style.display = "flex", noPeeplink.style.alignItems = "center";
  const a = document.createElement("a");
  a.href = postLink.href, a.innerText = ((_a = post.querySelector("h2")) == null ? void 0 : _a.innerText) ?? postLink.href, a.style.fontSize = "12px", a.style.color = "red", a.style.marginRight = "10px", noPeeplink.appendChild(a);
  const noPeeplinkText = document.createElement("p");
  noPeeplinkText.innerText = "Error or no download link matched to the given hosts.", noPeeplinkText.style.color = "red", noPeeplinkText.style.fontSize = "12px", noPeeplink.appendChild(noPeeplinkText), noPeeplink.style.height = "18px", progressElm.appendChild(noPeeplink);
}
async function processPost(foundLinks, postLink, container, progressElm, hosts, filteredCategories, filteredTexts) {
  const postElement = await fetchPostElement(postLink);
  if (postElement === null)
    return 1;
  if (filteredCategories.length > 0 && !shouldFilterPostByCategory(postElement, filteredCategories) || filteredTexts.length > 0 && !shouldFilterPostByText(postElement, filteredTexts))
    return 2;
  const peeplinks = postElement.querySelectorAll("a[href*='peeplink']");
  let found = 1;
  for (const peeplink of peeplinks) {
    if (!(peeplink instanceof HTMLAnchorElement)) {
      addNoPeeplinkMessage(postLink, progressElm);
      continue;
    }
    if (peeplink.href !== "http://peeplink.in/" && (found = await fetchAndProcessPeeplink(peeplink, hosts, postElement, container, progressElm, postLink, foundLinks), found === 0 || found === 2))
      break;
  }
  return found;
}
function addPeeplinkLink(peeplink, container, progressElm) {
  const downloadLink = peeplink.cloneNode();
  downloadLink.style.fontSize = "14px", downloadLink.innerText = peeplink.href, container.insertBefore(downloadLink, progressElm);
}
async function fetchAndProcessPeeplink(peeplink, hosts, postElement, container, progressElm, postLink, foundLinks) {
  return typeof GM > "u" ? (addNoGMMessage(progressElm), addPeeplinkLink(peeplink, container, progressElm), 0) : await new Promise((resolve) => {
    GM.xmlHttpRequest({
      method: "GET",
      url: peeplink.href,
      onload: (response) => {
        let found = 1;
        for (const host of hosts) {
          const dlLink = new DOMParser().parseFromString(response.responseText, "text/html").querySelector(`a[href*='${host}']`);
          if (dlLink === null)
            continue;
          const { postTitle, downloadLink } = addDownloadLinkButton(dlLink, postElement, host, container, progressElm), audioDownloadInfo = addRemmoveButton(postLink, postTitle, dlLink, downloadLink, foundLinks);
          foundLinks.add(audioDownloadInfo), found = 0;
          break;
        }
        resolve(found);
      }
    });
  });
}
async function fetchPostElement(postLink) {
  if (postLink.href === window.location.href)
    return window.document.querySelector("article");
  const postText = await (await fetchWithRetry(postLink.href)).text();
  return new DOMParser().parseFromString(postText, "text/html").querySelector("article");
}
function addDownloadLinkButton(dlLink, postElement, host, container, progressElm) {
  const downloadLink = dlLink.cloneNode();
  downloadLink.style.fontSize = "14px";
  const postTitle = postElement.querySelector("h1");
  return postTitle !== null && (downloadLink.title = postTitle.innerText), downloadLink.innerText = `(${host}) ${((postTitle == null ? void 0 : postTitle.innerText) ?? "").substring(0, 100)}`, container.insertBefore(downloadLink, progressElm), { postTitle, downloadLink };
}
function addRemmoveButton(postLink, postTitle, dlLink, downloadLink, foundLinks) {
  const removeButton = document.createElement("span");
  removeButton.innerText = "❌", removeButton.title = "Remove this download link", removeButton.style.marginLeft = "10px", removeButton.style.fontSize = "x-small", removeButton.className = "fbutton", removeButton.style.background = "none", removeButton.style.display = "inline-block";
  const audioDownloadInfo = {
    postLink: postLink.href,
    title: (postTitle == null ? void 0 : postTitle.innerText) ?? "",
    downloadLink: dlLink.href
  };
  return removeButton.addEventListener("click", (e) => {
    downloadLink.remove(), removeButton.remove(), foundLinks.delete(audioDownloadInfo), e.preventDefault();
  }), downloadLink.appendChild(removeButton), audioDownloadInfo;
}
function addNoPeeplinkMessage(postLink, progressElm) {
  if (postLink.href === window.location.href)
    return;
  const noPeeplink = document.createElement("p");
  noPeeplink.innerHTML = `No peeplink found in ${postLink.href}`, noPeeplink.style.color = "red", progressElm.appendChild(noPeeplink);
}
function addNoGMMessage(progressElm) {
  const noGMAPI = document.createElement("p");
  noGMAPI.innerHTML = "GM API is not available. Please install Tampermonkey or Violentmonkey.", noGMAPI.style.color = "red", progressElm.appendChild(noGMAPI);
}
function createPostContainer() {
  const container = document.createElement("section");
  container.setAttribute("id", "download-links"), container.className = "feed neon nBrown";
  const containerTitle = document.createElement("h3");
  return containerTitle.innerHTML = `
  <span>Download Links<span>
  `, container.appendChild(containerTitle), container.style.marginTop = "20px", container;
}
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1e3) {
  for (let attempt = 0; attempt < retries; attempt++)
    try {
      const response = await fetch(url, options);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return response;
    } catch (error) {
      if (attempt < retries - 1)
        console.warn(`Fetch attempt ${attempt + 1} failed. Retrying in ${delay}ms...`, error), await new Promise((resolve) => setTimeout(resolve, delay));
      else
        throw console.error(`Fetch failed after ${retries} attempts`, error), error;
    }
  throw new Error("Fetch failed");
}
function main() {
  return hidePosts(), extractDownloadLinks();
}
main().catch(console.error);
//# sourceMappingURL=audioz-utils.js.map
