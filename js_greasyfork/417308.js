// ==UserScript==
// @name        f95zone tweaks
// @namespace   f95zone tweaks
// @description f95zone exclude tags and min like filter.
// @match       https://f95zone.to/sam/latest_alpha/
// @license     GNU GPLv3
// @version     2.0.1
// @author      3xd_Tango
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @require     https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js
// @run-at      document-idle
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/417308/f95zone%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/417308/f95zone%20tweaks.meta.js
// ==/UserScript==

(async () => {
(function (web, lodash, solidJs, store$1) {
'use strict';

var css_248z$1 = ".customTags{border-radius:2px;box-shadow:0 0 0 0 transparent,0 1px 1px 0 rgba(0,0,0,.15),0 1px 2px 0 rgba(0,0,0,.15);display:inline-block;font-size:.8em;line-height:1.8em;margin:4px 4px 0 0;padding:0 6px;text-shadow:1px 1px 2px rgba(0,0,0,.75)}.selected-tags-wrap span:hover{background-color:#ba4545}.selected-tags-wrap span{background-color:#181a1d;border-radius:3px;cursor:pointer;display:inline-block;font-size:.9em;line-height:24px;margin:4px 4px 0 0;padding:0 7px;transition:.2s}.input-tag{left:0;opacity:1;position:relative;width:127px}.border-gradient{border:3px solid;border-image-slice:1}.flxgrow{flex-grow:1}.solid-select-multi-value{background-color:#181a1d;border-radius:3px;display:inline-block;font-size:.9em;gap:5px;line-height:24px;margin:4px 4px 0 0;padding:0 7px;transition:.2s}.solid-select-multi-value-remove{background-color:#ba4545;background-color:#953737;border:none;border-radius:2px;cursor:pointer}.solid-select-list{background:#181a1b;z-index:2}.select-likes.select-likes{border:1px solid grey;margin-bottom:5px;padding:5px}";

var css_248z = ".solid-select-container[data-disabled=true]{pointer-events:none}.solid-select-container{position:relative}.solid-select-control[data-disabled=true]{--tw-bg-opacity:1;--tw-border-opacity:1;background-color:rgba(243,244,246,var(--tw-bg-opacity));border-color:rgba(209,213,219,var(--tw-border-opacity))}.solid-select-control{--tw-border-opacity:1;border-color:rgba(229,231,235,var(--tw-border-opacity));border-radius:.25rem;border-width:1px;display:-ms-grid;display:grid;grid-template-columns:repeat(1,minmax(0,1fr));line-height:1.5;padding:.25rem .5rem}.solid-select-control[data-multiple=true][data-has-value=true]{-webkit-box-align:stretch;-ms-flex-align:stretch;grid-gap:.25rem;-webkit-align-items:stretch;align-items:stretch;display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex;-ms-flex-wrap:wrap;-webkit-flex-wrap:wrap;flex-wrap:wrap;gap:.25rem}.solid-select-control:focus-within{--tw-outline-opacity:1;outline-color:rgba(209,213,219,var(--tw-outline-opacity))}.solid-select-placeholder{--tw-text-opacity:1;color:rgba(156,163,175,var(--tw-text-opacity))}.solid-select-placeholder,.solid-select-single-value{grid-column-start:1;grid-row-start:1}.solid-select-multi-value{--tw-bg-opacity:1;-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center;background-color:rgba(243,244,246,var(--tw-bg-opacity));border-radius:.25rem;display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex;font-size:85%;line-height:1;line-height:inherit;padding-left:4px;padding-right:4px}.solid-select-multi-value-remove{padding-left:.25rem;padding-right:.25rem}.solid-select-multi-value-remove:hover{text-shadow:1px 1px 3px rgba(0,0,0,.29),2px 4px 7px rgba(73,64,125,.35)}.solid-select-input{-webkit-box-flex:1;background-color:initial;border-width:0;caret-color:transparent;-ms-flex:1 1 0%;-webkit-flex:1 1 0%;flex:1 1 0%;font:inherit;grid-column-start:1;grid-row-start:1;margin:0;outline:2px solid transparent;outline-offset:2px;padding:0}.solid-select-input:read-only{cursor:default}.solid-select-input[data-is-active=true],.solid-select-input[data-multiple=true]{caret-color:currentColor}.solid-select-list{--tw-shadow:0 10px 15px -3px rgb(0 0 0/0.1),0 4px 6px -4px rgb(0 0 0/0.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color),0 4px 6px -4px var(--tw-shadow-color);background-color:inherit;border-radius:.125rem;-webkit-box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow);margin-top:.25rem;max-height:50vh;min-width:100%;overflow-y:auto;padding:.5rem;position:absolute;white-space:nowrap;z-index:1}.solid-select-option:hover{--tw-bg-opacity:1;background-color:rgba(229,231,235,var(--tw-bg-opacity))}.solid-select-option[data-focused=true]{--tw-bg-opacity:1;background-color:rgba(243,244,246,var(--tw-bg-opacity))}.solid-select-option>mark{--tw-bg-opacity:1;--tw-text-opacity:1;background-color:rgba(unset,var(--tw-bg-opacity));color:rgba(unset,var(--tw-text-opacity));-webkit-text-decoration-line:underline;text-decoration-line:underline}.solid-select-option{cursor:default;padding:.5rem 1rem;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.solid-select-option[data-disabled=true]{--tw-text-opacity:1;color:rgba(156,163,175,var(--tw-text-opacity));pointer-events:none}.solid-select-list-placeholder{cursor:default;padding:.5rem 1rem;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}";

const likes = GM_getValue('likes', [{
  name: 'incest',
  tag: '30',
  color: '#ff0000'
}, {
  name: 'harem',
  tag: '254',
  color: '#0011ff'
}, {
  name: 'futa/trans',
  tag: '191',
  color: '#EE82EE'
}, {
  name: 'loli',
  tag: '639',
  color: '#00f5ffff'
}, {
  name: 'futa/trans protagonist',
  tag: '2255',
  color: '#EE82EE'
}]);
const dislikes = GM_getValue('dislikes', [{
  name: 'female protagonist',
  tag: '392'
}, {
  name: 'text based',
  tag: '522'
}, {
  name: 'mind control',
  tag: '111'
}]);
const totalTags = GM_getValue('tags', [['2d game', '2214'], ['2dcg', '1507'], ['3d game', '1434'], ['3dcg', '107'], ['adventure', '162'], ['ahegao', '916'], ['anal sex', '2241'], ['animated', '783'], ['bdsm', '264'], ['bestiality', '105'], ['big ass', '817'], ['big tits', '130'], ['blackmail', '339'], ['bukkake', '216'], ['censored', '2247'], ['character creation', '2246'], ['cheating', '924'], ['combat', '550'], ['corruption', '103'], ['cosplay', '606'], ['creampie', '278'], ['dating sim', '348'], ['dilf', '1407'], ['drugs', '2217'], ['dystopian setting', '2249'], ['exhibitionism', '384'], ['fantasy', '179'], ['female domination', '2252'], ['female protagonist', '392'], ['footjob', '553'], ['furry', '382'], ['futa/trans', '191'], ['futa/trans protagonist', '2255'], ['gay', '360'], ['graphic violence', '728'], ['groping', '535'], ['group sex', '498'], ['handjob', '259'], ['harem', '254'], ['horror', '708'], ['humiliation', '871'], ['humor', '361'], ['incest', '30'], ['internal view', '1483'], ['interracial', '894'], ['japanese game', '736'], ['kinetic novel', '1111'], ['lactation', '290'], ['lesbian', '181'], ['loli', '639'], ['male domination', '174'], ['male protagonist', '173'], ['management', '449'], ['masturbation', '176'], ['milf', '75'], ['mind control', '111'], ['mobile game', '2229'], ['monster', '182'], ['monster girl', '394'], ['multiple endings', '322'], ['multiple penetration', '1556'], ['multiple protagonist', '2242'], ['necrophilia', '1828'], ['netorare', '258'], ['no sexual content', '324'], ['oral sex', '237'], ['paranormal', '408'], ['parody', '505'], ['platformer', '1508'], ['point &amp; click', '1525'], ['possession', '1476'], ['pov', '1766'], ['pregnancy', '225'], ['prostitution', '374'], ['puzzle', '1471'], ['rape', '417'], ['real porn', '1707'], ['religion', '2218'], ['romance', '330'], ['rpg', '45'], ['sandbox', '2257'], ['scat', '689'], ['school setting', '547'], ['sci-fi', '141'], ['sex toys', '2216'], ['sexual harassment', '670'], ['shooter', '1079'], ['shota', '749'], ['side-scroller', '776'], ['simulator', '448'], ['sissification', '2215'], ['slave', '44'], ['sleep sex', '1305'], ['spanking', '769'], ['strategy', '628'], ['stripping', '480'], ['superpowers', '354'], ['swinging', '2234'], ['teasing', '351'], ['tentacles', '215'], ['text based', '522'], ['titfuck', '411'], ['trainer', '199'], ['transformation', '875'], ['trap', '362'], ['turn based combat', '452'], ['twins', '327'], ['urination', '1254'], ['vaginal sex', '2209'], ['virgin', '833'], ['virtual reality', '895'], ['voiced', '1506'], ['vore', '757'], ['voyeurism', '485']]);

function checkTags(element, dataTags) {
  const dislikeGM = GM_getValue('dislikes', dislikes);
  let tagProt = ['female protagonist', 'male protagonist', 'futa/trans protagonist'];
  const tagProtNames = dislikeGM.filter(e => e.name.includes('protagonist'));
  const b = [];
  let c = 0;
  dataTags.forEach(e => {
    if (tagProtNames.length >= 1) {
      if (tagProtNames.some(t => t.tag === e)) {
        return b.push(e);
      }
    }
    if (dislikeGM.some(d => d.tag.includes(e))) {
      c += 1;
    }
  });
  if (c > 0) {
    return true;
  }
  if (b.length > 0) {
    b.forEach(e => {
      tagProt = tagProt.filter(r => r !== e);
    });
    for (let i = 0; i <= tagProt.length - 1; i++) {
      console.debug(`datatags includes? = ${dataTags.includes(tagProt[i])} for ${tagProt[i]} `);
      if (dataTags.includes(tagProt[i])) {
        return false;
      }
      if (i === tagProt.length - 1) {
        return true;
      }
    }
  }
  console.debug(`tagProt = ${tagProt}`);
  return false;
}

function dislikeFilter() {
  const element = document.querySelectorAll('.resource-tile');
  for (let i = 0; i < element.length; i++) {
    const dataTags = element[i].dataset.tags.split(',');
    const isFP = checkTags(element[i], dataTags);
    if (isFP) {
      element[i].setAttribute('isDislike', 'true');
    } else {
      element[i].setAttribute('isDislike', 'false');
    }
  }
}

function filterOut() {
  const element = document.querySelectorAll('.resource-tile');
  for (let i = 0; i < element.length; i++) {
    if (element[i].getAttribute('isDislike') === 'true' || element[i].getAttribute('isLikeLimit') === 'true' || element[i].getAttribute('isIgnore') === 'true') {
      element[i].style.setProperty('display', 'none', 'important');
      element[i].style.setProperty('height', '0px', 'important');
      element[i].style.setProperty('margin', '0px', 'important');
    } else {
      element[i].style.setProperty('display', 'block', 'important');
      element[i].style.setProperty('height', 'unset', 'important');
      element[i].style.setProperty('margin', 'unset', 'important');
    }
  }
}

function likeFilter() {
  const element = document.querySelectorAll('.resource-tile');
  document.querySelectorAll('.customTags').forEach(e => e.parentNode.remove());
  for (let i = 0; i < element.length; i += 1) {
    element[i].style = '';
    element[i].classList.remove('border-gradient');
    element[i].setAttribute('isDisplay', 'false');
    const colors = [];
    const node = document.createElement('DIV');
    const dataTags = element[i].dataset.tags.split(',');
    node.style.padding = '.5rem 0';
    for (let j = likes.length - 1; j >= 0; j -= 1) {
      if (dataTags.includes(likes[j].tag)) {
        if (!element[i].classList.contains('border-gradient')) {
          element[i].classList.add('border-gradient');
        }
        const node1 = document.createElement('SPAN');
        colors.push(likes[j].color);
        node1.classList.add('customTags');
        node1.style.borderLeft = `${likes[j].color} solid`;
        node1.appendChild(document.createTextNode(likes[j].name));
        node.appendChild(node1);
        element[i].setAttribute('isDisplay', 'true');
      } else if (element[i].getAttribute('isDisplay') === null) {
        element[i].setAttribute('isDisplay', 'false');
      }
    }
    if (colors.length > 1) {
      element[i].style.borderImageSource = `linear-gradient(to bottom right, ${colors.toString()})`;
    } else {
      element[i].style.color = colors[0];
    }
    if (element[i].getAttribute('isDisplay') === 'true') {
      try {
        element[i].querySelector('div.resource-tile_info').appendChild(node);
      } catch (e) {
        console.error(e);
        setTimeout(likeFilter, 200);
      }
    }
  }
}

function likeLimit() {
  const element = document.querySelectorAll('.resource-tile_info');

  // if (likesLimit === '') {
  //   likesLimit = -1;
  // }

  for (let i = 0; i < element.length; i++) {
    const elementLikes = element[i].querySelector('div.resource-tile_info-meta_likes').innerText;
    // const elementName =
    //   element[i].childNodes[0].childNodes[0].childNodes[0].innerText;

    const checkFilter = Number(elementLikes) <= Number(GM_getValue('like_limit', 200));

    // console.debug(`we get Like limit of ${elementName} is ${elementLikes} with check ${checkFilter} with display attribute of ${(element[i].parentNode.parentNode.parentNode.getAttribute('isDisplay').toLowerCase() !== 'false')}`);

    if (checkFilter) {
      if (element[i].parentNode.parentNode.parentNode.getAttribute('isDisplay') === 'false') {
        element[i].parentNode.parentNode.parentNode.setAttribute('isLikeLimit', 'true');
        continue;
      }
      if (GM_getValue('favLikeFilter', false)) {
        element[i].parentNode.parentNode.parentNode.setAttribute('isLikeLimit', 'true');
        continue;
      }
    }
    element[i].parentNode.parentNode.parentNode.setAttribute('isLikeLimit', 'false');
  }
}

function tagRemoveHandler(event, isLikes) {
  let filtered = [];
  if (isLikes) {
    filtered = likes.filter(r => r.name !== event.target.textContent);
    console.debug(`You have clicked the Like Tag to Remove it and the filtered is: ${filtered} within ${likes}`);
    const removed = lodash.remove(likes, n => {
      return n.name === event.target.textContent;
    });
    console.debug(`after filtred you got likes tags: ${likes} and you removed ${removed}`);
    likeFilter();
    likeLimit();
  } else {
    filtered = dislikes.filter(r => r.name !== event.target.textContent);
    console.debug(`You have clicked the dislike Tag to Remove it and the filtered is: ${filtered} within ${dislikes}`);
    const removed = lodash.remove(dislikes, n => {
      return n.name === event.target.textContent;
    });
    console.debug(`after filtred you got dislike tags: ${dislikes} and you removed ${removed}`);
    dislikeFilter();
  }
  // event.target.remove();
  GM_setValue(isLikes ? 'likes' : 'dislikes', filtered);
  filterOut();
}

// function tagRemoveHandler1(event) {
//   likes = likes.filter(r => r[0] !== event.target.textContent);
//   event.target.remove();
//   GM_setValue('likes', likes);
//   likeFilter();
//   likeLimit();
//   filterOut();
// }

function clickTotalTags() {
  const y = document.querySelector('.selectize-control');
  if (!y) return;
  if (y.dataset.listenerAttached === 'true') return;
  y.dataset.listenerAttached = 'true';
  y.addEventListener('click', () => {
    const options = document.querySelectorAll('div.option');
    if (options.length === 0) return;
    const totalTags = Array.from(options).map(e => {
      var _e$firstChild$textCon, _e$firstChild, _e$dataset$value, _e$dataset;
      // Use firstChild?.textContent while guarding for null and trimming whitespace
      const text = ((_e$firstChild$textCon = (_e$firstChild = e.firstChild) == null ? void 0 : _e$firstChild.textContent) != null ? _e$firstChild$textCon : '').trim();
      const value = (_e$dataset$value = (_e$dataset = e.dataset) == null ? void 0 : _e$dataset.value) != null ? _e$dataset$value : '';
      return [text, value];
    });
    GM_setValue('tags', totalTags);
  });
}

function IgnoreFilter() {
  const element = document.querySelectorAll('.resource-tile');
  const isChecked = GM_getValue('ignoreThreadFilter', false);
  console.log(isChecked, typeof isChecked);
  for (let i = 0; i < element.length; i++) {
    const classNames = element[i].className;
    const isFP = classNames.includes('resource-tile_ignored');
    if (isFP && isChecked) {
      element[i].setAttribute('isIgnore', 'true');
    } else {
      element[i].setAttribute('isIgnore', 'false');
    }
  }
}

function init() {
  const element = document.querySelectorAll('.resource-tile');
  const elementLength = element.length;
  if (element[0]) {
    likeFilter();
    clickTotalTags();
    for (let i = 0; i < 3; i++) {
      IgnoreFilter();
      dislikeFilter();
      likeLimit();
      filterOut();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const filtered = _.filter(document.querySelectorAll('.resource-tile'), e => {
        return e.getAttribute('isDisplay') === 'true';
      });
      console.debug('Filtered', filtered);
      if (filtered.length < elementLength) {
        break;
      }
    }
  } else {
    setTimeout(init, 100);
  }
}

var _tmpl$$6 = /*#__PURE__*/web.template(`<div class=filter-block><h4 class=filter-block_title>Tags Like Limits</h4><div class=selectize-input><input autocomplete=off style=width:127px;>`);
function LikeLimitDisplay() {
  const onLimit = event => {
    GM_setValue('like_limit', event.target.value);
    likeLimit();
    filterOut();
  };
  return (() => {
    var _el$ = _tmpl$$6(),
      _el$2 = _el$.firstChild,
      _el$3 = _el$2.nextSibling,
      _el$4 = _el$3.firstChild;
    _el$4.addEventListener("change", onLimit);
    web.effect(() => _el$4.value = GM_getValue('like_limit', 200));
    return _el$;
  })();
}

var _tmpl$$5 = /*#__PURE__*/web.template(`<div class=filter-block><div class=filter-block_button-wrap><span class="filter-block_title flxgrow">Filter Fav likes:</span><input type=checkbox id=filter-fav-likes>`);
function FilterFavLikes() {
  const onChange = event => {
    GM_setValue('favLikeFilter', event.target.checked);
    likeLimit();
    filterOut();
  };
  return (() => {
    var _el$ = _tmpl$$5(),
      _el$2 = _el$.firstChild,
      _el$3 = _el$2.firstChild,
      _el$4 = _el$3.nextSibling;
    _el$2.style.setProperty("display", "flex");
    _el$4.addEventListener("change", onChange);
    web.effect(() => _el$4.checked = GM_getValue('favLikeFilter', false));
    return _el$;
  })();
}

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

const createSelect = props => {
  const config = solidJs.mergeProps({
    multiple: false,
    disabled: false,
    optionToValue: option => option,
    isOptionDisabled: option => false
  }, props);

  const parseValue = value => {
    if (config.multiple && Array.isArray(value)) {
      return value;
    } else if (!config.multiple && !Array.isArray(value)) {
      return value !== null ? [value] : [];
    } else {
      throw new Error(`Incompatible value type for ${config.multiple ? "multple" : "single"} select.`);
    }
  };

  const [_value, _setValue] = solidJs.createSignal(config.initialValue !== undefined ? parseValue(config.initialValue) : []);

  const value = () => config.multiple ? _value() : _value()[0] || null;

  const setValue = value => _setValue(parseValue(value));

  const clearValue = () => _setValue([]);

  const hasValue = () => !!(config.multiple ? value().length : value());

  solidJs.createEffect(solidJs.on(_value, () => config.onChange?.(value()), {
    defer: true
  }));
  const [inputValue, setInputValue] = solidJs.createSignal("");

  const clearInputValue = () => setInputValue("");

  const hasInputValue = () => !!inputValue().length;

  solidJs.createEffect(solidJs.on(inputValue, inputValue => config.onInput?.(inputValue), {
    defer: true
  }));
  solidJs.createEffect(solidJs.on(inputValue, inputValue => {
    if (inputValue && !isOpen()) {
      setIsOpen(true);
    }
  }, {
    defer: true
  }));
  const options = typeof config.options === "function" ? solidJs.createMemo(() => config.options(inputValue()), config.options(inputValue())) : () => config.options;

  const optionsCount = () => options().length;

  const pickOption = option => {
    if (config.isOptionDisabled(option)) return;
    const value = config.optionToValue(option);

    if (config.multiple) {
      setValue([..._value(), value]);
    } else {
      setValue(value);
      setIsActive(false);
    }

    setIsOpen(false);
  };

  const [isActive, setIsActive] = solidJs.createSignal(false);
  const [isOpen, setIsOpen] = solidJs.createSignal(false);

  const toggleOpen = () => setIsOpen(!isOpen());

  const [focusedOptionIndex, setFocusedOptionIndex] = solidJs.createSignal(-1);

  const focusedOption = () => options()[focusedOptionIndex()];

  const isOptionFocused = option => option === focusedOption();

  const focusOption = direction => {
    if (!optionsCount()) setFocusedOptionIndex(-1);
    const max = optionsCount() - 1;
    const delta = direction === "next" ? 1 : -1;
    let index = focusedOptionIndex() + delta;

    if (index > max) {
      index = 0;
    }

    if (index < 0) {
      index = max;
    }

    setFocusedOptionIndex(index);
  };

  const focusPreviousOption = () => focusOption("previous");

  const focusNextOption = () => focusOption("next");

  solidJs.createEffect(solidJs.on(options, options => {
    if (isOpen()) setFocusedOptionIndex(Math.min(0, options.length - 1));
  }, {
    defer: true
  }));
  solidJs.createEffect(solidJs.on(() => config.disabled, isDisabled => {
    if (isDisabled && isOpen()) {
      setIsOpen(false);
    }
  }));
  solidJs.createEffect(solidJs.on(isOpen, isOpen => {
    if (isOpen) {
      if (focusedOptionIndex() === -1) focusNextOption();
      setIsActive(true);
    } else {
      if (focusedOptionIndex() > -1) setFocusedOptionIndex(-1);
      setInputValue("");
    }
  }, {
    defer: true
  }));
  solidJs.createEffect(solidJs.on(focusedOptionIndex, focusedOptionIndex => {
    if (focusedOptionIndex > -1 && !isOpen()) {
      setIsOpen(true);
    }
  }, {
    defer: true
  }));

  const onFocusIn = () => setIsActive(true);

  const onFocusOut = () => {
    setIsActive(false);
    setIsOpen(false);
  };

  const onMouseDown = event => event.preventDefault();

  const onClick = event => {
    if (!config.disabled && !hasInputValue()) toggleOpen();
  };

  const onInput = event => {
    setInputValue(event.target.value);
  };

  const onKeyDown = event => {
    switch (event.key) {
      case "ArrowDown":
        focusNextOption();
        break;

      case "ArrowUp":
        focusPreviousOption();
        break;

      case "Enter":
        if (isOpen() && focusedOption()) {
          pickOption(focusedOption());
          break;
        }

        return;

      case "Escape":
        if (isOpen()) {
          setIsOpen(false);
          break;
        }

        return;

      case "Delete":
      case "Backspace":
        if (inputValue()) {
          return;
        }

        if (config.multiple) {
          const currentValue = value();
          setValue([...currentValue.slice(0, -1)]);
        } else {
          clearValue();
        }

        break;

      case " ":
        if (inputValue()) {
          return;
        }

        if (!isOpen()) {
          setIsOpen(true);
        } else {
          if (focusedOption()) {
            pickOption(focusedOption());
          }
        }

        break;

      case "Tab":
        if (focusedOption() && isOpen()) {
          pickOption(focusedOption());
          break;
        }

        return;

      default:
        return;
    }

    event.preventDefault();
    event.stopPropagation();
  };

  return {
    options,
    value,
    setValue,
    hasValue,
    clearValue,
    inputValue,
    setInputValue,
    hasInputValue,
    clearInputValue,
    isOpen,
    setIsOpen,
    toggleOpen,
    isActive,
    setIsActive,

    get multiple() {
      return config.multiple;
    },

    get disabled() {
      return config.disabled;
    },

    pickOption,
    isOptionFocused,
    isOptionDisabled: config.isOptionDisabled,
    onFocusIn,
    onFocusOut,
    onMouseDown,
    onClick,
    onInput,
    onKeyDown
  };
};

const _tmpl$$2$1 = /*#__PURE__*/web.template(`<mark></mark>`, 2);

const SCORING = {
  NO_MATCH: 0,
  MATCH: 1,
  WORD_START: 2,
  START: 3
};

const fuzzySearch = (value, target) => {
  let score = SCORING.NO_MATCH;
  let matches = [];

  if (value.length <= target.length) {
    const valueChars = Array.from(value.toLocaleLowerCase());
    const targetChars = Array.from(target.toLocaleLowerCase());
    let delta = SCORING.START;

    outer: for (let valueIndex = 0, targetIndex = 0; valueIndex < valueChars.length; valueIndex++) {
      while (targetIndex < targetChars.length) {
        if (targetChars[targetIndex] === valueChars[valueIndex]) {
          matches[targetIndex] = true;

          if (delta === SCORING.MATCH && targetChars[targetIndex - 1] === " " && targetChars[targetIndex] !== " ") {
            delta = SCORING.WORD_START;
          }

          score += delta;
          delta++;
          targetIndex++;
          continue outer;
        } else {
          delta = SCORING.MATCH;
          targetIndex++;
        }
      } // Didn't exhaust search value.


      score = SCORING.NO_MATCH;
      matches.length = 0;
    }
  }

  return {
    target,
    score,
    matches
  };
};

const fuzzyHighlight = (searchResult, highlighter = match => (() => {
  const _el$ = _tmpl$$2$1.cloneNode(true);

  web.insert(_el$, match);

  return _el$;
})()) => {
  const target = searchResult.target;
  const matches = searchResult.matches;
  const separator = "\x00";
  const highlighted = [];
  let open = false;

  for (let index = 0; index < target.length; index++) {
    const char = target[index];
    const matched = matches[index];

    if (!open && matched) {
      highlighted.push(separator);
      open = true;
    } else if (open && !matched) {
      highlighted.push(separator);
      open = false;
    }

    highlighted.push(char);
  }

  if (open) {
    highlighted.push(separator);
    open = false;
  }

  return web.memo(() => highlighted.join("").split(separator).map((part, index) => index % 2 ? highlighter(part) : part));
};

const fuzzySort = (value, items, key) => {
  const sorted = [];

  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    const target = item[key] ;
    const result = fuzzySearch(value, target);

    if (result.score) {
      sorted.push({ ...result,
        item,
        index
      });
    }
  }

  sorted.sort((a, b) => {
    let delta = b.score - a.score;

    if (delta === 0) {
      delta = a.index - b.index;
    }

    return delta;
  });
  return sorted;
};

const _tmpl$$1$1 = /*#__PURE__*/web.template(`<mark></mark>`, 2);

const createOptions = (values, userConfig) => {
  const config = Object.assign({
    filterable: true,
    disable: () => false
  }, userConfig || {});

  const getLabel = value => config?.key !== undefined ? value[config.key] : value;

  const options = inputValue => {
    const initialValues = typeof values === "function" ? values(inputValue) : values;
    let createdOptions = initialValues.map(value => {
      return {
        label: getLabel(value),
        value: value,
        disabled: config.disable(value)
      };
    });

    if (config.filterable && inputValue) {
      createdOptions = fuzzySort(inputValue, createdOptions, "label").map(result => ({ ...result.item,
        label: fuzzyHighlight(result)
      }));
    }

    if (config.createable !== undefined) {
      const trimmedValue = inputValue.trim();
      const exists = createdOptions.some(option => areEqualIgnoringCase(inputValue, getLabel(option.value)));

      if (trimmedValue && !exists) {
        let value;

        if (typeof config.createable === "function") {
          value = config.createable(trimmedValue);
        } else {
          value = config.key ? {
            [config.key]: trimmedValue
          } : trimmedValue;
        }

        const option = {
          label: ["Create ", (() => {
            const _el$ = _tmpl$$1$1.cloneNode(true);

            web.insert(_el$, () => getLabel(value));

            return _el$;
          })()],
          value,
          disabled: false
        };
        createdOptions = [...createdOptions, option];
      }
    }

    return createdOptions;
  };

  const optionToValue = option => option.value;

  const format = (item, type) => type === "option" ? item.label : getLabel(item);

  const isOptionDisabled = option => option.disabled;

  return {
    options,
    optionToValue,
    isOptionDisabled,
    format
  };
};

const areEqualIgnoringCase = (firstString, secondString) => firstString.localeCompare(secondString, undefined, {
  sensitivity: "base"
}) === 0;

const _tmpl$$4 = /*#__PURE__*/web.template(`<div></div>`, 2),
      _tmpl$2$2 = /*#__PURE__*/web.template(`<div class="solid-select-control"></div>`, 2),
      _tmpl$3$1 = /*#__PURE__*/web.template(`<div class="solid-select-placeholder"></div>`, 2),
      _tmpl$4 = /*#__PURE__*/web.template(`<div class="solid-select-single-value"></div>`, 2),
      _tmpl$5 = /*#__PURE__*/web.template(`<div class="solid-select-multi-value"><button type="button" class="solid-select-multi-value-remove">⨯</button></div>`, 4),
      _tmpl$6 = /*#__PURE__*/web.template(`<input class="solid-select-input" type="text" tabindex="0" autocomplete="off" autocapitalize="none" size="1">`, 1),
      _tmpl$7 = /*#__PURE__*/web.template(`<div class="solid-select-list"></div>`, 2),
      _tmpl$8 = /*#__PURE__*/web.template(`<div class="solid-select-list-placeholder"></div>`, 2),
      _tmpl$9 = /*#__PURE__*/web.template(`<div class="solid-select-option"></div>`, 2);
const SelectContext = solidJs.createContext();

const useSelect = () => {
  const context = solidJs.useContext(SelectContext);
  if (!context) throw new Error("No SelectContext found in ancestry.");
  return context;
};

const Select = props => {
  const [selectProps, local] = solidJs.splitProps(solidJs.mergeProps({
    format: (data, type) => data,
    placeholder: "Select...",
    readonly: typeof props.options !== "function",
    loading: false,
    loadingPlaceholder: "Loading...",
    emptyPlaceholder: "No options"
  }, props), ["options", "optionToValue", "isOptionDisabled", "multiple", "disabled", "onInput", "onChange"]);
  const select = createSelect(selectProps);
  solidJs.createEffect(solidJs.on(() => local.initialValue, value => value !== undefined && select.setValue(value)));
  return web.createComponent(SelectContext.Provider, {
    value: select,

    get children() {
      return web.createComponent(Container, {
        get ["class"]() {
          return local.class;
        },

        get children() {
          return [web.createComponent(Control, {
            get id() {
              return local.id;
            },

            get name() {
              return local.name;
            },

            get format() {
              return local.format;
            },

            get placeholder() {
              return local.placeholder;
            },

            get autofocus() {
              return local.autofocus;
            },

            get readonly() {
              return local.readonly;
            }

          }), web.createComponent(List, {
            get loading() {
              return local.loading;
            },

            get loadingPlaceholder() {
              return local.loadingPlaceholder;
            },

            get emptyPlaceholder() {
              return local.emptyPlaceholder;
            },

            get format() {
              return local.format;
            }

          })];
        }

      });
    }

  });
};

const Container = props => {
  const select = useSelect();
  return (() => {
    const _el$ = _tmpl$$4.cloneNode(true);

    _el$.$$mousedown = event => {
      select.onMouseDown(event);
      event.currentTarget.getElementsByTagName("input")[0].focus();
    };

    web.addEventListener(_el$, "focusout", select.onFocusOut, true);

    web.addEventListener(_el$, "focusin", select.onFocusIn, true);

    web.insert(_el$, () => props.children);

    web.effect(_p$ => {
      const _v$ = `solid-select-container ${props.class !== undefined ? props.class : ""}`,
            _v$2 = select.disabled;
      _v$ !== _p$._v$ && web.className(_el$, _p$._v$ = _v$);
      _v$2 !== _p$._v$2 && web.setAttribute(_el$, "data-disabled", _p$._v$2 = _v$2);
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined
    });

    return _el$;
  })();
};

const Control = props => {
  const select = useSelect();

  const removeValue = index => {
    const value = select.value();
    select.setValue([...value.slice(0, index), ...value.slice(index + 1)]);
  };

  return (() => {
    const _el$2 = _tmpl$2$2.cloneNode(true);

    web.addEventListener(_el$2, "click", select.onClick, true);

    web.insert(_el$2, web.createComponent(solidJs.Show, {
      get when() {
        return web.memo(() => !!!select.hasValue(), true)() && !select.hasInputValue();
      },

      get children() {
        return web.createComponent(Placeholder, {
          get children() {
            return props.placeholder;
          }

        });
      }

    }), null);

    web.insert(_el$2, web.createComponent(solidJs.Show, {
      get when() {
        return web.memo(() => !!(select.hasValue() && !select.multiple), true)() && !select.hasInputValue();
      },

      get children() {
        return web.createComponent(SingleValue, {
          get children() {
            return props.format(select.value(), "value");
          }

        });
      }

    }), null);

    web.insert(_el$2, web.createComponent(solidJs.Show, {
      get when() {
        return select.hasValue() && select.multiple;
      },

      get children() {
        return web.createComponent(solidJs.For, {
          get each() {
            return select.value();
          },

          children: (value, index) => web.createComponent(MultiValue, {
            onRemove: () => removeValue(index()),

            get children() {
              return props.format(value, "value");
            }

          })
        });
      }

    }), null);

    web.insert(_el$2, web.createComponent(Input, {
      get id() {
        return props.id;
      },

      get name() {
        return props.name;
      },

      get autofocus() {
        return props.autofocus;
      },

      get readonly() {
        return props.readonly;
      }

    }), null);

    web.effect(_p$ => {
      const _v$3 = select.multiple,
            _v$4 = select.hasValue(),
            _v$5 = select.disabled;

      _v$3 !== _p$._v$3 && web.setAttribute(_el$2, "data-multiple", _p$._v$3 = _v$3);
      _v$4 !== _p$._v$4 && web.setAttribute(_el$2, "data-has-value", _p$._v$4 = _v$4);
      _v$5 !== _p$._v$5 && web.setAttribute(_el$2, "data-disabled", _p$._v$5 = _v$5);
      return _p$;
    }, {
      _v$3: undefined,
      _v$4: undefined,
      _v$5: undefined
    });

    return _el$2;
  })();
};

const Placeholder = props => {
  return (() => {
    const _el$3 = _tmpl$3$1.cloneNode(true);

    web.insert(_el$3, () => props.children);

    return _el$3;
  })();
};

const SingleValue = props => {
  return (() => {
    const _el$4 = _tmpl$4.cloneNode(true);

    web.insert(_el$4, () => props.children);

    return _el$4;
  })();
};

const MultiValue = props => {
  useSelect();
  return (() => {
    const _el$5 = _tmpl$5.cloneNode(true),
          _el$6 = _el$5.firstChild;

    web.insert(_el$5, () => props.children, _el$6);

    _el$6.$$click = event => {
      event.stopPropagation();
      props.onRemove();
    };

    return _el$5;
  })();
};

const Input = props => {
  const select = useSelect();
  return (() => {
    const _el$7 = _tmpl$6.cloneNode(true);

    _el$7.$$mousedown = event => {
      event.stopPropagation();
    };

    _el$7.$$keydown = event => {
      select.onKeyDown(event);

      if (!event.defaultPrevented) {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          event.target.blur();
        }
      }
    };

    web.addEventListener(_el$7, "input", select.onInput, true);

    web.effect(_p$ => {
      const _v$6 = props.id,
            _v$7 = props.name,
            _v$8 = select.multiple,
            _v$9 = select.isActive(),
            _v$10 = props.autofocus,
            _v$11 = props.readonly,
            _v$12 = select.disabled;

      _v$6 !== _p$._v$6 && web.setAttribute(_el$7, "id", _p$._v$6 = _v$6);
      _v$7 !== _p$._v$7 && web.setAttribute(_el$7, "name", _p$._v$7 = _v$7);
      _v$8 !== _p$._v$8 && web.setAttribute(_el$7, "data-multiple", _p$._v$8 = _v$8);
      _v$9 !== _p$._v$9 && web.setAttribute(_el$7, "data-is-active", _p$._v$9 = _v$9);
      _v$10 !== _p$._v$10 && (_el$7.autofocus = _p$._v$10 = _v$10);
      _v$11 !== _p$._v$11 && (_el$7.readOnly = _p$._v$11 = _v$11);
      _v$12 !== _p$._v$12 && (_el$7.disabled = _p$._v$12 = _v$12);
      return _p$;
    }, {
      _v$6: undefined,
      _v$7: undefined,
      _v$8: undefined,
      _v$9: undefined,
      _v$10: undefined,
      _v$11: undefined,
      _v$12: undefined
    });

    web.effect(() => _el$7.value = select.inputValue());

    return _el$7;
  })();
};

const List = props => {
  const select = useSelect();
  return web.createComponent(solidJs.Show, {
    get when() {
      return select.isOpen();
    },

    get children() {
      const _el$8 = _tmpl$7.cloneNode(true);

      web.insert(_el$8, web.createComponent(solidJs.Show, {
        get when() {
          return !props.loading;
        },

        get fallback() {
          return (() => {
            const _el$9 = _tmpl$8.cloneNode(true);

            web.insert(_el$9, () => props.loadingPlaceholder);

            return _el$9;
          })();
        },

        get children() {
          return web.createComponent(solidJs.For, {
            get each() {
              return select.options();
            },

            get fallback() {
              return (() => {
                const _el$10 = _tmpl$8.cloneNode(true);

                web.insert(_el$10, () => props.emptyPlaceholder);

                return _el$10;
              })();
            },

            children: option => web.createComponent(Option, {
              option: option,

              get children() {
                return props.format(option, "option");
              }

            })
          });
        }

      }));

      return _el$8;
    }

  });
};

const Option = props => {
  const select = useSelect();

  const scrollIntoViewOnFocus = element => {
    solidJs.createEffect(() => {
      if (select.isOptionFocused(props.option)) {
        element.scrollIntoView({
          block: "nearest"
        });
      }
    });
  };

  return (() => {
    const _el$11 = _tmpl$9.cloneNode(true);

    _el$11.$$click = () => select.pickOption(props.option);

    scrollIntoViewOnFocus(_el$11);

    web.insert(_el$11, () => props.children);

    web.effect(_p$ => {
      const _v$13 = select.isOptionDisabled(props.option),
            _v$14 = select.isOptionFocused(props.option);

      _v$13 !== _p$._v$13 && web.setAttribute(_el$11, "data-disabled", _p$._v$13 = _v$13);
      _v$14 !== _p$._v$14 && web.setAttribute(_el$11, "data-focused", _p$._v$14 = _v$14);
      return _p$;
    }, {
      _v$13: undefined,
      _v$14: undefined
    });

    return _el$11;
  })();
};

web.delegateEvents(["focusin", "focusout", "mousedown", "click", "input", "keydown"]);

const [store, setStore] = store$1.createStore({
  dislikes,
  likes
});
const getDislikes = solidJs.createMemo(() => store.dislikes);
const addDislike = dislike => {
  const dislikes = [...store.dislikes, dislike];
  setDislikes(dislikes);
};
const setDislikes = dislikes => {
  setStore('dislikes', dislikes);
  GM_setValue('dislikes', dislikes);
};
const removeDislike = dislike => {
  const dislikes = store.dislikes.filter(t => t.tag !== dislike.tag);
  setDislikes(dislikes);
};
const getLikes = solidJs.createMemo(() => store.likes);
const setLikes = likes => {
  setStore('likes', likes);
  GM_setValue('likes', likes);
};
const addLike = like => {
  const likes = [...store.likes, like];
  setLikes(likes);
};
const removeLike = like => {
  const likes = store.likes.filter(l => l.tag !== like.tag);
  setLikes(likes);
};

var _tmpl$$3 = /*#__PURE__*/web.template(`<div class=filter-block><h4 class="filter-block_title accordion-toggle">Like Tags</h4><div class="filter-block_content accordion-content"><datalist id=totalTagName></datalist><div class=selected-tags-wrap>`),
  _tmpl$2$1 = /*#__PURE__*/web.template(`<option>`),
  _tmpl$3 = /*#__PURE__*/web.template(`<span>`);
function LikesTagFilter() {
  const [initialValue, setInitialValue] = solidJs.createSignal(null, {
    equals: false
  });
  const selectProps = createOptions(totalTags.map(t => ({
    name: t[0],
    tag: t[1]
  })), {
    key: 'name',
    filterable: true
  });
  const onLikeChange = data => {
    if (!data) {
      return;
    }
    const isExist = getLikes().some(l => l.tag === data.tag);
    if (isExist) {
      alert('Tag already exist in Likes!');
      return;
    }
    let x;
    do {
      x = prompt("Please Enter the Color in Hex like '#FFFFFF' for " + data.name);
    } while (!x.includes('#') && x === '' && x.length <= 1);
    console.debug(`you have entered color in hex: ${x} with tagName: ${JSON.stringify(data)} and the condition ${!!x}`);
    setInitialValue(null);
    if (x) {
      const tag = _extends({}, data, {
        color: x
      });
      console.debug(`the likes after pushing the ${tag} is ${likes}`);
      addLike(tag);
      likeFilter();
      likeLimit();
      filterOut();
    }
  };
  return (() => {
    var _el$ = _tmpl$$3(),
      _el$2 = _el$.firstChild,
      _el$3 = _el$2.nextSibling,
      _el$4 = _el$3.firstChild,
      _el$5 = _el$4.nextSibling;
    web.insert(_el$3, web.createComponent(Select, web.mergeProps(selectProps, {
      "class": 'select-likes',
      get initialValue() {
        return initialValue();
      },
      onChange: onLikeChange,
      placeholder: 'Select Likes...'
    })), _el$4);
    web.insert(_el$4, () => totalTags.map(item => {
      return (() => {
        var _el$6 = _tmpl$2$1();
        web.insert(_el$6, () => item[0]);
        web.effect(() => _el$6.value = item[1]);
        return _el$6;
      })();
    }));
    web.insert(_el$5, web.createComponent(solidJs.For, {
      get each() {
        return getLikes();
      },
      children: item => (() => {
        var _el$7 = _tmpl$3();
        _el$7.$$click = e => {
          removeLike(item);
          tagRemoveHandler(e, true);
        };
        web.insert(_el$7, () => item.name);
        web.effect(() => `${item.color} solid` != null ? _el$7.style.setProperty("border-left", `${item.color} solid`) : _el$7.style.removeProperty("border-left"));
        return _el$7;
      })()
    }));
    return _el$;
  })();
}
web.delegateEvents(["click"]);

var _tmpl$$2 = /*#__PURE__*/web.template(`<div class=filter-block><h4 class="filter-block_title accordion-toggle">Dislike Tags</h4><div class="filter-block_content accordion-content"><div class=selected-tags-wrap>`),
  _tmpl$2 = /*#__PURE__*/web.template(`<span>`);
function DislikeTagFilter() {
  const [initialValue, setInitialValue] = solidJs.createSignal(null, {
    equals: false
  });
  const selectProps = createOptions(totalTags.map(t => ({
    name: t[0],
    tag: t[1]
  })), {
    key: 'name',
    filterable: true
  });
  const onDislike = value => {
    setInitialValue(null);
    if (!value) {
      return;
    }
    const isExist = getDislikes().some(d => d.tag === value.tag);
    if (isExist) {
      alert('Tag already exist in Dislikes!');
      return;
    }
    addDislike(value);
    dislikeFilter();
    filterOut();
  };
  return (() => {
    var _el$ = _tmpl$$2(),
      _el$2 = _el$.firstChild,
      _el$3 = _el$2.nextSibling,
      _el$4 = _el$3.firstChild;
    _el$.style.setProperty("border-bottom", "1px solid #3f4043");
    web.insert(_el$3, web.createComponent(Select, web.mergeProps(selectProps, {
      get initialValue() {
        return initialValue();
      },
      onChange: onDislike,
      placeholder: 'Select Dislikes...'
    })), _el$4);
    web.insert(_el$4, web.createComponent(solidJs.For, {
      get each() {
        return getDislikes();
      },
      children: dislike => (() => {
        var _el$5 = _tmpl$2();
        _el$5.$$click = e => {
          removeDislike(dislike);
          tagRemoveHandler(e, false);
        };
        web.insert(_el$5, () => dislike.name);
        return _el$5;
      })()
    }));
    return _el$;
  })();
}
web.delegateEvents(["click"]);

var _tmpl$$1 = /*#__PURE__*/web.template(`<div class=filter-block><div class=filter-block_button-wrap><span class="filter-block_title flxgrow">Filter Ignore Thread:</span><input type=checkbox id=filter-ignore-thread>`);
function FilterIgnore() {
  const onChange = event => {
    GM_setValue('ignoreThreadFilter', event.target.checked);
    IgnoreFilter();
    filterOut();
  };
  return (() => {
    var _el$ = _tmpl$$1(),
      _el$2 = _el$.firstChild,
      _el$3 = _el$2.firstChild,
      _el$4 = _el$3.nextSibling;
    _el$2.style.setProperty("display", "flex");
    _el$4.addEventListener("change", onChange);
    web.effect(() => _el$4.checked = GM_getValue('ignoreThreadFilter', false));
    return _el$;
  })();
}

var _tmpl$ = /*#__PURE__*/web.template(`<style>`);
function mainFilter() {
  solidJs.createEffect(() => {
    init();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.history.onpushstate = function () {
      setTimeout(init, 200);
    };
    (function (history) {
      const pushState = history.pushState;
      history.pushState = function (state) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (typeof history.onpushstate === 'function') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          history.onpushstate({
            state
          });
        }
        return pushState.apply(history);
      };
    })(window.history);
  }, [window.history]);
  return [web.createComponent(LikesTagFilter, {}), web.createComponent(DislikeTagFilter, {}), web.createComponent(LikeLimitDisplay, {}), web.createComponent(FilterFavLikes, {}), web.createComponent(FilterIgnore, {}), (() => {
    var _el$ = _tmpl$();
    web.insert(_el$, css_248z);
    return _el$;
  })(), (() => {
    var _el$2 = _tmpl$();
    web.insert(_el$2, css_248z$1);
    return _el$2;
  })()];
}
web.render(mainFilter, document.querySelector('.content-block_filter'));
// render(LikesTagFilter, document.querySelector('#filter-block_prefixes'));
// render(DislikeTagFilter, document.querySelector('#filter-block_prefixes'));

})(await import("https://esm.sh/solid-js/web"), _, await import("https://esm.sh/solid-js"), await import("https://esm.sh/solid-js/store"));
})();