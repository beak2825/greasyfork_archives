// ==UserScript==
// @name         Video Celebs Search And UI Tweaks
// @namespace    brazenvoid
// @version      1.4.1
// @author       brazenvoid
// @license      GPL-3.0-only
// @description  Video filters and UI manipulations
// @match        https://videocelebs.net/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @require      https://greasyfork.org/scripts/375557-base-brazen-resource/code/Base%20Brazen%20Resource.js?version=1115796
// @require      https://greasyfork.org/scripts/416104-brazen-ui-generator/code/Brazen%20UI%20Generator.js?version=1115813
// @require      https://greasyfork.org/scripts/418665-brazen-configuration-manager/code/Brazen%20Configuration%20Manager.js?version=1163542
// @require      https://greasyfork.org/scripts/429587-brazen-item-attributes-resolver/code/Brazen%20Item%20Attributes%20Resolver.js?version=1139392
// @require      https://greasyfork.org/scripts/424499-brazen-paginator/code/Brazen%20Paginator.js?version=1114815
// @require      https://greasyfork.org/scripts/416105-brazen-base-search-enhancer/code/Brazen%20Base%20Search%20Enhancer.js?version=1232928
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/416054/Video%20Celebs%20Search%20And%20UI%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/416054/Video%20Celebs%20Search%20And%20UI%20Tweaks.meta.js
// ==/UserScript==

GM_addStyle(
    `button.show-settings{height:75vh;top:20vh}#settings-wrapper{top:20vh;width:250px}.bg-brand{background-color:#2f74a4}.font-primary{color:white}input.form-input.check-radio-input{width:auto;margin:0 5px 1px 0}label.title{margin: 0}`)

const PAGE_PATH_NAME = window.location.pathname

const IS_VIDEO_PAGE = PAGE_PATH_NAME.endsWith('.html')

const FILTER_VIDEOS_YEAR = 'Year'

const OPTION_MOVE_VIDEO_ATTRIBUTES_SECTION = 'Reposition Attributes Section'
const OPTION_REMOVE_COMMENTS_SECTION = 'Remove Comments Section'
const OPTION_REMOVE_IFRAME_SECTION = 'Remove Iframe Share Section'
const OPTION_REMOVE_RELATED_VIDEOS_SECTION = 'Remove Related Videos Section'

const ITEM_YEAR = 'year'

class VideoCelebsSearchAndUITweaks extends BrazenBaseSearchEnhancer
{
    static getLastPageUrl()
    {
        let lastPaginationElement = $('.wp-pagenavi a:last')
        return lastPaginationElement.length ? lastPaginationElement.attr('href') : window.location.href
    }

    constructor()
    {
        super({
            isUserLoggedIn:           false,
            itemDeepAnalysisSelector: '',
            itemLinkSelector:         '',
            itemListSelectors:        '.midle_div,.list_videos',
            itemNameSelector:         '',
            itemSelectors:            'div.item',
            requestDelay:             0,
            scriptPrefix:             'vc-sui-',
        })

        this._configurationManager
            .addFlagField(OPTION_MOVE_VIDEO_ATTRIBUTES_SECTION, 'Move the video attributes section from below the screenshot area to under the description.')
            .addFlagField(OPTION_REMOVE_COMMENTS_SECTION, 'Remove comments area on video pages.')
            .addFlagField(OPTION_REMOVE_IFRAME_SECTION, 'Remove iframe share section under video player.')
            .addFlagField(OPTION_REMOVE_RELATED_VIDEOS_SECTION, 'Remove related videos section on video pages.')
            .addRangeField(FILTER_VIDEOS_YEAR, 0, new Date().getFullYear(), 'Filter videos by content release year.')

        this._setupPaginator(!IS_VIDEO_PAGE, {
            itemListSelector:                '.midle_div',
            lastPageUrl:                     VideoCelebsSearchAndUITweaks.getLastPageUrl(),
            paginationWrapper:               $('.wp-pagenavi'),
            onGetPageNoFromUrl:              (url) => url.includes('/page/') ? parseInt(url.split('/').pop()) : 1,
            onGetPageUrlFromPageNo:          (newPageNo) => {
                let currentUrl = window.location.href
                if (currentUrl.includes('/page/')) {
                    let currentUrlFragments = currentUrl.split('/')
                    currentUrlFragments.pop()
                    currentUrl = currentUrlFragments.join('/')
                } else {
                    currentUrl += '/page'
                }
                return currentUrl + '/' + newPageNo
            },
            onGetPaginationElementForPageNo: (pageNo, paginator) => {
                let elementSelector = pageNo === paginator.getCurrentPageNo() ?
                    'span.current' : 'a[href="' + paginator.getPageUrlFromPageNo(pageNo).replace(window.location.origin, '') + '"]'
                return paginator.getPaginationWrapper().find(elementSelector)
            },
        })

        this._itemAttributesResolver.addAttribute(ITEM_YEAR, (item) => {
            let yearFragments = item.find('.title a').text().trim().split('(')
            return parseInt(yearFragments[yearFragments.length - 1].replace(')', ''))
        })

        this._setupUI()
        this._setupComplianceFilters()
    }

