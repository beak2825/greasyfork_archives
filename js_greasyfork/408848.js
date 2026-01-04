// ==UserScript==
// @name         AO3: [Wrangling] Rhine's Home Filter Fork
// @description  A fork of kaerstyne's Wrangling Home Filter Redux
//               to filter by franchise as well as shared/solo unwrangled bins
//               THIS GETS UPDATED AS I PICK UP/DROP FANDOMS, PLS FORK AND EDIT FOR YOUR OWN VERSION
// @version      1.2.19

// @author       Rhine
// @namespace    https://greasyfork.org/en/users/676543-rhine
// @license      GPL-3.0 <https://www.gnu.org/licenses/gpl.html>

// @match        *://*.archiveofourown.org/tag_wranglers/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408848/AO3%3A%20%5BWrangling%5D%20Rhine%27s%20Home%20Filter%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/408848/AO3%3A%20%5BWrangling%5D%20Rhine%27s%20Home%20Filter%20Fork.meta.js
// ==/UserScript==


// SETTINGS //

// Define which of your fandom tags go to which franchise, and which are cowrangled.
// Increase or decrease the number of franchises as needed.
// Every section that needs to be EDITed to adjust for your fandoms/franchises
// will have a leading comment that says EDIT.
// Put each fandom on a separate line.
// Use the EXACT NAME of the fandom as it appears on your wrangling page.

var franchise1 = `
Arkham Asylum (Comics)
Arkham Manor (Comics)
Azrael: Agent of the Bat (Comics)
Batman - All Media Types
Batman Incorporated (Comics)
Batman Ninja (2018)
Batman vs. Robin (2015)
Batman: Arkham - All Media Types
Batman: Arkham Knight Genesis (Comics)
Batman: Arkham Unhinged (Comics)
Batman: Assault On Arkham
Batman: Bad Blood (2016)
Batman: Damned (Comics 2018)
Batman: Death in the Family (Movie 2020)
Batman: Gotham by Gaslight (2018)
Batman: Gotham Knights (Comics 2000)
Batman: Hush (2019)
Batman: Streets of Gotham (Comics)
Batman: The Killing Joke (2016)
Batman: The Killing Joke (Comics)
Batwing (Comics)
Batwoman (Comics)
Gotham by Midnight (Comics)
Gotham Knights (Video Game 2021)
LEGO Batman (Video Games)
The LEGO Batman Movie (2017)
Red Hood: The Fan Series (Web Series 2018)
Robin War (Comics)
Son of Batman (2014)
Talon (Comics)
We Are Robin (Comics)
`;

var franchise2 = `
Far Sector (DC Comics 2019)
Green Lantern - All Media Types
Green Lantern (2011)
Green Lantern (Comics)
Green Lantern Corps (Comics)
Green Lantern: Emerald Knights
Green Lantern: First Flight (2009)
Green Lantern: Legacy (DC Comics 2020)
Green Lantern: The Animated Series
Hal Jordan and the Green Lantern Corps (Comics)
New Guardians (Comics)
Red Lanterns (Comics)
Sinestro (Comics)
`;

var franchise3 = `
Before Watchmen (Comics)
Constantine: City of Demons (Cartoon)
DC Super Hero Girls (Cartoon 2019)
DC Universe Online
DCeased (DC Comics)
DCU
DCU (Comics)
Death of the New Gods (Comics 2007)
The Demon (DCU Comics)
Doctor Fate (Comics)
Event Leviathan (DCU Comics)
Futures End (Comics)
Heroes in Crisis (DCU Comics)
Justice League Dark (2017)
Justice League Dark (Comics)
Justice League Odyssey (Comics)
Justice League vs. the Fatal Five (2019)
Justice League: Crisis on Two Earths
Justice League: Doom
Justice League: Throne of Atlantis (2015)
Kingdom Come (Comics)
LEGO DC Comics Super Heroes: Justice League - Cosmic Clash (2016)
Mister Miracle (Comics 2017)
Mother Panic (Comics)
New Gods (Comics)
New Super-Man and the Justice League of China (Comics)
Reign of the Supermen (2019)
Secret Society of Super Villains (Comics)
Super Sons (Comics)
Superman: Man of Tomorrow (Movie 2020)
Superman/Batman: Public Enemies
Swamp Thing (Comics)
Trinity (Comics)
Watchmen - All Media Types
Watchmen (2009)
Watchmen (Comic)
World's Finest (1997)
Wonder Woman (2009)
Wonder Woman: Bloodlines (2019)
Zatanna (Comics)
`;

