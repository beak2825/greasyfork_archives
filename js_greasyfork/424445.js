// ==UserScript==
// @name          Beatsaver tools
// @namespace     http://tampermonkey.net/
// @version       0.1.7
// @description   Various beatsaver QOL features
// @source        https://github.com/Dartv/beatsaver-tools
// @author        Dartv
// @match         https://beatsaver.com/*
// @require       https://unpkg.com/react@17/umd/react.production.min.js
// @require       https://unpkg.com/react-dom@17/umd/react-dom.production.min.js
// @require       https://unpkg.com/evergreen-ui@5.1.2/umd/evergreen.min.js
// @require       https://unpkg.com/react-hook-form@6.15.5/dist/index.umd.production.min.js
// @require       https://unpkg.com/react-input-mask/dist/react-input-mask.min.js
// @resource logo data:image/png;base64,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
// @grant         GM_getResourceURL
// @downloadURL https://update.greasyfork.org/scripts/424445/Beatsaver%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/424445/Beatsaver%20tools.meta.js
// ==/UserScript==
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/App.tsx":
/*!********************************!*\
  !*** ./src/components/App.tsx ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Tools__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Tools */ "./src/components/Tools.tsx");



const isBeatmapList = () => window.location.href.search(/browse|search/) !== -1;

const App = () => {
  const [isMapList, setIsMapList] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(isBeatmapList());
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    window.history.pushState = new Proxy(window.history.pushState, {
      apply: (target, thisArg, args) => {
        const res = target.apply(thisArg, args);
        setIsMapList(isBeatmapList());
        return res;
      }
    });
  }, []);
  return isMapList ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_Tools__WEBPACK_IMPORTED_MODULE_1__.default, null) : null;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);

/***/ }),

/***/ "./src/components/DurationInput.tsx":
/*!******************************************!*\
  !*** ./src/components/DurationInput.tsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_input_mask__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-input-mask */ "react-input-mask");
/* harmony import */ var react_input_mask__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_input_mask__WEBPACK_IMPORTED_MODULE_1__);



const DurationInput = ({
  value,
  name,
  onChange,
  ref,
  children
}) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react_input_mask__WEBPACK_IMPORTED_MODULE_1___default()), {
  value: value,
  name: name,
  mask: "23:59:59",
  maskChar: "0",
  alwaysShowMask: true,
  formatChars: {
    2: '[0-2]',
    3: '[0-3]',
    5: '[0-5]',
    9: '[0-9]'
  },
  onChange: e => {
    e.persist();
    onChange(e.target.value);
  }
}, inputProps => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().cloneElement(children, { ...inputProps,
  ref
}));

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DurationInput);

/***/ }),

/***/ "./src/components/FiltersForm.tsx":
/*!****************************************!*\
  !*** ./src/components/FiltersForm.tsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var evergreen_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! evergreen-ui */ "evergreen-ui");
/* harmony import */ var evergreen_ui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(evergreen_ui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-hook-form */ "react-hook-form");
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_hook_form__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _DurationInput__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DurationInput */ "./src/components/DurationInput.tsx");





const downloadOptions = Object.values(_constants__WEBPACK_IMPORTED_MODULE_3__.DownloadOption).map(option => ({
  label: option,
  value: option
}));

