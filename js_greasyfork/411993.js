// ==UserScript==
// @name          grrrr
// @namespace     brazenvoid
// @version       1.0
// @author        brazenvoid
// @license       GPL-3.0-only
// @description   Base library for my scripts
// @grant         GM_addStyle
// @run-at  	  document-end
// ==/UserScript==

/**
 * @function GM_addStyle
 * @param {string} style
 */
GM_addStyle(
 `@keyframes fadeEffect{from{opacity:0}to{opacity:1}}button.form-button{padding:0 5px;width:100%}button.show-settings{background-color:#000000;border:0;margin:2px 5px;padding:2px 5px;width:100%}button.show-settings.fixed{color:#ffffff;font-size:.7rem;left:0;height:90vh;margin:0;padding:0;position:fixed;top:5vh;width:.1vw;writing-mode:sideways-lr;z-index:999}button.tab-button{background-color:#808080;border:1px solid #000000;border-bottom:0;border-top-left-radius:3px;border-top-right-radius:3px;cursor:pointer;float:left;outline:none;padding:5px 10px;transition:.3s}button.tab-button:hover{background-color:#fff}button.tab-button.active{background-color:#fff;display:block}div.form-actions{text-align:center}div.form-actions button.form-button{padding:0 15px;width:auto}div.form-actions-wrapper{display:inline-flex}div.form-actions-wrapper > div.form-group + *{margin-left:15px}div.form-group{min-height:15px;padding:4px 0}div.form-group.form-range-input-group > input{padding:0 5px;width:70px}div.form-group.form-range-input-group > input + input{margin-right:5px}div.form-section{text-align:center;solid #000000}div.form-section button + button{margin-left:5px}div.form-section label.title{display:block;height:20px;width:100%}div.form-section button.form-button{width:auto}div.tab-panel{animation:fadeEffect 1s;border:1px solid #000000;display:none;padding:5px 10px}div.tab-panel.active{display:block}div.tabs-nav{overflow:hidden}div.tabs-section{margin-bottom:5px}hr{margin:3px}input.form-input{height:18px;text-align:center}input.form-input.check-radio-input{float:left;margin-right:5px}input.form-input.regular-input{float:right;width:100px}label.form-label{color:#ffffff,padding:2px 0}label.form-label.regular-input{float:left}label.form-label.check-radio-input{float:left}label.form-stat-label{float:right;padding:2px 0}section.form-section{color:#ffffff;font-size:12px;font-weight:700;position:fixed;left:0;padding:5px 10px;z-index:1000000}select.form-dropdown{float:right;height:18px;text-align:center;width:100px}textarea.form-input{display:block;height:auto;position:relative;width:98%}`)

/**
 * @param milliseconds
 * @return {Promise<*>}
 */
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

/**
 * @param {string} text
 * @return {string}
 */
function toKebabCase (text)
{
    return text.toLowerCase().replace(' ', '-')
}

class ChildObserver
{
    /**
     * @callback observerOnMutation
     * @param {NodeList} nodes
     */

    /**
     * @return {ChildObserver}
     */
    static create ()
    {
        return new ChildObserver
    }

    /**
     * ChildObserver constructor
     */
    constructor ()
    {
        this._node = null
        this._observer = null
        this._onNodesAdded = null
        this._onNodesRemoved = null
    }

    /**
     * @return {ChildObserver}
     * @private
     */
    _observeNodes ()
    {
        this._observer.observe(this._node, {childList: true})
        return this
    }

    /**
     * Attach an observer to the specified node(s)
     * @param {Node} node
     * @returns {ChildObserver}
     */
    observe (node)
    {
        this._node = node
        this._observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.addedNodes.length && this._onNodesAdded !== null) {
                    this._onNodesAdded(
                        mutation.addedNodes,
                        mutation.previousSibling,
                        mutation.nextSibling,
                        mutation.target,
                    )
                }
                if (mutation.removedNodes.length && this._onNodesRemoved !== null) {
                    this._onNodesRemoved(
                        mutation.removedNodes,
                        mutation.previousSibling,
                        mutation.nextSibling,
                        mutation.target,
                    )
                }
            }
        })
        return this._observeNodes()
    }

    /**
     * @param {observerOnMutation} eventHandler
     * @returns {ChildObserver}
     */
    onNodesAdded (eventHandler)
    {
        this._onNodesAdded = eventHandler
        return this
    }

    /**
     * @param {observerOnMutation} eventHandler
     * @returns {ChildObserver}
     */
    onNodesRemoved (eventHandler)
    {
        this._onNodesRemoved = eventHandler
        return this
    }

    pauseObservation ()
    {
        this._observer.disconnect()
    }

    resumeObservation ()
    {
        this._observeNodes()
    }
}

class LocalStore
{
    /**
     * @callback storeEventHandler
     * @param {Object} store
     */

    /**
     * @param {string} scriptPrefix
     * @param {Object} defaults
     * @return {LocalStore}
     */
    static createGlobalConfigStore (scriptPrefix, defaults)
    {
        return new LocalStore(scriptPrefix + 'globals', defaults)
    }

    static createPresetConfigStore (scriptPrefix, defaults)
    {
        return new LocalStore(scriptPrefix + 'presets', [
            {
                name: 'default',
                config: defaults,
            },
        ])
    }

    /**
     * @param {string} key
     * @param {Object} defaults
     */
    constructor (key, defaults)
    {
        /**
         * @type {string}
         * @private
         */
        this._key = key

        /**
         * @type {Object}
         * @private
         */
        this._store = {}

        /**
         * @type {string}
         * @private
         */
        this._defaults = this._toJSON(defaults)

        /**
         * @type {storeEventHandler}
         */
        this._onChange = null
    }

