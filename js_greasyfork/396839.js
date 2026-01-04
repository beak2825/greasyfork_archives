// ==UserScript==
// @name         TenPinCam
// @namespace    eisen-stein
// @version      1.0.3
// @description  TenPinCam Integration Tests
// @author       eisen-stein
// @match        https://tenpincam.com/*
// @match        https://*.tenpincam.com/*
// @match        http://localhost:8002/*
// @match        http://localhost:3000/*
// @match        http://10.53.0.*
// @connect      tenpincam.com
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.addStyle
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require      https://greasyfork.org/scripts/396829-redux/code/Redux.js?version=775083
// @require      https://greasyfork.org/scripts/396830-redux-persist/code/Redux-persist.js?version=775084
// @require      https://greasyfork.org/scripts/396832-redux-saga/code/Redux-saga.js?version=775086
// @require      https://greasyfork.org/scripts/396833-redux-saga-effects/code/Redux-sagaeffects.js?version=775087
// @require      https://greasyfork.org/scripts/396834-apisauce/code/Apisauce.js?version=775089
// @require      https://greasyfork.org/scripts/396836-preact/code/Preact.js?version=775091
// @require      https://greasyfork.org/scripts/396835-htm-preact/code/Htm-preact.js?version=775090
// @downloadURL https://update.greasyfork.org/scripts/396839/TenPinCam.user.js
// @updateURL https://update.greasyfork.org/scripts/396839/TenPinCam.meta.js
// ==/UserScript==

// @require      https://raw.githubusercontent.com/e1sen-stein/bundles/master/redux/dist/redux.min.js?_=1762672
// @require      https://raw.githubusercontent.com/e1sen-stein/bundles/master/redux-persist/dist/redux-persist.min.js?_=1762672
// @require      https://raw.githubusercontent.com/e1sen-stein/bundles/master/redux-saga/dist/redux-saga.min.js?_=1762672
// @require      https://raw.githubusercontent.com/e1sen-stein/bundles/master/redux-saga-effects/dist/redux-saga-effects.min.js?_=1762672
// @require      https://raw.githubusercontent.com/e1sen-stein/bundles/master/apisauce/dist/apisauce.min.js?_=1762672
// @require      https://raw.githubusercontent.com/e1sen-stein/bundles/master/kefir/dist/kefir.min.js?_=1762672
// @require      https://raw.githubusercontent.com/e1sen-stein/bundles/master/preact/dist/preact.min.js?_=1762672
// @require      https://raw.githubusercontent.com/e1sen-stein/bundles/master/htm-preact/dist/htm-preact.min.js?_=1762672

