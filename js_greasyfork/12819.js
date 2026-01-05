// ==UserScript==
// @name         TVShow Time Watch Online
// @namespace    dannieboi
// @version      0.3
// @description  Show links to watch tv shows on To-Watch page
// @author       dannieboi
// @match        http://www.tvshowtime.com/en
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/12819/TVShow%20Time%20Watch%20Online.user.js
// @updateURL https://update.greasyfork.org/scripts/12819/TVShow%20Time%20Watch%20Online.meta.js
// ==/UserScript==

"format register";
(function(global) {

  var defined = {};

  // indexOf polyfill for IE8
  var indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++)
      if (this[i] === item)
        return i;
    return -1;
  }

  function dedupe(deps) {
    var newDeps = [];
    for (var i = 0, l = deps.length; i < l; i++)
      if (indexOf.call(newDeps, deps[i]) == -1)
        newDeps.push(deps[i])
    return newDeps;
  }

  function register(name, deps, declare, execute) {
    if (typeof name != 'string')
      throw "System.register provided no module name";

    var entry;

    // dynamic
    if (typeof declare == 'boolean') {
      entry = {
        declarative: false,
        deps: deps,
        execute: execute,
        executingRequire: declare
      };
    }
    else {
      // ES6 declarative
      entry = {
        declarative: true,
        deps: deps,
        declare: declare
      };
    }

    entry.name = name;

    // we never overwrite an existing define
    if (!defined[name])
      defined[name] = entry;

    entry.deps = dedupe(entry.deps);

    // we have to normalize dependencies
    // (assume dependencies are normalized for now)
    // entry.normalizedDeps = entry.deps.map(normalize);
    entry.normalizedDeps = entry.deps;
  }

  function buildGroups(entry, groups) {
    groups[entry.groupIndex] = groups[entry.groupIndex] || [];

    if (indexOf.call(groups[entry.groupIndex], entry) != -1)
      return;

    groups[entry.groupIndex].push(entry);

    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      var depEntry = defined[depName];

      // not in the registry means already linked / ES6
      if (!depEntry || depEntry.evaluated)
        continue;

      // now we know the entry is in our unlinked linkage group
      var depGroupIndex = entry.groupIndex + (depEntry.declarative != entry.declarative);

      // the group index of an entry is always the maximum
      if (depEntry.groupIndex === undefined || depEntry.groupIndex < depGroupIndex) {

        // if already in a group, remove from the old group
        if (depEntry.groupIndex !== undefined) {
          groups[depEntry.groupIndex].splice(indexOf.call(groups[depEntry.groupIndex], depEntry), 1);

          // if the old group is empty, then we have a mixed depndency cycle
          if (groups[depEntry.groupIndex].length == 0)
            throw new TypeError("Mixed dependency cycle detected");
        }

        depEntry.groupIndex = depGroupIndex;
      }

      buildGroups(depEntry, groups);
    }
  }

  function link(name) {
    var startEntry = defined[name];

    startEntry.groupIndex = 0;

    var groups = [];

    buildGroups(startEntry, groups);

    var curGroupDeclarative = !!startEntry.declarative == groups.length % 2;
    for (var i = groups.length - 1; i >= 0; i--) {
      var group = groups[i];
      for (var j = 0; j < group.length; j++) {
        var entry = group[j];

        // link each group
        if (curGroupDeclarative)
          linkDeclarativeModule(entry);
        else
          linkDynamicModule(entry);
      }
      curGroupDeclarative = !curGroupDeclarative;
    }
  }

  // module binding records
  var moduleRecords = {};
  function getOrCreateModuleRecord(name) {
    return moduleRecords[name] || (moduleRecords[name] = {
      name: name,
      dependencies: [],
      exports: {}, // start from an empty module and extend
      importers: []
    })
  }

  function linkDeclarativeModule(entry) {
    // only link if already not already started linking (stops at circular)
    if (entry.module)
      return;

    var module = entry.module = getOrCreateModuleRecord(entry.name);
    var exports = entry.module.exports;

    var declaration = entry.declare.call(global, function(name, value) {
      module.locked = true;
      exports[name] = value;

      for (var i = 0, l = module.importers.length; i < l; i++) {
        var importerModule = module.importers[i];
        if (!importerModule.locked) {
          var importerIndex = indexOf.call(importerModule.dependencies, module);
          importerModule.setters[importerIndex](exports);
        }
      }

      module.locked = false;
      return value;
    });

    module.setters = declaration.setters;
    module.execute = declaration.execute;

    if (!module.setters || !module.execute)
      throw new TypeError("Invalid System.register form for " + entry.name);

    // now link all the module dependencies
    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      var depEntry = defined[depName];
      var depModule = moduleRecords[depName];

      // work out how to set depExports based on scenarios...
      var depExports;

      if (depModule) {
        depExports = depModule.exports;
      }
      else if (depEntry && !depEntry.declarative) {
        depExports = { 'default': depEntry.module.exports, __useDefault: true };
      }
      // in the module registry
      else if (!depEntry) {
        depExports = load(depName);
      }
      // we have an entry -> link
      else {
        linkDeclarativeModule(depEntry);
        depModule = depEntry.module;
        depExports = depModule.exports;
      }

      // only declarative modules have dynamic bindings
      if (depModule && depModule.importers) {
        depModule.importers.push(module);
        module.dependencies.push(depModule);
      }
      else
        module.dependencies.push(null);

      // run the setter for this dependency
      if (module.setters[i])
        module.setters[i](depExports);
    }
  }

  // An analog to loader.get covering execution of all three layers (real declarative, simulated declarative, simulated dynamic)
  function getModule(name) {
    var exports;
    var entry = defined[name];

    if (!entry) {
      exports = load(name);
      if (!exports)
        throw new Error("Unable to load dependency " + name + ".");
    }

    else {
      if (entry.declarative)
        ensureEvaluated(name, []);

      else if (!entry.evaluated)
        linkDynamicModule(entry);

      exports = entry.module.exports;
    }

    if ((!entry || entry.declarative) && exports && exports.__useDefault)
      return exports['default'];

    return exports;
  }

  function linkDynamicModule(entry) {
    if (entry.module)
      return;

    var exports = {};

    var module = entry.module = { exports: exports, id: entry.name };

    // AMD requires execute the tree first
    if (!entry.executingRequire) {
      for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
        var depName = entry.normalizedDeps[i];
        var depEntry = defined[depName];
        if (depEntry)
          linkDynamicModule(depEntry);
      }
    }

    // now execute
    entry.evaluated = true;
    var output = entry.execute.call(global, function(name) {
      for (var i = 0, l = entry.deps.length; i < l; i++) {
        if (entry.deps[i] != name)
          continue;
        return getModule(entry.normalizedDeps[i]);
      }
      throw new TypeError('Module ' + name + ' not declared as a dependency.');
    }, exports, module);

    if (output)
      module.exports = output;
  }

  /*
   * Given a module, and the list of modules for this current branch,
   *  ensure that each of the dependencies of this module is evaluated
   *  (unless one is a circular dependency already in the list of seen
   *  modules, in which case we execute it)
   *
   * Then we evaluate the module itself depth-first left to right
   * execution to match ES6 modules
   */
  function ensureEvaluated(moduleName, seen) {
    var entry = defined[moduleName];

    // if already seen, that means it's an already-evaluated non circular dependency
    if (entry.evaluated || !entry.declarative)
      return;

    // this only applies to declarative modules which late-execute

    seen.push(moduleName);

    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      if (indexOf.call(seen, depName) == -1) {
        if (!defined[depName])
          load(depName);
        else
          ensureEvaluated(depName, seen);
      }
    }

    if (entry.evaluated)
      return;

    entry.evaluated = true;
    entry.module.execute.call(global);
  }

  // magical execution function
  var modules = {};
  function load(name) {
    if (modules[name])
      return modules[name];

    var entry = defined[name];

    // first we check if this module has already been defined in the registry
    if (!entry)
      throw "Module " + name + " not present.";

    // recursively ensure that the module and all its
    // dependencies are linked (with dependency group handling)
    link(name);

    // now handle dependency execution in correct order
    ensureEvaluated(name, []);

    // remove from the registry
    defined[name] = undefined;

    var module = entry.declarative ? entry.module.exports : { 'default': entry.module.exports, '__useDefault': true };

    // return the defined module object
    return modules[name] = module;
  };

  return function(main, declare) {

    var System;

    // if there's a system loader, define onto it
    if (typeof System != 'undefined' && System.register) {
      declare(System);
      System['import'](main);
    }
    // otherwise, self execute
    else {
      declare(System = {
        register: register,
        get: load,
        set: function(name, module) {
          modules[name] = module;
        },
        newModule: function(module) {
          return module;
        },
        global: global
      });
      System.set('@empty', System.newModule({}));
      load(main);
    }
  };

})(typeof window != 'undefined' ? window : global)
/* ('mainModule', function(System) {
  System.register(...);
}); */

