// ==UserScript==
// @name         Questionor Keyboard Listener
// @namespace    https://github.com/01010101lzy/QuestionorKM
// @version      0.29.5
// @description  Faster practice with keyboard!
// @author       Lynz Rand
// @match        *questionor.cn/*/practice
// @grant        GPLv3
// @downloadURL https://update.greasyfork.org/scripts/36731/Questionor%20Keyboard%20Listener.user.js
// @updateURL https://update.greasyfork.org/scripts/36731/Questionor%20Keyboard%20Listener.meta.js
// ==/UserScript==

/*
This script maps keys to certain options so that faster practice is possible.
3 or 4 options:
         [A]        [B]       [C]         [D]
    `   1   2   3 \ 4   5 \ 6   7   8 / 9   0   -   =   | BKSP
  TAB |  Q   W   E | R   T | Y   U | I   O   P   [   ]  | \
  CAPS \ A   S   D | F   G | H   J | K   L   ;   '      | ENTER
  SHIFT \ Z   X   C \ V   B \ N   M \ ,   .   /        / SHIFT

2 options:
               [A]                    [B]
    `   1   2   3   4   5 \ 6   7   8   9   0   -   =   | BKSP
  TAB |  Q   W   E   R   T | Y   U   I   O   P   [   ]  | \
  CAPS \ A   S   D   F   G | H   J   K   L   ;   '      | ENTER
  SHIFT \ Z   X   C   V   B \ N   M   ,   .   /        / SHIFT

more than 4 options:
    `   1   2   3   4   5   6   7   8   9   0   -   =   | BKSP
  TAB |  Q   W   E   R   T   Y   U   I   O   P   [   ]  | \
  CAPS \[a] [b] [c] [d]  G   H  [e] [f] [g] [h]  '      | ENTER
  SHIFT \ Z   X   C   V   B   N   M   ,   .   /        / SHIFT

  Above all that, special functions are binded to following keys:
  [Check/Next]:   ENTER, SPACE
  [Skip]:         TAB
  [Clear All]:    ESC, BKSP, DEL, \
*/

