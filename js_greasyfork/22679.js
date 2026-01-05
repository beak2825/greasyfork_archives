// ==UserScript==
// @name Forenputze
// @description Applies changes to the user interface of The-West's XenForo forum including design changes, addition of useful links like "Forum read"-buttons and other features.
// @namespace fktext.bplaced.net/forenputze
// @include http*://forum.the-west.*/*
// @include http*://forum.beta.the-west.*/*
// @exclude http*://forum.the-west.*/admin.php*
// @exclude http*://forum.beta.the-west.*/admin.php*
// @version 1.48
// @grant none
// @author stayawayknight
// @downloadURL https://update.greasyfork.org/scripts/22679/Forenputze.user.js
// @updateURL https://update.greasyfork.org/scripts/22679/Forenputze.meta.js
// ==/UserScript==
//************************************
// Great thanks to WojcieszyPL (@.the-west.pl) for translating the script into Polish!
//************************************
//Add new JS source
function contentEval(source) {
  if ('function' == typeof source) {
    source = '(' + source + ')();';
  }
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = source;
  document.body.appendChild(script);
  document.body.removeChild(script);
}
Forenputze = function () {
  Forenputze = {
    initialized: false
  };
  //************************************
  //General settings
  Forenputze.name = 'Forenputze';
  Forenputze.version = '1.48';
  Forenputze.lang = 'net';
  Forenputze.conversationsStorageKey = 'forenputze_conversations';
  Forenputze.collapseStorageKey = 'forenputze_collapse';
  Forenputze.collapseCookieExpireDays = 365;
  Forenputze.collapseCookieName = 'xf_express';
  Forenputze.mainPage = 'index.php';
  Forenputze.dzikiLink = 'https://dzikitw.wordpress.com/';
  //************************************
  //************************************
  //Language
  Forenputze.langs = {
    de: {
      read: 'Gelesen markieren',
      markAllRead: 'Alle Foren als gelesen markieren',
      gameLogin: 'Login im Spiel',
      login: 'Login',
      registration: 'Registrieren',
      conversations: 'Unterhaltungen',
      settings: 'Grundeinstellungen',
      logout: 'Logout',
      scrollUp: 'Nach oben springen',
      goToLastPost: 'Zum letzten Beitrag gehen',
      registered: 'Registriert',
      confirmConversationCheck: 'Du hast neue ungelesene private Nachrichten. Soll die Unterhaltungsübersicht geöffnet werden?',
      dziki: 'DzikiTW',
      collapse: 'Zuklappen',
      expand: 'Aufklappen',
      forum: 'Forum'
    },
    net: {
      read: 'Mark as read',
      markAllRead: 'Mark all forums as read',
      gameLogin: 'Login into the game',
      login: 'Login',
      registration: 'Register',
      conversations: 'Conversations',
      settings: 'Basic settings',
      logout: 'Logout',
      scrollUp: 'Back to top',
      goToLastPost: 'Go to last post',
      registered: 'Registered',
      confirmConversationCheck: 'You have new unread private messages. Do you want to open the conversation overview?',
      dziki: 'DzikiTW',
      collapse: 'Collapse',
      expand: 'Expand',
      forum: 'Forum'
    },
    pl: {
      read: 'Oznacz jako przeczytane',
      markAllRead: 'Oznacz wszystkie fora jako przeczytane',
      gameLogin: 'Zaloguj się do gry',
      login: 'Zaloguj się',
      registration: 'Rejestracja',
      conversations: 'Prywatne wiadomości',
      settings: 'Podstawowe ustawienia',
      logout: 'Wyloguj się',
      scrollUp: 'Powrót do góry',
      goToLastPost: 'Idź do ostatniego postu',
      registered: 'Zarejestrowany',
      confirmConversationCheck: 'Masz nową prywatną wiadomość. Chcesz otworzyć podgląd rozmowy?',
      dziki: 'DzikiTW',
      collapse: 'Zwiń',
      expand: 'Rozwiń',
      forum: 'Forum'
    }
  };
  //************************************
  //************************************
  //Main function, runs the other functions
  Forenputze.run = function () {
    Forenputze.resolveLang();
    Forenputze.changeHomeLinks();
    Forenputze.addLinks();
    Forenputze.formatLogo();
    Forenputze.addPageUp();
    Forenputze.removeShareSections();
    Forenputze.changeReadIconColor();
    Forenputze.highlightLastPost();
    Forenputze.addLastPostButton();
    Forenputze.addForumReadButton();
    Forenputze.setCollapseCookieTime();
    Forenputze.addForumCollapse();
    Forenputze.formatPosts();
    Forenputze.changeDesign();
    Forenputze.checkConversations();
  };
  //************************************
  //************************************
  Forenputze.resolveLang = function () {
    var tld = getTLD();
    if (Forenputze.langs[tld]) {
      Forenputze.lang = tld;
    }
  };
  //************************************
  //Functions to adjust the forum ui
  //Change links that lead to TW to forum links
  Forenputze.changeHomeLinks = function () {
    //Logo:
    $('#logo').find('a').attr('href', Forenputze.mainPage);
    //Home:
    $('.homeCrumb').find('a').attr('href', Forenputze.mainPage);
    //Navigation:
    $('.navTab.home.PopupClosed').find('a').attr('href', Forenputze.mainPage);
  };
  //Adds a logout button to the Quick link list
  Forenputze.addLinks = function () {
    //Get quick links bar:
    var quickLinksBar = $('.quickLinksBar');
    //Add link to DzikiTW for PL players
    if (Forenputze.lang == 'pl') {
      var dzikiMenu = $('<li class="section"></li>');
      dzikiMenu.append('<li><a target="_blank" href="' + Forenputze.dzikiLink + '" class="primaryContent"><i style="padding-right:7px;" class="fa fa-star fa-lg fa-fw"></i>' + Forenputze.langs[Forenputze.lang].dziki + '</a></li>')
      quickLinksBar.append(dzikiMenu);
    } //Check whether logged in

    if (!isLoggedIn()) {
      //Extend menu for guests
      var registerLink = $('#adm_right2.navTab.login').find('a').attr('href');
      var ownMenu = $('<ul></ul>');
      ownMenu.append($('<li><a href="index.php?login" class="primaryContent OverlayTrigger"><i style="padding-right:7px;" class="fa fa-sign-in fa-lg fa-fw"></i>' + Forenputze.langs[Forenputze.lang].login + '</a></li>'));
      ownMenu.append($('<li><a target="_blank" href="' + registerLink + '" class="primaryContent"><i style="padding-right:7px;" class="fa fa-user fa-lg fa-fw"></i>' + Forenputze.langs[Forenputze.lang].registration + '</a></li>'));
      quickLinksBar.append(ownMenu);
      return;
    } //When cookie set, add game login link

    if (getCookie('ig_conv_last_site') != '') {
      var gameLogin = $('<li><a class="primaryContent" target="_blank" href="' + getCookie('ig_conv_last_site') + '"><i class="fa fa-gamepad fa-lg fa-fw" style="padding-right:7px;"></i>' + Forenputze.langs[Forenputze.lang].gameLogin + '</a><li>');
      quickLinksBar.find('.section').find('ul').prepend(gameLogin);
    } //Extend menu for users
    //Create own menu section

    var ownMenu = $('<li class="section"></li>');
    //Create forum link to mark all forums als read
    var forumReadLink = $('<a href="" class="primaryContent"><i style="padding-right:7px;" class="fa fa-pencil fa-lg fa-fw"></i>' + Forenputze.langs[Forenputze.lang].markAllRead + '</a></li>');
    forumReadLink.click(function () {
      //Send ajax request to mark all forums as read
      XenForo.ajax('index.php?forums/-/mark-read', {
        '_xfConfirm': 1
      }, function (data) {
        //Redirect needed?
        if (data._redirectStatus == 'ok') {
          //Redirect/reload page
          location.href = data._redirectTarget;
        }
      });
    });
    ownMenu.append($('<li></li>').append(forumReadLink));
    ownMenu.append($('<li><a href="index.php?conversations" class="primaryContent"><i style="padding-right:7px;" class="fa fa-inbox fa-lg fa-fw"></i>' + Forenputze.langs[Forenputze.lang].conversations + '</a></li>'));
    ownMenu.append($('<li><a href="index.php?account/preferences" class="primaryContent"><i style="padding-right:7px;" class="fa fa-cog fa-lg fa-fw"></i>' + Forenputze.langs[Forenputze.lang].settings + '</a></li>'));
    ownMenu.append($('<li><a href="index.php?logout" class="primaryContent OverlayTrigger"><i style="padding-right:7px;" class="fa fa-sign-out fa-lg fa-fw"></i>' + Forenputze.langs[Forenputze.lang].logout + '</a></li>'));
    quickLinksBar.append(ownMenu);
  };
  //Resize main logo
  Forenputze.formatLogo = function () {
    $('#header').css('background', 'rgba(0,0,0,0) url("styles/west_mx/xenforo/headbg.png") no-repeat scroll center top');
    $('#header').css('background-size', '100%');
    $('#header').css('height', '250px');
    $('#headerProxy').css('height', '255px');
  };
  //Add a page up button to the lower bar of the page
  Forenputze.addPageUp = function () {
    //Wait till everything is loaded
    var container = $('.breadBoxBottom').find('fieldset.breadcrumb');
    var pageUpButton = $('<a title="' + Forenputze.langs[Forenputze.lang].scrollUp + '" class="fa fa-arrow-up fa-lg fa-fw"></a>');
    //Set CSS properties
    pageUpButton.css('cursor', 'pointer');
    pageUpButton.css('color', '#371902');
    pageUpButton.css('display', 'block');
    pageUpButton.css('float', 'right');
    pageUpButton.css('font-size', '18px');
    pageUpButton.css('height', '24px');
    pageUpButton.css('line-height', '24px');
    pageUpButton.css('margin-right', '5px');
    //Add class for recognition
    pageUpButton.addClass('page-up-button');
    //Add click listener      
    pageUpButton.click(function () {
      window.scrollTo(0, 0);
    });
    if (container.find('.sidebarCollapse').exists()) {
      container.find('.sidebarCollapse').after(pageUpButton);
    } else {
      container.find('.OverlayTrigger.jumpMenuTrigger').after(pageUpButton);
    }
  };
  //Removes the share section above each thread
  Forenputze.removeShareSections = function () {
    //Overall share section with facebook and twitter
    $('.sharePage').remove();
    //Follow us section on the right hand side
    $('.userList:first div.primaryContent').parent().remove();
    //**Thanks to stewue (@forum.the-west.de)**
  };
  //Saturate the non-read forum icons to create a bigger difference betweeen read and unread elements
  Forenputze.changeReadIconColor = function () {
    var icons = $('.nodeInfo').not('.unread, .linkNodeInfo, .pageNodeInfo').find('span.nodeIcon');
    //Usual:
    icons.css('filter', 'saturate(20%)');
    //Chrome, Opera, Safari:
    icons.css('-webkit-filter', 'saturate(20%)');
  };
  //Make the "Latest" text bold
  Forenputze.highlightLastPost = function () {
    $('.lastThreadTitle').find('span').css('font-weight', 'bold');
  };
  //Add a "mark read" button to each forum
  Forenputze.addForumReadButton = function () {
    //Check whehther logged in
    if (!isLoggedIn()) {
      return;
    }
    $('.nodeInfo.forumNodeInfo.primaryContent.unread').each(function (i, obj) {
      //Get link and add mark-read option
      var link = $(this).find('.nodeTitle').find('a').attr('href');
      link += '-/mark-read';
      //Add link near topic
      $(this).find('.nodeTitle').append('&nbsp;').append($('<a class="OverlayTrigger" style="font-size: 10px;" href="' + link + '">[' + Forenputze.langs[Forenputze.lang].read + ']</a>'));
      //Add link to forum icon
      $(this).find('span.nodeIcon').wrap($('<a class="OverlayTrigger" href="' + link + '"></a>'));
    });
  };
  //Add a "go to last post" button to each thread in the overview
  Forenputze.addLastPostButton = function () {
    $('.discussionListItem').each(function (index, obj) {
      //Get latest post link
      var link = $(this).find('.listBlock.lastPost').find('.muted').find('a').attr('href');
      if ((typeof link === 'undefined') || !isLoggedIn()) {
        return;
      } //Add button

      $(this).find('.title').append('&nbsp;').append($('<a title="' + Forenputze.langs[Forenputze.lang].goToLastPost + '" href="' + link + '" class="fa fa-arrow-right fa-lg fa-fw"></a>'));
    });
  };
  //Adds onclick listeners to the category collapse buttons that ensure that the remembering cookie lasts one year and do not expire with the session
  Forenputze.setCollapseCookieTime = function () {
    //Function for persisting the cookie
    persist = function () {
      setCookie(Forenputze.collapseCookieName, getCookie(Forenputze.collapseCookieName), Forenputze.collapseCookieExpireDays);
    };
    //Add onclick listeners to persist the cookie always when a category is clicked
    $('.CatTrigger').click(function () {
      persist();
    });
    //Persist cookie for the first time
    if (getCookie(Forenputze.collapseCookieName) && getCookie(Forenputze.collapseCookieName) != '') {
      persist();
    }
  };
  //Implement collapse possibility for forums
  Forenputze.addForumCollapse = function () {
    //Functions to collapse and expand forums:
    //Collapses a forum with animation, given by the forum's DOM node
    collapseAnim = function (forum) {
      forum.children().first().slideUp();
      forum.find('.collapsed_forum_header').show();
    };
    //Collapses a forum fastly without animation, given by the forum's DOM node
    collapse = function (forum) {
      forum.children().first().hide();
      forum.find('.collapsed_forum_header').show();
    };
    //Expands a forum with animation, given by the forum's DOM node
    expandAnim = function (forum) {
      //Remove button header
      forum.children().first().slideDown();
      forum.find('.collapsed_forum_header').hide();
    };
    //Begin of the executive part
    //Read forums that are saved as collapsed from the local storage und parse it
    var collapsedForums = localStorage.getItem(Forenputze.collapseStorageKey);
    if (collapsedForums != null) {
      collapsedForums = JSON.parse(collapsedForums);
    }
    $('.node.forum.level_2').each(function () {
      var node_id = $(this).attr('class').match(/node_(\d+)/) [1];
      //Create collapse button
      var button_collapse = $('<span class="fa fa-minus fa-lg fa-fw" title="' + Forenputze.langs[Forenputze.lang].collapse + '"></span>');
      //Styles
      button_collapse.css('width', '9px');
      button_collapse.css('height', '9px');
      button_collapse.css('padding', '3px');
      button_collapse.css('font-size', '12px');
      button_collapse.css('border-radius', '50%');
      button_collapse.css('color', '#ffeecc');
      button_collapse.css('background-color', '#371902');
      button_collapse.css('margin-left', '8px');
      button_collapse.css('cursor', 'pointer');
      //Add collapse functionality to the collapse button
      button_collapse.click({
        forum: $(this),
        id: node_id
      }, function (event) {
        collapseAnim(event.data.forum);
        var stored = localStorage.getItem(Forenputze.collapseStorageKey);
        if (stored == null) {
          stored = {
          };
        } else {
          stored = JSON.parse(stored);
        }
        stored[event.data.id] = true;
        localStorage.setItem(Forenputze.collapseStorageKey, JSON.stringify(stored));
      });
      $(this).find('.nodeTitle').append(button_collapse);
      //Add forum header for collapsed forum and expand button
      var forumTitle = $(this).find('.nodeTitle').children().first().text();
      var unread = $(this).children().first().hasClass('unread');
      //Exact match with sheriff icon: margin-left: 55px
      var forumHeader = $('<span class="collapsed_forum_header" style="font-size: 12px; margin-left: 8px;"></span>');
      //Add forum title to the header and make it bold when unread
      if (unread) {
        forumHeader.append($('<i>' + Forenputze.langs[Forenputze.lang].forum + ': <b>' + forumTitle + '</b></i>'));
      } else {
        forumHeader.append($('<i>' + Forenputze.langs[Forenputze.lang].forum + ': ' + forumTitle + '</i>'));
      } //Create expand button

      var button_expand = $('<span class="fa fa-plus fa-lg fa-fw" title="' + Forenputze.langs[Forenputze.lang].expand + '"></span>');
      //Styles
      button_expand.css('width', '9px');
      button_expand.css('height', '9px');
      button_expand.css('padding', '3px');
      button_expand.css('font-size', '12px');
      button_expand.css('border-radius', '50%');
      button_expand.css('color', '#ffeecc');
      button_expand.css('background-color', '#371902');
      button_expand.css('margin-left', '5px');
      button_expand.css('cursor', 'pointer');
      //Add expand functionality to the expand button
      button_expand.click({
        forum: $(this),
        id: node_id
      }, function (event) {
        expandAnim(event.data.forum);
        var stored = localStorage.getItem(Forenputze.collapseStorageKey);
        if (stored == null) {
          return;
        }
        stored = JSON.parse(stored);
        delete stored[event.data.id];
        localStorage.setItem(Forenputze.collapseStorageKey, JSON.stringify(stored));
      });
      forumHeader.append(button_expand);
      //Hide collapse header by default
      forumHeader.hide();
      //Append forum header to the ui
      $(this).append(forumHeader);
      //Are there collapsed forums and is the current forum saved as collapsed?
      if ((collapsedForums != null) && collapsedForums[node_id]) {
        //Collapse forum in UI
        collapse($(this));
      }
    });
  };
  //Formats the posts so that they become smaller
  Forenputze.formatPosts = function () {
    //Replace long usernames with ellipsis
    $('.username').each(function () {
      $(this).attr('title', $(this).text());
      $(this).css('text-overflow', 'ellipsis').css('white-space', 'nowrap');
    });
    //Increase the width of user profile section every post a little bit
    $('.messageUserInfo').css('padding-left', '5px').css('width', '160px');
    //Removes the "agreement" section in user profiles in posts
    var userInfo = $('.extraUserInfo');
    userInfo.each(function () {
      $(this).find('.pairsJustified').eq(0).find('dt').text(Forenputze.langs[Forenputze.lang].registered + ':');
      $(this).find('.pairsJustified').eq(2).remove();
    });
    //Format the pairs in the user vocabulary for better readability
    var pairs = userInfo.find('.pairsJustified');
    pairs.css('font-size', '12px');
    pairs.find('dt').css('font-weight', 100).css('text-transform', 'none');
    pairs.find('dd').css('text-transform', 'none');
  };
  //Do same changes to the design, including a change of the background
  Forenputze.changeDesign = function () {
    //Wooden background
    $('body').css('background-image', 'url(https://westde.innogamescdn.com/images/interface/wood_texture_dark.jpg)');
    //Remove footer color
    $('footer').find('.footer').find('.pageContent').css('background-color', 'rgba(0, 0, 0, 0.0)');
    //Wooden moderator bar
    $('#moderatorBar').css('background-image', 'url(https://westde.innogamescdn.com/images/interface/wood_texture_dark.jpg)');
    //Moderator items color
    $('.modLink').css('background-color', '#ffeecc');
    //Searchbar
    $('<style>#searchBar::after{color: #ffeecc</style>').appendTo('head');
    //Forum content texture
    $('#content').find('.pageContent').css('background-image', 'url(https://westde.innogamescdn.com/images/window/forum/external_bg.jpg)');
    //Rounded corners
    $('#content').find('.pageContent').css('border-radius', '10px');
    //Message background
    $('<style>.message{background-image: url(https://westde.innogamescdn.com/images/tw2gui/groupframe/groupframe_bg.jpg)</style>').appendTo('head');
    //Rounded corners in message user block
    $('.messageUserBlock ').css('border-radius', '20px');
    //Let buttons look like west buttons
    $('<style>.button:not(.bbCodeSpoilerButton){background-color: rgba(0,0,0,0) !important; border: 0px solid #371902; color: #ffe7b1 !important; background-size: 100% 100%; background-image: url(https://westde.innogamescdn.com/images/tw2gui/button/button_normal.png?1)}</style>').appendTo('head');
    //Change breadcrumb bars to western bars
    $('.breadcrumb').css({
      'background-image': 'url("https://westde.innogamescdn.com/images/tw2gui/window/window2_title.png?13")',
      'background-size': '100% 100%',
      'background-color': 'rgba(0,0,0,0)',
      'box-shadow': 'none',
      'border-radius': '0px',
      'padding-left': '15px',
      'padding-right': '15px',
    });
    $('.crumb, .sidebarCollapse, .icon-room, .page-up-button').css({
      'color': '#ffeecc',
      'background-color': 'rgba(0,0,0,0)',
      'border-bottom': 'none'
    });
    $('<style>.breadcrumb .crust .arrow::before{color: #ffeecc}</style>').appendTo('head');
  };
  Forenputze.checkConversations = function () {
    //Init local storage
    if (localStorage.getItem(Forenputze.conversationsStorageKey) == null) {
      localStorage.setItem(Forenputze.conversationsStorageKey, 0);
    }
    var numberConversations = parseInt($('#ConversationsMenu_Counter').find('span.Total').text());
    var savedConversations = parseInt(localStorage.getItem(Forenputze.conversationsStorageKey));
    //Alert neccessary?
    if (numberConversations > savedConversations) {
      localStorage.setItem(Forenputze.conversationsStorageKey, numberConversations);
      if (confirm(Forenputze.langs[Forenputze.lang].confirmConversationCheck)) {
        //Navigate
        location.href = 'index.php?conversations/';
      }
    }
    localStorage.setItem(Forenputze.conversationsStorageKey, numberConversations);
  };
  //Checks whether the user is logged (true) in or not (false)
  isLoggedIn = function () {
    return $('li#adm_right.navTab.login').size() < 1;
  };
  //Returns the top level domain of the current site
  getTLD = function () {
    var tld = window.location.hostname;
    tld = tld.split('.');
    pos = tld.length - 1;
    return tld[pos];
  };
  //Reads a cookie
  getCookie = function (c_name) {
    if (document.cookie.length > 0) {
      c_start = document.cookie.indexOf(c_name + '=');
      if (c_start != - 1) {
        c_start = c_start + c_name.length + 1;
        c_end = document.cookie.indexOf(';', c_start);
        if (c_end == - 1) {
          c_end = document.cookie.length;
        }
        return unescape(document.cookie.substring(c_start, c_end));
      }
    }
    return '';
  };
  //Sets a cookie with name, value and days
  setCookie = function (name, value, days) {
    var expires;
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    } 
    else {
      expires = '';
    }
    document.cookie = name + '=' + value + expires + '; path=/';
  };
  //Query extension to check whether a exception is empty or not
  $.fn.exists = function () {
    return this.length !== 0;
  };
  //Run main function
  Forenputze.run();
  //Let XenForo crawl the overlays
  $('body').xfActivate();
};
$(document).ready(function () {
  contentEval(Forenputze);
});
