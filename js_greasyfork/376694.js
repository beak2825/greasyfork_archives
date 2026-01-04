// ==UserScript==
// @version         19.11.11
// @name            Smart Scroll
// @description     Provides buttons to scroll web pages up and down
// @license         MIT
// @author          S-Marty
// @compatible      firefox
// @compatible      chrome
// @namespace       https://github.com/s-marty/SmartScroll
// @homepageURL     https://github.com/s-marty/SmartScroll
// @supportURL      https://github.com/s-marty/SmartScroll/wiki
// @icon            https://raw.githubusercontent.com/s-marty/SmartScroll/master/images/smartScroll.png
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QHFFSLZ7ENUQN&source=url
// @include         /^https?://.*$/
// @exclude         /[^\s]+\.(jpe?g|png|gif|bmp|svg)(\?[^\s]+)?$/
// @run-at          document-end
// @grant           GM.getValue
// @grant           GM.setValue
// @grant           GM_getValue
// @grant           GM_setValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/376694/Smart%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/376694/Smart%20Scroll.meta.js
// ==/UserScript==

/* greasyfork.org jshint syntax checking hacks */
/* jshint asi: true */
/* jshint boss: true */
/* jshint esversion: 6 */
/* jshint loopfunc: true */

/** ****************** Features ******************
*** Able to leap tall pages in a single click
*** Up and down, slow or faster than a speeding bullet
*** More robust than a locomotive
*** Slow scroll by middle mouse button or mouse hover
*** 26 Slow scrolling speeds
*** Doesn't interfere with the page's native onScroll event
*** Conquers bottomless or never-ending pages in most cases
*** Disableable per site
*** No extra @require files (jquery et.al.)
*** Double-click on either button for settings ***
*** Compatable with Firefox 43 to 63+          ***
*** Compatable with Chrome 62 to 71            ***
*** Compatable with Violentmonkey ? to 2.10    ***
*** Compatable with Greasemonkey 3.9 to 4.7    ***
*** Compatable with Tampermonkey 4.7 to 4.8    ***/

