// ==UserScript==
// @name         肉鸽原创内容汉化
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @license MIT  Northumberland
// @description  国服肉鸽原创内容汉化
// @author       Silver, Ceca3, Starmie
// @match        http://china.psim.us/*
// @match        http://47.94.147.145.psim.us/*
// @match        http://replay.pokemonshowdown.com/*
// @match        https://replay.pokemonshowdown.com/*
// @match        https://play.pokemonshowdown.com/*
// @match        http://g410178v57.qicp.vip-80.psim.us/*
// @match        http://smogtours.psim.us/*
// @match        http://localhost:8000/*
// @grant        none
// @require      http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/441616/%E8%82%89%E9%B8%BD%E5%8E%9F%E5%88%9B%E5%86%85%E5%AE%B9%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/441616/%E8%82%89%E9%B8%BD%E5%8E%9F%E5%88%9B%E5%86%85%E5%AE%B9%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==
var translations = {

    //PSRouge start
    "Common room":"普通房间",
    "Pokemon room":"PM房间",
    "Item room":"道具房间",
    "Elite room":"精英房间",
    "Ability room":"特性房间",
    "Move room":"技能房间",
    "Delete Pokemon":"删除PM",
    "nextwave":"下一关",
    "Skip":"跳过",
    "Evo All":"进化全部宝可梦",
    "All Evs Add 24": "所有宝可梦努力加24",
    "Rand One Mon All Evs Add 72": "随机一只宝可梦全部努力加72",
    "Rand One Mon Two Evs Fill": "随机一只宝可梦两项努力值拉满",
    "Delete Pokemon": "删除宝可梦",
    "Retransmission PokemonSet": "重置宝可梦配置",
    "Retransmission Moves Pool": "重置宝可梦招式",
    "Evo A Pokemon": "进化一只宝可梦",
    "Choose One Mon Three Evs Half": "选择一只宝可梦三项努力值变为一半",
    "Choose One Mon All Evs Add 48": "选择一只宝可梦全部努力增加48",
    "All Hp Evs Add 160": "全部宝可梦HP努力值增加140",
    "All Atk Evs Add 160": "全部宝可梦攻击努力增加140",
    "All Def Evs Add 160": "全部宝可梦防御努力增加140",
    "All Spa Evs Add 160": "全部宝可梦特攻增加140",
    "All Spd Evs Add 160": "全部宝可梦特防增加140",
    "All Spe Evs Add 160": "全部宝可梦速度增加140",
    "Choose One Mon Atk Spe fill": "选择一只宝可梦攻击和速度努力拉满",
    "Choose One Mon Spa Spe fill": "选择一只宝可梦特攻和速度努力拉满",
    "Choose One Mon Hp Another fill": "选择一只宝可梦HP和随机一项努力拉满",


    //Enemy Exclusive
    "Angod":"安神",
    "Shop Man": "店长",
    "Shuckle-Mega": "壶壶-超级进化",
    "Rich Loli": "富萝莉",
    "An Fist": "安拳",
    "Defense Power": "防守力量",
    "Ununown": "未知未知",
    "wss curse": "wws诅咒",
    "starmieboost": "星星光华齐巨鼎",
    "Hidden Power Legend": "觉醒力量传说",
    "Whale Fall": "鲸落",
    "Protean Pattern": "花纹变换",
    "Malicious Pluck": "恶意啄食",
    "Toxic Wrap": "剧毒束缚",
    "Fearow Drill Pec": "大嘴啄钻",
    // Abilities Translations
    "Bomber": "轰炸机",
    "Hide": "隐藏",
    "Diffuser": "扩散器",
    "Concentrator": "集中器",
    "Hard Shell": "坚硬甲壳",
    "Giant Killer": "巨人杀手",
    "Irreducible": "永恒净体",
    "Hyperactivity": "多动症",
    "Concentrator": "献祭",
    // Items Translations
    "Super Band": "超级头巾",
    "Super Specs": "超级眼镜",
    "Super Scarf": "超级围巾",
    "Super Vest": "超级背心",
    "Super Muscle Band": "超级力量头带",
    "Super Wise Glasses": "超级博学眼镜",
    "Super Quick Claw": "超级先制之爪",
    "Super Life Orb": "超级生命宝玉",
    "Super Metronome": "超级节拍器",
    "Super Bright Powder": "超级光粉",
    "Berserk Gene": "破坏因子",
    "Diseviolite": "奇石",
    "Intact Apple": "完整的苹果",
    "Adaptive Slate": "自适应石板",
    "Sight Lens": "瞄准镜",
    "Explosive Arm": "易爆护臂",
    "Double-edged Sword": "双刃剑",
    "Flexible Device": "灵动机械",
    "Pain Connector": "痛楚共分",
    "Immunity Herb": "免疫香草",
    "Deep Sea Dew": "深海之露",
    "Seismic Lever": "阿基米德杠杆",
    "Azure Flute": "天界之笛",
    "Gladiator Helmet": "角斗士头盔",
    "Super Expert Belt": "超级达人带",
    "Super Bright Powder": "超级光粉",
    "Huge Berry": "巨树果",
    "Wonderful Berry": "抗all果",
    // Moves Translation
    "Stim Pack": "兴奋剂",
    "Double Impression": "迎头双击",
    "Dual Ace": "双飞",
    // Elite Remains
    "Artirain": "人工降雨",
    "Artihail": "人工冰雹",
    "Artistorm": "人工沙暴",
    "Artisunny": "人工放晴",
    "Artireflect": "人工反射壁",
    "Artilightscreen": "人工光墙",
    "Confident Start": "自信开始",
    "Focus Device": "集中设备",
    "Angel Halo": "天使光环",
    "Industrial Plant": "工业工厂",
    "Egg Of Compassion": "同情心蛋",
    "Dancing Floor": "舞池",
    "Dragon Thrones": "龙椅",
    "Ticket Of Colosseum": "决斗之券",
    "Acupressure Mat": "指压板",
    "Gravity Generator": "重力制造者",
    "Trick Props": "魔术道具",
    "Soy Milk": "豆浆",
    //PSRouge end


};
function trans_from_dict(a) {
    var b = translations[a];
    if (b) return b;
    return a;
}

