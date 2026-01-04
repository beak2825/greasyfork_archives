(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DOMChef = {}));
})(this, (function (exports) { 'use strict';

  //#region node_modules/svg-tag-names/index.js
  /**
   * List of known SVG tag names.
   *
   * @type {Array<string>}
   */
  const svgTagNames = [
    'a',
    'altGlyph',
    'altGlyphDef',
    'altGlyphItem',
    'animate',
    'animateColor',
    'animateMotion',
    'animateTransform',
    'animation',
    'audio',
    'canvas',
    'circle',
    'clipPath',
    'color-profile',
    'cursor',
    'defs',
    'desc',
    'discard',
    'ellipse',
    'feBlend',
    'feColorMatrix',
    'feComponentTransfer',
    'feComposite',
    'feConvolveMatrix',
    'feDiffuseLighting',
    'feDisplacementMap',
    'feDistantLight',
    'feDropShadow',
    'feFlood',
    'feFuncA',
    'feFuncB',
    'feFuncG',
    'feFuncR',
    'feGaussianBlur',
    'feImage',
    'feMerge',
    'feMergeNode',
    'feMorphology',
    'feOffset',
    'fePointLight',
    'feSpecularLighting',
    'feSpotLight',
    'feTile',
    'feTurbulence',
    'filter',
    'font',
    'font-face',
    'font-face-format',
    'font-face-name',
    'font-face-src',
    'font-face-uri',
    'foreignObject',
    'g',
    'glyph',
    'glyphRef',
    'handler',
    'hkern',
    'iframe',
    'image',
    'line',
    'linearGradient',
    'listener',
    'marker',
    'mask',
    'metadata',
    'missing-glyph',
    'mpath',
    'path',
    'pattern',
    'polygon',
    'polyline',
    'prefetch',
    'radialGradient',
    'rect',
    'script',
    'set',
    'solidColor',
    'stop',
    'style',
    'svg',
    'switch',
    'symbol',
    'tbreak',
    'text',
    'textArea',
    'textPath',
    'title',
    'tref',
    'tspan',
    'unknown',
    'use',
    'video',
    'view',
    'vkern'
  ];

  //#endregion

  const svgTags = new Set(svgTagNames);
  svgTags.delete('a');
  svgTags.delete('audio');
  svgTags.delete('canvas');
  svgTags.delete('iframe');
  svgTags.delete('script');
  svgTags.delete('video');
  // Copied from Preact
  // https://github.com/preactjs/preact/blob/1bbd687c13c1fd16f0d6393e79ea6232f55fbec4/src/constants.js#L3
  const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
  const isFragment = (type) => type === DocumentFragment;
  const setCSSProps = (element, style) => {
      for (const [name, value] of Object.entries(style)) {
          if (name.startsWith('-')) {
              element.style.setProperty(name, value);
          }
          else if (typeof value === 'number' && !IS_NON_DIMENSIONAL.test(name)) {
              element.style[name] = `${value}px`;
          }
          else {
              element.style[name] = value;
          }
      }
  };
  const create = (type) => {
      if (typeof type === 'string') {
          if (svgTags.has(type)) {
              return document.createElementNS('http://www.w3.org/2000/svg', type);
          }
          return document.createElement(type);
      }
      if (isFragment(type)) {
          return document.createDocumentFragment();
      }
      return type(type.defaultProps);
  };
  const setAttribute = (element, name, value) => {
      if (value === undefined || value === null) {
          return;
      }
      // Naive support for xlink namespace
      // Full list: https://github.com/facebook/react/blob/1843f87/src/renderers/dom/shared/SVGDOMPropertyConfig.js#L258-L264
      if (/^xlink[AHRST]/.test(name)) {
          element.setAttributeNS('http://www.w3.org/1999/xlink', name.replace('xlink', 'xlink:').toLowerCase(), value);
      }
      else {
          element.setAttribute(name, value);
      }
  };
  const addChildren = (parent, children) => {
      for (const child of children) {
          if (child instanceof Node) {
              parent.appendChild(child);
          }
          else if (Array.isArray(child)) {
              addChildren(parent, child);
          }
          else if (typeof child !== 'boolean'
              && typeof child !== 'undefined'
              && child !== null) {
              parent.appendChild(document.createTextNode(child));
          }
      }
  };
  // These attributes allow "false" as a valid value
  // https://github.com/facebook/react/blob/3f8990898309c61c817fbf663f5221d9a00d0eaa/packages/react-dom/src/shared/DOMProperty.js#L288-L322
  const booleanishAttributes = new Set([
      // These attributes allow "false" as a valid value
      'contentEditable',
      'draggable',
      'spellCheck',
      'value',
      // SVG-specific
      'autoReverse',
      'externalResourcesRequired',
      'focusable',
      'preserveAlpha',
  ]);
  const h = (type, attributes, ...children) => {
      var _a;
      const element = create(type);
      addChildren(element, children);
      if (element instanceof DocumentFragment || !attributes) {
          return element;
      }
      // Set attributes
      for (let [name, value] of Object.entries(attributes)) {
          if (name === 'htmlFor') {
              name = 'for';
          }
          if (name === 'class' || name === 'className') {
              const existingClassname = (_a = element.getAttribute('class')) !== null && _a !== void 0 ? _a : '';
              setAttribute(element, 'class', (existingClassname + ' ' + String(value)).trim());
          }
          else if (name === 'style') {
              setCSSProps(element, value);
          }
          else if (name.startsWith('on')) {
              const eventName = name.slice(2).toLowerCase().replace(/^-/, '');
              element.addEventListener(eventName, value);
          }
          else if (name === 'dangerouslySetInnerHTML' && '__html' in value) {
              element.innerHTML = value.__html;
          }
          else if (name !== 'key' && (booleanishAttributes.has(name) || value !== false)) {
              setAttribute(element, name, value === true ? '' : value);
          }
      }
      return element;
  };
  // eslint-disable-next-line @typescript-eslint/no-redeclare -- Ur rong.
  const Fragment = (typeof DocumentFragment === 'function' ? DocumentFragment : () => { });
  // Improve TypeScript support for DocumentFragment
  // https://github.com/Microsoft/TypeScript/issues/20469
  const React = {
      createElement: h,
      Fragment,
  };
  // Improve CJS support
  const createElement = h;

  exports.Fragment = Fragment;
  exports.createElement = createElement;
  exports.default = React;
  exports.h = h;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
