// ==UserScript==
// @version     0.70
// @name        erreurs sfr tv
// @namespace   https://tv.sfr.fr/
// @description	erreurs (gestion et logs), pavé numérique pour zapper, volume sonore (live et départ), plein écran, reconnexion automatique, interface de configuration
// @author      ced
// @include     https://tv.sfr.fr/*
// @include     https://tv.sfr.fr/direct-tv/*
// @include     https://tv.sfr.fr/content/*
// @include     https://tv.sfr.fr/guide
// @include     https://www.sfr.fr/cas/login* 
// @exclude     https://tv.sfr.fr/settings  
// @grant       GM_addStyle
// @license     MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/451721/erreurs%20sfr%20tv.user.js
// @updateURL https://update.greasyfork.org/scripts/451721/erreurs%20sfr%20tv.meta.js
// ==/UserScript==


// Activer le plein écran au changement de la chaine
// Uniquement sur Firefox
// Modifier les parametres en tapant dans la barre d'adresse about:config
// Modifier la valeur full-screen-api.allow-trusted-requests-only en false
// Regarder une chaine
// Appuyer sur "c"
// Mettre la valeur "plein écran sur 1
// Appuyer de nouveau sur "c"
// Changer de chaine
// Le programme se lance en plein écran


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
console.log("----- Hello !");                                                                                                       // La console te salue

var FirstTimeScriptIsLoaded = true;                                                                                                 // Variable servant à déterminer si le script est lancé pour la prmière fois

var waitForMouseMoveFunctionEnd = 0;                                                                                                // Variable
var fullScreenAutoAtStart = 1;                                                                                                      // Variable plein écran auto = 1
var delayBeforeHide = 10000;                                                                                                        // Variable délai cacher menu et vignettes

var zindex1 = 100001;
var zindex2 = 100002;
var zindex3 = 100003;
var zindex4 = 100004;
var zindex5 = 100005;

var ttsUserPref = 0;                                                                                                                // Autoriser la synthése vocale 
var debugMode = 0;                                                                                                                  // Définir sur 1 pour pouvoir garder la console ouverte ! 
var nbLoggedErrors = 50;                                                                                                            // Définir le nombre d'erreurs conservées
var logTabAdded = false;                                                                                                            // Tableau affiché ou pas
var configDivAdded = false;                                                                                                         // Config affiché ou pas

var prompted = false;                                                                                                               // Etat des invites pour entrer les informations de connexion 

var sessionExpired = false;                                                                                                         // Session expirée ?

//var KnownErrors = false;                                                                                                          // Pour plus tard
var mainLoopStartTime = 0;                                                                                                          // Variable pour la date de départ du script
                                                                                                                                    // Attention à la mise en pause !!!!!!!!!!! 

var mainLoopDelay = 3000;                                                                                                           // Délai entre deux contrôles d'erreur
var nbloopBeforeReload = 3;                                                                                                         // Nombre de fois avant de recharger en cas d'interruption de la réception des données 
var nbloopBeforeBegin = 5;                                                                                                          // Nombre de fois avant d'autoriser le rechargement
                                                                                                                                    // Les deux précédents nombres multipliés par le délai (plus haut) définisse une durée 
var video = " ";                                                                                                                    // Variable
var lastTimeVideoEventProgressEvent = 0;                                                                                            // Variable (date à laquelle le lecteur reçoit des données)
var videoPlaying = "";                                                                                                              // Variable relative aux événements (play=2, pause=1, ended=0)

var inputKeys = "";                                                                                                                 // Frappe de touches (pavé numérique)
var inputKeysDelay = 2000;                                                                                                          // Délai pour taper le numéro de la chaine en ms
var oldUrl = "";                                                                                                                    // Url

var channelTabAdded = false;                                                                                                        // Tableau affiché ou pas
var nbColumnChannelTab = 10;                                                                                                        // Le nombre de colonnes dans le tableau
var imgChannelWidth = 75;                                                                                                           // Largeur des images

var channelTabAddedConfig = false;                                                                                                  // Tableau affiché ou pas
var nbColumnChannelTabConfig = 15;                                                                                                  // Le nombre de colonnes dans le tableau
var imgChannelWidthConfig = 50;                                                                                                     // Largeur des images
 
var volumeStart = 1;                                                                                                                // Le volume de départ (0->1)
var volumeStep = 10;                                                                                                                // Le volume est augmenté ou diminué de cette valeur  
var volumeDelay = 5000;                                                                                                             // Délai avant que l'indicateur volume s"efface


var channelsInfos3 = [];  


var dataStep = 5;   
var channelsInfos2 = []; 

                                                                                                                                    // !!!! Nom des chaines contenant '
                                                                                                                                    // Variable informant du nombre de champs par chaine
                                                                                                                                    // Variable tableau des chaines      
                                                                                                                                    // Ajout de données relatives aux chaines
                                                                                                                                    // Pour personaliser , modifier le dernier chiffre ( 1 pour la 
                                                                                                                                    //                     1 pour la prendre en compte                                          
                                                                                                                                    //                     0 pour ignorer
                                                                                                                                    // L'interface permet de le faire visuellement
                                                                                                                                    // 
                                                                                                                                    // Nom de la chaine, Canal, Image, url , affiché ou pas



