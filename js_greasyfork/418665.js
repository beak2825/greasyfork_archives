// ==UserScript==
// @name         Brazen Configuration Manager
// @namespace    brazenvoid
// @version      2.1.1
// @author       brazenvoid
// @license      GPL-3.0-only
// @description  Configuration management and related UI creation module
// ==/UserScript==

const CONFIG_TYPE_CHECKBOXES_GROUP = 'checkboxes'
const CONFIG_TYPE_COLOR = 'color'
const CONFIG_TYPE_FLAG = 'flag'
const CONFIG_TYPE_NUMBER = 'number'
const CONFIG_TYPE_RADIOS_GROUP = 'radios'
const CONFIG_TYPE_RANGE = 'range'
const CONFIG_TYPE_RULESET = 'ruleset'
const CONFIG_TYPE_SELECT = 'select'
const CONFIG_TYPE_TEXT = 'text'

class BrazenConfigurationManager
{
  /**
   * @typedef {{title: string, type: string, element: null|JQuery, value: *, maximum: int, minimum: int, options: string[], helpText: string,
   *            onFormatForUI: ConfigurationManagerRulesetCallback, onTranslateFromUI: ConfigurationManagerRulesetCallback,
   *            onOptimize: ConfigurationManagerRulesetCallback, createElement: Function, setFromUserInterface: Function, updateUserInterface: Function,
   *            optimized?: *}} ConfigurationField
   */

  /**
   * @callback ConfigurationManagerRulesetCallback
   * @param {*} values
   */

  /**
   * @callback ExternalConfigurationChangeCallback
   * @param {BrazenConfigurationManager} manager
   */

  /**
   * @type {{}}
   * @private
   */
  _config = {}

  /**
   * @type {ExternalConfigurationChangeCallback|null}
   * @private
   */
  _onExternalConfigurationChange = null

  /**
   * @type {LocalStore}
   * @private
   */
  _localStore = null

  /**
   * @type {LocalStore}
   * @private
   */
  _localStoreId = null

  /**
   * @type {string}
   * @private
   */
  _scriptPrefix

  /**
   * @type {number}
   * @private
   */
  _syncedLocalStoreId = 0

  /**
   * @type {SearchEnhancerTagSelectorGeneratorCallback}
   * @private
   */
  _tagSelectorGenerator

  /**
   * @type BrazenUIGenerator
   * @private
   */
  _uiGen

  /**
   * @param {string} scriptPrefix
   * @param {BrazenUIGenerator} uiGenerator
   * @param {SearchEnhancerTagSelectorGeneratorCallback} tagSelectorGenerator
   */
  constructor(scriptPrefix, uiGenerator, tagSelectorGenerator)
  {
    this._scriptPrefix = scriptPrefix
    this._tagSelectorGenerator = tagSelectorGenerator
    this._uiGen = uiGenerator
  }

  /**
   * @param {string} type
   * @param {string} name
   * @param {*} value
   * @param {string|null} helpText
   * @return ConfigurationField
   * @private
   */
  _createField(type, name, value, helpText)
  {
    let fieldKey = this._formatFieldKey(name)
    let field = this._config[fieldKey]
    if (field) {
      if (helpText) {
        field.helpText = helpText
      }
      field.value = value
    } else {
      field = {
        element: null,
        helpText: helpText,
        title: name,
        type: type,
        value: value,
        createElement: null,
        setFromUserInterface: null,
        updateUserInterface: null,
      }
      this._config[fieldKey] = field
    }
    return field
  }

  /**
   * @param {string} name
   * @return {string}
   * @private
   */
  _formatFieldKey(name)
  {
    return Utilities.toKebabCase(name)
  }

