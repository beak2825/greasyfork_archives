// ==UserScript==
// @name         Shoptet zkratky beta
// @namespace    mailto:azuzula.cz@gmail.com
// @version      0.065b
// @description  Zkratky do Shoptetu
// @author       Zuzana Nyiri
// @match        https://*/admin/*
// @require      https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@43fd0fe4de1166f343883511e53546e87840aeaf/gm_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451951/Shoptet%20zkratky%20beta.user.js
// @updateURL https://update.greasyfork.org/scripts/451951/Shoptet%20zkratky%20beta.meta.js
// ==/UserScript==
//aktuální verze knihovny https://openuserjs.org/src/libs/sizzle/GM_config.js

(function() {
    'use strict';
    console.log('userscript version ' + GM_info.script.version);
    var sURL = [];
    var sName = [];
    var sTitle = [];
    var sTarget = [];
    //var backup = false;

    //*** inicializace okna nastavení
    initRows();
    initMenu();

    //*** sestavení menu
    var fieldDefs;
    var myField;
    const MenuHead = "<hr><div id='flip' style='padding-left:0px;'>";
    const MenuRow1 = "<a href='#' class='navigation__link' target='_self'><div style='padding-left:0px; padding-right:12px;'>⭐</div>Zkratky</a></div>";
    const PanelHead = "<ul><div id='panel1' style='display:none; padding-left:27px;'>";
    const MenuFoot = "<hr><a href='#' id='myConfig' class='navigation__link' style='padding-top:5px; padding-bottom:5px; text-transform:none;'>Nastavení</a></div><hr></ul>";
    var MyHtml = MenuHead+MenuRow1+PanelHead;
    let kl_zkratka = "";

    // vytvoření tlačítek do menu
    for (let a = 1; a <= GM_config.get('aRows'); a++) {
        if (GM_config.get('url'+a) == "-") {
            MyHtml = MyHtml+"<hr>"+GM_config.get('name'+a);
        }
        else {
            if (GM_config.get('shortcut'+a)){
                kl_zkratka = ' (zkratka: ';
                if (GM_config.get('ctrlKey'+a)){
                    kl_zkratka = kl_zkratka + 'ctrl+';
                }
                if (GM_config.get('altKey'+a)){
                    kl_zkratka = kl_zkratka + 'alt+';
                }
                if (GM_config.get('shiftKey'+a)){
                    kl_zkratka = kl_zkratka + 'shift+';
                }
                kl_zkratka = kl_zkratka + GM_config.get('shortcut'+a)+')';
            }
            else{
                kl_zkratka = '';
            }
            MyHtml = MyHtml+"<li><a href='"+GM_config.get('url'+a)+"' id='Zkratky_menu_link"+a+"' class='navigation__link' style='padding-top:5px; padding-bottom:5px; text-transform:none; "+button_style(GM_config.get('url'+a))+"' target='_"+GM_config.get('target'+a)+"' title='"+GM_config.get('title'+a)+kl_zkratka+"'>"+GM_config.get('name'+a)+"</a></li>";
        }
    }
    MyHtml = MyHtml+MenuFoot;
    $(".navigation").prepend(MyHtml);
    //*** menu sestaveno a vloženo do stránky

    //*** otevření menu po kliknutí a uložení stavu
    $('#flip').click(function(e) {
        e.preventDefault();
        $("#panel1").slideToggle("fast", function() {
            if ($('#panel1').is(":visible")){
                GM_config.set('otevreno',true);
                GM_config.save();
            }
            else if($('#panel1').is(":hidden")){
                GM_config.set('otevreno',false);
                GM_config.save();
            }
        });
    });
    //***

    //*** pokud bylo menu otevřené, tak se znovu otevře po načtení stránky
    if (GM_config.get('otevreno')){
        $("#panel1").slideDown(0);
    };
    //***

    //*** Sestavení okna nastavení doplňku
    $('#myConfig').click(function(e) {
        e.preventDefault();
        initMenu();
        GM_config.open();
    });
    //***

    //*** event listener čeká na klávesové zkratky
    document.addEventListener('keydown', function(e) {
        console.log(e);
        for (let a = 1; a <= GM_config.get('aRows'); a++) {
            if (e.key.toLowerCase() == GM_config.get('shortcut'+a) && e.ctrlKey == GM_config.get('ctrlKey'+a) && e.altKey == GM_config.get('altKey'+a) && e.shiftKey == GM_config.get('shiftKey'+a)){
                console.log('zkratka souhlasí, řádek' + a);
                $('#Zkratky_menu_link'+a)[0].click();
            }
        }
        // zachytí klávesu ESC a zavře okno nastevní. Nefunguje, pokud je focus na okno nastavení. Musí se kliknout mimo něj.
        if (e.code == "Escape"){
            if ($('#Zkratky').length){
                GM_config.close();
            }
            if ($('#item-preview').length){
                $("#item-preview").remove();
            }
        }
    }, false);
    //***

})();

