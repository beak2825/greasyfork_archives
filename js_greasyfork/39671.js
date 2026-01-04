/** Functions to handle game state **/

/** objects we handle:
    probability object: map from bullet use number to probability we should pick it
    like { "-1":0.25, "0":0.25, "1":0.5 }
    player object: essentially
    struct player {
    char hp;  // ranges from -1 to 5
    unsigned char bullets;  // ranges from 0 to 6
    unsigned char fatigue;  // ranges from 0 to 3
    enum player_type type;  // ranges from 0 to 3
    };
    game state object:
    struct game_state {
    struct player p1;
    struct player p2;
    unsigned char round;  // ranges from 1 to 16
    };
    strategy object:
    member p1Move for p1's first action
    + map from p2's action to p1's doubletime action
**/


// deep copy plain data object
// why is there no builtin equivalent to this
// javascript pls
function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

var PREPARATION = 0;
var CATCH = 1;
var PIERCE = 2;
var AURA = 3;

function player_rep(p) {
    var ret = p.hp+2;
    ret = ret | (p.bullets << 3);
    ret = ret | (p.fatigue << 6);
    // prep and aura both act only at the game start so states have same action probabilities
    ret = ret | ((p.type == AURA ? PREPARATION : p.type) << 8);
    return ret;
}

function game_state_rep(x) {
    return ((player_rep(x.p1) << 14) ^
            (player_rep(x.p2) << 4) ^
            (x.round - 1));
}

function act(s, act1, act2) {
    var new_state = copy(s);

    // Resolve round change and HP damage due to round 10+
    if (new_state.round >= 10) {
        new_state.p1.hp--;
        new_state.p2.hp--;
    }
    new_state.round += 1;

  // Resolve bullet count change
  new_state.p1.bullets -= act1;
  new_state.p2.bullets -= act2;
  // should add some asserts here really

  // Resolve fatigue and effects thereof
  if (act1 || (act2 > 0)) {
    // player 1 did not block, or blocked a shot
    new_state.p1.fatigue = 0;
  } else if (act2 <= 0) {
    switch (new_state.p1.fatigue) {
    case 0:
      new_state.p1.fatigue = 1;
      break;
    case 1:
      new_state.p1.fatigue = 2;
      break;
    case 2:
      new_state.p1.fatigue = 3;
      // fall through
    case 3:
      new_state.p1.hp--;
      break;
    }
  }

  if (act2 || (act1 > 0)) {
    // player 2 did not block, or blocked a shot
    new_state.p2.fatigue = 0;
  } else if (act1 <= 0) {
    switch (new_state.p2.fatigue) {
    case 0:
      new_state.p2.fatigue = 1;
      break;
    case 1:
      new_state.p2.fatigue = 2;
      break;
    case 2:
      new_state.p2.fatigue = 3;
      // fall through
    case 3:
      new_state.p2.hp--;
      break;
    }
  }

  // Resolve results of shooting
  if (act1 > 0) {
    if (act2 > 0) {
      // both players shot
      if (act1 > act2) {
        // p2 loses
        new_state.p2.hp = -10;
      } else if (act1 < act2 ||
                 (new_state.p2.type == PIERCE &&
                  new_state.p1.type != PIERCE)) {
        // p1 loses
        new_state.p1.hp = -10;
      } else if (new_state.p1.type == PIERCE &&
                 new_state.p2.type != PIERCE) {
        // p2 loses
        new_state.p2.hp = -10;
      }
    } else if (act2) {
      // p2 reloaded and therefore loses
      new_state.p2.hp = -10;
    } else {
      // p2 blocked
      new_state.p2.hp -= (act1 - 1);
      if (new_state.p2.type == CATCH) {
        // bullet was caught
        new_state.p2.bullets++;
      }
    }
  } else if (act2 > 0) {
    if (act1) {
      // p1 reloaded and loses
      new_state.p1.hp = -10;
    } else {
      // p1 blocked
      new_state.p1.hp -= (act2 - 1);
      if (new_state.p1.type == CATCH) {
        new_state.p1.bullets++;
      }
    }
  }
  // cap bullet count
  if (new_state.p1.bullets > 6) {
    new_state.p1.bullets = 6;
  }
  if (new_state.p2.bullets > 6) {
    new_state.p2.bullets = 6;
  }
  // cap hp count
  if (new_state.p1.hp < 0) {
    new_state.p1.hp = -1;
  }
  if (new_state.p2.hp < 0) {
    new_state.p2.hp = -1;
  }
  return new_state;
}

