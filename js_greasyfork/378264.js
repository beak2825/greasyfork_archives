// ==UserScript==
// @name         XHamster Search and UI Improvements
// @namespace    brazenvoid
// @version      2.3.0
// @author       brazenvoid
// @license      GPL-3.0-only
// @description  Various search filters
// @include      https://xhamster.com/*
// @match        https://*.xhamster.com/*
// @match        https://xhamster2.com/*
// @match        https://*.xhamster2.com/*
// @match        https://xhamster3.com/*
// @match        https://*.xhamster3.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @require      https://greasyfork.org/scripts/375557-base-brazen-resource/code/Base%20Brazen%20Resource.js?version=1115796
// @require      https://greasyfork.org/scripts/416104-brazen-ui-generator/code/Brazen%20UI%20Generator.js?version=1115813
// @require      https://greasyfork.org/scripts/418665-brazen-configuration-manager/code/Brazen%20Configuration%20Manager.js?version=1163542
// @require      https://greasyfork.org/scripts/429587-brazen-item-attributes-resolver/code/Brazen%20Item%20Attributes%20Resolver.js?version=1139392
// @require      https://greasyfork.org/scripts/424499-brazen-paginator/code/Brazen%20Paginator.js?version=1114815
// @require      https://greasyfork.org/scripts/416105-brazen-base-search-enhancer/code/Brazen%20Base%20Search%20Enhancer.js?version=1163543
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/378264/XHamster%20Search%20and%20UI%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/378264/XHamster%20Search%20and%20UI%20Improvements.meta.js
// ==/UserScript==

GM_addStyle(
    `#settings-wrapper{top:5vh;width:270px}#settings-wrapper .check-radio-input{display:block}#settings-wrapper .form-button{border:revert}.font-primary{color:white}.tab-button:hover:not(.active){color:black}.tab-button:not(.active){color:white}.bg-brand{background-color:#3a3a3a}`)

const PAGE_PATH_NAME = window.location.pathname
const IS_PROFILE_TREE_PAGE = PAGE_PATH_NAME.startsWith('/users')
const IS_PROFILE_VIDEOS_PAGE = IS_PROFILE_TREE_PAGE && PAGE_PATH_NAME.includes('/videos')
const IS_PROFILE_PAGE = IS_PROFILE_TREE_PAGE && !IS_PROFILE_VIDEOS_PAGE
const IS_VIDEO_PAGE = PAGE_PATH_NAME.startsWith('/videos')

const FILTER_HD_VIDEOS = 'Show only HD Videos'
const FILTER_VIDEOS_VIEWS = 'Views'

class XHamsterSearchAndUITweaks extends BrazenBaseSearchEnhancer
{
    constructor()
    {
        super({
            isUserLoggedIn:           false,
            itemDeepAnalysisSelector: '',
            itemLinkSelector:         'a.video-thumb-info__name',
            itemListSelectors:        'div.thumb-list',
            itemNameSelector:         'a.video-thumb-info__name',
            itemSelectors:            '.thumb-list__item',
            requestDelay:             0,
            scriptPrefix:             'xh-sui-',
        })
        
        this._configurationManager.addFlagField(FILTER_HD_VIDEOS, 'Hides videos of less than 720p resolution.').addRangeField(FILTER_VIDEOS_VIEWS, 0, 10000000,
            'Filter videos by view count.')
        
        if (!IS_VIDEO_PAGE) {
            let paginationSection = $('.pager-container ul')
            let nextPageNode = paginationSection.find('li.next')
            let lastPageUrl = nextPageNode.length ? nextPageNode.prev().find('a').attr('href') : window.location.href
            
            this._setupPaginator({
                itemListSelector:                '.thumb-list:not(.thumb-list--related):first',
                lastPageUrl:                     lastPageUrl,
                paginationWrapper:               paginationSection,
                onGetPageNoFromUrl:              (url) => {
                    let lastSegment = parseInt(url.split('/').pop())
                    return isNaN(lastSegment) ? 1 : lastSegment
                },
                onGetPageUrlFromPageNo:          (newPageNo) => {
                    let currentUrl = window.location.href
                    let currentUrlFragments = currentUrl.split('/')
                    
                    if (newPageNo === 1) {
                        if (!isNaN(parseInt(currentUrlFragments[currentUrl.length - 1]))) {
                            currentUrlFragments.pop()
                        }
                    } else {
                        if (isNaN(parseInt(currentUrlFragments[currentUrl.length - 1]))) {
                            currentUrlFragments.push(newPageNo.toString())
                        } else {
                            currentUrlFragments[currentUrl.length - 1] = newPageNo.toString()
                        }
                    }
                    return currentUrlFragments.join('/')
                },
                onGetPaginationElementForPageNo: (pageNo, paginator) => {
                    let selector = pageNo === paginator.getCurrentPageNo() ? 'a.xh-paginator-button.active' : 'a.xh-paginator-button[data-page=' + pageNo + ']'
                    return paginator.getPaginationWrapper().find(selector).parent()
                },
            })
        }
        
        this._setupUI()
        this._setupComplianceFilters()
    }
    