(function(window, WINDOW) {
  (function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = autoMergeLevel2;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
  autoMergeLevel2: 
    - merges 2 level of substate
    - skips substate if already modified
    - this is essentially redux-perist v4 behavior
*/
function autoMergeLevel2(inboundState, originalState, reducedState, _ref) {
  var debug = _ref.debug;

  var newState = _objectSpread({}, reducedState); // only rehydrate if inboundState exists and is an object


  if (inboundState && _typeof(inboundState) === 'object') {
    Object.keys(inboundState).forEach(function (key) {
      // ignore _persist data
      if (key === '_persist') return; // if reducer modifies substate, skip auto rehydration

      if (originalState[key] !== reducedState[key]) {
        if (false) {}
        return;
      }

      if (isPlainEnoughObject(reducedState[key])) {
        // if object is plain enough shallow merge the new values (hence "Level2")
        newState[key] = _objectSpread({}, newState[key], {}, inboundState[key]);
        return;
      } // otherwise hard set


      newState[key] = inboundState[key];
    });
  }

  if (false) {}
  return newState;
}

function isPlainEnoughObject(o) {
  return o !== null && !Array.isArray(o) && _typeof(o) === 'object';
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var scenario_actions_namespaceObject = {};
__webpack_require__.r(scenario_actions_namespaceObject);
__webpack_require__.d(scenario_actions_namespaceObject, "actionInitScenario", function() { return actionInitScenario; });
__webpack_require__.d(scenario_actions_namespaceObject, "actionSetActiveScenarioIndex", function() { return actionSetActiveScenarioIndex; });
__webpack_require__.d(scenario_actions_namespaceObject, "actionStartScenario", function() { return actionStartScenario; });
__webpack_require__.d(scenario_actions_namespaceObject, "actionContinueActiveScenario", function() { return actionContinueActiveScenario; });
__webpack_require__.d(scenario_actions_namespaceObject, "actionStartEvent", function() { return actionStartEvent; });
__webpack_require__.d(scenario_actions_namespaceObject, "actionEndActiveEvent", function() { return actionEndActiveEvent; });
__webpack_require__.d(scenario_actions_namespaceObject, "actionErrorActiveEvent", function() { return actionErrorActiveEvent; });
__webpack_require__.d(scenario_actions_namespaceObject, "actionSetPausedActiveScenario", function() { return actionSetPausedActiveScenario; });
__webpack_require__.d(scenario_actions_namespaceObject, "actionMoveScenarioEvent", function() { return actionMoveScenarioEvent; });
__webpack_require__.d(scenario_actions_namespaceObject, "actionSetScenarioName", function() { return actionSetScenarioName; });
__webpack_require__.d(scenario_actions_namespaceObject, "actionDeleteScenario", function() { return actionDeleteScenario; });
__webpack_require__.d(scenario_actions_namespaceObject, "actionDeleteScenarioAction", function() { return actionDeleteScenarioAction; });
__webpack_require__.d(scenario_actions_namespaceObject, "actionSetScenarioActionPayload", function() { return actionSetScenarioActionPayload; });
__webpack_require__.d(scenario_actions_namespaceObject, "actionCreateScenario", function() { return actionCreateScenario; });
__webpack_require__.d(scenario_actions_namespaceObject, "actionAddScenarioAction", function() { return actionAddScenarioAction; });

// CONCATENATED MODULE: ./src/utils/time.js
/* harmony default export */ var time = (() => `[${new Date().toISOString().slice(11, -1)}]`);
// CONCATENATED MODULE: ./src/utils/keyMirror.js
/** @return {Object.<string, string>} */
function keyMirror(types) {
  return Object.keys(types).reduce((acc, key) => {
    acc[key] = key;
    return acc;
  }, {});
}
// CONCATENATED MODULE: ./src/utils/createDocument.js
function createDocument(title, html) {
  const doc = document.implementation.createHTMLDocument(title || '');
  if (typeof html === 'string') {
    doc.documentElement.innerHTML = html;
  }
  return doc;
}
// CONCATENATED MODULE: ./src/utils/require.js
/* harmony default export */ var require = ((moduleId) => {
  if (typeof self !== 'undefined' && typeof self[moduleId] !== 'undefined') {
    if (self[moduleId] !== window[moduleId]) {
      window[moduleId] = self[moduleId];
    }
    return self[moduleId];
  }
  return {};
});
// CONCATENATED MODULE: ./src/utils/gmAdapter.js


const { axios } = require('apisauce');

const {
  buildFullPath, buildURL, utils, parseHeaders, isURLSameOrigin, cookies, createError, settle,
} = axios;

function gmAdapter(config) {
  return new Promise((resolve, reject) => {
    console.log(time(), 'gmAdapter config: ', config);
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    const requestConfig = {};
    // var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      // var username = config.auth.username || '';
      // var password = config.auth.password || '';
      // requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
      requestConfig.user = config.auth.username || '';
      requestConfig.password = config.auth.password || '';
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    // request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
    requestConfig.method = config.method.toUpperCase();
    requestConfig.url = buildURL(fullPath, config.params, config.paramsSerializer);

    // Set the request timeout in MS
    // request.timeout = config.timeout;
    requestConfig.timeout = config.timeout;
    // console.log(time(), 'gmAdapter requestConfig: ', requestConfig);

    try {
    let request = {};
    // Listen for ready state
    requestConfig.onreadystatechange = function handleLoad(res) {
      // console.log(time(), 'gmAdapter readystatechange ', { readyState: res.readyState, status: res.status });
      if (!request || res.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (res.status === 0) {
        return;
      }

      // Prepare the response
      var responseHeaders = parseHeaders(res.responseHeaders);
      var responseData = !config.responseType || config.responseType === 'text' ? res.responseText : res.response;
      var response = {
        data: responseData,
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      // console.log(time(), 'gmAdapter readystatechange (load) response: ', response);

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };
    // console.log(time(), 'gmAdapter onreadystatechange: ', requestConfig.onreadystatechange);

    // Handle browser request cancellation (as opposed to a manual cancellation)
    requestConfig.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      // console.log(time(), 'gmAdapter abort (Request aborted)');
      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };
    // console.log(time(), 'gmAdapter onabort: ', requestConfig.onabort);

    // Handle low level network errors
    requestConfig.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      // console.log(time(), 'gmAdapter error (Network error)');
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };
    // console.log(time(), 'gmAdapter onerror: ', requestConfig.onerror);

    // Handle timeout
    requestConfig.ontimeout = function handleTimeout() {
      // console.log(time(), 'gmAdapter timeout (Request timeouted)');
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };
    // console.log(time(), 'gmAdapter ontimeout: ', requestConfig.ontimeout);

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // console.log(time(), 'gmAdapter is standard browser env');
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add responseType to request if needed
    if (config.responseType) {
      requestConfig.responseType = config.responseType;
    }
    // console.log(time(), 'gmAdapter responseType: ', config.responseType);

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      requestConfig.onprogress = config.onDownloadProgress;
    }
    // console.log(time(), 'gmAdapter onprogress: ', config.onDownloadProgress);

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function') {
      requestConfig.upload = {};
      requestConfig.upload.onprogress = config.onUploadProgress;
    }
    // console.log(time(), 'gmAdapter upload.onprogress: ', config.onUploadProgress);

    if (config.cancelToken) {
      // console.log(time(), 'gmAdapter config.cancelToken: ', config.cancelToken);
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }
    // console.log(time(), 'gmAdapter requestData: ', requestData);

    // Send the request
    requestConfig.data = requestData;
    if (typeof GM === 'undefined' || typeof GM.xmlHttpRequest === 'undefined') {
      console.log(time(), 'gmAdapter ERROR, GM.xmlHttpRequest not found');
      reject(createError('gmAdapter ERROR, GM.xmlHttpRequest not found', config));
      return;
    }
    // console.log(time(), 'gmAdapter start request..');
    request = GM.xmlHttpRequest(requestConfig);
    if (typeof request.abort !== 'function') {
      console.warn(time(), 'WARNING! gmAdapter does not support request.abort method!');
      request.abort = function() {};
    }
    } catch (e) {
      console.log(time(), 'ERROR: ', e);
      throw e;
    }
  });
};

// CONCATENATED MODULE: ./src/utils/random.js
const buffer = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';//~!@#$%^&*()_+=-?></\\[]{}|;:.,"\'№';

function random(size = 20) {
  if (!size) {
    size = 20;
  }
  let result = '';
  for (let i = 0; i < size; ++i) {
    result += buffer[Math.round(Math.random() * buffer.length) % buffer.length];
  }
  return result;
}
// CONCATENATED MODULE: ./src/utils/index.js








// EXTERNAL MODULE: ./src/components/modal/modal.css
var modal = __webpack_require__(1);

// CONCATENATED MODULE: ./src/components/modal/modal.js


const { Component } = require('preact');
const { html } = require('htm/preact');

const Header = (props) => {
  const { closeable, title, onClose, className } = props;
  return html`
    <div class="${className || 'modal-header'}">
      <div class="modal-header-title">${title}</div>
      <div class="modal-header-close ${closeable ? '' : 'hide'}" onClick=${onClose}><div/></div>
    </div>
  `;
};

const Footer = (props) => {
  const {
    onOk, onCancel, className, onOkText = 'Ok', onCancelText = 'Cancel',
  } = props;
  const buttonStyle = null;
  return html`
  <div class="${className || 'modal-footer-content'}">
    ${typeof onCancel === 'function' ? html`<div onClick=${onCancel} class="modal-button modal-oncancel" style=${buttonStyle}>${onCancelText || 'Cancel'}</div>` : null}
    ${typeof onOk === 'function' ? html`<div onClick=${onOk} class="modal-button modal-onok" style=${buttonStyle}>${onOkText || 'Ok'}</div>` : null}
  </div>
  `;
};

// stateless modal component
class modal_Modal extends Component {
  constructor(props, state) {
    super(props, state);
    console.log(time(), 'Modal::ctor props', props);
    this.props = props;
    if (props.name) {
      this.id = `${props.name}-${random(6)}`
    } else {
      this.id = random(12);
    }
    // binding
    this.render = this.render.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onOk = this.onOk.bind(this);
  }
  
  _callback(callback) {
    if (typeof callback === 'function') {
      callback();
    }
  }
  
  onClose(){
    const { onClose } = this.props;
    this._callback(onClose);
  }
  
  onOk() {
    const { onOk } = this.props;
    this._callback(onOk);
  }

  render(props, state) {
    const {
      title = 'Title', children, footer, visible, onOkText,
    } = props;
    return html`
    <div class="modal ${visible ? '' : 'hide'}" id="${this.id}" style=${props.style}>
      <${Header}
        title="${title}"
        className="modal-header"
        closeable
        onClose=${this.onClose}
      />
      <div class="modal-body">
        ${children}
      </div>
      <div class="modal-footer">
        ${footer || html`
        <${Footer}
          onOkText=${onOkText}
          onCancel=${this.onClose}
          onOk=${this.onOk}
        />
        `}
      </div>
    </div>
    ${!!visible && html`<div class="modal-mask" />`}
    `;
  }
}

/* harmony default export */ var modal_modal = (modal_Modal);


// CONCATENATED MODULE: ./src/components/modal/index.js

// CONCATENATED MODULE: ./src/utils/preact-redux/preact-redux.js

const { h, Component: preact_redux_Component, createContext } = require("preact");
const { html: preact_redux_html } = require('htm/preact');
const { bindActionCreators } = require('redux');

const ReduxStored = createContext({});

const Provider = props => h(ReduxStored.Provider, { value: { store: props.store } }, props.children);

const Consumer = ReduxStored.Consumer;
const connect = (mapStateToProps, mapDispatchToProps) => (Child) => {
  let dispatchProps = null;
  if (typeof mapDispatchToProps !== 'function') {
    const _obj = mapDispatchToProps || {};
    mapDispatchToProps = (dispatch) => {
      if (dispatchProps) {
        return dispatchProps;
      }
      dispatchProps = bindActionCreators(_obj, dispatch);
      return dispatchProps;
    };
  } else {
    const _func = mapDispatchToProps;
    mapDispatchToProps = (dispatch) => {
      if (dispatchProps) {
        return dispatchProps;
      }
      dispatchProps = _func(dispatch);
      return dispatchProps;
    };
  }

  return class extends preact_redux_Component {
    constructor(props, context) {
      super(props, context);
      this.context = context;
      this._render = this._render.bind(this);
      this._update = this._update.bind(this);
      this.state = { count: 0 };
    }

    componentWillUnmount() {
      if (typeof this._unsubscribe === 'function') {
        this._unsubscribe();
      }
    }

    _update() {
      const { count } = this.state;
      this.setState({ count: (count + 1) });
    }

    _render({ store }) {
      if (this._unsubscribe !== 'function') {
        this._unsubscribe = store.subscribe(this._update);
      }
      const _stateProps = mapStateToProps(store.getState(), this.props);
      const _dispatchProps = mapDispatchToProps(store.dispatch);
      const props = { ...this.props, ..._stateProps, ..._dispatchProps, store, dispatch: store.dispatch };
      return h(Child, props);
    }

    render() {
      return preact_redux_html`<${Consumer}>${this._render}<//>`;
    }
  };
};

// CONCATENATED MODULE: ./src/utils/preact-redux/index.js


// CONCATENATED MODULE: ./src/store/scenario/scenario.types.js

/** @type {Object.<string, string>} */
const types = keyMirror({
  ADD_SCENARIO: null,
  REMOVE_SCENARIO: null,
  SET_SCENARIO: null,
  INIT_SCENARIO: null,
  START_SCENARIO: null,
  CONTINUE_ACTIVE_SCENARIO: null,
  PAUSE_SCENARIO: null,
  END_ACTIVE_SCENARIO: null,
  LOGIN_ACTION: null,
  CREATE_BATTLE_ACTION: null,
  RESPONSE_TO_USER_ACTION: null,
  ACCEPT_GAME_START_ACTION: null,
  INIT_ACTIVE_EVENT: null,
  END_ACTIVE_EVENT: null,
  ERROR_ACTIVE_EVENT: null,
  SET_ACTIVE_ACTION: null,
  SET_PAUSED_ACTIVE_SCENARIO: null,
  MOVE_SCENARIO_EVENT: null,
  SET_ACTIVE_SCENARIO_INDEX: null,
  SET_SCENARIO_NAME: null,
  REMOVE_SCENARIO_ACTION: null,
  RESPONSE_TO_OWNER_ACTION: null,
  LOGOUT_ACTION: null,
  SET_SCENARIO_ACTION_PAYLOAD: null,
  CREATE_SCENARIO: null,
  ADD_SCENARIO_ACTION: null,
});

/* harmony default export */ var scenario_types = (types);
// CONCATENATED MODULE: ./src/store/scenario/scenario.reducer.js


const ACTIONS = {
  [scenario_types.LOGIN_ACTION]: {
    type: scenario_types.LOGIN_ACTION,
    name: 'login',
    description: 'залогиниться за пользователя (при необходимости предварительно разлогиниться)',
  },
  [scenario_types.LOGOUT_ACTION]: {
    type: scenario_types.LOGOUT_ACTION,
    name: 'logout',
    description: 'разлогиниться',
  },
  [scenario_types.CREATE_BATTLE_ACTION]: {
    type: scenario_types.CREATE_BATTLE_ACTION,
    name: 'create battle',
    description: 'создать баттл',
  },
  [scenario_types.RESPONSE_TO_USER_ACTION]: {
    type: scenario_types.RESPONSE_TO_USER_ACTION,
    name: 'response to user',
    description: 'кликнуть "ОК" или "Отмена" в модалке принятия игрока в баттл',
  },
  [scenario_types.RESPONSE_TO_OWNER_ACTION]: {
    type: scenario_types.RESPONSE_TO_OWNER_ACTION,
    name: 'response to owner',
    description: 'кликнуть "Принять" в списке баттлов, или кликнуть "Отмена" в правой панели',
  },
  [scenario_types.ACCEPT_GAME_START_ACTION]: {
    type: scenario_types.ACCEPT_GAME_START_ACTION,
    name: 'accept game start',
    description: 'клинуть "ОК" или "Отмена" в модалке начала баттла',
  },
};

const initialState = {
  isPlaying: false,
  index: 0,
  array: [{
    name: 'сценарий номер раз',
    actions: [{
      ...ACTIONS[scenario_types.LOGIN_ACTION],
      payload: { login: 'test1', password: '123' },
    }, {
      ...ACTIONS[scenario_types.CREATE_BATTLE_ACTION],
      payload: {},
    }, {
      ...ACTIONS[scenario_types.RESPONSE_TO_USER_ACTION],
      payload: { confirm: 1 },
    }, {
      ...ACTIONS[scenario_types.ACCEPT_GAME_START_ACTION],
      payload: { confirm: 1 },
    }],
  }, {
    name: 'сценарий номер второй!',
    actions: [{
      ...ACTIONS[scenario_types.LOGIN_ACTION],
      payload: { login: 'test2', password: '123' },
    }, {
      ...ACTIONS[scenario_types.RESPONSE_TO_OWNER_ACTION],
      payload: { confirm: 1 },
    }, {
      ...ACTIONS[scenario_types.ACCEPT_GAME_START_ACTION],
      payload: { confirm: 1 },
    }],
  }],
  _rawScenario: {},
  activeScenario: {},
  activeAction: {},
};

const _removeItem = (array, index) => {
  if (typeof index === 'undefined' || index <= -1) {
    return array;
  }
  return [
    ...array.slice(0, index),
    ...array.slice(index + 1)
  ];
};

const _updateItem = (array, index, item) => {
  if (typeof index === 'undefined' || index <= -1) {
    return array;
  }
  const result = [...array];
  result[index] = { ...item };
  return result;
};

const _createActiveAction = (action, index) => {
  return {
    ...action,
    index,
    startTime: 0,
    endTime: 0,
    error: '',
  };
};

const _getAction = (type, payload) => {
  if (!ACTIONS[type]) {
    throw new TypeError('invalid type (' + type + ')');
  }
  return {
    ...ACTIONS[type],
    payload: { ...payload },
  };
};

const _moveItem = (array, from, to) => {
  if (!Array.isArray(array)
    || array.length <= from
    || array.length <= to
    || typeof from !== 'number'
    || typeof to !== 'number'
    || from === to
  ) {
    return array;
  }
  const result = [...array];
  const item = result[from];
  result.splice(from, 1);
  result.splice(to, 0, item);
  return result;
};

/* harmony default export */ var scenario_reducer = ((state = initialState, action) => {
  switch (action.type) {
    case scenario_types.RAW_SET_SCENARIO_NAME:
      return {
        ...state,
        _rawScenario: {
          ...state._rawScenario,
          name: action.payload.name,
        },
      };
    // добавляем новое событие
    // ожидаемая структура action:
    /**
     * @param {object} action
     * @param {string} action.type
     * @param {object} action.payload
     * @param {string} action.payload.type - тип redux события (action)
     * @param {object} [action.payload.data]
     */
    case scenario_types.RAW_ADD_SCENARIO_ACTION:
      return {
        ...state,
        _rawScenario: {
          ...state._rawScenario,
          actions: Array.isArray(state._rawScenario.actions)
            ? [...state._rawScenario.actions, _getAction(action.payload.type, action.payload.data)]
            : [_getAction(action.payload.type, action.payload.data)],
        },
      };
    // удаляем событие из сценария
    // ожидаемая структура action:
    /**
     * @param {object} action
     * @param {string} action.type
     * @param {object} action.payload
     * @param {number} action.payload.index
     */
    case scenario_types.RAW_REMOVE_SCENARIO_ACTION:
      return {
        ...state,
        _rawScenario: {
          ...state._rawScenario,
          actions: _removeItem(state._rawScenario.actions, action.payload.index),
        },
      };
    // перемащаем событие
    // ожидаемая структура action:
    /**
     * @param {object} action
     * @param {string} action.type
     * @param {object} action.payload
     * @param {number} action.payload.index
     * @param {number} action.payload.to
     */
    case scenario_types.RAW_MOVE_SCENARIO_ACTION:
      return {
        ...state,
        _rawScenario: {
          ...state._rawScenario,
          actions: _moveItem(state._rawScenario.actions, action.payload.index, action.payload.to),
        },
      };
    // добавляем новый сценарий в конец массива
    case scenario_types.ADD_SCENARIO:
      return {
        ...state,
        array: [...state.array, { ...state._rawScenario, actions: [...state._rawScenario.actions] }],
      };
    case scenario_types.CREATE_SCENARIO:
      return {
        ...state,
        array: [
          ...state.array,
          {
            name: action.payload.name,
            actions: [],
          },
        ],
      };
    case scenario_types.ADD_SCENARIO_ACTION:
      return {
        ...state,
        array: _updateItem(
          state.array,
          action.payload.scenarioIndex,
          {
            ...state.array[action.payload.scenarioIndex],
            actions: [
              ...state.array[action.payload.scenarioIndex].actions,
              _getAction(action.payload.type, action.payload.data),
            ],
          },
        ),
      };
    // удаляем сценарий
    // ожидаемая структура action:
    /**
     * @param {object} action
     * @param {string} action.type
     * @param {object} action.payload
     * @param {number} [action.payload.index]
     * @param {string} [action.payload.name]
     */
    case scenario_types.REMOVE_SCENARIO:
      if (typeof action.payload.index !== 'undefined') {
        return {
          ...state,
          array: _removeItem(state.array, action.payload.index),
        };
      } else if (typeof action.payload.name === 'string') {
        return {
          ...state,
          array: _removeItem(state.array, state.array.findIndex(elm => elm.name === action.payload.name)),
        };
      }
      return state;
    case scenario_types.REMOVE_SCENARIO_ACTION:
      return {
        ...state,
        array: _updateItem(
          state.array,
          action.payload.scenarioIndex,
          {
            ...state.array[action.payload.scenarioIndex],
            actions: _removeItem(
              state.array[action.payload.scenarioIndex].actions,
              action.payload.index,
            ),
          },
        ),
      };
    case scenario_types.SET_SCENARIO_ACTION_PAYLOAD:
      return {
        ...state,
        array: _updateItem(
          state.array,
          action.payload.scenarioIndex,
          {
            ...state.array[action.payload.scenarioIndex],
            actions: _updateItem(
              state.array[action.payload.scenarioIndex].actions,
              action.payload.index,
              {
                ...state.array[action.payload.scenarioIndex].actions[action.payload.index],
                payload: { ...action.payload.data },
              },
            ),
          },
        ),
      };
    case scenario_types.SET_ACTIVE_SCENARIO_INDEX:
      return {
        ...state,
        index: action.payload.index,
      };
    // устанавливаем сценария, который будет запущен при вызове START_SCENARIO
    case scenario_types.INIT_SCENARIO:
      return {
        ...state,
        index: action.payload.index,
        activeScenario: {
          ...state.array[action.payload.index],
          index: action.payload.index,
          actions: state.array[action.payload.index].actions.map(_createActiveAction),
          startTime: new Date().toISOString(),
          paused: false,
          endTime: 0,
          error: '',
          currentActionIndex: -1,
        },
      };
    // запускаем сценарий
    // case types.START_SCENARIO:
      // return {
        // ...state,
        // activeScenario: {
          // ...state.activeScenario,
          // startedAt: new Date().toISOString(),
        // },
        // activeAction: {},
      // };
    case scenario_types.SET_PAUSED_ACTIVE_SCENARIO:
      return {
        ...state,
        activeScenario: {
          ...state.activeScenario,
          paused: !!action.payload.paused,
        },
      };
    case scenario_types.SET_ACTIVE_SCENARIO:
      return {
        ...state,
        activeScenario: {
          ...state.activeScenario,
          ...action.payload,
        },
      };
    // остнавливаем сценарий с возможностью автозапуска
    // ожидаемая структура action:
    /**
     * @param {object} action
     * @param {string} action.type
     * @param {object} [action.payload]
     * @param {boolean} [action.payload.autoplay]
     */
    case scenario_types.PAUSE_ACTIVE_SCENARIO:
      return {
        ...state,
        activeScenario: {
          ...state.activeScenario,
          pauseTime: new Date().toISOString(),
        },
      };
    // восстановливаем ранее остановленный сценарий
    case scenario_types.RESUME_ACTIVE_SCENARIO:
      return {
        ...state,
        activeScenario: {
          ...state.activeScenario,
          pauseTime: 0,
        },
      };
    // завершаем сценарий
    // ожидаемая структура action:
    /**
     * @param {object} action
     * @param {string} action.type
     * @param {object} [action.payload]
     * @param {string} [action.payload.error]
     */
    case scenario_types.END_ACTIVE_SCENARIO:
      return {
        ...state,
        isPlaying: false,
        array: _updateItem(
          state.array,
          state.activeScenario.index,
          {
            ...state.activeScenario,
            paused: null,
            endTime: new Date().toISOString(),
            error: action.payload ? (action.payload.error || '') : '',
            currentActionIndex: -1,
          },
        ),
        activeScenario: {},
        activeAction: {},
      };
    // устанавливаем параметры активного события
    // ожидаемая структура action:
    /**
     * @param {object} action
     * @param {string} action.type
     * @param {object} action.payload
     * @param {number} [action.payload.index]
     */
    case scenario_types.SET_ACTIVE_ACTION:
      return {
        ...state,
        activeScenario: {
          ...state.activeScenario,
          actions: _updateItem(
            state.activeScenario.actions,
            typeof action.payload.index !== 'undefined' ? action.payload.index : state.activeAction.index,
            {
              ...state.activeAction,
              ...action.payload,
            },
          ),
          currentActionIndex: typeof action.payload.index !== 'undefined' ? action.payload.index : state.activeAction.index,
        },
        activeAction: {
          ...state.activeAction,
          ...action.payload,
        },
      };
    case scenario_types.INIT_ACTIVE_EVENT:
      return {
        ...state,
        activeScenario: {
          ...state.activeScenario,
          actions: _updateItem(
            state.activeScenario.actions,
            action.payload.index,
            _createActiveAction(state.activeScenario.actions[action.payload.index], action.payload.index),
          ),
          currentActionIndex: action.payload.index,
        },
        activeAction: _createActiveAction(state.activeScenario.actions[action.payload.index], action.payload.index),
      };
    case scenario_types.END_ACTIVE_EVENT:
      return {
        ...state,
        activeScenario: {
          ...state.activeScenario,
          actions: _updateItem(
            state.activeScenario.actions,
            state.activeAction.index,
            {
              ...state.activeAction,
              endTime: new Date().toISOString(),
              error: '',
            },
          ),
        },
        activeAction: {
          ...state.activeAction,
          endTime: new Date().toISOString(),
          error: '',
        },
      };
    case scenario_types.ERROR_ACTIVE_EVENT:
      return {
        ...state,
        activeScenario: {
          ...state.activeScenario,
          actions: _updateItem(
            state.activeScenario.actions,
            state.activeAction.index,
            {
              ...state.activeAction,
              endTime: new Date().toISOString(),
              error: action.payload.error,
            },
          ),
        },
        activeAction: {
          ...state.activeAction,
          endTime: new Date().toISOString(),
          error: action.payload.error,
        },
      };
    case scenario_types.MOVE_SCENARIO_EVENT:
      return {
        ...state,
        array: _updateItem(
          state.array,
          action.payload.scenarioIndex, 
          {
            ...state.array[action.payload.scenarioIndex],
            actions: _moveItem(
              state.array[action.payload.scenarioIndex].actions,
              action.payload.index,
              action.payload.to,
            ),
          },
        ),
      };
    case scenario_types.SET_SCENARIO_NAME:
      return {
        ...state,
        array: _updateItem(
        state.array,
        action.payload.index,
        {
          ...state.array[action.payload.index],
          name: action.payload.name,
        }),
      };
    default:
      return state;
  }
});

// CONCATENATED MODULE: ./src/store/redux-events/events.js
function Events() {
  this._listeners = {};
};

Events.prototype._has = function _has(type, func) {
  const listeners = this._listeners[type];
  if (listeners && listeners.length) {
    for (const listener of listeners) {
      if (listener === func) {
        return true;
      }
    }
  }
  return false;
};

Events.prototype.on = function on(type, func) {
  if (typeof type === 'undefined') {
    throw new TypeError('"type" can not be undefined');
  }
  if (this._has(type, func)) {
    return () => {};
  }
  const self = this;
  const listeners = this._listeners[type] = this._listeners[type] || [];
  listeners.push(func);
  const remove = function remove() {
    const index = self._listeners[type].indexOf(func);
    if (index > -1) {
      self._listeners[type].splice(index, 1);
    }
  };
  return remove;
};

Events.prototype.emit = function emit(type, ...args) {
  const listeners = this._listeners[type];
  if (!Array.isArray(listeners) || !listeners.length) {
    return Promise.all([]);
  }
  const promise = listeners.map(func => func(...args));
  return Promise.all(promise);
};

/* harmony default export */ var redux_events_events = (Events);
// CONCATENATED MODULE: ./src/store/redux-events/redux-events.js


const emitter = new redux_events_events();

const noop = () => {};

const register = (type, func) => {
  return emitter.on(type, func);
};

const put = async (action, dispatch) => {
  const eventId = Math.floor(Math.random() * 8e6 + 1e6).toString();
  Object.defineProperty(action, 'redux-events/eventId', { value: eventId });
  dispatch(action);
  const handler = {
    resolve: noop,
    reject: noop,
    remove: noop,
  };
  handler.remove = emitter.on(eventId, (error, results) => {
    handler.remove();
    if (error) {
      handler.reject(error);
    } else {
      handler.resolve(results);
    }
  });
  return new Promise((resolve, reject) => {
    handler.resolve = resolve;
    handler.reject = reject;
  });
};

const reduxEventsMiddleware = () => {
  return ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action.type === 'string') {
      const eventId = action['redux-events/eventId'];
      const done = typeof eventId !== 'undefined' ? (results) => emitter.emit(eventId, null, results) : noop;
      const err  = typeof eventId !== 'undefined' ? (error) => emitter.emit(eventId, error) : noop;
      emitter
        .emit(action.type, action, dispatch, getState)
        .catch(err)
        .then(done);
    }
    return next(action);
  };
};

