// ==UserScript==
// @name        新三国杀打小抄-测试
// @match       *://*.sanguosha.com/*
// @license MIT
// @version     0.0.8.6
// @author      小麦
// @description  十周年新打小抄，QQ群724393933
// @run-at       document-start
// @namespace   新三国杀打小抄
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525806/%E6%96%B0%E4%B8%89%E5%9B%BD%E6%9D%80%E6%89%93%E5%B0%8F%E6%8A%84-%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/525806/%E6%96%B0%E4%B8%89%E5%9B%BD%E6%9D%80%E6%89%93%E5%B0%8F%E6%8A%84-%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==



//UserScript
'use strict';
window.SGSMODULE = [];
var version = "0.0.8.6";
console._log = console.log;
console._log('%cBASE', 'font-weight: bold; color: white; background-color: #525288; padding: 1px 4px; border-radius: 4px;');
//// @downloadURL http://lkfun.cc/script/newdaxiaochao.user.js
//// @updateURL http://lkfun.cc/script/newdaxiaochao.user.js

// const classList = ['SsCChatmsgNtf', 'GsCModifyUserseatNtf', 'MsgReconnectGame', 'MsgGamePlayCardNtf', 'PubGsCUseSpell', 'ClientHappyGetFriendHandcardRep', 'GsCRoleOptTargetNtf', 'PubGsCMoveCard', 'GsCFirstPhaseRole', 'GsCGamephaseNtf', 'PubGsCUseCard', 'ClientGeneralSkinRep', 'ClientLoginRep', 'MsgReconnectGame', 'ClientRoleGeneralStarRep'];

// const _log = (...args) => {
//     // 如果第一个参数是一个对象，并且它的 className 属性在 classList 中，那么执行 console._log 和 SGSMODULE 中的函数
//     if (typeof args[0] === 'object' && ('className' in args[0]) && classList.includes(args[0].className)
//         || args=='资源组加载完毕：selectSkin') {
//         console._log(...args);
//         SGSMODULE.forEach((fn) => fn(...args));
//     }
// };
// for filter
//     const filterClassList = ['decodeSSCChatmsgNtf',
//         'FsCUpdateUserfriendinfoNtf',
//         'MsgHeartAliveRep',
//         'ClinetNetSpeedNtf',
//         'GsCUpdateTableattribNtf',
//         'cmsg.CNotifyChatMessag',
//         'cmsg.CNotifyHorseRaceLamp',
//         'netframe.Client_RespHeartBeat',
//         'cmsg.CNotifyChatMessage',
//         'cmsg.CRespSyncSystemTime'];
const _log = function () {
    const args = Array.prototype.slice.call(arguments);
    console._log(...args);
    Array.isArray(SGSMODULE) &&
    SGSMODULE.forEach((fn) => {
        fn(...arguments);
    })
};



Object.defineProperty(console, 'log', {
    get() {
        return _log;
    },
    set() {
        return;
    },
});
SGSMODULE.push(main);


window.card = {};
var mySkin;
var account = localStorage.SGS_LASTLOGIN_ACCOUNT;


