// ==UserScript==
// @name         IQRPG Stats 中文版
// @namespace    https://www.iqrpg.com/
// @version      0.58
// @description  包含所有IQ掉落的掉落追踪器，以及追踪击杀/死亡节点的命中数，并显示您需要多少才能达到下一个节点！还有各种其他战斗统计。
// @author       Coastis (中文版Tiande)
// @match        *://*.iqrpg.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @run-at       document-idle
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546672/IQRPG%20Stats%20%E4%B8%AD%E6%96%87%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/546672/IQRPG%20Stats%20%E4%B8%AD%E6%96%87%E7%89%88.meta.js
// ==/UserScript==

///////////////////////////////////
/////////// 配置 ////////////////
///////////////////////////////////

const track_battle_stats = true; // true 或 false - 启用或禁用战斗统计
const track_stats_n_drops = true; // true 或 false - 启用或禁用掉落追踪器
const dropalyse_decimal_precision = 3; // 每小时/每天平均掉落显示的小数位数
const track_boss_battles = false; // true 或 false
const track_clan_battles = false; // true 或 false
const track_abyss_battles = false; // true 或 false
const track_min_health_perc = true; // true 或 false

//////////////////////////////////////////////////////////////////
/////////// 请勿修改此行以下的任何内容 ////////////////
//////////////////////////////////////////////////////////////////

/* globals jQuery, $ */

// 初始化
var player_stats = { dmg:0, hits:0, misses:0, hp_perc:100, max_hp:0 }; //TODO 从本地存储更新
var enemy_stats = { dmg:0, hits:0, misses:0, dodges:0,max_hp:0 }; //TODO 从本地存储更新
var player_cache = '';
var enemy_cache = '';
//var action_timer_cache = ''; // 删除
var actions = 0;
var dropalyse_rendered = false;
var dropalyse_format = 'hour'; // hour/day/total
var track_extra_battle_stats = true;

// 设置持久化变量
var dropalyse_cache = '';
var dropalyse_store = {};
//var dropalyse_start_datum = Date.now(); // 删除
var dropalyse_filters = [];
dropalyse_load_ls();

// 每xxx毫秒运行一次更新内容
// 注意：我们在开始前设置1000毫秒的延迟，以帮助慢渲染的CPU，否则第一个掉落可能不会被计算
setTimeout(function() {
    // 设置观察器
    if(track_stats_n_drops === true) {
        if(dropalyse_rendered === false) { // 插入p/h面板
            dropalyse_insert_log();
            dropalyse_rendered = true;
        }
        const actionsElement = document.querySelector(".action-timer__text");
        const actionObserver = new MutationObserver(actionTimerChanged);
        actionObserver.observe(actionsElement, { childList: true, subtree: true,characterData: true, characterDataOldValue: true});
    }
    // 其他
    setInterval(iqrpgbs_loop, 100);
    //setInterval(iqrpgbs_timer_loop, 1000);
}, 1000);

// 观察动作计时器变化并根据需要更新动作计数
function actionTimerChanged(mutationList, observer) {
    mutationList.forEach((mutation) => {
        if(mutation.type === 'characterData') {
            if(actionTimerClean(mutation.target.textContent) < actionTimerClean(mutation.oldValue)) {
                actions++;
                parse_drop_log(); // 解析它
                dropalyse_render_content(); //  更新p/h
            }
        }
    });
}
function actionTimerClean(entry) {
    return +(entry.replace("Autos Remaining: ",""));
}

