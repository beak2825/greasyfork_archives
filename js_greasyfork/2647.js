// ==UserScript==
// @name           Langpack-EN-KoC-Power-Multilang
// @version        3.4.2
// @namespace      PDXML
// @description    English language text for KOC Power script for  Kingdom of Camelot Facebook Game
// @homepage       http://kocscripts.com
// @icon           http://kocscripts.com/img/logo.png
// @copyright      Copyright 2014 vulcan_ (Jeff Hayes) - Non-commercial use only.
// @license        CC BY-NC-ND 3.0 http://creativecommons.org/licenses/by-nc-sa/3.0/


// @include        *kingdomsofcamelot.com/*main_src.php*
// @include        *kingdomsofcamelot.com/*fbLoginButton.php*
// @include        *kingdomsofcamelot.com/*standAlone.php*
// @include        *kingdomsofcamelot.com/*platforms/kabam*
// @include        *kingdomsofcamelot.com/*acceptToken_src.php*
// @include        *kingdomsofcamelot.com/*helpFriend_src.php*
// @include        *kingdomsofcamelot.com/*newgameV2_src.php*
// @include        *apps.facebook.com/kingdomsofcamelot/*
// @include        *facebook.com/connect/uiserver.php*
// @include        *facebook.com/*/serverfbml*
// @include        *facebook.com/dialog/feed*
// @include        *facebook.com/dialog/stream.publish*
// @include        *facebook.com/dialog/apprequests*
// @include        *kabam.com/*

// @grant          unsafeWindow
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          GM_log
// @grant          GM_registerMenuCommand
// @grant          GM_getResourceText
// @grant          GM_getResourceURL
// @grant          GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/2647/Langpack-EN-KoC-Power-Multilang.user.js
// @updateURL https://update.greasyfork.org/scripts/2647/Langpack-EN-KoC-Power-Multilang.meta.js
// ==/UserScript==
//	│                                                              │
//	│   TRANSLATOR: PDX, Steffen Schwab, Stephanie Mundt,          │
//      │      Christopher McLaughlin, vulcan_                         │
//	│                                                              │
//	│   HELP                                                       │
//	│   main = GLOBAL VARS (one words spread in the whole Script)  │
//	│   - Head = HEADLINES                                         │
//	│   - Title = MOUSE OVER TEXT                                  │
//	│   button = BUTTON TEXT                                       │
//	│                                                              │
//	│  IMPORTANT:	PLEASE DONT HIT ENTER OR CREATE ANY NEW LINES  │
//	│  ITS IMPORTANT THAT ALL LANGPACKS ARE THE SAME               │
//	│                                                              │
//	│  TRANSLATOR NOTES:	any Problems or Questions ?            │
//	│  			                                       │
//	└──────────────────────────────────────────────────────────────┘

// testing variables

if (!langpack)
	{
	var langpack = new Object();
	langpack.loaded = false;

	var FlagEN24 = "english flag";
	var FlagDE24 = "german flag";
	var FlagFR24 = "french flag";
	var FlagTR24 = "turkish flag";
	var FlagIT24 = "italian flag";
	var FlagPT24 = "portugese flag";
	var FlagES24 = "spanish flag";
 	}


//	┌─────────────────────────────────────────────┐
//	│  STATS				 │
langpack.ksTeamMember			= '30';
langpack.ksVipMember			= '95';
langpack.ksDeveloper			= '1';
//	│   						│
//	└─────────────────────────────────────────────┘


// TAB - LABELS
langpack.tabLabelOverview		= 'Stats';
langpack.tabLabelOptions		= 'Options';
langpack.tabLabelProduction		= 'Production';
langpack.tabLabelCrest			= 'Crest';
langpack.tabLabelAutoTrain		= 'Auto Train';
langpack.tabLabelAlliance		= 'Alliance';
langpack.tabLabelFake			= 'Fake';
langpack.tabLabelCombat			= 'Combat';
langpack.tabLabelActionLog		= 'Log';
langpack.tabLabelCourt			= 'Court';
langpack.tabLabelMovement		= 'Movement';
langpack.tabLabelThrone			= 'Throne View';
langpack.tabLabelThroneStuff	= 'Throne Mgmt';
langpack.tabLabelKnights		= 'Knights';
langpack.tabLabelWild			= 'Wilds';
langpack.tabLabelTrain			= 'Train';
langpack.tabLabelAutoCraft		= 'Crafting';
langpack.tabLabelAutoBuild		= 'Build';
langpack.tabLabelAutoScout		= 'Scout';
langpack.tabLabelMarch			= 'March';
langpack.tabLabelSearch			= 'Search';
langpack.tabLabelDomain			= 'Domain';
langpack.tabLabelReassign		= 'Reassign';
langpack.tabLabelAutoFarm		= 'Auto Farm';
langpack.tabLabelApothecary		= 'Apothecary'
langpack.tabLabelPopControl		= 'Troop Builder';
langpack.tabLabelTurboSearch	= 'Turbo Search';
langpack.tabLabelSendMarch		= 'March Sys';


//	┌─────────────────────────────────────────────┐
//	│  POWER - TAB TRANSLATION  - BEGIN	 │
//	└─────────────────────────────────────────────┘


// TAB - OPTIONS
langpack.optionsHeadLanguage	= 'Language and Version';
langpack.optionsHeadMulti = 'KoC Power - Settings';
langpack.optionsHeadChat = 'Chat';
langpack.optionsHeadColors = 'Colors';
langpack.optionsHeadStyle = 'Style';
langpack.optionsHeadStats = 'Overview Settings';
langpack.optionsHeadReports = 'Reports';
langpack.optionsHeadTower = 'Tower';
langpack.optionsHeadMore = 'more Settings';
langpack.optionsHeadBugFixes = 'KoC Bug Fixes';
langpack.optionsHeadReset = 'Reset Options';
langpack.optionsHeadResetNote = 'reset all settings here';
langpack.optionsHeadSounds = 'Sounds';
langpack.optionsHeadSoundsNote = 'Sounds ONLY on Chat Alerts';
langpack.optionsHeadImpExport	= 'Import und Export';
langpack.optionsHeadImpExportNote = 'Import or Export your Settings to a new profile with KoC Power - Multilang.';

langpack.options_rallypoint_keep 		= 'Keep';
langpack.options_rallypoint_keep2 		= 'Rally Point slot(s) free';
langpack.optionsVisitKS = 'Visit KoC Scripts now!';
langpack.optionsImport 			= 'Import';
langpack.optionsExport 			= 'Export';
langpack.optionsBeta = 'Beta';
langpack.optionsRelease = 'Release';
langpack.optionsLatestInstall = 'Latest'; //optionsLatestInstall Beta Version optionsLatestInstall2
langpack.optionsLatestInstall2 = 'install';
langpack.optionsLatestBetaInstallNote = 'Visit the Google Code Project Page';
langpack.optionsLatestBetaInstallNote2 = 'Change now to the Beta Version';
langpack.optionsLatestReleaseInstallNote = 'Visit the Userscripts Release Page';
langpack.optionsLatestReleaseInstallNote2 = 'Change now to the Release Version';
langpack.optionsKsRunningNote = 'Visit';
langpack.optionsKsRunningNote2 = 'Homepage now!';
langpack.optionsLangpackNote = 'If no Langpack is available, <BR>click on Update and press F5 afterwards.';
langpack.optionsLoadingSWFerror = 'cannot Download Flash files...';
langpack.optionsChargement = 'Downloading Files';
langpack.optionsStopSound = 'Disable Alert now!';
langpack.optionsKsRunning = 'You are Running:';
langpack.optionsWinDragDrop = 'allow Popup Drag&Drop';
langpack.optionsPopupBorderRadius = 'Popup Border Radius';
langpack.optionsPopupBorderRadiusNote = '14 = Default | 0 = No Border { topleft topright bottomright bottomleft }';
langpack.optionsPopupTransparent = 'Popup transparency';
langpack.optionsAutoRefreshIntervall = 'Auto Refresh - Interval';
langpack.optionsAutoRefreshIntervall2 = 'minutes';
langpack.optionsWideMap = 'Wide Map';
langpack.optionsGMTClock = 'Show GMT Time';
langpack.optionsMapExtras = 'Show Map Extras';
langpack.optionsLangFlagChat = 'Show language flag above Chat';
langpack.optionsHyperlinksButtonTitle = 'show/hide Hyperlinks';
langpack.optionsHyperlinksChat = 'Show KoC Scripts Hyperlinks Button above Chat';
langpack.optionsRefreshIfInaktive = 'Auto Refresh if KoC is inactive for 1 Minute';
langpack.optionsAwayOnKabam = 'I am Away... <sup><span class="boldRed">(only on Kabam!)</span></sup>';
langpack.optionsUserTab = 'Customized Tab';
langpack.optionsTabName = 'Tab Name';
langpack.optionsPopupHeight = 'Popup Height ';
langpack.optionsPopupHeight2 = 'pox <sup>(<span class=boldRed>700 Default</span>)</sup>';
langpack.optionsAutoPublishOnFacebook = 'Auto Publish Build Request to Facebook Wall';
langpack.optionsAutoPublishOnFacebookNote = 'all Domains';
langpack.optionsAutoPublishOnFacebookNote2 = 'To Reduce Captcha Alert Select \'Only Me\'';
langpack.optionsAutoPublishOnFacebookEveryone = 'Everyone'; // USE THE VALUE FROM FACEBOOK - EN: Everyone
langpack.optionsAutoPublishOnFacebookFriendsOfFriends = 'Friends of Friends'; // USE THE VALUE FROM FACEBOOK - EN: Friends of Friends
langpack.optionsAutoPublishOnFacebookFriendsOnly = 'Friends Only'; // USE THE VALUE FROM FACEBOOK - EN: Friends Only
langpack.optionsAutoPublishOnFacebookOnlyMe = 'Only Me'; // USE THE VALUE FROM FACEBOOK - EN: Only Me

langpack.optionsBrowserBGNote = 'Here you can set an Image or Color for your Browser Background';
langpack.optionsBrowserBGColor = 'Background Color';
langpack.optionsBrowserBGImage = 'Background Image';
langpack.optionsBrowserBGImageURL = 'Image URL';
langpack.optionsBrowserBGImageNote = 'enter here your Image URL... ex. http://image.com/yourImage.jpg';
langpack.optionsBrowserBGorColor = '<u>or</u>: Color';
langpack.optionsBrowserBGColorNote = 'enter here your Color code ex. #000000 for Black';

langpack.optionsPowerMenuLeft = 'Show Tab Menu on the left';
langpack.optionsPostMulitUpdate = 'Post automatic Update Information to Alliance Chat <sup><span class="boldRed">(post on every Refresh until your Update is done!)</span></sup>';
langpack.optionsPostMulitUpdateSound = '<b>(update)</b> Command Sound:';
langpack.optionsPostMulitUpdateSoundAutoPlay = ' Auto Play';
langpack.optionsPostMulitUpdateShowFull = 'Full Note';
langpack.optionsPostMulitUpdateShowTextImageLike = 'Text + Image + Like';
langpack.optionsPostMulitUpdateShowTextImage = 'Text + Image';
langpack.optionsPostMulitUpdateShowText = 'only Text';
langpack.optionsEnableButtler = 'Res Anfrage, Shortcut Buttons, Transport Tools';
langpack.optionsLoadingsounderror = 'Unable to load sound file!';
langpack.optionsHideSummoningCircle = 'Hide Summoning Circle (Refresh needed)';
langpack.optionsMultiBrowserOverride     = 'Click <b>OK</b> on \"You have KoC open in a newer window\" pop-up';
langpack.optionsMultiBrowserAntiCheat     = 'Disable \"You have KoC open in a newer window\" pop-up';
langpack.optionsMultiBrowserAntiCheatNote     = 'Use at own risk, you will be logged by Kabam for this method!';
langpack.optionsShowMultiUpdateCmd = 'show update Information if <b>(update)</b> Command in Chat!';
langpack.optionsInfoBox = 'hide KoC Scripts - Info Box<sup><span class="boldRed">(a Like would be nice)</span></sup>';
langpack.optionsCustomWideScreen = 'Custom WideScreen';
langpack.optionsKsTab = 'KoC Scripts Tab <span class="boldRed"><sup>(a Like would be nice ;)</sup></span>';
langpack.optionsHeadTabs = 'Tabs';
langpack.optionsHeadTabsOrder = 'Tab Order';
// - STATS
langpack.optionsStatsTabShowTroops = 'Show Troops';
langpack.optionsStatsTabShowRes = 'Show Resources';
langpack.optionsStatsTabShowResProduction = 'Resource Production';
langpack.optionsStatsTabShowMarches = 'Marching Troops';
langpack.optionsStatsTabShowDef = 'Show Defense';
langpack.optionsStatsTabShortValues  = 'Shorten values in Stats Tab';
langpack.optionsStatsTabShowPop  = 'Show Population';
langpack.optionsStatsTabTrainTroops  = 'Show Training Troops';
langpack.optionsStatsTabFoodLeft  = 'Show food in red if food Left for';
langpack.optionsStatsTabFoodLeft2  = 'hours';
// - CHAT
langpack.optionsChatRight  = 'Chat on Right';
langpack.optionsChatLowFood  = 'Enable Food Alert';
langpack.optionsChatHelpReq  = 'Help on Build and Research Request';
langpack.optionsChatDelReq  = 'Hide Build and Research Request';
langpack.optionsChatDelRules  = 'Remove Chat Rules';
langpack.optionsChatExtras  = 'Extended Chat Functionality (clickable Coordinates, Colours etc.)';
langpack.optionsChatSoundVolume  = 'Volume:';
langpack.optionsChatWhisperSound  = 'Whisper Sound: URL';
langpack.optionsChatScoutSound  = 'Sound on Scout Attacks';
langpack.optionsChatScoutBG  = 'Background Color - Scout Attacks';
langpack.optionsChatAttackSound  = 'Sound on attacks on ally members';
langpack.optionsChatWildSound  = 'Sound on Wild Attacks';
langpack.optionsChatFoodSound  = 'Sound on Food Alert';
langpack.optionsChatAttackBG  = 'Background Color - Attacks';
langpack.optionsChatWildAttackBG  = 'Background Color - on Wild Attacks';
langpack.optionsChatLowFoodBG  = 'Background Color - on Food Alerts';
langpack.optionsChatGlobalBG  = 'Background Color - Global Chat';
langpack.optionsChatAllianceBG  = 'Background Color - Allianz Chat';
langpack.optionsChatFontcolor  = 'Font-color';
langpack.optionsChatLeaderBG  = 'Backgrounds for Alliance Leader';
langpack.optionsChatSelectColor  = 'Select Color';
langpack.optionsChatSelectColorNote  = 'Select now a color code!';
langpack.optionsChatOwnAvatar = 'Own Avatar: URL';
langpack.optionsChatLangFlag = 'Lang flag as Avatar <sup>(<span class=boldRed>only for you visible and disable Own Avatar!</span>)</sup>';
langpack.optionsChatOwnAvatar2 = 'Size: 25x25 only visible for yourself';
// - COLORS
langpack.optionsColorsHead = 'Player Chat Background Colors';
langpack.optionsColorsColor = 'Color';
langpack.optionsColorsSubMainTitle = 'Sub Main Title';
langpack.optionsColorsMainTitle = 'Main Title';
langpack.optionsColorsHover = 'Hover';
langpack.optionsColorsBackground = 'Background';
// - AVATAR
langpack.optionsHeadAvatars = 'Avatar';
langpack.optionsAvatarHeadMore = 'more Information';

langpack.optionsAvatarNote = '<center>All Player who Donate 2 or More than 2â¬, <BR>can set up an own Avatar that is visible <u>for</u> all  <b>KoC Power - Multilang User</b></center>\
<HR><u><b>What do i get for my Donation ?</b></u>\
<BR> 1. A Place in KoC Power - Multilang for your Avatar \
<BR> 2. All Purchased Avatars will show in the Hall of Fame\
<BR> 3. You can add an own Note that will show to everyone on MouseOver the Avatar \
<BR> 4. You can Link your Avatar with your Facebook Profile\
<BR> 5. Changing your Avatar is also no Problem (but please not every day ;) \
<HR><center>We <i>planed</i> i will try to keep this Project <u>forever</u> online!<BR>so you can be a part of - KoC (Scripts) History, at <a href="http://kocscripts.com" target="_blank">KoC Scripts</a> (<i>kocscripts.com</i>)</center>\
<div class=pdxStat>Create your Avatar</div>\
1. <a href="http://www.coolutils.com/online/image-converter/" target="_blank" title="Convert your Image to the needed Format">Create now</a> an avatar in: <i><b>25px x 25px</b> (pixel)</i> and File Type: <i><b>.png</b></i><br>\
2. Upload your Avatar <a href="http://www.directupload.net" target="_blank" title="Upload at directupload.net">hier</a> or <a href="http://imageshack.us" target="_blank"  title="Upload at imageshack.us"> here</a> <br>\
3. just copy the Blue Text, Fill it out and send it to <a href="www.facebook.com/pdxinthemix" title="Send PDX your Avatar Information now!" target="_blank">PDX</a>';

langpack.optionsAvatarForm = '<B>Comment:</B> Name: here you can add your own Comment that will display on Mouse Over<br>\
<B>Set a Hyperlink on my Avatar to my Facebook:</B> yes/no<br>\
<B>Avatar Adress:</B> http://fileHoster.com/yourAvatarIn25x25pixel.png<br>\
<B>Donate Information:</B> ex. your Paypal Name or yourAdress@paypal.com';

langpack.optionsAvatarHeadKsTeam = 'KS Team and Ks Vips';
langpack.optionsAvatarKsDeveloper = 'KS Developer';
langpack.optionsAvatarKsTeam = 'KS Team';
langpack.optionsAvatarKsVips = 'KS Vips';
langpack.optionsUserIDNote = 'This is your User ID in all domains';
// - HALL OF FAME
langpack.optionsHeadHallOfFame = 'Hall of Fame';
langpack.optionsHeadHallOfFameNote = 'Here are all the avatars that were bought by others, Thanks to all Players who already Donated!';
langpack.optionsHallOfFameNote = 'All avatars are submitted by users. copyrights are owned by them';
// - REPORTS
langpack.optionsReportsDelInboxGifts = 'Enable delete gifts report button in inbox';
langpack.optionsReportsExtras = 'Extended Alliance Reports';
langpack.optionsReportsViewMember = 'Enable Show Player'; //Spieler Anzeigen Button Aktivieren
langpack.optionsReportsDeleteButton = 'Enable Delete Button';
langpack.optionsReportsAutoDelete = 'delete reports automatically';
langpack.optionsReportsAutoDeleteScout = 'Scouts (by Attacker)';
langpack.optionsReportsAutoDeleteBarbTrans = 'Barbarian Camps / Transports';
langpack.optionsReportsAutoDeleteTransport = 'Transports (to your cities)';
langpack.optionsReportsAutoDeleteCrestCity = 'Crest Tab (City Attacks)';
// - MORE orig
langpack.optionsMoreSelectHQ = 'Select HQ';
langpack.optionsMoreOpenHQ = 'reselect HQ after refresh'; //orig: Bunker Stadt Automatisch bei Refresh aufrufen
langpack.optionsMoreAutoGold = 'Collect Gold at';
langpack.optionsMoreAutoGold2 = '% happiness automatically ';
langpack.optionsMoreCityButtons = 'Show City Buttons in Movement Tab';
langpack.optionsMoreCityButtons2 = 'Reinforce, reassign and transport';
langpack.optionsMoreMessage = 'Extended messages';
langpack.optionsBugDisableKnightSel = 'Disable knight auto-select';
langpack.optionsBugDisableKnightSel2 = 'if scouting, transporting or reassigning';
langpack.optionsBugCoordBox = 'Show coords-box above troop activities';
langpack.optionsBugMightFix = 'Might Display Fix in KoC Header';
langpack.optionsBugResFix = 'Ressource Display Fix on KoC Production Stats';
langpack.optionsBugMapDistance = 'Fix map distance bug';
// - TOWER
langpack.optionsTowerEnable = 'Enable Tower Alert';
langpack.optionsTowerEnableSounds = 'sound on attack <sup><span class="boldRed"(also on Scout or Wild Attacks)</span></sup>';
langpack.optionsTowerPostSettings = 'Post Settings:';
langpack.optionsTowerPostSettings2 = 'Alliance Chat and/or';
langpack.optionsTowerPostSettings3 = 'whisper';
langpack.optionsTowerOwnMessage = 'Own Message:';
langpack.optionsTowerAlertIf = 'alarm on:';
langpack.optionsTowerAlertIfWild = 'wilderness attack';
langpack.optionsTowerAlertIfScout = 'scout attack';
langpack.optionsTowerMinTroops = 'Min. troop count: ';
langpack.optionsTowerMinTroops2 = 'in your main city';
langpack.optionsTowerMinTroops3 = 'in your other cities';
langpack.optionsTowerFoodLeft = 'Food left';
langpack.optionsTowerHideHQ = 'DonÂ´t show main city';
langpack.optionsTowerStopOnAttack = 'Stop on attacks';
langpack.optionsTowerStopOnAttackRaid = 'RAID';
langpack.optionsTowerStopOnAttackSupply = 'Suppliers';
langpack.optionsTowerStopOnAttackDarkForest = 'DARK FOREST';
langpack.optionsTowerStopOnAttackCrest = 'CREST';
langpack.optionsTowerEMail = 'e-mail';
langpack.optionsTowerEMailNote = '(needs FB authorization)';
langpack.optionsTowerEMailToken = 'your token';
langpack.optionsTowerFletch = 'Fletching:';
langpack.optionsTowerThrone = 'Throne:';
langpack.optionsTowerRange = 'Range';
langpack.optionsTowerRangeDebuff = 'Range Debuff';
langpack.optionsTowerDefBooster = 'Def Booster:';

