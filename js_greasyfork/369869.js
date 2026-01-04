// ==UserScript==
// @name         WinRate Library
// @namespace    ZYScript
// @version      0.878
// @match        https://nutaku.haremheroes.com/battle.html*
// @description  The library for the scripts that require the calculation of Harem Heroes battles
// @author       Zynoth
// @grant        none
// ==/UserScript==
var NormalComparison;
var WRCorrection;

// Ego stats
var Egodiv = $(".battle_hero .over span");
     var HeroEgo = parseInt(Egodiv.text()) * 1000 + Number((Egodiv.text()).substr((Egodiv.text()).length-4, 3));
var Egodiv2 = $(".battle_opponent .over span");
     var EnemyEgo = parseInt(Egodiv2.text()) * 1000 + Number((Egodiv2.text()).substr((Egodiv2.text()).length-4, 3));

// MAIN STATS

// Hardcore stat
var MHCdiv = $(".battle_hero .stats_wrap div[hh_title='Hardcore']");
    if ((MHCdiv.text()).charAt(1) == ",") {
      var HeroMHC = parseInt(MHCdiv.text()) * 1000 + Number(MHCdiv.text().substr(2, (MHCdiv.text()).length));
    }
    else if ((MHCdiv.text()).charAt(2) == ",") {HeroMHC = parseInt(MHCdiv.text()) * 1000 + Number(MHCdiv.text().substr(3, (MHCdiv.text()).length))}
         else {HeroMHC = parseInt(MHCdiv.text())};
var MHCdiv2 = $(".battle_opponent .stats_wrap div[hh_title='Hardcore']");
    if ((MHCdiv2.text()).charAt(1) == ",") {
      var EnemyMHC = parseInt(MHCdiv2.text()) * 1000 + Number(MHCdiv2.text().substr(2, (MHCdiv2.text()).length));
    }
    else if ((MHCdiv2.text()).charAt(2) == ",") {EnemyMHC = parseInt(MHCdiv2.text()) * 1000 + Number(MHCdiv2.text().substr(3, (MHCdiv2.text()).length))}
         else {EnemyMHC = parseInt(MHCdiv2.text())};

// Charm stat
var MCdiv = $(".battle_hero .stats_wrap div[hh_title='Charm']");
    if ((MCdiv.text()).charAt(1) == ",") {
      var HeroMC = parseInt(MCdiv.text()) * 1000 + Number(MCdiv.text().substr(2, (MCdiv.text()).length));
    }
    else if ((MCdiv.text()).charAt(2) == ",") {HeroMC = parseInt(MCdiv.text()) * 1000 + Number(MCdiv.text().substr(3, (MCdiv.text()).length));}
         else {HeroMC = parseInt(MCdiv.text())};
var MCdiv2 = $(".battle_opponent .stats_wrap div[hh_title='Charm']");
    if ((MCdiv2.text()).charAt(1) == ",") {
      var EnemyMC = parseInt(MCdiv2.text()) * 1000 + Number(MCdiv2.text().substr(2, (MCdiv2.text()).length));
    }
    else if ((MCdiv2.text()).charAt(2) == ",") {EnemyMC = parseInt(MCdiv2.text()) * 1000 + Number(MCdiv2.text().substr(3, (MCdiv2.text()).length));}
         else {EnemyMC = parseInt(MCdiv2.text())};

// Know-how stat
var MKHdiv = $(".battle_hero .stats_wrap div[hh_title='Know-how']");
    if ((MKHdiv.text()).charAt(1) == ",") {
      var HeroMKH = parseInt(MKHdiv.text()) * 1000 + Number(MKHdiv.text().substr(2, (MKHdiv.text()).length));
    }
    else if ((MKHdiv.text()).charAt(2) == ",") {HeroMKH = parseInt(MKHdiv.text()) * 1000 + Number(MKHdiv.text().substr(3, (MKHdiv.text()).length));}
         else {HeroMKH = parseInt(MKHdiv.text())};
var MKHdiv2 = $(".battle_opponent .stats_wrap div[hh_title='Know-how']");
    if ((MKHdiv2.text()).charAt(1) == ",") {
      var EnemyMKH = parseInt(MKHdiv2.text()) * 1000 + Number(MKHdiv2.text().substr(2, (MKHdiv2.text()).length));
    }
    else if ((MKHdiv2.text()).charAt(2) == ",") {EnemyMKH = parseInt(MKHdiv2.text()) * 1000 + Number(MKHdiv2.text().substr(3, (MKHdiv2.text()).length));}
         else {EnemyMKH = parseInt(MKHdiv2.text())};

// Excitement stat
var EXCdiv = $(".battle_hero .stats_wrap div[hh_title='Excitement']");
if ((EXCdiv.text()).charAt(1) == ",") {
    var HeroEXC = parseInt(EXCdiv.text()) * 1000 + Number(EXCdiv.text().substr(2, (EXCdiv.text()).length));}
else if ((EXCdiv.text()).charAt(2) == ",") {HeroEXC = parseInt(EXCdiv.text()) * 1000 + Number(EXCdiv.text().substr(3, (EXCdiv.text()).length));}
else {HeroEXC = parseInt(EXCdiv.text()) * 1000 + Number(EXCdiv.text().substr(4, (EXCdiv.text()).length));}

var EXCdiv2 = $(".battle_opponent .stats_wrap div[hh_title='Excitement']");
if ((EXCdiv2.text()).charAt(1) == ",") {
    var EnemyEXC = parseInt(EXCdiv2.text()) * 1000 + Number(EXCdiv2.text().substr(2, (EXCdiv2.text()).length));}
