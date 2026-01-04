// ==UserScript==
// @name         Hitomi - Search & UI Tweaks
// @namespace    brazenvoid
// @version      6.2.2
// @author       brazenvoid
// @license      GPL-3.0-only
// @description  Various search filters and user experience enhancers
// @match        https://hitomi.la/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://update.greasyfork.org/scripts/375557/1655717/Base%20Brazen%20Resource.js
// @require      https://update.greasyfork.org/scripts/416104/1655740/Brazen%20UI%20Generator.js
// @require      https://update.greasyfork.org/scripts/418665/1646611/Brazen%20Configuration%20Manager.js
// @require      https://update.greasyfork.org/scripts/429587/1244644/Brazen%20Item%20Attributes%20Resolver.js
// @require      https://update.greasyfork.org/scripts/416105/1709101/Brazen%20Base%20Search%20Enhancer.js
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/373484/Hitomi%20-%20Search%20%20UI%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/373484/Hitomi%20-%20Search%20%20UI%20Tweaks.meta.js
// ==/UserScript==

GM_addStyle(
    `#bv-ui{min-width:400px;width:400px}.disliked-tag{background-color:lightcoral !important}.disliked-tag:hover{background-color:indianred !important}.disliked-tag.favourite-tag{background-color:orange !important}.disliked-tag.favourite-tag:hover{background-color:darkorange !important}.favourite-tag{background-color:mediumseagreen !important}.favourite-tag:hover{background-color:forestgreen !important}`)

const IS_GALLERY_PAGE = $('#dl-button').length

const FILTER_GALLERY_TYPES = 'Show Gallery Types'
const FILTER_PAGES = 'Pages'
const FILTER_LANGUAGES = 'Languages'

const UI_AUTO_NEXT = 'Automatic Next Page'
const UI_FAVOURITE_TAGS = 'Favourite Tags'
const UI_DISLIKED_TAGS = 'Disliked Tags'
const UI_SHOW_ALL_TAGS = 'Show All Gallery Tags'

const ITEM_GALLERY_TYPE = 'Gallery Type'
const ITEM_LANGUAGE = 'Language'
const ITEM_TAGS = 'Tags'

class HitomiSearchAndUITweaks extends BrazenBaseSearchEnhancer
{
  constructor()
  {
    super({
      itemListSelectors: '.gallery-content',
      itemNameSelector: 'h1.lillie a',
      itemSelectors: '.anime,.acg,.dj,.cg,.imageset,.manga',
      scriptPrefix: 'hitomi-sui-',
      tagSelectorGenerator: (tag) => {
        let selector
        tag = encodeURIComponent(tag.trim()).replace('-', '%2D')

        if (tag.startsWith('artist%3A')) {
          selector = 'a[href="/artist/' + tag.replace('artist%3A', '') + '-all.html"]'
        } else if (tag.startsWith('series%3A')) {
          selector = 'a[href="/series/' + tag.replace('series%3A', '') + '-all.html"]'
        } else {
          selector = 'a[href="/tag/' + tag + '-all.html"]'
        }
        return selector
      },
    })
    this._setupFeatures()
    this._setupUI()
    this._setupEvents()
  }

  /**
   * @private
   */
  _setupEvents()
  {
    if (IS_GALLERY_PAGE) {
      this._onAfterUIBuild.push(() => this._performComplexOperation(
          FILTER_PAGES,
          (range) => !this._getConfig(OPTION_DISABLE_COMPLIANCE_VALIDATION) && this._configurationManager.generateValidationCallback(FILTER_PAGES)(range),
          (range) => {
            let navPages = $('.simplePagerNav li').length
            let pageCount = navPages > 0 ? navPages * 50 : $('.simplePagerPage1').length
            if (!Validator.isInRange(pageCount, range.minimum, range.maximum)) {
              top.close()
            }
          }),
      )
    } else {
      this._onAfterComplianceRun.push(() => this._performOperation(UI_AUTO_NEXT, () => {

        let navigation = $('.page-container')
        if (navigation.length > 0 && $('.' + CLASS_COMPLIANT_ITEM).length === 0) {

          let nextPage
          let noninteractableItems = navigation.first().find('ul > li:not(:has(a))')
          for (let i = 0; i < navigation.length; i++) {

            let noninteractableItem = noninteractableItems.eq(i)
            let content = noninteractableItem.text().trim()
            if (content !== '...') {
              nextPage = noninteractableItem.next()
              break
            }
          }

          if (nextPage.length > 0) {
            const url = new URL(window.location.href)
            url.searchParams.set('page', nextPage.children().first().text())
            window.location = url.href
          }
        }
      }))
    }

    this._onAfterUIBuild.push(() => this._uiGen.getSelectedSection()[0].userScript = this)

    this._onFirstHitAfterCompliance.push((item) => {
      this._performComplexOperation(UI_SHOW_ALL_TAGS, (flag) => flag && !IS_GALLERY_PAGE, () => {
        let tags = item.find('.relatedtags > ul > li')
        let lastTag = tags.last()
        if (lastTag.text() === '...') {
          lastTag.remove()
          tags.filter('.hidden-list-item').removeClass('hidden-list-item')
        }
      })
    })
  }

