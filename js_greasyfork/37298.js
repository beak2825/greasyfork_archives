// ==UserScript==
// @name           RatingR3-En-season 45
// @version        1.0
// @description    REREC(+b), Season TI, TrExMa, RatingR3(beta)  JP/EN
// @include			http://trophymanager.com/players/*
// @include			https://trophymanager.com/players/*
// @include			https://fb.trophymanager.com/players/*
// @exclude			http://trophymanager.com/players/compare/*
// @exclude			https://trophymanager.com/players/compare/*
// @exclude			https://fb.trophymanager.com/players/compare/*
// @namespace https://greasyfork.org/users/18768
// @downloadURL https://update.greasyfork.org/scripts/37298/RatingR3-En-season%2045.user.js
// @updateURL https://update.greasyfork.org/scripts/37298/RatingR3-En-season%2045.meta.js
// ==/UserScript==
/////////////////////////////////////////////////////////////////////////////////////////////////////////
var version = "en";	// original version or english version
///////////////////// Original = or
//////////////////// English = en
////////////////////////////////////////////////////////////////////////////////////////////////////////

var r3max = 25;			// RatingR3 MAX = 100 + r3max
var rou_factor = 0.006153231 * r3max;
var wage_rate = 19.76*0.8

// Array to setup the weights of particular skills for each player's actual ability
// This is the direct weight to be given to each skill.
// Array maps to these skills:
//				 [Str,Sta,Pac,Mar,Tac,Wor,Pos,Pas,Cro,Tec,Hea,Fin,Lon,Set]
var positions = [[  1,  3,  1,  1,  1,  3,  3,  2,  2,  2,  1,  3,  3,  3], // D C
				 [  2,  3,  1,  1,  1,  3,  3,  2,  2,  2,  2,  3,  3,  3], // D L
				 [  2,  3,  1,  1,  1,  3,  3,  2,  2,  2,  2,  3,  3,  3], // D R
				 [  1,  2,  2,  1,  1,  1,  1,  1,  2,  2,  1,  3,  3,  3], // DM C
				 [  2,  3,  1,  1,  1,  3,  3,  2,  2,  2,  2,  3,  3,  3], // DM L
				 [  2,  3,  1,  1,  1,  3,  3,  2,  2,  2,  2,  3,  3,  3], // DM R
				 [  2,  2,  3,  1,  1,  1,  1,  1,  3,  1,  2,  3,  3,  3], // M C 
				 [  2,  2,  1,  1,  1,  1,  1,  1,  1,  1,  2,  3,  3,  3], // M L
				 [  2,  2,  1,  1,  1,  1,  1,  1,  1,  1,  2,  3,  3,  3], // M R
				 [  2,  3,  3,  2,  2,  1,  1,  1,  3,  1,  2,  1,  1,  3], // OM C
				 [  2,  2,  1,  3,  3,  2,  2,  3,  1,  1,  2,  2,  2,  3], // OM L
				 [  2,  2,  1,  3,  3,  2,  2,  3,  1,  1,  2,  2,  2,  3], // OM R
				 [  1,  2,  2,  3,  3,  2,  2,  3,  3,  2,  1,  1,  1,  3], // F
				 [  2,  3,  2,  1,  2,  1,  2,  2,  3,  3,  3]]; // GK

// Weights need to total 100
var weights = [ [85,12, 3],  // D C
				[70,25, 5],  // D L
				[70,25, 5],  // D R
				[90,10, 0],  // DM C
				[50,40,10],  // DM L
				[50,40,10],  // DM R
				[85,12, 3],  // M C			   
				[90, 7, 3],  // M L
				[90, 7, 3],  // M R
				[90,10, 0],  // OM C
				[60,35, 5],  // OM  L
				[60,35, 5],  // OMR
				[80,18, 2],  // F
				[50,42, 8]]; // GK

var weightR3 = [[	0.51872935	,	0.29081119	,	0.57222393	,	0.89735816	,	0.84487852	,	0.50887940	,	0.50887940	,	0.13637928	,	0.05248024	,	0.09388931	,	0.57549122	,	0.00000000	,	0.00000000	,	0.0	],	// DC
                [	0.45240063	,	0.31762087	,	0.68150374	,	0.77724031	,	0.74690951	,	0.50072196	,	0.45947168	,	0.17663123	,	0.23886264	,	0.18410349	,	0.46453393	,	0.00000000	,	0.00000000	,	0.0	],	// DL/R
                [	0.43789335	,	0.31844356	,	0.53515723	,	0.63671706	,	0.59109742	,	0.51311701	,	0.53184426	,	0.32421168	,	0.06318165	,	0.27931537	,	0.50093723	,	0.19317517	,	0.07490902	,	0.0	],	// DMC
                [	0.42311032	,	0.32315966	,	0.62271745	,	0.53932111	,	0.51442838	,	0.49835997	,	0.47896659	,	0.26434782	,	0.22586124	,	0.32182902	,	0.45537227	,	0.23961054	,	0.09291562	,	0.0	],	// DML/R
                [	0.31849880	,	0.36581214	,	0.50091016	,	0.31726444	,	0.28029020	,	0.52022170	,	0.55763723	,	0.60199246	,	0.10044356	,	0.51811057	,	0.38320838	,	0.38594825	,	0.14966211	,	0.0	],	// MC
                [	0.35409971	,	0.34443972	,	0.64417234	,	0.30427501	,	0.27956082	,	0.49925481	,	0.46093655	,	0.32887111	,	0.38695101	,	0.47884837	,	0.37465446	,	0.39194758	,	0.15198852	,	0.0	],	// ML/R
                [	0.32272636	,	0.35024067	,	0.48762872	,	0.22888914	,	0.19049636	,	0.52620414	,	0.57842512	,	0.53330409	,	0.07523792	,	0.55942740	,	0.39986691	,	0.53866926	,	0.20888391	,	0.0	],	// OMC
                [	0.36311066	,	0.33106245	,	0.61831416	,	0.19830147	,	0.17415753	,	0.50049575	,	0.47737842	,	0.28937553	,	0.34729042	,	0.52834210	,	0.39939218	,	0.55684664	,	0.21593269	,	0.0	],	// OML/R
                [	0.40622753	,	0.29744114	,	0.39446722	,	0.09952139	,	0.07503885	,	0.50402399	,	0.58505850	,	0.36932466	,	0.05210389	,	0.53677990	,	0.51998862	,	0.83588627	,	0.32413803	,	0.0	],	// F
                [	0.37313433	,	0.37313433	,	0.37313433	,	0.74626866	,	0.52238806	,	0.74626866	,	0.52238806	,	0.52238806	,	0.37313433	,	0.22388060	,	0.22388060	]];	// GK

