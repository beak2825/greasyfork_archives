// ==UserScript==
// @name         Replace Chinese Cultivation Terms
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Replace specific Chinese cultivation terms with English translations on any webpage.
// @author       Your Name
// @match        *://*.69shuba.cx/*
// @match        *://*.69shuba.com/*
// @match        *://*.69yuedu.net/*
// @match        *://*.novel543.com/*
// @match        *://*.m.ilwxs.com/*
// @match        *://*.api.langge.cf/online_reader*
// @match        *://*.drxsw.com/book/*
// @match        *://*.85novel.com/*
// @match        *m.shuhaige.net/263562/*
// @match        https://m.shuhaige.net/218328/*
// @match        https://ixdzs8.com/read/*
// @match        *://*.69yd.top/*
// @match        *://*.69yue.top/*
// @match        *://*m.shuhaige.net/*
// @match file:///C:/Users/*/Desktop/Novels/*.html
// @exclude      *://*.69shuba.com/txt/51669/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522403/Replace%20Chinese%20Cultivation%20Terms.user.js
// @updateURL https://update.greasyfork.org/scripts/522403/Replace%20Chinese%20Cultivation%20Terms.meta.js
// ==/UserScript==


/*        Lista nowych książek:

从族谱命格开始打造长生仙族
隐秘买家





*/

      //To jest do kolorów podswietlania - Dla innych stron
const style = document.createElement('style');
style.textContent = `
.highlighted-term {
    color:  !important;
    font-weight: bold; text-decoration: underline;
    -webkit-text-fill-color:  !important;
}
`;
document.head.appendChild(style);

      //To jest do kolorów podswietlania - Specjalnie dla 69shuba.comm
try {
    const style = document.createElement('style');
    style.textContent = `
        .txtnav .highlighted-term {
            color: !important;
            font-weight: bold !important;
            text-decoration: underline !important;
            -webkit-text-fill-color: !important;
        }
    `;
    document.head.appendChild(style);
    console.log('Styl dla .highlighted-term został dodany.');
} catch (error) {
    console.error('Błąd podczas dodawania stylu:', error);
}