var franchise4 = `
Pocket Monsters | Pokemon - All Media Types
Pocket Monsters | Pokemon (Main Video Game Series)
Pocket Monsters: HeartGold & SoulSilver | Pokemon HeartGold & SoulSilver Versions
Pocket Monsters: Let's Go! Pikachu & Let's Go! Eievui | Pokemon: Let's Go Pikachu! & Let's Go Eevee!
Pocket Monsters: Omega Ruby & Alpha Sapphire | Pokemon Omega Ruby & Alpha Sapphire Versions
Pocket Monsters: Sun & Moon | Pokemon Sun & Moon Versions
Pocket Monsters: Sword & Shield | Pokemon Sword & Shield Versions
Pocket Monsters: Ultra Sun & Ultra Moon | Pokemon Ultra Sun & Ultra Moon Versions
Pocket Monsters: X & Y | Pokemon X & Y Versions
POKEMON Detective Pikachu (2019)
名探偵ピカチュウ | Detective Pikachu (Video Game)
`;

var franchise5 = `
Café Enchanté (Visual Novel)
Chaos;Child (Visual Novel)
Chaos;Head (Visual Novel)
Dangan Ronpa - All Media Types
Dangan Ronpa 3: The End of 希望ヶ峰学園 | The End of Kibougamine Gakuen | End of Hope's Peak High School
Dangan Ronpa Another Episode: Ultra Despair Girls
Dangan Ronpa Gaiden: Killer Killer (Manga)
Dangan Ronpa Zero
Dangan Ronpa: Kirigiri
Dangan Ronpa: Trigger Happy Havoc
Eldarya (Video Game)
キミガシネ | Kimi ga Shine | Your Turn To Die (Visual Novel)
New Dangan Ronpa V3: Everyone's New Semester of Killing
Occultic;Nine
Robotics;Notes
Super Dangan Ronpa 2
Yanderella (Video Game)
`;

var franchise6 = `
Bahamut Lagoon
Chrono Cross
Chrono Trigger
Final Fantasy Explorers (Video Game)
Final Fantasy I
Final Fantasy II
Final Fantasy III
Final Fantasy IV
Final Fantasy IV: The After Years
Final Fantasy V
Final Fantasy VI
Final Fantasy: Brave Exvius
Kingdom Hearts (Video Games)
The Last Remnant
Mobius Final Fantasy
Radical Dreamers
Sleeping Dogs (Video Games)
Theatrhythm Final Fantasy (Video Games)
War of the Visions: Final Fantasy Brave Exvius (Video Game)
`;

var franchise7 = `
Battle of the Planets (Cartoon)
Bionic Commando (Video Games)
Captain Commando (Video Game)
Casshern Sins
Cyberbots (Video Game)
Darkstalkers (Video Games)
Dead Rising (Video Games)
Dig Dug (Video Game)
Druaga no Tou | The Tower of Druaga
Ecco the Dolphin (Video Games)
End of Eternity | Resonance of Fate
Fighting Vipers (Video Games)
G-Force: Guardians of Space
#源平討魔伝 | Genpei Touma Den | The Genji and Heike Clans (Video Games)
ハクション大魔王 | Hakushon Daimaou | The Genie Family (Anime)
House of the Dead (Movies 2003 2005)
The House of the Dead (Video Games)
Infini-T Force (Anime)
Kagaku Ninja Tai Gatchaman & Related Fandoms
Kagaku Ninja Tai Gatchaman | Science Ninja Team Gatchaman
Klonoa (Games)
Lost Planet
魔界村 | Makaimura | Ghosts 'n Goblins (Video Games)
Marvel Tsum Tsum
Marvel vs. Capcom (Video Games)
Mega Man (Archie Comics)
Mega Man (Cartoon 1994)
Mega Man (Dreamwave Comics)
Namco x Capcom (Video Game)
Onimusha
黄金戦士ゴールド・ライタン | Ougon Senshi Gold Lightan | Golden Warrior Gold Lightan (Anime)
Project X Zone
QUIZなないろDREAMS 虹色町の奇跡 | Quiz Nanairo Dreams: Nijiirochou no Kiseki
Rockman | Mega Man - All Media Types
Rockman | Mega Man Classic
Rockman DASH Series | Mega Man Legends
Rockman Megamix | Mega Man Megamix
Rockman X | Mega Man X
Rockman Zero | Mega Man Zero
Rockman ZX | Mega Man ZX
ロックマン 星に願いを | Rockman: Hoshi ni Negai o | Mega Man: Upon a Star (Anime)
Sega "Segata Sanshiro" Commercials
Senjou no Valkyria | Valkyria Chronicles
Shenmue (Video Games)
シャイニング | Shining Series (Video Games)
Shinzou Ningen Casshern | Neo-Human Casshern
SNK vs. Capcom (Video Games)
Space Channel 5
Star Gladiator (Video Games)
ストライダー飛竜 | Strider (Video Games)
Summon Night (Video Games)
スーパーロボット大戦 | Super Robot Wars
スーパーロボット大戦α | Super Robot Wars Alpha
スーパーロボット大戦OG Original Generations | Super Robot Wars OG: Original Generations
スーパーロボット大戦V | Super Robot Wars V
スーパーロボット大戦W | Super Robot Wars W
スーパーロボット大戦Z | Super Robot Wars Z (Video Games)
Tatsunoko vs. Capcom (Video Games)
Uchuu no Kishi Tekkaman Blade | Teknoman
Wonder Momo
`;

