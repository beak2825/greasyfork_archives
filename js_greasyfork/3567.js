// ==UserScript==
// @name        Facebook Old NavBar by LaNouille974
// @name:fr     Ancienne barre de navigation de Facebook par LaNouille974
// @description Automatically repositions the elements of the Facebook navigation bar as they were in the previous version of the social network: friends requests, messages and notifications on the left (next to the logo), the other ones on the right. Lets also add a short personalized text (eg. a nickname) in the navbar. Ability to change the background color of the navigation bar.
// @description:fr Repositionne automatiquement les éléments de la barre de navigation de Facebook tels qu'ils étaient dans la version précédente du réseau social : invitations en ami, messages et notifications à gauche (à côté du logo), le reste à droite. Permet également d'ajouter un court texte personnalisé (ex: un pseudo) à la barre de navigation. Possibilité de changer la couleur de fond de la barre.
// @namespace   https://www.facebook.com
// @include     https://www.facebook.com/*
// @version     1.3
// @icon        http://img15.hostingpics.net/pics/772325facebookoldnavbar11bylanouille974.png
// @grant       none
// @require     https://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/3567/Facebook%20Old%20NavBar%20by%20LaNouille974.user.js
// @updateURL https://update.greasyfork.org/scripts/3567/Facebook%20Old%20NavBar%20by%20LaNouille974.meta.js
// ==/UserScript==

$.noConflict();