(function () {
    'use strict';

    // Define the terms to replace
    const replacements = {

		//	----		REALMS		-----

"准仙": "Quasi-Immortal ",
"虚仙": "False Immortal ",
"玄仙": "Profound Immortal ",
"天仙": "Celestial Immortals ",
"仙尊": "Immortal Venerable ",
"金仙": "Golden Immortal ",
"仙君": "Immortal Monarch ",
"天高": "Heavenly Realm ",
"神人境": "Divine Human Realm ",
"乾坤境": "Universe Realm ",
"乾坤": "Universe ",
"神心": "Divine Heart ",
"金身": "Golden Body ",
"神人": "Divine Human ",
"武帝": "Martial God ",
"天地帝境": "Heaven and Earth Emperor Realm ",
"天地帝": "Heaven and Earth Emperor ",
"紫府": "Purple Mansion ",
"聚元": "Gathering Yuan ",
"灵海": "Spiritual Sea ",
"神元": "Essence Divinity ",
"破虚": "Breaking Void ",
"人元": "Human Yuan ",
"地元": "Earth Yuan ",
"天元": "Heavenly Yuan ",
"行星级一阶": "Planet Star Level 1 ",
"练气": "Qi Refinement ",
"筑基": "Foundation Establishment ",
"结丹": "Golden Core ",
"元婴": "Nascent Soul ",
"化神": "Soul Formation ",
"洞虚": "Insightful Empatiness ",
"渡劫共": "Transcending Tribulation ",
"武道通神": "Martial Dao General God ",
"天元极武": "Heavenly Yuan Extreme Martial ",
"至虚彻武": "Supreme Void Martial ",
"源道武尊": "Source Dao Martial Supreme ",
"武徒": "Martial Student ",
"武士": "Warrior ",
"武师": "Martial Master ",
"大武师": "Martial GrandMaster ",
"武王": "Martial King ",
"武宗": "Martial Ancestor ",
"武尊": "Martial Venerate ",
"武圣": "Martial Saint ",
"炼虚": "Void Refinement ",
"散仙": "Loose Immortals ",
"地仙": "Earth Immortals ",
"六欲天": "Six Desires of Heaven ",
"上覆天": "Upper Overlying Heaven ",
"神虚": "Divine Void ",
"合体": "Integration Realm ",
"太乙之境": "Supreme Unity Realm ",
"太乙之": "Supreme Unity ",
"太乙": "Supreme Unity",
"大罗": "Great Overarching ",
"仙帝": "Immortal Emperor ",
"炼体": "body refinement ",
"天帝": "Heavenly Emperor",
"仙神": "Immortal God",
"境界": "realm ",
"天界": "Heaven Realm ",
"极境": "Limit Realm ",
"神灵": "Spiritual God ",
"永恒不灭": "Eternal Inextinguishable ",
"大仙": "Great Immortal ",
"神宫": "Divine Palace ",
"天皇": "Heavenly Sovereign ",
"上古仙": "Ancient Immortal ",
"地皇": "Earth Sovereign ",
"雷劫": "Thunder Tribulation ",
"涅槃": "Nirvana ",
"主宰": "Sovereign ",
"大帝": "Great Emperor ",
"武帝之上": "above Martial Emperor ",
"大天尊": "Great Heavenly Venerate ",
"仙子": "Fairy ",
"天尊": "Heavenly Venerable ",
"永恒不死": "Eternal Undying ",
"圣人": "Saint ",
"化境天": "Heaven Transformation ",
"三世天": "Three Heaven Worlds ",
"自在天": "Maheśvara ",
"真元": "True Origin ",
"元丹": "Core Origin ",
"丹府": "Mansion Core ",
"天罡": "Qi Heavenly ",
"丹尊": "Pill Venerable ",
"脱凡境": "Shedding Mortality Realm",
"虚形境": "Void Transformation Realm",
"灵元境": "Origin Spiritual Realm",
"天灵境": "Sky Spiritual Realm",
"万象境": "Myriad Elephants Realm",
//"造化境": "Good Fortune Realm",
        "造化境":"Creation Realm ",
"合道境": "Dao Fusion Realm",
"合道": "Fusion Dao ",
"引气境": "Qi Drawing Realm ",
"后天境": "Acquired Realm ",
"炼神境": "Refining Spirit Realm ",
"炼魄境": "Refining Soul Realm ",
"天人境": "Celestial Realm ",
"凝气": "Qi Refining ",
"通脉": "Opening Meridian ",
"金手指": "Gold Finger ",
"金丹": "Golden Core ",
"三阳": "Three Yang ",
"炼皮": "Skin Refining ",
"炼肉": "Refining Flesh ",
"炼筋": "Muscle Refining ",
"炼骨": "Bone Refining ",
"炼血": "Blood Refining ",
"炼脏": "Viscera Refining ",
"炼髓": "Marrow Refining",
"真丹": "True Core ",
"炼气期": "Qi Refinement Realm ",
"分神": "Divided Spirit ",
"炼肉境": "Refining Flesh Realm",
"练皮": "Refining Skin ",
"练肉": "Flesh Training ",
"练脏": "Viscera Training ",
"淬骨": "Bone Tempering ",
"超凡大": "Extraordinary ",
"蕴灵": "Accumulation Spiritual ",
"灵胎": "Spiritual Embryo ",
"灵元": "Origin Spiritual ",
"玄丹境": "Profound Core Realm ",
"丹境": "Core Realm ",
"伪神境": "False God Realm ",
"真神": "True God ",
"神君境": "Divine Sovereign Realm ",
"圣王境": "Saint King Realm ",
"大圣境": "Great Saint Realm ",
"至尊": "Supreme ",
"准帝": "Quasi Emperor ",
"大圣": "Great Saint ",
"圣王": "Saint King ",
"极限帝": "Extreme Emperor ",
"无上帝": "Supreme Emperor ",
"真仙": "True Immortal ",
"仙王": "Immortal King ",
"聚气境": "Qi Gathering Realm ",
"聚神": "Spirit Gathering ",
"气海": "Qi Sea ",
"水溢": "Water Overflow ",
"乾元": "Heaven Primodial ",
"变血境": "Blood Transformation Realm ",
"浊仙境": "Impure Immortal Realm ",
"神兵": "Divine Soldier ",
"神将": "Divine General ",
"神王": "God King ",
"神皇": "Divine Sovereign ",
"神主": "Divine Lord ",
"神帝": "Divine Emperor ",
"虚境": "Void Realm ",
"虚神境": "Void God Realm ",
"虚神": "Void God ",
"半虚": "Half-Void ",
"浊仙": "Impure Immortal ",
"明劲": "Clear Strength ",
"暗劲": "Inner Strength ",
"化劲": "Transforming Strength ",
"锻骨": "Bone Forging ",
"磨皮": "Skin Strengthening ",
"蜕凡": "Shedding Mortality ",
"洞天境": "Grotto Heaven ",
"界主境": "World Overlord Realm ",
"界主": "World Overlord ",
"超脱境": "Transcendent Realm",
"登天境": "Heaven Ascension Realm ",
"不灭境": "Imperishable Realm ",
"不死境": "Undying Realm ",
"破妄境": "Breaking Fantasy Realm ",
"君神境": "Sovereign God Realm ",
"真人": "Spiritual Master ",
"通气": "Qi Circulating ",
"武人": "Martial Disciple ", // aka Martial Artist?
"道人": "Taoist Master ",
"创世": "Creation ",
"开玄": "Profound Opening ",
"凝元": "Essence Concentration ",
"玄元": "Profound Origin ",
"登仙": "Immortal Ascension ",
"指玄": "Profound Indicating ",
"真境": "Truth Realm ",
"神藏 ": "God Concealing ",
"道宮": "Dao Palace ",
"宗师级": "Grandmaster ",
"宗师境": "Grandmaster Realm ",
"大宗师": "Great Grandmaster ",
"宗师": "Grandmaster ",
"归元境": "Origin Returning Realm ",
//"天人": "Celestial ",
"归元": "Origin Returning ",
"灵桥境": "Spirit Bridge ",
"长生境": "Eternal Realm ",
"通天境": "Heavenly Completion Realm ",
"轮台境": "Revolving Platform Realm ",
"彼岸境": "Paramita/Other Shore Realm ",
"归真": "Return to Truth ",
"神藏境": "Spiritual Depository Realm ",
"神话境": "Mythical Realm ",
"周天": "Heavenly Circuit ",
"道宫": "Dao Palace ",
"虚天": "Void Heaven ",
"罗天": "Encompassing Heaven ",
"玄天": "Profound Heaven ",
"御天": "Heaven Dominion ",
"涅天": "Heaven Nirvana ",
"神府": "Divine Palace ",
"神脉": "Divine Vein ",
"神台": "Divine Platform ",
"神轮": "Divine Wheel ",
"神照": "Divine Illumination ",
//"神通": "Divine Authority ",
"神玄": "Divine Mystery ",
"神极": "Divine Limit ",
"半神": "Half-God ",
"天神": "Heavenly God ",
"古仙": "Ancient Immortal ",
"仙王极致": "Pinnacle Immortal King ",
"周天境": "Heavenly Circuit Realm ",
        "古仙": "Ancient Immortal ",
        "普通仙王": "Ordinary Immortal King ",
        "古仙王": "Ancient Immortal King ",
        "万古仙王": "Eternal Immortal King ",
        "无上仙王": "Supreme Immortal King ",
        "仙王极致": "Pinnacle Immortal King ",
        "准仙帝": "Quasi-Immortal Emperor ",
        "古仙帝": "Ancient Immortal Emperor ",
        "超脱仙帝": "Transcendent Immortal Emperor ",
        "帝尊": "Emperor Sovereign ",
        "古帝尊": "Ancient Emperor Sovereign ",
        "人仙": "Human Immortal ",
        "上神": "High God ",
        "无尚仙王": "Supreme Immortal King ",
        "人祖": "Human Ancestor ",
        "灵气":"Spirit Qi ",
        "灵河":"Spirit River ",
        "灵海":"Spirit Sea ",
        "灵渊":"Spirit Abyss ",
        "王尊":"King Sovereign ",
        "地尊":"Earth Sovereign ",
        "天尊":"Heaven Venerable ",
        "皇尊":"Monarch Sovereign ",
        "圣尊":"Sacred Venerable ",
        "神尊":"Divine Sovereign ",
        "破空":"Void Shattering ",
        "域神境":"Domain God ",
        "界神":"World God ",
        "练窍":"Orifice Tempering ",
        "合窍":"Orifice Merging ",
        "山海境":"Mountain and Sea Realm ",
        "日月境":"Sun and Moon Realm ",
        "开天境":"Heaven Opening Realm ", // Open Heaven - as trasnlated from other novels?(martial peak)
        "开天":"Heaven Opening ",
        "造物境":"Creation Realm ",
        "虚空真神":"Void True God ",
        "锻体境":"Body Tempering Realm ",
        "真灵境":"True Spirit Realm ",
        "劫难境":"Tribulation Realm ",
        "劫境":"Tribulation Realm ",
        "王境":"King Realm ",
        "皇者境":"Sovereign Realm ",
        "尊者境":"Venerable Realm ",
        "帝境":"Emperor Realm ",
        "玄王":"Profound King ",
        "天王":"Heavenly King",
        "玄皇":"Profound Sovereign ",
        "圣皇":"Sacred Sovereign ",
        "玄尊":"Profound Venerable ",
        "道尊":"Dao Venerable ",
        "玄帝":"Profound Emperor ",
        "圣帝":"Sacred Emperor ",
        "帝君":"Emperor Lord ",
        "凝血":"Blood Condensation ",
        "元海":"Origin Sea ",
        "星轮":"Star Wheel ",
        "月轮":"Moon Wheel ",
        "日轮":"Sun Wheel ",
        "万象":"Myriad Phenomena ",
        "天人":"Celestial ", //aka Celestial
        "圣域骑士":"Sanctuary Knight ",
        "锻体":"Body Tempering ",
        "元士":"Origin Scholar, ",
        "真武":"True Martial ",
        "道胎":"Dao Embryo ",
        "道火境":"Dao Flame Realm ",
        "开灵":"Spirit Opening ", // same as Qi Refinement
        "纳元":"Essence Absorbing ", // same as Foundation Establisment
        "养气":"Qi Nurturing ",
        "开脉":"Meridian Opening ",
        "引灵":"Spirit Attraction ",
        "道基":"Dao Foundation ",
        "凝丹":"Core Condensation ",
        "返虚":"Void Return ",
        "返虚境":"Void Return Realm ",
        "大乘":"Great Ascension ",
        "内气":"Inner Qi ",
        "炼神":"Spirit Refining ",
        "内元境":"Inner Origin Realm ",
        "内元":"Inner Origin ",
        "罡元":"Astral Origin ",
        //"":" ",
        //"":" ",



		//	----		NAMES OF PEOPLE/MONSTER ETC.		-----

"炎皇": "Yan Emperor",
"哥哥": "Big Brother ",
"紫微大帝": "Great Emperor Zi Wei",
"老前辈": "Old Senior ",
"贫道": "Poor Daoist ",
"魔神": "Demon God ",
"融道": "dao fusion ",
"战神": "War God ",
"母亲": "mother",
"蛟龙": "Flood Dragon ",
"神兽": "Divine Beast ",
"黑龙": "Black Dragon ",
"师徒": "master and disciple ",
"麒麟": "Qilin ",
"白虎": "White Tiger ",
"神龟": "Divine Tortoise ",
"白龙": "White Dragon ",
"弟子": "Disciple ",
"师父": "Master ",
"两丈": "two zhang ",
"师妹": "Junior Sister ",
"道者": "Daoist ",
"长生笑道": "Chang Shengxiao ",
"孩子": "child ",
"姜家": "Jiang Family ",
"弟弟": "Little Brother ",
"仙家": "immortal family ",
"剑神": "Sword God ",
"天魔": "heavenly demon ",
"老夫": "old man ",
"老东西": "old bastard ",
"龙蛇": "Dragon Snake ",
"老祖": "Old Ancestor ",
"亲兄弟": "biological brother ",
"太子": "Crown Prince ",
"年轻人": "youngster ",
"贫僧": "this poor monk ",
"赤炎天龙": "Heavenly Scarlet Flame Dragon ",
"青龙": "Azure Dragon ",
"李安": "Li An ",
"公子": "young master ",
"赵家": "Zhao Family ",
"杂役": "handyman ",
"长老": "elder ",
"外门执事": "Outer Deacon ",
"王大柱": "Wang Dazhu ",
"仙长": "Exalted Immortal ",
"执事": "deacon ",
"女修者": "female cultivator ",
"魔修": "demonic cultivator ",
"散修": "loose cultivator ",
"统领大人": "Lord Commander ",
"中年人": "middle age person ",
"徐家": "Xu Family ",
"姜长生": "Jiang Changseng ",
"陆长生": "Lu Changsheng ",
"江成玄": "Jiang Chengxuan ",
"宗門執事": "Sect Deacon ",
"宗門護衛": "Sect Guard ",
"宗門長老": "Sect Elder ",
"宗門護衛長老": "Sect Elder Guard ",
"药王": "Pill King ",
"哥": "Older Brother ",
//"兄": "Big Bro ",
//"弟": "Younger Brother ",
//"姐妹": "Sister ",
//"大姐": "Big Sister ",
//"姐": "ELder Sister ",
//"姐姐": "Big sis ",
//"妹": "Younger Sister ",
//"妹妹": "Little Sister ",
//"小妇": "Miss ",
//"晚装": "Junior ",
//"儿": "child ",
"胖子": "Fatty ",
"大师级": "Master ",
        "仙家族": "Immortal Cultivation Family ",
//"叶青玄": "MC ",
        "属下": "Subordinate ",
        "任兄弟": "Brother Ren ", // -- MC alias in 给大帝收尸，我暴涨万年修为！
        "少楼主": "young master ",
        "楼主身": "pavilion master ",
        "楼主": "Master ",
        "顾家庄":"Gu Family Manor ",
        "红云宗":"Red Cloud Sect ",
        "凌仙宗":"Soaring Immortal Sect ",



		//	----		NAMES OF ITEMS/Herbs ETC.		-----

"力魔战铠": "Power Demon Battle Armor ",
"金莲": "Golden Lotus ",
"三昧真火": "Samadhi True Fire ",
"火符箓": "Fire Talisman ",
"寒晶石": "cold crystal stone ",
"桃花": "Peach Blossom ",
"灵舟": "Spirit Boat ",
"九鼎": "Nine Cauldrons ",
"斩神刀": "God-Slaying Blade",
        "神宝": "Divine Treasure ",
        "先天神宝": "Innate Divine Treasures ",


		//	----		NAMES OF PLACES		-----

"集市": "Bazaar ",
"交易市场": "Trading Market ",
"奥术散射塔": "Arcane Scattering Tower ",
"九幽": "Nine Nether ",
"州": "Prefecture ",
"世界": "world ",
"星域": "Star Domain ",
//"混沌": "Primordial Chaos ",  - Zamienic na "Chaos" ?
"大天地": "Great World ",
"紫霄宫": "Purple Heaven Palace",
"天庭": "Celestial Court ",
"昆仑": "Kunlun ",
"昆仑界": "Kunlun World",
"大殿": "great hall ",
"大千世界": "Great Thousand Worlds ",
"百世轮回": "Hundred Worlds Reincarnation ",
"神州": "Divine Province ",
"凌霄宝殿": "Soaring Firmament Treasure Palace ",
"万界": "Myriad Realms ",
"灵山": "Spiritual Mountain ",
"南天门": "South Heaven Gate ",
"桃园": "Peach Garden ",
"命运长河": "River of Destiny ",
"星海": "Star Sea ",
"天宫": "Heavenly Palace ",
"玄天宗": "Profound Heaven Sect",
"丹心门": "Pill Heart Sect ",
"青玉门": "Azure Jade Sect ",
"焚月山": "Burning Moon Mountain ",
"灵溪境": "Spirit Creek Realm ",
"云河境": "Cloud River Realm ",
"真湖境": "True Lake Realm ",
"神海境": "Divine Sea Realm ",
"灵溪": "Spirit Creek ",
"云河": "Cloud River ",
"真湖": "True Lake ",
"神海": "Divine Sea ",
"九天": "Nine Heavens ",
"不周山": "Buzhou Mountain ",
"山河门": "Mountains and Rivers Sect ",
"天拳门": "Heavenly Fist Sect ",
"玄阳宗": "Profound Yang Sect ",
"秘境": "Secret Realm ",
"植山": "Plant Mountain",
"流阳河": "Liuyang River ",
"群岛": "Archipelago ",
"东荒": "Eastern Wasteland ",
"天塔": "Heavenly Tower ",
"苍茫星空": "vast starry sky ",
"隐仙派": "Hidden Immortal Sect ",
"紫微剑阁": "Purple Star Sword Pavilion ",
"药王山": "Pill King Mountain ",
"天书院": "Heavenly Academy of Books ",
"云城世家": "Cloud City Family ",
"灵犀宫": "Spirit Rhinoceros Palace ",
"月剑门": "Moon Sword Sect ",
"星月宫": "Star Moon Palace ",
"白云山": "White Cloud Mountain ",
"飞月楼": "Flying Moon Tower ",
"烈阳世家": "Fiery Sun Family ",
"黄山派": "Yellow Mountain Sect ",
"青玉派": "Green Jade Sect ",
"竹山仙坊": "Bamboo Mountain Immortal Pavilion ",
"天池": "Heavenly Lake ",
"洞渊": "Cave Abyss ",
"飞天门": "Flying Heaven Sect ",
"天河": "Heavenly River ",
"东洲": "Eastern Continent ",
"洞天": "Cave ",
"地玄界": "Earth Profound World ",
"东极": "Eastern Pole ",
"南蛮": "Southern Barbarians ",
"西荒": "Western Wasteland ",
"北离": "Northern Departure ",
"紫云峰": "Purple Cloud Peak ",
"闻香阁": "Fragrant Brothel ",
"太玄门": "Supreme Profound Sect ",
"神荒大": "Divine Desolation Great ",
"神话楼": "Mythical Tower ",
        "青山别院": "Green Mountain Villa ",
        "飘渺天宗": "Misty Heavenly Sect",
        "青山神庙": "Azure Mountain Shrine ",
        "神墟": "God Ruins ",
        "大周": "Great Zhou Dynasty ",
        "金风细雨楼": "Golden Wind and Drizzle Pavilion ",
        "大厅之中": "inside a grand hall ",
        "雷堂": "Thunder Hall ",
        "聚贤堂": "Gathering Virtue Hall ",
        "膳堂": "Banquet Hall ",
        "金刚寺": "Vajra Temple ",
        "万象仙门": "Myriad Phenomena Immortal Sect ",
        "南玄神洲":"Southern Profound Divine Continent ",
        "玄神洲":"Profound Divine Continent ",
        "灵域":"Spirit Domain ",
        "汉秦帝国":"Han-Qin Empire ",
        "东海":"East Sea ",
        "北海":"North Sea ",
        "西海":"West Sea ",
        "云剑宗":"Cloud Sword Sect ",
        "中千":"Middle Thousands ",
        "神霄宗":"Divine Heaven Sect ",
        "北泉山":"North Spring Mountain ",
        "灵墟门":"Spirit Ruins Sect ",
        "小巷子里":"narrow alley ",
        "灵田":"spirit fields ",
        "云沙":"Cloudsand ",
        "玉涧祇地":"Jade Ravine Divine Land ",
        //"":" ",
        //"":" ",




		//	----		NAMES OF Technique/Method/Artifacts grade etc.		-----

"灵宝": "Spiritual Treasure ",
"金宝": "Golden Treasure ",
"至宝": "Supreme Treasure",
"天材地宝": "Heaven and Earth Treasure ",
"不灭金身": "Inextinguishable Golden Body",
"绝学": "Absolute Art ",
"天道至宝": "Heavenly Dao Supreme Treasure ",
"古术": "ancient technique ",
"宝物": "treasure ",
"神功": "Divine Art ",
"他化自在大法": "Embodiment Transformation Great Method ",
"道源神术": "Dao Origin Divine Art ",
"火莲剑雨": "Fire Lotus Sword Rain ",
"风霜刀法": "Wind and Frost Blade Technique ",
"雷灵诀": "Thunder Spirit Technique ",
"小灵雨诀": "Little Spirit Rain Technique ",
"雷焏真形剑经": "Thunder Blaze True Form Sword Sutra ",
"长春功": "Everlasting Spring Art ",
"木元术": "Wood Elemental Technique ",
"增产": "Yield Increase ",
//"神通": "Divine Ability ",
        "神物": "Divine Artifact ",
        "宝鉴": "Treasure Mirror ",
        "元晶": "Primal Crystal ",
        "蕴刀术": "Blade-Nurturing Techniqu ",
        "锻神": "Tempering Spirit ",
        "玄宝":"Profound Treasures ",


		//	----		NAMES OF Stages/Layers etc.		-----

"初期": "Early ",
"中期": "Middle ",
"后期": "Late ",
"顶尖": "Peak ",
"大圆满的": "The Great Perfection ",
"小成": "Small Accomplishment ",
"大圆": "Great Perfection ",
"大成": "Great Accomplishment ",
"上等": "High Level ",
"第十三层": "Thirteenth Layer ",
"渡劫": "Transcending Tribulation ",
//"天赋": "innate talent ",// - This should be just talent i think
"武台": "martial stage ",
"九重": "9th layer ",
"极品": "Supreme ",// -  Supreme[Jako artefakt/Talizamn/Spirit Stone etc.] / Ultimate[Jako technika]
"巅峰": "peak ",
"圆满": "Perfect ",
"黄阶": "yellow grade ",
"上品": "High Grade ",
"三重": "3rd Layer ",
"下品": "low grade  ",
"后天": "Acquired ",
"半步": "Half-Step ",
"绝世": "Peerless ",
"超凡": "Extraordinary ",
"初窥门径": "Initial Access ",
"高深": "profound ",
"初入": "Beginner ",
"小圆满": "Small Perfection ",
"大圆满": "Great Perfection ",
"精品": "high-quality ",
"稀有": "rare ",
"熟练": "proficiency ",
"精通": "Advanced ",
        "人道极": "Human Dao Extreme ",
        "皇道极": "Sovereign Dao Extreme ",
        "天道极": "Heavenly Dao Extreme ",
        "重天": "Heavenly Layer ",
        "超脱之上": "Beyond Transcendence ",


		//	----		NAMES OF TAGS/CATEGORY		-----

"家族": "Family ",
"重生": "Rebirth ",
"轻松": "Easy ",
"快节奏": "Fast Cultivation ",
"古典仙侠": "Classic Fairy Story ",
"游戏异界": "Game World ",
"系统流": "System Flow ",
"游戏制作": "Game Production ",
"虚拟现实": "Virtual Reality ",
"玩家": "Gamer ",
"玄幻魔法": "Fantasy Magic ",
"修真武侠": "Cultivation Martial Arts ",
"言情小说": "Romance Novels ",
"历史军事": "History and Military ",
"游戏竞技": "Game Competition ",
"科幻空间": "Science Fiction Space ",
"悬疑惊悚": "Suspense Thriller ",
"同人小说": "Fan Fiction ",
"都市小说": "Urban Novels ",
"官场职场": "Official Career ",
"穿越时空": "Crossing Time and Space ",
"青春校园": "Youth Campus ",
"其他小说": "Other Novels ",
"巫师流": "Wizard Flow ",
"搞笑": "Funny ",
"仙侠": "Immortal Hero ",
"系统": "system ",
"69書吧": "69",
"完本": "Full",
"阅读记录": "History ",
"我的书架": "Shelf",
"閱讀記錄": "History ",
"我的書架": "Shelf",
"首頁": "1st",

		//	----		Other		-----

"新书": "New Books ",
"推荐": "Recommended ",
"人气": "Popularity ",
"全本": "Full Book ",
"连载": "Serialized ",
"首页": "1st",
"作者": "Autor ",
"更新": "Update ",
"分类": "Categories ",
"全部小说": "All Novels ",
"天仙": "Heavenly Immortals ",
"召唤力魔护卫": "Summon Power Demon Guardian ",
"你获得": "You gained ",
"你的丧尸": "Your Zombie ",
"异化": "other ",
"巧了": "what a coincidence ",
"毒": "poison ",
"祖": "Ancestor ",
"斤": "Jin ",
"丹方": "Pill Formula ",
"法门": "Technique ",
"子曰": "Master said ",
"白金": "Platinum ",
"xD-NoweTermsyJuzW-Chrome": "xD-NoweTermsyJuzW-Chrome ",
"垂钓": "Fishing ",
"您的宠物": "Your pet ",
"沙金之地专属": "Exclusive to the Land of Sands and Gold ",
"突破": "Breakthrough ",
"人士": "Person ",
"兵种": "Soldier ",
"出去转修": "After going out to cultivate ",
"冷静": "Calm ",
"轰鸣声": "rumbling sound ",
"一道道": "one after another ",
"身影": "silhouette ",
"一声低喝": "shouted in a low voice ",
"空间裂缝": "Space Crack ",
"人族": "Human Race ",
"妖族": "Monster Race ",
"战力": "battle strength ",
"除此之外": "apart from this ",
"鲜血淋漓": "drenched with blood",
"修士": "cultivator ",
"强者": "powerhouse ",
"消失不见": "disappeared ",
"混沌之气": "Primal Chaos Qi ",
"看向": "looked towards ",
"哈哈哈": "hahaha ",
"开口道": "opened the mouth and said ",
"可怕": "terrifying ",
"前辈": "senior ",
"下一刻": "next moment ",
"赤金色": "scarlet gold ",
"烧成灰烬": "burn to ashes ",
"他低喝一声": "loudly shouts ",
"火球": "Fireball",
"说话间": "while speaking ",
"回过神来": "came back to his senses ",
"武道": "Martial Arts ",
"天地": "Heaven and Earth ",
"莲座": "Lotus Throne ",
"仙道": "immortal dao ",
"参悟": "comprehend ",
"回答道": "replied ",
"笑道": "said with a smile ",
"爷爷": "grandfather ",
"传承者": "Inheritor ",
"道祖": "Dao Ancestor ",
"信不信": "believing or not ",
"修仙之法": "technique of cultivation ",
"仙法": "immortal art ",
"阴沉沉": "dark ",
"莫名其妙": "unfathomable mystery ",
"笑呵呵": "laughed",
"忽然问道": "suddenly asked",
"吞噬之力": "Devouring Power ",
"没好气道": "said ill-humoredly",
"为何不能": "why cannot ",
"肉身": "fleshy body ",
"修炼": "cultivation ",
"点头道": "nodded and said",
"创教": "started a Sect ",
"大鼎": "great cauldron ",
"最顶尖": "cream of the crop ",
"大道之力": "Power of Great Dao ",
"天地灵气": "Heaven and Earth Spiritual Qi",
"修炼神通": "cultivation Divine Ability ",
"天道": "Heavenly Dao ",
"威力": "formidable power ",
"传承记忆": "inherited memories",
"不死不灭": "Undying and Inextinguishable",
"越多越好": "the more the better ",
"淬体": "body tempering ",
//"源源不断": "continuously ",
"破坏力": "destructive power ",
"这一次": "this time",
"不在了": "passed away",
"没想到": "didn’t expect ",
"说起来": "speaking of which ",
"无尽虚空": "endless void ",
"数百万": "several millions ",
"大道主": "Great Dao Lord ",
"元神": "Primordial Spirit",
"穿梭虚空": "shuttling through the void",
"绝大多数": "overwhelming majority",
"本源印记": "Source Imprint ",
"法术": "spell ",
"修仙者": "immortal cultivator ",
"三千大道": "Three Thousand Great Daos ",
"措手不及": "completely unprepared ",
"皱眉": "frowned ",
"天骄": "Heaven’s Chosen ",
"独自一人": "alone ",
"不可能": "impossible ",
"嘲讽道": "taunted ",
"灵魂印": "Soul Seal ",
"手下败将": "defeated ",
"天眼": "Heavenly Eye ",
"等人": "and the others ",
"心性": "temperament ",
"道体": "dao body ",
"阴阳怪气": "mystifying ",
"已经不远": "already not far ",
"相当于": "equivalent to ",
"传音": "sound transmission ",
"传承": "inheritance ",
"无边无际": "boundless ",
"荒原": "wasteland ",
"规则之力": "Rule Power",
"渐渐地": "gradually ",
"不择手段": "by fair means or foul ",
"气势": "imposing manner ",
"生冷哼": "coldly snorted ",
"轰": "bang ",
"鸿蒙神元气": "Primordial Chaos Divine Origin Qi ",
"防御力。": "defensive power ",
"凭空出现 ": "appear out of thin air ",
"红光": "red light ",
"召唤": "summon ",
"道相": "Dao Idol ",
"太极图": "Tai Chi Chart ",
"灰飞烟灭": "scattered ashes and dispersed smoke ",
"放肆": "impudent ",
"黑色": "black ",
"道图": "dao chart ",
"沉声道": "said solemnly ",
"光芒": "rays of light ",
"金光": "golden light ",
"难以想象": "unimaginable ",
"冲击力": "impact ",
"神念": "Divine Sense ",
"九天十地": "Nine Heavens and Ten Earths ",
"杀阵": "Killing Formation ",
"阵法": "Formation ",
"神力": "Divine Power ",
"斩仙葫芦": "Behead Immortal bottle gourd ",
"替天行道": "will enforce Justice on behalf of the Heaven ",
"白光": "white light ",
"剑影": "Behead Immortal ",
"至道神法": "Supreme Path Divine Law ",
"神法": "Divine Law ",
"集中于一点": "centralize in one point ",
"毁灭气息": "Destruction Aura ",
"凶兽": "ominous beast ",
"面目狰狞": "face looks sinister ",
"轮回掌": "Samsara Palm ",
"大周天神帝": "great circulation Divine Emperor ",
"到时候": "when the time comes ",
"最强的道": "most strong in the Dao ",
"在劫难逃": "hard to avoid calamity ",
"悟性": "perception ",
"道心": "Dao Heart ",
"数一数二": "one of the very best ",
"大势力": "Great Influence ",
"山清水秀": "verdant hills and limpid water ",
"感悟": "Insights ",
"难以捉摸": "elusive ",
"不置可否": "indifferent expression ",
"教派": "sect ",
"教派弟": "sect Disciple ",
"福缘": "Good Fortune ",
"全心全意": "wholeheartedly ",
"前途无量": "have boundless prospects ",
"三十三重": "33 layer ",
"心魔": "Heart Demon ",
"没有气馁": "is not discouraged ",
"截然不同": "completely different ",
"凭空出现": "appear out of thin air ",
"平静道": "calmly said ",
"蜕变成功": "transformation successful  ",
"冷哼一声": "coldly snorted ",
"虚空大道": "Great Dao of Void ",
"炼丹": "pill concocting ",
"一个时辰": "one hour ",
"是真的呢": "is real ",
"这番话": "this remark ",
"金葫芦": "golden bottle gourd",
"父亲": "father ",
"封神榜": "Investiture of the Gods ",
"一人之下": "under one person ",
"启禀陛下": "reporting to Your Majesty ",
"闻言": "hearing this ",
"大事": "major event ",
"外来者": "outsider ",
"整个世界": "the entire world ",
"不苟言笑": "reserved ",
"神秘": "mysterious ",
"深吸一口气": "took a deep breath ",
"青色": "azure ",
"一道人影": "one silhouette ",
"神不知鬼不觉": "top secret ",
"不简单": "not simple ",
"右手": "right hand ",
"苦海": "Sea of Bitterness ",
"芸芸众生": "innumerable living beings ",
"白衣男子": "white clothed man ",
"紧随其后": "followed closely from behind ",
"一脉": "lineage ",
"石碑": "stone tablet ",
//"资质": "aptitude ",
"真气": "True Qi ",
"灵力": "spiritual power ",
"参悟境界": "comprehend realm ",
"若隐若现": "faintly discernible ",
"高境界": "high realm ",
"超然势力": "Transcendent Influence ",
"强大的存在": "powerful existence ",
"恐怖的存在": "terrifying existence ",
"下意识": "subconsciously ",
"金色": "golden ",
"一线生机": "a glimmer of survival ",
"在心中": "in the heart ",
"庞然大物": "huge monster ",
"帝族": "Imperial Clan ",
"这两人": "these two people ",
"元气大伤": "strength great injury ",
"野心勃勃": "wild ambition ",
"微松了一口气": "slightly sighed in relief ",
"嗤笑道": "sneered ",
"至道": "Supreme Path ",
"各方势力": "influence ",
"微不足道": "insignificant ",
"丹药": "medicine pill ",
"闭关": "secluded ",
"漩涡": "vortex ",
"功德之力": "Power of Achievements and Virtue ",
"咳咳": "cough cough ",
"惊骇之色": "terrified look ",
"喝道": "shouted ",
"松了一口气": "sighed in relief ",
"参见": "pay respects to ",
"虚影": "illusory shadow ",
"等人 ": "and the others ",
"冷漠道": "and the others ",
"自古以来": "since ancient times ",
"听到这儿": "all split up and in pieces ",
"朝着": "moved towards ",
"多谢道友": "many thanks Fellow Daoist ",
"缓缓睁开眼睛": "eyes slowly opened ",
"白衣": "white clothed ",
"娘娘": "Empress ",
"反噬": "backlash ",
"血气": "blood energy ",
"黑发": "black hair ",
"杀气": "murderous aura ",
"半空中": "in midair ",
"更何况": "even more how ",
"眉头紧锁": "brows tightly frowns ",
"张牙舞爪": "baring fangs and brandishing claws ",
"符文": "rune ",
"巨兽": "giant beast ",
"脸色瞬间变": "face instantly changes ",
"动弹不得": "unable to move even a little bit ",
"杀意": "killing intent ",
"龙吟": "dragon roar ",
"苦笑道": "said with a bitter smile ",
"最巅峰": "pinnacle ",
"地位超然": "transcendent position ",
"先天": "Innate ",
"道生一": "Dao gave birth to One ",
"一生二": "One gave birth to Two ",
"二生三": "Two gave birth to Three ",
"三生万物": "Three Births Myriad Things ",
"叹了一口气": "sighed ",
"一次两次": "one or two times ",
"一颗颗星辰": "Stars ",
"异象": "natural phenomenon",
"黄粱一梦": "pipe dream ",
"道之路": "Dao Path ",
"丹道": "Pill Dao ",
"瓶颈": "bottleneck ",
"心旷神怡": "relaxed and joyful ",
"瞳孔一缩": "pupils shrank ",
"道纹": "Dao Mark ",
"惊涛骇浪": "stormy sea ",
"都不会": "will not ",
"地球": "Earth ",
"恻隐之心": "compassion ",
"分身": "Avatar ",
"神威": "divine might ",
"小家伙": "little fellow ",
"笑呵呵道": "nodded ",
"自顾自": "each minding their own business ",
"小心翼翼": "cautiously ",
"修为": "cultivation base ",
"平日": "normally ",
"石门": "stone gate ",
"巨剑": "giant sword ",
"抱拳": "cup one fist in the other hand ",
"身不由己": "involuntarily ",
"算不得": "can’t be considered ",
"武君": "Martial Spirit ",
"荒川": "desolate river ",
"分水岭": "dividing line ",
"道果": "dao fruit ",
"一定要": "must ",
"微微一笑": "slightly smiled ",
"老树": "old tree ",
"为何不": "why not ",
"什么人": "who ",
"射日神弓": "Sun-Shooting Divine Bow ",
"议论纷纷": "discuss spiritedly ",
"第一": "first ",
"大机缘": "great opportunity ",
"沉吟道": "pondered then said ",
"美目": "beautiful eyes ",
"叮嘱道": "warned repeatedly ",
"黑衣男子": "black clothed man ",
"红袍": "red robe ",
"老女人": "old woman ",
"哼！": "hmph!",
"空间之力": "Power of Space ",
"心跳": "heartbeat ",
"冷笑道": "said with a sneer ",
"不过如此": "merely this ",
"说曹操，曹操就到": "Say Cao Cao and Cao Cao will arrive ",
"日落月升": "The Sun sets and the Moon rises ",
"仙鹤": "Immortal Crane ",
"灰袍": "gray robed ",
"毫不犹豫": "without the slightest hesitation ",
"阴沉着脸": "loomy face ",
"面面相觑": "looked at each other in blank dismay ",
"心潮澎湃": "overwhelmed by emotions ",
"一己之力": "strength of oneself ",
"万道": "Myriad Dao",
"岁月流逝": "as time goes by ",
"骷髅头": "skull ",
"相提并论": "mention on equal terms ",
"天象": "Celestial Phenomenon ",
"这一世": "this life ",
"第一人": "Number One Person ",
"一炷香时间": "time it takes to burn a stick of incense ",
"半柱香": "the time it takes half an incense stick to burn ",
"这股气息": "this aura ",
"蓝色": "blue ",
"无所不能": "omnipotent ",
"犹如神光": "such as divine light ",
"失态": "lost self-control ",
"原来如此": "so that’s how it is ",
"轰！": "bang!",
"好强": "really strong",
"幸灾乐祸": "taking pleasure in other people’s misfortune ",
"十八层地狱": "Eighteen Levels of Hell ",
"灵魂波动": "soul fluctuation ",
"灵智": "spiritual wisdom ",
"寒芒": "cold glow ",
"后患无穷": "it will cause no end of trouble ",
"嘀咕道": "whispered ",
"修炼了": "cultivated ",
"一只竖眼": "one vertical eye ",
"眼神": "expressions all ",
"同龄人": "peers ",
"大大咧咧": "carefree ",
"他们三人": "their three people ",
"菩提花": "Bodhi Flower ",
"九种大道": "Nine Great Daos ",
"四面八方": "all directions ",
"眉头紧皱": "brows tightly knit ",
"破甲": "armor piercing ",
"跟上去": "follow ",
"点头": "nodded ",
"前夕": "the day before ",
"人道大圣": "Great Sage of Humanity",
"言外之意": "unspoken implication ",
"佛门": "Buddhism",
"红衣": "red-clothed ",
"杀机": "murderous intention ",
"阿弥陀佛": "Amitabha ",
"高人": "expert ",
"物是人非": "things have remained the same, but people have changed ",
"意气风发": "high-spirited and vigorous ",
"神话传说": "Myths and Legends ",
"气运者": "destiny bearer ",
"多谢": "many thanks ",
"大人物": "great character ",
"津津有味": "with keen interest pleasure ",
"剑阵": "sword array ",
"传奇": "Legendary ",
"天兵天将": "celestial troops and generals ",
"寿命": "lifespan ",
"可能性": "probability ",
"因果之道": "Dao of Karma ",
"轮回之道": "Reincarnation Dao ",
"喃喃道": "muttered ",
"十之七八": "seven-eight out of ten ",
"武之道": "Dao of Martial ",
"拭目以待": "wait and see ",
"小瞧了你": "looked down on you ",
"第一位面": "1st Plane ",
"蹙起眉头": "brows knit ",
"管家": "steward ",
"形神俱灭": "destroy both body and soul ",
"古种族": "ancient seed ",
"肉眼": "naked eye ",
"万丈": "ten thousand zhang ",
"云淡风轻": "peaceful ",
"屈指可数": "can be counted on one’s fingers ",
"紫衣男子": "purple clothed man ",
"三三两两": "in small groups ",
"命运规则": "Destiny Rule ",
"若有所思": "looked thoughtful ",
"安慰道": "comforted ",
"丹炉": "pill furnace ",
"妖魔鬼怪": "demons and ghosts ",
"大气": "Great Destiny ",
"翻了翻白眼": "rolled the eyes ",
"大不了": "at worst ",
"飞剑": "Flying Sword ",
"阴魂不散": "soul of a deceased has not yet dispersed ",
"千丈": "thousand zhang ",
"匹练": "unrolled bolt of white silk ",
"势如破竹": "like a hot knife through butter ",
"古玉": "ancient jade ",
"介绍道": "introduced ",
"道劫": "Dao Tribulation ",
"万万": "absolutely ",
"血脉": "Bloodline ",
"厮杀": "killings ",
"残破": "dilapidated ",
"眼魔之瞳": "The eyes of the devil ",
"武魂": "Martial Soul ",
"眼魔": "Eyes Devil ",
"分区频道": "district channel ",
"宝马": "precious horse",
"寿元": "life essence ",
//"灵": "spirit ",
"一甲子": "sixty ",
"顺利": "smoothly ",
"宗门": "sect ",
"功法": "Cultivation Technique ",
"篇": "chapter ",
"体修": "Body Cultivation ",
"彩色": "colorful ",
"百世": "hundred lives ",
"求仙": "Seeking Immortality ",
"指指点点": "pointing fingers ",
"大道": "Great Dao ",
"此子": "this child ",
"苦笑起来": "bitterly laughed ",
"上一世": "previous life ",
//"属": "attribute ",
"养命铸仙诀": "Nourishing Life Casting Immortality Art ",
"暗伤": "internal injury ",
"普通人": "ordinary person ",
"道台": "Dao Altar ",
"满头大汗": "brow beaded with sweat ",
"仙苗": "immortal seedling ",
"不分伯仲": "both equally excellent ",
"中品": "middle grade ",
"第二关": "second test ",
"第三关": "third test ",
"一命呜呼": "breathe one’s last ",
"长生命种": "Longevity Seed ",
"气喘吁吁": "gasping for breath ",
"人影": "silhouette ",
"记名": "honorary ",
"数十里山脉": "several dozen li mountain range ",
"暗暗叫苦": "inwardly complained ",
"云布雨术": "Cloudrain Technique ",
"丹田": "dantian ",
"水到渠成": "where water flows, a canal is formed ",
"生命力": "life force ",
"更高": "higher ",
"皱了皱眉": "frowned ",
"一个月后": "1 month later ",
"禁制": "restriction ",
"美眸": "beautiful eyes ",
"不识好歹": "unable to tell good from bad ",
"放在心上": "taking seriously ",
"这几天": "past few days ",
"破绽": "weak spot ",
"天地玄黄": "Heaven, Earth, Profound and Yellow ",
"坊市": "market ",
"神识": "Divine Consciousness ",
"来来往往": "to-and-fro ",
"收敛气息": "restraining aura ",
"一动不动": "motionless ",
"主宗": "main sect ",
"宗主": "sect master ",
"魔教": "demon sect ",
"如果有机会": "if there is an opportunity ",
"脸色大变": "complexion greatly changed ",
"区区一个": "a trifling ",
"这种东西": "this thing ",
"几十年": "several decades ",
"城门": "city gate ",
"冲出去": "charge ahead ",
"剑道": "Sword Dao ",
"奇才": "genius ",
"意境": "Intent Domain ",
"根骨": "Root Bone ",
"领域雏形": "Prototype Domain ",
"七彩": "multicolored ",
"天灵根": "Heavenly Root ",
"符道": "Talisman Dao ",
"滔天火雨": "torrential rain of fire ",
"星辰": "stars ",
"明月": "Bright Moon ",
"旭日": "the Rising Sun ",
"宝贝": "Treasure ",
"修仙": "Immortal Cultivation ",
"长生": "longevity ",
"清晨": "Early Morning ",
"丝丝缕缕": "Threads and rays ",
"的阳光": "of sunlight ",
"高空": "the sky ",
"叫卖": "hawkers ",
"一张": "each ",
"灵米": "spirit rice ",
"灵石": "spirit stone ",
"何松": "He Song ",
"摊位": "stalls ",
"上锁": "lock it ",
"无限": "infinite ",
"丹": "pills ",
"凝光": "Condensed Light ",
"合真": "True Fusion ",
"起身下床": "got up to get out of bed ",
"清心莲": "Clear Heart Lotus ",
"你没有拒绝": "you didn't refuse ",
"易筋": "Changing Muscle ",
"剑势": "Sword Force ",
"随着曹佳的话音刚落": "As soon as Cao Jia finished speaking ",
"大千": "Big Thousand ",
"镇海珠": "Sea Suppressing Bead ",
"不怎么样": "Not good at all ",
"起身走出了房间": "walked out of the room ",
"顿了顿": "After a pause ",
"小千": "Small Thousand ",
"神湖": "Divine Leak ",
"神火": "Divine Fire ",
"啪": "pop ",
"御空": "Imperial Sky ",
"凝神": "Concentrated Mind ",
"混元": "Primodial ",
"鸿运": "Good Luck ",
"力量法则": "Law Of Strength\t",
"因果法则": "Law Of Karma ",
"鬼仙": "Ghost Immortals ",
"届苍生": "Slaughter ",
"哼。": "Hm. ",
"苟道": "careless way ",
"福修": "Blessed Cultivation ",
"纯阳": "Pure Yang ",
"职业": "Occupation ",
"灵植": "Spirit Planter ",
"灵养": "Spirit Nurturer ",
"未解锁": "Locked ",
"通天": "Heavenspan ",
"去哪": "where went ",
"打一折": "90% ",
//"之下": "under ",
        "瞬息": "blink of an eye ",
        //"纪元": "Epoch ",
        //"时代": "ERA ",
        "欧皇": "Luck God ",
        "威能和力量": "moc i potęga ",
        "大肆斩杀": "ruthless assault ",
        "封号": "title ",
        "巧妙奇特": "ingenious and unique ",
        "脸色很不好": "displeased expression ",
        //"名": "position ",
        "语气一滞":"tone faltered ",
        "坏了":"crap ",
        "元石":"Spirit Stone ",
        "章节错误？点此举报":"Report chapter ",
        "罡气":"Astral Qi ",



        // Games Glossary
        "属性":"Attribute ",
        "特性":"Bonuses ",


        //	----		KONIEC/END		-----
//" ": " "

    };

/*(function() {
    'use strict';

    setTimeout(() => {
        const content = document.querySelector('.txtnav');
        if (content) {
            content.style.whiteSpace = 'pre-wrap';
            content.style.lineHeight = '1.1';
            content.style.fontSize = '14px'; // jeśli chcesz rozmiar czcionki
        }
    }, 3000); // 5000 ms = 5 sekund

})();*/

   //* Sort replacements by the length of the keys (longer keys first)
    const sortedReplacements = Object.entries(replacements).sort(
        (a, b) => b[0].length - a[0].length
    );

    // Function to replace text on the page & kolory
function replaceText(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        let text = node.nodeValue;
        let replaced = false;

        for (const [key, value] of sortedReplacements) {
            const highlightedValue = `<span class="highlighted-term">${value}</span>`;
            if (text.includes(key)) {
                text = text.replace(new RegExp(key, 'g'), highlightedValue);
                replaced = true;
            }
        }

        if (replaced) {
            const span = document.createElement("span");
            span.innerHTML = text;
            node.parentNode.replaceChild(span, node);
        }
    } else {
        for (const child of [...node.childNodes]) {
            replaceText(child);
        }
    }
}




// Function to process and remove lines containing any of the specified phrases
function removeLinesContaining(node, phrases) {
    if (node.nodeType === Node.TEXT_NODE) {
        // Split the text into lines, filter out lines with any of the specific phrases, and rejoin
        const lines = node.nodeValue.split('\n');
        const filteredLines = lines.filter(line => !phrases.some(phrase => line.includes(phrase)));
        node.nodeValue = filteredLines.join('\n');
    } else {
        for (const child of node.childNodes) {
            removeLinesContaining(child, phrases);
        }
    }
}

// Process the document body
replaceText(document.body);
removeLinesContaining(document.body, ['最⊥新⊥小⊥说⊥在⊥六⊥9⊥⊥书⊥⊥吧⊥⊥首⊥发！',
                                      '本作品由', '原文在六', '书◇吧', '无错版本在',
                                      '书◇吧', '6◇9◇书◇吧', '在一6一9一书一吧',
                                      '收藏6...9', '6一9一书一吧一看！','【感谢书友',
                                      '起点币打赏】',
                                      '最⊥新⊥小⊥说⊥在⊥六⊥9⊥⊥书⊥⊥吧⊥⊥首⊥发！']);

// Observe for dynamically loaded content
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                replaceText(node);
                removeLinesContaining(node, ['本作品由', '原文在六']);
            }
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });

})();