var isSelectGeneral  =false;
let userID;
let UserID;
let curUserID;
let allCard={"0":{"name":"?","color":" ","number":" ","type":"1"},"1":{"id":1,"name":"决斗","type":2,"number":1,"color":2},"2":{"id":2,"name":"闪","type":1,"number":2,"color":2},"3":{"id":3,"name":"顺手","type":2,"number":3,"color":2},"4":{"id":4,"name":"顺手","type":2,"number":4,"color":2},"5":{"id":5,"name":"贯石","type":3,"number":5,"color":2},"6":{"id":6,"name":"杀","type":1,"number":6,"color":2},"7":{"id":7,"name":"杀","type":1,"number":7,"color":2},"8":{"id":8,"name":"杀","type":1,"number":8,"color":2},"9":{"id":9,"name":"杀","type":1,"number":9,"color":2},"10":{"id":10,"name":"杀","type":1,"number":10,"color":2},"11":{"id":11,"name":"闪","type":1,"number":11,"color":2},"12":{"id":12,"name":"方天","type":3,"number":12,"color":2},"13":{"id":13,"name":"紫騂","type":3,"number":13,"color":2},"14":{"id":14,"name":"诸葛","type":3,"number":1,"color":2},"15":{"id":15,"name":"闪","type":1,"number":2,"color":2},"16":{"id":16,"name":"闪","type":1,"number":3,"color":2},"17":{"id":17,"name":"闪","type":1,"number":4,"color":2},"18":{"id":18,"name":"闪","type":1,"number":5,"color":2},"19":{"id":19,"name":"闪","type":1,"number":6,"color":2},"20":{"id":20,"name":"闪","type":1,"number":7,"color":2},"21":{"id":21,"name":"闪","type":1,"number":8,"color":2},"22":{"id":22,"name":"闪","type":1,"number":9,"color":2},"23":{"id":23,"name":"闪","type":1,"number":10,"color":2},"24":{"id":24,"name":"闪","type":1,"number":11,"color":2},"25":{"id":25,"name":"桃","type":1,"number":12,"color":2},"26":{"id":26,"name":"杀","type":1,"number":13,"color":2},"27":{"id":27,"name":"万箭","type":2,"number":1,"color":1},"28":{"id":28,"name":"闪","type":1,"number":2,"color":1},"29":{"id":29,"name":"五谷","type":2,"number":3,"color":1},"30":{"id":30,"name":"五谷","type":2,"number":4,"color":1},"31":{"id":31,"name":"赤兔","type":3,"number":5,"color":1},"32":{"id":32,"name":"乐不","type":2,"number":6,"color":1},"33":{"id":33,"name":"无中","type":2,"number":7,"color":1},"34":{"id":34,"name":"无中","type":2,"number":8,"color":1},"35":{"id":35,"name":"无中","type":2,"number":9,"color":1},"36":{"id":36,"name":"杀","type":1,"number":10,"color":1},"37":{"id":37,"name":"无中","type":2,"number":11,"color":1},"38":{"id":38,"name":"过河","type":2,"number":12,"color":1},"39":{"id":39,"name":"闪","type":1,"number":13,"color":1},"40":{"id":40,"name":"桃园","type":2,"number":1,"color":1},"41":{"id":41,"name":"闪","type":1,"number":2,"color":1},"42":{"id":42,"name":"桃","type":1,"number":3,"color":1},"43":{"id":43,"name":"桃","type":1,"number":4,"color":1},"44":{"id":44,"name":"麒麟","type":3,"number":5,"color":1},"45":{"id":45,"name":"桃","type":1,"number":6,"color":1},"46":{"id":46,"name":"桃","type":1,"number":7,"color":1},"47":{"id":47,"name":"桃","type":1,"number":8,"color":1},"48":{"id":48,"name":"桃","type":1,"number":9,"color":1},"49":{"id":49,"name":"杀","type":1,"number":10,"color":1},"50":{"id":50,"name":"杀","type":1,"number":11,"color":1},"51":{"id":51,"name":"桃","type":1,"number":12,"color":1},"52":{"id":52,"name":"爪黄","type":3,"number":13,"color":1},"53":{"id":53,"name":"决斗","type":2,"number":1,"color":4},"54":{"id":54,"name":"杀","type":1,"number":2,"color":4},"55":{"id":55,"name":"杀","type":1,"number":3,"color":4},"56":{"id":56,"name":"杀","type":1,"number":4,"color":4},"57":{"id":57,"name":"杀","type":1,"number":5,"color":4},"58":{"id":58,"name":"杀","type":1,"number":6,"color":4},"59":{"id":59,"name":"杀","type":1,"number":7,"color":4},"60":{"id":60,"name":"杀","type":1,"number":8,"color":4},"61":{"id":61,"name":"杀","type":1,"number":9,"color":4},"62":{"id":62,"name":"杀","type":1,"number":10,"color":4},"63":{"id":63,"name":"杀","type":1,"number":11,"color":4},"64":{"id":64,"name":"无懈","type":2,"number":12,"color":4},"65":{"id":65,"name":"无懈","type":2,"number":13,"color":4},"66":{"id":66,"name":"诸葛","type":3,"number":1,"color":4},"67":{"id":67,"name":"八卦","type":3,"number":2,"color":4},"68":{"id":68,"name":"过河","type":2,"number":3,"color":4},"69":{"id":69,"name":"过河","type":2,"number":4,"color":4},"70":{"id":70,"name":"的卢","type":3,"number":5,"color":4},"71":{"id":71,"name":"乐不","type":2,"number":6,"color":4},"72":{"id":72,"name":"南蛮","type":2,"number":7,"color":4},"73":{"id":73,"name":"杀","type":1,"number":8,"color":4},"74":{"id":74,"name":"杀","type":1,"number":9,"color":4},"75":{"id":75,"name":"杀","type":1,"number":10,"color":4},"76":{"id":76,"name":"杀","type":1,"number":11,"color":4},"77":{"id":77,"name":"借刀","type":2,"number":12,"color":4},"78":{"id":78,"name":"借刀","type":2,"number":13,"color":4},"79":{"id":79,"name":"决斗","type":2,"number":1,"color":3},"80":{"id":80,"name":"雌雄","type":3,"number":2,"color":3},"81":{"id":81,"name":"顺手","type":2,"number":3,"color":3},"82":{"id":82,"name":"顺手","type":2,"number":4,"color":3},"83":{"id":83,"name":"绝影","type":3,"number":5,"color":3},"84":{"id":84,"name":"青釭","type":3,"number":6,"color":3},"85":{"id":85,"name":"杀","type":1,"number":7,"color":3},"86":{"id":86,"name":"杀","type":1,"number":8,"color":3},"87":{"id":87,"name":"杀","type":1,"number":9,"color":3},"88":{"id":88,"name":"杀","type":1,"number":10,"color":3},"89":{"id":89,"name":"顺手","type":2,"number":11,"color":3},"90":{"id":90,"name":"过河","type":2,"number":12,"color":3},"91":{"id":91,"name":"南蛮","type":2,"number":13,"color":3},"92":{"id":92,"name":"闪电","type":2,"number":1,"color":3},"93":{"id":93,"name":"八卦","type":3,"number":2,"color":3},"94":{"id":94,"name":"过河","type":2,"number":3,"color":3},"95":{"id":95,"name":"过河","type":2,"number":4,"color":3},"96":{"id":96,"name":"青龙","type":3,"number":5,"color":3},"97":{"id":97,"name":"乐不","type":2,"number":6,"color":3},"98":{"id":98,"name":"南蛮","type":2,"number":7,"color":3},"99":{"id":99,"name":"杀","type":1,"number":8,"color":3},"100":{"id":100,"name":"杀","type":1,"number":9,"color":3},"101":{"id":101,"name":"杀","type":1,"number":10,"color":3},"102":{"id":102,"name":"无懈","type":2,"number":11,"color":3},"103":{"id":103,"name":"丈八","type":3,"number":12,"color":3},"104":{"id":104,"name":"大宛","type":3,"number":13,"color":3},"105":{"id":105,"name":"闪电","type":2,"number":12,"color":1},"106":{"id":106,"name":"无懈","type":2,"number":12,"color":2},"107":{"id":107,"name":"仁王","type":3,"number":2,"color":4},"108":{"id":108,"name":"寒冰","type":3,"number":2,"color":3},"109":{"id":109,"name":"无懈","type":2,"number":1,"color":1},"110":{"id":110,"name":"火攻","type":2,"number":2,"color":1},"111":{"id":111,"name":"火攻","type":2,"number":3,"color":1},"112":{"id":112,"name":"火杀","type":1,"number":4,"color":1},"113":{"id":113,"name":"桃","type":1,"number":5,"color":1},"114":{"id":114,"name":"桃","type":1,"number":6,"color":1},"115":{"id":115,"name":"火杀","type":1,"number":7,"color":1},"116":{"id":116,"name":"闪","type":1,"number":8,"color":1},"117":{"id":117,"name":"闪","type":1,"number":9,"color":1},"118":{"id":118,"name":"火杀","type":1,"number":10,"color":1},"119":{"id":119,"name":"闪","type":1,"number":11,"color":1},"120":{"id":120,"name":"闪","type":1,"number":12,"color":1},"121":{"id":121,"name":"无懈","type":2,"number":13,"color":1},"122":{"id":122,"name":"朱雀","type":3,"number":1,"color":2},"123":{"id":123,"name":"桃","type":1,"number":2,"color":2},"124":{"id":124,"name":"桃","type":1,"number":3,"color":2},"125":{"id":125,"name":"火杀","type":1,"number":4,"color":2},"126":{"id":126,"name":"火杀","type":1,"number":5,"color":2},"127":{"id":127,"name":"闪","type":1,"number":6,"color":2},"128":{"id":128,"name":"闪","type":1,"number":7,"color":2},"129":{"id":129,"name":"闪","type":1,"number":8,"color":2},"130":{"id":130,"name":"酒","type":1,"number":9,"color":2},"131":{"id":131,"name":"闪","type":1,"number":10,"color":2},"132":{"id":132,"name":"闪","type":1,"number":11,"color":2},"133":{"id":133,"name":"火攻","type":2,"number":12,"color":2},"134":{"id":134,"name":"骅骝","type":3,"number":13,"color":2},"135":{"id":135,"name":"古锭","type":3,"number":1,"color":3},"136":{"id":136,"name":"藤甲","type":3,"number":2,"color":3},"137":{"id":137,"name":"酒","type":1,"number":3,"color":3},"138":{"id":138,"name":"雷杀","type":1,"number":4,"color":3},"139":{"id":139,"name":"雷杀","type":1,"number":5,"color":3},"140":{"id":140,"name":"雷杀","type":1,"number":6,"color":3},"141":{"id":141,"name":"雷杀","type":1,"number":7,"color":3},"142":{"id":142,"name":"雷杀","type":1,"number":8,"color":3},"143":{"id":143,"name":"酒","type":1,"number":9,"color":3},"144":{"id":144,"name":"兵粮","type":2,"number":10,"color":3},"145":{"id":145,"name":"铁索","type":2,"number":11,"color":3},"146":{"id":146,"name":"铁索","type":2,"number":12,"color":3},"147":{"id":147,"name":"无懈","type":2,"number":13,"color":3},"148":{"id":148,"name":"白银","type":3,"number":1,"color":4},"149":{"id":149,"name":"藤甲","type":3,"number":2,"color":4},"150":{"id":150,"name":"酒","type":1,"number":3,"color":4},"151":{"id":151,"name":"兵粮","type":2,"number":4,"color":4},"152":{"id":152,"name":"雷杀","type":1,"number":5,"color":4},"153":{"id":153,"name":"雷杀","type":1,"number":6,"color":4},"154":{"id":154,"name":"雷杀","type":1,"number":7,"color":4},"155":{"id":155,"name":"雷杀","type":1,"number":8,"color":4},"156":{"id":156,"name":"酒","type":1,"number":9,"color":4},"157":{"id":157,"name":"铁索","type":2,"number":10,"color":4},"158":{"id":158,"name":"铁索","type":2,"number":11,"color":4},"159":{"id":159,"name":"铁索","type":2,"number":12,"color":4},"160":{"id":160,"name":"铁索","type":2,"number":13,"color":4},"161":{"id":161,"name":"木牛","type":3,"number":5,"color":2},"162":{"id":162,"name":"声东","type":2,"number":3,"color":3},"163":{"id":163,"name":"声东","type":2,"number":4,"color":3},"164":{"id":164,"name":"声东","type":2,"number":11,"color":3},"165":{"id":165,"name":"声东","type":2,"number":3,"color":2},"166":{"id":166,"name":"声东","type":2,"number":4,"color":2},"167":{"id":167,"name":"增兵","type":2,"number":3,"color":1},"168":{"id":168,"name":"增兵","type":2,"number":4,"color":1},"169":{"id":169,"name":"增兵","type":2,"number":7,"color":1},"170":{"id":170,"name":"增兵","type":2,"number":8,"color":1},"171":{"id":171,"name":"增兵","type":2,"number":9,"color":1},"172":{"id":172,"name":"增兵","type":2,"number":11,"color":1},"173":{"id":173,"name":"草木","type":2,"number":10,"color":3},"174":{"id":174,"name":"草木","type":2,"number":4,"color":4},"175":{"id":175,"name":"毒","type":1,"number":9,"color":2},"176":{"id":176,"name":"毒","type":1,"number":3,"color":3},"177":{"id":177,"name":"毒","type":1,"number":9,"color":3},"178":{"id":178,"name":"毒","type":1,"number":3,"color":4},"179":{"id":179,"name":"毒","type":1,"number":9,"color":4},"180":{"id":180,"name":"毒","type":1,"number":5,"color":2},"181":{"id":181,"name":"唯我","type":2,"number":1,"color":4},"182":{"id":182,"name":"唯我","type":2,"number":1,"color":2},"183":{"id":183,"name":"毒","type":1,"number":8,"color":4},"184":{"id":184,"name":"毒","type":1,"number":11,"color":2},"185":{"id":185,"name":"弃甲","type":2,"number":12,"color":4},"186":{"id":186,"name":"弃甲","type":2,"number":13,"color":4},"187":{"id":187,"name":"金蝉","type":2,"number":12,"color":4},"188":{"id":188,"name":"金蝉","type":2,"number":13,"color":4},"189":{"id":189,"name":"金蝉","type":2,"number":11,"color":3},"190":{"id":190,"name":"金蝉","type":2,"number":12,"color":2},"191":{"id":191,"name":"金蝉","type":2,"number":1,"color":1},"192":{"id":192,"name":"金蝉","type":2,"number":13,"color":1},"193":{"id":193,"name":"金蝉","type":2,"number":13,"color":3},"194":{"id":194,"name":"浮雷","type":2,"number":1,"color":3},"195":{"id":195,"name":"浮雷","type":2,"number":12,"color":1},"196":{"id":196,"name":"七宝","type":3,"number":6,"color":3},"197":{"id":197,"name":"衠钢","type":3,"number":5,"color":3},"198":{"id":198,"name":"烂银","type":3,"number":2,"color":4},"199":{"id":199,"name":"烂银","type":3,"number":2,"color":3},"200":{"id":200,"name":"洪荒","type":2,"number":1,"color":3},"201":{"id":201,"name":"洪荒","type":2,"number":12,"color":1},"202":{"id":202,"name":"红缎","type":3,"number":1,"color":1},"203":{"id":203,"name":"烈淬","type":3,"number":1,"color":2},"204":{"id":204,"name":"水波","type":3,"number":1,"color":4},"205":{"id":205,"name":"混毒","type":3,"number":1,"color":3},"206":{"id":206,"name":"天雷","type":3,"number":1,"color":3},"300":{"id":300,"name":"同舟","type":2,"number":9,"color":1},"301":{"id":301,"name":"同舟","type":2,"number":8,"color":1},"302":{"id":302,"name":"同舟","type":2,"number":7,"color":1},"303":{"id":303,"name":"力争","type":2,"number":10,"color":1},"304":{"id":304,"name":"力争","type":2,"number":11,"color":1},"305":{"id":305,"name":"力争","type":2,"number":12,"color":1},"306":{"id":306,"name":"笑里","type":2,"number":6,"color":3},"307":{"id":307,"name":"笑里","type":2,"number":5,"color":4},"308":{"id":308,"name":"笑里","type":2,"number":4,"color":1},"309":{"id":309,"name":"美人","type":2,"number":3,"color":3},"310":{"id":310,"name":"美人","type":2,"number":2,"color":4},"311":{"id":311,"name":"美人","type":2,"number":1,"color":1},"312":{"id":312,"name":"鬼龙","type":3,"number":5,"color":3},"313":{"id":313,"name":"国风","type":3,"number":9,"color":3},"314":{"id":314,"name":"赤炎","type":3,"number":1,"color":2},"315":{"id":315,"name":"奇门","type":3,"number":2,"color":3},"316":{"id":316,"name":"奇门","type":3,"number":2,"color":4},"317":{"id":317,"name":"绝尘","type":3,"number":5,"color":3},"318":{"id":318,"name":"修罗","type":3,"number":12,"color":2},"319":{"id":319,"name":"虚妄","type":3,"number":4,"color":4},"320":{"id":320,"name":"赤血","type":3,"number":6,"color":3},"321":{"id":321,"name":"撒豆","type":2,"number":7,"color":1},"322":{"id":322,"name":"撒豆","type":2,"number":8,"color":1},"323":{"id":323,"name":"撒豆","type":2,"number":9,"color":1},"324":{"id":324,"name":"撒豆","type":2,"number":11,"color":1},"325":{"id":325,"name":"移花","type":2,"number":12,"color":4},"326":{"id":326,"name":"移花","type":2,"number":13,"color":4},"327":{"id":327,"name":"粽","type":1,"number":12,"color":2},"328":{"id":328,"name":"粽","type":1,"number":3,"color":1},"329":{"id":329,"name":"粽","type":1,"number":4,"color":1},"330":{"id":330,"name":"粽","type":1,"number":6,"color":1},"331":{"id":331,"name":"粽","type":1,"number":7,"color":1},"332":{"id":332,"name":"粽","type":1,"number":8,"color":1},"333":{"id":333,"name":"粽","type":1,"number":9,"color":1},"334":{"id":334,"name":"粽","type":1,"number":12,"color":1},"335":{"id":335,"name":"粽","type":1,"number":5,"color":1},"336":{"id":336,"name":"粽","type":1,"number":6,"color":1},"337":{"id":337,"name":"粽","type":1,"number":2,"color":2},"338":{"id":338,"name":"粽","type":1,"number":3,"color":2},"339":{"id":339,"name":"雄黄","type":1,"number":9,"color":2},"340":{"id":340,"name":"雄黄","type":1,"number":3,"color":3},"341":{"id":341,"name":"雄黄","type":1,"number":9,"color":3},"342":{"id":342,"name":"雄黄","type":1,"number":3,"color":4},"343":{"id":343,"name":"雄黄","type":1,"number":9,"color":4},"1001":{"id":1001,"name":"决斗","type":2,"number":1,"color":3},"1002":{"id":1002,"name":"闪电","type":2,"number":1,"color":3},"1003":{"id":1003,"name":"八卦","type":3,"number":2,"color":3},"1004":{"id":1004,"name":"雌雄","type":3,"number":2,"color":3},"1005":{"id":1005,"name":"寒冰","type":3,"number":2,"color":3},"1006":{"id":1006,"name":"顺手","type":2,"number":3,"color":3},"1007":{"id":1007,"name":"过河","type":2,"number":3,"color":3},"1008":{"id":1008,"name":"顺手","type":2,"number":4,"color":3},"1009":{"id":1009,"name":"过河","type":2,"number":4,"color":3},"1010":{"id":1010,"name":"绝影","type":3,"number":5,"color":3},"1011":{"id":1011,"name":"杀","type":1,"number":5,"color":3},"1012":{"id":1012,"name":"青釭","type":3,"number":6,"color":3},"1013":{"id":1013,"name":"雷杀","type":1,"number":6,"color":3},"1014":{"id":1014,"name":"杀","type":1,"number":7,"color":3},"1015":{"id":1015,"name":"雷杀","type":1,"number":7,"color":3},"1016":{"id":1016,"name":"杀","type":1,"number":8,"color":3},"1017":{"id":1017,"name":"杀","type":1,"number":8,"color":3},"1018":{"id":1018,"name":"酒","type":1,"number":9,"color":3},"1019":{"id":1019,"name":"杀","type":1,"number":9,"color":3},"1020":{"id":1020,"name":"杀","type":1,"number":10,"color":3},"1021":{"id":1021,"name":"兵粮","type":2,"number":10,"color":3},"1022":{"id":1022,"name":"杀","type":1,"number":11,"color":3},"1023":{"id":1023,"name":"无懈","type":2,"number":11,"color":3},"1024":{"id":1024,"name":"铁索","type":2,"number":12,"color":3},"1025":{"id":1025,"name":"丈八","type":3,"number":12,"color":3},"1026":{"id":1026,"name":"南蛮","type":2,"number":13,"color":3},"1027":{"id":1027,"name":"大宛","type":3,"number":13,"color":3},"1028":{"id":1028,"name":"桃园","type":2,"number":1,"color":1},"1029":{"id":1029,"name":"万箭","type":2,"number":1,"color":1},"1030":{"id":1030,"name":"闪","type":1,"number":2,"color":1},"1031":{"id":1031,"name":"火攻","type":2,"number":2,"color":1},"1032":{"id":1032,"name":"五谷","type":2,"number":3,"color":1},"1033":{"id":1033,"name":"火攻","type":2,"number":3,"color":1},"1034":{"id":1034,"name":"火杀","type":1,"number":4,"color":1},"1035":{"id":1035,"name":"桃","type":1,"number":4,"color":1},"1036":{"id":1036,"name":"赤兔","type":3,"number":5,"color":1},"1037":{"id":1037,"name":"麒麟","type":3,"number":5,"color":1},"1038":{"id":1038,"name":"乐不","type":2,"number":6,"color":1},"1039":{"id":1039,"name":"桃","type":1,"number":6,"color":1},"1040":{"id":1040,"name":"无中","type":2,"number":7,"color":1},"1041":{"id":1041,"name":"桃","type":1,"number":7,"color":1},"1042":{"id":1042,"name":"无中","type":2,"number":8,"color":1},"1043":{"id":1043,"name":"桃","type":1,"number":8,"color":1},"1044":{"id":1044,"name":"远交","type":2,"number":9,"color":1},"1045":{"id":1045,"name":"桃","type":1,"number":9,"color":1},"1046":{"id":1046,"name":"杀","type":1,"number":10,"color":1},"1047":{"id":1047,"name":"桃","type":1,"number":10,"color":1},"1048":{"id":1048,"name":"以逸","type":2,"number":11,"color":1},"1049":{"id":1049,"name":"闪","type":1,"number":11,"color":1},"1050":{"id":1050,"name":"杀","type":1,"number":12,"color":1},"1051":{"id":1051,"name":"桃","type":1,"number":12,"color":1},"1052":{"id":1052,"name":"过河","type":2,"number":12,"color":1},"1053":{"id":1053,"name":"闪","type":1,"number":13,"color":1},"1054":{"id":1054,"name":"爪黄","type":3,"number":13,"color":1},"1055":{"id":1055,"name":"决斗","type":2,"number":1,"color":4},"1056":{"id":1056,"name":"白银","type":3,"number":1,"color":4},"1057":{"id":1057,"name":"藤甲","type":3,"number":2,"color":4},"1058":{"id":1058,"name":"杀","type":1,"number":2,"color":4},"1059":{"id":1059,"name":"仁王","type":3,"number":2,"color":4},"1060":{"id":1060,"name":"杀","type":1,"number":3,"color":4},"1061":{"id":1061,"name":"知己","type":2,"number":3,"color":4},"1062":{"id":1062,"name":"杀","type":1,"number":4,"color":4},"1063":{"id":1063,"name":"知己","type":2,"number":4,"color":4},"1064":{"id":1064,"name":"杀","type":1,"number":5,"color":4},"1065":{"id":1065,"name":"的卢","type":3,"number":5,"color":4},"1066":{"id":1066,"name":"乐不","type":2,"number":6,"color":4},"1067":{"id":1067,"name":"雷杀","type":1,"number":6,"color":4},"1068":{"id":1068,"name":"南蛮","type":2,"number":7,"color":4},"1069":{"id":1069,"name":"雷杀","type":1,"number":7,"color":4},"1070":{"id":1070,"name":"杀","type":1,"number":8,"color":4},"1071":{"id":1071,"name":"雷杀","type":1,"number":8,"color":4},"1072":{"id":1072,"name":"酒","type":1,"number":9,"color":4},"1073":{"id":1073,"name":"杀","type":1,"number":9,"color":4},"1074":{"id":1074,"name":"兵粮","type":2,"number":10,"color":4},"1075":{"id":1075,"name":"杀","type":1,"number":10,"color":4},"1076":{"id":1076,"name":"杀","type":1,"number":11,"color":4},"1077":{"id":1077,"name":"杀","type":1,"number":11,"color":4},"1078":{"id":1078,"name":"铁索","type":2,"number":12,"color":4},"1079":{"id":1079,"name":"借刀","type":2,"number":12,"color":4},"1080":{"id":1080,"name":"铁索","type":2,"number":13,"color":4},"1081":{"id":1081,"name":"无懈","type":2,"number":13,"color":4},"1082":{"id":1082,"name":"诸葛","type":3,"number":1,"color":2},"1083":{"id":1083,"name":"朱雀","type":3,"number":1,"color":2},"1084":{"id":1084,"name":"桃","type":1,"number":2,"color":2},"1085":{"id":1085,"name":"闪","type":1,"number":2,"color":2},"1086":{"id":1086,"name":"顺手","type":2,"number":3,"color":2},"1087":{"id":1087,"name":"闪","type":1,"number":3,"color":2},"1088":{"id":1088,"name":"以逸","type":2,"number":4,"color":2},"1089":{"id":1089,"name":"火杀","type":1,"number":4,"color":2},"1090":{"id":1090,"name":"贯石","type":3,"number":5,"color":2},"1091":{"id":1091,"name":"火杀","type":1,"number":5,"color":2},"1092":{"id":1092,"name":"吴六","type":3,"number":6,"color":2},"1093":{"id":1093,"name":"闪","type":1,"number":6,"color":2},"1094":{"id":1094,"name":"闪","type":1,"number":7,"color":2},"1095":{"id":1095,"name":"闪","type":1,"number":7,"color":2},"1096":{"id":1096,"name":"闪","type":1,"number":8,"color":2},"1097":{"id":1097,"name":"闪","type":1,"number":8,"color":2},"1098":{"id":1098,"name":"酒","type":1,"number":9,"color":2},"1099":{"id":1099,"name":"闪","type":1,"number":9,"color":2},"1100":{"id":1100,"name":"杀","type":1,"number":10,"color":2},"1101":{"id":1101,"name":"闪","type":1,"number":10,"color":2},"1102":{"id":1102,"name":"杀","type":1,"number":11,"color":2},"1103":{"id":1103,"name":"闪","type":1,"number":11,"color":2},"1104":{"id":1104,"name":"杀","type":1,"number":12,"color":2},"1105":{"id":1105,"name":"三尖","type":3,"number":12,"color":2},"1106":{"id":1106,"name":"无懈","type":2,"number":12,"color":2},"1107":{"id":1107,"name":"紫骍","type":3,"number":13,"color":2},"1108":{"id":1108,"name":"闪","type":1,"number":13,"color":2},"1109":{"id":1109,"name":"联军","type":2,"number":1,"color":1},"1110":{"id":1110,"name":"调虎","type":2,"number":2,"color":1},"1111":{"id":1111,"name":"惊帆","type":3,"number":3,"color":1},"1112":{"id":1112,"name":"闪","type":1,"number":4,"color":1},"1113":{"id":1113,"name":"闪","type":1,"number":5,"color":1},"1114":{"id":1114,"name":"闪","type":1,"number":6,"color":1},"1115":{"id":1115,"name":"闪","type":1,"number":7,"color":1},"1116":{"id":1116,"name":"桃","type":1,"number":8,"color":1},"1117":{"id":1117,"name":"桃","type":1,"number":9,"color":1},"1118":{"id":1118,"name":"杀","type":1,"number":10,"color":1},"1119":{"id":1119,"name":"杀","type":1,"number":11,"color":1},"1120":{"id":1120,"name":"火烧","type":2,"number":12,"color":1},"1121":{"id":1121,"name":"水淹","type":2,"number":13,"color":1},"1122":{"id":1122,"name":"挟天","type":2,"number":1,"color":2},"1123":{"id":1123,"name":"桃","type":1,"number":2,"color":2},"1124":{"id":1124,"name":"桃","type":1,"number":3,"color":2},"1125":{"id":1125,"name":"挟天","type":2,"number":4,"color":2},"1126":{"id":1126,"name":"木牛","type":3,"number":5,"color":2},"1127":{"id":1127,"name":"闪","type":1,"number":6,"color":2},"1128":{"id":1128,"name":"闪","type":1,"number":7,"color":2},"1129":{"id":1129,"name":"火杀","type":1,"number":8,"color":2},"1130":{"id":1130,"name":"火杀","type":1,"number":9,"color":2},"1131":{"id":1131,"name":"调虎","type":2,"number":10,"color":2},"1132":{"id":1132,"name":"无懈","type":2,"number":11,"color":2},"1133":{"id":1133,"name":"方天","type":3,"number":12,"color":2},"1134":{"id":1134,"name":"闪","type":1,"number":13,"color":2},"1135":{"id":1135,"name":"挟天","type":2,"number":1,"color":3},"1136":{"id":1136,"name":"明光","type":3,"number":2,"color":3},"1137":{"id":1137,"name":"火烧","type":2,"number":3,"color":3},"1138":{"id":1138,"name":"杀","type":1,"number":4,"color":3},"1139":{"id":1139,"name":"青龙","type":3,"number":5,"color":3},"1140":{"id":1140,"name":"酒","type":1,"number":6,"color":3},"1141":{"id":1141,"name":"杀","type":1,"number":7,"color":3},"1142":{"id":1142,"name":"杀","type":1,"number":8,"color":3},"1143":{"id":1143,"name":"雷杀","type":1,"number":9,"color":3},"1144":{"id":1144,"name":"雷杀","type":1,"number":10,"color":3},"1145":{"id":1145,"name":"雷杀","type":1,"number":11,"color":3},"1146":{"id":1146,"name":"勠力","type":2,"number":12,"color":3},"1147":{"id":1147,"name":"无懈","type":2,"number":13,"color":3},"1148":{"id":1148,"name":"玉玺","type":3,"number":1,"color":4},"1149":{"id":1149,"name":"护心","type":3,"number":2,"color":4},"1150":{"id":1150,"name":"敕令","type":2,"number":3,"color":4},"1151":{"id":1151,"name":"杀","type":1,"number":4,"color":4},"1152":{"id":1152,"name":"雷杀","type":1,"number":5,"color":4},"1153":{"id":1153,"name":"杀","type":1,"number":6,"color":4},"1154":{"id":1154,"name":"杀","type":1,"number":7,"color":4},"1155":{"id":1155,"name":"杀","type":1,"number":8,"color":4},"1156":{"id":1156,"name":"酒","type":1,"number":9,"color":4},"1157":{"id":1157,"name":"勠力","type":2,"number":10,"color":4},"1158":{"id":1158,"name":"火烧","type":2,"number":11,"color":4},"1159":{"id":1159,"name":"水淹","type":2,"number":12,"color":4},"1160":{"id":1160,"name":"无懈","type":2,"number":13,"color":4},"1200":{"id":1200,"name":"决斗","type":2,"number":1,"color":3},"1201":{"id":1201,"name":"闪电","type":2,"number":1,"color":3},"1202":{"id":1202,"name":"八卦","type":3,"number":2,"color":3},"1203":{"id":1203,"name":"雌雄","type":3,"number":2,"color":3},"1204":{"id":1204,"name":"过河","type":2,"number":4,"color":3},"1205":{"id":1205,"name":"绝影","type":3,"number":5,"color":3},"1206":{"id":1206,"name":"杀","type":1,"number":5,"color":3},"1207":{"id":1207,"name":"青釭","type":3,"number":6,"color":3},"1208":{"id":1208,"name":"杀","type":1,"number":7,"color":3},"1209":{"id":1209,"name":"酒","type":1,"number":9,"color":3},"1210":{"id":1210,"name":"杀","type":1,"number":9,"color":3},"1211":{"id":1211,"name":"兵粮","type":2,"number":10,"color":3},"1212":{"id":1212,"name":"铁索","type":2,"number":12,"color":3},"1213":{"id":1213,"name":"丈八","type":3,"number":12,"color":3},"1214":{"id":1214,"name":"桃园","type":2,"number":1,"color":1},"1215":{"id":1215,"name":"万箭","type":2,"number":1,"color":1},"1216":{"id":1216,"name":"闪","type":1,"number":2,"color":1},"1217":{"id":1217,"name":"五谷","type":2,"number":3,"color":1},"1218":{"id":1218,"name":"桃","type":1,"number":4,"color":1},"1219":{"id":1219,"name":"赤兔","type":3,"number":5,"color":1},"1220":{"id":1220,"name":"麒麟","type":3,"number":5,"color":1},"1221":{"id":1221,"name":"乐不","type":2,"number":6,"color":1},"1222":{"id":1222,"name":"桃","type":1,"number":6,"color":1},"1223":{"id":1223,"name":"桃","type":1,"number":7,"color":1},"1224":{"id":1224,"name":"桃","type":1,"number":8,"color":1},"1225":{"id":1225,"name":"远交","type":2,"number":9,"color":1},"1226":{"id":1226,"name":"桃","type":1,"number":9,"color":1},"1227":{"id":1227,"name":"杀","type":1,"number":10,"color":1},"1228":{"id":1228,"name":"桃","type":1,"number":10,"color":1},"1229":{"id":1229,"name":"以逸","type":2,"number":11,"color":1},"1230":{"id":1230,"name":"闪","type":1,"number":11,"color":1},"1231":{"id":1231,"name":"杀","type":1,"number":12,"color":1},"1232":{"id":1232,"name":"桃","type":1,"number":12,"color":1},"1233":{"id":1233,"name":"过河","type":2,"number":12,"color":1},"1234":{"id":1234,"name":"闪","type":1,"number":13,"color":1},"1235":{"id":1235,"name":"爪黄","type":3,"number":13,"color":1},"1236":{"id":1236,"name":"决斗","type":2,"number":1,"color":4},"1237":{"id":1237,"name":"杀","type":1,"number":2,"color":4},"1238":{"id":1238,"name":"仁王","type":3,"number":2,"color":4},"1239":{"id":1239,"name":"杀","type":1,"number":3,"color":4},"1240":{"id":1240,"name":"知己","type":2,"number":3,"color":4},"1241":{"id":1241,"name":"知己","type":2,"number":4,"color":4},"1242":{"id":1242,"name":"乐不","type":2,"number":6,"color":4},"1243":{"id":1243,"name":"雷杀","type":1,"number":6,"color":4},"1244":{"id":1244,"name":"雷杀","type":1,"number":7,"color":4},"1245":{"id":1245,"name":"杀","type":1,"number":8,"color":4},"1246":{"id":1246,"name":"雷杀","type":1,"number":8,"color":4},"1247":{"id":1247,"name":"酒","type":1,"number":9,"color":4},"1248":{"id":1248,"name":"杀","type":1,"number":9,"color":4},"1249":{"id":1249,"name":"兵粮","type":2,"number":10,"color":4},"1250":{"id":1250,"name":"杀","type":1,"number":10,"color":4},"1251":{"id":1251,"name":"杀","type":1,"number":11,"color":4},"1252":{"id":1252,"name":"杀","type":1,"number":11,"color":4},"1253":{"id":1253,"name":"铁索","type":2,"number":12,"color":4},"1254":{"id":1254,"name":"铁索","type":2,"number":13,"color":4},"1255":{"id":1255,"name":"无懈","type":2,"number":13,"color":4},"1256":{"id":1256,"name":"诸葛","type":3,"number":1,"color":2},"1257":{"id":1257,"name":"桃","type":1,"number":2,"color":2},"1258":{"id":1258,"name":"闪","type":1,"number":2,"color":2},"1259":{"id":1259,"name":"顺手","type":2,"number":3,"color":2},"1260":{"id":1260,"name":"闪","type":1,"number":3,"color":2},"1261":{"id":1261,"name":"以逸","type":2,"number":4,"color":2},"1262":{"id":1262,"name":"贯石","type":3,"number":5,"color":2},"1263":{"id":1263,"name":"火杀","type":1,"number":5,"color":2},"1264":{"id":1264,"name":"吴六","type":3,"number":6,"color":2},"1265":{"id":1265,"name":"闪","type":1,"number":6,"color":2},"1266":{"id":1266,"name":"酒","type":1,"number":9,"color":2},"1267":{"id":1267,"name":"闪","type":1,"number":9,"color":2},"1268":{"id":1268,"name":"杀","type":1,"number":10,"color":2},"1269":{"id":1269,"name":"闪","type":1,"number":10,"color":2},"1270":{"id":1270,"name":"杀","type":1,"number":11,"color":2},"1271":{"id":1271,"name":"闪","type":1,"number":11,"color":2},"1272":{"id":1272,"name":"杀","type":1,"number":12,"color":2},"1273":{"id":1273,"name":"三尖","type":3,"number":12,"color":2},"1274":{"id":1274,"name":"无懈","type":2,"number":12,"color":2},"1275":{"id":1275,"name":"紫骍","type":3,"number":13,"color":2},"1276":{"id":1276,"name":"闪","type":1,"number":13,"color":2},"1277":{"id":1277,"name":"水淹","type":2,"number":3,"color":3},"1278":{"id":1278,"name":"水淹","type":2,"number":4,"color":3},"1279":{"id":1279,"name":"冰杀","type":1,"number":8,"color":3},"1280":{"id":1280,"name":"杀","type":1,"number":10,"color":3},"1281":{"id":1281,"name":"杀","type":1,"number":11,"color":3},"1282":{"id":1282,"name":"南蛮","type":2,"number":13,"color":3},"1283":{"id":1283,"name":"逐近","type":2,"number":3,"color":3},"1284":{"id":1284,"name":"冰杀","type":1,"number":6,"color":3},"1285":{"id":1285,"name":"冰杀","type":1,"number":7,"color":3},"1286":{"id":1286,"name":"冰杀","type":1,"number":8,"color":3},"1287":{"id":1287,"name":"无懈","type":2,"number":11,"color":3},"1288":{"id":1288,"name":"乌铁","type":3,"number":13,"color":3},"1289":{"id":1289,"name":"火杀","type":1,"number":4,"color":1},"1290":{"id":1290,"name":"洞烛","type":2,"number":7,"color":1},"1291":{"id":1291,"name":"洞烛","type":2,"number":8,"color":1},"1292":{"id":1292,"name":"出其","type":2,"number":2,"color":1},"1293":{"id":1293,"name":"出其","type":2,"number":3,"color":1},"1294":{"id":1294,"name":"太公","type":3,"number":2,"color":3},"1295":{"id":1295,"name":"藤甲","type":3,"number":2,"color":4},"1296":{"id":1296,"name":"南蛮","type":2,"number":7,"color":4},"1297":{"id":1297,"name":"杀","type":1,"number":4,"color":4},"1298":{"id":1298,"name":"杀","type":1,"number":5,"color":4},"1299":{"id":1299,"name":"护心","type":3,"number":1,"color":4},"1300":{"id":1300,"name":"铜雀","type":3,"number":5,"color":4},"1301":{"id":1301,"name":"逐近","type":2,"number":12,"color":4},"1302":{"id":1302,"name":"五行","type":3,"number":1,"color":2},"1303":{"id":1303,"name":"闪","type":1,"number":7,"color":2},"1304":{"id":1304,"name":"闪","type":1,"number":7,"color":2},"1305":{"id":1305,"name":"闪","type":1,"number":8,"color":2},"1306":{"id":1306,"name":"闪","type":1,"number":8,"color":2},"1307":{"id":1307,"name":"火杀","type":1,"number":4,"color":1},"2001":{"id":2001,"name":"万箭","type":2,"number":1,"color":1},"2002":{"id":2002,"name":"闪","type":1,"number":2,"color":1},"2003":{"id":2003,"name":"桃","type":1,"number":3,"color":1},"2004":{"id":2004,"name":"桃","type":1,"number":4,"color":1},"2005":{"id":2005,"name":"闪","type":1,"number":5,"color":1},"2006":{"id":2006,"name":"乐不","type":2,"number":6,"color":1},"2007":{"id":2007,"name":"无中","type":2,"number":7,"color":1},"2008":{"id":2008,"name":"无中","type":2,"number":8,"color":1},"2009":{"id":2009,"name":"桃","type":1,"number":9,"color":1},"2010":{"id":2010,"name":"杀","type":1,"number":10,"color":1},"2011":{"id":2011,"name":"杀","type":1,"number":11,"color":1},"2012":{"id":2012,"name":"过河","type":2,"number":12,"color":1},"2013":{"id":2013,"name":"无懈","type":2,"number":13,"color":1},"2014":{"id":2014,"name":"诸葛","type":3,"number":1,"color":2},"2015":{"id":2015,"name":"闪","type":1,"number":2,"color":2},"2016":{"id":2016,"name":"闪","type":1,"number":3,"color":2},"2017":{"id":2017,"name":"顺手","type":2,"number":4,"color":2},"2018":{"id":2018,"name":"贯石","type":3,"number":5,"color":2},"2019":{"id":2019,"name":"杀","type":1,"number":6,"color":2},"2020":{"id":2020,"name":"闪","type":1,"number":7,"color":2},"2021":{"id":2021,"name":"闪","type":1,"number":8,"color":2},"2022":{"id":2022,"name":"杀","type":1,"number":9,"color":2},"2023":{"id":2023,"name":"闪","type":1,"number":10,"color":2},"2024":{"id":2024,"name":"闪","type":1,"number":11,"color":2},"2025":{"id":2025,"name":"桃","type":1,"number":12,"color":2},"2026":{"id":2026,"name":"杀","type":1,"number":13,"color":2},"2027":{"id":2027,"name":"决斗","type":2,"number":1,"color":3},"2028":{"id":2028,"name":"八卦","type":3,"number":2,"color":3},"2029":{"id":2029,"name":"过河","type":2,"number":3,"color":3},"2030":{"id":2030,"name":"顺手","type":2,"number":4,"color":3},"2031":{"id":2031,"name":"杀","type":1,"number":5,"color":3},"2032":{"id":2032,"name":"青釭","type":3,"number":6,"color":3},"2033":{"id":2033,"name":"杀","type":1,"number":7,"color":3},"2034":{"id":2034,"name":"杀","type":1,"number":8,"color":3},"2035":{"id":2035,"name":"寒冰","type":3,"number":9,"color":3},"2036":{"id":2036,"name":"杀","type":1,"number":10,"color":3},"2037":{"id":2037,"name":"顺手","type":2,"number":11,"color":3},"2038":{"id":2038,"name":"丈八","type":3,"number":12,"color":3},"2039":{"id":2039,"name":"南蛮","type":2,"number":13,"color":3},"2040":{"id":2040,"name":"决斗","type":2,"number":1,"color":4},"2041":{"id":2041,"name":"仁王","type":3,"number":2,"color":4},"2042":{"id":2042,"name":"过河","type":2,"number":3,"color":4},"2043":{"id":2043,"name":"杀","type":1,"number":4,"color":4},"2044":{"id":2044,"name":"杀","type":1,"number":5,"color":4},"2045":{"id":2045,"name":"杀","type":1,"number":6,"color":4},"2046":{"id":2046,"name":"水淹","type":2,"number":7,"color":4},"2047":{"id":2047,"name":"杀","type":1,"number":8,"color":4},"2048":{"id":2048,"name":"杀","type":1,"number":9,"color":4},"2049":{"id":2049,"name":"杀","type":1,"number":10,"color":4},"2050":{"id":2050,"name":"杀","type":1,"number":11,"color":4},"2051":{"id":2051,"name":"兵粮","type":2,"number":12,"color":4},"2052":{"id":2052,"name":"无懈","type":2,"number":13,"color":4},"3001":{"id":3001,"name":"决斗","type":2,"number":1,"color":2},"3002":{"id":3002,"name":"闪","type":1,"number":2,"color":2},"3003":{"id":3003,"name":"顺手","type":2,"number":3,"color":2},"3004":{"id":3004,"name":"顺手","type":2,"number":4,"color":2},"3005":{"id":3005,"name":"贯石","type":3,"number":5,"color":2},"3006":{"id":3006,"name":"杀","type":1,"number":6,"color":2},"3007":{"id":3007,"name":"杀","type":1,"number":7,"color":2},"3008":{"id":3008,"name":"杀","type":1,"number":8,"color":2},"3009":{"id":3009,"name":"杀","type":1,"number":9,"color":2},"3010":{"id":3010,"name":"杀","type":1,"number":10,"color":2},"3011":{"id":3011,"name":"闪","type":1,"number":11,"color":2},"3012":{"id":3012,"name":"方天","type":3,"number":12,"color":2},"3013":{"id":3013,"name":"紫騂","type":3,"number":13,"color":2},"3014":{"id":3014,"name":"连弩","type":3,"number":1,"color":2},"3015":{"id":3015,"name":"闪","type":1,"number":2,"color":2},"3016":{"id":3016,"name":"闪","type":1,"number":3,"color":2},"3017":{"id":3017,"name":"闪","type":1,"number":4,"color":2},"3018":{"id":3018,"name":"闪","type":1,"number":5,"color":2},"3019":{"id":3019,"name":"闪","type":1,"number":6,"color":2},"3020":{"id":3020,"name":"闪","type":1,"number":7,"color":2},"3021":{"id":3021,"name":"闪","type":1,"number":8,"color":2},"3022":{"id":3022,"name":"闪","type":1,"number":9,"color":2},"3023":{"id":3023,"name":"闪","type":1,"number":10,"color":2},"3024":{"id":3024,"name":"闪","type":1,"number":11,"color":2},"3025":{"id":3025,"name":"桃","type":1,"number":12,"color":2},"3026":{"id":3026,"name":"杀","type":1,"number":13,"color":2},"3027":{"id":3027,"name":"万箭","type":2,"number":1,"color":1},"3028":{"id":3028,"name":"闪","type":1,"number":2,"color":1},"3029":{"id":3029,"name":"五谷","type":2,"number":3,"color":1},"3030":{"id":3030,"name":"五谷","type":2,"number":4,"color":1},"3031":{"id":3031,"name":"赤兔","type":3,"number":5,"color":1},"3032":{"id":3032,"name":"乐不","type":2,"number":6,"color":1},"3033":{"id":3033,"name":"无中","type":2,"number":7,"color":1},"3034":{"id":3034,"name":"无中","type":2,"number":8,"color":1},"3035":{"id":3035,"name":"无中","type":2,"number":9,"color":1},"3036":{"id":3036,"name":"杀","type":1,"number":10,"color":1},"3037":{"id":3037,"name":"无中","type":2,"number":11,"color":1},"3038":{"id":3038,"name":"过河","type":2,"number":12,"color":1},"3039":{"id":3039,"name":"闪","type":1,"number":13,"color":1},"3040":{"id":3040,"name":"桃园","type":2,"number":1,"color":1},"3041":{"id":3041,"name":"闪","type":1,"number":2,"color":1},"3042":{"id":3042,"name":"桃","type":1,"number":3,"color":1},"3043":{"id":3043,"name":"桃","type":1,"number":4,"color":1},"3044":{"id":3044,"name":"麒麟","type":3,"number":5,"color":1},"3045":{"id":3045,"name":"桃","type":1,"number":6,"color":1},"3046":{"id":3046,"name":"桃","type":1,"number":7,"color":1},"3047":{"id":3047,"name":"桃","type":1,"number":8,"color":1},"3048":{"id":3048,"name":"桃","type":1,"number":9,"color":1},"3049":{"id":3049,"name":"杀","type":1,"number":10,"color":1},"3050":{"id":3050,"name":"杀","type":1,"number":11,"color":1},"3051":{"id":3051,"name":"桃","type":1,"number":12,"color":1},"3052":{"id":3052,"name":"爪黄","type":3,"number":13,"color":1},"3053":{"id":3053,"name":"决斗","type":2,"number":1,"color":4},"3054":{"id":3054,"name":"杀","type":1,"number":2,"color":4},"3055":{"id":3055,"name":"杀","type":1,"number":3,"color":4},"3056":{"id":3056,"name":"杀","type":1,"number":4,"color":4},"3057":{"id":3057,"name":"杀","type":1,"number":5,"color":4},"3058":{"id":3058,"name":"杀","type":1,"number":6,"color":4},"3059":{"id":3059,"name":"杀","type":1,"number":7,"color":4},"3060":{"id":3060,"name":"杀","type":1,"number":8,"color":4},"3061":{"id":3061,"name":"杀","type":1,"number":9,"color":4},"3062":{"id":3062,"name":"杀","type":1,"number":10,"color":4},"3063":{"id":3063,"name":"杀","type":1,"number":11,"color":4},"3064":{"id":3064,"name":"无懈","type":2,"number":12,"color":4},"3065":{"id":3065,"name":"无懈","type":2,"number":13,"color":4},"3066":{"id":3066,"name":"连弩","type":3,"number":1,"color":4},"3067":{"id":3067,"name":"八卦","type":3,"number":2,"color":4},"3068":{"id":3068,"name":"过河","type":2,"number":3,"color":4},"3069":{"id":3069,"name":"过河","type":2,"number":4,"color":4},"3070":{"id":3070,"name":"的卢","type":3,"number":5,"color":4},"3071":{"id":3071,"name":"乐不","type":2,"number":6,"color":4},"3072":{"id":3072,"name":"南蛮","type":2,"number":7,"color":4},"3073":{"id":3073,"name":"杀","type":1,"number":8,"color":4},"3074":{"id":3074,"name":"杀","type":1,"number":9,"color":4},"3075":{"id":3075,"name":"杀","type":1,"number":10,"color":4},"3076":{"id":3076,"name":"杀","type":1,"number":11,"color":4},"3077":{"id":3077,"name":"借刀","type":2,"number":12,"color":4},"3078":{"id":3078,"name":"借刀","type":2,"number":13,"color":4},"3079":{"id":3079,"name":"决斗","type":2,"number":1,"color":3},"3080":{"id":3080,"name":"雌雄","type":3,"number":2,"color":3},"3081":{"id":3081,"name":"顺手","type":2,"number":3,"color":3},"3082":{"id":3082,"name":"顺手","type":2,"number":4,"color":3},"3083":{"id":3083,"name":"绝影","type":3,"number":5,"color":3},"3084":{"id":3084,"name":"青釭","type":3,"number":6,"color":3},"3085":{"id":3085,"name":"杀","type":1,"number":7,"color":3},"3086":{"id":3086,"name":"杀","type":1,"number":8,"color":3},"3087":{"id":3087,"name":"杀","type":1,"number":9,"color":3},"3088":{"id":3088,"name":"杀","type":1,"number":10,"color":3},"3089":{"id":3089,"name":"顺手","type":2,"number":11,"color":3},"3090":{"id":3090,"name":"过河","type":2,"number":12,"color":3},"3091":{"id":3091,"name":"南蛮","type":2,"number":13,"color":3},"3092":{"id":3092,"name":"八卦","type":3,"number":2,"color":3},"3093":{"id":3093,"name":"过河","type":2,"number":3,"color":3},"3094":{"id":3094,"name":"过河","type":2,"number":4,"color":3},"3095":{"id":3095,"name":"青龙","type":3,"number":5,"color":3},"3096":{"id":3096,"name":"乐不","type":2,"number":6,"color":3},"3097":{"id":3097,"name":"南蛮","type":2,"number":7,"color":3},"3098":{"id":3098,"name":"杀","type":1,"number":8,"color":3},"3099":{"id":3099,"name":"杀","type":1,"number":9,"color":3},"3100":{"id":3100,"name":"杀","type":1,"number":10,"color":3},"3101":{"id":3101,"name":"无懈","type":2,"number":11,"color":3},"3102":{"id":3102,"name":"丈八","type":3,"number":12,"color":3},"3103":{"id":3103,"name":"大宛","type":3,"number":13,"color":3},"3104":{"id":3104,"name":"仁王","type":3,"number":2,"color":4},"3105":{"id":3105,"name":"寒冰","type":3,"number":1,"color":3},"3106":{"id":3106,"name":"无懈","type":2,"number":1,"color":1},"3107":{"id":3107,"name":"火攻","type":2,"number":2,"color":1},"3108":{"id":3108,"name":"火攻","type":2,"number":3,"color":1},"3109":{"id":3109,"name":"火杀","type":1,"number":4,"color":1},"3110":{"id":3110,"name":"桃","type":1,"number":5,"color":1},"3111":{"id":3111,"name":"桃","type":1,"number":6,"color":1},"3112":{"id":3112,"name":"火杀","type":1,"number":7,"color":1},"3113":{"id":3113,"name":"闪","type":1,"number":8,"color":1},"3114":{"id":3114,"name":"闪","type":1,"number":9,"color":1},"3115":{"id":3115,"name":"火杀","type":1,"number":10,"color":1},"3116":{"id":3116,"name":"闪","type":1,"number":11,"color":1},"3117":{"id":3117,"name":"闪","type":1,"number":12,"color":1},"3118":{"id":3118,"name":"无懈","type":2,"number":13,"color":1},"3119":{"id":3119,"name":"朱雀","type":3,"number":1,"color":2},"3120":{"id":3120,"name":"桃","type":1,"number":2,"color":2},"3121":{"id":3121,"name":"桃","type":1,"number":3,"color":2},"3122":{"id":3122,"name":"火杀","type":1,"number":4,"color":2},"3123":{"id":3123,"name":"火杀","type":1,"number":5,"color":2},"3124":{"id":3124,"name":"闪","type":1,"number":6,"color":2},"3125":{"id":3125,"name":"闪","type":1,"number":7,"color":2},"3126":{"id":3126,"name":"闪","type":1,"number":8,"color":2},"3127":{"id":3127,"name":"酒","type":1,"number":9,"color":2},"3128":{"id":3128,"name":"闪","type":1,"number":10,"color":2},"3129":{"id":3129,"name":"闪","type":1,"number":11,"color":2},"3130":{"id":3130,"name":"火攻","type":2,"number":12,"color":2},"3131":{"id":3131,"name":"骅骝","type":3,"number":13,"color":2},"3132":{"id":3132,"name":"古锭","type":3,"number":1,"color":3},"3133":{"id":3133,"name":"藤甲","type":3,"number":2,"color":3},"3134":{"id":3134,"name":"酒","type":1,"number":3,"color":3},"3135":{"id":3135,"name":"雷杀","type":1,"number":4,"color":3},"3136":{"id":3136,"name":"雷杀","type":1,"number":5,"color":3},"3137":{"id":3137,"name":"雷杀","type":1,"number":6,"color":3},"3138":{"id":3138,"name":"雷杀","type":1,"number":7,"color":3},"3139":{"id":3139,"name":"雷杀","type":1,"number":8,"color":3},"3140":{"id":3140,"name":"酒","type":1,"number":9,"color":3},"3141":{"id":3141,"name":"兵粮","type":2,"number":10,"color":3},"3142":{"id":3142,"name":"铁索","type":2,"number":11,"color":3},"3143":{"id":3143,"name":"铁索","type":2,"number":12,"color":3},"3144":{"id":3144,"name":"无懈","type":2,"number":13,"color":3},"3145":{"id":3145,"name":"白银","type":3,"number":1,"color":4},"3146":{"id":3146,"name":"酒","type":1,"number":3,"color":4},"3147":{"id":3147,"name":"兵粮","type":2,"number":4,"color":4},"3148":{"id":3148,"name":"雷杀","type":1,"number":5,"color":4},"3149":{"id":3149,"name":"雷杀","type":1,"number":6,"color":4},"3150":{"id":3150,"name":"雷杀","type":1,"number":7,"color":4},"3151":{"id":3151,"name":"雷杀","type":1,"number":8,"color":4},"3152":{"id":3152,"name":"酒","type":1,"number":9,"color":4},"3153":{"id":3153,"name":"铁索","type":2,"number":10,"color":4},"3154":{"id":3154,"name":"铁索","type":2,"number":11,"color":4},"3155":{"id":3155,"name":"铁索","type":2,"number":12,"color":4},"3156":{"id":3156,"name":"铁索","type":2,"number":13,"color":4},"4001":{"id":4001,"name":"决斗","type":2,"number":1,"color":3},"4002":{"id":4002,"name":"闪电","type":2,"number":1,"color":3},"4003":{"id":4003,"name":"寒冰","type":3,"number":2,"color":3},"4004":{"id":4004,"name":"八卦","type":3,"number":2,"color":3},"4005":{"id":4005,"name":"顺手","type":2,"number":3,"color":3},"4006":{"id":4006,"name":"过河","type":2,"number":3,"color":3},"4007":{"id":4007,"name":"顺手","type":2,"number":4,"color":3},"4008":{"id":4008,"name":"过河","type":2,"number":4,"color":3},"4009":{"id":4009,"name":"绝影","type":3,"number":5,"color":3},"4010":{"id":4010,"name":"兵粮","type":2,"number":5,"color":3},"4011":{"id":4011,"name":"过河","type":2,"number":6,"color":3},"4012":{"id":4012,"name":"乐不","type":2,"number":6,"color":3},"4013":{"id":4013,"name":"雷杀","type":1,"number":7,"color":3},"4014":{"id":4014,"name":"南蛮","type":2,"number":7,"color":3},"4015":{"id":4015,"name":"雷杀","type":1,"number":8,"color":3},"4016":{"id":4016,"name":"雷杀","type":1,"number":8,"color":3},"4017":{"id":4017,"name":"酒","type":1,"number":9,"color":3},"4018":{"id":4018,"name":"雷杀","type":1,"number":9,"color":3},"4019":{"id":4019,"name":"雷杀","type":1,"number":10,"color":3},"4020":{"id":4020,"name":"雷杀","type":1,"number":10,"color":3},"4021":{"id":4021,"name":"顺手","type":2,"number":11,"color":3},"4022":{"id":4022,"name":"无懈","type":2,"number":11,"color":3},"4023":{"id":4023,"name":"过河","type":2,"number":12,"color":3},"4024":{"id":4024,"name":"丈八","type":3,"number":12,"color":3},"4025":{"id":4025,"name":"南蛮","type":2,"number":13,"color":3},"4026":{"id":4026,"name":"大宛","type":3,"number":13,"color":3},"4027":{"id":4027,"name":"万箭","type":2,"number":1,"color":1},"4028":{"id":4028,"name":"桃园","type":2,"number":1,"color":1},"4029":{"id":4029,"name":"闪","type":1,"number":2,"color":1},"4030":{"id":4030,"name":"闪","type":1,"number":2,"color":1},"4031":{"id":4031,"name":"五谷","type":2,"number":3,"color":1},"4032":{"id":4032,"name":"火攻","type":2,"number":3,"color":1},"4033":{"id":4033,"name":"五谷","type":2,"number":4,"color":1},"4034":{"id":4034,"name":"火攻","type":2,"number":4,"color":1},"4035":{"id":4035,"name":"火攻","type":2,"number":5,"color":1},"4036":{"id":4036,"name":"麒麟","type":3,"number":5,"color":1},"4037":{"id":4037,"name":"无中","type":2,"number":6,"color":1},"4038":{"id":4038,"name":"桃","type":1,"number":6,"color":1},"4039":{"id":4039,"name":"无中","type":2,"number":7,"color":1},"4040":{"id":4040,"name":"桃","type":1,"number":7,"color":1},"4041":{"id":4041,"name":"无中","type":2,"number":8,"color":1},"4042":{"id":4042,"name":"桃","type":1,"number":8,"color":1},"4043":{"id":4043,"name":"无中","type":2,"number":9,"color":1},"4044":{"id":4044,"name":"桃","type":1,"number":9,"color":1},"4045":{"id":4045,"name":"火杀","type":1,"number":10,"color":1},"4046":{"id":4046,"name":"火杀","type":1,"number":10,"color":1},"4047":{"id":4047,"name":"无中","type":2,"number":11,"color":1},"4048":{"id":4048,"name":"火杀","type":1,"number":11,"color":1},"4049":{"id":4049,"name":"无中","type":2,"number":12,"color":1},"4050":{"id":4050,"name":"过河","type":2,"number":12,"color":1},"4051":{"id":4051,"name":"桃园","type":2,"number":13,"color":1},"4052":{"id":4052,"name":"爪黄","type":3,"number":13,"color":1},"4053":{"id":4053,"name":"决斗","type":2,"number":1,"color":4},"4054":{"id":4054,"name":"白银","type":3,"number":1,"color":4},"4055":{"id":4055,"name":"铁索","type":2,"number":2,"color":4},"4056":{"id":4056,"name":"铁索","type":2,"number":2,"color":4},"4057":{"id":4057,"name":"铁索","type":2,"number":3,"color":4},"4058":{"id":4058,"name":"过河","type":2,"number":3,"color":4},"4059":{"id":4059,"name":"铁索","type":2,"number":4,"color":4},"4060":{"id":4060,"name":"过河","type":2,"number":4,"color":4},"4061":{"id":4061,"name":"铁索","type":2,"number":5,"color":4},"4062":{"id":4062,"name":"铁索","type":2,"number":5,"color":4},"4063":{"id":4063,"name":"雷杀","type":1,"number":6,"color":4},"4064":{"id":4064,"name":"乐不","type":2,"number":6,"color":4},"4065":{"id":4065,"name":"杀","type":1,"number":7,"color":4},"4066":{"id":4066,"name":"南蛮","type":2,"number":7,"color":4},"4067":{"id":4067,"name":"杀","type":1,"number":8,"color":4},"4068":{"id":4068,"name":"杀","type":1,"number":8,"color":4},"4069":{"id":4069,"name":"杀","type":1,"number":9,"color":4},"4070":{"id":4070,"name":"酒","type":1,"number":9,"color":4},"4071":{"id":4071,"name":"杀","type":1,"number":10,"color":4},"4072":{"id":4072,"name":"杀","type":1,"number":10,"color":4},"4073":{"id":4073,"name":"杀","type":1,"number":11,"color":4},"4074":{"id":4074,"name":"杀","type":1,"number":11,"color":4},"4075":{"id":4075,"name":"无懈","type":2,"number":12,"color":4},"4076":{"id":4076,"name":"借刀","type":2,"number":12,"color":4},"4077":{"id":4077,"name":"无懈","type":2,"number":13,"color":4},"4078":{"id":4078,"name":"借刀","type":2,"number":13,"color":4},"4079":{"id":4079,"name":"决斗","type":2,"number":1,"color":2},"4080":{"id":4080,"name":"决斗","type":2,"number":1,"color":2},"4081":{"id":4081,"name":"铁索","type":2,"number":2,"color":2},"4082":{"id":4082,"name":"决斗","type":2,"number":2,"color":2},"4083":{"id":4083,"name":"顺手","type":2,"number":3,"color":2},"4084":{"id":4084,"name":"无懈","type":2,"number":3,"color":2},"4085":{"id":4085,"name":"顺手","type":2,"number":4,"color":2},"4086":{"id":4086,"name":"兵粮","type":2,"number":4,"color":2},"4087":{"id":4087,"name":"贯石","type":3,"number":5,"color":2},"4088":{"id":4088,"name":"闪","type":1,"number":5,"color":2},"4089":{"id":4089,"name":"顺手","type":2,"number":6,"color":2},"4090":{"id":4090,"name":"闪","type":1,"number":6,"color":2},"4091":{"id":4091,"name":"杀","type":1,"number":7,"color":2},"4092":{"id":4092,"name":"闪","type":1,"number":7,"color":2},"4093":{"id":4093,"name":"杀","type":1,"number":8,"color":2},"4094":{"id":4094,"name":"闪","type":1,"number":8,"color":2},"4095":{"id":4095,"name":"酒","type":1,"number":9,"color":2},"4096":{"id":4096,"name":"闪","type":1,"number":9,"color":2},"4097":{"id":4097,"name":"火攻","type":2,"number":10,"color":2},"4098":{"id":4098,"name":"闪","type":1,"number":10,"color":2},"4099":{"id":4099,"name":"闪","type":1,"number":11,"color":2},"4100":{"id":4100,"name":"闪","type":1,"number":11,"color":2},"4101":{"id":4101,"name":"方天","type":3,"number":12,"color":2},"4102":{"id":4102,"name":"桃","type":1,"number":12,"color":2},"4103":{"id":4103,"name":"紫騂","type":3,"number":13,"color":2},"4104":{"id":4104,"name":"火攻","type":2,"number":13,"color":2},"4200":{"id":4200,"name":"麒麟","type":3,"number":5,"color":1},"4201":{"id":4201,"name":"麒麟","type":3,"number":5,"color":1},"4202":{"id":4202,"name":"麒麟","type":3,"number":5,"color":1},"4203":{"id":4203,"name":"麒麟","type":3,"number":5,"color":1},"4204":{"id":4204,"name":"麒麟","type":3,"number":5,"color":1},"4205":{"id":4205,"name":"麒麟","type":3,"number":5,"color":1},"4206":{"id":4206,"name":"麒麟","type":3,"number":5,"color":1},"4207":{"id":4207,"name":"爪黄","type":3,"number":13,"color":1},"4208":{"id":4208,"name":"爪黄","type":3,"number":13,"color":1},"4209":{"id":4209,"name":"爪黄","type":3,"number":13,"color":1},"4210":{"id":4210,"name":"爪黄","type":3,"number":13,"color":1},"4211":{"id":4211,"name":"爪黄","type":3,"number":13,"color":1},"4212":{"id":4212,"name":"爪黄","type":3,"number":13,"color":1},"4213":{"id":4213,"name":"爪黄","type":3,"number":13,"color":1},"4214":{"id":4214,"name":"大宛","type":3,"number":13,"color":3},"4215":{"id":4215,"name":"大宛","type":3,"number":13,"color":3},"4216":{"id":4216,"name":"大宛","type":3,"number":13,"color":3},"4217":{"id":4217,"name":"大宛","type":3,"number":13,"color":3},"4218":{"id":4218,"name":"大宛","type":3,"number":13,"color":3},"4219":{"id":4219,"name":"大宛","type":3,"number":13,"color":3},"4220":{"id":4220,"name":"大宛","type":3,"number":13,"color":3},"4300":{"id":4300,"name":"屯粮","type":2,"number":3,"color":1},"4301":{"id":4301,"name":"屯粮","type":2,"number":4,"color":1},"4302":{"id":4302,"name":"援军","type":2,"number":12,"color":1},"4303":{"id":4303,"name":"援军","type":2,"number":11,"color":1},"4304":{"id":4304,"name":"援军","type":2,"number":1,"color":3},"4305":{"id":4305,"name":"勠力","type":2,"number":7,"color":3},"4306":{"id":4306,"name":"勠力","type":2,"number":13,"color":3},"4307":{"id":4307,"name":"勠力","type":2,"number":7,"color":4},"4308":{"id":4308,"name":"霹雳","type":3,"number":9,"color":2},"4309":{"id":4309,"name":"爆竹","type":2,"number":1,"color":1},"4310":{"id":4310,"name":"爆竹","type":2,"number":6,"color":1},"4311":{"id":4311,"name":"爆竹","type":2,"number":8,"color":1},"4313":{"id":4313,"name":"春联","type":2,"number":1,"color":2},"4314":{"id":4314,"name":"春联","type":2,"number":13,"color":2},"4317":{"id":4317,"name":"决斗","type":2,"number":1,"color":3},"4318":{"id":4318,"name":"决斗","type":2,"number":12,"color":1},"4319":{"id":4319,"name":"决斗","type":2,"number":1,"color":1},"4320":{"id":4320,"name":"决斗","type":2,"number":12,"color":2},"4321":{"id":4321,"name":"火攻","type":2,"number":7,"color":3},"4322":{"id":4322,"name":"火攻","type":2,"number":7,"color":4},"4323":{"id":4323,"name":"火攻","type":2,"number":13,"color":3},"4324":{"id":4324,"name":"联军","type":2,"number":3,"color":1},"4325":{"id":4325,"name":"联军","type":2,"number":4,"color":1},"4326":{"id":4326,"name":"联军","type":2,"number":1,"color":1},"4327":{"id":4327,"name":"无双","type":3,"number":12,"color":2},"4328":{"id":4328,"name":"束发","type":3,"number":1,"color":2},"4329":{"id":4329,"name":"红棉","type":3,"number":1,"color":4},"4330":{"id":4330,"name":"玲珑","type":3,"number":2,"color":3},"4331":{"id":4331,"name":"玲珑","type":3,"number":2,"color":4},"4332":{"id":4332,"name":"逆水","type":2,"number":1,"color":1},"4333":{"id":4333,"name":"逆水","type":2,"number":7,"color":4},"4334":{"id":4334,"name":"逆水","type":2,"number":13,"color":3},"4335":{"id":4335,"name":"逆水","type":2,"number":7,"color":3},"4339":{"id":4339,"name":"鸾凤","type":3,"number":2,"color":3},"4340":{"id":4340,"name":"七彩","type":3,"number":13,"color":1},"4341":{"id":4341,"name":"修罗","type":3,"number":13,"color":2},"4342":{"id":4342,"name":"银月","type":3,"number":2,"color":3},"4343":{"id":4343,"name":"镰钩","type":3,"number":1,"color":4},"4344":{"id":4344,"name":"水淹","type":2,"number":7,"color":1},"4345":{"id":4345,"name":"金鼓","type":2,"number":8,"color":2},"4346":{"id":4346,"name":"厚积","type":2,"number":2,"color":1},"4347":{"id":4347,"name":"桎梏","type":2,"number":3,"color":2},"4348":{"id":4348,"name":"盈冲","type":2,"number":4,"color":3},"4349":{"id":4349,"name":"背水","type":2,"number":5,"color":4},"4350":{"id":4350,"name":"整肃","type":2,"number":6,"color":1},"4351":{"id":4351,"name":"寸兵","type":2,"number":7,"color":2},"4352":{"id":4352,"name":"护心","type":3,"number":2,"color":3},"4355":{"id":4355,"name":"酗酒","type":1,"number":9,"color":2},"4356":{"id":4356,"name":"酗酒","type":1,"number":3,"color":3},"4357":{"id":4357,"name":"酗酒","type":1,"number":9,"color":3},"4358":{"id":4358,"name":"酗酒","type":1,"number":3,"color":4},"4359":{"id":4359,"name":"酗酒","type":1,"number":9,"color":4},"4400":{"id":4400,"name":"回魂","type":2,"number":3,"color":1},"4401":{"id":4401,"name":"回魂","type":2,"number":4,"color":4},"6000":{"id":6000,"name":"决斗","type":2,"number":1,"color":3},"6001":{"id":6001,"name":"太公","type":3,"number":1,"color":3},"6002":{"id":6002,"name":"百辟","type":3,"number":2,"color":3},"6003":{"id":6003,"name":"藤甲","type":3,"number":2,"color":3},"6004":{"id":6004,"name":"随机","type":2,"number":2,"color":3},"6005":{"id":6005,"name":"逐近","type":2,"number":3,"color":3},"6006":{"id":6006,"name":"水淹","type":2,"number":3,"color":3},"6007":{"id":6007,"name":"逐近","type":2,"number":4,"color":3},"6008":{"id":6008,"name":"水淹","type":2,"number":4,"color":3},"6009":{"id":6009,"name":"三略","type":3,"number":5,"color":3},"6010":{"id":6010,"name":"冰杀","type":1,"number":7,"color":3},"6011":{"id":6011,"name":"冰杀","type":1,"number":7,"color":3},"6012":{"id":6012,"name":"党同","type":2,"number":7,"color":3},"6013":{"id":6013,"name":"冰杀","type":1,"number":8,"color":3},"6014":{"id":6014,"name":"冰杀","type":1,"number":8,"color":3},"6015":{"id":6015,"name":"冰杀","type":1,"number":8,"color":3},"6016":{"id":6016,"name":"杀","type":1,"number":9,"color":3},"6017":{"id":6017,"name":"杀","type":1,"number":9,"color":3},"6018":{"id":6018,"name":"杀","type":1,"number":10,"color":3},"6019":{"id":6019,"name":"杀","type":1,"number":10,"color":3},"6020":{"id":6020,"name":"顺手","type":2,"number":11,"color":3},"6021":{"id":6021,"name":"逐近","type":2,"number":12,"color":3},"6022":{"id":6022,"name":"无懈","type":2,"number":13,"color":3},"6023":{"id":6023,"name":"天机","type":3,"number":12,"color":4},"6024":{"id":6024,"name":"燎原","type":2,"number":1,"color":1},"6025":{"id":6025,"name":"闪","type":1,"number":2,"color":1},"6026":{"id":6026,"name":"闪","type":1,"number":2,"color":1},"6027":{"id":6027,"name":"过河","type":2,"number":2,"color":1},"6028":{"id":6028,"name":"出其","type":2,"number":3,"color":1},"6029":{"id":6029,"name":"五谷","type":2,"number":4,"color":1},"6030":{"id":6030,"name":"洞烛","type":2,"number":7,"color":1},"6031":{"id":6031,"name":"洞烛","type":2,"number":8,"color":1},"6032":{"id":6032,"name":"洞烛","type":2,"number":9,"color":1},"6033":{"id":6033,"name":"火杀","type":1,"number":10,"color":1},"6034":{"id":6034,"name":"洞烛","type":2,"number":11,"color":1},"6035":{"id":6035,"name":"无懈","type":2,"number":13,"color":1},"6036":{"id":6036,"name":"决斗","type":2,"number":1,"color":4},"6037":{"id":6037,"name":"护心","type":3,"number":1,"color":4},"6038":{"id":6038,"name":"杀","type":1,"number":2,"color":4},"6039":{"id":6039,"name":"黑光","type":3,"number":2,"color":4},"6040":{"id":6040,"name":"藤甲","type":3,"number":2,"color":4},"6041":{"id":6041,"name":"杀","type":1,"number":3,"color":4},"6042":{"id":6042,"name":"逐近","type":2,"number":3,"color":4},"6043":{"id":6043,"name":"杀","type":1,"number":4,"color":4},"6044":{"id":6044,"name":"逐近","type":2,"number":4,"color":4},"6045":{"id":6045,"name":"杀","type":1,"number":5,"color":4},"6046":{"id":6046,"name":"燎原","type":2,"number":7,"color":4},"6047":{"id":6047,"name":"雷杀","type":1,"number":9,"color":4},"6048":{"id":6048,"name":"雷杀","type":1,"number":9,"color":4},"6049":{"id":6049,"name":"雷杀","type":1,"number":10,"color":4},"6050":{"id":6050,"name":"雷杀","type":1,"number":10,"color":4},"6051":{"id":6051,"name":"杀","type":1,"number":11,"color":4},"6052":{"id":6052,"name":"党同","type":2,"number":12,"color":4},"6053":{"id":6053,"name":"铜雀","type":3,"number":13,"color":4},"6054":{"id":6054,"name":"五行","type":3,"number":1,"color":2},"6055":{"id":6055,"name":"闪","type":1,"number":2,"color":2},"6056":{"id":6056,"name":"闪","type":1,"number":2,"color":2},"6057":{"id":6057,"name":"党同","type":2,"number":3,"color":2},"6058":{"id":6058,"name":"火杀","type":1,"number":4,"color":2},"6059":{"id":6059,"name":"杀","type":1,"number":8,"color":2},"6060":{"id":6060,"name":"火杀","type":1,"number":10,"color":2},"6061":{"id":6061,"name":"出其","type":2,"number":12,"color":2},"6062":{"id":6062,"name":"乌铁","type":3,"number":12,"color":2},"6063":{"id":6063,"name":"镔铁","type":3,"number":13,"color":2},"6064":{"id":6064,"name":"南蛮","type":2,"number":13,"color":3},"6065":{"id":6065,"name":"南蛮","type":2,"number":7,"color":3},"6066":{"id":6066,"name":"桃园","type":2,"number":1,"color":1},"6067":{"id":6067,"name":"万箭","type":2,"number":1,"color":1},"6068":{"id":6068,"name":"南蛮","type":2,"number":7,"color":4},"6069":{"id":6069,"name":"闪","type":1,"number":4,"color":2},"6100":{"id":6100,"name":"水淹","type":2,"number":3,"color":3},"6101":{"id":6101,"name":"水淹","type":2,"number":4,"color":3},"6102":{"id":6102,"name":"冰杀","type":1,"number":8,"color":3},"6103":{"id":6103,"name":"杀","type":1,"number":10,"color":3},"6104":{"id":6104,"name":"杀","type":1,"number":11,"color":3},"6105":{"id":6105,"name":"南蛮","type":2,"number":13,"color":3},"6106":{"id":6106,"name":"逐近","type":2,"number":3,"color":3},"6107":{"id":6107,"name":"冰杀","type":1,"number":6,"color":3},"6108":{"id":6108,"name":"冰杀","type":1,"number":7,"color":3},"6109":{"id":6109,"name":"冰杀","type":1,"number":8,"color":3},"6110":{"id":6110,"name":"无懈","type":2,"number":11,"color":3},"6111":{"id":6111,"name":"乌铁","type":3,"number":13,"color":3},"6112":{"id":6112,"name":"火杀","type":1,"number":4,"color":1},"6113":{"id":6113,"name":"洞烛","type":2,"number":7,"color":1},"6114":{"id":6114,"name":"洞烛","type":2,"number":8,"color":1},"6115":{"id":6115,"name":"出其","type":2,"number":2,"color":1},"6116":{"id":6116,"name":"出其","type":2,"number":3,"color":1},"6117":{"id":6117,"name":"太公","type":3,"number":2,"color":3},"6118":{"id":6118,"name":"藤甲","type":3,"number":2,"color":4},"6119":{"id":6119,"name":"南蛮","type":2,"number":7,"color":4},"6120":{"id":6120,"name":"杀","type":1,"number":4,"color":4},"6121":{"id":6121,"name":"杀","type":1,"number":5,"color":4},"6122":{"id":6122,"name":"护心","type":3,"number":1,"color":4},"6123":{"id":6123,"name":"铜雀","type":3,"number":5,"color":4},"6124":{"id":6124,"name":"逐近","type":2,"number":12,"color":4},"6125":{"id":6125,"name":"五行","type":3,"number":1,"color":2},"6126":{"id":6126,"name":"闪","type":1,"number":7,"color":2},"6127":{"id":6127,"name":"闪","type":1,"number":7,"color":2},"6128":{"id":6128,"name":"闪","type":1,"number":8,"color":2},"6129":{"id":6129,"name":"闪","type":1,"number":8,"color":2},"6130":{"id":6130,"name":"火杀","type":1,"number":4,"color":1},"6200":{"id":6200,"name":"决斗","type":2,"number":1,"color":3},"6201":{"id":6201,"name":"铜雀","type":3,"number":9,"color":3},"6202":{"id":6202,"name":"冰杀","type":1,"number":4,"color":4},"6203":{"id":6203,"name":"冰杀","type":1,"number":5,"color":4},"6204":{"id":6204,"name":"冰杀","type":1,"number":6,"color":4},"6205":{"id":6205,"name":"无懈","type":2,"number":13,"color":4},"6206":{"id":6206,"name":"闪","type":1,"number":2,"color":1},"6207":{"id":6207,"name":"洞烛","type":2,"number":7,"color":1},"6208":{"id":6208,"name":"洞烛","type":2,"number":8,"color":1},"6209":{"id":6209,"name":"杀","type":1,"number":10,"color":1},"6210":{"id":6210,"name":"杀","type":1,"number":11,"color":1},"6211":{"id":6211,"name":"闪","type":1,"number":2,"color":2},"6212":{"id":6212,"name":"闪","type":1,"number":3,"color":2},"6300":{"id":6300,"name":"决斗","type":2,"number":1,"color":3},"6301":{"id":6301,"name":"太公","type":3,"number":1,"color":3},"6303":{"id":6303,"name":"藤甲","type":3,"number":2,"color":3},"6304":{"id":6304,"name":"随机","type":2,"number":2,"color":3},"6305":{"id":6305,"name":"逐近","type":2,"number":3,"color":3},"6306":{"id":6306,"name":"水淹","type":2,"number":3,"color":3},"6308":{"id":6308,"name":"水淹","type":2,"number":4,"color":3},"6310":{"id":6310,"name":"冰杀","type":1,"number":7,"color":3},"6311":{"id":6311,"name":"冰杀","type":1,"number":7,"color":3},"6313":{"id":6313,"name":"冰杀","type":1,"number":8,"color":3},"6314":{"id":6314,"name":"冰杀","type":1,"number":8,"color":3},"6315":{"id":6315,"name":"冰杀","type":1,"number":8,"color":3},"6316":{"id":6316,"name":"杀","type":1,"number":9,"color":3},"6317":{"id":6317,"name":"杀","type":1,"number":9,"color":3},"6318":{"id":6318,"name":"杀","type":1,"number":10,"color":3},"6319":{"id":6319,"name":"杀","type":1,"number":10,"color":3},"6320":{"id":6320,"name":"顺手","type":2,"number":11,"color":3},"6321":{"id":6321,"name":"逐近","type":2,"number":12,"color":3},"6322":{"id":6322,"name":"无懈","type":2,"number":13,"color":3},"6323":{"id":6323,"name":"天机","type":3,"number":12,"color":4},"6325":{"id":6325,"name":"闪","type":1,"number":2,"color":1},"6326":{"id":6326,"name":"闪","type":1,"number":2,"color":1},"6327":{"id":6327,"name":"过河","type":2,"number":2,"color":1},"6328":{"id":6328,"name":"出其","type":2,"number":3,"color":1},"6329":{"id":6329,"name":"五谷","type":2,"number":4,"color":1},"6330":{"id":6330,"name":"洞烛","type":2,"number":7,"color":1},"6331":{"id":6331,"name":"洞烛","type":2,"number":8,"color":1},"6332":{"id":6332,"name":"洞烛","type":2,"number":9,"color":1},"6333":{"id":6333,"name":"火杀","type":1,"number":10,"color":1},"6334":{"id":6334,"name":"洞烛","type":2,"number":11,"color":1},"6335":{"id":6335,"name":"无懈","type":2,"number":13,"color":1},"6336":{"id":6336,"name":"决斗","type":2,"number":1,"color":4},"6337":{"id":6337,"name":"护心","type":3,"number":1,"color":4},"6338":{"id":6338,"name":"杀","type":1,"number":2,"color":4},"6339":{"id":6339,"name":"黑光","type":3,"number":2,"color":4},"6340":{"id":6340,"name":"藤甲","type":3,"number":2,"color":4},"6341":{"id":6341,"name":"杀","type":1,"number":3,"color":4},"6342":{"id":6342,"name":"逐近","type":2,"number":3,"color":4},"6343":{"id":6343,"name":"杀","type":1,"number":4,"color":4},"6344":{"id":6344,"name":"逐近","type":2,"number":4,"color":4},"6345":{"id":6345,"name":"杀","type":1,"number":5,"color":4},"6347":{"id":6347,"name":"雷杀","type":1,"number":9,"color":4},"6348":{"id":6348,"name":"雷杀","type":1,"number":9,"color":4},"6349":{"id":6349,"name":"雷杀","type":1,"number":10,"color":4},"6350":{"id":6350,"name":"雷杀","type":1,"number":10,"color":4},"6351":{"id":6351,"name":"杀","type":1,"number":11,"color":4},"6353":{"id":6353,"name":"铜雀","type":3,"number":13,"color":4},"6354":{"id":6354,"name":"五行","type":3,"number":1,"color":2},"6355":{"id":6355,"name":"闪","type":1,"number":2,"color":2},"6356":{"id":6356,"name":"闪","type":1,"number":2,"color":2},"6358":{"id":6358,"name":"火杀","type":1,"number":4,"color":2},"6359":{"id":6359,"name":"杀","type":1,"number":8,"color":2},"6360":{"id":6360,"name":"火杀","type":1,"number":10,"color":2},"6361":{"id":6361,"name":"出其","type":2,"number":12,"color":2},"6362":{"id":6362,"name":"乌铁","type":3,"number":12,"color":2},"6364":{"id":6364,"name":"南蛮","type":2,"number":13,"color":3},"6365":{"id":6365,"name":"南蛮","type":2,"number":7,"color":3},"6366":{"id":6366,"name":"桃园","type":2,"number":1,"color":1},"6367":{"id":6367,"name":"万箭","type":2,"number":1,"color":1},"6368":{"id":6368,"name":"南蛮","type":2,"number":7,"color":4},"6369":{"id":6369,"name":"闪","type":1,"number":4,"color":2},"7001":{"id":7001,"name":"决斗","type":2,"number":1,"color":2},"7002":{"id":7002,"name":"顺手","type":2,"number":3,"color":2},"7003":{"id":7003,"name":"顺手","type":2,"number":4,"color":2},"7004":{"id":7004,"name":"贯石","type":3,"number":5,"color":2},"7005":{"id":7005,"name":"杀","type":1,"number":6,"color":2},"7006":{"id":7006,"name":"杀","type":1,"number":7,"color":2},"7007":{"id":7007,"name":"杀","type":1,"number":9,"color":2},"7008":{"id":7008,"name":"闪","type":1,"number":11,"color":2},"7009":{"id":7009,"name":"紫騂","type":3,"number":13,"color":2},"7010":{"id":7010,"name":"诸葛","type":3,"number":1,"color":2},"7011":{"id":7011,"name":"闪","type":1,"number":3,"color":2},"7012":{"id":7012,"name":"闪","type":1,"number":5,"color":2},"7013":{"id":7013,"name":"闪","type":1,"number":6,"color":2},"7014":{"id":7014,"name":"闪","type":1,"number":7,"color":2},"7015":{"id":7015,"name":"闪","type":1,"number":8,"color":2},"7016":{"id":7016,"name":"闪","type":1,"number":9,"color":2},"7017":{"id":7017,"name":"闪","type":1,"number":10,"color":2},"7018":{"id":7018,"name":"闪","type":1,"number":11,"color":2},"7019":{"id":7019,"name":"桃","type":1,"number":12,"color":2},"7020":{"id":7020,"name":"杀","type":1,"number":13,"color":2},"7021":{"id":7021,"name":"五谷","type":2,"number":3,"color":1},"7022":{"id":7022,"name":"赤兔","type":3,"number":5,"color":1},"7023":{"id":7023,"name":"乐不","type":2,"number":6,"color":1},"7024":{"id":7024,"name":"杀","type":1,"number":10,"color":1},"7025":{"id":7025,"name":"过河","type":2,"number":12,"color":1},"7026":{"id":7026,"name":"闪","type":1,"number":13,"color":1},"7027":{"id":7027,"name":"桃","type":1,"number":3,"color":1},"7028":{"id":7028,"name":"桃","type":1,"number":4,"color":1},"7029":{"id":7029,"name":"麒麟","type":3,"number":5,"color":1},"7030":{"id":7030,"name":"桃","type":1,"number":6,"color":1},"7031":{"id":7031,"name":"桃","type":1,"number":7,"color":1},"7032":{"id":7032,"name":"桃","type":1,"number":8,"color":1},"7033":{"id":7033,"name":"桃","type":1,"number":9,"color":1},"7034":{"id":7034,"name":"杀","type":1,"number":10,"color":1},"7035":{"id":7035,"name":"杀","type":1,"number":11,"color":1},"7036":{"id":7036,"name":"桃","type":1,"number":12,"color":1},"7037":{"id":7037,"name":"爪黄","type":3,"number":13,"color":1},"7038":{"id":7038,"name":"杀","type":1,"number":6,"color":4},"7039":{"id":7039,"name":"杀","type":1,"number":7,"color":4},"7040":{"id":7040,"name":"杀","type":1,"number":8,"color":4},"7041":{"id":7041,"name":"杀","type":1,"number":11,"color":4},"7042":{"id":7042,"name":"无懈","type":2,"number":12,"color":4},"7043":{"id":7043,"name":"无懈","type":2,"number":13,"color":4},"7044":{"id":7044,"name":"诸葛","type":3,"number":1,"color":4},"7045":{"id":7045,"name":"的卢","type":3,"number":5,"color":4},"7046":{"id":7046,"name":"乐不","type":2,"number":6,"color":4},"7047":{"id":7047,"name":"杀","type":1,"number":8,"color":4},"7048":{"id":7048,"name":"雌雄","type":3,"number":2,"color":3},"7049":{"id":7049,"name":"绝影","type":3,"number":5,"color":3},"7050":{"id":7050,"name":"青釭","type":3,"number":6,"color":3},"7051":{"id":7051,"name":"八卦","type":3,"number":2,"color":3},"7052":{"id":7052,"name":"过河","type":2,"number":4,"color":3},"7053":{"id":7053,"name":"青龙","type":3,"number":5,"color":3},"7054":{"id":7054,"name":"乐不","type":2,"number":6,"color":3},"7055":{"id":7055,"name":"无懈","type":2,"number":11,"color":3},"7056":{"id":7056,"name":"丈八","type":3,"number":12,"color":3},"7057":{"id":7057,"name":"大宛","type":3,"number":13,"color":3},"7058":{"id":7058,"name":"闪电","type":2,"number":12,"color":1},"7059":{"id":7059,"name":"无懈","type":2,"number":12,"color":2},"7060":{"id":7060,"name":"仁王","type":3,"number":2,"color":4},"7061":{"id":7061,"name":"无懈","type":2,"number":1,"color":1},"7062":{"id":7062,"name":"火杀","type":1,"number":4,"color":1},"7063":{"id":7063,"name":"桃","type":1,"number":5,"color":1},"7064":{"id":7064,"name":"桃","type":1,"number":6,"color":1},"7065":{"id":7065,"name":"火杀","type":1,"number":7,"color":1},"7066":{"id":7066,"name":"闪","type":1,"number":8,"color":1},"7067":{"id":7067,"name":"闪","type":1,"number":9,"color":1},"7068":{"id":7068,"name":"闪","type":1,"number":11,"color":1},"7069":{"id":7069,"name":"闪","type":1,"number":12,"color":1},"7070":{"id":7070,"name":"桃","type":1,"number":2,"color":2},"7071":{"id":7071,"name":"桃","type":1,"number":3,"color":2},"7072":{"id":7072,"name":"火杀","type":1,"number":5,"color":2},"7073":{"id":7073,"name":"闪","type":1,"number":6,"color":2},"7074":{"id":7074,"name":"闪","type":1,"number":7,"color":2},"7075":{"id":7075,"name":"闪","type":1,"number":8,"color":2},"7076":{"id":7076,"name":"酒","type":1,"number":9,"color":2},"7077":{"id":7077,"name":"闪","type":1,"number":10,"color":2},"7078":{"id":7078,"name":"闪","type":1,"number":11,"color":2},"7079":{"id":7079,"name":"骅骝","type":3,"number":13,"color":2},"7080":{"id":7080,"name":"古锭","type":3,"number":1,"color":3},"7081":{"id":7081,"name":"藤甲","type":3,"number":2,"color":3},"7082":{"id":7082,"name":"酒","type":1,"number":3,"color":3},"7083":{"id":7083,"name":"雷杀","type":1,"number":4,"color":3},"7084":{"id":7084,"name":"雷杀","type":1,"number":5,"color":3},"7085":{"id":7085,"name":"雷杀","type":1,"number":6,"color":3},"7086":{"id":7086,"name":"酒","type":1,"number":9,"color":3},"7087":{"id":7087,"name":"兵粮","type":2,"number":10,"color":3},"7088":{"id":7088,"name":"铁索","type":2,"number":11,"color":3},"7089":{"id":7089,"name":"铁索","type":2,"number":12,"color":3},"7090":{"id":7090,"name":"藤甲","type":3,"number":2,"color":4},"7091":{"id":7091,"name":"酒","type":1,"number":3,"color":4},"7092":{"id":7092,"name":"兵粮","type":2,"number":4,"color":4},"7093":{"id":7093,"name":"雷杀","type":1,"number":5,"color":4},"7094":{"id":7094,"name":"雷杀","type":1,"number":6,"color":4},"7095":{"id":7095,"name":"雷杀","type":1,"number":7,"color":4},"7096":{"id":7096,"name":"雷杀","type":1,"number":8,"color":4},"7097":{"id":7097,"name":"酒","type":1,"number":9,"color":4},"7098":{"id":7098,"name":"铁索","type":2,"number":10,"color":4},"7099":{"id":7099,"name":"铁索","type":2,"number":11,"color":4},"7100":{"id":7100,"name":"铁索","type":2,"number":12,"color":4},"7101":{"id":7101,"name":"铁索","type":2,"number":13,"color":4},"7102":{"id":7102,"name":"决斗","type":2,"number":1,"color":3},"7103":{"id":7103,"name":"太公","type":3,"number":1,"color":3},"7104":{"id":7104,"name":"随机","type":2,"number":2,"color":3},"7105":{"id":7105,"name":"逐近","type":2,"number":3,"color":3},"7106":{"id":7106,"name":"水淹","type":2,"number":3,"color":3},"7107":{"id":7107,"name":"水淹","type":2,"number":4,"color":3},"7108":{"id":7108,"name":"冰杀","type":1,"number":7,"color":3},"7109":{"id":7109,"name":"冰杀","type":1,"number":7,"color":3},"7110":{"id":7110,"name":"冰杀","type":1,"number":8,"color":3},"7111":{"id":7111,"name":"冰杀","type":1,"number":8,"color":3},"7112":{"id":7112,"name":"冰杀","type":1,"number":8,"color":3},"7113":{"id":7113,"name":"杀","type":1,"number":9,"color":3},"7114":{"id":7114,"name":"杀","type":1,"number":9,"color":3},"7115":{"id":7115,"name":"杀","type":1,"number":10,"color":3},"7116":{"id":7116,"name":"杀","type":1,"number":10,"color":3},"7117":{"id":7117,"name":"顺手","type":2,"number":11,"color":3},"7118":{"id":7118,"name":"逐近","type":2,"number":12,"color":3},"7119":{"id":7119,"name":"无懈","type":2,"number":13,"color":3},"7120":{"id":7120,"name":"天机","type":3,"number":12,"color":4},"7121":{"id":7121,"name":"闪","type":1,"number":2,"color":1},"7122":{"id":7122,"name":"闪","type":1,"number":2,"color":1},"7123":{"id":7123,"name":"过河","type":2,"number":2,"color":1},"7124":{"id":7124,"name":"出其","type":2,"number":3,"color":1},"7125":{"id":7125,"name":"五谷","type":2,"number":4,"color":1},"7126":{"id":7126,"name":"洞烛","type":2,"number":7,"color":1},"7127":{"id":7127,"name":"洞烛","type":2,"number":8,"color":1},"7128":{"id":7128,"name":"洞烛","type":2,"number":9,"color":1},"7129":{"id":7129,"name":"火杀","type":1,"number":10,"color":1},"7130":{"id":7130,"name":"洞烛","type":2,"number":11,"color":1},"7131":{"id":7131,"name":"无懈","type":2,"number":13,"color":1},"7132":{"id":7132,"name":"决斗","type":2,"number":1,"color":4},"7133":{"id":7133,"name":"护心","type":3,"number":1,"color":4},"7134":{"id":7134,"name":"杀","type":1,"number":2,"color":4},"7135":{"id":7135,"name":"黑光","type":3,"number":2,"color":4},"7136":{"id":7136,"name":"杀","type":1,"number":3,"color":4},"7137":{"id":7137,"name":"逐近","type":2,"number":3,"color":4},"7138":{"id":7138,"name":"杀","type":1,"number":4,"color":4},"7139":{"id":7139,"name":"逐近","type":2,"number":4,"color":4},"7140":{"id":7140,"name":"杀","type":1,"number":5,"color":4},"7141":{"id":7141,"name":"雷杀","type":1,"number":9,"color":4},"7142":{"id":7142,"name":"雷杀","type":1,"number":9,"color":4},"7143":{"id":7143,"name":"雷杀","type":1,"number":10,"color":4},"7144":{"id":7144,"name":"雷杀","type":1,"number":10,"color":4},"7145":{"id":7145,"name":"杀","type":1,"number":11,"color":4},"7146":{"id":7146,"name":"铜雀","type":3,"number":13,"color":4},"7147":{"id":7147,"name":"五行","type":3,"number":1,"color":2},"7148":{"id":7148,"name":"闪","type":1,"number":2,"color":2},"7149":{"id":7149,"name":"闪","type":1,"number":2,"color":2},"7150":{"id":7150,"name":"火杀","type":1,"number":4,"color":2},"7151":{"id":7151,"name":"杀","type":1,"number":8,"color":2},"7152":{"id":7152,"name":"火杀","type":1,"number":10,"color":2},"7153":{"id":7153,"name":"出其","type":2,"number":12,"color":2},"7154":{"id":7154,"name":"乌铁","type":3,"number":12,"color":2},"7155":{"id":7155,"name":"南蛮","type":2,"number":13,"color":3},"7156":{"id":7156,"name":"南蛮","type":2,"number":7,"color":3},"7157":{"id":7157,"name":"桃园","type":2,"number":1,"color":1},"7158":{"id":7158,"name":"万箭","type":2,"number":1,"color":1},"7159":{"id":7159,"name":"南蛮","type":2,"number":7,"color":4},"7160":{"id":7160,"name":"闪","type":1,"number":4,"color":2},"10001":{"id":10001,"name":"先驱","type":2,"number":0,"color":0},"10002":{"id":10002,"name":"阴阳","type":2,"number":0,"color":0},"10003":{"id":10003,"name":"珠联","type":2,"number":0,"color":0},"10020":{"id":10020,"name":"八卦","type":3,"number":2,"color":3},"10021":{"id":10021,"name":"八卦","type":3,"number":2,"color":3},"10022":{"id":10022,"name":"仁王","type":3,"number":2,"color":4},"10023":{"id":10023,"name":"仁王","type":3,"number":2,"color":4},"10024":{"id":10024,"name":"藤甲","type":3,"number":2,"color":3},"10025":{"id":10025,"name":"藤甲","type":3,"number":2,"color":3},"10026":{"id":10026,"name":"白银","type":3,"number":1,"color":4},"10027":{"id":10027,"name":"白银","type":3,"number":1,"color":4},"10028":{"id":10028,"name":"秦弩","type":3,"number":1,"color":4},"10029":{"id":10029,"name":"秦弩","type":3,"number":1,"color":4},"10030":{"id":10030,"name":"商鞅","type":2,"number":5,"color":3},"10031":{"id":10031,"name":"商鞅","type":2,"number":7,"color":3},"10032":{"id":10032,"name":"商鞅","type":2,"number":9,"color":3},"10033":{"id":10033,"name":"真龙","type":3,"number":2,"color":1},"10034":{"id":10034,"name":"传国","type":3,"number":7,"color":1},"10035":{"id":10035,"name":"八卦","type":3,"number":2,"color":4},"10036":{"id":10036,"name":"八卦","type":3,"number":2,"color":4},"10037":{"id":10037,"name":"藤甲","type":3,"number":2,"color":4},"10038":{"id":10038,"name":"藤甲","type":3,"number":2,"color":4},"10039":{"id":10039,"name":"禅让","type":3,"number":13,"color":3},"10040":{"id":10040,"name":"蛇灵","type":3,"number":12,"color":4},"10041":{"id":10041,"name":"金乌","type":3,"number":5,"color":1},"10042":{"id":10042,"name":"刑天","type":3,"number":5,"color":2},"10043":{"id":10043,"name":"故步","type":2,"number":7,"color":2},"10044":{"id":10044,"name":"故步","type":2,"number":5,"color":4},"10045":{"id":10045,"name":"四乘","type":3,"number":5,"color":1},"10046":{"id":10046,"name":"铁蒺","type":3,"number":5,"color":4},"10047":{"id":10047,"name":"飞轮","type":3,"number":5,"color":3},"10048":{"id":10048,"name":"琼梳","type":3,"number":12,"color":3},"10049":{"id":10049,"name":"犀梳","type":3,"number":12,"color":4},"10050":{"id":10050,"name":"金梳","type":3,"number":12,"color":1},"11002":{"id":11002,"name":"闪","type":1,"number":2,"color":2},"11008":{"id":11008,"name":"杀","type":1,"number":8,"color":2},"11010":{"id":11010,"name":"杀","type":1,"number":10,"color":2},"11012":{"id":11012,"name":"方天","type":3,"number":12,"color":2},"11015":{"id":11015,"name":"闪","type":1,"number":2,"color":2},"11017":{"id":11017,"name":"闪","type":1,"number":4,"color":2},"11027":{"id":11027,"name":"万箭","type":2,"number":1,"color":1},"11028":{"id":11028,"name":"闪","type":1,"number":2,"color":1},"11030":{"id":11030,"name":"五谷","type":2,"number":4,"color":1},"11033":{"id":11033,"name":"无中","type":2,"number":7,"color":1},"11034":{"id":11034,"name":"无中","type":2,"number":8,"color":1},"11035":{"id":11035,"name":"无中","type":2,"number":9,"color":1},"11037":{"id":11037,"name":"无中","type":2,"number":11,"color":1},"11040":{"id":11040,"name":"桃园","type":2,"number":1,"color":1},"11041":{"id":11041,"name":"闪","type":1,"number":2,"color":1},"11053":{"id":11053,"name":"决斗","type":2,"number":1,"color":4},"11054":{"id":11054,"name":"杀","type":1,"number":2,"color":4},"11055":{"id":11055,"name":"杀","type":1,"number":3,"color":4},"11056":{"id":11056,"name":"杀","type":1,"number":4,"color":4},"11057":{"id":11057,"name":"杀","type":1,"number":5,"color":4},"11061":{"id":11061,"name":"杀","type":1,"number":9,"color":4},"11062":{"id":11062,"name":"杀","type":1,"number":10,"color":4},"11067":{"id":11067,"name":"八卦","type":3,"number":2,"color":4},"11068":{"id":11068,"name":"过河","type":2,"number":3,"color":4},"11069":{"id":11069,"name":"过河","type":2,"number":4,"color":4},"11072":{"id":11072,"name":"南蛮","type":2,"number":7,"color":4},"11074":{"id":11074,"name":"杀","type":1,"number":9,"color":4},"11075":{"id":11075,"name":"杀","type":1,"number":10,"color":4},"11076":{"id":11076,"name":"杀","type":1,"number":11,"color":4},"11077":{"id":11077,"name":"借刀","type":2,"number":12,"color":4},"11078":{"id":11078,"name":"借刀","type":2,"number":13,"color":4},"11079":{"id":11079,"name":"决斗","type":2,"number":1,"color":3},"11081":{"id":11081,"name":"顺手","type":2,"number":3,"color":3},"11082":{"id":11082,"name":"顺手","type":2,"number":4,"color":3},"11085":{"id":11085,"name":"杀","type":1,"number":7,"color":3},"11086":{"id":11086,"name":"杀","type":1,"number":8,"color":3},"11087":{"id":11087,"name":"杀","type":1,"number":9,"color":3},"11088":{"id":11088,"name":"杀","type":1,"number":10,"color":3},"11089":{"id":11089,"name":"顺手","type":2,"number":11,"color":3},"11090":{"id":11090,"name":"过河","type":2,"number":12,"color":3},"11091":{"id":11091,"name":"南蛮","type":2,"number":13,"color":3},"11092":{"id":11092,"name":"闪电","type":2,"number":1,"color":3},"11094":{"id":11094,"name":"过河","type":2,"number":3,"color":3},"11098":{"id":11098,"name":"南蛮","type":2,"number":7,"color":3},"11099":{"id":11099,"name":"杀","type":1,"number":8,"color":3},"11100":{"id":11100,"name":"杀","type":1,"number":9,"color":3},"11101":{"id":11101,"name":"杀","type":1,"number":10,"color":3},"11108":{"id":11108,"name":"寒冰","type":3,"number":2,"color":3},"11110":{"id":11110,"name":"火攻","type":2,"number":2,"color":1},"11111":{"id":11111,"name":"火攻","type":2,"number":3,"color":1},"11118":{"id":11118,"name":"火杀","type":1,"number":10,"color":1},"11121":{"id":11121,"name":"无懈","type":2,"number":13,"color":1},"11122":{"id":11122,"name":"朱雀","type":3,"number":1,"color":2},"11125":{"id":11125,"name":"火杀","type":1,"number":4,"color":2},"11133":{"id":11133,"name":"火攻","type":2,"number":12,"color":2},"11136":{"id":11136,"name":"藤甲","type":3,"number":2,"color":3},"11141":{"id":11141,"name":"雷杀","type":1,"number":7,"color":3},"11142":{"id":11142,"name":"雷杀","type":1,"number":8,"color":3},"11147":{"id":11147,"name":"无懈","type":2,"number":13,"color":3},"11148":{"id":11148,"name":"白银","type":3,"number":1,"color":4},"11149":{"id":11149,"name":"藤甲","type":3,"number":2,"color":4},"12001":{"id":12001,"name":"古锭","type":3,"number":1,"color":3},"12002":{"id":12002,"name":"藤甲","type":3,"number":2,"color":3},"12003":{"id":12003,"name":"酒","type":1,"number":3,"color":3},"12004":{"id":12004,"name":"雷杀","type":1,"number":4,"color":3},"12005":{"id":12005,"name":"雷杀","type":1,"number":5,"color":3},"12006":{"id":12006,"name":"雷杀","type":1,"number":6,"color":3},"12007":{"id":12007,"name":"雷杀","type":1,"number":7,"color":3},"12008":{"id":12008,"name":"雷杀","type":1,"number":8,"color":3},"12009":{"id":12009,"name":"酒","type":1,"number":9,"color":3},"12010":{"id":12010,"name":"攻守","type":2,"number":10,"color":3},"12011":{"id":12011,"name":"铁索","type":2,"number":11,"color":3},"12012":{"id":12012,"name":"铁索","type":2,"number":12,"color":3},"12013":{"id":12013,"name":"无懈","type":2,"number":13,"color":3},"12014":{"id":12014,"name":"白银","type":3,"number":1,"color":4},"12015":{"id":12015,"name":"藤甲","type":3,"number":2,"color":4},"12016":{"id":12016,"name":"酒","type":1,"number":3,"color":4},"12017":{"id":12017,"name":"进退","type":2,"number":4,"color":4},"12018":{"id":12018,"name":"雷杀","type":1,"number":5,"color":4},"12019":{"id":12019,"name":"雷杀","type":1,"number":6,"color":4},"12020":{"id":12020,"name":"雷杀","type":1,"number":7,"color":4},"12021":{"id":12021,"name":"雷杀","type":1,"number":8,"color":4},"12022":{"id":12022,"name":"酒","type":1,"number":9,"color":4},"12023":{"id":12023,"name":"铁索","type":2,"number":10,"color":4},"12024":{"id":12024,"name":"铁索","type":2,"number":11,"color":4},"12025":{"id":12025,"name":"铁索","type":2,"number":12,"color":4},"12026":{"id":12026,"name":"铁索","type":2,"number":13,"color":4},"12027":{"id":12027,"name":"无懈","type":2,"number":1,"color":1},"12028":{"id":12028,"name":"火攻","type":2,"number":2,"color":1},"12029":{"id":12029,"name":"火攻","type":2,"number":3,"color":1},"12030":{"id":12030,"name":"火杀","type":1,"number":4,"color":1},"12031":{"id":12031,"name":"桃","type":1,"number":5,"color":1},"12032":{"id":12032,"name":"桃","type":1,"number":6,"color":1},"12033":{"id":12033,"name":"火杀","type":1,"number":7,"color":1},"12034":{"id":12034,"name":"闪","type":1,"number":8,"color":1},"12035":{"id":12035,"name":"闪","type":1,"number":9,"color":1},"12036":{"id":12036,"name":"火杀","type":1,"number":10,"color":1},"12037":{"id":12037,"name":"闪","type":1,"number":11,"color":1},"12038":{"id":12038,"name":"闪","type":1,"number":12,"color":1},"12039":{"id":12039,"name":"无懈","type":2,"number":13,"color":1},"12040":{"id":12040,"name":"朱雀","type":3,"number":1,"color":2},"12041":{"id":12041,"name":"桃","type":1,"number":2,"color":2},"12042":{"id":12042,"name":"桃","type":1,"number":3,"color":2},"12043":{"id":12043,"name":"火杀","type":1,"number":4,"color":2},"12044":{"id":12044,"name":"火杀","type":1,"number":5,"color":2},"12045":{"id":12045,"name":"闪","type":1,"number":6,"color":2},"12046":{"id":12046,"name":"闪","type":1,"number":7,"color":2},"12047":{"id":12047,"name":"闪","type":1,"number":8,"color":2},"12048":{"id":12048,"name":"酒","type":1,"number":9,"color":2},"12049":{"id":12049,"name":"闪","type":1,"number":10,"color":2},"12050":{"id":12050,"name":"闪","type":1,"number":11,"color":2},"12051":{"id":12051,"name":"火攻","type":2,"number":12,"color":2},"12052":{"id":12052,"name":"骅骝","type":3,"number":13,"color":2},"12053":{"id":12053,"name":"炸弹","type":2,"number":1,"color":3},"12054":{"id":12054,"name":"雌雄","type":3,"number":2,"color":3},"12055":{"id":12055,"name":"过河","type":2,"number":3,"color":3},"12056":{"id":12056,"name":"过河","type":2,"number":4,"color":3},"12057":{"id":12057,"name":"青龙","type":3,"number":5,"color":3},"12058":{"id":12058,"name":"继往","type":2,"number":6,"color":3},"12059":{"id":12059,"name":"进退","type":2,"number":7,"color":3},"12060":{"id":12060,"name":"杀","type":1,"number":8,"color":3},"12061":{"id":12061,"name":"杀","type":1,"number":9,"color":3},"12062":{"id":12062,"name":"杀","type":1,"number":10,"color":3},"12063":{"id":12063,"name":"顺手","type":2,"number":11,"color":3},"12064":{"id":12064,"name":"丈八","type":3,"number":12,"color":3},"12065":{"id":12065,"name":"大宛","type":3,"number":13,"color":3},"12066":{"id":12066,"name":"诸葛","type":3,"number":1,"color":4},"12067":{"id":12067,"name":"八卦","type":3,"number":2,"color":4},"12068":{"id":12068,"name":"杀","type":1,"number":3,"color":4},"12069":{"id":12069,"name":"杀","type":1,"number":4,"color":4},"12070":{"id":12070,"name":"的卢","type":3,"number":5,"color":4},"12071":{"id":12071,"name":"杀","type":1,"number":6,"color":4},"12072":{"id":12072,"name":"杀","type":1,"number":7,"color":4},"12073":{"id":12073,"name":"杀","type":1,"number":8,"color":4},"12074":{"id":12074,"name":"杀","type":1,"number":9,"color":4},"12075":{"id":12075,"name":"杀","type":1,"number":10,"color":4},"12076":{"id":12076,"name":"杀","type":1,"number":11,"color":4},"12077":{"id":12077,"name":"无懈","type":2,"number":12,"color":4},"12078":{"id":12078,"name":"借刀","type":2,"number":13,"color":4},"12079":{"id":12079,"name":"攻守","type":2,"number":1,"color":1},"12080":{"id":12080,"name":"闪","type":1,"number":2,"color":1},"12081":{"id":12081,"name":"无中","type":2,"number":3,"color":1},"12082":{"id":12082,"name":"桃","type":1,"number":4,"color":1},"12083":{"id":12083,"name":"赤兔","type":3,"number":5,"color":1},"12084":{"id":12084,"name":"继往","type":2,"number":6,"color":1},"12085":{"id":12085,"name":"桃","type":1,"number":7,"color":1},"12086":{"id":12086,"name":"无中","type":2,"number":8,"color":1},"12087":{"id":12087,"name":"桃","type":1,"number":9,"color":1},"12088":{"id":12088,"name":"杀","type":1,"number":10,"color":1},"12089":{"id":12089,"name":"无中","type":2,"number":11,"color":1},"12090":{"id":12090,"name":"过河","type":2,"number":12,"color":1},"12091":{"id":12091,"name":"爪黄","type":3,"number":13,"color":1},"12092":{"id":12092,"name":"决斗","type":2,"number":1,"color":2},"12093":{"id":12093,"name":"闪","type":1,"number":2,"color":2},"12094":{"id":12094,"name":"闪","type":1,"number":3,"color":2},"12095":{"id":12095,"name":"顺手","type":2,"number":4,"color":2},"12096":{"id":12096,"name":"贯石","type":3,"number":5,"color":2},"12097":{"id":12097,"name":"杀","type":1,"number":6,"color":2},"12098":{"id":12098,"name":"闪","type":1,"number":7,"color":2},"12099":{"id":12099,"name":"闪","type":1,"number":8,"color":2},"12100":{"id":12100,"name":"闪","type":1,"number":9,"color":2},"12101":{"id":12101,"name":"杀","type":1,"number":10,"color":2},"12102":{"id":12102,"name":"闪","type":1,"number":11,"color":2},"12103":{"id":12103,"name":"桃","type":1,"number":12,"color":2},"12104":{"id":12104,"name":"杀","type":1,"number":13,"color":2},"12105":{"id":12105,"name":"决斗","type":2,"number":1,"color":3},"12106":{"id":12106,"name":"无懈","type":2,"number":13,"color":4},"12107":{"id":12107,"name":"炸弹","type":2,"number":1,"color":1},"12108":{"id":12108,"name":"无懈","type":2,"number":13,"color":2},"12110":{"id":12110,"name":"无双","type":3,"number":12,"color":2},"12111":{"id":12111,"name":"鬼龙","type":3,"number":5,"color":3},"12112":{"id":12112,"name":"赤血","type":3,"number":6,"color":3},"12113":{"id":12113,"name":"镔铁","type":3,"number":13,"color":2},"12114":{"id":12114,"name":"乌铁","type":3,"number":13,"color":3},"12115":{"id":12115,"name":"五行","type":3,"number":1,"color":2},"12116":{"id":12116,"name":"玲珑","type":3,"number":2,"color":3},"12117":{"id":12117,"name":"红棉","type":3,"number":1,"color":4},"12118":{"id":12118,"name":"国风","type":3,"number":9,"color":3},"12119":{"id":12119,"name":"奇门","type":3,"number":2,"color":3},"12120":{"id":12120,"name":"护心","type":3,"number":1,"color":4},"12121":{"id":12121,"name":"黑光","type":3,"number":2,"color":4},"12122":{"id":12122,"name":"束发","type":3,"number":1,"color":2},"12123":{"id":12123,"name":"虚妄","type":3,"number":4,"color":4},"12124":{"id":12124,"name":"天机","type":3,"number":12,"color":4},"12125":{"id":12125,"name":"太公","type":3,"number":2,"color":3},"12126":{"id":12126,"name":"三略","type":3,"number":5,"color":3},"12127":{"id":12127,"name":"照骨","type":3,"number":1,"color":2},"12128":{"id":12128,"name":"调剂","type":2,"number":6,"color":4},"12129":{"id":12129,"name":"远交","type":2,"number":9,"color":1},"12130":{"id":12130,"name":"长安","type":3,"number":10,"color":1},"12131":{"id":12131,"name":"长安","type":3,"number":10,"color":1},"12132":{"id":12132,"name":"长安","type":3,"number":10,"color":1},"12133":{"id":12133,"name":"长安","type":3,"number":10,"color":1},"12134":{"id":12134,"name":"长安","type":3,"number":10,"color":1},"12135":{"id":12135,"name":"长安","type":3,"number":10,"color":3},"12136":{"id":12136,"name":"长安","type":3,"number":10,"color":3},"12137":{"id":12137,"name":"长安","type":3,"number":10,"color":3},"12138":{"id":12138,"name":"长安","type":3,"number":10,"color":3},"12139":{"id":12139,"name":"长安","type":3,"number":10,"color":3},"12140":{"id":12140,"name":"闪闪","type":1,"number":3,"color":2},"12141":{"id":12141,"name":"闪闪","type":1,"number":5,"color":2},"12142":{"id":12142,"name":"闪闪","type":1,"number":6,"color":2},"12143":{"id":12143,"name":"闪闪","type":1,"number":7,"color":2},"12144":{"id":12144,"name":"闪闪","type":1,"number":8,"color":2},"12145":{"id":12145,"name":"闪闪","type":1,"number":9,"color":2},"12146":{"id":12146,"name":"闪闪","type":1,"number":10,"color":2},"12147":{"id":12147,"name":"闪闪","type":1,"number":11,"color":2},"12148":{"id":12148,"name":"三首","type":3,"number":12,"color":2},"12201":{"id":12201,"name":"继往","type":2,"number":1,"color":1},"12202":{"id":12202,"name":"攻守","type":2,"number":2,"color":1},"12203":{"id":12203,"name":"进退","type":2,"number":3,"color":1},"12204":{"id":12204,"name":"炸弹","type":2,"number":4,"color":1},"12205":{"id":12205,"name":"地契","type":3,"number":13,"color":4},"12210":{"id":12210,"name":"炸弹","type":2,"number":1,"color":1},"13000":{"id":13000,"name":"杀","type":1,"number":5,"color":1},"13001":{"id":13001,"name":"杀","type":1,"number":6,"color":1},"13002":{"id":13002,"name":"杀","type":1,"number":8,"color":1},"13003":{"id":13003,"name":"杀","type":1,"number":9,"color":1},"13004":{"id":13004,"name":"酒","type":1,"number":2,"color":2},"13005":{"id":13005,"name":"酒","type":1,"number":3,"color":2}};
var gameStatusMap = {};
let remCardCount = 0;
let currentMode = {};
let paidui = new Set();//, 别人摸未知牌不会改变,自己mainID摸牌会减少的牌,场上有明牌都会被移出,此牌堆包括别人手牌
var paiduiSum = 0; //用于计算的平均数,吉占
let qipai  = new Set();//zone2 弃牌