// RECb weights		Str				Sta				Pac				Mar				Tac				Wor				Pos				Pas				Cro				Tec				Hea				Fin				Lon				Set
var weightRb = [[	0.10476131	,	0.05214691	,	0.07928798	,	0.14443775	,	0.13140328	,	0.06543399	,	0.07762453	,	0.06649973	,	0.05174317	,	0.02761713	,	0.12122597	,	0.01365182	,	0.02547069	,	0.03869574	],	// DC
                [	0.07660230	,	0.05043295	,	0.11528887	,	0.11701021	,	0.12737497	,	0.07681385	,	0.06343039	,	0.03777422	,	0.10320519	,	0.06396543	,	0.09155298	,	0.01367035	,	0.02554511	,	0.03733318	],	// DL/R
                [	0.08236460	,	0.08557545	,	0.07284710	,	0.09846060	,	0.08838358	,	0.09150784	,	0.09684525	,	0.08929752	,	0.04594195	,	0.06011878	,	0.05462556	,	0.04891765	,	0.05864571	,	0.02646840	],	// DMC
                [	0.06705156	,	0.06600599	,	0.10002073	,	0.08249862	,	0.09719526	,	0.09243450	,	0.08504033	,	0.06129130	,	0.10295145	,	0.08088686	,	0.04665721	,	0.03841339	,	0.05222570	,	0.02732710	],	// DML/R
                [	0.07333243	,	0.08171847	,	0.07197804	,	0.08469622	,	0.07098103	,	0.09554048	,	0.09470328	,	0.09576006	,	0.04729121	,	0.07092367	,	0.04588383	,	0.05986604	,	0.07170498	,	0.03562024	],	// MC
                [	0.06527363	,	0.06410270	,	0.09701305	,	0.07406706	,	0.08563595	,	0.09648566	,	0.08651209	,	0.06357183	,	0.10819222	,	0.07386495	,	0.03245554	,	0.05430668	,	0.06572005	,	0.03279859	],	// ML/R
                [	0.07886961	,	0.07955547	,	0.07497831	,	0.06915926	,	0.05059290	,	0.08160950	,	0.08206952	,	0.10911727	,	0.03482457	,	0.07593779	,	0.06515279	,	0.07472116	,	0.09098089	,	0.03243097	],	// OMC
                [	0.06545375	,	0.06145378	,	0.10503536	,	0.06421508	,	0.07627526	,	0.09232981	,	0.07763931	,	0.07001035	,	0.11307331	,	0.07298351	,	0.04248486	,	0.06462713	,	0.07038293	,	0.02403557	],	// OML/R
                [	0.07739710	,	0.05095200	,	0.07641981	,	0.01310784	,	0.01149133	,	0.06383764	,	0.07762980	,	0.07632566	,	0.02708970	,	0.07771063	,	0.12775187	,	0.15339719	,	0.12843583	,	0.03845360	],	// F

                [	0.07466384	,	0.07466384	,	0.07466384	,	0.14932769	,	0.10452938	,	0.14932769	,	0.10452938	,	0.10344411	,	0.07512610	,	0.04492581	,	0.04479831	]];	// GK						

// REC weights Str				   Sta				  Pac				 Mar				 Tac				 Wor				Pos				   Pas				  Cro				 Tec				Hea				   Fin				  Lon				 Set
var weightR = [[0.653962303361921,  0.330014238020285, 0.562994547223387, 0.891800163983125,  0.871069095865164,  0.454514672470839, 0.555697278549252, 0.42777598627972,  0.338218821750765, 0.134348455965202, 0.796916786677566, 0.048831870932616, 0.116363443378865, 0.282347752982916],	//DC
			   [0.565605120229193,  0.430973382039533, 0.917125432457378, 0.815702528287723,  0.99022325015212,   0.547995876625372, 0.522203232914265, 0.309928898819518, 0.837365352274204, 0.483822472259513, 0.656901420858592, 0.137582588344562, 0.163658117596413, 0.303915447383549],	//DL/R
			   [0.55838825558912,   0.603683502357502, 0.563792314670998, 0.770425088563048,  0.641965853834719,  0.675495235675077, 0.683863478201805, 0.757342915150728, 0.473070797767482, 0.494107823556837, 0.397547163237438, 0.429660916538242, 0.56364174077388,  0.224791093448809],	//DMC
			   [0.582074038075056,  0.420032202680124, 0.7887541874616,   0.726221389774063,  0.722972329840151,  0.737617252827595, 0.62234458453736,  0.466946909655194, 0.814382915598981, 0.561877829393632, 0.367446981999576, 0.360623408340649, 0.390057769678583, 0.249517737311268],	//DML/R
			   [0.578431939417021,  0.778134685048085, 0.574726322388294, 0.71400292078636,   0.635403391007978,  0.822308254446722, 0.877857040588335, 0.864265671245476, 0.433450219618618, 0.697164252367046, 0.412568516841575, 0.586627586272733, 0.617905053049757, 0.308426814834866],	//MC
			   [0.497429376361348,  0.545347364699553, 0.788280917110089, 0.578724574327427,  0.663235306043286,  0.772537143243647, 0.638706135095199, 0.538453108494387, 0.887935381275257, 0.572515970409641, 0.290549550901104, 0.476180499897665, 0.526149424898544, 0.287001645266184],	//ML/R
			   [0.656437768926678,  0.617260722143117, 0.656569986958435, 0.63741054520629,   0.55148452726771,   0.922379789905246, 0.790553566121791, 0.999688557334153, 0.426203575603164, 0.778770912265944, 0.652374065121788, 0.662264393455567, 0.73120100926333,  0.274563618133769],	//OMC
			   [0.483341947292063,  0.494773052635464, 0.799434804259974, 0.628789194186491,  0.633847969631333,  0.681354437033551, 0.671233869875345, 0.536121458625519, 0.849389745477645, 0.684067723274814, 0.389732973354501, 0.499972692291964, 0.577231818355874, 0.272773352088982],	//OML/R
			   [0.493917051093473,  0.370423904816088, 0.532148929996192, 0.0629206658586336, 0.0904950078155216, 0.415494774080483, 0.54106107545574,  0.468181146095801, 0.158106484131194, 0.461125738338018, 0.83399612271067,  0.999828328674183, 0.827171977606305, 0.253225855459207],	//F
//			   For  Rez    Vit  Ind  One  Ref Aer  Sar  Com    Deg    Aru
			   [0.5, 0.333, 0.5, 1,   0.5, 1,  0.5, 0.5, 0.333, 0.333, 0.333]]; //GK