function pick_action(probabilities, bullets) {
    if (probabilities == undefined || probabilities == null) {
        // trivial/unreachable state, reload
        return -1;
    }

    var accu = Math.random();

    for(var act = -1; act <= bullets; act++) {
        var p = probabilities[act];

        if(p == undefined || p == null) {
            // something weird happened but whatever
            return Math.max(-1, act-1);
        }

        if (p >= accu) {
            return act;
        }

        accu -= p;
    }

    // rounding error might have the sum of probabilities be less than accu
    // in which case
    return bullets;
}

// from text representation of the states, get the state object for
// the state s
// we avoid JSON parsing because we only want 1 state among millions
function get_state(states, s) {
    var rep = game_state_rep(s);
    // essentially
    // "$rep": { .* }
    var reg = new RegExp ('"' + rep + '"[^:]*:[^{]*({[^}]*})', "m");

    //console.log("getting state " + JSON.stringify(s) + " rep " + rep);
    var matches = states.match(reg);
    if (matches == null || matches.length < 2)
        return null;

    var res = matches[1];
    //console.log("results in " + res);
    return JSON.parse(res);
}

// states: map from state ids to probabilities
function get_doubletime_strat(states, s) {
    var strat = {};
    var p1Move = pick_action(get_state(states, s), s.p1.bullets);
    strat["p1Move"] = p1Move;

    for(var p2Move = -1; p2Move <= s.p2.bullets; p2Move++) {
        var s2 = act(s, p1Move, p2Move);
        if (s2.p1.bullets == 0 && s2.p2.bullets == 0)
            s2 = act(s2, -1, -1);

        strat[p2Move] = pick_action(get_state(states,s2), s2.p1.bullets);
    }
    return strat;
}

function get_winchance(wins, state) {
    var rep = game_state_rep(state);
    var reg = new RegExp ("" + rep + ":(.*)");

    var matches = wins.match(reg);
    if (matches == null || matches.length < 2) {
        console.log("N1 win chances: unknown state " + JSON.stringify(state) + " rep " + rep);
        return "-1";
    }
    return matches[1];
}

// parsing used to be based on https://greasyfork.org/en/scripts/18136-n1bot-inputs

/* A game is displayed in a big <td> whose text goes
   Tier X Event
   Battle Y
   You (win-loss)
   HP: $HP1
   Ammo: $bullets1
   Fatigue: $fatigue1
   Power: Prep|Catch|Pierce|Aura
   <hr>
   P2name
   $P2block (same as P1)
   <hr>
   Round $round
   <hr>
   then some stuff about previous actions,
   then <select> elements to input actions, going
   P1 first move - if P2 reloads - if P2 blocks - if P2 fires 1 to P2 bullets
   The values are according to action_map below.
   We need to parse the 2 player blocks + the round count, send the
   resulting game state to the background script then use the response
   to fill in the selects.
*/
var action_map = {
    "-1": "1^0",
    "0": "2^0",
    "1": "3^1",
    "2": "3^2",
    "3": "3^3",
    "4": "3^4",
    "5": "3^5",
    "6": "3^6"
};

var power_map = {
    "Prep": 0,
    "Catch": 1,
    "Pierce": 2,
    "Aura": 3
}

function parseGame(elmt) {
    var txt = elmt.textContent;

    var state = {p1:{}, p2:{}};

    var hp_patt = /HP: (\d)/g;
    state.p1.hp = parseInt(hp_patt.exec(txt)[1]);
    state.p2.hp = parseInt(hp_patt.exec(txt)[1]);

    var bullet_patt = /Ammo: (\d)/g;
    state.p1.bullets = parseInt(bullet_patt.exec(txt)[1]);
    state.p2.bullets = parseInt(bullet_patt.exec(txt)[1]);

    var fatigue_patt = /Fatigue: (\d)/g;
    state.p1.fatigue = parseInt(fatigue_patt.exec(txt)[1]);
    state.p2.fatigue = parseInt(fatigue_patt.exec(txt)[1]);

    var pow_patt = /Power: (\w+)/g;
    state.p1.type = power_map[pow_patt.exec(txt)[1]];
    state.p2.type = power_map[pow_patt.exec(txt)[1]];

    var round_patt = /Round (\d+)/;
    state.round = parseInt(round_patt.exec(txt)[1]);

    return state;
}