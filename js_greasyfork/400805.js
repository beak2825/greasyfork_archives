// ==UserScript==
// @name         ранобэ.рф trello integration (add comment of current page into a card)
// @namespace    https://raw.githubusercontent.com/adelobosko/xn--80ac9aeh6f.xn--p1ai/master/script.js
// @description  ранобэ.рф trello integration (add comment (current page of novel) into a card)
// @include      https://ранобэ.рф/*
// @include      https://xn--80ac9aeh6f.xn--p1ai/*
// @grant        none
// @author       Alexey Delobosko
// @version      1.3.2
// @grant GM_setValue
// @grant GM_getValue
// @run-at document-idle
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/400805/%D1%80%D0%B0%D0%BD%D0%BE%D0%B1%D1%8D%D1%80%D1%84%20trello%20integration%20%28add%20comment%20of%20current%20page%20into%20a%20card%29.user.js
// @updateURL https://update.greasyfork.org/scripts/400805/%D1%80%D0%B0%D0%BD%D0%BE%D0%B1%D1%8D%D1%80%D1%84%20trello%20integration%20%28add%20comment%20of%20current%20page%20into%20a%20card%29.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';


var program = {
  'TrelloStatus': {
    'NOT_ALLOWED': 0,
    'ALLOWED_NOT_CONFIGURED': 1,
    'ALLOWED_CONFIGURED': 2
  },
  'Trello': {
    'Token': '',
    'CardId': '',
    'BoardId': '',
    'Key': '7d0d6fa3ed4fe0b723201010a2b0dc19',
    'GetAccessUrl': function() {
      return 'https://trello.com/1/authorize?expiration=never&name=Ранобэ.рф&scope=read,write&response_type=token&key='
        +this.Key+'&return_url='+encodeURIComponent(document.location.toString());
    },
    'Status': 0,
    'RedirectToGettingAccess': function() {
      var url = this.GetAccessUrl();
      document.location = url;
    },
    'AddComment': function (cardid, text) {
      var xhr = new XMLHttpRequest();
      var body = 'text=' + encodeURIComponent(text)+'&key='+this.Key+'&token='+this.Token;

      xhr.open("POST", 'https://api.trello.com/1/cards/'+this.CardId+'/actions/comments', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(body);
    },
    'GetCards': function (boardId) {
      var config = this.config;
      var xhr = new XMLHttpRequest();
      var body = 'key='+this.Key+'&token='+this.Token;
      xhr.open("GET", 'https://api.trello.com/1/boards/'+boardId+'/cards?' + body, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
          var cards = JSON.parse(xhr.responseText);
          var cardsHtml = '';
          for(var i = 0; i < cards.length; i++){
            var card = cards[i];
            cardsHtml += '<option value="'+card.id+'">'+card.name+'</option>';
          }

          $('#'+config.Page.Builder.Ids.TrelloCardSelect).html(cardsHtml);
        }
      };
      xhr.send();
    },
    'GetBoards': function getBoards(){
      var trello = this;
      var config = this.config;
      var xhr = new XMLHttpRequest();
      var body = 'key='+this.Key+'&token='+this.Token;
      xhr.open("GET", 'https://api.trello.com/1/members/me/boards?' + body, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
          var boards = JSON.parse(xhr.responseText);
          config.Page.Builder.CreateMainMenu(boards);
          config.Page.Menu.SwitchVisibility();
        }
      };
      xhr.send();
    }
  },
  'Cookies':{
    'Names':{
      'TrelloToken': 'trelloAccessToken',
      'TrelloCardId': 'trelloCardId',
      'TrelloBoardId': 'trelloBoardId',
      'CurrentChapterText': 'currentChapterText',
      'CurrentScrollPosition': 'currentScrollPosition'
    },
    'GetCookie': function(name) {
      var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    },
    'ClearCookie': function (name, domain, path){
      var domain = domain || document.domain;
      var path = path || "/";
      document.cookie = name + "=; expires=" + +new Date + "; domain=" + domain + "; path=" + path;
    },
    'SetCookie': function (name, value, options = {}) {
      options = {
        path: '/',
        ...options
      };

      if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
      }

      var updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

      for (var optionKey in options) {
        updatedCookie += "; " + optionKey;
        var optionValue = options[optionKey];
        if (optionValue !== true) {
          updatedCookie += "=" + optionValue;
        }
      }

      document.cookie = updatedCookie;
    }
  },
  'Page': {
    'DomainName': 'xn--80ac9aeh6f.xn--p1ai',
    'CurrentChapterText': '',
    'CurrentScrollPosition': 0.0,
    'Builder':{
      'AddCsses': function(){
        this.CreateCssLink('fontawesome', 'https://use.fontawesome.com/releases/v5.0.13/css/all.css');
      },
      'Ids':{
        'MainMenuIcon': 'mainIcon',
        'MainMenu': 'menuIcons',
        'TrelloCardSelectionMenu': 'trelloCardSelectionMenu',
        'TrelloBoardSelect': 'trelloBoardSelect',
        'TrelloCardSelect': 'trelloCardSelect'
      },
      'MainMenuOnClickHandler': function(config) {
        if(config.Trello.Status === config.TrelloStatus.ALLOWED_CONFIGURED){
          config.Trello.GetBoards();
        }
        else if(config.Trello.Status === config.TrelloStatus.ALLOWED_NOT_CONFIGURED){
           config.Trello.GetBoards();
        }
        else if(config.Trello.Status === config.TrelloStatus.NOT_ALLOWED) {
          config.Trello.RedirectToGettingAccess();
        }
      },
      'CreateMainMenuOnClickHandler': function(){
        var config = this.config;
        var builder = this;
        $('#'+this.Ids.MainMenuIcon).unbind();
        $('#'+this.Ids.MainMenuIcon).click(function () {return builder.MainMenuOnClickHandler(config);});
      },
      'CrateMainMenuIcon': function() {
        var src = 'https://github.com/adelobosko/images/raw/master/trelloUnchecked.png';
        if(this.config.Trello.Status === this.config.TrelloStatus.ALLOWED_NOT_CONFIGURED){
          src = 'https://raw.githubusercontent.com/adelobosko/images/master/trelloConfigure.png';
        }
        else if(this.config.Trello.Status === this.config.TrelloStatus.ALLOWED_CONFIGURED){
          src = 'https://github.com/adelobosko/images/raw/master/trelloChecked.png';
        }

        if($('#'+this.Ids.MainMenuIcon).length > 0){
          $('#'+this.Ids.MainMenuIcon).attr('src',src);
          $('#'+this.Ids.MainMenuIcon).attr('title', "Show / hide menu");
        }
        else {
          var imgHtml = '<img id="'+this.Ids.MainMenuIcon+'" style="height:48px;cursor:pointer;" src="'+src+'"></img>';
          var menuHtml = '<div id="tr_main" style="position:fixed;bottom:5px;left:10px;z-index:9999;">'+imgHtml+'</div>';

          $('body').append(menuHtml);
        }


        this.CreateMainMenuOnClickHandler();
      },
      'CreateMainMenu': function (boards) {
        this.CrateMainMenuIcon();
        if(boards){
          this.CreateCardSelectionMenu(boards);
        }
        this.CreateMainMenuSubIcons();
      },
      'CreateCardSelectionMenu': function(boards) {
        var config = this.config;
        console.log('config', config);
        var currentBoardValue = config.Trello.BoardId || undefined;
        var currentCardValue = config.Trello.CardId || undefined;

        console.log('currentBoardValue', currentBoardValue);
        console.log('currentCardValue', currentCardValue);

        var boardsHtml = 'Select board:<br><select id="'+this.Ids.TrelloBoardSelect+'" value='+currentBoardValue+'>';
        console.log('boards', boards);
        boardsHtml += '<option value="'+undefined+'">Select board</option>';
        for(var i = 0; i < boards.length; i++){
          var board = boards[i];
          if(board.closed === false){
            boardsHtml += '<option value="'+board.id+'">'+board.name+'</option>';
          }
        }
        boardsHtml += '</select>';

        var cardsHtml = '<br>Select card:<br><select id="'+this.Ids.TrelloCardSelect+'" value="'+currentCardValue+'"></select>';


        var cardSelectionStyle = 'style="font-size:24px;color:green;display:'
          + ($('#trelloSelectCard').css('display') === 'block' && this.isShown ? 'block' : 'none')
          + ';width:80%;height:90%;position:fixed;top:10px;left:10px;z-index:9999;"';
        var cardSelectionMenuHtml = '<div id="'+this.Ids.TrelloCardSelectionMenu+'" '+cardSelectionStyle+'>'+boardsHtml+cardsHtml+'</div>';

        if($('#'+this.Ids.TrelloCardSelectionMenu).length > 0){
          $('#'+this.Ids.TrelloCardSelectionMenu).remove();
        }

        $('#'+this.Ids.TrelloBoardSelect).val(currentBoardValue);
        if(currentBoardValue) {
          config.Trello.GetCards(currentBoardValue);
        }
        $('#'+this.Ids.TrelloCardSelect).val(currentCardValue);

        $('body').append(cardSelectionMenuHtml);
        this.CreateOnBoardSelectIndexChangeHandler();
        this.CreateOnCardSelectIndexChangeHandler();
      },
      'CreateOnBoardSelectIndexChangeHandler': function (){
        var config = this.config;
        $('#'+this.Ids.TrelloBoardSelect).unbind();
        $('#'+this.Ids.TrelloBoardSelect).on('change', function() {
          config.Trello.BoardId = this.value;
          config.Trello.GetCards(this.value);
        });
      },
      'CreateOnCardSelectIndexChangeHandler': function (){
        var config = this.config;
        $('#'+this.Ids.TrelloCardSelect).unbind();
        $('#'+this.Ids.TrelloCardSelect).on('change', function() {
          config.Cookies.SetCookie(
            config.Cookies.Names.TrelloCardId,
            this.value,
            {
              domain: config.Page.DomainName,
              'max-age': 31536000
            }
          );
          config.Cookies.SetCookie(
            config.Cookies.Names.TrelloBoardId,
            config.Trello.BoarId,
            {
              domain: config.Page.DomainName,
              'max-age': 31536000
            }
          );
          config.Trello.CardId = this.value;
        });
      },
      'CreateMainMenuSubIcons': function() {
        var logoutSubItem = {
          'ID': 'trelloLogoutSubItem',
          'GetHtml': function(parent){
            var style = 'style="font-size:24px;padding-left:5px;float:left;color:red;cursor:pointer;z-index:9999;"';
            var html = '<i id="'+this.ID+'" '+style+' class="fas fa-sign-out-alt"></i>';
            return html;
          },
          'CreateOnClickHandler': function(parent) {
            $('#'+this.ID).unbind();
            $('#'+this.ID).click(function(){
             if(confirm('Do you want to delete access token?')){
              var cookieNames = parent.config.Cookies.Names;
              parent.config.Cookies.ClearCookie(cookieNames.TrelloAccess, parent.config.Page.DomainName);
              parent.config.Cookies.ClearCookie(cookieNames.TrelloCardId, parent.config.Page.DomainName);
              parent.config.Cookies.ClearCookie(cookieNames.TrelloBoardId, parent.config.Page.DomainName);
              parent.Trello.CardId = '';
              parent.Trello.BoardId = '';
              parent.Trello.Token = '';
              parent.Page.Builder.CreateMainMenu();
              parent.Page.Menu.SwitchVisibility(false);
             }
            });
          }
        };

        var cardSelectSubItem = {
          'ID': 'trelloCardSubItem',
          'GetHtml': function(parent){
            var cardIconColor = parent.config.Trello.CardId ? 'green' : 'white';
            var style = 'style="font-size:24px;padding-left:10px;float:left;color:' + cardIconColor + ';cursor:pointer;z-index:9999;"';
            var html = '<i id="'+this.ID+'" ' + style + ' class="far fa-credit-card"></i>';
            return html;
          },
          'CreateOnClickHandler': function(parent){
            var id = this.ID;
            $('#'+id).unbind();
            $('#'+id).click(function(){
              var displayValue = ($('#'+parent.Ids.TrelloCardSelectionMenu).css('display') === 'none' ? 'block' : 'none');
              $('#'+parent.Ids.TrelloCardSelectionMenu).css('display', displayValue);
            });
          }
        };

        var subItems = [logoutSubItem, cardSelectSubItem];
        var menuHtml = '<div id="'+this.Ids.MainMenu+'" style="display:'+(this.config.Page.Menu.IsShown ? 'block' : 'none')
        +';width:120px;position:fixed;bottom:64px;left:10px;z-index:9999;">';
        for(var i = 0; i < subItems.length; i++){
          menuHtml += subItems[i].GetHtml(this);
        }
        menuHtml += '</div>';

        if($('#'+this.Ids.MainMenu).length > 0){
          $('#'+this.Ids.MainMenu).remove();
        }

        $('#'+this.Ids.MainMenuIcon).parent().append(menuHtml);


         for(var i = 0; i < subItems.length; i++){
          menuHtml += subItems[i].CreateOnClickHandler(this);
        }
      },
      'CreateCssLink': function (id, href){
        var cssId = id;
        if (!document.getElementById(cssId))
        {
          var head  = document.getElementsByTagName('head')[0];
          var link  = document.createElement('link');
          link.id   = cssId;
          link.rel  = 'stylesheet';
          link.type = 'text/css';
          link.href = href;
          link.media = 'all';
          head.appendChild(link);
        }
      }
    },
    'Menu': {
      'SwitchVisibility': function(force){
        var ids = this.config.Page.Builder.Ids;
        if($('#'+ids.MainMenu).length > 0){
          if(force === true || force === false){
            this.IsShown = force;
          }
          else {
            this.IsShown = !this.IsShown;
          }
          $('#'+ids.MainMenu).css('display', this.IsShown ? 'block' : 'none');
          $('#'+ids.TrelloCardSelectionMenu).css('display',
                                           (this.IsShown  && $('#'+ids.TrelloCardSelectionMenu).css('display') === 'none' ? 'block' : 'none'));
        }
      },
      'IsShown': false
    },
    'GetTokenByUrl': function (){
      var urlStartText = '?token=';
      var url = document.location.toString();
      var startIndex = url.indexOf(urlStartText);
      if(startIndex < 0){
        urlStartText = '#token=';
        startIndex = url.indexOf(urlStartText);
        if(startIndex < 0){
          return undefined;
        }
      }
      var token = url.substring(startIndex+urlStartText.length);
      return token;
    },
    'SetTrelloStatusByCookie': function (config){
      config.Trello.Token = config.Cookies.GetCookie(config.Cookies.Names.TrelloToken);

      if(config.Trello.Token){
        config.Trello.Status = config.TrelloStatus.ALLOWED_NOT_CONFIGURED;
        config.Trello.CardId = config.Cookies.GetCookie(config.Cookies.Names.TrelloCardId);
        config.Trello.BoardId = config.Cookies.GetCookie(config.Cookies.Names.TrelloBoardId);

        if(config.Trello.CardId){
          config.Trello.Status = config.TrelloStatus.ALLOWED_CONFIGURED;
        }
      }
    },
    'GetChapterText': function (){
      var chapter = $('h1');
      if(chapter.length > 0) {
        return chapter[0].innerText;
      }

      return this.CurrentChapterText;
    },
    'UpdatePageStatus': function (config){
      if(config.Trello.Status !== config.TrelloStatus.ALLOWED_CONFIGURED){
        return;
      }
      var chapterText = config.Page.GetChapterText();

      if(config.TimerTickCount === 0){
        var cursorPos = parseFloat(config.Cookies.GetCookie(config.Cookies.Names.CurrentScrollPosition));
        var lastChapterText = config.Cookies.GetCookie(config.Cookies.Names.CurrentChapterText);
        if(cursorPos !== NaN && lastChapterText && chapterText === lastChapterText){
          config.Page.CurrentScrollPos = cursorPos;
          $(document).scrollTop(config.Page.CurrentScrollPos);
        }
      }

      config.Page.CurrentScrollPos = $(document).scrollTop();
      config.Cookies.SetCookie(
        config.Cookies.Names.CurrentScrollPosition,
        config.Page.CurrentScrollPos,
        {domain: config.Page.DomainName, 'max-age': 31536000}
      );
      config.Cookies.SetCookie(
        config.Cookies.Names.CurrentChapterText,
        chapterText,
        {domain: config.Page.DomainName, 'max-age': 31536000}
      );

      if(config.Page.CurrentChapterText === chapterText){
        return;
      }
      var text = chapterText+'\r\n'+document.location.toString();
      config.Trello.AddComment(config.Trello.CardId, text);
      config.Page.CurrentChapterText = chapterText;
    }
  },
  'TimerTickHandler': function(config){
    if(config.Trello.Status === config.TrelloStatus.NOT_ALLOWED){
      var token = config.Page.GetTokenByUrl();
      if(token && token != ''){
        config.Cookies.SetCookie(config.Cookies.Names.TrelloToken, token, {domain: config.Page.DomainName, 'max-age': 31536000});
      }
    }
    config.Page.SetTrelloStatusByCookie(config);
    config.Page.Builder.CreateMainMenu();
    config.Page.UpdatePageStatus(config);
    config.TimerTickCount = config.TimerTickCount + 1;

    setTimeout(config.TimerTickHandler, config.TimerTickDelay, config);
  },
  'TimerTickDelay': 3000,
  'TimerTickCount': 0,
  'Main': function(config) {
    config.Page.Builder.AddCsses();
    setTimeout(config.TimerTickHandler, config.TimerTickDelay, config);
  },
  init : function() {
    this.Trello.config = this;
    this.Page.Menu.config = this;
    this.Page.Builder.config = this;
    delete this.init;
    return this;
  }
}.init();



program.Main(program);