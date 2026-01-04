// ==UserScript==
// @name         Brazen Base Search Enhancer
// @namespace    brazenvoid
// @version      7.0.1
// @author       brazenvoid
// @license      GPL-3.0-only
// @description  Base class for search enhancement scripts
// ==/UserScript==

const ICON_RECYCLE = '&#x267B'

// Identification Classes

const CLASS_COMPLIANT_ITEM = 'brazen-compliant-item'
const CLASS_NON_COMPLIANT_ITEM = 'brazen-noncompliant-item'

// Preset filter configuration keys

const CONFIG_PAGINATOR_LIMIT = 'Pagination Limit'
const CONFIG_PAGINATOR_THRESHOLD = 'Pagination Threshold'

const FILTER_DURATION_RANGE = 'Duration'
const FILTER_PERCENTAGE_RATING_RANGE = 'Rating'
const FILTER_SUBSCRIBED_VIDEOS = 'Hide Subscribed Videos'
const FILTER_TAG_BLACKLIST = 'Tag Blacklist'
const FILTER_TEXT_BLACKLIST = 'Blacklist'
const FILTER_TEXT_SEARCH = 'Search'
const FILTER_TEXT_SANITIZATION = 'Text Sanitization Rules'
const FILTER_TEXT_WHITELIST = 'Whitelist'
const FILTER_UNRATED = 'Unrated'

const STORE_SUBSCRIPTIONS = 'Account Subscriptions'

// Item preset attributes

const ITEM_NAME = 'name'
const ITEM_PROCESSED_ONCE = 'processedOnce'

// Configuration

const OPTION_ENABLE_TEXT_BLACKLIST = 'Enable Text Blacklist'
const OPTION_ENABLE_TAG_BLACKLIST = 'Enable Tag Blacklist'
const OPTION_ALWAYS_SHOW_SETTINGS_PANE = 'Always Show Settings Pane'
const OPTION_DISABLE_COMPLIANCE_VALIDATION = 'Disable All Filters'

class BrazenBaseSearchEnhancer
{
  /**
   * @typedef {{configKey: string, validate: SearchEnhancerFilterValidationCallback, comply: SearchEnhancerFilterComplianceCallback}} ComplianceFilter
   */

  /**
   * @typedef {{doItemCompliance?: Function, downloadsDelay?: int, isUserLoggedIn?: boolean, itemDeepAnalysisSelector?: JQuery.Selector,
   *            itemListSelectors: JQuery.Selector, itemLinkSelector?: JQuery.Selector, itemNameSelector: JQuery.Selector, itemSelectors: JQuery.Selector,
   *            itemSelectionMethod?: string, itemWrapperResolver?: SearchEnhancerItemWrapperResolver|null,
   *            requestDelay?: number, scriptPrefix: string, tagSelectorGenerator?: SearchEnhancerTagSelectorGeneratorCallback|null}} Configuration
   */

  /**
   * @typedef {{configKey: string, otherTagSectionsSelector?: JQuery, styleClass: string, rows?: int, helpText: string, removeClasses?: string,
   *            formatter?: Function}} ItemTagHighlightsConfiguration
   */

  /**
   * @callback SearchEnhancerFilterValidationCallback
   * @param {*} configValues
   * @return boolean
   */

  /**
   * @callback SearchEnhancerFilterComplianceCallback
   * @param {JQuery} item
   * @param {*} configValues
   * @return {*}
   */

  /**
   * @callback SubscriptionsFilterExclusionsCallback
   * @return {boolean}
   */

  /**
   * @callback SubscriptionsFilterUsernameCallback
   * @param {JQuery} item
   * @return {boolean|string}
   */

  /**
   * @callback SearchEnhancerItemWorkerCallback
   * @param {JQuery} item
   */

  /**
   * @callback SearchEnhancerItemWrapperResolver
   * @param {JQuery} item
   * @return {JQuery}
   */

  /**
   * @callback SearchEnhancerTagsExtractionCallback
   * @param {JQuery} item
   * @return {string[]}
   */

  /**
   * @callback SearchEnhancerTagSelectorGeneratorCallback
   * @param {string} tag
   * @return {string}
   */

  /**
   * @type {Configuration}
   * @protected
   */
  _config

  /**
   * Array of item compliance filters
   * @type {ComplianceFilter[]}
   * @private
   */
  _complianceFilters = []

  /**
   * Local storage store with defaults
   * @type {BrazenConfigurationManager}
   * @protected
   */
  _configurationManager

  /**
   * @type {boolean}
   * @protected
   */
  _disableUI = false

