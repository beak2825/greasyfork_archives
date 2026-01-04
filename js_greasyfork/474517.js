// ==UserScript==
// @name         E-Hentai - UX Tweaks
// @namespace    brazenvoid
// @version      2.0.5
// @author       brazenvoid
// @license      GPL-3.0-only
// @description  Numerous features to enrich your browsing experience
// @match        https://e-hentai.org/*
// @match        https://exhentai.org/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://update.greasyfork.org/scripts/375557/Base%20Brazen%20Resource.js
// @require      https://update.greasyfork.org/scripts/416104/Brazen%20UI%20Generator.js
// @require      https://update.greasyfork.org/scripts/418665/Brazen%20Configuration%20Manager.js
// @require      https://update.greasyfork.org/scripts/429587/Brazen%20Item%20Attributes%20Resolver.js
// @require      https://update.greasyfork.org/scripts/416105/Brazen%20Base%20Search%20Enhancer.js
// @grant        GM_addStyle
// @grant        GM_download
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/474517/E-Hentai%20-%20UX%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/474517/E-Hentai%20-%20UX%20Tweaks.meta.js
// ==/UserScript==

GM_addStyle(
    String.raw`#bv-ui{font-size:1.25rem;min-width:310px;width:310px}.adult-tag::after{content:'\2713';position:absolute;top:-8px;right:0;font-size:10px;color:aquamarine}.disliked-tag{background-color:lightcoral !important;color:white !important}.disliked-tag:hover{background-color:indianred !important}.disliked-tag > a{color:white !important}.disliked-tag.favourite-tag{background-color:orange !important}.disliked-tag.favourite-tag:hover{background-color:darkorange !important}.favourite-tag{background-color:mediumseagreen !important;color:white !important}.favourite-tag:hover{background-color:forestgreen !important}.favourite-tag > a{color:white !important}.underage-tag::after{content:'\2717';position:absolute;top:-8px;right:0;font-size:10px;color:red}.unknown-age-tag::after{content:'\003F';position:absolute;top:-8px;right:0;font-size:10px;color:yellow}`)

const IS_GALLERY_PAGE = $('#gdt').length
const IS_IMAGE_PAGE = location.pathname.startsWith('/s/')
const IS_SEARCH_PAGE = $('#f_search').length
const IS_SMALL_WINDOW = $('.stuffbox').length
const IS_TAG_SEARCH_PAGE = location.pathname.startsWith('/tag')
const IS_UPLOADER_SEARCH_PAGE = location.pathname.startsWith('/uploader')
const IS_WATCHED_PAGE = document.querySelectorAll('.ido > div > p.ip')?.length > 0

const IS_EXTENDED_LAYOUT = IS_SEARCH_PAGE && $('table.itg.glte').length > 0
const IS_MINIMAL_LAYOUT = !IS_EXTENDED_LAYOUT && $('table.itg.gltm').length > 0
const IS_COMPACT_LAYOUT = !IS_MINIMAL_LAYOUT && $('table.itg.gltc').length > 0
const IS_THUMBNAIL_LAYOUT = !IS_COMPACT_LAYOUT && $('div.itg.gld').length > 0

const ITEM_RATED_BLUE = 'ratedBlue'
const ITEM_RATED_GREEN = 'ratedGreen'
const ITEM_RATED_RED = 'ratedRed'
const ITEM_TAGS = 'tags'
const ITEM_WATCHED = 'watched'

const FILTER_RATED_VIDEOS = 'Hide Rated Galleries'
const FILTER_UNDERAGE_CHARACTERS_OPTION = 'Enable Underage Females Filter'
const FILTER_WATCHED_FROM_SEARCH = 'Hide Watched Galleries'

const STYLE_GALLERY_HIGHLIGHT = 'gallery-highlight'

const UI_DEFAULTS_PAGE_RANGE = 'Page Range'
const UI_DEFAULTS_PAGE_RANGE_ENABLE = 'Enable Page Range Filter'
const UI_DEFAULTS_RATING = 'Rating'
const UI_DEFAULTS_RATING_ENABLE = 'Enable Rating Filter'
const UI_DEFAULTS_TAGS = 'Tags'
const UI_DEFAULTS_TAGS_ENABLE = 'Enable Default Tags'

