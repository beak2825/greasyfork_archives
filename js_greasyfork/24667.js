// ==UserScript==
// @name        Google Play Review Rating Filter
// @version     1.1.1
// @description Adds checkboxes to Google Play to filter app reviews based on their star rating out of five
// @icon        https://s2.googleusercontent.com/s2/favicons?domain=https%3A%2F%2Fplay.google.com
// @namespace   http://www.qzdesign.co.uk/userscripts/
// @include     https://play.google.com/*
// @include     http://play.google.com/*
// @run-at      document-end
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24667/Google%20Play%20Review%20Rating%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/24667/Google%20Play%20Review%20Rating%20Filter.meta.js
// ==/UserScript==

//'use strict';
/// false = no debug logging, true = some debug logging, 2 = extra debug logging
var debug = false;
try {

if (debug) console.log('GPRRF included');

// Avoid any possible jQuery conflict
if (typeof this !== 'undefined') {
  this.$ = this.jQuery = jQuery.noConflict(true);
}

/**
 * Set up prototypal inheritance.
 * @param sup `Function` that is the superclass's constructor
 * @param methods Object whose properties are methods to set in the prototype
 */
Function.prototype.gprrfExtend = function(sup, methods) {
  this.prototype = Object.create(sup.prototype);
  this.prototype.constructor = this;
  $.extend(this.prototype, methods);
};

/**
 * Class for hooking `XMLHttpRequest`
 */
var XMLHttpRequestHook = (function() {
  /**
   * Constructor
   * @param initData Object whose properties will be initially copied to the
   *        instance
   */
  function XMLHttpRequestHook(initData) {
    if (initData) {
      $.extend(this, initData);
    }
    activeHooks.push(this);
  }

  /** Array of currently active `XMLHttpRequestHook` objects */
  var activeHooks = [];
  /** Stores the original `XMLHttpRequest.prototype.open` */
  var xhrOpen = XMLHttpRequest.prototype.open;
  /** Like `Object.getOwnPropertyDescriptor` but traverses prototype chain */
  var getPropertyDescriptor = function(obj, prop) {
    return Object.getOwnPropertyDescriptor(obj, prop) ||
      getPropertyDescriptor(Object.getPrototypeOf(obj), prop);
  };

  /** Function to override `XMLHttpRequest.prototype.open` with */
  var xhrOpenHook = function() {
    if (debug > 1) console.log('XHR[%o] open(%o)', this, arguments);
    if (debug > 1) console.log('activeHooks: %o', activeHooks);
    // See if any active `XMLHttpRequestHook` will handle the request
    for (var i = 0, l = activeHooks.length; i < l; ++i) {
      var xhrHook = activeHooks[i];
      // Prepend the `XMLHttpRequest` object to the arguments
      if (xhrHook.open.bind(xhrHook, this).apply(void 0, arguments)) {
        if (debug > 1) console.log('XHR hooked for this request');
        return;
      }
    }
    // Otherwise call the original `XMLHttpRequest` method
    if (debug > 1) console.log('Passing on XHR request not hooked');
    return xhrOpen.apply(this, arguments);
  };

  // Assign the replacement `XMLHttpRequest.prototype.open`...
  // Handle running in a sandbox
  var pluginWrappedXMLHttpRequest = typeof exportFunction !== 'undefined' && (
    // Unified Script Injector
    XMLHttpRequest.wrappedJSObject ||
    // GreaseMonkey 4.x+
    unsafeWindow && unsafeWindow !== window && unsafeWindow.XMLHttpRequest
  );
  if (pluginWrappedXMLHttpRequest) {
    if (debug > 1) console.log('XMLHttpRequest wrapped by browser plugin');
    pluginWrappedXMLHttpRequest.prototype.open = exportFunction(
      xhrOpenHook,
      pluginWrappedXMLHttpRequest.prototype
    );
  } else {
    if (debug > 1) console.log('Modifying XMLHttpRequest directly (no sandbox)');
    XMLHttpRequest.prototype.open = xhrOpenHook;
  }

  // Define `XMLHttpRequestHook` prototype methods
  XMLHttpRequestHook.gprrfExtend(Object, {
    /**
     * This method is called in response to a call to
     * `XMLHttpRequest.prototype.open()`.  This default implementation hooks the
     * request so that the `send()` and `done()` methods will be called
     * accordingly, makes the `responseText`, `status` and `readyState`
     * properties writable, calls the original
     * `XMLHttpRequest.prototype.open()`, and returns `true`.
     * Overridden implementations should return `false` and not call this
     * implementation if the request should not be hooked.
     *
     * @param xhr The `XMLHttpRequest` object.
     * The other parameters are as for `XMLHttpRequest.prototype.open`
     *
     * @return `true` if the request has been hooked and the original
     * `XMLHttpRequest.prototype.open` should not now be called, `false`
     * otherwise.
     */
    open: function(xhr, method, url, async, user, password) {
      try {
        if (debug > 1) console.log('XHRH open(%o)', arguments);
        var xhrHook = this;
        /** Holder for `XMLHttpRequest` properties that will be overridden */
        var xhrProps = {
          // Store any value (or lack of) already set for `onreadystatechange`
          onreadystatechange: xhr.onreadystatechange
        };
        // Store original `send` property (usually from the prototype)
        xhr.orgSend = xhr.send;
        // Replace `XMLHttpRequest.prototype.send` for this instance
        xhr.send = function() {
          if (debug > 1) console.log('XHR[%o] send(%o)', this, arguments);
          // Prepend the `XMLHttpRequest` object to the arguments
          return xhrHook.send.bind(xhrHook, this).apply(void 0, arguments);
        };
        // Set the `onreadystatechange` function before redefining the property
        xhr.onreadystatechange = function() {
          if (debug > 1) console.log('XHR[%o] orsc(%o)', this, arguments);
          if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Prepend the `XMLHttpRequest` object to the arguments
            return xhrHook.done.bind(xhrHook, this).apply(void 0, arguments);
          }
          // `xhr.onreadystatechange` will be the redefined property here
          if (xhr.onreadystatechange) {
            return xhr.onreadystatechange.apply(this, arguments);
          }
        };
        // Redefine `onreadystatechange` to have the value in `xhrProps`.
        // Make `responseText`, `status` and `readyState` properties writable.
        var props = [
          'onreadystatechange', 'responseText', 'status', 'readyState'
        ];
        props.forEach(function(prop) {
          var orgDescriptor = getPropertyDescriptor(xhr, prop);
          Object.defineProperty(xhr, prop, {
            get: function() {
              if (prop in xhrProps) {
                return xhrProps[prop];
              } else if (orgDescriptor.get) {
                return orgDescriptor.get.call(this);
              } else {
                return orgDescriptor.value;
              }
            },
            set: function(v) {
              if (debug > 1) console.log('set prop %s = %o', prop, v);
              xhrProps[prop] = v;
            },
            configurable: true,
            enumerable: true
          });
        });
        // Handle running in a Sandbox (i.e. in Unified Script Injector)
        if (xhr.wrappedJSObject && typeof exportFunction !== 'undefined') {
          if (debug > 1) console.log('XHR object wrapped by browser plugin');
          xhr.wrappedJSObject.send = exportFunction(
            xhr.send,
            xhr.wrappedJSObject
          );
          props.forEach(function(prop) {
            var pd = getPropertyDescriptor(xhr, prop);
            pd.set = exportFunction(pd.set, xhr.wrappedJSObject);
            pd.get = exportFunction(pd.get, xhr.wrappedJSObject);
            Object.defineProperty(xhr.wrappedJSObject, prop, pd);
          });
        }
        // Call original `XMLHttpRequest.prototype.open` with first argument as
        // `this` instead of being an argument
        Function.prototype.call.apply(xhrOpen, arguments);
        // The request has been hooked
        return true;
      }
      catch (e) {
        if (console && console.error) console.error('%o\n%o', e, e.stack);
        return false;
      }
    },

    /**
     * Called in response to a call to `send` on an `XMLHttpRequest` object
     * which was hooked by `XMLHttpRequestHook.prototype.open()`.
     *
     * @param xhr The `XMLHttpRequest` object.
     * The other parameters are as for `XMLHttpRequest.prototype.send`
     */
    send: function(xhr, data) {
      if (debug > 1) console.log('XHRH send(%o)', arguments);
      // Call original `xhr.send` with first argument as `this` instead of being
      // an argument
      return Function.prototype.call.apply(xhr.orgSend, arguments);
    },

    /**
     * Called in response to a chrome call to `onreadystatechange` for an
     * `XMLHttpRequest` object which was hooked by
     * `XMLHttpRequestHook.prototype.open()` when the `readyState` is
     * `XMLHttpRequest.DONE` and `status` is 200.
     *
     * If a content code has set an `onreadystatechange` function, this method
     * calls it after setting the `readyState` to `DONE` and `status` to 200, so
     * it can be called explicitly to return a response after setting the
     * `responseText` property.
     *
     * @param xhr The `XMLHttpRequest` object.
     */
    done: function(xhr) {
      if (debug > 1) console.log('XHRH done(%o)', arguments);
      xhr.status = 200;
      xhr.readyState = XMLHttpRequest.DONE;
      if (xhr.onreadystatechange) {
        // Call original `xhr.onreadystatechange` with first argument as `this`
        // instead of being an argument
        return Function.prototype.call.apply(xhr.onreadystatechange, arguments);
      }
    },

    /** Disable this hook */
    destruct: function() {
      activeHooks = activeHooks.filter(function(e) { return e !== this; });
    }
  });

  return XMLHttpRequestHook;
})();