// 主循环
function iqrpgbs_loop() {

    /*
    v0.56中的新功能
     - 对于战斗统计，我添加了"击杀/死亡"节点追踪，这有助于您改善胜率和投资策略
     - 掉落追踪器现在在点击重置时有弹出确认框
     - 添加了新的氏族龙类型
    */

    //TODO 地牢钥匙总代币

    //TODO 为战斗统计添加持久化
    //TODO 为金币/资源添加"冲刺次数" - 需要删除与[金币][木材]等相关的弹窗
    //TODO 分离战斗统计，以便boss/地牢等统计分别追踪
    //稀有度追踪可以检测是否找到新类别，如果carl更改css则退出，从而防止我们的噩梦
    //TODO 战斗统计 - 胜率%改进计算，例如攻击胜率%增量

    // 掉落分析
    if(track_stats_n_drops === true) {
        // 第一次运行？
        if(dropalyse_cache === '' && $( 'div#log-div > div' ).length > 0 ) {
            dropalyse_cache = dropalyse_clean_entry( $( 'div#log-div > div:first' ) );
        }
        /*         // 插入p/h面板
        if(dropalyse_rendered === false) {
            dropalyse_insert_log();
            dropalyse_rendered = true;
        } */
        // 新掉落日志解析
        /*         if( $("div.fixed-top > div.section-2 > div.action-timer > div.action-timer__text").length > 0 ) {
            let action_data = $("div.fixed-top > div.section-2 > div.action-timer > div.action-timer__text").prop('innerHTML').trim();
            if(action_data !== action_timer_cache) {
                action_timer_cache = action_data;
                parse_drop_log(); // 解析它
                dropalyse_render_content(); //  更新p/h
            }
        } else {
            return false; // 跳过，因为自动还未渲染
        } */
    }

    // 战斗统计
    if(track_battle_stats === false) return true; // 启用或禁用战斗统计
    var we_battling = false;
    var display_needs_update = false;

    // 检查我们是否在战斗页面
    if(document.getElementsByClassName("battle-container").length > 0) {
        we_battling = true;
    } else return false;

    // 不在boss战斗中 - Boss Tokens
    if(track_boss_battles!==true && $("div.game-grid > div.main-game-section > div.main-section__body:contains('Boss Tokens')").length > 0) {
        return false;
    }

    // 不在地牢中 - Dungeoneering Exp
    if($("div.game-grid > div.main-game-section > div.main-section__body:contains('Dungeoneering Exp')").length > 0) {
        return false;
    }

    // 不在标准氏族战斗中 - Clan Exp
    if(track_clan_battles!==true && $("div.game-grid > div.main-game-section > div.main-section__body:contains('Clan Exp')").length > 0) {
        return false;
    }

    // 一切正常，让我们获取怪物名称
    var n_obj = $("div.battle-container > div:nth-child(3) > div.participant-name > span");
    if(n_obj.length > 0) {
        var mob_name = n_obj.prop('innerHTML').trim();
    } else {
        return false; // 找不到怪物名称，让我们跳过以防万一
    }

    // 不在氏族龙战斗中
    // 精确匹配
    const clan_dragons = ['Baby Dragon','Young Dragon','Adolescent Dragon','Adult Dragon','Elder Dragon','Dragon','Mythical Dragon'];
    if(track_clan_battles!==true && clan_dragons.indexOf(mob_name) > -1 ) {
        //console.log('跳过氏族龙');
        return false;
    }

    // 不在深渊战斗或氏族战斗中 - Abyssal
    if(track_abyss_battles!==true && ['Abyssal'].some(term => mob_name.includes(term))) {
        return false;
    }

    // 一切正常
    if(we_battling === true) {

        // 将战斗统计面板添加到dom，如果尚未添加
        if(!document.getElementById("iqrpgbs_bs_panel")) {
            var iqrpg_body = $( "div.game-grid > div.main-game-section > div.main-section__body" );
            iqrpg_body[0].children[0].children[0].insertAdjacentHTML('beforeend', render_battle_stats_panel() );
            document.getElementById('igrpg_bs_reset').addEventListener('click', iqrpg_bs_reset_stats, false);
        }

        // 获取玩家统计行并与之前存储的统计比较
        var player_sl = $("div.game-grid > div.main-game-section > div.main-section__body > div > div > div > div:nth-child(2)");
        if(player_sl.prop('innerHTML') !== player_cache) {
            player_cache = player_sl.prop('innerHTML');
            parse_player_stat_line(player_sl);
            display_needs_update = true;
        }

        // 获取怪物统计行并与之前存储的统计比较
        var mobs_sl = $("div.game-grid > div.main-game-section > div.main-section__body > div > div > div > div:nth-child(3)");
        if(mobs_sl.prop('innerHTML') !== enemy_cache) {
            enemy_cache = mobs_sl.prop('innerHTML');
            parse_enemy_stat_line(mobs_sl);
            display_needs_update = true;
        }

        // 我们已经有display_needs_update，让我们将其用作新健康追踪的触发器
        if(display_needs_update === true ) {

            // 获取玩家健康行
            let players_hp_sl = $("div.game-grid > div.main-game-section > div.main-section__body > div > div > div > div.battle-container > div.battle-container__section > div:nth-child(2) > div.progress__text");
            player_stats.max_hp = players_hp_sl.prop('innerHTML').split(" / ")[1].replaceAll(",", "");
            // 获取敌人健康行
            let enemy_hp_sl = $("div.game-grid > div.main-game-section > div.main-section__body > div > div > div > div.battle-container > div.battle-container__section:nth-child(3) > div:nth-child(2) > div.progress__text ");
            enemy_stats.max_hp = enemy_hp_sl.prop('innerHTML').split(" / ")[1].replaceAll(",", "");

            if(track_min_health_perc === true) {
                let hp_totals = players_hp_sl.prop('innerHTML').split(" / ");
                let this_perc = (parseInt(hp_totals[0].replaceAll(",", "")) / parseInt(hp_totals[1].replaceAll(",", ""))) * 100;
                if(this_perc < player_stats.hp_perc) player_stats.hp_perc = this_perc;
            }
        }

        // 更新显示的值
        if(display_needs_update === true) {
            update_display();
        }

    }


}