let chuli = new Set();//zone3 处理区

let newShouPai =  {0:new Set(),1:new Set(),2:new Set(),3:new Set(),4:new Set(),5:new Set(),6:new Set(),7:new Set()};//key为seat id而不是id，value为 zone5 手牌区
let newIdOrder = {0:-1,1:-1,2:-1,3:-1,4:-1,5:-1,6:-1,7:-1};//key为玩家id，value为实际座位顺序
let biaoji = {0:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[]};//key为玩家id，value为zone4 标记区
let shoupai = {0:new Set(),1:new Set(),2:new Set(),3:new Set(),4:new Set(),5:new Set(),6:new Set(),7:new Set()};//key为seat id而不是id，value为 zone5 手牌区
let zhuangbei = {0:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[]};//key为玩家id，value为zone6 装备区
let panding = {0:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[]};//key为玩家id，value为zone7 判定区
let jineng = new Set();//观星询询会会出现
let zone10 = new Set(); //祈禳甘露
let ding = [];
let di = [];
let seat = 0;//用于座位安排
let isGameStart = false;
var div = window.div;

let currentCardType;
let cardTypeButton = "";
//for draggable iframe
var x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
    x_elem = 0, y_elem = 0, // Stores top, left values (edge) of the element
    selected = null; // Object of the element to be moved

