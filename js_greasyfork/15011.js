// ==UserScript==
// @name 		HWM ClanBalance Logger
// @version 	3.4
// @description 	HWM Mod - Упрощает ввод логов при работе с балансом клана. Стандартизирует сами описания.
// @author 	- SAURON -
// @namespace 	mod  Mefistophel_Gr
// @encoding 	UTF-8
// @include 	http://*heroeswm.ru/clan_balance.php*
// @include 	http://178.248.235.15/clan_balance.php*
// @include 	http://*.lordswm.com/clan_balance.php*
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/15011/HWM%20ClanBalance%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/15011/HWM%20ClanBalance%20Logger.meta.js
// ==/UserScript==

// (c) 2015, - SAURON -  (http://www.heroeswm.ru/pl_info.php?id=3658084)
// 2015, Mefistophel_Gr (http://www.heroeswm.ru/pl_info.php?id=2287844)

var version = '3.4';

if (typeof GM_getValue != 'function') {
    this.GM_getValue=function (key,def) {return localStorage[key] || def;};
    this.GM_setValue=function (key,value) {return localStorage[key]=value;};
    this.GM_deleteValue=function (key) {return delete localStorage[key];};
}

(function() {

    var url_upd = 	'https://greasyfork.org/ru/scripts/15011-hwm-clanbalance-logger';
    var str_send_sms = '/sms-create.php?mailto=Mefistophel_Gr&subject=Скрипт: HWM ClanBalance Logger. Версия: '+ version;
    var str_update = 	'Проверить обновление';
    var str_error = 	'Обратная связь';

    //====== Переменные, заменяемые в настройках =======	
    var clan_id1 = 	GM_getValue("new_clan_id1", 0); 	// ID клана 1
    var sklad_id1 = 	GM_getValue("new_sklad_id1", 0); 	// ID склада клана 1
    var clan_id2 = 	GM_getValue("new_clan_id2", 0); 	// ID клана 2
    var sklad_id2 = 	GM_getValue("new_sklad_id2", 0); 	// ID склада клана 2

    var str_button = 		"&nbsp;Баланс-логер&nbsp;";
    var str_button_title = 	"Прежде чем начать работать с казной,\r\n настройте номера Клана и Склада";
    var str_script_name = 	"Клановый баланс. Управление логами. Версия: ";
    var str_main_clan = 	"Основной клан:";
    var str_second_clan = 	"&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Академия:";
    var str_null_clan = 		"Если нет, или не требуется, то оставьте эти поля пустыми";
    var str_ent_data = 		"Введите ID своего клана и склада, и нажмите OK";
    var str_txt_id = 		"ID=";
    var str_txt_clan_id1 = 	"Номер вашего клана: ";
    var str_txt_sklad_id1 = 	"Номер клан-склада: ";
    var str_txt_clan_id2 = 	"Номер вашего клана: ";
    var str_txt_sklad_id2 = 	"Номер клан-склада: ";
    var str_no_clan_id = 	"Вы не знаете ID своего клана?!";
    var str_no_sklad_id = 	"Вы не знаете ID своего склада?!";
    var str_null_clan_id = 	"Такого клана не существует!";
    var str_null_sklad_id = 	"Такого склада не существует!";
    var str_txt_id_title = 	"Все изменения будут применены\r\n   после обновления страницы";
    
    //============= Настройки скрипта ================
    function Open_Settings() {
        if (location.href.indexOf('clan_balance') == -1) return;
        if (document.querySelector("img[src*='i/top_ny']") ) {
            var point = document.querySelector("td > [src*='rdec_.jpg']");
            //новогодний скин
            button_style = "<style> .hwm_cmenu * {font-size: 12px; color: #F5C137;} .cell_cmenu {border: 1px; border-color: #F5C137; border-style: solid; white-space: nowrap; height: 18px; background: url(http://dcdn3.heroeswm.ru/i/top_ny_rus/line/t_com_bkg_.jpg); font-weight: bold;} </style>";
        } else {
            var point = document.querySelector("td > [src*='rdec.jpg']");
            //обычный скин
            button_style = "<style> .hwm_cmenu * {font-size: 12px; color: #F5C137;} .cell_cmenu {border: 1px; border-color: #F5C137; border-style: solid; white-space: nowrap; height: 18px; background: url(http://dcdn1.heroeswm.ru/i/top/line/t_com_bkg.jpg); font-weight: bold;} </style>";
        }
        if (point == null)	return;

        var d = document.createElement('div');
        d.setAttribute('style', 'position: absolute; margin: -25px 0px 0px 880px; text-align: center;'); 	//Положение кнопки вызова настроек
        d.innerHTML = button_style +
        '<table class="hwm_cmenu" width=80px> <tr height=20>'+ 	// Размер и фон, для кнопки вызова настроек
        '<td class="cell_cmenu" style="cursor:pointer" id="set_Clan_Balance" title="'+str_button_title+'">'+ str_button +'</td></tr> </table>';
        point.parentNode.parentNode.parentNode.appendChild(d); 		//Вставка куска

        addEvent( $("set_Clan_Balance"), "click", settings_Clan_Balance ); 	//Привязка к куску на клик вызов функции
        
        //========= Закрытие настроек ============
        function settings_Close() {
            var bg = $('bgOverlay');
            var bgc = $('bgCenter');
            bg.parentNode.removeChild(bg);
            bgc.parentNode.removeChild(bgc);
            window.location.reload();
        }
        //=========== Окно настроек ==============
        function settings_Clan_Balance () {
            var bg = $('bgOverlay');
            var bgc = $('bgCenter');
            var bg_height = ScrollHeight();
        
            if ( !bg ) {
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
            bg.style.zIndex = "7";
            
            bgc.id = 'bgCenter';
            bgc.style.position = 'absolute';
            bgc.style.left = ( (ClientWidth() - 350) / 2 ) +'px';
            bgc.style.width = '350px';		//Ширина окна настроек
            bgc.style.background = "#F6F3EA";
            bgc.style.zIndex = "8";
            
            addEvent(bg, "click", settings_Close);

            //форма и внешний вид окна настроек
            bgc.innerHTML = '<div style="border:1px solid #abc;padding:5px;margin:2px;"> <div style="float:right;border:1px solid #abc;width:15px;height:15px;text-align:center;cursor:pointer;" id="bt_close_tr" title="Закрыть">x</div><b><center>'+ str_script_name +'<font style="color:#008B00;">'+ version +'</font></center></b><hr/> <table width="100%" cellspacing=0 cellpadding=0 border=0>'+
            '<tr> <td align="right"><font style="color:#6A5ACD; font-family: Tahoma; font-size:15px;">'+ str_main_clan +'</font></td> <td></td></tr>'+
            '<tr> <td align="right"><b><font style="line-height: 2.0">'+ str_txt_clan_id1 +'</font></b></td> 	<td align="left">&nbsp;<i><b>'+ str_txt_id +'</b></i><input id="set_clan_id1" value="'+ clan_id1 +'" size="3" maxlength="4"> <input type="submit" id="set_clan_id1_ok" value="OK" title="'+ str_txt_id_title +'"></td> </tr>'+
            '<tr> <td align="right"><b>'+ str_txt_sklad_id1 +'</b></td> 	<td align="left">&nbsp;<i><b>'+ str_txt_id +'</b></i><input id="set_sklad_id1" title="";" value="'+ sklad_id1 +'" size="3" maxlength="3"> <input type="submit" id="set_sklad_id1_ok" value="OK" title="'+ str_txt_id_title +'"> </td> </tr>'+
            '<tr> <td colspan=2 align="center"><font style="color:#708090; font-family: Georgia; font-size:12px; line-height: 2.5"><i>'+ str_ent_data +'</i></font></td></tr> <tr><td colspan=2> <hr width="92%" align="center" color="gray"/></td></tr>'+
            '<tr> <td align="center"><font style="color:#6A5ACD; font-family: Tahoma; font-size:15px;">'+ str_second_clan +'</font></td> <td></td></tr>'+
            '<tr> <td align="right"><b><font style="line-height: 2.0">'+ str_txt_clan_id2 +'</font></b></td> 	<td align="left">&nbsp;<i><b>'+ str_txt_id +'</b></i><input id="set_clan_id2" value="'+ clan_id2 +'" size="3" maxlength="4"> <input type="submit" id="set_clan_id2_ok" value="OK" title="'+ str_txt_id_title +'"></td> </tr>'+
            '<tr> <td align="right"><b>'+ str_txt_sklad_id2 +'</b></td> 	<td align="left">&nbsp;<i><b>'+ str_txt_id +'</b></i><input id="set_sklad_id2" title="";" value="'+ sklad_id2 +'" size="3" maxlength="3"> <input type="submit" id="set_sklad_id2_ok" value="OK" title="'+ str_txt_id_title +'"> </td> </tr>'+
            '<tr> <td colspan=2 align="center"><font style="color:#8B8386; font-family: Georgia; font-size:10px; line-height: 2.5"><i>'+ str_null_clan +'</i></font></td></tr> <tr> <td colspan=4> <hr/> </td></tr></table>'+
            ' <table width="100%" cellspacing=0 cellpadding=0 border=0> <tr><td width="48%" align="center"><a href="'+ url_upd +'" target=_blank>'+ str_update +'</a></td> <td width="48%" align="center"><a href="'+ str_send_sms +'" target=_blank>'+ str_error +'</a></td> <td width="4%" align="right"><a href="javascript:void(0);" id="open_transfer_id">?</a></td></tr> </table>';
            
        
            //====== Обработка кликов по пунктам =======
            addEvent($("bt_close_tr"), "click", settings_Close);		//закрытие настроек
            addEvent($("set_clan_id1_ok"), "click", change_clan_id1);		//строка ввода - номер клана 1
            addEvent($("set_sklad_id1_ok"), "click", change_sklad_id1);	//строка ввода - номер Склада 1
            addEvent($("set_clan_id2_ok"), "click", change_clan_id2);		//строка ввода - номер клана 2
            addEvent($("set_sklad_id2_ok"), "click", change_sklad_id2);	//строка ввода - номер Склада 2
            addEvent($("open_transfer_id"), "click", open_transfer);	  	//шутка

            bg.style.top = '0px';
            bg.style.height = bg_height + 'px';
            bgc.style.top = ( window.pageYOffset + 130 ) +'px'; 		//сдвиг окна по высоте
            bg.style.display = '';
            bgc.style.display = '';
        }
    }

    //====== Обработка полей ввода ============
    function change_clan_id1() {				// ID клана 1
        clan_id = ($("set_clan_id1").value).replace(/[^ 0-9]/g, ""); 	//удаление лишних символов
        clan_id = clan_id.replace(/ {1,}/g,""); 			//удаление множественных пробелов
        document.getElementById('set_clan_id1').value = clan_id;
        if (clan_id.length == 0) {
            alert(str_no_clan_id);
            return; 
        } /*else if ( Number( $("set_clan_id1").value ) < 10 || !ScanClanID(Number( $("set_clan_id1").value ))) {
            alert(str_null_clan_id); 				// автоопределение реальности ID клана
            clan_id = "";
            document.getElementById('set_clan_id1').value = clan_id;
            return;
        } else if ( Number( $("set_clan_id1").value ) >= 10 && ScanClanID(Number( $("set_clan_id1").value ))) {
            clan_id = Number($("set_clan_id1").value).toFixed(0);
        } */
        GM_setValue("new_clan_id1", clan_id);
    }
    
    function change_sklad_id1() {				// ID клан-склада 1
        sklad_id = ($("set_sklad_id1").value).replace(/[^ 0-9]/g, ""); 	//удаление лишних символов
        sklad_id = sklad_id.replace(/ {1,}/g,""); 			//удаление множественных пробелов
        document.getElementById('set_sklad_id1').value = sklad_id;
        if (sklad_id.length == 0) {
            alert(str_no_sklad_id);
            return;
        } else if ( Number( $("set_sklad_id1").value ) < 1 || !ScanSkladID(Number( $("set_sklad_id1").value ))) {
            alert(str_null_sklad_id); 				// автоопределение реальности ID склада
            sklad_id = "";
            document.getElementById('set_sklad_id1').value = sklad_id;
            return;
        } else if ( Number( $("set_sklad_id1").value ) >= 1 && ScanSkladID(Number( $("set_sklad_id1").value ))) {
            sklad_id = Number($("set_sklad_id1").value).toFixed(0);
        }
        GM_setValue("new_sklad_id1", sklad_id);
    }

    function change_clan_id2() {				// ID клана 2
        clan_id = ($("set_clan_id2").value).replace(/[^ 0-9]/g, ""); 	//удаление лишних символов
        clan_id = clan_id.replace(/ {1,}/g,""); 			//удаление множественных пробелов
        document.getElementById('set_clan_id2').value = clan_id;
        if (clan_id.length == 0) {
            clan_id = "";
            GM_setValue("new_clan_id2", clan_id);
            return;
        } /*else if ( Number( $("set_clan_id2").value ) < 10 || !ScanClanID(Number( $("set_clan_id2").value ))) {
            alert(str_null_clan_id); 				// автоопределение реальности ID клана
            clan_id = "";
            document.getElementById('set_clan_id2').value = clan_id;
            GM_setValue("new_clan_id2", clan_id);
            return;
        } else if ( Number( $("set_clan_id2").value ) >= 10 && ScanClanID(Number( $("set_clan_id2").value ))) {
            clan_id = Number($("set_clan_id2").value).toFixed(0);
        } */
        GM_setValue("new_clan_id2", clan_id);
    }
    
    function change_sklad_id2() {				// ID клан-склада 2
        sklad_id = ($("set_sklad_id2").value).replace(/[^ 0-9]/g, ""); 	//удаление лишних символов
        sklad_id = sklad_id.replace(/ {1,}/g,""); 			//удаление множественных пробелов
        document.getElementById('set_sklad_id2').value = sklad_id;
        if (sklad_id.length == 0) {
            sklad_id = "";
            GM_setValue("new_sklad_id2", sklad_id);
            return;
        } else if ( Number( $("set_sklad_id2").value ) < 1 || !ScanSkladID(Number( $("set_sklad_id2").value ))) {
            alert(str_null_sklad_id); 				// автоопределение реальности ID склада
            sklad_id = "";
            document.getElementById('set_sklad_id2').value = sklad_id;
            GM_setValue("new_sklad_id2", sklad_id);
            return;
        } else if ( Number( $("set_sklad_id2").value ) >= 1 && ScanSkladID(Number( $("set_sklad_id2").value ))) {
            sklad_id = Number($("set_sklad_id2").value).toFixed(0);
        }
        GM_setValue("new_sklad_id2", sklad_id);
    }

    //========= Другие функции ==============
    function open_transfer() {
        if ( location.href.match('lordswm') ) {
            window.location = "transfer.php?nick=Mefistophel_Gr&shortcomment=Transferred 10000 Gold 5 Diamonds";
        } else {
            window.location = "transfer.php?nick=Mefistophel_Gr&shortcomment=%CF%E5%F0%E5%E4%E0%ED%EE%2010000%20%C7%EE%EB%EE%F2%EE%205%20%C1%F0%E8%EB%EB%E8%E0%ED%F2%FB";
        }
    }

    function addEvent(elem, evType, fn) {
        if (elem.addEventListener) elem.addEventListener(evType, fn, false);
        else if (elem.attachEvent) elem.attachEvent("on" + evType, fn);
        else elem["on" + evType] = fn;
    }
    
    function $(id) { return document.querySelector("#"+id); }
    
    function ClientWidth() {
        return document.compatMode=='CSS1Compat' && document.documentElement?document.documentElement.clientWidth:document.body.clientWidth;
    }

    function ScrollHeight() {
        return Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
    }

    //====== Автоопределение реальности ID клана =======
    function ScanClanID(clan_id) {
        var cid = new getXmlHttp();
        cid.open('GET', 'http://'+location.hostname+'/clan_info.php?id='+ clan_id, false);
        cid.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        cid.send();
        if (cid.responseText.indexOf('clan_info.php?id='+ clan_id) > -1) return true;
        else return false;
    }
    
    //====== Автоопределение реальности ID склада ======
    function ScanSkladID(sklad_id) {
        var sid = new getXmlHttp();
        sid.open('GET', 'http://'+location.hostname+'/sklad_info.php?id='+ sklad_id, false);
        sid.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        sid.send();
        if (sid.responseText.indexOf('sklad_log.php?id='+ sklad_id) > -1) return true;
        else return false;
    }

    function getXmlHttp() {
        var xmlhttp;
        try {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (E) {
                xmlhttp = false;
            }
        }
        if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
            xmlhttp = new XMLHttpRequest();
        }
        return xmlhttp;
    }

    //========== Основная функция логирования ==================
    function Generate_Clan_Log() {
        var mkey;

        document.getElementsByName("inp")[0].parentNode.innerHTML += "<input id='r_inp' type='radio' name='balance' value='inp_value' checked />";
        document.getElementsByName("out")[0].parentNode.innerHTML += "<input id='r_out' type='radio' name='balance' value='out_value' />";
        document.getElementsByName("desc")[0].parentNode.innerHTML += "<input id='add_c' type=button value='+'> <div id='iblocker' style='display:none; visibility:hidden;'> <font style='font-weight:bold; font-style:italic; color:#00B2EE;'> <sup><font color=red>1</font></sup> Некоторые поля при наведении курсора выводят подсказки</font> <br/><br/><br/> <select id='comments'></select><br/><br/> <div id='c_data'></div><br/> <input id='ok_c' type=button value='OK'> <input id='cancel_c' type=button value='Отмена'></div>";
        document.getElementsByName("desc")[0].style.width = "600";
        document.getElementsByName("desc")[0].readOnly = true;  	// true - правка поля 'Описание' не возможна; false - возможна
        document.getElementById("r_inp").onchange = function() {onRadioChecked(0);}
        document.getElementById("r_out").onchange = function() {onRadioChecked(1);}
        document.getElementById("comments").onchange = function() {onListChecked();}
        document.getElementById("add_c").onclick = function() {setDisable();};
        document.getElementById("cancel_c").onclick = function() {setEnable();};
        document.getElementById("ok_c").onclick = function() {setDesc();};

        onRadioChecked(0);

        //переключение ввод/вывод
        function onRadioChecked(key) {
            mkey = key;
            if (key == 0) {
                document.getElementsByName("out")[0].value = "0";
                document.getElementsByName("desc")[0].value = "";
                document.getElementsByName("out")[0].disabled = true;
                document.getElementsByName("inp")[0].disabled = false;
                document.getElementById("comments").innerHTML = getCommentInListHTML();
            } else if (key == 1) {
                document.getElementsByName("inp")[0].value = "0";
                document.getElementsByName("desc")[0].value = "";
                document.getElementsByName("inp")[0].disabled = true;       
                document.getElementsByName("out")[0].disabled = false;
                document.getElementById("comments").innerHTML = getCommentOutListHTML();
            }
        }

        var list = document.getElementsByTagName("input");
        for (var i = 0; i < list.length; i++) {
            if (list[i].type == "submit") {
                list[i].onclick = function() {setFormBody();};
                i = list.length;
            }
        }

        //заполняем данные для передачи по событию submit
        function setFormBody() {
            document.f.innerHTML = "<input type='hidden' value='"+document.getElementsByName("inp")[0].value+"' name='inp'> <input type='hidden' value='"+document.getElementsByName("out")[0].value+"' name='out'> <input type='hidden' value='"+document.getElementsByName("desc")[0].value+"' name='desc'>";
        }

        //заполняем автоматически сумму в форме, если выбран определённый лог
        function autoSet5000() {
            if (mkey == 0) {
                if (document.getElementById("comments").value == 102) document.getElementsByName("inp")[0].value = 5000;
                if (document.getElementById("comments").value == 111) document.getElementsByName("inp")[0].value = 1;
                if (document.getElementById("comments").value == 112) document.getElementsByName("inp")[0].value = 15;
            }
            else if (mkey == 1) {
                if (document.getElementById("comments").value == 12) document.getElementsByName("out")[0].value = 5050;
                if (document.getElementById("comments").value == 21) document.getElementsByName("out")[0].value = 1;
            }
        }
        
        //заполнить автоматически комментарий в форме ввода
        function autoSetComment() {
            if (mkey == 0) {
                if (document.getElementsByName("inp")[0].value == '5000') {
                    var t = document.getElementById("comments");
                    t.value = 102;
                }
                if (document.getElementsByName("inp")[0].value == '1') {
                    var t = document.getElementById("comments");
                    t.value = 111;
                }
            } else if (mkey == 1) {
                if (document.getElementsByName("out")[0].value == '5050')  {
                    var t = document.getElementById("comments");
                    t.value = 12;
                }
                if (document.getElementsByName("out")[0].value == '1')  {
                    var t = document.getElementById("comments");
                    t.value = 21;
                }
            }
            onListChecked();
        }

        //список доступных комментариев ВЫВОДА в форме
        function getCommentOutListHTML() {
            var str = "<option value='0'></option>";
            str += "<option value='1'>покупка [кол-во] [чего] на рынок/обмен</option>";
            str += "<option value='2'>покупка [кол-во] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [чего] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [куда/для чего]</option>";
            str += "<option value='3'>премия за поддержку предприятий для [ник игрока]</option>";
            str += "<option value='4'>премия за поддержку предприятий для [кол-во] торговцев</option>";
            str += "<option value='5'>доплата за защиту \"красной\" фабрики для [кол-во] бойцов</option>";
            str += "<option value='6'>доплата за защиту \"красной\" фабрики для [ник игрока]</option>";
            str += "<option value='7'>премии самым активным бойцам на защитах</option>";
            str += "<option value='8'>на нужды клана [назначение | описание]</option>";
            str += "<option value='9'>компенсация за бой в неполной тройке для [кол-во] бойцов</option>";
            str += "<option value='10'>компенсация за бой в неполной тройке для [ник игрока]</option>";
            str += "<option value='11'>доплата за защиту в неполной тройке для [ник игрока] и [ник игрока]</option>";
            str += "<option value='12'>возврат вступительного для [ник игрока]</option>";
            str += "<option value='13'>выплата за атаку/перехваты/PvP для [ник игрока] от [дата]</option>";
            str += "<option value='14'>выплаты за атаку/перехваты/PvP от [дата] для [кол-во] бойцов</option>";
            str += "<option value='15'>выплаты за перехват для [клана] для [ник игрока] | [*кол-во игроков]</option>";
            str += "<option value='16'>Расчёт с [ник игрока] за крафт на складе [ID склада] за [месяц]</option>";
            str += "<option value='17'>Склад - покупка [тип покупки] [название закупаемого арта/ов | элей] * [кол-во] шт</option>";
            str += "<option value='18'>Склад - ремонт [артефакт|крафт]. ID=[uID арта из его инфы в ссылке]</option>";
            str += "<option value='19'>кредит из казны клана [ID клана] для [ник игрока]</option>";
            str += "<option value='20'>возврат за [причина] для [ник игрока]</option>";
            str += "<option value='21'>свободная произвольная форма</option>";
            return str;
        }

        //список доступных комментариев ВВОДА в форме
        function getCommentInListHTML() {
            var str = "<option value='0'></option>";
            str += "<option value='101'>продажа [клан.ресурса] [кол-во] шт.</option>";
            str += "<option value='102'>вступительный взнос от [ник игрока]</option>";
            str += "<option value='103'>добровольный взнос от [ник игрока] за [месяц]</option>";
            str += "<option value='104'>налог от [ник игрока] за [месяц]</option>";
            str += "<option value='105'>налог за [причина] от [ник игрока] за [месяц]</option>";
            str += "<option value='106'>штраф за [причина] от [ник игрока]</option>";
            str += "<option value='107'>аренда [артефакта/ов] на сторону {дополнение|комментарий}</option>";
            str += "<option value='108'>возврат кредита от [ник игрока]</option>";
            str += "<option value='109'>возврат средств [причина|описание]</option>";
            str += "<option value='110'>Склад - ремонт [артефакт|крафт|ID] (личные арты)</option>";
            str += "<option value='111'>свободная произвольная форма</option>";
            if (clan_id1 == 15) {
                str += "<option value='112'>копейки удачи клана Дестини</option>";
            }
            return str;
        }

        //выбор комментария в списке в форме заполнения описания
        function onListChecked() {
            var cmd = document.getElementById("comments");
            document.getElementById("c_data").innerHTML = getClientForm(cmd.value*1);
            //document.getElementsByName("desc")[0].value = cmd.options[cmd.selectedIndex].text;
        }

        //отобразить форму для заполнения комментария
        function setDisable() {
            autoSetComment();
            var dd = document.getElementById('iblocker');
            dd.style.display = 'block';
            dd.style.visibility = 'visible';
            dd.style.position = 'absolute';
            dd.style.zIndex = '999';
            dd.style.top = '-120px';
            dd.style.left = '0px'; 
            dd.style.width = '100%';
            dd.style.height = '100%'; 
            dd.style.backgroundColor = 'white';
            dd.style.textAlign = 'center';
            dd.style.paddingTop = '20%';
            dd.style.opacity = '0.9';
            dd.style.filter = 'alpha(opacity=90)';
        }

        //скрыть форму для заполнения комментария
        function setEnable() {
            autoSet5000();
            var dd = document.getElementById('iblocker');
            dd.style.display = 'none';
            dd.style.visibility = 'hidden';
        }

        //заполнить label description в форме ввода описания
        function setDesc() {
            var s = "";
            for (var i = 0;;i++) {
                var d = document.getElementById('i'+i);
                if (d != undefined) {
                    s += d.value + " ";
                } else {
                    break;
                }
            }
            document.getElementsByName("desc")[0].value = s;
            setEnable();
        }

        //сформировать форму заполнения возможных комментариев
        function getClientForm(key) {
            switch(key) {
                //С Н Я Т И Е  И З  К А З Н Ы
                case 0: return ""; break;
                case 1: return "<input id='i0' type='text' value='покупка' style='width:65;' disabled> <input id='i1' maxlength='3' style='width:35;' type='text'> <select id='i2'><option value='дерева'>дерева</option><option value='руды'>руды</option><option value='ртути'>ртути</option><option value='серы'>серы</option><option value='кристаллов'>кристаллов</option><option value='самоцветов'>самоцветов</option></select> <select id='i3'><option value='на рынок'>на рынок</option><option value='на обмен'>на обмен</option></select>"; break;
                case 2: return "<input id='i0' type='text' value='покупка' style='width:65;' disabled> <input id='i1' maxlength='4' style='width:40;' type='text'> <input id='i2' style='width:170;' type='text'> <input id='i3' style='width:200;' type='text'>"; break;
                case 3: return "<sup><font color=red>1</font></sup><input id='i0' type='text' value='премия за поддержку предприятий для' style='width:260;' title='Единовременная выплата ОДНОМУ торговцу' disabled> <input id='i1' type='text'> <select id='i2'><option value=''></option><option value='(своё, без комиссии)'>(своё, без комиссии)</option><option value='(доплата)'>(доплата)</option></select>"; break;
                case 4: return "<sup><font color=red>1</font></sup><input id='i0' type='text' value='премия за поддержку предприятий для' style='width:260;' title='Еженедельная/ежемесячная выплата ВСЕМ торговцам' disabled> <input id='i1' style='width:30;' type='text' maxlength='3'> <input id='i2' style='width:75;' type='text' value='торговцев' disabled>"; break;
                case 5: return "<sup><font color=red>1</font></sup><input id='i0' type='text' value='доплата за защиту \"красной\" фабрики для' style='width:280;' title='Выплачивается ГРУППЕ бойцов, при объявленной по рассылке мобилизации \r\n      и более крупных затратах на крафт при угрозе потери предприятия \r\n                (малый процент владения предприятием)' disabled> <input id='i1' style='width:30;' type='text' maxlength='3'> <input id='i2' style='width:60;' type='text' value='бойцов' disabled>"; break;
                case 6: return "<sup><font color=red>1</font></sup><input id='i0' type='text' value='доплата за защиту \"красной\" фабрики для' style='width:280;' title='Выплачивается ОДНОМУ бойцу, при объявленной по рассылке мобилизации \r\n      и более крупных затратах на крафт при угрозе потери предприятия \r\n                (малый процент владения предприятием)' disabled> <input id='i1' type='text'> <select id='i2'><option value=''></option><option value='(своё, без комиссии)'>(своё, без комиссии)</option></select>"; break;
                case 7: return "<sup><font color=red>1</font></sup><input id='i0' type='text' value='премии самым активным бойцам на защитах' style='width:300;' title='Еженедельная/ежемесячная выплата тройке самых активных бойцов \r\nза наибольшее кол-во побед в защитах за отчётный период' disabled> <select id='i1'><option value=''></option><option value='(своё, без комиссии)'>(своё, без комиссии)</option></select>"; break;
                case 8: return "<sup><font color=red>1</font></sup><input id='i0' type='text' value='на нужды клана (' style='width:115;' disabled> <input id='i1' type='text' style='width:330;' title='сюда вносятся расходы на: \r\n - оплату статистики kekus`а; \r\n - единоразовое премирование игрока за что-либо; \r\n - оплата рекламы клана на сторонних ресурсах; \r\n - другие расходы, не подпадающие под статьи, уже внесённые в меню'> <input id='i2' type='text' value=')' style='width:10;' disabled>"; break;
                case 9: return "<sup><font color=red>1</font></sup><input id='i0' type='text' value='компенсация за бой в неполной тройке для' style='width:280;' title='Компенсация для группы игроков' disabled> <input id='i1' style='width:30;' type='text'> <input id='i2' style='width:65;' type='text' value='бойцов' disabled>"; break;
                case 10: return "<sup><font color=red>1</font></sup><input id='i0' type='text' value='компенсация за бой в неполной тройке для' style='width:300;' title='Компенсация для одного игрока' disabled> <input id='i1' type='text'> <select id='i2'><option value=''></option><option value='(без комиссии)'>(без комиссии)</option></select>"; break;
                case 11: return "<sup><font color=red>1</font></sup><input id='i0' type='text' value='доплата за защиту в неполной тройке для' style='width:280;' title='Доплаты от клана при ПОБЕДЕ в неполной тройке' disabled> <input id='i1' type='text'> <input id='i2' type='text' value='и' style='width:16;' disabled> <input id='i3' type='text'>"; break;
                case 12: return "<sup><font color=red>1</font></sup><input id='i0' type='text' value='возврат вступительного для' style='width:185;' title='Возврат 5000 игроку, принятому в клан на условно-бесплатной основе' disabled> <input id='i1' type='text' style='width:175;'>"; break;
                case 13: return "<sup><font color=red>1</font></sup><input id='i0' type='text' value='выплата за' style='width:90;' title='Единовременная выплата для ОДНОГО бойца' disabled> <select id='i1'><option value='атаку'>атаку</option><option value='перехваты'>перехваты</option><option value='PvP'>PvP</option></select> <input id='i2' type='text' value='для' style='width:30;' disabled> <input id='i3' type='text'> <input id='i4' style='width:22;' type='text' value='от' disabled> <input id='i5' type='text' style='width:150;'>"; break;
                case 14: return "<sup><font color=red>1</font></sup><input id='i0' type='text' value='выплаты за' style='width:90;' title='Выплаты НЕСКОЛЬКИМ бойцам клана сразу' disabled> <select id='i1'><option value='атаку'>атаку</option><option value='перехваты'>перехваты</option><option value='PvP'>PvP</option></select> <input id='i2' style='width:25;' type='text' value='от' disabled> <input id='i3' type='text' style='width:100;'> <input id='i4' style='width:30;' type='text' value='для' disabled> <input id='i5' style='width:30;' type='text'> <input id='i6' style='width:65;' type='text' value='бойцов' disabled>"; break;
                case 15: return "<sup><font color=red>1</font></sup><input id='i0' type='text' value='выплаты за перехват для' style='width:170;' title='Выплаты своим бойцам за перехват троек для дружественного клана' disabled> <input id='i1' type='text' style='width:40;'> <input id='i2' type='text' value='для' style='width:30;' disabled> <input id='i3' type='text' style='width:250;'>"; break;
                case 16: return "<input id='i0' type='text' value='Расчет с' style='width:70;' disabled> <input id='i1' type='text'> <input id='i2' type='text' value='за крафт на складе' style='width:140;' disabled> <select id='i3'><option value='#"+sklad_id1+"'>#"+sklad_id1+"</option><option value='#"+sklad_id2+"'>#"+sklad_id2+"</option></select> <input id='i4' type='text' value='за' style='width:20;' disabled> <select id='i5'><option value='Январь'>Январь</option><option value='Февраль'>Февраль</option><option value='Март'>Март</option><option value='Апрель'>Апрель</option><option value='Май'>Май</option><option value='Июнь'>Июнь</option><option value='Июль'>Июль</option><option value='Август'>Август</option><option value='Сентябрь'>Сентябрь</option><option value='Октябрь'>Октябрь</option><option value='Ноябрь'>Ноябрь</option><option value='Декабрь'>Декабрь</option></select>"; break;
                case 17: return "<input id='i0' type='text' value='Склад - покупка' style='width:110;' disabled> <select id='i1'><option value='-'>-</option><option value='госа -'>госа -</option><option value='крафта -'>крафта -</option><option value='раритета -'>раритета -</option><option value='элементов -'>элементов -</option></select> <input id='i2' type='text' style='width:210;'> <input id='i3' type='text' style='width:10;' value='*' disabled> <input id='i4' style='width:30;' type='text' maxlength='3'> <input id='i5' style='width:30;' type='text' value='шт.' disabled>"; break;
                case 18: return "<sup><font color=red>1</font></sup><input id='i0' type='text' value='Склад - ремонт' style='width:110;' title='При отправке арефакта в починку \"на сторону\"' disabled> <input id='i1' type='text' style='width:250;'> <input id='i2' type='text' style='width:35;' value='. ID=' disabled> <sup><font color=red>1</font></sup><input id='i3' type='text' maxlength='10' title='Только ID! Значение  &crc=  - не нужно!'>"; break;
                case 19: return "<sup><font color=red>1</font></sup><input id='i0' type='text' value='кредит из казны клана' style='width:150;' title='НАПОМИНАНИЕ!!! \r\nКомиссия Империи идёт за счёт кредитуемого игрока!' disabled> <select id='i1'><option value='#"+clan_id1+"'>#"+clan_id1+"</option><option value='#"+clan_id2+"'>#"+clan_id2+"</option></select> <input id='i2' type='text' value='для' style='width:30;' disabled> <input id='i3' type='text' style='width:180;'>"; break;
                case 20: return "<input id='i0' type='text' value='возврат за' style='width:75;' disabled> <input id='i1' type='text' style='width:200;'> <input id='i2' type='text' value='для' style='width:30;' disabled> <input id='i3' type='text' style='width:150;'>"; break;
                case 21: return "<sup><font color=red>1</font></sup><input id='i0' type='text' style='width:350;' title='Это поле использовать только в крайнем случае - \r\n если вам нужно прокомментировать какое-то нетипичное действие с казной. \r\n Будет задействовано снятие 1 монеты!'>"; break;
                //В Л О Ж Е Н И Е  В  К А З Н У
                case 101: return "<input id='i0' type='text' value='продажа' style='width:70;' disabled> <select id='i1'><option value='кланового дерева'>кланового дерева</option><option value='клановой руды'>клановой руды</option><option value='клановой ртути'>клановой ртути</option><option value='клановой серы'>клановой серы</option><option value='клановых кристаллов'>клановых кристаллов</option><option value='клановых самоцветов'>клановых самоцветов</option></select> <input id='i2' type='text' style='width:30;' maxlength='3'> <input id='i3' type='text' value='шт.' style='width:30;' disabled>"; break;
                case 102: return "<input id='i0' type='text' value='вступительный взнос от' style='width:170;' disabled> <input id='i1' type='text'> <sup><font color=red>1</font></sup><select id='i2' title='Это меню используется только в случае внесения просроченного вступительного взноса (т.е. НЕ за текущий месяц!)'><option value=''></option><option value='(за прошлый месяц)'>(за прошлый месяц)</option><option value='(за январь)'>(за январь)</option><option value='(за февраль)'>(за февраль)</option><option value='(за март)'>(за март)</option><option value='(за апрель)'>(за апрель)</option><option value='(за май)'>(за май)</option><option value='(за июнь)'>(за июнь)</option><option value='(за июль)'>(за июль)</option><option value='(за август)'>(за август)</option><option value='(за сентябрь)'>(за сентябрь)</option><option value='(за октябрь)'>(за октябрь)</option><option value='(за ноябрь)'>(за ноябрь)</option><option value='(за декабрь)'>(за декабрь)</option></select>"; break;
                case 103: return "<input id='i0' type='text' value='добровольный взнос от' style='width:160;' disabled> <input id='i1' type='text'> <input id='i2' type='text' value='за' style='width:20;' disabled> <select id='i3'><option value='январь'>январь</option><option value='февраль'>февраль</option><option value='март'>март</option><option value='апрель'>апрель</option><option value='май'>май</option><option value='июнь'>июнь</option><option value='июль'>июль</option><option value='август'>август</option><option value='сентябрь'>сентябрь</option><option value='октябрь'>октябрь</option><option value='ноябрь'>ноябрь</option><option value='декабрь'>декабрь</option></select>"; break;
                case 104: return "<input id='i0' type='text' value='налог от' style='width:60;' disabled> <input id='i1' type='text'> <input id='i2' type='text' value='за' style='width:20;' disabled> <select id='i3'><option value='январь'>январь</option><option value='февраль'>февраль</option><option value='март'>март</option><option value='апрель'>апрель</option><option value='май'>май</option><option value='июнь'>июнь</option><option value='июль'>июль</option><option value='август'>август</option><option value='сентябрь'>сентябрь</option><option value='октябрь'>октябрь</option><option value='ноябрь'>ноябрь</option><option value='декабрь'>декабрь</option></select>"; break;
                case 105: return "<sup><font color=red>1</font></sup><input id='i0' type='text' value='налог за' style='width:65;' disabled> <input id='i1' type='text' style='width:200;' title='Часто используемое:\r\n - отсутствие на защитах\r\n - турнирные статы\r\n - вход на турнир'> <input id='i2' type='text' value='от' style='width:20;' disabled> <input id='i3' type='text'> <input id='i4' type='text' value='за' style='width:20;' disabled> <select id='i5'><option value='январь'>январь</option><option value='февраль'>февраль</option><option value='март'>март</option><option value='апрель'>апрель</option><option value='май'>май</option><option value='июнь'>июнь</option><option value='июль'>июль</option><option value='август'>август</option><option value='сентябрь'>сентябрь</option><option value='октябрь'>октябрь</option><option value='ноябрь'>ноябрь</option><option value='декабрь'>декабрь</option></select>"; break;
                case 106: return "<input id='i0' type='text' value='штраф за' style='width:70;' disabled> <input id='i1' type='text' style='width:200;'> <input id='i2' type='text' value='от' style='width:20;' disabled> <input id='i3' type='text'>"; break;
                case 107: return "<input id='i0' type='text' value='аренда' style='width:55;' disabled> <input id='i1' type='text' style='width:250;'> <input id='i2' type='text' value='на сторону' style='width:80;' disabled> <sup><font color=red>1</font></sup><input id='i3' type='text' style='width:150;' title='Если дополнение или комментарий не требуются, то оставьте поле пустым. \r\nЕсли вы указываете таковые - то обрамляйте их круглыми ( ) скобками!'>"; break;
                case 108: return "<input id='i0' type='text' value='возврат кредита от' style='width:130;' disabled> <input id='i1' type='text' style='width:180;'>"; break;
                case 109: return "<input id='i0' type='text' value='возврат средств (' style='width:120;' disabled> <input id='i1' type='text' style='width:300;'> <input id='i2' type='text' value=')' style='width:10;' disabled>"; break;
                case 110: return "<input id='i0' type='text' value='Склад - ремонт' style='width:110;' disabled> <input id='i1' type='text' style='width:250;'> <input id='i2' type='text' value='(личное, через склад)' style='width:150;' disabled>"; break;
                case 111: return "<sup><font color=red>1</font></sup><input id='i0' type='text' style='width:350;' title='Это поле использовать только в крайнем случае - \r\n если вам нужно прокомментировать какое-то нетипичное действие с казной. \r\n Будет задействовано вложение 1 монеты!'>"; break;
                case 112: return "<input id='i0' type='text' value='копейки удачи от' style='width:130;' disabled> <input id='i1' type='text' style='width:180;'>"; break;
                default: return ""; break;
            }
        }
    }
    //==================================================

    Open_Settings();

    Generate_Clan_Log();

})();