var QQ = $.noConflict();
var regex_ability = new RegExp(/Ability: ([A-z- ]+[A-z])$/);
var regex_Item = new RegExp(/Item: ([(A-z- ]+[A-z)])$/);
// 's match
var regex_stat_change = new RegExp(/(The opposing )*(.+)'s ([A-z !]+)/);
var regex_magic_bounce = new RegExp(/bounced the ([A-z -]+) back!/);
var regex_start_battle = new RegExp(/Battle started between (.+) and (.+)!/);
var regex_uturn = new RegExp(/(The opposing )*([A-z -']+[A-z]) went back to (.*)!/);
var regex_gems = new RegExp(/The ([A-z ]+) strengthened ([A-z- ]+)'s power!/);
var regex_eat = new RegExp(/(The opposing )*([A-z -']+[A-z]) (ate|used) its ([A-z ]+)!/);
var regex_restorehp = new RegExp(/restored HP using its ([A-z ]+)!/);
var regex_knock = new RegExp(/(The opposing )*(.+) knocked off (the opposing )*(.+)\'s (.+)!/);
var regex_sent_out = new RegExp(/(.+) sent out /);
var regex_lost_health = new RegExp(/\((The opposing )*(.+) lost ([0-9\.]+)% of its health!\)/);
var regex_lost_health2 = new RegExp(/\((The opposing )*(.+) lost /);
var regex_mega = new RegExp(/(The opposing )*([A-z-']+) has Mega Evolved into Mega ([A-z -]+)!/);
var regex_come_back = new RegExp(/(.+), come back!/);
var single_word_pm = new RegExp(/(The opposing )*([A-z-']+) (.+)/);

var double_word_pm = new RegExp(/(The opposing )*([A-z:\.]+ [A-z]+) (.+)/);
var bracket_single_word_pm = new RegExp(/\((The opposing )*([A-z-']+) (.+)\)/);
var bracket_double_word_pm = new RegExp(/\((The opposing )*([A-z:\.]+ [A-z]+) (.+)\)/);
var regex_max_guard = new RegExp(/\(Max Guard started on (the opposing) (.+)!\)/);
var regex_key_stone = new RegExp(/(The opposing )*(.+)'s (.+) is reacting to the Key Stone!/)
var regex_ability_act = new RegExp(/\[(The opposing )*([A-z -'\u4E00-\u9FA5]+[A-z\u4E00-\u9FA5])'s (.+)\]/);
var regex_move_no_effect = new RegExp(/\((The opposing )*([A-z -']+[A-z]) blocked the effect!\)/);
var regex_pointed_stones = new RegExp(/Pointed stones dug into (the opposing )*([A-z -']+[A-z])!/);
var regex_after_taunt = new RegExp(/(The opposing )*([A-z -']+[A-z]) can't use ([A-z- ]+) after the taunt!/);
var regex_obtained = new RegExp(/(The opposing )*([A-z -']+[A-z]) obtained one ([A-z- ]+)\./);
var regex_chn = new RegExp(/[\u4E00-\u9FA5]+/);
var regex_go = new RegExp(/Go! (.+)\(/);
var regex_item_pokemon = new RegExp(/The ([A-z]+ [A-z]+) weakened (the)* damage to ([A-z -']+[A-z])!/);
var regex_g6_mega = new RegExp(/(The opposing )*([A-z -']+[A-z])'s ([A-z]+) is reacting to (.+)'s Mega Bracelet!/);
var regex_dynamax = new RegExp(/(The opposing )*([A-z -']+[A-z])'s Dynamax!/);
var regex_disable = new RegExp(/(The opposing )*([A-z -']+[A-z])'s ([A-z -']+[A-z]) was disabled!/);
var regex_cannot_use = new RegExp(/(The opposing )*([A-z -']+[A-z]) can't use ([A-z -']+[A-z])!/);
var regex_trace = new RegExp(/(The opposing )*(.+) traced (the opposing )*(.+)\'s (.+)!/);
var regex_seconds_left = new RegExp(/(.+) has ([0-9]+) seconds left./);
var regex_timer_on = new RegExp(/Battle timer is ON: inactive players will automatically lose when time's up. \(requested by (.+)\)/);
var regex_reset_timer = new RegExp(/The timer can't be re-enabled so soon after disabling it \(([0-9]+) seconds remaining\)./)
var regex_team = new RegExp(/(.+)'s team:/);
var regex_future_sight = new RegExp(/(The opposing )*([A-z -']+[A-z]) foresaw an attack!/);
var regex_future_sight2 = new RegExp(/(The opposing )*([A-z -']+[A-z]) took the Future Sight attack!/);
var regex_hp_restored = new RegExp(/(The opposing )*([A-z -']+[A-z])'s HP was restored./);
var regex_type_change = new RegExp(/(The opposing )*([A-z -']+[A-z])'s type changed to ([A-z]+)!/);
var regex_hit_times = new RegExp(/The Pokemon was hit ([0-9]+) times!/);
var regex_joined = new RegExp(/(.+) joined/);
var regex_left = new RegExp(/(.+) left/);
var regex_room_expired = new RegExp(/The room "(.+)" does not exist.\n\nThe battle you're looking for has expired. Battles expire after 15 minutes of inactivity unless they're saved.\nIn the future, remember to click "Save replay" to save a replay permanently./);
var regex_battle = new RegExp(/(.+) wants to battle!/);
var regex_cancelled = new RegExp(/(.+) cancelled the challenge./);
var regex_waitingavailable = new RegExp(/Waiting for battles to become available(.+)/);
var regex_challengex = new RegExp(/Challenge (.+)?/);
var regex_wftcy = new RegExp(/Waiting for (.+) to challenge you./);
var regex_waiting = new RegExp(/Waiting for (.+)/);
var regex_accepted = new RegExp(/(.+) accepted the challenge, starting /);
var regex_forfeited = new RegExp(/(.+) forfeited/);
var regex_copyofuntitled = new RegExp(/Copy of Untitled (.+)/);
var regex_copyof = new RegExp(/Copy of (.+)/);
var regex_untitled = new RegExp(/Untitled (.+)/);
var regex_newteam = new RegExp(/New (.+) Team/);
var regex_users = new RegExp(/(.+) users/);
var regex_theopposingfainted = new RegExp(/The opposing ([A-z -]+) fainted!/);
var regex_fainted = new RegExp(/([A-z -]+) fainted!/);
var regex_theopposingleftover = new RegExp(/The opposing ([A-z -]+) restored a little HP using its Leftovers!/);
var regex_leftover = new RegExp(/([A-z -]+) restored a little HP using its Leftovers!/);
var regex_wish = new RegExp(/([A-z -]+)'s wish came true!/);
var regex_doestaffecttd = new RegExp(/It doesn't affect the opposing ([A-z -]+)/);
var regex_doestaffect = new RegExp(/It doesn't affect ([A-z -]+)/);
var regex_younoteams = new RegExp(/You have no (.+) teams/);
var regex_youdontha = new RegExp(/you don't have any (.+) teams/);
var regex_xteams = new RegExp(/(.+) teams/);
var regex_theinverted = new RegExp(/The opposing ([A-z -]+)'s stat changes were inverted!/);
var regex_inverted = new RegExp(/([A-z -]+)'s stat changes were inverted!/);

var regex_toattackrd = new RegExp(/The opposing ([A-z -]+)'s Attack rose drastically!/);
var regex_todefenserd = new RegExp(/The opposing ([A-z -]+)'s Defense rose drastically!/);
var regex_tospard = new RegExp(/The opposing ([A-z -]+)'s Sp. Atk rose drastically!/);
var regex_tospdrd = new RegExp(/The opposing ([A-z -]+)'s Sp. Def rose drastically!/);
var regex_tosperd = new RegExp(/The opposing ([A-z -]+)'s Speed rose drastically!/);
var regex_toevasivenessrd = new RegExp(/The opposing ([A-z -]+)'s evasiveness rose drastically!/);
var regex_toaccuracyrd = new RegExp(/The opposing ([A-z -]+)'s accuracy rose drastically!/);
var regex_attackrd = new RegExp(/([A-z -]+)'s Attack rose drastically!/);
var regex_defenserd = new RegExp(/([A-z -]+)'s Defense rose drastically!/);
var regex_spard = new RegExp(/([A-z -]+)'s Sp. Atk rose drastically!/);
var regex_spdrd = new RegExp(/([A-z -]+)'s Sp. Def rose drastically!/);
var regex_sperd = new RegExp(/([A-z -]+)'s Speed rose drastically!/);
var regex_evasivenessrd = new RegExp(/([A-z -]+)'s evasiveness rose drastically!/);
var regex_accuracyrd = new RegExp(/([A-z -]+)'s accuracy rose drastically!/);

var regex_toattackfs = new RegExp(/The opposing ([A-z -]+)'s Attack fell severely!/);
var regex_todefensefs = new RegExp(/The opposing ([A-z -]+)'s Defense fell severely!/);
var regex_tospafs = new RegExp(/The opposing ([A-z -]+)'s Sp. Atk fell severely!/);
var regex_tospdfs = new RegExp(/The opposing ([A-z -]+)'s Sp. Def fell severely!/);
var regex_tospefs = new RegExp(/The opposing ([A-z -]+)'s Speed fell severely!/);
var regex_toevasivenessfs = new RegExp(/The opposing ([A-z -]+)'s evasiveness fell severely!/);
var regex_toaccuracyfs = new RegExp(/The opposing ([A-z -]+)'s accuracy fell severely!/);
var regex_attackrfs = new RegExp(/([A-z -]+)'s Attack fell severely!/);
var regex_defensefs = new RegExp(/([A-z -]+)'s Defense fell severely!/);
var regex_spafs = new RegExp(/([A-z -]+)'s Sp. Atk fell severely!/);
var regex_spdfs = new RegExp(/([A-z -]+)'s Sp. Def fell severely!/);
var regex_spefs = new RegExp(/([A-z -]+)'s Speed fell severely!/);
var regex_evasivenessfs = new RegExp(/([A-z -]+)'s evasiveness fell severely!/);
var regex_accuracyfs = new RegExp(/([A-z -]+)'s accuracy fell severely!/);

var regex_toattackrosesharply = new RegExp(/The opposing ([A-z -]+)'s Attack rose sharply!/);
var regex_todefenserosesharply = new RegExp(/The opposing ([A-z -]+)'s Defense rose sharply!/);
var regex_tospatkrosesharply = new RegExp(/The opposing ([A-z -]+)'s Sp. Atk rose sharply!/);
var regex_tospdefrosesharply = new RegExp(/The opposing ([A-z -]+)'s Sp. Def rose sharply!/);
var regex_tospeedrosesharply = new RegExp(/The opposing ([A-z -]+)'s Speed rose sharply!/);
var regex_toevasivenessrosesharply = new RegExp(/The opposing ([A-z -]+)'s evasiveness rose sharply!/);
var regex_toaccuracyrosesharply = new RegExp(/The opposing ([A-z -]+)'s accuracy rose sharply!/);
var regex_toattackfellharshly = new RegExp(/The opposing ([A-z -]+)'s Attack fell harshly!/);
var regex_todefensefellharshly = new RegExp(/The opposing ([A-z -]+)'s Defense fell harshly!/);
var regex_tospatkfellharshly = new RegExp(/The opposing ([A-z -]+)'s Sp. Atk fell harshly!/);
var regex_tospdeffellharshly = new RegExp(/The opposing ([A-z -]+)'s Sp. Def fell harshly!/);
var regex_tospeedfellharshly = new RegExp(/The opposing ([A-z -]+)'s Speed fell harshly!/);
var regex_toevasivenessfellharshly = new RegExp(/The opposing ([A-z -]+)'s evasiveness fell harshly!/);
var regex_toaccuracyfellharshly = new RegExp(/The opposing ([A-z -]+)'s accuracy fell harshly!/);

var regex_attackrosesharply = new RegExp(/([A-z -]+)'s Attack rose sharply!/);
var regex_defenserosesharply = new RegExp(/([A-z -]+)'s Defense rose sharply!/);
var regex_spatkrosesharply = new RegExp(/([A-z -]+)'s Sp. Atk rose sharply!/);
var regex_spdefrosesharply = new RegExp(/([A-z -]+)'s Sp. Def rose sharply!/);
var regex_speedrosesharply = new RegExp(/([A-z -]+)'s Speed rose sharply!/);
var regex_evasivenessrosesharply = new RegExp(/([A-z -]+)'s evasiveness rose sharply!/);
var regex_accuracyrosesharply = new RegExp(/([A-z -]+)'s accuracy rose sharply!/);
var regex_attackfellharshly = new RegExp(/([A-z -]+)'s Attack fell harshly!/);
var regex_defensefellharshly = new RegExp(/([A-z -]+)'s Defense fell harshly!/);
var regex_spatkfellharshly = new RegExp(/([A-z -]+)'s Sp. Atk fell harshly!/);
var regex_spdeffellharshly = new RegExp(/([A-z -]+)'s Sp. Def fell harshly!/);
var regex_speedfellharshly = new RegExp(/([A-z -]+)'s Speed fell harshly!/);
var regex_evasivenessfellharshly = new RegExp(/([A-z -]+)'s evasiveness fell harshly!/);
var regex_accuracyfellharshly = new RegExp(/([A-z -]+)'s accuracy fell harshly!/);

var regex_toattackrose = new RegExp(/The opposing ([A-z -]+)'s Attack rose!/);
var regex_todefenserose = new RegExp(/The opposing ([A-z -]+)'s Defense rose!/);
var regex_tospatkrose = new RegExp(/The opposing ([A-z -]+)'s Sp. Atk rose!/);
var regex_tospdefrose = new RegExp(/The opposing ([A-z -]+)'s Sp. Def rose!/);
var regex_tospeedrose = new RegExp(/The opposing ([A-z -]+)'s Speed rose!/);
var regex_toevasivenessrose = new RegExp(/The opposing ([A-z -]+)'s evasiveness rose!/);
var regex_toaccuracyrose = new RegExp(/The opposing ([A-z -]+)'s accuracy rose!/);
var regex_toattackfell = new RegExp(/The opposing ([A-z -]+)'s Attack fell!/);
var regex_todefensefell = new RegExp(/The opposing ([A-z -]+)'s Defense fell!/);
var regex_tospatkfell = new RegExp(/The opposing ([A-z -]+)'s Sp. Atk fell!/);
var regex_tospdeffell = new RegExp(/The opposing ([A-z -]+)'s Sp. Def fell!/);
var regex_tospeedfell = new RegExp(/The opposing ([A-z -]+)'s Speed fell!/);
var regex_toevasivenessfell = new RegExp(/The opposing ([A-z -]+)'s evasiveness fell!/);
var regex_toaccuracyfell = new RegExp(/The opposing ([A-z -]+)'s accuracy fell!/);

var regex_attackrose = new RegExp(/([A-z -]+)'s Attack rose!/);
var regex_defenserose = new RegExp(/([A-z -]+)'s Defense rose!/);
var regex_spatkrose = new RegExp(/([A-z -]+)'s Sp. Atk rose!/);
var regex_spdefrose = new RegExp(/([A-z -]+)'s Sp. Def rose!/);
var regex_speedrose = new RegExp(/([A-z -]+)'s Speed rose!/);
var regex_evasivenessrose = new RegExp(/([A-z -]+)'s evasiveness rose!/);
var regex_accuracyrose = new RegExp(/([A-z -]+)'s accuracy rose!/);
var regex_attackfell = new RegExp(/([A-z -]+)'s Attack fell!/);
var regex_defensefell = new RegExp(/([A-z -]+)'s Defense fell!/);
var regex_spatkfell = new RegExp(/([A-z -]+)'s Sp. Atk fell!/);
var regex_spdeffell = new RegExp(/([A-z -]+)'s Sp. Def fell!/);
var regex_speedfell = new RegExp(/([A-z -]+)'s Speed fell!/);
var regex_evasivenessfell = new RegExp(/([A-z -]+)'s evasiveness fell!/);
var regex_accuracyfell = new RegExp(/([A-z -]+)'s accuracy fell!/);

var regex_toattackh = new RegExp(/The opposing ([A-z -]+)'s Attack won't go any higher!/);
var regex_todefnseh = new RegExp(/The opposing ([A-z -]+)'s Defense won't go any higher!/);
var regex_tospah = new RegExp(/The opposing ([A-z -]+)'s Sp. Atk won't go any higher!/);
var regex_tospdh = new RegExp(/The opposing ([A-z -]+)'s Sp. Def won't go any higher!/);
var regex_tospeh = new RegExp(/The opposing ([A-z -]+)'s Speed won't go any higher!/);
var regex_toevasivengessh = new RegExp(/The opposing ([A-z -]+)'s evasiveness won't go any higher!/);
var regex_toaccuracyh = new RegExp(/The opposing ([A-z -]+)'s accuracy won't go any higher!/);
var regex_attackh = new RegExp(/([A-z -]+)'s Attack won't go any higher!/);
var regex_defnseh = new RegExp(/([A-z -]+)'s Defense won't go any higher!/);
var regex_spah = new RegExp(/([A-z -]+)'s Sp. Atk won't go any higher!/);
var regex_spdh = new RegExp(/([A-z -]+)'s Sp. Def won't go any higher!/);
var regex_speh = new RegExp(/([A-z -]+)'s Speed won't go any higher!/);
var regex_evasivengessh = new RegExp(/([A-z -]+)'s evasiveness won't go any higher!/);
var regex_accuracyh = new RegExp(/([A-z -]+)'s accuracy won't go any higher!/);

var regex_rejectchallenge = new RegExp(/(.+) rejected the challenge./);
var regex_thesustookto = new RegExp(/The substitute took damage for the opposing ([A-z -]+)!/);
var regex_thesustook = new RegExp(/The substitute took damage for ([A-z -]+)!/);
var regex_tohbawi = new RegExp(/The opposing ([A-z -]+) has been afflicted with an infestation by ([A-z -]+)!/);
var regex_hbawi = new RegExp(/([A-z -]+) has been afflicted with an infestation by the opposing ([A-z -]+)!/);
var regex_toihb = new RegExp(/The opposing ([A-z -]+) is hurt by ([A-z -]+)!/);
var regex_ihb = new RegExp(/([A-z -]+) is hurt by ([A-z -]+)!/);
var regex_iseoto = new RegExp(/It's super effective on the opposing ([A-z -]+)!/);
var regex_iseo = new RegExp(/It's super effective on ([A-z -]+)!/);
var regex_isnveoto = new RegExp(/It's not very effective on the opposing ([A-z -]+)./);
var regex_isnveo = new RegExp(/It's not very effective on ([A-z -]+)./);
var regex_achoto = new RegExp(/A critical hit on the opposing ([A-z -]+)!/);
var regex_acho = new RegExp(/A critical hit on ([A-z -]+)!/);
var regex_setc = new RegExp(/(.+) Single Elimination Tournament created./);
var regex_willuse = new RegExp(/(.+) will use (.+)./);
var regex_willswitchin = new RegExp(/(.+) will switch in, replacing (.+)./);
var regex_youjoined = new RegExp(/You joined (.+)/);
var regex_uteamsvf = new RegExp(/Your team is valid for (.+)./);
var regex_Metronome = new RegExp(/Waggling a finger let it use ([A-z -]+)!/);
var regex_iatbabi = new RegExp(/([A-z -]+) is about to be attacked by its ([A-z -]+)!/);
var regex_toiatbabi = new RegExp(/The opposing ([A-z -]+) is about to be attacked by its ([A-z -]+)!/);
var regex_ctop = new RegExp(/([A-z -]+) corroded the opposing ([A-z -]+)'s ([A-z -]+)!/);
var regex_toctop = new RegExp(/The opposing ([A-z -]+) corroded ([A-z -]+)'s ([A-z -]+)!/);
var regex_biftato = new RegExp(/But it failed to affect the opposing ([A-z -]+)!/);
var regex_bifta = new RegExp(/But it failed to affect ([A-z -]+)!/);
var regex_toshpif = new RegExp(/The opposing ([A-z -]+)'s HP is full!/);
var regex_shpif = new RegExp(/([A-z -]+)'s HP is full!/);
var regex_tobiuiz = new RegExp(/The opposing ([A-z -]+) boosted its ([A-z -]+) using its Z-Power!/);
var regex_biuiz = new RegExp(/([A-z -]+) boosted its ([A-z -]+) using its Z-Power!/);
var regex_tobisdizp = new RegExp(/The opposing ([A-z -]+) boosted its Sp. Def using its Z-Power!/);
var regex_tobisaizp = new RegExp(/The opposing ([A-z -]+) boosted its Sp. Atk using its Z-Power!/);
var regex_bisdizp = new RegExp(/([A-z -]+) boosted its Sp. Def using its Z-Power!/);
var regex_bisaizp = new RegExp(/([A-z -]+) boosted its Sp. Atk using its Z-Power!/);
var regex_tobstct = new RegExp(/The opposing ([A-z -]+)'s type changed to ([A-z -]+)!/);
var regex_bstct = new RegExp(/([A-z -]+)'s type changed to ([A-z -]+)!/);
var regex_towhbisb = new RegExp(/The opposing ([A-z -]+) was hurt by its Sticky Barb!/);
var regex_whbisb = new RegExp(/([A-z -]+) was hurt by its Sticky Barb!/);
var regex_twpsrtosa = new RegExp(/The Weakness Policy sharply raised the opposing ([A-z -]+)'s Attack!/);
var regex_twpsrtossa = new RegExp(/The Weakness Policy sharply raised the opposing ([A-z -]+)'s Sp. Atk!/);
var regex_twpsrsa = new RegExp(/The Weakness Policy sharply raised ([A-z -]+)'s Attack!/);
var regex_twpsrssa = new RegExp(/The Weakness Policy sharply raised ([A-z -]+)'s Sp. Atk!/);
var regex_thwctfto = new RegExp(/The healing wish came true for the opposing ([A-z -]+)!/);
var regex_thwctf = new RegExp(/The healing wish came true for ([A-z -]+)!/);
var regex_psdito = new RegExp(/Pointed stones dug into the opposing (.+)!/);
var regex_psdi = new RegExp(/Pointed stones dug into (.+)!/);
var regex_sfwhrrm = new RegExp(/(.+)'s fervent wish has reached Rayquaza-Mega!/);
var regex_sfwhrtorm = new RegExp(/(.+)'s fervent wish has reached the opposing Rayquaza-Mega!/);
//PSRouge start
var regex_rougeallpmoneevsadd = new RegExp(/All ([A-z -]+) Evs Add (.+)/);//All Spa Evs Add 140
var regex_rougeallpmallevsadd = new RegExp(/All Evs Add (.+)/);//All Evs Add 140
var regex_rougeonepmallevsadd = new RegExp(/([A-z -]+) One Mon All Evs Add (.+)/);//Rand One Mon All Evs Add 60
var regex_rougeonepmcomplexevsadd = new RegExp(/([A-z -]+) One Mon ([A-z -]+) Evs ([A-z -]+)/);//Choose One Mon Two Evs Half
var regex_rougegaineliteremains = new RegExp(/Gain (.+)/);
//PSRouge end


var t = function (originalStr) {
    var tmp = originalStr.trim();
    if (translations[tmp])
        return translations[tmp];
    if (originalStr.match(regex_chn))
        return originalStr;
    if (originalStr.match(regex_team)) {
        return RegExp.$1 + "的队伍：";
    }
     if (originalStr.match(regex_youjoined)) {
        return  "你加入了" + RegExp.$1;
    }
    if (originalStr.match(regex_seconds_left)) {
        return RegExp.$1 + "还剩" + RegExp.$2 + "秒。";
    }
    if(originalStr.match(regex_timer_on)){
        return "战斗计时器已经开启：玩家若不行动则在时间耗尽后会输掉比赛。（由"+RegExp.$1+"发起）";
    }
    if (originalStr.match(regex_reset_timer)) {
        return "还剩" + RegExp.$1 + "秒可以重新开启计时器。";
    }
    if (originalStr.match(regex_joined)) {
        return RegExp.$1.replace(", ", "，").replace(/ and /g, "和") + "进入了房间";
    }
    if (originalStr.match(regex_left)) {
        return RegExp.$1.replace(", ", "，").replace(/ and /g, "和") + "离开了";
    }
    if (originalStr.match(regex_sent_out)) {
        return RegExp.$1 + "放出了";
    }

    if (originalStr.match(regex_lost_health)) {
        return trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + "失去了 " + RegExp.$3 + "% 的生命值！";
    }
    if (originalStr.match(regex_lost_health2)) {
        return trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + "失去了 ";
    }
    if (originalStr.match(regex_hp_restored)) {
        return trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + "的HP回复了。";
    }
    if (tmp.indexOf("'s ") != -1 && tmp.indexOf("!]") != -1) {
        tmp = tmp.replace("'s ", "").replace("!]", "");
        return "的" + translations[tmp] + "!]";
    }
    if (tmp.indexOf(" withdrew ") != -1) {
        var splitted = tmp.split(" withdrew ");
        return splitted[0] + "收回了" + trans_from_dict(splitted[1].replace("!", "")) + "！";
    }
    if (originalStr.match(regex_come_back)) {
        return trans_from_dict(RegExp.$1) + "，回来吧！";
    }
    if (originalStr.match(regex_go)) {
        return "去吧，" + trans_from_dict(RegExp.$1) + "(";
    }
    if (originalStr.match(regex_stat_change)) {
        if (trans_from_dict(RegExp.$3) != RegExp.$3)
            return trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + trans_from_dict(RegExp.$3);
    }
    if (originalStr.match(regex_forfeited)) {
        return RegExp.$1.replace(", ", "，") + "投降了";
    }
    //preview
    if ((originalStr.match(/ \/ /g) || []).length > 2) {
        var pokes = originalStr.split(" / ");
        var ret = trans_from_dict(pokes[0]);
        if (ret == pokes[0])
            return originalStr;
        var pos = 1;
        while (pokes[pos]) {
            ret += " / " + translations[pokes[pos]];
            pos++;
            if (pos >= 6) break;
        }
        return ret;
    }
    if (originalStr.match(regex_mega)) {
        return trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + "超级进化为Mega" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_g6_mega)) {
        return trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "响应了" + RegExp.$4 + "的Mega手环！";
    }
    if (originalStr.match(regex_disable)) {
        return trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "无法使用！";
    }

    if (originalStr.match(single_word_pm)) {
        var trans_3 = trans_from_dict(RegExp.$3);
        if (trans_3 != RegExp.$3) {
            return trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + trans_3;
        }
    }
    if (originalStr.match(double_word_pm)) {
        var trans_3 = trans_from_dict(RegExp.$3);
        if (trans_3 != RegExp.$3) {
            return trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + trans_3;
        }
    }
    if (originalStr.match(bracket_single_word_pm)) {
        var trans_3 = trans_from_dict(RegExp.$3);
        if (trans_3 != RegExp.$3) {
            return "(" + trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + trans_3 + ")";
        }
    }
    if (originalStr.match(bracket_double_word_pm)) {
        var trans_3 = trans_from_dict(RegExp.$3);
        if (trans_3 != RegExp.$3) {
            return "(" + trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + trans_3 + ")";
        }
    }
    if (originalStr.match(regex_after_taunt)) {
        return trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + "因为挑拨不能使用" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_cannot_use)) {
        return trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + "不能使用" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_item_pokemon)) {
        return trans_from_dict(RegExp.$1) + "降低了对" + trans_from_dict(RegExp.$3) + "造成的伤害！";
    }
    if (originalStr.match(regex_eat)) {
        return trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + (RegExp.$3 == "used" ? "使用了" : "吃掉了") + "它的" + trans_from_dict(RegExp.$4) + "！";
    }
    if (originalStr.match(regex_ability_act)) {
        return "[" + trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + "的" + trans_from_dict(RegExp.$3) + "]";
    }
    if (originalStr.match(regex_move_no_effect)) {
        return "(这对" + trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + "没有效果)";
    }
    if (originalStr.match(regex_obtained)) {
        return trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + "获得了" + trans_from_dict(RegExp.$3) + "。";
    }
    if (originalStr.match(regex_max_guard)) {
        return trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + "展开了极巨防壁！";
    }
    if (originalStr.match(regex_pointed_stones)) {
        return "锋利的岩石扎进了" + trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + "的身体！";
    }
    if (originalStr.match(regex_future_sight)) {
        return trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + "预知了攻击！";
    }
    if (originalStr.match(regex_future_sight2)) {
        return trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + "受到了预知未来的攻击！";
    }
    if (originalStr.match(regex_type_change)) {
        return trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + "的属性变成了" + trans_from_dict(RegExp.$3) + "!";
    }
    if (originalStr.match(regex_hit_times)) {
        return "击中了" + RegExp.$1 + "次！";
    }
    if (originalStr.match(regex_ability)) {
        originalStr = originalStr.replace(regex_ability, "特性: ");
        if (translations[RegExp.$1]) {
            originalStr += translations[RegExp.$1];
        }
        return originalStr;
    }

    if (originalStr.match(regex_knock)) {
        return trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + "打落了" + trans_from_dict(RegExp.$3) + trans_from_dict(RegExp.$4) + "的" + trans_from_dict(RegExp.$5) + "!";
    }
    if (originalStr.match(regex_trace)) {
        return trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + "复制了" + trans_from_dict(RegExp.$3) + trans_from_dict(RegExp.$4) + "的" + trans_from_dict(RegExp.$5) + "!";
    }

    if (originalStr.match(regex_Item)) {
        originalStr = originalStr.replace(regex_Item, "道具: ");
        if (translations[RegExp.$1]) {
            originalStr += translations[RegExp.$1];
        }
        return originalStr;
    }

    if (originalStr.match(regex_start_battle)) {
        return RegExp.$1 + " 与 " + RegExp.$2 + " 的对战开始了！";
    }
    if (originalStr.match(/^\((.*)\)$/)) {
        if (translations[RegExp.$1])
            return "(" + translations[RegExp.$1] + ")";
    }
    if (originalStr.match(/transformed into ([A-z -]+)!/)) {
        return "变成了" + translations[RegExp.$1] + "！";
    }
    if (originalStr.match(regex_uturn)) {
        return trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + "回到了" + RegExp.$3 + "的身边！";
    }
    if (originalStr.match(regex_magic_bounce)) {
        return "把" + translations[RegExp.$1] + "反弹回去了！";
    }
    if (originalStr.match(regex_dynamax)) {
        return trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + "的极巨化！";
    }

    if (originalStr.match(regex_gems)) {
        return translations[RegExp.$1] + "提升了" + translations[RegExp.$2] + "的威力!";
    }

    if (originalStr.match(regex_room_expired)) {
        return '房间“' + RegExp.$1 + '”不存在。\n您要进入的对战已过期。超过15分钟未活动且未保存的对战将过期，请及时保存回放。';
    }

    if (originalStr.match(regex_battle)) {
        return RegExp.$1 + "想要战斗！";
    }

    if (originalStr.match(regex_cancelled)) {
        return RegExp.$1 + "取消了战斗。";
    }
     if (originalStr.match(regex_wftcy)) {
        return  "等待" + RegExp.$1 + "挑战你";
    }
    if (originalStr.match(regex_waitingavailable)) {
        return "等待战斗开始" + RegExp.$1;
    }
    if (originalStr.match(regex_waiting)) {
        return "等待" + RegExp.$1;
    }
    if (originalStr.match(regex_accepted)) {
        return RegExp.$1 + "接受挑战，对战开始";
    }
    if (originalStr.match(regex_copyofuntitled)) {
        return "副本无标题" + RegExp.$1;
    }
    if (originalStr.match(regex_untitled)) {
        return "无标题" + RegExp.$1;
    }
    if (originalStr.match(regex_copyof)) {
        return "副本" + RegExp.$1;
    }
    if (originalStr.match(regex_newteam)) {
        return "新的" + RegExp.$1 + "队伍";
    }
	    if (originalStr.match(regex_users)) {
        return RegExp.$1 + "位用户";
    }
    if (originalStr.match(regex_theopposingfainted)) {
        return "对手的" +  translations[RegExp.$1] + "倒下了！";
    }
    if (originalStr.match(regex_fainted)) {
        return translations[RegExp.$1] + "倒下了！";
    }
    if (originalStr.match(regex_theopposingleftover)) {
        return "对手的" + translations[RegExp.$1] + "通过剩饭恢复了一点HP！";
    }
    if (originalStr.match(regex_leftover)) {
        return translations[RegExp.$1] + "通过剩饭恢复了一点HP！";
    }
    if (originalStr.match(regex_wish)) {
        return translations[RegExp.$1] + "的祈愿成真了！";
    }
    if (originalStr.match(regex_doestaffecttd)) {
        return "这并没有影响到对手的" + translations[RegExp.$1];
    }

    if (originalStr.match(regex_doestaffect)) {
        return "这并没有影响到" + translations[RegExp.$1];
    }
    if (originalStr.match(regex_younoteams)) {
        return "你没有" + RegExp.$1 + "队伍";
    }
    if (originalStr.match(regex_youdontha)) {
        return "你没有任何" + RegExp.$1 + "队伍";
    }
    if (originalStr.match(regex_xteams)) {
        return RegExp.$1 + "队伍";
    }
    if (originalStr.match(regex_theinverted)) {
        return "对手的" + translations[RegExp.$1] + "能力变化颠倒过来了！";
    }
    if (originalStr.match(regex_inverted)) {
        return  translations[RegExp.$1] + "能力变化颠倒过来了！";
    }
    if (originalStr.match(regex_toattackrd)) {
        return  "对手" + translations[RegExp.$1] + "的攻击巨幅提高了！";
    }
    if (originalStr.match(regex_todefenserd)) {
        return  "对手" + translations[RegExp.$1] + "的防御巨幅提高了！";
    }
    if (originalStr.match(regex_tospard)) {
        return  "对手" + translations[RegExp.$1] + "的特攻巨幅提高了！";
    }
    if (originalStr.match(regex_tospdrd)) {
        return  "对手" + translations[RegExp.$1] + "的特防巨幅提高了！";
    }
    if (originalStr.match(regex_tosperd)) {
        return  "对手" + translations[RegExp.$1] + "的速度巨幅提高了！";
    }
    if (originalStr.match(regex_toevasivenessrd)) {
        return  "对手" + translations[RegExp.$1] + "的闪避率巨幅提高了！";
    }
    if (originalStr.match(regex_toaccuracyrd)) {
        return  "对手" + translations[RegExp.$1] + "的命中率巨幅提高了！";
    }
    if (originalStr.match(regex_attackrd)) {
        return  translations[RegExp.$1] + "的攻击巨幅提高了！";
    }
    if (originalStr.match(regex_defenserd)) {
        return  translations[RegExp.$1] + "的防御巨幅提高了！";
    }
    if (originalStr.match(regex_spard)) {
        return  translations[RegExp.$1] + "的特攻巨幅提高了！";
    }
    if (originalStr.match(regex_spdrd)) {
        return  translations[RegExp.$1] + "的特防巨幅提高了！";
    }
    if (originalStr.match(regex_sperd)) {
        return  translations[RegExp.$1] + "的速度巨幅提高了！";
    }
    if (originalStr.match(regex_evasivenessrd)) {
        return  translations[RegExp.$1] + "的闪避率巨幅提高了！";
    }
    if (originalStr.match(regex_accuracyrd)) {
        return  translations[RegExp.$1] + "的命中率巨幅提高了！";
    }
    if (originalStr.match(regex_toattackfs)) {
        return  "对手" + translations[RegExp.$1] + "的攻击巨幅降低了！";
    }
    if (originalStr.match(regex_todefensefs)) {
        return  "对手" + translations[RegExp.$1] + "的防御巨幅降低了！";
    }
    if (originalStr.match(regex_tospafs)) {
        return  "对手" + translations[RegExp.$1] + "的特攻巨幅降低了！";
    }
    if (originalStr.match(regex_tospdfs)) {
        return  "对手" + translations[RegExp.$1] + "的特防巨幅降低了！";
    }
    if (originalStr.match(regex_tospefs)) {
        return  "对手" + translations[RegExp.$1] + "的速度巨幅降低了！";
    }
    if (originalStr.match(regex_toevasivenessfs)) {
        return  "对手" + translations[RegExp.$1] + "的闪避率巨幅降低了！";
    }
    if (originalStr.match(regex_toaccuracyfs)) {
        return  "对手" + translations[RegExp.$1] + "的命中率巨幅降低了！";
    }
    if (originalStr.match(regex_attackrfs)) {
        return  translations[RegExp.$1] + "的攻击巨幅降低了！";
    }
    if (originalStr.match(regex_defensefs)) {
        return  translations[RegExp.$1] + "的防御巨幅降低了！";
    }
    if (originalStr.match(regex_spafs)) {
        return  translations[RegExp.$1] + "的特攻巨幅降低了！";
    }
    if (originalStr.match(regex_spdfs)) {
        return  translations[RegExp.$1] + "的特防巨幅降低了！";
    }
    if (originalStr.match(regex_spefs)) {
        return  translations[RegExp.$1] + "的速度巨幅降低了！";
    }
    if (originalStr.match(regex_evasivenessfs)) {
        return  translations[RegExp.$1] + "的闪避率巨幅降低了！";
    }
    if (originalStr.match(regex_accuracyfs)) {
        return  translations[RegExp.$1] + "的命中率巨幅降低了！";
    }

    if (originalStr.match(regex_toattackrosesharply)) {
        return  "对手" + translations[RegExp.$1] + "的攻击大幅提高了！";
    }
    if (originalStr.match(regex_todefenserosesharply)) {
        return  "对手" + translations[RegExp.$1] + "的防御大幅提高了！";
    }
    if (originalStr.match(regex_tospatkrosesharply)) {
        return  "对手" + translations[RegExp.$1] + "的特攻大幅提高了！";
    }
    if (originalStr.match(regex_tospdefrosesharply)) {
        return  "对手" + translations[RegExp.$1] + "的特防大幅提高了！";
    }
    if (originalStr.match(regex_tospeedrosesharply)) {
        return  "对手" + translations[RegExp.$1] + "的速度大幅提高了！";
    }
    if (originalStr.match(regex_toevasivenessrosesharply)) {
        return  "对手" + translations[RegExp.$1] + "的闪避率大幅提高了！";
    }
    if (originalStr.match(regex_toaccuracyrosesharply)) {
        return  "对手" + translations[RegExp.$1] + "的命中率大幅提高了！";
    }
    if (originalStr.match(regex_toattackfellharshly)) {
        return  "对手" + translations[RegExp.$1] + "的攻击大幅降低了！";
    }
    if (originalStr.match(regex_todefensefellharshly)) {
        return  "对手" + translations[RegExp.$1] + "的防御大幅降低了！";
    }
    if (originalStr.match(regex_tospatkfellharshly)) {
        return  "对手" + translations[RegExp.$1] + "的特攻大幅降低了！";
    }
    if (originalStr.match(regex_tospdeffellharshly)) {
        return  "对手" + translations[RegExp.$1] + "的特防大幅降低了！";
    }
    if (originalStr.match(regex_tospeedfellharshly)) {
        return  "对手" + translations[RegExp.$1] + "的速度大幅降低了！";
    }
    if (originalStr.match(regex_toevasivenessfellharshly)) {
        return  "对手" + translations[RegExp.$1] + "的闪避率大幅降低了！";
    }
    if (originalStr.match(regex_toaccuracyfellharshly)) {
        return  "对手" + translations[RegExp.$1] + "的命中率大幅降低了！";
    }
    if (originalStr.match(regex_toattackrose)) {
        return  "对手" + translations[RegExp.$1] + "的攻击提高了！";
    }
    if (originalStr.match(regex_todefenserose)) {
        return  "对手" + translations[RegExp.$1] + "的防御提高了！";
    }
    if (originalStr.match(regex_tospatkrose)) {
        return  "对手" + translations[RegExp.$1] + "的特攻提高了！";
    }
    if (originalStr.match(regex_tospdefrose)) {
        return  "对手" + translations[RegExp.$1] + "的特防提高了！";
    }
    if (originalStr.match(regex_tospeedrose)) {
        return  "对手" + translations[RegExp.$1] + "的速度提高了！";
    }
    if (originalStr.match(regex_toevasivenessrose)) {
        return  "对手" + translations[RegExp.$1] + "的闪避率提高了！";
    }
    if (originalStr.match(regex_toaccuracyrose)) {
        return  "对手" + translations[RegExp.$1] + "的命中率提高了！";
    }
    if (originalStr.match(regex_toattackfell)) {
        return  "对手" + translations[RegExp.$1] + "的攻击降低了！";
    }
    if (originalStr.match(regex_todefensefell)) {
        return  "对手" + translations[RegExp.$1] + "的防御降低了！";
    }
    if (originalStr.match(regex_tospatkfell)) {
        return  "对手" + translations[RegExp.$1] + "的特攻降低了！";
    }
    if (originalStr.match(regex_tospdeffell)) {
        return  "对手" + translations[RegExp.$1] + "的特防降低了！";
    }
    if (originalStr.match(regex_tospeedfell)) {
        return  "对手" + translations[RegExp.$1] + "的速度降低了！";
    }
    if (originalStr.match(regex_toevasivenessfell)) {
        return  "对手" + translations[RegExp.$1] + "的闪避率降低了！";
    }
    if (originalStr.match(regex_toaccuracyfell)) {
        return  "对手" + translations[RegExp.$1] + "的命中率降低了！";
    }
    if (originalStr.match(regex_attackrosesharply)) {
        return  translations[RegExp.$1] + "的攻击大幅提高了！";
    }
    if (originalStr.match(regex_defenserosesharply)) {
        return  translations[RegExp.$1] + "的防御大幅提高了！";
    }
    if (originalStr.match(regex_spatkrosesharply)) {
        return  translations[RegExp.$1] + "的特攻大幅提高了！";
    }
    if (originalStr.match(regex_spdefrosesharply)) {
        return  translations[RegExp.$1] + "的特防大幅提高了！";
    }
    if (originalStr.match(regex_speedrosesharply)) {
        return  translations[RegExp.$1] + "的速度大幅提高了！";
    }
    if (originalStr.match(regex_evasivenessrosesharply)) {
        return  translations[RegExp.$1] + "的闪避率大幅提高了！";
    }
    if (originalStr.match(regex_accuracyrosesharply)) {
        return  translations[RegExp.$1] + "的命中率大幅提高了！";
    }
    if (originalStr.match(regex_attackfellharshly)) {
        return  translations[RegExp.$1] + "的攻击大幅降低了！";
    }
    if (originalStr.match(regex_defensefellharshly)) {
        return  translations[RegExp.$1] + "的防御大幅降低了！";
    }
    if (originalStr.match(regex_spatkfellharshly)) {
        return  translations[RegExp.$1] + "的特攻大幅降低了！";
    }
    if (originalStr.match(regex_spdeffellharshly)) {
        return  translations[RegExp.$1] + "的特防大幅降低了！";
    }
    if (originalStr.match(regex_speedfellharshly)) {
        return  translations[RegExp.$1] + "的速度大幅降低了！";
    }
    if (originalStr.match(regex_evasivenessfellharshly)) {
        return  translations[RegExp.$1] + "的闪避率大幅降低了！";
    }
    if (originalStr.match(regex_accuracyfellharshly)) {
        return  translations[RegExp.$1] + "的命中率大幅降低了！";
    }
    if (originalStr.match(regex_attackrose)) {
        return  translations[RegExp.$1] + "的攻击提高了！";
    }
    if (originalStr.match(regex_defenserose)) {
        return  translations[RegExp.$1] + "的防御提高了！";
    }
    if (originalStr.match(regex_spatkrose)) {
        return  translations[RegExp.$1] + "的特攻提高了！";
    }
    if (originalStr.match(regex_spdefrose)) {
        return  translations[RegExp.$1] + "的特防提高了！";
    }
    if (originalStr.match(regex_speedrose)) {
        return  translations[RegExp.$1] + "的速度提高了！";
    }
    if (originalStr.match(regex_evasivenessrose)) {
        return  translations[RegExp.$1] + "的闪避率提高了！";
    }
    if (originalStr.match(regex_accuracyrose)) {
        return  translations[RegExp.$1] + "的命中率提高了！";
    }
    if (originalStr.match(regex_attackfell)) {
        return  translations[RegExp.$1] + "的攻击降低了！";
    }
    if (originalStr.match(regex_defensefell)) {
        return  translations[RegExp.$1] + "的防御降低了！";
    }
    if (originalStr.match(regex_spatkfell)) {
        return  translations[RegExp.$1] + "的特攻降低了！";
    }
    if (originalStr.match(regex_spdeffell)) {
        return  translations[RegExp.$1] + "的特防降低了！";
    }
    if (originalStr.match(regex_speedfell)) {
        return  translations[RegExp.$1] + "的速度降低了！";
    }
    if (originalStr.match(regex_evasivenessfell)) {
        return  translations[RegExp.$1] + "的闪避率降低了！";
    }
    if (originalStr.match(regex_accuracyfell)) {
        return  translations[RegExp.$1] + "的命中率降低了！";
    }
    if (originalStr.match(regex_toattackh)) {
        return  "对手" + translations[RegExp.$1] + "的攻击已经无法再提高了！";
    }
    if (originalStr.match(regex_todefnseh)) {
        return  "对手" + translations[RegExp.$1] + "的防御已经无法再提高了！";
    }
    if (originalStr.match(regex_tospah)) {
        return  "对手" + translations[RegExp.$1] + "的特攻已经无法再提高了！";
    }
    if (originalStr.match(regex_tospdh)) {
        return  "对手" + translations[RegExp.$1] + "的特防已经无法再提高了！";
    }
    if (originalStr.match(regex_tospeh)) {
        return  "对手" + translations[RegExp.$1] + "的速度已经无法再提高了！";
    }
    if (originalStr.match(regex_toevasivengessh)) {
        return  "对手" + translations[RegExp.$1] + "的闪避率已经无法再提高了！";
    }
    if (originalStr.match(regex_toaccuracyh)) {
        return  "对手" + translations[RegExp.$1] + "的命中率已经无法再提高了！";
    }
    if (originalStr.match(regex_attackh)) {
        return  translations[RegExp.$1] + "的攻击已经无法再提高了！";
    }
    if (originalStr.match(regex_defnseh)) {
        return  translations[RegExp.$1] + "的防御已经无法再提高了！";
    }
    if (originalStr.match(regex_spah)) {
        return  translations[RegExp.$1] + "的特攻已经无法再提高了！";
    }
    if (originalStr.match(regex_spdh)) {
        return  translations[RegExp.$1] + "的特防已经无法再提高了！";
    }
    if (originalStr.match(regex_speh)) {
        return  translations[RegExp.$1] + "的速度已经无法再提高了！";
    }
    if (originalStr.match(regex_evasivengessh)) {
        return  translations[RegExp.$1] + "的闪避率已经无法再提高了！";
    }
    if (originalStr.match(regex_accuracyh)) {
        return  translations[RegExp.$1] + "的命中率已经无法再提高了！";
    }

    if (originalStr.match(regex_rejectchallenge)) {
        return  RegExp.$1 + "拒绝了挑战。";
    }
    if (originalStr.match(regex_thesustookto)) {
        return  "替身承受了伤害保护了对手的" + translations[RegExp.$1] ;
    }
    if (originalStr.match(regex_thesustook)) {
        return  "替身承受了伤害保护了" + translations[RegExp.$1] ;
    }
    if (originalStr.match(regex_tohbawi)) {
        return  "对手的" + translations[RegExp.$1] + "受到了来自" + translations[RegExp.$2] + "死缠烂打的折磨";
    }
    if (originalStr.match(regex_hbawi)) {
        return  translations[RegExp.$1] + "受到了来自对手" + translations[RegExp.$2] + "死缠烂打的折磨";
    }
    if (originalStr.match(regex_toihb)) {
        return  "对手的" + translations[RegExp.$1] + "受到了" + translations[RegExp.$2] + "的伤害";
    }
    if (originalStr.match(regex_ihb)) {
        return  translations[RegExp.$1] + "受到了" + translations[RegExp.$2] + "的伤害";
    }
    if (originalStr.match(regex_iseoto)) {
        return  "这对对手的" + translations[RegExp.$1] + "非常有效";
    }
    if (originalStr.match(regex_iseo)) {
        return  "这对" + translations[RegExp.$1] + "非常有效";
    }
    if (originalStr.match(regex_isnveoto)) {
        return  "这对对手的" + translations[RegExp.$1] + "不是很有效";
    }
    if (originalStr.match(regex_isnveo)) {
        return  "这对" + translations[RegExp.$1] + "不是很有效";
    }
    if (originalStr.match(regex_achoto)) {
        return  "击中了对手" + translations[RegExp.$1] + "的要害";
    }
    if (originalStr.match(regex_acho)) {
        return  "击中了" + translations[RegExp.$1] + "的要害";
    }
    if (originalStr.match(regex_setc)) {
        return  RegExp.$1 + "单败淘汰赛";
    }
     if (originalStr.match(regex_willuse)) {
        return   RegExp.$1 + "将使用" + RegExp.$2;
    }
     if (originalStr.match(regex_willswitchin)) {
        return   RegExp.$1 + "将替换" + RegExp.$2 + "上场";
    }
     if (originalStr.match(regex_challengex)) {
        return  "挑战" + RegExp.$1;
    }
     if (originalStr.match(regex_uteamsvf)) {
        return  "您的队伍在" + RegExp.$1 + "分级可以合法使用";
    }
     if (originalStr.match(regex_Metronome)) {
        return "摇手指让它使出了" + translations[RegExp.$1] + "！";
    }
     if (originalStr.match(regex_toiatbabi)) {
        return  "对手的" + translations[RegExp.$1] +"受到了来自它" + translations[RegExp.$2] + "的攻击！";
    }
     if (originalStr.match(regex_iatbabi)) {
        return  translations[RegExp.$1] +"受到了来自它" + translations[RegExp.$2] + "的攻击！";
    }
     if (originalStr.match(regex_toctop)) {
        return  "对手的" + translations[RegExp.$1] +"腐蚀了" + translations[RegExp.$2] + "的" + translations[RegExp.$3];
    }
     if (originalStr.match(regex_ctop)) {
        return  translations[RegExp.$1] +"腐蚀了对手" + translations[RegExp.$2] + "的" + translations[RegExp.$3];
    }
     if (originalStr.match(regex_biftato)) {
        return  "但没能影响到对手的" + translations[RegExp.$1] + "！";
    }
     if (originalStr.match(regex_bifta)) {
        return  "但没能影响到" + translations[RegExp.$1] + "！";
    }
    if (originalStr.match(regex_toshpif)) {
        return  "对手的" + translations[RegExp.$1] + "HP已满！";
    }
    if (originalStr.match(regex_shpif)) {
        return  translations[RegExp.$1] + "HP已满！";
    }
    if (originalStr.match(regex_tobiuiz)) {
        return  "对手的" + translations[RegExp.$1] + "利用Z力量强化了自身的" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_biuiz)) {
        return  translations[RegExp.$1] + "利用Z力量强化了自身的" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_tobisdizp)) {
        return  "对手的" + translations[RegExp.$1] + "利用Z力量强化了自身的特防！";
    }
    if (originalStr.match(regex_tobisaizp)) {
        return  "对手的" + translations[RegExp.$1] + "利用Z力量强化了自身的特攻！";
    }
    if (originalStr.match(regex_bisdizp)) {
        return  translations[RegExp.$1] + "利用Z力量强化了自身的特防！";
    }
    if (originalStr.match(regex_bisaizp)) {
        return  translations[RegExp.$1] + "利用Z力量强化了自身的特攻！";
    }
    if (originalStr.match(regex_tobstct)) {
        return  "对手的" + translations[RegExp.$1] + "的属性转变成了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_bstct)) {
        return  translations[RegExp.$1] + "的属性转变成了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_towhbisb)) {
        return  "对手的" + translations[RegExp.$1] + "受到了附着针的伤害！";
    }
    if (originalStr.match(regex_whbisb)) {
        return  translations[RegExp.$1] + "受到了附着针的伤害！";
    }
    if (originalStr.match(regex_twpsrtosa)) {
        return  "弱点保险大幅提高了对手" + translations[RegExp.$1] + "的攻击！";
    }
    if (originalStr.match(regex_twpsrtossa)) {
        return  "弱点保险大幅提高了对手" + translations[RegExp.$1] + "的特攻！";
    }
    if (originalStr.match(regex_twpsrsa)) {
        return  "弱点保险大幅提高" + translations[RegExp.$1] + "的攻击！";
    }
    if (originalStr.match(regex_twpsrssa)) {
        return  "弱点保险大幅提高了" + translations[RegExp.$1] + "的特攻！";
    }
    if (originalStr.match(regex_thwctfto)) {
        return  "对手" + translations[RegExp.$1] + "的治愈之愿实现了！";
    }
    if (originalStr.match(regex_thwctf)) {
        return  translations[RegExp.$1] + "的治愈之愿实现了！";
    }
     if (originalStr.match(regex_psdito)) {
        return  "锋利的岩石扎进了对手的" + RegExp.$1 + "的身体";
    }
     if (originalStr.match(regex_psdi)) {
        return  "锋利的岩石扎进了" + RegExp.$1 + "的身体";
    }
     if (originalStr.match(regex_sfwhrrm)) {
        return  RegExp.$1 + "衷心的祈愿传递到了烈空坐那里！";
    }
     if (originalStr.match(regex_sfwhrtorm)) {
        return  RegExp.$1 + "衷心的祈愿传递到了对手的烈空坐那里！";
    }
    //PSRouge start
    if (originalStr.match(regex_rougeallpmoneevsadd)) {
        return "全部PM的" + translations[RegExp.$1] + "努力值增加" + RegExp.$2;
    }
    if (originalStr.match(regex_rougeallpmallevsadd)) {
        return "全部PM的全部努力值增加" + RegExp.$1;
    }
    if (originalStr.match(regex_rougeonepmallevsadd)) {
        return translations[RegExp.$1] + "一只PM的全部努力值增加" + RegExp.$2;
    }
    if (originalStr.match(regex_rougeonepmcomplexevsadd)) {
        return translations[RegExp.$1] + "一只PM随机" + translations[RegExp.$2] + "努力值" + translations[RegExp.$3];
    }
    if (originalStr.match(regex_rougegaineliteremains)) {
        return translations[RegExp.$1];
    }
    //PSRouge end

    //多个可能特性
    if (originalStr[0] == " " && originalStr.indexOf(', ') > 0) {
        var ret = [];
        for (var ability of originalStr.trim().split(', ')) {
            ret.push(trans_from_dict(ability));
        }
        return ret.join('，');
    }
    //else
    return originalStr.replace("Turn", "回合");

    //.replace(/Ability: ([A-z ]+)/,"特性: "+translate(RegExp.$1))
    //.replace(/Ability: \/ Item: ([A-z ]+)/,"特性: "++"/ 道具:"+translate("$2"))

    ;
}
function translateElement(element) {
    var elTW = document.createTreeWalker(element, NodeFilter.SHOW_Element, null, false);
    var node = null;
    var translate = t;
    while ((node = elTW.nextNode()) != null) {
        if (node.nodeType == 3) {
            var value = node.nodeValue;
            if (node.parentNode.tagName == "STRONG" || node.parentNode.getAttribute("class") == "col movenamecol" ||
                node.parentNode.parentNode.getAttribute("class") == "col movenamecol" || node.parentNode.getAttribute("name") == "chooseMove") {
                if (node.nodeValue == "Psychic") {
                    node.nodeValue = "精神强念";
                    continue;
                } else if (node.nodeValue == "Metronome") {
                    node.nodeValue = "挥指";
                    continue;
                } else if (node.nodeValue == "Refresh") {
                    node.nodeValue = "焕然一新";
                    continue;
                }
            }
            if (value.indexOf('•') != -1) {     //技能名在鼠标移入的状态
                value = value.replace('•', "").replace('Psychic', "精神强念").replace('Metronome', "挥指").replace('Refresh', "焕然一新");
                value = translate(value);
                node.nodeValue = "• " + value;
            } else {
                node.nodeValue = translate(node.nodeValue.replace("é", "e"));
            }
            //node=elTW.previousNode();
            //QQ(t).remove();
        }
    }
}

(function () {
    'use strict';
    if (document.getElementById('room-'))
        translateElement(document.getElementById('room-'));
    QQ(document).on('DOMNodeInserted', function (e) {
        translateElement(e.target);
    });
    // Your code here...
})();