var franchise8 = `
Beatmania IIDX (Video Games)
Cytus (Video Games)
Dance Central (Games)
Dance Dance Revolution
Deemo (Video Games)
Guitar Hero
HarmoKnight (Video Game)
Pop'n Music (Game)
リズム天国 | Rhythm Heaven (Video Games)
リズム怪盗R | Rhythm Thief & the Emperor’s Treasure
SOUND VOLTEX (Video Games)
太鼓の達人 | Taiko no Tatsujin (Video Games)
Vib-Ribbon
VOEZ (Video Game)
`;

var franchise9 = `
Bohemian Rhapsody - Queen (Song)
The Comedy About a Bank Robbery - Lewis & Sayer & Shields
Drunken Sailor | What Shall We Do with the Drunken Sailor? - Anonymous (Song)
The Goes Wrong Show (TV 2019)
I Want To Break Free - Queen (Music Video)
Innuendo - Queen (Song)
Killer Queen - Queen (Song)
The Play That Goes Wrong Series - Lewis & Sayer & Shields
Seven Seas of Rhye - Queen (Song)
We Will Rock You - Elton/May/Taylor
Who Wants to Live Forever - Queen (Song)
`;

var franchise10 = `
The Adventures of the Scarlet Pimpernel (TV 1955)
The Scarlet Pimpernel - Takarazuka Revue
The Scarlet Pimpernel - Wildhorn/Knighton
The Scarlet Pimpernel (1934)
The Scarlet Pimpernel (1982)
The Scarlet Pimpernel (TV 1999)
The Scarlet Pimpernel Series - Baroness Orczy
`;

var franchise11 = `
(T)Raumschiff Surprise - Periode 1 (2004)
Der Besuch der alten Dame | The Visit - Dürrenmatt
Der Besuch der alten Dame | The Visit - Schneider & Reed/Hofer/Struppeck
Bullyparade - Der Film | Bullyparade: The Movie (2017)
Doctor Faustus - Christopher Marlowe
Don Carlos - Friedrich Schiller
Don Carlos | Don Carlo - Verdi/du Locle/Méry
Edna & Harvey (Video Games)
Emilia Galotti - Lessing
Faust - Eine deutsche Volkssage (1926)
Faust - Gounod/Barbier
Faust - Johann Wolfgang von Goethe
Kleiner Werwolf | Young Werewolf - Cornelia Funke
Der Kontrabaß | The Double-Bass - Süskind
Die Leiden des jungen Werthers | The Sorrows of Young Werther - Johann Wolfgang von Goethe
Lorscher Bienensegen | Lorsch Bee Blessing - Anonymous
Die Malteser - Friedrich Schiller
Metamorphosis (Video Game 2020)
Momo - Michael Ende
Mutter Courage und ihre Kinder | Mother Courage - Brecht/Steffin
Oh wie schön ist Panama | The Trip to Panama - Janosch
Der Prozess | The Trial - Franz Kafka
Die Räuber | The Robbers - Schiller
Der Sandmann | The Sandman - E. T. A. Hoffmann
Der Schuh des Manitu | Manitou's Shoe (2001)
Der Steppenwolf - Hermann Hesse
Der Tod in Venedig | Death in Venice - Thomas Mann
Unser (T)Raumschiff - Bullyparade Sketches
Der Zauberberg | The Magic Mountain - Thomas Mann
Der Zauberlehrling | The Sorcerer's Apprentice - Johann Wolfgang von Goethe
`;