else if ((EXCdiv2.text()).charAt(2) == ",") {EnemyEXC = parseInt(EXCdiv2.text()) * 1000 + Number(EXCdiv2.text().substr(3, (EXCdiv2.text()).length));}
else {EnemyEXC = parseInt(EXCdiv2.text()) * 1000 + Number(EXCdiv2.text().substr(4, (EXCdiv2.text()).length));}

// Critical %
var Critdiv = $(".battle_hero .stats_wrap div[hh_title='Harmony']");
      if ((Critdiv.text()).charAt((Critdiv.text()).length-8) == "(") {
          var HeroCrit = (Critdiv.text()).substr((Critdiv.text()).length-7, 4)/100}
      else {HeroCrit = (Critdiv.text()).substr((Critdiv.text()).length-6, 4)/100};
var Critdiv2 = $(".battle_opponent .stats_wrap div[hh_title='Harmony']");
      if ((Critdiv2.text()).charAt((Critdiv2.text()).length-8) == "(") {
          var EnemyCrit = (Critdiv2.text()).substr((Critdiv2.text()).length-7, 4)/100}
      else {EnemyCrit = (Critdiv2.text()).substr((Critdiv2.text()).length-6, 4)/100};

// ALPHA STATS
var Alphadiv = ($(".battle_hero .battle-faces div[rel='g1']")).attr('girl-tooltip-data');
var EAlphadiv = ($(".battle_opponent .battle-faces div[rel='g1']")).attr('girl-tooltip-data');
var Betadiv = ($(".battle_hero .battle-faces div[rel='g2']")).attr('girl-tooltip-data');
var EBetadiv = ($(".battle_opponent .battle-faces div[rel='g2']")).attr('girl-tooltip-data');
var Omegadiv = ($(".battle_hero .battle-faces div[rel='g2']")).attr('girl-tooltip-data');
var EOmegadiv = ($(".battle_opponent .battle-faces div[rel='g2']")).attr('girl-tooltip-data');

//Fix to prevent errors on other pages that aren't the battle one
if (window.location.href.indexOf("battle.html") > -1) {

// Hardcore stats
var AHCIndex = Alphadiv.indexOf('carac1') + 8;
      var AlphaHC = parseFloat(Alphadiv.substr(AHCIndex,7));

var AHCIndex2 = EAlphadiv.indexOf('carac1') + 8;
      var EAlphaHC = parseFloat(EAlphadiv.substr(AHCIndex2,7));

// Charm stats
var ACIndex = Alphadiv.indexOf('carac2') + 8;
      var AlphaC = parseFloat(Alphadiv.substr(ACIndex,7));

var ACIndex2 = EAlphadiv.indexOf('carac2') + 8;
      var EAlphaC = parseFloat(EAlphadiv.substr(ACIndex2,7));

// Know-how stats
var AKHIndex = Alphadiv.indexOf('carac3') + 8;
      var AlphaKH = parseFloat(Alphadiv.substr(AKHIndex,7));

var AKHIndex2 = EAlphadiv.indexOf('carac3') + 8;
      var EAlphaKH = parseFloat(EAlphadiv.substr(AKHIndex2,7));

// BETA STATS

// Hardcore stats
var BHCIndex = Betadiv.indexOf('carac1') + 8;
      var BetaHC = parseFloat(Betadiv.substr(BHCIndex,7));

var BHCIndex2 = EBetadiv.indexOf('carac1') + 8;
      var EBetaHC = parseFloat(EBetadiv.substr(BHCIndex2,7));

// Charm stats
var BCIndex = Betadiv.indexOf('carac2') + 8;
      var BetaC = parseFloat(Betadiv.substr(BCIndex,7));

var BCIndex2 = EBetadiv.indexOf('carac2') + 8;
      var EBetaC = parseFloat(EBetadiv.substr(BCIndex2,7));

// Know-how stats
var BKHIndex = Betadiv.indexOf('carac3') + 8;
      var BetaKH = parseFloat(Betadiv.substr(BKHIndex,7));

var BKHIndex2 = EBetadiv.indexOf('carac3') + 8;
      var EBetaKH = parseFloat(EBetadiv.substr(BKHIndex2,7));

// OMEGA STATS

// Hardcore stats
var OHCIndex = Omegadiv.indexOf('carac1') + 8;
      var OmegaHC = parseFloat(Omegadiv.substr(OHCIndex,7));

var OHCIndex2 = EOmegadiv.indexOf('carac1') + 8;
      var EOmegaHC = parseFloat(EOmegadiv.substr(OHCIndex2,7));

// Charm stats
var OCIndex = Omegadiv.indexOf('carac2') + 8;
      var OmegaC = parseFloat(Omegadiv.substr(OCIndex,7));

var OCIndex2 = EOmegadiv.indexOf('carac2') + 8;
      var EOmegaC = parseFloat(EOmegadiv.substr(OCIndex2,7));

// Know-how stats
var OKHIndex = Omegadiv.indexOf('carac3') + 8;
      var OmegaKH = parseFloat(Omegadiv.substr(OKHIndex,7));

var OKHIndex2 = EOmegadiv.indexOf('carac3') + 8;
      var EOmegaKH = parseFloat(EOmegadiv.substr(OKHIndex2,7));
}

// MAIN STAT DISCOVERY

// Hero and enemy class
var HeroHardcore = $(".battle_hero h3 div[carac='class1']");
var HeroCharm = $(".battle_hero h3 div[carac='class2']");
var HeroKnowHow = $(".battle_hero h3 div[carac='class3']");
var EnemyHardcore = $(".battle_opponent h3 div[carac='class1']");
var EnemyCharm = $(".battle_opponent h3 div[carac='class2']");
var EnemyKnowHow = $(".battle_opponent h3 div[carac='class3']");

