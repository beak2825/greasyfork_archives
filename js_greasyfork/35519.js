// ==UserScript==
// @name        Ficscript 4.x
// @namespace   *
// @author      Dimava
// @description Улучшатель Фикбука, версия четвёртая. Скоро будет пятая.
// @include     https://ficbook.net*
// @version     4.6.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35519/Ficscript%204x.user.js
// @updateURL https://update.greasyfork.org/scripts/35519/Ficscript%204x.meta.js
// ==/UserScript==
// function list:
//  - loadNextPage : loads next page to memory
//  - showNextPage : shows next page
//  - onPageLoad : casts everything needed when page loads
//  - urlize : creates links in plane text
//  - picturize : makes links to show picture
//  - keyActions : binds certain actions to keys
//  - chooseMode : selects page type : part/parts/search/coll/etc
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
// INITIALIZATION
// run-at      document-start
var fic;
if (window.fic_parts == null) {
  fic = {
  };
  if (window.fic == null) window.fic = fic;
  window.fic_parts = fic;
} else {
  fic = window.fic_parts;
};
fic.debug = true; //false;
var log = fic.Debug = function (s) {
  if (fic.debug) console.log(s);
};
fic.log = log;
function FuncArray(name, prev = null) {
  this.name = name;
  this.after = [
  ];
  if (prev) prev.after.push(this);
  this.list = [
  ];
  this.last = 0;
  this.push = function (f) {
    return this.list.push(f);
  };
  this.cast = function () {
    log('Calling ' + name + '(' + this.list.length + ')');
    this.list.forEach(function (e) {
      e();
    });
    this.last = this.list.length;
    this.after.forEach(function (e) {
      log(name + '➡' + e.name);
      e.wait();
    });
  };
  this.wait = function (dt) {
    if (!( + dt > 0)) dt = 1;
    var e = this;
    setTimeout(function () {
      e.cast();
    }, dt);
  };
  this.castLate = function () {
    if (this.last != this.list.length) {
      log('Calling end of ' + name + '(' + (this.list.length - this.last) + ')');
      this.list.forEach(function (e, i) {
        if (i >= this.last) e();
      });
      this.last = this.list.length;
    } else log('⇒' + name);
    this.after.forEach(function (e) {
      log(name + '⇒' + e.name);
      e.waitLate();
    });
  };
  this.waitLate = function (dt) {
    if (!( + dt > 0)) dt = 1;
    var e = this;
    setTimeout(function () {
      e.castLate();
    }, dt);
  };
};
fic.FuncArray = FuncArray;
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
fic.load = fic.onLoad = new FuncArray('[when page loaded]'); // casted by ANOTHER script
fic.Load = fic.afterLoad = new FuncArray('[after page loaded]'); // casted by window
window.onload = function () {
  fic.load.castLate();
  fic.Load.wait();
}
// [load] is casted by other scripts;
// document.onload = function () {
//   console.log('loaded');          //does not work :c
//   fic.load.cast();
// };document.addEventListener('load',function(e){console.log(e)})
//

fic.next = fic.onNextLoad = new FuncArray('[when next page loaded]');
fic.Next = fic.afterNextLoad = new FuncArray('[after next page loaded]', fic.next);
//
fic.show = fic.onNextShow = new FuncArray('[show next page]');
fic.Show = fic.afterNextShow = new FuncArray('[after next page shown]', fic.show);
//
fic.tab = fic.onShowHide = new FuncArray('[tab switch]');
fic.style = fic.addStyle = new FuncArray('[add style]', fic.load);
fic.Style = fic.forceStyle = new FuncArray('[force add style]', fic.Load);
//
fic.nextPageLoaded = false;
fic.nextPageData = '';
fic.type = function () {
  if (fic._type != null && fic._type.charAt(0) != '?') return fic._type;
  if (fic._type == null) fic._type = 'etc';
  if (location.hash == '#part_content') {
    fic._type = '?part';
    if (location.pathname.split('/').length == 4) {
      fic._type = 'part';
    } else {
      fic._type = '?contents';
      if (document.getElementById('footer') != null) {
        if (document.getElementsByClassName('table-of-contents').length)
        fic._type = 'contents';
         else fic._type = 'part';
      }
    }
  } // part , ?contents , contents
   else if (location.pathname == '/home/favourites') {
    fic._type = 'favs';
  } // favs
   else if (location.pathname == '/home/collections') {
    if (location.search.indexOf('type=update') > - 1) fic._type = 'cols_up';
     else if (location.search.indexOf('type=other') > - 1) fic._type = 'cols_etc';
     else fic._type = 'cols'
  } // cols , cols_up , cols_etc
   else if (location.pathname == '/find') {
    fic._type = 'find';
  } // find
   else if (location.pathname == '/home/fallows') {
    fic._type = 'fallows';
  } // fallows


  return fic._type;
} // "part" | "?contents" | "contents" | "favs" | "cols" | "cols_up" | "cols_etc" | "find" | "etc" | "fallows"

fic.nextPageMode = {
  part: 'withComments', // "withComments" | "" (without comments)
  favs: '10 append', // "{maxPages} append" | "" (replace)
  cols_up: '10 append', // "{maxPages} append" | "" (replace)
  cols_etc: 'load', // "load" | ""
  find: '10 append' // "{maxPages} append" | "" (replace)
};
fic.showNextPage = function showNextPage() {
  fic.log('no next page');
};
fic.showNextPageDefault = fic.showNextPage;
fic.success = [
  'fic:parts:init'
];
fic.load.push(function () {
  fic.style.cast();
  $(document).on('contextmenu', 'a,img', function (e) {
    fic.contextMenuCaller = this;
  });
});
fic.Load.push(function () {
  fic.load.cast();
  log(fic.success);
});