//*** vytvoření záhlaví okna nastavení
function initRows(){
    var fieldRows = {
        'btnPlus':
        {
            'section': 'Počet řádků menu',
            type: 'button',
            label: '+',
            'click': function() {
                let aRows = GM_config.get('aRows',true);
                if(aRows+1 >= 100){
                    aRows=100;
                }
                else{
                    GM_config.set('aRows',aRows+1);
                    console.log( 'Vytvářím Řádek '+aRows+1);
                    GM_config.save();
                    GM_config.close();
                }
                initMenu();
                GM_config.open();//$('#myConfig')[0].click();
            }
        },
        'aRows':
        {
            'labelPos': 'left',
            'label': 'Počet řádků', // Appears next to field
            'type': 'number', // Makes this setting a text field
            'default': '1', // Default value if user doesn't change it
            'size': 1,
            'min': 1,
            'max': 100
        },
        'btnMinus': {
            'label': '-',
            'type': 'button',
            'click': function() {
                let aRows = GM_config.get('aRows',true);
                if(aRows-1 > 0 && aRows <=100){
                    console.log( 'Odstraňuji Řádek '+aRows);
                    $('#Zkratky').contents().find('body').find("#Zkratky_field_aRows").val(aRows-1);

                    GM_config.fields['title'+aRows].remove();
                    GM_config.fields['target'+aRows].remove();
                    GM_config.fields['name'+aRows].remove();
                    GM_config.fields['url'+aRows].remove();
                    var myText =
                        '{'+
                        '"url'+aRows+'":'+
                        '{'+
                        '"type":"hidden"'+
                        '},'+
                        '"name'+aRows+'":'+
                        '{'+
                        '"type":"hidden"'+
                        '},'+
                        '"target'+aRows+'":'+
                        '{'+
                        '"type":"hidden"'+
                        '},'+
                         '"shortcut'+aRows+'":'+
                        '{'+
                        '"type":"hidden"'+
                        '},'+
                        '"altKey'+aRows+'":'+
                        '{'+
                        '"type":"hidden"'+
                        '},'+
                         '"ctrlKey'+aRows+'":'+
                        '{'+
                        '"type":"hidden"'+
                        '},'+
                         '"shiftKey'+aRows+'":'+
                        '{'+
                        '"type":"hidden"'+
                        '},'+
                        '"title'+aRows+'":'+
                        '{'+
                        '"type":"hidden"'+
                        '}'+
                        '}';

                    var delField = JSON.parse(myText);
                    GM_config.init(
                        {
                            'id': 'Zkratky',
                            'title': 'Nastavení zkratek: řádků '+aRows-1,
                            'fields': delField,
                        });
                    GM_config.save();
                    GM_config.close();
                    initMenu();
                    GM_config.open();
                }
                else{
                    aRows = 100;
                }
            }
        },
        'btnBackup':
        {
            type: 'button',
            label: 'Backup',
        },
        'btnSaveBackup':
        {
            type: 'button',
            label: 'Uložit',
        },
        'btnCopyBackup':
        {
            type: 'button',
            label: 'Kopírovat',
        },
        'btnSaveReload':
        {
            type: 'button',
            label: 'Save & Reload',
            'click': function() {
                GM_config.save();
                GM_config.close();
                location.reload();
            }
        },
        'otevreno':
        {
            'type': 'hidden',
            'default': false,
        },
        'verze':
        {
            'type': 'hidden',
        },
        'okVerze':
        {
            'type': 'button',
            'label': 'Ok',
            'click': function() {
                GM_config.set("verze", GM_info.script.version);
                GM_config.save();
                console.log("Uloženo verze"+GM_config.get("verze"));
            }
        },
    };

    //*** inicializace, toto obsahuje počet řádků k vygenerování seznamu
    GM_config.init(
        {
            'id': 'Zkratky', // The id used for this instance of GM_config
            'title': 'Nastavení',
            'fields': fieldRows, // Fields object
        });
};
//*** konec záhlaví okna nastavení