langpack.optionsSoundURL = 'Sound URL';
langpack.optionsSoundGetFSAttack = '-attack-';
langpack.optionsSoundGetFSHorn = '-horn-';
langpack.optionsSoundGetFSGun = '-gun-';
langpack.optionsSoundFunChatCommands = '<b>Chat Command</b>:';
langpack.optionsSoundFunSoundURL = 'URL';
langpack.optionsSoundURLNote = 'Sound on Incoming Attacks (Scout and Other)';
langpack.optionsSoundAlertLenght = 'Alarm duration';
langpack.optionsSoundsLinks = 'The <a href="https://koc-power-pdx.googlecode.com/files/sounds.txt" target="_blank">Sound Link List</a> for all Sound on our KoC Scripts Server!';

langpack.optionsChangelogFiles = 'Neusten Änderungen: <a href="http://koc-power-pdx.googlecode.com/svn/trunk/changelog-DE.txt" target="_blank" title="Schaue dir die Änderungen an"><img src="'+FlagDE24+
'" width="18" height="18" border="0" target="_blank" title="Schaue dir die Änderungen an"></a><a href="http://koc-power-pdx.googlecode.com/svn/trunk/changelog-EN.txt" target="_blank" title="Read the latest Changes"><img src="'+FlagEN24+
'" width="18" height="18" border="0" target="_blank" title="Read the latest Changes"></a><a href="http://koc-power-pdx.googlecode.com/svn/trunk/changelog-FR.txt" target="_blank" title="Lisez les dernières modifications"><img src="'+FlagFR24+
'" width="18" height="18" border="0" target="_blank" title="Lisez les dernières modifications"></a><a href="http://koc-power-pdx.googlecode.com/svn/trunk/changelog-IT.txt" target="_blank" title="Leggi le ultime modifiche"><img src="'+FlagIT24+
'" width="18" height="18" border="0" target="_blank" title="Leggi le ultime modifiche"></a><a href="http://koc-power-pdx.googlecode.com/svn/trunk/changelog-TR.txt" target="_blank" title="Son Değişiklikleri Oku"><img src="'+FlagTR24+
'" width="18" height="18" border="0" target="_blank" title="Son Değişiklikleri Oku"></a><a href="http://koc-power-pdx.googlecode.com/svn/trunk/changelog-ES.txt" target="_blank" title="Lea los últimos cambios"><img src="'+FlagES24+
'" width="18" height="18" border="0" target="_blank" title="Lea los últimos cambios"></a>\
	<a href="http://koc-power-pdx.googlecode.com/svn/trunk/changelog-PT.txt" target="_blank" title="Leia as últimas alterações"><img src="'+FlagPT24+
'" width="18" height="18" border="0" target="_blank" title="Leia as últimas alterações"></a>';

langpack.options_dashboard_head						= 'Dashboard';
langpack.options_dashboard_reswaring 				= 'Show warnings when resources<BR> are below::';
langpack.options_dashboard_display					= '<b><u>Dashboard Display Settings:</u></b> <sup><span class=boldRed>(need Refresh)</span></sup>';
langpack.options_dashboard_display_multi			= 'KoC Power - Multilang Information';
langpack.options_dashboard_display_trpreset			= 'Show Throne Presets';
langpack.options_dashboard_display_rps				= 'Rally Point';
langpack.options_dashboard_display_cds				= 'City Defense';
langpack.options_dashboard_display_tower			= 'Tower Alerts';
langpack.options_dashboard_display_alerts			= 'Warnings (Alerts)';
langpack.options_dashboard_display_5logitems		= 'Last 5 Logs Items';
langpack.options_dashboard_display_marches			= 'Saved Marches';

langpack.options_dashboard_multinote_script			= 'Script:';
langpack.options_dashboard_multinote_script2		= 'KoC Power - Multilang';
langpack.options_dashboard_multinote_version		= 'Version:';
langpack.options_dashboard_multinote_langversion	= 'Langpack Version:';
langpack.options_dashboard_multinote_forum			= 'Support Forum';
langpack.options_dashboard_multinote_update			= 'Update Info:';
langpack.options_dashboard_multinote_update2		= 'You are currently using';
langpack.options_dashboard_multinote_update3		= 'Version. Change to ';
langpack.options_dashboard_multinote_install		= 'Install';
langpack.options_dashboard_multinote_install2		= '<a href="http://userscripts.org/scripts/source/104137.user.js" target="_blank">install</a> KoC Power - Multilang (Release)';
langpack.options_dashboard_multinote_install3		= '<a href="http://koc-power-pdx.googlecode.com/svn/beta/kocpower-multi-pdx.user.js" target="_blank">install</a> KoC Power - Multilang (Beta)';
langpack.options_dashboard_multinote_links			= 'Links';


// - DEFAULLT OPTIONS
langpack.optionsDefaultAlertMessage = '!!! Attention Attack !!!';
langpack.optionsDefaultSpamGlobalMessage = 'Hi Global! Have you been on kocscripts.com today ?';
langpack.optionsDefaultSpamAllianceMessage = 'Hey Alliance =) Have you been on kocscripts.com today ?';


// TAB - AUTO FARM
langpack.farmHead = 'Automatic Farm Function';
langpack.farmButton = 'Farming';
langpack.farmShow = 'Show Farms';
langpack.farmShowNote = 'You need to Finish the Search to See the Farms...';
langpack.farmHeadStats = 'Farm Statistic';
langpack.farmHeadOptions = 'Auto Farm - Options';
langpack.farmKeepRP = 'Keep ';
langpack.farmKeepRP2 = 'rally point slot(s) free';
langpack.farmDeleteRpt = 'Delete reports:';
langpack.farmSearchDist = 'Search Distance:';
langpack.farmInactivePlayer = 'Farm if inactive for more then:';
langpack.farmInactivePlayer2 = 'days (checked every 6 hours)';
langpack.farmCityLevel = 'City Level:';
langpack.farmDip = 'Diplomacy: ';
langpack.farmHeadTroops = 'Farm Troops';
langpack.farmNoData = 'No Data';
langpack.farmFarms = 'Farms: ';
langpack.farmAllianceName = 'Alliance Name';
langpack.farmInactive = 'Inactive';
langpack.farmAttacks = '# Attacks';
langpack.farmChecks = '# Checks';
langpack.farmSearchAt = 'Searching at';
langpack.farmFound = 'Found:';
langpack.farmIntervall = 'Farm Interval:';
langpack.farmSearch = 'Search again';
langpack.farmPlayerName = 'Player Name';
langpack.farmCityName = 'City Name';
langpack.farmDist = 'Dist.';
langpack.farmId = 'Id';
langpack.farmContinuously = 'Continuously';
langpack.farmChecksAttacks = 'Attacks:';
langpack.farmChecksChecks = '- Checks:';


// TAB CREST
langpack.crestHead = 'Cresting automatically';
langpack.crestHeadSettings = 'Crest Search -Settings';
langpack.crestEnableReports = 'send Crest report';
langpack.crestReportIntervall = 'Crest report Intervall:';
langpack.crestHelpPopupHead = 'Help';
langpack.crestReloadIfFaild = 'Reload if failed';
langpack.crestKeepRPSlots = 'keep ';
langpack.crestKeepRPSlots2 = ' Rally point slots free.';
langpack.crestWave = 'Wave';
langpack.crestRoute = 'Attack Routes';
langpack.crestRoute1 = 'City / Target';
langpack.crestCaptchaAlert  = 'You have received a Captcha due to Crest tab';
langpack.crestReportHead  = 'Crest Stats:';
langpack.crestReportCrestFound  = 'found crest';
langpack.crestReportCrestTotal  = 'found crest:';
langpack.crestReportCrestTotal2  = 'found crest.';
langpack.crestReportFirstWave  = '1. Wave:';
langpack.crestReportFirstWave2  = 'send:';
langpack.crestReportSecondWave  = '2. Wave';
langpack.crestReportSecondWave2  = 'send:';
langpack.crestReport  = 'Crest report';
langpack.crestAdd  = 'add target';
langpack.crestTarget  = 'target';
langpack.crestAbdoneFaild  = 'Tried 5 Times to abandon wild... Reloading game now...';//5 tentatives d\'abandon de la TS sans succes - on recharge le jeu
langpack.crestRoundFaild  = 'Tried 50 Times to send a new round... Reloading game now...';//50 tentatives de tours - on recharge le jeu


// TAB - REASSIGN
langpack.reassignTabLabel = 'manually';
langpack.reassignHead = 'Here you can reassign troops';
langpack.reassignHeadStats = 'reassigning stats';
langpack.reassignEST = 'estimated arrival';
langpack.reassignSameCity = 'You can\'t reassign your troops in the same city...';
langpack.reassignSelectTroops = 'please choose your troops first... =)';
langpack.reassignMaxRP = 'your rally point can send: ';
langpack.reassignMaxRP2 = 'only!';
langpack.reassignLoading = 'Troops will be reassigned in few seconds...';
langpack.reassignIn2Minutes = 'Troops will be reassigned in 2 minutes...';
langpack.reassignError = 'Error, please try again... :/';
langpack.reassignOK = 'Troops will be reassigned - arrival:';
// - AUTO REASSIGN
langpack.reassignAutoTabLabel = 'automated';
langpack.reassignAutoHead = 'Reassign troops automatically';
langpack.reassignAutoTroopLock = 'troop lock';
langpack.reassignAutoTroopLockNote = 'If this setting is activated, your troop settings will not change if you switch cities';
langpack.reassignAutoAddRoute = 'add route';
langpack.reassignAutoHeadAddRoute = 'Reassigning route - add';
langpack.reassignAutoHeadRoutes = 'Reassigning route';
langpack.reassignAutoLogOK = '<u>from</u>:';
langpack.reassignAutoLogOK2 = '<u>to</u>:';
langpack.reassignCaptchaAlert  = 'You received a captcha because of automated troop reassigning';


// TAB - TRANSPORT
langpack.transportTabLabel = 'Manual';
langpack.transportHead = 'Here you can move your resources';
langpack.transportAmount = 'Transport amount:';
langpack.transportMarchTime = 'march time:';
langpack.transportGoldNote = 'transport gold';
langpack.transportFoodNote = 'transport food';
langpack.transportWoodNote = 'transport wood';
langpack.transportStoneNote = 'transport stones';
langpack.transportIronNote = 'transport ore';
langpack.transportAheterstoneNote = 'transport aetherstones';
langpack.transportOrTargetCoord = '<u>or</u> <b>target coordinate</b>:';
langpack.transportButton = 'transport now';
langpack.transportNoAlliance = 'no alliance!';
langpack.transportStatus = 'You can\'t transport more than';
langpack.transportStatus2 = 'ressources';
langpack.transportStatsHead = 'transport statistics';
langpack.transportStatusRes = 'Error: Please select a resource!';
langpack.transportStatusNotPossible = 'Error: Not possible to march to this city!';
langpack.transportStatusNoTroops = 'Error: Please choose an amount of troops!';
langpack.transportStatusCoord00 = 'Error: You can\'t march to the coordinate 0,0!';
langpack.transportOK = 'Transport is on its way!';
langpack.transportMiss = 'Error: Please try again... :/';
langpack.transportStartIn2Seconds = 'Transport starts in 2 seconds!';
langpack.transportLoading = 'Loading, Please wait a minute...';
langpack.transportValue = '<b>Werte</b>: 1 Billion = 1000000000 | 100 Million = 100000000 | 10 Million = 10000000 | 1 Million = 1000000';
langpack.transportSend = 'Send:';
langpack.transportSend2 = 'Ressourcen with';
// - AUTO
langpack.transportAutoTabLabel = 'Automated';
langpack.transportAutoMinTroops = 'Minimum troops:';
langpack.transportAutoHead = 'Auto Transport - Settings';
langpack.transportAutoAddRouteHead = 'Transport Routes - add';
langpack.transportAutoAddRoute = 'add Route';
langpack.transportAutoTroopType = 'Troop type';
langpack.transportAutoTroopAvailable = 'available:';
langpack.transportAutoTroopAvailableCarry = 'can transport:';
langpack.transportAutoNeedTroops = 'need troops:';
langpack.transportAutoRoutes = 'Transport routes';
langpack.transportAutoRoutesActive = 'active';
langpack.transportAutoRoutesDisabled = 'disabled';
langpack.transportAutoLog = '<u>from:</u>';
langpack.transportAutoLog2 = '<u>to:</u>';
langpack.transportAutoActivateRoute = 'activate route';
// - SUPPLY
langpack.transportSupplyTabLabel = 'Supplier';
langpack.transportSupplyHead = 'Organize resources for training or building';
langpack.transportSupplyHeadSettings = 'Supply settings';
langpack.transportSupplyButtonAutoTransportValue = 'Auto transport values';
langpack.transportSupplyKeep = 'keep at least:';
langpack.transportSupplyLogFullRP = 'rally point slots are occupied!';
langpack.transportSupplyLogTransport = 'Transport <u>from</u>';
langpack.transportSupplyLogTransport2 = '<u>to</u>';
langpack.transportSupplyLogNoTroops = 'not enough troops';
langpack.transportSupplyLogNoRes = 'not enough resources';


// TAB - PLAYER
langpack.playerMustInAlliance = 'You must be in an alliance to see other players';
langpack.playerTop100 = 'TOP 100';
langpack.playerMinSearch = 'Your search entry must have at least 3 characters!';
langpack.playerLoading = 'Searching data on Leader Board';
langpack.playerExportXLSNote = 'Copy content (CTRL+C), open Notepad, insert content (CTRL+V) and save as .cvs file.';
langpack.playerExportXLS = 'Export XLS:';
langpack.playerExportXLSHelp = '<u><b>Player</b></u> ; <u><b>Might</b></u> ; <u><b>Coords</b></u> ; <u><b>Level</b></u> ; <u><b>Distance</b></u> ; <u><b>City</b></u>';
langpack.playerSearchHead = 'Distance from:';
langpack.playerShowNote = 'Details';
langpack.playerShowNote2 = 'Show';
langpack.playerName = 'Player name:';
langpack.playerAlliance = 'Alliance name:';
langpack.playerSearchPlayer = 'Search Player';
langpack.playerSearchAlliance = 'Search Alliance';
langpack.playerSearchAllianceList = 'Alliance List';
langpack.playerTop100Head = 'Camelots Server Top 100  :';
langpack.playerTop100Search = 'create Top 100 list';
langpack.playerSearchFirstPageNote = 'first page';
langpack.playerSearchBackNote = 'back';
langpack.playerSearchNextNote = 'next';
langpack.playerSearchLastPageNote = 'last page';
langpack.playerSearchPlayerHead = 'result of player search:';
langpack.playerSearchAllianceHead = 'result of alliance search:';
langpack.playerSearchPlayerKoCMon = 'KoC Monitor';
langpack.playerSearchPlayerKoCMonNote = 'show player details on kocmon.com';
langpack.playerSearchAllianceKoCMonNote = 'show alliance details on kocmon.com';
langpack.playerSearchPlayerKoCdunnoNote = 'show player details on koc.dunno.com';
langpack.playerSearchPlayerUserID = 'User ID:';
langpack.playerListAlliancesFirst = 'List Alliances first.';
langpack.playerPageOutOfRange = 'Page number out of range';
langpack.playerPageDisplay = 'Display Page now...';
langpack.playerPlayerDisplay = 'Searching for Players...';


// TAB - SEARCH
langpack.searchCanceled = 'Search canceled!';
langpack.searchXmustBe = 'X must be between 0 and 749';
langpack.searchYmustBe = 'Y must be between 0 and 749';
langpack.searchMinGreater0 = 'Minimum distance should be larger than 0...';
langpack.searchMaxGreater0 = 'Maximum distance should be larger than 0...';
langpack.searchMaxGreaterMin = 'Maximum distance should be larger than minimum distance...';
langpack.searchMax375 = 'Maximum distance does not need to be larger than 375 - it only causes browser lags and slows down the search ...';
langpack.searchStop = 'Stop search';
langpack.searchShowHideOptions = 'Show/hide settings';
langpack.searchOptionsHead = 'Options';
langpack.searchLevelMin = 'Min. Level:';
langpack.searchLevelMax = 'Max. Level:';
langpack.searchStartpoint = 'startpoint:';
langpack.searchFor = 'search for:';
langpack.searchFilter = 'Filter:';
langpack.searchSort = 'Sort:';
langpack.searchCoordsOnly = 'Show only coordinates:';
langpack.searchSearching = 'searching:';
langpack.searchScoutCaptcha = 'Sorry, captcha popups...';
langpack.searchScoutBog = 'Error on scouting a bog';
langpack.searchSearched = 'Searched:';
langpack.searchFound = 'Found:';
langpack.searchStartScout = 'start attack';
langpack.searchStopScout = 'stop';
langpack.searchLastLogin = 'check last login';
langpack.searchPlayerCheckOnline = 'check player online status';
langpack.searchPlayerDetails = 'search player details';
langpack.searchPlayerCreate = 'create:';
langpack.searchPlayerLeaderboard = 'search leader board data';
langpack.searchFailedAttempt = 'attempt failed!';
langpack.searchScoutSent = 'sent =)';
langpack.searchCoordsInvalid = 'invalid coords';
langpack.searchNoCoords = 'you did not enter any coordinates...';
langpack.searchNotFoundInMist = 'not found! maybe misted?';
langpack.searchSentScouts = 'Scouts will be sent from:';
langpack.searchSentScouts2 = 'sent';
langpack.searchNoResult = 'nothing found... :/';
langpack.searchSentScoutsAttacks = 'send attack on';
langpack.searchSentScoutsAttacks2 = '...';
langpack.searchSentScoutsWaitForRP = 'wait for RP';
langpack.searchScoutsStart = 'Start';
langpack.searchScoutsHead = 'Auto scout';
langpack.searchNoScouts = 'not enough scouts';
langpack.searchScoutKnightError = 'Knight error';
langpack.searchScoutNoParameterError = 'not possible, missing parameter';
langpack.searchScoutTo = 'Scouts will be sent to';
langpack.searchScoutTo2 = 'sent';
langpack.searchScoutTargetCoords = 'target coordinates';
langpack.searchScoutAmount = 'Scout Amount:';
langpack.searchScoutNoAvailable = 'not available for level:';
langpack.searchExport = 'Export to KoC Attack';
langpack.searchScoutList = 'Scout list';
// langpack.searchStart = 'Search';
langpack.searchFree = 'free';
langpack.searchFreeSel = 'free';
langpack.searchDetails = 'Details';
langpack.searchMin3Letter = 'Your search input must have at least 3 characters!';
langpack.searchOnlyShow = 'Displaying only 500 of'; //searchOnlyShow 222 searchOnlyShow2
langpack.searchOnlyShow2 = 'results until search is finished.';
langpack.searchDarkForestOptions = 'Dark Forest - setting';
langpack.searchAll = 'all';
langpack.searchHostile = 'hostile';
langpack.searchInMist = 'in Mist';
langpack.searchAlly = 'allies';
langpack.searchFriendly = 'friendly';
langpack.searchNeutral = 'neutral';
langpack.searchNoAlliance = 'unaligned';
langpack.searchMightMin = 'Min. might:';
langpack.searchMightMax = 'Max. might:';


// TABS - DASHBOARD
langpack.dashboard_head_request				= 'Request per min.:';
langpack.dashboard_head_request2			= 'Last Mouse Move:';
langpack.dashboard_head_moveMove			= 'here you can see when you moved last time your mouse...';
langpack.dashboard_head_cityDef				= 'City Defense';
langpack.dashboard_marches_status			= 'Marches:';
langpack.dashboard_alert_foodalert			= ': low food  ->';
langpack.dashboard_alert_woodalert			= ': low wood ->';
langpack.dashboard_alert_stonealert			= ': low stone ->';
langpack.dashboard_alert_orealert			= ': low ore ->';
langpack.dashboard_alert_aehteralert		= ': low Aetherstones ->';
langpack.dashboard_alert_notroopstrain		= ': no troops trained.';
langpack.dashboard_alert_nobuildqueue		= ': no buildings in queue';
langpack.dashboard_alert_noreseach			= ': no research';
langpack.dashboard_alert_nobritonreseach	= ': no Briton Research';
langpack.dashboard_alert_thronefull			= 'Throne Room FULL';
langpack.dashboard_sacifice_head			= 'Sacrifice';