channelsInfos2.push('TF1','1','logos/tv_services/TF1_color.png','tf1','1');
channelsInfos2.push('France 2','2','logos/tv_services/France_2_color.png','france-2','1');
channelsInfos2.push('France 3','3','logos/tv_services/France_3_color.png','france-3','1');
channelsInfos2.push('France 4','4','logos/tv_services/France_4_color.png','france-4','1');
channelsInfos2.push('France 5','5','logos/tv_services/France_5_color.png','france-5','1');
channelsInfos2.push('M6','6','img/apps/chaines/logos/M6100x100fondgris.png','m6','1');
channelsInfos2.push('Arte','7','logos/tv_services/Arte_color.png','arte','1');
channelsInfos2.push('LCP','8','logos/tv_services/LCP_color.png','lcp','1');
channelsInfos2.push('W9','9','logos/tv_services/W9_color.png','w9','1');
channelsInfos2.push('TMC','10','logos/tv_services/TMC_color.png','tmc','1');
channelsInfos2.push('TFX','11','logos/tv_services/TFX_color.png','tfx','1');
channelsInfos2.push('Gulli','12','img/apps/chaines/logos/Gulli100x100Couleur.png','gulli','1');
channelsInfos2.push('BFM TV','13','logos/tv_services/BFM_TV_color.png','bfm-tv','1');
channelsInfos2.push('CNews','14','logos/tv_services/CNews_color.png','cnews','1');
channelsInfos2.push('LCI','15','logos/tv_services/LCI_color.png','lci','1');
channelsInfos2.push('franceinfo:','16','img/apps/chaines/logos/franceinfoblack100x100.png','franceinfo','1');
channelsInfos2.push('CStar','17','logos/tv_services/CStar_color.png','cstar','1');
channelsInfos2.push('T18','18','img/apps/chaines/logos/T18100x100.png','t18','1');
channelsInfos2.push('NOVO19','19','img/apps/chaines/logos/Novo19100x100.png','novo19','1');
channelsInfos2.push('TF1 Séries-Films','20','logos/tv_services/TF1_Series_Films_color.png','tf1-series-films','1');
channelsInfos2.push('La chaine l’Équipe','21','logos/tv_services/L_Equipe_color.png','la-chaine-lequipe','1');
channelsInfos2.push('6ter','22','logos/tv_services/6ter_color.png','6ter','1');
channelsInfos2.push('RMC STORY','23','logos/tv_services/RMC_STORY_color.png','rmc-story','1');
channelsInfos2.push('RMC Découverte','24','logos/tv_services/RMC_Decouverte_color.png','rmc-decouverte','1');
channelsInfos2.push('Chérie 25','25','logos/tv_services/Cherie_25_color.png','cherie-25','1');
channelsInfos2.push('i24 news','28','logos/tv_services/i24_news_color.png','i24-news','1');
channelsInfos2.push('BFM Business','31','logos/tv_services/BFM_Business_color.png','bfm-business','1');
channelsInfos2.push('TECH & CO','32','img/apps/chaines/logos/SFR100x100COLORTECHCO.png','tech-co','1');
channelsInfos2.push('RMC Sport 1','33','logos/tv_services/RMC_Sport_1_color.png','rmc-sport-1','0');
channelsInfos2.push('RMC Talk Info','39','img/apps/chaines/logos/RMCTalkInfo100x100couleur.png','rmc-talk-info','1');
channelsInfos2.push('CANAL+','40','logos/tv_services/Canal_color.png','canal','0');
channelsInfos2.push('Discovery Channel','41','logos/tv_services/Discovery_Channel_color.png','discovery-channel','0');
channelsInfos2.push('TLC','42','img/apps/chaines/logos/TLC100x100couleur.png','tlc','0');
channelsInfos2.push('Discovery Investigation','43','img/apps/chaines/logos/ID100x100.png','discovery-investigation','0');
channelsInfos2.push('SFR ACTU','44','img/apps/chaines/logos/SFRActu100100Couleur003.png','sfr-actu','1');
channelsInfos2.push('BFM Grands Reportages','45','img/apps/chaines/logos/BFMGrandsReportages100x100couleur.png','bfm-grands-reportages','1');
channelsInfos2.push('France 24','47','logos/tv_services/France_24_color.png','france-24','1');
channelsInfos2.push('Euronews','48','img/apps/chaines/logos/EURONEWS100x100.png','euronews','0');
channelsInfos2.push('RMC Alerte Secours','49','img/apps/chaines/logos/RMCALERTESECOURS100x100couleur.png','rmc-alerte-secours','1');
channelsInfos2.push('13ème rue','50','logos/tv_services/13eme_rue_color.png','13eme-rue','0');
channelsInfos2.push('Syfy','51','logos/tv_services/Syfy_color.png','syfy','0');
channelsInfos2.push('E! Entertainment','52','logos/tv_services/E_color.png','e-entertainment','0');
channelsInfos2.push('WARNER TV','55','img/apps/chaines/logos/WarnerFond100x100.png','warner-tv','1');
channelsInfos2.push('MTV','56','img/apps/chaines/logos/MTVLOGOCOULEUR100x100.png','mtv','0');
channelsInfos2.push('MCM','57','logos/tv_services/MCM_color.png','mcm','0');
channelsInfos2.push('AB1','58','img/apps/chaines/logos/AB1100x100Noir.png','ab1','1');
channelsInfos2.push('SERIE CLUB','59','logos/tv_services/SERIE_CLUB_color.png','serie-club','0');
channelsInfos2.push('Game One','60','img/apps/chaines/logos/GAMEONE100x100.png','game-one','1');
channelsInfos2.push('Game One +1','61','img/apps/chaines/logos/GAMEONE1100x100.png','game-one-1','1');
channelsInfos2.push('Warner TV Next','62','img/apps/chaines/logos/WB-Next_100x100.png','warner-tv-next','0');
channelsInfos2.push('J-One','63','logos/tv_services/J_One_color.png','j-one','1');
channelsInfos2.push('BET','64','img/apps/chaines/logos/BETLOGONOIR100x100.png','bet','1');
channelsInfos2.push('Comedy Central','65','logos/tv_services/Comedy_Central_color.png','comedy-central','1');
channelsInfos2.push('Paris Première','70','logos/tv_services/Paris_Premiere_color.png','paris-premiere','1');
channelsInfos2.push('Téva','71','logos/tv_services/Teva_color.png','teva','1');
channelsInfos2.push('RTL9','72','img/apps/chaines/logos/RTL9100x100.png','rtl9','1');
channelsInfos2.push('TV Breizh','73','img/apps/chaines/logos/TVBreizh100x100.png','tv-breizh','0');
channelsInfos2.push('TV5 Monde','74','logos/tv_services/TV5_Monde_color.png','tv5-monde','1');
channelsInfos2.push('LCP-AN 24/24','103','logos/tv_services/LCP_AN_24_24_color.png','lcp-an-2424','0');
channelsInfos2.push('Public Sénat','104','logos/tv_services/publicsenat-100x100.png','public-senat','0');
channelsInfos2.push('RMC Sport Access','106','img/apps/chaines/logos/RMCSportAccess100x100couleur.png','rmc-sport-access','0');
channelsInfos2.push('AFTER FOOT TV','107','img/apps/chaines/logos/AFTERFOOT100x100.png','after-foot-tv','1');
channelsInfos2.push('RMC Mecanic','108','img/apps/chaines/logos/RMCMECANIC100x100couleur.png','rmc-mecanic','1');
channelsInfos2.push('RMC Sport Live 2','112','img/apps/chaines/logos/RMCSportLive2100x100COULEUR.png','rmc-sport-live-2','0');
channelsInfos2.push('beIN SPORTS 1','115','logos/tv_services/beIN_SPORTS_1_color.png','bein-sports-1','0');
channelsInfos2.push('beIN SPORTS 2','116','logos/tv_services/beIN_SPORTS_2_color.png','bein-sports-2','0');
channelsInfos2.push('beIN SPORTS 3','117','logos/tv_services/beIN_SPORTS_3_color.png','bein-sports-3','0');
channelsInfos2.push('DAZN 1','118','img/apps/chaines/logos/DAZN100x100color.png','dazn-1','0');
channelsInfos2.push('Equidia','119','logos/tv_services/Equidia_color.png','equidia','1');
channelsInfos2.push('MGG TV','121','img/apps/chaines/logos/MGGTVvertical100x100.png','mgg-tv','0');
channelsInfos2.push('Automoto la chaine','125','logos/tv_services/Automoto_color.png','automoto-la-chaine','0');
channelsInfos2.push('Journal du Golf TV','128','img/apps/chaines/logos/JournalduGolf100x100.png','journal-du-golf-tv','1');
channelsInfos2.push('Sport en France','129','logos/tv_services/Sport_en_France_color.png','sport-en-france','1');
channelsInfos2.push('OLPLAY','130','img/apps/chaines/logos/olplay100x100color.png','olplay','0');
channelsInfos2.push('OCS','146','img/apps/chaines/logos/OCS100x100.png','ocs','0');
channelsInfos2.push('CINE+ frisson','147','img/apps/chaines/logos/CineFrisson100x100.png','cine-frisson','0');
channelsInfos2.push('CINE+ émotion','148','img/apps/chaines/logos/CineEmotion100x100.png','cine-emotion','0');
channelsInfos2.push('CINE+ family','149','img/apps/chaines/logos/CineFamily100x100.png','cine-family','0');
channelsInfos2.push('CINE+ festival','150','img/apps/chaines/logos/CineFestival100x100.png','cine-festival','0');
channelsInfos2.push('CINE+ classic','151','img/apps/chaines/logos/CineClassic100x100.png','cine-classic','0');
channelsInfos2.push('Paramount Network','160','img/apps/chaines/logos/ParamountNetwork100x100COULEUR.png','paramount-network','1');
channelsInfos2.push('Paramount Network Décalé','161','img/apps/chaines/logos/ParamountNetworkDecale100x100COULEUR.png','paramount-network-decale','0');
channelsInfos2.push('TCM Cinéma','162','img/apps/chaines/logos/TCM100x100.png','tcm-cinema','0');
channelsInfos2.push('Action','163','logos/tv_services/Action_color.png','action','0');
channelsInfos2.push('INSOMNIA','164','img/apps/chaines/logos/INSOMNIA100x100.png','insomnia','0');
channelsInfos2.push('RMC WOW','167','img/apps/chaines/logos/RMCWOW100x100couleur.png','rmc-wow','1');
channelsInfos2.push('RMC Mystère','168','img/apps/chaines/logos/RMCMystere100x100couleur.png','rmc-mystere','1');
channelsInfos2.push('J irai dormir chez vous','169','img/apps/chaines/logos/RMCJDCV100x100couleur.png','jirai-dormir-chez-vous','1');
channelsInfos2.push('Ushuaia TV','173','logos/tv_services/Ushuaia_TV_color.png','ushuaia-tv','0');
channelsInfos2.push('TREK','174','logos/tv_services/TREK_color.png','trek','0');
channelsInfos2.push('Crime District','175','img/apps/chaines/logos/NEUFCRIMEDISCTRICT100x100.png','crime-district','0');
channelsInfos2.push('Marmiton TV','176','img/apps/chaines/logos/MarmitonTV100x100.png','marmiton-tv','1');
channelsInfos2.push('Histoire','177','logos/tv_services/Histoire_color.png','histoire','0');
channelsInfos2.push('Toute l Histoire','178','logos/tv_services/Toute_l_Histoire_color.png','toute-lhistoire','0');
channelsInfos2.push('KTO','179','img/apps/chaines/logos/KTO100x100.png','kto','0');
channelsInfos2.push('Animaux','180','logos/tv_services/Animaux_color.png','animaux','0');
channelsInfos2.push('Chasse et Pêche','181','logos/tv_services/Chasse_et_Peche_color.png','chasse-et-peche','0');
channelsInfos2.push('Science et Vie TV','182','logos/tv_services/Science_et_Vie_TV_color.png','science-et-vie-tv','0');
channelsInfos2.push('Luxe TV','183','logos/tv_services/Luxe_TV_color.png','luxe-tv','0');
channelsInfos2.push('Fashion TV','184','logos/tv_services/Fashion_TV_color.png','fashion-tv','0');
channelsInfos2.push('Mens Up TV','185','logos/tv_services/Mens_Up_TV_color.png','mens-up-tv','0');
channelsInfos2.push('Astrocenter TV','186','logos/tv_services/Astrocenter_TV_color.png','astrocenter-tv','0');
channelsInfos2.push('My Zen TV','187','logos/tv_services/myzentv-100x100.png','my-zen-tv','0');
channelsInfos2.push('MUSEUM TV','191','img/apps/chaines/logos/MUSEUMTV100x100.png','museum-tv','0');
channelsInfos2.push('EXPLORE','193','img/apps/chaines/logos/Explore100x100.png','explore','0');
channelsInfos2.push('Le Figaro TV','194','img/apps/chaines/logos/FigaroTV100x100.png','le-figaro-tv','1');
channelsInfos2.push('KITCHEN MANIA','196','img/apps/chaines/logos/KitchenMania100x100.png','kitchen-mania','0');
channelsInfos2.push('Top Santé TV','197','img/apps/chaines/logos/TopSante100x100.png','top-sante-tv','1');
channelsInfos2.push('Maison & Travaux TV','198','img/apps/chaines/logos/MaisonTravaux100x100.png','maison-travaux-tv','1');
channelsInfos2.push('Auto Plus TV','199','img/apps/chaines/logos/AutoPlus100x100.png','auto-plus-tv','1');
channelsInfos2.push('Nickelodeon Junior','200','img/apps/chaines/logos/NickJr100x100.png','nickelodeon-junior','0');
channelsInfos2.push('Boomerang','201','logos/tv_services/Boomerang_color.png','boomerang','0');
channelsInfos2.push('Boomerang +1','202','logos/tv_services/Boomerang_1_color.png','boomerang-1','0');
channelsInfos2.push('TIJI','203','img/apps/chaines/logos/TIJI100x100.png','tiji','0');
channelsInfos2.push('DREAMWORKS','204','img/apps/chaines/logos/DREAMWORKS100x100.png','dreamworks','0');
channelsInfos2.push('Nickelodeon','205','img/apps/chaines/logos/Nickelodeon100x100Couleur.png','nickelodeon','0');
channelsInfos2.push('Nickelodeon+1','206','logos/tv_services/Nickelodeon_1_color.png','nickelodeon1','0');
channelsInfos2.push('CANAL J','210','img/apps/chaines/logos/CANAL100x100.png','canal-j','0');
channelsInfos2.push('Cartoon Network','211','logos/tv_services/Cartoon_Network_color.png','cartoon-network','0');
channelsInfos2.push('Nickelodeon Teen','212','img/apps/chaines/logos/NickelodeonTeen100x100.png','nickelodeon-teen','0');
channelsInfos2.push('Cartoonito','213','img/apps/chaines/logos/CARTOONITO100x100Couleur.png','cartoonito','1');
channelsInfos2.push('Mangas','231','img/apps/chaines/logos/LogoManga100x100.png','mangas','0');
channelsInfos2.push('Lucky Jack','234','logos/tv_services/Lucky_Jack_color.png','lucky-jack','0');
channelsInfos2.push('MTV Hits','250','img/apps/chaines/logos/MTVHITSlogonoir100x100.png','mtv-hits','0');
channelsInfos2.push('M6 Music','254','logos/tv_services/M6_Music_color.png','m6-music','1');
channelsInfos2.push('RFM TV','255','logos/tv_services/RFM_TV_color.png','rfm-tv','1');
channelsInfos2.push('NRJ Hits','256','logos/tv_services/NRJ_Hits_color.png','nrj-hits','0');
channelsInfos2.push('Trace Latina','257','img/apps/chaines/logos/TRACELATINA100x100.png','trace-latina','1');
channelsInfos2.push('Mezzo','260','img/apps/chaines/logos/Mezzo100x100fondblanc.png','mezzo','0');
channelsInfos2.push('Mezzo Live HD','261','img/apps/chaines/logos/MezzoLive100x100fondblanc.png','mezzo-live-hd','0');
channelsInfos2.push('MELODY TV','262','logos/tv_services/MELODY_TV_color.png','melody-tv','0');
channelsInfos2.push('Trace Urban','263','logos/tv_services/Trace_Urban_color.png','trace-urban','0');
channelsInfos2.push('Trace Toca','264','logos/tv_services/Trace_Toca_color.png','trace-toca','0');
channelsInfos2.push('TRACE CARIBBEAN','265','logos/tv_services/TRACE_CARIBBEAN_color.png','trace-caribbean','0');
channelsInfos2.push('Trace Gospel','266','logos/tv_services/Trace_Gospel_color.png','trace-gospel','0');
channelsInfos2.push('BBLACK Classik','267','logos/tv_services/BBLACK_CLASSIK_color.png','bblack-classik','0');
channelsInfos2.push('BBLACK Caribbean','268','logos/tv_services/BBLACK_CARIBBEAN_color.png','bblack-caribbean','0');
channelsInfos2.push('BBLACK Africa','269','logos/tv_services/BBLACK_AFRICA_color.png','bblack-africa','0');
channelsInfos2.push('Melody d Afrique','272','logos/tv_services/Melody_d_Afrique_color.png','melody-dafrique','0');
channelsInfos2.push('BFM Lyon','281','logos/tv_services/BFM_Lyon_color.png','bfm-lyon','1');
channelsInfos2.push('BFM Grand Lille','282','logos/tv_services/bfmgrandlille-100x100.png','bfm-grand-lille','1');
channelsInfos2.push('BFM Grand Littoral','283','logos/tv_services/bfmgrandlittoral-100x100.png','bfm-grand-littoral','1');
channelsInfos2.push('BFM MARSEILLE PROVENCE','284','img/apps/chaines/logos/NEUFBFMMARSEILLEPROV100x100.png','bfm-marseille-provence','1');
channelsInfos2.push('BFM NICE COTE D AZUR','285','img/apps/chaines/logos/NEUFBFMNICECOTEDAZUR100x100.png','bfm-nice-cote-dazur','1');
channelsInfos2.push('BFM TOULON VAR','286','img/apps/chaines/logos/NEUFBFMTOULONVAR100x100.png','bfm-toulon-var','1');
channelsInfos2.push('BFM DICI ALPES DU SUD','287','img/apps/chaines/logos/BFMDICIALPESDUSUD100x100.png','bfm-dici-alpes-du-sud','1');
channelsInfos2.push('BFM DICI HAUTE-PROVENCE','288','img/apps/chaines/logos/BFMDICIHAUTEPROVENCE100x100.png','bfm-dici-haute-provence','1');
channelsInfos2.push('BFM ALSACE','289','img/apps/chaines/logos/BFMALSACE100x100.png','bfm-alsace','1');
channelsInfos2.push('BFM NORMANDIE','290','img/apps/chaines/logos/BFMNORMANDIE100x100COULEUR.png','bfm-normandie','1');
channelsInfos2.push('vià30','295','logos/tv_services/via30_color.png','via30','0');
channelsInfos2.push('vià31','296','logos/tv_services/via31_color.png','via31','0');
channelsInfos2.push('vià34','297','logos/tv_services/via34_color.png','via34','0');
channelsInfos2.push('vià66','298','logos/tv_services/via66_color.png','via66','0');
channelsInfos2.push('beIN SPORTS MAX 4','300','logos/tv_services/beIN_SPORTS_MAX_4_color.png','bein-sports-max-4','0');
channelsInfos2.push('beIN SPORTS MAX 5','301','logos/tv_services/beIN_SPORTS_MAX_5_color.png','bein-sports-max-5','0');
channelsInfos2.push('beIN SPORTS MAX 6','302','logos/tv_services/beIN_SPORTS_MAX_6_color.png','bein-sports-max-6','0');
channelsInfos2.push('beIN SPORTS MAX 7','303','logos/tv_services/beIN_SPORTS_MAX_7_color.png','bein-sports-max-7','0');
channelsInfos2.push('beIN SPORTS MAX 8','304','logos/tv_services/beIN_SPORTS_MAX_8_color.png','bein-sports-max-8','0');
channelsInfos2.push('beIN SPORTS MAX 9','305','logos/tv_services/beIN_SPORTS_MAX_9_color.png','bein-sports-max-9','0');
channelsInfos2.push('beIN SPORTS MAX 10','306','logos/tv_services/beIN_SPORTS_MAX_10_color.png','bein-sports-max-10','0');
channelsInfos2.push('RMC Sport Live 3','316','img/apps/chaines/logos/RMCSPORTLIVE3100x100.png','rmc-sport-live-3','0');
channelsInfos2.push('RMC Sport Live 4','317','img/apps/chaines/logos/RMCSPORTLIVE4100x100.png','rmc-sport-live-4','0');
channelsInfos2.push('+ d’Afrique','390','img/apps/chaines/logos/PLUSDAFRIQUE100x100Couleur.png','dafrique','0');
channelsInfos2.push('France 3 - Alpes','431','logos/tv_services/France-3-Alpes-Color.jpg','france-3-alpes','1');
channelsInfos2.push('France 3 - Alsace','432','logos/tv_services/France-3-Alsace-Color.jpg','france-3-alsace','1');
channelsInfos2.push('France 3 - Aquitaine','433','logos/tv_services/France-3-Aquitaine-Color.jpg','france-3-aquitaine','1');
channelsInfos2.push('France 3 - Auvergne','434','logos/tv_services/France-3-Auvergne-Color.jpg','france-3-auvergne','1');
channelsInfos2.push('France 3 - Basse-Normandie','435','logos/tv_services/France-3-Normandie-Color.jpg','france-3-basse-normandie','1');
channelsInfos2.push('France 3 - Bourgogne','436','logos/tv_services/France-3-Bourgogne-Color.jpg','france-3-bourgogne','1');
channelsInfos2.push('France 3 - Bretagne','437','logos/tv_services/France-3-Bretagne-Color.jpg','france-3-bretagne','1');
channelsInfos2.push('France 3 - Centre','438','img/apps/chaines/logos/France3CenCouleur.jpg','france-3-centre','1');
channelsInfos2.push('France 3 - Champagne-Ardenne','439','logos/tv_services/France-3-Champagne-Ardenne-Color.jpg','france-3-champagne-ardenne','1');
channelsInfos2.push('France 3 - Via Stella','440','logos/tv_services/France-3-Corse-Color.jpg','france-3-via-stella','1');
channelsInfos2.push('France 3 - Côte d Azur','441','logos/tv_services/France-3-Cote-Azur-Color.jpg','france-3-cote-dazur','1');
channelsInfos2.push('France 3 - Franche-Comté','442','logos/tv_services/France-3-Franche-Comte-Color.jpg','france-3-franche-comte','1');
channelsInfos2.push('France 3 - Haute-Normandie','443','logos/tv_services/France-3-Normandie-Color.jpg','france-3-haute-normandie','1');
channelsInfos2.push('France 3 - Languedoc','444','logos/tv_services/France-3-Languedoc-Roussillon-Color.jpg','france-3-languedoc','1');
channelsInfos2.push('France 3 - Limousin','445','logos/tv_services/France-3-Limousin-Color.jpg','france-3-limousin','1');
channelsInfos2.push('France 3 - Lorraine','446','logos/tv_services/France-3-Lorraine-Color.jpg','france-3-lorraine','1');
channelsInfos2.push('France 3 - Midi-Pyrénées','447','logos/tv_services/France-3-Midi-Pyrenees-Color.jpg','france-3-midi-pyrenees','1');
channelsInfos2.push('France 3 - Nord Pas-de-Calais','448','logos/tv_services/France-3-Nord-pas-de-Calais-Color.jpg','france-3-nord-pas-de-calais','1');
channelsInfos2.push('France 3 - Paris Ile-de-France','449','logos/tv_services/France-3-Paris-IdF-Color.jpg','france-3-paris-ile-de-france','1');
channelsInfos2.push('France 3 - Pays de Loire','450','logos/tv_services/France-3-Pyas-de-la-Loire-Color.jpg','france-3-pays-de-loire','1');
channelsInfos2.push('France 3 - Picardie','451','logos/tv_services/France-3-Picardie-Color.jpg','france-3-picardie','1');
channelsInfos2.push('France 3 - Poitou-Charentes','452','logos/tv_services/France-3-Poitou-Charentes-Color.jpg','france-3-poitou-charentes','1');
channelsInfos2.push('France 3 - Provence Alpes','453','logos/tv_services/France-3-Provence-Alpes-Color.jpg','france-3-provence-alpes','1');
channelsInfos2.push('France 3 - Rhône-Alpes','454','logos/tv_services/France-3-Rhone-Alpes-Color.jpg','france-3-rhone-alpes','1');
channelsInfos2.push('France 3 Nouvelle Aquitaine','455','logos/tv_services/France-3-Nouvelle-Aquitaine-Color.jpg','france-3-nouvelle-aquitaine','1');
channelsInfos2.push('France 3 - Corse','456','img/apps/chaines/logos/FR3CORSE100x100.png','france-3-corse','1');
channelsInfos2.push('Canal 21','457','logos/tv_services/Canal_21_color.png','canal-21','0');
channelsInfos2.push('20 Minutes TV','461','img/apps/chaines/logos/20MinutesTV100x100.png','20-minutes-tv','0');
channelsInfos2.push('Télé Bocal','464','logos/tv_services/Tele_Bocal_color.png','tele-bocal','1');
channelsInfos2.push('vià93','467','img/apps/chaines/logos/Via93100x100.png','via93','1');
channelsInfos2.push('Figaro TV IDF','468','img/apps/chaines/logos/LEFIGARO100x100couleur.png','figaro-tv-idf','0');
channelsInfos2.push('TV78','469','img/apps/chaines/logos/TV78100x100COULEUR.png','tv78','0');
channelsInfos2.push('Lyon Capitale TV','476','img/apps/chaines/logos/lyoncapitaletv1100x100couleur.png','lyon-capitale-tv','0');
channelsInfos2.push('Télé Grenoble','477','img/apps/chaines/logos/LogoTlgrenoble100x100.png','tele-grenoble','0');
channelsInfos2.push('TL7','478','logos/tv_services/TL7_Saint_etienne_color.png','tl7','0');
channelsInfos2.push('8 Mont Blanc','480','logos/tv_services/8_Mont_Blanc_color.png','8-mont-blanc','0');
channelsInfos2.push('IL TV','481','logos/tv_services/IL_TV_color.png','il-tv','0');
channelsInfos2.push('ASTV','482','img/apps/chaines/logos/ASTV100x100couleuir.png','astv','1');
channelsInfos2.push('Wéo Picardie','486','img/apps/chaines/logos/WeoPicardie100x100.png','weo-picardie','1');
channelsInfos2.push('Wéo TV, La voix du nord','487','img/apps/chaines/logos/WEOLAVDN100x100.png','weo-tv-la-voix-du-nord','0');
channelsInfos2.push('Vià MATÉLÉ','489','img/apps/chaines/logos/viamatele100x100couleur.png','via-matele','1');
channelsInfos2.push('7 A LIMOGES','490','logos/tv_services/7_A_LIMOGES_color.png','7-a-limoges','0');
channelsInfos2.push('TV7 Bordeaux','491','logos/tv_services/TV7_Bordeaux_color.png','tv7-bordeaux','0');
channelsInfos2.push('TVPI','492','img/apps/chaines/logos/Tvpilogojaunealpha100x100.png','tvpi','1');
channelsInfos2.push('KANALDUDE','496','img/apps/chaines/logos/Kanaldude100x100fondblanc.png','kanaldude','1');
channelsInfos2.push('TV2COM','501','img/apps/chaines/logos/100x100tv2com.png','tv2com','1');
channelsInfos2.push('NA TV','504','img/apps/chaines/logos/NATV100x100couleur.png','na-tv','1');
channelsInfos2.push('Canal 32','505','logos/tv_services/Canal_32_color.png','canal-32','0');
channelsInfos2.push('VIA Mirabelle','506','logos/tv_services/VIA_Mirabelle_color.png','via-mirabelle','0');
channelsInfos2.push('Puissance TV','507','img/apps/chaines/logos/PUISSANCETV100x100.png','puissance-tv','1');
channelsInfos2.push('TVMonaco','511','img/apps/chaines/logos/TVMonaco100x100.png','tvmonaco','1');
channelsInfos2.push('Mosaïk Cristal','512','logos/tv_services/Mosaik_color.png','mosaik-cristal','0');
channelsInfos2.push('TV8 Moselle-Est','513','logos/tv_services/TV8_Moselle_Est_color.png','tv8-moselle-est','1');
channelsInfos2.push('Vosges tv','514','img/apps/chaines/logos/VOSGES100x100couleur.png','vosges-tv','0');
channelsInfos2.push('Cannes Lérins TV','515','img/apps/chaines/logos/CannesLerins100x100.png','cannes-lerins-tv','1');
channelsInfos2.push('Maritima TV','520','img/apps/chaines/logos/MaritimaTV100x100.png','maritima-tv','0');
channelsInfos2.push('MAURIENNE TV','522','img/apps/chaines/logos/mauriennetv100x100.png','maurienne-tv','1');
channelsInfos2.push('Angers télé','523','img/apps/chaines/logos/AngersTV100x100.png','angers-tele','0');
channelsInfos2.push('Télénantes','524','logos/tv_services/Telenantes_color.png','telenantes','0');
channelsInfos2.push('TV Vendée','525','logos/tv_services/TV_Vendee_color.png','tv-vendee','0');
channelsInfos2.push('LMtv Sarthe','526','img/apps/chaines/logos/LMTV100x100.png','lmtv-sarthe','1');
channelsInfos2.push('TEBEO','529','img/apps/chaines/logos/TEBEOcolor1.png','tebeo','1');
channelsInfos2.push('TV RENNES 35','530','img/apps/chaines/logos/TVRennes35100x100couleur.png','tv-rennes-35','1');
channelsInfos2.push('Val de Loire TV','533','img/apps/chaines/logos/TVTOURS100x100.png','val-de-loire-tv','1');
channelsInfos2.push('ZOUK TV','536','logos/tv_services/ZOUK_TV_color.png','zouk-tv','0');
channelsInfos2.push('Télé Paese','537','logos/tv_services/Tele_Paese_color.png','tele-paese','0');
channelsInfos2.push('CNN International','541','logos/tv_services/CNN_International_color.png','cnn-international','1');
channelsInfos2.push('BBC NEWS','542','img/apps/chaines/logos/BBCNews100x100.png','bbc-news','0');
channelsInfos2.push('France 24 Anglais','543','logos/tv_services/France_24_English_color.png','france-24-anglais','1');
channelsInfos2.push('CNBC Europe','544','logos/tv_services/CNBC_EUROPE_color.png','cnbc-europe','0');
channelsInfos2.push('Bloomberg PAN-European','545','logos/tv_services/Bloomberg_PAN_European_color.png','bloomberg-pan-european','0');
channelsInfos2.push('Al Jazeera English','546','logos/tv_services/Al_Jazeera_English_color.png','al-jazeera-english','0');
channelsInfos2.push('i24 News Anglais','547','logos/tv_services/I24_NEWS_ENGLISH_color.png','i24-news-anglais','1');
channelsInfos2.push('NHK WORLD-JAPAN','548','logos/tv_services/NHK_WORLD_JAPAN_color.png','nhk-world-japan','1');
channelsInfos2.push('Sky News','549','logos/tv_services/Sky_News_color.png','sky-news','0');
channelsInfos2.push('TGCOM24','550','img/apps/chaines/logos/LogoTGCOM100x100couleur.png','tgcom24','1');
channelsInfos2.push('i24 News Arabe','555','logos/tv_services/I24_NEWS_ARABIC_color.png','i24-news-arabe','1');
channelsInfos2.push('France 24 Arabe','556','logos/tv_services/France_24_Arabic_color.png','france-24-arabe','1');
channelsInfos2.push('Medi1TV','558','logos/tv_services/Medi1TV_color.png','medi1tv','0');
channelsInfos2.push('AL ARABIYA','559','img/apps/chaines/logos/AlArabiya100x100.png','al-arabiya','0');
channelsInfos2.push('Ennahar TV','561','logos/tv_services/Ennahar_TV_color.png','ennahar-tv','0');
channelsInfos2.push('Canal 11','568','img/apps/chaines/logos/Channel11100x100fondblanc.png','canal-11','0');
channelsInfos2.push('France 24 Espanol','573','img/apps/chaines/logos/FR24esp100x100.png','france-24-espanol','1');
channelsInfos2.push('24h','574','logos/tv_services/24H_TVE_color.png','24h','0');
channelsInfos2.push('TVE','575','logos/tv_services/TVEI_color.png','tve','0');
channelsInfos2.push('DW-TV','578','logos/tv_services/DW_TV_color.png','dw-tv','0');
channelsInfos2.push('WELT','579','logos/tv_services/WELT_color.png','welt','0');
channelsInfos2.push('Record News','586','logos/tv_services/Record_News_color.png','record-news','0');
channelsInfos2.push('Africa 24','595','logos/tv_services/Africa_24_color.png','africa-24','0');
channelsInfos2.push('Canal2','597','logos/tv_services/Canal2_color.png','canal2','0');
channelsInfos2.push('V+','602','img/apps/chaines/logos/V100x100.png','v','0');
channelsInfos2.push('Porto Canal','604','logos/tv_services/Porto_Canal_color.png','porto-canal','0');
channelsInfos2.push('Local Visao','605','logos/tv_services/Local_Visao_color.png','local-visao','0');
channelsInfos2.push('Benfica TV','608','logos/tv_services/Benfica_TV_color.png','benfica-tv','0');
channelsInfos2.push('A BOLA TV','609','logos/tv_services/A_BOLA_TV_color.png','a-bola-tv','0');
channelsInfos2.push('Canal Q','622','logos/tv_services/Canal_Q_color.png','canal-q','0');
channelsInfos2.push('RTPI','624','logos/tv_services/RTPI_color.png','rtpi','0');
channelsInfos2.push('Rai Uno','626','img/apps/chaines/logos/rai1100x100.png','rai-uno','0');
channelsInfos2.push('RAI SCUOLA','629','logos/tv_services/rai-scuola-100x100-couleur.png','rai-scuola','0');
channelsInfos2.push('RAI STORIA','630','logos/tv_services/rai-storia-100x100-couleur.png','rai-storia','1');
channelsInfos2.push('REAL MADRID TV','645','img/apps/chaines/logos/RealMadridTV100x100couleur.png','real-madrid-tv','0');
channelsInfos2.push('STAR TVE','646','img/apps/chaines/logos/StarTVE100x100.png','star-tve','0');
channelsInfos2.push('ALL FLAMENCO_','650','img/apps/chaines/logos/AllFlamenco100x100.png','all-flamenco','0');
channelsInfos2.push('TVG EUROPA','651','logos/tv_services/TVG_EUROPA_color.png','tvg-europa','0');
channelsInfos2.push('etb basque','655','img/apps/chaines/logos/ETBBasque2022logo100x100couleur.png','etb-basque','0');
channelsInfos2.push('TELE MADRID','657','img/apps/chaines/logos/TeleMadrid100x100couleur.png','tele-madrid','0');
channelsInfos2.push('ANDALUCIA TV','658','img/apps/chaines/logos/AndaluciaTV100x100.png','andalucia-tv','0');
channelsInfos2.push('Boomerang Anglais','664','img/apps/chaines/logos/Boomerang100x100.png','boomerang-anglais','0');
channelsInfos2.push('FilmBox Arthouse','665','img/apps/chaines/logos/FILMBOX100x100.png','filmbox-arthouse','0');
channelsInfos2.push('TCM Anglais','666','img/apps/chaines/logos/TCM100x100.png','tcm-anglais','0');
channelsInfos2.push('TinyTeen','667','img/apps/chaines/logos/TinyTeen100x100.png','tinyteen','0');
channelsInfos2.push('Lang Lab','668','img/apps/chaines/logos/LangLab100x100.png','lang-lab','0');
channelsInfos2.push('Lingo Toons','669','img/apps/chaines/logos/LingoToons100x100.png','lingo-toons','0');
channelsInfos2.push('DocuBox HD','670','img/apps/chaines/logos/DOCUBOX100x100.png','docubox-hd','0');
channelsInfos2.push('FashionBox HD','671','img/apps/chaines/logos/FASHION100x100.png','fashionbox-hd','0');
channelsInfos2.push('ProSieben','673','logos/tv_services/ProSieben_color.png','prosieben','0');
channelsInfos2.push('N-TV','674','logos/tv_services/N_TV_color.png','n-tv','0');
channelsInfos2.push('RTL Television','675','img/apps/chaines/logos/RTLlogocollection06cmyk100x100.png','rtl-television','0');
channelsInfos2.push('RTL2','676','logos/tv_services/RTL2_color.png','rtl2','0');
channelsInfos2.push('Super RTL','678','logos/tv_services/Super_RTL_color.png','super-rtl','0');
channelsInfos2.push('VOX','680','logos/tv_services/Vox_color.png','vox','0');
channelsInfos2.push('KABEL EINS','682','logos/tv_services/KABEL_EINS_color.png','kabel-eins','0');
channelsInfos2.push('RTL NITRO TV','685','logos/tv_services/RTL_NITRO_TV_color.png','rtl-nitro-tv','0');
channelsInfos2.push('Arte Allemand','686','logos/tv_services/Arte_Allemand_color.png','arte-allemand','0');
channelsInfos2.push('TVP Polonia','700','logos/tv_services/TVP_Polonia_color.png','tvp-polonia','0');
channelsInfos2.push('Armenia 1','713','logos/tv_services/Armenia_1_color.png','armenia-1','0');
channelsInfos2.push('ART CINEMA','733','img/apps/chaines/logos/ARTCINEMA100x100couleur.png','art-cinema','0');
channelsInfos2.push('ART AFLAM 1','734','img/apps/chaines/logos/ARTAFLAM1100x100couleur.png','art-aflam-1','0');
channelsInfos2.push('ART AFLAM 2','735','img/apps/chaines/logos/ARTAFLAM2100x100couleur.png','art-aflam-2','0');
channelsInfos2.push('AL HEKAYAT 1','736','img/apps/chaines/logos/AlHekayat100x100.png','al-hekayat-1','0');
channelsInfos2.push('AL HEKAYAT 2','737','img/apps/chaines/logos/ALHEKAYAT2100x100couleur.png','al-hekayat-2','0');
channelsInfos2.push('TV Romania International','738','logos/tv_services/TV_Romania_International_color.png','tv-romania-international','0');
channelsInfos2.push('Bahia TV','739','img/apps/chaines/logos/Bahia100x100Couleur.png','bahia-tv','0');
channelsInfos2.push('Télé Maroc','740','img/apps/chaines/logos/telemaroc100x100color.png','tele-maroc','0');
channelsInfos2.push('Canal Algérie','742','logos/tv_services/Canal_Algerie_color.png','canal-algerie','0');
channelsInfos2.push('Beur FM TV','746','logos/tv_services/Beur_FM_TV_color.png','beur-fm-tv','0');
channelsInfos2.push('2M Maroc','749','logos/tv_services/2M_Maroc_color.png','2m-maroc','0');
channelsInfos2.push('Al Aoula','750','logos/tv_services/Al_Aoula_color.png','al-aoula','0');
channelsInfos2.push('Arryadia','751','logos/tv_services/Arryadia_color.png','arryadia','0');
channelsInfos2.push('Assadissa','752','logos/tv_services/Assadissa_color.png','assadissa','0');
channelsInfos2.push('Watania 2','758','img/apps/chaines/logos/Watania2100x100Couleur.png','watania-2','0');
channelsInfos2.push('Tunisia 1','759','logos/tv_services/Tunisia_1_color.png','tunisia-1','0');
channelsInfos2.push('Asharq News','760','img/apps/chaines/logos/ASHARQNEWS100x100COULEUR.png','asharq-news','1');
channelsInfos2.push('Berbère TV','765','logos/tv_services/Berbere_TV_color.png','berbere-tv','0');
channelsInfos2.push('Sky News Arabia','767','img/apps/chaines/logos/SKYNEWSARABIA100x100COULEUR.png','sky-news-arabia','0');
channelsInfos2.push('CHADA TV','768','img/apps/chaines/logos/CHADATV100x100.png','chada-tv','0');
channelsInfos2.push('Rotana Comedy','769','img/apps/chaines/logos/RotanaComedy100x100.png','rotana-comedy','0');
channelsInfos2.push('Syria TV','770','img/apps/chaines/logos/LogoSyriaTV100x100.png','syria-tv','0');
channelsInfos2.push('Alaraby 1','773','img/apps/chaines/logos/alaraby100x100.png','alaraby-1','0');
channelsInfos2.push('Echorouk News','774','logos/tv_services/Echorouk_News_color.png','echorouk-news','0');
channelsInfos2.push('El Bilad TV','775','logos/tv_services/elbiladtv-100x100.png','el-bilad-tv','0');
channelsInfos2.push('Dizi','776','img/apps/chaines/logos/DIZI100x100COULEUR.png','dizi','0');
channelsInfos2.push('Alaraby 2','777','img/apps/chaines/logos/Alaraby2100x100Couleur.png','alaraby-2','0');
channelsInfos2.push('Rotana Aflam+','778','img/apps/chaines/logos/RotanaAflam100x100.png','rotana-aflam','0');
channelsInfos2.push('Rotana Cinéma+ FR','779','img/apps/chaines/logos/RatanaCinama100x100Couleur.png','rotana-cinema-fr','0');
channelsInfos2.push('Rotana Music','780','img/apps/chaines/logos/RotanaMusic100x100.png','rotana-music','0');
channelsInfos2.push('Rotana Kids','782','img/apps/chaines/logos/RotanaKids100x100.png','rotana-kids','0');
channelsInfos2.push('Rotana Cinema','783','logos/tv_services/Rotana_Cinema_color.png','rotana-cinema','0');
channelsInfos2.push('Rotana Classic','784','img/apps/chaines/logos/ROTANACLASSIC100x100COULEUR.png','rotana-classic','0');
channelsInfos2.push('Nessma','785','logos/tv_services/Nessma_color.png','nessma','0');
channelsInfos2.push('DMC','786','img/apps/chaines/logos/DMC100x100color.png','dmc','0');
channelsInfos2.push('Fix and Foxi','787','img/apps/chaines/logos/FOXETFOXI100x100color.png','fix-and-foxi','0');
channelsInfos2.push('Carthage+','788','img/apps/chaines/logos/carthage100x100color.png','carthage','0');
channelsInfos2.push('DMC Drama','789','img/apps/chaines/logos/dmcdrama100x100color.png','dmc-drama','0');
channelsInfos2.push('Iqraa International','790','logos/tv_services/Iqraa_International_color.png','iqraa-international','0');
channelsInfos2.push('Iqraa TV','791','logos/tv_services/Iqraa_TV_color.png','iqraa-tv','0');
channelsInfos2.push('Al Majd Holy Quran','792','logos/tv_services/Al_Majd_Holy_Quran_color.png','al-majd-holy-quran','0');
channelsInfos2.push('Al Maghribia','798','logos/tv_services/Al_Maghribia_color.png','al-maghribia','0');
channelsInfos2.push('Arrabiâ','799','logos/tv_services/Arrabia_color.png','arrabia','0');
channelsInfos2.push('LBC Sat','801','img/apps/chaines/logos/LBC_100x100-couleur.png','lbc-sat','0');
channelsInfos2.push('Lana TV','802','img/apps/chaines/logos/LanaTV100x100.png','lana-tv','1');
channelsInfos2.push('Murr TV','805','logos/tv_services/Murr_TV_color.png','murr-tv','0');
channelsInfos2.push('Rotana M+','806','img/apps/chaines/logos/RotanaMplus100x100couleur.png','rotana-m','0');
channelsInfos2.push('Dubaï TV','807','logos/tv_services/Dubai_TV_color.png','dubai-tv','0');
channelsInfos2.push('ON TV','809','img/apps/chaines/logos/ontv100x100color.png','on-tv','0');
channelsInfos2.push('HANNIBAL TV','810','logos/tv_services/HANNIBALTV-100x100.png','hannibal-tv','0');
channelsInfos2.push('Al Masriya','813','logos/tv_services/Al_Masriya_color.png','al-masriya','0');
channelsInfos2.push('The Israeli Network','814','logos/tv_services/The_Israeli_Network_color.png','the-israeli-network','0');
channelsInfos2.push('Jordan Satellite Channel','815','logos/tv_services/Jordan_Satellite_Channel_color.png','jordan-satellite-channel','0');
channelsInfos2.push('Euro Star','818','img/apps/chaines/logos/EUROSTAR100x100.png','euro-star','0');
channelsInfos2.push('Euro D','819','img/apps/chaines/logos/eurod100x100.png','euro-d','0');
channelsInfos2.push('BEIN MOVIES','821','logos/tv_services/beinmovies-100x100-couleur.png','bein-movies','0');
channelsInfos2.push('SHOW MAX','822','logos/tv_services/showmax-100x100-couleur.png','show-max','0');
channelsInfos2.push('ATV Avrupa','824','img/apps/chaines/logos/ATVAVRUPA100x100.png','atv-avrupa','0');
channelsInfos2.push('KANAL 7 AVRUPA','825','logos/tv_services/avrupa-100x100-couleur.png','kanal-7-avrupa','0');
channelsInfos2.push('ORTB','839','logos/tv_services/ORTB_color.png','ortb','0');
channelsInfos2.push('NOVELAS','840','img/apps/chaines/logos/100x100couleurNOVELAS.png','novelas','0');
channelsInfos2.push('CRTV','841','logos/tv_services/CRTV_color.png','crtv','0');
channelsInfos2.push('CHERIFLA TV','844','img/apps/chaines/logos/100x100Cherifla.png','cherifla-tv','0');
channelsInfos2.push('ORTC','845','logos/tv_services/ORTC_color.png','ortc','0');
channelsInfos2.push('TV Congo','846','logos/tv_services/TV_Congo_color.png','tv-congo','0');
channelsInfos2.push('Maboke TV','847','img/apps/chaines/logos/MABOKE_TV_100x100-COULEUR.png','maboke-tv','0');
channelsInfos2.push('RTNC','848','logos/tv_services/RTNC_color.png','rtnc','0');
channelsInfos2.push('NCI','849','img/apps/chaines/logos/NCI100x100couleurNCI.png','nci','0');
channelsInfos2.push('RTI 1','851','img/apps/chaines/logos/RTI1100x100Couleur.png','rti-1','0');
channelsInfos2.push('CDIRECT','852','img/apps/chaines/logos/100x100couleurCDIRECT.png','cdirect','0');
channelsInfos2.push('Gabon 1ère','853','img/apps/chaines/logos/GABON_1ERE_100x100_COULEUR.png','gabon-1ere','0');
channelsInfos2.push('RTG','854','img/apps/chaines/logos/RTG100x100COULEUR.png','rtg','0');
channelsInfos2.push('TVM','855','logos/tv_services/TVM_color.png','tvm','0');
channelsInfos2.push('ORTM','856','img/apps/chaines/logos/ORTM100x100Couleur.png','ortm','0');
channelsInfos2.push('Nollywood TV','858','img/apps/chaines/logos/NollywoodTV100x100.png','nollywood-tv','0');
channelsInfos2.push('Pulaagu','859','img/apps/chaines/logos/PULAAGU100x100.png','pulaagu','0');
channelsInfos2.push('Trace Africa','861','logos/tv_services/Trace_Africa_color.png','trace-africa','0');
channelsInfos2.push('Vox Africa','862','logos/tv_services/Vox_Africa_color.png','vox-africa','0');
channelsInfos2.push('2STV','863','logos/tv_services/2STV_color.png','2stv','0');
channelsInfos2.push('RTS 1','864','logos/tv_services/RTS_1_color.png','rts-1','0');
channelsInfos2.push('TFM','866','logos/tv_services/TFM_color.png','tfm','0');
channelsInfos2.push('SUNU YEUF','867','img/apps/chaines/logos/100x100couleurSUNUYEUF.png','sunu-yeuf','0');
channelsInfos2.push('Beijing TV','878','logos/tv_services/Beijing_TV_color.png','beijing-tv','0');
channelsInfos2.push('CCTV YuLe','879','logos/tv_services/CCTV_YuLe_color.png','cctv-yule','0');
channelsInfos2.push('CCTV-4','880','logos/tv_services/CCTV_4_color.png','cctv-4','0');
channelsInfos2.push('CMC','881','logos/tv_services/CMC_color.png','cmc','0');
channelsInfos2.push('Hunan TV','882','logos/tv_services/Hunan_Satellite_TV_color.png','hunan-tv','0');
channelsInfos2.push('JSBC International','883','logos/tv_services/JSBC_International_color.png','jsbc-international','0');
channelsInfos2.push('Phoenix CNE','884','logos/tv_services/Phoenix_CNE_color.png','phoenix-cne','0');
channelsInfos2.push('Dragon TV','886','logos/tv_services/Dragon_TV_color.png','dragon-tv','0');
channelsInfos2.push('Great Wall Elite','887','img/apps/chaines/logos/GWE100x100couleur.png','great-wall-elite','0');
channelsInfos2.push('Zhejiang Star TV','888','img/apps/chaines/logos/ZHEJIANGSTV100x100couleur.png','zhejiang-star-tv','0');
channelsInfos2.push('CGTN-Documentary','918','logos/tv_services/CGTN_Documentary_color.png','cgtn-documentary','0');
channelsInfos2.push('CGTN-Français','920','logos/tv_services/CGTN_Francais_color.png','cgtn-francais','0');
channelsInfos2.push('NTD','921','logos/tv_services/NTD_color.png','ntd','0');
channelsInfos2.push('NHK World Premium','938','img/apps/chaines/logos/NHK-_WORLD_PREMIUM_100x100-couleur.png','nhk-world-premium','0'); 

