// ==UserScript==
// @name        WME Advanced Closures
// @version     1.8.2
// @description Recurrent and imported closures in the Waze Map Editor
// @namespace   WMEAC
// @include     https://www.waze.com/editor*
// @include     https://www.waze.com/*/editor*
// @include     https://beta.waze.com/*
// @exclude     https://www.waze.com/user/*
// @exclude     https://www.waze.com/*/user/*
// @icon data:image/png;base64,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
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @connect     holidayapi.com
// @copyright   2018, dummyd2, seb-d59
// @author      dummyd2, seb-d59
// @downloadURL https://update.greasyfork.org/scripts/20705/WME%20Advanced%20Closures.user.js
// @updateURL https://update.greasyfork.org/scripts/20705/WME%20Advanced%20Closures.meta.js
// ==/UserScript==


/*******
 * 
 *  You are free to:
 *   Share, copy, and redistribute the script in any medium or format
 *   under the following terms:
 *   Attribution - You must give appropriate credit. You may do so in any
 *     reasonable manner, but not in any way that suggests the licensor
 *     endorses you or your use.
 * 
 *   NonCommercial - You may not use the script for commercial purposes.
 *
 *   NoModifications - You may NOT MODIFY the script.
 * 
 *  You are invited to contact authors on waze forum for more details.
 * 
********/

/*jshint multistr: true */

