// ==UserScript==
// @name         LimaxMinion
// @namespace    LimaxMinion
// @version      0.1
// @description  Limax Bot Minion
// @author       Flammrock
// @match        *://*.limax.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396036/LimaxMinion.user.js
// @updateURL https://update.greasyfork.org/scripts/396036/LimaxMinion.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function inject(src, callback) {
      if (typeof callback != 'function') callback = function() { };

      var el;

      if (typeof src != 'function' && /\.css[^\.]*$/.test(src)) {
          el      = document.createElement('link');
          el.type = 'text/css';
          el.rel  = 'stylesheet';
          el.href = src;
      } else {
          el      = document.createElement('script');
          el.type = 'text/javascript';
      }

      el.class = 'injected';

      if (typeof src == 'function') {
          el.appendChild(document.createTextNode('(' + src + ')();'));
          callback();
      } else {
          el.src   = src;
          el.async = false;
          el.onreadystatechange = el.onload = function() {
              var state = el.readyState;
              if (!callback.done && (!state || /loaded|complete/.test(state))) {
                  callback.done = true;
                  callback();
              }
          };
      }

      var head = document.head || document.getElementsByTagName('head')[0];
      head.insertBefore(el, head.lastChild);
  }

  function dist(a,b) {
    var dx = a.x-b.x;
    var dy = a.y-b.y;
    return Math.sqrt(dx*dx+dy*dy);
  }

  function angle(a,b) {
    return Math.atan2(a.y-b.y,a.x-b.x);
  }

  inject('https://cdnjs.cloudflare.com/ajax/libs/synaptic/1.1.4/synaptic.min.js', function(){


    const { Layer, Network, Architect, Trainer } = window.synaptic;

    var pauseMinion = true;
    var listMinion = [];
    function Minion() {
      this.name = 'Minion Bot';
      this.skin = Math.floor(Math.random() * window.MAX_SKIN);
      listMinion.push(this);
      this.isPause = false;
      this.isAlive = false;
      this.autonom = false;
      this.IA = false;
      this.network = false;
      this.respawn = true;
      this.spawn();
    }
    Minion.prototype.spawn = function () {
      var _this = this;
      this.socket = new WebSocket(window.socket.url);
      this.socket.binaryType = "arraybuffer";
      this.oldtrap = null;
      this.score = 0;
      this.x = 0;
      this.y = 0;
      this.id = -1;
      this.oldmouseangle = null;
      this.mouseangle = 0;
      this.currentplayer = null;
      this.closestFood = {x:0,y:0};
      this.trap = !1;
      this.mouse_update = (new Date).getTime();
      this.d = (new Date).getTime();
      this.socket.onclose = function () {
        clearInterval(_this.interval);
        _this.isAlive = false;
        if (_this.respawn) {
          _this.spawn();
        }
      }
      this.socket.onmessage = function(a) {
        if ("string" == typeof a.data) {
          a = JSON.parse(a.data);
          if (a[0] == 0) {
            _this.id = a[1][0];
            _this.interval = setInterval(function () {
              var player = null;
              for (var i = 0; i < window.players.length; i++) {
                if (window.players[i].id == window.true_id) {
                  player = window.players[i];
                  break;
                }
              }
              if (_this.autonom && _this.IA && _this.network) {


                // Food Distance
                // Food angle
                // Ennemi Distance
                // Ennemi angle
                // Ennemi Size
                // Ennemi Trap
                // Current Bot Size
                var food_d = dist({x:_this.x,y:_this.y},_this.closestFood) / (window.bg_width*window.map_divisor),
                    food_a = angle({x:_this.x,y:_this.y},_this.closestFood),
                    e_d = 0,
                    e_a = 0,
                    e_s = 0,
                    e_t = 0,
                    c_s = 0;
                  //console.log(food_d,food_a);

                var data = _this.network.activate([food_d,food_a/*,e_d,e_a,e_s,e_t,c_s*/]);

                _this.socket.send("[0," + (data[0] * 2 * Math.PI) + "," + (data[1] > 0.5 ? 1 : 0) + "]");

              } else if (player != null && window.socket.readyState == 1 && _this.socket.readyState == 1) {
                if (_this.isPause) {
                  _this.mouseangle = Math.atan2(_this.y-_this.paused_y,_this.x-_this.paused_x);
                } else {
                  _this.mouseangle = Math.atan2(_this.y-player.y,_this.x-player.x);
                }
                if ((new Date).getTime() - _this.mouse_update > window.MOUSE_DELAY_BETWEEN_UPDATE && (_this.trap != _this.oldtrap || _this.mouseangle != _this.oldmouseangle)) {
                  _this.socket.send("[0," + _this.mouseangle + "," + _this.trap + "]");
                  _this.oldtrap = _this.trap;
                  _this.oldmouseangle = _this.mouseangle;
                  _this.mouse_update = (new Date).getTime();
                }
              }
            }, 33);
          }
        } else {
          a = a.data;
          var c, d, f, e, n, l = new Uint8Array(a),
              h = new Uint16Array(a),
              u = new Uint32Array(a),
              q = new Float64Array(a);
          window.game_time = u[0];
          a = l[6] % 2;
          window.kill_score += (l[6] - l[6] % 2) / 2;
          var w = l[7],
              m = h[2],
              v = [];
          d = 0;
          var distt = Infinity;
          for (c = 1; c < m + 1; c++) {d = Math.floor(u[2 * c + 1] / window.BONUS_SKIN_KEY), v[c - 1] = {
              x: 3 * Math.floor(h[4 * c] / 20),
              y: Math.floor(h[4 * c + 1] / 2),
              id: u[2 * c + 1] - d * window.BONUS_SKIN_KEY,
              instantradius: h[4 * c] % 20,
              alive: h[4 * c + 1] % 2,
              skin: d
          };
          _this.closestFood = {x:v[0].x,y:v[0].y};
          if (dist({x:_this.x,y:_this.y},v[c - 1]) < distt) {
            distt = dist({x:_this.x,y:_this.y},v[c - 1]);
            _this.closestFood = {x:v[c - 1].x,y:v[c - 1].y};
          }


          }
          m = [];
          var prev_nb_trap;
          for (d = prev_nb_trap = 0; d < w; d++)
              for (e = c + 4 * d + prev_nb_trap, m[d] = {
                      x: q[e],
                      y: q[e +
                          1],
                      score: q[e + 2],
                      id: u[2 * (e + 3)] % window.PLAYER_INFO_ALPHA,
                      t: [],
                      n: 0
                  }, n = u[2 * (e + 3) + 1], prev_nb_trap += n, e += 4, f = 0; f < n; f++, e++) m[d].t[f] = {
                  x: h[4 * e],
                  y: h[4 * e + 1],
                  radius: h[4 * e + 2],
                  alpha: l[8 * e + 6],
                  lifetime: l[8 * e + 7]
              };
          for (var i = 0; i < m.length; i++) {
            if (m[i] != -1) {
              if (m[i].id == _this.id) {
                _this.x = m[i].x;
                _this.y = m[i].y;
                _this.score = m[i].score;
                if (!_this.isAlive) {
                  _this.paused_x = _this.x;
                  _this.paused_y = _this.y;
                }
                _this.isAlive = true;
                break;
              }
            }
          }
        }
      }
      this.socket.onopen = function() {
          this.send(JSON.stringify([1, _this.name, _this.skin]))
      };
    };
    Minion.prototype.remove = function () {
      clearInterval(this.interval);
      this.respawn = false;
      this.socket.close();
    }
    Minion.prototype.togglepause = function () {
      this.isPause = pauseMinion ? false : true;
      this.paused_x = this.x;
      this.paused_y = this.y;
    }
    Minion.prototype.togglefree = function () {
      this.autonom = this.autonom ? false : true;
    };
    window.next_start = function() {
        if (window.game_mode == window.MASS_MODE) {
            -1 == window.server_try && (window.server_try = 1 + Math.floor((window.server_info_mass.length - 1) * Math.random()));
            var a = window.server_info_mass[0 == window.server_id ? window.server_try : window.server_id].ip,
                c = window.server_info_mass[0 == window.server_id ? window.server_try : window.server_id].port
        } else window.game_mode == window.KILL_MODE ? (-1 == window.server_try && (window.server_try = 1 + Math.floor((window.server_info_kill.length - 1) * Math.random())), a = window.server_info_kill[0 == window.server_id ? window.server_try : window.server_id].ip, c = window.server_info_kill[0 == window.server_id ? window.server_try : window.server_id].port) : window.game_mode == window.TEAM_MODE ?
            (-1 == window.server_try && (window.server_try = 1 + Math.floor((window.server_info_team.length - 1) * Math.random())), a = window.server_info_team[0 == window.server_id ? window.server_try : window.server_id].ip, c = window.server_info_team[0 == window.server_id ? window.server_try : window.server_id].port) : window.game_mode == window.RACE_MODE ? (-1 == window.server_try && (window.server_try = 1 + Math.floor((window.server_info_race.length - 1) * Math.random())), a = window.server_info_race[0 == window.server_id ? window.server_try : window.server_id].ip, c = window.server_info_race[0 == window.server_id ? window.server_try : window.server_id].port) : window.game_mode == window.RUSH_MODE ? (-1 == window.server_try && (window.server_try = 1 + Math.floor((window.server_info_rush.length -
                1) * Math.random())), a = window.server_info_rush[0 == window.server_id ? window.server_try : window.server_id].ip, c = window.server_info_rush[0 == window.server_id ? window.server_try : window.server_id].port) : window.game_mode == window._1V1_MODE ? (-1 == window.server_try && (window.server_try = 1 + Math.floor((window.server_info__1v1.length - 1) * Math.random())), a = window.server_info__1v1[0 == window.server_id ? window.server_try : window.server_id].ip, c = window.server_info__1v1[0 == window.server_id ? window.server_try : window.server_id].port) : window.game_mode == window.ZOMB_MODE && (-1 == window.server_try && (window.server_try = 1 + Math.floor((window.server_info_zomb.length - 1) * Math.random())), a = window.server_info_zomb[0 == window.server_id ? window.server_try :
                window.server_id].ip, c = window.server_info_zomb[0 == window.server_id ? window.server_try : window.server_id].port);
        window.socket = new WebSocket("ws://" + a + ":" + c);
        window.socket.binaryType = "arraybuffer";
        window.current_socket_id++;
        window.socket.sockid = window.current_socket_id;
        window.socket.onmessage = function(a) {
            "string" == typeof a.data ?
              (a = JSON.parse(a.data), 3 == a[0] ?
                (window.players_nickname[a[2]] = a[1], window.players_skin[a[2]] = a[3])
              : 0 == a[0] ?
                window.handshake(a[1])
              : 1 == a[0] ?
                window.set_top10(a[1])
              : 2 == a[0] ?
                window.server_full()
              : 4 == a[0] ?
                window.skin_hack()
              : 5 == a[0] && window.rush_party_end(a[1])) :
                window.broadcast(a.data)
        };
        window.socket.onopen = function() {
            window.send_nickname();
            window.timeout_wait_handshake = setTimeout(window.wait_handshake, window.WAIT_HANDSHAKE_TIME)
        };
        window.socket.onerror = function(a) {};
        window.socket.onclose = function(a) {
            while (listMinion.length) {
              var minion = listMinion.pop();
              minion.remove();
            }
            document.getElementById('botminionnb').innerHTML = listMinion.length > 1 ? listMinion.length + ' Minions' :listMinion.length + ' Minion';
            window.game_is_show && window.current_socket_id == this.sockid && window.quit_game()
        }
    }
    var div = document.createElement('div');
    div.style.cssText = 'min-width: 300px; position: fixed; font-family: Verdana; z-index: 9999; top: 65px; left: 10px; font-size: 20px; background: #fff; opacity: 0.3; padding: 20px; border-radius: 10px;';
    var minioninnerHTML = '<div onclick="var migffd=document.getElementById(\'minioncontentplusmoins\');if (migffd.innerHTML == \'-\') {migffd.innerHTML=\'+\';document.getElementById(\'listoverlayibfominion\').style.display=\'none\';}else{migffd.innerHTML=\'-\';document.getElementById(\'listoverlayibfominion\').style.display=\'block\';}" style="position: absolute; top: 10px; left: 10px; display: inline-block; border-radius: 10px; box-shadow: 0 0 5px 0 #111; width: 32px; height: 32px; background: #111; border: 1px solid #fff; color: #fff; font-size: 40px;"><span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%)" id="minioncontentplusmoins">-</span></div><div style="display: inline-block; text-align: center; width: 100%;"><tt id="botminionnb" style="font-size: 24px;">0 Minion</tt></div><div id="listoverlayibfominion"><br />';
    minioninnerHTML += '<tt>[A] Add a Minion</tt><br />';
    minioninnerHTML += '<tt>[R] Remove a Minion</tt><br />';
    minioninnerHTML += '<tt>[P] Pause all Minion</tt><br />';
    minioninnerHTML += '<tt>[O] Pause all Minion to local location</tt><br />';
    minioninnerHTML += '</div>';
    div.innerHTML = minioninnerHTML;
    document.body.appendChild(div);
    window.addEventListener("mousemove", function(a) {
        window.updateMousePos(a)
    }, !1);
    window.onkeyup = function (e) {
      switch (e.keyCode) {
        case 90: // Z : start ga
          var ga = new GeneticAlgorithm(20, 5);
          ga.createPopulation();
          document.getElementById('botminionnb').innerHTML = listMinion.length > 1 ? listMinion.length + ' Minions' :listMinion.length + ' Minion';
          break;
        case 65: //A - add a minion
          new Minion();
          document.getElementById('botminionnb').innerHTML = listMinion.length > 1 ? listMinion.length + ' Minions' :listMinion.length + ' Minion';
          break;
        case 82: //R - remove a minion
          if (listMinion.length > 0) {
            var minion = listMinion.pop();
            minion.remove();
            document.getElementById('botminionnb').innerHTML = listMinion.length > 1 ? listMinion.length + ' Minions' :listMinion.length + ' Minion';
          }
          break;
        case 75: //K - Autonome Minion
          for (var i = 0; i < listMinion.length; i++) {
            listMinion[i].toggleFree();
          }
          break;
        case 80: //P - pause minion
          pauseMinion = pauseMinion ? false : true;
          for (var i = 0; i < listMinion.length; i++) {
            listMinion[i].togglepause();
          }
          break;
        case 85: //U - remove all minion
          while (listMinion.length > 0) {
            var minion = listMinion.pop();
            minion.remove();
            document.getElementById('botminionnb').innerHTML = listMinion.length > 1 ? listMinion.length + ' Minions' :listMinion.length + ' Minion';
          }
          break;
        case 79: //O
          for (var j = 0; j < listMinion.length; j++) {
            listMinion[j].pause(true);
          }
          break;
        default:

      }
    }






    var getRandomIntInclusive = function(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min +1)) + min;
    };
    var time = performance.now(), randomTime = 0, nbw = 0, nbe = 0, ga, pauseText = 'pause', pause = false, tmpp = 0, score = 0, HighScore = 0;


    var GeneticAlgorithm = function(max_units, top_units){
      this.max_units = max_units; // max number of units in population
      this.top_units = top_units; // number of top units (winners) used for evolving population

      var _this = this;

      if (this.max_units < this.top_units) this.top_units = this.max_units;

      this.Population = []; // array of all units in current population
      this.reset();

      setInterval(function () {
        for (var i = 0; i < _this.Population.length; i++) {
          _this.Population[i].object.socket.close();
        }
        console.log('HERE WE GO AGAIN!!!!!');
        //console.log('COUNT:',_this.checkPopulation());
        //if (!_this.checkPopulation()) {
          _this.evolvePopulation();
        //}
        for (var i = 0; i < _this.Population.length; i++) {
          _this.Population[i].object.spawn();
          _this.Population[i].object.respawn = false;
          _this.Population[i].object.IA = true;
          _this.Population[i].object.isAlive = true;
          _this.Population[i].object.autonom = true;
        }
      }, 1000*10);

      console.log('OK!!');
    };
    GeneticAlgorithm.prototype = {
      reset: function() {
        this.iteration = 1;
        this.mutateRate = 1;

        this.best_population = 0;
        this.best_fitness = 0;

        this.temp = false;
      },
      createIndividual: function() {
        this.id = 'MINION_'+nbe;
        this.index = nbe;
        nbe++;

        // Food Distance
        // Food angle
        // Ennemi Distance
        // Ennemi angle
        // Ennemi Size
        // Ennemi Trap
        // Current Bot Size
        this.network = new synaptic.Architect.Perceptron(/*7*/2, 15, 2);

        this.isWinner = false;

        this.object = new Minion();
        this.object.respawn = false;
        this.object.IA = true;
        this.object.isAlive = true;
        this.object.autonom = true;
        this.object.network = this.network;
      },
      createPopulation: function() {
        this.Population.splice(0, this.Population.length);
        for (var i = 0; i < this.max_units; i++) {
          this.Population.push(new this.createIndividual());
        }
      },
      checkPopulation: function() {
        var nbAlive = this.max_units;
        for (var i = 0; i < this.max_units; i++) {
          if (!this.Population[i].object.isAlive) {nbAlive--;}
        }
        //if (nbAlive <= 0) {
        //  while (listMinion.length > 0) {
        //    var minion = listMinion.pop();
        //    minion.remove();
        //    document.getElementById('botminionnb').innerHTML = listMinion.length > 1 ? listMinion.length + ' Minions' :listMinion.length + ' Minion';
        //  }
        //}
        return nbAlive;
      },
      evolvePopulation: function() {
        if (!this.temp) {
          this.temp = true;
          var Winners = this.selection();
          this.iteration++;
          if (this.mutateRate == 1 && Winners[0].object.score < 0){
            this.createPopulation();
          } else {
            this.mutateRate = 0.2;
          }
          for (var i=this.top_units; i<this.max_units; i++){
            var parentA, parentB, offspring;
            if (i == this.top_units){
              parentA = Winners[0].network.toJSON();
              parentB = Winners[1].network.toJSON();
              offspring = this.crossOver(parentA, parentB);
            } else if (i < this.max_units-2){
              parentA = this.getRandomIndividual(Winners).network.toJSON();
              parentB = this.getRandomIndividual(Winners).network.toJSON();
              offspring = this.crossOver(parentA, parentB);
            } else {
              offspring = this.getRandomIndividual(Winners).network.toJSON();
            }
            offspring = this.mutation(offspring);
            var newIndividual = new this.createIndividual();
            newIndividual.network = synaptic.Network.fromJSON(offspring);
            newIndividual.index = this.Population[i].index;
            this.Population[i] = newIndividual;
          }
          if (Winners[0].object.score > this.best_fitness){
            this.best_population = this.iteration;
            this.best_fitness = Winners[0].object.score;
          }
          console.log('FITNESS:',this.best_fitness);
          this.Population.sort(function(a, b){
            return a.index - b.index;
          });
          for (var i = 0; i < this.max_units; i++) {
            this.Population[i].reset();
          }
          nbw = 0;
          time = Date.now();
          this.temp = false;
        }
      },
      selection: function() {
        var sortedPopulation = this.Population.sort(
          function(unitA, unitB){
            return unitB.object.score - unitA.object.score;
          }
        );
        for (var i=0; i<this.top_units; i++) this.Population[i].isWinner = true;
        return sortedPopulation.slice(0, this.top_units);
      },
      crossOver: function(parentA, parentB) {
        var cutPoint = this.random(0, parentA.neurons.length-1);
        for (var i = cutPoint; i < parentA.neurons.length; i++){
          var biasFromParentA = parentA.neurons[i]['bias'];
          parentA.neurons[i]['bias'] = parentB.neurons[i]['bias'];
          parentB.neurons[i]['bias'] = biasFromParentA;
        }
        return this.random(0, 1) == 1 ? parentA : parentB;
      },
      mutation : function (offspring){
        for (var i = 0; i < offspring.neurons.length; i++){
          offspring.neurons[i]['bias'] = this.mutate(offspring.neurons[i]['bias']);
        }
        for (var i = 0; i < offspring.connections.length; i++){
          offspring.connections[i]['weight'] = this.mutate(offspring.connections[i]['weight']);
        }
        return offspring;
      },
      mutate: function(gene) {
        if (Math.random() < this.mutateRate) {
          var mutateFactor = 1 + ((Math.random() - 0.5) * 3 + (Math.random() - 0.5));
          gene *= mutateFactor;
        }
        return gene;
      },
      random: function(min, max){
        return Math.floor(Math.random()*(max-min+1) + min);
      },
      getRandomIndividual: function(array){
        return array[this.random(0, array.length-1)];
      }
    };
    GeneticAlgorithm.prototype.createIndividual.prototype = {
      reset: function () {
        this.isWinner = false;
        this.learningRate = .3;
        this.object = new Minion();
        this.object.respawn = false;
        this.object.IA = true;
        this.object.isAlive = true;
        this.object.autonom = true;
        this.object.network = this.network;
      }
    };




  });


})();
