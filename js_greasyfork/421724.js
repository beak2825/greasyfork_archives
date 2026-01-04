// ==UserScript==
// @name         SpankBang - Search and UI Enhancer
// @namespace    brazenvoid
// @version      2.2.9
// @author       brazenvoid
// @license      GPL-3.0-only
// @description  Various search filters and user experience enhancers
// @match        https://spankbang.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://update.greasyfork.org/scripts/375557/1655717/Base%20Brazen%20Resource.js
// @require      https://update.greasyfork.org/scripts/416104/1655740/Brazen%20UI%20Generator.js
// @require      https://update.greasyfork.org/scripts/418665/1646611/Brazen%20Configuration%20Manager.js
// @require      https://update.greasyfork.org/scripts/429587/1244644/Brazen%20Item%20Attributes%20Resolver.js
// @require      https://update.greasyfork.org/scripts/416105/1709101/Brazen%20Base%20Search%20Enhancer.js
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/421724/SpankBang%20-%20Search%20and%20UI%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/421724/SpankBang%20-%20Search%20and%20UI%20Enhancer.meta.js
// ==/UserScript==

GM_addStyle(
    `#bv-ui{font-size:max(16px, 0.8rem);min-width:min(25vw, 350px);width:min(25vw, 350px)}#bv-ui .bv-button{background-color:grey;border-radius:5px}#bv-ui .bv-button:hover{background-color:darkgrey}#bv-ui .bv-group{margin-bottom:5px}#bv-ui .bv-input{background-color:grey;border-radius:5px;padding:0.25rem 0.5rem}#bv-ui .bv-input:hover{background-color:darkgrey}#bv-ui .bv-tab-button{padding:0.25rem 0.75rem}.bv-section hr{margin:1rem 0;border:1px white solid}`)

const PAGE_PATH_NAME = window.location.pathname
const PAGE_PATH_FRAGMENTS = PAGE_PATH_NAME.split('/')

const IS_HOME_PAGE = PAGE_PATH_NAME === '/'
const IS_VIDEO_PAGE = $('#video').length > 0
const IS_PLAYLIST_PAGE = !IS_VIDEO_PAGE && PAGE_PATH_FRAGMENTS[2] === 'playlist'
const IS_PROFILE_PAGE = PAGE_PATH_FRAGMENTS[1] === 'profile'
const IS_SEARCH_PAGE = PAGE_PATH_FRAGMENTS[1] === 's' || PAGE_PATH_FRAGMENTS[1] === 'tag'

// Configuration

const FILTER_VIDEOS_RESOLUTION = 'Resolution'
const FILTER_VIDEOS_DURATION = 'Duration'
const FILTER_VIDEOS_LIKED = 'Liked'
const FILTER_VIDEOS_RATED = 'Close Rated Videos'
const FILTER_VIDEOS_MAXIMUM_AGE = 'Maximum Age'
const FILTER_VIDEOS_MINIMUM_AGE = 'Minimum Age'
const FILTER_VIDEOS_RATING = 'Rating'
const FILTER_VIDEOS_VIEWS = 'Views'

const UI_BYPASS_DOWNLOAD_REQUIREMENT = 'Enable Downloads Bypass'
const UI_REMOVE_EMBED_VIDEO_SECTION = 'Remove Embed Video Section'
const UI_REPOSITION_SCREENSHOTS = 'Reposition Video Screenshots'
const UI_REPOSITION_VIDEO_DETAILS = 'Reposition Video Details'
const UI_SWAP_RELATED_VIDEOS = 'Reposition Related Videos'

// Item attributes

const ITEM_DURATION = 'duration'
const ITEM_LIKED = 'liked'
const ITEM_RATING = 'rating'
const ITEM_RESOLUTION = 'resolution'
const ITEM_VIEWS = 'views'