if (HeroHardcore[0]) {HeroHardcore = 1}
else {HeroHardcore = 0};
if (HeroCharm[0]) {HeroCharm = 1}
else {HeroCharm = 0};
if (HeroKnowHow[0]) {HeroKnowHow = 1}
else {HeroKnowHow = 0};

if (EnemyHardcore[0]) {EnemyHardcore = 1}
else {EnemyHardcore = 0};
if (EnemyCharm[0]) {EnemyCharm = 1}
else {EnemyCharm = 0};
if (EnemyKnowHow[0]) {EnemyKnowHow = 1}
else {EnemyKnowHow = 0};

// Judge class
var JudgeHardcore = $(".battle_judge[src='https://hh.hh-content.com/pictures/judges/1/chair1.png'");
var JudgeCharm = $(".battle_judge[src='https://hh.hh-content.com/pictures/judges/2/chair1.png'");
var JudgeKnowHow = $(".battle_judge[src='https://hh.hh-content.com/pictures/judges/3/chair1.png'");

if (JudgeHardcore[0]) {JudgeHardcore = 1}
else {JudgeHardcore = 0};
if (JudgeCharm[0]) {JudgeCharm = 1}
else {JudgeCharm = 0};
if (JudgeKnowHow[0]) {JudgeKnowHow = 1}
else {JudgeKnowHow = 0};

// Alpha class
var AlphaHardcore = 0; var AlphaCharm = 0; var AlphaKnowHow = 0;
var EAlphaHardcore = 0; var EAlphaCharm = 0; var EAlphaKnowHow = 0;

if (AlphaHC > AlphaC && AlphaHC > AlphaKH) {AlphaHardcore = 1}
else if (AlphaC > AlphaHC && AlphaC > AlphaKH) {AlphaCharm = 1}
else {AlphaKnowHow = 1}

if (EAlphaHC > EAlphaC && EAlphaHC > EAlphaKH) {EAlphaHardcore = 1}
else if (EAlphaC > EAlphaHC && EAlphaC > EAlphaKH) {EAlphaCharm = 1}
else {EAlphaKnowHow = 1}

// Beta class
var BetaHardcore = 0; var BetaCharm = 0; var BetaKnowHow = 0;
var EBetaHardcore = 0; var EBetaCharm = 0; var EBetaKnowHow = 0;

if (BetaHC > BetaC && BetaHC > BetaKH) {BetaHardcore = 1}
else if (BetaC > BetaHC && BetaC > BetaKH) {BetaCharm = 1}
else {BetaKnowHow = 1}

if (EBetaHC > EBetaC && EBetaHC > EBetaKH) {EBetaHardcore = 1}
else if (EBetaC > EBetaHC && EBetaC > EBetaKH) {EBetaCharm = 1}
else {EBetaKnowHow = 1}

// Omega class
var OmegaHardcore = 0; var OmegaCharm = 0; var OmegaKnowHow = 0;
var EOmegaHardcore = 0; var EOmegaCharm = 0; var EOmegaKnowHow = 0;

if (OmegaHC > OmegaC && OmegaHC > OmegaKH) {OmegaHardcore = 1}
else if (OmegaC > OmegaHC && OmegaC > OmegaKH) {OmegaCharm = 1}
else {OmegaKnowHow = 1}

if (EOmegaHC > EOmegaC && EOmegaHC > EOmegaKH) {EOmegaHardcore = 1}
else if (EOmegaC > EOmegaHC && EOmegaC > EOmegaKH) {EOmegaCharm = 1}
else {EOmegaKnowHow = 1}

// DEFENCE STATS

// Alpha turns defence
var AlphaHCD = ((AlphaHC * 1.5 + HeroMHC/2) * Math.abs(HeroHardcore - 1)) + (((AlphaC * 1.5 + HeroMC/2) + (AlphaKH * 1.5 + HeroMKH/2))/2) * HeroHardcore;
var AlphaCD = ((AlphaC * 1.5 + HeroMC/2) * Math.abs(HeroCharm - 1)) + (((AlphaHC * 1.5 + HeroMHC/2) + (AlphaKH * 1.5 + HeroMKH/2))/2) * HeroCharm;
var AlphaKHD = ((AlphaKH * 1.5 + HeroMKH/2) * Math.abs(HeroKnowHow - 1)) + (((AlphaHC * 1.5 + HeroMHC/2) + (AlphaC * 1.5 + HeroMC/2))/2) * HeroKnowHow;

var EAlphaHCD = ((EAlphaHC * 1.5 + EnemyMHC/2) * Math.abs(EnemyHardcore - 1)) + (((EAlphaC * 1.5 + EnemyMC/2) + (EAlphaKH * 1.5 + EnemyMKH/2))/2) * EnemyHardcore;
var EAlphaCD = ((EAlphaC * 1.5 + EnemyMC/2) * Math.abs(EnemyCharm - 1)) + (((EAlphaHC * 1.5 + EnemyMHC/2) + (EAlphaKH * 1.5 + EnemyMKH/2))/2) * EnemyCharm;
var EAlphaKHD = ((EAlphaKH * 1.5 + EnemyMKH/2) * Math.abs(EnemyKnowHow - 1)) + (((EAlphaHC * 1.5 + EnemyMHC/2) + (EAlphaC * 1.5 + EnemyMC/2))/2) * EnemyKnowHow;

// Omega turns defence
var BetaHCD = AlphaHCD + (BetaHC * HeroHardcore + BetaC * HeroCharm + BetaKH * HeroKnowHow) * 1.75;
var BetaCD = AlphaCD + (BetaHC * HeroHardcore + BetaC * HeroCharm + BetaKH * HeroKnowHow) * 1.75;
var BetaKHD = AlphaKHD + (BetaHC * HeroHardcore + BetaC * HeroCharm + BetaKH * HeroKnowHow) * 1.75;