//cardType 基本1锦囊2装备3其他4
var isSeatOrder = false;//座位是否安排好了
var isFrameAdd = false;
var isShouQiKa = 0;
var ShouQiKa = {};
var mainID;
var diamond, spade, heart, club ,spade2_9,hongsha,heisha ;
var arr = [];
var combos = [];
var closeIframe = false;
var gameModeMap = {};

var size;
var firstSeatID = -1;
let idOrderNew = [];
let idOrder = {};//key为玩家id，value为实际座位顺序
let idOrderPre = [];//按顺序存储idOrder
let idOrderPreSet = new Set();//按顺序存储idOrder
var calResult = [];
var isDuanXian = false;
var cardNumAndSuit;
var remShouPai = new Set();//洗牌后剩余手牌
var insertInd;//用于插入顶/底牌堆，黄承彦
var temShouPai;//用于处理临时手牌
var DestSeatIDs;
var DestSeatID;
var isDiMeng = false;//缔盟，清忠，等手牌全给情况
var b = 1562902854;
var isB = false;
var mySeatID = new Set();// 用于糜竺，可能包括不仅仅两个人的
var myID = -1; //仅仅用于自己
var fenYin = new Set();
var enableFenYin = false;
// var luanJi = new Set();
// var enableLuanJi = false;
// var enableQuanBian = false;
// var quanBian = new Set();
// var enableHuaMu = false;
// var huaMu = new Set();
var unknownCard = [];
var knownShouPai= new Set();
var emojiFontSize = "15px"; // 可变的字体大小，可以根据需要进行调整
var cardList;
var isClickSkinSelect;
var curGeneral = -1;
var xunxun = [];//询询，不会显示明牌，只会先看牌，暗牌放进技能区zone8，然后2牌顶2牌底，直到拿牌的时候才知道哪张牌是底
var spellTargets = -1;//记录spell 的target，用于在logicmsg.MsgRoleOptTargetNtf 中调用，调用完复位
function gameStart(){
    paidui = new Set();
    for(const cid of cardList){
        paidui.add(cid);
    }
    var deckConfig = {
        isJunZhengBiaoZhun: { label: "军争", diamond: 40, spade: 40, heart: 40, club: 40, spade2_9: 25, hongsha: 14, heisha: 30 },
        isGuoZhanBiaoZhun: { label: "国战", diamond: 27, spade: 27, heart: 27, club: 28, spade2_9: 17, hongsha: 8, heisha: 21 },
        isDouDiZhu: { label: "斗地主", diamond: 43, spade: 40, heart: 43, club: 40, spade2_9: 25, hongsha: 18, heisha: 30 },
        isShenWu: { label: "神武", diamond: 43, spade: 40, heart: 43, club: 40, spade2_9: 25, hongsha: 18, heisha: 30 },
        isZhuGongSha: { label: "主公杀", diamond: 40, spade: 39, heart: 38, club: 39, spade2_9: 25, hongsha: 14, heisha: 30 },
        isHuanLeBiaoZhun: { label: "军争", diamond: 40, spade: 40, heart: 40, club: 40, spade2_9: 25, hongsha: 14, heisha: 30 },
        isShenZhiShiLian: { label: "神之试炼", diamond: 41, spade: 41, heart: 40, club: 40, spade2_9: 25, hongsha: 14, heisha: 30 },
        isUnknown: { label: "未知牌堆", diamond: 41, spade: 41, heart: 40, club: 40, spade2_9: 25, hongsha: 14, heisha: 30 }
    };
    //全部区域清空,牌堆回复张
    var currentDeckConfig;

    // 找到第一个为 true 的状态
    for (var key in deckConfig) {
        if (gameStatusMap[key]) {
            currentDeckConfig = deckConfig[key];
            //TODO
            diamond=41, spade = 40, heart = 40, club = 40, spade2_9 = 25, hongsha = 14, heisha = 30;
            break;
        }
    }
    document.getElementById('iframe-source').contentWindow.document.getElementById("nav1").innerHTML = "<b>当前牌堆：" + currentDeckConfig.label + "</b>";
    qipai  = new Set();//zone2 弃牌
    chuli = new Set();//zone3 处理区
    biaoji = {0:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[]};//key为玩家id，value为zone4 标记区
    shoupai = {0:new Set(),1:new Set(),2:new Set(),3:new Set(),4:new Set(),5:new Set(),6:new Set(),7:new Set()};//key为seat id而不是id，value为 zone5 手牌区
    zhuangbei = {0:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[]};//key为玩家id，value为zone6 装备区
    panding = {0:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[]};//key为玩家id，value为zone7 判定区
    jineng = new Set();//观星询询会会出现 zone8
    zone10 = new Set(); //祈禳甘露 zone 10
    ding = [];
    di = [];
    idOrder = {};//key为玩家id，value为实际座位顺序
    seat = 0;//用于座位安排
    isGameStart = false;
    div = window.div;
    cardTypeButton = "";
    //for draggable iframe
    x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
        x_elem = 0, y_elem = 0, // Stores top, left values (edge) of the element
        selected = null; // Object of the element to be moved

    //cardType 基本1锦囊2装备3其他4
    isSeatOrder = false;//座位是否安排好了
    isFrameAdd = false;
    isShouQiKa = 0;
    ShouQiKa = {};
    arr = [];
    combos = [];
    newIdOrder = {};
    newShouPai = {};
    idOrderPreSet = new Set();
    idOrderPre = [];
    isDuanXian = false;
    remShouPai = new Set();
    for(let i = 0; i< 8; i++) {
        let seatID = (i + 1).toString();
        document.getElementById('iframe-source').contentWindow.document.getElementById(seatID).innerHTML = '';
    }
    temShouPai = new Set();//用于处理临时手牌
    isDiMeng = false; //缔盟
    mySeatID = new Set();//用于计算糜竺13点，自己的位置
    idOrderNew = [];
    //GeneralID  = 999;
    //mySkin = 0;
    fenYin = new Set();
    enableFenYin = false;
    // luanJi = new Set();
    // enableLuanJi = false;
    // clearSuit();
    // enableQuanBian = false;
    // quanBian = new Set();
    // enableHuaMu = false;
    // huaMu = new Set();
    unknownCard = [];
    knownShouPai= new Set();
    isClickSkinSelect = false;
    myID = -1;
    curGeneral = -1;
    firstSeatID = -1;
    xunxun = [];
    spellTargets = -1;//记录spell 的target，用于在logicmsg.MsgRoleOptTargetNtf 中调用，调用完复位


}