/* harmony default export */ var redux_events = (reduxEventsMiddleware());

// CONCATENATED MODULE: ./src/store/redux-events/index.js


// CONCATENATED MODULE: ./src/apisauce/apisauce.js

const apisauce = require('apisauce');

const { create } = apisauce;

const headers = {
  'X-Requested-With': 'XMLHttpRequest',
};

const apisauce_baseURL = window.location.origin;
const createApiSauce = (baseURL = window.location.origin) => create({ baseURL, adapter: gmAdapter, headers });

// CONCATENATED MODULE: ./src/apisauce/index.js

/* harmony default export */ var src_apisauce = (createApiSauce());
// CONCATENATED MODULE: ./src/store/user/user.api.js


const fetchUser = () => src_apisauce.post('/api/getuserbysession');

// CONCATENATED MODULE: ./src/store/scenario/scenario.actions.js


const actionInitScenario = (index) => ({ type: scenario_types.INIT_SCENARIO, payload: { index } });
const actionSetActiveScenarioIndex = (index) => ({ type: scenario_types.SET_ACTIVE_SCENARIO_INDEX, payload: { index } });
const actionStartScenario = (index) => ({ type: scenario_types.START_SCENARIO, payload: { index } });
const actionContinueActiveScenario = () => ({ type: scenario_types.CONTINUE_ACTIVE_SCENARIO });
const actionStartEvent = (index) => ({ type: scenario_types.INIT_ACTIVE_EVENT, payload: { index } });
const actionEndActiveEvent = () => ({ type: scenario_types.END_ACTIVE_EVENT });
const actionErrorActiveEvent = (error) => {
  let message;
  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === 'string') {
    message = error;
  } else {
    message = `unknown error`;
  }
  return {
    type: scenario_types.ERROR_ACTIVE_EVENT,
    payload: { error: message },
  };
};
const actionSetPausedActiveScenario = (paused = false) => ({ type: scenario_types.SET_PAUSED_ACTIVE_SCENARIO, payload: { paused } });

