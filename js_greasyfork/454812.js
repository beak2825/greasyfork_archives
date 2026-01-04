// ==UserScript==
// @name        地魂MOD
// @description 变速、清战败和不可说功能
// @namespace   地魂MOD
// @match       https://nijitama.app/games/tamacolle/index*.html
// @grant       none
// @require     http://code.jquery.com/jquery-3.6.1.min.js
// @version     2.0
// @author      KUMA
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/454812/%E5%9C%B0%E9%AD%82MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/454812/%E5%9C%B0%E9%AD%82MOD.meta.js
// ==/UserScript==

var style = document.createElement('style');
style.id = 'kuma_style';
style.type = 'text/css';
style.innerHTML = `
.container {
  position: relative;
  top: -3px;
  background-color: #3a3e42;
  height: 110%;
  animation: transitionIn 1s;
}

*:not(input,checkbox,textarea) {
    /*禁止文本选择*/
   -webkit-touch-callout: none;
   -webkit-user-select: none;
   user-select: none; /* Non-prefixed version, currently */
   outline: none;
   -webkit-tap-highlight-color: transparent;
}

input {
    color: #FFFFFF;
    background-color: rgba(0,0,0,0);
    height: 30px;
    border-radius: 20px;
}

button {
    height: 30px;
    background-color: #E8E8E850;
    color: #ffffff;
    display: inline-block;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    outline: none;
    border: none;
    border-radius: 10px;
    transition: 0.5s;
}

button:hover {
  background-color: #8a8888;
  border-radius: 15px;
  transition: 0.9s;
}

button:active {
     transform: translateY(2px);
}

input[type=radio]  {
    width:20px;
    height:20px;
    margin-right:6px;
    border:none;
    outline-style:none;
    -webkit-appearance:none;
    vertical-align:middle;
    border:1px solid #DDDDDDF0;
    border-radius:50%;
}
input[type=radio]:checked {
    border:6px solid #ffffff;
    background:#FFFFFF;
}

input[type=checkbox]{
 visibility: hidden;
 vertical-align:middle; margin-bottom:2px;
 cursor: pointer;
 position: relative;
 width: 24px;
 height: 24px;
}
input[type=checkbox]::after{
 transition: 1s;
 position: absolute;
 top: 0;
 margin-top:2px;
 width: 14px; height: 14px;
 border: 1px solid #EEEEEE;
 border-radius: 5px;
 background-color: rgba(0,0,0,0);
 display: inline-block;
 visibility: visible;
 text-align: center;
 content: ' ';
}
input[type=checkbox]:checked::after{
 content: "✓";
 border-color: #FFFFFF;
 background-color: #686868;
 font-size: 12px;
 font-weight: bold;
 border-radius: 5px;
  transition: 1.5s;
}

.field {
  position: relative;
  display: flex;
  align-items: center;
  padding-bottom: 5px;
}
.field.column {
  flex-direction: column;
  align-items: stretch;
}
.flex {
  position: relative;
  display: flex;
}
.flex1 {
  flex: 1;
}

.sliderValue {
  position: relative;
  width: 100%;
  background-color: #8a8a8a
}


input[type=range] {
  -webkit-appearance: none;

}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-webkit-slider-runnable-track {
  height: 15px;
  width: 1px;
  cursor: pointer;
  animate: 0.2s;
  background: rgb(255, 255, 255);
  border-radius: 15px;
  border: 0.2px solid #010101;
}
input[type=range]::-webkit-slider-thumb {
  height: 19px;
  width: 19px;
  border-radius: 50%;
  background-color: #656565;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -2.5px;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: #ffffff;
}


/* 滚动条整体部分 */
.scrollbar {
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
.scrollbar::-webkit-scrollbar {
    width: 5px; /* 纵向滚动条宽度 */
    height: 5px;/* 横向滚动条高度 */
    background-color: #F5F5F5; /* 滚动条整体背景，一般被覆盖着 */
}
/* 滚动条的轨道（里面装有Thumb） */
.scrollbar::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); /* 滚动条轨道阴影 */
    /*border-radius: 10px; /* 滚动条轨道圆角 */
    background-color: #F5F5F5; /* 滚动条轨道背景 */
}
/* 滚动条里面的滑块 */
.scrollbar::-webkit-scrollbar-thumb {
    border-radius: 15px; /* 滚动条滑块圆角 */
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3); /* 滚动条滑块阴影 */
    background-color: #B8B8B8; /* 滚动条滑块颜色 */
}

.menubox {
        width: 60px;
        height: 30px;
        line-height: 30px;
        text-align:center;
        transition: 0.4s;
}
.menubox.current {
    background-color: #aaaaaa;
    border-radius: 10px;
    width: 70px;
    transition: 1s;
}


.menuview {
    display:none;

}

.menuview.current {
    display:block;
    overflow-x: hidden;
    overflow-y: scroll;
    height: 100%;
    animation: changePage 2s;
}

@keyframes transitionIn {
  from {
    opacity: 0;
    transform: rotateX(-10deg);
  }
  to {
    opacity: 1;
    transform: rotateX(0);
  }
}

@keyframes changePage {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
#kuma{
    position: fixed;
    left: 0;
    top: 50%;
    margin-top: 0;
    color: #ffffff;
    background-color: rgb(0 0 0 / 30%);
    text-align: left;
    font-size: 0.8em;
    border-radius: 100%;
}
#kuma_display {
    background-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDMwIiBoZWlnaHQ9IjQzMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDwhLS0gQ3JlYXRlZCB3aXRoIE1ldGhvZCBEcmF3IC0gaHR0cDovL2dpdGh1Yi5jb20vZHVvcGl4ZWwvTWV0aG9kLURyYXcvIC0tPgogPGc+CiAgPHRpdGxlPmJhY2tncm91bmQ8L3RpdGxlPgogIDxyZWN0IGZpbGw9Im5vbmUiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgaGVpZ2h0PSI0MzIiIHdpZHRoPSI0MzIiIHk9Ii0xIiB4PSItMSIvPgogIDxnIGRpc3BsYXk9Im5vbmUiIG92ZXJmbG93PSJ2aXNpYmxlIiB5PSIwIiB4PSIwIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIiBpZD0iY2FudmFzR3JpZCI+CiAgIDxyZWN0IGZpbGw9InVybCgjZ3JpZHBhdHRlcm4pIiBzdHJva2Utd2lkdGg9IjAiIHk9IjAiIHg9IjAiIGhlaWdodD0iMTAwJSIgd2lkdGg9IjEwMCUiLz4KICA8L2c+CiA8L2c+CiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPGVsbGlwc2Ugcnk9IjIwMCIgcng9IjIwMCIgaWQ9InN2Z18xIiBjeT0iMjE1IiBjeD0iMjE1IiBzdHJva2Utd2lkdGg9IjMwIiBzdHJva2U9IiNmZmZmZmYiIGZpbGw9Im5vbmUiLz4KICA8dGV4dCBmb250LXdlaWdodD0iYm9sZCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgdGV4dC1hbmNob3I9InN0YXJ0IiBmb250LWZhbWlseT0iSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMzAiIGlkPSJzdmdfMyIgeT0iMjYwIiB4PSI2My4zNTE1NjMiIHN0cm9rZS1vcGFjaXR5PSJudWxsIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZT0iIzAwMCIgZmlsbD0iI2ZmZmZmZiI+TU9EPC90ZXh0PgogPC9nPgo8L3N2Zz4=);
    background-size: contain;
    background-repeat: no-repeat;
    min-width: 40px;
    height: 40px;
    opacity: 0.5;
}
#kuma_menu {
    min-width: 300px;
}
.field_name {
    width: 8em;
}
.field_tip {
    margin-top:-8px;
}
`;
document.getElementsByTagName('head')[0].appendChild(style);

