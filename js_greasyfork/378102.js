// ==UserScript==
// @name         Kekeke Dice Bot
// @namespace    https://greasyfork.org
// @version      1.2.1
// @description  在kekeke跑團用的骰子BOT，支援COC、NC、四則運算規則，以及下載跑團紀錄
// @author       Pixmi
// @icon         http://www.google.com/s2/favicons?domain=https://kekeke.cc/
// @include      https://kekeke.cc/*
// @include      https://www.kekeke.cc/*
// @license      MIT
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/378102/Kekeke%20Dice%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/378102/Kekeke%20Dice%20Bot.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

$(window).on('load',function () {
    'use strict';
    var config;

    // 檢查Local Storage的kekeke_dice_config是否存在
    if (localStorage.getItem('kekeke_dice_config') === null) {
        // 對config做初次設定
        config = {
            Bot_Name: 'BOT',
            Auto_Time: 5,
            Auto_Time_Check: true,
            Auto_Logs: false,
            Logs_Time: false,
            Download_Time: '1'
        };
        localStorage.setItem('kekeke_dice_config', JSON.stringify(config));
    } else {
        // 舊版本升級新版本時，預防Local Storage出錯的檢查與設定
        config = JSON.parse(localStorage.getItem('kekeke_dice_config'));
        if (config.Auto_Time === undefined) { config.Auto_Time = 5; }
        if (config.Auto_Time_Check === undefined) { config.Auto_Time_Check = true; }
        if (config.Auto_Logs === undefined) { config.Auto_Logs = false; }
        if (config.Logs_Time === undefined) { config.Logs_Time = false; }
        if (config.Logs_Clear === undefined) { config.Logs_Clear = true; }
        if (config.Download_Time === undefined || config.Download_Time == '0') { config.Download_Time = '1'; }
        localStorage.setItem('kekeke_dice_config', JSON.stringify(config));
    }

    // 發言時間限制
    setInterval(function(){
        config = JSON.parse(localStorage.getItem('kekeke_dice_config'));
        config.Auto_Time_Check = true;
        localStorage.setItem('kekeke_dice_config', JSON.stringify(config));
    },config.Auto_Time*1000+1);

    setTimeout(function () {
        // 給部分物件加上ID
        $('table.SquareCssResource-chatRoom > tbody > tr:last').find('table').attr('id', 'ChatTable');
        $('td.SquareCssResource-submitInputButton').find('button').attr('id','submit_btn');
        // 增加dice bot設定的按鈕
        $('<td><div style="padding: 0 1px;"><img id="DiceConfig" src=" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAD9AAAA/QBJxjN1gAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAS4SURBVHic7ZtPTFRHHMc/83i7FHYFq64RhAQRaAQE8SLx0ANJa/rHtqFgUguKkZrWxHpo06Q3br303DaNFQNJG1dDa7S3pkn/xHiiIq1plD8aKBAFIQoL7L/pAdgm6ltmcXgOdT+X3cz8fjO/+b55s9+XvIU0adI8y4iVJra0fFdkRz3HpeB1kFuA5zXWpcIkiDEhuRS1I1+cOfPOrZUMsiIBjjYFTwohPpOQtZJ83UjBjEB8+E1Hw+lUc1MWoLX53EcSPgfIqymk6MUyfBv92FmeVId6IqKzEWbGpxn85QZjPUMAUiKOn+5s+CqVcVISoLX5/KsSeVEIrIr63RTUFqeSvmoMXRngelc3UhKVwnrldMfbP6nmWqqB7x0+XyGRZwGrdF+FMYsHKKwtpnRfBYAt4vHvj7wbLFfNVRLgWGMwNx6nC/Dn1RSyrW7HCktdPbbV7SCvphAEfssSXccag7kqecveAm1tbdZQf/kPIPY/eZluIi8Wbr/+VltbWzxZ1LI7YHig/JO1t3gAsX+4v/zTZaOSdbYeCjZIKc4Cll2cj7eyhIwNOZDp1VamVubDxO7dJ9zbR3RwBCAuBPWnOhovOKU4CnDkSDBgRUUfkJO5twrvzpJVqHj1CPfcZP5KL8C9iMgo6+ion3hcnOMtICLiBJBjF+evucUDeKtLsYvyADZ4iZ1winMWQPAmgLdy7S1+iaULJyVvOMUkOwSLAazAer1VuYgVSDyeOF7FZAL4AYRtayzJXYQnUfs6pxhlJ/h/xejLK6dDzF2+Rmx04QC3t2zEW1uJlevXNoexAsjpEDPnf0bOhxNtkVsjREfHyW6sw/Jla5nHWAHmLl9Dzoep2pXHweZdSAnfdv5Bb88Y85d7yXppj5Z5jD0DYsN3AGhqqWFTwEdgs4+mw7sX+v65o20eYwWQi59C/GdWhfVQpwaMFcDeGgCgs72bqclZJidn6WzvBiCjYLO+ebSNpJnMPZXERie4dnWUj0/+mGgXmV4y9+7UNo+xO8Bavw5fQx32tnyEx0Z4PdjF+Vp/AcDgHQAg/NlkvVy7qnMYuwPc4qnsADccniquC+CWw1PFdQHccniquH4GuOXwVHFdALccniquC+CWw1Oux+0J3XJ4qri+A9xyeKo8FR/ghsNTJe0EdQ5mksNTRZsApjk8VbQJYJrDU0XbGWCaw1NFmwCmOTxVtAlgmsNTRdsZYJrDU0XbDjDN4ami1QeY5PBUeeadYFqAVIJDF38ldOm3NdW2HMnOgGnAL6PRxFsisZHxR4JMbpOR6NLXB48EL5JMgAGgKn53ilCun5sj45Qudvz+50AiqNrAtu6+Ycq2BsiavL/U1ff4JSYRQEouCEFVuOcGt18oIjQXZibHz8O2zsS20FyYwbEJtv89mFiL0zqVXpSc2l7A7S2bnEKNpGhsgtz+IYCpiMgocXpRMsNpgKtXz4V2Vx/oBxqem7wvsmfniHo9RDw2iBX/02ZVEfE4vgchCgZHyF14AJMCmto7G7odc5Yb9Oih4EGk+BrwaazVDaaFkK2nOg6cTRakdCnfb+7aHJaxDxDyNYGoAEz1tiGJ/EvApbjNl+3tB+4+7YLSpEmTJo3J/AskbixTjeLTxgAAAABJRU5ErkJggg==" style="cursor: pointer;" title="開啟Kekeke Dice設定選項"></div></td>').insertBefore($('.SquareCssResource-submitInputButton'));
        Observer();
    }, 1500);

    const observeConfig = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
    };

    const dd_check = /^([1-9][0-9]?)[d]([1-9][0-9]{0,2})([\+\-\*\/])?([1-9][0-9]{0,1})?([?])?/i,
        cc_check = /^cc\(?([0-9]{1,2})\)?(([\+\-])([1-9]))?/i,
        na_check = /^1na([\+\-\*\/])?([1-9][0-9]*)?/i,
        nc_check = /^([1-9][0-9]?)[n][c]([\+\-\*\/])?([1-9][0-9]{0,1})?/i;

    const url = /<a class="GlobalCssResource-external" target="_blank" ref="noopener" href="((http|https)(:\/\/)[\w\+\-\*\/\.\&\:\(\)\<\>\?\=]*)">((http|https)(:\/\/)[\w\+\-\*\/\.\&\:\(\)\<\>\?\=]*)<\/a>/ig,
        emoji = /<img class="GlobalCssResource-smiley" src="\/com\.liquable\.hiroba\/emoji\/[\w]*\/[\w\+\-\*\/\^\.\&\:\(\)\<\>]*.[a-z]*" alt="([\w\+\-\*\/\^\.\&\:\(\)\<\>\@]*)">/ig,
        br = /<br>/ig;

    // 檢查名稱是否與BOT名稱一致
    function BotNameCheck() {
        let name = $('.gwt-TextBox.SquareCssResource-nicknameField').val(),
            config = JSON.parse(localStorage.getItem('kekeke_dice_config'));
        if (config.Bot_Name == name) 
            return true;
        return false;
    }

    // 日期+時間函數
    function getDateTimes(get,mode) {
        let text = '';
        if (get) {
            let time = new Date(),
                year = time.getFullYear(),
                month = (time.getMonth() < 10 ? "0" : "") + time.getMonth()+1,
                day = (time.getDate() < 10 ? "0" : "") + time.getDate(),
                hours = (time.getHours() < 10 ? "0" : "") + time.getHours(),
                minutes = (time.getMinutes() < 10 ? "0" : "") + time.getMinutes(),
                seconds = (time.getSeconds() < 10 ? "0" : "") + time.getSeconds();
            if (mode === 'logs') {
                text = hours + ':' + minutes + ':' + seconds + " - ";
            }
            if (mode === 'files') {
                text = year + month + day + '-' + hours + minutes + seconds;
            }
        }
        return text;
    }

    // 擲骰
    function getRandom(e) {
        return Math.floor(Math.random()*e+1);
    }

    // 四則運算
    function Arithmetics(symbols,value,count) {
        let x = [];
        if (symbols === '+') {
            value.forEach(function(item,index){
                x.push(value[index] + count);
            });
        }
        if (symbols === '-') {
            value.forEach(function(item,index){
                if (value[index] - count <= 0) {
                    x.push(1);
                } else {
                    x.push(value[index] - count);
                }
            });
        }
        if (symbols === '*') {
            value.forEach(function(item,index){
                x.push(value[index] * count);
            });
        }
        if (symbols === '/') {
            value.forEach(function(item,index){
                x.push(Math.ceil(value[index] / count));
            });
        }
        return x;
    }

    // 陣列中取最大值
    Array.prototype.max = function (){
        let max = this[0];
        this.forEach (function(ele,index,arr){
            if(ele > max) { max = ele; }
        });
        return max;
    };
    // 陣列中取最小值
    Array.prototype.min = function (){
        let min = this[0];
        this.forEach (function(ele,index,arr){
            if(ele < min) { min = ele; }
        });
        return min;
    };
    /* Array.prototype的參考資料
    * https://gist.github.com/hoandang/5989980 */

    // 回應function
    function DiceRespond(content) {
        config = JSON.parse(localStorage.getItem('kekeke_dice_config'));
        // 輸入框放入BOT內容
        $('textarea.SquareCssResource-messageInputField').val(content);
        // 點擊發送按鈕送出訊息
        document.getElementById("submit_btn").click();
        // 發文時間檢查設為false
        config.Auto_Time_Check = false;
        // 儲存config
        localStorage.setItem('kekeke_dice_config', JSON.stringify(config));
    }

    // 安排時間紀錄選項的選取值
    function check_download_time(v,t) {                             
        if (v == t)
            return true;
        return false;
    }

    function Observer() {
        // 建立rootObserver監控
        let rootObserver = new MutationObserver(function (mutations) {
            // 設定要監控的元素
            let chatElement = document.body.querySelector('table#ChatTable');
            // 確認chatElement已經生成
            if (chatElement) {
                // 結束rootObserver監控
                rootObserver.disconnect();
                const title = document.title.split(' | ')[0];
                console.log(`Kekeke Dice 1.2.1 已在 ${title} 啟動。`);

                // 清空kekeke_logs紀錄
                if (config.Auto_Logs) {
                    localStorage.setItem(`logs_${title}`, JSON.stringify([]));
                }

                // 檢查自動下載
                if (BotNameCheck() && config.Download_Time !== '0' && config.Auto_Logs) {
                    let s = config.Download_Time*60*60*1000;
                    if (s < 5000 || s === null) { s = 60*60*1000; } // 避免local storage發生問題時(例如NaN、0值)造成瀏覽器崩潰
                    setInterval(function(){
                        console.save(JSON.parse(localStorage.getItem(`logs_${title}`)), `logs_${title}` + '_' + getDateTimes(true,'files') + '.log');
                        // 清空紀錄
                        localStorage.setItem(`logs_${title}`, JSON.stringify([]));
                    },s);
                }             

                // 建立chatObserver監控聊天頻道
                let chatObserver = new MutationObserver(function (mutations) {
                    mutations.forEach(function (mutation) {
                        // 有新的發言近來
                        if (mutation.type == 'childList' && mutation.addedNodes.length >= 1 && mutation.addedNodes[0].nodeName === 'DIV') {
                            if (mutation.addedNodes[0].classList.contains('SquareCssResource-chatContent') && BotNameCheck()) {
                                let config = JSON.parse(localStorage.getItem('kekeke_dice_config')),
                                    Post_Name = $(mutation.addedNodes[0]).find('.GlobalCssResource-colorNickname'),
                                    Post_Content = $(mutation.addedNodes[0]).find('.SquareCssResource-message'),
                                    Message = Post_Content.text().split(' @ '),
                                    content;
                                // 確認是否為DND骰
                                if (dd_check.test(Message[0])) {
                                    // 拆解骰子細節並分配變數
                                    let match = dd_check.exec(Message[0]),
                                        unit = Number(match[1]),
                                        flat = Number(match[2]),
                                        symbols = typeof match[3] !== 'undefined' ? true : false,
                                        count = typeof match[4] !== 'undefined' ? Number(match[4]) : 0,
                                        sum = typeof match[5] !== 'undefined' ? true : false,
                                        value = [];
                                    // 擲骰
                                    for (let i = 1; i <= unit; i++) {
                                        value.push(getRandom(flat));
                                    }
                                    let sum_value = [value.reduce((a,b)=>a+b)],
                                        sum_result = Arithmetics(match[3],sum_value,count),
                                        result = Arithmetics(match[3],value,count);
                                    if (sum && symbols) {
                                        content = `[${Post_Name.text()}] 的 ${match[0]} 骰出了 [${value}](加總) ${match[3]} ${count} = [${sum_value}] ${match[3]} ${count} = ${sum_result}`;
                                    } else if (sum && !symbols) {
                                        content = `[${Post_Name.text()}] 的 ${match[0]} 骰出了 [${value}](加總) = ${sum_value}`;
                                    } else if (!sum && symbols) {
                                        content = `[${Post_Name.text()}] 的 ${match[0]} 骰出了 [${value}] ${match[3]} ${count} = [${result}]`;
                                    } else {
                                        content = `[${Post_Name.text()}] 的 ${match[0]} 骰出了 [${value}]`;
                                    }
                                }
                                // 確認是否為COC骰
                                if (cc_check.test(Message[0])) {
                                    let match = cc_check.exec(Message[0]),
                                        // 比對值
                                        flat = match[1] === '00' ? 100 : Number(match[1]),
                                        // 是否有獎勵或懲罰骰
                                        symbols = typeof match[3] !== 'undefined' ? true : false,
                                        // 獎勵或懲罰的追加數量
                                        count = typeof match[4] !== 'undefined' ? Number(match[4]) : 0,
                                        // 要骰的總數
                                        unit = (symbols) ? count + 1 : 1,
                                        // 十位數
                                        first_value = [],
                                        // 個位數
                                        last_value = getRandom(10);
                                    // 擲骰十位數
                                    for (let i = 1; i <= unit; i++) {
                                        // -1讓十位數骰出結果為0-9
                                        first_value.push(getRandom(10)-1);
                                    }
                                    // 確認是懲罰(取最大數)或獎勵(取最小數)當十位數
                                    let value = (match[3] === '-') ? first_value.max() : first_value.min(),
                                        result = (symbols) ? value*10 + last_value : getRandom(100),
                                        judge = '';
                                    if (result > flat) { // 失敗
                                        judge = '失敗';
                                        if (flat > 50 && result == 100) { judge = '大失敗'; }
                                        if (flat <= 50 && result >= 96) { judge = '大失敗'; }
                                    } else { // 成功
                                        judge = '成功';
                                        if (result <= Math.floor(flat*0.5)) { judge = '困難成功'; }
                                        if (result <= Math.floor(flat*0.2)) { judge = '極難成功'; }
                                        if (result == 1) { judge = '大成功'; }
                                    }
                                    if (symbols) {
                                        let bonus = (match[3] === '-') ? '大' : '小';
                                        content = `[${Post_Name.text()}] 的 CC${flat} 骰出了 [${first_value}](取最${bonus}x10) + [${last_value}] = ${result}，判定為 [${judge}]`;
                                    } else {
                                        content = `[${Post_Name.text()}] 的 CC${flat} 骰出了 [${result}]，判定為 [${judge}]`;
                                    }
                                }
                                // 確認是否為NA骰
                                if (na_check.test(Message[0])) {
                                    let array = ['','大失敗','失敗','失敗','失敗','失敗','對方隨意選擇','腳','身體','手','頭','己方隨意選擇'],
                                        match = na_check.exec(Message[0]),
                                        symbols = typeof match[1] !== 'undefined' ? true : false,
                                        count = typeof match[2] !== 'undefined' ? Number(match[2]) : 0,
                                        value = [getRandom(10)],
                                        result = symbols ? Arithmetics(match[1],value,count) : value,
                                        judge = result > 10 ? array[11] : array[result];
                                    if (symbols) {
                                        content = `[${Post_Name.text()}] 的 ${match[0]} 骰出了 [${value}] ${match[1]} ${count} = [${result}] 判定為 [${judge}]`;
                                    } else {
                                        content = `[${Post_Name.text()}] 的 ${match[0]} 骰出了 [${value}] 判定為 [${judge}]`;
                                    }
                                }
                                // 確認是否為NC骰
                                if (nc_check.test(Message[0])) {
                                    // 拆解骰子細節並分配變數
                                    let match = nc_check.exec(Message[0]),
                                        unit = Number(match[1]),
                                        symbols = typeof match[2] !== 'undefined' ? true : false,
                                        count = typeof match[3] !== 'undefined' ? Number(match[3]) : 0,
                                        value = [];
                                    // 擲骰
                                    for (let i = 1; i <= unit; i++) {
                                        value.push(getRandom(10));
                                    }
                                    let result = symbols ? Arithmetics(match[2],value,count) : value,
                                        judge;
                                    if (result.max() >= 6 ) { judge = '成功'; }
                                    if (result.max() > 10 ) { judge = '大成功'; }
                                    if (result.min() > 1 && result.max() <= 5 ) { judge = '失敗'; }
                                    if (result.min() == 1 && result.max() <= 5 ) { judge = '大失敗'; }
                                    if (symbols) {
                                        content = `[${Post_Name.text()}] 的 ${match[0]} 骰出了 [${value}] ${match[2]} ${count} = [${result}] 判定為 [${judge}]`;
                                    } else {
                                        content = `[${Post_Name.text()}] 的 ${match[0]} 骰出了 [${value}] 判定為 [${judge}]`;
                                    }
                                }
                                if (content !== '' && config.Auto_Time_Check) { DiceRespond(content); }
                                // 將聊天紀錄輸出到console.log
                                if (config.Auto_Logs) {
                                    let arr = JSON.parse(localStorage.getItem(`logs_${title}`)),
                                        // 設置去除表情符號html與超連結html的regex
                                        text = Post_Content.html().split('<span class="SquareCssResource-chatDate">'),
                                        // 刪去掉無用的html，保留表情符號的alt與超連結的href
                                        logs_content = text[0].replace(url,'$1').replace(emoji,'$1').replace(br,' '),
                                        // 設定時間戳記
                                        time = getDateTimes(config.Logs_Time,'logs');
                                    // 略過空白的對話內容
                                    if (logs_content !== '') {
                                        arr.push(time + Post_Name.text() + ' : ' + logs_content);
                                        localStorage.setItem(`logs_${title}`, JSON.stringify(arr));
                                    }
                                }
                            }
                        }
                    });
                });
                chatObserver.observe(chatElement, observeConfig);

                // 進階設定
                $('#DiceConfig').click(function () {
                    $(this).toggleClass('init');
                    if ($(this).hasClass('init')) {
                        config = JSON.parse(localStorage.getItem('kekeke_dice_config'));
                        $(this).parent().css('position', 'relative');
                        $('<div id="DiceConfig_panel"></div>').css({'background-color':'#fff','border':'1px solid #bbb','color':'#000','width':'300px','padding':'5px','position':'absolute','top':'30px','z-index':'999'}).insertAfter('#DiceConfig');
                        $('<table></table>').css({'width':'100%','table-layout':'fixed'}).appendTo('#DiceConfig_panel');
                        $('<tr><td style="width:65px">BOT名稱</td><td><input type="text" id="cb_Dice_Name" style="width:100%"></td></tr>').appendTo('#DiceConfig_panel > table');
                        $('<tr><td></td><td>(暱稱與此項相同才啟用BOT功能)</td></tr>').appendTo('#DiceConfig_panel > table');
                        $('<tr><td>自動記錄</td><td><label><input type="checkbox" id="cb_Auto_Logs" checked="checked">啟用自動紀錄</label></td></tr>').appendTo('#DiceConfig_panel > table');
                        $('<tr><td></td><td><label><input type="checkbox" id="cb_Logs_Time" checked="checked">加入時間戳記</label></td></tr>').appendTo('#DiceConfig_panel > table');
                        $('<tr><td>下載紀錄</td><td><select id="cb_Download_Time" style="width:100%"></select></td></tr>').appendTo('#DiceConfig_panel > table');
                        $('<option></option>').attr({'value':'0','selected':check_download_time(0,config.Download_Time)}).text('手動').appendTo('#cb_Download_Time');
                        $('<option></option>').attr({'value':'1','selected':check_download_time(1,config.Download_Time)}).text('每1小時').appendTo('#cb_Download_Time');
                        $('<option></option>').attr({'value':'2','selected':check_download_time(2,config.Download_Time)}).text('每2小時').appendTo('#cb_Download_Time');
                        $('<option></option>').attr({'value':'4','selected':check_download_time(4,config.Download_Time)}).text('每4小時').appendTo('#cb_Download_Time');
                        $('<option></option>').attr({'value':'6','selected':check_download_time(6,config.Download_Time)}).text('每6小時').appendTo('#cb_Download_Time');
                        $('<div></div>').css({'padding-top':'3px'}).appendTo('#DiceConfig_panel');
                        $('<button></button>').attr({'id':'save_dice_config','type':'button','title':'儲存後將自動重新整理'}).addClass('button_setting').text('儲存設定').appendTo('#DiceConfig_panel > div');
                        $('<button></button>').attr({'id':'save_logs','type':'button'}).addClass('button_setting').text('下載對話紀錄').appendTo('#DiceConfig_panel > div');
                        $('.button_setting').css({'height':'20px','float':'right','margin':'0 2px','padding':'0','font-size':'10px','box-sizing':'border-box'});
                        // 開啟面板時設定狀態
                        $('#cb_Dice_Name').val(config.Bot_Name);
                        if (BotNameCheck(name)) {
                            $('#cb_Auto_Logs').attr('disabled',false);
                            $('#cb_Logs_Time').attr('disabled',false);
                            $('#cb_Download_Time').attr({'disabled':false});
                        } else {
                            $('#cb_Auto_Logs').attr({'disabled':true});
                            $('#cb_Logs_Time').attr({'disabled':true});
                            $('#cb_Download_Time').attr({'disabled':true});
                        }
                        if (!config.Auto_Logs) $('#cb_Auto_Logs').attr('checked',false);
                        if (!config.Logs_Time) $('#cb_Logs_Time').attr('checked',false);
                        $('#cb_Dice_Name').on('change', function () {
                            config.Bot_Name = $('#cb_Dice_Name').val();
                            localStorage.setItem('kekeke_dice_config', JSON.stringify(config));
                            if (BotNameCheck(name)) {
                                $('#cb_Auto_Logs').attr('disabled',false);
                                $('#cb_Logs_Time').attr('disabled',false);
                                $('#cb_Download_Time').attr({'disabled':false});
                            } else {
                                $('#cb_Auto_Logs').attr({'disabled':true});
                                $('#cb_Logs_Time').attr({'disabled':true});
                                $('#cb_Download_Time').attr({'disabled':true});
                            }
                        });
                        $('#cb_Download_Time').on('change', function () {
                            config.Download_Time = $('#cb_Download_Time').val();
                        });
                        $('#cb_Auto_Logs').on('change', function () {
                            if (this.checked) { config.Auto_Logs = true; } else { config.Auto_Logs = false; }
                        });
                        $('#cb_Logs_Time').on('change', function () {
                            if (this.checked) { config.Logs_Time = true; } else { config.Logs_Time = false; }
                        });
                        $('#save_logs').click(function () {
                            console.save(JSON.parse(localStorage.getItem(`logs_${title}`)), `logs_${title}` + '_' + getDateTimes(true,'files') + '.log');
                            // 清空紀錄
                            localStorage.setItem(`logs_${title}`, JSON.stringify([]));
                        });
                        $('#save_dice_config').click(function () {
                            localStorage.setItem('kekeke_dice_config', JSON.stringify(config));
                            $('#DiceConfig').removeClass('init');
                            $('#DiceConfig_panel').remove();
                            location.reload();
                        });
                    } else {
                        $('#DiceConfig_panel').remove();
                    }
                });
            }
        });
        rootObserver.observe(document, observeConfig);
    }

    // 下載對話紀錄
    (function(console){
        console.save = function(data, filename){
            if(!data) {
                console.error('沒有保存任何對話紀錄');
                return;
            }
            if(!filename) filename = 'autosave.log';
            if(typeof data === "object"){
                data = JSON.stringify(data, undefined, 4);
            }
            let blob = new Blob([data], {type: 'text/json'}),
                e    = document.createEvent('MouseEvents'),
                a    = document.createElement('a');
            a.download = filename;
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':');
            e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
        };
    })(console);
    /* console.save的參考資料
    * https://bgrins.github.io/devtools-snippets/#console-save */
});