/** @param {{ scenarioIndex: number, index: number, to: number }} payload */
const actionMoveScenarioEvent = (payload) => ({ type: scenario_types.MOVE_SCENARIO_EVENT, payload });

/** @param {{ index: number, name: string }} payload */
const actionSetScenarioName = (payload) => ({ type: scenario_types.SET_SCENARIO_NAME, payload });

const actionDeleteScenario = (index) => ({ type: scenario_types.REMOVE_SCENARIO, payload: { index } });

/** @param {{ index: number, scenarioIndex: number }} payload */
const actionDeleteScenarioAction = (payload) => ({ type: scenario_types.REMOVE_SCENARIO_ACTION, payload });

/** @param {{ index: number, scenarioIndex: number, data: object }} payload */
const actionSetScenarioActionPayload = (payload) => ({ type: scenario_types.SET_SCENARIO_ACTION_PAYLOAD, payload });

const actionCreateScenario = (name = 'default name') => ({ type: scenario_types.CREATE_SCENARIO, payload: { name } });

/** @param {{ scenarioIndex: number, type: string, data: object }} payload */
const actionAddScenarioAction = (payload) => ({ type: scenario_types.ADD_SCENARIO_ACTION, payload });

// CONCATENATED MODULE: ./src/store/scenario/scenario.events.js






function setInput(input, value) {
  const lastValue = input.value;
  input.value = value;
  const event = new Event('input', { bubbles: true });
  // hack React15
  event.simulated = true;
  // hack React16 内部定义了descriptor拦截value，此处重置状态
  const tracker = input._valueTracker;
  if (tracker) {
    tracker.setValue(lastValue);
  }
  input.dispatchEvent(event);
}

function getReactInstance(element) {
  const keys = Object.keys(element);
  const __reactEventHandlers = keys.find(k => k.indexOf('reactEventHandlers') > -1);
  const __reactInternalInstance = keys.find(k => k.indexOf('reactInternalInstance') > -1);
  return {
    eventHandler: element[__reactEventHandlers],
    instance: element[__reactInternalInstance],
  };
}

function getReactSelect(element) {
  const { eventHandler, instance } = getReactInstance(element);
  let retval;
  retval = {
    keyDown: () => {
      eventHandler.onKeyDown({ key: 'ArrowDown', keyCode: 13, which: 13, preventDefault: () => {} });
      return retval;
    },
    get options() {
      return instance.return.pendingProps.options;
    },
    selectOption: (option) => {
      instance.return.pendingProps.selectOption(option);
      return retval;
    },
  };
  return retval;
}

const _waitInterval = async (checkFn, interval = 3000, timeout = 15000) => {
  if (!!checkFn()) {
    return true;
  }
  const handler = {};
  const promise = new Promise((resolve, reject) => {
    handler.resolve = resolve;
    handler.reject = reject;
  });
  let timer_timeout;
  let timer_interval;
  timer_timeout = setTimeout(() => {
    handler.resolve(false);
    clearInterval(timer_interval);
  }, timeout);
  timer_interval = setInterval(() => {
    if (!!checkFn()) {
      clearInterval(timer_interval);
      clearTimeout(timer_timeout);
      handler.resolve(true);
    }
  }, interval);
  return promise;
};

const _getScenario = (state) => state.scenario;

const delay = async (timeout = 1000) => {
  let timer;
  const promise = new Promise((resolve) => {
    timer = setTimeout(resolve, timeout);
  });
  promise.remove = () => clearTimeout(timer);
  return promise;
};

const isPausedScenario = (state) => state.scenario.activeScenario.paused;

/**
 * @param {object} action
 * @param {string} action.type
 * @param {{ index: number } } action.payload
 */
async function startScenario(action, dispatch, getState) {
  try {
    console.log(time(), 'start scenario: ', JSON.stringify(action, null, 2));
    let _index;
    if (typeof action.payload.index === 'number' && action.payload.index > -1) {
      console.log(time(), 'start scenario payload: ', action.payload);
      _index = action.payload.index;
    } else if (getState().scenario.index > -1) {
      console.log(time(), 'start scenario state: ', getState().scenario);
      _index = getState().scenario.index;
    } else {
      console.log(time(), 'start scenario default: ', 0);
      _index = 0;
    }
    await put(actionInitScenario(_index), dispatch);
    const { scenario } = getState();
    // получить список событий активного сценария
    const { activeScenario: { actions: events, name } = {} } = scenario;
    console.log(time(), 'startScenario name: ', name);
    console.log(time(), 'startScenario data: ', scenario);
    for (let index = 0; index < events.length; ++index) {
      const paused = isPausedScenario(getState());
      if (paused) {
        // останавливаем выполнение сценария
        return;
      }
      const event = events[index];
      const payload = { ...event.payload, index };
      // запуск события
      await put({ type: event.type, payload }, dispatch);
    }
    // завершение сценария
    dispatch({ type: scenario_types.END_ACTIVE_SCENARIO });
  } catch (e) {
    // обработка ошибки
    dispatch({ type: scenario_types.END_ACTIVE_SCENARIO, payload: { error: e.message } });
  }
}

async function continueActiveScenario(_, dispatch, getState) {
  try {
    const { scenario: { activeScenario = {}, activeAction = {} } = {} } = getState();
    const { name, startTime, endTime, error, actions: events, currentActionIndex = -1 } = activeScenario;
    if (!endTime && startTime && currentActionIndex > -1) {
      console.log(time(), 'continueActiveScenario data: ', activeScenario);
      let { index } = activeAction;
      // если событие не завершено, но было начато
      if (activeAction.startTime && !activeAction.endTime) {
        // то завершаем его
        dispatch({ type: scenario_types.END_ACTIVE_ACTION });
      // если событие завершено
      } else if (activeAction.startTime && activeAction.endTime) {
        // то переходим к следующему
        index += 1;
      }
      for (; index < events.length; ++index) {
        const paused = isPausedScenario(getState());
        if (paused) {
          // останавливаем выполнение сценария
          return;
        }
        const event = events[index];
        const payload = { ...event.payload, index };
        await put({ type: event.type, payload }, dispatch);
      }
      // завершаем сценарий
      dispatch({ type: scenario_types.END_ACTIVE_SCENARIO });
    } else {
      console.log(time(), 'continueActiveScenario - there is no active scenario');
    }
  } catch (e) {
    console.log(time(), 'continueActiveScenario error: ', e);
    // обработка ошибки
    dispatch({ type: scenario_types.END_ACTIVE_SCENARIO, payload: { error: e.message } });
  }
}

/**
 * @param {object} action
 * @param {string} action.type
 * @param {{ data: { login: string, password: string } }} action.payload
 * @param {function} dispatch
 * @param {function} getState
 */
async function loginAction(action, dispatch, getState) {
  try {
    dispatch(actionStartEvent(action.payload));
    const { login, password } = action.payload;
    const { ok, data: user } = await fetchUser();
    if (ok && user.id && (user.login === login || user.email === login)) {
      // уже залогинен за пользователя
      console.log(time(), 'loginAction already logged in', { ...action.payload }, { user });
      dispatch(actionEndActiveEvent());
      return;
    }
    if (user.id && user.login !== login && user.email !== login) {
      console.log(time(), 'loginAction logged in other user', { user });
      // если залогинен за другого пользователя, то разлогиниться
      const res = await _logoutUser();
      if (!res) {
        throw new Error('failed on logout');
      }
    }
    // залогиниться
    const res = await _loginUser({ login, password });
    if (!res) {
      throw new Error('failed on login');
    }
    dispatch(actionEndActiveEvent());
  } catch (e) {
    console.log(time(), 'loginAction error: ', e);
    dispatch(actionErrorActiveEvent(e));
    throw e;
  }
}

async function createBattleAction(action, dispatch) {
  try {
    dispatch(actionStartEvent(action.payload));
    // запомнить текущее кол-во баттлов
    const size = document.querySelectorAll('.ant-table-tbody tr.ant-table-row.lobby__table__row').length;
    // кликнуть кнопку "Cоздать баттл"
    const button = document.querySelector('.battle_info_panel__create_button');
    button.click();
    // дождаться появления модалки создания баттла
    const _res = await _waitInterval(() => (!!document.querySelector('.win-count-group')), 1000, 5000);
    if (!_res) {
      throw new Error('battle create modal not opened');
    }
    // создать баттл
    const buttons = document.querySelectorAll('.ant-modal-footer button');
    buttons[1].click();
    const checkBattles = () => {
      const nextSize = document.querySelectorAll('.ant-table-tbody tr.ant-table-row.lobby__table__row').length;
      return nextSize > size;
    };
    // дождаться увеличения кол-ва баттлов
    const res = await _waitInterval(checkBattles, 2000, 10000);
    if (!res) {
      throw new Error('battle not created');
    }
    dispatch(actionEndActiveEvent());
  } catch (e) {
    console.log(time(), 'createBattleAction error: ', e);
    dispatch(actionErrorActiveEvent(e));
    throw e;
  }
}