function drawRemShouPai(remShouPai){
    var knownCardsDiv = document.getElementById('iframe-source').contentWindow.document.getElementById("knownCards");
    var knownCardsInHandDiv = document.getElementById('iframe-source').contentWindow.document.getElementById("knownCardsInHand");
    // knownCardsDiv.innerText = '';
    const shoupaiDIV = document.createElement('div');
    for(const c of remShouPai){
        var button = document.createElement('button');
        if(getCardNumAndSuit(c)["cardSuit"]=='♦'||getCardNumAndSuit(c)["cardSuit"]=='♥'){
            button.className = "shoupaiR";//红色手牌
        }
        else{
            button.className = "shoupai";
        }
        let emojiWrapper = document.createElement('div');
        emojiWrapper.style.width = "100%";
        emojiWrapper.style.textAlign = "center";

        let emoji = document.createElement('span');
        emoji.style.fontSize = emojiFontSize; // 应用可变的字体大小
        emoji.innerText = getCardNumAndSuit(c)["cardNumAndSuit"];

        emojiWrapper.appendChild(emoji);
        button.appendChild(emojiWrapper);
        button.innerHTML +=  currentMode[c]["name"];
        shoupaiDIV.append(button);
    }

    knownCardsDiv.style.border = '1px rgb(40,40,40) solid';
    knownCardsDiv.style.animation = 'blink 2s';
    knownCardsDiv.style.animationIterationCount = 'infinite';

    knownCardsDiv.innerHTML = shoupaiDIV.innerHTML;
    if(!knownCardsDiv.innerText == ''){
        knownCardsInHandDiv.style.display = "block";
    }
}
function drawDingOrDi(ding, di){
    var DingCardsDiv = document.getElementById('iframe-source').contentWindow.document.getElementById("dingCards");
    var DiCardsDiv = document.getElementById('iframe-source').contentWindow.document.getElementById("diCards");
    DingCardsDiv.innerText = '';
    DiCardsDiv.innerText = '';
    const cardDIV = document.createElement('div');
    var dingReverse = ding.slice().reverse();
    for(const c of dingReverse){
        var button = document.createElement('button');
        if(getCardNumAndSuit(c)["cardSuit"]=='♦'||getCardNumAndSuit(c)["cardSuit"]=='♥'){
            button.className = "shoupaiR";//红色手牌
        }
        else{
            button.className = "shoupai";
        }
        let emojiWrapper = document.createElement('div');
        emojiWrapper.style.width = "100%";
        emojiWrapper.style.textAlign = "center";

        let emoji = document.createElement('span');
        emoji.style.fontSize = emojiFontSize; // 应用可变的字体大小
        emoji.innerText = getCardNumAndSuit(c)["cardNumAndSuit"];

        emojiWrapper.appendChild(emoji);
        button.appendChild(emojiWrapper);
        button.innerHTML +=  allCard[c]?allCard[c]["name"]:"?";
        DingCardsDiv.append(button);
    }
    var diReverse = di.slice().reverse();
    for(const c of diReverse){
        var button = document.createElement('button');
        if(getCardNumAndSuit(c)["cardSuit"]=='♦'||getCardNumAndSuit(c)["cardSuit"]=='♥'){
            button.className = "shoupaiR";//红色手牌
        }
        else{
            button.className = "shoupai";
        }
        let emojiWrapper = document.createElement('div');
        emojiWrapper.style.width = "100%";
        emojiWrapper.style.textAlign = "center";

        let emoji = document.createElement('span');
        emoji.style.fontSize = emojiFontSize; // 应用可变的字体大小
        emoji.innerText = getCardNumAndSuit(c)["cardNumAndSuit"];

        emojiWrapper.appendChild(emoji);
        button.appendChild(emojiWrapper);
        button.innerHTML +=  allCard[c]?allCard[c]["name"]:"?";
        DiCardsDiv.append(button);
    }
    DingCardsDiv.innerHTML = DingCardsDiv.innerHTML;
    DiCardsDiv.innerHTML = DiCardsDiv.innerHTML;
    if(DiCardsDiv.innerText == ''){
        DiCardsDiv.style.display = "none";
    }
    else{DiCardsDiv.style.display = "block";}
    if(DingCardsDiv.innerText == ''){
        DingCardsDiv.style.display = "none";
    }
    else{DingCardsDiv.style.display = "block";}
}

// function JiZhanCal(cardNum){
//     var bigger=0;var smaller = 0;
//     for(const card of paidui){
//         if(parseInt(getCardNumAndSuit(card)["cardNum"])>cardNum){bigger++;}
//         if(parseInt(getCardNumAndSuit(card)["cardNum"])<cardNum){smaller++;}
//     }
//     // paidui.forEach(c => paiduiSum+=parseInt(getCardNumAndSuit(c)["cardNum"]));
//     document.getElementById('iframe-source').contentWindow.document.getElementById("jizhan").innerHTML = '牌堆比' + cardNum + '大张数：'+bigger+'<br>'+'牌堆比' + cardNum + '小张数：'+smaller;
//
// }
var MiZhuCards = [10,2,3,7,6];
var MiZhuRes;
//记录结果的位置，如果有相同则略过
var pathArr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var pathSum;
var pathArrSet = new Set();
// function mizhuCal(cards, index, res,sum) {
function MiZhuCal(arr, n){
    var dianshu=document.getElementById('iframe-source').contentWindow.document.getElementById('mizhu_dianshu').value;
    pathArrSet = new Set();
    MiZhuRes = [];
    var opsize = Math.pow(2, MiZhuCards.length);
    // Run from counter 000..1 to 111..1
    for(let counter = 1; counter < opsize; counter++) {
        pathArr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        pathSum = 0;

        for(let j = 0; j < n; j++) {
            // Check if jth bit in the counter is set
            // If set then print jth element from arr[]
            if ((counter & (1 << j)) != 0) {
                pathSum += arr[j];
                pathArr[arr[j]]++;//位数加一
            }
        }
        if(pathSum == dianshu && !pathArrSet.has(JSON.stringify(pathArr))){
            pathArrSet.add(JSON.stringify(pathArr));
            var toPathArr=[];
            for(let i = 1; i<=dianshu; i++){
                for(let j = 0; j<pathArr[i]; j++){
                    toPathArr.push(i)
                }
            }
            MiZhuRes.push(toPathArr);
            if(MiZhuRes.length >=10){return MiZhuRes;}
        }
    }
}