// ==UserScript==
// @name        fic:parts:actions
// @namespace   *
// @include     https://ficbook.net/*
// @version     1
// @grant       none
// ==/UserScript==
fic.Style.push(function() {
    $('.part_text').css({
        'min-width': '600px',
        'max-width': '600px',
        width: '70%',
        margin: 'auto',
        padding: 0
    });
});
$(document).keypress(function(e) {
    if (e.keyCode == 39) // if [->] key pressed
    // with [shift] pressed or under chapter end
        if (e.shiftKey || $('.sub-footer')[0].getBoundingClientRect().y < window.innerHeight) {
        fic.showNextPage(); // show next page
    }
});
fic.tabber = function tabber() {
    $('.part_text').each(function() {
        var s = this.innerHTML;
        fic.i = 0;
        var ar = [];
        [
            [/(\s*<br>){4,}/g, '<br><br><br>'],
            [/(…|\.\.\.?(\.(?!\.))?)(\s|&nbsp;)?(?=[\wа-яА-Я])/g, '… '],
            [/(\s|&nbsp;|&emsp;)*(\u2013|\u2014|&#821[1];)(\s|&nbsp;)*/g, ' - '],
            [/--?(?![\->\wа-яА-Я])|([^\-\wа-яА-Я])-(?![\->\w])/g, '$1 - '],
            [/([а-яА-Я,-])\s*(<br>\s*)+(?=[а-я])/g, '$1 ', 'wrong line break'],
            [/(\s|nbsp;|&emsp;)+-(\s|nbsp;)*,(?!,)/g, ', - '],
            [/(<br>|<p (?!)[^>]*>|<div [^>]*>|^)(\s|&nbsp;|&emsp;)*(?!<br>|<p |<div |\s|&nbsp;)/g, '$1&emsp;&emsp;', 'tab'],
            [/(\s|&nbsp;)+-(\s|&nbsp;)+/g, ' &#8211;&nbsp;', 'ldash+nbsp'], //
            [/(<br>|<p [^>]*>|<div [^>]*>|^)(\s|&nbsp;|&emsp;)*(-|&#8211;)(\s|&nbsp;)*/g, '$1&emsp;&nbsp;&#8211;&nbsp;', '\\n  – '],
            [/((<br>|<p.*?>|^)([^\wа-яА-Я<]|&#?\w{1,9};|&nbsp;|&emsp;|<(?!br|p|div)[^>]*>)*)([а-я])/g, function bigFirstLatter(s, a, b, c, d, e) {
                return a + d.toUpperCase();
            }],
            [/([а-я])(?!\. [А-Я])( ?\. ?)(?=[А-Я](?!\.))/g, '$1. ', '" ."'], //
            [/ *, *(?=[а-яА-Я&-])/g, ', ', '" ,"'], //
            [/<p[^>]*(center|right)[^>]*>[\d\D]*?<\/p>/g, function noRightTabs(s) {
                return s.replace(/(<p[^>]*>|<br>|<div [^>]*>)(\s|&nbsp;|&emsp;)*/g, '$1');
            }], //
            [/(.*|\n)*/, function lbr(s) {
                if ((s.match(/<br>\s*<br>/g) || '').length * 2.5 > (s.match(/<br>/g) || '').length)
                    s = s.replace(/<br>\s*<br>(?!\s*<br>)/g, '<lbr>lbr</lbr>');
                return s;
            }],
            [/([^<>&]|&\w{1,9};|<(?!br)[^>]*>){9800,}/g, function splitTextWall(s) {
                function len(s) {
                    return s.match(/&\w{1,9};|<.*?>|.|^$/g).length;
                }
                var a = s.match(/[\D\d]*?([.|…|?|!])(\s|&nbsp;)*(?=[А-Я]|$)|[\D\d]+$/g),
                    n = Math.ceil(len(s) / 600),
                    l = s.length / n + 4,
                    c = '';
                for (i = 0; i < a.length - 1; i++) {
                    var cl = len(c) / l;
                    var al = cl + len(a[i]) / l;
                    if (Math.ceil(cl) < Math.ceil(al)) {
                        if ((1 - cl % 1) < al % 1)
                            c += '<br>&emsp;' + a[i];
                        else
                            c += a[i] + '<br>&emsp;';
                    } else
                        c += a[i];
                };
                c += a.pop();
                return c;
            }] //
        ].forEach(function(a) {
            fic.i++;
            var n = s.match(a[0]);
            if (!n) return;
            ar.push(n.length,'x ',(a[2] || a[1].name || a[1]),'\n');
            s = s.replace(a[0], a[1]);
        });
        console.log('ar:\n', ar.join(''));
        this.innerHTML = s;
        setTimeout(() =>
            $('#togglePartJustification.active').click().click(), 4);
    })
};
fic.text = function(s) {
    return s ? $('.part_text').html(s) : $('.part_text').html();
};
fic.Load.push(fic.tabber);
fic.show.push(fic.tabber);

function titleLink() {
    if (fic.type() == 'part')
        $('.title-area h2').click(function() {
            location.href = location.href.replace(/\/[^\/]+$/, '#part_content')
        })
}
fic.Load.push(titleLink);
fic.show.push(titleLink);
$(document).on('contextmenu', 'a,img', function(e) {
    fic.contextMenuCaller = this;
})
fic.success.push('fic:parts:actions');
fic.load.castLate();
if (fic.type() == 'part')
    fic.Load.push(function() {
        $('<style/>').html('.btn-next .btn-next{z-index:11;position: fixed;' +
            'right: -100%;bottom: 10px; background-color: wheat;padding-left: 7px;font-size:16px;' +
            'border-radius: 15px 18px 10px 15px;border 1px solid brown;opacity:0.7;transition:right 1s,font-size 1s;}' +
            '.btn-next .btn-fixed{right:60px;font-size:16px;}' +
            '.btn-next .btn-next span{display:inline !important;}' +
            '.btn-next .btn-next i{background-color: wheat}' +
            '.btn-next .btn-next::before,.btn-next .btn-next::after,.btn-next .btn-next i::after' +
            '{content:"";border:0px solid brown;position:fixed;transition:border-width 1s;opacity:0.7;}' +
            '.btn-next .btn-fixed::before,.btn-next .btn-fixed::after,.btn-next .btn-fixed i::after{border-width:30px;}' +
            '.btn-next .btn-next::before{left:0;top:0;border-color:brown transparent transparent brown;}' +
            '.btn-next .btn-next::after{left:0;bottom:0;border-color:transparent transparent brown brown;}' +
            '.btn-next .btn-next i::after{right:0;top:0;border-color:brown brown transparent transparent;width:0;}' +
            '').appendTo($('head'));
        var z = 1;
        $(document).scroll(function f(e) {
            if (!$('.btn-next').length) return;
            //         var y = $('.info-links') [0].getBoundingClientRect().y;
            if ($('.btn-next .btn-next').length == 0)
                $('.btn-next:last').append($('.btn-next:last').clone());
            var y = $('.btn-next:has(.btn-next)')[0].getBoundingClientRect().y - window.innerHeight;
            if (y > 0 && z < 0)
                $('.btn-next .btn-next').removeClass('btn-fixed');
            if (y < 0 && z > 0) {
                $('.btn-next .btn-next').addClass('btn-fixed');
            }
            z = y;
        })
    });
//
//
fic.preload = function() {
    fic.preloaded = true;
    var l = 0;
    setTimeout(function() {
        toastr.success('Все части загружаются!');
    }, 400);
    $._get = $._get || $.get;
    $.got = $.got || {};
    $.get = function(h, f = $.noop) {
        if ($.got[h])
            return f.apply(this, $.got[h]);
        else
            return $._get.apply(this, arguments);
    };
    $.preload = function(h, f = $.noop) {
        return $._get(h, function(data) {
            $.got[h] = arguments;
            f(data);
            //toastr.info(data.match(/<div[^>]*class="[^"]*title-area[^"]*"[^>]*>\s*<h2>([^<>]*)<.h2>/)[1]);
        });
    };
    var s = $('.btn-next').attr('href');
    f(s);

    function f(s) {
        l++;
        $.preload(s, function(d) {
            console.log(s, 'loaded');
            var h = d.match(/[^"]*(?=" class="pull-right btn-next")/);
            if (h && h[0])
                f(h[0]);
            else {
                console.log('all chaps done!');
                setTimeout(function() {
                    toastr.success('Все ' + l + ' части загружены!');
                }, 400);
            }
        });
    };
};
$(document).on('click', 'h1', function(e) {
    fic.preload();
});
fic.writeTime = writeTime;

function writeTime() {
    $('time,.table-of-contents div span,article.block div span[title]').each(function() {
        var dt = $(this).attr('datetime') || $(this).attr('title');
        $(this).attr('title') || $(this).attr('title', dt);
        if (!dt) return;
        [/(\d*) января /, /(\d*) февраля /, /(\d*) марта /, /(\d*) апреля /,
            /(\d*) мая /, /(\d*) июня /, /(\d*) июля /, /(\d*) августа /,
            /(\d*) сентября /, /(\d*) октября /, /(\d*) ноября /, /(\d*) декабря /
        ]
        .forEach((e, i) => dt = dt.replace(e, (i + 1) + '/$1/'));
        var tt = dt;
        dt = new Date(dt.match(/(\d+\D+){4}\d+/)[0])
        dt = new Date() - dt;
        var m = dt / 1000 / 60,
            t = m < 0 ? (m = -m, 'вперед') : 'назад',
            h = m / 60,
            d = h / 24,
            w = d / 7;
        m = parseInt(m % 60);
        h = parseInt(h % 24);
        d = parseInt(d % 7);
        w = parseInt(w);

        function f(n, s1, s2, s3, s = '') {
            if (n > 9 && n < 20) return s + s3;
            else if (n % 10 == 1) return s + s1;
            else if (n % 10 > 1 && n % 10 < 5) return s + s2;
            else return s + s3;
        }
        m = m ? m + f(m, 'у', 'ы', '', ' минут') + ' ' : '';
        h = h ? h + f(h, '', 'а', 'ов', ' час') + ' ' : '';
        d = d ? d + f(d, 'ень', 'ня', 'ней', ' д') + ' ' : '';
        w = w ? w + f(w, 'ю', 'и', 'ь', ' недел') + ' ' : '';
        this.innerText = tt.replace(/(\d+\D+){4,5}\d+\s*(назад|впер[её]д)?/, w + d + h + m + t);
    });
}
fic.load.push(writeTime);
fic.Show.push(writeTime);
writeTime();
setTimeout(writeTime, 60000)

fic.dirToLeft = function() {
    $('.direction:nth-child(2)').each((i, e) => $(e).parent().prepend(e));
};
// fic.load.push(fic.dirToLeft);
// fic.Show.push(fic.dirToLeft);
fic.moveDirToGenre = function() {
    $('dt').filter((i, e) => e.innerHTML.includes('Жанры')).next().not(':has(strong[class*="direction-"])').each(function(i, e) {
        var maindir = $(e).closest(':has(.direction,.direction-fic-hat)').find('.direction,.direction-fic-hat')/*.hide()*/[0].className.replace(/direction|fic-hat|-|\s/g, '');
        var extradir = $(e).next().next().find('strong').filter((i, e) => e.innerHTML.match('Элементы'));
        function block(dir) {
            var tr = {
                het: 'Гет',
                gen: 'Джен',
                slash: 'Слэш',
                femslash: 'Фемслэш',
                mixed: 'Смешанная',
                article: 'Статья'
            };
            return $('<strong class="liked-parameter-link direction-' + dir + '">' + (tr[dir] || dir) + '</strong>');
        }

        function xblock(e) {
            var tr = {
                'гет': 'het',
                'джен': 'gen',
                'слэш': 'slash',
                'фемслэш': 'femslash'
            };
            var dir = $(e).text().match(/Элементы (.*)а/)[1];
            return block(tr[dir] || dir);
        }
        var x = $();
        extradir.each((i, e) => {
            console.log(i, e.innerText)
            if (i != 0)
                x = x.add('<span>&thinsp;/&thinsp;</span>');
            x = x.add(xblock(e));
            i = $(e).parent().contents().index(e);
            $(e).parent().contents().eq(i - 1).remove();
            $(e).remove();
        });
        var l = block(maindir);//.attr('title',maindir.attr('title'));
        if (maindir == 'mixed') {
            if (x.length)
                l = l.html('').append(x);
            else
                l.text('Смешанная');
        } else {
            if (x.length) {
                l = l.append('<span>&thinsp;(</span>').append(x).append('<span>)</span>');
            }
        }
        l = l.add('<span>, </span>');
        l.prependTo(e);
    });
};
fic.load.push(fic.moveDirToGenre);
fic.Show.push(fic.moveDirToGenre);
fic.style.push(()=>$('<style>').appendTo('head').html(
            'lbr{display:block;height:10px;color:transparent;}' +
//     '.fanfic-thumb-block .block{padding-left:30px !important}'+
    'dd>.liked-parameter-link[class*="direction-"]{padding:2px 4px}'+
    'dd>.liked-parameter-link[class*="direction-"] span{color:yellow !important;#542a00}'))
fic.load.push(function(){
  $('.block.fanfic-block-read:not(:has(.new-content))').hide();
});

// ==UserScript==
// @name        fic.parts.picturize
// @namespace   *
// @include     https://ficbook.net/*
// @version     1
// @grant       none
// ==/UserScript==
// for safety reasons. Actualy useless, and thus is not required.
//
/*
f = function(){
  // do something
}
fic.
    load : on load
    Load : after load
        .push(f);
*/
// should be in the end of each one.
///////////////////////////////////////////
//fic.style.push(function () {
  $('<style/>').appendTo('head').html('a.ficpic {color:green;}' +
  'a.ficvid {color:blue;}' +
  'a.coub {color:purple;}' +
  'iframe.ficvid,iframe.coub {display:inline-block;margin-left:calc(50% - ' + 720 + 'px / 2);height:480px;width:720px;}' + //480p, "height:360px;width:640;" for 360p
  'iframe.ficvid {background-color:#0000ff80;}' +
  'iframe.coub {background-color:#80008080;}' +
  'button.iframe-close {border:1px solid black;background-color:red;vertical-align:top;width:30px;}' +
  '.img-holder-universal.margin-auto {display: table;height: initial;}' +
  '.img-holder-universal.avatar-100.margin-auto {max-height:100px;}' +
  '.img-holder-universal.avatar-40.margin-auto {max-height:40px;}' +
  '.img-holder-universal.margin-auto a {display: table-cell;vertical-align: middle;}' +
  '.img-holder-universal.avatar-100 img {max-height:96px;}' +
  '.img-holder-universal.avatar-40 img {max-height:36px;}' +
  '#toTop {z-index:9;}' +
  '.fimg {transition: max-width 0.4s, max-height 0.4s, outline-color 0.4s, outline-width 0.4s, margin 0.4s; ' +
  'max-height: 50px; max-width: 100px; outline: 5px solid green; margin:6px;min-height: 10px;min-width: 10px;}' +
  '.fimg.done {outline-color:rgba(0,128,0,0.25);outline-width:3px; margin:4px;}' +
  '.bigimg {max-height: calc(100vh - 80px); max-width: calc(100% - 8px);outline-width:3px !important;}'  //   'iframe {width:720px;height:405px;margin:auto;display:block;}
  );
//});
///////////////////////////////////////////
fic.ops = fic.ops ? fic.ops : {
};
fic.ops.urlizePartText = true;
fic.ops.preloadImages = true;
fic.ops.instantBigImage = true;
fic.ops.onloadSmallImage = false;
// eval(('$.fn.urlize2 = ' + $.fn.urlize).replace('part_text', '_'));
jQuery.fn.extend({
  urlize2: function () {
    if (this.length > 0) {
      var e = this;
      e.each(function (e, t) {
        if (!$(t).hasClass('urlize')) return;
        var n = $(t).html();
        n = n.replace(/<div class="long_word.*?>([\w\W]*?)<\/div>/g, '$1');
        n = n.replace(/<div class="quoted.*?>([\w\W]*?)<\/div>/g, '&gt; $1');
        n = n.replace(/<a [^>]*>([\w\W]*?)<\/a>/g, '$1');
        //n = n.replace(/&lt;(\/?(b|i|s))&gt;/g, '<$1>');
        n = n.replace(/(([^<>&\s]|<[^>]*>xxx|&[^;]{,10};?|&){100,})/g, '<span class="long_word">$1</span>');
        n = n.replace(/h[*][*]p/g,'http');
        //  if(!$(t).is('urlized'))
        window.n = window.n + n;
        if (fic.ops.urlizePartText || !$(t).hasClass('part_text')) {
          var o = n.match(/\b(https?:\/\/|www\.|https?:\/\/www\.)[^ <]{1,400}[\wа-яА-Я]((?=$)|(?![\wа-яА-Я]))/g);
          if (o) {
            n = n.replace(/\b(https?:\/\/|www\.|https?:\/\/www\.)[^ <]{1,400}[\wа-яА-Я]((?=$|\s|\xa0)|(?![\wа-яА-Я]))(?!"?\s*>|<\/a>)/g, function (s) {
              var ut = $('<a>').html(s).text();
              var r = 0 === ut.indexOf('http://') || 0 === ut.indexOf('https://') ? '' : 'http://';
              var et = r + ut;
//               et = encodeURI(r + ut);//console.log(et)
              try {
                ut = decodeURI(ut);
//                 et = encodeURI(r + ut);
              } catch (e) {
              }
              if(et.match(/readfic.*readfic/)>0) alert(r+'\n'+ut+'\n'+et);
              return ' <a target="_blank" href="' + et + '">' + $('<a>').text(ut).html().replace(/^(https?:\/\/)?(www\.)?/, '') + '</a>';
            });
          } //           if (o) for (e = 0; e < o.length; e++) {
          //             var r = 0 === o[e].indexOf('http://') || 0 === o[e].indexOf('https://') ? '' : 'http://';
          //             var ut = o[e];
          //             var et = encodeURI(r + o[e]);
          //             try {
          //               ut = decodeURI(o[e]);
          //               et = encodeURI(r + ut);
          //             } catch (e) {
          //             }
          //             n = n.replace(o[e], '<a target="_blank" href="' + et + '">' + et + '</a>');
          //           }

          if (!$(t).hasClass('part_text')) {
            n = n.replace(/<\/?b>/g, '**'); //...
            n = n.replace(/\*\*(.*?)\*\*(?!\*)/g, function (e, t) {
              return '' == t ? '****' : '<strong>' + t + '</strong>';
            });
            n = n.replace(/(&(amp;)?gt;\s*<br>\s*){2,}/g, '$1');
            n = n.replace(/^&(amp;)?gt;([^\n]+)$/gm, '<div class="quoted"> $2 </div>');
            //             n = n.replace(/((^|<br>)\s*&gt;\s*(?=<br>\s*&gt;\s*<br>\s*&gt;\s*))*(^|<br>)\s*&gt;([^\n]+)(?=<br>|$)/g, '<div class="quoted"> $4 </div>');
            //             n = n.replace(/(^|\n|<br>)&(amp;)?gt;([^\n]+)/g, '$1<div class="quoted"> $3 </div>');
          }
        }
        $(t).html(n);
      });
    }
  }
});
///////////////////////////////////////////
$('<menu type="context" id="picturizeMenu"/>').append($('<menuitem/>').html('Picturize').click(function () {
  $(fic.contextMenuCaller).each(fic.loadpic)
})).appendTo($('body')).hide();
$('<menu type="context" id="picturizeImgMenu"/>').append($('<menuitem/>').html('Open in new tab').click(function () {
  window.open(fic.contextMenuCaller.src);
})).append($('<menuitem/>').html('Undo').click(function (e) {
  $(fic.contextMenuCaller).replaceWith($('<span class="urlize"/>').text(fic.contextMenuCaller.oldSrc));
  var a = fic.ops.preloadImages;
  fic.ops.preloadImages = false;
  fic.picturize();
  fic.ops.preloadImages = a;
})).appendTo($('body')).hide();
fic.loadpic = function () {
  var inDesc = $(this).closest('.description').length;
  var img = new Image();
  img.className = 'fimg';
  var $img = $(img).attr('contextmenu', 'picturizeImgMenu');
  if (fic.ops.instantBigImage && !inDesc)
    $img.addClass('bigimg');
  img.onload = function () {
    $img.addClass('done');
    if (!fic.ops.onloadSmallImage)
    if (!inDesc)
    $img.addClass('bigimg');
  };
  var a = this;
  img.onerror = function () {
    a.failed=(a.failed||0)+1;
    fic.log('img "'+img.src+'" failed.'+(a.failed%2?' Retrying...':''));
    if(a.failed%2)
      img.src='http://127.0.0.1:8080/image='+a.href;
    else $img.replaceWith(a);
  };
  img.onclick = function (e) {
    if (e.ctrlKey) window.open(img.src);
     else $img.toggleClass('bigimg');
  };
  $(this).replaceWith(img);
  img.crossorigin='anonymous';
  img.oldSrc = this.href;
  if(//this.href.match(/photo|jpegshare.net.*html/) ||
     this.failed%2)
    img.src = 'http://127.0.0.1:8080/image='+this.href;
  else
    img.src = this.href;
  fic.log('Picture [' + img.src + '] opened');
  $('.img+br+.img').prev().hide();
};
function closeButton(t) {
  $('<button class="iframe-close">×</button>').click(function (e) {
    $(this).prev().remove();
    $(this).prev().show();
    $(this).remove();
  }).insertAfter($(t).hide());
}
$(document).on('click', 'a.ficpic', function (e) {
  e.preventDefault();
  $(this).each(fic.loadpic)
});
$(document).on('click', 'a.ficvid', function (e) {
  e.preventDefault();
  console.log('Opening video:', this.href);
  var v = this.href.match(/([?&]v=|youtu.be\/)([\w-]{4,20})/); //shold be remade
  //     var t = this.href.match(/[?&]t=([\d.]*)/);
  var l = this.href.match(/[?&]list=([\w\d]*)/);
  var ar = [
    'rel=0'
  ];
  //     t && t[1] && ar.push('t='+t[1]);
  l && l[1] && ar.push('list=' + l[1]);
  var h = 'https://www.youtube-nocookie.com/embed/' + v[2] + '?' + ar.join('&');
  //this.href.match(/([^/=?]{6,10}[^/]*)/g).pop().replace(/\?t=(\d+)/, '?start=$1');
  console.log('video link:', h);
  closeButton(this); //width="560" height="315"
  $('<iframe class="ficvid" src="' + h + '" allowfullscreen="" frameborder="0"></iframe>').insertAfter(this);
});
$(document).on('click', 'a.coub', function (e) {
  e.preventDefault();
  console.log('Opening coub:', this.href)
  var h = '//coub.com/embed/' + this.href.match(/coub.com\/.*?\/([^\/=?]{3,10})(?=\W|$)/).pop();
  console.log('coub link:', h);
  closeButton(this);
  $('<iframe class="coub" src="' + h + '?muted=false&autostart=true&originalSize=false&startWithHD=false" allowfullscreen="true" frameborder="0"/>').insertAfter(this);
})
fic.picturize = function (a = !false) {
  //   $('.urlize:not(:has(img,a))').urlize();
  var u = $('.urlize');
  if (a) u = u.not('.urlized');
  u.addClass('urlized');
  var l = u.length;
  if (l == 0) return;
  u /*.not(':has(img,a,iframe)')*/
  .not(':has(img,iframe)').urlize2();
  var l1 = u.find('a:not([contextmenu])').attr('contextmenu', 'picturizeMenu').length;
  var u2 = u.find('a[target]').not('.ficpic').filter('[href*=".jpg"],[href*=".JPG"],[href*=".png"],[href*=".jpeg"],[href*=".gif"],[href*=photo],[href*=imgur],[href*="goo.gl"]').addClass('ficpic');
  if (fic.ops.preloadImages) u2.click();
  var l2 = u2.length;
  //
  var l3 = u.find('a[target]:not(.ficvid)').filter('[href*="youtu.be"],[href*="youtube"]').addClass('ficvid').length;
  //
  var l4 = u.find('a[target]:not(.ficvid)').filter('[href*="coub.com/"]').addClass('coub').length;
  //
  fic.log('fic_pic applied (' + l + ' elems'
  + (l1 ? ', ' + l1 + ' a`s' : '')
  + (l2 ? ', ' + l2 + ' pics' : '')
  + (l3 ? ', ' + l3 + ' vids' : '')
  + (l4 ? ', ' + l4 + ' coubs' : '') + ')');
  fic.writeTime();
}
fic.Load.push(fic.picturize);
fic.show.push(function () {
  $('.part_text').removeClass('urlized')
})
fic.Show.push(fic.picturize); //
fic.success.push('fic:parts:picturize'); // for debugging purposes. If 「fic.success」 does not have this line, the script is not working.
fic.load.castLate(); // 「fic.load」 is casted only from scripts, so this line
//
$(document).scroll(function () {
  if (fic.picturizeHeight != document.documentElement.offsetHeight) {
    fic.picturizeHeight = document.documentElement.offsetHeight;
    fic.picturize();
  }
}) // <iframe src="https://www.youtube.com/embed/bHQqvYy5KYo" allowfullscreen="" frameborder="0"></iframe>
fic.replace = function (r, f) {
  $('.part_text').html($('.part_text').html().replace(r, f))
}



// ==UserScript==
// @name        fic:parts:pager
// @namespace   *
// @include     https://ficbook.net/*
// @version     1
// @grant       none
// ==/UserScript==
//////////////////////////////////////////////////
fic.style.push(function () {
  $('<style/>').html('.btn-next{transition:color 3s;}.btn-next:not(.done){color:transparent;transition:color 0s;}'+
  'body{overflow-x:hidden;}').appendTo('body');
//   $('<style/>').appendTo('bodjy').html('.col-md-3 {width: 25%;}' +
//   '.col-md-9 { width: 75%;}' +
//   '.container-fluid {display: inline-block;width: calc(50% - 3px);vertical-align: top; border-top: 1px solid brown;padding-top: 10px;}' +
//   '.icon-star-full {display: inline-block;width: 0px;}' +
//   '.icon-star-full::before {position: relative;right: 13px;}'
//   )
}) //////////////////////////////////////////////////
fic.prepareNextPage = function () {
  fic.nextPageLoaded = false;
  function replaceData(selector, data, regex, index) {
    var o = $(selector);
    var m = data.match(regex);
    if (o.length > 0)
    if (m != null)
    if (m[index] != null) {
      o.html(m[index]);
      return selector + ' ';
    }
    return '' + '(' + selector + (o.length > 0 && ':' || ':no') + ' elem' + (m != null && ',' || ',no ') + 'match' + (m != null && m[index] != null && ') ' || ',not found) ');
  };
  function replaceDataAfter(selector, prev, data, regex, index) {
    var o = $(selector).remove();
    var p = $(prev);
    var m = data.match(regex);
    if (p.length > 0)
    if (m != null)
    if (m[index] != null) {
      o.remove();
      $('<div/>').html(m[index]).contents().insertAfter(p);
      return selector + ' ';
    }
    return '' + '(' + selector + (p.length > 0 && ':' || ':no') + ' prev' + (m != null && ',' || ',no ') + 'match' + (m != null && m[index] != null && ') ' || ',not found) ');
  };
  //$('.col-md-3').toggleClass('col-md-3 col-md-4');$('.col-md-9').toggleClass('col-md-9 col-md-12').parent().css('width','50%').css('float','left').filter(':even').css('float','right');
  if (fic.type() == 'part') {//return;
    if ($('.btn-next').length == 0) return; // if no (->) then exit
    var h = $('.btn-next').attr('href');
    var h2 = (fic.nextPageMode.part == 'withComments') ? h.split('#').join('?show_comments=1#')  : h;
    $.get(h2, function (data) {
      $('.btn-next').addClass('done');
      fic.nextPageLoaded = true;
      fic.nextPageData = data;
      fic.showNextPage = function () {
        var s = replaceData('.sub-head', data, /<div class="sub-head.*?>([\d\D]*?)<\/div>\s*<article/, 1) +
        replaceData('.sub-footer', data, /<div class="sub-footer.*?>([\d\D]*?)<\/div>\s*<\/div>\s*<footer/, 1) +
        replaceData('.part_text', data, /<div class="part_text.*?>([\d\D]*?)<\/div>\s*<div id="partEnd">/, 1) + //text
        replaceDataAfter('.part-comment-top', 'a[name="part_content"]', data, /<div class="part-comment-top">([\d\D]*?)<\/div>\s*<\/div>/, 0) + // author comment
        replaceDataAfter('.part-comment-bottom', '#partEnd', data, /<div class="part-comment-bottom">([\d\D]*?)<\/div>\s*<\/div>/, 0) + // author comment
        replaceData('.blog', data, /<section class="blog">([\d\D]*?)<\/section>/, 1); // comms
        fic.log('replaced: ' + s);
        $('input[name="part_id"]').each(function () {
          this.value = data.match(/"part_id" value="(\d*)"/) [1]; // beta
        });
        window.history.pushState(null, $('title').text(), h); // history
        // scroll to top
        $('.sub-head') [0].scrollIntoView();
        // remove outdated function
        fic.showNextPage = fic.showNextPageDefault;
        fic.onNextShow.cast();
      };
      fic.onNextLoad.cast();
    });
  }; /////////////////////////////////////////////////////////////////
  if (fic.type() == 'cols_etc') {
    var e = $('.bg-success:not(.done):first');
    if (e.length > 0) {
      var h = e.find('a').attr('href');
      $.get(h, function (data) {
        fic.nextPageLoaded = true;
        fic.nextPageData = data;
        e.addClass('done');
        var r = /<section class="fanfic-thumb-block fanfic-thumb-block-new">(.|\s)*?<\/section>/g;
        data.replace(r, function (s) {
          $(s).css('padding-left', '15%').appendTo(e);
        });
        fic.onNextShow.cast();
      });
    };
  };
  if (fic.type() == 'fallows') {
    var v = $('.row.new-bg:not(.done):first')
    var h = v.find('a').attr('href');
    var n = parseInt(v.find('.new').text())
    var g = $.get(h, function (data) {
      var m = data.match(/<article class="post comment_thumb">[^^]*?<\/article>/g);
      var a = [
      ];
      for (i = 0; i < n; i++) {
        a.push(m.pop());
      }
      $('<br>').insertAfter(v);
      $('<br>').appendTo(v);
      $('<br>').appendTo(v);
      a.reverse().forEach(function (e) {
        $(e).appendTo(v);
      })
      v.addClass('done').addClass('blog-area');
      fic.onNextLoad.cast();
      fic.onNextShow.cast();
    });
  }
}; ////////////////////////////////////////////
fic.Load.push(fic.prepareNextPage); // prepareNextPage afterLoad
fic.Show.push(fic.prepareNextPage); // prepareNextPage afterNextShow
//////////////////////////////////////////////////
fic.Next.push(function () { // allow (->) click afterNextLoad
  // use on (->) click
  $('.btn-next').click(function (e) {
    if (fic.nextPageLoaded) {
      e.preventDefault();
      fic.showNextPage();
    }
  });
})
fic.success.push('fic:parts:pager');
fic.load.castLate();

/*
$('<style>').html('.table td:nth-last-child(1), .table td:nth-last-child(2) {padding: 5px;}').appendTo('head');
tr1 = $$('.table tr:first-child') [0];
tr1.children[0].innerText='Заявка / Фанфик'
tr1.children[1].innerText='Глава'
tr1.children[2].width=250
trs = $$('.table tr:not(:first-child)');
$('.table-responsive').removeClass('table-responsive'); // it has overflowX which disables sticky by some reason
tr_to_href = tr => tr.children[1].children[0].href.match(/\d+/) [0];
hrefs = trs.map(tr_to_href).filter((e, i, a) => a.indexOf(e) == i);
trs_sorted = trs.map(e => ({
  e,
  h: tr_to_href(e)
})).sort((a, b) => hrefs.indexOf(a.h) > hrefs.indexOf(b.h))
trs_sorted.reduceRight((v, e) => tr1.after(e.e));
// debugger
trs_sorted.reduce((v, e, i, a) => {
  if (v.h == e.h) {
    v.n++;
    v.e.children[0].rowSpan = v.n;
    e.e.children[0].remove();
    //...
  } else {
    v = {
      e: e.e,
      h: e.h,
      n: 1
    }
    let a = $('a[href*=readfic]',e.e).clone()[0];
    let td = e.e.children[0];
    a.innerText = a.innerText.replace(/\s+—[^]*$/,'');
    a.href = a.href.replace(/\d+$/,'');
    $('<div>').css({position:'sticky',top:'-1px'}).append($(td.children).css('text-decoration-style','double')).append('<br>').append(a).appendTo(td);
  }
  let a2 = $('a[href*=readfic]:last',e.e)[0];
  a2.innerText = a2.innerText.match(/\s+—\s+([^]*)$/)[1];
  return v;
}, {
})

*/


// ==UserScript==
// @name        fic:parts:notice
// @namespace   *
// @include     https://ficbook.net*
// @version     1
// @grant       none
// ==/UserScript==
fic.load.push(function () {
  if ($('#notifications').length) {
    if(performance.navigation.type!=2)
      localStorage.notifications_contents = $('#notifications').html();
    else
      $('#notifications').html(localStorage.notifications_contents);
  }
  document.addEventListener('visibilitychange', function () {
    console.log(document.visibilityState);
    if (document.visibilityState == 'visible') {
      $('#notifications').html(localStorage.notifications_contents);
    }
  });
});
fic.afterNextLoad.push(function () {
  if(fic.preloaded)return;
  $('.notifications').html(fic.nextPageData.match(/<div id="notifications">([\d\D]*?)<\/div>/) [1]);
  localStorage.notifications_contents = $('#notifications').html();
});
fic.success.push('fic:parts:notice');




// ==UserScript==
// @name        fic:newr
// @namespace   *
// @include     https://ficbook.net/*
// @version     1
// @grant       none
// ==/UserScript==
(() => {
  var mns = [
    0,
    'янв',
    'фев',
    'мар',
    'апр',
    'мая',
    'июн',
    'июл',
    'авг',
    'сен',
    'окт',
    'ноя',
    'дек'
  ];
  var f = x => x > 9 ? '' + x : '0' + x;
  window.fic.date = t => t.replace(/(\d+) (...)\D* (\d+)/, (s, a, b, c) => c + '/' + f(mns.indexOf(b)) + '/' + f(a));
  if ($('.read-notification,.table-of-contents').length == 0) return;
  var readen = JSON.parse(localStorage.readen || '{}');
  $('.read-notification span>span[title]').each((i, e) => {
    var h = $(e).closest('.description').find('a').attr('href').match(/\d+/) [0];
    var d = e.title.replace(/(\d+) (...)\D* (\d+)/, (s, a, b, c) => c + '/' + f(mns.indexOf(b)) + '/' + f(a));
    readen[h] = d;
  });
  $('.table-of-contents li').each((i, e) => {
    var h = $(e).find('a').attr('href').match(/\d+/) [0];
    var d = $(e).find('span[title]').attr('title').replace(/(\d+) (...)\D* (\d+)/, (s, a, b, c) => c + '/' + f(mns.indexOf(b)) + '/' + f(a));
    if (readen[h] > d) $(e).addClass('fanfic-block-read');
  })
  localStorage.readen = JSON.stringify(readen);
}) ();
setTimeout(() => {
  try {
    var tw = $('.table-of-contents').width();
    if (!tw) return; // получаем ширины ссылок и сортируем их по возрастанию:
    var linkWidths = $('.table-of-contents a,.table-of-contents span').map((i, e) => $(e).width()).sort((a, b) => a > b);
    // выбираем ширину, в которую помещается 90% (число выбрано случайно) из них
    var optimalWidth = linkWidths.get(Math.floor(linkWidths.length * 0.9));
    // ограничиваем ширину снизу 140px (максимальная возможная ширина даты - 138px);
    optimalWidth = Math.max(optimalWidth, 140);
    // ограничиваем ширину сверху 500px (максимальная возможная ширина для двух колонок на 1024px-экране - 563px)
    optimalWidth = Math.min(optimalWidth, 500);
    // получившееся число - константа, которая обновляется только при изменении количества и названий глав.
    // используем получившееся число:
    $('.table-of-contents').css('columns', optimalWidth + 'px');
    // или
    $('.table-of-contents').get(0).style.columns = optimalWidth + 'px';
    // или
    $('.table-of-contents').get(0).style.cssText = 'columns: ' + optimalWidth + 'px;';
    // или
    $('<style>.table-of-contents{columns: ' + optimalWidth + 'px;}</style>').appendTo('head');
    // или '<ul class="list-unstyled table-of-contents" style="columns:" + optimalWidth + "px;">' на сервере
    // - эти "или" делают одно и тоже
    $('<style>').html('.table-of-contents > li{width:100%;}' + //'min-width:'+ mw +'px;}'+
    '.table-of-contents > li{display: inline-block;}' +
    '.table-of-contents > li.fanfic-block-read + li:not(.fanfic-block-read),' +
    '.table-of-contents > li:nth-child(1):not(.fanfic-block-read)' +
    '{background-color: wheat;border-radius: 0 0 15px 5px;}'
    ).appendTo('head');
    $('body').keypress(e => {
      if (e.keyCode == 39)
      location.href = $('.table-of-contents>li.fanfic-block-read + li:not(.fanfic-block-read) a,.table-of-contents>li:nth-child(1):not(.fanfic-block-read) a').eq(0).attr('href')
    });
    $('<style>').html(
                      '.table-of-contents li {border: 1px dashed transparent;}'+
                      '.table-of-contents li:hover {border-color: brown;}'+
                      '.table-of-contents li > a {display: block;text-decoration: none;}'+
                      //'.table-of-contents li > a:hover {outline: 1px dashed brown;transition: outline 0s;}'+
                      '.table-of-contents li a {transition: color 0s;}'
    ).appendTo('head');
    $('.table-of-contents li').each((i, e) => {
      $('<a>').attr('href', $(e).find('a').attr('href')).append($(e).contents()).appendTo(e);
    })
  } catch (e) {
    console.error(e);
  }
}, 100);
// function showExtraPics() {
//  if(!window.GMget) return;
//   var u = $('.urlize');
//   var u2 = u.find('a[target]')
//  .not('.bouncepic')
//  .filter('[href*="goo.gl/photos"]')
//  .addClass('bouncepic');
//  u2.each(function(i,e){
//  })
// //   if (fic.ops.preloadImages) u2.click();
// }
// fic.Load.push(fic.picturize);
// fic.show.push(function () {
//   $('.part_text').removeClass('urlized')
// })
// fic.Show.push(fic.picturize); //
