/*
 * HeiGoBackTop.js V1.0.5
 * @author hei-jack
 * @link https://github.com/hei-jack/HeiGoBackTop/
 * Probably the most beautiful back to top widget
 * 可能是最漂亮的返回顶部小插件
 * first: GMT2021-07-22
 * update: GMT2025-03-08
 *
 */
; (function (global) {
  "use strict";

  var instance;
  //构造函数
  function HeiGoBackTop(mode, el, speed, distance, smooth) {
    if (instance) {
      return instance;
    }
    instance = this;
    this.mode = mode === undefined ? 0 : mode;
    this.el = el === undefined ? '#__go-back-top' : el;
    this.realScrollEle = null;
    this.iframe = null;
    this.speed = speed === undefined ? 500 : speed;
    this.distance = distance === undefined ? 100 : distance;
    this.smooth = smooth === undefined ? true : smooth;
    this.show_height = 400;
    this.flag = false;
    this.show_flag = false;
    this.first_scroll_flag = false;
    this.find_scroll_ele_flag = false;
    this.width = '150px';
    this.height = '40px';
    this.bottom = '5%';
    this.right = '5%';
    this.text = '返回顶部';
    this.text_color = '#fff';
    this.radius = '40px';
    this.themes = 0;
    this.color = 'linear-gradient(to right,#6966ff,#37e2d3,#63e8dd,#ccff66)';
    this.shadow = '0 4px 15px 0 rgba(41, 163, 163,0.75)';
    this.version = 'V1.0.5';
    this.home = 'https://github.com/hei-jack/HeiGoBackTop/';
    //页面加载结束才进行初始化 没有必要执行实时载入
    this.onLoad(this);
  };

  //拓展方法
  HeiGoBackTop.prototype = {
    constructor: HeiGoBackTop,
    //钩子回调
    hook: function (func) {
      return func === undefined ? false : this.callBack(func.bind(this));
    },
    //beforeCreate 初始化之前执行
    onBeforeCreate: function (func) {
      this.beforeCreate = func;
    },
    //初始化结束事件
    onAfterCreate: function (func) {
      this.afterCreate = func;
    },
    onShow: function (func) {
      this.show = func;
    },
    onHide: function (func) {
      this.hide = func;
    },
    onClick: function (func) {
      this.click = func;
    },
    //回调
    callBack: function (func) {
      return func();
    },
    //初始化方法
    init: function () {
      this.showVersion();
      var notHtmlOrBody = !this.isRealScrollHtmlOrBody();
      // 先执行一次 获取html,body的可滚动距离
      if (notHtmlOrBody) {
        setTimeout(function () {
          // 延迟3秒执行 可能为渐进时网站 需要读取api再渲染
          // 不是html或body为实际滚动元素 则寻找实际滚动元素
          this.realScrollEle = this.findMainScrollingElement();
        }.bind(this), 3000);
      }
      this.hook(this.beforeCreate);
      this.unset('onBeforeCreate', null);
      this.unset('beforeCreate');
      //检查参数合法性
      if (!this.checkArgs()) throw (new Error('arguments is error!'));
      this.unset('checkNum', null);
      this.unset('checkEl', null);
      this.unset('checkArgs', null);
      //初始化按钮
      this.createBtn();
      this.unset('createBtn', null);
      this.unset('unsetUseless', null);
      //绑定自定义鼠标滑动事件到全局滑动事件
      this.bindOn(window, 'scroll', this.throttle(this.checkBtn.bind(this), 100), notHtmlOrBody);
      this.bindOn(window, 'scroll', this.scroll, notHtmlOrBody);
      this.controller();
      this.unset('controller', null);
      this.hook(this.afterCreate);
      this.unset('onAfterCreate', null);
      this.unset('afterCreate');
      this.unset('bindOn', null);
      this.unset('addEventListener', null);
      this.unset('isBrowser', null);
      this.unset('onLoad', null);
    },
    //检查参数
    checkArgs: function () {
      if (this.checkNum(this.mode)) return false;
      if (this.mode > 3 || this.mode < 0) return false;
      if (this.checkNum(this.speed) || this.speed <= 0) return false;
      if (this.checkNum(this.distance) || this.distance <= 0) return false;
      if (this.checkEl(this.el)) return false;
      return true
    },
    //检查参数类型是否为数字
    checkNum: function (arg) {
      return typeof (arg) !== 'number';
    },
    //检查参数类型是否为不为0 且包含#号的字符串
    checkEl: function (arg) {
      return typeof (arg) !== 'string' || arg.length === 0 || arg.indexOf('#') === -1;
    },
    //创建按钮
    createBtn: function () {
      //如果不是初始元素id 说明用户自定义挂载元素
      if (this.el !== '#__go-back-top') {
        this.el = this.el.replace('#', '');
        if (document.getElementById(this.el)) {
          this.btn = document.getElementById(this.el);
          this.unsetUseless();
          return false
        }
        //挂载元素id没有发现 直接抛出错误
        throw (new Error('element is error!'));
      }

      var iframeW = parseInt(this.width.replace("px", "")) + 20;
      var iframeH = parseInt(this.height.replace("px", "")) + 40;

      var style_text = '#__go-back-top{display:none;position:fixed;width:' + iframeW + 'px;height:' + iframeH + 'px;bottom:' + this.bottom + ';right:' + this.right + ';z-index:2147483647;border:0;outline:0;background: transparent;}';
      var style_el = document.createElement('style');
      var style_node = document.createTextNode(style_text);
      style_el.appendChild(style_node);
      document.body.appendChild(style_el);

      var iframe = document.createElement('iframe');
      iframe.setAttribute('id', this.el.replace('#', ''));
      iframe.src = 'about:blank';
      iframe.frameborder = "0";
      iframe.allowtransparency = "true";
      document.body.appendChild(iframe);
      this.iframe = iframe;
      var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

      var style_text_btn = 'html,body{padding:0;margin:0;background:transparent;}#__go-back-top{width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;align-content:center;background:transparent;}.__go-back-btn{width:' + this.width + ';height:' + this.height + ';background:' + this.color + ';background-size: 300% 100%;cursor: pointer;border:none;border-radius:' + this.radius + ';box-shadow:' + this.shadow + ';color:' + this.text_color + ';outline:none;letter-spacing:2px;font-weight:600;font-family: "YouYuan","Microsoft YaHei","SimHei","SimSun","Arial",sans-serif;transition: all .4s ease-in-out;moz-transition: all .4s ease-in-out;-o-transition: all .4s ease-in-out;-webkit-transition: all .4s ease-in-out;}.__go-back-btn:hover{background-position: 100% 0%;moz-transition: all .4s ease-in-out;-o-transition: all .4s ease-in-out;-webkit-transition: all .4s ease-in-out;transition: all .4s ease-in-out;}.__go-back-btn:focus{border:none;outline:none;}.go-back-top-themes1{background-image:linear-gradient(to right,#25aae1,#40e495,#30dd8a,#2bb673);box-shadow:0 4px 15px 0 rgba(49,196,190,0.75);}.go-back-top-themes2{background-image:linear-gradient(to right,#f5ce62,#e43603,#fa7199,#e85a19);box-shadow:0 4px 15px 0 rgba(229,66,10,0.75);}.go-back-top-themes3{background-image:linear-gradient(to right,#667eea,#764ba2,#6B8DD6,#8E37D7);box-shadow:0 4px 15px 0 rgba(116,79,168,0.75);}.go-back-top-themes4{background-image:linear-gradient(to right,#fc6076,#ff9a44,#ef9d43,#e75516);box-shadow:0 4px 15px 0 rgba(252,104,110,0.75);}.go-back-top-themes5{background-image:linear-gradient(to right,#0ba360,#3cba92,#30dd8a,#2bb673);box-shadow:0 4px 15px 0 rgba(23,168,108,0.75);}.go-back-top-themes6{background-image:linear-gradient(to right,#009245,#FCEE21,#00A8C5,#D9E021);box-shadow:0 4px 15px 0 rgba(83,176,57,0.75);}.go-back-top-themes7{background-image:linear-gradient(to right,#6253e1,#852D91,#A3A1FF,#F24645);box-shadow:0 4px 15px 0 rgba(126,52,161,0.75);}.go-back-top-themes8{background-image:linear-gradient(to right,#29323c,#485563,#2b5876,#4e4376);box-shadow:0 4px 15px 0 rgba(45,54,65,0.75);}.go-back-top-themes9{background-image:linear-gradient(to right,#25aae1,#4481eb,#04befe,#3f86ed);box-shadow:0 4px 15px 0 rgba(65,132,234,0.75);}.go-back-top-themes10{background-image:linear-gradient(to right,#ed6ea0,#ec8c69,#f7186a,#FBB03B);box-shadow:0 4px 15px 0 rgba(236,116,149,0.75);}.go-back-top-themes11{background-image:linear-gradient(to right,#eb3941,#f15e64,#e14e53,#e2373f);box-shadow:0 5px 15px rgba(242,97,103,.4);}';
      var style_el_btn = iframeDocument.createElement('style');
      var style_node_btn = iframeDocument.createTextNode(style_text_btn);
      style_el_btn.appendChild(style_node_btn);
      iframeDocument.body.appendChild(style_el_btn);

      var div = document.createElement('div');
      div.setAttribute('id', this.el.replace('#', ''));
      var btn = document.createElement('button');
      //设置主题  为0是默认主题 只有默认主题允许更改样式
      this.themes === 0 ? btn.setAttribute('class', this.el.replace('#', '').replace('top', 'btn')) : btn.setAttribute('class', this.el.replace('#', '').replace('top', 'btn') + ' go-back-top-themes' + this.themes);
      var btn_name = document.createTextNode(this.text);
      btn.appendChild(btn_name);
      div.appendChild(btn);
      iframeDocument.body.appendChild(div);
      this.btn = btn;
      //创建结束 销毁已经没用的属性
      this.unsetUseless();
    },
    showBtn: function () {
      if (!this.show_flag) {
        if (this.iframe) {
          this.iframe.style.cssText = 'display:block';
        }
        this.btn.style.cssText = 'display:block';
        this.hook(this.show);
        this.show_flag = true;
      }
    },
    hideBtn: function () {
      if (this.show_flag) {
        if (this.iframe) {
          this.iframe.style.cssText = 'display:none';
        }
        this.btn.style.cssText = 'display:none';
        this.hook(this.hide);
        this.show_flag = false;
      }
    },
    //载入方法 在页面加载结束后开始执行初始化工作
    onLoad: function (self) {
      if (!this.isBrowser()) throw (new Error('The current environment is not the browser!'));
      if (this.isIE() && this.getIEVersion() < 9) throw (new Error('HeiGoBackTop does not support ie 9 the following browsers!'));
      this.bindOn(window, 'load', self.init);
    },
    //当滑动事件发生时
    onScroll: function (func) {
      this.scroll = func;
    },
    //绑定元素事件
    bindOn: function (el, event, func, useCapture) {
      if (func === undefined) return false;
      this.addEventListener(el, event, func.bind(this), useCapture)
    },
    //获取页面滚动的距离
    getScrollTop: function () {
      if (this.realScrollEle) {
        return this.realScrollEle.scrollTop;
      }
      return document.documentElement.scrollTop || document.body.scrollTop;
    },
    //检查按钮何时显示和隐藏
    checkBtn: function (event) {
      if (!this.isRealScrollHtmlOrBody()) {
        if (!this.first_scroll_flag) {
          // 在用户第一次滚动的时候再来获取一边真实滚动元素
          this.realScrollEle = this.findMainScrollingElement();
        }
        if (!this.realScrollEle.isConnected) {
          // 真实滚动旧元素已经被移除 则重新寻找
          this.realScrollEle = this.findMainScrollingElement();
        }
        // 如果用户滚动的元素和旧的真实滚动元素不一致
        if (event.target !== this.realScrollEle) {
          /*
          // 判断谁的区域更大
          var targetRect = event.target.getBoundingClientRect();
          var rect = this.realScrollEle.getBoundingClientRect();
          // 宽度优先法则 理论上主要滚动区域宽度都会占主体比较多的区域 而侧边栏或者其他区域虽然也可以滚动 但是区域会更小
          if (targetRect.width >= rect.width) {
            //直接记录
            this.realScrollEle = event.target;
          }
          */

          // 滚动优先法则 用户滚动的是哪个区域 则点击按钮返回哪个区域的顶部
          this.realScrollEle = event.target;
        }
      }
      this.first_scroll_flag = true;
      this.getScrollTop() > this.show_height ? this.showBtn() : this.hideBtn();
    },
    //绑定元素事件兼容处理函数
    addEventListener: function (el, type, fn, useCapture) {
      if (el.addEventListener) {
        el.addEventListener(type, fn, useCapture ? true : false);
      } else if (el.attachEvent) {
        el.attachEvent('on' + type, fn);
      } else {
        return false;
      }
    },
    //展示版本信息
    showVersion: function () {
      this.isIE() ? console.log("HeiGoBackTop " + this.version + ' ' + this.home) : console.log("\n\n %c HeiGoBackTop " + this.version + " %c " + this.home + " \n\n", "color: #fff; background: linear-gradient(90deg, #8080ff, #ff99ff); padding:5px 1px;", "background: linear-gradient(90deg,#ffccff,#80ffd4); padding:5px 0px;")
    },
    //模式分发控制器
    controller: function () {
      switch (this.mode) {
        case 0:
          this.bindOn(this.btn, 'click', this.goBackTop);
          break;
        case 1:
          this.bindOn(this.btn, 'click', this.goDown);
          break;
        case 2:
          this.bindOn(this.btn, 'click', this.goBackTopSlow);
          break;
        case 3:
          this.bindOn(this.btn, 'click', this.goDownSlow)
      }
    },
    //返回顶部
    goBackTop: function () {
      // 如果开启平滑模式
      if (this.smooth) {
        this.scrollToSmooth(0);
      } else {
        this.setScrollTop(0);
      }
      //滑动结束钩子
      this.hook(this.scrollOver);
    },
    //慢滑到顶部
    goBackTopSlow: function () {
      this.scrollSpeed(this.getScrollTop(), 0);
    },
    //跳转底部
    goDown: function () {
      // 如果开启平滑模式
      if (this.smooth) {
        this.scrollToSmooth(this.getScrollHeight());
      } else {
        this.setScrollTop(this.getScrollHeight());
      }
      this.hook(this.scrollOver)
    },
    //慢滑到底部
    goDownSlow: function () {
      this.scrollSpeed(this.getScrollTop(), this.getScrollHeight());
    },
    /*
     * 滑动方法
     * @param number start 开始滑动位置
     * @param number end 结束滑动位置
     * 
     */
    scrollSpeed: function (start, end) {
      //防止重复点击导致定时器多次调用
      if (this.flag) return false;
      this.flag = true;
      var timer = null;
      if (end === 0) {
        //如果是滑动到顶部
        timer = setInterval(function () {
          var scroll_top = this.getScrollTop();
          if (scroll_top >= this.distance) {
            start -= this.distance;
            this.setScrollTop(start);
          } else {
            if (scroll_top === 0) {
              this.flag = false;
              clearInterval(timer);
              this.hook(this.scrollOver);
            } else {
              this.setScrollTop(0);
            }
          }
        }.bind(this), this.speed);
      } else {
        //如果是滑动到底部
        timer = setInterval(function () {
          //getLast方法获取滚动条距离底部还剩多少距离 如果大于0 说明未到达底部 只管继续滑动即可
          //向下取整 修复个别浏览器还剩余0.3左右的问题
          if (Math.floor(this.getLast()) > 0) {
            start += this.distance;
            this.setScrollTop(start);
          } else {
            this.flag = false;
            this.setScrollTop(end);
            clearInterval(timer);
            this.hook(this.scrollOver);
          }
        }.bind(this), this.speed);
      }
    },
    // 平滑的滚动
    scrollToSmooth: function (target) {
      //  IE和safari不支持 options.behavior："smooth"
      // 目标位置
      var targetPosition = target;
      // 开始滚动位置
      var startPosition = this.getScrollTop();

      try {
        if (this.realScrollEle) {
          this.realScrollEle.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          return;
        }

        //如果出现异常 说明不支持behavior: 'smooth'
        global.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      } catch (e) {
        var distance = targetPosition - startPosition;
        var duration = 500; // 滚动持续时间，单位为毫秒
        var startTime = null;

        function animation(currentTime) {
          if (startTime === null) startTime = currentTime;
          var timeElapsed = currentTime - startTime;
          var run = ease(timeElapsed, startPosition, distance, duration);
          this.realScrollEle ? realScrollEle.scrollTop(0, run) : global.scrollTo(0, run);
          if (timeElapsed < duration) global.requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t + b;
          t--;
          return -c / 2 * (t * (t - 2) - 1) + b;
        }

        global.requestAnimationFrame(animation);
      }

    },

    //设置当前滚动所在高度
    setScrollTop: function (height) {
      if (this.realScrollEle) {
        return this.realScrollEle.scrollTop = height;
      }
      //处理兼容性问题
      document.documentElement.scrollTop ? document.documentElement.scrollTop = height : document.body.scrollTop = height;
    },
    //获取滚动条高度 即可滚动的高度
    getScrollHeight: function () {
      if (this.realScrollEle) {
        return this.realScrollEle.scrollHeight;
      }
      //兼容标准模式 strict mode 和 混杂模式 quirks mode
      return document.compatMode === 'CSS1Compat' ? document.documentElement.scrollHeight : document.body.scrollHeight;
    },
    /*
     * 销毁属性和方法
     * @param string key 属性或方法名称
     * @param set 可选参数 传入除undefined任意值则说明是方法 不传表示属性
     */
    unset: function (key, set) {
      if (set === undefined) {
        delete this[key];
      } else {
        //ie不支持delete方法
        this.isIE() && this.getIEVersion() <= 10 ? this[key] = undefined : this.__proto__[key] = undefined;
      }
    },
    unsetUseless: function () {
      this.unset('el');
      this.unset('width');
      this.unset('height');
      this.unset('top');
      this.unset('right');
      this.unset('text');
      this.unset('text_color');
      this.unset('radius');
      this.unset('themes');
      this.unset('color');
      this.unset('shadow')
    },
    //获取当前滚动条所在位置到页面底部还剩多少距离
    getLast: function () {
      var margin_bot = 0;
      if (this.realScrollEle) {
        margin_bot = this.realScrollEle.scrollHeight - this.realScrollEle.scrollTop - this.realScrollEle.clientHeight;
        return margin_bot;
      }
      if (document.compatMode === "CSS1Compat") {
        margin_bot = document.documentElement.scrollHeight - (document.documentElement.scrollTop + document.body.scrollTop) - document.documentElement.clientHeight;
      } else {
        margin_bot = document.body.scrollHeight - document.body.scrollTop - document.body.clientHeight;
      }
      return margin_bot;
    },
    //滑动结束执行事件
    onScrollOver: function (func) {
      this.scrollOver = func;
    },
    //判断当前浏览器是否为safari
    isSafari: function () {
      return (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent));
    },
    //获取当前浏览器是否为ie
    isIE: function () {
      if (!!window.ActiveXObject || "ActiveXObject" in window) return true;
      return false;
    },
    //获取当前ie版本号
    getIEVersion: function () {
      var ua = navigator.userAgent;
      //如果不是ie浏览器 设置初始值0
      var ver = 0;
      if (ua) {
        if (ua.match(/MSIE\s+([\d]+)\./i)) {
          //其他ie版本
          ver = RegExp.$1;
        } else if (ua.match(/Trident.*rv\s*:\s*([\d]+)\./i)) {
          //ie11
          ver = RegExp.$1;
        }
      }
      return parseInt(ver);
    },
    //获取当前运行环境是否为浏览器
    isBrowser: function () {
      return typeof (window) === "undefined" ? false : true;
    },
    // 寻找实际滚动的是哪个元素 部分网站 实际滚动的区域是其他元素 例如vue之类可能滚动的是app元素 很多ai聊天网站滚动的下面布局元素
    findMainScrollingElement: function () {
      if (this.find_scroll_ele_flag) {
        return;
      }
      this.find_scroll_ele_flag = true;
      var bestCandidate = null;
      var maxArea = 0;
      var queue = [document.body]; // 从 body 开始层级遍历
      while (queue.length > 0) {
        var node = queue.shift();
        // 检查当前节点是否可滚动
        if (node.scrollHeight > node.clientHeight && window.getComputedStyle(node).overflowY !== 'hidden') {
          var rect = node.getBoundingClientRect();
          var area = rect.width * rect.height;
          // 选择可视区域最大的可滚动元素
          if (area > maxArea) {
            maxArea = area;
            bestCandidate = node;
          }
        }
        // 将子节点加入队列
        var children = node.children;
        for (let i = 0; i < children.length; i++) {
          queue.push(children[i]);
        }
      }
      this.find_scroll_ele_flag = false;
      // 如果没有找到可滚动元素，则返回 documentElement
      return bestCandidate || document.documentElement;
    },
    // 判断真实滚动元素是否为html或body
    isRealScrollHtmlOrBody: function () {
      return document.documentElement.clientHeight < document.documentElement.scrollHeight || document.body.clientHeight < document.body.scrollHeight
    },
    // 节流函数
    throttle: function (func, wait) {
      var timer = null;
      var startTime = Date.now();
      return function () {
        var curTime = Date.now();
        var remaining = wait - (curTime - startTime);
        var context = this;
        var args = arguments;
        clearTimeout(timer);
        if (remaining <= 0) {
          func.apply(context, args);
          startTime = Date.now();
        } else {
          timer = setTimeout(function () {
            func.apply(context, args);
          }, remaining);  // 如果小于wait 保证在差值时间后执行
        }
      }
    }
  };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeiGoBackTop;
  } else if (typeof define === 'function') {
    define(function () {
      return HeiGoBackTop;
    })
  } else {
    // 避免重复挂载
    if (!global.HeiGoBackTop) {
      global.HeiGoBackTop = HeiGoBackTop;
    }
  }
})(this);