// 解析掉落日志并构建量化内容数组
function parse_drop_log() {

    if( $( 'div#log-div > div' ).length == 0 ) return false; // 日志尚未渲染，或刚刚被清除

    const skiplist = ['[Gold]','Gold Rush:','Action Bonus:','Resource Rush:','Skill:','Mastery:','[Wood]','[Stone]','[Metal]'];
    let first_log_entry = dropalyse_clean_entry( $( 'div#log-div > div:first' ) ); // 捕获缓存条目以备后用
    let count = 0;

    $( 'div#log-div > div' ).each(function( index ) {

        // 检查是否已分析
        let str = dropalyse_clean_entry($(this));
        //console.log("str - " + str);
        //console.log("cache - " + dropalyse_cache );
        if(str === dropalyse_cache) return false; // 跳出循环

        // 跳过不需要的
        if (skiplist.some(v => str.includes(v))) return true; // 继续循环

        // 解析为时间、数量、物品
        let entry = parse_drop_log_entry($( this ));
        count++;

        // 添加到数据存储
        if (typeof dropalyse_store[entry.item] !== 'undefined') {
            dropalyse_store[entry.item] += entry.qty;
        } else {
            dropalyse_store[entry.item] = entry.qty;
        }

    });

    // 我们有新条目吗？
    if(count>0) {
        dropalyse_cache = first_log_entry;
    }

    // 将数据保存到本地存储
    dropalyse_save_ls();

}

function dropalyse_clean_entry(txt) {
    //console.log("清理 - " + $(txt).text() );
    var r = txt.clone();
    r.find('.popup').remove();
    //console.log("清理后 - " + r.text() );
    let ret = r.text();
    // 稀有度
    //let rarity = $("div.item > p[class^='text-rarity-']", r).attr('class');
    //if(typeof rarity !== 'undefined') ret = ret + "#iqrpgstats#" + rarity;
    return ret;
}

function parse_drop_log_entry(entry) {

    let r = {};

    // 时间戳 - 不需要??
    r.timestamp = $('span:first', entry).text();

    // 物品
    let data_str = $('span', entry).eq(1).text().replaceAll(",","");
    let matches = data_str.match(/^[+-]?\d+(\.\d+)?[%]?/g);
    if(matches && matches.length>0) {
        let n = matches[0];
        r.qty = Number(n.replace('+', '').replace('%', ''));
        r.item = data_str.replace(n,'').trim();
    } else {
        r.qty = 1; // 这是不寻常的东西
        r.item = data_str.trim();
    }

    // 去除额外数据
    r.item = r.item.split("]")[0].replace("[","").replace("]","");

    // 附加新的稀有度数据
    let rarity = $("div.item > p[class^='text-rarity-']", entry).attr('class');
    if(typeof rarity !== 'undefined') r.item = r.item + "#iqrpgstats#" + rarity;
    //console.log(rarity + " - " + r.item);

    return r;
}

function dropalyse_load_ls() {
    if (localStorage.getItem('dropalyse_cache')) { dropalyse_cache = localStorage.getItem('dropalyse_cache'); }
    if (localStorage.getItem('dropalyse_actions')) { actions = localStorage.getItem('dropalyse_actions'); }
    if (localStorage.getItem('dropalyse_store')) { dropalyse_store = JSON.parse(localStorage.getItem('dropalyse_store')); }
    if (localStorage.getItem('dropalyse_filters')) { dropalyse_filters = JSON.parse(localStorage.getItem('dropalyse_filters')); }
    // 如果我们有开始基准，转换为新的动作方法，并从LS删除开始基准
    if (localStorage.getItem('dropalyse_start_datum')) {
        let dropalyse_start_datum = localStorage.getItem('dropalyse_start_datum');
        actions = Math.floor((( Date.now() - dropalyse_start_datum ) / 1000) /6 ); // 从旧时间数据近似动作
        localStorage.removeItem('dropalyse_start_datum'); // 删除旧数据
        dropalyse_save_ls(); // 保存新数据
    }
}

function dropalyse_save_ls() {
    localStorage.setItem('dropalyse_cache', dropalyse_cache);
    localStorage.setItem('dropalyse_store', JSON.stringify(dropalyse_store));
    localStorage.setItem('dropalyse_actions', actions);
    localStorage.setItem('dropalyse_filters', JSON.stringify(dropalyse_filters));
    localStorage.setItem('dropalyse_version', GM_info.script.version);
    // 删除
    //localStorage.setItem('dropalyse_start_datum', dropalyse_start_datum);
    //localStorage.setItem('dropalyse_save_datum', Date.now());
}

function dropalyse_reset() {
    if (confirm("您确定要重置掉落追踪器吗？") == true) {
        dropalyse_store = {};
        actions = 0;
        dropalyse_save_ls(); // 更新持久存储
        dropalyse_render_content();
    }
}