$('body').append(`
<div id="kuma">
  <div id="kuma_display"></div>
  <div id="kuma_menu" class="menuview">
    <div class="field">
      <div class="field_name">游戏速度</div>
      <input id="kuma_game_speed" type="range" min="1" max="19" steps="1" value="10" style="flex:1;" />
      <div id="kuma_game_speed_value" style="width:3em;padding-left:0.5em;">1</div>
    </div>
    <div class="field column">
      <div class="flex">
        <div>
          <div><label><input type="checkbox" id="kuma_game_shoucai" />收一个菜直接满魂</label></div>
          <div class="field_tip">(返回主界面后刷新页面)</div>
        </div>
        <div class="flex1"></div>
        <button id="kuma_game_lose_zero">战败数清零</button>
      </div>
    </div>
    <div class="field column">
      <div class="flex">
        <div class="field_name">战斗掉落修改</div>
        <div>
          <select id="kuma_game_battle_item">
            <option value="">读取中</option>
          </select>
        </div>
        <input id="kuma_game_battle_num" type="number" placeholder="1" value="1" style="width: 50px;" />
        <div>个</div>
      </div>
      <div class="field_tip">(替换第一个掉落，没打死或者没掉落就修改无效)</div>
    </div>
  </div>
</div>`);
$('#kuma').css('margin-top', - $('#kuma').height() / 2 + 'px');
$('#kuma_display').on('click', function(){
  if($('#kuma_menu').hasClass('current')) {
    $('#kuma_menu').removeClass('current');
    $(this).css('opacity', 0.5);
    $('#kuma').css('border-radius', '100%');
  } else {
    $('#kuma_menu').addClass('current');
    $(this).css('opacity', 1);
    $('#kuma').css('border-radius', '8px');
  }
  $('#kuma').css('margin-top', - $('#kuma').height() / 2 + 'px');
});
$('#kuma_game_speed').on('input', function(){
  let speed = 1.0;
  if($(this).val() < 10) {
    speed = $(this).val() / 10;
  } else {
    speed = $(this).val() - 9;
  }
  $('#kuma_game_speed_value').html(speed);
  cc.director.getScheduler().setTimeScale(speed);
});
$('#kuma_game_lose_zero').on('click', function(){
  if(cc.director.getScene().getChildByName("Managers").getChildByName("GameManager")._components[0].GV.prof.lose > 0) {
    const prof = cc.director.getScene().getChildByName("Managers").getChildByName("GameManager")._components[0].GV.prof;
    const win = prof.lose + prof.win;
    prof.lose = 0;
    prof.win = win;
    alert("收菜或领日常成功后生效");
  }
});

