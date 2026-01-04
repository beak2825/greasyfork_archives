let createdListeners = [];
const create = {
  actionMenu: (options = {}) => {
    const classAm = options.class || ``;
    const trigger = options.trigger || {};
    const dataAlignment = options[`data-alignment`] || `start`;
    if (!options.trigger) {
      options.trigger = {};
    }
    if (!options.trigger.class) {
      options.trigger.class = `dds__button--secondary`;
    }
    if (!options.trigger.text) {
      options.trigger.text = `Actions`;
    }
    const id = options.id || `actionMenu${create.random()}`;
    const useChevron = options.useChevron || false;

    const noo = {};
    noo.actionMenu = create.element(`div`, {
      id: id,
      class: `dds__action-menu ${classAm}`,
      'data-trigger': `#${id}--trigger`,
      'data-dds': `action-menu`,
      'data-alignment': dataAlignment,
    });
    noo.trigger = create.element(`button`, {
      id: noo.actionMenu.getAttribute(`data-trigger`).replace(`#`, ''),
      type: `button`,
      class: `dds__button ${trigger.class}`,
    });
    noo.trigger.appendChild(create.element(`span`, {
      class: `ddsc__action-menu__trigger-label`,
      text: trigger.text
    }));
    if (useChevron) {
      const handleActionClick = (e) => {
        e.target.querySelector(`.dds__icon`).classList.toggle(`action-rotated`);
      }
      noo.chevron = create.element(`i`, {
        class: `dds__icon dds__icon--chevron-down action-chevron`,
      });
      noo.trigger.appendChild(noo.chevron);
      create.listener(`#${id}`, `ddsActionMenuOpenEvent`, handleActionClick);
      create.listener(`#${id}`, `ddsActionMenuCloseEvent`, handleActionClick);
    }
    noo.container = create.element(`div`, {
      class: `dds__action-menu__container`,
      tabindex: `-1`,
      role: `presentation`,
      'aria-hidden': `true`,
    });
    noo.menu = create.element(`div`, {
      class: `dds__action-menu__menu`,
      role: `menu`,
      tabindex: `-1`,
    });
    noo.menuLi = create.element(`li`, {
      role: `presentation`,
    });
    noo.group = create.element(`span`, {
      id: `${id}--group`
    });
    noo.groupUl = create.element(`ul`, {
      id: `${id}--groupUl`,
      class: `ddsc__action-menu--groupUl`,
      role: `group`,
      'aria-labelledby': noo.group.getAttribute(`id`)
    });
    noo.actionMenu.appendChild(noo.trigger);
    noo.actionMenu.appendChild(noo.container);
    noo.container.appendChild(noo.menu);
    noo.menu.appendChild(noo.menuLi);
    noo.menuLi.appendChild(noo.group);
    noo.group.appendChild(noo.groupUl);
    // Adding a method to the element doesn't seem to be work
    // const observerDefs = [
    //     {
    //       selector: `#${id}`,
    //       callback: (elem) => {
    //         elem.addItem = (itemOptions) => {
    //             document.getElementById(`${id}--groupUl`).appendChild(create.actionMenuItem(itemOptions));
    //         };
    //       }
    //     }
    //   ];
    // createObserver(observerDefs);
    return noo.actionMenu;
  },
  actionMenuItem: (options = {}) => {
    const noo = {};
    const label = options.text || `Item Text`;
    const asOption = options[`data-value`] != null || false;
    const dataValue = options[`data-value`] || undefined;
    const itemClass = options.class || ``;
    const id = `${label.replace(/[^0-9a-zA-Z]+/, ``)}_${create.random()}`;
    noo.item = create.element(`li`, {
      class: asOption ? `dds__action-menu__option` : `dds__action-menu__item`,
      role: `none`,
    });
    noo.itemButton = create.element(`button`, {
      id: id,
      type: `button`,
      class: itemClass,
      role: asOption ? `menuitemcheckbox` : `menuitem`,
      tabindex: `-1`,
      'aria-disabled': `false`,
      'aria-checked': `false`,
      'data-value': dataValue,
    });
    noo.itemSvg = create.element(`svg`, {
      class: `dds__action-menu__icon`,
      'aria-hidden': `true`,
    });
    noo.itemSvgUse = create.element(`use`, {
      'xlink:href': `#dds__icon--copy-alt`,
    });
    noo.itemText = create.element(`span`, {
      class: `ddsc__action-menu__span`,
      text: label,
    });
    noo.item.appendChild(noo.itemButton);
    noo.itemButton.appendChild(noo.itemSvg);
    noo.itemButton.appendChild(noo.itemText);
    noo.itemSvg.appendChild(noo.itemSvgUse);
    if (options.onclick) {
      create.listener(`#${id}`, `click`, options.onclick);
    }
    return noo.item;
  },
  button: (options = {}) => {
    const noo = {};
    const id = options.id || `button_${create.random()}`;
    const chevron = options.chevron || {};
    const bClass = options.class || ``;
    const bText = options.text || `Button`;
    const iconIsString = options.icon && typeof options.icon === `string`;
    const iconObjectName = !iconIsString && options.icon ? options.icon.name : undefined;
    const iconObjectClass = !iconIsString && options.icon && options.icon.class ? options.icon.class : ``;
    const bIcon = {
      name: iconIsString ? options.icon : iconObjectName,
      class: iconObjectClass
    };
    noo.button = create.element(`button`, {
      id: id,
      class: `dds__button ${bClass}`,
      type: `button`,
      text: bText,
    });
    if (bIcon.name) {
      noo.icon = create.element(`i`, {
        class: `dds__icon dds__icon--${bIcon.name} ${bIcon.class}`,
        'aria-hidden': `true`,
      });
      if (options.icon.class.indexOf(`--end`) > -1) {
        noo.button.appendChild(noo.icon);
      } else {
        noo.button.prepend(noo.icon);
      }
    }
    if (options.onclick) {
      create.listener(`#${id}`, `click`, options.onclick);
    }
    if (chevron.use) {
      const handleActionClick = (e) => {
        document.getElementById(id).querySelector(`.dds__icon`).classList.toggle(`action-rotated`);
      }
      noo.chevron = create.element(`i`, {
        class: `dds__icon dds__icon--chevron-down action-chevron`,
      });
      noo.button.appendChild(noo.chevron);
      create.listener(chevron.open.selector, chevron.open.event, handleActionClick);
      create.listener(chevron.close.selector, chevron.close.event, handleActionClick);
    }
    return noo.button;
  },
  badge: (options = {}) => {
    const noo = {};
    const id = options.id || `badge_${create.random()}`;
    const label = options.label || ``;
    const componentClass = options.class || ``;

    noo.component = create.element(`span`, {
      id: id,
      class: `dds__badge ${componentClass}`,
    });
    noo.label = create.element(`span`, {
      class: `dds__badge__label`,
      text: label,
    });

    noo.component.appendChild(noo.label);
    return noo.component;
  },
  element: (nodeType, props) => {
    const domNode = document.createElement(nodeType);
    if (props && "object" === typeof props) {
      for (const prop in props) {
        if (prop === "html") {
          domNode.innerHTML = props[prop];
        } else if (prop === "text") {
          domNode.textContent = props[prop];
        } else {
          if (prop.slice(0, 5) === "aria_" || prop.slice(0, 4) === "data_") {
            const attr = prop.slice(0, 4) + "-" + prop.slice(5);
            domNode.setAttribute(attr, props[prop]);
          } else {
            domNode.setAttribute(prop, props[prop]);
          }
        }
        // Set attributes on the element if passed
        if (["role", "aria-label"].includes(prop)) domNode.setAttribute(prop, props[prop]);
      }
    }
    return domNode;
  },
  checkbox: (options = {}) => {
    const noo = {};
    const id = options.id || `checkbox_${create.random()}`;
    const label = options.label || ``;
    const componentClass = options.class || ``;
    const getCheckboxEl = () => {
      const thisCheckbox = document.getElementById(noo.input.id);
      if (!thisCheckbox) {
        console.error(`Element #${noo.input.id} was not found`);
        return;
      }
      return thisCheckbox;
    }

    // create new components
    noo.component = create.element(`div`, {
      id: id,
      class: `dds__checkxbox ${componentClass}`,
    });
    noo.label = create.element(`label`, {
      id: `${id}--label`,
      class: `dds__checkbox__label`,
      for: `${id}--input`,
    });
    noo.input = create.element(`input`, {
      type: `checkbox`,
      tabindex: `0`,
      id: `${id}--input`,
      name: `${id}--name`,
      class: `dds__checkbox__input`,
    });
    if (options.value) noo.input.value = options.value;
    if (options.checked) noo.input.setAttribute(`checked`, options.checked);
    if (options.required) noo.input.setAttribute(`required`, true);
    noo.content = create.element(`span`, {
      id: `${id}--content`,
      html: label,
    });
    noo.error = create.element(`div`, {
      id: `${id}--error`,
      class: `dds__invalid-feedback`,
      text: options.error,
    });

    // append new elements together
    noo.component.appendChild(noo.label);
    noo.component.appendChild(noo.error);
    noo.label.appendChild(noo.input);
    noo.label.appendChild(noo.content);

    // add methods
    noo.component.indeterminate = (state) => {
      // must return to verify this method
      if (!state) {
        console.error(`indeterminate: must pass state`);
        return;
      }
      const thisCheckbox = getCheckboxEl();
      thisCheckbox.indeterminate = state;
      thisCheckbox.setAttribute(`aria-checked`, state ? `mixed` : `false`);
    };
    noo.component.check = (state = true) => {
      const thisCheckbox = getCheckboxEl();
      thisCheckbox.checked = state;
      thisCheckbox.setAttribute(`aria-checked`, state);
    };
    if (options.onclick) {
      create.listener(`#${noo.input.id}`, `change`, options.onclick);
    }


    // return base component
    return noo.component;
  },
  dropdown: (options = {}) => {
    const noo = {};
    const id = options.id || `dropdown_${create.random()}`;
    const componentClass = options.class || ``;
    const selection = options.selection || `single`;
    const dropdownLabel = options.label || ``;
    const selectAllLabel = options.selectAllLabel || `Select All`;
    const autocomplete = options.autocomplete ? 'on' : `off`;

    noo.component = create.element(`div`, {
      id: id,
      class: `dds__dropdown ${componentClass}`,
      'data-dds': `dropdown`,
      'data-selection': selection,
      'data-select-all-label': selectAllLabel,
    });
    noo.container = create.element(`div`, {
      class: `dds__dropdown__input-container`,
    });
    noo.label = create.element(`label`, {
      id: `${id}--label`,
      for: `${id}--input`,
      html: dropdownLabel,
    });
    noo.wrapper = create.element(`div`, {
      class: `dds__dropdown__input-wrapper`,
      role: `combobox`,
      'aria-haspopup': `listbox`,
      'aria-controls': `${id}--popup`,
      'aria-expanded': false,
    });
    noo.input = create.element(`input`, {
      id: `${id}--input`,
      name: `${id}--name`,
      type: `text`,
      class: `dds__dropdown__input-field`,
      autocomplete: autocomplete,
      'aria-labelledby': `${id}--label ${id}--helper`,
      'aria-expanded': false,
      'aria-controls': `${id}--list`,
      placeholder: options.placeholder || ``,
    });
    noo.feedback = create.element(`i`, {
      class: `dds__icon dds__icon--alert-notice dds__dropdown__feedback__icon`,
      'aria-hidden': true,
    });
    noo.helper = create.element(`small`, {
      id: `${id}--helper`,
      class: `dds__input-text__helper ${!options.helper ? `dds__d-none` : ``}`,
      text: options.helper,
    });
    noo.error = create.element(`div`, {
      id: `${id}--error`,
      class: `dds__invalid-feedback ${!options.error ? `dds__d-none` : ``}`,
      text: options.error,
    });
    noo.popup = create.element(`div`, {
      id: `${id}--popup`,
      class: `dds__dropdown__popup dds__dropdown__popup--hidden`,
      role: `presentation`,
      tabindex: `-1`,
    });
    noo.list = create.element(`ul`, {
      id: `${id}--list`,
      tabindex: `-1`,
      role: `listbox`,
      class: `dds__dropdown__list`,
    });

    noo.component.appendChild(noo.container);
    noo.container.appendChild(noo.label);
    noo.component.appendChild(noo.wrapper);
    noo.wrapper.appendChild(noo.input);
    noo.wrapper.appendChild(noo.feedback);
    noo.wrapper.appendChild(noo.helper);
    noo.wrapper.appendChild(noo.error);
    noo.component.appendChild(noo.popup);
    noo.popup.appendChild(noo.list);
    return noo.component;
  },
  dropdownItem: (options = {}) => {
    const noo = {};
    const label = options.text || `Item Text`;
    const dataValue = options[`data-value`] || undefined;
    const id = options.id || `${label.replace(/[^0-9a-zA-Z]+/, ``)}_${create.random()}`;
    const isSelected = options.selected == `true` ? true : false;
    noo.item = create.element(`li`, {
      class: `dds__dropdown__item`,
      role: `option`,
    });
    noo.itemButton = create.element(`button`, {
      id: id,
      type: `button`,
      class: `dds__dropdown__item-option`,
      role: `option`,
      tabindex: `-1`,
      'data-selected': isSelected,
    });
    if (dataValue) {
      noo.itemButton.setAttribute('data-value', dataValue);
    }
    noo.itemText = create.element(`span`, {
      class: `dds__dropdown__item-label`,
      text: label,
    });
    noo.item.appendChild(noo.itemButton);
    noo.itemButton.appendChild(noo.itemText);
    if (options.onclick) {
      create.listener(`#${id}`, `click`, options.onclick);
    }
    return noo.item;
  },
  listener: function (selector, event, handler) {
    let rootElement = document.querySelector('body');
    const listenerId = `${selector}__${event}`;
    const listenerExists = createdListeners.includes(listenerId);
    const listenerInstance = function (evt) {
      var targetElement = evt.target;
      while (targetElement != null) {
        if (targetElement.matches(selector)) {
          handler(evt);
          return;
        }
        targetElement = targetElement.parentElement;
      }
    };
    if (!listenerExists) {
      createdListeners.push(listenerId);
      rootElement.addEventListener(event, listenerInstance, true);
    }
  },
  popover: (options = {}) => {
    const noo = {};
    const id = options.id || `popover_${create.random()}`;
    const dataTrigger = options['data-trigger'] || undefined;
    const dataPlacement = options['data-placement'] || `bottom-end`;
    const classPo = options.class || ``;
    const callback = options.callback || undefined;
    const arrow = options.arrow === undefined ? true : options.arrow;
    const close = options.close === undefined ? true : options.close;
    if (!dataTrigger) {
      console.error(`Send a data-trigger with a value like "#your-element-id"`);
      return;
    }
    if (!arrow) {
      // if (dataPlacement.indexOf(`bottom`) > -1) {
      //     create.style(`#${id} { top: -12px;}`);
      // } else if (dataPlacement.indexOf(`top`) > -1) {
      //     create.style(`#${id} { top: 12px;}`);
      // } else if (dataPlacement.indexOf(`left`) > -1) {
      //     create.style(`#${id} { left: 12px;}`);
      // } else if (dataPlacement.indexOf(`right`) > -1) {
      //     create.style(`#${id} { left: -12px;}`);
      // }
      create.style(`#${id} .dds__popover__pointer { display: none !important;}`);
    }
    if (!close) {
      create.style(`#${id} .dds__popover__close { display: none !important;}`);
    }
    if (!options.title) {
      create.style(`#${id} .dds__popover__header { display: none !important;}`);
    }
    noo.popover = create.element(`div`, {
      id: id,
      class: `dds__popover ${classPo}`,
      role: `dialog`,
      'aria-labelledby': `${id}--title`,
      'data-placement': dataPlacement,
      'data-dds': `popover`,
      'data-trigger': dataTrigger,
    });
    noo.content = create.element(`div`, {
      class: `dds__popover__content`,
    });
    noo.header = create.element(`div`, {
      class: `dds__popover__header`,
    });
    noo.headline = create.element(`h6`, {
      id: `${id}--title`,
      class: `dds__popover__headline`,
      text: options.title,
    });
    noo.body = create.element(`div`, {
      class: `dds__popover__body`,
      text: options.body,
    });
    if (callback) {
      callback(noo.body);
    }
    noo.popover.appendChild(noo.content);
    noo.content.appendChild(noo.header);
    noo.content.appendChild(noo.body);
    noo.header.appendChild(noo.headline);
    return noo.popover;
  },
  radioButton: (options = {}) => {
    const noo = {};
    const id = options.id || `radiobutton_${create.random()}`;
    const componentClass = options.class || ``;
    const legend = options.legend || ``;
    noo.radioset = create.element(`fieldset`, {
      class: `dds__fieldset dds__radio-button-group ${componentClass}`,
      role: `radiogroup`,
    });
    if (options.required) {
      noo.radioset.setAttribute(`required`, true);
      noo.radioset.setAttribute(`aria-required`, true);
    }
    noo.legend = create.element(`legend`, {
      text: legend,
    })
    if (legend) noo.radioset.appendChild(noo.legend);
    options.buttons.forEach((radio, rIndex) => {
      const radioClass = radio.class || ``;
      const radioValue = radio.value || ``;
      const radioLabel = radio.label || ``;
      noo.button = create.element(`div`, {
        class: `dds__radio-button ${radioClass}`,
      });
      noo.input = create.element(`input`, {
        class: `dds__radio-button__input`,
        type: `radio`,
        name: `${id}--button-name`,
        id: `${id}--button${rIndex}`,
        value: radioValue,
      });
      noo.label = create.element(`label`, {
        class: `dds__radio-button__label`,
        id: `${id}--button-label${rIndex}`,
        for: `${id}--button${rIndex}`,
        text: radioLabel,
      });
      noo.button.appendChild(noo.input);
      noo.button.appendChild(noo.label);
      noo.radioset.appendChild(noo.button);
    });
    noo.error = create.element(`div`, {
      id: `${id}--error`,
      class: `dds__invalid-feedback`,
      text: options.error || ``,
    });
    noo.radioset.appendChild(noo.error);
    return noo.radioset;
  },
  random: (min = 100000000, max = 999999999) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  },
  style: (styles) => {
    /* Create style document */
    var css = document.createElement('style');
    css.type = 'text/css';
    if (css.styleSheet)
      css.styleSheet.cssText = styles;
    else
      css.appendChild(document.createTextNode(styles));
    /* Append style to the tag name */
    document.getElementsByTagName("head")[0].appendChild(css);
  },
  tag: (options = {}) => {
    const noo = {};
    const id = options.id || `textinput_${create.random()}`;
    const componentClass = options.class || ``;
    const dismiss = options.dismiss == `true` || `false`;

    noo.tag = create.element(`div`, {
      id: id,
      class: `dds__tag ${componentClass}`,
      'data-dds': `tag`,
      'data-dismiss': options.dismiss || false,
      'data-sr-dismiss': options.dismiss ? `dismiss` : ``,
    });
    noo.button = create.element(`button`, {
      type: `button`,
      text: options.label || `Tag`,
    });
    noo.tag.appendChild(noo.button);
    if (options.onclick) {
      create.listener(`#${id}`, `click`, options.onclick);
    }
    return noo.tag;
  },
  textInput: (options = {}) => {
    const noo = {};
    const id = options.id || `textinput_${create.random()}`;
    const componentClass = options.class || ``;
    const icon = options.icon || ``;
    const iconStart = options.iconStart || true;
    noo.container = create.element(`div`, {
      id: id,
      class: `dds__input-text__container ${componentClass}`,
    });
    noo.label = create.element(`label`, {
      id: `${id}--label`,
      for: `${id}--input`,
      text: options.label,
    });
    noo.wrapper = create.element(`div`, {
      class: `dds__input-text__wrapper`,
    });
    noo.input = create.element(`input`, {
      id: `${id}--input`,
      type: `text`,
      class: `dds__input-text ${icon ? iconStart ? `dds__has__icon--start` : ` dds__has__icon--end` : ``}`,
      name: `${id}--input`,
      placeholder: options.placeholder || ``,
      'aria-labelledby': `${id}--label ${id}--helper`,
    });
    if (options.required) {
      noo.input.setAttribute(`required`, true);
    }
    if (options[`max-length`]) {
      noo.input.setAttribute(`max-length`, options[`max-length`]);
    }
    noo.icon = create.element(`i`, {
      class: `dds__icon dds__icon--${icon || `search`} dds__input-text__icon--${iconStart ? `start` : `end`}`,
      'aria-hidden': true,
    });
    noo.helper = create.element(`small`, {
      id: `${id}--helper`,
      class: `dds__input-text__helper ${!options.helper ? `dds__d-none` : ``}`,
      text: options.helper,
    });
    noo.error = create.element(`div`, {
      id: `${id}--error`,
      class: `dds__invalid-feedback ${!options.error ? `dds__d-none` : ``}`,
      text: options.error,
    });
    if (!options.helper) {
      create.style(`#${id} { margin-top: -12px; margin-bottom: 9px;}`);
    }
    noo.container.appendChild(noo.label);
    noo.container.appendChild(noo.wrapper);
    noo.wrapper.appendChild(noo.input);
    if (icon) noo.wrapper.appendChild(noo.icon);
    noo.wrapper.appendChild(noo.helper);
    noo.wrapper.appendChild(noo.error);
    return noo.container;
  },
  tooltip: (options = {}) => {
    const noo = {};
    const id = options.id || `tooltip_${create.random()}`;
    const componentClass = options.class || ``;
    const icon = options.icon ? `dds__icon--${options.icon.replace('dds__icon--', '')}` : `dds__icon--alert-info-cir`;
    const title = options.title || ``;
    const tip = options.tip || `No options.tip was found.`;

    noo.container = create.element(`span`, {});  
    noo.anchor = create.element(`a`, {
        id: `anchor-${id}`,
        href: `javascript:void(0);`,
        class: `dds__link--standalone ${componentClass}`,
        'aria-describedby': `tooltip-${id}`,
    });
    noo.anchorSr = create.element(`span`, {
        id: `anchorSr-${id}`,
        class: `dds__sr-only`,
        text: `tooltip`,
    });
    noo.anchorIcon = create.element(`i`, {
        id: `anchorIcon-${id}`,
        class: `dds__icon ${icon}`,
    });
    noo.tooltip = create.element(`div`, {
      id: id,
      class: `dds__tooltip`,
      role: `tooltip`,
      'data-dds': `tooltip`,
      'data-trigger': `#anchor-${id}`,
    });
    noo.body = create.element(`div`, {
      class: `dds__tooltip__body`,
      text: tip
    });
    noo.bodyTitle = create.element(`h6`, {
        class: `dds__tooltip__title`,
        text: title,
    });
    
    noo.container.appendChild(noo.anchor);
    noo.anchor.appendChild(noo.anchorSr);
    noo.anchor.appendChild(noo.anchorIcon);

    noo.container.appendChild(noo.tooltip);
    noo.tooltip.appendChild(noo.body);
    noo.body.prepend(noo.bodyTitle);

    return noo.container;
  },
}