class SpankBangSearchAndUIEnhancer extends BrazenBaseSearchEnhancer
{
  constructor()
  {
    super({
      isUserLoggedIn: $('.links > .auth').length > 0,
      itemDeepAnalysisSelector: '.video_toolbar',
      itemLinkSelector: 'div.responsive-page > div > p > a',
      itemListSelectors: '.video-list, .js-media-list',
      itemNameSelector: 'div.responsive-page > div > p > a > span',
      itemSelectors: 'div.js-video-item, div.video-item:not(.clear-fix)',
      requestDelay: 0,
      scriptPrefix: 'sb-sui-',
    })
    this._setupItemAttributes()
    this._setupFeatures()
    this._setupUI()
    this._setupEvents()
  }

  /**
   * @return {JQuery<HTMLElement> | jQuery | HTMLElement}
   * @private
   */
  _generatePseudoLeftSection()
  {
    return $('<div class="left space-y-0.5"></div>')
  }

  /**
   * @private
   */
  _openVideo(items, index, delay)
  {
    Utilities.sleep(delay).then(() => {
      window.open(items.eq(index).find(this._config.itemLinkSelector).attr('href'))
      index++
      if (items.length !== index) {
        this._openVideo(items, index, delay)
      }
    })
  }

  /**
   * @private
   */
  _openVideos()
  {
    let listWrapSelector
    if (IS_SEARCH_PAGE || IS_PLAYLIST_PAGE) {
      listWrapSelector = '.results_search'
    } else if (IS_PROFILE_PAGE) {
      listWrapSelector = '.data'
    } else if (IS_VIDEO_PAGE) {
      listWrapSelector = '.user_uploads'
    }
    let items = $(listWrapSelector + ' ' + this._config.itemListSelectors + ' > ' + this._config.itemSelectors + ':not(.' + CLASS_NON_COMPLIANT_ITEM + ')')
    if (items.length) {
      this._openVideo(items, 0, 100)
    }
  }

  /**
   * @private
   */
  _setupEvents()
  {
    this._onBeforeUIBuild.push(() => {
      if (IS_VIDEO_PAGE) {

        this._performOperation(UI_BYPASS_DOWNLOAD_REQUIREMENT, () => {
          GM_addStyle('.download-list.download-options-modal{display: block !important}')
        })

        this._performOperation(FILTER_VIDEOS_RATED, () => {
          if ($('.rt .i_new-ui-checkmark-circle-outlined').length) {
            window.close()
          }
        })

        this._performOperation(UI_REMOVE_EMBED_VIDEO_SECTION, () => {
          $('.embed').remove()
        })

        this._performOperation(UI_REPOSITION_VIDEO_DETAILS, () => {
          let detailsSection = $('div.left section.details')
          $('div.right').prepend(detailsSection)
          $('<br>').insertAfter(detailsSection)
        })

        this._performOperation(UI_REPOSITION_SCREENSHOTS, () => {
          $('div.left section.timeline').insertBefore('#player_wrapper_outer')
        })

        this._performOperation(UI_SWAP_RELATED_VIDEOS, () => {

          let commentsSection = $('#comment_box_anchor')
          let headingSection = $('')
          let relatedVideosSection = $('div.similar')
          let rightSection = $('div.right')

          commentsSection.
              css('padding', '.5rem').
              css('border-radius', '.25rem').
              css('background-color', 'var(--comments-wrapper-bg-color)')

          relatedVideosSection.
              insertAfter(commentsSection).
              prepend('<h2>Similar Videos</h2>').
              addClass('mt-1 mb-1').
              removeAttr('style').
              find('.video-list').
              addClass('four-col')

          if (this._getConfig(UI_REPOSITION_VIDEO_DETAILS)) {
            commentsSection.insertAfter($('section.details'))
          } else {
            rightSection.prepend(commentsSection)
          }
          GM_addStyle('div.right > .show-more-button-container{display:none}')
        })

        Validator.sanitizeNodeOfSelector('div.video > div.left > h1',
            this._configurationManager.getFieldOrFail(FILTER_TEXT_SANITIZATION).optimized)
      }
    })

    this._onAfterUIBuild.push(() => {
      this._uiGen.getSelectedSection()[0].userScript = this
    })
  }