    /**
     * @private
     */
    _moveVideoAttributesBelowDescription()
    {
        if (this._configurationManager.getValue(OPTION_MOVE_VIDEO_ATTRIBUTES_SECTION)) {
            let videoInfoBlock = $('.entry-utility')
            videoInfoBlock.insertBefore(videoInfoBlock.prev().prev())
        }
    }

    /**
     * @private
     */
    _removeCommentsSection()
    {
        if (this._configurationManager.getValue(OPTION_REMOVE_COMMENTS_SECTION)) {
            $('.comments-area').remove()
        }
    }

    /**
     * @private
     */
    _removeIFrameSection()
    {
        if (this._configurationManager.getValue(OPTION_REMOVE_IFRAME_SECTION)) {
            $('#tab_share').remove()
        }
    }

    /**
     * @private
     */
    _removeRelatedVideosSection()
    {
        if (this._configurationManager.getValue(OPTION_REMOVE_RELATED_VIDEOS_SECTION)) {
            $('.related').remove()
        }
    }

    /**
     * @private
     */
    _setupComplianceFilters()
    {
        this._addItemPercentageRatingRangeFilter('.rating')
        this._addItemComplianceFilter(FILTER_VIDEOS_YEAR, ITEM_YEAR)
    }

    /**
     * @private
     */
    _setupUI()
    {
        this._onBeforeUIBuild = () => {
            if (IS_VIDEO_PAGE) {
                this._moveVideoAttributesBelowDescription()
                this._removeCommentsSection()
                this._removeIFrameSection()
                this._removeRelatedVideosSection()
            }
        }

        this._onUIBuild = () =>
        this._uiGen.createSettingsSection().append([
            this._uiGen.createTabsSection(['Filters', 'UI', 'Pagination', 'Global'], [
                this._uiGen.createTabPanel('Filters', true).append([
                    this._configurationManager.createElement(FILTER_PERCENTAGE_RATING_RANGE),
                    this._configurationManager.createElement(FILTER_VIDEOS_YEAR),
                    this._uiGen.createSeparator(),
                    this._configurationManager.createElement(OPTION_DISABLE_COMPLIANCE_VALIDATION),
                ]),
                this._uiGen.createTabPanel('UI').append([
                    this._configurationManager.createElement(OPTION_MOVE_VIDEO_ATTRIBUTES_SECTION),
                    this._configurationManager.createElement(OPTION_REMOVE_COMMENTS_SECTION),
                    this._configurationManager.createElement(OPTION_REMOVE_IFRAME_SECTION),
                    this._configurationManager.createElement(OPTION_REMOVE_RELATED_VIDEOS_SECTION),
                ]),
                this._uiGen.createTabPanel('Pagination').append([
                    this._configurationManager.createElement(CONFIG_PAGINATOR_THRESHOLD),
                    this._configurationManager.createElement(CONFIG_PAGINATOR_LIMIT),
                ]),
                this._uiGen.createTabPanel('Global').append([
                    this._configurationManager.createElement(OPTION_ALWAYS_SHOW_SETTINGS_PANE),
                    this._uiGen.createSeparator(),
                    this._createSettingsBackupRestoreFormActions(),
                ]),
            ]),
            this._createSettingsFormActions(),
            this._uiGen.createSeparator(),
            this._uiGen.createStatisticsFormGroup(FILTER_PERCENTAGE_RATING_RANGE),
            this._uiGen.createStatisticsFormGroup(FILTER_VIDEOS_YEAR),
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

(new VideoCelebsSearchAndUITweaks).init()