    /**
     * @param {string} json
     * @return {Object}
     * @private
     */
    _fromJSON (json)
    {
        /** @type {{arrays: Object, objects: Object, properties: Object}} */
        let parsedJSON = JSON.parse(json)
        let arrayObject = {}
        let store = {}

        for (let property in parsedJSON.arrays) {
            arrayObject = JSON.parse(parsedJSON.arrays[property])
            store[property] = []

            for (let key in arrayObject) {
                store[property].push(arrayObject[key])
            }
        }
        for (let property in parsedJSON.objects) {
            store[property] = this._fromJSON(parsedJSON.objects[property])
        }
        for (let property in parsedJSON.properties) {
            store[property] = parsedJSON.properties[property]
        }
        return store
    }

    /**
     * @return {string}
     * @private
     */
    _getStore ()
    {
        return window.localStorage.getItem(this._key)
    }

    /**
     * @return {Object}
     * @private
     */
    _getDefaults ()
    {
        return this._fromJSON(this._defaults)
    }

    /**
     * @param {Object} store
     * @return {string}
     * @private
     */
    _toJSON (store)
    {
        let arrayToObject = {}
        let json = {arrays: {}, objects: {}, properties: {}}

        for (let property in store) {
            if (typeof store[property] === 'object') {
                if (Array.isArray(store[property])) {
                    for (let key in store[property]) {
                        arrayToObject[key] = store[property][key]
                    }
                    json.arrays[property] = JSON.stringify(arrayToObject)
                } else {
                    json.objects[property] = this._toJSON(store[property])
                }
            } else {
                json.properties[property] = store[property]
            }
        }
        return JSON.stringify(json)
    }

    _handleOnChange ()
    {
        if (this._onChange !== null) {
            this._onChange(this._store)
        }
    }

    /**
     * @return {LocalStore}
     */
    delete ()
    {
        window.localStorage.removeItem(this._key)
        return this
    }

    /**
     * @return {*}
     */
    get ()
    {
        return this._store
    }

    /**
     * @return {boolean}
     */
    isPurged ()
    {
        return this._getStore() === null
    }

    /**
     * @param {storeEventHandler} handler
     * @return {LocalStore}
     */
    onChange (handler)
    {
        this._onChange = handler
        return this
    }

    /**
     * @return {LocalStore}
     */
    restoreDefaults ()
    {
        this._store = this._getDefaults()
        this._handleOnChange()
        return this
    }

    /**
     * @return {LocalStore}
     */
    retrieve ()
    {
        let storedStore = this._getStore()
        if (storedStore === null) {
            this.restoreDefaults()
        } else {
            this._store = this._fromJSON(storedStore)
        }
        this._handleOnChange()
        return this
    }

    /**
     * @return {LocalStore}
     */
    save ()
    {
        window.localStorage.setItem(this._key, this._toJSON(this._store))
        this._handleOnChange()
        return this
    }

    /**
     * @param {*} data
     * @return {LocalStore}
     */
    update (data)
    {
        this._store = data
        return this.save()
    }
}

class SelectorGenerator
{
    /**
     * @param {string} selectorPrefix
     */
    constructor (selectorPrefix)
    {
        /**
         * @type {string}
         * @private
         */
        this._prefix = selectorPrefix
    }

    /**
     * @param {string} selector
     * @return {string}
     */
    getSelector (selector)
    {
        return this._prefix + selector
    }

    /**
     * @param {string} settingName
     * @return {string}
     */
    getSettingsInputSelector (settingName)
    {
        return this.getSelector(toKebabCase(settingName) + '-setting')
    }

    /**
     * @param {string} settingName
     * @param {boolean} getMinInputSelector
     * @return {string}
     */
    getSettingsRangeInputSelector (settingName, getMinInputSelector)
    {
        return this.getSelector(toKebabCase(settingName) + (getMinInputSelector ? '-min' : '-max') + '-setting')
    }

    /**
     * @param {string} statisticType
     * @return {string}
     */
    getStatLabelSelector (statisticType)
    {
        return this.getSelector(toKebabCase(statisticType) + '-stat')
    }
}

class StatisticsRecorder
{
    /**
     * @param {string} selectorPrefix
     */
    constructor (selectorPrefix)
    {
        /**
         * @type {SelectorGenerator}
         * @private
         */
        this._selectorGenerator = new SelectorGenerator(selectorPrefix)

        /**
         * @type {{Total: number}}
         * @private
         */
        this._statistics = {Total: 0}
    }

    /**
     * @param {string} statisticType
     * @param {boolean} validationResult
     * @param {number} value
     */
    record (statisticType, validationResult, value = 1)
    {
        if (!validationResult) {
            if (typeof this._statistics[statisticType] !== 'undefined') {
                this._statistics[statisticType] += value
            } else {
                this._statistics[statisticType] = value
            }
            this._statistics.Total += value
        }
    }

    reset ()
    {
        for (const statisticType in this._statistics) {
            this._statistics[statisticType] = 0
        }
    }

    updateUI ()
    {
        let label, labelSelector

        for (const statisticType in this._statistics) {
            labelSelector = this._selectorGenerator.getStatLabelSelector(statisticType)
            label = document.getElementById(labelSelector)
            if (label !== null) {
                label.textContent = this._statistics[statisticType]
            }
        }
    }
}

class UIGenerator
{
    /**
     * @param {HTMLElement|Node} node
     */
    static appendToBody (node)
    {
        document.getElementsByTagName('body')[0].appendChild(node)
    }

