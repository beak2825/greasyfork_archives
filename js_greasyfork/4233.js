// ==UserScript==
// @name            MiniblogImgPop - 微博浮图
// @namespace       http://userscripts.org/users/83994
// @icon            https://addons.cdn.mozilla.net/img/uploads/addon_icons/337/337281-64.png?modified=1361080128
// @description     微博浮图控件，鼠标移过小图弹出浮动大图的脚本
// @version         3.4.2
// @include         http://*qing.weibo.com/*
// @include         http://*weibo.com/*
// @include         https://*weibo.com/*
// @include         http://*t.163.com/*
// @include         http://*t.sohu.com/*
// @include         http://*t.qq.com/*
// @include         http://*t.ifeng.com/*
// @include         http://*t.titan24.com/*
// @include         http://*t.people.com.cn/*
// @include         http://*tianya.cn/*
// @include         http://*diandian.com/*
// @include         http://*.digu.com/*
// @include         http://i.taobao.com/*
// @include         http://*t.cntv.cn*
// @include         *://*tieba.baidu.com/f*
// @include         http://*tieba.baidu.com/i*
// @include         http://*xueqiu.com/*
// @include         https://*douban.com/*
// @include         https://*work.alibaba-inc.com/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/4233/MiniblogImgPop%20-%20%E5%BE%AE%E5%8D%9A%E6%B5%AE%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/4233/MiniblogImgPop%20-%20%E5%BE%AE%E5%8D%9A%E6%B5%AE%E5%9B%BE.meta.js
// ==/UserScript==

// @author      afc163
// @weibo       http://weibo.com/afc163
// @code        https://github.com/afc163/MiniblogImgPop
// @blog        http://pianyou.me
// @date        2010.8.12

