// ==UserScript==
// @name	 HV-Auto_Mjolnir
// @namespace	 dijoyd
// @version	   0.84.2
// @description	 auto
// @grant   none
// @include http://hentaiverse.org*
// @include https://hentaiverse.org*
// @include http://alt.hentaiverse.org*
// @include https://alt.hentaiverse.org*
// @icon    http://ehgt.org/v/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/18827/HV-Auto_Mjolnir.user.js
// @updateURL https://update.greasyfork.org/scripts/18827/HV-Auto_Mjolnir.meta.js
// ==/UserScript==
//

const version = '0.84.2';
/**
 * Hentaiverse Auto Mage
 *
 *
 *
 */
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//// PonyChart and Stamina Warning
function PonyWarn()
{
  if (document.getElementById('riddlemaster') !== null)
  {
    PonyStr = 'pony';
    alert(PonyStr);
  }
}
function StaminaWarn()
{
  Stamina = parseInt(document.querySelector('.fd4 > div').innerHTML.split(': ')[1]);
  if (Stamina <20) {alert('Stamina Low');}
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Battle Type
// return : 'ar' 'gr' 'iw' 'rb'  'ec'  'unknown'
function BattleTypeF()
{
  BattleUrl = document.getElementById('battleform') !== null ? document.getElementById('battleform').action : '';
  if (BattleUrl.indexOf('encounter=') >= 0)
    {BattleType = 'ec';}
  else if (BattleUrl.indexOf('ss=') >= 0)
    {BattleType = BattleUrl.split('ss=')[1].split('&')[0];}
  else
    {BattleType = 'unknown';}
}
//
//// AutoClick to next level
function AutoClick()
{
  if (BattleType == 'ec' &&
      document.querySelector('#mainpane > div.btt > div.btcp > div:nth-child(1) > div > div') !== null &&
      document.querySelector('#mainpane > div.btt > div.btcp > div:nth-child(1) > div > div').innerHTML == 'You are victorious!')
  {
    window.location.href = window.location.href.split('ba&')[0]+'ar';
    return (true);
  }
  AutoClick_CTN = document.getElementById("ckey_continue");
  if (AutoClick_CTN !== null)
  {
    AutoCLick_CM = AutoClick_CTN.getAttribute("onclick");
    if (AutoCLick_CM !== "common.goto_arena()"  &&  AutoCLick_CM !== "common.goto_ring()"  &&  AutoCLick_CM !== "common.goto_itemworld"  ||
        document.querySelector(".btcp").innerHTML.indexOf("cleared") >= 0 )
      {AutoClick_CTN.click();}
    return (true);
  }
  return (false);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//// Select&Use item:
/*
  'Health Draught'  'Health Potion'  'Health Elixir'
  'Mana Draught'    'Mana Potion'    'Mana Elixir'
  'Spirit Draught'  'Spirit Potion'  'Spirit Elixir'   'Last Elixir'
  'Scroll of Swiftness'   'Scroll of Protection'   'Scroll of the Avatar'
  'Scroll of Absorption'  'Scroll of Shadows'      'Scroll of Life'     'Scroll of the Gods'
  'Infusion of Lightning' 'Infusion of Flames' 'Infusion of Storms' 'Infusion of Frost'
  'Infusion of Divinity'  'Infusion of Darkness'
  'Flower Vase' 'Bubble-Gum'
*/
function Use(Item_Name)
{
  var Use_item_list = document.querySelectorAll('.bti3>div[onmouseover]>div>div');
  for (i=0; i<Use_item_list.length; i++)
  {
    if (Use_item_list[i].innerText.match(Item_Name))
    {
      Use_item_list[i].click();
    }
  }
}
//
//// Item CD
/*
function CDI(Item_Name)
{
  var CDI_Item = document.querySelector('.bti3>div[onmouseover *= "'+Item_Name+'"]');
  if (CDI_Item === null)
    {return false;}
  else
    {return true;}
}
*/
//
//// Select Spell/Skill:
/*
  'Fiery Blast'    'Inferno'            'Flames of Loki'
  'Freeze'         'Blizzard'           'Fimbulvetr'
  'Shockblast'     'Chained Lightning'  'Wrath of Thor'
  'Gale'           'Downburst'          'Storms of Njord'
  'Smite'          'Banishment'         'Paradise Lost'
  'Corruption'     'Disintegrate'       'Ragnarok'

  'Drain'          'Weaken'             'Imperil'
  'Slow'           'Sleep'              'Confuse'
  'Blind'          'Silence'            'MagNet'

  'Cure'           'Regen'              'Full-Cure'

  'Protection'     'Haste'              'Shadow Veil'
  'Absorb'         'Spark of Life'      'Spirit Shield'
  'Heartseeker'    'Arcane Focus'

  'Flee'           'Scan'               'Orbital Friendship Cannon'
  'Concussive Strike'
*/
function Cast(Spell_Name)
{
  var Cast_Spell = document.querySelector('.bts>div[onmouseover *= "'+Spell_Name+'"]');
  document.getElementById(Cast_Spell.id).click();
}
//
//// Spell CD
function CD(Spell_Name)
{
  var CD_Spell = document.querySelector('.bts>div[onmouseover *= "'+Spell_Name+'"]');
  if (CD_Spell.style.opacity == 0.5)
    {return false;}   //CD
  else
    {return true;}    //Ready
}
//
//// Select Action
/*
  'spirit' 'focus' 'defend' 'attack'
*/
function Toggle(Action_Name)
{
  document.querySelector('#ckey_'+Action_Name).click();
}
//
//// Detect & Use Gem
//// GemType
function GemInfo()
{
  GemType = document.getElementById('ikey_p') !== null ? document.getElementById('ikey_p').getAttribute('onmouseover').match(/'([^\s]+) Gem/)[1] : 'None';
}
function GemUse(GemName)
{
  if (GemName.indexOf(GemType) >= 0)  {document.getElementById('ikey_p').click();}
}
//
//// Count Round
//// NowRound , MaxRound
function GetRound()
{
  GetRound_chk = document.querySelectorAll('.t3')[document.querySelectorAll('.t3').length-2].textContent;
  if (GetRound_chk.match("Round") !== null)
  {
    NowRound = parseInt(GetRound_chk.match(/Round \d* \//g)[0].match(/ \d* /g)[0]);
    MaxRound = parseInt(GetRound_chk.match(/\/ \d*\)/g)[0].match(/ \d*/g)[0]);
    localStorage.NowRound = NowRound;
    localStorage.MaxRound = MaxRound;
  }
  if (GetRound_chk.match("Initializing random encounter") !== null)
  {
    NowRound = 1;
    MaxRound = 1;
    localStorage.NowRound = NowRound;
    localStorage.MaxRound = MaxRound;
  }
  if (typeof(NowRound) == 'undefined'  &&  typeof(localStorage.NowRound) !== 'undefined')  {NowRound = localStorage.NowRound;}
  if (typeof(MaxRound) == 'undefined'  &&  typeof(localStorage.MaxRound) !== 'undefined')  {MaxRound = localStorage.MaxRound;}
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
////
function Stat()
{
  StatInfo =
  {
    Status :
    {
      HP : parseInt(document.querySelectorAll('.cwbt1')[0].textContent.split("/")[0]),
      MP : parseInt(document.querySelectorAll('.cwbt1')[1].textContent.split("/")[0]),
      SP : parseInt(document.querySelectorAll('.cwbt1')[2].textContent.split("/")[0]),
      OC : parseInt(document.querySelector('.cwbt2').textContent.split('%')[0])
    },
    Draught :
    {
      HP : -1,
      MP : -1,
      SP : -1
    },
    IABuff :
    {
      Protection : -1,    Haste : -1,      Shadow : -1,    Shield : -1,    Life : -1
    },
    SpBuff :
    {
      Protection : -1,    Haste : -1,      Shadow : -1,    Shield : -1,    Life : -1,
      Regen : -1,         Absorb : -1,     ArcaneF : -1
    },
    ScBuff :
    {
      Protection : -1,    Haste : -1,      Shadow : -1,    Life : -1,      Absorb : -1
    },
    InfBuff :
    {
      Flames : -1,        Frost : -1,      Lightning : -1,     Storms : -1,
      Divinity : -1,      Darkness : -1
    },
    EXBuff :
    {
      FlowerVase : -1,    BubbleGum : -1,      Channeling : -1,       EtherTap : -1,
      Defend : -1,        Focus : -1,          SpiritStance:-1
    }
  };
  ///////////////////////
  //
  ////Spirit Stance
  if (document.querySelector('#ckey_spirit').src.indexOf('spirit_a') >= 0)  {StatInfo.EXBuff.SpiritStance = 1;}
  //
  ////
  StatBuffAll = document.querySelectorAll('.bte > img');
  for (i=0; i<StatBuffAll.length; i++)
  {
    StatBuffOne = StatBuffAll[i].getAttribute("onmouseover");
    StatBuffDuration = StatBuffOne.indexOf('autocast') >= 0 ? -1 : parseInt(StatBuffOne.match(/\d*\)/)[0].split(')')[0]);
    //
    ////Defend Focus
    if (StatBuffOne.indexOf("'Defending'")>=0 )     {StatInfo.EXBuff.Defend = StatBuffDuration;}
    if (StatBuffOne.indexOf("'Focusing'")>=0 )      {StatInfo.EXBuff.Focucs = StatBuffDuration;}
    //
    ////Potion-->Draught
    if (StatBuffOne.indexOf("'Regeneration'")>=0 )  {StatInfo.Draught.HP = StatBuffDuration;}
    if (StatBuffOne.indexOf("'Replenishment'")>=0 ) {StatInfo.Draught.MP = StatBuffDuration;}
    if (StatBuffOne.indexOf("'Refreshment'")>=0 )   {StatInfo.Draught.SP = StatBuffDuration;}
    //
    ////Spell & Scroll
    if ( StatBuffOne.indexOf("'Channeling'")>=0 )   {StatInfo.EXBuff.Channeling = StatBuffDuration;}
    if ( StatBuffOne.indexOf("'Protection'")>=0 )
    {
      if ( StatBuffOne.indexOf('autocast')>=0 )     {StatInfo.IABuff.Protection = 1;}
      else if ( StatBuffOne.indexOf('Scroll')>=0 )  {StatInfo.ScBuff.Protection = StatBuffDuration;}
      else                                          {StatInfo.SpBuff.Protection = StatBuffDuration;}
    }
    if ( StatBuffOne.indexOf("'Hastened'")>=0 )
    {
      if ( StatBuffOne.indexOf('autocast')>=0 )     {StatInfo.IABuff.Haste = 1;}
      else if ( StatBuffOne.indexOf('Scroll')>=0 )  {StatInfo.ScBuff.Haste = StatBuffDuration;}
      else                                          {StatInfo.SpBuff.Haste = StatBuffDuration;}
    }
    if ( StatBuffOne.indexOf("'Shadow Veil'")>=0 )
    {
      if ( StatBuffOne.indexOf('autocast')>=0 )     {StatInfo.IABuff.Shadow = 1;}
      else if ( StatBuffOne.indexOf('Scroll')>=0 )  {StatInfo.ScBuff.Shadow = StatBuffDuration;}
      else                                          {StatInfo.SpBuff.Shadow = StatBuffDuration;}
    }
    if ( StatBuffOne.indexOf("'Spirit Shield'")>=0 )
    {
      if ( StatBuffOne.indexOf('autocast')>=0 )     {StatInfo.IABuff.Shield = 1;}
      else if ( StatBuffOne.indexOf('Scroll')>=0 )  {StatInfo.ScBuff.Shield = StatBuffDuration;}
      else                                          {StatInfo.SpBuff.Shield = StatBuffDuration;}
    }
    if ( StatBuffOne.indexOf("'Spark of Life'")>=0 )
    {
      if ( StatBuffOne.indexOf('autocast')>=0 )     {StatInfo.IABuff.Life = 1;}
      else if ( StatBuffOne.indexOf('Scroll')>=0 )  {StatInfo.ScBuff.Life = StatBuffDuration;}
      else                                          {StatInfo.SpBuff.Life = StatBuffDuration;}
    }
    if ( StatBuffOne.indexOf("'Absorbing Ward'")>=0 )
      if ( StatBuffOne.indexOf('Scroll')>=0 )       {StatInfo.ScBuff.Absorb = 1;}
      else                                          {StatInfo.SpBuff.Absorb = 1;}
    if ( StatBuffOne.indexOf("'Regen'")>=0 )        {StatInfo.SpBuff.Regen = StatBuffDuration;}
    if ( StatBuffOne.indexOf("'Arcane Focus'")>=0 ) {StatInfo.SpBuff.ArcaneF = StatBuffDuration;}
    //
    ////Infusion & Item
    if ( StatBuffOne.indexOf("'Infused Lightning'")>=0 )    {StatInfo.InfBuff.Lightning = StatBuffDuration;}
    if ( StatBuffOne.indexOf("'Infused Storm'")>=0 )        {StatInfo.InfBuff.Storm = StatBuffDuration;}
    if ( StatBuffOne.indexOf("'Infused Frost'")>=0 )        {StatInfo.InfBuff.Frost = StatBuffDuration;}
    if ( StatBuffOne.indexOf("'Infused Flames'")>=0 )       {StatInfo.InfBuff.Flames = StatBuffDuration;}
    if ( StatBuffOne.indexOf("'Infused Divinity'")>=0 )     {StatInfo.InfBuff.Divinity = StatBuffDuration;}
    if ( StatBuffOne.indexOf("'Infused Darkness'")>=0 )     {StatInfo.InfBuff.Darkness = StatBuffDuration;}
    if ( StatBuffOne.indexOf("'Sleeper Imprint'")>=0 )      {StatInfo.EXBuff.FlowerVase = StatBuffDuration;}
    if ( StatBuffOne.indexOf("'Kicking Ass'")>=0 )          {StatInfo.EXBuff.BubbleGum = StatBuffDuration;}
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
////
function StatRestore()
{
  const StatRestoreWarn =
  {
    HPLow : 6000,   HPHigh : 15000,
    MPLow : 2900,   MPHigh : 3700,   MP0 : 1500,
    SPLow : 1000,   SPHigh : 1500,   SP0 : 500
  };
  //
  //// HP
  GemInfo();
  if (StatInfo.Status.HP < StatRestoreWarn.HPLow)
  {
    if (CD('Full-Cure'))             {Cast('Full-Cure');}
    if (CD('Cure'))                  {Cast('Cure');}
    if (GemType == 'Health')         {GemUse("Health");}
    if (StatInfo.EXBuff.Defend < 0)  {Toggle('defend');}
    Use("Health Potion");
    if (GemType !== 'None')          {GemUse("Mana,Mystic,Spirit");}
    if (liveC>6)                     {Use("Health Elixir");/*Use("Last Elixir");*/}
  }
  if (StatInfo.Status.HP < StatRestoreWarn.HPHigh)
  {
    if (CD('Cure'))                   {Cast('Cure');}
    if (liveC > 6 &&
        StatInfo.EXBuff.Defend < 0)   {Toggle('defend');}
    if (GemType == 'Health')          {GemUse("Health");}
    if (CD('Full-Cure'))              {Cast('Full-Cure');}
  }
  if (StatInfo.Draught.HP <= 0)   {Use("Health Draught");}
  //
  //// MP
  if (StatInfo.Status.MP < StatRestoreWarn.MPHigh && GemType == 'Mana')          {GemUse("Mana");}
  if (StatInfo.Status.MP < StatRestoreWarn.MPLow)                                {Use("Mana Potion");}
  if (StatInfo.Status.MP < StatRestoreWarn.MPHigh && StatInfo.Draught.MP <= 0)   {Use("Mana Draught");}
  if (StatInfo.Status.MP < StatRestoreWarn.MP0)                                  {Use("Mana Elixir");}
  //
  //// SP
  if (StatInfo.Status.SP < StatRestoreWarn.SPHigh && GemType == 'Spirit')        {GemUse("Spirit");}
  if (StatInfo.Status.SP < StatRestoreWarn.SPLow)                                {Use("Spirit Potion");}
  if (StatInfo.Status.SP < StatRestoreWarn.SPHigh && StatInfo.Draught.SP <= 0)   {Use("Spirit Draught");}
  if (StatInfo.Status.SP < StatRestoreWarn.SP0)                                  {Use("Spirit Elixir");}
  //
  if (GemType == 'Mystic')                                                       {GemUse("Mystic");}
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//// Buff
//// BS
function SuBuff(BS)
{
  if (StatInfo.ScBuff.Life <= 0 && BS.ScLife >= 1 )                          {Use('Scroll of Life');}
  if (StatInfo.IABuff.Life <= 0 && StatInfo.SpBuff.Life <= 0 &&
      StatInfo.ScBuff.Life <= 0 && BS.SpLife >= 1 )                          {Cast('Spark of Life');}

  if (StatInfo.ScBuff.Haste <= 0 && BS.ScHaste >= 1 )                        {Use('Scroll of Swiftness');}
  if (StatInfo.IABuff.Haste <= 0 && StatInfo.SpBuff.Haste <= 0 &&
      StatInfo.ScBuff.Haste <= 0 && BS.SpHaste >= 1 )                        {Cast('Haste'); }

  if (StatInfo.IABuff.Shield <= 0 && StatInfo.SpBuff.Shield <= 0 &&
      BS.SpShield >= 1 )                                                     {Cast('Spirit Shield');}

  if (StatInfo.ScBuff.Protection <= 0 && BS.ScProtection >= 1 )              {Use('Scroll of Protection');}
  if (StatInfo.IABuff.Protection <= 0 && StatInfo.SpBuff.Protection <= 0 &&
      StatInfo.ScBuff.Protection <= 0 && BS.SpProtection >= 1 )              {Cast('Protection');}

  if (StatInfo.ScBuff.Shadow <= 0 && BS.ScShadow >= 1 )                      {Use('Scroll of Shadows');}
  if (StatInfo.IABuff.Shadow <= 0 && StatInfo.SpBuff.Shadow <= 0 &&
      StatInfo.ScBuff.Shadow <= 0 && BS.SpShadow >= 1 )                      {Cast('Shadow Veil');}

  if (StatInfo.SpBuff.Regen <= 0 && BS.Regen >= 1 )                          {Cast('Regen');}

  if (StatInfo.ScBuff.Absorb <= 0 && BS.ScAbsorb >= 1)                       {Use('Scroll of Absorption');}
  if (StatInfo.SpBuff.Absorb <= 0 && BS.SpAbsorb >= 1 &&
      StatInfo.ScBuff.Absorb <= 0 && CD('Absorb') )                          {Cast('Absorb');}

  if (BS.AF >= 1 && (StatInfo.SpBuff.ArcaneF <= 0 ||
                     StatInfo.SpBuff.ArcaneF <= 10 && liveC <= 3) )          {Cast('Arcane Focus');}

  if (StatInfo.EXBuff.Channeling >= 0 && StatInfo.SpBuff.Regen < 60 && StatInfo.SpBuff.ArcaneF < 200)
    if (liveC < 6 && StatInfo.SpBuff.Regen * 7 > StatInfo.SpBuff.ArcaneF * 2)       {Cast('Arcane Focus');}
    else                                                                            {Cast('Regen');}

  if (StatInfo.InfBuff.Lightning <= 0 && BS.InfElec >= 1)                    {Use('Infusion of Lightning');}
  if (StatInfo.InfBuff.Flames <= 0 && BS.InfFlame >= 1)                      {Use('Infusion of Flames');}
  if (StatInfo.InfBuff.Storms <= 0 && BS.InfWind >= 1)                       {Use('Infusion of Storms');}
  if (StatInfo.InfBuff.Frost <= 0 && BS.InfFrost >= 1)                       {Use('Infusion of Frost');}
  if (StatInfo.InfBuff.Divinity <= 0 && BS.InfDiv >= 1)                      {Use('Infusion of Divinity');}
  if (StatInfo.InfBuff.Darkness <= 0 && BS.InfDark >= 1 )                    {Use('Infusion of Darkness');}
  if (StatInfo.EXBuff.FlowerVase <= 0 && BS.FV >= 1)                         {Use('Flower Vase');}
  if (StatInfo.EXBuff.BubbleGum <= 0 && BS.BG >= 1)                          {Use('Bubble-Gum');}
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
////LiveMonsterType
////LiveType_All
function LiveType()
{
  LiveType_All = MonStatInfo[0].Mtype;
  for (i=0; i<oMonC; i++)
  {
    if (MonStatInfo[i].Mtype !== LiveType_All && MonStatInfo[i].living >= 1)
    {
      LiveType_All = LiveType_All == 'Dead' ? MonStatInfo[i].Mtype : 'Misc';
    }
  }
}
//
//// Used in previous versions  150(38,75,113);125(42,84);110(55)
function ManaRestore()
{
  if (StatInfo.Status.OC >= 25 && StatInfo.Status.MP < 3700)   {Toggle('focus');}
  LiveType();
  if (StatInfo.Status.MP < 2900 && LiveType_All == 'JK')
    for (i=0; i<oMonC; i++)
      if (MonStatInfo[i].living == 1 && MonStatInfo[i].CM >= 0)   {Toggle('attack');  document.getElementById(live[i].id).click();}
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//// MonStat
//// MonStatInfo[]
function MonStat()
{
  const MonNameAr =
  {
    Rare :   ['Manbearpig','White Bunneh','Mithra','Dalek'],
    JK :     ['Konata','Mikuru Asahina','Ryouko Asakura','Yuki Nagato'],
    Tree :   ['Skuld','Urd','Verdandi','Yggdrasil'],
    Dragon : ['Rhaegal','Viserion','Drogon'],
    God :    ['Real Life','Invisible Pink Unicorn','Flying Spaghetti Monster']
  };
  MonStatInfo = [];
  for (i=0; i<oMonC; i++)
  {
    MonStatInfo[i] =
    {
      living : oMon[i].style.opacity == "0.3" ? 0 : 1,
      Imp : -1,
      Sil : -1,
      Mag : -1,
      Weak : -1,
      CM : -1,
      /*
      Element :
      {
        ElecDbf : -1,
        WindDbf : -1,
        FireDbf : -1,
        IceDbf : -1,
        DarkDbf : -1,
        HolyDbf : -1
      },  */
      /*
      SLill :
      {
        Stunned : -1
      },  */
      HPbar : oMon[i].style.opacity == "0.3" ? -1 : oMon[i].querySelector('.btm4 > div:nth-child(1) > div >img.chb2').width,
      Mtype : oMon[i].style.opacity == "0.3" ? "Dead" : "Norm",
      BKG : oMon[i].querySelector('.btm2').style.background
    };
    if (MonStatInfo[i].living == 1)
    {
      DeBuffi = oMon[i].querySelectorAll('.btm6 > img');
      for (j=0; j<DeBuffi.length; j++)
      {
        dbfStr = DeBuffi[j].getAttribute("onmouseover");
        if (dbfStr.indexOf('Coalesced Mana')>=0 )   {MonStatInfo[i].CM = parseInt(dbfStr.match(/\d*\)/)[0].split(')')[0]);}
        if (dbfStr.indexOf('Imperiled')>=0 )        {MonStatInfo[i].Imp = parseInt(dbfStr.match(/\d*\)/)[0].split(')')[0]);}
        if (dbfStr.indexOf('Silenced')>=0 )         {MonStatInfo[i].Sil = parseInt(dbfStr.match(/\d*\)/)[0].split(')')[0]);}
        if (dbfStr.indexOf('Magically Snared')>=0 ) {MonStatInfo[i].Mag = parseInt(dbfStr.match(/\d*\)/)[0].split(')')[0]);}
        if (dbfStr.indexOf('Weakened')>=0 )         {MonStatInfo[i].Weak = parseInt(dbfStr.match(/\d*\)/)[0].split(')')[0]);}
        /*
        if (dbfStr.indexOf('Deep Burn')>=0 )        {MonStatInfo[i].Element.ElecDbf = 1;}
        if (dbfStr.indexOf('Searing Skin')>=0 )     {MonStatInfo[i].Element.FireDbf = 1;}
        if (dbfStr.indexOf('Freezing Limbs')>=0 )   {MonStatInfo[i].Element.IceDbf = 1;}
        if (dbfStr.indexOf('Turbulent Air')>=0 )    {MonStatInfo[i].Element.WindDbf = 1;}
        if (dbfStr.indexOf('Blunted Attack')>=0 )   {MonStatInfo[i].Element.DarkDbf = 1;}
        if (dbfStr.indexOf('Breached Defense')>=0 ) {MonStatInfo[i].Element.HolyDbf = 1;}
        */
        /*
        if (dbfStr.indexOf('Stunned')>=0 )          {MonStatInfo[i].Skill.Stunned = 1;}
        */
      }
      nameStr = oMon[i].querySelector('.btm3>.fd2>div').innerHTML;
      if ((MonStatInfo[i].BKG=="#DBA8A0" || MonStatInfo[i].BKG=="rgb(219, 168, 160)") &&
          MonNameAr.JK.indexOf(nameStr)>=0)          {MonStatInfo[i].Mtype = "JK";}
      if ((MonStatInfo[i].BKG=="#A989A5" || MonStatInfo[i].BKG=="rgb(169, 137, 165)") &&
          MonNameAr.God.indexOf(nameStr)>=0)         {MonStatInfo[i].Mtype = "God";}
      if ((MonStatInfo[i].BKG=="#E6CCA3" || MonStatInfo[i].BKG=="rgb(230, 204, 163)") &&
          MonNameAr.Rare.indexOf(nameStr)>=0)        {MonStatInfo[i].Mtype = "Rare";}
      if (MonNameAr.Tree.indexOf(nameStr)>=0)        {MonStatInfo[i].Mtype = "Tree";}
      if (MonNameAr.Dragon.indexOf(nameStr)>=0)      {MonStatInfo[i].Mtype = "Dragon";}
    }
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
////
function RangeNum(MR, Mn)
{
  MonNum = 0;
  RangeUU = (Mn-Math.ceil((MR-1)/2) < 0 || MR >= oMonC) ? 0 : Mn-Math.ceil((MR-1)/2);
  RangeDD = (Mn+Math.floor((MR-1)/2) >= oMonC || MR >= oMonC) ? oMonC-1 : Mn+Math.floor((MR-1)/2);
  for (k=RangeUU; k<=RangeDD; k++)  {MonNum += MonStatInfo[k].living;}
  if (MonNum > 0) {return(MonNum);}
}
function AtkMonId(MR)
{
  t = -1; tst = 0;
  for (i=0; i<oMonC; i++)
  {
    if (MonStatInfo[i].living == 1)
    {
      tsi = MonStatInfo[i].HPbar + (MonStatInfo[i].CM >= 0 ? 1 : 0) * 125 + RangeNum(MR, i) * 250;
      if (tsi > tst )
      {
        t = i;
        tst = tsi;
      }
    }
  }
  if (t >= 0) {return(t);}
}
function DbfMonId(MR, aDBF)
{
  for (i=0; i<oMonC; i++)
  {
    if (MonStatInfo[i].living == 1 && aDBF[i] == -1)
    {
      t = -1; tnt = 0;
      RangeU = (i-Math.floor((MR-1)/2) < 0 || MR >= oMonC) ? 0 : i-Math.floor((MR-1)/2);
      RangeD = (i+Math.ceil((MR-1)/2) > oMonC-1 || MR >= oMonC) ? oMonC-1 : i+Math.ceil((MR-1)/2);
      for (j=RangeD; j>=RangeU; j--)
      {
        if (MonStatInfo[j].living == 1)
        {
          tnj = RangeNum(MR, j);
          if (tnj > tnt)
          {
            tnt = tnj;
            t = j;
          }
        }
      }
      if (t >= 0) {return(t);}
    }
  }
  return(-1);
}
//
////
function Imperil(num)
{
  arDBF = [];
  for (i=0; i<oMonC; i++)
    { arDBF[i] = MonStatInfo[i].Imp == -1 ? -1 : 0; }
  MonId = DbfMonId(num, arDBF);
  if (MonId >= 0)
  {
    Cast('Imperil');
    if (MonStatInfo[MonId].living <= 0) {alert('Imperil '+MondId);}
    document.getElementById(oMon[MonId].id).click();
  }
}
function MagNet(num)
{
  arDBF = [];
  for (i=0; i<oMonC; i++)
    { arDBF[i] = (MonStatInfo[i].Mag == -1 &&
                  MonStatInfo[i].Mtype != "Norm" &&
                  MonStatInfo[i].Mtype != "Dead" &&
                  MonStatInfo[i].Mtype != "Tree") ? -1 : 0; }
  MonId = DbfMonId(num, arDBF);
  if (MonId >= 0)
  {
    Cast('MagNet');
    if (MonStatInfo[MonId].living <= 0) {alert('MagNet '+MondId);}
    document.getElementById(oMon[MonId].id).click();
  }
}
function Silence(num)
{
  arDBF = [];
  for (i=0; i<oMonC; i++)
    { arDBF[i] = (MonStatInfo[i].Sil == -1 &&
                  MonStatInfo[i].Mtype != "Norm" &&
                  MonStatInfo[i].Mtype != "Dead" &&
                  MonStatInfo[i].Mtype != "Tree") ? -1 : 0; }
  MonId = DbfMonId(num, arDBF);
  if (MonId >= 0)
  {
    Cast('Silence');
    if (MonStatInfo[MonId].living <= 0) {alert('Silence '+MondId);}
    document.getElementById(oMon[MonId].id).click();
  }
}
function Weaken(num)
{
  arDBF = [];
  for (i=0; i<oMonC; i++)
    { arDBF[i] = MonStatInfo[i].Weak == -1 ? -1 : 0; }
  MonId = DbfMonId(num, arDBF);
  if (MonId >= 0)
  {
    Cast('Weaken');
    document.getElementById(oMon[MonId].id).click();
  }
}
//
////
function DeBuff()
{
  MonStat();
  if ( (BattleType == 'ec'  ||  (BattleType == 'iw' && NowRound >= 40)) && CD('Weaken') )
    {Weaken(3);}
  if (CD('MagNet'))
    {MagNet(3);}
  if (CD('Silence'))
    {Silence(3);}
  if (CD('Imperil'))
    {Imperil(3);}
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
function OffensiveMagic()
{
  //
  ////
   T3 = 'Wrath of Thor';        T3r = 10;
   T2 = 'Chained Lightning';    T2r = 7;
   T1 = 'Shockblast';           T1r = 5;
  //
  ////
  LiveType();
  if (liveC == 1 && LiveType_All == 'Norm')
  {
    Cast(T1);
    MonId = AtkMonId(T1r);
  }
  else if (CD(T3))
  {
    Cast(T3);
    MonId = AtkMonId(T3r);
  }
  else if(CD(T2))
  {
    Cast(T2);
    MonId = AtkMonId(T2r);
  }
  else
  {
    Cast(T1);
    MonId = AtkMonId(T1r);
  }
  document.getElementById(oMon[MonId].id).click();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//// Set Buffs
function Buff()
{
  BuffStr =
  {
    ScProtection : 0, ScHaste : 0, ScShadow : 0, ScShield : 0, ScLife : 0,
    IAProtection : 1, IAHaste : 1, IAShadow : 1, IAShield : 1, IALife : 1,
    SpProtection : 1, SpHaste : 1, SpShadow : 1, SpShield : 1, SpLife : 1, SpAbsorb : 1, AF : 1, Regen : 1,
    InfElec      : 0, InfWind : 0, InfFlame : 0, InfFrost : 0, InfDiv : 0, InfDark  : 0, FV : 0, BG : 0
  };
  if (BattleType == 'ar')  {SuBuff(BuffStr);}
  if (BattleType == 'iw')
  {
    if (NowRound >= 55) {BuffStr.ScProtection = 1;}  if(NowRound < 60) {SuBuff(BuffStr);}
    if (NowRound >= 65) {BuffStr.ScHaste = 1;}       if(NowRound < 70) {SuBuff(BuffStr);}
    if (NowRound >= 70) {BuffStr.ScShadow = 1;}      if(NowRound < 75) {SuBuff(BuffStr);}
    if (NowRound >= 75) {BuffStr.InfElec = 1;}       SuBuff(BuffStr);
  }
  if (BattleType == 'gr')  {SuBuff(BuffStr);}
  SuBuff(BuffStr);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
function SubMain()
{
  PonyWarn();
  BattleTypeF();
  if (document.querySelector('#battleform') !== null)
  {
    if (AutoClick()) return;
  }
  else return;
  {
    liveC = document.querySelectorAll('.btm1[onmouseout="battle.unhover_target()"]').length;
    oMon = document.querySelectorAll('.btm1');
    oMonC = oMon.length;
  }
  Stat();
  GetRound();
  StatRestore();
  Buff();
  DeBuff();
  //ManaRestore();
  OffensiveMagic();
  //StaminaWarn();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//Disable or Enable the AutoMage Script
function Main()
{
  localStorage.autenable = localStorage.autoenable === undefined ? 1 : localStorage.autoenable;
  if (localStorage.autoenable == 1)  {SubMain();}
  SwitchImg = document.querySelector('body > div.stuffbox.csp > div.clb > img');
  if (SwitchImg !== null)
  {
    SwitchImg.onclick = function()
    {
      if (localStorage.autoenable == 1)
        { localStorage.autoenable = 0;  alert('Stopped'); }
      else
        { localStorage.autoenable = 1;  SubMain(); }
    };
  }
}

Main();