//				DC		   DL/R		  DMC		  DML/R		  MC		  ML/R		  OMC		  OML/R		  F			  GK
var recLast = [[14.866375, 15.980742, 15.8932675, 15.5835325, 17.6955092, 16.6189141, 18.1255351, 15.6304867, 13.2762119, 15],
			   [18.95664,  22.895539, 23.1801296, 23.2813871, 26.8420884, 23.9940623, 27.8974544, 24.54323,   19.5088591, 22.3]];

				  // L	DC	R	L	DMC	R	L	MC	R	L	OMC	R	F
var	positionsAll = [[2,	0,	2,	3,	1,	3,	4,	2,	4,	4,	3,	4,	4],	// D C
					[0,	2,	1,	1,	3,	2,	2,	4,	3,	3,	4,	4,	4],	// D L
					[1,	2,	0,	2,	3,	1,	3,	4,	2,	4,	4,	3,	4],	// D R
					[3,	1,	3,	2,	0,	2,	3,	1,	3,	4,	2,	4,	3],	// DM C
					[1,	3,	2,	0,	2,	1,	1,	3,	2,	2,	4,	3,	4],	// DM L
					[2,	3,	1,	1,	2,	0,	2,	3,	1,	3,	4,	2,	4],	// DM R
					[4,	2,	4,	3,	1,	3,	2,	0,	2,	3,	1,	3,	2],	// M C
					[2,	4,	3,	1,	3,	2,	0,	2,	1,	1,	3,	2,	4],	// M L
					[3,	4,	2,	2,	3,	1,	1,	2,	0,	2,	3,	1,	4],	// M R
					[4,	3,	4,	4,	2,	4,	3,	1,	3,	2,	0,	2,	1],	// OM C
					[3,	4,	4,	2,	4,	3,	1,	3,	2,	0,	2,	1,	3],	// OM L
					[4,	4,	3,	3,	4,	2,	2,	3,	1,	1,	2,	0,	3],	// OM R
					[4,	4,	4,	4,	3,	4,	4,	2,	4,	3,	1,	3,	0]]	// F