(function () {
"use strict";

var buttons = {

  monkey: function () {
    let style;

    if (this.user.settings.ignore.indexOf(host) !=-1) return;

    if (this.body && this.is_userscript) {
      style = document.createElement("style");
      style.setAttribute('id', 'smartscrollstyle');
      style.type = "text/css";
      style.innerHTML = this.buttonCss();
      this.head.appendChild(style);

      this.up_ctn = document.createElement("span");
      this.dn_ctn = document.createElement("span");
      this.up_ctn.setAttribute("id","up_btn");
      this.dn_ctn.setAttribute("id","dn_btn");
      this.up_ctn.className = "updn_btn";
      this.dn_ctn.className = "updn_btn";
      this.body.appendChild(this.up_ctn);
      this.body.appendChild(this.dn_ctn);

      if (this.user.settings.crawl_trigger == 'middleclick') {
        this.up_ctn.addEventListener('mousedown', function(e) { if(e.which==2) {buttons.creepUp(1)} }, false);
        this.up_ctn.addEventListener('mouseup', function(e) { if(e.which==2) {buttons.creep = !1} }, false);
        this.dn_ctn.addEventListener('mousedown', function(e) { if(e.which==2) {buttons.creepDn(1)} }, false);
        this.dn_ctn.addEventListener('mouseup', function(e) { if(e.which==2) {buttons.creep = !1} }, false);
      }
      else {
        this.up_ctn.addEventListener('mouseover', function(e) { buttons.creepUp(1) }, false);
        this.up_ctn.addEventListener('mouseout', function(e) { buttons.creep = !1 }, false);
        this.dn_ctn.addEventListener('mouseover', function(e) { buttons.creepDn(1) }, false);
        this.dn_ctn.addEventListener('mouseout', function(e) { buttons.creep = !1 }, false);
      }

      this.up_ctn.addEventListener('dblclick', function(e) { if(e.which===1) {buttons.smartScroll_Settings(e)} }, false);
      this.dn_ctn.addEventListener('dblclick', function(e) { if(e.which===1) {buttons.smartScroll_Settings(e)} }, false);
      this.up_ctn.addEventListener('click', function(e) { if(e.which===1) {buttons.scrollToTop()} }, false);
      this.dn_ctn.addEventListener('click', function(e) { if(e.which===1) {buttons.scrollToBottom()} }, false);

      if (root !== null && this.user.settings.bottomless_pages) {
        this.resize = document.createElement("iframe");
        this.resize.setAttribute("name","resize_frame");
        this.resize.setAttribute("tabindex","-1");
        this.resize.className = "resize_frame";
        root.appendChild(this.resize);
        this.resize.contentWindow.addEventListener('resize', function(e) { buttons.getDocumentHeight(e) }, false);
      }

      window.addEventListener('scroll', buttons.onScroll, {passive : true});
      window.addEventListener('resize', buttons.onResize, false);
      this.body.addEventListener('mouseleave', buttons.saveAccrued, false);
      window.addEventListener('beforeunload', function(e) { buttons.settings_close('unload')}, false);
      document.addEventListener('readystatechange', function(e) { if(document.readyState === "complete") { buttons.getDocumentHeight(e)} }, false);

      if (this.user.settings.dimButtons) {
        setTimeout(buttons.fadeOut, 3000);
      }
    }
    else return

  },
  areOverVid: function(e) {

    var vid = (typeof e === 'object' && e.target.tagName == 'VIDEO') ? e.target : false;
    if (! vid) return false;
    else {
      var isOverV = false;
      var isOverH = false;
      var vidRect = vid.getBoundingClientRect();
      var butRect = buttons.up_ctn.getBoundingClientRect();

      if (vidRect.right - vidRect.left > window.innerWidth / 2) {
        isOverH = true;
      }
      else {
        isOverH = vidRect.left < window.innerWidth - 33 && vidRect.right > window.innerWidth - 33;
      }
      isOverV = vidRect.top < butRect.top && vidRect.bottom > butRect.top;

      return isOverH && isOverV;
    }

  },
  fadeOut: function(e) {

    var up_btn = buttons.up_ctn;
    var dn_btn = buttons.dn_ctn;

    if (buttons.fading) return;
    else if (buttons.areOverVid(e)) {
      if (buttons.opacity_timer) clearInterval(buttons.opacity_timer);
      up_btn.style.visibility = 'visible';
      dn_btn.style.visibility = 'visible';
      up_btn.style.opacity = 0.65;
      dn_btn.style.opacity = 0.65;
      buttons.fading = setTimeout( function(e) {buttons.fading = null}, 3000);
      setTimeout( function(e) {
        buttons.opacity_timer = setInterval(function() {
          if (up_btn.style.opacity <= 0) {
            clearInterval(buttons.opacity_timer);
            buttons.opacity_timer = null;
            up_btn.style.visibility = 'hidden';
            dn_btn.style.visibility = 'hidden';
          }
          else {
            up_btn.style.opacity -= 0.025;
            dn_btn.style.opacity -= 0.025;
          }
        }, 100);
      }, 3000);
    }
    else {
      if (buttons.opacity_timer) {
        clearInterval(buttons.opacity_timer);
        buttons.opacity_timer = null;
      }
      up_btn.style.visibility = 'visible';
      dn_btn.style.visibility = 'visible';
      up_btn.style.opacity = 0.65;
      dn_btn.style.opacity = 0.65;
    }

  },
  reLoadStart: function(e) {

    setTimeout(function() {
      buttons.getDocumentHeight();
      buttons.getVideo();
      setTimeout(buttons.fadeOut, 3000);
    }, 500);

  },
  hideOnFullScreen: function() {

    document.addEventListener("fullscreenchange", () => { buttons.onFullScreen()});
    document.addEventListener("mozfullscreenchange", () => { buttons.onFullScreen()});
    document.addEventListener("webkitfullscreenchange", () => { buttons.onFullScreen()});

  },
  onFullScreen: function(e) {

    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) {
      buttons.body.className = buttons.body.className + " isfullscreen";
    }
    else {
      buttons.body.className = buttons.body.className.replace(/\sisfullscreen/g, "");
      window.setTimeout(buttons.resetButtons,100);
    }

  },
  hasScrollbar: function() {

    let x,
        rootElem,
        overflowShown,
        overflowStyle,
        overflowYStyle,
        contentOverflows,
        alwaysShowScroll;

    if (typeof window.innerHeight === 'number') {
      x = window.innerHeight - document.documentElement.clientHeight;
      return [window.innerHeight > document.documentElement.clientHeight, x+1];
    }

    rootElem = document.documentElement || document.body;

    if (typeof rootElem.currentStyle !== 'undefined') {
      overflowStyle = rootElem.currentStyle.overflow;
    }

    overflowStyle = overflowStyle || window.getComputedStyle(rootElem, '').overflow

    if (typeof rootElem.currentStyle !== 'undefined') {
      overflowYStyle = rootElem.currentStyle.overflowY;
    }
    overflowYStyle = overflowYStyle || window.getComputedStyle(rootElem, '').overflowY;
    contentOverflows = rootElem.scrollHeight > rootElem.clientHeight;
    overflowShown = /^(visible|auto)$/.test(overflowStyle) || /^(visible|auto)$/.test(overflowYStyle);
    alwaysShowScroll = overflowStyle === 'scroll' || overflowYStyle === 'scroll';

    if ((contentOverflows && overflowShown) || (alwaysShowScroll)) {
      return true}
    else {
      return false}

  },
  getScrollTop: function() {

    if (typeof pageYOffset != 'undefined') {
      buttons._x = pageXOffset;
      return pageYOffset;
    }

  },
  getDocumentHeight: function(e) {

    let docHeight = Math.max(
      document.documentElement.clientHeight,
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight
    ) - ( buttons.hasScrollbar() ? buttons.scrollbar : 0 );

    if (docHeight > window.innerHeight) {
      if(docHeight - window.innerHeight - buttons.scrollable < 6) return;
      buttons.getVideo();
      buttons.scrollable = docHeight - window.innerHeight;
      buttons.onScroll();
    }

  },
  scrollToTop: function(e) {

    var y, start = buttons.scrolled;

    if (start > 0) {
      buttons.animate({
        duration: 1000,
        timing: function(timeFraction) {
          return Math.pow(timeFraction, 5);
        },
        draw: function(progress) {
          y = start - (progress * start);
          if (y < 0) y = 0;
          if (progress < 1) {
            window.scrollTo(buttons._x, y);
          }
          else {
            window.scrollTo(buttons._x, 0);
            buttons.count_accru += start;
            buttons.getVideo();
          }
        }
      });
    }

  },
  scrollToBottom: function(e) {

    var y, start = buttons.scrolled;
    var maxscroll = buttons.scrollable;

    if (maxscroll > start) {
      buttons.animate({
        duration: 1000,
        timing: function(timeFraction) {
          return Math.pow(timeFraction, 5);
        },
        draw: function(progress) {
          y = (progress * maxscroll) + ((1 - progress) * start);
          if (y > maxscroll) y = maxscroll;
          if (progress < 1) {
            window.scrollTo(buttons._x, y);
          }
          else {
            window.scrollTo(buttons._x, maxscroll + 2);
            buttons.count_accru += maxscroll - start;
            buttons.getVideo();
          }
        }
      });
    }

  },
  creepUp: function(e) {

    if (e === 1) {
      buttons.creep = 1;
      buttons.killCreeper();
      buttons.creeper = setInterval(buttons.creepUp, buttons.crawl_speed_ms);
    }
    buttons.scrolled = buttons.getScrollTop();
    if (buttons.creep && buttons.scrolled > 0) {
      window.scrollTo(buttons._x, buttons.scrolled - buttons.step);
      buttons.count_accru += buttons.step;
    }
    else buttons.killCreeper()

  },
  creepDn: function(e) {

    if (e === 1) {
      buttons.creep = 1;
      buttons.killCreeper();
      buttons.creeper = setInterval(buttons.creepDn, buttons.crawl_speed_ms);
    }
    buttons.scrolled = buttons.getScrollTop();
    if (buttons.creep && buttons.scrollable > buttons.scrolled) {
      window.scrollTo(buttons._x, buttons.scrolled + buttons.step);
      buttons.count_accru += buttons.step;
    }
    else buttons.killCreeper()

  },
  onResize: function(e) {

    buttons.getDocumentHeight(e);
    window.setTimeout(buttons.resetButtons,500);

  },
  onScroll: function(e) {

    buttons.scrolled = buttons.getScrollTop();
    if (! buttons.scrollable) { buttons.getDocumentHeight(e) }
    if (buttons.scrolled > 0) {
      buttons.toggle_up_btn("show");
    }
    else {
      buttons.toggle_up_btn("hide");
    }
    if (buttons.scrollable > buttons.scrolled) {
      buttons.toggle_dn_btn("show");
    }
    else {
      buttons.toggle_dn_btn("hide");
    }
  },
  toggle_up_btn: function(action) {

    if (action == "show" && buttons.up_btn_show != "show") {
      buttons.up_btn_show = "show";
      buttons.animate({
        duration: 400,
        timing: function(timeFraction) {
          return Math.pow(timeFraction, 2);
        },
        draw: function(progress) {
          buttons.up_ctn.style.right = -33 + (progress * 33) + 'px';
        }
      });
    }
    else if (action == "hide" && buttons.up_btn_show != "hide") {
      buttons.up_btn_show = "hide";
      buttons.animate({
        duration: 500,
        timing: function back(x, timeFraction) {
          return Math.pow(timeFraction, 2) * ((x + 1) * timeFraction - x)
        }.bind(null, 2.8),
        draw: function(progress) {
          buttons.up_ctn.style.right = 0 - (progress * 33) + 'px';
        }
      });
    }

  },
  toggle_dn_btn: function(action) {

    if (action == "show" && buttons.dn_btn_show != "show") {
      buttons.dn_btn_show = "show";
      buttons.animate({
        duration: 400,
        timing: function(timeFraction) {
          return Math.pow(timeFraction, 2);
        },
        draw: function(progress) {
          buttons.dn_ctn.style.right = -33 + (progress * 33) + 'px';
        }
      });
    }
    else if (action == "hide" && buttons.dn_btn_show != "hide") {
      buttons.dn_btn_show = "hide";
      buttons.animate({
        duration: 500,
        timing: function back(x, timeFraction) {
          return Math.pow(timeFraction, 2) * ((x + 1) * timeFraction - x)
        }.bind(null, 2.8),
        draw: function(progress) {
          buttons.dn_ctn.style.right = 0 - (progress * 33) + 'px';
        }
      });
    }

  },
  killCreeper: function() {

    if (this.creeper !== null) {
      clearInterval(this.creeper);
      this.creeper = null;
    }

  },
  getVideo: function() {

    if (buttons.user.settings.dimButtons) {
      var vid = document.querySelectorAll('video');

      if (vid.length) {
        for (let i = 0; i < vid.length; i++) {
          if (vid[i].scrollWidth > 100 && vid[i].scrollHeight > 50) {
            vid[i].addEventListener('mousemove', buttons.fadeOut, false);
          }
        }
        document.addEventListener("keydown", function(e) {
          if ((e.which == 38 || e.which == 40) && ["INPUT", "TEXTAREA"].indexOf(document.activeElement.tagName) < 0) {
            buttons.fadeOut()
          }
        }, false);
      }
    }

  },
  animate: function ({timing, draw, duration}) {

    let start = performance.now();

    requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;
      let progress = timing(timeFraction);
      draw(progress);
      if (timeFraction < 1 && buttons.allowScroll) {
        requestAnimationFrame(animate);
      }
    });

  },
  smartScroll_Settings: function(e) {

    let modal = document.querySelector(".smartScroll_Settings"), form;

    if (! buttons.settings_id && modal === null) {
      buttons.allowScroll = false;
      buttons.killCreeper();

      var s, i, n;
      var sel = '';
      var plus_sel = '';
      var minus_sel = '';
      var crawl_sel = '';
      let hostname = window.location.hostname;
      let m = hostname.match(/^([\w\-]*\.)?([\w\-]+\.((\w{3,4}$)|(\w{2}\.\w{2}$)))/i);

      if (m !== null && m.length > 2) {
        if (typeof m[1] == 'undefined') {m[1] = '';}
        hostname = m[1] + m[2];
      }

      let hex = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'],
          div = document.createElement("div"),
          div2 = div,
          html = '',
          id = 'a',
          doctype = document.createElement("br").outerHTML.indexOf('/') > 0 ? 'XHTML' : 'HTML';

      for (n = 0; n < 16; n++) {
        id += hex[Math.floor(Math.random()*16)];
      }

      var selected = doctype == 'HTML' ? 'selected' : 'selected="selected"';
      let rangetype = document.createElement("input");

      rangetype.setAttribute("type", "range");
      rangetype = rangetype.type != "text";
      if (! rangetype) {
        let opts = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,16,17,19,21,23,26,30,36,44,57,80,100];

        crawl_sel = '<select name="crawl_speed">';
        opts.forEach( function(opt) {
          sel = opt == buttons.user.settings.crawl_speed ? selected : '';
          crawl_sel += '<option value="'+opt+'" '+sel+'>'+opt+'</option>';
        });
        crawl_sel += '</select>';
      }

      plus_sel = '<select name="top_plus" style="width: 52px;height: 20px;font-size: 12px;">';
      minus_sel = '<select name="bot_minus" style="width: 52px;height: 20px;font-size: 12px;margin-left:36px;">';

      [0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,99].forEach( function(opt) {
        sel = opt == buttons.user.settings.top_plus ? selected : '';
        plus_sel += '<option value="'+opt+'" '+sel+'>'+opt+'</option>';
        sel = opt == buttons.user.settings.bot_minus ? selected : '';
        minus_sel += '<option value="'+opt+'" '+sel+'>'+opt+'</option>';
      });

      plus_sel += '</select>';
      minus_sel += '</select>';

      let checked = doctype == 'HTML' ? 'checked' : 'checked="checked"';
      let inputclose = doctype == 'HTML' ? '' : '</input>';
      let APOS = '\u0027';
      let NBSP = '\u00A0';
      let MIDDOT = '\u00B7';
      let CDATA1 = doctype == 'HTML' ? '' : '/*<![CD'+'ATA[*/';
      let CDATA2 = doctype == 'HTML' ? '' : '/*]'+']>*/';
      let ignoredHTML = '', ignored = this.user.settings.ignore.split(",");
      let padding = [60, 40, 65];
      let scrolledToDateTitle = 'That'+APOS+'s ';

      switch (true) {
        case this.user.count > 32602522:
            padding = [0,160,5];
            s = ((Math.round(this.user.count * 8.825569e-6)) / 10000);
            scrolledToDateTitle += (s == 1 ? 'The ' : s +' ')+'Light Second'+(s == 1 ? '' : 's')+'.';
          break;
        case this.user.count > 2676326:
            padding = [20,120,25];
            s = ((Math.round(this.user.count * 6.134495e-6)) / 100)
            scrolledToDateTitle += (s == 1 ? 'The ' : s +' Times the ')+'Width of the U.S.';
          break;
        case this.user.count > 669082:
            padding = [30,100,35];
            s = ((Math.round(this.user.count * 7.747293e-5)) / 100)
            scrolledToDateTitle += (s == 1 ? '' : s +' times ')+'the Altitude of the ISS.';
          break;
        case this.user.count > 3041:
            padding = [40,80,45];
            s = ((Math.round(this.user.count * 1.644e-2)) / 100);
            scrolledToDateTitle += s +' Mile'+(s == 1 ? '' : 's')+'.';
          break;
        default:
            s = ((Math.round(this.user.count * 8.68)) / 10);
            scrolledToDateTitle += s +' F'+(s == 1 ? 'oo' : 'ee')+'t';
      }

      let scrolledToDate = this.user.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +',000 Pixels Smart Scrolled.';
      let addable = false;

      for (n = 0; n < ignored.length; n++) {
        if (ignored[n].length < 5) continue;
        addable = addable || hostname == ignored[n];
        ignoredHTML += '<span class="ignores"><button style="padding:0px 3px 1px;margin-right:6px;background-color:#ff3333;color:#fff;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px" onclick="document.forms[\'sssettings\'].remove.value+=\''+ignored[n]+',\';this.disabled=\'disabled\'" title="Mark '+ignored[n]+' for deletion from this list">x</button><span>'+ignored[n]+'</span></span><br />';
      }
      addable = addable ? '' : ('<span class="addable"><button style="padding:0px 3px 1px;margin-right:6px;background-color:#33ff33;color:#000;font-weight:bold;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px" onclick="document.forms[\'sssettings\'].add.value+=\''+hostname+'\';this.disabled=\'disabled\'" title="Mark '+hostname+' for addition to this list">+</button><span>'+hostname+'</span></span><br />');

      html = '<div id="'+id+'" style="width:500px;height:400px;margin:auto auto;border-radius:12px 54px 12px 100px;-webkit-border-radius:12px 54px 12px 100px;-moz-border-radius:12px 54px 12px 100px;border:3px solid #CCC;">'+
             '  <div style="width:500px;height:50px;background-color:#000;border-radius:12px 50px 0px 0px;-webkit-border-radius:12px 50px 0px 0px;-moz-border-radius:12px 50px 0px 0px;">'+
             '    <div style="width: 380px;height:40px;padding:12px 0 0 65px;color:#eee;font-size: 1.5em;font-weight: bold;background:transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAQAAABLCVATAAAAAmJLR0QA/vCI/CkAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfiDBwSIh99fynEAAAD9klEQVRIx6XWzW9UVRjH8c+dzjBtAfsCUlIsKbSU8hZpijGRRAzhTY0Y4sqgiYQENVEXJiTEVUPQjSgr3Rhd+i+wKAYJSMJb5U2YAkljpSVAUlqgZZjOzHXR28tMKSSkZzKbc879nuc+z+/53RNsCc1oBEKPZCWft'+
                                     'WFcTighQBj909NsD5GaDhQIjcups0aHf50yqtZ6dS7rMywlJRCWPZFgKmgC0q5TuwWuOewUeGiv9e7I6JGRknoqsimgx2ptstJ8Tc44oCeaPyrQZa0aba44YkT6eaCsNts1W6jeCV3Ol6wdlfOjVUbVa3JY7xRURUvXE0yHbZZoVeOyPc4pL2i/GzZoUmNcg5wBFXFWH0tM5iarzUYtWlX50y6XJk9SqQIBjtnlikrtmm3Q7nHJMYkJZl6t7ZZYoso/9jofRRN41Q6rozIXnfSpXmmtmm1VI18OCuVs0qxVtR479ShGy20O+F2Xpriqf/ncoCrLNNpsvBw0rt0qDWbhtgsxptX3Nil6x3eaY9RZD1Gp0QrtcUwJyOlUb7YQuSgftPjNuxKKknY6aEFclAJCNWp1yEW7'+
                                     'E4yr064xKudanwgltTpovUARRaH3/GSxpCp7LBQKVVukVb2ccEJHOWvUmQ0KXrHfGwKLvSlUiM4rSNqh2oDANrXRS85RZ6mz0pOCXKlRZVSXQKPdRHEEcT8VBLZFgFBREOVpuTNPlL0o7p0g2jidXYiLID4gZVFpsueUbHmxEXqpFJSagbElS0H5GYDKdPRgsuVeeCQ8KAX1y5YYZxD9nrbUJythNPfIf6WvmHHLXJVRNcbcFag0vwyWELotK/CyymjlkVuuPVF2Wp9hDyPTGPGzDut86IKKEh0FLvrAOq/7xVg0/8CIPmnBBChpWK9BWQTO2Oe+ISd8rT+2rgrn7HbKPXftNyAQGHPLDUNR3aLy97hnVIBCFEPBSR+7IIkKJ3wZe1RWEYFhw/6OpROBMq64JYs6DTH'+
                                     'quH3OSzrtG6fjbC1VjVGDMjKxjpIToacc0aSoXadffeZmtHxEymtOOl6COaTRmGsGdZdIOTL/CqPuaVBUb7l5etyPGrffOdflo/Qu84MtxmUM6DYgFZt//DlK642spM1HkvYZiDKSjXW0wgHvG5Ux4JirZk3/OUoaMGyeRyp0anDRvTJJtvnWZnfccFO3SzFmSkQwy1WDNrtvnrcNORTrluW+8pZeIzK63S+LZkpEE1FlXXJbQd5qc92IctXqCxtdd9kfjimU+cVERMF096O8nHotVuhx1EO1tmlxTZ8hqacuMIGCYcHW8Hn3o6CsZdPPuE7lPZAsPNXjk+ekn+M+QdkzedWSIzO7+QklVJvlf7qjThcu+vTfAAAAAElFTkSuQmCC) no-repeat 10px center;">'+
             '    Smart Scroll Settings</div>'+
             '  </div>'+
             '  <form id="'+id+'_settings_form" name="sssettings" class="sssettings" action="javascript:void(0)" onsubmit="return false" style="padding:10px;height:330px;border-radius:0px 0px 10px 96px;-webkit-border-radius:0px 0px 10px 96px;-moz-border-radius:0px 0px 10px 96px;">'+
             '    <div style="width:100%;height:240px;padding-bottom:0px;">'+
             '      <div style="width:50%;height:100%;padding:0px;float:left;border-radius:0px 0px 0px 96px;-webkit-border-radius:0px 0px 0px 96px;-moz-border-radius:0px 0px 0px 96px;">'+
             '        <span style="margin-left:30px;">Slow scrolling speed:</span><br />'+ (rangetype ?
             '        <input name ="crawl_speed" type="range" min="1" max="100" step="1" value="'+this.user.settings.crawl_speed+'" onchange="document.getElementById(\'crawl_speed_now\').innerHTML=this.value" style="width: 180px;">'+inputclose+' <span id="crawl_speed_now">'+this.user.settings.crawl_speed+'</span><br />'+
             '        <span style="font-size:11px;">'+NBSP+'Slow '+MIDDOT+NBSP+MIDDOT+NBSP+MIDDOT+NBSP+MIDDOT+' Fast '+MIDDOT+NBSP+MIDDOT+NBSP+MIDDOT+NBSP+MIDDOT+' Faster</span><br /><br />' :
             '        '+crawl_sel+'<br />'+
             '        <span style="font-size:11px;">1 = Slow thru 100 = Fast</span><br /><br />')+
             '        <input type="checkbox" name="bottomless_pages" id="bottomless1" '+(this.user.settings.bottomless_pages ? checked : "")+' >'+inputclose+' <label for="bottomless1" title="Recalculates when pages add content to bottom">Bottomless pages</label><br />'+
             '        <input type="checkbox" name="refresh" id="refresh1" '+(this.user.settings.refresh ? checked : "")+' >'+inputclose+' <label for="refresh1" title="Refresh current page upon critical settings changes made here">Auto page refresh</label><br />'+
             '        <input type="checkbox" name="dimButtons" id="dimButtons1" '+(this.user.settings.dimButtons ? checked : "")+' >'+inputclose+' <label for="dimButtons1" title="Buttons will disappear when over videos after 3 seconds">Fade out over video</label><br />'+
             '        <div style="margin: 6px 0 2px 30px;">Slow scroll trigger</div>'+
             '        <span><input type="radio" name="crawl_trigger" id="trigger1" value="middleclick"'+(this.user.settings.crawl_trigger == "middleclick" ? checked : "")+' >'+inputclose+' <label for="trigger1" title="Middle mouse button held down">Middleclick</label> '+
             '              <input type="radio" name="crawl_trigger" id="trigger2" value="hover" '+(this.user.settings.crawl_trigger == "hover" ? checked : "")+' style="margin-left:10px;">'+inputclose+' <label for="trigger2" title="Mouse pointer held over">Hover</label></span><br />'+
             '        <div style="margin: 6px 0 2px 30px;">Button Position</div>'+
             '        <span><input type="radio" name="position" id="position1" value="top" onmouseout="this.blur()" '+(this.user.settings.position == "top" ? checked : "")+'>'+inputclose+' <label for="position1" title="Always at top right">Top</label>'+
             '              <input type="radio" name="position" id="position2" value="middle" onmouseout="this.blur()" '+(this.user.settings.position == "middle" ? checked : "")+' style="margin-left:6px;">'+inputclose+' <label for="position2" title="Always at middle right">Middle</label>'+
             '              <input type="radio" name="position" id="position3" value="bottom" onmouseout="this.blur()" '+(this.user.settings.position == "bottom" ? checked : "")+' style="margin-left:6px;">'+inputclose+' <label for="position3" title="Always at bottom right">Bottom</label></span><br />'+
             '        <span>'+plus_sel+'<span title="Pixels down from top">:Plus</span>'+minus_sel+'<span title="Pixels up from bottom">:Less</span></span><br />'+
             '      </div>'+
             '      <div style="width:50%;height:100%;float:left;">'+
             '        <div style="width:100%;height:20px;text-align:center;" title="(Scroll buttons will not be used)">Ignored Sites</div>'+
             '        <div id="ssignored" style="width:224px;height:180px;overflow-y: auto;overflow-x: hidden;border: 1px solid #000;padding: 6px;line-height:1.3;border-radius:5px;-webkit-border-radius:5px;-moz-border-radius:5px;">'+
             '        '+addable+ignoredHTML+'</div>'+
             '        <div style="width:100%;height:12px;text-align:center;font-style: italic;color:blue;font-size: 12px;padding-top: 4px;cursor:help" title="'+scrolledToDateTitle+'">'+scrolledToDate+'</div>'+
             '      </div>'+
             '    </div>'+
             '    <div style="width:100%;height:90px;border-radius:0px 0px 10px 96px;-webkit-border-radius:0px 0px 10px 96px;-moz-border-radius:0px 0px 10px 96px;">'+
             '      <div style="width:fit-content;width: -moz-fit-content;height:80px;margin:10px auto 0px;background-color:transparent">'+
             '        <button id="'+id+'_settings_close" style="background-color:#ff3333;padding:30px '+padding[0]+'px;border-radius:0px 0px 0px 74px;-webkit-border-radius:0px 0px 0px 74px;-moz-border-radius:0px 0px 0px 74px;">Cancel</button> '+
             '        <button id="'+id+'_settings_donate" style="background-color:#ffff33;padding:30px '+padding[1]+'px;">Donate</button>'+
             '        <button id="'+id+'_settings_save" style="background-color:#33ff33;padding:30px '+padding[2]+'px;">Save</button>'+
             '      </div>'+
             '    </div>'+
             '    <input name ="remove" type="hidden" value="">'+inputclose+'<input name ="add" type="hidden" value="">'+inputclose+'<input name ="'+id+'" type="hidden" value="">'+inputclose+
             '    <input name ="submit" type="submit" value="" style="width:0px;height:0px;opacity:0;">'+inputclose+
             '  </form>'+
             '</div>'+
             '<style type="text/css">'+CDATA1+
             '  #pdus div, #pdus span, #pdus label, #pdus form, #pdus input, #pdus button {margin:0px;padding:0px;border:0px;color:#333;box-sizing:content-box;background-color:#EEE; font: 14px \'Titillium Web\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; box-shadow: none;min-height:0px;line-height: 1;text-align:left; text-decoration:none;outline:none; }'+
             '  #pdus div, #pdus form  {display:block;} #pdus span, #pdus label {display:inline;} #pdus input, #pdus button {display:inline-block;}'+CDATA2+
             '</style>';
      div.setAttribute('id', 'pdus');
      div.className = "smartScroll_Settings";
      div.style = 'width:100%;height:100%;margin:0;padding:0;position:fixed;top:0px;left:0px;background-color: rgba(0, 0, 0, 0.7);z-index:84000;';
      div.innerHTML = html;
        /* Some (unmentionable large) sites remove settings modal as soon as it is appended */
      buttons.body.removeChild=function() {return div2}
      buttons.body.replaceChild=function() {return div2}
      if (e && e == 'removed') {
          buttons.body.innerHTML += div.outerHTML
      }
      else {
        buttons.body.appendChild(div);
        setTimeout(function() {
          if (document.querySelector(".smartScroll_Settings") === null) {
            buttons.settings_id = "";
            buttons.smartScroll_Settings('removed');
          }
        }, 300);
      }
      buttons.settings_id = id;
      form = document.querySelector('form#'+id+'_settings_form');
      form.querySelector('#'+id+'_settings_close').addEventListener('click', function(e) { buttons.settings_close() }, false);
      form.querySelector('#'+id+'_settings_donate').addEventListener('click', function(e) { buttons.settings_donate() }, false);
      form.querySelector('#'+id+'_settings_save').addEventListener('click', function(e) { buttons.onSettingsSave() }, false);
      form.querySelector('#'+id+'_settings_save').addEventListener('change', function(e) { buttons.onSettingsSave() }, false);
      form.querySelector('#position1').addEventListener('change', function(e) { buttons.updateButtonCss() }, false);
      form.querySelector('#position2').addEventListener('change', function(e) { buttons.updateButtonCss() }, false);
      form.querySelector('#position3').addEventListener('change', function(e) { buttons.updateButtonCss() }, false);

      let options1 = form.top_plus.options;
      let options2 = form.bot_minus.options;

      for (i = 0;i < options1.length; i++) {
        options1[i].addEventListener('mouseup', function(e) { buttons.updateButtonCss(e) }, false);
        options2[i].addEventListener('mouseup', function(e) { buttons.updateButtonCss(e) }, false);
      };

    }
    else {
      buttons.settings_close()
    }

  },
  onSettingsSave: function() {

    var form = document.querySelector('form#'+buttons.settings_id+'_settings_form');
    var inputs = form.querySelectorAll('input, select'),
        settings = { ignore: this.user.settings.ignore },
        input,
        val,
        i, n,
        ignoreUpdated = false,
        refreshNeeded = false;

    if (form.querySelector('input[name="'+buttons.settings_id+'"]') !== null) {
      for (i = 0; i < inputs.length; i++) {
        val = null;
        input = inputs[i];

        switch (input.type) {
          case 'checkbox':
            val = input.checked;
            if (this.user.settings[input.name] != val && input.name != 'refresh') {
              refreshNeeded = true;
            }
            break;
          case 'select':
          case 'select-one':
            val = parseInt(input[input.selectedIndex].value);
            break;
          case 'radio':
            if (input.checked) {
              val = input.value;
              if (this.user.settings[input.name] != val) {
                refreshNeeded = true;
              }
            }
            else {continue;}
            break;
          case 'range':
              val = parseInt(input.value);
            break;
          case 'hidden':
            if (input.name == buttons.settings_id) {
              continue;
            }
            else if (input.name == "remove" && input.value != "") {
              let thisUrl = false;
              let urls = input.value.split(",");

              for (n = 0; n < urls.length; n++) {
                if (urls[n].length < 5) continue;
                if (urls[n].indexOf(window.location.hostname) !=-1) {
                  thisUrl = true;
                }
                var url = new RegExp(urls[n] +",", "gi");
                settings.ignore = settings.ignore.replace(url, "");
              }
              refreshNeeded = refreshNeeded || thisUrl;
              continue;
            }
            else if (input.name == "add" && input.value != "") {
              settings.ignore += input.value.trim() +',';
              refreshNeeded = ignoreUpdated = true;
              continue;
            }
            else { continue; }
            break;
          default: continue;
        }
        if (val !== null) {
          settings[input.name] = val;
        }
      }
      if (ignoreUpdated) {
        let ignore = settings.ignore.split(',');

        ignore.pop();
        if (ignore.length > 1) {
          ignore.sort();
          settings.ignore = ignore.join() +',';
        }
      }
      buttons.saveSettings({name: 'user_settings', value: settings});
      if (refreshNeeded && settings.refresh) {
        window.location = window.location;
      }
      else {
        this.resetButtons();
      }
    }
    buttons.settings_close();

  },
  settings_close: function(e) {

    let modal = document.querySelector(".smartScroll_Settings");

    if (modal !== null) {
      modal.remove();
    }
    buttons.settings_id = "";
    if (typeof e != "undefined" && e == 'unload') {
      buttons.toggle_up_btn("hide");
      buttons.toggle_dn_btn("hide");
    }
    else { buttons.resetButtons(); }

  },
  saveAccrued: function(e) {

    if (buttons.count_accru > 1000) {
      buttons.initSettings({name: "count"});
    }

  },
  saveSettings: function(settings) {

    if (typeof settings == 'undefined' || typeof settings.name == 'undefined' || settings.name == '') {
      console.error('saveSettings() input error');
      return;
    }

    switch(settings.name) {
      case 'user_settings':
        this.GM.setValue('settings', JSON.stringify(settings.value));
        break;
      case 'count':
          if (this.count_accru > 999) {
            let totalCount = Math.round(this.count_accru / 1000) + settings.value;

            this.GM.setValue('count', totalCount);
            this.user.count = totalCount;
            this.count_accru = 0;
          }
          else {
            this.user.count = settings.value;
          }
        break;
    }

  },
  settings_donate: function() {

    let donate_url = "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QHFFSLZ7ENUQN&source=url";
    window.open(donate_url, '_blank');

  },
  updateButtonCss: function(e) {

    let style = document.querySelector('#smartscrollstyle');
    let form = document.querySelector('form#'+buttons.settings_id+'_settings_form');
    let position2 = form.position2.checked;
    let position3 = form.position3.checked;
    let position = 'top';

    if (position2) position = 'middle';
    else if (position3) position = 'bottom';

    let settings = {
      position: position,
      top_plus: parseInt(form.top_plus[form.top_plus.selectedIndex].value),
      bot_minus: parseInt(form.bot_minus[form.bot_minus.selectedIndex].value),
      bottomless_pages: buttons.user.settings.bottomless_pages
    };
    style.innerHTML = buttons.buttonCss(settings);

  },
  buttonCss: function(settings) {

    let btn_css = '',
        dn_btn_css = '',
        updn_btn_css = '';

    settings = typeof settings === 'object' ? settings : this.user.settings;
    if (settings.position == 'top') {
      updn_btn_css = 'top:'+(settings.top_plus)+'px;';
      dn_btn_css = 'margin-top:33px;';
    } else if (settings.position == 'bottom') {
      updn_btn_css = 'bottom:'+(settings.bot_minus+33)+'px;';
      dn_btn_css = 'margin-bottom:-33px;';
    } else if (settings.position == 'middle') {
      updn_btn_css = 'bottom:50%;';
      dn_btn_css = 'margin-bottom:-33px;';
    }

    btn_css += '#up_btn { position:fixed; right:-33px; z-index:54000; height:36px; width:33px; display:inline; cursor:pointer; background:url('+up_btn_src+') no-repeat scroll 50% 50% rgba(0, 0, 0, 0.7); }';
    btn_css += '#dn_btn { position:fixed; right:-33px; z-index:54000; height:36px; width:33px; display:inline; cursor:pointer; '+dn_btn_css+'background:url('+dn_btn_src+') no-repeat scroll 50% 50% rgba(0, 0, 0, 0.7); }';
    btn_css += '.updn_btn { '+updn_btn_css+'opacity:0.65; } .isfullscreen > .updn_btn { display:none;}';
    btn_css += '.sssettings button:hover {opacity:0.85;} .updn_btn:hover { opacity:1; } .sssettings button[disabled], .sssettings button[disabled]:hover { opacity:0.35;} ';
    btn_css += '.sssettings span button:hover:enabled {line-height: 1.4 !important; width: 10px !important;} .sssettings .ignores button[disabled] + span { opacity:0.5;} .sssettings .addable button + span { opacity:0.5;} .sssettings .addable button[disabled] + span { opacity:1;}';

    if (settings.bottomless_pages) {
      btn_css += 'iframe.resize_frame {position: absolute; display: block ;top: 0; bottom: 0; left: 0; height: 100%; opacity: 0; z-index: 0; width: 0; border: 0; background-color: transparent;}';
      if ('contentType' in document) { // Firefox
        if (document.contentType.indexOf("image") ==-1) {
          btn_css += 'body {position:relative !important;} body.isfullscreen {position:initial !important;}';
        }
      }
      else {
        btn_css += 'body {position:relative !important;} body.isfullscreen {position:initial !important;}';
      }
    }

    return btn_css;

  },
  scrolledUpdate: function(e) {

    if (buttons.count_accru > 1000 || e === true) {
      buttons.initSettings({name: "count"});
    }
    window.setTimeout(buttons.scrolledUpdate, 120000);

  },
  resetButtons: function (e) {

    buttons.allowScroll = true;
    buttons.up_btn_show = "";
    buttons.dn_btn_show = "";
    buttons.getDocumentHeight(e);
    buttons.crawl_speed_ms = Math.round(200 / buttons.user.settings.crawl_speed);

  },
  syncGM_getValue: function (e) {

    if (e.detail.setting == 'settings') {
      buttons.initSettings(e.detail);
    }
    else if (e.detail.setting == 'count') {
      if (e.detail.value && e.detail.value != "{}") {
        buttons.saveSettings({name: "count", value: JSON.parse(e.detail.value)});
      }
    }

  },
  initSettings: function (detail) {

    if (typeof detail.name != 'undefined') {
      this.GM.getValue(detail.name, "{}").then(function (value) {

        var details = {
          detail: {
            setting: detail.name,
            value: value || "{}"
          }
        };

        try{
          buttons.syncGM_getValue(details);
        }
        catch (e) {
          console.warn( 'Smart Scroll: UPDATE Your Browser ',e.name );
        }
      });

    }
    else {

      var settings,
          setting = detail.setting,
          value = detail.value;

      if (! value || value == "{}") {
        settings = false;
        console.warn( 'Smart Scroll: NO storage database');
      }
      else {
        settings = JSON.parse(value);
        //console.log( 'Smart Scroll: Initializing settings from storage database');
      }

      if (! settings) {
        settings = this.user;
        console.log( 'Smart Scroll: Installing storage database...' );
        for (let k in settings) {
          let jstr = JSON.stringify(settings[k]);

          this.GM.setValue(k, jstr);
          console.log( 'Smart Scroll: Inserting '+k+': '+ jstr);
        }
        settings = this.user.settings;
        console.log( 'Smart Scroll: dONE' );
      }
      this.user.settings = settings;
      this.scrolledUpdate(true);
      this.monkey();
      this.monkey = null;
    }

  },
  init: function () {

    if (typeof GM_info === "object" || typeof GM === "object") {
      this.is_userscript = true;
      if (typeof GM === "undefined") {
        console.log( 'Smart Scroll: Legacy GM_setValue enabled' );
        this.GM = {
          info: GM_info,
          setValue: GM_setValue,
          getValue: function () {
            return new Promise( (resolve, reject) => {
              try {
                resolve(GM_getValue.apply(this, arguments));
              }
              catch (e) { reject(e) }
            });
          }
        };
      }
      else { this.GM = GM; }

      var outerscroll = document.createElement("div");
      var innerscroll = document.createElement("div");

      outerscroll.style = "position:absolute;top:0px;background-color:transparent;";
      innerscroll.style = "height:"+ (window.innerHeight - 100) +"px;width:100px;overflow:scroll;background-color:transparent;";
      this.body.appendChild(outerscroll);
      outerscroll.appendChild(innerscroll);
      let h1 = innerscroll.scrollHeight;
      innerscroll.style.overflow = 'hidden';
      let h2 = innerscroll.scrollHeight;
      this.scrollbar = h2 - h1;
      innerscroll.remove();
      outerscroll.remove();

      this.initSettings({name: "settings"});
    }

  },
  head: document.head || document.getElementsByTagName('head')[0],
  body: document.body || document.documentElement,
  user: {
    settings: {
      bottomless_pages: true,
      crawl_trigger: 'hover',
      position: 'bottom',
      dimButtons: true,
      crawl_speed: 21,
      refresh: true,
      bot_minus: 30,
      top_plus: 0,
      ignore: ''
    },
    count: 0
  },
  crawl_speed_ms: 10,
  opacity_timer: null,
  allowScroll: true,
  settings_id: "",
  up_btn_show: "",
  dn_btn_show: "",
  count_accru: 0,
  scrollable: 0,
  scrollbar: 0,
  scrolled: 0,
  creeper: null,
  up_ctn: null,
  dn_ctn: null,
  creep: !1,
  step: 5,
  GM: null,
  _x: 0
};