/**
 * @param {object} action
 * @param {string} action.type
 * @param {{ data: { confirm: number } }} action.payload
 */
async function responseToUserAction(action, dispatch) {
  try {
    dispatch(actionStartEvent(action.payload));
    const { confirm } = action.payload;
    const _getButtons = () => document.querySelectorAll('.confirm_battle_modal__buttons button');
    // дождаться появления модалки для принятия игрока в баттл
    const res = await _waitInterval(() => (!!_getButtons().length), 3000, 20000);
    if (!res) {
      throw new Error('confirm battle modal not opened');
    }
    const buttons = _getButtons();
    if (confirm !== 1) {
      // отклонить участие игрока в баттле
      buttons[0].click();
      dispatch(actionEndActiveEvent());
      return;
    }
    // подтвердить участие игрока в баттле
    buttons[1].click();
    const _getOpponent = () => {
      return document.querySelector('.my-battles__battle.battle-type .opponent');
    };
    // дождаться появления игрока в списке баттлов (правая колонка страницы)
    const _res = await _waitInterval(_getOpponent, 2000, 4000);
    if (!_res) {
      throw new Error('failed to confirm opponent (opponent not found in right sidebar)');
    }
    dispatch(actionEndActiveEvent());
  } catch (e) {
    console.log(time(), 'responseToUserAction error: ', e);
    dispatch(actionErrorActiveEvent(e));
    throw e;
  }
}

async function responseToOwnerAction(action, dispatch) {
  try {
    dispatch(actionStartEvent(action.payload));
    const { confirm } = action.payload;
    if (confirm !== 1) {
      dispatch(actionEndActiveEvent());
      return;
    }
    // все кнопки принятия баттлов
    const _getButtons = () => document.querySelectorAll('.ant-table-tbody tr.ant-table-row.lobby__table__row .button.button_aquamarine');
    // запомнить текущее кол-во баттлов
    const size = document.querySelectorAll('.ant-table-tbody tr.ant-table-row.lobby__table__row .betContainer').length;
    // активные кнопки принятия баттла
    const _getActiveButtons = () => {
      const buttons = _getButtons();
      return Array.prototype.slice.call(buttons).filter(b => !b.classList.contains('button_disabled'));
    };
    let button;
    if (size > 0) {
      button = _getActiveButtons()[0];
    }
    if (!button || size === 0) {
      const checkButton = () => (!!_getActiveButtons().length);
      // дождаться появления активной кнопки
      const res = await _waitInterval(checkButton, 1000, 10000);
      if (!res) {
        throw new Error('active battle not found');
      }
    }
    button = _getActiveButtons()[0];
    if (!button) {
      throw new Error('active battle\'s button not found');
    }
    // кликнуть кнопку "Принять баттл"
    button.click();
    dispatch(actionEndActiveEvent());
  } catch (e) {
    console.log(time(), 'responseToOwnerAction error: ', e);
    dispatch(actionErrorActiveEvent(e));
    throw e;
  }
}

/**
 * @param {object} action
 * @param {string} action.type
 * @param {{ data: { confirm: number } }} action.payload
 */
async function acceptGameStartAction(action, dispatch) {
  try {
    dispatch(actionStartEvent(action.payload));
    const { confirm, lane = 0 } = action.payload;
    const _getButtons = () => document.querySelectorAll('.start-game__buttons button');
    // дождаться появления модалки о начале игры
    const res = await _waitInterval(() => (!!_getButtons().length), 2000, 20000);
    if (!res) {
      throw new Error('accept game start modal not opened');
    }
    const buttons = _getButtons();
    console.log(time(), 'start buttons: ', buttons.length);
    if (confirm !== 1) {
      // отказаться от участия в игре
      await delay(500);
      buttons[0].click();
      dispatch(actionEndActiveEvent());
      return;
    }
    await delay(500);
    // выбор элемента из списка (React хак)
    const selectItem = (className, optionIndex) => {
      const element = document.querySelector(`.${className} > div > div`);
      console.log(time(), `element.${className}: `, element);
      const select = getReactSelect(element);
      console.log(time(), 'select.options: ', select.options);
      select.keyDown();
      optionIndex = optionIndex < 0 ? -optionIndex : optionIndex;
      if (select.options.length) {
        const option = select.options[optionIndex % select.options.length];
        select.selectOption(option);
      } else {
        throw new Error(`${className} no options`);
      }
    };
    // выбор боулинг центра
    const selectBC = async ({ country = 0, city = 0, name = 0, lane: _lane = lane } = {}) => {
      if (document.querySelector('.start-game__bowlingcenter__countyselect > div > div')) {
        await delay(500);
        // country
        selectItem('start-game__bowlingcenter__countyselect', country);
        await delay(500);
        // city
        selectItem('start-game__bowlingcenter__cityselect', city);
        await delay(500);
        // name
        selectItem('start-game__bowlingcenter__nameselect', name);
        await delay(100);
      }
      // lane
      selectItem('start-game__bowlingcenter__roadselect', _lane);
      await delay(100);
    };
    //
    await selectBC({ lane });
    await delay(500);
    buttons[1].click();
    const errorMessage = () => document.querySelector('.modal_code_error_message');
    // обработка модалки с ошибкой
    const _waitError = async () => {
      const error = await _waitInterval(() => (!!errorMessage()), 200, 2000);
      if (error) {
        // get modal content
        let modalContent = errorMessage();
        while (errorMessage && !modalContent.classList.contains('ant-modal-content')) {
          modalContent = modalContent.parentNode;
        }
        // close modal
        if (modalContent) {
          const button = modalContent.querySelector('.ant-modal-footer button');
          if (button) {
            button.click();
          }
        }
      }
      return error;
    };
    let _lane = lane;
    let count = 0;
    // при выборе уже занятой дорожки
    // 1. закрыть модалку с ошибкой
    while (await _waitError()) {
      count += 1;
      if (count > 3) {
        // 2. если 3 раза не удалось выбрать незанятую дорожку, то выкинуть исключение
        throw new Error('failed to select lane');
      }
      // 3. выбрать следующую дорожку
      _lane += 1;
      await selectBC({ country: 10, city: 10, name: 10, lane: _lane });
      await delay(100);
      buttons[1].click();
      await delay(100);
    }
    // дождаться появления карточки активной игры
    const res2 = await _waitInterval(() => (!!document.querySelector('.active_game_card__wait')), 300, 3000);
    if (!res2) {
      throw new Error('failed active_game_card__wait');
    }
    dispatch(actionEndActiveEvent());
  } catch (e) {
    console.log(time(), 'acceptGameStartAction error: ', e);
    dispatch(actionErrorActiveEvent(e));
    throw e;
  }
}

async function _logoutUser() {
  try {
    const checkHeaderLink = () => (!!document.querySelectorAll('a.headerLink').length);
    // дождаться появления заголовка
    const result = await _waitInterval(checkHeaderLink);
    if (!result) {
      console.log(time(), 'logout failed');
      return false;
    }
    const hs = document.querySelectorAll('a.headerLink');
    let button;
    if ((hs[hs.length - 1].innerText || '').trim().toLowerCase() === 'admin') {
      button = hs[hs.length - 2];
    } else {
      button = hs[hs.length - 1];
    }
    console.log(time(), 'logout button: ', button, button.innerText);
    button.click();
    await delay(1000);
    console.log(time(), 'logout done');
    return true;
  } catch (e) {
    console.log(time(), 'logout error: ', e);
    return false;
  }
}

async function _loginUser({ login, password } = {}) {
  try {
    await delay(4000);
    const checkForgotPasswordLink = () => document.querySelector('.forgotPasswordLink');
    // дождаться появления формы логина
    const result = await _waitInterval(checkForgotPasswordLink);
    if (!result) {
      console.log(time(), 'login failed (on check /login page)');
      return false;
    }
    const _getForm = (elm) => {
      while (elm && elm.tagName !== 'FORM') {
        elm = elm.parentNode;
      }
      return elm;
    };
    
    // login input
    const loginLabel = document.querySelector('label.input__tip[for="login"]');
    const loginInput = loginLabel.parentNode.querySelector('input');
    // password input
    const passwordLabel = document.querySelector('label.input__tip[for="password"]');
    const passwordInput = passwordLabel.parentNode.querySelector('input');
    // form
    const form = _getForm(loginInput);
    // buttons
    const buttons = form.querySelectorAll('button');
    // submit button
    const button = buttons[buttons.length - 2];
    
    await delay(2000);
    // заполнить поле "пароль"
    setInput(passwordInput, password);
    // заполнить поле "логин"
    setInput(loginInput, login);
    // кликнуть кнопку "Вход"
    button.click();
    // дождаться входа в аккаунт - должны появиться кнопки заголовков
    const checkHeaderLink = () => (!!document.querySelectorAll('.headerLink').length);
    const res = await _waitInterval(checkHeaderLink);
    if (!res) {
      throw new Error('failed (on /lobby page check)');
    }
    console.log(time(), 'login done');
    return true;
  } catch (e) {
    console.log(time(), 'login error: ', e);
    return false;
  }
}

function initScenarioEvents() {
  register(scenario_types.START_SCENARIO, startScenario);
  register(scenario_types.CONTINUE_ACTIVE_SCENARIO, continueActiveScenario);
  register(scenario_types.LOGIN_ACTION, loginAction);
  register(scenario_types.CREATE_BATTLE_ACTION, createBattleAction);
  register(scenario_types.RESPONSE_TO_USER_ACTION, responseToUserAction);
  register(scenario_types.RESPONSE_TO_OWNER_ACTION, responseToOwnerAction);
  register(scenario_types.ACCEPT_GAME_START_ACTION, acceptGameStartAction);
}


// CONCATENATED MODULE: ./src/store/scenario/index.js






// CONCATENATED MODULE: ./src/components/scenario/scenario.item.js


const { Component: scenario_item_Component } = require('preact');
const { html: scenario_item_html } = require('htm/preact');


const SAFE_JSON_stringify = (...args) => {
  try {
    return JSON.stringify(...args);
  } catch (e) {
    return `${args[0]}`;
  }
};

const ActionsList = Object.keys(ACTIONS).map(type => ({ ...ACTIONS[type], value: ACTIONS[type].name.replace(/\s+/g, '_') }));

