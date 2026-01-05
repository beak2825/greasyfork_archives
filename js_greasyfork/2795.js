// -*- coding: utf-8-dos -*-
// ==UserScript==
// @name        Skip matome headlines
// @namespace   http://idaemons.org/
// @description Skip headline-only pages of meta matome sites.
// @author      Akinori MUSHA
// @include     http://2ch-2.net/feed/*/*
// @include     http://2ch-c.net/?gt=*
// @include     http://2ch-matome.com/article/*
// @include     http://2ch-matome.com/pickup/*/*
// @include     http://2ch-matome.net/pickup/*/
// @include     http://watch2ch.2chblog.jp/archives/*.html*
// @include     http://2chnavi.net/headline/*
// @include     http://a.anipo.jp/c/rss/*
// @include     http://overseas.antenam.info/items/view/*
// @include     http://www.antennash.com/?pick=*
// @include     http://baseball-mag.net/?id=*
// @include     http://besttrendnews.net/*/*.html
// @include     http://timely.blog.jp/archives/*.html*
// @include     http://digital-soccer.net/?pid=*
// @include     http://blog-news.doorblog.jp/archives/*.html*
// @include     http://blog-ranking.doorblog.jp/archives/*.html
// @include     http://matonew.doorblog.jp/archives/*.html*
// @include     http://newmofu.doorblog.jp/archives/*.html*
// @include     http://newpuru.doorblog.jp/archives/*.html*
// @include     http://news-pod.net/*/?entry=*
// @include     http://newresu1.blog.fc2.com/?c=pickup&id=*
// @include     http://newyaku.blog.fc2.com/?c=pickup&id=*
// @include     http://newyaku.blog.fc2.com/blog-entry-*.html
// @include     http://afoafodayo.blog84.fc2.com/blog-entry-*.html
// @include     http://vipsister.blog72.fc2.com/blog-entry-*.html
// @include     http://ga-t.net/rss/*
// @include     http://get2ch.net/?*
// @include     http://gurugurulog.com/archives/*.html*
// @include     http://katuru.com/rss/*.html
// @include     http://kita-kore.com/archives/*.html
// @include     http://konowaro.net/archives/*.html
// @include     http://matomeantena.com/feed/*
// @include     http://matomeja.jp/feed/*/?*
// @include     http://matomesakura.com/?rs=*
// @include     http://matomesakura.com/fix/?*
// @include     http://matometatta-news.net/archives/*.html
// @include     http://matomeume.com/?rs=*
// @include     http://mosi2ch.net/rss.php?d=*
// @include     http://moudamepo.com/pick.cgi?code=*
// @include     http://news-choice.net/2ch/*.html*
// @include     http://news-choice.net/archives/*.html
// @include     http://news-select.net/archives/*.html
// @include     http://news-three-stars.net/archives/*.html
// @include     http://newser.cc/date-*.html?order=link&ni=*
// @include     http://newspickup.com/archives/*.html
// @include     http://nullpoantenna.com/feed/*
// @include     http://rotco.jp/rss/*
// @include     http://suomi-neito.com/*/archive/*.html*
// @include     http://uhouho2ch.com/*/*.html
// @grant       none
// @license     2-clause BSDL
// @homepage    https://greasyfork.org/scripts/2795-skip-matome-headlines
// @homepage    https://github.com/knu/userjs-skip_matome_headlines
// @version     1.0.19
// @downloadURL https://update.greasyfork.org/scripts/2795/Skip%20matome%20headlines.user.js
// @updateURL https://update.greasyfork.org/scripts/2795/Skip%20matome%20headlines.meta.js
// ==/UserScript==