const FiltersForm = ({
  initialState,
  onSubmit,
  onStop,
  onReset,
  onExport,
  register,
  control,
  setValue,
  formState,
  watch
}) => {
  const download = watch('download', initialState.download);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("form", {
    onSubmit: onSubmit
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_0__.Pane, {
    display: "flex"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_0__.TextInputField, {
    label: "Minimum upvotes",
    placeholder: "Minimum upvotes",
    name: "minUpvotes",
    type: "number",
    defaultValue: initialState.minUpvotes,
    min: 0,
    ref: register({
      valueAsNumber: true,
      min: 0
    }),
    width: 200,
    marginRight: 16
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_0__.TextInputField, {
    label: "Maximum downvotes",
    placeholder: "Maximum downvotes",
    name: "maxDownvotes",
    type: "number",
    defaultValue: initialState.maxDownvotes,
    min: 0,
    ref: register({
      valueAsNumber: true,
      min: 0
    }),
    width: 200
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_0__.Pane, {
    display: "flex"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_0__.TextInputField, {
    label: "Minimum downloads",
    placeholder: "Minimum downloads",
    name: "minDownloads",
    type: "number",
    defaultValue: initialState.minDownloads,
    min: 0,
    ref: register({
      valueAsNumber: true,
      min: 0
    }),
    width: 200,
    marginRight: 16
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_0__.TextInputField, {
    label: "Minimum rating",
    placeholder: "Minimum rating",
    name: "minRating",
    type: "number",
    defaultValue: initialState.minRating,
    min: 0,
    max: 100,
    ref: register({
      valueAsNumber: true,
      min: 0,
      max: 100
    }),
    width: 200
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_0__.Pane, {
    display: "flex"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_2__.Controller, {
    control: control,
    name: "minDuration",
    defaultValue: initialState.minDuration,
    render: props => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_DurationInput__WEBPACK_IMPORTED_MODULE_4__.default, props, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_0__.TextInputField, {
      label: "Minimum Duration",
      placeholder: "Minimum Duration",
      width: 200,
      marginRight: 16
    }))
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_2__.Controller, {
    control: control,
    name: "maxDuration",
    defaultValue: initialState.maxDuration,
    render: props => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_DurationInput__WEBPACK_IMPORTED_MODULE_4__.default, props, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_0__.TextInputField, {
      label: "Maximum Duration",
      placeholder: "Maximum Duration",
      width: 200
    }))
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_0__.TextareaField, {
    label: "Exclude mappers",
    placeholder: "John, Eric",
    name: "excludedMappers",
    defaultValue: initialState.excludedMappers,
    ref: register({
      setValueAs: value => value.toLowerCase()
    }),
    width: 420
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_0__.FormField, {
    label: "Difficulty"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_0__.Pane, {
    display: "flex"
  }, Object.entries(_constants__WEBPACK_IMPORTED_MODULE_3__.Difficulty).map(([key, value], i, arr) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_2__.Controller, {
    key: value,
    control: control,
    name: value,
    defaultValue: initialState[value],
    render: ({
      onChange,
      value,
      ref
    }) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_0__.Checkbox, {
      label: key.replace('_', ' '),
      onChange: e => onChange(e.target.checked),
      checked: value,
      marginRight: i === arr.length - 1 ? 0 : 16,
      marginTop: 4,
      ref: ref
    })
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_2__.Controller, {
    control: control,
    name: "download",
    defaultValue: initialState.download,
    render: ({
      onChange,
      value,
      ref
    }) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_0__.Checkbox, {
      label: "Automatically download beatmaps?",
      onChange: e => onChange(e.target.checked),
      checked: value,
      ref: ref
    })
  }), download && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_2__.Controller, {
    control: control,
    name: "downloadOption",
    defaultValue: initialState.downloadOption,
    render: ({
      value
    }) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_0__.SegmentedControl, {
      width: 200,
      height: 24,
      marginBottom: 16,
      options: downloadOptions,
      value: value,
      onChange: value => setValue('downloadOption', value)
    })
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_0__.Pane, {
    display: "flex",
    justifyContent: formState.isSubmitted ? 'space-between' : 'flex-start'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_0__.Button, {
    type: "submit",
    appearance: "primary",
    marginRight: 16
  }, "Apply"), formState.isSubmitted && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_0__.Button, {
    intent: "warning",
    appearance: "primary",
    marginRight: 16,
    onClick: onStop
  }, "Stop"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_0__.Button, {
    intent: "danger",
    appearance: "primary",
    onClick: onReset,
    marginRight: 16
  }, "Reset"), formState.isSubmitted && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_0__.Button, {
    onClick: onExport
  }, "Export as playlist")));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FiltersForm);

/***/ }),

/***/ "./src/components/Tools.tsx":
/*!**********************************!*\
  !*** ./src/components/Tools.tsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var evergreen_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! evergreen-ui */ "evergreen-ui");
/* harmony import */ var evergreen_ui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(evergreen_ui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-hook-form */ "react-hook-form");
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_hook_form__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _FiltersForm__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FiltersForm */ "./src/components/FiltersForm.tsx");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _utils_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/common */ "./src/utils/common.ts");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }







const tabs = ['Filters'];
const descriptions = ['Pick settings below to filter maps based on'];
const logo = window.GM_getResourceURL('logo');

const passesFilters = (map, filters) => {
  const hasDifficulty = Object.values(_constants__WEBPACK_IMPORTED_MODULE_4__.Difficulty).some(difficulty => filters[difficulty] && map.difficulties.includes(difficulty));
  return [hasDifficulty, !filters.minUpvotes || map.upvotes >= filters.minUpvotes, !filters.maxDownvotes || map.downvotes <= filters.maxDownvotes, !filters.minDownloads || map.downloads >= filters.minDownloads, !filters.minRating || map.rating >= filters.minRating, !filters.minDuration || map.duration >= (0,_utils_common__WEBPACK_IMPORTED_MODULE_5__.parseTimeToSeconds)(filters.minDuration), !filters.maxDuration || map.duration <= (0,_utils_common__WEBPACK_IMPORTED_MODULE_5__.parseTimeToSeconds)(filters.maxDuration), !filters.excludedMappers || !filters.excludedMappers.split(',').map(m => m.trim()).includes(map.author.toLowerCase())].every(Boolean);
};