var EBetaHCD = EAlphaHCD + (EBetaHC * EnemyHardcore + EBetaC * EnemyCharm + EBetaKH * EnemyKnowHow) * 1.75;
var EBetaCD = EAlphaCD + (EBetaHC * EnemyHardcore + EBetaC * EnemyCharm + EBetaKH * EnemyKnowHow) * 1.75;
var EBetaKHD = EAlphaKHD + (EBetaHC * EnemyHardcore + EBetaC * EnemyCharm + EBetaKH * EnemyKnowHow) * 1.75;

// Omega turns defence
var OmegaHCD = AlphaHCD + (BetaHC * HeroHardcore + BetaC * HeroCharm + BetaKH * HeroKnowHow) * 1.3 + ((OmegaHC * HeroHardcore + OmegaC * HeroCharm + OmegaKH * HeroKnowHow) * 1.3);
var OmegaCD = AlphaCD + (BetaHC * HeroHardcore + BetaC * HeroCharm + BetaKH * HeroKnowHow) * 1.3 + ((OmegaHC * HeroHardcore + OmegaC * HeroCharm + OmegaKH * HeroKnowHow) * 1.3);
var OmegaKHD = AlphaKHD + (BetaHC * HeroHardcore + BetaC * HeroCharm + BetaKH * HeroKnowHow) * 1.3 + ((OmegaHC * HeroHardcore + OmegaC * HeroCharm + OmegaKH * HeroKnowHow) * 1.3);

var EOmegaHCD = EAlphaHCD + ((EBetaHC * EnemyHardcore + EBetaC * EnemyCharm + EBetaKH * EnemyKnowHow) * 1.3) + ((EOmegaHC * EnemyHardcore + EOmegaC * EnemyCharm + EOmegaKH * EnemyKnowHow) * 1.3);
var EOmegaCD = EAlphaCD + (EBetaHC * EnemyHardcore + EBetaC * EnemyCharm + EBetaKH * EnemyKnowHow) * 1.3 + ((EOmegaHC * EnemyHardcore + EOmegaC * EnemyCharm + EOmegaKH * EnemyKnowHow) * 1.3);
var EOmegaKHD = EAlphaKHD + (EBetaHC * EnemyHardcore + EBetaC * EnemyCharm + EBetaKH * EnemyKnowHow) * 1.3 + ((EOmegaHC * EnemyHardcore + EOmegaC * EnemyCharm + EOmegaKH * EnemyKnowHow) * 1.3);

// BASE ATTACK STATS

// Hero base attacks
var AttDiv = $(".battle_hero .sub_block.stats_wrap div:nth-child(8)");
var Heroatt = 0;
var AlphaBA = 0;
if (AttDiv.text().charAt(2) == ',') {AlphaBA = parseInt(AttDiv.text()) * 1000 + Number(AttDiv.text().substr(3,3))}
else if (AttDiv.text().charAt(1) == ',') {AlphaBA = parseInt(AttDiv.text()) * 1000 + Number(AttDiv.text().substr(2,3))}
else {AlphaBA = parseInt(AttDiv.text())}

var BetaBA = AlphaBA + (1.3 * (BetaHC * HeroHardcore + BetaC * HeroCharm + BetaKH * HeroKnowHow));
var OmegaBA = BetaBA + (1.3 * (OmegaHC * HeroHardcore + OmegaC * HeroCharm + OmegaKH * HeroKnowHow));

//Enemy base attacks
var EAttDiv = $(".battle_opponent .sub_block.stats_wrap div:nth-child(8)");
var Enemyatt = 0;
var EAlphaBA = 0;
if (EAttDiv.text().charAt(2) == ',') {EAlphaBA = parseInt(EAttDiv.text()) * 1000 + Number(EAttDiv.text().substr(3,3))}
else if (EAttDiv.text().charAt(1) == ',') {EAlphaBA = parseInt(EAttDiv.text()) * 1000 + Number(EAttDiv.text().substr(2,3))}
else {EAlphaBA = parseInt(AttDiv.text())}

var EBetaBA = EAlphaBA + (1.3 * (EBetaHC * EnemyHardcore + EBetaC * EnemyCharm + EBetaKH * EnemyKnowHow));
var EOmegaBA = EBetaBA + (1.3 * (EOmegaHC * EnemyHardcore + EOmegaC * EnemyCharm + EOmegaKH * EnemyKnowHow));

// ACTUAL ATTACK VALUES

// Hero actual attacks
var AlphaAA = AlphaBA - (EAlphaHCD * HeroHardcore + EAlphaCD * HeroCharm + EAlphaKHD * HeroKnowHow);
var BetaAA = BetaBA - (EBetaHCD * HeroHardcore + EBetaCD * HeroCharm + EBetaKHD * HeroKnowHow);
var OmegaAA = OmegaBA - (EOmegaHCD * HeroHardcore + EOmegaCD * HeroCharm + EOmegaKHD * HeroKnowHow);
if (AlphaAA < 0) {AlphaAA = 0}; if (BetaAA < 0) {BetaAA = 0}; if (OmegaAA < 0) {OmegaAA = 0};

// Enemy actual attacks
var EAlphaAA = EAlphaBA - (AlphaHCD * EnemyHardcore + AlphaCD * EnemyCharm + AlphaKHD * EnemyKnowHow);
var EBetaAA = EBetaBA - (BetaHCD * EnemyHardcore + BetaCD * EnemyCharm + BetaKHD * EnemyKnowHow);
var EOmegaAA = EOmegaBA - (OmegaHCD * EnemyHardcore + OmegaCD * EnemyCharm + OmegaKHD * EnemyKnowHow);
if (EAlphaAA < 0) {EAlphaAA = 0}; if (EBetaAA < 0) {EBetaAA = 0}; if (EOmegaAA < 0) {EOmegaAA = 0};

