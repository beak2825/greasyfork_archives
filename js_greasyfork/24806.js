// ==UserScript==
// @name         FollowOver
// @namespace    https://www.ekkooff.com/
// @version      1.3.1
// @description  Rollover for user info and follow button.
// @author       Kevin Roberts (@echo)
// @match        https://gab.ai/*
// @include      https://gab.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24806/FollowOver.user.js
// @updateURL https://update.greasyfork.org/scripts/24806/FollowOver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var styles, userInfoPopup, loadingPopup;

    var addToBody = function() {
        $('body').append(styles).append(userInfoPopup).append(loadingPopup);
        if($('body').css('background-color')!=='rgba(0, 0, 0, 0)'&&$('body').css('background-color')!=='transparent') {
            var bgcolor = $('body').css('background-color');
            userInfoPopup.css('background-color',bgcolor);
            loadingPopup.css('background-color',bgcolor);
            $('#followpopup-followback').css('background-color',bgcolor);
        }

        $('#followpopup-follow').click(function() {
            var id = $(this).data('id');
            var d = {};
            if($(this).text()==='Unfollow'||$(this).text()==='Pending') {
                d._method = 'delete';
            }
            var priv = $(this).hasClass('private');
            $.ajax({
                method: 'POST',
                url: '/users/'+id+'/follow',
                data: d
            }).done(function(data) {
                if(data.state==='success') {
                    if(d._method) {
                        $('#followpopup-follow').text('Follow').removeClass().addClass('follow');
                        if($('#followpopup-followback i').hasClass('ion-arrow-swap')) {
                            $('#followpopup-followback i').removeClass().addClass('ion-arrow-left-c');
                        }
                    } else if(!priv) {
                        $('#followpopup-follow').text('Unfollow').removeClass().addClass('unfollow');
                        if($('#followpopup-followback i').hasClass('ion-arrow-left-c')) {
                            $('#followpopup-followback i').removeClass().addClass('ion-arrow-swap');
                        }
                    } else {
                        $('#followpopup-follow').text('Pending').removeClass().addClass('pending');
                    }

                    if(priv) {
                        $('#followpopup-follow').addClass('private');
                    }
                }
            });
            return false;
        });

    };

    var init = function() {
        if(!window.hasOwnProperty('$')) {
            setTimeout(init,100);
            return;
        }
        var timeout=null;
        var timeout2=null;
        var id=null;

        //addToBody();

        styles = $('<style type="text/css">\n\
#followpopup {\n\
  font-family: freight-sans-pro!important;\n\
  background-color:white;\n\
  position:absolute;\n\
  z-index:10000;\n\
  display:none;\n\
  height:140px;\n\
  width:500px;\n\
  padding:4px;\n\
  border:1px solid #666;\n\
  border-radius:5px;\n\
}\n\
#followpopup-loading {\n\
  position: absolute;\n\
  z-index: 9999;\n\
}\n\
#followpopup-loading .spinning {\n\
  display: inline-block;\n\
  animation-name: spin;\n\
  animation-duration: 1500ms;\n\
  animation-iteration-count: infinite;\n\
  animation-timing-function: linear;\n\
}\n\
\n\
#followpopup-head {\n\
  text-align: center;\n\
  margin-bottom:3px;\n\
}\n\
#followpopup-head span {\n\
  padding-right:5px;\n\
}\n\
\n\
#followpopup-bio {\n\
  height: 82px;\n\
  overflow: hidden;\n\
  word-wrap: break-word;\n\
  -ms-word-break: break-all;\n\
  overflow-wrap: break-word;\n\
  word-break: break-word;\n\
  text-overflow: ellipsis;\n\
  margin-bottom:5px;\n\
}\n\
\n\
#followpopup-info {\n\
  border: 1px solid #edeeee;\n\
  overflow:hidden;\n\
  white-space: nowrap;\n\
  text-overflow: ellipsis;\n\
  border-radius:4px;\n\
  display:block;\n\
  width:100%;\n\
  height: 28px;\n\
  position:relative;\n\
}\n\
\n\
#followpopup-follow {\n\
  right:0;\n\
  position:absolute;\n\
  width:55px;\n\
  color: white;\n\
  text-decoration: none;\n\
  padding: 5px 10px;\n\
  display: inline-block;\n\
}\n\
\n\
#followpopup-info span {\n\
  border-right: 1px solid #edeeee;\n\
  padding: 3px;\n\
  display: inline-block;\n\
}\n\
\n\
#followpopup #followpopup-followback {\n\
  background-color: white;\n\
  right:75px;\n\
  position:absolute;\n\
  padding-right: 6px;\n\
  height: 100%;\n\
}\n\
\n\
#followpopup .follow {\n\
  background: #34cf7f;\n\
}\n\
\n\
#followpopup .unfollow {\n\
  background: red;\n\
}\n\
\n\
#followpopup .pending {\n\
  background: #edeeee;\n\
  color: #000;\n\
}\n\
\n\
#followpopup .empty {\n\
  background: transparent;\n\
}\n\
#followpopup .ion-checkmark-circled.verified-badge {\n\
  background:transparent;\n\
  color:#33f!important;\n\
}\n\
\n\
</style>');


        userInfoPopup = $('<div id="followpopup">\
<div id="followpopup-head">\
<strong><span id="followpopup-name"></span></strong>\
<span id="followpopup-username"></span>\
</div>\
<div id="followpopup-bio"></div>\
<div id="followpopup-info">\
?<span id="followpopup-score"></span>\
<span id="followpopup-posts"></span>\
<span id="followpopup-followers"></span>\
<span id="followpopup-following"></span>\
<span id="followpopup-followback"></span>\
<a href="#" id="followpopup-follow"></a>\
</div>\
</div>');

        loadingPopup = $('<div id="followpopup-loading"><i class="ion-load-c spinning"> </i></div>');

        var targets = 'a.post__meta__name__full, a.post__meta__name__username, .notification-list .notification-list__item__message div:first-child span a:first-child, .notification-list__item__users a, a.notification-list__item__mention__name, a.notification-list__item__mention__username, a.inner-post-mention, a.profile-badge__name, a.profile-badge__username';
        var nameTarget = 'span.mini-user-list__item__name';
        var usernameTarget = 'span.mini-user-list__item__username';
        var allTargets = targets+', '+nameTarget+', '+usernameTarget;

        var populatePopup = function(data,css) {
            id = data.id;
            if(!$('#followpopup').length) addToBody();
            $('#followpopup-name').html(data.name+(data.verified?' <i class="ion-checkmark-circled verified-badge"></i>':''));
            $('#followpopup-username').text('@'+data.username);
            $('#followpopup-bio').text(data.bio);
            $('#followpopup-score').text(data.score);
            $('#followpopup-posts').text(data.post_count+' posts');
            $('#followpopup-followers').text(data.follower_count+' followers');
            $('#followpopup-following').text(data.following_count+' following');
            if(data.followed) {
                if(data.following) {
                    $('#followpopup-followback').html('<i class="ion-arrow-swap"></i>');
                } else {
                    $('#followpopup-followback').html('<i class="ion-arrow-left-c"></i>'+(data.is_accessible?'':'?'));
                }
            } else {
                $('#followpopup-followback').html((data.is_accessible?'':'?'));
            }
            $('#followpopup-follow').data('id',id);
            if(authUser.username!=data.username) {
                if(data.follow_pending) {
                    $('#followpopup-follow').text('Pending').removeClass().addClass('pending');
                } else if(!data.following) {
                    $('#followpopup-follow').text('Follow').removeClass().addClass('follow');
                } else {
                    $('#followpopup-follow').text('Unfollow').removeClass().addClass('unfollow');
                }
            } else {
                $('#followpopup-follow').text('').removeClass().addClass('empty');
            }
            if(data.is_private) {
                $('#followpopup-follow').addClass('private');
            }
            userInfoPopup.css(css).show();
        };

        var getUserInfo = function(name,e) {
            clearTimeout(timeout);
            var offset = $(e.currentTarget).offset();
            var offset2 = $(e.currentTarget.parentElement).offset();
            var height = $(window).height();
            var width = $(window).width();
            var css = {
                top:((e.clientY<(height/2))?offset.top+25:offset.top-160)+'px',
                left:(((width-515)>offset2.left)?offset2.left:width-515)+'px'
            };
            var loadingCss = {
                top: ((e.clientY<(height/2))?offset.top+25:offset.top-25)+'px',
                left: offset.left
            };
            loadingPopup.css(loadingCss).show();
            $.ajax({
                method: 'GET',
                url: '/users/'+name,
                headers: {
                    'Authorization': 'Bearer '+window.storage.id_token
                }
            }).done(function(data) {
                loadingPopup.hide();
                populatePopup(data,css);
            }).error(function(data) {
                loadingPopup.hide();
            });
        };

        $('body').on('mouseenter',targets ,function(e){
            clearTimeout(timeout);
            clearTimeout(timeout2);
            var name = e.currentTarget.href.substr(e.currentTarget.href.lastIndexOf('/')+1);
            timeout2 = setTimeout(function() {
                getUserInfo(name,e);
            },500);
        }).on('mouseenter',nameTarget,function(e) {
            clearTimeout(timeout);
            clearTimeout(timeout2);
            var name = $(e.currentTarget).next().text().substring(1);
            timeout2 = setTimeout(function() {
                getUserInfo(name,e);
            },500);
        }).on('mouseenter',usernameTarget,function(e) {
            clearTimeout(timeout);
            clearTimeout(timeout2);
            var name = $(e.currentTarget).text().substring(1);
            timeout2 = setTimeout(function() {
                getUserInfo(name,e);
            },500);
        }).on('click',allTargets,function(e){
            clearTimeout(timeout);
            clearTimeout(timeout2);
            userInfoPopup.hide();
        }).on('mouseleave',allTargets,function(){
            clearTimeout(timeout2);
            timeout = setTimeout(function(){
                loadingPopup.hide();
                userInfoPopup.hide();
            }, 650);
        });

        (function(history){
            var pushState = history.pushState;
            history.pushState = function(state) {
                if (typeof history.onpushstate == "function") {
                    history.onpushstate({state: state});
                }
                clearTimeout(timeout);
                clearTimeout(timeout2);
                userInfoPopup.hide();
                return pushState.apply(history, arguments);
            };
        })(window.history);

        userInfoPopup.mouseenter(function() {
            clearTimeout(timeout);
            clearTimeout(timeout2);
            loadingPopup.hide();
        }).mouseleave(function() {
            clearTimeout(timeout2);
            timeout = setTimeout(function() {
                loadingPopup.hide();
                userInfoPopup.hide();
            }, 650);
        });
    };

    window.addEventListener('load',init,false);
})();