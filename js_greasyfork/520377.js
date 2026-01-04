// ==UserScript==
// @name         Torn圣诞小镇掉落物品坐标显示
// @namespace    WH
// @version      0.2.2
// @description  在地图界面上方显示附近的宝箱、物品、钥匙坐标，兼容手机APP Torn PDA及Alook
// @author       Woohoo[2687093]
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520377/Torn%E5%9C%A3%E8%AF%9E%E5%B0%8F%E9%95%87%E6%8E%89%E8%90%BD%E7%89%A9%E5%93%81%E5%9D%90%E6%A0%87%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/520377/Torn%E5%9C%A3%E8%AF%9E%E5%B0%8F%E9%95%87%E6%8E%89%E8%90%BD%E7%89%A9%E5%93%81%E5%9D%90%E6%A0%87%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const ___window___ = window || window.unsafeWindow;
    if (___window___.WHLOOTPOS||___window___.WHTRANS) return;
    ___window___.WHLOOTPOS = true;

    const $ = ___window___.jQuery;

    if (/christmas_town\.php/.test(window.location.href)) {
        let $root = document.querySelector('#christmastownroot');
        const chestTypeDict = {'1': '金', '2': '银', '3': '铜',};
        const chestTypeColorDict = {'1': 'gold', '2': 'silver', '3': 'sandybrown',};
        const lootTypeDict = {'chests': '钥匙箱', 'gifts': '礼物', 'combinationChest': '密码箱', 'keys': '钥匙',};
        const keyTypeDict = {'b': '铜', 's': '银', 'g': '金',};
        let dropHist = localStorage.getItem('wh-loot-store')
            ? JSON.parse(localStorage.getItem('wh-loot-store'))
            : {};
        const alertSettings = localStorage.getItem('wh-loot-setting')
            ? JSON.parse(localStorage.getItem('wh-loot-setting'))
            : {blink: 'y', sound: 'y', chest: 'y'};
        let $ct_wrap;
        let soundLoopFlag = false;
        const getDOMOb = new MutationObserver(() => {
            $ct_wrap = $root.querySelector('#ct-wrap');
            if ($ct_wrap) {
                getDOMOb.disconnect();
                const insert_html = `<div id="wh-loot-container" class="m-bottom10">
<audio src="https://www.torn.com/js/chat/sounds/Chirp_3.mp3" style="display:none"></audio>
<div class="title-black"><span>附近物品</span></div>
<div id="wh-loot-container-main" class="cont-gray">
  <b>物品</b><span id="wh-loot-item-count"></span>
  <div id="wh-loot-container-items"></div>
  <b>箱子</b><span id="wh-loot-chest-count"></span>
  <div id="wh-loot-container-chests"></div>
</div>
<div id="wh-loot-container-ex" class="cont-gray wh-hide">
  <div><label><input type="checkbox" id="wh-loot-setting-blink" ${alertSettings.blink === 'y' ? 'checked' : ''} /> 闪烁提示</label></div>
  <div><label><input type="checkbox" id="wh-loot-setting-sound" ${alertSettings.sound === 'y' ? 'checked' : ''} /> 声音提示 <del>(iOS)</del></label></div>
  <div><label><input type="checkbox" id="wh-loot-setting-chest" ${alertSettings.chest === 'y' ? 'checked' : ''} /> 不记录需要钥匙的宝箱</label></div>
  <div id="wh-hist">
    <div id="wh-hist-clear">
      <p><button>清空数据</button>- 长时间不清空会出现奇怪的问题</p>
    </div>
    <table><thead><tr><th colspan="5">历史记录</th></tr><tr><th>坐标</th><th>地图</th><th>类型</th><th>发现</th><th>获取</th></tr></thead><tbody></tbody></table>
  </div>
</div>
<div id="wh-loot-btn" class="cont-gray"><button>设置</button></div>
</div>
<style>
#wh-loot-container-main{padding: 0.5em;}
#wh-loot-container-main div{overflow-x: auto;overflow-y: hidden;white-space: nowrap;min-height: 4em;}
#wh-loot-container-main div span{display: inline-block;background-color: #2e8b57;color: white;margin: 0 1em 0 0;border-radius: 4px;padding: 0.5em;}
#wh-loot-container-main div span img{height: 1em; width: 1em;}
#wh-loot-container-ex{padding: 0.5em;}
#wh-loot-container-ex.wh-hide{display: none;}
#wh-loot-container-ex #wh-hist{overflow-x: auto;}
#wh-loot-container-ex table {margin-top: 0.5em;}
#wh-loot-container-ex tbody {background-color: antiquewhite;}
#wh-loot-container-ex table, #wh-loot-container-ex th, #wh-loot-container-ex td {
    padding: 5px;
    border: 1px solid black;
    height: auto;
}
#wh-loot-container-ex th:nth-child(1) {min-width: 5em;}
#wh-loot-container-ex th:nth-child(2) {min-width: 8em;}
#wh-loot-container-ex th:nth-child(3) {min-width: 4em;}
#wh-loot-container-ex th:nth-child(4) {min-width: 9em;}
#wh-loot-container-ex th:nth-child(5) {min-width: 3em;}
#wh-loot-container-ex thead {
    background-color: #2e8b57;
    color: white;
}
@keyframes lootFoundAlert {
  0% {background: #f2f2f2}
  50% {background: #2e8b57}
  100% {background: #f2f2f2}
}
</style>`;
                $($ct_wrap).before(insert_html);
                const $wh_loot_container = $root.querySelector('#wh-loot-container');
                const $btn = $wh_loot_container.querySelector('#wh-loot-btn button');
                const $clear_btn = $wh_loot_container.querySelector('#wh-hist-clear button');
                const $ex = $wh_loot_container.querySelector('#wh-loot-container-ex');
                const $tbody = $wh_loot_container.querySelector('tbody');
                const $blink = $wh_loot_container.querySelector('#wh-loot-setting-blink');
                const $sound = $wh_loot_container.querySelector('#wh-loot-setting-sound');
                const $chest = $wh_loot_container.querySelector('#wh-loot-setting-chest');
                const $audio = $wh_loot_container.querySelector('audio');
                $btn.onclick = e => {
                    e.target.innerText = e.target.innerText === '设置' ? '收起' : '设置';
                    $($ex).toggleClass('wh-hide');
                    e.target.blur();
                };
                $clear_btn.onclick = e => {
                    e.target.blur();
                    dropHist = {};
                    $tbody.innerHTML = '';
                    localStorage.setItem('wh-loot-store', JSON.stringify(dropHist));
                };
                $blink.onchange = e => {
                    if (e.target.checked) {
                        alertSettings.blink = 'y';
                        if ($wh_loot_container.querySelector('#wh-loot-item-count').innerText !== '(0)') {
                            $wh_loot_container.querySelector('#wh-loot-container-main').style.animation = 'lootFoundAlert 2s infinite';
                        }
                    } else {
                        alertSettings.blink = 'n';
                        $wh_loot_container.querySelector('#wh-loot-container-main').style.animation = '';
                    }
                    localStorage.setItem('wh-loot-setting', JSON.stringify(alertSettings));
                };
                $sound.onchange = e => {
                    if (e.target.checked) {
                        alertSettings.sound = 'y';
                        if ($wh_loot_container.querySelector('#wh-loot-item-count').innerText !== '(0)') {
                            soundLoopFlag = true;
                        }
                    } else {
                        alertSettings.sound = 'n';
                        soundLoopFlag = false;
                    }
                    localStorage.setItem('wh-loot-setting', JSON.stringify(alertSettings));
                };
                $chest.onchange = e => {
                    alertSettings.chest = e.target.checked ? 'y' : 'n';
                    localStorage.setItem('wh-loot-setting', JSON.stringify(alertSettings));
                };
                const soundIntervalID = window.setInterval(() => {
                    if (soundLoopFlag) $audio.play().then();
                }, 1200);
                ob.observe($root, {childList: true, subtree: true});
            }
        });
        const ob = new MutationObserver(() => {
            ob.disconnect();
            // 页面刷新重新获取dom
            $root = document.querySelector('#christmastownroot');
            $ct_wrap = $root.querySelector('#ct-wrap');
            if (!$ct_wrap) {
                ob.observe($root, {childList: true, subtree: true});
                return;
            }
            const $ct_title = $ct_wrap.querySelector('.status-title');
            const $pos = $ct_wrap.querySelector('.map-title span[class^="position___"]') || $ct_wrap.querySelector('.status-title span[class^="position___"]');
            if (!$pos) {
                ob.observe($root, {childList: true, subtree: true});
                return;
            }
            const $pos_spl = $pos.innerText.trim().split(',');
            const player_position = {};
            player_position.x = parseInt($pos_spl[0]);
            player_position.y = parseInt($pos_spl[1]);
            const $wh_loot_container = $root.querySelector('#wh-loot-container');
            if (!$wh_loot_container) {
                console.error('掉落助手未找到DOM容器');
                ob.observe($root, {childList: true, subtree: true});
                return;
            }
            const $blink = $wh_loot_container.querySelector('#wh-loot-setting-blink');
            const $sound = $wh_loot_container.querySelector('#wh-loot-setting-sound');
            const $chest = $wh_loot_container.querySelector('#wh-loot-setting-chest');
            const $tbody = $wh_loot_container.querySelector('tbody');
            const nearby_arr = [];
            const items = $root.querySelectorAll('div.grid-layer div.items-layer div.ct-item');
            // 附近的所有物品
            items.forEach(el => {
                const item_props = {x: 0, y: 0, name: '', type: '', url: '',};
                item_props.x = parseInt(el.style.left.replaceAll('px', '')) / 30;
                item_props.y = -parseInt(el.style.top.replaceAll('px', '')) / 30;
                item_props.url = el.firstElementChild.src;
                const srcSpl = item_props.url.trim().split('/');
                item_props.name = srcSpl[6];
                item_props.type = srcSpl[8].slice(0, 1);
                nearby_arr.push(item_props);
            });
            const $wh_loot_container_items = $wh_loot_container.querySelector('#wh-loot-container-items');
            const $wh_loot_container_chests = $wh_loot_container.querySelector('#wh-loot-container-chests');
            let item_count = 0, chest_count = 0;
            $wh_loot_container_items.innerHTML = '';
            $wh_loot_container_chests.innerHTML = '';
            nearby_arr.forEach(nearby_item => {
                let path = '=';
                if (nearby_item.x < player_position.x && nearby_item.y < player_position.y) path = '↙';
                else if (nearby_item.x < player_position.x && nearby_item.y === player_position.y) path = '←';
                else if (nearby_item.x < player_position.x && nearby_item.y > player_position.y) path = '↖';
                else if (nearby_item.x === player_position.x && nearby_item.y > player_position.y) path = '↑';
                else if (nearby_item.x > player_position.x && nearby_item.y > player_position.y) path = '↗';
                else if (nearby_item.x > player_position.x && nearby_item.y === player_position.y) path = '→';
                else if (nearby_item.x > player_position.x && nearby_item.y < player_position.y) path = '↘';
                else if (nearby_item.x === player_position.x && nearby_item.y < player_position.y) path = '↓';
                let item_name;
                if (nearby_item.name === 'chests') {
                    chest_count++;
                    item_name = chestTypeDict[nearby_item.type] + lootTypeDict[nearby_item.name];
                    $wh_loot_container_chests.innerHTML += `<span style="background-color: ${chestTypeColorDict[nearby_item.type] || 'silver'};">${path}[${nearby_item.x},${nearby_item.y}] ${item_name}<img src="${nearby_item.url}" /></span>`
                } else {
                    item_count++;
                    item_name = (nearby_item.name === 'keys' ? keyTypeDict[nearby_item.type] || '' : '') + lootTypeDict[nearby_item.name] || nearby_item.name;
                    $wh_loot_container_items.innerHTML += `<span>${path}[${nearby_item.x},${nearby_item.y}] ${item_name}<img src="${nearby_item.url}" /></span>`
                }
                // 确认地图坐标存在
                if ($ct_title) {
                    const hist_key = `[${nearby_item.x},${nearby_item.y}]"${$ct_title.firstChild.nodeValue.trim()}"${item_name}`;
                    const el = dropHist[hist_key];
                    if (el) {
                        if (path === '=' && (nearby_item.name === 'keys' || nearby_item.name === 'gifts')) {
                            el.isPassed = true;
                        }
                    } else {
                        if (!(nearby_item.name === 'chests' && $chest.checked)) {
                            const now = new Date();
                            dropHist[hist_key] = {
                                pos: `[${nearby_item.x},${nearby_item.y}]`,
                                map: $ct_title.firstChild.nodeValue.trim(),
                                last: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
                                name: item_name,
                                id: Object.keys(dropHist).length,
                            };
                        }
                    }
                }
            });
            $wh_loot_container.querySelector('#wh-loot-item-count').innerText = `(${item_count})`;
            if (item_count === 0) {
                $wh_loot_container_items.innerText = '暂无';
                $wh_loot_container.querySelector('#wh-loot-container-main').style.animation = '';
                soundLoopFlag = false;
            } else {
                if ($blink.checked) $wh_loot_container.querySelector('#wh-loot-container-main').style.animation = 'lootFoundAlert 2s infinite';
                if ($sound.checked) soundLoopFlag = true;
            }
            $wh_loot_container.querySelector('#wh-loot-chest-count').innerText = `(${chest_count})`;
            if (chest_count === 0) $wh_loot_container_chests.innerText = '暂无';
            const history = Object.keys(dropHist).map(key => dropHist[key]).sort((a, b) => a.id - b.id);
            let table_html = '';
            history.forEach(e => {
                table_html += `<tr><td>${e.pos}</td><td>${e.map}</td><td>${e.name}</td><td>${e.last}</td><td>${e.isPassed ? '已取得' : '不确定'}</td></tr>`;
            });
            $tbody.innerHTML = table_html;
            localStorage.setItem('wh-loot-store', JSON.stringify(dropHist));
            ob.observe($root, {childList: true, subtree: true});
        });
        getDOMOb.observe($root, {childList: true, subtree: true});
    }
}());
