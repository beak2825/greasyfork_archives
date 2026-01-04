// ==UserScript==
// @name         Brazen UI Generator
// @namespace    brazenvoid
// @version      3.0.0
// @author       brazenvoid
// @license      GPL-3.0-only
// @description  Helper methods to generate a control panel UI for scripts
// @grant        GM_addStyle
// ==/UserScript==

/**
 * @function GM_addStyle
 * @param {string} style
 */
GM_addStyle(
    `@keyframes brazen-fade{from{opacity:0}to{opacity:1}}#bv-resizer{align-items:center;background-color:white;border-radius:3px;box-shadow:3px 3px 10px rgba(0, 0, 0, 0.5);cursor:ew-resize;display:flex;height:18px;justify-content:center;position:absolute;right:10px;transition:background 0.3s ease;width:25px;z-index:5}#bv-resizer:hover{background-color:lightgrey}#bv-resizer-icon{color:black;font-size:100%;pointer-events:none}#bv-ui{backdrop-filter: blur(10px);background:rgba(255, 255, 255, 0.1);border-bottom-right-radius:8px;border-left:0;border-top-right-radius:8px;bottom:5vh;box-shadow:0 2px 8px rgba(0, 0, 0, 0.5);box-sizing:border-box;opacity:0.3;overflow:auto;top:5vh;z-index:1001}#bv-ui:hover{opacity:1}#restore-settings.bv-input{margin-bottom:1rem}.show-settings.bv-section{border:2px solid white;border-radius:5px;box-shadow:0 0 20px white;padding:8px;top:5vh}.bv-actions{display:inline-flex;justify-content:center;padding:0 0.25rem;text-align:center}.bv-actions .bv-button{width:auto}.bv-bg-colour{background-color:#4f535b}.bv-border-primary{border:1px solid black}.bv-break{margin:0.5rem 0}.bv-button{background-color:revert;padding:0.5rem 1rem;width:100%}.bv-flex-column{flex-direction:column}.bv-font-primary{color:white}.bv-font-secondary{color:black}.bv-group{align-items:center;display:flex;min-height:20px}.bv-group + .bv-group{margin-top:1rem}.bv-group.bv-range-group,.bv-group.bv-text-group{align-items:center}.bv-group.bv-range-group > input{width:75px}.bv-group.bv-range-group > input + input{margin-left:5px}.bv-group.bv-textarea-group{align-items:start;flex-direction:column;overflow:hidden}.bv-group.bv-textarea-group > textarea.bv-input{margin-top:0.5rem;resize:vertical;width:100%}input.bv-input,select.bv-input,textarea.bv-input{box-sizing:border-box;margin:0;padding:0.5rem}.bv-input.bv-checkbox-radio{margin-right:5px;scale:2}.bv-input.bv-text{width:100%}.bv-label{flex-grow:1;text-align:start}.bv-label.bv-text + .bv-input.bv-text{width:40%}.bv-section{display:flex;flex-direction:column;font-family:"roboto";font-size:1rem;font-weight:normal;left:0;padding:1rem;position:fixed;z-index:1000}.bv-section > .bv-bottom-section{display:flex;flex-direction:column;margin-top:auto}.bv-section > div + div{margin-top:1rem}.bv-section hr{border:1px solid white;margin:1rem 0}.bv-section button + button{margin-left:0.25rem}.bv-section .bv-title{display:block;height:20px;margin-bottom:1rem;text-align:center;width:100%}.bv-show-settings{border:0;font-size:0.7rem;height:90vh;left:0;margin:0;padding:0;position:fixed;top:5vh;width:0.2vw;writing-mode:sideways-lr;z-index:999}.bv-show-settings .bv-title{display:block;height:20px;width:100%}.bv-tab-button{background-color:inherit;border-bottom:0;border-top-left-radius:3px;border-top-right-radius:3px;cursor:pointer;outline:none;padding:0.5rem 0.75rem;transition:0.3s}.bv-tab-button.bv-active,.bv-tab-button:hover{background-color:white;color:black}.bv-tab-panel{animation:brazen-fade 1s;display:none;flex-direction:column;padding:1rem}.bv-tab-panel.bv-active{display:flex}.bv-tabs-nav{display:flex;flex-wrap:wrap;overflow:hidden}`)

class BrazenUIGenerator
{
  /**
   * @type {boolean}
   * @private
   */
  _resizing = false

  /**
   * @type {JQuery}
   * @private
   */
  _section = null

  /**
   * @type {SelectorGenerator}
   * @private
   */
  _selectorGenerator

  /**
   * @type {string}
   * @private
   */
  _selectorPrefix

  /**
   * @param {string} selectorPrefix
   */
  constructor(selectorPrefix)
  {
    this._selectorGenerator = new SelectorGenerator(selectorPrefix)
    this._selectorPrefix = selectorPrefix
  }

  /**
   * @param {JQuery} nodes
   */
  static appendToBody(nodes)
  {
    $('body').append(nodes)
  }

  /**
   * @param {JQuery[]} children
   * @return {JQuery}
   */
  createBottomSection(children)
  {
    return $('<div class="bv-bottom-section">').append(...children)
  }

