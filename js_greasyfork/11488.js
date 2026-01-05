// ==UserScript==
// @name        Estadísticas Duelistas
// @namespace   http://fktools.bplaced.net/autopilot
// @description Analiza el sepulturero de las ciudades y muestra una Estadística de Duelistas.
// @include     *.the-west.*/*
// @exclude     *.the-west.*/index.php?page=logout*
// @version     1.02
// @grant       none
// @author      stayawayknight (Dakota/Hannahville)
// @traductor   español (pepe100)
// @downloadURL https://update.greasyfork.org/scripts/11488/Estad%C3%ADsticas%20Duelistas.user.js
// @updateURL https://update.greasyfork.org/scripts/11488/Estad%C3%ADsticas%20Duelistas.meta.js
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
Duellantenstadl = function () {
  Duellantenstadl = {
    initialized: false,
    cache_name: 'duellantenstadel_db',
    database: [
    ]
  };
  var sWorldFull = document.location.toString().replace('http://', '').match('(.*).the-west.') [1];
  var sWorldCountry = document.location.toString().match(sWorldFull + '.the-west.(.*)/game.php') [1];
  var div = $('<div class="ui_menucontainer">/');
  var imagelink = '<div title="Estadísticas Duelistas" class="menulink" style="background: url(' + 'https://westdes.innogamescdn.com/images/forum/icon/grave.png' + '); background-size: 25px 25px; background-position: 0px 0px;"></div>';
  var link = $(imagelink);
  link.click(function () {
    Duellantenstadl.run();
  });
  div.append(link);
  div.append('<div class="loptions"></div><div class="menucontainer_bottom"></div>');
  $('#ui_menubar').append(div);
  //Estadística
  Duellantenstadl.stats = {
    best_hit_enemy: 0,
    best_hit_enemy_name: '',
    best_hit_enemy_player_id: 0,
    best_hit_member: 0,
    best_hit_member_name: '',
    best_hit_member_player_id: 0,
    best_total_damage_enemy: 0,
    best_total_damage_enemy_name: '',
    best_total_damage_enemy_player_id: 0,
    best_total_damage_member: 0,
    best_total_damage_member_name: '',
    best_total_damage_member_player_id: 0,
    best_duels_diff: 0,
    best_duels_diff_town_name: '',
    best_duels_diff_town_id: 0,
    best_duels_lost: 0,
    best_duels_lost_town_name: '',
    best_duels_lost_town_id: 0,
    best_duels_won: 0,
    best_duels_won_town_name: '',
    best_duels_won_town_id: 0,
    best_duels_total: 0,
    best_duels_total_town_name: '',
    best_duels_total_town_id: 0,
    best_swoon_enemies: 0,
    best_swoon_enemies_town_name: '',
    best_swoon_enemies_town_id: 0,
    best_swoon_members: 0,
    best_swoon_members_town_name: '',
    best_swoon_members_town_id: 0,
    allPlayers: [
    ]
  };
  //Ejecución Script
  Duellantenstadl.run = function ()
  {
    var pageCur = 1;
    var pageMax = 0;
    Duellantenstadl.database = [
    ]; //Base de datos vacía
    if ((typeof localStorage[Duellantenstadl.cache_name] === 'undefined') || (localStorage[Duellantenstadl.cache_name].length < 1))
    {
      MessageSuccess('Recorriendo todos los sepultureros. Este proceso puede tardar algún tiempo en completarse.').show();
      callRankPages(); //Captura de base de datos; de aquí ir aún más a las llamadas de función
    } 
    else
    {
      var conf = confirm('Las estadísticas ya están almacenadas localmente y se pueden descargar directamente. Sin embargo todos los sepultureros se leen en el mundo (Por ejemplo en las Actualizaciones y futuros cambios)?\n\nOK: No, volver a explorar\nCancelar: Carga local');
      if (conf == true) {
        MessageSuccess('Recorriendo todos los sepultureros. Este proceso puede tardar algún tiempo en completarse.').show();
        callRankPages(); //Captura de base de datos; de aquí iremos a las llamadas de función
      } else {
        Duellantenstadl.stats = JSON.parse(localStorage[Duellantenstadl.cache_name]);
        MessageSuccess('Las estadísticas han sido cargadas localmente! Continuar...').show();
        window.setTimeout(function () {
          showData();
        }, 3000);
      }
    }
    //Muestra los datos

    function showData()
    {
      //Ventana chapucera:
      var win = wman.open('Estadísticas Duelistas').setResizeable(false).setMinSize(690, 480).setSize(690, 480).setMiniTitle('Estadísticas Duelistas').setTitle('Estadísticas Duelistas');
      var content = $('<div class="dlanalysedwindow" style="overflow-y: auto; height: 450px; max-height: 370px; width: 400;">');
      var contentString = '<h1>Registros:</h1><table border="1"><tr><th>Registro</th><th>Nombre</th><th>Valor</th></tr>';
      contentString += '<tr><td align="left">Mayor Impacto (I):</td><td align="center"><a href="javascript: PlayerProfileWindow.open(' + Duellantenstadl.stats.best_hit_member_player_id + ')">' + Duellantenstadl.stats.best_hit_member_name + '</a></td><td align="center">' + Duellantenstadl.stats.best_hit_member + ' Daño</td></tr>';
      contentString += '<tr><td align="left">Mayor Daño Realizado (DR):</td><td align="center"><a href="javascript: PlayerProfileWindow.open(' + Duellantenstadl.stats.best_total_damage_member_player_id + ')">' + Duellantenstadl.stats.best_total_damage_member_name + '</a></td><td align="center">' + Duellantenstadl.stats.best_total_damage_member + ' Daño</td></tr>';
      contentString += '<tr><td align="left">Ciudad con más duelos ganados:</td><td align="center"><a href="javascript: MorticianWindow.open(' + Duellantenstadl.stats.best_duels_won_town_id + ');">' + Duellantenstadl.stats.best_duels_won_town_name + '</a></td><td align="center">' + Duellantenstadl.stats.best_duels_won + ' Duelos</td></tr>';
      contentString += '<tr><td align="left">Ciudad con más duelos perdidos:</td><td align="center"><a href="javascript: MorticianWindow.open(' + Duellantenstadl.stats.best_duels_lost_town_id + ');">' + Duellantenstadl.stats.best_duels_lost_town_name + '</a></td><td align="center">' + Duellantenstadl.stats.best_duels_lost + ' Duelos</td></tr>';
      contentString += '<tr><td align="left">Ciudad con más duelos realizados:</td><td align="center"><a href="javascript: MorticianWindow.open(' + Duellantenstadl.stats.best_duels_total_town_id + ');">' + Duellantenstadl.stats.best_duels_total_town_name + '</a></td><td align="center">' + Duellantenstadl.stats.best_duels_total + ' Duelos</td></tr>';
      contentString += '<tr><td align="left">Ciudad con mejor diferencia de duelos:</td><td align="center"><a href="javascript: MorticianWindow.open(' + Duellantenstadl.stats.best_duels_diff_town_id + ');">' + Duellantenstadl.stats.best_duels_diff_town_name + '</a></td><td align="center">' + Duellantenstadl.stats.best_duels_diff + ' Duelos</td></tr>';
      contentString += '<tr><td align="left">Ciudad con más adversarios desmayados:</td><td align="center"><a href="javascript: MorticianWindow.open(' + Duellantenstadl.stats.best_swoon_enemies_town_id + ');">' + Duellantenstadl.stats.best_swoon_enemies_town_name + '</a></td><td align="center">' + Duellantenstadl.stats.best_swoon_enemies + ' KOs</td></tr>';
      contentString += '<tr><td align="left">Ciudad con más miembros desmayados:</td><td align="center"><a href="javascript: MorticianWindow.open(' + Duellantenstadl.stats.best_swoon_members_town_id + ');">' + Duellantenstadl.stats.best_swoon_members_town_name + '</a></td><td align="center">' + Duellantenstadl.stats.best_swoon_members + ' KOs</td></tr>';
      contentString += '</table><br>';
		contentString += '<h1>Clasificación de entradas en Sepulturero:</h1>';
      contentString += '<table border="1"><tr><th>Rango</th><th>Nombre</th><th>Número</th><th>Ciudades</th></tr>';
      for (var i = 0; i < Duellantenstadl.stats.allPlayers.length; i++)
      {
        contentString += '<tr>';
        contentString += '<td align="center">' + (i + 1) + '</td>';
        contentString += '<td align="center"><a href="javascript: PlayerProfileWindow.open(' + Duellantenstadl.stats.allPlayers[i].player_id + ');">' + Duellantenstadl.stats.allPlayers[i].player_name + '</a></td>';
        contentString += '<td align="center">' + Duellantenstadl.stats.allPlayers[i].townList.length + '</td>';
        contentString += '<td align="center">';
        for (var a = 0; a < Duellantenstadl.stats.allPlayers[i].townList.length; a++)
        {
          contentString += '<a href="javascript: MorticianWindow.open(' + Duellantenstadl.stats.allPlayers[i].townList[a].town_id + ');">';
          contentString += Duellantenstadl.stats.allPlayers[i].townList[a].town_name + '</a> (' + ((Duellantenstadl.stats.allPlayers[i].townList[a].type == 0) ? 'I' : (Duellantenstadl.stats.allPlayers[i].townList[a].type == 1) ? 'I' : (Duellantenstadl.stats.allPlayers[i].townList[a].type == 2) ? 'DR' : (Duellantenstadl.stats.allPlayers[i].townList[a].type == 3) ? 'DR' : '') + ')';
          if (a != Duellantenstadl.stats.allPlayers[i].townList.length - 1)
          {
            contentString += ', ';
          }
        }
        contentString += '</td>';
        contentString += '</tr>';
      }
      contentString += '</table>'
      content.append(contentString);
      win.appendToContentPane(content);
      //Estadísticas almacenadas en caché:
      localStorage[Duellantenstadl.cache_name] = JSON.stringify(Duellantenstadl.stats);
    }
    //Ordenar datos (Lista jugador 'Todos jugadores')

    function sortData()
    {
      //Función ordenación
      function sortByNumberOfEntrys(a, b) {
        if (a.townList.length < b.townList.length)
        {
          return 1;
        } 
        else if (a.townList.length > b.townList.length)
        {
          return - 1;
        } 
        else
        {
          return 0;
        }
      }
      MessageSuccess('Preparar los datos sobre...').show();
      Duellantenstadl.stats.allPlayers.sort(sortByNumberOfEntrys);
      window.setTimeout(function () {
        showData();
      }, 3000);
    }
    //Analizar los datos y exporimir las estructuras apropiadas

    function analyseData()
    {
      var bFound = false;
      var searchID = 0;
      Duellantenstadl.stats.allPlayers = [];
      MessageSuccess('Analizar los datos...').show();
      //En todos los sepultureros, iterar:
      Duellantenstadl.database.forEach(function (bestatter) {
        //Ir a través de todas las disciplinas
        for (var search = 0; search < 4; search++) {
          bFound = false;
          //Los jugadores se agregan a la lista de sepultureros:
          //Ya está en la lista?
          for (var i = 0; i < Duellantenstadl.stats.allPlayers.length; i++)
          {
            if (((search == 0) && (bestatter.best_hit_enemy_player_id == Duellantenstadl.stats.allPlayers[i].player_id)) || ((search == 1) && (bestatter.best_hit_member_player_id == Duellantenstadl.stats.allPlayers[i].player_id)) || ((search == 2) && (bestatter.best_total_damage_enemy_player_id == Duellantenstadl.stats.allPlayers[i].player_id)) || ((search == 3) && (bestatter.best_total_damage_member_player_id == Duellantenstadl.stats.allPlayers[i].player_id)))
            {
              Duellantenstadl.stats.allPlayers[i].townList.push({
                town_id: bestatter.town_id,
                town_name: bestatter.town_name,
                type: search
              });
              bFound = true;
              break;
            }
          }
          if (!bFound)
          {
            //Fuera de la lista:
            var player_id = 0;
            var player_name = '';
            if (search == 0)
            {
              player_id = bestatter.best_hit_enemy_player_id;
              player_name = bestatter.best_hit_enemy_name;
            } 
            else if (search == 1)
            {
              player_id = bestatter.best_hit_member_player_id;
              player_name = bestatter.best_hit_member_name;
            } 
            else if (search == 2)
            {
              player_id = bestatter.best_total_damage_enemy_player_id;
              player_name = bestatter.best_total_damage_enemy_name;
            } 
            else if (search == 3)
            {
              player_id = bestatter.best_total_damage_member_player_id;
              player_name = bestatter.best_total_damage_member_name;
            }
            if (player_id != null)
            {
              //Añade jugadores a la lista nueva
              Duellantenstadl.stats.allPlayers.push({
                player_id: player_id,
                player_name: player_name,
                townList: [
                  {
                    town_id: bestatter.town_id,
                    town_name: bestatter.town_name,
                    type: search
                  }
                ]
              });
            }
          }
        }
        //Configuración de Registros Generales:

        if (bestatter.best_hit_enemy > Duellantenstadl.stats.best_hit_enemy)
        {
          Duellantenstadl.stats.best_hit_enemy = bestatter.best_hit_enemy;
          Duellantenstadl.stats.best_hit_enemy_name = bestatter.best_hit_enemy_name;
          Duellantenstadl.stats.best_hit_enemy_player_id = bestatter.best_hit_enemy_player_id;
        }
        if (bestatter.best_hit_member > Duellantenstadl.stats.best_hit_member)
        {
          Duellantenstadl.stats.best_hit_member = bestatter.best_hit_member;
          Duellantenstadl.stats.best_hit_member_name = bestatter.best_hit_member_name;
          Duellantenstadl.stats.best_hit_member_player_id = bestatter.best_hit_member_player_id;
        }
        if (bestatter.best_total_damage_enemy > Duellantenstadl.stats.best_total_damage_enemy)
        {
          Duellantenstadl.stats.best_total_damage_enemy = bestatter.best_total_damage_enemy;
          Duellantenstadl.stats.best_total_damage_enemy_name = bestatter.best_total_damage_enemy_name;
          Duellantenstadl.stats.best_total_damage_enemy_player_id = bestatter.best_total_damage_enemy_player_id;
        }
        if (bestatter.best_total_damage_member > Duellantenstadl.stats.best_total_damage_member)
        {
          Duellantenstadl.stats.best_total_damage_member = bestatter.best_total_damage_member;
          Duellantenstadl.stats.best_total_damage_member_name = bestatter.best_total_damage_member_name;
          Duellantenstadl.stats.best_total_damage_member_player_id = bestatter.best_total_damage_member_player_id;
        }
        if (bestatter.duels_diff > Duellantenstadl.stats.best_duels_diff)
        {
          Duellantenstadl.stats.best_duels_diff = bestatter.duels_diff;
          Duellantenstadl.stats.best_duels_diff_town_name = bestatter.town_name;
          Duellantenstadl.stats.best_duels_diff_town_id = bestatter.town_id;
        }
        if (bestatter.duels_lost > Duellantenstadl.stats.best_duels_lost)
        {
          Duellantenstadl.stats.best_duels_lost = bestatter.duels_lost;
          Duellantenstadl.stats.best_duels_lost_town_name = bestatter.town_name;
          Duellantenstadl.stats.best_duels_lost_town_id = bestatter.town_id;
        }
        if (bestatter.duels_total > Duellantenstadl.stats.best_duels_total)
        {
          Duellantenstadl.stats.best_duels_total = bestatter.duels_total;
          Duellantenstadl.stats.best_duels_total_town_name = bestatter.town_name;
          Duellantenstadl.stats.best_duels_total_town_id = bestatter.town_id;
        }
        if (bestatter.duels_won > Duellantenstadl.stats.best_duels_won)
        {
          Duellantenstadl.stats.best_duels_won = bestatter.duels_won;
          Duellantenstadl.stats.best_duels_won_town_name = bestatter.town_name;
          Duellantenstadl.stats.best_duels_won_town_id = bestatter.town_id;
        }
        if (bestatter.swoon_enemies > Duellantenstadl.stats.best_swoon_enemies)
        {
          Duellantenstadl.stats.best_swoon_enemies = bestatter.swoon_enemies;
          Duellantenstadl.stats.best_swoon_enemies_town_name = bestatter.town_name;
          Duellantenstadl.stats.best_swoon_enemies_town_id = bestatter.town_id;
        }
        if (bestatter.swoon_members > Duellantenstadl.stats.best_swoon_members)
        {
          Duellantenstadl.stats.best_swoon_members = bestatter.swoon_members;
          Duellantenstadl.stats.best_swoon_members_town_name = bestatter.town_name;
          Duellantenstadl.stats.best_swoon_members_town_id = bestatter.town_id;
        }
      });
      window.setTimeout(function () {
        sortData();
      }, 3000);
    }
    function callRankPages()
    {
      $.post('http://' + sWorldFull + '.the-west.' + sWorldCountry + '/game.php?window=ranking&mode=get_data', {
        page: pageCur,
        tab: 'cities'
      }, function (data) {
        if (data.error)
        {
          MessageError('Fehler: ' + data.msg);
          return;
        }
        pageMax = data.pages;
        //Agujero Datos Sepulturero:
        for (var i = 0; i < data.ranking.length; i++)
        {
          $.post('http://' + sWorldFull + '.the-west.' + sWorldCountry + '/game.php?window=building_mortician&mode=get_data', {
            town_id: data.ranking[i].town_id
          }, function (bestatter) {
            if (bestatter.error)
            {
              MessageError('Error: ' + bestatter.msg);
              return;
            } 
            else
            {
              Duellantenstadl.database.push(bestatter.data);
              if (Duellantenstadl.database.length % 10 == 0)
              {
                MessageSuccess('Sepultureros capturados: ' + Duellantenstadl.database.length).show();
              }
            }
          }, 'json');
        }
        if (pageCur < pageMax)
        //si (pageCur < 10)
        {
          pageCur++;
          window.setTimeout(function () {
            callRankPages()
          }, 2000 + Math.floor((Math.random() * 400)));
        } 
        else
        {
          MessageSuccess('Sepultureros capturados: ' + Duellantenstadl.database.length).show();
          window.setTimeout(function () { //Analizar datos
            analyseData();
          }, 5000);
        }
      }, 'json');
    }
  }
  Duellantenstadl.json2Array = function (json)
  {
    return $.map(json, function (e) {
      return e;
    });
  }
  Duellantenstadl.escapeHTML = function (e)
  {
    return String(e).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
//Ejecutarlo

contentEval(Duellantenstadl);
