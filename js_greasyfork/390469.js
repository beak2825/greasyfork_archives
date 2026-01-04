// ==UserScript==
// @name         Tower Rest（休息一下）
// @namespace    https://tower.im/
// @version      1.3
// @description  更优雅的使用Tower
// @author       veking
// @match        https://tower.im/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/390469/Tower%20Rest%EF%BC%88%E4%BC%91%E6%81%AF%E4%B8%80%E4%B8%8B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/390469/Tower%20Rest%EF%BC%88%E4%BC%91%E6%81%AF%E4%B8%80%E4%B8%8B%EF%BC%89.meta.js
// ==/UserScript==
$.noConflict();
(function($) {
    var MyTower = {
        init: function() {
            this.rest();
        },
        rest: function() {
            var obj = this.getRestElement();
            var btn = $('.btn', obj);
            btn.unbind('click').click(function(){
                obj.fadeOut();
                $('.container, #link-to-help, .footer').animate({opacity: 0}, 500);
                MyTower.work();
            });
        },
        work: function() {
            var obj = this.getWorkElement();
            var btn = $('.btn', obj);
            btn.unbind('click').click(function(){
                obj.fadeOut();
                $('.container, #link-to-help, .footer').animate({opacity: 1}, 500);
                MyTower.rest();
            });
        },
        changeBg: function() {
            //TODO
        },
        getRestElement: function() {
            var id = '__rest__';
            var obj = $('#'+id);
            if (!obj.length) {
                var html = '<div id="'+id+'" style="position:fixed;top:50%;right:0;width:45px;">';
                html += '<a class="btn" href="#" style="background-color:#5cb85c;border-color:#3e8f3e;font-size:16px;">休息一下</a>';
                html += '</div>';
                $('.wrapper').append(html);
                obj = $('#'+id);
                obj.css('margin-top', '-'+obj.height() / 2+'px');
            } else {
                obj.fadeIn('slow');
            }
            return obj;
        },
        getWorkElement: function() {
            var id = '__work__';
            var obj = $('#'+id);
            if (!obj.length) {
                var html = '<div id="'+id+'" style="position:fixed;top:50%;right:0;width:45px;">';
                html += '<a class="btn" href="#" style="background-color:#337ab7;border-color:#245580;font-size:16px;">继续工作</a>';
                html += '</div>';
                $('.wrapper').append(html);
                obj = $('#'+id);
                obj.css('margin-top', '-'+obj.height() / 2+'px');
            } else {
                obj.fadeIn('slow');
            }
            return obj;
        }
    };
    MyTower.init();
})(jQuery);