// EXCITEMENT BURSTS

// Hero Ex burst
var AlphaExBurst = (AlphaBA * 1.5) - (EAlphaHCD * HeroHardcore + EAlphaCD * HeroCharm + EAlphaKHD * HeroKnowHow);
var BetaExBurst = (BetaBA * 1.5) - (EBetaHCD * HeroHardcore + EBetaCD * HeroCharm + EBetaKHD * HeroKnowHow);
var OmegaExBurst = (OmegaBA * 1.5) - (EOmegaHCD * HeroHardcore + EOmegaCD * HeroCharm + EOmegaKHD * HeroKnowHow);

// Enemy Ex burst
var EAlphaExBurst = (EAlphaBA * 1.5) - (AlphaHCD * EnemyHardcore + AlphaCD * EnemyCharm + AlphaKHD * EnemyKnowHow);
var EBetaExBurst = (EBetaBA * 1.5) - (BetaHCD * EnemyHardcore + BetaCD * EnemyCharm + BetaKHD * EnemyKnowHow);
var EOmegaExBurst = (EOmegaBA * 1.5) - (OmegaHCD * EnemyHardcore + OmegaCD * EnemyCharm + OmegaKHD * EnemyKnowHow);

// BATTLE TURNS SIMULATION

// First excitement threeshold
var HeroExA = Math.ceil(HeroEXC/(AlphaAA * 2)) + 1;
var EnemyExA = Math.ceil(EnemyEXC/(EAlphaAA * 2)) + 1;
var HeroExB = Math.ceil(HeroEXC/(BetaAA * 2)) + HeroExA + 1;
var EnemyExB = Math.ceil(EnemyEXC/(EBetaAA * 2)) + EnemyExA + 1;
var HeroExO = Math.ceil(HeroEXC/(OmegaAA * 2)) + HeroExB + 1;
var EnemyExO = Math.ceil(EnemyEXC/(EOmegaAA * 2)) + EnemyExB + 1;
var HeroExOS = Math.ceil(HeroEXC/(OmegaAA * 2)) + 1;
var EnemyExOS = Math.ceil(EnemyEXC/(EOmegaAA * 2)) + 1;

// Calculation for the judges
var BetaAppear = Math.min(HeroExA, EnemyExA);

// Battle turns without criticals
var HeroTurns = 0;
var EnemyTurns = 0;
var HeroHPleft = HeroEgo;
var EnemyHPleft = EnemyEgo;
var HeroExleft = HeroEXC;
var EnemyExleft = EnemyEXC;
var OmExCount = 0;
var EOmExCount = 0;
var BT;
var test = 0;

