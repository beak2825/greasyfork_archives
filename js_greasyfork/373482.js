// ==UserScript==
// @name         XNXX - Search Filters
// @namespace    brazenvoid
// @version      4.1.6
// @author       brazenvoid
// @license      GPL-3.0-only
// @description  Various search filters
// @match        https://www.xnxx.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://greasyfork.org/scripts/375557-base-resource/code/Base%20Resource.js?version=882642
// @require      https://greasyfork.org/scripts/418665-brazen-configuration-manager/code/Brazen%20Configuration%20Manager.js?version=880818
// @require      https://greasyfork.org/scripts/416104-brazen-ui-generator/code/Brazen%20UI%20Generator.js?version=880816
// @require      https://greasyfork.org/scripts/416105-brazen-base-search-enhancer/code/Brazen%20Base%20Search%20Enhancer.js?version=882641
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/373482/XNXX%20-%20Search%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/373482/XNXX%20-%20Search%20Filters.meta.js
// ==/UserScript==

GM_addStyle(
    `#settings-wrapper{background-color:#ffa31a;top:20vh;width:270px}#settings-wrapper input::selection{background-color: black;color: white}.form-group{margin-bottom:0}label{margin-bottom:0}input.form-input,select.form-input,textarea.form-input{background-color:white;font-size:inherit}`)

const PAGE_PATH_NAME = window.location.pathname

const IS_HOME_PAGE = PAGE_PATH_NAME === '/'
const IS_VIDEO_PAGE = PAGE_PATH_NAME.startsWith('/video-')

const ITEM_CLASSES = 'thumb-block:not(.thumb-cat)'

const FILTER_VIDEO_RESOLUTION = 'Minimum Resolution'
const FILTER_VIDEOS_RATING = 'Rating'
const FILTER_VIDEOS_DURATION = 'Duration'
const FILTER_VIDEOS_VIEWS = 'Views'

const VIDEO_DURATION_KEY = 'XNSSSFDuration'
const VIDEO_NAME_KEY = 'XNSSSFName'
const VIDEO_RATING_KEY = 'XNSSSFRating'
const VIDEO_RESOLUTION_KEY = 'XNSSSFResolution'
const VIDEO_VIEWS_KEY = 'XNSSSFViews'