function drawMiZhu(MiZhuRes) {
    var MiZhuResHTML = document.getElementById('iframe-source').contentWindow.document.getElementById("res");
    MiZhuResHTML.innerText = '';
    if(MiZhuRes.length == 0){
        document.getElementById('iframe-source').contentWindow.document.getElementById("res").innerHTML = "<span style='color: red'>这道题冲儿算不出来</span>";
    }
    else{
        for(let sebs of MiZhuRes){
            let span = document.createElement('span');
            var spanText = '';
            span.className = 'calRes';
            for(let seb of sebs){
                spanText += ' '+ transformLetter(seb);
            }
            span.innerText = spanText;
            span.onmousedown = function () {
                toClipboard(spanText);
                span.innerText = '复制成功';
                setTimeout(() => {
                    span.textContent = spanText;
                }, '500')};
            MiZhuResHTML.append(span);
            var br = document.createElement("br");
            MiZhuResHTML.append(br);
        }
    }

}
function toClipboard(text) {
    var correction = {
        1:'⒈',
        2:'⒉',
        3:'⒊',
        4:'⒋',
        5:'⒌',
        6:'⒍',
        7:'⒎',
        8:'⒏',
        9:'⒐',

        'J':'Ⓙ',
        'Q':'Ⓠ',
        'K':'Ⓚ',
        '+':' ',
        10:'⒑',

    };
    Object.keys(correction).forEach((key) => {
        text = text.replaceAll(key, correction[key]);
    });
    if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData('Text', text);
    }
    else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
        var textarea = document.createElement('textarea');
        textarea.textContent = text;
        textarea.style.position = 'fixed';  // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand('copy');  // Security exception may be thrown by some browsers.
        }
        catch (ex) {
            console.warn('Copy to clipboard failed.', ex);
            return prompt('Copy to clipboard: Ctrl+C, Enter', text);
        }
        finally {
            document.body.removeChild(textarea);
        }
    }
}

function addSuit(cardID) {
    var toBeAdd = document.getElementById('iframe-source').contentWindow.document.getElementById('fenYin');
    if(enableFenYin){
        if(getCardNumAndSuit(cardID)["cardSuit"]=='♦' && !fenYin.has('♦')){
            toBeAdd.innerText+='♦';
            fenYin.add('♦');
        }
        else if(getCardNumAndSuit(cardID)["cardSuit"]=='♥'&& !fenYin.has('♥')){
            toBeAdd.innerText+='♥';
            fenYin.add('♥');
        }
        else if(getCardNumAndSuit(cardID)["cardSuit"]=='♠'&& !fenYin.has('♠')){
            toBeAdd.innerText+='♠';
            fenYin.add('♠');
        }
        else if(getCardNumAndSuit(cardID)["cardSuit"]=='♣'&& !fenYin.has('♣')){
            toBeAdd.innerText+='♣';
            fenYin.add('♣');
        }
    }
}
function clearSuit() {
    if(enableFenYin){
        fenYin = new Set();
        document.getElementById('iframe-source').contentWindow.document.getElementById('fenYin').innerText = '';
    }
}

function calcResult() {
    combos = [];
    arr.sort();
    findCombos(arr);
}

function findCombos(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        printCombination(arr, arr.length, i);
    }
    findPairs();
}

function printCombination(arr, n, r) {
    // A temporary array to store all combination one by one
    var data = [];

    // Print all combination using temporary array 'data'
    combinationUtil(arr, n, r, 0, data, 0);
}

/*
   arr[]  ---> Input Array
   n      ---> Size of input array
   r      ---> Size of a combination to be printed
   index  ---> Current index in data[]
   data[] ---> Temporary array to store current combination
   i      ---> index of current element in arr[]
*/
function combinationUtil(arr, n, r, index, data, i) {
    // Current combination is ready, print it
    if (index === r) {
        //make combo array local and insert sum
        var insertable = [];
        for (var i = 0; i < data.length; i++) {
            insertable.push(data[i]);
        }
        combos.push(insertable);
        return;
    }
    // When no more elements are there to put in data[]
    if (i >= n) {
        return;
    }
    // current is included, put next at next location
    data[index] = arr[i];
    combinationUtil(arr, n, r, index + 1, data, i + 1);
    // current is excluded, replace it with next
    // (Note that i+1 is passed, but index is not
    // changed)
    combinationUtil(arr, n, r, index, data, i + 1);
}

function findPairs() {
    var pairs = [];
    for (var i = 0; i < combos.length; i++) {
        for (var j = i + 1; j < combos.length; j++) {
            if (sum(combos[i]) === sum(combos[j])) {
                var pair1 = combos[i];
                var pair2 = combos[j];
                var concat = pair1.concat(pair2).sort();
                var origin = arr.sort();
                var is_same = concat.length === origin.length && concat.every(function (element, index) {
                    return element === origin[index];
                });

                var b = 0, c = 0, cIndex = 0, is_subarray = false;
                // Traverse both arrays simultaneously
                while (b < origin.length && c < concat.length) {
                    // If element matches, increment both pointers
                    if (origin[b] === concat[c]) {
                        b++;
                        c++;
                        cIndex++;
                        // If concat array is completely traversed
                        if (c === concat.length) {
                            // console.log("is_subarray set to true");
                            is_subarray = true;
                        }
                    } else {
                        if (origin[b] !== concat[cIndex]) {  //fix when having duplicates of same value
                            b++;
                        }
                        c = cIndex;
                    }
                }
                // console.log("is_subarrray?: " + is_subarray);
                if (is_same || is_subarray) {
                    pairs.push(toLetter(combos[i]).join("+") + " = " + toLetter(combos[j]).join("+"));
                }
            }
        }
    }
    if (pairs.length === 0) {
        document.getElementById('iframe-source').contentWindow.document.getElementById("res").innerHTML = "<span style='color: red'>这道题冲儿算不出来</span>";
        return;
    }

    var sortedPairs = pairs.sort(function (a, b) {
        if (b.length !== a.length) {
            // sort by length
            return b.length - a.length;
        } else {
            // 尽量2组平均分配
            return Math.abs(parseInt(b.length / 2) - a.indexOf("=")) - Math.abs(parseInt(b.length / 2) - b.indexOf("="));
        }
    });
    var filteredPairs = [];
    sortedPairs.filter(function (value, index, array) {
        if (!containsStr(filteredPairs, value)) {
            filteredPairs.push(value);
        }
    });
    if (filteredPairs.length > 3) {
        filteredPairs = filteredPairs.slice(0, 3);
    }
    drawYanJiao(filteredPairs);
}
function drawYanJiao(filteredPairs){
    var YanJiaoResHTML =document.getElementById('iframe-source').contentWindow.document.getElementById("res");
    YanJiaoResHTML.innerText = '';
    for(let sebs of filteredPairs){
        let span = document.createElement('button');
        span.className = 'calRes';
        span.innerText = sebs;
        span.onmousedown = function () {
            toClipboard(sebs);
            span.innerText = '复制成功';
            setTimeout(() => {
                span.textContent = sebs;
            }, '500')};
        YanJiaoResHTML.append(span);

        var br = document.createElement("br");
        YanJiaoResHTML.append(br);
    }
}
function containsStr(arr, str) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === str) {
            return true;
        }
    }
    return false;
}

function transformLetter(num) {
    switch (num) {
        case 11:
            return 'J';
        case 12:
            return 'Q';
        case 13:
            return 'K';
        default:
            return num;
    }
}

function toLetter(combo) {
    var toLetter = [];
    for (var i = 0; i < combo.length; i++) {
        toLetter.push(transformLetter(combo[i]));
    }
    return toLetter;
}

function sum(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}
function getCardNumAndSuit(cardID){
    let cardNum = allCard[cardID] ? allCard[cardID]["number"] : 0;
    let cardSuit = "";
    let cardNumAndSuit = "";
    let cardNumAJQK = "";
    if(allCard[cardID]){
        if(allCard[cardID]["color"]==1){cardSuit = "♥";}
        else if(allCard[cardID]["color"]==2){cardSuit = "♦";}
        else if(allCard[cardID]["color"]==3){cardSuit = "♠";}
        else if(allCard[cardID]["color"]==4){cardSuit = "♣";}
    }
    else{cardSuit = ""}

    if(cardNum == 12){cardNumAJQK = "Q";}
    else if(cardNum == 13){cardNumAJQK = "K";}
    else if(cardNum == 11){cardNumAJQK = "J";}
    else if(cardNum == 1){cardNumAJQK = "A";}
    else{cardNumAJQK = cardNum;}
    cardNumAndSuit = cardSuit + cardNumAJQK;

    let res = { "cardNumAndSuit": cardNumAndSuit, "cardNum": cardNum, "cardSuit": cardSuit };
    return res;
}
//ToZone
function addCard(id,cardID,zone, ToPosition,SpellID) {
    //观星询询翻回牌堆,牌堆增加,cardType增加
    //65280 丢到牌堆顶
    if (zone == 1 && id == 255 && ToPosition == 65280) {
        paidui.add(cardID);
        addCardType(cardID);
        ding.push(cardID);
        console.warn("card ding "+ding);
    }
    //0 丢到牌堆底
        //赵嫣 锦绘 明明是从牌堆检索牌，但是代码是观底
    else if (zone == 1 && id == 255 && (ToPosition == 0 ) && SpellID != 1879) {
        paidui.add(cardID);
        addCardType(cardID);
        di.push(cardID);
        console.warn("card di "+di);
    }
    //用手气卡把手牌丢回给牌堆
    else if (zone == 1 && id == 0) { addCardType(cardID);}
    else if (zone == 2) {
        qipai.add(cardID);
        if(paidui.delete(cardID)){removeCardType(cardID);}
        remShouPai.delete(cardID);
        addSuit(cardID);
    }
    else if (zone == 3) { chuli.add(cardID); if(paidui.delete(cardID)){removeCardType(cardID);}remShouPai.delete(cardID);
    }
    else if (zone == 4) { biaoji[id].push(cardID);  if(paidui.delete(cardID)){removeCardType(cardID);}remShouPai.delete(cardID);}
    else if (zone == 5) {
        //周妃/徐盛
        if(SpellID == 414||SpellID == 3178){cardID = unknownCard.splice(-1,1)[0];}
        if(typeof (cardID) != 'undefined' && typeof (shoupai[idOrder[id]]) != 'undefined'){
            isDuanXian = false;
            shoupai[idOrder[id]].add(cardID);
            xunxun.splice(xunxun.indexOf(cardID), 1);
            //console.warn('xunxun', xunxun)
            if (xunxun.length === 2) {
                di.pop();di.pop();
                xunxun.forEach(c => {
                    addCard(255, c, 1, 0, 0);
                });
            }
            if(paidui.delete(cardID)){removeCardType(cardID);}
            if(di.indexOf(cardID) != -1){
                di.splice(di.indexOf(cardID), 1);
            }
            if(ding.indexOf(cardID) != -1){
                ding.splice(ding.indexOf(cardID), 1);
            }
        }
        else{isDuanXian = true;console.warn("duanxian"+ zone + cardID)}
        remShouPai.delete(cardID);
    }
    else if (zone == 6) { zhuangbei[id].push(cardID);  if(paidui.delete(cardID)){removeCardType(cardID);}remShouPai.delete(cardID);}
    else if (zone == 7) { panding[id].push(cardID);  if(paidui.delete(cardID)){removeCardType(cardID);}remShouPai.delete(cardID);}
    else if (zone == 8) { jineng.add(cardID); if(paidui.delete(cardID)){removeCardType(cardID);}remShouPai.delete(cardID);}
    else if (zone == 9) { return "洗牌"; }
    else if (zone == 10) { zone10.add(cardID); if(paidui.delete(cardID)){removeCardType(cardID);}remShouPai.delete(cardID);}
    else {
        console.warn("card.ToZone: " + zone + " id: " + id+"cardID"+cardID);
    }
    //出现在别的区域，清除此牌
    if(zone != 5){
        for(let i = 0; i< idOrderPre.length; i++){
            shoupai[i].delete(cardID);


        }
    }
}

//FromZone
function removeCard(id, cardID, zone, FromPosition) {
    //id = 0,zone 1 游戏开始发牌
    if (zone == 1 && id == 0) {return "游戏开始发牌";}
    //破黄承彦 记录index 用于导入这张牌到ding 伏间
    else if (zone == 0 && id == 0 && FromPosition == 0) {
        let index = ding.indexOf(cardID);
        if (index != -1) {
            insertInd = index;
        }
    }
        //系统直接从牌堆发装备--绝响
        //从牌堆发牌,牌堆删除这个id,cardType减少
    // 从牌堆顶发牌
    else if (zone == 1 && id == 255 && FromPosition == 65280) {
        if(paidui.delete(cardID)){removeCardType(cardID);}
        if(cardID!=0 && ding.indexOf(cardID) != -1) {
            ding.splice(ding.indexOf(cardID), 1);
        }
        else if(ding.indexOf(cardID) == -1 && ding.indexOf(0) !=-1){
            ding.splice(ding.indexOf(0),1);
        }
    }
    else if (zone == 1 && id == 255 && FromPosition == 0) {
        if(paidui.delete(cardID)){removeCardType(cardID);}
        if(cardID!=0 && di.indexOf(cardID) != -1) {
            di.splice(di.indexOf(cardID), 1);
        }
        else if(di.indexOf(cardID) == -1 && di.indexOf(0) !=-1){
            di.splice(di.indexOf(0),1);
        }
    }
    // 猜测65282是处理区
    else if (zone == 1 && id == 255 && FromPosition == 65282) {
        if(paidui.delete(cardID)){removeCardType(cardID);}
        if(cardID!=0){

            let index = ding.indexOf(cardID);
            if (index != -1) {
                ding.splice(index,1);
                insertInd = index;

            }
            else if(index == -1 && ding.indexOf(0) !=-1){
                ding.splice(index,1);
                insertInd = -1;
            }
        }
    }
    //从弃牌堆丢牌
    else if (zone == 2) { qipai.delete(cardID); if(paidui.delete(cardID)){removeCardType(cardID);}}
    //从处理区丢牌
    else if (zone == 3) { chuli.delete(cardID); if(paidui.delete(cardID)){removeCardType(cardID);}}
    //从标记区丢牌
    else if (zone == 4) {
        if(typeof (biaoji[id])!='undefined'){
            isDuanXian = false;
            if(paidui.delete(cardID)){removeCardType(cardID);}
            let index = biaoji[id].indexOf(cardID);
            if (index == -1) { cardID = 0; index = biaoji[id].indexOf(cardID); }
            unknownCard.push(biaoji[id].splice(index,1)[0]);
        }
        else{isDuanXian = true;console.warn("duanxian"+ zone + cardID)}

    }
    else if (zone == 5) {
        if(typeof (shoupai[idOrder[id]])!='undefined') {
            isDuanXian = false;

            for(let i = 0; i< idOrderPre.length; i++){
                shoupai[i].delete(cardID);
            }
            if (paidui.delete(cardID)) {
                removeCardType(cardID);
            }
        }
        else{isDuanXian = true;console.warn("duanxian"+ zone + cardID)}

    }
    //装备区丢牌
    else if (zone == 6) {
        if(typeof (zhuangbei[id])!='undefined'){
            isDuanXian = false;
            let index = zhuangbei[id].indexOf(cardID);
            if (index == -1) { let cardID = 0; index = zhuangbei[id].indexOf(cardID); }
            zhuangbei[id].splice(index, 1);
            if(paidui.delete(cardID)){removeCardType(cardID);}
        }
        else{isDuanXian = true;console.warn("duanxian"+ zone + cardID)}

    }
    //判定
    else if (zone == 7) {
        if(typeof (panding[id])!='undefined') {
            let index = panding[id].indexOf(cardID);
            if (index == -1) {
                let cardID = 0;
                index = panding[id].indexOf(cardID);
            }
            panding[id].splice(index, 1);
            if (paidui.delete(cardID)) {
                removeCardType(cardID);
            }
        }
        else{isDuanXian = true;console.warn("duanxian"+ zone + cardID)}

    }
    else if (zone == 8) { jineng.delete(cardID); if(paidui.delete(cardID)){removeCardType(cardID);}}
    else if (zone == 9) { return "洗牌"; }
    else if (zone == 10) { zone10.delete(cardID); if(paidui.delete(cardID)){removeCardType(cardID);}}
    else {
        console.warn("card.remove: " + zone + " id: " + id+"cardID"+cardID);
    }
    remShouPai.delete(cardID);
    // return cardID;

}
function removeCardType(cardID){
    if(cardID!=0 && cardList.includes(cardID)) {
        console.warn("card type remove: " + cardID + currentMode[cardID]["name"] + " " + JSON.stringify(getCardNumAndSuit(cardID)));
        if (typeof (currentCardType[currentMode[cardID]["name"]]) != 'undefined') {
            let n = currentCardType[currentMode[cardID]["name"]]["cardNum"];
            if (n > 0) {
                n--;
                currentCardType[currentMode[cardID]["name"]]["cardNum"] = n;
                if (n == 1) {
                    document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]["name"]).disabled = false;
                    document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]["name"]).innerText = (currentMode[cardID])["name"];
                } else if (n == 0) {
                    document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]["name"]).innerText = (currentMode[cardID])["name"];
                    document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]["name"]).disabled = true;
                } else {
                    document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]["name"]).innerText = n + (currentMode[cardID])["name"];
                    document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]["name"]).disabled = false;
                }
            }
            if (getCardNumAndSuit(cardID)["cardSuit"] == "♦") {
                diamond--;
            } else if (getCardNumAndSuit(cardID)["cardSuit"] == "♣") {
                club--;
            } else if (getCardNumAndSuit(cardID)["cardSuit"] == "♠") {
                spade--;
            } else if (getCardNumAndSuit(cardID)["cardSuit"] == "♥") {
                heart--;
            }
            if ((getCardNumAndSuit(cardID)["cardSuit"] == "♥" || getCardNumAndSuit(cardID)["cardSuit"] == "♦") && (currentMode[cardID]["name"] == "火杀" || currentMode[cardID]["name"] == "雷杀" || currentMode[cardID]["name"] == "杀")) {
                hongsha--;
            }
            else if ((getCardNumAndSuit(cardID)["cardSuit"] == "♣" || getCardNumAndSuit(cardID)["cardSuit"] == "♠") && (currentMode[cardID]["name"] == "火杀" || currentMode[cardID]["name"] == "雷杀" || currentMode[cardID]["name"] == "杀")) {
                heisha--;
            }
            if(diamond<0){diamond = 0;}
            else if(heart<0){heart = 0;}
            else if(club<0){club = 0;}
            else if(diamond<0){diamond = 0;}
            else if(spade<0){spade = 0;}
            else if(hongsha<0){hongsha = 0;}
            else if(heisha<0){heisha = 0;}
            else if(diamond<0){diamond = 0;}

            document.getElementById('iframe-source').contentWindow.document.getElementById("heart").innerText = "♥红桃 × " + heart;
            document.getElementById('iframe-source').contentWindow.document.getElementById("club").innerText = "♣梅花 × " + club;
            document.getElementById('iframe-source').contentWindow.document.getElementById("spade").innerText = "♠黑桃 × " + spade;
            document.getElementById('iframe-source').contentWindow.document.getElementById("diamond").innerText = "♦方片 × " + diamond;
            // document.getElementById('iframe-source').contentWindow.document.getElementById("shandian").innerText ="♠黑桃2~9 概率:"+ Math.round((spade2_9 / paidui.size) * 100)+'%';
            document.getElementById('iframe-source').contentWindow.document.getElementById("hongsha").innerText = "红杀 × " + hongsha;
            document.getElementById('iframe-source').contentWindow.document.getElementById("heisha").innerText = "黑杀 × " + heisha;

        }
    }
}
function addCardType(cardID){
    if(cardID!=0 && cardList.includes(cardID)) {
        //console.warn("card type add: " + cardID + currentMode[cardID]["name"] + " " + JSON.stringify(getCardNumAndSuit(cardID)));
        if (typeof (currentCardType[currentMode[cardID]["name"]]) != 'undefined') {
            let n = currentCardType[currentMode[cardID]["name"]]["cardNum"];
            if (n >= 0) {
                n++;
                currentCardType[currentMode[cardID]["name"]]["cardNum"] = n;
                if (n == 1) {
                    document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]["name"]).disabled = false;
                    document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]["name"]).innerText = (currentMode[cardID])["name"];
                } else if (n == 0) {
                    document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]["name"]).innerText = (currentMode[cardID])["name"];
                    document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]["name"]).disabled = true;
                } else {
                    document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]["name"]).innerText = n + (currentMode[cardID])["name"];
                    document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]["name"]).disabled = false;
                }
            }
            if (getCardNumAndSuit(cardID)["cardSuit"] == "♦") {
                diamond++;
            } else if (getCardNumAndSuit(cardID)["cardSuit"] == "♣") {
                club++;
            } else if (getCardNumAndSuit(cardID)["cardSuit"] == "♠") {
                spade++;
            } else if (getCardNumAndSuit(cardID)["cardSuit"] == "♥") {
                heart++;
            }
            if ((getCardNumAndSuit(cardID)["cardSuit"] == "♥" || getCardNumAndSuit(cardID)["cardSuit"] == "♦") && (currentMode[cardID]["name"] == "火杀" || currentMode[cardID]["name"] == "雷杀" || currentMode[cardID]["name"] == "杀")) {
                hongsha++;
            } else if ((getCardNumAndSuit(cardID)["cardSuit"] == "♣" || getCardNumAndSuit(cardID)["cardSuit"] == "♠") && (currentMode[cardID]["name"] == "火杀" || currentMode[cardID]["name"] == "雷杀" || currentMode[cardID]["name"] == "杀")) {
                heisha++;
            }
            if (getCardNumAndSuit(cardID)["cardSuit"] == "♠" && getCardNumAndSuit(cardID)["cardNum"] >= 2 && getCardNumAndSuit(cardID)["cardNum"] <= 9) {
                spade2_9++;
            }
            document.getElementById('iframe-source').contentWindow.document.getElementById("heart").innerText = "♥红桃 × " + heart;
            document.getElementById('iframe-source').contentWindow.document.getElementById("club").innerText = "♣梅花 × " + club;
            document.getElementById('iframe-source').contentWindow.document.getElementById("spade").innerText = "♠黑桃 × " + spade;
            document.getElementById('iframe-source').contentWindow.document.getElementById("diamond").innerText = "♦方片 × " + diamond;
            // document.getElementById('iframe-source').contentWindow.document.getElementById("shandian").innerText ="♠黑桃2~9 概率:"+ (spade2_9/paidui.size).toFixed(2);
            //document.getElementById('iframe-source').contentWindow.document.getElementById("paiduiSize").innerText ="牌堆张数: "+ paidui.size;
            document.getElementById('iframe-source').contentWindow.document.getElementById("hongsha").innerText = "红杀 × " + hongsha;
            document.getElementById('iframe-source').contentWindow.document.getElementById("heisha").innerText = "黑杀 × " + heisha;

        }
    }
}
function allCardToCurrentMode(cardList){
    currentMode = {};
    currentMode["0"] = { ...allCard["0"] };

    // Iterate through cardList and populate currentMode
    for (const cid of cardList) {
        currentMode[cid] = allCard[cid] || { ...allCard["0"] };
    }

    return currentMode;
}
function currentModeCardType(cards) {
    const cardInfoMap = {};

    Object.values(cards).forEach(card => {
        const cardName = card.name;
        const cardType = card.type;

        if (cardName !== "?") {
            if (!cardInfoMap[cardName]) {
                cardInfoMap[cardName] = { cardNum: 1, cardType };
            } else {
                cardInfoMap[cardName].cardNum += 1;
            }
        }
    });

    return cardInfoMap;
}

