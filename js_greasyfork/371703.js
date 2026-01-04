// ==UserScript==
// @name         AtCoderColouringDifference
// @namespace    https://chocobo777.github.io
// @version      1.0.0
// @description  Color difference values of AtCoder's gradebook
// @author       chocobo
// @include      https://beta.atcoder.jp/users/*/history
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/371703/AtCoderColouringDifference.user.js
// @updateURL https://update.greasyfork.org/scripts/371703/AtCoderColouringDifference.meta.js
// ==/UserScript==

$(function() {
  'use strict';

  /*
  色づけモード
  0: 色なし
  1: 文字
  2: 背景
  */
  var colouringMode = 2;


  // 読み込み元と整合性を取る
  // https://wiki.greasespot.net/Third-Party_Libraries
  this.$ = this.jQuery = jQuery.noConflict(true);

  // 背景色
  function convertvalueToColorCode(value){
      if(value >= 100) return '#FFB2B2';
      if(value >=  80) return '#FFD9B2';
      if(value >=  60) return '#ECECB2';
      if(value >=  40) return '#B2B2FF';
      if(value >=  20) return '#B2ECEC';
      if(value >=  10) return '#B2D9B2';
      if(value >=   0) return '#D9C5B2';
                       return '#D9D9D9';
  }

  // 文字色
  function convertvalueToColorClass(value){
      if(value >= 100) return 'user-red';
      if(value >=  80) return 'user-orange';
      if(value >=  60) return 'user-yellow';
      if(value >=  40) return 'user-blue';
      if(value >=  20) return 'user-cyan';
      if(value >=  10) return 'user-green';
      if(value >=   0) return 'user-brown';
                       return 'user-gray';
  }

  // セルをmodeで色づけ
  function colouringCell(cell, mode){
      const value = cell.text();
      // console.log(cell);
      if(isNaN(value)) return;

      if (mode == 0) { // 色づけしない
          cell.text(value);
          cell.attr('style', '');
      }
      else if (mode == 1) { // 文字を色づけ
          cell.text('');
          cell.append('<span class="' + convertvalueToColorClass(value) + '">' + value + '</span>');
      }
      else if (mode == 2) { // 背景を色づけ
          cell.text(value);
          cell.attr('style', 'background-color:' + convertvalueToColorCode(value));
      }
  }

  // 色づけする
  function colouring(){
    $('#history').find('tbody').find('tr').each(function(i, contestInfo) {
      const tds = $(contestInfo).find('td');
      colouringCell($(tds[5]), colouringMode);
    });
  }
  // ページを読み込んだ時に色づけする
  colouring();
  
  // ページの右上にボタンを設置
  $('#history_wrapper').prepend('<button id="change-color-button" class="btn btn-primary pull-right", type="button">change color</button>');
  
  // ボタンをクリックでmodeを変える
  $('#change-color-button').on('click', function() {
    colouringMode = (colouringMode + 1) % 3;
    colouring();
  });
});