// ==UserScript==
// @name        confluence PPT
// @namespace   Violentmonkey Scripts
// @match       https://confluence.zhenguanyu.com/display/**
// @match       https://confluence.zhenguanyu.com/pages/viewpage.action?pageId=*
// @grant       none
// @version     1.2.6
// @author      -
// @description 2021/2/9下午2:06:26
// @downloadURL https://update.greasyfork.org/scripts/421471/confluence%20PPT.user.js
// @updateURL https://update.greasyfork.org/scripts/421471/confluence%20PPT.meta.js
// ==/UserScript==

// document.addEventListener('DOMContentLoaded', () => {

/*! medium-zoom 1.0.6 | MIT License | https://github.com/francoischalifour/medium-zoom */
(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = global || self, 
  global.mediumZoom = factory());
})(this, function() {
  "use strict";
  var _extends = Object.assign || function(target) {
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
  var isSupported = function isSupported(node) {
    return true;
  };
  var isNodeList = function isNodeList(selector) {
    return NodeList.prototype.isPrototypeOf(selector);
  };
  var isNode = function isNode(selector) {
    return selector && selector.nodeType === 1;
  };
  var isSvg = function isSvg(image) {
    if (image.tagName !== 'IMG') {
      return true
    }
    var source = image.currentSrc || image.src;
    return source.substr(-4).toLowerCase() === ".svg";
  };
  var getImagesFromSelector = function getImagesFromSelector(selector) {
    try {
      if (Array.isArray(selector)) {
        return selector.filter(isSupported);
      }
      if (isNodeList(selector)) {
        return [].slice.call(selector).filter(isSupported);
      }
      if (isNode(selector)) {
        return [ selector ].filter(isSupported);
      }
      if (typeof selector === "string") {
        return [].slice.call(document.querySelectorAll(selector)).filter(isSupported);
      }
      return [];
    } catch (err) {
      throw new TypeError("The provided selector is invalid.\n" + "Expects a CSS selector, a Node element, a NodeList or an array.\n" + "See: https://github.com/francoischalifour/medium-zoom");
    }
  };
  var createOverlay = function createOverlay(background) {
    var overlay = document.createElement("div");
    overlay.classList.add("medium-zoom-overlay");
    overlay.style.background = background;
    return overlay;
  };
  var cloneTarget = function cloneTarget(template) {
    var _template$getBounding = template.getBoundingClientRect(), top = _template$getBounding.top, left = _template$getBounding.left, width = _template$getBounding.width, height = _template$getBounding.height;
    var clone = template.cloneNode(true);
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
    clone.removeAttribute("id");
    clone.style.position = "absolute";
    clone.style.top = top + scrollTop + "px";
    clone.style.left = left + scrollLeft + "px";
    clone.style.width = width + "px";
    clone.style.height = height + "px";
    clone.style.transform = "";
    return clone;
  };
  var createCustomEvent = function createCustomEvent(type, params) {
    var eventParams = _extends({
      bubbles: false,
      cancelable: false,
      detail: undefined
    }, params);
    if (typeof window.CustomEvent === "function") {
      return new CustomEvent(type, eventParams);
    }
    var customEvent = document.createEvent("CustomEvent");
    customEvent.initCustomEvent(type, eventParams.bubbles, eventParams.cancelable, eventParams.detail);
    return customEvent;
  };
  var mediumZoom = function mediumZoom(selector) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var Promise = window.Promise || function Promise(fn) {
      function noop() {}
      fn(noop, noop);
    };
    var _handleClick = function _handleClick(event) {
      var target = event.target;
      if (target === overlay) {
        close();
        return;
      }
      if (images.indexOf(target) === -1) {
        return;
      }
      toggle({
        target: target
      });
    };
    var _handleScroll = function _handleScroll() {
      if (isAnimating || !active.original) {
        return;
      }
      var currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (Math.abs(scrollTop - currentScroll) > zoomOptions.scrollOffset) {
        setTimeout(close, 150);
      }
    };
    var _handleKeyUp = function _handleKeyUp(event) {
      var key = event.key || event.keyCode;
      if (key === "Escape" || key === "Esc" || key === 27) {
        close();
      }
    };
    var update = function update() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var newOptions = options;
      if (options.background) {
        overlay.style.background = options.background;
      }
      if (options.container && options.container instanceof Object) {
        newOptions.container = _extends({}, zoomOptions.container, options.container);
      }
      if (options.template) {
        var template = isNode(options.template) ? options.template : document.querySelector(options.template);
        newOptions.template = template;
      }
      zoomOptions = _extends({}, zoomOptions, newOptions);
      images.forEach(function(image) {
        image.dispatchEvent(createCustomEvent("medium-zoom:update", {
          detail: {
            zoom: zoom
          }
        }));
      });
      return zoom;
    };
    var clone = function clone() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return mediumZoom(_extends({}, zoomOptions, options));
    };
    var attach = function attach() {
      for (var _len = arguments.length, selectors = Array(_len), _key = 0; _key < _len; _key++) {
        selectors[_key] = arguments[_key];
      }
      var newImages = selectors.reduce(function(imagesAccumulator, currentSelector) {
        return [].concat(imagesAccumulator, getImagesFromSelector(currentSelector));
      }, []);
      newImages.filter(function(newImage) {
        return images.indexOf(newImage) === -1;
      }).forEach(function(newImage) {
        images.push(newImage);
        newImage.classList.add("medium-zoom-image");
      });
      eventListeners.forEach(function(_ref) {
        var type = _ref.type, listener = _ref.listener, options = _ref.options;
        newImages.forEach(function(image) {
          image.addEventListener(type, listener, options);
        });
      });
      return zoom;
    };
    var detach = function detach() {
      for (var _len2 = arguments.length, selectors = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        selectors[_key2] = arguments[_key2];
      }
      if (active.zoomed) {
        close();
      }
      var imagesToDetach = selectors.length > 0 ? selectors.reduce(function(imagesAccumulator, currentSelector) {
        return [].concat(imagesAccumulator, getImagesFromSelector(currentSelector));
      }, []) : images;
      imagesToDetach.forEach(function(image) {
        image.classList.remove("medium-zoom-image");
        image.dispatchEvent(createCustomEvent("medium-zoom:detach", {
          detail: {
            zoom: zoom
          }
        }));
      });
      images = images.filter(function(image) {
        return imagesToDetach.indexOf(image) === -1;
      });
      return zoom;
    };
    var on = function on(type, listener) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      images.forEach(function(image) {
        image.addEventListener("medium-zoom:" + type, listener, options);
      });
      eventListeners.push({
        type: "medium-zoom:" + type,
        listener: listener,
        options: options
      });
      return zoom;
    };
    var off = function off(type, listener) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      images.forEach(function(image) {
        image.removeEventListener("medium-zoom:" + type, listener, options);
      });
      eventListeners = eventListeners.filter(function(eventListener) {
        return !(eventListener.type === "medium-zoom:" + type && eventListener.listener.toString() === listener.toString());
      });
      return zoom;
    };
    var open = function open() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, target = _ref2.target;
      var _animate = function _animate() {
        var container = {
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight,
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        };
        var viewportWidth = void 0;
        var viewportHeight = void 0;
        if (zoomOptions.container) {
          if (zoomOptions.container instanceof Object) {
            container = _extends({}, container, zoomOptions.container);
            viewportWidth = container.width - container.left - container.right - zoomOptions.margin * 2;
            viewportHeight = container.height - container.top - container.bottom - zoomOptions.margin * 2;
          } else {
            var zoomContainer = isNode(zoomOptions.container) ? zoomOptions.container : document.querySelector(zoomOptions.container);
            var _zoomContainer$getBou = zoomContainer.getBoundingClientRect(), _width = _zoomContainer$getBou.width, _height = _zoomContainer$getBou.height, _left = _zoomContainer$getBou.left, _top = _zoomContainer$getBou.top;
            container = _extends({}, container, {
              width: _width,
              height: _height,
              left: _left,
              top: _top
            });
          }
        }
        viewportWidth = viewportWidth || container.width - zoomOptions.margin * 2;
        viewportHeight = viewportHeight || container.height - zoomOptions.margin * 2;
        var zoomTarget = active.zoomedHd || active.original;
        var naturalWidth = isSvg(zoomTarget) ? viewportWidth : zoomTarget.naturalWidth || viewportWidth;
        var naturalHeight = isSvg(zoomTarget) ? viewportHeight : zoomTarget.naturalHeight || viewportHeight;
        var _zoomTarget$getBoundi = zoomTarget.getBoundingClientRect(), top = _zoomTarget$getBoundi.top, left = _zoomTarget$getBoundi.left, width = _zoomTarget$getBoundi.width, height = _zoomTarget$getBoundi.height;
        var scaleX = Math.min(naturalWidth, viewportWidth) / width;
        var scaleY = Math.min(naturalHeight, viewportHeight) / height;
        var scale = Math.min(scaleX, scaleY);
        var translateX = (-left + (viewportWidth - width) / 2 + zoomOptions.margin + container.left) / scale;
        var translateY = (-top + (viewportHeight - height) / 2 + zoomOptions.margin + container.top) / scale;
        var transform = "scale(" + scale + ") translate3d(" + translateX + "px, " + translateY + "px, 0)";
        active.zoomed.style.transform = transform;
        if (active.zoomedHd) {
          active.zoomedHd.style.transform = transform;
        }
      };
      return new Promise(function(resolve) {
        if (target && images.indexOf(target) === -1) {
          resolve(zoom);
          return;
        }
        var _handleOpenEnd = function _handleOpenEnd() {
          isAnimating = false;
          active.zoomed.removeEventListener("transitionend", _handleOpenEnd);
          active.original.dispatchEvent(createCustomEvent("medium-zoom:opened", {
            detail: {
              zoom: zoom
            }
          }));
          resolve(zoom);
        };
        if (active.zoomed) {
          resolve(zoom);
          return;
        }
        if (target) {
          active.original = target;
        } else if (images.length > 0) {
          var _images = images;
          active.original = _images[0];
        } else {
          resolve(zoom);
          return;
        }
        active.original.dispatchEvent(createCustomEvent("medium-zoom:open", {
          detail: {
            zoom: zoom
          }
        }));
        scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        isAnimating = true;
        active.zoomed = cloneTarget(active.original);
        document.body.appendChild(overlay);
        if (zoomOptions.template) {
          var template = isNode(zoomOptions.template) ? zoomOptions.template : document.querySelector(zoomOptions.template);
          active.template = document.createElement("div");
          active.template.appendChild(template.content.cloneNode(true));
          document.body.appendChild(active.template);
        }
        document.body.appendChild(active.zoomed);
        window.requestAnimationFrame(function() {
          document.body.classList.add("medium-zoom--opened");
        });
        active.original.classList.add("medium-zoom-image--hidden");
        active.zoomed.classList.add("medium-zoom-image--opened");
        active.zoomed.addEventListener("click", close);
        active.zoomed.addEventListener("transitionend", _handleOpenEnd);
        if (active.original.getAttribute("data-zoom-src")) {
          active.zoomedHd = active.zoomed.cloneNode();
          active.zoomedHd.removeAttribute("srcset");
          active.zoomedHd.removeAttribute("sizes");
          active.zoomedHd.src = active.zoomed.getAttribute("data-zoom-src");
          active.zoomedHd.onerror = function() {
            clearInterval(getZoomTargetSize);
            console.warn("Unable to reach the zoom image target " + active.zoomedHd.src);
            active.zoomedHd = null;
            _animate();
          };
          var getZoomTargetSize = setInterval(function() {
            if (active.zoomedHd.complete) {
              clearInterval(getZoomTargetSize);
              active.zoomedHd.classList.add("medium-zoom-image--opened");
              active.zoomedHd.addEventListener("click", close);
              document.body.appendChild(active.zoomedHd);
              _animate();
            }
          }, 10);
        } else if (active.original.hasAttribute("srcset")) {
          active.zoomedHd = active.zoomed.cloneNode();
          active.zoomedHd.removeAttribute("sizes");
          active.zoomedHd.removeAttribute("loading");
          var loadEventListener = active.zoomedHd.addEventListener("load", function() {
            active.zoomedHd.removeEventListener("load", loadEventListener);
            active.zoomedHd.classList.add("medium-zoom-image--opened");
            active.zoomedHd.addEventListener("click", close);
            document.body.appendChild(active.zoomedHd);
            _animate();
          });
        } else {
          _animate();
        }
      });
    };
    var close = function close() {
      return new Promise(function(resolve) {
        if (isAnimating || !active.original) {
          resolve(zoom);
          return;
        }
        var _handleCloseEnd = function _handleCloseEnd() {
          active.original.classList.remove("medium-zoom-image--hidden");
          document.body.removeChild(active.zoomed);
          if (active.zoomedHd) {
            document.body.removeChild(active.zoomedHd);
          }
          document.body.removeChild(overlay);
          active.zoomed.classList.remove("medium-zoom-image--opened");
          if (active.template) {
            document.body.removeChild(active.template);
          }
          isAnimating = false;
          active.zoomed.removeEventListener("transitionend", _handleCloseEnd);
          active.original.dispatchEvent(createCustomEvent("medium-zoom:closed", {
            detail: {
              zoom: zoom
            }
          }));
          active.original = null;
          active.zoomed = null;
          active.zoomedHd = null;
          active.template = null;
          resolve(zoom);
        };
        isAnimating = true;
        document.body.classList.remove("medium-zoom--opened");
        active.zoomed.style.transform = "";
        if (active.zoomedHd) {
          active.zoomedHd.style.transform = "";
        }
        if (active.template) {
          active.template.style.transition = "opacity 150ms";
          active.template.style.opacity = 0;
        }
        active.original.dispatchEvent(createCustomEvent("medium-zoom:close", {
          detail: {
            zoom: zoom
          }
        }));
        active.zoomed.addEventListener("transitionend", _handleCloseEnd);
      });
    };
    var toggle = function toggle() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, target = _ref3.target;
      if (active.original) {
        return close();
      }
      return open({
        target: target
      });
    };
    var getOptions = function getOptions() {
      return zoomOptions;
    };
    var getImages = function getImages() {
      return images;
    };
    var getZoomedImage = function getZoomedImage() {
      return active.original;
    };
    var images = [];
    var eventListeners = [];
    var isAnimating = false;
    var scrollTop = 0;
    var zoomOptions = options;
    var active = {
      original: null,
      zoomed: null,
      zoomedHd: null,
      template: null
    };
    if (Object.prototype.toString.call(selector) === "[object Object]") {
      zoomOptions = selector;
    } else if (selector || typeof selector === "string") {
      attach(selector);
    }
    zoomOptions = _extends({
      margin: 0,
      background: "#fff",
      scrollOffset: 40,
      container: null,
      template: null
    }, zoomOptions);
    var overlay = createOverlay(zoomOptions.background);
    document.addEventListener("click", _handleClick);
    document.addEventListener("keyup", _handleKeyUp);
    document.addEventListener("scroll", _handleScroll);
    window.addEventListener("resize", close);
    var zoom = {
      open: open,
      close: close,
      toggle: toggle,
      update: update,
      clone: clone,
      attach: attach,
      detach: detach,
      on: on,
      off: off,
      getOptions: getOptions,
      getImages: getImages,
      getZoomedImage: getZoomedImage
    };
    return zoom;
  };
  function styleInject(css, ref) {
    if (ref === void 0) ref = {};
    var insertAt = ref.insertAt;
    if (!css || typeof document === "undefined") {
      return;
    }
    var head = document.head || document.getElementsByTagName("head")[0];
    var style = document.createElement("style");
    style.type = "text/css";
    if (insertAt === "top") {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }
  var css = ".medium-zoom-overlay{position:fixed;top:0;right:0;bottom:0;left:0;opacity:0;transition:opacity .3s;will-change:opacity}.medium-zoom--opened .medium-zoom-overlay{cursor:pointer;cursor:zoom-out;opacity:1}.medium-zoom-image{cursor:pointer;cursor:zoom-in;transition:transform .3s cubic-bezier(.2,0,.2,1)!important}.medium-zoom-image--hidden{visibility:hidden}.medium-zoom-image--opened{position:relative;cursor:pointer;cursor:zoom-out;will-change:transform}";
  styleInject(css);
  return mediumZoom;
});