  /**
   * @param {Array} rules
   * @param {boolean} useSelectors
   * @return {JQuery.Selector[]}
   * @private
   */
  _optimizeTagRuleset(rules, useSelectors)
  {
    let orTags, iteratedRuleset
    let optimizedRuleset = []

    // Operations

    let expandRuleset = (ruleset, tags) => {

      let grownRuleset = []
      for (let tag of tags) {
        let cleanedTag = tag.trim()
        for (let rule of ruleset) {
          grownRuleset.push([...rule, useSelectors ? this._tagSelectorGenerator(cleanedTag) : cleanedTag])
        }
      }
      return grownRuleset
    }

    let growRuleset = (ruleset, tagToAdd) => {

      if (ruleset.length) {

        tagToAdd = tagToAdd.trim()

        for (let rule of ruleset) {
          rule.push(useSelectors ? this._tagSelectorGenerator(tagToAdd) : tagToAdd)
        }

      } else {

        let tags = typeof tagToAdd === 'string' ? [tagToAdd] : tagToAdd

        for (let tag of tags) {
          let cleanedTag = tag.trim()
          ruleset.push([useSelectors ? this._tagSelectorGenerator(cleanedTag) : cleanedTag])
        }
      }
    }

    // Translate user defined rules

    for (let rule of rules) {

      iteratedRuleset = []

      // Handle conditional operators
      for (let andTag of rule.split(' // ')[0].split('&')) {

        orTags = andTag.split('|')
        if (orTags.length === 1) {
          growRuleset(iteratedRuleset, andTag)
        } else if (iteratedRuleset.length) {
          iteratedRuleset = expandRuleset(iteratedRuleset, orTags)
        } else {
          growRuleset(iteratedRuleset, orTags)
        }
      }

      optimizedRuleset = optimizedRuleset.concat(iteratedRuleset)
    }

    // Sort rules by complexity

    return optimizedRuleset.sort((a, b) => a.length - b.length)
  }

  _syncLocalStore()
  {
    let field
    let storeObject = this._localStore.get()

    for (let key in this._config) {

      field = this._config[key]
      if (storeObject[key] !== undefined) {

        field.value = storeObject[key]
        if (field.type === CONFIG_TYPE_RULESET) {
          field.optimized = Utilities.callEventHandler(field.onOptimize, [field.value])
        }
      }
    }
    this.updateInterface()
  }

  /**
   * @return {{}}
   * @private
   */
  _toStoreObject()
  {
    let storeObject = {}
    for (let key in this._config) {
      storeObject[key] = this._config[key].value
    }
    return storeObject
  }

  /**
   * @param id
   * @private
   */
  _updateLocalStoreId(id = null)
  {
    if (id === null) {
      id = Utilities.generateId()
    }
    this._localStoreId.save({id: id})
    this._syncedLocalStoreId = id
  }

  /**
   * @param {string} name
   * @param {array} keyValuePairs
   * @param {string} helpText
   * @returns {BrazenConfigurationManager}
   */
  addCheckboxesGroup(name, keyValuePairs, helpText)
  {
    let field = this._createField(CONFIG_TYPE_CHECKBOXES_GROUP, name, [], helpText)

    field.options = keyValuePairs

    field.createElement = () => {
      field.element = this._uiGen.createFormCheckBoxesGroupSection(field.title, field.options, field.helpText)
      return field.element
    }
    field.setFromUserInterface = () => {
      field.value = []
      field.element.find('input:checked').each((index, element) => {
        field.value.push($(element).attr('data-value'))
      })
    }
    field.updateUserInterface = () => {
      let elements = field.element.find('input')
      for (let key of field.value) {
        elements.filter('[data-value="' + key + '"]').prop('checked', true)
      }
    }
    return this
  }

  /**
   * @param {string} name
   * @param {string} helpText
   * @returns {BrazenConfigurationManager}
   */
  addColorField(name, helpText)
  {
    let field = this._createField(CONFIG_TYPE_COLOR, name, false, helpText)

    field.createElement = () => {
      let inputGroup = this._uiGen.createFormInputGroup(field.title, 'color', field.helpText)
      field.element = inputGroup.find('input')
      return inputGroup
    }
    field.setFromUserInterface = () => {
      field.value = field.element.val()
    }
    field.updateUserInterface = () => {
      field.element.val(field.value)
    }
    return this
  }

