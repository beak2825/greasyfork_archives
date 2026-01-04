// ==UserScript==
// @name         Weeb Names
// @namespace    NyaggerSquad
// @icon         https://mahjongsoul.game.yo-star.com/icon_en.png
// @version      1.01
// @description  For all your weeaboo needs, change WEEB_LEVEL in script if you feel like it
// @author       anon
// @include      https://mahjongsoul.game.yo-star.com/
// @include      https://game.mahjongsoul.com/
// @include      https://majsoul.union-game.com/0/
// @downloadURL https://update.greasyfork.org/scripts/423267/Weeb%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/423267/Weeb%20Names.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const HIGH = 0;
    const LOW = 1;

    var WEEB_LEVEL = LOW;

    var map = [
        [["Menzenchin Tsumohou", "Menzen Tsumo"],1,103], //or just Tsumo
        ["Riichi",2,101],
        ["Chankan",3,109],
        ["Rinshan Kaihou",4,110],
        ["Haitei Raoyue",5,111],
        ["Houtei Raoyui",6,112],
        ["Haku",7,0],
        ["Hatsu",8,0],
        ["Chun",9,0],
        [["Jikaze", "Seat Wind"],10,104],
        [["Bakaze", "Prevalent Wind"],11,105],
        [["Tanyaochuu", "Tanyao"],12,102],
        ["Iipeikou",13,108],
        ["Pinfu",14,107],
        [["Honchantaiyaochuu", "Chanta"],15,209],
        [["Ikkitsuukan", "Ittsuu"],16,210], //or Ittsu
        ["Sanshoku Doujun",17,211],
        ["Double Riichi",18,201],
        ["Sanshoku Doukou",19,202],
        ["Sankantsu",20,203],
        [["Toitoihou", "Toitoi"],21,204],
        ["Sanankou",22,205],
        ["Shousangen",23,206],
        ["Honroutou",24,207],
        [["Chiitoitsu", "Chiitoi"],25,208],
        [["Junchan Taiyao", "Junchan"],26,302],
        ["Honitsu",27,303],
        ["Ryanpeikou",28,301],
        ["Chinitsu",29,401],
        ["Ippatsu",30,113],
        ["Dora",31,114],
        ["Akadora",32,115],
        ["Uradora",33,0],
        ["Kita",34,116],
        ["Tenhou",35,601],
        ["Chiihou",36,602],
        ["Daisangen",37,603],
        ["Suuankou",38,604],
        ["Tsuuiisou",39,605],
        ["Ryuuiisou",40,606],
        ["Chinroutou",41,607],
        ["Kokushi Musou",42,608],
        ["Shousuushii",43,609],
        ["Suukantsu",44,610],
        ["Chuuren Poutou",45,611],
        ["Paarenchan",46,0],
        ["Junsei Chuuren Poutou",47,703],
        ["Suuankou Tanki",48,701],
        ["Kokushi Musou Juusan Menmachi",49,702],
        ["Daisuushii",50,704],
        ["Tsubame-gaeshi",51,0],
        ["Kanburi",52,0],
        ["Shiiaruraotai",53,0],
        ["Uumensai",54,0],
        ["Sanrenkou",55,0],
        ["Iishoku Sanjun",56,0],
        ["Iipinmoyue",57,0],
        ["Chuupinraoyui",58,0],
        ["Renhou",59,0],
        ["Daisharin",60,0],
        ["Daichikurin",61,0],
        ["Daisuurin",62,0],
        ["Ishinouenimosannen",63,0],
        ["Daichisei",64,0],
        [["Yakuhai - Sangen", "Dragons"],0,106],
        ["Nagashi Mangan",0,501], //hardcoded in game.Tools.strOfLocalization(2154)
        ["Suufon Renda",0,801],
        ["Suukaikan",0,802],
        ["Kyuushuu Kyuuhai",0,803],
        ["Suucha Riichi",0,804]
    ];

    var LobbyCheck = setInterval(function(){
        if (GameMgr.prototype.EnterLobby){
            GameMgr.prototype.EnterLobby = (function() {
                var cacheF = GameMgr.prototype.EnterLobby;
                return function(){
                    map.forEach(i=>{
                        let n = i[0];
                        if (Array.isArray(n))
                            n = n[WEEB_LEVEL];
                        i[1] != 0 && (cfg.fan.fan.map_[i[1]].name_en = n);
                        i[2] != 0 && (cfg.fandesc.fandesc.map_[i[2]].name_en = n);
                    });
                    var result = cacheF.apply(this, arguments);
                    return result;
                };
            })();
            clearInterval(LobbyCheck);
        }
    },2000);
})();