const UI_OPEN_GALLERIES_AUTO_NEXT = 'Search Auto Next'
const UI_OPEN_GALLERY_PAGES_AUTO_NEXT = 'Gallery Auto Next'
const UI_OPEN_GALLERY_PAGES_THROTTLING = 'Throttling Bypass'
const UI_OPEN_GALLERY_PAGES_DOWNLOAD = 'Download The Image'

const UI_EMBED_TORRENTS = 'Embed Torrent Downloads'
const UI_VISITED_HIGHLIGHT = 'Highlight Visited'
const UI_GALLERY_HIGHLIGHTS = 'Gallery Highlights'
const UI_GALLERY_HIGHLIGHTS_COLOUR = 'Highlight Colour'

const UI_TAG_HIGHLIGHTS_ADULT_CHARACTER = 'Adult Characters'
const UI_TAG_HIGHLIGHTS_DISLIKED = 'Disliked Tags'
const UI_TAG_HIGHLIGHTS_FAVOURITE = 'Favourite Tags'
const UI_TAG_HIGHLIGHTS_UNDERAGE_CHARACTER = 'Underage Characters'
const UI_TAG_HIGHLIGHTS_UNKNOWN_AGE_CHARACTER = 'Unknown Age Characters'

let selectorItem = '', selectorItemLink = '', selectorItemList = '', selectorItemName = ''
if (IS_EXTENDED_LAYOUT) {
  selectorItem = 'tr'
  selectorItemLink = '.gl2e > div > a'
  selectorItemList = '.itg.glte > tbody'
  selectorItemName = '.gl4e.glname > div.glink'
} else if (IS_COMPACT_LAYOUT) {
  selectorItem = 'tr'
  selectorItemLink = '.gl3c.glname > a'
  selectorItemList = '.itg.gltc > tbody'
  selectorItemName = '.gl3c.glname > a > div.glink'
} else if (IS_MINIMAL_LAYOUT) {
  selectorItem = 'tr'
  selectorItemLink = '.gl3m.glname > a'
  selectorItemList = '.itg.gltm > tbody'
  selectorItemName = '.gl3m.glname > a > div.glink'
} else if (IS_THUMBNAIL_LAYOUT) {
  selectorItem = 'div.gl1t'
  selectorItemLink = '.gl3t > a'
  selectorItemList = '.itg.gld'
  selectorItemName = '.gl4t.glname'
}

class EHentaiSearchAndUITweaks extends BrazenBaseSearchEnhancer
{
  constructor()
  {
    super({
      downloadsDelay: 2,
      isUserLoggedIn: false,
      itemDeepAnalysisSelector: 'div.gm',
      itemLinkSelector: selectorItemLink,
      itemListSelectors: selectorItemList,
      itemNameSelector: selectorItemName,
      itemSelectors: selectorItem,
      itemSelectionMethod: 'children',
      requestDelay: 0,
      scriptPrefix: 'e-hentai-ux-',
      tagSelectorGenerator: (tag) => {
        tag = tag.trim()
        if (IS_GALLERY_PAGE) {
          let tagAttribute = tag.replaceAll(' ', '_')
          return 'div[id="td_' + tagAttribute + '"]'
        }
        return 'div.gt[title="' + tag + '"], div.gtl[title="' + tag + '"]'
      },
    })

    this._setupFeatures()
    this._setupFilters()
    this._setupUI()
    this._setupEvents()
  }

  /**
   * @param {ItemTagHighlightsConfiguration} config
   * @protected
   */
  _ageFilterHighlighter(config)
  {
    this.registerHighlightStyleClass(config.styleClass)

    this._configurationManager.addTagRulesetField(
        config.configKey, true, config.rows ?? 5, config.helpText, (rules) => this._morphCharacterNamesToTags(rules), true)

    let highlightsHandler = (section) => {

      let ruleApplies, tagToHighlight
      for (let rule of this._configurationManager.getField(config.configKey).optimized) {

        ruleApplies = section.find(rule.join(', ')).length === 2
        tagToHighlight = section.find(rule[0])

        if (ruleApplies) {
          tagToHighlight.addClass(config.styleClass)
          if (config.removeClasses !== undefined) {
            tagToHighlight.removeClass(config.removeClasses)
          }
        } else {
          tagToHighlight.removeClass(config.styleClass)
        }
      }
    }
    if (config.otherTagSectionsSelector && config.otherTagSectionsSelector.length > 0) {
      this._onBeforeUIBuild.push(() => highlightsHandler(config.otherTagSectionsSelector))
    }
    this._onItemShow.push((item) => highlightsHandler(item))
  }

