// ==UserScript==
// @name         GazelleGames Nintendo Uploady
// @namespace    https://gazellegames.net/
// @version      1.1.5
// @description  Uploady for Nintendo sites
// @license      MIT
// @author       FinalDoom, updated by drlivog
// @match        https://gazellegames.net/upload.php*
// @match        https://gazellegames.net/torrents.php?action=editgroup&*
// @match        https://gazellegames.net/torrents.php?id=*
// @match        https://gazellegames.net/upload.php?groupid=*
// @match        https://gazellegames.net/torrents.php?action=edit&*
// @match        https://www.nintendo.com/store/products/*
// @match        https://www.nintendo.co.uk/Games/*
// @match        https://store-jp.nintendo.com/list/software/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://raw.githubusercontent.com/tengattack/html2bbcode.js/master/lib/html2bbcode.js#md5=0df7bd95097d97701bd74cb57784b011
// @require      https://raw.githubusercontent.com/FinalDoom/gazelle-uploady/master/common.js#md5=6a45d98638b6364d2d0849a889d9c011
// @downloadURL https://update.greasyfork.org/scripts/472508/GazelleGames%20Nintendo%20Uploady.user.js
// @updateURL https://update.greasyfork.org/scripts/472508/GazelleGames%20Nintendo%20Uploady.meta.js
// ==/UserScript==

//Originally on https://github.com/FinalDoom/gazelle-uploady/blob/master/nintendo.user.js

/* globals $ GameInfo UploadyFactory */

/*jshint esversion: 11 */


const JP_YOUTUBE_THUMB_RE = /img.youtube.com\/vi\/([^\/]+)\//;

function getGameInfoJP() {
  const nintendo = new GameInfo();

  nintendo.platform = $('th:contains("対応ハード")').next().text().trim();
  nintendo.title = $('.productDetail--headline__title').text().trim();
  const publisher = $('th:contains("メーカー")').next().text().trim();
  nintendo.addLanguage(...$('th:contains("対応言語")').next().text().trim().split(', '));
  const descriptionHtml = $('<div>')
    .append($('.productDetail--catchphrase__title, .productDetail--catchphrase__longDescription').clone())
    .html();
  nintendo.description = `${descriptionHtml}

[spoiler=Original Japanese description]

${descriptionHtml}
[/spoiler]`;

  nintendo.addTag(
    ...$('.productDetail--tag__label')
      .map((_, elem) => $(elem).text().trim())
      .toArray(),
  );
  nintendo.year = $('th:contains("配信日")').next().text();
  nintendo.rating = $('.productDetail--CERO__rating img, .productDetail--IARC__rating img').first().attr('alt');

  nintendo.cover = $('ul.slick-dots li:first-of-type() img').attr('src').split('?')[0];
  $('.slick-track li.slick-slide:not(.slick-cloned) img')
    .map((_, elem) => $(elem).attr('src').split('?')[0])
    .toArray()
    .forEach((url) => {
      if (JP_YOUTUBE_THUMB_RE.test(url)) {
        // This actually references a youtube video. Use it as the trailer
        const trailer = 'https://youtu.be/' + url.match(JP_YOUTUBE_THUMB_RE)[1];
        if (nintendo.trailer) {
          // Put it in extraInfo instead (sometimes there are multiple videos)
          if ('videos' in nintendo.extraInfo) {
            nintendo.extraInfo = {videos: nintendo.extraInfo + ', ' + trailer};
          } else {
            nintendo.extraInfo = {videos: trailer};
          }
        } else {
          nintendo.trailer = trailer;
        }
      } else if (url !== nintendo.cover) {
        nintendo.addScreenshot(url);
      }
    });

  nintendo.extraInfo = {
    publisher: publisher,
    storeLink: window.location.toLocaleString(),
  };

  return nintendo;
}