var positionNames = ["D C", "D L", "D R", "DM C", "DM L", "DM R", "M C", "M L", "M R", "OM C", "OM L", "OM R", "F", "GK"];
var positionFullNames = [
/* EN */	["Defender Center", "Defender Left", "Defender Right", "Defensive Midfielder Center", "Defensive Midfielder Left", "Defensive Midfielder Right", "Midfielder Center", "Midfielder Left", "Midfielder Right", "Offensive Midfielder Center", "Offensive Midfielder Left", "Offensive Midfielder Right", "Forward", "Goalkeeper"],
/* JP */	["ディフェンダー 中央", "ディフェンダー 左", "ディフェンダー 右", "守備的ミッドフィルダー 中央", "守備的ミッドフィルダー 左", "守備的ミッドフィルダー 右", "ミッドフィルダー 中央", "ミッドフィルダー 左", "ミッドフィルダー 右", "攻撃的ミッドフィルダー 中央", "攻撃的ミッドフィルダー 左", "攻撃的ミッドフィルダー 右", "フォワード", "ゴールキーパー"],
/* PL */	["Obrońca środkowy", "Obrońca lewy", "Obrońca prawy", "Defensywny pomocnik środkowy", "Defensywny pomocnik lewy", "Defensywny pomocnik prawy", "Pomocnik środkowy", "Pomocnik lewy", "Pomocnik prawy", "Ofensywny pomocnik środkowy", "Ofensywny pomocnik lewy", "Ofensywny pomocnik prawy", "Napastnik", "Bramkarz"],
/* DK */	["Forsvar Centralt", "Forsvar Venstre", "Forsvar Højre", "Defensiv Midtbane Centralt", "Defensiv Midtbane Venstre", "Defensiv Midtbane Højre", "Midtbane Centralt", "Midtbane Venstre", "Midtbane Højre", "Offensiv Midtbane Centralt", "Offensiv Midtbane Venstre", "Offensiv Midtbane Højre", "Angriber", "Målmand"],
/* IT */	["Difensore Centrale", "Difensore Sinistro", "Difensore Destro", "Centrocampista Difensivo Centrale", "Centrocampista Difensivo Sinistro", "Centrocampista Difensivo Destro", "Centrocampista Centrale", "Centrocampista Sinistro", "Centrocampista Destro", "Centrocampista Offensivo Centrale", "Centrocampista Offensivo Sinistro", "Centrocampista Offensivo Destro", "Attaccante", "Portiere"],
/* ES */	["Defensa Central", "Defensa Izquierdo", "Defensa Derecho", "Mediocampista Defensivo Central", "Mediocampista Defensivo Izquierdo", "Mediocampista Defensivo Derecho", "Mediocampista Central", "Mediocampista Izquierdo", "Mediocampista Derecho", "Mediocampista Ofensivo Central", "Mediocampista Ofensivo Izquierdo", "Mediocampista Ofensivo Derecho", "Delantero", "Portero"],
/* FR */	["Défenseur Central", "Défenseur Gauche", "Défenseur Droit", "Milieu défensif Central", "Milieu défensif Gauche", "Milieu défensif Droit", "Milieu Central", "Milieu Gauche", "Milieu Droit", "Milieu offensif Central", "Milieu offensif Gauche", "Milieu offensif Droit", "Attaquant", "Gardien de but"],
/* AR */	["Defender Center", "Defender Left", "Defender Right", "Defensive Midfielder Center", "Defensive Midfielder Left", "Defensive Midfielder Right", "Midfielder Center", "Midfielder Left", "Midfielder Right", "Offensive Midfielder Center", "Offensive Midfielder Left", "Offensive Midfielder Right", "Forward", "Goalkeeper"],
/* HR */	["Obrambeni Sredina", "Obrambeni Lijevo", "Obrambeni Desno", "Defenzivni vezni Sredina", "Defenzivni vezni Lijevo", "Defenzivni vezni Desno", "Vezni Sredina", "Vezni Lijevo", "Vezni Desno", "Ofenzivni vezni Sredina", "Ofenzivni vezni Lijevo", "Ofenzivni vezni Desno", "Napadač", "Golman"],
/* DE */	["Verteidiger Zentral", "Verteidiger Links", "Verteidiger Rechts", "Defensiver Mittelfeldspieler Zentral", "Defensiver Mittelfeldspieler Links", "Defensiver Mittelfeldspieler Rechts", "Mittelfeldspieler Zentral", "Mittelfeldspieler Links", "Mittelfeldspieler Rechts", "Offensiver Mittelfeldspieler Zentral", "Offensiver Mittelfeldspieler Links", "Offensiver Mittelfeldspieler Rechts", "Stürmer", "Torhüter"],
/* PO */	["Defesa Centro", "Defesa Esquerdo", "Defesa Direito", "Médio Defensivo Centro", "Médio Defensivo Esquerdo", "Médio Defensivo Direito", "Medio Centro", "Medio Esquerdo", "Medio Direito", "Medio Ofensivo Centro", "Medio Ofensivo Esquerdo", "Medio Ofensivo Direito", "Avançado", "Guarda-Redes"],
/* RO */	["Fundas Central", "Fundas Stânga", "Fundas Dreapta", "Mijlocas Defensiv Central", "Mijlocas Defensiv Stânga", "Mijlocas Defensiv Dreapta", "Mijlocas Central", "Mijlocas Stânga", "Mijlocas Dreapta", "Mijlocas Ofensiv Central", "Mijlocas Ofensiv Stânga", "Mijlocas Ofensiv Dreapta", "Atacant", "Portar"],
/* TR */	["Defans Orta", "Defans Sol", "Defans Sağ", "Defansif Ortasaha Orta", "Defansif Ortasaha Sol", "Defansif Ortasaha Sağ", "Ortasaha Orta", "Ortasaha Sol", "Ortasaha Sağ", "Ofansif Ortasaha Orta", "Ofansif Ortasaha Sol", "Ofansif Ortasaha Sağ", "Forvet", "Kaleci"],
/* RU */	["Defender Center", "Defender Left", "Defender Right", "Defensive Midfielder Center", "Defensive Midfielder Left", "Defensive Midfielder Right", "Midfielder Center", "Midfielder Left", "Midfielder Right", "Offensive Midfielder Center", "Offensive Midfielder Left", "Offensive Midfielder Right", "Forward", "Goalkeeper"],
/* CZ */	["Obránce Střední", "Obránce Levý", "Obránce Pravý", "Defenzivní Záložník Střední", "Defenzivní Záložník Levý", "Defenzivní Záložník Pravý", "Záložník Střední", "Záložník Levý", "Záložník Pravý", "Ofenzivní záložník Střední", "Ofenzivní záložník Levý", "Ofenzivní záložník Pravý", "Útočník", "Gólman"],
/* HU */	["Védő , középső", "Védő , bal oldali", "Védő , jobb oldali", "Védekező Középpályás , középső", "Védekező Középpályás , bal oldali", "Védekező Középpályás , jobb oldali", "Középpályás , középső", "Középpályás , bal oldali", "Középpályás , jobb oldali", "Támadó középpályás , középső", "Támadó középpályás , bal oldali", "Támadó középpályás , jobb oldali", "Csatár", "Kapus"],
/* GE */	["მცველი ცენტრალური", "მცველი მარცხენა", "მცველი მარჯვენა", "საყრდენი ნახევარმცველი ცენტრალური", "საყრდენი ნახევარმცველი მარცხენა", "საყრდენი ნახევარმცველი მარჯვენა", "ნახევარმცველი ცენტრალური", "ნახევარმცველი მარცხენა", "ნახევარმცველი მარჯვენა", "შემტევი ნახევარმცველი ცენტრალური", "შემტევი ნახევარმცველი მარცხენა", "შემტევი ნახევარმცველი მარჯვენა", "თავდამსხმელი", "მეკარე"],
/* FI */	["Puolustaja Keski", "Puolustaja Vasen", "Puolustaja Oikea", "Puolustava Keskikenttä Keski", "Puolustava Keskikenttä Vasen", "Puolustava Keskikenttä Oikea", "Keskikenttä Keski", "Keskikenttä Vasen", "Keskikenttä Oikea", "Hyökkäävä Keskikenttä Keski", "Hyökkäävä Keskikenttä Vasen", "Hyökkäävä Keskikenttä Oikea", "Hyökkääjä", "Maalivahti"],
/* SE */	["Försvarare Central", "Försvarare Vänster", "Försvarare Höger", "Defensiv Mittfältare Central", "Defensiv Mittfältare Vänster", "Defensiv Mittfältare Höger", "Mittfältare Central", "Mittfältare Vänster", "Mittfältare Höger", "Offensiv Mittfältare Central", "Offensiv Mittfältare Vänster", "Offensiv Mittfältare Höger", "Anfallare", "Målvakt"],
/* NO */	["Forsvar Sentralt", "Forsvar Venstre", "Forsvar Høyre", "Defensiv Midtbane Sentralt", "Defensiv Midtbane Venstre", "Defensiv Midtbane Høyre", "Midtbane Sentralt", "Midtbane Venstre", "Midtbane Høyre", "Offensiv Midtbane Sentralt", "Offensiv Midtbane Venstre", "Offensiv Midtbane Høyre", "Angrep", "Keeper"],
/* SC */	["Defender Centre", "Defender Left", "Defender Richt", "Defensive Midfielder Centre", "Defensive Midfielder Left", "Defensive Midfielder Richt", "Midfielder Centre", "Midfielder Left", "Midfielder Richt", "Offensive Midfielder Centre", "Offensive Midfielder Left", "Offensive Midfielder Richt", "Forward", "Goalkeeper"],
/* VL */	["Verdediger Centraal", "Verdediger Links", "Verdediger Rechts", "Verdedigende Middenvelder Centraal", "Verdedigende Middenvelder Links", "Verdedigende Middenvelder Rechts", "Middenvelder Centraal", "Middenvelder Links", "Middenvelder Rechts", "Aanvallende Middenvelder Centraal", "Aanvallende Middenvelder Links", "Aanvallende Middenvelder Rechts", "Aanvaller", "Doelman"],
/* BR */	["Zagueiro Central", "Zagueiro Esquerdo", "Zagueiro Direito", "Volante Central", "Volante Esquerdo", "Volante Direito", "Meio-Campista Central", "Meio-Campista Esquerdo", "Meio-Campista Direito", "Meia Ofensivo Central", "Meia Ofensivo Esquerdo", "Meia Ofensivo Direito", "Atacante", "Goleiro"],
/* HE */    ["מגן מרכז", "מגן שמאל", "מגן ימין", "קשר אחורי מרכז", "קשר אחורי שמאל", "קשר אחורי ימין", "קשר מרכז", "קשר שמאל", "קשר ימין", "קשר קדמי מרכז", "קשר קדמי שמאל", "קשר קדמי ימין", "חלוץ", "שוער"],
/* BG */	["Защитник Централен", "Защитник Ляв", "Защитник Десен", "Дефанзивен Халф Централен", "Дефанзивен Халф Ляв", "Дефанзивен Халф Десен", "Халф Централен", "Халф Ляв", "Халф Десен", "Атакуващ Халф Централен", "Атакуващ Халф Ляв", "Атакуващ Халф Десен", "Нападател", "Вратар"],
/* GR */	["Αμυντικός Κεντρικός", "Αμυντικός Αριστερός", "Αμυντικός Δεξιός", "Αμυντικός Μέσος Κεντρικός", "Αμυντικός Μέσος Αριστερός", "Αμυντικός Μέσος Δεξιός", "Μέσος Κεντρικός", "Μέσος Αριστερός", "Μέσος Δεξιός", "Επιθετικός μέσος Κεντρικός", "Επιθετικός μέσος Αριστερός", "Επιθετικός μέσος Δεξιός", "Επιθετικός", "Τερματοφύλακας"],
/* TH */	["กองหลัง กลาง", "กองหลัง ซ้าย", "กองหลัง ขวา", "กองกลางตัวรับ กลาง", "กองกลางตัวรับ ซ้าย", "กองกลางตัวรับ ขวา", "กองกลาง กลาง", "กองกลาง ซ้าย", "กองกลาง ขวา", "กองกลางตัวรุก กลาง", "กองกลางตัวรุก ซ้าย", "กองกลางตัวรุก ขวา", "กองหน้า", "โกล์"]]