class scenario_item_ScenarioItem extends scenario_item_Component {
  constructor(props, state) {
    super(props, state);
    this._renderAction = this._renderAction.bind(this);
    this.state = {
      isOpen: !!props.isOpen,
      name: props.scenario.name,
      selectedAction: ActionsList[0].value,
    };
    this.render = this.render.bind(this);
    this._onOpen = this._onOpen.bind(this);
    this._onClickAction = this._onClickAction.bind(this);
    this._onClickUp = this._onClickUp.bind(this);
    this._onClickDown = this._onClickDown.bind(this);
    this._onCheck = this._onCheck.bind(this);
    this._checkboxRef = this._checkboxRef.bind(this);
    this._onEdit = this._onEdit.bind(this);
    this._onInputName = this._onInputName.bind(this);
    this._onDelete = this._onDelete.bind(this);
    this._onDeleteAction = this._onDeleteAction.bind(this);
    this._onEditActionPayload = this._onEditActionPayload.bind(this);
    this._textareaRef = this._textareaRef.bind(this);
    this._onInputActionPayload = this._onInputActionPayload.bind(this);
    this._onClickAddNewAction = this._onClickAddNewAction.bind(this);
    this._renderActionsList = this._renderActionsList.bind(this);
    this._onChangeAction = this._onChangeAction.bind(this);
  }
  
  componentDidUpdate(prevProps) {
    const { isActive, isOpen: _isOpen, isOpenSingle } = this.props;
    const { isOpen } = this.state;
    if (isActive !== prevProps.isActive) {
      this._checkbox.checked = !!isActive;
    }
    if (!isOpenSingle && _isOpen !== prevProps.isOpen && isOpen !== _isOpen) {
      this.setState({ isOpen: _isOpen });
    }
  }
  
  _renderAction(action, index, array) {
    const { name, description } = action;
    const {
      [`isOpen-${index}`]: isOpen = false,
      [`isEditable-${index}`]: isEditable,
      [`actionPayload-${index}`]: actionPayload,
      [`onEditError-${index}`]: onEditError,
    } = this.state;
    const payload = SAFE_JSON_stringify(action.payload, null, 2);
    const content = isOpen ? scenario_item_html`
    <div class="scenario-action-description">
      <div class="scenario-action-description-header">Описание</div>
      <textarea disabled value=${description} />
    </div>
    <div class="scenario-action-payload ${index === (array.length - 1) ? 'last-child' : ''}">
      <div class="scenario-action-payload-header">
        <div>Данные</div>
        <div class="action-payload-edit" onClick=${this._onEditActionPayload(index)}>${isEditable ? 'Save' : 'Edit'}</div>
      </div>
      <textarea
        disabled=${!isEditable}
        value=${isEditable ? actionPayload : payload}
        onInput=${this._onInputActionPayload(index)}
        ref=${this._textareaRef(index)}
        class="${onEditError ? 'input-error' : ''}"
      />
      ${!!onEditError && scenario_item_html`<div class="error-message">${onEditError}</div>`}
    </div>
    ` : null;
    return scenario_item_html`
    <div class="scenario-actions-item" key=${index} >
      <div class="scenario-action-name">
        <div class="scenario-action-name-header" onClick=${this._onClickAction(index)} >Событие #${(index + 1)}</div>
        <input type="submit" value=${name} onClick=${this._onClickAction(index)} />
        <div class="scenario-action-up" title="Up" onClick=${this._onClickUp(index)}>${'>'}</div>
        <div class="scenario-action-down" title="Down" onClick=${this._onClickDown(index)}>${'>'}</div>
        <div class="scenario-action-delete symbol-box" onClick=${this._onDeleteAction(index)} >
          <div class="symbol-x" title="Delete" />
        </div>
      </div>
      ${content}
    </div>
    `;
  }
  
  _onInputActionPayload(index) {
    if (typeof this[`onInputActionPayload-${index}`] !== 'function') {
      const self = this;
      this[`onInputActionPayload-${index}`] = function (e) {
        console.log(time(), 'onInput textarea', index, e.target.value);
        self.setState({
          [`actionPayload-${index}`]: e.target.value,
          [`onEditError-${index}`]: '',
        });
      };
    }
    return this[`onInputActionPayload-${index}`];
  }
    
  
  _textareaRef(index) {
    if (typeof this[`textareaRef-${index}`] !== 'function') {
      const self = this;
      this[`textareaRef-${index}`] = function(ref) {
        self[`textarea-${index}`] = ref;
      };
    }
    return this[`textareaRef-${index}`];
  }
  
  _onEditActionPayload(index) {
    if (typeof this[`onEditActionPayload-${index}`] !== 'function') {
      const self = this;
      this[`onEditActionPayload-${index}`] = function(e) {
        const {
          [`isEditable-${index}`]: isEditable,
          [`actionPayload-${index}`]: actionPayload,
        } = self.state;
        if (isEditable) {
          // сохранить новое значение
          try {
            const payload = JSON.parse(actionPayload);
            const { setScenarioActionPayload, index: scenarioIndex } = self.props;
            setScenarioActionPayload({
              index,
              scenarioIndex,
              data: payload,
            });
            self.setState({ [`isEditable-${index}`]: !isEditable });
          } catch (e) {
            console.log(time(), 'onEdit actionPayload, error: ', e);
            self.setState({
              [`onEditError-${index}`]: e.message,
            });
          }
        } else {
          // "включить" редактирование
          const { scenario: { actions } } = self.props;
          const { payload } = actions[index];
          self.setState({
            [`actionPayload-${index}`]: SAFE_JSON_stringify(payload, null, 2),
            [`onEditError-${index}`]: '',
          });
          self.setState({ [`isEditable-${index}`]: !isEditable });
        }
      };
    }
    return this[`onEditActionPayload-${index}`];
  }
      
  
  _onClickUp(index) {
    if (typeof this[`onClickUp-${index}`] !== 'function') {
      const self = this;
      this[`onClickUp-${index}`] = function(e) {
        e.preventDefault();
        const {
          moveScenarioEvent,
          index: scenarioIndex,
        } = self.props;
        if (index === 0) {
          return;
        }
        const to = index - 1;
        console.log(time(), 'moveScenarioEvent up: ', { scenarioIndex, index, to });
        moveScenarioEvent({ scenarioIndex, index, to });
      };
    }
    return this[`onClickUp-${index}`];
  }
  
  _onClickDown(index) {
    if (typeof this[`onClickDown-${index}`] !== 'function') {
      const self = this;
      this[`onClickDown-${index}`] = function(e) {
        e.preventDefault();
        const {
          moveScenarioEvent,
          index: scenarioIndex,
          scenario: { actions },
        } = self.props;
        if (index === actions.length - 1) {
          return;
        }
        const to = index + 1;
        console.log(time(), 'moveScenarioEvent down: ', { scenarioIndex, index, to });
        moveScenarioEvent({ scenarioIndex, index, to });
      };
    }
    return this[`onClickDown-${index}`];
  }
  
  _onClickAction(index) {
    if (typeof this[`onClickAction-${index}`] !== 'function') {
      const self = this;
      this[`onClickAction-${index}`] = function() {
        const { [`isOpen-${index}`]: isOpen = false } = self.state;
        console.log(time(), index, 'isOpen: ', isOpen);
        self.setState({
          [`isOpen-${index}`]: !isOpen,
        });
      };
    }
    return this[`onClickAction-${index}`];
  }
  
  _onOpen() {
    const { index, setOpen, isOpen: _isOpen, isOpenSingle = false } = this.props;
    const { isOpen } = this.state;
    console.log(time(), 'onOpen: ', { index, setOpen, isOpen, _isOpen });
    if (isOpenSingle) {
      setOpen(index, !_isOpen);
    } else {
      this.setState({ isOpen: !isOpen });
    }
  }
  
  _onCheck(e) {
    const { setActiveScenarioIndex, index } = this.props;
    console.log('on check: ', { value: e.target.value, checked: e.target.checked, scenarioIndex: index });
    setActiveScenarioIndex(e.target.checked ? index : -1);
  }
  
  _checkboxRef(ref) {
    this._checkbox = ref;
  }
  
  _onEdit() {
    const { isEditable, name } = this.state;
    this.setState({
      isEditable: !isEditable,
    });
    if (isEditable) {
      const { setScenarioName, index } = this.props;
      setScenarioName({ name, index });
    }
  }
  
  _onInputName(e) {
    this.setState({
      name: e.target.value,
    });
  }
  
  _onDelete() {
    const { index, deleteScenario, scenario } = this.props;
    if (confirm('Are you sure you want to delete this scenario (name = ' + scenario.name + ')')) {
      deleteScenario(index);
    }
  }
  
  _onDeleteAction(index) {
    if (typeof this[`onDeleteAction-${index}`] !== 'function') {
      const self = this;
      this[`onDeleteAction-${index}`] = function (e) {
        const {
          index: scenarioIndex,
          deleteScenarioAction,
          scenario: { actions },
        } = self.props;
        if (confirm('Are you sure you want to delete this action (name = ' + actions[index].name + ')')) {
          deleteScenarioAction({ scenarioIndex, index });
        }
      };
    }
    return this[`onDeleteAction-${index}`];
  }
  
  _onClickAddNewAction() {
    const { index: scenarioIndex, addScenarioAction } = this.props;
    const { selectedAction } = this.state;
    console.log(time(), 'onAdd new action: ', scenarioIndex, selectedAction);
    try {
      addScenarioAction({ scenarioIndex, type: ActionsList.find(al => al.value === selectedAction).type, data: {} });
    } catch (e) {
      console.log(time(), '_onClickAddNewAction error: ', e);
    }
  }
  
  _renderActionsList(action, index, array) {
    const { name, description, value } = action;
    return scenario_item_html`
      <option value="${value}" title="${description}">${name}</option>
    `;
  }
  
  _onChangeAction(e) {
    console.log(time(), 'onChange action: ', e.target.value);
    this.setState({ selectedAction: e.target.value });
  }
  
  render(props, state) {
    const {
      scenario, index, isOpen: _isOpen = false, isActive, isOpenSingle,
    } = props;
    const { isEditable, isOpen } = state;
    const scenarioContent = !!(isOpenSingle ? _isOpen : isOpen)
    && scenario_item_html`
    <div class="scenario-actions-container">
      ${scenario.actions.map(this._renderAction)}
    </div>
    <div class="scenario-add-new-action-container">
      <div class="scenario-action-name-header">Событие #${(scenario.actions.length + 1)}</div>
      <div class="scenario-new-action-types">
        <select onChange=${this._onChangeAction}>
          ${ActionsList.map(this._renderActionsList)}
        </select>
      </div>
      <div class="scenario-add-new-action-button symbol-box" title="Add" onClick=${this._onClickAddNewAction}><div class="symbol-plus" /></div>
    </div>
    `;
    return scenario_item_html`
    <div class="scenario-item ${isActive ? 'scenario-active' : ''}">
      <div class="scenario-title">
        <input type="checkbox" title="Activate" checked="${!!isActive}" onClick=${this._onCheck} ref=${this._checkboxRef} />
        ${isEditable ?
          scenario_item_html`<input type="text" value=${state.name} onInput=${this._onInputName} id=${'scenario-edit-' + index}/>`
        :
          scenario_item_html`<input type="submit" value=${scenario.name} onClick=${this._onOpen} />`
        }
        <label for=${'scenario-edit-' + index} onClick=${this._onEdit} >${isEditable ? 'Save' : 'Edit'}</label>
        <div class="scenario-delete symbol-box" onClick=${this._onDelete}>
          <div class="symbol-x" title="Delete" />
        </div>
      </div>
      ${scenarioContent}
    </div>
    `;
  }
}

