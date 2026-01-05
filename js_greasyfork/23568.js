// ==UserScript==
// @name            Vorschau-Server
// @namespace       Vorschau-Server_Website-Manipulator
// @version         0.2.5.0
// @description     Manipulate Websites on the DEV-Server
// @author          Dummbroesel
// @include         *vorschau.impuls-wa.de/*
// @include         *.kasserver.com*
// @include         *.kasserver.*/*
// @include         http://www.vorschau.impuls-wa.de/*
// @include         http://*.*.*.kasserver.com/*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/23568/Vorschau-Server.user.js
// @updateURL https://update.greasyfork.org/scripts/23568/Vorschau-Server.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

function isEmpty( input ) {
    if (typeof input === 'undefined' || input === null || input === '' || (typeof input === 'string' && !input.match(/(\S)+/g))) return true;
    return false;
}

function Debug (isActive, objName) {
    this.name = (!isEmpty(objName)) ? objName : 'debug';
    this.isActive = (!isEmpty(isActive)) ? isActive : false;
}

Debug.prototype.logger = function() {
    if(this.isActive) {  
        var toEval = 'console[arguments[0]].call(window';
        for (var i = 1; i< arguments.length; i++) {
            toEval = toEval + ',arguments['+i+']';
        }
        toEval = toEval + ');';
        eval(toEval);
    }
};

function HAX(objName) {
    this.objName = objName;
    this.debug = new Debug((!isEmpty(window.sessionStorage.debug)) ? JSON.parse(window.sessionStorage.debug) : false);
    this.sl = '';
    this.slto = undefined;
    this.slp = ['1321'];
    this.defaults = {};
}
HAX.prototype.jquery = this.$.fn.jquery;

HAX.prototype.clearSl = function () { __HAX.debug.logger('log', 'reset __HAX.sl before: "' + __HAX.sl + '", after: ""!'); __HAX.sl = ''; };
    
HAX.prototype.logicModes = {
    watchmode:  {
        name: 'watchmode',
        affEles: undefined,
        toggled: false,
        init: function (elements) {
            __HAX.debug.logger('log', 'init watchmode');
            __HAX.debug.logger('dir', this);
            this.affEles = (elements) ? elements : $('*');
            if($('#watchmode').length < 1) $(__HAX.cssModes[this.name]).appendTo('body');
        },
        toggle: function () {
            this.toggled = !this.toggled;
            __HAX.debug.logger('log', 'toggle, toggled: ' + this.toggled);
            __HAX.debug.logger('dir', this);
            
            if(this.toggled) {
                this.affEles.click(function (event) {
                    event.preventDefault;
                    event.stopPropagation;
                    event.stopPropagation();
                    event.preventDefault();
                    $(this).toggleClass('watchmode');
                });
            } else {
                this.affEles.unbind('click');
                this.affEles.removeClass('watchmode');
            }
        }
    },
    trollmode: {
        name: 'trollmode',
        affEles: undefined,
        toggled: false,
        init: function (elements) {
            __HAX.debug.logger('log', 'init trollmode');
            __HAX.debug.logger('dir', this);
            this.affEles = (elements) ? elements : $('*');
            if($('#trollmode').length < 1) $(__HAX.cssModes[this.name]).appendTo('body');
        },
        toggle: function () {
            this.toggled = !this.toggled;
            __HAX.debug.logger('log', 'toggle, toggled: ' + this.toggled);
            __HAX.debug.logger('dir', this);
            
            $('body').toggleClass('trollmode');
        }
    },
    sonmode: {
        name: 'sonmode',
        affEles: undefined,
        toggled: false,
        init: function (elements) {
            __HAX.debug.logger('log', 'init sonmode');
            __HAX.debug.logger('dir', this);
            this.affEles = (elements) ? elements : $('p');
        },
        toggle: function () {
            this.toggled = !this.toggled;
            __HAX.debug.logger('log', 'toggle, toggled: ' + this.toggle);
            __HAX.debug.logger('dir', this);
            if(this.toggled) {
                this.affEles.each(function () {$(this).html($(this).html().replace('Sohn ', 'Son'));});
            } else {
                this.affEles.each(function () {$(this).html($(this).html().replace('Son', 'Sohn '));});
            }
        }
    },
    init: function () {
        __HAX.debug.logger('log', 'init __HAX');
        __HAX.debug.logger('dir', this);
        for(var mode in this) { 
            if(mode == "init") continue;
            __HAX.debug.logger('log', 'try to init ' + mode);
            __HAX[mode] = this[mode];
            __HAX.debug.logger('dir', __HAX[mode]);
            __HAX[mode].init();
        }
    }
};

