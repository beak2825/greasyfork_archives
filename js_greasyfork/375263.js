// ==UserScript==
// @name         AZNude - Video Search & UI Tweaks
// @namespace    brazenvoid
// @version      4.0.9
// @author       brazenvoid
// @license      GPL-3.0-only
// @description  Search and cleaners
// @match        https://www.aznude.com/*
// @match        https://search.aznude.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://update.greasyfork.org/scripts/375557/1655717/Base%20Brazen%20Resource.js
// @require      https://update.greasyfork.org/scripts/416104/1655740/Brazen%20UI%20Generator.js
// @require      https://update.greasyfork.org/scripts/418665/1646611/Brazen%20Configuration%20Manager.js
// @require      https://update.greasyfork.org/scripts/429587/1244644/Brazen%20Item%20Attributes%20Resolver.js
// @require      https://update.greasyfork.org/scripts/424499/1580019/Brazen%20Paginator.js
// @require      https://update.greasyfork.org/scripts/416105/1709101/Brazen%20Base%20Search%20Enhancer.js
// @grant        GM_addStyle
// @run-at	     document-idle
// @downloadURL https://update.greasyfork.org/scripts/375263/AZNude%20-%20Video%20Search%20%20UI%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/375263/AZNude%20-%20Video%20Search%20%20UI%20Tweaks.meta.js
// ==/UserScript==

GM_addStyle(`#bv-ui{min-width:350px;width:350px}.bv-button{color:black}.bv-input.bv-text{color:black}.bv-section{font-size:1rem}`)

// Globals

const PAGE_HOST_NAME = window.location.host
const PAGE_PATH_NAME = window.location.pathname

const IS_SEARCH_HOST = window.location.host.startsWith('search')
const IS_SEARCH_PAGE = PAGE_PATH_NAME.startsWith('/browse') || IS_SEARCH_HOST
const IS_SOURCE_PAGE = PAGE_PATH_NAME.startsWith('/view')
const IS_VIDEO_PAGE = PAGE_PATH_NAME.startsWith('/azncdn') || PAGE_PATH_NAME.startsWith('/mrskin')

const SCRIPT_PREFIX = 'az-sui-'

const SELECTOR_ITEM_DURATION = '.video-time, .video-timestamp'
const SELECTOR_ITEM_LIST = '.browse-type + .container > .row, .browse-celeb-main-content + .container > .row, .title-center + .row'
const SELECTOR_PAGINATION_WRAPPER = '.nav.navbar-nav.navbar-center .lbtn-group.text-mid-center'

// Items

const ITEM_ACTRESS = 'actress'

// Features

const FILTER_ACTRESS_BLACKLIST = 'Actress Blacklist'

const OPTION_ENABLE_ACTRESS_BLACKLIST = 'Enable Actress Blacklist'

const UI_REMOVE_AD_BOXES = 'Remove Ad Video Blocks'
const UI_REMOVE_RECOMMENDATIONS = 'Remove Recommendation Sections'
const UI_REMOVE_SCREENSHOTS = 'Remove Screenshots'
const UI_REMOVE_STORIES = 'Remove Stories'