  /**
   * @param {string} tag
   * @return {string}
   * @private
   */
  _formatTag(tag)
  {
    if (tag.includes(':') && !tag.includes('"') && (tag.includes(' ') || tag.includes('+'))) {
      tag = tag.replace(':', ':"') + '"'
    }
    return tag
  }

  /**
   *
   * @param {JQuery} item
   * @return {string[]}
   * @private
   */
  _gatherItemTags(item)
  {
    let tags = []
    let tagElements = item.find('.gt,.gtl')
    if (IS_EXTENDED_LAYOUT) {
      tagElements.each((_i, e) => {
        tags.push($(e).attr('title'))
      })
    } else {
      tagElements.each((_i, e) => {
        let tagID = $(e).find('a').attr('id')
        if (tagID.startsWith('ta_')) {
          tagID = tagID.replace('ta_', '')
        }
        if (tagID.startsWith('td_')) {
          tagID = tagID.replace('td_', '')
        }
        tags.push(tagID.replace('_', ' '))
      })
    }
    return tags
  }

  /**
   * @param {{}} range
   * @param {URLSearchParams} queryParams
   * @private
   */
  _handleDefaultPageRangeFilter(range, queryParams)
  {
    if (range.minimum > 0) {
      queryParams.set('f_spf', range.minimum)
    }
    if (range.maximum > 0) {
      queryParams.set('f_spt', range.maximum)
    }
  }

  /**
   * @param {string} rating
   * @param {URLSearchParams} queryParams
   * @private
   */
  _handleDefaultRatingsFilter(rating, queryParams)
  {
    queryParams.set('f_srdd', rating)
  }

  /**
   * @param {string[]} tags
   * @param {URLSearchParams} queryParams
   * @private
   */
  _handleDefaultTags(tags, queryParams)
  {
    let existingTags = queryParams.get('f_search')
    let updatedTags = existingTags
    let include = true

    for (let tag of tags) {
      if (existingTags.includes(tag)) {
        include = false
        break
      } else {
        updatedTags += '+' + this._formatTag(tag)
      }
    }

    if (include) {
      queryParams.set('f_search', updatedTags)
    }
  }

  /**
   * @private
   */
  _handleDefaults()
  {
    let queryParams = new URLSearchParams(location.search)
    let existingParams = queryParams.toString()

    if (!queryParams.has('next') &&
        (this._getConfig(UI_DEFAULTS_PAGE_RANGE_ENABLE) || this._getConfig(UI_DEFAULTS_RATING_ENABLE) || this._getConfig(UI_DEFAULTS_TAGS_ENABLE))) {

      if (!queryParams.has('f_search')) {

        let existingTag = ''
        let urlSegments = location.pathname.split('/')

        if (IS_TAG_SEARCH_PAGE) {
          existingTag = urlSegments.pop().trim()
        } else if (IS_UPLOADER_SEARCH_PAGE) {
          existingTag = 'uploader:' + urlSegments.pop().trim()
        }
        queryParams.set('f_search', existingTag.length ? this._formatTag(existingTag) : '')
      }

      if (!queryParams.has('advsearch')) {
        queryParams.set('advsearch', '1')
      }

      let validatePageRange = (range, defaultValidator) => defaultValidator(range) && !queryParams.has('f_spf') &&
          !queryParams.has('f_spt')

      this._performTogglableComplexOperation(UI_DEFAULTS_PAGE_RANGE_ENABLE, UI_DEFAULTS_PAGE_RANGE, validatePageRange,
          (range) => {
            this._handleDefaultPageRangeFilter(range, queryParams)
          })

      let validateRatingFilter = (range, defaultValidator) => defaultValidator(range) && !queryParams.has('f_srdd')

      this._performTogglableComplexOperation(UI_DEFAULTS_RATING_ENABLE, UI_DEFAULTS_RATING, validateRatingFilter,
          (rating) => {
            this._handleDefaultRatingsFilter(rating, queryParams)
          })

      this._performTogglableOperation(UI_DEFAULTS_TAGS_ENABLE, UI_DEFAULTS_TAGS, (tags) => {
        this._handleDefaultTags(tags, queryParams)
      })

      let updatedParams = queryParams.toString().replaceAll('%2B', '+')
      if (updatedParams !== existingParams) {
        if (IS_TAG_SEARCH_PAGE || IS_UPLOADER_SEARCH_PAGE) {
          location.href = location.origin + '?' + updatedParams
        } else {
          location.href = location.origin + location.pathname + '?' + updatedParams
        }
      }
    }
  }

