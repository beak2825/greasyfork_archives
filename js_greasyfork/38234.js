// ==UserScript==
// @name TW My Set Buttons
// @name:el TW My Set Buttons
// @description This script, just add most useful 4 button to the page!
// @description:el Αυτό το script, απλά προσθέτει 4 χρήσιμα κουμπιά στην σελίδα σας!
// @namespace TW_Timemod
// @author Timemod Herkumo
// @include https://*.the-west.*/game.php*
// @version 1.1.13
// @website https://greasyfork.org/en/scripts/38234-tw-my-set-buttons
// @icon https://i.imgur.com/6ie8aM4.jpg
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/38234/TW%20My%20Set%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/38234/TW%20My%20Set%20Buttons.meta.js
// ==/UserScript==
(function(fn) {
    var script = document.createElement('script');
    script.setAttribute('type', 'application/javascript');
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
})(function() {
    var mySetButton = {
        version: '1.1.13',
        author: 'Timemod Herkumo',
        minGame: '2.03',
        maxGame: Game.version.toString(),
        website: 'https://greasyfork.org/en/scripts/38234-tw-my-set-buttons',
        updateUrl: 'https://raw.githubusercontent.com/Timemod-Herkumo/My-Set-Buttons/master/My%20Set%20Buttons.js',
        images: {
            constr_img: "https://i.imgur.com/Da5ZwC3.png",
            speed_img: "https://i.imgur.com/K6odevz.png",
            exp_img: "https://i.imgur.com/Mehsu9u.png",
            sleep_img: "https://i.imgur.com/YFF0r5a.png"
        }
    };
    var langs;
    langs = {
        en_US: {
            lang_select: 'Language selected',
            language: 'English',
            ApiGui: 'This script, just add most useful 4 button to the page.',
            contact: 'Contact',
            title: 'My Set Buttons',
            update: 'Update',
            updateAvailable: 'New version of the script are available.',
            name: 'My Set Buttons',
            con: 'Construction',
            speed: 'Speed',
            exp: 'Experience',
            sleep: 'Regeneration',
            msgme: 'Send me a message to:'
        },
        el_GR: {
            lang_select: 'Επιλεγμένη Γλώσσα',
            language: 'Ελληνικά',
            ApiGui: 'Αυτό το script, απλά προσθέτει 4 χρήσιμα κουμπιά στην σελίδα σας',
            contact: 'Επικοινωνία',
            title: 'My Set Buttons',
            update: 'Ενημέρωση',
            updateAvailable: 'Νέα έκδοση του My Set Buttons είναι διαθέσιμη.',
            name: 'My Set Buttons',
            con: 'Κατασκευή',
            speed: 'Ταχύτητα',
            exp: 'Εμπειρία',
            sleep: 'Αναγέννηση',
            msgme: 'Στείλτε μου μήνυμα στο:'
        },
		 de_DE: {
            lang_select: 'Sprache ausgewählt',
            language: 'German',
            ApiGui: 'Dieses Skript, fügen Sie einfach die nützlichste 4-Taste auf der Seite hinzu.',
            contact: 'Kontakt',
            title: 'My Set Buttons',
            update: 'Aktualisierung',
            updateAvailable: 'Neue Version des Skripts ist verfügbar.',
            name: 'My Set Buttons',
            con: 'Konstruktion',
            speed: 'Geschwindigkeit',
            exp: 'Erfahrung',
            sleep: 'Regeneration',
            msgme: 'Schick mir eine Nachricht an:'
        },
        it_IT: {
            lang_select: 'Lingua selezionata',
            language: 'Italiano',
            ApiGui: 'Questo script aggiunge 4 pulsanti preexpiniti dall utente a sua scelta.',
            contact: 'Contatti',
            title: 'Il mio set Pulsanti',
            update: 'Aggiorna',
            updateAvailable: 'Nuova versione dello script disponibile',
            name: 'Il mio set Pulsanti',
            con: 'Costruzione',
            speed: 'Velocità',
            exp: 'Esperienza',
            sleep: 'Rigenerazione',
            msgme: 'Inviami un messaggio a:'
        },
        ru_RU: {
            lang_select: 'Выбранный язык',
            language: 'Русский',
            ApiGui: 'Этот скрипт, добавляет 4 допольнительных кнопок!',
            contact: 'Контакты',
            title: 'Мои Набор кнопок',
            name: 'Мои Набор кнопок',
            update: 'Обновление',
            updateAvailable: 'Доступно обновление скрипта.',
            con: 'Строительство',
            speed: 'Скорость',
            exp: 'Опыт',
            sleep: 'Регенерация',
            msgme: 'Отправьте мне сообщение:'
        },
        ro_RO: {
            lang_select: 'Limba selectionata',
            language: 'Romana',
            ApiGui: 'Acest script, adauga 4 butoane adaugatoare. (Cele mai des folosite)',
            contact: 'Contacte',
            title: 'My Set Butoane',
            name: 'My Set Butoane',
            update: 'Actualizare',
            updateAvailable: 'Disponibila o noua actualizare.',
            con: 'Construcții',
            speed: 'Viteza',
            exp: 'Experiență',
            sleep: 'Regenerare',
            msgme: 'Trimite-mi un mesaj către:'
        }
    };
    var MPlang = langs.hasOwnProperty(Game.locale) ? langs[Game.locale] : langs.el_GR;
    var mySetButtonApi = TheWestApi.register('mySetButton', MPlang.title, mySetButton.minGame, mySetButton.maxGame, mySetButton.author, mySetButton.website);
    mySetButtonApi.setGui('<br><i>' + MPlang.lang_select + ': </i>' + MPlang.language + '<br><br>' + MPlang.ApiGui + '<br><br><i>' + MPlang.name + ' v' + mySetButton.version +
        '</i><br><br><img src="' +
        mySetButton.images.constr_img + '"> <img src="' +
        mySetButton.images.speed_img + '"> <img src="' +
        mySetButton.images.exp_img + '"> <img src="' +
        mySetButton.images.sleep_img + '"><br><br><br><b> ' +
        MPlang.contact + ':</b><ul style="margin-left:15px;"><li>' + MPlang.msgme + '<a target=\'_blanck\' href="https://greasyfork.org/forum/messages/add/Timemod%20Herkumo"> Greasy Fork </a>' +
        '<img src="https://westgr.innogamescdn.com/images/chat/emoticons/smile.png?1"></li></ul>');

    var str = window.location.href.toString();
    var Country = str.substring(8,10);
    var trPaes = Country.toString();
    if (~str.indexOf(trPaes + "1.")) {
        trPaes = trPaes + '1';
    } else if (~str.indexOf(trPaes + "2.")){
        trPaes = trPaes + '2';
    } else if (~str.indexOf(trPaes + "3.")){
        trPaes = trPaes + '3';
    } else if (~str.indexOf(trPaes + "4.")){
        trPaes = trPaes + '4';
    } else if (~str.indexOf(trPaes + "5.")){
        trPaes = trPaes + '5';
    } else if (~str.indexOf(trPaes + "6.")){
        trPaes = trPaes + '6';
    } else if (~str.indexOf(trPaes + "7.")){
        trPaes = trPaes + '7';
    } else if (~str.indexOf(trPaes + "8.")){
        trPaes = trPaes + '8';
    } else if (~str.indexOf(trPaes + "9.")){
        trPaes = trPaes + '9';
    } else if (~str.indexOf(trPaes + "10.")){
        trPaes = trPaes + '10';
    } else if (~str.indexOf(trPaes + "11.")){
        trPaes = trPaes + '11';
    } else if (~str.indexOf(trPaes + "12.")){
        trPaes = trPaes + '12';
    } else if (~str.indexOf(trPaes + "13.")){
        trPaes = trPaes + '13';
    } else if (~str.indexOf(trPaes + "14.")){
        trPaes = trPaes + '14';
    } else if (~str.indexOf(trPaes + "15.")){
        trPaes = trPaes + '15';
    } else if (~str.indexOf(trPaes + "16.")){
        trPaes = trPaes + '16';
    } else if (~str.indexOf(trPaes + "17.")){
        trPaes = trPaes + '17';
    } else if (~str.indexOf(trPaes + "18.")){
        trPaes = trPaes + '18';
    } else if (~str.indexOf(trPaes + "19.")){
        trPaes = trPaes + '19';
    } else if (~str.indexOf(trPaes + "20.")){
        trPaes = trPaes + '20';
    }
    var alegeServer = {
        ['server_' + Country + '1']: {               // Server 1
            construction: '1',
            speed: '',
            exp: '',
            regen: ''
        },
        ['server_' + Country + '2']: {               // Server 2
            construction: '2',
            speed: '',
            exp: '',
            regen: ''
        },
        ['server_' + Country + '3']: {               // Server 3
            construction: '3',
            speed: '',
            exp: '',
            regen: ''
        },
        ['server_' + Country + '4']: {               // Server 4
            construction: '4',
            speed: '',
            exp: '',
            regen: ''
        },
        ['server_' + Country + '5']: {               // Server 5
            construction: '5',
            speed: '',
            exp: '',
            regen: ''
        },
        ['server_' + Country + '6']: {               // Server 6
            construction: '26372',
            speed: '26373',
            exp: '26271',
            regen: '26239'
        },
        ['server_' + Country + '7']: {               // Server 7
            construction: '7',
            speed: '',
            exp: '',
            regen: ''
        },
        ['server_' + Country + '8']: {               // Server 8
            construction: '8',
            speed: '',
            exp: '',
            regen: ''
        },
        ['server_' + Country + '9']: {               // Server 9
            construction: '9',
            speed: '',
            exp: '',
            regen: ''
        },
        ['server_' + Country + '10']: {               // Server 10
            construction: '10',
            speed: '',
            exp: '',
            regen: ''
        },
        ['server_' + Country + '11']: {               // Server 11
            construction: '11',
            speed: '',
            exp: '',
            regen: ''
        },
        ['server_' + Country + '12']: {               // Server 12
            construction: '12',
            speed: '',
            exp: '',
            regen: ''
        },
        ['server_' + Country + '13']: {               // Server 13
            construction: '13',
            speed: '',
            exp: '',
            regen: ''
        },
        ['server_' + Country + '14']: {               // Server 14
            construction: '14',
            speed: '',
            exp: '',
            regen: ''
        },
        ['server_' + Country + '15']: {               // Server 15
            construction: '15',
            speed: '',
            exp: '',
            regen: ''
        },
        ['server_' + Country + '16']: {               // Server 16
            construction: '16',
            speed: '',
            exp: '',
            regen: ''
        },
        ['server_' + Country + '17']: {               // Server 17
            construction: '17',
            speed: '',
            exp: '',
            regen: ''
        },
        ['server_' + Country + '18']: {               // Server 18
            construction: '18',
            speed: '',
            exp: '',
            regen: ''
        },
        ['server_' + Country + '19']: {               // Server 19
            construction: '19',
            speed: '',
            exp: '',
            regen: ''
        },
        ['server_' + Country + '20']: {               // Server 20
            construction: '20',
            speed: '',
            exp: '',
            regen: ''
        }
    };
    mySetButton.getMessageDialog = function (text, type, title) {
        title = title || '';
        if (type == 'warning') {
            type = west.gui.Dialog.SYS_WARNING;
        }
        if (type == 'question') {
            type = west.gui.Dialog.SYS_QUESTION;
        }
        return new west.gui.Dialog(text, title, type);
    };
    mySetButton.init = function() {
        var style = document.createElement('style');
        var css = '' + '';
        style.setAttribute('type', 'text/css');
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        document.getElementsByTagName('head')[0].appendChild(style);
        mySetButton.start();
    };
    mySetButton.start = function() {
        if (window.document.getElementById('ui_notibar')) {
            try {
                this.addButton();
            } catch (e) {}
        } else {
            setTimeout(function() {
                mySetButton.start();
            }, 1000);
        }
    };
    mySetButton.addButton = function() {
        var construction = $('<div title="' + MPlang.con+ '" class="job hasMousePopup" style="position:relative!important;display:inline-block!important;margin-top:5px;margin-bottom:2px" onclick="javascript:EquipManager.switchEquip(' + alegeServer['server_' + trPaes]['construction'] + ');"><img src=' + mySetButton.images.constr_img + ' class="job_icon" />');
        var speed = $('<div title="' + MPlang.speed + '" class="job hasMousePopup" style="position:relative!important;display:inline-block!important;margin-top:5px;margin-bottom:2px" onclick="javascript:EquipManager.switchEquip(' + alegeServer['server_' + trPaes]['speed'] + ');"><img src=' + mySetButton.images.speed_img + ' class="job_icon" />');
        var exps = $('<div title="' + MPlang.exp + '" class="job hasMousePopup" style="position:relative!important;display:inline-block!important;margin-top:5px;margin-bottom:2px" onclick="javascript:EquipManager.switchEquip(' + alegeServer['server_' + trPaes]['exp'] + ');"><img src=' + mySetButton.images.exp_img + ' class="job_icon" />');
        var dorm = $('<div title="' + MPlang.sleep + '" class="job hasMousePopup" style="position:relative!important;display:inline-block!important;margin-top:5px;margin-bottom:2px" onclick="javascript:EquipManager.switchEquip(' + alegeServer['server_' + trPaes]['regen'] + ');"><img src=' + mySetButton.images.sleep_img + ' class="job_icon" />');
        $('#ui_notibar').prepend(construction).prepend(exps).prepend(speed).prepend(dorm);
        $('.game_notification_area').css('top', '277px').css('z-index', '15');
    };
    mySetButton.gui = {
    };
    mySetButton.gui.init = function () {
        mySetButton.gui.makeButton = function (caption, callback) {
            return new west.gui.Button(caption, callback);
        };
    };
    mySetButton.Updater = function () {
        $.getScript(mySetButton.updateUrl, function () {
            if (aggiornaScript.mySetButton != mySetButton.version) {
                var updateMessage = new west.gui.Dialog(MPlang.update + ': ' + MPlang.name, '<span>' +
                    MPlang.updateAvailable + '<br><br><b>v' +
                    aggiornaScript.mySetButton + ':</b><br>' +
                    aggiornaScript.mySetButtonNew + '</span>', west.gui.Dialog.SYS_WARNING).addButton(MPlang.update, function () {
                    updateMessage.hide();
                    location.href = mySetButton.website + '/code.user.js';
                }).addButton('cancel').show();
            }
        });
    };
    $(document).ready(function () {
        try {
            mySetButton.gui.init();
            mySetButton.init();
            setTimeout(mySetButton.Updater, 5000);
        } catch (e) {
            console.log(e.stack);
        }
    });
});