    /**
     * @param {HTMLElement} node
     * @param {HTMLElement[]} children
     * @return {HTMLElement}
     */
    static populateChildren (node, children)
    {
        for (let child of children) {
            node.appendChild(child)
        }
        return node
    }

    /**
     * @param {boolean} showUI
     * @param {string} selectorPrefix
     */
    constructor (showUI, selectorPrefix)
    {
        /**
         * @type {*}
         * @private
         */
        this._buttonBackroundColor = null

        /**
         * @type {HTMLElement}
         * @private
         */
        this._section = null

        /**
         * @type {SelectorGenerator}
         * @private
         */
        this._selectorGenerator = new SelectorGenerator(selectorPrefix)

        /**
         * @type {string}
         * @private
         */
        this._selectorPrefix = selectorPrefix

        /**
         * @type {boolean}
         * @private
         */
        this._showUI = showUI

        /**
         * @type {HTMLLabelElement}
         * @private
         */
        this._statusLine = null

        /**
         * @type {string}
         * @private
         */
        this._statusText = ''
    }

    /**
     * @param {HTMLElement} node
     * @param {string} text
     * @return {this}
     * @private
     */
    _addHelpTextOnHover (node, text)
    {
        node.addEventListener('mouseover', () => this.updateStatus(text, true))
        node.addEventListener('mouseout', () => this.resetStatus())
    }

    /**
     * @param {HTMLElement[]} children
     * @return {HTMLElement}
     */
    addSectionChildren (children)
    {
        return UIGenerator.populateChildren(this._section, children)
    }

    /**
     * @return {HTMLBRElement}
     */
    createBreakSeparator ()
    {
        return document.createElement('br')
    }

    /**
     * @param {HTMLElement[]} children
     * @return {HTMLDivElement}
     */
    createFormActions (children)
    {
        let wrapperDiv = document.createElement('div')
        wrapperDiv.classList.add('form-actions-wrapper')

        UIGenerator.populateChildren(wrapperDiv, children)

        let formActionsDiv = document.createElement('div')
        formActionsDiv.classList.add('form-actions')
        formActionsDiv.appendChild(wrapperDiv)

        return formActionsDiv
    }

    /**
     * @param {string} caption
     * @param {EventListenerOrEventListenerObject} onClick
     * @param {string} hoverHelp
     * @return {HTMLButtonElement}
     */
    createFormButton (caption, onClick, hoverHelp = '')
    {
		console.log (caption);

        let button = document.createElement('button')
		if (caption == 'Apply')
		{
        button.classList.add('grrapp')
		} else {
		button.classList.add('formapp')
		} 
				if (caption == 'Update')
		{
        button.classList.add('fsdf')
		}
        button.textContent = caption
        button.addEventListener('click', onClick)

        if (hoverHelp !== '') {
            this._addHelpTextOnHover(button, hoverHelp)
        }
        if (this._buttonBackroundColor !== null) {
            button.style.backgroundColor = this._buttonBackroundColor
        }
        return button
    }

    /**
     * @param {HTMLElement[]} children
     * @return {HTMLElement}
     */
    createFormGroup (children)
    {
        let divFormGroup = document.createElement('div')
        divFormGroup.classList.add('form-group')

        return UIGenerator.populateChildren(divFormGroup, children)
    }

    /**
     * @param {string} id
     * @param {Array} keyValuePairs
     * @param {*} defaultValue
     * @return {HTMLSelectElement}
     */
    createFormGroupDropdown (id, keyValuePairs, defaultValue = null)
    {
        let dropdown = document.createElement('select'), item
        dropdown.id = id
        dropdown.classList.add('form-dropdown')

        for (let [key, value] of keyValuePairs) {
            item = document.createElement('option')
            item.textContent = value
            item.value = key
            dropdown.appendChild(item)
        }
        dropdown.value = defaultValue === null ? keyValuePairs[0][0] : defaultValue

        return dropdown
    }

    /**
     * @param {string} id
     * @param {string} type
     * @param {*} defaultValue
     * @return {HTMLInputElement}
     */
    createFormGroupInput (id, type, defaultValue = null)
    {
        let inputFormGroup = document.createElement('input')
        inputFormGroup.id = id
        inputFormGroup.classList.add('form-input')
        inputFormGroup.type = type

        switch (type) {
            case 'number':
            case 'text':
                inputFormGroup.classList.add('regular-input')

                if (defaultValue !== null) {
                    inputFormGroup.value = defaultValue
                }
                break
            case 'radio':
            case 'checkbox':
                inputFormGroup.classList.add('check-radio-input')

                if (defaultValue !== null) {
                    inputFormGroup.checked = defaultValue
                }
                break
        }
        return inputFormGroup
    }

    /**
     * @param {string} label
     * @param {string} inputID
     * @param {string} inputType
     * @return {HTMLLabelElement}
     */
    createFormGroupLabel (label, inputID = '', inputType = '')
    {
        let labelFormGroup = document.createElement('label')
        labelFormGroup.classList.add('form-label')
        labelFormGroup.textContent = label

        if (inputID !== '') {
            labelFormGroup.setAttribute('for', inputID)
        }
        if (inputType !== '') {
            switch (inputType) {
                case 'number':
                case 'text':
                    labelFormGroup.classList.add('regular-input')
                    labelFormGroup.textContent += ': '
                    break
                case 'radio':
                case 'checkbox':
                    labelFormGroup.classList.add('check-radio-input')
                    break
            }
        }
        return labelFormGroup
    }