  /**
   * @param {boolean} removeElement
   * @private
   */
  _handleDownloadMedia(removeElement)
  {
    let image = document.querySelector('#img')

    this._addDownload(image, document.title.replace(' --- Porn', ''), image.src.split('/').pop(), removeElement)
  }

  /**
   * @param {JQuery} item
   * @private
   */
  _handleGalleryHighlights(item)
  {
    let mode = this._getConfig(UI_GALLERY_HIGHLIGHTS)
    let itemHasHighlight = item.hasClass(STYLE_GALLERY_HIGHLIGHT)

    if (mode !== 'Disabled') {

      let itemTags = this._get(item, ITEM_TAGS), doHighlight, tag
      if (itemTags) {

        for (let rule of this._configurationManager.getField(UI_TAG_HIGHLIGHTS_FAVOURITE).optimized) {

          doHighlight = true
          for (let tagSelector of rule) {

            tag = tagSelector.split('"], div.gtl[title="').pop().replace('"]', '')

            if ((mode === 'All' && !itemTags.includes(tag)) ||
                (mode === 'Source' && ((!tag.startsWith('artist:') && !tag.startsWith('group:')) || !itemTags.includes(tag)))) {
              doHighlight = false
              break
            }
          }

          if (doHighlight) {
            if (!itemHasHighlight) {
              item.addClass(STYLE_GALLERY_HIGHLIGHT)
            }
            break
          }
        }

        if (!doHighlight && itemHasHighlight) {
          item.removeClass(STYLE_GALLERY_HIGHLIGHT)
        }
      }

    } else if (itemHasHighlight) {
      item.removeClass(STYLE_GALLERY_HIGHLIGHT)
    }
  }

  _handleOpenGalleries()
  {
    let links = document.querySelectorAll('.' + CLASS_COMPLIANT_ITEM + ' > ' + selectorItemLink)
    if (links.length > 0) {
      links.forEach(itemLink => window.open(itemLink.href))

      if (this._getConfig(UI_OPEN_GALLERIES_AUTO_NEXT)) {
        document.querySelector('#unext').click()
      }
    }
  }

  /**
   * @private
   */
  async _handleOpenGalleryImages()
  {
    let bypassThrottling = this._getConfig(UI_OPEN_GALLERY_PAGES_THROTTLING)
    let images = $('#gdt > a')
    let firstPageNumber = images.first().attr('href').split('-').pop()
    let maxPages = firstPageNumber + images.length - 1

    for (let page = images.length - 1; page >= 0; page--) {

      window.open(images.eq(page).attr('href'))

      if (bypassThrottling && page !== 0) {
        await Utilities.sleep(2000)
      }
    }

    if (this._getConfig(UI_OPEN_GALLERY_PAGES_AUTO_NEXT)) {

      let page = location.href.split('=')[1] ?? 0
      let pageNavs = $('.ptt td')

      maxPages = Number.parseInt(pageNavs.eq(pageNavs.length - 2).children('a').text()) - 1
      if (page < maxPages) {

        let uri = location.href
        if (page === 0) {
          uri += '?p=1'
        } else {
          uri = uri.replace('?p=' + page++, '?p=' + page)
        }
        location.href = uri
      }
    }
  }