HAX.prototype.cssModes = {
    trollmode: `<style id="trollmode">.trollmode * {
        	animation-name: trollmode;
        	animation-delay: 0s;
        	animation-direction: normal;
        	animation-duration: 5s;
        	animation-fill-mode: forwards;
        	animation-iteration-count: infinite;
        	animation-timing-function: linear;
        }
        
        @keyframes trollmode {
        	0% {
        		transform: rotate(0deg) scale(1);
        	}
        	25% {
        		transform: rotate(90deg) scale(.5);
        	}
        	75% {
        		transform: rotate(270deg) scale(1.5);
        	}
        	100% {
        		transform: rotate(360deg) scale(1);
        	}
        }</style>`,
    watchmode: `<style id="watchmode">.watchmode {
        position: relative;
        box-shadow: inset 0px 0px 5px rgba(255,0,0,.3);
    }
    /*.watchmode:before {
        position:absolute;
        content:'';
        display: block;
        width: 4px;
        height: 4px;
        background: red;
        animation-name: marchingborder;
        animation-duration: 5s;
        animation-fill-mode: forwards;
        animation-timing-function: linear;
        animation-delay: .3s;
        animation-iteration-count: infinite;
    }*/
    
    @keyframes marchingborder {
        0% {
            left: -4px;
            top: -4px;
        }
        25% {
            left: 100%;
            top: -4px;
        }
        50% {
            left: 100%;
            top: 100%;
        }
        75% {
            left: -4px;
            top: 100%;
        }
        100% {
            left: -4px;
            top: -4px;
        }
    }</style>`
};

window.__HAX = new HAX('__HAX');