// TABS - TURBO SEARCH
langpack.searchHead = 'Search';
langpack.searchArea = 'Area';
langpack.searchBlocks= 'Blocks';
langpack.searchStart = 'Search';
langpack.searchStartSearching = 'Searched';
langpack.searchHeadResult = 'Search Results';
langpack.searchHeadResultScout = 'Spähen';
langpack.searchHeadResultShowMisted = 'Show Misted';
langpack.searchPopSelCityOrCoords = 'Please select city or enter coords...';
langpack.searchKnightSelect = '-- Knight Select --';
langpack.searchRaidSave = 'Raid and save';
langpack.searchRaidExport = 'Export';
langpack.searchRaidPopExport = 'Export to Raid';
langpack.searchCities = 'Cities';
langpack.searchBarbCamps = 'Barbarian Camps';
langpack.searchWilderness = 'Wilderness:';
langpack.searchGrassLake = 'Grass/Lake';
langpack.searchWoodland = 'Woodland';
langpack.searchHills = 'Hills';
langpack.searchMountain = 'Mountain';
langpack.searchPlain = 'Plain';
langpack.searchDarkForest = 'Dark Forest';
langpack.searchMercCamp				= 'Merc Camp';
langpack.searchFilterAlliancesRank = 'Filter alliances Rank:';
langpack.searchFilterTo = 'to';
langpack.searchFilterMisted = 'Misted';
langpack.searchFilterHostile = 'Hostile';
langpack.searchFilterFriendlyUs = 'Friendly / Us';
langpack.searchFilterFriendlyToUs = 'Friendly To Us';
langpack.searchFilterNeutral = 'Neutral';
langpack.searchFilterAllied = 'Allied';
langpack.searchFilterFriendly = 'Friendly';
langpack.searchFilterFriendly2 = 'Us';
langpack.searchFilterUnallied = 'Unallied';
langpack.searchFilterMightInMillion = 'Might (Millions):';
langpack.searchResultsCoords = 'Coords';
langpack.searchResultsPlayerName = 'Player Name';
langpack.searchResultsCityName = 'City Name';
langpack.searchResultsMistedCities = 'This function was made because Kabam needs to fix this bug, it has been around for ages.<BR>If you (just like me) don\'t like this exploit, please report it at: <a href="https://kabam.secure.force.com/PKB/pkb_contactUs?game=All&lang=en_US&l=en_US" target="_blank">This link</a>';
langpack.searchResultsLev = 'Lev';
langpack.searchResultsType = 'Type (#)';
langpack.searchResultsDist = 'Dist';
langpack.searchTransportLeastOneTroop = 'You have to send a least one unit...';
langpack.searchTransportEnterCoords = 'Please enter coords...';
langpack.searchFilterMin = 'Min.:';
langpack.searchFilterMinLev = 'Min. Level:';
langpack.searchFilterMax = 'Max.:';
langpack.searchFilterMaxLev = 'Max. Level:';
langpack.searchFilterUnowned = 'Unowned';
langpack.searchHeadPopRaids = 'KoC Power - Multilang: Raids';

langpack.searchPopRaids = '<A target="_tab" href="http://kocscripts.com/category/more/barbaren-lager/">You will find more info on KoCscripts.com</a>\
	   <TABLE class=pdxTab><TR><TD>Lvl</td><TD>Troops</td></tr>\
       <TR><TD>1</td><TD>500 Supply Troops + 500 Archers</td></tr>\
       <TR><TD>2</td><TD>500 Supply Troops + 2500 Archers</td></tr>\
       <TR><TD>3</td><TD>500 Supply Troops + 5000 Archers</td></tr>\
       <TR><TD>4</td><TD>500 Supply Troops + 7500 Archers</td></tr>\
       <TR><TD>5</td><TD>15000 Archers</td></tr>\
       <TR><TD>5</td><TD>12000 Archers IF Level 10 fletching and Level 9 Featherweight</td></tr>\
       <TR><TD>6</td><TD>25000 Archers IF Level 9 fletching</td></tr>\
       <TR><TD>6</td><TD>22000 Archers IF Level 10 fletching</td></tr>\
       <TR><TD>7</td><TD>45000 Archers IF Level 10 fletching</td></tr>\
       <TR><TD>7</td><TD>44000 Archers IF Level 10 fletching and knight 69+</td></tr>\
       <TR><TD>7</td><TD>40000 Archers IF Level 10 fletching and knight 94+</td></tr>\
       <TR><TD>8</td><TD>28000 Ballista WITH Level 10 fletching and Knight 91+</td></tr>\
       <TR><TD>9</td><TD>56000 Ballista WITH Level 10 fletching and Knight 98+</td></tr>\
       <TR><TD>10</td><TD>125000 Catapults (500 Catapults loss!)</td></tr></tr></table>';


// TAB - REPORT
langpack.reportsHead = 'Messages and Alliance Reports';
langpack.reportAllianceReports = 'Alliance Reports';
langpack.reportPlayerReports = 'Player Reports';
langpack.reportInbox = 'Inbox';
langpack.reportOutbox = 'Outbox';
langpack.reportThemAttacker = 'Attacker';
langpack.reportUsAttacker = 'Alliance';
langpack.reportBothAttacker = 'both';
langpack.reportThemTarget = 'Attacker';
langpack.reportUsTarget = 'Alliance';
langpack.reportBothTarget = 'both';
langpack.reportAutoSearch = 'Auto';
langpack.reportContain = 'Search for:';
langpack.reportDifferent = 'Difference';
langpack.reportSynthesis = 'SYN:';
langpack.reportSearchedPages = 'Search:';
langpack.reportEnemy = 'Enemy';
langpack.reportBarbLevel = 'Barb Lvl:';
langpack.reportBarbLevelNote = 'game problem: refresh';
langpack.reportCityLevel = 'City Lvl:';
langpack.reportNoResults = 'no results';
langpack.reportFound = 'Found:';
langpack.reportSearched = 'Searched:';
langpack.reportDarkForestSummary = 'show Dark Forest summary';
langpack.reportDarkForestSummaryHead = 'Dark Forest summary';
langpack.reportNoDarkForestReports = 'no Dark Forest reports found';
langpack.reportAttackSummary = 'Show Attack summary';
langpack.reportAttackSummaryHead = 'Attack summary';
langpack.reportNoAttackSummary = 'no Attack summary found';
langpack.reportOurLooses = 'your losses';
langpack.reportEnemyLooses = 'hostile losses ';
langpack.reportTotalMight = 'total might';
langpack.reportNoMightLoose = 'no might loss on both sides';
langpack.reportMightDifference = 'might difference:';
langpack.reportDeleteDarkForest = 'delete Dark Forest reports';
langpack.reportDeleteMessageNote = 'Delete Message';
langpack.reportDeleteNowNote = 'Delete report!';
langpack.reportMarchType = 'category';
langpack.reportNextCity = 'next city';
langpack.reportShortDistance = 'E';
langpack.reportShortDistanceNote = 'distance';
langpack.reportShowThroneStuff = 'show ';
langpack.reportNoThroneStuff = 'No bonus for Throne Room';
langpack.reportFighted = 'fought';
langpack.reportSurvived = 'survived';
langpack.reportKilled = 'killed';
langpack.reportMightLoose = 'Might Loss';
langpack.reportMightLooses = 'Losses';
langpack.reportExportToCombat = 'Export to Combat';
langpack.reportSecured = 'Secured';
langpack.reportReinforcement = 'Reinforcement sent';
langpack.reportAntiScout = 'Anti Scout';


// TAB - MARCH
langpack.marchHead = 'Troops Movement';
langpack.marchNoMarches = 'no marches found';
langpack.marchShowDetailsNote = 'show details ';
langpack.marchHideRaid = 'hide raids';
langpack.marchShowDetailsNote = 'show march details';
langpack.marchDeleteRaidNote = 'delete raid!';
langpack.marchRecallMarchNote = 'recall march!';
langpack.marchRecallAttackNote = 'recall attack!';
langpack.marchCityLevel = 'City - Lvl:';
// - INCOMING ATTACKS
langpack.marchIncommingButtonLabel = 'Attacks';
langpack.marchIncommingHead = 'Incoming attacks';
langpack.marchIncommingHeadNoAttacks = 'no incoming attacks  =)';
// - EMBASSY
langpack.marchEmbassyHead = 'Troops in embassy';
langpack.marchEmbassyNoTroops = 'you have no reinforcement troops at the moment... :/';
langpack.marchEmbassyFromPlayer = 'Player';
langpack.marchEmbassyShortFoodUsage = 'Usage';
langpack.marchEmbassyFoodUsage = 'Food Usage';
langpack.marchEmbassyShowOriginalTroops = 'Show Original Troops';
langpack.marchEmbassyShowOriginalTroopsNote = 'refresh to show troops in your embassy correctly!';
langpack.marchEmbassySendHomeNote = 'Send troops home...';
// - REINFORCE
langpack.marchReinforcementHead = 'Defense Troop';
langpack.marchReinforcementRecallTroopsNowNote = 'recall troops!';


// NEW MARCH
langpack.marchHeadCaptchaAlert = 'March Captcha';
langpack.marchHeadCaptchaAlertNote = 'CAPTCHA ALERT! You have been sending too many attacks!';
langpack.tabs_send_head = 'Save your Marches and Attack them';
langpack.tabs_send_head_settings = 'March Settings';
langpack.tabs_send_settings_manualmarch = 'March Now!';
langpack.tabs_send_settings_savemarch = 'Save March';
langpack.tabs_send_knight_select = '-- Choose a Knight --';
langpack.tabs_send_marchsize = 'March Size:';
langpack.tabs_send_marchsize2 = '(TR:';
langpack.tabs_send_marchsize3 = '% - Aura:';
langpack.tabs_send_marchsize4 = '%)';
langpack.tabs_send_selknight = 'Please select a knight...';
langpack.tabs_send_entercoords = 'Please enter coords...';
langpack.tabs_send_send1trp = 'You got to send a least one troop...';
langpack.tabs_send_wrongtraura = 'Can\'t send out that amount of troops, wrong TR cards or Aura?';
langpack.tabs_send_wrongtr = 'Can\'t send out that amount of troops, wrong TR cards?';
langpack.tabs_send_sendto = 'Send';
langpack.tabs_send_sendto2 = 'to';
langpack.tabs_send_details = 'Details';
langpack.tabs_send_fromcity = 'From City';
langpack.tabs_send_coords = 'Koords';
langpack.tabs_send_pop_head_savedmarches = 'Saved March info';
langpack.tabs_send_pop_head_incomming = 'Incoming Marches';
langpack.tabs_send_pop_head_outgoing = 'Outgoing Marches';
langpack.tabs_send_hideraids = 'Hide Raids.';
langpack.tabs_send_whattab = 'Tab';
langpack.tabs_send_queuemarches_note = '<ul>\
  <li><b>DF/Attack</b> and <b>Farm Tab</b>, use a combined march queue.</li>\
  <li>This march system is a virtual queue that one\'s cities will try to add to every second.</li>\
  <li>The checks are carried out in the above sequence</li>\
  <li>Then, Every 5 seconds each city will send a march from the queue.</li>\
  <li>This is done to avoid the captcha problem.</li>\
</ul>';
// the third was "Die Checks werden in der angelegten reihenfolge durchgeführt"

// TAB - ATTACK
langpack.tabs_attack_head = 'Auto Attack Coordinates';
langpack.tabs_attack_savebutton = 'Save Attack';
langpack.tabs_attack_savedmarchbutton = 'Saved Marches';


// TAB - AUTO SCOUT
langpack.autoScoutHead = 'Scout Alliance';
langpack.autoScoutNotReady = 'not ready';
langpack.autoScoutNeedAlliance = 'You need to be in an Alliance to use this feature!';
langpack.autoScoutAmount = 'units';
langpack.autoScoutMinMight = 'Min. Might:';
langpack.autoScoutMaxMight = 'Max. Might:';
langpack.autoScoutSearchAlliance = 'Alliance Search';
langpack.autoScoutAlliance = 'Alliance Name:';
langpack.autoScoutAllianceMinValue = 'Min. 3 characters!';
langpack.autoScoutSearchHead = 'Search For:';
langpack.autoScoutMember = 'Scout Member';
langpack.autoScoutResultHead = 'Result:';
langpack.autoScoutLoadPlayer = 'Show Players';
langpack.autoScoutSend = 'Scouts will be sent <u>from</u>'; // autoScoutSend CITYNAME autoScoutSend2 TARGETNAME 123,456 autoScoutSend3 DISTANCE
langpack.autoScoutSend2 = '<u>to</u>';
langpack.autoScoutSend3 = ' - <b>distance</b>:';
langpack.autoScoutSendError = 'ERROR: Auto Scout sent <u>from</u>'; // autoScoutSendError CITYNAME autoScoutSendError2 TARGETNAME 123,456 ERROROUTPUT
langpack.autoScoutSendError2 = '<u>to</u>';
langpack.autoScoutSendRestriction = 'Scouts will be sent from';
langpack.autoScoutSendRestriction2 = '<u>to</u>';
langpack.autoScoutSendRestriction3 = '- once per 24 hours!';
langpack.autoScoutAttackHead = 'Auto Scout Alliance';


// TAB - RAID
langpack.raidStopRaids = 'stop raids';
langpack.raidDeleteRaids = 'delete raids';
langpack.raidResumeRaids = 'resume raids';
langpack.raidAutoReset = 'Raid Reset';
langpack.raidReportStats = 'Raid Stats:';
langpack.raidReportFoodGain = 'Food gain (after';
langpack.raidReportFoodGain2 = 'hour(s) Raiding)';
langpack.raidReportOverview = 'Raid Overview';
langpack.raidReportFoodGainStat = '- Start:';
langpack.raidReportFoodGainStat2 = '- After:';
langpack.raidReportFoodGainStat3 = ' - Gained:';
langpack.raidReportFoodGainTotal = 'Food Gain Total:';
langpack.raidResuming = 'Resuming';
langpack.raidStopping = 'Stopping';
langpack.raidEditHead = 'Edit Raid';
langpack.raidNoFound = 'no raids active : ';
langpack.raidSaveNoFound = 'no Raids saved';
langpack.raidDeleteNote = 'delete Raid';
langpack.raidRestPeriod = 'Time left:';
langpack.raidStop = 'Stop';
langpack.raidTimer = 'Raid Reset Timer:';
langpack.raidActiveHead = 'Active Raids';
langpack.raidSavedHead = 'Saved Raids';
langpack.raidHead = 'Raids Settings';
langpack.raidReport = 'send Raid Report after';
langpack.raidReport2 = 'hour(s).';
langpack.raidDeleting = 'Deleting';


// TAB - DARK FOREST
langpack.dfSettingsNote = 'Radius (20-45) - Search every 20min!';
langpack.dfSettingsHead = 'Sanctuary Einstellung';
langpack.dfSelectTroopsHead = 'Select troops';
langpack.dfHead = 'Attacking Dark Forests automatically';
langpack.dfHeadDFTroopsNote = 'For a march with max. amount of troops for the Rally Point, enter MAX in the box.';
langpack.dfRetrySearch = 'Re-Search';
langpack.dfLastSearch = 'Last Search done at:';
langpack.dfLastSearch2 = 'found';
langpack.dfLastSearch3 = 'Dark Forests.';
langpack.dfTroopSelectLvl = 'Lvl.:';
langpack.dfTroopSelectDist = 'Dist.:';
langpack.dfPopupHead = 'Dark Forest for Server:';


// TAB - BUILD
langpack.buildHead = 'Building Cities automatically';
langpack.buildAskForHelp = 'ask for help';
langpack.buildModeLevel = '+1 Level';
langpack.buildModeMax = 'to level 9';
langpack.buildModeDestroy = 'destroy';
langpack.buildModeDestroyNow = 'destroy (with Dragon Stomp)';
langpack.buildMode = 'Build mode';
langpack.buildModeSelect = 'Method';
langpack.buildButton = 'Auto build';
langpack.buildButtonNote = 'Please Note: Auto Build shuts off if all build queues are empty';
langpack.buildLogWrongLevel = 'Found no correct value for current building!';
langpack.buildLogBuildingType = 'Building Type does not match!';
langpack.buildLogBuildingID = 'Building ID does not match!';
langpack.buildLogLevel9OrHigher = 'Queue item deleted: Building Level equals 9 or higher!';
langpack.buildLogBuildingEqualHigher = 'Queue item deleted: Building level is equal or higher';
langpack.buildLogBuildingLevelTen = 'Queue item deleted: Tried to build level 10+ building! Please report if this happens!';
langpack.buildLogBuildingProcess = 'Queue item deleted: Building at this Level already exists or build process already started!';
langpack.buildLogBuildingProcess2 = 'Building at this Level already exists or build process already started!';
langpack.buildLogBuildingProcessAgain = 'Item was requeued. Check for retry count.';
langpack.buildLogBuildingNotExist = 'Queue item deleted: Building does not exist!!!';
langpack.buildLogNoRessource = 'Not enough resources';
langpack.buildLogConstructRessource = 'construction resources';
langpack.buildLogDestructRessource = 'destruction resources';
langpack.buildLogDestructError = 'destruction Error';
langpack.buildConnectError = 'Connection Error while building! Please try again later!';
langpack.buildDestrucAlreadyInQueue = 'Destruction already in queue!';
langpack.buildOnlyLevel10 = ' Building Levels 10+ can only be built manually!';
langpack.buildAutoCloseIn10Seconds = 'window will be closed in 10 seconds';
langpack.buildBuildQueue = 'Construction queue for:';
langpack.buildBuildQueueSort = 'sort by time';
langpack.buildErrorOnDestruction = 'Destruction Error';
langpack.buildShowBuildQue = 'Construction Queue';
langpack.buildShortBuildQues = 'Qu:';
langpack.buildShortBuildQuesNote = 'Number of jobs in queue';
langpack.buildShortBuildTime = 'CT:';
langpack.buildShortBuildTimeNote = 'Total Construction Time';
langpack.buildBuildTenFaild = '10 tries failed. Reloading game now.'; //10 tentative de construction bizarre - on recharge le jeu
langpack.buildBuildTryedLevelTen = 'You tried to queue a level 10 building...';


// TAB - TRAIN
langpack.trainHead = 'Training Troops';
langpack.trainEachSlot = 'per slot';
langpack.trainSlots = '# slots';
langpack.trainNowButton = 'train troops';
langpack.trainDefenseNowButton = 'build defenses';
langpack.trainDefense = 'Defenses';
langpack.trainDefenseHead = 'Defenses';
langpack.trainTrainHead = 'Training Queue';
langpack.trainCancelAllNote = 'cancel several Trainings now!';
langpack.trainEST = 'Estimated time:';
langpack.trainESTreduction = 'reduction';
langpack.trainTimeExpected = 'estimated training time:';
langpack.trainTimeExpectedBetween = 'between';
langpack.trainCasernes = 'Baracks';
langpack.trainDelete = 'cancel Training now!';
langpack.trainDeleteMore = 'how many slots do you want to cancel? (1 = active slot - Total slots:';
langpack.trainDeleteMore2 = ')';
langpack.trainStatus = '';// trainStatus 1337 TROOPNAME trainStatus2 CITYNAME trainStatus3
langpack.trainStatus2 = 'are being trained at';
langpack.trainStatus3 = '';
langpack.trainDefStatus = 'building';// trainDefStatus 1337 TROOPNAME trainDefStatus3
langpack.trainDefStatus2 = '';
langpack.trainSuccessfully = 'Troops successfully recruited';
langpack.trainErrorCancel = 'cannot cancel now';
langpack.trainErrorCancelTrain = 'cannot cancel now';
langpack.trainSuccessfullyDelDefense = 'Successfully deleted';
langpack.trainSuccessfullyDel = 'Successfully canceled';
langpack.trainDeleteNow = 'canceling Trainings';
langpack.trainErrorDelete = 'Error while canceling Training - refresh and try again';
langpack.trainDeleteMoreTrain = 'Training canceled - try refresh if numbers seem wrong';
langpack.trainDeleteDefenseNote = 'cancel defense construction';
langpack.trainESToutput = 'between'; //trainTimeExpected trainESToutput TIME trainESToutput2 DATE trainESToutput3 DATE trainESToutput4
langpack.trainESToutput2 = 'and';
langpack.trainESToutput3 = 'between';
langpack.trainESToutput4 = 'and';
langpack.trainNoSlotsNote = 'Please enter an amount of slots';
langpack.trainWrongSlotsNote = 'wrong amount of slots';
langpack.trainDefAmountNote = 'you can train maximum'; // trainDefAmountNote MAXTROOPAMOUNT trainDefAmountNote2
langpack.trainDefAmountNote2 = 'troops ';
langpack.trainTroopAmountNote = 'you cannot train more troops than'; // trainTroopAmountNote MAXTROOPAMOUNT trainTroopAmountNote2
langpack.trainTroopAmountNote2 = '';
langpack.trainZeroTroopsNote = '0 is not enough ';
langpack.trainOwned = 'You have';
langpack.trainWallDefense = 'Wall defense';
langpack.trainFieldDefense = 'Field defense';
langpack.trainDoDefQueue = 'Queued';


