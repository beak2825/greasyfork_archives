// ==UserScript==
// @name         Com'back
// @namespace    https://greasyfork.org/fr/scripts/17200-com-back
// @version      2.1.5
// @description  Ajoute un choix pour le type (écrit, audio, vidéo...) de message envoyé.
// @author       DarKobalt, Naugriim(♥), Solon, Harlinde
// @match        https://www.dreadcast.net/Main
// @match        https://www.dreadcast.eu/Main
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @license      http://creativecommons.org/licenses/by-nc-nd/4.0/
// @downloadURL https://update.greasyfork.org/scripts/375428/Com%27back.user.js
// @updateURL https://update.greasyfork.org/scripts/375428/Com%27back.meta.js
// ==/UserScript==

//Un jour, j'aurai le courage pour un vrai refactoring. ;_;

//**********************************************
// PARAMETRAGE (EDITION A VOTRE PROPRE RISQUE, UTILISEZ PLUTÔT LE MENU D'OPTIONS!)
//**********************************************

//(A) Valeurs par défaut
//======================
//Dictionnaire des paramètres
var params = {};
//Icônes disponibles
params.icons = {
    CLIP: "📎",
    ACKN: "📨",
    UPLD: "📤",
    DWLD: "🔃",
    FILE: "📄",
    PLAY: "▶️",
    WRIT: "📝",
    AUDI: "🔊",
    VIDE: "🎥",
    DECK: "💻",
    NORP: "✖",
    ININ: "【",
    INOU: "】",
};
//Textes informatifs.
params.infotexts = {
    CLIP: "Pièce jointe",
    ACKN: "Accusé de réception",
    UPLD: "Envoi de données en cours",
    DWLD: "Chargement en cours, veuillez patienter",
    FILE: "Fichier",
    PLAY: "Lecture",
    WRIT: "Message écrit",
    AUDI: "Message audio",
    VIDE: "Message vidéo",
    DECK: "Depuis un deck",
    NORP: "Message HRP",
};
//Boutons disponibles :
params.actionList = ['CLIP', 'ACKN', 'UPLD', 'DWLD', 'FILE', 'PLAY'];
//Items de la liste déroulante :
params.typeList = ['WRIT', 'AUDI', 'VIDE', 'DECK', 'NORP'];
//Valeur fixée pour le menu déroulant
params.list_defaultID = 'NONE';
//Choix entre valeur fixée ou dernière valeur pour le menu déroulant (true = valeur fixée, false = dernière valeur choisie)
params.b_alwaysDefault = false;
//Dernière valeur choisie
params.list_lastID = params.list_defaultID;
//Nombre de boutons par face de carrousel
params.carousel_facesize = 6;
//Nombre d'items "utilisateur"
params.user_typeList = [];
params.user_itemsNumber = 5; //maximum
for (var i = 0; i < params.user_itemsNumber; i++) {
    var user_item = "list_userItem_" + i.toString();
    params.user_typeList.push(user_item);
}
//Nombre de boutons "utilisateur"
params.user_actionList = [];
params.user_actionsNumber = 6; //maximum
for (var i = 0; i < params.user_actionsNumber; i++) {
    var user_action = "list_userAction_" + i.toString();
    params.user_actionList.push(user_action);
}
//Couleur du texte placé entre "*".
params.emoteColor = "#58dcf9";
//(B) Sauvegarde des paramètres par défaut
//========================================
var default_params = $.extend(true, {}, params); //copie profonde

//(C) Récupération locale de paramètres
//=================================
//Valeur fixée pour le menu déroulant
if (GM_getValue("list_defaultID") !== undefined) {
    params.list_defaultID = GM_getValue("list_defaultID");
}
//Choix entre valeur fixée ou dernière valeur pour le menu déroulant
if (GM_getValue("b_alwaysDefault") !== undefined) {
    params.b_alwaysDefault = GM_getValue("b_alwaysDefault");
}
//Dernière valeur choisie dans le menu déroulant
if (GM_getValue("list_lastID") !== undefined) {
    params.list_lastID = GM_getValue("list_lastID");
}
//Items "utilisateur"
for (var i = 0; i < params.user_itemsNumber; i++) {
    var user_item = params.user_typeList[i];
    if (GM_getValue(user_item) !== undefined) { //l'user_item existe en mémoire
        var user_item_icon = user_item + '_icon';
        var user_item_text = user_item + '_text';
        if (GM_getValue(user_item_icon) !== undefined) { //récupération de l'icône
            params.icons[user_item] = GM_getValue(user_item_icon);
        }
        if (GM_getValue(user_item_text) !== undefined) { //récupération du texte
            params.infotexts[user_item] = GM_getValue(user_item_text);
        }
        //Ajout aux types de messages
        params.typeList.push(user_item);
    }
}
//Boutons "utilisateur"
for (var i = 0; i < params.user_actionsNumber; i++) {
    var user_action = params.user_actionList[i];
    if (GM_getValue(user_action) !== undefined) { //l'user_action existe en mémoire
        var user_action_icon = user_action + '_icon';
        var user_action_text = user_action + '_text';
        if (GM_getValue(user_action_icon) !== undefined) { //récupération de l'icône
            params.icons[user_action] = GM_getValue(user_action_icon);
        }
        if (GM_getValue(user_action_text) !== undefined) { //récupération du texte
            params.infotexts[user_action] = GM_getValue(user_action_text);
        }
        //Ajout aux types d'actions
        params.actionList.push(user_action);
    }
}
//Nombre de faces de carrousel à créer
params.carousel_facesnumber = carouselFacesNumber();
//Couleur du texte placé entre "*".
if (GM_getValue("emoteColor") !== undefined) {
    params.emoteColor = GM_getValue("emoteColor");
}
//**********************************************
//FIN PARAMETRAGE
//**********************************************

