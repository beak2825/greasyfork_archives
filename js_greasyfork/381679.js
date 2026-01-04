// ==UserScript==
// @name         Albion killboard
// @namespace    http://tampermonkey.net/
// @version      0.8.0 - Fix menu for battle board
// @history      0.7.4 - Update player page for recent kills
// @history      0.7.3 - Fix url for weapon images
// @history      0.7.2 - Add Timeline column for summary and players, remove dmg and heals (api was always reporting incorrectly), handle duplicate events being sent by api
// @history      0.7.1 - Add crystal league chart, added checkbox naked included for battle summary
// @history      0.7.0 - Updated default alliance colors
// @history      0.6.9 - Update battle player stats to players/assists and players/awarded
// @history      0.6.8 - Fixed minPlayers for alliance summary, Add chart for Crystal GvG
// @history      0.6.7 - Fixed width of battle graph
// @history      0.6.6 - Add ability hide/show battle history and players. Move min players to top, Guilds with no alliance in Summary
// @history      0.6.5 - Add new Alliance Summary
// @history      0.6.4 - Load All gif is immediate, Add alliance to player filter
// @history      0.6.3 - Use UTC time for death graph x-axis, add Affiliation option for percentages
// @history      0.6.2 - If <= X players, then remove alliance from death graph
// @history      0.6.1 - Add drop down for %DMG & %HEAL. If no alliance, add Guild to death graph
// @history      0.6.0 - Fix colors, change to async
// @history      0.5.9 - Battle chart (std allaince colors, 0 Death Fame does not decrease line, multiple deaths shown), minor bug fixes
// @history      0.5.8 - Added battle chart, allow for Load All
// @history      0.5.7 - Add GvG graph
// @history      0.5.6 - When wpn img is created, add link to popup all their gear. Fix load more on top & solo kills page
// @description  Alters player, guild, alliance, battle, and GvG killboard with additional information
// @author       Fiesto
// @match        https://albiononline.com/*/killboard
// @match        https://albiononline.com/*/killboard/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.bundle.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/381679/Albion%20killboard.user.js
// @updateURL https://update.greasyfork.org/scripts/381679/Albion%20killboard.meta.js
// ==/UserScript==


