// ==UserScript==
// @name soup.io: EmbedFix
// @namespace    http://xcvbnm.org/
// @author Nordern
// @description Repairs embeds in your own and your friend soup. Fixes embeds everywhere if there is a link in the description
// @version 0.2.1
// @match http://*.soup.io/*
// @match https://*.soup.io/*
// @exclude     http://www.soup.io/frames/*
// @exclude     http://www.soup.io/remote/*
// @license public domain, MediaEmbed has MIT Licence
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/34474/soupio%3A%20EmbedFix.user.js
// @updateURL https://update.greasyfork.org/scripts/34474/soupio%3A%20EmbedFix.meta.js
// ==/UserScript==
// Available on github under: https://github.com/edave64/souplements/blob/master/youtube-fix/
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * This code snippet allows you to intercept the loading of new elements and modify the loaded posts.
 * The basic idea is to allow filtering out posts before they are inserted into the dom, and thus before their assets
 * are loaded. This reduces stress on both the client and the asset servers.
 *
 * To use the filter, register the event "processBatch" in SOUP.Endless.
 * Example:
 *
 *     SOUP.Endless.on("processBatch", function (doc) {
 *         // your code here
 *     });
 *
 * The doc argument represents a temporary HTMLDocument node, storing the new loaded posts. You can work with it
 * like you can work with ''document''.
 *
 * Be careful to never remove all posts, otherwise Soup will assume you reached the end.
 *
 * Please keep in mind that soup already has some filters build in: http://faq.soup.io/post/4328678
 * These are probably easier on the servers.
 *
 * Licence: Public domain
 *
 * UPDATE 1.1:
 * The soup event-api was used! I just used it wrong. It is supposed to be a template. The event is now fired on
 * SOUP.Endless instead of SOUP.Events
 *
 * UPDATE 1.2:
 * Also trigger for loaded in reactions
 */