// TAB - KNIGHTS
langpack.knightsHead = 'Assigning Knight Skill Points';
langpack.knightsSetPoints = ''; // knightsSetPoints POINTS knightsSetPoints2 KNIGHTROLE knightsSetPoints3
langpack.knightsSetPoints2 = 'Skill points will be assigned to';
langpack.knightsSetPoints3 = '';
langpack.knightsTotalCost = 'Total Cost';
langpack.knightsRole = 'Role';
langpack.knightsAssignskills = 'assign skills';
langpack.knightsAssignRoleNote = 'assign role';
langpack.knightsAssignLvlUp = 'increases the experience of the knight';
langpack.knightsAssignLoy = 'Reward this knight with gold to increase his Loyalty by 5%.';
langpack.knightsCost = 'Cost';
langpack.knightsLoy = 'Loyalty';
langpack.knightsAssignPoints = 'assign'; // knightsAssignPoints DEFAULT COMBAT knightsAssignPoints2
langpack.knightsAssignPoints2 = 'skill points';
langpack.knightsCombatBoost = 'Combat Boost 25% - Time left:';
langpack.knightsPoliticBoost = 'Politics  Boost 25% - Time left:';
langpack.knightsResBoost = 'Resourcefulness  Boost 25% - Time left:';
langpack.knightsIntBoost = 'Intelligence Boost 25% - Time left:';
langpack.knightsDissmissNote = 'Dismiss!';


// TAB - POP CONTROL
langpack.popControlHead = 'Population Control';
langpack.popControlPickCity = '<b>City:</b>';
langpack.popControlCycleGain = 'Pop. Gain per Cycle:';
langpack.popControlHeadRequirements = 'Prerequisite';
langpack.popControlHeadCityStatus = 'City Status';
langpack.popControlHeadCommands = 'Commands';
langpack.popControlCommandsDissmissMM = 'Dismiss';
langpack.popControlCommandsQueSupplyTrp = 'Queue';
langpack.popControlCommandsDelAllQue = 'Delete all queues';
langpack.popControlCommandsRunCycle = 'Start cycle';
langpack.popControlMaxIdlePop = 'Max. idle Pop.:';
langpack.popControlSlotsUsed = '# slots used:';
langpack.popControlOfBarracks = '# Barracks:';
langpack.popControlCurrentIdlePop = 'Current Idle Pop.:';
langpack.popControlSlotsFree = '# slots free:';
langpack.popControlOfCottages = '# Cottages:';
langpack.popControlHeadStatusLog = 'Status';
langpack.popControlLogAttemptDel = 'Attempt';
langpack.popControlLogAttemptDel2 = 'Queue(s) to release ...';
langpack.popControlLogFailDissmiss = 'Error: to Dismiss by';
langpack.popControlLogFailDissmiss2 = 'Troops';
langpack.popControlLogWaiting = 'Waiting ...';
langpack.popControlLogStartBuildPop = 'Start building the population. Current pop.:';
langpack.popControlLogNoQueDel = 'no queue for deletion available.';
langpack.popControlLogFailTrain = 'Error: could not';
langpack.popControlLogFailTrain2 = 'Train troops ...';
langpack.popControlLogTrain = 'Picture from:';
langpack.popControlLogTrain2 = 'Troops from ...';
langpack.popControlLogDel = 'Delete training from';
langpack.popControlLogDelFail = 'ERROR: when deleting a training';
langpack.popControlReqCurrentFood = 'Current Food';
langpack.popControlReqCurrentWood = 'Current Wood';
langpack.popControlReqCurrentStone = 'Current Stone';
langpack.popControlReqCurrentOre = 'Current Ore';
langpack.popControlReqCurrentMM = 'Current troops for dismissal';
langpack.popControlReqNeedFood = 'Food needed';
langpack.popControlReqNeedWood = 'Wood needed';
langpack.popControlReqNeedStone = 'Stone needed';
langpack.popControlReqNeedOre = 'Ore needed';
langpack.popControlReqNeedMM = 'Troops for training';

langpack.popControlButtonRunCycle = 'Pop. Collect';
langpack.popControlButtonDelAllQueues = 'Delete all queue(s)';
langpack.popControlButtonDelAllQueues1 = 'Delete';
langpack.popControlButtonDelAllQueues2 = 'Queue(s)';
langpack.popControlButtonQueueSupplyTrp = 'Train Troops';
langpack.popControlButtonQueueSupplyTrp1 = 'Train';
langpack.popControlButtonQueueSupplyTrp2 = 'Troops';
langpack.popControlButtonDissmissMM = 'Dismiss Troops';
langpack.popControlButtonDissmissMM1 = 'Dismiss:';
langpack.popControlButtonDissmissMM2 = 'Troops';

langpack.popControlruncycleBtn_help3 = "If the queue slots wont delete, refresh and tap the 'Delete All Queues' button.";
langpack.popControlruncycleBtn_help2 = "This button stay disabled until your city has the required amounts of resources and Militiamen";
langpack.popControlruncycleBtn_help1 = "This button is used to automate the entire process of repeatedly dismissing Militiamen then queueing Supply Troops, and then finally deleting all slotted builds.";
langpack.popControldeleteBtn_help1 = "This button is used to quickly delete all the Supply Troops ni queue, returning some population and resources.";
langpack.popControldeleteBtn_help2 = "This button is only enabled when 1 or more training queue slots are used.";
langpack.popControldeleteBtn_help3 = "If you have any problems with this button, refresh and try again.";
langpack.popControlqueueBtn_help2 = "This button will only be enabled when your city\'s population is at it\'s maximum idle value, all resources are available, and at least 1 training slot is open.";
langpack.popControlqueueBtn_help1 = "This button converts all idle population into Supply Troops.";
langpack.popControldismissBtn_help1 = "This button will dismiss the right amount of militiamen to bring your city to its maximum idle population.";
langpack.popControldismissBtn_help2 = "This button will be enabled when when your city\'s idle population is less than maximum and it has enough MM to dismiss to reach max. idle.";

langpack.popControlHeadHelpPop = 'Population Help';

langpack.popControlHelpPop = '<p>Best to turn off auto transport, reassign, and training when using this. If it gets stuck, refresh.\
		<p><b>POPULATION CONTROL</b> tab will help you convert excess militiamen \
		into massive amounts of idle population. Massive idle population is very useful \
		to have before a might tournament starts, or if you want to do a massive siege \
		build with a Merlins tutelage.</p>\
		<p>The <b>CITY REQUIREMENTS</b> area displays the amount of resources and Militiamen\
		required for a full cycle of building massive idle population. If any of these \
		requirements are below requirements their values will be shown in red.</p>\
		<p>The <b>CITY STATUS</b> area displays the maximum amount of population your cottages\
		provide, and the current amount of idle population in your city. This area also\
		shows the number of training queue slots total and in use.</p>\
		<p>The <b>COMMANDS</b> area displays the buttons that automate this process:</p><UL>';

langpack.popControlruncycleBtn_help0 = "RUN CYCLE BUTTON";
langpack.popControldeleteBtn_help0 = "DELETE QUEUE BUTTON";
langpack.popControlqueueBtn_help0 = "QUEUE SUPPLY TROOP BUTTON";
langpack.popControldismissBtn_help0 = "DISMISS MM BUTTON";

// TAB - WILD
langpack.wildTraps = 'Traps';
langpack.wildMerc = 'Mercenaries';
langpack.wildCost = 'cost';
langpack.wildDefense = 'Wilderness defense';
langpack.wildButtonSetWild = 'build defense';
langpack.wildQueStatusTraps = 'building'; // wildQueStatusTraps TRAPNAME wildQueStatusTraps2 CITYNAME wildQueStatusTraps3 WILDCOORD wildQueStatusTraps4
langpack.wildQueStatusTraps2 = 'traps for';
langpack.wildQueStatusTraps3 = '\'s Wilderness at';
langpack.wildQueStatusTraps4 = '... ';
langpack.wildQueStatusMerc = ''; // wildQueStatusMerc MERC-TYPE wildQueStatusMerc2 CITYNAME wildQueStatusMerc3 WILDCOORD wildQueStatusMerc4
langpack.wildQueStatusMerc2 = 'will be hired for';
langpack.wildQueStatusMerc3 = '\'s Wilderness at';
langpack.wildQueStatusMerc4 = ' .. ';
langpack.wildMercenariesSet = 'Mercenaries will be hired';
langpack.wildAbandonNote = 'Abandon this wilderness now!';

// TAB - AUTO TRAIN
langpack.autoTrainHead = 'Automatic Troop Training';
langpack.autoTrainHeadOptions = 'more settings';
langpack.autoTrainMode = 'mode';
langpack.autoTrainUnitType = 'Troop Type';
langpack.autoTrainDeleteAll = 'cancel all training';
langpack.autoTrainCalcWorkers = 'use Workers:';
langpack.autoTrainCalculate = 'calculate';
langpack.autoTrainDelete = 'Delete trainings automatically';
langpack.autoTrainWallBuildNote = 'maximum 5 units will be trained for automatic Wall Defense ';
langpack.autoTrainWorker = 'Worker';
langpack.autoTrainWallBuild = 'Wall Build';
langpack.autoTrainTournamentNote = 'Refresh and the Queue will be filled for the tournament';
langpack.autoTrainDeleteNow = 'Deleting right now:';
langpack.autoTrainErrorTryAgain  = 'Error please try again...';
langpack.autoTrainErrorDeleteNotPossible  = 'Cannot delete, please refresh';
langpack.autoTrainActionLogResError  = 'Need more Resources - you can train:';
langpack.autoTrainActionLogResError2  = 'of';
langpack.autoTrainActionLogResError3  = 'troops.';
langpack.autoTrainActionLogSlotError  = 'no free slot for training';
langpack.autoTrainActionLogPopResError  = 'Need more Population and/or Resources - you can train';
langpack.autoTrainActionLogPopResError2  = 'of';
langpack.autoTrainActionLogPopResError3  = 'troops.';
langpack.buttonAutoTrain = 'Autotrain';
langpack.autoTrainWallLog = 'Build:';
langpack.autoTrainWallLogTraps = 'Traps.';
langpack.autoTrainWallLogCaltrops = 'Caltrops.';
langpack.autoTrainWallLogSpikes = 'Spikes.';
langpack.autoTrainWallLogCrossbows = 'Crossbows.';
langpack.autoTrainWallLogTrebuchet = 'Trebuchet.';


// TAB - THRONE STUFF
langpack.throneStuffStats = 'Statistic';
langpack.throneStuffSalvage = 'Salvage';
langpack.throneStuffSalvageLastXItems = 'Delete last';
langpack.throneStuffSalvageLastXItems2 = 'Items';
langpack.throneStuffSalvageLastXItemsNote = '<sup><span class="boldRed">(Always! For collecting aetherstones)</span></sup>';
langpack.throneStuffRepair = 'Repair';
langpack.throneStuffUpgradeEnhance = 'Upgrade/Enhance';
langpack.throneStuffEquip = 'Equip';
langpack.throneStuffSalvageHead = 'Delete Throne Items';
langpack.throneStuffAutoSalvage = 'Auto Salvage';
langpack.throneStuffSalvageHistory = 'History';
langpack.throneStuffSalvageList  = 'Throne room Salvage list:';
langpack.throneStuffSalvageFaild  = 'Salvage Failed :(';
langpack.throneStuffSalvageKeep  = 'Save Item Effects';
langpack.throneStuffSalvageKeepFam  = 'Keep items of the type:';
langpack.throneStuffSalvageKeepFam2  = '';
langpack.throneStuffSalvageKeepEffects1  = 'at least, 1 of the last 3 effect';
langpack.throneStuffSalvageKeepEffects2  = 'at least, 1 os the last 2 effects';
langpack.throneStuffSalvageKeepEffects3  = 'at least, the last effect';
langpack.throneStuffSalvageKeepEffects4  = 'at least, the 2 last effects';
langpack.throneStuffSalvageKeepEffects5  = 'at least, the 3 last effects';
langpack.throneStuffSalvageKeepSel  = 'Save';
langpack.throneStuffSalvageKeepSel2  = 'or better';
langpack.throneStuffSalvageKeepNote  = 'Items that are equip, destroyed or got a higher quality than +0 will never delete!';
langpack.throneStuffSalvageStart  = 'Starting delete';
langpack.throneStuffSalvageStart2  = 'Items';
langpack.throneStuffSalvageKeepFirst = "Save first ";
langpack.throneStuffSalvageKeepFirst2 = "items ";

langpack.throneStuffSalvagePreviewHead = 'Delete Throne Items Preview';
langpack.throneStuffSalvagePreviewDeleteKeep = 'Delete and/or';
langpack.throneStuffSalvagePreviewDeleteKeep2 = 'Keep';
langpack.throneStuffSalvagePreviewDeleteKeepNote = 'Items which will not be deleted are marked with * and they will also have a reason in the last column.';
langpack.throneStuffSalvagePreviewKeepReasonELB = 'Equipped/Leveled/Broken';
langpack.throneStuffSalvagePreviewKeepReasonSaveFirst = 'Save the first';
langpack.throneStuffSalvagePreviewKeepReasonSaveFirst2 = 'items';
langpack.throneStuffSalvagePreviewKeepReasonItemScheduled = 'Item is scheduled for upgrading/enhancing';
langpack.throneStuffSalvagePreviewKeepReasonQualityReached = 'Quality reached';
langpack.throneStuffSalvagePreviewKeepReasonTypeMatching = 'Type matching';
langpack.throneStuffSalvagePreviewKeepReasonPercentEffect = 'for';
langpack.throneStuffSalvagePreviewKeepReasonPercentEffect2 = 'reached';

langpack.throneStuffRepairOK  = 'Repair';
langpack.throneStuffRepairOK2  = '- remaining:';
langpack.throneStuffRepairAlready  = 'You fix just one item wait';
langpack.throneStuffRepairAlready2  = 's +5';
langpack.throneStuffRepairError  = '<font color=red>Repair Error</font> for';
langpack.throneStuffRepairNoID  = 'no Repair ID found!';
langpack.throneStuffRepairAll  = 'Repair all broken Items';
langpack.throneStuffRepairAll2  = 'Do not Enable if you use Upgrade/Enhance function!';
langpack.throneStuffUERunningNotPossible = 'Impossible: Upgrade and Enhance function is enabled!';
langpack.throneStuffRequestError = 'Request Error for';
langpack.throneStuffNoItemToDelete = 'no Items to Delete! - wait';
langpack.throneStuffNoItemToDelete2 = 'Minutes...';
langpack.throneStuffNoItemToDelete5Min = 'no Items to Delete! -  waiting 5 Minutes...';

langpack.throneStuffEUHead  = 'Auto Upgrade/Enhance/Repair Function';
langpack.throneStuffEUQueueEnable  = 'Queue';
langpack.throneStuffEUQueueDisabled  = 'Auto Upgrade/Enhance/Repair is <span class="boldRed">OFF</span>.';
langpack.throneStuffEUQueueWaiting = 'Waiting for timer...';
langpack.throneStuffEUQueueHistory = 'History';
langpack.throneStuffEUQueueAdd = 'Add Upgrade Or Enhance to Queue';
langpack.throneStuffEUQueueThroneItems = 'Throne items:';
langpack.throneStuffEUQueueShowTries = 'Tries:';
langpack.throneStuffEUQueueShowTriesNone = 'Tries: --';
langpack.throneStuffEUQueueShowTriesGood = 'Good requests:';
langpack.throneStuffEUQueueShowTriesBad = 'Bad requests:';
langpack.throneStuffEUQueueNoItems = 'No items in queue!!';
langpack.throneStuffEUQueueNextItem = 'Starting Next Queue item...';
langpack.throneStuffEUQueueUpgradeLevel10 = 'You cannot upgrade higher than level 17!';
langpack.throneStuffEUQueueUpgradeQuality5 = 'You cannot enhance higher than quality 5 (=wondrous)!';
langpack.throneStuffEUQueueDo = 'trying to';
langpack.throneStuffEUQueueDo2 = '...';
langpack.throneStuffEUQueueNoAetherstone = 'Not enough aetherstone to enhance!!';
langpack.throneStuffEUQueueNoAetherstoneLog = 'Not enough aetherstone in City:';
langpack.throneStuffSpendGems = 'Upgrade accidentally spent gems!  Turning upgrader off!!';
langpack.throneStuffEUNotPossible = 'Impossible: Auto Repair is running...';
langpack.throneStuffERStatusFaild = 'Enhance failed :(';
langpack.throneStuffURStatusFaild = 'Upgrade failed :(';
langpack.throneStuffERStatusFaild2 = 'Item:';//
langpack.throneStuffERStatusFaild3 = 'Waiting for repair...';
langpack.throneStuffERessourceMailSubject = 'Enhance Ressource for:';
langpack.throneStuffURessourceMailSubject = 'Upgrade Ressource for:';
langpack.throneStuffRepairHead  = 'Auto Repair';

langpack.throneStuffItemCurrent = 'Current';//
langpack.throneStuffItemNext = 'Next';//
langpack.throneStuffRepairItem = 'Repairing on:';//
langpack.throneStuffRepairTimeLeft = 'Time left:';//
langpack.throneStuffEquipHead = 'Equip Throne Items';
langpack.throneStuffEquipPreset = 'Preset:';

langpack.throneStuffEquipNoItems = 'No';
langpack.throneStuffEquipNoItems2 = 'item equipped !!!';
langpack.throneStuffEquipNoItemsAvailable = 'No';
langpack.throneStuffEquipNoItemsAvailable2 = 'item Available.. :/';
langpack.throneStuffUpgradeEnhanceList = 'Successful Upgrade/Enhance list:';

langpack.throneStuffGoodReq = 'Good Req.';
langpack.throneStuffBadReq = 'Bad Req.';
langpack.throneStuffTries = 'Tries';
langpack.throneStuffId = 'ID';
langpack.throneStuffCost = 'Cost';
langpack.throneUnequipItem = 'Unequip';
langpack.throneStuffUpgrade = 'Upgrade';
langpack.throneStuffEnhance = 'Enhance';
langpack.throneStuffHeadStats = 'Throne Statistic';
langpack.throneStuffHeadUpgradeInfo = 'Upgrade Information';
langpack.throneStuffHeadQueue = 'Queue';
langpack.throneUseAehterstones = 'Aetherstones from Holy Place:';


//	┌───────────────────────────────────────────────────────────────────────────┐
//	│  QUICK - TAB TRANSLATION  - BEGIN					 │
//	└───────────────────────────────────────────────────────────────────────────┘


// TAB2 - APOTHECARY
langpack.apothecaryHead = 'Apothecary';
langpack.apothecaryHeadSettings = 'Apothecary - Settings';
langpack.apothecaryAutoHeal = 'Auto Heal';
langpack.apothecaryTroopType = 'Troop Type:';
langpack.apothecaryIncorrectInput = 'Invalid/Incorrect input!';
langpack.apothecaryIncompleteInput = 'Incomplete/Invalid Input!';
langpack.apothecaryKeepGold  = 'Keep Gold:';
langpack.apothecaryAutoHealArray  = 'Auto Heal Array';
langpack.apothecaryAutoHealEditArray  = 'Edit';
langpack.apothecaryEditNote  = 'Apothecary edit';
langpack.apothecaryDeleteNote  = 'Apothecary delete';
langpack.apothecaryHeadTroops  = 'Wounded Troops';


// TAB2 - THRONE
langpack.throneHead = 'Throne Settings';
langpack.throneHeadEquippedItems = 'Equipped Items';
langpack.throneHeadEquippedItems2 = 'Item(s)';
langpack.throneHeadEquippedItems3 = 'destroyed and ready for repair';
langpack.throneHeadItemList = 'Items';
langpack.throneShowAllEffect = 'show all effects';
langpack.throneRedEffects = 'mark these effects red:';
langpack.throneRepairItems = 'Destroyed Items';
langpack.throneAction = 'Action';
langpack.throneLevel = 'Level';
langpack.throneQuality = 'Quality';
langpack.throneRepair = 'Repair';
langpack.throneRepairTime = 'Repair Time';
langpack.throneRepairDone = 'Repair done<br>???????';
langpack.throneQualityUpgradeNote = 'Need:';
langpack.throneQualityUpgradeNote2 = 'Aetherstones';
langpack.throneInvertOrder = 'Invert order';

