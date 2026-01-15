// ==UserScript==
// @name         parkrun Wilson index display
// @description  The "Wilson index" in parkrun is the highest consecutive event number completed, starting from #1. This script calculates and displays a parkrunner's Wilson index on their results page.
// @author       Pete Johns (@johnsyweb)
// @grant        none
// @homepage     https://www.johnsy.com/tampermonkey-parkrun/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=parkrun.com.au
// @license      MIT
// @match        *://www.parkrun.ca/parkrunner/*/all/
// @match        *://www.parkrun.co.at/parkrunner/*/all/
// @match        *://www.parkrun.co.nl/parkrunner/*/all/
// @match        *://www.parkrun.co.nz/parkrunner/*/all/
// @match        *://www.parkrun.co.za/parkrunner/*/all/
// @match        *://www.parkrun.com.au/parkrunner/*/all/
// @match        *://www.parkrun.com.de/parkrunner/*/all/
// @match        *://www.parkrun.dk/parkrunner/*/all/
// @match        *://www.parkrun.fi/parkrunner/*/all/
// @match        *://www.parkrun.fr/parkrunner/*/all/
// @match        *://www.parkrun.ie/parkrunner/*/all/
// @match        *://www.parkrun.it/parkrunner/*/all/
// @match        *://www.parkrun.jp/parkrunner/*/all/
// @match        *://www.parkrun.lt/parkrunner/*/all/
// @match        *://www.parkrun.my/parkrunner/*/all/
// @match        *://www.parkrun.no/parkrunner/*/all/
// @match        *://www.parkrun.org.uk/parkrunner/*/all/
// @match        *://www.parkrun.pl/parkrunner/*/all/
// @match        *://www.parkrun.se/parkrunner/*/all/
// @match        *://www.parkrun.sg/parkrunner/*/all/
// @match        *://www.parkrun.us/parkrunner/*/all/
// @namespace    http://tampermonkey.net/
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js
// @run-at       document-end
// @supportURL   https://github.com/johnsyweb/tampermonkey-parkrun/issues/
// @tag          parkrun
// @version      1.0.68
// @downloadURL https://update.greasyfork.org/scripts/534160/parkrun%20Wilson%20index%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/534160/parkrun%20Wilson%20index%20display.meta.js
// ==/UserScript==
// DO NOT EDIT - generated from src/ by scripts/build-scripts.js
// Built: 2026-01-14T04:30:23.032Z

