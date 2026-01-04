// ==UserScript==
// @name         Warframe Market Chinese-English Dictionary
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  在 Warframe Market 添加中英對照查詢功能
// @author       Kinor
// @match        https://warframe.market/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545277/Warframe%20Market%20Chinese-English%20Dictionary.user.js
// @updateURL https://update.greasyfork.org/scripts/545277/Warframe%20Market%20Chinese-English%20Dictionary.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 資料來源 =====
    const translationData = [
        {'en': 'Ack & Brunt', 'zh': '認知&衝擊'},
        {'en': 'Akjagara Prime', 'zh': '覺醒雙槍Prime'},
        {'en': 'Dual Cestra', 'zh': '錫斯特雙槍'},
        {'en': 'Dual Cleavers', 'zh': '斬肉雙刀'},
        {'en': 'Dual Ether', 'zh': '蒼穹雙劍'},
        {'en': 'Dual Heat Swords', 'zh': '烈焰雙劍'},
        {'en': 'Dual Ichor', 'zh': '惡膿雙斧'},
        {'en': 'Dual Kamas', 'zh': '雙短柄戰鐮'},
        {'en': 'Dual Kamas Prime', 'zh': '雙短柄戰鐮Prime'},
        {'en': 'Dual Keres', 'zh': '凱瑞斯雙刀'},
        {'en': 'Dual Raza', 'zh': '鋒月雙斧'},
        {'en': 'Aklato', 'zh': '拉托雙槍'},
        {'en': 'Dual Skana', 'zh': '空刃雙刀'},
        {'en': 'Dual Toxocyst', 'zh': '毒囊雙槍'},
        {'en': 'Dual Zoren', 'zh': '佐倫雙斧'},
        {'en': 'Embolist', 'zh': '安柏勒斯'},
        {'en': 'Endura', 'zh': '三葉堅韌'},
        {'en': 'Ether Daggers', 'zh': '蒼穹匕首'},
        {'en': 'Ether Reaper', 'zh': '蒼穹死神'},
        {'en': 'Ether Sword', 'zh': '蒼穹之劍'},
        {'en': 'Euphona Prime', 'zh': '悅音Prime'},
        {'en': 'Exergis', 'zh': '晶能放射器'},
        {'en': 'Aklex', 'zh': '雷克斯雙槍'},
        {'en': 'Falcor', 'zh': '獵鷹輪'},
        {'en': 'Fang', 'zh': '狼牙'},
        {'en': 'Fang Prime', 'zh': '狼牙Prime'},
        {'en': 'Ferrox', 'zh': '鐵晶磁軌炮'},
        {'en': 'Flux Rifle', 'zh': '通量射線步槍'},
        {'en': 'Fragor', 'zh': '重擊巨鎚'},
        {'en': 'Fragor Prime', 'zh': '重擊巨鎚Prime'},
        {'en': 'Furax', 'zh': '弗拉克斯'},
        {'en': 'Furax Wraith', 'zh': '弗拉克斯亡魂'},
        {'en': 'Aklex Prime', 'zh': '雷克斯雙槍Prime'},
        {'en': 'Fusilai', 'zh': '齊射玻刃'},
        {'en': 'Galatine', 'zh': '迦倫提恩'},
        {'en': 'Galatine Prime', 'zh': '迦倫提恩Prime'},
        {'en': 'Galvacord', 'zh': '電流刺索'},
        {'en': 'Gammacor', 'zh': '咖瑪腕甲槍'},
        {'en': 'Gazal Machete', 'zh': '加扎勒反曲刀'},
        {'en': 'Glaive', 'zh': '戰刃'},
        {'en': 'Glaive Prime', 'zh': '戰刃Prime'},
        {'en': 'Glaxion', 'zh': '冷凍光束步槍'},
        {'en': 'Gorgon', 'zh': '蛇髮女妖'},
        {'en': 'Akmagnus', 'zh': '麥格努斯雙槍'},
        {'en': 'Gorgon Wraith', 'zh': '蛇髮女妖亡魂'},
        {'en': 'Grakata', 'zh': '葛拉卡達'},
        {'en': 'Gram', 'zh': '格拉姆'},
        {'en': 'Gram Prime', 'zh': '格拉姆Prime'},
        {'en': 'Grinlok', 'zh': '葛恩火槍'},
        {'en': 'Guandao', 'zh': '關刀'},
        {'en': 'Gunsen', 'zh': '軍扇'},
        {'en': 'Halikar', 'zh': '哈利卡'},
        {'en': 'Harpak', 'zh': '哈帕克'},
        {'en': 'Aksomati', 'zh': '輕靈月神雙槍'},
        {'en': 'Heat Dagger', 'zh': '烈焰匕首'},
        {'en': 'Heat Sword', 'zh': '烈焰長劍'},
        {'en': 'Hek', 'zh': '海克'},
        {'en': 'Heliocor', 'zh': '赫利俄光錘'},
        {'en': 'Helios', 'zh': '赫利俄斯'},
        {'en': 'Helios Prime', 'zh': '赫利俄斯Prime'},
        {'en': 'Hema', 'zh': '血肢'},
        {'en': 'Hikou', 'zh': '飛揚'},
        {'en': 'Hikou Prime', 'zh': '飛揚Prime'},
        {'en': 'Hind', 'zh': '雌鹿'},
        {'en': 'Akstiletto', 'zh': '史提托雙槍'},
        {'en': 'Hirudo', 'zh': '螞蟥'},
        {'en': 'Hystrix', 'zh': '豪豬'},
        {'en': 'Ignis', 'zh': '伊格尼斯'},
        {'en': 'Ignis Wraith', 'zh': '伊格尼斯亡魂'},
        {'en': 'Jat Kittag', 'zh': '噴射戰鎚'},
        {'en': 'Jat Kusar', 'zh': '噴射鎖鐮'},
        {'en': 'Javlok', 'zh': '燃焰標槍'},
        {'en': 'Jaw Sword', 'zh': '蛇顎刀'},
        {'en': 'Akstiletto Prime', 'zh': '史提托雙槍Prime'},
        {'en': 'Kama', 'zh': '短柄戰鐮'},
        {'en': 'Karak', 'zh': '卡拉克'},
        {'en': 'Karak Wraith', 'zh': '卡拉克亡魂'},
        {'en': 'Karyst', 'zh': '凱洛斯特'},
        {'en': 'Kesheg', 'zh': '怯薛'},
        {'en': 'Kestrel', 'zh': '紅隼'},
        {'en': 'Knell', 'zh': '喪鐘'},
        {'en': 'Kogake', 'zh': '科加基'},
        {'en': 'Akvasto', 'zh': '瓦斯托雙槍'},
        {'en': 'Kogake Prime', 'zh': '科加基Prime'},
        {'en': 'Kohm', 'zh': '寇恩熱能槍'},
        {'en': 'Kohmak', 'zh': '寇恩霰機槍'},
        {'en': 'Korrudo', 'zh': '庫魯多'},
        {'en': 'Kraken', 'zh': '北海巨妖'},
        {'en': 'Kreska', 'zh': '克雷斯卡'},
        {'en': 'Kronen', 'zh': '皇家拐刃'},
        {'en': 'Kronen Prime', 'zh': '皇家拐刃Prime'},
        {'en': 'Kulstar', 'zh': '殺星'},
        {'en': 'Kunai', 'zh': '苦無'},
        {'en': 'Akvasto Prime', 'zh': '瓦斯托雙槍Prime'},
        {'en': 'Lacera', 'zh': '悲痛之刃'},
        {'en': 'Lanka', 'zh': '蘭卡'},
        {'en': 'Laser Rifle', 'zh': '雷射步槍'},
        {'en': 'Lato', 'zh': '拉托'},
        {'en': 'Lato Prime', 'zh': '拉托Prime'},
        {'en': 'Lato Vandal', 'zh': '拉托破壞者'},
        {'en': 'Latron', 'zh': '拉特昂'},
        {'en': 'Latron Prime', 'zh': '拉特昂Prime'},
        {'en': 'Latron Wraith', 'zh': '拉特昂亡魂'},
        {'en': 'Acrid', 'zh': '阿克里德'},
        {'en': 'AkZani', 'zh': '荒謬雙槍'},
        {'en': 'Lecta', 'zh': '勒克塔'},
        {'en': 'Lenz', 'zh': '冷次弓'},
        {'en': 'Lesion', 'zh': '病變'},
        {'en': 'Lex', 'zh': '雷克斯'},
        {'en': 'Lex Prime', 'zh': '雷克斯Prime'},
        {'en': 'Machete', 'zh': '馬謝特砍刀'},
        {'en': 'Machete Wraith', 'zh': '馬謝特砍刀亡魂'},
        {'en': 'Magistar', 'zh': '執法者'},
        {'en': 'Magnus', 'zh': '麥格努斯'},
        {'en': 'Marelok', 'zh': '瑪瑞火槍'},
        {'en': 'Amphis', 'zh': '雙頭蛇'},
        {'en': 'Mios', 'zh': '牡獅神'},
        {'en': 'Mire', 'zh': '米爾'},
        {'en': 'Miter', 'zh': '米特爾'},
        {'en': 'MK1-Bo', 'zh': 'MK1-玻之武杖'},
        {'en': 'MK1-Braton', 'zh': 'MK1-布萊頓'},
        {'en': 'MK1-Furax', 'zh': 'MK1-弗拉克斯'},
        {'en': 'MK1-Furis', 'zh': 'MK1-盜賊'},
        {'en': 'MK1-Kunai', 'zh': 'MK1-苦無'},
        {'en': 'MK1-Paris', 'zh': 'MK1-帕里斯'},
        {'en': 'MK1-Strun', 'zh': 'MK1-斯特朗'},
        {'en': 'Amprex', 'zh': '安培克斯'},
        {'en': 'Mutalist Cernos', 'zh': '異融西諾斯'},
        {'en': 'Mutalist Quanta', 'zh': '異融量子槍'},
        {'en': 'Nagantaka', 'zh': '噬蛇弩'},
        {'en': 'Nami Skyla', 'zh': '海波斯庫拉對劍'},
        {'en': 'Nami Skyla Prime', 'zh': '海波斯庫拉對劍Prime'},
        {'en': 'Nami Solo', 'zh': '海波單劍'},
        {'en': 'Nikana', 'zh': '侍刃'},
        {'en': 'Nikana Prime', 'zh': '侍刃Prime'},
        {'en': 'Ninkondi', 'zh': '降靈追獵者'},
        {'en': 'Ninkondi Prime', 'zh': '降靈追獵者'},
        {'en': 'Angstrum', 'zh': '安格斯壯'},
        {'en': 'Nukor', 'zh': '努寇微波槍'},
        {'en': 'Obex', 'zh': '奧比克斯'},
        {'en': 'Ocucor', 'zh': '視使之觸'},
        {'en': 'Ogris', 'zh': '食人女魔'},
        {'en': 'Ohma', 'zh': '歐瑪'},
        {'en': 'Opticor', 'zh': '奧堤克光子槍'},
        {'en': 'Opticor Vandal', 'zh': '奧堤克光子槍破壞者'},
        {'en': 'Orthos', 'zh': '歐特魯斯'},
        {'en': 'Orthos Prime', 'zh': '歐特魯斯Prime'},
        {'en': 'Anku', 'zh': '奪魂死神'},
        {'en': 'Pandero', 'zh': '手鼓'},
        {'en': 'Pangolin Sword', 'zh': '鯪鯉劍'},
        {'en': 'Panthera', 'zh': '獵豹'},
        {'en': 'Paracesis', 'zh': '心智之歿'},
        {'en': 'Paracyst', 'zh': '附肢寄生者'},
        {'en': 'Paris', 'zh': '帕里斯'},
        {'en': 'Paris Prime', 'zh': '帕里斯Prime'},
        {'en': 'Penta', 'zh': '潘塔'},
        {'en': 'Phage', 'zh': '噬菌者'},
        {'en': 'Ankyros', 'zh': '甲龍雙拳'},
        {'en': 'Phantasma', 'zh': '幻離子'},
        {'en': 'Plasma Sword', 'zh': '電漿長劍'},
        {'en': 'Plinx', 'zh': '漫射者'},
        {'en': 'Pox', 'zh': '膿痘'},
        {'en': 'Prime Laser Rifle', 'zh': '雷射步槍Prime'},
        {'en': 'Prisma Burst Laser', 'zh': '棱晶雷射點發'},
        {'en': 'Prisma Dual Cleavers', 'zh': '棱晶斬肉雙刀'},
        {'en': 'Prisma Gorgon', 'zh': '棱晶蛇髮女妖'},
        {'en': 'Prisma Grakata', 'zh': '棱晶葛拉卡達'},
        {'en': 'Prisma Obex', 'zh': '棱晶奧比克斯'},
        {'en': 'Ankyros Prime', 'zh': '甲龍雙拳Prime'},
        {'en': 'Prisma Shade', 'zh': '棱晶陰影'},
        {'en': 'Prisma Skana', 'zh': '棱晶空刃'},
        {'en': 'Prisma Tetra', 'zh': '棱晶特拉'},
        {'en': 'Prova', 'zh': '普羅沃'},
        {'en': 'Prova Vandal', 'zh': '普羅沃破壞者'},
        {'en': 'Pupacyst', 'zh': '毒囊骨繭'},
        {'en': 'Pyrana', 'zh': '食人魚'},
        {'en': 'Pyrana Prime', 'zh': '食人魚Prime'},
        {'en': 'Quanta', 'zh': '量子切割器'},
        {'en': 'Arca Titron', 'zh': '弧電振子錘'},
        {'en': 'Quartakk', 'zh': '誇塔克'},
        {'en': 'Rakta Ballistica', 'zh': '緋紅布里斯提卡'},
        {'en': 'Rakta Cernos', 'zh': '緋紅西諾斯'},
        {'en': 'Rakta Dark Dagger', 'zh': '緋紅暗黑匕首'},
        {'en': 'Reaper Prime', 'zh': '收割者Prime'},
        {'en': 'Redeemer', 'zh': '救贖者'},
        {'en': 'Redeemer Prime', 'zh': '救贖者Prime'},
        {'en': 'Ripkas', 'zh': '鋭卡斯'},
        {'en': 'Rubico', 'zh': '絕路'},
        {'en': 'Arcata', 'zh': '阿卡塔'},
        {'en': 'Rubico Prime', 'zh': '絕路Prime'},
        {'en': 'Sancti Castanas', 'zh': '聖潔雷爆信標'},
        {'en': 'Sancti Magistar', 'zh': '聖潔執法者'},
        {'en': 'Sancti Tigris', 'zh': '聖潔猛虎'},
        {'en': 'Sarpa', 'zh': '蛇刃'},
        {'en': 'Scindo', 'zh': '分裂斬斧'},
        {'en': 'Scindo Prime', 'zh': '分裂斬斧Prime'},
        {'en': 'Scoliac', 'zh': '脊椎節鞭'},
        {'en': 'Scourge', 'zh': '禍根'},
        {'en': 'Secura Dual Cestra', 'zh': '保障錫斯特雙槍'},
        {'en': 'Argonak', 'zh': '氬格納克'},
        {'en': 'Secura Lecta', 'zh': '保障勒克塔'},
        {'en': 'Secura Penta', 'zh': '保障潘塔'},
        {'en': 'Seer', 'zh': '預言者'},
        {'en': 'Serro', 'zh': '電能斬鋸'},
        {'en': 'Shaku', 'zh': '雙節尺棍'},
        {'en': 'Sheev', 'zh': '希芙'},
        {'en': 'Sibear', 'zh': '西伯利亞冰鎚'},
        {'en': 'Sicarus', 'zh': '暗殺者'},
        {'en': 'Sicarus Prime', 'zh': '暗殺者Prime'},
        {'en': 'Sigma & Octantis', 'zh': '西格瑪&南極座'},
        {'en': 'Afuris', 'zh': '盜賊雙槍'},
        {'en': 'Artax', 'zh': '阿塔克斯'},
        {'en': 'Silva& Aegis Prime', 'zh': '席瓦&神盾Prime'},
        {'en': 'Silva&Aegis', 'zh': '席瓦&神盾'},
        {'en': 'Simulor', 'zh': '重力奇點擬成槍'},
        {'en': 'Skana', 'zh': '空刃'},
        {'en': 'Skana Prime', 'zh': '空刃Prime'},
        {'en': 'Skiajati', 'zh': '影生'},
        {'en': 'Snipetron', 'zh': '狙擊特昂'},
        {'en': 'Snipetron Vandal', 'zh': '狙擊特昂破壞者'},
        {'en': 'Sobek', 'zh': '鱷神'},
        {'en': 'Soma', 'zh': '月神'},
        {'en': 'Artemis Bow', 'zh': '月神狩弓'},
        {'en': 'Soma Prime', 'zh': '月神Prime'},
        {'en': 'Sonicor', 'zh': '超音波衝擊槍'},
        {'en': 'Spectra', 'zh': '光譜切割器'},
        {'en': 'Spira', 'zh': '旋刃飛刀'},
        {'en': 'Spira Prime', 'zh': '旋刃飛刀Prime'},
        {'en': 'Staticor', 'zh': '靜電能量導引槍'},
        {'en': 'Stinger', 'zh': '毒刺'},
        {'en': 'Stradavar Prime', 'zh': '斯特拉迪瓦Prime'},
        {'en': 'Strun', 'zh': '斯特朗'},
        {'en': 'Strun Wraith', 'zh': '斯特朗亡魂'},
        {'en': 'Astilla', 'zh': '碎裂者'},
        {'en': 'Stubba', 'zh': '史度巴'},
        {'en': 'Stug', 'zh': '史特克'},
        {'en': 'Supra', 'zh': '蘇普拉'},
        {'en': 'Supra Vandal', 'zh': '蘇普拉破壞者'},
        {'en': 'Sweeper', 'zh': '掃除者'},
        {'en': 'Sweeper Prime', 'zh': '掃除者Prime'},
        {'en': 'Sybaris', 'zh': '席芭莉絲'},
        {'en': 'Sybaris Prime', 'zh': '席芭莉絲Prime'},
        {'en': 'Sydon', 'zh': '惡龍'},
        {'en': 'Synapse', 'zh': '突觸生化槍'},
        {'en': 'Atomos', 'zh': '原子礦融砲'},
        {'en': 'Synoid Gammacor', 'zh': '樞議咖瑪腕甲槍'},
        {'en': 'Synoid Heliocor', 'zh': '樞議赫利俄光錘'},
        {'en': 'Synoid Simulor', 'zh': '樞議重力奇點擬成槍'},
        {'en': 'Tatsu', 'zh': '龍辰'},
        {'en': 'Taxon', 'zh': '塔克桑'},
        {'en': 'Tekko', 'zh': '鐵鉤手甲'},
        {'en': 'Telos Akbolto', 'zh': '終極螺釘雙槍'},
        {'en': 'Tenora', 'zh': '雙簧管'},
        {'en': 'Tetra', 'zh': '特拉'},
        {'en': 'Tiberon', 'zh': '狂鯊'},
        {'en': 'Atterax', 'zh': '阿特拉克斯'},
        {'en': 'Tiberon Prime', 'zh': '狂鯊Prime'},
        {'en': 'Tigris', 'zh': '猛虎'},
        {'en': 'Tigris Prime', 'zh': '猛虎Prime'},
        {'en': 'Tipedo', 'zh': '提佩多'},
        {'en': 'Tipedo Prime', 'zh': '提佩多Prime'},
        {'en': 'Tonbo', 'zh': '蜻蛉薙'},
        {'en': 'Tonkor', 'zh': '征服榴砲'},
        {'en': 'Torid', 'zh': '托里德'},
        {'en': 'Twin Basolk', 'zh': '雙子巴薩克'},
        {'en': 'Twin Grakata', 'zh': '雙子葛拉卡達'},
        {'en': 'Attica', 'zh': '阿提卡'},
        {'en': 'Twin Gremlins', 'zh': '雙子小精靈'},
        {'en': 'Twin Kohmak', 'zh': '雙子寇恩霰機槍'},
        {'en': 'Twin Rogga', 'zh': '雙子羅格'},
        {'en': 'Twin Vipers', 'zh': '雙子蝰蛇'},
        {'en': 'Twin Wraith Vipers', 'zh': '雙子蝰蛇亡魂'},
        {'en': 'Tysis', 'zh': '啐沫者'},
        {'en': 'Vasto', 'zh': '瓦斯托'},
        {'en': 'Vasto Prime', 'zh': '瓦斯托Prime'},
        {'en': 'Vaykor Hek', 'zh': '勇氣海克'},
        {'en': 'Vaykor Marelok', 'zh': '勇氣瑪瑞火槍'},
        {'en': 'Azima', 'zh': '方位角'},
        {'en': 'Vectis', 'zh': '守望者'},
        {'en': 'Vectis Prime', 'zh': '守望者Prime'},
        {'en': 'Veldt', 'zh': '草原獵手'},
        {'en': 'Venka', 'zh': '凱旋之爪'},
        {'en': 'Venka Prime', 'zh': '凱旋之爪Prime'},
        {'en': 'Viper', 'zh': '蝰蛇'},
        {'en': 'Volnus', 'zh': '創傷'},
        {'en': 'Vulkar', 'zh': '金工火神'},
        {'en': 'Ballistica', 'zh': '布里斯提卡'},
        {'en': 'Vulkar Wraith', 'zh': '金工火神亡魂'},
        {'en': 'Vulklok', 'zh': '金工火槍'},
        {'en': 'War', 'zh': '戰爭之劍'},
        {'en': 'Wolf Sledge', 'zh': '惡狼戰鎚'},
        {'en': 'Zakti', 'zh': '毒芽'},
        {'en': 'Zarr', 'zh': '沙皇'},
        {'en': 'Zenistar', 'zh': '天頂之星'},
        {'en': 'Zenith', 'zh': '天穹之頂'},
        {'en': 'Zhuge', 'zh': '諸葛連弩'},
        {'en': 'Zhuge Prime', 'zh': '諸葛連弩Prime'},
        {'en': 'Ballistica Prime', 'zh': '布里斯提卡Prime'},
        {'en': 'Zylok', 'zh': '賽爾火槍'},
        {'en': 'Battacor', 'zh': '武使之力'},
        {'en': 'Baza', 'zh': '蒼鷹'},
        {'en': 'Baza Prime', 'zh': '蒼鷹Prime'},
        {'en': 'Bo', 'zh': '玻之武杖'},
        {'en': 'Bo Prime', 'zh': '玻之武杖Prime'},
        {'en': 'Boar', 'zh': '野豬'},
        {'en': 'Boar Prime', 'zh': '野豬Prime'},
        {'en': 'Boltace', 'zh': '螺釘拐刃'},
        {'en': 'Bolto', 'zh': '螺釘手槍'},
        {'en': 'Boltor', 'zh': '螺釘步槍'},
        {'en': 'Boltor Prime', 'zh': '螺釘步槍Prime'},
        {'en': 'Akbolto', 'zh': '螺釘雙槍'},
        {'en': 'Brakk', 'zh': '布拉克'},
        {'en': 'Braton', 'zh': '布萊頓'},
        {'en': 'Braton Prime', 'zh': '布萊頓Prime'},
        {'en': 'Braton Vandal', 'zh': '布萊頓破壞者'},
        {'en': 'Broken Scepter', 'zh': '破損珽杖'},
        {'en': 'Broken War', 'zh': '破碎的戰爭之劍'},
        {'en': 'Bronco', 'zh': '野馬'},
        {'en': 'Bronco Prime', 'zh': '野馬Prime'},
        {'en': 'Burst Laser', 'zh': '雷射點發'},
        {'en': 'Burston', 'zh': '伯斯頓'},
        {'en': 'Akbolto Prime', 'zh': '螺釘雙槍Prime'},
        {'en': 'Burston Prime', 'zh': '伯斯頓Prime'},
        {'en': 'Buzlok', 'zh': '巴茲火槍'},
        {'en': 'Caustacyst', 'zh': '灼蝕變體鐮'},
        {'en': 'Ceramic Dagger', 'zh': '陶瓷匕首'},
        {'en': 'Cerata', 'zh': '裸鰓刃'},
        {'en': 'Cernos', 'zh': '西諾斯'},
        {'en': 'Cernos Prime', 'zh': '西諾斯Prime'},
        {'en': 'Cestra', 'zh': '錫斯特'},
        {'en': 'Cobra & Crane', 'zh': '眼鏡蛇&鶴'},
        {'en': 'Akbronco', 'zh': '野馬雙槍'},
        {'en': 'Convectrix', 'zh': '導熱聚焦槍'},
        {'en': 'Corinth', 'zh': '科林斯'},
        {'en': 'Corinth Prime', 'zh': '科林斯Prime'},
        {'en': 'Cronus', 'zh': '克洛諾斯'},
        {'en': 'Cycron', 'zh': '循環離子槍'},
        {'en': 'Daikyu', 'zh': '大久和弓'},
        {'en': 'Dakra Prime', 'zh': '達克拉Prime'},
        {'en': 'Dark Dagger', 'zh': '暗黑匕首'},
        {'en': 'Akbronco Prime', 'zh': '野馬雙槍Prime'},
        {'en': 'Dark Split-Sword', 'zh': '暗黑分合劍'},
        {'en': 'Dark Sword', 'zh': '暗黑長劍'},
        {'en': 'Athodai', 'zh': '厄索戴'},
        {'en': 'Quassus', 'zh': '夸瑟'},
        {'en': 'Zymos', 'zh': '宰魔'},
        {'en': 'Deconstructor', 'zh': '分離'},
        {'en': 'Keratinos', 'zh': '鋒角之爪'},
        {'en': 'Trumna', 'zh': '創痍者'},
        {'en': 'Sepulcrum', 'zh': '鑿墓者'},
        {'en': 'Deconstructor Prime', 'zh': '分離Prime'},
        {'en': 'Stropha', 'zh': '詭詐鋒刃'},
        {'en': 'Dera', 'zh': '德拉'},
        {'en': 'Dera Vandal', 'zh': '德拉破壞者'},
        {'en': 'Stahlta', 'zh': '鋼砲步槍'},
        {'en': 'Vaykor Sydon', 'zh': '勇氣惡龍'},
        {'en': 'Telos Boltor', 'zh': '終極螺釘步槍'},
        {'en': 'Telos Boltace', 'zh': '終極螺釘拐刃'},
        {'en': 'Velox', 'zh': '迅敏屠夫'},
        {'en': 'Xoris', 'zh': '索瑞斯'},
        {'en': 'Despair', 'zh': '絕望'},
        {'en': 'Pangolin Prime', 'zh': '鯪鯉劍Prime'},
        {'en': 'Destreza', 'zh': '技巧之劍'},
        {'en': 'Basmu', 'zh': '雙角蛇'},
        {'en': 'Ceti Lacera', 'zh': '刻帝悲痛之刃'},
        {'en': 'Destreza Prime', 'zh': '技巧之劍Prime'},
        {'en': 'Kuva Nukor', 'zh': '赤毒努寇微波槍'},
        {'en': 'Kuva Hind', 'zh': '赤毒雌鹿'},
        {'en': 'Kuva Bramma', 'zh': '赤毒布拉瑪'},
        {'en': 'Deth Machine Rifle', 'zh': '死亡機槍'},
        {'en': 'AkJagara', 'zh': '覺醒雙槍'},
        {'en': 'Detron', 'zh': '德特昂'},
        {'en': 'Detron Mara', 'zh': '苦痛德特昂'},
        {'en': 'Masseter', 'zh': '咀嚼金棒'},
        {'en': 'Aksomati Prime', 'zh': '輕靈月神雙槍Prime'},
        {'en': 'Quellor', 'zh': '鎮壓者'},
        {'en': 'Dex Dakra', 'zh': 'Dex達克拉雙劍'},
        {'en': 'Pennant', 'zh': '三角旗'},
        {'en': 'Dex Furis', 'zh': 'Dex盜賊雙槍'},
        {'en': 'Dex Sybaris', 'zh': 'Dex席芭莉絲'},
        {'en': 'Dragon Nikana', 'zh': '龍之侍刃'},
        {'en': 'Drakgoon', 'zh': '龍騎兵'},
        {'en': 'Dread', 'zh': '恐懼'},
        {'en': 'Vitrica', 'zh': '碎璃之劍'},
        {'en': 'Zakti Prime', 'zh': '毒芽Prime'},
        {'en': 'Guandao Prime', 'zh': '關刀Prime'},
        {'en': 'Dual Broncos', 'zh': '野馬雙槍'},
        {'en': 'Proboscis Cernos', 'zh': '攀吻西諾斯'},
        {'en': 'Pulmonars', 'zh': '伏魔之息'},
        {'en': 'Bubonico', 'zh': '疫囊毒砲'},
        {'en': 'Sporothrix', 'zh': '毒孢步槍'},
        {'en': 'Morgha', 'zh': '葬棺者'},
        {'en': 'Arum Spinosa', 'zh': '蘭膜星'},
        {'en': 'Ash', 'zh': 'Ash'},
        {'en': 'Ash Prime', 'zh': 'Ash Prime'},
        {'en': 'Atlas', 'zh': 'Atlas'},
        {'en': 'Atlas Prime', 'zh': 'Atlas Prime'},
        {'en': 'Banshee', 'zh': 'Banshee'},
        {'en': 'Banshee Prime', 'zh': 'Banshee Prime'},
        {'en': 'Baruuk', 'zh': 'Baruuk'},
        {'en': 'Chroma', 'zh': 'Chroma'},
        {'en': 'Chroma Prime', 'zh': 'Chroma Prime'},
        {'en': 'Ember', 'zh': 'Ember'},
        {'en': 'Ember Prime', 'zh': 'Ember Prime'},
        {'en': 'Equinox', 'zh': 'Equinox'},
        {'en': 'Equinox Prime', 'zh': 'Equinox Prime'},
        {'en': 'Excalibur', 'zh': 'Excalibur'},
        {'en': 'Excalibur Prime', 'zh': 'Excalibur Prime'},
        {'en': 'Excalibur Umbra', 'zh': 'Excalibur Umbra'},
        {'en': 'Frost', 'zh': 'Frost'},
        {'en': 'Frost Prime', 'zh': 'Frost Prime'},
        {'en': 'Gara', 'zh': 'Gara'},
        {'en': 'Garuda', 'zh': 'Garuda'},
        {'en': 'Gauss', 'zh': 'Gauss'},
        {'en': 'Grendel', 'zh': 'Grendel'},
        {'en': 'Harrow', 'zh': 'Harrow'},
        {'en': 'Hildryn', 'zh': 'Hildryn'},
        {'en': 'Hydroid', 'zh': 'Hydroid'},
        {'en': 'Hydroid Prime', 'zh': 'Hydroid Prime'},
        {'en': 'Inaros', 'zh': 'Inaros'},
        {'en': 'Ivara', 'zh': 'Ivara'},
        {'en': 'Ivara Prime', 'zh': 'Ivara Prime'},
        {'en': 'Khora', 'zh': 'Khora'},
        {'en': 'Limbo', 'zh': 'Limbo'},
        {'en': 'Limbo Prime', 'zh': 'Limbo Prime'},
        {'en': 'Loki', 'zh': 'Loki'},
        {'en': 'Loki Prime', 'zh': 'Loki Prime'},
        {'en': 'Mag', 'zh': 'Mag'},
        {'en': 'Mag Prime', 'zh': 'Mag Prime'},
        {'en': 'Mesa', 'zh': 'Mesa'},
        {'en': 'Mesa Prime', 'zh': 'Mesa Prime'},
        {'en': 'Mirage', 'zh': 'Mirage'},
        {'en': 'Mirage Prime', 'zh': 'Mirage Prime'},
        {'en': 'Nekros', 'zh': 'Nekros'},
        {'en': 'Nekros Prime', 'zh': 'Nekros Prime'},
        {'en': 'Nezha', 'zh': 'Nezha'},
        {'en': 'Nidus', 'zh': 'Nidus'},
        {'en': 'Nova', 'zh': 'Nova'},
        {'en': 'Nova Prime', 'zh': 'Nova Prime'},
        {'en': 'Nyx', 'zh': 'Nyx'},
        {'en': 'Nyx Prime', 'zh': 'Nyx Prime'},
        {'en': 'Oberon', 'zh': 'Oberon'},
        {'en': 'Oberon Prime', 'zh': 'Oberon Prime'},
        {'en': 'Octavia', 'zh': 'Octavia'},
        {'en': 'Revenant', 'zh': 'Revenant'},
        {'en': 'Rhino', 'zh': 'Rhino'},
        {'en': 'Rhino Prime', 'zh': 'Rhino Prime'},
        {'en': 'Saryn', 'zh': 'Saryn'},
        {'en': 'Saryn Prime', 'zh': 'Saryn Prime'},
        {'en': 'Titania', 'zh': 'Titania'},
        {'en': 'Trinity', 'zh': 'Trinity'},
        {'en': 'Trinity Prime', 'zh': 'Trinity Prime'},
        {'en': 'Valkyr', 'zh': 'Valkyr'},
        {'en': 'Valkyr Prime', 'zh': 'Valkyr Prime'},
        {'en': 'Vauban', 'zh': 'Vauban'},
        {'en': 'Vauban Prime', 'zh': 'Vauban Prime'},
        {'en': 'Volt', 'zh': 'Volt'},
        {'en': 'Volt Prime', 'zh': 'Volt Prime'},
        {'en': 'Wisp', 'zh': 'Wisp'},
        {'en': 'Wukong', 'zh': 'Wukong'},
        {'en': 'Wukong Prime', 'zh': 'Wukong Prime'},
        {'en': 'Zephyr', 'zh': 'Zephyr'},
        {'en': 'Zephyr Prime', 'zh': 'Zephyr Prime'},
        {'en': 'Xaku', 'zh': 'Xaku'},
        {'en': 'Nezha Prime', 'zh': 'Nezha Prime'},
        {'en': 'Amesha', 'zh': 'Amesha'},
        {'en': 'Elytron', 'zh': 'Elytron'},
        {'en': 'Itzal', 'zh': 'Itzal'},
        {'en': 'Odonata', 'zh': 'Odonata'},
        {'en': 'Odonata Prime', 'zh': 'Odonata Prime'},
        {'en': 'Dual Decurion', 'zh': '什長雙槍'},
        {'en': 'Fluctus', 'zh': '巨浪'},
        {'en': 'Grattler', 'zh': '葛拉特勒'},
        {'en': 'Imperator', 'zh': '凱旋將軍'},
        {'en': 'Imperator Vandal', 'zh': '凱旋將軍破壞者'},
        {'en': 'Kaszas', 'zh': '死亡使徒'},
        {'en': 'Knux', 'zh': '克納克斯'},
        {'en': 'Larkspur', 'zh': '翠雀'},
        {'en': 'Onorix', 'zh': '奧努里克斯'},
        {'en': 'Phaedra', 'zh': '菲德菈'},
        {'en': 'Prisma Veritux', 'zh': '棱晶真理巨劍'},
        {'en': 'Rathbone', 'zh': '拉斯波恩'},
        {'en': 'Velocitus', 'zh': '極速電磁步槍'},
        {'en': 'Veritux', 'zh': '真理巨劍'},
        {'en': 'Agkuza', 'zh': '馴象鉤刃'},
        {'en': 'Centaur', 'zh': '半人馬'},
        {'en': 'Corvas', 'zh': '黑鴉'},
        {'en': 'Cyngas', 'zh': '合成燃氣砲'},
        {'en': 'Cortege', 'zh': '頌葬者'},
        {'en': 'Mausolon', 'zh': '造陵者'},
        {'en': 'Balla', 'zh': '寶拉'},
        {'en': 'Cyath', 'zh': '西亞甚'},
        {'en': 'Dehtat', 'zh': '德塔特'},
        {'en': 'Dokrahm', 'zh': '多克拉姆'},
        {'en': 'Ekwana II Jai', 'zh': '伊克瓦納 II 翟'},
        {'en': 'Ekwana II Ruhang', 'zh': '伊克瓦納 II 如杭'},
        {'en': 'Ekwana Jai', 'zh': '伊克瓦納 翟'},
        {'en': 'Ekwana Jai II', 'zh': '伊克瓦納 翟 II'},
        {'en': 'Ekwana Ruhang II', 'zh': '伊克瓦納 如杭 II'},
        {'en': 'Ekwana Ruhang', 'zh': '伊克瓦納 如杭'},
        {'en': 'Jai', 'zh': '翟'},
        {'en': 'Jai II', 'zh': '翟 II'},
        {'en': 'Jayap', 'zh': '查亞普'},
        {'en': 'Korb', 'zh': '科布'},
        {'en': 'Kronsh', 'zh': '客隆什'},
        {'en': 'Kroostra', 'zh': '克魯斯查'},
        {'en': 'Kwath', 'zh': '庫阿斯'},
        {'en': 'Laka', 'zh': '拉卡'},
        {'en': 'Mewan', 'zh': '密丸'},
        {'en': 'Ooltha', 'zh': '烏爾薩'},
        {'en': 'Peye', 'zh': '佩耶'},
        {'en': 'Plague Akwin', 'zh': '瘟疫艾克文'},
        {'en': 'Plague Bokwin', 'zh': '瘟疫柏克文'},
        {'en': 'Plague Keewar', 'zh': '瘟疫奇沃'},
        {'en': 'Plague Kripath', 'zh': '瘟疫克里帕斯'},
        {'en': 'Rabvee', 'zh': '拉比威'},
        {'en': 'Ruhang', 'zh': '如杭'},
        {'en': 'Ruhang II', 'zh': '如杭 II'},
        {'en': 'Seekalla', 'zh': '斯卡拉'},
        {'en': 'Sepfahn', 'zh': '瑟普梵'},
        {'en': 'Shtung', 'zh': '石當'},
        {'en': 'Vargeet II Jai', 'zh': '瓦吉特 II 翟'},
        {'en': 'Vargeet II Ruhang', 'zh': '瓦吉特 II 如杭'},
        {'en': 'Vargeet Jai', 'zh': '瓦吉特 翟'},
        {'en': 'Vargeet Jai II', 'zh': '瓦吉特 翟 II'},
        {'en': 'Vargeet Ruhang', 'zh': '瓦吉特 如杭'},
        {'en': 'Vargeet Ruhang II', 'zh': '瓦吉特 如杭 II'},
        {'en': 'Lanzo', 'zh': '蘭佐魚叉'},
        {'en': 'Tulok', 'zh': '圖洛克魚叉'},
        {'en': 'Peram', 'zh': '佩拉姆魚叉'},
        {'en': 'Bashrack', 'zh': '狂虐'},
        {'en': 'Bellows', 'zh': '風箱'},
        {'en': 'Catchmoon', 'zh': '捕月'},
        {'en': 'Deepbreath', 'zh': '深息'},
        {'en': 'Flutterfire', 'zh': '激火'},
        {'en': 'Gaze', 'zh': '凝目'},
        {'en': 'Gibber', 'zh': '碎語'},
        {'en': 'Haymaker', 'zh': '重拳'},
        {'en': 'Killstream', 'zh': '斃流'},
        {'en': 'Lovetap', 'zh': '愛擊'},
        {'en': 'Ramble', 'zh': '遨遊'},
        {'en': 'Ramflare', 'zh': '激爆'},
        {'en': 'Rattleguts', 'zh': '響膽'},
        {'en': 'Slap', 'zh': '掌撼'},
        {'en': 'Slapneedle', 'zh': '拍針'},
        {'en': 'Spark', 'zh': '花火'},
        {'en': 'Splat', 'zh': '砸擊'},
        {'en': 'Stitch', 'zh': '穿紉'},
        {'en': 'Swiftfire', 'zh': '迅火'},
        {'en': 'Thunderdrum', 'zh': '雷鼓'},
        {'en': 'Tombfinger', 'zh': '墓指'},
        {'en': 'Zip', 'zh': '勁魄'},
        {'en': 'Zipfire', 'zh': '迅火'},
        {'en': 'Zipneedle', 'zh': '勁針'},
        {'en': 'Brash', 'zh': '暴獄'},
        {'en': 'Shrewd', 'zh': '精捷'},
        {'en': 'Steadyslam', 'zh': '固擊'},
        {'en': 'Tremor', 'zh': '顫動'},
        {'en': 'Shockprod', 'zh': '休克波魚叉'},
        {'en': 'Stunna', 'zh': '史鈍那魚叉'},
        {'en': 'Vermisplicer', 'zh': '接蟲'},
        {'en': 'Palmaris', 'zh': '掌骨'},
        {'en': 'Ulnaris', 'zh': '尺骨'},
        {'en': 'Arcroid', 'zh': '弦肌'},
        {'en': 'Thymoid', 'zh': '腺肌'},
        {'en': 'Marco Arcroid', 'zh': '巨宏弦肌'},
        {'en': 'Marco Thymoid', 'zh': '巨宏腺肌'},
        {'en': 'Bonewidow', 'zh': '骨寡婦'},
        {'en': 'Residual Viremia', 'zh': '殘餘毒血'},
        {'en': 'Residual Malodor', 'zh': '殘餘惡臭'},
        {'en': 'Residual Boils', 'zh': '殘餘癤瘤'},
        {'en': 'Residual Shock', 'zh': '殘餘電觸'},
        {'en': 'Theorem Contagion', 'zh': '定理觸染'},
        {'en': 'Theorem Demulcent', 'zh': '定理緩和'},
        {'en': 'Theorem Infection', 'zh': '定理感染'},
        {'en': 'Necramech', 'zh': '亡骸機甲'},
        {'en': 'Necralisk', 'zh': '亡骸殿'},
        {'en': 'Thaumic Distillate', 'zh': '精萃奇魔礦'},
        {'en': 'Scintillant', 'zh': '閃爍虛靈'},
        {'en': 'Pustulite', 'zh': '繫爪孢籽'},
        {'en': 'Ganglion', 'zh': '神經結節'},
        {'en': 'Spinal Core Section', 'zh': '脊髓核心剖面'},
        {'en': 'Lucent Teroglobe', 'zh': '發光源球'},
        {'en': 'Voidrig', 'zh': '虛空魂'},
        {'en': 'Sporelacer', 'zh': '攙孢'},
        {'en': 'Brief Respite', 'zh': '快速修整'},
        {'en': 'Empowered Blades', 'zh': '強化刀鋒'},
        {'en': 'Growing Power', 'zh': '成長之力'},
        {'en': 'Pistol Scavenger', 'zh': '手槍彈藥蒐集者'},
        {'en': 'Rifle Scavenger', 'zh': '步槍彈藥蒐集者'},
        {'en': 'Shotgun Scavenger', 'zh': '霰彈槍彈藥蒐集者'},
        {'en': 'Sniper Scavenger', 'zh': '狙擊槍彈藥蒐集者'},
        {'en': 'Sprint Boost', 'zh': '衝刺提升'},
        {'en': 'Mach Crash', 'zh': '馬赫猛擊'},
        {'en': 'Blending Talons', 'zh': '穿絞利爪'},
        {'en': 'Thrall Pact', 'zh': '奴役契約'},
        {'en': 'Critical Surge', 'zh': '毀滅湧流'},
        {'en': 'Abating Link', 'zh': '耗弱連結'},
        {'en': 'Accumulating Whipclaw', 'zh': '蓄積長鞭'},
        {'en': 'Adaptation', 'zh': '適應'},
        {'en': 'Assimilate', 'zh': '同化'},
        {'en': 'Beguiling Lantern', 'zh': '欺幻魔燈'},
        {'en': 'Blinding Reave', 'zh': '致盲掠奪'},
        {'en': 'Calm & Frenzy', 'zh': '冷靜與瘋狂'},
        {'en': 'Celestial Stomp', 'zh': '天聖踐踏'},
        {'en': 'Chilling Globe', 'zh': '冰封護罩'},
        {'en': 'Chromatic Blade', 'zh': '華彩刀劍'},
        {'en': 'Concentrated Arrow', 'zh': '集中箭矢'},
        {'en': 'Conductor', 'zh': '指揮家'},
        {'en': 'Counter Pulse', 'zh': '反轉脈衝'},
        {'en': 'Creeping Terrify', 'zh': '緩動驚駭'},
        {'en': 'Duality', 'zh': '二元性狀'},
        {'en': 'Empowered Quiver', 'zh': '強化箭袋'},
        {'en': 'Enveloping Cloud', 'zh': '包覆游雲'},
        {'en': 'Eternal War', 'zh': '永恆戰意'},
        {'en': 'Explosive Legerdemain', 'zh': '爆炸戲法'},
        {'en': 'Fatal Teleport', 'zh': '致命傳送'},
        {'en': 'Fleeting Expertise', 'zh': '彈指瞬技'},
        {'en': 'Funnel Clouds', 'zh': '漏斗狀雲'},
        {'en': 'Greedy Pull', 'zh': '貪婪吸引'},
        {'en': 'Hall of Malevolence', 'zh': '惡怨殿堂'},
        {'en': 'Hysterical Assault', 'zh': '狂化突擊'},
        {'en': 'Ice Wave Impedance', 'zh': '滯痕冰浪'},
        {'en': 'Icy Avalanche', 'zh': '冰冷雪崩'},
        {'en': 'Infiltrate', 'zh': '滲透'},
        {'en': 'Insatiable', 'zh': '不竭貪婪'},
        {'en': 'Larva Burst', 'zh': '幼體爆發'},
        {'en': 'Lasting Covenant', 'zh': '持久聖約'},
        {'en': 'Magnetized Discharge', 'zh': '磁吸釋放'},
        {'en': 'Mending Splinters', 'zh': '治癒玻片'},
        {'en': "Mesa's Waltz", 'zh': 'Mesa的華爾茲'},
        {'en': 'Mind Freak', 'zh': '精神狂怒'},
        {'en': 'Narrow Minded', 'zh': '心志偏狹'},
        {'en': 'Negation Swarm', 'zh': '抵消蟲群'},
        {'en': 'Ore Gaze', 'zh': '礦石凝視'},
        {'en': 'Partitioned Mallet', 'zh': '分裂鎚音'},
        {'en': 'Path of Statues', 'zh': '化像之道'},
        {'en': 'Peaceful Provocation', 'zh': '和平挑釁'},
        {'en': 'Peculiar Bloom', 'zh': '花開怪奇'},
        {'en': 'Peculiar Growth', 'zh': '生長怪奇'},
        {'en': 'Phoenix Renewal', 'zh': '鳳凰新生'},
        {'en': 'Piercing Navigator', 'zh': '穿刺拋體'},
        {'en': 'Piercing Roar', 'zh': '刺骨戰吼'},
        {'en': 'Pilfering Strangledome', 'zh': '貪奪穹頂'},
        {'en': 'Pilfering Swarm', 'zh': '貪奪觸角'},
        {'en': 'Power Donation', 'zh': '獻出力量'},
        {'en': 'Primal Rage', 'zh': '原始暴怒'},
        {'en': 'Prolonged Paralysis', 'zh': '長時癱瘓'},
        {'en': 'Pyroclastic Flow', 'zh': '火成碎流'},
        {'en': 'Radiant Finish', 'zh': '終結閃光'},
        {'en': 'Razorwing Blitz', 'zh': '剃刀之翼的閃擊'},
        {'en': 'Redirection', 'zh': '蓄能重劃'},
        {'en': 'Reinforcing Stomp', 'zh': '踐踏加固'},
        {'en': 'Repelling Bastille', 'zh': '驅逐力場'},
        {'en': 'Resonating Quake', 'zh': '震地共鳴'},
        {'en': 'Rising Storm', 'zh': '風起雲湧'},
        {'en': 'Rolling Guard', 'zh': '翻滾防護'},
        {'en': 'Safeguard', 'zh': '火綾守護'},
        {'en': 'Savage Silence', 'zh': '殘酷無息'},
        {'en': 'Seeking Shuriken', 'zh': '削甲手裡劍'},
        {'en': 'Shield of Shadows', 'zh': '幽影之護'},
        {'en': 'Shock Trooper', 'zh': '電擊震盪'},
        {'en': 'Shocking Speed', 'zh': '電擊加速'},
        {'en': 'Smite Infusion', 'zh': '懲擊洗禮'},
        {'en': 'Sonic Fracture', 'zh': '破碎聲波'},
        {'en': 'Spectrosiphon', 'zh': '光譜虹吸'},
        {'en': 'Swing Line', 'zh': '擺盪鉤索'},
        {'en': 'Target Fixation', 'zh': '目標入定'},
        {'en': 'Tectonic Fracture', 'zh': '構造裂縫'},
        {'en': 'Teeming Virulence', 'zh': '猛爆致病'},
        {'en': 'Titanic Rumbler', 'zh': '巨大石者'},
        {'en': 'Transistor Shield', 'zh': '電控護盾'},
        {'en': 'Vampire Leech', 'zh': '汲能榨取'},
        {'en': 'Venari Bodyguard', 'zh': '薇娜麗的護衛'},
        {'en': 'Vigorous Swap', 'zh': '強力切換'},
        {'en': 'Warding Thurible', 'zh': '庇護焚爐'},
        {'en': 'Ammo Stock', 'zh': '霰彈擴充'},
        {'en': 'Argon Scope', 'zh': '氬晶瞄具'},
        {'en': 'Bane of Corpus', 'zh': '滅亡Corpus'},
        {'en': 'Bane of Grineer', 'zh': '滅亡Grineer'},
        {'en': 'Bane of Infested', 'zh': '滅亡Infested'},
        {'en': 'Charged Chamber', 'zh': '蓄力裝填'},
        {'en': 'Chilling Reload', 'zh': '激冷裝填'},
        {'en': 'Cleanse Corpus', 'zh': '淨化Corpus'},
        {'en': 'Cleanse Grineer', 'zh': '淨化Grineer'},
        {'en': 'Cleanse Infested', 'zh': '淨化Infested'},
        {'en': 'Fanged Fusillade', 'zh': '尖牙連射'},
        {'en': 'Fast Hands', 'zh': '爆發裝填'},
        {'en': 'Flux Overdrive', 'zh': '通量射線步槍超載'},
        {'en': 'Guided Ordinance', 'zh': '槍火引導'},
        {'en': 'Hawk Eye', 'zh': '隼目'},
        {'en': 'Infected Clip', 'zh': '污染彈匣'},
        {'en': 'Kinetic Ricochet', 'zh': '動力回彈'},
        {'en': 'Laser Sight', 'zh': '雷射瞄具'},
        {'en': 'Magazine Warp', 'zh': '彈匣增幅'},
        {'en': 'Nano-Applicator', 'zh': '奈米塗覆'},
        {'en': 'Piercing Hit', 'zh': '穿甲傷害'},
        {'en': 'Repeater Clip', 'zh': '轉輪彈匣'},
        {'en': 'Seeking Force', 'zh': '穿透力'},
        {'en': 'Shotgun Savvy', 'zh': '通宵霰彈槍'},
        {'en': 'Shotgun Spazz', 'zh': '霰彈速射'},
        {'en': 'Spring-Loaded Chamber', 'zh': '簧壓膛室'},
        {'en': 'Target Acquired', 'zh': '鎖定目標'},
        {'en': 'Tether Grenades', 'zh': '繫繩榴彈'},
        {'en': 'Anemic Agility', 'zh': '乏能迅敏'},
        {'en': 'Concussion Rounds', 'zh': '震盪彈頭'},
        {'en': 'Expel Corpus', 'zh': '驅逐Corpus'},
        {'en': 'Expel Grineer', 'zh': '驅逐Grineer'},
        {'en': 'Expel Infested', 'zh': '驅逐Infested'},
        {'en': 'Ice Storm', 'zh': '冰風暴'},
        {'en': 'Lethal Momentum', 'zh': '致命動量'},
        {'en': 'Pathogen Rounds', 'zh': '病原彈頭'},
        {'en': 'Pressurized Magazine', 'zh': '增壓彈匣'},
        {'en': 'Quickdraw', 'zh': '持續火力'},
        {'en': 'Ruinous Extension', 'zh': '毀滅擴展'},
        {'en': 'Scorch', 'zh': '灼痕焦點'},
        {'en': 'Seeker', 'zh': '彈頭導引'},
        {'en': 'Slip Magazine', 'zh': '串連彈匣'},
        {'en': 'Steady Hands', 'zh': '穩定槍手'},
        {'en': 'Stunning Speed', 'zh': '懾人神速'},
        {'en': 'Sure Shot', 'zh': '準確射手'},
        {'en': 'Targeting Subsystem', 'zh': '定位輔助'},
        {'en': 'Trick Mag', 'zh': '戲法增幅'},
        {'en': 'Volatile Rebound', 'zh': '易爆反彈'},
        {'en': 'Volatile Quick Return', 'zh': '易爆即返'},
        {'en': 'Atlantis Vulcan', 'zh': '深遠之火'},
        {'en': 'Auger Strike', 'zh': '螺鑽打擊'},
        {'en': 'Blind Justice', 'zh': '無明制裁'},
        {'en': 'Blood Rush', 'zh': '急進猛突'},
        {'en': 'Body Count', 'zh': '殺傷計數'},
        {'en': 'Bullet Dance', 'zh': '刀鋒彈舞'},
        {'en': 'Collision Force', 'zh': '衝擊巨力'},
        {'en': 'Condition Overload', 'zh': '異況超量'},
        {'en': 'Crushing Ruin', 'zh': '月落鳥啼'},
        {'en': 'Defiled Snapdragon', 'zh': '積穢驍龍'},
        {'en': 'Drifting Contact', 'zh': '漂移接觸'},
        {'en': 'Eleventh Storm', 'zh': '終焉風暴'},
        {'en': 'Enduring Affliction', 'zh': '長時苦難'},
        {'en': 'Enduring Strike', 'zh': '不朽打擊'},
        {'en': 'Fever Strike', 'zh': '熱病打擊'},
        {'en': 'Focused Defense', 'zh': '重點防禦'},
        {'en': "Gaia's Tragedy", 'zh': '母神悲歌'},
        {'en': 'Gnashing Payara', 'zh': '狼魚咬咬'},
        {'en': 'Guardian Derision', 'zh': '奚落守護'},
        {'en': 'Healing Return', 'zh': '治癒歸復'},
        {'en': 'High Noon', 'zh': '日正當中'},
        {'en': 'Homing Fang', 'zh': '連牙追襲'},
        {'en': "Hunter's Bonesaw", 'zh': '獵人骨鋸'},
        {'en': 'Lasting Sting', 'zh': '未完之刺'},
        {'en': 'Maiming Strike', 'zh': '致殘突擊'},
        {'en': 'Melee Prowess', 'zh': '非凡技巧'},
        {'en': 'Relentless Combination', 'zh': '殘酷組合'},
        {'en': 'Smite Corpus', 'zh': '毀滅Corpus'},
        {'en': 'Smite Grineer', 'zh': '毀滅Grineer'},
        {'en': 'Smite Infested', 'zh': '毀滅Infested'},
        {'en': 'Sovereign Outcast', 'zh': '至尊浪人'},
        {'en': 'Spinning Needle', 'zh': '旋壓刺針'},
        {'en': 'Vengeful Revenant', 'zh': '復仇亡靈'},
        {'en': 'Vermillion Storm', 'zh': '朱紅暴風'},
        {'en': 'Vulcan Blitz', 'zh': '火神閃擊'},
        {'en': 'Weeping Wounds', 'zh': '創口潰爛'},
        {'en': 'Afterburner', 'zh': '加力燃燒'},
        {'en': 'Astral Autopsy', 'zh': '星體解析'},
        {'en': 'Astral Slash', 'zh': '星體切砍'},
        {'en': 'Cold Snap', 'zh': '寒流來襲'},
        {'en': 'Comet Blast', 'zh': '彗星爆發'},
        {'en': 'Cutting Edge', 'zh': '切割刃緣'},
        {'en': 'Hollowed Bullets', 'zh': '中空子彈'},
        {'en': 'Magazine Extension', 'zh': '擴充彈匣'},
        {'en': 'Morphic Transformer', 'zh': '非晶變壓器'},
        {'en': 'Nebula Bore', 'zh': '星雲鑽孔'},
        {'en': 'Quasar Drill', 'zh': '類星鑽體'},
        {'en': 'Rubedo-Lined Barrel', 'zh': '紅晶槍管'},
        {'en': 'System Reroute', 'zh': '系統重劃'},
        {'en': 'Tempered Blade', 'zh': '強化刀片'},
        {'en': 'Zodiac Shred', 'zh': '黃道碎裂'},
        {'en': 'Aero Agility', 'zh': '空飛靈巧'},
        {'en': 'Aero Periphery', 'zh': '空飛邊際'},
        {'en': 'Aero Vantage', 'zh': '空飛俯瞰'},
        {'en': 'Augur Accord', 'zh': '預言協約'},
        {'en': 'Augur Message', 'zh': '預言啟示'},
        {'en': 'Augur Pact', 'zh': '預言契約'},
        {'en': 'Augur Reach', 'zh': '預言通靈'},
        {'en': 'Augur Secrets', 'zh': '預言神密'},
        {'en': 'Augur Seeker', 'zh': '預言探求'},
        {'en': 'Gladiator Aegis', 'zh': '角鬥士聖盾'},
        {'en': 'Gladiator Finesse', 'zh': '角鬥士靈巧'},
        {'en': 'Gladiator Might', 'zh': '角鬥士威猛'},
        {'en': 'Gladiator Resolve', 'zh': '角鬥士決心'},
        {'en': 'Gladiator Rush', 'zh': '角鬥士猛突'},
        {'en': 'Gladiator Vice', 'zh': '角鬥士箝制'},
        {'en': 'Hunter Adrenaline', 'zh': '獵者腎上腺素'},
        {'en': 'Hunter Command', 'zh': '獵者命令'},
        {'en': 'Hunter Munitions', 'zh': '獵者戰備'},
        {'en': 'Hunter Recovery', 'zh': '獵者復元'},
        {'en': 'Hunter Synergy', 'zh': '獵者協力'},
        {'en': 'Hunter Track', 'zh': '獵者追蹤'},
        {'en': 'Mecha Empowered', 'zh': '機甲強化'},
        {'en': 'Mecha Overdrive', 'zh': '機甲超載'},
        {'en': 'Mecha Pulse', 'zh': '機甲脈衝'},
        {'en': 'Mecha Recharge', 'zh': '機甲充能'},
        {'en': 'Motus Impact', 'zh': '躍動衝擊'},
        {'en': 'Motus Setup', 'zh': '躍動設局'},
        {'en': 'Motus Signal', 'zh': '躍動信號'},
        {'en': 'Proton Jet', 'zh': '質子噴射'},
        {'en': 'Proton Pulse', 'zh': '質子脈衝'},
        {'en': 'Proton Snap', 'zh': '質子吸附'},
        {'en': 'Strain Consume', 'zh': '菌株吸收'},
        {'en': 'Strain Eruption', 'zh': '菌株爆裂'},
        {'en': 'Strain Fever', 'zh': '菌株病毒'},
        {'en': 'Strain Infection', 'zh': '菌株感染'},
        {'en': 'Synth Charge', 'zh': '合成充能'},
        {'en': 'Synth Deconstruct', 'zh': '合成解構'},
        {'en': 'Synth Fiber', 'zh': '合成纖維'},
        {'en': 'Synth Reflex', 'zh': '合成反射'},
        {'en': 'Tek Assault', 'zh': '技法猛襲'},
        {'en': 'Tek Collateral', 'zh': '技法連帶'},
        {'en': 'Tek Enhance', 'zh': '技法強化'},
        {'en': 'Tek Gravity', 'zh': '技法引力'},
        {'en': 'Vigilante Armaments', 'zh': '私法軍備'},
        {'en': 'Vigilante Fervor', 'zh': '私法熱誠'},
        {'en': 'Vigilante Offense', 'zh': '私法侵犯'},
        {'en': 'Vigilante Pursuit', 'zh': '私法追求'},
        {'en': 'Vigilante Supplies', 'zh': '私法補給'},
        {'en': 'Vigilante Vigor', 'zh': '私法活力'},
        {'en': 'Necramech Continuity', 'zh': '亡骸機甲 持久力'},
        {'en': 'Necramech Vitality', 'zh': '亡骸機甲 生命力'},
        {'en': 'Necramech Steel Fiber', 'zh': '亡骸機甲 鋼鐵纖維'},
        {'en': 'Necramech Intensify', 'zh': '亡骸機甲 聚精會神'},
        {'en': 'Necramech Pressure Point', 'zh': '亡骸機甲 壓迫點'},
        {'en': 'Necramech Streamline', 'zh': '亡骸機甲 簡化'},
        {'en': 'Necramech Reach', 'zh': '亡骸機甲 劍風'},
        {'en': 'Necramech Deflection', 'zh': '亡骸機甲 蓄能重劃'},
        {'en': 'Necramech Slipstream', 'zh': '亡骸機甲 氣流動'},
        {'en': 'Necramech Seismic Wave', 'zh': '亡骸機甲 震波'},
        {'en': 'Necramech Refuel', 'zh': '亡骸機甲 燃料補給'},
        {'en': 'Necramech Thrusters', 'zh': '亡骸機甲 推進器'},
    ];

    // ===== 樣式 =====
    const style = document.createElement('style');
    style.textContent = `
    #wf-dict-panel {
        position: fixed;
        top: 80px;
        left: 0;
        width: 340px;
        background: rgba(30,30,30,0.98);
        color: #fff;
        z-index: 99999;
        padding: 16px 12px 12px 12px;
        border-radius: 0 8px 8px 0;
        box-shadow: 2px 2px 8px #0008;
        font-size: 15px;
        font-family: sans-serif;
        transition: transform 0.5s cubic-bezier(.4,0,.6,1), opacity 0.5s;
        transform: translateX(0);
        opacity: 1;
    }
    #wf-dict-panel.hide {
        transform: translateX(-340px);
        opacity: 0.2;
    }
    #wf-dict-toggle {
        position: fixed;
        top: 88px;
        left: 320px;
        z-index: 100000;
        background: #222;
        color: #ffd700;
        border: none;
        border-radius: 0 8px 8px 0;
        padding: 4px 8px;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 2px 2px 8px #0008;
        transition: left 0.5s cubic-bezier(.4,0,.6,1);
        outline: none;
    }
    #wf-dict-toggle:focus {
        outline: none !important;
        box-shadow: none !important;
    }
    #wf-dict-toggle-icon {
        display: inline-block;
        transition: transform 0.5s;
    }
    #wf-dict-panel .wf-dict-title {
        font-weight: bold;
        font-size: 18px;
        margin-bottom: 8px;
    }
    #wf-dict-input {
        width: 95%;
        padding: 6px;
        border-radius: 4px;
        border: 1px solid #888;
        margin-bottom: 8px;
        font-size: 15px;
        background: #181818;
        color: #fff;
    }
    #wf-dict-result {
        max-height: 300px;
        overflow: auto;
        background: #222;
        padding: 6px;
        border-radius: 4px;
    }
    #wf-dict-panel .wf-dict-tip {
        font-size: 12px;
        color: #aaa;
        margin-top: 6px;
    }
    .wf-dict-item {
        padding: 4px 0;
        cursor: pointer;
        border-bottom: 1px solid #333;
        user-select: none;
    }
    .wf-dict-item span:first-child {
        color: #ffd700;
    }
    .wf-dict-item span:last-child {
        float: right;
        color: #8cf;
    }
    .wf-dict-noresult {
        color: #f88;
        padding: 8px 0;
        text-align: center;
        font-size: 15px;
    }
    #wf-dict-toast {
        position: fixed;
        top: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(30,30,30,0.98);
        color: #ffd700;
        padding: 10px 28px;
        border-radius: 6px;
        font-size: 16px;
        z-index: 100001;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.4s;
        box-shadow: 0 2px 12px #0008;
    }
    #wf-dict-toast.show {
        opacity: 1;
        pointer-events: auto;
    }
    `;
    document.head.appendChild(style);

    // ===== DOM 元素建立 =====
    // 查詢面板
    const panel = document.createElement('div');
    panel.id = 'wf-dict-panel';
    panel.innerHTML = `
        <div class="wf-dict-title">Warframe 中英對照查詢</div>
        <input id="wf-dict-input" type="text" placeholder="輸入中文或英文">
        <div id="wf-dict-result"></div>
        <div class="wf-dict-tip">點擊結果可複製英文名稱</div>
    `;
    document.body.appendChild(panel);

    // 顯示/隱藏按鈕
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'wf-dict-toggle';
    toggleBtn.title = '隱藏面板';
    toggleBtn.innerHTML = '<span id="wf-dict-toggle-icon">⯇</span>';
    document.body.appendChild(toggleBtn);

    // Toast 訊息框
    const toast = document.createElement('div');
    toast.id = 'wf-dict-toast';
    document.body.appendChild(toast);

    // ===== 功能函式 =====

    // 查詢
    function searchDict(keyword) {
        keyword = keyword.trim();
        if (!keyword) return [];
        const lower = keyword.toLowerCase();
        return translationData.filter(item =>
            item.zh.includes(keyword) ||
            item.en.toLowerCase().includes(lower)
        );
    }

    // 顯示查詢結果
    function renderResult(list) {
        const resultDiv = document.getElementById('wf-dict-result');
        if (list.length === 0) {
            resultDiv.innerHTML = '<div class="wf-dict-noresult">無結果</div>';
            return;
        }
        resultDiv.innerHTML = list.map(item =>
            `<div class="wf-dict-item" data-en="${item.en}">
                <span>${item.zh}</span>
                <span>${item.en}</span>
            </div>`
        ).join('');
        // 綁定點擊事件
        Array.from(resultDiv.querySelectorAll('.wf-dict-item')).forEach(div => {
            div.onclick = () => copyToClipboard(div.getAttribute('data-en'));
        });
    }

    // 複製到剪貼簿
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('已複製到剪貼簿: ' + text);
        });
    }

    // 顯示 toast 訊息
    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(showToast._timer);
        showToast._timer = setTimeout(() => {
            toast.classList.remove('show');
        }, 1500);
    }

    // 切換面板顯示/隱藏
    function togglePanel() {
        const icon = document.getElementById('wf-dict-toggle-icon');
        if (panelVisible) {
            panel.classList.add('hide');
            toggleBtn.style.left = '0';
            icon.textContent = '⯈';
            icon.style.transform = 'rotate(0deg)';
            toggleBtn.title = '顯示面板';
            panelVisible = false;
        } else {
            panel.classList.remove('hide');
            toggleBtn.style.left = '320px';
            icon.textContent = '⯇';
            icon.style.transform = 'rotate(0deg)';
            toggleBtn.title = '隱藏面板';
            panelVisible = true;
        }
    }

    // ===== 事件繫結 =====
    let panelVisible = true;
    toggleBtn.addEventListener('click', togglePanel);

    document.getElementById('wf-dict-input').addEventListener('input', function() {
        const kw = this.value;
        const result = searchDict(kw);
        renderResult(result);
    });

    // ===== 預設狀態 =====
    renderResult([]);

})();