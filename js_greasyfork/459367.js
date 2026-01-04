// ==UserScript==
// @name            Ikariam Developer Tools V0.5.0+
// @namespace       AubergineAnodyne
// @description     Base scripting tools and data tracking utilities to simplify
//                  writing Ikariam Greasemonkey scripts.
// @author          AubergineAnodyne 
//                    (very loosely based on Ikariam Developer Tools by PhasmaExMachina)
//
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
//
// @version         0.30
//
// @history         0.30 Added turkish translations and Fixed blackmarket and sea chart archive buildins.
// @history         0.29 Fixed pillage of crystal not showing up.
// @history         0.28 Added COLONIZE constant.
// @history         0.27 Added helper methods for scripts to load/read Ikariam pages in the background.
// @history         0.27 Added support for spy data (IkaTools.EmpireData.EspionageData).
// @history         0.27 Added Romanian translation (by Peta).
// @history         0.26 Added Hungarian translation (by Toroco).
// @history         0.26 Updated for Ikariam changes in 5.3.2.
// @history         0.25 Fix bug in parsing training batches for military.
// @history         0.25 Fix bug in parsing returning colonization mission.  Also correct resource calculation for colonization mission.
// @history         0.25 Fix bug in parsing missions when pirate raid is in progress.
// @history         0.24 Added support for Pirate Fortress (v0.5.3 new building).
// @history         0.23 Added resetData function.
// @history         0.23 Fixed a bug that future research levels >= 9 would not be parsed.
// @history         0.22 Fixed a bug that stopped the script from running in some browser configurations.
// @history         0.22 Added some debugging features.
// @history         0.21 Added resizing of settings tab.
// @history         0.20 Added building icon data.
// @history         0.20 Added HTML setting type.
// @history         0.20 Added some movement type data.
// @history         0.20 Fixed a bug computing number of transports for transport missions.
// @history         0.19 Added Polish translation (from pitmm).
// @history         0.19 Fixed temple build resource requirements showing up incorrectly (marble instead of crystal).
// @history         0.19 Changed how transition to resource and mine views works.
// @history         0.18 Hopefully fixed population calculation crash when running the theology government.
// @history         0.18 Fix for transport form on test server.  (Probably coming to other servers with 0.5.1).
// @history         0.17 Added German localization (translation by Cherry).
// @history         0.17 Fixed date display bug with yesterday/today/tomorrow being incorrectly assigned due to timezone issue.
// @history         0.16 Reworked how initial ajax response is determined so it works in Chrome.
// @history         0.15 Removed CDATA section (hopefully will work in Chrome).
// @history         0.14 UI support for script settings.
// @history         0.14 Fixed corruption calculation for cities with no palace.
// @history         0.14 Corrected loading time for deploy on the same island.
// @history         0.13 Another tweak to work with TamperMonkey.
// @history         0.12 Another tweak to work with TamperMonkey.
// @history         0.11 Small tweak to work with TamperMonkey in Google Chrome.
// @history         0.10 Initial version.
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// ==/UserScript==