function _regenerator() {
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e,
    t,
    r = 'function' == typeof Symbol ? Symbol : {},
    n = r.iterator || '@@iterator',
    o = r.toStringTag || '@@toStringTag';
  function i(r, n, o, i) {
    var c = n && n.prototype instanceof Generator ? n : Generator,
      u = Object.create(c.prototype);
    return (
      _regeneratorDefine2(
        u,
        '_invoke',
        (function (r, n, o) {
          var i,
            c,
            u,
            f = 0,
            p = o || [],
            y = !1,
            G = {
              p: 0,
              n: 0,
              v: e,
              a: d,
              f: d.bind(e, 4),
              d: function d(t, r) {
                return ((i = t), (c = 0), (u = e), (G.n = r), a);
              },
            };
          function d(r, n) {
            for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) {
              var o,
                i = p[t],
                d = G.p,
                l = i[2];
              r > 3
                ? (o = l === n) && ((u = i[(c = i[4]) ? 5 : ((c = 3), 3)]), (i[4] = i[5] = e))
                : i[0] <= d &&
                  ((o = r < 2 && d < i[1])
                    ? ((c = 0), (G.v = n), (G.n = i[1]))
                    : d < l &&
                      (o = r < 3 || i[0] > n || n > l) &&
                      ((i[4] = r), (i[5] = n), (G.n = l), (c = 0)));
            }
            if (o || r > 1) return a;
            throw ((y = !0), n);
          }
          return function (o, p, l) {
            if (f > 1) throw TypeError('Generator is already running');
            for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y; ) {
              i || (c ? (c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : (G.n = u)) : (G.v = u));
              try {
                if (((f = 2), i)) {
                  if ((c || (o = 'next'), (t = i[o]))) {
                    if (!(t = t.call(i, u))) throw TypeError('iterator result is not an object');
                    if (!t.done) return t;
                    ((u = t.value), c < 2 && (c = 0));
                  } else
                    (1 === c && (t = i.return) && t.call(i),
                      c < 2 &&
                        ((u = TypeError("The iterator does not provide a '" + o + "' method")),
                        (c = 1)));
                  i = e;
                } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break;
              } catch (t) {
                ((i = e), (c = 1), (u = t));
              } finally {
                f = 1;
              }
            }
            return { value: t, done: y };
          };
        })(r, o, i),
        !0
      ),
      u
    );
  }
  var a = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  t = Object.getPrototypeOf;
  var c = [][n]
      ? t(t([][n]()))
      : (_regeneratorDefine2((t = {}), n, function () {
          return this;
        }),
        t),
    u = (GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c));
  function f(e) {
    return (
      Object.setPrototypeOf
        ? Object.setPrototypeOf(e, GeneratorFunctionPrototype)
        : ((e.__proto__ = GeneratorFunctionPrototype),
          _regeneratorDefine2(e, o, 'GeneratorFunction')),
      (e.prototype = Object.create(u)),
      e
    );
  }
  return (
    (GeneratorFunction.prototype = GeneratorFunctionPrototype),
    _regeneratorDefine2(u, 'constructor', GeneratorFunctionPrototype),
    _regeneratorDefine2(GeneratorFunctionPrototype, 'constructor', GeneratorFunction),
    (GeneratorFunction.displayName = 'GeneratorFunction'),
    _regeneratorDefine2(GeneratorFunctionPrototype, o, 'GeneratorFunction'),
    _regeneratorDefine2(u),
    _regeneratorDefine2(u, o, 'Generator'),
    _regeneratorDefine2(u, n, function () {
      return this;
    }),
    _regeneratorDefine2(u, 'toString', function () {
      return '[object Generator]';
    }),
    (_regenerator = function _regenerator() {
      return { w: i, m: f };
    })()
  );
}
function _regeneratorDefine2(e, r, n, t) {
  var i = Object.defineProperty;
  try {
    i({}, '', {});
  } catch (e) {
    i = 0;
  }
  ((_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) {
    function o(r, n) {
      _regeneratorDefine2(e, r, function (e) {
        return this._invoke(r, n, e);
      });
    }
    r
      ? i
        ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t })
        : (e[r] = n)
      : (o('next', 0), o('throw', 1), o('return', 2));
  }),
    _regeneratorDefine2(e, r, n, t));
}
function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, 'next', n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, 'throw', n);
      }
      _next(void 0);
    });
  };
}
function _toConsumableArray(r) {
  return (
    _arrayWithoutHoles(r) ||
    _iterableToArray(r) ||
    _unsupportedIterableToArray(r) ||
    _nonIterableSpread()
  );
}
function _nonIterableSpread() {
  throw new TypeError(
    'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
  );
}
function _iterableToArray(r) {
  if (('undefined' != typeof Symbol && null != r[Symbol.iterator]) || null != r['@@iterator'])
    return Array.from(r);
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _createForOfIteratorHelper(r, e) {
  var t = ('undefined' != typeof Symbol && r[Symbol.iterator]) || r['@@iterator'];
  if (!t) {
    if (
      Array.isArray(r) ||
      (t = _unsupportedIterableToArray(r)) ||
      (e && r && 'number' == typeof r.length)
    ) {
      t && (r = t);
      var _n = 0,
        F = function F() {};
      return {
        s: F,
        n: function n() {
          return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] };
        },
        e: function e(r) {
          throw r;
        },
        f: F,
      };
    }
    throw new TypeError(
      'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
    );
  }
  var o,
    a = !0,
    u = !1;
  return {
    s: function s() {
      t = t.call(r);
    },
    n: function n() {
      var r = t.next();
      return ((a = r.done), r);
    },
    e: function e(r) {
      ((u = !0), (o = r));
    },
    f: function f() {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    },
  };
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ('string' == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return (
      'Object' === t && r.constructor && (t = r.constructor.name),
      'Map' === t || 'Set' === t
        ? Array.from(r)
        : 'Arguments' === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
          ? _arrayLikeToArray(r, a)
          : void 0
    );
  }
}
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}

