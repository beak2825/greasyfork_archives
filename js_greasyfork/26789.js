// ==UserScript==
// @name         Pogdesign-Widgets
// @namespace    https://github.com/fabiencrassat
// @version      1.3.18
// @description  Add links relative to the episode
// @author       Fabien Crassat <fabien@crassat.com>
// @match        https://www.pogdesign.co.uk/cat/
// @match        http://www.pogdesign.co.uk/cat/
// @include      /^https:\/\/www\.pogdesign\.co\.uk\/cat\/\d{1,}-\d{4}/
// eslint-disable-next-line max-len
// @include      /^https:\/\/www\.pogdesign\.co\.uk\/cat\/day\/\d{1,}-\d{1,}-\d{4}/
// eslint-disable-next-line max-len
// @include      /^https:\/\/www\.pogdesign\.co\.uk\/cat\/\w+(-*\w+)*\/Season-\d+\/Episode-\d+/
// @include      /^https:\/\/www\.pogdesign\.co\.uk\/cat\/\w+(-*\w+)*-summary/
// eslint-disable-next-line max-len
// @require      https://greasyfork.org/scripts/35624-pogdesign-widgets-js/code/Pogdesign-Widgetsjs.js?version=891915
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/26789/Pogdesign-Widgets.user.js
// @updateURL https://update.greasyfork.org/scripts/26789/Pogdesign-Widgets.meta.js
// ==/UserScript==

/* global $, fabiencrassat */
'use strict';

