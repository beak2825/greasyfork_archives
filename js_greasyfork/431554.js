// ==UserScript==
// @name            Chaturbate Bullshit Remover
// @name:de         Chaturbate Bullshit-Entferner
// @name:fr         Dissolvant de Conneries Chaturbate
// @name:it         Rimuovi Stronzate Chaturbate
// @author          iXXX94
// @namespace       https://sleazyfork.org/users/809625-ixxx94
// @icon            https://www.google.com/s2/favicons?sz=64&domain=chaturbate.com
// @description     Remove banners, animations, gifs, gaudy colors, advertisements and any other bullshit
// @description:de  Entfernt banner, animationen, gifs, knallige farben, werbung und jeden anderen bullshit
// @description:fr  Supprime les bannières, les animations, les gifs, les couleurs voyantes, les publicités et toute autre connerie
// @description:it  Rimuove banner, animazioni, gif, colori sgargianti, pubblicità e qualsiasi altra cazzata
// @copyright       2021, iXXX94 (https://sleazyfork.org/users/809625-ixxx94)
// @license         MIT
// @version         1.6.0
// @homepageURL     https://sleazyfork.org/scripts/431554-chaturbate-bull-remover
// @homepage        https://sleazyfork.org/scripts/431554-chaturbate-bull-remover
// @supportURL      https://sleazyfork.org/scripts/431554-chaturbate-bull-remover/feedback
// @require         https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2.1.0/dist/index.min.js
// @require         https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require         https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js
// @match           *://*.chaturbate.com/*
// @exclude-match   *://status.chaturbate.com/*
// @exclude-match   *://support.chaturbate.com/*
// @run-at          document-start
// @inject-into     page
// @downloadURL https://update.greasyfork.org/scripts/431554/Chaturbate%20Bullshit%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/431554/Chaturbate%20Bullshit%20Remover.meta.js
// ==/UserScript==

/* global $, Cookies, VM */

(() => {
  // remove ads
  const adsCookie = document.cookie.split(';').some((item) => item.includes('noads=1'))

  if (!adsCookie) {
    Cookies.set('noads', 1)
    window.location.reload(false)
  }

  // remove bullshit, but not the social links, they might be interesting :)
  VM.observe(document.documentElement || document.body, () => {
    const bullshit = $('.BioContents tr').has('[rel="nofollow"]')

    // if bullshit exists
    if (bullshit.length > 0) {
      const links = {}

      // collect social links
      $(bullshit).find('img[rel="nofollow"], a[rel="nofollow"]').each((index, element) => {
        const href = $(element).attr('href')
        const InstagramLink = 'https://www.instagram.com/$1'
        const InstagramRegex = /\/external_link\/\?url=(?:(?:http|https)%3a%2f%2f)?(?:www\.)?(?:instagram\.com|instagr\.am)%2f(\w*)/gi
        const OnlyFansLink = 'https://onlyfans.com/$1'
        const OnlyFansRegex = /\/external_link\/\?url=(?:(?:http|https)%3a%2f%2f)?(?:www\.)?onlyfans\.com%2f(\w*)/gi
        const PornHubLink = 'https://pornhub.com/$1/$2'
        const PornHubRegex = /\/external_link\/\?url=(?:(?:http|https)%3a%2f%2f)?(?:www\.)?pornhub\.com%2f([\w.-]+)%2f(\w*)/gi
        const SuicideGirlsLink = 'https://www.suicidegirls.com/$1/$2/'
        const SuicideGirlsRegex = /\/external_link\/\?url=(?:(?:http|https)%3a%2f%2f)?(?:www\.)?suicidegirls\.com%2f([\w.-]+)%2f(\w*)/gi
        const TikTokLink = 'https://tiktok.com/@$1'
        const TikTokRegex = /\/external_link\/\?url=(?:(?:http|https)%3a%2f%2f)?(?:www\.)?tiktok\.com%2f%40(\w*)/gi
        const TwitterLink = 'https://twitter.com/$1'
        const TwitterRegex = /\/external_link\/\?url=(?:(?:http|https)%3a%2f%2f)?(?:www\.)?twitter\.com%2f(\w*)/gi
        const YouTubeLink = 'https://www.youtube.com/$1/$2'
        const YouTubeRegex = /\/external_link\/\?url=(?:(?:http|https)%3a%2f%2f)?(?:www\.)?youtube\.com%2f([\w.-]+)(?:%2f(\w*))?/gi

        if (InstagramRegex.test(href) && !('Instagram' in links)) links.Instagram = href.replace(InstagramRegex, InstagramLink)
        if (OnlyFansRegex.test(href) && !('OnlyFans' in links)) links.OnlyFans = href.replace(OnlyFansRegex, OnlyFansLink)
        if (PornHubRegex.test(href) && !('PornHub' in links)) links.PornHub = href.replace(PornHubRegex, PornHubLink)
        if (SuicideGirlsRegex.test(href) && !('SuicideGirls' in links)) links.SuicideGirls = href.replace(SuicideGirlsRegex, SuicideGirlsLink)
        if (TikTokRegex.test(href) && !('TikTok' in links)) links.TikTok = href.replace(TikTokRegex, TikTokLink)
        if (TwitterRegex.test(href) && !('Twitter' in links)) links.Twitter = href.replace(TwitterRegex, TwitterLink)
        if (YouTubeRegex.test(href) && !('YouTube' in links)) links.YouTube = href.replace(YouTubeRegex, YouTubeLink)
      })

      // if there are links to social networks, show them in bio, but without bullshit (referrals, badges, etc.)
      if (!$.isEmptyObject(links)) {
        // log links
        console.log(links)

        $('.BioContents table tr:last-of-type').after(`
          <tr class="SocialLinks" style="font-size: 14px; font-weight: normal; line-height: 15px; vertical-align: top; text-align: left;">
            <td class="label" style="font-family: UbuntuMedium, Arial, Helvetica, sans-serif; height: 16px;">Social links:</td>
            <td class="contentText" style="font-size: 14px; line-height: 16px; font-family: UbuntuRegular, Arial, Helvetica, sans-serif;"></td>
          </tr>
        `)

        $.each(links, (index, element) => {
          $('.SocialLinks .contentText').append(`
            <div>
              <a href="${element}" target="_blank">${index}</a>
            </div>
          `)
        })
      }

      // remove bullshit
      $(bullshit).remove()

      // keep observing
      return false
    }
  })

  // remove bullshit styles
  VM.observe(document.documentElement || document.body, () => {
    const bullshitStyle = $('#VideoPanel > div:nth-child(5) > span > div > div, #VideoPanel > div:nth-child(5) > span > div > div span')

    // if bullshit styles exists
    if (bullshitStyle.length > 0) {
      $(bullshitStyle).each((index, element) => {
      // remove bullshit styles
        $(element).find('img').remove()
        $(element)
          .css('background-color', '')
          .css('color', '')
          .css('font-family', '')
          .css('font-size', '')
          .css('font-weight', '')
      })

      // keep observing
      return false
    }
  })
})()
