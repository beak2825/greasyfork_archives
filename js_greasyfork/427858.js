// ==UserScript==
// @name        MyShows: Ororo.tv Links
// @author      o4zloiroman
// @license     MIT
// @version     0.80
// @match       https://myshows.me/profile/
// @description Add clickable ororo.tv links to episodes
// @namespace https://greasyfork.org/users/722089
// @downloadURL https://update.greasyfork.org/scripts/427858/MyShows%3A%20Ororotv%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/427858/MyShows%3A%20Ororotv%20Links.meta.js
// ==/UserScript==

function addEpisodeLinks() {
  document.querySelectorAll('.Unwatched-item').forEach(show => {
    const showTitle = show.querySelector('.Unwatched-showTitle-title')?.textContent.trim();
    const showNameSlug = showTitle?.replace(/\s+/g, '-').toLowerCase();

    if (showNameSlug) {
      show.querySelectorAll('.Unwatched-season').forEach(seasonBlock => {
        const seasonTitle = seasonBlock.querySelector('.Unwatched-showSeasonTitle')?.textContent || '';
        const seasonMatch = seasonTitle.match(/Сезон\s+(\d+)/i);
        const seasonNumber = seasonMatch ? seasonMatch[1] : null;

        if (!seasonNumber) return;

        let episodesContainer = seasonBlock.nextElementSibling;
        if (!episodesContainer) return;

        episodesContainer.querySelectorAll('.UnwatchedEpisodeItem').forEach(episodeEl => {
          const episodeNumber = episodeEl.querySelector('.UnwatchedEpisodeItem__index span')?.textContent.trim();

          if (episodeNumber) {
            const episodeUrl = `https://ororo.tv/shows/${showNameSlug}#${seasonNumber}-${episodeNumber}`;

            const existingLink = episodeEl.querySelector('.UnwatchedEpisodeItem__index a');

            if (!existingLink) {
              const episodeIndexSpan = episodeEl.querySelector('.UnwatchedEpisodeItem__index span');
              if (episodeIndexSpan) {
                const link = document.createElement('a');
                link.href = episodeUrl;
                link.title = `Watch Episode ${episodeNumber}`;
                link.textContent = episodeNumber;

                episodeIndexSpan.replaceWith(link);
              }
            }
          }
        });
      });
    }
  });
}

addEpisodeLinks();

setInterval(addEpisodeLinks, 500);