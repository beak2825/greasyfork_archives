// ==UserScript==
// @name           Open GitHub files in VS Code
// @version        1.0.4
// @author         aminomancer
// @homepageURL    https://github.com/aminomancer/userscripts
// @supportURL     https://github.com/aminomancer/userscripts
// @namespace      https://github.com/aminomancer
// @match          https://github.com/*/*
// @grant          GM_listValues
// @grant          GM_getValue
// @grant          GM_setValue
// @description    When viewing a file on a known GitHub repo with a local clone, pressing the `\` key will open the file in VS Code. If a line is highlighted, the file will be opened to that line in VS Code.
// @license        CC-BY-NC-SA-4.0
// @icon           https://cdn.jsdelivr.net/gh/aminomancer/userscripts@latest/icons/vscode.svg
// @downloadURL https://update.greasyfork.org/scripts/473341/Open%20GitHub%20files%20in%20VS%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/473341/Open%20GitHub%20files%20in%20VS%20Code.meta.js
// ==/UserScript==

/* global GM_listValues, GM_getValue, GM_setValue */

// These are the default preference values. When the script is first installed,
// these values will be used to populate the preferences, which are stored by
// the userscript manager. To modify the preferences, don't edit the file here.
// Go to the Values tab in the userscript manager and edit them there.
const defaultPrefs = {
  // This script works by opening a URL with vscode's custom URL protocol. The
  // protocol name can be changed here. The default is "vscode", but if you use
  // VS Code Insiders, you should change it to "vscode-insiders".
  protocol_name: "vscode",
  // This is how the script knows what local file to open. This pref maps each
  // GitHub repo to the path of the local clone. If the repo name is "foo/bar",
  // then the path should be "/path/to/foo/bar". If a repo is not listed here,
  // it will not be opened in VS Code. Only use forward slashes, even on
  // Windows, since the path becomes part of a URL. You can also set a default
  // directory which will be used as a fallback if a repo is not specifically
  // listed here. If default_dir is set to "C:/Repos" then a repo called
  // "user123/example456" will be opened from "C:/Repos/example456".
  repos: {
    // default_dir: "/path/to/default_dir",
    // "user123/example456": "/path/to/user123/example456",
  },
};

for (const [key, value] of Object.entries(defaultPrefs)) {
  if (GM_getValue(key) === undefined) {
    GM_setValue(key, value);
  }
}

const prefs = {};
for (const key of GM_listValues()) {
  prefs[key] = GM_getValue(key);
}

function openInVSCode({ user, repo, filePath, lineNum }) {
  let repoPath = prefs.repos[`${user}/${repo}`];
  if (!repoPath) {
    if (prefs.repos.default_dir) {
      repoPath = `${prefs.repos.default_dir}/${repo}`;
    } else {
      return;
    }
  }
  let protocolURL = `${prefs.protocol_name}://file/${repoPath}/${filePath}`;
  if (lineNum) {
    protocolURL += `:${lineNum}`;
  }
  if (!protocolURL) {
    return;
  }
  let link = document.createElement("a");
  link.setAttribute("href", protocolURL);
  link.click();
}

function getForFilesView() {
  let fileView;
  let fileHeader;
  const hash = location.hash?.match(/#diff-(.*)/)?.[1]?.split("-")[0];
  let targetDiff = hash && `diff-${hash}`;
  let targetFile = targetDiff && document.getElementById(targetDiff);
  while (targetFile) {
    if (!targetFile.classList.contains("file")) {
      if (targetFile.classList.contains("selected-line")) {
        targetFile = targetFile.closest(".file");
        continue;
      }
      break;
    }
    const header = targetFile.querySelector(".file-header");
    const rect = header.getBoundingClientRect();
    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
      fileView = targetFile;
      fileHeader = header;
    }
    break;
  }

  if (!fileView) {
    const fileHeaders = document.querySelectorAll(".file-header");
    for (const header of fileHeaders) {
      const rect = header.getBoundingClientRect();
      if (
        Math.floor(
          Math.abs(rect.top - parseInt(getComputedStyle(header).top))
        ) === 0
      ) {
        fileHeader = header;
        fileView = fileHeader.closest(".file");
        break;
      }
    }
  }

  if (!fileView) {
    return null;
  }

  const selectedLine = fileView.querySelector(".selected-line");
  const lineNum = selectedLine?.dataset?.lineNumber;

  const fileMenu = fileHeader.querySelector(".dropdown details-menu");
  let fileDetails;
  for (const item of fileMenu.children) {
    let path = item.pathname;
    if (!path) continue;
    const match = path.match(/\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.*)/);
    if (!match) continue;
    const [, user, repo, , filePath] = match;
    fileDetails = { user, repo, filePath, lineNum };
    break;
  }

  return fileDetails;
}

function getForURL(url) {
  switch (typeof url) {
    case "string":
      url = new URL(url);
      break;
    case "object":
      if (url instanceof URL) break;
      if (url instanceof Location) break;
      if (url instanceof HTMLAnchorElement) {
        url = new URL(url.href);
        break;
      }
    // fall through
    default:
      return null;
  }
  const [, user, repo, , , ...pathParts] = url.pathname.split("/");
  if (!pathParts.length) return null;
  const lineNum = url.hash?.match(/^#L(\d+)/)?.[1];
  return { user, repo, filePath: pathParts.join("/"), lineNum };
}

function handleKeydown(event) {
  if (event.key === "\\") {
    if (document.querySelector("#files.diff-view")) {
      const fileDetails = getForFilesView();
      if (!fileDetails) return;
      event.preventDefault();
      openInVSCode(fileDetails);
    } else if (location.pathname.match(/^\/[^/]+\/[^/]+\/blob\//)) {
      const fileDetails = getForURL(location);
      if (!fileDetails) return;
      event.preventDefault();
      openInVSCode(fileDetails);
    } else if (document.querySelector(".js-navigation-container")) {
      const focusedItem = document.querySelector(
        ".js-navigation-item.navigation-focus"
      );
      if (!focusedItem) return;
      const rect = focusedItem.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        const link = focusedItem.querySelector("a.rgh-quick-file-edit");
        if (!link) return;
        const fileDetails = getForURL(link);
        if (!fileDetails) return;
        event.preventDefault();
        openInVSCode(fileDetails);
      }
    }
  }
}

document.addEventListener("keydown", handleKeydown);
