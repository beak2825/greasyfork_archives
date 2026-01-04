// ==UserScript==
// @name         YouTube (incl embedded) Video Quality Preference
// @namespace    https://github.com/Alistair1231/my-userscripts/blob/master/youtube-embed-quality.user.js
// @version      1.1.0
// @license      AGPLv3
// @author       Alistair1231
// @description  Set initial video quality for all YouTube videos (embedded or on youtube.com) based on a set of preferred video qualities
// @match        *://www.youtube.com/embed/*
// @match        *://www.youtube.com/*
// @require      https://cdn.jsdelivr.net/gh/Alistair1231/my-userscripts@b2046277b444b73e076f64021d68426da93d71c3/types/lib.js
// @downloadURL https://update.greasyfork.org/scripts/539509/YouTube%20%28incl%20embedded%29%20Video%20Quality%20Preference.user.js
// @updateURL https://update.greasyfork.org/scripts/539509/YouTube%20%28incl%20embedded%29%20Video%20Quality%20Preference.meta.js
// ==/UserScript==
// https://greasyfork.org/en/scripts/539509-embedded-youtube-video-quality-preference
// https://github.com/Alistair1231/my-userscripts/blob/master/youtube-embed-quality.user.js
;(async () => {
  // select quality in order of preference
  const preferredQualities = ['2160p', '1440p', '1080p', '720p', '480p', '360p', '240p', '144p'];

  // !!!
  // !!! End of configuration
  // !!!
  /*global lib */
  /**
   * @typedef {import('./types/lib.js').Lib} Lib
   * @type {Lib}
   */

  // click settings button
  await lib.waitFor('.ytp-settings-button').then((x) => {
    console.log('Youtube Embed Quality: Found settings button', x)
    return x.click()
  })
  // wait for the settings menu to appear
  await lib.waitFor('.ytp-panel-menu')

  // wait for the "Quality" menu item to appear
  const qualityItem = await lib.waitForText('.ytp-menuitem-label', 'Quality')
  console.log('Youtube Embed Quality: Found quality menu item', qualityItem)
  qualityItem.click()

  const qualityRegex = new RegExp(`(${preferredQualities.join('|')})`, 'i') // case-insensitive regex to match preferred qualities
  const qualities = await lib.waitForText(
    '.ytp-menuitem-label',
    qualityRegex,
    true,
    true
  )
  console.log('Youtube Embed Quality: Found qualities', qualities)

  for (const prefQuality of preferredQualities) {
    const quality = qualities.find((q) => q.textContent.match(new RegExp(prefQuality, 'i')))
    if (quality) {
      console.log(`Youtube Embed Quality: Setting quality to ${prefQuality}`)
      quality.click()
      return
    }
  }
})(lib)
