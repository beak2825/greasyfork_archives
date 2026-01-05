// ==UserScript==
// @name      hentaiverse自动战斗
// @namespace hentaiverseAuto
// @match     http://hentaiverse.org/?s=Battle&ss=ar
// @match     http://hentaiverse.org/?s=Battle&ss=gr
// @match     http://hentaiverse.org/?s=Battle&ss=iw*
// @author    duskray
// @version   V0.0.1
// @require   http://cdn.bootcss.com/jquery/3.1.0/jquery.min.js
// @description hentaiverse个人用自动战斗脚本
// @downloadURL https://update.greasyfork.org/scripts/22809/hentaiverse%E8%87%AA%E5%8A%A8%E6%88%98%E6%96%97.user.js
// @updateURL https://update.greasyfork.org/scripts/22809/hentaiverse%E8%87%AA%E5%8A%A8%E6%88%98%E6%96%97.meta.js
// ==/UserScript==

var monster = $('#monsterpane').find('.btm1');
var btnContinue = $('#ckey_continue');
var buff = [];
var stopFlag = false;

if (monster.length === 0) {
  return;
}

document.addEventListener('keydown', function (e) {
  if(e.keyCode==32){
    stopFlag = true;
  }
});

setTimeout(function(){
  //if (btnContinue.length > 0 && /continue/.test(btnContinue.attr('src')) && !stopFlag) {
  if (btnContinue.length > 0 && btnContinue.attr('src') && !stopFlag) {
    btnContinue.click();
    console.log('战斗胜利');
  } else {
    $('#mainpane .bte').eq(0).find('img').each(function(i, v) {
      buff.push($(v).attr('src'));
    });

    var HP = parseInt(Number($('.stuffbox.csp .cwbdv .cwb2').eq(0).css('width').replace(/px/g, ''))/120*100);
    var MP = parseInt(Number($('.stuffbox.csp .cwbdv .cwb2').eq(1).css('width').replace(/px/g, ''))/120*100);
    var SP = parseInt(Number($('.stuffbox.csp .cwbdv .cwb2').eq(2).css('width').replace(/px/g, ''))/120*100);
    //var OC = parseInt(Number($('.stuffbox.csp .cwbdv .cwb2').eq(3).css('width').replace(/px/g, ''))/120*100);
    var btnSpirit = $('#ckey_spirit');
    var spiritFlag = btnSpirit.attr('src') == '/y/battle/spirit_a.png';
    if (buff.indexOf('/y/e/channeling.png') >= 0) {
      useSkill(13);
    }
    console.debug(HP);
    console.debug(MP);
    if (HP < 30 && !stopFlag) {
      if (MP < 20) {
        return false;
      }
      if (!spiritFlag && SP > 0) {
        btnSpirit.click();
      }
      useSkill(16);
      //attact();
    } else if (HP < 70 && buff.indexOf('/y/e/regen.png') < 0 && !stopFlag) {
      if (!spiritFlag && SP > 0) {
        btnSpirit.click();
      }
      useSkill(15);
      //attact();
    } else {
      if (spiritFlag && SP < 70) {
        btnSpirit.click();
      }
      attact();
    }
  }
}, 500);

function useSkill(index) {
  $('#qb' + index).click();
  console.log('技能发动' + index);
}

function attact() {
  if (stopFlag) {
    return;
  }
  var OC = parseInt(Number($('.stuffbox.csp .cwbdv .cwb2').eq(3).css('width').replace(/px/g, ''))/120*100);
  monster.each(function(i, v) {
    var self = $(v);
    if (self.css('opacity') != '0.3' && !stopFlag) {
      if (OC > 50) {
        $('#qb10').click();
        $('#qb9').click();
        console.log('战技');
      }
      self.click();
      console.log('攻击');
      return false;
    }
  });
}