// ==UserScript==
// @name         Check CSGO Souvenir's signature
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取CSGO纪念品皮肤或箱子的签名者的游戏ID,仅适用于steam语言设置为中文
// @author       masazumi
// @match        https://steamcommunity.com/market/listings/730/*Souvenir*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374585/Check%20CSGO%20Souvenir%27s%20signature.user.js
// @updateURL https://update.greasyfork.org/scripts/374585/Check%20CSGO%20Souvenir%27s%20signature.meta.js
// ==/UserScript==

/* https://steamcommunity.com/market/search?appid=730
tags = g_rgFilterData["730_ProPlayer"].tags;
keys = Object.keys(tags);
name2id = {};
for (let i = 0; i < keys.length; i++) {
	game_id = tags[keys[i]].localized_name.split("（")[0];
	name = tags[keys[i]].localized_name.split("（")[1].replace("）", "");
	name2id[name] = game_id;
}
*/

name2id = {"Aaron Ward":"AZR","Abay Khassenov":"Hobbit","Abraham Fazli":"abE","Adam Friberg":"friberg","Adil Benrlitom":"ScreaM","Ahmet Karahoca":"paz","Aidyn Turlybekov":"KrizzeN","Aleksi Jalli":"allu","Alexandre Forté":"xms","Alexandre Pianaro":"bodyy","Alexey Golubev":"qikert","Ali Dzhami":"Jame","Andreas Højsleth":"Xyp9x","Andreas Lindberg":"znajder","Andrew Heintz":"Professor_Chaos","Andrey Gorodenskiy":"B1ad3","Anton Kolesnikov":"tonyblack","Arya Hekmat":"arya","Aurimas Kvakšys":"Kvik","Bai Kunhua":"LoveYY","Bartosz Wolny":"Hyper","Bektiyar Bakhytov":"fitch","Bence Borocz":"DeadFox","Björn Pers":"THREAT","Bradley Fodor":"ANDROID","Bruno Lima":"BIT","Bugra Arkın":"Calyx","Cai Yulun":"Summer","Can Dortkardes":"XANTARES","Casper Møller":"cadiaN","Chad Burchill":"SPUNJ","Chris Rowlands":"emagine","Chris de Jong":"chrisJ","Christian Garcia Antoran":"loWel","Christophe Xia":"SIXER","Christopher Alesund":"GeT_RiGhT","Cédric Guipouy":"RpK","Damian Kislowski":"Furlan","Damian Steele":"daps","Dan Madesclaire":"apEX","Daniel Kim":"vice","Danylo Teslenko":"Zeus","Dauren Kystaubayev":"AdreN","David Dobrosavljevic":"devoduvek","David Stafford":"DAVEY","Denis Howell":"denis","Denis Kostin":"seized","Denis Sharipov":"electronic","Dennis Edman":"dennis","Dmitrii Forostianko":"S0tF1k","Dmitriy Bandurka":"Dima","Dmitriy Matviyenko":"dimasick","Dmitry Bogdanov":"hooch","Dmytro Chervak":"jR","Dominik Swiderski":"GruBy","Edouard Dubourdeaux":"SmithZz","Egor Vasilyev":"flamie","Emil Hoffmann Reif":"Magisk","Engin Kor":"ngiN","Engin Kupeli":"MAJ3R","Eric Hoag":"adreN","Fabien Fiey":"kioShiMa","Faruk Pita":"pita","Fatih Dayik":"gob b","Fernando Alvarenga":"fer","Filip Kubski":"NEO","Finn Andersen":"karrigan","Francois Delaunay":"AmaNEk","Fredrik Sterner":"REZ","Gabriel Toledo":"FalleN","Georgy Yaskin":"WorldEdit","Grigorii Oleinik":"balblna","Hansel Ferdinand":"BnTeT","Haowen Xu":"somebody","Henrique Teles Ferreira da Fonseca":"HEN1","Hui Wu":"DD","Hunter Mims":"SicK","Håvard Nygaard":"rain","Iain Turner":"SnypeR","Ihor Shevchenko":"crush","Ioann Sukhariev":"Edward","Issa Murad":"ISSAA","Ivan Obrezhan":"spaze","Jaccob Whiteaker":"yay","Jacky Yip":"Stewie2K","Jacob Medina":"FugLy","Jacob Mourujärvi":"pyth","Jacob Winneche":"Pimp","Jakob Hansen":"JUGi","James Cobb":"hazed","James Quinn":"James","Jan Peter Rahkonen":"wayLander","Janusz Pogorzelski":"Snax","Jarosław Jarząbkowski":"pashaBiceps","Jason Ruchelski":"jasonR","Jesper Mikalski":"tenzki","Jesper Wecksell":"JW","Jesse Linjala":"zehN","Joakim Gidetun":"disco doplan","Joakim Myrbostad":"jkaem","Joao Vasconcellos Cabral":"felps","Johannes Maget":"nex","Johannes Wodarz":"tabseN","Jonas Olofsson":"Lekr0","Jonathan Jablonowski":"EliGE","Jordan Gilbert":"n0thing","Joshua Marzano":"jdm64","Justin Savage":"jks","Karlo Pivac":"USTILO","Karol Rodowicz":"rallen","Ke Liu":"captainMo","Keith Markovic":"NAF","Kenneth Suen":"koosta","Kenny Schrub":"kennyS","Kevin Susanto":"xccurate","Kevin  Susanto":"xccurate","Kevin Amend":"kRYSTAL","Kevin Bartholomäus":"keev","Kevin Tarn":"HS","Khong Weng Keong":"Kaze","Kirill Mikhailov":"Boombl4","Kristian Wienecke":"k0nfig","Kyrylo Karasov":"ANGE1","Kévin Droolans":"Ex6TenZ","Ladislav Kovács":"GuardiaN","Lars Freddy Johansson":"KRIMZ","Leonid Vishnyakov":"chopper","Lincoln Lau":"fnx","Lucas Lopes":"steel","Lucas Teles Ferreira da Fonseca":"LUCAS1","Lukas Rossander":"gla1ve","Luke Paton":"Havoc","Maikil Selim":"Golden","Marcelo David":"coldzera","Marco Pfeiffer":"Snappi","Markus Kjærbye":"Kjaerbye","Markus Wallsten":"pronax","Martin Styk":"STYKO","Mathias Sommer Lauridsen":"MSL","Mathieu Quiquerez":"Maniac","Michael Grzesiek":"shroud","Michal Muller":"MICHU","Michał Rudzki":"snatchie","Miikka Kemppi":"suNny","Mikail Bill":"Maikelele","Mikhail Stoliarov":"Dosia","Nathan Schmitt":"NBK-","Nicholas Cannella":"nitr0","Nicklas Gade":"gade","Nicolai Reedtz":"device","Nikita Matveev":"waterfaLLZ","Nikola Kovač":"NiKo","Nikola Ninic":"LEGIJA","Nikolai Bitiukov":"mir","Nikolaj Kristensen":"niko","Noah Francis":"Nifty","Oleksandr Hordieiev":"Shara","Oleksandr Kostyliev":"s1mple","Olof Kajbjer":"olofmeister","Oscar Cañellas":"mixwell","Owen Butterfield":"smooya","Patrik Lindberg":"f0rest","Patrik Zudel":"Zero","Pavel Lashkov":"hutji","Pavlo Veklenko":"COLDYY1","Pawel Bielinsky":"byali","Paweł Mocek":"innocent","Peter Jarguz":"stanislaw","Peter Rasmussen":"dupreeh","Philip Aistrup Larsen":"aizy","Piotr Ćwikliński":"peet","Pujan Mehta":"FNS","René Borg":"cajunb","Ricardo Mulholland":"Rickeh","Ricardo Pacheco":"fox","Ricardo Prass":"boltz","Richard Landström":"Xizt","Richard Papillon":"shox","Robin Kool":"ropz","Robin Rönnquist":"flusha","Rory Jackson":"dephh","Ruben Villarroel":"RUBINO","Russel Van Dulken":"Twistzz","Rustem Telepov":"mou","Ryan Abadir":"freakazoid","Savelii Bragin":"jmqa","Sean Gares":"seang@res","Sergey Nikishin":"keshandr","Shahzeeb Khan":"ShahZaM","Sheng Yuanzhang":"Attacker","Simon Eliasson":"Twist","Spencer Martin":"Hiko","Steven Cutler":"reltuC","Su Qifang":"Karsa","Tacio Filho":"TACO","Tarik Celik":"tarik","Timo Richter":"Spiidi","Timothy Ta":"autimatic","Timothée Démolon":"DEVIL","Timur Tulepov":"buster","Tizian Feldbusch":"tiziaN","Tomas Stastny":"oskar","Tyler Latham":"Skadoodle","Vadim Vasilyev":"DavCost","Valdemar Bjørn Vangså":"v4lde","Viktor Orudzhev":"sdy","Vincent Cervoni":"Happy","Vito Giuseppe Agostinelli":"kNgV-","Vladyslav Nechyporchuk":"bondik","Wiktor Wojtas":"TaZ","William Sundin":"draken","William Wierzba":"RUSH","Yaman Ergenekon":"yam","Yegor Markelov":"markeloff","Özgür Eker":"woxic"};
function c() {
    keys = Object.keys(g_rgAssets[730][2]);
    for(let i = 0; i < keys.length; i++) {
        try {
            try {
                // 箱子
                name = g_rgAssets[730][2][keys[i]].descriptions[2].value.split("手 ")[1].split(" 亲")[0];
            } catch(error) {
                // 枪
                name = g_rgAssets[730][2][keys[i]].descriptions[4].value.split("手 ")[1].split(" 亲")[0];
            }
        } catch(error) {
            // 无人签名
            continue;
        }
        console.log(name);
        let info_node = document.createElement("span");
        info_node.style = "color:red";
        info_node.innerText = name2id[name];
        try {
            document.getElementById("searchResultsRows").childNodes[2*i+3].childNodes[7].childNodes[1].appendChild(info_node);
        } catch(error) {
            document.getElementById("searchResultsRows").childNodes[2*i+2].childNodes[7].childNodes[1].appendChild(info_node);
        }
    }
}

button_node = document.createElement("a");
button_node.onclick = c;
button_node.innerText = "听话，让我看看";
button_node.setAttribute("class", "btn_green_white_innerfade btn_medium market_noncommodity_buyorder_button");
button_node.style = "line-height: 30px;font-size: 15px;width:120px;text-align:center";
document.getElementById("market_buyorder_info").childNodes[1].childNodes[1].appendChild(button_node);