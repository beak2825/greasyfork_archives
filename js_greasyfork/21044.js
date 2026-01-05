// ==UserScript==
// @name        Show Linux games when you scroll on the Steam store page
// @namespace   wetwildwoods.org
// @description Sorry not working anymore, I'll update if I find a way to fix it but it's unlikely. Display Linux games instead of Windows games on the Steam Store page when you scroll down
// @include     http://store.steampowered.com/
// @include     https://store.steampowered.com/
// @version     1.3
// @grant       none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/21044/Show%20Linux%20games%20when%20you%20scroll%20on%20the%20Steam%20store%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/21044/Show%20Linux%20games%20when%20you%20scroll%20on%20the%20Steam%20store%20page.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function() {
  var links = document.getElementsByTagName("a");
  for(var i = 0; i < links.length; i++) {
    var link = links[i];
    var index = link.href.indexOf("os=win");
    if(index > 0) {
      link.href = link.href.replace(/os\=win/g, 'os=linux');
    }
  }

  $J.fn.pagedautoloader = function( options ) {
      var settings = $J.extend({
          triggerStart: 0,
          template_url: false
      }, options );
      settings.template_url = settings.template_url.replace(/os\=win/g, 'os=linux');

      return this.each(function( i, ele ) {

          ele.indices = {chunks: 0};

          var offset = $J(ele).offset();
          this.nNextTrigger = $J(ele).height() + offset.top - 750;

          ele.bTriggerActive = false;
          ele.tagIndex = 0;
          ele.nRecommendedDataIndex = 0;
          ele.rgSeenApps = [];
          ele.nPage = 0;
          ele.bMoreContent = true;


          var loadFunc = function() {
              ele = this;

              if( this.bTriggerActive || g_bDisableAutoloader )
              {
                  return;
              }

              this.bTriggerActive = true;

              if( this.bMoreContent )
              {
                  $J(this).show();
                  ele.nPage = ele.nPage + 1;

                  this.bTriggerActive = true;

                  $J('#content_loading').show();

                  var jqxhr = $J.ajax( {
                      url: settings.template_url,
                      data: {
                          page: this.nPage
                      },
                      type: 'GET'
                  }).done(function( data ) {
                      ele.index++;
                      var newElement = $J(data);

                      GDynamicStore.DecorateDynamicItems(newElement);

                      $J(ele).append(newElement);
                      ele.bTriggerActive = false;

                      var nCurrentScroll = $J(window).scrollTop() + $J(window).height();
                      ele.nNextTrigger = $J(ele).height() + offset.top - 750;
                      if(nCurrentScroll > ele.nNextTrigger)
                      {
                          loadFunc.apply(ele);
                      }

                  }).fail(function(){
                      ele.bMoreContent = false;
                  }).always(function() {
                      $J('#content_loading').hide();
                  });
              }

              bAutoLoaderReady = true;
          };

          var scrollFunc = function( event ){
              if ( g_bDisableAutoloader )
                  return;

              if( bAutoLoaderReady )
                  WebStorage.SetLocal('home_scroll',$J(window).scrollTop(), true);

              var nCurrentScroll = $J(window).scrollTop() + $J(window).height();
              if(nCurrentScroll > this.nNextTrigger)
              {
                  loadFunc.apply(this);
              }
          };

          $J(document).scroll( function() { return scrollFunc.apply(ele); } );
      });

  };
});