  /**
   * @param {JQuery} item
   * @param {string} option
   * @private
   */
  _handleRatedGalleries(item, option)
  {
    let doesntComply
    switch (option) {
      case 'Blue':
        doesntComply = this._get(item, ITEM_RATED_BLUE)
        break
      case 'Green':
        doesntComply = this._get(item, ITEM_RATED_GREEN)
        break
      case 'Red':
        doesntComply = this._get(item, ITEM_RATED_RED)
        break
      case 'All':
        doesntComply = this._get(item, ITEM_RATED_BLUE) || this._get(item, ITEM_RATED_GREEN) || this._get(item, ITEM_RATED_RED)
        break
    }
    return !doesntComply
  }

  /**
   * @private
   */
  _handleTorrentDownloadsEmbedding()
  {
    let link = $('#gd5 > .g2 > a').eq(1)
    if (!link.text().endsWith('(0)')) {

      let container = $('<div class="gm"></div>').insertBefore('#cdiv')
      container.load(link.attr('onclick').replace('return popUp(\'', '').replace('\',610,590)', '') + ' form', () => {
        container.prepend('<h1 style="font-size:10pt; font-weight:bold; margin:3px; text-align:center">Torrents</h1>')
        link.parent().remove()
      })
    }
  }

  _handleUnderageFilter(otherTagSections)
  {
    this._configurationManager.addFlagField(FILTER_UNDERAGE_CHARACTERS_OPTION, 'Applies the underage filter.')

    this._ageFilterHighlighter({
      configKey: UI_TAG_HIGHLIGHTS_UNDERAGE_CHARACTER,
      otherTagSectionsSelector: otherTagSections,
      styleClass: 'underage-tag',
      removeClasses: 'favourite-tag disliked-tag',
      helpText: "Filter and mark character tags that are not adults in any canon timelines.\nFormat: [character tag] from [parody tag] // [comments]\nExample: lynae from wuthering waves",
    })

    this._ageFilterHighlighter({
      configKey: UI_TAG_HIGHLIGHTS_UNKNOWN_AGE_CHARACTER,
      otherTagSectionsSelector: otherTagSections,
      styleClass: 'unknown-age-tag',
      helpText: "Specify characters which don't have officially declared age.\nFormat: [character tag] from [parody tag]\nExample: chiori from genshin impact",
    })

    this._ageFilterHighlighter({
      configKey: UI_TAG_HIGHLIGHTS_ADULT_CHARACTER,
      otherTagSectionsSelector: otherTagSections,
      styleClass: 'adult-tag',
      helpText: "Specify characters checked to be adults.\nFormat: [character tag] from [parody tag] // [comments]\nExample: cantarella from wuthering waves",
    })

    this._addItemComplexComplianceFilter(
        UI_TAG_HIGHLIGHTS_UNDERAGE_CHARACTER,
        (rules) => this._getConfig(FILTER_UNDERAGE_CHARACTERS_OPTION) && rules.length,
        (item, blacklistRuleset) => {
          let isBlacklisted
          let itemTags = this._get(item, ITEM_TAGS)

          if (itemTags !== null && itemTags.length) {
            for (let rule of blacklistRuleset) {

              isBlacklisted = true
              for (let tagSelector of rule) {

                if (!itemTags.includes(tagSelector.split(', ')[0].replace('div.gt[title="', '').replace('"]', ''))) {
                  isBlacklisted = false
                  break
                }
              }
              if (isBlacklisted) {
                return false
              }
            }
          }
          return true
        })
  }

  /**
   * @param {string[]} rules
   * @return {string[]}
   * @private
   */
  _morphCharacterNamesToTags(rules)
  {
    let morphedRules = [], tags
    for (let rule of rules) {
      tags = rule.split(' // ')[0].split(' from ')
      if (tags.length === 2) {
        morphedRules.push('character:' + tags[0] + ' & parody:' + tags[1])
      }
    }
    return morphedRules
  }