/* harmony default export */ var scenario_item = (scenario_item_ScenarioItem);

// EXTERNAL MODULE: ./src/components/scenario/scenario.css
var scenario_scenario = __webpack_require__(2);

// CONCATENATED MODULE: ./src/components/scenario/scenario.js


const { h: scenario_h, Component: scenario_Component } = require('preact');
const { html: scenario_html } = require('htm/preact');






class scenario_ScenarioModal extends scenario_Component {
  constructor(props, state) {
    super(props, state);
    console.log(time(), 'Scenario::ctor props', props);
    this.props = props;
    if (props.name) {
      this.id = `${name}-${random(6)}`
    } else {
      this.id = random(12);
    }
    this.state = {
      visible: true,
      activeScenarioIndex: props.scenario.index,
      isOpen: true,
    };
    this.render = this.render.bind(this);
    this._onOk = this._onOk.bind(this);
    this._onClose = this._onClose.bind(this);
    this._renderScenario = this._renderScenario.bind(this);
    this._setOpen = this._setOpen.bind(this);
    this._onClickAdd = this._onClickAdd.bind(this);
    this._onClickEdit = this._onClickEdit.bind(this);
    this._onClickRemove = this._onClickRemove.bind(this);
    this._renderFooter = this._renderFooter.bind(this);
    this._renderScenarioTip = this._renderScenarioTip.bind(this);
    this._onShow = this._onShow.bind(this);
  }
  
  componentDidUpdate(prevProps) {
    const { rehydrated, scenario } = this.props;
    if (rehydrated !== prevProps.rehydrated && rehydrated) {
      this.setState({
        activeScenarioIndex: scenario.index,
      });
    }
  }
  
  _onOk() {
    const { visible } = this.state;
    this.setState({ visible: !visible });
    const { startScenario } = this.props;
    startScenario();
  }
  
  _onClose() {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  }
  
  _renderScenario(item, index, array) {
    const {
      moveScenarioEvent,
      setActiveScenarioIndex,
      setScenarioName,
      deleteScenario,
      deleteScenarioAction,
      setScenarioActionPayload,
      createScenario,
      addScenarioAction,
      scenario: { index: scenarioIndex },
    } = this.props;
    const { activeScenarioIndex, isOpen } = this.state;
    return scenario_html`
    <${scenario_item}
      isActive=${index === scenarioIndex}
      isOpen=${activeScenarioIndex === index && isOpen}
      scenario=${item}
      index=${index}
      setOpen=${this._setOpen}
      moveScenarioEvent=${moveScenarioEvent}
      setActiveScenarioIndex=${setActiveScenarioIndex}
      setScenarioName=${setScenarioName}
      deleteScenario=${deleteScenario}
      deleteScenarioAction=${deleteScenarioAction}
      setScenarioActionPayload=${setScenarioActionPayload}
      createScenario=${createScenario}
      addScenarioAction=${addScenarioAction}
    />
    `;
  }
  
  _setOpen(index, isOpen) {
    this.setState({ activeScenarioIndex: index, isOpen });
  }
  
  _onClickAdd(e) {
    console.log('onClick add', e.target);
    const { createScenario } = this.props;
    createScenario();
  }
  
  _onClickEdit(e) {
    console.log('onClick edit', e.target);
  }
  
  _onClickRemove(e) {
    console.log('onClick remove', e.target);
  }
  
  _onShow() {
    this.setState({ visible: true });
  }
  
  _renderFooter() {
    return scenario_html`
    <div class="scenario-footer-buttons">
      <div>Новый сценарий</div>
      <div
        class="scenario-add-new-item symbol-box"
        onClick=${this._onClickAdd}
        title="Create"
      >
        <div class="symbol-plus" />
      </div>
    </div>
    `;
  }
  
  _renderScenarioTip() {
    const { visible } = this.state;
    if (visible) {
      return null;
    }
    return scenario_html`
    <div class="scenario-tip" onClick=${this._onShow}>
      <div class="symbol-box"><div class="symbol-plus" /></div>
    </div>
    `;
  }
  
  render(props, state) {
    const { index, array } = props.scenario;
    return scenario_html`
    <div>
    <${modal_modal}
      name="scenario-modal"
      title="Scenario"
      visible=${this.state.visible}
      onOk=${this._onOk}
      onOkText="Start"
      onClose=${this._onClose}
      style=${{ 'min-width': '50%' }}
    >
      <div class="scenario-modal-body">
        <div class="scenario-list">
          ${array.map(this._renderScenario)}
        </div>
        ${this._renderFooter()}
      </div>
    <//>
    ${this._renderScenarioTip()}
    </div>
    `;
  }
}

/* harmony default export */ var components_scenario_scenario = (connect(
  (state) => ({
    scenario: state.scenario,
    rehydrated: !!state._persist && state._persist.rehydrated,
  }),
  {
    moveScenarioEvent: scenario_actions_namespaceObject.actionMoveScenarioEvent,
    setActiveScenarioIndex: scenario_actions_namespaceObject.actionSetActiveScenarioIndex,
    setScenarioName: scenario_actions_namespaceObject.actionSetScenarioName,
    deleteScenario: scenario_actions_namespaceObject.actionDeleteScenario,
    deleteScenarioAction: scenario_actions_namespaceObject.actionDeleteScenarioAction,
    setScenarioActionPayload: scenario_actions_namespaceObject.actionSetScenarioActionPayload,
    createScenario: scenario_actions_namespaceObject.actionCreateScenario,
    addScenarioAction: scenario_actions_namespaceObject.actionAddScenarioAction,
    startScenario: scenario_actions_namespaceObject.actionStartScenario,
  },
)(scenario_ScenarioModal));
// CONCATENATED MODULE: ./src/components/scenario/index.js

// CONCATENATED MODULE: ./src/components/index.js




// EXTERNAL MODULE: ./node_modules/redux-persist/lib/stateReconciler/autoMergeLevel2.js
var autoMergeLevel2 = __webpack_require__(0);
var autoMergeLevel2_default = /*#__PURE__*/__webpack_require__.n(autoMergeLevel2);

// CONCATENATED MODULE: ./src/store/storage/createGMStorage.js


function createGMStorage_noop() {}
const noopStorage = {
  getIteam: createGMStorage_noop,
  setItem: createGMStorage_noop,
  removeItem: createGMStorage_noop,
};

function createGMStorage() {
  const condition1 = typeof GM === 'object'
    && typeof GM.setValue === 'function'
    && typeof GM.getValue === 'function'
    && typeof GM.deleteValue === 'function';
  const condition2 = typeof GM_setValue === 'function'
    && typeof GM_getValue === 'function'
    && typeof GM_deleteValue === 'function';
  if (condition1) {
    return {
      getItem: (key) => GM.getValue(key),
      setItem: (key, item) => GM.setValue(key, item),
      removeItem: (key) => GM.deleteValue(key),
    };
  }
  if (condition2) {
    return {
      getItem: (key) => new Promise(resolve => resolve(GM_getValue(key))),
      setItem: (key, item) => new Promise(resolve => resolve(GM_setValue(key, item))),
      removeItem: (key) => new Promise(resolve => resolve(GM_deleteValue(key))),
    };
  }
  console.warn(`[${time()}] GMStorage creation failed, persistence will be disabled`);
  return noopStorage;
};

// CONCATENATED MODULE: ./src/store/storage/index.js


/* harmony default export */ var storage = (createGMStorage());
// CONCATENATED MODULE: ./src/store/user/user.types.js

/** @type {Object.<string, string>} */
const user_types_types = keyMirror({
  FETCH_USER: null,
  SET_USER: null,
});

/* harmony default export */ var user_types = (user_types_types);
// CONCATENATED MODULE: ./src/store/user/user.reducer.js


const user_reducer_initialState = {
  data: {},
  fetching: false,
  error: '',
};

/* harmony default export */ var user_reducer = ((state = user_reducer_initialState, action) => {
  switch (action.type) {
    case user_types.FETCH_USER:
      return {
        ...state,
        fetching: true,
        error: '',
      };
    case user_types.SET_USER:
      if (action.payload.error) {
        return {
          ...state,
          fetching: false,
          error: action.payload.error,
        };
      }
      return {
        ...state,
        data: action.payload.data,
        fetching: false,
        error: '',
      };
    default:
      return state;
  }
});
// CONCATENATED MODULE: ./src/store/user/user.saga.js



const { put: user_saga_put, call, takeLatest } = require('redux-saga/effects');

function* user_saga_fetchUser() {
  try {
    const result = yield call(fetchUser);
    if (result.ok && result.data.id) {
      yield user_saga_put({ type: user_types.SET_USER, payload: { data: result.data } });
      return true;
    } else {
      yield user_saga_put({ type: user_types.SET_USER, payload: { error: result.problem } });
      return false;
    }
  } catch (error) {
    console.log(time(), 'ERROR! fetchUser: ', error);
    yield user_saga_put({ type: user_types.SET_USER, payload: { error: error.message } });
    return false;
  }
}

function* initUserSaga() {
  yield takeLatest(user_types.FETCH_USER, user_saga_fetchUser);
}
// CONCATENATED MODULE: ./src/store/user/index.js






// CONCATENATED MODULE: ./src/store/reducers/reducers.js
// import { combineReducers } from 'redux';



const { combineReducers } = require('redux');

const rootReducer = combineReducers({
  user: user_reducer,
  scenario: scenario_reducer,
});

/* harmony default export */ var reducers = (rootReducer);
// CONCATENATED MODULE: ./src/store/reducers/index.js

// CONCATENATED MODULE: ./src/store/types/types.js



/* harmony default export */ var types_types = ({
  ...user_types,
  ...scenario_types,
});
// CONCATENATED MODULE: ./src/store/types/index.js

// CONCATENATED MODULE: ./src/store/sagas/start.saga.js


const { put: start_saga_put, select: start_saga_select, all: start_saga_all } = require('redux-saga/effects');

const getUser = state => state.user;

function* startSaga() {
  try {
    yield start_saga_all([
      start_saga_put({ type: types_types.FETCH_USER }),
    ]);
    const user = yield start_saga_select(getUser);
    console.log(time(), 'user: ', user);
  } catch (error) {
    console.log(time(), 'startSaga.error: ', error);
  }
}

// CONCATENATED MODULE: ./src/store/sagas/sagas.js


// import { scenarioSaga } from '../scenario';

const { all: sagas_all, takeEvery } = require('redux-saga/effects');
const { default: createSagaMiddleware } = require('redux-saga');