var franchise12 = `
阿郎的故事 | All About Ah Long (1989)
L'amant | The Lover (1992)
旺角卡門 | As Tears Go By (1988)
秋蝉 | Autumn Cicada (TV)
証人 | Beast Stalker (Movies)
痞子英雄 | Black & White (TV)
痞子英雄 | Black & White (Movies)
机器之血 | Bleeding Steel (2017)
盲探 | Blind Detective (2013)
热血勇士 | Blood Warriors (TV)
沉默的證人 | Bodies at Rest (2019)
心花路放 | Breakup Buddies (2013)
大闹天竺 | Buddies in India (2016)
喋血街頭 | Bullet in the Head (1990 - Woo)
上海滩 | The Bund (TV 1980)
爱情呼叫转移 | Call for Love (Movies)
危城 | Call Of Heroes (2016)
擋不住的瘋情 | Can't Stop My Crazy Love for You (1993)
與鴨共舞 | Cash on Delivery (1992)
至尊無上 | Casino Raiders (Movies)
策马啸西风 | Cè Mǎ Xiào Xī Fēng (TV)
龍在邊緣 | Century of the Dragon (1999)
追龍 | Chasing the Dragon (Movies)
厨子戏子痞子 | The Chef The Actor The Scoundrel (2013)
聖誕玫瑰 | Christmas Rose (2013)
媽閣是座城 | A City Called Macau (2019)
義膽紅唇 | City War (1988)
阳光之下 | The Confidence (TV 2020)
咖喱辣椒 | Curry and Pepper (1990)
扫冰者 | Dare to Strike (TV)
亞飛與亞基 | The Days of Being Dumb (1992)
天長地久 | Days of Tomorrow (1993)
變臉迷情 | Devil Face Angel Heart (2002)
第二面 | Dì Èr Miàn (TV)
獄中龍 | Dragon in Jail (1990)
毒戰 | Drug War (2013)
學警狙擊 | E.U.
黑社會 | Election (Movies)
人潮汹涌 | Endgame (2021)
天若有情 | Endless Love (TV 2005)
飛越謎情 | The Enigma of Love (1993)
大佬愛美麗 | Enter the Phoenix (2004)
密战 | Eternal Wave (2017)
黑拳 | Fatal Contact (2006)
奪帥 | Fatal Move | Triad Wars (2008)
锋刃 | Fēng Rèn
風暴 | Firestorm (2013)
Flash Point (2007)
浮城 | Floating City (2012)
天上掉馅饼 | A Foreign Luck (2006)
賭城風雲 | From Vegas to Macau (Movies)
機Boy小子之真假威龍 | Game Kids (1992)
滚蛋吧！肿瘤君 | Go Away Mr. Tumor (2015)
賭神 | God of Gamblers (Movies)
黃金兄弟 | Golden Job (2018)
金蛇郎君 | Golden Snake Sword (TV)
被光抓走的人 | Gone with the Light (2019)
九龍冰室 | Goodbye Mr. Cool (2001)
催眠裁決 | Guilt By Design (2019)
O記三合會檔案 | The H.K. Triad (1999)
绝代双骄 | Handsome Siblings (TV 2020)
Cèon Gwòng Zaa Sit | Happy Together (1997)
重案黐孖Gun | Heat Team (2004)
天行者 | Heavenly Mission (2006)
Yīng Xióng | Hero (2002)
雷霆掃毒 | Highs and Lows
我爱男闺蜜 | Honey Bee Man (TV)
热血少年 | Hot-Blooded Youth (TV)
我是特种兵 | I'm a Special Soldier (TV)
不可思异 | Impossible (2015)
男兒本色 | Invisible Target (2007)
廉政风云 | Integrity (2019)
葉問 | Ip Man (Movies)
黑金 | The Island of Greed (1997)
有時跳舞 | The Island Tales (2000)
绝命鸳鸯 | Jué mìng yuānyāng (TV)
有话好好说 | Keep Cool (1997)
陀地驅魔人 | Keeper of Darkness (2015)
大上海 | The Last Tycoon (2012)
Laughing Gor | Turning Point (Movies)
五億探長雷洛傳 | Lee Rock (Movies)
溶屍奇案 | Legal Innocence (1993)
楚留香傳奇 - 古龍 | The Legend of Chu Liuxiang - Gǔ Lóng
楚留香新传 | The Legend of Chu Liuxiang (TV 2012)
扶摇 | Legend of Fuyao (TV)
笑侠楚留香 | Legend of the Liquid Sword (1993)
隋唐英雄传 | Legend of the Sui Tang Heroes (TV)
狼牙 | Legendary Assassin (2008)
边境风云 | Lethal Hostage (2012)
潛行狙擊 | Lives of Omission
银河补习班 | Looking Up (2019)
人再囧途之泰囧 | Lost In Thailand (2012)
小别离 | A Love For Separation (TV)
爱情36计 | Love Tactics (2010)
机器侠 | Metallic Attraction: Kungfu Cyborg (2009)
流星·蝴蝶·剑 - 古龍 | Meteor Butterfly Sword - Gǔ Lóng
流星蝴蝶剑 | Meteor Butterfly Sword (TV 2010)
深夜食堂 | Midnight Diner (China TV 2017)
上车走吧 | Mini-bus (2000)
天若有情 | A Moment of Romance (Movies)
花街時代 | My Name Ain't Suzie (1985)
新警察故事 | New Police Story (2004)
下一站别离 | Next Time Together Forever (TV)
大追捕 | Nightfall (2012)
华丽上班族 | Office (2015)
老男孩 | Old Boy (TV 2018)
触不可及 | One Step Away (2014)
红海行动 | Operation Red Sea (2018)
闪光少女 | Our Shiny Days (TV)
竊聽風雲 | Overheard (Movies)
如果愛 | Perhaps Love (2005)
刑警队长 | Police Captain (TV)
警察故事 | Police Story (Movies)
无极 | The Promise (2005)
长安诺 | The Promise of Chang'an (TV)
小魚兒與花無缺 | The Proud Twins (TV)
PTU機動部隊 | PTU (TV)
中神通王重陽 | Rage and Passion (TV)
上阳赋 | The Rebel Princess (TV)
手足情深 | Reunion (2002)
伴我縱橫 | Rhythm of Destiny (1992)
江湖情 | Rich and Famous (1987)
飆城 | Runaway Blues (1988)
暗戰 | Running Out of Time (1999)
解救吾先生 | Saving Mr. Wu (2015)
古惑女 | Sexy and Dangerous (Movies)
新上海灘 | Shanghai Grand (1996)
新少林寺 | Shaolin (2011)
Shí Miàn Mái Fú | House of Flying Daggers (2004)
深夜食堂 | Shinya Shokudo | Midnight Diner (Japan TV)
Shinya Shokudou
士兵突击 | Soldiers Sortie (TV)
奇迹世界 | Soul of the Ultimate Nation (Short Film)
殺破狼 | SPL | Kill Zone (Movies)
古惑仔 | Teddyboy (Manhua)
柔道龍虎榜 | Throw Down (2004)
破冰行动 | The Thunder (TV)
飛虎 | Tiger Cubs (TV)
江湖 | Triad Underworld (2004)
樹大招風 | Trivisa (2016)
火线三兄弟 | Troubled Times Three Brothers (TV)
龍在江湖 | A True Mob Story (1998)
卧底归来 | Undercover (TV)
杀入地狱 | Visa to Hell (1992)
纸醉金迷 | Wanton and Luxurious Living (TV)
愛上百分百英雄 | We're No Bad Guys (1997)
掃毒 | The White Storm (Movies)
風塵三女俠 | Why Wild Girls (1994)
伴我闖天涯 | Wild Search (1989)
天若有情 | The Witness of Time (TV 1990)
犯罪現場 | A Witness Out Of The Blue (2019)
战狼 | Wolf Warrior (Movies)
古惑仔 | Young and Dangerous (Movies)
Z風暴 | Z Storm (Movies)
`;