if (location.href.indexOf("/players/") != -1){

	// positionIndex is the array of skill priority for this player.
	// skills is an array of skills for each user
	
	document.calculateSkill = function(positionIndex, skills) {
		
		var totSkill = 0;
		for (var i=0; i< positions[positionIndex].length; i++) {
			if (skills[i]>0) {
				totSkill += skills[i]*document.calculateSkillWeight(positions[positionIndex], weights[positionIndex], i);
			}
		}
		
		totSkill = totSkill / 200; 
		totSkill = Math.round(totSkill*1000)/1000;
		
		return totSkill;
	};
	
	document.calculateSkillWeight = function(positionWeightLevels, weights, index) {
		var weight = 0;
		weight = weights[positionWeightLevels[index]-1] / document.numberAtWeight(positionWeightLevels, positionWeightLevels[index]) * 10;
		return weight;
	};
	
	document.numberAtWeight = function(positionWeightLevels, value) {
		var count = 0;
		for (var i=0; i< positionWeightLevels.length; i++) {
			if (positionWeightLevels[i] == value) {
				count++;
			}
		}
		return count;
	};

	document.findPositionIndex = function(position) {
		var index = -1;
		for (var i=0; i< positionFullNames.length; i++) {
			for (var j=0; j< positionFullNames[i].length; j++) {
				if (position.indexOf(positionFullNames[i][j]) == 0) return j;
			}
		}
		return index;
	};
	
	document.getSkills = function(table) {
		var skillArray = [];
		var tableData = table.getElementsByTagName("td");
		if (tableData.length > 1) {
			for (var i = 0; i < 2; i++) {
				for (var j = i; j < tableData.length; j += 2) {
					if (tableData[j].innerHTML.indexOf("star.png") > 0) {
						skillArray.push(20);
					}
					else if (tableData[j].innerHTML.indexOf("star_silver.png") > 0) {
						skillArray.push(19);
					}
					else if (tableData[j].textContent.length != 0) {
						skillArray.push(tableData[j].textContent);
					}
				}
			}
		}
		return skillArray;
	};

	function funFix (i) {
		i = (Math.round(i*100)/100).toFixed(2);
		return i;
	}
	
	function funFix2 (i) {
		i = (Math.round(i*10)/10).toFixed(1);
		return i;
	}
	
	function funFix3 (i) {
		i = (Math.round(i*1000)/1000).toFixed(3);
		return i;
	}
	
	document.createTR = function(table, SKarray) {
		var tr = document.createElement("tr");
		var th = document.createElement("th");
		th.innerHTML = "SK1";
		tr.appendChild(th);
		var td = document.createElement("td");
		td.setAttribute("class", "align_center");
		td.innerHTML = SKarray[0];
		tr.appendChild(td);
		var th = document.createElement("th");
		th.innerHTML = "SK2";
		tr.appendChild(th);
		var td = document.createElement("td");
		td.setAttribute("class", "align_center");
		if (SKarray[1] == 0){
			td.innerHTML = "N/A";
		} else {
			td.innerHTML = SKarray[1];
		}
		tr.appendChild(td);
		table.appendChild(tr);
	};
	
	function computeSK(table, skills){
	var SKs = [0, 0];
	var REREC = [[],[],[]];
	var REREC2 = [];
	var FP = [];
	var positionCell = document.getElementsByClassName("favposition long")[0].childNodes;
	var positionArray = [];
	if (positionCell.length == 1){
			positionArray[0] = positionCell[0].textContent;
	} else if (positionCell.length == 2){
			positionArray[0] = positionCell[0].textContent + positionCell[1].textContent;
	} else if (positionCell[1].className == "split"){
			positionArray[0] = positionCell[0].textContent + positionCell[3].textContent;
			positionArray[1] = positionCell[2].textContent + positionCell[3].textContent;
	} else if (positionCell[3].className == "f"){
			positionArray[0] = positionCell[0].textContent + positionCell[1].textContent;
			positionArray[1] = positionCell[3].textContent;
	} else {
			positionArray[0] = positionCell[0].textContent + positionCell[1].textContent;
			positionArray[1] = positionCell[0].textContent + positionCell[3].textContent;
	}
	var gettr = document.getElementsByTagName("tr");
	var SI = new String(gettr[6].getElementsByTagName("td")[0].innerHTML).replace(/,/g, "");
	var rou = gettr[8].getElementsByTagName("td")[0].innerHTML;
	rou = Math.pow(5/3, Math.LOG2E * Math.log(rou * 10)) * rou_factor;
	for (var i = 0; i < positionArray.length; i++){
			var positionIndex = document.findPositionIndex(positionArray[i]);
			FP[i] = positionIndex;
			FP[i+1] = FP[i];
			if (positionIndex > -1) {
				SKs[i] = document.calculateSkill(positionIndex, skills);
				REREC2[i] = document.calculateREREC2(positionIndex, skills, SI);
			}
			if (i == 0) REREC = document.calculateREREC(positionIndex, skills, SI, rou);
	}
	
	if (positionIndex == 13){
		var phySum = skills[0]*1 + skills[1]*1 + skills[2]*1 + skills[7]*1;
		var tacSum = skills[4]*1 + skills[6]*1 + skills[8]*1;
		var tecSum = skills[3]*1 + skills[5]*1 + skills[9]*1 + skills[10]*1;
		var weight = 48717927500;
	}
	else {
		var phySum = skills[0]*1 + skills[1]*1 + skills[2]*1 + skills[10]*1;
		var tacSum = skills[3]*1 + skills[4]*1 + skills[5]*1 + skills[6]*1;
		var tecSum = skills[7]*1 + skills[8]*1 + skills[9]*1 + skills[11]*1 + skills[12]*1 + skills[13]*1;
		var weight = 263533760000;
	}
	var allSum = phySum + tacSum + tecSum;
	var remainder = funFix2(Math.pow(2,Math.log(weight*SI)/Math.log(Math.pow(2,7))) - allSum);
	
	var recth = document.createElement("div");
	var rectd = document.createElement("div");
	var recbth = document.createElement("div");
	var recbtd = document.createElement("div");
	var ratth = document.createElement("div");
	var rattd = document.createElement("div");
	switch (version) {
	case "en":
	rectd.setAttribute("style", "color: white;");
	recbtd.setAttribute("style", "color: white;");
	rattd.setAttribute("style", "color: white;");
	break;
	case "or":
	rectd.setAttribute("style", "color: gold;");
	recbtd.setAttribute("style", "color: gold;");
	rattd.setAttribute("style", "color: gold;");
	}
	
	
	var FP2 = [FP[0], FP[1]];
	for (i = 0; i < FP.length; i++) {
		for (j = 0; 2+j <= FP[i]; j += 2) FP[i]--;
	}
	if (FP[0] != FP[1]) {
		rectd.innerHTML = REREC[0][FP[0]] + "/" + REREC[0][FP[1]];
		recbtd.innerHTML = funFix3(REREC2[0]) + "/" + funFix3(REREC2[1]);
		rattd.innerHTML = REREC[2][FP[0]] + "/" + REREC[2][FP[1]];
		var ratingR3 = rattd.innerHTML;
		var rouEffect = funFix(REREC[2][FP[0]]*1 - REREC[1][FP[0]]*1) + "/" + funFix(REREC[2][FP[1]]*1 - REREC[1][FP[1]]*1);
		var R3Pure = REREC[1][FP[0]] + "/" + REREC[1][FP[1]];
		var ratingR2 = funFix(REREC[1][FP[0]] * (1 + rou / rou_factor * 0.4 * 0.00405)) + "/" + funFix(REREC[1][FP[1]] * (1 + rou / rou_factor * 0.4 * 0.00405));
	}
	else {
		rectd.innerHTML = REREC[0][FP[0]];
		recbtd.innerHTML = funFix3(REREC2[0]);
		rattd.innerHTML = REREC[2][FP[0]];
		var ratingR3 = rattd.innerHTML;
		var rouEffect = funFix(REREC[2][FP[0]]*1 - REREC[1][FP[0]]*1);
		var R3Pure = REREC[1][FP[0]];
		var ratingR2 = funFix(R3Pure * (1 + rou / rou_factor * 0.4 * 0.00405));
	}
	switch (version) {
	case "en":
	recbth.innerHTML = "<style=\"color: white;\">Recommendation";
	ratth.innerHTML = "<style=\"color: white;\">Rating Position";
	break;
	case "or":
	recbth.innerHTML = "<b style=\"color: gold;\">REREC</b>";
	ratth.innerHTML = "<b style=\"color: gold;\">RatingR3</b>";
	}
	gettr[5].getElementsByTagName("th")[0].appendChild(recbth);
	gettr[5].getElementsByTagName("td")[0].appendChild(recbtd);
	gettr[8].getElementsByTagName("th")[0].appendChild(ratth);
	gettr[8].getElementsByTagName("td")[0].appendChild(rattd);
	
	var playerID = location.pathname.match(/\d+/g);
	seasonTI(playerID[0], gettr, SI);
	
	var div_area = document.createElement('div');
	if (positionIndex != 13) {
		var peak = [4,4,6];
		var goldstar = 0;
		for (j = 0; j < 2; j++) {
			for (i = 0; i < 14; i++) {
				if (j == 0 && skills[i] == 20) goldstar++;
				if (j == 1 && skills[i] != 20) skills[i] = skills[i] * 1 + remainder / (14 - goldstar);
			}
		}
		var CK = funFix(skills[8] + skills[13] + skills[9]/2 + rou/5*2.5);
		var FK = funFix(skills[12] + skills[13] + skills[9]/2 + rou/5*2.5);
		var PK = funFix(skills[11] + skills[13] + skills[9]/2 + rou/5*2.5);
		div_area.innerHTML="<div style=\"position: absolute; z-index: 1; width: 186px; height: 279px; margin-top: 10px; background: url(http://oi63.tinypic.com/34pxvsl.jpg);  color: white;  outset; display:inline;\">&nbsp;<p style=\"text-decoration: underline;\"><b><\p><table style=\"margin-top: -1em; margin-bottom: 1em; position:relative; top:0px;left:5px\">&nbsp;<tr><td>PhySum: </td><td>" + phySum + " (" + Math.round(phySum/peak[0]*5) + "%)</td></tr><tr><td>TacSum: </td><td>" + tacSum + " (" + Math.round(tacSum/peak[1]*5) + "%)</td></tr><tr><td>TecSum: </td><td>" + tecSum + " (" + Math.round(tecSum/peak[2]*5) + "%)</td></tr><tr><td>AllSum: </td><td>" + allSum + " + " + remainder + " </td></tr><tr><td>&nbsp;</td><tr><td>Corner: </td><td>" + CK + "</td></tr><tr><td>Freekick: </td><td>" + FK + "</td></tr><tr><td>Penalty: </td><td>" + PK + "</td></tr></tr><tr><td>&nbsp;</td></tr><tr><td>Rating-Pure: </td><td>" + R3Pure + "</td></tr><tr><td>RouEffect: </td><td>" + rouEffect + " </td></tr><tr><td>RatingR3: </td><td>" + ratingR3 + " </td></tr></table></b></div>";
	}
	else {
		var peak = [4,3,4];
		div_area.innerHTML="<div style=\"position: absolute; z-index: 1; width: 186px; height: 194px; margin-top: 20px; background: url(http://oi65.tinypic.com/33v10t1.jpg);  color: white;  outset; display:inline;\">&nbsp;<p style=\"text-decoration: underline;\"><b><\p><table style=\"margin-top: -1em; margin-bottom: 1em; position:relative; top:0px;left:5px\">&nbsp;<tr><td>PhySum: </td><td>" + phySum + " (" + Math.round(phySum/peak[0]*5) + "%)</td></tr><tr><td>TacSum: </td><td>" + tacSum + " (" + Math.round(tacSum/peak[1]*5) + "%)</td></tr><tr><td>TecSum: </td><td>" + tecSum + " (" + Math.round(tecSum/peak[2]*5) + "%)</td></tr><tr><td>AllSum: </td><td>" + allSum + " + " + remainder + " </td></tr><tr><td>&nbsp;</td></tr><tr><td>Rating-Pure: </td><td>" + R3Pure + "</td></tr><tr><td>RouEffect: </td><td>" + rouEffect + " </td></tr><tr><td>RatingR3: </td><td>" + ratingR3 + " </td></tr></table></b></div>";
	}
	document.getElementsByClassName("box")[0].appendChild(div_area);
	
	document.createTR(table, SKs);
	
	var hidden = document.getElementById("hidden_skill_table").getElementsByTagName("td");
	if (hidden[0].innerHTML != "") {
		var x;
		for (var i = 0; i < 4; i++) {
			x = hidden[i].getAttribute("tooltip").match(/\d+/);
			if (x < 10) x = " " + x;
			hidden[i].setAttribute("style", "white-space: nowrap;"); 
			hidden[i].innerHTML += " (" + x + "/20)";
		}
		if (positionIndex != 13) {
			var div = document.createElement("div");
			div.setAttribute("style", "position: absolute; z-index: 1; width: 186px; height: 154px; margin-top: 300px; color: white; background: url(http://oi68.tinypic.com/kda1vo.jpg);   outset; display:inline;");
			div.innerHTML = "<p style=\"text-decoration: underline;\"><b></b></p>";
			var table2 = document.createElement("table");
			table2.setAttribute("border", "1");
			table2.setAttribute("bordercolor", "#6C9922");
			table2.setAttribute("style", "width: 170px; margin-bottom: 7px; position:relative; top:30px;left:7px");
			var tbody = document.createElement("tbody");
			tbody.setAttribute("align", "center");
			var adapt = hidden[3].getAttribute("tooltip").match(/\d+/);
			var R2all = [REREC[2][1], REREC[2][0], REREC[2][1], REREC[2][3], REREC[2][2], REREC[2][3], REREC[2][5], REREC[2][4], REREC[2][5], REREC[2][7], REREC[2][6], REREC[2][7], REREC[2][8]];
			for (var i = 0; i < 5; i++) {
				var tr = document.createElement("tr");
				for (var j = 0; j < 3; j++) {
					var num = (4-i)*3+j;
					var td = document.createElement("td");
					if (num < 12 || num == 13) {
						if (num == 13) num--;
						if (positionsAll[FP2[0]][num] > positionsAll[FP2[1]][num]) positionsAll[FP2[0]][num] = positionsAll[FP2[1]][num];
						td.innerHTML = funFix(R2all[num] * (1 - (20 - adapt) * positionsAll[FP2[0]][num] / 200));
						}
					else td.innerHTML = "";
					tr.appendChild(td);
				}
				tbody.appendChild(tr);
			}
			table2.appendChild(tbody);
			div.appendChild(table2);
			document.getElementsByClassName("box")[0].appendChild(div);
		}
	}
		
	if (positionIndex != 13) {
		var table2 = document.createElement("table");
		var tbody = document.createElement("tbody");
		table2.setAttribute("border", "1");  
		table2.setAttribute("bordercolor", "#6C9922");  
		table2.innerHTML = "<thead><tr><th></th><th>DC</th><th>DLR</th><th>DMC</th><th>DMLR</th><th>MC</th><th>MLR</th><th>OMC</th><th>OMLR</th><th>F</th></tr></thead>";
		tbody.setAttribute("align", "center");  
		var tr = document.createElement("tr");
		
		for (var i = 0; i < 3; i+=2) {
			var th = document.createElement("th");
			if (i == 0) th.innerHTML = "REC";
			else th.innerHTML = "R3";
			tr.appendChild(th);
			
			for (var j = 0; j < 9; j++) {
				var td = document.createElement("td");
				if (REREC[i][j]*1 >= 100) REREC[i][j] = funFix2(REREC[i][j]*1);
				td.innerHTML = REREC[i][j];
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
			table2.appendChild(tbody);
			
			var tr = document.createElement("tr");
			var th = document.createElement("th");
			th.setAttribute("colspan", "4");  
			th.setAttribute("align", "center");  
			th.appendChild(table2);
		}
		tr.appendChild(th);
		table.appendChild(tr);
	}
	
	}
	
	document.calculateREREC = function (positionIndex, skills, SI, rou){
		var rec = [];			// REREC
		var ratingR = [];		// RatingR3
		var ratingR3 = [];		// RatingR3 + routine
		var skillSum = 0;
		if (positionIndex == 13) {
			var skillWeightSum = Math.pow(SI, 0.143) / 0.02979;			// GK Skillsum
			var weight = 48717927500;
		}
		else {
			var skillWeightSum = Math.pow(SI, 1/6.99194)/0.02336483;	// Other Skillsum
			var weight = 263533760000;
		}
		for (var i = 0; i < skills.length; i++) {
			skillSum += parseInt(skills[i]);
		}
		for (i = 0; 2+i <= positionIndex; i += 2) {		// TrExMaとRECのweight表のずれ修正
			positionIndex--;
		}
		skillWeightSum -= skillSum;			// REREC remainder
		var remainder = Math.round((Math.pow(2,Math.log(weight*SI)/Math.log(Math.pow(2,7))) - skillSum)*10)/10;		// RatingR3 remainder
		for (var i = 0; i < 10; i++) {
			rec[i] = 0;
			ratingR[i] = 0;
		}
		for (var j = 0; j < 9; j++) {		// All position
			var remainderWeight = 0;		// REREC remainder weight sum
			var remainderWeight2 = 0;		// RatingR3 remainder weight sum
			var not20 = 0;					// 20以外のスキル数
			if (positionIndex == 9) j = 9;	// GK
			
			for (var i = 0; i < weightR[positionIndex].length; i++) {
				rec[j] += skills[i] * weightR[j][i];
				ratingR[j] += skills[i] * weightR3[j][i];
				if (skills[i] != 20) {
					remainderWeight += weightR[j][i];
					remainderWeight2 += weightR3[j][i];
					not20 += 1;
				}
			}
			rec[j] += skillWeightSum * remainderWeight / not20;		// REREC Score
			if (positionIndex == 9) rec[j] *= 1.27;					// GK
			rec[j] = funFix((rec[j] - recLast[0][j]) / recLast[1][j]);
			ratingR[j] += remainder * remainderWeight2 / not20;
			ratingR3[j] = funFix(ratingR[j] + rou);
			ratingR[j] = funFix(ratingR[j]);
			if (positionIndex == 9) j = 9;		// Loop end
		}
		
		var recAndRating = [rec, ratingR, ratingR3];
		return recAndRating;
	};
	
	document.calculateREREC2 = function (positionIndex, skills, SI){
		if (positionIndex == 13) var weight = 48717927500;
		else var weight = 263533760000;
		var skillSum = 0;
		for (var j = 0; j < skills.length; j++) {
			skillSum += parseInt(skills[j]);
		}
		var remainder = Math.round((Math.pow(2,Math.log(weight*SI)/Math.log(Math.pow(2,7))) - skillSum)*10)/10;		// 正確な余り
		var recb = 0;
		var weightSumb = 0;
		var not20 = 0;
		
		for (i = 0; 2+i <= positionIndex; i += 2) {		// TrExMaとRECのweight表のずれ修正
			positionIndex--;
		}
		for (var i = 0; i < weightR[positionIndex].length; i++) {
			recb += skills[i] * weightRb[positionIndex][i];
			if (skills[i] != 20) {
				weightSumb += weightRb[positionIndex][i];
				not20++;
			}
		}
		if (not20 == 0) recb = 6;		// All MAX
		else recb = (recb + remainder * weightSumb / not20 - 2) / 3;
		
		return recb;
	};
	
	function seasonTI (playerID, gettr, SI) {
		var sith = document.createElement("div");
		var sitd = document.createElement("div");
		var sitd2 = document.createElement("div");
		var wage = new String(gettr[4].getElementsByTagName("span")[0].innerHTML).replace(/,/g, "");
		var today = new Date();
		var s45 = new Date("02 22 2016 10:30:00 GMT");				// season start
//		var s41t = new Date("03 24 2015 00:30:00 GMT");				// first training
		var s45t = new Date("02 22 2016 23:30:00 GMT");				// first training
//		var s43t = new Date("09 07 2015 22:30:00 GMT");				// first training summer time from 3/29 to 10/25
		var day = (today.getTime()-s45t.getTime())/1000/3600/24;
		while (day > 84-16/24) day -= 84;
		var session = Math.floor(day/7)+1;							// training sessions
		var ageMax = 20.1 + session / 12;							// max new player age
		
		var age = gettr[2].getElementsByTagName("td")[0].innerHTML;
		var yearidx = age.search(/\d\d/);
		var year = age.substr(yearidx,2);
		age = age.slice(yearidx+2);
		var month = age.replace(/\D+/g,"");
		age = year*1 + month/12;
		var check = today.getTime()-s45.getTime();
		var season = 84*24*3600*1000;
		var count = 0;
		
		while (check > season) {
			check -= season;
			count++;
		}
		
		if (document.getElementsByClassName("gk")[0] == null) var weight = 263533760000;
		else var weight = 48717927500;
		
		if (wage == 27000 || wage == 30000 || (playerID > 112870168 && count == 0)) {	// S40 player ID  
			sitd.innerHTML = "---";
		}
		else {
			var TI1 = Math.pow(2,Math.log(weight*SI)/Math.log(Math.pow(2,7))) - Math.pow(2,Math.log(weight*wage/(wage_rate))/Math.log(Math.pow(2,7)));
			TI1 = Math.round(TI1*10);
			if (session > 0) sitd.innerHTML = TI1 + " (" + funFix2(TI1/session) + " x " + session + ")";
			else sitd.innerHTML = TI1;
		}
		sith.innerHTML = "Season TI";                  
		gettr[6].getElementsByTagName("th")[0].appendChild(sith);
		gettr[6].getElementsByTagName("td")[0].appendChild(sitd);
		
		if (((wage > 27000 && wage != 30000 && playerID > 112468679) || (wage > 30000 && playerID > 112468679)) && age < ageMax) {	//  
			wage_rate = 23.75*0.9;
			if (playerID > 112468679) wage_rate = 23.75;
			var TI2 = Math.pow(2,Math.log(weight*SI)/Math.log(Math.pow(2,7))) - Math.pow(2,Math.log(weight*wage/(wage_rate))/Math.log(Math.pow(2,7)));
			TI2 = Math.round(TI2*10);
			if (month == 1) session = 0;
			if (month > 1 && session + 1 > month) session = month - 1;
			if (session > 0) sitd2.innerHTML = TI2 + " (" + funFix2(TI2/session) + " x " + session + ")";
			else sitd2.innerHTML = TI2;
			sith = document.createElement("div");
			sith.setAttribute("style", "white-space: nowrap;"); 
			sith.innerHTML = "<b>New player TI</b>";
			gettr[6].getElementsByTagName("th")[0].appendChild(sith);
			gettr[6].getElementsByTagName("td")[0].appendChild(sitd2);
		}
	}
	
    

    
	(function() {
		var playerTable = document.getElementsByClassName("skill_table zebra")[0];
		var skillArray = document.getSkills(playerTable);
		computeSK(playerTable, skillArray);
	})();
}

