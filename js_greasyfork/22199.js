// ==UserScript==
// @name          xkcd Tweaks
// @description   Some tweaks to xkcd.com and what-if.xkcd.com
// @include       /^(https?:)?(\/\/)?(www\.)?(what-?if\.)?xkcd\.com/
// @author        Mital Ashok
// @icon          https://xkcd.com/favicon.ico
// @namespace     https://greasyfork.org/en/users/59570-mital-ashok
// @license       MIT License
// @version       3.0.6
// @grant         none
// @updateurl     https://mitalashok.github.io/xkcd-Tweaks.user.js
// @run-at        document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/22199/xkcd%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/22199/xkcd%20Tweaks.meta.js
// ==/UserScript==

(function(window, undefined) {'use strict';

  // ==Settings==

  var border = true;
  var hr = true;
  var title_text = true;
  var snap = false;
  var explain_button = true;
  var transcript = true;

  // ==/Settings==

  var document = window.document;

  var main_run = false;
  function main() {
    if (main_run) {
      return;
    }
    main_run = true;

    function repeat(interval, func, callback) {
      callback = callback || (function() {});
      if (func()) {
        callback();
        return;
      }
      var interval_id = window.setInterval(function() {
        if (func()) {
          window.clearInterval(interval_id);
          callback();
        }
      }, interval);
    }

    function disable(node_list) {
      return function() {
        window.Array.prototype.forEach.call(node_list, function(node) {
          node.style = 'visibility:hidden;cursor:default';
          node.removeAttribute('href');
          node.parentElement.style = 'user-select:none;-moz-user-select:none;-webkit-user-select:none';
        });
        return window.Array.prototype.every.call(node_list, function(node) {
          return node.style.visibility === 'hidden' && !node.hasAttribute('href') && node.style.cursor === 'default';
        });
      };
    }

    function is_editable(node) {
      var name = node.nodeName.toLowerCase();
      return node.hasAttribute('contenteditable') || node.nodeType === 1 && (name === 'textarea' ||
        name === 'input' && /^(?:text|email|number|search|tel|url|password|)$/i.test(node.type));
    }

    function xhr(url, timeout, method) {
      return new window.Promise(function(resolve, reject) {
        var resolved = false;
        var x = new window.XMLHttpRequest();
        x.onreadystatechange = function() {
          if (x.readyState === window.XMLHttpRequest.DONE) {
            resolve(x.responseText, x);
            resolved = true;
          }
        };
        x.open(method || 'GET', url, true);
        x.send(null);
        if (timeout === null) {
          return;
        }
        window.setTimeout(function() {
          if (!resolved) {
            x.abort();
            reject(new window.Error('Timeout'));
          }
        }, timeout || 5000);
      });
    }
    var number;

    var localStorage = window.localStorage || {};
    var key_codes = {
      left: 37, right: 39, n: 78, p: 80, r: 82
    };

    if (/^(https?:)?(\/\/)?(www\.)?what-if/i.test(window.location.href)) {
      var time = +new window.Date();
      var last_number;
      var local_latest = localStorage.latest_comic;
      var expired = local_latest === undefined;
      if (!expired) {
        local_latest = local_latest.split(',');
        expired = +local_latest[0] <= time;
      }
      if (expired) {
        last_number = xhr('/').then(function(html) {
          var from_html = +html.match(
            /<a href="\/\/what-if\.xkcd\.com\/(\d+)\/"><h1>/
          )[1];
          localStorage.latest_comic = from_html + ',' + (time + 6.048e+8);
          return from_html;
        });
      } else {
        last_number = new window.Promise(function(resolve) {
          resolve(+local_latest[1]);
          return +local_latest[1];
        });
      }
      var head_anchor = document.getElementsByTagName('h1')[0].parentElement;
      number = +head_anchor.getAttribute('href').slice(19, -1);

      if (/^(https?:)?(\/\/)?(www\.)?what-if\.xkcd\.com\/\d+/i.test(window.location.href)) {
        repeat(100, function() {
          head_anchor.removeAttribute('href');
          head_anchor.style.textDecoration = 'underline';
          return !head_anchor.hasAttribute('href') && head_anchor.style.textDecoration === 'underline';
        });
      }
      var is_first = true;
      var is_last = true;
      window.Array.prototype.forEach.call(document.getElementsByTagName('a'), function(a) {
        if (a.firstChild) {
          if (a.firstChild.textContent === 'Prev') {
            is_first = false;
          } else if (a.firstChild.textContent === 'Next') {
            is_last = false;
          }
        }
      });
      var add_buttons = function(nav) {
        var ul = nav.firstElementChild;
        var a;
        nav.style.width = '23.5em';
        if (!is_first) {
          var first_tag = document.createElement('li');
          a = document.createElement('a');
          a.textContent = 'First';
          a.href = '/1/';
          first_tag.appendChild(a);
          first_tag.className = 'nav-prev';
          ul.insertBefore(first_tag, ul.firstChild);
        }
        if (!is_last) {
          var last_tag = document.createElement('li');
          a = document.createElement('a');
          a.textContent = 'Last';
          a.href = '/';
          last_tag.appendChild(a);
          last_tag.className = 'nav-next';
          ul.insertBefore(last_tag, ul.lastElementChild);
        }
        window.Array.prototype.forEach.call(ul.children, function(li) {
          if (li.firstChild.firstChild.textContent !== 'Last') {
            li.style.marginRight = '0.5em';
          }
        });
      };
      var navs = document.getElementsByClassName('main-nav');
      add_buttons(navs[0]);
      add_buttons(navs[1]);
      last_number.then(function(last) {
        var add_random = function(ul) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = window.decodeURIComponent('%6A%61%76%61%73%63%72%69%70%74%3A') + window.encodeURIComponent(
              '(function() {' +
                'var random = window.Math.floor(window.Math.random() * ' + (last - 1) + ') + 1;' +
                'if (random >= ' + number + ') {' +
                  'random++;' +
                '}' +
                'window.location.replace("' + window.location.origin + '/" + random + "/");' +
              '})();'
            );
          a.className = 'random-button';
          a.innerText = 'Random';
          li.appendChild(a);
          if (is_last) {
            ul.insertBefore(li, ul.lastChild);
          } else {
            ul.insertBefore(li, ul.lastChild.previousSibling);
          }
          if (is_first) {
            li.style.marginLeft = '8.57552em';
          }
        };
        var navs = document.getElementsByClassName('main-nav');
        add_random(navs[0].firstElementChild);
        add_random(navs[1].firstElementChild);
        return last;
      });
      document.addEventListener('keydown', function(event) {
        switch(event.keyCode) {
          case key_codes.right: case key_codes.n:
          if (is_first) return;
          window.Array.prototype.forEach.call(document.getElementsByTagName('a'), function(a) {
            if (a.firstChild !== null && a.firstChild.textContent === 'Next') {
              a.click();
            }
          });
          return;
          case key_codes.left: case key_codes.p:
          if (is_last) return;
          window.Array.prototype.forEach.call(document.getElementsByTagName('a'), function(a) {
            if (a.firstChild !== null && a.firstChild.textContent === 'Prev') {
              a.click();
            }
          });
          return;
          case key_codes.r:
            last_number.then(function(last) {
              var random = window.Math.floor(window.Math.random() * (last_number - 1)) + 1;
              if (random >= number) {
                random++;
              }
              window.location.replace(window.location.origin + '/' + random + '/');
            });
        }
      }, true);
      window.Array.prototype.forEach.call(document.getElementsByTagName('img'), function(img) {
        if (img.hasAttribute('title')) {
          if (border) {
            img.style.border = '2px solid rgba(127, 127, 127, 0.22)';
          }
          if (title_text) {
            img.style.marginTop = img.style.paddingTop;
            var oldPadding = img.style.paddingBottom;
            img.style.marginBottom = 0;
            img.style.paddingTop = 0;
            img.style.paddingBottom = 0;
            var title = document.createElement('p');
            title.textContent = img.title;
            title.style = 'text-align:center;padding-left:5em;padding-right:5em;padding-top:0;font-size:85%';
            title.style.paddingBottom = oldPadding;
            img.parentElement.insertBefore(title, img.nextSibling);
            img.removeAttribute('title');
          }
        }
      });
      return;
    }
    var comic = document.getElementById('comic');
    if ((window.location.pathname === '/404/' || window.location.pathname === '/404') && !comic) {
      var slash = window.location.pathname === '/404' ? '/' : '';
      xhr('/403/').then(function(page) {
        var title_text = 'April Fools! (This page was created by xkcd tweaks. It would normally be a HTTP 404 error page.)';
        var title = 'Not Found';
        document.documentElement.innerHTML = page;
        document.title = 'xkcd: ' + title;
        document.getElementById('comic').innerHTML =
          '<iframe title="' + title_text + '" style="border:1px solid gray;outline:1px solid black;margin-top:1px;width:296px;height:296px;" src="/404' + slash +
          '" height="296" width="296">' +
              '<h1 style="text-align:left;font-size:2em;font-variant:normal;font-family:Times New Roman;font-weight:bold;">404 - Not Found</h1>' +
          '</iframe>' +
          '<div style="width:300px;height:300px;position:absolute;left:240px;margin-top:-299px;" title="' + title_text + '"></div>';
        document.getElementById('ctitle').textContent = title;
        var img_link = document.getElementById('transcript').previousSibling;
        var perma_link = img_link.previousSibling.previousSibling;
        img_link.textContent = img_link.textContent.replace('convincing_pickup_line.png', '');
        perma_link.textContent = perma_link.textContent.replace('403', '404');
        window.Array.prototype.forEach.call(document.querySelectorAll('a[rel="prev"]'), function(el) {
          el.setAttribute('href', '/403/');
        });
        window.Array.prototype.forEach.call(document.querySelectorAll('a[rel="next"]'), function(el) {
          el.setAttribute('href', '/405/');
        });
        main_run = false;
        main();
      });
      return;
    }
    if (!comic) {
      return;
    }
    if (snap) {
      var get_top = function() {
        return ((document.getElementById('middleContainer') || {}).offsetTop || 173) + 6;
      };
      window.setTimeout(function() {
        window.scrollTo({
          left: 0,
          top: get_top(),
          behavior: 'smooth'
        });
      }, 500);
      var scroll_interval_id = null;
      window.addEventListener('scroll', function() {
        var scroll_position = document.documentElement.scrollTop || document.body.scrollTop;
        var top = get_top();
        if (scroll_position > top - 145 && top + 10 > scroll_position) {
          if (scroll_interval_id === null && scroll_position !== top) {
            scroll_interval_id = window.setInterval(function() {
              if (scroll_position > top - 145 && top + 10 > scroll_position) {
                window.scrollTo({
                  left: 0,
                  top: top,
                  behavior: 'smooth'
                });
              }
              window.clearInterval(scroll_interval_id);
              scroll_interval_id = null;
            }, 500);
          }
        } else {
          if (scroll_interval_id !== null) {
            window.clearInterval(scroll_interval_id);
            scroll_interval_id = null;
          }
        }
      }, false);
    }

    var img_link = document.getElementById('transcript').previousSibling;
    var perma_link = img_link.previousSibling.previousSibling;
    var perma_link_tag = document.createElement('a');
    perma_link_tag.href = perma_link.textContent.slice(31).replace('http://', 'https://');
    perma_link_tag.style.fontWeight = 'initial';
    perma_link_tag.innerText = perma_link.textContent.slice(31).replace('http://', 'https://');
    perma_link.textContent = perma_link.textContent.slice(1, 31);
    perma_link.parentElement.insertBefore(perma_link_tag, perma_link.nextSibling);
    if (/comics\/\s*$/.test(img_link.textContent)) {
      img_link.parentElement.insertBefore(document.createElement('br'), img_link);
      img_link.parentElement.removeChild(img_link);
    } else {
      var imgLinkTag = document.createElement('a');
      imgLinkTag.style.fontWeight = 'initial';
      imgLinkTag.href = img_link.textContent.slice(39, -1).replace('http://', 'https://');
      imgLinkTag.innerText = img_link.textContent.slice(39, -1).replace('http://', 'https://');
      img_link.textContent = img_link.textContent.slice(1, 39);
      img_link.parentElement.insertBefore(imgLinkTag, img_link.nextSibling);
    }

    var next_buttons;
    var previous_buttons;
    repeat(100, function() {
      next_buttons = window.Array.prototype.slice.call(document.querySelectorAll('[rel="next"], [href="/"]'), 1);
      previous_buttons = document.querySelectorAll('[rel="prev"], [href="/1/"]');
      return next_buttons.length === 4 && previous_buttons.length === 4;
    }, function() {
      if (previous_buttons[1].getAttribute('href') === '#') {
        number = 1;
        repeat(100, disable(previous_buttons));
      } else {
        number = +previous_buttons[1].getAttribute('href').slice(1, -1) + 1;
        if (number === 404) {
          if (document.getElementById('ctitle').firstChild.textContent === 'Journal 3') {
            number++;
            previous_buttons[1].href = '/404/';
            previous_buttons[3].href = '/404/';
          } else {
            next_buttons[0].href = '/405/';
            next_buttons[2].href = '/405/';
          }
        } else if (number === 403) {
          next_buttons[0].href = '/404/';
          next_buttons[2].href = '/404/';
        } else if (next_buttons[0].getAttribute('href') === '#') {
          repeat(100, disable(next_buttons));
          document.querySelector('[href="/"]').removeAttribute('href');
        }
      }
    });

    switch (number) {
      case 259:
        comic.firstElementChild.setAttribute('title', comic.firstElementChild.getAttribute('title').replace('&eacute;', '\xE9'));
        document.title = 'xkcd: Clich\xE9d Exchanges';
        break;
    }

    repeat(1000, function() {
      if (comic.firstElementChild.tagName.toLowerCase() === 'script') {
        return false;
      }
      window.setTimeout(function() {
        if (hr) {
          comic.parentElement.insertBefore(document.createElement('hr'), comic.nextSibling);
          comic.parentElement.insertBefore(document.createElement('hr'), comic);
        }
        if (title_text) {
          var title = document.createElement('p');
          var title_content;
          if (!comic.firstElementChild.hasAttribute('title')) {
            title_content = comic.firstElementChild;
            if (!title_content.firstElementChild || !title_content.firstElementChild.hasAttribute('title')) {
              return;
            }
            title_content = title_content.firstElementChild;
          } else {
            if (comic.firstElementChild.nodeName.toLowerCase() === 'iframe' && comic.firstElementChild.nextElementSibling.hasAttribute &&
                comic.firstElementChild.nextElementSibling.hasAttribute('title')) {
              comic.firstElementChild.removeAttribute('title');
              title_content = comic.firstElementChild.nextElementSibling;
            } else {
              title_content = comic.firstElementChild;
            }
          }
          title.textContent = title_content.title;
          title.style = 'font-variant:normal;padding-left:80px;padding-right:80px;font-size:20px';
          comic.parentElement.insertBefore(title, comic.nextSibling);
          title_content.removeAttribute('title');
        }
      }, 0);
      return true;
    });

    if (explain_button) {
      var link = document.createElement('a');
      link.href = 'http://www.explainxkcd.com/' + number + '/';
      link.style =
        'font-family:xkcd-Regular;font-variant:normal;margin-left:5px;display:inline-block;font-size:20px;padding:0px 5px 5px';
      link.textContent = 'Explain!';

      var nav = document.createElement('ul');
      nav.className = 'comicNav';
      nav.style.marginBottom = 0;
      nav.appendChild(document.createElement('li'));
      nav.firstChild.appendChild(link);

      var old_nav = document.getElementsByClassName('comicNav')[1];
      old_nav.parentElement.insertBefore(nav, old_nav.nextSibling);
    }

    document.addEventListener('keydown', function(event) {
      if (is_editable(document.activeElement)) {
        return;
      }
      var e = event || window.event || {};
      var key_code = e.which || e.charCode || e.keyCode;
      if (number === 1608 && document.activeElement.id === 'explore' && (key_code === key_codes.right || key_code === key_codes.left)) {
        return;
      }
      var node;
      if (key_code === key_codes.right || key_code === key_codes.n) {
        node = document.querySelector('[rel="next"]');
      } else if (key_code === key_codes.left || key_code === key_codes.p) {
        node = document.querySelector('[rel="prev"]');
      } else if (key_code === key_codes.r) {
        window.location.href = '//c.xkcd.com/random/comic/';
      }
      if (node) {
        node.click();
      }
    }, true);
    if (transcript) {
      var info;
      if (1662 >= number && number >= 1609) {
        info = '/' + (number + 2) + '/info.0.json';
      } else if ( /* 1677 >= number && */ number >= 1663) {
        info = '/' + (number + 3) + '/info.0.json';
      } else {
        info = 'info.0.json';
      }

      var others = new window.RegExp('\\s*(?:' + [
        "{{It's commonly known that too much perspective can be a downer.}}",
        '{{They are six-legged spiders}}',
        "{{I don't want to talk about it}}",
        '{{No more, no less}}',
        '{{Love and circuit analysis, hand in hand at last.}}',
        '{{Medium: Pencil on paper}}',
        '{[title text: A tribute to Buttercup Festival.}}',
        "{{It's science!}}",
        "{{alt: I always wanted to impress them with how well I could hear, didn't you? Also, this sets " +
          "the record for number of awkward-pause panels in one strip (previously held by Achewood)]]",
        "{{Your IDE's color may vary.}}",
        "alt-text: And she's gonna feel like a jerk when she realizes it was actually Under Pressure.",
        "{{In fact, draw all your rotational matrices sideways.  Your professors will love it!  And then they'll go home and shrink.}}",
        "{{I hear once you've worked there 256 days, they teach you the secret of levitation.}}",
        '{Title text: Nonrewritable tape?}',
        '{{rollover text: Wait, forgot to escape a space. Wheeeeee[taptaptap]eeeeee.}}',
        '{{alt text: Also, I hear the 4th root of (9^2 + 19^2\n22) is pi.',
        "[[Comic alt text: Later we'll dress up like Big Oil thugs and jump Ralph Nader.]]",
        'alt text: The MythBusters are even more sinister.',
        "{{It's like they say, you gotta fight fire with clich\u00c3\u00a9s.}}",

        '{[title text: A tribute to Buttercup Festival.}}',
        "[[Alt text: If you're interested in the subject, Lawrence Lessig's 'Free Culture' is pretty good]]",
        "{{Mouseover text:  James suggested this, and I'd have to agree.  It'd be much worse.}}"

      ].map(function(s) {
        return s.replace(/([.^$*+?()[\]{}\\|\-])/g, '\\$1');
      }).join('|') + ')\\s*$');

      xhr(info).then(function(i) {
        var response;
        try {
          response = window.JSON.parse(i);
        } catch (e) {
          return;
        }
        if (!response || !response.transcript) {
          return;
        }
        var node = document.createElement('p');
        var escaped = response.transcript
          .replace(/^\s*\{\{\s*(?:title|alt|tag|mouseover)[ -]?(?:text|title)?:[^\}]*\}\}?\s*/i,  '')
          .replace( /\s*\{\{\s*(?:title|alt|tag|mouseover)[ -]?(?:text|title)?:[^\}]*\}\}?\s*$/i, '')
          .replace(/^\s*\[\[\s*(?:title|alt|tag|mouseover)[ -]?(?:text|title)?:[^\]]*\]\]?\s*/i,  '')
          .replace( /\s*\[\[\s*(?:title|alt|tag|mouseover)[ -]?(?:text|title)?:[^\]]*\]\]?\s*$/i, '')
          .replace(others, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
          .replace(/\n{{title text: Uh-oh.}}\n{{compare to http:\nxkcd.com\n8\n}}/,
                  '\n{{compare to <a href="/8/">https://xkcd.com/8/</a>}}')
          .replace(/\n/g, '<br style="display: block; margin: 3px 0;">');
        // String has been encoded as UTF-8
        // A few times...
        try {
          for (var times = 5; times--;) {
            escaped = window.decodeURIComponent(window.escape(escaped));
          }
        } catch (e) {}
        node.innerHTML = escaped;
        node.style =
          'font-variant:normal;padding-left:80px;padding-right:80px;font-size:14px;text-align:left;white-space:pre-wrap';
        var ul = document.getElementsByTagName('ul');
        ul = ul[ul.length - 1];
        var parent = ul.parentElement;
        ul = ul.nextSibling;
        if (hr) {
          parent.insertBefore(document.createElement('hr'), ul);
        }
        parent.insertBefore(node, ul);
        if (hr) {
          parent.insertBefore(document.createElement('hr'), ul);
        }
      });
    }
  }

  if (/(?:^\?|&)tweaks=(?:false|f|0|)(?:&|$)/i.test(window.location.search)) {
    return;
  }

  var location = window.location.href;
  var new_location = location.toLowerCase()
    .replace(/^(?:https?:)?(?:\/\/)?(?:www\.)?/, 'https://')
    .replace(/^https?:\/\/whatif/, 'https://what-if')
    .replace(/\/#$/, '/')
    .replace(/^(https:\/\/(?:what-if\.)?xkcd\.com\/\d+)$/, '$1/');
  if (new_location !== location) {
    window.location.replace(new_location);
  }

  document.addEventListener('DOMContentLoaded', main, true);
  window.addEventListener('load', main, true);
  if (document.readyState !== 'loading') {
    main();
  }

})(function(context) {
  /* Greasemonkey is sandboxing even though @grant none is used workaround to get a `window`. */
  if (this) {
    return this;
  }
  if (typeof window === 'object' && window !== null && window.window === window) {
    return window;
  }
  if (typeof self === 'object' && self !== null && self.self === self) {
    return self;
  }
  if (typeof global === 'object' && global !== null && global.global === global) {
    return global;
  }
  return context;
}(this));
