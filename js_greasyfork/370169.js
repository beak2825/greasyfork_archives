// ==UserScript==
// @name         GdePosylka_PackageRadar_Advanced
// @namespace    https://github.com/AlekPet/
// @version      1.6.7.3
// @description  Advanced Check my track number packageradar | Раширенные возможности для отслеживания трек-кода на сайт gdeposylka
// @author       AlekPet 2017 (alexepetrof@gmail.com)
// @license     MIT; https://raw.githubusercontent.com/AlekPet/GdePosylka_PackageRadar_Advanced/master/LICENSE
// @match        https://gdeposylka.ru/tracks*
// @match        https://gdeposylka.ru/courier/*
// @match       https://packageradar.com/tracks*
// @match       https://packageradar.com/courier/*
// @match        https://gdeposylka.ru/form*
// @match       https://packageradar.com/form*
// @icon          https://raw.githubusercontent.com/AlekPet/GdePosylka_PackageRadar_Advanced/master/assets/images/icon.png
// @run-at document-end
// @noframes
// @connect gdeposylka.ru
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @grant GM_addValueChangeListener
// @require https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/370169/GdePosylka_PackageRadar_Advanced.user.js
// @updateURL https://update.greasyfork.org/scripts/370169/GdePosylka_PackageRadar_Advanced.meta.js
// ==/UserScript==

// Вспомогательные функции
function hex(r,g,b){
    var hexv="0123456789ABCDEF";
    var valhex="";
    var ff=[r,g,b];
    for(var i=0;i<3;i++){
        var del= ff[i] % 16;
        var di=Math.floor(ff[i]/16);
        if(ff[i]>=255){
            valhex+="FF";
        } else if(ff[i]<=0){
            valhex+="00";
        } else {
            valhex+=hexv.charAt(di)+hexv.charAt(del);
        }
    }
    return valhex;
}

function getColorRND(){
    return (arguments.length ===0)?"#"+hex(Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255))+", #"+ hex(Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)):"#"+hex(Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255));
}

// Вспомогательные функции
var colors_style=getColorRND();
// Styles
GM_addStyle("\
.track_service{border: 1px solid;    margin: 5px 5px;    padding: 2px; color: #e7dcdc;   text-shadow: 1px 1px 0px black;    cursor: pointer;    display: inline;}\
.track_service:hover{color:yellow;} \
li.li_style { display: inline-block;}\
.li_style:hover>ul {display: block;}\
.li_style ul{-webkit-transition: all 0.3s ease-in;    -moz-transition: all 0.3s ease-in;    -o-transition: all 0.3s ease-in;}\
.ul_menu{position:absolute;z-index:99999999999999;border:1px solid;width:250px;display:none;padding: 0;background-color: #1d2125;}\
.li_menu{list-style: none;    padding: 0 10px;    min-width: 200px;    float: none;    background-color: rgba(46,73,89,.5);    font-family: Roboto,Helvetica,Arial,sans-serif;}\
.li_menu:hover{background-color: rgba(46,73,89,.5);}\
.a_menu{text-decoration: none;    color: #77def7;    display: inline-block;    font-size: 16px;    line-height: 33px;    padding-left: 5px;    width: 100%;}\
.a_menu:hover{text-decoration: none;color: #ffffff;}\
.li_menu:hover {background: #01ffc2;}\
.ul_menu li{-webkit-transition: all 0.3s ease-in;    -moz-transition: all 0.3s ease-in;    -o-transition: all 0.3s ease-in;}\
\
#abs_div{position:fixed;top:40vh;left:30px;border:1px solid;border-style: dashed;padding: 5px;overflow:auto;background-color: white;transform: translateY(-50%);}\
.ab_styles {text-overflow:ellipsis;width: 200px;overflow: hidden; display: flex;}\
.ab_style:hover{background: linear-gradient("+colors_style+");color:white !important;} \
.ab_style_complete{background: linear-gradient(white,#12ff45);} \
.ab_styles:hover{background: linear-gradient("+colors_style+");color:white !important;} \
.ab_styles:after{content: \" Получил\";color: white;    background: linear-gradient(#ff8100,#ffb714);    margin-left: 10px;    padding: 0 2px 0 2px;    font-size: 10px; line-height: 1.5;align-self: center;}\
.pop_options{border:1px solid;background: linear-gradient(silver,black);color:white;cursor:pointer;}\
.pop_options:hover{color:yellow;}\
.abs_div_cat{border: 1px solid;padding: 5px;margin-bottom:10px;}\
.abs_punkti{text-align:center; color: white; user-select: none; padding: 3px;}\
\
.all_box_scroll{max-height: 500px;overflow-y: auto;}\
.all_box_scroll::-webkit-scrollbar {   width: 12px;margin-left:20px;	float: left;}\
.all_box_scroll::-webkit-scrollbar-track {background-color: #eaeaea; border-left: 1px solid #ccc;}\
.all_box_scroll::-webkit-scrollbar-thumb {background-color: #c7587c;background-clip: padding-box;}\
.all_box_scroll::-webkit-scrollbar-thumb:hover {  background-color: #823b69;}\
\
.checkbox_div{position:relative;display: flex;flex-direction: row;align-items: center;background: #f5f5f599;padding: 0 10px;}}\
.checkbox{  vertical-align: top;  margin: 0 3px 0 0;  width: 17px;  height: 17px;}\
.checkbox + label {  cursor: pointer;}\
.checkbox:not(checked) {  opacity: 0;}\
.checkbox:not(checked) + label {  position: relative;vertical-align: top; }\
.checkbox:not(checked) + label:before {  content: '';  position: absolute;  top: -4px;  left: 0;  width: 50px;  height: 26px;  border-radius: 13px;  background: #CDD1DA;  box-shadow: inset 0 2px 3px rgba(0,0,0,.2);}\
.checkbox:not(checked) + label:after {  content: '';  position: absolute;  top: -2px;  left: 2px;  width: 22px;  height: 22px;  border-radius: 10px;  background: #FFF;  box-shadow: 0 2px 5px rgba(0,0,0,.3);  transition: all .2s;}\
.checkbox:checked + label:before {background: #9FD468;}\
.checkbox:checked + label:after {left: 26px;}\
.checkbox:focus + label:before { box-shadow: 0 0 0 3px rgba(255,255,0,.5);}\
\
.tolko_ne_poluch {width: 25%;}\
.user_codes_panel {width: 15%;}\
.setting_box {width:10%}\
.update_all_infos{position: absolute;width: 25%;left: 60%;top: 20%;text-align: center;    font-size: 0.8em;font-weight: bold;color: darkcyan;}\
.update_all_infos_item{border: 1px solid silver;margin: 0 0 5px 0;background: linear-gradient(45deg, #9dffd2, #00ff4385);border-radius: 8px;}\
\
.i_setting {cursor: pointer;font: normal normal normal 35px 'Font Awesome 5 Pro';  display: inline-block;  }\
.i_setting-set:before{content:\"\\f013\";    color: #ff8f00;}\
.i_setting:hover{animation:my 2s infinite;}\
.i_setting_div,.user_codesBox{position: fixed;    border: 1px solid silver;    width: 500px; top: 50%;    left: 50%;transform: translate(-50%,-50%);; display: none;background: linear-gradient(#ffffff,silver);z-index:9999999;box-shadow: 5px 5px 5px rgba(192, 192, 192, 0.26);}\
.i_setting_div input, select, .user_codesBox input {    background: linear-gradient(#eeffee,#9bfffa);    font: 8pt monospace;    width: 100%;text-align: right;     border-radius: 4px;}\
.i_setting_el_zoom{    position: absolute;    width: 300px !important;    font-size: 16px !important;    border: 4px solid yellow; padding: 10px;transition: 1s all;}\
.i_setting_div_caption,.user_codesBoxTitle{background: linear-gradient(silver,#efebeb);    width: 100%;    height: 30px;    text-align: center;padding:5px;}\
.i_setting_div_caption span, .user_codesBoxTitle span{user-select: none;    cursor: default;    color: grey;    font: bold 12pt/10pt monospace;}\
.i_setting_div_body,.user_codesList{overflow-y: scroll;  width: 100%;    max-height: 400px; clear: both; }\
\
.PoleElTable, .UserTable {display:table;text-align:center;}\
.PoleElTableCapt,.UserTableCapt {font-weight: bold;}\
.PoleElTableCapt > div, .UserTableCapt div {background: linear-gradient(#107bf9,#57d5fb);color: white;vertical-align: middle;font: 10pt monospace;    font-weight: bold;}\
.PoleElTable > div:not([class='PoleElTableLoad']), .UserTable > div {display:table-row;}\
.PoleElTable > div > div, .UserTable > div > div {display:table-cell; padding: 2px; vertical-align: middle;}\
.UserTable > div > div {font-size: 0.7em;}\
\
.user_codesBox input[type='checkbox']{width: 20px;height: 20px;vertical-align: middle;}\
\
.i_setting_div_foot, .user_codesButtons{width: 100%;    height: 50px;    background: linear-gradient(silver,white);    padding: 10px;text-align: center;}\
.i_setting_div_button{user-select: none;width: 105px;    height: 25px;    margin: 0 auto;    text-align: center;    border: 1px solid white;    color: white; line-height: 20px;    cursor: pointer;transition:1s all;display: inline-block;    margin: 0 2px;}\
.i_setting_div_save_button, .i_setting_div_add_button,.user_codesButtons_save,.user_codesButtons_add{background: linear-gradient(#8d8d92,#888a8a);}\
.i_setting_div_del_button,.user_codesButtons_del{display:none;background: -webkit-linear-gradient(top,#e02b34 0,#94044d 100%) ; opacity: 0;}\
.i_setting_div_del_button:hover,.user_codesButtons_del:hover{background: -webkit-linear-gradient(top,#b9030c 0,#ff51a9 100%) !important;}\
.i_setting_div_button:hover{background: linear-gradient(#8d8d92,#c3c7c7); font-size: 10pt;}\
\
.i_input_focus_close, .utrack_input_focus_close{position: absolute; display:none; cursor:pointer; transition: 1s all; border: 2px solid white;    padding: 3px;    width: 20px;    height: 20px;    text-align: center;    background: linear-gradient(silver,red);    color: white;    border-radius: 8px;    font: 10px bold monospace;}\
.i_input_focus_close:hover, .utrack_input_focus_close:hover{background: linear-gradient(#fd9b9b,orange); transform: rotateZ(359deg);}\
@keyframes my{from{transform:rotate(0deg)}to{transform:rotate(359deg)}}\
.i_smoke_div_fog{position: fixed;    display: none;    top: 0;    left: 0;    width: 100%;    height: 100%;    background: rgba(0,0,0,0.8);  z-index: 9999999;}\
#i_pop_menu p{text-align: left;    margin-left: 40px;}\
\
#checkbox_button {    background: linear-gradient(45deg, #82b7db, #c5baff);border-radius: 6px;color: white;padding: 1px 10px;cursor: pointer;user-select: none;box-shadow: 2px 2px 5px silver;}\
#checkbox_button:hover {background: linear-gradient(45deg, #c482db, #efbaff);}\
\
.error_icon_input:after{content:\"\\f057\";    color: orange;}\
.error_span_input{font-family:FontAwesome;font-size: 1.9em;    vertical-align: middle; padding: 3px;display: none;}\
\
.user_buttonShow{padding: 3px 10px;border-radius: 6px;user-select: none;cursor: pointer;background: linear-gradient(#9FD468, #49ad1f);color: white;box-shadow: 2px 2px 5px silver;}\
.user_buttonShow.modify{top:0px;}\
.user_buttonShow:hover{background: linear-gradient(#9FD468, #4ff30a);}\
.user_codeListItem{padding: 5px;border: 1px solid green;border-radius: 8px;margin: 5px;background: linear-gradient(#70f7ca,#0a714b);color: white;}\
\
.iframebox_x{position: absolute;    left: 96%;top: -5%;padding: 12px;background: silver;border-radius: 100%;color: darkred;border: 1px solid #6a1d1d;line-height: 0.7;cursor: pointer;box-shadow: 2px 4px 5px silver;}\
#i_pop_menu_track{position: fixed;width: 330px;left: 50%;top: 50%;border: 1px solid silver;background: linear-gradient(#c1c1c1,white);z-index: 9999999;transform:translate(-50%,-50%);border-radius: 8px;}\
.progress_line{height: 2px;  margin: 1px 0; border-radius: 6px; animation: 0.7s progress_anim alternate ease infinite;}\
@keyframes progress_anim {0% {    background: linear-gradient(90deg, #7dff9f 0%, #7dff9f 0, white 0);  }  10% {    background: linear-gradient(90deg, #7dff9f 10%, #7dff9f 0, white 0);  }  20% {    background: linear-gradient(90deg, #7dff9f 20%, #7dff9f 0, white 0);  }  30% {    background: linear-gradient(90deg, #7dff9f 30%, #7dff9f 0, white 0);  }  40% {    background: linear-gradient(90deg, #7dff9f 40%, #7dff9f 0, white 0);  }  50% {    background: linear-gradient(90deg, #7dff9f 50%, #7dff9f 0, white 0);  }  60% {    background: linear-gradient(90deg, #7dff9f 60%, #7dff9f 0, white 0);  }  70% {    background: linear-gradient(90deg, #7dff9f 70%, #7dff9f 0, white 0);  }  80% {    background: linear-gradient(90deg, #7dff9f 80%, #7dff9f 0, white 0);  }  90% {    background: linear-gradient(90deg, #7dff9f 90%, #7dff9f 0, white 0);  }  100% {    background: linear-gradient(90deg, #7dff9f 100%, #7dff9f 0, white 0);  }}\
");
// Styles