(function ($, Chart) {
  'use strict';
  var PAGE_MODIFIERS = [
    { regex: /api\/gameinfo\/players\/[^\/]{22}$/, mthd: modifyPlayer },
    { regex: /api\/gameinfo\/players\/[^\/]{22}\/deaths$/, mthd: modifyPlayerDeaths },
    { regex: /api\/gameinfo\/players\/[^\/]+\/topkills/, mthd: modifyPlayerTopKills },
    { regex: /api\/gameinfo\/players\/[^\/]+\/solokills/, mthd: modifyPlayerSoloKills },
    { regex: /api\/gameinfo\/players\/[^\/]+\/kills/, mthd: modifyPlayerRecentKills },

    { regex: /api\/gameinfo\/guilds\/[^\/]{22}$/, mthd: modifyGuild },
    { regex: /api\/gameinfo\/guilds\/[^\/]{22}\/top/, mthd: modifyGuildTopPVP },
    { regex: /api\/gameinfo\/events\?.*guildId/, mthd: modifyGuildRecentKills },

    { regex: /api\/gameinfo\/alliances\/[^\/]{22}\/topKills/, mthd: modifyAllianceTopPVP },
    { regex: /api\/gameinfo\/events\?.*allianceId/, mthd: modifyAllianceRecentKills },

    { regex: /api\/gameinfo\/battles\/.*$/, mthd: modifyBattleShowHide },
    { regex: /api\/gameinfo\/events\/battle\/.*$/, mthd: modifyBattleHistory },
    { regex: /api\/gameinfo\/events\/battle\/.*$/, mthd: modifyBattleAddPlayers },
    { regex: /api\/gameinfo\/events\/battle\/.*$/, mthd: modifyBattleSummary },
    { regex: /api\/gameinfo\/events\/battle\/.*$/, mthd: modifyBattleAddChart },
    { regex: /api\/gameinfo\/events\/battle\/.*$/, mthd: modifyBattleShowHide },

    { regex: /api\/gameinfo\/guildmatches\/[^\=\?\/]{22}$/, mthd: modifyGVGChart },
    { regex: /api\/gameinfo\/matches\/crystal\/[^\=\?\/]{22}$/, mthd: modifyCrystalGVGChart },
    { regex: /api\/gameinfo\/matches\/crystalleague\/[^\=\?\/]{22}$/, mthd: modifyCrystalLeagueChart }

  ]

  GM_addStyle(".mouseHilite:hover {filter:brightness(150%)}");


  // Gear PopUp
  GM_addStyle("#playerGear { border:solid darkgrey 2px;background-color: white;padding: 0px 0px 10px 0px;position:absolute }")
  GM_addStyle("#playerGear .item-count { font-size: 7px!important }")

  async function gameApiRequestComplete(xhr) {
    if (xhr.responseText) {
      const response = { data: JSON.parse(xhr.responseText), url: xhr.responseURL };
      let promises = []
      PAGE_MODIFIERS.forEach(function (pm) {
        if (response.url.match(pm.regex)) {
          if (promises.length == 0) {
            console.log(response)
          }
          promises.push(Promise.resolve(pm.mthd.call(null, response)))
        }
      });

      await Promise.all(promises)
      // if any changes, setup click events for gear
      if (promises.length > 0) {
        $('.wpn:not(.wpnBound)').addClass('wpnBound').on('click', showPopupGearWorn)
      }
    }
  }

  ////////////////////////////////////////////////////////
  // GVG MATCH - CHART

  async function modifyGVGChart(response) {
    let $canvasOrig = $("canvas[data-reactid='.0.2.1.1.2.1.3.2.0']");
    $canvasOrig.hide()

    let $canvas = $('#gvgChart')
    if ($canvas.length == 0) {
      let html = '<div class="small-12 columns"><div class="top-table"><br><div class="top-table__headline top-table__headline--sub">Match Timeline</div>'
      html += '<canvas id="gvgChart" style="width:1020px;height:400px"></canvas>'
      html += '</div></div>'
//      $canvasOrig.before("<canvas id='gvgChart' style='width:1020px;height:400px'></canvas>")
      $canvasOrig.before(html)
      $canvas = $('#gvgChart')
    }

    let ctx = $canvas[0].getContext('2d');

    function getTimeline(tl) {
      return tl.map(function (value) {
        return { x: new Date(value.TimeStamp), y: value.Tickets ? value.Tickets : 0, EventType: value.EventType };
      }).filter(function (elem, index, array) { return index === 0 || (index === array.length - 1) || elem.y !== array[index - 1].y })
    }

    let timelines = [getTimeline(response.data.AttackerTimeline), getTimeline(response.data.DefenderTimeline)]

    function getPointBackgroundColor(context) {
      const COLORS = { 3: 'blue', 4: 'yellow', 2: 'red' }
      const tl = timelines[context.datasetIndex]
      const evtType = tl[context.dataIndex].EventType
      return COLORS[evtType] ? COLORS[evtType] : 'rgba(0,0,0,0)'
    }

    let chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',
      data: {
        datasets: [
          {
            label: response.data.Attacker.Name,
            backgroundColor: 'rgb(200, 99, 132)',
            borderColor: 'rgb(200, 99, 132)',
            pointBackgroundColor: getPointBackgroundColor,
            steppedLine: true,
            fill: false,
            data: timelines[0]
          },
          {
            label: response.data.Defender.Name,
            backgroundColor: 'rgb(128, 99, 132)',
            borderColor: 'rgb(128, 99, 132)',
            pointBackgroundColor: getPointBackgroundColor,
            steppedLine: true,
            fill: false,
            data: timelines[1]
          }
        ]
      },
      options: {
        responsive: true,
        title: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              var label = data.datasets[tooltipItem.datasetIndex].label || '';

              if (label) {
                label += ': ';
              }
              label += tooltipItem.yLabel;

              let tl = timelines[tooltipItem.datasetIndex]
              let evtType = tl[tooltipItem.index].EventType
              let delta = tooltipItem.index == 0 ? 0 : (tl[tooltipItem.index].y - tl[tooltipItem.index - 1].y)
              if (evtType == 1)
                label += " - Match Done"
              else if (evtType == 3)
                label += " - Base Lost"
              else if (evtType == 4)
                label += " - Base Timer"
              else if (evtType == 2)
                label += " - DEATH"
              return label + (delta !== 0 ? (" (" + delta + ")") : '')
            }
          }
        },
        scales: {
          xAxes: [{
            type: 'time',
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Score'
            }
          }]
        }
      }
    });
  }

  ////////////////////////////////////////////////////////
  // CRYSTAL GVG MATCH - CHART

  async function modifyCrystalGVGChart(response) {
    let $canvas = $('#cyrstalGvgChart')
    if ($canvas.length == 0) {
      let html = '<div class="small-12 columns"><div class="top-table"><br><div class="top-table__headline top-table__headline--sub">Match Timeline</div>'
      html += '<canvas id="cyrstalGvgChart" style="width:1020px;height:400px"></canvas>'
      html += '</div></div>'
      $("div[data-reactid='.0.2.1.1.2.1.3.2']").before(html)
      $canvas = $('#cyrstalGvgChart')
    }

    let ctx = $canvas[0].getContext('2d');

    function getTimeline(tl) {
      return tl.map(function (value) {
        return { x: new Date(value.TimeStamp), y: value.Tickets ? value.Tickets : 0, EventType: value.EventType };
      }).filter(function (elem, index, array) { return index === 0 || (index === array.length - 1) || elem.y !== array[index - 1].y })
    }

    let timelines = [getTimeline(response.data.team1Timeline), getTimeline(response.data.team2Timeline)]

    function getPointBackgroundColor(context) {
      const COLORS = { 3: 'blue', 4: 'yellow', 2: 'red' }
      const tl = timelines[context.datasetIndex]
      const evtType = tl[context.dataIndex].EventType
      return COLORS[evtType] ? COLORS[evtType] : 'rgba(0,0,0,0)'
    }

    let chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',
      data: {
        datasets: [
          {
            label: response.data.team1Guild.Name,
            backgroundColor: 'rgb(200, 99, 132)',
            borderColor: 'rgb(200, 99, 132)',
            pointBackgroundColor: getPointBackgroundColor,
            steppedLine: true,
            fill: false,
            data: timelines[0]
          },
          {
            label: response.data.team2Guild.Name,
            backgroundColor: 'rgb(128, 99, 132)',
            borderColor: 'rgb(128, 99, 132)',
            pointBackgroundColor: getPointBackgroundColor,
            steppedLine: true,
            fill: false,
            data: timelines[1]
          }
        ]
      },
      options: {
        responsive: true,
        title: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              var label = data.datasets[tooltipItem.datasetIndex].label || '';

              if (label) {
                label += ': ';
              }
              label += tooltipItem.yLabel;

              let tl = timelines[tooltipItem.datasetIndex]
              let evtType = tl[tooltipItem.index].EventType
              let delta = tooltipItem.index == 0 ? 0 : (tl[tooltipItem.index].y - tl[tooltipItem.index - 1].y)
              if (evtType == 1)
                label += " - Match Done"
              else if (evtType == 3)
                label += " - Base Lost"
              else if (evtType == 4)
                label += " - Base Timer"
              else if (evtType == 2)
                label += " - DEATH"
              return label + (delta !== 0 ? (" (" + delta + ")") : '')
            }
          }
        },
        scales: {
          xAxes: [{
            type: 'time',
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Score'
            }
          }]
        }
      }
    });
  }

  ////////////////////////////////////////////////////////
  // CRYSTALLEAGUE MATCH - CHART

  async function modifyCrystalLeagueChart(response) {
    let $canvas = $('#cyrstalLeagueChart')
    if ($canvas.length == 0) {
      let html = '<div class="small-12 columns"><div class="top-table"><br><div class="top-table__headline top-table__headline--sub">Match Timeline</div>'
      html += '<canvas id="cyrstalLeagueChart" style="width:1020px;height:400px"></canvas>'
      html += '</div></div>'
      $("div[data-reactid='.0.2.1.1.2.1.3.2']").before(html)
      $canvas = $('#cyrstalLeagueChart')
    }

    let ctx = $canvas[0].getContext('2d');

    function getTimeline(tl) {
      return tl.map(function (value) {
        return { x: new Date(value.TimeStamp), y: value.Tickets ? value.Tickets : 0, EventType: value.EventType };
      }).filter(function (elem, index, array) { return index === 0 || (index === array.length - 1) || elem.y !== array[index - 1].y })
    }

    let timelines = [getTimeline(response.data.team1Timeline), getTimeline(response.data.team2Timeline)]

    function getPointBackgroundColor(context) {
      const COLORS = { 3: 'blue', 4: 'yellow', 2: 'red' }
      const tl = timelines[context.datasetIndex]
      const evtType = tl[context.dataIndex].EventType
      return COLORS[evtType] ? COLORS[evtType] : 'rgba(0,0,0,0)'
    }

    let chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',
      data: {
        datasets: [
          {
            label: response.data.team1Results[response.data.team1LeaderId].Name + "'s Team",
            backgroundColor: 'rgb(200, 99, 132)',
            borderColor: 'rgb(200, 99, 132)',
            pointBackgroundColor: getPointBackgroundColor,
            steppedLine: true,
            fill: false,
            data: timelines[0]
          },
          {
            label: response.data.team2Results[response.data.team2LeaderId].Name + "'s Team",
            backgroundColor: 'rgb(128, 99, 132)',
            borderColor: 'rgb(128, 99, 132)',
            pointBackgroundColor: getPointBackgroundColor,
            steppedLine: true,
            fill: false,
            data: timelines[1]
          }
        ]
      },
      options: {
        responsive: true,
        title: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              var label = data.datasets[tooltipItem.datasetIndex].label || '';

              if (label) {
                label += ': ';
              }
              label += tooltipItem.yLabel;

              let tl = timelines[tooltipItem.datasetIndex]
              let evtType = tl[tooltipItem.index].EventType
              let delta = tooltipItem.index == 0 ? 0 : (tl[tooltipItem.index].y - tl[tooltipItem.index - 1].y)
              if (evtType == 1)
                label += " - Match Done"
              else if (evtType == 3)
                label += " - Base Lost"
              else if (evtType == 4)
                label += " - Base Timer"
              else if (evtType == 2)
                label += " - DEATH"
              return label + (delta !== 0 ? (" (" + delta + ")") : '')
            }
          }
        },
        scales: {
          xAxes: [{
            type: 'time',
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Score'
            }
          }]
        }
      }
    });
  }

  ////////////////////////////////////////////////////////
  ///// ALLIANCE PAGE

  async function modifyAllianceTopPVP(response) {
    adjustKillBoard(".0.2.1.1.0.0.1.0.2", response, true);
    adjustKillBoard(".0.2.1.2.0.0.2", response, true);
  }

  async function modifyAllianceRecentKills(response) {
    adjustRecentKills(".0.2.1.1.0.0.2.0.2", response);
    adjustRecentKills(".0.2.1.2.0.0.2", response);
  }

  ////////////////////////////////////////////////////////
  ///// GUILD PAGE

  async function modifyGuild(response) {
    const $guildPvpDiv = $(document).find("[data-reactid='.0.2.1.1.0.0.0.1.0.0.0.0']");
    $guildPvpDiv.each(function () {
      const $n = $(this);
      const pvp = response.data;
      pvp.killFame = (pvp.killFame ? pvp.killFame : 0);
      const kd = pvp.DeathFame > 0 ? pvp.killFame / pvp.DeathFame : "";

      $n.before("<div style='float:right'><div><b>PVP Fame</b></div><table class='table table--top-table'>" + createLabel("Kill", pvp.killFame) + createLabel("Death", pvp.DeathFame) + createLabel("K/D", kd) + "</table></div>");
    });
  }

  async function modifyGuildTopPVP(response) {
    adjustKillBoard(".0.2.1.1.0.0.1.0.2", response, true);
    adjustKillBoard(".0.2.1.2.0.0.2", response, true);
  }

  async function modifyGuildRecentKills(response) {
    adjustRecentKills(".0.2.1.1.0.0.2.0.2", response);
    adjustRecentKills(".0.2.1.2.0.0.2", response);
  }

  ////////////////////////////////////////////////////////
  ///// PLAYER PAGE

  async function modifyPlayerTopKills(response) {
    adjustKillBoard(".0.2.1.1.0.0.0.2.0.2", response);
    adjustKillBoard(".0.2.1.2.0.0.2", response);
  }

  async function modifyPlayerSoloKills(response) {
    adjustKillBoard(".0.2.1.1.0.0.0.4.0.2", response);
    adjustKillBoard(".0.2.1.2.0.0.2", response);
  }

  async function modifyPlayer(response) {
    const pvpReactId = ".0.2.1.1.0.0.0.0.1.0.0.0.0.3";
    const $pvpDiv = $(document).find("[data-reactid='" + pvpReactId + "']");
    $pvpDiv.each(function () {
      const $n = $(this);
      const pve = response.data.LifetimeStatistics.PvE;
      $n.before("<div style='float:right'><div class='mini-profile__key'>PvE Fame</div><div class='mini-profile__value'>" + pve.Total.toLocaleString() + "</div></div>");

      $n.after("<div style='float:right'><div class='mini-profile__key'>PvP Ratio</div><div class='mini-profile__value'>" + (response.data.FameRatio).toLocaleString() + "</div></div>");
    });

    $pvpDiv.find("[data-reactid='" + pvpReactId + ".1']").each(function () {
      const $n = $(this);
      const txt = $n.text();
      $n.text(txt + " / " + response.data.DeathFame.toLocaleString());
    });
  }

  async function modifyPlayerRecentKills(response) {
    const reactId = ".0.2.1.1.0.0.2.0.0.2";
    const $table = $("table[data-reactid='" + reactId + "']");
    $table.find("[data-reactid='" + reactId + ".$thead.1.$0']").each(function () {
      var $n = $(this);
      $n.before("<th>Date</th>");
      $n.after("<th>Btl</th>");
    });

    $table.find("[data-reactid^='" + reactId + ".$tbody'][data-reactid$='.$Victim']").each(function () {
      const $n = $(this);
      const index = parseInt($n.attr('data-reactid').match(/tbody\.\$(\d+)/)[1]);
      const data = response.data[index];
      const ts = new Date(Date.parse(data.TimeStamp));
      $n.before("<td>" + (ts.getMonth() + 1) + "/" + ts.getDate() + "</td>");
      $n.after("<td>" + createBattleLink(data, true) + "</td>");
    });

    $table.find("td[data-reactid$='Fame'] span").each(function (e) {
      const $n = $(this);
      let index = $n.attr('data-reactid').match(/(\d+)\.\$Fame\.0$/);
      let death;
      if (index != null) {
        index = parseInt(index[1]);
        death = response.data[index];
        if (death) {
          $n.html("<a href='" + toUrl("killboard/kill/" + death.EventId) + "'>" + $n.html() + "</a>");
        }
      }
    });
  }

  async function modifyPlayerDeaths(response) {
    const deathsReactId = ".0.2.1.1.0.0.1.0.0.2";
    const $table = $("table[data-reactid='" + deathsReactId + "']");
    $table.find("[data-reactid='" + deathsReactId + ".$thead.1.$0']").each(function () {
      var $n = $(this);
      $n.before("<th>Date</th>");
      $n.after("<th>Btl</th>");
    });

    $table.find("[data-reactid^='" + deathsReactId + ".$tbody'][data-reactid$='.$Killer']").each(function () {
      const $n = $(this);
      const index = parseInt($n.attr('data-reactid').match(/tbody\.\$(\d+)/)[1]);
      const data = response.data[index];
      const ts = new Date(Date.parse(data.TimeStamp));
      $n.before("<td>" + (ts.getMonth() + 1) + "/" + ts.getDate() + "</td>");
      $n.after("<td>" + createBattleLink(data, true) + "</td>");
    });

    $table.find("td[data-reactid$='Fame'] span").each(function (e) {
      const $n = $(this);
      let index = $n.attr('data-reactid').match(/(\d+)\.\$Fame\.0$/);
      let death;
      if (index != null) {
        index = parseInt(index[1]);
        death = response.data[index];
        if (death) {
          $n.html("<a href='" + toUrl("killboard/kill/" + death.EventId) + "'>" + $n.html() + "</a>");
        }
      }
    });
  }

  ////////////////////////////////////////////////////////
  ///// BATTLE PAGE

  const battleShow = { stats: true, history: true, players: true, minPlayers: 0 }
  GM_addStyle(".kill__body {padding-top:0px;}");
  GM_addStyle(".kill__body:after, .kill__body:before {display:none;}");
  GM_addStyle("#battleMinPlayers { text-indent:3px;padding: 0;margin:0;height:20px;width:50px;max-width:50px;}");

  async function modifyBattleShowHide() {
    if( ! window.location.href.match(/.*albiononline.com\/.*\/killboard\/battles\/.*/) ) return

    function showBattleStats(flag) {
      battleShow.stats = flag
      $('#showBattleStats').html((flag ? 'Hide ' : 'Show') + ' Default Battle Stats')
      if (flag) {
        $(".row--battleview").show()
        $("[data-reactid='.0.2.1.3.0.0.2']").show()
      } else {
        $("[data-reactid='.0.2.1.3.0.0.2']").hide()
        $(".row--battleview").hide()
      }
    }

    function showBattleHistory(flag) {
      battleShow.history = flag
      $('#showBattleHistory').html(flag ? 'Hide Battle History' : 'Show Battle History')
      if (flag) {
        $("[data-reactid='.0.2.1.3.0.0.3']").show()
        $("[data-reactid='.0.2.1.3.0.0.4']").show()
      } else {
        $("[data-reactid='.0.2.1.3.0.0.3']").hide()
        $("[data-reactid='.0.2.1.3.0.0.4']").hide()
      }
    }

    function showAllPlayers(flag) {
      battleShow.players = flag
      $('#showAllPlayers').html(flag ? 'Hide Player Stats' : 'Show Player Stats')
      if (flag) {
        $("#participantStats").show()
      } else {
        $("#participantStats").hide()
      }
    }

    if( $('#PreBattleView').length == 0) {
      $("[data-reactid='.0.2.1.3.0.0']").before('<div class="row" id="PreBattleView"><div class="small-12 columns"><div class="right"><a id="showBattleStats">Hide</a> | <a id="showBattleHistory">Hide</a> | <a id="showAllPlayers">Hide</a></div></div></div>')
      $("[data-reactid='.0.2.1.2.0.2']").after('<span style="float:right;padding-left:10px">Min Players: <select id="battleMinPlayers"><option value="0">0</option><option value="5">5</option><option value="10">10</option><option value="20">20</option><option value="40">40</option><option value="50">50</option><option value="75">75</option></select></span>')

      battleShow.stats = ((await GM_getValue("showBattleStats")) !== "false")
      battleShow.history = ((await GM_getValue("showBattleHistory")) !== "false")
      battleShow.players = ((await GM_getValue("showAllPlayers")) !== "false")
      battleShow.minPlayers = (await GM_getValue("minPlayers", 0 ))

      $('#showBattleStats').click(() => {
        const flag = !battleShow.stats
        showBattleStats(flag)
        GM_setValue("showBattleStats", flag.toString())
      })

      $('#showBattleHistory').click(() => {
        const flag = !battleShow.history
        showBattleHistory(flag)
        GM_setValue("showBattleHistory", flag.toString())
      })

      $('#showAllPlayers').click(() => {
        const flag = !battleShow.players
        showAllPlayers(flag)
        GM_setValue("showAllPlayers", flag.toString())
      })

      $("#battleMinPlayers").val("" + battleShow.minPlayers).change(function () {
        $(this).find("option:selected").each(function () {
          battleShow.minPlayers = parseInt($(this).val())
          GM_setValue("minPlayers", battleShow.minPlayers)
          createBattleSummary(battleSummary.players, battleShow.minPlayers)
          createBattleChart(battleChart.alliances, battleShow.minPlayers)
        });
      })

    }

    showBattleStats(battleShow.stats)
    showBattleHistory(battleShow.history)
    showAllPlayers(battleShow.players)
  }

  ///////////////////////////

  let battleChart = { players: {}, alliances: {}, loadAll: false, minPlayers: 0, date: undefined, eventIds: [] }
  async function modifyBattleAddChart(response) {
    if (response.url.match(/api\/gameinfo\/events\/battle\/.*\?offset=0.*$/)) {
      battleChart = { players: {}, alliances: {}, loadAll: false, minPlayers: ( await GM_getValue("minPlayers", 0) ), date: undefined, eventIds:[] }
    } else {
      battleChart.minPlayers = battleShow.minPlayers
    }

    const players = battleChart.players
    const alliances = battleChart.alliances

    function getPlayer(p) {
      let player = players[p.Id]
      if (!player) {
        player = players[p.Id] =
          {
            Id: p.Id,
            Name: p.Name,
            GuildName: p.GuildName,
            GuildId: p.GuildId,
            AllianceName: p.AllianceName,
            AllianceId: p.AllianceId
          }
      }

      // sometimes Equipment is messed up from GroupMembers array
      if (!(player.Equipment && player.Equipment.Armor) && (p.Equipment && p.Equipment.Armor)) {
        player.Equipment = p.Equipment
      }

      return player
    }

    function addPlayerToAlliance(player, ts) {
      let alliance = null
      let p = getPlayer(player)
      let allianceId = p.AllianceId || player.GuildId
      if (allianceId) {
        alliance = alliances[allianceId]
        if (!alliance) {
          alliances[allianceId] = alliance = {
            Id: allianceId,
            Name: p.AllianceName || p.GuildName,
            Deaths: [],
            Players: {},
            InitialTimeStamp: ts,
            LastTimeStamp: ts
          }
        } else {
          alliance.LastTimeStamp = ts
        }

        if (!alliance.Players[player.Id]) {
          alliance.Players[player.Id] = p;
        }
      }
      return alliance;
    }

    function buildAlliances() {
      response.data.forEach(function (btlEvent) {
        // data is overlapped in query (offset/limit)
        if( battleChart.eventIds.indexOf(btlEvent.EventId) > -1 ) return;
        battleChart.eventIds.push(btlEvent.EventId)


        if (!battleChart.date) {
          battleChart.date = new Date(btlEvent.TimeStamp)
        }

        const alliance = addPlayerToAlliance(btlEvent.Victim, btlEvent.TimeStamp)
        if (alliance)
          alliance.Deaths.push({ TimeStamp: btlEvent.TimeStamp, KillFame: btlEvent.TotalVictimKillFame, Victim: btlEvent.Victim })

        addPlayerToAlliance(btlEvent.Killer, btlEvent.TimeStamp)

        btlEvent.Participants.forEach(function (p) {
          addPlayerToAlliance(p, btlEvent.TimeStamp)
        })

        btlEvent.GroupMembers.forEach(function (p) {
          addPlayerToAlliance(p, btlEvent.TimeStamp)
        })
      })


      function getDeathCount(deaths, victim, stopIndex) {
        let deathCount = 0
        if (deaths) {
          deaths.forEach((death, index) => {
            if (index < stopIndex && death.Victim.Id === victim.Id) {
              deathCount++
            }
          })
        }
        return deathCount
      }

      Object.keys(alliances).forEach(id => {
        let alliance = alliances[id]
        alliance.TotalPlayers = Object.keys(alliance.Players).length
        alliance.TimeLine = []
        let nPlayers = alliance.TotalPlayers
        alliance.TimeLine.push({ x: alliance.InitialTimeStamp, y: nPlayers })
        alliance.TimeLine.push(...alliance.Deaths.map((death, index) => {
          if (death.Victim && death.Victim.DeathFame > 0) {
            nPlayers -= 1
          }
          return { x: death.TimeStamp, y: nPlayers, Victim: death.Victim, PriorDeaths: getDeathCount(alliance.Deaths, death.Victim, index) }
        }))

        // do not add last time stamp if it is already present
        if (alliance.TimeLine[alliance.TimeLine.length - 1].x !== alliance.LastTimeStamp)
          alliance.TimeLine.push({ x: alliance.LastTimeStamp, y: nPlayers })
      })
    }

    buildAlliances()
    return createBattleChart(battleChart.alliances, battleChart.minPlayers)
  }

  async function createBattleChart(alliances, minPlayers) {

    const ALLIANCE_COLORS = {
      "Final Order": '#00008B',
      "SEND": '#00008B',
      'SEA': '#008B8B',
      'ARCH': '#B8860B',
      'SQUAK': '#006400',
      'OOPS': '#BDB76B',
      'BEANS': '#BD008B',
      'BACON': '#755207',
      'ROT': '#556B2F',
      'EGO': '#CC8C00',
      'WARS': '#9932CC',
      'ONIX': '#8B0000',
      'BARBS': '#E9967A',
      'BAM': '#8FBC8F',
      'EOS': '#19603a',
      'RU': '#8E1C1C',
      'SAUCE': '#662222',
      'SURF': '#0325ff',
      'SUN': '#ffc905',
      'POE': '#73131e',
      '1941': '#CC0066',
      'ARM0R':'#4949d6',
      'DUNE' : '#d69b49',

      'RANG' : '#722e94',
      'K1SS' : '#b545ed',

      'VAPO' : '#edb23b',
      'VAP0' : '#FFCA5F',
      'NIMFY': '#4d26a3',
      'NIMBY': '#6e34eb',
      'DIOR' : '#223388',
      '1DONE' : '#993322',
      'GDL' : '#338833'
    }

    async function getDarkRandomColor(alliance) {
      if (alliance && alliance.Name && ALLIANCE_COLORS[alliance.Name])
        return ALLIANCE_COLORS[alliance.Name]

      var key = 'drc_' + alliance.Name
      var color = await GM_getValue(key)
      if (!color) {
        color = '#';
        for (var i = 0; i < 6; i++) {
          color += Math.floor(Math.random() * 10.0);
        }
        await GM_setValue(key, color)
      }
      return color;
    }

    function getPointBorderColor(context, c) {
      let index = context.dataIndex;
      var data = context.dataset.data[index];
      if (data.Victim && data.Victim.DeathFame > 0) {
        if (data.PriorDeaths > 0)
          return 'rgb(200,0,0)';
        return c;
      }
      // no fame
      return data.Victim ? c + '44' : c;
    }

    function getPointBackgroundColor(context, c) {
      let index = context.dataIndex;
      var data = context.dataset.data[index];
      if (data.Victim && data.Victim.DeathFame > 0) {
        return c;
      }
      return data.Victim ? c + '44' : 'rgba(0,0,0,0)'
    }

    async function createDatasets(alliances) {
      let dataSets = []
      // sort by name
      alliances = Object.values(alliances)
        .filter((alliance) => {
          return alliance.TotalPlayers >= minPlayers
        })
        .sort((a1, a2) => {
          return compare(a1.Name, a2.Name)
        })

      for (let alliance of alliances) {
        let c = await getDarkRandomColor(alliance)
        dataSets.push({
          label: alliance.Name,
          steppedLine: true,
          fill: false,
          pointBackgroundColor: function (context) { return getPointBackgroundColor(context, c) },
          pointBorderColor: function (context) { return getPointBorderColor(context, c) },
          backgroundColor: c,
          borderColor: c,
          data: alliance.TimeLine
        })
      }
      return dataSets;
    }

    let datasets = await createDatasets(alliances);

    $(document).find("#battleChartDiv").remove()
    const $div = $(document).find("[data-reactid='.0.2.1.3.0.0.5']");
    let battleHtml = '<div class="row" id="battleChartDiv" style="margin-bottom:20px"><div class="small-12 columns"><div class="top-table">'
    let notes = $('.load-more-text').length > 0 ? '<span class="load-all-data" style="float:right"><small style="color:aqua">Click load above for more results or <a>Load All</a></small></span>' : ''

    battleHtml += '<div class="top-table__headline top-table__headline--sub">Attrition by Death <small>(stats from <u>Battle History</u> Only)</small> '
    battleHtml += notes
    battleHtml += '</div></div></div>'
    battleHtml += '<div class="small-12 columns"><canvas id="battleChart" style="width: 1020px; height: 400px"></canvas>'
    battleHtml += '<div class="small-12 columns"><small style="color:grey">y-axis: Each alliance death with fame is -1</small><span class="right"><span style="color:rgb(200,0,0)">&#9675;</span><small style="color:grey">: player died previously</small></span></div>'
    battleHtml += '</div>'
    $div.before(battleHtml)

    if (battleChart.loadAll) {
      let $a = $('.load-more-text')
      if ($a.length > 0) {
        $('.load-all-data').html('<span style="float:right"><img src="https://assets.albiononline.com/assets/images/loading.gif"></span>')
        $a[0].click()
      }
    } else {
      $('.load-all-data a').one("click", () => {
        battleChart.loadAll = true
        let $a = $('.load-more-text')
        if ($a.length > 0) {
          $('.load-all-data').html('<span style="float:right"><img src="https://assets.albiononline.com/assets/images/loading.gif"></span>')
          setTimeout(() => $a[0].click())
        }
      })
    }

    let $canvas = $('#battleChart')
    let ctx = $canvas[0].getContext('2d');
    let LAST_TOOLTIP_SHOWN = { datasetIndex: -1, index: -1 }

    let chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',
      data: {
        datasets: datasets
      },
      options: {
        responsive: true,
        title: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              LAST_TOOLTIP_SHOWN = { datasetIndex: tooltipItem.datasetIndex, index: tooltipItem.index }

              let ds = data.datasets[tooltipItem.datasetIndex];
              var label = ds.label || '';
              if (label) {
                label += ': ';
              }
              label += tooltipItem.yLabel + ' Players';

              let d = ds.data[tooltipItem.index]
              let v = d.Victim
              if (v) {
                label += " - (" + v.Name + ": "
                if (v.DeathFame > 0)
                  label += (v.DeathFame > 1000 ? (fmt(v.DeathFame / 1000) + "k") : fmt(v.DeathFame)) + " fame"
                else
                  label += "no fame"
                if (d.PriorDeaths > 0) {
                  label += ", death #" + (d.PriorDeaths + 1)
                }
                label += ")"
              }
              return label
            }
          }
        },
        scales: {
          xAxes: [{
            type: 'time',
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'UTC Time (starting on ' + battleChart.date.getUTCFullYear() + "-" + (battleChart.date.getUTCMonth() + 1).toString().padStart(2, '0') + "-" + battleChart.date.getUTCDate().toString().padStart(2, '0') + ')'
            },
            time: {
              minUnit: "second",
              tooltipFormat: "MMMM Do YYYY, h:mm:ss a"
            },
            ticks: {
              callback: function (label, index, ticks) {
                if (label && ticks.length > 0) {
                  label = toUtcTime(new Date(ticks[index].value))
                }
                return label
              }
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Players'
            }
          }]
        }
      }
    });

    $canvas.click(function (evt) {
      let activePoints = chart.getElementsAtEvent(evt);
      if (activePoints.length) {
        // use last shown tooltip for active point
        let activePoint = activePoints.find((point) => {
          return LAST_TOOLTIP_SHOWN.datasetIndex === point._datasetIndex && LAST_TOOLTIP_SHOWN.index === point._index
        });

        // use clicked point
        if (!activePoint) {
          var mouse_position = Chart.helpers.getRelativePosition(evt, chart);
          activePoints = $.grep(activePoints, (activePoint) => {
            var leftX = activePoint._model.x - 5,
              rightX = activePoint._model.x + 5,
              topY = activePoint._model.y + 5,
              bottomY = activePoint._model.y - 5;

            return mouse_position.x >= leftX && mouse_position.x <= rightX && mouse_position.y >= bottomY && mouse_position.y <= topY;
          });
          activePoint = activePoints.length > 0 ? activePoints[0] : undefined
        }

        if (activePoint) {
          var datasetIndex = activePoint._datasetIndex;
          var index = activePoint._index;
          if (chart.data.datasets[datasetIndex].data[index].Victim)
            showPopupGearWorn(evt, chart.data.datasets[datasetIndex].data[index].Victim)
        }
      }
    });
  }

  async function modifyBattleHistory(response) {
    adjustRecentKills(".0.2.1.3.0.0.3.0.0.0.2", response, true)
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  GM_addStyle(".battle-summary-guild {display:none}");

  const battleSummary = { players: {}, loadAll: false, loadAll: false, minPlayers: 0, eventIds: [] }

  async function modifyBattleSummary(response) {
    if (response.url.match(/api\/gameinfo\/events\/battle\/.*\?offset=0.*$/)) {
      battleSummary.loadAll = false
      battleSummary.players = {}
      battleSummary.eventIds = []
    }

    battleSummary.minPlayers = battleShow.minPlayers

    const players = battleSummary.players
    function getPlayer(p, btlEvent, type) {
      let player = players[p.Id]
      if (!player) {
        player = players[p.Id] =
          {
            Id: p.Id,
            Name: p.Name,
            DamageDone: 0,
            SupportHealingDone: 0,
            Kills: 0,
            Deaths: 0,
            Naked: { Kills: 0, Deaths: 0 },
            DeathFame: 0,
            GuildName: p.GuildName,
            GuildId: p.GuildId,
            AllianceName: p.AllianceName,
            AllianceId: p.AllianceId,
            KillFame: 0,
            AverageItemPower: 0,
            Events: []
          }
      }

      // sometimes AvgIP is not present
      if (p.AverageItemPower) {
        player.AverageItemPower = Math.max(p.AverageItemPower, player.AverageItemPower)
      }

      // create events for player
      let event
      if(player.Events.length > 0 && player.Events[player.Events.length - 1].EventId === btlEvent.EventId ) {
        event = player.Events[player.Events.length - 1]
      } else {
        event = { EventId: btlEvent.EventId, Types:[], TimeStamp: new Date( btlEvent.TimeStamp ).getTime() }
        player.Events.push(event)
      }
      event.Types.push(type)

      return player
    }

    response.data.forEach(function (btlEvent) {
      // data is overlapped in query (offset/limit)
      if( battleSummary.eventIds.indexOf(btlEvent.EventId) > -1 ) return;
      battleSummary.eventIds.push(btlEvent.EventId)

      const victim = getPlayer(btlEvent.Victim, btlEvent, 'Victim' )
      victim.Deaths++
      victim.DeathFame += btlEvent.TotalVictimKillFame
      victim.Naked.Deaths += ( btlEvent.TotalVictimKillFame ? 0 : 1 )

      const killer = getPlayer(btlEvent.Killer, btlEvent, 'Killer' )
      killer.Kills++
      killer.Naked.Kills += ( btlEvent.TotalVictimKillFame ? 0 : 1 )

      // damage/heal for each participant
      btlEvent.Participants.forEach(function (p) {
        const player = getPlayer(p, btlEvent, 'Participant')
        player.DamageDone += p.DamageDone
        player.SupportHealingDone += p.SupportHealingDone
      })

      // individual fame for each group member player
      btlEvent.GroupMembers.forEach(function (p) {
        const player = getPlayer(p, btlEvent, 'GroupMember')
        player.KillFame += p.KillFame
      })
    })

//    console.log( JSON.stringify(players) )

    await createBattleSummary(players,battleSummary.minPlayers)

  }

  async function createBattleSummary(players, minPlayers) {
    function addPlayerToTotal(p, g) {
      g.Players++
      g.DamageDone += p.DamageDone
      g.SupportHealingDone += p.SupportHealingDone
      g.Kills += p.Kills
      g.Deaths += p.Deaths
      g.DeathFame += p.DeathFame
      g.KillFame += p.KillFame
      g.Naked.Kills += p.Naked.Kills
      g.Naked.Deaths += p.Naked.Deaths

      g.Actual.Kills += ( p.Kills - p.Naked.Kills )
      g.Actual.Deaths += ( p.Deaths - p.Naked.Deaths )

      if (p.AverageItemPower) {
        g.AverageItemPowers.push(p.AverageItemPower)
      }

      p.Events.forEach((pEvt) => {
        let event = g.Events.find((val)=>val.EventId === pEvt.EventId )
        if( event ) {
          pushAllUnique( event.Types, pEvt.Types )
        } else {
          event = { EventId: pEvt.EventId, Types: [...pEvt.Types], TimeStamp: pEvt.TimeStamp }
          g.Events.push(event)
        }
      })

    }

    const result = {
      max: {
        Players: 0, Kills: 0, Deaths: 0, KD: 0, KDFame: 0, DeathFame: 0, KillFame: 0, DamageDone: 0, SupportHealingDone: 0,
        Actual: { Kills: 0, Deaths: 0, KD: 0 }
      },
      InitialTimeStamp: undefined,
      FinalTimeStamp: undefined
    }
    result.alliances = Object.values(players).reduce((alliances, p) => {
      let id = p.AllianceId ? p.AllianceId : ( p.GuildId ? p.GuildId : 'no-guild' )
      let name = p.AllianceName ? p.AllianceName : ( p.GuildName ? p.GuildName : '(No Guild)' )
      let a = alliances[id]
      if (!a) {
        a = alliances[id] = {
          Id: id,
          Name: name,
          Players: 0,
          DamageDone: 0,
          SupportHealingDone: 0,
          Kills: 0,
          Deaths: 0,
          Naked: { Kills: 0, Deaths: 0 },
          Actual: { Kills: 0, Deaths: 0 },
          DeathFame: 0,
          KillFame: 0,
          AverageItemPowers: [],
          Guilds: ( p.AllianceId ? {} : undefined ),
          Events: []
        }
      }
      addPlayerToTotal(p, a)

      // in an alliance
      if( p.AllianceId ) {
        id = p.GuildId
        name = p.GuildName
        let g = a.Guilds[id]
        if (!g) {
          g = a.Guilds[id] = {
            Id: id,
            Name: name,
            Players: 0,
            DamageDone: 0,
            SupportHealingDone: 0,
            Kills: 0,
            Deaths: 0,
            Naked: { Kills: 0, Deaths: 0 },
            Actual: { Kills: 0, Deaths: 0 },
            DeathFame: 0,
            KillFame: 0,
            AverageItemPowers: [],
            Events: []
          }
        }
        addPlayerToTotal(p, g)
      }
      return alliances
    }, {})

    function divide(a, b) {
      if (b === 0) {
        return a > 0 ? Infinity : undefined
      }
      return a / b
    }

    Object.values(result.alliances).forEach((a) => {
      const max = result.max
      a.KD = divide(a.Kills, a.Deaths)
      max.KD = Math.max(max.KD, a.KD)

      a.Actual.KD = divide(a.Actual.Kills, a.Actual.Deaths)
      max.Actual.KD = Math.max(max.Actual.KD, a.Actual.KD)

      a.KDFame = divide(a.KillFame, a.DeathFame)
      max.KDFame = Math.max(max.KDFame, a.KDFame)

      a.Events = a.Events.sort((a,b)=>a.TimeStamp - b.TimeStamp)

      if( result.InitialTimeStamp ) {
        result.InitialTimeStamp = Math.min( a.Events[0].TimeStamp, result.InitialTimeStamp )
        result.FinalTimeStamp = Math.max( a.Events[a.Events.length - 1].TimeStamp, result.FinalTimeStamp )
      } else {
        result.InitialTimeStamp = a.Events[0].TimeStamp
        result.FinalTimeStamp = a.Events[a.Events.length - 1].TimeStamp
      }


      if( a.Guilds ) {
        Object.values(a.Guilds).forEach((g) => {
          g.KD = divide(g.Kills, g.Deaths)
          g.Actual.KD = divide(g.Actual.Kills, g.Actual.Deaths)
          g.KDFame = divide(g.KillFame, g.DeathFame)
          g.Events = g.Events.sort((a,b)=>a.TimeStamp - b.TimeStamp)
        })
      }
    });

    // strip out small number of players
    result.alliances = Object.values( result.alliances ).reduce( ( alliances, a ) => {
      if( a.Players >= minPlayers ) {
        alliances[a.Id] = a
      }
      return alliances
    }, {} )


//    console.log(JSON.stringify(result))
    let notes = $('.load-more-text').length > 0 ? '<span class="load-all-data3" style="float:right"><small style="color:aqua">Click load below for more results or <a>Load All</a></small></span>' : ''
    let html = ''
    html += '<div class="row battleSummary"><div class="small-12 columns">'
    html += '<div class="top-table__headline top-table__headline--sub">Alliance Summary <small>(stats from <u>Battle History</u> Only)</small>'
    html += notes + '</div><table class="table table--top-table">'

    html += '<thead>'
    html += '<tr class="reactable-column-header">'
    html += '<th rowspan="2">Alliance / <small><input type="checkbox" style="margin: 0;" id="show-guilds">Guilds</small></th>'
    html += '<th colspan="2">Player</th>'
    html += '<th colspan="3"><img style="margin-top:-3px" src="https://assets.albiononline.com/assets/images/killboard/kill__date.png" width="15px" height="15px"></img>&nbsp;&nbsp;Kill Participation<small style="float:right"><input type="checkbox" id="show-nakeds" style="margin: 0;"> Nakeds</small></th>'
    html += '<th colspan="3"><span style="float:left;height:17px;"><span class="fame-list__icon fame-list__icon--fame" style="filter:brightness(120%);transform:scale(.3);margin-top:-17px;margin-right:-12px;"></span></span>Fame</th>'
    html += '<th rowspan="2" style="width:20%">Timeline<br/><small>(<span style="color:red">Kills</span>, <span style="color:grey">Deaths</span></small>)</th>'
    html += '</tr>'
    html += '<tr class="reactable-column-header">'
    html += '<th>Total</th><th>Avg IP</th><th>Kills</th><th>Deaths</th><th>K/D</th>'
//    html += '<th>Damage</th><th>Heals</th>'
    html += '<th>Kill</th><th>Death</th><th>K/D</th>'
    html += '</tr>'
    html += '</thead><tbody class="reactable-data">'

    function avgIp(array) {
      if (array.length > 0) {
        const total = array.reduce((acc, c) => acc + c, 0);
        return fmt(total / array.length);
      }
      return ''
    }

    function toRed(a, b, str, n) {
      if (str === Infinity)
        str = '&infin;'
      else if (str === undefined)
        str = ''
      else if (str && typeof str === "number")
        str = str.toFixed(n)

      if (a === b) {
        return '<span style="color:red">' + str + '</span>'
      }
      return str
    }

    function addEventHtml(g) {
      let dTime = result.FinalTimeStamp - result.InitialTimeStamp
      let html = '<div style="width:100%;height:1em;border:solid grey 1px;position: relative;overflow:hidden">'
      let last = { repeated: 1, perc: -1, type: null }

      g.Events.sort((a,b) => {
        if( a.Types.indexOf('Killer') ) {
          if( b.Types.indexOf('Killer') )  return 0
          return -1
        }
        if( b.Types.indexOf('Killer') )  return 1


        if( a.Types.indexOf('Victim') ) {
          if( b.Types.indexOf('Victim') )  return 0
          return -1
        }
        if( b.Types.indexOf('Victim') )  return 1

        return 0
      }).forEach( (evt) => {
        let color = '0,0,255,0.3'
        let type = 'ANY'
        let z = 0
        if( evt.Types.indexOf('Victim') > -1 ) {
          color = '0,0,0,0.4'
          z = 10
          type = 'Victim'
        } else if( evt.Types.indexOf('Killer') > -1 ) {
          color = '255,0,0,0.4'
          type = 'Killer'
          z = 100
        } else {
          // skip other types
          return
        }

        let perc = ( ( evt.TimeStamp - result.InitialTimeStamp ) / dTime * 100 ).toFixed(0)
        let width = 1
        if( last.perc == perc && last.type === type ) {
          last.repeated++
          width = Math.min( last.repeated, 20 )
        } else {
          last.repeated = 1
          last.type = type
          last.perc = perc
        }

        html += '<span style="position:absolute;z-index:' + z + ';height:100%;width:' + width + 'px;border:none;background-color:rgba(' + color + ');left:'
        html += perc
        html += '%"></span>'
      })

      html += '</div>'

      return html
    }

    function addToHtml(a, max) {
      html += '<td style="text-align:center;border-left: 1px solid #a1a1a1">' + fmt(a.Players) + '</td>'
      html += '<td style="text-align:right">' + avgIp(a.AverageItemPowers) + '</td>'
      html += '<td style="text-align:center;border-left: 1px solid #a1a1a1">'
      + '<span class="battle-summary-stats-all" style="display:none">' + fmt(a.Kills) + '</span>'
      + '<span class="battle-summary-stats-real">' + fmt(a.Actual.Kills) + '</span>'
      + ( a.Naked.Kills ? ( '&nbsp;<small class="battle-summary-stats-real" style="position:absolute;color:grey">&nbsp;(+' + fmt(a.Naked.Kills) + ')</small>' ) : '' )
      + '</td>'
      html += '<td style="text-align:center">'
      + '<span class="battle-summary-stats-all" style="display:none">' + fmt(a.Deaths) + '</span>'
      + '<span class="battle-summary-stats-real">' + fmt(a.Actual.Deaths) + '</span>'
      + ( a.Naked.Deaths ? ( '&nbsp;<small  class="battle-summary-stats-real" style="position:absolute;color:grey">&nbsp;(+' + fmt(a.Naked.Deaths) + ')</small>' ) : '' )
      + '</td>'
      html += '<td style="text-align:right">'
      + '<span class="battle-summary-stats-all" style="display:none">' + toRed(a.KD, max.KD, a.KD, 2) + '</span>'
      + '<span class="battle-summary-stats-real">' + toRed( a.Actual.KD, max.Actual && max.Actual.KD, a.Actual.KD, 2) + '</span>'
      + '</td>'
      html += '<td style="text-align:right;border-left: 1px solid #a1a1a1">' + fmt(a.KillFame) + '</td>'
      html += '<td style="text-align:right">' + fmt(a.DeathFame) + '</td>'
      html += '<td style="text-align:right;border-right: 1px solid #a1a1a1">' + toRed(a.KDFame, max.KDFame, a.KDFame, 2) + '</td>'
      html += '<td style="text-align:right">'
      html += addEventHtml(a)
      html += '</td>'
    }

    Object.values(result.alliances).sort((a, b) => compare(a.Name, b.Name)).forEach((a) => {
      html += '<tr>'
      html += '<td>'
      if( a.Id !== 'no-guild' ) {
        html += "<a href='" + toUrl("killboard/" + (a.Guilds ? "alliance" : "guild") + "/" + a.Id) + "'>" + a.Name + "</a>"
      } else {
        html += a.Name
      }
      html += '</td>'

      addToHtml(a, result.max)
      html += '</tr>'

      if( a.Guilds ) {
        Object.values(a.Guilds).sort((a, b) => compare(a.Name, b.Name)).forEach((g) => {
          html += '<tr class="battle-summary-guild">'
          html += '<td>' + "&nbsp;&nbsp;<a href='" + toUrl("killboard/guild/" + g.Id) + "'>" + g.Name + "</a> " + '</td>'
          addToHtml(g, {})
          html += '</tr>'
        })
      }
    });

    html += '</tbody></table>'
    html += '</div></div><br class="battleSummary">'


    $('.battleSummary').remove()
    $("[data-reactid='.0.2.1.3.0.0.2']").after(html)

    $('.battleSummary tr:visible').filter(':odd').find('td').css({ 'background-color': 'rgba(0,0,0,.05)' });
    $('.battleSummary tr:visible').filter(':even').find('td').css({ 'background-color': 'rgba(0,0,0,0)' });


    $('#show-guilds').click(function () {
      if (this.checked) {
        $(".battle-summary-guild").show();
      } else {
        $(".battle-summary-guild").hide();
      }
      $('.battleSummary tr:visible').filter(':odd').find('td').css({ 'background-color': 'rgba(0,0,0,.05)' });
      $('.battleSummary tr:visible').filter(':even').find('td').css({ 'background-color': 'rgba(0,0,0,0)' });
    });

    $('#show-nakeds').click(function () {
      if (this.checked) {
        $(".battle-summary-stats-all").show();
        $(".battle-summary-stats-real").hide();
      } else {
        $(".battle-summary-stats-all").hide();
        $(".battle-summary-stats-real").show();
      }
      $('.battleSummary tr:visible').filter(':odd').find('td').css({ 'background-color': 'rgba(0,0,0,.05)' });
      $('.battleSummary tr:visible').filter(':even').find('td').css({ 'background-color': 'rgba(0,0,0,0)' });
    });

    if (battleSummary.loadAll) {
      let $a = $('.load-more-text')
      if ($a.length > 0) {
        $('.load-all-data3').html('<span style="float:right"><img src="https://assets.albiononline.com/assets/images/loading.gif"></span>')
        $a[0].click()
      }
    } else {
      $('.load-all-data3 a').one("click", () => {
        battleSummary.loadAll = true
        let $a = $('.load-more-text')
        if ($a.length > 0) {
          $('.load-all-data3').html('<span style="float:right"><img src="https://assets.albiononline.com/assets/images/loading.gif"></span>')
          setTimeout(() => $a[0].click())
        }
      })
    }
  }



  ////////////////////////////////////////////////////////////////////////////

  GM_addStyle("#playerFilter { text-indent:3px;padding: 0;margin:0;height:20px;width:120px;max-width:120px;font-size:0.5rem;}");
  GM_addStyle("#percentFilter { text-indent:3px;padding: 0;margin:0;height:20px;width:120px;max-width:120px;font-size:0.5rem;}");
  GM_addStyle("#participantStats { padding-bottom:20px }");
  GM_addStyle(".max-damage { color:red }");
  GM_addStyle(".max-heal { color:red }");

  // timeline
  GM_addStyle(".tl-Killer      { position:absolute;z-index:100;height:100%;border:none;padding:0;margin:0;background-color:rgba(255,0,0,0.5) }");
  GM_addStyle(".tl-Victim      { position:absolute;z-index:50; height:100%;border:none;padding:0;margin:0;background-color:rgba(0,0,0,1.0) }");
  GM_addStyle(".tl-GroupMember { position:absolute;z-index:10; height:100%;border:none;padding:0;margin:0;background-color:rgba(0,0,255,0.3) }");
  GM_addStyle(".tl-Participant { position:absolute;z-index:10; height:100%;border:none;padding:0;margin:0;background-color:rgba(0,0,255,0.3) }");

  const btlEvents = { players: {}, playerFilter: '', loadAll: false, percentFilter: 'affiliation', eventIds: [] }
  async function modifyBattleAddPlayers(response) {
    // new battle (otherwise load was clicked)
    if (response.url.match(/api\/gameinfo\/events\/battle\/.*\?offset=0.*$/)) {
      btlEvents.players = {}
      btlEvents.eventIds = []
      btlEvents.playerFilter = ''
      btlEvents.percentFilter = 'affiliation'
      btlEvents.loadAll = false
    }

    const players = btlEvents.players
    function getPlayer(p, btlEvent, type) {
      let player = players[p.Id]
      if (!player) {
        player = players[p.Id] =
          {
            Id: p.Id,
            Name: p.Name,
            ParticipatedIn:
            {
              Count: 0,
              DamageDone: 0,
              SupportHealingDone: 0,
              Total: {
                DamageDone: 0,
                SupportHealingDone: 0,
                Count: 0
              }
            },
            Kills: 0,
            Deaths: [],
            DeathEventId: 0,
            DeathFame: 0,
            Equipment: p.Equipment,
            GuildName: p.GuildName,
            GuildId: p.GuildId,
            AllianceName: p.AllianceName,
            AllianceId: p.AllianceId,
            FameMember: {
              Count: 0,
              KillFame: 0,
              Total: 0,
              TotalKillFame: 0
            },
            Events:[]
          }
      }

      // sometimes AvgIP is not present
      if (!player.AverageItemPower && p.AverageItemPower) {
        player.AverageItemPower = p.AverageItemPower
      }

      // sometimes Equipment is messed up from GroupMembers array
      if (!(player.Equipment && player.Equipment.Armor) && (p.Equipment && p.Equipment.Armor)) {
        player.Equipment = p.Equipment
      }

      // create events for player
      if( btlEvent ) {
        let event
        if(player.Events.length > 0 && player.Events[player.Events.length - 1].EventId === btlEvent.EventId ) {
          event = player.Events[player.Events.length - 1]
        } else {
          event = { EventId: btlEvent.EventId, Types:[], TimeStamp: new Date( btlEvent.TimeStamp ).getTime() }
          player.Events.push(event)
        }
        event.Types.push(type)
      }

      return player
    }

    function createOptions(players) {
      const alliances = {}

      let rVal = ""

      function getAlliance(p) {
        const name = p.AllianceName ? p.AllianceName : '(no alliance)'
        const id = p.AllianceId ? p.AllianceId : 'No_Alliance'
        if (alliances[id]) {
          alliances[id].total++
        } else {
          alliances[id] = { id: id, name: name, total: 1, guilds: {} }
        }
        return alliances[id]
      }

      Object.values(players).forEach(function (player) {
        const alliance = getAlliance(player)
        const name = player.GuildName ? player.GuildName : '(no guild)'
        const id = player.GuildId ? player.GuildId : 'No_Guild'
        const guilds = alliance.guilds
        if (guilds[id]) {
          guilds[id].total++
        } else {
          guilds[id] = { id: id, name: name, alliance: { name: player.AllianceName, id: player.AllianceId, total: 1 }, total: 1 }
        }
      })

      Object.values(alliances).sort(function (a, b) {
        return compare(a.name, b.name)
      }).forEach(function (alliance) {
        rVal += '<option style="font-weight:bold" value="' + alliance.id + '">&nbsp;' + alliance.name + ' (' + alliance.total + ')</option>'
        Object.values(alliance.guilds).sort(function (a, b) {
          return compare(a.name, b.name)
        }).forEach(function (guild) {
          rVal += '<option value="' + guild.id + '">&nbsp;&nbsp;&nbsp;' + guild.name + ' (' + guild.total + ')</option>'
        })
      });

      return rVal
    }

    response.data.forEach(function (btlEvent) {

      if( btlEvents.eventIds.indexOf(btlEvent.EventId) > -1 ) return
      btlEvents.eventIds.push(btlEvent.EventId)

      const btlEventTotal = { DamageDone: 0, SupportHealingDone: 0, Count: 0 }

      const victim = getPlayer(btlEvent.Victim, btlEvent, 'Victim')
      victim.Deaths.push({ EventId: btlEvent.EventId, Fame: btlEvent.TotalVictimKillFame })

      const killer = getPlayer(btlEvent.Killer, btlEvent, 'Killer')
      const evtParticipants = [killer]
      killer.Kills++
      killer.ParticipatedIn.Count += 1
      btlEventTotal.Count++

      // damage/heal for each participant
      btlEvent.Participants.forEach(function (p) {
        const player = getPlayer(p, btlEvent, 'Participant')
        if (player.Id !== killer.Id) {
          player.ParticipatedIn.Count += 1
          btlEventTotal.Count++
          evtParticipants.push(player)
        }
        player.ParticipatedIn.DamageDone += p.DamageDone
        player.ParticipatedIn.SupportHealingDone += p.SupportHealingDone

        btlEventTotal.DamageDone += p.DamageDone
        btlEventTotal.SupportHealingDone += p.SupportHealingDone
      })

      // Add btlEvent damage/heal for all contributing players
      evtParticipants.forEach(function (player) {
        player.ParticipatedIn.Total.DamageDone += btlEventTotal.DamageDone
        player.ParticipatedIn.Total.SupportHealingDone += btlEventTotal.SupportHealingDone
        player.ParticipatedIn.Total.Count += btlEventTotal.Count

      })

      // invidual and total fame for each group member player
      btlEvent.GroupMembers.forEach(function (p) {
        const player = getPlayer(p, btlEvent, 'GroupMember')
        player.FameMember.Count++
        player.FameMember.KillFame += p.KillFame
        player.FameMember.Total += btlEvent.groupMemberCount
        player.FameMember.TotalKillFame += btlEvent.TotalVictimKillFame
      })
    })


    //////////////////////////////////////////////////////////////
    // sum for all players

    btlEvents.total = {
      guilds: {},
      alliances: {},
      all: { DamageDone: 0, SupportHealingDone: 0, max: { DamageDone: 0, SupportHealingDone: 0 } },
      InitialTimeStamp: null,
      FinalTimeStamp: null
    }

    Object.values(players).forEach((player) => {
      btlEvents.total.all.DamageDone += player.ParticipatedIn.DamageDone
      btlEvents.total.all.SupportHealingDone += player.ParticipatedIn.SupportHealingDone
      btlEvents.total.all.max.DamageDone = Math.max(player.ParticipatedIn.DamageDone, btlEvents.total.all.max.DamageDone)
      btlEvents.total.all.max.SupportHealingDone = Math.max(player.ParticipatedIn.SupportHealingDone, btlEvents.total.all.max.SupportHealingDone)
      if( btlEvents.total.InitialTimeStamp ) {
        btlEvents.total.InitialTimeStamp = Math.min(player.Events[0].TimeStamp,btlEvents.total.InitialTimeStamp)
        btlEvents.total.FinalTimeStamp = Math.max(player.Events[player.Events.length - 1].TimeStamp,btlEvents.total.FinalTimeStamp)
      } else {
        btlEvents.total.InitialTimeStamp = player.Events[0].TimeStamp
        btlEvents.total.FinalTimeStamp = player.Events[player.Events.length - 1].TimeStamp
      }


      if (player.GuildId) {
        let guild = btlEvents.total.guilds[player.GuildId] || { DamageDone: 0, SupportHealingDone: 0, max: { DamageDone: 0, SupportHealingDone: 0 } }
        guild.DamageDone += player.ParticipatedIn.DamageDone
        guild.SupportHealingDone += player.ParticipatedIn.SupportHealingDone
        guild.max.DamageDone = Math.max(player.ParticipatedIn.DamageDone, guild.max.DamageDone)
        guild.max.SupportHealingDone = Math.max(player.ParticipatedIn.SupportHealingDone, guild.max.SupportHealingDone)
        btlEvents.total.guilds[player.GuildId] = guild
      }

      if (player.AllianceId) {
        let alliance = btlEvents.total.alliances[player.AllianceId] || { DamageDone: 0, SupportHealingDone: 0, max: { DamageDone: 0, SupportHealingDone: 0 } }
        alliance.DamageDone += player.ParticipatedIn.DamageDone
        alliance.SupportHealingDone += player.ParticipatedIn.SupportHealingDone
        alliance.max.DamageDone = Math.max(player.ParticipatedIn.DamageDone, alliance.max.DamageDone)
        alliance.max.SupportHealingDone = Math.max(player.ParticipatedIn.SupportHealingDone, alliance.max.SupportHealingDone)
        btlEvents.total.alliances[player.AllianceId] = alliance
      }
    })

    ////////

//    console.log(JSON.stringify(players))

    function addEventHtml(a) {
      let dTime = btlEvents.total.FinalTimeStamp - btlEvents.total.InitialTimeStamp
      let html = '<div style="width:100%;height:1em;border:solid grey 1px;position: relative;overflow:hidden">'
      let last = { repeated: 1, perc: -1, type: null }

      a.Events.sort((a,b) => {
        if( a.Types.indexOf('Killer') ) {
          if( b.Types.indexOf('Killer') )  return 0
          return -1
        }
        if( b.Types.indexOf('Killer') )  return 1


        if( a.Types.indexOf('Victim') ) {
          if( b.Types.indexOf('Victim') )  return 0
          return -1
        }
        if( b.Types.indexOf('Victim') )  return 1

        return 0
      }).forEach( (evt) => {
        let type = 'Participant'
        let width = 1
        let z = 10
        if( evt.Types.indexOf('Victim') > -1 ) {
          z = 50
          width = 3
          type = 'Victim'
        } else if( evt.Types.indexOf('Killer') > -1 ) {
          type = 'Killer'
          z = 100
          width = 2
        } else if( evt.Types.indexOf('GroupMember') > -1 ) {
          type = 'GroupMember'
          z = 20
        }

        let perc = ( ( evt.TimeStamp - btlEvents.total.InitialTimeStamp ) / dTime * 100 ).toFixed(0)
        if( last.perc == perc && last.type === type ) {
          last.repeated++
          width = Math.min( last.repeated, 20 )
        } else {
          last.repeated = 1
          last.type = type
          last.perc = perc
        }

        html += '<span class="tl-' + type + '" style="width:' + width + 'px;left:' + perc + '%"></span>'
      })

      html += '</div>'

      return html
    }

    let notes = $('.load-more-text').length > 0 ? '<span class="load-all-data2" style="float:right"><small style="color:aqua">Click load above for more results or <a>Load All</a></small></span>' : ''
    let playerHtml = '<div class="row" id="participantStats"><div class="small-12 columns"><div class="top-table__headline top-table__headline--sub">All Players <small>(stats from <u>Battle History</u> Only)</small>' + notes + '</div><table class="table table--top-table">'
      + '<thead>'
      + '<tr class="reactable-column-header">'
      + '<th colspan="1" rowspan="2" style="width:60px"></th>'
      + '<th colspan="1" rowspan="2">WPN</th>'
      + '<th colspan="1" rowspan="2">Player <small>(IP)</small><br>'
      + '<select id="playerFilter"><option value="">&nbsp;(show all)</option>' + createOptions(players) + '</select>'
      + '</th>'
      + '<th colspan="1" rowspan="2" style="text-align:center">Kills</th>'
      + '<th colspan="2"><img style="margin-top:-3px" src="https://assets.albiononline.com/assets/images/killboard/kill__date.png" width="15px" height="15px"></img>&nbsp;&nbsp;Kill Participation</th>'
      + '<th colspan="3"><span style="float:left;height:17px;"><span class="fame-list__icon fame-list__icon--fame" style="filter:brightness(120%);transform:scale(.3);margin-top:-17px;margin-right:-12px;"></span></span>Kill Fame Distribution</th>'
      + '<th rowspan="2" style="width:20%">Timeline<br/><small>(<span style="color:red">Kill</span>, <span style="color:black">Death</span>, <span style="color:blue">Assist|Awarded</span></small>)</th>'
      + '</tr><tr class="reactable-column-header">'
      + '<th style="text-align:center">Assists</th>'
      + '<th style="text-align:center;font-size:8pt!important">Plyrs / Ast</th>'
      + '<th style="text-align:center">Awarded</th>'
      + '<th style="text-align:center;font-size:8pt!important">Plyrs / Awd</th>'
      + '<th style="text-align:center">Fame</th>'
      + '</tr></thead><tbody class="reactable-data">'

    Object.values(players).sort(function (a, b) {
      return compare(a.AllianceName, b.AllianceName) || compare(a.GuildName, b.GuildName) || compare(a.Name, b.Name);
    }).forEach(function (player) {
      const partIn = player.ParticipatedIn, fm = player.FameMember
      playerHtml += '<tr class="fixed-row-height ' + (player.AllianceId ? player.AllianceId : 'No_Alliance') + '-players ' + (player.GuildId ? player.GuildId : 'No_Guild') + '-players all-players">'
        + '<td style="text-align:center">'
      if (player.Deaths.length == 1) {
        playerHtml += '<small><a class="mouseHilite" href="' + toUrl("killboard/kill/" + player.Deaths[0].EventId) + '"><img src="https://assets.albiononline.com/assets/images/killboard/kill__date.png" width="20px" height="20px"></img><br>' + fmt(player.Deaths[0].Fame) + '</a></small>'
      } else if (player.Deaths.length > 1) {
        playerHtml += '<small>'
        player.Deaths.forEach(death => {
          if (death.Fame) {
            playerHtml += '<a class="mouseHilite" href="' + toUrl("killboard/kill/" + death.EventId) + '">' + fmt(death.Fame) + '</a><br>'
          }
        })
        playerHtml += '</small>'
      }

      playerHtml += '</td><td>' + createWeaponImg(player, 35)
        + '</td><td>' + createPlayerLink(player)
        + '</td><td style="text-align:center;border-right: 1px solid #a1a1a1;border-left: 1px solid #a1a1a1;">' + player.Kills
        + '</td><td style="text-align:center">' + fmt(partIn.Count)
        + '</td><td style="text-align:center">' + ( ( ( ! partIn.Count ) || (!partIn.Total.Count) )  ? '' : (partIn.Total.Count/partIn.Count).toFixed(1) )
        + '</td>'
        /*
        + '<td style="text-align:right">' + fmt(partIn.DamageDone)
        + '</td><td style="text-align:right">' + fmt(partIn.SupportHealingDone)
        + '</td><td style="text-align:right;border-left: 1px solid #a1a1a1;">'

        //////////////////////////////

        + '<span class="percentFilters participants-percentFilter">'
        + (partIn.DamageDone === 0 ? '' : (partIn.DamageDone / partIn.Total.DamageDone * 100.0).toFixed(1) + ' %')
        + '</span>'

      if (player.GuildId && btlEvents.total.guilds[player.GuildId].DamageDone > 0) {
        const maxDmg = (partIn.DamageDone === btlEvents.total.guilds[player.GuildId].max.DamageDone ? 'max-damage' : '')
        playerHtml += `<span class="percentFilters guild-percentFilter ${maxDmg}">`
          + (partIn.DamageDone === 0 ? '' : (partIn.DamageDone / btlEvents.total.guilds[player.GuildId].DamageDone * 100.0).toFixed(1) + ' %')
          + '</span>'
      }

      if (player.AllianceId && btlEvents.total.alliances[player.AllianceId].DamageDone > 0) {
        const maxDmg = (partIn.DamageDone === btlEvents.total.alliances[player.AllianceId].max.DamageDone ? 'max-damage' : '')
        playerHtml += `<span class="percentFilters alliance-percentFilter ${maxDmg}">`
          + (partIn.DamageDone === 0 ? '' : (partIn.DamageDone / btlEvents.total.alliances[player.AllianceId].DamageDone * 100.0).toFixed(1) + ' %')
          + '</span>'
      }

      if (btlEvents.total.affiliations[player.Affiliation.Index]) {
        const maxDmg = (partIn.DamageDone === btlEvents.total.affiliations[player.Affiliation.Index].max.DamageDone ? 'max-damage' : '')
        playerHtml += `<span class="percentFilters affiliation-percentFilter ${maxDmg}">`
          + (partIn.DamageDone === 0 ? '' : (partIn.DamageDone / btlEvents.total.affiliations[player.Affiliation.Index].DamageDone * 100.0).toFixed(1) + ' %')
          + '</span>'
      }

      if (btlEvents.total.all.DamageDone > 0) {
        const maxDmg = (partIn.DamageDone === btlEvents.total.all.max.DamageDone ? 'max-damage' : '')
        playerHtml += `<span class="percentFilters all-percentFilter ${maxDmg}">`
          + (partIn.DamageDone === 0 ? '' : (partIn.DamageDone / btlEvents.total.all.DamageDone * 100.0).toFixed(1) + ' %')
          + '</span>'
      }

      //////////////////////////////

      playerHtml += '</td><td style="text-align:right;border-right: 1px solid #a1a1a1;">'
        + '<span class="percentFilters participants-percentFilter">'
        + (partIn.SupportHealingDone === 0 ? '' : (partIn.SupportHealingDone / partIn.Total.SupportHealingDone * 100).toFixed(1) + '%')
        + '</span>'

      if (player.GuildId && btlEvents.total.guilds[player.GuildId].SupportHealingDone > 0) {
        const maxHeal = (partIn.SupportHealingDone === btlEvents.total.guilds[player.GuildId].max.SupportHealingDone ? 'max-heal' : '')
        playerHtml += `<span class="percentFilters guild-percentFilter ${maxHeal}">`
          + (partIn.SupportHealingDone === 0 ? '' : (partIn.SupportHealingDone / btlEvents.total.guilds[player.GuildId].SupportHealingDone * 100.0).toFixed(1) + ' %')
          + '</span>'
      }

      if (player.AllianceId && btlEvents.total.alliances[player.AllianceId].SupportHealingDone > 0) {
        const maxHeal = (partIn.SupportHealingDone === btlEvents.total.alliances[player.AllianceId].max.SupportHealingDone ? 'max-heal' : '')
        playerHtml += `<span class="percentFilters alliance-percentFilter ${maxHeal}">`
          + (partIn.SupportHealingDone === 0 ? '' : (partIn.SupportHealingDone / btlEvents.total.alliances[player.AllianceId].SupportHealingDone * 100.0).toFixed(1) + ' %')
          + '</span>'
      }

      if (btlEvents.total.affiliations[player.Affiliation.Index]) {
        const maxDmg = (partIn.SupportHealingDone === btlEvents.total.affiliations[player.Affiliation.Index].max.SupportHealingDone ? 'max-damage' : '')
        playerHtml += `<span class="percentFilters affiliation-percentFilter ${maxDmg}">`
          + (partIn.SupportHealingDone === 0 ? '' : (partIn.SupportHealingDone / btlEvents.total.affiliations[player.Affiliation.Index].SupportHealingDone * 100.0).toFixed(1) + ' %')
          + '</span>'
      }

      if (btlEvents.total.all.SupportHealingDone > 0) {
        const maxHeal = (partIn.SupportHealingDone === btlEvents.total.all.max.SupportHealingDone ? 'max-heal' : '')
        playerHtml += `<span class="percentFilters all-percentFilter ${maxHeal}">`
          + (partIn.SupportHealingDone === 0 ? '' : (partIn.SupportHealingDone / btlEvents.total.all.SupportHealingDone * 100.0).toFixed(1) + ' %')
          + '</span>'
      }

      playerHtml += '</td>'

      */

      //////////////////////////////

      playerHtml += '<td style="text-align:center;border-left: 1px solid #a1a1a1">' + fmt(fm.Count)
        + '</td><td style="text-align:center">' + ( ( ( ! fm.Count ) || (!fm.Total) )  ? '' : (fm.Total/fm.Count).toFixed(1) )
        + '</td><td style="text-align:right;border-right: 1px solid #a1a1a1">' + fmt(fm.KillFame)
//        + '<td style="width:20%"><div style="width:100%;height:1em;border:solid grey 1px;position: relative;overflow:hidden"></div></td>'
        + '</td><td style="width:20%">' + addEventHtml( player )
        + '</td></tr>'
    })

    playerHtml += '</tbody></table></div></div>'

    $(document).find("#participantStats").remove()
    const $playersDiv = $(document).find("[data-reactid='.0.2.1.3.0.0.4']");
    $playersDiv.after(playerHtml)

    if (btlEvents.loadAll) {
      let $a = $('.load-more-text')
      if ($a.length > 0) {
        $('.load-all-data2').html('<span style="float:right"><img src="https://assets.albiononline.com/assets/images/loading.gif"></span>')
        $a[0].click()
      }
    } else {
      $('.load-all-data2 a').one("click", () => {
        btlEvents.loadAll = true
        let $a = $('.load-more-text')
        if ($a.length > 0) {
          $('.load-all-data2').html('<span style="float:right"><img src="https://assets.albiononline.com/assets/images/loading.gif"></span>')
          setTimeout(() => $a[0].click())
        }
      })
    }

    $("#playerFilter").val(btlEvents.playerFilter).change(function () {
      $(this).find("option:selected").each(function () {
        const guildId = btlEvents.playerFilter = $(this).val()
        if (guildId) {
          $('.all-players').hide()
          $('.' + $(this).val() + '-players').show()
        } else {
          $('.all-players').show()
        }
      });
    }).trigger('change')

  }

  ///////////////////////////////////////////////////////////////////////////////
  // HELPER METHODS

  function fmt(val) {
    if (val) return Math.round(val).toLocaleString()
    return ''
  }

  function compare(a, b) {
    if (a === b) return 0;
    if (!a) return -1
    if (!b) return 1
    return a.toLowerCase().localeCompare(b.toLowerCase())
  }

  function createLabel(label, value) {
    return "<tr><td><div class='mini-profile__key'>" + label + "</div></td><td><div class='mini-profile__value'>" + value.toLocaleString() + "</div></td>"
  }

  function adjustRecentKills(reactId, response, noBtlLink) {
    const $table = $("table[data-reactid='" + reactId + "']");
    const m = response.url.match(/offset=([\d]+)/)
    let skipIndex = 0
    if (m && m.length == 2) {
      skipIndex = parseInt(m[1])
    }

    if (skipIndex == 0) {
      $table.find("[data-reactid='" + reactId + ".$thead.1.$1']").each(function () {
        var $n = $(this);
        $n.before("<th>Wpn</th>");
      });

      if (!noBtlLink) {
        $table.find("[data-reactid='" + reactId + ".$thead.1.$2']").each(function () {
          $(this).after("<th>Btl</th>");
        });
      }
    }

    $table.find("[data-reactid^='" + reactId + ".$tbody'][data-reactid$='.$Killer']").each(function () {
      let $n = $(this);
      let index = parseInt($n.attr('data-reactid').match(/tbody\.\$(\d+)/)[1]);
      if (index - skipIndex >= 0) {
        let data = response.data[index - skipIndex];
        $n.before('<td>' + createWeaponImg(data.Killer, 35) + '</td>');
      }
    });

    if (!noBtlLink) {
      $table.find("[data-reactid^='" + reactId + ".$tbody'][data-reactid$='.$Victim']").each(function () {
        var $n = $(this);
        var index = parseInt($n.attr('data-reactid').match(/tbody\.\$(\d+)/)[1]);
        if (index - skipIndex >= 0) {
          var data = response.data[index - skipIndex];
          $n.after("<td>" + createBattleLink(data) + "</td>");
        }
      });
    }
  }

  function adjustKillBoard(reactId, response, addKiller) {
    const $table = $("table[data-reactid='" + reactId + "']");
    const m = response.url.match(/offset=([\d]+)/)
    let skipIndex = 0
    if (m && m.length == 2) {
      skipIndex = parseInt(m[1])
    }

    if (skipIndex == 0) {
      $table.find("[data-reactid='" + reactId + ".$thead.1.$1']").each(function () {
        var $n = $(this);
        $n.before("<th>Wpn</th>");
        if (addKiller) {
          $n.before("<th width='165px'>Killer</th>");
        }
        $n.after("<th>Btl</th>");
      });
    }

    $table.find("[data-reactid^='" + reactId + ".$tbody'][data-reactid$='.$Victim']").each(function () {
      const $n = $(this);
      const index = parseInt($n.attr('data-reactid').match(/tbody\.\$(\d+)/)[1]);
      if (index - skipIndex >= 0) {
        var data = response.data[index - skipIndex];
        $n.before('<td>' + createWeaponImg(data.Killer, 35) + '</td>');
        if (addKiller) {
          $n.before("<td>" + createPlayerLink(data.Killer) + "</td>");
        }
        $n.after("<td>" + createBattleLink(data) + "</td>");
      }
    });
  }

  function createPlayerLink(player) {
    return "<span style='white-space: nowrap;'><a href='" + toUrl("killboard/player/" + player.Id) + "'><strong>" + player.Name + "</strong></a>" + (player.AverageItemPower ? ("&nbsp;<small>(" + fmt(player.AverageItemPower) + ")</small>") : '')
      + '</span><br/>' + (player.AllianceId ? "[<a href='" + toUrl("killboard/alliance/" + player.AllianceId) + "'>" + player.AllianceName + "</a>] " : '')
      + "<a href='" + toUrl("killboard/guild/" + player.GuildId) + "'>" + player.GuildName + "</a>"
  }

  function createWeaponImg(player, size) {
    let img = "";
    if (player && player.Equipment && player.Equipment.MainHand) {
      const mh = player.Equipment.MainHand;
      const p = { Id: player.Id, Name: player.Name, Equipment: player.Equipment, AverageItemPower: player.AverageItemPower }
      img = '<img class="mouseHilite wpn" data-player=\'' + JSON.stringify(p) + '\' src="https://render.albiononline.com/v1/item/' + mh.Type + '.png?quality=' + mh.Quality + '" width="' + size + 'px" height="' + size + 'px"/>';
    }
    return img;
  }

  const GEAR = ['MainHand', 'OffHand', 'Head', 'Armor', 'Shoes', 'Bag', 'Cape', 'Mount', 'Food', 'Potion']

  function createBodyGear(player) {
    let html = '<div style="transfrom:scale(0.3);width:200px;height:220px;"><div class="item-list"><div class="item-list__headline" style="font-size:8pt;padding:2px">'
    html += player.Name + '<span style="float:right;font-size:8pt">'
    html += (player.AverageItemPower ? ' <span>' + fmt(player.AverageItemPower) + ' IP</span>  ' : '')
    html += '</span></div><div class="item-list__body item-list__body--gear">'
    GEAR.forEach(function (val) {
      html += createEquipmentHtml(player.Equipment, val)
    })
    html += '</div></div></div>'
    return html
  }

  function showPopupGearWorn(event, player) {
    if (!player) {
      player = $(this).data("player")
    }

    if (player) {
      const html = createBodyGear(player)
      let $playerGear = $('#playerGear')
      if ($playerGear.length == 0) {
        $('body').append('<div id="playerGear"></div>')
        $playerGear = $('#playerGear')
      }

      $playerGear.css({ top: event.pageY - 60, left: event.pageX + 40 })
      $playerGear.html(html).show();
      event.stopPropagation()
    }
  }

  // hide playerGear if shown
  $(document).click(function () {
    const $playerGear = $('#playerGear')
    if ($playerGear.is(':visible')) {
      $playerGear.hide()
    }
  });

  function createEquipmentHtml(equipment, type) {
    let html = '<div class="item item--' + type + '">';
    if (equipment && equipment[type]) {
      const mh = equipment[type];
      if (mh) {
        html += '<img src="https://render.albiononline.com/v1/item/' + mh.Type + '.png?quality=' + mh.Quality + '"/>'
        html += '<span class="item-count">' + mh.Count + '</span>'
      }
    }
    html += '</div>'
    return html;
  }

  function createBattleLink(data, useGvGIcon) {
    let btl = (data.numberOfParticipants) + "/" + data.groupMemberCount;
    if (data.GvGMatch) {
      if (useGvGIcon) {
        btl = '<a href="' + toUrl('killboard/gvg/' + data.GvGMatch.MatchId) + '"  title="' + btl + '"><span class="kill__tag kill__tag--gvg"></span></a>';
      } else {
        btl = '<a href="' + toUrl('killboard/gvg/' + data.GvGMatch.MatchId) + '"  title="Participants / Group Members">' + btl + '</a>';
      }
    } else if (data.BattleId && data.EventId) {
      btl = '<a href="' + toUrl('killboard/battles/' + data.BattleId) + '"  title="Participants / Group Members">' + btl + '</a>';
    }
    return btl;
  }

  function pushAllUnique(a1, b2) {
    b2.forEach((b) => {
      if (a1.indexOf(b) < 0) {
        a1.push(b)
      }
    })
    return a1
  }

  function toUrl(str) {
    return window.location.href.match(/https:\/\/[^\/]+\/[^\/]+\//)[0] + str;
  }

  function toUtcTime(d) {
    return d.getUTCHours().toString().padStart(2, '0') + ':'
      + ('' + d.getUTCMinutes()).padStart(2, '0')
      + (d.getUTCSeconds() > 0 ? (':' + d.getUTCSeconds().toString().padStart(2, '0')) : '')
  }

  (function (open, send) {
    XMLHttpRequest.prototype.open = function () {
      this.addEventListener("readystatechange", function (evt) {
        // console.log( "readystatechange", { status: this.status, readyState: this.readyState, responseText: this.responseText, responseType: this.responseType, resonseURL: this.responseURL, response: this.response }, evt )
        if (this.readyState == 4 && this.status == 200) {
          if (this.responseURL.match(/\/api\/gameinfo/)) {
            gameApiRequestComplete(this, evt);
          }
        }
      }, false);
      open.apply(this, arguments);
    };

  })(XMLHttpRequest.prototype.open);

  setTimeout( modifyBattleShowHide, 1000)

})(window.jQuery.noConflict(true), window.Chart);