function* initSaga() {
  yield sagas_all([
    takeEvery('persist/REHYDRATE', startSaga),
    initUserSaga(),
    // scenarioSaga(),
  ]);
}

const sagaMiddleware = createSagaMiddleware();

// CONCATENATED MODULE: ./src/store/sagas/index.js


// CONCATENATED MODULE: ./src/store/reduxLogger.js


function loggerMiddleware ({ getState }) {
  return next => action => {
    console.log(time(), 'will dispatch', action)
    // Call the next dispatch method in the middleware chain.
    const returnValue = next(action)
    console.log(time(), 'state after dispatch', getState())
    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue
  }
}

// CONCATENATED MODULE: ./src/store/events/events.js


function initEvents() {
  initScenarioEvents();
}
// CONCATENATED MODULE: ./src/store/events/index.js

// CONCATENATED MODULE: ./src/store/configureStore.js







const { createStore, applyMiddleware } = require('redux');
const { persistStore, persistReducer } = require('redux-persist');


initEvents();

const persistConfig = {
  key: 'root',
  storage: storage,
  stateReconciler: autoMergeLevel2_default.a,
  // blacklist: ['scenario'],
}

const persistedReducer = persistReducer(persistConfig, reducers)

/* harmony default export */ var configureStore = (() => {
  let store = createStore(persistedReducer, applyMiddleware(redux_events, sagaMiddleware, loggerMiddleware))
  let persistor = persistStore(store)
  sagaMiddleware.run(initSaga);
  // persistor.purge();
  return { store, persistor }
});
// CONCATENATED MODULE: ./src/store/index.js




const { store: store_store, persistor: store_persistor } = configureStore();



// CONCATENATED MODULE: ./app.js




const { h: app_h, Component: app_Component } = require('preact');

class app_App extends app_Component {
  render(){
    return app_h(
      Provider,
      { store: store_store },
      app_h(components_scenario_scenario),
    );
  }
}

// CONCATENATED MODULE: ./index.js


const { render } = require('preact');
const { html: index_html } = require('htm/preact');

let root = document.getElementById('__root');
if (!root) {
  root = document.createElement('div');
  root.id = '__root';
  document.body.appendChild(root);
  console.log(time(), 'root: ', root);
}
render(index_html`<${app_App}/>`, root);

/***/ })
/******/ ]);
});
})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window, window);

(function(){
  const styles = `
.modal.hide {
  display: none;
}
.modal {
	position: fixed;
	top: 10px;
	right: 10px;
	background-color: #0c131c;
	z-index: 10000;
	color: #fff;
	min-width: 200px;
}
.modal-mask {
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	background-color: rgba(77,77,77,.7);
	height: 100%;
	z-index: 1000;
	filter: alpha(opacity=50);
}
.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px;
  border-bottom: 1px solid #6d7177;
}

.modal-body .modal-footer {
  display: flex;
  padding: 5px 10px;
}

.modal-header-title {
	text-transform: uppercase;
	font-weight: 700;
	letter-spacing: 0.1em;
	font-family: Oswald;
}

.modal-footer {
  border-top: 1px solid #6d7177;
}

.modal-footer-content {
	display: flex;
	justify-content: space-between;
	padding: 10px 10px;
}

.modal-button {
	cursor: pointer;
	border-width: 1px;
	border-style: solid;
	padding: 10px 5px;
	flex: 1;
	display: flex;
	justify-content: center;
	border-color: #20a39e;
}

.modal-button:hover {
  border-color: #00bfbf;
}

.modal-oncancel {
	color: #20a39e;
  margin-right: 10px;
}
.modal-oncancel:hover {
  color: #00bfbf;
}

.modal-onok {
	background-color: #20a39e;
	text-transform: uppercase;
}
.modal-onok:hover {
	background-color: #00bfbf;
}

.modal-header-close {
	z-index: 12;
	cursor: pointer;
	border-width: 0.5px;
	border-style: solid;
	display: flex;
	align-items: center;
	justify-content: center;
	border-color: #6d7177;
}

.modal-header-close, .modal-header-close div {
	width: 20px;
	height: 20px;
}

.modal-header-close div {
	display: flex;
	flex-direction: row;
	justify-content: center;
	width: 14px;
	height: 14px;
}


.modal-header-close div::after, .modal-header-close div::before {
	content: "";
	position: absolute;
	background: #6d7177;
	width: 1.5px;
	height: 14px;
	display: block;
	transform: rotate(45deg);
}

.modal-header-close div::before {
	transform: rotate(-45deg);
}


.scenario-tip {
  position: fixed;
  bottom: 10px;
  left: 10px;
  width: 20px;
  height: 20px;
  background: #0c131c;
  cursor: pointer;
  z-index: 1000;
}
.scenario-modal-body {
  min-width: 25%;
  max-height: 400px;
  overflow-y: scroll;
}

.scenario-title {
  display: flex;
  align-items: center;
}

.scenario-title input[type="checkbox"] {
  margin-left: 10px;
  width: 12px;
  height: 12px;
}

.scenario-title label:hover {
  color: #fff;
}
.scenario-title label {
  margin-right: 10px;
  cursor: pointer;
  font-size: 12px;
  padding: 5px;
  color: #6d7177;
}

.scenario-title .scenario-delete {
  margin-right: 10px;
}

.scenario-footer-buttons {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	padding-left: 10px;
	padding-right: 10px;
}

.scenario-footer-buttons > div:first-child {
  font-size: 12px;
  margin-right: 10px;
  line-height: 28px;
}

.scenario-add-remove-buttons-container {
	display: flex;
}

.scenario-add-new {
	margin-right: 10px;
}

.scenario-add-new,
.scenario-remove-selected {
	width: 20px;
	height: 20px;
	cursor: pointer;
	border: 0.5px solid #6d7177;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	margin-top: 5px;
	margin-bottom: 5px;
  box-sizing: border-box;
  background-color: #0c131c;
  flex-shrink: 0;
}

.scenario-add-new-action-container {
	display: flex;
	align-items: center;
	padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.scenario-add-new-action-container > div:not(:first-child) {
  margin-left: 10px;
}

.scenario-new-action-types select::-ms-expand {
  display: none;
}

.scenario-new-action-types select {
  background-color: transparent;
  color: #fff;
  border: 1px solid #6d7177;
  -webkit-appearance: none;
  -moz-appearance: none;
  text-indent: 1px;
  text-overflow: '';
  line-height: 24px;
  padding: 0 5px;
}

.scenario-edit-button-container button {
	font-size: 12px;
	text-transform: capitalize;
  background-color: #0c131c;
  cursor: pointer;
  border: none;
}

.scenario-item.scenario-active .scenario-title input[type="submit"] {
	color: #fff;
}

.scenario-button-active {
  border-color: rgba(255, 255, 255, 0.7);
  color: #fff;
}

.symbol-box:hover,
.symbol-box.symbol-active {
  border-color: rgba(255, 255, 255, 0.7);
  color: #fff;
}

.symbol-box {
	width: 20px;
	height: 20px;
	cursor: pointer;
	border: 0.5px solid #6d7177;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
  box-sizing: border-box;
  flex-shrink: 0;
}

.symbol-minus:hover:before,
.symbol-minus:hover:after,
.symbol-plus:hover:before,
.symbol-plus:hover:after,
.symbol-x:hover:before,
.symbol-x:hover:after,
.symbol-x.symbol-active:before,
.symbol-x.symbol-active:after,
.symbol-minus.symbol-active:before,
.symbol-minus.symbol-active:after,
.symbol-plus.symbol-active:before,
.symbol-plus.symbol-active:after {
  background-color: rgba(255, 255, 255, 0.7);
}

.symbol-x,
.symbol-plus,
.symbol-minus {
  width: 14px;
  height: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.symbol-plus:before {
	transform: rotate(180deg) !important;
}
.symbol-minus:after,
.symbol-plus:after,
.symbol-plus:before {
	content: "";
	position: absolute;
	background: #6d7177;
	width: 1px;
	height: 14px;
	display: block;
	transform: rotate(90deg);
}

.symbol-x:before,
.symbol-x:after {
	content: "";
	position: absolute;
	background: #6d7177;
	width: 1.5px;
	height: 14px;
	display: block;
	transform: rotate(45deg);
}

.symbol-x:before {
  transform: rotate(-45deg);
}

.scenario-action-name {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 10px;
  background-color: #252b32;
  cursor: pointer;
}

.scenario-action-up {
  transform: rotate(-90deg);
}

.scenario-action-down{
  transform: rotate(90deg);
}

.scenario-action-up:hover,
.scenario-action-down:hover {
  color: #fff;
  border-color: #fff;
}

.scenario-action-up,
.scenario-action-down {
	color: #6d7177;
	padding: 2px;
	border: 1px solid;
	width: 14px;
	height: 14px;
	text-align: center;
	flex-shrink: 0;
	margin-right: 6px;
	text-align: center;
	justify-content: center;
	align-items: center;
	display: flex;
}

.scenario-action-payload,
.scenario-action-description {
  padding: 10px;
}

.scenario-action-name-header {
  min-width: 70px;
}

.scenario-action-payload-header {
	display: flex;
	justify-content: flex-start;
}
.scenario-action-payload-header .action-payload-edit {
  cursor: pointer;
  opacity: 0.8;
  margin-left: 10px;
}
.scenario-action-payload-header .action-payload-edit:hover {
  color: #fff;
  opacity: 1;
}

.scenario-action-name-header,
.scenario-action-payload-header,
.scenario-action-description-header {
	color: #fff;
	font-size: 12px;
	opacity: 0.8;
}

.scenario-action-name input {
  border: none;
  padding: 0 0 0 10px;
  background: transparent !important;
  cursor: pointer;
  color: #6d7177;
}
.scenario-action-payload textarea.input-error {
	border-color: #b33313;
}

.error-message {
	font-size: 12px;
	margin-top: 5px;
}

.scenario-action-payload textarea,
.scenario-action-description textarea {
	border: 1px solid rgb(109, 113, 119);
	box-sizing: border-box;
	margin-top: 5px;
}

.scenario-modal-body textarea,
.scenario-modal-body input {
	width: 100%;
	padding: 10px;
	box-sizing: border-box;
  background-color: #0c131c;
  color: #6d7177;
}

.scenario-modal-body textarea {
  resize: vertical;
}

.scenario-modal-body .scenario-actions-item input {
  border-top: none;
}

.scenario-title input {
  cursor: pointer;
  color: #6d7177;
  border: none;
}

.scenario-item {
  border-top: 1px solid #6d7177;
}
.scenario-item:last-child {
  border-bottom: 1px solid #6d7177;
}

.scenario-item:first-child {
  border: none;
}

.scenario-action-payload {
  border-bottom: 1px solid #6d7177;
}

.scenario-action-payload.last-child {
  border-bottom: none;
}

.scenario-action-title input {
  text-transform: uppercase;
}


  `;
  GM.addStyle(styles);
})();