var franchise13 = `
Azur Lane (Anime)
碧蓝航线 | Azur Lane (Video Game)
Black Bird (Manga)
Black Cat (Anime & Manga)
僕のヒーローアカデミア | Boku no Hero Academia | My Hero Academia
하백의 신부 | The Bride of Habaek (TV)
하백의 신부 | Bride of the Water God (Manhwa)
The Caligula Effect (Video Game)
クッキング ママ | Cooking Mama
Food Fantasy (Video Game)
グレートマジンガー | Great Mazinger (Anime & Manga)
Mazinger Z
マジンカイザー | Mazinkaiser (Anime)
マジンカイザーSKL | Mazinkaiser SKL
喜羊羊与灰太狼 | Pleasant Goat and Big Big Wolf (Cartoon)
Rilakkuma and Kaoru (Cartoon)
Sdorica (Video Games)
食戟のソーマ | Food Wars! Shokugeki no Soma
食物语 | The Tale of Food (Video Game)
Tengami (Video Game)
東亰ザナドゥ | Tokyo Xanadu (Video Game)
UFO Robo Grendizer
侠岚 | Xiá Lán (Cartoon)
战舰少女 | Zhànjiàn Shàonǚ | Warship Girls (Video Game)
`;

var franchise14 = `
`;

var franchise15 = `
`;