/*
// ==UserScript==
// @name         Fix Translated Text Formatting
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Usuwa znaczniki <font>, przywraca akapity i poprawia odstępy, zachowując .highlighted-term
// @author       You
// @match        https://www.69shuba.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function fixFormatting() {
        const contentDiv = document.querySelector('.txtnav');
        if (!contentDiv || contentDiv.dataset.processed === 'true') return;

        let content = contentDiv.innerHTML;
        // Usuwamy tylko znaczniki <font>, ale zachowujemy <span class="highlighted-term">
        content = content.replace(/<font dir="auto" style="vertical-align: inherit;">/g, '')
                        .replace(/<\/font>/g, '');

        const lines = content.split(/<br\s*\/?>/i).filter(line => line.trim() !== '');
        let newContent = '';
        let inAdBlock = false;

        lines.forEach(line => {
            if (line.includes('contentadv')) {
                newContent += line;
                inAdBlock = true;
            } else if (inAdBlock) {
                inAdBlock = false;
                newContent += line;
            } else {
                const trimmedLine = line.trim();
                if (trimmedLine) {
                    newContent += `<p>${trimmedLine}</p>`;
                }
            }
        });

        contentDiv.innerHTML = newContent;
        contentDiv.dataset.processed = 'true';

        // Dodajemy style, w tym dla .highlighted-term
        if (!document.querySelector('#custom-spacing-style')) {
            const style = document.createElement('style');
            style.id = 'custom-spacing-style';
            style.innerHTML = `
                .txtnav p {
                    margin: 0 0 1em 0 !important;
                    padding: 0 !important;
                    line-height: 1.5 !important;
                    text-indent: 2em;
                }
                .txtnav br {
                    display: none;
                }
                .txtnav .contentadv {
                    margin: 1em 0;
                }
                .txtnav .highlighted-term {
                    color: !important;
                    font-weight: bold !important;
                    text-decoration: underline !important;
                    -webkit-text-fill-color: !important;
                }
            `;
            document.head.appendChild(style);
            console.log('Style CSS zostały dodane, w tym dla .highlighted-term.');
        }
    }

    // Wykonaj po załadowaniu strony
    window.addEventListener('load', () => {
        fixFormatting();
        setTimeout(fixFormatting, 2000); // Opóźnienie 2 sekundy
    });

    // Obsługa dynamicznych zmian w DOM
    const observer = new MutationObserver(() => {
        const contentDiv = document.querySelector('.txtnav');
        if (contentDiv && contentDiv.dataset.processed !== 'true') {
            fixFormatting();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Obsługa kliknięć w linki
    document.addEventListener('click', (event) => {
        if (event.target.closest('a[href*="txt/"]')) {
            const contentDiv = document.querySelector('.txtnav');
            if (contentDiv) {
                contentDiv.dataset.processed = 'false';
            }
            setTimeout(fixFormatting, 2000);
        }
    });
})();
*/