  /**
   * @type {boolean}
   * @private
   */
  _downloadsProcessing = false

  /**
   * @type {Promise<{name: string|null, url: string}>[]}
   * @private
   */
  _downloadsQueue = []

  /**
   * @type {string}
   * @private
   */
  _highlightClasses = ''

  /**
   * @type {BrazenItemAttributesResolver}
   * @protected
   */
  _itemAttributesResolver

  /**
   * Operations to perform after script initialization
   * @type {function[]}
   * @protected
   */
  _onAfterInitialization = []

  /**
   * Operations to perform after a complete compliance run
   * @type {function[]}
   * @protected
   */
  _onAfterComplianceRun = []

  /**
   * Operations to perform after UI generation
   * @type {function[]}
   * @protected
   */
  _onAfterUIBuild = []

  /**
   * Operations to perform before compliance validation.
   * @type {function[]}
   * @protected
   */
  _onBeforeCompliance = []

  /**
   * Operations to perform before UI generation
   * @type {function[]}
   * @protected
   */
  _onBeforeUIBuild = []

  /**
   * Operations to perform after compliance rule checks, the first time a search item is retrieved
   * @type {function(JQuery)[]}
   * @protected
   */
  _onFirstHitAfterCompliance = []

  /**
   * Operations to perform before compliance checks, the first time a search item is retrieved
   * @type {function(JQuery)[]}
   * @protected
   */
  _onFirstHitBeforeCompliance = []

  /**
   * Logic to hide a non-compliant item
   * @type {SearchEnhancerItemWorkerCallback}
   * @param {JQuery} item
   * @protected
   */
  _onItemHide = null

  /**
   * Logic to show the compliant search item
   * @type {Function[]}
   * @param {JQuery} item
   * @protected
   */
  _onItemShow = []

  /**
   * Validate initiating initialization.
   * Can be used to stop script initialization on specific pages or vice versa
   * @type {Function}
   * @protected
   */
  _onValidateInit = () => true

  /**
   * Pagination manager
   * @type BrazenPaginator|null
   * @protected
   */
  _paginator = null

  /**
   * @type {boolean}
   * @private
   */
  _sanitizationEnabled = false

  /**
   * @type {StatisticsRecorder}
   * @protected
   */
  _statistics

  /**
   * @type {BrazenSubscriptionsLoader|null}
   * @protected
   */
  _subscriptionsLoader = null

  /**
   * @type {JQuery}
   * @private
   */
  _subscriptionsLoaderButton = null

  /**
   * @type {BrazenUIGenerator}
   * @protected
   */
  _uiGen

  /**
   * Must return the generated settings section node
   * @type {JQuery[]}
   * @protected
   */
  _userInterface = []

  /**
   * @param {Configuration} configuration
   */
  constructor(configuration)
  {
    this._config = configuration
    if (configuration.isUserLoggedIn === undefined) {
      this._config.isUserLoggedIn = false
    }
    if (configuration.itemSelectionMethod === undefined) {
      this._config.itemSelectionMethod = 'find'
    }
    if (configuration.itemWrapperResolver === undefined) {
      this._config.itemWrapperResolver = (item) => item
    }

    this._itemAttributesResolver = new BrazenItemAttributesResolver({
      itemDeepAnalysisSelector: this._config.itemDeepAnalysisSelector ?? '',
      itemLinkSelector: this._config.itemLinkSelector ?? '',
      requestDelay: this._config.requestDelay ?? 0,
      onDeepAttributesResolution: (item) => {
        this._complyItem(item)
        Utilities.processEventHandlerQueue(this._onAfterComplianceRun)
      },
    })

    this._statistics = new StatisticsRecorder(this._config.scriptPrefix)

    this._uiGen = new BrazenUIGenerator(this._config.scriptPrefix)

    this._configurationManager = new BrazenConfigurationManager(this._config.scriptPrefix, this._uiGen, this._config.tagSelectorGenerator).
        onExternalConfigurationChange(() => this._validateCompliance()).
        addFlagField(OPTION_DISABLE_COMPLIANCE_VALIDATION, 'Disables all search filters.').
        addFlagField(OPTION_ALWAYS_SHOW_SETTINGS_PANE, 'Always show configuration interface.')

    this._onItemHide = (item) => this._config.itemWrapperResolver(item).addClass(CLASS_NON_COMPLIANT_ITEM).removeClass(CLASS_COMPLIANT_ITEM).hide()

    this._onItemShow.push((item) => this._config.itemWrapperResolver(item).addClass(CLASS_COMPLIANT_ITEM).removeClass(CLASS_NON_COMPLIANT_ITEM).show())
  }