    /**
     * @param {string} statisticType
     * @return {HTMLLabelElement}
     */
    createFormGroupStatLabel (statisticType)
    {
        let labelFormGroup = document.createElement('label')
        labelFormGroup.id = this._selectorGenerator.getStatLabelSelector(statisticType)
        labelFormGroup.classList.add('form-stat-label')
        labelFormGroup.textContent = '0'

        return labelFormGroup
    }

    /**
     * @param {string} label
     * @param {string} inputType
     * @param {string} hoverHelp
     * @param {*} defaultValue
     * @return {HTMLElement}
     */
    createFormInputGroup (label, inputType = 'text', hoverHelp = '', defaultValue = null)
    {
        let divFormInputGroup
        let inputID = this._selectorGenerator.getSettingsInputSelector(label)
        let labelFormGroup = this.createFormGroupLabel(label, inputID, inputType)
        let inputFormGroup = this.createFormGroupInput(inputID, inputType, defaultValue)

        switch (inputType) {
            case 'number':
            case 'text':
                divFormInputGroup = this.createFormGroup([labelFormGroup, inputFormGroup])
                break
            case 'radio':
            case 'checkbox':
                divFormInputGroup = this.createFormGroup([inputFormGroup, labelFormGroup])
                break
        }
        if (hoverHelp !== '') {
            this._addHelpTextOnHover(divFormInputGroup, hoverHelp)
        }
		
        return divFormInputGroup
    }

    /**
     * @param {string} label
     * @param {string} inputsType
     * @param {int[]|string[]} defaultValues
     * @return {HTMLElement}
     */
    createFormRangeInputGroup (label, inputsType = 'text', defaultValues = [])
    {
        let maxInputSelector = this._selectorGenerator.getSettingsRangeInputSelector(label, false)
        let minInputSelector = this._selectorGenerator.getSettingsRangeInputSelector(label, true)

        let divFormInputGroup = this.createFormGroup([
            this.createFormGroupLabel(label, '', inputsType),
            this.createFormGroupInput(maxInputSelector, inputsType, defaultValues.length ? defaultValues[1] : null),
            this.createFormGroupInput(minInputSelector, inputsType, defaultValues.length ? defaultValues[0] : null),
        ])
        divFormInputGroup.classList.add('form-range-input-group')

        return divFormInputGroup
    }

    /**
     * @param {string} title
     * @param {HTMLElement[]} children
     * @return {HTMLElement|HTMLDivElement}
     */
    createFormSection (title, children)
    {
        let sectionDiv = document.createElement('div')
        sectionDiv.classList.add('form-section')

        if (title !== '') {
            let sectionTitle = document.createElement('label')
            sectionTitle.textContent = title
            sectionTitle.classList.add('title')
            UIGenerator.populateChildren(sectionDiv, [sectionTitle])
        }
        return UIGenerator.populateChildren(sectionDiv, children)
    }

    /**
     * @param {string} caption
     * @param {string} tooltip
     * @param {EventListenerOrEventListenerObject} onClick
     * @param {string} hoverHelp
     * @return {HTMLButtonElement}
     */
    createFormSectionButton (caption, tooltip, onClick, hoverHelp = '', grr= '')
    {
        let button = this.createFormButton(caption, onClick, hoverHelp, grr)
        button.title = tooltip

        return button
    }

    /**
     * @param {string} label
     * @param {int} rows
     * @param {string} hoverHelp
     * @param {string} defaultValue
     * @return {HTMLElement}
     */
    createFormTextAreaGroup (label, rows, hoverHelp = '', defaultValue = '')
    {
        let labelElement = this.createFormGroupLabel(label)
        labelElement.style.textAlign = 'center'

        let textAreaElement = document.createElement('textarea')
        textAreaElement.id = this._selectorGenerator.getSettingsInputSelector(label)
        textAreaElement.classList.add('form-input')
        textAreaElement.value = defaultValue
        textAreaElement.setAttribute('rows', rows.toString())

        let group = this.createFormGroup([labelElement, textAreaElement])

        if (hoverHelp !== '') {
            this._addHelpTextOnHover(group, hoverHelp)
        }
        return group
    }

    /**
     * @param {string} IDSuffix
     * @param {*} backgroundColor
     * @param {*} top
     * @param {*} width
     * @return {this}
     */
    createSection (IDSuffix, backgroundColor, top, width)
    {
        this._section = document.createElement('section')
        this._section.id = this._selectorGenerator.getSelector(IDSuffix)
        this._section.classList.add('form-section')
        this._section.style.display = this._showUI ? 'block' : 'none'
        this._section.style.top = top
        this._section.style.width = width
        this._section.style.backgroundColor = null

        return this
    }

    /**
     * @return {HTMLHRElement}
     */
    createSeparator ()
    {
        return document.createElement('hr')
    }

    /**
     * @param {LocalStore} localStore
     * @param {EventListenerOrEventListenerObject|Function} onClick
     * @param {boolean} addTopPadding
     * @return {HTMLDivElement}
     */
    createSettingsFormActions (localStore, onClick, addTopPadding = false)
    {
        let divFormActions = this.createFormSection('', [
            this.createFormActions([
                this.createFormButton('Apply', onClick, 'Filter items as per the settings in the dialog.', 'derpapply'),
                this.createFormButton('Reset', () => {
                    localStore.retrieve()
                    onClick()
                }, 'Restore and apply saved configuration.', 'derpreset'),
            ]),
        ])
        if (addTopPadding) {
            divFormActions.style.paddingTop = '10px'
        }
        return divFormActions
    }

