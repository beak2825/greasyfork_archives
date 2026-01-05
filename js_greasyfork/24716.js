// ==UserScript==
// @name         Edenya-Script
// @namespace    http://tampermonkey.net/
// @version      0.100021
// @description  Addon Edenya
// @author       Valkazaar
// @match        http://www.edenya.net/_vahal/*
// @grant        none
// @include      http://www.edenya.net/_vahal/*
// @include      https://www.edenya.net/_vahal/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/24716/Edenya-Script.user.js
// @updateURL https://update.greasyfork.org/scripts/24716/Edenya-Script.meta.js
// ==/UserScript==

function checkMessages(){
    $.ajax({
        type: 'GET',
        url: 'https://www.edenya.net/index2.php?loca=communiquer/forum/messages',
        //data: datas,
        success: function(data) {
            var i = (data.split("#AA2020")).length - 1;
            var texte = "envelope-open";
            if(i>0){
                $('#ValkHidden').prepend('<span title="'+i+' Message(s) Non Lus"><a href="https://www.edenya.net/index2.php?loca=communiquer/forum/messages"><i class ="fa fa-envelope" /><small>('+i+') </small></a></span>');
            }else{
                $('#ValkHidden').prepend('<span title="Aucun message non lu"> <a href="https://www.edenya.net/index2.php?loca=communiquer/forum/messages"><i class ="fa fa-envelope-open" /></a></span>');
            }
        }});
    }