  /**
   * @private
   */
  _setupEvents()
  {
    this._onValidateInit = () => !IS_SMALL_WINDOW

    this._onBeforeUIBuild.push(() => {

      this._performOperation(UI_VISITED_HIGHLIGHT, () => {
        GM_addStyle(`td.gl2e > div > a:visited > .glname > .glink {color: black;}`)
      })

      if (IS_SEARCH_PAGE) {
        this._handleDefaults(this._getConfig(UI_GALLERY_HIGHLIGHTS_COLOUR))
        GM_addStyle('.gallery-highlight{background-color:' + this._getConfig(UI_GALLERY_HIGHLIGHTS_COLOUR) + ' !important;border:whitesmoke 2px solid}')
      }

      if (IS_IMAGE_PAGE && this._getConfig(UI_OPEN_GALLERY_PAGES_DOWNLOAD)) {
        this._handleDownloadMedia(true)
        this._disableUI = true
      }
    })

    this._onAfterUIBuild.push(() => {

      this._uiGen.getSelectedSection()[0].userScript = this

      if (IS_GALLERY_PAGE) {
        this._performOperation(UI_EMBED_TORRENTS, () => this._handleTorrentDownloadsEmbedding())
      }
    })

    this._onFirstHitBeforeCompliance.push((item) => {
      let tags = this._itemAttributesResolver.get(item, ITEM_TAGS) ?? []
      let galleryType = item.find('.cn,.cs').first().text()
      let galleryTypeMap = new Map([
        ['Artist CG', 'acg'],
        ['Asian Porn', 'aporn'],
        ['Cosplay', 'cosplay'],
        ['Doujinshi', 'dj'],
        ['Game CG', 'gcg'],
        ['Image Set', 'img'],
        ['Manga', 'manga'],
        ['Misc', 'misc'],
        ['Non-H', 'nonh'],
        ['Western', 'west'],
      ])
      tags.push('type:' + (galleryTypeMap.get(galleryType)))

      this._itemAttributesResolver.set(item, ITEM_TAGS, tags)
    })

    this._onItemHide = (item) => {
      if (item.is('td.gl2e')) {
        item.parent().addClass('noncompliant-item')
        item.parent().hide()
      } else {
        item.removeClass('noncompliant-item')
        item.hide()
      }
    }

    this._onItemShow.push((item) => {
      if (item.is('td.gl2e')) {
        item.parent().removeClass('noncompliant-item')
        item.parent().show()
      } else {
        item.removeClass('noncompliant-item')
        item.show()
      }
    })

    if (IS_SEARCH_PAGE) {
      this._onItemShow.push((item) => this._handleGalleryHighlights(item))
    }
  }

  /**
   * @private
   */
  _setupFeatures()
  {
    this._configurationManager.
        addColorField(
            UI_GALLERY_HIGHLIGHTS_COLOUR, 'Colour to highlight the galleries with. Requires refresh to change.').
        addFlagField(
            FILTER_WATCHED_FROM_SEARCH, 'Hides watched galleries from searches initiated other than the watched page.').
        addFlagField(
            UI_OPEN_GALLERIES_AUTO_NEXT, 'Automatically navigates to the next page after opening all galleries.').
        addFlagField(
            UI_OPEN_GALLERY_PAGES_AUTO_NEXT, 'Automatically navigates to the next page after opening all images.').
        addFlagField(
            UI_OPEN_GALLERY_PAGES_DOWNLOAD, 'Download image on a gallery page to a folder named after the gallery.').
        addFlagField(
            UI_OPEN_GALLERY_PAGES_THROTTLING,
            'Paces the page opening logic to not trigger the site\'s throttling mechanism which limits resolution to 1280x.').
        addFlagField(
            UI_DEFAULTS_PAGE_RANGE_ENABLE,
            'Always set these page limits in searches. Ignored if you set your own values on the page.').
        addFlagField(
            UI_DEFAULTS_RATING_ENABLE, 'Enable default rating filter in searches').
        addFlagField(
            UI_DEFAULTS_TAGS_ENABLE, 'Enable default tags in searches.').
        addFlagField(
            UI_EMBED_TORRENTS, 'Embed torrent downloads in gallery pages.').
        addFlagField(
            UI_VISITED_HIGHLIGHT, 'Colours the visited gallery links black, to make them distinct.').
        addRadiosGroup(
            FILTER_RATED_VIDEOS,
            [
              ['Disabled', 'Disabled'],
              ['Red', 'Red'],
              ['Blue', 'Blue'],
              ['Green', 'Green'],
              ['All', 'All'],
            ],
            'Hides galleries rated by you with the colour set in site settings or all.').
        addRadiosGroup(
            UI_DEFAULTS_RATING,
            [
              ['2 stars', '2'],
              ['3 stars', '3'],
              ['4 stars', '4'],
              ['5 stars', '5'],
            ],
            'Always set this rating filter in searches. Ignored if you set your own value on the page.').
        addRadiosGroup(
            UI_GALLERY_HIGHLIGHTS,
            [
              ['Disabled', 'Disabled'],
              ['All Favourite Tags', 'All'],
              ['Only Group / Artist Tags', 'Source'],
            ],
            'Highlights favourite galleries in search results with at least one matching tag.').
        addRangeField(
            UI_DEFAULTS_PAGE_RANGE, 0, 2000, 'Enable default page range filter in searches.').
        addRulesetField(
            UI_DEFAULTS_TAGS, 4, 'Always add the following tags in search. Can be overridden with at least one tag present.')

    this._addItemTagAttribute(ITEM_TAGS, !IS_EXTENDED_LAYOUT, false, (item) => this._gatherItemTags(item))

    this._itemAttributesResolver.
        addAttribute(ITEM_WATCHED, (item) => item.find('.gt[style],.gtl[style]').attr('style')?.startsWith('color:#f1f1f1') ?? false).
        addAttribute(ITEM_RATED_BLUE, (item) => item.find('.irb').length > 0).
        addAttribute(ITEM_RATED_GREEN, (item) => item.find('.irg').length > 0).
        addAttribute(ITEM_RATED_RED, (item) => item.find('.irr').length > 0)
  }