function mainLogic(args){
    if(args!={}){
        window.postMessage({ API: args }, "*");
    }

    let className = args["className"];
    card.CardIDs = args["CardIDs"];
    card.CardID = args["CardID"];
    card.FromID = args["FromID"];
    card.FromZone = args["FromZone"];
    card.ToID = args["ToID"];
    card.ToZone = args["ToZone"];
    card.CardCount = args["CardCount"];
    card.DataCount = args["DataCount"];
    card.SpellID = args["SpellID"];//使用的技能
    card.FromPosition = args["FromPosition"];
    card.ToPosition = args["ToPosition"];
    var cardCount = args["cardCount"];
    if(typeof args["cardList"]!='undefined'){cardList = args["cardList"];cardCount = cardList.length}
    let cardID = 0;
    var firstID = args["SeatID"];
    var Param = args["Param"];
    var Params = args["Params"];
    var targetSeat= args["targetSeat"];
    let ClientID = args["ClientID"];
    DestSeatIDs = args["DestSeatIDs"];
    var GeneralSkinList =args["GeneralSkinList"];
    var Infos = args["Infos"];
    var Cards = args["Cards"];
    var seatId = args["seatId"];
    var SeatID = args["SeatID"];
    var Round = args["Round"];
    var curUserID = args["curUserID"];
    // var userID = args["userID"];
    var handCard = args["handCard"];
    var cards = args["cards"];
    var HLCSseatId = args["HLCSseatId"];
    var nianshouBaozhuCurNumber = args["nianshouBaozhuCurNumber"];

    var gameUserActionIndexList = args.gameUserActionIndexList;

    if(className == 'cmsg.CRespGameGeneralSkin' ){
        if(userID = args.userID){
            if(args.generalID == 530){
                enableFenYin = true;
            }
        }
    }
    if(className == 'cmsg.CNotifyTableModifyUserSeat' ){
        size = Infos["length"];
        console.warn("card renshu"+ size);
    }
    if(className == 'MsgReconnectGame' ){
        isDuanXian = true;
    }
    if (className == "logicmsg.MsgGamePlaycard") {
        gameStatusMap = {
            isJunZhengBiaoZhun: false,
            isGuoZhanBiaoZhun: false,
            isUnknown: false,
            isHuanLeBiaoZhun: false,
        };
         if (cardCount === 161 && cardList[160] === 161) {
            gameStatusMap.isJunZhengBiaoZhun = true;
        } else if (cardCount === 160 && cardList[159] === 160) {
            gameStatusMap.isHuanLeBiaoZhun = true;
        } else if (cardCount === 108 && cardList[107] === 1108) {
            gameStatusMap.isGuoZhanBiaoZhun = true;
        } else{
            gameStatusMap.isUnknown = true;
        }
        currentMode = allCardToCurrentMode(cardList);
        currentCardType = currentModeCardType(currentMode);


            gameStart();
            // resetOrderContainer();
            // hideOrderContainer(size);
            for(let i = 1; i<=3;i++){
                clearButton("type"+i);
            }
            addCardTypeButton(currentCardType);
    }
    //严教
    if (className == "logicmsg.MsgRoleOptTargetNtf"  && card.SpellID == 832) {
        arr = [];
        for(const p of card.CardIDs){
           arr.push(parseInt(getCardNumAndSuit(p)["cardNum"]));
        }
        calcResult();
    }
    //孙寒华
    // if (className == "logicmsg.MsgRoleOptTargetNtf"  && card.SpellID == 2005) {
    //     for(const p of card.CardIDs){
    //         shoupai[idOrder[card.iinToID]].add(p);
    //     }
    // }


    let cardNumAndSuit;
    if ( !isDuanXian && !isB) {
        //欢乐成双队友手牌
        if (isGameStart && className == "logicmsg.CRespGameUserHandCard" && typeof handCard != 'undefined') {
            handCard.forEach(card => shoupai[idOrder[HLCSseatId]].add(card));

        }
        //斗地主队友手牌
        if (isGameStart && className == "logicmsg.MsgGameHandCardNtf" && typeof cards != 'undefined') {
            cards.forEach(card => shoupai[idOrder[seatId]].add(card));
        }
        //座位表 start
        if(className =='logicmsg.MsgSetGamePhaseNtf' && Round == 0){
            clearSuit();
        }
        //
        //     //先根据movecard发牌得到 idOrderPre 然后根据第一个阶段将座位重新排列
        //     if (!isSeatOrder && Round == 0 && (SeatID == firstSeatID|| gameStatusMap.isDouDiZhu||gameStatusMap.isShenWu)) {
        //         if(gameStatusMap.isDouDiZhu){firstSeatID = idOrderPre[0];}
        //         if(gameStatusMap.isShenWu){firstSeatID = idOrderPre[4];}
        if(className =='logicmsg.CGameModeStartBattlePhaseFinishMotify'){
                let ind = idOrderPre.indexOf(firstSeatID);
                for (let i = 0; i < idOrderPre.length; i++) {
                    newIdOrder[idOrderPre[ind % idOrderPre.length]] = seat;
                    newShouPai[seat] = shoupai[idOrderPre[ind % idOrderPre.length]];
                    seat++;
                    ind++;
                }
                idOrder = newIdOrder;
                shoupai = newShouPai;
                isSeatOrder = true;
                console.warn("card reOrder shoupai: " + JSON.stringify(shoupai));
                console.warn("card reOrder seat info: " + JSON.stringify(idOrder));

        }
        if(className == 'logicmsg.ModeGameRoleOrderIndexNotify'){
            // 使用Array.find()方法查找没有roleOrderIndex属性的对象
            let objectWithoutRoleOrderIndex = gameUserActionIndexList.find(item => !item.hasOwnProperty('roleOrderIndex'));

            // 如果找到了对象并且该对象没有 roleSeatId 属性，则设置为 0，否则获取 roleSeatId 的值
            firstSeatID = objectWithoutRoleOrderIndex ? (objectWithoutRoleOrderIndex.roleSeatId || 0) : 0;
            console.warn("firstSeatID", firstSeatID)
        }
        //座位表 end
        //spell 记录目标角色 987 988 黄承彦，神甘921 伏间851
        if (className == "PubGsCUseSpell" && typeof (DestSeatIDs) != 'undefined' && DestSeatIDs.length > 0 && (card.SpellID == 987 || card.SpellID == 988 || card.SpellID == 921||card.SpellID == 851)) {
            DestSeatID = DestSeatIDs[0];
        }
        if (className == "PubGsCUseSpell" && card.SpellID == 3157 && card.CardIDs.length!=0) {
            for(const c of card.CardIDs){
                shoupai[idOrder[firstID]].add(c);
            }
            drawShouPai(shoupai);
        }
        //徐氏洗牌
        else if (className == "PubGsCUseSpell"  && (card.SpellID == 781)) {
            paidui.forEach(element => {
                qipai.add(element);
            });
            paidui = new Set();
            ding = [];
            di = [];
        }
        //记录国战大嘴乱击花色
        else if (className == "PubGsCUseCard" && mainID==SeatID &&  enableQuanBian) {
            addSuit(card.CardID);
        }

        else if (className == "PubGsCUseSpell"  && (card.SpellID == 2143)) {
            enableLuanJi = true;
            for(const c of card.CardIDs){
                addSuit(c);
            }
        }
        //什么傻叉昭然，用的欢乐成双的class不用欢乐成双的ui和代码逻辑
        else if (className == "ClientHappyGetFriendHandcardRep") {
            for(const c of Cards){
                if(typeof idOrder[seatId] != 'undefined'){
                    shoupai[idOrder[seatId]].add(c);
                }
            }
            drawShouPai(shoupai);
        }
        //神甘宁
        else if (className == "logicmsg.MsgRoleOptTargetNtf" &&  (card.SpellID == 179)) {
            if(typeof (targetSeat) != 'undefined'){
                for(const p in card.CardIDs){
                    if(p%2==1){
                        shoupai[idOrder[targetSeat]].add(card.CardIDs[p]);
                    }
                }
            }
            drawShouPai(shoupai);
        }
        //庞宏评骘2776看牌
        else if (className == "logicmsg.MsgRoleOptTargetNtf" &&  (card.SpellID == 2776)&& args.optType == 28) {
            if(args.optSeat==[...mySeatID][0]){
                if(typeof (targetSeat) != 'undefined'){
                    for(const p in card.CardIDs){
                        shoupai[idOrder[targetSeat]].add(card.CardIDs[p]);
                    }
                }
                drawShouPai(shoupai);
            }
        }
        //国战知己知彼2022看牌
        else if (className == "logicmsg.MsgRoleOptTargetNtf" &&  (card.SpellID == 2022)&& args.optType == 28) {
            if(typeof (targetSeat) != 'undefined'){
                for(const p in card.CardIDs){
                    if(card.CardIDs[p]!=1){
                        shoupai[idOrder[targetSeat]].add(card.CardIDs[p]);
                    }
                }
            }
            drawShouPai(shoupai);
        }
        //蒋钦尚义2658看牌
        else if (className == "logicmsg.MsgRoleOptTargetNtf" &&  (card.SpellID == 2658)&& (args.optType == 29||args.optType == 28)) {
            if(typeof (targetSeat) != 'undefined'){
                for(const p in card.CardIDs){
                        shoupai[idOrder[targetSeat]].add(card.CardIDs[p]);
                }
            }
            drawShouPai(shoupai);
        }
        //国战蒋钦尚义2138看牌
        else if (className == "logicmsg.MsgRoleOptTargetNtf" &&  (card.SpellID == 2138)&& (args.optType == 28||args.optType == 30)) {
            if(typeof (targetSeat) != 'undefined'){
                for(const p in card.CardIDs){
                    if (p!=1){
                        shoupai[idOrder[targetSeat]].add(card.CardIDs[p]);
                    }
                }
            }
            drawShouPai(shoupai);
        }
        //杜畿标安东、界安东
        else if (className == "logicmsg.MsgRoleOptTargetNtf" &&  (card.SpellID == 1469||card.SpellID == 799) && args.optType == 29) {
            if(typeof (targetSeat) != 'undefined'){
                for(const p in card.CardIDs){
                    shoupai[idOrder[targetSeat]].add(card.CardIDs[p]);
                }
            }
            drawShouPai(shoupai);
        }
        //用spell记录的targets
        else if (className == "logicmsg.MsgRoleOptTargetNtf" &&  ( card.SpellID == 2433) && args.optType == 28) {
            if(typeof (spellTargets) != 'undefined'){
                for(const p in card.CardIDs){
                    if(p%2==0){
                        shoupai[idOrder[spellTargets]].add(card.CardIDs[p]);
                    }
                }
            }
            drawShouPai(shoupai);
        }
        else if (className=="logicmsg.XinChunNianShouBaoZhuNumberNotify"){
            if(nianshouBaozhuCurNumber>-1){
                if(nianshouBaozhuCurNumber==0){
                    nianshouBaozhuCurNumber=30
                }
                document.getElementById('iframe-source').contentWindow.document.getElementById('mizhu_dianshu').value=nianshouBaozhuCurNumber;

                var MiZhuCalBTN = document.getElementById('iframe-source').contentWindow.document.getElementById("mizhu");
                MiZhuCalBTN.onmousedown();
            }
        }
        else if (className == "logicmsg.MsgRoleOptTargetNtf" &&  ( card.SpellID == 2433) && args.optType == 30) {
            if(typeof (targetSeat) != 'undefined'){
                for(const p in card.CardIDs){

                        shoupai[idOrder[targetSeat]].add(card.CardIDs[p]);

                }
            }
            drawShouPai(shoupai);
        }
        else if (className == "logicmsg.MsgMoveCard" && typeof (card.CardCount) != 'undefined' && card.CardCount > 0) {
            //游戏开始后 洗牌，会从弃牌堆2丢到洗牌堆
            if (card.FromZone == 2 && card.ToZone == 9 && card.FromID == 255 && card.ToID == 255 && isGameStart) {
                ding = [];di = [];
                remCardCount = card.CardCount;
                remShouPai = paidui;
                drawRemShouPai(remShouPai);
                paidui = qipai;
                qipai = new Set();
                for(const cid of cardList){
                    removeCardType(cid);
                }
                hongsha = 0; heisha = 0;diamond = 0;heart = 0;club = 0;diamond = 0;spade = 0;hongsha = 0;heisha = 0;diamond = 0;
                paidui.forEach(element => {
                    addCardType(element)
                });
            }
            //游戏开始 弃牌堆2丢到洗牌堆
            else if (card.FromZone == 2 && card.ToZone == 9 && (card.FromID == 255 ||card.FromID == 0) && (card.ToID == 255||card.ToID == 0) && !isGameStart) {
                remCardCount = card.CardCount;
                resetOrderContainer();
                // if(gameStatusMap.isZhuGongSha){hideOrderContainer(5);}
                // else if(gameStatusMap.isZhuGongShaShanShan){hideOrderContainer(5);}

                hideOrderContainer(size);
                console.warn("发牌");
            }
            //系统发牌+手气卡拿牌+牌堆全部进入弃牌堆了洗牌 对自己手牌和cardType 和paidui 产生影响
            else if (card.ToZone == 5 && card.FromID == 255 && card.FromZone == 1 && !isGameStart) {
                //重复用手气卡不会添加 但是手牌会更新
                console.warn("游戏开始,系统发牌/使用手气卡");
                console.warn("card shouqika/fapai shoupai[id]"+JSON.stringify(shoupai));
                remCardCount-= card.CardCount;
                if (!idOrderPreSet.has(card.ToID)) {
                    idOrderPreSet.add(card.ToID);
                    idOrderPre.push(card.ToID);
                }
                if(firstSeatID == -1){firstSeatID = idOrderPre[0];}
                console.warn("card idOrderPre " + JSON.stringify(idOrderPre));

                //用于22 的糜竺计算
                if (typeof (card.CardIDs[0]) != 'undefined' && card.CardIDs[0] != 0) {
                    mainID = card.ToID;
                    mySeatID.add(mainID)
                }

                for (let i = 0; i < card.CardCount; i++) {
                    if (card.CardIDs.length != 0) {
                        cardID = card.CardIDs[i];
                        const targetID = isSeatOrder ? idOrder[card.ToID] : card.ToID;
                        shoupai[targetID].add(cardID);
                        removeCardType(cardID);
                        paidui.delete(cardID);
                    }
                }

            }
            //手气卡丢牌
            else if (card.FromZone == 5  && card.ToZone == 1 && card.ToID == 255 && !isGameStart) {
                remCardCount+=card.CardCount;
                shoupai[card.FromID] = new Set();
                for (let i = 0; i < card.CardCount; i++) {
                    if (card.CardIDs.length != 0) {
                        cardID = card.CardIDs[i];
                    }
                    addCardType(cardID);
                    paidui.add(cardID);

                }
                console.warn("card 手气卡丢牌 " + JSON.stringify(shoupai));
            }
            //神武先丢一张装备牌
            else if (card.FromID == 255  && card.FromZone == 1 && card.ToZone == 12 && card.ToID == 255 && !isGameStart) {
                removeCardType(cardID);
            }
            //然后换一个装备置入牌堆
            else if (card.FromID == 255  && card.FromZone == 0 && card.ToZone == 1 && card.ToID == 255 && !isGameStart) {
                addCardType(cardID);
            }
            else if (card.FromID == 255  && card.FromZone == 1 && card.ToZone == 6 && !isGameStart) {
            }
            // 或者有其他操作,则说明游戏开始
            //不点手气卡,摸牌,也会进入这里
            else {
                isGameStart = true;

            }
            //游戏开始
            if (isGameStart) {

                //单独适配,别人暗的已知手牌全部给一个人的情况，例如自己不是刘备，刘备有已知手牌，但是全部给一个人，三国杀代码是暗牌0
                //如果刘备有两张牌，一张明牌，一张给a，一张给b，都给到手牌，之后出现再删掉
                // if(card.FromZone == 5  && card.ToZone == 5 && card.FromID!=card.ToID && card.CardCount >= shoupai[idOrder[card.FromID]].size  && card.DataCount == 0){
                //     temShouPai = new Set();
                //     if(shoupai[idOrder[card.FromID]].size!=0){
                //         temShouPai = shoupai[idOrder[card.FromID]];
                //     }
                //     if(temShouPai.size!=0){
                //         for(const c of temShouPai){
                //             shoupai[idOrder[card.ToID]].add(c);
                //         }
                //         shoupai[idOrder[card.FromID]] = new Set();
                //     }
                // }
                //单独适配,鲁芝清忠，暗的已知手牌全部给一个人的情况，例如鲁芝有已知手牌，但是全部给一个人，三国杀代码是暗牌0
                // 缔盟 清忠
                if(card.FromZone == 10  && card.FromID!=card.ToID
                    && card.ToPosition==65280 && card.FromPosition== 65282
                    && card.ToZone== 5 && (card.SpellID == 3036 ||card.SpellID==121)){
                    //只需要换一次，清忠缔盟会有两次，第一次赋值之后就不需要再换了
                    isDiMeng = !isDiMeng;
                    if(isDiMeng){
                        temShouPai = shoupai[idOrder[card.ToID]];
                        shoupai[idOrder[card.ToID]] = shoupai[idOrder[card.FromID]];
                        shoupai[idOrder[card.FromID]] = temShouPai;
                    }
                }
                if(card.FromZone == 0
                    && card.FromID == 0
                    && card.ToID == 0
                    && card.ToPosition==0
                    && card.FromPosition==0
                    && card.ToZone== 0
                    && card.SpellID == 843){
                    let qianLong = card.CardIDs.slice[card.CardIDs.indexOf(0) + 1];
                    for (const c in qianLong ){
                        di.push(c);
                    }
                }
                //询询
                if(card.FromZone == 1
                    && card.FromID == 255
                    && card.ToID == 255
                    && card.ToPosition==65280
                    && card.FromPosition==65280
                    && card.ToZone== 8
                    && card.SpellID == 725){
                    xunxun = card.CardIDs;
                }
                //天辩
                if(card.FromZone == 1
                    && card.FromID == 255
                    && card.ToID == 255
                    && card.ToPosition==65280
                    && card.FromPosition==65282
                    && card.ToZone== 3
                    && card.SpellID == 791){
                    ding.pop();
                }

                for (let i = 0; i < card.CardCount; i++) {
                    if (card.CardIDs.length != 0) {
                        cardID = card.CardIDs[i];
                    }
                    else{cardID = 0;}
                    var FromID = card.FromID;
                    var FromZone = card.FromZone;
                    var ToZone = card.ToZone;
                    var ToID = card.ToID;
                    var FromPosition =card.FromPosition;
                    var ToPosition =card.ToPosition;
                    if(card.FromZone == 1 ){
                        remCardCount--;
                    }
                    if(card.ToZone == 1 ){
                        remCardCount++;
                    }
                    //从牌堆出发，到其他区域，判断顶/底
                    //从顶摸牌 已经到底了
                    if(FromID == 255 && FromZone == 1 && FromPosition == 65280 && di.length!=0 && remCardCount == di.length){
                        ding = di.reverse();
                        di= [];
                    }
                    //顶
                    if(FromID == 255 && FromZone == 1 && FromPosition == 65280 && ding.length!=0 && cardID ==0){
                        cardID = ding.pop();
                        console.warn("card 顶 pop "+ cardID);
                    }

                    //底
                    if(FromID == 255 && FromZone == 1 && FromPosition == 0 && di.length!=0 && cardID ==0){
                        cardID = di.pop();
                        console.warn("card 底 pop "+ cardID);
                    }

                    removeCard(FromID, cardID, FromZone,FromPosition);
                    addCard(ToID, cardID, ToZone, ToPosition,card.SpellID);


                }

            }
            // if (card.FromZone == 1 && card.FromID == 255 && card.ToZone == 8 && card.ToID == 255 && typeof (card.SpellID) != 'undefined' && card.SpellID == 3033) {
            //     JiZhanCal(parseInt(getCardNumAndSuit(cardID)["cardNum"]));
            // }
            //行殇
            if (typeof (card.SpellID) != 'undefined' && card.SpellID == 105) {
                for(const c of shoupai[idOrder[card.FromID]]){
                    removeCard(card.FromID, c , card.FromZone,card.FromPosition);
                    addCard(card.ToID, c, card.ToZone, card.SpellID);
                }
            }
            drawShouPai(shoupai);
            drawDingOrDi(ding, di);
            if(remShouPai.size !=0){drawRemShouPai(remShouPai);}
            else{document.getElementById('iframe-source').contentWindow.document.getElementById("knownCards").innerText = '';
                document.getElementById('iframe-source').contentWindow.document.getElementById("knownCardsInHand").style.display = "none";
            }
        }
        isAutoCloseEnabled = true;

    } else {
        if (document.getElementById('createIframe')) {
            document.getElementById('iframe-source').contentWindow.document.getElementById("nav1").innerHTML = "<b>不支持该牌堆/断线重连</b>";
            if(isAutoCloseEnabled){
                document.getElementById('iframe-source').style.display = "none";
                var toggle = document.getElementById('toggle-me');
                toggle.innerText = "+";
                document.getElementById('createIframe').style.height = '30px';
                document.getElementById('createIframe').style.resize = 'none'; // 禁用窗口调整大小
                isAutoCloseEnabled = false;
            }
        }

    }
}
//用于记录错误
function main () {
    let args = Array.prototype.slice.call(arguments);
    // console.warn(JOSN.stringify(args[4]));
    // console.warn(typeof args[4]);
    if(args[2] == 'cmsg.CRespUserLoginState'){
        let userID = args[4].userID;
        //这里可以预先注入
        console.warn(userID);
        if(!isFrameAdd){
            addFrame();
            var elmnt = document.getElementById('createIframe');
            buttonClick();
            initDragElement();
        }
    }

    var mainInfo = {};
    let className = args[2];
    // if(classList.includes(className)){

        if(args[4]){
            mainInfo = {};
            mainInfo['className'] = args[2];
            mainInfo['userID'] = args[4].userID;
            mainInfo["CardIDs"] = args[4]["datas"];
            mainInfo["CardID"] = args[4]["cardId"];
            mainInfo["CardCount"] = args[4]["cardCnt"];
            mainInfo["DataCount"] = args[4]["DataCount"];
            mainInfo["SpellID"] = args[4]["spellId"];//使用的技能
            if(className  == "logicmsg.MsgMoveCard"){
                mainInfo["ToPosition"] = args[4] && args[4]["toPos"] !== undefined ? args[4]["toPos"] : 0;
                mainInfo["ToID"] = args[4] && args[4]["toId"] !== undefined ? args[4]["toId"] : 0;
                mainInfo["FromID"] = args[4]["fromId"];
                mainInfo["FromZone"] = args[4]["fromZone"];
                mainInfo["ToZone"] = args[4]["toZone"];
                mainInfo["FromPosition"] = args[4]["fromPos"];
            }
            mainInfo["cardCount"] = args[4]["cardCount"];
            mainInfo["cardList"] = args[4]["card"];
            mainInfo["SeatID"] = args[4]["seat"];
            mainInfo["Param"] = args[4]["Param"];
            mainInfo["Params"] = args[4]["Params"];
            mainInfo["DestSeatIDs"] = args[4]["DestSeatIDs"];
            mainInfo["Infos"] = args[4]["seatInfo"];
            mainInfo["Cards"] = args[4]["Cards"];
            mainInfo["targetSeat"] = args[4]["targetSeat"];
            if(args[4]["targets"]){
                spellTargets= args[4]["targets"][0];
            }
            mainInfo["optType"] = args[4]["optType"];
            mainInfo["seatId"] = args[4]["seatId"];
            mainInfo["HLCSseatId"] = args[4]["seat"];
            mainInfo["handCard"] = args[4]["handCard"];
            mainInfo["cards"] = args[4]["cards"];

            mainInfo["SeatID"] = args[4]["SeatID"];
            mainInfo["Round"] = args[4]["phase"];
            mainInfo["generalID"] = args[4]["generalID"];
            mainInfo["optSeat"] = args[4]["optSeat"];
            mainInfo["gameUserActionIndexList"] = args[4]["gameUserActionIndexList"];
            mainInfo["nianshouBaozhuCurNumber"] = args[4]["nianshouBaozhuCurNumber"];
            if(mainInfo!={}
                && className != "cmsg.CNotifyChatMessage"
                && className != "cmsg.CNotifyHorseRaceLamp"){
                console.warn(JSON.stringify(mainInfo))
            }
        }
    let mainInfoToMainLogic = JSON.parse(JSON.stringify(mainInfo));
    try {
        mainLogic(mainInfoToMainLogic);
    }
    catch (e){
        console.error(e.message);
        console.error(e.stack);
        const [, lineno, colno] = e.stack.match(/(\d+):(\d+)/);
        console.error('Line:', lineno);
        console.error('Column:', colno);
        document.getElementById('iframe-source').contentWindow.document.getElementById("nav1").innerHTML = "<b>小抄GG了，联系作者解决</b>";
    }
}
// ----------------------user interface------------------------------------------
var iframe;
function clearButton(type) {
    var div = document.getElementById('iframe-source').contentWindow.document.getElementById(type);

    while(div.firstChild) {
        div.removeChild(div.firstChild);
    }
}
function addCardTypeButton(cardType){
    var toBeAdd;
    for(const key in cardType){
        var type = "type"+cardType[key]['cardType'];
        var button = document.createElement('button');
        toBeAdd = document.getElementById('iframe-source').contentWindow.document.getElementById(type);
        button.id = key;
        button.className = "cardType";
        let n = cardType[key]['cardNum'];
        if(n==1){button.innerText = key;}
        else if(n==0){button.innerText = key;}
        else{button.innerText = n+key;}
        // button.innerText = cardType[key]['cardNum']+key;
        toBeAdd.append(button);
    }
}
function drawShouPai(shoupai) {
    var toBeAdd;
    for (let i = 0; i < idOrderPre.length; i++) {
        let seatID = (i + 1).toString();
        toBeAdd = document.getElementById('iframe-source').contentWindow.document.getElementById(seatID);
        const shoupaiDIV = document.createElement('div');

        for (const s of shoupai[i]) {
            if (s == '0') {
                continue;
            }

            var button = document.createElement('button');
            if (getCardNumAndSuit(s)["cardSuit"] == '♦' || getCardNumAndSuit(s)["cardSuit"] == '♥') {
                button.className = "shoupaiR"; // 红色手牌
            } else {
                button.className = "shoupai";
            }

            if (knownShouPai.has(s)) {
                button.classList.add("knownShouPai");
            }

            let emojiWrapper = document.createElement('div');
            emojiWrapper.style.width = "100%";
            emojiWrapper.style.textAlign = "center";

            let emoji = document.createElement('span');
            emoji.style.fontSize = emojiFontSize; // 应用可变的字体大小
            emoji.innerText = getCardNumAndSuit(s)["cardNumAndSuit"];

            emojiWrapper.appendChild(emoji);
            button.appendChild(emojiWrapper);
            button.innerHTML +=  allCard[s]?allCard[s]["name"]:"?";
            shoupaiDIV.append(button);
        }

        toBeAdd.innerHTML = shoupaiDIV.innerHTML;
    }
}