const Tools = () => {
  const [isShown, setIsShown] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [selectedTab, setSelectedTab] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const observer = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const filtersForm = (0,react_hook_form__WEBPACK_IMPORTED_MODULE_2__.useForm)();
  const filtersFormData = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)((0,_utils_common__WEBPACK_IMPORTED_MODULE_5__.getInitialFilters)());
  const seenMaps = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(new Set());
  const maps = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(new Map());

  const getFilters = () => ({ ..._constants__WEBPACK_IMPORTED_MODULE_4__.initialFilters,
    ...filtersFormData.current
  });

  const filter = node => {
    const filters = getFilters();
    const map = (0,_utils_common__WEBPACK_IMPORTED_MODULE_5__.parseBeatmapFromNode)(node);

    if (passesFilters(map, filters)) {
      if (filters.download && !seenMaps.current.has(map.id)) {
        const dlOption = filters.downloadOption || _constants__WEBPACK_IMPORTED_MODULE_4__.DownloadOption.ARCHIVE;
        let dlText;

        if (dlOption === _constants__WEBPACK_IMPORTED_MODULE_4__.DownloadOption.ARCHIVE) {
          dlText = 'Download';
        } else {
          dlText = 'OneClick';
        }

        const dl = (0,_utils_common__WEBPACK_IMPORTED_MODULE_5__.getElementByXPath)(`.//a[contains(text(), "${dlText}")]`, node);

        if (dl instanceof HTMLAnchorElement) {
          dl.click();
        }
      }
    } else {
      node.setAttribute('style', 'display: none;');
    }

    seenMaps.current.add(map.id);

    if (map.hash && map.hash !== 'placeholder') {
      maps.current.set(map.id, map);
    }
  };

  const filterAll = () => {
    const filters = getFilters();
    const nodes = Array.from(document.querySelectorAll('.beatmap-result:not(.beatmap-result-hidden)'));
    nodes.forEach(filter);
    maps.current.forEach(map => {
      if (passesFilters(map, filters)) {
        const node = document.getElementById(map.id);
        node?.removeAttribute('style');
      }
    });
  };

  const onSubmitFilters = () => {
    filtersFormData.current = filtersForm.getValues();
    filterAll();
    observer.current?.disconnect();
    observer.current?.observe(document.documentElement, {
      subtree: true,
      attributeFilter: ['class', 'src'],
      attributeOldValue: true
    });
    localStorage.setItem(_constants__WEBPACK_IMPORTED_MODULE_4__.FILTERS_KEY, JSON.stringify(filtersFormData.current));
  };

  const onFiltersSubmit = filtersForm.handleSubmit(() => {
    onSubmitFilters();
    setIsShown(false);
    evergreen_ui__WEBPACK_IMPORTED_MODULE_1__.toaster.notify('Beatmaps that do not pass filters will get filtered out. Click "stop" to cancel.');
  });

  const onFiltersStop = e => {
    e.preventDefault();
    e.stopPropagation();
    observer.current?.disconnect();
  };

  const onFiltersReset = e => {
    e.preventDefault();
    e.stopPropagation(); // can't use reset here because of the bug in react-hook-form

    Object.entries(_constants__WEBPACK_IMPORTED_MODULE_4__.initialFilters).forEach(([key, value]) => {
      filtersForm.setValue(key, value);
    });
    onSubmitFilters();
    maps.current.clear();
    observer.current?.disconnect();
  };

  const onFiltersExport = e => {
    e.preventDefault();
    e.stopPropagation();
    const playlistTitle = window.prompt('Enter playlist name');

    if (playlistTitle) {
      const hashes = new Set();
      const filters = { ..._constants__WEBPACK_IMPORTED_MODULE_4__.initialFilters,
        ...filtersForm.getValues()
      };
      maps.current.forEach(map => {
        if (map.hash && passesFilters(map, filters)) {
          hashes.add(map.hash);
        }
      });

      if (hashes.size) {
        const date = new Date();
        const createdAt = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        const playlistData = {
          playlistTitle,
          playlistAuthor: 'Beatsaver Tools',
          playlistDescription: `Playlist created by Beatsaver Tools at ${createdAt}`,
          image: logo,
          songs: Array.from(hashes).map(hash => ({
            hash
          }))
        };
        (0,_utils_common__WEBPACK_IMPORTED_MODULE_5__.downloadFile)(`${playlistTitle}.json`, JSON.stringify(playlistData));
      }
    }
  };

  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    observer.current = new MutationObserver(mutations => {
      mutations.forEach(({
        type,
        target,
        oldValue
      }) => {
        // beatsaver removes nodes from DOM when it is not visible
        // luckily they set class from beatmap-result-hidden to beatmap-result when map is rendered
        // beatsaver replaces src with placeholder while the map is loading
        if (type === 'attributes' && oldValue === 'beatmap-result-hidden' || oldValue?.includes('placeholder')) {
          const node = target.nodeName === 'IMG' ? target.closest('.beatmap-result') : target;

          if (node) {
            filter(node);
          }
        }
      });
    });
    return () => observer.current?.disconnect();
  }, []);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_1__.SideSheet, {
    width: 480,
    isShown: isShown,
    onCloseComplete: () => setIsShown(false),
    containerProps: {
      display: 'flex',
      flex: '1',
      flexDirection: 'column',
      paddingTop: 52
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_1__.Pane, {
    zIndex: 1,
    flexShrink: 0,
    elevation: 0,
    backgroundColor: "white"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_1__.Pane, {
    padding: 16,
    borderBottom: "muted"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_1__.Heading, {
    size: 600
  }, "Beatsaver Tools"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_1__.Paragraph, {
    size: 400,
    color: "muted"
  }, descriptions[selectedTab])), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_1__.Pane, {
    display: "flex",
    padding: 8
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_1__.Tablist, null, tabs.map((tab, index) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_1__.Tab, {
    key: tab,
    isSelected: selectedTab === index,
    onSelect: () => setSelectedTab(index)
  }, tab))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_1__.Pane, {
    flex: "1",
    overflowY: "scroll",
    padding: 16
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_FiltersForm__WEBPACK_IMPORTED_MODULE_3__.default, _extends({}, filtersForm, {
    onSubmit: onFiltersSubmit,
    onStop: onFiltersStop,
    onReset: onFiltersReset,
    onExport: onFiltersExport,
    initialState: filtersFormData.current
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(evergreen_ui__WEBPACK_IMPORTED_MODULE_1__.IconButton, {
    appearance: "minimal",
    icon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
      src: logo,
      alt: "Beat saber icon"
    }),
    onClick: () => setIsShown(!isShown)
  }));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Tools);

/***/ }),

