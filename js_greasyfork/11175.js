// ==UserScript==
// @name           hwm_work_at_home
// @author         Kopatych
// ==UserScript==
// @name work_hwm
// @description work
// @author Kopatych
// @license MIT
// @version 1.0.2
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// @include        http://www.heroeswm.ru/*
// @include        http://qrator.heroeswm.ru/*
// @include        http://178.248.235.15/*
// @include        http://www.lordswm.com/*
// @namespace https://greasyfork.org/users/13597
// @downloadURL https://update.greasyfork.org/scripts/11175/hwm_work_at_home.user.js
// @updateURL https://update.greasyfork.org/scripts/11175/hwm_work_at_home.meta.js
// ==/UserScript==

(function (window, undefined) {
    jQuery.ajaxSetup({async:false});
    var url_cur = location.href;
    var url = 'http://'+location.hostname+'/'
    var w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow
    } else {
        w = window;
    }

    if (w.self != w.top) {
        return;
    }
    
    var appendEmployeement = function(type)
    {
        $.get(url + 'map.php?st='+type,
             {},
             function(html) {
                      var html = $(html);
		      html.encoding = 'windows-125';
                      var factories = null;;
                      var factories = html.find('table .wb tbody tr');
                      workBlock.append(factories);
                      $('.work-space tr .wblight').remove();
                      $('.work-space tr:contains(Тип)').remove();
                      $('.work-space tr:contains(Type)').remove();
            });
    }
    if (/\/home.php/.test(location.href)) {
        if (!this.GM_addStyle || (this.GM_addStyle.toString 
			&& this.GM_addStyle.toString().indexOf("not supported") > -1)
		) {
            $('td [width = 55%]').append('</br><div id="workbench-button">' + 
										'» Свободные предприятия</div>' +
										'<div class="wb-container">' +
										'<table class = "work-space wb"></table></div>');
            
			var workBlock = $('.work-space');
            
            appendEmployeement('mn');
            appendEmployeement('fc');
            appendEmployeement('sh')
            $("#workbench-button").css({'cursor':'pointer', 'padding-left':'4px', 'font-size':'1.2em'});
            if ($('body:contains(Вы нигде не работаете)')[0]  === undefined 
				&& $('body:contains(You are currently unemployed)')[0]  ===undefined
			)	{
                $('.wb-container').hide();
            }
        };
        
        $("#workbench-button").click(function(){
            $('.wb-container').slideToggle(200);
        });
    }
})(window);