  _setupFilters()
  {
    let otherTagSections = IS_GALLERY_PAGE ? $('#taglist') : null

    this._addItemComplexComplianceFilter(
        FILTER_RATED_VIDEOS,
        (option) => option !== 'Disabled',
        (item, option) => this._handleRatedGalleries(item, option))

    this._addItemComplexComplianceFilter(
        FILTER_WATCHED_FROM_SEARCH,
        (enabled) => !IS_GALLERY_PAGE && !IS_WATCHED_PAGE && enabled,
        (item) => !this._get(item, ITEM_WATCHED))

    this._addItemTagHighlights({
      configKey: UI_TAG_HIGHLIGHTS_FAVOURITE,
      otherTagSectionsSelector: otherTagSections,
      styleClass: 'favourite-tag',
      rows: 10,
      helpText: 'Specify favourite tags to highlight.',
    })

    this._addItemTagHighlights({
      configKey: UI_TAG_HIGHLIGHTS_DISLIKED,
      otherTagSectionsSelector: otherTagSections,
      styleClass: 'disliked-tag',
      rows: 10,
      helpText: 'Specify disliked tags to highlight.',
    })

    this._addItemTagBlacklistFilter(ITEM_TAGS, false, 20)
    this._addItemBlacklistFilter('Hide galleries with specified phrases in their names.', 10)

    this._handleUnderageFilter(otherTagSections)
  }

