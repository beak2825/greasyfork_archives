
// ==UserScript==
// @name         Xtube Enhancer - Animated Thumbnails, Inline Video Loading, and Sponsor/Premium-Free Videos
// @description  Animates thumbnails, inlines video loading, and cleans up sponsored content
// @namespace    xtube
// @version      4.3.3
// @include      http*://www.xtube.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/14707/Xtube%20Enhancer%20-%20Animated%20Thumbnails%2C%20Inline%20Video%20Loading%2C%20and%20SponsorPremium-Free%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/14707/Xtube%20Enhancer%20-%20Animated%20Thumbnails%2C%20Inline%20Video%20Loading%2C%20and%20SponsorPremium-Free%20Videos.meta.js
// ==/UserScript==

const thumbSelectors = [
  '#mainSection > section > div > ul > li > article > a > div > div > img',
  '#mainSection > ul > li > article > a > div > div > img',
  '#tabVideos > ul > li > article > a > div > div > img',
  'div.mainContent>ul>li>article>a>div>div>img',
  '[id*="vid_id_"]',
  '[id*="2_frame"]> a > img',
  '#tabMorefromthisuser > ul > li > article > a > div > div > img',
  '#mainSection > div > div > div > ul > li > article > a > div > div > img',
  '#contentVideos > div > div > ul > li > article > a > div > div.imageWrapper.video > img',
  '#tabVideos > div > ul > li > article > a > div > div.imageWrapper.video > img',
  '#contentActivities > div > div > ul > li > article > a > img',
  '#relatedVideoCarousel > ul > li.item.active > ul > li > article > a > div > div > img',
];

const scoreArchiveSelectors = [
  ['#mainSection > section > div > ul > li', '#mainSection > section > div > ul'],
  ['#mainSection > section > div.mainContent > ul > li', '#mainSection > section > div.mainContent > ul'],
  ['#mainSection > section > div > div > ul > li', '#mainSection > section > div > div > ul'],
  ['#tabVideos > div > ul > li', '#tabVideos > div > ul'],
  ['#tabVideos > ul > li', '#tabVideos > ul'],
  ['#mainSection > ul > li', '#mainSection > ul']
];

const linkSelectors = [
  '#mainSection > section > div > div > ul > li > article > a:nth-child(1)',
  '#mainSection > ul > li > article > a:nth-child(1)',
];