    /**
     * @param {string} label
     * @param {Array} keyValuePairs
     * @param {*} defaultValue
     * @return {HTMLElement}
     */
    createSettingsDropDownFormGroup (label, keyValuePairs, defaultValue = null)
    {
        let dropdownID = this._selectorGenerator.getSettingsInputSelector(label)

        return this.createFormGroup([
            this.createFormGroupLabel(label, dropdownID, 'text'),
            this.createFormGroupDropdown(dropdownID, keyValuePairs, defaultValue),
        ])
    }

    /**
     * @return {HTMLButtonElement}
     */
    createSettingsHideButton ()
    {
        let section = this._section
        return this.createFormButton('<< Hide', () => section.style.display = 'none')
    }

    /**
     * @param {string} caption
     * @param {HTMLElement} settingsSection
     * @param {boolean} fixed
     * @param {EventListenerOrEventListenerObject|Function|null} onMouseLeave
     * @return {HTMLButtonElement}
     */
    createSettingsShowButton (caption, settingsSection, fixed = true, onMouseLeave = null)
    {
        let controlButton = document.createElement('button')
        controlButton.textContent = caption
        controlButton.classList.add('show-settings')

        if (fixed) {
            controlButton.classList.add('fixed')
        }
        controlButton.addEventListener('click', () => {
            let settingsUI = document.getElementById(settingsSection.id)
            settingsUI.style.display = settingsUI.style.display === 'none' ? 'block' : 'none'
        })
        settingsSection.addEventListener('mouseleave', onMouseLeave ? () => onMouseLeave() : () => settingsSection.style.display = 'none')

        return controlButton
    }

    /**
     * @param {string} statisticsType
     * @param {string} label
     * @return {HTMLElement}
     */
    createStatisticsFormGroup (statisticsType, label = '')
    {
        if (label === '') {
            label = statisticsType
        }
        return this.createFormGroup([
            this.createFormGroupLabel(label + ' Filter'),
            this.createFormGroupStatLabel(statisticsType),
        ])
    }

    /**
     * @return {HTMLElement}
     */
    createStatisticsTotalsGroup ()
    {
        return this.createFormGroup([
            this.createFormGroupLabel('Total'),
            this.createFormGroupStatLabel('Total'),
        ])
    }

    /**
     * @return {HTMLElement|HTMLDivElement}
     */
    createStatusSection ()
    {
        this._statusLine = this.createFormGroupLabel('')
        this._statusLine.id = this._selectorGenerator.getSelector('status')

        return this.createFormSection('', [this._statusLine])
    }

    /**
     * @param {LocalStore} localStore
     * @return {HTMLElement}
     */
    createStoreFormSection (localStore)
    {
        return this.createFormSection('Cached Configuration', [
            this.createFormActions([
                this.createFormSectionButton(
                    'Update', 'Save UI settings in store', () => localStore.save(), 'Saves applied settings.'),
                this.createFormSectionButton(
                    'Purge', 'Purge store', () => localStore.delete(), 'Removes saved settings. Settings will then be sourced from the defaults defined in the script.'),
            ]),
        ])
    }

    /**
     * @param {string} tabName
     * @return {HTMLButtonElement}
     */
    createTabButton (tabName)
    {
        let button = document.createElement('button')
        button.classList.add('tab-button')
        button.textContent = tabName
        button.addEventListener('click', (event) => {

            let button = event.currentTarget
            let tabsSection = button.closest('.tabs-section')
            let tabToOpen = tabsSection.querySelector('#' + toKebabCase(tabName))

            for (let tabButton of tabsSection.querySelectorAll('.tab-button')) {
                tabButton.classList.remove('active')
            }
            for (let tabPanel of tabsSection.querySelectorAll('.tab-panel')) {
                tabPanel.classList.remove('active')
            }

            button.classList.add('active')
            tabToOpen.classList.add('active')
        })
        return button
    }

    /**
     * @param {string} tabName
     * @param {HTMLElement[]} children
     * @return {HTMLElement|HTMLDivElement}
     */
    createTabPanel (tabName, children)
    {
        let panel = document.createElement('div')
        panel.id = toKebabCase(tabName)
        panel.classList.add('tab-panel')

        return UIGenerator.populateChildren(panel, children)
    }

    /**
     * @param {string[]} tabNames
     * @param {HTMLElement[]} tabPanels
     * @return {HTMLElement|HTMLDivElement}
     */
    createTabsSection (tabNames, tabPanels)
    {
        let wrapper = document.createElement('div')
        wrapper.classList.add('tabs-section')

        let tabsDiv = document.createElement('div')
        tabsDiv.classList.add('tabs-nav')

        let tabButtons = []
        for (let tabName of tabNames) {
            tabButtons.push(this.createTabButton(tabName))
        }

        UIGenerator.populateChildren(tabsDiv, tabButtons)
        UIGenerator.populateChildren(wrapper, [tabsDiv, ...tabPanels])
        tabButtons[0].click()

        return wrapper
    }

    /**
     * @param {string} label
     * @return {HTMLElement}
     */
    getSettingsInput (label)
    {
        return document.getElementById(this._selectorGenerator.getSettingsInputSelector(label))
    }

    /**
     * @param {string} label
     * @return {boolean}
     */
    getSettingsInputCheckedStatus (label)
    {
        return this.getSettingsInput(label).checked
    }

    /**
     * @param {string} label
     * @return {*}
     */
    getSettingsInputValue (label)
    {
        return this.getSettingsInput(label).value
    }

    /**
     * @param {string} label
     * @param {boolean} getMinInput
     * @return {HTMLElement}
     */
    getSettingsRangeInput (label, getMinInput)
    {
        return document.getElementById(this._selectorGenerator.getSettingsRangeInputSelector(label, getMinInput))
    }