jQuery( document ).ready(function($) {
    
    /*** Configuration ***/
    var defaultNickName = 'LaNouille974';
    var defaultNavBarColor = '';
    var defaultPic = 'http://img11.hostingpics.net/pics/962935runico.png';
    var colorpickerPic = 'http://img4.hostingpics.net/pics/387100colorpicker.png';
    
    var navBar = $('#blueBarNAXAnchor');
    var logo = navBar.find('h1:first')
    /**** End Configuration ***/
    
    /*** Global vars ***/
    var colorChanged = false;
    /*** End Global vars ***/
    
    var originalNavRight = navBar.find('div._2gyk:first');
    
    //Cloner la navRight
    var newNavRight = originalNavRight.clone();
    
    //Un peu de CSS pour les nouvelles navBar
    newNavRight.css({
       'float': 'left',
		   'margin-left': logo.width() + 2 + 'px',
		   'margin-right': '10px',
        'position': 'relative'
    });  
    
    //Remettre les boutons permettant d'ouvrir les popups au premier plan
    newNavRight.find('a.jewelButton').css({
        'z-index': '100'
    });
    
    //Retirer les éléments indésirables de chaque navBar
    removeNavElements(originalNavRight, 'old');
    removeNavElements(newNavRight, 'new');
    
    //Personnalisation
    var li = $("<li/>");
    li.attr('id', 'thenoodle');
    li.attr('title', 'Cliquer pour changer le texte');
    li.addClass('navItem tinyman litestandNavItem').text(defaultNickName);
    li.prependTo(originalNavRight.children('ul:first'));
    
    $('li#thenoodle').css({
        'height': '25px',
        'line-height': '25px',
        'color': 'white',
        'font-weight': 'bold',
        'position': 'relative',
        'left': '-25px',
        'top': '-2px',
        'background-image': "url('"+ defaultPic +"')",
        'background-repeat': 'no-repeat',
        'background-size': '25px 25px',
        'padding-left' : '32px',
        'cursor': 'pointer',
        'float': 'left'
    });
    
    //Création du colorPicker invisible
    $('<input/>').attr({ type: 'color', id: 'colorpicker', name: 'colorpicker'}).appendTo('body');
    $('#colorpicker').css({
        'position': 'absolute',
        'top': -9999,
        'left': -9999,
     });
    
    //Ajouter bouton colorPicker
    var liPicker = $("<li/>");
    liPicker.attr('id', 'pickerOpenerLi');
    
    var divPicker = $("<div/>");
    divPicker.attr('id', 'pickerOpenerDiv');
    divPicker.appendTo(liPicker);
    
    $('#thenoodle').after(liPicker);
    
    $('#pickerOpenerLi').css({
        'position': 'relative',
        'border-radius': '2px',
        'cursor': 'pointer',
        'width': '27px',
        'height': '27px',
        'float': 'left',
        'top': '-3px',
        'margin-right': '5px'
    });
    
    $('#pickerOpenerDiv').css({
        'background-image': "url('"+ colorpickerPic +"')",
        'background-repeat': 'no-repeat',
        'background-size': '19px 19px',
        'border-radius': '2px',
        'width': '19px',
        'height': '19px',
        'position': 'relative',
        'top': '4px',
        'left': '4px'
    });
    
    liPicker.mouseenter(function(e){
       $(this).css('background', 'none repeat scroll 0 0 rgba(0, 0, 0, 0.1)');               
    });
    
    liPicker.mouseleave(function(e){
       $(this).css('background', 'transparent');               
    });
    
    //Ouvrir le colorPicker au clic
    $('#pickerOpenerLi').click(function(e) {
        $('#colorpicker').trigger('click');
    });
    
    $('#colorpicker').on('input', function() {
        changeColor($(this).val());
    });
    
	  //Animation fadeIn/fadeOut perpétuel
    infiniteFadeInOut($('li#thenoodle'), true);
    
    //Changer le pseudo à la volée
    $('li#thenoodle').click(function(){
        changeNickName($(this));
    });
    
    //Ajoute la nouvelle navBar à gauche
    newNavRight.prependTo(logo.parent());
    
    //Modifier emplacements popup
    //Messages
    $("#u_0_5").parent().click(function() {
        //Fleche
        $('#u_0_5 .beeperNub').css({
             'right': '0',
             'left': '35px'
        });
        
        //Popup
        $('#u_0_5').css({
            'right': '0',
             'left': '-30px'
        });
    });
    
    //Friends requests
    $("#fbRequestsFlyout").parent().click(function() {
        //Fleche
        $('#fbRequestsFlyout .beeperNub').css({
            'left': '4px' 
        });
        
        //Popup
        $("#fbRequestsFlyout").css({
            'left': '0',
        });
    });
    
    //Notifications
    $('#fbNotificationsFlyout').parent().click(function(){
        //Fleche
        $('#fbNotificationsFlyout .beeperNub').css({
            'right': '0',
             'left': '4px'
         });
        
        //Popup
        $("#fbNotificationsFlyout").css({
            'right': 'auto',
        });
    });
    
    //Changer la couleur de la navBar au chargement si une couleur par défaut est définie
    changeColor(defaultNavBarColor);

    /*$(document).on("DOMNodeInserted",function(evt){
        var target = $(evt.target); 
        var parents = target.parents('#pagelet_timeline_recent');
        
        if (parents.length)
            console.log('node inserted in timeline');
    });*/
    
    /*** FUNCTIONS ***/
    
    //Change la couleur de la barre
    function changeColor(colorHex) {
        
        if (typeof colorHex === 'undefined' || colorHex == '')
            return;
        
        /*if (!colorChanged) {
            $('*').filter(function(i){  
                return $(this).css("color") ==  $("<div style='color:#3b5998'/>").css("color");
            }).css("color", colorHex);
            
            colorChanged = true;
        }
        else {
            var currentNavBarColor = navBar.css('background-color');

            $('*').filter(function(i){  
                return $(this).css("color") == currentNavBarColor;
            }).css("color", colorHex);
        }*/
        
        navBar.css({
            'background-color': colorHex,
            'background-image' : 'none'
        });
    }
    
    //FadeIn puis fadeOut en boucle de l'élément passé en paramètre
    function infiniteFadeInOut (elem, fadeOut) {
        var targetOpacity = fadeOut ? 0.5 : 1;
        var duration = fadeOut ? 2000 : 500;
        
        fadeOut = !fadeOut; 
            
        elem.animate({
            opacity: targetOpacity 
        }, duration, 'swing', function() {
            infiniteFadeInOut($(this), fadeOut);
        });
    }
    
    //Retire les li indésirables de la navBar passé en param
    //Type = old ou Type = new
    function removeNavElements(navBar, type) {
      
        var elementsToRemove = [];
        
        if (type == 'new')
            elementsToRemove = [0, 1, 4, 5, 6];
        else
            elementsToRemove = [2, 3];
        
        navBar.children('ul:first').children('li').each(function(i) {
            
            //console.log(elementsToRemove);
            
            if ($.inArray(i, elementsToRemove) !== -1) {
               $(this).remove();
               //console.log(i);
            }
        });
    }
    
    function changeNickName(domElem) {
        var precNickName = domElem.text();
        var newNick = '';
        
        do {
            newNick = prompt('Nouveau texte (12 caractères max, taper "!q" pour quitter) :');
            
            if (newNick === null || newNick == '!q') break;
            else if (newNick.length > 12) 
                alert('Nouveau texte trop long ! 12 caractères max. (' + newNick.length + ' saisis)');
            
        } while (newNick.length > 12 || newNick == '')
        
        console.log(newNick);    
        
        if (newNick == null ) {
            if (precNickName == '')
                newNick = defaultNickName;
            else
                newNick = precNickName;
        } 
        else if(newNick == '!q') newNick = precNickName;    
            
        domElem.text(newNick);
    }
});