(() => {
  const htmlEscape = string => string
          .replace(/&/g, '&amp;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
  
  function debounce(fn, delay) {
    // 定时器，用来 setTimeout
    var timer
    // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
    return function () {
      // 保存函数调用时的上下文和参数，传递给 fn
      var context = this
      var args = arguments
      // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
      clearTimeout(timer)
      // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
      // 再过 delay 毫秒就执行 fn
      timer = setTimeout(function () {
        fn.apply(context, args)
      }, delay)
    }
  }

  
  const start = debounce(() => {
    if (document.querySelector('.confluence-ppt-btn')) {
      return;
    }
    const ops = document.querySelector('.ajs-menu-bar')
    const btn = document.createElement('li')
    btn.className = 'confluence-ppt-btn ajs-button normal'
    btn.innerHTML = '<span class="aui-button aui-button-subtle">PPT演示</span>'
    btn.title = 'PPT 演示'
    btn.onclick = () => {
      const slider = window.SliderDoc(
        {
          title: {
            selector: '#title-text',
            global: true,
            type: 'css'
          },
          author: {
            selector: '.author',
            global: true,
            type: 'css'
          },
          lvl0: '#main-content h1',
          lvl1: '#main-content h2',
          lvl2: '#main-content h3',
          lvl3: '#main-content h4',
          lvl4: '#main-content h5',
          lvl5: '#main-content h6',
          code: '#main-content [data-macro-name="code"]',
          image: '#main-content figure, #main-content img',
          text:
            '#main-content [data-macro-name="info"], #main-content .table-wrap, #main-content pre, #main-content > a, #main-content p, #main-content img, #main-content ul, #main-content ol, #main-content li'
        },
        {
          excludes: [
            '.toc-macro',
          ],
          parseElementTreeConfig: {
            transformNode: node => {
              if (node.domNode && node.domNode.querySelector('img')) {
                node.value = '[IMG]'
                return node
              }
              
              if (node.domNode && node.domNode.querySelector('table .code .container')) {
                
                const newNode = node.domNode.querySelector('table .code .container').cloneNode(true)
                newNode.style.height = 0
                newNode.style.width = 0
                newNode.style.position = 'absolute';
                newNode.style.top = '-10000px'
                newNode.style.left = '-10000px'
                newNode.style.display = 'block'
                document.body.appendChild(newNode)
                node.value = newNode.innerText;
                
                newNode.remove();
                return node
              }
              return node
            }
          },
          renderers: [
            (vNode, ctx, render) => {
              if (vNode.type === 'lvl') {
                if (!vNode.value || !vNode.value.trim()) {
                  return ''
                }
                return `${ctx.renderSection(
                  `<h${vNode.level + 1}>${htmlEscape(vNode.value)}</h${vNode.level + 1}>`,
                  vNode,
                  ctx
                )}${render(vNode.children)}`
              }
              return render()
            }
          ]
        }
      );
      
      slider.addEventListener('click', (evt) => {
        if (evt.target.closest) {
          const dom = evt.target.closest('svg, img')
          if (dom) {
            // IMG
            mediumZoom(dom, { scrollOffset: 120 }).open();
            evt.stopPropagation();
            evt.preventDefault();
          }
        }
      })
      console.log(slider)
    }
    ops.prepend(btn)
  }, 100)
  
  

  ;(async () => {

    // console.log(window)
  // window.addEventListener('load', async () => {
    const loadScript = (src) => {
      const s = document.createElement('script')
      s.src = src
      s.async = 'async'
      s.defer = 'defer'

      document.head.appendChild(s)

      return new Promise(resolve => {
        s.onload = resolve
      })
    }
    const loadStyle = (src) => {
      const s = document.createElement('link')
      s.rel = 'stylesheet'
      s.type = 'text/css'
      s.href = src

      document.head.appendChild(s)

      return new Promise(resolve => {
        s.onload = resolve
      })
    }
    
    const addStyle = (css) => {
      const s = document.createElement('style')
      s.type = 'text/css'
      s.textContent = css

      document.head.appendChild(s)
    }

    await loadScript('https://unpkg.zhihu.com/slider-doc@1/dist/slider-doc.js')
    loadStyle('https://unpkg.zhihu.com/slider-doc@1/dist/style.css')
    

    // await loadScript('http://localhost:8080/slider-doc.js')
    // loadStyle('http://localhost:8080/style.css')
    
    loadStyle('https://unpkg.zhihu.com/reveal.js/dist/theme/simple.css')
    loadStyle('https://unpkg.zhihu.com/highlight.js@10/styles/github.css')


    if (typeof window.SliderDoc === 'function') {
      var _wr = function(type) {
          var orig = history[type];
          return function() {
              var rv = orig.apply(this, arguments);
              var e = new Event('SliderDoc:' + type);
              e.arguments = arguments;
              window.dispatchEvent(e);
              return rv;
          };
      };
      history.pushState = _wr('pushState'), history.replaceState = _wr('replaceState');

      // Use it like this:
      window.addEventListener('SliderDoc:replaceState', function(e) {
          
      });
      window.addEventListener('SliderDoc:pushState', function(e) {
        console.log('start')
          start()
      });

      addStyle(
        `.slider-doc-container section li p { display: inline; }
         .slider-doc-container section p * { vertical-align: top; }
         
        .slider-doc-container .ct-task-list .ct-task-li:before, .slider-doc-container .ct-task-list .ct-task-li-checked:before {
          height: 53px;
          left: -27px;
        }
        .slider-doc-container font[data-size] {
          zoom: 2.7;
          line-height: inherit!important;
        }
        .slider-doc-container .ct-mention-view {
          zoom: 2.4;
          // line-height: inherit!important;
        }
        .slider-doc-container .ct-status {
          zoom: 1.5;
          vertical-align: middle;
        }
        .slider-doc-container table * {
          font-size: 20px !important;
          zoom: 1 !important;
        }
        .slider-doc-container table p {
          text-shadow: none;
          font-weight: 500;
          color: #333;
        }
        .slider-doc-container .tableFloatingHeaderOriginal[style*="position: fixed"] {
          display: none;
        }
        .slider-doc-container table th p {
          font-size: 22px !important;
          font-weight: 700;
          color: #111;
        }
        .slider-doc-container ul.inline-task-list>li {
          background-repeat: no-repeat;
          background-position: 0px 13px;
          padding-left: 40px;
          background-size: 30px;
        }
        .slider-doc-container ul.inline-task-list>li {
          list-style-type: none;
        }
        .slider-doc-container ul.inline-task-list>li.checked {
          color: #5e6c84;
        }
        .slider-doc-container svg * {
          text-shadow: none;
        }
        
        .medium-zoom-image--opened, .medium-zoom-overlay {
          z-index: 999999999999;
        }
`
      )
      start()
    }

  })()
})()
// })