/***/ "./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Difficulty": () => (/* binding */ Difficulty),
/* harmony export */   "DownloadOption": () => (/* binding */ DownloadOption),
/* harmony export */   "initialFilters": () => (/* binding */ initialFilters),
/* harmony export */   "FILTERS_KEY": () => (/* binding */ FILTERS_KEY)
/* harmony export */ });
let Difficulty;

(function (Difficulty) {
  Difficulty["EASY"] = "is-easy";
  Difficulty["NORMAL"] = "is-dark";
  Difficulty["HARD"] = "is-hard";
  Difficulty["EXPERT"] = "is-expert";
  Difficulty["EXPERT_PLUS"] = "is-expert-plus";
})(Difficulty || (Difficulty = {}));

let DownloadOption;

(function (DownloadOption) {
  DownloadOption["ARCHIVE"] = "Archive";
  DownloadOption["MOD_ASSISTANT"] = "Mod Assistant";
})(DownloadOption || (DownloadOption = {}));

const initialFilters = {
  minUpvotes: 0,
  maxDownvotes: 9999,
  minDownloads: 0,
  minRating: 0,
  minDuration: '00:00:00',
  maxDuration: '23:59:59',
  excludedMappers: '',
  download: false,
  downloadOption: DownloadOption.ARCHIVE,
  ...Object.values(Difficulty).reduce((acc, difficulty) => ({ ...acc,
    [difficulty]: true
  }), {})
};
const FILTERS_KEY = 'bt-filters';

/***/ }),

/***/ "./src/utils/common.ts":
/*!*****************************!*\
  !*** ./src/utils/common.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getTextFromNode": () => (/* binding */ getTextFromNode),