for(BT = 1; BT < 40; BT++) {
    if (BT < HeroExA) {
        EnemyHPleft -= AlphaAA;
        HeroExleft -= AlphaBA * 2;
        if (EnemyHPleft > 0) {
            if(HeroExleft - (AlphaBA * 2) > 0) {EnemyTurns = BT + (EnemyHPleft/AlphaAA)}
            else if(HeroExleft - (AlphaBA * 2) <= 0) {EnemyTurns = BT + (EnemyHPleft/AlphaExBurst)}};}
    if (BT < EnemyExA) {
        HeroHPleft -= EAlphaAA;
        EnemyExleft -= EAlphaBA * 2;
        if (HeroHPleft > 0) {
            if(EnemyExleft - (EAlphaBA * 2) > 0) {HeroTurns = BT + (HeroHPleft/EAlphaAA)}
            else if(EnemyExleft - (EAlphaBA * 2) <= 0) {HeroTurns = BT + (HeroHPleft/EAlphaExBurst)}};}
    if (BT == HeroExA) {
        EnemyHPleft -= AlphaExBurst;
        HeroExleft = EnemyEXC;
        if (EnemyHPleft > 0) {EnemyTurns = BT + (EnemyHPleft/BetaAA)};}
    if (BT == EnemyExA) {
        HeroHPleft -= EAlphaExBurst;
        EnemyExleft = EnemyEXC;
        if (HeroHPleft > 0) {HeroTurns = BT + (HeroHPleft/EBetaAA)};}
     if (BT < HeroExB) { if (BT > HeroExA) {
        EnemyHPleft -= BetaAA;
        HeroExleft -= BetaBA * 2;
        if (EnemyHPleft > 0) {
            if(HeroExleft - (BetaBA * 2) > 0) {EnemyTurns = BT + (EnemyHPleft/BetaAA)}
            else if(HeroExleft - (BetaBA * 2) <= 0) {EnemyTurns = BT + (EnemyHPleft/BetaExBurst)}};}}
    if (BT < EnemyExB) { if (BT > EnemyExA) {
        HeroHPleft -= EBetaAA;
        EnemyExleft -= EBetaBA * 2;
        if (HeroHPleft > 0) {
            if(EnemyExleft - (EBetaBA * 2) > 0) {HeroTurns = BT + (HeroHPleft/EBetaAA)}
            else if(EnemyExleft - (EBetaBA * 2) <= 0) {HeroTurns = BT + (HeroHPleft/EBetaExBurst)}};}}
    if (BT == HeroExB) {
        EnemyHPleft -= BetaExBurst;
        HeroExleft = EnemyEXC;
        if (EnemyHPleft > 0) {EnemyTurns = (BT) + (EnemyHPleft/OmegaAA)};}
    if (BT == EnemyExB) {
        HeroHPleft -= EBetaExBurst;
        EnemyExleft = EnemyEXC;
        if (HeroHPleft > 0) {HeroTurns = (BT) + (HeroHPleft/EOmegaAA)};}
    if (BT > HeroExB) {if (BT < HeroExO) {
        EnemyHPleft -= OmegaAA;
        HeroExleft -= OmegaBA * 2;
        if (EnemyHPleft > 0) {
            if(HeroExleft - (OmegaBA * 2) > 0) {EnemyTurns = BT + (EnemyHPleft/OmegaAA)}
            else if(HeroExleft - (OmegaBA * 2) <= 0) {EnemyTurns = BT + (EnemyHPleft/OmegaExBurst)}};}}
    if (BT > EnemyExB) { if (BT < EnemyExO) {
        HeroHPleft -= EOmegaAA;
        EnemyExleft -= EOmegaBA * 2;
        if (HeroHPleft > 0) {
            if(EnemyExleft - (EOmegaBA * 2) > 0) {HeroTurns = BT + (HeroHPleft/EOmegaAA)}
            else if(EnemyExleft - (EOmegaBA * 2) <= 0) {HeroTurns = BT + (HeroHPleft/EOmegaExBurst)}};}}
    if (BT == HeroExO) {
        EnemyHPleft -= OmegaExBurst;
        HeroExleft = EnemyEXC;
        if (EnemyHPleft > 0) {EnemyTurns = (BT) + (EnemyHPleft/OmegaAA)}}
    if (BT == EnemyExO) {
        HeroHPleft -= EOmegaExBurst;
        EnemyExleft = EnemyEXC;
        if (HeroHPleft > 0) {HeroTurns = (BT) + (HeroHPleft/EOmegaAA)}}
    if (BT > HeroExO) { if (OmExCount < HeroExOS) {
        EnemyHPleft -= OmegaAA;
        HeroExleft -= OmegaBA * 2;
        if (EnemyHPleft > 0) {
            if(HeroExleft - (OmegaBA * 2) > 0) {EnemyTurns = BT + (EnemyHPleft/OmegaAA)}
            else if(HeroExleft - (OmegaBA * 2) <= 0) {EnemyTurns = BT + (EnemyHPleft/OmegaExBurst)}};
        OmExCount += 1;}}
    if (BT > EnemyExO) { if (EOmExCount < EnemyExOS) {
        HeroHPleft -= EOmegaAA;
        EnemyExleft -= EOmegaBA * 2;
        if (HeroHPleft > 0) {
            if(EnemyExleft - (EOmegaBA * 2) > 0) {HeroTurns = BT + (HeroHPleft/EOmegaAA)}
            else if(EnemyExleft - (EOmegaBA * 2) <= 0) {HeroTurns = BT + (HeroHPleft/EOmegaExBurst)}};
        EOmExCount += 1;}}
    if (OmExCount == HeroExOS) {
        EnemyHPleft -= (OmegaExBurst - OmegaAA);
        HeroExleft = EnemyEXC;
        if (EnemyHPleft > 0) {EnemyTurns = BT + (EnemyHPleft/OmegaAA)};
        OmExCount = 0;}
    if (EOmExCount == EnemyExOS) {
        HeroHPleft -= (EOmegaExBurst - EOmegaAA);
        EnemyExleft = EnemyEXC;
        if (HeroHPleft > 0) {HeroTurns = (BT) + (HeroHPleft/EOmegaAA)};
        EOmExCount = 0;}
}

if (EAlphaBA < (AlphaHCD * EnemyHardcore + AlphaCD * EnemyCharm + AlphaKHD * EnemyKnowHow)) {HeroTurns = "∞"}
if (AlphaBA < (EAlphaHCD * HeroHardcore + EAlphaCD * HeroCharm + EAlphaKHD * HeroKnowHow)) {EnemyTurns = "∞"}

var HeroLeftOver = HeroTurns - Math.floor(HeroTurns);
var EnemyLeftOver = EnemyTurns - Math.floor(EnemyTurns);

var MinTurnsNC = Math.min(EnemyTurns, HeroTurns);

// CRITICAL TURNS CALCULATION

// Wild burst criticals calculated as turns
var DamageC1 = AlphaHardcore * 0.5;
var DamageC2 = BetaHardcore * 0.5;
var DamageC3 = OmegaHardcore * 0.5;

var EDamageC1 = EAlphaHardcore * 0.5;
var EDamageC2 = EBetaHardcore * 0.5;
var EDamageC3 = EOmegaHardcore * 0.5;

// Narcissism criticals calculated as turns
var DefenceC1 = AlphaCharm * ((AlphaHCD * EnemyHardcore + AlphaCD * EnemyCharm + AlphaKHD * EnemyKnowHow)/EAlphaAA);
var DefenceC2 = BetaCharm * ((AlphaHCD * EnemyHardcore + AlphaCD * EnemyCharm + AlphaKHD * EnemyKnowHow)/EAlphaAA);
var DefenceC3 = OmegaCharm * ((AlphaHCD * EnemyHardcore + AlphaCD * EnemyCharm + AlphaKHD * EnemyKnowHow)/EAlphaAA);

var EDefenceC1 = EAlphaCharm * ((EAlphaHCD * HeroHardcore + EAlphaCD * HeroCharm + EAlphaKHD * HeroKnowHow)/AlphaAA);
var EDefenceC2 = EBetaCharm * ((EAlphaHCD * HeroHardcore + EAlphaCD * HeroCharm + EAlphaKHD * HeroKnowHow)/AlphaAA);
var EDefenceC3 = EOmegaCharm * ((EAlphaHCD * HeroHardcore + EAlphaCD * HeroCharm + EAlphaKHD * HeroKnowHow)/AlphaAA);

