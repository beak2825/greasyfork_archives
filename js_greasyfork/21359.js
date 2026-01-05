// ==UserScript==
// @name         Dreadcast Chat Enhancer
// @namespace    https://greasyfork.org/scripts/21359-dreadcast-chat-enhancer/
// @version      2.3.17
// @description  Améliore le chat de Dreadcast.
// @author       MockingJay, Odul, Ladoria, Isilin
// @match        https://www.dreadcast.eu/Main
// @match        https://www.dreadcast.net/Main
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @license      http://creativecommons.org/licenses/by-nc-nd/4.0/
// @downloadURL https://update.greasyfork.org/scripts/21359/Dreadcast%20Chat%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/21359/Dreadcast%20Chat%20Enhancer.meta.js
// ==/UserScript==

//Lit les variables dans GM à la demande. A utiliser pour chaque déclaration de variable qui est copiée en mémoire.
//initValue: Valeur par défaut de la variable, qu'on lui donne à la déclaration et qu'elle garde si pas d'équivalent en mémoire. localVarName: Valeur GM locale.
function initLocalMemory(defaultValue, localVarName) {
    if (GM_getValue(localVarName) === undefined) {
        GM_setValue(localVarName, defaultValue);
        return defaultValue;
    } else {
        return GM_getValue(localVarName);
    }
}