function dropalyse_render_content() {
    let html = '';
    if(Object.entries(dropalyse_store).length == 0 ) {
        html = '<div>等待掉落中...</div>';
    } else {

        // 获取存储的排序副本
        let copy_of_dropalyse_store = Object.assign(dropalyse_objectOrder(), dropalyse_store);

        for (let [key, qty] of Object.entries(copy_of_dropalyse_store)) {
            // 跳过null
            if(Number(qty) == 0 ) continue;
            // 格式化数量
            let formatted_qty = qty;
            if(dropalyse_format==='hour') {
                //formatted_qty = ( ( qty / dropalyse_get_time_elapsed() ) * 60 * 60 ).toFixed(dropalyse_decimal_precision);
                formatted_qty = ( ( qty / actions ) * 10 * 60 ).toFixed(dropalyse_decimal_precision);
            } else if(dropalyse_format==='day') {
                //formatted_qty = ( ( qty / dropalyse_get_time_elapsed() ) * 60 * 60 * 24).toFixed(dropalyse_decimal_precision);
                formatted_qty = ( ( qty / actions ) * 10 * 60 * 24).toFixed(dropalyse_decimal_precision);
            } else {
                formatted_qty = Number(formatted_qty.toFixed(dropalyse_decimal_precision)).toString();
            }
            // 格式化稀有度
            let rarity_class = '';
            let parts = key.split("#iqrpgstats#");
            if(parts.length === 2) rarity_class = parts[1];
            // 是否被过滤？
            if(dropalyse_filters.includes(parts[0])) continue;
            // 渲染
            html += '<div style="position: relative;" class="iqrpgbs_hover_highlight"><div style="display: flex; justify-content: space-between;">'
                + '<span class="'+ escapeHTML(rarity_class) + '">' + escapeHTML(parts[0]) + '</span>'
                + '<span style="color:#3c3">' + escapeHTML(formatted_qty) + '</span>'
                + '</div></div>';
        }
    }
    $('div#iqrpgbs_drop_log_content').html(html);
    document.querySelector('#iqrpgbs_dropalyse_actioncount').textContent = Number(actions).toLocaleString();
    document.querySelector('#iqrpgbs_dropalyse_actiondatum').textContent = dropalyse_render_nice_timer( actions * 6);
}