// Healing criticals calculated as turns
var HealC1 = AlphaKnowHow * (((HeroEgo * 1.1)/(Math.max(EAlphaAA, EOmegaAA))) - (HeroEgo/(Math.max(EAlphaAA, EOmegaAA))));
var HealC2 = BetaKnowHow * (((HeroEgo * 1.1)/(Math.max(EAlphaAA, EOmegaAA))) - (HeroEgo/(Math.max(EAlphaAA, EOmegaAA))));
var HealC3 = OmegaKnowHow * (((HeroEgo * 1.1)/(Math.max(EAlphaAA, EOmegaAA))) - (HeroEgo/(Math.max(EAlphaAA, EOmegaAA))));

var EHealC1 = EAlphaKnowHow * (((EnemyEgo * 1.1)/(Math.min(AlphaAA, OmegaAA))) - (EnemyEgo/(Math.min(AlphaAA, OmegaAA))));
var EHealC2 = EBetaKnowHow * (((EnemyEgo * 1.1)/(Math.min(AlphaAA, OmegaAA))) - (EnemyEgo/(Math.min(AlphaAA, OmegaAA))));
var EHealC3 = EOmegaKnowHow * (((EnemyEgo * 1.1)/(Math.min(AlphaAA, OmegaAA))) - (EnemyEgo/(Math.min(AlphaAA, OmegaAA))));

// Criticals probabilities
var CritRounds = Math.round(MinTurnsNC * HeroCrit);
var ECritRounds = Math.round(MinTurnsNC * EnemyCrit);
var NCritRounds = CritRounds - 1;
var ENCritRounds = ECritRounds - 1;
var PCritRounds = CritRounds + 1;
var EPCritRounds = ECritRounds + 1;

if (ECritRounds < 0) {ECritRounds = 0}
if (CritRounds < 0) {CritRounds = 0}
if (ENCritRounds < 0) {ENCritRounds = 0}
if (NCritRounds < 0) {NCritRounds = 0}

// Actual calculation of critical rounds
var TotalDC = 0;
var TotalHC = 0;
var ETotalDC = 0;
var ETotalHC = 0;
var TotalDCNR = 0;
var TotalHCNR = 0;
var ETotalDCNR = 0;
var ETotalHCNR = 0;
var TotalDCBR = 0;
var TotalHCBR = 0;
var ETotalDCBR = 0;
var ETotalHCBR = 0;
var CurrentCrit = 0;
var CT;

for (CT = 0; CT < CritRounds; CT++) {
    CurrentCrit += 1;
    if (CurrentCrit == 1) {
     TotalDC += DamageC1;
     TotalHC += DefenceC1 + HealC1;}
    else if (CurrentCrit == 2) {
     TotalDC += DamageC2;
     TotalHC += DefenceC2 + HealC2;}
    else if (CurrentCrit == 3) {
     TotalDC += DamageC3;
     TotalHC += DefenceC3 + HealC3;
     CurrentCrit = 0;}
}

CurrentCrit = 0;
CT = 0;

for (CT = 0; CT < ECritRounds; CT++) {
    CurrentCrit += 1;
    if (CurrentCrit == 1) {
     ETotalDC += EDamageC1;
     ETotalHC += EDefenceC1 + EHealC1;}
    else if (CurrentCrit == 2) {
     ETotalDC += EDamageC2;
     ETotalHC += EDefenceC2 + EHealC2;}
    else if (CurrentCrit == 3) {
     ETotalDC += EDamageC3;
     ETotalHC += EDefenceC3 + EHealC3;
     CurrentCrit = 0;}
}

CurrentCrit = 0;
CT = 0;

for (CT = 0; CT < NCritRounds; CT++) {
    CurrentCrit += 1;
    if (CurrentCrit == 1) {
     TotalDCNR += DamageC1;
     TotalHCNR += DefenceC1 + EHealC1;}
    else if (CurrentCrit == 2) {
     TotalDCNR += DamageC2;
     TotalHCNR += DefenceC2 + EHealC2;}
    else if (CurrentCrit == 3) {
     TotalDCNR += DamageC3;
     TotalHCNR += DefenceC3 + EHealC3;
     CurrentCrit = 0;}
}

CurrentCrit = 0;
CT = 0;

for (CT = 0; CT < ENCritRounds; CT++) {
    CurrentCrit += 1;
    if (CurrentCrit == 1) {
     ETotalDCNR += EDamageC1;
     ETotalHCNR += EDefenceC1 + EHealC1;}
    else if (CurrentCrit == 2) {
     ETotalDCNR += EDamageC2;
     ETotalHCNR += EDefenceC2 + EHealC2;}
    else if (CurrentCrit == 3) {
     ETotalDCNR += EDamageC3;
     ETotalHCNR += EDefenceC3 + EHealC3;
     CurrentCrit = 0;}
}

CurrentCrit = 0;
CT = 0;

for (CT = 0; CT < PCritRounds; CT++) {
    CurrentCrit += 1;
    if (CurrentCrit == 1) {
     TotalDCBR += DamageC1;
     TotalHCBR += DefenceC1 + HealC1;}
    else if (CurrentCrit == 2) {
     TotalDCBR += DamageC2;
     TotalHCBR += DefenceC2 + HealC2;}
    else if (CurrentCrit == 3) {
     TotalDCBR += DamageC3;
     TotalHCBR += DefenceC3 + HealC3;
     CurrentCrit = 0;}
}

CurrentCrit = 0;
CT = 0;

for (CT = 0; CT < EPCritRounds; CT++) {
    CurrentCrit += 1;
    if (CurrentCrit == 1) {
     ETotalDCBR += EDamageC1;
     ETotalHCBR += EDefenceC1 + EHealC1;}
    else if (CurrentCrit == 2) {
     ETotalDCBR += EDamageC2;
     ETotalHCBR += EDefenceC2 + EHealC2;}
    else if (CurrentCrit == 3) {
     ETotalDCBR += EDamageC3;
     ETotalHCBR += EDefenceC3 + EHealC3;
     CurrentCrit = 0;}
}

