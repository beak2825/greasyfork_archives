// ==UserScript==
// @name         Турбо Улитки (Hack)
// @version      0.2
// @author       Олег mZer0ne Филиппов (https://vk.com/mZer0ne)
// @match        *://3m3.ru/apps/zhuki/*
// @grant        none
// @description  none
// @namespace https://greasyfork.org/users/64211
// @downloadURL https://update.greasyfork.org/scripts/22950/%D0%A2%D1%83%D1%80%D0%B1%D0%BE%20%D0%A3%D0%BB%D0%B8%D1%82%D0%BA%D0%B8%20%28Hack%29.user.js
// @updateURL https://update.greasyfork.org/scripts/22950/%D0%A2%D1%83%D1%80%D0%B1%D0%BE%20%D0%A3%D0%BB%D0%B8%D1%82%D0%BA%D0%B8%20%28Hack%29.meta.js
// ==/UserScript==
var config = {
    'run_money': 222, // Max 222
    'run_ruby': 10 // Max 10
};

(function() {
    'use strict';
    $(document).on('keydown', function(e) {
        if ($page=='run') {
            // досрочно завершаем гонку первыми, и получаем наши бонусы
            if (e.keyCode == 80) {
                var i = 2;
                for (var key in $snail){
                    if ( $app['viewer_id'] == $snail[key]['id'] ){
                        $snail[key]['money'] = config['run_money'];
                        $snail[key]['ruby'] = config['run_ruby'];
                        $snail[key]['place'] = 1;
                    } else {
                        $snail[key]['place'] = i;
                    }
                    i++;
                }
                end_run_post();
            }
        }
    });
})();