  /**
   * @param {HTMLImageElement|HTMLVideoElement} mediaElement
   * @param {string} folder
   * @param {string} name
   * @param {boolean} removeMediaOnSuccess
   * @protected
   */
  _addDownload(mediaElement, folder, name, removeMediaOnSuccess = false)
  {
    let task = this._wrapDownloadTask({
      name: this._removeIllegalCharactersFromPath(folder) + '/' + this._removeIllegalCharactersFromPath(name),
      element: removeMediaOnSuccess ? $(mediaElement) : null,
      url: mediaElement.src,
    })

    if (mediaElement instanceof HTMLImageElement && !mediaElement.complete) {
      mediaElement.addEventListener('load', () => this._downloadsQueue.push(task))
    } else {
      this._downloadsQueue.push(task)
    }
    // noinspection JSIgnoredPromiseFromCall
    this._startProcessingDownloadQueue()
  }

  /**
   * @param {string} helpText
   * @param rows
   * @protected
   */
  _addItemBlacklistFilter(helpText, rows = 5)
  {
    this._configurationManager.addFlagField(OPTION_ENABLE_TEXT_BLACKLIST, 'Applies the blacklist.').addRulesetField(
        FILTER_TEXT_BLACKLIST,
        rows,
        helpText,
        null,
        null,
        (rules) => Utilities.buildWholeWordMatchingRegex(rules) ?? '', 
        true
    )
    this._addItemComplexComplianceFilter(
        FILTER_TEXT_BLACKLIST,
        (rules) => this._getConfig(OPTION_ENABLE_TEXT_BLACKLIST) && rules !== '',
        (item, value) => this._get(item, ITEM_NAME)?.match(value) === null,
    )
  }

  /**
   * @param {string} configKey
   * @param {SearchEnhancerFilterValidationCallback|null} validationCallback
   * @param {SearchEnhancerFilterComplianceCallback|null|string} complianceCallback
   * @protected
   */
  _addItemComplexComplianceFilter(configKey, validationCallback, complianceCallback)
  {
    this._addItemComplianceFilter(configKey, complianceCallback, validationCallback)
  }

  /**
   * @param {string} configKey
   * @param {SearchEnhancerFilterComplianceCallback|null|string} action
   * @param {SearchEnhancerFilterValidationCallback|null} validationCallback
   * @protected
   */
  _addItemComplianceFilter(configKey, action = null, validationCallback = null)
  {
    let configType = this._configurationManager.getField(configKey).type
    if (action === null) {
      action = configKey
    }
    if (typeof action === 'string') {
      let attributeName = action
      switch (configType) {
        case CONFIG_TYPE_CHECKBOXES_GROUP:
          action = (item, values) => {
            let attribute = this._get(item, attributeName)
            return attribute && values.length ? values.includes(attribute) : true
          }
          break
        case CONFIG_TYPE_FLAG:
          action = (item) => {
            let attribute = this._get(item, attributeName)
            return attribute === null ? true : attribute
          }
          break
        case CONFIG_TYPE_RADIOS_GROUP:
          action = (item, value) => {
            let attribute = this._get(item, attributeName)
            return attribute ? value === attribute : true
          }
          break
        case CONFIG_TYPE_RANGE:
          action = (item, range) => {
            let attribute = this._get(item, attributeName)
            return attribute ? Validator.isInRange(this._get(item, attributeName), range.minimum, range.maximum) : true
          }
          break
        default:
          throw new Error('Associated config type requires explicit action callback definition.')
      }
    }
    if (validationCallback === null) {
      validationCallback = this._configurationManager.generateValidationCallback(configKey)
    }
    this._complianceFilters.push({
      configKey: configKey,
      validate: validationCallback,
      comply: action,
    })
  }

  /**
   * @param {JQuery.Selector|Function} durationNodeSelector
   * @param {string|null} helpText
   * @param {string} separator
   * @protected
   */
  _addItemDurationRangeFilter(durationNodeSelector, helpText = null, separator = ':')
  {
    this._configurationManager.addRangeField(FILTER_DURATION_RANGE, 0, 100000, helpText ?? 'Filter items by duration.')

    this._itemAttributesResolver.addAttribute(FILTER_DURATION_RANGE, (item) => {
      let duration
      if (typeof durationNodeSelector === 'function') {
        duration = durationNodeSelector(item)
      } else {
        let durationNode = item.find(durationNodeSelector)
        if (durationNode.length) {
          duration = durationNode.text().trim()
        } else {
          return null
        }
      }
      duration = duration.split(separator)
      duration = (Number.parseInt(duration[0]) * 60) + Number.parseInt(duration[1])
      return duration === 0 ? null : duration
    })

    this._addItemComplianceFilter(FILTER_DURATION_RANGE)
  }