jQuery(document).ready(function($) {
  let route = location.pathname.split('/')[1];
  let state = localStorage.getItem('__xte__');
  let watched = localStorage.getItem('__watched__');

  const addWatchedVideo = (url) => {
    if (watched.includes(url)) return;

    watched.push(url);

    url = _.uniq(url);

    localStorage.setItem('__watched__', JSON.stringify(watched));
  }

  if (!state) {
    state = {showPremium: false};
    localStorage.setItem('__xte__', JSON.stringify(state));
  } else {
    state = JSON.parse(state);
  }

  if (!watched) {
    watched = [];
    localStorage.setItem('__watched__', JSON.stringify(watched));
  } else {
    watched = JSON.parse(watched);
  }

  if (route === 'video-watch') {
    addWatchedVideo(location.href);
  }

  $(`<div title="Xtube Enhancer Settings" class="form-group" style="position: relative; top: 11px; left: 230px; color: #fff;">
      <label style="font-size: 12px; font-weight: 500;">Show premium videos:</label>
      <input type="checkbox" id="xte1" value="${state.showPremium}" style="margin-top: 1px;">
    </div>`
  ).insertAfter(
    '#searchForm'
  );

  if (state.showPremium) {
    $('#xte2').text(' Enabled');
    $('#xte1').attr('checked', 'checked')
  }

  $('#xte1').on('click', function(e) {
    state.showPremium = !state.showPremium;
    localStorage.setItem('__xte__', JSON.stringify(state))
    location.reload();
  });



  setTimeout(function() {
    $('div.advertisement').remove();
    $('a.clearfix').remove();
    $('li.pull-right').remove();
    $('h2.h1').remove();
    $('section.overviewPage>div:nth-child(5)').remove();
    $('body > div > div.container > div > div').remove();
    $('#mainSection > a').remove();
    $('[class*="Promotion"]').remove();
    $('[class*="Banner"]').remove();
    $('.lineSeparator').remove();

    $('.panelBottomSpace').each(function() {
      if (!$(this).children().length) {
        $(this).remove();
      }
    });
  }, 500);
  let selectors = [
    '#mainSection > section > div > ul > li',
    '#tabVideos > ul > li',
    '#mainSection > ul > li',
    '#mainSection > section > div.mainContent > ul > li',
    '#mainSection > section > div > div > ul > li',
    'section.row>div>div>ul>li'
  ];
  let keywords = ['premium', 'preview', 'xtube_sponsor', 'ambassador', 'verified'];

  $('#mainSection > div > div > section.cntPanel > article.box.contentInfo.hasButtonFooter').insertAfter('#mainSection > div > div > section.cntPanel > div.playerWrapper.videoWrapper');
  $('body > div > div.container > div').remove();

  const removeSpam = function() {
    const handleSelector = function(selector) {
      $(selector).each(function() {
        if ($(this).find('article > a:nth-child(1) > h3').text().trim().indexOf($(this).find('article > a.userLink.ellipsis').text().trim().split('by ')[1]) !== -1) {
          $(this).remove();
        } else {
          if ($(this).find('article > a:nth-child(1) > h3').text().trim().indexOf('*****') !== -1) {
            let titleBegin = $(this).find('article > a:nth-child(1) > h3').text().trim().split('*****')[0];
            if (titleBegin === $(this).find('article > a.userLink.ellipsis').text().trim().split('by ')[1].substring(0, titleBegin.length)) {
              $(this).remove();
            }
          }
        }
        for (let i = 0; i < keywords.length; i++) {
          let keyword = keywords[i];
          if ($(this).find('article > a').text().toLowerCase().includes(keyword)) {
            $(this).remove();
          }
          if ($(this).find('article > a > div > span > span').text().toLowerCase().includes(keyword)) {
            $(this).remove();
          }
          if ($(this).find('article>a>span>span').text().toLowerCase() === keyword || $(this).find('article>a>div>span>span').text() === keyword) {
            $(this).remove();
          }
          if ($(this).find('article>dl>dd>a').text().toLowerCase() === keyword) {
          }
          if ($(this).find('article>a>span>span').text().toLowerCase() === keyword) {
            $(this).remove();
          }
          let img = $(this).find('article > div > div.userLink > div > a > img')
          if (img && img[0] && img[0].src.indexOf('Sponsor') > -1) {
            $(this).remove();
          }
          let duration = $(this).find('article > a.titleRemover.js-pop > div > span.duration');
          if (duration && duration.text().indexOf('0:1') > -1) {
            $(this).remove();
          }
        }
      });
    };
    // v2 - Remove videos that have similar title and author strings
    if (!state.showPremium) {
      for (let i = selectors.length - 1; i >= 0; i--) {
        if ($(selectors[i]).length > 0) {
          try {
            handleSelector(selectors[i]);
          } catch (e) {console.log(e)}
        }
      }
      // Kill profile ads
      $('#mainSection > section > div > ul > li > article').each(function(i, el) {
        if ($(el).hasClass('profile')) $(el).remove();
      });
      $('.weeklyTopAmateurVideoPlaceholder').each(function(i, el) {
        $(el).parent().remove();
      });
    }
  };
  removeSpam();

  const cleanVidPage = function() {
    $('#mainSection > div > aside > div.cntPanel').remove();
    $('#mainSection > div > div > section.cntPanel > div.onderSellamPlayer').remove();
    let relatedVideos = null;
    $('div#related_videos>div').each(function() {
      relatedVideos = $(this).text().split(' ');
      for (let i = relatedVideos.length - 1; i >= 0; i--) {
        if (relatedVideos[i] === '0:15') {
          $(this).prev().remove();
          $(this).remove();
        }
      }
    });
    // Remove sponsored content below video player.
    $('div#watchPageLeft>div>div').each(function() {
      if ($(this).find('a>span:nth-child(3)').text() === '0:15') {
        $(this).remove();
      }
    });
    // Remove sponsored content in full related videos view.
    $('div.Card-list>article').each(function() {
      if ($(this).find('div>div>div:nth-child(3)').text() === '0:15') {
        $(this).remove();
      }
    });
    // Remove footer ad.
    $('#mainSection > div > div > div.onderSellamPlayer').remove();
    $('.underPlayerBanner').remove();
    // Remove "Ads by Traffic Junky"
    // $('#mainSection > div > div > div.expandStage > div.playerWrapper > div > div > div.header').remove();
    // $('body.desktopView.hasFooterAd .mainSection').css({paddingBottom: '0px'});
    // $('#xtubePlayer > div:nth-child(1)').remove();
    // $('#playerWrapper > div > p').remove();
    //$('#playerWrapper > div > a').unwrap();
  };
  cleanVidPage();
  let paused = false;
  let animateThumbnails = function(selector) {
    let content = _.isString(selector) ? $(selector) : selector;
    if (content.length > 0) {
      content.each(function(i, el) {
        let originalSrc = $(el).attr('src');
        let setAnimations = () => {
          try {
            // let clone = $(el).clone();
            // clone.insertBefore($(el));
            // $(el).hide();
            el.__animation = [];
            let images;
            let _src = $(this).attr('src');
            let src = _src.split('/');
            let regexp = /_(\d\d\d\d)\.jpg$/;
            let match = _src.match(regexp);

            if (_.last(src).length <= 6 || match) {
              let imgSrc;
              let n = -1;

              if (match) {
                images = ['_0000.jpg', '_0001.jpg', '_0002.jpg', '_0003.jpg', '_0004.jpg', '_0005.jpg', '_0006.jpg', '_0007.jpg', '_0008.jpg', '_0009.jpg', '_0010.jpg', '_0011.jpg', '_0012.jpg', '_0013.jpg', '_0014.jpg'];
                imgSrc = _src.split(match[0])[0];
              } else {
                images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg'];
                let src3 = _.without(src, _.last(src));
                imgSrc = src3.join('/') + '/';
              }

              for (let z = 0; z < images.length; z++) {
                el.__animation.push(imgSrc + images[z]);
              }

              let animate = function() {
                if (el.__timeout) clearTimeout(el.__timeout);

                el.onload = () => el.__timeout = setTimeout(animate, 500);
                el.onerror = () => {
                  n = -1;
                  el.onload();
                };

                if (!paused) {
                  let newSrc = el.__animation[++n];
                  if (!newSrc) {
                    n = 0;
                    newSrc = el.__animation[0];
                  }
                  el.src = newSrc;
                }

              };
              animate();
            }
          } catch (e) {console.log(e)}
        };
        let related = $('#mainSection > div > div > div.cntPanel.relatedVideosPanel');
        if (related.length) {
          paused = true;
          related.on('mouseenter', function() {
            paused = false;
          })
          related.on('mouseleave', function() {
            paused = true;
          })
        }
        if (originalSrc.indexOf('placehold') === -1) {
          setAnimations();
        } else {
          el.onload = function() {
            setTimeout(() => setAnimations(), 0);
          };
        }
      });
    }
  };

    // Animate thumbnails
  $('#relatedVideoCarousel > footer').on('click', function() {
    animateThumbnails('#relatedVideoCarousel > ul > li > ul > li > article > a > div > div > img');
  });
  setTimeout(function() {
    for (let i = 0; i < thumbSelectors.length; i++) {
      if ($(thumbSelectors[i]).length > 0) {
        animateThumbnails(thumbSelectors[i]);
      }
    }

    // Order each page by best score
    let __videos = [];
    let orderByScore = function(selector1, selector2) {
      $(selector1).each(function(i, el) {
        let views = parseInt($(el).find('article > div > div > div.metaInfoRight > span:nth-child(1)').text().trim().split('%')[0]);
        let score = parseInt($(el).find('article > div > div > div.metaInfoRight > span:nth-child(2)').text().trim().split('%')[0]);
        let duration = parseInt($(el).find('.videoDuration').text().trim().split(/\s+/)[0].replace(/:/g, ''));

        if (isNaN(views)) {
          views = parseInt($(el).find('article > div > div.metaInfoRight > span.viewCounter').text().trim().split('%')[0]);
        }

        if (isNaN(score)) {
          score = parseInt($(el).find('article > div > div.metaInfoRight > span.voting.score.like').text().trim().split('%')[0]);
        }

        duration = isNaN(duration) ? 0 : duration;

        __videos.push({
          score: isNaN(score) ? 0 : score,
          views: isNaN(views) ? 0 : views,
          duration,
          el: el
        });

        $(el).remove();
      });

      __videos = _.chain(__videos).orderBy(['score', 'duration', 'views'], ['asc', 'asc', 'asc']).uniq().value().reverse();

      $(selector2).each(function(el) {
        $(el).remove();
      });

      _.each(__videos, function(vid) {
        $(selector2).eq(0).append($(vid.el));
      });
    };

    for (let z = scoreArchiveSelectors.length - 1; z >= 0; z--) {
      if ($(scoreArchiveSelectors[z][0]).length > 0) {
        orderByScore(scoreArchiveSelectors[z][0], scoreArchiveSelectors[z][1]);
      }
    }

    for (let i = 0, len = linkSelectors.length; i < len; i++) {
      $(linkSelectors[i]).each((i, el) => {
        let duration = $(el).find('.videoDuration');
        let durationText = duration.text();

        if (watched.indexOf(el.href) > -1) {
          duration.text(`${durationText}‎‎‎‏‏‎‏‏‎ ‎‏‏‎ ‎‏‎‏ ‎✓ Watched`);
        }

        $(el).on('click', (e) => {
          e.preventDefault();

          addWatchedVideo(el.href);
          duration.text(`${durationText}‏‏‎‏‏‎ ‎‏‏‎ ‎‏‏‎‏‏‎ ‎✓ Watched`);

          window.open(el.href);
        })
      });
    }

    setTimeout(() => {
      removeSpam();
      $('#mainSection > section > div > ul > li.col-xs-12.col-s-12.col-l-8.col10-xl-2.col-xxl-4').remove();
    }, 6000);
  }, 0);
});