  /**
   * @return {JQuery}
   */
  createBreakSeparator()
  {
    return $('<br class="bv-break"/>')
  }

  /**
   * @return {JQuery}
   */
  createContainer()
  {
    this._section = $('<section class="bv-section bv-font-primary">')
    return this._section
  }

  /**
   * @param {JQuery|JQuery[]} children
   * @param {string} wrapperClasses
   * @return {JQuery}
   */
  createFormActions(children, wrapperClasses = '')
  {
    return $('<div class="bv-actions"/>').addClass(wrapperClasses).append(children)
  }

  /**
   * @param {string} caption
   * @param {JQuery.EventHandler} onClick
   * @param {string} hoverHelp
   * @return {JQuery}
   */
  createFormButton(caption, hoverHelp, onClick)
  {
    return $('<button class="bv-button">').attr('title', hoverHelp).text(caption).on('click', onClick)
  }

  createFormCheckBoxesGroupSection(label, keyValuePairs, hoverHelp)
  {
    let section = this.createFormSection(label).addClass('bv-checkboxes-group').attr('title', hoverHelp)
    for (const element of keyValuePairs) {
      section.append(
          this.createFormGroup().append([
            this.createFormGroupLabel(element[0], 'checkbox'),
            this.createFormGroupInput('checkbox').attr('data-value', element[1]),
          ]),
      )
    }
    return section
  }

  /**
   * @return {JQuery}
   */
  createFormGroup()
  {
    return $('<div class="bv-group"/>')
  }

  /**
   * @param {string} id
   * @param {Array} keyValuePairs
   *
   * @return {JQuery}
   */
  createFormGroupDropdown(id, keyValuePairs)
  {
    let dropdown = $('<select>').attr('id', id).addClass('bv-input')

    for (let i = 0; i < keyValuePairs.length; i++) {
      dropdown.append($('<option>').attr('value', keyValuePairs[i][0]).text(keyValuePairs[i][1]).prop('selected', (i === 0)))
    }
    return dropdown
  }

  /**
   * @param {string} type
   *
   * @return {JQuery}
   */
  createFormGroupInput(type)
  {
    let input = $('<input class="bv-input">').attr('type', type)
    switch (type) {
      case 'number':
      case 'text':
        input.addClass('bv-text')
        break

      case 'radio':
      case 'checkbox':
        input.addClass('bv-checkbox-radio')
        break
    }
    return input
  }

  /**
   * @param {string} label
   * @param {string} inputType
   * @return {JQuery}
   */
  createFormGroupLabel(label, inputType = '')
  {
    let labelFormGroup = $('<label class="bv-label">').text(label)
    if (inputType !== '') {
      switch (inputType) {
        case 'number':
        case 'text':
          labelFormGroup.addClass('bv-text')
          labelFormGroup.text(labelFormGroup.text() + ': ')
          break
        case 'radio':
        case 'checkbox':
          labelFormGroup.addClass('bv-checkbox-radio')
          break
      }
    }
    return labelFormGroup
  }

  /**
   * @param {string} statisticType
   * @return {JQuery}
   */
  createFormGroupStatLabel(statisticType)
  {
    return $('<label class="bv-stat-label">').attr('id', this._selectorGenerator.getStatLabelSelector(statisticType)).text('0')
  }

  /**
   * @param {string} label
   * @param {string} inputType
   * @param {string} hoverHelp
   * @return {JQuery}
   */
  createFormInputGroup(label, inputType, hoverHelp = '')
  {
    return this.createFormGroup().attr('title', hoverHelp).append([
      this.createFormGroupLabel(label, inputType),
      this.createFormGroupInput(inputType),
    ])
  }

  createFormRadiosGroupSection(label, keyValuePairs, hoverHelp)
  {
    let section = this.createFormSection(label).addClass('bv-radios-group').attr('title', hoverHelp)
    for (let i = 0; i < keyValuePairs.length; i++) {
      section.append(
          this.createFormGroup().append([
            this.createFormGroupLabel(keyValuePairs[i][0], 'radio'),
            this.createFormGroupInput('radio').prop('checked', i === 0).attr('data-value', keyValuePairs[i][1]).on('change', (event) => {
              $(event.currentTarget).parents('.bv-radios-group').first().find('input').each((index, element) => {
                if (!element.isSameNode(event.currentTarget)) {
                  $(element).prop('checked', false)
                }
              })
            }),
          ]),
      )
    }
    return section
  }

  /**
   * @param {string} label
   * @param {string} inputsType
   * @param {number} minimum
   * @param {number} maximum
   * @param {string} hoverHelp
   * @return {JQuery}
   */
  createFormRangeInputGroup(label, inputsType, minimum, maximum, hoverHelp)
  {
    return this.createFormGroup().addClass('bv-range-group').attr('title', hoverHelp).append([
      this.createFormGroupLabel(label, inputsType),
      this.createFormGroupInput(inputsType).attr('min', minimum).attr('max', maximum),
      this.createFormGroupInput(inputsType).attr('min', minimum).attr('max', maximum),
    ])
  }