langpack.throneFamily = 'Family';
langpack.throneType = 'Type';
langpack.throneBonus = 'Bonus';
langpack.throneNoSlots = 'no free slot';
langpack.throneEquipItem = 'equip';
langpack.throneAutoDeleteOK = 'Auto deletion of:'; // throneAutoDeleteOK ITEMNAME throneAutoDeleteOK2
langpack.throneAutoDeleteOK2 = 'successful.';
langpack.throneAutoDeleteCanceled = 'Auto deletion canceled...';


// TAB2 - MOVEMENT
langpack.movementHead = 'Sending, Reassigning, Reinforcing';
langpack.movementReinforceFood = 'Reinforce + Food';
langpack.movementNextCity = 'Nearest City';
langpack.movementAttackETA = '<span class="boldRed"><u>Attack</u></span> <sup>ETA</sup>';
langpack.movementReinforceETA  = '<span class="boldGreen"><u>Reinforce</u></span> <sup>ETA</sup>';
langpack.movementAutoSelectKnights  = 'Auto select Knights';
langpack.movementSourceNote  = 'Select player or enter target coordinates.';
langpack.movementClearTroopsNote  = 'reset values';
langpack.movementAliianceMemberNote  = 'show Allies';
langpack.movementSaveAttackName  = 'Enter a name for this Attack.';
langpack.movementSaveAttackNamePopup  = 'Please enter a name ;)';
langpack.movementHeadSavedAttacks  = 'Saved Attacks';
langpack.movementHeadAutoAttack  = 'Auto Attack';
langpack.movementSelectErrorNoAlliance  = 'No Alliance';
langpack.movementMarchNotPossible  = 'March not possible.';
langpack.movementWrongTimeFormat  = 'bad time format.';
langpack.movementAutoAttackSend  = 'Attack on';//movementAutoAttackSend 123,456 movementAutoAttackSend2
langpack.movementAutoAttackSend2  = 'is sent!';
langpack.movementAutoAttackIn  = 'Attack in';
langpack.movementAutoAttackNotPossible  = 'IMPOSSIBLE';
langpack.movementAutoAttackDone  = 'Auto Attack done =)';
langpack.movementAutoAttackArrivalNote  = 'please enter the desired Arrival of your troops (only valid until midnight!)';
langpack.movementAutoAttackCoordNote  = 'It is the coordinate that was entered above as target.';
langpack.movementXMustBe  = 'X has to be between 0 and 749';
langpack.movementYMustBe  = 'Y has to be between 0 and 749';
langpack.movementErrorSelectKnight  = 'Error: Select a knight';
langpack.movementErrorNoTroops  = 'Error: Select troops';
langpack.movementErrorNoFreeSlots  = 'Error: your rally point allows a max of';//movementErrorNoFreeSlots SLOTNUMBER movementErrorNoFreeSlots2
langpack.movementErrorTryAgain  = 'Error, try again!.';
langpack.movementErrorNoFreeSlots2  = 'troops!';
langpack.movementReinforceOK  = 'Reinforcement on its way! Go, go, go!';
langpack.movementAttackOK  = 'Attack on its way!';
langpack.movementScoutOK  = 'Scouts are on their way!';
langpack.movementReassignOK  = 'Troops were reassigned!';
langpack.movementMarchOK  = 'Troops are marching.';
langpack.movementInWork  = 'processing...';
langpack.movementPlayerCheck  = 'Player Check';
langpack.movementPlayerCheckOn  = 'Player is online';
langpack.movementPlayerCheckOff  = 'Player is offline';
langpack.movementPlayerCheckSearch  = 'checking player details...';
langpack.movementCaptchaAlert  = 'Captcha Alert';
langpack.supplyCaptchaAlert  = 'Captcha Alert due to Supplier Tab';
langpack.transportCaptchaAlert  = 'Captcha due to Auto Transport';
langpack.darkForestCaptchaAlert  = 'Captcha due to Dark Forest Tab';
langpack.buildCaptchaAlert  = 'Captcha due to Auto Build';


// TAB2 - RESOURCE
langpack.ressourceAcceptHead = 'resources accepted';
langpack.buttonRessourceAccept = 'accept resources';
langpack.ressourceAcceptStop = 'stop accepting resources';
langpack.ressourceAcceptNow = 'Accepting resources of'; // ressourceAcceptNow NUMBER ressourceAcceptNow2
langpack.ressourceAcceptNow2 = 'players';
langpack.ressourceSearchFriends = 'checking friends list...';
langpack.ressourceSearchAlliance = 'Checking alliance...';
langpack.ressourceSearchNone = 'no player courts found :/';
langpack.ressourceCheckCourts = 'checking courts...';
langpack.ressourceCheckCourtsAlliace = 'checking alliance courts';
langpack.ressourceCheckCourtsFriends = 'checking friend courts';
langpack.ressourceNoneSelected = 'no players selected!';
langpack.ressourceHead = 'visit courts';


// TAB2 - SPAM
langpack.spamAllianceChat = 'Alliance Chat';
langpack.spamGlobalChat = 'Global Chat';
langpack.spamActionLogMessage = ' Min(s) are over! Message sent!';


// TAB2 - COMBAT
langpack.combatHead = 'Combat Calculator';
langpack.combatNote = 'not all simulations may be 100% correct';
langpack.combatResearchHead = 'Sanctuary Research';
langpack.combatMyResearch = 'My Research';
langpack.combatResultHead = 'Result of simulation';


// TAB2 - ALLIANCE
langpack.allianceHead = 'Alliance Overview';
langpack.allianceDipHelp = '<b>DIP</b> = Days in Position | <i></i>'; //Enter translation for <<Days in Position>> between <i> and </i>
langpack.allianceNoHostile = 'no hostile alliances found =)';
langpack.allianceNoFriendly = 'no friendly alliances found :/';
langpack.allianceSetFriendly = 'set friendly';
langpack.allianceFriendlySet = 'no alliance has set your alliance friendly :/';
langpack.allianceFriendly = 'no friendly Alliances :/';
langpack.allianceFriendlyToYourAlliance = 'Friendly towards you';
langpack.allianceNoAlly = 'No Alliance';
langpack.allianceNeutral = 'Neutral';
langpack.allianceFriendly = 'Friendly';
langpack.allianceHostile = 'Hostile';
langpack.allianceSearching = 'Searching Alliances';
langpack.allianceAlly = 'Ally';
langpack.alliancePopCardsHead= 'Throne effects';


// TAB2 INFO
langpack.infoHeadLinks = 'Useful Links';
langpack.infoHeadLabor = 'Alchemy Lab';
langpack.infoHeadTroopInfo = 'Troop Info';
langpack.infoHeadTroopCost = 'Cost';
langpack.infoHeadTroopStats = 'Stats';
langpack.infoHeadTroopFoodUsage = 'Usage';
langpack.infoHeadThroneCaps = 'Throne Caps';
langpack.infoThroneCapsTable = '<TABLE border=1>\
                    <TR><TD align=Left><b>Attribute</b></td>        <TD><b>Cap Value (+buff/-debuff)</b></td></tr>\
                    <TR><TD align=Left>Attack</td>                  <TD>+800&#37;/-25&#37;</td></tr>\
                    <TR><TD align=Left>Defense</td>                 <TD>+4000&#37;/-25&#37;</td></tr>\
                    <TR><TD align=Left>Life</td>                    <TD>+200&#37;/-50&#37;</td></tr>\
                    <TR><TD align=Left>Combat Speed</td>            <TD>+300&#37;/-50&#37;</td></tr>\
                    <TR><TD align=Left>Range</td>                   <TD>+150&#37;/-25&#37;</td></tr>\
                    <TR><TD align=Left>Load</td>                    <TD>+500&#37;/-0&#37;</td></tr>\
                    <TR><TD align=Left>Accuracy</td>                <TD>+1&#37;/-0.1&#37;</td></tr>\
                    <TR><TD align=Left>March Size</td>              <TD>+150&#37;</td></tr>\
                    <TR><TD align=Left>March Speed</td>             <TD>+500&#37;/-10&#37;</td></tr>\
                    <TR><TD align=Left>Troop Train Speed</td>       <TD>4000&#37;</td></tr>\
                    <TR><TD align=Left>Construction Speed</td>      <TD>600&#37;</td></tr>\
                    <TR><TD align=Left>Research Speed</td>          <TD>400&#37;</td></tr>\
                    <TR><TD align=Left>Crafting Speed</td>          <TD>200&#37;</td></tr>\
                    <TR><TD align=Left>Crafting Success</td>        <TD>25&#37;</td></tr>\
                    <TR><TD align=Left>Troop Upkeep Reduction</td>  <TD>33&#37;</td></tr>\
                    <TR><TD align=Left>Resource Production</td>     <TD>2000&#37;</td></tr>\
                    <TR><TD align=Left>Resource Cap</td>            <TD>200&#37;</td></tr>\
                    <TR><TD align=Left>Storehouse Protection</td>   <TD>1000&#37;</td></tr>\
                    <TR><TD align=Left>Morale</td>                  <TD>50&#37;</td></tr>\
                    <TR><TD align=Left>Item Drop</td>               <TD>20&#37;</td></tr></table>';
langpack.infoTrainTroopsHour = 'Training Troops';
langpack.infoTrainTroopsHour2 = 'per hour <u>per</u> city';
langpack.infoBuildDefHour = 'Build Def';
langpack.infoDistanceCalcStart = 'Start:';
langpack.infoDistanceCalcTarget = 'Target:';
langpack.infoDistanceCalcNote = 'Enter coordinates or select city';
langpack.infoDistanceCalcFrom = 'Distance: <u>from</u>'; //infoDistanceCalcFrom CITYSTART infoDistanceCalcTo TARGET
langpack.infoDistanceCalcTo = ' <u>to</u>';
langpack.infoDistanceCalcTroops = 'Calculate distance with'; //infoDistanceCalcTroops UNITNAME infoDistanceCalcTroops2
langpack.infoDistanceCalcTroops2 = '';
langpack.infoDistanceCalcETANote = '<i>estimated time of arrival</i> | '; //insert Translation after |
langpack.infoRangeCalcNote = 'Enter all numbers as positive';//
langpack.infoRangeCalcNote2 = 'negative numbers means you are out of range!';
langpack.infoRangeCalcMyRange = 'Your Range';
langpack.infoRangeCalcOpponent = 'Opponent';
langpack.infoRangeCalcRangeBuff = 'Range Buff:';
langpack.infoRangeCalcRangeDebuff = 'Range Debuff:';
langpack.infoRangeCalcSiegeBuff = 'Siege Buff:';
langpack.infoRangeCalcSiegeDebuff = 'Siege Debuff:';
langpack.infoRangeCalcRangedBuff = 'Ranged Buff:';
langpack.infoRangeCalcRangedDebuff = 'Ranged Debuff:';
langpack.infoRangeCalcSiegeRangeDifference = 'Siege Range Difference:';
langpack.infoRangeCalcRangedRangeDifference = 'Ranged Range Difference:';
langpack.infoCrestInventar = 'Crest Inventory';
langpack.infoForemanPoints = 'Foreman <sup>(Points)</sup>';
langpack.infoKnightsPoints = 'Knight <sup>(Points)</sup>';
langpack.infoBarracksLvlTotal = 'Baracks <sup>(Level)</sup>';
langpack.infoGeoLevel = 'Geometry  Level';
langpack.infoStableLevel = 'Stables Level';
langpack.infoWorkshopLevel = 'Workshop Level';
langpack.infoHeadTrainBuildTime = 'Training and Wall Stats';
langpack.infoHeadMap = 'Map';
langpack.infoTabCrest = 'Crest Overview';
langpack.infoTabTRTroopInfos = 'Extended Troop Info';
langpack.infoTabTRTroopInfosNote = 'This tab shows stats boosted with: <i>Research, Boosts, Knight, Guardian and Throne</i> <u>but not</u>: <b>Bonus to PvP</b>.';
langpack.infoTabTREffectInfos = 'Throne Room Effect Info';
langpack.infoTabTREffectInfosEffect = 'Effect';
langpack.infoTabTREffectInfosAppliesto = 'Applies to';
langpack.infoTabTREffectInfosSide = 'Side';
langpack.infoTabTREffectInfosYou = 'You';
langpack.infoTabTREffectInfosThem = 'Them';
langpack.infoTabTroopCalcActive 	= 'Active';
langpack.infoTabTroopCalcSetBonus 	= 'Set Bonus';
langpack.infoTabTroopCalcItemBoost 	= 'Item Boost';
langpack.infoTabTroopCalcGuardians 	= 'Guardians';
langpack.infoTabTroopCalcLevel = 'Level';
langpack.infoTabTroopCalcTroopsOnDef	= 'Troops on Defense (Wood Guardian)';
langpack.infoTabTroopCalc50atk	= '+50atk';
langpack.infoTabTroopCalc20def	= '+20def';
langpack.infoTabTroopCalc50def	= '+50def';
langpack.infoTabTroopCalcHealingPotions = 'Healing Potions (life)';
langpack.infoTabTroopCalcPoisonedEdge = 'Poisoned Edge (atk)';
langpack.infoTabTroopCalcMetalAlloys = 'Metal Alloys (def)';
langpack.infoTabTroopCalcAlloyHorseshoes = 'Alloy Horseshoes (spd)';
langpack.infoTabTroopCalcFletching  = 'Fletching (rng)';
langpack.infoTabTroopCalcThroneBuff  = 'Throne Buff';
langpack.infoTabTroopCalcThroneInfantryBuff = 'Throne Infantry Buff';
langpack.infoTabTroopCalcThroneRangedBuff = 'Throne Ranged Buff';
langpack.infoTabTroopCalcThroneSiegeBuff = 'Throne Siege Buff';
langpack.infoTabTroopCalcThroneHorsedBuff = 'Throne Horsed Buff';
langpack.infoTabTroopCalcThroneItemsCalc = 'Throne items included in calculations.';
langpack.infoTabTroopCalcThroneRPClip = 'Knight Combat Points:';
langpack.infoTabTroopCalcThroneRPClip2 = 'Knight skill buffs atk, def.';
langpack.infoHeadDistanceCalc = 'Distance Calculator';
langpack.infoHeadRangeCalc = 'Range Calculator';
langpack.infoHeadTroopCalc = 'Troop Calculator';
langpack.infoHeadTroopCalcConfig = 'Settings';
langpack.infoExternalLinksTable = '<table class=pdxTab align="center" width="700" border="0" cellspacing="0" cellpadding="0">\
		<tr><td width="57"><b>Nr.</b></td>\
			<td width="343"><b><center>Topic</center></b></td>\
			<td width="156"><b><center>Source</center></b></td></tr>\
		<tr><td><b># 1</b></td>\
			<td><center><a href="http://kocscripts.com" target="_blank">KoC Scripts - made with love...</a></center></td>\
			<td><center><a href="http://kocscripts.com" target="_blank">kocscripts.com</a></center></td></tr>\
		<tr><td><b># 2</b></td>\
			<td><center><a href="http://kocscripts.com/forum" target="_blank">KoC Scripts - Support Forum</a></center></td>\
			<td><center><a href="http://kocscripts.com" target="_blank">kocscripts.com</a></center></td></tr>\
		<tr><td><b># 3</b></td>\
			<td><center><a href="http://kocscripts.com/koc-scripts-review/" target="_blank">KoC Scripts - Review</a></center></td>\
			<td><center><a href="http://kocscripts.com" target="_blank">kocscripts.com</a></center></td></tr>\
		<tr><td><b># 4</b></td>\
			<td><center><a href="http://kocscripts.com/category/more/wilds/" target="_blank">Wild Attacks</a></center></td>\
			<td><center><a href="http://kocscripts.com" target="_blank">kocscripts.com</a></center></td></tr>\
		<tr><td><b># 5</b></td>\
			<td><center><a href="http://kocscripts.com/category/help-und-tutorials/tips-und-tricks/" target=_blank>Tips and Tricks</a></center></td>\
			<td><center><a href="http://kocscripts.com" target="_blank">kocscripts.com</a></center></td></tr>\
		<tr><td><b># 6</b></td>\
			<td><center><a href="http://kocscripts.com/category/more/wichtige-links/" target="_blank">more Important Links</a></center></td>\
			<td><center><a href="http://kocscripts.com" target="_blank">kocscripts.com</a></center></td></tr>\
		<tr><td><b># 7</b></td>\
			<td><center><a href="http://userscripts.org/users/PDX/scripts" target="_blank">Download KoC Scripts from Userscripts.org</a></center></td>\
			<td><center><a href="http://userscripts.org" target="_blank">userscripts.org</a></center></td></tr>\
		<tr><td><b># 8</b></td>\
			<td><center><a href="http://kocscripts.com/forum/bug-report/" target="_blank">report bugs at KoC Scripts</a></center></td>\
			<td><center><a href="http://kocscripts.com" target="_blank">kocscripts.com</a></center></td></tr>\
		<tr><td><b># 9</b></td>\
			<td><center><a href="http://kocscripts.com/category/kocscripts-news/verbesserung-und-kritik/" target="_blank">Request and suggestions</a></center></td>\
			<td><center><a href="http://kocscripts.com" target="_blank">kocscripts.com</a></center></td></tr>\
		<tr><td><b># 10</b></td>\
			<td><center><a href="http://kocscripts.com/koc-scripts-auf-facebook/" target="_blank">KoC Scripts - Facebook Groups</a></center></td>\
			<td><center><a href="http://kocscripts.com" target="_blank">kocscripts.com</a></center></td></tr>\
		<tr><td><b># 11</b></td>\
			<td><center><a href="http://kocscripts.com/4loot-com-kostenlose-fb-credits/" target="_blank">Free Gems (FB-Credits) at 4loot.com</a></center></td>\
			<td><center><a href="http://kocscripts.com" target="_blank">kocscripts.com</a></center></td></tr>\
		<tr><td><b># 12</b></td>\
			<td><center><a href="http://kocscripts.com/category/more/wappen/" target="_blank">Crest</a></center></td>\
			<td><center><a href="http://kocscripts.com" target="_blank">kocscripts.com</a></center></td></tr>\
		<tr><td><b># 13</b></td>\
			<td><center><a href="http://kocscripts.com/category/more/barbaren-lager/" target="_blank">Attacks and Barbarian Camps</a></center></td>\
		<td><center><a href="http://kocscripts.com" target="_blank">kocscripts.com</a></center></td></tr>\
		</table>';


// TAB2 ACTION LOG
langpack.logHead = 'KoC Power - LogBook';
langpack.logSelectAll = 'All Logs';
langpack.logSelectMoreError = 'more Errors';
langpack.logResetTimer = 'Reset done at'; // logResetTimer CITIES logResetTimer2
langpack.logResetTimer2 = '.';


// TAB2 DOMAIN
langpack.domainHead = 'Join Servers that are already closed';
langpack.domainLadyLord = 'Lord or Lady?:';
langpack.domainSelect = 'Domain:';
langpack.domainJoin = 'enter';
langpack.domainNameValue = 'your name';

// TAB2 TOURNAMENT
langpack.tournamntHeadStats = 'Tournament Statistics';
langpack.tournamntPlace = 'Place';
langpack.tournamntErrorLoading = 'Loading Error';
langpack.tournamntStart = 'Starts';
langpack.tournamntEnd = 'Ends';
langpack.tournamntRemain = 'Remaining';
langpack.tournamntTitleTrainTime = 'Training time';
langpack.tournamntTrainTime = 'Train. time';
langpack.tournamntDifference = 'difference';
langpack.tournamntPopInTrain = 'in training';
langpack.tournamenCheckHead = 'Tournament Check';
langpack.tournamentReward = 'Reward';
langpack.mainTournament = 'Tournament';


// TAB2 RESSOURCE PRODUCTION
langpack.ressourceProduction = 'Resource Production';


// TAB2 INVENTORY
langpack.inventoryItems = 'Inventory Items';
langpack.inventoryUseItemsALL = 'use';
langpack.inventoryUseItemsALL2 = 'use ALL:';
langpack.inventoryUseItems = 'use'; // inventoryUseItems ITEMNAME inventoryUseItems2
langpack.inventoryUseItems2 = 'now';
langpack.inventoryMight = 'Total Might From Inventory:';


// TAB2 CRAFTING
langpack.craftHead = 'Crafting Item in the Fey Spire';
langpack.craftHeadStats = 'Crafting Stats';
langpack.craftHeadSettings = 'Crafting Settings';
langpack.craftHeadPopup = 'Fey Spire - Crafting';
langpack.craftNote = 'Min. Aetherstones: 5000 - Inventory will be updated on refresh';
langpack.craftNow = 'in progress...';
langpack.craftFeyNotFound = 'no Fey Spire in city!';
langpack.craftButton = 'Crafting';
langpack.craftValue = 'Crafting...';
langpack.craftCTRL = 'Crafting';
langpack.craftCraft = 'Craft';
langpack.craftCraftOK = 'Craft OK';
langpack.craftFaild = 'Crafting Fail';