function rgb2hex(orig){
    var rgb = orig.replace(/\s/g,'').match(/^rgba?\((\d+),(\d+),(\d+)/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : orig;
}

$(document).ready(function() {

    //**********************************************
    // DECLARATION DES VARIABLES
    //**********************************************

    //CONSTANTES
    const W_ZONE_CHAT = 317; //Largeur de base des différents éléments du chat.
    const W_MSG = 290;
    const W_CHATCONTENT = 308; //Valeur pas d'origine, mais nécessaire pour le script.
    const W_CHAT = 328;
    const W_ONGLETS_CHAT = 254;
    const W_CHATFORM = 288;

    const DEFAULT_CHAT_COLOR = rgb2hex($("#zone_chat .zone_infos").css("color"));
    $('<div class="couleur5" style="display:none;"></div>').appendTo("body");
    const DEFAULT_CHAT_COLOR5 = ($(".couleur5").css("color") !== undefined) ? rgb2hex($(".couleur5").css("color")) : "#999";
    $('<div class="couleur4" style="display:none;"></div>').appendTo("body");
    const DEFAULT_CHAT_COLOR4 = ($(".couleur4").css("color") !== undefined) ? rgb2hex($(".couleur4").css("color")) : "#999";
    $('<div class="couleur_rouge" style="display:none;"></div>').appendTo("body");
    const DEFAULT_CHAT_COLOR_RED = ($(".couleur_rouge").css("color") !== undefined) ? rgb2hex($(".couleur_rouge").css("color")) : "#D32929";

    const DEFAULT_ZONE_DROITE_BG = $("#zone_droite").css("background"); //Permet de restituer le fond d'origine (ou de skin) de la zone droite lorsque le chat est à sa largeur initiale.
    const DEFAULT_SCRIPT_ZONE_DROITE_BG = 'https://i.imgur.com/kPzRqS2.png';
    const DEFAULT_SCRIPT_ZONE_CHAT_BG = 'https://i.imgur.com/0J3wOK0.png';

    const DEFAULT_ALERT_CHAT_AUDIO_URL = 'https://www.dreadcast.net/sons/dcce.mp3';

    //Initialisation variables de préférences
    var autoScroll = initLocalMemory(false, "DCCE_autoScroll");
    var scrollBar = initLocalMemory(true, "DCCE_scrollBar");
    var typePredict = initLocalMemory(true, "DCCE_typePredict");
    var alertVolume = initLocalMemory(1, "DCCE_alertVolume");
    var chatExtend = initLocalMemory(0, "DCCE_chatExtend");

    const mrpDefaultCommands = [
        { alias:"env", name:"Environment", color:"#00FF00", bold:false, rp:true },
        { alias:"sis", name:"Ta soeur", color:"#00FFFF", bold:true, rp:false },
        { alias:"creepy", name:"Le Monstre", color:"#FF6464", bold:false, rp:true }
    ];
    var mrpCommandsString = initLocalMemory(JSON.stringify(mrpDefaultCommands), "DCCE_MRP");
    var mrpCommands = JSON.parse(mrpCommandsString);

    var scriptZoneDroiteBG = initLocalMemory(DEFAULT_SCRIPT_ZONE_DROITE_BG, "DCCE_scriptZoneDroiteBG");
    var scriptZoneChatBG = initLocalMemory(DEFAULT_SCRIPT_ZONE_CHAT_BG, "DCCE_scriptZoneChatBG");

    var alertChatAudioURL = initLocalMemory(DEFAULT_ALERT_CHAT_AUDIO_URL, "DCCE_alertChatAudioURL");
    var activateAlertChat = initLocalMemory(false, "DCCE_activateAlertChat");

    var chatWidthStyle = $('<style id="chatWidthStyle">').appendTo("head"); //Utilisation d'une règle CSS car objets créés dynamiquement.

    var chatEmoteStyle = $('<style id="chatEmoteStyle">span[style*="color:#58DCF9;"] em{color: ' + DEFAULT_CHAT_COLOR + ';}</style>').appendTo("head"); //Règle CSS pour appliquer la couleur du skin aux emotes. Visible uniquement côté client.
    var chatEmoteStyleWe = $('<style id="chatEmoteStyleWe">.msg.couleur5 span[style*="color:#58DCF9;"] em{color: ' + DEFAULT_CHAT_COLOR5 + ';}</style>').appendTo("head");
    var chatEmoteStyleYe = $('<style id="chatEmoteStyleYe">.msg.couleur_rouge span[style*="color:#58DCF9;"] em{color: ' + DEFAULT_CHAT_COLOR_RED + ';}</style>').appendTo("head");
    var chatEmoteStyleSpeech = $('<style id="chatEmoteStyleSpeech">.msg em span[style*="color:#FFFFFF;"]{font-style: normal;}</style>').appendTo("head"); //Redresse les paroles dans des emotes
    //Un non-utilisateur du script aura la couleur de base bleu clair.

    //**********************************************
    // DECLARATION DES FONCTIONS, MISE EN PLACE DU CSS
    //**********************************************

    $("#chatContent").css({
        "overflow-x": 'hidden',
        "overflow-y": 'scroll',
        //height: '313px', //width traitée dans setChatCSS
        "height": '100%',
    });

    //Applique la barre de défilement en fonction des préférences, et règle la largeur des lignes dans le chat.
    function setChatContentScroll() {
        if(scrollBar) {
            $("#chatContent").css({"overflow-y": 'scroll'});
        }
        else {
            $("#chatContent").css({"overflow-y": 'hidden'});
        }
    }


    var $dcce_background = $('<div id="dcce_background"></div>').prependTo($("#zone_page")).css({left: '907px', top: '142px', height: '461px'}).css({display: 'none'});

    function setZoneChatBackground() {
        if(chatExtend > 0) {
            $dcce_background.css({background: 'url("' + scriptZoneChatBG + '")',
                                  "background-size": '100% 100%',
                                  width: (W_ZONE_CHAT + 13 + chatExtend) + 'px'});
            $("#zone_droite").css({background: 'url("' + scriptZoneDroiteBG + '")'});
        } else {
            $dcce_background.css({
                background: 'none',
                width: '0px'
            });
            $("#zone_droite").css({background: DEFAULT_ZONE_DROITE_BG});
        }
    }

    function setChatCSS() {
        setChatContentScroll();
        /*setZoneChatBackground();
        //Fixer les largeurs restantes
        $("#chatContent").width(W_CHATCONTENT + chatExtend);
        $("#zone_chat .zone_infos .chat").width(W_CHAT + chatExtend);
        $("#zone_chat #onglets_chat").width(W_ONGLETS_CHAT + chatExtend);
        $("#chatForm").width(W_CHATFORM + chatExtend);*/
    }

    setChatCSS();

    //Initialisation du bouton d'alerte, utilisé quand l'autoScroll est désactivé.
    var $newMessageAlert = $('<div />').appendTo($('#zone_chat'));
    $newMessageAlert.text("⚠ Nouveau message! ⚠");
    $newMessageAlert.css({
        display: 'none',
        top: '45px',
        "text-align": 'center',
        cursor: 'pointer',
        background: '#fff',
        border: '1px solid #fff',
        color: '#0296bb',
        "margin-top": '2px',
        "-webkit-box-shadow": '0 0 4px 2px #329bc2',
    });
    $newMessageAlert.attr('onmouseover', 'this.style.backgroundColor=\"#0b9bcb\";this.style.color=\"#FFFFFF\";');
    $newMessageAlert.attr('onmouseout', 'this.style.backgroundColor=\"#FFFFFF\";this.style.color=\"#0296bb\";');

    //Initialisation bandeau latéral
    var $toggleAutoScroll = $('<li id="toggleAutoScroll" class="couleur5" ></li>'+'<li class="separator"></li>').prependTo($('#bandeau ul.menus'));
    if(autoScroll) {
        $("#toggleAutoScroll").text("AS on");
    } else {
        $("#toggleAutoScroll").text("AS off");
    }
    $("#toggleAutoScroll").css({
        cursor: 'pointer',
    });
    //$("#toggleAutoScroll").attr('onmouseover', 'this.style.color=\"#0073d5\";');
    //$("#toggleAutoScroll").attr('onmouseout', 'this.style.color=\"#999\";');
    $("#toggleAutoScroll").hover(
        function(){
            $(this).css("color", "#0073d5");
        },
        function(){
            var colorAS = autoScroll ? "#999" : "#D00000";
            $(this).css("color", colorAS);
        }
    );
    //Changer l'autoscroll au clic sur le bandeau latéral.
    $("#toggleAutoScroll").click(function(){
        if(autoScroll) {
            autoScroll = false;
            $("#toggleAutoScroll").text("AS off");
        } else {
            autoScroll = true;
            $("#toggleAutoScroll").text("AS on");
        }
        GM_setValue("DCCE_autoScroll", autoScroll);
    });

    //Fait défiler le chat jusqu'en bas.
    function scrollChat(){
        $('#chatContent').stop().animate({
            scrollTop: $('#chatContent')[0].scrollHeight
        }, 800);
        $newMessageAlert.stop().fadeOut(500);
    }

    var colorTagStyle = $('<style id="colorTagStyle">').prependTo("head"); //Utilisation d'une règle CSS car objets créés dynamiquement.

    function chatChangeColor(id) {
        var persoName = GM_getValue("dcce_name_" + id);
        var colorRule = GM_getValue("dcce_ctb_" + id);
        if (colorRule === undefined) colorRule = DEFAULT_CHAT_COLOR;

        var newRule = `.c${persoName} {color: ${colorRule};}
.couleur5 .c${persoName} {color: ${DEFAULT_CHAT_COLOR5};}
.couleur5 .c${persoName}.couleur4 {color: ${DEFAULT_CHAT_COLOR4};}`;

        colorTagStyle.text(colorTagStyle.text() + newRule);

    }

    function initChatColor() {
        var localValues = GM_listValues();
        for(var i = 0; i < localValues.length; i++) {
            if(localValues[i].includes("dcce_ctb_")) {
                chatChangeColor(localValues[i].slice(9));
            }
        }
    }
    initChatColor();

    //**********************************************
    //INTERFACE DE CONFIGURATION UTILISATEUR
    //**********************************************
    var $databox = $('#zone_dataBox');
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //Constructeur de fenêtre de configuration
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var DCCE_ConfigurationWindow = function () {
        var window_width = '560px';
        var window_height = '450px';
        var $config_window = $('<div id="dcce_configwindow" onclick="engine.switchDataBox(this)"/>');
        $config_window.draggable();
        $config_window.addClass('dataBox focused ui-draggable');
        $config_window.css({
            width: window_width,
            "margin-left": '-185px',
            display: 'block',
            position: 'absolute',
            "z-index": '2',
        });
        for (var i = 1; i <= 8; i++) {
            $('<div class="dbfond' + i + '" />').appendTo($config_window);
        }
        var $config_head = $('<div class="head ui-draggable-handle" ondblclick="$(\'#dcce_configwindow\').toggleClass(\'reduced\');" />').appendTo($config_window);
        $('<div title="Fermer la fenêtre (Q)" class="info1 link close" onclick="engine.closeDataBox($(this).parent().parent().attr(\'id\'));">X</div>').appendTo($config_head);
        $('<div title="Reduire/Agrandir la fenêtre" class="info1 link reduce" onclick="$(\'#dcce_configwindow\').toggleClass(\'reduced\');">-</div>').appendTo($config_head);
        $('<div class="title">Configuration DC Enhanced Chat</div>').appendTo($config_head);
        $('<div class="dbloader" />').appendTo($config_window);
        var $config_content = $('<div class="content" style="height:' + window_height + '; overflow: auto"/>').appendTo($config_window);
        //----------------------------------------
        //Widgets internes
        //----------------------------------------
        var $config_interface = $('<div />').appendTo($config_content);
        $config_interface.css({
            "margin-left": '3px',
            "font-variant": 'small-caps',
            color: '#fff',
            height: '100%',
            width: '98%',
        });
        //----------------------------------------
        //Configuration du défilement, auto-scroll
        //----------------------------------------
        var $autoconfig = $('<div />').appendTo($config_interface);
        var $autoconfig_title = $('<h2 class="couleur4 configTitre" />').appendTo($autoconfig);
        $autoconfig_title.text('Options de défilement du texte');
        $autoconfig_title.css({
            "margin-bottom": '5px',
            "border-bottom": '1px solid',
            display: 'block',
            "font-size": '17px',
            "-webkit-margin-before": '0.83em',
            "-webkit-margin-after": '0.83em',
            "-webkit-margin-start": '0px',
            "-webkit-margin-end": '0px',
            "font-weight": 'bold',
            position: 'relative',
        });
        var $autoconfig_container = $('<div class="ligne"/>').appendTo($config_interface);
        $autoconfig_container.text('Défilement automatique : ');
        $autoconfig_container.css({
            display: 'inline-block',
            "margin-bottom": '15px',
            "margin-left": '5px'
        });
        var $autoconfig_radio_activate = $('<input type="radio" name="typeAutoRadio" value="false">Activer</input>').appendTo($autoconfig_container);
        $autoconfig_radio_activate.css({
            margin: '0 5px',
        });
        $autoconfig_radio_activate.attr('checked', autoScroll);
        $autoconfig_radio_activate.change(function(){
            autoScroll = true;
            GM_setValue("DCCE_autoScroll", autoScroll);
            $("#toggleAutoScroll").text("AS on");
        });
        var $autoconfig_radio_deactivate = $('<input type="radio" name="typeAutoRadio" value="true">Désactiver</input>').appendTo($autoconfig_container);
        $autoconfig_radio_deactivate.css({
            margin: '0px 5px 0 25px',
            "padding-left": '20px',
        });
        $autoconfig_radio_deactivate.attr('checked', !autoScroll);
        $autoconfig_radio_deactivate.change(function(){
            autoScroll = false;
            GM_setValue("DCCE_autoScroll", autoScroll);
            $("#toggleAutoScroll").text("AS off");
        });
        //----------------------------------------
        //Configuration de l'affichage de la barre de défilement
        //----------------------------------------
        var $scrconfig_container = $('<div class="ligne"/>').appendTo($config_interface);
        $scrconfig_container.text('Barre de défilement : ');
        $scrconfig_container.css({
            display: 'inline-block',
            "margin-bottom": '15px',
            "margin-left": '5px'
        });
        var $scrconfig_radio_activate = $('<input type="radio" name="typeScrRadio" value="false">Afficher</input>').appendTo($scrconfig_container);
        $scrconfig_radio_activate.css({
            margin: '0 5px',
        });
        $scrconfig_radio_activate.attr('checked', scrollBar);
        $scrconfig_radio_activate.change(function(){
            scrollBar = true;
            GM_setValue("DCCE_scrollBar", scrollBar);
            setChatContentScroll();
        });
        var $scrconfig_radio_deactivate = $('<input type="radio" name="typeScrRadio" value="true">Masquer</input>').appendTo($scrconfig_container);
        $scrconfig_radio_deactivate.css({
            margin: '0px 5px 0 25px',
            "padding-left": '20px',
        });
        $scrconfig_radio_deactivate.attr('checked', !scrollBar);
        $scrconfig_radio_deactivate.change(function(){
            scrollBar = false;
            GM_setValue("DCCE_scrollBar", scrollBar);
            setChatContentScroll();
        });
        //----------------------------------------
        //Configuration de l'affichage de la barre de défilement
        //----------------------------------------
        var $predconfig_container = $('<div class="ligne"/>').appendTo($config_interface);
        $predconfig_container.text('Défiler le chat à l\'écriture : ');
        $predconfig_container.css({
            display: 'inline-block',
            "margin-bottom": '15px',
            "margin-left": '5px'
        });
        var $predconfig_radio_activate = $('<input type="radio" name="typePredRadio" value="false">Oui</input>').appendTo($predconfig_container);
        $predconfig_radio_activate.css({
            margin: '0 5px',
        });
        $predconfig_radio_activate.attr('checked', typePredict);
        $predconfig_radio_activate.change(function(){
            typePredict = true;
            GM_setValue("DCCE_typePredict", typePredict);
        });
        var $predconfig_radio_deactivate = $('<input type="radio" name="typePredRadio" value="true">Non</input>').appendTo($predconfig_container);
        $predconfig_radio_deactivate.css({
            margin: '0px 5px 0 25px',
            "padding-left": '20px',
        });
        $predconfig_radio_deactivate.attr('checked', !typePredict);
        $predconfig_radio_deactivate.change(function(){
            typePredict = false;
            GM_setValue("DCCE_typePredict", typePredict);
        });

        //----------------------------------------
        //Configuration de l'audio joué avec AlertChat
        //----------------------------------------
        var $audioconfig_container = $('<div class="ligne"/>').appendTo($config_interface);
        $audioconfig_container.text('');
        $audioconfig_container.css({
            display: 'inline-block',
            "margin-bottom": '15px',
        });
        var $audioconfig_pzonechat = $('<div> </div><div>Audio joué à la réception d\'un message (indiquer URL de l\'audio) : </div>').appendTo($audioconfig_container);
        $audioconfig_pzonechat.css({
            margin: '0 5px',
            width: '500px'
        });
        var $audioconfig_zonechat = $('<input type="url" name="typealertchat" value="' + alertChatAudioURL + '" style="background-color: antiquewhite;"></input>').appendTo($audioconfig_container);
        $audioconfig_zonechat.css({
            margin: '0 5px',
            width: '500px'
        });
        $audioconfig_zonechat.keyup(function(){
            alertChatAudioURL = $(this).val();
            if(alertChatAudioURL === "") {
                GM_setValue("DCCE_alertChatAudioURL", DEFAULT_ALERT_CHAT_AUDIO_URL);
                $('#checkchat').attr('src', DEFAULT_ALERT_CHAT_AUDIO_URL);
            } else {
                GM_setValue("DCCE_alertChatAudioURL", alertChatAudioURL);
                $('#checkchat').attr('src', alertChatAudioURL);
            }
        });
        var $audioconfig_vol = $('<input type="range" name="typealertvolume" value="' + alertVolume + '" min="0" max="1" step="0.01"></input>').appendTo($audioconfig_container);
        $audioconfig_vol.css({
            margin: '0 5px',
            width: '500px'
        });
        $audioconfig_vol.change(function(){
            alertVolume = Number($audioconfig_vol.val());
            GM_setValue("DCCE_alertVolume", alertVolume);
            document.getElementById('checkchat').volume = (activateAlertChat) ? alertVolume : 0;
        });


        this.$window = $config_window;


        //----------------------------------------
        //Configuration des couleurs de pseudos dans le chat
        //----------------------------------------
        var $clrconfig = $('<div />').appendTo($config_interface);
        var $clrconfig_title = $('<h2 class="couleur4 configTitre" />').appendTo($clrconfig);
        $clrconfig_title.text('Gestion des couleurs de pseudos');
        $clrconfig_title.css({
            "margin-bottom": '5px',
            "border-bottom": '1px solid',
            display: 'block',
            "font-size": '17px',
            "-webkit-margin-before": '0.83em',
            "-webkit-margin-after": '0.83em',
            "-webkit-margin-start": '0px',
            "-webkit-margin-end": '0px',
            "font-weight": 'bold',
            position: 'relative',
        });
        var $useritems_table = $('<table id="dcce_colorItems_config"/>').appendTo($clrconfig);
        $useritems_table.css({
            width: '100%',
            border: 'solid 1px white',
            margin: '5px 0',
            "font-size": '15px',
        });
        //Ligne d'en-têtes
        $useritems_table.append($('<thead><tr><th>Personnage</th><th>Couleur</th><th></th></tr></thead>'));
        var $useritems_tbody = $('<tbody />').appendTo($useritems_table);
        var localValues = GM_listValues();
        for (let j = 0; j < localValues.length; j++) {
            if(localValues[j].includes("dcce_ctb_")) {
                var type_id = localValues[j];
                var $row = $('<tr />').appendTo($useritems_tbody);
                $row.addClass("loaded_item");
                $row.attr('id', type_id);
                var item_perso = GM_getValue("dcce_name_" + localValues[j].slice(9));
                var $perso_td = $('<td class="perso_td" style="text-align:left;width:60%;font-size: 20px;padding-left: 5px;">' + item_perso + '</td>').appendTo($row);
                var item_couleur = '<input class="dcce_colortagbox" type="color" id="' + localValues[j] + '" value="' + GM_getValue(localValues[j]) + '"/>';
                var $couleur_td = $('<td class="couleur_td" style="/*padding-left:10px;*/width:20%;text-align:center">' + item_couleur + '</td>').appendTo($row);
                $couleur_td.data('type_ID', type_id);
                //Ajout d'un bouton pour la suppression
                var $last_td = $('<td style="width:20%"/>').appendTo($row);
                var $itemdel_btn = $('<div class="btnTxt" />').appendTo($last_td);
                $itemdel_btn.data('type_ID', type_id);
                $itemdel_btn.text('Reset');
                $itemdel_btn.css({
                    height: '15px',
                    margin: '5px 15px',
                });
                //Handler clic sur le bouton "Supprimer" d'une ligne du tableau
                $itemdel_btn.click(function () {
                    if ($(this).data('confirmed')) {
                        //Suppression des valeurs de la ligne
                        var type_id = $(this).data('type_ID');
                        GM_deleteValue("dcce_ctb_" + type_id.slice(9));
                        chatChangeColor(type_id);
                        $(this).parent().parent().children().children("input").val(DEFAULT_CHAT_COLOR); //Reset du color picker
                        //Remise à zéro du bouton
                        $(this).text('Reset');
                        $(this).data('confirmed', false);
                    } else {
                        //Besoin d'un second clic, pour confirmation
                        $(this).text('Confirmer');
                        $(this).data('confirmed', true);
                    }
                });
                $itemdel_btn.mouseleave(function () {
                    //Annulation de la confirmation de suppression
                    $(this).text('Reset');
                    $(this).data('confirmed', false);
                });
                $couleur_td.children("input").change(function() {
                    GM_setValue($couleur_td.data('type_ID'), $(this).val());
                    chatChangeColor($couleur_td.data('type_ID').slice(9));
                });
            }
        }

        //Css des éléments du tableau
        $useritems_table.find('td').css({
            border: '1px solid white',
            height: '15px'
        });


        //----------------------------------------
        //Configuration de MatriceRP
        //----------------------------------------
        var $mrpconfig = $('<div />').appendTo($config_interface);
        var $mrpconfig_title = $('<h2 class="couleur4 configTitre" />').appendTo($clrconfig);
        $mrpconfig_title.text('Gestion des commandes');
        $mrpconfig_title.css({
            "margin-bottom": '5px',
            "border-bottom": '1px solid',
            display: 'block',
            "font-size": '17px',
            "-webkit-margin-before": '0.83em',
            "-webkit-margin-after": '0.83em',
            "-webkit-margin-start": '0px',
            "-webkit-margin-end": '0px',
            "font-weight": 'bold',
            position: 'relative',
        });
        var $commands_table = $('<table id="dcce_commands_config"/>').appendTo($clrconfig);
        $commands_table.css({
            width: '100%',
            border: 'solid 1px white',
            margin: '5px 0',
            "font-size": '15px',
        });



        //Ligne d'en-têtes
        $commands_table.append($('<thead><tr><th>Alias</th><th>Nom</th><th>Couleur</th><th>Gras</th><th>Action</th></tr></thead>'));
        var $commands_tbody = $('<tbody />').appendTo($commands_table);
        var cmdTotal = 0;

        function updateCommand(id) {
            //console.log("Update on line: " + id);
            mrpCommands[id].alias = $("#mrp_alias_input_" + id).val();
            mrpCommands[id].name = $("#mrp_name_input_" + id).val();
            mrpCommands[id].color = $("#mrp_color_input_" + id).val();
            mrpCommands[id].bold = $("#mrp_bold_input_" + id).attr("checked") == "checked" ? true : false;
            mrpCommands[id].rp = $("#mrp_rp_input_" + id).attr("checked") == "checked" ? true : false;
            //console.log(mrpCommands[id]);
            GM_setValue("DCCE_MRP", JSON.stringify(mrpCommands));
        }

        //Fonction pour générer une ligne au tableau
        //cmd {alias:"str", name:"str", color:"#008000", bold:false, rp:true}
        function drawCommand(cmd, id) {
            let $row = $('<tr id="cmd_row_' + id + '"/>').appendTo($commands_tbody);
            $row.addClass("loaded_item");

            let $alias_td = $('<td class="alias_td" style="text-align:left;font-size: 20px;padding-left: 5px;"><input style="background-color: antiquewhite" type="text" id="mrp_alias_input_' + id + '" value="' + cmd.alias + '"/></td>').appendTo($row);
            let $name_td = $('<td class="name_td" style="text-align:left;font-size: 20px;padding-left: 5px;"><input style="background-color: antiquewhite" type="text" id="mrp_name_input_' + id + '" value="' + cmd.name + '"/></td>').appendTo($row);
            let $color_td = $('<td class="color_td" style="text-align:center;font-size: 20px;"><input type="color" id="mrp_color_input_' + id + '" value="' + cmd.color + '"/></td>').appendTo($row);
            let $bold_td = $('<td class="bold_td" style="text-align:center;font-size: 20px;"><input type="checkbox" id="mrp_bold_input_' + id + '"' + (cmd.bold ? ' checked' : '') + '/></td>').appendTo($row);
            let $rp_td = $('<td class="rp_td" style="text-align:center;font-size: 20px;"><input type="checkbox" id="mrp_rp_input_' + id + '"' + (cmd.rp ? ' checked' : '') + '/></td>').appendTo($row);

            $alias_td.children("input").keyup(function(){updateCommand(id)});
            $name_td.children("input").keyup(function(){updateCommand(id)});
            $color_td.children("input").change(function(){updateCommand(id)});
            $bold_td.children("input").change(function(){updateCommand(id)});
            $rp_td.children("input").change(function(){updateCommand(id)});
        }

        for (let j = 0; j < mrpCommands.length; j++) {
            $commands_tbody.append(drawCommand(mrpCommands[j], j));
        }

        var $mrp_container = $('<div style="text-align: center"></div>').appendTo($clrconfig);
        var $mrp_remove = $('<input style="color: red; background-color: antiquewhite; width: 45%; margin: 5px" type="button" id="mrp_remove" value="Supprimer une ligne" />').click(function(){
            if (mrpCommands.length > 3) {
                mrpCommands.pop();
                GM_setValue("DCCE_MRP", JSON.stringify(mrpCommands));
                $("#cmd_row_" + mrpCommands.length).remove();
            }
        }).appendTo($mrp_container);

        var $mrp_add = $('<input style="color: green; background-color: antiquewhite; width: 45%; margin: 5px" type="button" id="mrp_add" value="Ajouter une ligne" />').click(function(){
            drawCommand({alias:"", name:"", color:"#FFFFFF", bold:false, rp:false}, mrpCommands.length);
            stylizeTableCells();
            mrpCommands.push({alias:"", name:"", color:"#FFFFFF", bold:false, rp:false});
            GM_setValue("DCCE_MRP", JSON.stringify(mrpCommands));
        }).appendTo($mrp_container);

        //Css des éléments du tableau
        function stylizeTableCells() {
            $commands_table.find('td').css({
                border: '1px solid white',
                height: '15px'
            });
        }
        stylizeTableCells();
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //FIN Constructeur de fenêtre de configuration
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    //---------------------------------------------------
    //Ajout d'un item au menu bandeau "Paramètres" de DC
    //---------------------------------------------------
    var $params_menu = $('.menus > .parametres > ul');
    var $dcce_config = $('<li />').appendTo($params_menu);
    $dcce_config.text("Configuration du Chat");
    $dcce_config.addClass('link couleur2 separator');

    $dcce_config.click(function () {
        //Fermeture des autres instances de paramétrage ouvertes
        engine.closeDataBox('dcce_configwindow');
        var $config_window = new DCCE_ConfigurationWindow();
        $databox.append($config_window.$window);
    });

    //**********************************************
    // FIN INTERFACE DE CONFIGURATION UTILISATEUR
    //**********************************************

    //**********************************************
    // DEBUT MAIN
    //**********************************************

    //Compte les charactères façon DreadCast: 7 bits = 1 char, 8-11 bits = 2 chars, 12-16 bits = 3 chars
    function chatCharCount(str) {
        if (!str) return 0;
        return str.split("").map(a => a.charCodeAt(0).toString(2).length >= 12 ? 3 : a.charCodeAt(0).toString(2).length >= 8 ? 2 : 1).reduce((a, b) => a + b);
    }

    //ALERTCHAT, Script d'Odul
    (function() {
        var imgUnmute = 'url(https://i.imgur.com/uvIB44X.png)';
        var imgMute = 'url(https://i.imgur.com/8oV9IrJ.png)';

        var audio = document.createElement('audio');
        audio.id='checkchat';
        document.body.appendChild(audio);
        $('#checkchat').attr('src', alertChatAudioURL);
        $("#checkchat").css("display","none");

        $('<li class="separator"></li>').prependTo($('#bandeau ul.menus'));
        var End = $('<li>').prependTo($('#bandeau ul.menus'));
        End.attr("id", 'endAudiocheckchat');
        End.css({
            left: '5px',
            height: '30px',
            "z-index": '999999',
            "background-size": '29px 15px',
            "background-repeat": 'no-repeat',
            "background-position-y": '4px',
            color: '#999'
        });
        End.text("AC").addClass('link');
        End.hover(
            function(){
                $(this).css("color", "#0073d5");
            },
            function(){
                var colorAC = (activateAlertChat) ? "#999" : "#D00000";
                $(this).css("color", colorAC);
            }
        );
        End.click(function() {
            activateAlertChat = (activateAlertChat) ? false : true;
            GM_setValue("DCCE_activateAlertChat", activateAlertChat);
            document.getElementById('endAudiocheckchat').style.backgroundImage = (activateAlertChat) ? imgUnmute : imgMute;
            document.getElementById('checkchat').volume = (activateAlertChat) ? alertVolume : 0;
            var colorAC = (activateAlertChat) ? "#999" : "#D00000";
            End.css("color", colorAC);
        });

        //Initialisation depuis le stockage local
        document.getElementById('endAudiocheckchat').style.backgroundImage = (activateAlertChat) ? imgUnmute : imgMute;
        document.getElementById('checkchat').volume = (activateAlertChat) ? alertVolume : 0;
        var colorAC = (activateAlertChat) ? "#999" : "#D00000";
        End.css("color", colorAC);
    })();



    //MatriceRP
    //Par Isilin

    const FORBIDDEN_ALIASES = ["me", "y", "ye", "yme", "w", "we", "wme", "roll", ""];

    function tagMessage(inputStr) {

        let message = inputStr;

        let aliasUsed = inputStr.split(" ")[0].substr(1);

        if (message[0] !== "/") return message; //Vérifier avant tout que l'utilisateur veut rentrer une commande...

        if (FORBIDDEN_ALIASES.indexOf(aliasUsed) > -1) return message; //On ne modifie pas le message si l'alias utilisé est une commande du jeu ou un alias invalide

        let command = mrpCommands.find(cmd => cmd.alias.toLowerCase() === aliasUsed.toLowerCase()); //On récupère les paramètres de la commande à partir de son alias (vérification non sensible à la casse)

        if (command === undefined) return message; //On ne modifie pas le message si l'alias utilisé n'est pas défini

        if (message.length <= command.alias.length + 2) return ""; //On vide le message si un alias est utilisé seul ou avec un espace sans texte

        message = (command.rp ? "/me " : "")
        //+ "[b][c=" + command.color.substr(1) + "]{" + command.name + "}[/c][/b]"
            + "[b]{" + command.name + "}[/b]"
            + (command.bold ? "[b]" : "")
            + "[c=" + command.color.substr(1) + "]" + message.substr(command.alias.length + 1) + "[/c]"
            + (command.bold ? "[/b]" : "");

        return message;
    }



    //AmeliorationTchat2.0
    //Par Odul
    var $chatInput = $("#chatForm .text_chat");

    function beautifyMessage(inputStr) {

        let message = inputStr;

        if (/^\/me/i.test(message)) {
            message = "/me" + message.substr(3); //Transforme /Me en /me pour que la casse soit respectée et que le chat ressorte bien une emote.
            message = message.replace(/"([^\"]+)"/gi, "[c=FFFFFF]$1[/c]");
        } else {
            message = message.replace(/\*([^\*]+)\*/gi, "[c=58DCF9][i]$1[/i][/c]");
        }
        return message;
    }

    //Override honteux du code de base de DC
    MenuChat.prototype.send = function() {
        if (nav.getChat().kw("chatForm")) {
            if ("" == $("#chatForm input.text_chat").val())
                return !1;
            this.checkConversation();
            if ($("#chatForm input.text_chat").val().split("").map(a => a.charCodeAt(0).toString(2).length >= 12 ? 3 : a.charCodeAt(0).toString(2).length >= 8 ? 2 : 1).reduce((a, b) => a + b) >= (0 == this.currentMode ? 199 : 195)) return !1; //La seule chose ajoutée par l'override: refuser d'envoyer le message si trop long! :)
            1 == this.currentMode ? $("#chatForm input.text_chat").val("/we " + $("#chatForm input.text_chat").val()) : 2 == this.currentMode && $("#chatForm input.text_chat").val("/ye " + $("#chatForm input.text_chat").val());
            engine.submitForm("Menu/Chat/default=Send&etat=2&room=" + this.getRoom(!0), "chatForm", this.update, !0),
                6 == evolution.currentPoint && evolution.unlock(3)
        }
    }


    //Applique les scripts AmeliorationTchat2.0 et MatriceRP au moment de poster le message
    var isMessageLocked = false;
    function ameliorInput() {
        if (!isMessageLocked) {
            isMessageLocked = true;

            let ogMessage = $chatInput.val(); //Message avant modifications
            let finalMessage = tagMessage(beautifyMessage(ogMessage)); //Message balisé, prêt à envoyer
            $chatInput.val(finalMessage);

            //Si le message était trop long pour être envoyé, on attend le refus de la fonction overridée, puis on débalise le message
            let ml = $("#chatForm > .text_mode").text() == "N" ? 199 : 195;
            if (chatCharCount(finalMessage) >= ml) {
                setTimeout(function(){
                    $chatInput.val(ogMessage);
                    isMessageLocked = false;
                }, 2);
            } else {
                setTimeout(function(){ isMessageLocked = false; }, 2);
            }
        }
    }

    function verifyKeyPressed(e) {
        if (e.keyCode==13) {
            ameliorInput();
        }
    }

    $("#chatForm .text_chat").keypress(verifyKeyPressed);
    $("#chatForm .text_valider").click(ameliorInput);


    //HIGHLIGHT CHAT LIMIT
    //Code de Ladoria, modifications de débugging et implémentation au script.
    function HighlightChatLimit() {

        var limitColor = 'red', //Couleurs pour chaque pallier de longueur
            alertColor = 'orange',
            warningColor = 'yellow',
            limitLength = 199, //Palliers de longueur
            alertLength = 170,
            warningLength = 135;

        var c1 = $("#chatForm").css('border-color'); //CSS original de la box
        var c2 = $("#chatForm .text_mode").css('border-color');
        var c3 = $("#chatForm .text_valider").css('background-color');
        var c4 = $("#chatForm").css('box-shadow');

        var animateChatInput = function(e) {
            var processedInput = tagMessage(beautifyMessage($("#chatForm .text_chat").val()));
            var len = chatCharCount(processedInput);
            let maxLength = $("#chatForm > .text_mode").text() == "N" ? 199 : 195; //Longueur max = 199, sauf si le chat est en mode chuchotement ou cri
            if (len >= maxLength) {
                highlight(limitColor); // limit reached
                $("#chatForm .text_chat").attr("maxlength", $("#chatForm .text_chat").val().length); //On bloque pour que le joueur arrête d'écrire
            }
            else if (len >= alertLength) {
                highlight(alertColor); // approach limit
                $("#chatForm .text_chat").attr("maxlength", maxLength);
            }
            else if (len >= warningLength) {
                highlight(warningColor); // first warning
                $("#chatForm .text_chat").attr("maxlength", maxLength);
            }
            else {
                originalHighlight(c1, c2, c3, c4); // far away from limit
                $("#chatForm .text_chat").attr("maxlength", maxLength);
            }
        };

        function originalHighlight(formBorderColor, modeBorderColor, bgColor, bsSettings) {
            $("#chatForm").css('border-color', formBorderColor);
            $("#chatForm .text_mode").css('border-color', modeBorderColor);
            $("#chatForm .text_valider").css('background-color', bgColor);

            $("#chatForm").css('box-shadow', bsSettings);
        }

        function highlight(color) {
            originalHighlight(color, color, color, '0px 0px 3px 2px ' + color);
        }

        $("#chatForm .text_chat").attr("maxlength", "199");
        $("#chatForm .text_chat").keyup(animateChatInput);
        $("#chatForm > .text_mode").click(animateChatInput);

    }
    HighlightChatLimit(); //Exécution du script de limite de chat.


    //SCROLLING
    scrollChat(); //Place le chat au chargement du jeu.
    $newMessageAlert.click(scrollChat); //Scroll au clic du bouton d'alerte de nouveau message.
    $(".text_chat").keydown(function(key){ //Si en préférence, scroller le chat automatiquement quand on commence à écrire.
        if(typePredict && key != 13) scrollChat(); //Ne pas le faire avec la touche entrée car déjà fait quand la ligne apparaît dans le chat.
    });
    var lastChat = $('#chatContent').text(); //Sert à comparer pour voir si le chat a changé.
    setInterval(function(){ //Scrolle ou alerte à la réception d'un message.
        if(lastChat != $('#chatContent').text()) {
            lastChat = $('#chatContent').text(); //Actualiser la copie local du chat.

            document.getElementById('checkchat').play();

            if(autoScroll) {
                scrollChat();
            }
            else if($("#chatContent .link.linkable:last").text() !== $("#txt_pseudo").text()) {
                $newMessageAlert.stop().fadeIn(500); //Afficher uniquement le bouton si l'utilisateur ne vient pas de poster.
            }
        }
    }, 1000);

    //COLOR TAG
    $(document).on("click", "span.perso.link", function(){
        var idPerso = $(this).attr('id').slice(9);
        $(document).one("ajaxSuccess", {idPerso: idPerso}, function(e, xhr, settings){ //Permet d'attendre le chargement de la fenêtre, one() pour éviter un duplicata.
            console.log(xhr);
            console.log(settings);
            var idctb = '#colorTagBox_' + e.data.idPerso;
            var colorTagBox = $('<div style="margin-top: 15px; text-align: center;">' + 'Couleur chat: ' +
                                '<input type="color" id="' + idctb.slice(1) + '" value="' + DEFAULT_CHAT_COLOR + '"/>' +
                                '<input type="button" id="' + idctb.slice(1) + '_reset" value="Reset" style="background-color: buttonface; margin-left: 5px; height: 16px; font-size: 12px;"/>' +
                                '</div>').appendTo($("#ib_persoBox_" + e.data.idPerso + " #char_inspect_faketooltip .content"));

            GM_setValue("dcce_name_" + e.data.idPerso, $("#ib_persoBox_" + e.data.idPerso + " .titreinfo").contents().filter(function(){
                return this.nodeType == 3;
            })[0].nodeValue); //Récupère le nom du personnage, utilisé dans le nommage de la classe du pseudo.

            if(GM_getValue("dcce_ctb_" + e.data.idPerso) !== undefined) { //Récupère et applique au bouton couleur la couleur enregistrée
                $(idctb).val((GM_getValue("dcce_ctb_" + e.data.idPerso)));
            }
            $(idctb).on("change", {idPerso: e.data.idPerso}, function(e) { //Enregistre en mémoire la nouvelle couleur
                GM_setValue("dcce_ctb_" + e.data.idPerso, $(this).val());
                chatChangeColor(e.data.idPerso);
            });
            $(idctb + "_reset").on("click", {idPerso: e.data.idPerso}, function(e) { //Reset de la couleur
                GM_deleteValue("dcce_ctb_" + e.data.idPerso);
                $(idctb).val(DEFAULT_CHAT_COLOR);
                chatChangeColor(e.data.idPerso);
            });
        });

    });

    //OVERWRITE pour que seul DCCE gère le scroll du chat
    MenuChat.prototype.update = function(a) {
        if (!xml_result(a))
            return !1;
        if ($(a).find("cydive").length)
            return cydiving.readChat(a),
                !0;
        $(a).find("chat").each(function() {
            if ($(this).attr("key"))
                $("#" + $(this).attr("key")).html($(this).xml());
            else {
                var a = $.trim($(this).find("#chatContent").xml());
                if (a && ($("#zone_droite #zone_chat #chatContent, #chat_preview .chatContent").append(a),
                          //$("#chatContent").scrollTop(jQuery("#chatContent").innerHeight()), //RETRAIT DE CETTE LIGNE
                          Tutoriel.instance.tutoData.actif && !Tutoriel.instance.isTutoCompleted(Tutoriel.EVENT_CHAT) && $(this).find("span.link.linkable").length)) {
                    var b = $(this).find("span.link.linkable").attr("alt");
                    engine.getIdPersonnage() != b && $(window).trigger(Tutoriel.EVENT_CHAT)
                }
            }
        }),
            $(a).find("connectes").length && $("#zone_chat .connectes").html($(a).find("connectes").xml());
        $("#zone_chat").height(),
            $("#zone_chat .connectes").height(),
            $("#zone_chat .chatForm").height(),
            $("#zone_chat").height(),
            $("#zone_chat .chatForm").height();
        $(a).find("chat").attr("time") && nav.getChat().setTimeCurrentRoom($(a).find("chat").attr("time")),
            $("#zone_chat .loader").hide()
    }

    console.log("DCCE activé.");
});