class XNXXSearchFilters extends BrazenBaseSearchEnhancer
{
    constructor ()
    {
        super('xnxx-sf-', ITEM_CLASSES)

        this._configurationManager.
            addRadiosGroup(FILTER_VIDEO_RESOLUTION, [['Show All', 0], ['SD 360p', 360], ['SD 480p', 480], ['HD 720p', 720], ['HD 1080p', 1080]], 'Filter videos by minimum resolution.').
            addRangeField(FILTER_VIDEOS_DURATION, 0, 100000, 'Filter videos by duration.').
            addRangeField(FILTER_VIDEOS_RATING, 0, 100, 'Filter videos by ratings.').
            addRangeField(FILTER_VIDEOS_VIEWS, 0, 10000000, 'Filter videos by view count.').
            addRulesetField(FILTER_TEXT_BLACKLIST, 'Hide videos with specified phrases in their names. Separate the phrases with line breaks.').
            addRulesetField(FILTER_TEXT_SANITIZATION,
                'Censor video names by substituting offensive phrases. Each rule in separate line with comma separated target phrases. Example Rule: boyfriend=stepson,stepdad').
            addRulesetField(FILTER_TEXT_WHITELIST, 'Show videos with specified phrases in their names. Separate the phrases with line breaks.')

        // UI Events

        this._onBeforeUIBuild = () => {
            if (IS_VIDEO_PAGE) {
                this._validator.sanitizeNodeOfSelector('.clear-infobar > strong:nth-child(1)', this._configurationManager.getField(FILTER_TEXT_SANITIZATION).optimized)
            }
        }

        this._onUIBuild = () =>
            this._uiGen.createSettingsSection().append([
                this._uiGen.createTabsSection(['Filters', 'Text', 'Global', 'Stats'], [
                    this._uiGen.createTabPanel('Filters', true).append([
                        this._configurationManager.createElement(FILTER_VIDEOS_DURATION),
                        this._configurationManager.createElement(FILTER_VIDEOS_RATING),
                        this._configurationManager.createElement(FILTER_VIDEOS_VIEWS),
                        this._uiGen.createSeparator(),
                        this._configurationManager.createElement(FILTER_VIDEO_RESOLUTION),
                        this._uiGen.createSeparator(),
                        this._configurationManager.createElement(OPTION_DISABLE_COMPLIANCE_VALIDATION),
                    ]),
                    this._uiGen.createTabPanel('Text').append([
                        this._configurationManager.createElement(FILTER_TEXT_SEARCH),
                        this._configurationManager.createElement(FILTER_TEXT_BLACKLIST),
                        this._configurationManager.createElement(FILTER_TEXT_WHITELIST),
                    ]),
                    this._uiGen.createTabPanel('Global').append([
                        this._configurationManager.createElement(FILTER_TEXT_SANITIZATION),
                        this._uiGen.createSeparator(),
//                        this._configurationManager.createElement(CONFIG_PAGINATOR_THRESHOLD),
//                        this._configurationManager.createElement(CONFIG_PAGINATOR_LIMIT),
                        this._configurationManager.createElement(OPTION_ALWAYS_SHOW_SETTINGS_PANE),
                    ]),
                    this._uiGen.createTabPanel('Stats').append([
                        this._uiGen.createStatisticsFormGroup(FILTER_TEXT_BLACKLIST),
                        this._uiGen.createStatisticsFormGroup(FILTER_VIDEOS_DURATION),
                        this._uiGen.createStatisticsFormGroup(FILTER_VIDEO_RESOLUTION),
                        this._uiGen.createStatisticsFormGroup(FILTER_VIDEOS_RATING),
                        this._uiGen.createStatisticsFormGroup(FILTER_TEXT_SEARCH),
                        this._uiGen.createStatisticsFormGroup(FILTER_VIDEOS_VIEWS),
                        this._uiGen.createSeparator(),
                        this._uiGen.createStatisticsTotalsGroup(),
                    ]),
                ]),
                this._createSettingsFormActions(),
                this._uiGen.createSeparator(),
                this._uiGen.createStatusSection(),
            ])

        this._onAfterUIBuild = () => {
            this._uiGen.getSelectedSection()[0].userScript = this
        }

        // Compliance Events

        this._onGetItemLists = () => $('.mozaique')

        this._onGetItemName = (videoItem) => videoItem[0][VIDEO_NAME_KEY]

        this._onFirstHitBeforeCompliance = (item) => this._analyzeVideoItem(item)

        this._complianceFilters = [
            (videoItem) => this._validateSearch(videoItem),
            (videoItem) => this._validateRating(videoItem),
            (videoItem) => this._validateDuration(videoItem),
            (videoItem) => this._validateViews(videoItem),
            (videoItem) => this._validateResolution(videoItem),
            (videoItem) => this._validateItemBlacklist(videoItem),
        ]

        this._onFirstHitAfterCompliance =
            (item) => this._validator.sanitizeTextNode(item.find('.thumb-under a:first'), this._configurationManager.getField(FILTER_TEXT_SANITIZATION).optimized)
    }

    /**
     * @param {JQuery} videoItem
     * @private
     */
    _analyzeVideoItem (videoItem)
    {
        let videoMetadataElements = videoItem.find('.metadata'), metadata
        let videoItemElement = videoItem[0]

        if (videoMetadataElements) {
            if (IS_VIDEO_PAGE) {
                metadata = videoMetadataElements.text().split(' ')
                videoItemElement[VIDEO_DURATION_KEY] = this._analyzeVideItemDuration(metadata[1])
                videoItemElement[VIDEO_RATING_KEY] = 100
                videoItemElement[VIDEO_RESOLUTION_KEY] = parseInt(metadata[5].replace('p', ''))
                videoItemElement[VIDEO_VIEWS_KEY] = metadata[0]
            } else {
                metadata = videoMetadataElements.text().split('\n')
                if (metadata.length > 3) {
                    metadata[1] = metadata[1].split(' ')
                    videoItemElement[VIDEO_DURATION_KEY] = this._analyzeVideItemDuration(metadata[2])
                    videoItemElement[VIDEO_RATING_KEY] = metadata[1][1].replace('%', '')
                    videoItemElement[VIDEO_RESOLUTION_KEY] = parseInt(metadata[3].replace(' -  ', '').replace('p', ''))
                    videoItemElement[VIDEO_VIEWS_KEY] = metadata[1][0]
                } else {
                    videoItemElement[VIDEO_DURATION_KEY] = this._analyzeVideItemDuration(metadata[1])
                    videoItemElement[VIDEO_RATING_KEY] = 100
                    videoItemElement[VIDEO_RESOLUTION_KEY] = parseInt(metadata[2].replace(' -  ', '').replace('p', ''))
                    videoItemElement[VIDEO_VIEWS_KEY] = 0
                }
            }
            videoItemElement[VIDEO_NAME_KEY] = videoItem.find('.thumb-under > p:nth-child(1) > a:nth-child(1)')
        }
    }