  _setupFeatures()
  {
    this._configurationManager.
        addFlagField(FILTER_VIDEOS_LIKED, 'Hide videos that you have rated automatically, may cause major slowdowns.').
        addFlagField(FILTER_VIDEOS_RATED, 'Close tabs of videos that you have already rated.').
        addFlagField(UI_BYPASS_DOWNLOAD_REQUIREMENT, 'Bypasses the upload requirement for video downloads.').
        addFlagField(UI_REMOVE_EMBED_VIDEO_SECTION, 'Removes embed video section on video pages.').
        addFlagField(UI_REPOSITION_SCREENSHOTS, 'Move video screenshots above video player on video pages.').
        addFlagField(UI_REPOSITION_VIDEO_DETAILS, 'Move video details section to the top of the right pane.').
        addFlagField(UI_SWAP_RELATED_VIDEOS, 'Swaps related videos section with comments section').
        addNumberField(FILTER_VIDEOS_MAXIMUM_AGE, 0, 100, 'Maximum age filter value.').
        addNumberField(FILTER_VIDEOS_MINIMUM_AGE, 0, 100, 'Minimum age filter value.').
        addCheckboxesGroup(FILTER_VIDEOS_RESOLUTION, [
          ['SD', 'SD'],
          ['HD', 'HD'],
          ['4K', '4K'],
        ], 'Filter videos by resolution.').
        addRangeField(FILTER_VIDEOS_DURATION, 0, 100000, 'Filter videos by duration in minutes.').
        addRangeField(FILTER_VIDEOS_RATING, 0, 100, 'Filter videos by duration.').
        addRangeField(FILTER_VIDEOS_VIEWS, 0, 9999999999, 'Filter videos by view count.')

    this._addItemTextSanitizationFilter(
        'Censor video names by substituting offensive phrases. Each rule in separate line with comma separated target phrases. Example Rule: boyfriend=stepson,stepdad')
    this._addItemWhitelistFilter(
        'Show videos with specified phrases in their names. Separate the phrases with line breaks.')
    this._addItemTextSearchFilter()
    this._addItemComplianceFilter(FILTER_VIDEOS_RATING, ITEM_RATING)
    this._addItemComplianceFilter(FILTER_VIDEOS_DURATION, ITEM_DURATION)
    this._addItemComplianceFilter(FILTER_VIDEOS_LIKED, (item) => !this._get(item, ITEM_LIKED))
    this._addItemComplianceFilter(FILTER_VIDEOS_VIEWS, ITEM_VIEWS)
    this._addItemComplianceFilter(FILTER_VIDEOS_RESOLUTION, (item, values) => {
      let itemResolution = this._get(item, ITEM_RESOLUTION)
      if (itemResolution === null) {
          return true
      }
      return values.join('').includes(itemResolution)
    })
    this._addItemBlacklistFilter(
        'Hide videos with specified phrases in their names. Separate the phrases with line breaks.')
  }

  /**
   * @private
   */
  _setupItemAttributes()
  {
    this._itemAttributesResolver.
        addAttribute(ITEM_DURATION, (item) => {
          let durationBadge = item.find('span.video-badge.l')
          return durationBadge.length ? parseInt(durationBadge.text().replace('m', '')) : null
        }).
        addAttribute(ITEM_RATING, (item) => {

          let stats = item.find('span[data-test-id="rates"] > span.md:text-body-md')
          if (stats.length) {

            let rating = stats.text().trim().replace('%', '')
            if (rating !== '') {
              return parseInt(rating)
            }
          }
          return null
        }).
        addAttribute(ITEM_RESOLUTION, (item) => {
          let resolutionBadge = item.find('span.video-badge.h')
          return resolutionBadge.length ? resolutionBadge.text() : null
        }).
        addAttribute(ITEM_VIEWS, (item) => {

          let stats = item.find('span[data-test-id="views"] > span.md:text-body-md')
          if (stats.length) {

            let viewsString = stats.text().trim()
            if (viewsString !== '') {

              let viewsAmount = parseInt(
                  viewsString.
                      replace('K', '').
                      replace('M', '').
                      replace('B', '')
              )

              if (viewsString.endsWith('K')) {
                viewsAmount *= 1000
              } else if (viewsString.endsWith('M')) {
                viewsAmount *= 1000000
              } else if (viewsString.endsWith('B')) {
                viewsAmount *= 1000000000
              }
              return viewsAmount
            }
          }
          return null
        }).
        addDeepAttribute(ITEM_LIKED, (item) => {
          return item.find('.rt .i_svg.i_check').length > 0
        })
  }

