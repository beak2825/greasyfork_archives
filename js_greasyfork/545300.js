// ==UserScript==
// @name         AWBW game chat
// @namespace    http://tampermonkey.net/
// @version      0.0.0.0.0.2
// @description  Show chat on game page
// @author       new1234
// @match        https://awbw.amarriner.com/game.php?games_id=*
// @match        https://awbw.amarriner.com/press.php*
// @icon         https://awbw.amarriner.com/terrain/messages.gif
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545300/AWBW%20game%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/545300/AWBW%20game%20chat.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const userName = document.querySelector('h2.green-bold a').textContent.trim();

    const chatUrl = window.location.href.replace('game.php', 'press.php');

    let chatContainer, toggleButton, badge, sendMessageContainer;
    let isChatHidden = false;
    let unreadCount = 0;
    let currentCount = 0;
    let isYourChat = true;

    const gifMap = {
        ":SaluteGirl_YC_Inf:": "https://cdn.discordapp.com/emojis/1100180778232578088.png?size=100",
        ":happy_sasha:": "https://cdn.discordapp.com/emojis/385660054595960833.png?size=100",
        ":Grimm_Sweats:": "https://cdn.discordapp.com/emojis/1059238674597957642.png?size=100",
        ":Pog:": "https://cdn.discordapp.com/emojis/949888810580312075.png?size=100",
        ":NellWarCrimes:": "https://cdn.discordapp.com/emojis/911692037160579164.png?size=100",
        ":DogKek:": "https://cdn.discordapp.com/emojis/1032019469733736538.png?size=100",
        ":GrinGrimm:": "https://cdn.discordapp.com/emojis/769071175585890304.png?size=100",
        ":Nooo_Whyyy:": "https://cdn.discordapp.com/emojis/1007135137391194223.png?size=100",
        ":GS_Inf:": "https://cdn.discordapp.com/emojis/1397768999705641001.png?size=100",
        ":MiniJugger:": "https://cdn.discordapp.com/emojis/1392115444873171037.png?size=100",
        ":MonkeMax:": "https://cdn.discordapp.com/emojis/953465265000165376.png?size=100",
        ":Jugger_HeadPat:": "https://cdn.discordapp.com/emojis/1189392736525242378.png?size=100",
        ":Floppus:": "https://cdn.discordapp.com/emojis/1297782242545893428.png?size=100",
        ":senile_vonbolt:": "https://cdn.discordapp.com/emojis/385661550159200267.png?size=100",
        ":AndyNod:": "https://cdn.discordapp.com/emojis/1297367887937540147.png?size=100",
        ":FlakGrin:": "https://cdn.discordapp.com/emojis/1022689428071796776.png?size=100",
        ":Kindle_WineAboutIt:": "https://cdn.discordapp.com/emojis/1184154519383330879.png?size=100",
        ":OozeCruise:": "https://cdn.discordapp.com/emojis/933381036740583434.png?size=100",
        ":ConfusedAndy:": "https://cdn.discordapp.com/emojis/930990061170855948.png?size=100",
        ":SadEagle:": "https://cdn.discordapp.com/emojis/981903868826890320.png?size=100",
        ":Sonja_Nooooo:": "https://cdn.discordapp.com/emojis/1175605077042536498.png?size=100",
        ":fog~1:": "https://cdn.discordapp.com/emojis/890402734459715644.png?size=100",
        ":Sonja_Calculated:": "https://cdn.discordapp.com/emojis/1268651886064435232.png?size=100",
        ":Ohohoho_Kindle:": "https://cdn.discordapp.com/emojis/1082517278161109042.png?size=100",
        ":OlafGrin:": "https://cdn.discordapp.com/emojis/934192279520956426.png?size=100",
        ":MD_Classy:": "https://cdn.discordapp.com/emojis/917134216611889153.png?size=100",
        ":Troll_Koal:": "https://cdn.discordapp.com/emojis/993268371657343057.png?size=100",
        ":StealthSan:": "https://cdn.discordapp.com/emojis/745713642938433626.png?size=100",
        ":WiseSensei:": "https://cdn.discordapp.com/emojis/943834512847175700.png?size=100",
        ":BattleShipping:": "https://cdn.discordapp.com/emojis/932509911366119434.png?size=100",
        ":MarketCrash_Sasha:": "https://cdn.discordapp.com/emojis/1281046429158080556.png?size=100",
        ":NoSurvivors_Rachel:": "https://cdn.discordapp.com/emojis/1030552250831097886.png?size=100",
        ":NervousColin:": "https://cdn.discordapp.com/emojis/1306819591418413066.png?size=100",
        ":AAirTrafficControl:": "https://cdn.discordapp.com/emojis/1315865700509941770.png?size=100",
        ":AndyAirport:": "https://cdn.discordapp.com/emojis/1169087384072224888.png?size=100",
        ":Sami_Whaet:": "https://cdn.discordapp.com/emojis/1227733541853462538.png?size=100",
        ":BombVoyage:": "https://cdn.discordapp.com/emojis/933457083548979290.png?size=100",
        ":MEGATANK:": "https://cdn.discordapp.com/emojis/869741733540413461.png?size=100",
        ":CopterSac:": "https://cdn.discordapp.com/emojis/1315869235989188701.png?size=100",
        ":CarryMe:": "https://cdn.discordapp.com/emojis/915590613284585524.png?size=100",
        ":Hawke_Yeah:": "https://cdn.discordapp.com/emojis/932503724348276846.png?size=100",
        ":Cool_Eagle:": "https://cdn.discordapp.com/emojis/1139598736448815256.png?size=100",
        ":SenPipe:": "https://cdn.discordapp.com/emojis/865314376700919808.png?size=100",
        ":APC_APerfectBait:": "https://cdn.discordapp.com/emojis/917131066874134538.png?size=100",
        ":Adderenaline:": "https://cdn.discordapp.com/emojis/1098364166009540699.png?size=100",
        ":AmberLander:": "https://cdn.discordapp.com/emojis/933194211812069436.png?size=100",
        ":AndyGrin:": "https://cdn.discordapp.com/emojis/953357652702933002.png?size=100",
        ":AngryKanbei:": "https://cdn.discordapp.com/emojis/1175995777496121384.png?size=100",
        ":AngryKitteh:": "https://cdn.discordapp.com/emojis/1008717391011774484.png?size=100",
        ":Angry_Flak:": "https://cdn.discordapp.com/emojis/325404480676036608.png?size=100",
        ":Angry_Sonja:": "https://cdn.discordapp.com/emojis/325608078877655040.png?size=100",
        ":Annoyed_Sasha:": "https://cdn.discordapp.com/emojis/1131367288180850749.png?size=100",
        ":ArtyParty:": "https://cdn.discordapp.com/emojis/908538470186758256.png?size=100",
        ":Aww_Lash:": "https://cdn.discordapp.com/emojis/1067659762709315674.png?size=100",
        ":BadLuck_Sonja:": "https://cdn.discordapp.com/emojis/1098361538764623902.png?size=100",
        ":BannedBomb:": "https://cdn.discordapp.com/emojis/1315863409333637183.png?size=100",
        ":BigBrain:": "https://cdn.discordapp.com/emojis/932227159391629312.png?size=100",
        ":BlackCatRachel:": "https://cdn.discordapp.com/emojis/1355005110224158950.png?size=100",
        ":BlankStareHawke:": "https://cdn.discordapp.com/emojis/1025812223815331901.png?size=100",
        ":Blep_Sami:": "https://cdn.discordapp.com/emojis/1098376825111064756.png?size=100",
        ":BoomBaboon:": "https://cdn.discordapp.com/emojis/1390390697646886993.png?size=100",
        ":BootyHunterDrake:": "https://cdn.discordapp.com/emojis/433573167697625091.png?size=100",
        ":BrainHurt_CloneAndy:": "https://cdn.discordapp.com/emojis/1099180968876707981.png?size=100",
        ":BullyMax:": "https://cdn.discordapp.com/emojis/1048472053168222248.png?size=100",
        ":COpower:": "https://cdn.discordapp.com/emojis/852953743343616060.png?size=100",
        ":CatinHat:": "https://cdn.discordapp.com/emojis/932472401768374363.png?size=100",
        ":Chad_Kanbei:": "https://cdn.discordapp.com/emojis/1384904027610939552.png?size=100",
        ":Cheers_Sasha:": "https://cdn.discordapp.com/emojis/1009887757553901578.png?size=100",
        ":Clever_Girl:": "https://cdn.discordapp.com/emojis/1299445598340251688.png?size=100",
        ":Cringe_Kanbei:": "https://cdn.discordapp.com/emojis/325574195943702528.png?size=100",
        ":Cruisin4ABruisin:": "https://cdn.discordapp.com/emojis/933192292578242570.png?size=100",
        ":Cry_OS_inf:": "https://cdn.discordapp.com/emojis/520585397638529044.png?size=100",
        ":D2D_DaytoDay:": "https://cdn.discordapp.com/emojis/1131387035479965817.png?size=100",
        ":Devious_Lash:": "https://cdn.discordapp.com/emojis/1098739264264609883.png?size=100",
        ":Disappointed_Kindle:": "https://cdn.discordapp.com/emojis/580551903943852032.png?size=100",
        ":Do_it_Adder:": "https://cdn.discordapp.com/emojis/1029390076381233182.png?size=100",
        ":DoginHat:": "https://cdn.discordapp.com/emojis/1008017533074427944.png?size=100",
        ":DrakeAbouttoBlow:": "https://cdn.discordapp.com/emojis/956475191742054410.png?size=100",
        ":Drake_Eeeh:": "https://cdn.discordapp.com/emojis/1131336797226541248.png?size=100",
        ":Drake_ShiverMeTimbers:": "https://cdn.discordapp.com/emojis/1273401571702739007.png?size=100",
        ":EagleAngry:": "https://cdn.discordapp.com/emojis/857802039312646155.png?size=100",
        ":EagleFlyHigh:": "https://cdn.discordapp.com/emojis/855167497791864852.png?size=100",
        ":ElJavier:": "https://cdn.discordapp.com/emojis/1022633536206950461.png?size=100",
        ":EvilCloneAndy:": "https://cdn.discordapp.com/emojis/1103134365552234546.png?size=100",
        ":Excited_Lash:": "https://cdn.discordapp.com/emojis/1098637016553492641.png?size=100",
        ":FacepalmSonja:": "https://cdn.discordapp.com/emojis/915041256810364958.png?size=100",
        ":Fail_Sturm:": "https://cdn.discordapp.com/emojis/1104587436488675388.png?size=100",
        ":Fascinating_Caulder:": "https://cdn.discordapp.com/emojis/460280745035038720.png?size=100",
        ":FightOrFlight:": "https://cdn.discordapp.com/emojis/1315866880694685747.png?size=100",
        ":FlakBonk:": "https://cdn.discordapp.com/emojis/1317222890071920740.png?size=100",
        ":FlakSmirk:": "https://cdn.discordapp.com/emojis/933944985450082304.png?size=100",
        ":FlexRunner:": "https://cdn.discordapp.com/emojis/1008379362611048478.png?size=100",
        ":FreeCity:": "https://cdn.discordapp.com/emojis/932352916856111255.png?size=100",
        ":FreeDude:": "https://cdn.discordapp.com/emojis/1009273947524710480.png?size=100",
        ":Gasp:": "https://cdn.discordapp.com/emojis/1009214358200516618.png?size=100",
        ":Gladder:": "https://cdn.discordapp.com/emojis/597561297479139338.png?size=100",
        ":GodMode_Grimm:": "https://cdn.discordapp.com/emojis/1189752762288853093.png?size=100",
        ":GreedyLash:": "https://cdn.discordapp.com/emojis/983457607597559908.png?size=100",
        ":GrimmReaper:": "https://cdn.discordapp.com/emojis/1291349320037044306.png?size=100",
        ":Grimmstinct:": "https://cdn.discordapp.com/emojis/808221982537678849.png?size=100",
        ":GrinKanbei:": "https://cdn.discordapp.com/emojis/1029249533470842900.png?size=100",
        ":Grit_Gun:": "https://cdn.discordapp.com/emojis/1037166830772555806.png?size=100",
        ":Grit_Hehehe:": "https://cdn.discordapp.com/emojis/1097338578960388136.png?size=100",
        ":Gun_Lin:": "https://cdn.discordapp.com/emojis/1016171259836502117.png?size=100",
        ":Gwarharhar_Beast:": "https://cdn.discordapp.com/emojis/642509360148250663.png?size=100",
        ":HangThem_Greyfield:": "https://cdn.discordapp.com/emojis/795729757803118622.png?size=100",
        ":HappyEagle:": "https://cdn.discordapp.com/emojis/1168759142081630310.png?size=100",
        ":HappyGirl_OS_Inf:": "https://cdn.discordapp.com/emojis/1100193863299244142.png?size=100",
        ":HappyKoal:": "https://cdn.discordapp.com/emojis/937232507915604029.png?size=100",
        ":Happy_Jess:": "https://cdn.discordapp.com/emojis/950189055788859442.png?size=100",
        ":Happy_Lash:": "https://cdn.discordapp.com/emojis/325608122238500865.png?size=100",
        ":Happy_Olaf:": "https://cdn.discordapp.com/emojis/1095064011512487967.png?size=100",
        ":Happy_Sami:": "https://cdn.discordapp.com/emojis/325404805440995350.png?size=100",
        ":Happy_Sonja:": "https://cdn.discordapp.com/emojis/1103121003648929862.png?size=100",
        ":Happy_Sturm:": "https://cdn.discordapp.com/emojis/1374575761264083085.png?size=100",
        ":Hawke_Approves:": "https://cdn.discordapp.com/emojis/1100525155052179528.png?size=100",
        ":Hawke_DeepBreath:": "https://cdn.discordapp.com/emojis/1102757683595071509.png?size=100",
        ":Hawke_Disapproves:": "https://cdn.discordapp.com/emojis/1101011360340529222.png?size=100",
        ":Hawkeward:": "https://cdn.discordapp.com/emojis/938105930334220289.png?size=100",
        ":High_Society_Kindle:": "https://cdn.discordapp.com/emojis/1269832087423160405.png?size=100",
        ":Hopium_VonBolt:": "https://cdn.discordapp.com/emojis/1042655906070003722.png?size=100",
        ":ImWatchingYou:": "https://cdn.discordapp.com/emojis/1278769529354190869.png?size=100",
        ":Interested_Jess:": "https://cdn.discordapp.com/emojis/1100099182389362739.png?size=100",
        ":JakeTheMan:": "https://cdn.discordapp.com/emojis/1076907050564591726.png?size=100",
        ":Javier0Towers:": "https://cdn.discordapp.com/emojis/869374111468617788.png?size=100",
        ":Javier1Tower:": "https://cdn.discordapp.com/emojis/1374148379680182394.png?size=100",
        ":Javier2Towers:": "https://cdn.discordapp.com/emojis/674075939784622080.png?size=100",
        ":Javier3Towers:": "https://cdn.discordapp.com/emojis/1268363337612394567.png?size=100",
        ":Jesster:": "https://cdn.discordapp.com/emojis/1056281730547449908.png?size=100",
        ":JuggerUhoh:": "https://cdn.discordapp.com/emojis/936662947663605861.png?size=100",
        ":Juggerright:": "https://cdn.discordapp.com/emojis/899527673141927986.png?size=100",
        ":KindleBlush:": "https://cdn.discordapp.com/emojis/960147961847898142.png?size=100",
        ":Kindle_Hair:": "https://cdn.discordapp.com/emojis/1131331922736455842.png?size=100",
        ":KoalMiner:": "https://cdn.discordapp.com/emojis/938641561409970186.png?size=100",
        ":LFG_LetsFlakingGo:": "https://cdn.discordapp.com/emojis/941142242360451164.png?size=100",
        ":LOL_Drake:": "https://cdn.discordapp.com/emojis/1103125007024013352.png?size=100",
        ":Lash_Out:": "https://cdn.discordapp.com/emojis/1098634081161449664.png?size=100",
        ":Laugh_Sensei:": "https://cdn.discordapp.com/emojis/1098373273869361233.png?size=100",
        ":LeChadder:": "https://cdn.discordapp.com/emojis/945043389710221342.png?size=100",
        ":LowRoll_Flak:": "https://cdn.discordapp.com/emojis/1098352957847765103.png?size=100",
        ":LumpOfKoal:": "https://cdn.discordapp.com/emojis/1314973531544748072.png?size=100",
        ":MadBeatsJake:": "https://cdn.discordapp.com/emojis/936685325386924062.png?size=100",
        ":Madder:": "https://cdn.discordapp.com/emojis/1099539231493337118.png?size=100",
        ":MaxPain:": "https://cdn.discordapp.com/emojis/941216734235467797.png?size=100",
        ":MaxStronk:": "https://cdn.discordapp.com/emojis/855159792536256569.png?size=100",
        ":MissileChan:": "https://cdn.discordapp.com/emojis/760196804540498011.png?size=100",
        ":Monke:": "https://cdn.discordapp.com/emojis/1390390281999880333.png?size=100",
        ":Mwahaha_Sturm:": "https://cdn.discordapp.com/emojis/1328806036999507978.png?size=100",
        ":NellLuckyStar:": "https://cdn.discordapp.com/emojis/1040313833757093990.png?size=100",
        ":Nell_glhf:": "https://cdn.discordapp.com/emojis/643778713636438027.png?size=100",
        ":NellDoro_SlotMachine:": "https://cdn.discordapp.com/emojis/1399059185718526012.gif?size=100",
        ":NellDoro:": "https://cdn.discordapp.com/emojis/1375223936261951599.png?size=100",
        ":NellInfinite:": "https://media1.tenor.com/m/MFu7yHgp4k8AAAAd/awbw-nelldoro.gif",
        ":NellDoro_Headpat:": "https://media.discordapp.net/stickers/1389956651255205930.webp?size=100&quality=lossless",
        ":NellDoro_Gray:": "https://cdn.discordapp.com/emojis/1384648714773205124.webp?size=100",
        ":NoMoney_Colin:": "https://cdn.discordapp.com/emojis/1102759826720817172.png?size=100",
        ":OOF:": "https://cdn.discordapp.com/emojis/705067072534872115.png?size=100",
        ":OlafConfused:": "https://cdn.discordapp.com/emojis/857799789445906453.png?size=100",
        ":Olaf_Tears:": "https://cdn.discordapp.com/emojis/1277770151894454316.png?size=100",
        ":Oof_Hachi:": "https://cdn.discordapp.com/emojis/1102761279510290492.png?size=100",
        ":Pain_Kanbei:": "https://cdn.discordapp.com/emojis/1093348753630576640.png?size=100",
        ":PossumSpitGrit:": "https://cdn.discordapp.com/emojis/1028180500973629460.png?size=100",
        ":Pouty_Lash:": "https://cdn.discordapp.com/emojis/1094116252118679592.png?size=100",
        ":PowerofMoney:": "https://cdn.discordapp.com/emojis/937565112015921272.png?size=100",
        ":Press_MaX_to_Doubt:": "https://cdn.discordapp.com/emojis/1098391064018161694.png?size=100",
        ":Proud_Colin:": "https://cdn.discordapp.com/emojis/1100493494411341917.png?size=100",
        ":RachelWink:": "https://cdn.discordapp.com/emojis/934127886674325564.png?size=100",
        ":Rachel_Thonk:": "https://cdn.discordapp.com/emojis/1186522275047022592.png?size=100",
        ":Rage_Sami:": "https://cdn.discordapp.com/emojis/1094767475373125662.png?size=100",
        ":RaisedEyebrow_Kanbei:": "https://cdn.discordapp.com/emojis/1034151124128768150.png?size=100",
        ":Really_BM:": "https://cdn.discordapp.com/emojis/933941281950949396.png?size=100",
        ":RichHachi:": "https://cdn.discordapp.com/emojis/937565012933890108.png?size=100",
        ":RocketNLoad:": "https://cdn.discordapp.com/emojis/917134818154803231.png?size=100",
        ":Roger_Colin:": "https://cdn.discordapp.com/emojis/325573948378972160.png?size=100",
        ":SCOpower:": "https://cdn.discordapp.com/emojis/852953758857953342.png?size=100",
        ":SadGE_inf:": "https://cdn.discordapp.com/emojis/520585397764620308.png?size=100",
        ":Sad_Grit:": "https://cdn.discordapp.com/emojis/325419692472926208.png?size=100",
        ":Sadder:": "https://cdn.discordapp.com/emojis/325607727881519106.png?size=100",
        ":SaluteGirl_YC_Inf:": "https://cdn.discordapp.com/emojis/1100180778232578088.png?size=100",
        ":SamiSwitch:": "https://cdn.discordapp.com/emojis/854874491393802241.png?size=100",
        ":Sami_Smile:": "https://cdn.discordapp.com/emojis/1056341596297244722.png?size=100",
        ":SantaOlaf:": "https://cdn.discordapp.com/emojis/1314973110281175101.png?size=100",
        ":SashaOMG:": "https://cdn.discordapp.com/emojis/1296982034505400380.png?size=100",
        ":SashaSmile:": "https://cdn.discordapp.com/emojis/950706588199559168.png?size=100",
        ":ScaredColin:": "https://cdn.discordapp.com/emojis/1282517125663162400.png?size=100",
        ":Scared_BH:": "https://cdn.discordapp.com/emojis/933202199536869486.png?size=100",
        ":SeriousColin:": "https://cdn.discordapp.com/emojis/942781164580655184.png?size=100",
        ":Shakefist_Andy:": "https://cdn.discordapp.com/emojis/1019082158771535932.png?size=100",
        ":ShoalPool:": "https://cdn.discordapp.com/emojis/911390709351858237.png?size=100",
        ":ShockedGrimm:": "https://cdn.discordapp.com/emojis/943705832766468208.png?size=100",
        ":Shrug_Hachi:": "https://cdn.discordapp.com/emojis/1045733595542724648.png?size=100",
        ":Smirk_Sensei:": "https://cdn.discordapp.com/emojis/325419741927964672.png?size=100",
        ":SmugColin:": "https://cdn.discordapp.com/emojis/940229355454476299.png?size=100",
        ":SmugEagle:": "https://cdn.discordapp.com/emojis/325608337305632768.png?size=100",
        ":SomberSalute_Sami:": "https://cdn.discordapp.com/emojis/580552533903409161.png?size=100",
        ":SonjaShades:": "https://cdn.discordapp.com/emojis/911393322919153734.png?size=100",
        ":Sonja_Shocked:": "https://cdn.discordapp.com/emojis/1371636998548226199.png?size=100",
        ":SpannIsland:": "https://cdn.discordapp.com/emojis/999072845940392058.png?size=100",
        ":Squak_CI_inf:": "https://cdn.discordapp.com/emojis/745706900015939594.png?size=100",
        ":StoicJess:": "https://cdn.discordapp.com/emojis/942096546919497778.png?size=100",
        ":SturmFist:": "https://cdn.discordapp.com/emojis/953823553424326706.png?size=100",
        ":SturmOut:": "https://cdn.discordapp.com/emojis/1305698974077816872.png?size=100",
        ":SubOptimal:": "https://cdn.discordapp.com/emojis/1315874019701952553.png?size=100",
        ":SurfinDrake:": "https://cdn.discordapp.com/emojis/1220523488889143336.png?size=100",
        ":Surprised_Jess:": "https://cdn.discordapp.com/emojis/1100597961160925254.png?size=100",
        ":Surprised_Lash:": "https://cdn.discordapp.com/emojis/966625937229758514.png?size=100",
        ":Sus_Impostor:": "https://cdn.discordapp.com/emojis/1001118787841572914.png?size=100",
        ":TCopRide:": "https://cdn.discordapp.com/emojis/915452885398085693.png?size=100",
        ":ThankTank:": "https://cdn.discordapp.com/emojis/760196782940225577.png?size=100",
        ":This_Andy:": "https://cdn.discordapp.com/emojis/1025367337962065971.png?size=100",
        ":TriggeredEagle:": "https://cdn.discordapp.com/emojis/1021264019962732626.png?size=100",
        ":True_Hawke:": "https://cdn.discordapp.com/emojis/1273399235139862591.png?size=100",
        ":TurboCharged_Jess:": "https://cdn.discordapp.com/emojis/1099184260780404849.png?size=100",
        ":UnitCap_Sensei:": "https://cdn.discordapp.com/emojis/1042575856880590978.png?size=100",
        ":Vibing_GS:": "https://cdn.discordapp.com/emojis/933940003984277554.png?size=100",
        ":VictoryMarch:": "https://cdn.discordapp.com/emojis/1024433528236146810.png?size=100",
        ":VonBowl:": "https://cdn.discordapp.com/emojis/940690530449383454.png?size=100",
        ":VonBulb:": "https://cdn.discordapp.com/emojis/1066546447237001306.png?size=100",
        ":WN_MechSpam:": "https://cdn.discordapp.com/emojis/1315872277056716860.png?size=100",
        ":What_YC:": "https://cdn.discordapp.com/emojis/933422136872304760.png?size=100",
        ":Wingman_Waylon:": "https://cdn.discordapp.com/emojis/888142369172627517.png?size=100",
        ":Wink_Kindle:": "https://cdn.discordapp.com/emojis/385654699279253505.png?size=100",
        ":Wisecrack_Grit:": "https://cdn.discordapp.com/emojis/1098381464577515653.png?size=100",
        ":WorriedHachi:": "https://cdn.discordapp.com/emojis/937235358704365608.png?size=100",
        ":Worried_Drake:": "https://cdn.discordapp.com/emojis/325574058953670658.png?size=100",
        ":YeahSure_Jake:": "https://cdn.discordapp.com/emojis/1126968024453361725.png?size=100",
        ":YouWot_Grit:": "https://cdn.discordapp.com/emojis/933405408205361222.png?size=100",
        ":Zombie_Sensei:": "https://cdn.discordapp.com/emojis/1223127068175372328.png?size=100",
        ":angry_koal:": "https://cdn.discordapp.com/emojis/385649720485478410.png?size=100",
        ":annoyed_rachel:": "https://cdn.discordapp.com/emojis/385660982044786688.png?size=100",
        ":any:": "https://cdn.discordapp.com/emojis/890403723342405652.png?size=100",
        ":bitter_nell:": "https://cdn.discordapp.com/emojis/585983754724573205.png?size=100",
        ":bmbboat:": "https://cdn.discordapp.com/emojis/870920521544519720.png?size=100",
        ":drakenshake:": "https://cdn.discordapp.com/emojis/854459929946226738.png?size=100",
        ":embarrassed_jess:": "https://cdn.discordapp.com/emojis/325608309887598592.png?size=100",
        ":gasp_nell:": "https://cdn.discordapp.com/emojis/585986549917941770.png?size=100",
        ":happy_hachi:": "https://cdn.discordapp.com/emojis/325608462908129280.png?size=100",
        ":happy_max:": "https://cdn.discordapp.com/emojis/385656510698618890.png?size=100",
        ":happy_nell:": "https://cdn.discordapp.com/emojis/934815103730192444.png?size=100",
        ":hasnofeelings_sturm:": "https://cdn.discordapp.com/emojis/325947988188987392.png?size=100",
        ":hf:": "https://cdn.discordapp.com/emojis/890404234112159764.png?size=100",
        ":hmm_olaf:": "https://cdn.discordapp.com/emojis/325607810476015616.png?size=100",
        ":osbboat:": "https://cdn.discordapp.com/emojis/870805502802669588.png?size=100",
        ":shocked_sami:": "https://cdn.discordapp.com/emojis/325608265448816643.png?size=100",
        ":shook_kanbei:": "https://cdn.discordapp.com/emojis/557425447651246081.png?size=100",
        ":std:": "https://cdn.discordapp.com/emojis/890403004614860830.png?size=100",
        ":stern_hawke:": "https://cdn.discordapp.com/emojis/580551903809634325.png?size=100",
        ":stoic_javier:": "https://cdn.discordapp.com/emojis/385659523181969409.png?size=100",
        ":sturmkart:": "https://cdn.discordapp.com/emojis/859258795968299079.png?size=100",
        ":surprisekiss_sturm:": "https://cdn.discordapp.com/emojis/326351964336291841.png?size=100",
        ":thinking_lin:": "https://cdn.discordapp.com/emojis/877392297170440275.png?size=100",
        ":thistbh:": "https://cdn.discordapp.com/emojis/1044824685663244318.png?size=100",
        ":unimpressed_jake:": "https://cdn.discordapp.com/emojis/385658779464892418.png?size=100",
        ":working_bot:": "https://cdn.discordapp.com/emojis/580551904183189514.png?size=100",
        ":BigMonke:": "https://cdn.discordapp.com/emojis/1382114663961071656.webp?size=100&animated=true",
        ":BooHoo_Sturm:": "https://cdn.discordapp.com/emojis/1382114851425357894.gif?size=100",
        ":Boom_Explosion:": "https://cdn.discordapp.com/emojis/1382114518058143875.webp?size=100&animated=true",
        ":Caesar_Happy:": "https://cdn.discordapp.com/emojis/579454151696842752.gif?size=100",
        ":DoomPengus:": "https://cdn.discordapp.com/emojis/865011667002589224.gif?size=100",
        ":Flag10_JS:": "https://cdn.discordapp.com/emojis/1223129529011277885.gif?size=100",
        ":Flag11_CI:": "https://cdn.discordapp.com/emojis/1223129545893351476.gif?size=100",
        ":Flag12_PC:": "https://cdn.discordapp.com/emojis/1223129555418480650.gif?size=100",
        ":Flag13_TG:": "https://cdn.discordapp.com/emojis/1223130004247019520.gif?size=100",
        ":Flag14_PL:": "https://cdn.discordapp.com/emojis/1223130023305805856.gif?size=100",
        ":Flag15_AR:": "https://cdn.discordapp.com/emojis/1223130036954075136.gif?size=100",
        ":Flag16_WN:": "https://cdn.discordapp.com/emojis/1223130050006876191.gif?size=100",
        ":Flag17_AA:": "https://cdn.discordapp.com/emojis/1234057073151442954.gif?size=100",
        ":Flag18_NE:": "https://cdn.discordapp.com/emojis/1304083510247690293.gif?size=100",
        ":Flag19_SC:": "https://cdn.discordapp.com/emojis/1304083538555043861.gif?size=100",
        ":Flag1_OS:": "https://cdn.discordapp.com/emojis/1223128030004772954.gif?size=100",
        ":Flag20_UW:": "https://cdn.discordapp.com/emojis/1382114010635309056.gif?size=100",
        ":Flag2_BM:": "https://cdn.discordapp.com/emojis/1223128274243420180.gif?size=100",
        ":Flag3_GE:": "https://cdn.discordapp.com/emojis/1223128607535267892.gif?size=100",
        ":Flag4_YC:": "https://cdn.discordapp.com/emojis/1223128618536927242.gif?size=100",
        ":Flag5_BH:": "https://cdn.discordapp.com/emojis/1223128631056928959.gif?size=100",
        ":Flag6_RF:": "https://cdn.discordapp.com/emojis/1223129097321054229.gif?size=100",
        ":Flag7_GS:": "https://cdn.discordapp.com/emojis/1223129109258043423.gif?size=100",
        ":Flag8_BD:": "https://cdn.discordapp.com/emojis/1223129124013473833.gif?size=100",
        ":Flag9_AB:": "https://cdn.discordapp.com/emojis/1223129159153225729.gif?size=100",
        ":G_Signal:": "https://cdn.discordapp.com/emojis/1382114292136017950.gif?size=100",
        ":GooMechGo:": "https://cdn.discordapp.com/emojis/1382114224658186290.gif?size=100",
        ":GrimmIntensifies:": "https://cdn.discordapp.com/emojis/674075940019634195.gif?size=100",
        ":Grimmier:": "https://cdn.discordapp.com/emojis/869723639539466261.gif?size=100",
        ":Grin_Eagle:": "https://cdn.discordapp.com/emojis/1100945089154527304.gif?size=100",
        ":ILaughAtYouNow_Sturm:": "https://cdn.discordapp.com/emojis/1382114793581969580.gif?size=100",
        ":Kanbei_happy:": "https://cdn.discordapp.com/emojis/579458525307338755.gif?size=100",
        ":MechaDino:": "https://cdn.discordapp.com/emojis/1382114329020858582.gif?size=100",
        ":Nooo:": "https://cdn.discordapp.com/emojis/1382114267989545043.gif?size=100",
        ":Sandy:": "https://cdn.discordapp.com/emojis/579458525437231104.gif?size=100",
        ":Sneaky:": "https://cdn.discordapp.com/emojis/864966048193052713.gif?size=100",
        ":SturmKartSelect:": "https://cdn.discordapp.com/emojis/1382114196187254945.gif?size=100",
        ":WGSami:": "https://cdn.discordapp.com/emojis/632433510539329537.gif?size=100",
        ":drake_booty:": "https://cdn.discordapp.com/emojis/579458525101686806.gif?size=100",
        ":good_rng:": "https://cdn.discordapp.com/emojis/579458525600677906.gif?size=100",
        ":grit_smug:": "https://cdn.discordapp.com/emojis/579458525596483588.gif?size=100",
        ":max_blast:": "https://cdn.discordapp.com/emojis/579458525441294347.gif?size=100",
        ":olaf_smirk:": "https://cdn.discordapp.com/emojis/579458525135110175.gif?size=100",
        ":sad_olaf:": "https://cdn.discordapp.com/emojis/579458526842454026.gif?size=100",
        ":sami_victory:": "https://cdn.discordapp.com/emojis/579458525151887371.gif?size=100",
        ":santa_sad:": "https://cdn.discordapp.com/emojis/579458525474848768.gif?size=100",
        ":smoke_sturm:": "https://cdn.discordapp.com/emojis/536186609217961984.gif?size=100",
        ":soaring_eagle:": "https://cdn.discordapp.com/emojis/579458525214932994.gif?size=100",
        ":sonja_smile:": "https://cdn.discordapp.com/emojis/579458525617455104.gif?size=100",
        ":sticker_Sticker,_⭐_Olaf's_Fury,_:": "https://media.discordapp.net/stickers/1402255046422433824.png?size=240",
        ":sticker_Sticker,_Hmm,_Nice_HQ!,_Be_a_shame_if_something_happened_to_it!:": "https://media.discordapp.net/stickers/1072737826283716669.png?size=240",
        ":sticker_Sticker,_Oh_No!,_Oh_no,_my_tank!:": "https://media.discordapp.net/stickers/915041125251821619.png?size=240",
        ":sticker_Sticker,_Kindle_Super,_High_Societyyyy!_:": "https://media.discordapp.net/stickers/911392402772733983.png?size=240",
        ":sticker_Sticker,_Olaf_Send_Link,_:": "https://media.discordapp.net/stickers/1268545405214265445.gif?size=240",
        ":sticker_Sticker,_⭐_Jugger_Prime_,_:": "https://media.discordapp.net/stickers/1401285808891105362.gif?size=240",
        ":sticker_Sticker,_Missile-Chan_Dance,_Permission_received_from_artist:_https://twitter.com/NCHproductions:": "https://media.discordapp.net/stickers/1157254342269743114.png?size=240",
        ":sticker_Sticker,_Chadder,_:": "https://media.discordapp.net/stickers/899862255200526346.png?size=240",
        ":sticker_Sticker,_Strut_Kanbei,_They_see_me_walking,_they_hatin!:": "https://media.discordapp.net/stickers/1021960280810467438.png?size=240",
        ":sticker_Sticker,_Power_of_Tower,_:": "https://media.discordapp.net/stickers/930990803596226611.png?size=240",
        ":sticker_Sticker,_The_\"Hawke\"_Johnson,_:": "https://media.discordapp.net/stickers/1189331240759869582.png?size=240",
        ":sticker_Sticker,_Sitting_on_Cities_,_Young_whippersnappers_:": "https://media.discordapp.net/stickers/933040279118827562.png?size=240",
        ":sticker_Sticker,_Hachi_Stronks_Up,_Market_Crash:": "https://media.discordapp.net/stickers/1024730056414724207.png?size=240",
        ":sticker_Sticker,_Sturm_Warning,_Scattered_showers_and_a_chance_of_DEATH!!!:": "https://media.discordapp.net/stickers/1024514184744013884.png?size=240",
        ":sticker_Sticker,_Eagle_Grin,_Eagle_Grin:": "https://media.discordapp.net/stickers/865316024214749236.png?size=240",
        ":sticker_Sticker,_Yeah_Boi_Jake,_:": "https://media.discordapp.net/stickers/932680719547916288.png?size=240",
        ":sticker_Sticker,_Broken_Max,_Oh_no,_Max_looks_sad:": "https://media.discordapp.net/stickers/982009265965371394.png?size=240",
        ":sticker_Sticker,_MaP_dEpEnDEnT,_It's_MaP_DepEnDEnT:": "https://media.discordapp.net/stickers/884998800450674698.png?size=240",
        ":sticker_Sticker,_JESS_She_Can!,_But_can_she_though?!_:": "https://media.discordapp.net/stickers/1052067797699670106.png?size=240",
        ":sticker_Sticker,_Sonja_Headpats,_:": "https://media.discordapp.net/stickers/1191498781879971970.png?size=240",
        ":sticker_Sticker,_Eagle_Pog,_Eagle_Pog:": "https://media.discordapp.net/stickers/865007175373684736.png?size=240",
        ":sticker_Sticker,_Nell_Smiles,_Nell_Smiles:": "https://media.discordapp.net/stickers/865313046750167050.png?size=320",
        ":sticker_Sticker,_Winter_Is_Coming,_Winter_is_Coming:": "https://media.discordapp.net/stickers/870091457241972756.png?size=240",
        ":sticker_Sticker,_Jugger_Spin,_:": "https://media.discordapp.net/stickers/899528896364576828.png?size=240",
        ":sticker_Sticker,_Drake_Peter,_Hey_Lois!_I'm_a_CO_now!_I_could_even_build_a_boat.:": "https://media.discordapp.net/stickers/911393972331626506.png?size=240",
        ":sticker_Sticker,_Sacks,_Sacks_sticker,_oh_no_:": "https://media.discordapp.net/stickers/911397326373941298.png?size=240",
        ":sticker_Sticker,_Andy'll_fix_it,_He_might_not_know_what_an_airport_is,_but_he_can_still_fix_airplanes_:": "https://media.discordapp.net/stickers/911411093551841321.png?size=240",
        ":sticker_Sticker,_Eat_Free_Dudes,_Eat_Free_Dudes,_Woah_Whoa_:": "https://media.discordapp.net/stickers/915041510758707220.png?size=240",
        ":sticker_Sticker,_Grimm's_Cracker_Tank,_Grimm_has_no_brakes_and_all_gas:": "https://media.discordapp.net/stickers/915042999011016704.png?size=240",
        ":sticker_Sticker,_Popcorn_Pengu,_Mmmmm,_Popcorn:": "https://media.discordapp.net/stickers/916765803074973727.png?size=240",
        ":sticker_Sticker,_Sen-Tzu,_:": "https://media.discordapp.net/stickers/919524365798875156.png?size=240",
        ":sticker_Sticker,_Kindle_Tee_Hee_Hee,_Tee_Hee_Hee:": "https://media.discordapp.net/stickers/921988482409308190.png?size=240",
        ":sticker_Sticker,_Arty_SPAM,_:": "https://media.discordapp.net/stickers/931809205629894707.png?size=240",
        ":sticker_Sticker,_Rocket_Girl_Rachel,_Yeeeee-Haaaaaw!!!:": "https://media.discordapp.net/stickers/933750973074145340.png?size=240",
        ":sticker_Sticker,_They're_Grrrit!,_:": "https://media.discordapp.net/stickers/934591343290896466.png?size=240",
        ":sticker_Sticker,_Salt_Bei,_:": "https://media.discordapp.net/stickers/937089142439956502.png?size=240",
        ":sticker_Sticker,_Sturm_YES!,_:": "https://media.discordapp.net/stickers/941727905787052043.png?size=240",
        ":sticker_Sticker,_Let's_Go_Flak,_Let's_Go_Beeches!!!:": "https://media.discordapp.net/stickers/942093278969487410.png?size=240",
        ":sticker_Sticker,_That_Face_When...,_Oh_Noes!_You_broke_through_my_wall!:": "https://media.discordapp.net/stickers/956714739487113286.png?size=240",
        ":sticker_Sticker,_Worth_it_Flak,_Flak_Approved:": "https://media.discordapp.net/stickers/992543540800397403.png?size=240",
        ":sticker_Sticker,_Clone_Andy,_Knows_what_an_airport_is:": "https://media.discordapp.net/stickers/1021971606702141630.png?size=240",
        ":sticker_Sticker,_Adder_Comin_Atcha!!!,_SIDESLIIIIIP!!!:": "https://media.discordapp.net/stickers/1062818946065104936.png?size=240",
        ":sticker_Sticker,_Koal,_Road_Warrior,_Hail_to_the_King_Baby!_:": "https://media.discordapp.net/stickers/1066063830368665630.png?size=240",
        ":sticker_Sticker,_Excited_Lash,_Lash_is_excited!_Are_YOU?!:": "https://media.discordapp.net/stickers/1094033384482811924.png?size=240",
        ":sticker_Sticker,_NO_U!,_:": "https://media.discordapp.net/stickers/1099338797608616057.png?size=240",
        ":sticker_Sticker,_Yeet_your_troops_NOW!,_:": "https://media.discordapp.net/stickers/1103896411612921926.png?size=240",
        ":sticker_Sticker,_STOP_IT!!!,_Permission_received_from_artist:_https://twitter.com/nekoznekoVEVO:": "https://media.discordapp.net/stickers/1152033392020439050.png?size=240",
        ":sticker_Sticker,_Rachel_was_Sturm!!!,_:": "https://media.discordapp.net/stickers/1183999834441666570.png?size=240",
        ":sticker_Sticker,_Jess_Headcannon_⭐,_:": "https://media.discordapp.net/stickers/1184154162213158935.png?size=240",
        ":sticker_Sticker,_Kindle_again⭐,_People_just_talk_about_Kindle_so_much._:": "https://media.discordapp.net/stickers/1240134069740638229.png?size=240",
        ":sticker_Sticker,_Oh_You!_(Hawke_&_Lash)_⭐,_:": "https://media.discordapp.net/stickers/1283498204561936477.png?size=240",
        ":sticker_Sticker,_Rock_the_Block_Jake_⭐,_:": "https://media.discordapp.net/stickers/1306822791982616639.png?size=240",
        ":sticker_Sticker,_Trust_Grimm,_:": "https://media.discordapp.net/stickers/1343586354130456587.png?size=240",
        ":sticker_Sticker,_Cash_Money_Colin!,_:": "https://media.discordapp.net/stickers/1364055591877873717.gif?size=240",
        ":sticker_Sticker,_Speedrunner_Grimm,_:": "https://media.discordapp.net/stickers/1374185750332964884.png?size=240",
        ":sticker_Sticker,_Sami_No_Victory_March_⭐,_:": "https://media.discordapp.net/stickers/1401285443953229844.png?size=240",
        ":sticker_Sticker,_⭐_GS_Finger_Guns_,_:": "https://media.discordapp.net/stickers/1401285649876652033.png?size=240",
        ":sticker_Sticker,_⭐_Sasha_War_Funds_,_:": "https://media.discordapp.net/stickers/1401286479665299527.png?size=240",
        ":sticker_Sticker,_⭐_Ghost_Koal_,_:": "https://media.discordapp.net/stickers/1401286890652700712.png?size=240",
        ":sticker_Sticker,_Sasha_Hug,_Woah,_Big_Sister_Sasha!:": "https://media.discordapp.net/stickers/873365332318879776.png?size=240",
        ":sticker_Sticker,_Your_Turn_Nell:": "https://media.discordapp.net/stickers/982057761707819098.webp?size=240",
        ":sticker_Sticker,_Koal_ROAD_ROLLER_DA!!!:": "https://media.discordapp.net/stickers/1347023891415171083.gif?size=240",
    };

    function renderChatMessage(html) {
        // Convert &nbsp; to normal spaces
        html = html.replace(/&nbsp;/g, ' ');

        // Replace emoji codes with images
        Object.entries(gifMap).forEach(([code, url]) => {
            const imgTag = `<img src="${url}"
            alt="${code}"
            style="width:60px; vertical-align:middle;">`;
            html = html.replaceAll(code, imgTag);
        });

        return html;
    }

    function makeDraggable(element) {
        let isDragging = false;
        let offsetX = 0, offsetY = 0;
        const resizeMargin = 10; // px from edges to reserve for resizing

        element.addEventListener('mousedown', function(e) {
            // Only left-click drag
            if (e.button !== 0) return;

            if (e.target.closest('textarea, input, select, label')) return;

            const rect = element.getBoundingClientRect();
            const onRightEdge = e.clientX > rect.right - resizeMargin;
            const onBottomEdge = e.clientY > rect.bottom - resizeMargin;

            // If clicking near the right/bottom edge, let resize happen
            if (onRightEdge || onBottomEdge) return;

            isDragging = true;
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            element.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
            element.style.right = '';
            element.style.bottom = '';
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'grab';
            }
        });

        element.style.cursor = 'grab';
        element.style.position = 'fixed';
    }
    function injectChatBox() {
        chatContainer = document.createElement('div');
        chatContainer.id = 'awbw-chat-container';
        chatContainer.style.cssText = `
    position: fixed;
    top: 60px;
    right: 20px;
    width: 350px;
    height: 300px;
    background: #f9f9f9;
    border: 2px solid #aaa;
    border-radius: 10px;
    padding: 10px;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    resize: both;
    overflow: auto;
    min-width: 200px;
    min-height: 150px;
`;

        chatContainer.style.resize = 'both';
        chatContainer.style.overflow = 'auto';
        document.body.appendChild(chatContainer);

        sendMessageContainer = document.createElement('div');
        sendMessageContainer.id = 'awbw-send-message-container';
        sendMessageContainer.style.cssText = `
        position: fixed;
        top: 400px;
        right: 20px;
        width: 500px;
        max-height: 270px;
        overflow-y: auto;
        background: #f9f9f9;
        border: 1px solid #aaa;
        border-radius: 10px;
        padding: 10px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
        sendMessageContainer.style.resize = 'both';
        sendMessageContainer.style.overflow = 'auto';
        document.body.appendChild(sendMessageContainer);

        toggleButton = document.createElement('button');
        toggleButton.innerHTML = 'Game Chat💬 <span id="awbw-unread-badge"></span>';
        toggleButton.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        z-index: 1001;
        background: #0066cc;
        color: white;
        padding: 5px 10px;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
    `;
        toggleButton.onclick = toggleChatVisibility;
        document.body.appendChild(toggleButton);

        badge = toggleButton.querySelector('#awbw-unread-badge');
        badge.style.marginLeft = '5px';

        const emptyChat = document.createElement('div');
        emptyChat.id = 'awbw-empty-chat';
        emptyChat.textContent = 'No chat yet';
        emptyChat.style.cssText = `
    text-align: center;
    color: #888;
    margin-top: 40px;
    font-size: 14px;
`;
        chatContainer.appendChild(emptyChat);


        // Make draggable
        makeDraggable(chatContainer);
        makeDraggable(sendMessageContainer);
        makeDraggable(toggleButton);
    }

    function toggleChatVisibility() {
        isChatHidden = !isChatHidden;
        chatContainer.style.display = isChatHidden ? 'none' : 'block';
        if (isYourChat) {
            sendMessageContainer.style.display = isChatHidden ? 'none' : 'block';
        }
        if (!isChatHidden) {
            unreadCount = 0;
            updateBadge();
            removeNewMessagePopup();
        }
    }

    function updateBadge() {
        badge.textContent = unreadCount > 0 ? `(${unreadCount})` : '';
    }

    function isUserAtBottom() {
        // How close to the bottom counts as "at the bottom"
        const threshold = 150;
        if (chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < threshold) {
            return true;
        }
        return false;
    }

    function updateEmptyChatState() {
        const empty = document.getElementById('awbw-empty-chat');
        const bubbles = chatContainer.querySelectorAll('.bubble');

        if (!empty) return;

        empty.style.display = bubbles.length === 0 ? 'block' : 'none';
    }

    async function refreshChat() {
        removeNewMessagePopup();
        updateEmptyChatState();
        return fetch(chatUrl)
            .then(res => res.text())
            .then(html => {
            const tempDOM = new DOMParser().parseFromString(html, 'text/html');
            const rawMessages = tempDOM.querySelectorAll('table[id^="showmsg_"]');
            const currentMessageInChatContainer = chatContainer.querySelectorAll('.bubble').length;

            if (rawMessages.length > currentCount && isChatHidden) {
                unreadCount += rawMessages.length - currentCount;
                updateBadge();
            }

            if (rawMessages.length > currentMessageInChatContainer) {
                const newMessages = Array.from(rawMessages).slice(currentMessageInChatContainer); // Only the new ones

                newMessages.forEach(msg => {
                    chatContainer.appendChild(transformToBubble(msg));
                });

                if (!isChatHidden) {
                    const isBottom = isUserAtBottom();

                    if (isBottom) {
                        chatContainer.scrollTop = chatContainer.scrollHeight;
                    }
                }
            }

            currentCount = rawMessages.length;
        });
    }

    function getToPlayers(fromCell) {
        const toPlayers = [];
        const bTo = Array.from(fromCell.querySelectorAll('b'))
        .find(b => b.textContent.trim().startsWith('To:'));

        if (bTo) {
            // Iterate over the siblings after the <b>To:</b> until we hit another <b> or end
            let node = bTo.nextSibling;
            while (node) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.tagName === 'B') break; // stop if next section starts
                    if (node.tagName === 'IMG') {
                        // Get the next text node after the <img> for the name
                        let nameNode = node.nextSibling;
                        while (nameNode && nameNode.nodeType !== Node.TEXT_NODE) {
                            nameNode = nameNode.nextSibling;
                        }
                        if (nameNode) {
                            const name = nameNode.textContent.trim();
                            if (name) toPlayers.push(name);
                        }
                    }
                }
                node = node.nextSibling;
            }
        }

        return toPlayers.length !== 0 ? toPlayers : ["All Player"];
    }

    function transformToBubble(msgTable) {
        const fromCell = msgTable.querySelector('td:first-child');
        const messageCell = msgTable.querySelector('td:last-child');
        const senderMatch = fromCell?.innerText?.match(/From:\s*(.+)/u);
        const sender = senderMatch ? senderMatch[1] : 'Unknown';
        const toPlayers = getToPlayers(fromCell);

        const isSelf = sender === userName;

        // Find timestamp
        let time = '';
        let timeElem = msgTable.closest('tr')?.previousElementSibling;
        if (timeElem) {
            const timeSpan = timeElem.querySelector('.small_text');
            if (timeSpan) {
                time = timeSpan.textContent.trim();
            }
        }

        const bubble = document.createElement('div');
        bubble.className = isSelf ? 'bubble right' : 'bubble left';
        bubble.innerHTML = `
        <div class="sender"><strong>From: ${sender}</strong></div>
        <div class="receiver">To: ${toPlayers.join(', ')}</div>
        <div class="content">${renderChatMessage(messageCell.innerHTML)}</div>
        <div class="timestamp">${time}</div>
    `;

        return bubble;
    }

    function injectStyle() {
        const style = document.createElement('style');
        style.textContent = `
        .bubble {
            max-width: 80%;
            padding: 10px;
            border-radius: 10px;
            margin: 6px;
            position: relative;
            background: #ffffff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            word-wrap: break-word;
            font-size: 14px;
        }
        .bubble.right {
            background: #dcf8c6;
            margin-left: auto;
            text-align: left;
        }
        .bubble.left {
            background: #f1f0f0;
            margin-right: auto;
            text-align: left;
        }
        .bubble .sender {
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 12px;
        }
        .bubble .receiver {
            margin-bottom: 10px;
            color: blue;
            font-size: 12px;
            border-bottom: 2px solid #000;
        }
        .timestamp {
            font-size: 0.7em;
            color: gray;
            text-align: right;
            margin-top: 4px;
        }
    `;
        document.head.appendChild(style);
    }

    async function fetchAndInsertMessageForm(container, gamesId) {
        const response = await fetch(`/press.php?games_id=${gamesId}`);
        const text = await response.text();
        const dom = new DOMParser().parseFromString(text, 'text/html');

        // Get all recipients
        const checkboxes = dom.querySelectorAll('input[name="press_to_players_id[]"]');
        const users = Array.from(checkboxes).map(cb => {
            const img = cb.parentNode.querySelector(`input[value="${cb.value}"] + img`);
            const anchor = img?.nextElementSibling;

            return {
                id: cb.value,
                name: anchor?.textContent?.trim() || 'Unknown',
                logo: img?.getAttribute('src')?.split('/').pop() || '',
            };
        });

        // Your player ID
        const playersIdInput = dom.querySelector('input[name="players_id"]');
        const playersId = playersIdInput?.value || '';


        const uniqId = dom.querySelector('input[name="uniq_id"]')?.value || '';

        chatContainer.scrollTop = chatContainer.scrollHeight;

        if (users.length == 0) {
            isYourChat = false;
            sendMessageContainer = null;
            return;
        }

        // Insert form
        createMessageForm(container, gamesId, playersId, uniqId, users);
    }

    // Create emoji button container
    function createEmojiPicker() {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '4px';
        container.style.marginTop = '5px';
        container.style.border = '1px solid #ccc';
        container.style.padding = '5px';
        container.style.maxHeight = '120px';
        container.style.overflowY = 'auto';
        container.style.background = '#fff';
        container.style.borderRadius = '6px';

        // Add emojis from Map
        gifMap.forEach((url, code) => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = code;
            img.title = code;
            img.style.width = '24px';
            img.style.height = '24px';
            img.style.cursor = 'pointer';

            img.addEventListener('click', () => {
                const textarea = document.querySelector('#message-textarea'); // Change selector to your textarea
                if (textarea) {
                    textarea.value += code + ' ';
                    textarea.focus();
                }
            });

            container.appendChild(img);
        });

        return container;
    }

    function createMessageForm(container, gamesId, playersId, uniqId, users) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/press.php';
        form.style.marginTop = '10px';
        form.style.borderTop = '1px solid #ccc';
        form.style.paddingTop = '10px';

        let userCheckboxes = '';
        users.forEach(user => {
            const isSelf = user.id === playersId;

            userCheckboxes += `
        <label style="margin-right: 10px; display: inline-flex; align-items: center;">
            <input
                type="checkbox"
                name="press_to_players_id[]"
                value="${user.id}"
                ${!isSelf ? 'checked' : ''}
            >
            <img src="terrain/ani/${user.logo}"
                 style="width:20px;height:20px;margin-right:3px;">
            ${user.name}
        </label>
    `;
        });

        form.innerHTML = `
    <div style="display: flex; flex-wrap: wrap; gap: 8px; max-height: 75px; overflow-y: auto; padding: 4px; border: 1px solid #ccc; background: #fafafa;">
        ${userCheckboxes}
    </div>
    <div style="margin-top: 5px; display: flex; gap: 5px;">
    <button type="button" id="emoji-btn" style="padding: 4px 8px;">😊</button>
        <textarea class="press" name="press_text" rows="5" style="flex: 1;" required></textarea>
    </div>
    <input type="hidden" name="players_id" value="${playersId}">
    <input type="hidden" name="games_id" value="${gamesId}">
    <input type="hidden" name="uniq_id" value="${uniqId}">
    <div style="margin-top: 10px; text-align: right;">
        <input type="submit" class="submit" value="Send Message">
    </div>
    `;

        // Create popup container for emojis
        const popup = document.createElement("div");
        popup.id = "emoji-popup";
        popup.style.position = "absolute";
        popup.style.width = "500px";
        popup.style.maxHeight = "150px";
        popup.style.overflowY = "auto";
        popup.style.background = "#fff";
        popup.style.border = "1px solid #ccc";
        popup.style.padding = "5px";
        popup.style.display = "flex";
        popup.style.flexWrap = "wrap";
        popup.style.gap = "5px";
        popup.style.zIndex = "9999";
        popup.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";

        // Position popup above the button
        const rect = popup.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

        popup.style.left = (rect.left + scrollLeft) + "px";
        popup.style.top = (rect.top + scrollTop - 210) + "px";

        // Populate popup with gifMap emojis
        for (const [code, url] of Object.entries(gifMap)) {
            const img = document.createElement("img");
            img.src = url;
            img.alt = code;
            img.title = code;
            img.style.width = "32px";
            img.style.height = "32px";
            img.style.cursor = "pointer";
            img.addEventListener("click", () => {
                const textarea = form.querySelector(".press");
                textarea.value += ` ${code} `;
                popup.style.display = "none";
            });
            popup.appendChild(img);
        }

        // Append popup to body
        document.body.appendChild(popup);

        // Show popup on button click
        form.querySelector("#emoji-btn").addEventListener("click", (e) => {
            const rect = e.target.getBoundingClientRect();
            const popupWidth = popup.offsetWidth; // get actual width

            popup.style.top = `${rect.top + window.scrollY}px`;
            popup.style.left = `${rect.left + window.scrollX - popupWidth - 520}px`; // shift left with small gap

            popup.style.display = popup.style.display === "none" ? "flex" : "none";
        });

        // Hide popup if clicking outside
        document.addEventListener("click", (e) => {
            if (!popup.contains(e.target) && e.target.id !== "emoji-btn") {
                popup.style.display = "none";
            }
        });

        // Handle form submission
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            const selected = form.querySelectorAll('input[name="press_to_players_id[]"]:checked');
            if (selected.length === 0) {
                alert("Please select at least one player before sending a message.");
                return;
            }

            const formData = new FormData(form);

            const res = await fetch(form.action, {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                console.log("Message sent without page reload");
                form.querySelector('.press').value = '';
                refreshChat().then(() => {
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                });
            } else {
                console.error("Message send failed");
            }
        });

        container.appendChild(form);
    }

    function removeNewMessagePopup() {
        document.querySelectorAll('.game-tools-btn.msg-warning')
            .forEach(el => el.remove());
    }

    function main() {
        injectStyle();
        injectChatBox();
        refreshChat().then(updateEmptyChatState);
        const originalLog = console.log;

        function customLog(...args) {
            // Detect the specific notification object
            if (args.length > 0 && typeof args[0] === 'object') {
                const data = args[0];
                if (data.Notification?.action === 'Notification' && data.Notification?.newMessage) {
                    refreshChat();
                }
            }

            // Pass everything through to original log
            originalLog.apply(console, args);
        }

        // Hook into console.log
        console.log = customLog;

        // Auto-unhook when navigating away / closing tab
        window.addEventListener('beforeunload', () => {
            console.log = originalLog;
        });

        const gamesId = new URLSearchParams(window.location.search).get('games_id');
        fetchAndInsertMessageForm(sendMessageContainer, gamesId);
        toggleChatVisibility();
    }

    main();
})();
