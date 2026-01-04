// ==UserScript==
// @name        RED integration for RYM
// @namespace   Violentmonkey Scripts
// @match       https://rateyourmusic.com/
// @match       https://rateyourmusic.com/artist/*
// @match       https://rateyourmusic.com/list/*
// @match       https://rateyourmusic.com/new-music/*
// @match       https://rateyourmusic.com/release/*
// @match       https://rateyourmusic.com/feature/*
// @match       https://rateyourmusic.com/charts/*
// @grant       none
// @version     0.5.5
// @license     MIT
// @author      wavelight
// @description Integrates RED search and requests on RYM pages.
// @downloadURL https://update.greasyfork.org/scripts/460600/RED%20integration%20for%20RYM.user.js
// @updateURL https://update.greasyfork.org/scripts/460600/RED%20integration%20for%20RYM.meta.js
// ==/UserScript==

/** [unsafe] create html element from string. */
function h(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

/** normalizes artist for improved matching with red. */
function normalizeArtist(str) {
  const artist = str.trim();
  return artist === "Various Artists" ? "" : artist;
}

/** normalizes album for improved matching with red. */
function normalizeAlbum(str) {
  // special characters are frequently inconsistent.
  // edge case: album titles that consist of only special characters.
  return str.trim().replaceAll(/[|=_&/\\#,+()$~%.'":*?<>{}!-]/g, " ");
}

/** construct URL for an advanced music search. */
function searchUrl(artist, album) {
  const url = new URL("https://redacted.ch/torrents.php");
  url.searchParams.set("artistname", normalizeArtist(artist));
  url.searchParams.set("action", "advanced");
  url.searchParams.set("filter_cat[1]", 1);
  url.searchParams.set("group_results", 1);
  if (album) url.searchParams.set("groupname", normalizeAlbum(album));
  return url.href;
}

/**
 * construct URL for a request url.
 * advanced filters (releases,formats) can be omitted to default to all.
 */
function requestUrl(artist, album) {
  const url = new URL("https://redacted.ch/requests.php");
  url.searchParams.set("submit", "true");
  url.searchParams.set(
    "search",
    album
      ? `${normalizeArtist(artist)} ${normalizeAlbum(album)}`
      : normalizeArtist(artist)
  );
  url.searchParams.set("show_filled", "on");
  url.searchParams.set("showall", "on");
  url.searchParams.set("filter_cat[1]", 1);
  return url.href;
}

/** creates a media link mirroring RYM's DOM. */
function createMediaLink(href, title, icon) {
  const node = h(`
    <a class="ui_media_link_btn" target="_blank" rel="noopener nofollow" title="${title}" href="${href}" aria-label="Open in ${title}"></a>
  `);

  node.style.cssText = `
    background-color: #000;
    background-image: url(${
      icon?.url ?? "https://redacted.ch/static/favicon.ico"
    });
    background-position: center center;
    background-repeat: no-repeat;
    border: ${icon?.border ? `2px solid ${icon.border}` : "none"};
    background-size: 75% 75%;
  `;

  return node;
}

/**
 * creates and injects links to redacted in the referenced DOM container.
 */
function injectRedactedLinks(linkContainer, artist, album) {
  // FIX: media links do not wrap on homepage & features for some reason.
  linkContainer.style.flexWrap = "wrap";

  const links = [
    createMediaLink(searchUrl(artist, album), "Redacted (Search)", {
      border: "green",
    }),
    createMediaLink(requestUrl(artist, album), "Redacted (Request)", {
      border: "firebrick",
    }),
  ];

  links.forEach((l) => linkContainer.appendChild(l));
}

/**
 * Decorates any page that has one or more media link containers.
 * We resolve artist / album by looking at parent element of `ui_media_links`
 * which allows the script to work on aggregation pages.
 */
function decorateReleases(resolver) {
  // this will usually not yield results as media links are injected lazily.
  document.querySelectorAll(".ui_media_links").forEach((node) => {
    const { artist, album } = resolver(node);
    injectRedactedLinks(node, artist, album);
  });

  // observe the DOM for changes relating to media link groups.
  // invariant: media links are added by RYM in one mutation.
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      if (m?.target?.dataset.medialink) {
        const node = m.target.querySelector(".ui_media_links");
        const { artist, album } = resolver(node);
        injectRedactedLinks(node, artist, album);
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

/**
 * Decorate user-created lists.
 * invariant: these do not have media embeds as they can contain other media types.
 */
function decorateList() {
  document.querySelectorAll("#user_list .main_entry").forEach((node) => {
    const artist = node.querySelector(".list_artist").firstChild.textContent;
    const album = node.querySelector(".list_album").textContent;

    const linkNode = h(`<div class="extra_metadata"></div>`);
    linkNode.style.cssText = "margin-block-start: 0.5em";
    injectRedactedLinks(linkNode, artist, album);

    node.appendChild(linkNode);
  });
}

/**
 * Decorate artist pages.
 */
function decorateArtist() {
  const artistInfo = document.querySelector(".artist_info_main");
  const artist =
    document.querySelector(".artist_name_hdr").firstChild.textContent;

  const infoContent = h(`<div class="info_content"></div>`);
  injectRedactedLinks(infoContent, artist, null);

  artistInfo.appendChild(h(`<div class="info_hdr">Links</div>`));
  artistInfo.appendChild(infoContent);
}

/**
 * Decorate new music page.
 */
function decorateNewMusic() {
  function inject(node) {
    const artist = node.querySelector(".artist").firstChild.textContent;
    const album = node.querySelector(".album").textContent;

    const linkNode = h(`<div class="extra_metadata"></div>`);
    linkNode.style.cssText = "margin-block-start: 0.5em";
    injectRedactedLinks(linkNode, artist, album);

    node.appendChild(linkNode);
  }

  document
    .querySelectorAll(
      ".newreleases_content .newreleases_item_textbox_artistalbum"
    )
    .forEach(inject);

  // handle infinite scroll.
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      m.addedNodes.forEach((node) => {
        if (typeof node.querySelector === "function") {
          const child = node?.querySelector(
            ".newreleases_item_textbox_artistalbum"
          );
          if (child) inject(child);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

(() => {
  const url = window.location.href;

  if (url.includes("/artist/")) {
    decorateArtist();
  } else if (url.includes("/list/")) {
    decorateList();
  } else if (url.includes("/new-music/")) {
    decorateNewMusic();
  } else {
    // all other pages use media link embeds.
    // they only differ by how album & artist are selected from the DOM.
    let resolver = (node) => {
      const container = node.closest(".ui_featured_content_review");
      const artist = container.querySelector(".artist").firstChild.textContent;
      const album = container.querySelector(".album").textContent;
      return { artist, album };
    };

    // single release pages
    if (url.includes("/release/")) {
      resolver = () => {
        const container = document.querySelector(".album_title");
        // yields the performer for classical works.
        const artist =
          container.querySelector(".artist").firstChild.textContent;
        const album = container.childNodes[0].textContent;
        return { artist, album };
      };
      // feature pages
    } else if (url.includes("/feature/")) {
      resolver = (node) => {
        const container = node.closest(".page_feature_item");
        const artist =
          container.querySelector(".artist").firstChild.textContent;
        const album = container.querySelector(".album").textContent;
        return { artist, album };
      };
      // chart pages
    } else if (url.includes("/charts/")) {
      resolver = (node) => {
        const container = node.closest(".page_charts_section_charts_item");
        const artists = Array.from(container.querySelectorAll(".artist"));
        // charts can list the composer in position one - we are interested in performers.
        // however, this can be weird for collaborations.
        const artistNode = artists[artists.length > 1 ? 1 : 0];
        let artist = artistNode.textContent;
        if (artistNode.querySelector(".ui_name_locale_original")) {
          artist = artistNode.querySelector(
            ".ui_name_locale_original"
          ).textContent;
        }
        const album = container.querySelector(".release").textContent;
        return { artist, album };
      };
    }

    decorateReleases(resolver);
  }
})();
