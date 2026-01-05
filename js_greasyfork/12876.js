// ==UserScript==
// @name        吃药脚本
// @namespace   antinotice
// @include     http://hentaiverse.org/?s=Battle*
// @version     0.021
// @grant       none
// @description chiyao
// @downloadURL https://update.greasyfork.org/scripts/12876/%E5%90%83%E8%8D%AF%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/12876/%E5%90%83%E8%8D%AF%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
//请将health draught放在第1格，mana draught放在第3格，mana potion放在第4格，
//spirit draught放在第5格，spirit potion放在第6格，
//如需开保护卷请将保护卷放在第十格并在下面选择开启

var settings = {
  //是否补保护卷，如需要请改为true
  pro: false,
  //是否启用点击吃药
  clickuseitem: true,
  //点击吃药按键选择，0为左键，1为中键，2为右键
  mousekey: 1
  //不会影响正常游玩/和hoverplay冲突
};

mana_a = 0.95;
mana_b = 0.6;
//mana_a为吃mana draught的蓝量，mana_b为吃mana potion的蓝量
spirit_a = 0.65;
spirit_b = 0.3;
//spirit_a为吃spirit draught的s量，spirit_b为吃spirit potion的s量

if (!document.getElementsByClassName('bte') [0].querySelector('img[src="http://ehgt.org/v/e/healthpot.png"]'))
{
  var x = document.getElementById('ikey_1');
  if (x) {
    var img = document.querySelector('.btmp') .appendChild(document.createElement('img'));
    img.id = 'healthdra';
    img.className = 'useitem';
    img.src = 'http://ehgt.org/v/e/healthpot.png';
    img.style.cssText = 'margin-right:2px;margin-left:2px;width:30px;';
    img.onmouseover = ikey_1.onclick;
  }
}

var bars = document.getElementsByClassName("cwb2");
if(bars)
{var MP = bars[1].offsetWidth / 120;
if(MP < mana_a)
{
 if (!document.getElementsByClassName('bte') [0].querySelector('img[src="http://ehgt.org/v/e/manapot.png"]'))
{
  var m = document.getElementById('ikey_3');
  if (m) {
    var img = document.querySelector('.btmp') .appendChild(document.createElement('img'));
    img.id = 'manadra';
    img.className = 'useitem';
    img.src = 'http://ehgt.org/v/e/manapot.png';
    img.style.cssText = 'margin-right:2px;margin-left:2px;width:30px;';
    img.onmouseover = ikey_3.onclick;
  }
}
}
if(MP < mana_b)
{
  var m = document.getElementById('ikey_4');
  if (m) {
    var img = document.querySelector('.btmp') .appendChild(document.createElement('img'));
    img.id = 'manapot';
    img.className = 'useitem';
    img.src = 'http://ehgt.org/v/e/manapot.png';
    img.style.cssText = 'border: 2px solid blue;margin-right:2px;margin-left:2px;width:30px;';
    img.onmouseover = ikey_4.onclick;
  }
}

 var SP = bars[2].offsetWidth / 120;
if(SP < spirit_a)
{
 if (!document.getElementsByClassName('bte') [0].querySelector('img[src="http://ehgt.org/v/e/spiritpot.png"]'))
{
  var m = document.getElementById('ikey_5');
  if (m) {
    var img = document.querySelector('.btmp') .appendChild(document.createElement('img'));
    img.id = 'spiritdra';
    img.className = 'useitem';
    img.src = 'http://ehgt.org/v/e/spiritpot.png';
    img.style.cssText = 'margin-right:2px;margin-left:2px;width:30px;';
    img.onmouseover = ikey_5.onclick;
  }
}
}
if(SP < spirit_b)
{
  var m = document.getElementById('ikey_6');
  if (m) {
    var img = document.querySelector('.btmp') .appendChild(document.createElement('img'));
    img.id = 'spiritpot';
    img.className = 'useitem';
    img.src = 'http://ehgt.org/v/e/spiritpot.png';
    img.style.cssText = 'border: 2px solid yellow;margin-right:2px;margin-left:2px;width:30px;';
    img.onmouseover = ikey_6.onclick;
  }
} 
}



if (settings.pro && !document.getElementsByClassName('bte') [0].querySelector('img[src="http://ehgt.org/v/e/protection_scroll.png"]'))
{
  var p = document.getElementById('ikey_10');
  if (p) {
    var img = document.querySelector('.btmp') .appendChild(document.createElement('img'));
    img.id = 'baohujuan';
    img.className = 'useitem';
    img.src = 'http://ehgt.org/v/e/protection_scroll.png';
    img.style.cssText = 'margin-right:2px;margin-left:2px;width:30px;';
    img.onmouseover = ikey_10.onclick;
  }
}

if(settings.clickuseitem) {
  window.addEventListener("mousedown", function(e) {
    if(e.button == settings.mousekey) {
      i = document.getElementsByClassName('useitem');
      if(i.length) {
        i[0].onmouseover();
      }
    }
  })
}