var cowrangled = `
Batman - All Media Types
Batman: Arkham - All Media Types
僕のヒーローアカデミア | Boku no Hero Academia | My Hero Academia
Dangan Ronpa - All Media Types
Dangan Ronpa 3: The End of 希望ヶ峰学園 | The End of Kibougamine Gakuen | End of Hope's Peak High School
Dangan Ronpa Another Episode: Ultra Despair Girls
Dangan Ronpa Gaiden: Killer Killer (Manga)
Dangan Ronpa Zero
Dangan Ronpa: Kirigiri
Dangan Ronpa: Trigger Happy Havoc
DCU
DCU (Comics)
Far Sector (DC Comics 2019)
Green Lantern - All Media Types
Green Lantern (Comics)
Green Lantern Corps (Comics)
キミガシネ | Kimi ga Shine | Your Turn To Die (Visual Novel)
Kingdom Hearts (Video Games)
Lego - All Media Types
New Dangan Ronpa V3: Everyone's New Semester of Killing
Pocket Monsters | Pokemon - All Media Types
Pocket Monsters | Pokemon (Main Video Game Series)
Pocket Monsters: HeartGold & SoulSilver | Pokemon HeartGold & SoulSilver Versions
Pocket Monsters: Let's Go! Pikachu & Let's Go! Eievui | Pokemon: Let's Go Pikachu! & Let's Go Eevee!
Pocket Monsters: Omega Ruby & Alpha Sapphire | Pokemon Omega Ruby & Alpha Sapphire Versions
Pocket Monsters: Sun & Moon | Pokemon Sun & Moon Versions
Pocket Monsters: Sword & Shield | Pokemon Sword & Shield Versions
Pocket Monsters: Ultra Sun & Ultra Moon | Pokemon Ultra Sun & Ultra Moon Versions
Pocket Monsters: X & Y | Pokemon X & Y Versions
POKEMON Detective Pikachu (2019)
名探偵ピカチュウ | Detective Pikachu (Video Game)
Rockman | Mega Man - All Media Types
Super Dangan Ronpa 2
Super Sons (Comics)
Watchmen - All Media Types
`;

// END OF SETTINGS //


// EDIT here to adjust the number of franchises you've set.
var franchise1_list = franchise1.trim().split("\n");
var franchise2_list = franchise2.trim().split("\n");
var franchise3_list = franchise3.trim().split("\n");
var franchise4_list = franchise4.trim().split("\n");
var franchise5_list = franchise5.trim().split("\n");
var franchise6_list = franchise6.trim().split("\n");
var franchise7_list = franchise7.trim().split("\n");
var franchise8_list = franchise8.trim().split("\n");
var franchise9_list = franchise9.trim().split("\n");
var franchise10_list = franchise10.trim().split("\n");
var franchise11_list = franchise11.trim().split("\n");
var franchise12_list = franchise12.trim().split("\n");
var franchise13_list = franchise13.trim().split("\n");
var franchise14_list = franchise14.trim().split("\n");
var franchise15_list = franchise15.trim().split("\n");