$(function() {
  /**
   * Constructs a query string from an object's properties.  Like
   * `jQuery.param()` but does not use `encodeURIComponent`, instead assuming
   * properties and values are already suitably URI-encoded.  Google does not
   * expect spaces encoded as plus signs which is what it gets when
   * `jQuery.post()` is called with `data` as an object.
   */
  function param(obj) {
    var params = [];
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        params.push(k + '=' + obj[k]);
      }
    }
    return params.join('&');
  }
  /**
   * Perform the reverse of `param()`, i.e. construct object from query string
   */
  function deparam(queryString) {
    var obj = {};
    queryString.split('&').forEach(function(param) {
      var parts = param.split('=');
      var k = parts.shift();
      obj[k] = parts.join('='); // join in case of stray '='
    });
    return obj;
  }

  /**
   * Identity function.  Useful for `Array.prototype.some` and
   * `Array.prototype.every` when used on an array of booleans.
   */
  function identityFunction(v) { return v; }

  /**
   * Add the checkboxes to the UI for selecting which review ratings to filter.
   * Grab the total review count from the page.
   */
  function initialize() {
    totalNumReviews = +$('span.reviews-num').text().replace(/[,.]/g, '');
    if (debug) console.log('Total number of reviews: %d', totalNumReviews);
    if ($ratingsFilters) {
      $ratingsFilters.remove();
    }
    $ratingsFilters = $('<div class="review-filter"/>')
      .appendTo('div.review-filters')
      .change(function() {
        // Trigger a click on the currently selected sort order item to get
        // Google's script to fetch reviews afresh
        $('.id-review-sort-filter .dropdown-child.selected').click();
      });
    for (var i = 1; i <= 5; ++i) {
      $('<label/>')
        .text(i + '*')
        .prepend($('<input/>').attr({
          type: 'checkbox',
          id: 'review-filter-' + i + '-star',
          checked: ''
        }))
        .appendTo($ratingsFilters);
    }
  }

  /**
   * Extend `XMLHttpRequestHook` to only hook POST requests in which the path
   * part of the URL matches a specific string
   *
   * @param urlPath string which the path part of the URL must match
   * @param initData instance data and methods to set as properties
   */
  function GooglePlayXMLHttpRequestHook(urlPath, initData) {
    XMLHttpRequestHook.call(this, initData);
    this.urlPath = urlPath;
  }

  // Define `GooglePlayXMLHttpRequestHook` prototype methods
  GooglePlayXMLHttpRequestHook.gprrfExtend(XMLHttpRequestHook, {
    /**
     * @return `true` if the request should be hooked.
     * Parameters as for `open`.
     */
    hook: function(xhr, method, url) {
      return method === 'POST' && url &&
        this.urlPath ===
          url.replace(/^(?:https?:)?\/\/play\.google\.com/, '').split('?', 1)[0]
      ;
    },
    open: function(xhr, method, url) {
      return this.hook.apply(this, arguments) &&
        XMLHttpRequestHook.prototype.open.apply(this, arguments)
      ;
    }
  });

  /** The total number of reviews */
  var totalNumReviews;
  /** jQuery object for element containing rating filter checkboxes */
  var $ratingsFilters;

  /** The main `XMLHttpRequestHook` for marshalling review data */
  var getReviewsHook = new GooglePlayXMLHttpRequestHook('/store/getreviews', {
    /**
     * Array of Objects containing data about each pending request.  Each object
     * has the following properties:
     * - `pageNum`: The requested page number of the paged data;
     * - `postParams`: The parameters that are sent in the POST request body to
     *   Google Play, but without the `pageNum` parameter;
     * - `filters`: Array of booleans indexed by 'star rating' indicating
     *   whether reviews with this rating should be included in the results;
     * - `xhr`: The `XMLHttpRequest` object for the request;
     * - `fullDataKey`: Property key for `data` where data from unfiltered
     *   results obtained from Google is stored per-page;
     * - `filteredDataKey`: Property key for `filteredData` where data about the
     *   results obtained from Google, with the selected filters applied, is
     *   stored per-page.
     */
    pendingRequests: [],
    /**
     * Object whose property keys are a serialized representation of request
     * parameters without the page number or any rating filter selection, and
     * whose values are an array of objects, indexed by page number, containing
     * review data retrieved via AJAX.
     */
    data: {},
    /**
     * Object whose property keys are a serialized representation of request
     * parameters, including rating filter selections, but without the page
     * number, and whose values are an array of objects, indexed by page number,
     * containing review data retrieved via AJAX filtered according to rating.
     */
    filteredData: {},

    /**
     * Grab the current set of rating filters selected in the UI.
     * Don't bother hooking the request if all ratings selected.
     * Store the URL to use for internal AJAX requests.
     */
    hook: function(xhr, method, url) {
      if (GooglePlayXMLHttpRequestHook.prototype.hook.apply(this, arguments)) {
        if (/^([a-z]+:)?\/\//.test(url)) {
          /** URL to use for internal AJAX requests */
          this.requestURL = url;
        } else {
          // `url` does not include host
          var origin = location.protocol + '//' + location.hostname +
            (location.port ? ':' + location.port : '');
          if (url[0] === '/') {
            this.requestURL = origin + url;
          } else {
            this.requestURL =
              origin + location.pathname.replace(/[^\/]+$/, '') + url;
          }
        }
        // Which filters are selected?
        var filters = this.filters = [];
        $ratingsFilters.find('input').each(function() {
          filters[+(/^review-filter-(\d)-star$/.exec(this.id)[1])] =
            this.checked;
        });
        return !filters.every(identityFunction);
      } else {
        return false;
      }
    },

    /**
     * If the request is for review data, and is not an internal request made by
     * this script, create a pending request and then process pending requests
     * instead of calling `XMLHttpRequest.prototype.send()`.
     */
    send: function(xhr, data) {
      try {
        if (data) {
          var postParams = deparam(data);
          if (postParams.gprrfInternal) {
            // Internal request by this script
            if (debug > 1) console.log('Not hooking internal XHR request');
            delete postParams.gprrfInternal;
            return GooglePlayXMLHttpRequestHook.prototype.send.call(
              this,
              xhr,
              param(postParams)
            );
          } else {
            // Create a new request
            var rq = {
              pageNum: +postParams.pageNum,
              postParams: postParams,
              filters: this.filters,
              xhr: xhr
            };
            // Choose data keys unique to the set of parameters
            delete postParams.pageNum;
            var dataKeyParts = [];
            Object.keys(postParams).sort().forEach(function (key) {
              dataKeyParts.push(key + '=' + postParams[key]);
            });
            rq.fullDataKey = this.lastDataKey = dataKeyParts.join('&');
            rq.filteredDataKey =
              rq.fullDataKey + '&' + JSON.stringify(rq.filters);
            this.data[rq.fullDataKey] = this.data[rq.fullDataKey] || [];
            this.filteredData[rq.filteredDataKey] =
              this.filteredData[rq.filteredDataKey] || [];
            // Add request as pending and process, but do not call super:
            // `done()` will be called directly when the data is ready.
            this.pendingRequests.push(rq);
            if (debug) console.log('New request: %o', rq);
            return this.processPendingRequests();
          }
        }
        // Call super
        return GooglePlayXMLHttpRequestHook.prototype.send.apply(
          this,
          arguments
        );
      } catch (e) {
        if (console && console.error) console.error('%o\n%o', e, e.stack);
      }
    },

    /**
     * Process all pending requests.  When there are no pending requests,
     * possibly reclaim memory by removing obsolete data.
     */
    processPendingRequests: function() {
      this.pendingRequests = this.pendingRequests.filter(
        this.processRequest,
        this
      );
      if (!this.pendingRequests.length) {
        // Reclaim memory by discarding data obtained with different parameters
        [this.data, this.filteredData].forEach(function(d) {
          for (var k in d) {
            if (k.substr(0, this.lastDataKey.length) !== this.lastDataKey) {
              if (debug) console.log('Removing data with key %s', k);
              delete d[k];
            }
          }
        }, this);
      }
    },

    /**
     * Process a request.  If there is enough data to satisfy the request,
     * `done()` will be called with responseText set to the result, otherwise
     * more data will be requested via AJAX.
     *
     * @param rq Object containing data about the request
     *
     * @return `true` if the request is still pending, `false` if it is complete
     * or has failed (so the method can be used with `Array.prototype.filter`).
     */
    processRequest: function(rq) {
      function debugInfo() {
        return 'spn=' + srcPageNum + ' dpn=' + destPageNum +
          ' dprc=' + destPageReviewCount + ' dppc=' + destPagePageCount;
      }
      try {
        // Iterate through source pages working out how many are needed to get
        // enough reviews on each destination page.  Request source page data as
        // required.  When there is enough data to return for the requested
        // destination page, return it.  This involves iterating at least to the
        // next page to determine if the requested page would be the last.
        // This is slightly inefficient because after data is requested, the
        // iteration will begin at the start again when it is received.
        var srcPageNum = 0;
        var destPageNum = 0;
        var destPageReviewCount = 0;
        var destPagePageCount = 0;
        var nodesToInclude = [];
        for (;;) {
          var prevSrcPageData = srcPageData;
          var srcPageData = this.getFilteredSrcPageData(rq, srcPageNum);
          if (!srcPageData) {
            if (debug) console.log('requested more data: %s', debugInfo());
            return true; // Data has been requested, come back when it arrives
          }
          // Update counts for current destination page
          destPageReviewCount += srcPageData.numReviews;
          ++destPagePageCount;
          if (debug > 1) console.log('in loop: %s', debugInfo());
          // Include filtered nodes if destination page is requested page
          if (destPageNum === rq.pageNum) {
            Array.prototype.push.apply(nodesToInclude, srcPageData.nodes);
          }
          // Advance to next destination page if enough reviews found for
          // current:
          // - Try to get at least 3 reviews;
          // - On the first page, aim for more than will fit on the screen to
          //   avoid a Google bug where the next page is immediately requested
          //   but the requested page number is one after the last page that
          //   was requested for the previous result set;
          // - If there is at least one review, don't request more than 5 pages
          //   worth of data looking for more (too many rapid requests may
          //   trigger a temporary IP ban by Google);
          // - Bail after 10 pages of data have not yielded any reviews, for the
          //   same reason;
          if (
            destPageReviewCount >= (destPageNum === 0 ? 7 : 3) ||
            destPageReviewCount && destPagePageCount >= 5 ||
            destPagePageCount >= 10
          ) {
            if (debug) console.log('next dest page: %s', debugInfo());
            ++destPageNum;
            destPageReviewCount = 0;
            destPagePageCount = 0;
          }
          // Done?
          var anyFilter = anyFilter || rq.filters.some(identityFunction);
          if (
            // End if there are no more source pages
            !srcPageData.fullData.numReviews ||
            srcPageData.fullData.responseCode == 2 ||
            // End if on or past a non-empty destination page after the one
            // requested
            destPageNum > rq.pageNum + 1 ||
            destPageNum > rq.pageNum && destPageReviewCount ||
            // End if all filters unchecked.
            // Wait until now so that there is a JSON data template to use.
            !anyFilter
          ) {
            break;
          }
          // Advance to next source page
          if (rq.postParams.reviewSortOrder == 1 && !srcPageData.numReviews) {
            // No reviews on this page, and sorting by rating.
            // Binary search to find next page with reviews.
            // What rating to look for next?
            var ratingSought = 0;
            for (var i = 1; !srcPageData.fullData.hasRating[i] && i <= 5; ++i) {
              if (rq.filters[i]) {
                ratingSought = i;
              }
            }
            var pageBefore = 0;
            var pageAfter = Math.floor(
              (totalNumReviews - 1) /
              this.data[rq.fullDataKey][0].numReviews + 1
            );
            var pageOutOfRange = false;
            while (pageBefore + 1 < pageAfter) {
              // Try to get there more quickly if last page out of range
              // - there could be millions of reviews but only a few in the set
              var midPage = pageOutOfRange && pageBefore + 3 < pageAfter
                ? Math.floor((pageAfter + pageBefore * 3) / 4)
                : Math.floor((pageAfter + pageBefore) / 2);
              var midPageData = this.getFilteredSrcPageData(rq, midPage);
              if (!midPageData) {
                return true; // Data has been requested, come back later
              }
              pageOutOfRange = !midPageData.fullData.numReviews;
              if (pageOutOfRange) {
                pageAfter = midPage;
              } else {
                // If there are ratings equal or below the desired rating,
                // the mid page is after the sought page
                for (var i = 1; i <= ratingSought; ++i) {
                  if (midPageData.fullData.hasRating[i]) {
                    pageAfter = midPage;
                    break;
                  }
                }
                if (pageAfter !== midPage) {
                  pageBefore = midPage;
                }
              }
            }
            if (debug) console.log('spn: %d -> %d', srcPageNum, pageAfter);
            if (debug) console.assert(pageAfter > srcPageNum, 'Error!');
            srcPageNum = pageAfter;
          } else {
            ++srcPageNum;
          }
        }
        // Send the response to the content code...
        if (debug > 1) console.log('Delivering response to web page...');
        // Need to indicate if this is the last page.
        var isLastPage = destPageNum <= rq.pageNum ||
          destPageNum <= rq.pageNum + 1 && !destPageReviewCount;
        // Use some data obtained from Google as a template, so the response is
        // as consistent as possible with what is expected.
        var templateSrcPageData = (
          isLastPage && srcPageData.responseText || !prevSrcPageData
            ? srcPageData : prevSrcPageData
        ).fullData;
        var jsonData = [[
          templateSrcPageData.responseText, ///< "ecr"
          // Ensure 2 is returned for the last page
          isLastPage && templateSrcPageData.responseCode != 2
            ? 2 : templateSrcPageData.responseCode,
          // Ensure something is returned if there are no reviews, otherwise
          // the UI doesn't get updated
          $('<body/>').append(
            nodesToInclude.length || rq.pageNum
              ? $(nodesToInclude).clone()
              : $('<p/>').text(
                rq.postParams.reviewSortOrder == 1
                  ? 'No matching reviews could be obtained'
                  : 'No reviews found'
              )
          ).html(),
          rq.pageNum
        ]];
        if (debug) console.log('done: %s ilp=%o', debugInfo(), isLastPage);
        if (debug) console.log(
          'template=%o, nodes=%o, response=%o, this=%o',
          templateSrcPageData, nodesToInclude, jsonData, this
        );
        // Inlcude the preceding junk ")]}'\n\n" in the response
        rq.xhr.responseText =
          templateSrcPageData.junkBefore + JSON.stringify(jsonData);
        // Use `setTimeout` in case of immediate result in `send()`
        setTimeout(this.done.bind(this, rq.xhr), 0);
        // Request has been processed, remove it from 'pending' list
        return false;
      }
      catch (e) {
        if (console && console.error) console.error('%o\n%o', e, e.stack);
        return false;
      }
    },

    /**
     * Obtain and cache data for a page of reviews with a particular set of
     * parameters, filtered according to the requested ratings.  If data is not
     * yet available, it is requested via AJAX.
     *
     * @param rq An object containing parameters and details of the request
     * @param pageNum The page index of the source data to return
     *
     * @return If the data is not yet available, the return value is undefined.
     * Otherwise, an object with the following properties is returned:
     * - `nodes`: An array of `HTMLElement` objects which are either reviews
     *   which pass the filters or developer replies thereof;
     * - `numReviews`: The number of reviews in the filtered page data;
     * - `fullData`: The unfiltered data, an object with these properties:
     *   - `$domFragment`: A jQuery object which contains one HTML element whose
     *     children are the reviews and developer replies;
     *   - `numReviews`: The number of reviews on this page;
     *   - `hasRating`: An array indexed by rating whose values are `true` if
     *     there are any reviews on the page with this rating; this information
     *     is used when binary-searching for the next page containing reviews
     *     that will pass filtering when reviews are sorted by rating;
     *   - `responseCode`: 1 = ok, 2 = last page, 3 = error, undefined if HTTP
     *     error or response not as expected;
     *   - `responseText`: Always seems to be "ecr";
     *   - `junkBefore`: All responses seem to be preceded with junk ")]}'\n\n".
     */
    getFilteredSrcPageData: function(rq, pageNum) {
      var data = this.data[rq.fullDataKey][pageNum];
      if (data) {
        var filteredData = this.filteredData[rq.filteredDataKey][pageNum];
        if (!filteredData) {
          filteredData = {
            fullData: data,
            nodes: [],
            numReviews: 0
          };
          data.hasRating = data.hasRating || [];
          data.$domFragment.find('div.current-rating').each(function() {
            var $this = $(this);
            var rating = Math.round(parseInt($this.css('width')) / 20);
            data.hasRating[rating] = true;
            if (rq.filters[rating]) {
              // Include this review, and any developer reply
              if (debug > 1) console.log('%d* review included', rating);
              var $review = $this.closest('div.single-review');
              Array.prototype.push.apply(
                filteredData.nodes,
                $review.add($review.next('div.developer-reply')).get()
              );
              ++filteredData.numReviews;
            }
          });
          if (debug) console.log(
            'filtered data for page %d: %o',
            pageNum, filteredData
          );
          this.filteredData[rq.filteredDataKey][pageNum] = filteredData;
        }
        return filteredData;
      } else {
        var jqPostParam = {
          url: this.requestURL,
          data: param($.extend({}, rq.postParams, {
            pageNum: pageNum,
            gprrfInternal: true ///< Flag not to hook this request
          })),
          dataType: 'text'
        };
        if (debug > 1) console.log(
          'Doing POST for source page %d: %o', pageNum, jqPostParam
        );
        var jqXhr = $.post(jqPostParam);
        if (debug > 1) {
          jqXhr.done(function() { console.log('$.post succeeded'); })
            .fail(function() { console.log('$.post failed'); });
        }
        jqXhr.always(this.receiveData.bind(this, rq.fullDataKey, pageNum));
      }
    },

    /**
     * Store data received via AJAX, then reprocess pending requests
     *
     * @param dataKey Serialized representation of the request parameters
     *   to use as the property key of data to set
     * @param pageNum The source page number of the data
     * @param data String containing the data received on success; on failure
     *   this will be a `jqXHR` object
     */
    receiveData: function(dataKey, pageNum, data) {
      var dataObj = {
        // defaults in case of error
        responseText: 'ecr',
        responseCode: 3,
        junkBefore: ''
      };
      if (debug > 1) console.log('receivedData: %o', data);
      if (typeof data === 'string') {
        var skipJunk = data.indexOf('[');
        try {
          var jsonData = JSON.parse(skipJunk ? data.substr(skipJunk) : data);
          if (
            jsonData.length > 0 &&
            jsonData[0].length > 3 &&
            jsonData[0][3] == pageNum
          ) {
            dataObj.$domFragment = $('<body/>').html(jsonData[0][2]);
            dataObj.responseText = jsonData[0][0]; // "ecr"
            dataObj.responseCode = jsonData[0][1]; // 1 ok, 2 last page, 3 error
          }
        } catch (e) {
          if (debug) console.error(e);
        }
        dataObj.junkBefore = data.substr(0, skipJunk); // ")]}'\n\n"
      }
      dataObj.$domFragment = dataObj.$domFragment || $([]);
      dataObj.numReviews =
        dataObj.$domFragment.find('div.single-review').length;
      if (debug) console.log(
        'received page %d, key %s: %o',
        pageNum, dataKey, dataObj
      );
      this.data[dataKey][pageNum] = dataObj;
      this.processPendingRequests();
    }
  });

  /**
   * Reinitialize when a new App page is loaded via AJAX
   */
  var loadPageHook = new GooglePlayXMLHttpRequestHook('/store/apps/details', {
    /**
     * Hook if the request contains a URL parameter `psid` with value 2, which
     * indicates a request for new App review content.
     */
    hook: function(xhr, method, url) {
      if (GooglePlayXMLHttpRequestHook.prototype.hook.apply(this, arguments)) {
        var urlParts = url.split('?', 2);
        if (debug) console.log(urlParts);
        return urlParts.length > 1 && deparam(urlParts[1]).psid == 2;
      } else {
        return false;
      }
    },
    done: function(xhr) {
      if (debug) console.log(xhr.responseURL);
      if (debug > 1) console.log(xhr.responseText);
      GooglePlayXMLHttpRequestHook.prototype.done.apply(this, arguments);
      initialize();
    }
  });

  // Initialize UI and review count for the page when first loaded
  initialize();
});

} catch (e) {
  if (console && console.error) console.error(
    'Error at line %d:\n%o\n%o', e.lineNumber, e, e.stack
  );
}
