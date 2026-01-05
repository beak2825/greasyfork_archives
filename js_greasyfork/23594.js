// ==UserScript==
// @name        Ficbook 2.x
// @namespace   *
// @description Улучшатель фикбука, версия вторая
// @include     https://ficbook.net/*
// @version     2.4
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/23594/Ficbook%202x.user.js
// @updateURL https://update.greasyfork.org/scripts/23594/Ficbook%202x.meta.js
// ==/UserScript==


//////////////////////////////////////////////////
//////////////////////////////////////////////////
// INITIALIZATION
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

document.addEventListener("DOMContentLoaded",function(){
	setTimeout(function(){
		FicPagerInit();
		FicActionsInit();
		FicPicturizeInit();
		fic.load.cast();
		fic.Load.wait();
	},4)
})

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
	fic.Style.cast();
  $(document).on('contextmenu', 'a,img', function (e) {
    fic.contextMenuCaller = this;
  });
});
fic.Load.push(function () {
//   fic.load.cast();
  log(fic.success);
});

////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////    PAGER      //////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function FicPagerInit(){
fic.style.push(function () {
  $('<style/>').html('.btn-next{transition:color 3s;}.btn-next:not(.done){color:transparent;transition:color 0s;}'+
  'body{overflow-x:hidden;}').appendTo('body');

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
  if (fic.type() == 'part') {
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
}

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////     ACTIONS     /////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function FicActionsInit(){
fic.Style.push(function () {
  $('.part_text').css({
    'max-width': '600px',
    width: '100%',//50%',
    margin: 'auto',
    padding: 0
  });
});
$(document).keypress(function (e) {
  if (e.keyCode == 39) // if [->] key pressed
  // with [shift] pressed or under chapter end
  if (e.shiftKey || $('.sub-footer') [0].getBoundingClientRect().y < window.innerHeight) {
    fic.showNextPage(); // show next page
  }
});
fic.tabber = function tabber() {
  $('.part_text').each(function () {
    this.innerHTML = this.innerHTML //
    .replace(/(\s*<br>){4,}/g, '<br><br><br>') //long line break
    .replace(/(…|\.\s?\.\.?)(\s|&nbsp;)?(?=[\wа-яА-Я])/g, '… ') //
    .replace(/\.?(\s|&nbsp;)*\.?(\u2013|\u2014|&#821[1];)(\s|&nbsp;)*/g, ' - ') //same -'s
    .replace(/-(?![\wа-яА-Я])|([^\wа-яА-Я])-(?![\w])/g, '$1 - ') // 
    .replace(/([а-яА-Я,-])\s*(<br>\s*)+(?=[а-я])/g, '$1 ') //wrong line break
    .replace(/(<br>|<p [^>]*>|<div [^>]*>|^)(\s|&nbsp;)*(?!<br>|<p |<div |\s|&nbsp;)/g, '$1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') //
    .replace(/(\s|&nbsp;)+-(\s|&nbsp;)+/g, ' &#8211;&nbsp;') //
    .replace(/(<br>|<p [^>]*>|<div [^>]*>|^)(\s|&nbsp;)*(-|&#8211;)(\s|&nbsp;)*/g, '$1&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;') //
    .replace(/((<br>|<p [^>]*>|<div [^>]*>|^)(\s|&nbsp;|<\/?.>|&[\w#\d]*;|[^\wа-яА-Я])*)([а-я]?)/g, function(s,a,b,c,d){
			return a + d.toUpperCase();
		}) //
    .replace(/([а-я]) ?\. ?(?=[А-Я](?!\.))/g, '$1. ') //
    .replace(/ ?, ?(?=[а-яА-Я])/g, ', ') //
    .replace(/<p[^>]*(center|right)[^>]*>[\d\D]*?<\/p>/g, function (s) {
      return s.replace(/(<p[^>]*>|<br>|<div [^>]*>)(\s|&nbsp;)*/g, '$1');
    }) //
    .replace(/([^<>&]|&\w{1,9};|<(?!br)[^>]*>){600,}/g, function (s) {
// 			toastr.info(s.match(/[^<>&]|&\w{1,9};|<(?!br)[^>]*>/g).length,len(s))
      function len(s) {
        return s.match(/&\w{1,9};|<.*?>|.|^$/g).length;
      }
      var a = s.split('.'),
      n = Math.ceil(len(s) / 600),
      l = s.length / n + 4,
      c = '';
      for (i = 0; i < a.length-1; i++) {
				var cl = len(c) / l;
        var al = cl + len(a[i]) / l;
				if (Math.ceil(cl) < Math.ceil(al)) {
					if ((1-cl%1) < al%1) 
						c += '<br>&nbsp;&nbsp;&nbsp;' + a[i] + '.';
					else
						c += a[i] + '.<br>&nbsp;&nbsp;&nbsp;';
				} else
      	  c += a[i] + '.';
      };
			c += a.pop();
      return c;
    }) //
  })
};
fic.text = function (s) {
  return s ? $('.part_text').html(s)  : $('.part_text').html();
};
fic.Load.push(fic.tabber);
fic.show.push(fic.tabber);
function titleLink() {
  if (fic.type() == 'part')
  $('.title-area h2').click(function () {
    location.href = location.href.replace(/\/[^\/]+$/, '#part_content')
  })
}
fic.Load.push(titleLink);
fic.show.push(titleLink);
$(document).on('contextmenu', 'a,img', function (e) {
  fic.contextMenuCaller = this;
})
if (fic.type() == 'part')
fic.Load.push(function () {
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
    //         var y = $('.info-links') [0].getBoundingClientRect().y;
    if ($('.btn-next .btn-next').length == 0)
    $('.btn-next:last').append($('.btn-next:last').clone());
    var y = $('.btn-next:has(.btn-next)') [0].getBoundingClientRect().y - window.innerHeight;
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
fic.preload = function () {
  var l = 0;
  setTimeout(function () {
    toastr.success('Все части загружаются!');
  }, 400);
  $._get = $._get || $.get;
  $.got = $.got || {
  };
  $.get = function (h, f = $.noop) {
    if ($.got[h])
    return f.apply(this, $.got[h]);
     else
    return $._get.apply(this, arguments);
  };
  $.preload = function (h, f = $.noop) {
    return $._get(h, function (data) {
      $.got[h] = arguments;
      f(data);
      //toastr.info(data.match(/<div[^>]*class="[^"]*title-area[^"]*"[^>]*>\s*<h2>([^<>]*)<.h2>/)[1]);
    });
  };
  var s = $('.btn-next').attr('href');
  f(s);
  function f(s) {
    l++;
    $.preload(s, function (d) {
      console.log(s, 'loaded');
      var h = d.match(/[^"]*(?=" class="pull-right btn-next")/);
      if (h && h[0])
      f(h[0]);
       else {
        console.log('all chaps done!');
        setTimeout(function () {
          toastr.success('Все ' + l + ' части загружены!');
        }, 400);
      }
    });
  };
};
$(document).on('click', 'h1', function (e) {
  fic.preload();
});
fic.success.push('fic:parts:actions');
}

/////gbcbc/b/cggfb/g/b/cbg

////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////     PICTURIZE     ////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function FicPicturizeInit(){
fic.style.push(function () {
  $('<style/>').appendTo('head').html('a.ficpic{color:green;}' +
  'a.ficvid{color:blue;}' +
  'a.coub{color:purple;}' +
  '.img-holder-universal.margin-auto {display: table;height: initial;}' +
  '.img-holder-universal.avatar-100.margin-auto {max-height:100px;}' +
  '.img-holder-universal.avatar-40.margin-auto {max-height:40px;}' +
  '.img-holder-universal.margin-auto a {display: table-cell;vertical-align: middle;}' +
  '.img-holder-universal.avatar-100 img{max-height:96px;}' +
  '.img-holder-universal.avatar-40 img{max-height:36px;}' +
  '#toTop{z-index:9;}'
  );
});
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
        //  if(!$(t).is('urlized'))
        window.n = window.n + n;
        if (fic.ops.urlizePartText || !$(t).hasClass('part_text')) {
          var o = n.match(/\b(https?:\/\/|www\.|https?:\/\/www\.)[^ <]{1,400}[\wа-яА-Я]((?=$)|(?![\wа-яА-Я]))/g);
          if (o) {
            n = n.replace(/\b(https?:\/\/|www\.|https?:\/\/www\.)[^ <]{1,400}[\wа-яА-Я]((?=$|\s|\xa0)|(?![\wа-яА-Я]))(?!"?\s*>|<\/a>)/g, function (s) {
              var ut = $('<a>').html(s).text();
              var r = 0 === ut.indexOf('http://') || 0 === ut.indexOf('https://') ? '' : 'http://';
              var et = encodeURI(r + ut);
              try {
                ut = decodeURI(ut);
                et = encodeURI(r + ut);
              } catch (e) {
              }
              return ' <a target="_blank" href="' + et + '">' + $('<a>').text(ut).html().replace(/^(https?:\/\/)?(www\.)?/, '') + '</a>';
            });
          }    
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
  $(fic.contextMenuCaller).replaceWith($('<span class="urlize"/>').text(fic.contextMenuCaller.src));
  var a = fic.ops.preloadImages;
  fic.ops.preloadImages = false;
  fic.picturize();
  fic.ops.preloadImages = a;
})).appendTo($('body')).hide();
fic.loadpic = function () {
  var inDesc = $(this).closest('.description').length;
  var img = new Image();
  img.className = 'fimg';
  img.src = this.href;
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
    $img.replaceWith(a)
  };
  img.onclick = function (e) {
    if (e.ctrlKey) window.open(img.src);
     else $img.toggleClass('bigimg');
  };
  $(this).replaceWith(img);
  fic.log('Picture [' + this.href + '] opened');
  $('.img+br+.img').prev().hide();
};
$('<style/>').html('' +
'.fimg {transition: max-width 0.4s, max-height 0.4s, outline-color 0.4s, outline-width 0.4s; max-height: 50px; max-width: 100px; outline: 5px solid green}' +
'.fimg.done{outline-color:rgba(0,128,0,0.25);outline-width:3px;}' +
'.bigimg { max-height: 100vh; max-width: 100%;outline-width:3px !important;}' +
'iframe{width:720px;height:405px;margin:auto;display:block;}').appendTo($('head'));
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
  var u2 = u.find('a[target]').not('.ficpic').filter('[href*=".jpg"],[href*=".png"],[href*=".jpeg"],[href*=".gif"]').addClass('ficpic').click(function (e) {
    e.preventDefault();
    $(this).each(fic.loadpic)
  });
  if (fic.ops.preloadImages) u2.click();
  var l2 = u2.length;
  //
  var l3 = u.find('a[target]:not(.ficvid)').filter('[href*="youtu.be"],[href*="youtube"]').addClass('ficvid').click(function (e) {
    e.preventDefault();
    console.log('Opening video:', this.href);
    var v = this.href.match(/[?&]v=([\w\d]*)|\/(\w*)(?=[?#]|$)/);
    //     var t = this.href.match(/[?&]t=([\d.]*)/);
    var l = this.href.match(/[?&]list=([\w\d]*)/);
    var ar = [
      'rel=0'
    ];
    //     t && t[1] && ar.push('t='+t[1]);
    l && l[1] && ar.push('list=' + l[1]);
    var h = 'https://www.youtube-nocookie.com/embed/' + v[1]+ v[2] + '?' + ar.join('&');
    //this.href.match(/([^/=?]{6,10}[^/]*)/g).pop().replace(/\?t=(\d+)/, '?start=$1');
    console.log('video link:', h);
    this.outerHTML = '<iframe class="youtube" width="560" height="315" src="' + h + '" allowfullscreen="" frameborder="0"></iframe>';
  }).length;
  //
  var l4 = u.find('a[target]:not(.ficvid)').filter('[href*="coub.com/"]').addClass('coub').click(function (e) {
    e.preventDefault();
    console.log('Opening coub:', this.href)
    var h = '//coub.com/embed/' + this.href.match(/coub.com\/.*?\/([^\/=?]{3,10})(?=\W|$)/).pop();
    console.log('coub link:', h);
    this.outerHTML = '<iframe class="coub" src="' + h + '?muted=false&autostart=false&originalSize=false&startWithHD=false" allowfullscreen="true" frameborder="0" width="640" height="360"></iframe>';
  }).length;
  //
  fic.log('fic_pic applied (' + l + ' elems'
  + (l1 ? ', ' + l1 + ' a`s' : '')
  + (l2 ? ', ' + l2 + ' pics' : '')
  + (l3 ? ', ' + l3 + ' vids' : '')
  + (l4 ? ', ' + l4 + ' coubs' : '') + ')');
}
fic.Load.push(fic.picturize);
fic.show.push(function () {
  $('.part_text').removeClass('urlized')
})
fic.Show.push(fic.picturize); //
$(document).scroll(function () {
  if (fic.picturizeHeight != document.documentElement.offsetHeight) {
    fic.picturizeHeight = document.documentElement.offsetHeight;
    fic.picturize();
  }
}) // <iframe src="https://www.youtube.com/embed/bHQqvYy5KYo" allowfullscreen="" frameborder="0"></iframe>
fic.replace = function (r, f) {
  $('.part_text').html($('.part_text').html().replace(r, f))
}
fic.success.push('fic:parts:picturize'); // for debugging purposes. If 「fic.success」 does not have this line, the script is not working.
}