//**********************************************
//INTERFACE DE CONFIGURATION UTILISATEUR
//**********************************************
var $databox = $('#zone_dataBox');
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Constructeur de fenêtre de configuration
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var DCCB_ConfigurationWindow = function () {
    var window_width = '560px';
    var window_height = '450px';
    var $config_window = $('<div id="dccb_configwindow" onclick="engine.switchDataBox(this)"/>');
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
    var $config_head = $('<div class="head ui-draggable-handle" ondblclick="$(\'#dccb_configwindow\').toggleClass(\'reduced\');" />').appendTo($config_window);
    $('<div title="Fermer la fenêtre (Q)" class="info1 link close" onclick="engine.closeDataBox($(this).parent().parent().attr(\'id\'));" />').appendTo($config_head);
    $('<div title="Reduire/Agrandir la fenêtre" class="info1 link reduce" onclick="$(\'#dccb_configwindow\').toggleClass(\'reduced\');" />').appendTo($config_head);
    $('<div class="title">Configuration DC Com\'Back</div>').appendTo($config_head);
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
    //Bandeau incitant à fermer les messages ouverts
    //----------------------------------------
    var $warning_banner = $('<div />').appendTo($config_interface);
    $warning_banner.text("ATTENTION : Veillez à ne pas modifier les paramètres de Com'Back si des messages sont actuellement ouverts.");
    $warning_banner.css({
        color: '#f10a18',
        "text-align": 'center',
        magin: '20px 0',
        border: '1px solid #f10a18'
    });
    //----------------------------------------
    //Configuration de l'interpréation du contenu des messages
    //----------------------------------------
    var $bodyconfig = $('<div />').appendTo($config_interface);
    var $bodyconfig_title = $('<h2 class="couleur4" />').appendTo($bodyconfig);
    $bodyconfig_title.text('Corps de message');
    $bodyconfig_title.css({
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
    var $bodyconfig_emote_color = $('<div class="ligne"/>').appendTo($bodyconfig);
    $bodyconfig_emote_color.text('Couleur d\'emote (texte entre *...*) : ');
    $bodyconfig_emote_color.css({
        display: 'inline-block',
    });
    var $bodyconfig_emote_color_picker = $('<input type="color" />').appendTo($bodyconfig_emote_color);
    $bodyconfig_emote_color_picker.val(params.emoteColor);
    $bodyconfig_emote_color_picker.css({
        border: '0px',
        width: "150px",
    });
    $bodyconfig_emote_color_picker.on('input', function () {
        var color = $(this).val();
        params.emoteColor = color;
        GM_setValue("emoteColor", color);
    });
    //----------------------------------------
    //Configuration du menu déroulant
    //----------------------------------------
    var $listconfig_title = $('<h2 class="couleur4" />').appendTo($config_interface);
    $listconfig_title.text('Types de message personalisés (menu déroulant)');
    $listconfig_title.css({
        "margin-bottom": '5px',
        "border-bottom": '1px solid',
        display: 'block',
        "font-size": '17px',
        "-webkit-margin-before": '0.83em',
        "-webkit-margin-after": '0.83em',
        "-webkit-margin-start": '0px',
        "-webkit-margin-end": '0px',
        "font-weight": 'bold',
    });
    //Choix de la valeur par défaut à l'ouverture d'un message ou d'un fil de discussion
    var $listconfig_default = $('<div class="ligne"/>').appendTo($config_interface);
    $listconfig_default.text('Valeur par défaut : ');
    $listconfig_default.css({
        display: 'inline-block',
        "margin-bottom": '15px',
    });
    //Bouton-radio du choix "Dernière valeur utilisée"
    var $listconfig_default_lastone = $('<input type="radio" name="typeListDefault" value="false">Dernière utilisée</input>').appendTo($listconfig_default);
    $listconfig_default_lastone.css({
        margin: '0 5px',
    });
    $listconfig_default_lastone.attr('checked', !params.b_alwaysDefault);
    //Bouton-radio du choix "Valeur par défaut fixée"
    var $listconfig_default_value = $('<input type="radio" name="typeListDefault" value="true">Toujours :</input>').appendTo($listconfig_default);
    $listconfig_default_value.css({
        margin: '0px 5px 0 25px',
        "padding-left": '20px',
    });
    $listconfig_default_value.attr('checked', params.b_alwaysDefault);
    //Menu déroulant activé si besoin d'un valeur par défaut fixée
    var $listconfig_default_picker = $('<select />').appendTo($listconfig_default);
    if (params.b_alwaysDefault) {
        $listconfig_default_picker.removeAttr('disabled');
    } else {
        $listconfig_default_picker.attr('disabled', 'disabled');
    }
    $listconfig_default_picker.css({
        "background-color": '#FFFFFF',
        "-webkit-box-shadow": '0 0 1px 0px #329bc2',
        "border-color": '#207695',
        "border-style": 'solid',
        "border-width": 'thin',
        width: '175px',
        margin: '0 5px',
        "white-space": 'nowrap',
        overflow: 'hidden',
        "text-overflow": 'ellipsis',
        "-o-text-overflow": 'ellipsis',
        "-ms-text-overflow": 'ellipsis',
        "-web-text-overflow": 'ellipsis',
        "font-family": "Arial,Segoe UI Symbol,Unifont,Unifont Upper CSUR,sans-serif",
    });
    //Gestion du choix d'une valeur dans le menu déroulant
    $listconfig_default_picker.change(function () {
        //Changement de la valeur par défaut de la liste déroulante
        params.list_defaultID = $(this).val();
        //Tentative de sauvegarde locale
        GM_setValue("list_defaultID", params.list_defaultID);
    });
    //Ajout d'un item vide
    $listconfig_default_picker.append('<option value="NONE"></option>');
    //Ajout des items contenus dans typeList
    for (var i = 0; i < params.typeList.length; i++) {
        var type_id = params.typeList[i];
        var $option = $('<option id="opt_' + type_id + '" />').appendTo($listconfig_default_picker);
        var item_title = params.icons[type_id] + ' - ' + params.infotexts[type_id];
        $option.val(type_id).html(item_title);
    }
    //Sélection du type actuellement par défaut
    var type_index = params.list_defaultID;
    $listconfig_default_picker.val(type_index);
    //Gestion du clic sur le bouton-radio "Toujours"
    $listconfig_default_value.change(function () {
        if ($(this).attr('checked')) { //Utilisation de la valeur par défaut
            params.b_alwaysDefault = true;
            $listconfig_default_picker.removeAttr('disabled');
            GM_setValue("b_alwaysDefault", params.b_alwaysDefault);
        }
    });
    //Gestion du clic sur le bouton-radio "Dernière utilisée"
    $listconfig_default_lastone.change(function () {
        if ($(this).attr('checked')) { //Utilisateur de la dernière valeur utilisée
            params.b_alwaysDefault = false;
            params.list_defaultID = 'NONE';
            $listconfig_default_picker.attr('disabled', 'disabled');
            GM_setValue("list_defaultID", params.list_defaultID);
            GM_setValue("b_alwaysDefault", params.b_alwaysDefault);
        }
    });
    //Gestion des items "utilisateur"
    var $listconfig_items = $('<div class="ligne"/>').appendTo($config_interface);
    $listconfig_items.text('Items personnalisés : ');
    var $useritems_table = $('<table id="dccb_userItems_config"/>').appendTo($listconfig_items);
    $useritems_table.css({
        width: '100%',
        border: 'solid 1px white',
        margin: '5px 0',
        "font-size": '15px',
    });
    //Ligne d'en-têtes
    $useritems_table.append($('<thead><tr><th>Symbole</th><th>Description</th><th></th></tr></thead>'));
    var $useritems_tbody = $('<tbody />').appendTo($useritems_table);
    for (var i = 0; i < params.user_typeList.length; i++) {
        var type_id = params.user_typeList[i];
        var $row = $('<tr />').appendTo($useritems_tbody);
        $row.addClass("loaded_item");
        $row.attr('id', type_id);
        var item_icon = params.icons[type_id] || "";
        var $icon_td = $('<td class="editable" style="text-align:center;width:10%;font-size: 20px;">' + item_icon + '</td>').appendTo($row);
        $icon_td.data('target_type', 'icon');
        var item_text = params.infotexts[type_id] ||  "";
        var $text_td = $('<td class="editable" style="padding-left:10px;width:70%;">' + item_text + '</td>').appendTo($row);
        $text_td.data('target_type', 'infotext');
        //Ajout d'un bouton pour la supression
        var $last_td = $('<td style="width:20%"/>').appendTo($row);
        var $itemdel_btn = $('<div class="btnTxt" />').appendTo($last_td);
        $itemdel_btn.data('type_ID', type_id);
        $itemdel_btn.text('Supprimer');
        $itemdel_btn.css({
            height: '15px',
            margin: '5px 15px',
        });
        //Handler clic sur le bouton "Supprimer" d'une ligne du tableau
        $itemdel_btn.click(function () {
            if ($(this).data('confirmed')) {
                //Suppression des valeurs de la ligne
                var type_id = $(this).data('type_ID');
                $('#' + type_id + ' > td.editable').text("");
                //Suppression des données "utilisateur"
                //Suppresion en RAM
                var index = params.typeList.indexOf(type_id);
                if (index !== -1) {
                    params.typeList.splice(index, 1);
                }
                delete params.icons[type_id];
                delete params.infotexts[type_id];
                //Suppresion en mémoire locale
                GM_deleteValue(type_id);
                GM_deleteValue(type_id + '_icon');
                GM_deleteValue(type_id + '_text');
                //Suppression dans le menu déroulant de la fenêtre de configuration
                if ($listconfig_default_picker.val() === type_id) { //l'item à supprimer est sélectionné
                    //On sélectionne le type NONE d'office
                    $listconfig_default_picker.val('NONE').trigger('change');
                }
                $('option#opt_' + type_id).remove();
                //Remise à zéro du bouton
                $(this).text('Supprimer');
                $(this).data('confirmed', false);
            } else {
                //Besoin d'un second clic, pour confirmation
                $(this).text('Confirmer');
                $(this).data('confirmed', true);
            }
        });
        $itemdel_btn.mouseleave(function () {
            //Annulation de la confirmation de suppression
            $(this).text('Supprimer');
            $(this).data('confirmed', false);
        });
    }
    //Css des éléments du tableau
    $useritems_table.find('td').css({
        border: '1px solid white',
        height: '15px'
    });
    //Handler double-clic sur une cellule éditable
    $('td.editable', $useritems_table).dblclick(function () {
        var type_id = $(this).parent().attr('id');
        var target_type = $(this).data('target_type');
        editCellContent($(this), function (changes) {
            if (changes) {
                //Sauvegarde en ram et en mémoire locale
                if (target_type === 'icon') {
                    params.icons[type_id] = changes;
                    GM_setValue(type_id + '_icon', changes);
                } else if (target_type === 'infotext') {
                    params.infotexts[type_id] = changes;
                    GM_setValue(type_id + '_text', changes);
                }
                //Ajout à la liste des types disponibles (si non déjà présent)
                var item_title = params.icons[type_id] + ' - ' + params.infotexts[type_id];
                if (params.typeList.indexOf(type_id) === -1) {
                    //Ajout à la liste des types disponibles
                    params.typeList.push(type_id);
                    //Ajout d'un flag en mémoire locale
                    GM_setValue(type_id, true);
                    //Ajout au menu déroulant de la fenêtre de configuration
                    var $option = $('<option id="opt_' + type_id + '"/>').appendTo($listconfig_default_picker);
                    $option.val(type_id).html(item_title);
                } else { //modification dans le menu déroulant si déjà présent
                    var $option = $('option#opt_' + type_id);
                    $option.val(type_id).html(item_title);
                }
            }
        });
    });
    //----------------------------------------
    //Configuration des boutons disponibles
    //----------------------------------------
    var $buttonsconfig_title = $('<h2 class="couleur4" />').appendTo($config_interface);
    $buttonsconfig_title.text('Types d\'indications personalisés (boutons)');
    $buttonsconfig_title.css({
        "margin-bottom": '5px',
        "border-bottom": '1px solid',
        display: 'block',
        "font-size": '17px',
        "-webkit-margin-before": '0.83em',
        "-webkit-margin-after": '0.83em',
        "-webkit-margin-start": '0px',
        "-webkit-margin-end": '0px',
        "font-weight": 'bold',
    });
    //Gestion des boutons "utilisateur"
    var $listconfig_actions = $('<div class="ligne"/>').appendTo($config_interface);
    $listconfig_actions.text('Boutons personnalisés : ');
    var $useractions_table = $('<table id="dccb_userActions_config"/>').appendTo($listconfig_actions);
    $useractions_table.css({
        width: '100%',
        border: 'solid 1px white',
        margin: '5px 0',
        "font-size": '15px',
    });
    //Ligne d'en-têtes
    $useractions_table.append($('<thead><tr><th>Symbole</th><th>Description</th><th></th></tr></thead>'));
    var $useractions_tbody = $('<tbody />').appendTo($useractions_table);
    for (var i = 0; i < params.user_actionList.length; i++) {
        var type_id = params.user_actionList[i];
        var $row = $('<tr />').appendTo($useractions_tbody);
        $row.addClass("loaded_action");
        $row.attr('id', type_id);
        var action_icon = params.icons[type_id] || "";
        var $icon_td = $('<td class="editable" style="text-align:center;width:10%;font-size: 20px;">' + action_icon + '</td>').appendTo($row);
        $icon_td.data('target_type', 'icon');
        var action_text = params.infotexts[type_id] ||  "";
        var $text_td = $('<td class="editable" style="padding-left:10px;width:70%;">' + action_text + '</td>').appendTo($row);
        $text_td.data('target_type', 'infotext');
        //Ajout d'un bouton pour la supression
        var $last_td = $('<td style="width:20%"/>').appendTo($row);
        var $actiondel_btn = $('<div class="btnTxt" />').appendTo($last_td);
        $actiondel_btn.data('type_ID', type_id);
        $actiondel_btn.text('Supprimer');
        $actiondel_btn.css({
            height: '15px',
            margin: '5px 15px',
        });

        //Handler clic sur le bouton "Supprimer" d'une ligne du tableau
        $actiondel_btn.click(function () {
            if ($(this).data('confirmed')) {
                //Suppression des valeurs de la ligne
                var type_id = $(this).data('type_ID');
                $('#' + type_id + ' > td.editable').text("");
                //Suppression des données "utilisateur"
                //Suppresion en RAM
                var index = params.actionList.indexOf(type_id);
                if (index !== -1) {
                    params.actionList.splice(index, 1);
                }
                params.carousel_facesnumber = carouselFacesNumber();
                delete params.icons[type_id];
                delete params.infotexts[type_id];
                //Suppresion en mémoire locale
                GM_deleteValue(type_id);
                GM_deleteValue(type_id + '_icon');
                GM_deleteValue(type_id + '_text');
                //Remise à zéro du bouton
                $(this).text('Supprimer');
                $(this).data('confirmed', false);
            } else {
                //Besoin d'un second clic, pour confirmation
                $(this).text('Confirmer');
                $(this).data('confirmed', true);
            }
        });
        $actiondel_btn.mouseleave(function () {
            //Annulation de la confirmation de suppression
            $(this).text('Supprimer');
            $(this).data('confirmed', false);
        });

    }
    //Css des éléments du tableau
    $useractions_table.find('td').css({
        border: '1px solid white',
        height: '15px'
    });
    //Handler double-clic sur une cellule éditable
    $('td.editable', $useractions_table).dblclick(function () {
        var type_id = $(this).parent().attr('id');
        var target_type = $(this).data('target_type');
        editCellContent($(this), function (changes) {
            if (changes) {
                //Sauvegarde en ram et en mémoire locale
                if (target_type === 'icon') {
                    params.icons[type_id] = changes;
                    GM_setValue(type_id + '_icon', changes);
                } else if (target_type === 'infotext') {
                    params.infotexts[type_id] = changes;
                    GM_setValue(type_id + '_text', changes);
                }
                //Ajout à la liste des actions disponibles (si non déjà présent)
                if (params.actionList.indexOf(type_id) === -1) {
                    //Ajout à la liste des types disponibles
                    params.actionList.push(type_id);
                    params.carousel_facesnumber = carouselFacesNumber();
                    //Ajout d'un flag en mémoire locale
                    GM_setValue(type_id, true);
                }
            }
        });
    });
    //----------------------------------------
    //Bouton de remise à zéro des paramètres
    //----------------------------------------
    var $buttons_div = $('<div />').appendTo($config_interface);
    $buttons_div.css({
        //position: 'absolute',
        width: '100%',
        bottom: '0px',
    });
    var $reinit_btn = $('<div class="btnTxt" />').appendTo($buttons_div);
    $reinit_btn.text('Remettre à zéro');
    $reinit_btn.attr('title','Réinitialisation des variables et fermeture de la fenêtre');
    $reinit_btn.click(function(){
        //Ecrasement des paramètres par les paramètres par défaut
        params = $.extend(true, {}, default_params); 
        //Fermeture forcée de la fenêtre de configuration
        engine.closeDataBox('dccb_configwindow');
        //Suppression des variables enregistrées en mémoire
        var stored_values = GM_listValues();
        for (var i=0;i<stored_values.length;i++){
            GM_deleteValue(stored_values[i]);
        }
    });

    this.$window = $config_window;
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//FIN Constructeur de fenêtre de configuration
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//---------------------------------------------------
//Ajout d'un item au menu bandeau "Paramètres" de DC
//---------------------------------------------------
var $params_menu = $('.menus > .parametres > ul');
var $dccb_config = $('<li />').appendTo($params_menu);
$dccb_config.text("Configuration Com'Back");
$dccb_config.addClass('link couleur2 separator');

$dccb_config.click(function () {
    //Fermeture des autres instances de paramétrage ouvertes
    engine.closeDataBox('dccb_configwindow');
    var $config_window = new DCCB_ConfigurationWindow();
    $databox.append($config_window.$window);
});

//**********************************************
// FIN INTERFACE DE CONFIGURATION UTILISATEUR
//**********************************************

//**********************************************
// FONCTIONS UTILITAIRES
//**********************************************

//Calcul du nombre de faces de carrousel
function carouselFacesNumber() {
    var integer_part = Math.floor(params.actionList.length / params.carousel_facesize);
    var modulo_part = params.actionList.length % params.carousel_facesize;
    if (modulo_part > 0) {
        return integer_part + 1;
    }
    return integer_part;
}

//Calcul de l'index de rattachement d'un bouton au carousel
function carouselDedicatedFaceIdx(btn_idx) {
    return Math.floor(btn_idx / params.carousel_facesize);
}

//Obtention de la longueur d'un texte en pixels
function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}

//Mise en forme |n * \n|[icône + texte]|n * \n|
function makeBanner(CR_before, id, CR_after, isHeader) {
    var banner = params.icons.ININ + ' ' + params.icons[id] + ' - ' + params.infotexts[id] + ' ' + params.icons.INOU;
    if (!isHeader) return Array(CR_before + 1).join("\n") + banner + Array(CR_after + 1).join("\n"); //Si ce n'est pas un en-tête, on ne se préoccupe pas de centrer le texte et on applique directement les retours à la ligne.
    var bannerWidth = Math.round(getTextWidth(banner, "12px Trebuchet MS")); //Largeur de la bannière
    var spaceWidth = Math.round(getTextWidth(" ", "12px Trebuchet MS")); //Largeur d'un espace insécable (alt+255, différent de l'espace normal)
    var windowsWidth = 300; //Largeur de la fenêtre à l'endroit de l'en-tête dans laquelle on peut écrire (avec avatar et marges soustraits)
    var nbrSpace = Math.floor(((windowsWidth - bannerWidth) / 2) / spaceWidth); //Déduction du nombre d'espaces à ajouter
    var space = " ";
    return Array(CR_before + 1).join("\n") + space.repeat(nbrSpace) + banner + Array(CR_after + 1).join("\n");
}

//Troncature de chaînes de caractères
function truncateString(string, nb_char) {
    return $.trim(string).substring(0, nb_char).split(" ").slice(0, -1).join(" ") + "...";
}

//Vérification des données, actuellement désactivé
function checkData() {
    /*if (params.list_defaultID === undefined) return false;
    if (params.list_lastID === undefined) return false;
    if (params.b_alwaysDefault === undefined) return false;
    if (params.icons === undefined) return false;
    if (params.infotexts === undefined) return false;
    for (var i = 0; i < params.actionList.length; i++) {
        if (params.icons[params.actionList[i]] === undefined) return false;
        if (params.infotexts[params.actionList[i]] === undefined) return false;
    }
    for (var i = 0; i < params.typeList.length; i++) {
        if (params.icons[params.typeList[i]] === undefined) return false;
        if (params.infotexts[params.typeList[i]] === undefined) return false;
    }*/
    return true;
}

//Edition d'une cellule de tableau
function editCellContent(cell, cb) {
    var init_value = cell.text();
    cell.html('<input style="width:100%;background-color:rgb(200,200,210)" type="text" value="' + init_value + '" />');
    cell.children().first().focus();
    cell.children().first().keypress(function (e) {
        if (e.which == 13) { //Touche entrée appuyée
            var new_value = cell.find('input').val();
            cell.text(new_value);
            if (new_value !== init_value) { //la nouvelle valeur est différente de l'ancienne
                return cb(new_value);
            } else { //pas de changement de valeur
                return cb(false);
            }
        }
    });
    //Le champ d'édition n'a plus le focus = un clic a été donné sur un autre élément
    cell.children().first().blur(function () {
        cell.text(init_value);
        return cb(false);
    });
}



//Formatage des liens et des contenus de message
function format_liens(html) {

    //URLs starting with http://, https://, or ftp://
    var replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&#\/%?=~_|!:,.;]*[-A-Z0-9+&#\/%=~_|])/gim;
    html = html.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    var replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    html = html.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    html = html.replace(/(<br\/><\/a>)|(<br><\/a>)/gim, '<\/a><br>'); //Problème des liens www dont la fin peut être tronquée avec une balise <br/>
    html = html.replace(/(<br\/>\" target)|(<br>\" target)/gim, '" target'); //Pareil, correction dans le href

    /*HARLINDE COURTESY*/
    //Ta mère youtube
    html = html.replace(/<a\shref=\"(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)\"\starget=\"_blank\">[\S]+<\/a>/gim, '<center><embed style="max-width: 355px;" src="https://www.youtube.com/embed/$1"></embed></center>');
    //Transforme les liens de son en son...
    html = html.replace(/<a\shref=\"([\S]+(\.mp3|\.ogg|\.wav))\"\starget=\"_blank\">[\S]+<\/a>/gim, '<center><audio controls><source src="$1"></audio></center>');


    //Transforme les liens d'images en images cliquables
    html = html.replace(/<a\shref=\"([\S]+(\.png|\.jpg|\.jpeg|\.gif))\"\starget=\"_blank\">[\S]+<\/a>/gim, '<center><a href="$1" target="_blank"><img src="$1" style="max-width: 355px;"><\/a></center>');

    //Tranforme le texte entre * en italique
    html = html.replace(/\*([^\*]+)\*/gim, '<span style="font-style: italic; color: ' + params.emoteColor + ';">$1</span>');

    return html;
}


//**********************************************
// FIN FONCTIONS UTILITAIRES
//**********************************************

//**********************************************
// FONCTIONS DES INTERFACES MESSAGES
//**********************************************
//Pour un nouveau message
function mainf() {

    var old_id = "#db_new_message";
    var $databox = $(old_id);
    var new_id = 'db_message_' + new Date().getTime().toString();
    $databox.attr('id', new_id);
    var db_id = '#'+new_id;
    var class_name = ".message_nouveau";
    var toContent = db_id + " > div.content";
    var $msg_content = $(toContent);
    var $msg_textarea = $(toContent + " > " + class_name + " > #nm_texte > textarea");

    //Edition du bouton pour réduire la fenêtre afin de corriger le onclick en chemin relatif jQuery
    //Ainsi que du double clic sur le titre de la fenêtre qui a le même effet
    $(db_id + " > .head").attr("ondblclick", "").dblclick(function(){
        $(this).parent().toggleClass('reduced');
    });
    $(db_id + " > .head > .info1.link.reduce").attr("onclick", "").click(function(){
        $(this).parent().parent().toggleClass('reduced');
    });

    //Menu déroulant
    //*********************
    //Création du conteneur
    var $types_div = $('<div id="DCCB_divListe" />').appendTo($msg_content);
    $types_div.css({
        "z-index": '999999',
        position: 'absolute',
        top: '25px',
        left: '320px',
        "background-color": '#ACABAB',
    });
    //Création de la liste
    var $types_selection = $('<select id="listeTypes" />').appendTo($types_div);
    $types_selection.css({ //TODO : vérifier que ellipsis fonctionne
        display: 'block',
        width: '165px',
        "white-space": 'nowrap',
        overflow: 'hidden',
        "text-overflow": 'ellipsis',
        "-o-text-overflow": 'ellipsis',
        "-ms-text-overflow": 'ellipsis',
        "-web-text-overflow": 'ellipsis',
        "font-family": "Arial,Segoe UI Symbol,Unifont,Unifont Upper CSUR,sans-serif",
    });
    $types_selection.change(function () {
        var type_id = $(this).val();
        //Changement de dernier item choisi
        params.list_lastID = type_id;
        //Ajout d'une infobulle
        if (type_id !== 'NONE') {
            $(this).attr('title', makeBanner(0, type_id, 0, false));
        } else {
            $(this).attr('title', "");
        }
        //Sauvegarde locale
        GM_setValue("list_lastID", type_id);
    });
    //Ajout d'un élément neutre
    $types_selection.append('<option value="NONE"></option>');
    //Ajout des éléments en fonction de 'typeList'
    for (var i = 0; i < params.typeList.length; i++) {
        var $option = $('<option />').appendTo($types_selection);
        var type_id = params.typeList[i];
        var item_title = params.icons[type_id] + ' - ' + params.infotexts[type_id];
        $option.val(type_id).html(item_title);
    }
    //Application du choix par défaut
    var type_id = (params.b_alwaysDefault) ? params.list_defaultID : params.list_lastID;
    $types_selection.val(type_id);
    if (type_id !== 'NONE') {
        $types_selection.attr('title', makeBanner(0, type_id, 0, false));
    } else {
        $types_selection.attr('title', "");
    }

    //Boutons
    //*********************
    //Edit bouton d'envoi pour injecter fonctions customs
    $(db_id + " > .content > .message_nouveau > .envoyer.link").attr("onclick", "").click(function() {
        //Ajout d'un en-tête au message avant l'envoi
        if ($types_selection.val() !== 'NONE') {
            var header = makeBanner(1, $types_selection.val(), 3, true);
            var new_msg = header + $msg_textarea.val();
            $msg_textarea.val(new_msg);
        }
        nav.getMessagerie().sendMessage($(db_id));
        $(this).off("click"); //Empêche un envoi multiple du message.
    });
    //Boutons annexes pour ajouter des bouts de texte (pièce jointe, etc).
    var $actions_div = $('<div id="div_cb_annexes"/>').appendTo($msg_content);
    $actions_div.css({
        "z-index": '999999',
        position: 'absolute',
        top: '57px',
        left: '492px',
        width: '30px',
        height: (params.carousel_facesize * 30).toString() + 'px',
        overflow: 'hidden',
        border: '1px solid rgba(0, 0, 0,0.1)',
        "box-shadow": '0',
    });
    $actions_div.on('contextmenu', function (e) {
        e.stopPropagation();
        e.preventDefault();
        //On extrait le premier élément de la pile (sans remise)
        var fifo = carousel_stockpile.shift();
        //On cache cet élément
        $('.' + fifo, $actions_div).hide();
        //On montre le nouvel élément de tête
        $('.' + carousel_stockpile[0], $actions_div).show();
        //On ajoute l'ancien premier élément en fin de pile
        carousel_stockpile.push(fifo);
        return false;
    });
    //Initialisation d'une pile de gestion des faces du carrousel
    var carousel_stockpile = []
    for (var idx_carousel = 0; idx_carousel < params.carousel_facesnumber; idx_carousel++) {
        carousel_stockpile.push('carousel_' + idx_carousel.toString());
    }
    //Création des boutons rattachés à une face du carrousel
    for (var idx_btn = 0; idx_btn < params.actionList.length; idx_btn++) {
        var dedicatedCarousel_id = "carousel_" + carouselDedicatedFaceIdx(idx_btn);
        var action_id = params.actionList[idx_btn];
        var $button = $('<button title="' + params.infotexts[action_id] + '" class="cb_annexes" id="DCCB_b' + idx_btn.toString() + '">' + params.icons[action_id] + '</button>').appendTo($actions_div);
        //On range le bouton sur une face du carrousel via une classe CSS
        $button.addClass(dedicatedCarousel_id);
        $button.val(action_id);
        //On cache tous les boutons à l'initialisation
        $button.hide();
        $button.click(function () {
            var innerBanner = makeBanner(0, $(this).val(), 1, false);
            var new_msg = $msg_textarea.val() + innerBanner;
            $msg_textarea.val(new_msg);
        });
    }
    //On montre les membres de la première face du carrousel
    $('.carousel_0', $actions_div).show();

    $(".cb_annexes").css({
        "background-color": "#ACABAB",
        "height": "30px",
        "width": "30px",
        "font-size": "20px",
        "font-family": "Arial,Segoe UI Symbol,Unifont,Unifont Upper CSUR,sans-serif",
    }); //Ajout du CSS des boutons.
    console.log("Com'back started: nouveau message"); //Debug
}

//Pour un film de discussion existant
function filcomf() {

    $("#liste_messages").ajaxComplete(function () { //Naugriim, je t'aime. <3 (Attendre le chargement de la fenêtre avant d'envoyer la sauce)
        $("#liste_messages").unbind('ajaxComplete'); //Evite de renvoyer à chaque nouvelle requête ajax du jeu et donc de dupliquer la fonction

        var message_id = $("input.id_conversation").attr('value'); //Récupère l'id du message
        var db_id = "#db_message_" + message_id;

        //Transformation des liens en liens cliquables
        //*********************
        var $message_content = $(db_id + " > .content > .message > .contenu > .texte");
        var content_orig = $message_content.html();
        $message_content.html(format_liens(content_orig));
        var last_clicked_id = $(db_id + " .link.conversation.selected").attr('id');
        $(db_id + " .link.conversation").click(function () {
            var $cheminTexte = $(db_id + " > .content > .message > .contenu > .texte");
            $cheminTexte.ajaxComplete(function () {
                $(this).unbind('ajaxComplete');
                var this_clicked_id = $(db_id + " .link.conversation.selected").attr('id');
                if (this_clicked_id !== last_clicked_id) {
                    last_clicked_id = this_clicked_id; //Eviter de repasser la fonction qui sinon nique les liens.
                    $(this).html(format_liens($(this).html()));
                }
            });

        });

        $(db_id + " > .content > div.message > div.btnTxt").click(function () { //Création et affichage lors du clic sur l'un des boutons en bas de la fenêtre

            if (document.getElementById("dccb_div_fc_" + message_id) === null) { //Ne recrée pas l'interface du script si elle existe déjà: REND IMPOSSIBLE L'OUVERTURE DE PLUSIEURS COMS SANS BUGS.

                var $msg_content = $(db_id + " > .content > .message");
                var $msg_textarea = $(db_id + " > .content > .message > .zone_reponse > .texte > #nm_texte > textarea");

                //Augmentation de la taille de la zone_conversation
                //$('.zone_conversation').css('height', '340px');
                //Version animée
                $('.zone_conversation').animate({
                    height: '340px'
                }, 500);

                //Menu déroulant
                //*********************
                //Création du conteneur
                var $types_div = $('<div id="dccb_div_fc_' + message_id + '" />').appendTo($msg_content);
                $types_div.addClass('dccb_div_fc');
                $types_div.css({
                    "z-index": '999999',
                    position: 'absolute',
                    top: '348px',
                    left: '105px',
                    "background-color": '#FFFFFF',
                    "-webkit-box-shadow": '0 0 1px 0px #329bc2',
                    "border-color": '#207695',
                    "border-style": 'solid',
                    "border-width": 'thin',
                });
                //Création de la liste
                var $types_selection = $('<select id="listeTypesfc_' + message_id + '" />').appendTo($types_div);
                $types_selection.addClass('listeTypesfc');
                $types_selection.css({ //TODO : vérifier que ellipsis fonctionne
                    height: '27px',
                    color: '#397d94',
                    display: 'block',
                    width: '250px',
                    "white-space": 'nowrap',
                    overflow: 'hidden',
                    "text-overflow": 'ellipsis',
                    "-o-text-overflow": 'ellipsis',
                    "-ms-text-overflow": 'ellipsis',
                    "-web-text-overflow": 'ellipsis',
                    "font-family": 'Arial,Segoe UI Symbol,Unifont,Unifont Upper CSUR,sans-serif',
                });
                $types_selection.change(function () {
                    var type_id = $(this).val();
                    //Changement de dernier item choisi
                    params.list_lastID = type_id;
                    //Ajout d'une infobulle
                    if (type_id !== 'NONE') {
                        $(this).attr('title', makeBanner(0, type_id, 0, false));
                    } else {
                        $(this).attr('title', "");
                    }
                    //Sauvegarde locale
                    GM_setValue("list_lastID", type_id);
                });
                //Ajout d'un élément neutre
                $types_selection.append('<option value="NONE"></option>');
                //Ajout des éléments en fonction de 'typeList'
                for (var i = 0; i < params.typeList.length; i++) {
                    var $option = $('<option />').appendTo($types_selection);
                    var type_id = params.typeList[i];
                    var item_title = params.icons[type_id] + ' - ' + params.infotexts[type_id];
                    $option.val(type_id).html(item_title);
                }
                //Application du choix par défaut
                var type_id = (params.b_alwaysDefault) ? params.list_defaultID : params.list_lastID;
                $types_selection.val(type_id);
                if (type_id !== 'NONE') {
                    $types_selection.attr('title', makeBanner(0, type_id, 0, false));
                } else {
                    $types_selection.attr('title', "");
                }
                //Boutons
                //*********************
                //Bouton d'envoi injecté
                $(db_id + " > .content > .message > .zone_reponse > .btnTxt").attr("onclick", "").click(function(){
                    //Ajout d'un en-tête au message avant l'envoi
                    if ($types_selection.val() !== 'NONE') {
                        var header = makeBanner(1, $types_selection.val(), 3, true);
                        var new_msg = header + $msg_textarea.val();
                        $msg_textarea.val(new_msg);
                    }
                    nav.getMessagerie().sendMessage($(db_id));
                    $(this).off("click"); //Empêche d'envoyer un message en double.
                });
                //Boutons annexes pour ajouter des bouts de texte (pièce jointe, etc).
                var $actions_div = $('<div id="dccb_annexesfc_' + message_id + '"/>').appendTo($msg_content);
                $actions_div.css({
                    "z-index": '999999',
                    position: 'absolute',
                    top: '347px',
                    left: '365px',
                    height: '29px',
                    width: (params.carousel_facesize * 30).toString() + 'px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 0, 0,0.1)',
                    "box-shadow": '0',
                });
                $actions_div.on('contextmenu', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    //On extrait le premier élément de la pile (sans remise)
                    var fifo = carousel_stockpile.shift();
                    //On cache cet élément
                    $('.' + fifo, $actions_div).hide();
                    //On montre le nouvel élément de tête
                    $('.' + carousel_stockpile[0], $actions_div).show();
                    //On ajoute l'ancien premier élément en fin de pile
                    carousel_stockpile.push(fifo);
                    return false;
                });
                //Initialisation d'une pile de gestion des faces du carrousel
                var carousel_stockpile = []
                for (var idx_carousel = 0; idx_carousel < params.carousel_facesnumber; idx_carousel++) {
                    carousel_stockpile.push('carousel_' + idx_carousel.toString());
                }
                for (var idx_btn = 0; idx_btn < params.actionList.length; idx_btn++) {
                    var dedicatedCarousel_id = "carousel_" + carouselDedicatedFaceIdx(idx_btn);
                    var action_id = params.actionList[idx_btn];
                    var $button = $('<button title="' + params.infotexts[action_id] + '" class="cb_annexesfc cb_annexesfc_' + message_id + '" id="DCCB_b' + idx_btn.toString() + '_' + message_id + '">' + params.icons[action_id] + '</button>').appendTo($actions_div);
                    $button.val(action_id);
                    $button.addClass(dedicatedCarousel_id);
                    //On cache tous les boutons à l'initialisation
                    $button.hide();
                    $button.click(function () {
                        var innerBanner = makeBanner(0, $(this).val(), 1, false);
                        var new_msg = $msg_textarea.val() + innerBanner;
                        $msg_textarea.val(new_msg);
                    });
                }
                $('.carousel_0', $actions_div).show();

                $(".cb_annexesfc_" + message_id).css({
                    "color": "#397D94",
                    "background-color": "#FFFFFF",
                    "height": "29px",
                    "width": "29px",
                    "font-size": "15px",
                    "border-color": "#207695",
                    "font-family": "Arial,Segoe UI Symbol,Unifont,Unifont Upper CSUR,sans-serif",
                }); //Ajout du CSS des boutons.

                $msg_textarea.css({
                    "font-family": "Verdana,Courier,Segoe UI Symbol,Unifont,Unifont Upper CSUR,sans-serif",
                }); //CSS Unicode pour la zone d'écriture d'un fil de com'. Nécessite d'être placé ici parce que nique AJAX et jQuery.



            }
        });

    });

    console.log("Com'back started: fil de discussion"); //Debug
}
//**********************************************
// FIN FONCTIONS DES INTERFACES MESSAGES
//**********************************************

//**********************************************
// MAIN
//**********************************************

if (!checkData()) {
    console.log("DCCB - Com'back : Erreur dans les données");
} else {

    $("#zone_messagerie > div.btnTxt.link").click(mainf); //Nouveaux messages
    $("li.message").click(filcomf); //1ère initialisation

    $("#folder_list > .folder").click(function () { //Actualiser les events sur les li.message lors d'un changement de dossier (ceux-ci semblent être effacés)

        $("#liste_messages").ajaxComplete(function () {

            $("#liste_messages").unbind('ajaxComplete');
            $("li.message").click(filcomf); //Pas besoin de .off() puisque le site a recréé la liste
            console.log("DCCB - Changement de dossier: Actualisation des events");

        });

    });

    var lastList = $("#liste_messages > div.content > ul").html();

    setInterval(function () { //Fix dégueulasse pour le bug des messages anciens qui n'affichent pas l'interface. + Fix du bug d'actualisation (tentative)
        if ($("#liste_messages > div.content > ul").html() != lastList) {
            lastList = $("#liste_messages > div.content > ul").html();
            $("li.message").off("click", filcomf); //Eviter un doublon d'event
            $("li.message").click(filcomf);
            console.log("DCCB - Changement HTML de la liste de messages: Actualisation des events");
        }
    }, 1000);

    setInterval(function () { //Fix bien crade pour contacter l'auteur d'une annonce AITL.
        $(".annonce > .texte > span:contains(Contacter l'auteur)").click(mainf);
    }, 1000);

    //Affichage du Unicode via la police Unifont
    $("body").css({
        "font-family": "Trebuchet MS,Verdana,Arial,Segoe UI Symbol,Unifont,Unifont Upper CSUR,sans-serif",
    });
    $("textarea").css({
        "font-family": "Verdana,Courier,Segoe UI Symbol,Unifont,Unifont Upper CSUR,sans-serif",
    }); //Ne fonctionne que pour les nouveaux messages à cause d'AJAX. Sera sûrement à adapter si Remedy règle le bug de fermeture des nouveaux messages.

    console.log("DCCB - Com'back initialisé!");
}
