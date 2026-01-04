// ==UserScript==
// @name         FCup Script polnish server test
// @author       Criyessei | mot33
// @description  Fcup Toolmenü
// @version      3.0.3
// @license      MIT
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://greasyfork.org/scripts/40714-fcs/code/fcs.js?version=265490
// @include      https://fussballcup.de*
// @exclude      https://fussballcup.de/*action=logout*
// @include      https://futbolcup.net*
// @exclude      https://futbolcup.net/*action=logout*
// @include      https://fussballcup.at*
// @exclude      https://fussballcup.at/*action=logout*
// @include      https://futbolcup.pl*
// @exclude      https://futbolcup.pl/*action=logout*
// @connect      greasyfork.org
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @namespace    https://greasyfork.org/de/users/214295-mot33
// @downloadURL https://update.greasyfork.org/scripts/372395/FCup%20Script%20polnish%20server%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/372395/FCup%20Script%20polnish%20server%20test.meta.js
// ==/UserScript==

/*-------------Global Veriables-------------*/
var sources = {
    get:function(name,type){
        return 'https://mot96.lima-city.de/'+name+'.'+type;/*Thanks to mot33*/
    }
};
var svTime;
var svTimeRDate;
var scriptData = {
    "alternativeLanguage":"English",
    "TrainingPlans" : [
        [
            [0,1,3,6,8],
            [9,6,3,7,8,10,5],
            [9,6,3,7,8,10,5],
            [6,9,3,7,10,8],
            [10,3,8,11,9,6],
            [10,3,8,11,9,6],
            [11,3,8,10,4,6],
            [11,3,8,4,2,10,5]
        ],
        [
            [1,0,3,6,8,4,10],
            [9,6,3,7,10,8,5,4],
            [9,6,3,7,10,8,5,4],
            [6,9,3,10,7,8,4,11],
            [10,3,8,5,11,9,6,4],
            [10,3,8,5,11,9,6,4],
            [11,3,8,2,10,4,9,6],
            [11,3,10,2,8,6,4,5]
        ],
        [
            [0,1,3,8,6,10,4,2],
            [9,6,3,7,8,10,5,4,11,2],
            [9,6,3,7,8,10,5,4,11,2],
            [6,9,3,7,10,8,4,11,5,2],
            [10,3,8,5,9,11,6,4,7,2],
            [10,3,8,5,9,11,6,4,7,2],
            [11,3,8,10,2,4,6,9,5,7],
            [11,3,8,2,10,6,4,5,9,7]
        ]],
    "FeaturesOfScript" : {
        "ShowPublicRelations":true,
        "ConstructionCountdown":true,
        "ClubExchange":true,
        "PlayersHealth":true,
        "RankingOfPlayers":true,
        "TrainingControl":true,
        "RematchMatch":true,
        "InviteSimulationMatch":true,
        "AutomaticTraining":true,
        "TrainingGroups":true,
        "CampHistory":true,
        "TransferDates":true,
        "GoOffer":true,
        "FilterTransferMarket":true,
        "FilterOwnOffers":true,
        "ShowOwnOfferInMarket":true,
        "ShowBoughtPlayers":true,
        "ShowStrengthChange":true,
        "ShowRealStrength":true,
        "CalculateNonYoungPlayersStrength":true,
        "YoungPlayersHistory":true,
        "CalculatingStrengthOfYoungPlayer":true,
        "DownloadTable":true,
        "AddImage":true,
        "ShowEloRating":true,
        "QuickShopping":true,
        "ShowAsistantLevelIncrease":true,
        "QuickBet":true,
        "ShowSquadStrength":false,
    }
};
var gameVeriables = {
    "tr":{
        "flag":"TUR",
        "zone" : "Europe/Istanbul",
        "language" : "Turkish",
        "footballerPositions":{
            "Position1":"KL",
            "Position2":"DD",
            "Position3":"DI",
            "Position4":"OD",
            "Position5":"OL",
            "Position6":"OR",
            "Position7":"OH",
            "Position8":"FO"
        },
        "Leagues":{
            "League1" : "Türkiye Amatör Ligi",
            "League2" : "Türkiye 3. Ligi C",
            "League3" : "Türkiye 3. Ligi B",
            "League4" : "Türkiye 3. Ligi A",
            "League5" : "Türkiye 2. Ligi B",
            "League6" : "Türkiye 2. Ligi A",
            "League7" : "Türkiye 1. Ligi",
            "League8" : "Türkiye Süper Ligi"
        },
        "replaceClubName":"'den Profil",
        "ScriptAuthorClubId":"1286060",
        "ClubExchange":"Kulüp Değiştirme",
        "acceptedBidText" : "kabul edildi",
        "rejectedBidText" : "reddedildi",
        "readBidText" : "okundu",
        "newBidText" : "yeni",
        "youngPlayer":undefined,
        "increaseBid":undefined,
        "buyPlayer":undefined,
        "ageDates":undefined
    },
    "de":{
        "flag":"DEU",
        "ageDates" : [25264620, 25308396, 25352172, 25396008, 25439784, 25483560, 25527336, 25571112, 25614888, 25658664, 25702380, 25746156, 25789932, 25833708, 25877484, 25922760, 25965096, 26008872, 26052648, 26096424, 26141640, 26183976, 26227692, 26271468, 26315244, 26359020, 26402796, 26446632, 26490408, 26534184, 26579400, 26621736, 26665512, 26709288, 26753004, 26796780],
        "zone" : "Europe/Berlin",/*To find game local time*/
        "language" : "German", /*The game language*/
        "footballerPositions":{
            "Position1":"TW",
            "Position2":"AV",
            "Position3":"IV",
            "Position4":"DM",
            "Position5":"LM",
            "Position6":"RM",
            "Position7":"OM",
            "Position8":"ST"
        },
        "Leagues":{
            "League1" : "Kreisliga",
            "League2" : "Landesliga",
            "League3" : "Verbandsliga",
            "League4" : "Oberliga",
            "League5" : "Regionalliga",
            "League6" : "3. Liga",
            "League7" : "2. Bundesliga",
            "League8" : "1. Bundesliga"
        },
        "replaceClubName":"Profil von ",/*To find the club name : https://image.ibb.co/eGWg2S/Ads_z.png*/
        "ScriptAuthorClubId":"1286060",
        "ClubExchange":"Vereinswechsel",/*To control players who have left the club : https://image.ibb.co/kMi0wn/Ads_z.png*/
        "acceptedBidText" : "akzeptiert", /*To separate bids : https://image.ibb.co/hWkup7/Ads_z.png*/
        "rejectedBidText" : "abgelehnt", /*To separate bids : https://image.ibb.co/hWkup7/Ads_z.png*/
        "readBidText" : "gelesen", /*To separate bids : https://image.ibb.co/hWkup7/Ads_z.png*/
        "newBidText" : "neu", /*To separate bids : https://image.ibb.co/hWkup7/Ads_z.png*/
        "youngPlayer":{"title":'Jugendspieler',"a":"diesen ","b":" mal"},
        "increaseBid":{"title":"Transfermarkt","a":"überboten","b":"für ","c":" wurde"},
        "buyPlayer":{"title":"Assistent:","a":"ausgehandelt","b":"Spieler ","c":" hat"}
    },
    "at":{
        "flag":"AUT",
        "zone" : "Europe/Vienna",
        "language" : "German",
        "footballerPositions":{
            "Position1":"TW",
            "Position2":"AV",
            "Position3":"IV",
            "Position4":"DM",
            "Position5":"LM",
            "Position6":"RM",
            "Position7":"OM",
            "Position8":"ST"
        },
        "Leagues":{
            "League1" : "2. Klasse",
            "League2" : "1. Klasse",
            "League3" : "Gebietsliga",
            "League4" : "2. Landesliga",
            "League5" : "Landesliga",
            "League6" : "Regionalliga",
            "League7" : "Erste Liga",
            "League8" : "Österreichische Bundesliga"
        },
        "replaceClubName":"Profil von",
        "ScriptAuthorClubId":"1286060",
        "ClubExchange":"???",
        "acceptedBidText" : "akzeptiert",
        "rejectedBidText" : "abgelehnt",
        "readBidText" : "gelesen",
        "newBidText" : "neu",
        "youngPlayer":undefined,
        "increaseBid":undefined,
        "buyPlayer":undefined,
        "ageDates":undefined
    },
"pl":{
        "flag":"POL",
        "ageDates" : [25264620, 25308396, 25352172, 25396008, 25439784, 25483560, 25527336, 25571112, 25614888, 25658664, 25702380, 25746156, 25789932, 25833708, 25877484, 25922760, 25965096, 26008872, 26052648, 26096424, 26141640, 26183976, 26227692, 26271468, 26315244, 26359020, 26402796, 26446632, 26490408, 26534184, 26579400, 26621736, 26665512, 26709288, 26753004, 26796780],
        "zone" : "Europe/Warsaw",
        "language" : "Polski",
        "footballerPositions":{
            "Position1":"BR",
            "Position2":"OZ",
            "Position3":"OŚ",
            "Position4":"DP",
            "Position5":"LP",
            "Position6":"PP",
            "Position7":"OP",
            "Position8":"N"
        },
        "Leagues":{
            "League1" : "Klasa B",
            "League2" : "Klasa A",
            "League3" : "Liga okregowa",
            "League4" : "4 Liga",
            "League5" : "3 Liga",
            "League6" : "2 Liga",
            "League7" : "1 Liga",
            "League8" : "Ekstraklasa"
        },
        "replaceClubName":"Profil",
        "ScriptAuthorClubId":"1142",
        "ClubExchange":"zmieniając kluby",
        "acceptedBidText" : "zaakceptowany",
        "rejectedBidText" : "odrzucone",
        "readBidText" : "czytać",
        "newBidText" : "nowy",
        "youngPlayer":"",
        "increaseBid":"",
        "buyPlayer":""
    }
};
var scriptTexts = {
    "English" : {
        "Language":"English",
        "OtherLanguages" : {
            "Turkish":"Turkish",
            "German":"German"
        },
        "FeaturesName":{
            "ShowPublicRelations":"Public relations status",
            "ConstructionCountdown":"Construction countdown",
            "ClubExchange":"Club exchange",
            "PlayersHealth":"Players health",
            "RankingOfPlayers":"Ranking of players",
            "TrainingControl":"Training control",
            "RematchMatch":"Rematch match",
            "InviteSimulationMatch":"Invite to simulation match",
            "AutomaticTraining":"Automatic training",
            "TrainingGroups":"Training groups",
            "CampHistory":"Camp history",
            "TransferDates":"Transfer dates",
            "GoOffer":"Go to offer that was passed.",
            "FilterTransferMarket":"Filter transfer market",
            "FilterOwnOffers":"Filter own offers",
            "ShowOwnOfferInMarket":"Show own offer in market",
            "ShowBoughtPlayers":"Show bought players",
            "ShowStrengthChange":"Show power change",
            "ShowRealStrength":"Show the real power of the players",
            "CalculateNonYoungPlayersStrength":"Calculating the power of non-young players",
            "YoungPlayersHistory":"History of young players",
            "CalculatingStrengthOfYoungPlayer":"Calculating the strength of a young player",
            "DownloadTable":"Download table",
            "AddImage":"Add image",
            "ShowEloRating":"Show ELO rating",
            "QuickShopping":"Quick shopping",
            "ShowAsistantLevelIncrease":"Show asistant level increase",
            "QuickBet":"Quick bet",
            "ShowSquadStrength":"Show squad strength" //*deaktiviert
        },
        "Skills" : [
            "Penalty area safety",
            "Ball catching skill",
            "Two Footed",
            "Fitness",
            "Shot",
            "Header",
            "Duel",
            "Cover",
            "Speed",
            "Pass",
            "Endurance",
            "Running",
            "Ball Control",
            "Aggressive"
        ],
        "NeedNecessaryInformation":"Script needs the information to work",
        "InformScriptWorking":"The script is running successfully. Saved script data not found. It's because you are using the script for the first time or your cookies were deleted.",
        "HelpDataUploading":"If you have already downloaded the script's datas, please upload the data from the upload button : ",
        "EnterClubInformation":"Enter club information",
        "ClubId":"Club Id",
        "ClubName":"Club Name",
        "TrainerLevel":"Trainer Level",
        "TrainerLevelS":"Trainer Level",
        "SortLevel":"Lvl",
        "YoungTrainerLevel":"Young Trainer Level",
        "YoungTrainerLevelS":"Y.Trainer Lev.",
        "ChooseTrainingSchedule":"Choose Training Schedule",
        "TrainingPlan":"Training Plan",
        "Confirm":"Confirm",
        "NotTranslated":"This text has not been translated by translators yet!",
        "UploadDatas":"Upload Datas",
        "NotDataExist":"No data to download!",
        "DataLoaded":"Script data has been uploaded!",
        "ScriptMenuTitle":"FCup Script",
        "Version":"VERSION",
        "Explanation":"Explanation",
        "Action":"Action",
        "DownloadData":"Download data",
        "Download":"Download",
        "Load":"Load",
        "DeleteData":"Delete data",
        "DataCleared":"The data is cleared",
        "Delete":"Delete",
        "GameLanguage":"Game language",
        "Update":"Update",
        "Features":"Features",
        "ScriptWriter":"Script Writer",
        "AskDeleteTheData":"Do you want to delete the all servers' data?",
        "Age":"Age",
        "NewAge":"New Age",
        "aDay":"Day",
        "Days":"Days",
        "NewFeature1":"New feature available :",
        "NewFeature2":"Feature is not active. The next time you visit this page, it will start to work.",
        "PublicRelations":"Public Relation",
        "ItIsOver":"It is over",
        "Stadium":"Stadium",
        "Loading":"Loading",
        "Buildings":"Buildings",
        "GoToStadium":"Go to stadium",
        "GoToBuildings":"Go to buildings",
        "ClubExchange":function(date,clubName){return "This player will have gone to "+clubName+" club on "+date+"!";},
        "RemainingTime":"Remaining Time",
        "SaveHealth":"Save Health",
        "UpdateHealth":"Update Health",
        "Change":"Change",
        "SortPlayers":"Sort Players",
        "SaveNote":"Save Note",
        "ClearField":"Clear Field",
        "ClearedNote":"Note cleared.",
        "SavedNote":"The note saved.",
        "OpenNote":"Open Note",
        "CloseNote":"Close Note",
        "WriteANote":"Write a note!",
        "SimulationSendFail":"The simulation request failed!",
        "InviteSimulation":"Invite to simulation",
        "FaultyTrainingMessage":function(playerName,skillName){return playerName+' needs to improve his '+skillName+' skill.';},
        "ImproveSkillTitle":function(skillName){return skillName+" ability must be improved.";},
        "NoInformation":"No information",
        "TrainingGroupInformation":function(CountOfPlayer){return CountOfPlayer + " Player(s) are developing in this training group";},
        "NoPlayersInTheGroup":"There are <label style='color:red;'>no players</label> in this training group.",
        "NoRecord":"No record.",
        "AutomaticTraining":"Automatic Training : ",
        "PreviouslyVisitedCamps":"PREVIOSLY VISITED CAMPS",
        "No":"No",
        "Camp":"Camp",
        "Country":"Country",
        "Price":"Price",
        "_Skills":"Skills",
        "Definition":"Definition",
        "Date":"Date",
        "ServerDate":"Server Date",
        "TransferDate":"Transfer Date",
        "FootballersAreComing":"Footballers Are Coming",
        "TransferDateWillChange":"Transfer Date Will Change",
        "ShowOnlyOneLeague":"Show only one league",
        "SelectLeague":"Select league",
        "AllExceptGoalkeeper":"All except Goalkeeper",
        "ShowMyMarket":"Show My Market",
        "FilterPlayerInformation":function(CountOfPlayers,showPlayerCount){return 'This page shows '+showPlayerCount+' of '+CountOfPlayers+' players.';},
        "TodayOffers":"Today's offers",
        "AcceptedOffers":"Accepted offers",
        "ReadingOffers":"Reading offers",
        "RejectedOffers":"Rejected offers",
        "NewOffers":"New offers",
        "AcceptedOwnOffer":"Your offer to the player has been accepted!",
        "RejectedOwnOffer":"Your offer to the player has been rejected!",
        "ReadOwnOffer":"Your offer was read.",
        "NewOwnOffer":"Your bid is new.",
        "PassedOwnOffer":"But your bid has passed!",
        "SimulationRequestAvailable":"Simulation request available!",
        "SimulationRequestSent":"Simulation request sent!",
        "ListofPurchasedFootballers":"List of Players That Bought",
        "Name":"Name",
        "Position":"Position",
        "SortPosition":"Pos.",
        "Salary":"Salary",
        "Contract":"Contract",
        "Club":"Club",
        "Season":"Season",
        "Seasons":"Seasons",
        "ChooseNotebook":"Please choose a notebook!",
        "UploadPlayersData":"Upload the player data",
        "Warning":"Be Careful!!!!!!\nIf you continue, the purchased player data will be deleted!",
        "Loss":"Loss",
        "Gain":"Gain",
        "ChoosePlayer":"Choose Player",
        "CalculateNonYoungPlayersStrength":"Calculate Non-Young Players' Strength",
        "ChooseAge":"Choose Age",
        "Training":"Training",
        "NonCreditTraining":"NON-CREDIT",
        "CreditTraining":"CREDIT",
        "Now":"NOW",
        "SuccessfullyTransferred":function(playerName){return "You have successfully transferred your football player "+playerName+" to your club!";},
        "RemainingNextAgeDay":function(day){return 'The next age will remain for '+day+' day(s) and youth will end.';},
        "RemainingNumberOfCreditTraining":"Remaining number of credit training",
        "RemainingNumberOfNormalTraining":"Remaining number of normal training",
        "EndYouth":function(remainingDays,date){return 'After '+remainingDays+' day(s) the youth will end on '+date;},
        "AfterTrainings":function(trainings){return 'After ' + trainings+ ' training(s)';},
        "TitleOfYoungPlayersTable":"Young players coming to the club until today",
        "DownloadTable":"Download table!",
        "LeagueTable":"League table",
        "MatchResultsTable":"Match results table",
        "SquadStrengthTable":"Squad strength table",
        "GoalScorerTable":"Goal scorer table",
        "EnterImageLink":"Enter the image link",
        "AddImage":"Add image",
        "EloRank":"ELO Rank",
        "FillAll":"Fill All",
        "EmptyAll":"Empty All",
        "Ordering":"Ordering",
        "SeminarIsOver":"Seminar is over.",
        "SameLeague":"Same league",
        "CancelUnnecessaryDays":"Cancel unnecessary days",
        "DeleteSquadStrength":function(days,date){return 'This team\'s data is deleted because it was recorded <span style="color: #ff1a1a;font-weight:bold;">'+days+'</span> days ago! Because the power of football players can not be displayed correctly.<br><span style="font-size: 12px;"><span style="color: #00ff93;font-weight:bold;margin-right:10px;">Registration date :</span><span style="color:white;">'+date+'</span></span>';},
        "HealthBonus":"Health Bonus (+5%)",
        "LeadershipBonus":"Leadership Bonus (+1%)",
        "FormationBonus":"Formation Bonus (+10%)",
        "HomeBonus":"Home Bonus (+2%)",
        "SquadStrength":"Squad Strength",
        "TotalSquadStrength":"Total Squad Strength",
        "SquadStrengthExceptBonuses":"Squad Strength Except Bonuses",
        "RegistrationDate":"Registration date",
        "ShowHomeSquad":"Show home squad",
        "ShowAwaySquad":"Show away squad",
        "RefreshPage":"Refresh Page",
        "UpdateTheScriptInfo":function(a,b){return 'If you want to update the script, '+a+'click here'+b+'. Update the script from the page that opens. Then refresh this page!! (F5 or refresh button)';},
        "NewVersion":"New version",
        "CurrentVersion":"Current Version",
        "ReleasedVersion":function(newVersion){return 'Version '+newVersion+' of the FCup script has been released!!!';},
        "SortTournaments":"Sort tournaments",
        "Team":"Team",
        "Full":"Full",
        "Missing":"Missing",
        "SpecialThanks":"Special Thanks"
    },
    "Turkish" : {
        "Language":"Türkçe",
        "OtherLanguages" : {
            "English":"İngilizce",
            "German":"Almanca"
        },
        "FeaturesName":{
            "ShowPublicRelations":"Halkla ilişkiler durumu",
            "ConstructionCountdown":"İnşaat geri sayım",
            "ClubExchange":"Kulüp değişimi",
            "PlayersHealth":"Futbolcu sağlığı",
            "RankingOfPlayers":"Oyuncuların sıralaması",
            "TrainingControl":"Antrenman kontrolü",
            "RematchMatch":"Rövanş maçı",
            "InviteSimulationMatch":"Similasyon isteği göndermek",
            "AutomaticTraining":"Otomatik antrenman",
            "TrainingGroups":"Antrenman grupları",
            "CampHistory":"Kamp geçmişi",
            "TransferDates":"Transfer tarihleri",
            "GoOffer":"Geçilen teklife git!",
            "FilterTransferMarket":"Transfer pazarını filtrele",
            "FilterOwnOffers":"Kendi tekliflerimizi filtrele",
            "ShowOwnOfferInMarket":"Pazarda kendi tekliflerimizi göster",
            "ShowBoughtPlayers":"Satın alınan oyuncuları göster",
            "ShowStrengthChange":"Güç değişimini göster",
            "ShowRealStrength":"Oyuncuların gerçek gücünü göster",
            "CalculateNonYoungPlayersStrength":"Genç olmayan oyuncuların gücünü hesaplama",
            "YoungPlayersHistory":"Genç oyuncuların tarihi",
            "CalculatingStrengthOfYoungPlayer":"Genç oyuncunun gücünü hesaplama",
            "DownloadTable":"Tabloyu indir",
            "AddImage":"Resim ekle",
            "ShowEloRating":"ELO Sıralamasını göster",
            "QuickShopping":"Hızlı alış-veriş",
            "ShowAsistantLevelIncrease":"Asistan seviye artışını göster",
            "QuickBet":"Hızlı bahis",
            "ShowSquadStrength":"Takım gücünü göster"
        },
        "Skills" : [
            "Ceza sahası güvenliği",
            "Top yakalama becerisi",
            "İki ayağa hakimiyet",
            "Fitness",
            "Şut",
            "Kafa topu",
            "İkili mücadele",
            "Markaj",
            "Hız",
            "Pas",
            "Dayanıklılık",
            "Koşmaya hazır olma",
            "Top kontrolü",
            "Sertlik"
        ],
        "NeedNecessaryInformation":"Scriptin çalışması için bilgiye ihtiyaç var",
        "InformScriptWorking":"Script başarıyla çalışıyor. Kayıtlı veri göremedik, bu durum scripti ilk kez kullandığınızdan veya cookielerinizin silinmesinden kaynaklanıyor.",
        "HelpDataUploading":"Eğer daha önceden indirdiğiniz verileriniz varsa , lütfen verileri yükle butonundan verileri yükleyin : ",
        "EnterClubInformation":"Kulüp Bilgilerini Doldurun",
        "ClubId":"Kulüp Id",
        "ClubName":"Kulüp İsmi",
        "TrainerLevel":"Antrenör Seviyesi",
        "TrainerLevelS":"Antrenör Sev.",
        "SortLevel":"Lvl",
        "YoungTrainerLevel":"Genç Takım Antrenörü Seviyesi",
        "YoungTrainerLevelS":"G.Antrenör Sev.",
        "ChooseTrainingSchedule":"Antrenman Planını Seçin",
        "TrainingPlan":"Antrenman Planı",
        "Confirm":"Onayla",
        "NotTranslated":"Bu yazı henüz çevirmenler tarafından çevrilmedi!",
        "UploadDatas":"Verileri Yükle",
        "NotDataExist":"İndirilecek veri yok!",
        "DataLoaded":"Script verileri yüklendi!",
        "ScriptMenuTitle":"FCup Scripti",
        "Version":"VERSİYON",
        "Explanation":"Açıklama",
        "Action":"Eylem",
        "DownloadData":"Verileri yedekle",
        "Download":"İndir",
        "Load":"Yükle",
        "DeleteData":"Verileri sil",
        "DataCleared":"Veriler silindi",
        "Delete":"Sil",
        "GameLanguage":"Oyun dili",
        "Update":"Güncelle",
        "Features":"Özellikler",
        "ScriptWriter":"Script Yazarı",
        "AskDeleteTheData":"Tüm serverlerin script verilerini silmek istiyor musunuz?",
        "Age":"Yaş",
        "NewAge":"Yeni Yaş",
        "aDay":"Gün",
        "Days":"Gün",
        "NewFeature1":"Yeni özellik geldi : ",
        "NewFeature2":"Şuan aktif değil. Bir sonraki bu sayfayı ziyaret ettiğinizde çalışmaya başlayacaktır.",
        "PublicRelations":"Halkla İlişkiler",
        "ItIsOver":"Bitti",
        "Stadium":"Stadyum",
        "Loading":"Yükleniyor",
        "Buildings":"Binalar",
        "GoToStadium":"Stadyuma git",
        "GoToBuildings":"Binalara git",
        "ClubExchange":function(date,clubName){return "Bu oyuncu "+date+" tarihinde "+clubName+" adlı kulübe gitmiş olacak!";},
        "RemainingTime":"Kalan Süre",
        "SaveHealth":"Sağlığı Kaydet",
        "UpdateHealth":"Sağlığı Güncelle",
        "Change":"Değişim",
        "SortPlayers":"Oyuncuları Sırala",
        "SaveNote":"Notu Kaydet",
        "ClearField":"Notu Temizle",
        "ClearedNote":"Not temizlendi.",
        "SavedNote":"Not kayıt edildi.",
        "OpenNote":"Notu Aç",
        "CloseNote":"Notu Kapa",
        "WriteANote":"Not yaz!",
        "SimulationSendFail":"Simülasyon isteği başarısız oldu!",
        "InviteSimulation":"Simülasyon gönder",
        "FaultyTrainingMessage":function(playerName,skillName){return playerName+' '+skillName+' yeteneğini geliştirmeli.';},
        "ImproveSkillTitle":function(skillName){return skillName+" yeteneği geliştirilmeli.";},
        "NoInformation":"Bilgi yok",
        "TrainingGroupInformation":function(CountOfPlayer){return "Bu antrenman grubunda " + CountOfPlayer + " oyuncu gelişmektedir";},
        "NoPlayersInTheGroup":"Bu antrenman grubunda <label style='color:red;'>hiçbir</label> oyuncu bulunmuyor!",
        "NoRecord":"Kayıt yok.",
        "AutomaticTraining":"Otomatik Antrenman : ",
        "PreviouslyVisitedCamps":"DAHA ÖNCE ZİYARET EDİLEN KAMPLAR",
        "No":"No",
        "Camp":"Kamp",
        "Country":"Ülke",
        "Price":"Ücret",
        "_Skills":"Beceriler",
        "Definition":"Tanım",
        "Date":"Tarih",
        "ServerDate":"Server Tarihi",
        "TransferDate":"Transfer Tarihi",
        "FootballersAreComing":"Oyuncular Geliyor",
        "TransferDateWillChange":"Transfer Tarihi Değişecek",
        "ShowOnlyOneLeague":"Yalnızca bir lig göster",
        "SelectLeague":"Lig seçin",
        "AllExceptGoalkeeper":"Kaleci hariç hepsi",
        "ShowMyMarket":"Pazarımı Göster",
        "FilterPlayerInformation":function(CountOfPlayers,showPlayerCount){return 'Bu sayfadaki '+CountOfPlayers+' oyuncudan '+showPlayerCount+' tanesi gösteriliyor.';},
        "TodayOffers":"Bu günkü teklifler",
        "AcceptedOffers":"Kabul edilen teklifler",
        "ReadingOffers":"Okunan teklifler",
        "RejectedOffers":"Reddedilen teklifler",
        "NewOffers":"Yeni teklifler",
        "AcceptedOwnOffer":"Oyuncuya verdiğiniz teklif kabul edildi!",
        "RejectedOwnOffer":"Oyuncuya verdiğiniz teklif reddedildi!",
        "ReadOwnOffer":"Teklifiniz okundu.",
        "NewOwnOffer":"Teklifiniz yeni.",
        "PassedOwnOffer":"Fakat teklifiniz geçildi!",
        "SimulationRequestAvailable":"Simülasyon isteği mevcut!",
        "SimulationRequestSent":"Simülasyon isteği gönderildi!",
        "ListofPurchasedFootballers":"Satın Alınan Futbolcular Listesi",
        "Name":"İsim",
        "Position":"Pozisyon",
        "SortPosition":"Poz.",
        "Salary":"Maaş",
        "Contract":"Sözleşme",
        "Club":"Kulüp",
        "Season":"Yıl",
        "Seasons":"Yıl",
        "ChooseNotebook":"Lütfen bir not defteri seçin!",
        "UploadPlayersData":"Satın alınan oyuncu verilerini yükleyin",
        "Warning":"Dikkat!!!!!!\Devam edersen satın alınan oyuncu verileri silinir!",
        "Loss":"Zarar",
        "Gain":"Kazanç",
        "ChoosePlayer":"Oyuncu Seçin",
        "CalculateNonYoungPlayersStrength":"Genç Olmayan Oyuncuların Gücünü Hesaplayın",
        "ChooseAge":"Yaşını Seçin",
        "Training":"Antrenman",
        "NonCreditTraining":"KREDİSİZ",
        "CreditTraining":"KREDİLİ",
        "Now":"ŞUAN",
        "SuccessfullyTransferred":function(playerName){return playerName+" adlı oyuncuyu başarıyla kulübünüze transfer ettiniz!";},
        "RemainingNextAgeDay":function(day){return 'Sonraki yaş atlamaya ' + day + ' gün kala çıkacak!';},
        "RemainingNumberOfCreditTraining":"Kalan kredili antrenman sayısı",
        "RemainingNumberOfNormalTraining":"Kalan normal antrenman sayısı",
        "EndYouth":function(remainingDays,date){return remainingDays + ' Gün sonra ' + date + ' tarihinde gençlikten çıkacak';},
        "AfterTrainings":function(trainings){return trainings+' Antrenman sonra';},
        "TitleOfYoungPlayersTable":"Bu Güne Kadar Gelen Gençler",
        "DownloadTable":"Tabloyu indir!",
        "LeagueTable":"Lig tablosu",
        "MatchResultsTable":"Maç sonuçları tablosu",
        "SquadStrengthTable":"Kadro güçleri tablosu",
        "GoalScorerTable":"Gol krallığı tablosu",
        "EnterImageLink":"Resim linkini girin",
        "AddImage":"Resim ekle",
        "EloRank":"ELO Sırası",
        "FillAll":"Full Doldur",
        "EmptyAll":"Hepsini Boşalt",
        "Ordering":"Sipariş Ver",
        "SeminarIsOver":"Seminer bitti.",
        "SameLeague":"Aynı lig",
        "CancelUnnecessaryDays":"Gereksiz günleri iptal et",
        "DeleteSquadStrength":function(days,date){return 'Bu takımın verisi <span style="color: #ff1a1a;font-weight:bold;">'+days+'</span> gün önce kayıt edildiği için siliniyor! Çünkü futbolcu güçleri doğru şekilde gösterilemez. <br><span style="font-size: 12px;"><span style="color: #00ff93;font-weight:bold;margin-right:10px;">Kayıt tarihi :</span><span style="color:white;">'+date+'</span></span>';},
        "HealthBonus":"Fitness Bonusu (+5%)",
        "LeadershipBonus":"Kaptan Bonusu (+1%)",
        "FormationBonus":"Diziliş Bonusu (+10%)",
        "HomeBonus":"Ev Sahibi Bonusu (+2%)",
        "SquadStrength":"Kadro Gücü",
        "TotalSquadStrength":"Topalm Kadro Gücü",
        "SquadStrengthExceptBonuses":"Bonussuz Kadro Gücü",
        "RegistrationDate":"Kayıt Tarihi",
        "ShowHomeSquad":"Ev sahibi takımı göster",
        "ShowAwaySquad":"Deplasman takımı göster",
        "RefreshPage":"Sayfayı Yenile",
        "UpdateTheScriptInfo":function(a,b){return 'Scripti güncellemek istiyorsanız , '+a+'buraya tıklayın'+b+'. Açılan sayfadan scripti güncelleyin. Daha sonra bu sayfayı yenileyin!! (F5 yada yenileme butonu)';},
        "NewVersion":"Yeni versiyon",
        "CurrentVersion":"Mevcut versiyon",
        "ReleasedVersion":function(newVersion){return 'FCup scriptinin '+newVersion+' versiyonu çıktı!!!';},
        "SortTournaments":"Turnuvaları sırala",
        "Team":"Takım",
        "Full":"Tam",
        "Missing":"Eksik",
        "SpecialThanks":"Özel Teşekkür"
    },
    "German" : {/*Thanks to mot33*/
        "Language":"German",
        "OtherLanguages" : {
            "Turkish":"Türkisch",
            "English":"Englisch"
        },
        "FeaturesName":{
            "ShowPublicRelations":"Fanansehen",
            "ConstructionCountdown":"Ausbauzeit",
            "ClubExchange":"Club Austausch",
            "PlayersHealth":"Spielergesundheit",
            "RankingOfPlayers":"Rangliste der Spieler",
            "TrainingControl":"Trainingskontrolle",
            "RematchMatch":"Simu-Rückspiel",
            "InviteSimulationMatch":"Zu Simulation einladen",
            "AutomaticTraining":"automatisches Training",
            "TrainingGroups":"Trainingsgruppen",
            "CampHistory":"Trainingslager Historie",
            "TransferDates":"Datum des Transfers",
            "GoOffer":"Gehe zum Angebot, was bestätigt wurde..",
            "FilterTransferMarket":"Filter Transfermarkt",
            "FilterOwnOffers":"Eigene Angebote filtern",
            "ShowOwnOfferInMarket":"Eigene Angebote im Transfermarkt zeigen.",
            "ShowBoughtPlayers":"Zeige gekaufte Spieler",
            "ShowStrengthChange":"Zeige Leistungsänderung",
            "ShowRealStrength":"Zeige die aktuelle Stärke der Spieler",
            "CalculateNonYoungPlayersStrength":"Berechne die Stärke von nicht Jugendspieler",
            "YoungPlayersHistory":"History der Jugendspieler",
            "CalculatingStrengthOfYoungPlayer":"Berechne die Stärke von Jugendspielern",
            "DownloadTable":"Download Tabelle",
            "AddImage":"Bild hinzufügen",
            "ShowEloRating":"Zeige ELO Rank",
            "QuickShopping":"schnelles einkaufen",
            "ShowAsistantLevelIncrease":"Zeige Assistenten Levelanstieg",
            "QuickBet":"schnelles wetten",
            "ShowSquadStrength":"Zeige Gruppenstärke"
        },
        "Skills" : [
            "Strafraumsicherheit",
            "Fabgsicherheit",
            "Beidfüssigkeit",
            "Fitness",
            "Schuss",
            "Kopfball",
            "Zweikampf",
            "Deckung",
            "Geschwindigkeit",
            "Pass",
            "Ausdauer",
            "Laufbereitschaft",
            "Ballkontrolle",
            "Aggressivität"
        ],
        "NeedNecessaryInformation":"Das Tool braucht die Informationen, um richtig zu arbeiten.",
        "InformScriptWorking":"Das Skript wird erfolgreich ausgeführt. Gespeicherte Skriptdaten wurden nicht gefunden. Das liegt daran, dass Sie das Skript zum ersten Mal verwenden oder Ihre Cookies gelöscht wurden.",
        "HelpDataUploading":"Wenn Sie die Daten des Skripts bereits heruntergeladen haben, laden Sie die Daten von der Upload-Schaltfläche hoch: ",
        "EnterClubInformation":"Eingabe Vereinsinformation",
        "ClubId":"Club Id",
        "ClubName":"Vereinsname",
        "TrainerLevel":"Trainer Level",
        "TrainerLevelS":"Trainer Level",
        "SortLevel":"Lvl",
        "YoungTrainerLevel":"Jugendtrainer Level",
        "YoungTrainerLevelS":"Jugendtra. Level",
        "ChooseTrainingSchedule":"Trainingsplan wählen.",
        "TrainingPlan":"Trainingsplan",
        "Confirm":"Bestätigen",
        "NotTranslated":"Dieser Text wurde noch nicht von einem Übersetzer übersetzt!",
        "UploadDatas":"Daten Hochladen",
        "NotDataExist":"Es existieren keine Daten!",
        "DataLoaded":"Tool Daten wurden Hochgeladen!",
        "ScriptMenuTitle":"Fussballcup Tool",
        "Version":"VERSION",
        "Explanation":"Erläuterung",
        "Action":"Aktion",
        "DownloadData":"Daten download",
        "Download":"Downl.",
        "Load":"laden",
        "DeleteData":"Lösche Daten",
        "DataCleared":"Die Daten sind gelöscht",
        "Delete":"löschen",
        "GameLanguage":"Spiel Sprache",
        "Update":"Update",
        "Features":"Funktionen",
        "ScriptWriter":"Erstellt von",
        "AskDeleteTheData":"Möchten Sie die Daten vom Server löschen?",
        "Age":"Alter",
        "NewAge":"nächste Alterung",
        "aDay":"Tag (e)",
        "Days":"Tage",
        "NewFeature1":"Neue Funktionen verfügbar:",
        "NewFeature2":"Funktion ist nicht aktiv. Das nächste Mal wenn Sie diese Seite besuchen, funktioniert es.",
        "PublicRelations":"Fanansehen",
        "ItIsOver":"fertiggestellt",
        "Stadium":"Stadion",
        "Loading":"Laden",
        "Buildings":"Vereinsgelände",
        "GoToStadium":"gehe zum Stadion",
        "GoToBuildings":"gehe zum Vereinsgelände",
        "ClubExchange":function(date,clubName){return "Dieser Spieler wechselt zu "+clubName+" club on "+date+"!";},
        "RemainingTime":"verbleibende Zeit",
        "SaveHealth":"speicher Gesundheit",
        "UpdateHealth":"Zeige Gesundheit",
        "Change":"Veränderung",
        "SortPlayers":"sortiere Spieler",
        "SaveNote":"Speicher Notiz",
        "ClearField":"lösche Notiz",
        "ClearedNote":"Notiz wurde gelöscht.",
        "SavedNote":"Notiz wurde gespeichert..",
        "OpenNote":"Notizen Öffnen",
        "CloseNote":"Notizen schließen",
        "WriteANote":"Schreibe eine Notiz!",
        "SimulationSendFail":"Die Simulationsanforderung ist fehlgeschlagen!",
        "InviteSimulation":"Einladen zum Simulationsspiel",
        "FaultyTrainingMessage":function(playerName,skillName){return playerName+' muss verbessert werden: '+skillName+' skill.';},
        "ImproveSkillTitle":function(skillName){return skillName+" Fähigkeit muss verbessert werden.";},
        "NoInformation":"keine Information",
        "TrainingGroupInformation":function(CountOfPlayer){return CountOfPlayer + " Player(s) entwickeln sich in dieser Trainingsgruppe";},
        "NoPlayersInTheGroup":"Es sind<label style='color:red;'>keine Spieler</label> in der Trainingsgruppe.",
        "NoRecord":"keine Aufnahme.",
        "AutomaticTraining":"automatisches Training: ",
        "PreviouslyVisitedCamps":"vorher besuchte Trainingslager",
        "No":"Nein",
        "Camp":"Trainingslager",
        "Country":"Land",
        "Price":"Preis",
        "_Skills":"Skills",
        "Definition":"Definition",
        "Date":"Datum",
        "ServerDate":"Serverdatum",
        "TransferDate":"Transferdatum",
        "FootballersAreComing":"Spieler kommen in",
        "TransferDateWillChange":"Transferdatum ändert sich in",
        "ShowOnlyOneLeague":"Zeige nur eine Liga",
        "SelectLeague":"Auswahl Liga",
        "AllExceptGoalkeeper":"Alle außer Torwart",
        "ShowMyMarket":"Zeige meinen Markt",
        "FilterPlayerInformation":function(CountOfPlayers,showPlayerCount){return 'Diese Seite zeigt '+showPlayerCount+' of '+CountOfPlayers+' players.';},
        "TodayOffers":"heutige Angebote",
        "AcceptedOffers":"angenommene Angebote",
        "ReadingOffers":"gelsesene Angebote",
        "RejectedOffers":"abgelehnte Angebote",
        "NewOffers":"neue Angebote",
        "AcceptedOwnOffer":"Ihr Angebot an den Spieler wurde angenommen!",
        "RejectedOwnOffer":"Ihr Angebot an den Spieler wurde abgelehnt!",
        "ReadOwnOffer":"Dein Angebot wurde gelesen.",
        "NewOwnOffer":"Dein Gebot ist neu.",
        "PassedOwnOffer":"Abei dein Gebot ist vergangen",
        "SimulationRequestAvailable":"Simulationsanfrage verfügbar!",
        "SimulationRequestSent":"Simulationsanfrage gesendet!",
        "ListofPurchasedFootballers":"Liste der gekauften Spieler",
        "Name":"Name",
        "Position":"Position",
        "SortPosition":"Pos.",
        "Salary":"Gehalt",
        "Contract":"Vertrag",
        "Club":"Verein",
        "Season":"Saison",
        "Seasons":"Saisons",
        "ChooseNotebook":"Bitte wählen deine Notiz!",
        "UploadPlayersData":"Spielerdaten Hochladen",
        "Warning":"Sei vorsichtig!!!!!!\Wenn du fortfährst, werden die erworbenen Spielerdaten gelöscht!",
        "Loss":"Verlust",
        "Gain":"Gewinn",
        "ChoosePlayer":"wähle Spieler",
        "CalculateNonYoungPlayersStrength":"Berechne nicht Jugendspieler Stärke",
        "ChooseAge":"wähle das Alter",
        "Training":"Training",
        "NonCreditTraining":"kein Credit einsatz",
        "CreditTraining":"mit Credits",
        "Now":"Aktuell",
        "SuccessfullyTransferred":function(playerName){return "Du hast den Spieler erfolgreich transferiert "+playerName+" zu deinem Verein!";},
        "RemainingNextAgeDay":function(day){return 'Die nächste Alterung findet statt '+day+' Tag(e) und die Jugendspieler Zeit ist beendet.';},
        "RemainingNumberOfCreditTraining":"verbleibende Anzahl von Credit Training",
        "RemainingNumberOfNormalTraining":"verbleibende Anzahl von normalen Training",
        "EndYouth":function(remainingDays,date){return 'Nach '+remainingDays+' Tag(e) die Jugendspieler Zeit endet am '+date;},
        "AfterTrainings":function(trainings){return 'Nach ' + trainings+ ' training';},
        "TitleOfYoungPlayersTable":"Jugendspieler die bis heute zu deinem Verein kamen",
        "DownloadTable":"Download Tabelle!",
        "LeagueTable":"Liga Tabelle",
        "MatchResultsTable":"Spielrgebnis Tabelle",
        "SquadStrengthTable":"Mannschaftsstärken Tabelle",
        "GoalScorerTable":"Torschützen Tabelle",
        "EnterImageLink":"Eingabe des Bild links",
        "AddImage":"Bild hinzufügen",
        "EloRank":"ELO Rang",
        "FillAll":"alles ausfüllen",
        "EmptyAll":"alles leeren",
        "Ordering":"Bestellungen",
        "SeminarIsOver":"Die Weiterbildung ist vorbei.",
        "SameLeague":"gleiche Liga",
        "CancelUnnecessaryDays":"Breche unnötige Tage ab",
        "DeleteSquadStrength":function(days,date){return 'Die Verein\'s Daten werden gelöscht, weil sie aufgezeichnet wurde <span style="color: #ff1a1a;font-weight:bold;">'+days+'</span> vor Tagen! Weil die Stärke von Fußballspielern nicht korrekt angezeigt werden kann.<br><span style="font-size: 12px;"><span style="color: #00ff93;font-weight:bold;margin-right:10px;">Registration date :</span><span style="color:white;">'+date+'</span></span>';},
        "HealthBonus":"Fitnessbonus (+5%)",
        "LeadershipBonus":"Spielführerbonus (+1%)",
        "FormationBonus":"Aufstellungsbonus (+10%)",
        "HomeBonus":"Heimvorteil (+2%)",
        "SquadStrength":"Mannschaftsstärke",
        "TotalSquadStrength":"gesamte Mannschaftsstärke",
        "SquadStrengthExceptBonuses":"Mannschaftsstärke ohne Bonus",
        "RegistrationDate":"Registrierungsdatum",
        "ShowHomeSquad":"Zeige Heimmannschaft",
        "ShowAwaySquad":"Zeige Auswärtsmannschaft",
        /*Untranslated section ->*/
        "RefreshPage":"Aktualisiere die Seite",
        "UpdateTheScriptInfo":function(a,b){return 'Eine neue Version des Tools steht zur Installation bereit: '+a+'klick hier'+b+'. Aktualisiere das Script über die geöffnete Seite und klick danach auf den unterstehenden Button.';},
        "NewVersion":"Neue Version",
        "CurrentVersion":"Aktuelle Version",
        "ReleasedVersion":function(newVersion){return 'Version '+newVersion+' wurde veröffentlicht.';},
        "SortTournaments":"sortiere die Turniere",
        "Team":"Team",
        "Full":"Vollständig",
        "Missing":"unvollständig",
        "SpecialThanks":"Special Thanks"
},
        "Polski" : {
        "Language":"Polski",
        "OtherLanguages" : {
            "English":"Angielski",
            "Turkish":"Turecki",
            "German":"Niemiecki"
        },
        "FeaturesName":{
            "ShowPublicRelations":"Zadowolenie kibiców",
            "ConstructionCountdown":"Odliczanie budowy",
            "ClubExchange":"Wymiana klubów",
            "PlayersHealth":"Zdrowie zawodników",
            "RankingOfPlayers":"Ranking graczy",
            "TrainingControl":"Kontrola treningu",
            "RematchMatch":"Mecz rewanżowy",
            "InviteSimulationMatch":"Zaproś na mecz symulacyjny",
            "AutomaticTraining":"Trening automatyczny",
            "TrainingGroups":"Grupy treningowe",
            "CampHistory":"Historia obozów treningowych",
            "TransferDates":"Początek okna transferowego",
            "GoOffer":"Przejdź do oferty, która została przyjęta.",
            "FilterTransferMarket":"Filtry rynku trasferowego",
            "FilterOwnOffers":"Filtruj własne oferty",
            "ShowOwnOfferInMarket":"Pokaż własną ofertę na rynku",
            "ShowBoughtPlayers":"Pokaż zakupionych graczy",
            "ShowStrengthChange":"Pokaż zmianę siły",
            "ShowRealStrength":"Pokaż prawdziwą siłę gracza",
            "CalculateNonYoungPlayersStrength":"Obliczanie siły seniorów",
            "YoungPlayersHistory":"Historia juniorów",
            "CalculatingStrengthOfYoungPlayer":"Obliczanie siły juniorów",
            "DownloadTable":"Pobierz tabelę",
            "AddImage":"Dodaj zdjęcie",
            "ShowEloRating":"Zobacz ranking ELO",
            "QuickShopping":"Szybkie zakupy",
            "ShowAsistantLevelIncrease":"Pokaż wzrost poziomu asystenta",
            "QuickBet":"Szybki zakład",
            "ShowSquadStrength":"Pokaż siłę drużyny" //*deaktiviert
        },
        "Skills" : [
            "Gra na przedpolu",
            "Pewność łapania piłki",
            "Lewa/prawa noga",
            "Sprawność ogólna",
            "Strzał",
            "Strzał głową",
            "Pojedynek",
            "Krycie",
            "Szybkość",
            "Podania",
            "Wytrzymałość",
            "Gotowość biegania",
            "Gra piłką",
            "Agresywność"
        ],
        "NeedNecessaryInformation":"Skrypt potrzebuje informacji do działania",
        "InformScriptWorking":"Skrypt działa poprawnie. Nie znaleziono zapisanych danych skryptu. Jest tak, ponieważ używasz skryptu po raz pierwszy lub pliki cookie zostały usunięte.",
        "HelpDataUploading":"Jeśli masz stare dane skryptu, prześlij je klikająć przycisk przesyłania:",
        "EnterClubInformation":"Wprowadź informacje o klubie",
        "ClubId":"Identyfikator klubu",
        "ClubName":"Nazwa klubu",
        "TrainerLevel":"Poziom trenera",
        "TrainerLevelS":"Poziom trenera",
        "SortLevel":"Poziom",
        "YoungTrainerLevel":"Poziom trenera juniorów",
        "YoungTrainerLevelS":"Trener Poz.",
        "ChooseTrainingSchedule":"Wybierz harmonogram szkoleń",
        "TrainingPlan":"Plan treningowy",
        "Confirm":"Potwierdź",
        "NotTranslated":"Ten tekst nie został jeszcze przetłumaczony!",
        "UploadDatas":"Prześlij dane",
        "NotDataExist":"Brak danych do pobrania!",
        "DataLoaded":"Dane skryptu zostały przesłane!",
        "ScriptMenuTitle":"FCup Script",
        "Version":"Wersja",
        "Explanation":"Wyjaśnienie",
        "Action":"Akcja",
        "DownloadData":"Pobierz dane",
        "Download":"Pobierz",
        "Load":"Wczytaj",
        "DeleteData":"Usuń dane",
        "DataCleared":"Dane zostały usunięte",
        "Delete":"Usuń",
        "GameLanguage":"Język gry",
        "Update":"Aktualizacja",
        "Features":"Cechy",
        "ScriptWriter":"Autor",
        "AskDeleteTheData":"Czy chcesz usunąć dane ze wszystkich serwerów?",
        "Age":"Wiek",
        "NewAge":"Nowy wiek",
        "aDay":"Dzień",
        "Days":"Dni",
        "NewFeature1":"Nowa dostępna funkcja:",
        "NewFeature2":"Funkcja nie jest aktywna. Przy następnej wizycie na tej stronie powinna już działać.",
        "PublicRelations":"Zadowolenie kibiców",
        "ItIsOver":"Do końca",
        "Stadium":"Stadion",
        "Loading":"Ładuje",
        "Buildings":"Budynki",
        "GoToStadium":"Idź na stadion",
        "GoToBuildings":"Idź do siedziby klubu",
        "ClubExchange":function(date,clubName){return "Ten gracz pójdzie do"+clubName+" do "+date+"!";},
        "RemainingTime":"Pozostały czas",
        "SaveHealth":"Zdrowie",
        "UpdateHealth":"Zaaktulizuj zdrowie",
        "Change":"Zmień",
        "SortPlayers":"Sortuj zawodników",
        "SaveNote":"Zapisz notatkę",
        "ClearField":"Wyczyść wszystko",
        "ClearedNote":"Uwaga usunięta.",
        "SavedNote":"Notatka zapisana.",
        "OpenNote":"Otwórz notatkę",
        "CloseNote":"Zamknij notatkę",
        "WriteANote":"Napisz notatkę!",
        "SimulationSendFail":"Symulacja nie powiodła się",
        "InviteSimulation":"Zaproś na mecz symulacyjny",
        "FaultyTrainingMessage":function(playerName,skillName){return playerName+' musi poprawić jego '+skillName+' umiejętność.';},
        "ImproveSkillTitle":function(skillName){return skillName+" umiejętność musi zostać poprawiona.";},
        "NoInformation":"brak informacji",
        "TrainingGroupInformation":function(CountOfPlayer){return CountOfPlayer + " Zawodnik(y) rozwija się w tej grupie treningowej";},
        "NoPlayersInTheGroup":"Tam są <label style='color:red;'>bez graczy</label> w tej grupie treningowej.",
        "NoRecord":"Brak zapisu",
        "AutomaticTraining":"Trening automatyczny : ",
        "PreviouslyVisitedCamps":"Wcześniejsze odwiedzane obozy",
        "No":"Nie",
        "Camp":"Obóz",
        "Country":"Państwo",
        "Price":"Cena",
        "_Skills":"Umiejętności",
        "Definition":"Definicja",
        "Date":"Data",
        "ServerDate":"Data serwera",
        "TransferDate":"Data transferu",
        "FootballersAreComing":"Piłkarze przychodzący",
        "TransferDateWillChange":"Data transferu zmieni się",
        "ShowOnlyOneLeague":"Pokaż tylko jedną ligę",
        "SelectLeague":"Wybierz ligę",
        "AllExceptGoalkeeper":"Wszyscy z wyjątkiem bramkarza",
        "ShowMyMarket":"Pokaż mój rynek",
        "FilterPlayerInformation":function(CountOfPlayers,showPlayerCount){return 'Ta strona się wyświetla'+showPlayerCount+' z '+CountOfPlayers+' gracze.';},
        "TodayOffers":"Dzisiejsze oferty",
        "AcceptedOffers":"Zaakceptowane oferty",
        "ReadingOffers":"Przeczytane oferty",
        "RejectedOffers":"Odrzucone oferty",
        "NewOffers":"Nowe oferty",
        "AcceptedOwnOffer":"Twoja oferta za zawodnika została zaakceptowana!",
        "RejectedOwnOffer":"Twoja oferta za zawodnika została odrzucona!",
        "ReadOwnOffer":"Twoja oferta została przeczytana.",
        "NewOwnOffer":"Jest nowa oferta.",
        "PassedOwnOffer":"Twoja oferta minęła!",
        "SimulationRequestAvailable":"Rewanż gry symulacynej jest dostępny",
        "SimulationRequestSent":"Wysłano rewanżowy mecz symulacyjny",
        "ListofPurchasedFootballers":"Lista zakupionych graczy",
        "Name":"Nazwa",
        "Position":"Pozycja",
        "SortPosition":"Poz.",
        "Salary":"Wynagrodzenie",
        "Contract":"Kontrakt",
        "Club":"Klub",
        "Season":"Sezon",
        "Seasons":"Sezony",
        "ChooseNotebook":"Wybierz notebook!",
        "UploadPlayersData":"Prześlij dane gracza",
        "Warning":"Bądź ostrożny !!!!!! \ Jeżeli będziesz kontynuować, dane kupionego gracza zostaną usunięte!",
        "Loss":"Utrata",
        "Gain":"Zdobyć",
        "ChoosePlayer":"Wybierz zawodnika",
        "CalculateNonYoungPlayersStrength":"Oblicz siłę seniorów",
        "ChooseAge":"Wybierz wiek",
        "Training":"Trening",
        "NonCreditTraining":"Bez Credits",
        "CreditTraining":"Credits",
        "Now":"TERAZ",
        "SuccessfullyTransferred":function(playerName){return "Twój piłkarz został pomyślnie przeniesiony"+playerName+" do twojego klubu!";},
        "RemainingNextAgeDay":function(day){return 'Następny wiek pozostanie '+day+' dzień (dni) a młodzież się skończy.';},
        "RemainingNumberOfCreditTraining":"Pozostała liczba szkoleń kredytowych",
        "RemainingNumberOfNormalTraining":"Pozostała liczba normalnego treningu",
        "EndYouth":function(remainingDays,date){return 'po '+remainingDays+' dzień (dni) młodzież się skończy '+date;},
        "AfterTrainings":function(trainings){return 'po ' + trainings+ ' szkolenie (szkolenia)';},
        "TitleOfYoungPlayersTable":"Młodzi zawodnicy przychodzą do klubu do dziś",
        "DownloadTable":"Pobierz tabelę!",
        "LeagueTable":"Tabele ligowe",
        "MatchResultsTable":"Dopasuj tabelę wyników",
        "SquadStrengthTable":"Tabela siły drużyny",
        "GoalScorerTable":"Tabela królów strzelców",
        "EnterImageLink":"Wprowadź link do zdjęcia",
        "AddImage":"Dodaj zdjęcie",
        "EloRank":"Rabking ELO",
        "FillAll":"Wypełnij wszystko",
        "EmptyAll":"Opróżnij wszystko",
        "Ordering":"Zamówienie",
        "SeminarIsOver":"Seminarium jest zakończone.",
        "SameLeague":"Ta sama liga",
        "CancelUnnecessaryDays":"Anuluj niepotrzebne dni",
        "DeleteSquadStrength":function(days,date){return 'Dane tego zespołu zostały usunięte, ponieważ zostały zarejestrowane <span style="color: #ff1a1a;font-weight:bold;">'+days+'</span> kilka dni temu! Ponieważ moc piłkarzy nie może być wyświetlana poprawnie.<br><span style="font-size: 12px;"><span style="color:#00ff93;font-weight:bold;margin-right:10px;">Data rejestracji :</span><span style="color:white;">'+date+'</span></span>';},
        "HealthBonus":"Bonus zdrowia (+5%)",
        "LeadershipBonus":"Bonus prowadzącego (+1%)",
        "FormationBonus":"Bonus ustawienia (+10%)",
        "HomeBonus":"Bonus gospodarza (+2%)",
        "SquadStrength":"Siła składu",
        "TotalSquadStrength":"Całkowita siła drużyny",
        "SquadStrengthExceptBonuses":"Siła drużyny bez premii",
        "RegistrationDate":"Data rejestracji",
        "ShowHomeSquad":"Pokaż drużynę na mecze domowe",
        "ShowAwaySquad":"Pokaż drużynę na mecze wyjazdowe",
        "RefreshPage":"Odśwież stronę",
        "UpdateTheScriptInfo":function(a,b){return 'Jeśli chcesz zaktualizować skrypt, '+a+'Kliknij tutaj'+b+'.Zaktualizuj skrypt ze strony, która się otworzy. Następnie odśwież tę stronę!! (F5 lub przycisk odświeżania)';},
        "NewVersion":"Nowa wersja",
        "CurrentVersion":"Obecna wersja",
        "ReleasedVersion":function(newVersion){return 'Wersja '+newVersion+' skrypt FCup został wydany!!!';},
        "SortTournaments":"Sortuj turnieje",
        "Team":"Zespół",
        "Full":"Pełny",
        "Missing":"Brakujący"
  }
};
var _scriptTexts;
var alternativeTexts = scriptTexts[scriptData.alternativeLanguage];
PageLoad(start);
function start(){
    if(typeof serverTime!=="number" || $('#ChangeContent').length){
        return;
    }
    /* var cookies = GM_listValues();
     console.clear();
     for(var i = 0 ; i < cookies.length ; i++){
         console.log('Key : ' + cookies[i]);
         console.log(GM_getValue(cookies[i]));
         console.log('');
     }*/
    svTime = serverTime;
    svTimeRDate = parseInt(new Date().getTime()/1000);
    PageLoad(function(){
        var server = $('#body').attr('class').replace(' loading','');
        if(gameVeriables[server]===undefined){
            GiveNotification(false,"This server is not available in the script!");
            return;
        }
        gameVeriables = gameVeriables[server];
        for(var i in gameVeriables){
            scriptData[i] = gameVeriables[i];
        }
        gameVeriables = undefined;
        scriptData.TimeDifference = (new Date().getTimezoneOffset()-moment.tz.zone(scriptData.zone).utcOffset(new Date().getTime()))*60;
        svTime += scriptData.TimeDifference;
        _scriptTexts = scriptTexts;
        /**/
        var userLanguage = GM_getValue('userLanguage')==undefined?{}:GM_getValue('userLanguage');
        if(scriptTexts[userLanguage[server]]==undefined){
            if(scriptTexts[scriptData.language])
                scriptTexts = scriptTexts[scriptData.language];/*Server dili seçiliyor*/
            else{
                scriptData.language = scriptData.alternativeLanguage;
                scriptTexts = scriptTexts[scriptData.alternativeLanguage];/*Alternatif dil[İngilizce] seçiliyor*/
                GiveNotification(true,"This script hasn't yet been translated into "+scriptData.language+"!<br>Alternative language["+scriptTexts.Language+"] selected!");
            }
        }
        else{
            scriptTexts = scriptTexts[userLanguage[server]];/*Kullanıcı dili seçiliyor*/
            scriptData.language = userLanguage[server];
        }
        /**/
        scriptData.server = server;
        if(GetCookie('FeaturesOfScript'))
            scriptData.FeaturesOfScript = GetCookie('FeaturesOfScript');
        var clubDatas = GetCookie('clubDatas');
        if(typeof clubDatas == "undefined"){
            var Title =
                '<st k="NeedNecessaryInformation">'+scriptTexts.NeedNecessaryInformation+'</st>'+
                '<img src="'+sources.get('unhappy','png')+'" alt="unhappy" height="25px" style="position:absolute;margin: 4px 0 4px 5px;">';
            var Content =
                '<p style="color:red;margin-Bottom:10px;font-weight:bold;text-align:left;font-size:12px;">'+
                '<st k="InformScriptWorking">'+scriptTexts.InformScriptWorking+'</st>'+
                '</p>'+
                '<p style="color:blue;font-weight:bold;text-align:left;font-size:12px;margin-Bottom:10px;">'+
                '<st k="HelpDataUploading">'+scriptTexts.HelpDataUploading+'</st>'+
                '</p>'+
                '<p style="text-align:center;margin-bottom:25px;">'+
                CreateButton('UploadDatas','<st k="UploadDatas">'+scriptTexts.UploadDatas+'</st> !')+
                '</p>'+
                '<h3>'+
                '<st k="EnterClubInformation">'+scriptTexts.EnterClubInformation+'</st>'+' :'+
                '</h3>'+
                '<table style="width:280px;margin:0 auto 15px auto;border-radius:6px;color:#111b9c;background-color:white;box-shadow: 5px 10px 8px #3939398c;">'+
                '<tbody>'+
                '<tr class="odd">'+
                '<td style="border:0;text-align:center;padding-Left:5px;">'+
                '<st k="TrainerLevel">'+scriptTexts.TrainerLevel+'</st>'+
                '</td>'+
                '<td style="border:0;">'+
                '<label class="menü">'+
                '<select id="AntrenörSeviyesi1" style="font-size:12px;width:55px;margin:0 auto;text-align-last: center;">'+
                '<option value="10" k="SortLevel" selected>10 '+scriptTexts.SortLevel+'</option>'+
                '<option value="9" k="SortLevel">9 '+scriptTexts.SortLevel+'</option>'+
                '<option value="8" k="SortLevel">8 '+scriptTexts.SortLevel+'</option>'+
                '<option value="7" k="SortLevel">7 '+scriptTexts.SortLevel+'</option>'+
                '<option value="6" k="SortLevel">6 '+scriptTexts.SortLevel+'</option>'+
                '<option value="5" k="SortLevel">5 '+scriptTexts.SortLevel+'</option>'+
                '<option value="4" k="SortLevel">4 '+scriptTexts.SortLevel+'</option>'+
                '<option value="3" k="SortLevel">3 '+scriptTexts.SortLevel+'</option>'+
                '<option value="2" k="SortLevel">2 '+scriptTexts.SortLevel+'</option>'+
                '<option value="1" k="SortLevel">1 '+scriptTexts.SortLevel+'</option>'+
                '<option value="0" k="SortLevel">0 '+scriptTexts.SortLevel+'</option>'+
                '</select>'+
                '</label>'+
                '</td>'+
                '</tr>'+
                '<tr class="even">'+
                '<td style="border:0;border-radius:6px 0 0 6px;text-align:center;padding-Left:5px;">'+
                '<st k="YoungTrainerLevel">'+scriptTexts.YoungTrainerLevel+'</st>'+
                '</td>'+
                '<td style="border:0;border-radius:0 6px 6px 0;">'+
                '<label class="menü">'+
                '<select id="GAntrenörSeviyesi1" style="font-size:12px;width:55px;margin:0 auto;text-align-last: center;">'+
                '<option value="10" k="SortLevel" selected>10 '+scriptTexts.SortLevel+'</option>'+
                '<option value="9" k="SortLevel">9 '+scriptTexts.SortLevel+'</option>'+
                '<option value="8" k="SortLevel">8 '+scriptTexts.SortLevel+'</option>'+
                '<option value="7" k="SortLevel">7 '+scriptTexts.SortLevel+'</option>'+
                '<option value="6" k="SortLevel">6 '+scriptTexts.SortLevel+'</option>'+
                '<option value="5" k="SortLevel">5 '+scriptTexts.SortLevel+'</option>'+
                '<option value="4" k="SortLevel">4 '+scriptTexts.SortLevel+'</option>'+
                '<option value="3" k="SortLevel">3 '+scriptTexts.SortLevel+'</option>'+
                '<option value="2" k="SortLevel">2 '+scriptTexts.SortLevel+'</option>'+
                '<option value="1" k="SortLevel">1 '+scriptTexts.SortLevel+'</option>'+
                '<option value="0" k="SortLevel">0 '+scriptTexts.SortLevel+'</option>'+
                '</select>'+
                '</label>'+
                '</td>'+
                '</tr>'+
                '</tbody>'+
                '</table>'+
                '<h3><st k="ChooseTrainingSchedule">'+scriptTexts.ChooseTrainingSchedule+'</st> :</h3>'+
                '<div style="background-Color:#38342e;width:562px;padding:5px 2px;border-radius:6px;margin-Bottom:10px;">'+
                '<p style="font-size:12px;user-select:none;color:white;background-Color: #0a0a10;padding:5px 0;border-radius:7px;margin:0 5px 15px 5px;text-align:center;">'+
                '<label for="trainingPlan-1" style="cursor:pointer;background-Color: #231b1b;padding:3px;margin-Right:10px;border-radius:6px;">'+
                '<st k="TrainingPlan">'+scriptTexts.TrainingPlan+'</st> 1 : '+
                '<input type="radio" name="trainingPlans" class="trainingPlans" id="trainingPlan-1" style="cursor:pointer;vertical-align:middle;margin:0;" checked="">'+
                '</label>'+
                '<label for="trainingPlan-2" style="cursor:pointer;background-Color:#231b1b;padding:3px;margin-Right:10px;border-radius:6px;">'+
                '<st k="TrainingPlan">'+scriptTexts.TrainingPlan+'</st> 2 : '+
                '<input type="radio" name="trainingPlans" class="trainingPlans" id="trainingPlan-2" style="cursor:pointer;vertical-align:middle;margin:0;">'+
                '</label>'+
                '<label for="trainingPlan-3" style="cursor:pointer;background-Color:#231b1b;padding:3px;border-radius:6px;">'+
                '<st k="TrainingPlan">'+scriptTexts.TrainingPlan+'</st> 3 : '+
                '<input type="radio" name="trainingPlans" class="trainingPlans" id="trainingPlan-3" style="cursor:pointer;vertical-align:middle;margin:0;">'+
                '</label>'+
                '</p>'+
                '<label id="optionsText">'+
                CreateTrainingPlan(0)+
                '</label>'+
                '</div>'+
                '<p style="text-align:center;">'+
                CreateButton('butonOnayla','<st k="Confirm">'+scriptTexts.Confirm+'</st> !')+
                '</p>';
            ShowDialog(Title,Content);
            $('.trainingPlans').change(function(){
                $('#optionsText').html(CreateTrainingPlan(parseInt($(this)[0].id.split('-')[1])-1));
            });
            $('#butonOnayla').click(function(){
                $(this).off();
                var span = $(this).find('span:last');
                var html = span.html();
                span.html('<img src="/designs/redesign/images/icons/loading/16x16.gif" style="margin-top: -1px;">');
                var clubId,
                    clubName,
                    clubDatas = {
                        "clubId":undefined,
                        "clubName":undefined,
                        "trainerLevel":parseInt($('#AntrenörSeviyesi1').val()),
                        "yTrainerLevel":parseInt($('#GAntrenörSeviyesi1').val()),
                        "trainingProgram":parseInt($('.trainingPlans:checked')[0].id.split('-')[1]-1)
                    };
                var self = $('.self-link');
                if(self.length){
                    clubId = $('.self-link').first().attr('clubid');
                    clubName = $('.self-link').first().text().trim();
                    load();
                }
                else{
                    getPageData('#/index.php?w='+worldId+'&area=user&module=profile&action=show','profile-show',function(html){
                        clubId = $(html).find('div.container.profile-trophy > div.profile > ul.profile-box-club > li:nth-child(2) > a')[0].href;
                        var b = clubId.indexOf('clubId=')+7;
                        clubId = clubId.substring(b,clubId.indexOf('&',b));
                        clubName = $(html).find('h2').first().text().replace(scriptData.replaceClubName,'').trim();
                        load();
                    });
                }
                function load(){
                    span.html(html);
                    clubDatas.clubId = clubId;
                    clubDatas.clubName = clubName;
                    for(var i in clubDatas){
                        scriptData[i] = clubDatas[i];
                    }
                    SetCookie('clubDatas',clubDatas);
                    closeFocus({target: $('.close')});
                    showScriptMenu();
                }
            });
            $('#UploadDatas').click(function(){
                UploadData(
                    function(cookiesText){
                        cookiesText = cookiesText.split('CookieKey&:');
                        cookiesText.splice(0,1);
                        for(var i = 0 ; i < cookiesText.length ; i++){
                            var b = cookiesText[i].indexOf(':');
                            var key = cookiesText[i].substring(0,b);
                            var data = cookiesText[i].substring(b+1);
                            if(GM_getValue(key)===undefined){
                                GM_setValue(key,JSON.parse(data));
                            }
                            /*else{
                                if(JSON.stringify(GM_getValue(key))===data){
                                    console.log('Kayıt etmeye gerek yok!');
                                }
                                else{
                                    console.log('Karşılaştırılma yapılmalı ');
                                }
                            }*/
                        }
                        GiveNotification(true,'<st k="DataLoaded">'+scriptTexts.DataLoaded+'</st>');
                        location.reload();
                    }
                );
            });
        }
        else{
            for(var i in clubDatas){
                scriptData[i] = clubDatas[i];
            }
            showScriptMenu();
        }
        function showScriptMenu(){
            $('html, body').animate({ scrollTop: 0 }, 'fast');
            var add =
                '<div class="box" id="ScriptMenu">'+
                '<h2><st k="ScriptMenuTitle">'+scriptTexts.ScriptMenuTitle+'</st></h2>'+
                '<table class="table">'+
                '<thead>'+
                '<tr>'+
                '<th><st k="Explanation">'+scriptTexts.Explanation+'</st></th>'+
                '<th><st k="Action">'+scriptTexts.Action+'</st></th>'+
                '</tr>'+
                '</thead>'+
                '<tbody>'+
                '<tr class="odd">'+
                '<td><st k="DownloadData">'+scriptTexts.DownloadData+'</st>'+
                '</td>'+
                '<td>'+CreateButton('downloadCookies','<st k="Download">'+scriptTexts.Download+'</st>','','width:35px;')+'</td>'+
                '</tr>'+
                '<tr class="even">'+
                '<td><st k="UploadDatas">'+scriptTexts.UploadDatas+'</st>'+
                '</td>'+
                '<td>'+CreateButton('uploadCookies','<st k="Load">'+scriptTexts.Load+'</st>','','width:35px;')+'</td>'+
                '</tr>'+
                '<tr class="odd">'+
                '<td><st k="DeleteData">'+scriptTexts.DeleteData+'</st>'+
                '</td>'+
                '<td>'+CreateButton('removeCookies','<st k="Delete">'+scriptTexts.Delete+'</st>','','width:35px;')+'</td>'+
                '</tr>'+
                '<tr class="even">'+
                '<td><st k="GameLanguage">'+scriptTexts.GameLanguage+'</st>'+
                '</td>'+
                '<td>'+
                '<label class="menü">'+
                '<select id="gameLanguage" style="width:69px;margin:0 auto;text-align-last: center;">'+
                '<option selected value="'+scriptData.language+'" >'+scriptTexts.Language+'</option>'+
                '</select>'+
                '</label>'+
                '</td>'+
                '</tr>'+
                '</tbody>'+
                '<tbody id="ExtraFeatures" style="display:none;">'+
                '<tr class="odd">'+
                '<td><st k="TrainerLevelS">'+scriptTexts.TrainerLevelS+'</st>'+
                '</td>'+
                '<td>'+
                '<label class="menü">'+
                '<select id="AntrenörSeviyesi" k="trainerLevel" oldvalue="'+scriptData.trainerLevel+'" style="width:55px;margin:0 auto;text-align-last: center;">'+
                '<option value="10" selected>10 '+scriptTexts.SortLevel+'</option>'+
                '<option value="9">9 '+scriptTexts.SortLevel+'</option>'+
                '<option value="8">8 '+scriptTexts.SortLevel+'</option>'+
                '<option value="7">7 '+scriptTexts.SortLevel+'</option>'+
                '<option value="6">6 '+scriptTexts.SortLevel+'</option>'+
                '<option value="5">5 '+scriptTexts.SortLevel+'</option>'+
                '<option value="4">4 '+scriptTexts.SortLevel+'</option>'+
                '<option value="3">3 '+scriptTexts.SortLevel+'</option>'+
                '<option value="2">2 '+scriptTexts.SortLevel+'</option>'+
                '<option value="1">1 '+scriptTexts.SortLevel+'</option>'+
                '<option value="0">0 '+scriptTexts.SortLevel+'</option>'+
                '</select>'+
                '</label>'+
                '</td>'+
                '</tr>'+
                '<tr class="even">'+
                '<td><st k="YoungTrainerLevelS">'+scriptTexts.YoungTrainerLevelS+'</st>'+
                '</td>'+
                '<td>'+
                '<label class="menü">'+
                '<select id="GAntrenörSeviyesi" k="yTrainerLevel" oldvalue="'+scriptData.yTrainerLevel+'" style="width:55px;margin:0 auto;text-align-last: center;">'+
                '<option value="10" selected>10 '+scriptTexts.SortLevel+'</option>'+
                '<option value="9">9 '+scriptTexts.SortLevel+'</option>'+
                '<option value="8">8 '+scriptTexts.SortLevel+'</option>'+
                '<option value="7">7 '+scriptTexts.SortLevel+'</option>'+
                '<option value="6">6 '+scriptTexts.SortLevel+'</option>'+
                '<option value="5">5 '+scriptTexts.SortLevel+'</option>'+
                '<option value="4">4 '+scriptTexts.SortLevel+'</option>'+
                '<option value="3">3 '+scriptTexts.SortLevel+'</option>'+
                '<option value="2">2 '+scriptTexts.SortLevel+'</option>'+
                '<option value="1">1 '+scriptTexts.SortLevel+'</option>'+
                '<option value="0">0 '+scriptTexts.SortLevel+'</option>'+
                '</select>'+
                '</label>'+
                '</td>'+
                '</tr>'+
                '<tr style="height:20px;line-height:20px;display:none;" k="0">'+
                '<td colspan="2" style="text-align:center;">'+
                '<span class="button" id="saveChangeProperties">'+
                '<a class="button" style="margin:0;font-Size:13px;text-decoration: none;cursor:pointer;">'+
                '<span style="padding:3px 8px;width:43px;"><st k="Update">'+scriptTexts.Update+'</st></span>'+
                '</a>'+
                '</span>'+
                '</td>'+
                '</tr>'+
                '</tbody>'+
                '<tfoot>'+
                '<tr style="line-height:10px;height:10px;">'+
                '<td colspan="2">'+
                '<p style="width: 60px;border-top:1px solid gray;margin:0 auto 2px;">'+
                '<img id="özellikAcKapa" a="1" src="'+sources.get('show','png')+'" alt="show" width="15px" style="cursor:pointer;margin-top:2px;">'+
                '</p>'+
                '</td>'+
                '</tr>'+
                '</tfoot>'+
                '</table>';
            add+=
                '<table class="table" style="margin-Top:10px;display:none;table-layout:fixed;" id="FeaturesOfScript">'+
                '<thead>'+
                '<tr style="background:none;">'+
                '<th width="60%"><st k="Features">'+scriptTexts.Features+'</st></th>'+
                '<th><st k="Action">'+scriptTexts.Action+'</st></th>'+
                '</tr>'+
                '</thead>'+
                '<tbody>'+
                '</tbody>'+
                '</table>';
            add+=
                '<div style="font-family:Comic Sans MS;color:white;font-weight:bold;background-color:black;margin:15px -5px -5px;border-radius: 0 0 6px 6px;padding:5px 0;text-align:center;">'+
                '<p style="font-size:12px;margin:0;">'+
                '<style="font-size:10px;margin:0;">'+
                '<label><st k="ScriptWriter">'+scriptTexts.ScriptWriter+'</st> : </label><a href="#/index.php?w='+worldId+'&amp;area=user&amp;module=profile&amp;action=show&amp;clubId='+scriptData.ScriptAuthorClubId+'" style="color:#14ffff;text-decoration:none;cursor:pointer;font-size: 10px;">Criyessei | mot33</a>'+
                '</p>'+
                '</div>'+
                '</div>'
            $('#section-inner-container').after(add);
            var OtherLanguages = scriptTexts.OtherLanguages;
            for(var langKey in OtherLanguages){
                $('#gameLanguage').append('<option value="'+langKey+'">'+OtherLanguages[langKey]+'</option>');
            }
            $('#gameLanguage').change(function(){
                this.disabled = true;
                this.style.cursor = 'not-allowed';
                var language = this.value;
                scriptData.language = language;
                scriptTexts = _scriptTexts[language];
                /**/
                $('st').each(function(){
                    var k = $(this).attr('k');
                    var t = scriptTexts[k];
                    if(t)
                        $(this).html(t);
                    else{
                        t = alternativeTexts[k];
                        if(t)
                            $(this).html('<font style="border-bottom: 1px dashed; cursor: help;font-style:italic;" title="'+scriptTexts.NotTranslated+'">'+t+'</font>');
                        else
                            $(this).html('<font style="background-color:black;color:red;border-radius:6px;border:1px solid red;padding:4px;font-size:10px;">No Text!</font>');
                    }
                });
                $('#AntrenörSeviyesi > option').add($('#GAntrenörSeviyesi > option')).each(function(){
                    $(this).text(this.value+' '+scriptTexts.SortLevel+(this.textContent.endsWith(' *')?' *':''));
                });
                var OtherLanguages = scriptTexts.OtherLanguages;
                var o = $('#gameLanguage')[0].selectedIndex;
                $('#gameLanguage > option').each(function(i){
                    if(i!=o)
                        $(this).text(OtherLanguages[$(this).val()]);
                    else
                        $(this).text(scriptTexts.Language);
                });
                $('#FeaturesOfScript > tbody > tr').each(function(){
                    var l = $(this).find('label').first();
                    l.html(scriptTexts.FeaturesName[l.attr('k')]);
                });
                $('#feedback > p.notice > font').each(function(){
                    if(k = $(this).attr('k')){
                        $(this).text(scriptTexts.FeaturesName[k]);
                    }
                });
                /**/
                var userLanguage = GM_getValue('userLanguage')==undefined?{}:GM_getValue('userLanguage');
                userLanguage[scriptData.server] = language;
                GM_setValue('userLanguage',userLanguage);
                this.disabled = false;
                this.style.cursor = '';
            });
            $('#AntrenörSeviyesi').val(scriptData.trainerLevel);
            $('#AntrenörSeviyesi > option:selected')[0].innerHTML+=' *';
            $('#GAntrenörSeviyesi').val(scriptData.yTrainerLevel);
            $('#GAntrenörSeviyesi > option:selected')[0].innerHTML+=' *';
            $('#özellikAcKapa').click(function(){
                var e = $('#ExtraFeatures');
                var o = $(this);
                var k = o.attr('a');
                o.attr('src',sources.get(k==1?'hide':'show','png'));
                o.attr('alt',k==1?'hide':'show');
                e.toggle();
                o.attr('a',k==1?2:1);
            });
            $('#AntrenörSeviyesi').add($('#GAntrenörSeviyesi')).change(function(){
                var currentValue = $(this).val(),
                    tr = $('#saveChangeProperties').parents('tr').first();
                scriptData[$(this).attr('k')] = parseInt(currentValue);
                tr.attr('k',parseInt(tr.attr('k'))+(currentValue == $(this).attr('oldvalue')?-1:1));
                console.log(tr.attr('k'));
                tr[tr.attr('k')==0?'hide':'show']();
            });
            $('#saveChangeProperties').click(function(){
                $(this).parents('tr').first().hide();
                var clubDatas = GetCookie('clubDatas');
                clubDatas.trainerLevel = scriptData.trainerLevel;
                clubDatas.yTrainerLevel = scriptData.yTrainerLevel;
                SetCookie('clubDatas',clubDatas);
                location.reload();
            });
            $('#downloadCookies').click(function(){
                var cookies = GM_listValues();
                var cookiesText = '';
                for(var i = 0 ; i < cookies.length ; i++){
                    var ekle = '';
                    var veri = GM_getValue(cookies[i]);
                    if(!veri){
                        continue;
                    }
                    if(Array.isArray(veri)){
                        ekle = returnArrayString(veri);
                    }
                    else{
                        ekle = JSON.stringify(veri);
                    }
                    cookiesText +='CookieKey&:'+cookies[i]+':'+ekle+'\n\n';
                }
                if(cookiesText.trim()!==""){
                    DownloadData('Fcup Script Data',cookiesText);
                }
                else{
                    GiveNotification(false,'<st k="NotDataExist">'+scriptTexts.NotDataExist+'</st>');
                }
                function returnArrayString(array){
                    var o = '[';
                    for(var i = 0 ; i < array.length ; i++){
                        var k = '';
                        if(Array.isArray(array[i])){
                            k = returnArrayString(array[i]);
                        }
                        else{
                            k = JSON.stringify(array[i]);
                        }
                        o+=k+',';
                    }
                    o = o.substring(0,o.length-1)+']';
                    return o;
                }
            });
            $('#uploadCookies').click(function(){
                UploadData(cookieKayıtEt);
                function cookieKayıtEt(cookiesText){
                    cookiesText = cookiesText.split('CookieKey&:');
                    cookiesText.splice(0,1);
                    for(var i = 0 ; i < cookiesText.length ; i++){
                        var b = cookiesText[i].indexOf(':');
                        var key = cookiesText[i].substring(0,b);
                        var data = cookiesText[i].substring(b+1);
                        if(!GM_getValue(key)){
                            GM_setValue(key,JSON.parse(data));
                        }
                        /*else{
                            if(JSON.stringify(GM_getValue(key))===data){
                                console.log('Kayıt etmeye gerek yok!');
                            }
                            else{
                                console.log('Karşılaştırılma yapılmalı ');
                            }
                        }*/
                    }
                    GiveNotification(true,'<st k="DataLoaded">'+scriptTexts.DataLoaded+'</st>!!');
                    location.reload();
                }
            });
            $('#removeCookies').click(function(){
                if(confirm(scriptTexts.AskDeleteTheData)){
                    var cookies = GM_listValues();
                    for(var i = 0 ; i < cookies.length ; i++){
                        GM_deleteValue(cookies[i]);
                    }
                    GiveNotification(true,'<st k="DataCleared">'+scriptTexts.DataCleared+'</st>');
                    location.reload();
                }
            });
            /*Version Control*/
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://greasyfork.org/de/scripts/372395-fcup-script-polnish-server-test.meta",
                onload: function(response) {
                    var text = response.responseText;
                    var b = text.indexOf('@version')+8;
                    var b1 = text.indexOf('/',b);
                    var version = text.substring(b,b1).trim();
                    var currentVersion = GM_info.script.version;
                    if(version>currentVersion){
                        ShowDialog(
                            '<span class="icon" style="background:url(/designs/redesign/images/layout/icons_sprite.png?v=2.2.6.14231) 0 -1180px no-repeat;margin-Right:10px;float:left;margin:6px;">'+
                            '</span>'+scriptTexts.ReleasedVersion(version),
                            '<img src="https://image.ibb.co/jrcFap/Untitled.png" style="height: 73px;float:left;margin: -15px 0 0 -15px;">'+
                            '<p style="font-size:15px;margin-Bottom:10px;font-weight: bold;color:red;text-align:center;"><st k="CurrentVersion">'+scriptTexts.CurrentVersion+'</st> '+currentVersion+
                            '<label style="color:green;margin-Left:50px"><st k="NewVersion">'+scriptTexts.NewVersion+'</st> : '+version+'</label></p>'+
                            '<p style="font-size:14px;font-weight: bold;color:blue">'+
                            scriptTexts.UpdateTheScriptInfo('<a href=https://greasyfork.org/de/scripts/372395-fcup-script-polnish-server-test" style="font-size:14px">','</a>')+
                            '</p>'+
                            '<p style="text-align:center;width="515px" style="-webkit-border-radius: 15px;margin-Top:15px;"></p>'+
                            '<p style="margin-Top:20px;text-align:center;">'+CreateButton('relaodPage','<st k="RefreshPage">'+scriptTexts.RefreshPage+'</st>')+'</p>',
                            null
                        );
                        $('#relaodPage').click(function(){
                            location.reload();
                        });
                    }
                    else
                        console.log('[Version control] => %cVersion up to date.','color:green;');
                },
                onerror: function() {
                    console.log('[Version control] => %cFail!','color:red;');
                }
            });
            /*Save plObj*/
            $.get('index.php?area=user&module=formation&action=index&path=index.php&layout=none',function(response) {
                var r = response.content;
                var b = r.indexOf('var plObj');
                if(b!==-1){
                    b = r.indexOf('{',b);
                    playerObject = JSON.parse(r.substring(b,r.indexOf('};',b)+1));
                    playerObject = jQuery.isPlainObject(playerObject)?playerObject:undefined;
                }
            });
            if(!$('#FormationFunction').length){
                var codes = Formation.toString();
                var b = codes.indexOf('var instance = this;');
                var position = scriptData.footballerPositions;
                codes = codes.substring(0,b)+'\n'+'var mevkiPozisyonları = { "'+position.Position2+'":{ "7_0":1, "8_0":1, "9_0":1, "7_1":1, "8_1":1, "9_1":1, "7_3":1, "8_3":1, "9_3":1, "7_4":1, "8_4":1, "9_4":1}, "'+position.Position3+'":{ "7_1":1, "8_1":1, "9_1":1, "7_2":1, "8_2":1, "9_2":1, "7_3":1, "8_3":1, "9_3":1}, "'+position.Position4+'":{ "5_1":1, "6_1":1, "7_1":1, "5_2":1, "6_2":1, "7_2":1, "5_3":1, "6_3":1, "7_3":1}, "'+position.Position5+'":{ "3_0":1, "4_0":1, "5_0":1, "6_0":1, "3_1":1, "4_1":1, "5_1":1, "6_1":1}, "'+position.Position6+'":{ "3_3":1, "4_3":1, "5_3":1, "6_3":1, "3_4":1, "4_4":1, "5_4":1, "6_4":1}, "'+position.Position7+'":{ "2_1":1, "3_1":1, "4_1":1, "2_2":1, "3_2":1, "4_2":1, "2_3":1, "3_3":1, "4_3":1}, "'+position.Position8+'":{ "0_0":1, "1_0":1, "2_0":1, "0_1":1, "1_1":1, "2_1":1, "0_2":1, "1_2":1, "2_2":1, "0_3":1, "1_3":1, "2_3":1, "0_4":1, "1_4":1, "2_4":1} };'+'\n'+codes.substring(b);
                b = codes.indexOf('formationSquadObject.setDragElement($(this));');
                var controlPosition = position.Position1;
                codes = codes.substring(0,b)+'\n'+'var mevki = $(this).find(".position").text().trim(); if(mevki!=="'+controlPosition+'"){ var positions = mevkiPozisyonları[mevki]; for(var pos in positions){ if(pos!=="top"){ $("#Positions_"+pos)[0].style="background-color: #84d3848c"; } } }else{ $("#positions-goalie")[0].style="background-color: #84d3848c";}'+'\n'+codes.substring(b);
                b = codes.indexOf('formationSquadObject.removeDragElement();',b);
                codes = codes.substring(0,b)+'\n'+'var mevki = $(this).find(".position").text().trim(); if(mevki!=="'+controlPosition+'"){ var positions = mevkiPozisyonları[mevki]; for(var pos in positions){$("#Positions_"+pos)[0].style="";} } else{$("#positions-goalie")[0].style="";}'+'\n'+codes.substring(b);
                var script = document.createElement('script');
                script.id = 'FormationFunction';
                script.innerHTML = codes;
                $(document.head).append(script);
            }
            if(!$('#LiveFunction').length){
                $('#body').append('<input type="button" style="display:none;" id="NewMatchEvents">');
                $("#NewMatchEvents").click(function(){
                    var event = JSON.parse($(this).attr('k'));
                    console.log(event);
                    if(event.message) {
                        if(event.special === 'penaltyStart') {/*Penaltı atışları*/
                        }
                        if(event.special === 'overtimeStart') {/*90 artılar*/
                        }
                        /*if(event['lastActiveMinute']) {
                        }*/
                        if(event.type == 'goal' ||
                           event.type == 'penalty' ||
                           (event.type == 'penaltyShootout' && event.goal == 'goal')) {
                            if(currentLive.lastActiveMin < 120) { // GOOOOALL : event['team']
                                if(currentLive.ownMatch && event.team == currentLive.ownSquad){
                                    goalSound.currentTime = 0;
                                    goalSound.play();
                                }
                            }
                        }
                        else if(event['type'] == 'change' && event['squad'] != currentLive.ownSquad) {
                            /*var outPl = $('#field-player-' + event['out']);
                            var inPl = $('#field-player-' + event['in']);
                            // do not change position if player already on final position, e.g. after reload
                            if(inPl.parent('#opponent-bank').length) {
                                var outPlPos = outPl.parent();
                                var inPlPos = inPl.parent();
                                outPlPos.append(inPl);
                                inPlPos.append(outPl);
                            }*/
                        }
                        else if(event.type == 'info'){
                            var min = event.min;
                            var whistle = eval('whistle'+(min==1?1:min==45?2:event.action=='end'?3:2));
                            whistle.currentTime = 0;
                            whistle.play();
                        }
                        if(event['type'] == 'change') {
                            /*if (currentLive.players[event['squad']][event['out']]['a_position'] == 'NONE' || currentLive.players[event['squad']][event['out']]['a_position'] == 'TW') {
                                currentLive.players[event['squad']][event['in']]['a_position'] = currentLive.players[event['squad']][event['out']]['a_position'];
                                currentLive.players[event['squad']][event['out']]['a_position'] = 'Bank';
                            }*/
                        }
                    }
                    if(event.type == 'penaltyShootout') {
                        if (event['goal'] == 'goal') {
                        }
                    }
                    if(event.type == 'red' || event.type == 'yellow' || event.type == 'yellow_red') {
                        whistle1.currentTime=0;
                        whistle1.play();
                        if(currentLive.ownMatch && event.squad == currentLive.ownSquad){
                            $('#DivCards').show();
                            $('#'+event.type+'_card').show();
                            setTimeout(()=>{
                                $('#DivCards').hide();
                                $('#'+event.type+'_card').hide();
                            },event.delay);
                        }
                        /*var player = $('#field-player-' + event['player']);
                        player.removeClass('weak');
                        player.addClass(event['type']);
                        if (event['type'] != 'yellow') {
                            if (event['squad'] == currentLive.ownSquad) {
                                $('#out-of-match').append($('#field-player-' + event['player']));
                                var playerObj = currentLive.players[currentLive.ownSquad][event['player']];
                                if (playerObj) {
                                    $('#field-player-points-' + event['player']).html(playerObj['points']);
                                    player.off();
                                }
                            } else {
                                $('#opponent-out-of-match').append($('#field-player-' + event['player']));
                            }
                            currentLive.players[event['squad']][event['player']]['a_position'] = 'Bank';
                        }*/
                    }
                    if(event.type == 'penaltyShootoutScore') {
                        // message = currentLive.getMessageElement(event['min']);
                        // $(message).addClass('info');
                        // $(message).append(event['template']);
                        // $('#match-messages').prepend($(message));
                    }
                    if(event.type == 'move') {
                        /*if (event['squad'] != currentLive.ownSquad) {
                            var flPl = $('#field-player-' + event['player']);
                            if (flPl && !flPl.parent('#opponent-bank').length) {
                                var nEl;
                                if (event['vPos'] == -1 && event['hPos'] == -1) {
                                    nEl = $('#opponent-positions-goalie');
                                } else {
                                    // calculate opponent position
                                    var y = Math.abs(event['vPos'] - 9);
                                    var x = Math.abs(event['hPos'] - 4);
                                    nEl = $('#Positions_' + y + '_' + x);
                                }
                                nEl.prepend(flPl);
                            }
                        }*/
                    }
                    if(event.action == 'end') {
                        if (event['template']) {
                            /*var shootout = currentLive.getMessageElement(event['min']);
                            $(shootout).addClass('info');
                            $(shootout).append(event['template']);
                            $('#match-messages').append(shootout);*/
                        }
                        /*currentLive.timeElement.html(event['min']);
                        currentLive.commit();*/
                    }
                    if(event.type == 'injured') {
                        /*currentLive.players[event['squad']][event['player']]['initial_health'] -= event['injuring'];
                        currentLive.setHealthStatus(event['player'], currentLive.players[event['squad']][event['player']]['initial_health']);*/
                    }
                    if(event.type == 'bonusHealthLoss') {
                        /*var side = event['side'];
                        var icon = $('.' + side + ' .icon.formation-bonus.health').first();
                        icon.addClass('disabled');
                        icon.attr('tooltip', 'formation-bonus-health-inactive');*/
                    }
                    if(event.type == 'bonusHealthGain') {
                        /*var side = event['side'];
                        var icon = $('.' + side + ' .icon.formation-bonus.health').first();
                        icon.removeClass('disabled');
                        icon.attr('tooltip', 'formation-bonus-health-active');*/
                    }
                    if(event.type == 'bonusFormationLoss') {
                        /*var side = event['side'];
                        var icon = $('.' + side + ' .icon.formation-bonus.formation').first();
                        icon.addClass('disabled');
                        icon.attr('tooltip', 'formation-bonus-formation-inactive');*/
                    }
                    if(event.type == 'bonusFormationGain') {
                        /*var side = event['side'];
                        var icon = $('.' + side + ' .icon.formation-bonus.formation').first();
                        icon.removeClass('disabled');
                        icon.attr('tooltip', 'formation-bonus-formation-active');*/
                    }
                    if(event.type == 'bonusLeadershipLoss') {
                        /*var side = event['side'];
                        var icon = $('.' + side + ' .icon.formation-bonus.leadership').first();
                        icon.addClass('disabled');
                        icon.attr('tooltip', 'formation-bonus-leadership-inactive');*/
                    }
                });
                var codes = Live.toString();
                var b = codes.indexOf('{')+1;
                codes = codes.substring(0,b)+`
$('#match > div.fixture').append('<img src="https://cdn1.iconfinder.com/data/icons/interface-elements/32/accept-circle-512.png" height="25px" style="position:absolute;right: -7px;top: 13px;">');`+
                    codes.substring(b);
                b = codes.indexOf('this.writeMessage =');
                b = codes.indexOf('{',b)+1;
                b = codes.indexOf('{',b)+1;
                codes = codes.substring(0,b)+`
if(currentLive.requestMin != 0){
    $("#NewMatchEvents").attr("k",JSON.stringify(event));
    $("#NewMatchEvents").click();
    if(event.action == 'end'){
        var audios = [backgroundSound,fan1,fan2];
        for(var i = 0 ; i < audios.length ; i++){
            if(!audios[i].paused){
                var j = audios[i].volume*100;
                for(var t = j ; j>=0 ; j--){
                    ((j,i)=>{
                        var time = setTimeout(function(){
                            audios[i].volume = j/100;console.log(audios[i].volume);
                            if(audios[i].volume == 0){
                                audios[i].pause();
                            }
                        },(t-j)*50);
                    })(j,i);
                }
            }
        }
    }
}
else{
    if(event.action == 'end'){
       $(backgroundSound).attr('stop',true);
       var audios = [backgroundSound,fan1,fan2];
       for(var i = 0 ; i < audios.length ; i++){
           if(!audios[i].paused){
               audios[i].pause();
           }
       }
    }
}
if(event.type == 'goal' || event.type == 'penalty' || (event.type == 'penaltyShootout' && event.goal == 'goal')){
    if(currentLive.lastActiveMin < 120){
        var squad = currentLive.homeId == event.team ? "home":"away";
        var player = {id:null,name:$('<div>'+event.message+'</div>').find('.'+squad+':last').text().trim()};
        var players = currentLive.players[currentLive[squad+'Id']];
        var ids = [];
        for(var playerId in players){
            var p = players[playerId];
            if(p.a_position != "Bank"){
                if(p.lastname == player.name){
                    ids.push(p.id);
                }
            }
        }
        if(ids.length==1){
            player.id = ids[0];
            var spn = $('#player-goals-'+player.id);
            if(!spn.length){
                $('#'+squad+'-goals').append(
                    (parseInt($('#'+currentLive.matchId).find('.score-'+squad).first().text())>0?" , ":"")+
                    '<span style="color:#'+(squad=="home"?'f00':'0ec6e7')+';white-space:nowrap;">'+
                    '<img src="https://image.ibb.co/jdRxmK/Ads_z.png" height="15px;" style="vertical-align:middle;margin: -1px 2px 0 0;">'+
                    '<span id="player-goals-'+player.id+'" style="color:white;font-size: 10px;font-weight:bold;">['+event.min+']</span> '+player.name+
                    '</span>'
                );
            }
            else{
                var text = spn.text();
                spn.text(text.substring(0,text.length-1)+','+event.min+']');
            }
        }
    }
}
`+
                    codes.substring(b);
                var script = document.createElement('script');
                script.id = 'LiveFunction';
                script.innerHTML = codes;
                $(document.head).append(script);
            }
            function ShowNoticeArea(){/*Thanks to mot33*/
                if (window.top != window.self)
                    return;
                $("#chatToggleBtn").css('top',(parseInt($("#chatToggleBtn").css('top').replace('px'))+23)+'px');
                var notiz = false;
                (()=>{
                    GM_addStyle(`
#notice_in {
color: white;
font-size: 12px;
background-color: #088A08;
padding: 4px;
width: 170px;
margin: auto;
border-radius: 12px;
cursor: pointer;
letter-spacing: 0.11em;
}

#notice_out {
width: 100%;
background-color: transparent;
padding: 10px;
border: 0px solid #088A08;
}

.notiz_button {
box-shadow: rgba(0, 0, 0, 0.75) 11px 10px 29px -5px;
border-radius: 12px;
background-color: #B40404;
border: none;
color: #FFFFFF;
text-align: center;
font-size: 15px;
padding: 4px;
width: 110px;
transition: all 0.5s;
cursor: pointer;
margin: 8px;
}

.button span {
cursor: pointer;
display: inline-block;
position: relative;
}

.button span:after {
content: '»';
position: absolute;
opacity: 0;
top: 0;
right: -20px;
transition: 0.5s;
}

.button:hover span:after {
opacity: 5;
right: 0;
}


}
#Notizbereich {
border-radius: 12px;
height: 170px;
background-color: #FFFFFF;
border: 1px solid #DF0101;
padding: 0px;
}
`);
                })();
                var notice_area = document.createElement("div");
                notice_area.setAttribute('id', 'notice_area');

                var notice_in = document.createElement("div");
                notice_in.setAttribute('id', 'notice_in');
                notice_in.addEventListener("click", openNotice, false);

                var notice_out = document.createElement("div");
                notice_out.setAttribute('id', 'notice_out');

                var clue_text = document.createElement("p");
                clue_text.innerHTML = '<font style="color:#1C6125;border-radius:7px;padding:3px 4px;background-color:black;text-align:center;opacity:0;" id="change_clue"></font>';

                var Notice_Text = document.createElement("p");
                var Notice_Buttons = document.createElement("p");
                var element = document.createElement("p");
                var Notice_Textarea = document.createElement("textarea");
                var Notice_Savebutton = document.createElement("input");
                var Notice_Resetbutton = document.createElement("input");
                var Notice_Element = document.createElement("a");
                var link = "https://www.fcup-tools.de";

                Notice_Textarea.cols = "90";
                Notice_Textarea.rows = "5";
                Notice_Textarea.placeholder = scriptTexts.WriteANote;
                Notice_Textarea.style.borderRadius = "10px";
                Notice_Textarea.style.padding = "4px 5px";
                Notice_Textarea.style.maxWidth = $('#header').width()+"px";
                Notice_Textarea.style.minHeight = "59px";
                Notice_Textarea.style.minWidth = "345px";
                Notice_Textarea.setAttribute('id', 'Notizbereich');
                Notice_Textarea.appendChild(document.createTextNode(GetCookie('Notiz')?GetCookie('Notiz'):""));

                Notice_Savebutton.type = "Button";
                Notice_Savebutton.value = scriptTexts.SaveNote;
                Notice_Savebutton.setAttribute('class', 'notiz_button');
                Notice_Savebutton.addEventListener("click", save, false);

                Notice_Element.type = "Button";
                Notice_Element.setAttribute("href", link);
                Notice_Element.setAttribute('class', 'notiz_button');
                Notice_Element.innerHTML = "Fcup-Tools";
                Notice_Element.addEventListener("onclick", open, false);
                Notice_Element.setAttribute('target','_blank');
                document.body.appendChild(Notice_Element);

                Notice_Resetbutton.type = "Button";
                Notice_Resetbutton.value = scriptTexts.ClearField;
                Notice_Resetbutton.setAttribute('class', 'notiz_button');
                Notice_Resetbutton.addEventListener("click", reset, false);

                Notice_Buttons.appendChild(Notice_Savebutton);
                Notice_Buttons.appendChild(Notice_Element);
                Notice_Buttons.appendChild(Notice_Resetbutton);

                Notice_Text.appendChild(Notice_Textarea);
                Notice_Text.appendChild(Notice_Buttons);

                notice_out.appendChild(Notice_Text);
                notice_out.appendChild(clue_text);
                notice_out.appendChild(notice_in);

                notice_area.appendChild(notice_in);
                notice_area.appendChild(notice_out);

                document.body.insertBefore(notice_area, document.body.firstChild);
                document.body.appendChild(element);

                document.getElementById("notice_in").innerHTML = '<st k="OpenNote">'+scriptTexts.OpenNote+'</st>';

                notice_out.style.display="none";
                var lock = false;
                function openNotice(){
                    if(lock)
                        return;
                    $('#notice_out').slideToggle(750);
                    lock = true;
                    setTimeout(function(){lock=false;},750);
                    if(!notiz){
                        $('#notice_in').html('<st k="CloseNote">'+scriptTexts.CloseNote+'</st>');
                        $("#chatToggleBtn").animate({ "top": "+=151px" }, 750 );
                    }
                    else{
                        $('#notice_in').html('<st k="OpenNote">'+scriptTexts.OpenNote+'</st>');
                        $("#chatToggleBtn").animate({ "top": "-=151px" }, 750 );
                    }
                    notiz = notiz?false:true;
                }

                function save(){
                    SetCookie('Notiz', $('#Notizbereich').val());
                    change_clue('<st k="SavedNote">'+scriptTexts.SavedNote+'</st>');
                }
                var interval;
                function change_clue(value){
                    $('#change_clue').animate({'opacity':1});
                    clearInterval(interval);
                    $('#change_clue').html(value);
                    interval = setTimeout (function() {
                        $('#change_clue').animate({'opacity':0},200);
                        setTimeout(()=>{
                            $('#change_clue').html('');
                        },200);
                    }, 2800);
                }

                function reset(){
                    $('#Notizbereich').val('');
                    change_clue('<st k="ClearedNote">'+scriptTexts.ClearedNote+'</st>');
                }
            }
            ShowNoticeArea();
 (function() {
    'use strict';
    GM_addStyle("#soundonoffbtn {cursor: pointer; width: 40px; height: auto;}");
    GM_addStyle("#header {position: relative;}");
    GM_addStyle("#soundonoffbtn {position: absolute; right: -25px; bottom: 0px;}");


    var audiogoal = document.createElement("audio");
    audiogoal.src = "https://open-mouthed-enviro.000webhostapp.com/goalSound.mp3";

    var whistles = [
        "https://open-mouthed-enviro.000webhostapp.com/Anpfiff.mp3",
        "https://open-mouthed-enviro.000webhostapp.com/Halbzeitpfiff.mp3",
        "https://open-mouthed-enviro.000webhostapp.com/Abpfiff.mp3",
    ];
    var audiowhistles = [];
    whistles.forEach(function(item, idx) {
        var audiowhistle = document.createElement("audio");
        audiowhistle.src = whistles[idx];
        audiowhistles.push(audiowhistle);
    });

    var audiocash = document.createElement("audio");
    audiocash.src = "https://open-mouthed-enviro.000webhostapp.com/Cash%20Register.mp3";

    var audiofangesang = document.createElement("audio");
    audiofangesang.src = "https://open-mouthed-enviro.000webhostapp.com/small%20football%20crowd%20by%20FNC.mp3";
    audiofangesang.setAttribute("loop", true);

    var init = true, balance = 0, match = false, creating = false;
    var home = "", away = "";

    function getClub(part) {
        return document.querySelector("." + part + " h3 a").innerHTML;
    }
    function checkForMatch() {
        if (document.getElementById("match-messages")) {
            if (!match) {
                match = true;
                audiofangesang.play();
                creating = true;
                setTimeout(function () {
                    creating = false;
                }, 500);
                home = getClub("home");
                away = getClub("away");
                console.log(home, away);
            } else {
                if (getClub("home") != home || getClub("away") != away) {
                    // switched to another game
                    console.log("match switched");
                    creating = true;
                    setTimeout(function () {
                        creating = false;
                    }, 500);
                    home = getClub("home");
                    away = getClub("away");
                }
            }
        } else {
            match = false;
            audiofangesang.pause();
        }
    }

    function checkForWhistle() {
        var items = document.querySelectorAll("ul#match-messages .info");
        var iWhistle = items.length - 1;
        items.forEach(function(item, idx) {
            if (!item.classList.contains("whistledone")) {
                item.classList.add("whistledone");
                if (iWhistle < whistles.length) {
                    if (soundon && !creating) audiowhistles[iWhistle].play();
                }
            }
       });
    }

    function checkForGoal() {
        var items = document.querySelectorAll("ul#match-messages li");
        items.forEach(function(item, idx) {
            if (item.classList.contains("goal") && !item.classList.contains("goaldone")) {
               item.classList.add("goaldone");
               if (soundon && !creating) audiogoal.play();
            }
       });
    }

    function checkForCash() {
        var cbalance = document.querySelector("#information-balance .currency-number");
        if (cbalance) {
            if (init) {
                init = false;
                balance = cbalance.innerHTML;
            } else {
                var newbalance = cbalance.innerHTML;
                if (newbalance != balance) {
                    balance = newbalance;
                    if (soundon) audiocash.play();
                    console.log("balance changed", cbalance.innerHTML);
                }
            }
        }
        else console.log("nobalance");
    }

    function checkForSounds() {
        checkForMatch();
        checkForWhistle();
        checkForGoal();
        checkForCash();
    }

    var soundonoffbtn = document.createElement("img");
    soundonoffbtn.id = "soundonoffbtn";
    soundonoffbtn.src= "https://mot96.lima-city.de/sound/speaker_on.png";
    header.appendChild(soundonoffbtn);

    var soundon = true;
    soundonoffbtn.addEventListener("click", function() {
        if (soundon) {
            soundon = false;
            audiofangesang.pause();
            soundonoffbtn.src= "https://mot96.lima-city.de/sound/speaker_off.png";
        } else {
            soundon = true;
            if (match) audiofangesang.play();
            soundonoffbtn.src= "https://mot96.lima-city.de/sound/speaker_on.png";
        }
    });

    var observeDOM = (function(){
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
            eventListenerSupported = window.addEventListener;

        return function(obj, callback){
            if( MutationObserver ){
                // define a new observer
                var obs = new MutationObserver(function(mutations, observer){
                    // if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                        callback();
                });
                // have the observer observe foo for changes in children
                obs.observe( obj, { characterData: true, childList:true, subtree:true });
            }
            else if( eventListenerSupported ){
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        };
    })();

    //observeDOM(document.getElementById('content'), checkForSounds);
    observeDOM(document.body, checkForSounds);
     /*setInterval(function() {
                    audiowhistle.src = whistles[iWhistle];
                    if (soundon && !creating) audiowhistle.play();
    },;*/
})();
            $('#body').append('<input type="button" style="display:none;" id="ChangeContent">');
            $('#ChangeContent').click(function(){
                if($('#content').find('h2').first().attr('Fixed')===undefined){
                    PageLoad(main);
                }
            });
            $(document.head).append(
                "<script id='FunctionupdateLayout'>"+
                (()=>{
                    var codes = (updateLayout).toString();
                    codes = 'function updateLayout'+codes.substring(codes.indexOf('('));
                    return codes.substring(0,codes.lastIndexOf('}'))+"$('#ChangeContent').click();"+'}'
                })()+
                "</script>"
            );

            PageLoad(main);
        }
        /*Script css kodları:*/
        (()=>{
            GM_addStyle(`
#ScriptMenu > table > tbody > tr > td{
word-wrap: break-word;
white-space: normal;
line-height: 15.5px;
padding:3px 6px;
}
div.box{
z-index:10;
position: absolute;
width: 157px;
background: white;
top: 0;
right: -157px;
overflow-wrap: break-word;
display: block;
margin: 0 auto;
padding:5px;
border-radius: 8px;
font-size:11px;
border: 1px solid black!important;
}
div.box h2{
width: 157px;
color: white;
font-weight: bold;
border: 0;
margin: -5px -5px 5px;
text-align: center;
font-size: 14px;
height: 30px;
background:url(https://fussballcup.de/designs/redesign/images/layout/headlines_sprite.gif) 0 -70px repeat-x;
}
table.table thead th:first-of-type{
border-radius : 7px 0 0 7px;
}
table.table thead th:last-of-type{
border-radius : 0 7px 7px 0;
}
table.table th{
background : #c01700;
}
table.table tbody tr.even > td{
background: #eee;
}
table.table tbody tr > td:first-of-type{
padding-left:5px;
text-align:left;
}
table.table tbody tr.even > td:first-of-type{
border-radius : 7px 0 0 7px;
}
table.table tbody tr.even > td:last-of-type{
border-radius : 0 7px 7px 0;
}
table.table tbody td{
border-bottom: 0;
}
div.box p{
margin-Bottom:5px;
}
.slideThree input[type=checkbox]{
visibility: hidden;
}
.slideThree {
width: 55px;
height: 21px;
background: #333;
margin: 0;
-webkit-border-radius: 55px;
-moz-border-radius: 50px;
border-radius: 50px;
position: relative;
-webkit-box-shadow: inset 0px 1px 1px rgba(0,0,0,0.5), 0px 1px 0px rgba(255,255,255,0.2);
-moz-box-shadow: inset 0px 1px 1px rgba(0,0,0,0.5), 0px 1px 0px rgba(255,255,255,0.2);
box-shadow: inset 0px 1px 1px rgba(0,0,0,0.5), 0px 1px 0px rgba(255,255,255,0.2);
}
.slideThree:after {
content: \'Off\';
font: 9px/26px Arial, sans-serif;
color: red;
position: absolute;
right: 7px;
top: -2px;
z-index: 0;
font-weight: bold;
text-shadow: 1px 1px 0px rgba(255,255,255,.15);
}
.slideThree:before {
content: \'On\';
font: 9px/26px Arial, sans-serif;
color: #00bf00;
position: absolute;
left: 7px;
top: -2px;
z-index: 0;
font-weight: bold;
}
.slideThree label {
display: block;
width: 25px;
height: 17px;
-webkit-border-radius: 50px;
-moz-border-radius: 50px;
border-radius: 50px;
-webkit-transition: all .4s ease;
-moz-transition: all .4s ease;
-o-transition: all .4s ease;
-ms-transition: all .4s ease;
transition: all .4s ease;
cursor: pointer;
position: absolute;
top: 2px;
left: 3px;
z-index: 1;
-webkit-box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.3);
-moz-box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.3);
box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.3);
background: #fcfff4;
background: -webkit-linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
background: -moz-linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
background: -o-linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
background: -ms-linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
background: linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#fcfff4\', endColorstr=\'#b3bead\',GradientType=0 );
}
.slideThree input[type=checkbox]:checked + label {
left: 22px;
}
label.menü > select {
padding:4px;
margin: 0;
-webkit-border-radius:9px;
-moz-border-radius:4px;
border-radius:4px;
-webkit-box-shadow: 0 px 0 #ccc, 0 -1px #fff inset;
-moz-box-shadow: 0 2px 0 #ccc, 0 -1px #fff inset;
box-shadow: 0 2px 0 #ccc, 0 -1px #fff inset;
background: #f8f8f8;
color:#888;
border:none;
outline:none;
display: inline-block;
-webkit-appearance:none;
-moz-appearance:none;
appearance:none;
cursor:pointer;
}
label.menü > select {
padding-right:18px;
font-size:9px;
width:45px;
margin:0 auto;
text-align-last: center;
}
label.menü {
position:relative
}
label.menü:after {
content:'<>';
font:8px \"Consolas\", monospace;
color:#aaa;
-webkit-transform:rotate(90deg);
-moz-transform:rotate(90deg);
-ms-transform:rotate(90deg);
transform:rotate(90deg);
right:2px;
top:2px;
padding:0 0 2px;
border-bottom:0px solid #ddd;
position:absolute;
pointer-events:none;
}
label.menü:before {
content:'';
right:0px;
top:0px;
width:5px;
height:px;
background:#f8f8f8;
position:absolute;
pointer-events:none;
display:block;
}
@keyframes fadeInDown {
0% {
opacity: 0;
transform: translateY(-1.25em);
}
100% {
opacity: 1;
transform: translateY(0);
}
}
.openClose[open] {
animation-name: fadeInDown;
animation-duration: 0.5s;
}
@keyframes fadeInDown {
0% {
opacity: 0;
transform: translateY(-1.25em);
}
100% {
opacity: 1;
transform: translateY(0);
}
}
.details5[open] {
animation-name: fadeInDown;
animation-duration: 0.5s;
}
@keyframes fadeInUp {
0% {
opacity: 1;
transform: translateY(0);
}
100% {
opacity: 0;
transform: translateY(-1.25em);
}
}
.openClose[close] {
animation-name: fadeInUp;
animation-duration: 0.5s;
}
div.roundedTwo {
width: 21px;
height: 21px;
position: relative;
background: -webkit-gradient(linear, left top, left bottom, from(#fcfff4), color-stop(40%, #dfe5d7), to(#b3bead));
border-radius: 50px;
box-shadow: inset 0px 1px 1px white, 0px 1px 3px rgba(0,0,0,0.5);
}
div.roundedTwo > label {
width: 15px;
height: 15px;
position: absolute;
top: 3px;
left: 3px;
cursor: pointer;
background: -webkit-gradient(linear, left top, left bottom, from(#222), to(#45484d));
border-radius: 50px;
box-shadow: inset 0px 1px 1px rgba(0,0,0,0.5), 0px 1px 0px rgba(255,255,255,1);
}
div.roundedTwo > label:after {
content: \'\';
width: 7px;
height: 4px;
position: absolute;
top: 3px;
left: 3px;
border: 3px solid #fcfff4;
border-top: none;
border-right: none;
background: transparent;
opacity: 0;
transform: rotate(-45deg);
}
div.roundedTwo > label:hover:after {
opacity: 0.3;
}
.roundedTwo > input[type=checkbox] {
visibility: hidden;
}
div.roundedTwo > input[type=checkbox]:checked + label:after {
opacity: 1;
}
`);
        })();
    });
};
function PageLoad(func){
    setTimeout(function(){
        if(!$('#body').hasClass('loading')){
            func();
        }
        else{
            var a = setInterval(function(){
                if(!$('#body').hasClass('loading')){
                    clearInterval(a);
                    func();
                }
            },50);
        }
    },10);
}
var FeaturesOfScript,
    AllIntervals = {},
    playerObject,
    TransferMarketClubs = {},
    TransferMarketValues = {"ligaIndex":0,"checkBox":false};