/*
//          Old script worth to try on some novels if the one above not working good enough
// ==UserScript==
// @name         Fix Translated Text Formatting
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Usuwa znaczniki <font> z przetłumaczonego tekstu i przywraca oryginalne odstępy między akapitami
// @author       You
// @match        https://www.69shuba.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Funkcja do naprawy formatowania
    function fixFormatting() {
        // Znajdź element zawierający treść (div z klasą txtnav)
        const contentDiv = document.querySelector('.txtnav');
        if (!contentDiv) return; // Jeśli nie ma elementu, zakończ

        // Pobierz wszystkie węzły tekstowe i znaczniki <br> w div.txtnav
        const nodes = contentDiv.childNodes;
        let newContent = '';

        // Przetwarzaj każdy węzeł
        nodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
                // Zachowaj <br> jako znacznik odstępu
                newContent += '<br>';
            } else if (node.nodeType === Node.ELEMENT_NODE && node.className === 'contentadv') {
                // Zachowaj elementy reklamowe bez zmian
                newContent += node.outerHTML;
            } else if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
                // Pobierz tekst, usuwając znaczniki <font>
                let text = node.nodeType === Node.TEXT_NODE ? node.textContent : node.innerHTML;
                text = text.replace(/<font dir="auto" style="vertical-align: inherit;">/g, '')
                          .replace(/<\/font>/g, '')
                          .trim();

                if (text) {
                    // Dodaj tekst jako akapit, jeśli nie jest pusty
                    newContent += `<p>${text}</p>`;
                }
            }
        });

        // Wstaw oczyszczoną treść z akapitami
        contentDiv.innerHTML = newContent;

        // Dodaj styl CSS dla odstępów między akapitami
        if (!document.querySelector('#custom-spacing-style')) {
            const style = document.createElement('style');
            style.id = 'custom-spacing-style';
style.innerHTML = `
    .txtnav p {
        margin: 0 !important;
        padding: 0 !important;
        line-height: 1.4 !important; /* bardziej zwarty wygląd 
        text-indent: 2em;
    }
    .txtnav br + br {
        display: none; /* ukryj podwójne <br>, które mogą tworzyć duże odstępy 
    }
`;

            document.head.appendChild(style);
        }
    }

    // Wykonaj funkcję po załadowaniu strony
    window.addEventListener('load', () => {
        fixFormatting();
        // Wykonaj ponownie po krótkim opóźnieniu dla dynamicznie ładowanych treści
        setTimeout(fixFormatting, 500); // Opóźnienie 0.5 sekundy
    });
})();
*/