(function () {
    $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" type="text/css">');
    'use strict';

    // Vérification de la présence de la variable localStorage EdenyaColor
    // et instanciation de base si nécessaire
    var localColor = localStorage.getItem('EdenyaColor');
    if (localColor === null) {
        localColor = {};
        localColor.cadre2 = '#dda0dd';
        localColor.ligneA = '#000000';
        localColor.dialogue = '#ffffff';
        localColor.narration = '#ffd700';
        localColor.cri = '#9acd32';
        localColor.hj = '#FFDAB9';
        localColor.BlackDate = '#B09070';
        localStorage.setItem('EdenyaColor', JSON.stringify(localColor));
        localColor = localStorage.getItem('EdenyaColor');
    }

    var localColorParsed = JSON.parse(localColor);
    if (localColorParsed.BlackDate === undefined) {
        localColorParsed.BlackDate = '#B09070';
        localStorage.setItem('EdenyaColor', JSON.stringify(localColorParsed));
    }

    // Remplacement des dates écrites en noir dans les forums.
    $("font[color*='#000000']").attr( "color", localColorParsed.BlackDate );
    $("font[color='#990000']").attr( "color", '#FF0000' );
    $("font[color*='#990000']").attr( "color", '#00DD00' );

    // Colorisation des éléments
    var baliseHeader = document.querySelector('head');
    var styleToAdd = document.createElement('style');
    $('a:has(i:has(span))').attr( "class", "narration" );
    for (var item in localColorParsed) {
        styleToAdd.innerText += '.' +item + '{color:'+ localColorParsed[item]+'!important}';
    }
    styleToAdd.innerText += 'td.cadre2 a:visited {color:'+ localColorParsed.cadre2+'}';
    styleToAdd.innerText += 'td.cadre2 a:link {color:'+ localColorParsed.cadre2+'}';
    styleToAdd.innerText += 'menu {margin-block-start:0;margin-block-end:0;}';
    styleToAdd.innerText += 'menu#menuValk {padding:0px;list-style-type: none;-webkit-padding-start: 0px;};';
    baliseHeader.appendChild(styleToAdd);

    var locationPath = window.location.pathname.split("/");

    // Dans Vahal, sur page 'normale'
    if (locationPath[locationPath.length - 2] == "_vahal" && locationPath[locationPath.length - 1] == "index.php"){
        jQuery.fn.Valk_Refresh = function() {
            var first = true;
            var z = JSON.parse(localStorage.getItem('EdenyaShortcut'));
            $('#menuValk').html('');
            for (var item in z) {
                var shortcutToAdd = "<li><small>";
                shortcutToAdd += "<i class='fa fa-chevron-up' onclick='$(document).Valk_Up(\"" + item + "\");' />";
                shortcutToAdd += "<i class='fa fa-chevron-down'  onclick='$(document).Valk_Down(\"" + item + "\");' />";
                shortcutToAdd += "<i class='fa fa-edit' onclick='$(document).Valk_Rename(\"" + item + "\");' />";
                shortcutToAdd += "<i class='fa fa-times-circle'  onclick='$(document).Valk_Del(\"" + item + "\");' />";
                shortcutToAdd += '</small> <a href="'+ z[item] +'">'+item+'</a>';
                shortcutToAdd += "</li>";
                $('#menuValk').append(shortcutToAdd);
            }
            $('#menuValk li:first-child small i:nth-child(1)').removeAttr("onclick")
            $('#menuValk li:last-child small i:nth-child(2)').removeAttr("onclick")
            return this; // This is needed so others can keep chaining off of this
        };
        jQuery.fn.Valk_Rename = function(itemIn){
            var nom=prompt('A renommer en ?');
            if (nom!==null){
                var y = {};
                var z = JSON.parse(localStorage.getItem('EdenyaShortcut'));
                for (var item in z) {
                    if(item == itemIn){
                        y[nom]=z[item];
                    }else{
                        y[item]=z[item];
                    }
                };
                localStorage.setItem('EdenyaShortcut',JSON.stringify(y));
                $(document).Valk_Refresh();
            }
            return this; // This is needed so others can keep chaining off of this
        }
        jQuery.fn.Valk_Down = function(itemIn) {
            var next = null;
            var y = {};
            var z = JSON.parse(localStorage.getItem('EdenyaShortcut'));
            for (var item in z) {
                if (item != itemIn) {
                    y[item] = z[item];
                    if (next != null) {
                        for (var bidule in next) {
                            y[bidule] = next[bidule];
                        }
                        next = null;
                    }
                }else {
                    next = {};
                    next[item] = z[item];
                }
            }
            localStorage.setItem('EdenyaShortcut', JSON.stringify(y));
            $(document).Valk_Refresh();
            return this; // This is needed so others can keep chaining off of this
        }
        jQuery.fn.Valk_Up = function(itemIn){
            var previous = null;var y={};
            var z = JSON.parse(localStorage.getItem('EdenyaShortcut'));
            for (let item in z) {
                if (previous != null){
                    if (item == itemIn){
                        y[item]=z[item];
                    }
                    for (bidule in previous){
                        if (bidule != itemIn){
                            y[bidule]=previous[bidule];
                        }
                    }
                };
                previous={};
                previous[item]=z[item]
                ;
            }
            for (var bidule in previous) {
                if (bidule != itemIn){
                    y[bidule]=previous[bidule];
                }
            }
            localStorage.setItem('EdenyaShortcut',JSON.stringify(y));$(document).Valk_Refresh();
            return this; // This is needed so others can keep chaining off of this
        }
        jQuery.fn.Valk_Add = function(){
            var nom=prompt('Nom du shortcut ?');
            if (nom!==null){
                var z = JSON.parse(localStorage.getItem('EdenyaShortcut'));
                z[nom]=document.URL;
                localStorage.setItem('EdenyaShortcut',JSON.stringify(z));
                $(document).Valk_Refresh();
                //Valk_Refresh();
            }
            return this; // This is needed so others can keep chaining off of this
        }
        jQuery.fn.Valk_Del = function(item){
            var z = JSON.parse(localStorage.getItem('EdenyaShortcut'));
            delete z[item];
            localStorage.setItem('EdenyaShortcut',JSON.stringify(z));
            $(document).Valk_Refresh();
            return this; // This is needed so others can keep chaining off of this
        }
        jQuery.fn.Valk_ChgCol = function(id){
            var z = JSON.parse(localStorage.getItem('EdenyaColor'));
            z[id] = $("#"+id).val();
            localStorage.setItem('EdenyaColor',JSON.stringify(z));
            location.href = location.href;
            return this; // This is needed so others can keep chaining off of this
        }

        // Positionnement sur la colone de gauche pour y ajouter les éléments (raccourcis et gestion des couleurs)
        if($(".menu").length > 0){
            $(".menu").append('<img src="images/interface/jour/pluie/chains.gif" />');
            $(".menu").append('<div id="cadreValk" class="cadre" style="width:194px;" />');
            $("#cadreValk").append('<div id="ValkHidden" />');
            checkMessages();
            $('#ValkHidden').append('<span style="padding-right:10px" title="Evénements récents"><a href="#"><i class="fa fa-calendar" onclick="javascript:window.open(\'vide.php?loca=evenements\',\'events\',\'scrollbars=1,width=500,height=450\')" /></a></span>');
            $("#ValkHidden").append("<span title='Ajouter un raccourci'><a href='#' onclick='$(document).Valk_Add()'> <i class='fa fa-plus-circle'/> Raccourci</a></span>");
            $("#cadreValk").append('<hr /><menu id="menuValk" />');
            $("#cadreValk").append('<hr /><div>Couleurs utilisées :</div>');

            var localShortcut = localStorage.getItem('EdenyaShortcut');
            if (localShortcut === null) {
                var shortcut = { 'accueil': 'https://www.edenya.net/_vahal/' };
                localStorage.setItem('EdenyaShortcut', JSON.stringify(shortcut));
                localShortcut = localStorage.getItem('EdenyaShortcut');
            }
            var localShortcutParsed = JSON.parse(localShortcut);
            $(document).Valk_Refresh();

            var localTips = localStorage.getItem('EdenyaTips');
            if (localTips === null) {
                localTips = {};
                localTips.cadre2 = "Couleur générale titre, panneau PJ,...";
                localTips.ligneA = "Couleur texte hors balises RP";
                localTips.dialogue = "Texte d'un dialogue";
                localTips.narration = "Texte de narration";
                localTips.cri = "Texte crié";
                localTips.hj = "descriptions HJ";
                localTips.BlackDate = "couleur des dates dans les forums";
                localStorage.setItem('EdenyaTips', JSON.stringify(localTips));
                localTips = localStorage.getItem('EdenyaTips');
            }
            var localTipsParsed = JSON.parse(localTips);

            for (item in localColorParsed) {
                var itemToAdd = '<input id="' + item + '" type="color" class="bouton" value="'+ localColorParsed[item] +'" style="width:25;padding:0"';
                itemToAdd += " onChange='$(document).Valk_ChgCol(\"" + item + "\")'";
                itemToAdd += ' onMouseOver=\'ShowHelpTab("<b>Usage :</b><br>'+(localTipsParsed[item]).replace("'", " ")+'")\'';
                itemToAdd += ' onMouseOut="HideHelp()"';
                itemToAdd += ' title="'+ localTipsParsed[item] +'"';
                itemToAdd += '</input>';
                $("#cadreValk").append(itemToAdd);
            }
            var localPreview = localStorage.getItem('EdenyaPreview');
            if(localPreview === null) {
                localPreview = true;
                localStorage.setItem('EdenyaPreview', localPreview);
            }
            var localPreviewParsed = JSON.parse(localPreview);
            $("#cadreValk").append('<span>Prévisualisation de post : <input type="checkbox" onclick="localStorage.setItem(\'EdenyaPreview\', !JSON.parse(localStorage.getItem(\'EdenyaPreview\')));" '+ (localPreviewParsed?'checked':'') +' ></input></span>');
        }
    }
    if (locationPath[locationPath.length - 2] == "_vahal" && locationPath[locationPath.length - 1] == "vide.php" && ((document.getElementsByClassName("titre"))[0]).innerText == "Nouveau message" && JSON.parse(localStorage.getItem('EdenyaPreview'))){
        jQuery.fn.Valk_insertBalise = function(balise){
            var field = $('#message')[0];
            $('#message').focus();
            var debut = field.selectionStart;
            var fin = field.selectionEnd;
            var startSelection   = $('#message').val().substring(0, debut);
            var currentSelection = $('#message').val().substring(debut, fin);
            var endSelection     = $('#message').val().substring(fin);

            $('#message').val(startSelection + "["+balise+"]" + currentSelection + "[/"+balise+"]" + endSelection);
            $('#message').focus(); // On remet le focus sur la zone de texte
            field.setSelectionRange(startSelection.length + balise.length + 2, startSelection.length + balise.length + 2 + currentSelection.length);
            return this; // This is needed so others can keep chaining off of this
        };
        jQuery.fn.Valk_Previsualise = function(){
            var initial_texte = $("[name='message']").val();
            var regexpOpen = /\[(narration|dialogue|cri|hj|ecriture)\]/g;
            var regexpClose = /\[\/(narration|dialogue|cri|hj|ecriture)\]/g;
            var previsu_texte = initial_texte.replace(regexpOpen, "<span class=\"$1\">");
            previsu_texte = previsu_texte.replace(regexpClose, "</span><!--$1-->");
            var regexpImg = /\[img\]([^\[]*)\[\/img\]/g;
            previsu_texte = previsu_texte.replace(regexpImg, "<img src=\"$1\" border=\"0\"\/>");
            previsu_texte = previsu_texte.replace(/\n/g, "<"+"br/>");
            $("#previewText").html(previsu_texte);
            return this; // This is needed so others can keep chaining off of this
        };

        $(".saisie tbody tr td img").attr("onclick", function (){var z=$(this).attr("onclick"); z=z.replace("clickfuncmult(this,'","$(document).Valk_insertBalise('");return z})
        $("[name='Submit']").after("<button class='bouton' type='button' onclick='$(document).Valk_Previsualise()'>Prévisualiser</button>")
        $("table.saisie").after("<hr /><div id='previewText' style='text-align:left;'></div><hr />");
    }
    window.oncontextmenu = null;
})();