// FINAL ROUNDS CALCULATION
var HeroNormalRounds = Math.ceil(HeroTurns - ETotalDC + TotalHC);
var HeroBestRounds = Math.ceil(HeroTurns - ETotalDCNR + TotalHCBR);
var HeroBadRounds = HeroTurns - ETotalDCBR + TotalHCNR;

var EnemyNormalRounds = Math.ceil(EnemyTurns - TotalDC + ETotalHC);
var EnemyBestRounds = Math.ceil(EnemyTurns - TotalDCNR + ETotalHCBR);
var EnemyBadRounds = EnemyTurns - TotalDCBR + ETotalHCNR;

var MinTurns = Math.min(HeroNormalRounds, EnemyNormalRounds);

// JUDGES DAMAGE BOOST CALCULATION (To be discounted from the hero's worst rounds)
var EnemyBoost = 0;
var HeroBoost = 0;

// Judge boost
if (EAlphaHardcore == 1 && AlphaHardcore == 0 && JudgeHardcore == 1){
        if (MinTurns > BetaAppear) {EnemyBoost += Math.round(MinTurns/(BetaAppear * 2)) * (0.07 * BetaAppear)}
        else {EnemyBoost += 0.07 * MinTurns}};

if (EAlphaCharm == 1 && AlphaCharm == 0 && JudgeCharm == 1){
        if (MinTurns > BetaAppear) {EnemyBoost += Math.round(MinTurns/(BetaAppear * 2)) * (0.07 * BetaAppear)}
        else {EnemyBoost += 0.07 * MinTurns}};

if (EAlphaKnowHow == 1 && AlphaKnowHow == 0 && JudgeKnowHow == 1){
        if (MinTurns > BetaAppear) {EnemyBoost += Math.round(MinTurns/(BetaAppear * 2)) * (0.07 * BetaAppear)}
        else {EnemyBoost += 0.07 * MinTurns}};

if (AlphaHardcore == 1 && EAlphaHardcore == 0 && JudgeHardcore == 1) {HeroBoost += Math.round(MinTurns/(BetaAppear * 2)) * (0.07 * BetaAppear)};
if (AlphaCharm == 1 && EAlphaCharm == 0 && JudgeCharm == 1) {HeroBoost += Math.round(MinTurns/(BetaAppear * 2)) * (0.07 * BetaAppear)};
if (AlphaKnowHow == 1 && EAlphaKnowHow == 0 && JudgeKnowHow == 1) {HeroBoost += Math.round(MinTurns/(BetaAppear * 2)) * (0.07 * BetaAppear)};

var HeroWorstRounds = Math.ceil(HeroBadRounds - EnemyBoost);
var EnemyWorstRounds = Math.ceil(EnemyBadRounds - HeroBoost);

// WIN RATES
var WinRate = 0;

EnemyBadRounds = Math.ceil(EnemyTurns - TotalDCBR + ETotalHCNR);
HeroBadRounds = Math.ceil(HeroTurns - ETotalDCBR + TotalHCNR);

if (NormalComparison == false) {WinRate = 1}

// Under normal conditions
if (HeroNormalRounds - EnemyNormalRounds >= 0) {WinRate = 1}

// This checks how your rounds are compared to the enemy
if (HeroBestRounds - EnemyBestRounds < 0) {WinRate -=0.1110}
if (HeroBestRounds - EnemyNormalRounds < 0) {WinRate -=0.1110}
if (HeroBestRounds - EnemyBadRounds < 0) {WinRate -=0.1110}
if (HeroNormalRounds - EnemyBestRounds < 0) {WinRate -=0.1110}
if (HeroNormalRounds - EnemyNormalRounds < 0) {WinRate -=0.1120}
if (HeroNormalRounds - EnemyBadRounds < 0) {WinRate -=0.1110}
if (HeroBadRounds - EnemyBestRounds < 0) {WinRate -=0.1110}
if (HeroBadRounds - EnemyNormalRounds < 0) {WinRate -=0.1110}
if (HeroBadRounds - EnemyBadRounds < 0) {WinRate -=0.1110}

// This is a safecheck for judges round calculations on worst rounds
if (HeroBestRounds - EnemyBadRounds > 0 && HeroBestRounds - EnemyWorstRounds < 0) {WinRate -=0.02}
if (HeroNormalRounds - EnemyBadRounds > 0 && HeroNormalRounds - EnemyWorstRounds < 0) {WinRate -=0.02}
if (HeroBadRounds - EnemyBadRounds > 0 && HeroBadRounds - EnemyWorstRounds < 0) {WinRate -=0.02}
if (HeroWorstRounds - EnemyBestRounds < 0 && HeroBadRounds - EnemyBestRounds > 0) {WinRate -=0.02}
if (HeroWorstRounds - EnemyNormalRounds < 0 && HeroBadRounds - EnemyNormalRounds > 0) {WinRate -=0.02}
if (HeroWorstRounds - EnemyBadRounds < 0 && HeroBadRounds - EnemyBadRounds > 0) {WinRate -=0.02}

// Fix to prevent values over 100%
if (WinRate > 1) {WinRate = 1}

// Deductions from the judges
if (HeroNormalRounds - EnemyNormalRounds == 0 && HeroLeftOver - ETotalDCBR + TotalHCNR <= 0.28) {
if (EAlphaHardcore == 1) {
    if (JudgeKnowHow == 1) {WinRate -=0.006}}
if (EAlphaCharm == 1) {
    if (JudgeHardcore == 1) {WinRate -=0.006}}
if (EAlphaKnowHow == 1) {
    if (JudgeHardcore == 1) {WinRate -=0.006}}
}

// Fix to prevent negative
if (WinRate < 0) {WinRate = 0}