if (typeof IkaTools == 'undefined') {
    IkaTools = (function() {
      var ikaToolsVersion = 0;
      
      /**
       * Support functions for logging, profiling, and debugging.
       */
      var Logging = (function() {
        var exceptionLog = [];
        
        var options = {
          debug: false,
          timings: false,
          profile: false,
        };
        
        function getExceptionLog() {
          return exceptionLog;
        }
        
        /**
         * Analogous to console.log, but may have been disabled through options.
         */
        function debug() {
          if (options.debug && console && console.log) {
            // console.log is not a true javascript function.  In some browsers we can't call 
            // it with console.log.apply syntax.  Instead we just manually support up to 6
            // arguments.
            switch (arguments.length) {
              case 0:
                console.log();
                break;
              case 1:
                console.log(arguments[0]);
                break;
              case 2:
                console.log(arguments[0], arguments[1]);
                break;
              case 3:
                console.log(arguments[0], arguments[1], arguments[2]);
                break;
              case 4:
                console.log(arguments[0], arguments[1], arguments[2], arguments[3]);
                break;
              case 5:
                console.log(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                break;
              default:
                console.log(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], 
                            arguments[5]);
                break;
            }
          }
        }
        
        /**
         * Debug a caught exception.
         */
        function debugException(text, ex) {
          exceptionLog.push({text: text, stack: ex.stack, message: ex.message});
          if (console && console.error) {
            console.error('IkaTools.debugException (in %s)\n%s\n\n%s\n', text, ex, ex.stack);
          }
        }
        
        /**
         * Wrap a function to catch and log an exception.
         * If the time property is true in options (or absent) then time the function call.
         * (May set alwaysTime option to output time regardless of disabled logging settings.)
         * If the group property is true in options (or absent) then group the function call.
         */
        function debuggable(debugOptions, func) {
          if (typeof(debugOptions) == 'string') {
            debugOptions = { label: debugOptions };
          }
          debugOptions = $.extend({ time: true, 
                                    group: true,
                                    profile: false,
                                    swallowException: false,
                                   }, debugOptions);
          if (!debugOptions.label) {
            debugOptions.label = Utils.nextId('_debuggable');
          }
    
          return function debuggableWrapper() {
            var time = ((options.timings && debugOptions.time) || debugOptions.alwaysTime) && 
                        console && console.time;
            var group = debugOptions.group && (options.group) && console && console.group;
            var profile = debugOptions.profile && options.profile && console && console.profile;
            try {
              if (profile) {
                console.profile(debugOptions.label);
              }
              if (group) {
                console.group(debugOptions.label);
              }
              if (time) {
                console.time(debugOptions.label);
              }
              return func.apply(this, arguments);
            } catch (ex) {
              Logging.debugException(debugOptions.label, ex);
              if (!debugOptions.swallowException) {
                throw ex;
              }
            } finally {
              if (time) {
                console.timeEnd(debugOptions.label);
              }
              if (group) {
                console.groupEnd(debugOptions.label);
              }
              if (profile) {
                console.profileEnd(debugOptions.label);
              }
            }
          };
        }
    
        /**
         * Wrap a console.time/timeEnd pair around a function.  May be disabled 
         * through options.
         */
        function time(timeOptions, func) {      
          return function time() {
            var time = (options.timings || timeOptions.alwaysTime) && console && console.time;
            try {
              if (time) {
                console.time(timeOptions.label);
              }
              return func.apply(this, arguments);
            } finally {
              if (time) {
                console.timeEnd(timeOptions.label);
              }
            }
          }
        }
        
        /**
         * Wrap a console.group/groupEnd pair around a function.  May be disabled 
         * through options.
         */
        function group(groupOptions, func) { 
          var label;
    
          var collapsed = false;
    
          return function group() {
            var group = (options.timings || options.debug) && console && console.group;
            try {
              if (group) {
                if (groupOptions.collapsed && console.groupCollapsed) {
                  console.groupCollapsed(groupOptions.label);
                } else {
                  console.group(groupOptions.label);
                }
              }
              return func.apply(this, arguments);
            } finally {
              if (group) {
                console.groupEnd(groupOptions.label);
              }
            }
          }
        }
        
        /**
         * Sets logging options.  Properties are debug, timings, and profile.
         */
        function setOptions(newOptions) {
          $.extend(options, newOptions);
          if (console && console.log) {
            //console.log("Set logging options to: ", options);
          }
        }
        
        /**
         * Allows logging options to be configured by browsing to various anchors 
         * (and persisted for future page views).
         */
        function setAndSaveOptionsFromPageAnchor() {
          var savedOptions = new Data.Value(
              'debugOptions', 
              { debug: false, timings: false, profile: false , group: false},
              { useDomain: false, version: 0 });
          savedOptions.get();
              
          var anchor = window.location.hash;
    
          if (anchor.substring(0, 15) == '#ikaScriptTools') {
            if (anchor == '#ikaScriptToolsDebugAll') {
              savedOptions.get().debug = true;
              savedOptions.get().timings = true;
              savedOptions.get().profile = true;
            } else if (anchor == '#ikaScriptToolsDebugNone') {
              savedOptions.get().debug = false;
              savedOptions.get().timings = false;
              savedOptions.get().profile = false;
            } else if (anchor == '#ikaScriptToolsDebugOn') {
              savedOptions.get().debug = true;
            } else if (anchor == '#ikaScriptToolsDebugOff') {
    
              savedOptions.get().debug = false;
            } else if (anchor == '#ikaScriptToolsGroupOn') {
              savedOptions.get().group = true;
            } else if (anchor == '#ikaScriptToolsGroupOff') {
              savedOptions.get().group = false;
            } else if (anchor == '#ikaScriptToolsTimingsOn') {
              savedOptions.get().timings = true;
            } else if (anchor == '#ikaScriptToolsTimingsOff') {
              savedOptions.get().timings = false;
            } else if (anchor == '#ikaScriptToolsProfilesOn') {
              savedOptions.get().profile = true;
            } else if (anchor == '#ikaScriptToolsProfilesOff') {
              savedOptions.get().profile = false;
            }
            savedOptions.saveAsync();
          }
          setOptions(savedOptions.get());
        }
    
        return {
          debug: debug,
          debugException: debugException,
          debuggable: debuggable,
          time: time,
          group: group,
          setAndSaveOptionsFromPageAnchor: setAndSaveOptionsFromPageAnchor,
          getExceptionLog: getExceptionLog,
        };
      })();
      
      /**
       * Random utils that don't belong anywhere else.
       */
      var Utils = function() {
        function thunk(func) {
          var computed = false;
          var value;
          
          function thunker() {
            if (!computed) {
              value = func();
              computed = true;
            }
            return value;
          }
          
          return thunker;
        }
        
        function resettable(func) {
          var value = func();
          
          function getValue() {
            return value;
          }
          
          getValue.reset = function() {
            var ret = value;
            value = func();
            return ret;
          }
          
          getValue.set = function(v) {
            value = v;
          }
          
          return getValue;
        }        
        
        function fixedFunction(value) {
          return function() {
            return value;
          }
        }
    
        var nextId = function() {
          var id = 10000;
          function nextId(prefix) {
            id++;
            if (prefix) {
              return prefix + id.toString(16);
            } else {
              return id;
            }
          };
          return nextId;
        }();
        
        var nextIntegerId = function() {
          var id = 100000;
          return function nextIntegerId() {
            return id++;
          };
        }();
    
        function EventDispatcher(name) {
          this.name = name;
          this.listeners = [];
        }
        
        $.extend(EventDispatcher.prototype, {
          addListener: function addListener(l) {
            var listener = Logging.debuggable(
                {
                  label: 'EventDispatcher[' + this.name + '].ListenerWrapper',
                  swallowException: true,
                },
                function() {
                  l.apply(null, arguments)
                });
            this.listeners.push(listener);
            return {
              cancel: this._cancelListener.bind(this, listener),
            };
          },
          _cancelListener: function(listener) {
            for (var i = 0, len = this.listeners.length; i < len; i++) {
              if (this.listeners[i] === listener) {
                this.listeners.splice(i, 1);
                return;
              }
            }
          },
          /*bindEventArgs: function bindEventArgs() {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            return {
              bindEventArgs: function boundBindEventArgs() {
    
                return that.bindEventArgs.apply(that, 
                    args.concat(Array.prototype.slice.call(arguments)));
              },
              send: function boundSend() {
                that.send.apply(that, args.concat(Array.prototype.slice.call(arguments)));
              },
    
              scheduleSend: function boundScheduleSend(name, delay, callback) {
                return that.scheduleSend.apply(that, 
                    [name, delay, callback].concat(args).concat(Array.prototype.slice.call(arguments, 3)));
              },
              toJSON: function toJSON() {
                return undefined;
              },
            };
          },*/
          send: function send() {
            var listeners = this.listeners.slice();
            for (var i = 0, len = listeners.length; i < len; i++) {
              listeners[i].apply(null, arguments);
            }
          },
          scheduleSend: function(name, delay, callback) {
            var that = this;
            var sendArgs = [];
            for (var i = 3; i < arguments.length; i++)  {
              sendArgs.push(arguments[i]);
            }
            return clearTimeout.bind(null, setTimeout(
                  function scheduledSend() {
                    callback();
                    that.send.apply(that, sendArgs);
                  },
                  Math.max(delay, 10)));
            
          },
          /*startIntervalSend: function startIntervalSend(name, initialDelay, interval) {
            this.cancelIntervalSend();
            var sendCall = this.send.bind(this);
            var sendArgs = [];
            for (var i = 2; i < arguments.length; i++) {
              sendArgs.push(arguments[i]);
            }
            this.cancelInterval = clearInterval.bind(null, setInterval(
                IkaTools.Logging.debuggable(
                    'IkaTools.Utils.EventDispatcher.intervalSend[' + name + ']', 
                    function() {
                      sendCall.apply(null, sendArgs);
                    }),
                interval));
          },
          cancelIntervalSend: function cancelIntevalSend() {
            if (this.cancelInterval) {
              this.cancelInterval();
            }
          },*/
          toJSON: function toJSON() {
            return undefined;
          },
        });
        
        function getVersion() {
          var parts = $.map(
              $('#GF_toolbar li.version span').text().match(/[0-9]+/g), 
              function(x) {
                return parseInt(x);
              }).concat([0,0,0,0,0,0,0]);
          return {
            greaterThanOrEqual: function() {
              for (var i = 0; i < arguments.length; i++) {
                if (parts[i] != arguments[i]) {
                  return parts[i] >= arguments[i];
                }
              }
              return true;
            },
            lessThan: function() {
              for (var i = 0; i < arguments.length; i++) {
                if (parts[i] != arguments[i]) {
                  return parts[i] < arguments[i];
                }
              }
              return false;
            },
          };
        }
        
        function isChrome() {
          return navigator.vendor.match(/Google/) || navigator.userAgent.match(/Chrome/);
        }
        
        function iterateIkariamAjaxResponse(response, f) {
          $.each(response, function iterateIkariamAjaxResponseItem(index, item) {
            f(index, item[0], item[1]);
          });
        }
        
        function forEachIkariamAjaxResponseFunction(f) {
          return function forEachIkariamResponse(response) {
            iterateIkariamAjaxResponse(response, f);
          }
        }
    
        function backgroundFetchPage(url, callback, options) {
          options = $.extend({method: 'GET', data: ''}, options);
          
          var headers = {
            'User-agent': navigator.userAgent, 
            'Cookie': document.cookie,
            'Referer': 'http://' + document.domain + '/index.php',
          };
          if(options.method == 'POST') {
            headers['Content-type'] = 'application/x-www-form-urlencoded';
          }
          setTimeout(function() {
            GM_xmlhttpRequest ({
              method: options.method,
              url: url,
              data: options.data,
              headers: headers,
              onload: Logging.debuggable('IkaTools.Utils.backgroundGetIkariamPage[' + url + ']', callback)
              });
            }, 0);
        }
    
        function backgroundFetchIkariamAjaxPage(url, callback, options) {
          backgroundFetchPage(url, function(response) {
            callback(JSON.parse(response.responseText));
          }, options);
        }
    
        var jsonResponseRegex = /ikariam.getClass\(ajax.Responder, (.*?)\);$/m;
        function backgroundFetchIkariamFullPage(url, callback, options) {
          backgroundFetchPage(url, function(response) {
            var match = jsonResponseRegex.exec(response.responseText);
            jsonResponse = [];
            if (match) {
              jsonResponse = JSON.parse(match[1]);
            }
            callback(response, jsonResponse);
          }, options);
        }
    
        var urlParamsRegex = /\?([^\#]*)(#|$)/;
        function parseUrlParams(url) {
          var paramsList = url.match(urlParamsRegex)[1].split('&');
          var params = {};
          $.each(paramsList, function(index, item) {
            var paramParts = item.split('=');
            if (paramParts.length == 2) {
              params[paramParts[0]] = decodeURIComponent(paramParts[1]);
            }
          });
          return params;
        }
    
        var timestampRegex = /(\d+)\.(\d+)\.(\d+)\s+(\d+):(\d+):(\d+)/i;
        function parseIkariamTimestamp(timestamp){
          var d = new Date();
          //Get the local GMT offset in hours
          //Attempt to match the constituent parts of the timestamp
          var match = timestamp.match(timestampRegex);
          if (match){
            d.setTime(0);
            d.setDate(parseInt(match[1], 10));
            d.setMonth(parseInt(match[2], 10)-1);
            d.setFullYear(parseInt(match[3], 10));
            d.setHours(parseInt(match[4], 10));
            d.setMinutes(parseInt(match[5], 10));
            d.setSeconds(parseInt(match[6], 10));
            //Adjust the time to get its TZ correct
            d.setTime(d.getTime() - d.getTimezoneOffset() * Constants.Time.MILLIS_PER_MINUTE -
                Constants.Time.MILLIS_PER_HOUR);  // Server time is german = GMT+1
          }
          return d;
        }
    
        return {
          thunk: thunk,
          resettable: resettable,
          fixedFunction: fixedFunction,
          EventDispatcher: EventDispatcher,
          nextId: nextId,
          nextIntegerId: nextIntegerId,
          getVersion: thunk(getVersion),
          isChrome: thunk(isChrome),
          iterateIkariamAjaxResponse: iterateIkariamAjaxResponse,
          forEachIkariamAjaxResponseFunction: forEachIkariamAjaxResponseFunction,
    
          backgroundFetchIkariamAjaxPage: backgroundFetchIkariamAjaxPage,
          backgroundFetchIkariamFullPage: backgroundFetchIkariamFullPage,
    
          parseUrlParams: parseUrlParams,
          parseIkariamTimestamp: parseIkariamTimestamp,
        };
      }();
      
      /**
       *  Internationalization and localization routines.
       */
      var Intl = function() {
        function Localizer(allLanguages) {
          this.allLanguages = allLanguages;
          this.languages = ['en'];
        }
        $.extend(Localizer.prototype, {
          localize: function localize(identifier) {
            var identifierParts = identifier.split('.');
            if (arguments.length > 1) {
              identifierParts = $.makeArray(arguments);
            }
            for (var i = 0; i < this.languages.length; i++) {
              var languageConfig = this.allLanguages[this.languages[i]];
              if (languageConfig !== undefined) {
                var translation = this.find(languageConfig, identifierParts);
                if (translation !== undefined) {
                  return translation;
                }
              }
            }
            return '?#!' + identifierParts.join(',') + '!#?';
          },
          delayedLocalize: function delayedLocalize() {
            var args = arguments;
            var t = this;
            return function doLocalize() {
              return t.localize.apply(t, args);
            };
          },
          find: function find(config, parts) {
    
            for (var i = 0; i < parts.length; i++) {
              config = config[parts[i]];
              if (config === undefined) {
                return undefined;
              }
            }
            return config;
          },
          setPreferredLanguage: function setPreferredLanguage(language) {
            this.languages.unshift(language);
          },
        });
        
        var baseLocalizer = new Localizer({
          en: {
            formatting: {
              "thousandsSeparator": ",",
              "unknown": "?",
              hourFormatAMPM: true,
            },
            timeunits: {
              long: {
                day: 'Day',
                hour: 'Hour',
                week: 'Week',
              },
              short: {
                day: 'D',
                hour: 'h',
                minute: 'm',
                second: 's',
              },
              complete: '-',
              yesterday: 'yesterday',
              tomorrow: 'tomorrow',
              today: 'today',
              am: 'AM',
              pm: 'PM',
            },
            settings: {
              script_settings: 'Script Options',
              settings: 'Settings',
              save: 'Save',
            },
          },
          de: {
            formatting: {
              "thousandsSeparator": ".",
              "unknown": "?",
              hourFormatAMPM: false,
            },
            timeunits: {
              long: {
                day: 'Tag',
                hour: 'Stunde.',
                week: 'Woche',
              },
              short: {
                day: 'T',
                hour: 'h',
                minute: 'm',
                second: 's',
              },
              complete: '-',
              yesterday: 'gestern',
              tomorrow: 'morgen',
              today: 'heute',
              am: 'AM',
              pm: 'PM',
            },
            settings: {
              script_settings: 'Script Optionen',
              settings: 'Einstellungen',
              save: 'speichern',
            },
          },
          fr: {
            formatting: {
              "thousandsSeparator": ".",
              "unknown": "?",
              hourFormatAMPM: false,
            },
            timeunits: {
              long: {
                day: 'Jour',
                hour: 'Heure',
                week: 'Semaine',
              },
              short: {
                day: 'J',
                hour: 'h',
                minute: 'm',
                second: 's',
              },
              complete: '-',
              yesterday: 'hier',
              tomorrow: 'demain',
              today: 'aujourd\'hui',
              am: 'AM',
              pm: 'PM',
            },
            settings: {
              script_settings: 'Script Optionen',
              settings: 'Einstellungen',
              save: 'speichern',
            },
          },
          hu: {
            formatting: {
              "thousandsSeparator": ",",
              "unknown": "?",
              hourFormatAMPM: true,
            },
            timeunits: {
              long: {
                day: 'Nap',
                hour: 'Óra',
                week: 'Hét',
              },
              short: {
                day: 'n',
                hour: 'ó',
                minute: 'p',
                second: 'mp',
              },
              complete: '-',
              yesterday: 'tegnap',
              tomorrow: 'holnap',
              today: 'ma',
              am: 'Délelőtt',
              pm: 'Délután',
            },
            settings: {
              script_settings: 'Script Beállítások',
              settings: 'Beállítások',
              save: 'Mentés',
            },
          },
          pl: {
            formatting: {
              "thousandsSeparator": ",",
              "unknown": "?",
              hourFormatAMPM: true,
            },
            timeunits: {
              long: {
                day: 'Dzien',
                hour: 'Godzina',
                week: 'Tydzien',
              },
              short: {
                day: 'D',
                hour: 'h',
                minute: 'm',
                second: 's',
              },
              complete: '-',
              yesterday: 'wczoraj',
              tomorrow: 'jutro',
              today: 'dzis',
              am: 'AM',
              pm: 'PM',
            },
            settings: {
              script_settings: 'Opcje Skryptu',
              settings: 'Ustawienia',
              save: 'Zapisz',
            },
          },
          ro: {  
            formatting: {  
              "thousandsSeparator": ",",  
              "unknown": "?",  
              hourFormatAMPM: false,  
            },  
            timeunits: {  
              long: {  
                day: 'Zi',  
                hour: 'Ora',  
                week: 'Saptamana',  
              },  
              short: {  
                day: 'D',  
                hour: 'h',  
                minute: 'm',  
                second: 's',  
              },  
              complete: '-',  
              yesterday: 'ieri',  
              tomorrow: 'maine',  
              today: 'azi',  
              am: 'AM',  
              pm: 'PM',  
            },  
            settings: {  
              script_settings: 'Optiuni Script',  
              settings: 'Setari',  
              save: 'Salveaza',  
            },  
          },
          tr: {
            formatting: {
              "thousandsSeparator": ",",
              "unknown": "?",
              hourFormatAMPM: false,
            },
            timeunits: {
              long: {
                day: 'Gün',
                hour: 'Saat',
                week: 'Hafta',
              },
              short: {
                day: 'Gn',
                hour: 'Sa',
                minute: 'Dk',
                second: 'Sn',
              },
              complete: '-',
              yesterday: 'dün',
              tomorrow: 'yarın',
              today: 'bugün',
              am: 'AM',
              pm: 'PM',
            },
            settings: {
              script_settings: 'Script Seçenekleri',
              settings: 'Ayarlar',
              save: 'Kaydet',
            },
          },
        });
        
        function formatInteger(number, forceShowSign) {
          if (number === undefined || isNaN(number)) {
            return baseLocalizer.localize('formatting.unknown');
          }
    
          number = Math.floor(number);
    
          var separator = baseLocalizer.localize('formatting.thousandsSeparator');       
          var s = number.toString();
    
          var sign = forceShowSign ? '+' : '';
          if (number === 0) {
            sign = '';
          } else if (number < 0) {
            sign = '-';
            s = s.substring(1);
          }
    
          var i = s.length - 3;
          while (i > 0) {
            s = s.substring(0, i) + separator + s.substring(i);
            i -= 3;
          }
          return sign + s;
        };
        
        function formatDecimal(number, digits, forceShowSign) {
          if (number === undefined || isNaN(number)) {
            return baseLocalizer.localize('formatting.unknown');
          }
          var value = number.toFixed(digits);
          if (forceShowSign && number >= 0) { // .5 * Math.pow(10, -digits)) {
            value = '+' + value;
          }
          return value;
        }
        
        function formatRemainingTime(millis, complete, maxResolution) {
          maxResolution = maxResolution || 4;
          if (millis == Number.POSITIVE_INFINITY) {
            return '&infin;';
          }
          var seconds = Math.ceil(millis / Constants.Time.MILLIS_PER_SECOND);
          if (seconds <= 0) {
            return complete || baseLocalizer.localize('timeunits','complete');
          }
          
          var parts = [];
          if (maxResolution >= 1) {
            parts.push({value: Math.floor((seconds / 60 / 60 / 24)), label: 'day'});
          }
          if (maxResolution >= 2) {
            parts.push({value: Math.floor((seconds / 60/ 60) % 24), label: 'hour' });
          }
          if (maxResolution >= 3) {
            parts.push({value: Math.floor((seconds / 60) % 60), label: 'minute' });
          }
          if (maxResolution >= 4) {
            parts.push({value: Math.floor((seconds) % 60), label: 'second' });
          }
          
          while (parts[0] && !parts[0].value) {
            parts.shift();
          }
          parts.splice(2);
          return $.map(parts, function(part) {
            return '%s%s'.format(part.value, 
                                 baseLocalizer.localize('timeunits','short',part.label));
          }).join(' ');
        }
        
        function padLeft(s, length, char) {
          while (s.length < length) {
            s = char + s;
          }
          return s;
        }
        
        function formatAbsoluteTime(date) {
          var now = new Date();
          
          var dateDay = Math.floor(date.valueOf() / Constants.Time.MILLIS_PER_DAY - 
                                   date.getTimezoneOffset() / Constants.Time.MINUTES_PER_DAY);
          var nowDay = Math.floor(now.valueOf() / Constants.Time.MILLIS_PER_DAY -
                                  now.getTimezoneOffset() / Constants.Time.MINUTES_PER_DAY);
          
          var dayString = '';
          if (dateDay == nowDay + 1) {
            dayString = baseLocalizer.localize('timeunits','tomorrow');
          } else if (dateDay == nowDay - 1) {
            dayString = baseLocalizer.localize('timeunits','yesterday');
          } else if (dateDay == nowDay) {
            dayString = baseLocalizer.localize('timeunits','today');
          } else {
            dayString = date.toLocaleDateString();
          }
          
          var timeString = '';
          if (baseLocalizer.localize('formatting', 'hourFormatAMPM')) {
            var m = '';
            if (date.getHours() == 0) {
              timeString = '12';
              m = baseLocalizer.localize('timeunits','am');
            } else if (date.getHours() == 12) {
              timeString = '12';
              m = baseLocalizer.localize('timeunits','pm');
            } else if (date.getHours() > 12) {
              timeString = (date.getHours() - 12).toString();
              m = baseLocalizer.localize('timeunits','pm');
            } else {
              timeString = date.getHours().toString();
              m = baseLocalizer.localize('timeunits','am');
            }
            timeString = timeString + ':' + 
                         padLeft(date.getMinutes().toString(), 2, 0) + ' ' + m;
          } else {
            timeString = date.getHours().toString() + ':' + 
    
                         padLeft(date.getMinutes().toString(), 2, '0');
          }
          
          return dayString + ' ' + timeString;
        }
        
        return {
          Localizer: Localizer,
          localizer: baseLocalizer,
          formatInteger: formatInteger,
          formatDecimal: formatDecimal,
          formatRemainingTime: formatRemainingTime,
          formatAbsoluteTime: formatAbsoluteTime,
        };
      }();
      
      var View = function() {
        function getDomain() {
          return document.domain;
        }
        
        function getCurrentCityId() {
          var relatedCityData = unsafeWindow.ikariam.model.relatedCityData;
          return relatedCityData[relatedCityData.selectedCity].id;
        }
        function getCurrentCity() {
          return EmpireData.getCity(getCurrentCityId());
        }
        function isActiveCity(city) {
          return city.getId() == getCurrentCityId();
        }
        
        function getCurrentIslandId() {
          // This is available in javascript data in island and city views (unfortunately at 
          // different locations).  It does not appear to be anywhere in world view data.
          return parseInt($("#js_islandBread").attr("href").match(/islandId=(\d+)/)[1]); 
        };
        
        function getViewType() {
          return unsafeWindow.ikariam.backgroundView.id;
        }
        function viewIsIsland() {
          return getViewType() == 'island';
        }
        function viewIsCity() {
          return getViewType() == 'city';
        }
      
        function getIkariamBaseViewParams() {
          var mainboxX = unsafeWindow.ikariam.mainbox_x;
          var mainboxY = unsafeWindow.ikariam.mainbox_y;
          var mainboxZ = unsafeWindow.ikariam.mainbox_z;
          
          if (mainboxX || mainboxY || mainboxZ) {
            return {
              mainbox_x: mainboxX,
              mainbox_y: mainboxY,
              mainbox_z: mainboxZ,
            };
          }
          return {};
        }
        
        function makeFullIkariamUrl(params, anchor) {
          return 'http://' + getDomain() + '/index.php?' +
                 $.map(params, function(value, key) { 
                     return encodeURIComponent(key) + '=' + 
                            encodeURIComponent(value);
                 }).join('&') + 
                 (anchor ? '#' + anchor : '');
        }
        
        function makeLocalIkariamUrl(params) {
          return '?' + $.map(params, function(value, key) { return key + '=' + value; }).join('&');
        }
        
        function loadLocalIkariamUrl(url) {
          Logging.debug("loadLocalIkariamUrl: ", url);
          
          // This is an odd way to make the ajaxHandlerCall rather than just calling it directly.
          // It is done this way so that in Chrome the actions run when the response is recieved 
          // are run in the page's javascript context instead of the javascript context of the 
          // TamperMonkey extension.  This is necessary to properly evaluate script actions in 
          // returned ikariam pages or stuff like transport sliders simply will not work.
          document.location = 'javascript:ajaxHandlerCall(' + JSON.stringify(url) + '); void(0);';
        }
        
        function goToIkariamPage(city, mainView, mainParams, view, viewParams, anchor) {
          var changeParams = {
            // Whacked up logic I don't really understand that makes transitioning to 
            // island mine/mill pages work.  Yes, it's completely incomprehensible how Ikariam 
            // developers could screw this up, but somehow they can make the mill go to the mine 
            // if you say the old view is island when you want to go to an island page.  
            // Truly incredible!
            oldView: mainView == 'island' ? getViewType() : mainView,
            action: 'header',
            function: 'changeCurrentCity',
            cityId: city.getId(),
            actionRequest: unsafeWindow.ikariam.model.actionRequest,
          };
          
          $.extend(changeParams, getIkariamBaseViewParams(), mainParams);
          
          if (view) {
            $.extend(changeParams, viewParams);
            changeParams.templateView = view;
          }
          
          $.extend(changeParams, { backgroundView: mainView } );
          
          if (mainView == 'island' && view && !anchor) {
            // Stupid ikariam developers still include the city preselect when we ask for a 
            // specific view.  Which will overwrite whatever view (mine/mill/wonder) we 
            // actually want to see.  Set this hack to suppress that transition when the page 
            // loads.
            anchor = 'ikaScriptToolsSuppressCityPreselect';
          }
          
          if (getViewType() == mainView) {
            loadLocalIkariamUrl(makeLocalIkariamUrl(changeParams));
            return;
          }
          
          var url = makeFullIkariamUrl(changeParams, anchor);
          Logging.debug('goToIkariamPage: ', url);
          window.location.assign(url);
        }
        
        function goToLocalView(view, params) {
          loadLocalIkariamUrl(makeLocalIkariamUrl($.extend({view: view}, params)));
        }
        
        function goToCitysIslandView(city, view, params) {
          if (isActiveCity(city) && viewIsIsland() && 
              getCurrentIslandId() == city.getIslandId()) {
            if (view) {
              loadLocalIkariamUrl(makeLocalIkariamUrl($.extend({view: view}, params)));
            }
          } else if (viewIsIsland()) {
            goToIkariamPage(city, 'island', null, view, params);
          } else {
            goToIkariamPage(city, 'island', null, null, null, 
               makeIkariamLoadLocalPageAnchor($.extend({view: view}, params)));
          }
        }
        
        function goToIslandView(city, islandId, view, params) {
          if (isActiveCity(city) && viewIsIsland() &&
              getCurrentIslandId() == islandId) {
            if (view) {
              loadLocalIkariamUrl(makeLocalIkariamUrl($.extend({view: view}, params)));
            }
          } else {
            goToIkariamPage(city, 'island', { currentIslandId: islandId }, view, params);
          }
        }
    
        function goToIkariamFullPage(params, anchor) {
          url = makeFullIkariamUrl(params, anchor);
          Logging.debug('goToIkariamFullPage: ', url);
          window.location.replace(url);
        }
    
        function makeIkariamLoadLocalPageAnchor(params, doNotSuppressFirstCityInfo) {
          if (doNotSuppressFirstCityInfo) {
            return 'ikaScriptToolsLoadLocalIkariamUrl_DoNotSuppressFirstCityInfo=' + 
                encodeURIComponent(makeLocalIkariamUrl(params));
          } else {
            return 'ikaScriptToolsLoadLocalIkariamUrl=' + 
                encodeURIComponent(makeLocalIkariamUrl(params));
          }
        }
        
        function goToCityView(city, view, params) {      
          if (isActiveCity(city) && viewIsCity()) {
            if (view) {
              loadLocalIkariamUrl(makeLocalIkariamUrl($.extend({view: view}, params)));
            }
          } else {
            goToIkariamPage(city, 'city', null, view, params);
          }
        }
    
        function activateCity(city) {
          if (!isActiveCity(city)) {
            goToIkariamPage(city, getViewType());
          }
        }
        
        var suppressingChangeView = false;
        var superSuppressChangeView = Utils.resettable(Utils.fixedFunction(false));
        
        var initialPageAjaxResponse = Utils.thunk(function findInitialPageAjaxResponse() {
          var regex = /ikariam.getClass\(ajax.Responder, (.*)\);/;
          var response = [];
          $('script').each(function findInitialPageAjaxResponse(index, script) {
            var match = regex.exec(script.innerHTML);
            if (match) {
              response = JSON.parse(match[1]);
            }
          });
          return response;
        });
        
        unsafeWindow.ajax.Responder.changeView = function(changeView) {
          return Logging.debuggable(
              'IkaTools.View.changeViewReplacement', 
              function customChangeView(params) {          
                if (suppressingChangeView && suppressingChangeView == params[0]) {
                  Logging.debug("Suppressing change to view: ", params[0]);
                } else if (superSuppressChangeView() == params[0]) {
                  superSuppressChangeView.reset();
                  Logging.debug("Super suppressing change to view", params[0]);
                } else {
                  changeView.apply(this, arguments);
                }
              });
        }(unsafeWindow.ajax.Responder.changeView);
        
        var ajaxResponseEvent = new Utils.EventDispatcher();
        
        function registerIkariamAjaxResponseCallback(f, fireInitialPageView) {
          var canceller = ajaxResponseEvent.addListener(f);
          if (fireInitialPageView) {
            f(initialPageAjaxResponse());
          }
          return canceller;
        }
        
        var suppressNextAjaxChangeView = Utils.resettable(Utils.fixedFunction(null));
        
        function suppressChangeViewOfNextAjaxResponse(type) {
          suppressNextAjaxChangeView.set(type);
        }
        
        function suppressFirstChangeViewOfType(type) {
          superSuppressChangeView.set(type);
        }
        
        var nextAjaxResponseEvent = 
            Utils.resettable(function() { return new Utils.EventDispatcher(); });
            
        function registerNextIkariamAjaxRequestCallback(f) {
    
          return nextAjaxResponseEvent().addListener(f);
        }
        
        function replaceExecuteAjaxRequest(executeAjaxRequest) {      
          return function customExecuteAjaxRequest() {
            var ajaxEvent = nextAjaxResponseEvent.reset();
            var suppressChangeView = suppressNextAjaxChangeView.reset();
            
            var args = $.makeArray(arguments);
            args.push(undefined);
            
            if (!args[1]) {
              args[1] = function customAjaxCallback(responseText) {
                suppressingChangeView = suppressChangeView;
                var responder = unsafeWindow.ikariam.getClass(
                    unsafeWindow.ajax.Responder, responseText);
                unsafeWindow.ikariam.controller.ajaxResponder = responder;
                suppressingChangeView = null;
                
                ajaxResponseEvent.send(responder.responseArray);
                ajaxEvent.send(responder.responseArray);
              }
              args[1].isScriptInterceptor = true;
            } else if (args[1].isScriptInterceptor) {
              // Allows multiple instances of this script to work
              var func = args[1];
              args[1] = function customAjaxCallbackWrapper() {
                suppressingChangeView = suppressChangeView;
                func.apply(this, arguments);
                suppressingChangeView = null;
                
                var responseArray = unsafeWindow.ikariam.controller.ajaxResponder.responseArray;
                ajaxResponseEvent.send(responseArray);
                ajaxEvent.send(responseArray);
              }
            }
            var ret = executeAjaxRequest.apply(this, args);
          };
        }
        
        if (unsafeWindow.ikariam.controller) {
          unsafeWindow.ikariam.controller.executeAjaxRequest = 
              replaceExecuteAjaxRequest(unsafeWindow.ikariam.controller.executeAjaxRequest);
        } else {
          unsafeWindow.ikariam.Controller.executeAjaxRequest = 
              replaceExecuteAjaxRequest(unsafeWindow.ikariam.Controller.executeAjaxRequest);
        }
        
        var ajaxFormEvent = new Utils.EventDispatcher();
        
        unsafeWindow.ajaxHandlerCallFromForm = function(ajaxHandlerCallFromForm) {
          return function customerAjaxHandlerCallFromForm(form) {
            ajaxFormEvent.send(form);
            return ajaxHandlerCallFromForm.apply(this, arguments);
          };
        }(unsafeWindow.ajaxHandlerCallFromForm);
        
        function registerAjaxFormSubmitCallback(f) {
          return ajaxFormEvent.addListener(f);
        }
        
        var gameTimeDifference = 0;
        
        function setGameTimeDifference(value) {
          Logging.debug("Game time difference: ", value);
          gameTimeDifference = value;
        }
            
        function getGameTimeDifference() {
          return gameTimeDifference;
        }
        
        function gameTimeNow() {
          return new Date().getTime() - gameTimeDifference;
        }
    
        return {
          getDomain: getDomain,
          
          getCurrentCityId: getCurrentCityId,
          getCurrentCity: getCurrentCity,
          isActiveCity: isActiveCity,
          
          getCurrentIslandId: getCurrentIslandId,
          
          getViewType: getViewType,
          viewIsIsland: viewIsIsland,
          viewIsCity: viewIsCity,
    
          goToCitysIslandView: goToCitysIslandView,
          goToCityView: goToCityView,
          goToIslandView: goToIslandView,
          goToLocalView: goToLocalView,
          activateCity: activateCity,
          goToIkariamFullPage: goToIkariamFullPage,
          makeIkariamLoadLocalPageAnchor: makeIkariamLoadLocalPageAnchor,
          
          //registerViewChangedListener: registerViewChangedListener,
          suppressChangeViewOfNextAjaxResponse: suppressChangeViewOfNextAjaxResponse,
          suppressFirstChangeViewOfType: suppressFirstChangeViewOfType,
          registerNextIkariamAjaxRequestCallback: registerNextIkariamAjaxRequestCallback,
          registerIkariamAjaxResponseCallback: registerIkariamAjaxResponseCallback,
          registerAjaxFormSubmitCallback: registerAjaxFormSubmitCallback,
          
          loadLocalIkariamUrl: loadLocalIkariamUrl,
          
          setGameTimeDifference: setGameTimeDifference,
          getGameTimeDifference: getGameTimeDifference,
          gameTimeNow: gameTimeNow,
        };
      }();
    
      /**
       * Data value class for encapsulating GM_getValue/GM_setValue access and 
       * serialization/deserialization.
    
       */
      var Data = function() {
        function Value(key, defaultValue, options) {
          this.options = $.extend({ useDomain: true, loadCallback: function() {} }, options);
          if (this.options.useDomain) {
            this.key = View.getDomain() + "/" + key + "/" + 
                (options.version || ikaToolsVersion) + '-' + ikaToolsVersion;
          } else {
            this.key = key + "/" + ikaToolsVersion;
          }
          this.defaultValue = defaultValue;
          this.data = defaultValue;
          this.needsSave = false;
        }
        
        $.extend(Value.prototype, {
          load: function load() {
            var rawValue = GM_getValue(this.key, "null");
            if (rawValue !== undefined) {
              var data = JSON.parse(rawValue, this.options.reviver);
              Logging.debug('Loaded data "%s": %s -> %o', this.key, rawValue, data);
              if (data !== null) {
                this.data = data;
              }
            } else {
            }
            this.loaded = true;
            this.options.loadCallback(this.data);
            return this.data;
          },
          save: function save() {
            return this.doSave(true);
          },
          doSave: function doSave(force) {
            if (this.needsSave || force) {
              var value = JSON.stringify(this.data, this.options.stringifier);
              Logging.debug('Saved data "%s": %o -> %s', this.key, this.data, value);
              GM_setValue(this.key, value);
              this.needsSave = false;
            }
            return this.data;
          },
          saveAsync: function saveAsync() {
            this.needsSave = true;
            setTimeout(Logging.debuggable('IkaTools.Data.Value[' + this.key + ']', 
                                          this.doSave.bind(this, false)), 0);
          },
          get: function get() {
            if (!this.loaded) {
              var value = this.load();
              return value;
            }
            return this.data;
          },
          set: function set(data) {
            this.data = data;
            return data;
          },
          reset: function reset() {
            this.set(this.defaultValue);
            this.save();
          },
        });
        
        return {
          Value: Value,
        };
      }();
      
      var UI = function() {
        function ToolTipHandler(toolTipClass, toolTipContainer, options) {
          this.toolTips = {};
          this.options = $.extend({
            delay: 200,
            activeClass: 'active',
            offsetX: 0,
            offsetY: 20,
            toolTipClass: toolTipClass,
            toolTipContainer: toolTipContainer || $('<div/>'),
          }, options);
          this.toolTipContainer = 
              $('<div style="position: absolute; z-index: 100000; display:none;"/>');
          this.toolTipContainer.append(this.options.toolTipContainer);
                
          this.activeToolTipElement = null;
          this.pendingShowEvent = null;
          this.activeToolTip = null;
          
          var body = $('body');
          body.append(this.toolTipContainer);
        }
        
        $.extend(ToolTipHandler.prototype, {
          _getCurrentToolTip: function _getCurrentToolTip() {
            if (this.activeToolTipElement) {
              var id = this.activeToolTipElement.id;
              if (id) { 
                return this.toolTips[id];
              }
            }
          },
          _reset: function _reset() {
            clearTimeout(this.pendingShowEvent);
            this.toolTipContainer.hide();
            
            var toolTipInfo = this._getCurrentToolTip();
            if (this.activeToolTip && this.activeToolTip.deactivated) {
              this.activeToolTip.deactivated($(this.activeToolTipElement));
            }
            this.activeToolTip = null;
            
            this.options.toolTipContainer.empty();
            this.activeToolTipElement = null;
          },
          _showToolTip: function _showToolTip() {
            var toolTipInfo = this._getCurrentToolTip();
            if (toolTipInfo) {
              this.activeToolTip = toolTipInfo.contentCreator($(this.activeToolTipElement));
              this.options.toolTipContainer.append(this.activeToolTip);
              this.toolTipContainer.show();
            }
          },
          _mouseOver: function _mouseOver(e) {
            var toolTipElement = $(e.target).closest('.' + this.options.toolTipClass);
            if (toolTipElement.get(0) == this.activeToolTipElement) {
              return;
            }
            
            this._reset();
    
            if (toolTipElement.length > 0) {
              this.activeToolTipElement = toolTipElement[0];
              this.toolTipContainer.css({
                left: (e.pageX + this.options.offsetX) + 'px', 
                top: (e.pageY + this.options.offsetY) + 'px',
              });
    
              this.pendingShowEvent = setTimeout(IkaTools.Logging.debuggable(
                 'IkaTools.UI.ToolTipHandler.showToolTip[' + this.options.toolTipClass + ']',
                 this._showToolTip.bind(this)), this.options.delay);
            }
          },
          _mouseOut: function _mouseOut(e) {
            if (this.activeToolTipElement) {
              var target = $(e.relatedTarget).closest('.' + this.options.toolTipClass);
              if (target.get(0) != this.activeToolTipElement) {
                this._reset();
                return;
              }
            }
          },
          _mouseMove: function _mouseMove(e) {
            if (this.activeToolTipElement && !this.activeToolTip) {
              this.toolTipContainer.css({
                left: (e.pageX + this.options.offsetX)+ 'px', 
                top: (e.pageY + this.options.offsetY) + 'px',
              });
            }
          },
           
          register: function registerToolTip(id, contentCreator) {
            this.toolTips[id] = {
              contentCreator: contentCreator,
            };
          },
          
          registerSimple: function registerSimpleToolTip(id, content) {
            this.register(id, function() {
              return $(content);
            });
          },
          
          registerRefreshable: function registerRefreshableToolTip(id, contentGenerator) {
            var toolTip = this;
            
            this.register(id, function() {
              var id =  Utils.nextId();
              var interval = setInterval(Logging.debuggable('IkaTools.ToolTip.refresh[' + id + ']', 
                function refreshToolTip() {
                  toolTip.options.toolTipContainer.html(contentGenerator());
                }), Constants.Time.MILLIS_PER_SECOND);
                
              var tip = $(contentGenerator());
              tip.deactivated = function() {
                clearInterval(interval);
              };
              return tip;
            });
          },
          
          deregister: function deregister(id) {
            delete this.toolTips[id];
          },
          
          startHandling: function startHandling(element) {
            element.on('mouseover'/*, '.' + this.options.toolTipClass*/, Logging.debuggable(
                'IkaTools.UI.ToolTipHandler.mouseOver[' + this.options.toolTipClass + ']', 
                this._mouseOver.bind(this)));
            element.on('mouseout'/*, '.' + this.options.toolTipClass*/, Logging.debuggable(
                'IkaTools.UI.ToolTipHandler.mouseOut[' + this.options.toolTipClass + ']', 
                this._mouseOut.bind(this)))
            element.on('mousemove', '.' + this.options.toolTipClass, Logging.debuggable(
                'IkaTools.UI.ToolTipHandler.mouseMove[' + this.options.toolTipClass + ']', 
                this._mouseMove.bind(this)))
          }
        });
        
        function LeftMenu(items, options) {
          this.items = items;
          this.active = false;
          this.options = $.extend({atTop: false }, options);
        }
          
        $.extend(LeftMenu.prototype, {
          ITEM_CONTRACTED_WIDTH: 53,
          ITEM_EXPANDED_WIDTH: 199,
          ITEM_Z_INDEX_EXPANDED: 120000,
          ITEM_Z_INDEX_CONTRACTED: 65,
          ANIMATION_DURATION: 300,
          
          display: function display() {
            // Add leftMenu div and "standard" contents if we are in a 
            // view where it is not already present
            var leftMenuDiv = $('#leftMenu');
            if (!leftMenuDiv.length) {
              leftMenuDiv = $('<div id="leftMenu" >' + 
                                '<div class="slot_menu city_menu" style="z-index: 65; ">' + 
                                  '<ul class="menu_slots"/>' +
                                '</div>' + 
                              '</div>');
              $('#container').append(leftMenuDiv);
            }
            
            // Setup event handlers
            for (var i = 0; i < this.items.length; i++) {
              var item = this.items[i];
              item.element.width(this.ITEM_COLLAPSED_WIDTH + 'px');
              item.element.mouseenter(this.expand.bind(this, item));
              item.element.mouseleave(this.contract.bind(this, item));
            }
            
            this.holderDiv = $('.slot_menu', leftMenuDiv);
            this.holderDiv.hover(this.menuActivated.bind(this),
                                 this.menuPassivated.bind(this));
           
            // Add elements to ui
            var menuSlots = $('ul.menu_slots', leftMenuDiv);
            if (this.options.atTop) {
              for (var i = this.items.length - 1; i >= 0; i--) {
                menuSlots.prepend(this.items[i].element);
              }
            } else {
              for (var i = 0; i < this.items.length; i++) {
                menuSlots.append(this.items[i].element);
              }
            }
          },
          menuActivated: function menuActivated() {
            this.active = true;
            this.holderDiv.css('z-index', this.ITEM_Z_INDEX_EXPANDED);
          },
          menuPassivated: function menuPassivated() {
            this.active = false;
          },
          contract: function contract(item) {
            var holder = item.element.parent().parent();
            item.element.animate(
              { width: this.ITEM_CONTRACTED_WIDTH },
              300,
              'swing',
              this.contractComplete.bind(this)
            );
          },
          contractComplete: function contractComplete() {
            if (!this.active) {
              this.holderDiv.css('z-index', this.ITEM_Z_INDEX_CONTRACTED);
            }
          },
          expand: function expand(item) {
            item.element.animate(
              { width: this.ITEM_EXPANDED_WIDTH },
              300,
              'swing');
            this.holderDiv.css('z-index', this.ITEM_Z_INDEX_EXPANDED);
    
          },
        });
        
        LeftMenu.Item = function LeftMenu_Item(element) {
          this.element = element;
        }
        
        function resizePopup() {
          unsafeWindow.ikariam.controller.adjustSizes();
        }
        
        var destroyedTemplateViewEvent = Utils.thunk(function() {
          var dispatcher = new Utils.EventDispatcher();
          var oldDestroyTemplateView = unsafeWindow.ikariam.TemplateView.destroyTemplateView;
          unsafeWindow.ikariam.TemplateView.destroyTemplateView = 
              function customDestroyTemplateView() {
                oldDestroyTemplateView.apply(this, arguments);
                dispatcher.send();
              };
          return dispatcher;
        });
        
        function PopupWindow(id, header, content, options) {
          this.id = id;
          this.headerElement = $(header);
          this.contentElement = $(content);
          this.options = $.extend({
            sidebars: [], 
            oversized: false,
            activatedCallback: function() {},
            deactivatedCallback: function() {},
          }, options);
          this.isActive = false;
          
          destroyedTemplateViewEvent().addListener(this._popupDestroyed.bind(this));
        }
    
        $.extend(PopupWindow.prototype, {
          _popupDestroyed: function _popupDestroyed() {
            if (this.isActive) {
              this.options.deactivatedCallback(this);
            }
            this.isActive = false;
          },
          display: function display(skipResize) {
            // Always display it.  There's no good way to track if it is 
            // already displayed because there is no callback when it is destroyed.
            // (One can replace unsafeWindow.ikariam.destroyTemplateView, but there 
            // are still some issues with quickly switching between views that can 
            // mess things up and will still be considered "active" when its not visible.
            templateViewArg = {
              boxId: this.id,
              headerElem: this.headerElement.html(),
              contentElem: '<div><div id="ikaPopupTempHolder"></div></div>',
              sidebarEls: this.options.sidebars,
              oversized: this.options.oversized,
              replaceBox: true,
              keepSidebars: false
            };
            this.isActive = true;
            this.activePopup = unsafeWindow.ikariam.createTemplateView(templateViewArg);
            // Null out the id or submitting the change city form will send it as the 
            // templateView
            unsafeWindow.ikariam.templateView.id = null;
            unsafeWindow.ikariam.model.viewParams = null;
            $('#ikaPopupTempHolder').replaceWith(this.contentElement);
    
            this.options.activatedCallback(this);
            
            if (skipResize) {
              unsafeWindow.ikariam.controller.adjustSizes();
            }
          },
          close: function close() {
            if (this.isActive) {
              unsafeWindow.ikariam.TemplateView.destroyTemplateView();
            }
          }
        });
        
        function TabPane(tabs, options) {
          this.tabs = tabs;
          this.options = $.extend({ tabActivatedCallback: function() {} }, options);
            
          this.currentTab = null;
    
          this.container = $("<div/>");
    
          var tabsContainer = $('<ul class="tabmenu"/>');
          this.container.append(tabsContainer);
    
          for (var i = 0; i < tabs.length; i++) {
            var tab = tabs[i];
            tab.tabPane = this;
    
            tabsContainer.append(tab.tabHolder)
            this.container.append(tab.contentHolder);
            tab.contentHolder.hide();
            tab.tabHolder.click(
              IkaTools.Logging.debuggable('IkaTools.TabPane.Tab.click', 
                  this.activate.bind(this, tab)));
          }
        }
        
        $.extend(TabPane.prototype, {
          getContainer: function getContainer() {
            return this.container;
          },
          activate: function activate(tab) {
            if (this.currentTab !== tab) {
    
              if (this.currentTab) {
                this.currentTab.contentHolder.hide();
                this.currentTab.tabHolder.removeClass('selected');
                this.currentTab.deactivated();
              }
    
              tab.contentHolder.show();
              tab.tabHolder.addClass('selected');
            }
            tab.activated();
            this.options.tabActivatedCallback(this.currentTab, tab);
            this.currentTab = tab;
          }
        });
          
        TabPane.Tab = function Tab(tab, content, options) {
          this.tab = $(tab);
          this.content = $(content);
          this.options = $.extend({ activatedCallback: function() {}, 
                                    deactivatedCallback: function() {} },
                                  options);
    
          this.contentHolder = $('<div/>');
          this.contentHolder.append(this.content);
    
          this.tabHolder = $('<li class="tab"/>');
          this.tabHolder.append(this.tab);
        }
        
        $.extend(TabPane.Tab.prototype, {
          activate: function activate() {
            this.tabPane.activate(this);
          },
          activated: function activated() {
            this.options.activatedCallback(this);
          },
          deactivated: function deactivated() {
            this.options.deactivatedCallback(this);
          },
        });
        
        function SettingsWindow(id, scriptName, settings, settingGroups) {
          this.id = id;
          this.settings = settings;
          this.scriptName = scriptName;
          this.settingGroups = settingGroups;
          this.saveEvent = new Utils.EventDispatcher();
        }
    
        $.extend(SettingsWindow.prototype, {
          show: function show() {
            var tabs = $.map(this.settingGroups, function makeTab(group, index) {
              var content = $.map(group.getSettings(), this.renderSetting.bind(this)).join('');
              content = '<div class="contentBox01h">' +
                          '<h3 class="header">' + 
                            Intl.localizer.localize('settings','settings') + 
                          '</h3>' +
                          '<div class="content">' + 
                            '<table class="table01"><tbody>' + content + '</tbody></table>' + 
                          '</div>' +
                          '<div class="footer"/>' +
                        '</div>' +
                        '<div class="centerButton">' + 
                          '<a class="ikaScriptToolsSaveOptions button">' + 
                            Intl.localizer.localize('settings','save') +
                          '</a>' + 
                        '</div>';
              return new TabPane.Tab('<b>' + group.getName() + '</b>', content, {});
            }.bind(this));
            var tabPane = new TabPane(tabs,  {
              tabActivatedCallback: function() {
                IkaTools.UI.resizePopup();
              },
            });
            var popup = new PopupWindow(
                'options',
                $('<div>' + Intl.localizer.localize('settings','script_settings') + ': ' + 
                    this.scriptName + '</div>'),
                tabPane.getContainer());
            tabs[0].activate();
            popup.display();
            $.each(this.settingGroups, function postRenderSettingsGroup(index, group) {
              $.each(group.getSettings(), this.postRenderSetting.bind(this));
            }.bind(this));
            $('.ikaScriptToolsSaveOptions').click(Logging.debuggable(
                'IkaTools.UI.SettingsWindow.saveSettings',
                this._save.bind(this)));
          },
          renderSetting: function renderSetting(setting, index) {
            var type = setting.getType();
            var html = '<tr><td>' + setting.getLabel()() + '</td><td class="left">';
            if (type == Settings.Type.BOOLEAN) {
              html += '<input id="ikaScriptToolsSettingInput_' + setting.getName() + 
                  '" type="checkbox" ' + (setting.isEnabled() ? 'checked' : '' ) + '/>';
            } else if (type == Settings.Type.CHOICE) {
              html += '<select id="ikaScriptToolsSettingInput_' + setting.getName() + '">';
              $.each(setting.getChoices(), function renderOption(key, value) {
                html += '<option value="' + value + '"' + 
                        (setting.getValue() == value ? 'selected="selected"' : '') + '>' + key + '</option>';
              })
              html += '</select>';
            } else if (type == Settings.Type.HTML) {
              html += setting.getHtml()();
            } else if (type == Settings.Type.TEXT) {
              html += '<input id="ikaScriptToolsSettingInput_' + setting.getName() 
                  + '" value="' + setting.getValue() + '"/>';
            }
            html += '</td>';
            return html;
          },
          postRenderSetting: function postRenderSetting(index, setting) {
            var type = setting.getType();
            if (type == Settings.Type.HTML) {
    
              setting.getPostRender()();
            }
          },
          _save: function save() {
            $.each(this.settingGroups, function saveGroup(index, group) {
              $.each(group.getSettings(), this._saveSetting.bind(this));
            }.bind(this));
            this.settings.save();
            this.saveEvent.send(this);
          },
          _saveSetting: function saveSetting(index, setting) {
            var type = setting.getType();
            if (type == Settings.Type.BOOLEAN) {
              setting.setEnabled(
                  $('#ikaScriptToolsSettingInput_' + setting.getName()).is(':checked'));
            } else if (type == Settings.Type.CHOICE) {
              setting.setValue(
                  $('#ikaScriptToolsSettingInput_' + setting.getName()).val());
            } else if (type == Settings.Type.TEXT) {
              setting.setValue(
                  $('#ikaScriptToolsSettingInput_' + setting.getName()).val());
            }
          },
          registerSavedSettingsHandler: function registerSavedSettingsHandler(f) {
            return this.saveEvent.addListener(f);
          },
          addAsScriptOptionsLink: function addAsScriptOptionsLink() {
            if($('#IkaScriptToolSettingsDropdown').size() == 0) {
              GM_addStyle(
                '#IkaScriptToolSettingsDropdown { ' +
                '  position:absolute; ' +
                '}' +
                '#IkaScriptToolSettingsDropdown:hover {' +
                '  padding-bottom:20px;' +
                '}' +
                '#IkaScriptToolSettingsDropdown #IkaScriptToolsSettingsDropdownLinks { ' +
                '  display:none;' +
                '}' +
                '#IkaScriptToolSettingsDropdown:hover #IkaScriptToolsSettingsDropdownLinks {' +
                '  display:block;' +
                '}' +
                '#IkaScriptToolsSettingsDropdownLinks { ' +
                '  background-color:#FFF5E1; ' +
                '  padding:.5em; ' +
                '  padding-bottom:0; ' +
                '  border:1px solid #666; ' +
                '  position:absolute; ' +
                '  right:-80px; ' +
                '  margin-top:2px; ' +
                '  width:170px;' +
                '}' +
                '#IkaScriptToolsSettingsDropdownLinks a { ' +
                '  color:#666; ' +
                '  cursor:pointer; ' +
                '  margin-left:0; ' +
                '  padding-left:.2em; ' +
                '  display:block; ' +
                '  margin-bottom:.5em;' +
                '}'
              );
              
              var li = document.createElement('li');
              li.id = 'IkaOptionsDropdown';
              $('#GF_toolbar ul').append($(
                  '<li id="IkaScriptToolSettingsDropdown">' + 
                    '<a href="javascript:void(0);">' + 
                        Intl.localizer.localize('settings','script_settings') + '</a>' + 
                    '<div id="IkaScriptToolsSettingsDropdownLinks">' +
                  '</li>'));
            }
            var link = $('<a>' + this.scriptName + '</a>');
            link.click(Logging.debuggable('IkaTools.UI.SettingsWindow.showSettings', 
                this.show.bind(this)));
            $('#IkaScriptToolsSettingsDropdownLinks').append(link);
          },
        });
        
        SettingsWindow.Group = function(name, settings) {
          this.name = name;
          this.settings = settings;
        }
        
        $.extend(SettingsWindow.Group.prototype, {
          getName: function getName() {
            return this.name;
          },
          getSettings: function getSettings() {
            return this.settings;
          },
        });
        
        return {
          ToolTipHandler: ToolTipHandler,
          LeftMenu: LeftMenu,
          resizePopup: resizePopup,
          PopupWindow: PopupWindow,
          TabPane: TabPane,
          SettingsWindow: SettingsWindow,
        };
      }();
      
      var Settings = function() {
        var Type = {
          BOOLEAN: 1,
          CHOICE: 2,
          HTML: 3,
          TEXT: 4,
        }
        
        function Settings(name) {
          this.name = name;
          this.data = new Data.Value('scriptOptions_' + name, { }, { version: 1 });
        }
        
        $.extend(Settings.prototype, {
          _getValue: function getValue(name, defaultValue) {
            var value = this.data.get()[name];
            return value === undefined ? defaultValue : value;
          },
          _setValue: function setValue(name, value) {
            this.data.get()[name] = value;
          },
          save: function save() {
            this.data.save();
          },
          
          boolean: function boolean(name, enabled, labelFunc) {
            return new Boolean(this, name, this._getValue(name, enabled), labelFunc);
          },
          
          choice: function choice(name, value, choices, labelFunc) {
            return new Choice(this, name, this._getValue(name, value), choices, labelFunc);
          },
          
          html: function html(htmlFunc, postRender, labelFunc) {
            return new Html(htmlFunc, postRender, labelFunc);
          }, 
    
          text: function text(name, value, labelFunc) {
            return new Text(this, name, this._getValue(name, value), labelFunc);
          }
        });
        
        function Boolean(settings, name, enabled, labelFunc) {
          this.settings = settings;
          this.name = name;
          this.enabled = enabled;
          this.labelFunc= labelFunc;
        }
        
        $.extend(Boolean.prototype, {
          isEnabled: function isEnabled() {
            return this.enabled;
          },
          setEnabled: function(enabled) {
            this.enabled = enabled;
            this.settings._setValue(this.name, enabled);
          },
          getName: function getName() {
            return this.name;
          },
          getType: function getType() {
            return Type.BOOLEAN;
          },
          getLabel: function getLabel() {
            return this.labelFunc;
          },
        });
        
        function Choice(settings, name, value, choices, labelFunc) {
          this.settings = settings;
          this.name = name;
          this.value = value;
          this.choices = choices;
          this.labelFunc = labelFunc;
        }
        
        $.extend(Choice.prototype, {
          getValue: function getValue() {
            return this.value;
          },
          setValue: function setValue(value) {
            this.value = value;
            this.settings._setValue(this.name, value);
          },
          getChoices: function getChoices() {
            return this.choices;
          },
          getName: function getName() {
            return this.name;
          },
          getType: function getType() {
            return Type.CHOICE;
          },
          getLabel: function getLabel() {
            return this.labelFunc;
          },
        });
        
        function Html(htmlFunc, postRender, labelFunc) {
          this.labelFunc = labelFunc;
          this.htmlFunc = htmlFunc;
          this.postRender = postRender;
        }
        
        $.extend(Html.prototype, {
          getHtml: function getHtml() { 
            return this.htmlFunc;
          },
          getPostRender: function getPostRender() {
            return this.postRender;
          },
          getType: function getType() {
            return Type.HTML;
          },
          getLabel: function getLabel() {
            return this.labelFunc;
          },
        });
    
        function Text(settings, name, value, labelFunc) {
          this.settings = settings;
          this.name = name;
          this.value = value;
          this.labelFunc = labelFunc;
        }
    
        $.extend(Text.prototype, {
          getValue: function getValue() {
            return this.value;
          },
          setValue: function setValue(value) {
            this.value = value;
            this.settings._setValue(this.name, value);
          },
          getName: function getName() {
            return this.name;
          },
          getType: function getType() {
            return Type.TEXT;
          },
          getLabel: function getLabel() {
            return this.labelFunc;
          },
        });
        
        return {
          Settings: Settings,
          Type: Type,
        };
      }();
      
      var Constants = {
        Resources: {
          WOOD: 'wood',
          WINE: 'wine',
          MARBLE: 'marble',
          GLASS: 'glass',
          SULFUR: 'sulfur',
          
          POPULATION: 'population',
          CITIZENS: 'citizens',
    
          SCIENTISTS: 'scientists',
          ACTION_POINTS: 'actionPoints',
          CULTURAL_GOODS: 'culturalGoods',
          TAVERN_WINE_LEVEL: 'tavernWineLevel',
          PRIESTS: 'priests',
        },
        
        CivilizationData: {
          GOVERNMENT: 'government',
          RESEARCH: 'research',
          MOVEMENT: 'movement',
          PREMIUM_FEATURE: 'premiumFeature',
        },
        
        PremiumFeatures: {
          DOUBLED_STORAGE_CAPACITY: 'doubledStorageCapacity',
          DOUBLED_SAFE_CAPACITY: 'doubledSafeCapacity',
        },
        
        Movements: {
          Mission: {
            TRANSPORT: 'transport',
            DEPLOY_ARMY: 'deployarmy',
            DEPLOY_NAVY: 'deployfleet',
            PLUNDER: 'plunder',
          },
    
          Stage: {
            LOADING: 'loading',
            EN_ROUTE: 'en_route',
            RETURNING: 'returning',
          },
    
          EventType: {
            DATA_UPDATED: 'dataUpdated',
            STAGE_CHANGED: 'stageChanged',
            CANCELLED: 'cancelled',
            COMPLETED: 'completed',
          },
          
          MissionData: {
            transport: {
              icon: '/cdn/all/both/actions/transport.jpg',
            },
            deployarmy: {
              icon: '/cdn/all/both/actions/occupy.jpg',
            },
            deployfleet: {
              icon: '/cdn/all/both/actions/blockade.jpg',
            },
            plunder: {
              icon: '/cdn/all/both/actions/plunder.jpg',
            },
            piracyRaid: {
              icon: '/cdn/all/both/actions/piracyRaid.jpg',
            },
          }
        },
        
        BuildingEventType: {
          DATA_REFRESH: 'dataRefresh',
          UPGRADE_COMPLETE: 'upgradeComplete',
        },
        
        Buildings: {
          TOWN_HALL: 'townHall',
          PALACE: 'palace',
          GOVERNORS_RESIDENCE: 'palaceColony',
          TAVERN: 'tavern',
          MUSEUM: 'museum',
          ACADEMY: 'academy',
          WORKSHOP: 'workshop',
          TEMPLE: 'temple',
          EMBASSY: 'embassy',
          WAREHOUSE: 'warehouse',
          DUMP: 'dump',
          TRADING_PORT: 'port',
          TRADING_POST: 'branchOffice',
          BLACK_MARKET: 'blackMarket',
          MARINE_CHART_ARCHIVE: 'marineChartArchive',
          WALL: 'wall',
          HIDEOUT: 'safehouse',
          BARRACKS: 'barracks',
          SHIPYARD: 'shipyard',
          PIRATE_FORTRESS: 'pirateFortress',
          FORESTER: 'forester',
          CARPENTER: 'carpentering',
          WINERY: 'winegrower',
          WINE_PRESS: 'vineyard',
          STONEMASON: 'stonemason',
          ARCHITECT: 'architect',
          GLASSBLOWER: 'glassblowing',
          OPTICIAN: 'optician',
          ALCHEMISTS_TOWER: 'alchemist',
          FIREWORK_TEST_AREA: 'fireworker',
        },
        
        // Time data from http://ikariam.wikia.com/wiki/User_blog:Warrior_fr/Actual_building_Time_formula
        // Rest of data from http://ikariam.wikia.com/ building pages.
        BuildingData: {
          academy: {
            maxlevel:50,
            wood:[55,58,98,226,328,538,844,1143,1723,2291,3367,4434,6403,8387,10965,1562,20374,28767,37471,48786,63496,88974,124014,150549,209779,272798,378372,461226,639658,883624,1081231,1493547,2063095,2849833,3936586,5437761,7511392,10375779,14332469,19797999,27347750,37776516,52182177,72081279,99568686,137538116,189986771,262436146,362513298,500753777],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            glass:[0,0,0,0,193,368,639,936,1503,211,3255,4485,6761,9226,12555,18599,25216,36997,50063,67702,91516,133177,192765,243011,351634,474841,683916,865717,1246777,1788499,2272591,3259901,4676140,6707654,9621744,13801839,19797943,28399010,40736746,58434518,83820952,120236331,172472097,247401296,354882919,509059121,730216007,1047452831,1502510795,2155265251],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],            
            time  :{a:1440, b:1, c:1.2, d:720},
            icon  :'/cdn/all/both/img/city/academy_l.png',
            maxScientists: [0, 8, 12, 16, 22, 28, 35, 43, 51, 60, 69, 79, 89, 100, 111, 122, 134, 146, 159, 172, 185, 198, 212, 227, 241, 256, 271, 287, 302, 318, 335, 351, 368 ],
          },
          alchemist: {
            maxlevel:61,
            wood:[235,401,617,898,1263,1738,2354,3157,4199,5554,7316,9607,12585,16456,21488,28030,36535,47591,61963,80649,104938,136516,177565,230931,300306,390494,507737,660154,858296,1115880,1450740,1886057,2451998,3187758,4144296,5387857,7004569,9106400,11838919,15391374,20009798,26014054,33819980,43968198,57161548,74313771,96612788,125602976,163292127,212290500,275991607,358807234,466472992,606445556,788419092,1024996652,1332563034,1732419548,2252259306,2928085165,3806703211],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[0,99,219,374,577,840,1182,1627,2205,2955,3931,5202,6852,8997,11786,15412,20125,26253,34219,44574,58037,75538,98289,127865,166315,216300,281279,365753,475568,618329,803918,1045183,1358855,1766663,2296859,2986173,3882359,5047500,6562314,8531740,11092214,14421117,18749061,24375871,31691353,41202296,53567581,69643833,90544754,117718283,153046903,198978051,258693667,336330631,437267348,568496341,739108674,960923743,1249308082,1624239900,2111693096],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            time  :{a:72000, b:11, c:1.1, d:6120},
            icon  :'/cdn/all/both/img/city/alchemist_l.png',
          },
          architect: {
            maxlevel:50,
            wood:[159,250,355,477,619,783,974,1195,1452,1750,2095,2495,2960,3500,4125,4850,5692,6668,7800,9114,10637,12404,14454,16832,19591,22791,26503,30809,35804,41599,48319,56116,65170,75686,87899,102082,118554,137684,159900,185702,215666,250465,290880,337815,392325,455629,529148,614530,713689,828848],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[91,137,190,253,325,408,504,615,743,890,1060,1255,1480,1739,2037,2379,2774,3227,3748,4348,5037,5829,6738,7784,8986,10367,11953,13774,15867,18271,21031,24201,27848,32046,36876,42434,48830,56190,64659,74406,85621,98526,113377,130466,150131,172760,198799,228763,263244,302922],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],            
            time  :{a:125660, b:37, c:1.06, d:2628},
            icon  :'/cdn/all/both/img/city/architect_l.png',
          },
          barracks: {
            maxlevel:49,
            wood:[42,98,167,254,361,493,658,862,1115,1429,1818,2301,2899,3641,4561,5701,7116,887,11044,13741,17086,21233,26375,32751,40658,50461,62618,77693,96385,119564,148305,183944,228137,282936,350886,435146,539626,669183,829833,1029039,1276055,1582354,1962165,2433131,3017129,3741286,4639240,5752704,7133399],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[0,0,0,0,0,0,0,0,153,370,640,975,1389,1904,2542,3332,4312,5528,7037,8907,11224,14099,17664,22084,27566,34363,42791,53241,662,82268,102193,126901,157539,195528,242636,30105,373483,4633,574672,712774,884021,1096368,1359677,1686180,2091044,2593076,3215595,3987519,4944704],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            time  :{a:25200, b:11, c:1.1, d:1728},
            icon  :'/cdn/all/both/img/city/barracks_l.png',
          },
          branchOffice: {
            maxlevel:72,
            wood:[41,148,297,499,770,113,1602,2218,3017,4047,5367,7054,9201,11924,15369,19716,25185,32054,40663,51434,64885,81661,10255,12853,1608,200835,250454,311885,387872,481778,597732,740796,917337,1135187,1404015,1735749,2145109,2650258,3273613,4043584,4994655,6169425,7620506,9412889,11626849,14361545,17739456,21911869,27065655,33431640,41294936,51007721,63005003,77824109,96128747,118738731,146666701,181163475,223774071,276406902,341419250,421722842,520914258,643436013,794775525,981710881,1212614410,1497827655,1850124544,2285283504,2822794124,3486730050],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[0,0,0,0,464,681,965,1337,1818,2439,3235,4252,5547,7188,9265,11885,15182,19323,24512,31004,39114,49226,61819,77479,96933,121067,150978,188009,233815,290424,360322,446564,552986,684311,846366,1046343,1293113,1597627,1973398,2437552,3010878,3719054,4593796,5674284,7008907,8657442,10693723,13208947,16315766,20153328,24893505,30748599,37980844,46914155,57948631,71578478,88414142,109209651,134896382,166624778,205815871,254224933,314020081,387879387,479110822,591800408,730995225,902929453,1115303588,1377629325,1701655566,2101894617],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            capacity:[400,1600,3600,6400,10000,14400,19600,25600,32400,40000,48400,57600,67600,78400,90000,102400,115600,129600,144400,160000,176400,193600,211600,230400,250000,270400,291600,313600,336400,360000,384400,409600,435600,462400,490000,518400,547600,577600,608400,640842,675014,711009,748923,788858,830924,875232,921903,971062,1022844,1077386,1134836,1195351,1259092,1326232,1396952,1471443,1549906,1632554,1719608,1811305,1907891,2009628,2116789,2229665,2348560,2473795,2605708,2744655,2891011,3045172,3207553,3378593],
            time  :{a:108000, b:11, c:1.1, d:9360},
            icon  :'/cdn/all/both/img/city/branchoffice_l.png',
          },
          blackMarket: {
            maxlevel:25,
            wood:[378,762,1169,1625,2163,2827,3666,4734,6093,7813,9967,12634,15900,19855,24596,30222,36841,44565,53507,63790,75540,88886,103963,120912,139876],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[223,451,694,968,1297,1709,2236,2915,3786,4895,6290,8024,10154,12738,15841,19528,23871,28942,34817,41579,49307,58089,68014,79175,91664],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],            
            time  :{a:0, b:0, c:0, d:0},
            icon  :'/cdn/all/both/img/city/blackmarket_l.png',
          },
          marineChartArchive: {
            maxlevel:40,
            wood:[497,1116,1834,2667,3634,4755,6056,7564,9314,11344,13698,16431,19599,23275,27538,32484,38221,44877,52596,61551,71939,83990,97968,114183,132992,154810,180120,209478,243534,283039,328865,382024,443687,515217,598191,694442,806092,935607,1085844,1260119],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[297,916,1647,2509,3526,4727,6143,7815,9787,12115,14861,18103,21926,26438,31764,38047,45461,54210,64533,76715,91089,108051,128066,151684,179552,212438,251242,297031,351062,414819,490052,578827,683582,807192,953052,1125168,1328263,1567917,1850707,2184400],
            glass:[138,525,982,1521,2156,2906,3792,4837,6069,7525,9241,11266,13656,16476,19804,23731,28366,33834,40285,47899,56883,67484,79993,94754,112173,132726,156978,185596,219366,259214,306235,361719,427191,504447,595611,703182,830117,979901,1156644,1365203],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],            
            time  :{a:0, b:0, c:0, d:0},
            icon  :'/cdn/all/both/img/city/marinechartarchive_l.png',
          },
          carpentering: {
            maxlevel:50,
            wood:[54,104,165,235,319,417,533,668,827,1013,1231,1487,1787,2137,2549,3030,3593,4252,5023,5925,6980,8213,9656,11343,13316,15621,18317,21468,25150,29454,34482,40359,47238,55289,64713,75743,88653,103763,121449,142149,166377,194734,227925,266773,312242,365461,427751,500657,585990,685867],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[0,0,0,0,0,0,0,308,381,469,575,701,853,1036,1254,1517,1832,2211,2664,3208,3862,4645,5586,6715,8070,9696,11646,13987,16796,20167,24212,29067,34894,41891,50291,60374,72479,87013,104459,125403,150548,180733,216971,260475,312702,375400,450669,541030,649509,779739],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],            
            time  :{a:125660, b:37, c:1.06, d:2808},
            icon  :'/cdn/all/both/img/city/carpentering_l.png',
          },
          dump: {
            maxlevel:80,
            wood:[550,990,1518,2153,2913,3827,4922,6237,7815,9708,11980,14706,17978,21904,26615,32268,39052,47193,56962,68685,82752,99633,119890,144198,173369,208372,250377,300784,361270,433855,520956,625478,750903,901415,1082027,1298764,1558847,1870946,2245466,2694889,3234264,3881593,4658484,5590867,6709864,8052825,9664577,11598917,13920408,16706541,20050310,24063326,28879536,34659697,41596742,49922218,59914014,71905643,86297363,103569548,124298713,149176766,179034093,214867283,257872389,309484852,371427409,445767602,534986785,642062945,770570110,924797636,1109893386,1332035549,1598638868,1918602120,2302605153,2763465357,3316565485,3980367111],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[427,801,1242,1763,2375,3103,3959,4969,6161,7567,9226,11184,13494,16221,19437,23233,27713,32999,39235,46595,55279,65527,77620,91888,108725,128594,152037,179702,212345,250864,296317,349952,413240,487921,576043,680028,802731,947520,1118371,1319975,1557920,1838759,2170225,2561442,3023182,3568157,4211372,4970538,5866554,6924092,8172266,9645444,11384185,13436361,15858473,18717208,22091275,26073570,30773734,36321177,42868631,50596365,59717144,70482083,83187570,98183417,115882499,136772114,161427405,190527194,224872670,265409450,313253612,369722426,436370616,515033175,607875879,717454917,846787273,999433788],
            glass:[602,985,1434,1959,2572,3032,4130,5113,6263,7608,9183,11024,13179,15701,18650,22102,26139,30864,36391,42859,50426,59279,69637,81756,95936,112525,131936,154646,173476,212303,248675,291232,341021,399276,467434,547178,640478,749641,877361,1026793,1201676,1406345,1645873,1926197,2254267,2638213,3087553,3613423,4228860,4949118,5792050,6778550,7933070,9284227,10865512,12716122,14881927,17416611,20383001,23854625,27917535,32672439,38237196,44749739,52371496,61291388,71730512,83947623,98245548,114978689,134561813,157480325,184302310,215692604,252429279,295422930,345739242,404625407,473541040,554194356],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            capacity:[32000,65401,101073,139585,181437,227119,277128,331991,392268,458564,531535,611896,700427,797983,905498,1024000,1154614,1298578,1457248,1632119,1824830,2037185,2271165,2528951,2812939,3125764,3470326,3849813,4267731,4727939,5234678,5792619,6406896,7083160,7827629,8647143,9549229,10542172,11635086,12838003,14161964,15619122,17222851,18987875,20930401,23068269,25421121,28010583,30860463,33996977,37448993,41248299,45429902,50032358,55098129,60673986,66811447,73567262,81003948,89190382,98202448,108123754,119046431,131072000,144312338,158890744,174943109,192619216,212084166,233519956,257127222,283127160,311763649,343305589,378049493,416322336,458484710,504934306,556109751,612494861],            
            time  :{a:32000, b:13, c:1.17, d:2160},
            icon  :'/cdn/all/both/img/city/dump_l.png',
          },
          embassy: {
            maxlevel:78,
            wood:[208,356,535,750,1008,1317,1689,2134,2668,331,4078,5002,611,7439,9036,1095,13247,16004,19313,23283,28048,33764,40625,48857,58737,70592,84817,101888,122373,146955,176454,211853,254352,305378,366639,440191,528497,634519,761809,914635,1098120,1318413,1582899,1900444,2281690,2739419,3288971,3948770,4740930,5692004,6833873,8204811,9850772,11826928,14199519,17048074,20468075,24574160,29503963,35422730,42528856,51060537,61303752,73601851,88367060,106094308,127377805,152930967,183610329,220444254,264667405,317762127,381508140,458042191,549929678,660250643,792703010,951726544],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[133,294,491,731,1023,1381,1816,2347,2996,3787,4753,593,7366,9119,11257,13865,17048,20931,25667,31446,38497,47097,57591,70393,86012,105066,128312,156673,191273,233485,284984,347812,424491,518075,632291,771688,941816,1149450,1402860,1712137,2089598,2550275,3112514,3798706,4636175,5658276,6905710,8428156,10286243,12553968,15321640,18699477,22822000,27853382,33993991,41488371,50634975,61798058,75422175,92049891,112343384,137110819,167338529,204230298,249255296,304206590,371272550,453123999,553020573,674940534,823739201,1005342303,1226981968,1497484733,1827623048,2230544282,2722294292,3322456440],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],            
            time  :{a:96000, b:7, c:1.05, d:10080},
            icon  :'/cdn/all/both/img/city/embassy_l.png',
          },
          fireworker: {
            maxlevel:50,
            wood:[234,303,382,473,578,699,837,996,1180,1391,1633,1911,2232,2601,3024,3512,4072,4717,5458,6311,7291,8419,9715,11206,12921,14893,17161,19768,22767,26216,30182,34744,39994,46038,52996,61005,70225,80839,93056,107119,123308,141943,163395,188088,216514,249236,286902,330262,380174,437629],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[116,182,259,348,452,571,711,872,1060,1277,1529,1823,2162,2555,3012,3542,4157,4869,5696,6655,7768,9059,10556,12292,14307,16644,19356,22500,26148,30379,35288,40981,47593,55271,64188,74543,86571,100537,116757,135594,157471,182876,212380,246644,286436,332648,386316,448642,521023,605081],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],            
            time  :{a:125660, b:37, c:1.06, d:2628},
            icon  :'/cdn/all/both/img/city/fireworker_l.png',
          },
          forester: {
            maxlevel:61,
            wood:[215,369,571,832,1173,1615,2189,2936,3907,5171,6812,8946,1172,15327,20015,26111,34034,44334,57725,75133,97764,127184,165429,215148,279783,36381,473043,615046,79965,1039635,1351616,1757192,2284467,2969962,3861151,5019757,6526023,8484269,11030122,14339902,18642840,24236948,31509665,40964688,53256856,69237501,90013417,117023507,152138445,197790230,257140627,334300142,434612711,565025809,734571624,954992608,1241554740,1614104820,2098445027,2728119932,3546739737],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[0,89,203,352,546,798,1125,155,2103,2822,3756,4971,6550,8603,11272,14742,19252,25115,32738,42647,55529,72276,94047,122348,159140,206971,269149,349982,455064,591671,769260,1000126,1300278,1690511,2197858,2857466,3715034,4829968,6279511,8164084,10614242,13799729,17941227,23325646,30326008,39427279,51259973,66643826,86644597,112647886,146455135,190408425,247552729,321846860,418437727,544016901,707284190,919550337,1195520604,1554313513,2020785330],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],            
            time  :{a:72000, b:11, c:1.1, d:6120},
            icon  :'/cdn/all/both/img/city/forester_l.png',
          },
          glassblowing: {
            maxlevel:61,
            wood:[235,401,617,898,1263,1738,2354,3157,4199,5554,7316,9607,12585,16456,21488,2803,36535,47591,61963,80649,104938,136516,177565,230931,300306,390494,507737,660154,858296,1115880,1450740,1886057,2451998,3187758,4144296,5387857,7004569,9106400,11838919,15391374,20009798,26014054,33819980,43968198,57161548,74313771,96612788,125602976,163292127,212290500,275991607,358807234,466472992,606445556,788419092,1024996652,1332563034,1732419548,2252259306,2928085165,3806703211],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[0,99,219,374,577,840,1182,1627,2205,2955,3931,5202,6852,8997,11786,15412,20125,26253,34219,44574,58037,75538,98289,127865,166315,216300,281279,365753,475568,618329,803918,1045183,1358855,1766663,2296859,2986173,3882359,5047500,6562314,8531740,11092214,14421117,18749061,24375871,31691353,41202296,53567581,69643833,90544754,117718283,153046903,198978051,258693667,336330631,437267348,568496341,739108674,960923743,1249308082,1624239900,2111693096],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],            
            time  :{a:72000, b:11, c:1.1, d:6120},
            icon  :'/cdn/all/both/img/city/glassblowing_l.png',
          },
          museum: {
            maxlevel:36,
            wood:[481,1234,2363,4055,6595,10405,16119,2469,37548,56833,85762,129155,194244,291878,438329,658006,987521,1481794,2223204,3335317,5003487,7505999,11260150,16891952,25340520,38014669,57027835,85550503,128338880,192528010,288821553,433276641,649981434,975071871,1462757402,2194360517],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[240,1023,2212,4021,6769,10946,17296,26948,41618,63917,97812,149332,227642,346674,527603,802613,1220630,1856015,2821801,4289796,6521148,9913144,15069498,22907948,34823590,52937193,80472645,122330751,185961486,282689952,429732042,653258546,993053083,1509592842,2294812419,3488466488],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],            
            satisfaction:[20,41,63,88,114,144,176,211,250,294,341,395,453,518,590,670,759,857,965,1086,1219,1367,1530,1711,1912,2134,2380,2652,2953,3286,3655,4064,4516,5016,5569,6182],
            maxBonus:[50,100,150,200,250,300,350,400,450,500,550,600,650,700,750,800,850,900,950,1000,1050,1100,1150,1200,1250,1300,1350,1400,1450,1500,1550,1600,1650,1700,1750,1800],
            time  :{a:18000, b:1, c:1.1, d:14040},
            icon  :'/cdn/all/both/img/city/museum_r.png',
          },
          optician: {
            maxlevel:50,
            wood:[102,161,231,311,405,513,638,784,952,1148,1376,1639,1944,2298,2710,3187,3741,4382,5127,5990,6992,8154,9503,11066,12881,14984,17426,20257,23541,27352,31771,36898,42851,49765,57795,67121,77951,90528,105135,122100,141801,164681,191253,222113,257950,299572,347908,404045,469238,544951],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[0,30,82,143,214,296,391,502,630,778,951,1150,1382,1652,1963,2325,2745,3232,3797,4453,5213,6094,7117,8304,9681,11277,13129,15277,17770,20661,24014,27905,32425,37679,43783,50877,59119,68698,79827,92761,107789,125252,145545,169125,196525,228365,265363,308354,358312,416362],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],            
            time  :{a:125660, b:37, c:1.06, d:2772},
            icon  :'/cdn/all/both/img/city/optician_l.png',
          },
          palace: {
            maxlevel:20,
            wood:[612,5008,13801,31386,66557,136898,27758,558944,1121673,2247131,4079425,7405756,13444352,24406772,44307863,80436146,146023147,265089275,481240988,873641108],
            wine:[0,0,0,9372,19014,38299,76868,154007,308284,616838,1233946,2468433,4937948,9878058,19760441,39529536,79076377,158187373,316443997,633026529],
            marble:[0,1233,3909,9262,19967,41378,84199,169841,341125,683694,1368832,2740554,5486893,10985369,21993924,44034272,88161489,176509062,353390684,707527273],
            glass:[0,0,0,0,18221,36464,72948,145917,291856,583733,1167487,2335016,4670116,9340398,18681126,37362913,74727147,149456937,298919160,597848890],
            sulfur:[0,0,2656,8858,21263,46072,95691,194928,393402,790351,1584248,3175603,6365454,12759465,25576175,51267094,102764189,205989415,412902967,827658356],
            time  :{a:11520, b:1, c:1.4, d:0},
            icon  :'/cdn/all/both/img/city/palace_l.png', 
          },
          palaceColony:{
            maxlevel:20,
            wood:[612,5008,13801,31386,66557,136898,27758,558944,1121673,2247131,4079425,7405756,13444352,24406772,44307863,80436146,146023147,265089275,481240988,873641108],
            wine:[0,0,0,9372,19014,38299,76868,154007,308284,616838,1233946,2468433,4937948,9878058,19760441,39529536,79076377,158187373,316443997,633026529],
            marble:[0,1233,3909,9262,19967,41378,84199,169841,341125,683694,1368832,2740554,5486893,10985369,21993924,44034272,88161489,176509062,353390684,707527273],
            glass:[0,0,0,0,18221,36464,72948,145917,291856,583733,1167487,2335016,4670116,9340398,18681126,37362913,74727147,149456937,298919160,597848890],
            sulfur:[0,0,2656,8858,21263,46072,95691,194928,393402,790351,1584248,3175603,6365454,12759465,25576175,51267094,102764189,205989415,412902967,827658356],
            time  :{a:11520, b:1, c:1.4, d:0},
            icon  :'/cdn/all/both/img/city/palaceColony_l.png',
          },
          pirateFortress:{
            maxlevel:30,
            wood:[387,779,1194,1664,2229,2947,3883,5117,6737,8844,11549,14976,19258,24539,30972,38724,47969,58894,71694,86577,103757,123463,145929,171405,200146,232419,268500,308676,353243,402507],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[215,434,673,956,1319,1808,2479,3396,4633,6274,8412,11149,14594,18866,24096,30418,37979,46932,57441,69677,83818,100053,118579,139599,163326,189984,219798,253009,289861,330608],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],            
            time   :{a:1550, b:1, c:1.2, d:1800},
            icon   :'/cdn/all/both/img/city/pirateFortress_l.png',
          },
          port: {
            maxlevel:74,
            wood:[51,129,235,368,547,768,1038,1414,1811,2352,3041,3863,4892,6108,7611,954,11808,14673,18143,22329,27356,33703,41278,50493,61881,75359,92107,112468,136757,166786,20283,246402,299897,364631,441994,537638,652033,790936,959771,1164024,1412356,1711592,2073513,2513976,3045758,3690710,4471434,5417311,6563277,7951657,9633732,11671630,14140619,17131894,20755934,25146596,30466049,36910766,44718784,54178492,65639285,79524466,96346887,116727883,141420228,171335934,207579939,251490917,304690720,369144286,447232209,541838670,656457962,795323552],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[0,0,0,0,0,151,280,464,680,978,1374,1871,2518,3318,4343,57,7366,9536,12267,15687,19949,25492,32366,41024,52078,65675,83109,105055,132228,166917,210098,264169,332782,418793,525453,6616,830582,1043000,1310271,1645242,2066850,2593492,3253373,4084635,5124763,6431252,8069741,10125666,12705379,15942324,20003946,25100346,31495153,39519164,49587450,62220829,78072811,97963398,122921504,154238178,193533392,242839836,304708068,382338449,479746700,601971622,755335750,947772410,1189236100,1492217420,1872389200,2349417230,2947977544,3699032889],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            loadingSpeed:[30,60,93,129,169,213,261,315,373,437,508,586,672,766,869,983,1108,1246,1398,1565,1748,195,2172,2416,2685,298,3305,3663,4056,4489,4965,5488,6064,6698,7394,8161,9004,9931,10951,12073,13308,14666,16159,17802,19609,21597,23784,2616,288,3174,3498,3852,4242,4668,5142,5664,624,687,7566,8334,9174,10104,1113,12258,13494,14862,16368,1803,19854,21864,24078,26514,29202,3216],            
            time  :{a:50400, b:23, c:1.15, d:1512},
            icon  :'/cdn/all/both/img/city/port_r.png',
          },
          safehouse: {
            maxlevel:60,
            wood:[97,213,345,497,669,866,1089,1345,1636,1967,2346,2777,3268,3829,4467,5196,6026,6972,8052,9281,10683,12282,14104,16181,1855,21249,24327,27836,31836,36396,41593,47519,54288,62022,70857,80952,92484,105659,120712,137908,157555,180,205642,234938,268407,306644,350328,400235,457252,522392,596811,681832,778964,889934,1016714,1161553,1327026,1516072,1732050,1978795],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[0,0,0,110,169,236,314,405,509,632,774,937,1128,1349,1604,1902,2247,2647,3110,3648,4272,4996,5836,6810,7940,9251,10772,12536,14582,16955,19708,22902,26613,30927,35939,41764,48532,56397,65538,76159,88501,102844,119511,13888,161387,187542,217936,253256,294299,341995,39742,461827,536672,623647,724717,842167,978652,1137256,1321562,1535739],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            time  :{a:96000, b:7, c:1.05, d:12960},
            icon  :'/cdn/all/both/img/city/safehouse_l.png',
          },
          shipyard: {
            maxlevel:38,
            wood:[90,173,278,410,577,786,105,1383,1802,2331,2997,3835,4892,6224,7903,10017,12681,16039,20268,25597,32312,40774,51434,64868,81792,103119,129989,163847,206506,260258,327985,41332,520843,656322,827026,1042112,1313121,1654593],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[0,0,0,0,0,669,904,1201,1575,2047,2641,339,4332,5521,7018,8904,11281,14276,1805,22804,28796,36344,45856,5784,7294,91966,11594,146145,184205,23216,292584,368717,464645,585515,737811,929703,1171488,1476136],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            time  :{a:64800, b:7, c:1.05, d:7128},
            icon  :'/cdn/all/both/img/city/shipyard_l.png',
          },
          stonemason: {
            maxlevel:61,
            wood:[235,401,617,898,1263,1738,2354,3157,4199,5554,7316,9607,12585,16456,21488,28030,36535,47591,61963,80649,104938,136516,177565,230931,300306,390494,507737,660154,858296,1115880,1450740,1886057,2451998,3187758,4144296,5387857,7004569,9106400,11838919,15391374,20009798,26014054,33819980,43968198,57161548,74313771,96612788,125602976,163292127,212290500,275991607,358807234,466472992,606445556,788419092,1024996652,1332563034,1732419548,2252259306,2928085165,3806703211],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[0,99,219,374,577,840,1182,1627,2205,2955,3931,5202,6852,8997,11786,15412,20125,26253,34219,44574,58037,75538,98289,127865,166315,216300,281279,365753,475568,618329,803918,1045183,1358855,1766663,2296859,2986173,3882359,5047500,6562314,8531740,11092214,14421117,18749061,24375871,31691353,41202296,53567581,69643833,90544754,117718283,153046903,198978051,258693667,336330631,437267348,568496341,739108674,960923743,1249308082,1624239900,2111693096],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            time  :{a:72000, b:11, c:1.1, d:6120},
            icon  :'/cdn/all/both/img/city/stonemason_l.png',
          },
          temple: {
            maxlevel:56,
            wood:[185,196,286,399,514,653,823,1029,1231,1524,1816,2160,2650,3143,3833,4408,5359,6163,7471,8812,10134,12236,14407,16568,19939,22931,27543,31674,37201,43672,51248,58934,69131,82618,93217,111324,128023,149952,175636,205722,240960,282234,330578,387204,453528,531214,622206,728784,853617,999835,1171097,1371695,1606653,1881858,2204204,2581763],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[148,163,249,363,487,646,850,1109,1384,1788,2223,2760,3533,4372,5565,6677,8471,10166,12858,15825,18990,23928,29398,35277,44302,53162,66630,79955,97989,120036,146983,176379,215889,269226,316976,395001,474001,579334,708075,865425,1057743,1292797,1580085,1931216,2360375,2884904,3525994,4309550,5267229,6437726,7868332,9616852,11753933,14365921,17558351,21460211],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],            
            time  :{a:2160, b:1, c:1.1, d:0},
            icon  :'/cdn/all/both/img/city/temple_l.png',
          },
          tavern: {
            maxlevel:70,
            wood:[86,190,315,465,645,860,1119,143,1803,225,2787,3431,4203,5131,6244,758,9183,11106,13414,16183,19507,23495,28281,34023,40915,49185,59108,71017,85306,102455,123032,147725,177357,212916,255585,306789,368233,441967,530448,636624,764036,916929,1100402,1320569,1584770,1901810,2282259,2738814,3286701,3944191,4733208,5680066,6816336,8179914,9816267,11779966,14136495,16964436,20358093,24430637,29317873,35182779,42220933,50667036,60802744,72966054,87562577,105079069,126099653,151325310],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[0,0,0,80,104,135,177,229,299,388,504,657,853,1109,1442,1875,2438,3169,412,5356,6963,9052,11768,15298,19887,25854,3361,43693,56801,73841,95994,124792,16223,210899,274168,356419,463345,602349,783054,1017969,1323361,1720368,2236479,2907424,3779650,4913547,6387610,8303891,10795057,14033573,18243642,23716732,30831747,40081266,52105638,67737320,88058503,114476037,148818827,193464446,251503743,326954818,425041200,552553478,718319416,933815102,1213959454,1578147056,2051590869,2667067736],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            maxWine:[4,8,13,18,24,30,37,44,51,60,68,78,88,99,110,122,136,150,165,180,197,216,235,255,277,300,325,351,378,408,439,472,507,544,584,626,670,717,766,818,874,933,995,1060,1129,1203,1280,1361,1449,1541,1640,1745,1857,1976,2102,2237,2380,2532,2694,2867,3050,3246,3453,3675,3910,4160,4426,4710,5011,5332],
            satisfaction:[12,24,36,48,61,73,86,99,112,125,138,152,165,179,193,207,222,236,251,266,282,297,313,329,345,361,378,395,412,430,448,466,484,502,521,540,560,580,600,620,641,662,683,705,727,749,772,795,819,843,867,891,916,942,968,994,1021,1048,1075,1103,1131,1160,1189,1219,1249,1280,1311,1343,1375,1408],
            maxBonus:[60,120,181,242,304,367,430,494,559,624,691,758,826,896,966,1037,1109,1182,1256,1332,1408,1485,1564,1644,1725,1807,1891,1975,2061,2149,2238,2328,2419,2512,2606,2702,2800,2898,2999,3101,3204,3310,3416,3525,3635,3747,3861,3976,4094,4213,4334,4457,4582,4709,4838,4969,5103,5238,5375,5515,5657,5801,5947,6096,6247,6400,6556,6714,6875,7038],
            time  :{a:10800, b:1, c:1.06, d:10440},
            icon  :'/cdn/all/both/img/city/taverne_r.png',
            wineUse: [0, 4, 8, 13, 18, 24, 30, 37, 44, 51, 60, 68, 78, 88, 99, 110, 122, 136, 150, 165, 180, 197, 216, 235, 255, 277, 300, 325, 351, 378, 408, 439, 472, 507, 544, 584, 626, 670, 717, 766, 818, 874, 933, 995, 1060, 1129, 1202, 1280, 1362],
          },
          townHall: {
            maxlevel:66,
            wood:[0,135,288,535,793,1195,1732,2327,3148,4107,5308,6943,8841,11199,14124,18047,21863,27765,34599,42385,52638,64331,80802,9721,12177,146383,180609,222632,270815,333385,405226,492419,59823,735066,892521,1095676,1315122,1613532,1957605,2374710,2880686,3494469,4239031,5142235,6237884,7566981,9179268,11135082,13507617,16385666,19876937,24112088,29249616,35481790,43041845,52212708,63337596,76832847,93203512,113062251,137152263,166375099,201824404,244826841,296991745,360271352],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[0,0,0,0,245,473,804,1213,1798,2532,3501,4871,6567,8784,11674,15698,19995,26678,34915,44905,58539,75091,98986,12498,164305,207293,26843,347289,443409,572956,731026,932491,1189231,1534000,1955370,2520083,3175628,4090537,5210432,6636074,8451790,10764309,13709563,17460677,22238144,28322787,36072268,45942107,58512461,74522227,94912471,120881750,153956559,196081062,249731375,318061105,405086733,515923697,657087086,836874602,1065854305,1357485815,1728911472,2201963988,2804449784,3571783476],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            time  :{a:1800, b:1, c:1.17, d:-1080},
            icon  :'/cdn/all/both/img/city/townhall_l.png',
          },
          vineyard: {
            maxlevel:50,
            wood:[291,363,447,542,651,778,923,1091,1283,1504,1758,2050,2386,2773,3217,3728,4316,4992,5769,6664,7691,8874,10234,11797,13595,15664,18041,20776,23921,27538,31697,36480,41984,48318,55608,63998,73654,84767,97556,112275,129215,148711,171148,196970,226689,260891,300253,345554,397690,457692],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[105,170,245,332,433,550,686,843,1026,1238,1484,1769,2100,2484,2930,3446,4046,4741,5547,6482,7568,8826,10286,11979,13944,16223,18866,21932,25489,29615,34401,39953,46401,53891,62588,72689,84421,98046,113870,132247,153591,178380,207168,240604,279436,324534,376912,437743,508391,590441],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],            
            time  :{a:125660, b:37, c:1.06, d:2232},
            icon  :'/cdn/all/both/img/city/vineyard_l.png',
          },
          wall: {
            maxlevel:48,
            wood:[98,310,565,870,1237,1677,2205,2839,3599,4512,5608,6922,8498,10391,12662,15387,18657,22581,2729,32941,39722,47859,57623,6934,83401,100275,120522,144819,173976,208964,250949,301332,361791,434343,521404,625877,751246,901687,1082217,1298853,1558817,1870773,2245120,2694337,3233397,3880269,4656516,5588011],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[0,174,443,767,1155,1621,218,285,3655,4621,578,717,8839,10842,13245,16129,19589,23742,28725,34705,41881,50491,60824,73223,88103,105958,127384,153096,18395,220975,265404,31872,382698,459473,551602,662157,794823,954022,1145061,1374308,1649405,1979520,2375658,2851025,3421465,4105993,4927426,5913145],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],            
            time  :{a:57600, b:11, c:1.1, d:3240},
            icon  :'/cdn/all/both/img/city/wall.png',
          },
          warehouse: {
            maxlevel:85,
            wood:[137,247,380,538,728,957,123,1559,1953,2426,2995,3676,4494,5476,6653,8066,9763,11798,1424,17171,20688,24908,29972,36049,43342,52093,62594,75195,90318,108464,130239,156369,187725,225353,270506,324691,389711,467736,561366,673722,808565,970396,1164618,1397712,1677459,2013197,2416131,2899711,3480078,4176604,5012536,6015778,7219815,8664836,10399072,12480410,14978319,17976177,21574046,25892014,31074209,37293603,44757785,53715898,64466945,77369775,92855062,111439673,133743930,160512304,192638273,231194140,277466828,333000831,399649768,479638253,575636150,690847686,829118402,995063513,1194221950,1433241242,1720099398,2064371199,2477547780],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[0,0,0,82,181,300,442,614,819,1066,1362,1717,2143,2653,3268,4004,4887,5946,7218,8745,10577,12775,15412,18577,22376,26934,32403,38966,46842,56293,67634,81245,97576,117174,140691,168911,202776,243415,29218,350699,420938,505244,606436,727895,87368,1048662,1258691,1510786,1813370,2176555,2612483,3135717,3763747,4517560,5422349,6508351,7811859,9376439,11254377,13508432,16213936,19461305,23359065,28037479,33652897,40392985,48482997,58193295,69848398,83837814,100629067,120783314,144974107,174009893,208861041,250692266,300901556,361166892,433502324,520325282,624537363,749621309,899757388,1079963105,1296260886],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            capacity:[8000,16401,25455,35331,46181,58159,71421,86138,102493,120687,140942,163502,188637,216646,24786,282647,321416,364622,412768,466416,526189,592779,666959,749584,841609,944094,1058219,1185297,1326787,1484315,1659690,1854922,2072252,2314171,2583453,2883186,3216807,3588142,4001450,4461476,4973499,5543400,6177729,6883779,7669673,8544460,9518219,10602179,11808851,13152172,14647676,16312668,18166439,20230485,22528769,25088000,27937955,31111829,34646637,38583648,42968887,47853679,53295269,59357506,66111616,73637056,82022473,91366775,101780329,113386298,126322135,140741251,156814887,174734197,194712581,216988297,241827374,269526873,300418536,334872863,373303675,416173213,463997848,517354466,576887609],
            time  :{a:2880, b:1, c:1.14, d:2160},
            icon  :'/cdn/all/both/img/city/warehouse_l.png',
          },
          winegrower: {
            maxlevel:61,
            wood:[235,401,617,898,1263,1738,2354,3157,4199,5554,7316,9607,12585,16456,21488,28030,36535,47591,61963,80649,104938,136516,177565,230931,300306,390494,507737,660154,858296,1115880,1450740,1886057,2451998,3187758,4144296,5387857,7004569,9106400,11838919,15391374,20009798,26014054,33819980,43968198,57161548,74313771,96612788,125602976,163292127,212290500,275991607,358807234,466472992,606445556,788419092,1024996652,1332563034,1732419548,2252259306,2928085165,3806703211],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[0,99,219,374,577,840,1182,1627,2205,2955,3931,5202,6852,8997,11786,15412,20125,26253,34219,44574,58037,75538,98289,127865,166315,216300,281279,365753,475568,618329,803918,1045183,1358855,1766663,2296859,2986173,3882359,5047500,6562314,8531740,11092214,14421117,18749061,24375871,31691353,41202296,53567581,69643833,90544754,117718283,153046903,198978051,258693667,336330631,437267348,568496341,739108674,960923743,1249308082,1624239900,2111693096],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],            
            time  :{a:72000, b:11, c:1.1, d:6120},
            icon  :'/cdn/all/both/img/city/winegrower_l.png',
          },
          workshop: {
            maxlevel:32,
            wood:[189,329,489,671,879,1117,1387,1695,2046,2447,2904,3424,4017,4693,5465,6344,7346,8488,9791,11275,12967,14896,17096,19604,22462,25721,29436,33671,38498,44002,50277,57429],
            wine:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            marble:[81,143,215,300,396,509,639,791,967,1171,1407,1682,2000,2369,2797,3294,3870,4539,5314,6214,7257,8468,9871,11500,13390,15581,18123,21072,24493,28461,33064,38404],
            glass:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            sulfur:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            time  :{a:96000, b:7, c:1.05, d:11880},
            icon  :'/cdn/all/both/img/city/workshop_l.png',
          },
        },
        
        Research: {
          Seafaring: {
            CARPENTRY: 2150,
            DECK_WEAPONS: 1010,
            PIRACY: 1170,
            SHIP_MAINTENANCE: 1020,
            DRAFT: 1130,
            EXPANSION: 1030,
            FOREIGN_CULTURES: 1040,
            PITCH: 1050,
            MARKET: 2070,
            GREEK_FIRE: 1060,
            COUNTERWEIGHT: 1070,
            DIPLOMACY: 1080,
            SEA_MAPS: 1090,
            PADDLE_WHEEL_ENGINE: 1100,
            CAULKING: 1140,
            MORTAR_ATTACHMENT: 1110,
            MASSIVE_RAM: 1150,
            OFFSHORE_BASE: 1160,
            SEAFARING_FUTURE: 1999,
          },
          
          Economy: {
            CONSERVATION: 2010,
            PULLEY: 2020,
            WEALTH: 2030,
            WINE_CULTURE: 2040,
            IMPROVED_RESOURCE_GATHERING: 2130,
            GEOMETRY: 2060,
            ARCHITECTURE: 1120,
            HOLIDAY: 2080,
            LEGISLATION: 2170,
            CULINARY_SPECIALITIES: 2050,
            HELPING_HANDS: 2090,
            SPIRIT_LEVEL: 2100,
            WINE_PRESS: 2140,
            DEPOT: 2160,
            BUREACRACY: 2110,
            UTOPIA: 2120,
            ECONOMIC_FUTURE: 2999,
          },
          
          Science: {
            WELL_CONSTRUCTION: 3010,
            PAPER: 3020,
            ESPIONAGE: 3030,
            POLYTHEISM: 3040,
            INK: 3050,
            GOVERNMENT_FORMATION: 3150,
            INVENTION: 3140,
            CULTURAL_EXCHANGE: 3060,
            ANATOMY: 3070,
            OPTICS: 3080,
            EXPERIMENTS: 3081,
            MECHANICAL_PEN: 3090,
            BIRDS_FLIGHT: 3100,
            LETTER_CHUTE: 3110,
            STATE_RELIGION: 3160,
            PRESSURE_CHAMBER: 3120,
            ARCHIMEDEAN_PRINCIPLE: 3130,
            SCIENTIFIC_FUTURE: 3999,
          },
          
          Military: {
            DRY_DOCKS: 4010,
            MAPS: 4020,
            PROFESSIONAL_ARMY: 4030,
            SEIGE: 4040,
            CODE_OF_HONOR: 4050,
            BALLISTICS: 4060,
            LAW_OF_THE_LEVEL: 4070,
            GOVERNOR: 4080,
            PYROTECHNICS: 4130,
            LOGISTICS: 4090,
            GUNPOWDER: 4100,
            ROBOTICS: 4110,
            CANNON_CASTING: 4120,
            MILITARISTIC_FUTURE: 4999,
          },
        },
        
        Government: {
          ANARCHY: 'anarchie',
          
          IKACRACY: 'ikakratie',
          ARISTOCRACY: 'aristokratie',
          DICTATORSHIP: 'diktatur',
          DEMOCRACY: 'demokratie',
          NOMOCRACY: 'nomokratie',
          OLIGARCHY: 'oligarchie',
          TECHNOCRACY: 'technokratie',
          THEOCRACY: 'theokratie',
        },
        
        TradeGoodOrdinals: {
          WINE: 1,
          MARBLE: 2,
          GLASS: 3,
          SULFUR: 4,
        },
        
        Time: {
          SECONDS_PER_HOUR: 3600,
          SECONDS_PER_MINUTE: 60,
          MILLIS_PER_DAY: 1000 * 60 * 60 * 24,
          MILLIS_PER_HOUR: 1000 * 60 * 60,
          MILLIS_PER_SECOND: 1000,
          MILLIS_PER_MINUTE: 60000,
          MINUTES_PER_DAY: 24 * 60,
          MINUTES_PER_HOUR: 60,
          HOURS_PER_DAY: 24,
          HOURS_PER_WEEK: 24 * 7,
          
          SAFE_TIME_DELTA: 1000,
          INITIAL_PAGE_LOAD_DELTA: 2000,
        },
        
        GamePlay: {
          BUILDING_SPOTS: 24,
          HAPPINESS_PER_CULTURAL_GOOD: 50,
          HAPPINESS_PER_WINE_SERVING_LEVEL: 60,
          BASE_RESOURCE_PROTECTION: 100,
          RESOURCES_PER_TRANSPORT: 500,
          RESOURCE_PROTECTION_WAREHOUSE: 480,
          RESOURCE_PROTECTION_WAREHOUSE_INACTIVE: 80,
        },
            
        BaseView: {
          ISLAND: 'island',
          CITY: 'city',
          WORLD: 'worldview',
        },
        
        Military: {
          // Army
          HOPLITE: 'phalanx', 
          STEAM_GIANT: 'steamgiant', 
          SPEARMAN: 'spearman', 
          SWORDSMAN: 'swordsman', 
          SLINGER: 'slinger', 
          ARCHER: 'archer', 
          GUNNER: 'marksman',
          BATTERING_RAM: 'ram', 
          CATAPULT: 'catapult',
          MORTAR: 'mortar', 
          GYROCOPTER: 'gyrocopter',
          BALLOON_BOMBADIER: 'bombardier', 
          COOK: 'cook', 
          DOCTOR: 'medic',
          ARMY: 'army',
          
          // Navy
          RAM_SHIP: 'ship_ram', 
          FLAME_THROWER: 'ship_flamethrower',
          STEAM_RAM: 'ship_steamboat', 
          BALLISTA_SHIP: 'ship_ballista', 
          CATAPULT_SHIP: 'ship_catapult', 
          MORTAR_SHIP: 'ship_mortar', 
          SUBMARINE: 'ship_submarine',
          PADDLE_SPEED_SHIP: 'ship_paddlespeedship',
          BALLOON_CARRIER: 'ship_ballooncarrier',
          TENDER: 'ship_tender',
          ROCKET_SHIP: 'ship_rocketship',
          NAVY: 'navy',
        },
        
        UnitData: {
          spearman: {
            minimumBuildingLevelToBuild: 1,
            baseBuildTime: 60,
            isArmy: true,
            speed: 60,
            cargoSize: 3,
          },
          slinger: {
            minimumBuildingLevelToBuild: 2,
            baseBuildTime: 90,
            isArmy: true,
            speed: 60,
            cargoSize: 3,
          },
          ram: {
            minimumBuildingLevelToBuild: 3,
            baseBuildTime: 600,
            isArmy: true,
            speed: 40,
            cargoSize: 30,
          },
          phalanx: {
            minimumBuildingLevelToBuild: 4,
            baseBuildTime: 300,
            isArmy: true,
            speed: 60,
            cargoSize: 5,
          },
          cook: {
            minimumBuildingLevelToBuild: 5,
            baseBuildTime: 1200,
            isArmy: true,
            speed: 40,
            cargoSize: 20,
          },
          swordsman: {
            minimumBuildingLevelToBuild: 6,
            baseBuildTime: 180,
            isArmy: true,
            speed: 60,
            cargoSize: 3,
          },
          archer: {
            minimumBuildingLevelToBuild: 7,
            baseBuildTime: 240,
            isArmy: true,
            speed: 60,
            cargoSize: 5,
          },
          catapult: {
            minimumBuildingLevelToBuild: 8,
            baseBuildTime: 1800,
            isArmy: true,
            speed: 40,
            cargoSize: 30,
          },
          medic: {
            minimumBuildingLevelToBuild: 9,
            baseBuildTime: 1200,
    
            isArmy: true,
            speed: 60,
            cargoSize: 10,
          },
          gyrocopter: {
            minimumBuildingLevelToBuild: 10,
            baseBuildTime: 900,
            isArmy: true,
            speed: 80,
            cargoSize: 15,
          },
          bombardier: {
            minimumBuildingLevelToBuild: 11,
            baseBuildTime: 1800,
            isArmy: true,
            speed: 20,
            cargoSize: 30,
          },
          steamgiant: {
            minimumBuildingLevelToBuild: 12,
            baseBuildTime: 900,
            isArmy: true,
            speed: 40,
            cargoSize: 15,
          },
          marksman: {
            minimumBuildingLevelToBuild: 13,
            baseBuildTime: 600,
            isArmy: true,
            speed: 60,
            cargoSize: 5,
          },
          mortar: {
            minimumBuildingLevelToBuild: 14,
            baseBuildTime: 2400,
            isArmy: true,
            speed: 40,
            cargoSize: 30,
          },
          
          barbarian: {
            minimumBuildingLevelToBuild: 1,
            baseBuildTime: 1,
            isArmy: true,
            speed: 40,
            cargoSize: 5,
          },
          
          ship_ram: {
            minimumBuildingLevelToBuild: 1,
            baseBuildTime: 2400,
            isArmy: false,
            speed: 40,
            cargoSize: 0,
          },
          ship_flamethrower: {
            minimumBuildingLevelToBuild: 4,
            baseBuildTime: 1800,
            isArmy: false,
            speed: 40,
            cargoSize: 0,
          },
          ship_submarine: {
            minimumBuildingLevelToBuild: 19,
            baseBuildTime: 3600,
            isArmy: false,
            speed: 40,
            cargoSize: 0,
          },
          ship_ballista: {
            minimumBuildingLevelToBuild: 3,
            baseBuildTime: 3000,
            isArmy: false,
            speed: 40,
            cargoSize: 0,
          },
          ship_catapult: {
            minimumBuildingLevelToBuild: 3,
            baseBuildTime: 3000,
            isArmy: false,
            speed: 40,
            cargoSize: 0,
          },
          ship_mortar: {
            minimumBuildingLevelToBuild: 17,
            baseBuildTime: 3000,
            isArmy: false,
            speed: 30,
            cargoSize: 0,
          },
          ship_steamboat: {
            minimumBuildingLevelToBuild: 15,
            baseBuildTime: 2400,
            isArmy: false,
            speed: 40,
            cargoSize: 0,
          },
          ship_rocketship: {
            minimumBuildingLevelToBuild: 11,
            baseBuildTime: 3600,
            isArmy: false,
            speed: 30,
            cargoSize: 0,
          },
          ship_paddlespeedship: {
            minimumBuildingLevelToBuild: 13,
            baseBuildTime: 1800,
            isArmy: false,
            speed: 60,
            cargoSize: 0,
          },
          ship_ballooncarrier: {
            minimumBuildingLevelToBuild: 7,
            baseBuildTime: 3900,
            isArmy: false,
            speed: 20,
            cargoSize: 0,
          },
          ship_tender: {
            minimumBuildingLevelToBuild: 9,
            baseBuildTime: 2400,
            isArmy: false,
            speed: 30,
            cargoSize: 0,
          },
        },
    
        UnitIds: {
          301: 'slinger',
          302: 'swordsman',
          303: 'phalanx',
          304: 'marksman',
          305: 'mortar',
          306: 'catapult',
          307: 'ram',
          308: 'steamgiant',
          309: 'bombardier',
          310: 'cook',
          311: 'medic',
          312: 'gyrocopter',
          313: 'archer',
          315: 'spearman',
          316: 'barbarian',
          
          210: 'ship_ram',
          211: 'ship_flamethrower',
          212: 'ship_submarine',
          213: 'ship_ballista',
          214: 'ship_catapult',
          215: 'ship_mortar',
          216: 'ship_steamboat',
          217: 'ship_rocketship',
          218: 'ship_paddlespeedship',
          219: 'ship_ballooncarrier',
          220: 'ship_tender',
        },
        
        IkariamAjaxResponseType: {
          RELOAD: 'reload',
          PROVIDE_FEEDBACK: 'provideFeedback',
          QUEST_DATA: 'questData',
          UPDATE_GLOBAL_DATA: 'updateGlobalData',
          UPDATE_TEMPLATE_DATA: 'updateTemplateData',
          UPDATE_BACKGROUND_DATA: 'updateBackgroundData',
          CLOSE_VIEW: 'closeView',
          CHANGE_VIEW: 'changeView',
          ADD_WINDOW: 'addWindow',
          CREATE_VIEW: 'createView',
          EVAL_SCRIPT: 'evalScript',
        },
        
        
        CityType: {
          OWN: 'ownCity',
          DEPLOYMENT: 'deployedCities',
          OCCUPATION: 'occupiedCities',
        },
        
        View: {
          CITY_DETAIL: 'cityDetails',
          CITY_MILITARY: 'cityMilitary',
          RELATED_CITIES: 'relatedCities',
          ACADEMY: 'academy',
          PALACE: 'palace',
          MUSEUM: 'museum',
          ASSIGN_CULTURAL_POSSESSIONS: 'culturalPossessions_assign',
          TOWN_HALL: 'townHall',
          TEMPLE: 'temple',
          RESEARCH_ADVISOR: 'researchAdvisor',
          FINANCES: 'finances',
          BARRACKS: 'barracks',
          SHIPYARD: 'shipyard',
          PIRATE_FORTRESS: 'pirateFortress',
          MILITARY_ADVISOR: 'militaryAdvisor',
          MILITARY_ADVISOR_REPORT: 'militaryAdvisorReportView',
          PREMIUM: 'premium',
          TRANSPORT: 'transport',
          DEPLOY: 'deployment',
          BRANCH_OFFICE: 'branchOffice',
          BLACK_MARKET: 'blackMarket',
          TAKE_OFFER: 'takeOffer',
          RESOURCE: 'resource',
          TRADE_GOOD: 'tradegood',
          ABOLISH_CITY: 'abolishCity',
          HIDEOUT: 'safehouse',
          PILLAGE: 'plunder',
          BLOCKADE: 'blockade',
          SEND_SPY: 'sendSpy',
          SPY_MISSION: 'spyMissions',
          HIGH_SCORE: 'highscore',
          ALLIANCE_PAGE: 'allyPage',
          OCCUPY: 'occupy',
          COLONIZE: 'colonize',
        },
    
        PlayerState: {
          INACTIVE: 'inactive',
          NORMAL: '',
          VACATION: 'vacation',
          NEW: 'noob',
        },
    
        CombatType: {
          BLOCKADE: 'blockade',
          PILLAGE: 'plunder',
        },
      };
      
      var EmpireData = function() {
        function Military(city) {
          this._ikaToolsType = 'military';
          
          this.lastArmyUpdate = 0;
          this.lastNavyUpdate = 0;
          
          this.present = new MilitaryUnits();
          this.armyTrainingBatches = [];
          this.navyTrainingBatches = [];
          
          this._setCity(city);
        }
        
        $.extend(Military.prototype, {
          _setCity: function setCity(city) {
            if (city) {
              this.city = Utils.fixedFunction(city);
              this._startArmyTrainingTimers();
              this._startNavyTrainingTimers();
            }
          },
          _startTrainingTimers: function startTrainingTimers(batches) {
            var military = this;
            while (batches.length > 0 && batches[0].completionTime <= View.gameTimeNow()) {
              var batch = batches.shift();
              if ((batch.type == Constants.Military.ARMY && 
                   batch.getCompletionTime() > this.lastArmyUpdate) || 
                  (batch.type == Constants.Military.NAVY && 
                   batch.getCompletionTime() > this.lastNavyUpdate)) {
                military.present._increment(batch.getUnits());
              }
            }
            $.each(batches, function startTrainingBatchTimers(index, batch) {
              if (batch.completionEvent) {
                batch.completionEvent();
              }
              batch.completionEvent = militaryChangedEvent().scheduleSend(
                  'MilitaryTrainingComplete[' + military.city().getId() + ']',
                  batch.getCompletionTime() - View.gameTimeNow() + 
                      Constants.Time.SAFE_TIME_DELTA,
                  function militaryTrainingComplete() {
                    military.present._increment(batches.shift().getUnits());
                    empireData.saveAsync();
                  },
                  [{
                    city: military.city(),
                    military: military,
                    type: 'training_complete',
                  }]);
            });
          },
          _startArmyTrainingTimers: function startArmyTrainingTimers() {
            this._startTrainingTimers(this.armyTrainingBatches);
          },
          _startNavyTrainingTimers: function startNavyTrainingTimers() {
            this._startTrainingTimers(this.navyTrainingBatches);
          },
          _updatePresent: function updatePresent(unit, count) {
            return this.present._setCount(unit, count);
          },
          _markPresentUpdated: function markPresentUpdated(army, navy) {
            if (army || army === undefined) {
              this.lastArmyUpdate = View.gameTimeNow();
            }
            if (navy || navy === undefined) {
              this.lastNavyUpdate = View.gameTimeNow();
            }
          },
          _setArmyTrainingBatches: function setArmyTrainingBatches(batches) {
    
            $.each(this.armyTrainingBatches, function cancelTrainingBatchTimer(index, batch) {
              if (batch.completionEvent) {
                batch.completionEvent();
              }
            });
            
            this.armyTrainingBatches = batches;
            
            this._startArmyTrainingTimers();
          },
          _setNavyTrainingBatches: function setNavyTrainingBatches(batches) {
            $.each(this.navyTrainingBatches, function cancelTrainingBatchTimer(index, batch) {
              if (batch.completionEvent) {
                batch.completionEvent();
              }
            });
    
            this.navyTrainingBatches = batches;
    
            this._startNavyTrainingTimers();
          },
          _increment: function increment(units) {
            this.present._increment(units);
          },
          _decrement: function decrement(units) {
            this.present._decrement(units);
          },
          _clear: function clear() {
            this.present._clear();
            this.armyTrainingBatches = [];
            this.navyTrainingBatches = [];
          },
          getTrainingBatches: function getTrainingBatches(batches) {
            return $.merge($.merge([], this.armyTrainingBatches), this.navyTrainingBatches);
          },
          getPresent: function getPresent() {
            return this.present;
          },
        });
        
        function MilitaryUnits() {
          this._ikaToolsType = 'militaryUnits';
          
          this.units = {};
        }
        
        $.extend(MilitaryUnits.prototype, {
          _setCount: function setCount(unit, count) {
            var oldCount = this.units[unit];
            this.units[unit] = count;
            return oldCount != count;
          },
          _increment: function increment(units) {
            $.each(units.units, function(unit, count) {
              this._setCount(unit, (this.getCount(unit) || 0) + count);
            }.bind(this));
          },
          _decrement: function decrement(units) {
            $.each(units.units, function(unit, count) {
              this._setCount(unit, Math.max(0, (this.getCount(unit) || 0) - count));
            }.bind(this));
          },
          _clear: function clear() {
            this.units = {};
          },
          getCount: function getCount(unit) {
            return this.units[unit];
          },
          getCounts: function getCounts() {
            return this.units;
          },
          getCargoSize: function getCargoSize() {
            var cargoSize = 0;
            $.each(this.units, function addCargoSize(unit, count) {
              cargoSize += Constants.UnitData[unit].cargoSize * count;
            });
            return cargoSize;
          },
        });
        
        function TrainingBatch(type, completionTime, units) {
          this._ikaToolsType = 'trainingBatch';
          
          this.type = type;
          this.units = units;
          this.completionTime = completionTime;
        }
        
        $.extend(TrainingBatch.prototype, {
          getUnits: function getUnits() {
            return this.units;
          },
          getCompletionTime: function getCompletionTime() {
            return this.completionTime;
          },
          _getType: function getType() {
            return this.type;
          },
        });
        
        function City(id, type) {
          this._ikaToolsType = 'city';
          
          if (id) {
            this.id = id;
            this.type = type;
            
            this.level = 0;
    
            this.resources = {
              wood: new City.Resource(this),
              wine: new City.Resource(this),
              marble: new City.Resource(this),
              glass: new City.Resource(this),
              sulfur: new City.Resource(this),
            };
    
            this.buildings = new Array(Constants.GamePlay.BUILDING_SPOTS);
            for (var i = 0; i < Constants.GamePlay.BUILDING_SPOTS; i++) {
              this.buildings[i] = new City.Building(this);
            }
            this.military = new Military();
            
            this.actionPoints = 0;
            this.scientists = 0;
            this.culturalGoods = 0;
            this.priests = 0;
            this.tavernWineLevel = 0;
            this.population = undefined;
            
            this.resourceUpdateTime = 0;
            this.islandCoordinates = undefined;
          }
        }
          
        $.extend(City.prototype, {
          _postLoad: function postLoad() {
            while (this.buildings.length < Constants.GamePlay.BUILDING_SPOTS) {
               this.buildings.push(new City.Building(this));
            }
            for (var i = 0; i < Constants.GamePlay.BUILDING_SPOTS; i++) {
              this.buildings[i]._setCity(this);
            }
            if (this.isOwn()) {
              this.resources[Constants.Resources.WOOD]._setCity(this);
              this.resources[Constants.Resources.WINE]._setCity(this);
              this.resources[Constants.Resources.MARBLE]._setCity(this);
              this.resources[Constants.Resources.GLASS]._setCity(this);
              this.resources[Constants.Resources.SULFUR]._setCity(this);
            }
            this.military._setCity(this);
          },
          _updateFromGlobalData: function _updateFromGlobalData(data, correctWineConsumption) {
            var changes = [];
            this._updateActionPoints(data.maxActionPoints, changes);
            
            if (this.isOwn()) {                
              var wineConsumption = data.wineSpendings;
              var baseWineConsumption = data.wineSpendings;
              
              var winePress = this.getBuildingByType(Constants.Buildings.WINE_PRESS);
              if (correctWineConsumption) {
                if (winePress) {
                  wineConsumption = wineConsumption * (100 - winePress.getLevel()) / 100;
                }
              } else {
                if (winePress) {
                  baseWineConsumption = Math.floor(
                      wineConsumption / (100 - winePress.getLevel()) * 100);
                }
              }
              
              var use = Constants.BuildingData[Constants.Buildings.TAVERN].wineUse;
              for (var i = 0; i < 48; i++) {
                if (use[i] >= baseWineConsumption) {
                  this._updateTavernWineLevel(i, changes);
                  break;
                }
              }
              
              this._updateResources(data.currentResources, 
                                    data.maxResources,
                                    data.resourceProduction,
                                    data.tradegoodProduction,
                                    wineConsumption / Constants.Time.SECONDS_PER_HOUR,
                                    changes);
            }
            
            raiseResourcesChanged(changes);
          },
          _updateFromBackgroundData: function _updateFromBackgroundData(data) {
            this.islandId = parseInt(data.islandId);
            if (this.isOwn()) {
              this._updateBuildings(data.position);
            }
          },
          _updateBuildings: function _updateBuildings(buildingsData) {
            var changes = [];
            for (var i = 0; i < Constants.GamePlay.BUILDING_SPOTS; i++) {
              var building = this.buildings[i];
              if (buildingsData[i]) {
                if (building._update(i, buildingsData[i])) {
                  changes.push({
                    city: this,
                    building: building,
                    type: Constants.BuildingEventType.DATA_REFRESH,
                  });
                }
              }
            }
            this.level = this.buildings[0].getLevel();
            raiseBuildingsChanged(changes);
          },
          _updateResources: function updateResources(
              currentInfo, maxInfo, woodProduction, resourceProduction, wineConsumption,
              changedAccumulator) {
            this._updateResource(Constants.Resources.WOOD, 
                changedAccumulator,
                currentInfo["resource"],
    
                woodProduction);
            this._updateResource(Constants.Resources.WINE,
                changedAccumulator,
                currentInfo["1"],
                this.getTradeGoodType() == Constants.Resources.WINE ? 
                    resourceProduction : undefined,
                wineConsumption);
            this._updateResource(Constants.Resources.MARBLE,
                changedAccumulator,
                currentInfo["2"], 
                this.getTradeGoodType() == Constants.Resources.MARBLE ? 
                    resourceProduction : undefined);
            this._updateResource(Constants.Resources.GLASS,
                changedAccumulator,
                currentInfo["3"], 
                this.getTradeGoodType() == Constants.Resources.GLASS ? 
                    resourceProduction : undefined);
            this._updateResource(Constants.Resources.SULFUR,
                changedAccumulator,
                currentInfo["4"], 
                this.getTradeGoodType() == Constants.Resources.SULFUR ? 
                    resourceProduction : undefined);
            this._updatePopulation(currentInfo.population, changedAccumulator);
            
            this.resourceUpdateTime = View.gameTimeNow();
          },
          _updateResource: function updateResource(
              name, changedAccumulator, current, max, production, consumption) {
            var resource = this.resources[name];
            if (resource._update(current, max, production, consumption)) {
              changedAccumulator.push({
                city: this,
                type: name,
                value: resource,
              });
            }
          },
          _incrementResource: function incrementResource(name, changedAccumulator, delta) {
            var resource = this.resources[name];
            if (delta) {
              resource._increment(delta);
              changedAccumulator.push({
                city: this,
                type: name,
                value: resource,
              });
            }
          },
          _updateActionPoints: function updateActionPoints(actionPoints, changedAccumulator) {
            if (this.actionPoints != actionPoints) {
              changedAccumulator.push({
                city: this,
                type: Constants.Resources.ACTION_POINTS,
                value: actionPoints,
              });
            }
            this.actionPoints = actionPoints;
          },
          _updateActionPointsBy: function updateActionPointsBy(delta, changedAccumulator) {
            this._updateActionPoints(
                Math.max(0, Math.min(this.actionPoints + delta, this.getMaxActionPoints())), 
                changedAccumulator);
          },
          _updateScientists: function updateScientists(scientists, changedAccumulator) {
            if (this.scientists != scientists) {
              changedAccumulator.push({
                city: this,
                type: Constants.Resources.SCIENTISTS,
                value: scientists,
              });
            }
            this.scientists = scientists;
          },
          _updateTavernWineLevel: function updateTavernWineLevel(level, changedAccumulator) {
            if (this.tavernWineLevel != level) {
              changedAccumulator.push({
                city: this,
                type: Constants.Resources.TAVERN_WINE_LEVEL,
                value: level,
              });
            }
            this.tavernWineLevel = level;
          },
          _updateCulturalGoods: function updateCulturalGoods(culturalGoods, changedAccumulator) {
            if (this.culturalGoods != culturalGoods) {
              changedAccumulator.push({
                city: this,
                type: Constants.Resources.CULTURAL_GOODS,
                value: culturalGoods,
              });
            }
            this.culturalGoods = culturalGoods;
          },
          _updatePopulation: function updatePopulation(population, changedAccumulator) {
            if (Math.abs(this.getPopulationData().population - population) >= 1) {
              changedAccumulator.push({
                city: this,
                type: Constants.Resources.POPULATION,
                value: population,
              });
            }
            this.population = population;
          },
          _updatePriests: function updatePriests(priests, changedAccumulator) {
            if (this.priests != priests) {
              changedAccumulator.push({
                city: this,
                type: Constants.Resources.PRIESTS,
                value: priests,
              });
            }
            this.priests = priests;
          },
          
          getLastResourceUpdate: function getLastResourceUpdate() {
            return this.resourceUpdateTime;
          },
          
          getTimeSinceResourceUpdate: function getTimeSinceLastResourceUpdate() {
            return View.gameTimeNow() - this.resourceUpdateTime;
          },
          
          isOwn: function isOwn() {
            return this.type == Constants.CityType.OWN;
          },      
          isDeployment: function isDeployment() {
            return this.type == Constants.CityType.DEPLOYMENT;
          },
          isOccupation: function isOccupation() {
            return this.type == Constants.CityType.OCCUPATION;
          },
          getType: function getType() {
            return this.type;
          },
          
          getBuildingByPosition: function getBuildingByPosition(position) {
            return this.buildings[position];
          },
          getBuildingsByType: function getBuildingsByType(type) {
            return this.buildings.filter(function buildingsFilter(building) {
              return building.getType() == type;
            });
          },
          getBuildingByType: function getBuildingByType(type) {
            for (var i = 0; i < Constants.GamePlay.BUILDING_SPOTS; i++) {
              var building = this.buildings[i];
              if (building && building.getType() == type) {
                return building;
              }
            }
            return null;
          },
          getBuildings: function getBuildings() {
            return this.buildings;
          },
          getMilitary: function getMilitary() {
            return this.military;
          },
          getId: function getId() {
            return this.id;
          },
          getName: function getName() {
            return this.name;
          },
          getIslandId: function getIslandId() {
            return this.islandId;
          },
          getTradeGoodType: function getTradeGoodType() {
            return this.tradeGoodType;
          },
          getActionPoints: function getActionPoints() {
            return this.actionPoints;
          },
          getMaxActionPoints: function getMaxActionPoints() {
            return 3 + Math.floor(this.level / 4) - (this.isOwn() ? 0 : 2);
          },
          getCulturalGoods: function getCulturalGoods() {
            return this.culturalGoods;
          },
          getTavernWineLevel: function getTavernWineLevel() {
            return this.tavernWineLevel;
          },
          getPopulationData: function getPopulationData() {
            var max = 0;
            var happiness = 196;
            
            var townHall = this.getBuildingByType(Constants.Buildings.TOWN_HALL);
            var temple = this.getBuildingByType(Constants.Buildings.TEMPLE);
            var palace = this.getBuildingByType(Constants.Buildings.PALACE);
            var tavern = this.getBuildingByType(Constants.Buildings.TAVERN);
            var museum = this.getBuildingByType(Constants.Buildings.MUSEUM);
            var civData = getCivilizationData();
            
            if (townHall) {
              // Formula from http://ikariam.wikia.com/wiki/Citizen
              max += Math.floor(10 * Math.pow(townHall.getLevel(), 1.5)) * 2 + 40;
    
            }
            
            if (civData.hasResearched(Constants.Research.Economy.HOLIDAY)) {
              max += 50;
              happiness += 25;
            }
            if (civData.hasResearched(Constants.Research.Economy.ECONOMIC_FUTURE)) {
              var level = civData.getResearchLevel(Constants.Research.Economy.ECONOMIC_FUTURE);
              max += 20 * level;
              happiness += 10 * level;
            }
            if (palace) {
              if (civData.hasResearched(Constants.Research.Science.WELL_CONSTRUCTION)) {
                max += 50;
                happiness += 50;
              }
              if (civData.hasResearched(Constants.Research.Economy.UTOPIA)) {
                max += 200;
                happiness += 200;
              }
            }
            
            if (tavern) {
              happiness += Constants.BuildingData.tavern.satisfaction[tavern.getLevel()];//12 * tavern.getLevel();
            }
            happiness += Constants.BuildingData.tavern.maxBonus[tavern.getLevel()];//Constants.GamePlay.HAPPINESS_PER_WINE_SERVING_LEVEL * this.getTavernWineLevel();
            
            if (museum) {
              happiness += Constants.BuildingData.museum.satisfaction[museum.getLevel()];//20 * museum.getLevel();
            }
            happiness += Constants.BuildingData.museum.maxBonus[this.getCulturalGoods()];//Constants.GamePlay.HAPPINESS_PER_CULTURAL_GOOD * this.getCulturalGoods();
            
            var government = civData.getGovernment();
            if (government == Constants.Government.DEMOCRACY) {
              happiness += 75;
            } else if (government == Constants.Government.DICTATORSHIP) {
              happiness -= 75;
            } else if (government == Constants.Government.THEOCRACY) {
              if (temple) {
                happiness += Math.min(150, this.getPriests() * 5 / max * 100 * 2);
              } else {
                happiness -= 20;
              }
            }
            
            happiness = happiness * (1 - this.getCorruption());
            
            var happinessDelta = happiness - this.population;
            var currentPopulation = this.population + 
                happinessDelta * (1 - Math.pow(Math.E, 
                    -(this.getTimeSinceResourceUpdate() / 50 / Constants.Time.MILLIS_PER_HOUR)));
            
            var population = Math.min(currentPopulation, max);
            return {
              population: population,
              max: max,
              happiness: happiness - population,
              growth: max == population && happiness > (population - 1)
                  ? 0 : (happiness - population) / 50,
            };
          },
          getCorruption: function getCorruption() {
            var palace = this.getBuildingByType(Constants.Buildings.GOVERNORS_RESIDENCE) ||
                this.getBuildingByType(Constants.Buildings.PALACE);
            var level = palace ? palace.getLevel() : 0;
            var corruption = 1 - (level + 1) / getOwnCities().length;
            
            var government = getCivilizationData().getGovernment();
            if (government == Constants.Government.ARISTOCRACY || 
                government == Constants.Government.OLIGARCHY) {
              corruption += .03;
            } else if (government == Constants.Government.NOMOCRACY) {
              corruption -= .05;
            } else if (government == Constants.Government.ANARCHY) {
              corruption += .25;
            }
            
            return Math.min(Math.max(corruption, 0), 1);
          },
          getScientists: function getScientists() {
            return this.scientists;
          },
          getResearch: function getResearch() {
            var civData = getCivilizationData();
            var multiplier = 1.0;
            
            multiplier += civData.hasResearched(
                IkaTools.Constants.Research.Science.PAPER) ? .02 : 0;
            multiplier += civData.hasResearched(
                IkaTools.Constants.Research.Science.INK) ? .04 : 0;
            multiplier += civData.hasResearched(
                IkaTools.Constants.Research.Science.MECHANICAL_PEN) ? .08 : 0;
            multiplier += (civData.getResearchLevel(
                IkaTools.Constants.Research.Science.SCIENTIFIC_FUTURE) || 0) * .02;
            multiplier -= this.getCorruption();
            
            return this.scientists * multiplier;
          },
    
          getResource: function getResource(resourceName) {
            return this.resources[resourceName];
          },
          getResourceCapacity: function getResourceMaximumCapacity() {
            var total = 1500;
            var safe = 100;
            
            $.each(this.getBuildingsByType(Constants.Buildings.WAREHOUSE), function(i, building) {
              total += Constants.BuildingData.warehouse.capacity[building.getLevel()]//8000 * building.getLevel();
              safe += 480 * building.getLevel();
            });
            $.each(this.getBuildingsByType(Constants.Buildings.DUMP), function(i, building) {
              total += Constants.BuildingData.dump.capacity[building.getLevel()]//8000 * building.getLevel();
            });
            
            var civilizationData = getCivilizationData();
            if (civilizationData.isPremiumFeatureEnabled(
                Constants.PremiumFeatures.DOUBLED_STORAGE_CAPACITY)) {
              total *= 2;
            }
            if (civilizationData.isPremiumFeatureEnabled(
                Constants.PremiumFeatures.DOUBLED_SAFE_CAPACITY)) {
              safe *= 2;
            }
            
            return {
              maximum: total,
              safe: safe,
            };
          },
          getIslandCoordinates: function getIslandCoordinates() {
            return this.islandCoordinates;
          },
          getLoadingSpeed: function getLoadingSpeed() {
            var speed = 10;
            var ports = this.getBuildingsByType(Constants.Buildings.TRADING_PORT);
            if (ports[0]) {
              speed = Constants.BuildingData[Constants.Buildings.TRADING_PORT]
                  .loadingSpeed[ports[0].getLevel()];
            }
            if (ports[1]) {
              speed += Constants.BuildingData[Constants.Buildings.TRADING_PORT]
                  .loadingSpeed[ports[1].getLevel()];
            }
            return speed / Constants.Time.SECONDS_PER_MINUTE;
          },
          getPriests: function getPriests() {
            return this.priests;
          },
        });
        
        City.Resource = function City_Resource(city) {
          this._ikaToolsType = 'cityResource';
          this._setCity(city);
        }
          
        $.extend(City.Resource.prototype, {
          _setCity: function setCity(city) {
            if (city) {
              this.city = Utils.fixedFunction(city);
            }
          },
          _update: function _update(current, production, consumption) {
            var changed = 
                 Math.abs(current - this.getCurrent()) > 3 || 
                 this.production != production ||
                 this.consumption != consumption;
            
            this.current = current;
            this.production = production;
            this.consumption = consumption;
            
            return changed;
          },
          _increment: function _increment(delta) {
            this.current = Math.max(this.current + delta, 0);
          },
          getCurrent: function getCurrent() {
            if (this.current === undefined) {
              return undefined;
            }
            
            var current = this.current;
            var now = View.gameTimeNow();
            var max = this.city().getResourceCapacity().maximum;
            var lastUpdate = this.city().getLastResourceUpdate();
            
            if (this.production) {
              current += this.production * (now - lastUpdate) / 
                  Constants.Time.MILLIS_PER_SECOND;
            }
            if (this.consumption) {
    
              // Wine use takes place on the hour.
              var startHour = Math.floor(lastUpdate / Constants.Time.MILLIS_PER_HOUR);
              var nowHour = Math.floor(now / Constants.Time.MILLIS_PER_HOUR);
              current -= 
    
                  this.consumption * Constants.Time.SECONDS_PER_HOUR * (nowHour - startHour);
            }
            return Math.max(0, Math.min(max, current));
          },
          
          /**
           * In milliseconds.
           */
          getTimeUntilFull: function getTimeUntilFull() {
            var overallProduction = (this.production || 0) - (this.consumption || 0);
            if (this.current === undefined) {
              return Number.POSITIVE_INFINITY;
            } else {
              var current = this.getCurrent();
              var max = this.city().getResourceCapacity().maximum;
              var production = this.production;
              
              if (overallProduction > 0) {
                var secondsToNextHour = (Constants.Time.MILLIS_PER_HOUR - 
                     (View.gameTimeNow() % Constants.Time.MILLIS_PER_HOUR)) /
                     Constants.Time.MILLIS_PER_SECOND;
                var atNextHour = current + secondsToNextHour * production;
    
                if (atNextHour >= max) {
                  return (max - current) / production * Constants.Time.MILLIS_PER_SECOND;
                } else {
                  var hours = Math.floor(
                      (max - atNextHour) / overallProduction / Constants.Time.SECONDS_PER_HOUR);
                  var atHours = atNextHour + overallProduction * hours * Constants.Time.SECONDS_PER_HOUR;
                  return (secondsToNextHour + 
                          hours * Constants.Time.SECONDS_PER_HOUR + 
                          (max - atHours) / production) * Constants.Time.MILLIS_PER_SECOND;
                }
              } else if (this.current && this.getCurrent() == max) {
                // No production, but filled exactly to capacity
                return 0;
              } else {
                return Number.POSITIVE_INFINITY;
              }
            }
          },
          
          /**
           * In milliseconds.
           */
          getTimeUntilEmpty: function getTimeUntilEmpty() {
            if (this.current === undefined) {
              return Number.POSITIVE_INFINITY;
            } else if (this.consumption) {
              if (this.production > this.consumption) {
                // Could run out in first hour, but nobody is going to run their empire that 
                // way so it's not worth the effort of calculating.
                return Number.POSITIVE_INFINITY;
              } else {
                // Wine use takes place on the hour.
                var current = this.getCurrent();
                var production = this.production || 0;
                
                var secondsToNextHour = (Constants.Time.MILLIS_PER_HOUR - 
                   (View.gameTimeNow() % Constants.Time.MILLIS_PER_HOUR)) / 
                   Constants.Time.MILLIS_PER_SECOND;
                // Compute to end of next hour
                var atNextHour = current - this.consumption * Constants.Time.SECONDS_PER_HOUR + 
                    production * secondsToNextHour;
                if (atNextHour <= 0) {
                  return secondsToNextHour * Constants.Time.MILLIS_PER_SECOND;
                } else {
                  var hourlyDiff = 
                      (this.consumption - production) * Constants.Time.SECONDS_PER_HOUR;
                  return Constants.Time.MILLIS_PER_SECOND * (secondsToNextHour + 
                      Math.ceil(atNextHour / hourlyDiff) * Constants.Time.SECONDS_PER_HOUR);
                }
              }
            }
            return Number.POSITIVE_INFINITY;
          },
          
          getCapacity: function getCapacity() {
            return this.city().getResourceCapacity();
          },
    
          getProduction: function getProduction() {
            return this.production;
          },
          
          getConsumption: function getConsumption() {
            return this.consumption;
          },
        });
    
        City.Building = function City_Building(city) {
          this._ikaToolsType = 'building';
          this._setCity(city);
    
          this.position = null;
          this.type = null;
          this.level = 0;
        }
        
        $.extend(City.Building.prototype, {
          _setCity: function setCity(city) {
            if (city) {
              this.city = Utils.fixedFunction(city);
              this._scheduleUpgradeComplete();
            }
          },
          _update: function _update(position, data) {
            this.position = position;
            var changed = false;
            
            if (data.building.indexOf('buildingGround') >= 0) {
              changed = !this.isEmpty();
              
              this.type = '';
              delete this.level;
              delete this.completionTime;
            } else {
              var type = data.building.split(' ')[0];
              var level = parseInt(data.level);
              var isUpgrading = 'completed' in data;
              
              changed = (type != this.getType() || 
                         level != this.getLevel() || 
                         isUpgrading != this.isUpgrading());
              
              this.type = type;
              this.level = level;
              if (isUpgrading) {
                var completionTime = parseInt(data.completed) * 1000;
                if (this.completionTime != completionTime) {
                  this.completionTime = completionTime;
                  this._scheduleUpgradeComplete();
                }
              } else {
                delete this.completionTime;
              }
            }
    
            return changed;
          },
          _scheduleUpgradeComplete: function _scheduleUpgradeComplete() {
            if (this.upgradeEvent) {
              this.upgradeEvent();
            }
            if (this.completionTime) {
              if (this.completionTime <= View.gameTimeNow()) {
                this.level = this.level + 1;
                delete this.completionTime;
                raiseBuildingsChanged([{
                  city: this.city(),
                  building: this,
                  type: Constants.BuildingEventType.UPGRADE_COMPLETE,
                }]);
              } else {
                this.upgradeEvent = buildingsChangedEvent().scheduleSend(
                    this.type + "->" + (this.level + 1),
                    // 0.5.0 still does a full page refresh if you're viewing the city when the 
                    // building completes.  So we cheat a bit and send this event a few seconds
                    // before it actually takes place so it doesn't get lost as part of a page 
                    // refresh that just sees it as a normal "info_refresh" event.
                    this.completionTime - View.gameTimeNow() + Constants.Time.SAFE_TIME_DELTA,
                    function() {
                      this.level = this.level + 1;
                      delete this.completionTime;
                      empireData.saveAsync();
                    }.bind(this),
                    [{
                      city: this.city(),
                      building: this,
                      type: Constants.BuildingEventType.UPGRADE_COMPLETE,
                    }]);
              }
            }
          },
          getPosition: function getPosition() {
            return this.position;
          },
          isEmpty: function isEmpty() {
            return !this.type;
          },
          getType: function getType() {
            return this.type;
          },
          getLevel: function getLevel() {
            return this.level;
          },
          isUpgrading: function isUpgrading() {
            return (this.completionTime > View.gameTimeNow());
          },
          getRemainingUpgradeTime: function getRemainingUpgradeTime() {
            var diff = this.completionTime - View.gameTimeNow();
            return Math.max(diff, 0);
          },
          getCompletionTime: function getCompletionTime() {
            return new Date(this.completionTime);
          },
          getUpgradeCosts: function getUpgradeCost() {
    
            var city = this.city();
            var civData = getCivilizationData();
            var buildingCostData = Constants.BuildingData[this.getType()];
            var level = this.getLevel() + (this.isUpgrading() ? 1 : 0);
            
            var timeParams = buildingCostData.time;
            var costs = {
              wood: buildingCostData.wood[level] || 0,
              wine: buildingCostData.wine[level] || 0,
              marble: buildingCostData.marble[level] || 0,
              glass: buildingCostData.glass[level] || 0,
              sulfur: buildingCostData.sulfur[level] || 0,
              time: Math.round(timeParams.a / timeParams.b * 
                  Math.pow(timeParams.c, level+1) - timeParams.d) * 1000,
            };
            
            var multiplier = 1.0;
            multiplier -= civData.hasResearched(Constants.Research.Economy.PULLEY) ? .02 : 0;
            multiplier -= civData.hasResearched(Constants.Research.Economy.GEOMETRY) ? .04 : 0;
            multiplier -= civData.hasResearched(Constants.Research.Economy.SPIRIT_LEVEL) ? .08 : 0;
            
            var carpenter = city.getBuildingByType(Constants.Buildings.CARPENTER);
            var winePress = city.getBuildingByType(Constants.Buildings.WINE_PRESS);
            var architect = city.getBuildingByType(Constants.Buildings.ARCHITECT);
            var optician = city.getBuildingByType(Constants.Buildings.OPTICIAN);
            var fireworker = city.getBuildingByType(Constants.Buildings.FIREWORK_TEST_AREA);
            
            
            return {
              wood: costs.wood * (multiplier - (carpenter ? carpenter.getLevel() / 100 : 0)),
              wine: costs.wine * (multiplier - (winePress ? winePress.getLevel() / 100 : 0)),
              marble: costs.marble * (multiplier - (architect ? architect.getLevel() / 100 : 0)),
              glass: costs.glass * (multiplier - (optician ? optician.getLevel() / 100 : 0)),
              sulfur: costs.sulfur * (multiplier - (fireworker ? fireworker.getLevel() / 100 : 0)),
              time: costs.time,
            };
          },
          isMaxLevel: function isMaxLevel() {
            return (this.getLevel() + (this.isUpgrading() ? 1 : 0)) >= 
                Constants.BuildingData[this.getType()].maxLevel;
          },
        });
        
        CivilizationData = function CivilizationData() {
          this._ikaToolsType = 'civilizationData';
    
          this.research = {};
          this.government = 'ikakratie';
          this.movements = {};
          this.premiumFeatures = {};
        }
        
        $.extend(CivilizationData.prototype, {
          _startMovementTimers: function _startMovementTimers() {
            $.each(this.movements, function updateMovementsOnLoad(id, movement) {
              if (movement._updateAndStartTimer()) {
                delete this.movements[id];
              }
            }.bind(this));
          },
          _updateGovernment: function updateGovernment(government, changedAccumulator) {
            if (this.government != government) {
              changedAccumulator.push({
                type: Constants.CivilizationData.GOVERNMENT,
                government: government,
              });
    
            }
            this.government = government;
          },
          _updateResearch: function updateResearch(researchId, level, changedAccumulator) {
            var oldResearch = this.research[researchId];
            if (!oldResearch || oldResearch.level != level) {
              changedAccumulator.push({
                type: Constants.CivilizationData.RESEARCH,
                id: researchId,
                level: level,
              });
            }
            this.research[researchId] = { level: level };
          },
          _updateMovement: function updateMovement(movement, changedAccumulator) {
            var existing = this.movements[movement.getId()];
            if (existing) {
              existing._cancelTimer();
            }
            this.movements[movement.getId()] = movement;
            movement._updateAndStartTimer();
            if (!existing || (movement.getCompletionTime() != existing.getCompletionTime())) {
              changedAccumulator.push({
                movement: movement,
                type: Constants.Movements.EventType.DATA_UPDATED,
              });
            }
          },
          _removeMovement: function removeMovement(movementId, changedAccumulator) {
            var movement = this.movements[movementId];
            if (movement) {
              if (movement.stage == Constants.Movements.Stage.LOADING && movementId >= 0) {
                var originCity = movement.getOriginCity();
                movement._updateCity(originCity, originCity);
              }
              movement._cancelTimer();
              delete this.movements[movementId];
              changedAccumulator.push({
                movement: movement,
                type: Constants.Movements.EventType.CANCELLED,
              });
            }
          },
          _updatePremiumFeature: function updatePremiumFeature(
              changedAccumulator, feature, enabled) {
            var currentlyEnabled = this.premiumFeatures[feature] || false;
            if (currentlyEnabled != enabled) {
              changedAccumulator.push({
                type: Constants.CivilizationData.PREMIUM_FEATURE,
                feature: feature,
                enabled: enabled,
              });
            }
            this.premiumFeatures[feature] = enabled;        
          },
          hasResearched: function hasResearched(researchId) {
            var research = this.research[researchId];
            return research ? research.level > 0 : undefined;
          },
          getResearchLevel: function getResearchLevel(researchId) {
            var research = this.research[researchId];
            return research ? research.level : undefined;
          },
          getGovernment: function getGovernment() {
            return this.government;
          },
          getMovements: function getMovements() {
            var movements = [];
            $.each(this.movements, function(id, movement) {
              movements.push(movement);
            });
            movements.sort(function compareMovements(m1, m2) {
              return m1.getArrivalTime() - m2.getArrivalTime();
            });
            return movements;
          },
          getMovement: function getMovement(movementId) {
            return this.movements[movementId];
          },
          isPremiumFeatureEnabled: function isPremiumFeatureEnabled(feature) {
            return this.premiumFeatures[feature];
          },
        });
        
        function calculateTravelTime(island1Coords, island2Coords, units, transporters) {
          // same island
          if (island1Coords[0] == island2Coords[0] && 
              island1Coords[1] == island2Coords[1]) {
            var baseTime = 10 * Constants.Time.MILLIS_PER_MINUTE;
            var multiplier = transporters ? 60 : 80; // fastest unit
            if (units) {
              $.each(units.getCounts(), function applyUnitSpeed(type, count) {
                if (count) {
                  var data = Constants.UnitData[type];
                  multiplier = Math.min(multiplier, data.speed);
                }
              });
            }
            return baseTime * 60 / multiplier;
          } else {
            var baseTime = 20 * Math.sqrt(Math.pow(island1Coords[0] - island2Coords[0], 2) + 
                                          Math.pow(island1Coords[1] - island2Coords[1], 2)) *
                           Constants.Time.MILLIS_PER_MINUTE;
            var multiplier = 60; // fastest ship
            if (units) {
              $.each(units.getCounts(), function applyUnitSpeed(type, count) {
                if (count) {
                  var data = Constants.UnitData[type];
                  if (!data.isArmy) {
                    multiplier = Math.min(multiplier, data.speed);
                  }
                }
              });
            }
            return baseTime * 60 / multiplier;
          }
        }
        
        function Movement(
            id, type, completionTime, mission, stage, originCityId, targetCityId,
            transports, units, resources, transportTime) {
          this._ikaToolsType = 'movement';
          
          if (id) {
            this.id = id;
            this.completionTime = completionTime;
            this.mission = mission;
            this.stage = stage;
            this.originCityId = originCityId;
            this.targetCityId = targetCityId;
            this.units = units;
            this.transports = transports;
            this.resources = resources;
    
            this.transportTime = transportTime;
    
            this.type = type;
            
            var originCity = this.getOriginCity();
            var targetCity = this.getTargetCity();
    
            if (originCity && targetCity) {
              var originCoords = originCity.getIslandCoordinates();
              var targetCoords = targetCity.getIslandCoordinates();
    
              if (originCoords && targetCoords) {
                this.transportTime = calculateTravelTime(
                    originCoords, targetCoords, this.units, this.transports);
              }
            }
            
            if (!this.transportTime) {
              this.transportTime = Number.POSITIVE_INFINITY;
            }
            
            if (this.completionTime <= new Date().getTime()) {
              this._toNextStage();
            }
          }
        }
        
        $.extend(Movement.prototype, {
          _cancelTimer: function cancelTimer() {
            if (this.completionEvent) {
              this.completionEvent();
            }
          },
          _startTimer: function startTimer() {
            var remainingTime = this.getTimeRemaining();
            if (isFinite(remainingTime)) {
              this.completionEvent = movementsChangedEvent().scheduleSend(
                  'Movement[' + this.id + ']',
                  remainingTime + Constants.Time.SAFE_TIME_DELTA,
                  function moveToNextStage() {
                    if (this._toNextStage()) {
                      getCivilizationData()._removeMovement(this.id, []);
                    }
                    empireData.saveAsync();
                  }.bind(this),
                  [{
                    previousStage: this.getStage(),
                    movement: this,
                    type: this._isFinalStage() ? 
                        Constants.Movements.EventType.COMPLETED :
                        Constants.Movements.EventType.STAGE_CHANGED,
                  }]);
            }
          },
          _updateCity: function updateCity(city, originCity) {
            var resourceChanges = [];
            if (city) {
              if (originCity) {
                originCity._updateActionPointsBy(1, resourceChanges);
              }
              if (city.isOwn() && 
                  (this.mission == Constants.Movements.Mission.TRANSPORT ||
                   this.mission == Constants.Movements.Mission.PLUNDER)) {
                $.each(this.resources, function updateCityResource(name, value) {
                  city._incrementResource(name, resourceChanges, value);
                });
              }
              raiseResourcesChanged(resourceChanges);
              
              if (this.mission == Constants.Movements.Mission.DEPLOY_ARMY ||
                  this.mission == Constants.Movements.Mission.DEPLOY_NAVY) {
                var military = city.getMilitary();
                military._increment(this.units);
                raiseMilitaryChanged([{
                  military: military,
                  city: city,
                  type: 'deployment_arrived',
                }]);
              }
            }
          },
          _updateAndStartTimer: function updateAndStartTimer() {
            this._cancelTimer();
            
            if (this.completionTime <= View.gameTimeNow()) {
              return this._toNextStage();
            } else {
              this._startTimer();
            }
          },
          _toNextStage: function toNextStage() {
            var isFinalStage = this._isFinalStage();
            if (this.stage == Constants.Movements.Stage.LOADING) {
              this.stage = Constants.Movements.Stage.EN_ROUTE;
              this.completionTime += this.transportTime;
              this._startTimer();
            } else if (this.stage == Constants.Movements.Stage.EN_ROUTE) {
              if (isFinalStage) {
                this._updateCity(this.getTargetCity(), this.getOriginCity());
              }
            } else if (this.stage == Constants.Movements.Stage.RETURNING) {
              if (isFinalStage) {
                var originCity = this.getOriginCity();
                this._updateCity(originCity, originCity);
              }
            }
            return isFinalStage;
          },
          _isFinalStage: function isFinalStage() {
            if (this.stage == Constants.Movements.Stage.LOADING) {
              return false;
            } else if (this.stage == Constants.Movements.Stage.EN_ROUTE) {
              if (this.mission == Constants.Movements.Mission.TRANSPORT) {
                var city = getCity(this.targetCityId);
                return city && city.isOwn();
              } else if (this.mission == Constants.Movements.Mission.DEPLOY_ARMY ||
                         this.mission == Constants.Movements.Mission.DEPLOY_NAVY) {
                return true;
              }
            } else {
              return true;
            }
          },
          getId: function getId() {
            return this.id;
          },
          getMission: function getMission() {
            return this.mission;
          },
          getStage: function getStage() {
            return this.stage;
          },
          getOriginCityId: function getOriginCityId() {
            return this.originCityId;
          },
          getTargetCityId: function getTargetCityId() {
            return this.targetCityId;
          },
          getOriginCity: function getOriginCity() {
            return this.originCityId && getCity(this.originCityId);
          },
          getTargetCity: function getTargetCity() {
            return this.targetCityId && getCity(this.targetCityId);
          },
          getCompletionTime: function getCompletionTime() {
            return this.completionTime;
          },
          getTimeRemaining: function getTimeRemaining() {
            return this.completionTime - View.gameTimeNow();
          },
          getArrivalTime: function() {
            var time = this.getCompletionTime();
            if (this.stage == Constants.Movements.Stage.LOADING) {
              time += this.transportTime;
            }
            return time;
          },        
          getUnits: function getUnits() {
            return this.units;
          },
          getResource: function getResource(resourceName) {
            return this.resources[resourceName];
          },
          isHostile: function isHostile() {
            return this.type.indexOf('hostile') >= 0;
          },
          isOwn: function isOwn() {
            return this.type.indexOf('own') >= 0;
          }
        });
        
        var empireData = new Data.Value(
            'empireData', 
    
            { 
              cities: {}, 
              cityOrder: [],
              civilizationData: new CivilizationData(),
            }, 
            {
              reviver: function empireDataReviver(key, value) {
                if (value && value._ikaToolsType) {
                  var obj;
                  switch(value._ikaToolsType) {
                    case 'city': obj = new City(); break;
                    case 'building': obj = new City.Building; break;
                    case 'cityResource': obj = new City.Resource(); break;
                    case 'military': obj = new Military(); break;
                    case 'militaryUnits': obj = new MilitaryUnits(); break;
                    case 'trainingBatch': obj = new TrainingBatch(); break;
                    case 'civilizationData': obj = new CivilizationData(); break;
                    case 'movement': obj = new Movement(); break;
                  }
                  $.extend(obj, value);
                  if (obj._postLoad) {
                    obj._postLoad();
                  }
                  return obj;
                }
                return value;
              },
              version: 28,
              loadCallback: function empireDataLoaded() {
                getCivilizationData()._startMovementTimers();
              },
            });
            
        function raiseCivilizationDataChanged(changes) {
          if (changes.length) {
            civilizationDataChangedEvent().send(changes);
          }
        }
    
        var civilizationDataChangedEvent = Utils.thunk(function() {
          return new Utils.EventDispatcher();
        });
            
        function registerCivilizationDataChangedHandler(callback) {
          return civilizationDataChangedEvent().addListener(callback);
        }
        
        function raiseMovementsChanged(changes) {
          if (changes.length) {
            movementsChangedEvent().send(changes);
          }
        }
        
        var movementsChangedEvent = Utils.thunk(function() {
          return new Utils.EventDispatcher();
        });
        
        function registerMovementsChangedHandler(callback) {
          return movementsChangedEvent().addListener(callback);
        }
    
        function raiseResourcesChanged(changes) {
          if (changes.length) {
            resourcesChangedEvent().send(changes);
          }
        }
            
        var resourcesChangedEvent = Utils.thunk(function() {
          return new Utils.EventDispatcher();
        });
        
        function registerResourcesChangedHandler(callback) {
          return resourcesChangedEvent().addListener(callback);
        }
            
        var buildingsChangedEvent = Utils.thunk(function() {
          var dispatcher = new Utils.EventDispatcher();
          return dispatcher;
        });
        
        function raiseBuildingsChanged(changes) {
          if (changes.length) {
            buildingsChangedEvent().send(changes);
          }
        }
            
        function registerBuildingsChangedHandler(callback) {
          return buildingsChangedEvent().addListener(callback);
        }
        
        var militaryChangedEvent = Utils.thunk(function() {
          var dispatcher = new Utils.EventDispatcher();
          return dispatcher;
        });
        
        function raiseMilitaryChanged(changes) {
          if (changes.length) {
            militaryChangedEvent().send(changes);
          }
        }
        
        function registerMilitaryChangedHandler(callback) {
          return militaryChangedEvent().addListener(callback);
        };
    
        var TRADE_GOOD_LOOKUP = {
          "1": Constants.Resources.WINE,
          "2": Constants.Resources.MARBLE,
          "3": Constants.Resources.GLASS,
          "4": Constants.Resources.SULFUR,
        };
        
        function getCity(id) {
          return empireData.get().cities[id];
        };
        
        var coordsRegex = /\[(\d+):(\d+)\]/;
        function parseCoordinates(coords) {
          var match = coords.match(coordsRegex);
          return [parseInt(match[1]), parseInt(match[2])];
        }
        
        function processTransportForm(form) {
          var city = View.getCurrentCity();
          
          var transports = parseInt($('#transporterCount').val()) || 0;
          var resources = {};
          resources[Constants.Resources.WOOD] = 
              parseInt($('#textfield_wood').val()) || 0;
          resources[Constants.Resources.WINE] = 
              parseInt($('#textfield_wine').val()) || 0;
          resources[Constants.Resources.MARBLE] = 
              parseInt($('#textfield_marble').val()) || 0;
          resources[Constants.Resources.GLASS] = 
              parseInt($('#textfield_glass').val()) || 0;
          resources[Constants.Resources.SULFUR] = 
              parseInt($('#textfield_sulfur').val()) || 0;
          if ($('#createColony').length) {
            resources[Constants.Resources.WOOD] += 1250;
          }
              
          var destinationCityId = parseInt($(form.elements['destinationCityId']).val());
              
          var totalResources = 
              resources[Constants.Resources.WOOD] + 
              resources[Constants.Resources.WINE] + 
              resources[Constants.Resources.MARBLE] + 
              resources[Constants.Resources.GLASS] + 
              resources[Constants.Resources.SULFUR];
              
          var loadingCompletion = View.gameTimeNow() + 
              (totalResources / city.getLoadingSpeed() * Constants.Time.MILLIS_PER_SECOND);
    
          var movement = new Movement(
              -(new Date().getTime()),
              'own', 
              loadingCompletion, //TODO: multiple loads from same town (if own) stack
              Constants.Movements.Mission.TRANSPORT, 
              Constants.Movements.Stage.LOADING, 
              city.getId(),
              destinationCityId,
              transports, 
              new MilitaryUnits(), 
              resources
              // TODO: transport time for towns other than one's that are tracked
              );
          
          View.registerNextIkariamAjaxRequestCallback(function saveTransportData(response) {
            Utils.iterateIkariamAjaxResponse(response, 
                function lookForSuccessFeedback(index, name, data) {
                  if (name == Constants.IkariamAjaxResponseType.PROVIDE_FEEDBACK &&
                      data[0].type == 10) {
                    var changes = [];
                    getCivilizationData()._updateMovement(movement, changes);
                    raiseMovementsChanged(changes);
                  }
                });
          });
        }
        
        function coordinatesEqual(coordinates1, coordinates2) {
          if (!coordinates1 || !coordinates2) {
            return false;
          }
          return coordinates1[0] == coordinates2[0] && 
              coordinates1[1] == coordinates2[1];
        }
        
        function processDeploymentForm(form) {
          var city = View.getCurrentCity();
          
          var transports = parseInt($('#transporterCount').html()) || 0;
          var mission = $(form.elements['function']).val() == 'deployArmy' ?
              Constants.Movements.Mission.DEPLOY_ARMY : Constants.Movements.Mission.DEPLOY_NAVY;
          var destinationCityId = parseInt($(form.elements['destinationCityId']).val());
          var destinationCity = getCity(destinationCityId);
          
          var units = new MilitaryUnits();
          
          $.each(Constants.UnitIds, function countDeployingUnits(id, type) {
            var elementId;
            if (Constants.UnitData[type].isArmy) {
              elementId = '#cargo_army_' + id;
            } else {
              elementId = '#cargo_fleet_' + id;
            }
            units._setCount(type, parseInt($(elementId).val()) || 0);
          });
          
          var cargoSize = units.getCargoSize();
          var loadingCompletion = new Date().getTime() + 
              (units.getCargoSize() / city.getLoadingSpeed() * Constants.Time.MILLIS_PER_SECOND);
    
          if (destinationCity && 
              coordinatesEqual(destinationCity.getIslandCoordinates(), 
                               city.getIslandCoordinates())) {
            loadingCompletion = new Date().getTime();
          }
          
          var movement = new Movement(
              -(new Date().getTime()),
              'own', 
              loadingCompletion, //TODO: multiple loads from same town (if own) stack
              mission, 
              Constants.Movements.Stage.LOADING, 
              city.getId(),
              destinationCityId,
              transports, 
              units, 
              {}
              // TODO: transport time for towns other than one's that are tracked
              );
          
          View.registerNextIkariamAjaxRequestCallback(function saveDeploymentData(response) {
              Utils.iterateIkariamAjaxResponse(response, 
                  function lookForSuccessFeedback(index, name, data) {
                    if (name == Constants.IkariamAjaxResponseType.PROVIDE_FEEDBACK &&
                        data[0].type == 10) {
                      var military = city.getMilitary();
                      military._decrement(units);
                      raiseMilitaryChanged([{
                        military: military,
                        city: city,
                        type: 'movement_started',
                      }]);
                      
                      var changes = [];
                      getCivilizationData()._updateMovement(movement, changes);
                      raiseMovementsChanged(changes);
                    }
                  });
          });
        }
        
        function processPlunderForm(form) {
          var city = View.getCurrentCity();
          var transports = parseInt($('#transporterCount').html()) || 0;
          var destinationCityId = parseInt($(form.elements['destinationCityId']).val());
          var destinationCity = getCity(destinationCityId);
          
          var units = new MilitaryUnits();
          $.each(Constants.UnitIds, function countDeployingUnits(id, type) {
            units._setCount(type, parseInt($('#cargo_army_' + id).val()) || 0);
          });
          
          var cargoSize = units.getCargoSize();
          var loadingCompletion = new Date().getTime() + 
              (units.getCargoSize() / city.getLoadingSpeed() * Constants.Time.MILLIS_PER_SECOND);
          if (destinationCity && 
              coordinatesEqual(destinationCity.getIslandCoordinates(), 
                               city.getIslandCoordinates())) {
            loadingCompletion = new Date().getTime();
          }
          
          var movement = new Movement(
              -(new Date().getTime()),
              'own', 
              loadingCompletion, //TODO: multiple loads from same town (if own) stack
              Constants.Movements.Mission.PLUNDER, 
              Constants.Movements.Stage.LOADING, 
              city.getId(),
              destinationCityId,
              transports, 
              units, 
              {}
              // TODO: transport time for towns other than one's that are tracked
              );
              
          View.registerNextIkariamAjaxRequestCallback(function savePlunderData(response) {
              Utils.iterateIkariamAjaxResponse(response, 
                  function lookForSuccessFeedback(index, name, data) {
                    if (name == Constants.IkariamAjaxResponseType.PROVIDE_FEEDBACK &&
                        data[0].type == 10) {
                      var military = city.getMilitary();
                      military._decrement(units);
                      raiseMilitaryChanged([{
                        military: military,
                        city: city,
                        type: 'movement_started',
                      }]);
                      
                      var changes = [];
                      getCivilizationData()._updateMovement(movement, changes);
                      raiseMovementsChanged(changes);
                    }
                  });
          });
        }
        
        function processCityMilitaryView(data) {
          var city = View.getCurrentCity();
          var military = city.getMilitary();
          
          var armyTds = $('#tabUnits').find('tr.count td');
          var e = false;
          e |= military._updatePresent(Constants.Military.HOPLITE, parseInt(armyTds[0].innerHTML));
          e |= military._updatePresent(Constants.Military.STEAM_GIANT, parseInt(armyTds[1].innerHTML));
          e |= military._updatePresent(Constants.Military.SPEARMAN, parseInt(armyTds[2].innerHTML));
          e |= military._updatePresent(Constants.Military.SWORDSMAN, parseInt(armyTds[3].innerHTML));
          e |= military._updatePresent(Constants.Military.SLINGER, parseInt(armyTds[4].innerHTML));
          e |= military._updatePresent(Constants.Military.ARCHER, parseInt(armyTds[5].innerHTML));
          e |= military._updatePresent(Constants.Military.GUNNER, parseInt(armyTds[6].innerHTML));
          e |= military._updatePresent(Constants.Military.BATTERING_RAM, parseInt(armyTds[7].innerHTML));
          e |= military._updatePresent(Constants.Military.CATAPULT, parseInt(armyTds[8].innerHTML));
          e |= military._updatePresent(Constants.Military.MORTAR, parseInt(armyTds[9].innerHTML));
          e |= military._updatePresent(Constants.Military.GYROCOPTER, parseInt(armyTds[10].innerHTML));
          e |= military._updatePresent(Constants.Military.BALLOON_BOMBADIER, parseInt(armyTds[11].innerHTML));
          e |= military._updatePresent(Constants.Military.COOK, parseInt(armyTds[12].innerHTML));
          e |= military._updatePresent(Constants.Military.DOCTOR, parseInt(armyTds[13].innerHTML));
    
          var navyTds = $('#tabShips').find('tr.count td');        
          e |= military._updatePresent(Constants.Military.RAM_SHIP, parseInt(navyTds[2].innerHTML));
          e |= military._updatePresent(Constants.Military.FLAME_THROWER, parseInt(navyTds[0].innerHTML));
          e |= military._updatePresent(Constants.Military.STEAM_RAM, parseInt(navyTds[1].innerHTML));
          e |= military._updatePresent(Constants.Military.BALLISTA_SHIP, parseInt(navyTds[4].innerHTML));
          e |= military._updatePresent(Constants.Military.CATAPULT_SHIP, parseInt(navyTds[3].innerHTML));
          e |= military._updatePresent(Constants.Military.MORTAR_SHIP, parseInt(navyTds[5].innerHTML));
          e |= military._updatePresent(Constants.Military.SUBMARINE, parseInt(navyTds[7].innerHTML));
          e |= military._updatePresent(Constants.Military.PADDLE_SPEED_SHIP, parseInt(navyTds[8].innerHTML));
          e |= military._updatePresent(Constants.Military.BALLOON_CARRIER, parseInt(navyTds[9].innerHTML));
          e |= military._updatePresent(Constants.Military.TENDER, parseInt(navyTds[10].innerHTML));
          e |= military._updatePresent(Constants.Military.ROCKET_SHIP, parseInt(navyTds[6].innerHTML));
          
          military._markPresentUpdated();
          
          if (e) {
            raiseMilitaryChanged([{ 
              city: city,
              military: military,
              type: 'data_updated',
            }]);
          }
        }
        
        function processRelatedCitiesView(data) {
          var city = View.getCurrentCity();
          var military = city.getMilitary();
          military._clear();
          
          var changed = false;
          
          var info = $('#relatedCities .contentBox01h:eq(0)');
          
          var whitespace = /\s+/;
          
          info.find('.troops .armybutton').each(function(i, element) {
            var type = element.className.split(whitespace)[1];
            changed |= military._updatePresent(type, parseInt(element.innerHTML));
          });
          info.find('.troops .fleetbutton').each(function(i, element) {
            var type = element.className.split(whitespace)[1];
            changed |= military._updatePresent(type, parseInt(element.innerHTML));
          });
    
          military._markPresentUpdated();
          
          if (changed) {
            raiseMilitaryChanged([{ 
              city: city,
              military: military,
              type: 'data_updated',
            }]);
          }
        }
        
        function parseMilitaryUnitsFromPending(container) {
          var idRegex = /\d+/;
          var units = new MilitaryUnits();
          
          container.children('.army_wrapper').each(function(index, unitNode) {
            var unitNode = $(unitNode);
            var type = Constants.UnitIds[
                parseInt(unitNode.find('.army').attr('class').match(idRegex)[0])];
            var count = parseInt(unitNode.find('.unitcounttextlabel').html());
            units._setCount(type, count);
          });
          return units;
        }
        
        function parseTrainingBatches(viewHtmlText, type, buildingLevel) {
          var trainingBatches = [];
          var constructionList = $('#unitConstructionList');
          if (constructionList.length) {
            var completionTime = parseInt(viewHtmlText.match(
                /showUnitCountdown.'buildCountDown', 'buildProgress', (\d+)/)[1]) * 1000;
            trainingBatches.push(new TrainingBatch(type,
                completionTime, parseMilitaryUnitsFromPending(constructionList)));
    
            constructionList.children('.constructionBlock').each(function() {
              var units = parseMilitaryUnitsFromPending($(this));
              completionTime += computeTrainingTime(buildingLevel, units);
              trainingBatches.push(new TrainingBatch(type, completionTime, units));
            });
          }
          return trainingBatches;
        }
        
        function computeTrainingTime(barracksLevel, units) {
          var time = 0;
          $.each(units.getCounts(), function(type, count) {
            var data = Constants.UnitData[type];
            time += count * Math.pow(0.95, barracksLevel - data.minimumBuildingLevelToBuild) * 
                data.baseBuildTime;
          });
          return time * Constants.Time.MILLIS_PER_SECOND;
        }
        
        function processBarracksView(viewHtmlText, data) {
          var city = View.getCurrentCity();
          var military = city.getMilitary();
          var barracks = city.getBuildingByType(Constants.Buildings.BARRACKS);
          
          var changed = false;
          
          function update(type, dataName) {
            if (data[dataName]) {
              changed = military._updatePresent(type, parseInt(data[dataName].text));
            }
          }
          
          update(Constants.Military.HOPLITE, 'js_barracksUnitUnitsAvailable1');
          update(Constants.Military.STEAM_GIANT, 'js_barracksUnitUnitsAvailable2');
          update(Constants.Military.SPEARMAN, 'js_barracksUnitUnitsAvailable3');
          update(Constants.Military.SWORDSMAN, 'js_barracksUnitUnitsAvailable4');
          update(Constants.Military.SLINGER, 'js_barracksUnitUnitsAvailable5');
          update(Constants.Military.ARCHER, 'js_barracksUnitUnitsAvailable6');
          update(Constants.Military.GUNNER, 'js_barracksUnitUnitsAvailable7');
          update(Constants.Military.BATTERING_RAM, 'js_barracksUnitUnitsAvailable8');
          update(Constants.Military.CATAPULT, 'js_barracksUnitUnitsAvailable9');
          update(Constants.Military.MORTAR, 'js_barracksUnitUnitsAvailable10');
          update(Constants.Military.GYROCOPTER, 'js_barracksUnitUnitsAvailable11');
          update(Constants.Military.BALLOON_BOMBADIER, 'js_barracksUnitUnitsAvailable12');
          update(Constants.Military.COOK, 'js_barracksUnitUnitsAvailable13');
          update(Constants.Military.DOCTOR, 'js_barracksUnitUnitsAvailable14');
              
          military._markPresentUpdated(true, false);
    
          military._setArmyTrainingBatches( 
              parseTrainingBatches(viewHtmlText, Constants.Military.ARMY, barracks.getLevel()));
    
          raiseMilitaryChanged([{ 
            city: city,
            military: military,
            type: 'data_updated',
          }]);
        }
        
        function processShipyardView(viewHtmlText, data) {
          var city = View.getCurrentCity();
          var military = city.getMilitary();
          var shipyard = city.getBuildingByType(Constants.Buildings.SHIPYARD);
          
          var change = false;
          function update(type, dataName) {
            if (data[dataName]) {
              changed = military._updatePresent(type, parseInt(data[dataName].text));
            }
          }
          update(Constants.Military.FLAME_THROWER, 'js_barracksUnitUnitsAvailable1');
          update(Constants.Military.STEAM_RAM, 'js_barracksUnitUnitsAvailable2');
          update(Constants.Military.RAM_SHIP, 'js_barracksUnitUnitsAvailable3');
          update(Constants.Military.CATAPULT_SHIP, 'js_barracksUnitUnitsAvailable4');
          update(Constants.Military.BALLISTA_SHIP, 'js_barracksUnitUnitsAvailable5');
          update(Constants.Military.MORTAR_SHIP, 'js_barracksUnitUnitsAvailable6');
          update(Constants.Military.ROCKET_SHIP, 'js_barracksUnitUnitsAvailable7');
          update(Constants.Military.SUBMARINE, 'js_barracksUnitUnitsAvailable8');
          update(Constants.Military.PADDLE_SPEED_SHIP, 'js_barracksUnitUnitsAvailable9');
          update(Constants.Military.BALLOON_CARRIER, 'js_barracksUnitUnitsAvailable10');
          update(Constants.Military.TENDER, 'js_barracksUnitUnitsAvailable11');
          
          military._markPresentUpdated(false, true);
          
          military._setNavyTrainingBatches( 
              parseTrainingBatches(viewHtmlText, Constants.Military.NAVY, shipyard.getLevel()));
              
          raiseMilitaryChanged([{ 
            city: city,
            military: military,
            type: 'data_updated',
          }]);
        }
          
        function processAcademyView(data) {
          var changes = [];
          View.getCurrentCity()._updateScientists(
              parseInt(data['js_academy_research_tooltip_basic_production'].text),
              changes);
          raiseResourcesChanged(changes);
        }
        
        function processSetScientistsForm(form) {
          var scientists = parseInt($('#inputScientists').val());
          
          View.registerNextIkariamAjaxRequestCallback(function saveScientstsData(response) {
            Utils.iterateIkariamAjaxResponse(response, 
                function lookForSuccessFeedback(index, name, data) {
                  if (name == Constants.IkariamAjaxResponseType.PROVIDE_FEEDBACK &&
                      data[0].type == 10) {
                    var changes = [];
                    View.getCurrentCity()._updateScientists(scientists, changes);
                    raiseResourcesChanged(changes);
                  }
                });
          });
        }
        
        function processPalaceView(data) {
          var changes = [];
          getCivilizationData()._updateGovernment( 
              $('.government_pic img').attr('src').slice(16, -8), changes);
          raiseCivilizationDataChanged(changes);
        }
                
        function processMuseumView(data) {
          var changes = [];
          View.getCurrentCity()._updateCulturalGoods(
             parseInt(/\d+/.exec($('#val_culturalGoodsDeposit').parent().text())[0]), 
             changes);
          raiseResourcesChanged(changes);
        }
                
        function processCulturalPossessionsAssignView(data) {
          // Have to delay this because the script elements in the changed view 
          // need to run before we can access the cultural good information.  
          // There is no feasible way to extract the data at this point.
          setTimeout(function() {
            var cityIdRegex = /textfield_city_(\d+)/
            var changes = [];
            $('#moveCulturalGoods ul li input').each(function (index, item) {
              item = $(item);
    
              var city = getCity(
                  parseInt(cityIdRegex.exec(item.attr('id'))[1]));
              city._updateCulturalGoods(parseInt(item.val()), changes);
            });
            raiseResourcesChanged(changes);
            empireData.saveAsync();
          }, 0);
        }
                
        function processTownHallView(data) {
          var changes = [];
          var city = View.getCurrentCity();
          city._updatePriests(
             parseInt(data['js_TownHallPopulationGraphPriestCount'].text), changes);
          city._updateCulturalGoods(
             parseInt(
                 data['js_TownHallSatisfactionOverviewCultureBoniTreatyBonusValue'].text) / 50, 
             changes);
          city._updateTavernWineLevel(
              parseInt(data['js_TownHallSatisfactionOverviewWineBoniServeBonusValue'].text) / 60,
              changes);
          raiseResourcesChanged(changes);
        }
                
        function processTempleView(data) {
          var changes = [];
          View.getCurrentCity()._updatePriests(
              parseInt(data['js_TempleSlider'].slider.ini_value), changes);
          raiseResourcesChanged(changes);
        }
                
        function processResearchAdvisorView(data) {
          var civData = getCivilizationData();
          var idRegex = /researchId=([0-9]+)/i
          var levelRegex = /\((\d+)\)/;
    
          var researches = 
              JSON.parse(data['new_js_params'] || data['load_js'].params).currResearchType;
    
          var changes = [];
          $.each(researches, function (name, researchData) {
            var id = parseInt(idRegex.exec(researchData.aHref)[1]);
            var levelMatch = levelRegex.exec(name);
            var level = levelMatch 
                ? parseInt(levelMatch[1]) - 1
                : (researchData.liClass == 'explored' ? 1 : 0);
    
            civData._updateResearch(id, level, changes);
          });
          raiseCivilizationDataChanged(changes);
        }
        
        function processFinancesView(data) {
          var cities = getOwnCities();
          var scientistCost = 6;
          if (getCivilizationData().hasResearched(Constants.Research.Science.LETTER_CHUTE)) {
            scientistCost = 3;
          }
    
          var changes = []
          $('#finances .table01:eq(1) tr').slice(1, -1).each(function(index, row) {
            var tds = $(row).children('td');
            var city = cities[index];
            if ($(tds[0]).text() == city.getName()) {
              city._updateScientists(
                  Math.round(-parseInt($(tds[2]).text().replace(',', '')) / scientistCost), changes);
            }
          });
          raiseResourcesChanged(changes);
        }
        
        function processMilitaryAdvisorView(data) {
          var civilizationData = getCivilizationData();
          var movementIds = {};
          
          var changes = [];
          
          $.each(civilizationData.getMovements(), function(index, movement) {
            movementIds[movement.getId()] = movement;
          });
          
          var movementMainValueRegex = /^js_MilitaryMovementsEventRow(\d+)$/;
          var cityIdRegex = /cityId=(\d+)/;
          $.each(data, function(key, value) {
            var match = movementMainValueRegex.exec(key);
            if (match /*&& value.class.indexOf('own') > 0*/) {
              var movementId = parseInt(match[1]);
              delete movementIds[movementId];
    
              var type = value.class;
              var completionTime = 
                  data['js_MilitaryMovementsEventRow' + movementId + 'ArrivalTime']
                      .countdown.enddate * Constants.Time.MILLIS_PER_SECOND;
              var originCityId = parseInt(
                  data['js_MilitaryMovementsEventRow' + movementId + 'OriginLink'].href
                      .match(cityIdRegex)[1]);
              var targetCityId = data['js_MilitaryMovementsEventRow' + movementId + 'TargetLink'].href
                  ? parseInt(data['js_MilitaryMovementsEventRow' + movementId + 'TargetLink'].href
                      .match(cityIdRegex)[1]) : 0;
              var mission = data['js_MilitaryMovementsEventRow' + movementId + 'MissionIcon']
                  .class.split(' ')[1];
              var stage = Constants.Movements.Stage.LOADING;
              var statusClass = 
                  data['js_MilitaryMovementsEventRow' + movementId + 'Mission'].class;
              if (statusClass && statusClass.indexOf('arrow_right_green') >= 0) {
                stage = Constants.Movements.Stage.EN_ROUTE;
              } else if (statusClass && statusClass.indexOf('arrow_left_green') >= 0) {
                stage = Constants.Movements.Stage.RETURNING;
              }
              
              var transports = 0;
              var resources = {};
              var units = new MilitaryUnits();
    
              $.each(
                  data['js_MilitaryMovementsEventRow' + movementId + 'UnitDetails']
                      .appendElement || [],
                  function processUnit(index, item) {
                    var count = parseInt(item.text);
                    
                    if (item.class.indexOf('ship_transport') >= 0) {
                      transports = count;
                    }
                    
                    if (item.class.indexOf(Constants.Resources.WOOD) >= 0) {
                      resources[Constants.Resources.WOOD] = count;
                    } else if (item.class.indexOf(Constants.Resources.WINE) >= 0) {
                      resources[Constants.Resources.WINE] = count;
                    } else if (item.class.indexOf(Constants.Resources.MARBLE) >= 0) {
                      resources[Constants.Resources.MARBLE] = count;
                    } else if (item.class.indexOf(Constants.Resources.GLASS) >= 0) {
                      resources[Constants.Resources.GLASS] = count;
                    } else if (item.class.indexOf(Constants.Resources.SULFUR) >= 0) {
                      resources[Constants.Resources.SULFUR] = count;
                    }
                    
                    $.each(Constants.Military, function findIsUnit(key, type) {
                      if (item.class.indexOf(' ' + type) >= 0) {
                        units._setCount(type, count);
                        return false;
                      }
                    });
                  });
                      
              var movement = new Movement(
                  movementId, type, completionTime, mission, stage, originCityId, targetCityId,
                  transports, units, resources);
              
              civilizationData._updateMovement(movement, changes);
            }
          });
          
          $.each(movementIds, function removeMissingMovements(id, value) {
            civilizationData._removeMovement(id, changes);
          });
          
          raiseMovementsChanged(changes);
        }
        
        function processPremiumView(data) {
          var civilizationData = getCivilizationData();
          var changes = [];
    
          civilizationData._updatePremiumFeature(changes,
              Constants.PremiumFeatures.DOUBLED_SAFE_CAPACITY,
              $('#js_buySafecapacityBonusActiveTime').hasClass('green'));      
          civilizationData._updatePremiumFeature(changes,
              Constants.PremiumFeatures.DOUBLED_STORAGE_CAPACITY,
              $('#js_buyStoragecapacityBonusActiveTime').hasClass('green'));
          
          raiseCivilizationDataChanged(changes);
        }
        
        function updateAndStartTracking() {
          // Process all known cities that show up in the dropdown.  
          // Drop any cities that are no longer there.
          var cities = { };
          var cityOrder = [];
          
          function updateCurrentCity(globalData, backgroundData, correctWineConsumption) {
            var currentCity = View.getCurrentCity();
            if (View.viewIsCity() && currentCity.getId() == parseInt(backgroundData.id)) {
              currentCity._updateFromBackgroundData(backgroundData);
            }
            currentCity._updateFromGlobalData(globalData, correctWineConsumption);
            Logging.debug("Current city %s[%s]: ", 
                currentCity.name, currentCity.id, currentCity);
          }
    
          $.each(unsafeWindow.dataSetForView.relatedCityData, 
              function updateFromPage_Each(key, value) {
                if (key.substring(0, 5) == "city_") {
                  var city = empireData.get().cities[value.id] || 
                      new City(value.id, value.relationship);
                  city.type = value.relationship;
    
                  city.name = value.name;
                  city.islandCoordinates = parseCoordinates(value.coords);
                  if (value.tradegood) {
                    city.tradeGoodType = TRADE_GOOD_LOOKUP[value.tradegood];
                  }
    
                  empireData.get().cities[city.id] = city;
                  cityOrder.push(city.id);
    
                  Logging.debug("City %s[%s]: %o", city.name, city.id, city);
                }
              });
    
          empireData.get().cityOrder = cityOrder;
    
          var globalData = {
            maxActionPoints: parseInt($('#js_GlobalMenu_maxActionPoints').text()),
          };
          updateCurrentCity($.extend(globalData, unsafeWindow.dataSetForView), 
                            unsafeWindow.ikariam.backgroundView.screen.data,
                            true);
                                  
          empireData.saveAsync();
                            
          function updateEmpireDataFromGlobalData(data) {
    
            View.setGameTimeDifference(new Date().getTime() - (data['time'] || data[1]) * 
                Constants.Time.MILLIS_PER_SECOND);
            updateCurrentCity(data['headerData'] || data[10], data['backgroundData'] || data[11]);
          }
              
          View.registerIkariamAjaxResponseCallback(
              function updateEmpireDataFromAjaxResponse(response) {
                var globalData;
                var view;
                var viewHtml;
                var templateData;
    
                Utils.iterateIkariamAjaxResponse(response, function(index, name, data) {
                  if (name == Constants.IkariamAjaxResponseType.UPDATE_GLOBAL_DATA) {
                    globalData = data;
                  } else if (name == Constants.IkariamAjaxResponseType.CHANGE_VIEW) {
                    view = data[0];
                    viewHtml = data[1];
                  } else if (name == Constants.IkariamAjaxResponseType.UPDATE_TEMPLATE_DATA) {
                    templateData = data;
                  }
                });
    
                if (globalData) {
                  updateEmpireDataFromGlobalData(globalData);
                }
    
                if (view == Constants.View.CITY_MILITARY) {
                  processCityMilitaryView(templateData);
                } else if (view == Constants.View.RELATED_CITIES) {
                  processRelatedCitiesView(templateData);
                } else if (view == Constants.View.ACADEMY) {
                  processAcademyView(templateData);
                } else if (view == Constants.View.PALACE) {
                  processPalaceView(templateData);
                } else if (view == Constants.View.MUSEUM) {
                  processMuseumView(templateData);
                } else if (view == Constants.View.ASSIGN_CULTURAL_POSSESSIONS) {
                  processCulturalPossessionsAssignView(templateData);
                } else if (view == Constants.View.TOWN_HALL) {
                  processTownHallView(templateData);
                } else if (view == Constants.View.TEMPLE) {
                  processTempleView(templateData);
                } else if (view == Constants.View.RESEARCH_ADVISOR) {
                  processResearchAdvisorView(templateData);
                } else if (view == Constants.View.FINANCES) {
                  processFinancesView(templateData);
                } else if (view == Constants.View.BARRACKS) {
                  processBarracksView(viewHtml, templateData);
                } else if (view == Constants.View.SHIPYARD) {
                  processShipyardView(viewHtml, templateData);
                } else if (view == Constants.View.MILITARY_ADVISOR) {
                  processMilitaryAdvisorView(templateData);
                } else if (view == Constants.View.PREMIUM) {
                  processPremiumView(templateData);
                }
    
                if (unsafeWindow.ikariam.templateView) {
                  if (unsafeWindow.ikariam.templateView.id == Constants.View.RESEARCH_ADVISOR) {
                    processResearchAdvisorView(templateData);
                  }
                }
    
                empireData.saveAsync();
              }, true);
          
          View.registerAjaxFormSubmitCallback(
              function ajaxHandlerCallFromFormEmpireDataUpdate(form) {
                if (form.id == 'transport'  || form.id == 'transportForm') {
                  processTransportForm(form);
                } else if (form.id == 'deploymentForm') {
                  processDeploymentForm(form);
                } else if (form.id == 'plunderForm') {
                  processPlunderForm(form);
                } else if (form.id == 'setScientists') {
                  processSetScientistsForm(form);
                }
              });
        }
        
        function updateMovements(callback) {
          View.backgroundGetIkariamPage(
            'http://' + document.domain + '/index.php?view=militaryAdvisor&activeTab=militaryMovements&ajax=1',
            function updateMovementsCallback(response) {
              var dataResponse = JSON.parse(response.responseText);
              Utils.iterateIkariamAjaxResponse(dataResponse, function(index, name, data) {
                if (name == Constants.IkariamAjaxResponseType.UPDATE_TEMPLATE_DATA) {
                  processMilitaryAdvisorView(data);
                }
              });
              empireData.saveAsync();
              callback(dataResponse);
            },
            'POST');
        }
        
        function getCities() {
          var data = empireData.get();
          var cities = [];
          for (var i = 0; i < data.cityOrder.length; i++) {
            cities.push(data.cities[data.cityOrder[i]]);
          }
          return cities;
        }
        
        function getOwnCities() {
          return getCities().filter(function(city) {
            return city.isOwn();
          });
        }
        
        function getCivilizationData() {
          return empireData.get().civilizationData;
        }
        
        function getDebugString(includePrivateData) {
          return JSON.stringify(empireData.get(), function debugStringify(name, value) {
            if (name === 'name' || name === 'islandCoordinates') {
              return undefined;
            }
            return value;
          });
        }
        
        function resetData() {
          empireData.reset();
        }
    
        var Espionage = function() {
          function Target(id) {
            this._ikaToolsType = 'target';
            
            if (id) {
              this.id = id;
    
              this.playerId = undefined;
              this.allianceId = undefined;
              
              this.townLevel = undefined;
              this.wallLevel = undefined;
              this.warehouseLevel = undefined;
    
              this.islandId = undefined;
              this.coords = undefined;
    
              this.occupierId = undefined;
              this.blockaderId = undefined;
              
              this.tradeGoodType = undefined;
    
              this.lastUpdateTime = 0;
              
              this.military = new MilitaryUnits();
              this.otherMilitary = new MilitaryUnits();
              this.militaryLastSpyMessageId = 0;
              this.militaryLastSpyTime = 0;
    
              this.resources = {
                wood: 0,
                wine: 0,
                marble: 0,
                glass: 0,
                sulfur: 0,
    
                lastSpyMessageId: 0,
                lastSpyTime: 0,
              };
    
              this.combats = {};
            }
          }
    
          function combatComparer(combat1, combat2) {
                  return combat2.time - combat1.time;
                };
    
          $.extend(Target.prototype, {
            getId: function getId() {
              return this.id;
            },
            getName: function getName() {
              return this.name;
            },
            getTownLevel: function getTownLevel() {
              return this.townLevel;
            },
            getWallLevel: function getWallLevel() {
              return this.wallLevel;
            },
            getIslandCoordinates: function getIslandCoordinates() {
              return this.coords;
            },
            getIslandId: function getIslandId() {
              return this.islandId;
            },
            getPlayer: function _getPlayer() {
              return getPlayer(this.playerId);
            },
            getOccupier: function getOccupier() {
              if (this.occupierId) {
                return getPlayer(this.occupierId);
              }
              return null;
            },
            getBlockader: function getBlockader() {
              if (this.blockaderId) {
                return getPlayer(this.blockaderId);
              }
            },
            getTradeGoodType: function getTradeGoodType() {
              return this.tradeGoodType;
            },
            getMilitary: function getMilitary() {
              return this.military;
            },
            getOtherMilitary: function getOtherMilitary() {
              return this.otherMilitary;
            },
            hasResourceInfo: function hasResourceInfo() {
              return this.resources.lastSpyMessageId > 0;
            },
            hasMilitaryInfo: function hasMilitaryInfo() {
              return this.militaryLastSpyMessageId > 0;
            },
            getLootableResources: function getLootableResources(type) {
              var available = this.resources[type];
              $.each(this.getCombats(View.gameTimeNow() - this.resources.lastSpyTime), 
                function subtractCombatResources(index, combat) {
                  available -= combat.getLooted(type);
                });
              return Math.max(0, available - 
                  (this.getPlayer().isInactive() ? 
                      Constants.GamePlay.RESOURCE_PROTECTION_WAREHOUSE_INACTIVE : 
                      Constants.GamePlay.RESOURCE_PROTECTION_WAREHOUSE) * this.warehouseLevel - 
                  Constants.GamePlay.BASE_RESOURCE_PROTECTION);
            },
            getResourcesSpyTime: function getResourcesSpyTime() {
              return this.resources.lastSpyTime;
            },
            getMilitarySpyTime: function getMilitarySpyTime() {
              return this.militaryLastSpyTime;
            },
            getCombats: function getCombats(maxAge) {
              var combats = [];
              $.each(this.combats, function(index, combat) {
                if (View.gameTimeNow() - combat.time <= maxAge) {
                  combats.push(combat);
                }
              });
              combats.sort(combatComparer);
              return combats;
            },
            remove: function remove() {
              delete espionageData.get().targets[this.id];
              espionageData.saveAsync();
                  raiseEspionageChanged({
                    type: 'targetRemoved',
                    targets: [this]
                  });
            },
            _refresh: function refresh(hasSpiesPresent, callback) {
              if (View.gameTimeNow() - this.lastRefreshTime < Constants.Time.MILLIS_PER_HOUR) {
                console.log('Skipping refresh');
                callback();
                return;
              }
    
              this.lastRefreshTime = new Date().getTime();
              
              var datasLoaded = hasSpiesPresent ? 2 : 1;
              function doneLoading() {
                if (--datasLoaded == 0) {
                  callback();
                }
              }
              Utils.backgroundFetchIkariamFullPage(
                  'http://' + document.domain + '/index.php?view=island&cityId=' + this.id,
                  this._refreshIslandCallback.bind(this, doneLoading));
              if (hasSpiesPresent) {
                Utils.backgroundFetchIkariamFullPage(
                    'http://' + document.domain + '/index.php?view=city&cityId=' + this.id,
                    this._refreshCityCallback.bind(this, doneLoading));
              }
            },
            _refreshIslandCallback: function refreshIslandCallback(callback, response, ajaxResponse) {
              var target = this;
              Utils.iterateIkariamAjaxResponse(ajaxResponse, 
                  function refreshTargetData(index, name, data) {
                    if (name == IkaTools.Constants.IkariamAjaxResponseType.UPDATE_BACKGROUND_DATA) {
                      $.each(data.cities, function findTarget(index, city) {
                        if (parseInt(city.id) == target.id) {
                          var playerId = parseInt(city.ownerId);
                          target.name = city.name;
                          target.playerId = parseInt(city.ownerId);
                          target.townLevel = parseInt(city.level);
                          target.islandId = parseInt(data.id);
                          target.coords = [parseInt(data.xCoord), parseInt(data.yCoord)];
                          target.tradeGoodType = TRADE_GOOD_LOOKUP[data.tradegood];
                          updateOrAddPlayer(playerId, city.ownerName, city.state, parseInt(city.ownerAllyId), 
                              city.ownerAllyTag, 
                              parseInt(data.avatarScores[playerId].army_score_main.split(',').join('').split(',').join('')) / 100);
                          if (city.infos && city.infos['occupation']) {
                            target.occupierId = city.infos['occupation'].id;
                            updateOrAddPlayer(city.infos['occupation'].id, city.infos['occupation'].name);
                          } else {
                            target.occupierId = 0;
                          }
                          if (city.infos && city.infos['fleetAction']) {
                            target.blockaderId = city.infos['fleetAction'].id;
                            updateOrAddPlayer(city.infos['fleetAction'].id, city.infos['fleetAction'].name);
                          } else {
                            target.blockaderId = 0;
                          }
                        }
                      });
                    }
                  });
              callback(this);
            },
            _refreshCityCallback: function refreshCityCallback(callback, response, ajaxResponse) {
              var target = this;
              Utils.iterateIkariamAjaxResponse(ajaxResponse, 
                  function refreshTargetData(index, name, data) {
                    if (name == IkaTools.Constants.IkariamAjaxResponseType.UPDATE_BACKGROUND_DATA) {
                      target.wallLevel = parseInt(data.position[14].level) || 0;
                      target.warehouseLevel = 0;
                      $.each(data.position, function(index, item) {
                        if (item.building == Constants.Buildings.WAREHOUSE) {
                          target.warehouseLevel += parseInt(item.level);
                        }
                      });
                    }
                  });
              callback(this);
            },
            _getOrAddCombat: function getOrAddCombat(id) {
              var combat = this.combats[id];
              if (!combat) {
                combat = new Target.Combat(id);
                this.combats[id] = combat;
              }
              return combat;
            },
          });
    
          Target.Combat = function Target_Combat(id) {
            this._ikaToolsType = 'targetCombat';
    
            if (id) {
              this.id = id;
              
              this.type = undefined;
              this.time = undefined;
    
              this.resources = {
                wood: 0,
                wine: 0,
                marble: 0,
                glass: 0,
                sulfur: 0,
              };
            }
          }
    
          $.extend(Target.Combat.prototype, {
            getType: function getType() {
              return this.type;
            },
            getTime: function getTime() {
              return this.time;
            },
            getLooted: function getLooted(resourceType) {
              return this.resources[resourceType];
            },
          });
    
          function Player(id) {
            this._ikaToolsType = 'player';
            
            if (id) {
              this.id = id;
              
              this.name = null;
              this.allianceId = null;
              this.militaryScore = null;
            }
          }
    
          $.extend(Player.prototype, {
            _update: function update(name, state, allianceId, militaryScore) {
              this.name = name;
              if (state !== undefined) {
                this.allianceId = allianceId;
                this.militaryScore = militaryScore;
                this.state = state;
              }
            },
            getAlliance: function getAlliance() {
              if (this.allianceId) {
                return espionageData.get().alliances[this.allianceId];
              } else {
                return;
              }
            },
            getName: function getName() {
              return this.name;
            },
            getState: function getState() {
              return this.state;
            },
            getMilitaryScore: function getMilitaryScore() {
              return this.militaryScore;
            },
            isInactive: function isInactive() {
              return this.state == Constants.PlayerState.INACTIVE;
            },
          });
    
          function updateOrAddPlayer(id, name, state, allianceId, allianceName, militaryScore) {
            var players = espionageData.get().players;
            var player = players[id];
            if (!player) {
              player = new Player(id);
              players[id] = player;
            }
            player._update(name, state, allianceId, militaryScore);
            updateOrAddAlliance(allianceId, allianceName);
          }
    
          function Alliance(id) {
            this._ikaToolsType = 'alliance';
            
            if (id) {
              this.id = id;
              this.name = null;
            }
          }
    
          $.extend(Alliance.prototype, {
            _update: function update(name) {
              this.name = name;
            },
            getName: function getName() {
              return this.name;
            },
            getId: function getId() {
              return this.id;
            }
          });
    
          function updateOrAddAlliance(id, name) {
            if (id) {
              var alliances = espionageData.get().alliances;
              var alliance = alliances[id];
              if (!alliance) {
                alliance = new Alliance(id);
                alliances[id] = alliance;
              }
              alliance._update(name);
            }
          }
    
          function addTargetById(id, hasSpiesPresent, callback) {
            var targets = espionageData.get().targets;
            var target = targets[id];
            if (!target) {
              var target = new Target(id);
              target._refresh(hasSpiesPresent, function() {
                targets[id] = target;
                callback(target);
              });
            } else {
              target._refresh(hasSpiesPresent, function() {
                callback(target);
              });
            }
          }
    
          function getTargets() {
            var targets = [];
            $.each(espionageData.get().targets, function(index, target) {
              targets.push(target);
            });
            return targets;
          }
    
          function getTarget(id) {
            return espionageData.get().targets[id];
          }
    
          function getPlayer(id) {
            return espionageData.get().players[id];
          }
    
          function getPlayers() {
            return espionageData.get().players;
          }
    
          var espionageData = new Data.Value(
              'espionageData', 
              { 
                targets: {},
                alliances: {},
                players: {},
              }, 
              {
                reviver: function espionageDataReviver(key, value) {
                  if (value && value._ikaToolsType) {
                    var obj;
    
                    switch(value._ikaToolsType) {
                      case 'target': obj = new Target(); break;
                      case 'targetCombat': obj = new Target.Combat(); break;
                      case 'player': obj = new Player(); break;
                      case 'alliance': obj = new Alliance(); break;
                      case 'militaryUnits': obj = new MilitaryUnits(); break;
                    }
                    $.extend(obj, value);
                    if (obj._postLoad) {
                      obj._postLoad();
                    }
                    return obj;
                  }
                  return value;
                },
                version: 6,
    
                loadCallback: function espionageDataLoaded() {
                },
              });
    
          var espionageChangedEvent = Utils.thunk(function() {
            return new Utils.EventDispatcher();
          });
        
          function registerEspionageChangedHandler(callback) {
            return espionageChangedEvent().addListener(callback);
          }
    
          function raiseEspionageChanged(changes) {
            espionageChangedEvent().send(changes);
          }
    
          function startTracking() {
            var messageIdRegex = /message(\d+)/
            espionageData.load();
            
            View.registerIkariamAjaxResponseCallback(
                function processHideoutView(response) {
                  IkaTools.Utils.iterateIkariamAjaxResponse(response, function(index, name, data) {
                    if (name == IkaTools.Constants.IkariamAjaxResponseType.CHANGE_VIEW) {
                      if (data[0] == Constants.View.HIDEOUT) {
                        var targetCount = 0;
                        var targets = [];
                        $('#tabSafehouse li.city a').each(function(index, item) {
                          targetCount++;
                          addTargetById(parseInt(Utils.parseUrlParams($(item).attr('href'))['cityId']), true, 
                            function targetAdded(target) {
                              targets.push(target);
                              targetCount--;
                              if (targetCount == 0) {
                                espionageData.saveAsync();
                                raiseEspionageChanged({
                                  type: 'targetsChanged',
                                  targets: targets
                                });
                              }
                            });
                        });
    
                        var reportHeaders = $(
                            '#espionageReports tr.espionageReports, #espionageReports tr.espionageReportsalt');
                        if (reportHeaders.length) {
                          var changedTargets = [];
                          reportHeaders.each(function(index, reportHeader) {
                            var success = $('td.resultImage img', reportHeader).attr('src') == '/cdn/all/both/buttons/yes.png';
                            var target = getTarget(parseInt(
                                Utils.parseUrlParams($('td.targetCity a', reportHeader).attr('href'))['selectCity']));
                            var messageId = parseInt(reportHeader.id.match(messageIdRegex)[1]);
                            var tableMailMessage = $('#tbl_mail' + messageId);
                            if (success && target) {
                              if ($('td.money', reportHeader).length &&
                                  messageId > target.resources.lastSpyMessageId) {
                                // Warehouse resources mission
                                var resourceTds = $('#tbl_mail' + messageId + ' td.count');
                                target.resources.wood = parseInt(resourceTds.get(0).textContent.replace(',', ''));
                                target.resources.wine = parseInt(resourceTds.get(1).textContent.replace(',', ''));
                                target.resources.marble = parseInt(resourceTds.get(2).textContent.replace(',', ''));
                                target.resources.glass = parseInt(resourceTds.get(3).textContent.replace(',', ''));
                                target.resources.sulfur = parseInt(resourceTds.get(4).textContent.replace(',', ''));
                                target.resources.lastSpyMessageId = messageId;
                                target.resources.lastSpyTime = 
                                    Utils.parseIkariamTimestamp($('td.date', reportHeader).text()).getTime();
                                target._refresh(false, function() {
                                  espionageData.saveAsync(),
                                  raiseEspionageChanged({
                                    type: 'targetsRefreshed',
                                    targets: [target],
                                  });
                                });
                                changedTargets.push(target);
                              } else if ($('td.garrison', reportHeader).length && 
                                  messageId > target.militaryLastSpyMessageId && 
                                  tableMailMessage.find(' table.reportTable').length) {
    
                                readSpiedMilitary(target.getMilitary(), 
                                    tableMailMessage.find('table.reportTable tr:nth-child(2) td.count'));
                                readSpiedMilitary(target.getOtherMilitary(), 
                                    tableMailMessage.find('table.reportTable tr:nth-child(3) td.count'));
                                    
                                target.militaryLastSpyMessageId = messageId;
                                target.militaryLastSpyTime = Utils.parseIkariamTimestamp($('td.date', reportHeader).text()).getTime();
    
                                target._refresh(false, function() {
                                  espionageData.saveAsync(),
                                  raiseEspionageChanged({
                                    type: 'targetsRefreshed',
                                    targets: [target],
                                  });
                                });
                                changedTargets.push(target);
                              }
                            }
                          });
                          if (changedTargets.length) {
                            espionageData.saveAsync();
                            raiseEspionageChanged({
                              type: 'targetsChanged',
                              targets: changedTargets
                            });
                          }
                        }
                      } else if (data[0] == Constants.View.MILITARY_ADVISOR_REPORT) {
                        var report = $('#troopsReport');
                        var defender = report.find('.defender b:first a:first');
                        if (defender.length) {
                          var target = getTarget(parseInt(
                              Utils.parseUrlParams(defender.attr('href'))['cityId']));
                          if (target) {
                            var header = report.find('.header');
                            var result = report.find('div.result');
                            var combatId = parseInt(Utils.parseUrlParams(
                                report.find('div p.link:first a.button:first',report).attr('href'))['detailedCombatId']);
                            var combatTime = Utils.parseIkariamTimestamp(report.find('.header .date').text()).getTime();
                            var type = report.find('.overview .fleet').length ? 
                                IkaTools.Constants.CombatType.BLOCKADE : IkaTools.Constants.CombatType.PILLAGE;
    
                            var combat = target._getOrAddCombat(combatId);
                            combat.type = type;
                            combat.time = combatTime;
                            result.find('.resources li.value').each(function(index, item) {
                              var resourceInfo = $(item);
                              var type = resourceInfo.find('img').attr('src').match(/icon_([a-z]*)_small.png/)[1];
                              if (type == 'crystal') {
                                type = Constants.Resources.GLASS;
                              }
                              var amount = parseInt(resourceInfo.text());
                              combat.resources[type] = amount;
                            });
    
                            target._refresh(false, function() {
                              espionageData.saveAsync(),
                              raiseEspionageChanged({
                                type: 'targetsRefreshed',
                                targets: [target],
                              });
                            });
                          }
                          
                          espionageData.saveAsync();
                          raiseEspionageChanged({
                            type: 'combatUpdated',
                            targets: [target],
                          });
                        }
                      }
                    } else if (name == Constants.IkariamAjaxResponseType.BACKGROUND_DATA) {
                    }
                  });
                }, true);
          }
    
          function readSpiedMilitary(military, unitTds) {
            var baseArmyCount = true;
            var baseNavyCount = true;
            var navyOffset = 0;
            
            if (unitTds.length == 14) { // army only
              baseNavyCount = 0;
            } else if (unitTds.length == 11) { // navy only
              baseArmyCount = 0;
              navyOffset = -14;
            } else if (unitTds.length == 0) { // nothing
              baseNavyCount = 0;
              baseArmyCount = 0;
            }
            military._setCount(Constants.Military.HOPLITE, baseArmyCount && parseInt($(unitTds[0]).text()) || 0);
            military._setCount(Constants.Military.STEAM_GIANT, baseArmyCount && parseInt($(unitTds[1]).text()) || 0);
            military._setCount(Constants.Military.SPEARMAN, baseArmyCount && parseInt($(unitTds[2]).text()) || 0);
            military._setCount(Constants.Military.SWORDSMAN, baseArmyCount && parseInt($(unitTds[3]).text()) || 0);
            military._setCount(Constants.Military.SLINGER, baseArmyCount && parseInt($(unitTds[4]).text()) || 0);
            military._setCount(Constants.Military.ARCHER, baseArmyCount && parseInt($(unitTds[5]).text()) || 0);
            military._setCount(Constants.Military.GUNNER, baseArmyCount && parseInt($(unitTds[6]).text()) || 0);
            military._setCount(Constants.Military.BATTERING_RAM, baseArmyCount && parseInt($(unitTds[7]).text()) || 0);
            military._setCount(Constants.Military.CATAPULT, baseArmyCount && parseInt($(unitTds[8]).text()) || 0);
            military._setCount(Constants.Military.MORTAR, baseArmyCount && parseInt($(unitTds[9]).text()) || 0);
            military._setCount(Constants.Military.GYROCOPTER, baseArmyCount && parseInt($(unitTds[10]).text()) || 0);
            military._setCount(Constants.Military.BALLOON_BOMBADIER, baseArmyCount && parseInt($(unitTds[11]).text()) || 0);
            military._setCount(Constants.Military.COOK, baseArmyCount && parseInt($(unitTds[12]).text()) || 0);
            military._setCount(Constants.Military.DOCTOR, baseArmyCount && parseInt($(unitTds[13]).text()) || 0);
    
            military._setCount(Constants.Military.RAM_SHIP, parseInt(baseNavyCount && $(unitTds[16 + navyOffset]).text()) || 0);
            military._setCount(Constants.Military.FLAME_THROWER, parseInt(baseNavyCount && $(unitTds[14 + navyOffset]).text()) || 0);
            military._setCount(Constants.Military.STEAM_RAM, parseInt(baseNavyCount && $(unitTds[15 + navyOffset]).text()) || 0);
            military._setCount(Constants.Military.BALLISTA_SHIP, parseInt(baseNavyCount && $(unitTds[18 + navyOffset]).text()) || 0);
            military._setCount(Constants.Military.CATAPULT_SHIP, parseInt(baseNavyCount && $(unitTds[17 + navyOffset]).text()) || 0);
            military._setCount(Constants.Military.MORTAR_SHIP, parseInt(baseNavyCount && $(unitTds[19 + navyOffset]).text()) || 0);
            military._setCount(Constants.Military.SUBMARINE, parseInt(baseNavyCount && $(unitTds[21 + navyOffset]).text()) || 0);
            military._setCount(Constants.Military.PADDLE_SPEED_SHIP, parseInt(baseNavyCount && $(unitTds[22 + navyOffset]).text()) || 0);
            military._setCount(Constants.Military.BALLOON_CARRIER, parseInt(baseNavyCount && $(unitTds[23 + navyOffset]).text()) || 0);
            military._setCount(Constants.Military.TENDER, parseInt(baseNavyCount && $(unitTds[24 + navyOffset]).text()) || 0);
            military._setCount(Constants.Military.ROCKET_SHIP, parseInt(baseNavyCount && $(unitTds[20 + navyOffset]).text()) || 0);
          }
          
          function getDebugString(includePrivateData) {
            return JSON.stringify(espionageData.get(), function debugStringify(name, value) {
              if (name === 'name' || name === 'coordinates') {
                return undefined;
              }
              return value;
            });
          }
    
          function resetData() {
            espionageData.reset();
          }
        
          return {
            startTracking: startTracking,
            registerEspionageChangedHandler: registerEspionageChangedHandler,
            getTargets: getTargets,
            getPlayers: getPlayers,
            
            getDebugString: getDebugString,
            resetData: resetData,
          };
        }();
        
        return {
          updateAndStartTracking: Logging.debuggable(
              { label: 'IkaTools.EmpireData.updateAndStartTracking', alwaysTime: true }, 
              updateAndStartTracking),
          updateMovements: updateMovements,
          
          calculateTravelTime: calculateTravelTime,
          
          getCities: Utils.thunk(getCities),
          getOwnCities: Utils.thunk(getOwnCities),
          getCivilizationData: getCivilizationData,
          getCity: getCity,
          
          getDebugString: getDebugString,
          resetData: resetData,
          
          registerCivilizationDataChangedHandler: registerCivilizationDataChangedHandler,
          registerResourcesChangedHandler: registerResourcesChangedHandler,
          registerBuildingsChangedHandler: registerBuildingsChangedHandler,
          registerMilitaryChangedHandler: registerMilitaryChangedHandler,
          registerMovementsChangedHandler: registerMovementsChangedHandler,
    
          Espionage:Espionage,
        };
      }();
      
      function processAnchor() {
        var anchor = window.location.hash;
    
        if (anchor == '#ikaScriptToolsSuppressCityPreselect') {
          document.location.hash = '';
          //unsafeWindow.ikariam.backgroundView.screen.preselectCity = 
          //    function suppressPreselectCity() { };
          View.suppressFirstChangeViewOfType('cityDetails');
        }
        if (anchor.substring(0, 35) == '#ikaScriptToolsLoadLocalIkariamUrl=') {
          var url = decodeURIComponent(anchor.substring(35));
          document.location.hash = '';
          IkaTools.View.loadLocalIkariamUrl(url);
          if (IkaTools.View.viewIsIsland()) {
            View.suppressFirstChangeViewOfType('cityDetails');
          }
        } else if (anchor.substring(0, 62) == 
            '#ikaScriptToolsLoadLocalIkariamUrl_DoNotSuppressFirstCityInfo=') {
          var url = decodeURIComponent(anchor.substring(62));
          document.location.hash = '';
          IkaTools.View.loadLocalIkariamUrl(url);
        }
      }
      
      function initialize(options) {
        processAnchor();
        $(window).bind('hashchange', processAnchor);
        options = $.extend({ trackData: true }, options);
        View.setGameTimeDifference(new Date().getTime() - 
            unsafeWindow.ikariam.model.requestTime * Constants.Time.MILLIS_PER_SECOND - 
            Constants.Time.INITIAL_PAGE_LOAD_DELTA);
        if (options.trackData) {
          IkaTools.EmpireData.updateAndStartTracking();
        }
      }
      
      return {
        Logging: Logging,
        Utils: Utils,
        View: View,
        Data: Data,
        Intl: Intl,
        EmpireData: EmpireData,
        Constants: Constants,
        UI: UI,
        Settings: Settings,
        
        initialize: initialize,
        processAnchor: processAnchor,
      };
    })();
    }