    /**
     * @private
     */
    _markAllVisited()
    {
        let current_url = window.location.href
        $('a.video-thumb-info__name').each((_i, element) => {
            history.replaceState({}, '', element.href)
        })
        history.replaceState({}, '', current_url)
    }
    
    /**
     * @private
     */
    _setupComplianceFilters()
    {
        this._addItemTextSanitizationFilter(
            'Censor video names by substituting offensive phrases. Each rule in separate line with comma separated target phrases. Example Rule: boyfriend=stepson,stepdad')
        this._addItemWhitelistFilter('Show videos with specified phrases in their names. Separate the phrases with line breaks.')
        this._addItemTextSearchFilter()
        this._addItemPercentageRatingRangeFilter('div.rating span.metric-text')
        this._addItemDurationRangeFilter('div.thumb-image-container__duration')
        this._addItemComplianceFilter(FILTER_VIDEOS_VIEWS, (item, range) => {
            let viewsCount = 0
            let viewsCountNode = item.find('div.views span.metric-text')
            if (viewsCountNode.length) {
                viewsCount = parseInt(viewsCountNode.text().replace(',', ''))
                if (isNaN(viewsCount)) {
                    viewsCount = 0
                }
            }
            return Validator.isInRange(viewsCount, range.minimum, range.maximum)
        })
        this._addItemComplianceFilter(
            FILTER_HD_VIDEOS, (item) => !Validator.isChildMissing(item, 'i.thumb-image-container__icon--hd,i.thumb-image-container__icon--uhd'))
        this._addItemBlacklistFilter('Hide videos with specified phrases in their names. Separate the phrases with line breaks.')
    }
    
    /**
     * @private
     */
    _setupUI()
    {
        this._onBeforeUIBuild = () => {
            if (IS_VIDEO_PAGE) {
                Validator.sanitizeNodeOfSelector(
                    'main > div.width-wrap.with-player-container > h1:first', this._configurationManager.getFieldOrFail(FILTER_TEXT_SANITIZATION).optimized)
            }
        }
        
        this._onUIBuild = () =>
            this._uiGen.createSettingsSection().append([
                this._uiGen.createTabsSection(['Filters', 'Text Based', 'Global'], [
                    this._uiGen.createTabPanel('Filters', true).append([
                        this._configurationManager.createElement(FILTER_DURATION_RANGE),
                        this._configurationManager.createElement(FILTER_PERCENTAGE_RATING_RANGE),
                        this._configurationManager.createElement(FILTER_VIDEOS_VIEWS),
                        this._uiGen.createBreakSeparator(),
                        this._configurationManager.createElement(FILTER_HD_VIDEOS),
                        this._configurationManager.createElement(FILTER_UNRATED),
                        this._uiGen.createSeparator(),
                        this._configurationManager.createElement(OPTION_DISABLE_COMPLIANCE_VALIDATION),
                        this._uiGen.createFormButton('Mark All Videos Viewed', 'Makes the browset believe you have seen all videos on the page.',
                            () => this._markAllVisited()),
                    ]),
                    this._uiGen.createTabPanel('Text Based').append([
                        this._configurationManager.createElement(FILTER_TEXT_SEARCH),
                        this._configurationManager.createElement(FILTER_TEXT_BLACKLIST),
                        this._configurationManager.createElement(FILTER_TEXT_WHITELIST),
                        this._configurationManager.createElement(FILTER_TEXT_SANITIZATION),
                    ]),
                    this._uiGen.createTabPanel('Global').append([
                        this._uiGen.createSeparator(),
                        this._configurationManager.createElement(CONFIG_PAGINATOR_THRESHOLD),
                        this._configurationManager.createElement(CONFIG_PAGINATOR_LIMIT),
                        this._configurationManager.createElement(OPTION_ALWAYS_SHOW_SETTINGS_PANE),
                        this._uiGen.createSeparator(),
                        this._createSettingsBackupRestoreFormActions(),
                    ]),
                ]),
                this._createSettingsFormActions(),
                this._uiGen.createSeparator(),
                this._uiGen.createStatisticsFormGroup(FILTER_TEXT_BLACKLIST),
                this._uiGen.createStatisticsFormGroup(FILTER_TEXT_WHITELIST),
                this._uiGen.createStatisticsFormGroup(FILTER_DURATION_RANGE),
                this._uiGen.createStatisticsFormGroup(FILTER_HD_VIDEOS, 'High Definition'),
                this._uiGen.createStatisticsFormGroup(FILTER_TEXT_SEARCH),
                this._uiGen.createStatisticsFormGroup(FILTER_PERCENTAGE_RATING_RANGE),
                this._uiGen.createStatisticsFormGroup(FILTER_DURATION_RANGE, 'Unrated'),
                this._uiGen.createStatisticsFormGroup(FILTER_VIDEOS_VIEWS),
                this._uiGen.createSeparator(),
                this._uiGen.createStatisticsTotalsGroup(),
                this._uiGen.createSeparator(),
                this._uiGen.createStatusSection(),
            ])
        
        this._onAfterUIBuild = () => {
            this._uiGen.getSelectedSection()[0].userScript = this
        }
    }
}

(new XHamsterSearchAndUITweaks).init()