var channels_settings_img = 'data:image/png;base64,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';
var channels_img = 'data:image/png;base64,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';
var config_img = 'data:image/png;base64,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';
var fullscreen_img = 'data:image/png;base64,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';
var logs_img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIcAAACHCAIAAACzhd1dAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAAWdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjH3g/eTAAAAtGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAMQECAA4AAABaAAAAaYcEAAEAAABoAAAAAAAAAPJ2AQDoAwAA8nYBAOgDAABQYWludC5ORVQgNS4xAAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACSAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAAB0aWKnOCQVtAAAMMklEQVR4Xu2cCXAUVRqAZ6bnzDn3TDKEFIFdzhiRQxRcEOSKSwRhoQrREtiihAhSEo6IJUYNGzFcugGDrMiREBKQDeAuR4kgWx6Uigew7MqKQubMPZPJMUf3/j3dTDIzSRipZPqNvK9eJv1ev0yn3tfvvf919wyfbLnFwyCGgP2NQQlsBUWwFRTBVlAEW0ERbAVFsBUUwVZQBFtBEWwFRbAVFMFWUARbQRFsBUWwFRTBVlAEW0ERbAVFsBUUwVZQBFtBEWwFRbAVFMFWUARbQRFsBUWwFRTBVlAEW0ERbAVFsBUUwVZQBPVPFfEFfPhhM5GBoiiSZLc5AmkrfIJwNDoaGhppNxEBjMTGxioVibDBFnEBulb4QqHNYlu/oXD3+/tF0kQ+PxJiXC0Na3OW5+etJggBh2IQtQJKrGbbmpc27jtwSKvVkiRVU1PN7us14EA2my37uWe3Fb4qFAqxlQBAicVkzcnNLymtMBiSvV7SS1JzZ2cqFXIY8tlKPYpAQNyqMh2s+Ki12bF82aItm17BVgIAJWajJWddfmnZYYPBAE1jMldPn/po6d7tcnk8RfZKS8EE9svPN/sNeYzyNKFgBa3IGJSYqswrc14DJYlyhclcQ08nlDsmRiYSCWE/W68XEItEKkUcm+EahKyAEuMt04pVeeWHj0K2b4ohc+ojdocTtuG09Z25vXjywttz2DmCQMUKKKm6aVz+4qtHPqyE7JTHxldWvLd982sicQxTIbJEKBDvCiSsMEqyV244+vfjkJ06ecKuHZv6/T5Np1OPemAgU+eegnsroMRisqxd/5djxz+CbOa0Se/t3JSa1pfndsOYEqnlIw0q4xfnVhgla3I3lpYdgWzWH6cUFxWkpKZQbg9TIaIgo4VLK6AEgmDoJftLK2D+mDZ1UtH2/D6pfSgPowTiLyCC/yHHs0k7nFkBJTaLbd16WL2Xw7rE7Wpe/Oy8PmmpPJKC1QMknpBocjZbrDXsH4TAVLvrxL5L53Dca7hZRfIFAqPRDL2k5OCR5ORkCEkb7c4Jj4x6fPpEQiBgmkTA53/z7dXi3WU8nuvJWVl7dxfGxcUwq0joQR6P52jlSVt1DXGH9u0Et9udPmzIhD+M8YfCIAnWSemjM+tqrPfu2h5a4d1dB5Y+vwZ6CekDHFTXNXpcLUwFP0l6vdliyZrxeMmerXHx7Vba2lzzFiytPH6KqfZrWbf6+Y2vrfP3iRArG4RCgkMrHI1gFOX1epkts9lstVqh6UOVAFAOr4ZkLb2279BKsORXKhVs5tej0ai7vQbNmQ8GzkawncX7l62As5VXvOOtiePH3pbUCSRFadQKtUoRdPJabTX1DQ7oZGw+bOANk/RqeWICHsEC6Gjl8jcfDx2ezmPjriButzhJht4fpGfsu77pEviGqFnheL0CwKTC83ipkESf0h4Pmzq7ZQuDYHuFX5noy14Iw31f+f6rM+kZw+iW6gBU+PTCFydPn5NIxGxRzwGRwriHH8ycPsF/XwC12R5FKzAqQXusXV/w1pYitqineWntivy8NV3PK/dmDNYt0BgQ+6b0SfLlZL2QeHK53PfmXcGZDwZURzA+Hxb2tbX1dz2ddwN0goSEBIUcx2CB3NEKQD9tJGDW7UzrMAMbY4nZ6LQ8CP/ejq84BrtrKJ6nrc2XXD2a6DfEMVgnhBOD/fPUucrjZ2RSCdsNegqK19rWNitrypTJ4/3dBcdgNOHEYOtefnPT5r+yRT1N7prl+XlrfcehwVZowpntt77z/ourN6QPG8QW9Rw/XL62bXPeC9mL8GwfQDhWnM7mlpbWHh6+GCieTCaNjY0JtjIqs64Wz/ZdAy0SGxej1qrVGlXPJ606Ni42qNEh5BP4HhKA14jeAO0MhGMwAGZjkuqFRIJ2aHs/0DcdDmdNNf0oc0ODA/ooKKPLOQLdEezEPz7+4uLXEnHPXwcLBTrKpW+vnjh5XqWIb25xz509XaWUDx70u/nznuBk2kfUCvDShrcKNr3NZiKCRqMhSRJmFKvVCtknZ844sGebTCbBVtrJy9+e90ahXq+3WCwafV96uO+VqT8AikdZTUatVmmz2Z5+al5x0UZYMGEr7TBWYOPUidL0YYO7uVnZgxAEcePnm5NnLGx21GEr3Vm5+ePFlLRUHmOF6S1dtVJXfalj/e7rCAT2uvqpMxZ88eXXHFpBOwbz4QEfXi9959HrdbfS17KY7dAEu6BCaCI9ng513EF7mcTUgQN56QiNPTRXREFf+ena5/2gr/B5n5z915595RKJJHf182n9U+lGvA0sA6//eKOgsEgsEgUFtLAYnZU1/YmsKfAOZpP1jYJ3KNIbFPU2t7ROmzx+3twnYLu+viEz6xkI/3BfCQd+VZVpf8nh3e+XmC3VEDuzxQx8vsls/due0p279u4oDkh795df+u4KfTOYL3A4mna8u2fnrn1BdT7Yd+jKv/+LzoXkKLJCT8XMBrMID0Lg25uclBSfoEhPHzZ8eIZWp9fpdFAovr3oYboIxHUJicpBgwben3FfRkZ6xn3pArFcrVJ2OeVEnGiyEk6rmczm3JznPjlVdvbkwdIPtjMrjyAg1H5m/sxzpw9BnfOny8+fKa+99dmSPz/F+XTiJ6qshMeA/qkqvUauVvZP68sWhaDXqXVJOli3/3DlP5e+u/rNpatGYyf+uOI3aIV+wMxLJ3qjC0h6muGdu3DxkYkzH50ye9K0OftKKth9CPAbtBI27IBoMBjgNTIX3MIkKq0IBAJ64vbBFnWA3ks/iUFfm2eLQqD/kKIeenB4wRvrjUYjW4oMUWml0e7wtLW1QmptC11MWKzVruYWb5urpraeLQrB0dTU3ORUKeWZ0yayRSgRfVZUas0reYWLl+QsWbp23oJlZ899xhe2f7BIq9W9XbRn0ZJVi59bvWrd6wqlit3RAa1WW1ZxHOosXLJqZc6rSqWa3YEM0WSFnqJhre5s/fLiVzA57y89fOzEKaPRzMwQpG+p3+hwXv/frZKDH8Li8dMLn7e2uqDQTX/2tb1L1dU7jOaaQxWVUOfsuQvOllYojMzVzzCJJiuJCfH6JMPIB4aOGzuGSYY+fZWw+gMoSq1WjhwxfMT9Q8aNHeGvMGL40LS0tP5pKXyYbChKIhGPGTN69Mj0h0Zn+OuMemDYgAEDVPQqEpVlZPRcByO9Lpfb2dzS8S4LxaNiY2LEIiHTEeyOJt8jXgGNC3XiYmNEIhHMQICjyRn6FT1QRyqV+J49E+DrYGFB0DEVBF0CsVSiUCnkKrk/QVYsFdNXYHwpUZEoD6zA1BFJxHTUBcEZQfjqBFSABHVkMTFwCIjc4HCdhnaRJAqsWG01TrvD3uiwNzjs9fbgBIWwi0lBu/wprDp22Ntkb7JV19Y1NLLH5gjURzCNRgsTRt8U+ovCInMKV1fX/PxLVV1dLb4X2YmVl/M2byzYxmYiglAk85JkfFyMs7nN627+05yZe98rlMmk2AoLVCgrP3ag9EhCQiS+SQ164eUrP1YZLVKp2N7U8vDojLhY2dixD65YthA/eRQAnLZutzsCz7UABCH4/vK1kQ9Nh+2n58/ZWrgBwjaIDUQQ3UVcCYDubC8kCJkUkEQgiaRSQ5JOrtTAcVUqhUKeCKVcKQHQtQItEjHgYL4L/7QD+jdsMOUcEU1r+3sHbAVFsBUUQcEKx5c3EIR7K/QldKGQz2mCf4AgCJcrODrnCu7XK9lLF02eOI7DgAeA9cpPN26uzHmdx/OsyF68+c1X7tFPq+54d1/2C7kGQ7LRaGJLuYb5Z5ZnL97CtRWORjDfZXX4jY4SgPlnXG1uzmc6zvqK1WK7eu16ZD4rFD5e0qvX6wYP7M/tiMqNFQDE8AgBOg+RssAZQtJfislmOYIzK5huwKtIFMFWUARbQRFsBUWwFRTBVlAEW0ERbAVFsBUUwVZQBFtBEWwFRbAVFMFWUARbQRFsBUWwFRTBVlAkuq1Q9DdGt9/693i8HZ+CCHomwL8LfsM288qUhEJSFCQ2E3Gi0grTWnSb8gO+wc336d/2bNCzM+276O/6hm36bTq2PLPNqgJnIR8AjxhRaYVp3QADPphnzO5I+5/T+DI+mG2mCAQTBGeNE90j2G8VbAVFsBUUwVZQBFtBEWwFRbAVFMFWUARbQRFsBUWwFfTg8f4PMZZqycV3bQ0AAAAASUVORK5CYII=';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var mycss1 =`

