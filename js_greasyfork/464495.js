// ==UserScript==
// @name         BulkSendGold
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ololo
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)(\.heroeswm\.ru|\.lordswm\.com)|178\.248\.235\.15)\/transfer.+/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/464495/BulkSendGold.user.js
// @updateURL https://update.greasyfork.org/scripts/464495/BulkSendGold.meta.js
// ==/UserScript==

(function (window, undefined) {
    /*
    * допустимые значения:
    * gold для золота
    * wood для дерева
    * ore для руды
    * mercury для ртути
    * sulphur для серы
    * crystal для кристаллов
    * gem для самоцветов
    * */
    let resourceType = "gold"





    let w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }
    if (w.self !== w.top) {
        return;
    }
    let host = location.host;

    let sign = document.querySelector("input[name=sign]").value
    function bulkSendGold(heroes, index) {

        if (index < heroes.length) {
            sendGold(getSendArray(getSendGoldFormData(heroes[index][0], heroes[index][1], heroes[index][2])), doc => {
                $("send_gold_data_processed").innerHTML+=`${heroes[index][0]} done<br>`
                bulkSendGold(heroes, index+1)
            })
        }
    }

    document.querySelector("form[name=f]").insertAdjacentHTML("afterend", `
    <div style="display: flex; flex-direction: column; margin-left: 4%">
        <div style="display: flex">
            <div><textarea id="send_gold_data" placeholder="Данные" style="height: 500px; width: 200px"></textarea></div>
            <div id="send_gold_data_processed"></div>
        </div>
<!--        <div><input id="send_gold_desc" type="text" style="width: 100px" placeholder="Описание"></div>-->
        <div><button id="send_gold">Отправить ${resourceType}!</button></div>
    </div>
    `)
    $(`send_gold`).addEventListener("click", () => {
        // let desc = $("send_gold_desc").value
        let data = $("send_gold_data").value.split("\n").map(row=>row.split("\t"))
        bulkSendGold(data, 0)
    })

    function sendGold(formData, callback) {
        let http = new XMLHttpRequest;
        http.open('POST', '/transfer.php', !0)
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
        http.setRequestHeader('Content-Type', 'text/plain; charset=windows-1251')
        http.send(formData);
        http.onload = () => {
            callback()
        }
    }

    function getSendGoldFormData(nick, gold, desc) {
        let formData = new FormData()
        formData.append('nick', nick)
        formData.append(resourceType, gold)
        formData.append('desc', desc)
        formData.append('sign', sign)
        const data = [...formData.entries()];
        return data
            .map(x => `${x[0]}=${x[1]}`)
            .join('&')
    }

    let DMap = {
        1027: 129,
        8225: 135,
        1046: 198,
        8222: 132,
        1047: 199,
        1168: 165,
        1048: 200,
        1113: 154,
        1049: 201,
        1045: 197,
        1050: 202,
        1028: 170,
        160: 160,
        1040: 192,
        1051: 203,
        164: 164,
        166: 166,
        167: 167,
        169: 169,
        171: 171,
        172: 172,
        173: 173,
        174: 174,
        1053: 205,
        176: 176,
        177: 177,
        1114: 156,
        181: 181,
        182: 182,
        183: 183,
        8221: 148,
        187: 187,
        1029: 189,
        1056: 208,
        1057: 209,
        1058: 210,
        8364: 136,
        1112: 188,
        1115: 158,
        1059: 211,
        1060: 212,
        1030: 178,
        1061: 213,
        1062: 214,
        1063: 215,
        1116: 157,
        1064: 216,
        1065: 217,
        1031: 175,
        1066: 218,
        1067: 219,
        1068: 220,
        1069: 221,
        1070: 222,
        1032: 163,
        8226: 149,
        1071: 223,
        1072: 224,
        8482: 153,
        1073: 225,
        8240: 137,
        1118: 162,
        1074: 226,
        1110: 179,
        8230: 133,
        1075: 227,
        1033: 138,
        1076: 228,
        1077: 229,
        8211: 150,
        1078: 230,
        1119: 159,
        1079: 231,
        1042: 194,
        1080: 232,
        1034: 140,
        1025: 168,
        1081: 233,
        1082: 234,
        8212: 151,
        1083: 235,
        1169: 180,
        1084: 236,
        1052: 204,
        1085: 237,
        1035: 142,
        1086: 238,
        1087: 239,
        1088: 240,
        1089: 241,
        1090: 242,
        1036: 141,
        1041: 193,
        1091: 243,
        1092: 244,
        8224: 134,
        1093: 245,
        8470: 185,
        1094: 246,
        1054: 206,
        1095: 247,
        1096: 248,
        8249: 139,
        1097: 249,
        1098: 250,
        1044: 196,
        1099: 251,
        1111: 191,
        1055: 207,
        1100: 252,
        1038: 161,
        8220: 147,
        1101: 253,
        8250: 155,
        1102: 254,
        8216: 145,
        1103: 255,
        1043: 195,
        1105: 184,
        1039: 143,
        1026: 128,
        1106: 144,
        8218: 130,
        1107: 131,
        8217: 146,
        1108: 186,
        1109: 190
    };
    for (let j = 0; j < 128; j++) {
        DMap[j] = j;
    }

    function UnicodeToWin1251(t) {
        for (var e = [], r = 0; r < t.length; r++) {
            var n = t.charCodeAt(r);
            if (!(n in DMap)) throw'e';
            e.push(String.fromCharCode(DMap[n]))
        }
        return e.join('')
    }

    function getSendArray(body) {
        let converted_str = UnicodeToWin1251(body)
        let	send_arr = new Uint8Array(converted_str.length)
        for (let x = 0; x < converted_str.length; ++x) {
            send_arr[x] = converted_str.charCodeAt(x);
        }
        return send_arr
    }


    function $(id, where = document) {
        return where.querySelector(`#${id}`);
    }

})(window);