//*** vytvoření těla okna nastavení a všech dynamicky generovaných řádků
function initMenu(){
    //funkce na sestavení části menu
    //sestavení JSON

    var myText = "{";
    console.log("Aktuální hodnota aRows:", GM_config.get('aRows'));
    //var aRows = GM_config.get('aRows');
    //GM_config.set('aRows', Math.round(aRows));
    for (let b = 1; b <= GM_config.get('aRows'); b++){
        var text =
            '"url'+b+'":{'+
            '"section": "'+b+'. ",'+
            '"labelPos": "left",'+
            '"label": "URL (?)",'+
            '"type":"text",'+
            '"size":"60",'+
            '"default": "/admin/"'+
            '},'+
            '"name'+b+'":{'+
            '"labelPos": "left",'+
            '"label": "Text odkazu",'+
            '"type": "text",'+
            '"size":"50",'+
            '"default": "Přehled"'+
            '},'+
            '"target'+b+'":{'+
            '"labelPos": "left",'+
            '"options": ["self", "blank"],'+
            '"label": "target (?)",'+
            '"type": "radio",'+
            '"default": "self"'+
            '},'+
            '"title'+b+'":{'+
            '"labelPos": "left",'+
            '"label": "Nápověda (?)",'+
            '"size":"50",'+
            '"type": "text",'+
            '"default": "Administrace základní přehled"'+
            '},'+
            '"shortcut'+b+'":{'+
            '"labelPos": "left",'+
            '"label": "Klávesová zkratka",'+
            '"size":"1",'+
            '"type": "text"'+
            '},'+
            '"ctrlKey'+b+'":{'+
            '"labelPos": "right",'+
            '"label": "Ctrl",'+
            '"type": "checkbox",'+
            '"default": "false"'+
            '},'+
            '"altKey'+b+'":{'+
            '"labelPos": "right",'+
            '"label": "alt",'+
            '"type": "checkbox",'+
            '"default": "false"'+
            '},'+
            '"shiftKey'+b+'":{'+
            '"labelPos": "right",'+
            '"label": "Shift",'+
            '"type": "checkbox",'+
            '"default": "false"'+
            '}';

        myText = myText + text;
        if(b < GM_config.get('aRows')){
            myText=myText+",";
        }
    };
    myText = myText + "}";
    var fieldDefs = JSON.parse(myText);

    //*** toto vygeneruje spodní části okna nastavení a poznámky dole
    GM_config.init(
        {
            'id': 'Zkratky', // The id used for this instance of GM_config
            'title': 'Nastavení',
            'fields': fieldDefs,
            'events':{
                'open': function(doc) {
                    //*** vytvoření zápatí

                    $('#Zkratky').contents().find('#Zkratky_buttons_holder')
                        .append('<div id="saveResetBtn"></div><div id="backupField">'+
                                '<div id="text-field" style="display: none;"><textarea id="backupTextField" rows="20" cols="100">"text"</textarea><div id="btn-field"></div></div>'+
                                '<p><a href="https://greasyfork.org/cs/users/600258-zuzana-nyiri" target="new" title="Další uživatelské skripty pro ***monkey dopňky.">Získat další skripty</a></p>'+
                                '<p><div style="font-family: verdana, geneva; font-size: 8pt;">Prosím, zvažte drobnou finanční podporu, jednorázovou a nebo pravidelnou, jako vyjádření díků za tento doplněk, pomůžete mi tak pokračovat v dalším vývoji a aktualizaci skriptů.<br>Děkuji, Zuzana Nyiri - Vokolo.cz<br>'+
                                '<form action="https://www.paypal.com/donate" method="post" target="_new">'+
                                '<input type="hidden" name="hosted_button_id" value="FSBBE3GUXYW52" />'+
                                '<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"'+
                                'border="0" name="submit" title="Jednorázové i měsíční dary na podporu dalšího vývoje a aktualizace skriptů." alt="Donate with PayPal button" /></form><a href="https://greasyfork.org/cs/scripts/451951-shoptet-zkratky-beta/versions" target="_blank">Verze ' + GM_info.script.version + '</a></div></p>').prepend('<hr>');
                    //***
                    //*** úpravy a přesouvání prvků na lepší místa
                    $('#Zkratky').contents().find('#Zkratky_aRows_field_label').detach();
                    $('#Zkratky').contents().find('#Zkratky_field_btnMinus').detach().appendTo($('#Zkratky').contents().find('#Zkratky_section_header_0').append(' '));
                    $('#Zkratky').contents().find('#Zkratky_field_aRows').detach().appendTo($('#Zkratky').contents().find('#Zkratky_section_header_0')).prop('disabled', true);
                    $('#Zkratky').contents().find('#Zkratky_field_btnPlus').detach().appendTo($('#Zkratky').contents().find('#Zkratky_section_header_0'));
                    //*** srovnání tlačítek uložit/zavřít/reload
                    $('#Zkratky').contents().find('#Zkratky_saveBtn').detach().appendTo($('#Zkratky').contents().find('#saveResetBtn'));
                    $('#Zkratky').contents().find('#Zkratky_field_btnSaveReload').addClass('Buttons').detach().appendTo($('#Zkratky').contents().find('#saveResetBtn'));
                    $('#Zkratky').contents().find('#Zkratky_closeBtn').detach().appendTo($('#Zkratky').contents().find('#saveResetBtn'));
                    $('#Zkratky').contents().find('#Zkratky_field_btnBackup').addClass('saveclose_buttons').detach().prependTo($('#Zkratky').contents().find('#backupField'));
                    $('#Zkratky').contents().find('#Zkratky_field_btnSaveBackup').addClass('saveclose_buttons').prop('title', 'Uloží aktuální nastavení z textového pole').detach().appendTo($('#Zkratky').contents().find('#btn-field'));
                    $('#Zkratky').contents().find('#Zkratky_field_btnCopyBackup').addClass('saveclose_buttons').prop('title', 'Vloží obsah textového pole do schránky').detach().appendTo($('#Zkratky').contents().find('#btn-field'));
                    //*** úpravy/přesun polí a tlačítek a popisů
                    for (let a = 1; a <= GM_config.get('aRows'); a++) {
                        //***
                        $('#Zkratky').contents().find('#Zkratky_section_header_'+a).after('<div id="settings_container_'+a+'" class="settings_containers" style="text-align:left"></div>')
                        $('#Zkratky').contents().find('#Zkratky_section_header_'+a).attr('data-row', a);
                        $('#Zkratky').contents().find('#Zkratky_url'+a+'_var').detach().appendTo($('#Zkratky').contents().find('#settings_container_'+a));
                        $('#Zkratky').contents().find('#Zkratky_name'+a+'_var').detach().appendTo($('#Zkratky').contents().find('#settings_container_'+a));
                        $('#Zkratky').contents().find('#Zkratky_target'+a+'_var').detach().appendTo($('#Zkratky').contents().find('#settings_container_'+a));
                        $('#Zkratky').contents().find('#Zkratky_title'+a+'_var').detach().appendTo($('#Zkratky').contents().find('#settings_container_'+a));
                        $('#Zkratky').contents().find('#settings_container_'+a).append('<div id="shortcut_container_'+a+'" style="text-align:left"></div>');
                        //*** klávesové zkratky
                        //$('#Zkratky').contents().find('#Zkratky_section_'+a).append('<div id="shortcut_holder'+a+'" style="text-align:left"></div>');
                        $('#Zkratky').contents().find('#Zkratky_shortcut'+a+'_field_label').detach().appendTo($('#Zkratky').contents().find('#shortcut_container_'+a));
                        $('#Zkratky').contents().find('#Zkratky_field_shortcut'+a).detach().appendTo($('#Zkratky').contents().find('#shortcut_container_'+a));
                        $('#Zkratky').contents().find('#shortcut_holder'+a).append('&nbsp;&nbsp;&nbsp;&nbsp;');
                        $('#Zkratky').contents().find('#Zkratky_ctrlKey'+a+'_field_label').detach().appendTo($('#Zkratky').contents().find('#shortcut_container_'+a));
                        $('#Zkratky').contents().find('#Zkratky_field_ctrlKey'+a).detach().appendTo($('#Zkratky').contents().find('#shortcut_container_'+a));
                        $('#Zkratky').contents().find('#shortcut_holder'+a).append('&nbsp;&nbsp;&nbsp;&nbsp;');
                        $('#Zkratky').contents().find('#Zkratky_altKey'+a+'_field_label').detach().appendTo($('#Zkratky').contents().find('#shortcut_container_'+a));
                        $('#Zkratky').contents().find('#Zkratky_field_altKey'+a).detach().appendTo($('#Zkratky').contents().find('#shortcut_container_'+a));
                        $('#Zkratky').contents().find('#shortcut_holder'+a).append('&nbsp;&nbsp;&nbsp;&nbsp;');
                        $('#Zkratky').contents().find('#Zkratky_shiftKey'+a+'_field_label').detach().appendTo($('#Zkratky').contents().find('#shortcut_container_'+a));
                        $('#Zkratky').contents().find('#Zkratky_field_shiftKey'+a).detach().appendTo($('#Zkratky').contents().find('#shortcut_container_'+a));
                        //*** přidá k názvu sekce i text odkazu
                        $('#Zkratky').contents().find('#Zkratky_section_header_'+a).append(GM_config.get('name'+a));
                        //*** přidá nápovědu
                        $('#Zkratky').contents().find('#Zkratky_url'+a+'_field_label').prop('title', 'Zapiš URL adresu.\x0ANebo pomlčku pro zobrazení dělící čáry. Pole "Text odkazu" pak bude jako nadpis nové sekce v menu.');
                        $('#Zkratky').contents().find('#Zkratky_target'+a+'_field_label').prop('title', 'self = otevře odkaz v aktuálním panelu\x0Ablank = otevře odkaz v novém panelu');
                        $('#Zkratky').contents().find('#Zkratky_title'+a+'_field_label').prop('title', 'Tato nápověda se zobrazí po najetí myši na odkaz v menu.');
                        //*** tlačítka přesunu zkratek
                        if (GM_config.get('aRows') > 1){
                            if (a == 1){
                                $('#Zkratky').contents().find('#Zkratky_section_header_'+a).append('<div id="move_buttons'+a+'" style="text-align:left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" value="⇓" class="moveMenuBtn" title="Přesunout zkratku o řádek dolu" data-row="'+a+'" data-smer="1" /></div>');
                            }
                            else if (a == GM_config.get('aRows')){
                                $('#Zkratky').contents().find('#Zkratky_section_header_'+a).append('<div id="move_buttons'+a+'" style="text-align:left"><input type="button" value="⇑" class="moveMenuBtn" title="Přesunout zkratku o řádek nahoru" data-row="'+a+'" data-smer="-1" /></div>');
                            }
                            else{
                                $('#Zkratky').contents().find("#Zkratky_section_header_"+a).append('<div id="move_buttons'+a+'" style="text-align:left"><input type="button" value="⇑" class="moveMenuBtn" data-row="'+a+'" title="Přesunout zkratku o řádek nahoru" data-smer="-1" /> <input type="button" value="⇓" title="Přesunout zkratku o řádek dolu" class="moveMenuBtn" data-row="'+a+'" data-smer="1" /></div>');
                            }
                        }
                    }

                    //** funkce přesunující zkratky nahoru/dolu
                    $('#Zkratky').contents().find('.moveMenuBtn').click(function(event){
                        let row = $(this).data('row');
                        let smer = $(this).data('smer');
                        console.log('Řádek ' + row + ' změní své pořadí o ' + smer);
                        let urlToMove = GM_config.get('url'+row);
                        let nameToMove = GM_config.get('name'+row);
                        let targetToMove = GM_config.get('target'+row);
                        let titleToMove = GM_config.get('title'+row);
                        let shortcutToMove = GM_config.get('shortcut'+row);
                        let ctrlKeyToMove = GM_config.get('ctrlKey'+row);
                        let altKeyToMove = GM_config.get('altKey'+row);
                        let shiftKeyToMove = GM_config.get('shiftKey'+row);
                        GM_config.set('url'+row, GM_config.get('url'+(row+smer)));GM_config.set('url'+(row+smer), urlToMove);
                        GM_config.set('name'+row, GM_config.get('name'+(row+smer)));GM_config.set('name'+(row+smer), nameToMove);
                        GM_config.set('target'+row, GM_config.get('target'+(row+smer)));GM_config.set('target'+(row+smer), targetToMove);
                        GM_config.set('title'+row, GM_config.get('title'+(row+smer)));GM_config.set('title'+(row+smer), titleToMove);
                        GM_config.set('shortcut'+row, GM_config.get('shortcut'+(row+smer)));GM_config.set('shortcut'+(row+smer), shortcutToMove);
                        GM_config.set('ctrlKey'+row, GM_config.get('ctrlKey'+(row+smer)));GM_config.set('ctrlKey'+(row+smer), ctrlKeyToMove);
                        GM_config.set('altKey'+row, GM_config.get('altKey'+(row+smer)));GM_config.set('altKey'+(row+smer), altKeyToMove);
                        GM_config.set('shiftKey'+row, GM_config.get('shiftKey'+(row+smer)));GM_config.set('shiftKey'+(row+smer), shiftKeyToMove);
                        GM_config.save();
                        GM_config.close();
                        initMenu();
                        GM_config.open();
                    });
                    //***

                    //*** proběhla aktualizace? Zobraz info.
                    console.log('skript je verze:' + GM_config.get('verze') +'='+ GM_info.script.version+';');
                    if (GM_config.get('verze') != GM_info.script.version || !GM_config.get('verze')){
                        $('#Zkratky').contents().find('#Zkratky_verze_var').append('<p id="verzeText">Proběhla aktualizace skriptu na verzi '+ GM_info.script.version +'. Na detaily změn se můžete podívat na <a href="https://greasyfork.org/cs/scripts/451951-shoptet-zkratky-beta/versions" target="_blank">Greasy&nbsp;Fork</a> &nbsp; </p>');
                    }
                    $('#Zkratky').contents().find('#Zkratky_field_okVerze').detach().appendTo($('#Zkratky').contents().find('#verzeText'));
                    //***

                    //*** barva sekcí
                    $('#Zkratky').contents().find('.section_header.center').css('background-color', $('.header').css('background-color'));

                    //*** otevření menu po kliknutí
                    $('#Zkratky').contents().find('.section_header.center').click(function(event) {
                        $('#Zkratky').contents().find('#settings_container_'+$(this).data('row')).slideToggle("fast", function() {
                        });
                    });

                    //*** rozevření textarea pro zálohu
                    $('#Zkratky').contents().find('#Zkratky_field_btnBackup').click(function(event) {
                        $('#Zkratky').contents().find('#text-field').slideToggle("fast", function() {
                        });
                        var myBackupData = backup_read();
                        //console.log(myBackupData);
                        console.log('data načtena a vypsána do textového pole');
                        $('#Zkratky').contents().find('#backupTextField').text(myBackupData);
                    });

                    //*** Vloží obsah textového pole do schránky
                     $('#Zkratky').contents().find('#Zkratky_field_btnCopyBackup').click(function(event) {
                         $('#Zkratky')[0].contentWindow.document.querySelector('#backupTextField').select();
                         $('#Zkratky')[0].contentWindow.document.execCommand('copy');
                         console.log("data vložena do schránky");

                    });

                    //*** Uloží obsah textového pole do nastavení doplňku = proběhne import nastavení
                    $('#Zkratky').contents().find('#Zkratky_field_btnSaveBackup').click(function(event) {
                        // Získání obsahu textového pole v iframe
                        var obsah = $('#Zkratky').contents().find('#backupTextField').val();
                        var importRows = 0;
                        // Rozdělení obsahu na řádky
                        var radky = obsah.split('\n');
                        // Procházení jednotlivých řádků
                        console.log('počet řádků = ' + Math.round(((radky.length-1)/8)));
                        //console.log('počet řádků bez výpočtu = ' + radky);
                        for (var i = 0; i < radky.length; i++) {
                            // Rozdělení řádku na identifikátor a hodnotu
                            //console.log(radky[i]);

                            var casti = radky[i].split(';');
                            // uloží získaná data do nastavení doplňku
                            var identifikator = casti[0];//.replace(/\d+/g, '');
                            var hodnota = casti[1];

                            /*if (identifikator.includes("url")){
                                importRows++;

                            }*/
                            if (GM_config.get('aRows') != importRows){
                                GM_config.set('aRows', Math.round(((radky.length-1)/8)));
                                var backup = true;
                                GM_config.save();
                                GM_config.close();
                                initMenu();
                                GM_config.open();
                            }
                            if (identifikator === "ctrlKey"+i || identifikator === "altKey"+i || identifikator === "shiftKey"+i) {
                                //configInstance.set(identifikator, hodnota);
                                //hodnota = (hodnota === "true"); // Převod na boolean
                            }
                            else{
                            GM_config.set(identifikator,hodnota);
                            }
                            console.log("Ukládám: '"+ identifikator + "'='" + hodnota + "'");
                            
                            //GM_config.set(identifikator,hodnota);
                            //GM_config.save(casti[0],casti[1]);
                        }
                        GM_config.save();
                        GM_config.close();
                        GM_config.open();
                        //location.reload();
                        console.log("Proběhl import nastavení");
                    });
                    //***

                }
            },
            css:
            '#Zkratky * {font-family: verdana, geneva !important;}'+
            '#Zkratky_header { font-size: 20pt !important;}'+
            '#Zkratky_buttons_holder { text-align: center !important;}'+
            '#Zkratky_resetLink { display: none !important;}'+
            '.space_lg { width:30px; }'+
            //'#Zkratky_field_btnSaveReload { margin-top: 6px; margin-left: 10px; margin-right: 10px; margin-bottom: 10px; padding-left: 12px; padding-right: 12px; padding-top: 2px; padding-bottom: 2px;}'+
            //'.Buttons { margin-top: 6px; margin-left: 10px; margin-right: 10px; margin-bottom: 10px; padding-left: 12px; padding-right: 12px; padding-top: 2px; padding-bottom: 2px;}'+
            '.settings_containers {display: none}'
        });
};
//*** konec dynamického generování řádků nastavení