#divMyMenu 
{ 
position: fixed;
top: 9em;
left: 1em;
/*width: 400px;*/
max-width   = 10%;
height: 60vh;
max-height: 60vh;
border: 5px solid red;
border-radius: 10px;
display: grid;
grid-template-columns: repeat(2, 1fr); /* = grid-template-columns: 1fr 1fr; */
overflow: hidden; 
background: rgba(251, 242, 221, 1);
}  

#divMyMenuA
{ 
display: grid;
grid-template-rows: repeat(5, 1fr); 
overflow: hidden;
} 

#divMyMenuB
{ 
display: flex;
flex-direction: column;
justify-content: center;
/*padding: 20px;*/
} 

#divMyMenuA .divmenuchilds 
{ 
align-items: center;
} 

.divmenuchilds 
{
display: flex;
justify-content: center;
overflow: hidden;
/*padding: 8px;*/
}      
     
.divmenuchildsimg 
{
max-width: 100%;
max-height: 100%;
width: auto;
height: auto;
object-fit: contain;
display: block;
transition: transform 0.3s ease;
/*margin: 0 auto;*/
} 

.menu-volume-container 
{
display: flex;
justify-content: flex-end;
gap: 10px;
}

.menu-volume-markers 
{
height: 50vh;
display: flex;
flex-direction: column;
justify-content: space-between;
align-items: flex-end;
font-size: 14px;
color: #4a86e8;
}

.menu-volume-markers span 
{
display: block;      /* ou inline-block, mais pas width:100% */
text-align: right;   /* optionnel, mais utile si le span est large */
}

.menu-volume-range 
{
writing-mode: vertical-lr;
direction: rtl;
height: 50vh;
width: 10px;
}


.container-close-btn 
{
position: relative; 
display: inline-block;  
background: none;
border: none;
}

.close-btn 
{
/*position: absolute;*/
top: 8px;
right: 10px;
width: 36px;                /* Largeur et hauteur identiques pour un cercle */
height: 36px;
font-size: 22px;
color: white;
cursor: pointer;
background: red;
outline: none;

margin-left:18px;

border: 5px solid white;
border-radius: 50%;         /* Cercle parfait */
display: flex;
align-items: center;
justify-content: center;
box-sizing: border-box;     /* Pour inclure la bordure dans la taille */
transition: box-shadow 0.2s;
}

.close-btn:hover 
{
color: red;
background: white;
border: 5px solid red;
}