function escapeHTML(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function dropalyse_insert_log() {
    let html = `<div id="iqrpgbs_dropalyse_container" class="main-section" style="background-color: #0a0a0a;margin-bottom: .2rem;border: 1px solid #333;">
    <div id="iqrpgbs_drop_log_header" style="cursor:pointer;">
    <p><span id="iqrpgbs_drop_log_header_title">每小时掉落</span><span class="grey-text" style="margin-left: 0.5rem; font-size: 0.9rem;display:none;">(已折叠)</span></p><!---->
    </div>
    <div id="iqrpgbs_drop_log_body" class="main-section__body" style="border-top: 1px solid #333;padding: .5rem;">
    <div>

    <div id="iqrpgbs_drop_log_content">等待掉落中...</div>

    <div class="iqrpgbs_dropalyse_spacing"><span id="iqrpgbs_dropalyse_actiondatum">0秒</span> <a title="基于每个动作6秒" style="cursor:help">&#x1f6c8;</a></div>
    <div class="iqrpgbs_dropalyse_spacing"><span id="iqrpgbs_dropalyse_actioncount">0</span> 动作数</div>


    <div id="iqrpgbs_dropalyse_options">[<a id="iqrpgbs_dropalyse_opt_hour" href="#">小时</a>
    - <a id="iqrpgbs_dropalyse_opt_day" href="#">天</a>
    - <a id="iqrpgbs_dropalyse_opt_total" href="#">总计</a>]
    [<a id="iqrpgbs_dropalyse_backup_toggle" href="#">选项</a>]
    [<a id="iqrpgbs_dropalyse_reset" href="#">重置</a>]</div>

    <div id="iqrpgbs_dropalyse_backup_panel" style="margin-top:12px;display:none;">

    <p class="heading">掉落过滤器</p>
    <p>您可以通过在下面的字段中输入您不感兴趣的掉落来过滤掉它们，每行一个。例如，要过滤掉哥布林钥匙，您需要在新行中输入"哥布林洞穴钥匙"，然后点击更新按钮</p>
    <textarea rows="5" placeholder="每行输入一个过滤器..." style="width:100%;margin-top:6px;height: auto;" id="iqrpgbs_dropalyse_filter_textarea"></textarea>
    <p class="text-center" style="margin:6px;"><button id="iqrpgbs_dropalyse_but_update_filters">更新过滤器</button></p>
    <p>&nbsp;</p>

    <p class="heading">备份与恢复掉落</p>
    <p>您可以通过点击下面的按钮下载您的掉落数据副本...</p>
    <p class="text-center" style="margin:6px;"><button id="iqrpgbs_dropalyse_but_export">备份数据</button></p>
    <p>要恢复您的数据，请将备份文件的内容粘贴到下面的字段中并点击按钮</p>
    <textarea placeholder="" style="width:100%;margin-top:6px;" id="iqrpgbs_dropalyse_import_textarea"></textarea>
    <p class="text-center" style="margin:6px;"><button id="iqrpgbs_dropalyse_but_import">恢复数据</button></p>

    </div>

    </div></div></div>`;
    $(html).insertAfter($('div.game-grid > div:first > div.main-section').last());
    dropalyse_render_filters();

    // 设置格式选项和事件
    dropalyse_set_format(dropalyse_format); // 设置初始格式
    document.getElementById('iqrpgbs_dropalyse_opt_hour').addEventListener("click", function(e) { e.preventDefault(); dropalyse_set_format('hour'); });
    document.getElementById('iqrpgbs_dropalyse_opt_day').addEventListener("click", function(e) { e.preventDefault(); dropalyse_set_format('day'); });
    document.getElementById('iqrpgbs_dropalyse_opt_total').addEventListener("click", function(e) { e.preventDefault(); dropalyse_set_format('total'); });
    document.getElementById('iqrpgbs_dropalyse_reset').addEventListener("click", function(e) { e.preventDefault(); dropalyse_reset(); });
    document.getElementById('iqrpgbs_dropalyse_but_export').addEventListener("click", function(e) { e.preventDefault(); dropalyse_export_data(); });
    document.getElementById('iqrpgbs_dropalyse_but_import').addEventListener("click", function(e) { e.preventDefault(); dropalyse_import_data(); });
    $('a#iqrpgbs_dropalyse_backup_toggle').click(function(e){
        e.preventDefault();
        $("div#iqrpgbs_dropalyse_backup_panel").toggle();
        $('a#iqrpgbs_dropalyse_backup_toggle').toggleClass( "iqrpgbs_highlight" );
    });
    document.getElementById('iqrpgbs_drop_log_header').addEventListener("click", function(e) {
        e.preventDefault();
        $("div#iqrpgbs_drop_log_body").toggle();
        $("div#iqrpgbs_drop_log_header > p > span.grey-text").toggle();
    });
    document.getElementById('iqrpgbs_dropalyse_but_update_filters').addEventListener("click", function(e) { e.preventDefault(); dropalyse_update_filters(); });
}

function dropalyse_set_format(format) {
    $('a#iqrpgbs_dropalyse_opt_hour').removeClass("iqrpgbs_highlight");
    $('a#iqrpgbs_dropalyse_opt_day').removeClass("iqrpgbs_highlight");
    $('a#iqrpgbs_dropalyse_opt_total').removeClass("iqrpgbs_highlight");
    if(format==='hour') {
        dropalyse_format = 'hour';
        $('a#iqrpgbs_dropalyse_opt_hour').addClass("iqrpgbs_highlight");
        $('div#iqrpgbs_drop_log_header > p > span#iqrpgbs_drop_log_header_title').html('每小时掉落');
    } else if(format==='day') {
        dropalyse_format = 'day';
        $('a#iqrpgbs_dropalyse_opt_day').addClass("iqrpgbs_highlight");
        $('div#iqrpgbs_drop_log_header > p > span#iqrpgbs_drop_log_header_title').html('每天掉落');
    } else if(format==='total') {
        dropalyse_format = 'total';
        $('a#iqrpgbs_dropalyse_opt_total').addClass("iqrpgbs_highlight");
        $('div#iqrpgbs_drop_log_header > p > span#iqrpgbs_drop_log_header_title').html('掉落 - 总计');
    }
    dropalyse_render_content(); // 更新视图
}

// 删除我
/* function dropalyse_get_time_elapsed() {
    return ( Date.now() - dropalyse_start_datum )/1000;
} */

function dropalyse_render_nice_timer(delta) {
    //var delta = dropalyse_get_time_elapsed();
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    var seconds = delta % 60;
    let html = '';
    if(days>0) html += days + '天 ';
    if(hours>0||days>0) html += hours + '小时 ';
    if(hours>0||days>0||minutes>0) html += minutes + '分钟 ';
    html += Math.floor(seconds) + '秒';
    return html;
}

function dropalyse_render_filters() {
    //document.getElementById("iqrpgbs_dropalyse_filter_textarea").value = escapeHTML(dropalyse_filters.join("\r\n"));
    // 只要我们使用 .value = 'stuffs' 设置，就不需要转义
    document.getElementById("iqrpgbs_dropalyse_filter_textarea").value = dropalyse_filters.join("\r\n");
}

function dropalyse_update_filters() {
    let our_filters = document.getElementById("iqrpgbs_dropalyse_filter_textarea").value;
    dropalyse_filters = our_filters.trim().split(/\r?\n/).map(s => s.trim());
    dropalyse_save_ls(); // 保存到ls
    dropalyse_render_content(); // 重新渲染掉落
    // 隐藏面板 - 不隐藏？
    $("div#iqrpgbs_dropalyse_backup_panel").hide();
    $('a#iqrpgbs_dropalyse_backup_toggle').removeClass( "iqrpgbs_highlight" );
}

function dropalyse_import_data() {

    // 获取并测试空数据
    let our_data = document.getElementById("iqrpgbs_dropalyse_import_textarea").value;
    if(our_data=='') return false; // 空白数据
    // 捕获解析错误
    try {
        let backup = JSON.parse(our_data);
        // 让我们设置新值
        dropalyse_cache = ''; // 重置缓存为''，这样我们就可以在主循环中拉取新数据
        dropalyse_store = backup.dropalyse_store;
        if(backup.dropalyse_filters) dropalyse_filters = backup.dropalyse_filters;
        if(backup.dropalyse_actions) { // 如果有动作，使用它们
            actions = backup.dropalyse_actions;
        } else if(backup.dropalyse_start_datum) { // 从旧时间数据近似动作
            let start_datum = ( Date.now() - Number(backup.dropalyse_backup_datum)) + Number(backup.dropalyse_start_datum);
            actions = Math.floor((( Date.now() - start_datum ) / 1000) /6 );
        } else {
            actions = 0;
            console.log('掉落追踪器无法从备份中确定动作计数，将其重置为0作为备用方案！');
        }
        //dropalyse_start_datum = ( Date.now() - Number(backup.dropalyse_backup_datum)) + Number(backup.dropalyse_start_datum);
        // 全部完成，让我们重新渲染追踪器
        dropalyse_render_content();
        $("div#iqrpgbs_dropalyse_backup_panel").hide();
        $('a#iqrpgbs_dropalyse_backup_toggle').removeClass( "iqrpgbs_highlight" );
        document.getElementById("iqrpgbs_dropalyse_import_textarea").value = '';
    } catch(e) {
        alert("备份数据似乎不是有效的JSON！"); // 上述字符串出错（在这种情况下，是的）！
        return false;
    }

}

function dropalyse_export_data() {

    const backup = {
        dropalyse_cache: dropalyse_cache,
        dropalyse_store: dropalyse_store,
        dropalyse_actions: actions,
        dropalyse_filters: dropalyse_filters,
        dropalyse_version: GM_info.script.version,
        dropalyse_backup_datum: Date.now()
    };

    // 将对象转换为Blob
    const blobConfig = new Blob(
        [ JSON.stringify(backup) ],
        { type: 'text/json;charset=utf-8' }
    )

    // 将Blob转换为URL
    const blobUrl = URL.createObjectURL(blobConfig);

    // 创建带有blob URL的a元素
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.target = "_blank";
    anchor.download = "IQRPG-Stats-" + Date.now() + ".json";

    // 自动点击a元素，触发文件下载
    anchor.click();

    // 别忘了;)
    URL.revokeObjectURL(blobUrl);
}

// 掉落分析物品顺序
function dropalyse_objectOrder() {
    return {
        // 属性
        '生命值': 0, '攻击': 0, '防御':0, '准确度':0, '闪避':0,
        // 点数
        '点数':0, '绑定点数':0, '地牢探险代币#iqrpgstats#text-rarity-1':0,
        // 组件 + 收集碎片
        '武器组件#iqrpgstats#text-rarity-2': 0, '护甲组件#iqrpgstats#text-rarity-2': 0, '工具组件#iqrpgstats#text-rarity-2':0, '收集技能碎片#iqrpgstats#text-rarity-2':0,
        '资源宝箱#iqrpgstats#text-rarity-2': 0,
        '宝石碎片#iqrpgstats#text-rarity-2': 0,
        '饰品碎片#iqrpgstats#text-rarity-3': 0,
        '符文皮革#iqrpgstats#text-rarity-4':0,
        // 钥匙
        '哥布林洞穴钥匙#iqrpgstats#text-rarity-2': 0,
        '山口钥匙#iqrpgstats#text-rarity-2': 0,
        '荒凉墓穴钥匙#iqrpgstats#text-rarity-2':0,
        '龙族巢穴钥匙#iqrpgstats#text-rarity-2':0,
        '沉没废墟钥匙#iqrpgstats#text-rarity-2':0,
        '废弃塔钥匙#iqrpgstats#text-rarity-3':0,
        '闹鬼牢房钥匙#iqrpgstats#text-rarity-3':0,
        '龙之殿堂钥匙#iqrpgstats#text-rarity-3':0,
        '金库钥匙#iqrpgstats#text-rarity-4':0,
        '宝库钥匙#iqrpgstats#text-rarity-4':0,
        // 升级石
        '生命升级石#iqrpgstats#text-rarity-3': 0,
        '伤害升级石#iqrpgstats#text-rarity-4': 0,
        // 木材掉落 - 在炼金术中？
        // 石料掉落
        '砂岩#iqrpgstats#text-rarity-2': 0,
        '大理石#iqrpgstats#text-rarity-3': 0,
        '孔雀石#iqrpgstats#text-rarity-4':0,
        // 金属掉落
        '蓝宝石#iqrpgstats#text-rarity-2':0,
        '红宝石#iqrpgstats#text-rarity-3':0,
        '祖母绿#iqrpgstats#text-rarity-3':0,
        '钻石#iqrpgstats#text-rarity-4':0,
        // 炼金术材料
        '树汁#iqrpgstats#text-rarity-2': 0,
        '蜘蛛卵#iqrpgstats#text-rarity-2': 0,
        '骨粉#iqrpgstats#text-rarity-2': 0,
        '兽人之血小瓶#iqrpgstats#text-rarity-3': 0,
        '不死之心#iqrpgstats#text-rarity-3': 0,
        "鸟巢#iqrpgstats#text-rarity-3": 0,
        '炼金精华#iqrpgstats#text-rarity-3': 0,
        '金蛋#iqrpgstats#text-rarity-4': 0,
        '恶魔尘埃#iqrpgstats#text-rarity-4': 0,
        // 药水
        '训练收集药水#iqrpgstats#text-rarity-2':0,
        '训练经验药水#iqrpgstats#text-rarity-2':0,
        '次级收集药水#iqrpgstats#text-rarity-2':0,
        '次级经验药水#iqrpgstats#text-rarity-2':0,
        '急速药水#iqrpgstats#text-rarity-3':0,
        '次级自动药水#iqrpgstats#text-rarity-3':0,
        '天赋药水#iqrpgstats#text-rarity-3':0,
        '强效经验药水#iqrpgstats#text-rarity-3':0,
        '英雄药水#iqrpgstats#text-rarity-4':0,
        '超级经验药水#iqrpgstats#text-rarity-4':0,
        // 符文
        '训练符文1#iqrpgstats#text-rarity-2':0,
        '训练符文2#iqrpgstats#text-rarity-2':0,
        '训练符文3#iqrpgstats#text-rarity-2':0,
        '训练符文4#iqrpgstats#text-rarity-2':0,
        '战士符文#iqrpgstats#text-rarity-3':0,
        '角斗士符文#iqrpgstats#text-rarity-3':0,
        '军阀符文#iqrpgstats#text-rarity-4':0,
        '霸主符文#iqrpgstats#text-rarity-4':0,
        '大军阀符文#iqrpgstats#text-rarity-5':0,
        // 珠宝
        '蓝宝石珠宝#iqrpgstats#text-rarity-1':0,
        '蓝宝石珠宝#iqrpgstats#text-rarity-2':0,
        '蓝宝石珠宝#iqrpgstats#text-rarity-3':0,
        '蓝宝石珠宝#iqrpgstats#text-rarity-4':0,
        '蓝宝石珠宝#iqrpgstats#text-rarity-5':0,
        '蓝宝石珠宝#iqrpgstats#text-rarity-6':0,
        '红宝石珠宝#iqrpgstats#text-rarity-1':0,
        '红宝石珠宝#iqrpgstats#text-rarity-2':0,
        '红宝石珠宝#iqrpgstats#text-rarity-3':0,
        '红宝石珠宝#iqrpgstats#text-rarity-4':0,
        '红宝石珠宝#iqrpgstats#text-rarity-5':0,
        '红宝石珠宝#iqrpgstats#text-rarity-6':0,
        '祖母绿珠宝#iqrpgstats#text-rarity-1':0,
        '祖母绿珠宝#iqrpgstats#text-rarity-2':0,
        '祖母绿珠宝#iqrpgstats#text-rarity-3':0,
        '祖母绿珠宝#iqrpgstats#text-rarity-4':0,
        '祖母绿珠宝#iqrpgstats#text-rarity-5':0,
        '钻石珠宝#iqrpgstats#text-rarity-1':0,
        '钻石珠宝#iqrpgstats#text-rarity-2':0,
        '钻石珠宝#iqrpgstats#text-rarity-3':0,
        '钻石珠宝#iqrpgstats#text-rarity-4':0,
        '钻石珠宝#iqrpgstats#text-rarity-5':0,
        // 资源宝箱??
    }
}

///////////////////////////////////
// 战斗统计
///////////////////////////////////

function parse_player_stat_line(player_sl) {
    var hits = player_sl.find("p:nth-child(1) > span:nth-child(2)");
    if(hits.length > 0) {
        var actual_hits = hits.prop('innerHTML').replaceAll(" time(s)", "");
        player_stats.hits += parseInt(actual_hits);
    }
    var dmg = player_sl.find("p:nth-child(1) > span:nth-child(3)");
    if(dmg.length > 0 && hits.length > 0) {
        var actual_dmg = dmg.prop('innerHTML').replaceAll(" damage", "").replaceAll(",", "");
        player_stats.dmg += parseInt(actual_dmg) * parseInt(actual_hits);
    }
    var misses = player_sl.find("p:nth-child(2) > span:nth-child(1)");
    if(misses.length > 0) {
        var actual_misses = misses.prop('innerHTML').replaceAll(" time(s)", "");
        player_stats.misses += parseInt(actual_misses);
    }
}

function parse_enemy_stat_line(stat_line) {
    var hits = stat_line.find("p:nth-child(1) > span:nth-child(2)");
    if(hits.length > 0) {
        var actual_hits = hits.prop('innerHTML').replaceAll(" time(s)", "");
        enemy_stats.hits += parseInt(actual_hits);
    }
    var dmg = stat_line.find("p:nth-child(1) > span:nth-child(3)");
    if(dmg.length > 0 && hits.length > 0) {
        var actual_dmg = dmg.prop('innerHTML').replaceAll(" damage", "").replaceAll(",", "");
        enemy_stats.dmg += parseInt(actual_dmg) * parseInt(actual_hits);
    }
    var misses = stat_line.find("p:nth-child(2) > span:nth-child(2)");
    if(misses.length > 0) {
        var actual_misses = misses.prop('innerHTML').replaceAll(" time(s)", "");
        enemy_stats.misses += parseInt(actual_misses);
    }
    var dodges = stat_line.find("p:nth-child(2) > span:nth-child(3)");
    if(dodges.length > 0) {
        var actual_dodges = dodges.prop('innerHTML').replaceAll(" attack(s)", "");
        enemy_stats.dodges += parseInt(actual_dodges);
    }
}

function iqrpg_bs_reset_stats(e) {
    e.preventDefault();
    player_stats.dmg = 0;
    player_stats.hits = 0;
    player_stats.misses = 0;
    player_stats.hp_perc = 100;
    enemy_stats.dmg = 0;
    enemy_stats.hits = 0;
    enemy_stats.misses = 0;
    enemy_stats.dodges = 0;
    update_display();
}

function update_display() {
    // 玩家
    $("#iqrpgbs_pl_dmg").html(new Intl.NumberFormat().format(player_stats.dmg));
    $("#iqrpgbs_pl_hits").html(new Intl.NumberFormat().format(player_stats.hits));
    var avg = Math.round(player_stats.dmg / player_stats.hits) || 0;
    $("#iqrpgbs_pl_avg").html(new Intl.NumberFormat().format(avg));
    var acc = (player_stats.hits / (player_stats.hits + player_stats.misses))*100 || 0;
    $("#iqrpgbs_pl_acc").html(new Intl.NumberFormat().format(acc.toFixed(2)));
    let min_hp = player_stats.hp_perc || 0;
    $("#iqrpgbs_min_hp").html(new Intl.NumberFormat().format(min_hp));

    // 敌人
    var enemy_avg = Math.round(enemy_stats.dmg / enemy_stats.hits) || 0;
    $("#iqrpgbs_enmy_avg").html(new Intl.NumberFormat().format(enemy_avg));
    var enemy_acc = ( (enemy_stats.hits + enemy_stats.dodges) / (enemy_stats.hits + enemy_stats.misses + enemy_stats.dodges))*100 || 0;
    $("#iqrpgbs_enmy_acc").html(new Intl.NumberFormat().format(enemy_acc.toFixed(2)));
    var enemy_dodges = (enemy_stats.dodges / (enemy_stats.hits /*+ enemy_stats.misses*/ + enemy_stats.dodges))*100 || 0;
    $("#iqrpgbs_enmy_dodges").html(new Intl.NumberFormat().format(enemy_dodges.toFixed(2)));

    // 额外功能
    if(track_extra_battle_stats===true) {
        // 击杀所需命中次数
        let hits_to_kill_enemy = (enemy_stats.max_hp / avg);
        let attk_next_breakpoint = enemy_stats.max_hp / (Math.ceil(hits_to_kill_enemy)-1)
        let p_dmg_delta = attk_next_breakpoint - avg + 1;
        $("#iqrpgbs_attk_delta").html("您用 " + Number(Math.ceil(hits_to_kill_enemy)).toString() + " 次命中击杀"
                                      + "，要提高胜率需将平均伤害提高 " + Intl.NumberFormat().format(Math.ceil(p_dmg_delta)) );

        // 生存更久
        let hits_to_die = Math.ceil(player_stats.max_hp / enemy_avg);
        let p_def_delta = enemy_avg - Math.ceil(player_stats.max_hp / (hits_to_die+0.0000001) );
        $("#iqrpgbs_def_delta").html("您会在 " + Number(hits_to_die).toString() + " 次命中后死亡"
                                     + "，要提高胜率需将平均承受伤害降低 " + Intl.NumberFormat().format(p_def_delta) );
    }
}

function render_battle_stats_panel() {
    var content = `
<div id="iqrpgbs_bs_panel" class="margin-top-large">
<div>战斗统计 <span>作者：Coastis</span></div>
<div>您共造成了 <span id="iqrpgbs_pl_dmg">0</span> 点伤害，命中了 <span id="iqrpgbs_pl_hits">0</span> 次，
平均每次命中 <span id="iqrpgbs_pl_avg">0</span> 点，命中率 <span id="iqrpgbs_pl_acc">0</span>%</div>
<div>敌人平均每次命中 <span id="iqrpgbs_enmy_avg">0</span> 点，
命中率 <span id="iqrpgbs_enmy_acc">0</span>%，您闪避了 <span id="iqrpgbs_enmy_dodges">0</span>% 的攻击</div>
`;
    if(track_min_health_perc === true) content += '<div>您的生命值最低达到 <span id="iqrpgbs_min_hp">100</span>%</div>';

    if(track_extra_battle_stats === true) {
        content += '<div><span id="iqrpgbs_attk_delta"></span></div>'
            + '<div><span id="iqrpgbs_def_delta"></span></div>';
    }

    content += '<div>[<a href="#" id="igrpg_bs_reset">重置战斗统计</a>]</div>';
    content += '</div>';
    return content;
}

GM_addStyle ( `
    div#iqrpgbs_bs_panel div { text-align:center;padding:1px;}
    div#iqrpgbs_bs_panel div:nth-child(1) { font-weight:bold;}
    div#iqrpgbs_bs_panel div:nth-child(1) span { font-size:8px;font-weight:normal;}
    div#iqrpgbs_drop_log_header {display: flex; justify-content: center; align-items: center; padding: .5rem; background: linear-gradient(#000,#151515);}
div#iqrpgbs_dropalyse_timer { padding:2px; margin-top:4px; text-align:center; }
.iqrpgbs_dropalyse_spacing { padding:2px; margin-top:4px; text-align:center; }
div#iqrpgbs_dropalyse_options { padding:2px; text-align:center; }
.iqrpgbs_highlight { color:#3c3 !important; }
div.iqrpgbs_hover_highlight:hover { background-color:#222222; }
` );