var _once = 0;
var up_btn_src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAkCAQAAACtIJtXAAAAAmJLR0QA/vCI/CkAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfiDBkQOCqvuzNgAAABWElEQVRIx6XWO7aDIBCA4V+OWYOaVbiDFGlccopkD/Sp0qiswcJb+ODhgNwjXXh8DpFhLKa558uVVvxmuF8iyi8PcWBkCHoaapmILTdA5fQZDJXIlPHl/vSlX2LKENDCcoCaemdab7Q8Am1kzxuj0d4clQ9sTAtoxiORB0jITgyZg'+
                 'EUGnxgxVJnAglSYNQ5lY2iEqR03bnTCSLPHoVIxdHwA+AiIjUPFY9iAGLLFsW7kGIMLyEi9JoCS/64QiEUSJVzgyfMEUWfAi9cJIhA+AARI1kZ8IEQihHHS5n0AXOTtpKWxyd5gGPbX+mASn/YKfm+nSYUnPrfZE63CE5/b7IlWx8z7XwzOG2mCuygNaCerVPxCSwP2elKpWzEHCG7wmhaNjpQcW2MSRWBB5JITK1FCNXNLjl8QyS2ILuO2KlWWe/HjoM6+z4vffO0DBco7V1sB09xfIv4A9ICG7qoP1KkAAAAASUVORK5CYII=';
