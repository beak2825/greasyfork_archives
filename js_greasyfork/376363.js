// ==UserScript==
// @name           hwm_time_restore
// @author         Demin
// @namespace      Demin_92571
// @description    Таймеры гильдии рабочих, воров, наёмников, рейнджеров, охотников, кузнецов, восстановления здоровья и маны
// @homepage       https://greasyfork.org/users/1602-demin
// @icon           http://i.imgur.com/LZJFLgt.png
// @version        5.12
// @encoding 	   utf-8
// @include        /^https{0,1}:\/\/((www|qrator)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/.+/
// @exclude        /^https{0,1}:\/\/((www|qrator)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(login|cgame|frames|chat|chatonline|ch_box|chat_line|ticker|chatpost|rightcol|brd|frames)\.php.*/
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_log
// @grant          GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/376363/hwm_time_restore.user.js
// @updateURL https://update.greasyfork.org/scripts/376363/hwm_time_restore.meta.js
// ==/UserScript==

// (c) 2010-2015, demin  ( http://www.heroeswm.ru/pl_info.php?id=15091 )
// (c) 2008-2009, xo4yxa
// (c) 2017, перф. 10.10.2017 v.5.8: *вместо nick привзяка к id_payler из рекордов охоты; изменение алгоритма получения уровня здоровья.

