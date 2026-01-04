// ==UserScript==
// @name        AniDB-Tags on MAL
// @include     https://myanimelist.net/anime*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @author      lolamtisch@gmail.com
// @description Show the aniDB-Tags on MAL
// @version     0.01
// @connect     anidb.net
// @connect     anidb.info
// @connect     *
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @namespace   https://greasyfork.org/users/92233
// @run-at      document-ready
// @downloadURL https://update.greasyfork.org/scripts/37270/AniDB-Tags%20on%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/37270/AniDB-Tags%20on%20MAL.meta.js
// ==/UserScript==
(function() {
    var href = $( "a:contains('AnimeDB')" ).attr('href');
    if(href){
        GM_addStyle('#aniDB .g_bubble{\
                      display: none;\
                    }\
                    #aniDB .tooltip:hover .g_bubble{\
                      display: block;\
                      z-index: 2;\
                      padding: 7px 10px;\
                      background-color: #f6f6f6;\
                      border: 1px solid #ebebeb;\
                      color: black;\
                      position: absolute;\
                    }\
                    #aniDB .g_bubble:hover{\
                      display: none !important;\
                    }\
                     #aniDB .tag.parent{\
                       border-bottom: 1px solid #bebebe;\
                       margin: 4px 0 5px;\
                       padding: 3px 0;\
                    }\
                     #aniDB .tag.parent a{\
                       text-transform: capitalize;\
                       color: black;\
                       font-size: 12px;\
                       font-weight: 700;\
                    }\
                    #aniDB .tagname{\
                      color: black;\
                      //font-weight: 700;\
                    }\
                    #aniDB .tag .i_rate_weightless{\
                      display: none;\
                    }\
                    #aniDB .not_added .tagname{\
                      text-decoration: line-through;\
                    }\
        ');
        GM_xmlhttpRequest({
            method: "GET",
            url: href,
            synchronous: false,
            onload: function(response) {
                var parsed = $.parseHTML(response.response);
                var html = $(parsed).find( '.animetags .g_bubble.container .tag-column' ).first().html();
                html = '<div id="aniDB" style="margin-top: -30px; position: relative;">'+html+'</div>';
                $('.js-scrollfix-bottom').first().append(html);
                $('#aniDB .tag.parent').before('<br/>');
                $('#aniDB #eptb_0, #aniDB .tag[data-anidb-groupid="eptb_0"]').remove();
                $('#aniDB .tag .i_icon').each(function(){
                  console.log($(this).attr('title'));
                  $(this).find('span').first().text( $(this).attr('title').replace(/\*/g,'★').replace(/\+/g,'☆') );
                });
                $( "a[href^='animedb.pl']" ).each(function(){
                  $(this).attr('href', 'http://anidb.net/perl-bin/'+$(this).attr('href'));
                });
            }
        });
    }

}());