  /**
   * @param {string} name
   * @param {string} helpText
   * @returns {BrazenConfigurationManager}
   */
  addFlagField(name, helpText)
  {
    let field = this._createField(CONFIG_TYPE_FLAG, name, false, helpText)

    field.createElement = () => {
      let inputGroup = this._uiGen.createFormInputGroup(field.title, 'checkbox', field.helpText)
      field.element = inputGroup.find('input')
      return inputGroup
    }
    field.setFromUserInterface = () => {
      field.value = field.element.prop('checked')
    }
    field.updateUserInterface = () => {
      field.element.prop('checked', field.value)
    }
    return this
  }

  /**
   * @param {string} name
   * @param {int} minimum
   * @param {int} maximum
   * @param {string} helpText
   * @returns {BrazenConfigurationManager}
   */
  addNumberField(name, minimum, maximum, helpText)
  {
    let field = this._createField(CONFIG_TYPE_NUMBER, name, minimum, helpText)

    field.minimum = minimum
    field.maximum = maximum

    field.createElement = () => {
      let inputGroup = this._uiGen.createFormInputGroup(field.title, 'number', field.helpText).
          attr('min', field.minimum).
          attr('max', field.maximum)
      field.element = inputGroup.find('input')
      return inputGroup
    }
    field.setFromUserInterface = () => {
      field.value = Number.parseInt(field.element.val().toString())
    }
    field.updateUserInterface = () => {
      field.element.val(field.value)
    }
    return this
  }

  /**
   * @param {string} name
   * @param {array} keyValuePairs
   * @param {string} helpText
   * @returns {BrazenConfigurationManager}
   */
  addRadiosGroup(name, keyValuePairs, helpText)
  {
    let field = this._createField(CONFIG_TYPE_RADIOS_GROUP, name, keyValuePairs[0][1], helpText)

    field.options = keyValuePairs

    field.createElement = () => {
      let inputGroup = this._uiGen.createFormRadiosGroupSection(field.title, field.options, field.helpText)
      field.element = inputGroup
      return inputGroup
    }
    field.setFromUserInterface = () => {
      field.value = field.element.find('input:checked').attr('data-value')
    }
    field.updateUserInterface = () => {
      field.element.find('input[data-value="' + field.value + '"]').prop('checked', true).trigger('change')
    }
    return this
  }

  /**
   * @param {string} name
   * @param {int} minimum
   * @param {int} maximum
   * @param {string} helpText
   * @returns {BrazenConfigurationManager}
   */
  addRangeField(name, minimum, maximum, helpText)
  {
    let field = this._createField(CONFIG_TYPE_RANGE, name, {minimum: minimum, maximum: minimum}, helpText)

    field.minimum = minimum
    field.maximum = maximum

    field.createElement = () => {
      let inputGroup = this._uiGen.createFormRangeInputGroup(field.title, 'number', field.minimum, field.maximum,
          field.helpText)
      field.element = inputGroup.find('input')
      return inputGroup
    }
    field.setFromUserInterface = () => {
      field.value = {
        minimum: field.element.first().val(),
        maximum: field.element.last().val(),
      }
    }
    field.updateUserInterface = () => {
      field.element.first().val(field.value.minimum)
      field.element.last().val(field.value.maximum)
    }
    return this
  }

