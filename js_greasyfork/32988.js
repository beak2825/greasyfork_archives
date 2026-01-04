// ==UserScript==
// @name         Discord Emoji Replacer for BKT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Nya!
// @author       blblb
// @match        https://discordapp.com/channels/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32988/Discord%20Emoji%20Replacer%20for%20BKT.user.js
// @updateURL https://update.greasyfork.org/scripts/32988/Discord%20Emoji%20Replacer%20for%20BKT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var replaceRuleMap = {};
    // request uri: https://discordapp.com/api/v6/guilds/{channel_id_here}/emojis
    // use `/(, "user": \{.*?\})/g` if you would like to remove the user blocks.
    var replaceRuleJson = [{"managed": false, "name": "kat", "roles": [], "require_colons": true, "id": "282346432311066635"}, {"managed": false, "name": "dpg", "roles": [], "require_colons": true, "id": "282346660351442954"}, {"managed": false, "name": "tat", "roles": [], "require_colons": true, "id": "282346761044099073"}, {"managed": false, "name": "meh", "roles": [], "require_colons": true, "id": "282349101604143115"}, {"managed": false, "name": "ohmy", "roles": [], "require_colons": true, "id": "282351241840033792"}, {"managed": false, "name": "dead", "roles": [], "require_colons": true, "id": "282352712128135169"}, {"managed": false, "name": "pu", "roles": [], "require_colons": true, "id": "282352988532768768"}, {"managed": false, "name": "huh", "roles": [], "require_colons": true, "id": "282476077698383872"}, {"managed": false, "name": "nya", "roles": [], "require_colons": true, "id": "282832125294542848"}, {"managed": false, "name": "what", "roles": [], "require_colons": true, "id": "288296604274786304"}, {"managed": false, "name": "bigcry", "roles": [], "require_colons": true, "id": "291126987043373066"}, {"managed": false, "name": "poor", "roles": [], "require_colons": true, "id": "293017801554132992"}, {"managed": false, "name": "dance", "roles": [], "require_colons": true, "id": "293018079430967297"}, {"managed": false, "name": "__", "roles": [], "require_colons": true, "id": "293018294674391060"}, {"managed": false, "name": "EVAxKim", "roles": [], "require_colons": true, "id": "293018650451902465"}, {"managed": false, "name": "cannot_look", "roles": [], "require_colons": true, "id": "293021365332606976"}, {"managed": false, "name": "eat_biscuits", "roles": [], "require_colons": true, "id": "293021375315181569"}, {"managed": false, "name": "embarrassed", "roles": [], "require_colons": true, "id": "293021383833681920"}, {"managed": false, "name": "head_in_hands", "roles": [], "require_colons": true, "id": "293021392436461568"}, {"managed": false, "name": "TAT", "roles": [], "require_colons": true, "id": "293021401923715082"}, {"managed": false, "name": "sweat", "roles": [], "require_colons": true, "id": "293021409406353409"}, {"managed": false, "name": "sweat_rain", "roles": [], "require_colons": true, "id": "293021417686171648"}, {"managed": false, "name": "TwT", "roles": [], "require_colons": true, "id": "293021427257442305"}, {"managed": false, "name": "w_", "roles": [], "require_colons": true, "id": "293021437705453573"}, {"managed": false, "name": "cry_on_big_news", "roles": [], "require_colons": true, "id": "293023597381812224"}, {"managed": false, "name": "tuosai", "roles": [], "require_colons": true, "id": "293023614280794112"}, {"managed": false, "name": "heart_was_broken", "roles": [], "require_colons": true, "id": "293024575065948170"}, {"managed": false, "name": "let_me_try", "roles": [], "require_colons": true, "id": "293024584213463043"}, {"managed": false, "name": "lazy", "roles": [], "require_colons": true, "id": "293025634341486592"}, {"managed": false, "name": "huaji", "roles": [], "require_colons": true, "id": "293025664272039937"}, {"managed": false, "name": "enheng", "roles": [], "require_colons": true, "id": "293033630312431620"}, {"managed": false, "name": "f4ckya", "roles": [], "require_colons": true, "id": "293738413776175104"}, {"managed": false, "name": "cry_without_news", "roles": [], "require_colons": true, "id": "304236230940426240"}, {"managed": false, "name": "undirectseeable", "roles": [], "require_colons": true, "id": "308972354137096192"}, {"managed": false, "name": "ji", "roles": [], "require_colons": true, "id": "311058627169484800"}, {"managed": false, "name": "shenchu", "roles": [], "require_colons": true, "id": "311058723638607872"}, {"managed": false, "name": "buonana", "roles": [], "require_colons": true, "id": "311058908581986304"}, {"managed": false, "name": "ori", "roles": [], "require_colons": true, "id": "311058998415589376"}, {"managed": false, "name": "fast_orz", "roles": [], "require_colons": true, "id": "311060184082546689"}, {"managed": false, "name": "teji_kawaii", "roles": [], "require_colons": true, "id": "311060236343574528"}, {"managed": false, "name": "__", "roles": [], "require_colons": true, "id": "322237342742085633"}, {"managed": false, "name": "boss_question", "roles": [], "require_colons": true, "id": "325095370332045324"}, {"managed": false, "name": "gui", "roles": [], "require_colons": true, "id": "330198582693199872"}, {"managed": false, "name": "hit", "roles": [], "require_colons": true, "id": "332866328182652929"}, {"managed": false, "name": "zhidaocuolemei", "roles": [], "require_colons": true, "id": "351670366206164995"}]

    function replaceEmoji(match, p1, offset, string) {
        if (offset && string[offset-1] === '"' && string[offset+match.length] === '"') return match;
        if (typeof(replaceRuleMap[match])=="undefined") {
            console.log("Match failed:[" + match + "]");
            return match;
        }
        return String(replaceRuleMap[match]);//"[func]";
    }

    function emoji_replacement_init() {
        replaceRuleJson.forEach(function(el) {
            replaceRuleMap[':' + el.name + ':'] = "<img draggable='false' class='emoji jumboable' alt='" + el.name + "' src='https://cdn.discordapp.com/emojis/" + el.id + ".png'>";
        });

        window.setInterval(emoji_replacement_update, 1000);
    }

    function emoji_replacement_update() {
        var a = document.querySelectorAll('.markup:not([data-processed])');
        a.forEach(function(el) {
            var htmlText = el.innerHTML;
            el.innerHTML = htmlText.replace(/(:[A-Za-z_]{1,15}:)+/g, replaceEmoji);
            el.setAttribute('data-processed', true);
        });
    }

    emoji_replacement_init();
    emoji_replacement_update();
})();