(function () {
  'use strict';
  var unchecked = 1;
  // 1 to 8 are for selecting options
  // -1 is auto-check 
  // -2 is force skip
  // -3 is clear all
  var a = new Array(new Array(
      // 2 options:
      0, 0, 0, 0, 0, 0, 0, 0, -2, -1, 0, 0, -2, -1, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, -2, 0, 0, 0, 0, -1, 0, -1, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, -2, 0, // 2-1
      // numbers
      1, 1, 1, 1, 1,
      2, 2, 2, 2, 2, // 5-1

      0, 0, 0, 0, 0, 0, 0,
      // letters
      1, 1, 1, 1, 1, 1, 1, 2,
      2, 2, 2, 2, 2, 2, 2, 2,
      1, 1, 1, 1, 2, 1, 1, 1,
      2, 1,
      0, 0, 0, 0, 0,
      // keypad
      -2, 1, 2, 0, 0,
      0, 0, 0, 0, 0, -1, -1, 0, -1, -1, -1, -1,
      // Fn
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
      // symbols
      0, 0,
      0, 2, 2, 2, -2, 0, 0, 0
    ),
    new Array(
      // 3 or 4 options:
      0, 0, 0, 0, 0, 0, 0, 0, -3, -2, 0, 0, -3, -1, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, -3, 0, 0, 0, 0, -1, 0, -2, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, -3, 0, // 4-2
      // numbers
      1, 1, 1, 2, 2,
      3, 3, 3, 4, 4, // 5-2

      0, 0, 0, 0, 0, 0, 0,
      // letters
      1, 2, 1, 1, 1, 2, 2, 3,
      4, 3, 4, 4, 4, 3, 4, 4,
      1, 2, 1, 2, 3, 2, 1, 1,
      3, 1,
      0, 0, 0, 0, 0,
      // keypad
      -3, 1, 2, 3, 4,
      0, 0, 0, 0, 0, -2, -1, 0, -2, -2, -1, -2,
      // Fn
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
      // symbols
      0, 0,
      0, 4, 4, 4, -3, 0, 0, 0
    ),
    new Array(
      // 5 to 8 options:
      0, 0, 0, 0, 0, 0, 0, 0, -3, -2, 0, 0, -3, -1, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, -3, 0, 0, 0, 0, -1, 0, -2, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, -3, 0, // 4-2
      // numbers
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 5-2

      0, 0, 0, 0, 0, 0, 0,
      // letters
      1, 0, 0, 3, 0, 4, 0, 0,
      0, 5, 6, 7, 0, 0, 0, 0,
      0, 0, 2, 0, 0, 0, 0, 0,
      0, 0,
      0, 0, 0, 0, 0,
      // keypad
      -3, 1, 2, 3, 4,
      5, 6, 7, 8, 0, -2, -1, 0, -2, -2, -1, -2,
      // Fn
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
      // symbols
      0, 0,
      0, 0, 0, 0, -3, 0, 0, 0
    ));
  a[0][251] = 2; // too far away.
  a[1][254] = 4; // too far away.
  a[2][186] = 8; // too far away.


  $(document).keydown(function (event) {
    var b = event.keyCode;
    var l = $("label input").length;
    var c;
    switch (l) {
      case 1:
      case 2:
        c = a[0][b];
        break;
      case 3:
      case 4:
        c = a[1][b];
        break;
      default:
        c = a[2][b];
        break;
    }
    // console.log("KeyCode", b, "->", c);
    if (c !== undefined && c !== 0) {
      if (c > 0) {
        // clicks option
        try {
          $("label input")[c - 1].click();
        } catch (e) {
          // console.log(e);
        }
      } else if (c == -1) {
        // auto check & skip
        if ($(".qs-practice-btn-check.btn-success").length > 0 || $(".qs-practice-btn-check.btn-danger").length > 0 || $(".qs-practice-btn-check.btn-warning").length > 0)
          unchecked = 0;
        else
          unchecked = 1;
        if (unchecked) {
          // unchecked = 0;
          $(".qs-practice-btn-check").click();
        } else {
          if ($(".qs-practice-btn-check.btn-success").length > 0) {
            correct++;
            total++;
          } else {
            total++;
          }
          var rate = (total == 0) ? ("N/A") : (correct / total * 100).toFixed(2);
          $("#local-rate").text("Current Session: total " + total + ", correct " + correct + ", correct rate " + rate + "%");
          // unchecked = 1;
          $(".qs-practice-btn-next").click();
        }
      } else if (c == -2) {
        // skip
        // unchecked = 1;
        $(".qs-practice-btn-next").click();
      } else if (c == -3) {
        // clear all
        var options = $("label input").each(function (i, e) {
          e.checked = false;
        });
      }
    }
  });
})();

$('document').ready(function () {
  $('.qs-practice-progress').append('<div class="progressbar-text"><div id="local-rate" style="color: black; text-align: center; padding: 0.33em; font-size: 0.66em"> </div></div>');

  // _ BELOW ARE UNFINISHED CODE FOR SETTING PAGE

  // $('ul.navbar-right').append('<li id="qkm-config" class="dropdown"></li>');
  // $('#qkm-config').append(['<a id="qkm-cfg-dropdn" href="#" class="dropdown-toggle" data-toggle="dropdown" style="color: rgb(255, 83, 46); font-weight: bold;" aria-expanded="false">',
  //   'QuestionorKM Config',
  //   '</a>'
  // ].join('\n'));
  // $('#qkm-config').append(
  //   '<ul class="dropdown-menu"> \
  //     <!-- User Profile --> \
  //     <li> \
  //       < <\
  //       /ul>')
});

let correct = 0,
  total = 0;