    /**
     * @param {string} label
     * @param {boolean} getMinInputValue
     * @return {*}
     */
    getSettingsRangeInputValue (label, getMinInputValue)
    {
        return this.getSettingsRangeInput(label, getMinInputValue).value
    }

    resetStatus ()
    {
        this._statusLine.textContent = this._statusText
    }

    /**
     * @param {string} label
     * @param {boolean} bool
     */
    setSettingsInputCheckedStatus (label, bool)
    {
        this.getSettingsInput(label).checked = bool
    }

    /**
     * @param {string} label
     * @param {*} value
     */
    setSettingsInputValue (label, value)
    {
        this.getSettingsInput(label).value = value
    }

    /**
     * @param {string} label
     * @param {number} lowerBound
     * @param {number} upperBound
     */
    setSettingsRangeInputValue (label, lowerBound, upperBound)
    {
        this.getSettingsRangeInput(label, true).value = lowerBound
        this.getSettingsRangeInput(label, false).value = upperBound
    }

    /**
     * @param {string} status
     * @param {boolean} transient
     */
    updateStatus (status, transient = false)
    {
        if (!transient) {
            this._statusText = status
        }
        this._statusLine.textContent = status
    }
}

class Validator
{
    static iFramesRemover ()
    {
        GM_addStyle(' iframe { display: none !important; } ')
    }

    /**
     * @param {StatisticsRecorder} statisticsRecorder
     */
    constructor (statisticsRecorder)
    {
        /**
         * @type {Array}
         * @private
         */
        this._filters = []

        /**
         * @type {RegExp|null}
         * @private
         */
        this._optimizedBlacklist = null

        /**
         * @type {Object}
         * @private
         */
        this._optimizedSanitizationRules = {}

        /**
         * @type {StatisticsRecorder}
         * @private
         */
        this._statisticsRecorder = statisticsRecorder
    }

    _buildWholeWordMatchingRegex (words)
    {
        let patternedWords = []
        for (let i = 0; i < words.length; i++) {
            patternedWords.push('\\b' + words[i] + '\\b')
        }
        return new RegExp('(' + patternedWords.join('|') + ')', 'gi')
    }

    /**
     * @param {string} text
     * @return {string}
     */
    sanitize (text)
    {
        for (const substitute in this._optimizedSanitizationRules) {
            text = text.replace(this._optimizedSanitizationRules[substitute], substitute)
        }
        return text.trim()
    }

    /**
     * @param {HTMLElement} textNode
     * @return {Validator}
     */
    sanitizeTextNode (textNode)
    {
        textNode.textContent = this.sanitize(textNode.textContent)
        return this
    }

    /**
     * @param {string} selector
     * @return {Validator}
     */
    sanitizeNodeOfSelector (selector)
    {
        let node = document.querySelector(selector)
        if (node) {
            let sanitizedText = this.sanitize(node.textContent)
            node.textContent = sanitizedText
            document.title = sanitizedText
        }
        return this
    }

    /**
     * @param {string[]} blacklistedWords
     * @return {Validator}
     */
    setBlacklist (blacklistedWords)
    {
        this._optimizedBlacklist = blacklistedWords.length ? this._buildWholeWordMatchingRegex(blacklistedWords) : null
        return this
    }

    /**
     * @param {Object} sanitizationRules
     * @return {Validator}
     */
    setSanitizationRules (sanitizationRules)
    {
        for (const substitute in sanitizationRules) {
            this._optimizedSanitizationRules[substitute] = this._buildWholeWordMatchingRegex(sanitizationRules[substitute])
        }
        return this
    }

    /**
     * @param {string} text
     * @return {boolean}
     */
    validateBlackList (text)
    {
        let validationCheck = true

        if (this._optimizedBlacklist) {
            validationCheck = text.match(this._optimizedBlacklist) === null
            this._statisticsRecorder.record('Blacklist', validationCheck)
        }
        return validationCheck
    }

    /**
     * @param {string} name
     * @param {Node|HTMLElement} item
     * @param {string} selector
     * @return {boolean}
     */
    validateNodeExistence (name, item, selector)
    {
        let validationCheck = item.querySelector(selector) !== null
        this._statisticsRecorder.record(name, validationCheck)

        return validationCheck
    }

    /**
     * @param {string} name
     * @param {Node|HTMLElement} item
     * @param {string} selector
     * @return {boolean}
     */
    validateNodeNonExistence (name, item, selector)
    {
        let validationCheck = item.querySelector(selector) === null
        this._statisticsRecorder.record(name, validationCheck)

        return validationCheck
    }

    /**
     * @param {string} name
     * @param {number} value
     * @param {number[]} bounds
     * @return {boolean}
     */
    validateRange (name, value, bounds)
    {
        let validationCheck = true

        if (bounds[0] > 0 && bounds[1] > 0) {
            validationCheck = value >= bounds[0] && value <= bounds[1]
        } else {
            if (bounds[0] > 0) {
                validationCheck = value >= bounds[0]
            }
            if (bounds[1] > 0) {
                validationCheck = value <= bounds[1]
            }
        }
        this._statisticsRecorder.record(name, validationCheck)

        return validationCheck
    }

    /**
     * @param {string} name
     * @param {number} lowerBound
     * @param {number} upperBound
     * @param getValueCallback
     * @return {boolean}
     */
    validateRangeFilter (name, lowerBound, upperBound, getValueCallback)
    {
        if (lowerBound > 0 || upperBound > 0) {
            return this.validateRange(name, getValueCallback(), [lowerBound, upperBound])
        }
        return true
    }
}