/* harmony export */   "parseIntFromNode": () => (/* binding */ parseIntFromNode),
/* harmony export */   "parseTimeToSeconds": () => (/* binding */ parseTimeToSeconds),
/* harmony export */   "parseTimeFromNode": () => (/* binding */ parseTimeFromNode),
/* harmony export */   "getBeatmapIdFromImage": () => (/* binding */ getBeatmapIdFromImage),
/* harmony export */   "parseBeatmapFromNode": () => (/* binding */ parseBeatmapFromNode),
/* harmony export */   "isValidDate": () => (/* binding */ isValidDate),
/* harmony export */   "downloadFile": () => (/* binding */ downloadFile),
/* harmony export */   "getInitialFilters": () => (/* binding */ getInitialFilters),
/* harmony export */   "getElementByXPath": () => (/* binding */ getElementByXPath)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");

const getTextFromNode = node => node?.textContent?.split(' ')[0] || '';
const parseIntFromNode = (node, defaultValue) => {
  const value = parseInt(getTextFromNode(node).replace(',', ''), 10);
  return Number.isInteger(value) ? value : defaultValue;
};
const parseTimeToSeconds = (time = '00:00:00') => {
  const [hours = 0, minutes = 0, seconds = 0] = time.split(':').map(Number);
  return hours * 60 * 60 + minutes * 60 + seconds;
};
const parseTimeFromNode = node => {
  const time = getTextFromNode(node);
  return parseTimeToSeconds(time.padStart(8, '00:'));
};
const getBeatmapIdFromImage = node => node?.getAttribute('src')?.match(/\/(\w+)\./)?.[1] || null;
const parseBeatmapFromNode = node => {
  const upvotes = parseIntFromNode(node.querySelector(`li[title="Upvotes"]`), Number.MAX_SAFE_INTEGER);
  const downvotes = parseIntFromNode(node.querySelector(`li[title="Downvotes"]`), _constants__WEBPACK_IMPORTED_MODULE_0__.initialFilters.maxDownvotes);
  const downloads = parseIntFromNode(node.querySelector(`li[title="Downloads"]`), Number.MAX_SAFE_INTEGER);
  const rating = parseIntFromNode(node.querySelector(`li[title="Beatmap Rating"]`), 100);
  const duration = parseTimeFromNode(node.querySelector(`li[title="Beatmap Duration"]`)) || parseTimeToSeconds(_constants__WEBPACK_IMPORTED_MODULE_0__.initialFilters.maxDuration);
  const author = getTextFromNode(node.querySelector('.details > h2 > a')) || '';
  const difficulties = Object.values(_constants__WEBPACK_IMPORTED_MODULE_0__.Difficulty).reduce((acc, difficulty) => {
    if (node.querySelector(`.tag.${difficulty}`)) {
      return [...acc, difficulty];
    }

    return acc;
  }, []);
  const hash = getBeatmapIdFromImage(node.querySelector('.cover img'));
  const id = node.id;
  return {
    id,
    hash,
    upvotes,
    downvotes,
    downloads,
    rating,
    duration,
    author,
    difficulties
  };
};
const isValidDate = date => !isNaN(date) && date instanceof Date;
const downloadFile = (name, data) => {
  const blob = new Blob([data], {
    type: 'application/json'
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.setAttribute('download', name);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
const getInitialFilters = () => {
  try {
    const state = localStorage.getItem(_constants__WEBPACK_IMPORTED_MODULE_0__.FILTERS_KEY) || '';
    return JSON.parse(state);
  } catch (err) {
    return _constants__WEBPACK_IMPORTED_MODULE_0__.initialFilters;
  }
};
const getElementByXPath = (selector, node) => document.evaluate(selector, node, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

/***/ }),

/***/ "evergreen-ui":
/*!******************************!*\
  !*** external "EvergreenUI" ***!
  \******************************/
/***/ ((module) => {

module.exports = EvergreenUI;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = React;

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = ReactDOM;

/***/ }),

/***/ "react-hook-form":
/*!********************************!*\
  !*** external "ReactHookForm" ***!
  \********************************/
/***/ ((module) => {

module.exports = ReactHookForm;

/***/ }),

/***/ "react-input-mask":
/*!*********************************!*\
  !*** external "ReactInputMask" ***!
  \*********************************/
/***/ ((module) => {

module.exports = ReactInputMask;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/index.tsx ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_App__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/App */ "./src/components/App.tsx");




window.onload = () => {
  const root = document.createElement('div');
  root.setAttribute('id', 'bt-root');
  root.setAttribute('class', 'navbar-item');
  const navbar = document.querySelector('.navbar .navbar-end');
  navbar?.prepend(root);
  react_dom__WEBPACK_IMPORTED_MODULE_1___default().render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_App__WEBPACK_IMPORTED_MODULE_2__.default, null), root);
};
})();

/******/ })()
;