(function () {
  'use strict';

  /**
   * Finds the last results table with a specified number of columns
   * @param {Document} document - The document object to search in
   * @param {number} [columnCount=7] - Required number of columns
   * @returns {HTMLTableElement|null} The matching table or null if not found
   */
  function findResultsTable(document) {
    var columnCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 7;
    var tables = document.querySelectorAll('[id="results"]');
    var matchingTable = null;
    var _iterator = _createForOfIteratorHelper(tables),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done; ) {
        var table = _step.value;
        var firstRow = table.querySelector('tr');
        if (firstRow) {
          var columns = firstRow.querySelectorAll('th, td').length;
          if (columns === columnCount) {
            matchingTable = table;
            break;
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return matchingTable;
  }
  function extractEventDetails(table) {
    var rows = Array.from(table.querySelectorAll('tbody > tr'));
    return rows.reverse().map(function (row) {
      var eventName = row.querySelector('td:nth-child(1)').textContent.trim();
      var eventDate = row.querySelector('td:nth-child(2)').textContent.trim();
      var eventNumber = row.querySelector('td:nth-child(3)').textContent.trim();
      return {
        eventName: eventName,
        eventDate: eventDate,
        eventNumber: parseInt(eventNumber, 10),
      };
    });
  }

  /**
   * Calculates the Wilson index, which represents the highest consecutive number of parkrun events
   * completed starting from 1. It iterates through the sorted event numbers and increments the index
   * as long as the next event number matches the expected value.
   *
   * @param {Array} events - An array of event objects containing event numbers.
   * @returns {number} The calculated Wilson index.
   */
  function calculateWilsonIndex(events) {
    var wilsonIndex = 0;
    var eventNumbers = events
      .map(function (e) {
        return e.eventNumber;
      })
      .sort(function (a, b) {
        return a - b;
      });
    var _iterator2 = _createForOfIteratorHelper(eventNumbers),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
        var eventNumber = _step2.value;
        if (eventNumber >= wilsonIndex + 2) {
          break;
        } else if (eventNumber === wilsonIndex + 1) {
          wilsonIndex++;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return wilsonIndex;
  }
  function calculateWilsonIndexOverTime(events) {
    var wilsonIndices = [];
    for (var i = 0; i < events.length; i++) {
      var subset = events.slice(0, i + 1);
      var parkruns = i + 1;
      var event = ''
        .concat(events[i].eventName, ' # ')
        .concat(events[i].eventNumber, ' on ')
        .concat(events[i].eventDate);
      var wilsonIndex = calculateWilsonIndex(subset);
      wilsonIndices.push({
        parkruns: parkruns,
        event: event,
        wilsonIndex: wilsonIndex,
      });
    }
    return wilsonIndices;
  }
  function getResponsiveConfig() {
    var mobileConfig = {
      isMobile: true,
      spacing: {
        small: '10px',
        medium: '15px',
      },
      container: {
        padding: '10px',
        marginTop: '10px',
      },
      typography: {
        wilsonIndex: '1.2em',
        input: '16px',
        button: '16px',
      },
      chart: {
        height: '250px',
        fonts: {
          title: 14,
          axisTitle: 12,
          axisTicks: 10,
          legend: 11,
          tooltipTitle: 12,
          tooltipBody: 11,
        },
      },
      form: {
        marginBottom: '10px',
        input: {
          width: 'calc(100% - 20px)',
          maxWidth: '300px',
          padding: '8px',
          marginRight: '0',
        },
        button: {
          padding: '8px 15px',
          width: 'calc(100% - 20px)',
          maxWidth: '300px',
        },
        layout: {
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'center',
        },
      },
    };
    var desktopConfig = {
      isMobile: false,
      spacing: {
        small: '20px',
        medium: '20px',
      },
      container: {
        padding: '20px',
        marginTop: '20px',
      },
      typography: {
        wilsonIndex: '1.5em',
        input: 'inherit',
        button: 'inherit',
      },
      chart: {
        height: '300px',
        fonts: {
          title: 16,
          axisTitle: 14,
          axisTicks: 12,
          legend: 12,
          tooltipTitle: 14,
          tooltipBody: 12,
        },
      },
      form: {
        marginBottom: '20px',
        input: {
          width: '300px',
          maxWidth: '300px',
          padding: '5px',
          marginRight: '10px',
        },
        button: {
          padding: '5px 10px',
          width: 'auto',
          maxWidth: 'none',
        },
        layout: {
          display: 'block',
          flexDirection: 'row',
          gap: '0',
          alignItems: 'flex-start',
        },
      },
    };
    var isMobile = window.innerWidth < 768;
    return isMobile ? mobileConfig : desktopConfig;
  }
  function createWilsonGraph(indices, container, athleteInfo) {
    var responsive = getResponsiveConfig();
    var chartContainer = document.createElement('div');
    chartContainer.style.width = '100%';
    chartContainer.style.maxWidth = '100%';
    chartContainer.style.height = responsive.chart.height;
    chartContainer.style.position = 'relative';
    chartContainer.style.boxSizing = 'border-box';
    chartContainer.style.overflow = 'hidden';
    var canvas = document.createElement('canvas');
    chartContainer.appendChild(canvas);
    container.appendChild(chartContainer);
    var ctx = canvas.getContext('2d');
    // eslint-disable-next-line no-undef
    var chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: indices.map(function (i) {
          return i.parkruns;
        }),
        datasets: [
          {
            label: athleteInfo,
            data: indices.map(function (i) {
              return {
                x: i.parkruns,
                y: i.wilsonIndex,
                event: i.event,
              };
            }),
            borderColor: getDatasetColor(0),
            backgroundColor: '#2b223d',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Wilson Index',
              font: {
                size: responsive.chart.fonts.axisTitle,
              },
            },
            ticks: {
              font: {
                size: responsive.chart.fonts.axisTicks,
              },
            },
            suggestedMax: Math.ceil(
              Math.max.apply(
                Math,
                _toConsumableArray(
                  indices.map(function (i) {
                    return i.wilsonIndex;
                  })
                )
              ) * 1.1
            ), // Add 10% padding
          },
          x: {
            title: {
              display: true,
              text: 'parkruns',
              font: {
                size: responsive.chart.fonts.axisTitle,
              },
            },
            ticks: {
              font: {
                size: responsive.chart.fonts.axisTicks,
              },
            },
            min: 0,
            suggestedMax: Math.ceil(indices.length * 1.1), // Initial padding
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Wilson Index Progress',
            font: {
              size: responsive.chart.fonts.title,
            },
          },
          legend: {
            labels: {
              font: {
                size: responsive.chart.fonts.legend,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function label(context) {
                var point = context.raw;
                return ['Wilson Index: '.concat(point.y), 'Event: '.concat(point.event)];
              },
            },
            titleFont: {
              size: responsive.chart.fonts.tooltipTitle,
            },
            bodyFont: {
              size: responsive.chart.fonts.tooltipBody,
            },
          },
        },
      },
    });
    return chart;
  }

  /**
   * Fetches text content from a URI with caching support
   * @param {string} uri - The URI to fetch from
   * @param {string} cacheKey - The key to use for caching
   * @param {number} [cacheTtlMs=3600000] - Cache TTL in milliseconds (default: 1 hour)
   * @returns {Promise<string>} - The fetched text content
   */
  function fetchWithCache(_x, _x2) {
    return _fetchWithCache.apply(this, arguments);
  }
  function _fetchWithCache() {
    _fetchWithCache = _asyncToGenerator(
      /*#__PURE__*/ _regenerator().m(function _callee3(uri, cacheKey) {
        var cacheTtlMs,
          cached,
          _JSON$parse,
          data,
          timestamp,
          isFresh,
          _args3 = arguments;
        return _regenerator().w(function (_context3) {
          while (1)
            switch (_context3.n) {
              case 0:
                cacheTtlMs =
                  _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : 60 * 60 * 1000;
                cached = sessionStorage.getItem(cacheKey);
                if (!cached) {
                  _context3.n = 1;
                  break;
                }
                ((_JSON$parse = JSON.parse(cached)),
                  (data = _JSON$parse.data),
                  (timestamp = _JSON$parse.timestamp));
                isFresh = Date.now() - timestamp < cacheTtlMs;
                if (!isFresh) {
                  _context3.n = 1;
                  break;
                }
                return _context3.a(2, data);
              case 1:
                return _context3.a(
                  2,
                  fetch(uri)
                    .then(function (response) {
                      if (!response.ok) {
                        throw new Error(
                          'Failed to fetch: '
                            .concat(response.status, ' ')
                            .concat(response.statusText)
                        );
                      }
                      return response.text();
                    })
                    .then(function (text) {
                      sessionStorage.setItem(
                        cacheKey,
                        JSON.stringify({
                          data: text,
                          timestamp: Date.now(),
                        })
                      );
                      return text;
                    })
                    .catch(function (error) {
                      console.error('Error fetching '.concat(uri, ':'), error);
                      if (cached) {
                        console.warn('Using stale cached data after fetch failure');
                        return JSON.parse(cached).data;
                      }
                      throw error;
                    })
                );
            }
        }, _callee3);
      })
    );
    return _fetchWithCache.apply(this, arguments);
  }
  function fetchFriendResults(_x3) {
    return _fetchFriendResults.apply(this, arguments);
  }
  function _fetchFriendResults() {
    _fetchFriendResults = _asyncToGenerator(
      /*#__PURE__*/ _regenerator().m(function _callee4(athleteId) {
        var cacheKey,
          uri,
          text,
          parser,
          doc,
          table,
          h2Element,
          friendInfo,
          friendEvents,
          friendIndices;
        return _regenerator().w(function (_context4) {
          while (1)
            switch (_context4.n) {
              case 0:
                cacheKey = 'parkrunner_'.concat(athleteId, '_all');
                uri = ''.concat(window.location.origin, '/parkrunner/').concat(athleteId, '/all/');
                _context4.n = 1;
                return fetchWithCache(uri, cacheKey);
              case 1:
                text = _context4.v;
                parser = new DOMParser();
                doc = parser.parseFromString(text, 'text/html');
                table = findResultsTable(doc);
                if (table) {
                  _context4.n = 2;
                  break;
                }
                console.error('Friend results table not found');
                return _context4.a(2, null);
              case 2:
                h2Element = doc.querySelector('h2');
                if (h2Element) {
                  _context4.n = 3;
                  break;
                }
                console.error('Friend H2 element not found');
                return _context4.a(2, null);
              case 3:
                friendInfo = extractAthleteInfo(h2Element);
                if (friendInfo) {
                  _context4.n = 4;
                  break;
                }
                console.error('Could not extract friend athlete info');
                return _context4.a(2, null);
              case 4:
                friendEvents = extractEventDetails(table);
                friendIndices = calculateWilsonIndexOverTime(friendEvents);
                return _context4.a(2, {
                  friendIndices: friendIndices,
                  friendInfo: friendInfo,
                });
            }
        }, _callee4);
      })
    );
    return _fetchFriendResults.apply(this, arguments);
  }
  function createComparisonUI(container, onCompare) {
    var responsive = getResponsiveConfig();
    var form = document.createElement('form');
    form.style.marginBottom = responsive.form.marginBottom;
    form.style.textAlign = 'center';
    form.style.display = responsive.form.layout.display;
    form.style.flexDirection = responsive.form.layout.flexDirection;
    form.style.gap = responsive.form.layout.gap;
    form.style.alignItems = responsive.form.layout.alignItems;
    var input = document.createElement('input');
    input.style.width = responsive.form.input.width;
    input.style.maxWidth = responsive.form.input.maxWidth;
    input.type = 'text';
    input.placeholder = "Enter friend's athlete ID (e.g. A507)";
    input.style.padding = responsive.form.input.padding;
    input.style.marginRight = responsive.form.input.marginRight;
    input.style.borderRadius = '3px';
    input.style.border = '1px solid #ffa300';
    input.style.backgroundColor = '#2b223d';
    input.style.color = '#ffa300';
    input.style.fontSize = responsive.typography.input;
    var button = document.createElement('button');
    button.textContent = 'Compare';
    button.style.padding = responsive.form.button.padding;
    button.style.width = responsive.form.button.width;
    button.style.maxWidth = responsive.form.button.maxWidth;
    button.style.backgroundColor = '#ffa300';
    button.style.color = '#2b223d';
    button.style.border = 'none';
    button.style.borderRadius = '3px';
    button.style.cursor = 'pointer';
    button.style.fontSize = responsive.typography.button;
    button.style.fontWeight = 'bold';
    form.appendChild(input);
    form.appendChild(button);
    form.addEventListener(
      'submit',
      /*#__PURE__*/ (function () {
        var _ref = _asyncToGenerator(
          /*#__PURE__*/ _regenerator().m(function _callee(e) {
            var athleteId, _yield$fetchFriendRes, friendIndices, friendInfo, _t;
            return _regenerator().w(
              function (_context) {
                while (1)
                  switch ((_context.p = _context.n)) {
                    case 0:
                      e.preventDefault();
                      athleteId = input.value.trim().replace(/^[aA]/, '');
                      if (athleteId) {
                        _context.n = 1;
                        break;
                      }
                      return _context.a(2);
                    case 1:
                      button.disabled = true;
                      button.textContent = 'Loading...';
                      _context.p = 2;
                      _context.n = 3;
                      return fetchFriendResults(athleteId);
                    case 3:
                      _yield$fetchFriendRes = _context.v;
                      friendIndices = _yield$fetchFriendRes.friendIndices;
                      friendInfo = _yield$fetchFriendRes.friendInfo;
                      onCompare(friendIndices, friendInfo);
                      _context.n = 5;
                      break;
                    case 4:
                      _context.p = 4;
                      _t = _context.v;
                      console.error("Failed to fetch friend's results:", _t);
                      alert("Failed to fetch friend's results. Please check the ID and try again.");
                    case 5:
                      _context.p = 5;
                      button.disabled = false;
                      button.textContent = 'Compare';
                      return _context.f(5);
                    case 6:
                      return _context.a(2);
                  }
              },
              _callee,
              null,
              [[2, 4, 5, 6]]
            );
          })
        );
        return function (_x4) {
          return _ref.apply(this, arguments);
        };
      })()
    );
    container.insertBefore(form, container.firstChild);
  }
  function updateChart(chart, friendIndices, friendInfo) {
    var datasetIndex = chart.data.datasets.length;
    var friendDataset = {
      label: friendInfo,
      data: friendIndices.map(function (i) {
        return {
          x: i.parkruns,
          y: i.wilsonIndex,
          event: i.event,
        };
      }),
      borderColor: getDatasetColor(datasetIndex),
      backgroundColor: '#2b223d',
    };
    chart.data.datasets.push(friendDataset);
    chart.update();
    var maxParkruns = Math.max.apply(
      Math,
      _toConsumableArray(
        chart.data.datasets.flatMap(function (dataset) {
          return dataset.data.map(function (d) {
            return d.x;
          });
        })
      )
    );
    var maxWilsonIndex = Math.max.apply(
      Math,
      _toConsumableArray(
        chart.data.datasets.flatMap(function (dataset) {
          return dataset.data.map(function (d) {
            return d.y;
          });
        })
      )
    );
    chart.options.scales.x.suggestedMax = Math.ceil(maxParkruns * 1.1);
    chart.options.scales.y.suggestedMax = Math.ceil(maxWilsonIndex * 1.1);
    chart.update();
  }
  function extractAthleteInfo(h2Element) {
    return h2Element.textContent.trim();
  }
  function getDatasetColor(index) {
    var colors = [
      '#FFA300',
      '#90EE90',
      '#FF69B4',
      '#4169E1',
      '#FFD700',
      '#9370DB',
      '#20B2AA',
      '#FF6347',
      '#DDA0DD',
      '#00CED1',
    ];
    return colors[index % colors.length];
  }
  function displayWilsonIndex() {
    var table = findResultsTable(document);
    if (!table) {
      console.error('Results table not found');
      return;
    }
    var h2Element = document.querySelector('h2');
    if (!h2Element) {
      console.error('H2 element not found');
      return;
    }
    var athleteInfo = extractAthleteInfo(h2Element);
    if (!athleteInfo) {
      console.error('Could not extract athlete info');
      return;
    }
    var eventDetails = extractEventDetails(table);
    var wilsonIndex = calculateWilsonIndex(eventDetails);
    var wilsonIndices = calculateWilsonIndexOverTime(eventDetails);
    if (h2Element) {
      var responsive = getResponsiveConfig();
      var container = document.createElement('div');
      container.id = 'w-index-display';
      container.style.width = '100%';
      container.style.maxWidth = '800px';
      container.style.margin = ''.concat(responsive.container.marginTop, ' auto');
      container.style.backgroundColor = '#2b223d';
      container.style.padding = responsive.container.padding;
      container.style.borderRadius = '5px';
      var wilsonElement = document.createElement('div');
      wilsonElement.textContent = 'Wilson index: '.concat(wilsonIndex);
      wilsonElement.style.fontSize = responsive.typography.wilsonIndex;
      wilsonElement.style.color = '#ffa300';
      wilsonElement.style.fontWeight = 'bold';
      wilsonElement.style.marginBottom = responsive.spacing.small;
      wilsonElement.style.textAlign = 'center';
      container.appendChild(wilsonElement);
      var chartInstance = createWilsonGraph(wilsonIndices, container, athleteInfo);
      createComparisonUI(
        container,
        /*#__PURE__*/ (function () {
          var _ref2 = _asyncToGenerator(
            /*#__PURE__*/ _regenerator().m(function _callee2(friendIndices, friendInfo) {
              return _regenerator().w(function (_context2) {
                while (1)
                  switch (_context2.n) {
                    case 0:
                      updateChart(chartInstance, friendIndices, friendInfo);
                    case 1:
                      return _context2.a(2);
                  }
              }, _callee2);
            })
          );
          return function (_x5, _x6) {
            return _ref2.apply(this, arguments);
          };
        })()
      );
      h2Element.parentNode.insertBefore(container, h2Element.nextSibling);
    }
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      calculateWilsonIndex: calculateWilsonIndex,
      calculateWilsonIndexOverTime: calculateWilsonIndexOverTime,
      extractEventDetails: extractEventDetails,
      findResultsTable: findResultsTable,
    };
  } else {
    displayWilsonIndex();
  }
})();