  /**
   * @param {string} name
   * @param {number} rows
   * @param {string|null} helpText
   * @param {ConfigurationManagerRulesetCallback} onTranslateFromUI
   * @param {ConfigurationManagerRulesetCallback} onFormatForUI
   * @param {ConfigurationManagerRulesetCallback} onOptimize
   * @param {boolean} sortRules
   * @return {BrazenConfigurationManager}
   */
  addRulesetField(name, rows, helpText, onTranslateFromUI = null, onFormatForUI = null, onOptimize = null, sortRules = false)
  {
    let field = this._createField(CONFIG_TYPE_RULESET, name, [], helpText)

    field.optimized = null
    field.onTranslateFromUI = onTranslateFromUI ?? field.onTranslateFromUI
    field.onFormatForUI = onFormatForUI ?? field.onFormatForUI
    field.onOptimize = onOptimize ?? field.onOptimize
    field.sortRules = sortRules

    field.createElement = () => {
      let inputGroup = this._uiGen.createFormTextAreaGroup(field.title, rows, field.helpText)
      field.element = inputGroup.find('textarea')
      return inputGroup
    }
    field.setFromUserInterface = () => {
      let value = Utilities.trimAndKeepNonEmptyStrings(field.element.val().split(REGEX_LINE_BREAK))
      if (field.sortRules) {
        value = value.sort((a, b) => a.localeCompare(b, undefined, {sensitivity: "base"}))
      }
      field.value = Utilities.callEventHandler(field.onTranslateFromUI, [value], value)
      field.optimized = Utilities.callEventHandler(field.onOptimize, [field.value])
    }
    field.updateUserInterface = () => {
      field.element.val(Utilities.callEventHandler(field.onFormatForUI, [field.value], field.value).join('\n'))
    }
    return this
  }

  /**
   * @param {string} name
   * @param {array} keyValuePairs
   * @param {string} helpText
   * @returns {BrazenConfigurationManager}
   */
  addSelectField(name, keyValuePairs, helpText)
  {
    let field = this._createField(CONFIG_TYPE_SELECT, name, keyValuePairs[0][1], helpText)

    field.options = keyValuePairs

    field.createElement = () => {
      let inputGroup = this._uiGen.createFormRadiosGroupSection(field.title, field.options, field.helpText)
      field.element = inputGroup.find('select')
      return inputGroup
    }
    field.setFromUserInterface = () => {
      field.value = field.element.val()
    }
    field.updateUserInterface = () => {
      field.element.val(field.value).trigger('change')
    }
    return this
  }

  /**
   * @param {string} key
   * @param {boolean} useSelectors
   * @param {number} rows
   * @param {string} helpText
   * @param {Function|null} formatter
   * @param {boolean} sortRules
   * @return {BrazenConfigurationManager}
   */
  addTagRulesetField(key, useSelectors, rows, helpText = '', formatter = null, sortRules = false)
  {
    return this.addRulesetField(
        key, rows, helpText, null, null, (rules) => {
          if (formatter) {
            rules = formatter(rules)
          }
          return this._optimizeTagRuleset(rules, useSelectors)
        }, sortRules)
  }

  /**
   * @param {string} name
   * @param {string} helpText
   * @param {string} defaultValue
   * @returns {BrazenConfigurationManager}
   */
  addTextField(name, helpText, defaultValue = '')
  {
    let field = this._createField(CONFIG_TYPE_TEXT, name, defaultValue, helpText)

    field.createElement = () => {
      let inputGroup = this._uiGen.createFormInputGroup(field.title, 'text', field.helpText)
      field.element = inputGroup.find('input')
      return inputGroup
    }
    field.setFromUserInterface = () => {
      let value = field.element.val()
      field.value = value === '' ? defaultValue : value
    }
    field.updateUserInterface = () => {
      field.element.val(field.value)
    }
    return this
  }

  /**
   * @returns {string}
   */
  backup()
  {
    let backupConfig = this._toStoreObject()
    backupConfig.id = this._syncedLocalStoreId
    backupConfig = JSON.stringify(backupConfig)

    let link = document.createElement('a')
    link.download = this._scriptPrefix + 'backup.json'
    link.href = URL.createObjectURL(new Blob([backupConfig], {
      type: 'application/json',
    }))
    link.click()
  }

  /**
   * @param {string} name
   * @returns {JQuery}
   */
  createElement(name)
  {
    return this.getFieldOrFail(name).createElement()
  }

