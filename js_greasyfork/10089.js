// ==UserScript==
// @name        Gelbooru Paged Gallery
// @namespace   zixaphir
// @description A simplified gallery for viewing gelbooru images in succession.
// @match       *://*.gelbooru.com/index.php?*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10089/Gelbooru%20Paged%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/10089/Gelbooru%20Paged%20Gallery.meta.js
// ==/UserScript==

/*
#
 * $ object largely based on 4chan X's $, which is largely based on jQuery.
 * non-chainable.
#
 * Copyright (c) 2009-2011 James Campos <james.r.campos@gmail.com>
 * Copyright (c) 2012-2014 Nicolas Stepien <stepien.nicolas@gmail.com>
#
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
#
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
#
 */

(function() {
  "use strict";
  var $, FNLIMIT, LIMIT, PRELOAD, SimpleDict, THRESHOLD, cb, clickThumb, d, err, fer, g, loadGallery, mkImage, mkURL, preload, query, queryImages, setImage, setup, setupImages, updateImages,
    slice = [].slice;

  d = document;

  FNLIMIT = 255;

  PRELOAD = 1;

  THRESHOLD = 3;

  LIMIT = 100;

  g = {
    galleryCSS: "#a-gallery {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 30;\n  display: flex;\n  flex-direction: row;\n  background: rgba(0,0,0,0.7);\n}\n.gal-thumbnails {\n  flex-basis: 170px;\n  overflow-y: auto;\n  overflow-x: hidden;\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n  text-align: center;\n  background: rgba(0,0,0,.5);\n  border-left: 1px solid #222;\n  order: 3;\n}\n.gal-hide-thumbnails .gal-thumbnails {\n  display: none;\n}\n.gal-thumb img {\n  max-width: 150px;\n  max-height: 150px;\n  height: auto;\n  width: auto;\n}\n.gal-thumb {\n  flex-basis: auto;\n  padding: 3px;\n  line-height: 0;\n  transition: background .2s linear;\n}\n.gal-highlight {\n  background: rgba(0, 190, 255, .8);\n}\n.gal-prev {\n  order: 0;\n  border-right: 1px solid #222;\n}\n.gal-next {\n  order: 2;\n  border-left: 1px solid #222;\n}\n.gal-prev,\n.gal-next {\n  flex-basis: 20px;\n  position: relative;\n  cursor: pointer;\n  opacity: 0.7;\n  background-color: rgba(0, 0, 0, 0.3);\n}\n.gal-prev:hover,\n.gal-next:hover {\n  opacity: 1;\n}\n.gal-prev::after,\n.gal-next::after {\n  position: absolute;\n  top: 50%;\n  transform: translateY(-50%)\n  line-height: 22px;\n  display: inline-block;\n  border-top: 11px solid transparent;\n  border-bottom: 11px solid transparent;\n  content: \"\";\n}\n.gal-prev::after {\n  border-right: 12px solid #fff;\n  right: 5px;\n}\n.gal-next::after {\n  border-left: 12px solid #fff;\n  right: 3px;\n}\n.gal-image {\n  position: relative;\n  order: 1;\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-around;\n  overflow: hidden;\n  flex-grow: 1;\n}\n:root:not(.gal-fit-height):not(.gal-pdf) .gal-image {\n  overflow-y: auto !important;\n}\n:root:not(.gal-fit-width):not(.gal-pdf) .gal-image {\n  overflow-x: auto !important;\n}\n.gal-image a {\n  line-height: 0;\n}\n.gal-image > div {\n  margin: auto;\n  max-width: 100%;\n}\n:root.gal-pdf .gal-image a {\n  width: 100%;\n  height: 100%;\n}\n.gal-image video,\n.gal-image img {\n  max-width: 100%;\n}\n.gal-fit-height .gal-image video,\n.gal-fit-height .gal-image img {\n  max-height: 95vh;\n}\n.gal-image iframe {\n  width: 100%;\n  height: 100%;\n}\n.gal-buttons .menu-button {\n  bottom: 2px;\n  color: #ffffff;\n  text-shadow: 0px 0px 1px #000000;\n}\n.gal-close {\n  font-size: 2em;\n  color: #ffffff;\n  text-shadow: 0px 0px 1px #000000;\n  top: 5px;\n  cursor: pointer;\n}\n.gal-close,\n.gal-info {\n  position: absolute;\n  right: 5px;\n}\n.gal-info {\n  bottom: 5px;\n  background: rgba(0,0,0,0.6) !important;\n}\n.gal-info,\n.gal-ex-info {\n  border-radius: 3px;\n  padding: 1px 5px 2px 5px;\n  color: #ffffff !important;\n}\n.gal-ex-info {\n  display: none;\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  font-size: 12px;\n  font-family: calibri;\n  min-width: 200px;\n  padding-left: 15px;\n  text-indent: -15px;\n  background: rgba(0,0,0,0.8) !important;\n}\n.gal-ex-info p {\n  margin: 3px;\n}\n.gal-info:hover .gal-ex-info {\n  display: block;\n}\n:root:not(.gal-fit-width):not(.gal-pdf) .gal-name {\n  bottom: 23px !important;\n}\n:root:not(.gal-fit-width):not(.gal-pdf) .gal-count {\n  bottom: 44px !important;\n}\n:root.gal-fit-height:not(.gal-pdf):not(.gal-hide-thumbnails) .gal-buttons,\n:root.gal-fit-height:not(.gal-pdf):not(.gal-hide-thumbnails) .gal-name,\n:root.gal-fit-height:not(.gal-pdf):not(.gal-hide-thumbnails) .gal-count {\n  right: 178px !important;\n}\n:root.gal-hide-thumbnails:.gal-fit-height:not(.gal-pdf) .gal-buttons,\n:root.gal-hide-thumbnails:.gal-fit-height:not(.gal-pdf) .gal-name,\n:root.gal-hide-thumbnails:.gal-fit-height:not(.gal-pdf) .gal-count {\n  right: 28px !important;\n}\n.spinner {\n  width: 30px;\n  height: 30px;\n  background-color: #aaa;\n  -webkit-animation: rotateplane 1.2s infinite ease-in-out;\n  animation: rotateplane 1.2s infinite ease-in-out;\n}\n@-webkit-keyframes rotateplane {\n  0% { -webkit-transform: perspective(120px) }\n  50% { -webkit-transform: perspective(120px) rotateY(180deg) }\n  100% { -webkit-transform: perspective(120px) rotateY(180deg)  rotateX(180deg) }\n}\n@keyframes rotateplane {\n  0% {\n    transform: perspective(120px) rotateX(0deg) rotateY(0deg);\n    -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg)\n  } 50% {\n    transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);\n    -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg)\n  } 100% {\n    transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);\n    -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);\n  }\n}",
    nodes: {}
  };

  (function() {
    var z;
    z = 0;
    return Object.defineProperty(g, "currentImageIndex", {
      set: function(x) {
        return z = Math.min(+g.images.length, Math.max(x, 0));
      },
      get: function() {
        return z;
      }
    });
  })();

  $ = function(query, root) {
    if (!root) {
      root = d.body;
    }
    return root.querySelector(query);
  };

  $.$ = function(query, root) {
    if (!root) {
      root = d.body;
    }
    return slice.call(root.querySelectorAll(query));
  };

  $.asap = function(test, fn) {
    var callback;
    callback = function() {
      var err;
      try {
        return fn();
      } catch (_error) {
        err = _error;
        console.log(err.message);
        return console.log(err.stack);
      }
    };
    if (test()) {
      return callback();
    } else {
      return setTimeout($.asap, 25, test, callback);
    }
  };

  $.addStyle = function(css, id) {
    var style;
    style = $.el('style', {
      textContent: css
    });
    if (id) {
      style.id = id;
    }
    $.asap((function() {
      return d.head;
    }), function() {
      return $.add(d.head, style);
    });
    return style;
  };

  $.on = function(target, events, fun, once) {
    var event, fn, func, j, len1, ref;
    fn = function() {
      var err;
      try {
        return fun.apply(this, arguments);
      } catch (_error) {
        err = _error;
        console.log(err.message);
        return console.log(err.stack);
      }
    };
    func = once ? function() {
      $.off(target, events, func);
      return fn.apply(this, arguments);
    } : fn;
    ref = events.split(' ');
    for (j = 0, len1 = ref.length; j < len1; j++) {
      event = ref[j];
      target.addEventListener(event, func, false);
    }
    return func;
  };

  $.off = function(target, events, fn) {
    var event, j, len1, ref;
    ref = events.split(' ');
    for (j = 0, len1 = ref.length; j < len1; j++) {
      event = ref[j];
      target.removeEventListener(event, fn, false);
    }
    return target;
  };

  $.el = function(type, props) {
    var el, prop;
    el = d.createElement(type);
    for (prop in props) {
      if (props.hasOwnProperty(prop)) {
        el[prop] = props[prop];
      }
    }
    return el;
  };

  $.nodes = function(nodes) {
    var frag, j, len1, node;
    if (!(nodes instanceof Array)) {
      return nodes;
    }
    frag = d.createDocumentFragment();
    for (j = 0, len1 = nodes.length; j < len1; j++) {
      node = nodes[j];
      frag.appendChild(node);
    }
    return frag;
  };

  $.html = function(html) {
    var el;
    el = $.el('div', {
      innerHTML: html
    });
    return $.nodes(slice.call(el.children));
  };

  $.add = function(root, nodes) {
    root.appendChild($.nodes(nodes));
    return root;
  };

  $.replace = function(root, el) {
    return root.parentNode.replaceChild($.nodes(el), root);
  };

  SimpleDict = (function() {
    function SimpleDict() {
      this.keys = [];
    }

    SimpleDict.prototype.push = function(key, data) {
      key = "" + key;
      if (!this[key]) {
        this.keys.push(key);
      }
      this[key] = data;
      return this[key].key = key;
    };

    SimpleDict.prototype.contains = function(obj) {
      return this.indexOf(obj) !== -1;
    };

    SimpleDict.prototype.indexOf = function(obj) {
      var key;
      key = obj.key;
      if (key) {
        if (obj !== this[key]) {
          return -1;
        }
        return this.keys.indexOf(key);
      } else {
        return this.keys.indexOf(obj);
      }
    };

    SimpleDict.prototype.rm = function(key) {
      var i;
      key = "" + key;
      i = this.keys.indexOf(key);
      if (i !== -1) {
        this.keys.splice(i, 1);
        return delete this[key];
      }
    };

    SimpleDict.prototype.first = function() {
      return this[this.keys[0]];
    };

    SimpleDict.prototype.forEach = function(fn) {
      var j, key, len1, ref;
      ref = slice.call(this.keys);
      for (j = 0, len1 = ref.length; j < len1; j++) {
        key = ref[j];
        fn.call(this, this[key]);
      }
    };

    SimpleDict.prototype.forEachKey = function(fn) {
      var j, key, len1, ref;
      ref = slice.call(this.keys);
      for (j = 0, len1 = ref.length; j < len1; j++) {
        key = ref[j];
        fn.call(this, key);
      }
    };

    Object.defineProperty(SimpleDict.prototype, 'length', {
      get: function() {
        return this.keys.length;
      }
    });

    return SimpleDict;

  })();

  preload = function(image) {
    var galLength, i, len, results;
    galLength = g.images.length;
    i = g.currentImageIndex;
    len = Math.min(galLength, i + PRELOAD + 1);
    results = [];
    while (++i < len) {
      results.push($.el('img', {
        src: g.images[g.images.keys[i]].url
      }));
    }
    return results;
  };

  loadGallery = function() {
    var close, count, err, gal, next, nodes, prev, thumbs;
    try {
      g.gallery = gal = $.el('div', {
        id: 'a-gallery',
        innerHTML: "<div class=\"gal-prev\"></div>\n<div class=\"gal-image\">\n  <div>\n    <div class=\"gal-info\">\n      INFO\n      <div class=\"gal-ex-info\">\n      </div>\n    </div>\n    <div class=\"gal-close\">✖</div>\n    <a class=\"current\"></a>\n  </div>\n</div>\n<div class=\"gal-next\"></div>\n<div class=\"gal-thumbnails\"></div>"
      });
      nodes = g.nodes;
      nodes.prev = prev = $('.gal-prev', gal);
      nodes.next = next = $('.gal-next', gal);
      nodes.count = count = $('.gal-count', gal);
      nodes.thumbs = thumbs = $('.gal-thumbnails', gal);
      nodes.close = close = $('.gal-close', gal);
      $.on(close, 'click', cb.hideGallery);
      $.on(prev, 'click', cb.prev);
      $.on(next, 'click', cb.next);
      $.on(d, 'keydown', cb.keybinds);
      cb.hideGallery();
      return d.body.appendChild(gal);
    } catch (_error) {
      err = _error;
      console.log(err.message);
      return console.log(err.stack);
    }
  };

  cb = {
    next: function() {
      ++g.currentImageIndex;
      return cb.updateImage();
    },
    prev: function() {
      --g.currentImageIndex;
      return cb.updateImage();
    },
    updateImage: function() {
      return setImage(g.images[g.images.keys[g.currentImageIndex]]);
    },
    showGallery: function() {
      g.gallery.style.display = 'flex';
      return d.body.style.overflow = 'hidden';
    },
    hideGallery: function() {
      cb.pause();
      g.gallery.style.display = 'none';
      g.currentImageIndex = 0;
      return d.body.style.overflow = 'auto';
    },
    highlight: function(image) {
      var gal, highlight, thumbs;
      if (!image) {
        if (!(image = g.images[g.images.keys[g.currentImageIndex]])) {
          return;
        }
      }
      gal = g.gallery;
      $('.gal-image', gal).scrollTop = 0;
      highlight = $('.gal-highlight', gal);
      if (highlight != null) {
        highlight.classList.remove('gal-highlight');
      }
      highlight = $("[data-id='" + image.id + "']", gal);
      if (highlight != null) {
        highlight.classList.add('gal-highlight');
      }
      thumbs = g.nodes.thumbs;
      return thumbs.scrollTop = highlight.offsetTop + highlight.offsetHeight / 2 - thumbs.clientHeight / 2;
    },
    toggleGallery: function() {
      return cb[g.gallery.style.display === 'block' ? 'hideGallery' : 'showGallery']();
    },
    keybinds: function(e) {
      var fn, key;
      if (!(key = e.keyCode)) {
        return;
      }
      fn = (function() {
        switch (key) {
          case 39:
            return cb.next;
          case 37:
            return cb.prev;
          case 27:
            return cb.hideGallery;
        }
      })();
      if (!fn) {
        return;
      }
      e.stopPropagation();
      e.preventDefault();
      return fn();
    },
    pause: function() {
      var current, el;
      current = $('.gal-image a', g.gallery);
      if (current) {
        el = current.firstElementChild;
      }
      if (el && el.pause) {
        return el.pause();
      }
    }
  };

  fer = function(arr, fn) {
    var item, j, len1;
    for (j = 0, len1 = arr.length; j < len1; j++) {
      item = arr[j];
      fn(item);
    }
  };

  clickThumb = function(e) {
    e.preventDefault();
    return $.asap((function() {
      return g.images.length;
    }), (function(_this) {
      return function() {
        var id, image, queryURL;
        id = _this.id.slice(1);
        image = g.images["" + id];
        cb.showGallery();
        if (!image) {
          queryURL = g.baseURL + "page=dapi&s=post&q=index&id=" + id;
          query("get", queryURL, function() {
            image = mkImage(this.response.childNodes[0].children[0]);
            return setImage(image);
          });
          return;
        }
        return setImage(image);
      };
    })(this));
  };

  setImage = function(image) {
    var a, el, err, gal, i, img, info, j, len1, placeHolder, rating, ratingText, ready, ref, source, tag, tags;
    try {
      gal = g.gallery;
      cb.pause();
      el = $('.gal-image .current', gal);
      g.currentImageIndex = i = g.images.indexOf(image);
      a = $.el('a', {
        href: image.download,
        download: image.filename,
        className: 'current'
      });
      switch (image.type) {
        case "jpg":
        case "jpeg":
        case "gif":
        case "png":
          img = $.el('img', {
            src: image.url,
            alt: image.tags
          });
          ready = function() {
            return img.complete;
          };
          break;
        default:
          img = $.el('video', {
            src: image.url,
            poster: image.thumb,
            autoplay: true,
            loop: true,
            width: image.width,
            height: image.height
          });
          ready = function() {
            return img.readyState > 2;
          };
      }
      if (ready()) {
        $.add(a, img);
        preload();
      } else {
        placeHolder = $.el('div', {
          className: 'spinner'
        });
        $.add(a, placeHolder);
        $.asap(ready, function() {
          if (i !== g.currentImageIndex) {
            return;
          }
          $.replace(placeHolder, img);
          return preload();
        });
      }
      $.replace(el, a);
      a.parentElement.click();
      info = $('.gal-ex-info', gal);
      info.textContent = "ID: " + image.id + "\nScore: " + (image.score || 0) + "\nPosted: " + image.age + "\nWidth: " + image.width + "\nHeight: " + image.height + "\nType: " + (image.type.toUpperCase());
      info.innerHTML = "<p>" + (info.textContent.split('\n').join('</p><p>')) + "</p>";
      tags = $.el('p', {
        textContent: "Tags: "
      });
      ref = image.tags.split(' ');
      for (j = 0, len1 = ref.length; j < len1; j++) {
        tag = ref[j];
        $.add(tags, $.el('a', {
          href: g.baseURL + "page=post&s=list&tags=" + tag,
          textContent: tag,
          target: "_blank"
        }));
        $.add(tags, d.createTextNode(' '));
      }
      $.add(info, tags);
      ratingText = (function() {
        switch (image.rating) {
          case 'e':
            return 'explicit';
          case 's':
            return 'safe';
          default:
            return 'questionable';
        }
      })();
      rating = $.el('p', {
        textContent: "Rating: "
      });
      $.add(rating, $.el('a', {
        href: g.baseURL + "page=post&s=list&tags=rating:" + ratingText,
        textContent: ratingText,
        target: "_blank"
      }));
      $.add(info, rating);
      if (image.source) {
        source = $.el('p', {
          textContent: "Source: "
        });
        $.add(source, $.el('a', {
          href: image.source,
          textContent: image.source,
          target: "_blank"
        }));
        $.add(info, source);
      }
      cb.highlight(image);
      if (i + THRESHOLD > g.images.length) {
        return updateImages();
      }
    } catch (_error) {
      err = _error;
      console.log(err.message);
      return console.log(err.stack);
    }
  };

  updateImages = function() {
    var queryURL;
    queryURL = mkURL(g.images.length / LIMIT);
    return queryImages(queryURL);
  };

  setupImages = function() {
    var err, j, len1, parser, post, ref, response, results;
    try {
      if (this.status !== 200) {
        g.error = true;
        return alert(this.status + ": " + this.statusText);
      }
      parser = new DOMParser();
      response = parser.parseFromString(this.response, 'text/xml');
      ref = response.childNodes[0].children;
      results = [];
      for (j = 0, len1 = ref.length; j < len1; j++) {
        post = ref[j];
        results.push(mkImage(post));
      }
      return results;
    } catch (_error) {
      err = _error;
      console.log(err.message);
      return console.log(err.stack);
    }
  };

  mkImage = function(post) {
    var a, download, extension, filename, image, item, j, len1, p, ref, ref1, tags, thumb, type;
    p = {};
    ref = post.attributes;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      item = ref[j];
      p[item.name] = item.value;
    }
    a = $.el('a', {
      href: p.file_url
    });
    a.host = 'gelbooru.com';
    download = a.href;
    type = download.split('.');
    type = ("" + type[type.length - 1]).toLowerCase();
    extension = "." + type;
    tags = p.tags.split(' ');
    while (true) {
      filename = p.id + " - " + (tags.join(' ').trim());
      tags.pop();
      if (!(filename.length + extension.length > FNLIMIT)) {
        break;
      }
    }
    filename += extension;
    image = {
      thumb: p.preview_url,
      url: p.sample_url,
      rating: p.rating,
      source: p.source,
      width: p.width,
      height: p.height,
      score: p.score,
      tags: (ref1 = p.tags) != null ? ref1.trim() : void 0,
      id: p.id,
      age: p.created_at,
      filename: filename,
      download: download,
      type: type
    };
    thumb = $.el('a', {
      href: "javascript:;",
      className: 'gal-thumb',
      innerHTML: "<img src='" + image.thumb + "'>"
    });
    thumb.setAttribute('data-id', image.id);
    $.on(thumb, 'click', function() {
      g.currentImageIndex = g.images.indexOf(image);
      return setImage(image);
    });
    $.add(g.nodes.thumbs, thumb);
    g.images.push(p.id, image);
    return image;
  };

  query = function(method, URL, callback) {
    var r;
    r = new XMLHttpRequest();
    r.open("get", URL, true);
    $.on(r, "load error abort", callback, true);
    r.send();
    return r;
  };

  queryImages = function(URL) {
    if (g.error) {
      return;
    }
    return query("get", URL, setupImages);
  };

  mkURL = function(pid) {
    var j, key, len1, queryURL, ref;
    if (pid) {
      g.attr.pid = pid;
    }
    queryURL = g.baseURL;
    ref = g.attr.keys;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      key = ref[j];
      queryURL += key + "=" + g.attr[key] + "&";
    }
    return queryURL = queryURL.slice(0, -1);
  };

  setup = function() {
    var attr, j, len1, ref;
    g.images = new SimpleDict();
    g.host = d.location;
    g.attr = new SimpleDict();
    ref = g.host.search.slice(1).split('&');
    for (j = 0, len1 = ref.length; j < len1; j++) {
      attr = ref[j];
      attr = attr.split('=');
      g.attr.push(attr[0].toLowerCase(), attr[1].toLowerCase());
    }
    if (g.attr.s === 'view') {
      return;
    }
    g.baseURL = g.host.protocol + "//" + g.host.hostname + "/index.php?";
    g.attr.push('page', 'dapi');
    g.attr.push('q', 'index');
    g.attr.push('s', 'post');
    g.attr.push('limit', 100);
    if (g.attr.tags === 'all') {
      g.attr.rm('tags');
    }
    if (g.attr.pid) {
      g.attr.pid = ~~(g.attr.pid / 100);
    } else {
      g.attr.push('pid', 0);
    }
    g.queryURL = mkURL();
    $.addStyle(g.galleryCSS);
    return $.asap((function() {
      var ref1;
      return (ref1 = d.readyState) === 'interactive' || ref1 === 'complete';
    }), function() {
      var k, len2, ref1, thumb;
      ref1 = $.$('.thumb a');
      for (k = 0, len2 = ref1.length; k < len2; k++) {
        thumb = ref1[k];
        $.on(thumb, 'click', clickThumb);
      }
      loadGallery();
      return queryImages(g.queryURL);
    });
  };

  try {
    setup();
  } catch (_error) {
    err = _error;
    console.log(err.message);
    console.log(err.stack);
  }

}).call(this);