// TAB2 GIFTS
langpack.giftsHead = 'Auto Gifting';
langpack.giftsButtonSend = 'send Gift';
langpack.giftsResultOK = 'gift was send successfully!';
langpack.giftsResultONoAlliance = 'found no alliance :/';
langpack.giftsGifts = 'Gift:';
langpack.giftsTommorow = 'came back tomorrow please...';
langpack.giftsPossibleNote = 'You are limited to sending 22 Gifts each day!';
langpack.gifts22send = '22 Gifts were sent today!';
langpack.giftsDeleteReports = 'Delete Gift Reports';


// TABS2 ASCENSION
langpack.ascensionHead = 'Ascension Extension';
langpack.ascensionPercent = 'Percent';
langpack.ascensionMenu = 'Menu';
langpack.ascensionCurrentLevel = 'Current Level';
langpack.ascensionCurrentCost = 'Current Cost';
langpack.ascensionBuildingValues = 'Building Values';
langpack.ascensionAscend = 'Ascend';
langpack.ascensionNotAscended = 'Not Ascended';
langpack.ascensionComplete = 'C O M P L E T E &nbsp;&nbsp;&nbsp; (for now)';
langpack.ascensionNotComplete = 'C I T Y &nbsp;&nbsp;&nbsp; N O T  &nbsp;&nbsp;&nbsp; A S C E N D E D &nbsp;&nbsp;&nbsp; Y E T';
langpack.ascensionHeadHelpPop = 'KoC Power - Multilang: Ascension';

langpack.ascensionHelpPop = '<TABLE>\
		<TR><TD align=center>Building</td><TD align=center width=50>Lvl 1</td><TD align=center width=50>+1 Lvl</td></tr>\
       	<TR><TD>Castle</td><TD><CENTER>10</center></td><TD><CENTER>+8</center></td></tr>\
       	<TR><TD>Tavern</td><TD><CENTER>7</center></td><TD><CENTER>+6</center></td></tr>\
       	<TR><TD>Knights Hall</td><TD><CENTER>7</center></td><TD><CENTER>+6</center></td></tr>\
       	<TR><TD>Alchemy Lab</td><TD><CENTER>7</center></td><TD><CENTER>+6</center></td></tr>\
       	<TR><TD>Rally Point</td><TD><CENTER>7</center></td><TD><CENTER>+6</center></td></tr>\
       	<TR><TD>Wall</td><TD><CENTER>7</center></td><TD><CENTER>+6</center></td></tr>\
       	<TR><TD>DRUID Barracks (field)</td><TD><CENTER>7</center></td><TD><CENTER>+6</center></td></tr>\
       	<TR><TD>DRUID Apothecary (field)</td><TD><CENTER>6</center></td><TD><CENTER>+5</center></td></tr>\
       	<TR><TD>Embassy</td><TD><CENTER>6</center></td><TD><CENTER>+5</center></td></tr>\
       	<TR><TD>Market</td><TD><CENTER>6</center></td><TD><CENTER>+5</center></td></tr>\
       	<TR><TD>Watch Tower</td><TD><CENTER>6</center></td><TD><CENTER>+5</center></td></tr>\
       	<TR><TD>Spire</td><TD><CENTER>6</center></td><TD><CENTER>+5</center></td></tr>\
       	<TR><TD>Apothecary</td><TD><CENTER>6</center></td><TD><CENTER>+5</center></td></tr>\
       	<TR><TD>NORMAL Barracks</td><TD><CENTER>2</center></td><TD><CENTER>+2</center></td></tr>\
       	<TR><TD>Cottage</td><TD><CENTER>2</center></td><TD><CENTER>+2</center></td></tr>\
       </table><TABLE>\
       	<TR><TR><TD>These numbers are for every added level of a building. Whether you are building it to level 2 or level 10, it will only add this amount to the total, shown under this help button. Every buildings "might" value combines to give the total. Once it reaches 1200, you are at 100% and can level up again.</td></tr></tr>\
      </table>';


// TAB OVERVIEW
langpack.overviewPlaySince  = 'Playing since';
langpack.overviewMaxPop = 'Max. Pop.';
langpack.overviewSPop = 'Pop.';
langpack.overviewSProduce = 'Prod.';
langpack.overviewFoodLeft = 'Left';
langpack.overviewSTrain = 'Train';
langpack.overviewThrone = 'Throne';
langpack.overviewKnightsCheck = 'Knights / Slots';
langpack.overviewFoodProduce = 'Hourly Food Production';
langpack.overviewWoodProduce = 'Hourly Wood Production';
langpack.overviewStoneProduce = 'Hourly Stone Production';
langpack.overviewIronProduce = 'Hourly Ore Production';
langpack.overviewHospitalNote = 'Troop Regeneration';
langpack.overviewSeverStatsNote = 'Show Server Stats';
langpack.overviewAllianceSearchNote = 'goto Alliance Search';
langpack.overviewMightLeaderboardNote = 'Show Leader board';
langpack.overviewPlayerStatsNote = 'Show Player Stats';
langpack.overviewAllianceStatsNote = 'Show Alliance Stats';
langpack.overviewThroneMightNote = 'Throne Might';


// TAB2 OVERVIEW
langpack.overviewRessourceOverview = 'Resource Overview';


//	┌───────────────────────────────────────────────────────────────────────────┐
//	│  GLOBAL TRANSLATION - BEGIN						│
//	└───────────────────────────────────────────────────────────────────────────┘


langpack.mainGlobal = 'Global';
langpack.mainHide = 'Hide';
langpack.mainAlert = 'Alert';
langpack.mainCustom = 'Custom';
langpack.mainImportant = 'Important';
langpack.mainInfo = 'Info';
langpack.mainTotal  = 'Total';
langpack.mainHTotal  = 'TOTAL';
langpack.mainWorker = 'Worker';
langpack.mainMaxIdle = 'Max. Idle';
langpack.mainIdle = 'Idle';
langpack.mainLuck = 'Luck';
langpack.mainTax = 'Tax';
langpack.mainError = 'Error';
langpack.mainShow = 'Show';
langpack.mainHError = 'ERROR';
langpack.mainSRallyPoint = 'RP';
langpack.mainSDefense = 'Def';
langpack.mainHDef = 'DEF';
langpack.mainMarches = 'Marches';
langpack.mainSWild = 'Wild.';
langpack.mainCrafting = 'Crafting';
langpack.mainResearch = 'Research';
langpack.mainBuildTime = 'Build Time';
langpack.mainShowRoutes = 'Show Routes';
langpack.mainCastle = 'Sanctuary';
langpack.mainMight = 'Might';
langpack.mainOnline = 'Online';
langpack.mainOffline = 'Offline';

langpack.mainSmileys = 'Smileys';
langpack.mainLangpacks = 'Langpacks';
langpack.mainLangpackVersion = 'Langpack Version:';
langpack.mainSuccessfullyLoaded = "<span class='boldGreen'>successfully loaded</span> ";
langpack.mainSelect = 'Select';
langpack.mainClose = 'Close';
langpack.mainDelete = 'Delete';
langpack.mainDeleteAll = 'Delete All';
langpack.mainDeleteNow = 'Delete Now';
langpack.mainAlways = 'Always';
langpack.mainNever = 'Never';
langpack.mainAll = 'All';
langpack.mainNone = 'None';
langpack.mainGift = 'Gift';
langpack.mainAccept = 'Accept';
langpack.mainDate = 'Date';
langpack.mainFrom = 'From';
langpack.mainTo = 'to';
langpack.mainAnd = 'and';
langpack.mainArrival = 'Arrival';
langpack.mainOn = 'On'; // On Sunday....
langpack.mainPage = 'Page';
langpack.mainSubject = 'Subject';
langpack.mainNoSubject = 'no Subject';
langpack.mainHDone = 'DONE';
langpack.mainOK = 'OK';
langpack.mainStop = 'Stop';
langpack.mainPopulation = 'Population';
langpack.mainProvinces = 'Provinces';
langpack.mainIntervall = 'Interval';
langpack.mainSeconds = 'Seconds';
langpack.mainMinutes = 'Minutes';
langpack.mainHours = 'Hours';
langpack.mainSort = 'Sort';
langpack.mainName = 'Name';
langpack.mainGlory = 'Glory';
langpack.mainLastLogin = 'Last Login';
langpack.mainLogin = 'Login';
langpack.mainPosition = 'Position';
langpack.mainNeed = 'Need';
langpack.mainReset = 'Reset';

langpack.mainWilderness = 'Wilds';
langpack.mainTroops = 'Troops';
langpack.mainTroopAmount = 'Troop Amount';
langpack.mainRounds = 'Rounds';
langpack.mainRound = 'Round';
langpack.mainWall = 'Wall';
langpack.mainPlayer = 'Player';
langpack.mainMap = 'Map';
langpack.mainInFog = 'In Mist';
langpack.mainSlots = 'Slots';

langpack.mainDesertion = 'Desertion';
langpack.mainAttacking = 'Attacking';
langpack.mainReinforce = 'Reinforce';
langpack.mainReinforced = 'Reinforced';
langpack.mainReassign = 'Reassign';
langpack.mainTransport = 'Transport';
langpack.mainAttack = 'Attack';
langpack.mainAntiScout = 'Anti-Scout';
langpack.mainScout = 'Scout';
langpack.mainScouting = 'Scouting';
langpack.mainScoutAttack = 'Scout Attack';
langpack.mainWildAttack = 'Wild Attack';
langpack.mainAutoTransport = 'Auto transport';
langpack.mainRaidAttack = 'Raid Attack';
langpack.mainSupplyTransport = 'Supply Transport';
langpack.mainMarch = 'March';
langpack.mainReinforcement = 'Reinforcement';
langpack.mainCamped = 'Encamped';
langpack.mainReturn = 'Return';
langpack.mainCoordinate = 'Coordinate';
langpack.mainCoord = 'Coord';

langpack.mainTarget = 'Target';
langpack.mainTargets = 'Targets';
langpack.mainDistance = 'Distance';

langpack.mainSupply = 'Supply';
langpack.mainRaid = 'Raid';
langpack.mainKnights = 'Knights';
langpack.mainEmbassy = 'Embassy';
langpack.mainDiplo = 'Diplomacy';
langpack.mainDefense = 'Defense';
langpack.mainVersion = 'Version';
langpack.mainServer = 'Server';
langpack.mainRepeat = 'Repeat';
langpack.mainVolume = 'Volume';
langpack.mainItems = 'Items';
langpack.mainItem = 'Item';
langpack.mainInventory = 'Inventory';
langpack.mainAmount = 'Amount';
langpack.mainWild = 'Wild';
langpack.mainRank = 'Rank';

langpack.mainOfficer = 'Officer';
langpack.mainChancellor = 'Chancellor';
langpack.mainViceChancellor = 'Vice Chancellor';

langpack.mainURLmainURL = 'URL';
langpack.mainNormal = 'Normal';
langpack.mainWideScreen = 'Widescreen';
langpack.mainUltra = 'Ultra';
langpack.mainDefault = 'Default';
langpack.mainWithoutBosster = 'without Booster';
langpack.mainCanceled = 'Canceled';
langpack.mainCancel = 'Cancel';
langpack.mainRequirement = 'Requirement';
langpack.mainAction = 'Action';
langpack.mainRecall = 'Recall';
langpack.mainSendHome = 'Send Home';
langpack.mainStatus = 'Status';
langpack.mainURL = 'URL';
langpack.mainMember = 'Member';

langpack.mainTime = 'Time';
langpack.mainReports = 'Reports';
langpack.mainReport = 'Report';
langpack.mainMessage = 'Message';
langpack.mainSpam = 'Spam';
langpack.mainActivate = 'Activate';
langpack.mainDeActivate = 'Deactivate';
langpack.mainGeneral = 'General';
langpack.mainSpeedups = 'Speedups';
langpack.mainCombat = 'Combat';
langpack.mainRessources = 'Resources';
langpack.mainChest = 'Chest';
langpack.mainCourt = 'Court';
langpack.mainGifts = 'Gifts';
langpack.mainArticle = 'Article';
langpack.mainCategory = 'Category';
langpack.mainCharge = 'Charge';
langpack.mainRange = 'Range';
langpack.mainDebuff = 'Debuff';
langpack.mainCities = 'Cities';
langpack.mainAvatar = 'Avatar';
langpack.mainFacebook = 'Facebook';
langpack.mainCreate = 'Create';
langpack.mainProfile = 'Profile';
langpack.mainGuardian = 'Guardian';
langpack.mainDarkForest = 'Dark Forest';
langpack.mainType = 'Type';
langpack.mainNotAvailable = 'not available';
langpack.mainCity = 'City';
langpack.mainRallyPoint = 'Rally Point';
langpack.mainMillions = 'Millions';
langpack.mainBillions = 'Billion(s)';

langpack.mainFriends	= 'Friends';
langpack.mainUnknown	= 'Unknown';
langpack.mainInvalid	= 'Invalid';

langpack.mainAttacker	= 'Attacker';
langpack.mainDefender	= 'Defender';
langpack.mainGenerally	= 'Generally';
langpack.mainAutoFunc	= 'Automatic Functions';


// SHORTCUT WORDS
langpack.shortFood = 'Food';
langpack.shortLife = 'Life';
langpack.shortAttack = 'Atk';
langpack.shortSpeed =  'Spd';
langpack.shortETA = 'ETA';
langpack.shortDistance = 'Dist.';
langpack.shortNotAvailable = 'N/A';
langpack.shortDiplo = 'DIP'; // Days in Position
langpack.shortPos = 'Pos.'; // Position
langpack.shortMin = 'Min.'; // Minimum
langpack.shortMax = 'Max.'; // Maximum
langpack.shortCoordinate = 'Coord.';
langpack.shortLevel = 'Lvl';
langpack.shortDarkForest = 'DF';
langpack.shortHour = 'Std.';
langpack.shortSeconds = 's';
langpack.shortPage = 'S';
langpack.shortAction = 'A';
langpack.shortBillion = 'B';
langpack.shortMillion = 'M';


//	┌───────────────────────────────────────────────────────────────────────────┐
//	│  POPUP - TRANSLATION | HELP					            │
//	└───────────────────────────────────────────────────────────────────────────┘


langpack.crestHelp = '<center> The crest tab is for attacking one wild over and over again.<BR>\
	It will attack a wild in 2 waves, abandon it and start over.</BR>\
	For this to work you need <b>1 FREE WILD SLOT</b> in your castle.</BR>\
	Fill in the coordinates, troops and hit "ON".</center></BR>\
	<A target="_tab" href="http://koc.wikia.com/wiki/Wilderness">Wild Attacks on the KoC wiki</a>\
	<TABLE width=100%><TR><TD>Level</td><TD>Wave 1</td><TD>Wave 2</td><TD>Troop losses</td><TD>Fletching</td></tr>\
	<TR><TD>1</td><TD>n/a</td><TD>160 MM</td><TD>12 MM</td><TD>0</td></tr>\
	<TR><TD>1</td><TD>n/a</td><TD>80 Archers</td><TD><span class=boldGreen>keine</span></td><TD>1+</td></tr>\
	<TR><TD>2</td><TD>5 MM</td><TD>130 Archers</td><TD>1. Wave</td><TD>2+</td></tr>\
	<TR><TD>3</td><TD>10 MM</td><TD>520 Archers</td><TD>1. Wave</td><TD>3+</td></tr>\
	<TR><TD>4</td><TD>20 MM</td><TD>1600 Archers</td><TD>1. Wave</td><TD>4+</td></tr>\
	<TR><TD>5</td><TD>50 MM</td><TD>2200 Archers</td><TD>1. Wave</td><TD>6+</td></tr>\
	<TR><TD>6</td><TD>100 MM</td><TD>3000 Archers</td><TD>1. Wave</td><TD>7+</td></tr>\
	<TR><TD>7</td><TD>150 MM</td><TD>6000 Archers</td><TD>1. Wave</td><TD>8+</td></tr>\
	<TR><TD>8</td><TD>299 MM + 1Bal</td><TD>9000 Archers + 900 Bal</td><TD>1. Wave + 1 Archers</td><TD>9+</td></tr>\
	<TR><TD>9</td><TD>599 MM + 1Bal</td><TD>13000 Archers + 900 Bal</td><TD>1. Wave + 2 Archers</td><TD>10</td></tr>\
	<TR><TD>10</td><TD>1199 MM + 1 Cat</td><TD>35000 Archers + 2500 Cat</td><TD>1. Wave + 6 Archers + 50 Cat</td><TD>10</td></tr>\
	</table></br></br>';


//	┌───────────────────────────────────────────────────────────────────────────┐
//	│  HUD STUFF							        │
//	└───────────────────────────────────────────────────────────────────────────┘


langpack.ksSupportChat = 'Here you can join our KoC Scripts - Support Chat at our Camelot IRC (irc.god-like.org:6667)';
langpack.ksInstallLatestNote = 'Update KoC Power - Multilang';
langpack.KsRunningLanguage = 'You are Running the English Version of KoC Power - Multilang, change your Game Language to the same Language!';

langpack.KsInfoBoxHomePageNote = 'visit KoC Scripts now!';
langpack.KsInfoBoxTeamNote = 'KoC Scripts - Team';
langpack.KsInfoBoxDevGroupNote = 'you want to translate KoC Power - Multilang ?';
langpack.KsInfoBoxFacebookNote = 'check our Facebook Groups here';
langpack.KsInfoBoxGCNote = 'KoC Power - Multilang on Google Code';
langpack.KsInfoBoxUserscriptsNote = 'KoC Power - Multilang on Userscripts';
langpack.KsInfoBoxReportNote = 'upload Sound, Background or Report Bugs/Wishes';
langpack.KsInfoBoxReviewNote = 'Review KoC Power - Multilang at Userscripts! Thanks =)';
langpack.KsInfoBoxFirefoxNote = 'visit mozilla Firefox now!';
langpack.KsInfoBoxGreasemonkeyNote = 'visit Greasemonkey now!';
langpack.KsInfoBoxScriptishNote = 'visit Scriptish!';
langpack.KsInfoBoxJavaNote = 'check your Java Version!';
langpack.KsInfoBoxFlashNote = 'check your Adobe Flash Player Version!';
langpack.KsInfoBox4LootNote = 'get Free Facebook Credits, just Collect Coins, Invite Friends or Play Daily Quiz (100% Free (05/30/2012))';


//	┌───────────────────────────────────────────────────────────────────────────┐
//	│  CAMELOT TRANSLATION							│
//	└───────────────────────────────────────────────────────────────────────────┘