    /**
     * @param {string} durationString
     * @return {number}
     * @private
     */
    _analyzeVideItemDuration (durationString)
    {
        let duration = 0, splitArray

        if (IS_VIDEO_PAGE) {
            splitArray = durationString.split(' ')
            for (let i = 0; i < splitArray.length; i++) {
                if (splitArray[i].endsWith('min')) {
                    duration += 60 * splitArray[i].replace('min', '')
                } else {
                    if (splitArray[i].endsWith('sec')) {
                        duration += splitArray[i].replace('sec', '')
                    }
                }
            }
        } else {
            splitArray = durationString.split('min')
            if (splitArray.length === 2) {
                duration = 60 * splitArray[0]
            } else {
                splitArray = durationString.split('sec')
                if (splitArray.length === 2) {
                    duration = splitArray[0]
                }
            }
        }
        return duration
    }

    /**
     * Validates video duration
     * @param {JQuery} videoItem
     * @return {boolean}
     * @private
     */
    _validateDuration (videoItem)
    {
        let range = this._configurationManager.getValue(FILTER_VIDEOS_DURATION)
        if (range.minimum > 0 || range.maximum > 0) {
            return this._validator.validateRange(FILTER_VIDEOS_DURATION, videoItem[0][VIDEO_DURATION_KEY], [range.minimum, range.maximum])
        }
        return true
    }

    /**
     * Validate video rating
     * @param {JQuery} videoItem
     * @return {boolean}
     * @private
     */
    _validateRating (videoItem)
    {
        let range = this._configurationManager.getValue(FILTER_VIDEOS_RATING)
        if (range.minimum > 0 || range.maximum > 0) {
            return this._validator.validateRange(FILTER_VIDEOS_RATING, videoItem[0][VIDEO_RATING_KEY], [range.minimum, range.maximum])
        }
        return true
    }

    /**
     * Validate video quality
     * @param {JQuery} videoItem
     * @return {boolean}
     * @private
     */
    _validateResolution (videoItem)
    {
        let validationCheck = true

        let resolution = this._configurationManager.getValue(FILTER_VIDEO_RESOLUTION)
        if (resolution > 0) {
            validationCheck = videoItem[0][VIDEO_RESOLUTION_KEY] >= parseInt(resolution)
            this._statistics.record(FILTER_VIDEO_RESOLUTION, validationCheck)
        }
        return validationCheck
    }

    /**
     * Validates existence of searched words in the video name
     * @param {JQuery} videoItem
     * @return {boolean}
     * @private
     */
    _validateSearch (videoItem)
    {
        let search = this._configurationManager.getValue(FILTER_TEXT_SEARCH)
        return search !== '' ? this._statisticsRecorder.record(FILTER_TEXT_SEARCH, videoItem[0][VIDEO_NAME_KEY].includes(search)) : true
    }

    /**
     * Validate video view count
     * @param {JQuery} videoItem
     * @return {boolean}
     * @private
     */
    _validateViews (videoItem)
    {
        let range = this._configurationManager.getValue(FILTER_VIDEOS_VIEWS)
        if (range.minimum > 0 || range.maximum > 0) {
            return this._validator.validateRange(FILTER_VIDEOS_VIEWS, videoItem[0][VIDEO_VIEWS_KEY], [range.minimum, range.maximum])
        }
        return true
    }

    /**
     * Validates non-existence of blacklisted words in the video name
     * @param {JQuery} videoItem
     * @return {boolean}
     * @private
     */
    _validateWhitelist (videoItem)
    {
        let regex = this._configurationManager.getField(FILTER_TEXT_WHITELIST).optimized
        return regex ? this._validator.validateTextContains(videoItem[0][VIDEO_NAME_KEY], regex, FILTER_TEXT_WHITELIST) : true
    }
}

(new XNXXSearchFilters).init()