(function () {

  // 各微博站点的feed配置
  var MIPConfig = {
    'qing.weibo.com': {
      feedSelector: '.imgZoomIn',
      sFrag: '',
      bFrag: ''
    },
    's.weibo.com': {
      feedSelector: '[action-type="fl_pics"]',
      sFrag: 'thumb150',
      bFrag: 'large'
    },
    'q.weibo.com': {
      feedSelector: '.bigcursor',
      sFrag: 'thumbnail',
      bFrag: 'large'
    },
    'weibo.com': {
      feedSelector: '.bigcursor, .feed_img, .media_list img, .woo-picture-main img, .wbpro-feed-ogText a, .text a, .woo-avatar-main img',
      sFrag: ['thumb180', 'thumb150', 'orj480', 'orj360', 'thumbnail', 'square'],
      bFrag: ['mw690', 'mw690', 'mw690', 'mw690', 'bmiddle', 'bmiddle']
    },
    't.sohu.com': {
      feedSelector: '.pic',
      sFrag: ['/f_', '_1.jpg'],
      bFrag: ['/m_', '_0.jpg']
    },
    't.163.com': {
      feedSelector: '.tweet-preview-pic',
      sFrag: ['w=140&h=140', '&gif=1'],
      bFrag: ['w=440', '&gif=0']
    },
    't.qq.com': {
      feedSelector: '.pic img:not(.large)',
      sFrag: ['/160', '/120'],
      bFrag: ['/460', '/460']
    },
    't.titan24.com': {
      feedSelector: '.imgBig',
      sFrag: '_thumbnail',
      bFrag: '_middle'
    },
    't.people.com.cn': {
      feedSelector: '.list_s_pic img',
      sFrag: '/s_',
      bFrag: '/b_'
    },
    't.ifeng.com': {
      feedSelector: '.zoom_in_image img',
      sFrag: '/128x160_',
      bFrag: '/520x0_'
    },
    'www.tianya.cn': {
      feedSelector: '.pic-zoomin',
      bigSrc: '_middlepic',
      sFrag: 'small',
      bFrag: 'middle'
    },
    'diandian.com': {
      feedSelector: '.feed-img',
      bigSrc: 'imgsrc'
    },
    'digu.com': {
      feedSelector: '.picture',
      sFrag: '_100x75',
      bFrag: '_640x480'
    },
    't.cntv.cn': {
      feedSelector: '.zoom-move',
      sFrag: '/thumbnail',
      bFrag: '/bmiddle'
    },
    'i.taobao.com': {
      feedSelector: '.thumb-image',
      sFrag: '_160x160',
      bFrag: '_450x10000'
    },
    'tieba.baidu.com/f': {
      feedSelector: '.threadlist_media li',
      bigSrc: 'bpic'
    },
    'tieba.baidu.com/i': {
      feedSelector: '.feat_img',
      bigSrc: 'data-field'
    },
    'xueqiu.com': {
      feedSelector: '.expandable > img',
      sFrag: '!thumb',
      bFrag: '!custom'
    },
    'douban.com': {
      feedSelector: 'img',
      sFrag: 'median',
      bFrag: 'raw'
    },
    'work.alibaba-inc.com': {
      feedSelector: '.uxcore-nw-message-wall-item-album-thumb li',
      sFrag: ['240x240', '120x120'],
      bFrag: ['620x10000', '620x10000']
    }
  };

  // 居中显示的图片对象
  var PopImg = {

    show: function (e) {
      this.allowMove = false;
      // fix firefox 22 beta 1
      this._hideTimer && window.clearTimeout(this._hideTimer);

      var that = this;
      var smallImg = MiniblogImgPop.smallImg;
      var src = this.getBigImgsrc(smallImg);
      this.img.src = src;
      this.imgWidth = 500;

      imgReady(src, function () {
        that.imgWidth = this.width;
        that.layoutImg(e);

        that.img.style.opacity = 1;
        that.img.style.visibility = 'visible';
        that.img.style.marginTop = '-15px';
        Mask.show(e);

        // 换算图片显示高度
        //  1. 宽度超过 500 时，高度要等比例压缩
        //  2. 加上边框高度
        var imgDisplayHeight;
        if (this.width > 500) {
          imgDisplayHeight = (this.height) * 500 / this.width;
        } else {
          imgDisplayHeight = this.height;
        }

        if (window.innerHeight > imgDisplayHeight) {
          var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
          that.img.style.top = (scrollTop + (window.innerHeight - imgDisplayHeight) / 2 + 15) + 'px';
          that.allowMove = false;
        } else {
          that.allowMove = true;
          that.move(e);
        }
      });
    },

    // 设置大图的宽度与位置
    layoutImg: function (e) {
      var pos = offset(MiniblogImgPop.smallImg);
      var left = pos.x + pos.width + 30;
      var width = Math.min(this.imgWidth, 500);
      // 如果小图右边放不下
      if (left + width > window.innerWidth) {
        left = pos.x - width - 30;
        // 如果左边也放不下
        if (left < 0) {
          // 根据鼠标位置，选择空间大的一侧放置
          if (e.pageX > window.innerWidth / 2) {
            // 放置在左边
            width = Math.min(width, e.pageX - 30);
            left = 0;
          } else {
            // 放置在右边
            width = Math.min(width, window.innerWidth - e.pageX - 30);
            left = window.innerWidth - width;
          }
        }
      }
      this.img.style.width = width + 'px';
      this.img.style.left = left + 'px';
    },

    hide: function () {
      var that = this;
      this.img.style.opacity = 0;
      this.img.style.marginTop = '0px';

      Mask.hide();
      this.shown = false;

      this._hideTimer = window.setTimeout(function () {
        that.img.src = '';
        that.img.style.visibility = 'hidden';
      }, 200);
    },

    init: function () {
      var node = document.createElement('img');
      node.id = 'miniblogImgPop';
      document.body.appendChild(node);
      this.img = node;

      Mask.init();
    },

    move: function (e) {
      this.layoutImg(e); // 重新计算大图宽度与位置
      if (!this.allowMove) {
        return;
      }
      Mask.move(e);
      // 根据 Mask 的位置算出大图的位置
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      this.img.style.top = (scrollTop - Mask.top * Mask.scale) + 14 + 'px';
    },

    getBigImgsrc: function (obj) {
      var tempimgs, tempimg, imgsrc, i, l,
        sname = MiniblogImgPop.sitename,
        config = MiniblogImgPop.config;
      if (obj.tagName === 'IMG' || obj.tagName === 'img') {
        tempimg = obj;
      } else {
        tempimgs = obj.getElementsByTagName('IMG');
        if (!tempimgs || tempimgs.length === 0) {
          throw 'cant found the img node.';
        }
        else {
          tempimg = tempimgs[0];
        }
      }

      //针对使用额外属性保存大图地址的网站
      if (config.bigSrc) {
        return tempimg.getAttribute(config.bigSrc) || 'javascript:;';
      }

      //一般处理
      imgsrc = tempimg.getAttribute('src');
      //console.info(imgsrc);
      imgsrc = decodeURIComponent(imgsrc);
      if (typeof config.sFrag === 'object') {
        for (i = 0, l = config.sFrag.length; i < l; i++) {
          imgsrc = imgsrc.replace(config.sFrag[i], config.bFrag[i]);
        }
      }
      else {
        imgsrc = imgsrc.replace(config.sFrag, config.bFrag);
      }
      if (obj.tagName === 'a' || obj.tagName === 'A') {
        imgsrc = obj.href
      }
      return imgsrc;
    }

  };

  // 图片上遮罩的阴影
  var Mask = {
    show: function (e) {
      var smallImg = MiniblogImgPop.smallImg,
        bigImg = PopImg.img;

      this.sOffset = offset(smallImg);

      // 表示放大的倍数
      this.scale = (bigImg.height + 14) * 1.0 / this.sOffset.height;

      // 计算出bar的高度
      if (window.innerHeight < bigImg.height) {
        this.height = parseInt(window.innerHeight / this.scale, 10);
      } else {
        this.height = this.sOffset.height;
      }

      // 计算bar的Top值可以允许的范围
      this.range = this.sOffset.height - this.height;

      // 计算 mask 的位置
      this.nodes[0].style.left = this.sOffset.x + 'px';
      this.nodes[0].style.width = this.sOffset.width + 'px';
      this.nodes[0].style.top = this.sOffset.y + 'px';
      this.nodes[1].style.left = this.sOffset.x + 'px';
      this.nodes[1].style.width = this.sOffset.width + 'px';
      this.nodes[1].style.bottom = (window.innerHeight - this.sOffset.y - this.sOffset.height) + 'px';
      this.move(e);

      this.nodes[0].style.opacity = 0.7;
      this.nodes[1].style.opacity = 0.7;
    },
    hide: function () {
      this.nodes[0].style.opacity = 0;
      this.nodes[1].style.opacity = 0;
      this.nodes[0].style.height = 0;
      this.nodes[1].style.height = 0;
    },
    move: function (e) {
      // 计算鼠标相对于元素的位置
      var x = e.pageX - this.sOffset.x,
        y = e.pageY - this.sOffset.y;

      // 计算bar的top值
      var top = y - this.height / 2;
      top = top < 0 ? 0 : top;
      top = top > this.range ? this.range : top;
      this.top = top;

      this.nodes[0].style.height = top + 'px';
      this.nodes[1].style.height = (this.sOffset.height - top - this.height) + 'px';
    },
    init: function () {
      var node1 = document.createElement('div');
      node1.className = 'miniblogImgPop-mask';
      document.body.appendChild(node1);
      var node2 = document.createElement('div');
      node2.className = 'miniblogImgPop-mask';
      document.body.appendChild(node2);
      this.nodes = [node1, node2];
    }
  };

  var MiniblogImgPop = {

    preloadImg: function () {
      var that = this;
      window.setTimeout(function () {
        var nodes = $(that.config.feedSelector);
        for (var i = 0; i < nodes.length; i++) {
          var preloadImg = new Image();
          preloadImg.src = PopImg.getBigImgsrc(nodes[i]);
        }
      }, 1500);
    },

    prepare: function () {
      this.sitename = this._getSiteName();
      this.config = MIPConfig[this.sitename];
    },

    addImgsEventListener: function () {
      var that = this;
      delegate(document.body, 'mouseover', function (e, node) {
        that.smallImg = node;
        node.style.opacity = 0.84;
        PopImg.show(e);
      }, this.config.feedSelector);
      delegate(document.body, 'mouseout', function (e, node) {
        node.style.opacity = '';
        PopImg.hide();
      }, this.config.feedSelector);
      delegate(document.body, 'mousemove', function (e) {
        PopImg.move(e);
      }, this.config.feedSelector);
    },

    // 获得当前站点名
    _getSiteName: function () {
      var i, each;
      for (each in MIPConfig) {
        if (location.href.indexOf(each) != -1) {
          return each;
        }
      }
      return '';
    },

    init: function () {
      // 初始化两个节点
      PopImg.init();
      // 准备必要的数据
      this.prepare();
      // 绑定imgs hover事件
      this.addImgsEventListener();
      // 预加载大图
      this.preloadImg();
    }

  };

  // 启动
  MiniblogImgPop.init();


  // Helpers
  // ---

  function $(selector) {
    return document.querySelectorAll(selector);
  }

  function offset(source) {
    var pt = {
      x: 0,
      y: 0,
      width: source.offsetWidth,
      height: source.offsetHeight
    };
    do {
      pt.x += source.offsetLeft;
      pt.y += source.offsetTop;
      source = source.offsetParent;
    } while (source);
    return pt;
  }

  function delegate(el, eventType, handler, selector) {
    el = el || document;
    el.addEventListener(eventType, function (e) {
      var node = getHandlerNode(e, selector, el);
      node && handler.call(el, e, node);
    }, false);

    function getHandlerNode(e, selector, el) {
      //返回我们handler需要的参数
      var nodes;
      el = el || document;
      if (e && e.target && selector) {
        nodes = el.querySelectorAll(selector);
        for (i = 0; i < nodes.length; i++) {
          if (e.target == nodes[i] || isInDomChain(e.target, nodes[i], el)) {
            return nodes[i];
          }
        }
        return false;
      }
    }

    function isInDomChain(target, parent, ancestor, maxDepth) {
      ancestor = ancestor || null;
      maxDepth = maxDepth || 100;

      if (target == ancestor) {
        return false;
      }
      if (target == parent) {
        return true;
      }
      var i = 0;//防止过多嵌套
      while (target != ancestor && target !== null && (i++ < maxDepth)) {
        target = target.parentNode;
        if (target == parent) {
          return true;
        }
      }
      return false;
    }
  }

  /**
  * 图片头数据加载就绪事件 - 更快获取图片尺寸
  * @version 2011.05.27
  * @author  TangBin
  * @see     http://www.planeart.cn/?p=1121
  * @param   {String}    图片路径
  * @param   {Function}  尺寸就绪
  * @param   {Function}  加载完毕 (可选)
  * @param   {Function}  加载错误 (可选)
  * @example imgReady('http://www.google.com.hk/intl/zh-CN/images/logo_cn.png', function () {
  alert('size ready: width=' + this.width + '; height=' + this.height);
  });
  */
  var imgReady = (function () {
    var list = [], intervalId = null,

      // 用来执行队列
      tick = function () {
        var i = 0;
        for (; i < list.length; i++) {
          list[i].end ? list.splice(i--, 1) : list[i]();
        }
        !list.length && stop();
      },

      // 停止所有定时器队列
      stop = function () {
        window.clearInterval(intervalId);
        intervalId = null;
      };

    return function (url, ready, load, error) {
      var onready, width, height, newWidth, newHeight,
        img = new Image();

      img.src = url;

      // 如果图片被缓存，则直接返回缓存数据
      if (img.complete) {
        ready.call(img);
        load && load.call(img);
        return;
      }

      width = img.width;
      height = img.height;

      // 加载错误后的事件
      img.onerror = function () {
        error && error.call(img);
        onready.end = true;
        img = img.onload = img.onerror = null;
      };

      // 图片尺寸就绪
      onready = function () {
        newWidth = img.width;
        newHeight = img.height;
        if (newWidth !== width || newHeight !== height ||
          // 如果图片已经在其他地方加载可使用面积检测
          newWidth * newHeight > 1024
        ) {
          ready.call(img);
          onready.end = true;
        }
      };
      onready();

      // 完全加载完毕的事件
      img.onload = function () {
        // onload在定时器时间差范围内可能比onready快
        // 这里进行检查并保证onready优先执行
        !onready.end && onready();

        load && load.call(img);

        // IE gif动画会循环执行onload，置空onload即可
        img = img.onload = img.onerror = null;
      };

      // 加入队列中定期执行
      if (!onready.end) {
        list.push(onready);
        // 无论何时只允许出现一个定时器，减少浏览器性能损耗
        if (intervalId === null) intervalId = setInterval(tick, 40);
      }
    };
  })();

  // GM_addStyle function is not existed in chrome 27
  var GM_addStyle = GM_addStyle || function (css) {
    var style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.getElementsByTagName("head")[0].appendChild(style);
  };

  // 增加自定义样式
  GM_addStyle("\
  #miniblogImgPop {\
    border: 0px solid rgba(255,255,255,1);\
    border-radius: 8px;\
    box-shadow: 0 1px 30px rgba(0, 0, 0, 0.75), 0 0 40px rgba(0, 0, 0, 0.25) inset;\
    z-index: 12345;\
    opacity: 0;\
    margin-top: 0;\
    position: absolute;\
    visibility: hidden;\
    max-width: 500px;\
    transition: opacity 0.2s ease-out 0s, margin-top 0.2s ease-out 0s;\
  }\
  ");

  // 增加自定义样式
  GM_addStyle("\
  .miniblogImgPop-mask {\
    background: rgb(0, 0, 0);\
    z-index: 999;\
    position: absolute;\
    transition: opacity 0.4s ease-out 0;\
  }\
  ");

})();