class AZSearchAndUITweaks extends BrazenBaseSearchEnhancer
{
    constructor()
    {
        super({
            isUserLoggedIn: false,
            itemDeepAnalysisSelector: '',
            itemLinkSelector: 'a.video',
            itemListSelectors: '.vertical-list-section, .browse-type + .container > .row, .browse-celeb-main-content + .container > .row, .title-center + .row',
            itemNameSelector: 'h4',
            itemSelectors: '.celebs-boxes, .video-list-item',
            requestDelay: 0,
            scriptPrefix: 'azn-sui-',
            tagSelectorGenerator: null,
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
        this._onBeforeUIBuild.push(() => {

            this._performOperation(UI_REMOVE_AD_BOXES, () => {
                $('.ad-box-video').each((index, element) => {
                    element.remove()
                })
            })

            this._performOperation(UI_REMOVE_RECOMMENDATIONS, () => {
                $('.recommended').each((index, element) => {
                    element.remove()
                })
            })

            this._performComplexOperation(
                UI_REMOVE_STORIES,
                (enabled) => enabled && IS_SOURCE_PAGE,
                () => {
                    $('.browse-celeb-main-content').each((_i, element) => {
                        let node = $(element)
                        if (node.find('h4 > span').text().trim() === 'story:') {
                            node.hide()
                            node.next().hide()
                        }
                    })
                })

            this._performComplexOperation(
                OPTION_ENABLE_ACTRESS_BLACKLIST,
                (enabled) => enabled && this._getConfig(FILTER_ACTRESS_BLACKLIST).length && IS_SOURCE_PAGE,
                () => {
                    let blacklist = this._configurationManager.getField(FILTER_ACTRESS_BLACKLIST).optimized
                    $('.browse-celeb-main-content').each((_i, element) => {
                        let node = $(element)
                        if (blacklist.includes(node.find('a.page-link').text().toLowerCase().trim())) {
                            node.hide()
                            node.next().hide()
                        }
                    })
                })
        })

        this._onAfterUIBuild.push(() => this._uiGen.getSelectedSection()[0].userScript = this)
    }

    /**
     * @private
     */
    _setupFeatures()
    {
        this._configurationManager
            .addFlagField(UI_REMOVE_AD_BOXES, 'Hides ads disguised inside the videos list.')
            .addFlagField(UI_REMOVE_RECOMMENDATIONS, 'Hides recommendation sections')
            .addFlagField(UI_REMOVE_SCREENSHOTS, 'Hides screenshots from videos on celeb and movie pages.')
            .addFlagField(UI_REMOVE_STORIES, 'Hides stories from celeb pages.')
            .addFlagField(OPTION_ENABLE_ACTRESS_BLACKLIST, 'Applies the actress blacklist.')
            .addRulesetField(FILTER_ACTRESS_BLACKLIST, 5, 'Hide videos and sections of specified actresses', null, null, (rules) => {
                let optimizedRules = []
                for (let i = 0; i < rules.length; i++) {
                    optimizedRules[i] = rules[i].trim().toLowerCase()
                }
                return optimizedRules
            })

        this._itemAttributesResolver.addAttribute(ITEM_ACTRESS, (item) => item.find('h4').text().trim().toLowerCase() || null)

        this._setupPaginator(IS_SEARCH_PAGE, {
            itemListSelector: SELECTOR_ITEM_LIST,
            lastPageUrl: window.location.origin + $('.lbtn-next').prev().attr('href'),
            onGetPageNoFromUrl: (url) => parseInt(url.split('/').pop().replace('.html', '')),
            onGetPageUrlFromPageNo: (newPageNo, paginator) => window.location.href.replace(paginator.getCurrentPageNo().toString(), newPageNo.toString()),
            onGetPaginationElementForPageNo: (pageNo, paginator) => paginator.getPaginationWrapper().find(pageNo === paginator.getCurrentPageNo() ? '#menu' : 'a[href$="' + pageNo + '"]'),
            paginationWrapper: $(SELECTOR_PAGINATION_WRAPPER)
        })

        this._addItemDurationRangeFilter(SELECTOR_ITEM_DURATION)
        this._addItemComplexComplianceFilter(UI_REMOVE_SCREENSHOTS, (value) => value && IS_SOURCE_PAGE, (item) => Validator.isChildMissing(item, 'a.picture'))
        this._addItemComplexComplianceFilter(
            FILTER_ACTRESS_BLACKLIST,
            (actresses) => this._getConfig(OPTION_ENABLE_ACTRESS_BLACKLIST) && actresses.length,
            (item, actresses) => !actresses.includes(this._get(item, ITEM_ACTRESS)),
        )
    }

    _setupUI()
    {
        this._userInterface = [
            this._uiGen.createTabsSection(['Filters', 'UI', 'Global'], [
                this._uiGen.createTabPanel('Filters', true).append([
                    this._configurationManager.createElement(FILTER_DURATION_RANGE),
                    this._uiGen.createSeparator(),
                    this._configurationManager.createElement(OPTION_ENABLE_ACTRESS_BLACKLIST),
                    this._configurationManager.createElement(FILTER_ACTRESS_BLACKLIST),
                    this._uiGen.createSeparator(),
                    this._configurationManager.createElement(OPTION_DISABLE_COMPLIANCE_VALIDATION),
                ]),
                this._uiGen.createTabPanel('UI').append([
                    this._configurationManager.createElement(UI_REMOVE_AD_BOXES),
                    this._configurationManager.createElement(UI_REMOVE_RECOMMENDATIONS),
                    this._configurationManager.createElement(UI_REMOVE_SCREENSHOTS),
                    this._configurationManager.createElement(UI_REMOVE_STORIES),
                    this._uiGen.createSeparator(),
                    this._configurationManager.createElement(CONFIG_PAGINATOR_THRESHOLD),
                    this._configurationManager.createElement(CONFIG_PAGINATOR_LIMIT),
                ]),
                this._uiGen.createTabPanel('Global').append([
                    this._configurationManager.createElement(OPTION_ALWAYS_SHOW_SETTINGS_PANE),
                    this._uiGen.createSeparator(),
                    this._createSettingsBackupRestoreFormActions(),
                ]),
            ]),
            this._uiGen.createStatisticsFormGroup(FILTER_DURATION_RANGE, 'Duration'),
            this._uiGen.createStatisticsFormGroup(FILTER_TEXT_BLACKLIST, 'Actress Blacklist'),
            this._uiGen.createStatisticsFormGroup(UI_REMOVE_SCREENSHOTS, 'Screenshots'),
            this._uiGen.createSeparator(),
            this._createSettingsFormActions(),
        ]
    }
}

(new AZSearchAndUITweaks).init()