// ==UserScript==
// @name         Fix Translated Text Formatting with GUI (Swapped Styles)
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Naprawia formatowanie i dodaje GUI do przełączania stylu akapitów (luźny/zwarty, z zapamiętywaniem)
// @author       You
// @match        https://www.69shuba.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function fixFormatting() {
        const contentDiv = document.querySelector('.txtnav');
        if (!contentDiv || contentDiv.dataset.processed === 'true') return;

        const nodes = contentDiv.childNodes;
        let newContent = '';

        nodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
                newContent += '<br>';
            } else if (node.nodeType === Node.ELEMENT_NODE && node.className === 'contentadv') {
                newContent += node.outerHTML;
            } else if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
                let text = node.nodeType === Node.TEXT_NODE ? node.textContent : node.innerHTML;

                if (!text.includes('highlighted-term')) {
                    text = text.replace(/<font[^>]*>/g, '').replace(/<\/font>/g, '');
                }

                text = text.replace(/\u2003+/g, ' ').trim();

                if (text) {
                    newContent += `<p>${text}</p>`;
                }
            }
        });

        contentDiv.innerHTML = newContent;
        contentDiv.dataset.processed = 'true';

        applyStyle(currentStyle);
        injectToggleButton();
    }

    // Styl 1 (domyślny) = luźny, Styl 2 = zwarty
    const styles = {
        spacious: `
            .txtnav p {
                margin: 0 0 1em 0 !important;
                padding: 0 !important;
                line-height: 1.6 !important;
                text-indent: 2em;
            }
            .txtnav br {
                display: none !important;
            }
            .txtnav .highlighted-term {
                font-weight: bold !important;
                text-decoration: underline !important;
            }
        `,
        compact: `
            .txtnav p {
                margin: 0 0 0.3em 0 !important;
                padding: 0 !important;
                line-height: 1.2 !important;
                text-indent: 2em;
            }
            .txtnav br {
                display: none !important;
            }
            .txtnav .highlighted-term {
                font-weight: bold !important;
                text-decoration: underline !important;
            }
        `
    };

    // Odczyt stylu z localStorage
    const savedStyle = localStorage.getItem('txtnavStyle');
    let currentStyle = savedStyle && styles[savedStyle] ? savedStyle : 'spacious';

    function applyStyle(styleKey) {
        let styleTag = document.querySelector('#custom-spacing-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'custom-spacing-style';
            document.head.appendChild(styleTag);
        }
        styleTag.innerHTML = styles[styleKey];
    }

    function injectToggleButton() {
        if (document.querySelector('#style-toggle-button')) return;

        const btn = document.createElement('button');
        btn.id = 'style-toggle-button';
        btn.textContent = currentStyle === 'spacious' ? 'Styl: Luźny' : 'Styl: Zwarty';
        btn.style.position = 'fixed';
        btn.style.top = '10px';
        btn.style.right = '10px';
        btn.style.zIndex = '9999';
        btn.style.padding = '6px 12px';
        btn.style.background = '#444';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';

        btn.addEventListener('click', () => {
            currentStyle = currentStyle === 'spacious' ? 'compact' : 'spacious';
            applyStyle(currentStyle);
            localStorage.setItem('txtnavStyle', currentStyle);
            btn.textContent = currentStyle === 'spacious' ? 'Styl: Luźny' : 'Styl: Zwarty';
        });

        document.body.appendChild(btn);
    }

    window.addEventListener('load', () => {
        fixFormatting();
        setTimeout(fixFormatting, 1000);
    });

    const observer = new MutationObserver(() => {
        const contentDiv = document.querySelector('.txtnav');
        if (contentDiv && contentDiv.dataset.processed !== 'true') {
            fixFormatting();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    document.addEventListener('click', (event) => {
        if (event.target.closest('a[href*="txt/"]')) {
            const contentDiv = document.querySelector('.txtnav');
            if (contentDiv) {
                contentDiv.dataset.processed = 'false';
            }
            setTimeout(fixFormatting, 1000);
        }
    });
})();
















// ==UserScript==
// @name         Replace Chinese Cultivation Terms
// @namespace    http://tampermonkey.net/
// @version      12.0
// @description  to jest tylko zeby linie sie nie rozpierdalaly na 69shuba.com
// @author       Your Name
// @match        *://*.69shuba.com/*
// @grant        none
// ==/UserScript==
/*
(function() {
    'use strict';

    setTimeout(() => {
        const content = document.querySelector('.txtnav');
        if (content) {
            content.style.whiteSpace = 'pre-wrap';
            content.style.lineHeight = '1.1';
            content.style.fontSize = '14px'; // jeśli chcesz rozmiar czcionki
        }
    }, 3000); // 5000 ms = 5 sekund

})();*/



/*
// ==UserScript==
// @name         Poprawa zawijania tekstu po tłumaczeniu
// @match        https://www.69shuba.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function fixTextWrapping() {
        const container = document.querySelector("body > div.container > div.mybox > div.txtnav");
        if (!container) return;

        container.querySelectorAll('font, span').forEach(el => {
            el.style.whiteSpace = 'normal';
            el.style.wordBreak = 'break-word';
            el.style.lineHeight = '1.6';
            el.style.display = 'block';
            el.style.width = '100%';
            el.style.maxWidth = '100%';
            el.style.verticalAlign = 'initial';
        });
    }

    // Uruchomienie po załadowaniu strony
    window.addEventListener('load', () => {
        fixTextWrapping();

        // Obserwuj zmiany DOM w obrębie txtnav
        const container = document.querySelector("body > div.container > div.mybox > div.txtnav");
        if (container) {
            const observer = new MutationObserver(() => {
                fixTextWrapping();
            });
            observer.observe(container, { childList: true, subtree: true });
        }
    });
})();
*/
