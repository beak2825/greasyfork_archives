// ==UserScript==
// @name          Fancy text script
// @version        clipboard.js v2.0.0
// @description  Fancy text script Editor
// @include        *://*.facebook.com/*
// @author       unknown (https://zenorocha.github.io/clipboard.js)
// @namespace https://greasyfork.org/users/307290
// @downloadURL https://update.greasyfork.org/scripts/413800/Fancy%20text%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/413800/Fancy%20text%20script.meta.js
// ==/UserScript==
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FancyText = function (_React$Component) {
  (0, _inherits3.default)(FancyText, _React$Component);

  function FancyText(props, context) {
    (0, _classCallCheck3.default)(this, FancyText);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(FancyText).call(this, props, context));

    var style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    _this.state = {
      timingFunctions: ['linear', 'ease-in', 'ease-out', 'ease-in-out', 'ease'],
      styleSheet: style.sheet,
      textColor: _this.props.textColor || '#F9F6F5',
      shadowColor: _this.props.textColor || '#fff'
    };
    return _this;
  }

  (0, _createClass3.default)(FancyText, [{
    key: 'getRandomInt',
    value: function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
  }, {
    key: 'renderLetters',
    value: function renderLetters(text) {
      var keyframes = '@keyframes fading {\n      from {\n        color: rgba(255,255,255,0);\n        text-shadow: 0 0 .5em ' + this.state.shadowColor + ';\n      }\n      to {\n        color: ' + this.state.textColor + ';\n        text-shadow: 0 0 .1em ' + this.state.shadowColor + ';\n      }\n    }';
      this.state.styleSheet.insertRule(keyframes, this.state.styleSheet.cssRules.length);

      var letters = [];
      for (var i = 0; i < text.length; i++) {
        var time = this.getRandomInt(30, 60) / 10;
        var timingFunction = this.state.timingFunctions[this.getRandomInt(0, 5)];
        var animationStyle = {
          WebkitAnimationName: 'fading',
          animationName: 'fading',
          WebkitAnimationDuration: time + 's',
          animationDuration: time + 's',
          WebkitAnimationDelay: '0s',
          animationDelay: '0s',
          WebkitAnimationIterationCount: 'infinite',
          animationIterationCount: 'infinite',
          WebkitAnimationDirection: 'alternate',
          animationDirection: 'alternate',
          WebkitAnimationTimingFunction: timingFunction,
          animationTimingFunction: timingFunction
        };
        letters.push(_react2.default.createElement(
          'span',
          { key: i, className: 'char' + i, style: animationStyle },
          text[i]
        ));
      }
      return letters;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var tagName = _props.tagName;
      var children = _props.children;

      tagName = tagName || 'div';
      var myContainer = _reactDom2.default.render(children, myContainer);
      console.log(myContainer);
      return _react2.default.createElement(tagName, this.props, this.renderLetters(children));
    }
  }]);
  return FancyText;
}(_react2.default.Component);

FancyText.propTypes = {
  textColor: _react2.default.PropTypes.string,
  shadowColor: _react2.default.PropTypes.string,
  children: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element, _react2.default.PropTypes.component]),
  tagName: _react2.default.PropTypes.string
};

exports.default = FancyText;