  /**
   * @param {JQuery.Selector} ratingNodeSelector
   * @param {string|null} helpText
   * @param {string|null} unratedHelpText
   * @protected
   */
  _addItemPercentageRatingRangeFilter(ratingNodeSelector, helpText = null, unratedHelpText = null)
  {
    this._configurationManager.addRangeField(FILTER_PERCENTAGE_RATING_RANGE, 0, 100000,
        helpText ?? 'Filter items by percentage rating.').addFlagField(
        FILTER_UNRATED, unratedHelpText ?? 'Hide items with zero or no rating.')

    this._itemAttributesResolver.addAttribute(FILTER_PERCENTAGE_RATING_RANGE, (item) => {
      let rating = item.find(ratingNodeSelector)
      return rating.length === 0 ? null : Number.parseInt(rating.text().trim().replace('%', ''))
    })

    this._addItemComplianceFilter(FILTER_PERCENTAGE_RATING_RANGE, (item, range) => {
      let rating = this._get(item, FILTER_PERCENTAGE_RATING_RANGE)
      return rating ? Validator.isInRange(rating, range.minimum, range.maximum) : !this._getConfig(FILTER_UNRATED)
    })
  }

  /**
   * @param {string} key
   * @param {boolean} deepAttribute
   * @param {boolean} saveSelectors
   * @param {SearchEnhancerTagsExtractionCallback} extractTags
   * @protected
   */
  _addItemTagAttribute(key, deepAttribute, saveSelectors, extractTags)
  {
    let tagsToSelectorsMapper = (item) => {
      if (saveSelectors) {
        let tagSelectors = ''
        for (let tag of extractTags(item)) {
          tagSelectors += this._config.tagSelectorGenerator(tag)
        }
        return tagSelectors
      }
      let tags = []
      for (let tag of extractTags(item)) {
        tags.push(tag)
      }
      return tags
    }
    if (deepAttribute) {
      this._itemAttributesResolver.addDeepAttribute(key, tagsToSelectorsMapper)
    } else {
      this._itemAttributesResolver.addAttribute(key, tagsToSelectorsMapper)
    }
  }

  /**
   * @param {string|null} attribute
   * @param {boolean} useSelectors
   * @param {int} rows
   * @param {string|null} helpText
   * @param {string|null} key
   * @param {string|null} optionKey
   * @protected
   */
  _addItemTagBlacklistFilter(attribute, useSelectors, rows = 5, helpText = null, key = null, optionKey = null)
  {
    if (helpText === null) {
      helpText = 'Specify the tags blacklist with one rule on each line. <br> Conditional operators; "&" "|" can be used to make complex rules.'
    }

    if (key === null) {
      key = FILTER_TAG_BLACKLIST
    }
    if (optionKey === null) {
      optionKey = OPTION_ENABLE_TAG_BLACKLIST
    }

    this._configurationManager.
        addFlagField(optionKey, 'Applies the blacklist.').
        addTagRulesetField(key, useSelectors, rows, helpText, null, true)

    this._addItemComplexComplianceFilter(
        key,
        (rules) => this._getConfig(optionKey) && rules.length,
        (item, blacklistRuleset) => this._handleComplianceForBlacklistFilter(item, attribute, blacklistRuleset),
    )
  }

  /**
   * @param {ItemTagHighlightsConfiguration} config
   * @protected
   */
  _addItemTagHighlights(config)
  {
    this.registerHighlightStyleClass(config.styleClass)

    this._configurationManager.addTagRulesetField(
        config.configKey, true, config.rows ?? 5, config.helpText ?? '', config.formatter ?? null, true)

    let highlightsHandler = (section) => {

      let optimizedRuleset = this._configurationManager.getField(config.configKey).optimized
      if (optimizedRuleset) {

        let ruleApplies, subjectTags
        for (let rule of optimizedRuleset) {

          ruleApplies = true
          subjectTags = section.find(rule.join(', '))

          for (let tagSelector of rule) {

            if (section.find(tagSelector).length === 0) {
              ruleApplies = false
              break
            }
          }
          if (ruleApplies) {
            subjectTags.addClass(config.styleClass)
            if (config.removeClasses !== undefined) {
              subjectTags.removeClass(config.removeClasses)
            }
          } else {
            subjectTags.removeClass(config.styleClass)
          }
        }
      }
    }
    if (config.otherTagSectionsSelector && config.otherTagSectionsSelector.length > 0) {
      this._onBeforeUIBuild.push(() => highlightsHandler(config.otherTagSectionsSelector))
    }
    this._onItemShow.push((item) => highlightsHandler(item))
  }