('src/run.tvshowtime', function(System) {

System.register("src/core/TvShowInfo", [], function (_export) {
    var _createClass, _classCallCheck, TitleInfo, TvShowInfo;

    return {
        setters: [],
        execute: function () {
            "use strict";

            _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

            _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

            TitleInfo = (function () {
                function TitleInfo(title) {
                    _classCallCheck(this, TitleInfo);

                    this.title = title;
                }

                _createClass(TitleInfo, {
                    raw: {
                        get: function () {
                            return this.title;
                        }
                    },
                    clean: {
                        get: function () {
                            return this.title.replace(/[:,'()\.]/g, "").replace("&", "and");
                        }
                    },
                    dash: {
                        get: function () {
                            return this.clean.replace(/\s/g, "-").toLowerCase();
                        }
                    },
                    underscore: {
                        get: function () {
                            return this.clean.replace(/\s/g, "_").toLowerCase();
                        }
                    },
                    plus: {
                        get: function () {
                            return this.clean.replace(/\s/g, "+").toLowerCase();
                        }
                    },
                    space: {
                        get: function () {
                            return this.clean.replace(/\s/g, "%20").toLowerCase();
                        }
                    }
                });

                return TitleInfo;
            })();

            TvShowInfo = (function () {
                function TvShowInfo(title, season, episode, year) {
                    _classCallCheck(this, TvShowInfo);

                    this.title = title;
                    this.season = season;
                    this.episode = episode;
                    this.year = year;
                }

                _createClass(TvShowInfo, {
                    getTitleInfo: {
                        value: function getTitleInfo() {
                            return new TitleInfo(this.title);
                        }
                    },
                    getSeasonString: {
                        value: function getSeasonString(numDigits) {
                            if (numDigits) {
                                return this._pad(this.season, numDigits);
                            }
                            return this.season.toString();
                        }
                    },
                    getEpisodeString: {
                        value: function getEpisodeString(numDigits) {
                            if (numDigits) {
                                return this._pad(this.episode, numDigits);
                            }
                            return this.episode.toString();
                        }
                    },
                    _pad: {
                        value: function _pad(num, size) {
                            var s = num + "";
                            while (s.length < size) s = "0" + s;
                            return s;
                        }
                    }
                });

                return TvShowInfo;
            })();

            _export("default", TvShowInfo);
        }
    };
});
System.register("src/core/TvShowSiteInfo", [], function (_export) {
    var _classCallCheck, TvShowSiteInfo;

    return {
        setters: [],
        execute: function () {
            "use strict";

            _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

            TvShowSiteInfo = function TvShowSiteInfo(siteName, options) {
                _classCallCheck(this, TvShowSiteInfo);

                this.siteName = siteName;
                this.tvShowPageUrl = options.tvShowPageUrl;
                this.episodePageUrl = options.episodePageUrl;
                this.searchUrl = options.searchUrl;
                this.logoUrl = options.logoUrl;
            };

            _export("default", TvShowSiteInfo);
        }
    };
});
System.register("src/core/tvShowSitesArray", ["src/core/TvShowSiteInfo"], function (_export) {
    var TvShowSiteInfo;
    return {
        setters: [function (_srcCoreTvShowSiteInfo) {
            TvShowSiteInfo = _srcCoreTvShowSiteInfo["default"];
        }],
        execute: function () {
            "use strict";

            // tv show sites

            _export("default", [

            // PutLocker TV Shows
            new TvShowSiteInfo("PutLocker TV Shows", {
                logoUrl: "http://www.iconj.com/ico/3/s/3s61b5mccc.ico",
                tvShowPageUrl: "http://putlockertvshows.me/watch/{TITLE_DASH}/",
                episodePageUrl: "http://putlockertvshows.me/watch/{TITLE_DASH}/s{SEASON_2}e{EPISODE_2}.html"
            }),

            // watch series
            new TvShowSiteInfo("Watch Series", {
                logoUrl: "http://watchseriesfree.to/favicon.ico",
                tvShowPageUrl: "http://watchseriesfree.to/serie/{TITLE_UNDERSCORE}",
                episodePageUrl: "http://watchseriesfree.to/episode/{TITLE_UNDERSCORE}_s{SEASON}_e{EPISODE}.html",
                searchUrl: "http://watchseriesfree.to/search/{TITLE_RAW}"
            }),

            // project free tV
            new TvShowSiteInfo("Project Free TV", {
                logoUrl: "http://cdn4.projectfreetv.so/wp-content/uploads/2015/01/favicon.ico",
                tvShowPageUrl: "http://projectfreetv.ch/free/{TITLE_DASH}/",
                episodePageUrl: "http://projectfreetv.ch/{TITLE_DASH}-season-{SEASON}-episode-{EPISODE}/",
                searchUrl: "http://projectfreetv.ch/search/{TITLE_SPACE}"
            }),

            // netflix
            new TvShowSiteInfo("Netflix", {
                logoUrl: "http://www.netflix.com/favicon.ico",
                searchUrl: "http://www.netflix.com/search/{TITLE_SPACE}"
            }),

            // amazon
            new TvShowSiteInfo("Amazon", {
                logoUrl: "http://www.amazon.com/favicon.ico",
                searchUrl: "http://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Dinstant-video&field-keywords={TITLE_PLUS}&rh=n%3A2858778011%2Ck%3A{TITLE_PLUS}"
            }),

            // hulu
            new TvShowSiteInfo("Hulu", {
                logoUrl: "http://www.hulu.com/favicon.ico",
                searchUrl: "http://www.hulu.com/{TITLE_DASH}"
            })]);
        }
    };
});
System.register("src/renderers/IconRenderer", [], function (_export) {
    var _createClass, _classCallCheck, IconRenderer;

    return {
        setters: [],
        execute: function () {
            "use strict";

            _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

            _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

            //import $ from "jquery";

            IconRenderer = (function () {
                function IconRenderer() {
                    _classCallCheck(this, IconRenderer);
                }

                _createClass(IconRenderer, null, {
                    render: {
                        value: function render(tvShowlinks, tvLinksContainSelector) {

                            var $container = $(tvLinksContainSelector);

                            var iconsHtml = [];
                            for (var i = 0; i < tvShowlinks.length; i++) {
                                var linkData = tvShowlinks[i];
                                var pageUrl = linkData.episodePageUrl || linkData.tvShowPageUrl || linkData.searchUrl;
                                var iconHtml = "<a href='" + pageUrl + "' title='" + linkData.siteName + "' class='tv-link' target='_blank'>\n                    <img src='" + linkData.logoUrl + "'/>\n                </a>";
                                iconsHtml.push(iconHtml);
                            }
                            $container.append(iconsHtml.join(""));
                        }
                    },
                    addPageStyles: {
                        value: function addPageStyles() {
                            var css = "\n            a.tv-link {\n                padding-right: 2px;\n            }\n\n            a.tv-link img {\n                width: 16px;\n                height: 16px;\n                -webkit-filter: grayscale(1);\n                -webkit-filter: grayscale(100%);\n                filter: grayscale(100%);\n                filter: url(#greyscale);\n                filter: gray;\n            }\n\n            a.tv-link img:hover {\n                -webkit-filter: none;\n                filter: none;\n            }\n            ";

                            GM_addStyle(css);
                        }
                    }
                });

                return IconRenderer;
            })();

            _export("default", IconRenderer);
        }
    };
});
System.register("src/core/getTvShowLinksFromInfo", ["src/core/TvShowInfo", "src/core/TvShowSiteInfo", "src/core/tvShowSitesArray"], function (_export) {
    var TvShowInfo, TvShowSiteInfo, siteInfoArray;

    function setTitlePlaceholderData(str, tvShowInfo) {
        if (!str) {
            return null;
        }var titleInfo = tvShowInfo.getTitleInfo();

        str = str.replace("{TITLE_PLUS}", titleInfo.plus);
        str = str.replace("{TITLE_CLEAN}", titleInfo.clean);
        str = str.replace("{TITLE_DASH}", titleInfo.dash);
        str = str.replace("{TITLE_UNDERSCORE}", titleInfo.underscore);
        str = str.replace("{TITLE_RAW}", titleInfo.raw);
        str = str.replace("{TITLE_SPACE}", titleInfo.space);
        str = str.replace("{SEASON}", tvShowInfo.getSeasonString());
        str = str.replace("{SEASON_2}", tvShowInfo.getSeasonString(2));
        str = str.replace("{EPISODE}", tvShowInfo.getEpisodeString());
        str = str.replace("{EPISODE_2}", tvShowInfo.getEpisodeString(2));

        return str;
    }

    return {
        setters: [function (_srcCoreTvShowInfo) {
            TvShowInfo = _srcCoreTvShowInfo["default"];
        }, function (_srcCoreTvShowSiteInfo) {
            TvShowSiteInfo = _srcCoreTvShowSiteInfo["default"];
        }, function (_srcCoreTvShowSitesArray) {
            siteInfoArray = _srcCoreTvShowSitesArray["default"];
        }],
        execute: function () {
            "use strict";

            _export("default", function (tvShowInfo) {
                return siteInfoArray.map(function (value, index, array) {
                    return new TvShowSiteInfo(value.siteName, {
                        tvShowPageUrl: setTitlePlaceholderData(value.tvShowPageUrl, tvShowInfo),
                        episodePageUrl: setTitlePlaceholderData(value.episodePageUrl, tvShowInfo),
                        searchUrl: setTitlePlaceholderData(value.searchUrl, tvShowInfo),
                        logoUrl: value.logoUrl
                    });
                });
            });
        }
    };
});
System.register("src/parsers/TvShowTimeParser", ["src/core/getTvShowLinksFromInfo", "src/core/TvShowInfo"], function (_export) {
    var getTvShowLinks, TvShowInfo, _createClass, _classCallCheck, TvShowTimeParser;

    return {
        setters: [function (_srcCoreGetTvShowLinksFromInfo) {
            getTvShowLinks = _srcCoreGetTvShowLinksFromInfo["default"];
        }, function (_srcCoreTvShowInfo) {
            TvShowInfo = _srcCoreTvShowInfo["default"];
        }],
        execute: function () {
            "use strict";

            _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

            _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

            TvShowTimeParser = (function () {
                function TvShowTimeParser(renderer) {
                    _classCallCheck(this, TvShowTimeParser);

                    this.renderer = renderer;
                }

                _createClass(TvShowTimeParser, {
                    parse: {
                        value: function parse() {
                            this.renderer.addPageStyles();

                            this._parseElement($("ul.to-watch-list > li[id^='episode-item-']:not(.upcoming)"));

                            var self = this;
                            // select the target node
                            var target = document.querySelector("ul.to-watch-list");
                            // configuration of the observer:
                            var config = { childList: true };
                            // create an observer instance
                            var observer = new MutationObserver(function (mutations) {
                                mutations.forEach(function (mutation) {
                                    var numAddedNodes = mutation.addedNodes.length;
                                    if (numAddedNodes > 0) {
                                        for (var i = 0; i < numAddedNodes; i++) {
                                            var $node = $(mutation.addedNodes.item(i));
                                            console.dir($node);
                                            if ($node.is("li") && $node.hasClass("episode-item") && !$node.hasClass("upcoming")) {
                                                self._parseElement($node).bind(self, $node)();
                                            }
                                        }
                                    }
                                });
                            });
                            // pass in the target node, as well as the observer options
                            observer.observe(target, config);
                        }
                    },
                    _parseElement: {
                        value: function _parseElement($element) {
                            var _this = this;

                            $element.each(function (index, li) {
                                var title, season, episode, year;

                                var $li = $(li);

                                var episodeDetails = $li.find("div.episode-details > h2 > a").text();
                                var regExMatches = episodeDetails.match(/S(\d*)E(\d*)/i);

                                season = parseInt(regExMatches[1]);
                                episode = parseInt(regExMatches[2]);

                                var titleDetails = $li.find("div.episode-details > a").text();
                                var indexOfYear = titleDetails.lastIndexOf("(");

                                if (indexOfYear > 0) {
                                    title = titleDetails.substr(0, indexOfYear).trim();
                                    year = parseInt(titleDetails.substring(indexOfYear + 1, titleDetails.lastIndexOf(")")));
                                } else {
                                    title = titleDetails;
                                }

                                $li.find("div.nav").prepend("<div class='tv-links-container' style='float:left; width:157px; height:20px; text-align: left'></div>");

                                var tvShowInfo = new TvShowInfo(title, season, episode, year);
                                var tvShowLinks = getTvShowLinks(tvShowInfo);
                                var tvLinksContainSelector = "#" + $li.attr("id") + "> div.nav > div.tv-links-container";

                                _this.renderer.render(tvShowLinks, tvLinksContainSelector);
                            });
                        }
                    }
                });

                return TvShowTimeParser;
            })();

            _export("default", TvShowTimeParser);
        }
    };
});
//import $ from "jquery";
System.register("src/run.tvshowtime", ["src/parsers/TvShowTimeParser", "src/renderers/IconRenderer"], function (_export) {
  var Parser, renderer;
  return {
    setters: [function (_srcParsersTvShowTimeParser) {
      Parser = _srcParsersTvShowTimeParser["default"];
    }, function (_srcRenderersIconRenderer) {
      renderer = _srcRenderersIconRenderer["default"];
    }],
    execute: function () {
      "use strict";

      new Parser(renderer).parse();
    }
  };
});
});
//# sourceMappingURL=tvshowtime.js.map
