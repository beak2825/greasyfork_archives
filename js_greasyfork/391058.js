// ==UserScript==
// @name		kroleg talkrooms
// @version		0.0.8
// @datecreated 2019-04-01
// @lastupdated	2021-08-08
// @author		kroleg
// @grant		none
// @match		https://talkrooms.ru/*
// @match		https://www.talkrooms.ru/*
// @updatedURL  https://extension.kroleg.tk/chatmod/engines/talkrooms.ru.user.js
// @description	Скрипт изменяет внешний вид чата и отключает плавный автоскролл
// @namespace https://greasyfork.org/users/386075
// @downloadURL https://update.greasyfork.org/scripts/391058/kroleg%20talkrooms.user.js
// @updateURL https://update.greasyfork.org/scripts/391058/kroleg%20talkrooms.meta.js
// ==/UserScript==

//if(window.location.href.match(/^http[s]?:\/\/(?:www.)*talkrooms.ru/i) && /Chrome|Firefox|Opera|Safari/i.test(navigator.userAgent)) {

 (function() {
 'use strict';

  var
   version = ' .:: ЧатМод Кролега v 0.0.8 ::.',
   recipient = null,
   messHist = {
    historyMess: [''],
    historyCount: 0,
    historyMax: 50
   },
   ACCESS_OWNER = 80,
   ACCESS_ADMIN = 70,
   ACCESS_MODER = 50,
   uLevel = {
   	0: 'Гость: пользователь без привелегий.',
   	20: 'Приглашённый: доступ к комнате только по приглашению.',
   	50: 'Модератор: следит за порядком и наказывает нарушителей.',
   	70: 'Админ: назначает модераторов и меняет название комнаты.'
   },
   uIgnored = {
   	0: 'снять бан',
    15: 'на 15 минут',
    120: 'на 2 чиса',
    720: 'на 12 чисоф',
    10080: 'на ниделю',
    null: 'нафсикда'
   },
   Role,
   Users = [],
   Colors = [
    ['ffffff', 'c0c0c0'],
    ['cbcbcb', 'd3d3d3'],
    ['A6BACF', 'D1E0F0'],
    ['84C2FC', 'C4E1FC'],
    ['BE6DFD', 'ECD4FF'],
    ['F464F3', 'FFBAFF'],
    ['EA5B5B', 'FFD4D4'],
    ['d13363', 'ffc9da'],
    ['e36b00', 'ffc38d'],
    ['B6F01A', 'E6FFA3'],
    ['D5E800', 'F8FFAC'],
    ['F8FB00', 'FDFF8C'],
    ['FFC600', 'FBF0C8'],
    ['FFE245', 'FFF4BB'],
    ['BECA85', 'E9F3B9'],
    ['a6b53e', 'dcee62'],
    ['87E0B3', 'C4FFE1'],
    ['8CEE89', 'D7FFD5'],
    ['6AC053', 'DCF1D6'],
    ['B4A794', 'E4D5BE'],
    ['B69EC0', 'E7CBF2'],
    ['C696A5', 'E5D8DC'],
    ['bf985b', 'e9c48b'],
    ['c97a4d', 'f5dbbd'],
    ['2ebba5', '77f7e3'],
    ['3c9fe4', '86cdff'],
    ['8E98EF', 'D4D8FF'],
    ['708bff', 'b5c3ff']
   ];



  function log(s) {
   console.log(s);
  }//func

  function localSysMess(mess) {
   var
    chat = $('.talk-current');
  	 
    chat.append('<div class="sys"><span>' + mess + '</span><span>' + ' (' + formatDate(new Date(), 'd mL в hh:ii') + ')</span></div>')

   $('.talk-content').scrollTop($('.talk-content')[0].scrollHeight);
  }//func


  function getRandomInt(min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
  }//func
  

  function reverse(s) {
   return s.split('').reverse().join('');
  }//


  function formatDate(formatDate, formatString) {
   var
    month = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    z = '0',
    yyyy = formatDate.getFullYear(),
    yy = yyyy.toString().substring(2),
    m = formatDate.getMonth() + 1,
    mm = m < 10 ? z + m : m,
    mL = month[m - 1],
    d = formatDate.getDate(),
    dd = d < 10 ? z + d : d,

    h = formatDate.getHours(),
    hh = h < 10 ? z + h : h,
    i = formatDate.getMinutes(),
    ii = i < 10 ? z + i : i,
    s = formatDate.getSeconds(),
    ss = s < 10 ? z + s : s,
    ms = formatDate.getMilliseconds(),
    tz = formatDate.toString().match(/([-\+][\d]+)\s/);
    if(tz) tz = tz[1].replace(/[\d]{2}/, '$&:');

   return formatString
    .replace(/yyyy/i, yyyy)
    .replace(/yy/i, yy)
    .replace(/mL/i, mL)
    .replace(/mm/i, mm)
    .replace(/m/i, m)
    .replace(/dd/i, dd)
    .replace(/d/i, d)
    .replace(/hh/i, hh)
    .replace(/h/i, h)
    .replace(/ii/i, ii)
    .replace(/i/i, i)
    .replace(/ss/i, ss)
    .replace(/s/i, s)
    .replace(/ms/i, ms)
    .replace(/tz/i, tz);
  }//func


  function getUserObj(key, val) {
   for(var k in Users) 
    if(Users[k][key] == val) return Users[k];
   return false;
  }//func


  function removeUser(arr) {
   var
    i = 0,
    remUser = [],
    tArr = [];
  
   for(var k in Users) {
    remUser[i] = Users[k];

    for(var n in arr)
     if(Users[k].role_id == arr[n].role_id) {
      tArr.push(Users[k]);
      remUser.splice(i, 1);
      break;
     }//if
    i++;
   }//for

   Users = tArr;
   remUser = remUser.filter(Boolean);
   return remUser;
  }//func


  function getRole(role_id) {
   var
    room = Rooms.selected;

   return room.rolesOnline.get(role_id) || room.rolesWaiting.get(role_id);
  }//func


  function textNodeReplace(obj, txt) {
   obj.contents().filter(function() { return this.nodeType == 3; })[0].textContent = txt;
  }//func


  function historyMessKbd(sw) {
   var
    input = $('#input');
  
   if(sw < 0) {
    if(messHist.historyCount > 0) input.val(messHist.historyMess[--messHist.historyCount]);
   } else if(messHist.historyCount < messHist.historyMess.length) input.val(messHist.historyMess[++messHist.historyCount]); 
  }//func


  function userOnlineModify() {
   var
    container = $('.room-users'),
    template = $.template('#user-template');

   function renderOwner() {
    return '<em class="own">[own]</em>';
   }

   function renderAdmin() {
    return '<em class="adm">[adm]</em>';
   }

   function renderModerator() {
    return '<em class="mod">[mod]</em>';
   }

   function renderRole(data) {
    var
     role = getRole(data.role_id);

    if(!data.userpicUrl) data.userpicUrl = Userpics.getUrl(data);

    var
     $role = template(data);

    if(role.level == ACCESS_OWNER) $role.find('.nickname').parent().append(renderOwner()); else
    if(role.level == ACCESS_ADMIN) $role.find('.nickname').parent().append(renderAdmin()); else
    if(role.level == ACCESS_MODER) $role.find('.nickname').parent().append(renderModerator());
    
    if(data.role_id === Rooms.selected.myRole.role_id) $role.addClass('me');
    
    if(data.annoying) $role.addClass('annoying');
    $role.attr('data-role', data.role_id);
    $role.find('.nickname').css({color: '#' + Colors[role.nickColor || 0][0]});
    $role.find('.userpic')
     .unbind()
     .mouseover(function(e) {
      var
       target = $(e.target).parent(),
       role_id = target.data('role'),
       role = getRole(role_id);
       
      Profile.show(role, { nickname: role.nickname, top: event.pageY, left: event.pageX, target: target });
     })
     .mousedown(function() {
      Profile.hide();
     })
     .mouseout(function() {
      Profile.hide();
     })
     .click(function(e) {
      var
       uinfo = $('#uinfo'),
       target = $(e.target).parent(),
       role_id = target.data('role'),
       role = Role = getRole(role_id),
       iSrc = $(this).css('background-image'),
       ulev = $('#ulevel input[type=radio]'),
       uign = $('#uignore input[type=radio]'),
       exp = role.expired == null && role.ignored != null ? 'null' : Math.round((new Date(role.expired) - new Date(role.ignored)) / 1000 / 60);
    
      if(uinfo.data('role_id') == role_id) {
       uinfo
        .removeData()
        .hide();
       setTimeout(function() { Profile.hide(); }, 0);
       return;
      }

      iSrc = /http/.test(iSrc)
       ? iSrc.replace(/url\("([^\n]+)userpics\/(\d+)\.png\?(\d+)"\)/, '$1photos/$2.jpg?$3')
       : iSrc.replace(/url\("([^\n]+)"\)/, '$1');

      $('.uadm > div:nth-child(2), #ulevel, #uignore').hide();

      if(Rooms.selected.myRole.role_id != role.role_id && Rooms.selected.myRole.level > role.level) {
       ulev.removeAttr('checked');
       uign.removeAttr('checked');

       
       if(Rooms.selected.myRole.level >= 50) {
        if(Role.level >= 20) $('#uignore').show();
        uign.removeAttr('checked');

        checkedSet(uign, exp);
/*
        $(uign).each(function(k, v) {
         if($(v).val() == exp) {
          $(v).prop({checked: true});
          return false;
         }
        });
*/
       }
       
       if(Rooms.selected.myRole.level >= 70) {
        if(Rooms.selected.myRole.level < 80) $('#ulevel > li').eq(4).remove();
        if(Role.level >= 20) $('#ulevel').show();

        checkedSet(ulev, role.level);
/*
        $(ulev).each(function(k, v) {
         if($(v).val() == role.level) {
          $(v).prop({checked: true});
          return false;
         }
        });
*/       
       }

       $('.uadm').show();
      } else $('.uadm').hide();

//      textNodeReplace($('#uinfo h4'), role.status ? 'Информация :: Статус: ' + role.status : 'Информация');
      textNodeReplace($('#uinfo h4'), role.nickname);
//      $('#uinfo .usernick').html(role.nickname).css({color: '#' + Colors[role.nickColor || 0][0]});
      $('#uinfo .cont img').attr('src', iSrc);
      uinfo.data('role_id', role_id).show();
      setTimeout(function() { Profile.hide(); }, 0);
     });
    
    return $role[0];
   }

   function Group(selector) {
    this.elem = container.find(selector);
    this.list = this.elem.find('.users-list');
    this.amount = this.elem.find('.users-amount');
   }

   Group.prototype.show = function(roles) {
    this.list.html('');
    if(roles.length) {
     this.amount.html(roles.length);
     this.list.append(roles.map(renderRole));
     this.elem.show();
    } else this.elem.hide();
   };

   var
    onlineGroup  = new Group('.users-online'),
    ignoredGroup = new Group('.users-ignored'),
    waitingGroup = new Group('.users-requests');

   function showOnline(room) {
    var
     useHidden = !room.myRole.isModerator,
     useIgnored = !room.myRole.ignored,
     online  = [],
     hidden  = [],
     ignored = [];

    room.rolesOnline.items.forEach(function(role) {
     if(useIgnored && role.ignored) {
      role.annoying = false;
      ignored.push(role);
     } else if(useHidden && Me.isHidden(role)) {
      role.annoying = true;
      hidden.push(role);
     } else {
      role.annoying = false;
      online.push(role);
     }
    });

    online = online.concat(hidden);

    onlineGroup.show(online);
    ignoredGroup.show(room.myRole.isModerator ? ignored : []);
   }

   function showWaiting(room) {
    waitingGroup.show(room.myRole.isModerator ? room.rolesWaiting.items : []);
   }

   function updated(room) {
    Rooms.triggerSelected('selected.roles.updated', room);
   }

   Rooms.on('explore', function() {
    container.hide();
   });

   Rooms.on('select', function() {
    container.hide();
   });

   Rooms.on('selected.ready', function(room) {
    showOnline(room);
    showWaiting(room);
    container.show();
    $('#input').focus();
   });

   Rooms.on('selected.denied', function(room) {
    container.hide();
   });

   Rooms.on('selected.roles.updated', showOnline);
   Rooms.on('selected.waiting.updated', showWaiting);

    // Update ignored and hidden groups
   Rooms.on('my.rank.changed', showOnline);


//User login
   Rooms.pipe('role.online', function(room, data) {
    room.rolesOnline.add(data);
    updated(room);
   });

//User logout
   Rooms.pipe('role.offline', function(room, data) {
   room.rolesOnline.remove(data.role_id);
   updated(room);
  });


   $('.room-users')[0].addEventListener('DOMSubtreeModified', function(e) {

    var
     tmp,
     nickColor,
     uObj,
     uArr = Rooms.selected.rolesOnline.index;

    if(Object.keys(uArr).length < Users.length) {
     uObj = removeUser(uArr)[0];
     return 
//     localSysMess('<span data-role="' + uObj.role_id + '" style="color: #' + Colors[uObj.nickColor || 0][0] + '" class="nickname">' +  uObj.nickname  + '</span> покидает чат');
    }
    
    for(var k in uArr) {
     if(uArr[k].role_id && !getUserObj('role_id', uArr[k].role_id)) {
      nickColor = getRandomInt(0, Colors.length - 1);
      tmp = uArr[k];
      tmp.nickColor = nickColor;
      Users.push(tmp);

      if(Rooms.selected.myRole.role_id == uArr[k].role_id) {
       $('.reply-wrapper > .userpic')
        .removeAttr('style')
        .html(Rooms.selected.myRole.nickname + ':')
        .css({color: '#' + Colors[nickColor][0]});
      }
 
//      localSysMess('<span data-role="' + uArr[k].role_id + '" style="color: #' + Colors[nickColor || 0][0] + '" class="nickname">' +  uArr[k].nickname  + '</span> входит в чат');

      Users.sort();
     }//if new user
    }//for



   }, false);
  }//func


  function messageSendModify() {

   window.sendMess = function(type) {
    var
     k,
     input = $('#input'),
     txt = input.val().trim(),
     nick = txt.substring(0, txt.indexOf(',')),
     uObj = getUserObj('nickname', nick),
     mentions = txt.split(','),
     options = {
      room_id: Room.data.room_id,
      content: txt,
      mentions: []
     };
    
    if(txt == '') return;

    messHist.historyMess.push(txt);
    if(messHist.historyMess.length > messHist.historyMax) messHist.historyMess.shift();
    messHist.historyCount = messHist.historyMess.length;

    if(type == 'sec') options.recipient_role_id = recipient ? recipient.role_id : uObj ? uObj.role_id : null;

    else if(mentions.length)
     for(k in mentions) {
      if(!mentions[k]) continue;
      nick = mentions[k].trim();
      uObj = getUserObj('nickname', nick);
      if(uObj) options.mentions.push(uObj.role_id);
     }//for

    Room.send(options);

    setTimeout(function() { 
     $('.talk-content').scrollTop($('.talk-content')[0].scrollHeight + 1000);
    }, 10);
    
    recipient = null;
    input.val('').focus();
    $('.reply-form .cbutton').removeClass('button-down');   
   }//func


   var
    container = $('.room-users, .talk-current');

   function getData(elem) {
    var
     room = Rooms.selected,
     role_id = Number(elem.attr('data-role'));

    recipient = { role_id: role_id };
    return room.rolesOnline.get(role_id) || room.rolesWaiting.get(role_id);
   }

   container.on('click', '.user:not(.me) .nickname, .message .nickname, .sys .nickname', function(event) {
    if(event.target.nodeName !== 'A') {
     var
      user = $(this).closest('.user'),
      data = getData(user.length ? user : $(this));

     if(data && data.come_in != null) {
      Profile.show(data, {
       target: user
      });
     }
//             else if(data) Room.replyTo(data);
            
    }
   });


   Room.replyPrivate = function(data) {
    var
     input = $('#input');

    if(!data.nickname) return;

    input.focus().val(data.nickname + ', ' + input.val());
    recipient = data;
   };


   Room.replyTo = function(role) {
    var
     field = $('#input'),
     raw = field.get(0),
     pos = raw.selectionStart;

    if(role && role.nickname) {
     field.focus().val(role.nickname + ', ' + field.val());
     if('setSelectionRange' in raw) {
      pos = pos ? pos + role.nickname.length + 2 : raw.value.length;
      raw.setSelectionRange(pos, pos);
     }
    } else field.focus();
   };
  }//func


  function headerModify() {
   var
    title = $('.toolbar-title'),
    tools = $('.toolbar-tools'),
    date  = $('.header-date');

   function getTitle(room) {
    if(room.state === 'lost') return 'Комната не найдена';
    if(room.state === 'deleted') return '<span class="toolbar-deleted">' + room.data.topic + '</span>';
    return room.data.topic;
   }

   function showTopic(room) {
    title.html(room.data.topic);
   }

   function showTitle(text) {
    toggleToolbar(false);
    title.html(text + '<span>' + version + '</span>');
   }

   function toggleToolbar(ready) {
    title.toggleClass('changing', !ready);
    tools.toggleClass('hidden', !ready);
    date.toggleClass('hidden', !ready);
   }

   Rooms.on('select', function(room) {
    showTitle(getTitle(room));
    toggleToolbar(room.state === 'ready');
   });

   Rooms.on('selected.ready', function(room) {
    showTitle(getTitle(room));
    toggleToolbar(true);
   });

   Rooms.on('selected.denied', function(room) {
    showTitle(getTitle(room));
   });

   Rooms.on('selected.topic.updated', showTopic);
  }//func


  function fixCSS() {
   var
//    css = document.styleSheets[document.styleSheets.length - 2],
    css = $('<style type="text/css"></style>'),
    cssFont = $('<style type="text/css"></style>'),
    rulesFont = ['@import url("https://fonts.googleapis.com/css2?family=PT+Sans+Narrow&display=swap")'],
    rules = [
     'body { font: 14px Arial; color: #000; }',
     'a, .side-subscriptions a, .hall-shuffle .link, .hall a, .message a { color: #1270b2; }',
     'select, textarea, input, a { outline: none !important; }',
     '.message { line-height: 14px; }',
     '.message a { color: #D5D6A5; }',
     '.message a:hover { text-decoration: none; }',   
     '.message, .sys { margin: 0 0 1px 0; width: 100%; }',
     '.speech { margin: 0px 0px 0px 1px; padding: 0 1px; }',
     '.speech-author > .nickname { margin: 4px 0 0px 0; display: inline-block; color: #ab5f1e; }',
     '.speech-author, .message { display: inline-block; }',
     '.date { box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 0px 0px, rgb(68, 68, 68) 0px 2px 0px 0px; height: 22px; border: 0; }',
     '#main span.nickname { text-decoration: underline; cursor: pointer; }',
     '#main span.nickname:hover { text-decoration: none; }',
     '#main, #side, .talk-reply, .talk-overlay, .entry-text, .hall, .date-text { background: #333; color: #bbb; box-shadow: none; }',
     '.date-text { top: 15px; padding: 0 4px 0 4px; color: #828282; font: normal 14px Arial; }',
     '#main, .header-main { left: 0; right: 21%; position: absolute; margin: 0; background: #333; box-shadow: none; }',
     '#header, .header-main, .header-toolbar { height: 48px; }',
//     '.side-content, .talk-content { top: 48px; }',
     '#side, .header-side { right: 0; width: 21%; position: absolute; }',
     '#side { overflow-y: hidden; }',
     '.header-side { background: #333; }',   
     '#header { box-shadow: none; }',
     '.talk-reply { margin: 0 0 24px 0}',
     '.header-title, .toolbar-title { padding: 9px 0; }',
     '.reply-form { min-height: auto; padding: 0 0 12px 0; margin: 0; }',
     '.reply-wrapper .userpic, #main .userpic { height: 22px; width: 226px !important; background-image: none !important; visibility: visible; left: 0; margin: -3px 3px 0 0; float: left; text-align: right; border: 0; }',
     '.reply-wrapper { padding: 0px 0px 0px 0px; margin: 0px 0px 0 0px; }',
     '#input, .talk-edit textarea, .textfield input { height: 16px !important; overflow-y: hidden; width: 64%;  border-radius: 20px; margin: 12px 0 0 0px; box-shadow: 1px 1px 0px 0px rgba(255, 255, 255, 0.45), -1px -1px 0px 0px rgba(0, 0, 0, 0.2); background-color: #444; color: #ccc; border: 0; padding: 3px 4px 3px 10px; } ',     
     '.talk-edit textarea { width: auto ; padding: 3px; box-shadow: none; border-radius: 2px; word-wrap: break-word; }',
     '.reply-send  { float: right; border: 0; margin: 3px 183px 0 0; position: relative; width: auto; height: auto; top: 0; right: 0;}',
     '.reply-field  { float: left; }',
     '#input { margin: 3px 0px 2px 232px; width: 420px; float: left; line-height: 16px; }',
     '.with-my-name, .speech.personal { padding: 0px 0px 0px 0px; margin: 0px 0px 1px 0px; background-color: #3e3e3e; border: 0; border-radius: 0; }',
     '.speech.personal { margin: 0 1px 1px 4px; }',
     '.talk-content { bottom: 74px; }',
     '.talk-edit { background: none; box-shadow: none; display: inline-block; }',
     '.msg-edit { background-position: 6px 3px; }',
     '.msg-time { display: none; left: -47px; top: 18px; color: #929292; font: normal 10px Tahoma; text-align: center; width: 21px; }',
     '.with-my-name time { left: 29px; top: 48px; }',
     '.speech > div:nth-child(2) > time { display: block; }',
     '.header-title, .toolbar-title { font-size: 18px; color: #8cafff; }',
     '.toolbar-title > span { color: #ff7600; display: inline-block; width: 100%; text-align: center; font: normal 20px "PT Sans Narrow"; position: absolute; left: -30px; }',   
     '.toolbar-tools { z-index: 1; }',
     '.user > .nickname { color: #000000; cursor: pointer; }',
     '.talk-archive, .talk-current { padding: 12px 0 0 0; }',
     '.side-content { position: relative; overflow-y: auto; background: none; }',
     '.user { border: 0; box-shadow: none; padding: 0; margin: 0 0 4px 0; line-height: 14px; white-space: nowrap; }',
     '.user .nickname { color: #bbb; text-decoration: underline; margin: 0 0 0 22px; }',
     '.user .nickname:hover { text-decoration: none; }',
     '.user .userpic { width: 14px; height: 14px; border: none; background-size: 100%; border-radius: 50%; margin: 0px 0 0 0; }',
     '.user em { vertical-align: 2px; margin: 0 0 0 2px; font: normal 11px Arial; color: #ffb817; }',
     '.user em.own { color: #ff6060; }',
     '.user em.adm { color: #54d89b; }',
     '.user em.mod { color: #74c3f1; }',    
     '.user.me:after { top: 0; }',
     '.users-list { margin: 0; }',
     '.sys { color: #ffcc00; padding-left: 240px; }',
     '.room-users { margin: 0 0 0 13px; }',
     '.cbutton { text-decoration: none; position: relative; display: inline-block !important; cursor: pointer; background-color: #555; border-radius: 2px; color: #fff; width: 48px; height: 22px; margin: 1px 3px 0 0px; box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.26), 0px 1px 0px 0px rgba(255, 255, 255, 0.3) inset; font: normal 12px/13px "PT Sans Narrow"; }',
    '.cbutt-active { color: #ffcc00; }',
    '.cbutton span { display: inline-block; position: absolute; height: 15px; text-align: center; top: 0px; left: 0px; bottom: 0px; right: 0px; text-shadow: rgba(0, 0, 0, 0.4) -1px -1px 0px; font: 12px/13px "PT Sans Narrow"; margin: auto; }',
    '.cbutton:active span, .button-down span { margin: 5px 0 0 0px; }',
    '.cbutton:active, .button-down, #room-settings .alarm-off .button:active { margin: 0 3px 0 0px; background-color: #454545; box-shadow: 0px -1px 0px rgba(255, 255, 255, .2) inset, 0px 1px 0px rgba(0, 0, 0, 0.5) inset, 1px 0px 0px rgba(0, 0, 0, 0.5) inset, -1px 0px 0px rgba(0, 0, 0, 0.5) inset; }',
    '#room-settings .submit { padding: inherit; display: block; }',
    '#room-settings .submit .cbutton { margin: 0 20px 14px 0; padding: 0 1px; }',
    '#room-settings .alarm-off .cbutton { width: 360px; margin: 1px 0; }',
    '#room-settings .alarm-off .button { border: 0; background: none; background-image: none; padding: 0; font-size: inherit;   line-height: inherit; box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.26), 0px 1px 0px 0px rgba(255, 255, 255, 0.3) inset;}',
    '#room-settings .cbutton { background-color: #555 !important; }',
    '#room-settings .alarm-off .button:active { margin: 1px 3px 1px 0px; }',
    '.room-remove { background: none; border: 0; box-shadow: none; }',
    '.room-remove .link { color: #ff4131; }',
    '.alarm-active { padding: 3px 14px; border-radius: 2px; font-size: 14px; line-height: inherit; }',
    '.alarm-cancel { top: -3px; }',
    '.textfield input { padding: 10px 0 9px 13px; }',
    '#go { background-color: #1A64B4; }',
    '#pvt { background-color: #2C8046; }',
    '.filter-my { background: #555; border-color: none; width: 81px; margin: 12px 0 0 0; }',
    '.filter-my:active { margin: 13px 0 0 0; }',
    '.filter-my-selected { background: #2a707b; }',
    '.toolbar-settings { margin: 0px 4px 0 10px; }',
    '.popup, .popup-scroll, .profile-userpic { margin: 0; padding: 0; }',
    '.profile-section, .popup-content { border-radius: 0; background: none; }',
    '@keyframes profile-zoom { from { opacity: 0; } to { opacity: 1; }}',
    '.profile-close, .profile-edit-button, .profile-photo:after, .nickname-hint, .reply-warning { display: none !important; }',
    '#profile { width: auto; max-width: 156px; max-height: 202px; }',
    '.profile-role { max-width: 156px; max-height: 202px;  }',
    '#profile .popup-content { margin: 0; width: auto; max-width: 156px; max-height: 202px; transform-origin: none; animation: .1s ease-out profile-zoom;  }',
    '.profile-photo { max-width: 156px; max-height: 202px; margin: 0; border-color: rgba(255, 255, 255, 0.85) !important; padding: 0;  border-radius: 2px; background-color: #333;  border: 1px solid #555;   }',
    '.profile-photo-img { max-width: 152px; width: auto; max-height: 198px; }',
    '.profile-actions, .profile-nickname, .profile-status, .updated-notice { display: none !important; }',
    '.popup-scroll { overflow-y: hidden; }',
    '#uinfo { z-index: 10000; color: #bbb; padding: 5px; width: 417px; height: 500px; font-size: 12px; background-color: #303030; box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 31px 13px; border: 1px solid #555; display: none; border-radius: 4px; }',
    '#uinfo h4 { margin: 0 0 5px 0; padding: 1px 3px 3px 6px; border-radius: 2px; background-color: #5272af; color: #fff; font: normal 13px/15px "PT Sans Narrow"; padding: 3px 0 3px 5px; }',
//    '#uinfo .cont { position: relative; height: 440px; overflow-y: auto; }',
    '#uinfo .cont { position: relative; height: 474px; overflow-y: auto; }',
    '#uinfo .cont img { max-height: 440px; max-width: 413px; }',
    '#uinfo .cont .uadm { margin: 440px 0 0 0; display; none; }',
    '.uadm > div:first-child { text-align: center; padding: 3px; margin: 0 5px 4px 5px; background: #B13E3E; color: #fff; border-radius: 2px; cursor: pointer; }',
    '.uadm ul, .uadm li { padding: 0; list-style-type: none; }',
    '.uadm ul { margin: 0px 0 13px 5px; }',
    '.uadm li { margin: 0px 7px 3px 7px; }',
    '.uadm li:first-child { background: #626263; color: #fff; padding: 3px 9px; border-radius: 2px; margin: 0 5px 8px 0; }',
    '.uadm label { cursor: pointer; position: relative; bottom: 2px; left: 5px; font: normal 13px Arial; }',
    '.uadm label:hover { color: #eee; }',
    '#uinvite li { margin: 0; }',
    '#uinvite li:first-child { margin: 0px 5px 9px 0px; background: #98435e; text-align: center; }',
    '#uinvite li > span { display: inline-block; padding: 0px; text-align: center; margin: 0; width: 49%; background: #866f5f; color: #fff; cursor: pointer; padding: 3px 0 4px 0; border-radius: 2px; }',
    '#uinvite li > span:last-child { margin-left: 3px; background: #6983cc; }',
    '#uinvite .esc { color: #5d3232; display: inline-block; margin: 0 0 0 5px; }',
    '#uinvite .esc:hover { color: #d6bdb7; display; none; }',
    '.button-block .cbutton { width: 67px; margin: 0 0 3px 0; }',
    '.button-block { text-align: center; }',   
    '.center { margin: auto; position: absolute; left: 0; right: 0; top: 0; bottom: 0; }', 
    'h4 > span:nth-child(1) { background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAFRJREFUeNqUkVEKACAIQ1O6/5UXQYHoFPVHiT2dKQDWJPbLmAI3pKGH+odM+AsPCIFgpyvpZiF4q5pYECauACT2KGA7B0irBRnEfinbKRyude0jwABuQRMZLbnjWAAAAABJRU5ErkJggg==") no-repeat; margin: 1px 5px 0 0; float: right; cursor: pointer; width: 12px; height: 12px; padding: 0; }',
    'h4 > span:active { margin-top: 2px; }',
    '.header-date:before, .talk-load { border-radius: 2px !important; background: #333333; }',
    '.talk-load { background: #464646; box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 1px 8px 0 rgba(0,0,0,0.20); border: none; }',
    '.popup-content { background: #303030; color: #bbb; box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 31px 13px; border: 1px solid #555; border-radius: 4px; }',
    '#settings-subscription, .settings-section, #room-settings .submit { background: none; }',
    '.settings-section { border: none !important; padding: 0 20px; }',
    '#settings-subscription, .userpic-highlight { box-shadow: none !important; }',
    '.popup-content { margin: 31px 23px 23px 23px; }',   
    '.toolbar-settings:hover { animation: anim-sett 4s 1; }',
    '@-webkit-keyframes anim-sett { 0% { -webkit-transform: rotate(0deg); }  100% { -webkit-transform: rotate(360deg);  } }',
     '.talk-content { overflow-y: auto; }',
     
    '::-webkit-scrollbar { width: 15px; height: 15px;}' ,
    '::-webkit-scrollbar-track { background-color: #444; box-shadow: -1px 0px 0 0 rgba(0, 0, 0, .8), inset -1px 0px 0 0 rgba(255, 255, 255, .1); }',
    '::-webkit-scrollbar-button, ::-webkit-scrollbar-thumb { background-color: #646464; box-shadow: inset 1px 1px 0 0 rgba(255, 255, 255, .15); border-bottom: 1px solid #333; }',
    '::-webkit-scrollbar-button { box-shadow: inset 1px 1px 0 0 rgba(255, 255, 255, .1); }',
    '::-webkit-scrollbar-thumb:hover { background-color: #747474; box-shadow: inset 1px 1px 0 0 rgba(255, 255, 255, .20); }',
    '::-webkit-scrollbar-button:start:hover, ::-webkit-scrollbar-button:end:hover { background-color: #747474; }',
    '::-webkit-scrollbar-button:start { background: #646464 url(https://storage.googleapis.com/google-code-archive-downloads/v2/code.google.com/vallalarblogs/ui-icons_222222_256x240.png) 0px -17px no-repeat; }',
    '::-webkit-scrollbar-button:end { background: #646464 url(https://storage.googleapis.com/google-code-archive-downloads/v2/code.google.com/vallalarblogs/ui-icons_222222_256x240.png) -65px -16px no-repeat; }',
   '::-webkit-scrollbar-thumb { background: #646464 url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAICAYAAAA1BOUGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACZJREFUeNpilJSU/M+ABTx79oyR8f9/sJwiNgUwSayAcbAZCxBgABQfG1RlN8gCAAAAAElFTkSuQmCC") 5px 50% no-repeat; }',
   '::-webkit-scrollbar-thumb:active { background: #646464 url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAICAYAAAA1BOUGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAC1JREFUeNpiZGBgcGXAAv7//7+bEcza9f8/AykAqJOBcSCMBavYzYDVWIAAAwDFjxwg64mVnwAAAABJRU5ErkJggg==") 4px 49.5% no-repeat; background-color: #646464; box-shadow: inset 1px 1px 0 0 rgba(255, 255, 255, .15); }',
   '::selection { background-color: #bf8ec5; color: #fff; }'
   ];


/*
   $(rules).each(function(k, v) {
    css[0].insertRule(v, css.cssRules.length);
   });
   */
   $('head').append(css.html(rules.join('\n')));
   $('body').append(cssFont.html(rulesFont.join('\n')));

   $('.side-content').height($(window).height() - $('.talk-reply').height() - 71);

  }//func


  function profileShow() {

   $.popup = function(selector, show, hide) {
    var self = $(selector);
    var elem = self.find('.popup-content').get(0) || self.get(0);
    function clickout(event) {
     if (!event.button && elem !== event.target && !$.contains(elem, event.target)) self.hide();
    }
    function escape(event) {
     if (event.which === 27 || event.keyCode === 27) self.hide();
    }
    show = show || self.show;
    hide = hide || self.hide;
    self.show = function() {
        document.addEventListener('touchstart', clickout, true);
//        document.addEventListener('mousedown', clickout, true);
        document.addEventListener('keydown', escape, true);
        show.apply(self, arguments);
    };
    self.hide = function() {
        document.removeEventListener('touchstart', clickout, true);
//        document.removeEventListener('mousedown', clickout, true);
        document.removeEventListener('keydown', escape, true);
        hide.apply(self, arguments);
    };
    return self;
   };


   var
    $popup = $.popup('#profile'),
    $content = $popup.find('.popup-content'),
    $scroller = $popup.find('.popup-scroll'),
    $sections = $popup.find('.profile-section');

   function getCenter(target) {
    var
     rect = target.getBoundingClientRect();

    return {
     top: Math.round((rect.top + rect.bottom) / 2),
     left: Math.round((rect.left + rect.right) / 2)
    };
   }

   function preloadPhoto(role, context) {
    if(role.photo) {
     var
      img = new Image();

     img.src = '/photos/' + role.photo;
     img.onload = function() {
      Profile.trigger('ready', role, img);
      Profile.fit();
      $popup.css({
      	left: context.left - $('#profile').width() - 20,
      	top: context.top
      });
     };
    } else {
     Profile.trigger('ready', role);
     Profile.fit();
     $popup.css({
      left: context.left - $('#profile').width() - 20,
      top: context.top
     });
    }
   }


   Profile.fit = function() {
    if(!this.context || !this.context.top) return;
    var
     wh = window.innerHeight,
     ch = $content.height(),
     top = Math.min(this.context.top - 55, wh - ch - 25);
     
    if(top < 15) {
     $popup.css('top', 15);
     $scroller.height(wh - 20).scrollTop(15 - top);
    } else {
     $popup.css('top', top);
     $scroller.height('');
    }
   };


   Profile.show = function(role, context, edit) {
    var
//     pm = $popup.find('#profile-moderate'),
     me = Rooms.selected.isMy(role);
   
    $sections.hide();
    Profile.role = role;
    Profile.context = context;
//    Profile.profileModerate = pm.clone(true);

    Profile.trigger(edit ? 'edit' : 'show', role, me);
    if(!context.nickname) context.nickname = role.nickname;
    $popup.find('#profile-moderate').hide();
    $popup.show();

//    Profile.fit();

    if(role.message_id) {
     Rest.roles
      .get(role.role_id)
      .done(function(data) {
       $.extend(role, data);
       preloadPhoto(role, context);
      })
    } else preloadPhoto(role, context);

   };

  }//func


  function fixSmoothScroll() {
   var
    content = Talk.content.get(0),
    scroller = $({}),
    interrupted;

   function setPosition(value) {
    content.scrollTop = Math.round(value);
   }

   function getDuration(a, b) {
//   return 10 + Math.abs(a - b) * 1;
    return 0;
   }

   function isNear(element) {
    return element && element.getBoundingClientRect().top - content.getBoundingClientRect().bottom < 10;
   }

   function scrollEnd() {
    Talk.content.dequeue();
   }

   Talk.scrollFurther = function(node) {
    this.content.queue(function(next) {
     var
      cur = content.scrollTop,
      pos = content.scrollHeight - content.offsetHeight - 1;

     if(pos > cur && !interrupted && node.parentNode && isNear(node)) {
      scroller[0].position = cur;
  
      scroller
       .animate({position: pos}, {
        complete: scrollEnd,
        duration: getDuration(cur, pos),
        step: setPosition
       });

      setTimeout(function() {
       $('.talk-content').scrollTop($('.talk-content')[0].scrollHeight + 1000);
        }, 10);
     } else next();
    });
   };
  }//func


  function messageModify() {
   var
    renderSpeech = $.template(
     '<div><div class="speech">' +
     '<span class="speech-author" data-role="{role_id}">' +
//'<div class="userpic" style="background-image: url({userpicUrl});"></div>' +
     '<span class="nickname" style="color: #{nickColor};">{nickname}</span>' +
     '</span>' +
     '</div></div>'),

    renderRecipient = $.template('#recipient-template'),
    renderMessage = $.template(
     '<div><span class="message" style="color: #{messColor};" data-id="{message_id}"><span data-role="{role_id}" href="#" style="color: #{nickColor};" class="nickname">{nickname}</span>: {content}' +
//    '<time class="msg-time" datetime="{created}">{time}</time>' +
     '<span class="msg-text"></span>' +
     '</span></div>'),

    edit = $('<span class="msg-edit" title="Редактировать сообщение"></span>')[0];

   function Message(data) {
    var
     created = new Date(data.created),
     message = renderMessage({
      message_id: data.message_id,
      created: data.created,
      content: Talk.format(data.content) || '…',
      time: created.toHumanTime(),
      messColor: Colors[data.nickColor][1],
      role_id: data.role_id,
      nickname: data.nickname,
      nickColor: Colors[data.nickColor][0]
     });

    if(data.isMy) {
//          if (created.daysAgo() < 2) message.find('.msg-text').append(edit.cloneNode(true));
    } else if(data.mentionsMe) message.addClass('with-my-name');
   
    this.timestamp = created.getTime();
    this.date = created.toDateString();
    this.node = message[0];
    this.data = data;
   }

   Message.prototype.appendTo = function(parent, previous) {
    var
     sys = $(parent).find('.sys'),
     snode = sys.length ? sys.parent()[0] : previous.node ? previous.node.parentNode : false;

    if(oneSpeech(previous, this))
     snode.appendChild(this.node).parentNode.appendChild($('<br>')[0]); else {
      if(this.date !== previous.date) parent.appendChild(Talk.getDate(this.date).node);
      appendSpeech(this.data, parent).appendChild(this.node);
     }
      
    return this;
   };

   function oneSpeech(a, b) {
    return a.date === b.date && b.timestamp - a.timestamp < 3600000 * 3 && oneContext(a.data, b.data);
   }

   function oneContext(a, b) {
    return a.role_id === b.role_id && a.nickname === b.nickname && a.recipient_role_id == b.recipient_role_id;
   }

   function appendSpeech(data, parent) {
    var
     speech = renderSpeech({
      role_id: data.role_id,
      nickname: data.nickname,
      nickColor: Colors[data.nickColor][0],
      userpicUrl: Userpics.getUrl(data)
     }),
     node = speech[0],
     recipient_id = data.recipient_role_id;

    if(recipient_id) {
     var
      recipient = renderRecipient({
       role_id: recipient_id,
       nickname: recipient_id === Room.myRole.role_id ? 'я' : data.recipient_nickname
      });
       
     speech.find('.speech-author').append(recipient);
     speech.addClass('personal');
    }
      
    parent.appendChild(node);
    $(node).find('.speech-author').remove();
    return node;
   }


   Talk.createMessage = function(data) {
    var
     room = Rooms.selected,
     role = getRole(data.role_id);
//     uObj = getUserObj('role_id', data.role_id);

    data.isMy = room.isMy(data);
//    log(role);
//    log(data.role_id);
    
//    data.nickColor = uObj.nickColor || 0;
//    data.nickColor =  0;
    data.nickColor =  role && role.nickColor ? role.nickColor : 0;
    if(!data.isMy && data.mentions) data.mentionsMe = room.mentionsMe(data.mentions);
    return new Message(data);
   };
  }//func


  function filterForMe() {
   var
    toolbar = $('.header-toolbar'),
    control = $('.filter-my');

   Rooms.on('selected.ready', function(room) {
    control.toggleClass('filter-my-selected', room.forMeOnly === true);
   });

   control.on('click', function() {
    if(toolbar.data('wasDragged')) return;

    var
     room = Rooms.selected;
     room.forMeOnly = !room.forMeOnly;
     Talk.forMeOnly = room.forMeOnly;
     control.toggleClass('filter-my-selected', Talk.forMeOnly);
     Talk.content.addClass('talk-loading');
     Talk.loadRecent();
    });
  }//func




  function Moderator() {
// [не пускать] [пригласить]
// [выгнать] [назначить]

   var
    notToLet = $('<span class="moder-rej">Не пускать</span>'),
    banRelease = $('<span class="esc">[ отменить ]</span>'),
    banish = $('<span class="banish">Выгнать</span>'),
    $request = $('#uinvite');

   notToLet.click(function(e) {
    Profile.role = Role;
    Profile.send({
     come_in: false
    });
   });

   banish.click(function(e) {
//выгнать
    Profile.role = Role;
    Profile.send({
     level: Profile.role.user_id ? 10 : 0,
     come_in: false
    });
   });

   banRelease.click(function(e) {
    e.stopPropagation();
//отменить изгнание
    Profile.role = Role;
    Profile.send({
     level: Rooms.selected.data.level,
     come_in: null
    });
   });

//пригласить
   $request.find('.moder-inv').on('click', function() {  
    Profile.role = Role;
    Profile.send({
     level: Rooms.selected.data.level,
     come_in: null
    }); 
   });

   Profile.on('moderated', function(state) {
    var
     room = Rooms.selected,
     myLevel = room.myRole.level;

//    log(Role);

    Profile.role = Role;
    notToLet = notToLet.clone(true);
    banRelease = banRelease.clone(true);
    banish = banish.clone(true);

//Role.level = 20 - member of room. Role.level = 0 - not member
//   	log(state);
//log(Rooms.selected.myRole.level);

   	switch(state) {
   	 case 'banished':
      $request.find('.moder-rej').unbind('click').html('<span>Не может войти</span>').append(banRelease);
      $('#ulevel, #uignore').slideUp();
   	 break;
   	 case 'guest':
//   	  if(Role.level >= 20) $request.hide(); else $request.show();
      $request.find('.moder-rej').unbind('click').html(banish);

      if(Role) checkedSet($('#ulevel input[type=radio]'), Role.level);

      if(myLevel >= 50) $('#uignore').slideDown(); else $('#uignore').slideUp();

      if(myLevel >= 70) {
       if(myLevel < 80) $('#ulevel > li').eq(4).remove();
       $('#ulevel').slideDown();
      } else $('#ulevel').slideUp();

   	 break;
   	 case 'request':
      $request.find('.moder-rej').replaceWith(notToLet);
   	 break;  	
   	}//sw

   });

  }//func


  function Admin() {
   var
    topic = $('#edit-room-topic'),
    hash = $('#edit-room-hash'),
    watched = $('#edit-room-watched'),
    levels = $('.room-levels input'),
    submit = $('#room-settings .cbutton.submit');

   function validateHash(value, full) {
    if(/[^a-zA-Z\d\-+]/.test(value)) return false;
    if(full && value.length < 3) return false;
    if(value.length > 32) return false;
    return true;
   }

   function filterChanged(current, data) {
    var
     value,
     empty = true,
     changed = {};

    for(var key in data) {
     value = data[key];
     if(value !== current[key]) {
      changed[key] = value;
      empty = false;
     }
    }
    
    if(!empty) return changed;
   }

   function updateRoom(room) {
    var
     data = filterChanged(room.data, {
      topic: topic.val(),
      hash: hash.val(),
      //searchable: searchable.prop('checked') ? 1 : 0,
      watched: watched.prop('checked') ? 1 : 0,
      level: Number(levels.filter(':checked').attr('value') || room.data.level)
     });
 
    if(!data) {
     Settings.hide();
    } else if (data.topic === '') {
     topic.val().focus();
    } else if (data.hash && !validateHash(data.hash, true)) {
     hash.focus();
    } else {
     submit.prop('disabled', true);
     Rest.rooms
      .update(room.data.hash, data)
      .always(function() {
       submit.prop('disabled', false);
      })
      .done(function() {
       Settings.hide();
      })
      .fail(showError);
    }
   }

   function showError(error) {
    if(error.status === 409) {
     var
      context = hash.parent();
   
     context.append('<p class="error">Увы, этот адрес уже занят, выберите другой</p>');
     hash.one('input', function() {
      context.find('.error').remove();
     });
    }
   }

   submit.on('click', function() {
    if(!this.disabled) updateRoom(Rooms.selected);
   });

  }//func


  function init() {
   var
    i,
    j,
    u,
    div,
    uinfo = $('<div id="uinfo"><h4>Информация<span title="Закрыть"></span></h4>' +
	 '<div class="cont">' +
	  '<img class="center" />' +
	  '<div class="uadm">' +
	  '<div onclick="admToggle()">Администрирование</div>' +
	  '<div>' +
	   '<ul id="uignore"></ul>' +
	   '<ul id="ulevel"></ul>' +
	   '<ul id="uinvite"></ul>' +
	  '</div></div></div></div>');

    $('body').append(uinfo);

/*

 $.getStylesheet = function(href) {
    var
     $d = $.Deferred(),
     $link = $('<link/>', {
       rel: 'stylesheet',
       type: 'text/css',
       href: href
    }).appendTo('head');
    $d.resolve($link);
    return $d.promise();
  };


*/


   (function($){
    $.fn.extend({
     center: function (options) {
      var
       options = $.extend({
        inside: window,
        transition: 0,
        minX: 0,
        minY: 0,
        withScrolling: true,
        vertical: true,
        horizontal: true
       }, options);
      
      return this.each(function() {
       var
        props = { position: 'absolute' };

       if(options.vertical) {
        var
         top = ($(options.inside).height() - $(this).outerHeight()) / 2;
         
        if(options.withScrolling) top += $(options.inside).scrollTop() || 0;
        top = (top > options.minY ? top : options.minY);
        $.extend(props, {top: top + 'px'});
       }
        
       if(options.horizontal) {
        var
         left = ($(options.inside).width() - $(this).outerWidth()) / 2;
        
        if(options.withScrolling) left += $(options.inside).scrollLeft() || 0;
        left = (left > options.minX ? left : options.minX);
        $.extend(props, {left: left + 'px'});
       }
        
       if(options.transition > 0) $(this).animate(props, options.transition); else $(this).css(props);
       return $(this);
      });
     }
    });
   })(jQuery);


   $(window).bind('resize', function() {
    $('#uinfo').center({transition: 100});
   });

   $.getScript('https://code.jquery.com/ui/1.12.1/jquery-ui.min.js')
    .done(function() {
     uinfo.draggable({ handle: 'h4' })
      .find('h4').dblclick(function() {
       uinfo.hide().removeData();
      })
      .find('span:first').click(function() {
       uinfo.hide().removeData();
      });

    uinfo.center();
   });//done


   div = $('<ul><li>Назначить статус пользователю</li></ul>');
   j = 0;

   for(i in uLevel) {
    j++;
    (function(key, j) {
     u = $('<li><input' + (j == 1 ? ' checked' : '' ) + ' id="ul' + j + '" type="radio" name="ulev" value="' + i + '" /><label for="ul' + j + '">' + uLevel[i] + '</label></li>');
     div.append(u);
    })(i, j);
   }//for

   $('#ulevel').append(div.children());

   div = $('<ul><li>Забанить пользователя</li></ul>');
   j = 0;
   
   for(i in uIgnored) {
   	j++;
    (function(i) {
     u = $('<li><input' + (j == 1 ? ' checked' : '' ) + ' id="ui' + j + '" type="radio" name="uign" value="' + i + '" /><label for="ui' + j + '">' + uIgnored[i] + '</label></li>');
     div.append(u);
    })(i);
   }//for

   $('#uignore').append(div.children());

   div = $('<ul><li>Модерирование</li><li><span class="moder-rej">Не пускать</span><span class="moder-inv">Пригласить</span></li></ul>');
   $('#uinvite').append(div.children());

   $('.uadm > div:nth-child(2)').append($('<div class="button-block"><a title="Применить изменения" class="cbutton" onclick="userStatusEdit()"><span>Применить</span></a><div>'));

   $('.reply-send').html(
    '<a title="Отправить сообщение" id="go" tabindex="2" class="cbutton" onclick="sendMess(\'nosec\');"><span>Тадам</span></a>' +
    '<a title="Шепнуть приватно" id="pvt" tabindex="3" class="cbutton" onclick="sendMess(\'sec\');"><span>Приват</span></a>' +
    '<a title="Стереть текст сообщения" tabindex="4" class="cbutton" onclick="$(\'#input\').val(\'\').focus();"><span>Clear</span></a>').unbind();

   $('.reply-field textarea').replaceWith($('<input tabindex="1" id="input" class="" type="text" placeholder="текст сообщения" maxlength="" />'));
   
   $('.toolbar-filter.filter-my').replaceWith($('<a id="withme" title="Сообщения: от меня и для меня" class="cbutton filter-my-selected filter-my"><span>Мне и от меня</span></a>'));
   
   var
    rcont = $('#room-settings .popup-content');

   rcont.find('.alarm-off .button').replaceWith($('<a title="" class="button cbutton"><span>Объявить тревогу</span></a>'));
   rcont.find('.submit button').replaceWith($('<a title="" class="cbutton submit"><span>Готово</span></a>'));
   
   
   $(document)
    .click(function() {
     $('.reply-form .cbutton').removeClass('button-down');
    })
    .keyup(function(e) {

     switch(e.keyCode) {
//Tab
      case 9:
       if(!$('.reply-form :focus').length) $('#go').focus();
       $('.reply-form .cbutton').removeClass('button-down');
       $('.reply-form :focus').addClass('button-down');
       e.preventDefault();
      break;
//Esc
      case 27:
       $('#input').val('');
       $('.reply-form .cbutton').blur();
       $('.reply-form .cbutton').removeClass('button-down');
       input.focus();
       e.preventDefault();
      break;

      case 13:
       switch($('.reply-form :focus').attr('id')) {
       	case 'go': return sendMess('nosec');
       	case 'pvt': return sendMess('sec');
       }//sw

       e.preventDefault();
      break;

    }//sw
   });
   
   $('#input')
    .keydown(function(event) {
     if(/(10|13)/.test(event.keyCode)) sendMess('nosec');
    })
    .keyup(function(e) {
     switch(e.keyCode) {
      case 38:
       historyMessKbd(-1);
       e.preventDefault();
      break;
      case 40:
       historyMessKbd(1);
       e.preventDefault();
      break;
     }//sw
    })
    .on('wheel', function(e) {
     historyMessKbd(e.originalEvent.deltaY);
    });


   window.userStatusEdit = function() {
    var
     lev = $('#ulevel :radio[name=ulev]').filter(':checked').val(),
     exp = $('#uignore :radio[name=uign]').filter(':checked').val();
   
    if(exp !== null) exp *= 60;
    Profile.role = Role;
    if(exp == 0) Profile.send({ignored: false}); else {
     Profile.send({ignored: true});
     setTimeout(function() {Profile.send({expired: exp}); }, 0);
    }
    
    if(Role.level != lev) setTimeout(function() {Profile.send({level: lev}); }, 0);
    $('#uinfo').removeData().fadeOut(150);
   }//func


   window.admToggle = function() {
    $('.uadm > div:nth-child(2)').slideToggle(200);
    $('.cont').animate({ scrollTop: $('.cont')[0].scrollHeight }, 200);
   }//func


   window.checkedSet = function(arr, val) {
    arr.each(function(k, v) {
     if($(v).val() == val) {
      $(v).prop({checked: true});
      return false;
     }
    });
   }//func


  }//func

  fixSmoothScroll();
  fixCSS();
  headerModify();
  messageModify();
  profileShow();
  userOnlineModify();
  messageSendModify();
  init();
  filterForMe();
  Moderator();
  Admin();


 })();
//}//if match chat
