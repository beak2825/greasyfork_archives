// ==UserScript==
// @name YouTube - Gigantic Search Result Thumbnails Fix
// @namespace userstyles.world/user/magma_craft
// @version 20250828.20.36
// @description This style reverts back to the normal search result thumbnails since they have first experimented back in July 2022.
// @author magma_craft
// @license CC Zero
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/487935/YouTube%20-%20Gigantic%20Search%20Result%20Thumbnails%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/487935/YouTube%20-%20Gigantic%20Search%20Result%20Thumbnails%20Fix.meta.js
// ==/UserScript==

(function() {
let css = `
/* Revert giant search thumbnails back to normal one */
ytd-two-column-search-results-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] #primary.ytd-two-column-search-results-renderer, ytd-search[has-search-header][has-bigger-thumbs] #header.ytd-search {
  max-width: 1096px !important;
}
 
ytd-channel-renderer[use-bigger-thumbs][bigger-thumb-style=BIG] #avatar-section.ytd-channel-renderer, ytd-channel-renderer[use-bigger-thumbs] #avatar-section.ytd-channel-renderer {
  max-width: 360px !important;
}
 
ytd-video-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-thumbnail.ytd-video-renderer, ytd-video-renderer[use-search-ui] ytd-thumbnail.ytd-video-renderer {
  max-width: 360px !important;
}
 
ytd-playlist-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-playlist-thumbnail.ytd-playlist-renderer, ytd-playlist-renderer[use-bigger-thumbs] ytd-playlist-thumbnail.ytd-playlist-renderer {
  max-width: 360px !important;
}
 
ytd-radio-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-thumbnail.ytd-radio-renderer, ytd-radio-renderer[use-bigger-thumbs] ytd-thumbnail.ytd-radio-renderer {
  max-width: 360px !important;
}
    
ytd-radio-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-thumbnail.ytd-radio-renderer, ytd-radio-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-playlist-thumbnail.ytd-radio-renderer {
  max-width: 360px !important;
}
 
ytd-movie-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] .thumbnail-container.ytd-movie-renderer, ytd-movie-renderer[use-bigger-thumbs] .thumbnail-container.ytd-movie-renderer {
  max-width: 360px !important;
}

ytd-promoted-video-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-thumbnail.ytd-promoted-video-renderer,
ytd-promoted-sparkles-web-renderer[web-search-layout][use-bigger-thumbs][bigger-thumbs-style=BIG] #thumbnail-container.ytd-promoted-sparkles-web-renderer,
ytd-text-image-no-button-layout-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] #text-image-container.ytd-text-image-no-button-layout-renderer {
  max-width: 360px !important;
}

.yt-lockup-view-model-wiz--horizontal .yt-lockup-view-model-wiz__content-image,
.yt-lockup-view-model--horizontal .yt-lockup-view-model__content-image {
  max-width: 360px !important;
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