var dn_btn_src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAkCAQAAACtIJtXAAAAAmJLR0QA/vCI/CkAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfiDBkRAC0ngnAPAAABV0lEQVRIx6XWO5KDMAyA4R8PnAHIKbjBFtkiR06TIjdwnyoN4DOkYAsClm2Z8Q4q/fhGgGxRfZaRF2eiei9wOUXUL37UiZkpGunpdCK33QGtGHM4WpWp89vD5eu4xtQxYJXtAB3dzgzBbJ0CQ+aZN8ZigzWmHNiYAbDMKVEGaMhOT'+
                 'IWAR6aQmHG0hcCKtLhvHsbn0P+rJvs9D5Pm8KSh4ZZsutHQ8EzyMGkOvwA8IuTGQ8zKPL4Por0HiWxA/D6iutjimiASuCbrFeIeISFwLyFi5BjIECFyDGSJFMkBO+HEsdEQDZhxnuhFxWuInsFWTbWstE5BcuEr2sQVXxq+ok168kpCniojK94WIuv11McfNb3QjgF/PZmjW7EEiG7wjgGLzbQc32MOmsCK6C0n16KUbiZbTtgQKW2IkpHRHrXlUf056Irv8+q9nPtBgfrC2ajgs4yniD+XioU/GQ3iSgAAAABJRU5ErkJggg==';
var root = buttons.body;
var host = window.location.hostname;
  /* Not in Frames */
if (window.self == window.top) {
  switch(true) {
    /* Special case sites */
    case host.indexOf('youtube') !=-1 :
      buttons.hideOnFullScreen();
      window.addEventListener("yt-navigate-finish", function(e) { buttons.reLoadStart(e) }, false);
      /* body remains 0 height propter full-screen styling */
      if (root = document.querySelector("ytd-app #content")) {
        buttons.init();
      }
      else {
        buttons.body.addEventListener('yt-page-data-updated', function(e) {
          if (root = document.querySelector("ytd-app #content")) {
            if (_once++ < 1) buttons.init();
          }
        }, false);
      }
      break;
    default: buttons.init();
  }
}
}());
