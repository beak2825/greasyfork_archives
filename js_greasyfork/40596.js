
// ==UserScript==
// @name         巴哈姆特文章列表強化
// @namespace    https://blog.maple3142.net/
// @version      0.3
// @description  強化哈拉版的文章列表
// @author       maple3142
// @require      https://unpkg.com/vue@2.5.16/dist/vue.runtime.min.js
// @require      https://unpkg.com/vuejs-storage@2.2.5/dist/vuejs-storage.min.js
// @match        https://forum.gamer.com.tw/B.php?*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/40596/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E6%96%87%E7%AB%A0%E5%88%97%E8%A1%A8%E5%BC%B7%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/40596/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E6%96%87%E7%AB%A0%E5%88%97%E8%A1%A8%E5%BC%B7%E5%8C%96.meta.js
// ==/UserScript==
(function (Vue,vjss,$) {
	'use strict';

	Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;
	vjss = vjss && vjss.hasOwnProperty('default') ? vjss['default'] : vjss;
	$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

	(function () {
	  if (typeof document !== 'undefined') {
	    var head = document.head || document.getElementsByTagName('head')[0],
	        style = document.createElement('style'),
	        css = " .btn-cb[data-v-5651d276]{ display: inline-block; border: 0; border-radius: 3px; padding: 3px 12px; height: 25px; background-color: #117e96; color: #FFF; font-size: 12px; margin-left: 5px; } .btn-cb.active[data-v-5651d276]{ background-color: #222e96; } ";
	    style.type = 'text/css';

	    if (style.styleSheet) {
	      style.styleSheet.cssText = css;
	    } else {
	      style.appendChild(document.createTextNode(css));
	    }

	    head.appendChild(style);
	  }
	})();

	var btnCb = {
	  render: function render() {
	    var _vm = this;

	    var _h = _vm.$createElement;

	    var _c = _vm._self._c || _h;

	    return _c('button', {
	      staticClass: "btn-cb",
	      class: {
	        active: _vm.value
	      },
	      on: {
	        "click": function click($event) {
	          $event.preventDefault();

	          _vm.$emit('input', !_vm.value);
	        }
	      }
	    }, [_vm._t("default")], 2);
	  },
	  staticRenderFns: [],
	  _scopeId: 'data-v-5651d276',
	  props: ['value']
	};

	(function () {
	  if (typeof document !== 'undefined') {
	    var head = document.head || document.getElementsByTagName('head')[0],
	        style = document.createElement('style'),
	        css = "";
	    style.type = 'text/css';

	    if (style.styleSheet) {
	      style.styleSheet.cssText = css;
	    } else {
	      style.appendChild(document.createTextNode(css));
	    }

	    head.appendChild(style);
	  }
	})();
	var xf = {
	  render: function render() {
	    var _vm = this;

	    var _h = _vm.$createElement;

	    var _c = _vm._self._c || _h;

	    return _c('div', {
	      staticClass: "ib"
	    }, [_c('btn-cb', {
	      model: {
	        value: _vm.filter.hidelock,
	        callback: function callback($$v) {
	          _vm.$set(_vm.filter, "hidelock", $$v);
	        },
	        expression: "filter.hidelock"
	      }
	    }, [_vm._v("隱藏鎖文")]), _vm._v(" "), _c('btn-cb', {
	      model: {
	        value: _vm.filter.hidetop,
	        callback: function callback($$v) {
	          _vm.$set(_vm.filter, "hidetop", $$v);
	        },
	        expression: "filter.hidetop"
	      }
	    }, [_vm._v("隱藏置頂")]), _vm._v(" "), _c('btn-cb', {
	      model: {
	        value: _vm.filter.hideimg,
	        callback: function callback($$v) {
	          _vm.$set(_vm.filter, "hideimg", $$v);
	        },
	        expression: "filter.hideimg"
	      }
	    }, [_vm._v("隱藏有圖片的文章")])], 1);
	  },
	  staticRenderFns: [],
	  data: function data() {
	    return {
	      filter: {
	        hidelock: false,
	        hidetop: false,
	        hideimg: false
	      }
	    };
	  },
	  storage: {
	    namespace: 'x_filter',
	    keys: ['filter'],
	    storage: {
	      setItem: GM_setValue,
	      getItem: GM_getValue
	    }
	  },
	  components: {
	    btnCb: btnCb
	  }
	};

	Vue.use(vjss);
	var div = document.createElement('div');
	var vm = new Vue({
	  render: function render(h) {
	    return h(xf);
	  },
	  el: div
	});
	$('.b-list__filter').append($(div).addClass('ib').append(vm.$el));
	var filter = vm.$children[0].filter;

	var isLocked = function isLocked(el) {
	  return $(el).find('.icon-lock').length > 0;
	};

	var isTop = function isTop(el) {
	  return $(el).hasClass('b-list__row--sticky');
	};

	var isImg = function isImg(el) {
	  return $(el).find('.icon-photo').length > 0;
	};

	function renderList() {
	  $('.b-list>tbody>.b-list__row').each(function (i, el) {
	    if (filter.hidelock && isLocked(el)) {
	      $(el).hide();
	    } else if (filter.hidetop && isTop(el)) {
	      $(el).hide();
	    } else if (filter.hideimg && isImg(el)) {
	      $(el).hide();
	    } else {
	      $(el).show();
	    }
	  });
	}
	vm.$children[0].$watch('filter', {
	  handler: renderList,
	  deep: true
	});
	renderList();

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _toConsumableArray(arr) {
	  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
	}

	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

	    return arr2;
	  }
	}

	function _iterableToArray(iter) {
	  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
	}

	function _nonIterableSpread() {
	  throw new TypeError("Invalid attempt to spread non-iterable instance");
	}

	var query = Object.assign.apply(Object, _toConsumableArray(location.search.replace(/^\?/, '').split('&').map(function (x) {
	  return x.split('=');
	}).map(function (x) {
	  return _defineProperty({}, x[0], x[1]);
	})));
	var stringify = function stringify(o) {
	  return '?' + Object.keys(o).map(function (k) {
	    return "".concat(k, "=").concat(o[k]);
	  }).join('&');
	};

	var firstpage = Math.max(query.page ? parseInt(query.page) : 1, 1);
	var lastpage = firstpage;
	var $firstrow = $('<tr>').addClass('b-list__row');
	var $lastrow = $('<tr>').addClass('b-list__row');
	$('.b-list>tbody').append($lastrow);
	$('.b-list__head').after($firstrow);
	var existsTable = {};
	$('.b-list>tbody>.b-list__row').find('a[name]').map(function (i, e) {
	  return $(e).attr('name');
	}).each(function (i, x) {
	  return existsTable[x] = true;
	});

	function xLoadFac(next) {
	  return $('<div>').addClass('load-more').text('載入更多').click(function (e) {
	    if (!next && firstpage === 1) {
	      alert('已到首頁');
	      return;
	    }

	    if (next) lastpage++;else firstpage--;
	    var q = location.pathname + stringify(Object.assign({}, query, {
	      page: next ? lastpage : firstpage
	    }));
	    history.pushState(null, '', q);
	    fetch(q).then(function (r) {
	      return r.text();
	    }).then(function (h) {
	      // POST LIST
	      var x = $(h).find('.b-list>tbody>.b-list__row').filter(function (i, e) {
	        var a = $(e).find('.b-list__summary__sort a[data-subbsn]:last');

	        if (a.length) {
	          a.text(subtitle(a.data('subbsn')));
	        }

	        var id = $(e).find('a[name]').attr('name');
	        if (existsTable[id]) return false;else return existsTable[id] = true;
	      });
	      if (next) $lastrow.before(x);else $firstrow.after(x);
	      renderList(); //rerender
	      // PAGER

	      var $oldpager = $('.b-pager');
	      var $newpager = $(h).find('.b-pager');
	      if (next) $oldpager.eq(1).replaceWith($newpager.eq(1));else $oldpager.eq(0).replaceWith($newpager.eq(0));
	    });
	  });
	}

	$('.b-list').before(xLoadFac(false)).after(xLoadFac(true));

	function styleInject(css, ref) {
	  if ( ref === void 0 ) ref = {};
	  var insertAt = ref.insertAt;

	  if (!css || typeof document === 'undefined') { return; }

	  var head = document.head || document.getElementsByTagName('head')[0];
	  var style = document.createElement('style');
	  style.type = 'text/css';

	  if (insertAt === 'top') {
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

	var css = ".load-more {\n\ttext-align: center;\n\tpadding: 1rem;\n}\n.load-more:hover{\n\tcolor: blue;\n}\n.ib{\n\tdisplay: inline-block;\n}";
	styleInject(css);

}(Vue,vuejsStorage,jQuery));