`; 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function addMyCSS(mycss)
{  
     if ( typeof GM_addStyle  != "undefined" ) GM_addStyle(mycss);
else if ( typeof PRO_addStyle != "undefined" ) PRO_addStyle(mycss);
else if ( typeof addStyle     != "undefined" ) addStyle(mycss);
else 
   {
   var node = document.createElement("style");
   node.type = "text/css";
   node.appendChild(document.createTextNode(mycss));
   var heads = document.getElementsByTagName("head");     
   if ( heads.length > 0 ) heads[0].appendChild(node);      
   else document.documentElement.appendChild(node); // no head yet, stick it whereever   
   }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
addMyCSS(mycss1);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createDivVideoState()                                                                                                      // Fonction qui crée le bandeau rouge
{
 if ( window.location.href.includes('https://tv.sfr.fr/direct-tv/') )                                                               // Si l'url est un live
    {
    var div = document.createElement("div");                                                                                        // Création de l'élément
    div.style.top        = "0";                                                                                                     // Position verticale de l'élément  
    div.style.left       = "0";                                                                                                     // Position horizontale de l'élément
    div.style.width      = "10%";                                                                                                   // Largeur de l'élément
    div.style.height     = "40px";                                                                                                  // Hauteur de l'élément
    div.style.position   = "fixed";                                                                                                 // Type de position de l'élément  
    div.style.background = "red";                                                                                                   // Couleur de fond de l'élément (rouge)
    div.style.color      = "white";                                                                                                 // Couleur de la police du texte (blanc) 
    div.style.fontSize   = "32px";                                                                                                  // Taille de la police du texte 
    div.innerHTML        =  videoPlaying;                                                                                           // Texte de l'élément    
    div.style.textAlign  = "center";                                                                                                // Position du texte de l'élément     
    div.style.zIndex     = zindex1;                                                                                                 // Mettre au premier plan l'élément
    div.setAttribute('id', 'divVideoState');                                                                                        // Définir un id pour retrouver l'élément  
    document.body.appendChild(div);                                                                                                 // Ajouter l'élément 
   
    setTimeout( () => { document.getElementById("divVideoState").remove(); },1000);                                                 // Supression de l'élément au bout de 1s   
    } 
}  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createRedDivFunc()                                                                                                         // Fonction qui crée le bandeau rouge
{
 if ( window.location.href.includes('https://tv.sfr.fr/direct-tv/') )// Si l'url est un live
    {
    var div = document.createElement("div");                                                                                        // Création de l'élément
    div.style.top        = "0";                                                                                                     // Position verticale de l'élément  
    div.style.left       = "0";                                                                                                     // Position horizontale de l'élément
    div.style.width      = "100%";                                                                                                  // Largeur de l'élément
    div.style.height     = "40px";                                                                                                  // Hauteur de l'élément
    div.style.position   = "fixed";                                                                                                 // Type de position de l'élément  
    div.style.background = "red";                                                                                                   // Couleur de fond de l'élément (rouge)
    div.style.color      = "white";                                                                                                 // Couleur de la police du texte (blanc) 
    div.style.fontSize   = "32px";                                                                                                  // Taille de la police du texte 
      
    var html1 = "";      

    html1 =  window.location.href;                                                                                                  // Assignation del'url à la variable html1    
    html1 = html1.replace("https://tv.sfr.fr/direct-tv/", "");                                                                      // Remplacement de "https://tv.sfr.fr/channel/" par rien afin d'obtenir un nombre
    html1 = html1.replace(";play=true", "");                                                                                        // Remplacement 
                    
    for ( var i=0; i<channelsInfos2.length/dataStep; i++ )                                                                          // Boucle qui parcourt le tableau channelsInfos2
        if ( channelsInfos2[dataStep*i+3] == html1 )                                                                                // Si l'occurence (pas de 3) du tableau est égale au fameux nombre qui finit l'url 
           { 
           html1 = channelsInfos2[dataStep*i];                                                                                      // html1 vaut le nom de la chaine tv
           break;                                                                                                                   // Stopper la boucle 
           }     
    
    var canGetTitle = document.querySelector(".info h1") !== null;                                                                  // Vérifier que le programme existe
    if ( canGetTitle )   
       html1 += " - "+document.querySelector(".info h1").innerHTML;                                                                 // L'ajouter si il existe

    div.innerHTML        =  html1;                                                                                                  // Texte de l'élément    
    div.style.textAlign  = "center";                                                                                                // Position du texte de l'élément     
    div.style.zIndex     = zindex1;                                                                                                 // Mettre au premier plan l'élément
    div.setAttribute('id', 'divScript');                                                                                            // Définir un id pour retrouver l'élément  
    document.body.appendChild(div);                                                                                                 // Ajouter l'élément 
   
    setTimeout( () => { document.getElementById("divScript").remove(); },1000);                                                     // Supression de l'élément ayant l'id 'divscript' (le bandeau rouge) au bout de 1s   
    } 
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function toogleFullScreen()                                                                                                         // Fonction
{   
   var fullScreenElement = document.fullscreenElement;                                                                              // Quel élément est en plein écran
   if ( fullScreenElement == null)                                                                                                  // Si aucun élément est en plein écran
      {       
      //var testElement = document.getElementById("shaka-player-video");                                                            // Trouver le conteneur vidéo
      
      var testElement = document.getElementsByTagName("web-player")[0];         
        
      if ( typeof(testElement) != 'undefined' || testElement != null )  
         testElement.requestFullscreen();                                                                                           // Passer en plein écran le conteneur vidéo                   
      }
   else 
      document.exitFullscreen();                                                                                                    // Sinon sortir du plein écran
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function listChannels()                                                                                                             // Fonction
{ 
   if ( channelTabAdded == false )                                                                                                  // Si le tableau des chaines n'est pas affiché
      {        
      var htmlCodeChannelTab = '<table style="background-color:rgba(251, 242, 221, 1);color:black;" cellspacing=10 cellpadding=10>';// Variable qui contiendra le code html du tableau        
        
      if ( 'nbColumnChannelTab' in localStorage ) nbColumnChannelTab = localStorage.getItem('nbColumnChannelTab');                  // Si la variable est stockée , remplacer celle par défaut
      if ( 'imgChannelWidth' in localStorage ) imgChannelWidth = localStorage.getItem('imgChannelWidth');                           // Si la variable est stockée , remplacer celle par défaut
        
      let nbAddedColumns = 0;             
      for ( var u=0; u<channelsInfos2.length/dataStep; u++ )                                                                        // Boucle    
          if ( channelsInfos2[dataStep*u+4] == 1 )                                                                    
             {                                                                                                 
             var nameChannel = channelsInfos2[dataStep*u+0];                                                                        // Variable pour le titre de l'image                 
               
             htmlCodeChannelTab += '<div>';
             htmlCodeChannelTab += '<td><a href="https://tv.sfr.fr/direct-tv/' +  channelsInfos2[dataStep*u+3] + '">';              // Lien pointant vers l'url de la chaine
             htmlCodeChannelTab += '<img width="' + imgChannelWidth + 'px" src="http://static-cdn.tv.sfr.net/data/';                // Image de la chaine     
             htmlCodeChannelTab +=  channelsInfos2[dataStep*u+2] + '" title="' + nameChannel + '">';                                // Image de la chaine 
             htmlCodeChannelTab += '</a>';                                                                                          // Fermeture balise "lien"
             htmlCodeChannelTab += '</div><div style="margin-top:1em;text-align:center;background-color:#000000;color:#FFFFFF; ">'; // Ajout d'un bloc "div"
             htmlCodeChannelTab +=  channelsInfos2[dataStep*u+1] +'</div>';                                                         // Ajout du numéro du "canal"      
             
             nbAddedColumns++;
             if ( nbAddedColumns % nbColumnChannelTab == 0 )                                                                        // Si le modulo vaut 0 
                htmlCodeChannelTab += "<tr>";                                                                                       // Création d'une nouvelle rangée  
             } 
     
      htmlCodeChannelTab += "</table>";                                                                                             // Fermeture balise "tableau"
       
      htmlCodeChannelTab += '<div class="container-close-btn">';
      htmlCodeChannelTab += '<button class="close-btn" title="Fermer" ';
      htmlCodeChannelTab += 'onclick="document.getElementById(\'ChannelTab\').remove();channelTabAdded=false;"'; 
      htmlCodeChannelTab += '>&times;</button>';       
      htmlCodeChannelTab += '</div>';  
        
      var div = document.createElement("div");                                                                                      // Création de l'élément
      div.style.top            = "10vh";                                                                                            // Position verticale de l'élément  
      div.style.width          = "100%";                                                                                            // Largeur de l'élément
      div.style.maxHeight      = "80vh";                                                                                            // Hauteur maximale de l'élément
      div.style.overflowY      = "auto";                                                                                            // Pour scroll
      div.style.position       = "fixed";                                                                                           // Type de position de l'élément  
      div.style.color          = "white";                                                                                           // Couleur de la police du texte (blanc) 
      div.style.fontSize       = "16px";                                                                                            // Taille de la police du texte 
      div.style.zIndex         = zindex4;                                                                                           // Mettre au premier plan l'élément    
      div.style.display        = "flex";                                                                                            // L'élément est flexible
      div.style.justifyContent = "center";                                                                                          // Style du contenu
      div.setAttribute('id', 'ChannelTab');                                                                                         // Définir un id pour retrouver l'élément      
      div.innerHTML            =  htmlCodeChannelTab;                                                                               // Texte de l'élément   
      
      var fullScreenElement = document.fullscreenElement;                                                                           // Quel élément est en plein écran
        
      if ( fullScreenElement != null)                                                                                               // Si un élément est en plein écran
         fullScreenElement.insertBefore(div,fullScreenElement.firstChild);                                                          // Insérer le div avant le premier enfant
      else                                                                                                                          // Pas d'élément en plein écran
         document.body.appendChild(div);                                                                                            // Ajouter l'élément 
      
      channelTabAdded = true;                                                                                                       // Variable indiquant que le tableau des chaines est affiché   
      setTimeout( () => { if ( channelTabAdded == true ) 
                             {
                             if ( document.getElementById("ChannelTab") ) document.getElementById("ChannelTab").remove(); 
                             channelTabAdded = false; 
                             }
                        },delayBeforeHide);                                                                                         // Supression de l'élément ayant l'id 'divscript' (le bandeau rouge) au bout de 1s       
      
      } 
   else                                                                                                                             // Sinon le tableau des chaines est affiché
      { 
      if ( document.getElementById("ChannelTab") ) document.getElementById("ChannelTab").remove();                                  // Suppression du tableau des chaines
      channelTabAdded = false;                                                                                                      // Variable indiquant que le tableau des chaines n'est pas affiché
      }     
    
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function configListChannels()                                                                                                           // Fonction
{ 
   if ( channelTabAddedConfig == false )                                                                                            // Si le tableau des chaines n'est pas affiché
      {        
      var htmlCodeChannelTabConfig  = '<table style="background-color:rgba(251, 242, 221, 1);color:black;" cellspacing=10 cellpadding=10>';  // Variable qui contiendra le code html du tableau
          htmlCodeChannelTabConfig += '<tr><td style="opacity:1;" colspan="'+nbColumnChannelTabConfig+'">';        //  
          if ( 'myChannelConfigStored' in localStorage ) htmlCodeChannelTabConfig += "myChannelConfigStored : " + localStorage.getItem("myChannelConfigStored"); 
          htmlCodeChannelTabConfig += "<tr>";
        
      if ( 'nbColumnChannelTabConfig' in localStorage ) nbColumnChannelTabConfig = localStorage.getItem('nbColumnChannelTabConfig');// Si la variable est stockée , remplacer celle par défaut
      if ( 'imgChannelWidthConfig' in localStorage ) imgChannelWidthConfig = localStorage.getItem('imgChannelWidthConfig');         // Si la variable est stockée , remplacer celle par défaut
        
      let nbAddedColumnsConfig = 0;  
      let addStuff = "";
      for ( var u=0; u<channelsInfos2.length/dataStep; u++ )                                                                        // Boucle    
          { 
          addStuff = ' id="ChannelTabConfigTd'+ u + '"';  
            
          if ( channelsInfos2[dataStep*u+4] == 1 )     
             addStuff += ' style="background-color:blue;opacity:0.8;" '; 
          else               
             addStuff += ' style="background-color:white;opacity:0.8;" ';               
             
         var nameChannel = channelsInfos2[dataStep*u+0];                                                                            // Variable pour le titre de l'image                 
              
         htmlCodeChannelTabConfig += '<td'+ addStuff + ' ';                                                                         // Ajout d'une cellule
           
         htmlCodeChannelTabConfig += 'onclick="';                                                                                   // Fonction click de la cellule
         htmlCodeChannelTabConfig += 'this.style.backgroundColor = this.style.backgroundColor==\'white\'? \'blue\':\'white\'; ';    // Changer de couleur au clic
         htmlCodeChannelTabConfig +=  '">';           
         htmlCodeChannelTabConfig += '<img style="opacity:1;background-color:white;" width="' + imgChannelWidthConfig ;             // Image de la chaine 
         htmlCodeChannelTabConfig += 'px" src="http://static-cdn.tv.sfr.net/data/';                                                 // Image de la chaine     
         htmlCodeChannelTabConfig +=  channelsInfos2[dataStep*u+2] + '" title="' + nameChannel + '">';                              // Image de la chaine 
         htmlCodeChannelTabConfig += '<div ';                                                                                       // Ajout d'un bloc "div"
         htmlCodeChannelTabConfig += 'style="margin-top:1em;text-align:center;background-color:#000000;color:#FFFFFF;opacity:1; ">';// Ajout d'un style
         htmlCodeChannelTabConfig +=  channelsInfos2[dataStep*u+1] +'</div>';                                                       // Ajout du numéro du "canal"      
             
         nbAddedColumnsConfig++;                                                                                                    // Incrémentation
         if ( nbAddedColumnsConfig % nbColumnChannelTabConfig == 0 )                                                                // Si le modulo vaut 0 (reste de la division)
            htmlCodeChannelTabConfig += "<tr>";                                                                                     // Création d'une nouvelle rangée  
            
          }
      htmlCodeChannelTabConfig += "</table>";                                                                                       // Fermeture balise "tableau"
        
      htmlCodeChannelTabConfig += '<div class="container-close-btn">';
      htmlCodeChannelTabConfig += '<button id="close-btn-configListChannels" class="close-btn" title="Fermer" ';
      htmlCodeChannelTabConfig += '>&times;</button>';       
      htmlCodeChannelTabConfig += '</div>';  
  
      var div = document.createElement("div");                                                                                      // Création de l'élément
      div.style.top            = "10vh";                                                                                            // Position verticale de l'élément  
      div.style.width          = "100%";                                                                                            // Largeur de l'élément
      div.style.maxHeight      = "80vh";                                                                                            // Hauteur maximale de l'élément
      div.style.overflowY      = "auto";                                                                                            // Pour scroll
      div.style.position       = "fixed";                                                                                           // Type de position de l'élément  
      div.style.color          = "white";                                                                                           // Couleur de la police du texte (blanc) 
      div.style.fontSize       = "16px";                                                                                            // Taille de la police du texte 
      div.style.zIndex         = zindex2;                                                                                           // Mettre au premier plan l'élément    
      div.style.display        = "flex";                                                                                            // L'élément est flexible
      div.style.justifyContent = "center";                                                                                          // Style du contenu
      div.setAttribute('id', 'ChannelTabConfig');                                                                                   // Définir un id pour retrouver l'élément      
      div.innerHTML            =  htmlCodeChannelTabConfig;                                                                         // Texte de l'élément   
      
      var fullScreenElement = document.fullscreenElement;                                                                           // Quel élément est en plein écran
        
      if ( fullScreenElement != null)                                                                                               // Si un élément est en plein écran
         fullScreenElement.insertBefore(div,fullScreenElement.firstChild);                                                          // Insérer le tableau avant le premier enfant
      else                                                                                                                          // Pas d'élément en plein écran
         document.body.appendChild(div);                                                                                            // Ajouter l'élément 
      
      document.getElementById("close-btn-configListChannels").addEventListener('click', function() { configListChannels(); });
        
      channelTabAddedConfig = true;                                                                                                 // Variable indiquant que le tableau des chaines est affiché        
      } 
     
   else                                                                                                                             // Sinon le tableau des chaines est affiché
                                                                                                                                    // A la fermeture , sauvegarde de la config
      { 
      var myChannelConfig ='';                                                                                                      // Definition d'une variable utilisée comme une valeur binaire
      var myChannelConfigTemp ='';                                                                                                  // Definition d'une variable 
      var myChannelConfig2 = '';                                                                                                    // Definition d'une variable
      
      for ( var u=1; u<=channelsInfos2.length/dataStep; u++ )                                                                       // Boucle    
          {           
          if ( document.getElementById("ChannelTabConfigTd"+(u-1)).style.backgroundColor == "white" )                               // Si l'arrière plan est blanc                              
             { 
             channelsInfos2[dataStep*(u-1)+4] = '0';                                                                                // Changement de valeur 
             myChannelConfig += ''+0;                                                                                               // Ajout d'un 0
             } 
          else
             { 
             channelsInfos2[dataStep*(u-1)+4] = '1';                                                                                // Changement de valeur 
             myChannelConfig += ''+1;                                                                                               // Ajout d'un 1  
             } 
            
          if ( (u) % 4 == 0  )                                                                                                      // Si le modulo vaut 0 , une suite de 4 '0' ou '1' est obtenue
             {                          
             myChannelConfigTemp += ''+channelsInfos2[dataStep*(u-1)+4];                                                            // Changement de la variable
             myChannelConfig2 += ''+parseInt(myChannelConfigTemp,2).toString(16);                                                   // La suite de 4 '0' ou '1' est transformé en valeur héxadécimale  
             myChannelConfigTemp = '';                                                                                              // Réinitialisation de la variable 
             } 
          else
             {
             myChannelConfigTemp += ''+channelsInfos2[dataStep*(u-1)+4];                                                            // Concaténation
             }
          }  
       
      if ( myChannelConfigTemp != '' ) localStorage.setItem("myChannelConfigStored",myChannelConfig2+'_'+myChannelConfigTemp);      // Config sauvegardée localement    
      else  localStorage.setItem("myChannelConfigStored",myChannelConfig2);

      document.getElementById("ChannelTabConfig").remove();                                                                         // Suppression du tableau des chaines
      channelTabAddedConfig = false;                                                                                                // Variable indiquant que le tableau des chaines n'est pas affiché
      }       
}  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function myLog(error)                                                                                                               // Fonction qui me permet d'enregistrer les erreurs
{                                                                                                                                   // Au rechargement la console s'efface
let d = new Date();                                                                                                                 // Date
let textDate = d.toLocaleDateString()+' '+d.toLocaleTimeString();                                                                   // Date
let currentChannelUrl = window.location.href.replace('https://tv.sfr.fr/direct-tv/','').replace(";play=true", "");                  // Url  
let currentChannelName = " ";                                                                                                       // Nom
let currentChannelNumber = "";                                                                                                      // Canal

for ( var c=0; c<channelsInfos2.length/dataStep; c++ )                                                                              // Boucle                                                                                 
    if ( currentChannelUrl == channelsInfos2[dataStep*c+3] )                                                                        // Chercher Url
       {
       currentChannelName = channelsInfos2[dataStep*c+0] ;     
       currentChannelNumber = channelsInfos2[dataStep*c+1] ; 
       break;                                                                                                                       // Casser la boucle
       }  
  
if ( window.location.href.includes('https://tv.sfr.fr/?state') )                                                                    // Cas particulier de l'url   
   { 
   currentChannelUrl = "_";                                                                                                         // Variable
   currentChannelName = "_";                                                                                                        // Variable
   }    

let myError = "<td>"+textDate+"<td>"+currentChannelName+"<td>"+currentChannelNumber+"<td>"+error;                                   // Création du code pour une rangée du tableau html
let needLogRotation = 1;                                                                                                            // Variable définissant la rotation des logs

if ( 'nbLoggedErrors' in localStorage ) nbLoggedErrors = localStorage.getItem('nbLoggedErrors');                                    // Si la variable est stockée , remplacer celle par défaut
  
for ( l=1 ; l<=nbLoggedErrors; l++)                                                                                                 // Boucle 
    if ( !('ErrorLogged'+l in localStorage))                                                                                        // Si pas d'erreur enregistrée sur cet index
       {         
       localStorage.setItem('ErrorLogged'+l,myError);                                                                               // Log de l'erreur
       needLogRotation = 0;                                                                                                         // Pas besoin de faire une rotation des logs
       break;                                                                                                                       // Casser la boucle
       }
  
if ( needLogRotation == 1 )                                                                                                         // Si besoin de faire une rotation des logs
   {
   for ( l=1 ; l<nbLoggedErrors ; l++)                                                                                              // Boucle                                                                                                    // 
       localStorage.setItem('ErrorLogged'+l, localStorage.getItem('ErrorLogged'+(l+1))   );                                         // l'erreur d'index 2 remplave celle en index 1 ...  
           
   localStorage.setItem('ErrorLogged'+nbLoggedErrors,myError);                                                                      // Log de la dernière erreur 
   }
}  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function showLogs()                                                                                                                 // Fonction
{  
   if ( 'nbLoggedErrors' in localStorage ) nbLoggedErrors = localStorage.getItem('nbLoggedErrors');  
   if ( logTabAdded == false )                                                                                                      // Si le tableau des logs n'est pas affiché
      {        
      var htmlCodeLogTab = '<table style="background-color:rgba(251, 242, 221, 1);color:black;" cellspacing=10 cellpadding=10>';    // Variable qui contiendra le code html du tableau
       
      htmlCodeLogTab += '<tr><td><td><p id="PurgeP">Purger les logs</p><td>';                                                       // Pour purger les erreurs    
                     
      for ( var l=1; l<=nbLoggedErrors; l++ )                                                                                       // Boucle                                                                                 
          if ( 'ErrorLogged'+l in localStorage )                                                                                    // Si le log erreur existe
             htmlCodeLogTab += "<tr><td>"+l+localStorage.getItem('ErrorLogged'+l);                                                  // Ajout d'une ligne  
     
      htmlCodeLogTab += "</table>";                                                                                                 // Fermeture balise "tableau"
        
      htmlCodeLogTab += '<div class="container-close-btn">';
      htmlCodeLogTab += '<button id="close-btn-showLogs" class="close-btn" title="Fermer" ';
      htmlCodeLogTab += '>&times;</button>';       
      htmlCodeLogTab += '</div>';  
  
      var div = document.createElement("div");                                                                                      // Création de l'élément
      div.style.top            = "20vh";                                                                                            // Position verticale de l'élément  
      div.style.width          = "100%";                                                                                            // Largeur de l'élément
      div.style.maxHeight      = "50vh";                                                                                            // Hauteur maximale de l'élément
      div.style.overflowY      = "auto";                                                                                            // Pour scroll
      div.style.position       = "fixed";                                                                                           // Type de position de l'élément  
      div.style.color          = "white";                                                                                           // Couleur de la police du texte (blanc) 
      div.style.fontSize       = "16px";                                                                                            // Taille de la police du texte 
      div.style.zIndex         = zindex2;                                                                                           // Mettre au premier plan l'élément    
      div.style.display        = "flex";                                                                                            // L'élément est flexible
      div.style.justifyContent = "center";                                                                                          // Style du contenu
      div.setAttribute('id', 'LogTab');                                                                                             // Définir un id pour retrouver l'élément      
      div.innerHTML            =  htmlCodeLogTab;                                                                                   // Texte de l'élément   
      
      var fullScreenElement = document.fullscreenElement;                                                                           // Quel élément est en plein écran
        
      if ( fullScreenElement != null )                                                                                              // Si un élément est en plein écran
         fullScreenElement.insertBefore(div,fullScreenElement.firstChild);                                                          // Insérer le tableau avant le premier enfant
      else                                                                                                                          // Pas d'élément en plein écran
         document.body.appendChild(div);                                                                                            // Ajouter l'élément 
        
      document.getElementById("close-btn-showLogs").addEventListener('click', function() { showLogs(); });

      document.getElementById("PurgeP").onclick = function() {                                                                      // Ajout d'une fonction
                                                             for ( var l=1; l<=nbLoggedErrors; l++ )                                // Boucle       
                                                                 if ( 'ErrorLogged'+l in localStorage )                             // Si la variable existe
                                                                    localStorage.removeItem('ErrorLogged'+l);                       // Effacer
                                                             document.getElementById("LogTab").remove();                            // Suppression du tableau des logs  
                                                             logTabAdded = false;                                                   // Variable indiquant que le tableau des logs n'est pas affiché
                                                             };   
      logTabAdded = true;                                                                                                           // Variable indiquant que le tableau des logs est affiché        
      } 
   else                                                                                                                             // Sinon le tableau des logs est affiché
      { 
      document.getElementById("LogTab").remove();                                                                                   // Suppression du tableau des logs
      logTabAdded = false;                                                                                                          // Variable indiquant que le tableau des logs n'est pas affiché
      }       
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function configInterface()                                                                                                          // Fonction
{    
   if ( configDivAdded == false )                                                                                                   // Si div config n'est pas affiché
      {        
      var htmlCodeConfigDiv = '<table  cellspacing=10 cellpadding=10 style="background-color:rgba(251, 242, 221, 1);color:black;">';// Variable contenant le code html du tableau config 
      
      if ( 'volumeStart' in localStorage ) volumeStart = localStorage.getItem('volumeStart');                                       // Si la variable est stockée , remplacer celle par défaut
      htmlCodeConfigDiv    +=  '<tr><td><input type="range" style="vertical-align:middle;margin:2px;width:150px;"';                 // Input type range pour définir les valeurs des variables
      htmlCodeConfigDiv    +=  'id="VolumeStart" name="VolumeStart" min="0" max="100" step="5" value="' + volumeStart*100 + '"';    // La même chose en dessous pour les autres variables     
      htmlCodeConfigDiv    +=  'oninput=" this.parentElement.nextElementSibling.nextElementSibling.innerText=this.value;';  
      htmlCodeConfigDiv    +=  '          localStorage.setItem(\'volumeStart\',this.value/100);';  
      htmlCodeConfigDiv    +=  '          volumeStart = this.value*100;">';    
      htmlCodeConfigDiv    += '<td title="Volume de départ">volumeStart';
      htmlCodeConfigDiv    += '<td>' + volumeStart*100;       

      if ( 'volumeStep' in localStorage ) volumeStep = localStorage.getItem('volumeStep');  
      htmlCodeConfigDiv    +=  '<tr><td><input type="range" style="vertical-align:middle;margin:2px;width:150px;"';      
      htmlCodeConfigDiv    +=  'id="VolRange" name="VolRange" min="5" max="25" step="5" value="' + volumeStep + '" ';    
      htmlCodeConfigDiv    +=  'oninput=" this.parentElement.nextElementSibling.nextElementSibling.innerText=this.value;    ';  
      htmlCodeConfigDiv    +=  '          localStorage.setItem(\'volumeStep\',this.value);';  
      htmlCodeConfigDiv    +=  '          volumeStep = this.value;">';  
      htmlCodeConfigDiv    += '<td title="Augmenter ou dimiuer le volume de cette valeur">volumeStep';
      htmlCodeConfigDiv    += '<td>' + volumeStep;   
        
      if ( 'volumeDelay' in localStorage ) volumeDelay = localStorage.getItem('volumeDelay');  
      htmlCodeConfigDiv    +=  '<tr><td><input type="range" style="vertical-align:middle;margin:2px;width:150px;"';      
      htmlCodeConfigDiv    +=  'id="VolumeDelay" name="VolumeDelay" min="1" max="10" step="1" value="' + volumeDelay/1000 + '"';    
      htmlCodeConfigDiv    +=  'oninput=" this.parentElement.nextElementSibling.nextElementSibling.innerText = this.value; ';  
      htmlCodeConfigDiv    +=  '          localStorage.setItem(\'volumeDelay\',this.value*1000);';  
      htmlCodeConfigDiv    +=  '          volumeDelay = this.value*1000;">';  
      htmlCodeConfigDiv    += '<td title="Délai avant effacement de l\'indicateur de volume">volumeDelay';
      htmlCodeConfigDiv    += '<td>' + volumeDelay/1000;               
  
      if ( 'inputKeysDelay' in localStorage ) inputKeysDelay  = localStorage.getItem('inputKeysDelay');  
      htmlCodeConfigDiv    +=  '<tr><td><input type="range" style="vertical-align:middle;margin:2px;width:150px;"';      
      htmlCodeConfigDiv    +=  'id="InputKeysDelay" name="InputKeysDelay" min="1" max="10" step="1" value="' + inputKeysDelay/1000 + '"';    
      htmlCodeConfigDiv    +=  'oninput=" this.parentElement.nextElementSibling.nextElementSibling.innerText = this.value; ';  
      htmlCodeConfigDiv    +=  '          localStorage.setItem(\'inputKeysDelay\',this.value*1000);';   
      htmlCodeConfigDiv    +=  '          inputKeysDelay = this.value*1000;">';  
      htmlCodeConfigDiv    += '<td title="Délai pour saisir le numéro d\'une chaine">inputKeysDelay';
      htmlCodeConfigDiv    += '<td>' + inputKeysDelay/1000;             
        
      if ( 'nbLoggedErrors' in localStorage ) nbLoggedErrors = localStorage.getItem('nbLoggedErrors');  
      htmlCodeConfigDiv    +=  '<tr><td><input type="range" style="vertical-align:middle;margin:2px;width:150px;"';      
      htmlCodeConfigDiv    +=  'id="NbLoggedErrors" name="NbLoggedErrors" min="0" max="150" step="10" value="' + nbLoggedErrors + '"';       
      htmlCodeConfigDiv    +=  'oninput=" this.parentElement.nextElementSibling.nextElementSibling.innerText = this.value; ';          
      htmlCodeConfigDiv    +=  '          localStorage.setItem(\'nbLoggedErrors\',this.value);';
      htmlCodeConfigDiv    +=  '          nbLoggedErrors = this.value;">';  
      htmlCodeConfigDiv    += '<td title="Nombre d\'erreurs conservées">nbLoggedErrors';
      htmlCodeConfigDiv    += '<td>' + nbLoggedErrors;      
      htmlCodeConfigDiv    += '<tr><td colspan=3 id="TDFixLogs" style="text-align:center;">Cliquer ici pour fix les logs si vous réduisez le nombre <br>Les plus récents sont conservés'; 
       
      if ( 'imgChannelWidth' in localStorage ) imgChannelWidth = localStorage.getItem('imgChannelWidth');  
      htmlCodeConfigDiv    +=  '<tr><td><input type="range" style="vertical-align:middle;margin:2px;width:150px;"';      
      htmlCodeConfigDiv    +=  'id="ImgChannelWidth" name="ImgChannelWidth" min="20" max="150" step="5" value="' + imgChannelWidth + '"';       
      htmlCodeConfigDiv    +=  'oninput=" this.parentElement.nextElementSibling.nextElementSibling.innerText = this.value; ';          
      htmlCodeConfigDiv    +=  '          localStorage.setItem(\'imgChannelWidth\',this.value);';
      htmlCodeConfigDiv    +=  '          imgChannelWidth = this.value;">';  
      htmlCodeConfigDiv    += '<td title="Largeur des vignettes">imgChannelWidth';
      htmlCodeConfigDiv    += '<td>' + imgChannelWidth;      
      
      if ( 'nbColumnChannelTab' in localStorage ) nbColumnChannelTab = localStorage.getItem('nbColumnChannelTab');  
      htmlCodeConfigDiv    +=  '<tr><td><input type="range" style="vertical-align:middle;margin:2px;width:150px;"';      
      htmlCodeConfigDiv    +=  'id="NbColumnChannelTab" name="NbColumnChannelTab" min="5" max="20" step="1" value="' + nbColumnChannelTab + '"';       
      htmlCodeConfigDiv    +=  'oninput=" this.parentElement.nextElementSibling.nextElementSibling.innerText = this.value; ';          
      htmlCodeConfigDiv    +=  '          localStorage.setItem(\'nbColumnChannelTab\',this.value);';
      htmlCodeConfigDiv    +=  '          nbColumnChannelTab = this.value;">';  
      htmlCodeConfigDiv    += '<td title="Nombre de colonnes du tableau des vignettes">nbColumnChannelTab';
      htmlCodeConfigDiv    += '<td>' + nbColumnChannelTab;    
        
      if ( 'nbloopBeforeReload' in localStorage ) nbloopBeforeReload = localStorage.getItem('nbloopBeforeReload');  
      htmlCodeConfigDiv    +=  '<tr><td><input type="range" style="vertical-align:middle;margin:2px;width:150px;"';      
      htmlCodeConfigDiv    +=  'id="NbloopBeforeReload" name="NbloopBeforeReload" min="3" max="15" step="1" value="' + nbloopBeforeReload + '"';       
      htmlCodeConfigDiv    +=  'oninput=" this.parentElement.nextElementSibling.nextElementSibling.innerText = this.value; ';          
      htmlCodeConfigDiv    +=  '          localStorage.setItem(\'nbloopBeforeReload\',this.value);';
      htmlCodeConfigDiv    +=  '          nbloopBeforeReload = this.value;">';  
      htmlCodeConfigDiv    += '<td title="Nombre de fois où un lag est détecté avant de recharger la page">nbloopBeforeReload';
      htmlCodeConfigDiv    += '<td>' + nbloopBeforeReload;    
      
      if ( 'nbloopBeforeBegin' in localStorage ) nbloopBeforeBegin = localStorage.getItem('nbloopBeforeBegin');  
      htmlCodeConfigDiv    +=  '<tr><td><input type="range" style="vertical-align:middle;margin:2px;width:150px;"';      
      htmlCodeConfigDiv    +=  'id="NbloopBeforeBegin" name="NbloopBeforeBegin" min="1" max="15" step="1" value="' + nbloopBeforeBegin + '"';       
      htmlCodeConfigDiv    +=  'oninput=" this.parentElement.nextElementSibling.nextElementSibling.innerText = this.value; ';          
      htmlCodeConfigDiv    +=  '          localStorage.setItem(\'nbloopBeforeBegin\',this.value);';
      htmlCodeConfigDiv    +=  '          nbloopBeforeBegin = this.value;">';  
      htmlCodeConfigDiv    += '<td title="Nombre de fois où la fonction de recherche des erreurs s\'éxécute avant de prendre en compte les lags">nbloopBeforeBegin';
      htmlCodeConfigDiv    += '<td>' + nbloopBeforeBegin;      
      
      if ( 'mainLoopDelay' in localStorage ) mainLoopDelay = localStorage.getItem('mainLoopDelay');  
      htmlCodeConfigDiv    +=  '<tr><td><input type="range" style="vertical-align:middle;margin:2px;width:150px;"';      
      htmlCodeConfigDiv    +=  'id="MainLoopDelay" name="MainLoopDelay" min="3" max="15" step="1" value="' + mainLoopDelay/1000 + '"';       
      htmlCodeConfigDiv    +=  'oninput=" this.parentElement.nextElementSibling.nextElementSibling.innerText = this.value; ';          
      htmlCodeConfigDiv    +=  '          localStorage.setItem(\'mainLoopDelay\',this.value*1000);';
      htmlCodeConfigDiv    +=  '          mainLoopDelay = this.value*1000;">';  
      htmlCodeConfigDiv    += '<td title="Délai entre deux éxécution de la fonction de recherche des erreurs , besoin de rafraîchir la page">mainLoopDelay';
      htmlCodeConfigDiv    += '<td>' +  mainLoopDelay/1000;          
        
      if ( 'fullScreenAutoAtStart' in localStorage ) fullScreenAutoAtStart = localStorage.getItem('fullScreenAutoAtStart');  
      htmlCodeConfigDiv    +=  '<tr><td><input type="range" style="vertical-align:middle;margin:2px;width:150px;"';      
      htmlCodeConfigDiv    +=  'id="fullScreenAutoAtStart" name="fullScreenAutoAtStart" min="0" max="1" step="1" value="' + fullScreenAutoAtStart + '"';       
      htmlCodeConfigDiv    +=  'oninput=" this.parentElement.nextElementSibling.nextElementSibling.innerText = this.value; ';          
      htmlCodeConfigDiv    +=  '          localStorage.setItem(\'fullScreenAutoAtStart\',this.value);';
      htmlCodeConfigDiv    +=  '          fullScreenAutoAtStart = this.value;">';  
      htmlCodeConfigDiv    += '<td title="Plein ecran auto">Plein ecran auto';
      htmlCodeConfigDiv    += '<td>' +  fullScreenAutoAtStart;      
         
      if ( 'delayBeforeHide' in localStorage ) delayBeforeHide = localStorage.getItem('delayBeforeHide');  
      htmlCodeConfigDiv    +=  '<tr><td><input type="range" style="vertical-align:middle;margin:2px;width:150px;"';      
      htmlCodeConfigDiv    +=  'id="DelayBeforeHide" name="DelayBeforeHide" min="3" max="15" step="1" value="' + delayBeforeHide/1000 + '"';       
      htmlCodeConfigDiv    +=  'oninput=" this.parentElement.nextElementSibling.nextElementSibling.innerText = this.value; ';          
      htmlCodeConfigDiv    +=  '          localStorage.setItem(\'delayBeforeHide\',this.value*1000);';
      htmlCodeConfigDiv    +=  '          delayBeforeHide = this.value*1000;">';  
      htmlCodeConfigDiv    += '<td title="Délai avant de cacher le menu et les vignettes">delayBeforeHide';
      htmlCodeConfigDiv    += '<td>' +  delayBeforeHide/1000;          
        
      htmlCodeConfigDiv    += '<tr><td colspan=3 style="text-align:center;">Si les variables ne sont pas prises en compte <br>Fermer et ouvrir de nouveau l\'interface';  
      
      htmlCodeConfigDiv    += "</table>"; 
        
      htmlCodeConfigDiv    += '<div class="container-close-btn">';
      htmlCodeConfigDiv    += '<button id="close-btn-configInterface" class="close-btn" title="Fermer" ';
      htmlCodeConfigDiv    += '>&times;</button>';       
      htmlCodeConfigDiv    += '</div>';  
        
      var div = document.createElement("div");                                                                                      // Création de l'élément
      div.style.top            = "20vh";                                                                                            // Position verticale de l'élément  
      div.style.width          = "100%";                                                                                            // Largeur de l'élément
      div.style.maxHeight      = "70vh";                                                                                            // Hauteur maximale de l'élément
      div.style.overflowY      = "auto";                                                                                            // Pour scroll
      div.style.position       = "fixed";                                                                                           // Type de position de l'élément  
      div.style.color          = "white";                                                                                           // Couleur de la police du texte (blanc) 
      div.style.fontSize       = "16px";                                                                                            // Taille de la police du texte 
      div.style.zIndex         = zindex2;                                                                                           // Mettre au premier plan l'élément    
      div.style.display        = "flex";                                                                                            // L'élément est flexible
      div.style.justifyContent = "center";                                                                                          // Style du contenu
      div.setAttribute('id', 'ConfigDiv');                                                                                          // Définir un id pour retrouver l'élément      
      div.innerHTML            = htmlCodeConfigDiv;                                                                                 // Texte de l'élément   
      
      var fullScreenElement = document.fullscreenElement;                                                                           // Quel élément est en plein écran
        
      if ( fullScreenElement != null )                                                                                              // Si un élément est en plein écran
         fullScreenElement.insertBefore(div,fullScreenElement.firstChild);                                                          // Insérer le div avant le premier enfant
      else                                                                                                                          // Pas d'élément en plein écran
         document.body.appendChild(div);                                                                                            // Ajouter l'élément 
      
      document.getElementById("close-btn-configInterface").addEventListener('click', function() { configInterface(); });   
     
      document.getElementById("TDFixLogs").onclick =  function() {                                                                  // Ajout d'une fonction qui conserve les logs les plus récents
                                                                 var trueNbLoggedErrors = 0;
        
                                                                 for (i = 0; i < localStorage.length; i++)                          // Parcourir les variables stockées 
                                                                     if ( localStorage.key(i).includes('ErrorLogged'))              // En particulier celle ayant pour nom ErrorLogged
                                                                        trueNbLoggedErrors++;
        
                                                                 if ( nbLoggedErrors < trueNbLoggedErrors)                          // Si il y a plus d'erreurs stockées que la nouvelle valeur définie                                                                           
                                                                    { 
                                                                    for ( l=1 ; l<=nbLoggedErrors ; l++)                            // Remplacement des valeurs les plus anciennes
                                                                        {    
                                                                        let index = l+trueNbLoggedErrors-nbLoggedErrors;
                                                                        localStorage.setItem('ErrorLogged'+l, localStorage.getItem('ErrorLogged'+index ) );    
                                                                        } 
                                                                    for ( l= Number(nbLoggedErrors) + 1; l<=trueNbLoggedErrors ; l++)// Chercher les erreurs en trop et les supprimer    
                                                                        localStorage.removeItem('ErrorLogged'+l);    
                                                                    } 
                                                                 };   
        
      configDivAdded = true;                                                                                                        // Variable indiquant que le div config est affiché        
      } 
   else                                                                                                                             // Si div config est affiché
      { 
      document.getElementById("ConfigDiv").remove();                                                                                // Suppression du div config
      configDivAdded = false;                                                                                                       // Variable indiquant que le div config n'est pas affiché
      }       
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function prog(change)                                                                                                               // Fonction
{ 
if ( change == "plus" )                                                                    
   {
   let needIndex = 0; 
   var currentChannelNumber = window.location.href.replace('https://tv.sfr.fr/direct-tv/','').replace(";play=true", "");            // Obtenir le nombre à la fin de l'url  
     
   for ( var i=0; i<channelsInfos2.length/dataStep; i++ )                                                                           // Parcourir le tableau        
           
        if ( channelsInfos2[dataStep*i+3] == currentChannelNumber )                                                                 // Si la chaine est trouvée
           { 
           let channelfound = false;
           for ( var j=i+1; j<channelsInfos2.length/dataStep; j++ )    
               {
               if ( channelsInfos2[dataStep*j+4] == '1' ) 
                  { 
                  if ( (j+1) < channelsInfos2.length/dataStep )                                                                     // Si on ne dépasse la fin du tableau             
                     { 
                     window.location.href = 'https://tv.sfr.fr/direct-tv/'+channelsInfos2[dataStep*j+3] ;                           // Chargement de la prochaine chaine      
                     channelfound = true;
                     } 
                  break;
                  }           
              }  
             
           if ( channelfound == false )
              {
              window.location.href = 'https://tv.sfr.fr/direct-tv/'+channelsInfos2[0+3] ;                                           // Fin du tableau atteinte , chargement de la première chaine    
              break;
              } 
             
           break;  
           }   
   }  
  
if ( change == "moins")                                                                   
   {  
   let needIndex = 0; 
   var currentChannelNumber = window.location.href.replace('https://tv.sfr.fr/direct-tv/','').replace(";play=true", "");            // Obtenir le nombre à la fin de l'url
   for ( var i=0; i<channelsInfos2.length/dataStep; i++ )                                                                           // Parcourir le tableau        
       if ( channelsInfos2[dataStep*i+3] == currentChannelNumber )                                                                  // Si la chaine est trouvée
           { 
           let channelfound = false;
           for ( var j=i-1; j>=0; j-- )    
               {
               if ( channelsInfos2[dataStep*j+4] == '1' ) 
                  { 
                  if ( (j) >= 0 )                                                                                                   // Si l'index n'est pas négatif              
                     { 
                     window.location.href = 'https://tv.sfr.fr/direct-tv/'+channelsInfos2[dataStep*j+3] ;                           // Chargement de la chaine précédente    
                     channelfound = true;
                     } 
                  break;
                  }           
               }  
             
           if ( channelfound == false )        
              for ( var j=channelsInfos2.length/dataStep; j>=0; j-- )                
                  if ( channelsInfos2[dataStep*j+4] == '1' ) 
                     {
                     window.location.href = 'https://tv.sfr.fr/direct-tv/'+channelsInfos2[dataStep*j+3];                            // Début du tableau atteint , chargement de la dernière chaine     
                     break;
                     }
           break;  
           }  
   }   
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function volume(change)                                                                                                             // Fonction
{
var elementShakaPlayerVideo = document.getElementById("shaka-player-video");                                                        // Trouver l'élément vidéo
var videoVolume = elementShakaPlayerVideo.volume;                                                                                   // Trouver le volume de l'élément vidéo (0-1)
if ( 'volumeStep' in localStorage )   volumeStep = localStorage.getItem('volumeStep');                                              // Si volumeStep existe dans localStorage , assignation d'une valeur                                                                                            
         
showVolume = 0;    
  
if ( change == "plus" )                                                                    
   { 
   if ( videoVolume + volumeStep/100 > 1 ) elementShakaPlayerVideo.volume = 1;                                                      // Mettre le volume à 100% si le nouveau volume est supérieur à un
   else                                    elementShakaPlayerVideo.volume = (videoVolume+volumeStep/100).toFixed(2);                // Augmenter le volume   
   showVolume = 1; 
   }       
  
if ( change == "moins")                                                                   
   {  
   if ( videoVolume - volumeStep/100 > 0 ) elementShakaPlayerVideo.volume = (videoVolume-volumeStep/100).toFixed(2);                // Diminuer le volume si le nouveau volume est supérieur à zéro
   else                                    elementShakaPlayerVideo.volume = 0;                                                      // Sinon mettre le volume à zéro      
   showVolume = 1;
   }  

  
if ( change != "plus" && change != "moins")                                                                                         // Ni plus, ni moins
   change = parseFloat(change);                                                                                                     // Chaine en nombre
  
if ( typeof change === 'number' && !Number.isNaN(change) )                                                                          // La valeur 'change' est un nombre ?                                                              
   { 
   elementShakaPlayerVideo.volume = change/100;                                                                                     // Definir le volume   
   showVolume = 1;
   }  
  
if ( showVolume == "1")   
   { 
   var divVolume =  document.getElementById('DivVolume');                                                                           // Variable pour le div avec l'id "DivVolume"
   
   if ( typeof(divVolume) == 'undefined' || divVolume == null )                                                                     // Chercher si le div avec l'id "DivVolume" existe
      {
      var div = document.createElement("div");                                                                                      // Création de l'élément
      div.style.top            = "3.3em";                                                                                           // Position verticale de l'élément  
      div.style.left           = "1em";                                                                                             // Position horizontale de l'élément
      div.style.background     = "rgba(251, 242, 221, 1)";                                                                              // Opacité de l'élément
      div.style.position       = "fixed";                                                                                           // Type de position de l'élément  
      div.style.color          = "black";                                                                                           // Couleur de la police du texte (blanc) 
      div.style.fontSize       = "1.5em";                                                                                           // Taille de la police du texte 
      div.style.textAlign      = "center";                                                                                          // Position du texte de l'élément     
      div.style.zIndex         = zindex3;                                                                                           // Mettre au premier plan l'élément
      div.style.border         = "5px solid red";                                                                               // Encadrer
      div.style.borderRadius   = "10px";
      div.style.padding        = "0.3em";                                                                                           // Marge intérieure
      div.innerHTML            = "Vol: " + Math.trunc(100*elementShakaPlayerVideo.volume) + "%";                                    // Texte de l'élément  
      div.setAttribute('id', 'DivVolume');                                                                                          // Définir un id pour retrouver l'élément     

      var fullScreenElement = document.fullscreenElement;                                                                           // Quel élément est en plein écran
        
      if ( fullScreenElement != null)                                                                                               // Si un élément est en plein écran
         fullScreenElement.insertBefore(div,fullScreenElement.firstChild);                                                          // Insérer le tableau avant le premier enfant              
      else                                                                                                                          // Pas d'élément en plein écran
         document.body.appendChild(div);                                                                                            // Ajouter l'élément              
      
      setTimeout(function () { document.getElementById('DivVolume').remove(); } ,volumeDelay);                                      // Fonction qui attend avant d'effacer l'indicateur de volume   
      }      
   else                                                                                                                             // Sinon le div existe 
      divVolume.innerHTML = "Vol: " + Math.trunc(100*elementShakaPlayerVideo.volume) + "%";                                         // Texte de l'élément    
   }    
  
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function myMenu()                                                                                                                   // Fonction
{       
if ( !document.getElementById("divMyMenu") )
   {
   var div = document.createElement("div");    
       div.style.zIndex     = zindex4;
       div.setAttribute('id', 'divMyMenu');
     
   var fullScreenElement = document.fullscreenElement;                                                                           // Quel élément est en plein écran
   
   if ( fullScreenElement != null)                                                                                               // Si un élément est en plein écran
      fullScreenElement.insertBefore(div,fullScreenElement.firstChild);                                                          // Insérer le div avant le premier enfant
   else                                                                                                                          // Pas d'élément en plein écran
      document.body.appendChild(div);                                                                                            // Ajouter l'élément   
   
   setTimeout( () => { delMenu(); },delayBeforeHide);                                                                            // Cacher menu ( liste, plein écran, ... )
   }   
  
/////////////////////////////////////////////
if ( !document.getElementById("divMyMenuA") )
   {
   var div = document.createElement("div");    
       div.setAttribute('id', 'divMyMenuA'); 
   document.getElementById("divMyMenu").appendChild(div); 
   }
     
if ( !document.getElementById("divMyMenuB") )
   {
   var div = document.createElement("div");    
       div.setAttribute('id', 'divMyMenuB'); 
   document.getElementById("divMyMenu").appendChild(div); 
   }    
  
/////////////////////////////////////////////   
const tabmenu = [ 
                  [1,channels_img,listChannels],
                  [2,fullscreen_img,toogleFullScreen],
                  [3,config_img,configInterface],
                  [4,channels_settings_img,configListChannels],                   
                  [5,logs_img,showLogs]
                ];

for ( let i = 0; i < tabmenu.length; i++ ) 
    {  
    if ( !document.getElementById("divMyMenu" + tabmenu[i][0]) ) 
       {
       const img = document.createElement('img');
             img.src = tabmenu[i][1];  
             img.setAttribute('class','divmenuchildsimg');
     
       const div = document.createElement("div");   
             div.setAttribute('id'   ,'divMyMenu'+tabmenu[i][0]); 
             div.setAttribute('class','divmenuchilds');        
         
       div.onclick = (function(index) {
                                            return function() {
                                                              tabmenu[index][2]();  // Appeler la fonction
                                                              delMenu();
                                                              };
                                       })(i);
         
       document.getElementById("divMyMenuA").appendChild(div);  
       document.getElementById("divMyMenu"+tabmenu[i][0]).appendChild(img); 
       }
    }  
  
/////////////////////////////////////////////
if ( !document.getElementById("divMyMenu6") )
   {
   const currentVolume = Math.trunc(100*document.getElementById("shaka-player-video").volume);  
   
   var inputHTML  = '<input id="rangeVolume" type="range" min="0" max="100" step="10" value="'+currentVolume+'"';
       inputHTML += ' style="writing-mode: vertical-lr; direction: rtl; height: 50vh; width: 40px; background: #9bf00b;">';  
       inputHTML += '<div style="height: 50vh; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; font-size: 14px; color: #4a86e8;">';
       inputHTML += '<span>100</span>';
       inputHTML += '<span>80</span>';
       inputHTML += '<span>60</span>';
       inputHTML += '<span>40</span>';
       inputHTML += '<span>20</span>';
       inputHTML += '<span>0</span>';
       inputHTML += '</div>'; 

   var div = document.createElement("div");   
       div.innerHTML = inputHTML;                                                        
       div.setAttribute('id','divMyMenu6'); 
       div.setAttribute('class','divmenuchilds');
     
   document.getElementById("divMyMenuB").appendChild(div);  
   document.getElementById("rangeVolume").addEventListener("input", function() { volume(this.value); });    
   }   
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function delMenu()                                                                                                                 // Fonction éxécutée lorsqu'une touche est relachée
{  
if ( document.getElementById("divMyMenu") ) document.getElementById("divMyMenu").remove();   
} 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mykeyupFunc(event)                                                                                                         // Fonction éxécutée lorsqu'une touche est relachée
{    
  
if ( window.location.href.includes('tv.sfr.fr/direct-tv/') )                                                                        // Si l'url est un live
   {   
   if ( event.code === "NumpadEnter"    || event.code === "ControlLeft" ) listChannels();
   if ( event.code === "NumpadDecimal"  || event.code === "ShiftLeft" )   toogleFullScreen();
   if ( event.code === "NumpadAdd"      || event.code === "ArrowRight" )  prog("plus"); 
   if ( event.code === "NumpadSubtract" || event.code === "ArrowLeft" )   prog("moins");     
   if ( event.code === "ArrowUp" )                                        volume("plus"); 
   if ( event.code === "ArrowDown" )                                      volume("moins");   
   if ( event.key === "c" )                                               configInterface(); 
   if ( event.key === "v" )                                               configListChannels();
   if ( event.key === "l" )                                               showLogs();
   }    
  
                                                                                                                                    // Changement de chaines
if ( window.location.href.includes('tv.sfr.fr/direct-tv/') || window.location.href.includes('https://www.sfr.fr/cas/login') )       // Si l'url est un live ou la page de connexion  
if ( event.code === "Numpad0" || event.code === "Numpad1" || event.code === "Numpad2" || event.code === "Numpad3"                   // Si la touche relachée est une touche du pavé numérique (0-9)  
                              || event.code === "Numpad4" || event.code === "Numpad5" || event.code === "Numpad6"   
                              || event.code === "Numpad7" || event.code === "Numpad8" || event.code === "Numpad9" 
   ||
   event.code === "Digit0"    || event.code === "Digit1" || event.code === "Digit2" || event.code === "Digit3"                      // Si la touche relachée est un chiffre (0-9)  
                              || event.code === "Digit4" || event.code === "Digit5" || event.code === "Digit6"   
                              || event.code === "Digit7" || event.code === "Digit8" || event.code === "Digit9"    
   
   )  
   {
   var divInputKeys =  document.getElementById('DivInputKeys');                                                                     // Variable pour le div avec l'id "DivInputKeys"
   
   if ( typeof(divInputKeys) == 'undefined' || divInputKeys == null )                                                               // Chercher si le div avec l'id "DivInputKeys" existe
      {
      var div = document.createElement("div");                                                                                      // Création de l'élément
      div.style.top            = "1em";                                                                                             // Position verticale de l'élément  
      div.style.left           = "1em";                                                                                             // Position horizontale de l'élément
      div.style.background     = "rgba(251, 242, 221, 1)";                                                                              // Opacité de l'élément
      div.style.position       = "fixed";                                                                                           // Type de position de l'élément  
      div.style.color          = "black";                                                                                           // Couleur de la police du texte (blanc) 
      div.style.fontSize       = "1.5em";                                                                                           // Taille de la police du texte 
      div.style.textAlign      = "center";                                                                                          // Position du texte de l'élément     
      div.style.zIndex         = zindex3;                                                                                           // Mettre au premier plan l'élément
      div.style.border         = "5px solid red";                                                                               // Encadrer
      div.style.borderRadius   = "10px";
      div.style.padding        = "0.3em";                                                                                           // Marge intérieure
      div.innerHTML            =  event.code.replace('Numpad','').replace('Digit','');                                              // Texte de l'élément  
      div.setAttribute('id', 'DivInputKeys');                                                                                       // Définir un id pour retrouver l'élément     

      var fullScreenElement = document.fullscreenElement;                                                                           // Quel élément est en plein écran
      if ( fullScreenElement != null)                                                                                               // Si un élément est en plein écran
         fullScreenElement.insertBefore(div,fullScreenElement.firstChild);                                                          // Insérer le tableau avant le premier enfant
      else                                                                                                                          // Pas d'élément en plein écran
         document.body.appendChild(div);                                                                                            // Ajouter l'élément              
        
      inputKeys = event.code.replace('Numpad','').replace('Digit','');                                                              // Supression de Numpad ou  Digit
      }      
   else                                                                                                                             // Sinon le div existe et une nouvelle touche est relachée
      {
      divInputKeys.innerHTML += event.code.replace('Numpad','').replace('Digit','');                                                // Texte de l'élément   
      inputKeys += event.code.replace('Numpad','').replace('Digit','');                                                             // Supression de Numpad
      }   
   
   setTimeout(function () {                                                                                                         // Fonction qui attend avant de changer la chaine     
                          var channelfound = false;                                                                                 // Variable définition     

                          if ( !window.location.href.includes('https://www.sfr.fr/cas/login'))                                      // Si ce n'est pas la page de connexion  
                             {
                             for ( var c=0; c<channelsInfos2.length/dataStep; c++ )                                                 // Boucle                                                                                                                   
                                 if ( inputKeys == channelsInfos2[dataStep*c+1] )                                                   // Correspondance entrée utilisateur et canal
                                    {
                                    window.location.href = 'https://tv.sfr.fr/channel/' + inputKeys;                                // Chargement de la chaine
                                    channelfound = true;                                                                            // La chaine a été trouvée
                                    break;                                                                                          // Casser la boucle
                                    }  
                                                                
                             if ( channelfound == false )                                                                           // Si la chaine n'a pas été trouvée
                                {        
                                divInputKeys.innerHTML= "Pas de chaine";                                                            // Indicateur visuel
                                setTimeout(function () { document.getElementById('DivInputKeys').remove(); } ,inputKeysDelay) ;     // Effacer l'Indicateur visuel
                                }   
                             }          
                                                             
                          if ( window.location.href.includes('https://www.sfr.fr/cas/login?service=https'))                         // Si c'est la page de connexion (redirection depuis une chaine tv)  
                             {
                             console.log("----- login");  
                             if ( inputKeys == "0000" )                                                                             // L'utilisateur a saisi 0000
                                {  
                                 localStorage.removeItem("myUserName");                                                             // Effacer le nom ou l'email enregistré
                                 localStorage.removeItem("myPassword");                                                             // Effacer le mot de passe enregistré
                                 divInputKeys.innerHTML= "LocalStorage effacé";                                                     // Indicateur visuel
                                 setTimeout(function () { document.getElementById('DivInputKeys').remove(); } ,inputKeysDelay) ;    // Effacer l'Indicateur visuel
                                }       
                          
                             if ( inputKeys == "0001" && prompted == false )                                                        // L'utilisateur a saisi 0001
                                {
                                prompted = true;                                                                                    // Variable sur vrai
                                var getInputUsername = prompt("Enter your username or your email:");                                // Afficher une invite de saisie pour le nom ou l'email
                                localStorage.setItem("myUserName",getInputUsername);                                                // Enregistrer 
                                var getInputPassword = prompt("Enter your password :");                                             // Afficher une invite de saisie pour le mot de passe
                                localStorage.setItem("myPassword",getInputPassword);                                                // Enregistrer
                                //prompted = false;                                                                                 // Variable sur faux
                                }    
  
                             if ( inputKeys == "0002" )                                                                             // L'utilisateur a saisi 0002
                                {
                                 var textFromLocalStorage = "";                                                                     // Variable définition
                                 textFromLocalStorage += localStorage.getItem("myUserName");                                        // Variable , ajouter le nom ou l'email
                                 textFromLocalStorage += '  / ';                                                                    // Variable 
                                 textFromLocalStorage += localStorage.getItem("myPassword");                                        // Variable , ajouter le mot de passe
                                 divInputKeys.innerHTML= textFromLocalStorage;                                                      // Afficher les infos utilisateur
                                 //inputKeys = "";
                                 setTimeout(function () { document.getElementById('DivInputKeys').remove(); } ,inputKeysDelay) ;    // Effacer l'Indicateur visuel
                                }      
                             } 
     
                          } ,inputKeysDelay) ;      
   } 
}   
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function searchErrorFunc()                                                                                                          // Fonction qui contrôle l'apparition des erreurs
{     
// createDivVideoState();                                                                                                           // Afficher l'état du lecteur vidéo  
window.document.body.addEventListener('keyup', mykeyupFunc);                                                                        // Gestion des touches 
var connectState = false;   
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if ( !window.location.href.includes('https://www.sfr.fr/cas/login?service=https') )  
   if ( document.getElementsByTagName("gen8-profile").length > 0 )
      {
      if ( document.getElementsByTagName("gen8-profile")[0].getAttribute("pn") == "Se connecter" )
         {
         myLog("Se connecter");
         document.getElementsByTagName("gen8-profile")[0].children[0].click();
         }
      else connectState = true;           
      }
   else
      {
      myLog("No profile");                                                                                                          // Log Fonction                     
      setTimeout( () => { location.reload(); },1000);      
      }    
  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if ( window.location.href.includes('https://www.sfr.fr/cas/login?service=https'))                                                   // Si c'est une redirection vers la connexion ( 1ère visite du site , session expirée )
   { 
   if ( 'myUserName' in localStorage  && 'myPassword' in localStorage ) 
      {
      if ( document.getElementById("username").getAttribute("type") != "hidden" )   
         document.getElementById("username").value = localStorage.getItem('myUserName');                                            // Remplir le mail de l'utilisateur
        
      document.getElementById("password").value = localStorage.getItem('myPassword');                                               // Remplir le mot de passe
        
      setTimeout(function () { document.getElementById("identifier").click(); } ,1500) ;                                            // Attendre x secondes et simuler l'appui sur le bouton
      }              
   }   
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var Overlay = document.getElementsByClassName("cdk-overlay-backdrop app-modal-backdrop cdk-overlay-backdrop-showing");              // Tableau pointant vers l'overlay     
if ( Overlay.length > 0 )  
   {
   if ( document.querySelector(".cdk-overlay-backdrop.app-modal-backdrop.cdk-overlay-backdrop-showing web-modal-header") !== null )
       myLog(document.querySelector(".cdk-overlay-backdrop.app-modal-backdrop.cdk-overlay-backdrop-showing web-modal-header").textContent.trim());   // Texte du '<web-modal-header' (enfant de l'overlay à deux classes)
     
   if ( document.querySelector(".cdk-overlay-backdrop.app-modal-backdrop.cdk-overlay-backdrop-showing .modal__title") !== null)
      {
      myLog(document.querySelector(".cdk-overlay-backdrop.app-modal-backdrop.cdk-overlay-backdrop-showing .modal__title").textContent.trim());   // Texte du '<div class="modal__title"' (enfant de l'overlay à deux classes)
      if ( document.querySelector(".cdk-overlay-backdrop.app-modal-backdrop.cdk-overlay-backdrop-showing .modal__title").textContent.trim() == "Session expirée" )
         sessionExpired == true;
      } 
   setTimeout( () => { location.reload(); },1000);    
   }    
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if ( connectState == true )                                                                                                         // Si l'utilisateur est connecté 
if (    window.location.href.includes('https://tv.sfr.fr/content/') 
     || window.location.href.includes('https://tv.sfr.fr/direct-tv/')                                                               // Si l'url est un live ou un replay   
   )
   {      
   if ( oldUrl != window.location.href && oldUrl != "")                                                                             // Fix lors de l'utilisation de l'interface utilsateur originale (les chaines)
      FirstTimeScriptIsLoaded = true; 
  
   if ( FirstTimeScriptIsLoaded == true )                                                                                           // Si la variable est définie sur vrai
      {   
        
      if ( 'fullScreenAutoAtStart' in localStorage ) fullScreenAutoAtStart = localStorage.getItem('fullScreenAutoAtStart');         // Modifier la variable si elle est stockée
      if ( fullScreenAutoAtStart == 1 ) toogleFullScreen();                                                                         // Passage en mode écran si elle vaut 1        
      
      if ( 'delayBeforeHide' in localStorage ) delayBeforeHide = localStorage.getItem('delayBeforeHide');                           // Modifier la variable si elle est stockée
        
      oldUrl = window.location.href;                                                                                                // Fix lors de l'utilisation de l'interface utilsateur originale (les chaines)
      createRedDivFunc();                                                                                                           // Appel de la fonction qui crée le bandeau rouge  
      FirstTimeScriptIsLoaded = false;
      window.addEventListener("keydown",                                                                                            // Désactiver scroll clavier (besoin pour le volume)
                           function(e) { if ( ["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1 ) e.preventDefault(); }, false);
    
      mainLoopStartTime = Date.now();                                                                                               // Timestamp (nb secondes depuis le 01/01/70) de la 1ère exécution
      video = document.getElementById("shaka-player-video");  //document.querySelector('video');                                    // Trouver le lecteur         
     
      if ( video !== null)                                                                                                          // Si le lecteur est trouvé 
         {    
         //console.log("video");  
         video.addEventListener('progress', () => { lastTimeVideoEventProgressEvent = Date.now(); });                               // Gestion des événements (Le lecteur reçoit des données) Récupération du timestamp
         video.addEventListener('play'    , () => { videoPlaying = 2; });                                                           // Gestion des événements (Le lecteur est en cours de lecture) 
         video.addEventListener('pause'   , () => { videoPlaying = 1; });                                                           // Gestion des événements (Le lecteur est en pause) 
         video.addEventListener('ended'   , () => { videoPlaying = 0; });                                                           // Gestion des événements (Le film est fini)     
           
         if ( 'volumeStart' in localStorage ) volumeStart = localStorage.getItem('volumeStart');                                    // Si la variable est stockée , remplacer celle par défaut
         video.volume = volumeStart;                                                                                                // Définir le volume du lecteur
         } 
        
      if ( 'nbLoggedErrors' in localStorage ) nbLoggedErrors = localStorage.getItem('nbLoggedErrors');                              // Si la variable est stockée , remplacer celle par défaut     
      }      
    
   if ( videoPlaying == 1 ) 
      {
      mainLoopStartTime = Date.now(); 
      lastTimeVideoEventProgressEvent = Date.now();           
      }     
     
   if ( videoPlaying == 2 ) 
      {   
      // nothing
      }          
     
   if ( 'nbloopBeforeBegin' in localStorage )  nbloopBeforeBegin  = localStorage.getItem('nbloopBeforeBegin');                      // Si la variable est stockée , remplacer celle par défaut
   if ( 'nbloopBeforeReload' in localStorage ) nbloopBeforeReload = localStorage.getItem('nbloopBeforeReload');                     // Si la variable est stockée , remplacer celle par défaut
     
     
                                                                                                                                    // Cette partie sert à regarder les dates où le lecteur envoye l'événement "progress"   
   if (    debugMode != 1                                                                                                            
        && videoPlaying == 2                                                                                                        // Le lecteur est en cours de lecture , même figé ? (pas en pause ou pas atteint la fin)
        && sessionExpired == false                                                                                                  // Une session expirée -> connexion
        && lastTimeVideoEventProgressEvent != 0                                                                                     // Après une session expirée , sans auto-login ,  le lecteur ne peut pas démarrer
        && Date.now() > lastTimeVideoEventProgressEvent + nbloopBeforeReload*mainLoopDelay                                          // Durée écoulée ?
        && Date.now() > mainLoopStartTime + nbloopBeforeBegin*mainLoopDelay )                                                       // Durée écoulée ? (pour les vieux coucous qui chargent lentement les pages)                               
       
      {                                                                            
      console.log('No progress since 3 loops , do something');                                                                      // Message console 
      
      if ( document.getElementsByClassName("modal__title")[0] )
         myLog("No progress " + document.getElementsByClassName("modal__title")[0].textContent );                                   // Log Fonction   
      else 
         myLog("No progress (No error)");                                                                                           // Log Fonction                    
         
      setTimeout( () => { location.reload(); },1000);                                                                               // Simple rechargement !, le lecteur semble gelé 
      }       
   else  
      {    
      //console.log('progress ' + lastTimeVideoEventProgressEvent); 
      }         
   }    
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if ( 'myChannelConfigStored' in localStorage )                                                                                      // Sauvegarde locale trouvée ?   
   {    
   // localStorage.removeItem("myChannelConfigStored");  
   // 2025/05 myChannelConfigStored: ffe9fe003125af020000870000600440000000000000000000000000000000000000000000000000000000000000000_00
   // 2025/06 myChannelConfigStored: fef0ff803125af0200008700000004400000000000000000000000000000000000000000000000000000000000000000_0
   // localStorage.setItem("myChannelConfigStored","fef0ff803125af0200008700000004400000000000000000000000000000000000000000000000000000000000000000_0");
     
   var myChannelConfigStored = localStorage.getItem("myChannelConfigStored");                                                       // Déclaration de variable 
   var myChannelConfigStoredTemp ="";                                                                                               // Déclaration de variable 
   var myChannelConfigStoredReverse ="";                                                                                            // Déclaration de variable 
   var zIndex = myChannelConfigStored.indexOf("_");                                                                                 // Déclaration de variable , chercher le _     
         
   if ( zIndex != '-1' ) myChannelConfigStoredTemp += ''+myChannelConfigStored.substr(0,zIndex);                                    // '_' trouvé , découpage de la config
   else myChannelConfigStoredTemp += ''+myChannelConfigStored;
           
   for ( h=0; h<myChannelConfigStoredTemp.length; h++)                                                                              // Boucle            
       {      
       let temp = parseInt(myChannelConfigStoredTemp[h], 16).toString(2);                                                           // Passage de l'héxadécimal au binaire  
       if ( temp.length == 1 ) temp = ''+'000'+ temp;                                                                               // Concaténation 
       if ( temp.length == 2 ) temp = ''+ '00'+ temp;                                                                               // Concaténation   
       if ( temp.length == 3 ) temp = ''+  '0'+ temp;                                                                               // Concaténation          
         
       myChannelConfigStoredReverse += ''+temp;                                                                                     // Concaténation
       }   
                           
   if ( zIndex != '-1' ) myChannelConfigStoredReverse += ''+myChannelConfigStored.substr(zIndex+1);                                 // Ajout des dernières chaines (max 3 car 4 -> valeur hex) 
        
   for ( var u=0; u<channelsInfos2.length/dataStep; u++ )                                                                           // Boucle    
       channelsInfos2[dataStep*u+4] = myChannelConfigStoredReverse.charAt(u);                                                       // Modification des valeurs du tableau avec la sauvegarde locale
   }  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if ( 'mainLoopDelay' in localStorage ) mainLoopDelay = localStorage.getItem('mainLoopDelay');                                       // Si la variable est stockée , remplacer celle par défaut
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("fullscreenchange", function(event) {                                                                     // Au passage du mode fenêtré ou plein écran 
  if ( document.fullscreenElement )                                                                                                 // les contrôles du lecteur et le pointeur de la souris sont cachés
     {
     if ( document.getElementsByTagName("player-controls-container")[0] )
        document.getElementsByTagName("player-controls-container")[0].style.visibility="hidden";
     document.body.style.cursor = 'none';
     }
  else 
     {
     if ( document.getElementsByTagName("player-controls-container")[0] )
        document.getElementsByTagName("player-controls-container")[0].style.visibility="visible";
     document.body.style.cursor = '';
     }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('mousemove', function(event) 
{   
if (event.pageX <= 10) myMenu();                                                                                                   // Vérifie si la souris est à moins de 10px du bord gauche
     
if ( document.fullscreenElement && waitForMouseMoveFunctionEnd == 0 )                                                              // Le mouvement de la souris fait apparaître les contrôles du lecteur
   {
   waitForMouseMoveFunctionEnd = 1;
   if ( document.getElementsByTagName("player-controls-container")[0] )
      {
      document.getElementsByTagName("player-controls-container")[0].style.visibility="visible";
      document.body.style.cursor = '';
      }
   setTimeout( () => { if ( document.fullscreenElement )
                          if ( document.getElementsByTagName("player-controls-container")[0] ) 
                             {  
                             document.getElementsByTagName("player-controls-container")[0].style.visibility="hidden";
                             document.body.style.cursor = 'none';
                             } 
                          waitForMouseMoveFunctionEnd = 0;
                     },5000);    
   }  
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
setInterval(searchErrorFunc, mainLoopDelay);                                                                                        // Eexécution sz la vérification toutes les 'mainloopDelay' ms        
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
if ( window.location.href.includes('https://tv.sfr.fr/direct-tv/')) 
if ( event.key === "z" )  
   {  
   var miniguide = document.getElementsByTagName("gen8-miniguide-item");
     
   for ( var i=0; i< miniguide.length; i++  )                                           
       {  
       var channelNameIndex = miniguide[i].children[1].children[0].title.lastIndexOf("sur ");  
       var channelName      = miniguide[i].children[1].children[0].title.substring(channelNameIndex+4);
         
       var channelNumber    = miniguide[i].children[0].children[0].innerHTML.replace(".","");       
       var channelUrl       = miniguide[i].children[1].children[0].children[0].href.replace("https://tv.sfr.fr/direct-tv/","");  
       var channelImg       = miniguide[i].children[1].children[0].children[0].children[0].children[1].children[0].src;     
         
       var canShow = "1";  
       if ( miniguide[i].children[0].children[1] )
          canShow = "0";       
    
       var temp = 'channelsInfos2.push(\''+channelName+'\',\''+channelNumber+'\',\''+channelImg+'\',\''+channelUrl+'\',\''+canShow+'\'); ';
       var isPresent     = 0;
       for ( var j=0; j< channelsInfos3.length; j++  ) 
           if ( channelsInfos3[j] == temp )
              isPresent = 1;
       if ( isPresent == 0)  
            channelsInfos3.push(temp);     
       }
    
   console.log( channelsInfos3.length );   
   }   
////////////////////////////////////////////////////////////////////////////////////////////   
if ( window.location.href.includes('https://tv.sfr.fr/direct-tv/')) 
if ( event.key === "e" )  
   {   
   console.log( channelsInfos3 ); 
   }
//////////////////////////////////////////////////////////////////////////////////////////// 
if ( window.location.href.includes('https://tv.sfr.fr/direct-tv/')) 
if ( event.key === "r" )  
   {  
   var channelsInfos4 = []; 
   for ( var i=0; i< channelsInfos2.length/dataStep; i++  )   
       for ( var j=0; j< channelsInfos3.length/2; j++  ) 
           if (  channelsInfos2[i*dataStep+1] ==  channelsInfos3[j*2] )
              {                
              channelsInfos4.push('channelsInfos2.push(\''+channelsInfos2[i*dataStep+0]+'\',\''+channelsInfos2[i*dataStep+1]+'\',\''+channelsInfos2[i*dataStep+2]+'\',\''+channelsInfos2[i*dataStep+3]+'\',\''+channelsInfos2[i*dataStep+4]+'\',\''+channelsInfos2[i*dataStep+5]+'\',\''+channelsInfos3[j*2+1]+'\'); ');                
              } 
   console.log( channelsInfos4 ); 
   }  
////////////////////////////////////////////////////////////////////////////////////////////    
*/


   /*  
   const currentVolume = Math.trunc(100*document.getElementById("shaka-player-video").volume);  
     
   const container = document.createElement("div");
         container.className = 'menu-volume-container';  
     
   const markersContainer = document.createElement("div");
         markersContainer.className = 'menu-volume-markers';
     
   [100, 80, 60, 40, 20, 0].forEach(value => {
                                             const span = document.createElement("span");
                                             span.textContent = value;
                                             markersContainer.appendChild(span);
                                             });
   
   const rangeInput           = document.createElement("input");
         rangeInput.id        = "rangeVolume";
         rangeInput.type      = "range";
         rangeInput.min       = "0";
         rangeInput.max       = "100";
         rangeInput.step      = "10";
         rangeInput.value     = currentVolume;
         rangeInput.className = 'menu-volume-range';
     
   //container.appendChild(markersContainer);
   container.appendChild(rangeInput);  
   container.appendChild(markersContainer);
     
   const div = document.createElement("div");
         div.id = "divMyMenu6";
         //div.className = 'divmenuchilds';
         div.appendChild(container);
     
   document.getElementById("divMyMenuB").appendChild(div);
     
   rangeInput.addEventListener("input", function() { volume(this.value); });
   */
  
   /*
   var inputHTML  = '<input id="rangeVolume" type="range" step="10" value="'+currentVolume+'" min="0" max="100" list="markers"'; // orient="vertical"
       inputHTML += 'style="background:#9bf00b;color:white;margin:0 auto; writing-mode:vertical-lr; direction:rtl; height:50vh; width:50px;">';

       inputHTML += '<datalist id="markers" style="display:flex; flex-direction:column; justify-content:space-between;">'; // writing-mode:vertical-lr;
       inputHTML += '<option value="100" label="100"></option>';
       inputHTML += '<option value="80"  label="80"></option>';
       inputHTML += '<option value="60"  label="60"></option>';
       inputHTML += '<option value="40"  label="40"></option>';
       inputHTML += '<option value="20"  label="20"></option>';
       inputHTML += '<option value="0"   label="0"></option>';       
       inputHTML += '</datalist>';
    */  