(function() { 
    var $ = $ = window.jQuery,
        gp_value = GM_getValue('gp_set'),
        gp_set = (gp_value)?JSON.parse(gp_value):{},

        debug = false;

    function saveStorage(){
        try{
            var save_data = JSON.stringify(gp_set);

            GM_setValue('gp_set', save_data);

            if(false) GM_setValue('gp_set_bak', save_data);

            if(debug) console.log("Сохраненный объект gp_set: ", GM_getValue('gp_set'));

        } catch(e){
            console.log(e);
        }
    }

    /* Описание элементов
0 - Ссылка отслеживания, 
1 - Название службы, 
2 - Значение по умолчанию, 
3 - Добавить кнопку отслеживания под трек-кодом, 
4 - Тип отслеживания у кнопок в шапке: 
      [0] Поддержка отслеживание нескольких кодов;
      [1] Одного кода и сайт;
      [2] Только перейти на сайт
*/
    var elem = [
        ["17track","http://www.17track.net/ru/track?nums=",1,0],
        ["Cainiao","https://global.cainiao.com/detail.htm?mailNoList=",1,0],
        ["ESTAR65","http://221.206.157.212/cgi-bin/GInfo.dll?EmmisTrack?w=xiangfeng56&cmodel=cmodel:estar56&cno=",1,0],
        ["СДЭК","http://www.edostavka.ru/track.html?order_id=",1,1],
        ["TRACK24","https://track24.ru/?code=", 1,1],
        ["POST-Track","http://post-tracker.ru/track/",1,1],
        ["Почта России","https://www.pochta.ru/tracking#",1,0],
        ["Post2go","https://post2go.ru",0,2],
        ["Postal.ninja","http://postal.ninja/ru/tracks",0,2],
        ["Flytexpress","http://flytexpress.com/En/Home/LogisticsTracking#orderIds=",1,1],
        ["Gsconto","http://www.gsconto.com/ru/tracker/show/",1,1],
        ["DHL Global Mail","https://webtrack.dhlglobalmail.com/?trackingnumber=",1,0]
    ],
        all_color = ["black", "navy", "darkblue", "mediumblue", "blue", "darkgreen", "green", "teal", "darkcyan", "deepskyblue",
                     "darkturquoise", "mediumspringgreen", "lime", "springgreen", "aqua", "cyan", "midnightblue", "dodgerblue", "lightseagreen", "forestgreen",
                     "seagreen", "darkslategray", "darkslategrey", "limegreen", "mediumseagreen", "turquoise", "royalblue", "steelblue", "darkslateblue", "mediumturquoise",
                     "indigo ", "darkolivegreen", "cadetblue", "cornflowerblue", "rebeccapurple", "mediumaquamarine", "dimgray", "dimgrey", "slateblue", "olivedrab",
                     "slategray", "slategrey", "lightslategray", "lightslategrey", "mediumslateblue", "lawngreen", "chartreuse", "aquamarine", "maroon", "purple",
                     "olive", "gray", "grey", "skyblue", "lightskyblue", "blueviolet", "darkred", "darkmagenta", "saddlebrown", "darkseagreen",
                     "lightgreen", "mediumpurple", "darkviolet", "palegreen", "darkorchid", "yellowgreen", "sienna", "brown", "darkgray", "darkgrey",
                     "lightblue", "greenyellow", "paleturquoise", "lightsteelblue", "powderblue", "firebrick", "darkgoldenrod", "mediumorchid", "rosybrown", "darkkhaki",
                     "silver", "mediumvioletred", "indianred ", "peru", "chocolate", "tan", "lightgray", "lightgrey", "thistle", "orchid",
                     "goldenrod", "palevioletred", "crimson", "gainsboro", "plum", "burlywood", "lightcyan", "lavender", "darksalmon", "violet",
                     "palegoldenrod", "lightcoral", "khaki", "aliceblue", "honeydew", "azure", "sandybrown", "wheat", "beige", "whitesmoke",
                     "mintcream", "ghostwhite", "salmon", "antiquewhite", "linen", "lightgoldenrodyellow", "oldlace", "red", "fuchsia", "magenta",
                     "deeppink", "orangered", "tomato", "hotpink", "coral", "darkorange", "lightsalmon", "orange", "lightpink", "pink",
                     "gold", "peachpuff", "navajowhite", "moccasin", "bisque", "mistyrose", "blanchedalmond", "papayawhip", "lavenderblush", "seashell",
                     "cornsilk", "lemonchiffon", "floralwhite", "snow", "yellow", "lightyellow", "ivory", "white"
                    ];

    function resetDefaultServices(){
        gp_set.services = [];

        for(var slu in elem){
            gp_set.services.push(elem[slu]);
        }
        saveStorage();
        upperPanel("clear");
        updateDataNaprotivKashdogo();
        update_setting_val("clear");
        alert("Службы восстановленны!");
    }


    if(gp_set.services === undefined || !gp_set.services){
        gp_set.services = [];

        for(var slu in elem){
            gp_set.services.push(elem[slu]);
        }
        //elem = gp_set.services = ;
        saveStorage();
    }    

    var lang_str = {
        ru:{
            gosite:"Перейти на сайт",
            otsl_one:"Отследить один код",
            otsl_nesk:"Отследить несколько кодов",
            openiframe:"Открыть в Iframe",

            otsl_na:"Отследить на: ",

            tolko_ne_poluch:"Только не полученные: ",

            enter_code_dlya:"Введите код для ",

            polucheno:"Получено",
            poluchil:"Получил",
            ostalos:"Осталось",
            iz:"из",
            vse_codi:"Все коды:",
            ne_poluch:"Не получено",
            vsego_posil:"Всего посылок",

            box_poluch_posilki: "Полученные посылки",
            box_pribuli_na_pochtu:"Прибыли на почту",
            box_otsleshivautsa:"Отслеживаются",
            box_ne_otsleshivautsa:"Не отслеживаются",

            generirovat_code:"Генерировать код",
            gen_no_code: "Нет треков для генерации для данной категории!",
            chem_razdelit_code:"Чем разделить коды?",
            kod_gotov:"Код готов!",
            // Проверка статуса
            check_posil_dost: "Посылка доставлена",
            check_prib_v_pubkt: "Прибыла в пункт назначения",
            check_ustan_srok_hran: "Хранение - Установленный срок хранения",
            check_info_poka_net: "Информации о посылке пока нет",
            // Правка и добавление служб
            setting: "Настройки",
            serv_name: "Название",
            serv_link: "Ссылка",
            otobr_niz: "Отобр. снизу",
            raz_perex: "Переходы",
            serv_del: "Удалить",
            add_serv: "Создать",
            save_serv: "Сохранить",
            reser_serv: "Сброс",
            q_reset_serv: "Восстановить службы по умолчанию?",
            type_per: ["Все","Один код и сайт","Только сайт","Открыть в Iframe"],
            bClose: "Закрыть",
            // add serv
            menu_add: "Меню добавления службы",
            button_add: "Добавить службу",
            q_del: "Вы хотите удалить эту(и) службу(ы)?",
            danie_edit : "Данные отредактированны!",
            q_save: "Сохранить изменения?",
            error_serv_name: "Ошибка в названии службы!\nНазвание службы отслеживания, не задано, в строке №",
            error_serv_link: "Ошибка ссылки!\nСсылка службы отслеживания, задана неверно, в строке №",
            return_prev_val: "Вернуть прежнее значение?",
            error_update_danix: "Ошибка обновления данных...",
            services_del_comp: "Служба(ы) успешно удалена(ы)!",
            error_create_buttons: "Ошибка создания кнопок напротив каждого трека!",
            service_add_comp: "Служба для отслеживания, была успешно добавлена!",
            textfield_empty_name: "Введенное название пустое!",
            textfield_empty_link: "Введенная ссылка пуста!",
            textfield_invalid_link: "Ссылка введена неккоректно!",
            textfield_invalid_trackcode: "Трэк-код введен неккоректно!",
            text_Error: "Ошибка!",

            //USER TRACK TRANSALTION
            month : ["Январь", "Февраль", "Март", "Апрель", "Май", " Июнь",
                     "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", " Декабрь"
                    ],
            addtrackcode: "Добавить трэк-код",
            userTrackcodes: "Пользовательские трек-коды",
            userTrackcodesDeleted:"Трэк-код(ы) был(и) удален(ы)!",
            deleteselectedTrackcodes:"Удалить выбранный(е) трэк-код(ы)?",
            canvTest:"ТЕСТ",
            usertrackalreadyAddRewrite: "Такой трэк-код уже был добавлен!\nПерезаписать?",
            nameTovarEmptyNoName: "Названме товара не указано, будет использ. \"Без названия\"",
            nonameTovar: "Без названия",
            listUserTrackEmptyAddTrack: "Список пуст! Нажмите кнопку Создать, чтобы добавить свой код!",
            update_all_codes: 'Обновить всё',
            // Form add user track
            u_nameServ: 'Название службы',
            u_linkServ: 'Ссылка службы',
            u_enterLink: 'Введите ссылку',
            u_nameTovar: 'Название товара',
            u_trackcode: 'Трэк-код',
            u_iconfon: 'Цвет фона',
            u_iconText:'Цвет текста',
            u_iconContur:'Цвет контура',
            u_icon:'Иконка',
            u_viewOnMain:'Отображать на странице',
            // User track error message
            u_error_trackcode: "Ошибка:\nПоле трэк-кода заполненно неверно, оно либо пустое, либо содержит неверные символы ",
            u_error_trackcodeFull: ["Ошибка:\nПоле трэк-кода, содержит неверные символы ",", в столбце ",", строка №"],
            u_error_trackcodeChangeFull: ["Внимание:\nПоле трэк-кода, было изменено на новое значение, в столбце ",", строка №",", вы действительно хотите изменить значание?"],
            u_error_fieldEmptyFull: ["Ошибка:\nПустое поле в столбце ",", строка №"],
            u_error_FullError: ["Ошибка:\n"," указана неверно, в строке №"],
            u_error_colorFull: ["Ошибка:\nЦвет указан неверно, в столбце ",", строка №"],
            update_all_tracks: {ok:'Успешно ->',already:'Проверка уже была -> ',confirm:'Хотите обновить все коды?',worknow:'Дождитесь обновления кодов!'}
        },
        en:{
            gosite:"Go to Site",
            otsl_one:"Track one code",
            otsl_nesk:"Track multiple codes",
            openiframe:"Open in Iframe",

            otsl_na:"Track on: ",

            tolko_ne_poluch:"Just do not received: ",

            enter_code_dlya: "Enter the code for ",

            polucheno: "Received",
            poluchil: "Got",
            ostalos: "Remaining",
            iz: "from",
            vse_codi: "All codes:",
            ne_poluch: "Not received",
            vsego_posil: "Total Package",

            box_poluch_posilki: "Received",
            box_pribuli_na_pochtu:"Arrived in the mail",
            box_otsleshivautsa:"Tracked",
            box_ne_otsleshivautsa:"Not tracked",

            generirovat_code:"Generate code",
            gen_no_code: "No tracks to generate for this category!",
            chem_razdelit_code:"To share the codes?",
            kod_gotov:"Code complete!",
            // Check status ! not edit !
            check_posil_dost: "Package delivered",
            check_prib_v_pubkt: "Arrived at the office of destination",
            check_ustan_srok_hran: "Storage - Fixed storage time",
            check_info_poka_net: "No information about the package yet",
            // Add service
            setting: "Settings",
            serv_name: "Name",
            serv_link: "Link",
            otobr_niz: "Services bottom track",
            raz_perex: "Transitions",
            serv_del: "Delete",
            add_serv: "New",
            save_serv: "Save",
            reser_serv: "Reset",
            q_reset_serv: "Do you want to restore the default services?",
            type_per: ["All","One code and website","Site","Open in Iframe"],
            bClose: "Close",
            // add serv
            menu_add: "Menu add service",
            button_add: "Add service",
            q_del: "You want to remove this(and) service(s)?",
            danie_edit : "Data is modified!",
            q_save: "Save changes?",
            error_serv_name: "Error in service name!\nazvanie tracking service, is not set in line#",
            error_serv_link: "reference Error!\psylla tracking service, is incorrect, in line#",
            return_prev_val: "restore the previous value?",
            error_update_danix: "Error updating data...",
            services_del_comp: "Service(s) Delete(s)!",
            error_create_buttons: "Error creating buttons opposite each track!",
            service_add_comp: "The tracking service has been successfully added!",
            textfield_empty_name: "The entered name is empty!",
            textfield_empty_link: "The entered link is empty!",
            textfield_invalid_trackcode: "The entered trackcode is empty!",
            textfield_invalid_link: "The link is entered incorrectly!",
            text_Error: "Error!",

            //USER TRACK TRANSALTION
            month : ["January", "February", "March", "April", "May", "June",
                     "July", "August", "September", "October", "November", "December"
                    ],
            addtrackcode: "Add a track code",
            userTrackcodes: "Custom Track Codes",
            userTrackcodesDeleted: "Track-code(s) has been (and) deleted(s)!",
            deleteselectedTrackcodes: "Do you want to delete the selected tracker(s)?",
            canvTest: "TEST",
            usertrackalreadyAddRewrite: "Such a track code has already been added!\nRewrite?",
            nameTovarEmptyNoName: "The product name is not specified, will be used \"Untitled \"",
            nonameTovar: "Untitled",
            listUserTrackEmptyAddTrack: "The list is empty! Click the Create button to add your code!",
            update_all_codes: 'Update all',
            // Form add user track
            u_nameServ: 'Service Name',
            u_linkServ: 'Service reference',
            u_enterLink: 'Enter a link',
            u_nameTovar: 'Product Name',
            u_trackcode: 'Track Code',
            u_iconfon: 'Background color',
            u_iconText: 'Text color',
            u_iconContur: 'Contour color',
            u_icon: 'Icon',
            u_viewOnMain: 'Display on page',
            // User track error message
            u_error_trackcode: "Error:\nThe track code field is invalid, it is either empty or contains invalid characters ",
            u_error_trackcodeFull: ["Error:\nTracing code field, contains invalid characters ", ", in column ", ", line No."],
            u_error_trackcodeChangeFull: ["Warning:\nThe track code field has been changed to a new value, in the column ", ", line No.", "do you really want to change the value?"],
            u_error_fieldEmptyFull: ["Error:\nPush field in column ", ", line No."],
            u_error_FullError: ["Error:\n", "invalid in line No."],
            u_error_colorFull: ["Error:\nThe color is incorrect, in the column ", ", line No."],
            update_all_tracks: {ok:'Successful ->',already:'Verification has already been done -> ',confirm:'Do you want to update all codes?',worknow:'Wait for updating codes!'}
        }
    };

    var sel_lang = lang_str.ru;
    if(window.location.hostname.search("gdeposylka.ru")<0){
        sel_lang = lang_str.en;
    } else {
        sel_lang = lang_str.ru;
    }

    function Objcount(obj){
        var keys=0;
        for (var propvalue in obj) {
            if (obj.hasOwnProperty(propvalue)) {
                keys++;
            }
        }
        return keys;
    }

    function searchinObj(obj, reqex){
        var keys=[];
        for (var propvalue in obj) {
            if (obj.hasOwnProperty(propvalue) && reqex.test(propvalue)) {
                keys.push(propvalue);
            }
        }
        return keys;
    }

    function CheckHost(name){
        return location.href.includes(name) ? true : false
    }

    // Проверить только не полученные
    function only_ne_poluch_button(){
        var cur_el=arguments[0].target;
        if(!gp_set.hasOwnProperty('setting')){
            gp_set.setting={};
        }
        gp_set.setting.tolko_ne_poluch = !cur_el.parentElement.children[1].checked;
        saveStorage();
    }

    // start abs menu function
    function make_abs(){
        codes_names = [dannie_o_trekax[0].split(","),dannie_o_trekax[1].split("|"),dannie_o_trekax[3].split("|")];

        if(gp_set.markers === undefined || gp_set.markers === null){
            gp_set.markers = {};
        }

        var abs_div=document.getElementById("abs_div");
        if(abs_div){
            abs_div.innerHTML="";
        }else{
            abs_div=document.createElement("div");
            abs_div.id="abs_div";
        }
        var rn_el=document.getElementsByClassName("track-container");

        var all_box_scroll = document.createElement("div");
        all_box_scroll.className="all_box_scroll";

        var abs_div_normal=document.createElement("div");
        abs_div_normal.id="normal_abs_div";    

        var abs_div_prishla=document.createElement("div");
        abs_div_prishla.id="prishla_abs_div";

        var abs_div_poluch=document.createElement("div");
        abs_div_poluch.id="poluch_abs_div"; 

        var abs_div_nenormal=document.createElement("div");
        abs_div_nenormal.id="nenormal_abs_div"; 

        var checkbox_input = document.getElementById("checkbox");


        abs_div_normal.innerHTML="<div class=\"abs_punkti\" style=\"background: linear-gradient(#0790c5,#1be0ff);\">"+sel_lang.box_otsleshivautsa+" </div>";
        abs_div_nenormal.innerHTML="<div class=\"abs_punkti\" style=\"background: linear-gradient(#ff07d5,#921313);\">"+sel_lang.box_ne_otsleshivautsa+" </div>";
        abs_div_prishla.innerHTML="<div class=\"abs_punkti\" style=\"background: linear-gradient(#0037ff,#1099af);\">"+sel_lang.box_pribuli_na_pochtu+" </div>";
        abs_div_poluch.innerHTML="<div class=\"abs_punkti\" style=\"background: linear-gradient(#ff6f08,orange);\">"+sel_lang.box_poluch_posilki+" </div>";

        var gen_div=document.createElement("div");

        abs_div_normal.className = "abs_div_cat";
        abs_div_prishla.className = "abs_div_cat";
        abs_div_poluch.className = "abs_div_cat";
        abs_div_nenormal.className = "abs_div_cat";
        gen_div.setAttribute("style","text-align:center;cursor:pointer;background:blue;color:white;margin-top:10px;padding:3px;");
        gen_div.innerText=sel_lang.generirovat_code;

        gen_div.addEventListener("click", function(){
            if((checkbox_input.checked && dannie_o_trekax[4].length<=0) || (!checkbox_input.checked && dannie_o_trekax[0].length<=0)){
                alert(sel_lang.gen_no_code+"\n"+sel_lang.tolko_ne_poluch+checkbox_input.checked);
                return;
            }
            var t = prompt(sel_lang.kod_gotov,",");
            var check_ok=((checkbox_input.checked)?dannie_o_trekax[4]:dannie_o_trekax[0]);
            if(t)prompt(sel_lang.kod_gotov,check_ok.replace(/,/g,t));

        });

        var text_abs = ["","","",""];
        var otsl = [0,0,0,0];
        for(var g=0;g<dannie_o_trekax[0].split(",").length;g++){

            var other_mag ="";
            if(/^A.*$/i.test(codes_names[0][g]) || /\[BG\]/i.test(codes_names[1][g])){
                other_mag = "style=\"background: linear-gradient(#22a79a, #00ffdc)\"";
            } else {
                other_mag ="";
            }

            var code_vis_tag = ["<div pos=\""+g+"\" name=\"my_opt\" class=\"ab_style\""+other_mag+"\" title=\""+codes_names[1][g]+
                                "\" onmouseover=\"var c=this.getAttribute('pos');document.getElementsByClassName('track')[c].style['background']='linear-gradient(",")';document.body.scrollTop=document.getElementsByClassName('track')[c].offsetTop-300\" onmouseout=\"var c=this.getAttribute('pos');document.getElementsByClassName('track')[c].style['background']=''\">"+codes_names[0][g]+"</div>"];
            var vis_menu = {
                dost                : code_vis_tag[0]+"white,orange"+code_vis_tag[1],
                priv_v_puntk_i_xran : code_vis_tag[0]+"white,#1099af"+code_vis_tag[1],
                no_info             : code_vis_tag[0]+"white,#ff07d5"+code_vis_tag[1],
                otsleshiv           : code_vis_tag[0]+"white,cyan"+code_vis_tag[1]
            };

            if(codes_names[2][g].search(sel_lang.check_posil_dost)===0 ||gp_set.markers[codes_names[0][g]] === true){
                gp_set.markers[codes_names[0][g]] = true
                text_abs[0] += vis_menu.dost;
                otsl[0]+=rn_el.length>0 ? 1 : 0;
            } else if(codes_names[2][g].search(sel_lang.check_prib_v_pubkt)===0 || codes_names[2][g].search("Хранение - Установленный срок хранения")===0){
                text_abs[1] += vis_menu.priv_v_puntk_i_xran;
                otsl[1]+=rn_el.length>0 ? 1 : 0;
                dannie_o_trekax[4]+=codes_names[0][g]+((g< rn_el.length-1)?",":"");
            } else if(codes_names[2][g].search(sel_lang.check_info_poka_net)===0){
                text_abs[3] += vis_menu.no_info;
                otsl[3]+=rn_el.length>0 ? 1 : 0;
                dannie_o_trekax[4]+=codes_names[0][g]+((g< rn_el.length-1)?",":"");
            } else {
                text_abs[2] += vis_menu.otsleshiv;
                otsl[2]+=rn_el.length>0 ? 1 : 0;
                dannie_o_trekax[4]+=codes_names[0][g]+((g< rn_el.length-1)?",":"");
            }
        }
        abs_div.innerHTML="<div style=\"text-align:center;background: linear-gradient(#6D3263,#DF6283);color: white;font-weight: bold;\">"+sel_lang.vse_codi+"</div>";
        abs_div_poluch.innerHTML+= text_abs[0];
        abs_div_prishla.innerHTML+= text_abs[1];
        abs_div_normal.innerHTML+= text_abs[2];
        abs_div_nenormal.innerHTML+= text_abs[3];

        abs_div.appendChild(all_box_scroll);

        all_box_scroll.appendChild(abs_div_poluch);
        all_box_scroll.appendChild(abs_div_prishla);
        all_box_scroll.appendChild(abs_div_normal);
        all_box_scroll.appendChild(abs_div_nenormal);

        abs_div.appendChild(gen_div);
        document.body.appendChild(abs_div);

        abs_div_poluch.firstChild.innerHTML+= "("+otsl[0]+"):";
        abs_div_prishla.firstChild.innerHTML+= "("+otsl[1]+"):";
        abs_div_normal.firstChild.innerHTML+="("+otsl[2]+"):";
        abs_div_nenormal.firstChild.innerHTML+= "("+otsl[3]+"):";

        // Markers
        var c_ab = document.getElementsByName("my_opt");
        var count_pol=0;
        for(var z=0;z<c_ab.length;z++){
            // Event
            c_ab[z].addEventListener("click", clickabs);

            // Marker load
            var tek_z = z;
            for(var k in gp_set.markers){
                if (gp_set.markers.hasOwnProperty(k)){
                    if(c_ab[tek_z].innerText === k){
                        if(gp_set.markers[k]) {
                            gp_set.markers[k] = true;
                            c_ab[z].setAttribute("class", "ab_styles");
                            count_pol++;
                        } else {
                            gp_set.markers[k] = false;
                            c_ab[z].setAttribute("class", "ab_style");
                        }
                    }
                    // Main pole visible
                    if(codes_names[0][tek_z] === k && gp_set.markers[codes_names[0][tek_z]] || codes_names[2][tek_z].search(sel_lang.check_posil_dost)===0){ // add> codes_names[2][tek_z].search(sel_lang.check_posil_dost)===0
                        if(rn_el.length>0) rn_el[tek_z].children[0].className="track ab_style_complete";
                    } else if(!gp_set.markers[codes_names[0][tek_z]]){
                        if(rn_el.length>0) rn_el[tek_z].children[0].className=rn_el[tek_z].children[0].className.replace(/\s+ab_style_complete/i,"");
                    }
                    //
                }
            }
            // Marker load end
        }
        abs_div.children[0].innerHTML+="<p style=\"margin: 0;font-size: 10px;font-weight: bold;\"><span style=\"color:lime;\" title=\""+sel_lang.polucheno+"!\">"+
            sel_lang.polucheno+": "+count_pol+"</span><span style=\"color:orange;\" title=\""+sel_lang.vsego_posil+"\"> "+sel_lang.iz+" "+((rn_el.length>0) ? dannie_o_trekax[0].split(",").length:0)+
            "</span></p><p style=\"font-size: 10px;margin: 0;font-weight: bold;\"><span style=\"color:cyan;\" title=\""+sel_lang.ne_poluch+"!\"> "+sel_lang.ostalos+": "+((rn_el.length>0) ? (dannie_o_trekax[0].split(",").length-count_pol):0)+"</span></p>";
        // Markers end
    }
    // end abs menu function

    function clickabs(){
        var el = arguments[0].target;
        var el_name = el.getAttribute("pos")*1;
        var el_value = codes_names[0][el_name];
        if(gp_set.markers[el_value]){
            //gp_set.markers[el_value] = false;
            gp_set.markers[el_value]=false;
            el.setAttribute("class", "ab_style");
            // snimaem marker
        } else {
            // stavim marker
            gp_set.markers[el_value]=true;
            el.setAttribute("class", "ab_styles");
        }
        saveStorage();
        make_abs();
    }

    // Pop up menu
    var options = [sel_lang.otsl_one,sel_lang.otsl_nesk,sel_lang.gosite, sel_lang.openiframe];

    function pop_menu_click(){
        var tek_el=this.parentElement.parentElement.parentElement.getAttribute("elem")*1;
        var checkbox_input = document.getElementById("checkbox");

        if(this.innerText.search(options[3]) === 0) {
            var site_frame = gp_set.services[tek_el][1];
            console.log(site_frame)
            //site_frame = site.match(/^https?:\/\/[a-zA-z0-9.-]+/i)[0];
            if(debug) console.log("URL сайта iframe: ", site_frame);

            let frame = $("<iframe width='560' height='315' frameborder='0' id='frame_site'>").attr({src:site_frame})

            if(!$("#iframe_site_out").length){
                let divbox = $("<div id='iframe_site_out'>").attr('style','position:absolute;z-index:9999;top:50%;left:50%;transform: translate(-50%, -50%);box-shadow:4px 4px 8px silver;border:1px solid darkgrey;background: #fff;'),
                    divX = $("<div class='iframebox_x'>").text("X").click(function(e){
                        $(e.target.parentNode).fadeToggle('slow')
                    }),
                    outp = $("<div id='iframe_site_body'>")
                outp.append(frame)
                divbox.append(divX,outp)

                $("body").append(divbox)
            } else {
                $("#iframe_site_body").empty().append(frame)
                $("#iframe_site_out").fadeToggle('slow')
            }

        } else if(this.innerText.search(options[2]) === 0) {
            var site = gp_set.services[tek_el][1];
            site = site.match(/^https?:\/\/[a-zA-z0-9.-]+/i)[0];
            if(debug) console.log("URL сайта: ",site);
            window.open(site);
        } else if(this.innerText.search(options[0]) === 0){
            var req=prompt(sel_lang.enter_code_dlya+gp_set.services[tek_el][0]+":","");
            if(req.length>0 && !/^\s*$/.test(req)){
                window.open(gp_set.services[tek_el][1]+req);
            } else {
                alert("Поле пустое!");
                return;
            }
        } else if(this.innerText.search(options[1]) === 0){
            if((checkbox_input.checked && dannie_o_trekax[4].length<=0) || (!checkbox_input.checked && dannie_o_trekax[0].length<=0)){
                alert(sel_lang.gen_no_code+"\n"+sel_lang.tolko_ne_poluch+checkbox_input.checked);
                return;
            }
            var past_codes_all_ili_net = ((checkbox_input.checked)?dannie_o_trekax[4]:dannie_o_trekax[0]);
            window.open(gp_set.services[tek_el][1]+past_codes_all_ili_net);
        }
    }
    function pop_v2(my_i){
        var my_el = gp_set.services[my_i];

        let ul = document.createElement("ul");
        ul.className="ul_menu";
        for(var i=0;i<options.length;i++){
            if(my_el[3] === 2 || my_el[3] === 3){
                if(i<2) continue;
            } else if(my_el[3] === 1){
                if(i===1) continue;
            }

            let li = document.createElement("li");
            li.className="li_menu";

            let a = document.createElement("a");
            a.className="a_menu";
            a.href="#";
            a.innerText=options[i];
            a.addEventListener("click", pop_menu_click);

            li.appendChild(a);
            ul.appendChild(li);
        }
        return ul;
    }
    // Pop up menu  end

    // Start - Верхняя панель со службами отслеживания
    function upperPanel(){
        let liel= document.getElementsByClassName("my-navbar-center")[0] || null;

        if(liel){

            if(arguments[0] === "clear") $(liel).empty();


            for(var i=0;i<gp_set.services.length;i++){

                let li = document.createElement("li");
                li.innerHTML=((gp_set.services[i][0].search("17track")<0)?"<div>"+gp_set.services[i][0]+
                              "</div>":'<img src="https://res.17track.net/global-v2/imgs/logo/svg/fullen_obt_128x32.svg?v=95abf356d0" style="width: 80px;"/>')// '+/*'background: linear-gradient('+getColorRND()+*/');">');
                //
                let pop_div_menu = pop_v2(i);
                li.appendChild(pop_div_menu);

                //
                let rcol = getColorRND();
                li.setAttribute("style",((gp_set.services[i][0].search("17track")<0))?"border: 1px solid;    margin: 5px 5px;    padding: 2px;background: linear-gradient("+rcol+");"+
                                "color: #e7dcdc;   text-shadow: 1px 1px 0px black;    cursor: pointer;":"margin: 5px 5px;    padding: 2px;cursor: pointer;");
                li.className="li_style";
                li.title=sel_lang.otsl_na+gp_set.services[i][0];
                li.setAttribute("elem",i);
                liel.appendChild(li);
            }
        }
    }// End - Верхняя панель со службами отслеживания

    // Update naprotiv kashdogo start
    function updateDataNaprotivKashdogo(){
        var title_wrapper = document.getElementsByClassName("title-wrapper"),
            naprotivKBody = document.getElementsByClassName("li_body_naprotiv_kashdogo"),
            rn_el=document.getElementsByClassName("track-container");

        if(rn_el.length > naprotivKBody.length){
            for(let i=0; i<rn_el.length; i++){
                if(rn_el[i].nextElementSibling === null){
                    var li_body = document.createElement("div");
                    var li_body1 = document.createElement("div");
                    li_body.setAttribute("style", "margin-bottom: 25px;background: #f9f9f9;");
                    li_body1.setAttribute("style", "position:absolute;");
                    li_body1.className = "li_body_naprotiv_kashdogo";
                    document.getElementsByClassName("track-list")[0].insertBefore(li_body,rn_el[i].nextSibling);
                    document.getElementsByClassName("track-list")[0].insertBefore(li_body1,rn_el[i].nextSibling);

                    for(var j=0;j<gp_set.services.length;j++){
                        if(gp_set.services[j][2]){
                            var li = document.createElement("div");
                            li.innerHTML='<span onclick="window.open(&quot;'+gp_set.services[j][1]+el_a+'&quot;);">'+gp_set.services[j][0]+'</span>';
                            let rcol = getColorRND();
                            li.setAttribute("style","background: linear-gradient("+rcol+");");
                            li.className="track_service";
                            li.title=sel_lang.otsl_na+gp_set.services[j][0];
                            li_body1.appendChild(li);
                        }
                    }
                }
            }
            naprotivKBody = document.getElementsByClassName("li_body_naprotiv_kashdogo");
        }

        if(title_wrapper && naprotivKBody){
            let li;
            for(var i = 0; i < naprotivKBody.length; i++){
                var el_a=title_wrapper[i].getElementsByClassName("tracking-number")[0].innerText;

                if(arguments[0] !== "one"){
                    naprotivKBody[i].innerHTML="";
                    for(let j=0;j<gp_set.services.length;j++){
                        if(gp_set.services[j][2]){
                            li = document.createElement("div");
                            li.innerHTML='<span onclick="window.open(&quot;'+gp_set.services[j][1]+el_a+'&quot;);">'+gp_set.services[j][0]+'</span>';
                            let rcol = getColorRND();
                            li.setAttribute("style","background: linear-gradient("+rcol+");");
                            li.className="track_service";
                            li.title=sel_lang.otsl_na+gp_set.services[j][0];
                            naprotivKBody[i].appendChild(li);
                        }
                    }
                } else if(arguments[0] === "one" && gp_set.services[gp_set.services.length-1][2]){
                    var tek_service = gp_set.services[gp_set.services.length-1];
                    li = document.createElement("div");
                    li.innerHTML='<span onclick="window.open(&quot;'+tek_service[1]+el_a+'&quot;);">'+tek_service[0]+'</span>';
                    let rcol = getColorRND();
                    li.setAttribute("style","background: linear-gradient("+rcol+");");
                    li.className="track_service";
                    li.title=sel_lang.otsl_na+tek_service[0];
                    naprotivKBody[i].appendChild(li);
                } else {break;}
            }
        } else {
            alert(sel_lang.error_update_danix);
        }
    }
    // Update naprotiv kashdogo end

    // --- Start Setting edit, add, delete services
    function update_setting_val(){
        if(arguments[0] === "clear")$(".i_setting_div_body").empty();

        var PoleElTable = document.createElement("div");
        PoleElTable.className = "PoleElTable";

        var PoleElTableCapt = document.createElement("div");
        PoleElTableCapt.className ="PoleElTableCapt";

        $(PoleElTableCapt).html("<div>№</div><div>"+sel_lang.serv_name+"</div><div>"+sel_lang.serv_link+"</div><div>"+sel_lang.otobr_niz+"</div><div>"+sel_lang.raz_perex+"</div><div>"+sel_lang.serv_del+"</div>");
        PoleElTable.append(PoleElTableCapt);

        /*var PoleElTableLoad= document.createElement("div");
    PoleElTableLoad.className = "PoleElTableLoad";
    PoleElTableLoad.setAttribute("style","border: 10px solid #ded9d9;    border-radius: 60px;    width: 100px;    height: 100px;    border-bottom-color: #99ff53; animation: my 1s infinite;    position: relative;  left: 160px;");
    PoleElTable.append(PoleElTableLoad);*/

        for(var i=0;i<gp_set.services.length;i++){ // array 0
            var PoleEl = document.createElement("div");
            for(var j=0;j<gp_set.services[i].length;j++){
                var input_el_cel = document.createElement("div");
                var input_el = "";

                if(j === 2){
                    input_el = document.createElement("select");
                    input_el.innerHTML = "<option value='0'>false</option><option value='1'>true</option>";
                    input_el.value = gp_set.services[i][j];

                    if(JSON.parse(gp_set.services[i][j])){input_el.setAttribute("style","background: linear-gradient(#d9ff5a,#16ff73)");} else{ input_el.setAttribute("style","background: linear-gradient(#eeffee,#ff9bb7)");}

                    input_el.addEventListener("change", function(){
                        if(JSON.parse(this.value)){this.setAttribute("style","background: linear-gradient(#d9ff5a,#16ff73)");} else{ this.setAttribute("style","background: linear-gradient(#eeffee,#ff9bb7)");}
                    });

                } else {

                    input_el = document.createElement("input");
                    input_el.id = (j === 0)?"name_services_otsl":"link_services_otsl";
                    input_el.addEventListener("focus",function(event){focusInp(event);});
                    input_el.addEventListener("blur",function(event){blurInp(event);});

                    if(j === 3){
                        input_el = document.createElement("select");
                        input_el.innerHTML = "<option value='0'>"+sel_lang.type_per[0]+"</option><option value='1'>"+sel_lang.type_per[1]+"</option><option value='2'>"+sel_lang.type_per[2]+"</option><option value='3'>"+sel_lang.type_per[3]+"</option>";
                        input_el.value = gp_set.services[i][j];

                    } else{
                        input_el.type = "text";
                    }

                    input_el.value = gp_set.services[i][j];
                }
                input_el_cel.append(input_el);

                if(j === 0) $(PoleEl).append("<div><div style='text-align: center;'><div style='font: bold 0.8em sans-serif;    border: 1px solid lime;    border-radius: 16px;    background: white;    line-height: 1.7; width:20px;height:20px;'>"+(i+1)+"</div></div></div>");
                PoleEl.append(input_el_cel);
                if(j === 3) $(PoleEl).append("<div><div style='text-align: center;'><input style='width: 20px;height: 20px;vertical-align: middle;' type='checkbox'></div></div>");

            }
            PoleElTable.append(PoleEl);
            $(".i_setting_div_body").append(PoleElTable);
        }
        // CheckBox checked
        $(".i_setting_div_body").find("input[type=checkbox]").each(function(index,eleme){
            $(eleme).on("click",function(){

                if($(this).is(':checked')) $(".i_setting_div_del_button").css({"display":"inline-block"}).animate({opacity:"+=1.0"});

                $(".i_setting_div_del_button").text(sel_lang.serv_del+" ("+$(".i_setting_div_body").find("input:checked").length+")");

                if($(".i_setting_div_body").find("input:checked").length <= 0){
                    $(".i_setting_div_del_button").text(sel_lang.serv_del);
                    $(".i_setting_div_del_button").fadeOut(1000,function(){$(this).css("opacity","0");});
                }
            });
        });

        if($(".i_setting_div_body").find("input:checked").length <= 0){
            $(".i_setting_div_del_button").text(sel_lang.serv_del);
            $(".i_setting_div_del_button").fadeOut(1000,function(){$(this).css("opacity","0");});
        }

        // CLose button
        var i_input_focus_close = document.createElement("div");
        i_input_focus_close.innerText = "X";
        i_input_focus_close.className = "i_input_focus_close";
        i_input_focus_close.title = sel_lang.bClose;
        $(".i_setting_div_body").append(i_input_focus_close);
    }

    function setting_save_value(){
        $(".i_input_focus_close").fadeOut(500);
        var temp_zapis = [];
        var temp_zapis1 = [];
        var save_value = true;
        var z =0;
        $(".PoleElTable").find("input[type!=checkbox], select").each(function(index, eleme){
            var self = $(this).val();

            if($(this).get(0).tagName.toLowerCase() === "input"){
                var stroke_error = $(this).parent().parent().index();

                if($(this).val().length < 1 || /^\s*$/.test($(this).val())){
                    alert(sel_lang.error_serv_name+stroke_error);
                    $(this).val(gp_set.services[stroke_error-1][0]);
                    save_value = false;
                    return;
                }

                if($(this).attr("id") === "link_services_otsl" && !/^https?\:\/\/.*/i.test($(this).val())){
                    alert(sel_lang.error_serv_link+stroke_error);
                    if(confirm(sel_lang.return_prev_val))$(this).val(gp_set.services[stroke_error-1][1]);
                    save_value = false;
                    return;
                }

            }
            z++;

            if(z>2) temp_zapis1.push($(this).val()*1);
            else temp_zapis1.push($(this).val());

            if(z > 3){
                temp_zapis.push(temp_zapis1);
                temp_zapis1 = [];
                z=0;
            }


        });
        if(confirm(sel_lang.q_save)){
            if(temp_zapis.length > 0 && save_value){
                gp_set.services = temp_zapis;
                saveStorage();
                alert(sel_lang.danie_edit);
                upperPanel("clear");
                updateDataNaprotivKashdogo();
            }
        }

    }

    function setting_add_value(){
        $(".i_smoke_div_fog").fadeIn(1000, function(){
            if(!$("#i_pop_menu").length){
                var $pop_meuni = $("<div id='i_pop_menu' style='display:none;position: fixed;width: 300px;height: 200px;left: 50%;top: 50%;border: 1px solid silver;background: linear-gradient(#c1c1c1,white);z-index: 9999999;margin-left: -150px;margin-top: -100px;border-radius: 8px;'>\
\<div style='width: 100%;background: linear-gradient(silver,#808686);text-align: center;border-radius: 8px 8px 0 0;color: white;padding: 3px;border-bottom: 2px dotted white;'><div style='float:right;float: right;cursor: pointer; margin-right: 5px; font-size: 10pt;' id='i_pop_menu_close_b'>X</div>"+sel_lang.menu_add+"</div>\
\<div style='padding: 5px;    color: #5f5d5d;    font: normal 12px/14px monospace;text-align:center;'>\
\<p>"+sel_lang.serv_name+": <input id='i_pop_menu_input_name' type='text' value /><span title='"+sel_lang.text_Error+"'></span></p>\
\<p>"+sel_lang.serv_link+": <input id='i_pop_menu_input_link' type='text' value='http://' /><span title='"+sel_lang.text_Error+"'></span></p>\
\<p>"+sel_lang.otobr_niz+": <select id='i_pop_menu_select' style='width:81px;'><option value='0'>false</option><option value='1'>true</option></select></p>\
\<p>"+sel_lang.raz_perex+": <select id='i_pop_menu_typeview' style='width:115px;'><option value='0'>"+sel_lang.type_per[0]+"</option><option value='1'>"+sel_lang.type_per[1]+"</option><option value='2'>"+sel_lang.type_per[2]+"</option><option value='3'>"+sel_lang.type_per[3]+"</option></select></p>\
\<div disabled id='i_pop_menu_button_add' style='width: 150px;margin: 0 auto;height: 30px;line-height: 30px;background: linear-gradient(#75f575,#16bf02);color: white;border-radius: 8px;box-shadow: 2px 2px 5px silver;cursor:pointer;'>"+sel_lang.button_add+"</div></div></div>");

                $("body").append($pop_meuni);

                // Close button
                $("#i_pop_menu_close_b").click(function(){
                    $pop_meuni.fadeOut(1000,function(){
                        $(".i_smoke_div_fog").fadeOut(1000,function(){
                            $("#i_pop_menu_input_link, #i_pop_menu_input_name").parent().find("span").removeClass("error_icon_input");
                            $("#i_pop_menu_input_link, #i_pop_menu_input_name").css("border-color","");

                            $("#i_pop_menu_input_name").val("");
                            $("#i_pop_menu_input_link").val("http://");
                            $("#i_pop_menu_typeview,#i_pop_menu_select").val("0");

                        });
                    });
                });
                // Close button end

                // Add service button
                $("#i_pop_menu_button_add").hover(function(e){
                    $(this).css("background",e.type === "mouseenter" ? "linear-gradient(rgb(26, 107, 26), rgb(48, 253, 21))":"linear-gradient(#75f575,#16bf02)");
                });

                $("#i_pop_menu_button_add").click(function(){

                    var newServicesArrayInput = [];
                    var i_pop_menu_input_link = $("#i_pop_menu_input_link").val();
                    var i_pop_menu_input_name = $("#i_pop_menu_input_name").val();
                    var i_pop_menu_select = $("#i_pop_menu_select").val();
                    var i_pop_menu_typeview = $("#i_pop_menu_typeview").val();


                    // Text empty!
                    if(i_pop_menu_input_name.length < 1 || /^\s*$/.test(i_pop_menu_input_name)){
                        alert(sel_lang.textfield_empty_name);
                        $("#i_pop_menu_input_name").parent().find("span").addClass("error_span_input error_icon_input").fadeIn(1000);
                        $("#i_pop_menu_input_name").css("border-color","red");
                        return;
                    }

                    if(i_pop_menu_input_link.length < 1 || /^\s*$/.test(i_pop_menu_input_link)){
                        alert(sel_lang.textfield_empty_link);
                        $("#i_pop_menu_input_link").parent().find("span").addClass("error_span_input error_icon_input").fadeIn(1000);
                        $("#i_pop_menu_input_link").css("border-color","red");
                        return;
                    }

                    // Link text invalid!
                    if(!/^https?\:\/\/.*/i.test(i_pop_menu_input_link)){
                        alert(sel_lang.textfield_invalid_link);
                        $("#i_pop_menu_input_link").parent().find("span").addClass("error_span_input error_icon_input").fadeIn(1000);
                        $("#i_pop_menu_input_link").css("border-color","red");
                        return;
                    }

                    $("#i_pop_menu_input_link, #i_pop_menu_input_name").parent().find("span").fadeOut(1000,function(){$(this).removeClass("error_icon_input");});
                    $("#i_pop_menu_input_link, #i_pop_menu_input_name").css("border-color","");

                    if(gp_set.services === undefined){return;}

                    newServicesArrayInput = [i_pop_menu_input_name,i_pop_menu_input_link,parseInt(i_pop_menu_select),parseInt(i_pop_menu_typeview)];

                    if(debug) console.log("Массив параметров нового сервиса:", newServicesArrayInput);
                    /*
    for(var ser in gp_set.services){
        if(ser.toLowerCase() === newServicesArrayInput[0].toLowerCase()){
            return;
        }
    }*/

                    gp_set.services.push(newServicesArrayInput);
                    saveStorage();
                    alert(sel_lang.service_add_comp);

                    $("#i_pop_menu").fadeOut(500,function(){
                        $(".i_smoke_div_fog").fadeOut(1000,function(){

                            $("#i_pop_menu_input_link, #i_pop_menu_input_name").parent().find("span").removeClass("error_icon_input");
                            $("#i_pop_menu_input_link, #i_pop_menu_input_name").css("border-color","");

                            $("#i_pop_menu_input_name").val("");
                            $("#i_pop_menu_input_link").val("http://");
                            $("#i_pop_menu_typeview,#i_pop_menu_select").val("0");
                            update_setting_val("clear");
                            upperPanel("clear");
                            updateDataNaprotivKashdogo("one");
                        });
                    });

                });

                // Add service button end
                $("#i_pop_menu").children(":nth-child(2)").find("input").each(function(index, eleme){
                    $(eleme).on("input", function(){
                        var minlengt = /^\s*$/.test($(this).val());
                        var empty_input = $(this).val().length < 1;
                        var link_check = ($(this).attr("id")==="i_pop_menu_input_link" && !/https?\:\/\/.*/i.test($(this).val()));

                        if(minlengt || empty_input || link_check){
                            $(this).parent().find("span").addClass("error_span_input error_icon_input").fadeIn(1000);
                            $(this).css("border-color","red");
                        } else {
                            $(this).parent().find("span").fadeOut(1000,function(){$(this).removeClass("error_icon_input");});
                            $(this).css("border-color","");
                        }
                    });

                });

                $pop_meuni.fadeIn(1000);
            } else {
                $("#i_pop_menu").fadeIn(1000);
            }
        });
    }

    function setting_del_value(){
        if(confirm(sel_lang.q_del)){
            var arr_del = [];
            $(".i_setting_div_body").find("input[type=checkbox]").each(function(index,eleme){
                if($(this).is(':checked')){
                    arr_del.push(index);
                }
            });
            arr_del = arr_del.reverse();
            for(var k in arr_del){
                gp_set.services.splice(arr_del[k],1);
            }
            saveStorage();
            alert(sel_lang.services_del_comp);

            upperPanel("clear");
            updateDataNaprotivKashdogo();
            update_setting_val("clear");
        }
    }

    function focusInp(event){
        var ev = event,
            elementClick = ev.target,
            objSet = {"left": elementClick.offsetLeft+350+"px", "top":(elementClick.offsetTop-25)+"px", "display": "block"};

        if(elementClick.offsetParent.className !== "user_codesBox"){

            $(".i_input_focus_close").css(objSet).click(function() {
                $(this).css({"display": "none"});
            });

        } else {

            $(".utrack_input_focus_close").css(objSet).click(function() {
                $(this).css({"display": "none"});
            });

        }
        elementClick.className = "i_setting_el_zoom";
        elementClick.focus();
    }

    function blurInp(event){
        var el = event.target;
        $(".i_input_focus_close").add($(".utrack_input_focus_close")).css({"display": "none"});
        el.removeAttribute("class");
    }

    // Show window setting services
    function setting_window(){
        if($(".user_codesBox").is(":visible")){

            if(parseFloat($(".user_codesBox").css("left")) > parseFloat($("body").css("width"))/2){
                $(".user_codesBox").css("left","50%");
            }

            let leftOf = parseFloat($(".user_codesBox").css("left"))+parseFloat($(".user_codesBox").css("width"))+20;

            $(".i_setting_div").css("left",leftOf);
        } else {
            $(".i_setting_div").css("left","50%");
        }

        $(".i_setting_div").fadeToggle(1000, function(){

            if(!document.getElementsByClassName("PoleElTable")[0]){
                update_setting_val();
            }

        });

    } // show setting end
    //--- End Setting edit, add, delete services

    // Start - Проверка трека напротив каждого трека
    var dannie_o_trekax=["","","","",""];
    var codes_names = [];

    function NaprotuvKashdogo(){
        if(!checkLocation("/courier")){
            var rn_el=document.getElementsByClassName("track-container");
            var title_wrapper = document.getElementsByClassName("title-wrapper");
            var tek_pol=document.getElementsByClassName("checkpoint-status");
            var track_list=document.getElementsByClassName("track-list")[0]

            /*if(window.location.href.includes('archive') && !confirm(`Кодов отслеживания найдено '${rn_el.length}', большое количество кодов, может замедлить работу кода!
Загрузить кнопки отслеживания? `)){
            alert('Загрузка кодов была отменена!')
            return
        }*/

            if(rn_el && title_wrapper && tek_pol){
                for(let i=0;i< rn_el.length;i++){
                    var el_a=title_wrapper[i].children[1].textContent;
                    //var el_a=rn_el[i].getElementsByTagName("a")[0].innerText;
                    //var el_div=(rn_el.className !="tracking-number")?rn_el[i].getElementsByTagName("a")[1].innerText:rn_el[i].getElementsByTagName("div")[0].innerText;
                    //
                    dannie_o_trekax[0]+=el_a+((i<rn_el.length-1)?",":""); // Track Number
                    dannie_o_trekax[1]+=(title_wrapper[i].firstChild.data).replace(/\s+(.*)/i,"$1")+((i< rn_el.length-1)?"|":""); // Name order
                    dannie_o_trekax[2]+= el_a+" - "+(title_wrapper[i].firstChild.data).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')+((i< rn_el.length-1)?",":""); // Track Number + Name order
                    dannie_o_trekax[3]+=(tek_pol[i].firstChild.data).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')+((i< rn_el.length-1)?"|":""); // Status order
                    title_wrapper[i].setAttribute("title", (title_wrapper[i].firstChild.data).replace(/\s+(.*)/i,"$1")+((i< rn_el.length-1)?"|":""));
                    //
                    let li_body = document.createElement("div"),
                        li_body1 = document.createElement("div");
                    li_body.setAttribute("style", "margin-bottom: 25px;background: #f9f9f9;");
                    li_body1.setAttribute("style", "position:absolute;");
                    li_body1.className = "li_body_naprotiv_kashdogo";
                    track_list.insertBefore(li_body,rn_el[i].nextSibling);
                    track_list.insertBefore(li_body1,rn_el[i].nextSibling);

                    for(let j=0;j<gp_set.services.length;j++){
                        if(gp_set.services[j][2]){
                            let li = document.createElement("div");
                            li.innerHTML='<span onclick="window.open(&quot;'+gp_set.services[j][1]+el_a+'&quot;);">'+gp_set.services[j][0]+'</span>';
                            let rcol = getColorRND();
                            li.setAttribute("style","background: linear-gradient("+rcol+");");
                            li.className="track_service";
                            li.title=sel_lang.otsl_na+gp_set.services[j][0];
                            li_body1.appendChild(li);
                        }
                    }
                }
            } else {
                alert(sel_lang.error_create_buttons);
            }
        } else {
            if(!document.querySelector("section.common-info")){
                let li_body = document.createElement("div"),
                    pastAfter = document.querySelector("ol.breadcrumb"),
                    title = document.querySelector("div.title strong").textContent
                li_body.setAttribute("style", "padding:5px;text-align: center;");


                pastAfter.parentNode.insertBefore(li_body,pastAfter.nextSibling);
                for(let j=0;j<gp_set.services.length;j++){
                    if(gp_set.services[j][2]){
                        let li = document.createElement("div"),
                            rcol = getColorRND()
                        li.innerHTML='<span onclick="window.open(&quot;'+gp_set.services[j][1]+title+'&quot;);">'+gp_set.services[j][0]+'</span>';
                        li.setAttribute("style","background: linear-gradient("+rcol+");");
                        li.className="track_service";
                        li.title=sel_lang.otsl_na+gp_set.services[j][0];
                        li_body.appendChild(li);
                    }
                }
            }
        }
    }
    // End - Проверка трека напротив каждого трека

    // ====================================== Пользовательские коды - Start  ======================================

    $.fn.CanvasDraw = function(param){
        var canv = this,
            bgcolor = param.bgcolor,
            text_color = param.text_color,
            bord_color = param.bord_color,

            servname = param.servname,
            size = param.size,

            w = canv[0].width = size+6,
            h = canv[0].height = size+6,
            ctx;

        if(ctx = canv[0].getContext('2d')){
            ctx.fillStyle = bgcolor;
            ctx.fillRect(0,0,w,h);

            let textW_Pos = w/2,
                textH_Pos = h/2

            ctx.font="10px Georgia";
            ctx.textAlign="center";
            ctx.fillStyle = text_color;
            ctx.fillText(servname,textW_Pos,textH_Pos);
            // Stroke
            ctx.strokeStyle = bord_color;
            ctx.lineWidth = 6;
            ctx.strokeRect(0,0,w,h);
            return canv;

        } else {
            throw new Error("Canvas not supported!");
        }
    };

    function addMyTrack(param, w){
        var name_tov = param.name_tov,
            link = param.link,
            track_code = param.track_code,

            bgcol = param.bgcol || "yellow",
            texcol = param.texcol || "red",
            borcol = param.borcol || "#97b6d1",

            name_serv = param.name_serv,
            nubTrack = param.id,
            date_time = new Date(param.date),
            vidimost = param.visible;

        if(vidimost){

            var month = sel_lang.month,

                canv = $('<canvas style="border-radius: 5px;"></canvas>').CanvasDraw({size:38, servname:name_serv, bgcolor:bgcol, text_color:texcol, bord_color: borcol}),

                div = $('<div class="track-container track-'+nubTrack+'" data-utid="'+nubTrack+'"><div class="track "><div class="icon" id="canv"></div>'+
                        '<div class="title"><div class="title-wrapper" title="'+name_tov+'">'+name_tov+'<br><a class="tracking-number" href="'+link+track_code+'">'+track_code+'</a></div></div>'+
                        '<div class="time">'+date_time.getDate()+' '+month[date_time.getMonth()].toLowerCase()+'<span class="muted">'+date_time.getHours()+":"+(date_time.getMinutes()<10?'0'+date_time.getMinutes():date_time.getMinutes())+'</span></div>'+
                        '<div class="checkpoint"><div class="checkpoint-body "><div class="checkpoint-status">Информации о посылке пока нет</div></div></div>'+
                        '<div class="info">'+
                        '<div class="next-check">***</div>'+
                        '<div class="last-check">***</div>'+
                        '<div class="next-check">***</div>'+
                        '</div>'+
                        '<div class="actions">'+
                        /*'<span class="actions-split"></span>'+
                    '<a href="javascript:void(0);" class="btn btn-default btn-xs btn-modal-ajax" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="40 дней до напоминания"><i class="fa fa-hourglass-start"></i>40</a>'+
                    '<div class="btn-group btn-group-xs actions-grouped">'+
                    '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><i class="fa fa-ellipsis-v"></i></button>'+
                    '<ul class="dropdown-menu">'+
                    '<li><a href="javascript:void(0);" class="btn-modal-ajax"><i class="fa fa-fw fa-folder-o"></i> в архив</a></li>'+
                    '<li><a href="javascript:void(0);" class="btn-modal-ajax"><i class="fa fa-fw fa-times"></i> удалить</a></li>'+
                    '</ul>'+
                    '</div>'+*/
                        '<div class="actions-split">'+
                        //'<a href="/ajax/track/33708807/archive" class="btn btn-xs btn-default btn-modal-ajax">В архив</a>'+
                        '<a href="/ajax/track/33708807/delete" class="btn btn-xs btn-default btn-modal-ajax btn-delete" title="Удалить"><i class="fa fa-times"></i></a>'+
                        '</div></div></div></div>');

            div.find(".icon").append(canv);

            div.find(".fa-times").click(function(){
                setting_del_userTrack(track_code);
            });

            if(w === "n"){
                $(".track-list").append(div);
            } else if(w === "c") {
                if($(".track-"+nubTrack).length>0) $(".track-"+nubTrack).replaceWith(div);
                else $(".track-list").append(div);
            }
        } else {
            $(".track-"+nubTrack).add($(".track-"+nubTrack).nextAll()).remove();
        }
    }

    // Функция Получения пользовательских кодов из localStorage
    function userTracksItems(divEl){
        let listItemsHTML = "";

        if(gp_set.hasOwnProperty("my_tracks") && Object.keys(gp_set.my_tracks).length > 0){
            $(".user_codesButtons_save").fadeIn('slow');

            listItemsHTML = $("<div class='UserTable'>"+
                              "<div class='UserTableCapt'>"+
                              "<div>№</div>"+
                              "<div>"+sel_lang.u_trackcode+"</div>"+
                              "<div>"+sel_lang.u_nameTovar+"</div>"+
                              "<div>"+sel_lang.u_nameServ+"</div>"+
                              "<div>"+sel_lang.serv_link+"</div>"+
                              "<div>"+sel_lang.u_iconfon+"</div>"+
                              "<div>"+sel_lang.u_iconText+"</div>"+
                              "<div>"+sel_lang.u_iconContur+"</div>"+
                              "<div>"+sel_lang.u_viewOnMain+"</div>"+
                              "<div>"+sel_lang.serv_del+"</div>"+
                              "</div></div>");

            let numInd = 1;

            for(let user_tracks in gp_set.my_tracks){
                let u_tracks = gp_set.my_tracks[user_tracks];
                let listItems = $("<div class='UserTableRow'>"+
                                  "<div><div style='font: bold 0.8em sans-serif;border: 2px solid #ffad00;border-radius: 16px;background: white;color: #bf7f0a;line-height: 1.7;width: 20px;height: 20px;font-size: 1em;'>"+numInd+"</div></div>"+
                                  "<div><input type='text' value='"+u_tracks.track_code+"' id='user_track_code' style='text-transform: uppercase;'></div>"+
                                  "<div><input type='text' value='"+u_tracks.name_tov+"' id='user_track_tovarname'></div>"+
                                  "<div><input type='text' value='"+u_tracks.name_serv+"' id='user_track_servname'></div>"+
                                  "<div><input type='text' value='"+u_tracks.link+"' id='user_track_link'></div>"+
                                  "<div><input list='all_colors' type='text' value='"+u_tracks.bgcol+"' id='user_track_bgcol'></div>"+
                                  "<div><input list='all_colors' type='text' value='"+u_tracks.texcol+"' id='user_track_texcol'></div>"+
                                  "<div><input list='all_colors' type='text' value='"+u_tracks.borcol+"' id='user_track_borcol'></div>"+
                                  "<div><input type='checkbox' "+(u_tracks.visible?"checked ":"" )+" id='user_track_visible'></div>"+
                                  "<div><input type='checkbox' id='user_track_delete'></div></div>").data({"track_code":u_tracks.track_code});
                listItemsHTML.append(listItems);
                numInd++;
            }
            $(listItemsHTML).find("input[type!='checkbox']").each(function(index, elem){
                //input_el.id = (j === 0)?"name_services_otsl":"link_services_otsl";
                elem.addEventListener("focus",function(event){focusInp(event);});
                elem.addEventListener("blur",function(event){blurInp(event);});
            });
            //listItemsHTML+='</div>';

        } else {
            $(".user_codesButtons_save").fadeOut('slow');
            listItemsHTML = $('<div style="text-align: center;font-size: 0.8em;background: white;border: 3px double red;border-radius: 5px;margin: 10px;padding: 5px;">'+sel_lang.listUserTrackEmptyAddTrack+'</div>');
        }
        $(divEl).find(".user_codesList").empty().html(listItemsHTML);

        checkUserDelElemet($(divEl).find("div.UserTable"));
    }

    // ============================================================
    function checkUserDelElemet(el){
        // CheckBox checked user tracks delete
        $(el).find("#user_track_delete[type=checkbox]").each(function(index,eleme){
            $(eleme).on("click",function(){

                if($(this).is(':checked')) $(".user_codesButtons_del").css({"display":"inline-block"}).animate({opacity:"+=1.0"});

                $(".user_codesButtons_del").text(sel_lang.serv_del+" ("+$(".UserTable").find("#user_track_delete:checked").length+")");

                if($(".UserTable").find("#user_track_delete:checked").length <= 0){
                    $(".user_codesButtons_del").text(sel_lang.serv_del);
                    $(".user_codesButtons_del").fadeOut(1000,function(){$(this).css("opacity","0");});
                }
            });
        });

        if($(".UserTable").find("#user_track_delete:checked").length <= 0){
            $(".user_codesButtons_del").text(sel_lang.serv_del);
            $(".user_codesButtons_del").fadeOut(1000,function(){$(this).css("opacity","0");});
        }
    }

    function checkColor(param){
        let def_col = param.def_col,
            new_col = param.new_col,
            palitra = param.palitra;

        if(/^\s?$/.test(new_col) || new_col === "" || palitra.indexOf(new_col.toLowerCase()) === -1 && !/^(#[0-9a-f]{6}|#[0-9a-f]{3})$/i.test(new_col)){
            new_col = def_col;
        }

        return new_col;
    }

    function validColor(param){
        let new_col = param.new_col,
            palitra = param.palitra,
            result = true;

        if(/^\s?$/.test(new_col) || new_col === "" || palitra.indexOf(new_col.toLowerCase()) === -1 && !/^(#[0-9a-f]{6}|#[0-9a-f]{3})$/i.test(new_col)){
            result = false
        }

        return result;
    }

    function userTracksAdd(){
        $(".i_smoke_div_fog").fadeIn(1000, function(){
            if(!$("#i_pop_menu_track").length){
                //Введите данные трека:\nПример:\nИмя службы, Ссылка службы, Название товара, трэк-код, цвет фона иконки (необяз. парам.), цвет текста иконки (необяз. парам.)
                var $pop_meuni = $("<div id='i_pop_menu_track' style='display: none;'>\
\<div style='width: 100%;background: linear-gradient(silver,#808686);text-align: center;border-radius: 8px 8px 0 0;color: white;padding: 3px;border-bottom: 2px dotted white;'><div style='float:right;float: right;cursor: pointer; margin-right: 5px; font-size: 10pt;' id='i_pop_menu_close_b'>X</div>"+sel_lang.addtrackcode+"</div>\
\<div style='padding: 5px;    color: #5f5d5d;    font: normal 12px/14px monospace;text-align:right;'>\
\<p>"+sel_lang.u_nameServ+": <input id='i_pop_menu_track_input_name' type='text' value placeholder='"+sel_lang.u_nameServ+"' /><span title='"+sel_lang.text_Error+"'></span></p>\
\<p>"+sel_lang.u_linkServ+": <input id='i_pop_menu_track_input_link' type='text' value='http://' placeholder='"+sel_lang.u_enterLink+"' /><span title='"+sel_lang.text_Error+"'></span></p>\
\<p>"+sel_lang.u_nameTovar+": <input id='i_pop_menu_track_input_namegood' type='text' value='' placeholder='"+sel_lang.u_nameTovar+"' /><span title='"+sel_lang.text_Error+"'></span></p>\
\<p>"+sel_lang.u_trackcode+": <input id='i_pop_menu_track_input_trackcode' style='text-transform: uppercase;' type='text' value='' placeholder='"+sel_lang.u_trackcode+"' /><span title='"+sel_lang.text_Error+"'></span></p>\
\<div style='display: table;'>\
\<div style='display: table-cell;width: 50%;text-align: left;padding: 5px 20px;border-right: 1px dotted silver;vertical-align: middle;'>\
\<p>"+sel_lang.u_iconfon+": <input list='all_colors' id='i_pop_menu_track_input_bgcanv' type='text' value='' placeholder='"+sel_lang.u_iconfon+"' /></p>\
\<p>"+sel_lang.u_iconText+": <input list='all_colors' id='i_pop_menu_track_input_colcanv' type='text' value='' placeholder='"+sel_lang.u_iconText+"' /></p>\
\<p>"+sel_lang.u_iconContur+": <input list='all_colors' id='i_pop_menu_track_input_borcanv' type='text' value='' placeholder='"+sel_lang.u_iconContur+"' /></p>\
\</div>\
\<div style='display: table-cell;width: 50%;text-align: center;padding: 5px;vertical-align: middle;'>\
\<div style='font-weight: bold;margin-bottom: 5px;'>"+sel_lang.u_icon+":</div>\
\<canvas style='box-shadow: 4px 4px 8px #616060;zoom: 1.5;border-radius: 5px;'>Canvas not support!</canvas></div>\
\</div>\
\<p style='text-align: center;margin-bottom: 15px;'>"+sel_lang.u_viewOnMain+": <input id='i_pop_menu_track_input_visible' type='checkbox' checked='true' /></p>\
\<div disabled id='i_pop_menu_track_button_add' style='width: 150px;margin: 5px auto;height: 30px;line-height: 30px;background: linear-gradient(#75f575,#16bf02);color: white;border-radius: 8px;box-shadow: 2px 2px 5px silver;cursor:pointer; text-align:center;'>"+sel_lang.button_add+"</div>\
\</div></div>");

                let canv = $pop_meuni.find("canvas").CanvasDraw({size:38,servname: sel_lang.canvTest,bgcolor:"yellow",text_color:"red",bord_color: "#97b6d1"}),

                    datalist = $('<datalist id="all_colors"></datalist>');
                $.each(all_color, function( index, value ) {
                    let op = $('<option>').val(value);
                    datalist.append(op);
                });
                $pop_meuni.append(datalist);

                $("body").append($pop_meuni,);

                $("#i_pop_menu_track_input_name").add($("#i_pop_menu_track_input_bgcanv")).add($("#i_pop_menu_track_input_colcanv")).add($("#i_pop_menu_track_input_borcanv")).on("input", function(){
                    let bgcol = $("#i_pop_menu_track_input_bgcanv").val(),
                        t_color = $("#i_pop_menu_track_input_colcanv").val(),
                        bor_color =$("#i_pop_menu_track_input_borcanv").val(),
                        serv_text = $("#i_pop_menu_track_input_name").val();

                    bgcol = checkColor({def_col:"yellow", new_col:bgcol, palitra:all_color});
                    t_color = checkColor({def_col:"red", new_col:t_color, palitra:all_color});
                    bor_color = checkColor({def_col:"#97b6d1", new_col:bor_color, palitra:all_color});

                    if(/^\s?$/.test(serv_text) || serv_text === undefined) serv_text = sel_lang.canvTest;

                    $(canv).CanvasDraw({size:38,servname:serv_text.slice(0,6),bgcolor:bgcol,text_color:t_color,bord_color: bor_color})
                });

                // Close button
                $("#i_pop_menu_track").find("#i_pop_menu_close_b").click(function(){
                    $pop_meuni.fadeOut(1000,function(){
                        $(".i_smoke_div_fog").fadeOut(1000,function(){
                            $("#i_pop_menu_track_input_link, #i_pop_menu_track_input_name, #i_pop_menu_track_input_namegood, #i_pop_menu_track_input_trackcode").parent().find("span").removeClass("error_icon_input");
                            $("#i_pop_menu_track_input_link, #i_pop_menu_track_input_name, #i_pop_menu_track_input_namegood, #i_pop_menu_track_input_trackcode").css("border-color","");

                            $("#i_pop_menu_track_input_name, #i_pop_menu_track_input_namegood, #i_pop_menu_track_input_trackcode").val("");
                            $("#i_pop_menu_track_input_link").val("http://");

                            $("#i_pop_menu_track_input_bgcanv").val("yellow");
                            $("#i_pop_menu_track_input_colcanv").val("red");
                            $(canv).CanvasDraw({size:58,servname:sel_lang.canvTest,bgcolor:"yellow",text_color:"red",bord_color: "#97b6d1"});
                        });
                    });
                });
                // Close button end

                // Add user track button
                $("#i_pop_menu_track_button_add").hover(function(e){
                    $(this).css("background",e.type === "mouseenter" ? "linear-gradient(rgb(26, 107, 26), rgb(48, 253, 21))":"linear-gradient(#75f575,#16bf02)");
                });

                $("#i_pop_menu_track_button_add").click(function(){

                    var newServicesObjInput = [],
                        i_pop_menu_input_link = $("#i_pop_menu_track_input_link").val(),
                        i_pop_menu_input_name = $("#i_pop_menu_track_input_name").val(),

                        i_pop_menu_track_input_namegood = $("#i_pop_menu_track_input_namegood").val(),
                        i_pop_menu_track_input_trackcode = $("#i_pop_menu_track_input_trackcode").val(),

                        i_pop_menu_track_input_bgcanv = $("#i_pop_menu_track_input_bgcanv").val(),
                        i_pop_menu_track_input_colcanv = $("#i_pop_menu_track_input_colcanv").val(),
                        i_pop_menu_track_input_borcanv = $("#i_pop_menu_track_input_borcanv").val(),

                        i_pop_menu_track_input_visible = $("#i_pop_menu_track_input_visible").prop('checked'),

                        old_id = null;

                    // UperCase
                    i_pop_menu_track_input_trackcode = i_pop_menu_track_input_trackcode.toUpperCase();

                    //Check color
                    i_pop_menu_track_input_bgcanv = checkColor({def_col:"yellow", new_col:i_pop_menu_track_input_bgcanv, palitra:all_color});
                    i_pop_menu_track_input_colcanv = checkColor({def_col:"red", new_col:i_pop_menu_track_input_colcanv, palitra:all_color});
                    i_pop_menu_track_input_borcanv = checkColor({def_col:"#97b6d1", new_col:i_pop_menu_track_input_borcanv, palitra:all_color});

                    // Text empty!
                    if(i_pop_menu_input_name.length < 1 || /^\s*$/.test(i_pop_menu_input_name)){
                        alert(sel_lang.textfield_empty_name);
                        $("#i_pop_menu_track_input_name").parent().find("span").addClass("error_span_input error_icon_input").fadeIn(1000);
                        $("#i_pop_menu_track_input_name").css("border-color","red");
                        return;
                    }

                    if(i_pop_menu_input_link.length < 1 || /^\s*$/.test(i_pop_menu_input_link)){
                        alert(sel_lang.textfield_empty_link);
                        $("#i_pop_menu_track_input_link").parent().find("span").addClass("error_span_input error_icon_input").fadeIn(1000);
                        $("#i_pop_menu_track_input_link").css("border-color","red");
                        return;
                    }

                    // Link text invalid!
                    if(!/^https?\:\/\/.+/i.test(i_pop_menu_input_link)){
                        alert(sel_lang.textfield_invalid_link);
                        $("#i_pop_menu_track_input_link").parent().find("span").addClass("error_span_input error_icon_input").fadeIn(1000);
                        $("#i_pop_menu_track_input_link").css("border-color","red");
                        return;
                    }
                    // Tovar name
                    if(i_pop_menu_track_input_namegood.length < 1 || /^\s*$/.test(i_pop_menu_track_input_namegood)){
                        alert(sel_lang.nameTovarEmptyNoName);
                        i_pop_menu_track_input_namegood = sel_lang.nonameTovar;
                        $("#i_pop_menu_track_input_namegood").val(i_pop_menu_track_input_namegood);
                    }

                    // Трэк-код
                    if(i_pop_menu_track_input_trackcode.length < 1 || /^\s*$/.test(i_pop_menu_track_input_trackcode) || /\W|_/g.test(i_pop_menu_track_input_trackcode)){
                        let matchSpecSymb = i_pop_menu_track_input_trackcode.match(/\W|_/g)
                        matchSpecSymb = matchSpecSymb?matchSpecSymb.join(" "):"";
                        alert(sel_lang.u_error_trackcode+" "+matchSpecSymb+".");
                        $("#i_pop_menu_track_input_trackcode").parent().find("span").addClass("error_span_input error_icon_input").fadeIn(1000);
                        $("#i_pop_menu_track_input_trackcode").css("border-color","red");
                        return;
                    }

                    $("#i_pop_menu_track_input_link, #i_pop_menu_track_input_name, #i_pop_menu_track_input_namegood, #i_pop_menu_track_input_trackcode").parent().find("span").fadeOut(1000,function(){$(this).removeClass("error_icon_input");});
                    $("#i_pop_menu_track_input_link, #i_pop_menu_track_input_name, #i_pop_menu_track_input_namegood, #i_pop_menu_track_input_trackcode").css("border-color","");

                    if(!gp_set.hasOwnProperty("my_tracks")){
                        gp_set.my_tracks = {};
                    }

                    if(gp_set.my_tracks.hasOwnProperty(i_pop_menu_track_input_trackcode)){
                        if(confirm(sel_lang.usertrackalreadyAddRewrite)){
                            old_id = gp_set.my_tracks[i_pop_menu_track_input_trackcode].id;
                        }
                        else return;
                    }

                    newServicesObjInput = {
                        name_serv: i_pop_menu_input_name,
                        link: i_pop_menu_input_link,
                        name_tov: i_pop_menu_track_input_namegood,
                        track_code: i_pop_menu_track_input_trackcode,
                        bgcol: i_pop_menu_track_input_bgcanv,
                        texcol: i_pop_menu_track_input_colcanv,
                        borcol: i_pop_menu_track_input_borcanv,
                        date: new Date().getFullYear()+"-"+(new Date().getMonth()<10?"0"+(new Date().getMonth()+1):new Date().getMonth()+1)+"-"+new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes(),
                        visible: i_pop_menu_track_input_visible,
                        id: (old_id)?old_id:"user-"+Math.floor(Math.random()*100000)
                    };

                    if(debug) console.log("Объект параметров польз. кода", newServicesObjInput);

                    gp_set.my_tracks[i_pop_menu_track_input_trackcode] = newServicesObjInput;

                    saveStorage();

                    if(newServicesObjInput.visible){
                        if(old_id) UpdateUserTrackMainWin(newServicesObjInput, 'c');
                        else UpdateUserTrackMainWin(newServicesObjInput, 'n');
                    }

                    $("#i_pop_menu_track").fadeOut(500,function(){
                        $(".i_smoke_div_fog").fadeOut(1000,function(){

                            $("#i_pop_menu_track_input_link, #i_pop_menu_track_input_name, #i_pop_menu_track_input_namegood, #i_pop_menu_track_input_trackcode").parent().find("span").removeClass("error_icon_input");
                            $("#i_pop_menu_track_input_link, #i_pop_menu_track_input_name, #i_pop_menu_track_input_namegood, #i_pop_menu_track_input_trackcode").css("border-color","");

                            $("#i_pop_menu_track_input_name, #i_pop_menu_track_input_namegood, #i_pop_menu_track_input_trackcode").val("");
                            $("#i_pop_menu_track_input_link").val("http://");

                            $("#i_pop_menu_track_input_bgcanv").val("yellow");
                            $("#i_pop_menu_track_input_colcanv").val("red");
                            $("#i_pop_menu_track_input_borcanv").val("#97b6d1");
                            $(canv).CanvasDraw({size:38,servname:"ТЕСТ",bgcolor:"yellow",text_color:"red",bord_color: "#97b6d1"});

                            userTracksItems($(".user_codesBox"));
                        });
                    });

                });
                // Add user track button end

                $("#i_pop_menu_track").children(":nth-child(2)").find("input").each(function(index, eleme){
                    $(eleme).on("input", function(){
                        var minlengt = /^\s*$/.test($(this).val());
                        var empty_input = $(this).val().length < 1;
                        var link_check = ($(this).attr("id")==="i_pop_menu_track_input_link" && !/https?\:\/\/.*/i.test($(this).val()));

                        if(minlengt || empty_input || link_check){
                            $(this).parent().find("span").addClass("error_span_input error_icon_input").fadeIn(1000);
                            $(this).css("border-color","red");
                        } else {
                            $(this).parent().find("span").fadeOut(1000,function(){$(this).removeClass("error_icon_input");});
                            $(this).css("border-color","");
                        }
                    });
                });

                $pop_meuni.fadeIn(1000);
            } else {
                $("#i_pop_menu_track").fadeIn(1000);
            }
        });
    }
    // ============================================================

    // Функция Сохранить изменения польз. кодов
    function poleDetect(inp, objs, tip){
        let objName = "",
            el = $(inp);

        switch(el.attr("id")){
            case "user_track_servname":
                objs.name_serv = el.val().toUpperCase();
                objName = "name_serv";
                break;
            case "user_track_link":
                objs.link = el.val();
                objName = "link";
                break;
            case "user_track_tovarname":
                objs.name_tov = el.val();
                objName = "name_tov";
                break;
            case "user_track_code":
                objs.track_code = el.val().toUpperCase();
                objName = "track_code";
                break;
            case "user_track_bgcol":
                objs.bgcol = el.val();
                objName = "bgcol";
                break;
            case "user_track_texcol":
                objs.texcol = el.val();
                objName = "texcol";
                break;
            case "user_track_borcol":
                objs.borcol = el.val();
                objName = "borcol";
                break;
            case "user_track_visible":
                objs.visible = el.is(':checked');
                objName = "visible";
                break;
        }
        if(tip === "propName") return objName;
    }

    function userTracksSave(){
        try{
            if(debug) console.log("Сохраняем польз. трэк-код...");
            var temp_zapis = {},
                save_value = true;

            $(".UserTableRow").each(function(indx, elS){
                var stroke_error = indx+1,
                    track_code = $(elS).data().track_code;

                temp_zapis[track_code] = {};

                $(elS).find("input[id!='user_track_delete']").each(function(index, eleme){

                    let namePoleError = $(".UserTableCapt > div").eq(index+1).text();

                    // Если это поле трэк-кода
                    if($(this).attr("id") === "user_track_code"){

                        if(!/^\s*$/.test($(this).val()) && /\W|_$/g.test($(this).val())){
                            let matchSpecSymb = $(this).val().match(/\W|_/g).join(" ");
                            //alert(`Ошибка:\nПоле трэк-кода, содержит неверные символы ${matchSpecSymb}, в столбце "${namePoleError}", строка №${stroke_error}`);
                            alert(sel_lang.u_error_trackcodeFull[0]+matchSpecSymb+sel_lang.u_error_trackcodeFull[1]+namePoleError+sel_lang.u_error_trackcodeFull[2]+stroke_error);
                            save_value = false;

                            return false;
                        }

                        if(!gp_set.my_tracks.hasOwnProperty($(this).val()) &&
                           !/^\s*$/.test($(this).val())
                           && confirm(sel_lang.u_error_trackcodeChangeFull[0]+namePoleError+sel_lang.u_error_trackcodeChangeFull[1]+stroke_error+sel_lang.u_error_trackcodeChangeFull[2])){// Трэк-код был изменен!
                            //confirm(`Внимание:\nПоле трэк-кода, было изменено на новое значение, в столбце "${namePoleError}", строка №${stroke_error}, вы действительно хотите изменить значание?`)
                            let newTrackcode = $(this).val().toUpperCase();

                            if(gp_set.my_tracks.hasOwnProperty(track_code)){
                                gp_set.my_tracks[track_code].track_code = newTrackcode;
                                temp_zapis[newTrackcode] = gp_set.my_tracks[newTrackcode] = gp_set.my_tracks[track_code];

                                delete temp_zapis[track_code]
                                delete gp_set.my_tracks[track_code]
                            }
                            track_code = newTrackcode;

                            $(elS).data().track_code = newTrackcode;
                            $(this).val(track_code);

                        }
                    }

                    // Если поле пустое
                    if($(this).val().length < 1 || /^\s*$/.test($(this).val())){
                        alert(sel_lang.u_error_fieldEmptyFull[0]+namePoleError+sel_lang.u_error_fieldEmptyFull[1]+stroke_error);
                        //alert(`Ошибка:\nПустое поле в столбце "${namePoleError}", строка №${stroke_error}`);
                        if(gp_set.my_tracks.hasOwnProperty(track_code)){
                            let restoreNameProp = poleDetect(this, gp_set.my_tracks, 'propName');

                            $(this).val(gp_set.my_tracks[track_code][restoreNameProp]);
                        }

                        save_value = false;

                        return false;
                    }
                    // Если это поле ссылки, проверяем ее...
                    if($(this).attr("id") === "user_track_link" && !/^https?\:\/\/.+/i.test($(this).val())){
                        alert(sel_lang.u_error_FullError[0]+namePoleError+sel_lang.u_error_FullError[1]+stroke_error);
                        //alert(`Ошибка:\n${namePoleError} указана неверно, в строке №"${stroke_error}`);

                        if(confirm(sel_lang.return_prev_val))$(this).val(gp_set.my_tracks[track_code].link);

                        save_value = false;

                        return false;
                    }

                    // Проверяем поля фон,текст и бордер (цвета)
                    let m_inp_col = ["user_track_bgcol", "user_track_texcol", "user_track_borcol"];
                    if(m_inp_col.indexOf($(this).attr("id")) !== -1){
                        if(!validColor({new_col:$(this).val(), palitra:all_color})){
                            alert(sel_lang.u_error_colorFull[0]+namePoleError+sel_lang.u_error_colorFull[1]+stroke_error);
                            //alert(`Ошибка:\nЦвет указан неверно, в столбце "${namePoleError}", строка №${stroke_error}`);
                            if(gp_set.my_tracks.hasOwnProperty(track_code)){
                                let restoreNameProp = poleDetect(this, gp_set.my_tracks, 'propName');
                                $(this).val(checkColor({def_col:gp_set.my_tracks[track_code][restoreNameProp], new_col:$(this).val(), palitra:all_color}));
                                save_value = false;
                                return false;
                            }
                        }
                    }

                    // Если ошибок нет, сохраняем значения в свойства объекта
                    if(save_value){
                        poleDetect(this, temp_zapis[track_code], 'propSave');
                    }

                });

                if(save_value){
                    temp_zapis[track_code].date = new Date().getFullYear()+"-"+(new Date().getMonth()<10?"0"+(new Date().getMonth()+1):new Date().getMonth()+1)+"-"+new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes(); // change date
                    temp_zapis[track_code].id = gp_set.my_tracks[track_code].id;
                } else{
                    temp_zapis = {};
                    return false;
                }
            });

            if(debug) console.log("Объект измененных параметров и кол-во элементов:",temp_zapis,Object.keys(temp_zapis).length);

            if(save_value && Object.keys(temp_zapis).length>0 && confirm(sel_lang.q_save)){
                gp_set.my_tracks = temp_zapis;
                saveStorage();
                alert(sel_lang.danie_edit);
                upperPanel("clear");
                for(var i in gp_set.my_tracks) UpdateUserTrackMainWin(gp_set.my_tracks[i], 'c');
                updateDataNaprotivKashdogo();
            }
        } catch(e){
            console.log(e);
        }
    }

    function UpdateUserTrackMainWin(tracks, w){
        if(w === 'd'){ // remove
            $(".track-"+tracks.id).add($(".track-"+tracks.id).nextAll()).remove();
        } else if(w === 'c') { // change
            addMyTrack(tracks, "c");
        } else if(w === 'n' || w === undefined || w === null){ // new
            addMyTrack(tracks, "n");
        }
        updateDataNaprotivKashdogo();
    }

    // Функция удаления польз. кодов
    function setting_del_userTrack(){
        if(confirm(sel_lang.deleteselectedTrackcodes)){
            var arr_del = [];
            $(".user_codesList").find("#user_track_delete:checked").each(function(index,eleme){
                let elUp = eleme.parentElement.parentElement,
                    trDel = $(elUp).data().track_code;

                if(trDel.length>0) arr_del.push(gp_set.my_tracks[trDel]);
            });
            if(debug) console.log("Удаляем трэк-коды:",arr_del.join(", "));

            for(var k=0; k < arr_del.length; k++){
                if(gp_set.my_tracks.hasOwnProperty(arr_del[k].track_code)){
                    UpdateUserTrackMainWin(arr_del[k], 'd');
                    delete gp_set.my_tracks[arr_del[k].track_code];
                }
            }
            saveStorage();

            alert(sel_lang.userTrackcodesDeleted);

            updateDataNaprotivKashdogo();
            userTracksItems($(".user_codesBox"));
        }
    }

    // Функция загрузки польз. кодов при старте
    function onStartViewUserTracks(){
        if(gp_set.hasOwnProperty("my_tracks") && Object.keys(gp_set.my_tracks).length > 0){
            for(let user_tracks in gp_set.my_tracks){
                let u_tracks = gp_set.my_tracks[user_tracks];
                if(u_tracks.visible){
                    addMyTrack({
                        name_serv: u_tracks.name_serv,
                        link: u_tracks.link,
                        name_tov: u_tracks.name_tov,
                        track_code: u_tracks.track_code,
                        bgcol: u_tracks.bgcol,
                        texcol: u_tracks.texcol,
                        borcol: u_tracks.borcol,
                        date: u_tracks.date,
                        id: u_tracks.id,
                        visible: u_tracks.visible
                    }, 'n');
                }
            }
        }
    }

    function myTracks(){
        try{
            if(!gp_set.hasOwnProperty("my_tracks")){
                gp_set.my_tracks={};
                saveStorage();
            }

            let u_codesButton = $('<span class="user_buttonShow" title="'+sel_lang.addtrackcode+'">'+sel_lang.addtrackcode+'</span>');
            if(window.location.pathname.indexOf("/form")>-1) u_codesButton[0].className = "user_buttonShow modify"

            u_codesButton.click(function(){
                if($(".user_codesBox").length === 0){
                    let u_codesBox = $('<div class="user_codesBox">'+
                                       '<div class="user_codesBoxTitle"><span>'+sel_lang.userTrackcodes+'<div style="float:right; cursor:pointer;margin-right: 5px;">X</div></span></div>'+
                                       '<div class="user_codesList"></div>'+
                                       '<div class="user_codesButtons">'+
                                       '<div class="i_setting_div_button user_codesButtons_add">'+sel_lang.add_serv+'</div>'+
                                       '<div class="i_setting_div_button user_codesButtons_save">'+sel_lang.save_serv+'</div>'+
                                       '<div class="i_setting_div_button user_codesButtons_del">'+sel_lang.serv_del+'</div>'+
                                       '</div>'+
                                       '<div class="utrack_input_focus_close" title="'+sel_lang.bClose+'">X</div>'+
                                       '</div>'),

                        datalist = $('<datalist id="all_colors"></datalist>');
                    $.each(all_color, function( index, value ) {
                        let op = $('<option>').val(value);
                        datalist.append(op);
                    });
                    // Добавляем итемы в список из localStorage
                    userTracksItems(u_codesBox);
                    u_codesBox.append(datalist);

                    $(".user_codes_panel").append(u_codesBox);

                    // Обработчики событий
                    // Кнопка закрыть
                    $(".user_codesBoxTitle").find("span div").click(function(){
                        $(".user_codesBox").fadeToggle("slow", function(){
                            if(!$(".user_codesBox").is(":visible")){
                                $(".i_setting_div").css("left","50%");
                                $(u_codesBox).find(".user_codesList").empty();
                            }
                        });
                    });

                    // Кнопка Создать
                    $(".user_codesBox").find(".user_codesButtons_add").click(userTracksAdd);
                    // Кнопка Сохранить
                    let saveAll= $(".user_codesBox").find(".user_codesButtons_save").click(userTracksSave);

                    if(Object.keys(gp_set.my_tracks).length === 0){
                        saveAll.css("display","none");
                    }
                    // Кнопка Удалить
                    $(".user_codesBox").find(".user_codesButtons_del").click(setting_del_userTrack);
                } else {
                    $(".user_codesList").empty();
                    userTracksItems(".user_codesBox");
                }

                if($(".i_setting_div").is(":visible")){

                    if(parseFloat($(".i_setting_div").css("left")) > parseFloat($("body").css("width"))/2){
                        $(".i_setting_div").css("left","50%");
                    }

                    let leftOf = parseFloat($(".i_setting_div").css("left"))+parseFloat($(".i_setting_div").css("width"))+20;
                    $(".user_codesBox").css("left",leftOf);
                } else {
                    $(".user_codesBox").css("left","50%");
                }

                $(".user_codesBox").fadeToggle("slow");
            });

            if(window.location.pathname.indexOf("/form")>-1){
                $("div.container.tracking-form").find(".help-block li").append(u_codesButton)
            } else {
                $(".user_codes_panel").append(u_codesButton);
            }

            onStartViewUserTracks();

        } catch(e){
            console.log(e);
        }
    }
    // Пользовательские коды - End

    function checkLocation(href){
        return window.location.pathname.indexOf(href) != -1 ? true : false
    }

    function actives_tracks(){
        if(!gp_set.setting.hasOwnProperty('actives_tracks')){
            gp_set.setting.actives_tracks = []
        }

        let changeTracks = [false,false],
            tracksActive = $(".tracking-number").map((indx,el)=>el.getAttribute('href'))

        // Delete not isset tracks
        if(tracksActive.length){
            const saveActiveTrack = [...gp_set.setting.actives_tracks]

            for(let atrack of saveActiveTrack){
                const indexFind = tracksActive.get().indexOf(atrack)+1
                if(indexFind === -1){
                    gp_set.setting.actives_tracks.splice(indexFind, 1)
                    changeTracks[0] = true
                    if(debug) console.log('Delete: ', atrack)
                }
            }
        }

        // Add not isset tracks
        tracksActive.each((indx, currentTrack)=>{
            if(!gp_set.setting.actives_tracks.includes(currentTrack)){
                gp_set.setting.actives_tracks.push(currentTrack)
                changeTracks[1] = true
            }
        })
        if(changeTracks[0] || changeTracks[1]){
            if(debug) console.log('Save...')
            saveStorage();
        }
        if(debug) console.log('>>>',gp_set)
    }

    function init(){
        try{
            // -------------------------------- Init -----------------------------
            var i_setting_div = document.createElement("div");
            var i_setting_div_caption = document.createElement("div");
            var i_setting_div_body = document.createElement("div");
            var i_setting_div_foot = document.createElement("div");

            var i_setting_div_resetservices = document.createElement("div");
            i_setting_div_resetservices.innerText = sel_lang.reser_serv;
            $(i_setting_div_resetservices).css({"float": "left", "font-size": "0.8em", "margin-top": "20px", "cursor": "pointer"});
            $(i_setting_div_resetservices).click(function(){
                if(confirm(sel_lang.q_reset_serv)) {
                    resetDefaultServices();
                }
            });

            var i_setting_div_add_button = document.createElement("div");
            i_setting_div_add_button.innerText = sel_lang.add_serv;
            var i_setting_div_save_button = document.createElement("div");
            i_setting_div_save_button.innerText = sel_lang.save_serv;

            var i_setting_div_del_button = document.createElement("div");
            i_setting_div_del_button.innerText = sel_lang.serv_del;

            i_setting_div.className = "i_setting_div";
            i_setting_div_caption.className = "i_setting_div_caption";
            i_setting_div_caption.innerHTML = "<span>"+sel_lang.setting+"</span>";
            $(i_setting_div_caption).find("span").append("<div style='float:right; cursor:pointer;margin-right: 5px;'>X</div>").click(function(){
                $(".i_setting_div").fadeOut(1000, function(){
                    if(!$(".i_setting_div").is(":visible")) $(".user_codesBox").css("left","50%");
                });
            });
            i_setting_div_body.className = "i_setting_div_body";
            i_setting_div_foot.className = "i_setting_div_foot";
            i_setting_div_add_button.className = "i_setting_div_button i_setting_div_save_button";
            i_setting_div_save_button.className = "i_setting_div_button i_setting_div_add_button";
            i_setting_div_del_button.className = "i_setting_div_button i_setting_div_del_button";

            var i_setting = document.createElement("i");
            i_setting.className = "i_setting i_setting-set";

            var i_smoke_div_fog = document.createElement("div");
            i_smoke_div_fog.className = "i_smoke_div_fog";
            document.body.appendChild(i_smoke_div_fog);


            var divli = document.createElement("ul");
            divli.setAttribute('style', `text-align: center; width: 80%; margin: 10px auto;`)
            divli.className = "my-navbar-center";
            var liel= document.getElementsByClassName("navbar")[0] || null;
            if(liel){
                document.querySelector("header").insertBefore(divli, liel.nextElementSibling);
            }

            i_setting.addEventListener("click", setting_window);
            i_setting_div_add_button.addEventListener("click", setting_add_value);
            i_setting_div_save_button.addEventListener("click", setting_save_value);
            i_setting_div_del_button.addEventListener("click", setting_del_value);

            var checkbox_div = document.createElement("div");
            var checkbox_div_0 = document.createElement("div");
            var checkbox_div_1 = document.createElement("div");
            var checkbox_div_2 = document.createElement("div");
            var checkbox_div_3 = document.createElement("div");
            var checkbox_div_4 = document.createElement("div");

            checkbox_div_0.className = "tolko_ne_poluch"
            checkbox_div_1.className = "setting_box"
            checkbox_div_2.className = "user_codes_panel"
            checkbox_div_3.className = "update_all_codes"
            checkbox_div_4.className = "update_all_infos"

            var checkbox_input = document.createElement("input");
            var checkbox_label = document.createElement("label");
            var checkbox_span = document.createElement("span");
            var checkbox_button = document.createElement("div");

            checkbox_span.innerText = sel_lang.tolko_ne_poluch
            checkbox_button.innerHTML = `<span>${sel_lang.update_all_codes}</span><div class='progress_box'></div>`
            checkbox_button.id = "checkbox_button"

            checkbox_div.className="checkbox_div";

            checkbox_input.type="checkbox";
            checkbox_input.className="checkbox";
            checkbox_input.id="checkbox";

            if(!gp_set.hasOwnProperty('setting')){
                gp_set.setting={};
                gp_set.setting.tolko_ne_poluch = false
                gp_set.setting.actives_tracks = []
            }
            checkbox_input.checked = gp_set.setting.tolko_ne_poluch;

            checkbox_label.setAttribute("for","checkbox");
            checkbox_label.addEventListener("click", only_ne_poluch_button);

            i_setting_div.appendChild(i_setting_div_caption);
            i_setting_div.appendChild(i_setting_div_body);
            i_setting_div_foot.appendChild(i_setting_div_resetservices);
            i_setting_div_foot.appendChild(i_setting_div_add_button);
            i_setting_div_foot.appendChild(i_setting_div_save_button);
            i_setting_div_foot.appendChild(i_setting_div_del_button);
            i_setting_div.appendChild(i_setting_div_foot);

            checkbox_div_0.appendChild(checkbox_span);
            checkbox_div_0.appendChild(checkbox_input);
            checkbox_div_0.appendChild(checkbox_label);

            checkbox_div_1.appendChild(i_setting)
            checkbox_div_1.appendChild(i_setting_div)

            checkbox_div_3.appendChild(checkbox_button);

            checkbox_div.appendChild(checkbox_div_0)
            checkbox_div.appendChild(checkbox_div_1)
            checkbox_div.appendChild(checkbox_div_2)

            if(!CheckHost('courier')){
                checkbox_div.appendChild(checkbox_div_3)
                checkbox_div.appendChild(checkbox_div_4)
            }

            if(CheckHost('tracks')){
                actives_tracks()
            }

            checkbox_button.addEventListener('click', checkAll)

            //document.getElementsByClassName("container")[1].lastChild.appendChild(checkbox_div);
            //document.getElementsByClassName("container")[2].parentNode.insertBefore(checkbox_div, document.getElementsByClassName("container")[2]);
            const pastPanel = document.querySelector('.page-track-list') || document.querySelector('.page-track')
            pastPanel.insertBefore(checkbox_div, document.querySelector('.hidden-print'))
            //--------------------
            myTracks(); // Пользовательские коды
            NaprotuvKashdogo(); // Naprotiv kashdogo treka slushba ontsleshivaniya
            if (!checkLocation("/courier") && !checkLocation("/form")) make_abs(); // Make absolute window left
            upperPanel(); // Verxnya panel so slushbami otsleshivaniya

        } catch (e){console.log(e);}
    }

    function requestCheckAll(url){
        return new Promise((resolve,reject)=>{
            let xhr = new XMLHttpRequest;
            xhr.open("GET", url.url)
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
            xhr.onload = function() {

                if (xhr.status !== 200) return reject({result: "Request failed. Returned status of " + xhr.status, data:url})

                if (xhr.getResponseHeader("Content-Type") === "application/json") {
                    const _JSONparse = JSON.parse(xhr.responseText);

                    let result = _JSONparse !== null && _JSONparse !== undefined ? _JSONparse : xhr.responseText
                    if (!result) return reject({result:"Request failed. Invalid response.", data:url})
                    if (!result.status){
                        return resolve({result:result, data:url})
                    }
                    if (result.status === "error") {
                        const _resultMessage = result.message && result.message !== undefined && result.message !== null ? result.message : "Unknown error"
                        return reject({result: _resultMessage, data:url})

                    }
                    return result.status === "ok" ? resolve({result:result, data:url}) : reject({result: "Unknown result status: " + result.status, data:url})
                }
                resolve({result: xhr.responseText, data: url})
            }
            xhr.send(null)
        })
    }

    function checkAll(){
        const btn_check_all_progress = document.querySelector('.progress_box')

        if(btn_check_all_progress.classList.contains('progress_line')){
            alert(sel_lang.update_all_tracks.worknow)
            return
        }

        if(confirm(sel_lang.update_all_tracks.confirm)) {
            new Promise((res,rej)=>{
                let tn = $(".tracking-number"),
                    len_tn = tn.length,
                    links=[]

                btn_check_all_progress.classList.add('progress_line')
                const uat = $('.update_all_infos').empty()

                $.each(tn, function(ind, el){
                    $.ajax($(this).attr("href"))
                        .done(function(a){
                        let html = $(a),
                            but = html.find(".buttons > a.btn:eq(0)").get(0)

                        links.push({
                            url:but.dataset.url,
                            track: el.textContent
                        })

                        if(len_tn == links.length) res(links)
                    })
                        .fail(function(e){
                        rej(new Error(e))
                    });
                })
            }).then((links)=>{
                const promises = links.map(l => requestCheckAll(l))

                Promise.allSettled(promises).then((otvet) =>{
                    btn_check_all_progress.classList.remove('progress_line')

                    const stringJoin = otvet.map((result, index) => result.value?.result?.hasOwnProperty('html') ?sel_lang.update_all_tracks.already+result.value.data.track :sel_lang.update_all_tracks.ok+result.value.data.track),
                          uat = $('.update_all_infos').empty()

                    $.each(stringJoin, function(ind, el){
                        let idx = (ind+1)*2,
                            wait = idx*3000,
                            div = $('<div>')
                        .css({'display': 'none'})
                        .addClass('update_all_infos_item')
                        .text(el)
                        .appendTo(uat)
                        .fadeIn(wait, function(){
                            setTimeout(function(){
                                div.fadeOut(wait, ()=>div.remove())
                            }, idx*2000)
                        })
                        })
                });
            }, (err)=>{
                btn_check_all_progress.classList.remove('progress_line')
                if(err instanceof Error) alert(err.message)
            })
        }
    }


    init();

})();
