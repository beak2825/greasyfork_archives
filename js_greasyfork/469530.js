// ==UserScript==
// @name        PTT Sites Redirection
// @namespace   Userscript
// @version     0.1.11
// @license     MIT
// @author      CY Fung
// @run-at      document-start
// @grant       GM_registerMenuCommand
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.deleteValue
// @grant       GM_addValueChangeListener
//
// @match       https://www.ptt.cc/bbs/*
// @match       https://www.pttweb.cc/*
// @match       https://disp.cc/ptt/*
// @match       https://disp.cc/b/*
// @match       https://hotptt.com/*
// @match       https://moptt.tw/p/*
// @match       https://ptthito.com/*
// @match       https://webptt.com/*
// @match       https://pttweb.tw/*
// @match       http://www.ucptt.com/*
// @match       https://www.ucptt.com/*
//
// @match       https://pttent.com/*
// @match       https://pttgame.com/*
// @match       https://pttdigit.com/*
// @match       https://pttlocal.com/*
// @match       https://pttcomic.com/*
//
// @match       https://webptt.findrate.tw/bbs/*
//
// @match       https://www.ptt.cc/ask/over18?from=*
//
// @description Redirects PTT URLs to other sites
//
// @downloadURL https://update.greasyfork.org/scripts/469530/PTT%20Sites%20Redirection.user.js
// @updateURL https://update.greasyfork.org/scripts/469530/PTT%20Sites%20Redirection.meta.js
// ==/UserScript==

