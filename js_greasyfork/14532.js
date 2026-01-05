// ==UserScript==
// @name           BaseInfo
// @version        3.2.8
// @author         Dirk Kántor (NurIcke)
// @contributor    leo7044 (helping out for translations)
// @description    Basis Informationen zur Auswertung und Übergabe an die Allianz Befehlshaber. Rechts oberhalb des Spielfensters befindet sich ein neuer Button der das Script aufruft.
// @namespace      http://baseinfo.scriptarea.net/download/show/144825
// @homepage       http://baseinfo.scriptarea.net
// @include        http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @icon           data:image/png;base64,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
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/14532/BaseInfo.user.js
// @updateURL https://update.greasyfork.org/scripts/14532/BaseInfo.meta.js
// ==/UserScript==


(function () {
	var BaseInfoMain = function () {
		function BaseInfoCreate()
			{

// ########################################### //
// ############# S E T T I N G S ############# //
// ########################################### //
// 
// ###### CHANGE YOUR OWN BUTTON DESIGN ###### //
// 
// Use 1 for Image and Name Like: [ ((i)) BaseInfo ] *** Standard
// Use 2 for Name only. Like: [ BaseInfo ]
// Use 3 for Image only. Like: [ ((i)) ]
//
var BIBUTTONDESIGN = 1; // <- Change only the Number
//
// ########################################### //
// 
// ##### CHANGE YOUR OWN BUTTON POSITION ##### //
// 
// Use 1 for Top-Right (Left from the World Button) *** Standard
// Use 2 for Top-Left (Right from your own Playername)
// Use 3 for Bottom-Right (Left from the ServerInfo Area)
// Use 4 for Bottom-Left (Top of the Chat)
//
var BIBUTTONPOSITION = 1; // <- Change only the Number
//
// ########################################### //
// ####### E N D  O F  S E T T I N G S ####### //
// ########################################### //

if(BIBUTTONDESIGN == 3) { var BIBUTTONHEIGHT = 32; var BIBUTTONWIDTH = 41;}
else if(BIBUTTONDESIGN == 2) { var BIBUTTONHEIGHT = 32; var BIBUTTONWIDTH = 75;}
else { var BIBUTTONHEIGHT = 32; var BIBUTTONWIDTH = 100;}
				try
					{
						qx.Class.define("BaseInfoLang", {
							type: "singleton",
							extend: qx.core.Object,
							construct: function (language) {
								/*
									Enthaltene Sprachen:
									deutsch (de), englisch=(en), rumänisch (ro), ungarisch (hu), italienisch (it),
									Türkisch (tr), Französisch (fr), Spanisch (es), Portugiesisch (pt), Tschechisch (cs)
									Slowakisch (sk), Ukrainisch (uk), Weissrussland (be), Russisch (ru), Schwedisch (sv),
									Norwegisch (nb), Niederländisch (nl), Kroatisch (hr), Griechisch (el), Finnisch (fi),
									Dänisch (da), Bulgarisch (bg), Arabisch (ar), Polnisch (pl), Indonesisch (id),
								*/
								this.Languages = ['de','en','ro','hu','it','tr','fr','es','pt','cs','sk','uk','be','ru','sv','nb','nl','hr','el','fi','da','bg','ar','pl','id'];
								if (language !== null) {
									this.MyLanguage = language;
								}
							},
							members: {
								MyLanguage: "de",
								Languages: null,
								Data: null,

								loadData: function (language) {
									var l = this.Languages.indexOf(language);

									if (l < 0) {
										this.Data = null;
										return;
									}

									this.Data = new Object();

									this.Data["Sprache"] = ['de','en','ro','hu','it','tr','fr','es','pt','cs','sk','uk','be','ru','sv','nb','nl','hr','el','fi','da','bg','ar','pl','id'][l];
									this.Data["Server Sprache"] = ["Server Sprache","Server Language","Limbaj Server","Szerver nyelv","Lingua Server","Sunucu Dil","Langage de Serveur","Idioma del Servidor","Servidor Idioma","Serveru Jazyka","Servera Language","Cервера мову","Cэрвэр Язык","Сервер Язык","Serverspråk","Server Språk","Server Taal","Poslužitelj Jezik","διακομιστή Γλώσσα","Server Kieli","Server Sprog","Сървър Език","الخادم اللغة","Serwer Język","Server Bahasa"][l];
									this.Data["Öffnen"] = ["Öffnen","Open","Deschidere","Nyitás","Apertura","Açılış","Ouverture","Apertura","Abertura","Otevřít","otvor","відкриття","адкрыццё","открытие","öppning","åpning","opening","otvaranje","άνοιγμα","aukko","åbning","отвор","افتتاح","otwarcie","pembukaan"][l];
									this.Data["Basenwerte"] = ["Basenwerte","Base values","Valorile de Bază","Bázis Értékek","Valori di Base","Üs Değerler","Les valeurs de base","los valores de base","valores de base","Základní hodnoty","základné hodnoty","базисні показники","базісныя паказчыкі","базисные показатели","basvärden","verdigrunnlag","Base waarden","Baza vrijednosti","τιμές βάσης","tukikohta arvot","uædle værdier","Базови стойности","قيم قاعدة","wartości bazowe","nilai-nilai dasar"][l];
									this.Data["Mitglieder"] = ["Mitglieder","Members","Membrii","Tagok","Membri","Üyeler","membres","Miembros","membros","Členové","členovia","члени","члены","члены","Medlemmar","medlemmer","leden","članovi","Μέλη","jäsenet","medlemmer","Потребители","الأعضاء","Użytkownicy","anggota"][l];
									this.Data["Scriptinfo"] = ["Scriptinfo","Scripts Info","Informații Scripturi","Scripts Információkat","Informazioni Scripts","Script bilgisi","Scripts d'infos","Información Guión","Informações Script","skriptu Informace","script Informácie","інформація сценарію","інфармацыя сцэнара","информация сценария","Skriptinformation","skriptet Informasjon","script Informatie","Skripta informacije","σενάριο Πληροφορίες","skripti tiedot","script oplysninger","скрипта Информация","معلومات النصي","Informacje script","Script Informasi"][l];
									this.Data["Allgemeine Informationen"] = ["Allgemeine Informationen","General Informations","Informații Generale","Általános Információk","Informazioni Generali","Genel bilgi","Informations Générales","Información General","Informação Geral","Obecná Informace","Všeobecná Informácie","Загальна Інформація","Агульная Інфармацыя","Общая Информация","Allmän Information","Generell Informasjon","Algemene Informatie","Opće Informacije","Γενικές Πληροφορίες","Yleistiedot","generelle oplysninger","Обща Информация","معلومات عامة","Informacje Ogólne","Informasi Umum"][l];
									this.Data["Allgemein"] = ["Allgemein","General","Generale","Általános","General","Genel","Générales","general","geralmente","obecný","obvykle","в цілому","Генеральная","Генеральная","Allmänt","Generelt","algemeen","obično","γενικός","yleinen","generelt","общо","عام","ogólny","umum"][l];
									this.Data["Gesamte Produktion"] = ["Gesamte Produktion","Total Production","Producția Totală de","Összes Termelés","La Produzione Totale","Toplam üretim","La production totale","La producción total","A produção total","celková produkce","Celková produkcia","Загальний обсяг виробництва","агульны аб'ём вытворчасці","Общий объем производства","Den sammanlagda produktionen","totale produksjonen","De totale productie","Ukupna proizvodnja","Συνολική παραγωγή","kokonaistuotanto","samlet produktion","Общото производство","إجمالي الإنتاج","Całkowita produkcja","produksi total"][l];
									this.Data["Erste Offensive"] = ["Erste Offensive","First Offense","Primul Ofensivă","Első Támadó","Prima Attaccante","Birinci Ofansif","Première Offensive","primero Ofensivo","primeiro Ofensivo","První Ofenzivní","prvý Ofenzívny","По-перше Образливий","Па-першае абразлівыя","Во-первых Оскорбительный","första offensiv","First Offensive","eerste Offensive","Prvo Uvredljiva","Πρώτα Επιθετικά","First Hyökkäävä","First Offensive","Първо Offensive","أول هجوم","pierwszy Ofensywny","pertama Serangan"][l];
									this.Data["Zweite Offensive"] = ["Zweite Offensive","Second Offense","Al Doilea Ofensivă","Második Támadó","Secondo Attaccante","Ikinci bir Ofansif","Deuxième Offensive","Segundo Ofensivo","segundo Ofensivo","druhý Ofenzivní","druhý Ofenzívny","По-друге Образливий","Па-другое абразлівыя","Во-вторых Оскорбительный","andra Offensive","Second Offensive","tweede Offensive","Drugo Uvredljiva","δεύτερη Επιθετικά","toinen Hyökkäävä","Second Offensive","Второ Offensive","الهجومية الثانية","drugi Ofensywny","kedua Serangan"][l];
									this.Data["Werte übertragen"] = ["Werte übertragen","Transfer Values","Valorile de Transfer","Transfer Értékek","Valori di Trasferimento","transferi değerler","Les valeurs de transfert","valores de Transferencia","valores de transferência","hodnoty Přenos","hodnoty Prenos","переносити вартість","пераносіць кошт","переносить стоимость","överföringsvärden","overføre verdier","Transfer waarden","vrijednosti prijenos","τιμές μεταβίβασης","siirtoarvoja","Overfør værdier","прехвърлят","القيم نقل","wartości transferowe","nilai transfer"][l];
									this.Data["Weltkarte"] = ["Weltkarte","Worldmap","Hartă Lumii","Térkép a Világ","Mappamondo","Dünyada Haritası","Carte du Monde","mapa del mundo","mapa do mundo","Mapa světa","mapa sveta","Карта світу","карта свету","Карта мира","Karta över världen","verdenskart","kaart van de wereld","karta svijeta","Χάρτης του κόσμου","Maailmankartta","kort over verden","Карта на света","خريطة العالم","Mapa świata","peta dunia"][l];
									this.Data["Allianz Rolle"] = ["Allianz Rolle","Alliance Role","Rol Alianță","Szövetség Szerepe","Ruolo Alleanza","İttifak rolü","rôle de l'Alliance","papel Alianza","papel Alliance","Alliance role","alliance role","Альянс роль","альянс ролю","Альянс роль","Alliance roll","Alliance rolle","Alliance rol","Savez uloga","ρόλος της Συμμαχίας","Alliance rooli","alliance rolle","Alliance роля","دور التحالف","rola sojuszu","peran aliansi"][l];
									this.Data["Spielername"] = ["Spielername","Player Name","Nume Jucător","Játékos Neve","Nome Giocatore","Oyuncu Adı","Nom du joueur","Jugadores Nombre","Nome Jogadores","hráči Jméno","hráči Meno","Гравці Ім'я","гульцы Імя","Игроки Имя","spelare Namn","spillere Navn","spelers Naam","igrači Ime","Παίκτες Όνομα","Pelaajat Nimi","spillere Navn","Играчи Име","اللاعبين الاسم","Gracze Nazwa","pemain Nama"][l];
									this.Data["Spielerklasse"] = ["Spielerklasse","Player Class","Clasa Jucător","Töredék","Fazione","Grup","Faction","Clase jugador","Classe jogador","hráč Class","hráč Class","клас гравця","клас гульца","Класс игрока","Spelar klass","spiller Class","Player Class","igrač klase","παίκτης Class","Player Class","Spiller Class","Player Class","فئة اللاعب","Klasa graczem","pemain Kelas"][l];
									this.Data["Aktuelle Uhrzeit"] = ["Aktuelle Uhrzeit","Current Time","Ora curenta","Idő","Ora Attuale","şimdiki zaman","Date actuelle","Tiempo Actual","Tempo Atual","Aktuální čas","aktuálny čas","поточне Час","бягучае Час","Текущее Время","Aktuell tid","Nåværende Tid","huidige Tijd","Trenutno vrijeme","Τρέχουσα Ώρα","Nykyinen aika","Aktuel tid","Current Time","الوقت الحالي","Obecny Czas","Waktu Saat Ini"][l];
									this.Data["Rang"] = ["Rang","Rank","Rang","Helyezés","rango","Derece","Classement","rango","categoria","hodnost","hodnosť","Ранг","ранг","ранг","Placering","Rank","rang","čin","τάξη","arvo","Rank","ранг","مرتبة","ranga","pangkat"][l];
									this.Data["Maximale KP"] = ["Maximale KP","Maximal CP","Puncte de Comando Maxime","Maximális Parancsnoki Pont","Comando il Massimo dei Punti","Maksimum Komutanlığı Puan","Points de Commandement maximum","CP máximo","CP máxima","Maximální CP","maximálna CP","Максимальна CP","максімальная CP","Максимальная CP","maximal CP","maksimal CP","maximale CP","maksimalna CP","μέγιστη CP","Suurin CP","maksimal CP","Максимална CP","الحد الأقصى CP","Maksymalna CP","maksimum CP"][l];
									this.Data["Maximale Repzeit"] = ["Maximale Repzeit","Maximal Reptime","Timp Maxim de Reparație","Maximális Javítási Idő","Tempo Massimo di Riparazione","Maksimum onarım süresi","Temps maximum de réparation","Repzeit máximo","Repzeit máxima","Maximální Repzeit","maximálna Repzeit","Максимальна Repzeit","максімальная Repzeit","Максимальная Repzeit","maximal Repzeit","maksimal Repzeit","maximale Repzeit","maksimalna Repzeit","μέγιστη Repzeit","Suurin Repzeit","maksimal Repzeit","Максимална Repzeit","أقصى Repzeit","Maksymalna Repzeit","Repzeit maksimum"][l];
									this.Data["Stunden"] = ["Stunden","Hours","Ore","Óra","Orario","Saatleri","Heures","horas","horas","hodiny","hodiny","годин","гадзін","часов","timmar","timer","Hours","Radno vrijeme","ώρες","tuntia","Timer","Часове","ساعات","godziny","jam"][l];
									this.Data["Basenanzahl"] = ["Basenanzahl","Basecount","Numarul de Bază","Szám Bázisok","Numero di Base","Üs Numarası","Nombre de base","Número Base","Número de base","Základní Number","základné Number","базовий номер","базавы нумар","Базовый номер","basnummer","Base Number","Base Number","baza broj","Αριθμός βάση","Base Number","Base Number","Base Number","عدد قاعدة","Ilość bazowa","Jumlah dasar"][l];
									this.Data["Anzahl Offensiv Basen"] = ["Anzahl Offensiv Basen","Offense Bases Count","Baze număr Ofensivă","Szám Sértő Bázisok","Basi numero Attaccante","Numara saldırgan Üs","Nombre de bases offensives","Bases Número ofensivas","Número bases ofensivas","Počet ofenzivní základny","Počet ofenzívnej základne","Кількість образливі основи","Колькасць абразлівыя асновы","Количество оскорбительные основы","Antal offensiva baser","Antall offensive baser","Aantal offensief bases","Broj uvredljive baze","Βάσεις Αριθμός προσβλητικό","Numero loukkaavaa emäkset","Nummer offensive baser","Номер обидни бази","عدد القواعد هجوم","Podstawy Liczba obraźliwe","Basis Nomor ofensif"][l];
									this.Data["Support Gebäude Level Ø"] = ["Support Gebäude Level Ø","Support Building Level Ø","Suport de Constructii Nivel Ø","Támogatás Építési Szint Ø","Supporto Livello Edificio Ø","Destek Bina Seviye Ø","Bâtiment Niveau de soutien","Soporte Nivel Edificio Ø","Suporte Nível Edifício Ø","Podpora budova úroveň Ø","Podpora budova úroveň Ø","Підтримка Будівництво Ø Рівень","Падтрымка Будаўніцтва Ø Узровень","Поддержка Строительство Ø Уровень","Support Building Level Ø","Support Bygning Nivå Ø","Ondersteuning Building Level Ø","Podrška Građevinska Razina Ø","Υποστήριξη Κτίριο Επίπεδο Ø","Tuki Building Level Ø","Support Building Level Ø","Подкрепа Building Level Ø","دعم بناء مستوى Ø","Pomoc budynek Poziom Ø","Dukungan Building Tingkat Ø"][l];
									this.Data["VE Ø aller Basen"] = ["VE Ø aller Basen","DF Ø all Bases","Ø Unitate de Apărare Toate Bazele","Védelem Létrehozása Ø Összes Bázisok","Stazioni di difesa Ø di tutte le basi","Savunma Tesis Ø bütün Üs","Fonds de défense Ø de toutes les bases","DF Ø todas las bases","DF Ø todas as bases","DF Ø Všechny základny","DF Ø Všetky základne","DF Ø всі підстави","DF Ø усе падставы","DF Ø все основания","DF Ø alla baser","DF Ø alle baser","DF Ø alle bases","DF Ø Svi baze","DF Ø όλες τις βάσεις","DF Ø kaikki alustat","DF Ø alle baser","DF Ø всички бази","DF Ø كل القواعد","DF Ø wszystkich baz","DF Ø semua basis"][l];
									this.Data["Def Ø aller Basen"] = ["Def Ø aller Basen","Def Ø all Bases","Ø Unitate de Def Toate Bazele","Def Ø Összes Bázisok","Def Ø di tutte le basi","Def Ø bütün Üs","Def Ø de toutes les bases","Def Ø todas las bases","Def Ø todas as bases","Def Ø Všechny základny","Def Ø Všetky základne","Def Ø всі підстави","Def Ø усе падставы","Def Ø все основания","Def Ø alla baser","Def Ø alle baser","Def Ø alle bases","Def Ø Svi baze","Def Ø όλες τις βάσεις","Def Ø kaikki alustat","Def Ø alle baser","Def Ø всички бази","Def Ø كل القواعد","Def Ø wszystkich baz","Def Ø semua basis"][l];
									this.Data["Kristall"] = ["Kristall","Crystal","Cristal","Kristály","Cristallo","Kristal","Cristaux","cristal","cristal","krystal","kryštál","кристал","крышталь","кристалл","kristall","krystall","kristal","kristal","κρύσταλλο","kristalli","krystal","кристал","بلور","kryształ","kristal"][l];
									this.Data["Tiberium"] = ["Tiberium","Tiberium","Tiberium","Tibérium","Tiberium","Tiberium","Tiberium","Tiberium","Tiberium","Tiberium","Tiberium","Tiberium","Tiberium","Tiberium","Tiberium","Tiberium","Tiberium","Tiberium","Tiberium","Tiberium","Tiberium","Tiberium","tiberium من","tyberium","Tiberium"][l];
									this.Data["Strom"] = ["Strom","Power","Putere","Áram","Energia","Enerji","Énergie","corriente","atual","proud","prúd","струм","ток","ток","Aktuell","Nåværende","stroom","struja","ρεύμα","nykyinen","nuværende","ток","تيار","prąd","arus"][l];
									this.Data["Credit"] = ["Credit","Credit","Credit","Kredit","Crediti","Kredi","Crédit","crédito","crédito","úvěr","úver","кредит","крэдыт","кредит","kredit","Credit","krediet","kredit","πίστωση","luotto","Credit","кредит","ائتمان","kredyt","kredit"][l];									
									this.Data["Kristall Produktion"] = ["Kristall Produktion","Crystal Production","Producția de Cristal","Összes Kristály Termelés","Produzione del Cristallo","Toplam Kristal üretimi","cristaux de production","la producción de cristal","produção de cristal","výroba Crystal","výroba Crystal","кристал виробництво","крышталь вытворчасць","Кристалл производство","kristallproduktion","Crystal produksjon","Crystal productie","Crystal proizvodnja","κρυστάλλινα παραγωγής","Crystal tuotanto","krystal produktion","производство Crystal","إنتاج الكريستال","produkcji kryształu","produksi kristal"][l];
									this.Data["Tiberium Produktion"] = ["Tiberium Produktion","Tiberium Production","Producția de Tiberium","Összes Tibérium Termelés","Produzione del Tiberium","Toplam Tiberium üretimi","Tiberium de production","producción Tiberium","produção Tiberium","výroba Tiberium","výroba Tiberium","виробництво Tiberium","вытворчасць Tiberium","производство Tiberium","Tiberium produktion","Tiberium produksjon","Tiberium productie","proizvodnja Tiberium","παραγωγή Tiberium","Tiberium tuotanto","Tiberium produktion","производство Tiberium","إنتاج tiberium من","produkcja tyberium","produksi Tiberium"][l];
									this.Data["Strom Produktion"] = ["Strom Produktion","Power Production","Producția de Putere","Összes Áram Termelés","Produzione del Energia","Toplam enerji üretimi","Énergie de production","La producción actual","A produção atual","Aktuální produkce","aktuálnej produkcie","продукція, що випускається","выпускаемая прадукцыя","Выпускаемая продукция","Aktuell produktion","dagens produksjon","De huidige productie","Trenutna proizvodnja","Η τρέχουσα παραγωγή","Nykyinen tuotanto","nuværende produktion","текущото производство","الإنتاج الحالي","Obecna produkcja","produksi saat ini"][l];
									this.Data["Credit Produktion"] = ["Credit Produktion","Credit Production","Producția de Credit","Összes Kredit Termelés","Produzione del Crediti","Toplam kredi üretimi","Crédit de production","la producción de Crédito","produção de Crédito","Credit výroba","credit výroba","Кредитна виробництво","крэдытная вытворчасць","Кредитная производство","kredit produktion","Credit produksjon","credit productie","Kreditni proizvodnja","Πιστωτικές παραγωγής","luotto tuotanto","Credit produktion","Credit производство","إنتاج الائتمان","produkcja kredytowej","produksi kredit"][l];									
									this.Data["Gesamte Kristall Produktion"] = ["Gesamte Kristall Produktion","Total Crystal Production","Producția Totală de Cristal","Összes Kristály Termelés","Produzione del Cristallo totale","Toplam Kristal üretimi","cristaux de production","La producción total de cristal","A produção total de cristal","Celková produkce krystal","Celková produkcia kryštál","Загальний обсяг виробництва кристалів","Агульны аб'ём вытворчасці крышталяў","Общий объем производства кристаллов","Totalt kristallproduktion","Total krystall produksjon","Totaal kristal productie","Ukupna proizvodnja kristala","Συνολική παραγωγή κρυστάλλων","Total kristalli tuotanto","Samlede krystal produktion","Общото производство на кристална","إجمالي إنتاج الكريستال","Całkowita produkcja kryształów","Total produksi kristal"][l];
									this.Data["Gesamte Tiberium Produktion"] = ["Gesamte Tiberium Produktion","Total Tiberium Production","Producția Totală de Tiberium","Összes Tibérium Termelés","Produzione del Tiberium totale","Toplam Tiberium üretimi","Tiberium de production","La producción total de Tiberium","A produção total de Tiberium","Celková výroba Tiberium","Celková výroba Tiberium","Загальний обсяг виробництва Tiberium","Агульны аб'ём вытворчасці Tiberium","Общий объем производства Tiberium","Totalt Tiberium produktion","Total Tiberium produksjon","Totaal Tiberium productie","Ukupno Tiberium proizvodnja","Συνολική παραγωγή Tiberium","Total Tiberium tuotanto","Total Tiberium produktion","Общото производство на Tiberium","إنتاج tiberium من مجموع","Całkowita produkcja tyberium","Total produksi Tiberium"][l];
									this.Data["Gesamte Strom Produktion"] = ["Gesamte Strom Produktion","Total Power Production","Producția Totală de Putere","Összes Áram Termelés","Produzione del Energia totale","Toplam enerji üretimi","Énergie de production","La producción total de electricidad","A produção total de electricidade","Celková výroba elektrické energie","Celková výroba elektrickej energie","Загальний обсяг виробництва електроенергії","Агульны аб'ём вытворчасці электраэнергіі","Общий объем производства электроэнергии","Total elproduktion","Total produksjon av elektrisitet","Totale elektriciteitsproductie","Ukupna proizvodnja električne energije","Η συνολική παραγωγή ηλεκτρικής ενέργειας","Koko sähköntuotannosta","Samlet elproduktion","Общо количество произведена електроенергия","إجمالي إنتاج الكهرباء","Całkowita produkcja energii elektrycznej","Total produksi listrik"][l];
									this.Data["Gesamte Credit Produktion"] = ["Gesamte Credit Produktion","Total Credit Production","Producția Totală de Credit","Összes Kredit Termelés","Produzione del Crediti totale","Toplam kredi üretimi","Crédit de production","La producción total de crédito","Produção total de crédito","Celkový kredit výroba","Celkový kredit výroba","Загальний обсяг виробництва кредитні","Агульны аб'ём вытворчасці крэдытныя","Общий объем производства кредитные","Total poäng produktion","Total kreditt produksjon","Credit totaal productie","Ukupna kreditna proizvodnja","Η συνολική πιστωτική παραγωγής","Kokonaispisteet tuotanto","Total credit produktion","Общо кредити на производството","إجمالي الإنتاج الائتمان","Całkowita produkcja kredytowej","Produksi total kredit"][l];
									this.Data["Basis Name"] = ["Basis Name","Base Name","Numele de Bază","Bázis Név","Nome di Base","Üs isim","nom de la base","basename","basename","basename","basename","Basename","Basename","Basename","grundnamn","basename","basename","basename","basename","basename","basename","Basename","Basename","basename","basename"][l];
									this.Data["Basis Level"] = ["Basis Level","Base Level","Nivelul de Bază","Bázis Szint","Livello Base","Üs seviye","Niveau de base","Nivel Básico","Nível Básico","Základní Úroveň","základné Úroveň","початковий Рівень","пачатковы Узровень","Начальный Уровень","Grundläggande nivå","grunnleggende nivå","Basic Level","Osnovna razina","Βασικό Επίπεδο","Perustaso","grundlæggende Level","основно ниво","مستوى الأساسي","Poziom Podstawowy","Tingkat Dasar"][l];
									this.Data["Offensiv Level"] = ["Offensiv Level","Offense Level","Nivelul Ofensivă","Támadó Szint","Livello Attaccante","Saldırgan Seviye","Niveau offensive","Nivel Ofensivo","Nível ofensivo","Ofenzivní Level","ofenzívny Level","наступ Рівень","наступ Узровень","Наступление Уровень","offensiv Nivå","offensive nivå","Offensive Level","Uvredljiva Razina","Επιθετικά Επίπεδο","Hyökkäävä Level","offensiv Level","Offensive Level","مستوى الهجومية","Ofensywny Level","Tingkat Serangan"][l];
									this.Data["Defensiv Level"] = ["Defensiv Level","Defense Level","Nivelul Defensiv","Védelmi Szint","Livello Difensiva","Defansif Seviye","Niveau défensif","Nivel Defensivo","Nível defensivo","defenzivní Level","defenzívne Level","оборонна Рівень","абарончая Узровень","Оборонительная Уровень","defensiv Nivå","defensive nivå","defensieve Level","Povučen Razina","αμυντικά Επίπεδο","puolustava Level","defensiv Level","Отбранителна Level","المستوى الدفاعي","Defensywny Level","Tingkat defensif"][l];
									this.Data["Strom Produktion"] = ["Strom Produktion","Power Produktion","Producția de Energie","Áram Termelés","Produzione di Energia","enerji üretimi","la production d'énergie","La producción actual","A produção atual","Aktuální produkce","aktuálnej produkcie","продукція, що випускається","выпускаемая прадукцыя","Выпускаемая продукция","Aktuell produktion","dagens produksjon","De huidige productie","Trenutna proizvodnja","Η τρέχουσα παραγωγή","Nykyinen tuotanto","nuværende produktion","текущото производство","الإنتاج الحالي","Obecna produkcja","produksi saat ini"][l];
									this.Data["Fußtruppen Reparaturzeit"] = ["Fußtruppen Reparaturzeit","Infantry Repairtime","Timp de Reparații de Infanterie","Gyalogos Javítási Idő","Tempo di riparazione Fanteria","Piyade onarım süresi","Temps de réparation d'infanterie","El tiempo de reparación de Infantería","Tempo de reparação de infantaria","Pěchota doba opravy","Pechota doba opravy","Час піхотної ремонт","Час пяхотнай рамонт","Время пехотной ремонт","Infanteri reparationstiden","Infantry reparasjonstiden","Infanterie reparatietijd","Vrijeme Pješačko popravak","Χρόνος επισκευής Πεζικού","Jalkaväki korjausaika","Infanteri reparationstid","Време за ремонт пехотна","وقت الإصلاح المشاة","Czas naprawy Piechota","Waktu perbaikan Infanteri"][l];
									this.Data["Fahrzeug Reparaturzeit"] = ["Fahrzeug Reparaturzeit","Vehicle Repairtime","Timp de Reparații de Vehicul","Jármű Javítási Idő","Tempo di riparazione Veicolo","Araç onarım süresi","Temps de réparation du véhicule","El tiempo de reparación de vehículos","Tempo de reparação de veículos","Opravy vozidel čas","Opravy vozidiel čas","Час ремонту автомобіля","Час рамонту аўтамабіля","Время ремонта автомобиля","Fordonsreparationstiden","Vehicle reparasjonstiden","Voertuig reparatietijd","Vrijeme za popravak vozila","Χρόνος επισκευής του οχήματος","Ajoneuvojen korjausaika","Køretøj reparationstid","Време за ремонт на превозни средства","الوقت إصلاح المركبات","Czas naprawy pojazdu","Waktu perbaikan kendaraan"][l];
									this.Data["Flugzeug Reparaturzeit"] = ["Flugzeug Reparaturzeit","Aircraft Repairtime","Timp de Reparații de Avioane","Repülőgép Javítási Idő","Tempo di riparazione Aeromobile","Uçak onarım süresi","Temps de réparation d'aéronefs","El tiempo de reparación de aeronaves","Tempo de reparação de aeronaves","Oprava letadla čas","Oprava lietadla čas","Час ремонту літака","Час рамонту самалёта","Время ремонта самолета","Flygplan reparationstiden","Aircraft reparasjonstiden","Vliegtuigen reparatietijd","Vrijeme popravak zrakoplova","Χρόνος επισκευής των αεροσκαφών","Lentokoneiden korjaus- aika","Aircraft reparationstid","Време за ремонт на въздухоплавателни средства","الوقت إصلاح الطائرات","Samoloty czas naprawy","Waktu perbaikan Pesawat"][l];
									this.Data["Spieler Produktion"] = ["Spieler Produktion","Players Production","Jucatori de Producție","A játékosok Termelés","Giocatori di produzione","Oyuncular Üretim","Les joueurs de production","Jugadores Producción","jogadores de Produção","hráči Production","hráči Production","Гравці Виробництво","гульцы Вытворчасць","Игроки Производство","spelare Produktion","spillere Produksjon","spelers Production","igrači Proizvodnja","Παίκτες παραγωγής","Pelaajat Tuotanto","","Играчите Производство","إنتاجspillere Produktion لاعبين","Gracze Produkcja","Produksi pemain"][l];
									this.Data["Gesamte Produktion"] = ["Gesamte Produktion","Total Production","Producția totală","Összes termelés","La produzione totale","Toplam Üretim","La production totale","La producción total","A produção total","celková produkce","Celková produkcia","Загальний обсяг виробництва","агульны аб'ём вытворчасці","Общий объем производства","Total produktion","Total produksjon","De totale productie","Ukupna proizvodnja","Συνολική παραγωγή","kokonaistuotanto","samlet produktion","Общото производство","إجمالي الإنتاج","Całkowita produkcja","total produksi"][l];
									this.Data["aller Basen"] = ["aller Basen","all bases","toate bazele","minden bázisok","tutte le basi","tüm üsleri","toutes les bases","todas las bases","todas as bases","všechny základny","všetky základne","всі підстави","усе падставы","все основания","alla baser","alle baser","alle bases","sve baze","όλες οι βάσεις","kaikki alustat","alle baser","всички бази","كل القواعد","wszystkie zasady","semua basis"][l];
									this.Data["inklusive POI Bonus"] = ["inklusive POI Bonus","inclusiv Bonus POI","inclusiv de POI","beleértve POI Bonus","compresi POI Bonus","dahil POI Bonus","y compris POI Bonus","incluyendo PDI Bono","incluindo POI Bonus","včetně POI Bonus","vrátane POI Bonus","в тому числі об'єкти до досвіду","у тым ліку аб'екты да вопыту","в том числе объекты к опыту","inklusive POI Bonus","inkludert POI Bonus","waaronder POI Bonus","uključujući POI bonus","συμπεριλαμβανομένων των POI Μπόνους","mukaan lukien KP Bonus","herunder POI Bonus","включително POI Bonus","بما في ذلك مكافأة POI","w tym Bonus POI","termasuk Bonus POI"][l];
									this.Data["Name"] = ["Name","Name","Numele","Név","Nome","Isim","Nom","nombre","nome","název","Názov","ім'я","мя","имя","namn","navn","naam","naziv","όνομα","nimi","navn","име","اسم","nazwa","nama"][l];
									this.Data["Version"] = ["Version","Version","Versiune","Változat","Versione","Versiyon","Version","versión","versão","verze","verzia","версія","версія","версия","version","versjon","versie","verzija","εκδοχή","versio","Version","версия","نسخة","wersja","versi"][l];
									this.Data["Ersteller"] = ["Ersteller","Creator","Creator","Teremtő","Creatore","Yaratıcı","Créateur","creador","criador","tvůrce","tvorca","творець","стваральнік","создатель","Skaparen","Creator","Schepper","tvorac","δημιουργός","Luoja","skaberen","създател","الخالق","twórca","pencipta"][l];
									this.Data["Webseite"] = ["Webseite","Homepage","Pagina de start","Honlap","Homepage","Anasayfa","Page d'accueil","sitio web","site","webové stránky","webové stránky","сайт","сайт","сайт","Webbplats","nettsted","website","website","δικτυακός τόπος","verkkosivusto","websted","уебсайт","الموقع","witryna internetowa","situs web"][l];
									this.Data["E-Mail"] = ["E-Mail","E-Mail","E-Mail","E-Mail","E-Mail","E-Mail","E-Mail","E-mail","E-mail","E-mail","E-mail","Електронна пошта","Электронная пошта","Электронная почта","E-post","E-post","E-mail","E-mail","E-mail","E-mail","E-mail","Е-поща","البريد الإلكتروني","E-mail","E-mail"][l];
									this.Data["Mitglieder Auflistung"] = ["Mitglieder Auflistung","Members Listing","Lista de Membrii","Tagok Listája","Lista Membri","Üye Listesini","Liste des Membres","lista de Miembros","lista de membros","seznam členů","zoznam členov","користувачі","карыстальнікі","Пользователи","Medlemmar listan","medlemmer liste","ledenlijst","popis članova","Λίστα Μελών","jäsenluettelo","medlemmer liste","Списък с членовете","قائمة الأعضاء","lista członków","daftar anggota"][l];
									this.Data["Nur für OBH's sichtbar"] = ["Nur für OBH's sichtbar","Visible only for CiC","Vizibil doar pentru Commander","Csak akkor látható, a Commander","Visibile solo per il Comandante","Sadece Komutanı görebilir","Visible uniquement pour le commandant","Visible sólo para CiC","Visível apenas para CiC","Viditelné pouze pro CiC","Viditeľné len pre CiC","Відомий тільки для CiC","Бачны толькі для CiC","Видимый только для CiC","Synlig endast för CiC","Bare synlig for CiC","Alleen zichtbaar voor CiC","Vidljivo samo za CiC","Ορατό μόνο για CiC","Näkyvä ainoastaan CiC","Kun synlig for CiC","Видим само за CiC","تظهر فقط لفي CiC","Widoczne tylko dla CiC","Terlihat hanya untuk CiC dunia"][l];
									this.Data["Mitglieder Anpassung"] = ["Mitglieder Anpassung","Members Adaptation","Adaptarea Membrilor","Tagok Adaptáció","Membri Adattamento","Üye Adaptasyon","Membres Adaptation","Miembros adaptación","adaptação membros","Členové adaptace","členovia adaptácia","користувачі адаптації","карыстальнікі адаптацыі","Пользователи адаптации","medlemmar anpassning","medlemmer tilpasning","aanpassing leden","Članovi prilagodba","προσαρμογή Μέλη","jäsenet sopeutuminen","medlemmer tilpasning","членове адаптация","التكيف الأعضاء","adaptacja członków","anggota adaptasi"][l];
									this.Data["Mitgliederliste erneuern"] = ["Mitgliederliste erneuern","Renew Memberlist","Reînnoi Membri","Megújítani Taglista","Rinnovare Iscritti","Üye Listesini yenilemek","Renouveler Membres","Renovar Miembros","Renove Membros","obnovit uživatelů","obnoviť užívateľov","замінити Користувачі","замяніць Карыстальнікі","Заменить Пользователи","förnya Medlems","Forny Medlems","Renew Gebruikerslijst","obnovite Članstvo","Ανανέωση Μελών","Uudista Ohje","forny Grupper","Renew Потребители","تجديد الاعضاء","Odnów Użytkownicy Użytkownicy","Renew Anggota"][l];
									this.Data["Du mußt auf der BaseInfo-Seite eingeloggt sein"] = ["Du mußt auf der BaseInfo-Seite eingeloggt sein","You need to log in on the BaseInfo Page","Trebuie să vă conectați de pe pagina Informații de Bază","Be kell jelentkezni a Base Információs oldal","Devi effettuare il login nella pagina Informazioni di base","Base Bilgileri sayfasında giriş yapmanız gerekiyor","Vous devez vous connecter sur la Page d'information de Base","¡Tienes que entrar en la página de Información de Base","Você precisa fazer o login na página Information Base","Musíte se přihlásit na základní stránce Informace","Musíte sa prihlásiť na základnej stránke Informácie","Ви повинні увійти на сторінці інформаційної бази","Вы павінны ўвайсці на старонцы інфармацыйнай базы","Вы должны войти на странице информационной базы","Du måste logga in på basera informationssidan","Du må logge inn på Base informasjonssiden","Je moet inloggen op de Basis Informatie pagina","Morate se prijaviti na stranicu baze Informacijskog","Θα πρέπει να συνδεθείτε στην σελίδα Βάση Πληροφοριών","Sinun täytyy kirjautua sisään Base Infosivu","Du er nødt til at logge ind på Base Infoside","Необходимо е да влезете в по въпросите на информационното страницата Base","تحتاج إلى تسجيل الدخول على الصفحة قاعدة المعلومات","Musisz zalogować się na stronie Bazy Informacji","Anda harus login pada halaman Information Base"][l];
									this.Data["Account Erstellung"] = ["Account Erstellung","Account Creation","Crearea de Conturi","Fiók Létrehozása","Creazione di un Account","Hesap Oluşturma","Création de Compte","La creación de Cuentas","A criação de Contas","Vytvoření účtu","Vytvorenie účtu","створення облікового запису","стварэнне ўліковага запісу","создание учетной записи","skapa konto","kontoopprettelse","Aanmaken van een Account","Izrada Računa","δημιουργία λογαριασμού","Tilin Luominen","Kontooprettelse","създаване на профил","إنشاء حساب","Utworzenie Konta","Pembuatan Akun"][l];
									this.Data["Alle Basen"] = ["Alle Basen","All Bases","All Bases","All Bases","All Bases","All Bases","All Bases","All Bases","All Bases","All Bases","All Bases","All Bases","All Bases","All Bases","All Bases","All Bases","All Bases","All Bases","All Bases","All Bases","All Bases","All Bases","All Bases","All Bases","All Bases"][l];
									this.Data["Überblick über die Basen"] = ["Überblick über die Basen","All Bases Overview","All Bases Overview","All Bases Overview","All Bases Overview","All Bases Overview","All Bases Overview","All Bases Overview","All Bases Overview","All Bases Overview","All Bases Overview","All Bases Overview","All Bases Overview","All Bases Overview","All Bases Overview","All Bases Overview","All Bases Overview","All Bases Overview","All Bases Overview","All Bases Overview","All Bases Overview","All Bases Overview","All Bases Overview","All Bases Overview","All Bases Overview"][l];
									this.Data["BH"] = ["BH","CY","CY","CY","CY","CY","CY","CY","CY","CY","CY","CY","CY","CY","CY","CY","CY","CY","CY","CY","CY","CY","CY","CY","CY"][l];
									this.Data["KZ"] = ["KZ","CC","CC","CC","CC","CC","CC","CC","CC","CC","CC","CC","CC","CC","CC","CC","CC","CC","CC","CC","CC","CC","CC","CC","CC"][l];
									this.Data["VE"] = ["VE","DF","DF","DF","DF","DF","DF","DF","DF","DF","DF","DF","DF","DF","DF","DF","DF","DF","DF","DF","DF","DF","DF","DF","DF"][l];
									this.Data["VZ"] = ["VZ","HQ","HQ","HQ","HQ","HQ","HQ","HQ","HQ","HQ","HQ","HQ","HQ","HQ","HQ","HQ","HQ","HQ","HQ","HQ","HQ","HQ","HQ","HQ","HQ"][l];
								},
								get: function (ident) {
									return this.gt(ident);
								},
								gt: function (ident) {
									if (!this.Data || !this.Data[ident]) {
										return ident;
									}
									return this.Data[ident];
								}
							}
						}),

						qx.Class.define("BaseInfo", {
							type: "singleton",
							extend: qx.core.Object,
							construct: function () {
								window.addEventListener("click", this.onClick, false);
								window.addEventListener("keyup", this.onKey, false);
								window.addEventListener("mouseover", this.onMouseOver, false);
								BIVERSION = '3.2.8';
                                BIAUTHOR = 'Dirk Kántor (NurIcke)';
                                BICLASS = 'BaseInfo';
                                BIHOMEPAGE = 'http://baseinfo.scriptarea.net';
                                BICONTACT = 'BaseInfo@scriptarea.net';
                                BIUSERLANGUAGE = qx.locale.Manager.getInstance().getLocale().split("_")[0];
								BIIMAGE = 'data:image/png;base64,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';
								BIIMAGESMALL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAB3RJTUUH3QMQDho5kHvXxwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAARnQU1BAACxjwv8YQUAAAQ+SURBVHjarVRbTFxVFF33MQ9eAzNQWmmFgRKgUBIYWmkxov0g0Vh/bKImxvghavnQGLQxMSZNjTF8IIlJNTHaBORDPxoSP0icKjFUISRCYnF4KCIdBMprZu4M987jvo77jAPWqEk/nNx1z51z9l1n7b3XucD//BP+a2FkZMTn9XqfCwQCnaIo+XmsbVubc3NzN6empr7o7e29fc+7TExMPK7EE2OqqrFkMkVQCFFCkqlakinxvR+CwRvd96RwenrmSkNj01uCvitLmVlI0g5EIUMrDMwWYdkeWHILWH4VNtbWPrt27dOLfX19qX8lnJycfLMl0NZn74bgio9A9pUCkoe4GGCbFGERTNjKFjLSaeD+x7C4uPhJoLX1pX0Ocf9hbGzsgcaTzZfNzUU4Z69Alp2AQsp+3wKW1oGdYsB1DkwrI8X5cC9/DHNxFDW1tS9STZ/6B2Fdff1rtpHME75+Hw6LprfjwK+bhB0iXIUt+GF5G2EpPmA5DEGuhmv0dbDdMI5UHH27p6fHzXkkfgsGg5XlR+77UArPyp4v34BwrJ7UGUA0CahKFixqgW1uQAgFIe4lAF2HFPoeKUcDHM1nDpV5vd8NDQ39llXIGDvjLihwsdAtiCpNrISB3QgRrtJaEYzOS8AzvdQWA9LGOBChTZbJNSReXgiBmZqoKPEA55L5TdO0wzaYIKlJ3kzgDtWsxAArrUHSVwNZcoLluWE4ZDhsIlLzqCQb2ZbK69NQYxGIsqP0oIa2bcOyKCWR2PJ476kZ6QWyRwLO6DcQyw/D0E2IkZ+AYnKIuUoxtHk+DS4ZNrmATP9XU9Lp1B1LN5lRUkidpIlC2rrUA9kxDuHEw9DLqqCvhSCz94CjtFauAz4hG6tXnaL4EuiZdOSAsKWldSqp7Wl6dRNsXoQCmvaQWrKgUdkB2zLhVGeAmhdgeSgFajS8QjabVHUDZSeT69nMAWFzc/Oalti7blXUIXryIuURA5wWbFrLFLdkfZ1xeJBKUWdBqTq4OgWpQ01InTiLpJq4FYvFvv2bD5ltXVW1VCLR8Tz2HI+AoiCkqVwbPyO9NAHn8jiKtodJUhHVKA6DeLcfugzd7UVCUd4lH1p3Hz0+suHh4VfbOx78QIyvwzv5EXza5386ldeVN4tL1uiyT2On7RJMfztuL/1ytaur65V9YVIOTl65lZWVhRJPkV5xvPGsUdspJfLbYTCqq1UN3WyA6noUkWPPQjn1MtLFlfhxenp4YGDgnXA4zCRJEsnPTMjtXSAIQgn95+V2d3d3nzt//omn/cdr62WXQxTtNPcWmOyGSQdoiz4zN4JfXe/v7x+leIXeVehdhevnhIWckFBGKCdwg/JzWXDhwpN1gUCb3+srLRIFUUgklOT8/Pza4ODgPCfijiNECduE3X1Cd06lh5shN+bn5lmucsg9C3eBfySpNaCDjVhuTP0BKVPnFst9kFQAAAAASUVORK5CYII=';
								BIIMAGESMALL16 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAB3RJTUUH3QQUCxMm9zjo1wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAARnQU1BAACxjwv8YQUAAALmSURBVHjatVJbSBRRGP5mdlfX3fXutomLUSqa0kMJpiBGkhCEm/bS5TkMWkh76E2MnkJMKsgu+CZhkiViZRIIUhhRkJC6XnLXS4667uruOrOXmZ3Z05lVl3rqqYF/5sw5//d95//+H/gfz/uRkbMbbu+AEBSn+aA44/b43g0ODl38J7ClpVk//9PZKQiCL7zzi0T4eRqzJLyzRIKCX5h2zPXcbmvL/hPD7C+6uh6l1Nsa35pTmVpN4AO0hjAYNgbEZBASgxLWQzHWgmfMjmdPHp9ubW3d/Itgdm7+oTXbcCPJ0QndwXRANgAhGUgvBtKoqH8cytoMIgW3sCoah0qKCs+rOHZXvavEkmtpImM90G3PAss+YHIF+D6FmJQPWVsG4nBDE2ShfdMBS4bJ1vuiry5BUF1TUx/d5PTJo/eBjQjgXAU4F4ihCNjaAvOyHczCIrDog27sOcj6MkrKShsTBGFRKmWEEFjOA6iJniVEjYcgHq2DXHUGilYD+Fy0zlmw29QW1ySislyoYrXqS1FkTUylMtKQtmj9URBlChqTHqIQgF78RDM5IEpNTVMBUYqJI3YJNAzrknQsiJn+pItADget9QTCecVUbRSavM+ALplK60GiFG8tRlQSuUQJG2vcsGTKJHzpTUAvAbQBkvUyFFYHhnFDzLpAlSlxRgCRojqEMy2QRXE4QdDQ0PA1FIq89lddQji5AqA+KnwQEjcHrDuh9wwAYrwyeE81Q1A03zybmwPx2+/PQVDgvxw7WW0jBXVZVBQG5x2Y5p4iOTAOskONls/BXfkA/owjnsFX/Vfsdvvq/iAlIX5pGGw2W9nVpmt3Cw7nl6cIXiTx63HD5NRcRNIOYMXtW+jv623t7u7+qDaPRkglMNHIYBgmj5C4jVnX7faK8orK42ZzTg7dh8/nD/yYmJi819E+Ts/ddM9Lc1UT/SpBCo1UGio4B7uNYvY6xO5VSPsHWf1SME/BXrqmQwP+N0iuTDWLJDNBAAAAAElFTkSuQmCC';
                            },
							members: {
								BaseinfoFenster: null,
								BaseinfoTab: null,
								BaseinfoGeneralPage: null,
								BaseinfoBasesPage: null,
								BaseinfoMemberPage: null,
								BaseinfoInfoPage: null,
								BaseinfoGeneralVBox: null,
								BaseinfoBasesVBox: null,
								BaseinfoMemberVBox: null,
								BaseinfoInfoVBox: null,
								BaseinfoVBox: null,
								BaseinfoButton: null,
								app: null,
								initialize: function () {
									try
										{
											console.log("BaseInfo: Initialized...");
											Lang.loadData(qx.locale.Manager.getInstance().getLocale().split("_")[0]);
											this.BaseinfoFenster = new qx.ui.window.Window(BICLASS + " " + BIVERSION + " (" + Lang.gt("Server Sprache") + ": " + BIUSERLANGUAGE + ")",BIIMAGE).set({
												padding: 5,
												paddingRight: 0,
												width: 200,
												showMaximize:false,
												showMinimize:false,
												showClose:true,
												allowClose:true,
												resizable:false
											});
											this.BaseinfoFenster.setTextColor('black');
											this.BaseinfoFenster.setLayout(new qx.ui.layout.HBox); 
											this.BaseinfoFenster.moveTo(280, 10);
											
											// Tab Reihe
											this.BaseinfoTab = (new qx.ui.tabview.TabView).set({
												contentPaddingTop: 3,
												contentPaddingBottom: 6,
												contentPaddingRight: 7,
												contentPaddingLeft: 3
											});
											this.BaseinfoFenster.add(this.BaseinfoTab);
											
											// Tab 1
											this.BaseinfoGeneralPage = new qx.ui.tabview.Page(Lang.gt("Allgemein"));
											this.BaseinfoGeneralPage.setLayout(new qx.ui.layout.VBox(5));
											this.BaseinfoTab.add(this.BaseinfoGeneralPage);
											this.BaseinfoGeneralVBox = new qx.ui.container.Composite();
											this.BaseinfoGeneralVBox.setLayout(new qx.ui.layout.VBox(5));
											this.BaseinfoGeneralVBox.setThemedPadding(10);
											this.BaseinfoGeneralVBox.setThemedBackgroundColor("#eef");
											this.BaseinfoGeneralPage.add(this.BaseinfoGeneralVBox);
											
											// Tab 2
											this.BaseinfoBasesPage = new qx.ui.tabview.Page(Lang.gt("Basenwerte"));
											this.BaseinfoBasesPage.setLayout(new qx.ui.layout.VBox(5));
											this.BaseinfoTab.add(this.BaseinfoBasesPage);
											this.BaseinfoBasesVBox = new qx.ui.container.Composite();
											this.BaseinfoBasesVBox.setLayout(new qx.ui.layout.VBox(5));
											this.BaseinfoBasesVBox.setThemedPadding(10);
											this.BaseinfoBasesVBox.setThemedBackgroundColor("#eef");
											this.BaseinfoBasesPage.add(this.BaseinfoBasesVBox);

											// Tab 3
											this.BaseinfoAllBasesPage = new qx.ui.tabview.Page(Lang.gt("Alle Basen"));
											this.BaseinfoAllBasesPage.setLayout(new qx.ui.layout.VBox(5));
											this.BaseinfoTab.add(this.BaseinfoAllBasesPage);
											this.BaseinfoAllBasesVBox = new qx.ui.container.Composite();
											this.BaseinfoAllBasesVBox.setLayout(new qx.ui.layout.VBox(5));
											this.BaseinfoAllBasesVBox.setThemedPadding(10);
											this.BaseinfoAllBasesVBox.setThemedBackgroundColor("#eef");
											this.BaseinfoAllBasesPage.add(this.BaseinfoAllBasesVBox);

											var BIBUTTONIMAGE = (BIBUTTONDESIGN == 1 || BIBUTTONDESIGN == 3) ? BIIMAGESMALL : '' ;
											var BIBUTTONNAME = (BIBUTTONDESIGN == 1 || BIBUTTONDESIGN == 2) ? '<b>' + BICLASS + '</b>' : '' ;
											this.BaseinfoButton = new qx.ui.form.Button(BIBUTTONNAME,BIBUTTONIMAGE).set({
												toolTipText: "" + Lang.gt("Öffnen") + ": " + BICLASS + " " + BIVERSION + "",
												width: BIBUTTONWIDTH,
												height: BIBUTTONHEIGHT,
												maxWidth: BIBUTTONWIDTH,
												maxHeight: BIBUTTONHEIGHT,
												center: true,
												rich: true
											});
											this.BaseinfoButton.addListener("click", function (e) {
												this.BaseinfoGeneralVBox.removeAll();
												this.BaseinfoBasesVBox.removeAll();
												this.BaseinfoAllBasesVBox.removeAll();
												this.showBaseinfo();
												this.BaseinfoFenster.show();
											}, this);
											this.app = qx.core.Init.getApplication();
											if(BIBUTTONPOSITION == 4) this.app.getDesktop().add(this.BaseinfoButton, {left: 125,bottom: 180}); // Chat
											else if(BIBUTTONPOSITION == 3) this.app.getDesktop().add(this.BaseinfoButton, {right: 122,bottom: 0}); // Serverinfo
											else if(BIBUTTONPOSITION == 2) this.app.getDesktop().add(this.BaseinfoButton, {left: 127,top: 0}); // Playername
											else this.app.getDesktop().add(this.BaseinfoButton, {right: 125,top: 0}); // Standard Worldname
										}
									catch(e)
										{
											console.log("BaseInfo: Initialize Error - ", e);
										}
								},
								showBaseinfo: function (ev) {
									try
										{
											console.log("BaseInfo: Loading...");
											var instance = ClientLib.Data.MainData.GetInstance();
											var alliance = instance.get_Alliance();
											var allianceid = alliance.get_Id();
											var serverName = instance.get_Server().get_Name();
											var player = instance.get_Player();
											var faction1 = player.get_Faction();
											var playerRank = player.get_OverallRank();
											var playerSubstitution = player.get_IsSubstituted();
											var accountId = player.get_AccountId();
											var accountCreate = new Date(player.get_CreationDate());
											var Stunde1 = accountCreate.getHours();
											var Minute1 = accountCreate.getMinutes();
											var Monat1 = accountCreate.getMonth()+1 ;
											var Tag1 = accountCreate.getDate();
											var Jahr1 = accountCreate.getFullYear();
											if(Stunde1<10) Stunde1 = "0" + Stunde1;
											if(Minute1<10) Minute1 = "0" + Minute1;
											if(Tag1<10) Tag1 = "0" + Tag1;
											if(Monat1<10) Monat1 = "0" + Monat1;
												accountCreate = Tag1 + "." + Monat1 + "." + Jahr1 + " - " + Stunde1 + ":" + Minute1;
											var aktuellesDatum = new Date();
											var Stunde = aktuellesDatum.getHours();
											var Minute = aktuellesDatum.getMinutes();
											var Monat = aktuellesDatum.getMonth()+1 ;
											var Tag = aktuellesDatum.getDate();
											var Jahr = aktuellesDatum.getFullYear();
											if(Stunde<10) Stunde = "0" + Stunde;
											if(Minute<10) Minute = "0" + Minute;
											if(Tag<10) Tag = "0" + Tag;
											if(Monat<10) Monat = "0" + Monat;
											var Datum = Tag + "." + Monat + "." + Jahr;
											var Uhrzeit = Stunde + ":" + Minute;
											var player_basen = 0;
											var support_gebaeude = 0;
											var v = 0;
											var offbasen = 0;
											var base1 = '';
											var base2 = '';
											var VE_durchschnitt = null;
											var VE_lvl = null;
											var support = 0;
											var supportlvl = null;
											var supportname = '';
											var def_durchschnitt = null;
											var credit_durchschnitt = null;
											var repairMaxTime = null;
											var creditPerHour = 0;
											var creditsPerHour = 0;
											var PowerPerHour = 0;
											var PowersPerHour = 0;
											var PowerProduction = 0;
											var PowersProduction = 0;
											var TiberiumPerHour = 0;
											var TiberiumsPerHour = 0;
											var TiberiumProduction = 0;
											var TiberiumsProduction = 0;
											var CrystalPerHour = 0;
											var CrystalsPerHour = 0;
											var CrystalProduction = 0;
											var CrystalsProduction = 0;
											var credit_basen = '';
											var first_rep_flug = 0;
											var first_rep_fahr = 0;
											var first_rep_fuss = 0;
											var second_rep_flug = 0;
											var second_rep_fahr = 0;
											var second_rep_fuss = 0;
											var firstBaseName = '';
											var firstBaselvl = 0;
											var firstOfflvl = 0;
											var firstDeflvl = 0;
											var firstPowerProduction = 0;
											var firstRepairAir = null;
											var firstRepairVehicle = null;
											var firstRepairInfantry = null;
											var secondBaseName = '';
											var secondBaselvl = 0;
											var secondOfflvl = 0;
											var secondDeflvl = 0;
											var secondPowerProduction = 0;
											var secondRepairAir = null;
											var secondRepairVehicle = null;
											var secondRepairInfantry = null;
											var factionArt = new Array();
											factionArt[0] = "";
											factionArt[1] = "GDI";
											factionArt[2] = "NOD";
											var newAusgabe = new Array();
											var apc = instance.get_Cities();
											var PlayerName = apc.get_CurrentOwnCity().get_PlayerName();
											var PlayerID = apc.get_CurrentOwnCity().get_PlayerId();
											var AllianzName = apc.get_CurrentOwnCity().get_AllianceName();
											var AllianzID = apc.get_CurrentOwnCity().get_AllianceId();
											var apcl = apc.get_AllCities().d;
											var members = alliance.get_MemberData().d, member;
											var leaders = alliance.get_FirstLeaders();
											keys = Object.keys(members);
											len = keys.length;
											var AllianzRolle = new Array();
											var AllianzSpieler = new Array();
											var sd;
											var baseidforWorldmap = null;
											var coordsforWorldmap = '';
											var worldidforWorldmap = document.URL.split("/");
											var AllianzMemberList = '';
											if(AllianzID > 0)
												{
													while (len--)
														{
															member = members[keys[len]];
															AllianzRolle[member.Id] = member.RoleName;
															AllianzSpieler[member.Id] = member.Name;
															AllianzMemberList += (AllianzMemberList != '') ? '|||' + AllianzID + ',' + AllianzName + ',' + worldidforWorldmap[3] + ',' + member.Id + ',' + member.Name + ',' + member.Bases + ',' + factionArt[member.Faction] + ',' + member.Rank + ',' + member.RoleName + ',' + member.HasControlHubCode + ',' + member.Level + '' : '' + AllianzID + ',' + AllianzName + ',' + worldidforWorldmap[3] + ',' + member.Id + ',' + member.Name + ',' + member.Bases + ',' + factionArt[member.Faction] + ',' + member.Rank + ',' + member.RoleName + ',' + member.HasControlHubCode + ',' + member.Level + '' ;
														}
												}
											var allBases = '';
											var aB_basename,aB_baselvl,aB_offlvl,aB_deflvl,aB_bhlvl,aB_velvl,aB_vzlvl,aB_cclvl,aB_supportweapon,aB_supportlvl,aB_credits,aB_strom,aB_tiberium,aB_crystal;
											var aB__basename,aB__baselvl,aB__offlvl,aB__deflvl,aB__bhlvl,aB__velvl,aB__vzlvl,aB__cclvl,aB__supportweapon,aB__supportlvl,aB__credits,aB__strom,aB__tiberium,aB__crystal = new Array();
											var GeneralField5 = new qx.ui.container.Composite(new qx.ui.layout.VBox(1).set({alignX: "center"}));
											GeneralField5.add(new qx.ui.basic.Label("<big><u><b>" + Lang.gt("Überblick über die Basen") + "</b></u></big>").set({rich: true}));
											GeneralField5.add(new qx.ui.basic.Label("").set({rich: true}));
											var Basen = new qx.ui.container.Composite(new qx.ui.layout.HBox(10).set({alignX: "center"}));
											var BasenName = new qx.ui.container.Composite(new qx.ui.layout.VBox(1).set({alignX: "right"}));
											var BasenBase = new qx.ui.container.Composite(new qx.ui.layout.VBox(1).set({alignX: "right"}));
											var BasenOffensive = new qx.ui.container.Composite(new qx.ui.layout.VBox(1).set({alignX: "right"}));
											var BasenDefensive = new qx.ui.container.Composite(new qx.ui.layout.VBox(1).set({alignX: "right"}));
											var BasenBH = new qx.ui.container.Composite(new qx.ui.layout.VBox(1).set({alignX: "right"}));
											var BasenCC = new qx.ui.container.Composite(new qx.ui.layout.VBox(1).set({alignX: "right"}));
											var BasenVE = new qx.ui.container.Composite(new qx.ui.layout.VBox(1).set({alignX: "right"}));
											var BasenVZ = new qx.ui.container.Composite(new qx.ui.layout.VBox(1).set({alignX: "right"}));
											var BasenSupport = new qx.ui.container.Composite(new qx.ui.layout.VBox(1).set({alignX: "right"}));
											var BasenTiberium = new qx.ui.container.Composite(new qx.ui.layout.VBox(1).set({alignX: "right"}));
											var BasenCrystal = new qx.ui.container.Composite(new qx.ui.layout.VBox(1).set({alignX: "right"}));
											var BasenPower = new qx.ui.container.Composite(new qx.ui.layout.VBox(1).set({alignX: "right"}));
											var BasenCredits = new qx.ui.container.Composite(new qx.ui.layout.VBox(1).set({alignX: "right"}));
											BasenName.add(new qx.ui.basic.Label("<b>" + Lang.gt("Basis Name") + "</b>").set({rich: true, alignX: "center"}));
											BasenBase.add(new qx.ui.basic.Label("<b>Lvl</b>").set({rich: true, alignX: "center"}));
											BasenOffensive.add(new qx.ui.basic.Label("<b>Off</b>").set({rich: true, alignX: "center"}));
											BasenDefensive.add(new qx.ui.basic.Label("<b>Def</b>").set({rich: true, alignX: "center"}));
											BasenBH.add(new qx.ui.basic.Label("<b>" + Lang.gt("BH") + "</b>").set({rich: true, alignX: "center"}));
											BasenCC.add(new qx.ui.basic.Label("<b>" + Lang.gt("KZ") + "</b>").set({rich: true, alignX: "center"}));
											BasenVE.add(new qx.ui.basic.Label("<b>" + Lang.gt("VE") + "</b>").set({rich: true, alignX: "center"}));
											BasenVZ.add(new qx.ui.basic.Label("<b>" + Lang.gt("VZ") + "</b>").set({rich: true, alignX: "center"}));
											BasenSupport.add(new qx.ui.basic.Label("<b>Support</b>").set({rich: true, alignX: "center"}));
											BasenTiberium.add(new qx.ui.basic.Label("<b>" + Lang.gt("Tiberium") + "</b>").set({rich: true, alignX: "center"}));
											BasenCrystal.add(new qx.ui.basic.Label("<b>" + Lang.gt("Kristall") + "</b>").set({rich: true, alignX: "center"}));
											BasenPower.add(new qx.ui.basic.Label("<b>" + Lang.gt("Strom") + "</b>").set({rich: true, alignX: "center"}));
											BasenCredits.add(new qx.ui.basic.Label("<b>" + Lang.gt("Credit") + "</b>").set({rich: true, alignX: "center"}));


											for (var key in apcl)
												{
													player_basen++;
													var c = apcl[key];
													try
														{
															sd = c.get_SupportData();
															if(sd !== null)
																{
																	support_gebaeude++;
																	support = sd.get_Level();
																	supportlvl = supportlvl+support;
																	supportname = c.get_SupportWeapon().n.replace(/NOD_SUPPORT_/gi,"").replace(/GDI_SUPPORT_/gi,"").replace(/FOR_SUPPORT_/gi,"");
																}
															else
																{
																	support = 0;
																	supportname = '-';
																}
															unitData = c.get_CityBuildingsData();
															ve = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Defense_Facility);
															vz = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Defense_HQ);
															bh = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Construction_Yard);
															cc = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Command_Center);
															commandpointsMaxStorage = c.GetResourceMaxStorage(ClientLib.Base.EResourceType.CommandPoints);
															
															creditPerHour = ClientLib.Base.Resource.GetResourceGrowPerHour(c.get_CityCreditsProduction(), false) + ClientLib.Base.Resource.GetResourceBonusGrowPerHour(c.get_CityCreditsProduction(), false);
															
															PowerPerHour = c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false) + c.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Power) + alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Power);
															PowerProduction = c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false) + c.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Power);
															TiberiumPerHour = c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Tiberium, false, false) + c.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Tiberium) + alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Tiberium);
															TiberiumProduction = c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Tiberium, false, false) + c.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Tiberium);
															CrystalPerHour = c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Crystal, false, false) + c.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Crystal) + alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Crystal);
															CrystalProduction = c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Crystal, false, false) + c.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Crystal);
															
															creditsPerHour = creditsPerHour + creditPerHour;
															
															PowersPerHour = PowersPerHour + PowerPerHour;
															PowersProduction = PowersProduction + PowerProduction;
															TiberiumsPerHour = TiberiumsPerHour + TiberiumPerHour;
															TiberiumsProduction = TiberiumsProduction + TiberiumProduction;
															CrystalsPerHour = CrystalsPerHour + CrystalPerHour;
															CrystalsProduction = CrystalsProduction + CrystalProduction;
															
															if(c.get_CommandCenterLevel() > 0)
																{
																	repairMaxTime = c.GetResourceMaxStorage(ClientLib.Base.EResourceType.RepairChargeInf);
																	if(firstOfflvl < c.get_LvlOffense())
																		{
																			secondBaseName = firstBaseName;
																			secondBaselvl = firstBaselvl;
																			secondOfflvl = firstOfflvl;
																			secondDeflvl = firstDeflvl;
																			secondPowerProduction = firstPowerProduction;
																			secondRepairInfantry = firstRepairInfantry;
																			secondRepairVehicle = firstRepairVehicle;
																			secondRepairAir = firstRepairAir;
																			
																			firstBaseName = c.get_Name();
																			firstBaselvl = c.get_LvlBase();
																			firstOfflvl = c.get_LvlOffense();
																			firstDeflvl = c.get_LvlDefense();
																			firstPowerProduction = c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false) + c.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Power) + alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Power);
																			firstRepairInfantry = c.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false);
																			firstRepairVehicle = c.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false);
																			firstRepairAir = c.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false);
																		}
																	else if(c.get_LvlOffense() > secondOfflvl)
																		{
																			secondBaseName = c.get_Name();
																			secondBaselvl = c.get_LvlBase();
																			secondOfflvl = c.get_LvlOffense();
																			secondDeflvl = c.get_LvlDefense();
																			secondPowerProduction = c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false) + c.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Power) + alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Power);
																			secondRepairInfantry = c.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false);
																			secondRepairVehicle = c.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false);
																			secondRepairAir = c.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false);
																		}
																}
															if(c.get_CommandCenterLevel() > 0 && c.get_LvlOffense() > 0)
																{
																	offbasen++;
																}
															if(ve !== null)
																{
																	v++;
																	VE_lvl = VE_lvl+ve.get_CurrentLevel();
																}
															if(c.get_LvlDefense())
																{
																	def_durchschnitt = def_durchschnitt + c.get_LvlDefense();
																}
															if(allBases != "")
																{
																	allBases += ' |||| ';
																}
															if(ve !== null) { aB_velvl = ve.get_CurrentLevel().toString(); } else { aB_velvl = '-';}
															if(vz !== null) { aB_vzlvl = vz.get_CurrentLevel().toString(); } else { aB_vzlvl = '-';}
															if(bh !== null) { aB_bhlvl = bh.get_CurrentLevel().toString(); } else { aB_bhlvl = '-';}
															if(cc !== null) { aB_cclvl = cc.get_CurrentLevel().toString(); } else { aB_cclvl = '-';}
															allBases += '' + c.get_Name().toString() + ' | ' + c.get_LvlBase().toFixed(2).toString() + ' | ' + c.get_LvlOffense().toFixed(2).toString() + ' | ' + c.get_LvlDefense().toFixed(2).toString() + ' | ' + aB_bhlvl + ' | ' + aB_velvl + ' | ' + aB_vzlvl + ' | ' + aB_cclvl + ' | ' + support.toFixed(2).toString() + ' | ' + supportname.toString() + ' | ' + parseInt(creditPerHour) + ' | ' + parseInt(c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false) + c.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Power) + alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Power)) + ' | ' + parseInt(c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Tiberium, false, false) + c.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Tiberium) + alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Tiberium)) + ' | ' + parseInt(c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Crystal, false, false) + c.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Crystal) + alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Crystal)) + ' | ' + key + '';
															if(baseidforWorldmap == null)
																{
																	baseidforWorldmap = key;
																	coordsforWorldmap = c.get_PosX() + ':' + c.get_PosY();
																}
															
															// all Bases Tab
															BasenName.add(new qx.ui.basic.Label(c.get_Name().toString()).set({rich: true, alignX: "left"}));
															BasenBase.add(new qx.ui.basic.Label(c.get_LvlBase().toFixed(2).toString()).set({rich: true, alignX: "right"}));
															BasenOffensive.add(new qx.ui.basic.Label(c.get_LvlOffense().toFixed(2).toString()).set({rich: true, alignX: "right"}));
															BasenDefensive.add(new qx.ui.basic.Label(c.get_LvlDefense().toFixed(2).toString()).set({rich: true, alignX: "right"}));
															BasenBH.add(new qx.ui.basic.Label(aB_bhlvl).set({rich: true, alignX: "right"}));
															BasenCC.add(new qx.ui.basic.Label(aB_cclvl).set({rich: true, alignX: "right"}));
															BasenVE.add(new qx.ui.basic.Label(aB_velvl).set({rich: true, alignX: "right"}));
															BasenVZ.add(new qx.ui.basic.Label(aB_vzlvl).set({rich: true, alignX: "right"}));
															BasenSupport.add(new qx.ui.basic.Label(support.toFixed(0).toString() + " " + supportname.toString()).set({rich: true, alignX: "left"}));
															BasenTiberium.add(new qx.ui.basic.Label(parseInt(TiberiumProduction).toLocaleString()).set({rich: true, alignX: "right"}));
															BasenCrystal.add(new qx.ui.basic.Label(parseInt(CrystalProduction).toLocaleString()).set({rich: true, alignX: "right"}));
															BasenPower.add(new qx.ui.basic.Label(parseInt(PowerProduction).toLocaleString()).set({rich: true, alignX: "right"}));
															BasenCredits.add(new qx.ui.basic.Label(parseInt(creditPerHour).toLocaleString()).set({rich: true, alignX: "right"}));

														}
													catch (e)
														{
															console.warn("BaseInfo: AllBases - ", e); 
														}
												}
											
											def_durchschnitt = def_durchschnitt / player_basen;
											newAusgabe["off_basen"] = offbasen;
											if(player_basen>0)
												{
													newAusgabe["def_durchschnitt"] = "" + def_durchschnitt.toFixed(2).toString() + "";
												}
											else
												{
													newAusgabe["def_durchschnitt"] = 0;
												}
											newAusgabe["support_basen"] = support_gebaeude;
											if(support_gebaeude>0)
												{
													supportlvl = supportlvl / support_gebaeude;
													newAusgabe["support_lvl"] = "" + supportlvl.toFixed(2).toString() + "";
												}
											else
												{
													newAusgabe["support_lvl"] = 0;
												}
											VE_durchschnitt = VE_lvl / v;
											if(v>0)
												{
													newAusgabe["ve"] = "" + VE_durchschnitt.toFixed(2).toString() + "";
												}
											else
												{
													newAusgabe["ve"] = 0;
												}
											first_rep_flug = ClientLib.Vis.VisMain.FormatTimespan(firstRepairAir);
											first_rep_fahr = ClientLib.Vis.VisMain.FormatTimespan(firstRepairVehicle);
											first_rep_fuss = ClientLib.Vis.VisMain.FormatTimespan(firstRepairInfantry);
											if(first_rep_flug.split(":").length < 3)
												{
													first_rep_flug = "0:" + first_rep_flug;
												}
											if(first_rep_flug.split(":").length < 4)
												{
													first_rep_flug = "0:" + first_rep_flug;
												}
											if(first_rep_fahr.split(":").length < 3)
												{
													first_rep_fahr = "0:" + first_rep_fahr;
												}
											if(first_rep_fahr.split(":").length < 4)
												{
													first_rep_fahr = "0:" + first_rep_fahr;
												}
											if(first_rep_fuss.split(":").length < 3)
												{
													first_rep_fuss = "0:" + first_rep_fuss;
												}
											if(first_rep_fuss.split(":").length < 4)
												{
													first_rep_fuss = "0:" + first_rep_fuss;
												}
											second_rep_flug = ClientLib.Vis.VisMain.FormatTimespan(secondRepairAir);
											second_rep_fahr = ClientLib.Vis.VisMain.FormatTimespan(secondRepairVehicle);
											second_rep_fuss = ClientLib.Vis.VisMain.FormatTimespan(secondRepairInfantry);
											if(second_rep_flug.split(":").length < 3)
												{
													second_rep_flug = "0:" + second_rep_flug;
												}
											if(second_rep_flug.split(":").length < 4)
												{
													second_rep_flug = "0:" + second_rep_flug;
												}
											if(second_rep_fahr.split(":").length < 3)
												{
													second_rep_fahr = "0:" + second_rep_fahr;
												}
											if(second_rep_fahr.split(":").length < 4)
												{
													second_rep_fahr = "0:" + second_rep_fahr;
												}
											if(second_rep_fuss.split(":").length < 3)
												{
													second_rep_fuss = "0:" + second_rep_fuss;
												}
											if(second_rep_fuss.split(":").length < 4)
												{
													second_rep_fuss = "0:" + second_rep_fuss;
												}
											
											newAusgabe["AccountID"] = accountId;
											newAusgabe["AllianzID"] = AllianzID;
											if(AllianzID > 0) newAusgabe["AllianzName"] = AllianzName.toString();
											else newAusgabe["AllianzName"] = " ";
											if(AllianzID > 0) newAusgabe["AllianzRolle"] = AllianzRolle[PlayerID].toString();
											else newAusgabe["AllianzRolle"] = " ";
											newAusgabe["ServerName"] = serverName.toString();
											newAusgabe["SpielerID"] = PlayerID;
											newAusgabe["Spieler"] = PlayerName;
											newAusgabe["Klasse"] = factionArt[faction1];
											newAusgabe["Datum"] = Datum;
											newAusgabe["Uhrzeit"] = Uhrzeit;
											newAusgabe["Rang"] = playerRank;
											newAusgabe["Substitution"] = playerSubstitution;
											newAusgabe["maxKP"] = commandpointsMaxStorage;
											newAusgabe["repZeit"] = repairMaxTime / 60 / 60;
											newAusgabe["Basen"] = player_basen;
											newAusgabe["Creditproduktion"] = parseInt(creditsPerHour);
											newAusgabe["Tiberiumproduktion"] = parseInt(TiberiumsPerHour);
											newAusgabe["Kristallproduktion"] = parseInt(CrystalsPerHour);
											newAusgabe["Stromproduktion"] = parseInt(PowersPerHour);
											newAusgabe["1st_Base"] = firstBaselvl.toFixed(2).toString();
											newAusgabe["1st_Def"] = firstDeflvl.toFixed(2).toString();
											newAusgabe["1st_Off"] = firstOfflvl.toFixed(2).toString();
											newAusgabe["1st_Stromproduktion"] = parseInt(firstPowerProduction);
											newAusgabe["1st_Flugzeuge"] = first_rep_flug;
											newAusgabe["1st_Fahrzeuge"] = first_rep_fahr;
											newAusgabe["1st_Fusstruppen"] = first_rep_fuss;
											newAusgabe["2nd_Base"] = secondBaselvl.toFixed(2).toString();
											newAusgabe["2nd_Def"] = secondDeflvl.toFixed(2).toString();
											newAusgabe["2nd_Off"] = secondOfflvl.toFixed(2).toString();
											newAusgabe["2nd_Stromproduktion"] = parseInt(secondPowerProduction);
											newAusgabe["2nd_Flugzeuge"] = second_rep_flug;
											newAusgabe["2nd_Fahrzeuge"] = second_rep_fahr;
											newAusgabe["2nd_Fusstruppen"] = second_rep_fuss;
											newAusgabe["Leaders"] = leaders.l[leaders.l.indexOf(PlayerID)];
											newAusgabe["WorldID"] = worldidforWorldmap[3];
											newAusgabe["CoordsforWorldmap"] = coordsforWorldmap;
											newAusgabe["ShowonWorldmap"] = baseidforWorldmap;
											newAusgabe["Version"] = BIVERSION;

											var usersubmit = '';
											for(var werte in newAusgabe)
												{
													usersubmit += "[" + werte + "] == " + newAusgabe[werte] + "\n";
												}


											// Field 1
											var GeneralField1 = new qx.ui.container.Composite(new qx.ui.layout.VBox(2).set({alignX: "center"}));
											GeneralField1.add(new qx.ui.basic.Label("<big><u><b>" + Lang.gt("Allgemeine Informationen") + "</b></u></big>").set({rich: true, selectable: true}));
											GeneralField1.add(new qx.ui.basic.Label("").set({rich: true, selectable: true}));

											var GeneralField2 = new qx.ui.container.Composite(new qx.ui.layout.VBox(2).set({alignX: "center"}));
											GeneralField2.add(new qx.ui.basic.Label("<br><big><u><b>" + Lang.gt("Script Informationen") + "</b></u></big>").set({rich: true, selectable: true}));
											GeneralField2.add(new qx.ui.basic.Label("").set({rich: true, selectable: true}));

											// Field 2
											var field2 = new qx.ui.container.Composite(new qx.ui.layout.VBox(2).set({alignX: "center"}));
											field2.add(new qx.ui.basic.Label("<big><u><b>" + Lang.gt("Gesamte Produktion") + "</b></u></big>").set({rich: true, selectable: true}));
											field2.add(new qx.ui.basic.Label("").set({rich: true, selectable: true}));

											var production = new qx.ui.container.Composite(new qx.ui.layout.HBox(50).set({alignX: "center"}));
											// 2.1
											var playerproduction = new qx.ui.container.Composite(new qx.ui.layout.VBox(2).set({alignX: "center"}));
											playerproduction.add(new qx.ui.basic.Label("<b>" + Lang.gt("Spieler Produktion") + "</b><br><i>(" + Lang.gt("aller Basen") + ")</i>").set({rich: true, selectable: true}));
											// 2.2
											var overallproduction = new qx.ui.container.Composite(new qx.ui.layout.VBox(2).set({alignX: "center"}));
											overallproduction.add(new qx.ui.basic.Label("<b>" + Lang.gt("Gesamte Produktion") + "</b><br><i>(" + Lang.gt("inklusive POI Bonus") + ")</i>").set({rich: true, selectable: true}));

											// Field 3
											var field3 = new qx.ui.container.Composite(new qx.ui.layout.VBox(5).set({alignX: "center"}));
											field3.add(new qx.ui.basic.Label("").set({rich: true, selectable: true}));

											var offensive = new qx.ui.container.Composite(new qx.ui.layout.HBox(50).set({alignX: "center"}));
											// 3.1
											var firstoff = new qx.ui.container.Composite(new qx.ui.layout.VBox(2).set({alignX: "center"}));
											firstoff.add(new qx.ui.basic.Label("<big><u><b>" + Lang.gt("Erste Offensive") + "</b></u></big>").set({rich: true, selectable: true}));
											firstoff.add(new qx.ui.basic.Label("").set({rich: true, selectable: true}));
											// 3.2
											var secondoff = new qx.ui.container.Composite(new qx.ui.layout.VBox(2).set({alignX: "center"}));
											secondoff.add(new qx.ui.basic.Label("<big><u><b>" + Lang.gt("Zweite Offensive") + "</b></u></big>").set({rich: true, selectable: true}));
											secondoff.add(new qx.ui.basic.Label("").set({rich: true, selectable: true}));

								
											var chrystal,tiberium,power,dollar,squad,vehicle,plane,firstoff,secondoff,name,level,off,def,strom;

											GeneralField1.add(new qx.ui.basic.Atom("<b>" + Lang.gt("Account Erstellung") + ":</b> " + accountCreate.toString()).set({rich: true}));
											if(AllianzID > 0) GeneralField1.add(new qx.ui.basic.Atom("<b>" + Lang.gt("Allianz Rolle") + ":</b> " + AllianzRolle[PlayerID].toString()).set({rich: true}));
											else GeneralField1.add(new qx.ui.basic.Atom("<b>" + Lang.gt("Allianz Rolle") + ":</b> ---").set({rich: true}));
											GeneralField1.add(new qx.ui.basic.Atom("<b>" + Lang.gt("Spielername") + ":</b> " + PlayerName).set({rich: true}));
											GeneralField1.add(new qx.ui.basic.Atom("<b>" + Lang.gt("Spielerklasse") + ":</b> " + factionArt[faction1]).set({rich: true}));
											GeneralField1.add(new qx.ui.basic.Atom("<b>" + Lang.gt("Aktuelle Uhrzeit") + ":</b> " + Datum + " " + Uhrzeit).set({rich: true}));
											GeneralField1.add(new qx.ui.basic.Atom("<b>" + Lang.gt("Rang") + ":</b> " + playerRank).set({rich: true}));
											GeneralField1.add(new qx.ui.basic.Atom("<b>" + Lang.gt("Maximale KP") + ":</b> " + commandpointsMaxStorage).set({rich: true}));
											GeneralField1.add(new qx.ui.basic.Atom("<b>" + Lang.gt("Maximale Repzeit") + ":</b> " + repairMaxTime / 60 / 60 + " " + Lang.gt("Stunden")).set({rich: true}));
											GeneralField1.add(new qx.ui.basic.Atom("<b>" + Lang.gt("Basenanzahl") + ":</b> " + player_basen).set({rich: true}));
											GeneralField1.add(new qx.ui.basic.Atom("<b>" + Lang.gt("Anzahl Offensiv Basen") + ":</b> " + offbasen).set({rich: true}));
											GeneralField1.add(new qx.ui.basic.Atom("<b>" + Lang.gt("Support Gebäude Level Ø") + ":</b> " + newAusgabe["support_lvl"]).set({rich: true}));
											GeneralField1.add(new qx.ui.basic.Atom("<b>" + Lang.gt("VE Ø aller Basen") + ":</b> " + newAusgabe["ve"]).set({rich: true}));
											GeneralField1.add(new qx.ui.basic.Atom("<b>" + Lang.gt("Def Ø aller Basen") + ":</b> " + newAusgabe["def_durchschnitt"]).set({rich: true}));
											GeneralField1.add(new qx.ui.basic.Label("").set({rich: true, selectable: true}));
											var worldmap = '&nbsp;&nbsp;&nbsp;<a href="http://map.tiberium-alliances.com/map/'+worldidforWorldmap[3]+'#'+coordsforWorldmap+'|3|'+baseidforWorldmap+'|~" target="_blank"><button style="font-weight: bold; font-size: 18px;"><b>&nbsp;' + Lang.gt("Weltkarte") + '&nbsp;</b></button></a>';
											if(AllianzID > 0)
												{
													GeneralField1.add(new qx.ui.basic.Label('<form action="http://baseinfo.scriptarea.net/index.php" method="post" target="_blank" style="display:inline;"><input type="hidden" name="usersubmit" value="' + usersubmit + '" /><input type="hidden" name="allBases" value="' + allBases + '" /><input type="hidden" name="allMembers" value="' + AllianzMemberList + '" /><input type="submit" name="" value="&nbsp;' + Lang.gt("Werte übertragen") + '&nbsp;" style="font-weight: bold; font-size: 18px;" /></form> ' + worldmap + '').set({rich: true, selectable: true}));
												}
											else
												{
													GeneralField1.add(new qx.ui.basic.Label("<button disabled='disabled'><s>&nbsp;" + Lang.gt('Werte übertragen') + "&nbsp;</s></button>").set({rich: true, selectable: true, toolTipText: "Deactivated"}));
												}

											GeneralField2.add(new qx.ui.basic.Atom("<b>" + Lang.gt("Name") + ":</b> " + BICLASS).set({rich: true}));
											GeneralField2.add(new qx.ui.basic.Atom("<b>" + Lang.gt("Version") + ":</b> " + BIVERSION).set({rich: true}));
											GeneralField2.add(new qx.ui.basic.Atom("<b>" + Lang.gt("Ersteller") + ":</b> " + BIAUTHOR).set({rich: true}));
											GeneralField2.add(new qx.ui.basic.Atom("<b>" + Lang.gt("Webseite") + ":</b> <a href='" + BIHOMEPAGE + "' target='_blank'>" + BIHOMEPAGE + "</a>").set({rich: true}));
											if(AllianzID > 0) GeneralField2.add(new qx.ui.basic.Atom("<b>" + Lang.gt("E-Mail") + ":</b> <a href='mailto:" + BICONTACT + "?subject=BaseInfo%20InGame%20Contact&amp;body=Hi, my InGame Name is " + PlayerName.toString() + " and im in the alliance " + AllianzName.toString() + " and im playing at the world " + serverName.toString() + " (" + worldidforWorldmap[3] + "),' target='_blank'>" + BICONTACT + "</a>").set({rich: true}));
											else GeneralField2.add(new qx.ui.basic.Atom("<b>" + Lang.gt("E-Mail") + ":</b> <a href='mailto:" + BICONTACT + "?subject=BaseInfo%20InGame%20Contact&amp;body=Hi, my InGame Name is " + PlayerName.toString() + " and im not in a alliance and im playing at the world " + serverName.toString() + " (" + worldidforWorldmap[3] + "),' target='_blank'>" + BICONTACT + "</a>").set({rich: true}));

											playerproduction.add(chrystal = new qx.ui.basic.Atom("" + parseInt(CrystalsProduction).toLocaleString() + "", "webfrontend/ui/common/icn_res_chrystal.png").set({rich: true}));
											chrystal.setToolTipIcon("webfrontend/ui/common/icn_res_chrystal.png");
											chrystal.setToolTipText(Lang.gt("Kristall Produktion"));
											chrystal.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											production.add(playerproduction);
											playerproduction.add(tiberium = new qx.ui.basic.Atom("" + parseInt(TiberiumsProduction).toLocaleString() + "", "webfrontend/ui/common/icn_res_tiberium.png").set({rich: true}));
											tiberium.setToolTipIcon("webfrontend/ui/common/icn_res_tiberium.png");
											tiberium.setToolTipText(Lang.gt("Tiberium Produktion"));
											tiberium.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											production.add(playerproduction);
											playerproduction.add(power = new qx.ui.basic.Atom("" + parseInt(PowersProduction).toLocaleString() + "", "webfrontend/ui/common/icn_res_power.png").set({rich: true}));
											power.setToolTipIcon("webfrontend/ui/common/icn_res_power.png");
											power.setToolTipText(Lang.gt("Strom Produktion"));
											power.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											production.add(playerproduction);
											playerproduction.add(dollar = new qx.ui.basic.Atom("" + parseInt(creditsPerHour).toLocaleString() + "", "webfrontend/ui/common/icn_res_dollar.png").set({rich: true}));
											dollar.setToolTipIcon("webfrontend/ui/common/icn_res_dollar.png");
											dollar.setToolTipText(Lang.gt("Credit Produktion"));
											dollar.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											production.add(playerproduction);
											
											overallproduction.add(chrystal = new qx.ui.basic.Atom("" + parseInt(CrystalsPerHour).toLocaleString() + "", "webfrontend/ui/common/icn_res_chrystal.png").set({rich: true}));
											chrystal.setToolTipIcon("webfrontend/ui/common/icn_res_chrystal.png");
											chrystal.setToolTipText(Lang.gt("Gesamte Kristall Produktion"));
											chrystal.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											production.add(overallproduction);
											overallproduction.add(tiberium = new qx.ui.basic.Atom("" + parseInt(TiberiumsPerHour).toLocaleString(), "webfrontend/ui/common/icn_res_tiberium.png").set({rich: true}));
											tiberium.setToolTipIcon("webfrontend/ui/common/icn_res_tiberium.png");
											tiberium.setToolTipText(Lang.gt("Gesamte Tiberium Produktion"));
											tiberium.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											production.add(overallproduction);
											overallproduction.add(power = new qx.ui.basic.Atom("" + parseInt(PowersPerHour).toLocaleString(), "webfrontend/ui/common/icn_res_power.png").set({rich: true}));
											power.setToolTipIcon("webfrontend/ui/common/icn_res_power.png");
											power.setToolTipText(Lang.gt("Gesamte Strom Produktion"));
											power.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											production.add(overallproduction);

											firstoff.add(name = new qx.ui.basic.Atom(firstBaseName, "FactionUI/icons/icon_arsnl_base_buildings.png").set({rich: true}));
											name.setToolTipIcon("FactionUI/icons/icon_arsnl_base_buildings.png");
											name.setToolTipText("1st-OFF: " + Lang.gt("Basis Name"));
											name.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											offensive.add(firstoff);
											firstoff.add(level = new qx.ui.basic.Atom(firstBaselvl.toFixed(2).toString(), "FactionUI/icons/icon_arsnl_base_buildings.png").set({rich: true}));
											level.setToolTipIcon("FactionUI/icons/icon_arsnl_base_buildings.png");
											level.setToolTipText("1st-OFF: " + Lang.gt("Basis Level"));
											level.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											offensive.add(firstoff);
											firstoff.add(off = new qx.ui.basic.Atom(firstOfflvl.toFixed(2).toString(), "FactionUI/icons/icon_army_points.png").set({rich: true}));
											off.setToolTipIcon("FactionUI/icons/icon_army_points.png");
											off.setToolTipText("1st-OFF: " + Lang.gt("Offensiv Level"));
											off.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											offensive.add(firstoff);
											firstoff.add(def = new qx.ui.basic.Atom(firstDeflvl.toFixed(2).toString(), "FactionUI/icons/icon_def_army_points.png").set({rich: true}));
											def.setToolTipIcon("FactionUI/icons/icon_def_army_points.png");
											def.setToolTipText("1st-OFF: " + Lang.gt("Defensiv Level"));
											def.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											offensive.add(firstoff);
											firstoff.add(strom = new qx.ui.basic.Atom(parseInt(firstPowerProduction).toLocaleString(), "webfrontend/ui/common/icn_res_power.png").set({rich: true}));
											strom.setToolTipIcon("webfrontend/ui/common/icn_res_power.png");
											strom.setToolTipText("1st-OFF: " + Lang.gt("Strom Produktion"));
											strom.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											offensive.add(firstoff);
											firstoff.add(squad = new qx.ui.basic.Atom(first_rep_fuss, "FactionUI/icons/icon_arsnl_off_squad.png").set({rich: true}));
											squad.setToolTipIcon("FactionUI/icons/icon_arsnl_off_squad.png");
											squad.setToolTipText("1st-OFF: " + Lang.gt("Fußtruppen Reparaturzeit"));
											squad.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											offensive.add(firstoff);
											firstoff.add(vehicle = new qx.ui.basic.Atom(first_rep_fahr, "FactionUI/icons/icon_arsnl_off_vehicle.png").set({rich: true}));
											vehicle.setToolTipIcon("FactionUI/icons/icon_arsnl_off_vehicle.png");
											vehicle.setToolTipText("1st-OFF: " + Lang.gt("Fahrzeug Reparaturzeit"));
											vehicle.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											offensive.add(firstoff);
											firstoff.add(plane = new qx.ui.basic.Atom(first_rep_flug, "FactionUI/icons/icon_arsnl_off_plane.png").set({rich: true}));
											plane.setToolTipIcon("FactionUI/icons/icon_arsnl_off_plane.png");
											plane.setToolTipText("1st-OFF: " + Lang.gt("Flugzeug Reparaturzeit"));
											plane.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											offensive.add(firstoff);

											secondoff.add(name = new qx.ui.basic.Atom(secondBaseName, "FactionUI/icons/icon_arsnl_base_buildings.png").set({rich: true}));
											name.setToolTipIcon("FactionUI/icons/icon_arsnl_base_buildings.png");
											name.setToolTipText("2nd-OFF: " + Lang.gt("Basis Name"));
											name.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											offensive.add(secondoff);
											secondoff.add(level = new qx.ui.basic.Atom(secondBaselvl.toFixed(2).toString(), "FactionUI/icons/icon_arsnl_base_buildings.png").set({rich: true}));
											level.setToolTipIcon("FactionUI/icons/icon_arsnl_base_buildings.png");
											level.setToolTipText("2nd-OFF: " + Lang.gt("Basis Level"));
											level.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											offensive.add(secondoff);
											secondoff.add(off = new qx.ui.basic.Atom(secondOfflvl.toFixed(2).toString(), "FactionUI/icons/icon_army_points.png").set({rich: true}));
											off.setToolTipIcon("FactionUI/icons/icon_army_points.png");
											off.setToolTipText("2nd-OFF: " + Lang.gt("Offensiv Level"));
											off.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											offensive.add(secondoff);
											secondoff.add(def = new qx.ui.basic.Atom(secondDeflvl.toFixed(2).toString(), "FactionUI/icons/icon_def_army_points.png").set({rich: true}));
											def.setToolTipIcon("FactionUI/icons/icon_def_army_points.png");
											def.setToolTipText("2nd-OFF: " + Lang.gt("Defensive Level"));
											def.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											offensive.add(secondoff);
											secondoff.add(strom = new qx.ui.basic.Atom(parseInt(secondPowerProduction).toLocaleString(), "webfrontend/ui/common/icn_res_power.png").set({rich: true}));
											strom.setToolTipIcon("webfrontend/ui/common/icn_res_power.png");
											strom.setToolTipText("2nd-OFF: " + Lang.gt("Strom Produktion"));
											strom.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											offensive.add(secondoff);
											secondoff.add(squad = new qx.ui.basic.Atom(second_rep_fuss, "FactionUI/icons/icon_arsnl_off_squad.png").set({rich: true}));
											squad.setToolTipIcon("FactionUI/icons/icon_arsnl_off_squad.png");
											squad.setToolTipText("2nd-OFF: " + Lang.gt("Fußtruppen Reparaturzeit"));
											squad.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											offensive.add(secondoff);
											secondoff.add(vehicle = new qx.ui.basic.Atom(second_rep_fahr, "FactionUI/icons/icon_arsnl_off_vehicle.png").set({rich: true}));
											vehicle.setToolTipIcon("FactionUI/icons/icon_arsnl_off_vehicle.png");
											vehicle.setToolTipText("2nd-OFF: " + Lang.gt("Fahrzeug Reparaturzeit"));
											vehicle.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											offensive.add(secondoff);
											secondoff.add(plane = new qx.ui.basic.Atom(second_rep_flug, "FactionUI/icons/icon_arsnl_off_plane.png").set({rich: true}));
											plane.setToolTipIcon("FactionUI/icons/icon_arsnl_off_plane.png");
											plane.setToolTipText("2nd-OFF: " + Lang.gt("Flugzeug Reparaturzeit"));
											plane.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
											offensive.add(secondoff);

											// Tab 1 General Informations
											this.BaseinfoGeneralVBox.add(GeneralField1);
											this.BaseinfoGeneralVBox.add(GeneralField2);

											// Tab 2 Base values
											field2.add(production);
											field3.add(offensive);
											this.BaseinfoBasesVBox.add(field2);
											field3.add(new qx.ui.basic.Label("").set({rich: true, selectable: true}));
											field3.add(new qx.ui.basic.Label("").set({rich: true, selectable: true}));
											this.BaseinfoBasesVBox.add(field3);
											
											// Tab 3 Basen
											Basen.add(BasenName);
											Basen.add(BasenBase);
											Basen.add(BasenOffensive);
											Basen.add(BasenDefensive);
											Basen.add(BasenBH);
											Basen.add(BasenCC);
											Basen.add(BasenVE);
											Basen.add(BasenVZ);
											Basen.add(BasenSupport);
											Basen.add(BasenTiberium);
											Basen.add(BasenCrystal);
											Basen.add(BasenPower);
											Basen.add(BasenCredits);
											GeneralField5.add(Basen);
											this.BaseinfoAllBasesVBox.add(GeneralField5);
										}
									catch(e)
										{
											console.log("BaseInfo: Loading Error - ", e);
										}
								}
							}
						});
					}
				catch (e)
					{
						console.warn("qx.Class.define(BaseInfo: ", e);
					}
					var Lang = BaseInfoLang.getInstance();
					BaseInfo.getInstance();
            }
        function LoadExtension()
            {
                try
                    {
                        if (typeof(qx)!='undefined')
                            {
                                if (!!qx.core.Init.getApplication().getMenuBar())
                                    {
                                        BaseInfoCreate();
                                        BaseInfo.getInstance().initialize();
                                        return;
                                    }
                            }
                    }
                catch (e)
                    {
                        if (console !== undefined) console.log(e);
                        else if (window.opera) opera.postError(e);
                        else GM_log(e);
                    }
                window.setTimeout(LoadExtension, 1000);
            }
        LoadExtension();
    }
    function Inject()
        {
            if (window.location.pathname != ("/login/auth"))
                {
                    var Script = document.createElement("script");
                    Script.innerHTML = "(" + BaseInfoMain.toString() + ")();";
                    Script.type = "text/javascript";        
                    document.getElementsByTagName("head")[0].appendChild(Script);
                }
        }
    Inject();
})();