function main(){
    function IsPage(t){
        return location.href.indexOf(t)!==-1?true:false;
    }
    console.log('[main] Server Time : ' + new Date(GetServerTime()));
    FeaturesOfScript = [];
    for(var intervalName in AllIntervals){
        clearInterval(AllIntervals[intervalName]);
        AllIntervals[intervalName] = undefined;
    }
    $('#FeaturesOfScript > tbody').html('');
    $('#FeaturesOfScript > tbody').parent().hide();
    /*New Age Count Down*/
    (()=>{
        if(!scriptData.ageDates)
            return;
        if($('#FutureAge').length)
            return;
        var NewAgeRemainingSeconds;
        var ageDates = scriptData.ageDates;
        var sT = GetServerTime();
        for(var i = 0 ; i < ageDates.length ; i++){
            var ageDate = ageDates[i]*60000;
            if(ageDate>sT){
                NewAgeRemainingSeconds = parseInt((ageDate-sT)/1000);
                break;
            }
        }
        if(!NewAgeRemainingSeconds)
            return;
        $('#footer > .server-infos').prepend('<li style="padding: 4px 5px;font-size:12px;"><st k="NewAge">'+scriptTexts.NewAge+'</st> : <label id="FutureAge">'+CoundDown(NewAgeRemainingSeconds--)+'</label></li>');
        AllIntervals.NewAge = setInterval(function(){
            $('#FutureAge').html(CoundDown(NewAgeRemainingSeconds--));
            if(NewAgeRemainingSeconds==-1){
                $('#FutureAge').html('Yaş Atladı');
                clearInterval(AllIntervals.NewAge);
                AllIntervals.NewAge = undefined;
            }
        },1000);
    })();
    var ActiveCategory=$('#nav > ul > li > div.category.active').parents('li').index();
    if(ActiveCategory>=0 && ActiveCategory<=5){
        switch(ActiveCategory){
            case 0:
                if(IsPage('area=user&module=main')){
                    FeaturesOfScript.push("ShowPublicRelations");
                    if(scriptData.FeaturesOfScript["ShowPublicRelations"]){
                        getPageData('#/index.php?w='+worldId+'&area=user&module=publicrelations&action=index','content',function(html){
                            var Fanansehen  = parseInt($(html).find('div.container > span > div > div > div')[0].style.width.replace('%'));
                            $('#clubinfocard > div.club-avatar').after('<div id="d_ShowPublicRelations" style="margin-left:3px;width: 103px;text-align:center;"></div>');
                            var mTop = -($('#d_ShowPublicRelations').offset().top-($('#clubinfocard > div.club-avatar > img').offset().top+$('#clubinfocard > div.club-avatar > img').height()));
                            $('#d_ShowPublicRelations').css('margin-top',mTop);
                            $('#d_ShowPublicRelations').append(
                                '<a class="addedByShowPublicRelations" href="#/index.php?w='+worldId+'&amp;area=user&amp;module=publicrelations&amp;action=index" style="color:white;text-align:center;font-size:12px;font-weight:bold;text-decoration:none;">'+
                                '<st k="PublicRelations">'+scriptTexts.PublicRelations+'</st> : <span style="color:'+(Fanansehen>85?'green':Fanansehen>65?'blue':'red')+';">'+Fanansehen+'</span>%'+
                                '</a>');
                        });
                    }
                     FeaturesOfScript.push("ConstructionCountdown");
                    if(scriptData.FeaturesOfScript["ConstructionCountdown"]){
                        $('#clubinfocard').find('ul').first()[0].innerHTML +=
                            '<li><img width="16px" src="'+sources.get('construction','png')+'" alt="construction" style="margin-right:6px;"><span class="label"><st k="Stadium">'+scriptTexts.Stadium+'</st>:</span><span id="countdown1"><st k="Loading">'+scriptTexts.Loading+'</st>...</span></li>'+
                            '<li><img width="16px" src="'+sources.get('construction','png')+'" alt="construction" style="margin-right:6px;"><span class="label"><st k="Buildings">'+scriptTexts.Buildings+'</st>:</span><span id="countdown2"><st k="Loading">'+scriptTexts.Loading+'</st>...</span></li>';
                        $('.likebox').css('marginBottom','-40px');
                        var modules = ["stadium","buildings"];
                        for(var i = 0 ; i < 2 ; i++){
                            if(scriptData["finisDate"+(i+1)]===undefined){
                                getData(i);
                            }
                            else{
                                var seconds = parseInt((scriptData["finisDate"+(i+1)] - GetServerTime()) /1000);
                                start(seconds,$('#countdown'+(i+1)));
                            }
                        }
                        function getData(i){
                            var href = "#/index.php?w="+worldId+"&area=user&module="+modules[i]+"&action=index&_=squad";
                            getPageData(href,'content',function(html){
                                var cd = $(html).find('.countdown');
                                if(cd.length){
                                    var seconds = parseInt(cd.first().attr('x'));
                                    var finishDate = GetServerTime()+seconds*1000;
                                    scriptData["finisDate"+(i+1)] = finishDate;
                                    start(seconds,$('#countdown'+(i+1)));
                                }
                                else{
                                    var ol = '';
                                    if($(html).find('.build').length){
                                        ol = '&nbsp;<a href="'+href+'" <span="" style="color: #51ff44;">'+['<st k="GoToStadium">'+scriptTexts.GoToStadium+'</st>','<st k="GoToBuildings">'+scriptTexts.GoToBuildings+'</st>'][i]+'</a>';
                                    }
                                    else{
                                        ol = '<st k="Full" style="color:white;">'+scriptTexts.Full+'</st>';
                                    }
                                    $('#countdown'+(i+1)).html(ol);
                                }
                            });
                        }
                        function start(seconds,e){
                            if(seconds>0)
                                e.html('<font style="color: #b20b0b;font-weight:bold;"><st k="ItIsOver">'+scriptTexts.ItIsOver+'</st> !</font>');
                            e.html(CoundDown(seconds--));
                            var id = e[0].id;
                            AllIntervals[id] = setInterval(function(){
                                if(seconds<1){
                                    e.html('<font style="color: #b20b0b;font-weight:bold;"><st k="ItIsOver">'+scriptTexts.ItIsOver+'</st> !</font>');
                                    clearInterval(AllIntervals[id]);
                                    AllIntervals[id] = undefined;
                                    return;
                                }
                                e.html(CoundDown(seconds--));
                            },1000);
                        }
                    }
                    var simulations = $('#matches > ul.matches.simulations');
                    if(!$(simulations).find('.no-entry').length){
                        FeaturesOfScript.push("RematchMatch");
                        if(scriptData.FeaturesOfScript.RematchMatch){
                            var simulations = {"myRequest":{"accepted":[],"unaccepted":[]},"otherRequest":{"accepted":[],"unaccepted":[]}};
                            $('#matches > ul.matches.simulations > li').each(function(){
                                var ul = $('ul',this);
                                var o = ul.find('.squad-home').find('.self-link').length?"myRequest":"otherRequest";
                                var u;
                                if(o=="otherRequest"){
                                    u = ul.find('.show-button').find('a').length===2?"unaccepted":"accepted";
                                }
                                else{
                                    u = ul.find('.show-button').find('.button').length?"accepted":"unaccepted";
                                }
                                simulations[o][u].push(ul);
                            });
                            var oa = simulations.otherRequest.accepted;
                            for(var i = 0 ; i < oa.length ; i++){
                                var find = false;
                                var teamName = $('li.col.info > span.squad-home > a',oa[i]).text();
                                var m = simulations.myRequest.accepted;
                                for(var j = 0 ; j < m.length ; j++){
                                    if(teamName == $('li.col.info > span.squad-away > a',m[j]).text()){
                                        find = true;
                                        break;
                                    }
                                }
                                if(!find){
                                    m = simulations.myRequest.unaccepted;
                                    for(var j = 0 ; j < m.length ; j++){
                                        if(teamName == $('li.col.info > span.squad-away > a',m[j]).text()){
                                            find = true;
                                            break;
                                        }
                                    }
                                }
                                if(!find){
                                    var ul = oa[i];
                                    var clubId = ul.find('li.col.info').find('a:not(.self-link)').attr('clubid');
                                    ul.find('.show-button').append('<img class="sendSimulation" src="'+sources.get('again','png')+'" alt="again" style="cursor:pointer;vertical-align:middle;" width="35px" k="'+clubId+'">');
                                }
                            }
                            $('.sendSimulation').click(function(){
                                var img = $(this);
                                img.hide();
                                img.after('<img src="/designs/redesign/images/icons/loading/16x16.gif" style="vertical-align:middle;margin-left:7px;">');
                                getPageData('#/index.php?w='+worldId+'&area=user&module=profile&action=show&clubId='+$(this).attr('k'),'profile-show',function(html){
                                    var href = $(html).find('.button-container-friendly-invite-button > a').attr('href');
                                    var b = href.indexOf('invite=')+7;
                                    var matchId = href.substring(b,href.indexOf('&',b));
                                    getPageData("#/index.php?w="+worldId+"&area=user&module=simulation&action=index&squad="+matchId,'feedback',function(html){
                                        img.next().remove();
                                        img.remove();
                                        if($(html).find('.error').length){
                                            GiveNotification(false,'<st k="SimulationRequestAvailable">'+scriptTexts.SimulationRequestAvailable+'</st>');
                                        }
                                        else{
                                            GiveNotification(true,'<st k="SimulationRequestSent">'+scriptTexts.SimulationRequestSent+'</st>');
                                        }
                                    });
                                });
                            });
                        }
                    }
                    var look = [];
                    if(scriptData.youngPlayer!==undefined){
                        look.push(function(message,title){
                            if(title.indexOf(scriptData.youngPlayer.title)!=-1){
                                var text = message.text().trim();
                                var a = text.indexOf(scriptData.youngPlayer.a)+scriptData.youngPlayer.a.length;
                                var b = text.indexOf(scriptData.youngPlayer.b,a);
                                var playerName = text.substring(a,b).trim();
                                var date = message.parents('tr').first().find('.last-column').text().trim();
                                var key = 'YoungPlayers';
                                var data = GetCookie(key)===undefined?{MessageBox:{},show:[]}:GetCookie(key);
                                if(data.MessageBox[playerName]==undefined){
                                    data.MessageBox[playerName] = date;
                                }
                                SetCookie(key,data);
                            }
                        });
                    }
                    /*if(scriptData.buyPlayer!==undefined){
                        // "buyPlayer":{"title":"Assistent:","a":"ausgehandelt","b":"Spieler ","c":" hat"}
                        if(GetCookie('PlayersData')!=undefined){
                            if(true){
                                look.push(function(message,title){
                                    if(title.indexOf(scriptData.buyPlayer.title)!=-1){
                                        var text = message.text().trim();
                                        if(text.indexOf(scriptData.buyPlayer.a)!=-1){
                                            var b = text.indexOf(scriptData.buyPlayer.b)+scriptData.buyPlayer.b.length;
                                            var c = text.indexOf(scriptData.buyPlayer.c,b);
                                            var _playerName = text.substring(b,c).trim();
                                            var a = message.find('a');
                                            var _club = {id:a.attr('clubid'),name:a.text().trim()};
                                            var data = GetCookie('PlayersData');
                                            if(data.SellPlayers==undefined)
                                                data.SellPlayers = {};
                                            if(data.SellPlayers[playerName]==undefined){
                                                if(data.AcceptedOffers==undefined)
                                                    data.AcceptedOffers = {};
                                                for(var playerId in data.AcceptedOffers){
                                                    var playerName = data.AcceptedOffers[playerId];
                                                    if(_playerName==playerName){
                                                        var offers = data.AcceptedOffers[playerId].offers;
                                                        for(var clubId in offers){
                                                            if(clubId == _club.id){
                                                                data.SellPlayers[playerName] = {playerId:playerId,clubId:clubId,clubName:offers[clubId].clubName,price:offers[clubId].price,date:offers[clubId].date};
                                                                SetCookie('PlayersData',data);
                                                                break;
                                                            }
                                                        }
                                                        break;
                                                    }
                                                }
                                            }
                                            else{
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }*/
                    if(scriptData.increaseBid!==undefined){
                        // "increaseBid":{"title":"Transfermarkt","a":"überboten","b":"für ","c":" wurde"}
                        look.push(function(message,title){
                            if(title.indexOf(scriptData.increaseBid.title)!=-1){
                                var text =  message.text().trim();
                                if(text.indexOf(scriptData.increaseBid.a)!=-1){
                                    message.parent().click(function(){
                                        var max = 50;
                                        var messageId = this.id.split('-')[2];
                                        AllIntervals['OpenMessage_'+messageId] = setInterval(function(){
                                            var k = $('#readmessage-home');
                                            if(k.length){
                                                clearInterval(AllIntervals['OpenMessage_'+messageId]);
                                                AllIntervals['OpenMessage_'+messageId] = undefined;
                                                var a = $('<div>'+k.html()+'</div>');
                                                a.find('h2,a,div').remove();
                                                var playerName = a.text().trim();
                                                var b = playerName.indexOf(scriptData.increaseBid.b)+scriptData.increaseBid.b.length;
                                                var c = playerName.indexOf(scriptData.increaseBid.c,b);
                                                playerName = playerName.substring(b,c).trim();
                                                k.find('a:last').click(function(){
                                                    SetCookie('increaseBid',playerName);
                                                });
                                            }
                                            max--;
                                            if(max==0){
                                                clearInterval(AllIntervals['OpenMessage_'+messageId]);
                                                AllIntervals['OpenMessage_'+messageId] = undefined;
                                            }
                                        },50);
                                    });
                                }
                            }
                        });
                    }
                    if(look.length){
                        $('#deleteForm > table > tbody').find('.odd,.even').each(function(){
                            var id = $(this).attr('id').split('-')[1];
                            var message = $('#newscenter-preview-'+id);
                            var title = message.find('h2').first().text().trim();
                            for(var i = 0 ; i < look.length ; i++){
                                look[i](message,title);
                            }
                        });
                    }
                    if(true){
                        $('#clubinfocard > ul').append("<li><span class='label'><st k='Team'>"+scriptTexts.Team+"</st>:</span> <label id='auf_count_number'><st k ='Loading'>"+scriptTexts.Loading+"</st>...</label></li>");
                        var a = $('.likebox').css('marginBottom','-65px');
                        getPageData("#/index.php?w="+worldId+"&area=user&module=formation&action=index",'formation-count',function(html){
                                if((count_number = $(html).text()) == "11"){
                                    count_number = '<st k="Full">'+scriptTexts.Full+'</st> 11/11';
                                }
                                else{
                                    count_number = '<span style="color: red;text-shadow:0.5px 0.5px white;"><st k="Missing">'+scriptTexts.Missing+'</st> '+count_number+'/11</span>';
                                }
                                $('#auf_count_number').html(count_number);
                        });
                    }
                }
                else if(IsPage('area=user&module=team&action=squad')){
                    FeaturesOfScript.push("TrainingControl");
                    if(scriptData.FeaturesOfScript.TrainingControl){
                        TrainingControl();
                    }
                    FeaturesOfScript.push("ClubExchange");
                    if(scriptData.FeaturesOfScript.ClubExchange){
                        FuncClubExchange();
                        function FuncClubExchange(){
                            var key = 'ClubExchange';
                            var data = GetCookie(key)===undefined?{}:GetCookie(key);
                            var control = {};
                            var count = 0;
                            var tables = ['overview','overview-club','agreements','agreements-club'];
                            for(var i = 0 ; i <= tables.length ;i++){
                                var players = $('#players-table-'+tables[i]+' > tbody > tr');
                                if(!players.find('.open-card').length){
                                    continue;
                                }
                                PlayersFromTable(players,i);
                            }
                            function PlayersFromTable(players,i){
                                players.each(function(){
                                    var e = $('td:nth-child('+[11,11,8,8][i]+')',this);
                                    var text = e.text();
                                    if(text.indexOf(scriptData.ClubExchange)!==-1){
                                        var playerId = $(this).find('.open-card').attr('pid').split('-')[1];
                                        control[playerId]='';
                                        count++;
                                        Control(playerId,e);
                                    }
                                });
                            }
                            function Control(playerId,e){
                                if(data[playerId]===undefined){
                                    $.get('/index.php?w='+worldId+'&area=user&module=player&action=index&complex=0' + '&id=' + playerId,
                                          function(response) {
                                        var r = $('<div>'+response+'</div>').find('.data.attributes > ul > li:last');
                                        var a = r.find('a');
                                        var club = {
                                            id:a.attr('clubid'),
                                            name:a.text().trim()
                                        };
                                        r.find('a,strong').remove();
                                        date = r.text().trim();
                                        var b = date.lastIndexOf('.')+5;
                                        var c = date.lastIndexOf('.',b-6)-2;
                                        var date = date.substring(b,c);
                                        if(date.length===10){
                                            var data = GetCookie('ClubExchange')===undefined?{}:GetCookie('ClubExchange');
                                            data[playerId] = {date:date,club:club};
                                            SetCookie('ClubExchange',data);
                                            var d = date.split('.');
                                            var sec = parseInt((new Date(d[2],parseInt(d[1])-1,d[0],3).getTime()-GetServerTime())/1000);
                                            e.html('<a href="#/index.php?w='+worldId+'&area=user&module=profile&action=show&clubId='+club.id+'" target="_blank"><img title="'+scriptTexts.ClubExchange(date,club.name)+'" src="'+sources.get('exchange','png')+'" alt="exchange" height="15px" style="background-color: #00fff7;border-radius: 50%;cursor:pointer;margin-right: 4px;"></a><font title="'+scriptTexts.RemainingTime+' : '+($('<div>'+CoundDown(sec)+'</div>').text())+'">' + date+'</font>');
                                            SetCookie('ClubExchange',data);
                                        }
                                    }
                                         ).always(function() {
                                        count--;
                                        if(count===0){
                                            var data = GetCookie('ClubExchange')===undefined?{}:GetCookie('ClubExchange');
                                            for(var i in data){
                                                if(control[i]===undefined){
                                                    data[i]=undefined;
                                                }
                                            }
                                            SetCookie('ClubExchange',data);
                                        }
                                    });
                                }
                                else{
                                    var date = data[playerId].date;
                                    var d = date.split('.');
                                    var sec = parseInt((new Date(d[2],parseInt(d[1])-1,d[0],3).getTime()-GetServerTime())/1000);
                                    e.html('<a href="#/index.php?w='+worldId+'&area=user&module=profile&action=show&clubId='+data[playerId].club.id+'" target="_blank"><img title="'+scriptTexts.ClubExchange(date,data[playerId].club.name)+'" src="'+sources.get('exchange','png')+'" alt="exchange" height="15px" style="background-color: #00fff7;border-radius: 50%;cursor:pointer;margin-right: 4px;"></a><font title="'+scriptTexts.RemainingTime+' : '+($('<div>'+CoundDown(sec)+'</div>').text())+'">' + date+'</font>');
                                }
                            }
                        }
                    }
                    var buttons = [];
                    if(jQuery.isPlainObject(playerObject)){
                        var players = $('#players-table-overview > tbody > tr');
                        if(players.find('.open-card').length){
                            FeaturesOfScript.push("PlayersHealth");
                            if(scriptData.FeaturesOfScript.PlayersHealth){
                                var data = GetCookie('PlayersHealth')==undefined?{players:{}}:GetCookie('PlayersHealth');
                                players.each(function(){
                                    var playerId = $(this).find('.open-card').attr('pid').split('-')[1];
                                    if(playerObject[playerId]!==undefined){
                                        var currentHealth = playerObject[playerId].initial_health;
                                        var text = '';
                                        var previousHealth = data.players[playerId];
                                        if(previousHealth!==undefined){
                                            var change = currentHealth-previousHealth;
                                            var pic = change<0?"relegation":change>0?"advancement":"remain";
                                            change = (change>0?"+":"")+change;
                                            text = '<span class="icon '+pic+'" title="'+scriptTexts.Change+' : '+change+'"></span>';
                                        }
                                        text+=currentHealth;
                                        $(this).find('td:nth-child(7)').prepend(text);
                                    }
                                });
                                $('#squad-handle-container').append('<input type="button" value="'+scriptTexts.SaveHealth+'" id="saveHealth" style="padding: 2px 5px; border: 1px solid rgb(153, 153, 153); font-size: 9px;border-radius: 7px !important;margin:16px 0 0 0;">');
                                if(data.date===undefined){
                                    $('#saveHealth').click(function(){
                                        $(this).off();
                                        $(this).hide(300);
                                        data = {};
                                        var pl = {};
                                        for(var i in playerObject){
                                            if(playerObject[i])
                                                pl[i] = playerObject[i].initial_health;
                                        }
                                        data.players = pl;
                                        data.date = GetServerTime();
                                        SetCookie('PlayersHealth',data);
                                        $('#players-table-overview > tbody > tr').each(function(){
                                            $(this).find('td:nth-child(7)').prepend('<span class="icon remain" title="'+scriptTexts.Change+' : 0"></span>');
                                        });
                                        setTimeout(function(){$(this).show(300);},300);
                                        this.id = 'updateHealth';
                                        $('#updateHealth').val(scriptTexts.UpdateHealth);
                                        update();
                                    });
                                }
                                else{
                                    $('#saveHealth').attr('id','updateHealth');
                                    $('#updateHealth').val(scriptTexts.UpdateHealth);
                                    update();
                                }
                                function update(){
                                    $('#updateHealth').click(function(){
                                        data = {};
                                        var pl = {};
                                        for(var i in playerObject){
                                            if(playerObject[i])
                                                pl[i] = playerObject[i].initial_health;
                                        }
                                        data.players = pl;
                                        data.date = GetServerTime();
                                        SetCookie('PlayersHealth',data);
                                        $('#players-table-overview > tbody > tr').each(function(){
                                            var playerId = $(this).find('.open-card').attr('pid').split('-')[1];
                                            var health = data.players[playerId];
                                            if(health){
                                                var icon = (health>=90?"excellent":health>=75?"ok":health>=50?"poor":"injured");
                                                $(this).find('td:nth-child(7)').html('<span class="icon remain" title="'+scriptTexts.Change+' : 0"></span>'+health+' <span class="icon health-status-'+icon+'" tooltip="tt_health_'+icon+'"></span>');
                                            }
                                        });
                                    });
                                }
                                buttons.push($('#saveHealth'));
                                buttons.push($('#updateHealth'));
                            }
                        }
                    }
                    var players = $('#players-table-overview > tbody > tr');
                    if(players.find('.open-card').length){
                        FeaturesOfScript.push("RankingOfPlayers");
                        if(scriptData.FeaturesOfScript.RankingOfPlayers){
                            players.each(function(i){
                                $(this).find('td:nth-child(6) > span > input[type="text"]').attr('tabindex',i+1);
                            });
                            $('#squad-handle-container').append('<input type="button" value="'+scriptTexts.SortPlayers+'" id="RankingOfPlayersButton" title="Oyuncu sıralaması şu şekilde yapılır;\u000dEn iyi kaleciye 1,\u000dDiğer oyunculara güce göre,\u000dGençlere 90\'dan başlanarak ilk gelen gençten son gelen gence göre\u000dnumara verilir." style="-webkit-border-radius: 7px !important; padding: 2px 5px; border: 1px solid #999;font-size: 9px;margin:16px 90px 0 40px;">');
                            $('#RankingOfPlayersButton').click(function(){
                                var kl=[],
                                    klText = scriptData.footballerPositions.Position1;
                                var genc=[];
                                var diger=[];
                                $('#players-table-overview > tbody > tr').each(function(i){
                                    var mevki = $(this).find('td:nth-child(3)')[0].textContent.trim();
                                    var güc = parseInt($(this).find('td:nth-child(4)')[0].textContent);
                                    var yas = parseInt($(this).find('td:nth-child(5)')[0].textContent);
                                    if(IsYoungPlayer($(this).find('td:nth-child(12)')[0])){
                                        var tarih = $(this).find('td:nth-child(11)')[0].textContent.split('.');
                                        tarih = new Date(tarih[2],parseInt(tarih[1])-1,tarih[0]).getTime();
                                        genc.push({'i':i,tarih:tarih});
                                    }
                                    else if(mevki===klText){
                                        kl.push({'i':i,güc:güc,yas:yas});
                                    }
                                    else{
                                        diger.push({'i':i,güc:güc,yas:yas});
                                    }
                                });
                                var maxKl = {güc:0,i:null};
                                var spliceIndex = null;
                                for(var i = 0 ; i < kl.length; i++){
                                    if(kl[i].güc>maxKl.güc){
                                        maxKl.güc = kl[i].güc;
                                        maxKl['i'] = kl[i]['i'];
                                        spliceIndex = i;
                                    }
                                }
                                var no = 1;
                                if(maxKl.i!==null){
                                    $('#players-table-overview > tbody > tr:nth-child('+(maxKl.i+1)+') > td:nth-child(6) > span > input[type="text"]').val(no);
                                    $('#players-table-overview > tbody > tr:nth-child('+(maxKl.i+1)+') > td:nth-child(6) > span > input[type="text"]').attr('tabindex',no++);
                                    kl.splice(spliceIndex,1);
                                    for(var i = 0 ; i < kl.length ; i++){
                                        diger.push({'i':kl[i]['i'],'güc':kl[i].güc,'yas':kl[i].yas});
                                    }
                                }
                                diger.sort(function(a,b){
                                    if(b.güc-a.güc!==0){
                                        return b.güc-a.güc;
                                    }
                                    else{
                                        return a.yas-b.yas;
                                    }
                                });
                                for(var i = 0 ; i < diger.length ; i++){
                                    $('#players-table-overview > tbody > tr:nth-child('+(diger[i]['i']+1)+') > td:nth-child(6) > span > input[type="text"]').val(no);
                                    $('#players-table-overview > tbody > tr:nth-child('+(diger[i]['i']+1)+') > td:nth-child(6) > span > input[type="text"]').attr('tabindex',no++);
                                }
                                genc.sort(function(a,b){
                                    return a.tarih-b.tarih;
                                });
                                for(var i = 0 ; i < genc.length ; i++){
                                    $('#players-table-overview > tbody > tr:nth-child('+(genc[i]['i']+1)+') > td:nth-child(6) > span > input[type="text"]').val(90+i);
                                    $('#players-table-overview > tbody > tr:nth-child('+(genc[i]['i']+1)+') > td:nth-child(6) > span > input[type="text"]').attr('tabindex',90+i);
                                }
                                $('#players-table-overview > tfoot > tr > td:nth-child(2) > span > a > span').click();
                            });
                            buttons.push($('#RankingOfPlayersButton'));
                        }
                    }
                    if(buttons.length){
                        var menüs = $('#squad-handle-container > li');
                        menüs.click(function(){
                            for(var k = 0 ; k < buttons.length ; k++){
                                buttons[k].hide('slow');
                            }
                        });
                        $(menüs[0]).click(function(){
                            for(var k = 0 ; k < buttons.length ; k++){
                                buttons[k].show('slow');
                            }
                        });
                    }
                    FeaturesOfScript.push("ShowStrengthChange");
                    if(scriptData.FeaturesOfScript.ShowStrengthChange){
                        var control = 0;
                        var data = GetCookie('PlayersData')==undefined?{}:GetCookie('PlayersData');
                        if(!data.BuyPlayers)
                            data.BuyPlayers = [];
                        var BuyPlayers= data.BuyPlayers;
                        if(BuyPlayers.length && $('#players-table-changes > tbody').find('.open-card').length){
                            $('#players-table-changes > tbody > tr').each(function(){
                                var playerId = $(this).find('.open-card').attr('pid').split('-')[1];
                                for(var i = 0 ; i < BuyPlayers.length ; i++){
                                    if(BuyPlayers[i].playerId == playerId){
                                        var currentStrength = parseInt($(this).find('td:nth-child(4)').text());
                                        var oldStrength = BuyPlayers[i].strength;
                                        var difference = currentStrength-oldStrength;
                                        if(difference){
                                            control++;
                                            $(this).find('td:nth-child(4)').append('<span style="color:#42ff35;" class="changed-property">(+'+difference+')</span>');
                                        }
                                        var td = $(this).find('.last-column');
                                        if(td.length){
                                            td.css('position','relative');
                                            td.append('<img src="'+sources.get('data','png')+'" alt="data" height="15px" style="position:absolute;top:9px;right:10px;">');
                                        }
                                    }
                                }
                            });
                        }
                        if(!control)
                            FeaturesOfScript.splice(FeaturesOfScript.length-1,1);
                    }
                    FeaturesOfScript.push("ShowRealStrength");
                    if(scriptData.FeaturesOfScript.ShowRealStrength){
                        var positionName = scriptData.footballerPositions;
                        var positions = {
                            ["/"+positionName.Position1+"/"]:[{"0":5},{"1":5},{"3":4},{"8":3},{"6":2},{"10":1},{"4":1},{"2":1}],
                            ["/"+positionName.Position2+"/"+positionName.Position3+"/"+positionName.Position4+"/"]:[{"6":4},{"9":4},{"3":3},{"8":2},{"10":2},{"4":2},{"5":2},{"7":2},{"11":2},{"2":1}],
                            ["/"+positionName.Position5+"/"+positionName.Position6+"/"]:[{"3":4},{"10":4},{"8":3},{"5":3},{"6":2},{"4":2},{"7":2},{"9":2},{"11":2},{"2":1}],
                            ["/"+positionName.Position7+"/"+positionName.Position8+"/"]:[{"11":4},{"3":3},{"8":3},{"10":3},{"2":3},{"6":2},{"4":2},{"5":1},{"7":1},{"9":1}]
                        };
                        var tables = [["#players-table-overview","#players-table-agreements","#players-table-skills"],["#players-table-overview-club","#players-table-agreements-club","#players-table-skills-club"]];
                        for(var i = 0 ; i < tables.length ; i++){
                            var t1 = tables[i][0];
                            var t2 = tables[i][1];
                            var t3 = tables[i][2];
                            if($(t1).find('.open-card').length){
                                $(t1).find('tbody > tr').each(function(d){
                                    var position = $(this).find('td:nth-child(3)').text().trim();
                                    var key = null;
                                    for(var position_ in positions){
                                        if(position_.indexOf('/'+position+'/')!==-1){
                                            key = positions[position_];
                                            break;
                                        }
                                    }
                                    var skills = [];
                                    $(t3).find('tbody > tr:nth-child('+(d+1)+')').find('.skill-column').each(function(){
                                        skills.push(parseFloat($(this).attr('sortvalue')));
                                    });
                                    var strength = GetStrengthFromSkills(skills,key);
                                    var html = (strength).toFixed(2);
                                    var e = $(this).find('td:nth-child(4)');
                                    var difference = (strength - parseInt(e.attr('sortvalue'))).toFixed(2);
                                    if(e.find('.changed-property').length){
                                        html += '&nbsp;'+e.find('.changed-property')[0].outerHTML;
                                    }
                                    e.html(html);
                                    $(t2).find('tbody > tr:nth-child('+(d+1)+') > td:nth-child(4)').html(html);
                                    $(t3).find('tbody > tr:nth-child('+(d+1)+') > td:nth-child(4)').html(html);
                                    e.css('color',difference>0?"green":difference<0?"#a62c2c":"#d9d9d9");
                                    $(t2).find('tbody > tr:nth-child('+(d+1)+') > td:nth-child(4)').css('color',difference>0?"green":difference<0?"#a62c2c":"#d9d9d9");
                                    $(t3).find('tbody > tr:nth-child('+(d+1)+') > td:nth-child(4)').css('color',difference>0?"green":difference<0?"#a62c2c":"#d9d9d9");
                                    e.attr('title',(difference>0?"+":"")+difference);
                                    $(t2).find('tbody > tr:nth-child('+(d+1)+') > td:nth-child(4)').attr('title',(difference>0?"+":"")+difference);
                                    $(t3).find('tbody > tr:nth-child('+(d+1)+') > td:nth-child(4)').attr('title',(difference>0?"+":"")+difference);
                                });
                            }
                        }
                    }
                    if(scriptData.ageDates){
                        FeaturesOfScript.push("CalculateNonYoungPlayersStrength");
                        if(scriptData.FeaturesOfScript.CalculateNonYoungPlayersStrength){
                            var add =
                                '<h3><st k="CalculateNonYoungPlayersStrength">'+scriptTexts.CalculateNonYoungPlayersStrength+'</st></h3>'+
                                '<div style="text-align:center;margin:5px auto;border-radius:15px;background-color:#4a6b3247;"><div style="border-radius:15px 15px 0 0;background-color:#4a6b32;padding:15px 15px 5px 15px;margin-bottom:20px;">';
                            var tablesId = ['players-table-overview','players-table-overview-club'];
                            var select =
                                '<select id="selectPlayers" style="margin:0 0 0 20px;text-align-last: center; border-radius: 10px; padding: 3px 2px; background-color: black; color: green;" onfocus="this.style.backgroundColor=\'green\';this.style.color=\'black\';" onfocusout="this.style.backgroundColor=\'black\';this.style.color=\'green\';">'+
                                '<option value="0"><st k="ChoosePlayer">'+scriptTexts.ChoosePlayer+'</st></option>';
                            for(var i = 0 ; i < tablesId.length ; i++){
                                if($('#'+tablesId[i]).find('.open-card').length){
                                    $('#'+tablesId[i]).find('tbody > tr').each(function(){
                                        if(!IsYoungPlayer($(this).find('td:nth-child(12)'))){
                                            var position = $(this).find('td:nth-child(3)').text().trim();
                                            var playerId = $(this).find('.open-card').attr('pid').split('-')[1];
                                            var playerName = $(this).find('.player-name').text();
                                            select+='<option value="'+playerId+'">['+position+'] '+playerName+'</option>';
                                        }
                                    });
                                }
                            }
                            select += '</select>';
                            add+=  '<st k="ChoosePlayer">'+scriptTexts.ChoosePlayer+'</st> ' + select;
                            add+='</div></div>';
                            $('#squad > div.squad.personal').append('<hr>'+add);
                            $('#selectPlayers').change(function(){
                                var playerId = this.value;
                                $('#Comparison').remove();
                                $('#chooseRange').remove();
                                $('#ChoosedPlayer').remove();
                                if(playerId!=0){
                                    var age = 0;
                                    var skills = [];
                                    $('#players-table-overview').add($('#players-table-overview-club')).find('.open-card').each(function(i){
                                        if($(this).attr('pid').split('-')[1]==playerId){
                                            age = parseInt($(this).parents('tr').find('td:nth-child(5)').text());
                                            $($('#players-table-skills').add($('#players-table-skills-club')).find('.open-card')[i]).parents('tr').first().find('.skill-column').each(function(){
                                                skills.push(parseFloat($(this).attr('sortvalue')));
                                            });
                                            return false;
                                        }
                                    });
                                    var text =
                                        '<p id="chooseRange" style="margin:10px 0;"> <st k="ChooseAge">'+scriptTexts.ChooseAge+'</st> :'+
                                        '<input type="range" id="ageRange" style="vertical-align: middle;margin:0 5px;" min="'+age+'" max="42" value="'+age+'">'+
                                        '<label id="lblageRange">'+age+'</label>'+
                                        '</p>';
                                    $(this).after(text);
                                    $(this).after('<span pid="player-'+playerId+'" class="icon details open-card" style="float:none;margin-top: -3px;" id="ChoosedPlayer"></span>');
                                    document.getElementById('ageRange').oninput = function() {
                                        $('#Comparison').remove();
                                        $('#lblageRange').text(this.value);
                                        if(parseInt(this.value)-age>0){
                                            var ageDifference = 0;
                                            var now = GetServerTime();
                                            var o = scriptData.ageDates;
                                            var start = false;
                                            var u = 0;
                                            for(var i = 0 ; i < o.length ; i++){
                                                var tarih = o[i]*60000;
                                                if(start){
                                                    if(age+(++ageDifference)==parseInt(this.value)){
                                                        var u = tarih;
                                                        break;
                                                    }
                                                    continue;
                                                }
                                                if(now<tarih){
                                                    start = true;
                                                    i--;
                                                    continue;
                                                }
                                            }
                                            if(u-now<0)
                                                return;
                                            var result = FindNumberOfTraining(now,u);
                                            var position = $('#selectPlayers')[0].options[$('#selectPlayers')[0].selectedIndex].textContent.trim();
                                            position = position.substring(position.indexOf('[')+1,position.indexOf(']'));
                                            var trainingScore = parseInt(scriptData.trainerLevel)*0.25+0.5;
                                            var result1 = CalculateStrength(skills,result[0],trainingScore,position);
                                            var result2 = CalculateStrength(skills,result[0]+result[1],trainingScore,position);
                                            //{currentStrength:currentStrength,nextStrength:nextStrength,nextSkills:nextSkills}
                                            var code = '<div class="infosheet" id="Comparison" style="text-align:center;margin-bottom:10px;">';
                                            var tables = [
                                                {title:'<st k="Now">'+scriptTexts.Now+'</st> ('+ShowDate(parseInt(now/1000))+')',skills:skills,age:age,strength:result1.currentStrength},
                                                {title:'<st k="NonCreditTraining">'+scriptTexts.NonCreditTraining+'</st> ('+ShowDate(parseInt(u/1000))+')',skills:result1.nextSkills,age:parseInt(this.value),strength:result1.nextStrength,numberOfTraining:result[0]},
                                                {title:'<st k="CreditTraining">'+scriptTexts.CreditTraining+'</st> ('+ShowDate(parseInt(u/1000))+')',skills:result2.nextSkills,age:parseInt(this.value),strength:result2.nextStrength,numberOfTraining:result[0]+result[1]}
                                            ];
                                            for(var i = 0 ; i < 3 ; i++){
                                                code += '<div class="data skills" style="height:100%;padding:5px;background-color: #58793d;border-radius:5px;position:static;'+(i!=2?"margin-right:25px;":"")+'">'+
                                                    '<h2 style="font-size: 12px;margin-bottom:5px;border:none;line-height:25px;height:25px;background: #4a6b32;width:auto;font-weight:bold;">'+tables[i].title+'</h2>'+
                                                    '<ul style="margin:3px 0;"><li class="odd"><span style="float:left;">Ø</span><span style="color:white;font-weight:bold;">'+(tables[i].strength).toFixed(2)+'</span></li><li class="odd"><span style="float:left;"><st k="Age">'+scriptTexts.Age+'</st></span><span style="color:white;font-weight:bold;">'+tables[i].age+'</span></li></ul><ul style="margin:0;">';
                                                for(var j = 0 ; j < 14 ; j++){
                                                    var o = ['penalty_area_safety', 'catch_safety', 'two_footed', 'fitness', 'shot', 'header', 'duell', 'cover', 'speed', 'pass', 'endurance', 'running', 'ball_control', 'aggressive'][j];
                                                    var ı='<span',t,c='';
                                                    if(i==0){
                                                        t = tables[0].skills[j];
                                                    }
                                                    else{
                                                        if(tables[i].skills[j]==undefined){
                                                            t = tables[0].skills[j];
                                                        }
                                                        else{
                                                            if(tables[i].skills[j]!=tables[0].skills[j]){
                                                                ı+= ' style="color:#ff0808"';
                                                                c= '<span class="changed-property" style="color:#3db3d5e6">(+'+(tables[i].skills[j]-tables[0].skills[j])+')</span>';
                                                            }
                                                            t = tables[i].skills[j];
                                                        }
                                                    }
                                                    if(t>=990)
                                                        ı+=' class="maximum"';
                                                    ı+='>'+t+c+'</span>';
                                                    code += '<li class="odd">'+
                                                        '<strong><span class="icon '+o+'" tooltip="tt_'+o+'"></span></strong>'+ı+'</li>';
                                                }
                                                code += '</ul>';
                                                if(i>0){
                                                    code += '<ul style="margin:4px auto 2px auto"><li class="odd" style="float:none;margin:auto;margin-bottom:1px;"><span style="float:left;"><st k="Training">'+scriptTexts.Training+'</st></span><span style="color:white;font-weight:bold;">'+tables[i].numberOfTraining+'</span></li></ul>';
                                                }
                                                code +='</div>';
                                            }
                                            code += '</div>';
                                            $('#chooseRange').parent().parent().append(code);
                                        }
                                    };
                                }
                            });
                        }

                        FeaturesOfScript.push("CalculatingStrengthOfYoungPlayer");
                        if(scriptData.FeaturesOfScript.CalculatingStrengthOfYoungPlayer){
                            var tables = [
                                ["#players-table-overview","#players-table-agreements","#players-table-skills"],
                                ["#players-table-overview-club","#players-table-agreements-club","#players-table-skills-club"]
                            ];
                            for(var i = 0 ; i < tables.length ; i++){
                                if($(tables[i][0]).find('.open-card').length){
                                    $(tables[i][0]).find('tbody > tr').each(function(j){
                                        if(IsYoungPlayer($(this).find('td:nth-child(12)')[0])){
                                            var trainingScore = scriptData.yTrainerLevel+0.5;
                                            var position = $(this).find('td:nth-child(3)').text().trim();
                                            var age = parseInt($(this).find('td:nth-child(5)').text());
                                            var skills = [];
                                            $(tables[i][2]).find('tr:nth-child('+(j+1)+')').find('.skill-column').each(function(){
                                                skills.push(parseFloat($(this).attr('sortvalue')));

                                            });
                                            var startDate = GetServerTime();
                                            var finishDate = $(this).find('td:nth-child(11)').text().trim().split('.');
                                            finishDate = new Date(finishDate[2],parseInt(finishDate[1])-1,parseInt(finishDate[0])+1).getTime();
                                            var trainings = FindNumberOfTraining(startDate,finishDate);
                                            var result1 = CalculateStrength(skills,trainings[0],trainingScore,position);
                                            var result2 = CalculateStrength(skills,trainings[0]+trainings[1],trainingScore,position);
                                            //{currentStrength:currentStrength,nextStrength:nextStrength,nextSkills:nextSkills}
                                            var nextAge=age,remainingDay2='-';
                                            var start = false;
                                            var u = 0;
                                            var o = scriptData.ageDates;
                                            for(var p = 0 ; p < o.length ; p++){
                                                var tarih = o[p]*60000;
                                                if(start){
                                                    if(tarih <= finishDate){
                                                        nextAge++;
                                                        continue;
                                                    }
                                                    else{
                                                        remainingDay2 = ((tarih-finishDate)/86400000).toFixed(1);
                                                        break;
                                                    }
                                                }
                                                if(startDate<tarih){
                                                    start = true;
                                                    p--;
                                                    continue;
                                                }
                                            }
                                            var u1 = this.getElementsByTagName('td')[3];
                                            var u2 = this.getElementsByTagName('td')[4];
                                            controlEvents($(u1),$(u2),result1.nextStrength,nextAge,result2.nextStrength,result1.currentStrength);
                                            u1 = $('#players-table-agreements > tbody > tr:nth-child('+(i+1)+') > td:nth-child(4)')[0];
                                            u2 = $('#players-table-agreements > tbody > tr:nth-child('+(i+1)+') > td:nth-child(5)')[0];
                                            controlEvents($(u1),$(u2),result1.nextStrength,nextAge,result2.nextStrength,result1.currentStrength);
                                            var remainingDay = ((finishDate-startDate)/86400000).toFixed(1);
                                            var title = scriptTexts.EndYouth(
                                                remainingDay,
                                                TwoDigit(new Date(finishDate).getDate())+'.'+
                                                TwoDigit(new Date(finishDate).getMonth()+1)+'.'+
                                                new Date(finishDate).getFullYear()
                                            )+
                                                ';\u000d'+scriptTexts.Age+' : '+nextAge+
                                                '\u000dØ : '+result1.nextStrength+' - ' + result2.nextStrength+
                                                '\u000d'+scriptTexts.RemainingNumberOfNormalTraining+' : ' + trainings[0]+
                                                '\u000d'+scriptTexts.RemainingNumberOfCreditTraining+' : ' + trainings[1]+
                                                '\u000d'+scriptTexts.RemainingNextAgeDay(remainingDay2);
                                            this.getElementsByTagName('td')[10].title = title;
                                            $('#players-table-agreements > tbody > tr:nth-child('+(i+1)+') > td:nth-child(8)')[0].title = title;
                                            if(i==0){
                                                var u = this.getElementsByClassName('open-card')[0];
                                                var index = 0;
                                                for(var posKey in scriptData.footballerPositions){
                                                    if(scriptData.footballerPositions[posKey] == position){
                                                        break;
                                                    }
                                                    else{
                                                        index++;
                                                    }
                                                }
                                                var TrainingSkills = scriptData.TrainingPlans[scriptData.trainingProgram][index]; // [9,6,3,7,8,10,5]
                                                clickOpenCard(u,TrainingSkills);
                                                u = $(tables[i][1]).find('tbody > tr:nth-child('+(j+1)+')').find('.open-card')[0];
                                                clickOpenCard(u,TrainingSkills);
                                                u = $(tables[i][2]).find('tbody > tr:nth-child('+(j+1)+')').find('.open-card')[0];
                                                clickOpenCard(u,TrainingSkills);
                                            }
                                        }
                                    });
                                }
                            }
                            function clickOpenCard(u,keys){
                                $(u).click(function(){
                                    $(u).off();
                                    var index = $(u).parents('tr').index()+1;
                                    $('#players-table-overview > tbody > tr:nth-child('+index+')').find('.open-card').off();
                                    $('#players-table-agreements > tbody > tr:nth-child('+index+')').find('.open-card').off();
                                    $('#players-table-skills > tbody > tr:nth-child('+index+')').find('.open-card').off();
                                    var playerId = $(this).attr('pid').split('-')[1];
                                    if($('#info-player-'+playerId).length)
                                        return;
                                    var id = $(u).attr('pid').split('-')[1];
                                    var max = 300;
                                    AllIntervals['OpenCard_'+playerId] = setInterval(function(){
                                        if(!$(u).hasClass('loading')){
                                            clearInterval(AllIntervals['OpenCard_'+playerId]);
                                            AllIntervals['OpenCard_'+playerId] = undefined;
                                            var infoDiv = $('#info-player-'+id);
                                            var lis = infoDiv.find('div.data.skills > ul:first > li');
                                            for(var p = 0 ; p < 3 ; p++){
                                                lis[keys[p]].style.backgroundColor = '#00585d';
                                                $(lis[keys[p]]).append('<label style="float:left;">'+["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV"][p]+'</label>');
                                            }
                                            infoDiv.find('.skill').each(function(){
                                                var skillValue = parseFloat(this.textContent);
                                                $(this).mouseenter(function(){
                                                    var result = GetMaxSkillValue(skillValue,parseInt(scriptData.yTrainerLevel)+0.5);
                                                    if(result.numberOfTraining>0){
                                                        $(this).css('color','#5eff0c');
                                                        $(this).css('font-weight','bold');
                                                        $(this).attr('title',scriptTexts.AfterTrainings(result.numberOfTraining));
                                                        $(this).text(result.maxvalue);
                                                    }
                                                });
                                                $(this).mouseleave(function(){
                                                    $(this).css('color','');
                                                    $(this).css('font-weight','');
                                                    $(this).removeAttr('title');
                                                    $(this).text(skillValue);
                                                });
                                            });
                                            return false;
                                        }
                                        if(max===0){
                                            clearInterval(AllIntervals['OpenCard_'+playerId]);
                                            AllIntervals['OpenCard_'+playerId] = undefined;
                                        }
                                        max--;
                                    },50);
                                });
                            }
                            function controlEvents(u1,u2,k3,k4,k5,k6){
                                var title1=u1.html(),
                                    title2=u2.html();
                                u1[0].title = '+'+(k3-k6).toFixed(2)+' / +'+(k5-k6).toFixed(2);
                                u2[0].title = '+'+(k4-parseInt(title2));
                                u1.add(u2).mouseenter(function(){
                                    u1.html('<label style="color:#00e7ff;">'+k3+' / '+k5+'</label>');
                                    u2.html('<label style="color:#00e7ff;">'+k4+'</label>');
                                });
                                u1.add(u2).mouseleave(function(){
                                    u1.html(title1);
                                    u2.html(title2);
                                });
                            }
                        }
                    }
                    if($('#players-table-overview-club > tbody').find('.open-card').length){
                        var key = 'YoungPlayers';
                        var YoungPlayers = GetCookie(key)===undefined?{MessageBox:{},show:[]}:GetCookie(key);
                        $('#players-table-overview-club > tbody > tr').each(function(){
                            if(IsYoungPlayer($('td:nth-child(12)',this)[0])){
                                var playerId = $('.open-card',this).attr('pid').split('-')[1];
                                var find = false;
                                for(var i = 0 ; i < YoungPlayers.show.length ; i++){
                                    if(YoungPlayers.show[i].id == playerId){
                                        find = true;
                                        break;
                                    }
                                }
                                if(!find){
                                    var playerName = $('.player-name',this).text().trim();
                                    var data = {
                                        position : $('td:nth-child(3)',this).text().trim(),
                                        strength : parseInt($('td:nth-child(4)',this).attr('sortvalue')),
                                        age : parseInt($('td:nth-child(5)',this).text()),
                                        name : playerName,
                                        id : playerId
                                    };
                                    if(YoungPlayers.MessageBox[playerName]!==undefined){
                                        data.date = YoungPlayers.MessageBox[playerName];
                                    }
                                    else{
                                        var now = new Date(GetServerTime());
                                        data.date = TwoDigit(now.getDate())+'.'+TwoDigit(now.getMonth()+1)+'.'+now.getFullYear();
                                    }
                                    YoungPlayers.show.splice(0,0,data);
                                }
                            }
                        });
                        SetCookie(key,YoungPlayers);
                    }
                    FeaturesOfScript.push("YoungPlayersHistory");
                    if(scriptData.FeaturesOfScript.YoungPlayersHistory){
                        var key = 'YoungPlayers';
                        var data = GetCookie(key)===undefined?{MessageBox:{},show:[]}:GetCookie(key);
                        var players = Object.values(data.show);
                        if(players.length){
                            var max = 10;
                            var sayfaSayısı = 0;
                            var acıkSayfa = 1;
                            if(players.length){
                                var html = '<hr>'+
                                    '<div class="table-container" id="container-genc">'+
                                    '<h3><st k="TitleOfYoungPlayersTable">'+scriptTexts.TitleOfYoungPlayersTable+'</st></h3>';
                                html +='<table id="genc-oyuncular-tablo" class="sortable-table sortable">'+
                                    '<thead>'+
                                    '<tr class="">'+
                                    '<th class="name-column sortcol"><st k="Name">'+scriptTexts.Name+'</st><span class="sort-status"></span></th>'+
                                    '<th class="position-column sortcol"><st k="Position">'+scriptTexts.Position+'</st><span class="sort-status"></span></th>'+
                                    '<th class="strength-column sortcol" tooltip="tt_strength">Ø<span class="sort-status"></span></th>'+
                                    '<th class="age-column sortcol"><st k="Age">'+scriptTexts.Age+'</st><span class="sort-status"></span></th>'+
                                    '<th class="sortcol"><st k="Date">'+scriptTexts.Date+'</st><span class="sort-status"></span></th>'+
                                    '</tr>'+
                                    '</thead>'+
                                    '<tfoot><tr class="even"><td class="last-column" colspan="5"></td></tr></tfoot>'+
                                    '<tbody id="tbody-genc-oyuncular">';
                                html += tabloOlustur();
                                html += '</tbody></table>';
                                html+='</div>';
                                $('#squad > div.squad.personal').append(html);
                                sayfaSayısı = Math.ceil(players.length/max);
                                if(sayfaSayısı>1){
                                    menüOlustur(false);
                                }
                            }
                            function tabloOlustur(){
                                var t ='';
                                for(var i = 0 , k = (acıkSayfa-1)*max ; i < max && i+k < players.length ; i++){
                                    var player = players[i+k];
                                    t+='<tr class="'+(i%2==0?"odd":"even")+'">'+
                                        '<td class="name-column"><span pid="player-'+player.id+'" class="icon details open-card"></span><span class="player-name">'+player.name+'</span></td>'+
                                        '<td>'+player.position+'</td>'+
                                        '<td sortvalue="'+player.strength+'">'+player.strength+' </td>'+
                                        '<td>'+player.age+'</td>'+
                                        '<td>'+player.date+'</td>';
                                }
                                return t;
                            }
                            function sayfaOlustur(sayfa){
                                return '<label class="page" style="color:white;cursor:pointer;text-decoration: underline;">'+sayfa+'</label>'+' | ';
                            }
                            function menüOlustur(c){
                                var text = '<div class="pager">';
                                if(acıkSayfa>=15){
                                    for(var i = 1 ; i <=3 ; i++){
                                        text+=sayfaOlustur(i);
                                    }
                                    text+='... | ';
                                    for(var i = acıkSayfa-10 ; i < acıkSayfa ; i++){
                                        text+=sayfaOlustur(i);
                                    }
                                }
                                else{
                                    for(var i = 1 ; i < acıkSayfa ; i++){
                                        text+=sayfaOlustur(i);
                                    }
                                }
                                text+='<strong>'+acıkSayfa+'</strong>'+(acıkSayfa!==sayfaSayısı?' | ':'');
                                if(acıkSayfa<=sayfaSayısı-14){
                                    for(var i = acıkSayfa+1 ; i<=acıkSayfa+10; i++){
                                        text+=sayfaOlustur(i);
                                    }
                                    text+='... | ';
                                    for(var i = sayfaSayısı-2 ; i < sayfaSayısı ; i++){
                                        text+=sayfaOlustur(i);
                                    }
                                }
                                else{
                                    for(var i = acıkSayfa+1 ; i < sayfaSayısı ; i++){
                                        text+=sayfaOlustur(i);
                                    }
                                }
                                if(acıkSayfa!==sayfaSayısı){
                                    text+='<label class="page" style="color:white;cursor:pointer;text-decoration: underline;">'+sayfaSayısı+'</label>';
                                }
                                text+=' Toplam : '+players.length+'</div>';
                                var e = $('#genc-oyuncular-tablo');
                                if(c){
                                    e.prev().remove();
                                    e.next().remove();
                                }
                                e.before(text);
                                e.after(text);
                                $('#container-genc').find('.page').click(function(){
                                    acıkSayfa = parseInt($(this).text());
                                    $('#tbody-genc-oyuncular').html(tabloOlustur());
                                    menüOlustur(true);
                                });
                            }
                        }
                    }
                }
                else if(IsPage('area=user&module=formation&action=index')){
                }
                else if(IsPage('area=user&module=team&action') && !IsPage('area=user&module=team&action=camp')){
                    if(IsPage('team&action=index')){
                        if(GetCookie("TrainingGroups")!==undefined){
                            FeaturesOfScript.push("TrainingGroups");
                            if(scriptData.FeaturesOfScript.TrainingGroups){
                                var data = GetCookie("TrainingGroups");
                                $('#training > div.schedule > div.table-container > table > tbody > tr').each(function(i){
                                    if($('th',this).length){
                                        var grupId = i/4 + 1;
                                        var th = $('th',this)[1];
                                        th.style.textAlign = 'left';
                                        th.style.fontSize = '11px';
                                        toolTipObj.data['showPlayersInGroups']='<st k="NoInformation">'+scriptTexts.NoInformation+'</st>!';
                                        if(data[grupId]!==undefined){
                                            var oyuncuSayısı = data[grupId].length;
                                            if(oyuncuSayısı!==0){
                                                th.innerHTML = scriptTexts.TrainingGroupInformation('<strong grupId="'+grupId+'" style="color:green;font-size:12px;cursor:default;" tooltip="showPlayersInGroups">'+oyuncuSayısı+'</strong>');
                                                $('strong',th).mouseenter(function(){
                                                    var d = GetCookie("TrainingGroups")[$(this).attr('grupId')];
                                                    var text = '';
                                                    for(var i = 0 ; i < d.length ; i++){
                                                        text+='['+d[i].position+'] '+d[i].name+'<br>';
                                                    }
                                                    text = text.substring(0,text.length-4);
                                                    toolTipObj.data['showPlayersInGroups'] = text;
                                                });
                                            }
                                            else{
                                                th.innerHTML = '<st k="NoPlayersInTheGroup">'+scriptTexts.NoPlayersInTheGroup+'</st>';
                                            }
                                        }
                                        else{
                                            th.innerHTML = '<st k="NoRecord">'+scriptTexts.NoRecord+'</st>';
                                        }
                                    }
                                });
                            }
                        }
                        FeaturesOfScript.push("AutomaticTraining");
                        if(scriptData.FeaturesOfScript.AutomaticTraining){
                            var data = GetCookie('AutomaticTraining')===undefined?{autoSetTraining:true,groups:{}}:GetCookie('AutomaticTraining');
                            var groups = data.groups;
                            $('#training > div.schedule > h3:nth-child(2)').after('<div style="float:right;"><label for="autoSetTraining" style="cursor:pointer;color:white;"><st k="AutomaticTraining">'+scriptTexts.AutomaticTraining+'</st> </label>'+CreateCheckBox('autoSetTraining',data.autoSetTraining?true:false,'float:right;margin: -2px 0 0 2px;')+'</div>');
                            $('#autoSetTraining').click(function(){
                                data.autoSetTraining = this.checked;
                                SetCookie('AutomaticTraining',data);
                            });
                            var TrainingWait = false;
                            var allP = [];
                            var KontrolClick = false; //deaktiviert*//
                            function mouseEnterLeave(a,e){
                                var kontrol = false;
                                e.mouseenter(function(){
                                    kontrol = true;
                                });
                                e.mouseleave(function(){
                                    kontrol = false;
                                });
                                e.click(function(){
                                    KontrolClick = false;
                                    removeSkillGroup(this);
                                    a.unbind('mouseenter');
                                    a.unbind('mouseleave');
                                    e.off();
                                    setTimeout(()=>{KontrolClick=true;},10);
                                });
                                a.mouseenter(function(){
                                    e.show('fast');
                                });
                                a.mouseleave(function(){
                                    setTimeout(function(){
                                        if(!kontrol){
                                            e.hide('fast');
                                        }
                                    },1);
                                });
                            }
                            $('#training > div.schedule > div.table-container > table > tbody > tr').each(function(i){
                                if($('th',this).length){
                                    i/=4;
                                    var a = $('th',this).first();
                                    a.html('<span class="groupName" id="groupIndex_'+i+'">'+a.html().trim()+'</span>'+'<div id="training_Group_'+i+'" style="border: 1px solid #5a8349;height: 33px; width: 60px;float:left;cursor:pointer;margin-Left:-5px;"></div>');
                                    if(groups['training_Group_'+i]!==undefined){
                                        var skill = groups['training_Group_'+i];
                                        $('#training_Group_'+i).html('<span class="icon '+skill+'" style="margin-Top:6px;"></span>');
                                        $('#training_Group_'+i).append('<img class="cancelTrainingGroup" style="float: right; display: block; margin: -26px 0px 0px 49px;cursor: url('+sources.get('cursor','png')+'),auto;display:none;" src="'+sources.get('delete','png')+'" alt="delete" width="10px">');
                                        mouseEnterLeave(a.find('div').first(),a.parents('tr').first().find('.cancelTrainingGroup').first());
                                        var o = $('#training_Group_'+i).parents('tr').first();
                                        if(allP[skill]===undefined){
                                            allP[skill] = [];
                                        }
                                        allP[skill] = FindTrainings(o,allP[skill],skill);
                                    }
                                    $('#training_Group_'+i).click(function(){
                                        if(KontrolClick){
                                            var skill = null;
                                            $('.skill-list').first().find('img').each(function(){
                                                var a = this.src;
                                                if(a.substring(a.lastIndexOf('/')+1).indexOf('grey')!==-1){
                                                    skill = this.getAttribute('skill');
                                                    skill = skill==="skill-motivation"?null:skill;
                                                }
                                            });
                                            if(skill!==null){
                                                var o = $(this).parent().parent();
                                                $(this).html('<span class="icon '+skill+'" style="margin-Top:6px;"></span>');
                                                if(!o.find('.cancelTrainingGroup').length){
                                                    $(this).append('<img class="cancelTrainingGroup" style="float: right; display: block; margin: -26px 0px 0px 49px;cursor: url('+sources.get('cursor','png')+'),auto;display:none;" src="'+sources.get('delete','png')+'" alt="delete" width="10px">');
                                                    mouseEnterLeave(o.find('th > div').first(),o.find('img').first());
                                                    o.find('th > div').first().trigger('mouseenter');
                                                }
                                                data.groups[this.id] = skill;
                                                SetCookie('AutomaticTraining',data);
                                                var o = $(this).parents('tr').first();
                                                Training(FindTrainings(o,[],skill));

                                            }
                                        }
                                    });
                                }
                            });
                            function removeSkillGroup(e){
                                $(e).parent().find('.icon').remove();
                                data.groups[$(e).parent().attr('id')] = undefined;
                                SetCookie('AutomaticTraining',data);
                                $(e).remove();
                            }
                            function setSkill(skill){
                                $('.skill-list').first().find('img').each(function(){
                                    var a = this.src;
                                    if(a.substring(a.lastIndexOf('/')+1).indexOf(skill)!==-1){
                                        $(this).click();
                                        return false;
                                    }
                                });
                            }
                            function FindTrainings(o,p,skill){
                                for(var n = 0 ; n < 3; n++){
                                    o = o.next();
                                    var e = o[0].getElementsByClassName('training');
                                    for(var m = 0 ; m < e.length ; m++){
                                        if($('span',e[m]).length){
                                            if($('span',e[m]).first().attr('class').indexOf(skill)!==-1){
                                                continue;
                                            }
                                        }
                                        p.push(e[m]);
                                    }
                                }
                                return p;
                            }
                            function Training(p){
                                if(!TrainingWait){
                                    TrainingWait = true;
                                    setTraining(p);
                                }
                            }
                            function setTraining(p){
                                if(p.length){
                                    var max = 200;
                                    var s = setInterval(function(){
                                        if(max===0){
                                            clearInterval(s);
                                        }
                                        if(!$(".load-icon").hasClass('loading')){
                                            p[0].click();
                                            p.splice(0,1);
                                            clearInterval(s);
                                            setTraining(p);
                                        }
                                        max--;
                                    },50);
                                }
                                else{
                                    var max = 200;
                                    var s = setInterval(function(){
                                        if(max===0){
                                            clearInterval(s);
                                        }
                                        if(!$(".load-icon").hasClass('loading')){
                                            TrainingWait = false;
                                            clearInterval(s);
                                        }
                                        max--;
                                    },50);
                                }
                            }
                            if(data.autoSetTraining){
                                var groups = [];
                                var trainings = [];
                                for(var i in allP){
                                    if(allP[i].length){
                                        groups.push(i);
                                        trainings.push(allP[i]);
                                    }
                                }
                                var s = setInterval(function(){
                                    if(groups.length){
                                        if(!TrainingWait){
                                            setSkill(groups[0]);
                                            Training(trainings[0]);
                                            groups.splice(0,1);
                                            trainings.splice(0,1);
                                        }
                                    }
                                    else{
                                        clearInterval(s);
                                    }
                                },100);
                            }
                        }
                    }
                    else if(IsPage('team&action=groups')){
                        FeaturesOfScript.push("TrainingControl");
                        if(scriptData.FeaturesOfScript.TrainingControl){
                            TrainingControl();
                        }
                        /*-------------TrainingGroups----------*/
                        var data = {};
                        $('#players-table-skills > tbody > tr').each(function(i){
                            var grupId = $('#'+i).find('select').val();
                            var playerName = $('.player-name',this).text().trim();
                            var position = $('td:nth-child(3)',this).text().trim();
                            var kayıt = {name:playerName,position:position};
                            if(data[grupId]===undefined){
                                data[grupId] = [kayıt];
                            }
                            else{
                                data[grupId].push(kayıt);
                            }
                        });
                        var mk = $('#0 > select')[0].options.length;
                        for(var i = 1 ; i<= mk ; i++){
                            if(data[i]===undefined){
                                data[i]=[];
                            }
                        }
                        SetCookie('TrainingGroups',data);
                        /*--------------------------------------*/
                    }
                    else if(IsPage('team&action=settings')){
                        var elementOfGroups = $('#groupNameForm > table > tbody').find('input');
                        elementOfGroups.attr('maxlength',16);
                        elementOfGroups.mouseenter(function(){
                            $(this).focus();
                            $(this).attr('placeHolder',$(this).val());
                            $(this).val('');
                        });
                        elementOfGroups.mouseleave(function(){
                            if($(this).val()===""){
                                $(this).val($(this).attr('placeHolder'));
                            }
                            $(this).removeAttr('placeHolder');
                            $(this).focusout();
                        });
                    }
                }
                else if(IsPage('area=user&module=team&action=camp')){
                    FeaturesOfScript.push("CampHistory");
                    if(scriptData.FeaturesOfScript.CampHistory){
                        var key = 'CampHistory';
                        var data = GetCookie(key)==undefined?[]:GetCookie(key);
                        var allCamps =
                            '<div id="allCamps">'+
                            '<div class="image" style="margin-Right:3px; background-position: 0px -641px; float: left; opacity: 0.2;" id="camps_1"></div>'+
                            '<div class="image" style="margin-Right:3px; background-position: 0px -962px; float: left; opacity: 0.2;" id="camps_2"></div>'+
                            '<div class="image" style="margin-Right:3px; background-position: 0px -214px; float: left; opacity: 0.2;" id="camps_3"></div>'+
                            '<div class="image" style="margin-Right:3px; background-position: 0px -534px; float: left; opacity: 0.2;" id="camps_4"></div>'+
                            '<div class="image" style="margin-Right:3px; background-position: 0px -748px; float: left; opacity: 0.2;" id="camps_5"></div>'+
                            '<div class="image" style="margin: auto; background-position: 0px -321px; float: left; opacity: 0.2;" id="camps_6"></div>'+
                            '</div>';
                        $('#camp').append(allCamps);
                        if(data.length){/*Show*/
                            var activeCamps = [];
                            var text =
                                '<table id="lastCamps">'+
                                '<thead>'+
                                '<tr style="background:url();">'+
                                '<th colspan="7"><st k="PreviouslyVisitedCamps">'+scriptTexts.PreviouslyVisitedCamps+'</st></th>'+
                                '</tr>'+
                                '<tr>'+
                                '<th style="text-align:left;"><st k="No">'+scriptTexts.No+'</st></th>'+
                                '<th style="text-align:left;"><st k="Camp">'+scriptTexts.Camp+'</st></th>'+
                                '<th style="text-align:left;"><st k="Country">'+scriptTexts.Country+'</st></th>'+
                                '<th style="text-align:left;"><st k="Price">'+scriptTexts.Price+'</st></th>'+
                                '<th style="text-align:left;"><st k="_Skills">'+scriptTexts._Skills+'</st></th>'+
                                '<th style="text-align:left;"><st k="Definition">'+scriptTexts.Definition+'</st></th>'+
                                '<th style="text-align:left;"><st k="Date">'+scriptTexts.Date+'</st></th>'+
                                '</tr>'+
                                '</thead>'+
                                '<tbody>';
                            for(var i = 0 ; i < data.length ;i++){
                                var camp = data[i];
                                activeCamps.push(camp.campNo);
                                var imagesPos = [641,962,214,534,748,321][camp.campNo-1];
                                text+='<tr>'+
                                    '<td style="color:white;font-weight: bold;text-align:center;">'+(i+1)+'</td>'+
                                    '<td width="160" style="text-align:left;">'+
                                    '<h3 style="margin:0;">'+camp.campName+'</h3>'+
                                    '<div class="image" style="display:none;margin: 1px auto 3px; background-position: 0 -'+imagesPos+'px;"></div></td>'+
                                    '<td width="100" style="text-align:left;">'+
                                    '<img class="flag" name="__tooltip" tooltip="tt_'+camp.country.img+'" src="/static/images/countries/'+camp.country.img+'.gif" alt=""> '+camp.country.name+'</td>'+
                                    '<td width="80" style="text-align:left;">'+camp.price+
                                    '<span class="icon currency"></span></td>'+
                                    '<td style="text-align:left;">';
                                for(var j = 0 ; j < camp.skills.length ; j++){
                                    text+='<span style="margin-Right:3px;" class="icon '+camp.skills[j]+'" name="__tooltip" tooltip="tt_'+camp.skills[j]+'"></span>';
                                }
                                text+='</td>'+
                                    '<td style="white-space: pre-wrap;font-Size:10px;line-height: 1.5;text-align:left;">'+camp.description+'</td>'+
                                    '<td>'+
                                    '<img src="'+sources.get('clock','png')+'" alt="clock" style="margin:0 2px 1px 0;cursor:help;text-align:left;" title="'+scriptTexts.ServerDate+'">'+dateFormat(camp.date)+'</td></tr>';
                            }
                            function dateFormat(a){
                                var b = a.split('.');
                                b = new Date(b[2],parseInt(b[1])-1,parseInt(b[0])+3);
                                return a+' - ' + TwoDigit(b.getDate())+'.'+TwoDigit(b.getMonth()+1)+'.'+b.getFullYear();
                            }
                            text+='</tbody> <tfoot> <tr> </tr> </tfoot> </table>';
                            $('#allCamps').before(text);
                            $('#lastCamps').find('.image').each(function(){
                                var td = $(this).parent('td');
                                var image = this;
                                td.mouseenter(function(){
                                    image.style.display='';
                                });
                                td.mouseleave(function(){
                                    image.style.display='none';
                                });
                            });
                            for(var i = 0 ; i < activeCamps.length ; i++){
                                $('#camps_'+activeCamps[i]).css('opacity','');
                            }
                        }
                        if(!$('#camp > div.list-container > ul > li.disabled').length){/*Save*/
                            console.log('Camp Save | Please check me');
                            var camps = $('#camp > div.list-container > ul > li');
                            camps.each(function(){
                                var parent = this;
                                var buton = $('div.buttons > span > a',this);
                                var href = buton.attr('href');
                                buton.removeAttr('href');
                                buton.click(function(){
                                    var skills = $('ul > li',parent);
                                    var _skills = [];
                                    skills.each(function(){
                                        _skills.push($('span',this).first().attr('class').replace('icon ',''));
                                    });
                                    var price = $('span.currency-number',parent).text().trim();
                                    var country = {name:'Berlin',img:'DEU'};
                                    country.name = $('p',parent).first().text().trim();
                                    var img = $('p > img',parent).first().attr('src');
                                    country.img = img.substring(img.lastIndexOf('/')+1,img.lastIndexOf('.'));
                                    var description = $('p.description',parent).text().trim();
                                    /*DAHA SONRA BAK*/var date = $('span',this).first().text().trim();
                                    date = date.substring(date.lastIndexOf(' ')+1);
                                    var campNo = $(parent).attr('class').replace('camp-','');
                                    var campName = $('h3',parent).first().text();
                                    data.splice(0,0,{
                                        campName:campName,
                                        campNo:campNo,
                                        date:date,
                                        skills:_skills,
                                        price:price,
                                        country:country,
                                        description:description,
                                    });
                                    SetCookie(key,data);
                                    buton.attr('href',href);
                                    location.href = href;
                                });
                            });
                        }
                    }
                }
                else if(IsPage('area=user&module=transfermarket&action=scout')){
                }
                else if(IsPage('area=user&module=transfermarket&action=index')){
                    /**/
                    $('#club').after('<img style="float:right;margin:2px 2px 0 0;cursor:pointer;" id="clearText" src="'+sources.get('remove','png')+'" alt="remove" width="10px">');
                    $('#clearText').click(function(){
                        clearText('club');
                    });
                    /*Features : TransferDates*/
                    FeaturesOfScript.push("TransferDates");
                    if(scriptData.FeaturesOfScript.TransferDates){
                        var save = false;
                        if(GetCookie('LeagueData') !==undefined){
                            if((GetCookie('LeagueData').SonMacTarihi+86400000)<=GetServerTime()){
                                save = true;
                            }else{
                                ShowTransfermarktDates();
                            }
                        }
                        else{
                            save = true;
                        }
                        if(save){
                            getPageData('#/index.php?w='+worldId+'&area=user&module=statistics&action=games','content',function(html){
                                SaveLeagueData($(html),ShowTransfermarktDates);
                            });
                        }
                        function ShowTransfermarktDates(){
                            var LigVerileri = GetCookie('LeagueData');
                            const aDay = 24*60*60*1000;
                            var OyuncularınGeldigiSaat = {saat:3,dakika:0,saniye:0};
                            OyuncularınGeldigiSaat = (OyuncularınGeldigiSaat.saat*3600+OyuncularınGeldigiSaat.dakika*60+OyuncularınGeldigiSaat.saniye)*1000;
                            var IlkMacTarihi = LigVerileri.IlkMacTarihi;
                            var IlkYarıSonMacTarihi= LigVerileri.IlkYarıSonMacTarihi;
                            var SonMacTarihi= LigVerileri.SonMacTarihi;
                            var now = GetServerTime();
                            var OyuncularınGelmeTarihi = null;
                            var TransferinDegisecegiTarih = null;
                            if((IlkMacTarihi-2*aDay+OyuncularınGeldigiSaat)>now){
                                /*Alınan Oyuncu Bir Sonraki Gün Gelecek*/
                                OyuncularınGelmeTarihi = new Date(new Date(now).getFullYear(),new Date(now).getMonth(),new Date(now).getDate()+1).getTime()+OyuncularınGeldigiSaat;
                                TransferinDegisecegiTarih = IlkMacTarihi-2*aDay+OyuncularınGeldigiSaat;
                            }
                            else if((IlkYarıSonMacTarihi+OyuncularınGeldigiSaat)>now){
                                /*Alınan Oyuncu Lig Arasında Gelecek*/
                                OyuncularınGelmeTarihi = IlkYarıSonMacTarihi+aDay+OyuncularınGeldigiSaat;
                                TransferinDegisecegiTarih = IlkYarıSonMacTarihi+OyuncularınGeldigiSaat;
                            }
                            else if((IlkYarıSonMacTarihi+OyuncularınGeldigiSaat)<=now && (IlkYarıSonMacTarihi+OyuncularınGeldigiSaat+aDay)>now){
                                OyuncularınGelmeTarihi = IlkYarıSonMacTarihi+aDay+OyuncularınGeldigiSaat;
                            }
                            else{
                                /*Alınan Oyuncu Lig Sonunda Gelecek*/
                                OyuncularınGelmeTarihi = SonMacTarihi+aDay+OyuncularınGeldigiSaat;
                            }
                            var baslik = $('#content > h2:nth-child(1)');
                            var baslikText = baslik.text();
                            var transferTarihi = baslikText.substring(baslikText.lastIndexOf(':')+1,baslikText.lastIndexOf(')')).trim();
                            var text = '<st k="TransferDate">'+scriptTexts.TransferDate+'</st> : ' + transferTarihi;
                            text+='             <st k="FootballersAreComing">'+scriptTexts.FootballersAreComing+'</st> : <label style="color:#17fc17;" intervalName="OyuncularGelecek" class="cntDwnTrnsfMrkt" title="'+ShowDate(parseInt(OyuncularınGelmeTarihi/1000))+'" lastDate="'+OyuncularınGelmeTarihi+'"></label>';
                            if(TransferinDegisecegiTarih){
                                text+='             <st k="TransferDateWillChange">'+scriptTexts.TransferDateWillChange+'</st> : <label style="color:orange;" intervalName="TarihDegisecek" class="cntDwnTrnsfMrkt" title="'+ShowDate(parseInt(TransferinDegisecegiTarih/1000))+'" lastDate="'+TransferinDegisecegiTarih+'"></label>';
                            }
                            baslik.html(text);
                            $('.cntDwnTrnsfMrkt').each(function(){
                                var t = $(this);
                                var intervalName = t.attr('intervalName');
                                geriSay();
                                AllIntervals[intervalName] = setInterval(function(){
                                    geriSay();
                                },1000);
                                function geriSay(){
                                    var sec =( parseInt(t.attr('lastDate'))-GetServerTime())/1000;
                                    if(sec<=0){
                                        clearInterval(AllIntervals[intervalName]);
                                        AllIntervals[intervalName] = undefined;
                                        t.html('<st k="ItIsOver">'+scriptTexts.ItIsOver+'</st>');
                                        return;
                                    }
                                    var min=0,hour=0,day=0;
                                    if(sec>59){
                                        min = parseInt(sec/60);
                                        sec = sec%60;
                                        if(min>59){
                                            hour = parseInt(min/60);
                                            min = min%60;
                                            if(hour>23){
                                                day = parseInt(hour/24);
                                                hour = hour%24;
                                            }
                                        }
                                    }
                                    var r = '';
                                    if(day!=0){
                                        var d = day==1?'aDay':'Days';
                                        r = day + ' <st k="'+d+'">'+scriptTexts[d]+'</st> ';
                                    }
                                    if(day!=0 || hour!=0){
                                        r += TwoDigit(hour)+':';
                                    }
                                    if(day!=0 || hour!=0 || min!=0){
                                        r += TwoDigit(min)+':';
                                    }
                                    t.html(r+TwoDigit(sec));
                                }
                            });
                        }
                    }
                    /*Features : OfferWasPassed*/
                    if(GetCookie('increaseBid')!==undefined){
                        FeaturesOfScript.push("GoOffer");
                        if(scriptData.FeaturesOfScript.GoOffer){
                            var playerName = GetCookie('increaseBid');
                            DeleteCookie('increaseBid');
                            if($('#own-offers > tbody').find('.open-card').length){
                                $('#own-offers > tbody > tr').each(function(){
                                    if(playerName === $(this).find('.name-column').first().text().trim()){
                                        var tr = this;
                                        $('html, body').animate({ scrollTop: getOffset(tr).top }, 'fast');
                                        setTimeout(function(){
                                            tr.style = 'background-color: #fff2ac; background-image: linear-gradient(to right, #ffe359 0%, #fff2ac 100%);';
                                            setTimeout(function(){
                                                tr.style='';
                                            },2000);
                                        },200);
                                        return;
                                    }
                                });
                            }
                        }
                    }
                    /*Show bought players*/
                    FeaturesOfScript.push("ShowBoughtPlayers");
                    if(scriptData.FeaturesOfScript.ShowBoughtPlayers){
                        var data = GetCookie('PlayersData')==undefined?{}:GetCookie('PlayersData');
                        if(data.BuyPlayers==undefined)
                            data.BuyPlayers = [];
                        var BoughtPlayers = data.BuyPlayers;
                        if(BoughtPlayers.length){
                            ShowBoughtPlayersList(BoughtPlayers);
                            ShowProfit();
                        }
                        else{
                            UploadPlayersData();
                        }
                        function ShowBoughtPlayersList(BoughtPlayers){
                            var text =
                                '<h3><st k="ListofPurchasedFootballers">'+scriptTexts.ListofPurchasedFootballers+'</st>'+
                                '<img style="float:right;cursor:pointer;margin-Right:5px;" src="'+sources.get('download','png')+'" alt="download" width="15px" height="15px" title="Liste Herunterladen" id="downloadData">'+
                                '<img style="margin-Right:7px;float:right;cursor:pointer" src="'+sources.get('remove2','png')+'" alt="remove2" width="15px" height="15px" title="Lösche die Liste" id="RemovePlayersData">'+
                                '</h3>'+
                                '<table class="sortable-table sortable" id="purchased-players">'+
                                '<thead>'+
                                '<tr class="">'+
                                '<th class="nosort"><st k="Country">'+scriptTexts.Country+'</st></th>'+
                                '<th class="name-column sortcol"><st k="Name">'+scriptTexts.Name+'</st><span class="sort-status"></span></th>'+
                                '<th class="sortcol"><st k="SortPosition">'+scriptTexts.SortPosition+'</st><span class="sort-status"></span></th>'+
                                '<th class="sortcol" name="__tooltip" tooltip="tt_strength"> Ø <span class="sort-status"></span></th>'+
                                '<th class="sortcol"><st k="Age">'+scriptTexts.Age+'</st><span class="sort-status"></span></th>'+
                                '<th class="sortcol"><st k="Salary">'+scriptTexts.Salary+'</st><span class="sort-status"></span></th>'+
                                '<th class="sortcol"><st k="Price">'+scriptTexts.Price+'</st></th>'+
                                '<th class="nosort"><st k="Contract">'+scriptTexts.Contract+'</st><span class="sort-status"></span></th>'+
                                '<th class="sortcol"><st k="Club">'+scriptTexts.Club+'</st><span class="sort-status"></span> </th>'+
                                '<th class="sortcol"><st k="Date">'+scriptTexts.Date+'</st><span class="sort-status"></span></th>'+
                                '<th class="sortcol"><st k="Delete">'+scriptTexts.Delete+'</st></th>'+
                                '</tr>'+
                                '</thead>'+
                                '<tfoot>'+
                                '<tr class="even">'+
                                '<td class="last-column" colspan="9"></td>'+
                                '</tr>'+
                                '</tfoot>'+
                                '<tbody>';
                            for(var i = 0 ; i < BoughtPlayers.length ; i++){
                                var a = BoughtPlayers[i];
                                var season = (a.season==1?"Season":"Seasons");
                                season = '<st k="'+season+'">'+scriptTexts[season]+'</st>';
                                text+=
                                    '<tr class="'+(i%2===0?"odd":"even")+'">'+
                                    '<td> <img name="__tooltip" tooltip="tt_'+a.playerCountry+'" src="/static/images/countries/'+a.playerCountry+'.gif"> </td>'+
                                    '<td style="white-space: pre-wrap;line-height: 1.5;width:25%;max-width:30%;text-align:left;">'+
                                    '<span pid="player-'+a.playerId+'" class="icon details open-card"></span>'+
                                    '<span class="player-name">'+a.playerName+'</span>'+
                                    '</td>'+
                                    '<td>'+a.position+'</td>'+
                                    '<td>'+a.strength+'</td>'+
                                    '<td>'+a.age+'</td>'+
                                    '<td>'+(a.salary).toLocaleString()+'<span class="icon currency"></span></td>'+
                                    '<td>'+(a.price).toLocaleString()+'<span class="icon currency"></span></td>'+
                                    '<td>'+a.season+' '+season+'</td>'+
                                    '<td style="text-align: left;white-space: pre-wrap;line-height: 1.5;width:17%;max-width:20%;" sortvalue="'+a.club.name+'">'+
                                    '<a href="#/index.php?w='+worldId+'&amp;area=user&amp;module=profile&amp;action=show&amp;clubId='+a.club.id+'" clubid="'+a.club.id+'">'+a.club.name+'</a>'+
                                    '</td>'+
                                    '<td>'+a.date+'</td>'+
                                    '<td class="last-column">'+
                                    '<img class="DeletePurchasedPlayerData" id="remove_player_'+a.playerId+'" src="'+sources.get('remove3','png')+'" alt="remove3" heigth="15px" width="15px" style="cursor:pointer">'+
                                    '</td>'+
                                    '</tr>';
                            }
                            text+='</tbody> </table>';
                            $('#own-offers').after(text);
                            $('#downloadData').click(function(){
                                DownloadData("Bought Players' Datas", JSON.stringify(BoughtPlayers));
                            });
                            $('#RemovePlayersData').click(function(){
                                if(confirm(scriptTexts.Warning)){
                                    $('#purchased-players').prev().remove();
                                    $('#purchased-players').remove();
                                    var data = GetCookie('PlayersData');
                                    data.BuyPlayers = undefined;
                                    SetCookie('PlayersData',data);
                                    UploadPlayersData();
                                }
                            });
                            $('#purchased-players').find('.DeletePurchasedPlayerData').click(function(){
                                var playerId = $(this).attr('id').split('_')[2];
                                for(var i = 0 ; i < BoughtPlayers.length ; i++){
                                    var _playerId = BoughtPlayers[i].playerId;
                                    if(_playerId == playerId){
                                        BoughtPlayers.splice(i,1);
                                        var data = GetCookie('PlayersData');
                                        data.BuyPlayers = BoughtPlayers;
                                        SetCookie('PlayersData',data);
                                        var tr = $(this).parents('tr');
                                        var index = tr.index();
                                        tr.hide(400);
                                        setTimeout(function(){
                                            tr.remove();
                                            var players = $('#purchased-players > tbody > tr');
                                            if(players.length){
                                                for(var j = index ; j < players.length ; j++){
                                                    players[j].className = j%2==0?"odd":"even";
                                                }
                                            }
                                            else{
                                                $('#purchased-players').prev().remove();
                                                $('#purchased-players').remove();
                                                UploadPlayersData();
                                            }
                                        },400);
                                        break;
                                    }
                                }
                            });
                        }
                        function UploadPlayersData(){
                            var ekle =
                                '<div align="center">'+
                                '<label style="color: #a5e4c6;font-weight: bold;"><st k="UploadPlayersData">'+scriptTexts.UploadPlayersData+'</st> : </label>'+
                                '<input type="file" accept=".txt" id="UploadPlayerData">'+
                                '</div>';
                            $('#own-offers').after(ekle);
                            var fileInput = document.getElementById('UploadPlayerData');
                            fileInput.addEventListener('change', function(e) {
                                var file = fileInput.files[0];
                                var textType = /text.*/;
                                if (file.type.match(textType)) {
                                    var reader = new FileReader();
                                    reader.onload = function(e) {
                                        var PlayersData = JSON.parse(reader.result);
                                        var data = GetCookie('PlayersData');
                                        data.BuyPlayers = PlayersData;
                                        SetCookie('PlayersData',data);
                                        $('#UploadPlayerData').parent().remove();
                                        ShowBoughtPlayersList(PlayersData);
                                        ShowProfit();
                                    };
                                    reader.readAsText(file);
                                } else {
                                    GiveNotification('<st k="ChooseNotebook">'+scriptTexts.ChooseNotebook+'</st>');
                                }
                            });
                        }
                        function ShowProfit(){
                            var data = GetCookie('PlayersData')==undefined?{BuyPlayers:[]}:GetCookie('PlayersData');
                            if(data.BuyPlayers==undefined)
                                data.BuyPlayers = [];
                            var BoughtPlayers = data.BuyPlayers;
                            if(BoughtPlayers.length){
                                $('#foreigner-offers > tbody > tr').each(function(){
                                    var playerId = $(this).find('.open-card').attr('pid').split('-')[1];
                                    for(var i = 0 ; i < BoughtPlayers.length ; i++){
                                        if(BoughtPlayers[i].playerId == playerId){
                                            var offer = $(this).find('td:nth-child(8)').attr('sortvalue');
                                            if(offer){
                                                offer = parseInt(offer);
                                                var price = BoughtPlayers[i].price;
                                                var profit = offer - price;
                                                var element = $(this).find('td:nth-child(8) > span > span.currency-number');
                                                if(profit>0){
                                                    element.css('color','green');
                                                }else if(profit==0){
                                                    element.css('color','white');
                                                }else{
                                                    element.css('color','red');
                                                }
                                                element.after('<span title="'+(profit<0?scriptTexts.Loss:scriptTexts.Gain)+' : '+(profit).toLocaleString()+' €" style="font-weight: bold;color: blue;display:none;">'+(price).toLocaleString()+'</span>');
                                                Show(element);
                                            }
                                            break;
                                        }
                                    }
                                });
                                function Hide(element){
                                    element.mouseleave(function(){
                                        $(this).off();
                                        $(this).parent().off();
                                        $(this).hide();
                                        $(this).prev().show();
                                        Show($(this).prev());
                                    });
                                    element.parent().mouseleave(function(){
                                        $(this).off();
                                        $(element).off();
                                        element.hide();
                                        element.prev().show();
                                        Show(element.prev());
                                    });
                                }
                                function Show(element){
                                    element.mouseenter(function(){
                                        $(this).off();
                                        $(this).hide();
                                        $(this).next().show();
                                        Hide($(this).next());
                                    });
                                }
                            }
                        }
                    }
                    /**/
                    var playersInTransferMarket = {};
                    $('#content > div.container.transfermarket > div.table-container > table > tbody > tr').each(function(){
                        var card = $(this).find('.open-card');
                        if(card.length){
                            var playerId = card.attr('pid').split('-')[1];
                            playersInTransferMarket[playerId] = {
                                card : card
                            }
                        }
                    });
                    var playersWhoWeOffer = {};
                    if($('#own-offers> tbody').find('.open-card').length){
                        $('#own-offers> tbody > tr').each(function(){
                            var OCard = $(this).find('.open-card');
                            var playerId = OCard.attr('pid').split('-')[1];
                            var price = parseInt($(this).find('td:nth-child(8)').attr('sortvalue'));
                            var bidStatus = $(this).find('td:nth-child(7)').text().trim().toLowerCase();
                            playersWhoWeOffer[playerId]= {price : price, bidStatus : bidStatus};
                            if(bidStatus == scriptData.acceptedBidText){/*Kabul edilen tekliflerimiz*/
                                var add = playersInTransferMarket[playerId]?playersInTransferMarket[playerId].card:undefined;
                                OCard.add(add).click(function(){
                                    var card = this;
                                    $(card).off();
                                    if(!$('#info-player-'+playerId).length){
                                        AllIntervals['OpenCard_'+playerId] = setInterval(function(){
                                            if(!$(card).hasClass('loading')){
                                                clearInterval(AllIntervals['OpenCard_'+playerId]);
                                                AllIntervals['OpenCard_'+playerId] = undefined;
                                                $('#info-player-'+playerId).find('.negotiate-button').click(function(){
                                                    AllIntervals['OpenNegotiationContainer_'+playerId] = setInterval(function(){
                                                        var buyButton = $('#negotiation-bid-player-'+playerId);
                                                        if(buyButton.length){
                                                            clearInterval(AllIntervals['OpenNegotiationContainer_'+playerId]);
                                                            AllIntervals['OpenNegotiationContainer_'+playerId] = undefined;
                                                            buyPlayer(buyButton,OCard,playerId);
                                                        }
                                                    },50);
                                                });
                                            }
                                        },100);
                                    }
                                });
                            }
                        });
                        function buyPlayer(buyButton,OCard,playerId){
                            buyButton.removeClass('negotiation-bid-player');
                            buyButton.click(function(e) {
                                var playerBuy = false;
                                var element = $(this);
                                var id = element.attr('unique');
                                element.hide();
                                element.parent().append($('<div class="load-icon loading" id="loading-' + id + '"></div>'));
                                var playerId = element.attr('player');
                                var clubId = element.attr('club');
                                var amount = '',
                                    duration = '',
                                    offer = '',
                                    params;
                                if ($('#bid-amount-' + id).length > 0 && $('#bid-amount-' + id).val()) {
                                    amount = amountControl[id].numberUnFormat($('#bid-amount-' +id).val());
                                }
                                if ($('#bid-duration-' + id).length > 0 && $('#bid-duration-' + id).val()) {
                                    duration = durationControl[id].numberUnFormat($('#bid-duration-' + id).val());
                                }
                                if ($('#bid-offer-' + id).length > 0 && $('#bid-offer-' + id).val()) {
                                    $('#info-player-' + playerId + ' .abort-negotiation-button-container').first().hide();
                                    offer = $('#bid-offer-' + id).val();
                                    params = {
                                        'elements': JSON.stringify({
                                            'offer': {
                                                0: playerId + ';' + clubId + ';' + offer
                                            }
                                        })
                                    };
                                } else if ($('#bid-amount-' + id).length > 0 && $('#bid-amount-' + id).val()) {
                                    playerBuy = true;
                                    params = {
                                        'elements': JSON.stringify({
                                            'negotiateDebts': {
                                                0: playerId + ';' + clubId + ';amount=' + amount + ';duration=' + duration
                                            }
                                        })
                                    };
                                } else {
                                    params = {
                                        'elements': JSON.stringify({'acceptNegotiation': {0: playerId + ';' + clubId}})
                                    };
                                }
                                $.get( 'index.php?w='+worldId+'&area=user&module=player&action=negotiate&complex=0',params, function( response ) {
                                    var control = false;
                                    if(playerBuy){
                                        // window.location.href = $('span[pid=player-' + 29877417 + ']').first().attr('ref');
                                        if(response.indexOf("window.location.href = $('span[pid=player-' + " + playerId + " + ']').first().attr('ref');")!==-1){
                                            var tr = OCard.parents('tr').first();
                                            var playerData = {};
                                            playerData.playerId = playerId;
                                            playerData.salary = parseInt($('#bid-amount-player-'+playerId).val().split('.').join(''));
                                            playerData.season = parseInt($('#bid-duration-player-'+playerId).val().split('.').join(''));
                                            var playerCountry = tr.find('td:nth-child(1) > img').attr('src');
                                            playerCountry = playerCountry.substring(playerCountry.lastIndexOf('/')+1,playerCountry.lastIndexOf('.'));
                                            playerData.playerCountry = playerCountry;
                                            playerData.date = ShowDate(parseInt(GetServerTime()/1000));
                                            playerData.playerName = tr.find('.player-name:first').text().trim();
                                            playerData.price = parseInt(tr.find('td:nth-child(8)').attr('sortvalue'));
                                            playerData.position = tr.find('td:nth-child(3)').text().trim();
                                            playerData.strength = parseInt(tr.find('td:nth-child(4)').text());
                                            playerData.age = parseInt(tr.find('td:nth-child(5)').text());
                                            playerData.club = {
                                                id:parseInt(tr.find('td:nth-child(6) > a').attr('clubid')),
                                                name:tr.find('td:nth-child(6) > a').text().trim()
                                            };
                                            var key = 'PlayersData';
                                            var data = GetCookie(key)==undefined?{}:GetCookie(key);
                                            if(data.BuyPlayers===undefined)
                                                data.BuyPlayers = [];
                                            data.BuyPlayers.splice(0,0,playerData);
                                            SetCookie(key,data);
                                            response = response.substring(0,response.lastIndexOf('</div>')+6);
                                            $('#negotiation-bid-player-' + playerId).hide();
                                            $('#info-window-player-' + playerId + ' .abort-negotiation-button-container').first().hide();
                                            setTimeout(function(){
                                                location.href = '#/index.php?w='+worldId+'&area=user&module=transfermarket&action=index';
                                                PageLoad(function(){
                                                    GiveNotification(true,scriptTexts.SuccessfullyTransferred(playerData.playerName));
                                                });
                                            },2000);
                                            $('.negotiation table, .negotiation .info').each(function(key, e) {
                                                e.hide();
                                            });
                                        }
                                        else
                                            control = true;
                                    }
                                    element.parent().parent().find('.load-icon').remove();
                                    $('#negotiate-container-' + id).html(response);
                                    if(control){
                                        buyPlayer($('#negotiation-bid-player-'+playerId),OCard,playerId);
                                    }
                                    updateAds();
                                    $('body').trigger('content:changed');
                                });
                            });
                        }
                    }
                    FeaturesOfScript.push("ShowOwnOfferInMarket");
                    if(scriptData.FeaturesOfScript.ShowOwnOfferInMarket){
                        var players = $('#content > div.container.transfermarket > div.table-container > table > tbody');
                        if(players.find('.open-card').length){
                            players = players.find('tr');
                            players.each(function(i){
                                var playerId = $(this).find('.open-card').attr('pid').split('-')[1];
                                if(playersWhoWeOffer[playerId]){
                                    var club = $(this).find('td:nth-child(8) > a');
                                    var bidStatus = playersWhoWeOffer[playerId].bidStatus,
                                        color,
                                        title = '';
                                    switch(bidStatus){
                                        case scriptData.acceptedBidText:
                                            color = '#20ff63';
                                            title = scriptTexts.AcceptedOwnOffer;
                                            break;
                                        case scriptData.rejectedBidText:
                                            color = '#9e0e0e';
                                            title = scriptTexts.RejectedOwnOffer;
                                            break;
                                        case scriptData.readBidText:
                                            color = '#fcbd0f';
                                            title = scriptTexts.ReadOwnOffer;
                                            break;
                                        default:
                                            color = '#ffffff82';
                                            title = scriptTexts.NewOwnOffer;
                                            break;
                                    }
                                    var playerName = $(this).find('.player-name:first');
                                    if(club.length){
                                        if(club.hasClass('self-link')){
                                            $(this).find('.currency-number').first().css('color',color);
                                        }
                                        else if(bidStatus != scriptData.rejectedBidText){
                                            var price = playersWhoWeOffer[playerId].price;
                                            showMyOffer(playerName,$(this).find('.currency-number:first'),club,price,color);
                                            title += '\u000d'+scriptTexts.PassedOwnOffer;
                                        }
                                    }
                                    playerName[0].style = 'background-color : '+color+';border-radius:7px;padding:1px 3px;';
                                    playerName[0].title = title;
                                    goToMyOffer(playerName,playerId);
                                }
                            });
                            function goToMyOffer(playerName,playerId){
                                playerName.click(function(){
                                    $('#own-offers > tbody > tr').each(function(){
                                        var tr = this;
                                        var _playerId = $(tr).find('.open-card').attr('pid').split('-')[1];
                                        if(_playerId == playerId){
                                            $('html, body').animate({ scrollTop: getOffset(tr).top }, 'fast');
                                            tr.style = 'background-color: #fff2ac; background-image: linear-gradient(to right, #ffe359 0%, #fff2ac 100%);';
                                            setTimeout(function(){
                                                tr.style = '';
                                            },2000);
                                            return;
                                        }
                                    });
                                });
                            }
                            function showMyOffer(e1,e2,club,price,color){
                                var temp = {
                                    price : e2.html(),
                                    clubId : club.attr('clubid'),
                                    clubName : club.text().trim()
                                };
                                e1.add(e2).mouseenter(function(){
                                    e2.html('<font style="color:'+color+';">'+(price).toLocaleString()+'</font>');
                                    club.attr('clubid',scriptData.clubId);
                                    club.addClass('self-link');
                                    club.text(scriptData.clubName);
                                });
                                e1.add(e2).mouseleave(function(){
                                    e2.html(temp.price);
                                    club.attr('clubid',temp.clubId);
                                    club.removeClass('self-link');
                                    club.text(temp.clubName);
                                });
                            }
                        }
                    }
                    /*Save accepted bids.*/
                    $('#foreigner-offers > tbody > tr').each(function(i){
                        if($(this).find('.accept-button').length){
                            $(this).find('.button:first > a').attr('_href',$(this).find('.button:first > a')[0].href);
                            $(this).find('.button:first > a').removeAttr('href');
                            $(this).find('.button:first > a').click(function(){
                                $(this).off();
                                var key = 'PlayersData';
                                var data = GetCookie(key)==undefined?{}:GetCookie(key);
                                if(data.AcceptedOffers===undefined)
                                    data.AcceptedOffers = {};
                                var AcceptedOffers = data.AcceptedOffers;
                                var tr = $(this).parents('tr');
                                var playerId = tr.find('.open-card').attr('pid').split('-')[1];
                                var playerName = tr.find('.player-name').text().trim();
                                var clubId = tr.find('.name-column > a').attr('clubid');
                                var clubName = tr.find('.name-column')[1].getAttribute('sortvalue').trim();
                                var price = tr.find('td:nth-child(8) .currency-number').text().split('.').join('');
                                var date = ShowDate(parseInt(GetServerTime()/1000));
                                if(AcceptedOffers[playerId]===undefined){
                                    AcceptedOffers[playerId]= {playerName:playerName,offers:{[clubId]:{clubName:clubName,price:price,date:date}}};
                                }
                                else{
                                    AcceptedOffers[playerId].offers[clubId] = {clubName:clubName,price:price,date:date};
                                }
                                data.AcceptedOffers = AcceptedOffers;
                                SetCookie(key,data);
                                $(this).attr('href',$(this).attr('_href'));
                                $(this).click();
                            });
                        }
                    });
                    /**/
                    if($('#own-offers > tbody').find('.open-card').length){
                        FeaturesOfScript.push("FilterOwnOffers");
                        if(scriptData.FeaturesOfScript.FilterOwnOffers){
                            $('#own-offers').parent().before(
                                '<div style="text-align:center;" id="divFilterOwnOffers">'+
                                '<input type="checkbox" id="only_today_offers">'+
                                '<label for="only_today_offers" style="color: white; font-size: 13px;"><st k="TodayOffers">'+scriptTexts.TodayOffers+'</st></label>'+
                                '<input type="checkbox" id="offer_akzeptiert" style="margin-Left:20px;" checked="">'+
                                '<label for="offer_akzeptiert" style="color: white; font-size: 13px;"><st k="AcceptedOffers">'+scriptTexts.AcceptedOffers+'</st></label>'+
                                '<input type="checkbox" id="offer_gelesen" style="margin-Left:20px;" checked="">'+
                                '<label for="offer_gelesen" style="color: white; font-size: 13px;"><st k="ReadingOffers">'+scriptTexts.ReadingOffers+'</st></label>'+
                                '<input type="checkbox" id="offer_abgelehnt" style="margin-Left:20px;" checked="">'+
                                '<label for="offer_abgelehnt" style="color: white; font-size: 13px;"><st k="RejectedOffers">'+scriptTexts.RejectedOffers+'</st></label>'+
                                '<input type="checkbox" id="offer_neu" style="margin-Left:20px;" checked="">'+
                                '<label for="offer_neu" style="color: white; font-size: 13px;"><st k="NewOffers">'+scriptTexts.NewOffers+'</st></label>'+
                                '</div>');
                            $('#divFilterOwnOffers > input').click(function(){
                                $('#divFilterOwnOffers > input').attr('disabled',true);
                                var checks = {},
                                    today = new Date(GetServerTime());
                                today = TwoDigit(today.getDate())+"."+TwoDigit(today.getMonth()+1)+"."+today.getFullYear();
                                $('#divFilterOwnOffers > input').each(function(i){
                                    checks[i]=this.checked;
                                });
                                var count = 0;
                                $('#own-offers > tbody > tr').each(function(){
                                    var bidStatus = $(this).find('td:nth-child(7)').text().trim().toLowerCase();
                                    var date = $(this).find('.last-column').text().trim();
                                    var show =
                                        (checks[1] && bidStatus==scriptData.acceptedBidText) ||
                                        (checks[2] && bidStatus==scriptData.readBidText) ||
                                        (checks[3] && bidStatus==scriptData.rejectedBidText) ||
                                        (checks[4] && bidStatus==scriptData.newBidText);
                                    show = show && checks[0]?(date.indexOf(today)!==-1?true:false):show;
                                    if(show){
                                        $(this).attr('class',(count++)%2==0?"odd":"even");
                                        $(this).show();
                                    }
                                    else{
                                        $(this).hide();
                                    }
                                });
                                $('#divFilterOwnOffers > input').removeAttr('disabled');
                            });
                        }
                    }
                    /**/
                    $('#content').find('.search-container').after('<div id="transferMarktMenu" style="clear:both;margin-left:18px;position:relative;"></div>');
                    if($('#content > div.container.transfermarket > div.table-container > table > tbody').find('.open-card').length){
                        if($('#club').val()!==scriptData.clubName){
                            FeaturesOfScript.push("FilterTransferMarket");
                            if(scriptData.FeaturesOfScript.FilterTransferMarket){
                                var players = $('#content > div.container.transfermarket > div.table-container > table > tbody > tr');
                                var select = '<st k="ShowOnlyOneLeague">'+scriptTexts.ShowOnlyOneLeague+'</st> : '+
                                    '<select style="-webkit-border-radius: 7px;margin-Left:10px;text-align-last:center;" id="select_lig">'+
                                    '<option value="0" selected="selected"><st k="SelectLeague">'+scriptTexts.SelectLeague+'</st>:</option>';
                                var leagues = scriptData.Leagues;
                                var leagueValue = 1;
                                for(var leaugeKey in leagues){
                                    select+= '<option value="'+(leagueValue++)+'">'+leagues[leaugeKey]+'</option>';
                                }
                                select += '</select>'+
                                    '<label style="display:none;vertical-align: middle;">'+
                                    '<input id="only_one_lig" type="checkBox" style="margin-Left:10px;"></input>'+
                                    '<label for="only_one_lig"><st k="ShowOnlyOneLeague">'+scriptTexts.ShowOnlyOneLeague+'</st></label>'+
                                    '</label>'+
                                    '<p style="display:none;">'+
                                    '<input id="NoKeeperPlayers" type="checkBox" style="margin-left:0;">'+
                                    '<label for="NoKeeperPlayers"><st k="AllExceptGoalkeeper">'+scriptTexts.AllExceptGoalkeeper+'</st></label>'+
                                    '</p>';
                                $('#transferMarktMenu').append(select);

                                $('#content > div.container.transfermarket > div.table-container > h3').after('<p style="background-Color:black;color:white;line-height:33px;text-align:center;" id="filterPlayerInformation"></p>');
                                if($('#positions').val()=="0"){
                                    $('#NoKeeperPlayers').parent().show();
                                }
                                if(TransferMarketValues["NoKeeperPlayers"]){
                                    $('#NoKeeperPlayers')[0].checked = true;
                                    players.each(function(){
                                        if($(this).css('display')!=='none'){
                                            if(this.getElementsByTagName('td')[2].innerHTML.trim() === scriptData.footballerPositions.Position1){
                                                $(this).hide();
                                            }
                                        }
                                    });
                                    showFilterInfo();
                                }
                                $('#NoKeeperPlayers').click(function(){
                                    TransferMarketValues["NoKeeperPlayers"] = this.checked;
                                    if(this.checked){
                                        players.each(function(){
                                            if($(this).css('display')!=='none'){
                                                if(this.getElementsByTagName('td')[2].innerHTML === scriptData.footballerPositions.Position1){
                                                    $(this).hide();
                                                }
                                            }
                                        });
                                    }
                                    else{
                                        if($('#only_one_lig')[0].checked){
                                            var lig = $('#select_lig')[0].options[$('#select_lig')[0].selectedIndex].textContent.trim();
                                            players.each(function(){
                                                var clubId = this.getElementsByClassName('name-column')[1].getElementsByTagName('a')[0].getAttribute('clubid');
                                                if(TransferMarketClubs[clubId].indexOf(lig)!==-1){
                                                    $(this).show();
                                                }
                                            });
                                        }
                                        else{
                                            players.each(function(){
                                                $(this).show();
                                            });
                                        }
                                    }
                                    showFilterInfo();
                                });
                                $('#select_lig').change(function(){
                                    TransferMarketValues["ligaIndex"]= this.selectedIndex;
                                    if(this.value!=0){
                                        $('#only_one_lig').parent().show();
                                        if($('#only_one_lig')[0].checked){
                                            tablo_oku();
                                        }
                                    }
                                    else{
                                        $('#only_one_lig')[0].checked = false;
                                        TransferMarketValues["checkBox"] = false;
                                        $('#only_one_lig').parent().hide();
                                        players.each(function(i){
                                            this.className = i%2===0?"odd":"even";
                                            $(this).show();
                                        });
                                    }
                                });
                                $('#only_one_lig').click(function(){
                                    TransferMarketValues["checkBox"] = this.checked;
                                    if(this.checked){
                                        tablo_oku();
                                    }
                                    else{
                                        if($('#NoKeeperPlayers')[0].checked){
                                            var c = 0;
                                            players.each(function(i){
                                                if(this.getElementsByTagName('td')[2].innerHTML !== scriptData.footballerPositions.Position1){
                                                    this.className = c%2===0?"odd":"even";
                                                    this.style.display='';
                                                    c++;
                                                }
                                            });
                                        }
                                        else{
                                            players.each(function(i){
                                                this.className = i%2===0?"odd":"even";
                                                $(this).show();
                                            });
                                        }
                                        showFilterInfo();
                                    }
                                });
                                var count = 0 ;
                                function tablo_oku(){
                                    $('#select_lig')[0].disabled=true;
                                    $('#only_one_lig')[0].disabled=true;
                                    $('#NoKeeperPlayers')[0].disabled=true;
                                    $('#only_one_lig').parent().hide();
                                    $('#only_one_lig').parent().after('<img src="/designs/redesign/images/icons/loading/16x16.gif" id="LoadingTable" style="margin-left:10px;vertical-align:middle;">');
                                    count = 0;
                                    players.each(function(){
                                        var clubId = this.getElementsByClassName('name-column')[1].getElementsByTagName('a')[0].getAttribute('clubid');
                                        if(TransferMarketClubs[clubId]===undefined){
                                            count++;
                                            kulüp_bilgileri_cek(clubId);
                                        }
                                    });
                                    if(count==0){
                                        tablo_göster();
                                    }
                                }
                                function kulüp_bilgileri_cek(clubId){
                                    var urlPath = '/index.php?w='+worldId+'&area=user&module=club&action=index&complex=0'+ '&id=' + clubId;
                                    $.get(urlPath, function(response){
                                        var a = $('<diV>'+response+'</div>').find('ul > li:first');
                                        a.find('strong').remove();
                                        var leuage = a.text().trim();
                                        TransferMarketClubs[clubId] = leuage;
                                        count--;
                                        if(count===0){
                                            tablo_göster();
                                        }
                                    });
                                }
                                function tablo_göster(){
                                    var kl_gösterme = TransferMarketValues["NoKeeperPlayers"] && $('#positions').val()=="0"?true:false;
                                    var görüntülenecek_lig = document.getElementById('select_lig').options[document.getElementById('select_lig').selectedIndex].textContent;
                                    players.each(function(i){
                                        var clubId = this.getElementsByClassName('name-column')[1].getElementsByTagName('a')[0].getAttribute('clubid');
                                        var mevki = this.getElementsByTagName('td')[2].innerHTML;
                                        if(TransferMarketClubs[clubId].indexOf(görüntülenecek_lig)!==-1 && !(kl_gösterme && mevki===scriptData.footballerPositions.Position1)){
                                            this.className = i%2==0?"odd":"even";
                                            $(this).show();
                                        }
                                        else{
                                            $(this).hide();
                                        }
                                    });
                                    $('#select_lig')[0].disabled=false;
                                    $('#only_one_lig')[0].disabled=false;
                                    $('#NoKeeperPlayers')[0].disabled=false;
                                    $('#LoadingTable').remove();
                                    $('#only_one_lig').parent().show();
                                    showFilterInfo();
                                }
                                function showFilterInfo(){
                                    var show = 0;
                                    players.each(function(){
                                        if($(this).css('display')!=='none'){
                                            show++;
                                        }
                                    });
                                    if(players.length !== show){
                                        $('#filterPlayerInformation').html(scriptTexts.FilterPlayerInformation(players.length,show));
                                    }
                                    else{
                                        $('#filterPlayerInformation').html('');
                                    }
                                }
                                if(TransferMarketValues["ligaIndex"]!==0){
                                    document.getElementById('select_lig').selectedIndex = TransferMarketValues["ligaIndex"];
                                    $('#only_one_lig').parent().show();
                                    if(TransferMarketValues["checkBox"]){
                                        $('#only_one_lig')[0].checked=true;
                                        tablo_oku();
                                    }
                                }
                            }
                        }
                        else{
                            var players = $('#content > div.container.transfermarket > div.table-container > table > tbody > tr');
                            var toplamÜcret = 0;
                            players.each(function(){
                                var o = $(this).find('.currency-number');
                                if(o.length){
                                    toplamÜcret += parseInt(o.first().text().split('.').join(''));
                                }
                            });
                            $('#content > div.container.transfermarket > div.table-container > table > tfoot > tr').html('<td colspan="6"></td><td style="color:#edfdff;font-weight:bold;">'+(toplamÜcret).toLocaleString()+' <span class="icon currency"></span></td><td colspan="3"></td>');
                        }
                    }
                    $('#transferMarktMenu').append(
                        '<span class="button" style="margin-Right:12px;top:0;right:0;position:absolute;">'+
                        '<a class="button" id="ShowMyTransferMarket" style="text-decoration:none;cursor:pointer;">'+
                        '<span><st k="ShowMyMarket">'+scriptTexts.ShowMyMarket+'</st></span></a></span>');
                    $('#ShowMyTransferMarket').click(function(){
                        $('#age_min').val(16);
                        $('#age_max').val(34);
                        $('#searchform > ul > li.strength > span:nth-child(2) > input[type="text"]').val(0);
                        $('#searchform > ul > li.strength > span:nth-child(3) > input[type="text"]').val(999);
                        $('#positions').val(0);
                        $('#club').val(scriptData.clubName);
                        $('#searchform > ul > li.transfermarket-search-button > span > a > span').click();
                    });
                    /*Functions that only work this page*/
                    function getOffset( el ){
                        var _x = 0;
                        var _y = 0;
                        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
                            _x += el.offsetLeft - el.scrollLeft;
                            _y += el.offsetTop - el.scrollTop;
                            el = el.offsetParent;
                        }
                        return { top: _y, left: _x };
                    }
                    /**/
                    if(false){
                        $('#content > div.container.transfermarket > div.table-container > h3').append(
                            '<br>&#10148; <label style="cursor:pointer;" id="showAll">Alle Spieler</label><br />&#10148; <label style="cursor:pointer;" id="showNoGerman">Nur Ausländische Spieler</label><br>');
                        $('#showAll').click(function(){
                            $('#content > div.container.transfermarket > div.table-container > table > tbody > tr').each(function(i){
                                $(this).show();
                                $(this)[0].className = i%2==0?"odd":"even";
                            });
                        });
                        $('#showNoGerman').click(function(){
                            var i = 0;
                            $('#content > div.container.transfermarket > div.table-container > table > tbody > tr').each(function(){
                                if($('td:nth-child(1) > img',this)[0].src.endsWith(scriptData.flag+'.gif')){
                                    $(this).show();
                                    $(this)[0].className = (i++)%2==0?"odd":"even";
                                }
                                else{
                                    $(this).hide();
                                }
                            });
                        });
                    }
                }
                break;
            case 1:
                if(IsPage('area=user&module=statistics&action=games')){
                    var e = $('#content').find('.date-selector');
                    if(e.length){
                        var save = false;
                        var LeagueData = GetCookie('LeagueData');
                        if(LeagueData !==undefined){
                            if((LeagueData.SonMacTarihi+86400000)<=GetServerTime()){
                                save = true;
                            }
                        }
                        else{
                            save = true;
                        }
                        if(save){
                            SaveLeagueData($('#content'));
                        }
                    }
                }
                else if(IsPage('area=user&module=statistics&action=table')){
                    FeaturesOfScript.push("DownloadTable");
                    if(scriptData.FeaturesOfScript.DownloadTable){
                        printScreen('statistics-league-table',scriptTexts.LeagueTable);
                    }
                }
                else if(IsPage('area=user&module=friendly')){
                    if(true){
                        if(!$('#own-invitations-table > tbody > tr').find('.no-invites').length){
                            $('#invitations > div.table-container > div:nth-child(1) > h3').append(CreateButton('ClearInvitations','<st k="CancelUnnecessaryDays">'+scriptTexts.CancelUnnecessaryDays+'</st>','float:right;margin-right:5px;'));
                            $('#ClearInvitations').click(function(){
                                var doluTarihler = {};
                                $('#friendly-matches > tbody > tr').each(function(){
                                    doluTarihler[$(this).find('td:nth-child(2)').attr('sortvalue')] = '';
                                });
                                var silinecekIstekKeyleri = [];
                                $('#own-invitations-table > tbody > tr').each(function(){
                                    if(doluTarihler[$(this).find('td:nth-child(2)').attr('sortvalue')]!==undefined){
                                        var href = $(this).find('td.last-column > a')[0].href;
                                        silinecekIstekKeyleri.push(href.substring(href.indexOf('delete=')+7,href.lastIndexOf('&')));
                                    }
                                });
                                if(silinecekIstekKeyleri.length){
                                    clearInvitations();
                                }
                                function clearInvitations(){
                                    if(!silinecekIstekKeyleri.length){
                                        main();
                                        return;
                                    }
                                    var key = silinecekIstekKeyleri[0];
                                    silinecekIstekKeyleri.splice(0,1);
                                    location.href = "#/index.php?w="+worldId+"&area=user&module=friendly&action=index&delete="+key;
                                    PageLoad(clearInvitations);
                                }
                            });
                        }
                    }
                }
                else if(IsPage('area=user&module=simulation')){
                    if(GetCookie('LeagueData') !==undefined){
                        if(true){
                            var LeagueData = GetCookie('LeagueData');
                            if((LeagueData.SonMacTarihi+86400000)>GetServerTime()){
                                var Clubs = LeagueData.clubs;
                                var takımlar = $('#simulations > tbody').find('.name-column');
                                for(var i = 0 ; i < takımlar.length ; i++){
                                    var clubId = $(takımlar[i]).find('a').attr('clubid');
                                    if(Clubs[clubId]!==undefined){
                                        $(takımlar[i]).parent().css('background','green');
                                        $(takımlar[i]).parent().attr('title',scriptTexts.SameLeague);
                                    }
                                }
                            }
                            else{
                                DeleteCookie('LeagueData');
                            }
                        }
                    }
                }
                else if(IsPage('area=user&module=tournament')){
                    if($('#tournaments > div.container.upcoming > div > table > tfoot > tr > td').html()=="" &&
                       !$('#tournaments > div.container.upcoming > div > table > tbody').find('.name-column').length?false:true){
                        if(scriptData.tournaments==undefined){
                            $('#button-container-create-own-tournament').after(CreateButton('BtnSortTournaments','<st k="SortTournaments">'+scriptTexts.SortTournaments+'</st>','top:55px;'));
                            $('#BtnSortTournaments').click(function(){
                                $(this).remove();
                                scriptData.tournaments = [];
                                $('#tournaments-handle-container > .handle').off();
                                var pa = $('#tournaments > div.container.upcoming > div > table > tfoot > tr > td');
                                var _CounT_;
                                if(pa.html()!=""){
                                    var pageCount = $('#tournaments > div.container.upcoming > div > table > tfoot > tr > td > a').length+1;
                                    var currentPage=-1;
                                    if(pa.find('strong').length){
                                        currentPage = parseInt(pa.find('strong').first().text());
                                        saveTournament($('#tournaments > div.container.upcoming > div > table > tbody'),false,toolTipObj.data);/*save page that is open*/
                                    }
                                    var lookPage = [];
                                    for(var i = 1 ; i <= pageCount ; i++)
                                        if(i!=currentPage)
                                            lookPage.push(i);
                                    _CounT_ = lookPage.length;
                                    $('#button-container-create-own-tournament').after('<span style="position: absolute;top: 55px;right: 52px;"><img src="/designs/redesign/images/icons/loading/16x16.gif" style="vertical-align:middle;margin-right: 3px;">Sayfa <span id="TournamentStatus">0</span>/'+_CounT_+'</span>');
                                    for(var i = 0 ; i < _CounT_ ; i++){
                                        getTournamentPage(lookPage[i])
                                    }
                                }
                                else{
                                    var tbody = $('#tournaments > div.container.upcoming > div > table > tbody');
                                    if(tbody.find('.name-column').length){
                                        saveTournament(tbody,true,toolTipObj.data);/*save current page*/
                                    }
                                    else{
                                        /*no tournaments*/
                                    }
                                }

                                function getTournamentPage(page){
                                    var success = false;
                                    $.get('index.php?area=user&module=tournament&action=index&section=upcoming&posupcoming='+((page-1)*20)+'&path=index.php&layout=none',
                                          function(response) {
                                        $('#TournamentStatus').text(parseInt($('#TournamentStatus').text())+1);
                                        --_CounT_;
                                        var tbody = $($('<div>'+response.content+'</div>')[0].querySelector('#tournaments')).find('.container.upcoming').find('table:first > tbody');
                                        var tooltip = JSON.parse(response.tooltip);
                                        if(tbody.find('.name-column').length){
                                            var fin = _CounT_==0?true:false;
                                            if(fin)
                                                $('#TournamentStatus').parent().remove();
                                            saveTournament(tbody,fin,tooltip);
                                        }
                                        success = true;
                                    }).always(function() {
                                        if(!success){
                                            console.log('There is an error!');
                                        }
                                    });
                                }
                                function saveTournament(tbody,finish,tooltip){
                                    function dateNum(date){
                                        date = date.split('.');
                                        return parseInt(new Date(date[2],parseInt(date[1])-1,date[0])/86400000);
                                    }
                                    tbody.find('tr').each(function(i){
                                        if(!$(this).find('.first-column > .credits').length){
                                            var tournament = {};
                                            tournament.password = $(this).find('.first-column > .password').length?true:false;
                                            tournament.tournamentName = $(this).find('.name-column:first>a').text().trim();
                                            tournament.tournamentId = $(this).find(' td.info-column > a > img').attr('tooltip').replace('tt_','');
                                            tournament.tooltip = tooltip['tt_'+tournament.tournamentId];
                                            var totalPrice = 0;
                                            var koo = false;
                                            $(tournament.tooltip).find('div.tournament-tooltip-table > table > tbody > tr').each(function(j){
                                                if($(this).find('.last-column')){
                                                    totalPrice += parseInt($(this).find('td.last-column > span > span.currency-number').text().split('.').join(''));
                                                }
                                                else{
                                                    koo = true;
                                                    return;
                                                }
                                            });
                                            if(!koo){
                                                tournament.totalPrice = totalPrice;
                                                tournament.tournamentType = $(this).find('td:nth-child(3) > span')[0].className.replace('icon','').trim();
                                                var a = $(this).find('td:nth-child(4) > a');
                                                tournament.club = {
                                                    id:a.attr('clubid'),
                                                    name:a.text().trim()
                                                };
                                                tournament.start = $(this).find('td:nth-child(5)').text().trim();
                                                tournament.startK = dateNum(tournament.start);
                                                tournament.end = $(this).find('td:nth-child(6)').text().trim();
                                                tournament.endK = dateNum(tournament.end);
                                                scriptData.tournaments.push(tournament);
                                            }
                                        }
                                        else{
                                        }
                                    });
                                    if(finish){
                                        sortTournaments('money',1);
                                        showTournaments();
                                    }
                                }
                            });
                            if(!$('#tournaments-handle-container > li:nth-child(2)').hasClass('active'))
                                $('#BtnSortTournaments').hide();
                            $('#tournaments-handle-container > .handle').click(function(){
                                if($(this).attr('target')!==".container.upcoming"){
                                    $('#BtnSortTournaments').hide();
                                }
                                else{
                                    $('#BtnSortTournaments').show();
                                }
                            });
                        }
                        else{
                            /*Show saved tournaments*/
                            showTournaments();
                        }
                        function showTournaments(){
                            var table = $('#tournaments > div.container.upcoming > div > table');
                            var thead = $('thead>tr',table);
                            thead.before('<tr style="background:none;"><th colspan="8" style="background-color: #075971;border-radius: 7px 7px 0 0;" id="ShowNumberOfTournament">'+scriptData.tournaments.length+' Turniere Anzeigen</th></tr>');
                            $('th:nth-child(6)',thead).after('<th class="SortTournaments" sort="money" k="-1" style="cursor:pointer;">Total Price</th>');
                            var th = $('th:nth-child(5)',thead);
                            th.addClass('SortTournaments');
                            th.attr('sort','date');
                            th.attr('k','1');
                            th.css('cursor','pointer');
                            th.addClass('SortTournaments');
                            $('tfoot > tr > td',table).html('');
                            addRows()
                            $('.SortTournaments').click(function(){
                                var k = parseInt($(this).attr('k'));
                                sortTournaments($(this).attr('sort'),k);
                                addRows();
                                $(this).attr('k',k*-1);
                            });
                            function addRows(){
                                var ownTournaments = [];
                                var own = $('#tournaments > div.container.own > div > table > tbody');
                                if(own.find('.info-column').length){
                                    own.find('tr').each(function(){
                                        if(!$(this).find('.tournament').length){
                                            var start = $(this).find('td:nth-child(4)').text().trim().split('.');
                                            start = parseInt(new Date(start[2],parseInt(start[1])-1,start[0])/86400000);
                                            var end = $(this).find('td:nth-child(5)').text().trim().split('.');
                                            end = parseInt(new Date(end[2],parseInt(end[1])-1,end[0])/86400000);
                                            ownTournaments.push({start:start,end:end});
                                        }
                                    });
                                }
                                function TurnuvaÇakıştı(a,b){
                                    var r = false;
                                    for(var i = 0 ; i < ownTournaments.length ; i++){
                                        var c = ownTournaments[i].start;
                                        var d = ownTournaments[i].end;
                                        if((a<=d && a>=c) || (b>=c && b<=d)){
                                            r = true;
                                            break;
                                        }
                                    }
                                    return r;
                                }
                                var tbody = $('tbody',table);
                                tbody.html('');
                                var o = scriptData.tournaments;
                                for(var i = 0 ; i < o.length ; i++){
                                    tbody.append(
                                        '<tr '+(TurnuvaÇakıştı(o[i].startK,o[i].endK)==true?'style="background-color:#00000099;" ':"")+'class="'+(i%2==0?"odd":"even")+'">'+
                                        '<td class="first-column">'+(o[i].password?'<span class="icon password"></span>':"")+'</td>'+
                                        '<td class="name-column">'+
                                        '<a href="#/index.php?w='+worldId+'&area=user&module=tournament&action=tournament&tournament='+o[i].tournamentId+'">'+o[i].tournamentName+'</a>'+
                                        '</td>'+
                                        '<td><span class="icon '+o[i].tournamentType+'" tooltip="tt_tournament_type_'+o[i].tournamentType+'"></span></td>'+
                                        '<td class="name-column">'+
                                        '<div class="club-logo-container"></div>'+
                                        '<a href="#/index.php?w='+worldId+'&area=user&module=profile&action=show&clubId='+o[i].club.id+'" clubid="'+o[i].club.id+'">'+o[i].club.name+'</a>'+
                                        '</td>'+
                                        '<td class="date-column" sortvalue="'+o[i].startK+'">'+o[i].start+'</td>'+
                                        '<td class="date-column" sortvalue="'+o[i].endK+'">'+o[i].end+'</td>'+
                                        '<td>'+(o[i].totalPrice).toLocaleString()+'</td>'+
                                        '<td class="last-column info-column">'+
                                        '<a href="#/index.php?w='+worldId+'&area=user&module=tournament&action=tournament&tournament='+o[i].tournamentId+'">'+
                                        '<img src="/designs/redesign/images/icons/tooltip.gif" name="__tooltip" tooltip="tt_'+o[i].tournamentId+'">'+
                                        '</a>'+
                                        '</td>'+
                                        '</tr>'
                                    );
                                    if(toolTipObj.data['tt_'+o[i].tournamentId]==undefined){
                                        toolTipObj.data['tt_'+o[i].tournamentId] = o[i].tooltip;
                                    }
                                }
                            }
                        }
                        function sortTournaments(type,k){
                            switch(type){
                                case "money":
                                    scriptData.tournaments.sort(function(a,b){
                                        return k*(b.totalPrice-a.totalPrice);});
                                    break;
                                case "date":
                                    scriptData.tournaments.sort(function(a,b){
                                        return k*(a.startK-b.startK);});
                                    break;
                            }
                        }
                    }
                }
                else if(IsPage('area=user&module=betoffice')){
                    FeaturesOfScript.push("QuickBet");
                    if(scriptData.FeaturesOfScript.QuickBet){
                        var t = $('#betoffice-container').find('.matches').find('tbody');
                        if(t.find('.club-logo-container').length){
                            t.find('tr').each(function(){
                                if($(this).find('.last-column').find('select').length){
                                    var k = this.getElementsByClassName('bet-quote');
                                    for(var j = 0 ; j < k.length ; j++){
                                        var radio = k[j].getElementsByTagName('span')[0];
                                        $(radio).click(function(){
                                            var e = $(this).parents('tr').find('select')[0];
                                            var q = $(this).parents('tr').find('.last-column > span > div > span')[0];
                                            if(!$(this).hasClass('checked')){
                                                e.selectedIndex = e.options.length-1;
                                                q.innerHTML = e.options[e.selectedIndex].innerHTML;
                                            }
                                            else{
                                                e.selectedIndex = 0;
                                                q.innerHTML=0;
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
                break;
            case 2:
                if(IsPage('area=user&module=club&action=sponsors')){
                }
                else if(IsPage('area=user&module=publicrelations')){
                }
                else if(IsPage('area=user&module=assistants')){
                    FeaturesOfScript.push("ShowAsistantLevelIncrease");
                    if(scriptData.FeaturesOfScript.ShowAsistantLevelIncrease){
                        var key = 'AsistanLevel';
                        var data = GetCookie(key)==undefined?{}:GetCookie(key);
                        var o = [];
                        $('#assistants').find('.bar-text').each(function(){
                            var level = this.textContent.trim();
                            var b = level.indexOf(' ');
                            level = level.substring(b,level.indexOf(' ',b+1));
                            var value = parseInt($(this).prev().find('div')[0].style.width.replace('%',''));
                            var asistant = $($(this).parents('li')[1]).index();
                            var asistantName = $(this).parents('ul').first().find('li:first > span').text();
                            if(data[asistant]!==undefined){
                                if(data[asistant].name == asistantName){
                                    var difference = value - data[asistant].v;
                                    if(difference>0){
                                        var asistantType = $(this).parents('li').find('h3').text().trim();
                                        o.push({asistantType:asistantType,asistantName:asistantName,difference:difference});
                                    }
                                }
                            }
                            data[asistant] = {name:asistantName,v:(level*100+value)};
                        });
                        if(o.length){
                            var text = '<st k="SeminarIsOver">'+scriptTexts.SeminarIsOver+'</st><br>';
                            for(var i = 0 ; i < o.length-1 ; i++){
                                text += o[i].asistantName+'['+o[i].asistantType+'] : +'+o[i].difference+'%<br>';
                            }
                            text += o[o.length-1].asistantName+'['+o[o.length-1].asistantType+'] : +'+o[o.length-1].difference;
                            GiveNotification(true,text);
                        }
                        SetCookie(key,data);
                    }
                    if(true){
                        var bars = $('#assistants').find('.bar');
                        var values = [];
                        bars.each(function(){
                            values.push(parseInt(this.style.width.replace('%','')));
                            this.style.width = '0%';
                        });
                        if(values.length){
                            AllIntervals["Asistants"] = setInterval(function(){
                                for(var i = 0 ; i < bars.length ; i++){
                                    var width = bars[i].style.width;
                                    width = parseInt(width.substring(0,width.lastIndexOf('%')));
                                    if(width<values[i]){
                                        bars[i].style.width = (width+1)+'%';
                                    }
                                    else{
                                        bars.splice(i,1);
                                        values.splice(i,1);
                                        if(bars.length==0){
                                            clearInterval(AllIntervals["Asistant"]);
                                            AllIntervals["Asistant"] = undefined;
                                        }
                                    }
                                }
                            },20);
                        }
                    }
                }
                else if(IsPage('area=user&module=finances')){
                }
                else if(IsPage('area=user&module=stadium')){
                }
                else if(IsPage('area=user&module=buildings')){
                }
                else if(IsPage('area=user&module=shop')){
                    FeaturesOfScript.push("QuickShopping");
                    if(scriptData.FeaturesOfScript.QuickShopping){
                        $('#shop-content > .shop').each(function(){
                            var shop = this;
                            if($(shop).find('.shadow').length){
                                return;
                            }
                            var e = $('div.table-container',shop)[0].getElementsByClassName('multi');
                            for(var i = 0 ; i < e.length ; i++){
                                var k = e[i].getElementsByTagName('tbody')[0].getElementsByTagName('tr');
                                for(var j = 0 ; j < k.length ; j++){
                                    var t = k[j].getElementsByClassName('last-column order-quantity')[0];
                                    if(t!==undefined){
                                        if(t.getElementsByClassName('input-container')[0]!==undefined){
                                            var tk = t.innerHTML;
                                            var b = tk.indexOf('</span> / ')+7;
                                            var b1 = tk.indexOf('<span',b);
                                            var mi = tk.substring(b+3,b1).trim();
                                            t.innerHTML = tk.substring(0,b)+'<span class="TrOk" style="cursor:pointer;user-select: none;"> / '+mi+'</span>'+tk.substring(b1);
                                            ClickTrOk(t.getElementsByClassName('TrOk')[0]);
                                        }
                                    }
                                }
                            }
                            var t = $('div.button-container > span.button.button-container-disabled.premium > a > span',shop)[0];
                            t.removeAttribute('class');
                            t.removeAttribute('tooltip');
                            t.removeAttribute('name');
                            t.style.cursor = 'pointer';
                            t.innerHTML = '<st k="FillAll">'+scriptTexts.FillAll+'</st>';
                            t.parentElement.removeAttribute('href');
                            $(t).click(function(){
                                var k = shop.getElementsByClassName('TrOk');
                                if(this.textContent===scriptTexts.FillAll){
                                    for(var i = 0 ; i < k.length ; i++){
                                        k[i].previousSibling.getElementsByTagName('input')[0].value = k[i].textContent.replace('/','').trim();
                                    }
                                    this.innerHTML='<st k="EmptyAll">'+scriptTexts.EmptyAll+'</st>';
                                }
                                else{
                                    for(var i = 0 ; i < k.length ; i++){
                                        k[i].previousSibling.getElementsByTagName('input')[0].value = 0;
                                    }
                                    this.innerHTML='<st k="FillAll">'+scriptTexts.FillAll+'</st>';
                                }
                            });
                            t = $('div.button-container > span:nth-child(3) > a > span',shop)[0];
                            t.innerHTML = '<st k="Ordering">'+scriptTexts.Ordering+'</st>';
                        });
                        function ClickTrOk(e){
                            $(e).click(function(){
                                var va = e.textContent.replace('/','').trim();
                                var t = e.previousSibling.getElementsByTagName('input')[0];
                                if(e.previousSibling.getElementsByTagName('input')[0].value!==va){
                                    t.value = va;
                                }
                                else{
                                    t.value=0;
                                }
                            });
                        }
                    }
                }
                break;
            case 3:
                if(IsPage('area=user&module=rating')){
                }
                else if(IsPage('area=user&module=statistics&action=season')){
                    FeaturesOfScript.push("DownloadTable");
                    if(scriptData.FeaturesOfScript.DownloadTable){
                        printScreen('season-league-table',scriptTexts.MatchResultsTable);
                    }
                }
                else if(IsPage('area=user&module=tournament&action=history')){
                }
                else if(IsPage('area=user&module=statistics&action=squadstrenght')){
                    FeaturesOfScript.push("DownloadTable");
                    if(scriptData.FeaturesOfScript.DownloadTable){
                        printScreen('squad-strengths',scriptTexts.SquadStrengthTable);
                    }
                }
                else if(IsPage('area=user&module=statistics&action=goalgetter')){
                    FeaturesOfScript.push("DownloadTable");
                    if(scriptData.FeaturesOfScript.DownloadTable){
                        printScreen('goalgetters',scriptTexts.GoalScorerTable);
                    }
                }
                else if(IsPage('area=user&module=statistics&action=sales')){
                }
                else if(IsPage('area=user&module=team&action=history')){
                }
                break;
            case 4:
                if(IsPage('area=user&module=press')){
                    if(IsPage('&action=index&')){/*Newspaper homepage*/
                    }
                    else if(IsPage('&action=article&')){/*Edit page*/
                        FeaturesOfScript.push("AddImage");
                        if(scriptData.FeaturesOfScript.AddImage){
                            $('#Toolbar_designArea > ul').append(
                                '<li class="" title="'+scriptTexts.AddImage+'" style="cursor:pointer;" id="liAddImage" onmouseenter="'+
                                '$(\'#liAddImage\').attr(\'class\',\'hover\');" onmouseleave="$(\'#liAddImage\').attr(\'class\',\'\');">'+
                                '<img src="'+sources.get('image','png')+'" alt="image" width="20px" height="20px"></li>');
                            $('#liAddImage').click(function(){
                                AddImageCodes($('#designArea')[0]);
                            });
                        }
                    }
                    else if(IsPage('&action=topnews&')){/*Topnew*/
                    }
                    else if(IsPage('&action=settings&')){/*Settings*/
                    }
                    else if(IsPage('&action=comment&article=')){/*Article*/
                    }
                }
                else if(IsPage('area=user&module=friends')){
                }
                else if(IsPage('area=user&module=main&action=neighbors')){
                }
                else if(IsPage('area=user&module=profile&action=signatures')){
                }
                break;
            case 5:
                if(IsPage('area=user&module=premium')){
                }
                else if(IsPage('area=user&module=profile&action=index')){
                }
                else if(IsPage('area=user&module=profile&action=club')){
                    FeaturesOfScript.push("AddImage");
                    if(scriptData.FeaturesOfScript.AddImage){
                        $('#Toolbar_profile-edit-club-information > ul').append(
                            '<li class="" title="'+scriptTexts.AddImage+'" style="cursor:pointer;" id="liAddImage" onmouseenter="'+
                            '$(\'#liAddImage\').attr(\'class\',\'hover\');" onmouseleave="$(\'#liAddImage\').attr(\'class\',\'\');">'+
                            '<img src="'+sources.get('image','png')+'" alt="image" width="20px" height="20px"></li>');
                        $('#liAddImage').click(function(){
                            AddImageCodes($('#profile-edit-club-information')[0]);
                        });
                    }
                }
                else if(IsPage('area=user&module=profile&action=show')){
                    if(IsPage('clubId='+scriptData.clubId) || !IsPage('clubId=')){
                    }
                    else{
                        FeaturesOfScript.push('InviteSimulationMatch');
                        if(scriptData.FeaturesOfScript.InviteSimulationMatch){
                            var matchId = $('#profile-show').find('.button-container-friendly-invite-button > a').attr('href');
                            var b = matchId.indexOf('invite=')+7;
                            matchId = matchId.substring(b,matchId.indexOf('&',b));
                            $('#profile-show').find('.profile-actions')[0].innerHTML+= "<a href='#/index.php?w="+worldId+"&area=user&module=simulation&action=index&squad=" + matchId + "' class='button'><span><st k='InviteSimulation'>"+scriptTexts.InviteSimulation+"</st></span></a>";
                        }
                    }
                    FeaturesOfScript.push('ShowEloRating');
                    if(scriptData.FeaturesOfScript.ShowEloRating){
                        var clubName = $('#profile-show > h2:nth-child(1)').text().replace(scriptData.replaceClubName,'').trim();
                        $('#profile-show > div.container.profile-trophy > div.profile > ul.profile-box-club').append(
                            '<li><strong><st k="EloRank">'+scriptTexts.EloRank+'</st> : </strong> <span class="icon details loading" id="SpanEloRating"></span></li>');
                        $.get('index.php?club=' + clubName + '&_qf__form=&module=rating&action=index&area=user&league=&path=index.php&layout=none',function(response) {
                            var html = document.createElement('html');
                            html.innerHTML = response.content;
                            var result = $(html).find('.odd');
                            $('#SpanEloRating')[0].className='';
                            if(result.length){
                                result = result[0];
                                var sıra = result.getElementsByTagName('td')[0].textContent;
                                $('#SpanEloRating').text(sıra);
                            }
                            else{
                                $('#SpanEloRating').css('color','gray');
                                $('#SpanEloRating').text('-');
                            }
                        });
                    }
                }
                else if(IsPage('area=user&module=mail')){
                }
                else if(IsPage('area=user&module=tricotshop')){
                }
                break;
        }
    }
    else{
        if(IsPage('area=user&module=live&action=index')){
        }
        else if(IsPage('area=user&module=live&action=league')){
        }
        else if(IsPage('area=user&module=live&action=match&id')){
            if($('#match').length){
                LiveMatch();
                function LiveMatch(){
                    $('#goal-event-container').after(/*Add images*/
                        '<div style="display:none;" class="match event-container" id="DivCards">'+
                        '<img src="'+sources.get('yellowCard','png')+'" alt="yellowCard" style="display:none;" id="yellow_card">'+
                        '<img src="'+sources.get('redCard','png')+'" alt="redCard" style="display:none;" id="red_card">'+
                        '<img src="'+sources.get('yellowRedCard','png')+'" alt="yellowRedCard" style="display:none;" id="yellow_red_card">'+
                        '</div>'
                    );
                    $(document.getElementById('goal-event-container')).after(/*Add audios*/
                        '<div id="Songs">'+
                        '<audio id="goalSound" src="https://instaud.io/_/private/c30a3dcbd73757c9a7e183e6920a74605818dd6a.mp3"></audio>'+
                        '<audio id="whistle1" src="https://instaud.io/_/private/ebfe45a7ee88948c3a645cb689dfac8dce0d8917.mp3"></audio>'+
                        '<audio id="whistle2" src="https://instaud.io/_/private/ecc4fe0d5034f371543a48f69d57cca4d6afb33d.mp3"></audio>'+
                        '<audio id="whistle3" src="https://instaud.io/_/private/f2be6a8381d9596d6882dec2e944bcfb97739768.mp3"></audio>'+
                        '<audio id="backgroundSound" loop src="https://instaud.io/_/private/0de7b80bb4fb78afd5ed1ac89c7cc47984439be0.mp3"></audio>'+
                        '<audio id="fan1" loop src="https://instaud.io/_/private/d3301a72c5d3e19af56b0ee657ca35f240ee66a4.mp3"></audio>'+
                        '<audio id="fan2" loop src="https://instaud.io/_/private/7975d0d5c05bc03d35d9c91183e35200708eb015.mp3"></audio>'+
                        '</div>'
                    );
                    $('#match-messages').before(
                        '<div style="width: 840px;position: absolute;left: 65px;top: 101px;color:white;">'+
                        '<div style="float:left;width:48%;height:100%;text-align:center;overflow: auto;line-height:16px;height:38px;" id="home-goals"></div>'+
                        '<div style="float:right;width:48%;height:100%;text-align:center;overflow: auto;line-height:16px;height:38px;" id="away-goals"></div>'+
                        '</div>');
 
                    var ownMatch = false;
                    $('#'+currentLive.matchId).find('h3').each(function(){
                        if($('a',this).attr('clubid') == scriptData.clubId){
                            ownMatch = true;
                            return false;
                        }
                    });
                    currentLive.ownMatch = ownMatch;
                    backgroundSound.currentTime = 0;
                    backgroundSound.volume = 0;
                    backgroundSound.play();
                    var times = [];
                    for(var i = 1 ; i <= 50 ; i++){
                        ((i)=>{
                            var time = setTimeout(()=>{
                                if(!$(backgroundSound).attr('stop')){
                                    backgroundSound.volume = i/100;
                                }
                                else{
                                    for(var j = 0 ; j < times.length ; j++){
                                        clearInterval(times[j]);
                                    }
                                }
                            },(i-1)*50);
                            times.push(time);
                        })(i);
                    }
                }
            }
        }
    }
    $('#content').find('h2').first().attr('Fixed',GetServerTime());
    if(FeaturesOfScript.length){
        $('#FeaturesOfScript > tbody').parent().show();
        for(var i = 0 ; i < FeaturesOfScript.length ; i++){
            var FeaturesId = FeaturesOfScript[i];
            var FeaturesName = scriptTexts.FeaturesName[FeaturesId] || FeaturesId;
            if(scriptData.FeaturesOfScript[FeaturesId]===undefined){
                scriptData.FeaturesOfScript[FeaturesId] = true;
                SetCookie('FeaturesOfScript',scriptData.FeaturesOfScript);
                GiveNotification(true,'<st k="NewFeature1">'+scriptTexts.NewFeature1+'</st>'+' "<font k="'+FeaturesId+'">'+FeaturesName+'</font>". <st k="NewFeature2">'+scriptTexts.NewFeature2+'</st>');
                FeaturesOfScript.splice(i--,1);
                continue;
            }
            $('#FeaturesOfScript > tbody').append(
                '<tr class="'+(i%2===0?"odd":"even")+'">'+
                '<td><label k="'+FeaturesId+'">'+FeaturesName+'</label>'+
                '</td>'+
                '<td>'+
                '<div class="slideThree">'+
                '<input type="checkbox" '+(scriptData.FeaturesOfScript[FeaturesId]?'checked="checked"':'')+
                ' value="None" id="'+FeaturesId+'" class="slideThreeInput" name="check">'+
                '<label for="'+FeaturesId+'" k=""></label></div>'+
                '</td>'+
                '</tr>'
            );
            $('#'+FeaturesId).click(function(){
                scriptData.FeaturesOfScript[this.id] = this.checked;
                SetCookie('FeaturesOfScript',scriptData.FeaturesOfScript);
                if(!this.checked){
                    $('#container').find('.addedBy'+this.id).remove();
                }
                else{
                }
            });
        }
        if(!FeaturesOfScript.length)
            $('#FeaturesOfScript > tbody').parent().hide();
    }
}


/*------------FUNCTIONS---------------*/
function SetCookie(key,data){
    GM_setValue(scriptData.server+'_'+key,data);
}
function GetCookie(key){
    return GM_getValue(scriptData.server+'_'+key);
}
function DeleteCookie(key){
    GM_deleteValue(scriptData.server+'_'+key);
}
function getPageData(url,querySelector,func){
    $.post(undefined, url, function(response) {
        var html = document.createElement('html');
        html.innerHTML = response;
        html = html.querySelector('#'+querySelector);
        func(html);
    });
}
function GiveNotification(NotificationType,Text){
    /*NotificationType : true or false*/
    /*$('html, body').animate({ scrollTop: 0 }, 'fast');*/
    $('#feedback').prepend(
        '<p class="'+(NotificationType==true?'notice':'error')+'" style="left: 0px;'+(NotificationType===false?'background:#1ba0de;border: 1px solid #000000;':'')+'">'+
        '<span class="icon"></span>'+
        Text+
        '</p>'
    );
    $('#feedback p:not(.minified)').each(function (key, element) {
        $(element).css({
            left: ($(document).width() - $(element).outerWidth()) / 2
        });
        window.setTimeout(function () {
            $(element).addClass('minified').css({
                left : 0
            });
        }, 4000);
    });
    $('#feedback p').each(function (key, element) {
        if (key > 19) {
            $(element).slideUp(function() {
                $(this).remove();
            });
        }
    });
}
function ShowDialog(titleContent,content,id=null){
    $('#container > .shadow').show();
    var h2 = document.createElement('h2');
    h2.style.textAlign = 'center';
    h2.innerHTML = titleContent;
    var div = document.createElement('div');
    if(id)
        div.id = id;
    div.className = 'focus container visible';
    div.style.display='block';
    div.style.position='absolute';
    div.style.top='190px';
    div.style.left='226px';
    div.style.padding='15px';
    div.style.width='562px';
    div.style.wordWrap='break-word';
    div.style.textAlign='center!important';
    div.innerHTML =
        h2.outerHTML+
        content+
        '<div class="footer"></div>'+
        '<div class="close"></div>';
    $('#container').append(div);
    $('html, body').animate({ scrollTop: 0 }, 'fast');
}
function GetServerTime(){
    return (svTime+parseInt(new Date().getTime()/1000)-svTimeRDate)*1000;
}
function CreateTrainingPlan(PlanIndex){
    var skillsImg = ["penalty_area_safety","catch_safety","two_footed","fitness","shot","header","duell","cover","speed","pass","endurance","running","ball_control","aggressive"];
    var table = '<table id="123" style="margin-Bottom:5px;"><thead><tr><th style="color:white;font-size:14px;font-weight:bold;border-radius:7px 0 0 7px;"><st k="Position">'+scriptTexts.Position+'</st></th>';
    for(var i = 0 ; i < skillsImg.length ;i++){
        table+='<th '+(i+1===skillsImg.length?'style="border-radius:0 7px 7px 0;"':"")+'><img title="'+scriptTexts.Skills[i]+'" src="/designs/redesign/images/icons/'+skillsImg[i]+'.gif"></th>';
    }
    table+='</tr></thead><tbody>';
    var positions = Object.values(scriptData.footballerPositions);
    var TrainingPlan = scriptData.TrainingPlans[PlanIndex];
    for(var i = 0 ; i < positions.length ; i++){
        table+='<tr class="'+(i%2===0?"odd":"even")+'"><td style="color:white;font-weight:bold;border-Right:1px solid #5a8349;">'+positions[i]+'</td>';
        for(var j = 0 ; j < skillsImg.length ; j++){
            var priority = undefined;
            var skills = TrainingPlan[i];
            for(var k = 0 ; k < skills.length ; k++){
                if(skills[k]==j){
                    priority = k+1;
                    break;
                }
            }
            if(priority)
                table+='<td><label style="color:white;">'+priority+'</label></td>';
            else
                table+='<td><label>-</label></td>';
        }
        table+='</tr>';
    }
    table+='</tbody></table>';
    return table;
}
function CreateButton(id,value,buttonStyle='',spanStyle=''){
    return '<span class="button" id="'+id+'" style="user-select: none;cursor:pointer;'+buttonStyle+'">'+
        '<a class="button" style="text-decoration:none;">'+
        '<span style="'+spanStyle+'">'+value+'</span>'+
        '</a>'+
        '</span>';
}
function UploadData(func){
    var fileInput = document.createElement("input");
    fileInput.id = 'fileInput';
    fileInput.style.display='none';
    fileInput.type="file";
    fileInput.accept="text/plain";
    $(body).append(fileInput);
    $(fileInput).show();
    fileInput.addEventListener('change', function(e) {
        var file = fileInput.files[0];
        var textType = /text.*/;
        if (file.type.match(textType)) {
            var reader = new FileReader();
            reader.onload = function(e) {
                func(reader.result);
                fileInput.remove();
            };
            reader.readAsText(file);
        }
    });
    $(fileInput).click();
}
function TwoDigit(a){
    return (a<10?"0":"")+a;
}
function ShowDate(seconds, TimeDifference=0){
    var ms = (seconds+TimeDifference)*1000;
    var d = new Date(ms);
    return TwoDigit(d.getDate())+"."+
        TwoDigit(d.getMonth()+1)+"."+
        d.getFullYear()+' '+
        TwoDigit(d.getHours())+":"+
        TwoDigit(d.getMinutes())+":"+
        TwoDigit(d.getSeconds());
}
function DownloadData(filename, text){
    var a = document.body.appendChild(
        document.createElement("a")
    );
    var textToWrite = text;
    a.download = filename+".txt";
    textToWrite = textToWrite.replace(/\n/g, "%0D%0A");
    a.href = "data:text/plain," + textToWrite;
    a.click();
    a.remove();
}
function CoundDown(seconds){
    var minutes,hours,days,text="";
    minutes = seconds>59?parseInt(seconds/60):0;
    hours = minutes>59?parseInt(minutes/60):0;
    days = hours>23?parseInt(hours/24):0;
    seconds = seconds%60;
    minutes = minutes%60;
    hours = hours%24;
    if(days){
        var k = days==1?"aDay":"Days";
        text = days+' '+'<st k="'+k+'">'+scriptTexts[k]+'</st>'+' ';
    }
    text+=TwoDigit(hours)+':'+TwoDigit(minutes)+':'+TwoDigit(seconds);
    return text;
}
function IsYoungPlayer(e){
    var sonuc = false;
    var a = $(e).find('.icon.info');
    if(a.length){
        if(a.first().attr('tooltip')==='tt_extendNotPossibleJunior'){
            sonuc = true;
        }
    }
    return sonuc;
}
function TrainingControl(){
    function getElementOffsetWidth(e) {
        var element = $(e).clone().appendTo('body');
        var width = element.outerWidth();
        element.remove();
        return width;
    }
    var players = $('#players-table-skills > tbody > tr');
    var trainingPlan = scriptData.TrainingPlans[scriptData.trainingProgram];
    var Pos = Object.values(scriptData.footballerPositions);
    var skillsName = Object.values(scriptTexts.Skills);
    players.each(function(){
        var skills = $(this).find('.skill-column');
        var position = $(this).find('td:nth-child(3)').text().trim();
        var developSkills = [];// [0,1,3,6,8]
        for(var i = 0 ; i < Pos.length ; i++){
            if(Pos[i]===position){
                developSkills = trainingPlan[i];
            }
        }
        for(var i = 0 ; i < developSkills.length ; i++){
            var s = $(skills[developSkills[i]]).find('span');
            var c = s.attr('class');
            if(c==="next-training maximum" || c==="maximum"){
                continue;
            }
            else if(c==="next-training"){
                break;
            }
            else{
                var skillName = skillsName[developSkills[i]];
                var left = (getElementOffsetWidth(s[0])-15)/2;
                var value = s.text().trim();
                s.html('<img title="'+scriptTexts.ImproveSkillTitle(skillName)+'!!!" src="'+sources.get('here','gif')+'" alt="here" width="15px" height="15px" style="-webkit-transform: rotate(90deg);margin:-8px 0 0 '+left+'px;position:absolute;">'+value);
                GiveNotification(false,scriptTexts.FaultyTrainingMessage($(this).find('.player-name').text().trim(),skillName.toLowerCase()));
                break;
            }
        }
    });
}
function CreateCheckBox(id,checked,style){
    return '<section style="'+style+'">'+
        '<div class="roundedTwo">'+
        '<input type="checkbox" id="'+id+'" '+(checked?"checked":"")+' value="None" name="check">'+
        '<label for="'+id+'"></label></div></section>';
}
function SaveLeagueData(cntnt,func = function(){}){
    if(cntnt.find('.date-selector').length){
        var toplamLigHaftası = cntnt.find('.date-selector').find('.day').length;
        var t = $('div > div.table-container > h3',cntnt)[0].textContent;
        var b = t.indexOf(':')+1;
        var k = parseInt(t.substring(b,b=t.indexOf('-',b)));
        b++;
        var SonMacTarihi = t.substring(b,t.indexOf(' ',t.indexOf('.',b))).trim().split('.');
        var addDay = toplamLigHaftası-k+(k<=(toplamLigHaftası/2)?3:0);
        SonMacTarihi = new Date(SonMacTarihi[2],parseInt(SonMacTarihi[1])-1,parseInt(SonMacTarihi[0])+addDay).getTime();
        var IlkMacTarihi = SonMacTarihi-(toplamLigHaftası-1+3)*(24*60*60*1000);
        var IlkYarıSonMacTarihi = IlkMacTarihi+(toplamLigHaftası/2-1)*(24*60*60*1000);
        var kulüpler = $('div > div.table-container > table > tbody',cntnt).find('.name-column');
        var _k={};
        var ts = false;
        for(var i = 0 ; i < kulüpler.length ; i++){
            var clubId = $(kulüpler[i]).find('a').attr('clubid');
            if(clubId!==scriptData.clubId){
                var clubName = $(kulüpler[i]).find('a').text().trim();
                _k[clubId]=clubName;
            }
            else{
                ts = true;
            }
        }
        if(ts){
            SetCookie('LeagueData',{IlkMacTarihi:IlkMacTarihi,IlkYarıSonMacTarihi:IlkYarıSonMacTarihi,SonMacTarihi:SonMacTarihi,clubs:_k});
            func();
        }
    }
}
function clearText(id){
    var text = $('#'+id).val();
    var length = text.length;
    while(length>0){
        setTimeout(function(){
            var t = $('#'+id).val();
            $('#'+id).val(t.substring(0,t.length-1));
        },(text.length-length)*25);
        length--;
    }
}
function FindNumberOfTraining(_tarih,tarih_){
    var Program1 = [
        {36000:1,54000:1},
        {36000:1,54000:1},
        {25200:1,36000:1,54000:1},
        {36000:1,54000:1}
    ];
    var Program2 = [
        {25200:1},
        {},
        {},
        {}
    ];
    function antrenmanSayısıBul_(gün,s,t){
        var antrenman = 0;
        for(var saat in gün){
            if(saat>s==t?true:false){
                antrenman++;
            }
        }
        return antrenman;
    }
    var day = new Date(_tarih).getHours()*3600+new Date(_tarih).getMinutes()*60+new Date(_tarih).getSeconds();
    var dayIndex = parseInt((_tarih-new Date().getTimezoneOffset()*60*1000)/86400000)%4; // 0 === 2+premium , 1 = 2 antrenman , 2 === 3 antrenman , 3 === 2 antrenman
    var kalanNormalAntrenmanSayısı = antrenmanSayısıBul_(Program1[dayIndex],day,true);
    var kalanKrediliAntrenmanSayısı = antrenmanSayısıBul_(Program2[dayIndex],day,true);
    var tomorrow = new Date(new Date(_tarih).getFullYear(),new Date(_tarih).getMonth(),new Date(_tarih).getDate()+1).getTime();
    var dayDifference = tarih_-tomorrow;
    if(dayDifference>=0){
        dayDifference = parseInt((dayDifference)/86400000);
        dayIndex = (dayIndex+1)%4;
        kalanNormalAntrenmanSayısı += parseInt(dayDifference/4)*9;
        kalanKrediliAntrenmanSayısı += parseInt(dayDifference/4);
        dayDifference %= 4;
        for(var k = 0 ; k < dayDifference ; k++){
            kalanNormalAntrenmanSayısı += antrenmanSayısıBul_(Program1[dayIndex],dayIndex,true);
            kalanKrediliAntrenmanSayısı += antrenmanSayısıBul_(Program2[dayIndex],dayIndex,true);
            dayIndex = (dayIndex+1)%4;
        }
        day = new Date(tarih_).getHours()*3600+new Date(tarih_).getMinutes()*60+new Date(tarih_).getSeconds();
        kalanNormalAntrenmanSayısı += antrenmanSayısıBul_(Program1[dayIndex],day,false);
        kalanKrediliAntrenmanSayısı += antrenmanSayısıBul_(Program2[dayIndex],day,false);
    }
    else{
        day = new Date(tarih_).getHours()*3600+new Date(tarih_).getMinutes()*60+new Date(tarih_).getSeconds();
        kalanNormalAntrenmanSayısı -= antrenmanSayısıBul_(Program1[dayIndex],day,true);
        kalanKrediliAntrenmanSayısı -= antrenmanSayısıBul_(Program2[dayIndex],day,true);
    }
    return [kalanNormalAntrenmanSayısı,kalanKrediliAntrenmanSayısı];
}
function GetMaxSkillValue(currentValue,trainingScore){
    var a = Math.floor((989.5-currentValue)/trainingScore)+1;
    return {"maxvalue":currentValue+a*trainingScore,"numberOfTraining":a};
}
function CalculateStrength(skills,numberOfTraining,trainingScore,position){
    var index = 0;
    for(var posKey in scriptData.footballerPositions){
        if(scriptData.footballerPositions[posKey] == position){
            break;
        }
        else{
            index++;
        }
    }
    var TrainingSkills = scriptData.TrainingPlans[scriptData.trainingProgram][index]; // [9,6,3,7,8,10,5]
    var positionName = scriptData.footballerPositions;
    var StrengthFactors = {
        ["/"+positionName.Position1+"/"]:[{"0":5},{"1":5},{"3":4},{"8":3},{"6":2},{"10":1},{"4":1},{"2":1}],
        ["/"+positionName.Position2+"/"+positionName.Position3+"/"+positionName.Position4+"/"]:[{"6":4},{"9":4},{"3":3},{"8":2},{"10":2},{"4":2},{"5":2},{"7":2},{"11":2},{"2":1}],
        ["/"+positionName.Position5+"/"+positionName.Position6+"/"]:[{"3":4},{"10":4},{"8":3},{"5":3},{"6":2},{"4":2},{"7":2},{"9":2},{"11":2},{"2":1}],
        ["/"+positionName.Position7+"/"+positionName.Position8+"/"]:[{"11":4},{"3":3},{"8":3},{"10":3},{"2":3},{"6":2},{"4":2},{"5":1},{"7":1},{"9":1}]
    };
    var key;
    for(var i in StrengthFactors){
        if(i.indexOf('/'+position.trim()+'/')!==-1){
            key = StrengthFactors[i];
            break;
        }
    }
    var currentStrength = GetStrengthFromSkills(skills,key);
    var nextSkills = skills.slice(0);
    for(var i = 0 ; i < TrainingSkills.length && numberOfTraining>0 ; i++){//[9,6,3,7,8,10,5]
        var skillIndex = TrainingSkills[i];
        var value = nextSkills[skillIndex];
        if(value>=990)
            continue;
        var result = GetMaxSkillValue(value,trainingScore);
        if(result.numberOfTraining <= numberOfTraining){
            value = result.maxvalue;
            numberOfTraining -= result.numberOfTraining;
        }
        else{
            value+=numberOfTraining*trainingScore;
            numberOfTraining = 0;
        }
        nextSkills[skillIndex] = value;
    }
    if(numberOfTraining>0){
        var k = [];
        for(var i = 0 ; i < key.length ; i++){
            k.push(Object.keys(key[i])[0]);
        }
        var t = {};
        for(var i = 0 ; i < TrainingSkills.length ; i++){
            t[TrainingSkills[i]]=1;
        }
        for(var i = 0 ; i < k.length ; i++){
            if(t[k[i]]!==undefined){
                k.splice(i,1);
                i--;
            }
        }
        for(var i = 0 ; i < k.length && numberOfTraining>0 ; i++){//[9,6,3,7,8,10,5]
            var skillIndex = k[i];
            var value = nextSkills[skillIndex];
            if(value>=990)
                continue;
            var result = GetMaxSkillValue(value,trainingScore);
            if(result.numberOfTraining <= numberOfTraining){
                value = result.maxvalue;
                numberOfTraining -= result.numberOfTraining;
            }
            else{
                value+=numberOfTraining*trainingScore;
                numberOfTraining = 0;
            }
            nextSkills[skillIndex] = value;
        }
    }
    var nextStrength = GetStrengthFromSkills(nextSkills,key);
    return {currentStrength:parseFloat((currentStrength).toFixed(2)),nextStrength:parseFloat((nextStrength).toFixed(2)),nextSkills:nextSkills};
}
function GetStrengthFromSkills(skills,key){
    var strength = 0;
    for(var i = 0 ; i < key.length ; i++){//[{"0":5},{"1":5},{"3":4},{"8":3},{"6":2},{"10":1},{"4":1},{"2":1}]
        //{"0":5}
        var skillIndex = parseInt(Object.keys(key[i])[0]);
        var factor = parseFloat(Object.values(key[i])[0]);
        var value = skills[skillIndex];
        strength += value/28*factor;
    }
    return strength;
}
function printScreen(tableName,fineName){
    if(!$('#html2canvas').length){
        var script = document.createElement('script');
        script.id="html2canvas";
        script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
        document.head.appendChild(script);
    }
    if(!$('#pntScrnButton').length){
        $('#'+tableName+' > tfoot > tr > td').append(
            '<img id="pntScrnButton" src="'+sources.get('printscreen','png')+'" alt="printscreen" height="30px" style="cursor:pointer;" title="'+scriptTexts.DownloadTable+'">');
    }
    addClickEvent();
    function addClickEvent(){
        $('#pntScrnButton').click(function(){
            var tfoot = $('#'+tableName+' > tfoot')[0].outerHTML;
            $('#'+tableName+' > tfoot').remove();
            $('#'+tableName).css('background','#6e9a5a url(images/layout/box_bg.gif) 0 -200px repeat-x');
            html2canvas(document.querySelector('#'+tableName)).then(function(canvas) {
                var a = $("<a>")
                .attr("href", canvas.toDataURL())
                .attr("download", fineName+".png")
                .appendTo("body");
                a[0].click();
                a.remove();
                $('#'+tableName).append(tfoot);
                addClickEvent();
            });
        });
    }
}
function AddImageCodes(a){
    var caseMoz = (a.selectionStart || a.selectionStart == "0");
    var intStart = a.selectionStart;
    var intEnd = a.selectionEnd;
    var txt = prompt(scriptTexts.EnterImageLink + ' :', "");
    if (!txt || txt == "") {
        return;
    }
    var img = new Image();
    img.onload = function() {
        txt = '[color=rgb(255, 255, 255);background-image: url('+txt+');width:'+this.width+'px;height:'+this.height+'px;display:block;overflow:visible;margin:0 auto;][/color]';
        a.value = String(a.value).substring(0, intStart) + txt + String(a.value).substring(intEnd, a.value.length);
        a.selectionStart = intStart;
        a.selectionEnd = intStart+txt.length;
        a.focus();
    };
    img.src = txt;
}