  /**
   * @param {string} helpText
   * @protected
   */
  _addItemTextSanitizationFilter(helpText)
  {
    this._sanitizationEnabled = true

    this._configurationManager.addRulesetField(FILTER_TEXT_SANITIZATION, 2, helpText, (rules) => {
      let sanitizationRules = {}, fragments, validatedTargetWords
      for (let sanitizationRule of rules) {

        if (sanitizationRule.includes('=')) {
          fragments = sanitizationRule.split('=')
          if (fragments[0] === '') {
            fragments[0] = ' '
          }

          validatedTargetWords = Utilities.trimAndKeepNonEmptyStrings(fragments[1].split(','))
          if (validatedTargetWords.length) {
            sanitizationRules[fragments[0]] = validatedTargetWords
          }
        }
      }
      return sanitizationRules
    }, (rules) => {
      let sanitizationRulesText = []
      for (let substitute in rules) {
        sanitizationRulesText.push(substitute + '=' + rules[substitute].join(','))
      }
      return sanitizationRulesText

    }, (rules) => {
      let optimizedRules = {}
      for (const substitute in rules) {
        optimizedRules[substitute] = Utilities.buildWholeWordMatchingRegex(rules[substitute])
      }
      return optimizedRules
    }, true)
  }

  /**
   * @param {string|null} helpText
   * @protected
   */
  _addItemTextSearchFilter(helpText = null)
  {
    this._configurationManager.addTextField(FILTER_TEXT_SEARCH,
        helpText ?? 'Show videos with these comma separated words in their names.')
    this._addItemComplianceFilter(FILTER_TEXT_SEARCH, (item, value) => this._get(item, ITEM_NAME).includes(value))
  }

  /**
   * @param {string} helpText
   * @protected
   */
  _addItemWhitelistFilter(helpText)
  {
    this._configurationManager.addRulesetField(
        FILTER_TEXT_WHITELIST, 
        5, 
        helpText,
        null, 
        null, 
        (rules) => Utilities.buildWholeWordMatchingRegex(rules), 
        true)
  }

  /**
   * @param {SubscriptionsFilterExclusionsCallback} exclusionsCallback Add page exclusions here
   * @param {SubscriptionsFilterUsernameCallback} getItemUsername Return username of the item or return false to skip
   * @protected
   */
  _addSubscriptionsFilter(exclusionsCallback, getItemUsername)
  {
    this._configurationManager.addFlagField(FILTER_SUBSCRIBED_VIDEOS, 'Hide videos from subscribed channels.').
        addTextField(STORE_SUBSCRIPTIONS, 'Recorded subscription accounts.')

    this._addItemComplexComplianceFilter(
        FILTER_SUBSCRIBED_VIDEOS,
        (value) => value && this._config.isUserLoggedIn && exclusionsCallback(),
        (item) => {
          let username = getItemUsername(item)
          if (username === false) {
            return true
          }
          return !(new RegExp('"([^"]*' + username + '[^"]*)"')).test(this._getConfig(STORE_SUBSCRIPTIONS))
        })
  }

  /**
   * @param {JQuery} item
   * @protected
   */
  _complyItem(item)
  {
    let itemComplies = true
    let doItemCompliance = true

    if (this._config.doItemCompliance) {
      doItemCompliance = Utilities.callEventHandler(this._config.doItemCompliance)
    }

    if (doItemCompliance && !this._getConfig(OPTION_DISABLE_COMPLIANCE_VALIDATION) && this._validateItemWhiteList(item)) {

      let configField
      Utilities.processEventHandlerQueue(this._onBeforeCompliance, [item])

      for (let complianceFilter of this._complianceFilters) {

        configField = this._configurationManager.getFieldOrFail(complianceFilter.configKey)
        if (complianceFilter.validate(configField.optimized ?? configField.value)) {
          itemComplies = complianceFilter.comply(item, configField.optimized ?? configField.value)
          this._statistics.record(complianceFilter.configKey, itemComplies)
          if (!itemComplies) {
            break
          }
        }
      }
    }
    if (itemComplies) {
      Utilities.processEventHandlerQueue(this._onItemShow, [item])
    } else {
      Utilities.callEventHandler(this._onItemHide, [item])
    }
    item.css('opacity', 'unset')
  }