// - ITEMS
langpack.stoneofear = 'Ohrstone';
langpack.leinenfluegel = 'Flax Wing';
langpack.animale = 'Animal Hide';
langpack.blood = 'Blood Lust';
langpack.bloodstone = 'Bloodstone';
langpack.magnetstein = 'Lodestone';
langpack.tiferstone = 'Tiferstone';
langpack.keterstone = 'Keterstone';
langpack.stoneskin = 'Stoneskin';
langpack.guinevere = 'Guinevere\'s Favor';
langpack.parchmentScroll = 'Parchment';
// - CREST AND SEALS
langpack.SirBors = 'Sir Bors';
langpack.SirEctors = 'Sir Ectors';
langpack.SirKays = 'Sir Kays';
langpack.SirBediveres = 'Sir Bediveres';
langpack.SirGawains = 'Sir Gawains';
langpack.SirPercivals = 'Sir Percivals';
langpack.SirGalahads = 'Sir Galahads';
langpack.SirLancelots = 'Sir Lancelots';
langpack.Arthurs = 'Arthurs';
langpack.Morganas = 'Morganas';
langpack.Mordreds = 'Mordreds';
langpack.Stags = 'Stag Kings Seal';
langpack.Pendragons = 'Pendragon Seal';
langpack.LadyoftheLake = 'Lady of the Lake';
langpack.aetherseal = 'Aether Seal'; //Aetherseal
langpack.merlinsseal = 'Merlin Seal';
langpack.ysbaddenseal = 'Ysbadden Seal';
// - TROOPS
langpack.supplytroop = 'Supply Troops';
langpack.shrsupply = 'Supply';
langpack.militiaman = 'Militiaman';
langpack.shrmilitiaman = 'MM';
langpack.scout = 'Scout';
langpack.pikeman = 'Pikeman';
langpack.shrpikeman = 'Pikeman';
langpack.swordsman = 'Swordsman';
langpack.shrswordsman = 'Swordsman';
langpack.archer = 'Archer';
langpack.shrtarcher = 'Archer';
langpack.cavalry = 'Cavalry';
langpack.shrcavalry = 'Cav';
langpack.heavycavalry = 'Heavy Cavalry';
langpack.shrheavycavalry = 'H-Cav';
langpack.supplywagon = 'Supply Wagon';
langpack.shrsupplywagon = 'SW';
langpack.ballista = 'Ballista';
langpack.shrballista = 'Balls';
langpack.batteringram = 'Battering Ram';
langpack.shrbatteringram = 'Ram';
langpack.catapult = 'Catapult';
langpack.shrcatapult = 'Cat';
// - MAX 6 LETTER TROOP NAMES { postToChat Troop Names }
langpack.kocExtraShortSupplyTroop = 'ST';
langpack.kocExtraShortMilitiaman = 'MM';
langpack.kocExtraShortScout = 'Scout';
langpack.kocExtraShortPikeman = 'Pike';
langpack.kocExtraShortSwordsman = 'Sword';
langpack.kocExtraShortArcher = 'Archer';
langpack.kocExtraShortCavalry = 'Cav';
langpack.kocExtraShortHeavyCavalry = 'H-Cav';
langpack.kocExtraShortSupplyWagon = 'SW';
langpack.kocExtraShortBallista = 'Bal';
langpack.kocExtraShortBatteringram = 'Ram';
langpack.kocExtraShortCatapult = 'Cat';
// - WALL
langpack.crossbows = 'Crossbows';
langpack.trebuchet = 'Trebuchet';
langpack.caltr = 'Caltrops';
langpack.spiked = 'Spikes';
langpack.trap = 'Traps';
// - BUILDINGS
langpack.kocBlacksmith = 'Blacksmith';
langpack.kocBarracks = 'Barracks';
// - WILDS
langpack.kocBarbarianCamps	= 'Barbarian Camp';
langpack.kocShortBarbarian	= 'Barbs';
langpack.kocGrassland		= 'Grassland';
langpack.kocLake			= 'Lake';
langpack.kocForests			= 'Forest';
langpack.kocBog				= 'Bog';
langpack.kocHill			= 'Hill';
langpack.kocMount			= 'Mountain';
langpack.kocPlain			= 'Plain';
langpack.kocMistedCity		= 'Misted City';
langpack.kocRuin			= 'Ruin';
langpack.kocCity			= 'City';
langpack.kocWoods			= 'Woods';
langpack.kocDarkForest		= 'DarkForest';
langpack.kocMercenaries		= 'Merc Camp';

langpack.kocVeterans		= 'Veterans';
langpack.kocIntermediates	= 'Intermediates';
langpack.kocNovices			= 'Novices';
langpack.kocNoneHired		= 'None';
// - KNIGHTS
langpack.kocMarchall = 'Marshall';
langpack.kocAlchemystic = 'Alchemistic';
langpack.kocSteward = 'Steward';
langpack.kocForeman = 'Foreman';
langpack.kocResourcefulness = 'Resourcefulness';
langpack.kocPolitics = 'Politics';
langpack.kocCombat = 'Combat';
langpack.kocIntelligence = 'Intelligence';
langpack.kocShortPolitics = 'Pol';
langpack.kocShortCombat = 'Com';
langpack.kocShortIntelligence = 'Int';
langpack.kocShortRessource = 'Res';
// - DIPLO
langpack.kocNoAlliance = 'no Alliance';
langpack.kocNeutral = 'Neutral';
langpack.kocFriendly = 'Friendly';
langpack.kocHostile = 'Hostile';
langpack.kocAllys = 'Allies';


//	┌────────────────────────────────────────────┐
//	│  KOC POWER - FUNCTION			 │
//	└────────────────────────────────────────────┘


// MULTI DETECT PROBLEMS
langpack.multiErrorPopup = 'An Error occurred:';
// MULTI UPDATE CHAT COMMAND

var chatnote = 'Visit <a href="http://kocscripts.com" target="_blank" title="Visit now our Website">KoC Scripts</a>!</br>';
chatnote += 'Get updates at <a href="http://code.google.com/p/koc-power-pdx" target="_blank" title="The Developer Page for KoC Power - Multilang">the Google Code Project</a> ';
chatnote += 'We provide another page for <a href="http://code.google.com/p/koc-power-pdx/issues/entry" target="_blank" \
	title="Reporting Bugs? Have a wish? want to upload your own Sound?">Reporting Bugs, making Wishes or uploading Sound Files</a></BR>';
chatnote += 'or test the <a href="http://koc-power-pdx.googlecode.com/svn/beta/kocpower-multi-pdx.user.js" target="_blank" title="Install the Beta Version of KoC Power - Multilang">Beta Version</a>.</BR>';

langpack.multiUpdateChatNote = chatnote;

// KOC NOT LOADED
langpack.refreshTimer = 'Refresh Timer';
langpack.refreshIn = 'in';
langpack.refreshNowNote = 'reload KOC now';
langpack.refreshResetNote = 'reset refresh timer now';
langpack.refreshReload = 'refresh';
langpack.refreshActionLog = 'Auto Refresh:'; // refreshActionLog refreshActionLog2 1337 refreshActionLog3
langpack.refreshActionLog2 = '';
langpack.refreshActionLog3 = 'minutes expired, reloading game now! ';
langpack.refreshDFActionLog = 'Reloading the game now...';
// UPDATER
langpack.updateButtonNote = 'There is a new Version of KoC Power - Mutlilang available!';
// DELETE REPORTS
langpack.reportDelete = 'Reports of Page';
langpack.reportDelete2 = 'successfully deleted';
langpack.reportAutoDelete = 'Delete automatically:';
langpack.reportAutoDeleteNoNeed = 'Delete not necessary';
// PT SCOUT
langpack.scoutSendconfirm = 'Do you want to send Scouts?';
// KOC NOT FOUND
langpack.kocNotFound = 'KoC Power - Multilang Detected KofC is not active';
langpack.kocDialogRetry = 'Refresh in';
// LOW FOOD ALERT
langpack.foodPostLow = 'My Sanctuary';
langpack.foodPostLow2 = 'has';
langpack.foodPostLow3 = 'low food.. Left for: ';
langpack.foodPostLow4 = '- Production:';
// OTHER ERRORS
langpack.errorQuery = 'Query Error: Failed 5 Times, stopping now ...';
langpack.errorQueryError = 'Query Error:';
// EXPORT TO KOC ATTACK
langpack.exportAtkHead = 'export Barbs to KoC Attack';
langpack.exportAtkTargetType = 'Target Type';
langpack.exportAtkTargets = 'Targets';

langpack.exportAtkTrpSupply = 'Supply';
langpack.exportAtkTrpWagon = 'Wagon';
langpack.exportAtkTrpArcher = 'Archer';
langpack.exportAtkTrpCav = 'Cav';
langpack.exportAtkTrpHC = 'HC';
langpack.exportAtkTrpBal = 'Balista';
langpack.exportAtkTrpCat = 'Cat';

langpack.exportAtkTo = 'export to KoC Attack';
langpack.exportAtkNotPossible = 'KoC Attack not found, cannot export...';
langpack.exportAtkWrongInput = 'wrong input...';
langpack.exportAtkNoTroops = 'No troops defined'; //No troops defined
langpack.exportAtkMuchTroops = 'Too many Troops'; //To much Troops
langpack.exportAtkWrongFormat = 'wrong attack dialog format';
langpack.exportAtkNotPossibleToOpen = 'not possible to open attack window';


// CHAT STUFF
langpack.chatSayToAlliance = 'to the alliance';
langpack.chatAlliance = 'alliance:'; //
langpack.chatWhisperTo = 'whispers to';
langpack.chatWhisperToYou = 'Whispers';

// TOWER STUFF
langpack.towerMailSubject = 'shall';
langpack.towerSCOUT = 'SCOUT';
langpack.towerATTACK = 'ATTACK';
langpack.towerWILD = 'WILD';
langpack.towerWILDATTACK = 'WILD ATTACK';
langpack.towerCASTLE = 'SANCTUARY';
langpack.towerTYPE = 'TYPE:';
langpack.towerOn = 'on';
langpack.towerHQ = 'HQ:';
langpack.towerFlechting = 'Fletch.:';
langpack.towerTypeArrival = '** ARRIVAL ** :';
langpack.towerTypeCastle = '. / . / ** TROOPS HIDDEN **';
langpack.towerTypeDefense = '/ ** TROOPS DEFENDING **';
langpack.towerNoEmbassy = '/ no embassy';
langpack.towerMyEmbassy = '/ embassy slots';
langpack.towerTypeEmbassy = '/ ** EMBASSY **:';
langpack.towerTypeMyTroops = '/ ** TROOPS **:';
langpack.towerTypeTotal = '** TOTAL ** :';
langpack.towerTypeFood = '/ ** FOOD **:';
langpack.towerTypeWallDef = '/ ** WALL DEF **:';
langpack.towerEmbassySlot = 'Slot';
langpack.towerFoodLeft = '-> Left:';


//	┌────────────────────────────────────────────┐
//	│  KOC POWER - BUTTONS			│
//	└────────────────────────────────────────────┘


langpack.buttonAddMainTabLink2 = 'Quick';
langpack.buttonResetDF = 'DARK FOREST';
langpack.buttonResetOptions = 'RESET EVERYTHING';
langpack.buttonResetColors = 'COLORS';
langpack.buttonResetTabOrderPower = 'TAB ORDER (POWER)';
langpack.buttonHelp = 'HELP';
langpack.buttonON = 'ON';
langpack.buttonOFF = 'OFF';
langpack.buttonUpdate = 'UPDATE';
langpack.buttonPlaySound = 'PLAY';
langpack.buttonStopSound = 'STOP SOUND';
langpack.buttonDownload = 'Download';
langpack.buttonCraft = 'Craft';
langpack.buttonSendCrest = 'Send report now';
langpack.buttonShowDiplo = 'Show diplomacy';
langpack.buttonSave = 'Save';
langpack.buttonEdit = 'Edit';
langpack.buttonAdd = 'Add';
langpack.buttonMax = 'Max';


//	┌────────────────────────────────────────────┐
//	│  IMPORTANT | STUFF 				 │
//	└────────────────────────────────────────────┘


langpack.prefixSpam = 'INFO:';
langpack.getChatRules = /Respect the mods and each other and most importantly/i;

langpack.myregexp1 = /You are #/i;  // DO NOT CHANGE FIRST
langpack.myregexp2 = /\'s Kingdom does not need help\./i;  // DO NOT CHANGE FIRST
langpack.myregexp3 = /\'s project has already been completed\./i;  // DO NOT CHANGE FIRST
langpack.myregexp4 = /\'s project has received the maximum amount of help\./i;  // DO NOT CHANGE FIRST
langpack.myregexp5 = /You already helped with (.*?)\'s project\./i;
langpack.secondregexp1 = /Tu es l'aide/i;
langpack.secondregexp2 = /Le projet de /i;
langpack.secondregexp3 = /braucht keine Hilfe./i;
langpack.secondregexp4 = /hat schon die maximal/i;
langpack.getScoutError =  'Ne peux attaquer le marais';
langpack.getGiftDeleteButton = 'New Gift Received!';


//	┌────────────────────────────────────────────┐
//	│ !!! DO NOT CHANGE ANYTHING BELOW THIS LINE !!!  │
//	└────────────────────────────────────────────┘


langpack.tournamntOfMight = 'Tournament of Might';


// OLD STUFF
langpack.shrbtnchecked = '☑';
langpack.shrbtnnotchecked = '☐';
langpack.shrbtnnotfound = '?';
langpack.ResReqconfirm = 'RES BESTÄTIGUNG'; // DO NOT TRANSLATE OR CHANGE THIS!
langpack.ResReqconfirm2 = 'BESTÄTIGUNG';// DO NOT TRANSLATE OR CHANGE THIS!
langpack.ResReqconfirm3 = 'BESTÄTIGT';// DO NOT TRANSLATE OR CHANGE THIS!
langpack.possibleatk = 'MÖGLICHER ANGRIFF:';// DO NOT TRANSLATE OR CHANGE THIS!
langpack.chatstuff = '°°';// DO NOT TRANSLATE OR CHANGE THIS!
langpack.ResReqGetLangGer = 'Aktivität'; // DO NOT TRANSLATE THIS!

// GET MUTLI ALERTS IN CHAT
// - DE
langpack.towerSCOUTde = 'TYP: SPÄHER';
langpack.towerARRIVALEde = '** ANKUNFT ** :';
langpack.towerATTACKde = 'TYP: ANGRIFF';
langpack.towerWILDATTACKde = 'TYP: WILDNISS ANGRIFF';
langpack.towerWILDde = 'Ziel: WILDNISS';
langpack.foodPostLowde = 'zu wenig Nahrung sie reicht noch für';
// - EN
langpack.towerSCOUTen = 'TYPE: SCOUT';
langpack.towerARRIVALEen = '** ARRIVAL ** :';
langpack.towerATTACKen = 'embassy slots';
langpack.towerWILDATTACKen = 'TYPE: WILD ATTACK';
langpack.towerWILDen = 'Target: WILD';
langpack.foodPostLowen = 'low food.. Left for:';
// - ES
langpack.towerSCOUTes = 'TIPO: EXPLORACION';
langpack.towerARRIVALEes = '** LLEGADA ** :';
langpack.towerATTACKes = 'TIPO: ATTACK';
langpack.towerWILDATTACKes = 'TIPO: TIERRA ATAQUE';
langpack.towerWILDes = 'Tipo: TIERRA';
langpack.foodPostLowes = 'poco alimento.. Queda:';
// - FR
langpack.towerSCOUTfr = 'SORTE: Éclaireur';
langpack.towerARRIVALEfr = '** ARRIVER ** :';
langpack.towerATTACKfr = 'SORTE: ATTAQUE';
langpack.towerWILDATTACKfr = 'SORTE: ATTAQUE SAUVAGE';
langpack.towerWILDfr = 'Cible: SAUVAGE';
langpack.foodPostLowfr = 'Manque de nourriture.. Restant:';
// - TR
langpack.towerSCOUTtr = 'Tür: keşif eri';
langpack.towerARRIVALEtr = '** VARMA ** :';
langpack.towerATTACKtr = 'Tür: Saldırı';
langpack.towerWILDATTACKtr = 'Tür: Vahşi Saldırı';
langpack.towerWILDtr = 'Hedef: YABANI';
langpack.foodPostLowtr = 'Düşük gıda .. için sol';
// - PT
langpack.towerSCOUTpt = 'Tipo: Explorador';
langpack.towerARRIVALEpt = '** CHEGADA ** :';
langpack.towerATTACKpt = 'Tipo: ATAQUE';
langpack.towerWILDATTACKpt = 'Tipo: Selvagem ATAQUE';
langpack.towerWILDpt = 'Alvo: Selvagem';
langpack.foodPostLowpt = 'low food.. Left for:';
// - IT
langpack.towerSCOUTit = 'TIPO: ESPLORA';
langpack.towerARRIVALEit = '** ARRIVO ** :';
langpack.towerATTACKit = 'TIPO: ATTACCO';
langpack.towerWILDATTACKit = 'TIPO: ATTACCO Selvaggio';
langpack.towerWILDit = 'Bersaglio: Selvaggio';
langpack.foodPostLowit = 'Poco cibo.. Autonomia per:';
// - GR
langpack.towerSCOUTgr = 'ΤΥΠΟΣ: Πρόσκοπος';
langpack.towerARRIVALEgr = '** ΑΦΙΞΗ ** :';
langpack.towerATTACKgr = 'ΤΥΠΟΣ: ΕΠΙΘΕΣΗ';
langpack.towerWILDATTACKgr = 'ΤΥΠΟΣ: άγριος ΕΠΙΘΕΣΗ';
langpack.towerWILDgr = 'στόχος: άγριος';
langpack.foodPostLowgr = 'τροφή χαμηλή .. Αριστερά για:';


// OLD MUTLI AND OTHER SCRIPTS
// - OLD MULTI - GET ATTACK IN CHAT
langpack.towerGetAttackDE = 'Meine Botschaft hat';
langpack.towerGetAttackEN = 'My embassy has';
langpack.towerGetAttackES = 'Mi embajada tiene';
langpack.towerGetAttackFR = 'Mon ambassade à';
langpack.towerGetAttackGR = 'Η πρεσβεία μου έχει';
langpack.towerGetAttackIT = 'L\'ambasciata mia ha';
langpack.towerGetAttackPT = 'A minha embaixada tem';
langpack.towerGetAttackTR = 'Elciligim';
// - KOC ALLIANCE EXTRAS - GET ATTACK IN CHAT
langpack.embtroopsEN = 'troops in embassy';
langpack.embtroopsDE = 'Truppen in der Botschaft';
langpack.embtroopsFR = 'troupes dans mon ambassade';
langpack.embtroopsES = 'tropas en la embajada'; //troops in embassy
langpack.embtroopsGR = 'Στρατεύματα στην Πρεσβεία';
langpack.embtroopsIT = 'Truppe nella ambasciata';
langpack.embtroopsPT = 'tropas na embaixada';
langpack.embtroopsTR = 'elcilikte bulunan Birlikler';
// - OLD MULTI -  GET WILD ATTACK IN CHAT
langpack.towerGetWildPT = 'Wild em';
langpack.towerGetWildIT = 'terra selvaggia a';
langpack.towerGetWildGR = 'άγρια μέρος';
langpack.towerGetWildFR = 'Ma TS au';
langpack.towerGetWildES = 'Tierra en'; //Wild at
langpack.towerGetWildEN = 'Wild at';
langpack.towerGetWildDE = 'Wildniss bei';
langpack.towerGetWildTR = 'BozkIr koor';
// - OLD MULTI -  LOW FOOD IN CHAT
langpack.lowfoodrDE  = 'Nahrung sie reicht noch für';
langpack.lowfoodrEN  = 'is low on food';
langpack.lowfoodrES  = 'tiene poco alimento'; //is low on food
langpack.lowfoodrFR  = 'manque de nourriture';
langpack.lowfoodrGR  = 'αρκετή τροφή για ένα άλλο';
langpack.lowfoodrIT  = 'il cibo basta ancora per';
langpack.lowfoodrPT  = 'está com falta de comida';
langpack.lowfoodrTR  = 'yiyecegimin bitmesine kalan süre';


// BUTTLER
langpack.ksx_KoCButler_language				='English';

langpack.ksx_KoCButler_Toolbar_NewMessage		='New Message';
langpack.ksx_KoCButler_Toolbar_MyReports		='My Reports';
langpack.ksx_KoCButler_Toolbar_AllianceReports		='Alliance Reports';
langpack.ksx_KoCButler_Toolbar_Reinforce		='Reinforce';
langpack.ksx_KoCButler_Toolbar_Reassign			='Reassign';
langpack.ksx_KoCButler_Toolbar_Transport		='Transport';
langpack.ksx_KoCButler_Toolbar_RepeatMarchAsk		='Repeat...';

langpack.ksx_KoCButler_PowerToolbar_autoTransport	= 'Transport';
langpack.ksx_KoCButler_PowerToolbar_autoReassign	= 'Reassign';
langpack.ksx_KoCButler_PowerToolbar_autoCrest		= 'Crest';
langpack.ksx_KoCButler_PowerToolbar_autoTrain		= 'Autotrain';
langpack.ksx_KoCButler_PowerToolbar_autoRaidReset	= 'Raid reset';
langpack.ksx_KoCButler_PowerToolbar_autoRefresh		= 'Auto refresh';
langpack.ksx_KoCButler_PowerToolbar_autoBuild		= 'Auto build';
langpack.ksx_KoCButler_PowerToolbar_buildMode		= 'Mark buildings';
langpack.ksx_KoCButler_PowerToolbar_buildAskHelp	= 'Ask for help';

langpack.ksx_KoCButler_ResourceRequest_gold  		= 'gold';
langpack.ksx_KoCButler_ResourceRequest_food			= 'food';
langpack.ksx_KoCButler_ResourceRequest_wood			= 'wood';
langpack.ksx_KoCButler_ResourceRequest_stone 		= 'stone';
langpack.ksx_KoCButler_ResourceRequest_ore   		= 'ore';
langpack.ksx_KoCButler_ResourceRequest_astone 		= 'aetherstone';

langpack.ksx_KoCButler_ResourceRequest_UICaption             = 'RESOURCE-REQUEST';
langpack.ksx_KoCButler_ResourceRequest_UIDestination         = 'Destination';
langpack.ksx_KoCButler_ResourceRequest_UIAmount              = 'Amount';
langpack.ksx_KoCButler_ResourceRequest_UISendRequest         = 'Send Request';
langpack.ksx_KoCButler_ResourceRequest_ButtonTitle           = 'Resource Request';
langpack.ksx_KoCButler_ResourceRequest_AckButtonTitle        = "Acknowledge";
langpack.ksx_KoCButler_ResourceRequest_ExpressDlyButtonTitle = "Express Delivery";
langpack.ksx_KoCButler_ResourceRequest_DlyButtonTitle        = "Delivery";