function resetOrderContainer(){
    for(let i = 0; i<= 7; i++){
        document.getElementById('iframe-source').contentWindow.document.getElementsByClassName("orderContainer")[i].style.display = 'inline-block';
    }
}
function hideOrderContainer(size){
    for(let i = 7; i>=size; i--){
        document.getElementById('iframe-source').contentWindow.document.getElementsByClassName("orderContainer")[i].style.display = 'none';
    }
}
function clickToChangeSkinAndCloseSkinFrame(){
    isClickSkinSelect = true;
    // click this to change the mySkin first, and it initializes here
    const boxes = document.getElementById('createSkinIframeSource').contentWindow.document.querySelectorAll('.skinList');
    if(typeof UsedGeneralSkinID != "undefined" && typeof UsedGeneralSkinID["UsedGeneralSkinID"][GeneralID]!= "undefined"){
        mySkin =  UsedGeneralSkinID["UsedGeneralSkinID"][GeneralID];
    }
    boxes.forEach(box => {
        box.addEventListener('click', function handleClick(event) {
            mySkin = box.id;
            // console.warn('clicked skin'  +mySkin);

            document.getElementById("createSkinIframe").style.display = "none";
        });
    });

}
//
async function addFrame() {
    // const request = async (url) => {
    //     const response = await fetch(url)
    //     const contentType = response.headers.get('content-type')
    //     if (contentType && contentType.indexOf('application/json') !== -1) {
    //         return await response.json()
    //     }
    //     return await response.text()
    // }
    //
    // let html = await request('https://llsccm.github.io/sgstools/iframe.html')
    isFrameAdd = true;
    let div = document.getElementById('createIframe');

    if (!div) {
        div = document.createElement('div');
        div.id = 'createIframe';
        div.className = 'createIframe';
        div.style =
            "position: fixed;" +
            "overflow: hidden;" +
            "resize: vertical;  " +
            "top: 200px; " +
            "right: 5px;" +
            "width: 210px;" +
            "height: 500px;" +
            "z-index: 10000000000;" +
            "display: flex;" +
            "flex-direction: column;" +
            "color: #f2de9c;" +
            "background: rgb(50, 50, 50);" +
            "user-select: none;" +
            "text-align: left;"+
            "transition: height 200ms;";

        var header = document.createElement('p');
        header.id = 'header';
        header.className = 'header';
        header.innerText = "三国杀打小抄" + version;
        header.style =
            "display: inline-block;" +
            "margin: 1px;" +
            "user-select: none;" +
            "cursor: move;" +
            "display: flex;" +
            "justify-content: space-between;" +
            "font-size: 20px;"; // 设置字体大小，根据需要调整

        div.appendChild(header);

        // 创建按钮并将其放在 header 最右侧
        var btn = document.createElement('btn');
        btn.innerText = "-";
        btn.id = 'toggle-me';
        btn.style =
            "text-align: center;" +
            "color: #f2de9c;" +
            "background: rgb(40, 40, 40);" +
            "border-radius: 5px;" +
            "width: 25px;" +
            "height: 25px;" +
            "border: 1px solid rgb(212, 212, 162);" +
            "cursor: pointer;" +
            "user-select: none;" +
            "background: rgb(107, 30, 30);" +
            "display: flex;" + // 使用 flex 布局
            "align-items: center;" + // 垂直居中
            "justify-content: center;" + // 水平居中
            "margin: 0;"; // 设置外边距为零

// 添加悬停效果
        btn.addEventListener('mouseover', function () {
            btn.style.backgroundColor = 'rgb(130, 30, 30)';
        });
        btn.addEventListener('mouseout', function () {
            btn.style.backgroundColor = 'rgb(107, 30, 30)';
        });

        var toTab = document.createElement('button');
        toTab.innerText = "【】";
        toTab.id = 'toTab';
        toTab.style =
            "text-align: center;" +
            "color: #f2de9c;" +
            "background: rgb(40, 40, 40);" +
            "border-radius: 5px;" +
            "width: 25px;" +
            "height: 25px;" +
            "border: 1px solid rgb(212, 212, 162);" +
            "cursor: pointer;" +
            "user-select: none;" +
            "background: rgb(107, 30, 30);" +
            "display: flex;" + // 使用 flex 布局
            "align-items: center;" + // 垂直居中
            "justify-content: center;" + // 水平居中
            "margin: 0;"; // 设置外边距为零

        toTab.addEventListener('mouseover', function () {
            toTab.style.backgroundColor = 'rgb(130, 30, 30)';
        });
        toTab.addEventListener('mouseout', function () {
            toTab.style.backgroundColor = 'rgb(107, 30, 30)';
        });

        toTab.addEventListener('click', function () {
            // chrome.runtime.sendMessage({ greeting: "Hello from content script!" }, function(response) {
            //     console.log("Received response from background script:", response);
            // });
            // window.postMessage({ type: 'open_side_panel' }, "*");

            // var newWindow = window.open('', '三国杀打小抄', 'width=210,height=950,resizable=no,scrollbars=no,status=no,toolbar=no,menubar=no,location=no');
            // //if(newWindow){
            //     newWindow.document.open();
            //     newWindow.document.write(iframe.contentDocument.documentElement.innerHTML);
            //     newWindow.document.close();
            //
            //
            //
            // // 添加 MutationObserver 监听新窗口
            // var observer = new MutationObserver(function (mutationsList, observer) {
            //     if (newWindow && !newWindow.closed) {
            //         newWindow.document.open();
            //         newWindow.document.write(iframe.contentDocument.documentElement.innerHTML);
            //         newWindow.document.close();
            //     }
            // });
            //
            // // 设置 childList 为 true
            // observer.observe(iframe.contentDocument, { childList: true, subtree: true });
            //}
        });

        header.appendChild(btn);
        // header.appendChild(toTab);
        // 将按钮添加到 header 的右侧

        document.body.appendChild(div);

        iframe = document.createElement('iframe');
        iframe.style =
            "border: none;" +
            "width: 210px;" +
            "height: 1000px;" +
            "margin: 0px;" +
            "cursor: move;";
        iframe.id = 'iframe-source';
        iframe.title = 'iframe';

        // iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html);
        div.append(iframe);
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(html);
        iframe.contentWindow.document.close();
    }
}

var isAutoCloseEnabled = true;


function buttonClick(){

    var toggle = document.getElementById('toggle-me');
    toggle.onmousedown = function (){
        closeIframe = !closeIframe;
        if (closeIframe) {
            document.getElementById('iframe-source').style.display = "none";
            toggle.innerText = "+";
            document.getElementById('createIframe').style.height = '30px';
            document.getElementById('createIframe').style.resize = 'none'; // 禁用窗口调整大小
        } else {
            document.getElementById('iframe-source').style.display = "block";
            toggle.innerText = "-";
            document.getElementById('createIframe').style.height = '500px';
            document.getElementById('createIframe').style.resize = 'vertical'; // 启用窗口调整大小
        }
    };


    var MiZhuCalBTN = document.getElementById('iframe-source').contentWindow.document.getElementById("mizhu");
    var mySeat1BTN = document.getElementById('iframe-source').contentWindow.document.getElementById("mySeatID1");
    var mySeat2BTN = document.getElementById('iframe-source').contentWindow.document.getElementById("mySeatID2");

    MiZhuCalBTN.onmousedown = function (){
        if(mySeatID.size == 1){
            mySeat1BTN.style.display = 'none';
            mySeat2BTN.style.display = 'none';
            for(const m of mySeatID){
                MiZhuCards = [];
                for(const card of shoupai[idOrder[m]]){
                    MiZhuCards.push(getCardNumAndSuit(card)["cardNum"]);
                }
                //mizhu jizhan
                for(const zb of zhuangbei[m]){
                    MiZhuCards.push(getCardNumAndSuit(zb)["cardNum"]);
                }
                console.warn('jizhan', MiZhuCards);
                MiZhuCal(MiZhuCards,MiZhuCards.length);
                drawMiZhu(MiZhuRes);
            };
        }
        else{
            var index = 0;
            for(const m of mySeatID){
                index +=1;
                var seatIND = 'mySeatID' + index;
                document.getElementById('iframe-source').contentWindow.document.getElementById(seatIND).style.display = 'block';
                document.getElementById('iframe-source').contentWindow.document.getElementById(seatIND).innerText = '座位: '+(idOrder[m]+1);
                document.getElementById('iframe-source').contentWindow.document.getElementById(seatIND).onmousedown = function (){
                    MiZhuCards = [];
                    for(const card of shoupai[idOrder[m]]){
                        MiZhuCards.push(getCardNumAndSuit(card)["cardNum"]);
                    }
                    MiZhuCal(MiZhuCards,MiZhuCards.length);
                    drawMiZhu(MiZhuRes);
                }
            };
        }
    }
}

function initDragElement() {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    var popups = document.getElementsByClassName("createIframe");
    var elmnt = null;
    var currentZIndex = 100;

    for (var i = 0; i < popups.length; i++) {
        var popup = popups[i];
        var header = getHeader(popup);

        popup.onmousedown = function() {
            this.style.zIndex = "" + ++currentZIndex;
        };

        if (header) {
            header.parentPopup = popup;
            header.onmousedown = dragMouseDown;
        }
    }

    function dragMouseDown(e) {
        elmnt = this.parentPopup;
        elmnt.style.zIndex = "" + ++currentZIndex;

        e = e || window.event;
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        if (!elmnt) {
            return;
        }

        e = e || window.event;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }

    function getHeader(element) {
        var headerItems = element.getElementsByClassName("header");

        if (headerItems.length === 1) {
            return headerItems[0];
        }

        return null;
    }
}
var html =
    "<head> " +
    "<title>三国杀打小抄</title>"+
    "        <meta charset=UTF-8> " +
    "        <style type=text/css> " +
    "            ::-webkit-scrollbar{width: 5px; height: 12px;} " +
    "            ::-webkit-scrollbar-track{border: 1px solid rgb(5,5,5);} " +
    "            ::-webkit-scrollbar-thumb{background: rgb(95,86,63);} " +
    "            ::-webkit-scrollbar-thumb:hover{background: rgb(44,44,44);} " +
    "            * { " +
    "                width: 205px; " +
    "                margin: 0; " +
    "                padding: 0; " +
    "                font-size:12px; " +
    "            } " +
    "            body { " +
    "                width: 205px; " +
    "                background: rgb(40, 40, 40); " +
    "                color: #f2de9c; " +
    "                display: flex; " +
    "                flex-direction: column; " +
    "                margin: 0px; " +
    "                user-select:none;"+
    "            } " +
    "            .nav { " +
    "                width: 100%; " +
    "                background: rgb(40, 40, 40); " +
    "            } " +
    "            .nav1 { " +
    "                height: 20px; " +
    "                width: 100%; " +
    "                float: center; " +
    "                text-align: center; " +
    "                color: #f2de9c; " +
    "                background: rgb(40, 40, 40); " +
    "                margin-right: 15px; " +
    "                display: block; " +
    "            } " +
    "            .nav2 { " +
    "                height: 20px; " +
    "                width: 49%; " +
    "                float: right; " +
    "                text-align: center; " +
    "                color: #f2de9c; " +
    "                background: rgb(40, 40, 40); " +
    "                margin-left: 3px; " +
    "                border: 1px solid #f2de9c; " +
    "                display: block; " +
    "                border-radius: 5px; " +
    "            } " +
    "            .nav2:hover { " +
    "                color: #f2de9c; " +
    "                background: rgb(55, 40, 32); " +
    "                border: 1px solid #f2de9c; " +
    "            } " +
    "            .nav2:focus { " +
    "                background: rgb(55, 40, 32); " +
    "                box-shadow: 1px 1px 3px #f2de9c ; " +
    "            } " +
    "            .content { " +
    "                width: 100%; " +
    "                float: right; " +
    "            }" +
    "            .orderAndShouPai { " +
    "                width: 100%; " +
    "                overflow: hidden; " +
    "                display: inline-block; " +
    "            } " +
    "            .order { " +
    "                width: 100%; " +
    "                overflow: hidden; " +
    "            } " +
    "            .orderContainer { " +
    "                width: 100%; " +
    "                overflow: hidden; " +
    "            } " +
    "            .order-head { " +
    "                width: 10%; " +
    "                height: 25px; " +
    "                float: left; " +
    "                text-align: center; " +
    "                color: #f2de9c; " +
    "                margin-left: 3px; " +
    "            } " +
    "            .order-body:empty { " +
    "                padding: 5px; " +
    "                height: 35px; " +
    "                max-width: 82%; " +
    "                float: right; " +
    "                display: block; " +
    "                box-shadow:  1px 1px 3px ; " +
    "                margin: 1px; " +
    "                overflow: hidden; " +
    "                column-width: 300px; " +
    "                border-radius:5px; " +
    "            } " +
    "            .order-body { " +
    "                padding: 5px; " +
    "                height: auto; " +
    "                max-width: 82%; " +
    "                float: right; " +
    "                display: block; " +
    "                box-shadow:  1px 1px 3px ; " +
    "                margin: 1px; " +
    "                overflow: hidden; " +
    "                column-width: 300px; " +
    "                border-radius:5px; " +
    "            } " +
    "            .shoupai { " +
    "                --shoupaiR-width: 26px; " +
    "                font-weight: bolder; " +
    "                margin-right: calc(22px - var(--shoupaiR-width)); " +
    "                float: left; " +
    "                width: var(--shoupaiR-width); " +
    "                height: 35px; " +
    "                border: 1px solid black; " +
    "                text-align: center; " +
    "                color: black; " +
    "                background: rgb(200, 200, 166); " +
    "                box-shadow: inset 1px 1px 3px #111; " +
    "            } " +
    "            .shoupaiR { " +
    "                --shoupaiR-width: 26px; " +
    "                font-weight: bolder; " +
    "                margin-right: calc(22px - var(--shoupaiR-width)); " +
    "                float: left; " +
    "                width: var(--shoupaiR-width); " +
    "                height: 35px; " +
    "                border: 1px solid black; " +
    "                text-align: center; " +
    "                color: red; " +
    "                background: rgb(200, 200, 166); " +
    "                box-shadow: inset 1px 1px 3px #111; " +
    "            }" +
    "            .knownShouPai{" +
    "                border:1px rgb(40,40,40) solid;" +
    "                animation: blink 1s;" +
    "                animation-iteration-count: infinite ;" +
    "            }"+
    "            .knownCardsInHand{" +
    "                text-align: center;" +
    "                position: relative;" +
    "                overflow: hidden;" +
    "                display: none;" +
    "                height: 121px;" +
    "            }"+
    "            .knownCards:empty{" +
    "                text-align: center;" +
    "                position: relative;" +
    "                overflow: hidden;" +
    "                display: none;" +
    "            }" +
    "            .knownCards{ " +
    "                width: 81%;"+
    "                text-align: center; " +
    "                position: relative; " +
    "                overflow: hidden; " +
    "                height: 121px;" +
    "            }" +
    "            @keyframes blink { 50% { border-color:#f2de9c ; }  }" +
    "            .knownCards:after{ " +
    "                text-align: center; " +
    "                content: '场上手牌';" +
    "                position: absolute;" +
    "                bottom: 0;" +
    "                right: 5px;" +
    "                z-index: -1; " +
    "                font: 800 20px 'Arial Black'; " +
    "                -webkit-text-fill-color: transparent; " +
    "                -webkit-text-stroke-width: 1px; " +
    "            } " +
    "             .ding{" +
    "                text-align: center;" +
    "                width: 100%;" +
    "                position: relative;" +
    "                height: auto;" +
    "                display: none;" +

    "            } " +
    "             .dingCards{" +
    "                text-align: center;" +
    "                width: 100%;" +
    "                position: relative;" +
    "                height: auto;" +
    "                min-height: 60px;"+
    "                display: none;" +
    "            } " +
    "            .dingCards:after{ " +
    "                content: '第一张为牌堆顶';" +
    "                position: absolute;" +
    "                bottom: 0;" +
    "                right: 5px;" +
    "                z-index: -1; " +
    "                font: 800 20px 'Arial Black'; " +
    "                -webkit-text-fill-color: transparent; " +
    "                -webkit-text-stroke-width: 1px; " +
    "            } " +
    "             .di{" +
    "                text-align: center;" +
    "                width: 100%;" +
    "                position: relative;" +
    "                height: auto;" +
    "                display: none;" +
    "            } " +
    "            .diCards{ " +
    "                text-align: center; " +
    "                position: relative;" +
    "                height: auto;" +
    "                min-height: 60px;"+
    "                display: none;" +

    "            } " +
    "            .diCards:after{ " +
    "                content: '第一张为牌堆底';" +
    "                position: absolute;" +
    "                bottom: 0;" +
    "                right: 5px;" +
    "                z-index: -1; " +
    "                font: 800 20px 'Arial Black'; " +
    "                -webkit-text-fill-color: transparent; " +
    "                -webkit-text-stroke-width: 1px; " +
    "     " +
    "            } " +
    "            .cardDetail { " +
    "                width: 100%; " +
    "                overflow: hidden; " +
    "                display: inline-block; " +
    "            } " +
    "            .type { " +
    "                width: 100%; " +
    "                float: left; " +
    "            } " +
    "            .cardTypeContainer{ " +
    "                width: 100%; " +
    "                overflow: hidden; " +
    "                display: block; " +
    "            } " +
    "            .type-head { " +
    "                width: 10%; " +
    "                float: left; " +
    "                text-align: center; " +
    "                color: #f2de9c; " +
    "                margin-left: 3px; " +
    "                display: block; " +
    "                overflow: hidden; " +
    "                cursor: pointer; " +
    "            } " +
    "            .type-body { " +
    "                padding: 5px; " +
    "                width: 82%; " +
    "                float: right; " +
    "                display: block; " +
    "                box-shadow:  1px 1px 3px ; " +
    "                margin: 1px; " +
    "                overflow: hidden; " +
    "                column-width: 300px; " +
    "                border-radius:5px; " +
    "            } " +
    "            .cardType { " +
    "                font-size: 11px; " +
    "                width: 25%; " +
    "                height: 22px; " +
    "                float: left; " +
    "                text-align: center; " +
    "                border: 1px; " +
    "                margin: 0px; " +
    "                background: rgb(200, 200, 166); " +
    "                box-shadow:  inset 1px 1px 3px #000; " +
    "            } " +
    "            .detail { " +
    "                width: 100%; " +
    "                float: left; " +
    "                /*overflow: hidden;*/ " +
    "            } " +
    "            .detail-head { " +
    "                width: 10%; " +
    "                float: left; " +
    "                text-align: center; " +
    "                color: #f2de9c; " +
    "                margin-left: 3px; " +
    "                display: block; " +
    "                overflow: hidden; " +
    "                cursor: pointer; " +
    "            } " +
    "            .detail-body { " +
    "                padding: 5px; " +
    "                width: 82%; " +
    "                float: left; " +
    "                display: block; " +
    "                box-shadow:  1px 1px 3px; " +
    "                margin: 1px; " +
    "                border-radius:5px; " +
    "                overflow: hidden; " +
    "            } " +
    "            .r { " +
    "                color: red; " +
    "            } " +
    "           .suitRec {" +
    "               width: 100%;" +
    "               float: left;" +
    "               font-family: -apple-system, BlinkMacSystemFont, Segoe UI Emoji, Tahoma, Arial, sans-serif;" +
    "               text-shadow:" +
    "                    1px 0 0 rgba(255, 255, 255, 0.7)," +
    "                    0 1px 0 rgba(255, 255, 255, 0.7)," +
    "                    -1px 0 0 rgba(255, 255, 255, 0.7)," +
    "                    0 -1px 0 rgba(255, 255, 255, 0.7); " +
    "             }"+
    "            .suit { " +
    "                width: 50%; " +
    "                float: left; " +
    "            } " +
    "            #shandian { " +
    "                width: 100%; " +
    "                float: left; " +
    "            } " +
    "            .function { " +
    "                width: 50%; " +
    "                float: left; " +
    "            } " +
    "            .jizhan { " +
    "                width: 100%; " +
    "                float: left; " +
    "            } " +
    "            .yanjiao { " +
    "                width: 100%; " +
    "                float: left; " +
    "            } " +
    "            .calRes { " +
    "                width: 100%; " +
    "                height: 20px;" +
    "                float: left;" +
    "                text-align: center;" +
    "                color: #f2de9c;" +
    "                background: rgb(40, 40, 40);" +
    "                border: 1px solid #f2de9c;" +
    "                display: block;" +
    "                border-radius: 5px;" +
    "            } " +
    "           .calRes:hover {" +
    "                color: #f2de9c;" +
    "                background: rgb(55, 40, 32);" +
    "                border: 1px solid #f2de9c;" +
    "            }"+
    "            .mizhuBtn { " +
    "                width: 55px; " +
    "                height: 20px;" +
    "                float: left;" +
    "                text-align: center;" +
    "                color: #f2de9c;" +
    "                background: rgb(40, 40, 40);" +
    "                border: 1px solid #f2de9c;" +
    "                display: block;" +
    "                border-radius: 5px;" +
    "            } " +
    "           .mizhuBtn:hover {" +
    "                color: #f2de9c;" +
    "                background: rgb(55, 40, 32);" +
    "                border: 1px solid #f2de9c;" +
    "            }"+
    "            .mizhu { " +
    "                width: 100%; " +
    "                height: 20px;" +
    "                float: left;" +
    "                text-align: center;" +
    "                color: #f2de9c;" +
    "                background: rgb(40, 40, 40);" +
    "                margin-left: 3px;" +
    "                border: 1px solid #f2de9c;" +
    "                display: block;" +
    "                border-radius: 5px;" +
    "            } " +
    "           .mizhu:hover {" +
    "                color: #f2de9c;" +
    "                background: rgb(55, 40, 32);" +
    "                border: 1px solid #f2de9c;" +
    "            }"+
    "            #mySeatID1 { " +
    "                width: 50px; " +
    "                display: none; " +
    "                float: left; " +
    "            } " +
    "            #mySeatID2 { " +
    "                width: 50px; " +
    "                display: none; " +
    "                float: left; " +
    "            } " +
    "            .res { " +
    "                width: 100%; " +
    "                float: left; " +
    "            } " +
    "            .tooltip { " +
    "                position: relative; " +
    "                display: inline-block; " +
    "                text-align: center; " +
    "            } " +
    "            .tooltiptext { " +
    "                position: relative; " +
    "                display: inline-block; " +
    "                text-align: center; " +
    "            } " +
    "            #donate { " +
    "                position: relative; " +
    "                color: #f2de9c; " +
    "                display: inline-block; " +
    "                text-align: center; " +
    "            } " +
    "            .tooltip .tooltiptext { " +
    "                width: 100%; " +
    "                visibility: hidden; " +
    "                background-color: black; " +
    "                top: -80%; " +
    "                left: 50%; " +
    "                margin-left: -103px; " +
    "                color: #f2de9c; " +
    "                text-align: left; " +
    "                padding: 5px 0; " +
    "                border-radius: 6px; " +
    "                position: absolute; " +
    "                z-index: 1; " +
    "            } " +
    "            .tooltip:hover .tooltiptext { " +
    "                visibility: visible; " +
    "            } " +
    "            .mizhuInput { " +
    "                width: 20px; " +
    "            } " +
    "            .footer { " +
    "                position: fixed; " +
    "                bottom: 0; " +
    "                left: 0; " +
    "                width: 100%; " +
    "                text-align: center; " +
    "            } " +
    "            .width { " +
    "                width: 100%; " +
    "                height: 5px; " +
    "            } " +
    "        </style> " +
    "    </head> " +
    "<!-- Google tag (gtag.js) -->" +
    "<script async src='https://www.googletagmanager.com/gtag/js?id=G-5C3C11THB3'></script>" +
    "<script>" +
    "  window.dataLayer = window.dataLayer || [];" +
    "  function gtag(){dataLayer.push(arguments);}" +
    "  gtag('js', new Date());" +
    "  gtag('config', 'G-5C3C11THB3');" +
    "</script>"+
    "<body>" +

    "   <div class='nav'>" +
    "           <a href='http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=yz_vyeIOEWjqM_GPnr-qN0U__3YsxL1D&authKey=hO4Bixw68UVMBr%2BLog9lGQ9C94mgy6APtMu94tm4IJSNs3o91IGwUZHFkqcZt7gr&noverify=0&group_code=724393933' id='donate' target='_blank'>加群一起玩</a>" +
    "       <div class='nav1' id = 'nav1'>当前牌堆：无</div>" +

    "   </div>" +
    "    <div class='content' id='content'>" +
    "        <div class='orderAndShouPai' id ='orderAndShouPai' >" +
    "            <div class='order' id='button'>" +
    "                <div class='orderContainer'>" +
    "                    <div class='order-head or1' id='or1'>一</div>" +
    "                    <div class='order-body No1' id='1'>" +
    "                        <button class='shoupaiR'>♦6 <br>样 </button>" +
    "                    </div>" +
    "                </div>" +
    "                <div class='orderContainer'>" +
    "                    <div class='order-head or2' id='or2'>二</div>" +
    "                    <div class=order-body No2 id='2'>" +
    "                        <button class='shoupai'>♦6 <br>式</button>" +

    "                    </div>" +
    "                </div>" +
    "                <div class='orderContainer'>" +
    "                    <div class='order-head or3' id='or3'>三</div>" +
    "                    <div class=order-body No3 id='3'>" +
    "                        <button class='shoupaiR'>♦6 <br>卡 </button>" +
    "                    </div>" +
    "                </div>" +
    "                <div class='orderContainer'>" +
    "                    <div class='order-head or4' id='or4'>四</div>" +
    "                    <div class='order-body No4' id='4'>" +
    "                            <button class='shoupai'>♦6 <br>牌 </button>" +
    "                   </div>" +
    "                </div>" +
    "                <div class='orderContainer'>" +
    "                    <div class='order-head or5' id='or5'>五</div>" +
    "                    <div class='order-body No5' id='5'></div>" +
    "                </div>" +
    "                <div class='orderContainer'>" +
    "                    <div class='order-head or6' id='or6'>六</div>" +
    "                    <div class='order-body No6' id='6'></div>" +
    "                </div>" +
    "                <div class='orderContainer'>" +
    "                    <div class='order-head or7' id='or7'>七</div>" +
    "                    <div class='order-body No7' id='7'></div>" +
    "                </div>" +
    "                <div class='orderContainer'>" +
    "                    <div class='order-head or8' id='or8'>八</div>" +
    "                    <div class='order-body No8' id='8'></div>" +
    "                </div>" +
    "                <div class='orderContainer'>" +
    "                    <div class='order-head knownCardsInHand' id='knownCardsInHand'>场上手牌</div>" +
    "                    <div class='order-body knownCards' id='knownCards'></div>" +
    "                </div>" +
    "                <div class='orderContainer'>" +
    "                    <div class='order-head ding' id='ding'></div>" +
    "                    <div class='order-body dingCards' id='dingCards'>" +
    "                    </div>" +
    "                </div>" +
    "                <div class='orderContainer'>" +
    "                    <div class='order-head di' id='di'></div>" +
    "                    <div class='order-body diCards' id='diCards'>" +
    "                    </div>" +
    "                </div>" +
    "            </div>" +
    "        </div>" +
    "        <div class='cardDetail' id='cardDetail'>" +
    "            <div class=space></div>" +
    "            <div class=detail>" +
    "                <div class='detail-head' id='detail'>" +
    "                    <b>功能区</b>" +
    "                </div>" +
    "                <div class='detail-body'>" +
    "                    <div class='suit r' id='heart'>♥红桃 × </div>" +
    "                    <div class='suit' id='spade'>♠黑桃 × </div>" +
    "                    <div class='suit' id='club'>♣梅花 × </div>" +
    "                    <div class='suit r' id='diamond'>♦方片 × </div>" +
    "                    <div class='suit r' id='hongsha'>红杀 × </div>" +
    "                    <div class='suit' id='heisha' n>黑杀 × </div>" +
    "                    <div class='suit'>功能陆续开发中</div>" +
    "                    <div class='suit'>欢迎提意见</div>" +

    "                    <span>奋音花色</span><div class='suitRec' id='fenYin'></div>" +
    // "                    <div class='function jizhan' id='jizhan'>吉占点数</div>" +
    // "                    <div class='function paiduiSize' id='paiduiSize'>牌堆张数</div>" +
    "                    <div class='function yanjiao' id='yanjiao'>严教小抄</div>" +
    "                    <div><button class='function mizhuBTN' id='mizhu'>王荣小抄</button><input class='function calRes mizhuInput' id='mizhu_dianshu' type='text' value='13'></input></div>" +
    "                    <button class='function mizhu mySeatID' id='mySeatID1'>座位：1</button>" +
    "                    <button class='function mizhu mySeatID' id='mySeatID2'>座位：2</button>" +
    "                    <div class='function res' id='res'>结果样式：1 1 1 1 = 4 </br>可点击复制</div>" +
    "                </div>" +
    "            </div>" +
    "            <div class='width'></div>" +
    "" +
    "            <div class=type>" +
    "                <div class='cardTypeContainer'>" +
    "                    <div class='type-head' id='jiben'><b>基本</b></div>" +
    "                    <div class='type-body type1' id='type1'>" +
    "                        <button class=cardType>12寒冰</button>" +

    "                    </div>" +
    "                </div>" +
    "                <div class='cardTypeContainer'>" +
    "                    <div class='type-head' id='jinnang'><b>锦囊</b></div>" +
    "                    <div class='type-body type2' id='type2'>" +
    "                        <button class=cardType>12寒冰</button>" +

    "                    </div>" +
    "                </div>" +
    "                <div class='cardTypeContainer'>" +
    "                    <div class='type-head' id='zhuangbei'><b>装备</b></div>" +
    "                    <div class='type-body type3' id='type3'>" +
    "                        <button class=cardType>12寒冰</button>" +
    "                    </div>" +
    "                </div>" +
    "            </div>" +
    "        </div>" +
    "           <br>"+
    "    </div>" +
    "    </div>" +
    "</body>";

