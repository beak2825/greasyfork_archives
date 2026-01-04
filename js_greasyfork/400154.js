// ==UserScript==
// @name         Fake Admin VK
// @name:en      Fake Admin VK
// @namespace    Fake Admin VK
// @version      2.0
// @description  Extension for VK giving Fake   штAdmin
// @description:en    Extension for VK giving Fake  Admin
// @author       artelaw
// @include        *://vk.com/*
// @include        *://vkontakte.com/*
// @exclude        *://vk.com/notifier.php*
// @exclude        *://vk.com/*widget*.php*
// @exclude        *://vkontakte.com/notifier.php*
// @exclude        *://vkontakte.com/*widget*.php*
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @resource groups_edit_css  https://vk.com/css/al/groups_edit.css
// @resource groups_css  https://vk.com/css/al/groups.css
// @resource ui_controls_css  https://vk.com/css/ui_controls.css
// @resource payments https://vk.com/css/al/payments.css
// @resource exchange_css  https://vk.com/css/al/exchange.css
// @grant    GM_addStyle
// @grant    GM_getResourceText
// @grant          GM_xmlhttpRequest
// @connect        vk.com
// @downloadURL https://update.greasyfork.org/scripts/400154/Fake%20Admin%20VK.user.js
// @updateURL https://update.greasyfork.org/scripts/400154/Fake%20Admin%20VK.meta.js
// ==/UserScript==
(function() {

    var add_speed = 500;
    if (!localStorage.getItem("deletedPosts")) {//если в кэше не найдена переменная deletedPosts, то создается
        localStorage.setItem("deletedPosts", JSON.stringify({}));
    }


    /*
    *Счетчики default
    */
    var left_counts = {
    };
    var gdb_count=8;//Заявки Геодб
    var ct_count=29;//Страны
    var bt_count=246;//Баг-трекер
    var nm_count=1085;//Имена
    var tr_count=6;//Переводы
    for (var key in left_counts) {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, left_counts[key]);
        }
    }
    /*
    *Счетчики default
    */
    var line_wrap_menu = "<div class=\"page_actions_separator\"></div>";//линия разделения пунктов в выпадающем меню
    setInterval(function() {
        var menu;
        if (pageType() == "profile") {
            menu = document.getElementsByClassName("page_actions_inner")[0];
            if (menu && !hasClass(menu, "admin_panel_on")) panelToProfile(menu);
        } else if (pageType() == "app") {
            var app_panel_info = document.getElementsByClassName("apps_options_bar_left")[0];
            if (app_panel_info && !hasClass(app_panel_info, "admin_panel_on")) panelToApp(app_panel_info);
        } else if (pageType() == "bugtracker") {
            var menu_bt = document.getElementsByClassName("page_block ui_rmenu ui_rmenu_pr")[0];
            if (menu_bt && !hasClass(menu_bt, "admin_panel_on")) panelToBt(menu_bt);
        }


    }, add_speed);



    function panelToBt(menu_bt) {
        menu_bt.className +=" admin_panel_on";
        if (!menu_bt.querySelector("#ui_rmenu_my_page")) {
            menu_bt.innerHTML+="\
<a id=\"ui_rmenu_updates\" href=\"bugtracker?act=updates\" class=\"ui_rmenu_item _ui_item_updates\" onclick=\"return uiRightMenu.go(this, event, undefined, {ignoreSelected: true});\">\
<span>Обновления</span>\
</a>\
<a id=\"ui_rmenu_shop\" href=\"bugtracker?act=shop\" class=\"ui_rmenu_item _ui_item_updates\" onclick=\"return uiRightMenu.go(this, event, undefined, {ignoreSelected: true});\">\
<span>Магазин</span>\
</a>\
<div class=\"ui_rmenu_sep\"></div>\
<a id=\"ui_rmenu_my_page\" href=\"bugtracker?act=shop\" class=\"ui_rmenu_item _ui_item_my_page\" onclick=\"return uiRightMenu.go(this, event, undefined, {ignoreSelected: true});\">\
<span>Моя карточка</span>\
</a>\
<a id=\"ui_rmenu_my_reports\" href=\"bugtracker?act=my\" class=\"ui_rmenu_item _ui_item_my_reports\" onclick=\"return uiRightMenu.go(this, event, undefined, {ignoreSelected: true});\">\
<span>Мои отчёты</span>\
</a>\
<a id=\"ui_rmenu_my_bookmarks\" href=\"bugtracker?act=bookmarks\" class=\"ui_rmenu_item _ui_item_my_bookmarks\" onclick=\"return uiRightMenu.go(this, event, undefined, {ignoreSelected: true});\">\
<span>Мои закладки</span>\
</a>\
";
        }
        menu_bt.innerHTML +="<div class=\"ui_rmenu_sep\"></div>\
<a id=\"ui_rmenu_c_products\" href=\"bugtracker?controlpanel=products\" class=\"ui_rmenu_item _ui_item_c_products\" onclick=\"return uiRightMenu.go(this, event, undefined, {ignoreSelected: true});\">\
<span>Управление продуктами</span>\
</a>\
<a id=\"ui_rmenu_c_requests\" href=\"bugtracker?controlpanel=requests\" class=\"ui_rmenu_item _ui_item_c_requests\" onclick=\"return uiRightMenu.go(this, event, undefined, {ignoreSelected: true});\">\
<span>Заявки</span>\
</a>\
<a id=\"ui_rmenu_c_important\" href=\"bugtracker?controlpanel=important\" class=\"ui_rmenu_item _ui_item_c_important\" onclick=\"return uiRightMenu.go(this, event, undefined, {ignoreSelected: true});\">\
<span>Важные отчеты</span>\
</a>\
<a id=\"ui_rmenu_c_moders\" href=\"bugtracker?controlpanel=moderators\" class=\"ui_rmenu_item _ui_item_c_moders\" onclick=\"return uiRightMenu.go(this, event, undefined, {ignoreSelected: true});\">\
<span>Модераторы</span>\
</a>";
    }

    function panelToApp(pinfo) {
        var id = document.getElementsByClassName("app_container")[0].id.split("app_")[1].split("_container")[0];
        addStyle(".apps_options_bar{height: 68px;}");
        pinfo.className +=" admin_panel_on";
        pinfo.innerHTML +='<div style=\"line-height: 0;top: 45px;\"><br><div style=\"color: #929196;\">надежное, баланс: 11756, <a href=\"/editapp?id='+id+'\" style=\"color: #42648b;\">Управление игрой</a>, <a id=\"admin_app_info\" style=\"color: #42648b;\">Информация</a></div></div>';
        $("#admin_app_info")
            .click(function() {
            Admin.appInfo(id);
        });

    }

    var sidebar = document.getElementById("side_bar_inner")
    .children[0].children[0];

    if (sidebar.children[sidebar.children.length - 1].id == "l_bt") {
        sidebar.children[sidebar.children.length - 1].parentNode.removeChild(sidebar.children[sidebar.children.length - 1]);
        sidebar.children[sidebar.children.length - 1].parentNode.removeChild(sidebar.children[sidebar.children.length - 1]);
    }
    sidebar.innerHTML += '<div class="more_div"></div>';
    sidebar.innerHTML += '<li id="l_gbd" class=""><a onclick="history.pushState(null, null, \'/geodb?act=requests\');" class="left_row">\ <span class="left_fixer"><span class="left_count_wrap fl_r"><span class="inl_bl left_count">'+gdb_count+'</span></span>\ <span class="left_icon fl_l"></span>\ <span class="left_label inl_bl">Заявки Геодб</span>\ </span>\ </a>\ <div class="left_settings" onclick="menuSettings(3)">\ <div class="left_settings_inner"></div>\ </div>\ </li>';
    sidebar.innerHTML += '<li id="l_ct" class=""><a onclick="history.pushState(null, null, \'/geodb\');" class="left_row">\ <span class="left_fixer"><span class="left_count_wrap fl_r"><span class="inl_bl left_count">'+ct_count+'</span></span>\ <span class="left_icon fl_l"></span>\ <span class="left_label inl_bl">Страны</span>\ </span>\ </a>\ <div class="left_settings" onclick="menuSettings(3)">\ <div class="left_settings_inner"></div>\ </div>\ </li>';
    sidebar.innerHTML += '<li id="l_bt" class=""><a href="/bugtracker" class="left_row">\ <span class="left_fixer"><span class="left_count_wrap fl_r"><span class="inl_bl left_count">'+bt_count+'</span></span>\ <span class="left_icon fl_l"></span>\ <span class="left_label inl_bl">Баг-трекер</span>\ </span>\ </a>\ <div class="left_settings" onclick="menuSettings(3)">\ <div class="left_settings_inner"></div>\ </div>\ </li>';
    sidebar.innerHTML += '<li id="l_nm" class=""><a onclick="history.pushState(null, null, \'/names_admin.php\');" class="left_row">\ <span class="left_fixer"><span class="left_count_wrap fl_r"><span class="inl_bl left_count">'+nm_count+'</span></span>\ <span class="left_icon fl_l"></span>\ <span class="left_label inl_bl">Имена</span>\ </span>\ </a>\ <div class="left_settings" onclick="menuSettings(3)">\ <div class="left_settings_inner"></div>\ </div>\ </li>';
    sidebar.innerHTML += '<li id="l_tr" class=""><a onclick="history.pushState(null, null, \'/translation.php\');" class="left_row">\ <span class="left_fixer"><span class="left_count_wrap fl_r"><span class="inl_bl left_count">'+tr_count+'</span></span>\ <span class="left_icon fl_l"></span>\ <span class="left_label inl_bl">Переводы</span>\ </span>\ </a>\ <div class="left_settings" onclick="menuSettings(3)">\ <div class="left_settings_inner"></div>\ </div>\ </li>';
    jQuery.fn.exists = function() {
        return $(this).length;
    };
    var Admin = {
        user_del: function() {
            var user_name = document.getElementsByClassName('page_name')[0].innerHTML;
            var box = new MessageBox({});
            box.setOptions({
                title: 'Удаление пользователя'
            });
            box.addButton('Да', function() {
                showDoneBox('<center>Пользователь "' + user_name + '" был успешно удален!</center>', {
                    w: 350
                });
                box.hide();
            });
            box.addButton('Нет', box.hide, 'no');
            box.content('Вы действительно хотите удалить пользователя "' + user_name + '"?');
            box.show();
        },
        user_ban: function() {
            var user_name = document.getElementsByClassName('page_name')[0].innerHTML;
            var box = new MessageBox({});
            box.setOptions({
                title: 'Блокировка пользователя'
            });
            box.addButton('Да', function() {
                showDoneBox('<center>Пользователь "' + user_name + '" был успешно заблокирован!</center>', {
                    w: 350
                });
                box.hide();
            });
            box.addButton('Нет', box.hide, 'no');
            box.content('Вы действительно хотите заблокировать пользователя "' + user_name + '"?<br>Комментарий модератора о причине блокировки: <div class="pedit_labeled"><textarea id="pedit_interests_quotes" class="dark" autocomplete="off" style="overflow: hidden; resize: none;"></textarea></div>');
            box.show();
        },
        user_info: function() {
            var user_name = document.getElementsByClassName('page_name')[0].innerHTML;
            var info_content = document.getElementById('page_info_wrap').innerHTML;
            var box = new MessageBox({});
            box.setOptions({
                title: 'Информация о пользователе ' + user_name + ''
            });
            box.addButton('Продолжить', box.hide);
            box.content('' + info_content + '');
            box.show();
        },
        balance_edit: function() {
            var box = new MessageBox({});
            box.setOptions({
                title: '<center>Редактирование баланса [BETA]</center>'
            });
            box.addButton('Продолжить', box.hide);
            box.content('  <div class="payments_box_summary clear_fix">    <div class="payments_summary_cont">Вы собираетесь редактировать Ваш счёт голосов ВКонтакте.<div class="payments_summary_notice"></div></div>  </div>    <div id="payments_box_error"></div>  <div id="payments_getvotes_other" style="display: none;"></div>  <div id="payments_getvotes_wrap">    <div id="payments_getvotes_method">            <a class="payments_getvotes_method_opt " onclick="cur.paymetsGetVotesAmounts(false, \'card\', this);">  <div class="pr " id=""><div class="pr_bt"></div><div class="pr_bt"></div><div class="pr_bt"></div></div>  <div class="payments_getvotes_method_img payments_method_card">&nbsp;</div>  <div class="payments_getvotes_method_text">    <div class="payments_getvotes_method_title">Банковская карта</div>    <span id="payments_method_card_descr">Mastercard, Maestro, Visa, Мир</span>  </div></a><a class="payments_getvotes_method_opt " onclick="cur.paymetsGetVotesAmounts(false, \'sms\', this);">  <div class="pr " id=""><div class="pr_bt"></div><div class="pr_bt"></div><div class="pr_bt"></div></div>  <div class="payments_getvotes_method_img payments_method_sms">&nbsp;</div>  <div class="payments_getvotes_method_text">    <div class="payments_getvotes_method_title">Мобильный телефон</div>    <span id="payments_method_sms_descr">Fake оплата со счёта мобильного телефона</span>  </div></a><a class="payments_getvotes_method_opt " onclick="cur.paymetsGetVotesAmounts(false, \'ps\', this);">  <div class="pr " id=""><div class="pr_bt"></div><div class="pr_bt"></div><div class="pr_bt"></div></div>  <div class="payments_getvotes_method_img payments_method_ps">&nbsp;</div>  <div class="payments_getvotes_method_text">    <div class="payments_getvotes_method_title">Электронные деньги</div>    <span id="payments_method_ps_descr">WebMoney, Яндекс.Деньги, QIWI Кошелёк, PayPal (Акция!) </span>  </div></a><a class="payments_getvotes_method_opt " onclick="cur.paymetsGetVotesAmounts(false, \'offers\', this);">  <div class="pr " id=""><div class="pr_bt"></div><div class="pr_bt"></div><div class="pr_bt"></div></div>  <div class="payments_getvotes_method_img payments_method_offers">&nbsp;</div>  <div class="payments_getvotes_method_text">    <div class="payments_getvotes_method_title">Специальные предложения</div>    <span id="payments_method_offers_descr">Редактирование бесплатных получений голосов</span>  </div></a><p class="payments_about_votes">Голоса – универсальная условная единица для приобретения платных возможностей приложений ВКонтакте, а также подарков и стикеров.</p>    </div>    <div id="payments_getvotes_cont"></div>    <div id="payments_getvotes_phone" class="payments_getvotes_phone">      <p class="payments_getvotes_phone_msg _msg">Пожалуйста, укажите <b>номер телефона</b> для оплаты через SMS:</p>      <div class="payments_form_row">        <div id="container1" class="selector_container big limited_height" style="width: 200px;"><table cellspacing="0" cellpadding="0" class="selector_table">    <tbody><tr>      <td class="selector">        <div class="placeholder_wrap1" style="display: none;">          <div class="placeholder_wrap2">            <div class="placeholder_content" style="color: rgb(124, 127, 130);"></div>            <div class="placeholder_cover"></div>          </div>        </div>        <div class="selected_items_wrap"><div class="scroll_fader_top"></div>        <span class="selected_items"></span>        <div class="scroll_fader_bottom"></div></div>        <input type="text" class="selector_input selected" style="color: rgb(34, 34, 34); width: 163px;">        <input type="hidden" name="phone_country" id="phone_country" value="65" class="resultField">        <input type="hidden" name="phone_country_custom" id="phone_country_custom" value="" class="customField">      </td><td id="dropdown1" class="selector_dropdown" style="width: 26px;">&nbsp;</td>    </tr>  </tbody></table>  <div class="results_container">    <div class="result_list dividing_line" style="display: none; opacity: 1; width: 200px;"><ul id="list_options_container_1"></ul></div>  </div></div>      </div>      <div class="payments_form_row">        <div class="prefix_input_wrap">          <div id="payments_phone_prefix" class="prefix_input_prefix" onclick="elfocus(geByTag1(\'input\', this.parentNode), 0, 0);">+49</div>          <div class="prefix_input_field">            <input id="phone" type="text" class="prefix_input" onkeydown="if (event.keyCode==13) { cur.paymentsSaveSmsPhone(); }" autocomplete="off">            <div class="prefix_input_border"></div>          </div>        </div>      </div>    </div>    <div id="payments_getvotes_confirm">      <p id="payments_getvotes_confirm_msg" class="msg"></p>      <div class="payments_tform">        <div id="payments_box_confcode_wrap" class="tform_row clear_fix">          <div class="label">Код подтверждения:</div>          <div class="labeled">            <input id="confcode" class="dark" type="text" onkeydown="if (event.keyCode==13) { cur.paymentsSmsSendCode(); }">          </div>        </div>        <div class="tform_row clear_fix">          <div class="label">Количество голосов:</div>          <div class="labeled_l" id="payments_box_votes_num"></div>        </div>        <div class="tform_row clear_fix">          <div class="label" style="padding-bottom: 0;">Сумма оплаты:</div>          <div class="labeled_l" id="payments_box_amount"></div>        </div>        <div id="payments_getvotes_confirm_comm_wrap" class="unshown tform_row clear_fix">          <div class="label">&nbsp;</div>          <div id="payments_getvotes_confirm_comm" class="payments_getvotes_op_msg"></div>        </div>      </div>    </div>    <div id="payments_getvotes_waiting">      <div id="payments_getvotes_waiting_msg" class="msg"></div>      <div id="payments_getvotes_waiting_comm" class="payments_getvotes_op_msg"></div>      <div class="payments_getvotes_footer">Если в течение <b>24 часов</b> голоса не поступят на Ваш счёт, Вы можете обратиться в <a href="/support?act=new_pay">поддержку</a>.</div>    </div>    <div id="payments_getvotes_terminals">      <h2 class="payments_getvotes_title">Оплата наличными через платёжный терминал</h2><p>Для того чтобы пополнить Ваш счёт через терминал оплаты, найдите логотип <b>ВКонтакте</b> в меню терминала (как правило, он расположен в разделах «Социальные сети» или «Другое») и введите Ваш ID: <b>436240084</b></p><div class="payments_getvotes_term_list clear_fix" style="width:0px;">  </div>    </div>    <div id="payments_getvotes_ps">      <h2 class="payments_getvotes_title">Оплата через электронную платёжную систему</h2><p>Вы можете быстро приобрести голоса с помощью электронных платёжных систем.</p><div class="payments_getvotes_ps_list clear_fix" style="">    <a class="payments_getvotes_ps_row payments_getvotes_ps_row_s" href="#" onclick="cur.paymetsGetVotesAmounts(false, \'kiwipurse\', this); return false;">    <img class="payments_getvotes_ps_logo" src="/images/ps/kiwipurse_logo.png">    <div class="payments_getvotes_ps_text">      <div class="pr " id=""><div class="pr_bt"></div><div class="pr_bt"></div><div class="pr_bt"></div></div>      <div class="payments_getvotes_ps_title">Visa QIWI Wallet</div>          </div>  </a>  <a class="payments_getvotes_ps_row payments_getvotes_ps_row_s" href="#" onclick="cur.paymetsGetVotesAmounts(false, \'yandexmoney\', this); return false;">    <img class="payments_getvotes_ps_logo" src="/images/ps/yandexmoney_logo.png">    <div class="payments_getvotes_ps_text">      <div class="pr " id=""><div class="pr_bt"></div><div class="pr_bt"></div><div class="pr_bt"></div></div>      <div class="payments_getvotes_ps_title">Яндекс.Деньги</div>          </div>  </a>  <a class="payments_getvotes_ps_row payments_getvotes_ps_row_s" href="#" onclick="cur.paymetsGetVotesAmounts(false, \'webmoney\', this); return false;">    <img class="payments_getvotes_ps_logo" src="/images/ps/webmoney_logo.png">    <div class="payments_getvotes_ps_text">      <div class="pr " id=""><div class="pr_bt"></div><div class="pr_bt"></div><div class="pr_bt"></div></div>      <div class="payments_getvotes_ps_title">WebMoney</div>          </div>  </a>  <a class="payments_getvotes_ps_row payments_getvotes_ps_row_s" href="#" onclick="cur.paymetsGetVotesAmounts(false, \'paypal_ipn\', this); return false;">    <img class="payments_getvotes_ps_logo" src="/images/ps/paypal_ipn_logo.png">    <div class="payments_getvotes_ps_text">      <div class="pr " id=""><div class="pr_bt"></div><div class="pr_bt"></div><div class="pr_bt"></div></div>      <div class="payments_getvotes_ps_title">PayPal<span class="payments_getvotes_title_offer">Акция</span></div>          </div>  </a></div></div>  </div>  <div id="payments_box_progress" style="display: none;">    <div class="payments_box_spinner"></div>    <div id="payments_box_progress_msg_wrap"><span id="payments_box_progress_msg">Ожидаем завершения оплаты..</span> <a id="payments_box_progress_link" href="#" onclick="cur.paymentsShowTypes(); return false;">Отмена</a></div>  </div>  <div id="payments_getvotes_buttons" class="payments_getvotes_buttons">    <button id="payments_getvotes_submit" class="flat_button" onclick="cur.paymetsShowConfirm();">Получить голоса</button>    <div id="payments_getvotes_back" class="button_cancel inl_bl"></div>  </div>  <div id="payments_iframe_container" class="payments_iframe_container"></div>  <form id="paymentSystemsForm" method="post" accept-charset="windows-1251"></form></div>');
            box.show();
        },
        appInfo: function(id) {
            var box = new MessageBox({});
            box.setOptions({
                title: '<center>Редактирование баланса [BETA]</center>'
            });
            box.addButton('Продолжить', box.hide);
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://api.vk.com/method/apps.get?app_id=" + id,
                onload: function(data) {
                    if (data.status == 200) {
                        var response = JSON.parse(data.responseText);
                        var content = "<div style=\"width:100%;\">";
                        content +="<div style=\"color: #828282;\" class=\"adm_app_info_id\">ID приложения: <div style=\"color:black; display: inline-block;\">"+response.response.id+"</div></div>";
                        content +="<div style=\"color: #828282;\" class=\"adm_app_info_id\">Название: <div style=\"color:black; display: inline-block;\">"+response.response.title+"</div></div>";

                        box.content("<div style=\"word-wrap: break-word;\">"+content+"</div>");
                        content+="</div>";
                        box.show();
                    }
                }
            });


        }
    };

    function left_count_format(int,format = 1){
        var count = number_format(int, 0, ' ', ' ');
        return int>1000 && format>0?'..'+count.substr(-3):count;
    }
    function number_format(number, decimals, dec_point, thousands_sep) {
        number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function(n, prec) {
                var k = Math.pow(10, prec);
                return '' + (Math.round(n * k) / k)
                    .toFixed(prec);
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
            .split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '')
            .length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1)
                .join('0');
        }
        return s.join(dec);
    }
    $('html').keydown(function(e){
        if ($("#l_gbd").is(':hover')) left_count_edit(e,$("#gdb_count"));
        else if ($("#l_ct").is(':hover')) left_count_edit(e,$("#ct_count"));
        else if ($("#l_bt").is(':hover')) left_count_edit(e,$("#bt_count"));
        else if ($("#l_nm").is(':hover')) left_count_edit(e,$("#nm_count"));
        else if ($("#l_tr").is(':hover')) left_count_edit(e,$("#tr_count"));
    });

    function left_count(count,name) {//возврат элемента счетчика с числом
        var style=count>=1?" ":"display:none";
        return "<span title=\""+left_count_format(count,0)+"\" id =\""+name+"_count\" class=\"left_count_wrap fl_r\" style=\""+style+"\"><span class=\"inl_bl left_count\" onkeydown=\"alert(1);\">"+left_count_format(count)+"</span></span>";
    }
    function left_count_edit(e,_this) {//редактирование счетчика
        var count = parseInt(localStorage.getItem(_this.attr("id")));
        if (e.keyCode == 39) { //если нажали Enter, то true

            localStorage.setItem(_this.attr("id"),count+1);
            _this.find(".left_count").html(left_count_format(count+1));
            _this.attr("title",left_count_format(count+1,0));
            if (count+1>=1) {_this.show();};
        }
        else if (e.keyCode == 37) { //если нажали Enter, то true
            if (count>=1) {
                localStorage.setItem(_this.attr("id"),count-1);
                _this.find(".left_count").html(left_count_format(count-1));
                _this.attr("title",left_count_format(count-1,0));
                if (count-1==0) {_this.hide();};
            }
        }
    }
    var fake_votes = document.getElementsByClassName('settings_row_button_wrap')[0];
    //fake_votes.innerHTML += '<br><br><button class="flat_button" id="balance-edit"> Редактор баланса ­</button>';

    $("#balance-edit")
        .click(function() {
        Admin.balance_edit();
    });
    function insertToVkProfile() {//функция с помощью foaf.php + вк апи получает данные о дате регистрации, дате последнего ред. страницы и дате последнего визита пользователя
        var vkUserProfile = document.body.querySelector("#profile_short:not(.display_additional_information_in_vk_profile)");
        if (!vkUserProfile) return;
        var id;
        var el = document.getElementsByClassName("page_block_h2")[0];
        if (el) id = el.children[0].children[0].children[0].href.split("wall")[1];
        if (!id) return;
        vkUserProfile.className += " display_additional_information_in_vk_profile";
        var vkPageLang = document.body.querySelector("a.ui_actions_menu_item[onclick*=\"lang_dialog\"]");
        var vkCurrentLang;
        if (vkPageLang) {
            vkCurrentLang = vkPageLang.textContent;
        } else {
            vkCurrentLang = navigator.language.substring(0,2);
        }
        var vkRegMonthName, vkLastSeenPlatformName;

        vkRegMonthName = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
        vkLastSeenPlatformName = ["мобильная версия сайта или неофициальное мобильное приложение", "оф. приложение для iPhone", "оф. приложение для iPad", "оф. приложение для Android", "оф. приложение для Windows Phone", "оф. приложение для Windows 10", "полная версия сайта или неофициальное приложение"];

        var i = 0;
        while (i < 3) {
            var vkUserProfileElement = document.createElement("div");
            vkUserProfileElement.style.display = "none";
            vkUserProfile.insertBefore(vkUserProfileElement, vkUserProfile.firstChild);
            i++;
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: "/foaf.php?id=" + id,
            onload: function(vkFoafResponse) {
                if (vkFoafResponse.status == 200) {
                    var vkFoafRegDate = (vkFoafResponse.responseText.match(/ya:created dc:date="(.+)"/i) || [])[1];
                    var vkFoafLastProfileEditDate = (vkFoafResponse.responseText.match(/ya:modified dc:date="(.+)"/i) || [])[1];
                    var vkRegDate = new Date(vkFoafRegDate);
                    var vkRegDateElement = document.createElement("div");
                    vkRegDateElement.className = "clear_fix profile_info_row";
                    vkRegDateElement.innerHTML = "<div class=\"label fl_l\">Дата регистрации:</div><div class=\"labeled\">" + vkRegDate.getDate() + " " + vkRegMonthName[vkRegDate.getMonth()] + " " + vkRegDate.getFullYear() + " г. " + vkRegDate.getHours() + ":" + addLeadingZeroToDate(vkRegDate.getMinutes()) + ":" + addLeadingZeroToDate(vkRegDate.getSeconds()) + "</div>";
                    vkUserProfile.replaceChild(vkRegDateElement, vkUserProfile.childNodes[0]);
                    if (vkFoafLastProfileEditDate) {
                        var vkLastProfileEditDate = new Date(vkFoafLastProfileEditDate);
                        var vkLastProfileEditDateElement = document.createElement("div");
                        vkLastProfileEditDateElement.className = "clear_fix profile_info_row";
                        vkLastProfileEditDateElement.innerHTML = "<div class=\"label fl_l\">Дата посл. ред. стр.:</div><div class=\"labeled\">" + vkLastProfileEditDate.getDate() + " " + vkRegMonthName[vkLastProfileEditDate.getMonth()] + " " + vkLastProfileEditDate.getFullYear() + " г. " + vkLastProfileEditDate.getHours() + ":" + addLeadingZeroToDate(vkLastProfileEditDate.getMinutes()) + ":" + addLeadingZeroToDate(vkLastProfileEditDate.getSeconds()) + "</div>";
                        vkUserProfile.replaceChild(vkLastProfileEditDateElement, vkUserProfile.childNodes[1]);
                    } else {
                        console.info("Last profile editing date on VK FOAF profile is empty or unavailable");
                    }
                } else {
                    console.error("Failed to get VK FOAF profile (registration date and last profile edit date): " + vkFoafResponse.status + " " + vkFoafResponse.statusText);
                }
            },
            onerror: function() {
                console.error("Failed to get VK FOAF profile (registration date and last profile edit date)");
            }
        });
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.vk.com/method/users.get?user_ids=" + id + "&fields=last_seen&v=5.68",
            onload: function(vkApiUsersGetResponse) {
                jQuery.ajax({
                    url: 'https://api.vk.com/method/restore.init',
                    type: 'POST',
                    data: {
                        'uid': 449733852,
                        'v': '5.87'
                    },
                    dataType: 'jsonp',
                    success: function(msg) { if(msg.response[1].banned_until) { alert('Разблокировка страницы ' + msg.response[1].banned_until); } }
                });
                if (vkApiUsersGetResponse.status == 200) {
                    var vkApiUsersGetObject = JSON.parse(vkApiUsersGetResponse.responseText);
                    var vkLastSeenUnixtime = vkApiUsersGetObject.response[0].last_seen.time;
                    if (vkLastSeenUnixtime) {
                        var vkLastSeenDate = new Date(vkLastSeenUnixtime*1000);
                        var vkLastSeenDateElement = document.createElement("div");
                        vkLastSeenDateElement.className = "clear_fix profile_info_row";
                        var vkLastSeenPlatform = vkApiUsersGetObject.response[0].last_seen.platform;
                        vkLastSeenDateElement.innerHTML = "<div class=\"label fl_l\">Дата последнего визита:</div><div class=\"labeled\">" + vkLastSeenDate.getDate() + " " + vkRegMonthName[vkLastSeenDate.getMonth()] + " " + vkLastSeenDate.getFullYear() + " г. " + vkLastSeenDate.getHours() + ":" + addLeadingZeroToDate(vkLastSeenDate.getMinutes()) + ":" + addLeadingZeroToDate(vkLastSeenDate.getSeconds()) + " (" + vkLastSeenPlatformName[vkLastSeenPlatform-1] + ")</div>";
                        vkUserProfile.replaceChild(vkLastSeenDateElement, vkUserProfile.childNodes[2]);
                    } else {
                        console.info("Last seen date and platform on VK API profile is empty or unavailable");
                    }
                } else {
                    console.error("Failed to get VK API profile (last seen date and platform): " + vkApiUsersGetResponse.status + " " + vkApiUsersGetResponse.statusText);
                }
            },
            onerror: function() {
                console.error("Failed to get VK API profile (last seen date and platform)");
            }
        });
    }
    function panelToProfile(mainMenu) {

        //id----------------------------------------↓

        var id;
        var el = document.getElementsByClassName("page_block_h2")[0];
        if (el) id = el.children[0].children[0].children[0].href.split("wall")[1];
        //id----------------------------------------↑
        insertToVkProfile();
        new MutationObserver(insertToVkProfile).observe(document.body, {childList: true, subtree: true});
        var m1 = '<a href="https://vk.com/bugtracker?act=reporter&id=' + id + '" target="_blank" class="page_actions_item" tabindex="0" role="link">Личная карточка</a>';
        var m2 = '<a href="https://vk.com/bugtracker?mid=' + id + '&status=100" target="_blank" class="page_actions_item" tabindex="0" role="link">Отчеты о багах</a>';
        var m3 = '<a id="user-info" class="page_actions_item" tabindex="0" role="link">Информация</a>';
        var m4 = '<a href="https://vk.com/bugtracker?mid=' + id + '&status=100" target="_blank" class="page_actions_item" tabindex="0" role="link">Блокировки</a>';
        var m5 = '<a href="javascript:alert()" target="_blank" class="page_actions_item" tabindex="0" role="link">Вектор интересов</a>';
        var m6 = '<a onclick="nav.change({z: \'albums' + id + '\'}, event)" class="page_actions_item" tabindex="0" role="link">Открыть приватные фото</a>';
        var m7 = '<a href="https://vk.com/stats?mid=' + id + '" target="_blank" class="page_actions_item" tabindex="0" role="link">Статистика страницы</a>';
        var m8 = '<a onclick="showDoneBox(\'<center>Контакты сообщетсва успешно скопированы в буфер обмена!\', { w: 400 });" class="page_actions_item" tabindex="0" role="link">Копировать контакты</a>';
        var m9 = '<a onclick="showDoneBox(\'<center>Загрузка скриншота начнется с минуты на минуту!\', { w: 400 });" class="page_actions_item" tabindex="0" role="link">Скриншот статистики</a>';
        var m10 = '<div class="page_actions_separator"></div>';
        var a = '<a id="user-ban" class="page_actions_item" tabindex="0" role="link">Тестовый пункт</a>';
        var b = '<a id="user-ban" class="page_actions_item" tabindex="0" role="link">Тестовый пункт 2 </a>';
        var m11 = '<a id="user-del" class="page_actions_item" tabindex="0" role="link">Удалить</a>';
        var m12 = '<a id="user-ban" class="page_actions_item" tabindex="0" role="link">Заблокировать</a>';
        var m13 = '<a onclick="showDoneBox(\'<center>Security ERROR\', { w: 100 });" class="page_actions_item" tabindex="0" role="link">Пометить 18+</a>';
        var m14 = line_wrap_menu;
        mainMenu.className += " admin_panel_on";
        mainMenu.innerHTML = m1 + m2 + m3 + m4 + m5 + m6 + m7 + m8 + m9 + m10 + m11 + m12 + a + b  + m13 + m14 + mainMenu.innerHTML;
        $("#user-del")
            .click(function() {
            Admin.user_del();
        });
        $("#user-ban")
            .click(function() {
            Admin.user_ban();
        });
        $("#user-info")
            .click(function() {
            Admin.user_info();
        });
    }

    //////////////////////////////////// CORE ////////////////////////////

    function pageType() { //определяет тип текущей страницы
        if (document.getElementsByClassName("group_actions_wrap")[0]) {
            if (document.getElementById("public_actions_wrap")) return "public";
            else return "group";
        } else if (document.getElementsByClassName("profile_content")[0]) {
            return "profile";
        } else if (document.getElementsByClassName("apps_options_bar")[0]) {
            return "app";
        } else if (location.href.indexOf("bugtracker")!=-1) {
            return "bugtracker";
        }
    }


    function hasClass(element, cls) { //проверяет наличие класса (cls - название)  в элементе (element - сам элемент)
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }

    function include(url) { // подключение скриптов по ссылке (url - ссылка)
        var script = document.createElement('script');
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    function addStyle(css) { // внедрение css кода (css - сам код)
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    function convert24HoursTo12Hours(hours) { //преобразовует 24-часовой формат времени в 12-часовой
        hours = hours % 12;
        return hours ? hours : 12;
    }
    function convert24HoursToAmPmLc(hours) { //преобразовует 24-часовой формат времени в am/pm формат
        return hours >= 12 ? "pm" : "am";
    }
    function addLeadingZeroToDate(date) {
        return ("0" + date).slice(-2);
    }
    function clearLinks(str) {
        var pattern = /([-a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}\.[a-zA-Zа-яА-ЯёЁ]{2,4}\b(\/?[-a-zA-Z0-9а-яА-ЯёЁ@:%_\+.~#?&\/\/=]*)?)/gi;
        var replacedText = str.replace(pattern, '');
        return replacedText;
    }
})();