function getGameInfoUS() {
  const nintendo = new GameInfo();

  nintendo.platform = $('[class^="Herostyles__HeroSection"] [class^="Herostyles__PlatformContainer"] span')
    .text()
    .trim();
  nintendo.title = $('[class^="Breadcrumbsstyles__StyledNav"] li:last-of-type').text().trim();
  const publisher = $(
    '[class^="ProductInfostyles__InfoRow"]:contains("Publisher") [class^="ProductInfostyles__InfoDescr"]',
  )
    .text()
    .trim();
  nintendo.addLanguage(
    ...$(
      '[class^="ProductInfostyles__InfoRow"]:contains("Supported languages") [class^="ProductInfostyles__InfoDescr"] div',
    )
      .map(function () {
        return $(this).text().trim();
      })
      .toArray(),
  );
  nintendo.description = $('[class^="ReadMorestyles__ReadMore"] [class^="RichTextstyles__Html"]').html();

  nintendo.addTag(
    ...$('[class^="ProductInfostyles__InfoRow"]:contains("Genre") [class^="ProductInfostyles__InfoDescr"] div')
      .map(function () {
        return $(this).text();
      })
      .toArray()
      .filter((lang) => lang !== 'Other'),
  );
  nintendo.year = $(
    '[class^="ProductInfostyles__InfoRow"]:contains("Release date") [class^="ProductInfostyles__InfoDescr"]',
  ).text();
  nintendo.rating = $(
    '[class^="ProductInfostyles__InfoRow"]:contains("ESRB rating") [class^="ProductInfostyles__InfoDescr"]',
  ).text();

  const imageBiggerer = /(c_scale)[^\/]+/;
  const images = $('[class^="Railstyles__StyledCard"] img');
  nintendo.cover = images.first().attr('src').replace(imageBiggerer, '$1') + '.jpg';
  nintendo.addScreenshot(
    ...images
      .slice(1)
      .map(function () {
        return $(this).attr('src').replace(imageBiggerer, '$1') + '.jpg'; // JPG for ptpimg
      })
      .toArray(),
  );

  nintendo.extraInfo = {
    publisher: publisher,
    storeLink: window.location.toLocaleString().replace(/store\/products/, 'games/detail'),
  };

  return nintendo;
}

function getGameInfoUK() {
  const nintendo = new GameInfo();

  // #region Fetch wiki info UK, test NA
  nintendo.platform = $('.listwheader-container .info_system .game_info_title:contains("System")').next().text();
  nintendo.title = $('.gamepage-header-info h1').text().trim();
  const publisher = $('#gameDetails .game_info_title:contains("Publisher")').next().text().trim();

  nintendo.addLanguage(
    ...$('.listwheader-container .info_system .game_info_title:contains("Languages")').next().text().split(', '),
  );
  nintendo.description = $('.content').html(); // Oddly simple
  nintendo.addTag(...$('#gameDetails .game_info_title:contains("Categories")').next().text().trim().split(', '));
  nintendo.year = $('.game_info_title:contains("Release date")').next().text();
  nintendo.rating = $('#gameDetails .game_info_title:contains("Age rating")').next().find('.age-rating__icon').text();

  nintendo.cover = $('.packshot-hires img').attr('src').split('?')[0];
  if (unsafeWindow._gItems) {
    const images = unsafeWindow._gItems;
    const videoInfo = images.filter((o) => o.isVideo);
    if (videoInfo && videoInfo[videoInfo.length - 1]) {
      nintendo.trailer = videoInfo[videoInfo.length - 1].video_content_url;
    }
    nintendo.addScreenshot(...images.filter((o) => !o.isVideo).map((i) => i.image_url.split('?')[0]));
  } else {
    nintendo.screenshots = [];
  }

  nintendo.extraInfo = {
    publisher: publisher,
    storeLink: window.location.toLocaleString(),
  };

  return nintendo;
}

(function () {
  ('use strict');

  const factory = new UploadyFactory();
  factory.build(
    'Search Nintendo (UK)',
    (title) => `https://www.nintendo.co.uk/Search/Search-299117.html?q=${title}`,
    (resolve) => resolve(getGameInfoUK()),
  );
  factory.build(
    '(JP)',
    (title) => `https://store-jp.nintendo.com/search/?q=${title}`,
    (resolve) => resolve(getGameInfoJP()),
  );
  factory.build(
    '(US)',
    (title) => `https://www.nintendo.com/search/?q=${title}&p=1&cat=gme&sort=df`,
    (resolve) => resolve(getGameInfoUS()),
  );
})();