  /**
   * Filters items as per settings
   * @param {JQuery} itemsList
   * @param {boolean} fromObserver
   * @protected
   */
  _complyItemsList(itemsList, fromObserver = false)
  {
    let items
    if (fromObserver) {
      items = itemsList.filter(this._config.itemSelectors).add(itemsList.find(this._config.itemSelectors))
    } else if (this._config.itemSelectionMethod === 'find') {
      items = itemsList.find(this._config.itemSelectors)
    } else {
      items = itemsList.children(this._config.itemSelectors)
    }
    items.css('opacity', 0.75).each((index, element) => {

      let item = $(element)

      // First run processing

      if (this._get(item, ITEM_PROCESSED_ONCE) === null) {
        if (this._sanitizationEnabled) {
          Validator.sanitizeTextNode(
              item.find(this._config.itemNameSelector),
              this._configurationManager.getFieldOrFail(FILTER_TEXT_SANITIZATION).optimized)
        }
        this._itemAttributesResolver.resolveAttributes(item)
        Utilities.processEventHandlerQueue(this._onFirstHitBeforeCompliance, [item])
      }

      // Compliance filtering

      this._complyItem(item)

      // Processing of search items on later runs

      if (!this._get(item, ITEM_PROCESSED_ONCE)) {
        Utilities.processEventHandlerQueue(this._onFirstHitAfterCompliance, [item])
        this._itemAttributesResolver.set(item, ITEM_PROCESSED_ONCE, true)
      }
    })

    this._statistics.updateUI()

    Utilities.processEventHandlerQueue(this._onAfterComplianceRun)
  }

  /**
   * @protected
   * @return {JQuery[]}
   */
  _createPaginationControls()
  {
    return [
      this._configurationManager.createElement(CONFIG_PAGINATOR_THRESHOLD),
      this._configurationManager.createElement(CONFIG_PAGINATOR_LIMIT)]
  }

  /**
   * @protected
   * @return {JQuery}
   */
  _createSettingsBackupRestoreFormActions()
  {
    return this._uiGen.createFormActions([
      this._uiGen.createFormButton('Backup Configuration', 'Download configuration file.', () => this._onBackupSettings()),
      this._uiGen.createSeparator(),
      this._uiGen.createFormGroupInput('file').attr('id', 'restore-settings').attr('placeholder', 'Browse for settings file...'),
      this._uiGen.createFormButton('Restore Configuration', 'Restore configuration from the selected file.', () => this._onRestoreSettings()),
    ], 'bv-flex-column')
  }

  /**
   * @protected
   * @return {JQuery}
   */
  _createSettingsFormActions()
  {
    return this._uiGen.createFormActions([
      this._uiGen.createFormButton('Apply', 'Apply settings.', () => this._onApplyNewSettings()),
      this._uiGen.createFormButton('Save', 'Apply and update saved configuration.', () => this._onSaveSettings()),
      this._uiGen.createFormButton('Reset', 'Revert to saved configuration.', () => this._onResetSettings()),
    ])
  }

  /**
   * @protected
   * @return {JQuery}
   */
  _createSubscriptionLoaderControls()
  {
    return this._subscriptionsLoaderButton
  }

  /**
   * @param {JQuery} UISection
   * @private
   */
  _embedUI(UISection)
  {
    UISection.on('mouseleave', (event) => {
      if (!this._uiGen.isSettingsPaneBeingResized() && !this._getConfig(OPTION_ALWAYS_SHOW_SETTINGS_PANE)) {
        $(event.currentTarget).slideUp(300)
      }
    })
    if (this._getConfig(OPTION_ALWAYS_SHOW_SETTINGS_PANE)) {
      UISection.show()
    }
    this._uiGen.constructor.appendToBody(UISection)
    this._uiGen.constructor.appendToBody(this._uiGen.createSettingsShowButton('', UISection))
  }

  /**
   * @param {JQuery} item
   * @param {string} attributeName
   * @returns {*}
   * @protected
   */
  _get(item, attributeName)
  {
    return this._itemAttributesResolver.get(item, attributeName)
  }

  /**
   * @param {string} config
   * @returns {*}
   * @protected
   */
  _getConfig(config)
  {
    return this._configurationManager.getValue(config)
  }