(function () {
    var done = false;
    var try_redirect_1 = function (proc) {
        var url, exc;
        if (!done && (url = proc())) {
            try {
                var element = document.createElement('a');
                element.setAttribute('href', url);
                element.appendChild(document.createTextNode('Link'));
                document.body.appendChild(element);
                element.click();
                done = true;
                return true;
            } catch (exc) {}
        }
        return false;
    }, failures = 0, try_redirect = function (proc) {
        if (try_redirect_1(proc)) {
            return true;
        } else {
            var id = setInterval(function () {
                if (!try_redirect_1(proc)) {
                    if (++failures < 30)
                        return;
                    console.log('pickup not found.');
                }
                clearInterval(id);
            }, 1000);
            return false;
        }
    }, byQuery = function (query, property) {
        try_redirect(function () {
            var element = document.querySelector(query);
            if (!element) return null;
            return element[property || 'href'];
        });
    }, evalXPathFirst = function (query, node, proc) {
        if (proc == null) {
            proc = node;
            node = document;
        }
        var e, result, i, x;
        try {
             result = document.evaluate(query, node, null, 5, null);
        } catch (e) {
            alert(e + ": " + query);
            throw e;
        }
        while ((i = result.iterateNext())) {
            if ((x = proc(i)))
                return x;
        }
        return null;
    }, evalXPathToString = function (query) {
        var e;
        try {
            return document.evaluate(query, document, null, 2, null).stringValue;
        } catch (e) {
            alert(e + ": " + query);
            throw e;
        }
    }, byXPath = function (query) {
        try_redirect(function () {
            return evalXPathToString(query);
        });
    }, byXPathFirst = function (query, proc) {
        try_redirect(function () {
            return evalXPathFirst(query, proc);
        });
    }, xpathAnd = function () {
        var args = Array.prototype.slice.call(arguments);
        return args.join(' and ');
    }, xpathOr = function () {
        var args = Array.prototype.slice.call(arguments);
        return '(' + args.join(' or ') + ')';
    }, xpathNot = function (expr) {
        return 'not(' + expr + ')';
    }, xpathString = function (string) {
        var args = string.split(/('+)/).
            filter(function (s) { return s.length > 0 }).
            map(function (s) {
                if (s.indexOf("'") >= 0)
                    return '"' + s + '"';
                return "'" + s + "'";
            });
        switch (args.length) {
          case 0:
            return "''";
          case 1:
            return args[0];
          default:
            return 'concat(' + args.join(', ') + ')';
        }
    }, xpathContains = function (target, substring) {
        return 'contains(' + target + ', ' + substring + ')';
    }, xpathStartsWith = function (target, prefix) {
        return 'starts-with(' + target + ', ' + prefix + ')';
    }, xpathEndsWith = function (target, suffix) {
        return target + ' = concat(substring-before(' + target + ', ' + suffix + '), ' + suffix + ')';
    }, normalizeSpace = function (string) {
        return string.replace(/(?:^\s+|\s+$)/g, '').replace(/\s+/g, ' ');
    };

    var m;

    if ((m = location.search.match(/[?&]url=([^&]+)/))) {
        var url = decodeURIComponent(m[1]);
        if (url.match(/^https?:\/\//)) {
            location.href = url;
            return;
        } else if (url.match(/\/\/:s?ptth$/)) {
            url = url.split('').reverse().join('');
            location.href = url;
            return;
        }
    }

    switch (location.host) {
      case 'a.anipo.jp':
        if (location.pathname.match(/([0-9]+)$/)) {
            byQuery('tr[eid="' + RegExp.$1 + '"] th a[name="title"]');
        }
        break;
      case 'news-three-stars.net':
        byQuery('.pickuplink.select a');
        break;
      case '2ch-matome.com':
      case 'get2ch.net':
      case 'moudamepo.com':
        byXPath('//a[boolean(descendant-or-self::*[contains(concat(" ", @class), " pickup")])]/@href') ||
            byXPath('//a[boolean(ancestor-or-self::*[contains(concat(" ", @class), " pickup")])]/@href');
        break;
      case 'konowaro.net':
        byQuery('.pickuplink.selected a');
        break;
      case 'matomesakura.com':
      case 'matomeume.com':
        byXPath('(//text()[contains(., "PICK UP")]/following-sibling::a)[1]/@href');
        break;
      case 'nullpoantenna.com':
        byXPathFirst('//a[@class="feed-click"]/@href', function (href) {
            return href.value.replace(/\/feed\//, "/feed-click/");
        });
        break;
      default:
        var root = location.protocol + '//' + location.host + '/';

        var checkLink = function (url) {
            if (url == null)
                return null;

            // ga-t.net: /count/123
            // overseas.antenam.info: /items/click/123
            // rotco.jp: ../link/123
            // suomi-neito.com: /out/123
            // news-choice.net: /~host.domain/path...
            // matomeantena.com: /feed-click/123
            if (url.match(/\/(((feed-)?click|count|link|out)\/[0-9]+$|~.*\..*\/)/))
                return url;

            if (url.lastIndexOf(root, 0) != 0)
                return url;

            return null;
        };

        var checkCaption = function (caption, title) {
            if (caption == null)
                return false;

            caption = normalizeSpace(caption).replace(/[….]+$/, '');

            if (caption < 3)
                return false;

            caption = caption.substring(0, 30);
            title = normalizeSpace(title);

            return title.indexOf(caption) >= 0;
        };

        [
            function () { return document.title },
            function () { return evalXPathToString('//h1//a/@title') },
            function () { return evalXPathToString('//h1//a/text()') },
            function () { return evalXPathToString('//h2//a/@title') },
            function () { return evalXPathToString('//h2//a/text()') }
        ].forEach(function (func) {
            var title = func();
            byXPathFirst('//a[' +
                         xpathAnd('@href',
                                  xpathNot('boolean(ancestor::h1)'),
                                  xpathNot('boolean(ancestor::h2)')) +
                         ']', function (a) {
                                  if ((checkCaption(a.title, title) ||
                                       evalXPathFirst('descendant-or-self::text()', a, function (text) {
                                           return checkCaption(text.textContent, title)
                                       })) &&
                                      checkLink(a.href)) {
                                      return a.href;
                                  }

                                  return null;
                              });
        });
        break;
    }
})();