const init = () => {
  setTimeout(() => {
    try {
      if(cc.director.getScene().getChildByName("Managers").getChildByName("GameManager")._components[1].item.length > 0){
        let select_html = '<option value="">请选择</option>';
        const kunitama = cc.director.getScene().getChildByName("Managers").getChildByName("GameManager")._components[1].kunitama;
        const items = cc.director.getScene().getChildByName("Managers").getChildByName("GameManager")._components[1].item;
        var j = 0;
        for(const i in cc.director.getScene().getChildByName("Managers").getChildByName("GameManager")._components[1].item) {
          const item = items[i];
          let name = item.namae;
          if(item.replace != ""){
            name = name.replace("$s", item.replace);
            name += " " + item.replace;
          }
          if(item.namae !== '入浴タオル' && item.namae !== '$sの心'){
            j = 0;
          }
          if(item.namae === '入浴タオル'){
            if(typeof kunitama[j] !== 'undefined'){
              name += " " + kunitama[j].namae;
              j++;
            } else {
              continue;
            }
          }
          if(item.namae === '$sの心'){
            if(typeof kunitama[j] !== 'undefined'){
              name = name.replace("$s", kunitama[j].namae);
              j++;
            } else {
              continue;
            }
          }
          select_html += '<option value="' + item.id + '">' + item.id + ":" + name + '</option>';
        }
        $('#kuma_game_battle_item').html(select_html);
      } else {
        throw '';
      }
    } catch(e) {
      init();
    }
  }, 500);
}
init();

const { fetch: originalFetch } = window;
window.fetch = async (...args) => {
  let [resource, config ] = args;

  // request interceptor here
  if (resource === 'https://nijitama.app/api/saveData/save' && $('#kuma_game_shoucai').prop('checked')) {
    const body = JSON.parse(config.body);
    const serverDataJson = JSON.parse(body.serverDataJson);
    if(serverDataJson.tama.length > 0){
      serverDataJson.tama[0].count = 200000;
    }
    body.serverDataJson = JSON.stringify(serverDataJson);
    config.body = JSON.stringify(body);
    //console.log(resource, body);
  } else if (resource === 'https://nijitama.app/api/battle/battle' && $('#kuma_game_battle_item').val() !== '' && parseInt($('#kuma_game_battle_num').val()) > 0) {
    const body = JSON.parse(config.body);
    const d = body.d;
    if(d.indexOf('/drop') - d.indexOf('/item') >= 10) {
      let d2 = d.slice(d.indexOf('/item'), d.indexOf('/drop'));
      const id = $('#kuma_game_battle_item').val();
      const num = parseInt($('#kuma_game_battle_num').val());
      d2 = d2.replace(/\d+_\d+_(\d+)/, id + '_' + num + '_$1');
      const d3 = d.slice(0, d.indexOf('/item')) + d2 + d.slice(d.indexOf('/drop'), d.length);
      //console.log(d2);
      //console.log(d3);
      body.d = d3;
      config.body = JSON.stringify(body);
    }
    //console.log(resource, body);
  } else if (resource === 'https://nijitama.app/api/battle/battle_result' && $('#kuma_game_battle_item').val() !== '' && parseInt($('#kuma_game_battle_num').val()) > 0) {
      $('#kuma_game_battle_item').val('');
      $('#kuma_game_battle_num').val('1');
  }

  const response = await originalFetch(resource, config);
  // response interceptor here
  return response;
};