class PresetSwitcher
{
    /**
     * @param {string} scriptPrefix
     * @param {Object} defaultPreset
     * @param {Object} globalConfiguration
     */
    static create (scriptPrefix, defaultPreset, globalConfiguration)
    {
        return new PresetSwitcher(scriptPrefix, defaultPreset, globalConfiguration)
    }

    /**
     * @param {string} scriptPrefix
     * @param {Object} defaultPreset
     * @param {Object} globalConfiguration
     */
    constructor (scriptPrefix, defaultPreset, globalConfiguration)
    {
        /**
         * @type {Object}
         * @private
         */
        this._appliedPreset = null

        /**
         * @type {Object}
         * @private
         */
        this._defaultPreset = defaultPreset

        /**
         * {LocalStore}
         */
        this._globalConfigurationStore = LocalStore.createGlobalConfigStore(scriptPrefix, globalConfiguration)

        /**
         * {Object}
         */
        this._globalConfiguration = this._globalConfigurationStore.retrieve().get()

        /**
         * @type {LocalStore}
         * @private
         */
        this._presetsStore = LocalStore.createPresetConfigStore(scriptPrefix, defaultPreset)

        /**
         * @type {{name: string, config: Object}[]}
         * @private
         */
        this._presets = this._presetsStore.retrieve().get()

        /**
         * @type {string}
         * @private
         */
        this._scriptPrefix = scriptPrefix
    }

    /**
     * @param {string} name
     * @param {Object} config
     * @return {this}
     */
    createPreset (name, config)
    {
        this._presets.push({
            name: name,
            config: config,
        })
        this._presetsStore.update(this._presets)
        return this
    }

    /**
     * @param {string} name
     * @return {this}
     */
    deletePreset (name)
    {
        for (let i = 0; i < this._presets.length; i++) {
            if (this._presets[i].name === name) {
                this._presets.splice(i, 1)
                this._presetsStore.update(this._presets)
                break
            }
        }
        return this
    }

    /**
     * @param name
     * @return {{name: string, config: Object}|null}
     */
    findPreset (name)
    {
        for (let preset of this._presets) {
            if (preset.name === name) {
                return preset
            }
        }
        return null
    }

    /**
     * @return {{name: string, config: Object}}
     */
    getAppliedPreset ()
    {
        return this._appliedPreset
    }
}

class BaseHandler
{
    static initialize ()
    {
        BaseHandler.throwOverrideError()
        //return (new XNXXSearchFilters).init()
    }

    static throwOverrideError ()
    {
        throw new Error('override this method')
    }

    /**
     * @param {string} scriptPrefix
     * @param {string} itemClass
     * @param {Object} settingsDefaults
     */
    constructor (scriptPrefix, itemClass, settingsDefaults)
    {
        settingsDefaults.disableItemComplianceValidation = false
        settingsDefaults.showUIAlways = false

        /**
         * Array of item compliance filters ordered in intended sequence of execution
         * @type {Function[]}
         * @protected
         */
        this._complianceFilters = []

        /**
         * @type {string}
         * @protected
         */
        this._itemClass = itemClass

        /**
         * Operations to perform after script initialization
         * @type {Function}
         * @protected
         */
        this._onAfterInitialization = null

        /**
         * Operations to perform after UI generation
         * @type {Function}
         * @protected
         */
        this._onAfterUIBuild = null

        /**
         * Operations to perform before UI generation
         * @type {Function}
         * @protected
         */
        this._onBeforeUIBuild = null

        /**
         * Operations to perform after compliance checks, the first time a item is retrieved
         * @type {Function}
         * @protected
         */
        this._onFirstHitAfterCompliance = null

        /**
         * Operations to perform before compliance checks, the first time a item is retrieved
         * @type {Function}
         * @protected
         */
        this._onFirstHitBeforeCompliance = null

        /**
         * Get item lists from the page
         * @type {Function}
         * @protected
         */
        this._onGetItemLists = null

        /**
         * Logic to hide a non-compliant item
         * @type {Function}
         * @protected
         */
        this._onItemHide = (item) => {item.style.display = 'none'}

        /**
         * Logic to show compliant item
         * @type {Function}
         * @protected
         */
        this._onItemShow = (item) => {item.style.display = 'inline-block'}

        /**
         * Retrieve settings from UI and update settings object
         * @type {Function}
         * @private
         */
        this._onSettingsApply = null

        /**
         * Settings to update in the UI or elsewhere when settings store is updated
         * @type {Function}
         * @protected
         */
        this._onSettingsStoreUpdate = null

        /**
         * Must return the generated settings section node
         * @type {Function}
         * @protected
         */
        this._onUIBuild = null

        /**
         * Validate initiating initialization.
         * Can be used to stop script init on specific pages or vice versa
         * @type {Function}
         * @protected
         */
        this._onValidateInit = () => true

        /**
         * @type {string}
         * @private
         */
        this._scriptPrefix = scriptPrefix

        /**
         * Local storage store with defaults
         * @type {LocalStore}
         * @protected
         */
        this._settingsStore = new LocalStore(this._scriptPrefix + 'settings', settingsDefaults)

        /**
         * @type {Object}
         * @protected
         */
        this._settings = this._settingsStore.retrieve().get()

        /**
         * @type {StatisticsRecorder}
         * @protected
         */
        this._statistics = new StatisticsRecorder(this._scriptPrefix)

        /**
         * @type {UIGenerator}
         * @protected
         */
        this._uiGen = new UIGenerator(this._settings.showUIAlways, this._scriptPrefix)

        /**
         * @type {Validator}
         * @protected
         */
        this._validator = (new Validator(this._statistics))
    }

