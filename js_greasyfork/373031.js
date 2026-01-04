// ==UserScript==
// @name         好友界面添加切换按钮
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  “我的好友”和“谁加我为好友”页面跳转。
// @author       鈴宮華緋
// @include      /https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/user\/.*\/(rev_)?friends/
// @downloadURL https://update.greasyfork.org/scripts/373031/%E5%A5%BD%E5%8F%8B%E7%95%8C%E9%9D%A2%E6%B7%BB%E5%8A%A0%E5%88%87%E6%8D%A2%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/373031/%E5%A5%BD%E5%8F%8B%E7%95%8C%E9%9D%A2%E6%B7%BB%E5%8A%A0%E5%88%87%E6%8D%A2%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    let btn_action_css = {
        'height' : '26px',
        'color' : 'rgb(240, 145, 153)',
        'background-color' : 'white',
        'border' : 'solid 1px rgb(204, 204, 204)',
        'border-bottom' : 'none',
        'border-radius' : '5px 5px 0 0',
        'padding' : '5px 10px',
        'outline' : 'none',
        'cursor' : 'pointer'
    };
    let btn_normal_css = {
        'height' : '26px',
        'color' : 'rgb(240, 145, 153)',
        'background-color' : 'transparent',
        'border' : 'none',
        'padding' : '5px 10px',
        'outline' : 'none',
        'cursor' : 'pointer'
    };
    let _user = $(".avatar").attr("href").match(/user\/(.*)/)[1];
    let _user_name = '';
    // 用户主页的正则表达式
    let _homepageRE = new RegExp("https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/user\/" + _user + "\/friends");
    if(location.href.match(_homepageRE)) {
        _user_name = '我';
    } else {
        _user_name = $('.nameSingle').find('div.inner').children('a').text();
    }
    console.log(_user_name);
    let rev_friend_btn = $('<button></button>');
    rev_friend_btn.text('谁加' + _user_name + '为好友');
    rev_friend_btn.click(function() {
        window.location.href = window.location.href.replace(/\/(rev_)?friend/,'/rev_friend');
    });
    let friend_btn = rev_friend_btn.clone();
    friend_btn.text(_user_name + '的好友');
    friend_btn.click(function() {
        window.location.href = window.location.href.replace(/\/(rev_)?friend/,'/friend');
    });
    if (window.location.pathname.match(/\/friend/)) {
        friend_btn.css(btn_action_css);
        rev_friend_btn.css(btn_normal_css);
    } else if (window.location.pathname.match(/\/rev_friend/)) {
        friend_btn.css(btn_normal_css);
        rev_friend_btn.css(btn_action_css);
    }
    let btn_box = $('<div></div>');
    btn_box.css({
        'width' : '100%',
        'height' : '25px',
        'border-bottom' : 'solid 1px rgb(204, 204, 204)',
        'padding-left' : '10px'
    });
    $('div#columnUserSingle').prepend(btn_box);
    $(btn_box).append(friend_btn);
    $(btn_box).append(rev_friend_btn);
})();