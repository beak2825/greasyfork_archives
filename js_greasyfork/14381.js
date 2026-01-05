// ==UserScript==
// @name           HaloTracker中文化
// @namespace      http://snake570.pixnet.net
// @description    HaloTracker 網站中文化
// @include        http://halotracker.com/*
// @include		   http://thetrackernetwork.com/*
// @copyright      JoeSimmons(code), Wu Ting Yu(translate)
// @version        v151202
// @license        http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/14381/HaloTracker%E4%B8%AD%E6%96%87%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/14381/HaloTracker%E4%B8%AD%E6%96%87%E5%8C%96.meta.js
// ==/UserScript==
(function () {
    'use strict';


    /*
        NOTE: 
            You can use \\* to match actual asterisks instead of using it as a wildcard!
            The examples below show a wildcard in use and a regular asterisk replacement.
    */

    var words = {
    ///////////////////////////////////////////////////////


        // Syntax: 'Search word' : 'Replace word',
		///////////////
		//REGISTER//
		'Quick CSR Lookup' : '快速查詢 CSR',
		'Arena Weapons' : '競技場武器',
		'Remember Me' : '記住我',
		'Can\'t sign in\?' : '無法登入嗎？',
		'Forgot Password\?' : '忘記密碼？',
		'Forgot Username\?' : '忘記帳號',
		//////////////
		/////////////
		////////////
		//
		'Arena Detailed' : '競技場詳細紀錄',
		'Arena Playlists' : '競技場遊戲清單',
		'Arena Stats' : '競技場紀錄',
		'Mode Filter' : '選擇遊戲類型',
		'Campaign' : '戰役',
		'Custom Games' : ' 自訂遊戲',
		'HTR Score Leaderboard' : 'HTR 分數排行榜',
		'Minimum 0 Games' : '最少0場遊戲',
		'View Leaderboards' : '檢視排行榜',
		'Enter Gamertag' : '輸入玩家卡ID',
		'Gamertag' : '玩家卡ID',
		'Comma seperated list for multiple results' : '使用半形逗號分隔ID即可搜尋多個結果',
		'Gamer' : '玩家',
		'Score' : '分數',
		'Halo 5 Stats are Live\!' : '查詢你的服役紀錄！',
		'Register or Login to chat\!' : '請先註冊或登入來進行交談',
		'Login or Register' : '登入 / 註冊',
		'Login' : '登入',
		'Sign in' : '登入',
		'Register' : '註冊',
		'Top 10 Leaderboards' : '排行榜前10名',
		'Team Arena on' : '《團隊競技場》於',
		'Team Arena' : '團隊競技場',
		'FFA' : '自由對戰',
		'Arena' : '競技場',
		'War Zone' : '一級戰區',
		'Warzone' : '一級戰區',
		'Playlist Leaderboards' : '遊戲清單排行榜',
		'Join Regional Leaderboards' : '加入國家排行榜',
        'Leaderboards' : '排行榜',
		'CSR Look UP' : '查詢CSR',
		'Search' : '搜尋',
		'Find Player' : '搜尋玩家',
		'Choose a Leaderboard' : '選擇一個排行榜',
		'Select Leaderboard' : '依據：',
		'Overall' : '整體',
		'Filters' : '過濾',
		'Select Country' : '選擇國籍',
		'Country' : '國籍',
		'Select State' : '選擇區域',
		'State' : '區域',
		'Select City' : '選擇城市',
		'City' : '城市',
        'News' : '最新資訊',
		'My Stats' : '我的服役紀錄',
		'General' : '一般資訊',
		'Overview' : '總覽',
		'Game Viewer' : '最近的遊戲',
		'Database' : '資料庫',
		'Commendations' : '獎賞',
		'Enemies' : '戰役角色',
		'Top Medals' : '獎章排行',
		'Medals' : '獎章',
		'Vehicles' : '載具',
		'Weapons Usage' : '武器使用',
		'Top Weapons' : '武器排行',
		'Weapons' : '武器',
		'Missions' : '戰役任務',
		'Game Variants' : '遊戲模式',
		'Game Variant\:' : '遊戲模式：',
		'Match Length\:' : '遊戲時長：',
		'Maps' : '地圖',
		'Map\:' : '地圖：',
		'Top Playlists' : '遊戲清單排行',
		'Tracking' : '追蹤',
		'Rolling' : '曲線圖：',
		'Playlists' : '遊戲清單',
		'Detailed' : '詳細資訊',
		'Recent Games' : '最近的遊戲',
		'Select a Game\!' : '選擇一場遊戲',
		'Look up a player and select a game on the left' : '點選左側的遊戲場次來檢視',
		'REQ Packs' : '徵用套件',
		'Next Page' : '下一頁',
		'Previous Page' : '上一頁',
		'Shoulder Bash Kills' : '超級戰士衝撞殺敵數',
		'Shoulder Bash Damage' : '超級戰士衝撞傷害量',
		'See more recent games' : '檢視更多最近的遊戲',
		'Place' : '名次',
		'Headshot \%' : '爆頭準確率',
		'Headshots' : '爆頭',
		'Ground Pound Kills' : '地面重擊殺敵數',
		'Spartan Kills' : '超級戰士殺敵數',
		'Power Weapon Kills' : '重型武器殺敵數',
		'Tool of Destruction' : '毀滅性武器',
		'Games Won' : '已獲勝遊戲',
		'Assassinations' : '刺殺',
		'Assassination' : '刺殺',
		'Ground Pound Damage' : '地面重擊傷害量',
		'K/G' : '單場遊戲平均殺敵',
		'Power Weapon Damage' : '重型武器傷害量',
		'Performance Stats' : '詳細表現',
		'Grenade Kills' : '手榴彈殺敵數',
		'Melee Damage' : '近戰傷害量',
		'Melee Kills' : '近戰殺敵數',
		'Power Weapon Grabs' : '撿起重型武器數',
		'Weapon Damage' : '武器傷害量',
		'Power Weapon Possession Time' : '重型武器持有時間',
		'Killed Most' : '最常殺死',
		'Kills / Death' : '殺戮死亡比',
		'Kills + Assists / Death' : '殺戮死亡助攻比',
		'Kills / Game' : '單場遊戲平均殺敵',
		'Kills' : '殺死',
		'Deaths' : '死亡',
		'Assists' : '助攻',
		'Head Shots' : '爆頭',
		'Head shot \%' : '爆頭準確率',
		'Win Rate' : '勝率',
		'Games Played' : '已進行遊戲',
		'Tracking XP' : '經驗值追蹤',
		'XP' : '經驗值',
		'Spartan Rank' : '超級戰士等級',
		'Total Play Time' : '總遊玩時間',
		'Top Ranks' : '等級',
		'Rank' : '名次',
		'Show All' : '檢視全部',
		'SWAT on' : '《特警》於',
		'SWAT' : '特警',
		'Slayer on' : '《殺戮之王》於',
		'Slayer' : '殺戮之王',
		'Free-for-All' : '自由對戰遊戲',
		'Breakout on' : '《突破重圍》於',
		'Breakout' : '突破重圍',
		'Big Team Battle' : '大型團隊戰鬥',
		'T1' : '1',
		'T2' : '2',
		'T3' : '3',
		'T4' : '4',
		'T5' : '5',
		'T6' : '6',
		'Unranked' : '尚未排名',
		'Diamond' : '菱形',
		'Onyx' : '瑪瑙',
		'Halo 5 Group Finder - Looking For Group (LFG)' : 'Halo 5 約戰工具',
		'Schedule using Chat or Private Messages' : '使用交談或私人訊息約戰',
		'People Chatting\:' : '正在交談人數：',
		'Please remember no story spoilers in the chatbox. No selling of any services or products.' : '請勿在聊天視窗裡透露遊戲劇情，並嚴禁販售任何服務或產品。',
		'Enlarge Chat' : '放大聊天視窗',
		'LFG' : '約戰',
		'Forums - Home' : '討論區首頁',
		'All Threads' : '所有文章',
		'Help \& Guides' : '幫助及嚮導',
		'Off-Topic' : ' 閒聊',
		'Halo Masterchief Collection' : 'Halo：士官長合輯',
		'Halo 5 - The Guardians' : 'Halo 5：守護者',
		'Chat Box' : '聊天室',
		'Chat' : '聊天',
		'Forums' : '討論區',
		'Help' : '幫助',
		'Support' : '支援',
		'"Stat"' : '紀錄',
		'Value' : '數值',
		'K\/D' : '殺戮死亡比',
		'K+A\/D' : '殺戮死亡助攻比',
		'Win \%' : '勝率',
		'Win\%' : '勝率',
		'Tracking Time Played' : '遊玩時間追蹤',
		'Time Played' : '遊玩時間',
		'Games Completed' : '已完成遊戲',
		'Games Lost' : '已戰敗遊戲',
		'Head Shot \%' : '爆頭準確率',
		'Shots Fired' : '已射擊彈藥',
		'Shots Landed' : '已擊中目標',
		'Accuracy' : '準確率',
		'Possession' : '持有時間',
		'Grenade Damage' : '手榴彈傷害量',
		/////武器名稱/////
		'Standard' : '一般',
		'Magnum' : '麥格農手槍',
		'Battle Rifle' : '攻擊步槍',
		'Lightrifle' : '光線步槍',
		'DMR' : '神射手步槍',
		'Flagnum' : '旗幟麥格農',
		'Storm Rifle' : '風暴步槍',
		'Carbine' : '卡賓槍',
		'Assault Rifle' : '衝鋒槍',
		'SMG' : '輕機槍',
		'Suppressor' : '壓制實光槍',
		'Plasma Pistol' : '電漿手槍',
		'Boltshot' : '閃雷手槍',
		'FRAG GRENADE' : '破片手榴彈',
		'SPLINTER GRENADE' : '子母手榴彈',
		'PLASMA GRENADE' : '電漿手榴彈',
		'Grenade' : '手榴彈',
		'Power' : '重型',
		'Rocket Launcher' : '火箭發射筒',
		'Sniper Rifle' : '狙擊步槍',
		'Scattershot' : '散射步槍',
		'Railgun' : '磁軌槍',
		'Fuel Rod Cannon' : '燃料砲',
		'Energy Sword' : '能量劍',
		'Shotgun' : '霰彈槍',
		'Plasma Caster' : '電漿發射器',
		'Hydra Launcher' : '多管火箭發射器',
		'Needler' : '刺針槍',
		'Incineration Cannon' : '焚燒加農砲',
		'Unknown' : '未知',
		'Spartan' : '超級戰士',
		'Environmental Explosives' : '環境物件爆炸',
		'Lookup' : '搜尋',
		///////////
		'Contact\:' : '聯絡我們：',
		'Have a question or feedback? Contact us\!' : '有任何問題或意見想反映嗎？聯絡我們吧！',
		'Contact Staff' : ' 聯絡工作人員',
		'Follow\:' : '追蹤我們：',
	
		'About Us' : '關於我們',
		'Developed By' : '開發者',
		'Developer' : '開發人員',
		'Administrated By' : '管理員',
		'Theme By' : '美術設計',
		
		'Staff Directory' : '網站管理員',
		'2015 Halotracker' : '2015 Halotracker | 網站中文化：HORIKITASNAKE',
    ///////////////////////////////////////////////////////
    '':''};











    //////////////////////////////////////////////////////////////////////////////
    // This is where the real code is
    // Don't edit below this
    //////////////////////////////////////////////////////////////////////////////

    var regexs = [], replacements = [],
        tagsWhitelist = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'TEXTAREA'],
        rIsRegexp = /^\/(.+)\/([gim]+)?$/,
        word, text, texts, i, userRegexp;

    // prepareRegex by JoeSimmons
    // used to take a string and ready it for use in new RegExp()
    function prepareRegex(string) {
        return string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, '\\$1');
    }

    // function to decide whether a parent tag will have its text replaced or not
    function isTagOk(tag) {
        return tagsWhitelist.indexOf(tag) === -1;
    }

    delete words['']; // so the user can add each entry ending with a comma,
                      // I put an extra empty key/value pair in the object.
                      // so we need to remove it before continuing

    // convert the 'words' JSON object to an Array
    for (word in words) {
        if ( typeof word === 'string' && words.hasOwnProperty(word) ) {
            userRegexp = word.match(rIsRegexp);

            // add the search/needle/query
            if (userRegexp) {
                regexs.push(
                    new RegExp(userRegexp[1], 'g')
                );
            } else {
                regexs.push(
                    new RegExp(prepareRegex(word).replace(/\\?\*/g, function (fullMatch) {
                        return fullMatch === '\\*' ? '*' : '[^ ]*';
                    }), 'g')
                );
            }

            // add the replacement
            replacements.push( words[word] );
        }
    }

    // do the replacement
    texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
    for (i = 0; text = texts.snapshotItem(i); i += 1) {
        if ( isTagOk(text.parentNode.tagName) ) {
            regexs.forEach(function (value, index) {
                text.data = text.data.replace( value, replacements[index] );
            });
        }
    }

}());