  _handleComplianceForBlacklistFilter(item, attribute, blacklistRuleset)
  {
    let isBlacklisted
    let itemTags = this._get(item, attribute)

    if (itemTags !== null && itemTags.length) {
      for (let rule of blacklistRuleset) {

        isBlacklisted = true
        for (let tag of rule) {

          if (!itemTags.includes(tag)) {
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
  }

  /**
   * @private
   */
  _onApplyNewSettings()
  {
    this._configurationManager.update()
    this._validateCompliance()
  }

  /**
   * @private
   */
  _onBackupSettings()
  {
    this._configurationManager.backup()
  }

  /**
   * @private
   */
  _onResetSettings()
  {
    this._configurationManager.revertChanges()
    this._validateCompliance()
  }

  /**
   * @private
   */
  _onRestoreSettings()
  {
    this._configurationManager.restore(new Response($('#restore-settings').prop('files')[0])).then(() => this._validateCompliance())
  }

  /**
   * @private
   */
  _onSaveSettings()
  {
    this._onApplyNewSettings()
    this._configurationManager.save()
  }

  /**
   * @param {string} configKey
   * @param {function(*)} actionCallback
   * @param {function(*, function?): boolean} validationCallback
   * @returns {BrazenBaseSearchEnhancer}
   * @protected
   */
  _performComplexOperation(configKey, validationCallback, actionCallback)
  {
    return this._performOperation(configKey, actionCallback, validationCallback)
  }

  /**
   * @param {string} configKey
   * @param {function(*)} actionCallback
   * @param {function(*, function?): boolean|null} validationCallback
   * @returns {BrazenBaseSearchEnhancer}
   * @protected
   */
  _performOperation(configKey, actionCallback, validationCallback = null)
  {
    let configField = this._configurationManager.getField(configKey)
    let defaultValidationCallback = this._configurationManager.generateValidationCallback(configKey)
    let validationCallbackParams
    let values = configField.optimized ?? configField.value

    if (validationCallback) {
      validationCallbackParams = [values, defaultValidationCallback]
    } else {
      validationCallbackParams = [values]
      validationCallback = defaultValidationCallback
    }
    if (Utilities.callEventHandler(validationCallback, validationCallbackParams, true)) {
      actionCallback(values)
    }
    return this
  }

  /**
   * @param {string} flagConfigKey
   * @param {string|null} configKey
   * @param {function(*)} actionCallback
   * @param {function(*, function?): boolean} validationCallback
   * @returns {BrazenBaseSearchEnhancer}
   * @protected
   */
  _performTogglableComplexOperation(flagConfigKey, configKey, validationCallback, actionCallback)
  {
    if (this._getConfig(flagConfigKey)) {
      this._performComplexOperation(configKey ?? flagConfigKey, validationCallback, actionCallback)
    }
    return this
  }

  /**
   * @param {string} flagConfigKey
   * @param {string} configKey
   * @param {function(*)} actionCallback
   * @param {function(*, function?): boolean|null} validationCallback
   * @returns {BrazenBaseSearchEnhancer}
   * @protected
   */
  _performTogglableOperation(flagConfigKey, configKey, actionCallback, validationCallback = null)
  {
    if (this._configurationManager.getValue(flagConfigKey)) {
      this._performOperation(configKey, actionCallback, validationCallback)
    }
    return this
  }

  /**
   * @param {string} path
   * @private
   */
  _removeIllegalCharactersFromPath(path)
  {
    let illegalCharacters = {
      '\\': '-',
      '/': '-',
      '|': '-',
      '?': '-',
    }
    for (let subject in illegalCharacters) {
      path = path.replace(subject, illegalCharacters[subject])
    }
    return path
  }

  /**
   * @param {boolean} enableCondition
   * @param {PaginatorConfiguration} configuration
   * @protected
   */
  _setupPaginator(enableCondition, configuration)
  {
    if (enableCondition) {
      configuration.itemSelectors = this._config.itemSelectors
      this._paginator = new BrazenPaginator(configuration)
    }
    this._configurationManager.addNumberField(CONFIG_PAGINATOR_LIMIT, 1, 50,
        'Limit paginator to concatenate the specified number of maximum pages.').
        addNumberField(CONFIG_PAGINATOR_THRESHOLD, 1, 1000,
            'Make paginator ensure the specified number of minimum results.')
  }

  /**
   * @return {BrazenSubscriptionsLoader}
   * @protected
   */
  _setupSubscriptionLoader()
  {
    this._subscriptionsLoader = new BrazenSubscriptionsLoader(
        (status) => this._subscriptionsLoaderButton.text(status),
        (subscriptions) => {
          this._configurationManager.getField(STORE_SUBSCRIPTIONS).value = subscriptions.length ? '"' +
              subscriptions.join('""') + '"' : ''
          this._configurationManager.save()
          $('#subscriptions-loader').prop('disabled', false)
        })

    this._subscriptionsLoaderButton = this._uiGen.createFormButton(
        'Load Subscriptions',
        'Makes a copy of your subscriptions in cache for related filters.',
        (event) => {
          if (this._config.isUserLoggedIn) {
            $(event.currentTarget).prop('disabled', true)
            this._subscriptionsLoader.run()
          } else {
            this._showNotLoggedInAlert()
          }
        }).attr('id', 'subscriptions-loader')

    return this._subscriptionsLoader
  }

  /**
   * @protected
   */
  _showNotLoggedInAlert()
  {
    alert('You need to be logged in to use this functionality')
  }

  /**
   * @return {Promise<void>}
   * @private
   */
  async _startProcessingDownloadQueue()
  {
    if (this._downloadsProcessing) {
      return
    }
    this._downloadsProcessing = true

    while (this._downloadsQueue.length > 0) {
      await this._downloadsQueue.shift()
      await Utilities.sleep(this._config.downloadsDelay)
    }

    this._downloadsProcessing = false
  }

  /**
   * @param {boolean} firstRun
   * @protected
   */
  _validateCompliance(firstRun = false)
  {
    let itemLists = $(this._config.itemListSelectors)
    if (firstRun) {
      itemLists.each((index, itemList) => {
        let itemListObject = $(itemList)

        if (this._paginator && itemListObject.is(this._paginator.getItemListSelector())) {

          ChildObserver.create().onNodesAdded((itemsAdded) => {
            this._complyItemsList($(itemsAdded), true)
            this._paginator.run(this._getConfig(CONFIG_PAGINATOR_THRESHOLD), this._getConfig(CONFIG_PAGINATOR_LIMIT))
          }).observe(itemList)

        } else {
          ChildObserver.create().onNodesAdded((itemsAdded) => {
            this._complyItemsList($(itemsAdded), true)
          }).observe(itemList)
        }

        this._complyItemsList(itemListObject)
      })
    } else {
      this._statistics.reset()
      itemLists.each((index, itemsList) => {
        this._complyItemsList($(itemsList))
      })
    }
    if (this._paginator) {
      this._paginator.run(this._getConfig(CONFIG_PAGINATOR_THRESHOLD), this._getConfig(CONFIG_PAGINATOR_LIMIT))
    }
    this._itemAttributesResolver.completeResolutionRun()
  }

  /**
   * @param {JQuery} item
   * @return {boolean}
   * @protected
   */
  _validateItemWhiteList(item)
  {
    let field = this._configurationManager.getField(FILTER_TEXT_WHITELIST)
    if (field) {
      let validationResult = field.value.length
          ? Validator.regexMatches(this._get(item, ITEM_NAME), field.optimized)
          : true
      this._statistics.record(FILTER_TEXT_WHITELIST, validationResult)
      return validationResult
    }
    return true
  }

  /**
   * @param {{name: string|null, element: JQuery|null, url: string}} download
   * @return {Promise<{name: string|null, url: string}>}
   * @private
   */
  _wrapDownloadTask(download)
  {
    return new Promise((resolve, reject) => {
      download.element?.remove()
      GM_download({
        url: download.url,
        name: download.name ?? (download.url + '/' + download.url.src.split('/').pop()),
        conflictAction: 'uniquify',
        onerror: () => alert('Failed to download image'),
      })
      resolve()
    })
  }

  /**
   * Initialize the script and do basic UI removals
   */
  init()
  {
    if (Utilities.callEventHandler(this._onValidateInit)) {

      this._configurationManager.initialize()

      this._itemAttributesResolver.addAttribute(ITEM_PROCESSED_ONCE, () => false)

      if (this._config.itemNameSelector !== '') {
        this._itemAttributesResolver.addAttribute(ITEM_NAME, (item) => item.find(this._config.itemNameSelector).text())
      }

      if (this._paginator) {
        this._paginator.initialize()
      }

      Utilities.processEventHandlerQueue(this._onBeforeUIBuild)

      if (!this._disableUI) {

        this._embedUI(this._uiGen.createSettingsSection().append(this._userInterface))
        Utilities.processEventHandlerQueue(this._onAfterUIBuild)

        this._configurationManager.updateInterface()
      }

      this._validateCompliance(true)

      Utilities.processEventHandlerQueue(this._onAfterInitialization)
    }
  }

  /**
   * @returns {boolean}
   */
  isUserLoggedIn()
  {
    return this._config.isUserLoggedIn
  }

  registerHighlightStyleClass(styleClass)
  {
    this._highlightClasses += ' ' + styleClass
    return this
  }
}