(function() {

    if (typeof GM_deleteValue != 'function') {
        this.GM_getValue=function (key,def) {return localStorage[key] || def;};
        this.GM_setValue=function (key,value) {return localStorage[key]=value;};
        this.GM_deleteValue=function (key) {return delete localStorage[key];};
    }

    var url_cur = location.href;
    var url = location.protocol+'//'+location.hostname+'/';


    // pers v boju (и не ГЛ)
    if ( location.pathname=='/war.php' && /warlog\|0/.exec(document.querySelector("html").innerHTML) && !/btype\|127/.exec(document.querySelector("html").innerHTML)) {
        GM_setValue( "92571_hwm_war_unload_"+location.hostname, 'true' );
    }

    var nick = "92571_";
    var army_percent = 0;
    var vh = document.getElementById('heart');
    if (vh) {
        if (vh.parentNode.innerHTML.match(/var heart=(\d+);/)) {army_percent = RegExp.$1;}
    }
    if (document.body.innerHTML.match (/pl_hunter_stat\.php\?id=(\d+)/)) { nick = "92571_" + RegExp.$1 + "_"; }

    // link to img    http://dcdn.heroeswm.ru/i/top/line/lpart.jpg    i/top_ny_rus/line/lpart_.jpg    i/top_ny_eng/line/
    var img_link = document.querySelector("img[src*='i/top'][src*='/line/t_end']");


    var b = document.querySelector("body");
    var x1 = document.querySelector("img[src*='i/top'][src*='/dragon__left']");
    var x2 = document.querySelector("img[src*='i/top'][src*='/dragon__right']");


    if ( b && img_link && nick && x1 ) {

        //nick = encodeURIComponent(nick);

        var _i = /(\S*\/line\/)/.exec(img_link.src)[1];
        var _i_ = '';
        // if new year
        if ( document.querySelector("img[src*='i/top_ny']") ) { _i_ = '_'; }

        var time_cur = new Date().getTime();
        var time = { h: 0, m: 0, w: 0, gn: 0, gv: 0, go: 0, sm: 0 }


        var hwmtimerestore = GM_getValue( nick+"hwmtimerestore" );
        if ( !hwmtimerestore ) hwmtimerestore = '{"hwm_time_health_alert":"no", "hwm_time_work_alert":"yes", "hwm_time_work_end_yes":"yes", "hwm_time_work_end":"1300000000000", "hwm_time_work_trudogolik":"0", "hwm_time_sm_alert":"yes", "hwm_time_sm_end_yes":"yes", "hwm_time_sm_end":"1300000000000", "hwm_time_gn_alert":"yes", "hwm_time_gn_end_yes":"yes", "hwm_time_gn_end":"1300000000000", "hwm_time_go_alert":"yes", "hwm_time_go_end_yes":"yes", "hwm_time_go_end":"1300000000000", "hwm_map_hunter":"false", "hwm_time_gv_alert":"yes", "hwm_time_gv_end_yes":"yes", "hwm_time_gv_end":"1300000000000", "hwm_map_thief_ambush":"false", "hwm_time_percent_faster":"1", "hwm_time_percent_prem":"1", "hwm_time_percent_prem_exp":"1300000000000", "hwm_time_percent_prem_title":"", "hwm_time_percent_lic_mo":"1", "hwm_time_percent_lic_mo_exp":"1300000000000", "hwm_time_percent_lic_mo_title":"", "hwm_gv_or_gre":"0", "hwm_gre_check":"0", "hwm_time_work_trudogolik_show":"1", "hwm_time_work_trudogolik_off":"0", "hwm_gr_show_check":"1", "hwm_gk_show_check":"1", "hwm_gn_show_check":"1", "hwm_go_show_check":"1", "hwm_gv_show_check":"1", "hwm_go_timer_hide":"1", "object_id":""}';
        hwmtimerestore = JSON.parse( hwmtimerestore );
        //alert( GM_getValue( nick+"hwmtimerestore" ) );


        // + txt

        if ( url.match('lordswm') ) {

            var health_alert_ty = 'Army restore alarm on';
            var health_alert_tn = 'Alarm once at army restore';

            var work_alert_ty = 'Workshift alarm on';
            var work_alert_tn = 'Alarm off';

            var sm_alert_ty = 'Blacksmith alarm on';

            var gn_alert_ty = 'Mercenaries Guild alarm on';

            var regexp_timegn0 = /Come back in (\d+) minutes\./;
            var regexp_timegn1 = /\. Time left: (\d+) minutes\./;
            var regexp_timegn2 = /ou have (\d+) minutes left/;
            var regexp_timegn3 = /\. Time left: (\d+) minutes\./;
            var regexp_timegn4 = /still have (\d+) minutes/;
            var regexp_timegn5 = /you still have \d+ attempts and (\d+) minutes/;

            var regexp_gn_rep = /Reputation: <b>([\d\.]+)/;

            var go_alert_ty = 'Hunters Guild alarm on';
            var regexp_go_timer = 'Next hunt available in';

            var gv_alert_ty = 'Thieves Guild alarm on';

            var gre_alert_ty = 'Rangers Guild alarm on';

            var regexp_timegre = /Come in (\d+) min/;

            var time_home = /You may enroll again in (\d+) min/;
            var time_home2 = / since (\d+):(\d+)<\/td>/;

            var alert_health = 'Troops ready: 100%';
            var alert_work = 'LG: You may enroll again';
            var alert_sm = 'BS: Blacksmith works are finished';
            var alert_gn = 'MG: Mercenaries Guild has a quest for you';
            var alert_go = 'HG: You notice traces ...';
            var alert_gv = 'TG: You may set an ambush';
            var alert_gre = 'RG: Rangers Guild has a quest for you';

            var gr_t = 'LG';
            var gr_title = '';
            var gk_t = 'BS';
            var gk_title = 'To Blacksmith';
            var gn_t = 'MG';
            var gn_title = 'To Mercenaries\' Guild';
            var go_t = 'HG';
            var go_title = 'To Hunters\' Guild';
            var gv_t = 'TG';
            var gv_title = 'To Thieves\' Guild';
            var gre_t = 'RG';
            var gre_title = 'To Rangers Guild post';
            var mana_title = 'Settings';

            var work_obj_do = 'You have successfully enrolled';
            var work_unemployed = 'You are currently unemployed';
            var regexp_map_go = 'During the journey you have access to the';
            var go_title_lic = 'The license expires ';
            var alert_go_lic_exp = 'HG: Hunter license has expired';
            var alert_prem_exp = 'Abu-Bakir\'s Charm has expired';

            var workaholic_penalty = 'Workaholic penalty';
            var workaholic_penalty_regexp = 'workaholic penalty';

            var regexp_sm = /Completion time: (\d+)-(\d+) (\d+):(\d+)/;

        } else {

            var health_alert_ty = '\u0411\u0443\u0434\u0435\u0442 \u043F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435 \u043E \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0438 \u0430\u0440\u043C\u0438\u0438';
            var health_alert_tn = '\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0435\u0434\u0438\u043D\u043E\u0440\u0430\u0437\u043E\u0432\u043E \u043F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435 \u043E \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0438 \u0430\u0440\u043C\u0438\u0438';

            var work_alert_ty = '\u0411\u0443\u0434\u0435\u0442 \u043f\u0440\u0435\u0434\u0443\u043f\u0440\u0435\u0436\u0434\u0435\u043d\u0438\u0435 \u043e \u043a\u043e\u043d\u0446\u0435 \u0440\u0430\u0431\u043e\u0447\u0435\u0433\u043e \u0447\u0430\u0441\u0430';
            var work_alert_tn = '\u041d\u0435 \u0431\u0443\u0434\u0435\u0442 \u043f\u0440\u0435\u0434\u0443\u043f\u0440\u0435\u0436\u0434\u0435\u043d\u0438\u044f';

            var sm_alert_ty = '\u0411\u0443\u0434\u0435\u0442 \u043f\u0440\u0435\u0434\u0443\u043f\u0440\u0435\u0436\u0434\u0435\u043d\u0438\u0435 \u043e \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0438\u0438 \u0440\u0430\u0431\u043e\u0442 \u0432 \u041a\u0443\u0437\u043d\u0438\u0446\u0435';

            var gn_alert_ty = '\u0411\u0443\u0434\u0435\u0442 \u043f\u0440\u0435\u0434\u0443\u043f\u0440\u0435\u0436\u0434\u0435\u043d\u0438\u0435 \u0413\u0438\u043b\u044c\u0434\u0438\u0438 \u041d\u0430\u0435\u043c\u043d\u0438\u043a\u043e\u0432';

            var regexp_timegn0 = /\u041f\u0440\u0438\u0445\u043e\u0434\u0438 \u0447\u0435\u0440\u0435\u0437 (\d+) \u043c\u0438\u043d/;
            var regexp_timegn1 = /\u041e\u0441\u0442\u0430\u043b\u043e\u0441\u044c \u0432\u0440\u0435\u043c\u0435\u043d\u0438: (\d+) \u043c\u0438\u043d\u0443\u0442/;
            var regexp_timegn2 = /\u0442\u0435\u0431\u044f \u043e\u0441\u0442\u0430\u043b\u043e\u0441\u044c (\d+) \u043c\u0438\u043d\u0443\u0442/;
            var regexp_timegn3 = /\u0443 \u0442\u0435\u0431\u044f \u0435\u0449\u0435 \u0435\u0441\u0442\u044c (\d+) \u043c\u0438\u043d\u0443\u0442/;
            var regexp_timegn4 = /\. \u041e\u0441\u0442\u0430\u043b\u043e\u0441\u044c (\d+) \u043c\u0438\u043d\u0443\u0442\./;
            var regexp_timegn5 = /\u043e\u0441\u0442\u0430\u043b\u043e\u0441\u044c \d+ \u043f\u043e\u043f\u044b\u0442\u043e\u043a \u0438 (\d+) \u043c\u0438\u043d\u0443\u0442/;
            var regexp_gn_rep = /\u0420\u0435\u043F\u0443\u0442\u0430\u0446\u0438\u044F: <b>([\d\.]+)/;

            var go_alert_ty = '\u0411\u0443\u0434\u0435\u0442 \u043f\u0440\u0435\u0434\u0443\u043f\u0440\u0435\u0436\u0434\u0435\u043d\u0438\u0435 \u0413\u0438\u043b\u044c\u0434\u0438\u0438 \u041e\u0445\u043e\u0442\u043d\u0438\u043a\u043e\u0432';
            var regexp_go_timer = '\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u043E\u0445\u043E\u0442\u0430 \u0431\u0443\u0434\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u0447\u0435\u0440\u0435\u0437';

            var gv_alert_ty = '\u0411\u0443\u0434\u0435\u0442 \u043f\u0440\u0435\u0434\u0443\u043f\u0440\u0435\u0436\u0434\u0435\u043d\u0438\u0435 \u0413\u0438\u043b\u044c\u0434\u0438\u0438 \u0412\u043e\u0440\u043e\u0432';

            var gre_alert_ty = '\u0411\u0443\u0434\u0435\u0442 \u043f\u0440\u0435\u0434\u0443\u043f\u0440\u0435\u0436\u0434\u0435\u043d\u0438\u0435 \u0413\u0438\u043b\u044c\u0434\u0438\u0438 \u0420\u0435\u0439\u043D\u0434\u0436\u0435\u0440\u043E\u0432';

            var regexp_timegre = /\u043f\u0440\u0438\u0445\u043e\u0434\u0438 \u0447\u0435\u0440\u0435\u0437 (\d+) \u043c\u0438\u043d/;

            var time_home = /\u0412\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u0443\u0441\u0442\u0440\u043e\u0438\u0442\u044c\u0441\u044f \u043d\u0430 \u0440\u0430\u0431\u043e\u0442\u0443 \u0447\u0435\u0440\u0435\u0437 (\d+)/;
            var time_home2 = / \u0441 (\d+):(\d+)<\/td>/;

            var alert_health = '\u0413\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u044C \u0430\u0440\u043C\u0438\u0438: 100%';
            var alert_work = '\u0413\u0420: \u041f\u043e\u0440\u0430 \u043d\u0430 \u0440\u0430\u0431\u043e\u0442\u0443';
            var alert_sm = '\u0413\u041a: \u0420\u0430\u0431\u043e\u0442\u0430 \u0432 \u041a\u0443\u0437\u043d\u0438\u0446\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0430';
            var alert_gn = '\u0413\u041d: \u0414\u043b\u044f \u0412\u0430\u0441 \u0435\u0441\u0442\u044c \u0437\u0430\u0434\u0430\u043d\u0438\u0435 \u0432 \u0413\u0438\u043b\u044c\u0434\u0438\u0438 \u041d\u0430\u0435\u043c\u043d\u0438\u043a\u043e\u0432';
            var alert_go = '\u0413\u041e: \u0412\u044B \u0443\u0432\u0438\u0434\u0435\u043B\u0438 \u0441\u043B\u0435\u0434\u044B ...';
            var alert_gv = '\u0413\u0412: \u0412\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u0443\u0441\u0442\u0440\u043e\u0438\u0442\u044c \u0437\u0430\u0441\u0430\u0434\u0443';
            var alert_gre = '\u0413\u0420\u0436: \u0415\u0441\u0442\u044C \u0437\u0430\u0434\u0430\u043D\u0438\u0435 \u0432 \u0413\u0438\u043B\u044C\u0434\u0438\u0438 \u0420\u0435\u0439\u043D\u0434\u0436\u0435\u0440\u043E\u0432';

            var gr_t = '\u0413\u0420';
            var gr_title = '';
            var gk_t = '\u0413\u041a';
            var gk_title = '\u0412 \u041a\u0443\u0437\u043d\u0438\u0446\u0443';
            var gn_t = '\u0413\u041d';
            var gn_title = '\u0412 \u0437\u0434\u0430\u043d\u0438\u0435 \u0413\u0438\u043b\u044c\u0434\u0438\u0438 \u041d\u0430\u0435\u043c\u043d\u0438\u043a\u043e\u0432';
            var go_t = '\u0413\u041e';
            var go_title = '\u0412 \u0437\u0434\u0430\u043d\u0438\u0435 \u0413\u0438\u043b\u044c\u0434\u0438\u0438 \u041e\u0445\u043e\u0442\u043d\u0438\u043a\u043e\u0432';
            var gv_t = '\u0413\u0412';
            var gv_title = '\u0412 \u0437\u0434\u0430\u043d\u0438\u0435 \u0413\u0438\u043b\u044c\u0434\u0438\u0438 \u0412\u043e\u0440\u043e\u0432';
            var gre_t = '\u0413\u0420\u0436';
            var gre_title = '\u0412 \u0437\u0434\u0430\u043d\u0438\u0435 \u0413\u0438\u043b\u044c\u0434\u0438\u0438 \u0420\u0435\u0439\u043D\u0434\u0436\u0435\u0440\u043E\u0432';
            var mana_title = 'Настройки';

            var work_obj_do = '\u0412\u044b \u0443\u0441\u0442\u0440\u043e\u0435\u043d\u044b \u043d\u0430 \u0440\u0430\u0431\u043e\u0442\u0443';
            var work_unemployed = '\u0412\u044B \u043D\u0438\u0433\u0434\u0435 \u043D\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442\u0435';
            var regexp_map_go = '\u0412\u043E \u0432\u0440\u0435\u043C\u044F \u043F\u0443\u0442\u0438 \u0412\u0430\u043C \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B';
            var go_title_lic = '\u041B\u0438\u0446\u0435\u043D\u0437\u0438\u044F \u0438\u0441\u0442\u0435\u043A\u0430\u0435\u0442 ';
            var alert_go_lic_exp = '\u0413\u041e: \u041B\u0438\u0446\u0435\u043D\u0437\u0438\u044F \u043E\u0445\u043E\u0442\u043D\u0438\u043A\u0430 \u0438\u0441\u0442\u0435\u043A\u043B\u0430';
            var alert_prem_exp = '\u0411\u043B\u0430\u0433\u043E\u0441\u043B\u043E\u0432\u0435\u043D\u0438\u0435 \u0410\u0431\u0443-\u0411\u0435\u043A\u0440\u0430 \u0438\u0441\u0442\u0435\u043A\u043B\u043E';

            var workaholic_penalty = '\u0428\u0442\u0440\u0430\u0444 \u0442\u0440\u0443\u0434\u043E\u0433\u043E\u043B\u0438\u043A\u0430';
            var workaholic_penalty_regexp = '\u0448\u0442\u0440\u0430\u0444 \u0442\u0440\u0443\u0434\u043E\u0433\u043E\u043B\u0438\u043A\u0430';

            var regexp_sm = /\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u0435 \u0440\u0430\u0431\u043E\u0442\u044B: (\d+)-(\d+) (\d+):(\d+)/;

        }

        var regexp_time_server = /(\d+):(\d+), \d+ online/;
        var regexp_time_server2 = /(\d+):(\d+):(\d+), \d+ online/;
        var regexp_lic_mo = /(\d+)-(\d+)-(\d+) (\d+):(\d+)/;
        var regexp_prem = /(\d+)-(\d+)-(\d+) (\d+):(\d+)/;

        var sm_alert_tn = work_alert_tn;
        var gn_alert_tn = work_alert_tn;
        var go_alert_tn = work_alert_tn;
        var gv_alert_tn = work_alert_tn;
        var gre_alert_tn = work_alert_tn;
        var gv_tit = '/thief_guild.php';
        var gre_tit = '/ranger_guild.php';

        // - txt


        if ( hwmtimerestore["hwm_gv_or_gre"] == '1' ) {
            alert_gv = alert_gre;
            gv_alert_ty = gre_alert_ty;
            gv_alert_tn = gre_alert_tn;
            gv_t = gre_t;
            gv_title = gre_title;
            gv_tit = gre_tit;
        }


        if ( hwmtimerestore["hwm_time_percent_lic_mo_title"] ) {

            if ( Number( hwmtimerestore["hwm_time_percent_lic_mo_exp"] ) > time_cur )
            {
                go_title += '\n' + go_title_lic + hwmtimerestore["hwm_time_percent_lic_mo_title"];
            }
            else
            {
                // licenzija ohotnika istekla
                setTimeout(function() { prompt( alert_go_lic_exp ); }, 300);

                hwmtimerestore["hwm_time_percent_lic_mo"] = '1';
                hwmtimerestore["hwm_time_percent_lic_mo_exp"] = '1300000000000';
                hwmtimerestore["hwm_time_percent_lic_mo_title"] = '';
            }
        }


        var d = document.createElement('div');
        d.setAttribute('style', 'position: absolute; margin: -26px 0px 0px -43px; text-align: center;');
        d.innerHTML =
            '<style>' +
            '.hwm_tb * {font-size: 11px; color: #f5c137;}' +
            '.hwm_tb_cell {border-collapse: collapse; background-color: #6b6b69;}' +
            '.hwm_tb_cell TD {padding: 0px;}' +
            '.cell_t {height: 3px; background: url('+_i+'t_top_bkg'+_i_+'.jpg);}' +
            '.cell_c {white-space: nowrap; height: 18px; background: url('+_i+'t_com_bkg'+_i_+'.jpg); font-weight: bold;}' +
            '.cell_b {height: 5px; background: url('+_i+'t_bot_bkg'+_i_+'.jpg); text-align: center;}' +
            '.cell_b IMG {width: 17px; height: 5px;}' +
            '</style>' +

            '<table cellpadding=0 cellspacing=0 align="center" class="hwm_tb" width=' + ( x2.getBoundingClientRect().left - x1.getBoundingClientRect().left + 124 ) + 'px>' +
            '<tr height=26>' +
            '<td>' +

            '<table width="100%" cellpadding=0 cellspacing=0 style="background: url('+_i+'t_bkg'+_i_+'.jpg);">' +
            '<tr valign=middle align=center>' +

            '<td width=5 style="overflow: hidden;"><img src="'+_i+'t_end'+_i_+'.jpg" alt="" width=9 height=26 style="margin:0px 0px 0px -4px;"></td>' +

            '<td width=44>' +
            '<table class="hwm_tb_cell">' +
            '<tr><td class="cell_t"></td></tr>' +
            '<tr>' +
            '<td class="cell_c" style="cursor:pointer" id="pers_h">00:00</td>' +
            '</tr>' +
            '<tr><td class="cell_b"><img src="'+_i+'t_center'+_i_+'.jpg"></td></tr>' +
            '</table>' +
            '</td>' +

            '<td width=9><img src="'+_i+'t_end'+_i_+'.jpg" alt="" width=9 height=26></td>' +

            '<td id="gr_show1">' +
            '<table class="hwm_tb_cell">' +
            '<tr><td class="cell_t"></td></tr>' +
            '<tr>' +
            '<td class="cell_c"><span style="cursor:pointer" id="a_pers_w">'+gr_t+'</span>: <a href="javascript:void(0);" title="'+gr_title+'" style="text-decoration: none;" id="pers_w">00:00</a></td>' +
            '</tr>' +
            '<tr><td class="cell_b"><img src="'+_i+'t_center'+_i_+'.jpg"></td></tr>' +
            '</table>' +
            '</td>' +

            '<td id="gr_show2" width=9><img src="'+_i+'t_end'+_i_+'.jpg" alt="" width=9 height=26></td>' +

            '<td id="gk_show1">' +
            '<table class="hwm_tb_cell">' +
            '<tr><td class="cell_t"></td></tr>' +
            '<tr>' +
            '<td class="cell_c"><span style="cursor:pointer" id="a_pers_sm">'+gk_t+'</span>: <a href="/mod_workbench.php?type=repair" title="'+gk_title+'" style="text-decoration: none;" id="pers_sm">00:00</a></td>' +
            '</tr>' +
            '<tr><td class="cell_b"><img src="'+_i+'t_center'+_i_+'.jpg"></td></tr>' +
            '</table>' +
            '</td>' +

            '<td id="gk_show2" width=9><img src="'+_i+'t_end'+_i_+'.jpg" alt="" width=9 height=26></td>' +

            '<td id="gn_show1">' +
            '<table class="hwm_tb_cell">' +
            '<tr><td class="cell_t"></td></tr>' +
            '<tr>' +
            '<td class="cell_c"><span style="cursor:pointer" id="a_pers_gn">'+gn_t+'</span>: <a href="/mercenary_guild.php" title="'+gn_title+'" style="text-decoration: none;" id="pers_gn">00:00</a></td>' +
            '</tr>' +
            '<tr><td class="cell_b"><img src="'+_i+'t_center'+_i_+'.jpg"></td></tr>' +
            '</table>' +
            '</td>' +

            '<td id="gn_show2" width=9><img src="'+_i+'t_end'+_i_+'.jpg" alt="" width=9 height=26></td>' +

            '<td id="go_show1">' +
            '<table class="hwm_tb_cell">' +
            '<tr><td class="cell_t"></td></tr>' +
            '<tr>' +
            '<td class="cell_c"><span style="cursor:pointer" id="a_pers_go">'+go_t+'</span>: <a href="/hunter_guild.php" title="'+go_title+'" style="text-decoration: none;" id="pers_go">00:00</a>' +
            '</td>' +
            '</tr>' +
            '<tr><td class="cell_b"><img src="'+_i+'t_center'+_i_+'.jpg"></td></tr>' +
            '</table>' +
            '</td>' +

            '<td id="go_show2" width=9><img src="'+_i+'t_end'+_i_+'.jpg" alt="" width=9 height=26></td>' +

            '<td id="gv_show1">' +
            '<table class="hwm_tb_cell">' +
            '<tr><td class="cell_t"></td></tr>' +
            '<tr>' +
            '<td class="cell_c"><span style="cursor:pointer" id="a_pers_gv">'+gv_t+'</span>: <a href="'+gv_tit+'" title="'+gv_title+'" style="text-decoration: none;" id="pers_gv">00:00</a></td>' +
            '</tr>' +
            '<tr><td class="cell_b"><img src="'+_i+'t_center'+_i_+'.jpg"></td></tr>' +
            '</table>' +
            '</td>' +

            '<td id="gv_show2" width=9><img src="'+_i+'t_end'+_i_+'.jpg" alt="" width=9 height=26></td>' +

            '<td width=44>' +
            '<table class="hwm_tb_cell">' +
            '<tr><td class="cell_t"></td></tr>' +
            '<tr>' +
            '<td class="cell_c" style="cursor:pointer" id="pers_m" title="'+mana_title+'">00:00</td>' +
            '</tr>' +
            '<tr><td class="cell_b"><img src="'+_i+'t_center'+_i_+'.jpg"></td></tr>' +
            '</table>' +
            '</td>' +

            '<td width=5 style="overflow: hidden;"><img src="'+_i+'t_end'+_i_+'.jpg" alt="" width=9 height=26 style="margin:0px -4px 0px 0px;"></td>' +

            '</tr>' +
            '</table>' +

            '</td>' +
            '</tr>' +
            '</table>';


        if ( hwmtimerestore["hwm_gr_show_check"] == '0' ) { d.querySelector("#gr_show1").style.display = d.querySelector("#gr_show2").style.display = 'none'; }
        if ( hwmtimerestore["hwm_gk_show_check"] == '0' ) { d.querySelector("#gk_show1").style.display = d.querySelector("#gk_show2").style.display = 'none'; }
        if ( hwmtimerestore["hwm_gn_show_check"] == '0' ) { d.querySelector("#gn_show1").style.display = d.querySelector("#gn_show2").style.display = 'none'; }
        if ( hwmtimerestore["hwm_go_show_check"] == '0' ) { d.querySelector("#go_show1").style.display = d.querySelector("#go_show2").style.display = 'none'; }
        if ( hwmtimerestore["hwm_gv_show_check"] == '0' ) { d.querySelector("#gv_show1").style.display = d.querySelector("#gv_show2").style.display = 'none'; }


        x1.parentNode.appendChild(d);

        addEvent( $("pers_m"), "click", settings );


        if ( hwmtimerestore["object_id"] ) {
            setTimeout(function() { $("pers_w").href = "object-info.php?id=" + hwmtimerestore["object_id"]; }, 300);
        }


        // vychislenie vremeni servera (s podderzkoj scripta time_seconds)
        if ( t_server = regexp_time_server2.exec( b.innerHTML ) ) {

            var time_server = new Date( 0, 0, 0, Number(t_server[1]), Number(t_server[2]), Number(t_server[3]) );

        } else if ( t_server = regexp_time_server.exec( b.innerHTML ) ) {

            var time_server = new Date( 0, 0, 0, Number(t_server[1]), Number(t_server[2]), 0 );

        }


        if ( location.pathname=='/home.php' && document.querySelector("img[src*='attr_defense.png']") ) {

            // podhvatyvanie vremeni okonchaniya raboty s home.php i ego proverka
            if ( time_home_time = time_home.exec( b.innerHTML ) ) {

                var t_gr = Number( time_home_time[1] ) * 60000; // in milli seconds
                var t_gr_temp = t_gr - Math.abs( Number( hwmtimerestore["hwm_time_work_end"] ) - time_cur );

            } else if ( ( time_home_time = time_home2.exec( b.innerHTML ) ) && time_server ) {
                var t_gr = new Date( 0, 0, 0, Number(time_home_time[1]), Number(time_home_time[2]), 0 );

                // example: 18:00 - 18:20 = - 20 min uze rabotau;	-20 min + 60 min = 40 min ostalos'
                if ( time_server < t_gr ) {
                    t_gr = t_gr - time_server + 60*60000 - 24*60*60000; // in milli seconds
                } else {
                    t_gr = t_gr - time_server + 60*60000; // in milli seconds
                }
                var t_gr_temp = t_gr - Math.abs( Number( hwmtimerestore["hwm_time_work_end"] ) - time_cur );
            }

            if ( t_gr_temp && Math.abs( t_gr_temp ) > 70000 ) {
                hwmtimerestore["hwm_time_work_end"] = '' + ( time_cur + t_gr );
                hwmtimerestore["hwm_time_work_end_yes"] = 'no';
            }

            if ( b.innerHTML.match( work_unemployed ) ) {
                hwmtimerestore["hwm_time_work_end"] = '1300000000000';
                hwmtimerestore["hwm_time_work_end_yes"] = 'yes';
            }

            // detect premium akkaunt
            if ( img_star_prem = document.querySelector("img[src$='i/star.gif']") || document.querySelector("img[src$='i/star_extend.gif']")) {

                img_star_prem.align = "absmiddle";
                hwmtimerestore["hwm_time_percent_prem"] = '' + ( 70 / 100 );

                var time_zone = 3 + new Date().getTimezoneOffset()/60;
                if ( new Date(2011,0,11).getTimezoneOffset() != new Date(2011,6,3).getTimezoneOffset() ) time_zone += 1;
                // get date
                var time_server_day = new Date( Date.parse( new Date() ) + time_zone*60*60*1000 );
                time_server_day = Date.parse( new Date( time_server_day.getFullYear(), time_server_day.getMonth(), time_server_day.getDate(), time_server.getHours(), time_server.getMinutes(), time_server.getSeconds() ) );

                if ( time_prem = regexp_prem.exec( img_star_prem.title ) )
                {
                    if ( url.match('lordswm') ) {
                        // 2013-05-31 23:25
                        time_prem = Date.parse( new Date( Number(time_prem[1]), Number(time_prem[2])-1, Number(time_prem[3]), Number(time_prem[4]), Number(time_prem[5]) ) );
                    } else {
                        // 31-05-13 23:25
                        time_prem = Date.parse( new Date( Number(time_prem[3])+2000, Number(time_prem[2])-1, Number(time_prem[1]), Number(time_prem[4]), Number(time_prem[5]) ) );
                    }
                    hwmtimerestore["hwm_time_percent_prem_exp"] = '' + ( time_cur + time_prem - time_server_day );
                    hwmtimerestore["hwm_time_percent_prem_title"] = img_star_prem.title;
                }

            } else {

                hwmtimerestore["hwm_time_percent_prem"] = '1';
                hwmtimerestore["hwm_time_percent_prem_exp"] = '1300000000000';

                if ( hwmtimerestore["hwm_time_percent_prem_title"] ) {
                    // premium istek
                    setTimeout(function() { prompt( alert_prem_exp ); }, 300);
                    hwmtimerestore["hwm_time_percent_prem_title"] = '';
                }
            }
        }


        if ( hwmtimerestore["hwm_time_percent_prem_title"] ) {
            if ( Number( hwmtimerestore["hwm_time_percent_prem_exp"] ) > time_cur )
            {
                gr_title = hwmtimerestore["hwm_time_percent_prem_title"];
                $('pers_w').title = gr_title;
            }
            else
            {
                // premium istek
                setTimeout(function() { prompt( alert_prem_exp ); }, 300);

                hwmtimerestore["hwm_time_percent_prem"] = '1';
                hwmtimerestore["hwm_time_percent_prem_exp"] = '1300000000000';
                hwmtimerestore["hwm_time_percent_prem_title"] = '';
            }
        }


        if ( location.pathname=='/hunter_guild.php' && time_server && ( form_f2 = document.querySelector("form[name='f2']") ) )
        {
            while ( form_f2.tagName != 'TR' ) { form_f2 = form_f2.parentNode; }

            if ( regexp_lic_mo.exec( form_f2.innerHTML ) )
            {
                if ( !form_f2.querySelector("input[type='submit'][onclick*='confirm']") )
                {
                    // licenzija MO
                    hwmtimerestore["hwm_time_percent_lic_mo"] = '' + ( 50 / 100 );
                }
                else
                {
                    // licenzija O
                    hwmtimerestore["hwm_time_percent_lic_mo"] = '' + ( 75 / 100 );
                }

                var time_zone = 3 + new Date().getTimezoneOffset()/60;
                if ( new Date(2011,0,11).getTimezoneOffset() != new Date(2011,6,3).getTimezoneOffset() ) time_zone += 1;
                // get date
                var time_server_day = new Date( Date.parse( new Date() ) + time_zone*60*60*1000 );
                time_server_day = Date.parse( new Date( time_server_day.getFullYear(), time_server_day.getMonth(), time_server_day.getDate(), time_server.getHours(), time_server.getMinutes(), time_server.getSeconds() ) );

                form_f2 = form_f2.querySelectorAll("td");
                var time_lic_mo_max = 0;

                for ( var i=form_f2.length; i--; ) {
                    if ( form_f2[i].innerHTML.indexOf("<td")!=-1 ) { continue; }
                    if ( time_lic_mo = regexp_lic_mo.exec( form_f2[i].innerHTML ) )
                    {
                        if ( url.match('lordswm') ) {
                            // Expiration date 05-31-13 23:25
                            var time_lic_exp = Date.parse( new Date( Number(time_lic_mo[3])+2000, Number(time_lic_mo[1])-1, Number(time_lic_mo[2]), Number(time_lic_mo[4]), Number(time_lic_mo[5]) ) );
                        } else {
                            // 31-05-13 23:25
                            var time_lic_exp = Date.parse( new Date( Number(time_lic_mo[3])+2000, Number(time_lic_mo[2])-1, Number(time_lic_mo[1]), Number(time_lic_mo[4]), Number(time_lic_mo[5]) ) );
                        }
                        if ( time_lic_exp > time_lic_mo_max )
                        {
                            time_lic_mo_max = time_lic_exp;
                            hwmtimerestore["hwm_time_percent_lic_mo_exp"] = '' + ( time_cur + time_lic_mo_max - time_server_day );
                            hwmtimerestore["hwm_time_percent_lic_mo_title"] = time_lic_mo[0];
                        }
                    }
                }
            }
            else
            {
                hwmtimerestore["hwm_time_percent_lic_mo"] = '1';
                hwmtimerestore["hwm_time_percent_lic_mo_exp"] = '1300000000000';
                hwmtimerestore["hwm_time_percent_lic_mo_title"] = '';
            }
        }


        // +++ algoritm okonchaniya boya
        if ( GM_getValue( "92571_hwm_war_unload_"+location.hostname, "false" ) == "true" )
        {
            var alt = "a";
            var bselect_link = document.querySelector("a[href^='bselect.php']");
            if ( !bselect_link ) { bselect_link = document.querySelector("a[href='plstats.php']"); }
            if ( bselect_link && bselect_link.parentNode.innerHTML.indexOf("#ff0000")==-1 ) {
                GM_deleteValue( "92571_hwm_war_unload_"+location.hostname );
                alt += "11";

                if ( hwmtimerestore["hwm_map_thief_ambush"] == "true" ) {
                    alt += "2";
                    hwmtimerestore["hwm_map_thief_ambush"] = 'false';
                    if ( army_percent < 100 ) {
                        alt += "33";
                        hwmtimerestore["hwm_time_gv_end"] = '' + ( time_cur + 60*60000 * hwmtimerestore["hwm_time_percent_faster"] * hwmtimerestore["hwm_time_percent_prem"] );
                        hwmtimerestore["hwm_time_gv_end_yes"] = 'no';
                    } else {
                        alt += "44";
                        hwmtimerestore["hwm_time_gv_end"] = '1300000000000';
                        hwmtimerestore["hwm_time_gv_end_yes"] = 'yes';
                    }
                }

                if ( hwmtimerestore["hwm_map_hunter"] == "true" ) {
                    alt += "56";
                    hwmtimerestore["hwm_map_hunter"] = 'false';
                    hwmtimerestore["hwm_time_go_end_yes"] = 'no';
                    if ( time_server && time_server.getHours() < 8 ) {
                        hwmtimerestore["hwm_time_go_end"] = '' + ( time_cur + 20*60000 * hwmtimerestore["hwm_time_percent_faster"] * hwmtimerestore["hwm_time_percent_prem"] * hwmtimerestore["hwm_time_percent_lic_mo"] );
                    } else {
                        hwmtimerestore["hwm_time_go_end"] = '' + ( time_cur + 40*60000 * hwmtimerestore["hwm_time_percent_faster"] * hwmtimerestore["hwm_time_percent_prem"] * hwmtimerestore["hwm_time_percent_lic_mo"] );
                    }
                }

                if ( army_percent == 100 ) {
                    alt += "7";
                    hwmtimerestore["hwm_time_work_trudogolik"] = '0';
                }
            }
            //if ( alt != "a" ) { setTimeout(function() { alert( alt ); }, 500); }
        }

        // --- algoritm okonchaniya boya


        if ( location.pathname=='/object_do.php' )
        {
            if ( b.innerHTML.match( work_obj_do ) )
            {
                hwmtimerestore["hwm_time_work_end"] = '' + ( time_cur + 60*60000 );
                hwmtimerestore["hwm_time_work_end_yes"] = 'no';

                hwmtimerestore["hwm_time_work_trudogolik"] = '' + ( Number( hwmtimerestore["hwm_time_work_trudogolik"] ) + 1 );

                var object_id = /id=(\d+)/.exec( url_cur );
                if ( object_id ) { hwmtimerestore["object_id"] = '' + object_id[1]; }
            }
        }


        if ( location.pathname=='/object-info.php' )
        {
            var parent_trud = document.querySelector("a[href*='objectworkers.php']");
            if ( parent_trud )
            {
                if ( url.match('lordswm') )
                {
                    var workaholic_text1 = ' approximately through ';
                    var workaholic_text2 = ' enrollments.';
                    var workaholic_text3 = '';
                    var workaholic_text1_replace = ' <font color="red">enabled</font> approximately ';

                    var uze_ustroen = 'You are already employed\.';
                    var uze_ustroen2 = 'Less than one hour passed since last enrollment\. Please wait\.';
                    var uze_ustroen3 = 'No vacancies\.';
                } else {
                    var workaholic_text1 = ' \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E \u0447\u0435\u0440\u0435\u0437 ';
                    var workaholic_text2 = ' \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432';
                    var workaholic_text3 = ' \u043D\u0430 \u0440\u0430\u0431\u043E\u0442\u0443.';
                    var workaholic_text1_replace = ' <font color="red">\u0430\u043A\u0442\u0438\u0432\u0435\u043D</font> \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E ';

                    var uze_ustroen = '\u0412\u044B \u0443\u0436\u0435 \u0443\u0441\u0442\u0440\u043E\u0435\u043D\u044B\.';
                    var uze_ustroen2 = '\u041F\u0440\u043E\u0448\u043B\u043E \u043C\u0435\u043D\u044C\u0448\u0435 \u0447\u0430\u0441\u0430 \u0441 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0433\u043E \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430 \u043D\u0430 \u0440\u0430\u0431\u043E\u0442\u0443\. \u0416\u0434\u0438\u0442\u0435\.';
                    var uze_ustroen3 = '\u041D\u0435\u0442 \u0440\u0430\u0431\u043E\u0447\u0438\u0445 \u043C\u0435\u0441\u0442\.';
                }
                var regexp_workaholic = new RegExp('\\*\\&nbsp;0\\.(\\d) '+workaholic_penalty_regexp);

                // otrabotano smen
                var workaholic_WORK = Number( hwmtimerestore["hwm_time_work_trudogolik"] );

                if ( regexp_workaholic.exec( b.innerHTML ) )
                {
                    var regexp_workaholic = Number(regexp_workaholic.exec( b.innerHTML )[1]);

                    if ( regexp_workaholic == 8 )
                    {
                        workaholic_WORK = 11;
                    } else if ( regexp_workaholic == 6 )
                    {
                        workaholic_WORK = 12;
                    } else if ( regexp_workaholic == 4 )
                    {
                        workaholic_WORK = 13;
                    } else if ( regexp_workaholic == 2 )
                    {
                        workaholic_WORK = 14;
                    } else if ( regexp_workaholic == 1 && workaholic_WORK < 15 )
                    {
                        workaholic_WORK = 15;
                    }

                    hwmtimerestore["hwm_time_work_trudogolik"] = '' + workaholic_WORK;

                } else if ( workaholic_WORK > 10 ) {

                    workaholic_WORK = 10;
                    hwmtimerestore["hwm_time_work_trudogolik"] = '' + workaholic_WORK;
                }

                var add_trud = document.createElement('span');

                if ( workaholic_WORK == 9 || workaholic_WORK == 10 )
                {
                    // vydelit' zvetom
                    add_trud.setAttribute('style', 'color:red; font-weight:bold;');
                } else if ( workaholic_WORK > 10 )
                {
                    workaholic_text1 = workaholic_text1_replace;
                }

                // ostalos' rabotat'
                var workaholic_ENROLL = Math.abs( 11 - workaholic_WORK );

                if ( workaholic_WORK > 14 )
                {
                    workaholic_ENROLL = workaholic_ENROLL + '+';
                }

                // pravil'noe okonchanie slov
                if ( !url.match('lordswm') ) {
                    if ( workaholic_WORK == 9 || workaholic_WORK == 8 || workaholic_WORK == 7 ) {
                        workaholic_text2 += '\u0430';
                    } else if ( workaholic_WORK == 10 ) {
                        workaholic_text2 += '\u043E';
                    }
                }

                if ( hwmtimerestore["hwm_time_work_trudogolik_off"] == '0' ) {
                    if ( hwmtimerestore["hwm_time_work_trudogolik_show"] == '1' && workaholic_WORK != 9 && workaholic_WORK != 10 ) {} else {

                        add_trud.innerHTML = workaholic_penalty + workaholic_text1 + workaholic_ENROLL + workaholic_text2 + workaholic_text3;

                        parent_trud = parent_trud.parentNode.previousSibling.previousSibling;
                        parent_trud.parentNode.insertBefore(add_trud, parent_trud);
                    }
                }

                // replace uze ustroen
                parent_trud = document.querySelector("a[href*='objectworkers.php']").parentNode.parentNode;
                if ( ( time_cur > Number( hwmtimerestore["hwm_time_work_end"] ) ) && ( parent_trud.innerHTML.match(uze_ustroen) || ( uze_ustroen = parent_trud.innerHTML.match(uze_ustroen2) ) || ( uze_ustroen = parent_trud.innerHTML.match(uze_ustroen3) ) ) ) {
                    parent_trud.innerHTML = parent_trud.innerHTML.replace(uze_ustroen, '<style>@-webkit-keyframes blink {80% {opacity:0.0;}} @-moz-keyframes blink {80% {opacity:0.0;}} @-o-keyframes blink {80% {opacity:0.0;}} @keyframes blink {80% {opacity:0.0;}}</style><font color=blue style="-webkit-animation: blink 1s steps(1,end) 0s infinite; -moz-animation: blink 1s steps(1,end) 0s infinite; -o-animation: blink 1s steps(1,end) 0s infinite; animation: blink 1s steps(1,end) 0s infinite"><b>'+uze_ustroen+'</b></font>');
                }

            }
        }


        if ( workaholic_WORK = hwmtimerestore["hwm_time_work_trudogolik"] )
        {
            if ( gr_title ) gr_title += '\n';
            gr_title += workaholic_penalty + ": " + ( 11 - Number( workaholic_WORK ) );
            var title_gr = $('pers_w');
            title_gr.title = gr_title;
            if ( hwmtimerestore["hwm_time_work_trudogolik_off"] == '0' && workaholic_WORK > 10 ) title_gr.style.color = '#ff9c00';
        }


        if ( location.pathname=='/mercenary_guild.php' )
        {
            if ( document.querySelector("a[href^='/mercenary_guild.php?action=accept']") )
            {
                hwmtimerestore["hwm_time_gn_end"] = '1300000000000';
                hwmtimerestore["hwm_time_gn_end_yes"] = 'yes';
            }

            else if ( ( time_gn = regexp_timegn0.exec( b.innerHTML ) ) || ( time_gn = regexp_timegn1.exec( b.innerHTML ) ) || ( time_gn = regexp_timegn2.exec( b.innerHTML ) ) || ( time_gn = regexp_timegn3.exec( b.innerHTML ) ) || ( time_gn = regexp_timegn4.exec( b.innerHTML ) ) || ( time_gn = regexp_timegn5.exec( b.innerHTML ) ) )
            {
                time_gn = Number( time_gn[1] );
                if ( regexp_timegn0.exec( b.innerHTML ) && ( time_gn==19 || time_gn==13 ) ) time_gn++;
                time_gn = time_gn * 60000; // in milli seconds

                var time_gn_temp = time_gn - Math.abs( Number( hwmtimerestore["hwm_time_gn_end"] ) - time_cur );

                if ( Math.abs( time_gn_temp ) > 70000 )
                {
                    var reputation_gn = regexp_gn_rep.exec( b.innerHTML );
                    reputation_gn = ( 40 - Number( reputation_gn[1] ) * 2 ) * hwmtimerestore["hwm_time_percent_faster"] * hwmtimerestore["hwm_time_percent_prem"] * 60000; // in milli seconds

                    time_gn_temp = time_gn - reputation_gn;

                    if ( Math.abs( time_gn_temp ) > 70000 ) {
                        hwmtimerestore["hwm_time_gn_end"] = '' + ( time_cur + time_gn );
                        hwmtimerestore["hwm_time_gn_end_yes"] = 'no';
                    } else {
                        hwmtimerestore["hwm_time_gn_end"] = '' + ( time_cur + reputation_gn );
                        hwmtimerestore["hwm_time_gn_end_yes"] = 'no';
                    }
                }
            }

            //hwmtimerestore["grandma"] = '1';
            if ( b.innerHTML.match('Вы получаете') || b.innerHTML.match('You receive') ) {
                flash_heart = document.querySelector("object > param[value*='mercenary.swf']");
                if ( flash_heart ) {
                    var rand_f;
                    if ( new Date().getHours() == 23 ) {
                        rand_f = "d8EWAZm.jpg";
                    } else if ( hwmtimerestore["grandma"] ) {
                        var img_win = new Array("3xVyD9G.jpg", "rdc2phi.jpg", "4Sz0fZh.jpg", "EeSup0D.jpg", "cfqFars.jpg", "HCuDAHi.jpg", "pYaFMyE.jpg");
                        rand_f = Math.floor(Math.random() * img_win.length);
                        rand_f = img_win[rand_f];
                    }

                    if ( rand_f ) {
                        flash_heart.parentNode.style.display = 'none';
                        var add_el = document.createElement('img');
                        add_el.height = "150";
                        add_el.width = "150";
                        add_el.src = "http://i.imgur.com/" + rand_f;
                        flash_heart.parentNode.parentNode.appendChild(add_el);
                    }
                }
            }
        }


        if ( location.pathname=='/ranger_guild.php' )
        {
            if ( document.querySelector("a[href^='ranger_guild.php?action=accept']") )
            {
                hwmtimerestore["hwm_map_thief_ambush"] = 'false';
                hwmtimerestore["hwm_time_gv_end"] = '1300000000000';
                hwmtimerestore["hwm_time_gv_end_yes"] = 'yes';
                hwmtimerestore["hwm_gv_or_gre"] = '1';
            }

            if ( time_gv = regexp_timegre.exec( b.innerHTML ) )
            {
                time_gv = Number( time_gv[1] ) * 60000; // in milli seconds
                var time_gv_temp = time_gv - Math.abs( Number( hwmtimerestore["hwm_time_gv_end"] ) - time_cur );

                if ( Math.abs( time_gv_temp ) > 70000 ) {
                    hwmtimerestore["hwm_map_thief_ambush"] = 'false';
                    hwmtimerestore["hwm_time_gv_end"] = '' + ( time_cur + time_gv );
                    hwmtimerestore["hwm_time_gv_end_yes"] = 'no';
                    hwmtimerestore["hwm_gv_or_gre"] = '1';
                }
            }
        }

        if ( location.pathname=='/ranger_list.php' )
        {
            var link_ranger_attack = document.querySelectorAll("a[href^='ranger_attack.php?join']");
            if ( link_ranger_attack.length > 0 )
            {
                hwmtimerestore["hwm_map_thief_ambush"] = 'false';
                hwmtimerestore["hwm_time_gv_end"] = '1300000000000';
                hwmtimerestore["hwm_time_gv_end_yes"] = 'yes';
                hwmtimerestore["hwm_gv_or_gre"] = '1';

                for ( var i=link_ranger_attack.length; i--; ) {

                    addEvent
                    (
                        link_ranger_attack[i],
                        "click",
                        function( event )
                        {
                            hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
                            hwmtimerestore["hwm_map_thief_ambush"] = 'true';
                            GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
                        }
                    );
                }
            }
        }


        if ( location.pathname=='/mod_workbench.php' && time_server )
        {
            if ( regexp_sm.exec( b.innerHTML ) ) {

                var time_zone = 3 + new Date().getTimezoneOffset()/60;
                if ( new Date(2011,0,11).getTimezoneOffset() != new Date(2011,6,3).getTimezoneOffset() ) time_zone += 1;
                // get date
                var time_server_day = new Date( Date.parse( new Date() ) + time_zone*60*60*1000 );
                time_server_day = Date.parse( new Date( 0, time_server_day.getMonth(), time_server_day.getDate(), time_server.getHours(), time_server.getMinutes(), time_server.getSeconds() ) );

                var all_td_mod = document.querySelectorAll("td");
                var t_sm_mass = [];

                for ( var i=all_td_mod.length; i--; ) {
                    if ( all_td_mod[i].innerHTML.indexOf("<td")!=-1 ) { continue; }
                    if ( time_sm = regexp_sm.exec( all_td_mod[i].innerHTML ) ) {
                        // 31-06 17:43
                        time_sm = Date.parse( new Date( 0, Number(time_sm[2])-1, Number(time_sm[1]), Number(time_sm[3]), Number(time_sm[4]), 0 ) );
                        t_sm_mass.push( time_sm - time_server_day );
                    }
                }

                t_sm_mass.sort( function(a, b) { return a - b; } );

                hwmtimerestore["hwm_time_sm_end"] = '' + ( time_cur + t_sm_mass[0] + 60000 );
                hwmtimerestore["hwm_time_sm_end_yes"] = 'no';

            } else {

                hwmtimerestore["hwm_time_sm_end"] = '1300000000000';
                hwmtimerestore["hwm_time_sm_end_yes"] = 'yes';
            }
        }


        if ( location.pathname=='/map.php' ) {

            var thief_ambush_cancel = document.querySelector("a[href*='thief_ambush_cancel.php']");
            if ( thief_ambush_cancel ) {
                hwmtimerestore["hwm_map_thief_ambush"] = 'true';
                hwmtimerestore["hwm_time_gv_end"] = '1300000000000';
                hwmtimerestore["hwm_time_gv_end_yes"] = 'yes';
                hwmtimerestore["hwm_gv_or_gre"] = '0';

                addEvent
                (
                    thief_ambush_cancel,
                    "click",
                    function( event )
                    {
                        hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
                        hwmtimerestore["hwm_map_thief_ambush"] = 'false';
                        GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
                    }
                );
            }

            if ( document.querySelector("a[href='ecostat.php']") ) {
                if ( hwmtimerestore["hwm_gv_or_gre"] == '0' && !thief_ambush_cancel ) {
                    hwmtimerestore["hwm_map_thief_ambush"] = 'false';
                }
                if ( hwmtimerestore["hwm_gv_or_gre"] == '1' && !document.querySelector("a[href='ranger_guild.php']") ) {
                    hwmtimerestore["hwm_map_thief_ambush"] = 'false';
                }
            }

            var form_thief_ambush = document.querySelector("form[action='thief_ambush.php']");
            if ( form_thief_ambush ) {
                hwmtimerestore["hwm_map_thief_ambush"] = 'false';
                hwmtimerestore["hwm_time_gv_end"] = '1300000000000';
                hwmtimerestore["hwm_time_gv_end_yes"] = 'yes';
                hwmtimerestore["hwm_gv_or_gre"] = '0';

                var input_form_thief_ambush = form_thief_ambush.querySelector("input[type='submit']");

                addEvent
                (
                    input_form_thief_ambush,
                    "click",
                    function( event )
                    {
                        hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
                        hwmtimerestore["hwm_map_thief_ambush"] = 'true';
                        GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
                    }
                );
            }

            var form_ranger_attack = document.querySelector("form[action='ranger_attack.php']");
            if ( form_ranger_attack ) {
                hwmtimerestore["hwm_map_thief_ambush"] = 'false';
                hwmtimerestore["hwm_time_gv_end"] = '1300000000000';
                hwmtimerestore["hwm_time_gv_end_yes"] = 'yes';
                hwmtimerestore["hwm_gv_or_gre"] = '1';

                var input_form_ranger_attack = form_ranger_attack.querySelector("input[type='submit']");

                addEvent
                (
                    input_form_ranger_attack,
                    "click",
                    function( event )
                    {
                        hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
                        hwmtimerestore["hwm_map_thief_ambush"] = 'true';
                        GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
                    }
                );

                if ( hwmtimerestore["hwm_gre_check"] == '1' )
                {
                    hwmtimerestore["hwm_map_thief_ambush"] = 'true';
                    setTimeout(function() { form_ranger_attack.submit(); }, 500);
                }
            }

            var temp_nl = document.querySelectorAll("img[src*='map/nl']");
            if ( temp_nl.length > 0 && !document.querySelector("img[src*='css/loading.gif']") ) {
                hwmtimerestore["hwm_map_hunter"] ='false';
                hwmtimerestore["hwm_time_go_end"] = '1310000000000';
                hwmtimerestore["hwm_time_go_end_yes"] = 'yes';

                for ( var i=temp_nl.length, temp_parent, temp_child; i--; ) {
                    temp_parent = temp_nl[i];
                    while ( temp_parent.tagName != 'TR' ) { temp_parent = temp_parent.parentNode; }
                    if ( temp_parent.parentNode.querySelector("a[href^='map.php?action=skip']") ) break;
                    temp_parent = temp_parent.nextSibling;
                    temp_child = temp_parent.firstChild.innerHTML;
                    temp_parent.innerHTML = '<td colspan="2" align="left" width="100%"><table border="0" width="100%"><tbody><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td align="center">'+temp_child+'</td><td align="right" valign="top"><a href="map.php?action=skip">'+( url.match('lordswm') ? "Pass by " : "Пройти мимо" )+'</a>&nbsp;</td></tr></tbody></table></td>';
                }
            }

            if ( b.innerHTML.match( regexp_go_timer ) && ( delta2 = /Delta2 = (\d+)/.exec( b.innerHTML ) ) ) {
                hwmtimerestore["hwm_map_hunter"] = 'false';
                hwmtimerestore["hwm_time_go_end"] = '' + ( time_cur + delta2[1]*1000 );
                hwmtimerestore["hwm_time_go_end_yes"] = 'no';

                //+ Copyright (c) demin  ( http://www.heroeswm.ru/pl_info.php?id=15091 )

                if ( hwmtimerestore["hwm_go_timer_hide"] == '1' ) {
                    function inj_314() {
                        window["Refresh2"] = function () {}
                        var temp_314 = document.getElementById('next_ht');
                        while ( temp_314.tagName != 'TABLE' ) { temp_314 = temp_314.parentNode; }
                        temp_314.parentNode.removeChild( temp_314.previousSibling );
                        temp_314.parentNode.removeChild( temp_314.previousSibling );
                        temp_314.parentNode.removeChild( temp_314 );
                    }

                    var elem = document.createElement('script');
                    elem.type = "text/javascript";
                    elem.innerHTML = inj_314.toString()+"inj_314()";
                    document.querySelector("head").appendChild(elem);
                }

                //- Copyright (c)

            }

            var go_link_action_attack = document.querySelectorAll("a[href^='map.php?action=attack']");
            for ( var i=go_link_action_attack.length; i--; ) {

                addEvent
                (
                    go_link_action_attack[i],
                    "click",
                    function( event )
                    {
                        hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
                        hwmtimerestore["hwm_map_hunter"] = 'true';
                        GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
                    }
                );
            }

            var go_link_action_skip = document.querySelectorAll("a[href^='map.php?action=skip']");
            for ( var i=go_link_action_skip.length; i--; ) {

                addEvent
                (
                    go_link_action_skip[i],
                    "click",
                    function( event )
                    {
                        hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
                        hwmtimerestore["hwm_time_go_end_yes"] = 'no';
                        var time_cur_now = new Date().getTime();

                        if ( time_server && ( new Date( time_server.getTime() + time_cur_now - time_cur ).getHours() ) < 8 )
                        {
                            hwmtimerestore["hwm_time_go_end"] = '' + ( time_cur_now + 10*60000 * hwmtimerestore["hwm_time_percent_faster"] * hwmtimerestore["hwm_time_percent_prem"] * hwmtimerestore["hwm_time_percent_lic_mo"] + 1000 );
                        } else {
                            hwmtimerestore["hwm_time_go_end"] = '' + ( time_cur_now + 20*60000 * hwmtimerestore["hwm_time_percent_faster"] * hwmtimerestore["hwm_time_percent_prem"] * hwmtimerestore["hwm_time_percent_lic_mo"] + 1000 );
                        }

                        GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
                    }
                );
            }

            var go_link_help = document.querySelectorAll("a[onclick^='return print_friends']");
            for ( var i=go_link_help.length; i--; ) {

                addEvent
                (
                    go_link_help[i],
                    "click",
                    function( event )
                    {
                        setTimeout(function() { go_link_help_click(); }, 200);
                    }
                );
            }

            if ( b.innerHTML.match( regexp_map_go ) && hwmtimerestore["hwm_time_go_end"] == '1310000000000' ) {
                hwmtimerestore["hwm_time_go_end_yes"] = 'no';
                var time_cur_now = new Date().getTime();

                if ( time_server && ( new Date( time_server.getTime() + time_cur_now - time_cur ).getHours() ) < 8 )
                {
                    hwmtimerestore["hwm_time_go_end"] = '' + ( time_cur_now + 10*60000 * hwmtimerestore["hwm_time_percent_faster"] * hwmtimerestore["hwm_time_percent_prem"] * hwmtimerestore["hwm_time_percent_lic_mo"] + 1000 );
                } else {
                    hwmtimerestore["hwm_time_go_end"] = '' + ( time_cur_now + 20*60000 * hwmtimerestore["hwm_time_percent_faster"] * hwmtimerestore["hwm_time_percent_prem"] * hwmtimerestore["hwm_time_percent_lic_mo"] + 1000 );
                }
            }


        }


        //==================================================================


        var title_hl = $('pers_h');
        addEvent
        (
            title_hl,
            "click",
            function( event )
            {
                if ( hwmtimerestore["hwm_time_health_alert"] == 'yes' )
                {
                    hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
                    hwmtimerestore["hwm_time_health_alert"] = 'no';
                    title_hl.style.color = '#f5c137';
                    title_hl.title = health_alert_tn;
                } else
                {
                    hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
                    hwmtimerestore["hwm_time_health_alert"] = 'yes';
                    title_hl.style.color = '#ff9c00';
                    title_hl.title = health_alert_ty;
                }
                GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
            }
        );

        if ( hwmtimerestore["hwm_time_health_alert"] == 'yes' )
        {
            title_hl.style.color = '#ff9c00';
            title_hl.title = health_alert_ty;
        } else
        {
            title_hl.title = health_alert_tn;
        }

        var title_gr = $('a_pers_w');
        addEvent
        (
            title_gr,
            "click",
            function( event )
            {
                if ( hwmtimerestore["hwm_time_work_alert"] == 'yes' )
                {
                    hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
                    hwmtimerestore["hwm_time_work_alert"] = 'no';
                    title_gr.style.color = '#f5c137';
                    title_gr.title = work_alert_tn;
                } else
                {
                    hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
                    hwmtimerestore["hwm_time_work_alert"] = 'yes';
                    title_gr.style.color = '#FF0000';
                    title_gr.title = work_alert_ty;
                }
                GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
            }
        );

        if ( hwmtimerestore["hwm_time_work_alert"] == 'yes' )
        {
            title_gr.style.color = '#FF0000';
            title_gr.title = work_alert_ty;
        } else
        {
            title_gr.title = work_alert_tn;
        }

        var title_sm = $('a_pers_sm');
        addEvent
        (
            title_sm,
            "click",
            function( event )
            {
                if ( hwmtimerestore["hwm_time_sm_alert"] == 'yes' )
                {
                    hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
                    hwmtimerestore["hwm_time_sm_alert"] = 'no';
                    title_sm.style.color = '#f5c137';
                    title_sm.title = sm_alert_tn;
                } else
                {
                    hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
                    hwmtimerestore["hwm_time_sm_alert"] = 'yes';
                    title_sm.style.color = '#FF0000';
                    title_sm.title = sm_alert_ty;
                }
                GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
            }
        );

        if ( hwmtimerestore["hwm_time_sm_alert"] == 'yes' )
        {
            title_sm.style.color = '#FF0000';
            title_sm.title = sm_alert_ty;
        } else
        {
            title_sm.title = sm_alert_tn;
        }

        var title_gn = $('a_pers_gn');
        addEvent
        (
            title_gn,
            "click",
            function( event )
            {
                if ( hwmtimerestore["hwm_time_gn_alert"] == 'yes' )
                {
                    hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
                    hwmtimerestore["hwm_time_gn_alert"] = 'no';
                    title_gn.style.color = '#f5c137';
                    title_gn.title = gn_alert_tn;
                } else
                {
                    hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
                    hwmtimerestore["hwm_time_gn_alert"] = 'yes';
                    title_gn.style.color = '#FF0000';
                    title_gn.title = gn_alert_ty;
                }
                GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
            }
        );

        if ( hwmtimerestore["hwm_time_gn_alert"] == 'yes' )
        {
            title_gn.style.color = '#FF0000';
            title_gn.title = gn_alert_ty;
        } else
        {
            title_gn.title = gn_alert_tn;
        }

        var title_go = $('a_pers_go');
        addEvent
        (
            title_go,
            "click",
            function( event )
            {
                if ( hwmtimerestore["hwm_time_go_alert"] == 'yes' )
                {
                    hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
                    hwmtimerestore["hwm_time_go_alert"] = 'no';
                    title_go.style.color = '#f5c137';
                    title_go.title = go_alert_tn;
                } else
                {
                    hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
                    hwmtimerestore["hwm_time_go_alert"] = 'yes';
                    title_go.style.color = '#FF0000';
                    title_go.title = go_alert_ty;
                }
                GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
            }
        );

        if ( hwmtimerestore["hwm_time_go_alert"] == 'yes' )
        {
            title_go.style.color = '#FF0000';
            title_go.title = go_alert_ty;
        } else
        {
            title_go.title = go_alert_tn;
        }

        var title_gv = $('a_pers_gv');
        addEvent
        (
            title_gv,
            "click",
            function( event )
            {
                if ( hwmtimerestore["hwm_time_gv_alert"] == 'yes' )
                {
                    hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
                    hwmtimerestore["hwm_time_gv_alert"] = 'no';
                    title_gv.style.color = '#f5c137';
                    title_gv.title = gv_alert_tn;
                } else
                {
                    hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
                    hwmtimerestore["hwm_time_gv_alert"] = 'yes';
                    title_gv.style.color = '#FF0000';
                    title_gv.title = gv_alert_ty;
                }
                GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
            }
        );

        if ( hwmtimerestore["hwm_time_gv_alert"] == 'yes' )
        {
            title_gv.style.color = '#FF0000';
            title_gv.title = gv_alert_ty;
        } else
        {
            title_gv.title = gv_alert_tn;
        }


        //==================================================================

        if (vh) {
            if (vh.parentNode.innerHTML.match(/var time_heart=(\d+);/)) {
                var heart_scale = RegExp.$1;
                var time_l = Math.floor( ( heart_scale * 1000 / 100 ) * ( 100 - army_percent ) );
                time.h = Math.floor( time_l / 1000 );
                if ( army_percent < 100 ) showtime( 'h' );
            }
        }

        /*var vs = document.querySelector("object > param[value*='heart.swf']");
if ( vs ) vs = vs.parentNode.querySelector("param[name='FlashVars']");
if ( vs ) {
	vs = vs.value.split('|');
	var cur = vs[0].split('=')[1];
	var time_l = Math.floor( ( vs[1] * 1000 / 100 ) * ( 100 - cur ) );
	time.h = Math.floor( time_l / 1000 );
	if ( cur < 100 && vs[2] > 0 ) showtime( 'h' );
}

var vs = document.querySelector("object > param[value*='mana.swf']");
if ( vs ) vs = vs.parentNode.querySelector("param[name='FlashVars']");
if ( vs ) {
	vs = vs.value.split('|');
	var cur = vs[0].split('=')[1];
	var time_l = Math.floor( ( ( vs[1] / 100 ) * vs[2] * 1000 / 100  ) * ( 100 - cur ) );
	time.m = Math.floor( time_l / 1000 );
	if ( cur < 100 && vs[2] > 0 ) showtime( 'm' );
}*/


        if ( time_cur < ( time_work_end = Number( hwmtimerestore["hwm_time_work_end"] ) ) )
        {
            time.w = Math.floor( ( time_work_end - time_cur ) /  1000 );
            if ( time.w < 3601 ) { showtime( 'w' ); } else { hwmtimerestore["hwm_time_work_end"] = '1300000000000'; hwmtimerestore["hwm_time_work_end_yes"] = 'yes'; }
        } else { hwmtimerestore["hwm_time_work_end"] = '1300000000000'; hwmtimerestore["hwm_time_work_end_yes"] = 'yes'; }


        if ( time_cur < ( time_sm_end = Number( hwmtimerestore["hwm_time_sm_end"] ) ) )
        {
            time.sm = Math.floor( ( time_sm_end - time_cur ) /  1000 );
            showtime( 'sm' );
        } else { hwmtimerestore["hwm_time_sm_end"] = '1300000000000'; hwmtimerestore["hwm_time_sm_end_yes"] = 'yes'; }


        if ( time_cur < ( time_gn_end = Number( hwmtimerestore["hwm_time_gn_end"] ) ) )
        {
            time.gn = Math.floor( ( time_gn_end - time_cur ) /  1000 );
            if ( time.gn < 54000 ) { showtime( 'gn' ); } else { hwmtimerestore["hwm_time_gn_end"] = '1300000000000'; hwmtimerestore["hwm_time_gn_end_yes"] = 'yes'; }
        } else { hwmtimerestore["hwm_time_gn_end"] = '1300000000000'; hwmtimerestore["hwm_time_gn_end_yes"] = 'yes'; }


        if ( time_cur < ( time_go_end = Number( hwmtimerestore["hwm_time_go_end"] ) ) )
        {
            time.go = Math.floor( ( time_go_end - time_cur ) / 1000 );
            if ( time.go < 2401 ) { showtime( 'go' ); } else { hwmtimerestore["hwm_time_go_end"] = '1300000000000'; hwmtimerestore["hwm_time_go_end_yes"] = 'yes'; }
        }// else { hwmtimerestore["hwm_time_go_end"] = '1300000000000'; hwmtimerestore["hwm_time_go_end_yes"] = 'yes'; }


        if ( time_cur < ( time_gv_end = Number( hwmtimerestore["hwm_time_gv_end"] ) ) )
        {
            time.gv = Math.floor( ( time_gv_end - time_cur ) /  1000 );
            if ( time.gv < 3601 ) { showtime( 'gv' ); } else { hwmtimerestore["hwm_time_gv_end"] = '1300000000000'; hwmtimerestore["hwm_time_gv_end_yes"] = 'yes'; }
        } else { hwmtimerestore["hwm_time_gv_end"] = '1300000000000'; hwmtimerestore["hwm_time_gv_end_yes"] = 'yes'; }


        GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );


    }


    function showtime( t )
    {
        var el = $( 'pers_' + t );
        if ( t == 'h' )
        {
            var ct = --time.h;
        } else if ( t == 'm' )
        {
            var ct = --time.m;
        } else if ( t == 'w' )
        {
            var ct = --time.w;
        } else if ( t == 'gn' )
        {
            var ct = --time.gn;
        } else if ( t == 'go' )
        {
            var ct = --time.go;
        } else if ( t == 'sm' )
        {
            var ct = --time.sm;
        } else if ( t == 'gv' )
        {
            var ct = --time.gv;
        }
        var dd = Math.floor( ct / 86400 );
        var dh = Math.floor( ( ct - dd * 86400 ) / 3600 );
        var dm = Math.floor( ( ct - dd * 86400 - dh * 3600 ) / 60 );
        var ds = ct % 60;
        el.innerHTML = ( dd == 0 ? '' : ( (dd < 10) ? '0' : '' ) + dd + ':' ) + ( dd == 0 && dh == 0 ? '' : ( (dh < 10) ? '0' : '' ) + dh + ':' ) + ( (dm < 10) ? '0' : '' ) + dm + ':' + ( (ds < 10) ? '0' : '') + ds;

        if ( ct == 0 )
        {
            hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );

            if ( t == 'h' )
            {
                title_hl.style.color = '#f5c137';
                title_hl.title = health_alert_tn;
                if ( hwmtimerestore["hwm_time_health_alert"] == 'yes' )
                {
                    hwmtimerestore["hwm_time_health_alert"] = 'no';
                    setTimeout(function() { alert( alert_health ); }, 100);
                }
            }
            if ( t == 'w' && hwmtimerestore["hwm_time_work_end_yes"] != 'yes' && hwmtimerestore["hwm_time_work_alert"] == 'yes' )
            {
                hwmtimerestore["hwm_time_work_end_yes"] = 'yes';
                setTimeout(function() { alert( alert_work ); }, 100);
            }
            if ( t == 'sm' && hwmtimerestore["hwm_time_sm_end_yes"] != 'yes' && hwmtimerestore["hwm_time_sm_alert"] == 'yes' )
            {
                hwmtimerestore["hwm_time_sm_end_yes"] = 'yes';
                setTimeout(function() { alert( alert_sm ); }, 100);
            }
            if ( t == 'gn' && hwmtimerestore["hwm_time_gn_end_yes"] != 'yes' && hwmtimerestore["hwm_time_gn_alert"] == 'yes' )
            {
                hwmtimerestore["hwm_time_gn_end_yes"] = 'yes';
                setTimeout(function() { alert( alert_gn ); }, 100);
            }
            if ( t == 'go' && hwmtimerestore["hwm_time_go_end_yes"] != 'yes' && hwmtimerestore["hwm_time_go_alert"] == 'yes' )
            {
                hwmtimerestore["hwm_time_go_end_yes"] = 'yes';
                setTimeout(function() { alert( alert_go ); }, 100);
            }
            if ( t == 'gv' && hwmtimerestore["hwm_time_gv_end_yes"] != 'yes' && hwmtimerestore["hwm_time_gv_alert"] == 'yes' )
            {
                hwmtimerestore["hwm_time_gv_end_yes"] = 'yes';
                setTimeout(function() { alert( alert_gv ); }, 100);
            }

            GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
            return;
        }
        if ( ct < 0 )
        {
            el.innerHTML = '00:00';
            return;
        }
        setTimeout( function() { showtime( t ) }, 999 );
    }

    function settings_close()
    {
        var bg = $('bgOverlay');
        var bgc = $('bgCenter');
        bg.parentNode.removeChild(bg);
        bgc.parentNode.removeChild(bgc);
    }

    function settings()
    {
        var bg = $('bgOverlay');
        var bgc = $('bgCenter');
        var bg_height = ScrollHeight();

        if ( !bg )
        {
            bg = document.createElement('div');
            document.body.appendChild( bg );

            bgc = document.createElement('div');
            document.body.appendChild( bgc );
        }

        bg.id = 'bgOverlay';
        bg.style.position = 'absolute';
        bg.style.left = '0px';
        bg.style.width = '100%';
        bg.style.background = "#000000";
        bg.style.opacity = "0.5";
        bg.style.zIndex = "1100";

        bgc.id = 'bgCenter';
        bgc.style.position = 'absolute';
        bgc.style.left = ( ( ClientWidth() - 650 ) / 2 ) + 'px';
        bgc.style.width = '650px';
        bgc.style.background = "#F6F3EA";
        bgc.style.zIndex = "1105";

        addEvent(bg, "click", settings_close);

        if ( url.match('lordswm') ) {

            var st_start = 'All settings adjustments will apply after page is reloaded';
            var st_null_timers = 'Reset all timers';
            var st_clear_data = 'Delete other user settings';
            var st_gv_n_time = 'Set TG/RG timer for once to';
            var st_gv_n_time2 = 'minutes';
            var st_percent_faster = 'Quests HG, MG, TG, RG more often';
            var st_percent_faster2 = 'percent';
            var st_gre_check = 'Immediately initiate Rangers\' guild battle on arrival';
            var st_show_timers = 'Show timers:';
            var st_author = 'Script author';
            var st_predupr_pa = '<b>Abu-Bakir\'s Charm</b> is detected automatically';
            var st_work_trudogolik_show = 'Notify about workaholic penalty only 2 workshifts away';
            var st_work_trudogolik_off = 'Turn off all notifications on workaholic penalty';
            var st_predupr_go_lic = '<b>Hunter license</b> is detected automatically in Hunters\' Guild';
            var st_go_timer_hide = 'Hide';

        } else {

            var st_start = '\u0412\u0441\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0431\u0443\u0434\u0443\u0442 \u0432\u0438\u0434\u043D\u044B \u043F\u043E\u0441\u043B\u0435 \u043F\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B';
            var st_null_timers = '\u041E\u0431\u043D\u0443\u043B\u0438\u0442\u044C \u0432\u0441\u0435 \u0442\u0430\u0439\u043C\u0435\u0440\u044B';
            var st_clear_data = '\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0434\u0440. \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439';
            var st_gv_n_time = '\u0415\u0434\u0438\u043D\u043E\u0440\u0430\u0437\u043E\u0432\u043E \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0442\u0430\u0439\u043C\u0435\u0440 \u0413\u0412/\u0413\u0420\u0436 \u0440\u0430\u0432\u043D\u044B\u043C';
            var st_gv_n_time2 = '\u043C\u0438\u043D\u0443\u0442';
            var st_percent_faster = '\u0417\u0430\u0434\u0430\u043D\u0438\u044F \u0413\u041E, \u0413\u041D, \u0413\u0412, \u0413\u0420\u0436 \u0447\u0430\u0449\u0435 \u043D\u0430';
            var st_percent_faster2 = '\u043F\u0440\u043E\u0446\u0435\u043D\u0442\u043E\u0432';
            var st_gre_check = '\u041F\u043E \u043F\u0440\u0438\u0431\u044B\u0442\u0438\u0438 \u0432\u0441\u0442\u0443\u043F\u0430\u0442\u044C \u0432 \u0431\u043E\u0438 \u0413\u0438\u043B\u044C\u0434\u0438\u0438 \u0420\u0435\u0439\u043D\u0434\u0436\u0435\u0440\u043E\u0432';
            var st_show_timers = '\u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0442\u044C \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0435 \u0442\u0430\u0439\u043C\u0435\u0440\u044B:';
            var st_author = '\u0410\u0432\u0442\u043E\u0440 \u0441\u043A\u0440\u0438\u043F\u0442\u0430';
            var st_predupr_pa = '<b>\u0411\u043B\u0430\u0433\u043E\u0441\u043B\u043E\u0432\u0435\u043D\u0438\u0435 \u0410\u0431\u0443-\u0411\u0435\u043A\u0440\u0430</b> \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u044F\u0435\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438';
            var st_work_trudogolik_show = '\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0448\u0442\u0440\u0430\u0444 \u0442\u0440\u0443\u0434\u043E\u0433\u043E\u043B\u0438\u043A\u0430 \u0442\u043E\u043B\u044C\u043A\u043E \u0437\u0430 2 \u0447\u0430\u0441\u0430';
            var st_work_trudogolik_off = '\u041E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0432\u0441\u0435 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u043E \u0448\u0442\u0440\u0430\u0444\u0435 \u0442\u0440\u0443\u0434\u043E\u0433\u043E\u043B\u0438\u043A\u0430';
            var st_predupr_go_lic = '<b>\u041B\u0438\u0446\u0435\u043D\u0437\u0438\u044F \u043E\u0445\u043E\u0442\u043D\u0438\u043A\u0430</b> \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u044F\u0435\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u0432 \u0413\u0438\u043B\u044C\u0434\u0438\u0438 \u041E\u0445\u043E\u0442\u043D\u0438\u043A\u043E\u0432';
            var st_go_timer_hide = '\u0421\u043A\u0440\u044B\u0432\u0430\u0442\u044C';

        }

        hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );

        bgc.innerHTML = '<div style="border:1px solid #abc;padding:5px;margin:2px;"><div style="float:right;border:1px solid #abc;width:15px;height:15px;text-align:center;cursor:pointer;" id="bt_close_tr" title="Close">x</div><table>'+
            '<tr><td>'+st_start+'<br><br></td></tr>'+

            '<tr><td>'+st_show_timers+'&nbsp;&nbsp;'+gr_t+':<input type=checkbox '+(hwmtimerestore["hwm_gr_show_check"]=="1"?"checked":"")+' id=hwm_gr_show_check_id title="">'+
            '&nbsp;&nbsp;'+gk_t+':<input type=checkbox '+(hwmtimerestore["hwm_gk_show_check"]=="1"?"checked":"")+' id=hwm_gk_show_check_id title="">'+
            '&nbsp;&nbsp;'+gn_t+':<input type=checkbox '+(hwmtimerestore["hwm_gn_show_check"]=="1"?"checked":"")+' id=hwm_gn_show_check_id title="">'+
            '&nbsp;&nbsp;'+go_t+':<input type=checkbox '+(hwmtimerestore["hwm_go_show_check"]=="1"?"checked":"")+' id=hwm_go_show_check_id title="">'+
            '&nbsp;&nbsp;'+gv_t+' ('+gre_t+')'+':<input type=checkbox '+(hwmtimerestore["hwm_gv_show_check"]=="1"?"checked":"")+' id=hwm_gv_show_check_id title=""><br><br></td></tr>'+

            '<tr><td>'+st_gre_check+': <input type=checkbox '+(hwmtimerestore["hwm_gre_check"]=="1"?"checked":"")+' id=hwm_gre_check_id title=""></td></tr>'+
            '<tr><td>'+st_go_timer_hide+' "<i>'+regexp_go_timer+' ..</i>": <input type=checkbox '+(hwmtimerestore["hwm_go_timer_hide"]=="1"?"checked":"")+' id=hwm_go_timer_hide_id title=""><br><br></td></tr>'+

            '<tr><td>'+st_work_trudogolik_off+': <input type=checkbox '+(hwmtimerestore["hwm_time_work_trudogolik_off"]=="1"?"checked":"")+' id=hwm_trudogolik_off_id title=""></td></tr>'+
            '<tr><td>'+st_work_trudogolik_show+': <input type=checkbox '+(hwmtimerestore["hwm_time_work_trudogolik_show"]=="1"?"checked":"")+' id=hwm_trudogolik_show_id title=""><br><br></td></tr>'+

            '<tr><td>'+st_predupr_pa+'</td></tr>'+

            '<tr><td>'+st_predupr_go_lic+'</td></tr>'+

            '<tr><td>'+st_percent_faster+' <input id="gv_n_percent" value="'+
            ( 100 - hwmtimerestore["hwm_time_percent_faster"] * 100 )+
            '" size="1" maxlength="2"> <b>'+st_percent_faster2+'</b> <input type="submit" id="gv_n_percent_ok" value="ok"></td></tr>'+

            '<tr><td>'+st_gv_n_time+' <input id="gv_n_time" value="'+
            ( 60 * hwmtimerestore["hwm_time_percent_faster"] * hwmtimerestore["hwm_time_percent_prem"] )+
            '" size="1" maxlength="2"> '+st_gv_n_time2+' <input type="submit" id="gv_n_time_ok" value="ok"><br><br></td></tr>'+

            '<tr><td><input type="submit" id="null_tr_id" disabled value="'+st_null_timers+'"> <input type="submit" id="clear_data_id" disabled value="'+st_clear_data+'"></td></tr>'+

            '</table><table width=100%>'+
            '<tr><td style="text-align:right">'+st_author+': <a href="pl_info.php?id=15091">Demin</a> <a href="javascript:void(0);" id="open_transfer_id">?</a></td></tr>'+
            '</table></div>';

        addEvent($("bt_close_tr"), "click", settings_close);
        addEvent($("null_tr_id"), "click", null_tr);
        addEvent($("clear_data_id"), "click", clear_data);
        addEvent($("gv_n_time_ok"), "click", gv_n_time_f);
        addEvent($("gv_n_percent_ok"), "click", gv_n_percent_f);
        addEvent($("hwm_gre_check_id"), "click", check_gre_f);
        addEvent($("hwm_trudogolik_show_id"), "click", hwm_trudogolik_show_f);
        addEvent($("hwm_trudogolik_off_id"), "click", hwm_trudogolik_off_f);
        addEvent($("hwm_go_timer_hide_id"), "click", hwm_go_timer_hide_f);

        addEvent($("hwm_gr_show_check_id"), "click", hwm_gr_show_check_id_f);
        addEvent($("hwm_gk_show_check_id"), "click", hwm_gk_show_check_id_f);
        addEvent($("hwm_gn_show_check_id"), "click", hwm_gn_show_check_id_f);
        addEvent($("hwm_go_show_check_id"), "click", hwm_go_show_check_id_f);
        addEvent($("hwm_gv_show_check_id"), "click", hwm_gv_show_check_id_f);
        addEvent($("open_transfer_id"), "click", open_transfer_f);

        bg.style.top = '0px';
        bg.style.height = bg_height + 'px';
        bgc.style.top = ( window.pageYOffset + 150 ) + 'px';
        bg.style.display = '';
        bgc.style.display = '';
    }

    function gv_n_time_f()
    {
        if ( Number( $("gv_n_time").value ) >= 0 ) {
            hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
            hwmtimerestore["hwm_time_gv_end"] = '' + ( (new Date()).getTime() + $("gv_n_time").value * 60000 );
            hwmtimerestore["hwm_time_gv_end_yes"] = 'no';
            GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
        }
    }

    function gv_n_percent_f()
    {
        if ( Number( $("gv_n_percent").value ) >= 0 ) {
            hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
            hwmtimerestore["hwm_time_percent_faster"] = '' + ( ( 100 - $("gv_n_percent").value )/100 );
            $("gv_n_time").value = ( 60 * hwmtimerestore["hwm_time_percent_faster"] * hwmtimerestore["hwm_time_percent_prem"] );
            GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
        }
    }

    function go_link_help_click()
    {
        var form_go_link_help = document.querySelectorAll("form[action='/map.php']");

        for ( var i=form_go_link_help.length; i--; ) {
            var input_form_go_link_help = form_go_link_help[i].querySelector("input[type='submit']");

            addEvent
            (
                input_form_go_link_help,
                "click",
                function( event )
                {
                    hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
                    hwmtimerestore["hwm_map_hunter"] = 'true';
                    GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
                }
            );
        }
    }

    function null_tr()
    {
        // udalit' svoi nastrojki
        if ( typeof GM_listValues != 'function' ) {
            GM_listValues=function () {
                var values = [];
                for (var i=0; i<localStorage.length; i++) {
                    values.push(localStorage.key(i));
                }
                return values;
            }
        }
        var clear_d = GM_listValues();
        var clear_d_len = clear_d.length;
        alert(clear_d);
        for (var i=clear_d_len; i--;) {
            if ( clear_d[i].match(nick) ) {
                GM_deleteValue(clear_d[i]);
            }
        }
    }

    function clear_data()
    {
        // udalit' nastrojki drugih uzerov
        if ( typeof GM_listValues != 'function' ) {
            GM_listValues=function () {
                var values = [];
                for (var i=0; i<localStorage.length; i++) {
                    values.push(localStorage.key(i));
                }
                return values;
            }
        }
        var clear_d = GM_listValues();
        var clear_d_len = clear_d.length;
        alert(clear_d);
        for (var i=clear_d_len; i--;) {
            if ( !clear_d[i].match(nick) ) {
                GM_deleteValue(clear_d[i]);
            }
        }
    }

    function check_gre_f()
    {
        if ( $('hwm_gre_check_id').checked == true ) {
            hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
            hwmtimerestore["hwm_gre_check"] = '1';
        } else {
            hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
            hwmtimerestore["hwm_gre_check"] = '0';
        }
        GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
    }

    function hwm_trudogolik_show_f()
    {
        if ( $('hwm_trudogolik_show_id').checked == true ) {
            hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
            hwmtimerestore["hwm_time_work_trudogolik_show"] = '1';
        } else {
            hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
            hwmtimerestore["hwm_time_work_trudogolik_show"] = '0';
        }
        GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
    }

    function hwm_trudogolik_off_f()
    {
        if ( $('hwm_trudogolik_off_id').checked == true ) {
            hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
            hwmtimerestore["hwm_time_work_trudogolik_off"] = '1';
        } else {
            hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
            hwmtimerestore["hwm_time_work_trudogolik_off"] = '0';
        }
        GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
    }

    function hwm_go_timer_hide_f()
    {
        if ( $('hwm_go_timer_hide_id').checked == true ) {
            hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
            hwmtimerestore["hwm_go_timer_hide"] = '1';
        } else {
            hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
            hwmtimerestore["hwm_go_timer_hide"] = '0';
        }
        GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
    }

    // +++++++++++++++++++++++++++++++++++

    function hwm_gr_show_check_id_f()
    {
        hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
        if ( $('hwm_gr_show_check_id').checked == true ) {
            hwmtimerestore["hwm_gr_show_check"] = '1';
            $("gr_show1").style.display = $("gr_show2").style.display = '';
        } else {
            hwmtimerestore["hwm_gr_show_check"] = '0';
            var title_gr = $('a_pers_w');
            hwmtimerestore["hwm_time_work_alert"] = 'no';
            title_gr.style.color = '#f5c137';
            title_gr.title = work_alert_tn;
            $("gr_show1").style.display = $("gr_show2").style.display = 'none';
        }
        GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
    }

    function hwm_gk_show_check_id_f()
    {
        hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
        if ( $('hwm_gk_show_check_id').checked == true ) {
            hwmtimerestore["hwm_gk_show_check"] = '1';
            $("gk_show1").style.display = $("gk_show2").style.display = '';
        } else {
            hwmtimerestore["hwm_gk_show_check"] = '0';
            var title_sm = $('a_pers_sm');
            hwmtimerestore["hwm_time_sm_alert"] = 'no';
            title_sm.style.color = '#f5c137';
            title_sm.title = sm_alert_tn;
            $("gk_show1").style.display = $("gk_show2").style.display = 'none';
        }
        GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
    }

    function hwm_gn_show_check_id_f()
    {
        hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
        if ( $('hwm_gn_show_check_id').checked == true ) {
            hwmtimerestore["hwm_gn_show_check"] = '1';
            $("gn_show1").style.display = $("gn_show2").style.display = '';
        } else {
            hwmtimerestore["hwm_gn_show_check"] = '0';
            var title_gn = $('a_pers_gn');
            hwmtimerestore["hwm_time_gn_alert"] = 'no';
            title_gn.style.color = '#f5c137';
            title_gn.title = gn_alert_tn;
            $("gn_show1").style.display = $("gn_show2").style.display = 'none';
        }
        GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
    }

    function hwm_go_show_check_id_f()
    {
        hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
        if ( $('hwm_go_show_check_id').checked == true ) {
            hwmtimerestore["hwm_go_show_check"] = '1';
            $("go_show1").style.display = $("go_show2").style.display = '';
        } else {
            hwmtimerestore["hwm_go_show_check"] = '0';
            var title_go = $('a_pers_go');
            hwmtimerestore["hwm_time_go_alert"] = 'no';
            title_go.style.color = '#f5c137';
            title_go.title = go_alert_tn;
            $("go_show1").style.display = $("go_show2").style.display = 'none';
        }
        GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
    }

    function hwm_gv_show_check_id_f()
    {
        hwmtimerestore = JSON.parse( GM_getValue( nick+"hwmtimerestore", '{}' ) );
        if ( $('hwm_gv_show_check_id').checked == true ) {
            hwmtimerestore["hwm_gv_show_check"] = '1';
            $("gv_show1").style.display = $("gv_show2").style.display = '';
        } else {
            hwmtimerestore["hwm_gv_show_check"] = '0';
            var title_gv = $('a_pers_gv');
            hwmtimerestore["hwm_time_gv_alert"] = 'no';
            title_gv.style.color = '#f5c137';
            title_gv.title = gv_alert_tn;
            $("gv_show1").style.display = $("gv_show2").style.display = 'none';
        }
        GM_setValue( nick+"hwmtimerestore", JSON.stringify(hwmtimerestore) );
    }

    // -----------------------------------

    function open_transfer_f()
    {
        if ( location.href.match('lordswm') )
        {
            window.location = "transfer.php?nick=demin&shortcomment=Transferred 10000 Gold 5 Diamonds";
        } else {
            window.location = "transfer.php?nick=demin&shortcomment=%CF%E5%F0%E5%E4%E0%ED%EE%2010000%20%C7%EE%EB%EE%F2%EE%205%20%C1%F0%E8%EB%EB%E8%E0%ED%F2%FB";
        }
    }

    function ClientHeight() {
        return document.compatMode=='CSS1Compat' && document.documentElement?document.documentElement.clientHeight:document.body.clientHeight;
    }

    function ClientWidth() {
        return document.compatMode=='CSS1Compat' && document.documentElement?document.documentElement.clientWidth:document.body.clientWidth;
    }

    function ScrollHeight() {
        return Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
    }

    function $(id) { return document.querySelector("#"+id); }

    function addEvent(elem, evType, fn) {
        if (elem.addEventListener) {
            elem.addEventListener(evType, fn, false);
        }
        else if (elem.attachEvent) {
            elem.attachEvent("on" + evType, fn);
        }
        else {
            elem["on" + evType] = fn;
        }
    }

})();