function WMEAC_downloadHelperInjected() {
  window.WMEAC_downloadHelper = {jobs:[], _waitForData:function(id) {
    if (this.jobs.length <= id) {
      this.jobs[id].callback({url:null, data:null, callback:this.jobs[id].callback, status:"error", error:"Request not found"});
    } else {
      if (this.jobs[id].status == "success" || this.jobs[id].status == "error") {
        this.jobs[id].callback(this.jobs[id]);
      } else {
        if (this.jobs[id].status == "downloading" && this.jobs[id].progressCallback) {
          this.jobs[id].progressCallback(this.jobs[id]);
        }
        var _this = this;
        window.setTimeout(function() {
          _this._waitForData(id);
        }, 500);
      }
    }
  }, add:function(url, callback, progressCallback) {
    this.jobs.push({url:url, data:null, callback:callback, progressCallback:progressCallback, status:"added", progression:0, error:""});
    var _this = this;
    window.setTimeout(function() {
      _this._waitForData(_this.jobs.length - 1);
    }, 500);
  }};
}
var WMEAC_downloadHelperInjectedScript = document.createElement("script");
WMEAC_downloadHelperInjectedScript.textContent = "" + WMEAC_downloadHelperInjected.toString() + " \n" + "WMEAC_downloadHelperInjected();";
WMEAC_downloadHelperInjectedScript.setAttribute("type", "application/javascript");
document.body.appendChild(WMEAC_downloadHelperInjectedScript);
function lookFordownloadHelperJob() {
  for (var i = 0; i < unsafeWindow.WMEAC_downloadHelper.jobs.length; i++) {
    if (unsafeWindow.WMEAC_downloadHelper.jobs[i].status == "added") {
      unsafeWindow.WMEAC_downloadHelper.jobs[i].status = cloneInto("downloading", unsafeWindow.WMEAC_downloadHelper.jobs[i]);
      var f = function() {
        var job = i;
        GM_xmlhttpRequest({method:"GET", headers:{"User-Agent":"Mozilla/5.0", "Accept":"text/plain"}, synchronous:false, timeout:10000, url:unsafeWindow.WMEAC_downloadHelper.jobs[job].url, onerror:function(r) {
          unsafeWindow.WMEAC_downloadHelper.jobs[job].status = cloneInto("error", unsafeWindow.WMEAC_downloadHelper.jobs[job]);
        }, ontimeout:function(r) {
          console.debug("TOTO Timeout while getting area from server: ", r);
          unsafeWindow.WMEAC_downloadHelper.jobs[job].status = cloneInto("error", unsafeWindow.WMEAC_downloadHelper.jobs[job]);
        }, onload:function(r) {
          unsafeWindow.WMEAC_downloadHelper.jobs[job].status = cloneInto("success", unsafeWindow.WMEAC_downloadHelper.jobs[job]);
          unsafeWindow.WMEAC_downloadHelper.jobs[job].data = cloneInto(r.responseText, unsafeWindow.WMEAC_downloadHelper.jobs[job]);
        }, onprogress:function(r) {
          unsafeWindow.WMEAC_downloadHelper.jobs[job].progression = cloneInto(r.total == 0 ? 0 : r.loaded / r.total, unsafeWindow.WMEAC_downloadHelper.jobs[job]);
        }});
      }();
    }
  }
  window.setTimeout(lookFordownloadHelperJob, 2000);
}
window.setTimeout(lookFordownloadHelperJob);
function WMEAC_Injected() {
  var WMEAC = {};
  WMEAC.isDebug = false;
  WMEAC.ac_version = "1.8.2";
  WMEAC.closureTabTimeout = null;
  WMEAC.csv = [];
  WMEAC.csvCurrentClosureList = null;
  WMEAC.csvCurrentBatchClosureList = null;
  WMEAC.pendingOps = false;
  WMEAC.pb = null;
  WMEAC.daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  WMEAC.lastGeneratedHolidays = [];
  WMEAC.presets = [];
  WMEAC.getElementsByClassName = function(classname, node) {
    if (!node) {
      node = document.getElementsByTagName("body")[0];
    }
    var a = [];
    var re = new RegExp("\\b" + classname + "\\b");
    var els = node.getElementsByTagName("*");
    for (var i = 0, j = els.length; i < j; i++) {
      if (re.test(els[i].className)) {
        a.push(els[i]);
      }
    }
    return a;
  };
  WMEAC.removeChildElements = function(node) {
    while (node.firstChild) {
      WMEAC.removeChildElements(node.firstChild);
      node.removeChild(node.firstChild);
    }
  };
  WMEAC.createElement = function(options) {
    if (options.hasOwnProperty("type") == false) {
      return null;
    }
    var el = document.createElement(options.type);
    if (options.hasOwnProperty("id") == true) {
      el.id = options.id;
    }
    if (options.hasOwnProperty("className") == true) {
      el.className = options.className;
    }
    return el;
  };
  WMEAC.getId = function(node) {
    var el = document.getElementById(node);
    return el;
  };
  WMEAC.logBeta = function(msg, obj) {
  };
  WMEAC.logDebug = function(msg, obj) {
    if (WMEAC.isDebug) {
      WMEAC.log("DEBUG - " + msg, obj);
    }
  };
  WMEAC.logError = function(msg, obj) {
    console.error("Advanced closures v" + WMEAC.ac_version + " - " + msg, obj);
  };
  WMEAC.log = function(msg, obj) {
    if (obj == null) {
      console.log("Advanced closures v" + WMEAC.ac_version + " - " + msg);
    } else {
      console.debug("Advanced closures v" + WMEAC.ac_version + " - " + msg + " ", obj);
    }
  };
  WMEAC.isValidDate = function(d) {
    if (Object.prototype.toString.call(d) === "[object Date]") {
      if (isNaN(d.getTime())) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };
  WMEAC.dateToClosureStr = function(d) {
    var yyyy = d.getUTCFullYear().toString();
    var MM = (d.getUTCMonth() + 1).toString();
    var dd = d.getUTCDate().toString();
    var hh = d.getUTCHours().toString();
    var mm = d.getUTCMinutes().toString();
    return yyyy + "-" + (MM[1] ? MM : "0" + MM[0]) + "-" + (dd[1] ? dd : "0" + dd[0]) + " " + (hh[1] ? hh : "0" + hh[0]) + ":" + (mm[1] ? mm : "0" + mm[0]);
  };
  WMEAC.CSVtoArray = function(text) {
    var b = [];
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    var lines = text.split("\n");
    lines.forEach(function(line) {
      if (!re_valid.test(line)) {
        return;
      }
      var a = [];
      line.replace(re_value, function(m0, m1, m2, m3) {
        if (m1 !== undefined) {
          a.push(m1.replace(/\\'/g, "'"));
        } else {
          if (m2 !== undefined) {
            a.push(m2.replace(/\\"/g, '"'));
          } else {
            if (m3 !== undefined) {
              a.push(m3);
            }
          }
        }
        return "";
      });
      if (/,\s*$/.test(line)) {
        a.push("");
      }
      b.push(a);
    });
    return b;
  };
  WMEAC.segmentsIDsToSegments = function(ids) {
    return ids.filter(function(e) {
      return W.model.segments.objects.hasOwnProperty(e);
    }).map(function(e) {
      return W.model.segments.objects[e];
    });
  };
  WMEAC.reloadRoadLayer = function() {
    var l = W.map.getLayersBy("uniqueName", "roads")[0];
    l.redraw({force:!0});
    l.removeBackBuffer();
    W.controller.reload();
  };
  WMEAC.reloadClosuresLayer = function(endHandler) {
    var l = W.map.getLayersBy("uniqueName", "closures")[0];
    l.redraw({force:!0});
    W.controller.reload();
    if (endHandler) {
      var tmp = function reloaded() {
        WMEAC.log("Test if reloaded...");
        if (WMEAC.pendingOps == true) {
          WMEAC.log("Not yet. Waiting for WME...");
          window.setTimeout(reloaded, 500);
        } else {
          endHandler();
        }
      };
      window.setTimeout(tmp, 500);
    }
  };
  WMEAC.showClosuresLayer = function(show) {
    var l = W.map.getLayersBy("uniqueName", "closures");
    if (l.length == 1) {
      l[0].setVisibility(show);
    }
  };
  WMEAC.setDraggable = function(element, options) {
    if (!options.hasOwnProperty("controller")) {
      options.controller = element;
    }
    if (!options.hasOwnProperty("container")) {
      options.container = [$("body")];
    }
    options.controller.css({cursor:"move"});
    options.controller.on("mousedown", function(e) {
      var x = e.pageX - element.offset().left;
      var y = e.pageY - element.offset().top;
      $("body").on("mouseup", function(e) {
        options.container.forEach(function(c) {
          c.off("mousemove", elemmousemove);
        });
      });
      function elemmousemove(e) {
        e.preventDefault();
        element.offset({top:e.pageY - y, left:e.pageX - x});
      }
      options.container.forEach(function(c) {
        c.on("mousemove", elemmousemove);
      });
    });
  };
  WMEAC.dateTimeOverlaps = function(dt1, dt2) {
    return dt1.startDate < dt2.endDate && dt1.endDate > dt2.startDate;
  };
  WMEAC.solveOverlaps = function(closureToAdd, existingClosureList, mode) {
    var ecs = existingClosureList.map(function(e) {
      return {isNew:false, ref:e, startDate:e.startDate, endDate:e.endDate};
    });
    closureToAdd.isNew = true;
    ecs.push(closureToAdd);
    var changes = true;
    while (changes) {
      changes = false;
      ecs.sort(function(a, b) {
        return new Date(a.startDate) - new Date(b.startDate);
      });
      for (var i = 1; i < ecs.length; i++) {
        if (WMEAC.dateTimeOverlaps(ecs[i - 1], ecs[i])) {
          var indexOfNew = i - 1;
          var indexOfExisting = i;
          if (ecs[i].isNew) {
            indexOfNew = i;
            indexOfExisting = i - 1;
          }
          var r1 = ecs[indexOfNew];
          var r2 = ecs[indexOfExisting];
          var range1 = {};
          var range2 = {};
          switch(mode) {
            case 0:
              return [];
              break;
            case 1:
              ecs.splice(indexOfExisting, 1);
              changes = true;
              break;
            case 2:
              range1.start = new Date(r1.startDate);
              range1.end = new Date(r1.endDate);
              range2.start = new Date(r2.startDate);
              range2.end = new Date(r2.endDate);
              changes = true;
              if (range1.start >= range2.start && range1.end <= range2.end) {
                ecs.splice(indexOfNew, 1);
              } else {
                if (range1.start < range2.start && range1.end > range2.end) {
                  ecs.push({isNew:true, startDate:r2.endDate, endDate:r1.endDate});
                  r1.endDate = r2.startDate;
                } else {
                  if (range1.start < range2.start) {
                    r1.endDate = r2.startDate;
                  } else {
                    r1.startDate = r2.endDate;
                  }
                }
              }
              break;
            case 3:
              range1.start = new Date(r1.startDate);
              range1.end = new Date(r1.endDate);
              range2.start = new Date(r2.startDate);
              range2.end = new Date(r2.endDate);
              changes = true;
              if (range1.start > range2.start && range1.end < range2.end) {
                ecs.push({isNew:false, startDate:r1.endDate, endDate:r2.endDate, ref:r2.ref});
                r2.endDate = r1.startDate;
              } else {
                if (range1.start <= range2.start && range1.end >= range2.end) {
                  ecs.splice(indexOfExisting, 1);
                } else {
                  if (range1.start < range2.start) {
                    r2.startDate = r1.endDate;
                  } else {
                    r2.endDate = r1.startDate;
                  }
                }
              }
              break;
          }
        }
      }
    }
    return ecs;
  };
  WMEAC.getCountriesFromSegmentSet = function(segs) {
    var cids = segs.map(function(s) {
      if (s.attributes.hasOwnProperty("primaryStreetID") && s.attributes.primaryStreetID != null) {
        var stid = s.attributes.primaryStreetID;
        if (W.model.streets.objects.hasOwnProperty(stid)) {
          var st = W.model.streets.objects[stid];
          if (st.hasOwnProperty("cityID") && st.cityID != null && typeof st.cityID != "undefined") {
            var ctid = st.cityID;
            if (W.model.cities.objects.hasOwnProperty(ctid)) {
              return W.model.cities.objects[ctid].countryID;
            }
          }
        }
      }
      return null;
    }).filter(function(cid) {
      return cid != null;
    });
    return W.model.countries.getObjectArray(function(c) {
      return cids.indexOf(c.id) != -1;
    });
  };
  WMEAC.getOppositeClosure = function(closure) {
    return W.model.roadClosures.getObjectArray(function(c) {
      return closure.reason == c.reason && closure.startDate == c.startDate && closure.endDate == c.endDate && closure.segID == c.segID && closure.forward != c.forward;
    });
  };
  WMEAC.getCityStreetsFromSegmentSet = function(segs) {
    var r = {};
    function add(city, street) {
      if (!r.hasOwnProperty(city)) {
        r[city] = {};
      }
      if (!r[city].hasOwnProperty(street)) {
        r[city][street] = 0;
      }
      r[city][street]++;
    }
    segs.forEach(function(s) {
      var city = "noCity";
      if (s.attributes.primaryStreetID != null && W.model.streets.objects.hasOwnProperty(s.attributes.primaryStreetID)) {
        var st = W.model.streets.objects[s.attributes.primaryStreetID];
        if (st.hasOwnProperty("cityID") && st.cityID != null && typeof st.cityID != "undefined") {
          var ctid = st.cityID;
          if (W.model.cities.objects.hasOwnProperty(ctid)) {
            if (!W.model.cities.objects[ctid].isEmpty) {
              city = W.model.cities.objects[ctid].name;
            }
          }
        }
        if (W.model.streets.objects[s.attributes.primaryStreetID].isEmpty) {
          add(city, "noStreet");
        } else {
          add(city, W.model.streets.objects[s.attributes.primaryStreetID].name);
        }
      }
    });
    return r;
  };
  WMEAC.download = function(data, filename) {
    var element = document.createElement("a");
    element.style.display = "none";
    element.setAttribute("href", encodeURI("data:text/plain," + data));
    element.setAttribute("download", filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  WMEAC.buildPermalink = function(data) {
    var getvars = [];
    for (var m in data) {
      if (data.hasOwnProperty(m)) {
        getvars.push("" + m + "=" + data[m]);
      }
    }
    return document.location.protocol + "//" + document.location.host + document.location.pathname + "?" + getvars.join("&amp;");
  };
  var cssElt = WMEAC.createElement({type:"style"});
  cssElt.type = "text/css";
  var css = "";
  css += ".slashed:after { content: ''; position: relative; width: 140%; height: 1px; display: block; background: red; transform: rotate(-30deg); margin-top: -50%; margin-left: -20%; }";
  css += ".wmeac-sidepanel button { border: none; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; border-top-left-radius: 5px; border-top-right-radius: 5px; background-color: #F1DDDB }";
  css += "#wmeac-progressBarInfo { display: none; width: 90%; float: left; position: absolute; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px; margin-bottom: -100%; background-color: #c9e1e9; z-index: 999; margin: 5px; margin-right: 20px; }";
  css += ".wmeac-progressBarBG { margin-top: 2px; margin-bottom: 2px; margin-left: 2px; margin-right: 2px; padding-bottom: 0px; padding-top: 0px; padding-left: 0px; padding-right: 0px; width: 33%; background-color: #93c4d3; border: 3px rgb(147, 196, 211); border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px; height: 22px;}";
  css += ".wmeac-progressBarFG { float: left; position: relative; bottom: 22px; height: 0px; text-align: center; width: 100% }";
  css += ".wmeac-button { border: none; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; border-top-left-radius: 5px; border-top-right-radius: 5px; background-color: #F1DDDB; display: inline-block; padding: 6px 12px; cursor: pointer; text-align: center; font-weight: bold; }";
  css += ".wmeac-closuredialog { border: 2px solid #F1DDDB; width: 100%; float: left; display: none; position: absolute; padding: 0 0px;  border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; border-top-left-radius: 10px; border-top-right-radius: 10px; background-color: #FDEDEB; width: 500px; z-index: 9999; left: 80px; top: 10px;}";
  css += ".wmeac-closuredialog button { border: none; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; border-top-left-radius: 5px; border-top-right-radius: 5px; background-color: #F1DDDB; margin: 3px; }";
  css += ".wmeac-closuredialog h1 { background-color: #F1DDDB; text-align: center; font-size: medium; margin-top: 0px; padding: 10px;}";
  css += ".wmeac-closuredialog .content { padding: 10px;}";
  css += ".wmeac-closuredialog .content table { witdh: 100%; border: none; font-size: 10px; text-transform: uppercase;}";
  css += ".wmeac-closuredialog .content table tbody tr { vertical-align: top;}";
  css += ".wmeac-closuredialog .content table tbody tr td { padding-right: 2px; padding-left: 2px;}";
  css += ".wmeac-closuredialog-fromgroup { display: inline-block; }";
  css += ".wmeac-nav-tabs>ul { border-bottom: 1px solid #F6C3BE }";
  css += ".wmeac-nav-tabs>li { float: left; margin-bottom: -1px; }";
  css += ".wmeac-nav-tabs>li>a { border: 1px solid #F6C3BE; border-top-left-radius: 5px; border-top-right-radius: 5px; margin-right: 2px;}";
  css += ".wmeac-nav-tabs>li.active>a { background-color: rgba(0, 0, 0, 0); border-bottom: 1px solid #FDEDEB}";
  css += ".wmeac-nav-tabs>li:not(.active)>a { background-color: #DADBDC}";
  css += ".wmeac-tab-pane {border: 1px solid #F6C3BE; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; border-top-left-radius: 0px; border-top-right-radius: 0px; padding: 5px;}";
  css += ".wmeac-closuredialog .footer { height: 40px; padding: 0 10px;}";
  css += "#wmeac-csv-closures-list ul { list-style-type: none; padding: 0px;}";
  css += "#wmeac-csv-closures-list ul li { width: 100%; height: 42px; border-radius: 4px; margin-top: 1px; }";
  css += "#wmeac-csv-closures-list ul li > * { display: table-cell; vertical-align: middle;}";
  css += ".wmeac-csv-closures-list-add { background-color: #C6DFFF; }";
  css += ".wmeac-csv-closures-list-remove { background-color: #FFC65F; }";
  css += ".wmeac-csv-closures-list-failed { background-color: #FF8585; }";
  css += ".wmeac-csv-closures-list-done { background-color: #B9FAB1; }";
  css += ".wmeac-csv-closures-list-col-action { width: 14px; min-width: 14px; }";
  css += ".wmeac-csv-closures-list-col-lr { font-size: xx-small; width: 100%; }";
  css += ".wmeac-csv-closures-list-col-lr > * { height: 14px; overflow-y: hidden; vertical-align: middle; }";
  css += ".wmeac-csv-closures-list-col-dates { width: 75px; min-width: 75px; font-size: xx-small; text-align: center; }";
  css += ".wmeac-csv-closures-list-col-dates > * { height: 14px; overflow-y: hidden; vertical-align: center; }";
  css += ".wmeac-csv-closures-list-col-dir { width: 35px; min-width: 35px; text-align: center; }";
  css += ".wmeac-csv-closures-list-col-it { width: 15px; min-width: 15px; }";
  css += ".wmeac-csv-closures-list-col-target { width: 15px; min-width: 15px; }";
  css += ".wmeac-csv-closures-list-col-apply { width: 15px; min-width: 15px; }";
  css += ".wmeac-csv-closures-minilog { font-size: xx-small; font-family: monospace; border: 2px solid #F6C3BE; border-top: none; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: #FFFFFF; }";
  css += "#wmeac-csv-closures-log { font-size: xx-small; font-family: monospace; border: 2px solid #F6C3BE; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; border-top-left-radius: 5px; border-top-right-radius: 5px; padding-top: 8px; position: relative;  margin-top: 10px; }";
  css += '#wmeac-csv-closures-log:before { content: "Logs"; position: absolute; top: -8px; left: 5px; float: left; background: #F6C3BE; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 2px; }';
  css += "#wmeac-csv-closures-preview { font-size: small; white-space: nowrap; font-family: monospace; border: 2px solid #F6C3BE; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; border-top-left-radius: 5px; border-top-right-radius: 5px; padding-top: 8px; position: relative; min-height: 20px; }";
  css += '#wmeac-csv-closures-preview:before { content: "Preview"; position: absolute; top: -8px; left: 5px; float: left; background: #F6C3BE; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 2px; }';
  css += '.wmeac-hl:after { content: "\\f018"; position: relative; display: block; margin-top: -100%; margin-left: 50%; font-family: FontAwesome; }';
  cssElt.innerHTML = css;
  document.body.appendChild(cssElt);
  WMEAC.bootstrapAC = function() {
    window.setTimeout(WMEAC.initialize, 500);
  };
  WMEAC.initialize = function() {
    WMEAC.log("init");
    WMEAC.waitForWaze(function() {
      WMEAC.load();
      WMEAC.log("presets", WMEAC.presets);
      WMEAC.initUI();
    });
    WMEAC.log("init done");
  };
  WMEAC.waitForWaze = function(handler) {
    var APIRequired = [{o:"W"}, {o:"W.model"}, {o:"W.map"}, {o:"W.loginManager"}, {o:"W.vent"}, {o:"W.Config"}, {o:"W.controller"}];
    for (var i = 0; i < APIRequired.length; i++) {
      var path = APIRequired[i].o.split(".");
      var object = window;
      for (var j = 0; j < path.length; j++) {
        object = object[path[j]];
        if (typeof object == "undefined" || object == null) {
          window.setTimeout(function() {
            WMEAC.waitForWaze(handler);
          }, 500);
          return;
        }
      }
    }
    var userInfo = WMEAC.getId("user-info");
    if (userInfo == null) {
      window.setTimeout(function() {
        WMEAC.waitForWaze(handler);
      }, 500);
      return;
    }
    var navTabs = userInfo.getElementsByTagName("ul");
    if (navTabs.length == 0) {
      window.setTimeout(function() {
        WMEAC.waitForWaze(handler);
      }, 500);
      return;
    }
    if (typeof navTabs[0] == "undefined") {
      window.setTimeout(function() {
        WMEAC.waitForWaze(handler);
      }, 500);
      return;
    }
    var tabContents = userInfo.getElementsByTagName("div");
    if (tabContents.length == 0) {
      window.setTimeout(function() {
        WMEAC.waitForWaze(handler);
      }, 500);
      return;
    }
    if (typeof tabContents[0] == "undefined") {
      window.setTimeout(function() {
        WMEAC.waitForWaze(handler);
      }, 500);
      return;
    }
    handler();
  };
  WMEAC.initUI = function() {
    var addon = WMEAC.createElement({type:"section", id:"wmeac-addon"});
    WMEAC.pb = new WMEAC.ProgressBar("wmeac-progressBarInfo");
    addon.appendChild(WMEAC.pb.divpbi);
    var section = WMEAC.createElement({type:"p", id:"wmeac-main-title"});
    section.style.paddingTop = "0px";
    section.style.marginTop = "-15px";
    section.style.textIndent = "8px";
    var title = '<b><a target="_blank" href="https://greasyfork.org/scripts/20705-wme-advanced-closures"><u>Advanced Closures</u></a> <a target="_blank" href="https://www.waze.com/forum/viewtopic.php?f=1316&t=193462">Fr</a> <a target="_blank" href="https://www.waze.com/forum/viewtopic.php?f=819&t=193465">En</a> </b> v' + WMEAC.ac_version;
    section.innerHTML = title;
    addon.appendChild(section);
    var divAdvCl = WMEAC.createElement({type:"div", className:"wmeac-sidepanel", id:"wmeac-ac"});
    var addACBtn = WMEAC.createElement({type:"div", id:"wmeac-add-advanced-closure-button", className:"wmeac-button"});
    addACBtn.style.width = "100%";
    addACBtn.innerHTML = '<i class="fa fa-clock-o"></i> Add advanced closure';
    addACBtn.addEventListener("click", WMEAC.showAddAdvancedClosure);
    divAdvCl.appendChild(addACBtn);
    var divCSV = WMEAC.createElement({type:"div", className:"wmeac-sidepanel", id:"wmeac-csv"});
    var csvHTML = '<label for="wmeac-csv-file" class="wmeac-button">Parse CSV</label>    <input id="wmeac-csv-file" type="file" name="files[]" style="display: none;" />';
    csvHTML += '    <div id="wmeac-csv-closures" style="display: none;">        <div id="wmeac-csv-closures-controls">            <input type="checkbox" id="wmeac-csv-closures-controls-check"> |             <a href="#" id="wmeac-csv-closures-controls-apply">Apply</a> |             <a href="#" id="wmeac-csv-closures-controls-segs">Check segments</a>        </div>        <div id="wmeac-csv-closures-list">            <ul id="wmeac-csv-closures-list-elts">            </ul>        </div>    </div>    <div id="wmeac-csv-closures-log">    </div>';
    divCSV.innerHTML = csvHTML;
    addon.appendChild(divAdvCl);
    addon.appendChild(WMEAC.createElement({type:"hr"}));
    addon.appendChild(divCSV);
    var userTabs = WMEAC.getId("user-tabs");
    var userInfo = WMEAC.getId("user-info");
    var sidePanelPrefs = WMEAC.getId("sidepanel-prefs");
    var navTabs = WMEAC.getElementsByClassName("nav-tabs", userTabs)[0];
    var tabContent = sidePanelPrefs.parentNode;
    newtab = WMEAC.createElement({type:"li"});
    newtab.innerHTML = '<a title="Advanced closures" href="#sidepanel-wmeac" data-toggle="tab"><span class="fa fa-road slashed"></span></a>';
    navTabs.appendChild(newtab);
    addon.id = "sidepanel-wmeac";
    addon.className = "tab-pane";
    addon.style.marginLeft = "-10px";
    tabContent.appendChild(addon);
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        function rescurse(node) {
          if (node.id == "segment-edit-closures") {
            WMEAC.installButtonInClosureTab(node);
          } else {
            if (node.className == "closures-list") {
              var target = WMEAC.getId("segment-edit-closures");
              if (target) {
                WMEAC.installButtonInClosureTab(target);
              }
            } else {
              for (var j = 0; j < node.childNodes.length; j++) {
                rescurse(node.childNodes[j]);
              }
            }
          }
        }
        for (var i = 0; i < mutation.addedNodes.length; i++) {
          rescurse(mutation.addedNodes[i]);
        }
      });
    });
    observer.observe(WMEAC.getId("edit-panel"), {childList:true, subtree:true});
    WMEAC.installButtonInClosureTab();
    W.vent.on("operationPending", function(e) {
      if (e.operation.id != "pending.road_data") {
        return;
      }
      WMEAC.pendingOps = true;
    });
    W.vent.on("operationDone", function(e) {
      if (e.operation.id != "pending.road_data") {
        return;
      }
      WMEAC.pendingOps = false;
    });
    W.model.events.register("mergeend", null, WMEAC.refreshHighlight);
    WMEAC.refreshHighlight();
    window.setTimeout(WMEAC.connectAdvancedClosureTabHandlers);
  };
  WMEAC.installButtonInClosureTab = function(node) {
    if (!node) {
      node = WMEAC.getId("segment-edit-closures");
    }
    if (!node) {
      return;
    }
    if ($(node).find("#wmeac-closuretab-add-advanced-closure-button").length == 0) {
      var addACBtn = WMEAC.createElement({type:"div", id:"wmeac-closuretab-add-advanced-closure-button", className:"wmeac-button"});
      addACBtn.style.width = "100%";
      addACBtn.style.marginBottom = "10px";
      addACBtn.innerHTML = '<i class="fa fa-clock-o"></i> Add advanced closure';
      addACBtn.addEventListener("click", WMEAC.showAddAdvancedClosure);
      $(node).find(".closures-list").prepend(addACBtn);
    }
  };
  WMEAC.showAddAdvancedClosure = function() {
    var ACDiv = WMEAC.getId("wmeac-add-advanced-closure-dialog");
    if (ACDiv == null) {
      ACDiv = WMEAC.createElement({type:"div", id:"wmeac-add-advanced-closure-dialog", className:"wmeac-closuredialog"});
      ACDiv.innerHTML = WMEAC.HTMLTemplates.advancedClosureDialog;
      W.map.div.appendChild(ACDiv);
      window.setTimeout(WMEAC.connectAdvancedClosureDialogHandlers);
      ACDiv.style.display = "none";
    }
    if (ACDiv.style.display == "block") {
      $(ACDiv).css({left:"80px", top:"10px"});
    } else {
      ACDiv.style.display = "block";
      W.selectionManager.events.register("selectionchanged", null, WMEAC.refreshClosureList);
      W.selectionManager.events.register("selectionchanged", null, WMEAC.refreshClosureListFromSelection);
      WMEAC.refreshClosureListFromSelection();
    }
    $(ACDiv).find(".input-group-addon").css({display:"table-cell"});
    WMEAC.showClosuresLayer(true);
  };
  WMEAC.HTMLTemplates = {};
  var rangeStartEndUI = '  <div class="form-group">    <label class="control-label" for="closure_rangestartDate">Range start (included)</label>    <div class="controls">      <div  style="width: 58%" class="date date-input-group input-group pull-left">        <input id="wmeac-advanced-closure-dialog-rangestartdate" class="form-control start-date" type="text" name="closure_rangestartDate">        <span class="input-group-addon">          <i class="fa fa-calendar"></i>        </span>      </div>    </div>  </div>  <div class="form-group">    <label class="control-label" for="closure_rangeendDate">Range end (included)</label>    <div class="controls">      <div style="width: 58%" class="date date-input-group input-group pull-left">        <input id="wmeac-advanced-closure-dialog-rangeenddate" class="form-control end-date" type="text" name="closure_rangeendDate">        <span class="input-group-addon">          <i class="fa fa-calendar"></i>        </span>      </div>    </div>  </div>';
  var startTimeAndDurationUI = '  <div class="wmeac-closuredialog-fromgroup">    <label class="control-label" for="closure_startTime">Start</label>    <div class="controls">      <div style="width: 58%;" class="bootstrap-timepicker input-group pull-left">        <input id="wmeac-advanced-closure-dialog-starttime" class="form-control start-time" type="text" name="closure_startTime">        <span class="input-group-addon">          <i class="fa fa-clock-o"></i>        </span>      </div>    </div>  </div>  <div class="wmeac-closuredialog-fromgroup">    <label class="control-label">Duration</label>    <div style="width: 58%;" class="bootstrap-timepicker input-group">      <div class="controls" style="display: flex;">        <span class="input-group-addon pull-left">          <i class="fa fa-step-forward"></i>        </span>        <span class="form-control" style="padding: 1px; display: flex">          <input id="wmeac-advanced-closure-dialog-duration-day" name="value" value=0 size=3/>          <span style="padding: 5px;">D</span>        </span>      </div>      <div class="bootstrap-timepicker input-group pull-left">        <input id="wmeac-advanced-closure-dialog-durationtime" class="form-control start-time" type="text" name="closure_durationTime">        <span class="input-group-addon">          <i class="fa fa-clock-o"></i>        </span>      </div>    </div>  </div>';
  var descriptionUI = '  <div class="form-group">      <label class="control-label" for="closure_reason">Description</label>      <div class="controls">        <input id="wmeac-advanced-closure-dialog-reason" class="form-control" type="text" name="closure_reason">      </div>    </div>';
  var locationUI = '  <div class="form-group">    <label class="control-label" for="closure_location">Location</label>    <div class="controls">      <input id="wmeac-advanced-closure-dialog-location" class="form-control" type="text" name="closure_location">    </div>  </div>';
  var directionUI = '  <div class="form-group">    <label class="control-label" for="closure_direction">Direction</label>    <div class="controls">      <select id="wmeac-advanced-closure-dialog-direction" style="font-family:\'FontAwesome\', Arial;" class="form-control" name="closure_direction">        <option value="3">Two way (&#xf0ec;)</option><option value="1">One way (A &#8594; B)</option><option value="2">One way (B &#8594; A)</option>      </select>    </div>  </div>';
  var ignoreTrafficUI = '  <div class="checkbox">    <label class="control-label" style="font-weight: bold;">      <input id="wmeac-advanced-closure-dialog-ignoretraffic" type="checkbox" name="closure_permanent">      Ignore Traffic    </label>  </div>';
  var MTEUI = '  <div class="form-group">    <label class="control-label control-label-inline" for="closure_MTE">Link to MTE</label>    <div class="controls">      <select id="wmeac-advanced-closure-dialog-mteid" class="form-control" name="closure_MTE" disabled><option value="">None</option></select>    </div>  </div>';
  var overlapModeUI = '  <div class="form-group">    <label class="control-label" for="closure_overlap">Overlap action</label>    <div class="controls">      <select id="wmeac-advanced-closure-dialog-overlap" style="font-family:\'FontAwesome\', Arial;" class="form-control" name="closure_overlap">        <option value="0">Keep existing</option><option value="1">Delete existing</option><option value="2">Fill with new</option><option value="3">Force new</option>      </select>    </div>  </div>';
  var tabRepeatUI = '  <div style="width: 150px;" class="input-group">    <div class="controls">      <div class="input-group pull-left">        <input id="wmeac-advanced-closure-dialog-repeat-ntimes" class="form-control" type="text" name="closure_repeat_ntimes">        <span class="input-group-addon" for="closure_repeat_ntimes">times</span>      </div>    </div>  </div>  <div style="width: 150px;" class="input-group">    <div class="controls">      <div style="width: 150px;" class="bootstrap-timepicker input-group">        <span class="input-group-addon">          every        </span>        <span class="form-control" style="padding: 1px; display: flex">          <input id="wmeac-advanced-closure-dialog-repeat-every-day" name="value" value=0 size=3/>          <span style="padding: 5px;">D</span>          <input id="wmeac-advanced-closure-dialog-repeat-every-hour" name="value" value=0 size=3/>          <span style="padding: 5px;">H</span>          <input id="wmeac-advanced-closure-dialog-repeat-every-minute" name="value" value=0  size=2/>          <span style="padding: 5px;">M</span>        </span>      </div>    </div>  </div>';
  var daysOfWeekUI = _(WMEAC.daysOfWeek).clone();
  daysOfWeekUI.push(daysOfWeekUI.shift());
  var tabEachUI = '<div class="checkbox">    <label class="control-label" style="font-weight: bold;">      <input id="wmeac-advanced-closure-dialog-each-dayall" type="checkbox" name="closure_each_dayall">      All    </label>  </div>  ' + daysOfWeekUI.map(function(d, i) {
    return '<div class="checkbox">    <label class="control-label" style="font-weight: bold;">      <input id="wmeac-advanced-closure-dialog-each-' + (i + 1) % 7 + '" type="checkbox" name="closure_each_' + d + '">      ' + d + "    </label>  </div>";
  }).join("");
  var tabHolidayUI = '<div class="content">  <a id="wmeac-advanced-closure-dialog-holiday-refresh" href="#">Refresh holidays</a><br>  <i id="wmeac-advanced-closure-dialog-holiday-refresh-spinner" class="fa fa-spinner fa-pulse fa-3x fa-fw" style="display: none;"></i>  <div id="wmeac-advanced-closure-dialog-holiday-list" class="form-group" style="overflow-y: scroll; max-height: 200px;">  </div></div>';
  var tabPresetsUI = '<div class="content">  <table><tr><td style="width: 50%; border-right: 1px solid #F6C3BE; padding-right: 5px;">    <div class="form-group">      <label class="control-label" for="presets_load">Load preset</label>      <div class="controls">        <div class="input-group">          <select style="width: 100%;" id="wmeac-advanced-closure-dialog-presets-list" name="presets_load">          </select>          <span id="wmeac-advanced-closure-dialog-presets-load" class="input-group-addon">            <i class="fa fa-folder-open-o"></i>          </span>          <span id="wmeac-advanced-closure-dialog-presets-delete" class="input-group-addon">            <i class="fa fa-trash"></i>          </span>        </div>      </div>      <label class="control-label" for="seg_load">Load from segment</label>      <div class="controls">        <div class="input-group">          <select style="width: 100%;" id="wmeac-advanced-closure-dialog-segclosure-list" name="presets_load">          </select>          <span id="wmeac-advanced-closure-dialog-presets-load-fromseg" class="input-group-addon">            <i class="fa fa-share"></i>          </span>        </div>      </div>    </div>    </td><td style="padding-left: 5px;">    <div class="form-group">      <label class="control-label" for="presets_save">Save preset</label>      <div class="controls">        <div class="input-group pull-left">        <input id="wmeac-advanced-closure-dialog-presets-name" class="form-control" type="text" name="presets_save">        <span id="wmeac-advanced-closure-dialog-presets-save" class="input-group-addon">          <i class="fa fa-floppy-o"></i>        </span>        </div>      </div>    </div>    </td></tr></table></div>';
  var tabsUI = '  <ul class="nav wmeac-nav-tabs">    <li class="active">      <a id="wmeac-advanced-closure-dialog-repeat" data-toggle="tab" href="#wmeac-advanced-closure-dialog-tabrepeat">Repeat</a>    </li>    <li>      <a id="wmeac-advanced-closure-dialog-each" data-toggle="tab" href="#wmeac-advanced-closure-dialog-tabeach">Each</a>    </li>    <li>      <a id="wmeac-advanced-closure-dialog-holiday" data-toggle="tab" href="#wmeac-advanced-closure-dialog-tabholiday">Holidays</a>    </li>    <li style="float: right;">      <a id="wmeac-advanced-closure-dialog-presets" data-toggle="tab" href="#wmeac-advanced-closure-dialog-tabpresets"><i class="fa fa-floppy-o"></i></a>    </li>  </ul>  <div class="tab-content">    <div class="tab-pane active wmeac-tab-pane" id="wmeac-advanced-closure-dialog-tabrepeat">    ' + 
  tabRepeatUI + '    </div>    <div class="tab-pane wmeac-tab-pane" id="wmeac-advanced-closure-dialog-tabeach">    ' + tabEachUI + '    </div>    <div class="tab-pane wmeac-tab-pane" id="wmeac-advanced-closure-dialog-tabholiday">    ' + tabHolidayUI + '    </div>    <div class="tab-pane wmeac-tab-pane" id="wmeac-advanced-closure-dialog-tabpresets">    ' + tabPresetsUI + "    </div>  </div>";
  var footerUI = '<div class="footer">    <div id="wmeac-csv-closures-preview"><div id="wmeac-csv-closures-preview-content" style="overflow: scroll; max-height: 100px;"></div></div>    <button style="float: left;" id="wmeac-advanced-closure-dialog-exportCSV-button">Export CSV</button>    <button style="float: right;" id="wmeac-advanced-closure-dialog-close-button">Close</button>    <button style="float: right;" id="wmeac-advanced-closure-dialog-apply-button">Apply</button></div>';
  WMEAC.HTMLTemplates.advancedClosureDialog = '<h1>Advanced closures</h1><div class="content">  <table>  <tr>    <td  style="width: 50%;">' + rangeStartEndUI + startTimeAndDurationUI + "    </td>    <td>" + descriptionUI + directionUI + ignoreTrafficUI + MTEUI + "    </td>  </tr>  </table>" + tabsUI + "</div>" + footerUI;
  WMEAC.connectAdvancedClosureDialogHandlers = function() {
    var e = null;
    e = WMEAC.getId("wmeac-advanced-closure-dialog-exportCSV-button");
    if (e) {
      e.addEventListener("click", function() {
        var rc = WMEAC.buildClosuresListFromRecurringUI();
        if (rc.error != "") {
          alert("Can't apply closures.\nPlease, check all parameters.");
          return;
        }
        if (W.selectionManager.getSelectedFeatures().length == 0 || W.selectionManager.getSelectedFeatures()[0].model.type != "segment") {
          alert("Please, select segment(s) before.");
          return;
        }
        var reason = $("#wmeac-advanced-closure-dialog-reason").val();
        var direction = $("#wmeac-advanced-closure-dialog-direction").val();
        var isIT = $("#wmeac-advanced-closure-dialog-ignoretraffic").is(":checked");
        var mteId = $("#wmeac-advanced-closure-dialog-mteid").val();
        var mte = W.model.majorTrafficEvents.get(mteId);
        closureList = rc.list.map(function(e) {
          var details = {reason:reason, direction:direction, startDate:e.start, endDate:e.end, location:"", permanent:isIT};
          if (mte) {
            details.eventId = mte.id;
          }
          return details;
        });
        var selection = _.pluck(W.selectionManager.getSelectedFeatures(), "model");
        var selectionReversed = [];
        if (direction != "3") {
          var rev = W.selectionManager.getReversedSegments();
          selection = selection.filter(function(e) {
            if (rev[e.attributes.id]) {
              selectionReversed.push(e);
              return false;
            }
            return true;
          });
        }
        var lonlat = W.map.center.transform(W.map.projection.projCode, "EPSG:4326");
        var csv = "header,reason,start date (yyyy-mm-dd hh:mm),end date (yyyy-mm-dd hh:mm),direction (A to B|B to A|TWO WAY),ignore trafic (Yes|No),segment IDs (id1;id2;...),lon/lat (like in a permalink: lon=xxx&lat=yyy),zoom (2 to 10),MTE id (empty cell if not),comment (optional)\n";
        closureList.forEach(function(e) {
          csv += 'add,"' + e.reason + '","' + e.startDate + '","' + e.endDate + '","' + (direction == 3 ? "TWO WAY" : direction == 2 ? "B to A" : "A to B") + '",' + (isIT ? "Yes" : "No") + ',"' + selection.map(function(s) {
            return s.attributes.id;
          }).join(";") + '","lon=' + lonlat.lon + "&lat=" + lonlat.lat + '",' + W.map.zoom + "," + mteId + ',"Generated by WMEAC"\n';
        });
        if (!selectionReversed.length == 0) {
          closureList.forEach(function(e) {
            csv += 'add,"' + e.reason + '","' + e.startDate + '","' + e.endDate + '","' + (direction == 3 ? "TWO WAY" : direction == 2 ? "A to B" : "B to A") + '",' + (isIT ? "Yes" : "No") + ',"' + selectionReversed.map(function(s) {
              return s.attributes.id;
            }).join(";") + '","lon=' + lonlat.lon + "&lat=" + lonlat.lat + '",' + W.map.zoom + "," + mteId + ',"Generated by WMEAC"\n';
          });
        }
        WMEAC.download(csv, "closures.csv");
      });
    }
    e = WMEAC.getId("wmeac-advanced-closure-dialog-close-button");
    if (e) {
      e.addEventListener("click", function() {
        var d = WMEAC.getId("wmeac-add-advanced-closure-dialog");
        if (d) {
          W.selectionManager.events.unregister("selectionchanged", null, WMEAC.refreshClosureList);
          W.selectionManager.events.unregister("selectionchanged", null, WMEAC.refreshClosureListFromSelection);
          d.style.display = "none";
        }
      });
    }
    e = WMEAC.getId("wmeac-advanced-closure-dialog-apply-button");
    if (e) {
      e.addEventListener("click", function() {
        var rc = WMEAC.buildClosuresListFromRecurringUI();
        if (rc.error != "") {
          alert("Can't apply closures.\nPlease, check all parameters.");
          return;
        }
        if (W.selectionManager.getSelectedFeatures().length == 0 || W.selectionManager.getSelectedFeatures()[0].model.type != "segment") {
          alert("Please, select segment(s) before.");
          return;
        }
        if (W.selectionManager.getSelectedFeatures().every(function(e) {
          return e.model.isAllowed(e.model.PERMISSIONS.EDIT_CLOSURES);
        }) == false) {
          alert("You don't have permission to edit closures on all those segments.");
          return;
        }
        var reason = $("#wmeac-advanced-closure-dialog-reason").val();
        var direction = $("#wmeac-advanced-closure-dialog-direction").val();
        var sc = WMEAC.WMEAPI.require("Waze/Modules/Closures/Models/SharedClosure");
        direction = direction == "1" ? sc.DIRECTION.A_TO_B : direction == "2" ? sc.DIRECTION.B_TO_A : sc.DIRECTION.TWO_WAY;
        var directionStr = direction == 1 ? "(A &#8594; B)" : direction == 2 ? "(B &#8594; A)" : "(&#8646;)";
        var isIT = $("#wmeac-advanced-closure-dialog-ignoretraffic").is(":checked");
        var mte = W.model.majorTrafficEvents.get($("#wmeac-advanced-closure-dialog-mteid").val());
        closureList = rc.list.map(function(e) {
          var details = {reason:reason, direction:direction, startDate:e.start, endDate:e.end, location:"", permanent:isIT};
          if (mte) {
            details.eventId = mte.id;
          }
          return details;
        });
        var selection = _.pluck(W.selectionManager.getSelectedFeatures(), "model");
        W.selectionManager.events.unregister("selectionchanged", null, WMEAC.refreshClosureList);
        WMEAC.addClosureListFromSelection(closureList, function(i, e) {
          $("#wmeac-advanced-closure-dialog-preview-" + i).html(e).css({color:"#44D544"});
        }, function(i, e) {
          $("#wmeac-advanced-closure-dialog-preview-" + i).html(e).css({color:"#D5444F"});
        }, function() {
          W.selectionManager.setSelectedModels(selection);
          var tmp = function selectionReady() {
            if (W.selectionManager.getSelectedFeatures().length == 0) {
              window.setTimeout(selectionReady, 500);
            } else {
              W.selectionManager.events.register("selectionchanged", null, WMEAC.refreshClosureList);
              $('a[href="#segment-edit-closures"]').click();
            }
          };
          window.setTimeout(tmp, 500);
        }, 0);
      });
    }
    if (typeof $.fn.datepicker !== "undefined") {
      $("#wmeac-advanced-closure-dialog-rangestartdate,#wmeac-advanced-closure-dialog-rangeenddate").datepicker({format:"yyyy-mm-dd", todayHighlight:!0, autoclose:!0});
    } else {
      if (typeof $.fn.daterangepicker !== "undefined") {
        $("#wmeac-advanced-closure-dialog-rangestartdate,#wmeac-advanced-closure-dialog-rangeenddate").daterangepicker({singleDatePicker:!0, locale:{format:"YYYY-MM-DD"}});
      }
    }
    $("#wmeac-advanced-closure-dialog-rangestartdate,#wmeac-advanced-closure-dialog-rangeenddate").on("change", function() {
      WMEAC.refreshMTEList();
    });
    $("#wmeac-advanced-closure-dialog-starttime,#wmeac-advanced-closure-dialog-durationtime").timepicker({defaultTime:"00:00", showMeridian:!1, template:!1});
    $("#wmeac-add-advanced-closure-dialog").find(".input-group").find(".input-group-addon").on("click", function(e) {
      $(e.target).parent().find("input").focus();
    }).find("i").on("click", function(e) {
      $(e.target).parent().parent().find("input").focus();
    });
    $("#wmeac-advanced-closure-dialog-each-dayall").on("click", function() {
      var atLeastOneChecked = false;
      for (var i = 0; i < 7; i++) {
        atLeastOneChecked = atLeastOneChecked || $("#wmeac-advanced-closure-dialog-each-" + i).is(":checked");
      }
      for (var i = 0; i < 7; i++) {
        $("#wmeac-advanced-closure-dialog-each-" + i).prop("checked", !atLeastOneChecked);
      }
      $("#wmeac-advanced-closure-dialog-each-dayall").prop("checked", !atLeastOneChecked);
    });
    if (typeof $.fn.spinner !== "undefined") {
      $("#wmeac-advanced-closure-dialog-repeat-every-day").spinner({min:0, spin:function(event, ui) {
        $(this).trigger("change");
      }});
      $("#wmeac-advanced-closure-dialog-repeat-every-hour").spinner({min:0, spin:function(event, ui) {
        if (ui.value >= 24) {
          $(this).spinner("value", ui.value - 24);
          $("#wmeac-advanced-closure-dialog-repeat-every-day").spinner("stepUp");
          return false;
        } else {
          if (ui.value < 0) {
            $(this).spinner("value", ui.value + 24);
            $("#wmeac-advanced-closure-dialog-repeat-every-day").spinner("stepDown");
            return false;
          }
        }
        $(this).trigger("change");
      }});
      $("#wmeac-advanced-closure-dialog-repeat-every-minute").spinner({spin:function(event, ui) {
        if (ui.value >= 60) {
          $(this).spinner("value", ui.value - 60);
          $("#wmeac-advanced-closure-dialog-repeat-every-hour").spinner("stepUp");
          return false;
        } else {
          if (ui.value < 0) {
            $(this).spinner("value", ui.value + 60);
            $("#wmeac-advanced-closure-dialog-repeat-every-hour").spinner("stepDown");
            return false;
          }
        }
        $(this).trigger("change");
      }, change:function(event) {
        if (event.target.value < 0 || event.target.value > 59) {
          $(this).spinner("value", 0);
        }
      }});
      $("#wmeac-advanced-closure-dialog-duration-day").spinner({min:0, spin:function(event, ui) {
        $(this).trigger("change");
      }});
    }
    $("#wmeac-advanced-closure-dialog-repeat,#wmeac-advanced-closure-dialog-each,#wmeac-advanced-closure-dialog-holiday").on("click", function(e) {
      window.setTimeout(WMEAC.refreshClosureList);
    });
    $("#wmeac-advanced-closure-dialog-holiday-refresh").on("click", function(e) {
      var hDiv = $("#wmeac-advanced-closure-dialog-holiday-list");
      $("#wmeac-advanced-closure-dialog-holiday-refresh-spinner").css({display:"block"});
      WMEAC.removeChildElements(hDiv[0]);
      window.setTimeout(function() {
        WMEAC.getHolidays({rangeStart:$("#wmeac-advanced-closure-dialog-rangestartdate").val(), rangeEnd:$("#wmeac-advanced-closure-dialog-rangeenddate").val(), countries:_.pluck(WMEAC.getCountriesFromSegmentSet(_.pluck(W.selectionManager.getSelectedFeatures(), "model")), "abbr"), handlerFinished:function(holidays) {
          WMEAC.lastGeneratedHolidays = holidays;
          if (holidays.length == 0) {
            hDiv.html("No holiday found.");
          } else {
            holidays.forEach(function(h, i) {
              var chkBx = WMEAC.createElement({type:"div", className:"checkbox"});
              chkBx.innerHTML = '<label class="control-label" style="font-weight: bold;">                                            <input id="wmeac-advanced-closure-dialog-holidays-' + i + '" type="checkbox">                                            ' + h.date + ": " + h.name + " (" + h.country + ")                                        </label>                                        ";
              $(chkBx).on("click", function(e) {
                window.setTimeout(WMEAC.refreshClosureList);
              });
              hDiv.append(chkBx);
            });
          }
          $("#wmeac-advanced-closure-dialog-holiday-refresh-spinner").css({display:"none"});
        }});
      });
    });
    $("#wmeac-add-advanced-closure-dialog").on("change", function(e) {
      window.setTimeout(WMEAC.refreshClosureList);
    });
    WMEAC.reloadPresets();
    $("#wmeac-advanced-closure-dialog-presets-load").on("click", function(e) {
      var presetIndex = parseInt($("#wmeac-advanced-closure-dialog-presets-list").val());
      $("#wmeac-advanced-closure-dialog-starttime").val(WMEAC.presets[presetIndex].values.starttime);
      if (WMEAC.presets[presetIndex].values.duration.hasOwnProperty("day")) {
        $("#wmeac-advanced-closure-dialog-duration-day").val(WMEAC.presets[presetIndex].values.duration.day);
      } else {
        $("#wmeac-advanced-closure-dialog-duration-day").val(Math.floor(WMEAC.presets[presetIndex].values.duration.hour / 24));
      }
      $("#wmeac-advanced-closure-dialog-durationtime").val("" + WMEAC.presets[presetIndex].values.duration.hour % 24 + ":" + WMEAC.presets[presetIndex].values.duration.minute);
      $("#wmeac-advanced-closure-dialog-reason").val(WMEAC.presets[presetIndex].values.description);
      $("#wmeac-advanced-closure-dialog-direction").val(WMEAC.presets[presetIndex].values.direction);
      $("#wmeac-advanced-closure-dialog-ignoretraffic").prop("checked", WMEAC.presets[presetIndex].values.ignoretraffic);
      $("#wmeac-advanced-closure-dialog-repeat-ntimes").val(WMEAC.presets[presetIndex].values.repeat.ntimes);
      if (WMEAC.presets[presetIndex].values.repeat.hasOwnProperty("day")) {
        $("#wmeac-advanced-closure-dialog-repeat-every-day").val(WMEAC.presets[presetIndex].values.repeat.day);
      } else {
        $("#wmeac-advanced-closure-dialog-repeat-every-day").val(Math.floor(WMEAC.presets[presetIndex].values.repeat.hour / 24));
      }
      $("#wmeac-advanced-closure-dialog-repeat-every-hour").val(WMEAC.presets[presetIndex].values.repeat.hour % 24);
      $("#wmeac-advanced-closure-dialog-repeat-every-minute").val(WMEAC.presets[presetIndex].values.repeat.minute);
      for (var i = 0; i < 7; i++) {
        $("#wmeac-advanced-closure-dialog-each-" + i).prop("checked", WMEAC.presets[presetIndex].values.each[i]);
      }
    });
    $("#wmeac-advanced-closure-dialog-presets-load-fromseg").on("click", function() {
      closureId = $("#wmeac-advanced-closure-dialog-segclosure-list").val();
      if (closureId) {
        var c = W.model.roadClosures.objects[closureId];
        if (c) {
          $("#wmeac-advanced-closure-dialog-starttime").val(c.startDate.split(" ")[1]);
          var duration = new Date(c.endDate) - new Date(c.startDate);
          var days = Math.floor(duration / 86400000);
          $("#wmeac-advanced-closure-dialog-duration-day").val(days);
          var hours = Math.floor((duration - days * 86400000) / 3600000);
          var minutes = Math.floor((duration - days * 86400000 - hours * 3600000) / 60000);
          $("#wmeac-advanced-closure-dialog-durationtime").val("" + hours + ":" + minutes);
          $("#wmeac-advanced-closure-dialog-reason").val(c.reason.trim());
          if (WMEAC.getOppositeClosure(c).length == 0) {
            $("#wmeac-advanced-closure-dialog-direction").val(c.forward ? 1 : 2);
          } else {
            $("#wmeac-advanced-closure-dialog-direction").val(3);
          }
          $("#wmeac-advanced-closure-dialog-ignoretraffic").prop("checked", c.permanent);
          if (c.eventId != null) {
            var options = [];
            $("#wmeac-advanced-closure-dialog-mteid option").each(function() {
              options.push($(this).val());
            });
            if (options.indexOf(c.eventId) != -1) {
              $("#wmeac-advanced-closure-dialog-mteid").val(c.eventId);
            } else {
              $("#wmeac-advanced-closure-dialog-mteid").val("");
            }
          }
        }
      }
    });
    $("#wmeac-advanced-closure-dialog-presets-delete").on("click", function(e) {
      var presetIndex = parseInt($("#wmeac-advanced-closure-dialog-presets-list").val());
      WMEAC.presets.splice(presetIndex, 1);
      WMEAC.save();
      WMEAC.reloadPresets();
    });
    $("#wmeac-advanced-closure-dialog-presets-save").on("click", function(e) {
      var name = $("#wmeac-advanced-closure-dialog-presets-name").val();
      var presetIndex = WMEAC.presets.findIndex(function(e) {
        return e.name == name;
      });
      var preset = {name:name, values:{duration:{}, repeat:{}, each:[]}};
      if (presetIndex != -1) {
        preset = WMEAC.presets[presetIndex];
      }
      preset.values.starttime = $("#wmeac-advanced-closure-dialog-starttime").val();
      preset.values.duration.day = $("#wmeac-advanced-closure-dialog-duration-day").val();
      preset.values.duration.hour = parseInt($("#wmeac-advanced-closure-dialog-durationtime").val().split(":")[0]);
      preset.values.duration.minute = parseInt($("#wmeac-advanced-closure-dialog-durationtime").val().split(":")[1]);
      preset.values.description = $("#wmeac-advanced-closure-dialog-reason").val();
      preset.values.direction = $("#wmeac-advanced-closure-dialog-direction").val();
      preset.values.ignoretraffic = $("#wmeac-advanced-closure-dialog-ignoretraffic").is(":checked");
      preset.values.repeat.ntimes = $("#wmeac-advanced-closure-dialog-repeat-ntimes").val();
      preset.values.repeat.day = $("#wmeac-advanced-closure-dialog-repeat-every-day").val();
      preset.values.repeat.hour = $("#wmeac-advanced-closure-dialog-repeat-every-hour").val();
      preset.values.repeat.minute = $("#wmeac-advanced-closure-dialog-repeat-every-minute").val();
      for (var i = 0; i < 7; i++) {
        preset.values.each[i] = $("#wmeac-advanced-closure-dialog-each-" + i).is(":checked");
      }
      if (presetIndex == -1) {
        WMEAC.presets.push(preset);
      }
      WMEAC.save();
      WMEAC.reloadPresets();
    });
    WMEAC.setDraggable($("#wmeac-add-advanced-closure-dialog"), {controller:$("#wmeac-add-advanced-closure-dialog h1:first-child"), container:[$("#OpenLayers_Map_200_OpenLayers_ViewPort"), $("#WazeMap")]});
  };
  WMEAC.connectAdvancedClosureTabHandlers = function() {
    var e = null;
    e = WMEAC.getId("wmeac-csv-file");
    if (e) {
      e.addEventListener("change", WMEAC.CSVFileChanged);
    }
    e = WMEAC.getId("wmeac-csv-closures-controls-check");
    if (e) {
      e.addEventListener("change", function(e) {
        WMEAC.CSVCheckAll(e.target.checked);
      });
    }
    e = WMEAC.getId("wmeac-csv-closures-controls-apply");
    if (e) {
      e.addEventListener("click", WMEAC.CSVApplyChecked);
    }
    e = WMEAC.getId("wmeac-csv-closures-controls-segs");
    if (e) {
      e.addEventListener("click", WMEAC.CSVCheckSegsChecked);
    }
  };
  WMEAC.reloadPresets = function() {
    var optionList = WMEAC.presets.map(function(p, i) {
      return '<option value="' + i + '">' + p.name + "</option>";
    });
    $("#wmeac-advanced-closure-dialog-presets-list").html(optionList.join(""));
  };
  WMEAC.ProgressBar = function(id) {
    this.id = id;
    this.divpbi = WMEAC.createElement({type:"div", id:id, className:id});
    var elt = WMEAC.createElement({type:"div", id:"wmeac-progressBar"});
    elt.style.width = "100%";
    elt.style.display = "none";
    elt.innerHTML = '<div class="wmeac-progressBarBG"></div><span class="wmeac-progressBarFG">100%</span>';
    this.divpbi.appendChild(elt);
    elt = WMEAC.createElement({type:"div", id:"wmeac-progressBar-info"});
    this.divpbi.appendChild(elt);
    this.isShown = function() {
      return this.divpbi.style.display != "none";
    };
    this.show = function(toShow) {
      this.divpbi.style.display = toShow ? "block" : "none";
    };
    this.update = function(value) {
      if (value == -1) {
        this.divpbi.children[0].style.display = "none";
        this.divpbi.children[1].style.display = "none";
        return;
      }
      value = Math.round(value);
      this.divpbi.children[0].style.display = "block";
      this.divpbi.children[1].style.display = "block";
      this.divpbi.children[0].children[0].style.width = value + "%";
      this.divpbi.children[0].children[1].innerHTML = value + "%";
    };
    this.info = function(text) {
      this.divpbi.children[1].innerHTML = text;
    };
  };
  WMEAC.ClassClosure = function(options) {
    WMEAC.log("options", options);
    this.isValid = false;
    this.errorMessage = "";
    var validProperties = ["reason", "startDate", "endDate", "direction", "segIDs", "lonlat", "permanent", "id", "zoom"];
    var goodOptions = 0;
    validProperties.forEach(function(p) {
      if (options.hasOwnProperty(p)) {
        this[p] = options[p];
        goodOptions++;
      } else {
        this.errorMessage += "Missing property " + p + "\n";
      }
    }, this);
    if (goodOptions == validProperties.length) {
      this.isValid = true;
    } else {
      return;
    }
    this.comment = "";
    if (options.hasOwnProperty("comment")) {
      this.comment = options.comment;
    }
    this.eventId = null;
    if (options.hasOwnProperty("eventId") && options.eventId != "") {
      this.eventId = options.eventId;
    }
    this.segIDs = this.segIDs.split(";");
    var matches = this.lonlat.match(/lon=(-?\d+\.?\d*)&lat=(-?\d+\.?\d*)/);
    if (matches && matches.length == 3) {
      this.lonlat = {lon:parseFloat(matches[1]), lat:parseFloat(matches[2])};
    } else {
      matches = this.lonlat.match(/lat=(-?\d+\.?\d*)&lon=(-?\d+\.?\d*)/);
      if (matches && matches.length == 3) {
        this.lonlat = {lon:parseFloat(matches[2]), lat:parseFloat(matches[1])};
      } else {
        this.isValid = false;
        this.errorMessage = "Can't parse lonlat: " + this.lonlat + "\n";
        return;
      }
    }
    if (this.direction != "A to B" && this.direction != "B to A" && this.direction != "TWO WAY") {
      this.isValid = false;
      this.errorMessage = "Can't determine direction: " + this.direction + "\n";
      return;
    }
    this.zoom = parseInt(this.zoom);
    if (this.zoom < 2 || this.zoom > 10) {
      this.isValid = false;
      this.errorMessage = "Wrong zoom (2 to 10): " + this.zoom + "\n";
      return;
    }
    this.applyInWME = function(successHandler, failureHandler) {
      var segs = WMEAC.segmentsIDsToSegments(this.segIDs);
      WMEAC.log("Segs: ", segs);
      segs = segs.filter(function(seg) {
        return seg.isAllowed(seg.PERMISSIONS.EDIT_CLOSURES);
      });
      if (segs.length == 0) {
        failureHandler([{attributes:{details:"No segment. Check permissions or existence."}}]);
      } else {
        var cityStreets = WMEAC.getCityStreetsFromSegmentSet(segs);
        var closureLocation = Object.keys(cityStreets).map(function(c) {
          return Object.keys(cityStreets[c]).map(function(s) {
            if (s == "noStreet") {
              return I18n.translations[I18n.locale].edit.address.no_street;
            }
            return s;
          }).join(", ") + (c == "noCity" ? "" : " (" + c + ")");
        }).join(" ; ");
        var sc = WMEAC.WMEAPI.require("Waze/Modules/Closures/Models/SharedClosure");
        var closureDetails = {reason:this.reason, direction:this.direction == "A to B" ? sc.DIRECTION.A_TO_B : this.direction == "B to A" ? sc.DIRECTION.B_TO_A : sc.DIRECTION.TWO_WAY, startDate:this.startDate, endDate:this.endDate, location:closureLocation, permanent:this.permanent == "Yes", segments:segs};
        if (this.eventId != null) {
          closureDetails.eventId = this.eventId;
        }
        WMEAC.addClosure(closureDetails, successHandler, failureHandler);
      }
    };
    this.removeInWME = function(successHandler, failureHandler) {
      var segs = WMEAC.segmentsIDsToSegments(this.segIDs);
      segs = segs.filter(function(seg) {
        return seg.isAllowed(seg.PERMISSIONS.EDIT_CLOSURES);
      });
      var allClosuresToRemove = [];
      var countToMatch = this.segIDs.length * (this.direction == "TWO WAY" ? 2 : 1);
      segs.forEach(function(s) {
        var that = this;
        var closures = W.model.roadClosures.getObjectArray(function(c) {
          return c.startDate == that.startDate && c.endDate == that.endDate && c.reason.trim() == that.reason && c.segID == s.attributes.id && c.permanent == (that.permanent == "Yes");
        });
        if (this.direction == "TWO WAY" || this.direction == "A to B" && closures.length == 1 && closures[0].forward == true || this.direction == "B to A" && closures.length == 1 && closures[0].forward == false) {
          allClosuresToRemove = allClosuresToRemove.concat(closures);
        }
      }, this);
      if (allClosuresToRemove.length == 0) {
        failureHandler([{attributes:{details:"No segment. Check permissions or existence."}}]);
      } else {
        WMEAC.removeClosure(allClosuresToRemove, successHandler, failureHandler);
      }
    };
  };
  WMEAC.buildClosuresListFromRecurringUI = function() {
    var list = [];
    var rangeStartDate = new Date($("#wmeac-advanced-closure-dialog-rangestartdate").val());
    if (!WMEAC.isValidDate(rangeStartDate)) {
      return {list:list, error:"Range start date is not valid"};
    }
    var rangeEndDate = new Date($("#wmeac-advanced-closure-dialog-rangeenddate").val());
    if (!WMEAC.isValidDate(rangeEndDate)) {
      return {list:list, error:"Range end date is not valid"};
    }
    if (rangeEndDate < rangeStartDate) {
      return {list:list, error:"Range end date is before range start date"};
    }
    var dD = parseInt($("#wmeac-advanced-closure-dialog-duration-day").val());
    if (isNaN(dD) || dH < 0) {
      return {list:list, error:"Duration days is invalid"};
    }
    var dH = parseInt($("#wmeac-advanced-closure-dialog-durationtime").val().split(":")[0]);
    var dM = parseInt($("#wmeac-advanced-closure-dialog-durationtime").val().split(":")[1]);
    if (dD == 0 && dH == 0 && dM == 0) {
      return {list:list, error:"Duration is null"};
    }
    var rangeStartTimeM = 0;
    var rangeEndTimeM = 1440;
    var rangeEndDateTime = rangeEndDate.clone();
    rangeEndDateTime.addMinutes(rangeEndTimeM);
    var startTimeM = $("#wmeac-advanced-closure-dialog-starttime").val().split(":").map(function(e) {
      return parseInt(e);
    }).reduce(function(p, c, i) {
      return p * 60 + c;
    });
    if ($("#wmeac-advanced-closure-dialog-tabrepeat").attr("class").indexOf("active") != -1) {
      var ntimes = parseInt($("#wmeac-advanced-closure-dialog-repeat-ntimes").val());
      if (isNaN(ntimes) || ntimes < 1) {
        return {list:list, error:"Repeat count is invalid"};
      }
      var evD = parseInt($("#wmeac-advanced-closure-dialog-repeat-every-day").val());
      if (isNaN(evD) || evD < 0) {
        return {list:list, error:"Repeat every day is invalid"};
      }
      var evH = parseInt($("#wmeac-advanced-closure-dialog-repeat-every-hour").val());
      if (isNaN(evH) || evH < 0) {
        return {list:list, error:"Repeat every hour is invalid"};
      }
      var evM = parseInt($("#wmeac-advanced-closure-dialog-repeat-every-minute").val());
      if (isNaN(evM) || evM < 0 || evM >= 60) {
        return {list:list, error:"Repeat every minute is invalid"};
      }
      if (evD * 1440 + evH * 60 + evM < dD * 1440 + dH * 60 + dM) {
        return {list:list, error:"Repeat must be greater than duration"};
      }
      var firstDateTimeStart = rangeStartDate.clone();
      if (startTimeM < rangeStartTimeM) {
        firstDateTimeStart.addDays(1);
      }
      firstDateTimeStart.setMinutes(startTimeM);
      var firstDateTimeEnd = firstDateTimeStart.clone();
      firstDateTimeEnd.addMinutes(dD * 1440 + dH * 60 + dM);
      for (var i = 0; i < ntimes; i++) {
        var start = firstDateTimeStart.clone();
        start.addMinutes((evD * 1440 + evH * 60 + evM) * i);
        var end = start.clone();
        end.addMinutes(dD * 1440 + dH * 60 + dM);
        if (end > rangeEndDateTime) {
          break;
        }
        list.push({start:WMEAC.dateToClosureStr(start), end:WMEAC.dateToClosureStr(end)});
      }
      return {list:list, error:""};
    } else {
      if ($("#wmeac-advanced-closure-dialog-tabeach").attr("class").indexOf("active") != -1) {
        var dow = WMEAC.daysOfWeek.map(function(e, i) {
          return $("#wmeac-advanced-closure-dialog-each-" + i).is(":checked");
        });
        var dayCount = Math.ceil((rangeEndDate - rangeStartDate + 1) / 86400000);
        var day0 = rangeStartDate.clone();
        day0.addMinutes(startTimeM);
        if (startTimeM < rangeStartTimeM) {
          day0.addDays(1);
        }
        for (var d = 0; d < dayCount; d++) {
          var start = day0.clone();
          start.addMinutes(d * 1440);
          if (dow[start.getUTCDay()]) {
            var end = start.clone();
            end.addMinutes(dD * 1440 + dH * 60 + dM);
            if (end > rangeEndDateTime) {
              break;
            }
            list.push({start:WMEAC.dateToClosureStr(start), end:WMEAC.dateToClosureStr(end)});
          }
        }
        return {list:list, error:""};
      } else {
        if ($("#wmeac-advanced-closure-dialog-tabholiday").attr("class").indexOf("active") != -1) {
          WMEAC.lastGeneratedHolidays.forEach(function(e, i) {
            if ($("#wmeac-advanced-closure-dialog-holidays-" + i).is(":checked")) {
              var start = (new Date(e.date)).addMinutes(startTimeM);
              var end = start.clone();
              end.addMinutes(dD * 1440 + dH * 60 + dM);
              list.push({start:WMEAC.dateToClosureStr(start), end:WMEAC.dateToClosureStr(end)});
            }
          });
          return {list:list, error:""};
        } else {
          return {list:list, error:"Wrong tab active"};
        }
      }
    }
  };
  WMEAC.refreshClosureList = function() {
    try {
      var rc = WMEAC.buildClosuresListFromRecurringUI();
      if (rc.error != "") {
        $("#wmeac-csv-closures-preview-content").html(rc.error);
      } else {
        var reason = $("#wmeac-advanced-closure-dialog-reason").val();
        var direction = $("#wmeac-advanced-closure-dialog-direction").val();
        var directionStr = direction == 1 ? "(A &#8594; B)" : direction == 2 ? "(B &#8594; A)" : "(&#8646;)";
        var isIT = $("#wmeac-advanced-closure-dialog-ignoretraffic").is(":checked");
        var existingClosures = W.selectionManager.getSelectedFeatures().reduce(function(p, c, i) {
          var revSegs = W.selectionManager.getReversedSegments();
          var isReversed = revSegs.hasOwnProperty(c.model.attributes.id) && revSegs[c.model.attributes.id];
          var realWay = isReversed ? direction == 1 ? 2 : 1 : direction;
          return p.concat(W.model.roadClosures.getObjectArray(function(e) {
            return e.segID == c.model.attributes.id && (direction == 3 || e.forward && realWay == 1 || !e.forward && realWay == 2);
          }));
        }, []);
        var mte = W.model.majorTrafficEvents.get($("#wmeac-advanced-closure-dialog-mteid").val());
        $("#wmeac-csv-closures-preview-content").html("" + rc.list.length + " closure(s) to apply: <br>" + rc.list.map(function(e, i) {
          var overlap = existingClosures.filter(function(c) {
            return WMEAC.dateTimeOverlaps({startDate:e.start, endDate:e.end}, c);
          }).map(function(c) {
            var msg = (c.reason ? c.reason + " " : "") + "(" + c.segID + ")";
            if (W.model.segments.objects.hasOwnProperty(c.segID) == false) {
              return msg;
            }
            if (W.model.segments.objects[c.segID].attributes.primaryStreetID == null) {
              return msg;
            }
            if (W.model.streets.objects.hasOwnProperty(W.model.segments.objects[c.segID].attributes.primaryStreetID) == false) {
              return msg;
            }
            var street = W.model.streets.objects[W.model.segments.objects[c.segID].attributes.primaryStreetID];
            if (!street.isEmpty) {
              msg = street.name + ": " + msg;
            }
            return msg;
          });
          var mteOK = !(mte && (new Date(e.start) < new Date(mte.attributes.startDate) || new Date(e.end) > new Date(mte.attributes.endDate)));
          return reason + ": " + e.start + " &#8594; " + e.end + " " + directionStr + ' <i class="fa fa-car' + (isIT ? " slashed" : "") + '"></i>' + (overlap.length != 0 ? ' <i title="Warning: overlap on existing closure!\n' + overlap.join("\n") + '" class="fa fa-exclamation-circle" style="color: orange"></i>' : "") + (mteOK ? "" : ' <i title="Warning: closure dates not inside MTE date!" class="fa fa-exclamation-circle" style="color: orange"></i>') + ' <span id="wmeac-advanced-closure-dialog-preview-' + 
          i + '"></span>';
        }).join("<br>"));
      }
    } catch (e) {
      WMEAC.logError("Error while refreshing closure list: ", e);
    }
  };
  WMEAC.refreshMTEList = function() {
    var currentMTEid = $("#wmeac-advanced-closure-dialog-mteid").val();
    var rangeStart = new Date($("#wmeac-advanced-closure-dialog-rangestartdate").val());
    var rangeEnd = new Date($("#wmeac-advanced-closure-dialog-rangeenddate").val());
    var options = [{name:"none", value:""}];
    $("#wmeac-advanced-closure-dialog-mteid").empty();
    if (WMEAC.isValidDate(rangeStart) && WMEAC.isValidDate(rangeEnd)) {
      rangeEnd.addDays(1);
      W.model.majorTrafficEvents.getObjectArray(function(mte) {
        return WMEAC.dateTimeOverlaps({startDate:rangeStart, endDate:rangeEnd}, {startDate:new Date(mte.attributes.startDate), endDate:new Date(mte.attributes.endDate)});
      }).forEach(function(mte) {
        options.push({name:mte.attributes.names[0].value, value:mte.attributes.id});
      });
    }
    options.forEach(function(o) {
      var el = WMEAC.createElement({type:"option"});
      el.setAttribute("value", o.value);
      if (currentMTEid == o.value) {
        el.setAttribute("selected", "");
      }
      el.innerHTML = o.name;
      $("#wmeac-advanced-closure-dialog-mteid").append(el);
    });
    if (options.length > 1) {
      $("#wmeac-advanced-closure-dialog-mteid").removeAttr("disabled");
    } else {
      $("#wmeac-advanced-closure-dialog-mteid").attr("disabled", "");
    }
  };
  WMEAC.refreshClosureListFromSelection = function() {
    try {
      var currentSegClosure = $("#wmeac-advanced-closure-dialog-segclosure-list").val();
      $("#wmeac-advanced-closure-dialog-segclosure-list").empty();
      if (W.selectionManager.getSelectedFeatures().length != 0) {
        var blackList = [];
        W.model.roadClosures.getObjectArray(function(c) {
          return c.segID == W.selectionManager.getSelectedFeatures()[0].model.attributes.id;
        }).sort(function(a, b) {
          return new Date(a.startDate) - new Date(b.startDate);
        }).forEach(function(c) {
          if (blackList.indexOf(c.id) != -1) {
            return;
          }
          var direction = c.forward ? "A to B" : "B to A";
          var oppositeClosure = WMEAC.getOppositeClosure(c);
          if (!oppositeClosure.length == 0) {
            direction = "Two way";
            blackList.push(oppositeClosure[0].id);
          }
          var el = WMEAC.createElement({type:"option"});
          el.setAttribute("value", c.id);
          if (currentSegClosure == c.id) {
            el.setAttribute("selected", "");
          }
          el.innerHTML = c.reason.trim() + " " + direction + " " + c.startDate + "&#8594;" + c.endDate;
          $("#wmeac-advanced-closure-dialog-segclosure-list").append(el);
        });
      }
    } catch (e) {
      WMEAC.logError("Error while refreshing closure list from selection: ", e);
    }
  };
  WMEAC.abbrToISO3166_1alpha2 = function(abbr) {
    switch(abbr) {
      case "GM":
        return "DE";
        break;
      case "BU":
        return "BG";
        break;
      case "EZ":
        return "CZ";
        break;
      case "SP":
        return "ES";
        break;
      case "UK":
        return "GB";
        break;
      case "LO":
        return "SK";
        break;
      default:
        return abbr;
        break;
    }
    return abbr;
  };
  WMEAC.getHolidays = function(options) {
    var holidays = [];
    var currentCountryIndex = 0;
    var rangeStart = new Date(options.rangeStart);
    var rangeEnd = (new Date(options.rangeEnd)).addDays(1);
    var years = [];
    for (y = parseInt(options.rangeStart.substring(0, 4)); y <= parseInt(options.rangeEnd.substring(0, 4)); y++) {
      years.push(y);
    }
    var currentYearIndex = 0;
    var tmp1 = function downloadNext() {
      if (currentCountryIndex >= options.countries.length) {
        if (options.handlerFinished) {
          holidays.sort(function(a, b) {
            return new Date(a.date) - new Date(b.date);
          });
          holidays = holidays.filter(function(h, i) {
            if (i != 0) {
              if (holidays[i - 1].date == h.date) {
                holidays[i - 1].name += " / " + h.name;
                holidays[i - 1].country += " / " + h.country;
                return false;
              }
            }
            return true;
          });
          options.handlerFinished(holidays);
          return;
        }
      }
      window.WMEAC_downloadHelper.add("https://holidayapi.com/v1/holidays?key=ca1a7925-0045-47da-bcf6-ee0de583e384&country=" + WMEAC.abbrToISO3166_1alpha2(options.countries[currentCountryIndex]) + "&year=" + years[currentYearIndex], function(data) {
        if (data.status == "success") {
          try {
            nextHoliday = JSON.parse(data.data);
            if (nextHoliday.hasOwnProperty("holidays")) {
              for (var hd in nextHoliday.holidays) {
                if (!nextHoliday.holidays.hasOwnProperty(hd)) {
                  continue;
                }
                if (nextHoliday.holidays[hd].length == 0) {
                  continue;
                }
                var name = _.pluck(nextHoliday.holidays[hd], "name").join(" / ");
                var h = nextHoliday.holidays[hd][0];
                var d = new Date(h.date);
                if (d >= rangeStart && d < rangeEnd) {
                  holidays.push({date:h.date, name:name, country:h.country});
                }
              }
              currentYearIndex++;
              if (currentYearIndex < years.length) {
                window.setTimeout(downloadNext);
                return;
              }
            }
          } catch (e) {
            WMEAC.log("Error while getting holiday from server!", e);
            WMEAC.log("data", data.data);
          }
          currentCountryIndex++;
          currentYearIndex = 0;
          window.setTimeout(downloadNext);
        }
      });
    };
    tmp1();
  };
  WMEAC.addClosure = function(options, successHandler, failureHandler) {
    if (options && options.hasOwnProperty("segments") && options.hasOwnProperty("reason") && options.hasOwnProperty("direction") && options.hasOwnProperty("startDate") && options.hasOwnProperty("endDate") && options.hasOwnProperty("location") && options.hasOwnProperty("permanent")) {
      WMEAC.log("Addinf closure: ", options);
      var fail = function(e) {
        return function(f) {
          if (failureHandler) {
            failureHandler(f);
          } else {
            WMEAC.log("Failed to create closure:", f);
          }
        };
      };
      var done = function(e) {
        return function(f) {
          if (successHandler) {
            successHandler(f);
          } else {
            WMEAC.log("Closure successful:", f);
          }
        };
      };
      var cab = WMEAC.WMEAPI.require("Waze/Modules/Closures/Models/ClosureActionBuilder");
      var sc = WMEAC.WMEAPI.require("Waze/Modules/Closures/Models/SharedClosure");
      var t = {};
      var closureDetails = {reason:options.reason + String.fromCharCode(160), direction:options.direction, startDate:options.startDate, endDate:options.endDate, location:options.location, permanent:options.permanent, segments:options.segments, reverseSegments:{}};
      if (options.hasOwnProperty("eventId") && options.eventId != null) {
        closureDetails.eventId = options.eventId;
      }
      var c = new sc["default"](closureDetails);
      t.actions = [cab.add(c)];
      W.controller.save(t).then(done())["catch"](fail());
      return true;
    }
    return false;
  };
  WMEAC.addClosureListFromSelection = function(closureList, successHandler, failureHandler, endHandler, i) {
    if (i >= closureList.length) {
      WMEAC.reloadClosuresLayer(function() {
        if (endHandler) {
          endHandler();
        }
      });
      return;
    }
    var c = closureList[i];
    var fail = function(e) {
      return function(f) {
        if (failureHandler) {
          var details = [];
          f.errors.forEach(function(err) {
            if (err.hasOwnProperty("attributes") && err.attributes.hasOwnProperty("details")) {
              details.push(err.attributes.details);
            }
          });
          failureHandler(i, details.join(" | "));
        } else {
          WMEAC.log("Failed to create closure:", f);
        }
        WMEAC.addClosureListFromSelection(closureList, successHandler, failureHandler, endHandler, i + 1);
      };
    };
    var done = function(e) {
      return function(f) {
        if (successHandler) {
          successHandler(i, "OK");
        } else {
          WMEAC.log("Closure successful:", f);
        }
        WMEAC.addClosureListFromSelection(closureList, successHandler, failureHandler, endHandler, i + 1);
      };
    };
    var cab = WMEAC.WMEAPI.require("Waze/Modules/Closures/Models/ClosureActionBuilder");
    var sc = WMEAC.WMEAPI.require("Waze/Modules/Closures/Models/SharedClosure");
    var t = {};
    var segs = _.pluck(W.selectionManager.getSelectedFeatures(), "model");
    var cityStreets = WMEAC.getCityStreetsFromSegmentSet(segs);
    var closureLocation = Object.keys(cityStreets).map(function(c) {
      return Object.keys(cityStreets[c]).map(function(s) {
        if (s == "noStreet") {
          return I18n.translations[I18n.locale].edit.address.no_street;
        }
        return s;
      }).join(", ") + (c == "noCity" ? "" : " (" + c + ")");
    }).join(" ; ");
    var closureDetails = {reason:closureList[i].reason + String.fromCharCode(160), direction:closureList[i].direction, startDate:closureList[i].startDate, endDate:closureList[i].endDate, location:closureLocation, permanent:closureList[i].permanent, segments:segs, reverseSegments:W.selectionManager.getReversedSegments()};
    if (closureList[i].hasOwnProperty("eventId") && closureList[i].eventId != null) {
      closureDetails.eventId = closureList[i].eventId;
    }
    var c = new sc["default"](closureDetails);
    t.actions = [cab.add(c)];
    W.controller.save(t).then(done())["catch"](fail());
  };
  WMEAC.addClosureFromSelection = function(options, successHandler, failureHandler) {
    if (options && options.hasOwnProperty("reason") && options.hasOwnProperty("direction") && options.hasOwnProperty("startDate") && options.hasOwnProperty("endDate") && options.hasOwnProperty("location") && options.hasOwnProperty("permanent")) {
      WMEAC.log("Addinf closure: ", options);
      var fail = function(e) {
        return function(f) {
          if (failureHandler) {
            failureHandler(f);
          } else {
            WMEAC.log("Failed to create closure:", f);
          }
        };
      };
      var done = function(e) {
        return function(f) {
          if (successHandler) {
            successHandler(f);
          } else {
            WMEAC.log("Closure successful:", f);
          }
        };
      };
      var cab = WMEAC.WMEAPI.require("Waze/Modules/Closures/Models/ClosureActionBuilder");
      var sc = WMEAC.WMEAPI.require("Waze/Modules/Closures/Models/SharedClosure");
      var t = {};
      var segs = _.pluck(W.selectionManager.getSelectedFeatures(), "model");
      var closureDetails = {reason:options.reason + String.fromCharCode(160), direction:options.direction, startDate:options.startDate, endDate:options.endDate, location:options.location, permanent:options.permanent, segments:segs, reverseSegments:W.selectionManager.getReversedSegments()};
      if (options.hasOwnProperty("eventId") && options.eventId != null) {
        closureDetails.eventId = options.eventId;
      }
      var c = new sc["default"](closureDetails);
      t.actions = [cab.add(c)];
      W.controller.save(t).then(done())["catch"](fail());
      return true;
    }
    return false;
  };
  WMEAC.removeClosure = function(closures, successHandler, failureHandler) {
    var fail = function(e) {
      return function(f) {
        if (failureHandler) {
          failureHandler(f);
        } else {
          WMEAC.log("Failed to delete closure:", f);
        }
      };
    };
    var done = function(e) {
      return function(f) {
        if (successHandler) {
          successHandler(f);
        } else {
          WMEAC.log("Closure deletion successful:", f);
        }
      };
    };
    var cab = WMEAC.WMEAPI.require("Waze/Modules/Closures/Models/ClosureActionBuilder");
    var sc = WMEAC.WMEAPI.require("Waze/Modules/Closures/Models/SharedClosure");
    var t = {};
    var c = new sc["default"]({closures:[].concat(closures)});
    t.actions = [cab["delete"](c)];
    W.controller.save(t).then(done())["catch"](fail());
    return true;
  };
  WMEAC.save = function() {
    WMEAC.log("save data...");
    localStorage.WMEAC = JSON.stringify({presets:WMEAC.presets});
  };
  WMEAC.load = function() {
    try {
      var saved = JSON.parse(localStorage.WMEAC);
      WMEAC.presets = saved.presets;
      WMEAC.log("presets", WMEAC.presets);
    } catch (err) {
      WMEAC.log("Error while loading data from storage: ", err);
    }
  };
  WMEAC.parseCSV = function(csvString) {
    if (csvString != null) {
      var csvArray = WMEAC.CSVtoArray(csvString);
      WMEAC.log("CSV as array:", csvArray);
      var isValid = WMEAC.csv[0].validate(csvArray);
      if (isValid.isValid) {
        WMEAC.log("CSV is valid!");
        var closures = WMEAC.csv[0].filter(csvArray).map(function(e, i) {
          return {action:e[0], closure:new WMEAC.ClassClosure({reason:e[1], startDate:e[2], endDate:e[3], direction:e[4], segIDs:e[6], lonlat:e[7], permanent:e[5], zoom:e[8], id:i, eventId:e[9], comment:e.length == 11 ? e[10] : ""}), UI:null};
        });
        WMEAC.log("Closure list:", closures);
        WMEAC.csvCurrentClosureList = closures;
        var listUI = WMEAC.getId("wmeac-csv-closures-list-elts");
        WMEAC.removeChildElements(listUI);
        closures.forEach(function(c) {
          c.UI = WMEAC.buildInlineClosureUI(c.closure, c.action);
          listUI.appendChild(c.UI);
        });
        WMEAC.csvShowList(true);
        WMEAC.csvAddLog("CSV parse successful\n");
        return true;
      } else {
        WMEAC.log("CSV is NOT valid!:" + isValid.feedBack + "\n");
        WMEAC.csvAddLog(isValid.feedBack + "\n");
        WMEAC.csvShowList(false);
        WMEAC.csvCurrentClosureList = null;
        return false;
      }
      return false;
    }
    return false;
  };
  WMEAC.CSVFileChanged = function(evt) {
    var files = evt.target.files;
    for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader;
      reader.onload = function(theFile) {
        return function(e) {
          WMEAC.log("import CSV file read");
          WMEAC.csvClearLog();
          if (WMEAC.parseCSV(e.target.result)) {
            WMEAC.csvCurrentBatchClosureList = WMEAC.csvCurrentClosureList.slice();
          }
        };
      }(f);
      reader.readAsText(f);
    }
    this.value = null;
    WMEAC.getId("wmeac-csv-closures-controls-check").checked = false;
  };
  WMEAC.ClassCSV = function(options) {
    this.isValid = false;
    if (options.hasOwnProperty("version")) {
      this.version = options.version;
    } else {
      return;
    }
    if (options.hasOwnProperty("regexpValidation")) {
      this.regexpValidation = options.regexpValidation;
    } else {
      return;
    }
    this.isValid = true;
    this.validate = function(data) {
      var regexps = this.regexpValidation;
      var feedBack = "";
      this.filter(data).forEach(function(line, l) {
        var isLineValid = line.reduce(function(stillValid, cell, i) {
          var isCellValid = cell.match(regexps[i]) != null;
          if (!isCellValid) {
            feedBack += "Error while parsing line " + l + " cell " + i + ': "' + cell + '" in line ' + line.join(",");
          }
          return stillValid && isCellValid;
        }, true);
      }, this);
      return {isValid:feedBack == "", feedBack:feedBack};
    };
    this.filter = function(data) {
      return data.filter(function(line) {
        return line.length >= 1 && ["add", "remove"].indexOf(line[0]) != -1;
      });
    };
  };
  WMEAC.csv.push(new WMEAC.ClassCSV({version:1, regexpValidation:[/.*/, /.*/, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/, /(^A to B$)|(^B to A$)|(^TWO WAY$)/, /(Yes)|(No)/, /^(\d+(;|$))+/, /(lon=(-?\d+\.?\d*)&lat=(-?\d+\.?\d*))|(lat=(-?\d+\.?\d*)&lon=(-?\d+\.?\d*))/, /^\d$/, /(^$)|(^-?\d+\.-?\d+\.-?\d+$)/]}));
  WMEAC.buildInlineClosureUI = function(closure, action) {
    var liElt = WMEAC.createElement({type:"li", className:"wmeac-csv-closures-list-" + action});
    liElt.setAttribute("closureID", closure.id);
    liElt.innerHTML = '<div class="wmeac-csv-closures-list-col-action"><input type="checkbox" /></div>                    <div class="wmeac-csv-closures-list-col-lr"><div title="' + closure.reason + '">' + closure.reason + '</div><div title="' + closure.comment + '">' + closure.comment + '</div></div>                    <div class="wmeac-csv-closures-list-col-dates"><div title="' + closure.startDate + '">' + closure.startDate + '</div><div title="' + closure.endDate + '">' + closure.endDate + '</div></div>                    <div class="wmeac-csv-closures-list-col-dir">' + 
    (closure.direction == "A to B" ? "A&#8594;B" : closure.direction == "B to A" ? "B&#8594;A" : "A&#8596;B") + '</div>                    <div class="wmeac-csv-closures-list-col-it"><input type="checkbox" ' + (closure.permanent == "Yes" ? "checked" : "") + ' disabled/></div>                    <div class="wmeac-csv-closures-list-col-target"><a href="' + WMEAC.buildPermalink({lon:closure.lonlat.lon, lat:closure.lonlat.lat, segments:closure.segIDs.join(","), zoom:closure.zoom}) + '" title="Go there!"><i class="fa fa-crosshairs"></i></a></div>                    <div class="wmeac-csv-closures-list-col-apply"><a href="#" title="Apply action of this closure"><i class="fa fa-arrow-circle-right"></i></a></div>                    <div class="wmeac-csv-closures-minilog" style="display: block;">' + 
    (action == "add" ? "Ready to apply" : action == "remove" ? "Ready to remove" : "") + "</div>";
    liElt.children[5].children[0].addEventListener("click", function(e) {
      WMEAC.csvClearLog();
      var cid = parseInt(e.target.parentNode.parentNode.parentNode.getAttribute("closureID"));
      var closure = WMEAC.csvCurrentClosureList.find(function(c) {
        return c.closure.id == cid;
      });
      WMEAC.log("Closure to target:", closure);
      var xy = OpenLayers.Layer.SphericalMercator.forwardMercator(closure.closure.lonlat.lon, closure.closure.lonlat.lat);
      W.map.setCenter(xy, closure.closure.zoom);
      var tmp3 = function selectSegments() {
        WMEAC.log("Now select segments...");
        var segs = WMEAC.segmentsIDsToSegments(closure.closure.segIDs);
        if (segs.length != closure.closure.segIDs.length) {
          if (segs.length == 0) {
            WMEAC.csvAddLog("No segment found: " + closure.closure.comment + "(" + closure.closure.reason + ")\n");
            WMEAC.setCSVMiniLog(closure, "Selection failed: no segment found", 3);
          } else {
            WMEAC.csvAddLog("Partial selection (" + segs.length + "/" + closure.closure.segIDs.length + "): " + closure.closure.comment + "(" + closure.closure.reason + ")\n");
            WMEAC.setCSVMiniLog(closure, "Partial selection: " + segs.length + "/" + closure.closure.segIDs.length, 2);
          }
          alert("Warning: missing segments.\nFound " + segs.length + "/" + closure.closure.segIDs.length + " segment(s)");
        } else {
          WMEAC.csvAddLog("Selection ok (" + segs.length + "): " + closure.closure.comment + "(" + closure.closure.reason + ")\n");
          WMEAC.setCSVMiniLog(closure, "Selection OK: " + segs.length, 1);
        }
        if (segs.length != 0) {
          W.selectionManager.setSelectedModels(segs);
          var tmp = function selectionReady() {
            if (W.selectionManager.getSelectedFeatures().length == 0) {
              window.setTimeout(selectionReady, 500);
            } else {
              $('a[href="#segment-edit-closures"]').click();
            }
          };
          window.setTimeout(tmp, 500);
        }
      };
      var tmp2 = function readyToSelect() {
        WMEAC.log("Test if ready to select...");
        if (WMEAC.pendingOps == true) {
          WMEAC.log("Not yet. Waiting for WME...");
          window.setTimeout(readyToSelect, 500);
        } else {
          tmp3();
        }
      };
      var tmp1 = function mapMovedEnd() {
        WMEAC.log("Test if roads are reloaded...");
        if (WMEAC.pendingOps == true) {
          WMEAC.log("Not yet. Waiting for WME...");
          window.setTimeout(mapMovedEnd, 500);
        } else {
          WMEAC.reloadRoadLayer();
          tmp2();
        }
      };
      window.setTimeout(tmp1, 500);
      e.preventDefault();
    });
    liElt.children[6].children[0].addEventListener("click", function(e) {
      WMEAC.csvClearLog();
      var liElt = e.target.parentNode.parentNode.parentNode;
      var cid = parseInt(liElt.getAttribute("closureID"));
      var closure = WMEAC.csvCurrentClosureList.find(function(c) {
        return c.closure.id == cid;
      });
      WMEAC.log("Closure to apply:", closure);
      WMEAC.csvApplyClosure(closure, null);
    });
    return liElt;
  };
  WMEAC.csvApplyClosure = function(closure, handler) {
    var xy = OpenLayers.Layer.SphericalMercator.forwardMercator(closure.closure.lonlat.lon, closure.closure.lonlat.lat);
    W.map.setCenter(xy, closure.closure.zoom);
    function applySuccess(evt) {
      WMEAC.csvAddLog("Closure OK: " + closure.closure.comment + "(" + closure.closure.reason + ")\n");
      closure.UI.className = "wmeac-csv-closures-list-done";
      WMEAC.setCSVMiniLog(closure, "OK", 1);
      handler && handler(true);
    }
    function applyFailure(evt) {
      var details = "";
      evt.errors.forEach(function(err) {
        if (err.hasOwnProperty("attributes") && err.attributes.hasOwnProperty("details")) {
          details += err.attributes.details + "\n";
        }
      });
      WMEAC.csvAddLog("Closure KO: " + closure.closure.comment + " (" + closure.closure.reason + ")\n" + details + "\n");
      WMEAC.setCSVMiniLog(closure, "KO: " + details, 3);
      closure.UI.className = "wmeac-csv-closures-list-failed";
      handler && handler(false);
    }
    var tmp3 = function applyClosure() {
      WMEAC.log("Now apply closure...");
      if (closure.action == "add") {
        closure.closure.applyInWME(applySuccess, applyFailure);
      } else {
        if (closure.action == "remove") {
          closure.closure.removeInWME(applySuccess, applyFailure);
        }
      }
    };
    var tmp2 = function readyToApply() {
      WMEAC.log("Test if ready to apply...");
      if (WMEAC.pendingOps == true) {
        WMEAC.log("Not yet. Waiting for WME...");
        window.setTimeout(readyToApply, 500);
      } else {
        tmp3();
      }
    };
    var tmp1 = function mapMovedEnd() {
      WMEAC.log("Test if roads are reloaded...");
      if (WMEAC.pendingOps == true) {
        WMEAC.log("Not yet. Waiting for WME...");
        window.setTimeout(mapMovedEnd, 500);
      } else {
        WMEAC.reloadRoadLayer();
        tmp2();
      }
    };
    window.setTimeout(tmp1, 1500);
  };
  WMEAC.csvAddLog = function(text) {
    var divLog = WMEAC.getId("wmeac-csv-closures-log");
    divLog.innerHTML += text.replace(/\n/g, "<br>");
  };
  WMEAC.csvClearLog = function() {
    var divLog = WMEAC.getId("wmeac-csv-closures-log");
    divLog.innerHTML = "";
  };
  WMEAC.csvShowList = function(show) {
    var divList = WMEAC.getId("wmeac-csv-closures");
    divList.style.display = show ? "block" : "none";
  };
  WMEAC.csvCheckAllSegments = function(i) {
    if (i == -1) {
      WMEAC.pb.update(0);
      WMEAC.pb.show(true);
      window.setTimeout(function() {
        WMEAC.csvCheckAllSegments(0);
      });
      return;
    }
    var continueSegmentCheck = function() {
      window.setTimeout(function() {
        WMEAC.csvCheckAllSegments(i + 1);
      });
    };
    if (i < WMEAC.csvCurrentBatchClosureList.length) {
      var currentClosure = WMEAC.csvCurrentBatchClosureList[i];
      WMEAC.pb.update(i * 100 / WMEAC.csvCurrentBatchClosureList.length);
      WMEAC.pb.info("Scanning segments. please wait...");
      var c = OpenLayers.Layer.SphericalMercator.forwardMercator(currentClosure.closure.lonlat.lon, currentClosure.closure.lonlat.lat);
      var b = W.map.calculateBounds();
      var zoomRatio = Math.pow(2, W.map.zoom - currentClosure.closure.zoom);
      var w = b.getWidth() * 1.7 * zoomRatio;
      var h = b.getHeight() * 1.7 * zoomRatio;
      var tileBounds = new OpenLayers.Bounds(c.lon - w / 2, c.lat - h / 2, c.lon + w / 2, c.lat + h / 2);
      tileBounds = tileBounds.transform(W.map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326")).toBBOX();
      var roadTypes = W.model.repos.segments.zoomToRoadType[currentClosure.closure.zoom] == -1 ? _.range(1, 22) : W.model.repos.segments.zoomToRoadType[currentClosure.closure.zoom];
      var WFVS = WMEAC.WMEAPI.require("Waze/Feature/Vector/Segment");
      var aseg = new WFVS["default"];
      var req = new XMLHttpRequest;
      req.open("GET", document.location.protocol + "//" + document.location.host + W.Config.api_base + "/Features?roadTypes=" + roadTypes.join("%2C") + "&problemFilter=0&mapUpdateRequestFilter=0&roadClosures=true&userAreas=false&managedAreas=false&majorTrafficEvents=false&bbox=" + encodeURIComponent(tileBounds) + "&language=en", true);
      req.onreadystatechange = function(e) {
        if (req.readyState == 4) {
          if (req.status == 200) {
            try {
              var data = JSON.parse(req.responseText);
              WMEAC.log("data", data);
              var existingSegs = currentClosure.closure.segIDs.filter(function(sid) {
                return data.segments.objects.find(function(seg) {
                  return sid == seg.id;
                }) != null;
              });
              var editableClosuresSegs = currentClosure.closure.segIDs.filter(function(sid) {
                return data.segments.objects.find(function(seg) {
                  return sid == seg.id && seg.permissions & aseg.PERMISSIONS.EDIT_CLOSURES;
                }) != null;
              });
              var overlaps = [];
              var existingClosures = existingSegs.forEach(function(sid) {
                var cl = data.roadClosures.objects.filter(function(c) {
                  return c.segID == sid;
                });
                console.log("cl", cl);
                cl.forEach(function(c) {
                  var forwardMustBe = currentClosure.closure.direction == "A to B" ? true : currentClosure.closure.direction == "B to A" ? false : null;
                  console.log("forwardMustBe", forwardMustBe);
                  console.log("dateTimeOverlaps", currentClosure.closure);
                  console.log("dateTimeOverlaps", c);
                  if (WMEAC.dateTimeOverlaps(currentClosure.closure, c)) {
                    if (forwardMustBe == null || forwardMustBe == c.forward) {
                      var segment = data.segments.objects.find(function(seg) {
                        return seg.id == sid;
                      });
                      var streetName = null;
                      if (segment && segment.primaryStreetID != null) {
                        var street = data.streets.objects.find(function(st) {
                          return st.id == segment.primaryStreetID;
                        });
                        if (street && street.name != null) {
                          streetName = street.name;
                        }
                      }
                      overlaps.push("Overlap with " + c.reason + (streetName != null ? " :" + streetName : "") + " (" + sid + ")");
                    }
                  }
                });
              });
              if (existingSegs.length == currentClosure.closure.segIDs.length && editableClosuresSegs.length == currentClosure.closure.segIDs.length && overlaps.length == 0) {
                WMEAC.csvAddLog("Seg check OK: " + currentClosure.closure.comment + " (" + currentClosure.closure.reason + "):\n" + existingSegs.length + " editable seg(s) found\n");
                WMEAC.setCSVMiniLog(currentClosure, "segs OK: " + existingSegs.length + " editable seg(s) found", 1);
              } else {
                if (existingSegs.length == currentClosure.closure.segIDs.length && editableClosuresSegs.length == currentClosure.closure.segIDs.length && overlaps.length != 0) {
                  WMEAC.csvAddLog("Seg check KO: " + currentClosure.closure.comment + " (" + currentClosure.closure.reason + "):\nOverlap detected on existing closures:\n" + overlaps.join("\n") + "\n");
                  WMEAC.setCSVMiniLog(currentClosure, "segs KO: " + overlaps.length + " overlap(s) detected", 2);
                } else {
                  if (existingSegs.length == currentClosure.closure.segIDs.length && editableClosuresSegs.length != currentClosure.closure.segIDs.length) {
                    WMEAC.csvAddLog("Seg check KO: " + currentClosure.closure.comment + " (" + currentClosure.closure.reason + "):\n" + existingSegs.length + "/" + currentClosure.closure.segIDs.length + " seg(s) found but " + (currentClosure.closure.segIDs.length - editableClosuresSegs.length) + " are not editable\n");
                    WMEAC.setCSVMiniLog(currentClosure, "segs KO: " + existingSegs.length + "/" + currentClosure.closure.segIDs.length + " seg(s) found and " + (currentClosure.closure.segIDs.length - editableClosuresSegs.length) + " are not editable", 2);
                  } else {
                    WMEAC.csvAddLog("Seg check KO: " + currentClosure.closure.comment + " (" + currentClosure.closure.reason + "):\n" + existingSegs.length + "/" + currentClosure.closure.segIDs.length + " seg(s) found\n");
                    WMEAC.setCSVMiniLog(currentClosure, "segs KO: " + existingSegs.length + "/" + currentClosure.closure.segIDs.length + " seg(s) found", 3);
                  }
                }
              }
            } catch (err) {
              WMEAC.log("Failed to parse Waze's server response: " + req.responseText);
              WMEAC.csvAddLog("Seg check KO: " + currentClosure.closure.comment + " (" + currentClosure.closure.reason + "):\nFailed to parse response from Waze\n");
              WMEAC.setCSVMiniLog(currentClosure, "segs KO: Failed to parse response from Waze", 3);
            }
          } else {
            WMEAC.log("Error on road tile: " + e.target.status);
            WMEAC.csvAddLog("Seg check KO: " + currentClosure.closure.comment + " (" + currentClosure.closure.reason + "):\nCommunication failed with Waze\n");
            WMEAC.setCSVMiniLog(currentClosure, "segs KO: Communication failed with Waze", 3);
          }
          continueSegmentCheck();
        }
      };
      req.onError = function(e) {
        WMEAC.log("Error on road tile: " + e.target.status);
        WMEAC.csvAddLog("Seg check KO: " + currentClosure.closure.comment + " (" + currentClosure.closure.reason + "):\nCommunication failed with Waze's server\n");
        WMEAC.setCSVMiniLog(currentClosure, "segs KO: Communication failed with Waze", 3);
        continueSegmentCheck();
      };
      req.send(null);
    } else {
      WMEAC.pb.show(false);
    }
  };
  WMEAC.setCSVMiniLog = function(closure, text, level) {
    var c = null;
    if (closure.hasOwnProperty("UI")) {
      c = closure;
    } else {
      c = WMEAC.csvCurrentClosureList.find(function(e) {
        return e.closure.id == closure.id;
      });
    }
    if (c != null) {
      c.UI.children[7].innerHTML = text;
      var colors = ["#000000", "#54C600", "#FFA000", "#FF0000"];
      if (arguments.length == 3) {
        c.UI.children[7].style.color = colors[level];
      } else {
        c.UI.children[7].style.color = colors[0];
      }
    }
  };
  WMEAC.CSVCheckAll = function(check) {
    WMEAC.csvCurrentClosureList.forEach(function(e) {
      e.UI.children[0].children[0].checked = check;
    });
  };
  WMEAC.CSVApplyChecked = function() {
    WMEAC.csvCurrentBatchClosureList = WMEAC.csvCurrentClosureList.filter(function(e) {
      return e.UI.children[0].children[0].checked;
    });
    WMEAC.csvClearLog();
    if (WMEAC.csvCurrentBatchClosureList.length == 0) {
      WMEAC.csvAddLog("No closure checked!\n");
    } else {
      WMEAC.showClosuresLayer(true);
      WMEAC.pb.update(0);
      WMEAC.pb.info("Applying closures. please wait...");
      WMEAC.pb.show(true);
      WMEAC.csvAddLog("Start to apply selected closures\n");
      window.setTimeout(function() {
        WMEAC.CSVBatchApply(0);
      });
    }
  };
  WMEAC.CSVBatchApply = function(i) {
    WMEAC.pb.update(i * 100 / WMEAC.csvCurrentBatchClosureList.length);
    if (i < WMEAC.csvCurrentBatchClosureList.length) {
      if (WMEAC.csvCurrentBatchClosureList[i].action != "add" && WMEAC.csvCurrentBatchClosureList[i].action != "remove") {
        WMEAC.csvAddLog("Closure KO: " + WMEAC.csvCurrentBatchClosureList[i].closure.comment + " (" + WMEAC.csvCurrentBatchClosureList[i].closure.reason + "): action " + WMEAC.csvCurrentBatchClosureList[i].action + " not supported yet\n");
        WMEAC.setCSVMiniLog(WMEAC.csvCurrentBatchClosureList[i], "KO: action " + WMEAC.csvCurrentBatchClosureList[i].action + " not supported yet", 2);
        WMEAC.CSVBatchApply(i + 1);
      } else {
        WMEAC.csvApplyClosure(WMEAC.csvCurrentBatchClosureList[i], function(success) {
          if (success) {
            WMEAC.csvAddLog("Closure OK: " + WMEAC.csvCurrentBatchClosureList[i].closure.comment + " (" + WMEAC.csvCurrentBatchClosureList[i].closure.reason + ")\n");
          } else {
            WMEAC.csvAddLog("Closure KO: " + WMEAC.csvCurrentBatchClosureList[i].closure.comment + " (" + WMEAC.csvCurrentBatchClosureList[i].closure.reason + ")\n");
          }
          WMEAC.CSVBatchApply(i + 1);
        });
      }
    } else {
      WMEAC.csvAddLog("Apply selected closures ended\n");
      WMEAC.reloadClosuresLayer();
      WMEAC.pb.show(false);
    }
  };
  WMEAC.CSVCheckSegsChecked = function() {
    WMEAC.csvClearLog();
    WMEAC.csvCurrentBatchClosureList = WMEAC.csvCurrentClosureList.filter(function(e) {
      return e.UI.children[0].children[0].checked;
    });
    if (WMEAC.csvCurrentBatchClosureList.length == 0) {
      WMEAC.csvAddLog("No closure checked!\n");
    } else {
      WMEAC.csvCheckAllSegments(-1);
    }
  };
  WMEAC.refreshHighlight = function() {
    try {
      var l = W.map.getLayersBy("uniqueName", "closures");
      if (l.length == 1) {
        l = l[0];
      }
      for (var m in l.markers) {
        if (!l.markers.hasOwnProperty(m)) {
          continue;
        }
        var marker = l.markers[m];
        if (marker.model.reason && marker.model.reason.length >= 1 && marker.model.reason.charCodeAt(marker.model.reason.length - 1) == 160) {
          marker.icon.$div.addClass("wmeac-hl");
        }
      }
    } catch (e) {
      WMEAC.log("Highlight error: ", e);
    }
  };
  if (typeof window.require != "undefined" && typeof window.define == "undefined") {
    WMEAC.WMEAPI = {require:window.require};
    WMEAC.bootstrapAC();
  } else {
    var WMEAPI = {};
    WMEAPI.scripts = document.getElementsByTagName("script");
    WMEAPI.url = null;
    for (i = 0; i < WMEAPI.scripts.length; i++) {
      if (WMEAPI.scripts[i].src.indexOf("/assets-editor/js/app") != -1) {
        WMEAPI.url = WMEAPI.scripts[i].src;
        break;
      }
    }
    if (WMEAPI.url == null) {
      throw new Error("WME require patch: can't detect WME main JS");
    }
    WMEAPI.require = function(e) {
      if (WMEAPI.require.define.modules.hasOwnProperty(e)) {
        return WMEAPI.require.define.modules[e];
      } else {
        console.error("Require failed on " + e, WMEAPI.require.define.modules);
      }
      return null;
    };
    WMEAPI.require.define = function(m) {
      if (WMEAPI.require.define.hasOwnProperty("modules") == false) {
        WMEAPI.require.define.modules = {};
      }
      for (var p in m) {
        WMEAPI.require.define.modules[p] = m[p];
      }
    };
    WMEAPI.tmp = window.webpackJsonp;
    WMEAPI.t = function(n) {
      if (WMEAPI.s[n]) {
        return WMEAPI.s[n].exports;
      }
      var r = WMEAPI.s[n] = {exports:{}, id:n, loaded:!1};
      return WMEAPI.e[n].call(r.exports, r, r.exports, WMEAPI.t), r.loaded = !0, r.exports;
    };
    WMEAPI.e = [];
    window.webpackJsonp = function(a, i) {
      var api = {};
      for (var o, d, u = 0, l = []; u < a.length; u++) {
        d = a[u], WMEAPI.r[d] && l.push.apply(l, WMEAPI.r[d]), WMEAPI.r[d] = 0;
      }
      var unknownCount = 0;
      var classname, funcStr;
      for (o in i) {
        WMEAPI.e[o] = i[o];
        funcStr = i[o].toString();
        classname = funcStr.match(/CLASS_NAME:"([^"]*)"/);
        if (classname) {
          api[classname[1].replace(/\./g, "/").replace(/^W\//, "Waze/")] = {index:o, func:WMEAPI.e[o]};
        } else {
          api["Waze/Unknown/" + unknownCount] = {index:o, func:WMEAPI.e[o]};
          unknownCount++;
        }
      }
      for (; l.length;) {
        l.shift().call(null, WMEAPI.t);
      }
      WMEAPI.s[0] = 0;
      var module = {};
      var apiFuncName;
      unknownCount = 0;
      for (o in i) {
        funcStr = i[o].toString();
        classname = funcStr.match(/CLASS_NAME:"([^"]*)"/);
        if (classname) {
          module = {};
          apiFuncName = classname[1].replace(/\./g, "/").replace(/^W\//, "Waze/");
          module[apiFuncName] = WMEAPI.t(api[apiFuncName].index);
          WMEAPI.require.define(module);
        } else {
          var matches = funcStr.match(/SEGMENT:"segment",/);
          if (matches) {
            module = {};
            apiFuncName = "Waze/Model/ObjectType";
            module[apiFuncName] = WMEAPI.t(api["Waze/Unknown/" + unknownCount].index);
            WMEAPI.require.define(module);
          } else {
            if (matches = funcStr.match(/TWO_WAY:/)) {
              module = {};
              apiFuncName = "Waze/Modules/Closures/Models/SharedClosure";
              module[apiFuncName] = WMEAPI.t(api["Waze/Unknown/" + unknownCount].index);
              WMEAPI.require.define(module);
            } else {
              if (matches = funcStr.match(/nextClosureID:/)) {
                module = {};
                apiFuncName = "Waze/Modules/Closures/Models/ClosureActionBuilder";
                module[apiFuncName] = WMEAPI.t(api["Waze/Unknown/" + unknownCount].index);
                WMEAPI.require.define(module);
              }
            }
          }
          unknownCount++;
        }
      }
      window.webpackJsonp = WMEAPI.tmp;
      WMEAC.WMEAPI = WMEAPI;
      setTimeout(WMEAC.bootstrapAC);
    };
    WMEAPI.s = {};
    WMEAPI.r = {0:0};
    WMEAPI.WMEHACK_Injected_script = document.createElement("script");
    WMEAPI.WMEHACK_Injected_script.setAttribute("type", "application/javascript");
    WMEAPI.WMEHACK_Injected_script.src = WMEAPI.url;
    document.body.appendChild(WMEAPI.WMEHACK_Injected_script);
  }
  WMEAC.log("Ready");
}
var WMEAC_Injected_script = document.createElement("script");
WMEAC_Injected_script.textContent = "" + WMEAC_Injected.toString() + " \n" + "WMEAC_Injected();";
WMEAC_Injected_script.setAttribute("type", "application/javascript");
document.body.appendChild(WMEAC_Injected_script);