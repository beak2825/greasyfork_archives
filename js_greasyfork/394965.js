// ==UserScript==
// @name         Hacker Wars 2048 AI
// @version      0.6
// @description  2048 AI for Hacker Wars
// @author       Nobody at all... I'm obviously a bot
// @match        *://hackerwars.io/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @namespace 2048 AI for Hacker Wars
// @downloadURL https://update.greasyfork.org/scripts/394965/Hacker%20Wars%202048%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/394965/Hacker%20Wars%202048%20AI.meta.js
// ==/UserScript==

// ###############  Log DB page stuffs
function AI() {
  this.best_operation = 0;
  this.grid = Array(16);
  this.node = 0;
  this.max_depth = 3;
}

AI.prototype.MoveLeft = function(s) {
  var k = 0;
  var base = 0;
  var score = 0;
  var result = new Array(16);
  for (var i = 4; i <= 16; i += 4) {
    while (k < i) {
      if (s[k] == 0) {
        ++k;
        continue;
      }        
      if (k + 1 < i && s[k] == s[k + 1]) {
        result[base++] = s[k] * 2;
        score += s[k] * 2;
        k += 2;
      } else {
        result[base++] = s[k++];
      }
    }
    while (base < i) {
      result[base++] = 0;
    }
  }
  return [result, score];
};
  
AI.prototype.Rotate = function(s) {
  return new Array(s[12], s[8], s[4], s[0],
                   s[13], s[9], s[5], s[1],
                   s[14], s[10], s[6], s[2],
                   s[15], s[11], s[7], s[3]);    
};

AI.prototype.Estimate = function(s) {
  var diff = 0;
  var sum = 0;
  for (var i = 0; i < 16; ++i) {
    sum += s[i];
    if (i % 4 != 3) {
      diff += Math.abs(s[i] - s[i + 1]);
    }
    if (i < 12) {
      diff += Math.abs(s[i] - s[i + 4]);
    }
  }
  return (sum * 4 - diff) * 2;
};

AI.prototype.Search = function(s, depth) {
  this.node++;
  if (depth >= this.max_depth) return this.Estimate(s);
  var best = -1;
  for (var i = 0; i < 4; ++i) {
    var results = this.MoveLeft(s);
    var t = results[0];
    var same = true;
    for (var j = 0; j < 16; ++j) {
      if (t[j] != s[j]) {
        same = false;
        break;
      }
    }
    if (!same) {
      var temp = 0;
      var empty_slots = 0;
      for (var j = 0; j < 16; ++j) {
      	if (t[j] == 0) {
      	  t[j] = 2;
                ++empty_slots;
      	  temp += this.Search(t, depth + 1) * 0.9;	  
      	  t[j] = 4;
      	  temp += this.Search(t, depth + 1) * 0.1;
      	  t[j] = 0;
      	}
      }
      if (empty_slots != 0) {
      	temp /= empty_slots;
      } else {
        temp = -1e+20;
      }

      if (results[1] + temp > best) {
        best = results[1] + temp;
        if (depth == 0) {
          this.best_operation = i;
        }
      }
    }
    if (i != 3) {
      s = this.Rotate(s);
    }
  }    
  return best;
};

AI.prototype.SetTile = function(x, y, v) {
  this.grid[x + y * 4] = v;
};

AI.prototype.StartSearch = function() {
  this.node = 0;
  this.max_depth = 3;
  while (true) {
    this.node = 0;
    this.Search(this.grid, 0);
    if (this.node >= 10000 || this.max_depth >= 8) break;
    this.max_depth += 1;
  }
};