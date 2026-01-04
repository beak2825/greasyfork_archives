// ==UserScript==
// @name         Previo Env Colors
// @namespace    thetomcz.previo.colors
// @version      0.2
// @icon         https://www.previo.cz/icons/share/128x128/favicon.ico
// @description  Colors for each Previo environment
// @author       Tomas Hejl <tomas.hejl@previo.cz>
// @include      /^(http|https)://(admin|crm).*\.previo\.(loc|info|cz)//
// @grant        none
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/426700/Previo%20Env%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/426700/Previo%20Env%20Colors.meta.js
// ==/UserScript==


(function ($, undefined) {
  $(function () {
    var PrevioColors = {
        colors: {
            'local': '#0a0',
            'info': '#a0a',
            'release': '#00a',
            //'production': '#a00', // just for reference, default color
        },

        run: function(){
            var env = PrevioColors.getEnv();
            var color = PrevioColors.colors[env];
            if(color){
                $("head").append("<style>.navbar-default, #menu ul li a, .menu-icon, #menu, .menu-user .dropdown.user>a{background:"+color+"} .menu-icon{border-color:"+color+";} .menu-user .dropdown.user:before{border-right-color:"+color+"}</style>");
            }
        },

        getEnv: function(){
            if(location.href.indexOf('previo.loc/')>-1){
                return 'local';
            }
            if(location.href.indexOf('release.previo.info/')>-1){
                return 'release';
            }
            if(location.href.indexOf('previo.info/')>-1){
                return 'info';
            }
            if(location.href.indexOf('previo.cz/')>-1){
                return 'production';
            }
            return '';
        },
    };

    PrevioColors.run();
  });
})(window.jQuery.noConflict(true));