    /**
     * @param {Function} eventHandler
     * @param {*} parameters
     * @return {null|NodeListOf<HTMLElement>|*}
     * @private
     */
    _callEventHandler (eventHandler, ...parameters)
    {
        if (eventHandler) {
            return eventHandler(...parameters)
        }
        return null
    }

    /**
     * Filters items as per settings
     * @param {HTMLElement|NodeList<HTMLElement>} itemsList
     * @protected
     */
    _complyItemsList (itemsList)
    {
        for (let item of this._getItemsFromItemsList(itemsList)) {

            if (typeof item.scriptProcessedOnce === 'undefined') {
                item.scriptProcessedOnce = false
                this._callEventHandler(this._onFirstHitBeforeCompliance, item)
            }

            this._validateItemCompliance(item)

            if (!item.scriptProcessedOnce) {
                this._callEventHandler(this._onFirstHitAfterCompliance, item)
                item.scriptProcessedOnce = true
            }

            this._statistics.updateUI()
        }
    }

    /**
     * @protected
     */
	 
    _createSettingsFormActions ()
    {
        return this._uiGen.createSettingsFormActions(this._settingsStore, () => {
            this._callEventHandler(this._onSettingsApply)
            this._statistics.reset()
            for (let itemsList of this._callEventHandler(this._onGetItemLists)) {
                this._complyItemsList(itemsList)
            }
        })
    }

    /**
     * @param {HTMLElement|null} UISection
     * @private
     */
    _embedUI (UISection)
    {
        if (UISection) {
            this._uiGen.constructor.appendToBody(UISection)
            this._uiGen.constructor.appendToBody(this._uiGen.createSettingsShowButton('', UISection, true, () => {
                if (!this._settings.showUIAlways) {
                    UISection.style.display = 'none'
                }
            }))
            this._callEventHandler(this._onSettingsStoreUpdate)
        }
    }

    /**
     * @param {HTMLElement|NodeList<HTMLElement>} itemsList
     * @return {NodeListOf<HTMLElement>|HTMLElement[]}
     * @protected
     */
    _getItemsFromItemsList (itemsList)
    {
        let items = []
        if (itemsList instanceof NodeList) {
            itemsList.forEach((node) => {
                if (typeof node.classList !== 'undefined' && node.classList.contains(this._itemClass)) {
                    items.push(node)
                }
            })
        } else {
            items = itemsList.querySelectorAll('.' + this._itemClass)
        }
        return items
    }

    /**
     * @param {Object} sanitizationRules
     * @return {string}
     * @protected
     */
    _transformSanitizationRulesToText (sanitizationRules)
    {
        let sanitizationRulesText = []
        for (let substitute in sanitizationRules) {
            sanitizationRulesText.push(substitute + '=' + sanitizationRules[substitute].join(','))
        }
        return sanitizationRulesText.join('\n')
    }

    /**
     * @param {string[]} strings
     * @protected
     */
    _trimAndKeepNonEmptyStrings (strings)
    {
        let nonEmptyStrings = []
        for (let string of strings) {
            string = string.trim()
            if (string !== '') {
                nonEmptyStrings.push(string)
            }
        }
        return nonEmptyStrings
    }

    /**
     * @param {string[]} blacklistedWords
     * @protected
     */
    _validateAndSetBlacklistedWords (blacklistedWords)
    {
        this._settings.blacklist = this._trimAndKeepNonEmptyStrings(blacklistedWords)
        this._validator.setBlacklist(this._settings.blacklist)
    }

    /**
     * @param {string[]} sanitizationRules
     * @protected
     */
    _validateAndSetSanitizationRules (sanitizationRules)
    {
        let fragments, validatedTargetWords
        this._settings.sanitize = {}

        for (let sanitizationRule of sanitizationRules) {
            if (sanitizationRule.includes('=')) {

                fragments = sanitizationRule.split('=')
                if (fragments[0] === '') {
                    fragments[0] = ' '
                }

                validatedTargetWords = this._trimAndKeepNonEmptyStrings(fragments[1].split(','))
                if (validatedTargetWords.length) {
                    this._settings.sanitize[fragments[0]] = validatedTargetWords
                }
            }
        }
        this._validator.setSanitizationRules(this._settings.sanitize)
    }

    /**
     * @param {HTMLElement|Node} item
     * @protected
     */
    _validateItemCompliance (item)
    {
        let itemComplies = true

        if (!this._settings.disableItemComplianceValidation) {
            for (let complianceFilter of this._complianceFilters) {
                if (!complianceFilter(item)) {
                    itemComplies = false
                    break
                }
            }
        }
        itemComplies ? this._callEventHandler(this._onItemShow, item) : this._callEventHandler(this._onItemHide, item)
    }

    /**
     * Initialize the script and do basic UI removals
     */
    init ()
    {
        try {
            if (this._callEventHandler(this._onValidateInit)) {

                this._callEventHandler(this._onBeforeUIBuild)
                this._embedUI(this._callEventHandler(this._onUIBuild))
                this._callEventHandler(this._onAfterUIBuild)

                for (let itemsList of this._callEventHandler(this._onGetItemLists)) {
                    ChildObserver.create().onNodesAdded((itemsAdded) => this._complyItemsList(itemsAdded)).observe(itemsList)
                    this._complyItemsList(itemsList)
                }



                this._callEventHandler(this._onAfterInitialization)

                this._settingsStore.onChange(() => this._callEventHandler(this._onSettingsStoreUpdate))
            }
        } catch (error) {
            console.error(this._scriptPrefix + 'script encountered an error: ' + error)
        }
    }
}