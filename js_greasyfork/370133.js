// ==UserScript==
// @name         Mineheroes Dark Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make it easier on the eyes.
// @author       You
// @match        https://www.mineheroes.net/*
// @match        https://www.mineheroes.net/forums/*
// @match        https://www.mineheroes.net/threads/*
// @require  	http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @grant		GM_xmlhttpRequest
// @grant		GM_info
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/370133/Mineheroes%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/370133/Mineheroes%20Dark%20Theme.meta.js
// ==/UserScript==
//////JQuery Compatibility statement//////
this.$ = this.jQuery = jQuery.noConflict(true);
//////JQuery Compatibility statement//////

(function() {
(function ($) {

  var setHeightToWindowSize = function(dom) {
    var paddingTop = dom.css('padding-top');
    paddingTop = +paddingTop.substring(0, paddingTop.length -2);

    var paddingButtom = dom.css('padding-bottom');
    paddingButtom = +paddingButtom.substring(0, paddingButtom.length -2);

    var height = $(window).innerHeight() - paddingTop - paddingButtom;
    dom.css("min-height", (height+"px"));

    // el's top position
    var elTop = dom.offset().top;
    dom.data("elTop", elTop);

    // el's bottom position
    var elBottom = elTop + dom.height() + paddingTop + paddingButtom;
    dom.data("elBottom", elBottom);
  };

  // Collection method.
  $.fn.fixedBG = function (options) {
    var self = this;
    // Define default setting
    var settings = $.extend ({
      autoAdjust: true
    }, options );

    this.each( function() {
      setHeightToWindowSize($(this));
    });

    this.first().css("background-attachment", "fixed");

    /*
      Auto adjust by:
        - set background-size: cover; so that it try to make full image visible
        - set background-repeat: no-repeat;
    */
    if (settings.autoAdjust) {
      this.css ({
        "background-size": "cover",
        "background-repeat": "no-repeat"
      });
    }

    $(window).resize( function() {
      self.each( function() {
        setHeightToWindowSize($(this));
      });
    });

    $(window).scroll( function() {
      var docViewTop = $(window).scrollTop();

      self.each( function() {
        var elTop = $(this).data("elTop");
        var elBottom = $(this).data("elBottom");

        if (docViewTop >= elTop && elBottom > docViewTop) {
          self.css("background-attachment", "scroll");
          // div is in the visible window
          $(this).css("background-attachment", "fixed");
        }
      });
    });
    return this;
  };

}(jQuery));









$('body').css('background-image', 'url(https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-181043.png)');
$('body').css('background-attachment', 'fixed;');

    $(function($) {
  $("body").fixedBG();
});

    $('a').css({"color":"#cce6ff"});
    $('a').css({"background-color":"#404040"});
    $('.navTabs').css({"background-color":"#000066"});
    $('.forumsTabLinks').css({"background-color":"#333333"});
    $('.categoryText').css({"background-color":"#333333"});
    $('.categoryStrip').css({"background-color":"#333333"});
    $('.noBorderRadius').css({"background-color":"#404040"});
    $('.forumNodeInfo').css({"background-color":"#1a1a1a"});
    $('.linkNodeInfo').css({"background-color":"#404040"});
    $('dd').css({"color":"#f2f2f2"});
    $('span').css({"color":"#f2f2f2"});
    $('.lastThreadDate').css({"color":"#f2f2f2"});
    $('.noBorderRadiusTop').css({"background-color":"#333333"});
    $('.breadcrumb').css({"background-color":"#333333"});
    $('#copyright').css({"display":"none"});
    $('.secondaryContent').css({"background-color":"#333333"});
    $('.primaryContent').css({"background-color":"#333333"});
    $('h3').css({"background-color":"#333333"});
    $('h3').css({"color":"#cce6ff"});
    $('.log').css({"color":"#f2f2f2"});
    $('.footnote').css({"color":"#f2f2f2"});
    $('.additionalRow').css({"color":"#f2f2f2"});
    $('.nodeTitle').css({"background-color":"#1a1a1a"});
    $('.discussionList ').css({"background-color":"#1a1a1a"});
    $('.sectionHeaders').css({"background-color":"#1a1a1a"});
    $('.discussionListItem').css({"background-color":"#404040"});
    $('.title').css({"background-color":"#404040"});
    $('.messageText').css({"color":"#f2f2f2"});
    $('.sectionMain').css({"background-color":"#8c8c8c"});
    $('.messageUserBlock').css({"background-color":"#404040"});
    $('.avatarHolder').css({"background-color":"#404040"});
    $('.dark_postrating').css({"background-color":"#404040"});
    $('.report').css({"background-color":"#404040"});
    $('.report').css({"color":"#ff8080"});
    $('.attribution').css({"background-color":"#404040"});
    $('.attribution').css({"color":"#f2f2f2"});
    $('.quoteContainer').css({"background-color":"#404040"});
    $('.attachedFilesHeader').css({"background-color":"#404040"});
    $('.attachedFilesHeader').css({"color":"#f2f2f2"});
    $('.attachmentList').css({"background-color":"#404040"});
    $('.nodeTitle').css({"background-color":"#1a1a1a"});
    $('h1').css({"color":"#f2f2f2"});

})();