// ==UserScript==
// @name        Director de pista
// @namespace   http://fktext.bplaced.net/ringmaster
// @description Zaehlt die Gewinne bei Events und dem Wanderzirkus mit. (Cuenta las recompensas de eventos y del circo ambulante.)
// @include     *.the-west.*/*game.php*
// @exclude     *.the-west.*/index.php?page=logout*
// @version     1.2
// @grant       none
// @author      stayawayknight (traducido por pepe100)
// @downloadURL https://update.greasyfork.org/scripts/12122/Director%20de%20pista.user.js
// @updateURL https://update.greasyfork.org/scripts/12122/Director%20de%20pista.meta.js
// ==/UserScript==
function contentEval(source) {
  if ('function' == typeof source) {
    source = '(' + source + ')();'
  }
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = source;
  document.body.appendChild(script);
  document.body.removeChild(script);
}
Ringmaster = function () {
  Ringmaster = {
    initialized: false,
  };
  var div = $('<div class="ui_menucontainer">/');
  var imagelink = '<div title="Director de pista" class="menulink" style="background: url(' + 'https://westdes.innogamescdn.com/images/forum/icon/cardsharper.png' + '); background-size: 25px 25px; background-position: 0px 0px;"></div>';
  var link = $(imagelink);
  link.click(function () {
    Ringmaster.run();
  });
  div.append(link);
  div.append('<div class="loptions"></div><div class="menucontainer_bottom"></div>');
  $('#ui_menubar').append(div);
  //Skript ausfuehren (Ejecutar script)
  Ringmaster.run = function ()
  {
    var countData = JSON.parse(localStorage.getItem('ringmaster'));
    var win = wman.open('Director de pista').setResizeable(false).setMinSize(400, 250).setSize(450, 300).setMiniTitle('Director de pista').setTitle('<img src="https://westdes.innogamescdn.com/images/forum/icon/cardsharper.png" width="25"/> Director de pista');
    var content = $('<div style="overflow-y: auto; height: 210px; max-height: 300px; width: 400;">');
    var contentString = '<h2>Ganancias de Eventos:</h2><table cellspacing="10">';
    if (countData != null)
    {
      var numberOfPlays = 0;
      var numberOfSections = new Array(0, 0, 0, 0);
      //Alle Spiele zaehlen (incluir todas las jugadas)
      for (var i = 0; i < countData.length; i++)
      {
        numberOfPlays += countData[i].value;
        if (countData[i].section == 'grey')
        {
          numberOfSections[0]++;
        } 
        else if (countData[i].section == 'green')
        {
          numberOfSections[1]++;
        } 
        else if (countData[i].section == 'blue')
        {
          numberOfSections[2]++;
        } 
        else if (countData[i].section == 'gold')
        {
          numberOfSections[3]++;
        }
      }
      //Tabelle erstellen (Crear tabla)

      for (var i = 0; i < countData.length; i++)
      {
        contentString += '<tr><td align="left" valign="center" style="background-color: ' + Ringmaster.convertColorName(countData[i].section) + ';"><a class="itemlink hasMousePopup" href="javascript:void(0)" title="' + Ringmaster.escapeHTML(new ItemPopup(ItemManager.get(countData[i].item)).getXHTML()) + '"><img width="25" height="25" src="' + ItemManager.get(countData[i].item).image + '"> ' + ItemManager.get(countData[i].item).name + '</a></td>';
        contentString += '<td align="center" valign="center">' + countData[i].value + '</td>';
        contentString += '<td align="center" valign="center">' + Math.round(countData[i].value / numberOfPlays * 100) + '%</td></tr>';
      }
      contentString += '</table><h2>Estadísticas por categoría:</h2><table cellspacing="10">';
      contentString += '<tr><td style="background-color: rgba(128, 128, 128, 0.4);">Común:</td><td>' + numberOfSections[0] + '</td><td>' + Math.round(numberOfSections[0] / numberOfPlays * 100) + '%</td></tr>';
      contentString += '<tr><td style="background-color: rgba(0, 128, 0, 0.4);">No común:</td><td>' + numberOfSections[1] + '</td><td>' + Math.round(numberOfSections[1] / numberOfPlays * 100) + '%</td></tr>';
      contentString += '<tr><td style="background-color: rgba(0, 0, 255, 0.4);">Raro:</td><td>' + numberOfSections[2] + '</td><td>' + Math.round(numberOfSections[2] / numberOfPlays * 100) + '%</td></tr>';
      contentString += '<tr><td style="background-color: rgba(255, 215, 0, 0.4);">Muy raro:</td><td>' + numberOfSections[3] + '</td><td>' + Math.round(numberOfSections[3] / numberOfPlays * 100) + '%</td></tr></table>';
    } 
    else
    {
      contentString += 'No hay datos grabados.';
    }
    contentString += '<br><input type="button" value="Reiniciar datos grabados" id="ringmaster_reset">';
    content.append(contentString);
    win.appendToContentPane(content);
    $("#ringmaster_reset").click(function(){
      delete localStorage.ringmaster;
      new MessageSuccess("Los registros se reiniciaron con éxito!").show();
      Ringmaster.run();
    });
  }
  Ringmaster.escapeHTML = function (e)
  {
    return String(e).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };
  Ringmaster.convertColorName = function (name)
  {
    if (name == 'grey')
    {
      return 'rgba(128, 128, 128, 0.4)';
    } 
    else if (name == 'green')
    {
      return 'rgba(0, 128, 0, 0.4)';
    } 
    else if (name == 'blue')
    {
      return 'rgba(0, 0, 255, 0.4)';
    } 
    else if (name == 'gold')
    {
      return 'rgba(255, 215, 0, 0.4)';
    } 
    else
    {
      return '';
    }
  };
	//Funktionen ueberschreiben: (Función Sobreescribir:)
  Config.addChangeListener('marketcampaign.msg', function (data) {
    if ('' != data) GameGift.enqueue('marketcampaign', data);
    Config.set('marketcampaign.msg', '');
  });
  Config.addChangeListener('newInvitedPlayer', function () {
    GameGift.enqueue('alforja');
  });
  GameGift = function () {
    var queue = [
    ];
    var next = function () {
      if (queue[0].payload[2])
      queue[0].payload[2]();
      queue.shift();
      if (queue[0]) showPopup(queue[0]);
    };
    var showPopup = function (data) {
      var handler = types[data.type];
      if (undefined === handler) return null;
      var popup = new tw2widget.reward.RewardDialog('Recompensas exclusivas', undefined, next);
      if (!handler(popup, data.payload)) {
        next();
        return null;
      }
      popup.show();
    };
    var types = {
      marketcampaign: function (popup, payload) {
        var c = null;
        if (undefined !== payload.item_id)
        c = helpers.item(payload.item_id, payload.item_count);
         else if (undefined !== payload.nuggets)
        c = helpers.nugget(payload.nuggets);
        popup.setTitle(payload.title ? payload.title : 'Hola!').setSubtitle(payload.message ? payload.message : 'Sus Recompensas exclusivas').setContent(c);
        return true;
      },
      sattlebag: function (popup, payload) {
        popup.setSubtitle('Bono de registro único').setContent(helpers.item(13711000));
        return true;
      },
      wof: function (popup, payload) {
        popup.setTitle(unescape('Enhorabuena')).setSubtitle('Su objeto ganado').setContent($('<div class=\'wof-prize-section\' style=\'margin-top:-10px;\' />').append('<div class=\'section-border\' />', '<div class=\'section-bg\' style=\'background:' + payload[1] + '; \'/>', $('<div class=\'section-content\'>').append(helpers.item(payload[0]))));
        if (typeof localStorage.ringmaster === 'undefined') {
          localStorage.setItem('ringmaster', JSON.stringify(new Array({
            item: payload[0],
            section: payload[1],
            value: 1
          })));
        } 
        else
        {
          var countData = JSON.parse(localStorage.getItem('ringmaster'));
          for (var i = 0; i < countData.length; i++)
          {
            if (countData[i].item == payload[0])
            {
              countData[i].value++;
              countData[i].section = payload[1];
              localStorage.ringmaster = JSON.stringify(countData);
              Ringmaster.run();
              return true;
            }
          }
          countData.push({
            item: payload[0],
            section: payload[1],
            value: 1
          });
          localStorage.ringmaster = JSON.stringify(countData);
        }
        Ringmaster.run();
        return true;
      }
    };
    var helpers = {
      item: function (itemid, itemcount) {
        var itemobj = ItemManager.get(itemid);
        if (undefined == itemobj) return false;
        var widget = new tw2widget.InventoryItem(itemobj);
        if (itemcount !== undefined && itemcount > 1) widget.setCount(itemcount);
        return $('<div />').append($(widget.getMainDiv()).css({
          display: 'inline-block',
          'float': 'none'
        })).css('text-align', 'center');
      },
      nugget: function (amount) {
        var ngtico = '<img src=\'https://westdes.innogamescdn.com/images/nuggets.png\'/>';
        return $('<div style=\'padding: 10px;\' />').append('<img src=\'https://westdes.innogamescdn.com/images/nuggets.png\'/> ', '<b>' + s(ngettext('%1 Nugget', new Array('%1 Nugget', '%1 Nuggets'), amount), amount) + '</b>').css('text-align', 'center');
      }
    };
    return {
      enqueue: function (type, payload) {
        queue.push({
          type: type,
          payload: payload
        });
        if (queue.length == 1) {
          if (!ItemManager.isLoaded()) {
            EventHandler.listen('itemmanager_loaded', function () {
              showPopup(queue[0]);
            });
          } else {
            showPopup(queue[0]);
          }
        }
      }
    };
  }();
};
//Run it
contentEval(Ringmaster);