(function ($) {
    if(window.location.pathname.indexOf('/wp-login.php') >= 0) {
        $('#user_login').val('impuls');
        $('#user_pass').val(atob('Ymx1Yg=='));
    } else if(window.location.pathname.indexOf('/wp-admin/options-general.php') >= 0 && window.location.search.indexOf('?page=301options') >= 0) {
        __HAX.debug.logger('info','/wp-admin/options-general.php?page=301options');
        $(document).keydown(function(event) {
            __HAX.debug.logger('dir', event);
            __HAX.debug.logger('log', event.which);
            if(event.which == 192) //^
                $('table.widefat').append('<tr><td style="width:35%;"><input type="text" name="301_redirects[request][]" value="" style="width:99%;"></td><td style="width:2%;">»</td><td style="width:60%;"><input type="text" name="301_redirects[destination][]" value="" style="width:99%;"></td><td><span class="wps301-delete" style="color: red; cursor: pointer;">Delete</span></td></tr>');
        });
    } else if(window.location.pathname.indexOf('/wp-admin/options-general.php') >= 0 && window.location.search.indexOf('?page=any-mobile-theme-switcher') >= 0) {
        __HAX.debug.logger('info','/wp-admin/options-general.php?page=any-mobile-theme-switcher');
        $(document).keydown(function(event) {
            __HAX.debug.logger('dir', event);
            __HAX.debug.logger('log', event.which);
            if(event.which == 192) {//^
                $('select[name*="theme"]:not([name="ipad_theme"]):not([name="android_tab_theme"])').each(function () {
                  $(this).val($($(this).find('option')[1]).val());
                });
                $('input[name="mobile_view_theme_link_text"]').val('Wechsel zur Mobilen Version');
                $('input[name="desktop_view_theme_link_text"]').val('Wechsel zur Desktop Version');
            }
        });
    } else if(window.location.pathname.indexOf('/wp-admin/admin.php') >= 0 && window.location.search.indexOf('?page=seo') >= 0) {
        __HAX.debug.logger('info','/wp-admin/admin.php?page=seo');
        $(document).keydown(function(event) {
            __HAX.debug.logger('dir', event);
            __HAX.debug.logger('log', event.which);
            if(event.which == 192) {//^
                $('div.col-sm-8.col-md-9').css('width', '100%');
                $('div.col-sm-4.col-md-3').hide();
            }
        });
    } else if(window.location.pathname.indexOf('/wp-admin/admin.php') >= 0 && window.location.search.indexOf('?page=ginger-setup') >= 0) {
        __HAX.debug.logger('info','/wp-admin/admin.php?page=ginger-setup');
        if(window.location.search.indexOf('&tab=banner')) {
            __HAX.debug.logger('info','Banner Setup');
            $(document).keydown(function(event) {
                __HAX.debug.logger('dir', event);
                __HAX.debug.logger('log', event.which);
                if(event.which == 192) {//^
                    $('input[name="ginger_banner_type"][value="bar"]').click();
                    $('input[name="ginger_banner_position"][value="bottom"]').click();
                    $('textarea[name="ginger_banner_text"]').val('Cookies erleichtern uns die Bereitstellung unserer Dienste. Mit dem Besuch unserer Webseite akzeptieren Sie dass wir Cookies verwenden. Mehr erfahren: {{privacy_page}}');
                    $('input[name="accept_cookie_button_text"]').val('OK');
                    $('input[name="theme_ginger"][value="dark]').click();
                }
            });
        } else if(window.location.search.indexOf('&tab=policy')) {
            __HAX.debug.logger('info','Tab: Privacy Policy');
            $(document).keydown(function(event) {
                __HAX.debug.logger('dir', event);
                __HAX.debug.logger('log', event.which);
                if(event.which == 192) {//^
                    $('input[name="choice"][value="page]').click();
                    // CHECKME!!!!!!
                    //$('select#privacy_page_select').find('option').each(function() {
                    //    if($(this).text().toLowerCase().indexOf('datenschutz'))
                    //        $(this).parent().val($(this).val());
                    //    else if($(this).text().toLowerCase().indexOf('impressum'))
                    //        $(this).parent().val($(this).val());
                    //});
                    $('input[name="ginger_privacy_click_scroll"][value="0"]').click();
                }
            });
        } else {
            __HAX.debug.logger('info','Tab: General Configuration');
            $(document).keydown(function(event) {
                __HAX.debug.logger('dir', event);
                __HAX.debug.logger('log', event.which);
                if(event.which == 192) {//^
                    $('input[name="enable_ginger"][value="1"]').click();
                    $('input[name="ginger_cache"][value="yes"]').click();
                    $('input[name="ginger_opt"][value="out"]').click();
                    $('input[name="ginger_scroll"][value="0"]').click();
                    $('input[name="ginger_click_out"][value="0"]').click();
                    $('input[name="ginger_force_reload"][value="0"]').click();
                    $('input[name="ginger_keep_banner"][value="0"]').click();
                    $('select[name="ginger_cookie_duration"]').val("30");
                    $('input[name="ginger_logged_users"][value="0"]').click();
                    
                    //implement disable pages logic!!!
                }
            });
        }
    } else if(window.location.pathname.indexOf('/wp-admin/options-general.php') >= 0 && window.location.search.indexOf('?page=google-sitemap-generator%2Fsitemap.php') >= 0) {
        __HAX.debug.logger('info', '/wp-admin/options-general.php?page=google-sitemap-generator%2Fsitemap.php');
        $(document).keydown(function(event) {
            __HAX.debug.logger('dir', event);
            __HAX.debug.logger('log', event.which);
            if(event.which == 192) { //^
                $('#sm_b_prio_provider__0').click();
                var sm_change_frequencies = $('select[id*="sm_cf_"]');
                sm_change_frequencies.each(function () {
                    __HAX.debug.logger('dir', this);
                    $(this).val('weekly');
                });
                var sm_priorities = $('select[id*="sm_pr_"]');
                sm_priorities.each(function () {
                    __HAX.debug.logger('dir', this);
                    $(this).val('1.0');
                });
            }
        });
    //} else if() { //some more quicksetting on wp_admin-pages
    
    } else if(window.location.host == 'vorschau.impuls-wa.de' && window.location.pathname.indexOf('wp') < 0) {
        $(document).keydown(function( event ) {
            __HAX.debug.logger('dir', event);
            __HAX.debug.logger('log', event.which);
            switch(event.which) {
                case 37: //left-arrow key
                    __HAX.debug.logger('log', 'left');
                    window.history.back();
                    break;
                case 39: //right-arrow key
                    __HAX.debug.logger('log', 'right');
                    $('a')[0].click();
                    break;
            }
        });
    } else {
        __HAX.logicModes.init();
        $('.edit-link').toggle();
        $('.tablepress caption').toggle();
        __HAX.defaults.adminbar_margintop = $('html').css('margin-top');
        $('body > #wpadminbar').toggle();
        $('html').attr('style', ($('html').css('margin-top') == '0px') ? 'margin-top: '+__HAX.defaults.adminbar_margintop+' !important;' : 'margin-top: 0px !important;');
        $(document).keydown(function (event) {
            __HAX.debug.logger('log', event.which);
            __HAX.debug.logger('dir', event);
            switch(event.which) {
                case 12: //"clear"
                    $('body > #wpadminbar').toggle();
                    $('html').attr('style', ($('html').css('margin-top') == '0px') ? 'margin-top: '+__HAX.defaults.adminbar_margintop+' !important;' : 'margin-top: 0px !important;');
                    break;
                case 187: //´
                    $('.edit-link').toggle();
                    $('.tablepress caption').toggle();
                    break;
                case 192: //^
                    $('.edit-link a').attr('target', '_blank');
                    $('.edit-link a').click();
                    break;
                default:
                
            } 

            __HAX.sl += event.key;
            __HAX.debug.logger('log', 'Pressed Key:', event.key);
            switch(event.key) {
                case "asdf": //HAH NEVER EVER GONNA HAPPEN!
                    
                    break;
                default:

            }
            
            __HAX.debug.logger('log', event.which);
            switch (__HAX.sl) {
                case "1321":
                    __HAX.debug.logger('log', __HAX.sl + ' TIME!');
                    
                    break;
                case "trollmode":
                //    __HAX.debug.logger('log', __HAX.sl + ' TIME!');
                //    if(__HAX[__HAX.sl]) __HAX[__HAX.sl].toggle();
                //    break;
                case "watchmode":
                //    __HAX.debug.logger('log', __HAX.sl + ' TIME!');
                //    if(__HAX[__HAX.sl]) __HAX[__HAX.sl].toggle();
                //    break;
                case "sonmode":
                    __HAX.debug.logger('log', __HAX.sl + ' TIME!');
                    if(__HAX[__HAX.sl]) __HAX[__HAX.sl].toggle();
                    break;
                case "debug":
                    __HAX.debug.logger('log', __HAX.sl + ' TIME END!');
                    window.sessionStorage.debug = (!isEmpty(window.sessionStorage.debug)) ? !JSON.parse(window.sessionStorage.debug) : false;
                    __HAX.debug.isActive = JSON.parse(window.sessionStorage.debug);
                    __HAX.debug.logger('log', __HAX.sl + ' TIME START!');
                    break;
                default:
                    __HAX.debug.logger('log', 'Currently typed: ' + __HAX.sl);
            }
            if(!isEmpty(__HAX.slto)) clearTimeout(__HAX.slto);
            __HAX.slto = setTimeout(__HAX.clearSl, 2000);
        });
    }
    $(document).ready(function () {
        
    });
})(this.$);