  /**
   * @private
   */
  _setupFeatures()
  {
    this._configurationManager.
        addCheckboxesGroup(FILTER_GALLERY_TYPES, [
          ['Anime', 'anime'],
          ['Artist CG', 'acg'],
          ['Doujinshi', 'dj'],
          ['Game CG', 'cg'],
          ['Image Set', 'imageset'],
          ['Manga', 'manga'],
        ], 'Show only selected gallery types.').
        addCheckboxesGroup(FILTER_LANGUAGES, [
          ['N/A', 'not-applicable'],
          ['Japanese', 'japanese'],
          ['Chinese', 'chinese'],
          ['English', 'english'],
          ['Albanian', 'albanian'],
          ['Arabic', 'arabic'],
          ['Bulgarian', 'bulgarian'],
          ['Catalan', 'catalan'],
          ['Cebuano', 'cebuano'],
          ['Czech', 'czech'],
          ['Danish', 'danish'],
          ['Dutch', 'dutch'],
          ['Esperanto', 'esperanto'],
          ['Estonian', 'estonian'],
          ['Finnish', 'finnish'],
          ['French', 'french'],
          ['German', 'german'],
          ['Greek', 'greek'],
          ['Hebrew', 'hebrew'],
          ['Hungarian', 'hungarian'],
          ['Indonesian', 'indonesian'],
          ['Italian', 'italian'],
          ['Korean', 'korean'],
          ['Latin', 'latin'],
          ['Mongolian', 'mongolian'],
          ['Norwegian', 'norwegian'],
          ['Persian', 'persian'],
          ['Polish', 'polish'],
          ['Portuguese', 'portuguese'],
          ['Romanian', 'romanian'],
          ['Russian', 'russian'],
          ['Slovak', 'slovak'],
          ['Spanish', 'spanish'],
          ['Swedish', 'swedish'],
          ['Tagalog', 'tagalog'],
          ['Thai', 'thai'],
          ['Turkish', 'turkish'],
          ['Ukrainian', 'ukrainian'],
          ['Unspecified', 'unspecified'],
          ['Vietnamese', 'vietnamese'],
        ], 'Select languages to show').
        addFlagField(UI_AUTO_NEXT, 'Navigates to next page if all results get filtered.').
        addFlagField(UI_SHOW_ALL_TAGS, 'Show all gallery tags in search results.').
        addRangeField(FILTER_PAGES, 0, Infinity, 'Close gallery pages that don\'t satisfy these page limits. Only works on galleries opened in new tabs.')

    this._itemAttributesResolver.
        addAttribute(ITEM_GALLERY_TYPE, (item) => item.attr('class')).
        addAttribute(ITEM_LANGUAGE, (item) => {
          let link = item.find('tr:nth-child(3) > td:nth-child(2) a')
          if (link.length) {
            return link.attr('href').replace('/index-', '').replace('.html', '')
          }
          return 'not-applicable'
        }).
        addAttribute(ITEM_TAGS, (item) => {
          let tags = []
          item.find('.relatedtags a').each((_i, link) => {
            tags.push(
                decodeURIComponent(
                    $(link).attr('href').replace(/^\/tag\//, '').replace(/-all\.html$/, '')))
          })
          item.find('.series-list a').each((_i, link) => {
            tags.push('series:' + $(link).text())
          })
          item.find('.artist-list a').each((_i, link) => {
            tags.push('artist:' + $(link).text())
          })
          return tags
        })

    this._addItemComplianceFilter(FILTER_LANGUAGES, ITEM_LANGUAGE)
    this._addItemComplianceFilter(FILTER_GALLERY_TYPES, ITEM_GALLERY_TYPE)

    let otherTagSections = IS_GALLERY_PAGE ? $('.tags') : null

    this._addItemTagHighlights(UI_FAVOURITE_TAGS, otherTagSections, 'favourite-tag', 'Specify favourite tags to highlight. "&" "|" can be used.')
    this._addItemTagHighlights(UI_DISLIKED_TAGS, otherTagSections, 'disliked-tag', 'Specify disliked tags to highlight. "&" "|" can be used.')
    this._addItemTagBlacklistFilter(ITEM_TAGS, false)
  }

  /**
   * @private
   */
  _setupUI()
  {
    this._userInterface = [
      this._uiGen.createTabsSection(['Filters', 'Highlights', 'Languages', 'Global'], [
        this._uiGen.createTabPanel('Filters', true).append([
          this._configurationManager.createElement(FILTER_GALLERY_TYPES),
          this._uiGen.createSeparator(),
          this._configurationManager.createElement(FILTER_PAGES),
          this._uiGen.createSeparator(),
          this._configurationManager.createElement(OPTION_ENABLE_TAG_BLACKLIST),
          this._configurationManager.createElement(FILTER_TAG_BLACKLIST),
          this._uiGen.createSeparator(),
          this._configurationManager.createElement(OPTION_DISABLE_COMPLIANCE_VALIDATION),
        ]),
        this._uiGen.createTabPanel('Highlights').append([
          this._configurationManager.createElement(UI_FAVOURITE_TAGS),
          this._configurationManager.createElement(UI_DISLIKED_TAGS),
        ]),
        this._uiGen.createTabPanel('Languages').append([
          this._configurationManager.createElement(FILTER_LANGUAGES),
        ]),
        this._uiGen.createTabPanel('Global').append([
          this._configurationManager.createElement(UI_AUTO_NEXT),
          this._configurationManager.createElement(UI_SHOW_ALL_TAGS),
          this._configurationManager.createElement(OPTION_ALWAYS_SHOW_SETTINGS_PANE),
          this._uiGen.createSeparator(),
          this._createSettingsBackupRestoreFormActions(),
        ]),
      ]),
      this._uiGen.createStatisticsFormGroup(FILTER_GALLERY_TYPES),
      this._uiGen.createStatisticsFormGroup(FILTER_LANGUAGES),
      this._uiGen.createStatisticsFormGroup(FILTER_TAG_BLACKLIST),
      this._uiGen.createSeparator(),
      this._createSettingsFormActions(),
    ]
  }
}

(new HitomiSearchAndUITweaks).init()