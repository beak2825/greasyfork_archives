// ==UserScript==
// @name        GreasyForum
// @description Easy access to user scripts from forum posts on cool sites with forums
// @match       https://animebytes.tv/forums.php?*action=viewthread*
// @match       https://broadcasthe.net/forums.php?*action=viewthread*
// @match       https://gazellegames.net/forums.php?*action=viewthread*
// @match       https://orpheus.network/forums.php?*action=viewthread*
// @match       https://passthepopcorn.me/forums.php?*action=viewthread*
// @match       https://redacted.sh/forums.php?*action=viewthread*
// @grant       none
// @version     1.2.1
// @author      mrpoot
// @namespace   mrpoot
// @downloadURL https://update.greasyfork.org/scripts/519621/GreasyForum.user.js
// @updateURL https://update.greasyfork.org/scripts/519621/GreasyForum.meta.js
// ==/UserScript==

(() => {
  const labels = {
    unknown: "Unknown",
    // - {{name}} script name
    // - {{author}} optionally rendered subtemplate (labels.author) when script has a parsed author
    scriptLabel:
      "<strong>User Script:</strong> <span>{{ name }}{{ author }}</span>",
    // -  {{authorName}} parsed author name/username
    author: " <em>(by {{ authorName }})</em>",
    openuserjs: "OpenUserJS",
    // - {{id}} greasyfork script unique ID (bigger number = newer script)
    greasyfork: "GreasyFork #{{ id }}",
    view: "View",
    download: "Download",
    copy: "Copy",
    copied: "Copied!",
    failed: "Failed!",
    install: "Install",
  };
  // words to force capitalization for when unslugging url paths
  const forcedSlugs = [
    // trackers
    "AB",
    "AnimeBytes",
    "BTN",
    "BroadcasTheNet",
    "GGN",
    "GazelleGames",
    "OPS",
    "PTH",
    "PTP",
    "PassThePopcorn",
    "RED",
    "WCD",
    // common terms
    "BBCode",
    "BP",
    "BPs",
    "FL",
    "HnR",
    // indexes
    "MusicBrainz",
    "IMDB",
    "TMDB",
    "TVDB",
    "TheTVDB",
    // software
    "EAC",
    "MediaInfo",
    "qBittorrent",
    "rTorrent",
    "ruTorrent",
    "uTorrent",
    // files
    "MP3",
    "FLAC",
    "OGG",
    "AAC",
    "WAV",
    "SACD",
    "MKV",
    "MP4",
    "JS",
    "CSS",
    "HTML",
    "JSON",
    "CSV",
    "TXT",
    // misc
    "HD",
    "HDR",
    "UHD",
    "4K",
    "MQA",
    "DVD",
    "CD",
    "TV",
    "URL",
    "API",
    "RPC",
    "P2P",
  ];
  const normalizedForcedSlugs = forcedSlugs.map((s) => s.toUpperCase());
  const classes = {
    container: "tracker-user-script-linkboxes",
    script: "tracker-user-script-linkbox",
    label: "tracker-user-script-label",
    linkbox: "tracker-user-script-linkbox-links",
    tag: "tracker-user-script-tag",
    view: "tracker-user-script-view",
    download: "tracker-user-script-download",
    copy: "tracker-user-script-copy",
    install: "tracker-user-script-install",
  };
  const style = document.createElement("style");
  style.type = "text/css";
  style.id = "tracker-user-script-styles";
  style.appendChild(
    document.createTextNode(
      `
/* outer container */
.${classes.container} {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: color(from currentColor srgb r g b / 0.1);
  box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border-radius: 0.25em;
  gap: 0.75em;
  padding: 0.75em 1em;
  margin: 0 0 1em;
}
/* script container */
.${classes.script} {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
}
/* left side label */
.${classes.label} {
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
/* right side container for links */
.${classes.linkbox} {
  display: flex;
  align-items: center;
  gap: 1em;
  margin: 0;
}
/* tag */
.${classes.tag}::before {
  content: '[';
  user-select: none;
}
.${classes.tag}::after {
  content: ']';
  user-select: none;
}
      `
    )
  );
  document.head.append(style);
  const defaultSelector = ".forum_post .body > div";
  const postSelectors = {
    "animebytes.tv": ".post_block .post_body > .post",
    "passthepopcorn.me": ".forum-post .forum-post__body > div",
  };
  const userscriptFingerprint = "// ==UserScript==";
  const userscriptLink =
    /\.user\.js(?:\?.+)?(?:#.+)?$|^https?:\/\/(greasyfork\.org\/\w+\/scripts\/\d+|openuserjs\.org\/scripts\/\w+)/;
  const metaBlock =
    /\/\/\s+==UserScript==\s+(?:[\s\S]+?)\/\/\s+==\/UserScript==/;
  const metaLine = /^\/\/\s+@([\w:-]+)\s+(.+)\s*$/;
  const tagsToScrape = [
    "DIV",
    "CODE",
    "BLOCKQUOTE",
    "SPAN",
    "PRE",
    "STRONG",
    "B",
  ];

  /**
   * @typedef TemplateName
   * @type {keyof typeof labels}
   *
   * Template syntax:
   *
   * {{name}}
   *
   * @param {TemplateName} templateName - key of a template from labels object
   * @param {object} values - record of values to substitute for tokens
   * @returns {string} final string
   */
  function tmpl(templateName, values) {
    return labels[templateName].replace(/\{\{([^}]+)\}\}/g, (_, name) => {
      const value = values[name.trim()];
      if (value === undefined || typeof value === "object") {
        return "";
      }
      return String(value);
    });
  }

  /**
   * @param {string} string - UTF-8 string
   * @returns base64 encoded string
   */
  function b64(string) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(string);
    let utf8toAscii = "";
    for (const byte of bytes) {
      utf8toAscii += String.fromCharCode(byte);
    }
    return btoa(utf8toAscii);
  }

  /**
   * @param {string} query - CSS query selector
   * @param {Element | Document} [el] - target element to query from
   * @returns {Element[]} array of html elements
   */
  function qsa(query, el = document) {
    return Array.from(el.querySelectorAll(query));
  }

  /**
   * @typedef ExpectedMetadata - commonly expected attributes
   * @type {object}
   * @property {string} [namespace] - namespace
   * @property {string} [author] - author
   * @property {string} name - name of the user script
   * @property {string} version - version number
   *
   * @typedef ScriptMetadata - parsed attributes from a raw user script
   * @type {ExpectedMetadata & { [key: string]: string | undefined }}
   */

  /**
   * User Script metadata parser (naive implementation that ignores multi-value attributes)
   * @param {string} sourceCode - script source
   * @returns {ScriptMetadata | null} key-value map of all userscript metadata, or null if parsing fails
   */
  function getMetadata(sourceCode) {
    const [metaSource] = sourceCode.match(metaBlock) ?? [];
    if (!metaSource) return null;
    const meta = /** @type {any} */ {};
    metaSource.split(/\r?\n/).forEach((line) => {
      const [match, key, value] = line.match(metaLine) ?? [];
      if (match) meta[key] = value;
    });
    if (!meta?.name) return null;
    if (!meta.version) meta.version = labels.unknown;
    return /** @type {ScriptMetadata} */ (meta);
  }

  /**
   * @param {Element} postElement - origin post element
   * @param {string} key - unique identifier
   * @param {string} scriptName - friendly name for the user script
   * @param {string} labelHTML - full HTML for the script label
   * @returns {Element} - a container to throw links
   */
  function createLinkBox(postElement, key, scriptName, labelHTML) {
    let [container] = /** @type {Array<HTMLDivElement>} */ (
      qsa(`.${classes.container}`, postElement)
    );
    if (!container) {
      container = document.createElement("div");
      container.classList.add(classes.container);
      postElement.insertAdjacentElement("afterbegin", container);
    }
    const scriptbox = document.createElement("div");
    scriptbox.classList.add(classes.script);
    scriptbox.setAttribute("data-key", key);
    const linkbox = document.createElement("div");
    linkbox.classList.add(classes.linkbox);
    const labelEl = document.createElement("span");
    labelEl.classList.add(classes.label);
    labelEl.title = scriptName;
    labelEl.innerHTML = labelHTML;
    scriptbox.appendChild(labelEl);
    scriptbox.appendChild(linkbox);
    container.appendChild(scriptbox);
    return linkbox;
  }

  /**
   * @param {string} str - url slug string to unslugify
   * @returns {string} pretty string
   */
  function unslug(str) {
    return str
      .split(/[_-]/)
      .map((str) => {
        const upperStr = str.toUpperCase();
        const forcedWordIndex = normalizedForcedSlugs.indexOf(upperStr);
        if (forcedWordIndex > -1) {
          return forcedSlugs[forcedWordIndex];
        }
        return upperStr.charAt(0) + str.slice(1);
      })
      .join(" ");
  }
  /**
   * @typedef ScrapeResult - an object representing a scraped user script, containing one of four optional properties
   * @type {object}
   * @property {string} key - unique identifier for deduplication
   * @property {{ sourceCode: string, meta: ScriptMetadata }} [raw] - raw/inline script
   * @property {{ id: string, fileName?: string, pathName?: string }} [greasyfork] - greasyfork script
   * @property {{ username: string, pathName: string }} [openuserjs] - openuserjs script
   * @property {{ href: string, hostname: string, fileName: string }} [external] - other externally-hosted scripts
   */

  /**
   * @param {Array<ScrapeResult>} bucket
   * @param {ScrapeResult} result
   */
  function addScript(bucket, result) {
    const existing = bucket.find(({ key }) => key === result.key);
    if (existing) {
      // naively merge missing properties
      (function merge(prev, next) {
        for (const key of Object.keys(next)) {
          if (key === "key") continue;
          if (!prev[key]) {
            Object.assign(prev, { [key]: next[key] });
          } else if (
            typeof prev[key] === "object" &&
            typeof next[key] === "object"
          ) {
            merge(prev[key], next[key]);
          }
        }
      })(existing, result);
    } else {
      bucket.push(result);
    }
  }

  /**
   * @param {Array<ScrapeResult>} bucket
   * @param {string} href
   */
  function scrapeLink(bucket, href) {
    const url = URL.parse(href, location.href);
    if (!url) return;

    const splitPath = url.pathname.split("/").slice(1);
    const scriptsIndex = splitPath.indexOf("scripts");
    const lastSegment = splitPath[splitPath.length - 1];
    const fileName = lastSegment.endsWith(".user.js")
      ? decodeURIComponent(lastSegment).replace(/\.user\.js$/, "")
      : undefined;

    switch (url.host) {
      case "greasyfork.org":
      case "update.greasyfork.org": {
        if (scriptsIndex === -1) break;
        const [match, id, nameSlug] =
          splitPath[scriptsIndex + 1].match(/^(\d+)(?:-([^/]+))?$/) ?? [];
        if (!match) break;
        addScript(bucket, {
          key: `gf:${id}`,
          greasyfork: {
            id,
            fileName,
            pathName: nameSlug ? nameSlug : undefined,
          },
        });
        break;
      }
      case "openuserjs.org": {
        if (scriptsIndex === -1) break;
        const userSlug = splitPath[scriptsIndex + 1];
        const nameSlug = splitPath[scriptsIndex + 2].replace(/\.user\.js$/, "");
        addScript(bucket, {
          key: `oujs:${userSlug}:${nameSlug}`,
          openuserjs: {
            username: userSlug,
            pathName: nameSlug,
          },
        });
        break;
      }
      default: {
        if (!fileName) break;
        addScript(bucket, {
          key: `href:${url.hostname}-${url.pathname}`,
          external: {
            hostname: url.hostname,
            fileName,
            href,
          },
        });
      }
    }
  }

  /**
   * @param {Array<ScrapeResult>} bucket
   * @param {string} sourceCode
   */
  function scrapeRawScript(bucket, sourceCode) {
    const meta = getMetadata(sourceCode);
    if (!meta?.name) {
      console.warn("Found what looks like a script, but probably is not one?");
      return;
    }
    addScript(bucket, {
      key: `raw:${meta.namespace ?? ""}:${meta.author ?? ""}:${meta.name}:${
        meta.version
      }`,
      raw: { sourceCode, meta },
    });
  }

  // scrape posts for user scripts
  const posts = qsa(postSelectors[location.hostname] ?? defaultSelector);
  posts.forEach((post) => {
    /** @type {Array<ScrapeResult>} */
    const scripts = [];

    // check links for user scripts
    const links = /** @type {Array<HTMLAnchorElement>} */ (
      qsa("a[href]", post)
    );
    links.forEach((link) => {
      if (userscriptLink.test(link.href)) {
        scrapeLink(scripts, link.href);
      }
    });

    // scan dom for inline user scripts
    (function scrapeWalker(el) {
      if (tagsToScrape.includes(el.tagName)) {
        const text = el.textContent?.trim() ?? "";
        if (!text.includes(userscriptFingerprint)) {
          return; // bail if fingerprint isn't anywhere in this branch
        }
        if (text.startsWith(userscriptFingerprint)) {
          scrapeRawScript(scripts, text);
          return; // bail after finding a script in a branch
        }
      }

      // walk children
      const children = Array.from(el.children);
      children.forEach((child) => scrapeWalker(child));
    })(post);

    // inject linkboxes
    scripts.forEach((script) => {
      let name = "";
      let authorName = "";
      let tag = "";
      let downloadLink = "";
      let downloadFilename = "";
      let copyCode = "";
      let viewLink = "";
      let installLink = "";

      if (script.raw) {
        const { meta, sourceCode } = script.raw;
        if (meta.author) {
          authorName = meta.author;
        }
        name = meta.name || labels.unknown;
        tag = meta.version || labels.unknown;
        const base64ed = b64(sourceCode);
        downloadLink = `data:text/plain;charset=UTF-8;base64,${base64ed}`;
        downloadFilename = `${
          meta.author || meta.namespace || labels.unknown
        } - ${meta.name}-${meta.version}.user.js`;
        copyCode = script.raw.sourceCode;
      } else if (script.external) {
        name = script.external.fileName;
        tag = script.external.hostname.replace(/^www\./, "");
        installLink = script.external.href;
      } else if (script.greasyfork) {
        const { id, fileName, pathName } = script.greasyfork;
        name = fileName || unslug(pathName || labels.unknown);
        tag = tmpl("greasyfork", script.greasyfork);
        viewLink = `https://greasyfork.org/en/scripts/${id}`;
        installLink = `https://update.greasyfork.org/scripts/${id}/script.user.js`;
      } else if (script.openuserjs) {
        const { username, pathName } = script.openuserjs;
        name = unslug(pathName);
        tag = tmpl("openuserjs", script.openuserjs);
        viewLink = `https://openuserjs.org/scripts/${username}/${pathName}`;
        installLink = `https://openuserjs.org/install/${username}/${pathName}.user.js`;
      } else {
        throw new Error("Unknown script in scrape results!");
      }

      const scriptName = name || labels.unknown;
      const labelHTML = tmpl("scriptLabel", {
        name: scriptName,
        author: authorName && tmpl("author", { authorName }),
      });
      const linkbox = createLinkBox(post, script.key, scriptName, labelHTML);

      if (tag) {
        const tagSpan = document.createElement("span");
        tagSpan.classList.add(classes.tag);
        tagSpan.setAttribute("data-tag", tag);
        tagSpan.innerHTML = tag;
        linkbox.appendChild(tagSpan);
      }
      if (viewLink) {
        const btn = document.createElement("a");
        btn.classList.add(classes.view);
        btn.href = viewLink;
        btn.rel = "external noreferrer";
        btn.target = "_blank";
        btn.innerHTML = labels.view;
        linkbox.appendChild(btn);
      }
      if (downloadLink) {
        const btn = document.createElement("a");
        btn.classList.add(classes.download);
        btn.download = downloadFilename;
        btn.href = downloadLink;
        btn.innerHTML = labels.download;
        linkbox.appendChild(btn);
      }
      if (copyCode) {
        const btn = document.createElement("a");
        btn.classList.add(classes.copy);
        btn.innerHTML = labels.copy;
        btn.href = "javascript:void(0)";
        let timer = -1;
        btn.addEventListener("click", async () => {
          try {
            clearTimeout(timer);
            await navigator.clipboard.writeText(copyCode);
            btn.innerHTML = labels.copied;
            timer = setTimeout(() => {
              btn.innerHTML = labels.copy;
            }, 3_000);
          } catch (error) {
            console.error(error);
            btn.innerHTML = labels.failed;
          }
        });
        linkbox.appendChild(btn);
      }
      if (installLink) {
        const btn = document.createElement("a");
        btn.classList.add(classes.install);
        btn.href = installLink;
        btn.rel = "external noreferrer";
        btn.innerHTML = labels.install;
        linkbox.appendChild(btn);
      }
    });
  });
})();