(() => {


  /**
   * To obtain the full list of boards.



https://webptt.com/Hot.html


window.m33t = 'td:first-child a[href*="bbs/"]';
window.ss3 = new Set();

window.n33g = (a)=>a.map(e=>e.textContent).filter(x=>/^[\x20-\xFF]+$/.test(x)).filter(x=>!/[\s\,\|]/.test(x))

setInterval(()=>{
for(const t of window.n33g([...document.querySelectorAll(window.m33t)])) window.ss3.add(t);
},1);

[...ss3.keys()];

[...ss3.keys()].join(',').replace(/(\b.{100,120}\b,)/g,'$1\n');




https://illya.tw/data/ptt


window.m33t = 'a[href*="/data/ptt/"] >div >div:first-child';
window.ss3 = new Set();

window.n33g = (a)=>a.map(e=>e.textContent.trim()).filter(x=>/^[\x20-\xFF]+$/.test(x)).filter(x=>!/[\s\,\|]/.test(x))

setInterval(()=>{
for(const t of window.n33g([...document.querySelectorAll(window.m33t)])) window.ss3.add(t);
},1);

[...ss3.keys()];

[...ss3.keys()].join(',').replace(/(\b.{100,120}\b,)/g,'$1\n');



   *
   * */

  const NO_BUTTON_FOR_CACHER = true;

  const lowerCaseMatcher = (() => {

    const fullBoards = `

ALLPOST,AC_Sale,Accounting,Actuary,ai-photo,AllTogether,AnimalGoods,Anti-ramp,AntiVirus,Aquarium,aqua-shop,Aromatherapy,
Ask,Babymother,bag,Bank_Service,barterbooks,Baseball,beauty,BeautyBody,BeautyMarket,BeautySalon,bicycle,biker,BikerShop,
Boy-Girl,Brand,Browsers,BuyTogether,C_Chat,Cad_Cae,car,cat,CATCH,Chat82gether,chatskill,China-Drama,Clothes,CMWang,
ComicHouse,CompBook,cookclub,creditcard,consumer,CVS,DC,dog,DPP,drama-ticket,DSLR,DV,EatToDie,Education,egg-exchange,
equal_change,e-shopping,Examination,EZsoft,facelift,FamilyCircle,fastfood,feminine_sex,Finance,first-wife,Fitness,Food,
forsale,Free_box,Fund,Gamesale,gardener,gay,GEPT,Getmarry,give,GoodShop,Gossiping,graduate,guitar,hairdo,handmade,
HardwareSale,hate,HelpBuy,HK-drama,homemaker,home-sale,hypermall,IELTS,Insurance,Japan_Travel,japanavgirls,Japandrama,
jeans,joke,joyinDIY,Key_Mou_Pad,Kids,KMT,KoreaDrama,KR_Entertain,L_BeautyCare,License,LicenseShop,Lifeismoney,LightNovel,
Little-Games,LivingGoods,LoL,Lomo,Lottery,MacShop,MakeUp,Mancare,marriage,marvel,memento,MenTalk,Mind,Mix_Match,MJ,
MobileComm,mobilesales,model,movie,multi-lovers,MuscleBeach,NailSalon,NBA,NBA_Film,nb-shopping,nightlife,TOEFL_iBT,
Office,Old-Games,Option,P2PSoftWare,Palmar_Drama,pay_home,PC_Shopping,perfume,Perfume_Shop,pet,photo-buy,PhotoCritic,
PhotoLink,Plant,PttEarnMoney,pttlifelaw,PuzzleDragon,Q_ary,rabbit,Railway,rent-exp,RIPE_gender,sex,share,Loan,sp_teacher,
SportLottery,SportsShop,Stock,Storage_Zone,studyteacher,StupidClown,Rent_apart,Rent_tao,Rent_ya,TaiwanDrama,talk,tax,
Teacher,teaching,Tech_Job,teeth_salon,Test,textbook,third-person,TOEIC,ToS,underwear,Wanted,WomenTalk,WoodworkDIY,
jawawa,

Gossiping,Stock,C_Chat,Baseball,NBA,basketballTW,Lifeismoney,HatePolitics,Military,car,Japan_Travel,PC_Shopping,movie,
DIABLO,sex,home-sale,KoreaStar,Tech_Job,LoL,mobilecomm,BabyMother,Beauty,WomenTalk,Boy-Girl,BaseballXXXX,Steam,
creditcard,Kaohsiung,iOS,japanavgirls,joke,PlayStation,AllTogether,SportLottery,KoreaDrama,marvel,HardwareSale,
Japandrama,nswitch,CFantasy,Marginalman,Tainan,Elephants,TaichungBun,e-shopping,Lakers,marriage,Bank_Service,biker,AC_In,
PuzzleDragon,CarShop,CVS,Drama-Ticket,Hsinchu,KR_Entertain,Gamesale,miHoYo,watch,Lions,MacShop,BeautySalon,China-Drama,
ToS,fastfood,Option,mobilesales,MuscleBeach,EAseries,Aviation,Badminton,Salary,BabyProducts,PokemonGO,Tennis,
PublicServan,Soft_Job,E-appliance,FATE_GO,MLB,cat,DigiCurrency,Headphone,Food,Key_Mou_Pad,nb-shopping,studyteacher,
MakeUp,TW_Entertain,DSLR,XBOX,BlueArchive,part-time,YuanChuang,WOW,ONE_PIECE,SuperBike,Wanted,Gov_owned,Broad_Band,
DMM_GAMES,give,KoreanPop,SakaTalk,Audiophile,Examination,FORMULA1,gay,Hip-Hop,Railway,DC_SALE,H-GAME,TaiwanDrama,
StupidClown,Taoyuan,AfterPhD,points,Storage_Zone,Hearthstone,e-coupon,Teacher,TY_Research,UmaMusume,facelift,FITNESS,
hypermall,Preschooler,Road_Running,Acad-Affairs,Accounting,Actuary,AKB48,A-Lin,ALLPOST,A-MEI,AmuroNamie,Android,Angela,
AnimalForest,Announce,Anti-ramp,AOA,AOE,ApexLegends,APINK,Aquarium,Aquarius,ArakawaCow,Arashi,ArenaOfValor,Argentina,
Arknights,Aromatherapy,Arsenal,ASTRO,Atom_Boyz,Ayu,AzurLane,BABYMETAL,BanG_Dream,Battlegirlhs,BattleRoyale,BB-Love,
BB_Online,BDSM,bicycle,bicycleshop,BigBanciao,BIGBANG,BigSanchung,BikerShop,Billiard,BioHazard,BLACKPINK,BLAZERS,
BlizzHeroes,BoardGame,book,Brand,Braves,BrawlStars,BrownDust,Browsers,BTOB,BTS,Bucks,Bundesliga,BuyTogether,camping,
Cancer,CareerPlan,car-pool,CATCH,C_BOO,C_ChatBM,Celtics,Certificate,CFP,ChangHua,Chan_Mou,Cheer,CheerGirlsTW,Chelsea,
Chiayi,China-Star,ChungLi,Civil,ClashRoyale,clmusic,Clothes,Club831,CNBLUE,CN_Entertain,CoCo,Coffee,Coldplay,ComGame-New,
Conan,cookclub,CosmosPeople,Covid-19exp,CPBL_ticket,Crowd,Deserts,Digitalhome,DirectSales,Divorce,Djokovic,Dodgers,dog,
DotA2,drawing,EarthDay2021,Eason,EatToDie,EdSheeran,einvoice,e-seller,EuropeTravel,Eurovision,EXID,EXILE,EXO,Facebook,
Falcom,Fallinlove,FAPL,FBaseball,FBG,FCBarcelona,FCBayern,Federer,feminine_sex,FFXIV,FigureSkate,Finance,FireEmblem,
Folklore,FoodDelivery,Football,ForeignEX,Foreign_Inv,forsale,Free_box,FTISLAND,FTV,Fund,fx,GBF,GemTang,GetMarry,GFRIEND,
GHIBLI,G_I-DLE,GirlsFront,GirlsPlanet,GO,GO_FATE,Golden-Award,GoodPregnan,Google,GOT7,Grad-ProbAsk,graduate,G-S-WARRIORS,
GTA,Guardians,GUNDAM,GunsNRoses,hairdo,HakuiKoyori,Hate,HBL,HelpBuy,Hey_Say_JUMP,HIGHLIGHT,Hiking,Hinatazaka46,HK-movie,
hololive,HomeTeach,Hong_Kong,HOT,Hotel,Hotspur,HsinChuang,HsinTien,Hualien,Hunter,ID_GetBack,IdolMaster,iKON,I-Lan,
Immigration,INFINITE,Instant_Mess,Insurance,Interior,Isayama,ITZY,IU,IVE_STARSHIP,IZONE,Jacky,Jam,Jay,Jeremy_Lin,Jing-Ru,
JinYong,JJ,JLPT,job,Jolin,JP_Entertain,J-PopStation,Juventus,JYPnation,KanColle,KANJANI8,KARA,KarenMok,kartrider,Keelung,
Keyakizaka46,Kings,kodomo,Koei,KOF,Korea_Travel,KR_Bands,LaClippers,LALABA,LArc-en-Ciel,LCD,Leo,lesbian,LE_SSERAFIM,
LGBT_SEX,Libra,LifeRecallBM,Lineage,lineageW,Liverpool,LivingGoods,Loan,Lottery,LoveLive_Sip,MAC,Magic,MAMAMOO,Mancare,
ManCity,ManUtd,MapleStory,Maroon5,Mavericks,MayDay,medstudent,MenTalk,MH,MiamiHeat,Miaoli,Militarylife,Mix_Match,
Mizuki_Nana,MMA,Mobile-game,MobilePay,MOD,model,Mo-Musume,money,Monkeys,Moto_GP,MrChildren,MRT,Nadal,Nantou,NARUTO,
NBA_Fantasy,NBA_Film,NCAA,nCoV2019,nCoVPicket,NCU_Talk,Neihu,Nets,NextTopModel,NFL,NIHONGO,NMIXX,nmsmusic,Nogizaka46,NTU,
NTUcourse,NU-EST,NY-Yankees,Old-Games,Olympics_ISG,ONE_OK_ROCK,OneRepublic,Onmyoji,OTT,outdoorgear,Oversea_Job,OverWatch,
PACERS,Palmar_Drama,Paradox,ParkBoGum,PathofExile,PCReDive,Perfume,Perfume_desu,Philippines,PHX-Suns,PingTung,PLAVE,
PokeMon,popmusic,Post,post-b.test,POWERSTATION,PRODUCE48,PRODUCEX101,Programming,ProjectSekai,PTT25_Game,Ptt25sign,
PttEarnMoney,PUBG,PVC-GK,QuestCenter,RailTimes,Rays,RealMadrid,RealmOfValor,RedSox,RedVelvet,RO,Rockets,SakuraMiko,
Sakurazaka46,SanFrancisco,Scorpio,SENIORHIGH,SET,SEVENTEEN,Shadowverse,S.H.E,SHINee,Shinhwa,shoes,ShoheiOhtani,ShuangHe,
Sijhih,Sixers,sky,SMSlife,Snooker,SNSD,Sodagreen,SongShan,soul,SpongeBob,SportsShop,Spurs,SRW,Starbucks,StarCraft,
stationery,story,streetfight,street_style,StrikeShoot,studyabroad,Suckcomic,SuperHeroes,SuperJunior,SYSOP,tabletennis,
Taitung,talk,Tanya,Taurus,tax,teeth_salon,ThaiDrama,Thailand,Theater,THSRshare,Thunder,TizzyBac,toberich,TOEIC,
TPC_Police,Transfer,TuCheng,TurtleSoup,TVXQ,TW-F-Tennis,TWICE,TXT,TypeMoon,Tyukaitiban,UEFA,underwear,US_STOCK,UTAH-JAZZ,
V6,VALORANT,VAPE,Vietnam,Virgo,VISA,Volleyball,VR,Vtuber,Waa,Wanhua,WannaOne,Warfare,WCDragons,wearefriends,WeiBird,
Wen-Shan,WesternMusic,Windows,WindowsPhone,w-inds,Wine,WINNER,WorkanTravel,WorkinChina,worldbasket,WorldCup,Wrestle,
WuBai_and_CB,X1,XXXXballpark,Yoga_Lin,YUGIOH,YuiAragaki,Yunlin,YuzuruHanyu,Zastrology,Zombie

  `.replace(/\s/g, '').split(',');

    let lowerCaseMatcher = new Map();
    for (const board of fullBoards) board && typeof board === 'string' && board.length >= 1 && lowerCaseMatcher.set(board.toLowerCase(), board);

    return lowerCaseMatcher;


  })();


  const cacheKey = 'nJ0wg';


  // Extract the current hostname
  let currentHostname = window.location.hostname;


  const redirections = [
    {
      hostname: "www.ptt.cc",
      redirect: (objectVariables) => "https://www.ptt.cc/bbs/" + (objectVariables.board + "/" + objectVariables.article) + ".html"
    },

    {
      hostname: "www.pttweb.cc",
      redirect: (objectVariables) => "https://www.pttweb.cc/bbs/" + objectVariables.board + "/" + objectVariables.article
    },

    {
      hostname: "moptt.tw",
      redirect: (objectVariables) => "https://moptt.tw/p/" + objectVariables.board + "." + objectVariables.article
    },

    {
      hostname: "ptthito.com",
      redirect: (objectVariables) => "https://ptthito.com/" + (objectVariables.board + "/" + objectVariables.article.replace(/\./g, '-') + "/").toLowerCase()
    },


    {
      hostname: "webptt.com",
      redirect: (objectVariables) => `https://webptt.com/m.aspx?n=bbs/${objectVariables.board}/${objectVariables.article}.html`
    },

    {
      hostname: "pttweb.tw",
      redirect: (objectVariables) => `https://pttweb.tw/${objectVariables.board}/${objectVariables.article}`
    },

    {
      hostname: "www.ucptt.com",
      redirect: (objectVariables) => {
        let p = /M\.([^\s.,|\/\\]+)\.A\.([^\s.,|\/\\]+)/.exec(objectVariables.article);
        return p ? `http://www.ucptt.com/article/${objectVariables.board}/${p[1]}/${p[2]}` : '';
      }
    },



    // not all posts can read
    // https://www.ptt.cc/bbs/Lifeismoney/M.1687762841.A.5E8.html
    {
      hostname: "pttent.com",
      disabled: NO_BUTTON_FOR_CACHER,
      redirect: (objectVariables) => `https://pttent.com/${objectVariables.board.toLowerCase()}/${objectVariables.article}.html`
    },
    {
      hostname: "pttgame.com",
      disabled: NO_BUTTON_FOR_CACHER,
      redirect: (objectVariables) => `https://pttgame.com/${objectVariables.board.toLowerCase()}/${objectVariables.article}.html`
    },
    {
      hostname: "pttdigit.com",
      disabled: NO_BUTTON_FOR_CACHER,
      redirect: (objectVariables) => `https://pttdigit.com/${objectVariables.board.toLowerCase()}/${objectVariables.article}.html`
    },
    {
      hostname: "pttlocal.com",
      disabled: NO_BUTTON_FOR_CACHER,
      redirect: (objectVariables) => `https://pttlocal.com/${objectVariables.board.toLowerCase()}/${objectVariables.article}.html`
    },
    {
      hostname: "pttcomic.com",
      disabled: NO_BUTTON_FOR_CACHER,
      redirect: (objectVariables) => `https://pttcomic.com/${objectVariables.board.toLowerCase()}/${objectVariables.article}.html`
    },

    {
      hostname: "webptt.findrate.tw",
      disabled: NO_BUTTON_FOR_CACHER,
      redirect: (objectVariables) => "https://webptt.findrate.tw/bbs/" + (objectVariables.board + "/" + objectVariables.article) + ".html"
    }

  ];


  // Function to handle menu command redirection
  async function redirectToPTT(url, replace) {
    await GM.setValue(cacheKey, `${new URL(url).hostname}|${Date.now()}`);
    if (replace) {
      window.location.replace(url)
    } else {
      window.location.href = url;
    }
  }



  function extractionCore(uObject) {

    // Extract parameters


    /*
     *

  supported(1):

  - https://www.ptt.cc/bbs/C_Chat/M.1684501378.A.9F2.html

  supported(2):
  - https://www.pttweb.cc/bbs/C_Chat/M.1684501378.A.9F2
  - https://moptt.tw/p/C_Chat.M.1684501378.A.9F2
  - https://ptthito.com/c_chat/m-1684501378-a-9f2/
  - https://webptt.com/m.aspx?n=bbs/C_Chat/M.1684501378.A.9F2.html
  - https://pttweb.tw/C_Chat/M.1684501378.A.9F2
  - http://www.ucptt.com/article/C_Chat/1684501378/9F2

  supported(3):
  - https://disp.cc/ptt/C_Chat/1acPSKqZ
  - https://hotptt.com/j3pu5u01ag

  supported(4):
  - https://disp.cc/b/ott/cpKM
  - https://disp.cc/b/Gossiping/dyaG

  supported(over18):
  - https://www.ptt.cc/ask/over18?from=%2Fbbs%2FGossiping%2FM.1645949964.A.1E4.html

  supported (no menu option):

  - https://pttent.com/movie/M.1548573736.A.DD4.html
  - https://pttgame.com/lol/M.1476373373.A.239.html
  - https://pttdigit.com/macshop/M.1551692551.A.8EA.html
  - https://pttlocal.com/tainan/M.1551683492.A.63D.html

  not supported:

  - https://ptt.reviews/HatePolitics/E.w1rS970orKqI
  - https://www.ptt666.com/M.1551680529.A.759.html


*/



    /*

        const f = (board) => {
          // lowerCased-board
          if (!board) return board;
          if (board !== board.toLowerCase()) return board;
          return lowerCaseMatcher.get(board) || board.replace(/_/g, '-').replace(/\b([a-z])([a-z0-9]*)\b/g, (_, a, b) => a.toUpperCase() + (b || '')).replace(/-/g, '_');
        }
        */

    const f = (board) => {
      // lowerCased-board
      return board;
    }

    const { pathname, hostname } = uObject


    if (pathname.startsWith('/bbs/')) {
      let s = pathname.split('/');

      return {
        board: s[2],
        article: s[3].replace('.html', '')
      }
    } else if (pathname === '/ask/over18') {

      let s = /from=([^=\;\/\?]+)/.exec(uObject.search);
      if (s && s[1]) {
        let pathname2 = null;
        try {
          pathname2 = decodeURIComponent(s[1]);
        } catch (e) { }
        if (pathname2) {
          //  https://www.ptt.cc/ask/over18?from=%2Fbbs%2FGossiping%2FM.1645949964.A.1E4.html

          let s = pathname2.split('/');

          return {
            board: s[2],
            article: s[3].replace('.html', '')
          }

        }
      }

    } else if (pathname.startsWith('/p/')) {
      let d = pathname.substring(3);
      let i = d.indexOf('.');
      if (i > 0) {
        return {
          board: d.substring(0, i),
          article: d.substring(i + 1)
        }
      }
    } else if (hostname === 'ptthito.com') { // just in case

      let s = pathname.split('/');

      return {
        board: f(s[1]),
        article: s[2].replace(/-/g, '.').toUpperCase()
      }
    } else if (hostname === 'disp.cc' && pathname.startsWith('/b/')) { // just in case

      let s = pathname.split('/');

      return {
        board: f(s[2]),
        article: null
      }
    } else if (hostname === 'webptt.com') {

      let s = location.search.split('/');

      return {
        board: s[1],
        article: s[2].replace('.html', '')
      }

    } else if (hostname === 'pttweb.tw') {

      let s = pathname.split('/');

      return {
        board: s[1],
        article: s[2].replace('.html', '')
      }
    } else if (hostname === 'www.ucptt.com') {

      let s = pathname.split('/');
      if (s[1] === 'article' && s.length === 5) {

        return {
          board: s[2],
          article: `M.${s[3]}.A.${s[4]}`
        }
      }

    } else if (hostname === 'pttent.com' || hostname === 'pttgame.com' || hostname === 'pttdigit.com' || hostname === 'pttlocal.com' || hostname === 'pttcomic.com') {

      let s = pathname.split('/');

      return {
        board: f(s[1]),
        article: s[2].replace('.html', '')
      }
    }

    return null;
  }



  function readySetup(readyFn) {


    if (document.readyState != 'loading') {
      readyFn();
    } else {
      window.addEventListener("DOMContentLoaded", readyFn, false);
    }


  }


  (async () => {


    const mVars = await new Promise(process => {


      let mVars = null;
      if (currentHostname === 'hotptt.com') {

      } else if (currentHostname === "disp.cc") {

      } else {
        mVars = extractionCore(window.location) // try
        if (!mVars.board) mVars = null;
        if (mVars) {

          if (currentHostname === "ptthito.com") {
            let board = lowerCaseMatcher.get(mVars.board.toLowerCase());
            mVars.fuzzyMatch = board ? false : true;
            if (board) mVars.board = board;
          } else if (currentHostname === 'pttent.com' || currentHostname === 'pttgame.com' || currentHostname === 'pttdigit.com' || currentHostname === 'pttlocal.com') {
            let board = lowerCaseMatcher.get(mVars.board.toLowerCase());
            mVars.fuzzyMatch = board ? false : true;
            if (board) mVars.board = board;
          }

        }
      }


      if (mVars && mVars.board && !mVars.fuzzyMatch) {
        process(mVars);
      } else if (currentHostname === "disp.cc" || currentHostname === "ptthito.com" || currentHostname === 'pttent.com' || currentHostname === 'pttgame.com' || currentHostname === 'pttdigit.com' || currentHostname === 'pttlocal.com') {

        readySetup(() => {

          let mVars = null;

          let pttLink = document.evaluate("//span[contains(text(),'※ 文章網址: ')]/a", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          if (pttLink && !pttLink.href.startsWith("https://www.ptt.cc/bbs/")) pttLink = null;
          if (!pttLink) {
            pttLink = document.querySelector('a[href^="https://www.ptt.cc/bbs/"]');
          }
          if (pttLink) {
            let pttURL = pttLink.href;
            if (pttURL && pttURL.startsWith("https://www.ptt.cc/bbs/")) {
              mVars = extractionCore(new URL(pttURL));
            }
          }

          process(mVars);
        });


      } else {
        process(null);
      }



    });


    let activeCaching = false;

    let __cache__ = null;

    if (mVars && mVars.board && !mVars.fuzzyMatch) {


      if (!mVars || !mVars.board || !mVars.article) return;

      lowerCaseMatcher.set(mVars.board.toLowerCase(), mVars.board);

      __cache__ = await GM.getValue(cacheKey, null);
      GM_addValueChangeListener(cacheKey, (key, oldValue, newValue, remote) => {
        if (key !== cacheKey) return;
        if (typeof newValue !== 'string') newValue = null;
        if (!newValue) {
          activeCaching = false;
          __cache__ = null;
        } else {

          if (remote) activeCaching = false; else activeCaching = true;

          __cache__ = newValue;
        }

      })
      let cached = __cache__;
      let cachedS = cached ? cached.split('|') : null;
      let redirectionC = null;
      if (cachedS && cachedS[0] !== currentHostname && (+Date.now()) - (+cachedS[1]) < 20000) {
        let cachedD = cachedS[0];

        for (const redirection of redirections) {
          if (redirection.hostname === cachedD) {
            if (typeof redirection.redirect === 'function') {
              redirectionC = redirection;
            }
            break;
          }
        }
      } else if (location.pathname === '/ask/over18' && false) {

        for (const redirection of redirections) {
          if (redirection.hostname === location.hostname) {
            if (typeof redirection.redirect === 'function') {
              redirectionC = redirection;
            }
            break;
          }
        }

      }

      if (redirectionC && typeof redirectionC.redirect === 'function' && !window.p6tvU) {
        let url = redirectionC.redirect(mVars);
        if (url) redirectToPTT(url, true);
      } else {
        redirectionC = null;

        const addMenuOption = async (redirection) => {
          GM_registerMenuCommand("Redirect to " + redirection.hostname, function () {
            let url = redirection.redirect(mVars);
            if (url) {
              window.p6tvU = 1;
              redirectToPTT(url, false);
            }
          });
        }

        for (const redirection of redirections) {
          if (currentHostname !== redirection.hostname && !redirection.disabled) {
            addMenuOption(redirection);
          }
        }

        if (cachedS && cachedS[0] !== currentHostname) {
          GM.deleteValue(cacheKey);
        } else if (cachedS && cachedS[0] === currentHostname) {

          if ((+Date.now()) - (+cachedS[1]) < 20000) {

            activeCaching = true;
            console.log('PTT Sites Redirection: setInterval');

            let repeatFn = async () => {
              if (activeCaching) {
                console.log('PTT Sites Redirection: activeCaching', currentHostname)
                let p = __cache__;
                let s = p ? p.split('|') : null;

                if (s && s[0] === currentHostname && (+Date.now()) - (+s[1]) < 20000) {
                  GM.setValue(cacheKey, `${currentHostname}|${Date.now()}`);
                }
              }

            };

            setInterval(repeatFn, 10000);
            repeatFn();

          } else {
            GM.deleteValue(cacheKey);
          }

        }

      }


    }

  })();


})();