var cowrangled_list = cowrangled.trim().split("\n");

(function($) {

    var all_fandoms = $("#user-page table tbody tr");

	// label fandoms with franchise, cowrangled, and unwrangled status
    all_fandoms.each(function() {
        var fandom_name = $(this).find("th").text();
		var unwrangled_counts = $(this).find("td").slice(3, 6).text();

        // EDIT here to adjust your number of franchises
		// The relevant section for each franchise
		// starts with 'else if'
		// and ends with the first '}' that follows.
		if (franchise1_list.includes(fandom_name)) {
		    $(this).addClass("franchise1-fandom");
		} else if (franchise2_list.includes(fandom_name)) {
			$(this).addClass("franchise2-fandom");
		} else if (franchise3_list.includes(fandom_name)) {
			$(this).addClass("franchise3-fandom");
		} else if (franchise4_list.includes(fandom_name)) {
			$(this).addClass("franchise4-fandom");
		} else if (franchise5_list.includes(fandom_name)) {
			$(this).addClass("franchise5-fandom");
		} else if (franchise6_list.includes(fandom_name)) {
			$(this).addClass("franchise6-fandom");
		} else if (franchise7_list.includes(fandom_name)) {
			$(this).addClass("franchise7-fandom");
		} else if (franchise8_list.includes(fandom_name)) {
			$(this).addClass("franchise8-fandom");
        } else if (franchise9_list.includes(fandom_name)) {
            $(this).addClass("franchise9-fandom");
        } else if (franchise10_list.includes(fandom_name)) {
            $(this).addClass("franchise10-fandom");
        } else if (franchise11_list.includes(fandom_name)) {
            $(this).addClass("franchise11-fandom");
        } else if (franchise12_list.includes(fandom_name)) {
            $(this).addClass("franchise12-fandom");
        } else if (franchise13_list.includes(fandom_name)) {
            $(this).addClass("franchise13-fandom");
        } else if (franchise14_list.includes(fandom_name)) {
            $(this).addClass("franchise14-fandom");
        } else if (franchise15_list.includes(fandom_name)) {
            $(this).addClass("franchise15-fandom");
        } else {
            $(this).addClass("other-fandom");
        }

		if (cowrangled_list.includes(fandom_name)) {
			$(this).addClass("shared-fandom");
		} else {
			$(this).addClass("solo-fandom");
		}

		if (unwrangled_counts == "   ") {
			$(this).addClass("no-unwrangled");
		}
    });

    // add toggle menu
	// EDIT here to adjust the code to your number of franchises
	// as well as what the toggles are to be labeled with inside the [ ].
    // To save space, I abbreviated "Shared Unwrangleds" as UW, "Solo Unwrangleds" as uw,
    // "All Unwrangleds" as New, and "All Fandoms" as All.
    $("#user-page table").before("<p id='filter-fandoms'>Filter:&nbsp; &nbsp;" +
								 "<a id='franchise1'>[Bats]</a>&nbsp;&nbsp;" +
								 "<a id='franchise2'>[GLs]</a>&nbsp;&nbsp;" +
                                 "<a id='franchise3'>[DC]</a>&nbsp; &nbsp;" +
                                 "<a id='franchise4'>[Pkmn]</a>&nbsp;&nbsp;" +
								 "<a id='franchise5'>[VNs]</a>&nbsp;&nbsp;" +
								 "<a id='franchise6'>[SqEx]</a>&nbsp;&nbsp;" +
								 "<a id='franchise7'>[vs/x]</a>&nbsp;&nbsp;" +
								 "<a id='franchise8'>[Rhythm]</a>&nbsp; &nbsp;" +
								 "<a id='franchise9'>[Stage]</a>&nbsp;&nbsp;" +
								 "<a id='franchise10'>[Scarlet]</a>&nbsp;&nbsp;" +
                                 "<a id='franchise11'>[de]</a>&nbsp;&nbsp;" +
                                 "<a id='franchise12'>[实景真人]</a>&nbsp;&nbsp;" +
                                 "<a id='franchise13'>[动漫游]</a>&nbsp;&nbsp;" +
								 "<a id='other'>[etc]</a>&nbsp;  &nbsp;" +
								 "<a id='shared-unwrangled'>[UW]</a>&nbsp;&nbsp;" +
                                 "<a id='solo-unwrangled'>[uw]</a>&nbsp;&nbsp;" +
                                 "<a id='all-unwrangled'>[new]</a>&nbsp;  &nbsp;" +
                                 "<a id='all-fandoms'>[all]</a>" +
                                 "</p>");

    // add toggle functions
    function add_toggle(toggle_class, ...classes_to_hide) {
        $(toggle_class).click(function() {
            all_fandoms.show();
            classes_to_hide.forEach(function(class_to_hide) {
                $(class_to_hide).hide();
            });
            $("#filter-fandoms").find("a").css("font-weight", "normal");
            $(this).css("font-weight", "bold");
        });
    }

	// EDIT here to adjust to your number of franchises
	// All the strings that start with . are the exclusion filters.
	// For each toggle you need to exclude all the other franchises,
	// meaning that they need to have all the numbered franchise-fandom labels
	// that do not have the same number as the #franchise part
	// as well as the other-fandom label.
	// Every numbered franchise-fandom label needs to be listed
	// in the exclusion filters that come after #others
	add_toggle("#franchise1", ".franchise2-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise13-fandom", ".franchise14-fandom", ".franchise15-fandom", ".other-fandom");
    add_toggle("#franchise2", ".franchise1-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise13-fandom", ".franchise14-fandom", ".franchise15-fandom", ".other-fandom");
	add_toggle("#franchise3", ".franchise1-fandom", ".franchise2-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise13-fandom", ".franchise14-fandom", ".franchise15-fandom", ".other-fandom");
	add_toggle("#franchise4", ".franchise1-fandom", ".franchise2-fandom", ".franchise3-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise13-fandom", ".franchise14-fandom", ".franchise15-fandom", ".other-fandom");
	add_toggle("#franchise5", ".franchise1-fandom", ".franchise2-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise13-fandom", ".franchise14-fandom", ".franchise15-fandom", ".other-fandom");
	add_toggle("#franchise6", ".franchise1-fandom", ".franchise2-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise13-fandom", ".franchise14-fandom", ".franchise15-fandom", ".other-fandom");
	add_toggle("#franchise7", ".franchise1-fandom", ".franchise2-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise13-fandom", ".franchise14-fandom", ".franchise15-fandom", ".other-fandom");
	add_toggle("#franchise8", ".franchise1-fandom", ".franchise2-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise13-fandom", ".franchise14-fandom", ".franchise15-fandom", ".other-fandom");
    add_toggle("#franchise9", ".franchise1-fandom", ".franchise2-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise13-fandom", ".franchise14-fandom", ".franchise15-fandom", ".other-fandom");
    add_toggle("#franchise10", ".franchise1-fandom", ".franchise2-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise13-fandom", ".franchise14-fandom", ".franchise15-fandom", ".other-fandom");
    add_toggle("#franchise11", ".franchise1-fandom", ".franchise2-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise12-fandom", ".franchise13-fandom", ".franchise14-fandom", ".franchise15-fandom", ".other-fandom");
    add_toggle("#franchise12", ".franchise1-fandom", ".franchise2-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise13-fandom", ".franchise14-fandom", ".franchise15-fandom", ".other-fandom");
    add_toggle("#franchise13", ".franchise1-fandom", ".franchise2-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise14-fandom", ".franchise15-fandom", ".other-fandom");
    add_toggle("#other", ".franchise1-fandom", ".franchise2-fandom", ".franchise3-fandom", ".franchise4-fandom", ".franchise5-fandom", ".franchise6-fandom", ".franchise7-fandom", ".franchise8-fandom", ".franchise9-fandom", ".franchise10-fandom", ".franchise11-fandom", ".franchise12-fandom", ".franchise13-fandom", ".franchise14-fandom", ".franchise15-fandom");
    add_toggle("#shared-unwrangled", ".solo-fandom", ".no-unwrangled");
    add_toggle("#solo-unwrangled", ".shared-fandom", ".no-unwrangled");
    add_toggle("#all-unwrangled", ".no-unwrangled");
    add_toggle("#all-fandoms");
})(jQuery);