  /**
   * @param {string} title
   * @return {JQuery}
   */
  createFormSection(title = '')
  {
    return $('<div>').append($('<label class="bv-title">').text(title))
  }

  /**
   * @param {string} label
   * @param {int} rows
   * @param {string} hoverHelp
   * @return {JQuery}
   */
  createFormTextAreaGroup(label, rows, hoverHelp = '')
  {
    return this.createFormGroup().attr('title', hoverHelp).addClass('bv-textarea-group').append([
      this.createFormGroupLabel(label),
      $('<textarea class="bv-input" spellcheck="false">').attr('rows', rows),
    ])
  }

  createResizer()
  {
    return $('<div id="bv-resizer" title="Resize"><span id="bv-resizer-icon">↔</span></div>').
        on('mousedown', (event) => {

          event.preventDefault()
          this._resizing = true

          let resizeHorizontal = (event) => {
            this._section[0].style.width = Math.max(150, event.clientX - this._section[0].getBoundingClientRect().left) + `px`
          }

          let stopResize = () => {
            removeEventListener('mousemove', resizeHorizontal)
            removeEventListener('mouseup', stopResize)
          }

          addEventListener('mousemove', resizeHorizontal)
          addEventListener('mouseup', stopResize)

        }).
        on('mouseup', (event) => {
          this._resizing = false
        })
  }

  /**
   * @return {JQuery}
   */
  createSeparator()
  {
    return $('<hr/>')
  }

  /**
   * @return {JQuery}
   */
  createSettingsHideButton()
  {
    return this.createFormButton('<< Hide', '', () => this._section.css('display', 'none'))
  }

  /**
   * @return {JQuery}
   */
  createSettingsSection()
  {
    return this.createContainer().
        attr('id', 'bv-ui').
        addClass('bv-bg-colour').
        hide().
        append(this.createResizer())
  }

  /**
   * @param {string} caption
   * @param {JQuery} settingsSection
   *
   * @return {JQuery}
   */
  createSettingsShowButton(caption, settingsSection)
  {
    return $('<button class="show-settings bv-section bv-bg-colour">').
        text(caption).
        on('click', () => settingsSection.slideDown(300))
  }

  /**
   * @param {string} statisticsType
   * @param {string} label
   * @return {JQuery}
   */
  createStatisticsFormGroup(statisticsType, label = '')
  {
    return this.createFormGroup().addClass('bv-stat-group').append([
      this.createFormGroupLabel((label === '' ? statisticsType : label) + ' Filter'),
      this.createFormGroupStatLabel(statisticsType),
    ])
  }

  /**
   * @return {JQuery}
   */
  createStatisticsTotalsGroup()
  {
    return this.createFormGroup().append([
      this.createFormGroupLabel('Total'),
      this.createFormGroupStatLabel('Total'),
    ])
  }

  /**
   * @param {string} tabName
   * @param {boolean} isFirst
   * @return {JQuery}
   */
  createTabButton(tabName, isFirst)
  {
    let tabButton = $('<button class="bv-tab-button bv-border-primary">').
        text(tabName).
        on('click', (event) => {

          let button = $(event.currentTarget)
          let tabSection = button.parents('.bv-tabs-section:first')

          tabSection.find('.bv-tab-button').removeClass('bv-active bv-font-secondary').addClass('bv-font-primary')

          tabSection.find('.bv-tab-panel').removeClass('bv-active')

          button.removeClass('bv-font-primary').addClass('bv-active bv-font-secondary')

          $('#' + Utilities.toKebabCase(button.text())).addClass('bv-active')
        }).
        on('mouseenter', (event) => $(event.currentTarget).addClass('bv-font-secondary')).
        on('mouseleave', (event) => $(event.currentTarget).removeClass('bv-font-secondary'))

    return isFirst ? tabButton.addClass('bv-active bv-font-secondary') : tabButton.addClass('bv-font-primary')
  }

  /**
   * @param {string} tabName
   * @param {boolean} isFirst
   * @return {JQuery}
   */
  createTabPanel(tabName, isFirst = false)
  {
    let tabPanel = $('<div class="bv-tab-panel bv-border-primary">').attr('id', Utilities.toKebabCase(tabName))
    if (isFirst) {
      tabPanel.addClass('bv-active')
    }
    return tabPanel
  }

  /**
   * @param {string[]} tabNames
   * @param {JQuery[]} tabPanels
   * @return {JQuery}
   */
  createTabsSection(tabNames, tabPanels)
  {
    let tabButtons = []
    for (let i = 0; i < tabNames.length; i++) {
      tabButtons.push(this.createTabButton(tabNames[i], i === 0))
    }
    let nav = $('<div class="bv-tabs-nav">').append(tabButtons)
    return $('<div class="bv-tabs-section">').append(nav).append(...tabPanels)
  }

  /**
   * @param {string} title
   * @return {JQuery}
   */
  createTitle(title)
  {
    return $('<label class="bv-title">' + title + '</label>')
  }

  /**
   * @return {JQuery}
   */
  getSelectedSection()
  {
    return this._section
  }

  isSettingsPaneBeingResized()
  {
    return this._resizing
  }
}