//*** Záloha a obnovení nastavení
// přečte nastavení a vypíše ho v textovém poli v nastavení doplňku
// Záloha se bude provádět ručním kopírováním textu a nebo stažením txt souboru do počítače.
function backup_read(){
    // tohle mi zbývá vymyslet a napsat.
    var fieldNamesArray = [0,'url', 'name', 'shortcut', 'ctrlKey', 'altKey', 'shiftKey', 'target', 'title'];
    var fieldRows = GM_config.get('aRows');
    var backupData="";

    console.log("fieldRows="+fieldRows);
    for (let a = 1; a <= fieldRows; a++){
        for (let b = 1; b <= 8; b++){
            //console.log(fieldNamesArray[b]+a);
            console.log(GM_config.get(fieldNamesArray[b]+a));
            backupData = backupData + fieldNamesArray[b] + a + ";" + GM_config.get(fieldNamesArray[b]+a)+"\n";
        }
        //backupData = backupData +"\n";
    }
    //console.log(backupData);
    backupData = backupData + 'otevreno;' + GM_config.get('otevreno')+';';
    return backupData;
}
//*** konec záloh

//*** vrací styl tlačítka podle aktuální url
function button_style(actual_url) {
    var retval;
    var this_url = window.location.href;
    if (this_url.indexOf(actual_url) >= 0) {
        retval = "background-color: #A7C721; color: white;";
    }
    else {
        retval = "";
    }
    return retval;
}