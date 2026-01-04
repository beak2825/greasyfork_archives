// ==UserScript==
// @name        WoD_Drops_Statistics
// @namespace   1iuh
// @version     0.1.0
// @description       WoD Drops Statistics
// @description:zh-cn       WoD特产掉落统计
// @author      1iuh <liuhsmail@gmail.com>
// @match       http://delta.world-of-dungeons.org/wod/spiel//dungeon/report.php*
// @match       http://delta.world-of-dungeons.org/wod/spiel/dungeon/report.php*
// @match       https://delta.world-of-dungeons.org/wod/spiel//dungeon/report.php*
// @match       https://delta.world-of-dungeons.org/wod/spiel/dungeon/report.php*
// @require     https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require     https://cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js
// @require     https://cdn.jsdelivr.net/npm/axios-userscript-adapter@0.1.4/dist/axiosGmxhrAdapter.min.js
// @grant       GM.xmlHttpRequest
// @connect     www.wodgroup.top
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/431029/WoD_Drops_Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/431029/WoD_Drops_Statistics.meta.js
// ==/UserScript==


/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/nanobar/nanobar.js":
/***/ (function(module) {

/* http://nanobar.micronube.com/  ||  https://github.com/jacoborus/nanobar/    MIT LICENSE */
(function (root) {
  'use strict'; // container styles

  var css = '.nanobar{width:100%;height:4px;z-index:9999;top:0}.bar{width:0;height:100%;transition:height .3s;background:#000}'; // add required css in head div

  function addCss() {
    var s = document.getElementById('nanobarcss'); // check whether style tag is already inserted

    if (s === null) {
      s = document.createElement('style');
      s.type = 'text/css';
      s.id = 'nanobarcss';
      document.head.insertBefore(s, document.head.firstChild); // the world

      if (!s.styleSheet) return s.appendChild(document.createTextNode(css)); // IE

      s.styleSheet.cssText = css;
    }
  }

  function addClass(el, cls) {
    if (el.classList) el.classList.add(cls);else el.className += ' ' + cls;
  } // create a progress bar
  // this will be destroyed after reaching 100% progress


  function createBar(rm) {
    // create progress element
    var el = document.createElement('div'),
        width = 0,
        here = 0,
        on = 0,
        bar = {
      el: el,
      go: go
    };
    addClass(el, 'bar'); // animation loop

    function move() {
      var dist = width - here;

      if (dist < 0.1 && dist > -0.1) {
        place(here);
        on = 0;

        if (width === 100) {
          el.style.height = 0;
          setTimeout(function () {
            rm(el);
          }, 300);
        }
      } else {
        place(width - dist / 4);
        setTimeout(go, 16);
      }
    } // set bar width


    function place(num) {
      width = num;
      el.style.width = width + '%';
    }

    function go(num) {
      if (num >= 0) {
        here = num;

        if (!on) {
          on = 1;
          move();
        }
      } else if (on) {
        move();
      }
    }

    return bar;
  }

  function Nanobar(opts) {
    opts = opts || {}; // set options

    var el = document.createElement('div'),
        applyGo,
        nanobar = {
      el: el,
      go: function (p) {
        // expand bar
        applyGo(p); // create new bar when progress reaches 100%

        if (p === 100) {
          init();
        }
      }
    }; // remove element from nanobar container

    function rm(child) {
      el.removeChild(child);
    } // create and insert progress var in nanobar container


    function init() {
      var bar = createBar(rm);
      el.appendChild(bar.el);
      applyGo = bar.go;
    }

    addCss();
    addClass(el, 'nanobar');
    if (opts.id) el.id = opts.id;
    if (opts.classname) addClass(el, opts.classname); // insert container

    if (opts.target) {
      // inside a div
      el.style.position = 'relative';
      opts.target.insertBefore(el, opts.target.firstChild);
    } else {
      // on top of the page
      el.style.position = 'fixed';
      document.getElementsByTagName('body')[0].appendChild(el);
    }

    init();
    return nanobar;
  }

  if (true) {
    // CommonJS
    module.exports = Nanobar;
  } else {}
})(this);

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";

;// CONCATENATED MODULE: external "axios"
var external_axios_namespaceObject = axios;
var external_axios_default = /*#__PURE__*/__webpack_require__.n(external_axios_namespaceObject);
;// CONCATENATED MODULE: external "axiosGmxhrAdapter"
var external_axiosGmxhrAdapter_namespaceObject = axiosGmxhrAdapter;
var external_axiosGmxhrAdapter_default = /*#__PURE__*/__webpack_require__.n(external_axiosGmxhrAdapter_namespaceObject);
;// CONCATENATED MODULE: ./src/utils.ts


function get(url, config) {
    return axios.get(url, Object.assign({ adapter }, config));
}
function post(url, data, config) {
    return external_axios_default().post(url, data, Object.assign({ adapter: (external_axiosGmxhrAdapter_default()) }, config));
}

;// CONCATENATED MODULE: ./src/index.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

var Nanobar = __webpack_require__("./node_modules/nanobar/nanobar.js");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var nanobar;
        var max_num = 0;
        var curr_num = 0;
        var temp_div = document.createElement("div");
        temp_div.innerHTML = "";
        function ReadPage(temp_div) {
            var form_data = $(temp_div).find("form").serialize();
            // 提取时间
            var datetime_string = $(temp_div).find("h2").eq(0).text();
            var datetime = datetime_string.split(" - ")[0];
            var map_name = datetime_string.split(" - ")[1];
            // 提取掉落明细
            var index = 0;
            var content_table = $(temp_div).find(".content_table");
            var drops = [];
            while (index < 12) {
                var charname = content_table.find("h2").eq(index).text();
                if (charname == "") {
                    break;
                }
                var sub_table = content_table
                    .children("tbody")
                    .children("tr")
                    .children("td")
                    .children("table")
                    .eq(index);
                var desc = sub_table
                    .children("tbody")
                    .children("tr")
                    .children("td")
                    .eq(2)
                    .find("p");
                if (desc
                    .text()
                    .indexOf("被打昏了，为了将其安全的带回来，只好把其得到的战利品抛弃了") > 0) {
                    index += 1;
                    continue;
                }
                var items = sub_table
                    .children("tbody")
                    .children("tr")
                    .children("td")
                    .eq(2)
                    .find("a");
                for (var it of items) {
                    drops.push({ item_name: it.innerHTML, charname: charname });
                }
                index += 1;
            }
            // 组织数据
            var payload = {
                form_data: form_data,
                datetime: datetime,
                map_name: map_name,
                drops: drops,
            };
            return payload;
        }
        function GetPage(report_id, wod_post_id) {
            var XmlHttp = new XMLHttpRequest();
            XmlHttp.onreadystatechange = function () {
                try {
                    if (XmlHttp.readyState == 4 && XmlHttp.status == 200) {
                        temp_div.innerHTML = XmlHttp.responseText;
                        //Stat.nReadPages = nRepPage;
                        //Stat.iscurrentPage = false;
                        $("#progress_text").text("正在统计特产:  " + curr_num + "/" + max_num + "，请勿关闭网页。");
                        var payload = ReadPage(temp_div);
                        const res = post("http://www.wodgroup.top/upload", payload);
                        curr_num += 1;
                        var process_val = Math.min(100, Math.round((curr_num / max_num) * 100));
                        nanobar.go(process_val);
                        if (curr_num == max_num) {
                            $("#progress_text").text("");
                        }
                    }
                }
                catch (e) {
                    alert("XMLHttpRequest.onreadystatechange(): " + e);
                }
            };
            var URL = location.protocol +
                "//" +
                location.host +
                "/wod/spiel/dungeon/report.php";
            var param = "wod_post_id=" +
                wod_post_id +
                "&report_id[0]=" +
                report_id +
                "&items[0]=获得物品";
            XmlHttp.open("POST", URL, true);
            XmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            XmlHttp.send(param);
        }
        function exportAllDrops() {
            if (!confirm("从所有战报中统计特产，需要三至五分钟，统计期间请勿关闭网页。")) {
                return;
            }
            if (curr_num != 0 && curr_num != max_num) {
                return;
            }
            var options = {
                target: document.getElementById("progress_bar"),
            };
            nanobar = new Nanobar(options);
            var wod_post_id = $("input[name=wod_post_id]").val();
            max_num = $(".content_table input[type=hidden]").length;
            curr_num = 0;
            $(".content_table input[type=hidden]").each(function () {
                var report_id = $(this).val();
                GetPage(report_id, wod_post_id);
            });
        }
        // 如果是在战报页面，添加按钮
        var form_data = $("form").serialize();
        if (window.location.pathname == "/wod/spiel/dungeon/report.php" ||
            $("h1").text() == "战报") {
            var c_h1 = $(".gadget_body h1");
            const urlParams = new URLSearchParams(form_data);
            var group_id = urlParams.get("gruppe_id");
            c_h1.before('<input type="button" style="float:right" value="全量统计" id="drops_statistics" class="button clickable">');
            c_h1.before('<input type="button" style="float:right;margin-right: 5px;" value="查看统计表" id="goto_drops_table" class="button clickable">');
            c_h1.before('<span style="float:right"> 特产：</span>');
            c_h1.before('<div width="100%" id="progress_text" style="text-align: center;"></div>');
            c_h1.before('<div width="100%" id="progress_bar"></div>');
            $("#drops_statistics").on("click", exportAllDrops);
            $("#goto_drops_table").on("click", function () {
                window.open("http://www.wodgroup.top/" + group_id + "/drops", "_blank");
            });
            return;
        }
        // 判断是否在掉落页面
        if ($("h1").text().split(":")[0] == "物品纵览") {
            // 上传
            var payload = ReadPage(document.getElementById("page-border"));
            const res = yield post("http://www.wodgroup.top/upload", payload);
        }
    });
}
main().catch((e) => {
    console.log(e);
});

}();
/******/ })()
;