  /**
   * @private
   */
  _setupUI()
  {
    let pageSpecificButton, statistics = []
    if (IS_GALLERY_PAGE) {

      pageSpecificButton = this._uiGen.createFormButton(
          'Open Gallery Images',
          'Opens all images on current page of this gallery.',
          () => this._handleOpenGalleryImages())

    } else if (IS_IMAGE_PAGE) {

      pageSpecificButton = this._uiGen.createFormButton(
          'Download Image',
          'Downloads the image on the page.',
          () => this._handleDownloadMedia(false))

    } else {

      pageSpecificButton = this._uiGen.createFormButton(
          'Open All Galleries',
          'Opens all galleries on current page.',
          () => this._handleOpenGalleries())
      statistics = [
        this._uiGen.createStatisticsFormGroup(FILTER_TEXT_BLACKLIST),
        this._uiGen.createStatisticsFormGroup(FILTER_TAG_BLACKLIST),
        this._uiGen.createStatisticsFormGroup(FILTER_RATED_VIDEOS),
        this._uiGen.createStatisticsFormGroup(UI_TAG_HIGHLIGHTS_UNDERAGE_CHARACTER),
        IS_WATCHED_PAGE ? '' : this._uiGen.createStatisticsFormGroup(FILTER_WATCHED_FROM_SEARCH),
      ]
    }

    this._userInterface = [
      this._uiGen.createTabsSection(['Filters', 'Filters 2', 'Underage Filter', 'Galleries', 'Tag Highlights', 'Search Defaults', 'Extras'], [
        this._uiGen.createTabPanel('Filters', true).append([
          this._configurationManager.createElement(FILTER_WATCHED_FROM_SEARCH),
          this._configurationManager.createElement(OPTION_ENABLE_TAG_BLACKLIST),
          this._configurationManager.createElement(FILTER_TAG_BLACKLIST),
          this._configurationManager.createElement(OPTION_DISABLE_COMPLIANCE_VALIDATION),
        ]),
        this._uiGen.createTabPanel('Filters 2').append([
          this._configurationManager.createElement(FILTER_RATED_VIDEOS),
          this._uiGen.createSeparator(),
          this._configurationManager.createElement(OPTION_ENABLE_TEXT_BLACKLIST),
          this._configurationManager.createElement(FILTER_TEXT_BLACKLIST),
        ]),
        this._uiGen.createTabPanel('Galleries').append([
          this._uiGen.createTitle('Open Galleries'),
          this._configurationManager.createElement(UI_OPEN_GALLERIES_AUTO_NEXT),
          this._uiGen.createSeparator(),
          this._uiGen.createTitle('Open Images'),
          this._configurationManager.createElement(UI_OPEN_GALLERY_PAGES_AUTO_NEXT),
          this._configurationManager.createElement(UI_OPEN_GALLERY_PAGES_THROTTLING),
          this._uiGen.createSeparator(),
          this._uiGen.createTitle('Image Pages'),
          this._configurationManager.createElement(UI_OPEN_GALLERY_PAGES_DOWNLOAD),
          this._uiGen.createSeparator(),
          this._configurationManager.createElement(UI_GALLERY_HIGHLIGHTS),
          this._uiGen.createBreakSeparator(),
          this._uiGen.createBreakSeparator(),
          this._configurationManager.createElement(UI_GALLERY_HIGHLIGHTS_COLOUR),
        ]),
        this._uiGen.createTabPanel('Tag Highlights').append([
          this._configurationManager.createElement(UI_TAG_HIGHLIGHTS_FAVOURITE),
          this._configurationManager.createElement(UI_TAG_HIGHLIGHTS_DISLIKED),
        ]),
        this._uiGen.createTabPanel('Search Defaults').append([
          this._configurationManager.createElement(UI_DEFAULTS_PAGE_RANGE_ENABLE),
          this._configurationManager.createElement(UI_DEFAULTS_PAGE_RANGE),
          this._uiGen.createSeparator(),
          this._configurationManager.createElement(UI_DEFAULTS_RATING),
          this._uiGen.createBreakSeparator(),
          this._configurationManager.createElement(UI_DEFAULTS_RATING_ENABLE),
          this._uiGen.createSeparator(),
          this._configurationManager.createElement(UI_DEFAULTS_TAGS_ENABLE),
          this._configurationManager.createElement(UI_DEFAULTS_TAGS),
        ]),
        this._uiGen.createTabPanel('Underage Filter').append([
          this._configurationManager.createElement(FILTER_UNDERAGE_CHARACTERS_OPTION),
          this._configurationManager.createElement(UI_TAG_HIGHLIGHTS_UNDERAGE_CHARACTER),
          this._configurationManager.createElement(UI_TAG_HIGHLIGHTS_UNKNOWN_AGE_CHARACTER),
          this._configurationManager.createElement(UI_TAG_HIGHLIGHTS_ADULT_CHARACTER),
        ]),
        this._uiGen.createTabPanel('Extras').append([
          this._configurationManager.createElement(UI_EMBED_TORRENTS),
          this._configurationManager.createElement(UI_VISITED_HIGHLIGHT),
          this._configurationManager.createElement(OPTION_ALWAYS_SHOW_SETTINGS_PANE),
          this._uiGen.createSeparator(),
          this._createSettingsBackupRestoreFormActions(),
        ]),
      ]),
      this._uiGen.createBottomSection([
        ...statistics,
        this._uiGen.createSeparator(),
        pageSpecificButton,
        this._uiGen.createSeparator(),
        this._createSettingsFormActions(),
      ]),
    ]
  }
}

(new EHentaiSearchAndUITweaks).init()