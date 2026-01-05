// ==UserScript==
// @name         Krimskrams
// @namespace    Dummbroesel Produktion
// @version      0.1
// @description  TOWODO!!!
// @author       Dummbroesel
// @match        *dev.*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23579/Krimskrams.user.js
// @updateURL https://update.greasyfork.org/scripts/23579/Krimskrams.meta.js
// ==/UserScript==

(function($) {
  var debug = false;
  (debug && console.info('Start of custom.js!'));
  
  window.magicStuff = function(ele, isMagicToggle = false) {
    (debug && console.log(Date.now()));
    (debug && console.dir(ele));
    (debug && console.log(isMagicToggle));
    if(isMagicToggle) jQuery(ele).toggle(600);
    else { jQuery(ele).toggleClass('magicShow');
      var para_me = jQuery(ele).find("#parallax_me");
      if(para_me.length > 0) {
        jQuery('.parallax-mirror').toggleClass('magicShow');
      }
    }
  };
  
  window.magicTogglePara = function () {
    var pmTH = jQuery('.parallax-mirror');
    (debug && console.dir(pmTH));
    if(pmTH.length > 0) {
      if(!pmTH.hasClass('magicHide')) pmTH.addClass('magicHide');
    } else {
      clearTimeout(window.__timeout);
    }
  };
  
  $(document).ready(function () {
    //var magicCounter = 1;
    // grab all elements which should seem to be loaded on runtime
    //var magicToggle = ' #masthead .site-branding, #primary-menu > li '; //#masthead, #masthead .site-branding, #primary-menu > li,
    var magicString = ` .post-header,
                        article.first, article.first .entry-header, article.first .col,
                        article.excerpt, article.excerpt .entry-header, article.excerpt .col,
                        .previews, .previews article 
                      `; //.parallax-mirror, #colophon
      
    //var doMagicStuffArray = $(magicToggle);    
    //(debug && console.dir(doMagicStuffArray));
    //doMagicStuffArray.toggle(false);
    //doMagicStuffArray.each(function () {
    //  (debug && console.log(magicCounter));
    //  window["__timeout"+magicCounter] = setTimeout(window.magicStuff, 111 * (magicCounter), this, true);
    //  magicCounter++;
    //});
    
    window.__timeout = setTimeout(window.magicTogglePara, 100);
    
    doMagicStuffArray = $(magicString);
    (debug && console.dir(doMagicStuffArray));
    doMagicStuffArray.toggleClass('magicHide');
    doMagicStuffArray.each(function () {
      (debug && console.log(magicCounter));
      //window["__timeout"+magicCounter] = setTimeout(window.magicStuff, 111 * (magicCounter), this);
      //magicCounter++;
    });
    checkall();
    
    $(window).scroll(function () {
          checkall();
    });
      
      function checkall() {
        var fiel = $('.magicHide');
        fiel.each(function () {
        var el = $(this);
        if (el.hasClass('fadein')) return true;
        
        var vph = $(window).height(),
        st = $(window).scrollTop(),
        ely = el.offset().top;
        elh = el.height();
        if ((ely<(vph + st)) && !(ely > (st - elh)) || (ely<(vph + st)) && (ely > (st - elh))) {
            el.addClass('fadein');
            el.removeClass('magicHide');
        }
        
        if (debug) { //Viewpoint and element relations
            console.group('Info');
            console.info('Viewpoint height: ' + vph);
            console.info('Window scrolltop: ' + st);
            console.info('Element offset top: ' + ely);
            console.info('Element height: ' + elh);
            console.info('Element under Viewpoint: ' + !(ely<(vph + st)));
            console.info('Element over Viewpoint: ' + !(ely > (st - elh)));
            console.groupEnd('Info');
        }
      });
    }
  });
  (debug && console.info('End of custom.js!'));
})(jQuery);