// eslint-disable-next-line max-lines-per-function
const pages = function pages() {
  const { externalLinks } = fabiencrassat.view;
  const { controller, shared } = fabiencrassat.main;

  const page = {
    calendar: {
      displayExternalLinksPopup(element) {
        const popup = externalLinks
          .create('fcr-calendar-page', 'block');
        element
          .parent()
          .parent()
          .parent()
          .after(popup);
      },
      extractSeasonAndEpisode(element) {
        return element
          .prev()
          .text();
      },
      extractTitle(element) {
        return element
          .parent()
          .prev()
          .text();
      },
      insertExternalLink(element) {
        $(element)
          .wrap('<span class="fcr-episodeContainer"></span>');
        $('span.fcr-episodeContainer > :last-child')
          .after(shared.externalImageLink());
      },
      isInLocationPage() {
        /* The regex is the same than the @include in the header */
        // eslint-disable-next-line prefer-named-capture-group, max-len
        return controller.isInLocationPage(/^https:\/\/www\.pogdesign\.co\.uk\/cat\/($|\d{1,}-\d{4})/gu);
      },
      stylesheets() {
        return `
        span.fcr-episodeContainer > :last-child {
            float: right;
        }
        span.fcr-episodeContainer > :first-child {
            float: left;
        }
        .ep.infochecked .fcr-externalLink-image {
            filter: contrast(0);
        }
        .fcr-externalLink-image {
            height: 12px;
            width: 12px;
            background-image: url('${shared.linkImage}');
        }`;
      }
    },
    day: {
      displayExternalLinksPopup(element) {
        page.summary.displayExternalLinksPopup(element);
      },
      extractSeasonAndEpisode(element) {
        const seasonAndEpisode = element
          .parent()
          .next()
          .text();
        // eslint-disable-next-line prefer-named-capture-group
        const regex = /^Season (\d{1,}), Episode (\d{1,})/gu;
        return {
          episode: seasonAndEpisode.replace(regex, '$2'),
          season: seasonAndEpisode.replace(regex, '$1')
        };
      },
      extractTitle(element) {
        return element
          .parent()
          .prev()
          .text();
      },
      insertExternalLink(element) {
        $('<span class="fcr-episodeContainer"></span>')
          .insertAfter(element);
        $(shared.externalImageLink())
          .appendTo('span.fcr-episodeContainer');
      },
      isInLocationPage() {
        // eslint-disable-next-line max-len
        return controller.isInLocationPage(/^https:\/\/www\.pogdesign\.co\.uk\/cat\/day\/\d{1,}-\d{1,}-\d{4}/gu);
      },
      stylesheets() {
        return `
        .overbox h4 a {
            width: 35%;
            padding-right: 0;
            margin-right: 25%;
        }
        span.fcr-episodeContainer {
            padding-top: 24px !important;
            padding-left: 30px !important;
            float: left !important;
            width: 36px !important;
        }
        .fcr-externalLink-image {
            height: 12px;
            width: 12px !important;
            padding: 0 !important;
            background-image: url('${shared.linkImage}');
        }
        .fcr-external-links-popup #poptext > span > a {
            color: #66bbff;
        }`;
      }
    },
    episode: {
      displayExternalLinksPopup(element) {
        const popup = externalLinks
          .create('fcr-external-links-popup', 'inline-flex');
        element
          .after(popup);
      },
      extractSeasonAndEpisode() {
        return $('h3.sdfsdf')
          .children()
          .first()
          .text();
      },
      extractTitle() {
        return $('.furtherinfo a:first')
          .text();
      },
      insertExternalLink(element) {
        $(`<span> ${shared.externalTextLink()}</span>`)
          .appendTo(element);
      },
      isInLocationPage() {
        /* The regex is the same than the @include in the header */
        // eslint-disable-next-line prefer-named-capture-group, max-len
        return controller.isInLocationPage(/^https:\/\/www\.pogdesign\.co\.uk\/cat\/\w+(-*\w+)*\/Season-\d+\/Episode-\d+/gu);
      },
      stylesheets() {
        return page.summary.stylesheets();
      }
    },
    summary: {
      displayExternalLinksPopup(element) {
        const offsetLeft = -200;
        const offsetTop = 20;
        const position = {
          left: element.offset().left + offsetLeft,
          top: element.offset().top + offsetTop
        };
        const popup = externalLinks
          .create('fcr-external-links-popup', 'block', position);
        $('body > div:last')
          .after(popup);
      },
      extractSeasonAndEpisode(element) {
        const seasonAndEpisodeElement = element
          .parent()
          .parent()
          .parent();
        return {
          episode: seasonAndEpisodeElement
            .find('[itemprop=episodeNumber]')
            .text(),
          season: seasonAndEpisodeElement
            .find('[itemprop=seasonNumber]')
            .text()
        };
      },
      extractTitle() {
        return $('h2.sumhead > a')
          .text()
          .replace(/ {1}Summary & Series Guide/gu, '');
      },
      insertExternalLink(element) {
        $(element)
          .wrap('<span class="fcr-episodeContainer"></span>');
        $(shared.externalImageLink())
          .appendTo('span.fcr-episodeContainer');
      },
      isInLocationPage() {
        /* The regex is the same than the @include in the header */
        return controller
          // eslint-disable-next-line prefer-named-capture-group, max-len
          .isInLocationPage(/^https:\/\/www\.pogdesign\.co\.uk\/cat\/\w+(-*\w+)*-summary/gu);
      },
      stylesheets() {
        return `
        span.fcr-episodeContainer {
          display: flex;
        }
        .fcr-externalLink-image {
          height: 12px !important;
          width: 12px !important;
          filter: contrast(0);
          margin: 9px -12px 9px 54px;
          background-image: url('${shared.linkImage}');
        }
        .ep.infochecked .fcr-externalLink-image {
          filter: contrast(0.4);
        }
        .fcr-external-links-popup #pop {
          padding: 1px;
          font-size: initial;
          letter-spacing: initial;
          line-height: 1.5;
          border: 1px solid #000;
          border-radius: 10px;
          box-shadow: 0px 0px 21px rgba(0, 0, 0, 0.5);
          text-shadow: 1px 1px 0 #000;
          background-color: rgba(38, 38, 38, 0.9);
          opacity: .95;
        }
        .fcr-external-links-popup #popheader {
          background-color: rgba(0, 0, 0, 0.3);
          color: #fff;
          border-radius: 9px 9px 0 0;
        }
        .fcr-external-links-popup #poptext > span > a {
          color: #66bbff;
        }
        .fcr-external-links-popup #popfooter {
          background-color: rgba(0, 0, 0, 0.3);
          color: #FF9326;
          border-radius: 0 0 9px 9px;
        }`;
      }
    }
  };

  return {
    calendar: page.calendar,
    day: page.day,
    episode: page.episode,
    summary: page.summary
  };
};

const scriptElement = document.createElement('script');
const textNode = `var fabiencrassat = fabiencrassat || {};
                  fabiencrassat.page = (${pages})();`;
scriptElement.appendChild(document.createTextNode(textNode));

(document.body || document.head || document.documentElement)
  .appendChild(scriptElement);

window.addEventListener('load', () => {
  // Add search episode links for calendar pages
  fabiencrassat.main.controller.addExternalLink(
    fabiencrassat.page.calendar,
    '#month_box p > :last-child'
  );
  // Add search episode links for day pages
  fabiencrassat.main.controller.addExternalLink(
    fabiencrassat.page.day,
    '.overbox > h4 > a'
  );
  // Add search episode links for summary page
  fabiencrassat.main.controller.addExternalLink(
    fabiencrassat.page.summary,
    'li.ep > strong > a'
  );
  // Add search episode links for episode page
  fabiencrassat.main.controller.addExternalLink(
    fabiencrassat.page.episode,
    'h3.sdfsdf'
  );
  // No page found
}, false);
