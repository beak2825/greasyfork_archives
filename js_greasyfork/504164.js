// ==UserScript==
// @name         Sausage Mod
// @version      1.3.9
// @description  Небольшие изменения в кодике пиксельных котиков.
// @author       fryecest
// @match        http*://*.catwar.su/*
// @license      MIT
// @copyright    2021-2022, Ал'ираэр Кавинэан ( catwar.su/cat115907 )
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @namespace https://greasyfork.org/users/1354145
// @downloadURL https://update.greasyfork.org/scripts/504164/Sausage%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/504164/Sausage%20Mod.meta.js
// ==/UserScript==
// с днем говнокода
// хочу сыр косичку

$(function () {

    const version = "1.3.9"

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    const isFull = !$('meta[name=viewport]').length;

    let pageLocation = window.location.href; // открытая страница

    const settingsPage = (/^https?:\/\/\w?\.?catwar.su\/settings/.test(pageLocation)); // проверка на нахождение на странице настроек
    const cw3Page = (/^https?:\/\/\w?\.?catwar.su\/cw3/.test(pageLocation)); // проверка на нахождение на странице игровой
    const chatPage = (/^https?:\/\/\w?\.?catwar.su\/chat/.test(pageLocation)); // проверка на нахождение на странице чата
    const blogsPage = (/^https?:\/\/\w?\.?catwar.su\/blog/.test(pageLocation)); // проверка на нахождение на странице блогов
    const sniffPage = (/^https?:\/\/\w?\.?catwar.su\/sniff/.test(pageLocation)); // проверка на нахождение на странице ленты
    const aboutPage = (/^https?:\/\/\w?\.?catwar.su\/about/.test(pageLocation)); // проверка на нахождение на странице об игре
    const mainPage = (/^https?:\/\/\w?\.?catwar.su\/$/.test(pageLocation)); // проверка на нахождение на странице своего профиля
    const profilePage = (/^https?:\/\/\w?\.?catwar.su\/cat/.test(pageLocation)); // проверка на нахождение на странице чужого профиля
    const lsPage = (/^https?:\/\/\w?\.?catwar.su\/ls/.test(pageLocation)); // проверка на нахождение на странице ЛС
    let blogscreate = (/^https?:\/\/\w?\.?catwar.su\/blogs[?]creation/.test(pageLocation));
    let sniffcreate = (/^https?:\/\/\w?\.?catwar.su\/sniff[?]creation/.test(pageLocation));
    let lscreate = (/^https?:\/\/\w?\.?catwar.su\/ls[?]new/.test(pageLocation));
    const isUnauth = $("#menu_div").children().length == 4;

    let getbackopacity = (css) => { let elem = css.split(", "); if (elem.length == 4) return elem[3].slice(0, -1) }

    let getbranches = (css) => { let elem = css.split("\"), url(\""); elem[0] = elem[0].slice(5); elem[1] = elem[1].slice(0, -2); return elem; }

    let rgbToHex = (rgb) => { let elem = rgb.split(', ');
                             if (elem[0].indexOf("rgba") == -1) { elem[0] = elem[0].slice(4); elem[2] = elem[2].slice(0, -1); }
                             else { elem[0] = elem[0].slice(5); elem.pop(3); }
                             var result = elem.map(function (x) { x = parseFloat(x).toString(16); return (x.length == 1) ? "0" + x : x; });
                             return "#" + result.join(''); }

    let mightSkillUpdEvent = new Event('mouseover', { bubbles: true });

    let mightDispatch = () => { let might = document.getElementById('might_table'); might.dispatchEvent(mightSkillUpdEvent); }

    let playshowerfix = () => {
        if ($('span.small').css('position') == 'fixed' && $('.other_cats_list').css('display') != 'none') {
            return true;
        }
        return false;
    };

    const defaults = {
        'shower_fix': false,
        'cages_nums': true,
        'cages_nums_color': '#ffffff',
        'cages_nums_opacity': 'AA',
        'cages_nums_shadow': '#000000',
        'count_exersizes': 0,
        'might_log_check': true,
        'count_drop': 0,
        'might_log_before_count': 0,
        'is_wound_warning_hidden': false, // основной сайт
        'is_ad_hidden': false,
        'is_wound_alert_hidden': false, // в игровой
        'might_roofs': [1, 4, 15, 30, 150, 300, 500, 2000, 7000],
        'color_pick': false,
        'notes': true,
        'cw3_shower_fix': true,
        'cw3_fast_sett': true
    }

    if (!cw3Page) {
        defaults['back_url'] = $("body").css("background-image");
        defaults['back_img'] = $("body").css("background-image").slice(5, -2);
        defaults['text_font'] = $("body").css("font-family");
        defaults['link_color'] = rgbToHex($("#footer a").css("color"));
        defaults['link_opacity'] = 255;
        defaults['text_color'] = rgbToHex($("body").css("color"));
        defaults['text_opacity'] = 255;
        defaults['back_color'] = rgbToHex($("#site_table").css("background-color"));
        defaults['back_opacity'] = getbackopacity($("#site_table").css("background-color")) * 256;
        defaults['text_size'] = $("body").css('font-size');
        if (isFull) {
            defaults['branch_left_img'] = getbranches($("#branch").css("background-image"))[0];
            defaults['branch_right_img'] = getbranches($("#branch").css("background-image"))[1];
            if ($("#logo").html() != undefined) {
                defaults['logo_url'] = $("#logo").css("background-image");
                defaults['logo_img'] = $("#logo").css("background-image").slice(5, -2);
            }
        }
    }
    else if (cw3Page) {
        defaults['is_shower_cw3'] = playshowerfix();
    }

    console.log(defaults);

    let currentSettings = {};
    var toBool = (value) => {
        if (value == 'false') return false;
        else if (value == 'true') return true;
        else return value;
    }

    let deftocur = (x) => {
        if (window.localStorage.getItem(x) == '' || window.localStorage.getItem(x) == null) { currentSettings[x] = toBool(defaults[x]) }
        else { currentSettings[x] = toBool(window.localStorage.getItem(x)) } }

    for (let x in defaults) deftocur(x);

    var mightOnload = () => {
        if (cw3Page) {
            setTimeout(function () {
                mightDispatch();
                let might_tiptip = document.getElementById('tiptip_content').innerHTML;
                let might_max = (might_tiptip.split('/'))[1].slice(0, -1);
                might_tiptip = (might_tiptip.split('/'))[0].slice(15);
                defaults['might_log'] = ('Дробь до тренировок: ' + might_tiptip + '/' + might_max + ' единиц</br>');
                defaults['might_log_before_count'] = might_tiptip; }, 500);
            deftocur('might_log');
            deftocur('might_log_before_count');
        }
    }

    mightOnload();

    console.log(currentSettings);

    var ifHexDoubleDigit = (number) => {
        if (number >= 0 && number < 16) return '0' + number;
        else return number
    }

    // функции замены элементов
    var logoReplace = (value) => { (value == '') ? $("#logo").css("background-image", ''): $("#logo").css("background-image", "url(" + value + ")"); }

    var backImgReplace = (value) => { (value == '') ? $("body").css("background-image", ''): $("body").css("background-image", "url(" + value + ")"); }

    var branchImgReplace = (left, right) => {
        (left == '') ? $("#branch").css("background", "url(" + defaults['branch_left_img'] + ") repeat-y left top,url(" + right + ") repeat-y right top"): (right == '') ? $("#branch").css("background", "url(" + left + ") repeat-y left top,url(" + defaults['branch_right_img'] + ") repeat-y right top") : $("#branch").css("background", "url(" + left + ") repeat-y left top,url(" + right + ") repeat-y right top");
    }
    var textFontReplace = (value) => { $("body").css("font-family", value); }

    var textColorReplace = (color, opacity) => { if (opacity == '') opacity = defaults['text_opacity'];
                                                $("#site_table, #footer, .other_cats_list, #redesign").css("color", color + ifHexDoubleDigit(parseInt(opacity).toString(16))); }

    var linkColorReplace = (color, opacity) => { if (opacity == '') opacity = defaults['link_opacity'];
                                                $("#site_table a, #footer a, #redesign a").css("color", color + ifHexDoubleDigit(parseInt(opacity).toString(16)));
                                                if (profilePage) $(".parsed a").css("color", '');
                                                $("#messList a, #top_div a").css("color", ''); }

    var backColorReplace = (color, opacity) => { if (opacity == '') opacity = defaults['back_opacity'];
                                                $("#site_table, #footer, #redesign").css("background-color", color + ifHexDoubleDigit(parseInt(opacity).toString(16))); }

    var showerCatsFix = (link_color, back_color, link_opacity, back_opacity) => { if (currentSettings['shower_fix']) {
        if (link_color != defaults['link_color'] && back_color != defaults['back_color']) {
            $(".other_cats_list").css("background-color", back_color + ifHexDoubleDigit(parseInt(back_opacity).toString(16)));
            $(".other_cats_list>a").css("color", link_color + ifHexDoubleDigit(parseInt(link_opacity).toString(16))); }
        else if (link_color == defaults['link_color'] && back_color != defaults['back_color']) {
            $(".other_cats_list").css("background-color", back_color + ifHexDoubleDigit(parseInt(back_opacity).toString(16)));
            $(".other_cats_list>a").css("color", link_color); }
        else if (back_color == defaults['back_color'] && link_color != defaults['link_color']) {
            $(".other_cats_list").css("background-color", back_color);
            $(".other_cats_list>a").css("color", link_color + ifHexDoubleDigit(parseInt(link_opacity).toString(16))); }
        else {
            $(".other_cats_list").css("background-color", back_color);
            $(".other_cats_list>a").css("color", link_color); } }
                                                                                 else {
                                                                                     $(".other_cats_list").css("background-color", '');
                                                                                     $(".other_cats_list>a").css("color", ''); } }

    var textSizeReplace = (value) => {
        if (value == '') $("body").css("font-size", defaults['text_size']);
        else { $("body").css("font-size", value + "px"); $("#clearTextSize").css("font-size", defaults['text_size'])}}

    var fullRedesign = () => {
        if (!isUnauth) {
            logoReplace(currentSettings['logo_img']);
            backImgReplace(currentSettings['back_img']);
            branchImgReplace(currentSettings["branch_left_img"], currentSettings['branch_right_img']);
            textFontReplace(currentSettings['text_font']);
            textColorReplace(currentSettings['text_color'], currentSettings['text_opacity']);
            linkColorReplace(currentSettings["link_color"], currentSettings["link_opacity"]);
            backColorReplace(currentSettings["back_color"], currentSettings["back_opacity"]);
            textSizeReplace(currentSettings['text_size']);
            showerCatsFix(currentSettings['link_color'], currentSettings['back_color'], currentSettings['link_opacity'], currentSettings["back_opacity"]);
            return;
        }
        return;
    }

    var cagesNumbers = () => {
        if (currentSettings['cages_nums']) {
            let cagesStyle = $('<style id="cages_nums"></style>').html(`#cages_div { position: relative; }
#cages>tbody>tr>td:before { position: absolute; z-index:0; margin-top: 3px; margin-left: 73px;
color: ` + currentSettings['cages_nums_color'] + currentSettings['cages_nums_opacity'] + `;
text-shadow: 1 1 30px ` + currentSettings['cages_nums_shadow'] + `;
text-align: right;
font-size: 20px;
font-family: Courier New;
font-weight: bold;
letter-spacing: -4px; }
#cages>tbody>tr:nth-child(1)>td:nth-child(1):before {content: '1';}
#cages>tbody>tr:nth-child(1)>td:nth-child(2):before {content: '2';}
#cages>tbody>tr:nth-child(1)>td:nth-child(3):before {content: '3';}
#cages>tbody>tr:nth-child(1)>td:nth-child(4):before {content: '4';}
#cages>tbody>tr:nth-child(1)>td:nth-child(5):before {content: '5';}
#cages>tbody>tr:nth-child(1)>td:nth-child(6):before {content: '6';}
#cages>tbody>tr:nth-child(1)>td:nth-child(7):before {content: '7';}
#cages>tbody>tr:nth-child(1)>td:nth-child(8):before {content: '8';}
#cages>tbody>tr:nth-child(1)>td:nth-child(9):before {content: '9';}
#cages>tbody>tr:nth-child(1)>td:nth-child(10):before {content: '10';}
#cages>tbody>tr:nth-child(2)>td:nth-child(1):before {content: '1';}
#cages>tbody>tr:nth-child(2)>td:nth-child(2):before {content: '2';}
#cages>tbody>tr:nth-child(2)>td:nth-child(3):before {content: '3';}
#cages>tbody>tr:nth-child(2)>td:nth-child(4):before {content: '4';}
#cages>tbody>tr:nth-child(2)>td:nth-child(5):before {content: '5';}
#cages>tbody>tr:nth-child(2)>td:nth-child(6):before {content: '6';}
#cages>tbody>tr:nth-child(2)>td:nth-child(7):before {content: '7';}
#cages>tbody>tr:nth-child(2)>td:nth-child(8):before {content: '8';}
#cages>tbody>tr:nth-child(2)>td:nth-child(9):before {content: '9';}
#cages>tbody>tr:nth-child(2)>td:nth-child(10):before {content: '10';}
#cages>tbody>tr:nth-child(3)>td:nth-child(1):before {content: '1';}
#cages>tbody>tr:nth-child(3)>td:nth-child(2):before {content: '2';}
#cages>tbody>tr:nth-child(3)>td:nth-child(3):before {content: '3';}
#cages>tbody>tr:nth-child(3)>td:nth-child(4):before {content: '4';}
#cages>tbody>tr:nth-child(3)>td:nth-child(5):before {content: '5';}
#cages>tbody>tr:nth-child(3)>td:nth-child(6):before {content: '6';}
#cages>tbody>tr:nth-child(3)>td:nth-child(7):before {content: '7';}
#cages>tbody>tr:nth-child(3)>td:nth-child(8):before {content: '8';}
#cages>tbody>tr:nth-child(3)>td:nth-child(9):before {content: '9';}
#cages>tbody>tr:nth-child(3)>td:nth-child(10):before {content: '10';}
#cages>tbody>tr:nth-child(4)>td:nth-child(1):before {content: '1';}
#cages>tbody>tr:nth-child(4)>td:nth-child(2):before {content: '2';}
#cages>tbody>tr:nth-child(4)>td:nth-child(3):before {content: '3';}
#cages>tbody>tr:nth-child(4)>td:nth-child(4):before {content: '4';}
#cages>tbody>tr:nth-child(4)>td:nth-child(5):before {content: '5';}
#cages>tbody>tr:nth-child(4)>td:nth-child(6):before {content: '6';}
#cages>tbody>tr:nth-child(4)>td:nth-child(7):before {content: '7';}
#cages>tbody>tr:nth-child(4)>td:nth-child(8):before {content: '8';}
#cages>tbody>tr:nth-child(4)>td:nth-child(9):before {content: '9';}
#cages>tbody>tr:nth-child(4)>td:nth-child(10):before {content: '10';}
#cages>tbody>tr:nth-child(5)>td:nth-child(1):before {content: '1';}
#cages>tbody>tr:nth-child(5)>td:nth-child(2):before {content: '2';}
#cages>tbody>tr:nth-child(5)>td:nth-child(3):before {content: '3';}
#cages>tbody>tr:nth-child(5)>td:nth-child(4):before {content: '4';}
#cages>tbody>tr:nth-child(5)>td:nth-child(5):before {content: '5';}
#cages>tbody>tr:nth-child(5)>td:nth-child(6):before {content: '6';}
#cages>tbody>tr:nth-child(5)>td:nth-child(7):before {content: '7';}
#cages>tbody>tr:nth-child(5)>td:nth-child(8):before {content: '8';}
#cages>tbody>tr:nth-child(5)>td:nth-child(9):before {content: '9';}
#cages>tbody>tr:nth-child(5)>td:nth-child(10):before {content: '10';}
#cages>tbody>tr:nth-child(6)>td:nth-child(1):before {content: '1';}
#cages>tbody>tr:nth-child(6)>td:nth-child(2):before {content: '2';}
#cages>tbody>tr:nth-child(6)>td:nth-child(3):before {content: '3';}
#cages>tbody>tr:nth-child(6)>td:nth-child(4):before {content: '4';}
#cages>tbody>tr:nth-child(6)>td:nth-child(5):before {content: '5';}
#cages>tbody>tr:nth-child(6)>td:nth-child(6):before {content: '6';}
#cages>tbody>tr:nth-child(6)>td:nth-child(7):before {content: '7';}
#cages>tbody>tr:nth-child(6)>td:nth-child(8):before {content: '8';}
#cages>tbody>tr:nth-child(6)>td:nth-child(9):before {content: '9';}
#cages>tbody>tr:nth-child(6)>td:nth-child(10):before {content: '10';}`)
            $("head").append(cagesStyle);
        }
    }

    var mightSkillUpd = () => {
        if (currentSettings['might_log_check']) {
            mightDispatch();
            let might_tiptip = document.getElementById('tiptip_content').innerHTML;
            let might_max = parseInt((might_tiptip.split('/'))[1].slice(0, -1));
            might_tiptip = parseInt((might_tiptip.split('/'))[0].slice(15));
            currentSettings['count_drop'] = parseInt(currentSettings['count_drop']);
            if (might_tiptip >= currentSettings['might_log_before_count']) currentSettings['count_drop'] = (might_tiptip - currentSettings['might_log_before_count']);
            else {
                let index = defaults['might_roofs'].indexOf(might_max);
                let prev = defaults['might_roofs'][index-1] - currentSettings['might_log_before_count'];
                currentSettings['count_drop'] = (might_tiptip + parseInt(prev));
            }
            currentSettings['count_exersizes'] = parseInt(currentSettings['count_exersizes']);
            currentSettings['might_log'] += ('Тренировка №' + (currentSettings['count_exersizes'] + 1) + ': ' + might_tiptip + '/' + might_max + ' единиц</br>');
            currentSettings['count_exersizes']++;
            window.localStorage.setItem('count_exersizes', currentSettings['count_exersizes']);
            window.localStorage.setItem('might_log', currentSettings['might_log']);
            window.localStorage.setItem('count_drop', currentSettings['count_drop']);
            $("#mightlog_txt").html(currentSettings["might_log"]);
            $("#mightlog_count").html("Всего выпало с последней очистки: "+currentSettings["count_drop"]);
        }
    }

    var woundAlertHide = () => {
        if (currentSettings['is_wound_alert_hidden']) {
            if ($('p#error').html().indexOf('пониженное здоровье') != -1) { $('p#error').css('display', 'none'); }} }

    var colorpickerflag = false;
    var colorPicker = () => {
        if (currentSettings['color_pick'] && !colorpickerflag) {
            let picker = $('<span id="color_picker"></span>').html('Выбрать цвет: <input type="color" id="color_picker_input"><span id="color_code"> </span>');
            $('head').append($('<style></style>').html(`
            #color_picker {
            padding-top: 3px;
            padding-bottom: 2px;
            }
            `));
            $("#color_and_notes").append(picker);
            $('#color_picker_input').on('change', function() { $("#color_code").text($('#color_picker_input').val())} );
        }
    }

    var notesflag = false;
    var notesfunc = () => {
        if (currentSettings['notes'] && !notesflag) {
            let notes_id = 'notes_';
            sniffPage ? notes_id += 'sniff' : mainPage ? notes_id += 'main' : blogsPage ? notes_id += 'blogs' : chatPage ? notes_id += 'chat' : lsPage ? notes_id += 'ls' : notes_id = '';
            if (notes_id == '') return;
            let textarea_size;
            isFull ? textarea_size = 'min-width: 500px; min-height: 300px;' : textarea_size = 'min-width: 350px; min-height: 350px;'
            let css = `
  #notes_wrap {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2;
    width: 100%;
  height: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
}
#notes {
  display: grid;
  grid-gap: 0.5em;
  padding: 1em;
  background: ` + currentSettings['back_color']+`;
  color: ` + currentSettings['text_color']+currentSettings['text_opacity']+`;
  border: 1px solid #000000;
  border-radius: 15px;
  grid-template-areas: 'txt' 'switches' 'hide';
}

.notes_button:hover { text-decoration: none; color: #555555; }
.notes_button { display: none; text-align: center; color: #000000; text-decoration: underline; cursor: pointer; }
#notes_switches { grid-area: switches; }
#notes_hide { grid-area: hide; }
#notes_txt { grid-area: txt; padding-bottom: 5px; align-items: stretch;}
#notes_txt a { color: ` + currentSettings['link_color']+currentSettings['link_opacity']+`; }
#notes_hide { display: block; }
#notes_switches { text-align: center; color: #000000; }
.notes_textarea { ` + textarea_size + ` }
#notes_click, #notes_switches span { text-decoration: underline;  cursor: pointer; }
#notes_click:hover, #notes_switches span:hover { text-decoration: none; }`
            if (window.localStorage.getItem(notes_id) == null) window.localStorage.setItem(notes_id, '');

            let placeholdername = () => { let placeholder_name = '';
            notes_id == 'notes_main' ? placeholder_name = 'раздел - ОСебе' :
            notes_id == 'notes_chat' ? placeholder_name = 'раздел - чат' :
            notes_id == 'notes_ls' ? placeholder_name = 'раздел - ЛС' :
            notes_id == 'notes_blogs' ? placeholder_name = 'раздел - блоги' :
            notes_id == 'notes_sniff' ? placeholder_name = 'раздел - лента' :
            placeholder_name = '';
                                        return placeholder_name; }
            let noteshtml = `<textarea placeholder='Заметки сосисочного мода, `+ placeholdername() +`' class='notes_textarea' id=`+notes_id+`>`+window.localStorage.getItem(notes_id)+`</textarea>`
            $("body").append($("<div id='notes_wrap'></div>").html(`
        <div id="notes">
        <div id="notes_txt">` + noteshtml + `</div>
        <div id='notes_switches'>Переключиться:<br><span id="notes_main_switch">ОСебе</span> | <span id="notes_chat_switch">Чат</span> | <span id="notes_ls_switch">ЛС</span> | <span id="notes_blogs_switch">Блоги</span> | <span id="notes_sniff_switch">Лента</span></div>
        <div id="notes_hide" class="notes_button" onclick="$('#notes_wrap').hide()">Скрыть</div>
        </div>
        `));

            let notesSelection = (id) => {
                notes_id = 'notes_';
                id == 'notes_main_switch' ? notes_id += 'main' :
                id == 'notes_chat_switch' ? notes_id += 'chat' :
                id == 'notes_ls_switch' ? notes_id += 'ls' :
                id == 'notes_blogs_switch' ? notes_id += 'blogs' :
                id == 'notes_sniff_switch' ? notes_id += 'sniff' :
                notes_id = '';
                return notes_id;
            }

            let buttonstr = '';
            $(".notes_textarea").on('change', function() { window.localStorage.setItem(notes_id, $(this).val()) });
            currentSettings['color_pick'] ? buttonstr = ' | ' : buttonstr = '';
            let place = "#color_and_notes";
            $(place).prepend($("<span id='notes_click'></span>").html('Заметки'));
            if (currentSettings['color_pick']) $("#notes_click").after($("<span></span>").html(buttonstr));
            $("head").append($('<style id=notes_click_style></style>').html(css));
            $('#notes_main_switch, #notes_chat_switch, #notes_ls_switch, #notes_blogs_switch, #notes_sniff_switch').on('click', function ()
                                                                                                                       { notes_id = notesSelection($(this).prop('id'));
                                                                                                                        $('.notes_textarea').val(window.localStorage.getItem(notes_id));
                                                                                                                       $('.notes_textarea').prop('id', notes_id);
                                                                                                                       $('.notes_textarea').prop('placeholder', 'Заметки сосисочного мода, '+placeholdername())});
            $('#notes_click').on('click', function () { $('#notes_wrap').css('display', 'flex'); });
        }
    }

    let colornotes = () => {
        let place = '';
        (sniffPage || blogsPage) ? place = '#creation_div' : chatPage ? place = '#mess_form' : lsPage ? place = '#write_form' : place = '';
        if (!mainPage) $(place).before($("<div id='color_and_notes' style='display: none'></div>").html(''));
        else $($('textarea#text').parent()).before($("<div id='color_and_notes' style='display: none'></div>").html(''));
        colorPicker();
        notesfunc();
        if ($("#color_and_notes").html() != null) {
            notesflag = true;
            colorpickerflag = true;
        }
        if (currentSettings['notes'] || currentSettings['color_pick']) { $("#color_and_notes").css('display', 'block'); }
    }

    let stylishcat = () => { }

    var site_block = isFull ? '#branch' : '#site_table';

    let notesexport = () => {
        let mynotes = '';
        let notes_list = ['notes_main', 'notes_chat', 'notes_ls', 'notes_blogs', 'notes_sniff'];
        for (let x of notes_list) { mynotes += (' [sausage_mod_notes]: ' + window.localStorage.getItem(x)); }
        return mynotes;
    }

    let notessave = (exported) => {
        try {
        let notes_list = ['notes_main', 'notes_chat', 'notes_ls', 'notes_blogs', 'notes_sniff'];
        let notes_text = exported.split(' [sausage_mod_notes]: ');
        notes_text.shift();
        if (notes_text.length != 5) return 0;
        for (let x = 0; x < 5; x++) {
            window.localStorage.setItem(notes_list[x], notes_text[x]);
        }
            return 1; }
        catch {return 0; }
    }

            let settSave = (sett_id, value) => {
            currentSettings[sett_id] = value;
            window.localStorage.setItem(sett_id, value);
        }
        let settClear = (sett_color, sett_opacity) => {
            currentSettings[sett_color] = defaults[sett_color];
            currentSettings[sett_opacity] = defaults[sett_opacity];
            window.localStorage.setItem(sett_color, '');
            window.localStorage.setItem(sett_opacity, '');
        }

        let redesignClear = () => {
            var redesign = ['shower_fix', 'back_url', 'back_img', 'text_font', 'link_color', 'link_opacity', 'text_color', 'text_opacity', 'back_color', 'back_opacity', 'text_size']
            if (isFull) {
                var redesec = ['logo_url', 'logo_img', 'branch_left_img', 'branch_right_img'];
                redesign = redesign.concat(redesec);
            }
            for (let x = 0; x < redesign.length; x++) {
                currentSettings[redesign[x]] = defaults[redesign[x]];
                window.localStorage.setItem(redesign[x], '');
            }
        }

        let checkBoxLoad = (addr, value) => {
            $(addr).prop('checked', currentSettings[value]);
        }

    if (settingsPage) { // на странице настроек - загружаем настройки

        let redesignhtml = "Оставьте поле пустым, если хотите вернуть \"заводские\" настройки." +
            "</br><span title='Не будет работать в мобильной версии'>URL шапки: </span><input class='redesign' id='logo_img' type='url'>" +
            "</br>URL фона страницы: <input class='redesign' id='back_img' type='url'>" +
            "</br><span title='Не будет работать в мобильной версии'>URL левой боковой панели: </span><input class='redesign' id='branch_left_img' type='url'>" +
            "</br><span title='Не будет работать в мобильной версии'>URL правой боковой панели: </span><input class='redesign' id='branch_right_img' type='url' title='Для идентичности панелей впишите то же, что и вписано в URL левой панели'>" +
            "</br>Стиль шрифта текста: <input class='redesign' id='text_font'>" +
            "</br><span>Размер текста в пикселях (px)</span>: <input class='redesign' id='text_size' type='number' min='0' step='0.01' title='Дробные значения допустимы. Базовый размер шрифта: 0.9em'>" +
            "</br>Цвет текста: <input class='redesign' id='text_color' type='color' title='Базовый цвет текста дизайна: " + defaults['text_color'] +
            "'>. Прозрачность текста: <input class='redesign' id='text_opacity' type='number' min='0' max='255' step='0.01' title='Введите число от 0 до 255. Чем больше число, тем ниже будет прозрачность.'> <button id='design_textColorClear'>Сбросить настройки цвета текста</button>" +
            "</br>Цвет текста ссылок: <input class='redesign' id='link_color' type='color' title='Базовый цвет ссылок дизайна: " + defaults['link_color'] +
            "'>. Прозрачность ссылок: <input class='redesign' id='link_opacity' type='number' min='0' max='255' step='0.01' title='Введите число от 0 до 255. Чем больше число, тем ниже будет прозрачность.'> <button id='design_linkColorClear'>Сбросить настройки цвета ссылок</button>" +
            "</br>Цвет фона: <input class='redesign' id='back_color' type='color' title='Базовый цвет фона дизайна: " + defaults['back_color'] +
            "'>. Прозрачность фона: <input class='redesign' id='back_opacity' type='number' min='0' max='255' step='0.01' title='Введите число от 0 до 255. Чем больше число, тем ниже будет прозрачность.'> <button id='design_backColorClear'>Сбросить настройки цвета фона</button>" +
            "</br><label title='В случае, если пользовательские настройки для ссылок и фона не выставлены, будут использоваться цвета дизайна.'><input type='checkbox' class='checkboxes' id='shower_fix'>Принудительно заменять цвет ссылок и фона в блоке переключения между персонажами (независимо от настроек редизайнов)</label>" +
            "</br><button id='submitRedesign'>Применить настройки дизайнов</button> (полезно, если вы хотите увидеть результат здесь и сейчас) </br>или </br><button id='design_clear'>Сбросить все настройки дизайна</button> (вызывает обновление страницы)" +
            "<hr>"
        let css = `
  #redesign_wrap {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
}
#redesign {
  display: grid;
  grid-gap: 0.5em;
  width: auto;
  padding: 1em;
  background: ` + currentSettings['back_color']+`;
  color: ` + currentSettings['text_color']+currentSettings['text_opacity']+`;
  border: 1px solid #000000;
  border-radius: 15px;
  grid-template-areas: 'txt' 'hide';
}

.redesign_button:hover { text-decoration: none; color: #555555; }
.redesign_button { display: none; text-align: center; color: #000000; text-decoration: underline; cursor: pointer; }
#redesign_hide { grid-area: hide; }
#redesign_txt { grid-area: txt; padding-bottom: 5px; }
#redesign_txt a { color: ` + currentSettings['link_color']+currentSettings['link_opacity']+`; }
#redesign_hide { display: block; }
#redesign_click { text-decoration: underline;  cursor: pointer; }
#redesign_click:hover { text-decoration: none; }`

        $("head").append($('<style id=redesign_style></style>').html(css));

        $(site_block).append($('<div id="sausageSettings"></div>').html("<h2>Настройки мода-сосиски (версия " + version + ")</h2><a href='https://vk.com/rastite_sosiski' target='_blank'>Группа мода ВК</a>"));
        $("body").append($("<div id='redesign_wrap'></div>").html(`
        <div id="redesign">
        <div id="redesign_txt">` + redesignhtml + `</div>
        <div><span id="redesign_hide" class="redesign_button" onclick="$('#redesign_wrap').hide()">Скрыть</span></div>
        </div>
        `));
        $('div#sausageSettings').append($("<div id='redesign_click'></div>").html('<h3>Настройки редизайнов</h3>'));
        $('#redesign_click').on('click', function () {
            $('#redesign_wrap').css('display', 'flex');
        });
        $("div#sausageSettings").append($("<div id='site_modifications'></div>").html("<h3>Прочие настройки сайта</h3>"+
                                                                                      "<label><input type='checkbox' class='checkboxes' id='is_wound_warning_hidden'>Скрывать предупреждение о ранах (не рекомендуется)</label>"+
                                                                                      "</br><label><input type='checkbox' class='checkboxes' id='is_ad_hidden'>Скрывать рекламу в профиле</label>"+
                                                                                      "</br><label><input type='checkbox' class='checkboxes' id='color_pick'>Показывать окно выбора цвета для полей с bb-кодами</label>"+
                                                                                      "</br><label><input type='checkbox' class='checkboxes' id='notes'>Показывать заметки для полей с bb-кодами</label>"+
                                                                                      "</br></br>Экспортировать заметки: <textarea id='notes_export'>" + notesexport() + "</textarea> <button id='notes_export_copy'>Скопировать</button> <span id='copied_alert'></span>"+
                                                                                      "</br></br>Импортировать заметки: <textarea id='notes_import' placeholder='Импорт'></textarea> <button id='notes_import_save'>Сохранить</button> <span id='saved_alert'></span>"+
                                                                                      '<hr>'))
        css = `#notes_export, #notes_import { width: 200px; height: 30px; resize: none; }`
        $("head").append($('<style></style>').html(css));
        $(".redesign#logo_img").val(currentSettings["logo_img"]);
        $(".redesign#back_img").val(currentSettings["back_img"]);
        $(".redesign#branch_left_img").val(currentSettings["branch_left_img"]);
        $(".redesign#branch_right_img").val(currentSettings["branch_right_img"]);
        $(".redesign#text_font").val(currentSettings["text_font"]);
        $(".redesign#text_color").val(currentSettings["text_color"]);
        $(".redesign#link_color").val(currentSettings["link_color"]);
        $(".redesign#back_color").val(currentSettings["back_color"]);
        $(".redesign#text_opacity").val(currentSettings["text_opacity"]);
        $(".redesign#link_opacity").val(currentSettings["link_opacity"]);
        $(".redesign#back_opacity").val(currentSettings["back_opacity"]);
        $(".redesign#text_size").val(currentSettings["text_size"]);
        $("button#notes_export_copy").on("click", function () {
            $('#notes_export').prop('disabled', false);
            let notescopy = document.getElementById("notes_export");
            notescopy.select();
            notescopy.setSelectionRange(0, 99999);
            document.execCommand("copy");
            $('#notes_export').prop('disabled', true);
            $('#copied_alert').text("Скопировано!");
            setTimeout(function() { $('#copied_alert').text(""); }, 3000);
        });
        $("button#notes_import_save").on("click", function () {
            let flag = notessave($("#notes_import").val());
            if (flag) {
            $('#saved_alert').text("Сохранено!");
            }
            else {
                $('#saved_alert').text("Неизвестная ошибка");
            }
            setTimeout(function() { $('#saved_alert').text(""); }, 3000);
            });
        $("button#design_textColorClear").on("click", function () { settClear('text_color', 'text_opacity') });
        $("button#design_linkColorClear").on("click", function () { settClear('link_color', 'link_opacity') });
        $("button#design_backColorClear").on("click", function () { settClear('back_color', 'back_opacity') });
        $("button#design_clear").on("click", function () { redesignClear(); window.location.reload(true); })
        $("button#submitRedesign").on('click', function () { fullRedesign() });

        $("div#sausageSettings").append($("<div id='cw3_modifications'></div>").html("<h3>Дополнительные функции для Игровой</h3>" +
                                                                                     "<label><input type='checkbox' class='checkboxes' id='cages_nums'>Пронумеровать клетки в Игровой</label></br>" +
                                                                                     "Цвет цифр: <input class='sauscw3' id='cages_nums_color' type='color'></br>" +
                                                                                     "Цвет тени цифр: <input class='sauscw3' id='cages_nums_shadow' type='color'> (рекомендуется поставить контрастный)</br>" +
                                                                                     "<label><input type='checkbox' class='checkboxes' id='might_log_check'>Вести лог выпадения БУ с тренировок</label></br>"+
                                                                                     "<label><input type='checkbox' class='checkboxes' id='is_wound_alert_hidden'>Скрывать уведомление о пониженном здоровье при загрузке Игровой</label></br>"+
                                                                                     "<label><input type='checkbox' class='checkboxes' id='cw3_shower_fix'>Исправлять наложение компактной игровой на строку перехода на других персонажей (не всегда работает)</label></br>"));
        $("input#shower_fix").on("load", checkBoxLoad("input#shower_fix", 'shower_fix'));
        $("input#cw3_shower_fix").on("load", checkBoxLoad("input#cw3_shower_fix", 'cw3_shower_fix'));
        $("input#cages_nums").on("load", checkBoxLoad("input#cages_nums", 'cages_nums'));
        $("input#is_wound_warning_hidden").on("load", checkBoxLoad("input#is_wound_warning_hidden", 'is_wound_warning_hidden'));
        $("input#is_wound_alert_hidden").on("load", checkBoxLoad("input#is_wound_alert_hidden", 'is_wound_alert_hidden'));
        $("input#is_ad_hidden").on("load", checkBoxLoad("input#is_ad_hidden", 'is_ad_hidden'));
        $("input#might_log_check").on("load", checkBoxLoad("input#might_log_check", 'might_log_check'));
        $("input#color_pick").on("load", checkBoxLoad("input#color_pick", 'color_pick'));
        $("input#notes").on("load", checkBoxLoad("input#notes", 'notes'));
        $(".sauscw3#cages_nums_color").val(currentSettings["cages_nums_color"]);
        $(".sauscw3#cages_nums_shadow").val(currentSettings["cages_nums_shadow"]);
        $("input.redesign").on("change", function () { settSave($(this).attr('id'), $(this).val()) });
        $("input.sauscw3").on("change", function () { settSave($(this).attr('id'), $(this).val()) });
        $("input.checkboxes").on("click", function () { settSave($(this).attr('id'), toBool($(this).prop('checked'))) });

        $("#sausageSettings").append($("</br></br><hr><hr></br></br>"));

    }

    else if (cw3Page) {
        let mlchide = () => { if (currentSettings['might_log_check']) {
            if ($("#mightlogbutton").html() == '') { $('#parameter').append($('<div id="mightlogbutton"></div>').html('Лог тренировок')); }
            else { $("#mightlogbutton").css('display', 'block') }; }
                             else $("#mightlogbutton").css('display', 'none'); }

        let cagnumshide = () => { if (currentSettings['cages_nums']) {
            if ($("#cages_nums").html() == '') { cagesNumbers(); } }
                             else $("#cages_nums").remove() }

        let showfixchange = () => { if (currentSettings['cw3_shower_fix']) {
            if (currentSettings['is_shower_cw3']) { $('span.small').prepend($(".other_cats_list")) } }
            else $('#app').prepend($(".other_cats_list")) }

        if (currentSettings['cw3_fast_sett']) {
            $("#tr_mouth .title").before($("<div id='cw3_sausage_setts'></div>").html("<span>Быстрые настройки мода-сосиски</span><hr>"));
            $('#cw3_sausage_setts span').on('click', function () { $('#cw3saussetts_wrap').css('display', 'flex'); });
            let cw3saussetts_txt = "<label><input type='checkbox' class='checkboxes' id='cages_nums'>Пронумеровать клетки в Игровой</label></br>" +
                "Цвет цифр: <input class='sauscw3' id='cages_nums_color' type='color'></br>" +
                "Цвет тени цифр: <input class='sauscw3' id='cages_nums_shadow' type='color'> (рекомендуется поставить контрастный)</br>" +
                "<label><input type='checkbox' class='checkboxes' id='might_log_check'>Вести лог выпадения БУ с тренировок</label></br>"+
                "<label><input type='checkbox' class='checkboxes' id='is_wound_alert_hidden'>Скрывать уведомление о пониженном здоровье при загрузке Игровой</label></br>"+
                "<label><input type='checkbox' class='checkboxes' id='cw3_shower_fix'>Исправлять наложение компактной игровой на строку перехода на других персонажей (не всегда работает)</label></br>";
            let html = `
            <div id='cw3saussetts'>
            <div id='cw3saussetts_txt'> ` + cw3saussetts_txt + `</div>
            <div><span id='cw3saussetts_hide' class="cw3saussetts_button" onclick="$('#cw3saussetts_wrap').hide()">Закрыть</span></div>
            </div>
            `
            $('body').append($("<div id='cw3saussetts_wrap'></div>").html(html));
            $('head').append($("<style></style>").html(`
            #cw3_sausage_setts span {
            text-decoration: underline;
            font-weight: bold;
            font-size: 110%;
            padding: 10px;
            }
            #cw3_sausage_setts span:hover {
            text-decoration: none;
            cursor: pointer;
            }
              #cw3saussetts_wrap {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
}
#cw3saussetts {
  display: grid;
  grid-gap: 0.5em;
  width: auto;
  padding: 1em;
  background: #FFFFFF;
  color: #000000;
  border: 1px solid #000000;
  border-radius: 15px;
  grid-template-areas: 'txt' 'hide';
}

.cw3saussetts_button:hover { text-decoration: none; color: #555555; }
.cw3saussetts_button { display: none; text-align: center; color: #000000; text-decoration: underline; cursor: pointer; }
#cw3saussetts_hide { grid-area: hide; }
#cw3saussetts_txt { grid-area: txt; padding-bottom: 5px; }
#cw3saussetts_txt a { color: ` + currentSettings['link_color']+currentSettings['link_opacity']+`; }
#cw3saussetts_hide { display: block; }
            `));
            $("input#cw3_shower_fix").on("load", checkBoxLoad("input#cw3_shower_fix", 'cw3_shower_fix'));
        $("input#cages_nums").on("load", checkBoxLoad("input#cages_nums", 'cages_nums'));
        $("input#is_wound_alert_hidden").on("load", checkBoxLoad("input#is_wound_alert_hidden", 'is_wound_alert_hidden'));
        $("input#might_log_check").on("load", checkBoxLoad("input#might_log_check", 'might_log_check'));
        $(".sauscw3#cages_nums_color").val(currentSettings["cages_nums_color"]);
        $(".sauscw3#cages_nums_shadow").val(currentSettings["cages_nums_shadow"]);
        $("input.sauscw3").on("change", function () { settSave($(this).attr('id'), $(this).val());
                                                    });
        $("input.checkboxes").on("click", function () { settSave($(this).attr('id'), toBool($(this).prop('checked')));
                                                      if ($(this).attr('id') == 'might_log_check') mlchide();
                                                       else if ($(this).attr('id') == 'cages_nums') cagnumshide();
                                                       else if ($(this).attr('id') == 'cw3_shower_fix') showfixchange();});
        }

        if (currentSettings['might_log_check']) {
            let log_height = '';
            isFull ? log_height = 'max-height: 800px;' : log_height = 'max-height: 500px;'
            let css = `
  #mightlogwrap {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}
#mightlog {
  display: grid;
  grid-gap: 0.5em;
  width: auto;
  padding: 1em;
  background: #FFFFFF;
  color: #000000;
  border: 1px solid #000000;
  border-radius: 15px;
  grid-template-areas: 'txt txt' 'count count' 'clear hide';
}

.mightlog_button:hover { text-decoration: none; color: #555555; }
.mightlog_button { display: none; text-align: center; color: #000000; text-decoration: underline; cursor: pointer; }
#mightlog_count {grid-area: count; }
#mightlog_clear { grid-area: clear; }
#mightlog_hide { grid-area: hide; }
#mightlog_txt { grid-area: txt; padding-bottom: 5px; text-align: center; ` + log_height + ` overflow: auto; }
#mightlog_clear, #mightlog_hide { display: block; }`
      $('body').append($('<div id="mightlogwrap"></div>').html(`
        <div id="mightlog">
        <div id="mightlog_txt">` + currentSettings['might_log'] + `</div>
        <div id="mightlog_count">Всего выпало с последней очистки: ` + currentSettings['count_drop'] +  `</div>
        <div id="mightlog_clear" class="mightlog_button">Очистить лог</div>
        <div id="mightlog_hide" class="mightlog_button" onclick="$('#mightlogwrap').hide()">Скрыть лог</div>
        </div>
        `));
            $("#mightlog_clear").on('click', function () {
                currentSettings['might_log'] = defaults['might_log'];
                window.localStorage.setItem('might_log', currentSettings['might_log']);
                currentSettings['count_exersizes'] = defaults['count_exersizes'];
                window.localStorage.setItem('count_exersizes', currentSettings['count_exersizes']);
                currentSettings['might_log_before_count'] = defaults['might_log_before_count'];
                window.localStorage.setItem('might_log_before_count', currentSettings['might_log_before_count']);
                currentSettings['count_drop'] = defaults['count_drop'];
                window.localStorage.setItem('count_drop', currentSettings['count_drop']);
                $("#mightlog_txt").html(currentSettings["might_log"]);
                $("#mightlog_count").html("Всего выпало с последней очистки: "+currentSettings["count_drop"]);
                $('#mightlogwrap').hide();
            });
            $("head").append($('<style id=mightlog_style></style>').html(css));
            $('#parameter').append($('<div id="mightlogbutton"></div>').html('Лог тренировок'));
            css = `
        #mightlogbutton { margin-left: 17px; text-decoration: underline;  cursor: pointer; }
        #mightlogbutton:hover { text-decoration: none; }
        `
      $("head").append($('<style id=mightlogbutton_style></style>').html(css));
            $('#mightlogbutton').on('click', function () {
                $('#mightlogwrap').css('display', 'flex');
            });
            setTimeout(function() { $("#mightlog_txt").html(currentSettings["might_log"]); $("#mightlog_count").html("Всего выпало с последней очистки: "+currentSettings["count_drop"]); }, 300);
        }
    }

    else if (sniffPage || mainPage || lscreate || chatPage || blogsPage) {
        colornotes();
    }
    else if (profilePage) {
        $("b:contains('О себе:')").append($("<span></span>").text(" "));
        $("b:contains('О себе:')").append($("<span class='about-hide-content' id='about-hide'></span>").text("свернуть"));
        $("b:contains('О себе:')").append($("<span class='about-hide-content' id='about-show' style='display:none;'></span>").text("развернуть"));
        $("head").append($("<style></style").html(`.about-hide-content { text-decoration:underline; font-weight: normal; }
                                                  .about-hide-content:hover { text-decoration:none; }
                                                  `));
        $("table[style*='width:100%']").attr("id", "about-table");
        $("#about-hide").on('click', function() {
            $("#about-table").css({"display":"none", 'width':'100%'});
            $("#about-show").css("display", "inline");
            $("#about-hide").css("display", "none");
        });
        $("#about-show").on('click', function() {
            $("#about-table").css({"display":"table", 'width':'100%'});
            $("#about-show").css("display", "none");
            $("#about-hide").css("display", "inline");
        });
    }

    var redesignUpdateObserver = new MutationObserver(function () {
        fullRedesign();
    });

    var colNotObserver = new MutationObserver(function () {
        if ($('div#write_div').html() == null) {
            notesflag = false;
            colorpickerflag = false; }
        else if (!notesflag && !colorpickerflag) {
            pageLocation = window.location.href;
            lscreate = (/^https?:\/\/\w?\.?catwar.su\/ls[?]new/.test(pageLocation));
            colornotes();
        }
    });

    var actObserver = new MutationObserver(function () {
        var actions = document.getElementById("block_mess");
        var timer = document.getElementById("sek");
        if (actions.innerHTML.indexOf("Успокаиваться") != -1 && timer.innerHTML == '1 с') {
            setTimeout(function () { mightSkillUpd(); }, 2000);
        }
    });

    var alertObserver = new MutationObserver(function () {
        woundAlertHide();
    });

    var cagesObserver = new MutationObserver(function() {

    });

    var redesignUpdateTarget = document.getElementById("site_table");
    var actTarget = document.getElementById("block_mess");
    var alertTarget = document.getElementById('error');
    var colNotTarget = document.getElementById(site_block.slice(1));
    var cagesTarget = document.getElementById('cages');

    $(function () {
        if (!cw3Page) {
            fullRedesign();
            if (currentSettings['is_wound_warning_hidden']) { $('#warningAboutWound').css('display', 'none') }
            if (currentSettings['is_ad_hidden'] && mainPage) { $('#t').css('display', 'none') }
            if (chatPage || blogsPage || sniffPage || aboutPage) {
                redesignUpdateObserver.observe(redesignUpdateTarget, { childList: true, attributes: true, characterData: true, subtree: true });
            }
            if (lsPage) {
                colNotObserver.observe(colNotTarget, { childList: true, characterData: true, subtree: true });
            }

        }
        else if (cw3Page) {
            cagesNumbers();
            alertObserver.observe(alertTarget, { childList: true, attributes: true, characterData: true, subtree: true });
            actObserver.observe(actTarget, { childList: true, attributes: true, characterData: true, subtree: true });
            cagesObserver.observe(cagesTarget, { childList: true, characterData: true, subtree: true });
            if (currentSettings['is_shower_cw3'] && currentSettings['cw3_shower_fix']) { $('span.small').prepend($(".other_cats_list")) };
        };
    });
});