  /**
   * @private
   */
  _setupUI()
  {
    this._userInterface = [
      this._uiGen.createTabsSection(['Filters', 'Text', 'Stats', 'Global'], [
        this._uiGen.createTabPanel('Filters', true).append([
          this._configurationManager.createElement(FILTER_VIDEOS_DURATION),
          this._configurationManager.createElement(FILTER_VIDEOS_RATING),
          this._configurationManager.createElement(FILTER_VIDEOS_VIEWS),
          this._uiGen.createBreakSeparator(),
          this._uiGen.createBreakSeparator(),
          this._configurationManager.createElement(FILTER_VIDEOS_LIKED),
          this._uiGen.createSeparator(),
          this._configurationManager.createElement(FILTER_VIDEOS_RESOLUTION),
          this._uiGen.createSeparator(),
          this._uiGen.createFormButton('Open Videos', 'Opens all filtered videos in new tabs successively', () => {
            this._openVideos()
          }),
          this._uiGen.createBreakSeparator(),
          this._configurationManager.createElement(FILTER_VIDEOS_RATED),
          this._uiGen.createSeparator(),
          this._configurationManager.createElement(OPTION_DISABLE_COMPLIANCE_VALIDATION),
        ]),
        this._uiGen.createTabPanel('Text').append([
          this._configurationManager.createElement(FILTER_TEXT_SEARCH),
          this._configurationManager.createElement(OPTION_ENABLE_TEXT_BLACKLIST),
          this._configurationManager.createElement(FILTER_TEXT_BLACKLIST),
          this._configurationManager.createElement(FILTER_TEXT_WHITELIST),
          this._configurationManager.createElement(FILTER_TEXT_SANITIZATION),
        ]),
        this._uiGen.createTabPanel('Stats').append([
          this._uiGen.createStatisticsFormGroup(FILTER_VIDEOS_DURATION),
          this._uiGen.createStatisticsFormGroup(FILTER_VIDEOS_LIKED),
          this._uiGen.createStatisticsFormGroup(FILTER_VIDEOS_RATING),
          this._uiGen.createStatisticsFormGroup(FILTER_VIDEOS_RESOLUTION),
          this._uiGen.createStatisticsFormGroup(FILTER_VIDEOS_VIEWS),
          this._uiGen.createStatisticsFormGroup(FILTER_TEXT_SEARCH),
          this._uiGen.createStatisticsFormGroup(FILTER_TEXT_BLACKLIST),
          this._uiGen.createStatisticsFormGroup(FILTER_TEXT_WHITELIST),
          this._uiGen.createSeparator(),
          this._uiGen.createStatisticsTotalsGroup(),
        ]),
        this._uiGen.createTabPanel('Global').append([
          this._configurationManager.createElement(UI_BYPASS_DOWNLOAD_REQUIREMENT),
          this._configurationManager.createElement(UI_REMOVE_EMBED_VIDEO_SECTION),
          this._configurationManager.createElement(UI_SWAP_RELATED_VIDEOS),
          this._configurationManager.createElement(UI_REPOSITION_VIDEO_DETAILS),
          this._configurationManager.createElement(UI_REPOSITION_SCREENSHOTS),
          this._uiGen.createSeparator(),
          this._configurationManager.createElement(OPTION_ALWAYS_SHOW_SETTINGS_PANE),
          this._uiGen.createSeparator(),
          this._createSettingsBackupRestoreFormActions(),
        ]),
      ]),
      this._createSettingsFormActions(),
    ]
  }
}

(new SpankBangSearchAndUIEnhancer).init()