  /**
   * @param {string} configKey
   * @returns {function(*): boolean}
   */
  generateValidationCallback(configKey)
  {
    let validationCallback
    switch (this.getField(configKey).type) {
      case CONFIG_TYPE_FLAG:
      case CONFIG_TYPE_RADIOS_GROUP:
      case CONFIG_TYPE_SELECT:
        validationCallback = (value) => value
        break
      case CONFIG_TYPE_CHECKBOXES_GROUP:
        validationCallback = (valueKeys) => valueKeys.length
        break
      case CONFIG_TYPE_NUMBER:
        validationCallback = (value) => value > 0
        break
      case CONFIG_TYPE_RANGE:
        validationCallback = (range) => range.minimum > 0 || range.maximum > 0
        break
      case CONFIG_TYPE_RULESET:
        validationCallback = (rules) => rules.length
        break
      case CONFIG_TYPE_TEXT:
        validationCallback = (value) => value.length
        break
      default:
        throw new Error('Associated config type requires explicit validation callback definition.')
    }
    return validationCallback
  }

  /**
   * @param {string} name
   * @return {ConfigurationField|null}
   */
  getField(name)
  {
    return this._config[this._formatFieldKey(name)]
  }

  /**
   * @param {string} name
   * @return {ConfigurationField}
   */
  getFieldOrFail(name)
  {
    let field = this._config[this._formatFieldKey(name)]
    if (field) {
      return field
    }
    throw new Error('Field named "' + name + '" could not be found')
  }

  /**
   * @param {string} name
   * @returns {*}
   */
  getValue(name)
  {
    return this.getFieldOrFail(name).value
  }

  /**
   * @param {string} name
   * @return {boolean}
   */
  hasField(name)
  {
    return this.getField(name) !== undefined
  }

  /**
   * @return {BrazenConfigurationManager}
   */
  initialize()
  {
    this._localStore = new LocalStore(this._scriptPrefix + 'settings', this._toStoreObject())
    this._localStore.onChange(() => this.updateInterface())

    this._localStoreId = new LocalStore(this._scriptPrefix + 'settings-id', {id: Utilities.generateId()})
    this._syncedLocalStoreId = this._localStoreId.get().id

    this._syncLocalStore()

    $(document).on('visibilitychange', () => {
      if (!document.hidden && this._syncedLocalStoreId !== this._localStoreId.get().id) {
        this._syncLocalStore()
        Utilities.callEventHandler(this._onExternalConfigurationChange, [this])
      }
    })
    return this
  }

  /**
   * @param {ExternalConfigurationChangeCallback} eventHandler
   * @return {BrazenConfigurationManager}
   */
  onExternalConfigurationChange(eventHandler)
  {
    this._onExternalConfigurationChange = eventHandler
    return this
  }

  /**
   * @param {Response} response
   */
  async restore(response)
  {
    try {
      let backupConfig = await response.json()
      let id = backupConfig.id
      delete backupConfig.id

      this._localStore.save(backupConfig)
      this._syncLocalStore()
      this._updateLocalStoreId(id)

      alert('Brazen script - Backup restored!')
    } catch {
      alert('Brazen script - The supplied backup file seems to have been corrupted!')
    }
  }

  revertChanges()
  {
    this._syncLocalStore()
  }

  /**
   * @return {BrazenConfigurationManager}
   */
  save()
  {
    this.update()._localStore.save(this._toStoreObject())
    this._updateLocalStoreId()

    return this
  }

  /**
   * @return {BrazenConfigurationManager}
   */
  update()
  {
    let field
    for (let fieldName in this._config) {
      field = this._config[fieldName]
      if (field.element) {
        field.setFromUserInterface()
      }
    }
    return this
  }

  /**
   * @return {BrazenConfigurationManager}
   */
  updateInterface()
  {
    let field
    for (let fieldName in this._config) {
      field = this._config[fieldName]
      if (field.element) {
        field.updateUserInterface()
      }
    }
    return this
  }
}