(function () {
    // Add events to SOUP.Endless
    if (!SOUP.Endless.trigger) {
        SOUP.tools.extend(SOUP.Endless, SOUP.Events);
    }

    if (Ajax.Request._EndlessFilter) return;

    var oldRequest = Ajax.Request;

    function getLoadAboveURL() {
        var url = $("endless_top_post").href;
        return url.match(/[&?]newer=1/) ? url : url + (url.indexOf("?") >= 0 ? "&" : "?") + "newer=1";
    }

    function getLoadBelowURL() {
        return SOUP.Endless.next_url.replace(/&?newer=1&?/g, "");
    }

    function catchBatchLoad (path, options) {
        var oldSuccess = options.onSuccess;
        options.onSuccess = function (response) {
            var text = response.responseText,
                pipePosition = text.indexOf("|"),
                nextPath = text.substring(0, pipePosition),
                content = text.substring(pipePosition + 1),
                parser = new DOMParser(),
                xmlDoc = parser.parseFromString(content, "text/html"),
                root = xmlDoc.body;

            root.setAttribute("id", "posts");
            SOUP.Endless.trigger("processBatch", xmlDoc);

            response.responseText = nextPath + "|" + root.innerHTML;

            return oldSuccess.apply(this, arguments);
        };

        return oldRequest.apply(this, arguments);
    }

    function catchPreviewLoad (path, options) {
        var oldSuccess = options.onSuccess;
        options.onSuccess = function (response) {
            var content = response.responseText,
                parser = new DOMParser(),
                xmlDoc = parser.parseFromString(content, "text/html"),
                root = xmlDoc.body;

            root.setAttribute("id", "posts");
            SOUP.Endless.trigger("processBatch", xmlDoc);

            response.responseText = root.innerHTML;

            return oldSuccess.apply(this, arguments);
        };

        return oldRequest.apply(this, arguments);
    }

    Ajax.Request = function (path, options) {
        var aboveURL = getLoadAboveURL();
        var belowURL = getLoadBelowURL();

        if (path === aboveURL || path === belowURL) {
            return catchBatchLoad.apply(this, arguments);
        }
        if (path.startsWith("http://" + document.location.host + "/preview/")) {
            return catchPreviewLoad.apply(this, arguments);
        }
        return oldRequest.apply(this, arguments);
    };
    Ajax.Request._EndlessFilter = true;
    Ajax.Request.Events = oldRequest.Events;
    Ajax.Request.prototype = oldRequest.prototype;
}());

},{}],2:[function(require,module,exports){
require("../endlessFilter");
const MediaEmbedder = require("media-embedder");

if (!SOUP.EmbedFix) {
    SOUP.EmbedFix = true;

    function fixAll (doc) {
        var video_posts = [].slice.call(doc.getElementsByClassName("post_video"));
        
        const firstPost = document.querySelector(".post .content");
        let width = 500;

        if (firstPost) {
            width = parseInt(window.getComputedStyle(firstPost).width);
        }

        const height = (width / 16 * 9)|0;
        
        for (const video_post of video_posts) {
            const embed = video_post.getElementsByClassName("embed")[0];
            if (embed.children.length === 0) {
                let mediaData;

                const textarea = video_post.querySelector("[name='post[embedcode_or_url]']");
                if (textarea) {
                    mediaData = MediaEmbedder.detect(textarea.childNodes[0] ? textarea.childNodes[0].nodeValue : "");
                }

                if (!mediaData) {
                    const description = video_post.getElementsByClassName("body")[0];
                    if (description) {
                        mediaData = MediaEmbedder.detect(description.innerHTML);
                    }
                }

                if (mediaData) {
                    mediaData.width = width;
                    mediaData.height = height;
                    embed.innerHTML = MediaEmbedder.buildIframe(mediaData);
                }
            }
        }
    }

    SOUP.Endless.on("processBatch", function (doc) {
        fixAll(doc);
    });

    fixAll(document);
}

},{"../endlessFilter":1,"media-embedder":4}],3:[function(require,module,exports){
module.exports = {
    parse: function (text) {
        const a = document.createElement("a");
        a.href = text;
        a.query = a.search.substring(1);
        return a;
    }
};

},{}],4:[function(require,module,exports){
(function (global){
"use strict";

/**
 * @typedef MediaInfo
 * @name MediaInfo
 * @type {object}
 * @property {string} platform - The name of the media platfrom.
 * @property {string} mediaid - A string uniquely identifying on piece of media on the platform
 * @property {number} [height] - The height of the embeded player
 * @property {number} [width] - The width of the embeded player
 * @property {boolean} [allowFullscreen] - True if the player can enter fullscreen
 * @property {boolean} [loop] - True if the player will start over at the end
 * @property {number} [timestamp] - The number of seconds at the begining that will be skiped
 */

/**
 * @typedef MediaPlatform
 * @name MediaPlatform
 */

/**
 * Parses a text can either be a url to a video on a platform, or an html
 * snipplet containing an embedding code for one of these platforms.
 * 
 * It attemps to extract as much information as possible from this text.
 * 
 * @method MediaPlatform~detect
 * @param {string} test - A URL or an html snipplet containing an embed code
 * @returns {MediaInfo|undefined} Information found in the string, undefined if none where found.
 */

/**
 * Generates a iframe embed html snipplet from a descriptor
 * 
 * @method MediaPlatform~buildIframe
 * @param {MediaInfo} descriptor
 * @returns {string} An html snipplet
 */

/**
 * Generates a link url from a descriptor
 * 
 * @method MediaPlatform~buildLink
 * @param {MediaInfo} descriptor
 * @returns {string} A url
 */

/** @type {Object.<string, MediaPlatform>} */
const platforms = {
    youtube: require("./platforms/youtube"),
    dailymotion: require("./platforms/dailymotion"),
    vimeo: require("./platforms/vimeo")
};

/** @type {MediaPlatform} */
global.test = module.exports = {
    detect: function(text) {
        for (const platform in platforms) {
            const ret = platforms[platform].detect(text);
            if (ret) {
                ret.platform = platform;
                return ret;
            }
        }
    },
    buildIframe: function (descriptor) {
        const platform = platforms[descriptor.platform];
        return platform.buildIframe(descriptor);
    },
    buildLink: function (descriptor) {
        const platform = platforms[descriptor.platform];
        return platform.buildLink(descriptor);
    }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./platforms/dailymotion":6,"./platforms/vimeo":7,"./platforms/youtube":8}],5:[function(require,module,exports){
"use strict";

const querystring = require("querystring");
const UrlHelper = require("./utils/url_helper");
const DocHelper = require("./utils/doc_helper");

/**
 * @callback processor
 * @param {UrlObject} url
 * @param {Object} queryObject
 * @return {MediaInfo}
 */

/**
 * @callback generator
 * @param {MediaInfo} mediaInfo
 * @param {boolean} embedded
 * @param {string[]} queryParts
 * @returns {string} Url
 */

/**
 * @param {processor} urlProcessor
 * @param {generator} urlGenerator
 * @returns {MediaPlatform}
 */
module.exports = function (urlProcessor, urlGenerator) {
    function wrappedProcessor (text) {
        try {
            const urlData = UrlHelper.parse(text);
            const qs = querystring.parse(urlData.query);

            return urlProcessor(urlData, qs);
        } catch (e) {
            console.error(e);
        }
    }

    function wrappedGenerator (data, embed) {
        const queryData = [];
        queryData.when = function (condition, val) { if (condition) this.push(val); };
        let url = urlGenerator(data, embed, queryData);
        
        if (queryData.length > 0) {
            url += "?" + queryData.join("&");
        }
        return url;
    }
    
    return {
        detect: (text) => {
            // is entire text a url?
            let entire = wrappedProcessor(text),
                ret;
            if (entire) {
                return entire;
            }
            
            for (const tag of DocHelper.get_nodes(text, "iframe", "embed", "a")) {
                switch (tag.nodeName.toLowerCase()) {
                    case "iframe":
                    case "embed":
                        ret = DocHelper.processIframe(tag, wrappedProcessor);
                        if (ret) {
                            return ret;
                        }
                        break;
                    case "a":
                        ret = wrappedProcessor(tag.getAttribute("href"));
                        if (ret) {
                            return ret;
                        }
                        break;
                }
            }
        },
        buildIframe: (data) => {
            return DocHelper.buildIframe(wrappedGenerator(data, true), data.height, data.width, data.allowFullscreen);
        },
        buildLink: (data) => {
            return wrappedGenerator(data, false);
        }
    };
};

},{"./utils/doc_helper":9,"./utils/url_helper":10,"querystring":13}],6:[function(require,module,exports){
"use strict";
const urlParse = /^\/(embed\/video|video|swf)\/([0-9a-zA-Z]*)/

module.exports = require("../platform_base")(
    function (urlData, qs) {
        if (urlData.normalizedHost === "dailymotion.com") {
            const urlMatch = urlData.pathname.match(urlParse);
            if (urlMatch) {
                return {
                    mediaid: urlMatch[2],
                    height: null,
                    width: null,
                    allowFullscreen: null,
                    loop: null,
                    timestamp: qs.start || null,
                    autoplay: qs.autoplay === "1" || qs.autoPlay === "1"
                }
            }
        }
    },
    function (data, embed, query) {
        let url = embed ? "https://www.dailymotion.com/embed/video/" : "https://www.dailymotion.com/video/";
        url += data.mediaid.replace(/[^0-9a-zA-Z]/g, ""); // sanitize mediaid
    
        query.when(data.allowFullscreen === false, "fullscreen=1");
        query.when(data.autoplay                 , "autoplay=1");
        query.when(data.timestamp                , "start=" + parseInt(data.timestamp));
        
        return url;
    }
);

},{"../platform_base":5}],7:[function(require,module,exports){
"use strict";
const urlParse = /^\/(video\/)?([0-9]*)$/;

/**
 * @param {string} videoId 
 * @param {object} param
 * @returns {MediaInfo}
 */
function generate (videoId, param) {
    return {
        mediaid: videoId,
        height: null, width: null, timestamp: null,
        allowFullscreen: null,
        loop: param.loop === "1",
        autoplay: param.autoplay === "1"
    }
}

module.exports = require("../platform_base")(
    function (urlData, qs) {
        if (urlData.normalizedHost === "vimeo.com" || urlData.normalizedHost === "player.vimeo.com") {
            if (urlData.pathname === "/moogaloop.swf") {
                return generate(qs.clip_id, qs);
            }
            const urlMatch = urlData.pathname.match(urlParse);
            if (urlMatch) {
                return generate(urlMatch[2], qs);
            }
        }
    },
    function (data, embed, query) {
        let url = embed ? "https://player.vimeo.com/video/" : "https://vimeo.com/";
        url += data.mediaid.replace(/[^0-9]/g, ""); // sanitize mediaid
    
        query.when(data.loop,     "loop=1");
        query.when(data.autoplay, "autoplay=1");

        return url;
    }
);

},{"../platform_base":5}],8:[function(require,module,exports){
"use strict";
const querystring = require("querystring");
const embedUrlParse = /^\/(embed|v)\/([0-9a-zA-Z\-_]*)(.*)/;

/**
 * @param {string} videoId
 * @param {object} param
 * @returns {MediaInfo}
 */
function generate (videoId, param) {
    return {
        mediaid: videoId,
        height: null, width: null,
        allowFullscreen: param.fs !== "0",
        timestamp: param.t || param.time || param.start || null,
        loop: param.loop === "1",
        autoplay: param.autoplay === "1"
    }
}

module.exports = require("../platform_base")(
    function (urlData, qs) {
        if (urlData.normalizedHost === "youtube.com") {
            if (qs.v) {
                return generate(qs.v, qs);
            }
            const embedUrlMatch = urlData.pathname.match(embedUrlParse);
            if (embedUrlMatch) {
                // youtube /v/ urls can be kind of odd and and append the query with & to the path
                const vUrlQs = querystring.parse(embedUrlMatch[3]);
                return generate(embedUrlMatch[2], Object.assign({}, qs, vUrlQs));
            }
        } else if (urlData.normalizedHost === "youtu.be") {
            const qs = querystring.parse(urlData.query);
            return generate(urlData.pathname.slice(1), qs);
        }
    },
    function (data, embed, query) {
        let url = embed ? "https://www.youtube.com/embed/" : "https://www.youtube.com/watch";
        const mediaid = data.mediaid.replace(/[^0-9a-zA-Z\-_]/g, ""); // sanitize mediaid
    
        query.when(data.allowFullscreen === false, "fs=1");
        query.when(data.loop,                      "loop=1");
        query.when(data.autoplay,                  "autoplay=1");
        if (data.timestamp) {
            query.push("start=" + data.timestamp.replace(/[^0-9hms]/g, ""));
        }

        if (embed) {
            url += mediaid;
        } else {
            query.push("v=" + mediaid)
        }

        return url;
    }
);

},{"../platform_base":5,"querystring":13}],9:[function(require,module,exports){
const DOMParser = (window.window).DOMParser;

module.exports = {
    get_nodes: function (text, ...node_types) {
        let parser = (new DOMParser ()).parseFromString("<html><body>" + text + "</body></html>", "text/html");
        var tags = [];
        for (const node_type of node_types) {
            tags.push.apply(tags, parser.getElementsByTagName(node_type));
        }
        return tags;
    },

    processIframe: function (iframe, urlProcessor) {
        const ret = urlProcessor(iframe.getAttribute("src"));
        if (ret) {
            ret.allowFullscreen = iframe.getAttribute("allowfullscreen") != null;
            ret.height = iframe.getAttribute("height");
            ret.width = iframe.getAttribute("width");
            return ret;
        }
    },

    buildIframe: function (src, height, width, allowFullscreen) {
        let ret = "<iframe "
        if (height != null) {
            ret += 'height="' + parseInt(height) + '" '
        }
        if (width != null) {
            ret += 'width="' + parseInt(width) + '" '
        }
        if (allowFullscreen === true) {
            ret += 'allowfullscreen webkitallowfullscreen mozallowfullscreen '
        }
        ret += 'frameborder="0" src="' + src + '"></iframe>'
        return ret;
    }
};

},{}],10:[function(require,module,exports){
const url = require("url");
const querystring = require("querystring");

module.exports = {
    parse: function (text) {
        let fullUrl = url.parse(text);
    
        if (fullUrl.protocol === null) {
            fullUrl = url.parse("test:" + (text.startsWith("//") ? "" : "//") + text);
        }

        if (fullUrl.host) {
            fullUrl.normalizedHost = fullUrl.host.startsWith("www.") ? fullUrl.host.substring(4) : fullUrl.host;
        }

        return fullUrl;
    }
};

},{"querystring":13,"url":3}],11:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],12:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],13:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":11,"./encode":12}]},{},[2]);