langpack.PredefinedTransports = 'predefined transports';
langpack.Training             = 'Training';
langpack.LastUsed             = 'Last used';
langpack.CalculateTroops      = 'Calculate troops';


//	┌───────────────────────────────────────────────────────────────────────────┐
//	│  NEW STUFF TO SORT							  │
//	└───────────────────────────────────────────────────────────────────────────┘


langpack.bloodthorn              = 'Bloodthorn';
langpack.shrbloodthorn           = 'Bldthrn';
langpack.kocExtraShortBloodthorn = 'BldTh';
langpack.mainFailedAttempt       = 'Attempt failed';
langpack.mainSuccessfulAttempt   = 'Attempt successful';
langpack.mainFatalAjaxError      = 'Fatal Ajax Error';
langpack.mainCityDruid           = 'Druid City';
langpack.mainCityFey             = 'Fey City';
langpack.mainCityBriton          = 'Briton City';
langpack.mainWrongThroneSet      = 'Wrong throne-Set - No training';
langpack.mainTrainOnlyThroneSet  = 'Train troops only with throne-set ';
langpack.mainChangeThroneSet     = 'Change throne-Set '; // mainChangeThroneSet [Checkbox] mainToThroneSet [Number] mainWhenAttacked
langpack.mainToThroneSet         = 'to'; // mainChangeThroneSet [Checkbox] mainToThroneSet [Number] mainWhenAttacked
langpack.mainWhenAttacked        = 'on incoming Attack'; // mainChangeThroneSet [Checkbox] mainToThroneSet [Number] mainWhenAttacked
langpack.mainResetThrone         = 'set Throne back'; // mainResetThrone [checkbox] mainToThroneSet [Number] mainIf [Minutes]  mainMinutesNoAttack
langpack.mainIf                  = 'if no Attack within'; // mainResetThrone [checkbox] mainToThroneSet [Number] mainIf [Minutes]  mainMinutesNoAttack
langpack.mainMinutesNoAttack     = 'minutes'; // mainResetThrone [checkbox] mainToThroneSet [Number] mainIf [Minutes]  mainMinutesNoAttack
langpack.mainEnd                 = 'End';
langpack.pbHelpRequestOff       = 'do not ask for help';
langpack.pbHelpRequestChat      = 'chat only';
langpack.pbHelpRequestChatFB    = 'Chat and FB (always)';
langpack.pbHelpRequestChatFB10  = 'Chat and FB (at least 10 Min.)';
langpack.pbHelpRequestChatFB20  = 'Chat and FB (at least 20 Min.)';
langpack.pbHelpRequestChatFB30  = 'Chat and FB (at least 30 Min.)';
langpack.pbHelpRequestChatFB60  = 'Chat and FB (at least 60 Min.)';
langpack.reportScannerStartOn   = 'Auto = ON';
langpack.reportScannerStartOff  = 'Auto = OFF';
langpack.reportScannerChatMsg   = 'Report on page {page} Type: {type} / time: {time} / {attacker} / {member} might need help / Report: {report}';

langpack.mainApo                = 'Apothecary';
langpack.mainApoOK              = '{num} {unit} are being revived in {city}';
langpack.mainApoError           = 'Error on reviving: {num} {unit} in {city} / <span style="color:red;">{error}</span>';
langpack.mainApoFatalError      = 'Fatal Ajax Error';

var MONTH_NAMES = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
var DAY_NAMES = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
var DEC_POINT = '.';
var THOUSANDS_SEP = ',';
var DATETIME_STR = 'M j, h:i a';

langpack.delPromoButtons        = 'Remove advertising buttons';
langpack.tabLabelAlliance		= 'Alliance';
langpack.tabLabelTournament 	= 'Tournament';

langpack.deleteMarch			= 'Frozen March successfully deleted in {city}';
langpack.freeingKnight			= 'Blocked Knight {name} in {city} is free';

langpack.merlinClose			= 'Close Merlins Boxes on startup';
langpack.giftsfreeSlot			= 'recipients left for today!';
langpack.giftsNotOK				= '<i>no player selected...</i>';

langpack.giftscounter			= '<b>{counter}</b> player selected.';

langpack.ascDruid				= 'Druid - ';
langpack.ascFey					= 'Fey - ';
langpack.ascBriton				= 'Briton - ';

langpack.infoTroopHint			= 'Red values contain <b>Research</b> and <b>Throne</b> buffs only (Debuffs, guardian, Items, and knight effects are not included) !';
langpack.tmax					= 'Max';
langpack.treal					= 'Real';
langpack.tmight					= 'Might';

langpack.infoTroopHint2			= 'Blue values have reached Kabam\'s cap value';
langpack.shrexec				= 'Exec';
langpack.executioner			= 'Executioner';

langpack.throneStuffSalvageP1   = 'Upgrade to +1 before deleting (for more Aetherstone and a raises activity bonus)';
langpack.throneStuffSalvageCM   = 'put recovered aetherstone in the city with the least';
langpack.throneStuffCityMax     = 'use city with the most aetherstone';
langpack.throneStuffItemUse     = 'use:';
langpack.throneStuffRepairAll   = 'repair all items before enhancing/upgrading';
langpack.crestmsgOK				= 'Attack from {city} in {koords} - wave: {wave}';
langpack.crestmsgError  		= 'Error at bei attack from {city} on {koords} - wave: {wave} / {error}';
langpack.crestmsgCodeError  	= 'Code error at attack from {city} on {koords} - wave: {wave}';
langpack.crestmsgFatalError  	= 'Serious error at attack from {city} on {koords} - wave: {wave}';

langpack.shrswall				= 'SWall';
langpack.siegewall				= 'Siege Wall';

langpack.mainCraftOnlyThroneSet = 'craft only with TR preset';
langpack.mainCraftSimpleItems   = 'craft simple items with any TR preset';
langpack.craftStats				= 'statistics';
langpack.falseThroneSet			= 'wrong throne-set!';
langpack.viewCraftStats			= 'crafting statistics';
langpack.craftStatsSuccess		= 'successful';
langpack.craftStatsFail			= 'failure';
langpack.craftStatsError		= 'error';
langpack.craftStatsSuccessrate	= 'success rate';
langpack.craftStatsDelete		= 'delete statistics';

langpack.throneStuffEUQueueUpgradeLevel12 = 'Maximum upgrade level is +17';
langpack.throneStuffEUQueueUpgradeQuality5 = 'Maximum enhance level is Wondrous';
langpack.throneChance			= 'Chances of success';
langpack.viewThroneStats		= 'Current throne room success rate';
langpack.viewThroneStatsAdd		= 'success boosts';
langpack.viewThroneStatsUpgrade	= 'Chances for upgrading';
langpack.viewThroneStatsEnhance = 'chances for enhancing';
langpack.viewThroneStatsCalc    = 'recalculate';
langpack.viewThroneStatsHint	= '<b>Hint:</b> The values displayed here are calculated by the same formula as the success bar in the game showing the effects of lucky tokens etc. Note: the display is non-proportional.';

langpack.mainAudio				= 'Audio';

langpack.send2wave				= 'Send 2nd Wave only once (check to attack a list of different targets)';

langpack.shrflarcher			= 'FlA';
langpack.flamearcher			= 'Flame Archer';

// TAB - DARK FOREST OLD
langpack.OldmainDarkForestLabel = 'DF old';
langpack.OlddfFound				= 'Found:';
langpack.OlddfCancelByUser		= 'Canceled by User';
langpack.OlddfReportFoodGainTotal = 'Food Gain Total:';
langpack.OlddfReportHead		= 'Dark Forest - Overview';
langpack.OlddfReportStatsHead	= 'Dark Forest Stats: (Sent/Total)';
langpack.OlddfReportFoodStart	= 'Begin:'; // dfReportFoodStart 10 dfReportFoodStart2 50 dfReportFoodStart 60
langpack.OlddfReportFoodStart2	= 'After:';
langpack.OlddfReportFoodStart3	= 'Gain:';
langpack.OlddfReportFoodGain	= 'Food gain (after'; // dfReportFoodGain 24 dfReportFoodGain2
langpack.OlddfReportFoodGain2	= 'hour(s) attacking DF)';
langpack.OlddfReportTotalSend	= 'Total Sent';
langpack.OlddfReportMoreError	= 'More error';
langpack.OlddfReportBogError	= 'Bog error';
langpack.OlddfReportKnightsError = 'Knight error';
langpack.OlddfReportRPError		= 'Rally point error';
langpack.OlddfReportConnectionError = 'Connection error';
langpack.OlddfReportShortConnectionError = 'cnct error';
langpack.OlddfReportShortRPError = 'RP error';
langpack.OlddfBarbsDone			= 'Sent:';
langpack.OlddfTries				= 'tries';
langpack.OlddfFailed			= 'failed';
langpack.OlddfDiffLevel			= 'Level difference at'; // dfDiffLevel CITYKOORDS dfDiffLevel2 LVL dfDiffLevel3 LVL
langpack.OlddfDiffLevel2		= '- Level:';
langpack.OlddfDiffLevel3		= 'Should Level:';
langpack.OlddfBogFound			= 'Bog found at'; // dfBogFound BOGCOORD dfBogFound2
langpack.OlddfBogFound2			= '.';
langpack.OlddfShort				= 'DF\'s';
langpack.OlddfLogNoTroops		= 'Not enough troops for level:'; // dfLogNoTroops LVL dfLogNoTroops2
langpack.OlddfLogNoTroops2		= 'available!';
langpack.OlddfNoData			= 'no date';
langpack.OlddfTroopSelectHead	= 'Troop size for DF';
langpack.OlddfTroopSelectMaxDist = 'Max. distance';
langpack.OlddfTroopSelectMinDist = 'Min. distance';
langpack.OlddfTroopSelectLvl	= 'Lvl';
langpack.OlddfListPopupHead		= 'Dark Forests for:';
langpack.OlddfNoFreeSlots		= 'No free slot available';
langpack.OlddfNoKnights			= 'No knight available';
langpack.OlddfMaxSearchDistance = 'Maximum Search distance';
langpack.OlddfRallyClip = ''; // dfRallyClip SLOTAMOUNT dfRallyClip2
langpack.OlddfRallyClip2 = 'keep Rally Point Slots free';
langpack.OlddfMethode = 'Method';
langpack.OlddfKnightSelector = 'Selected Knight';
langpack.OlddfResetValues = 'Error Messages';
langpack.OlddfUpdateIntervall = 'Reset after';
langpack.OlddfPopupHead = 'Dark Forest for Server:';
langpack.OlddfPopupHeadReset = 'Dark Forest return';
langpack.OlddfSkip = 'Skip City after';// dfSkip 1337 dfSkip2
langpack.OlddfSkip2 = 'tries';
langpack.OlddfSelectMethodeHighLevel = 'high levels';
langpack.OlddfSelectMethodeLowLevel = 'low levels';
langpack.OlddfSelectKnightLow = 'with the most points';
langpack.OlddfSelectKnightHigh = 'with the lowest points';
langpack.OlddfSelectTroops = 'Select Troops';
langpack.OlddfHead = 'Automatically attacking Dark Forests';
langpack.OlddfStatusHead = 'Dark Forest Attack Status und Statistics';
langpack.OlddfSettingsHead = 'Sanctuary Settings';
langpack.OldmainDarkForest = 'Dark Forrest';
langpack.OldbuttonOFF = 'OFF';
langpack.OldbuttonON = 'ON';
langpack.OldtabLabelOptions = 'Settings';
langpack.OldshortLevel = 'Lvl.';
langpack.OlddfSelectKnightLowCom 		= 'lowest Combat points';
langpack.OlddfSelectKnightHighCom 		= 'highest Combat points';
langpack.OlddfSelectKnightLowPol 		= 'lowest politics points';
langpack.OlddfSelectKnightHighPol 		= 'highest politics points';
langpack.OlddfSelectKnightLowInt 		= 'lowest intelligence points';
langpack.OlddfSelectKnightHighInt 		= 'highest intelligence points';
langpack.OlddfSelectKnightLowRes 		= 'lowest resourcefulness points';
langpack.OlddfSelectKnightHighRes 		= 'highest resourcefulness points';
langpack.OlddfSelectKnightLowSum 		= 'lowest points overall';
langpack.OlddfSelectKnightHighSum 		= 'highest points overall';
langpack.OlddfSkip 									= 'pause DF after';
langpack.OlddfSkip2 									= 'failed searches';

langpack.knightsRole11 = 'assign as Steward';
langpack.knightsRole12 = 'assign as Foreman';
langpack.knightsRole13 = 'assign as Marshal';
langpack.knightsRole14 = 'assign as Alchemist';
langpack.knightsRole11s = '[St]';
langpack.knightsRole12s = '[Fo]';
langpack.knightsRole13s = '[Ma]';
langpack.knightsRole14s = '[Al]';
langpack.knightsRoleNo = 'un-assign role';
langpack.knightsDelete = 'dismiss this knight';

langpack.mainWildAttack = 'Wild Attack';
langpack.wildSettingsNote = 'Radius (20-45) searching every 60 mins';
langpack.wildSettingsTypes = 'Which Wilds?';
langpack.wildSettingsHead = 'City Settings';
langpack.wildSelectTroopsHead1 = 'Amt. Troops in 1st wave';
langpack.wildSelectTroopsHead2 = 'Amt. Troops in 2nd wave';
langpack.wildHead = 'Attacking wilds automatically';
langpack.wildHeadTroopsNote = 'To fill a wave with a troop type enter MAX';
langpack.wildRetrySearch = 'Repeat';
langpack.wildLastSearch = 'Last search';
langpack.wildLastSearch2 = ' - found:';
langpack.wildLastSearch3 = 'Wilds';
langpack.wildTroopSelectLvl = 'Lvl.:';
langpack.wildTroopSelectDist = 'Distance.:';
langpack.wildPopupHead = 'Wilds found';
langpack.wildmaxinfo = 'display limit of 50 wilds per city';
langpack.wildAttackErr1 = 'No coordinates left in <b>{city}</b>. Waiting for next search';
langpack.wildAttackErr2 = 'Attacks from <b>{city}</b> will capture wilds. You have free wild slots in that city.';
langpack.wildAttackErr3 = 'Not enough troops in <b>{city}</b> to attack Lvl <b>{level}</b> (1st wave)';
langpack.wildAttackErr4 = 'Not enough troops in <b>{city}</b> to attack Lvl <b>{level}</b> (2nd wave)';
langpack.wildAttackErr5 = 'No troops entered to attack Lvl <b>{level}</b> (1st wave)';
langpack.wildAttackErr6 = 'No troops entered to attack Lvl <b>{level}</b> (2nd wave)';
langpack.wildAttackErr7 = 'to few slots in rally point of <b>{city}</b>, 2 free slots needed.';

langpack.wildRadius = 'Searching radius (20 - 45): ';
langpack.wildInterval = 'Search again in (20 - 240) minutes: ';

langpack.wildattackStats = 'Num. wilds City can attack ';
langpack.DFattackStats = 'Num Dark Forests City can attack ';
langpack.DFAttackErr1 = 'Coordinate list in <b>{city}</b> is empty. Waiting for next search.';
langpack.DFAttackErr2 = 'Not enough troops in <b>{city}</b> to attack Lvl<b>{level}</b>';
langpack.DFAttackErr3 = 'No troops entered to attack Lvl <b>{level}</b>';
langpack.DFAttackErr4 = 'No free slot in rally point of <b>{city}</b>';
langpack.marchLog = 'March Log';
langpack.marchLogSend = '(<span class="boldGreen">{type}</span>) Sending march from <b>{city}</b> to <b>{target}</b>. Troops: {troops}';
langpack.marchLogErr1 = '(<span class="boldRed">{type}</span>) No free knight in <b>{city}</b>';
langpack.marchLogErr2 = '(<span class="boldRed">{type}</span>) Not enough troops in <b>{city}</b>';
langpack.marchLogErr3 = '(<span class="boldRed">{type}</span>) Tried to send a march with no troops assigned <b>{city}</b>';
langpack.marchLogErr4 = '(<span class="boldRed">{type}</span>) Tried to send a march from <b>{city}</b> with more troops than RP currently allows.';
langpack.marchLogErr5 = '(<span class="boldRed">{type}</span>) ERror while sending out march from <b>{city}</b>. <span class="boldRed"><i>{error}</i></span>';
langpack.marchLogErr6 = '(<span class="boldRed">{type}</span>) You got CAPTCHA. Wait 5 Minutes until you send a new march.';

langpack.TreasureChest = 'Merlin Chest';
langpack.TreasureChestFound = 'Found a Merlin Chest.';
langpack.TreasureChestNoFB = 'Unable to post Merlin Chest on Facebook.';
langpack.TreasureChestFB = 'Merlin Chest posted to Facebook';
langpack.TreasureChestErr1 = 'Merlin Chest Error.';
langpack.TreasureChestErr2 = 'Merlin Chest capital error.';

langpack.MapSearchActive = 'The tab <b>{tab}</b> is performing a map search right now... waiting...';

langpack.TreasureChestPostFB = 'post Merlin Chest automatically to Facebook';
langpack.buildUseSpeedups = 'use hourglasses';
langpack.buildUseSpeedupsOK = 'Building task in <b>{city}</b> was shortened by using <b>{item}</b>';
langpack.buildUseSpeedupsFail = 'Building task in <b>{city}</b> could not be shortened by using <b>{item}</b>';
langpack.craftUseSpeedups = 'use hourglasses';
langpack.craftUseSpeedupsOK = 'Crafting in <b>{city}</b> was shortened by using <b>{item}</b>.';

langpack.transportDelRoute = 'Deleted a transport route because target or starting city does no longer exist in the entered coords';
langpack.reassignDelRoute = 'Deleted a reassigning route because target or starting city does no longer exist in the entered coords';
langpack.optionsHeadSpeedup = 'Which hourglasses should be used?';
langpack.refreshReloadAFK = 'need 3 min AFK';

langpack.optionsAutoRefreshSeedIntervall = 'Auto Refresh Seed - Interval: ';
langpack.optionsAutoRefreshSeedIntervall2 = 'seconds';
langpack.DFRadius = 'Radius (20 - 45): ';
langpack.DFInterval = 'Search every (20 - 240) minutes: ';
langpack.throneStuffEUQueueUpgradeLevel14 = 'Level 14 is max!';

langpack.MultiBrowser = 'suppress Multi-browser popup';
langpack.UniqeItems = 'Unique Items';

langpack.autoTrainWall = 'Construction';
langpack.autoTrainTrain = 'Train';

langpack.throneStuffItemStats = 'Your items';
langpack.throneStuffUseSpeedups = 'use hourglasses for repairing throne items';
langpack.throneStuffUseSpeedupsOK = 'The repair time for TR items was reduced by using <b>{item}</b>.';
langpack.throneStuffUseSpeedupsFail = 'The repair time for TR items could not be reduced by using <b>{item.';

langpack.optionsmovementopen = 'Clicking on coords opens Movement Window';

// TAB - CHAMP
langpack.tabLabelChamp = 'Champion';
langpack.champHead = 'Hall of Champions - Settings';
langpack.champHeadEquippedItems = 'Equipped Items';
langpack.champHeadEquippedItems2 = 'Item(s),';
langpack.champHeadEquippedItems3 = 'destroyed and ready to repair';
langpack.champHeadItemList = 'Items';
langpack.champShowAllEffect = 'View all effects';
langpack.champRedEffects = 'Show effect red:';
langpack.champUseAehterstones = 'Aethersteine of City:';
langpack.champLevel = 'Level';
langpack.champQuality = 'Quality';
langpack.champRepair = 'Repair';
langpack.champRepairTime = 'Repair Time';
langpack.champQualityUpgradeNote = 'Requires:';
langpack.champQualityUpgradeNote2 = 'Aetherstone';
langpack.champInvertOrder = 'Reverse order';
langpack.champFamily = 'Family';
langpack.champType = 'Type';
langpack.champBonus = 'Bonus';
langpack.champEquipItem = 'equip:';
langpack.champUnequipItem = 'Store';
langpack.champEquipTo = 'Equiped With:';
langpack.champNoCity = 'Not associated with City';
langpack.champMarching = 'Marched From';
langpack.champDefending = 'Defended';
langpack.champGems = 'Warning: Gems were used';
langpack.champItemBroken = 'Item broken';
langpack.champFatalError= 'Fatal Error:';
langpack.champErrorQuality = 'Error when improving the Quality:';
langpack.champErrorLevel = 'Error when raising the Level:';
langpack.champErrorRepair = 'Error when repairing items:';
langpack.champErrorDelete = 'Error when deleting Items:';
langpack.champErrorUnequip = 'Error when dropping items:';
langpack.champErrorEquip = 'Error when equiping item:';




// LOADING LANGPACK
langpack.loaded = true;


//	┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
//	│  	### EOF ###											 │
//	│   KOC POWER - MULTILANG | ENGLISH LANGPACK								│
//	└────────────────────────────────────────────────────────────────────────────────────────────────────────┘