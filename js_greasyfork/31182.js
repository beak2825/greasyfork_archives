// ==UserScript==
// @name                        Bot for Grepolis
// @namespace                   Bot for Grepolis
// @description                 Bot for lol
// @author                      green elephant
// @version                     2.0
// @include                     http://*.grepolis.com/*
// @include                     https://*.grepolis.com/*
// @exclude                     forum.*.grepolis.*/*
// @exclude                     wiki.*.grepolis.*/*

// @downloadURL https://update.greasyfork.org/scripts/31182/Bot%20for%20Grepolis.user.js
// @updateURL https://update.greasyfork.org/scripts/31182/Bot%20for%20Grepolis.meta.js
// ==/UserScript==

if (location.host.indexOf("grepolis.com", location.host.length - "grepolis.com".length) !== -1) {
  var be836d0d2 = {
    version : "18.05.2017 #1",
    controls : {},
    models : {},
    autoreload : {
      count : 0
    },
    towns : {},
    villages : {},
    scheduler : [],
    ajax : "//botsoft.org/en/bot/ajaxv2/?hash=be836d0d2",
    active : false,
    requests : 0,
    failRequests : 0,
    lastTownId : null,
    ress : ["wood", "stone", "iron"],
    /**
     * @param {Object} model
     * @return {undefined}
     */
    Filters : function(model) {
      /** @type {Object} */
      var data = model;
      this.items = {};
      /**
       * @param {Object} index
       * @param {Object} item
       * @return {?}
       */
      this.add = function(index, item) {
        if (index in this.items) {
          return false;
        }
        /** @type {Object} */
        this.items[index] = item;
        data.logger.debug("Filter {0} loaded", index);
        return index;
      };
      /**
       * @param {?} name
       * @return {?}
       */
      this.remove = function(name) {
        if (!(name in this.items)) {
          return false;
        }
        delete this.items[name];
        return name;
      };
      /**
       * @param {?} deepDataAndEvents
       * @return {?}
       */
      this.checkModule = function(deepDataAndEvents) {
        for (f in this.items) {
          var o = this.items[f];
          var hills = o(0, 0, 0, 0, 0, deepDataAndEvents);
          if (!hills) {
            return false;
          }
        }
        return true;
      };
    },
    str : {
      /**
       * @param {string} input
       * @return {?}
       */
      format : function(input) {
        /** @type {string} */
        var result = input;
        /** @type {number} */
        var argNum = 1;
        for (;argNum < arguments.length;argNum++) {
          result = result.replace("{" + (argNum - 1) + "}", arguments[argNum]);
        }
        return result;
      },
      /**
       * @param {?} data
       * @return {?}
       */
      btoa : function(data) {
        return btoa(unescape(encodeURIComponent(data)));
      },
      /**
       * @param {?} input
       * @return {?}
       */
      atob : function(input) {
        return decodeURIComponent(escape(atob(input)));
      }
    },
    /**
     * @param {Function} container
     * @return {undefined}
     */
    Logger : function(container) {
      /** @type {Function} */
      var d = container;
      /** @type {Array} */
      var buffer = [];
      var Y = this;
      /**
       * @param {string} data
       * @param {boolean} dataAndEvents
       * @return {?}
       */
      this.replaceTown = function(data, dataAndEvents) {
        /** @type {RegExp} */
        var rsingleTag = /\[town\](\d+)\[\/town\]/gi;
        /** @type {string} */
        var path = typeof data === "string" ? data.slice(0) : "";
        var keys;
        for (;keys = rsingleTag.exec(data);) {
          var self = ITowns.getTown(keys[1]) || d.towns[keys[1]];
          if (self) {
            if (dataAndEvents) {
              var fragment = self.getLinkFragment === "function" ? self.getLinkFragment() : btoa(JSON.stringify({
                id : self.id,
                ix : self.x,
                iy : self.y,
                name : self.name
              }));
              /** @type {string} */
              path = path.split(keys[0]).join('<span class="bbcodes bbcodes_town"><a class="gp_town_link" href="#' + fragment + '">' + self.name + "</a></span>");
            } else {
              /** @type {string} */
              path = path.split(keys[0]).join("'" + keys[0] + " (" + self.name + ")'");
            }
          }
        }
        return path;
      };
      /**
       * @param {string} type
       * @param {string} obj
       * @return {?}
       */
      var callback = function promise(type, obj) {
        var ret = {
          /**
           * @param {?} capture
           * @return {?}
           */
          msg : function(capture) {
            var names = Y.replaceTown(obj, true);
            d.addMessage.call(d, names, type, capture);
            return ret;
          },
          /**
           * @return {?}
           */
          send : function() {
            d.request("bot:log", {
              log : [{
                type : type,
                text : obj
              }]
            });
            return ret;
          }
        };
        return ret;
      };
      /**
       * @return {undefined}
       */
      this.log = function() {
        var time = d.ts2text(Timestamp.server());
        var msg = time + " >>> " + d.str.format.apply(this, arguments);
        msg = Y.replaceTown(msg);
        console.log(msg);
        buffer.push(msg);
        if (buffer.length > 300) {
          buffer = buffer.slice(buffer.length - 100);
        }
      };
      /**
       * @return {?}
       */
      this.info = function() {
        var result = d.str.format.apply(this, arguments);
        Y.log("[INFO] " + result);
        return callback("info", result);
      };
      /**
       * @return {?}
       */
      this.warning = function() {
        var result = d.str.format.apply(this, arguments);
        /** @type {string} */
        var hash = "[WARNING] " + result;
        Y.log(hash);
        d.request("bot:log", {
          log : [{
            type : "WARNING",
            text : result
          }]
        });
        return callback("warning", result);
      };
      /**
       * @return {?}
       */
      this.error = function() {
        var result = d.str.format.apply(this, arguments);
        /** @type {string} */
        var hash = "[ERROR] " + result;
        Y.log(hash);
        return callback("error", result);
      };
      /**
       * @return {?}
       */
      this.getBuffer = function() {
        return buffer;
      };
      /**
       * @return {?}
       */
      this.debug = function() {
        var result = d.str.format.apply(this, arguments);
        Y.log("[DEBUG] " + result);
        return callback("debug", result);
      };
    },
    /**
     * @param {?} Time
     * @param {?} f
     * @return {?}
     */
    runAtTown : function(Time, f) {
      if (typeof f != "function") {
        return;
      }
      var c = Game.townId;
      var fromF;
      Game.townId = Time;
      fromF = f();
      Game.townId = c;
      return fromF;
    },
    /**
     * @param {string} baseName
     * @param {?} timeoutKey
     * @return {?}
     */
    moduleLogger : function(baseName, timeoutKey) {
      return function(_type) {
        /** @type {Array} */
        var args = [];
        var self = be836d0d2;
        /** @type {number} */
        var i = 1;
        for (;i < arguments.length;i++) {
          if (i == 1) {
            args.push(baseName + ": " + arguments[i]);
          } else {
            args.push(arguments[i]);
          }
        }
        var wrapper;
        switch(_type) {
          case "warning":
            wrapper = self.logger.warning;
            break;
          case "error":
            wrapper = self.logger.error;
            break;
          case "debug":
            wrapper = self.logger.debug;
            break;
          default:
            wrapper = self.logger.info;
        }
        var params = wrapper.apply(self.logger, args);
        if (params && self.sett[timeoutKey] === false) {
          /**
           * @return {undefined}
           */
          params.msg = function() {
          };
        }
        return params;
      };
    },
    /**
     * @param {?} self
     * @return {undefined}
     */
    Sched : function(self) {
      /**
       * @param {string} obj
       * @return {?}
       */
      this.max = function(obj) {
        /** @type {number} */
        var newDuration = 0;
        self.scheduler.forEach(function(frame) {
          if (typeof obj === "undefined" || obj === frame.tag) {
            /** @type {number} */
            newDuration = Math.max(frame.time, newDuration);
          }
        });
        return newDuration;
      };
    },
    /**
     * @param {number} from
     * @param {number} to
     * @return {?}
     */
    randomInt : function(from, to) {
      return Math.round(Math.random() * (to - from) + from);
    },
    /**
     * @param {(number|string)} result
     * @param {number} deepDataAndEvents
     * @param {string} callback
     * @return {?}
     */
    schedule : function(result, deepDataAndEvents, callback) {
      /** @type {Array} */
      var args = [];
      /** @type {number} */
      var rh = (new Date).getTime();
      /** @type {number} */
      var timestamp = Math.max(result, rh) - deepDataAndEvents;
      var Tag = typeof callback === "undefined" ? "default" : callback;
      args.push(timestamp);
      this.scheduler.forEach(function(line) {
        if (line.time > timestamp) {
          args.push(line.time);
        }
      });
      args = args.sort();
      /** @type {number} */
      var time = timestamp;
      /** @type {number} */
      var i = 0;
      for (;i < args.length - 1;i++) {
        time = args[i + 1];
        if (time - args[i] > 2 * deepDataAndEvents) {
          time = args[i];
          break;
        }
      }
      time += deepDataAndEvents;
      this.scheduler.push({
        time : time,
        tag : Tag
      });
      return time;
    },
    /**
     * @param {string} obj
     * @return {?}
     */
    scheduleNearest : function(obj) {
      /** @type {Array} */
      var aProperties = [];
      /** @type {number} */
      var low = (new Date).getTime();
      /** @type {number} */
      var t = Math.max(obj, low);
      this.scheduler.forEach(function(line) {
        if (line.time > t) {
          aProperties.push(line.time);
        }
      });
      aProperties = aProperties.sort();
      return aProperties.length > 0 ? aProperties[0] : 0;
    },
    /**
     * @param {number} description
     * @param {number} deepDataAndEvents
     * @param {string} result
     * @return {?}
     */
    scheduleTimeout : function(description, deepDataAndEvents, result) {
      /** @type {number} */
      var tolerance = (new Date).getTime();
      description = description || 0;
      deepDataAndEvents = typeof deepDataAndEvents === "undefined" ? 4E3 : deepDataAndEvents;
      var restoreScript = typeof result === "undefined" ? "default" : result;
      var expected = this.schedule(description, deepDataAndEvents, restoreScript);
      return Math.max(expected - tolerance, 0);
    },
    /**
     * @param {string} result
     * @return {undefined}
     */
    scheduleClean : function(result) {
      var name = typeof result === "undefined" ? "default" : result;
      this.scheduler.forEach(function(v) {
        if (v.tag === name) {
          /** @type {number} */
          v.time = 0;
        }
      });
    },
    /**
     * @param {Date} date
     * @return {?}
     */
    utc : function(date) {
      /** @type {Date} */
      var against = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
      return against;
    },
    /**
     * @return {?}
     */
    gameTime : function() {
      return this.utc(new Date((Timestamp.server() + Timestamp.localeGMTOffset()) * 1E3));
    },
    /**
     * @param {?} options
     * @param {string} msg
     * @param {number} params
     * @return {undefined}
     */
    addMessage : function(options, msg, params) {
      var self = $("div#be836d0d2msgs");
      var d = this;
      var end = d.ts2text(Timestamp.server());
      msg = msg || "message";
      /** @type {number} */
      var backoff = typeof params === "undefined" ? 5 * 1E3 : params * 1E3;
      if (self.length > 0) {
        var $link = $(d.str.format('<div class="{0}"><div class="caption">{1}</div><div class="text">{2}</div></div>', msg, end, options));
        $link.click(function(e) {
          if (e.target.tagName != "A") {
            $(this).remove();
          }
        });
        self.prepend($link);
        if (backoff > 0) {
          setTimeout(function() {
            $link.remove();
          }, backoff);
        }
      }
    },
    /**
     * @return {undefined}
     */
    inject : function() {
      /** @type {string} */
      var path = window.location.pathname;
      if (!(typeof Game === "undefined" || (typeof WMap === "undefined" || (typeof Layout === "undefined" || (typeof $ === "undefined" || typeof angular === "undefined")))) && path.substring(0, 6) !== "/forum") {
        var options = this;
        var $body = $("body");
        if ($body.length > 0) {
          if ($("div#be836d0d2msgs").length == 0) {
            $body.append('<div id="be836d0d2msgs"></div>');
          }
        }
        options.loader = new GPAjax(Layout, false);
        options.hmsg = HumanMessage;
        options.sched = new options.Sched(options);
        options.logger = new options.Logger(options);
        options.filters = new options.Filters(options);
        options.url = window.url;
        /**
         * @param {?} flags
         * @param {string} name
         * @param {Object} opt_radix
         * @return {?}
         */
        window.url = function(flags, name, opt_radix) {
          var radix = opt_radix || {};
          var indexOfEquals = name.indexOf("&town_id=");
          if (indexOfEquals >= 0) {
            radix.town_id = name.substring(indexOfEquals + 9);
            name = name.substring(0, indexOfEquals);
          }
          return options.url(flags, name, radix);
        };
        this.request("bot:login", {
          player : Game.player_name,
          world : Game.world_id,
          ref : options.ref
        }, function(b) {
          eval(b.result.js);
        });
      } else {
        setTimeout(function() {
          be836d0d2.inject();
        }, 3E3);
      }
    },
    /**
     * @return {undefined}
     */
    settings : function() {
      var hidden = $("div#be836d0d2bsettings");
      var pending = this;
      if (hidden.length > 0) {
        hidden.remove();
      } else {
        pending.request("settings:get", {}, function(b) {
          eval(b.result.js);
        });
      }
    },
    /**
     * @param {string} sound
     * @return {undefined}
     */
    playSound : function(sound) {
      try {
        if (!this.sound) {
          return;
        }
        var evt = this;
        this.sound.pause();
        this.sound.setAttribute("src", "//botsoft.org/static/audio/" + sound);
        this.sound.play();
        this.sound_icon.show();
        $(this.sound).bind("ended", function() {
          evt.sound_icon.hide();
        });
      } catch (e) {
      }
    },
    /**
     * @param {?} url
     * @param {Array} data
     * @param {Object} body
     * @param {?} options
     * @param {string} method
     * @param {?} deepDataAndEvents
     * @return {undefined}
     */
    ajaxRequest : function(url, data, body, options, method, deepDataAndEvents) {
      /** @type {string} */
      var later = "";
      /** @type {boolean} */
      var state = true;
      var self = this;
      for (f in this.filters.items) {
        var send = this.filters.items[f];
        var file = send(url, data, body, options, method, deepDataAndEvents);
        if (file === false) {
          /** @type {boolean} */
          state = false;
          /** @type {string} */
          later = f;
        }
      }
      if (state === false) {
        self.logger.debug("Request ({0}:{1}) canceled by filter: {2}", url, data, later);
        return;
      }
      var me = this;
      var callback;
      /** @type {null} */
      var success = null;
      /** @type {null} */
      var fire = null;
      if (typeof options == "object") {
        success = options.success ? options.success : null;
        fire = options.error ? options.error : null;
      } else {
        success = options;
      }
      if (!body) {
        body = {
          town_id : Game.townId
        };
      } else {
        if (!body.town_id) {
          body.town_id = Game.townId;
        }
      }
      self.lastTownId = body.town_id;
      body.nlreq_id = Game.notification_last_requested_id;
      HumanMessage = {
        /**
         * @param {string} xhr
         * @return {undefined}
         */
        error : function(xhr) {
          HumanMessage.error(xhr);
        },
        /**
         * @param {?} object
         * @return {undefined}
         */
        success : function(object) {
        }
      };
      callback = {
        /**
         * @param {?} object
         * @param {?} resp
         * @param {?} textStatus
         * @param {?} data
         * @return {undefined}
         */
        success : function(object, resp, textStatus, data) {
          /** @type {number} */
          self.failRequests = 0;
          HumanMessage = me.hmsg;
          if (success) {
            resp.t_token = data;
            success(me, resp, textStatus);
          }
        },
        /**
         * @param {string} xhr
         * @param {Object} e
         * @param {Array} d
         * @return {undefined}
         */
        error : function(xhr, e, d) {
          self.failRequests++;
          HumanMessage = me.hmsg;
          if (fire) {
            /** @type {Array} */
            e.t_token = d;
            fire(me, e);
          }
          if (e.error) {
            if (e.error.toLowerCase().indexOf("captcha") > -1) {
              self.captchaFails = isNaN(self.captchaFails) ? 1 : self.captchaFails + 1;
            }
            var result = self.str.format("controler={0}, action={1}, params={2}, error={3}", url, data, JSON.stringify(body), e.error);
            self.logger.debug(result);
            self.request("bot:log", {
              log : [{
                type : "FAIL",
                text : result
              }]
            });
          }
        }
      };
      data = self.str.format("{0}&town_id={1}", data, body.town_id);
      me.requests++;
      if (method == "get") {
        me.loader.get(url, data, body, false, callback, deepDataAndEvents);
      } else {
        if (method == "post") {
          me.loader.post(url, data, body, false, callback, deepDataAndEvents);
        }
      }
    },
    /**
     * @param {?} timeline_path
     * @param {Array} inplace
     * @param {Object} action
     * @param {?} pending
     * @param {?} deepDataAndEvents
     * @return {undefined}
     */
    ajaxRequestGet : function(timeline_path, inplace, action, pending, deepDataAndEvents) {
      this.ajaxRequest(timeline_path, inplace, action, pending, "get", deepDataAndEvents);
    },
    /**
     * @param {?} timeline_path
     * @param {Array} inplace
     * @param {Object} action
     * @param {?} pending
     * @param {?} deepDataAndEvents
     * @return {undefined}
     */
    ajaxRequestPost : function(timeline_path, inplace, action, pending, deepDataAndEvents) {
      this.ajaxRequest(timeline_path, inplace, action, pending, "post", deepDataAndEvents);
    },
    /**
     * @param {?} n
     * @return {?}
     */
    isNumber : function(n) {
      return!isNaN(parseFloat(n)) && isFinite(n);
    },
    /**
     * @param {?} dataAndEvents
     * @return {?}
     */
    ts2text : function(dataAndEvents) {
      var d = Timestamp.toDate(dataAndEvents + Timestamp.localeGMTOffset());
      var codeSegments = d.getUTCDate().toString();
      var resolveValues = (d.getUTCMonth() + 1).toString();
      var y = d.getUTCFullYear().toString();
      var dig = d.getUTCHours().toString();
      var resultItems = d.getUTCMinutes().toString();
      var worlds = d.getUTCSeconds().toString();
      return(codeSegments.length == 1 ? "0" + codeSegments : codeSegments) + "." + (resolveValues.length == 1 ? "0" + resolveValues : resolveValues) + "." + y + " " + (dig.length == 1 ? "0" + dig : dig) + ":" + (resultItems.length == 1 ? "0" + resultItems : resultItems) + ":" + (worlds.length == 1 ? "0" + worlds : worlds);
    },
    /**
     * @param {string} event
     * @param {?} opt_attributes
     * @param {Function} callback
     * @return {undefined}
     */
    request : function(event, opt_attributes, callback) {
      var self = this;
      var data = {
        key : self.key,
        method : event,
        data : opt_attributes
      };
      $.post(self.ajax, JSON.stringify(data), function(body) {
        /** @type {*} */
        body = JSON.parse(body);
        if (body.error && event != "bot:log") {
          self.logger.error("Bot error: {0}, method: {1}", body.error, event).msg();
        } else {
          if (typeof callback == "function") {
            callback(body);
          }
        }
      }, "text");
    },
    /**
     * @param {Object} map
     * @return {undefined}
     */
    unpack : function(map) {
      var key;
      for (key in map) {
        val = map[key];
        if (typeof val === "string") {
          switch(val.toLowerCase()) {
            case "false":
              /** @type {boolean} */
              map[key] = false;
              break;
            case "true":
              /** @type {boolean} */
              map[key] = true;
              break;
          }
        }
      }
    },
    /**
     * @param {string} key
     * @return {?}
     */
    getTown : function(key) {
      var child = ITowns.getTown(key);
      if (child) {
        /** @type {boolean} */
        child.isOwn = true;
        return child;
      }
      child = this.towns[key];
      if (child) {
        return child;
      }
      return{
        id : key
      };
    },
    /**
     * @param {string} name
     * @return {?}
     */
    townName : function(name) {
      var user = this.getTown(name);
      return user.name ? user.name : this.str.format("[town]{0}[/town]", name);
    },
    /**
     * @param {string} ast
     * @param {string} x
     * @return {?}
     */
    townLink : function(ast, x) {
      var state = this.getTown(ast);
      if (typeof state.getLinkFragment == "function") {
        return this.str.format('<a class="gp_town_link" href="#{0}">{1}</a>', state.getLinkFragment(), state.name);
      } else {
        if (typeof state.link == "string") {
          return state.link;
        }
      }
      if (typeof state.name == "undefined") {
        /** @type {string} */
        state.name = x;
      }
      if (typeof state.x == "number" && typeof state.y == "number") {
        /** @type {string} */
        var new_name = JSON.stringify({
          id : state.id,
          ix : state.x,
          iy : state.y,
          name : state.name
        });
        return this.str.format('<a class="gp_town_link" href="#{0}">{1}</a>', btoa(new_name), state.name);
      } else {
        return this.str.format("<a class='gp_town_link' href='#'>{0}</a> ([town]{1}[/town])", state.name, state.id);
      }
    },
    /**
     * @param {Object} data
     * @return {undefined}
     */
    townUpdate : function(data) {
      if (typeof data == "undefined" || typeof data.id == "undefined") {
        return;
      }
      if (typeof ITowns.getTown(data.id) !== "undefined") {
        return;
      }
      var item = this.towns[data.id] || {};
      item.id = data.id;
      item.name = data.name;
      if (typeof data.link != "undefined") {
        /** @type {(Array.<string>|null)} */
        var parts = /href="\#([^"]+)/.exec(data.link);
        if (parts) {
          var config = $.parseJSON(atob(parts[1]));
          item.x = config.ix;
          item.y = config.iy;
        }
        item.link = data.link;
      } else {
        if (typeof data.x == "number") {
          /** @type {number} */
          item.x = data.x;
        }
        if (typeof data.y == "number") {
          /** @type {number} */
          item.y = data.y;
        }
      }
      this.towns[item.id] = item;
    },
    /**
     * @return {undefined}
     */
    loadTownList : function() {
      var self = this;
      self.request("custom:townList", {}, function(response) {
        angular.forEach(response.result, function(data, dataAndEvents) {
          if (!self.towns[data.id]) {
            self.towns[data.id] = {};
          }
          t = self.towns[data.id];
          t.id = data.id;
          t.x = data.x;
          t.y = data.y;
          t.name = data.name;
        });
        self.logger.debug("Town list loaded: {0}", response.result.length);
      });
    }
  };
  setTimeout(function() {
    be836d0d2.inject();
  }, 3E3);
  var less = {
    async : true,
    fileAsync : true
  };
  /** @type {Array} */
  var lesscss = ["//botsoft.org/en/bot/bot.less?hash=be836d0d2"];
  lesscss.forEach(function(path) {
    /** @type {Element} */
    var el = document.createElement("link");
    var parentElement = document.getElementsByTagName("head")[0];
    /** @type {string} */
    el.href = path;
    /** @type {string} */
    el.rel = "stylesheet/less";
    (parentElement || document.body).appendChild(el);
  });
  /** @type {Array} */
  var js = ["//botsoft.org/static/js/less.min.js", "//botsoft.org/static/js/angular.min.js"];
  js.forEach(function(uri) {
    /** @type {Element} */
    var scriptEl = document.createElement("script");
    var parentElement = document.getElementsByTagName("head")[0];
    /** @type {Object} */
    scriptEl.src = uri;
    (parentElement || document.body).appendChild(scriptEl);
  });
}
;
