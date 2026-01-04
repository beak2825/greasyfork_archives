// ==UserScript==
// @name MAL-Sync (Deprecated on Greasyfork)
// @namespace https://greasyfork.org/users/92233
// @description Greasyfork version of Malsync has been deprecated please install from GitHub instead
// @version 0.9.99
// @author lolamtisch@gmail.com
// @license GPL-3.0
// @iconURL https://raw.githubusercontent.com/MALSync/MALSync/master/assets/icons/icon128.png
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_addStyle
// @grant GM_getResourceText
// @grant GM_notification
// @grant GM.xmlHttpRequest
// @grant GM.getValue
// @grant GM.setValue
// @match *://myanimelist.net/anime/*
// @match *://myanimelist.net/manga/*
// @match *://myanimelist.net/animelist/*
// @match *://myanimelist.net/mangalist/*
// @match *://myanimelist.net/anime.php?id=*
// @match *://myanimelist.net/manga.php?id=*
// @match *://myanimelist.net/character/*
// @match *://myanimelist.net/people/*
// @match *://myanimelist.net/search/*
// @match *://anilist.co/*
// @match *://kitsu.io/*
// @match *://simkl.com/*
// @match *://malsync.moe/mal/oauth*
// @match *://malsync.moe/pwa*
// @match *://*.9anime.to/watch/*
// @match *://*.9anime.ru/watch/*
// @match *://*.9anime.live/watch/*
// @match *://*.9anime.one/watch/*
// @match *://*.9anime.page/watch/*
// @match *://*.9anime.video/watch/*
// @match *://*.9anime.life/watch/*
// @match *://*.9anime.love/watch/*
// @match *://*.9anime.tv/watch/*
// @match *://*.9anime.app/watch/*
// @match *://*.9anime.at/watch/*
// @match *://*.9anime.bar/watch/*
// @match *://*.9anime.pw/watch/*
// @match *://*.9anime.cz/watch/*
// @match *://*.crunchyroll.com/*
// @match *://mangadex.org/*
// @match *://*.gogoanime.tv/*
// @match *://*.gogoanime.io/*
// @match *://*.gogoanime.in/*
// @match *://*.gogoanime.se/*
// @match *://*.gogoanime.sh/*
// @match *://*.gogoanime.video/*
// @match *://*.gogoanime.movie/*
// @match *://*.gogoanime.so/*
// @match *://*.gogoanime.ai/*
// @match *://*.gogoanime.vc/*
// @match *://*.gogoanime.pe/*
// @match *://*.gogoanimes.co/*
// @match *://*.animego.to/*
// @match *://*.branitube.net/video/*
// @match *://*.branitube.net/lista/*
// @match *://*.www.turkanime.tv/video/*
// @match *://*.www.turkanime.tv/anime/*
// @match *://*.www.turkanime.net/video/*
// @match *://*.www.turkanime.net/anime/*
// @match *://twist.moe/*
// @match *://app.emby.media/*
// @match *://app.emby.tv/*
// @match *://app.plex.tv/*
// @match *://www.netflix.com/*
// @match *://animepahe.com/play/*
// @match *://animepahe.com/anime/*
// @match *://animepahe.ru/play/*
// @match *://animepahe.ru/anime/*
// @match *://animepahe.org/play/*
// @match *://animepahe.org/anime/*
// @match *://*.animeflv.net/anime/*
// @match *://*.animeflv.net/ver/*
// @match *://jkanime.net/*
// @match *://vrv.co/*
// @match *://proxer.me/*
// @match *://proxer.net/*
// @match *://4anime.to/*
// @match *://*.animeultima.eu/a/*
// @match *://*.animeultima.to/a/*
// @match *://*.aniflix.tv/*
// @match *://www.animefreak.tv/watch/*
// @match *://www.animelab.com/*
// @match *://*.kickassanime.io/anime/*
// @match *://*.kickassanime.ru/anime/*
// @match *://*.kickassanime.rs/anime/*
// @match *://*.kickassanime.lol/anime/*
// @match *://*.kickassanime.ro/anime/*
// @match *://animekisa.tv/*
// @match *://*.wakanim.tv/*
// @match *://animeindo.net/*
// @match *://animeindo.moe/*
// @match *://shinden.pl/episode/*
// @match *://shinden.pl/series/*
// @match *://shinden.pl/titles/*
// @match *://shinden.pl/epek/*
// @match *://voiranime.com/*
// @match *://*.dubbedanime.net/*
// @match *://www.viz.com/*
// @match *://manganato.com/*
// @match *://readmanganato.com/*
// @match *://*.neko-sama.fr/*
// @match *://www.animezone.pl/odcinki/*
// @match *://www.animezone.pl/odcinek/*
// @match *://www.animezone.pl/anime/*
// @match *://anime-odcinki.pl/anime/*
// @match *://animeflix.io/*
// @match *://serimanga.com/*
// @match *://mangadenizi.com/*
// @match *://moeclip.com/*
// @match *://mangalivre.net/*
// @match *://tmofans.com/*
// @match *://lectortmo.com/*
// @match *://unionleitor.top/*
// @match *://unionmangas.top/*
// @match *://mangaplus.shueisha.co.jp/*
// @match *://*.japscan.ws/*
// @match *://goyabu.com/*
// @match *://*.animesvision.com.br/*
// @match *://*.animesvision.biz/*
// @match *://www.hulu.com/*
// @match *://www.hidive.com/*
// @match *://manga.fascans.com/manga/*
// @match *://*.primevideo.com/*
// @match *://mangakatana.com/manga/*
// @match *://*.manga4life.com/*
// @match *://bato.to/*
// @match *://dreamsub.cc/*
// @match *://mangapark.net/*
// @match *://animeshouse.net/episodio/*
// @match *://animeshouse.net/filme/*
// @match *://animexin.xyz/*
// @match *://monoschinos.com/*
// @match *://monoschinos2.com/*
// @match *://animefire.net/*
// @match *://otakufr.co/*
// @match *://samehadaku.vip/*
// @match *://*.tsukimangas.com/*
// @match *://mangatx.com/*
// @match *://tranimeizle.net/*
// @match *://www.tranimeizle.net/*
// @match *://anihub.tv/*
// @match *://www.animestreamingfr.fr/anime/*
// @match *://scantrad.net/*
// @match *://furyosquad.com/*
// @match *://www.animeid.tv/*
// @match *://animixplay.to/v*
// @match *://animixplay.to/anime/*
// @match *://myanimelist.net/anime/*/*/episode/*
// @match *://*.animesimple.com/*
// @match *://animeunity.it/anime/*
// @match *://*.mangahere.cc/manga/*
// @match *://*.fanfox.net/manga/*
// @match *://*.mangafox.la/manga/*
// @match *://justanime.app/*
// @match *://yayanimes.net/*
// @match *://desu-online.pl/*
// @match *://simplyaweeb.com/series/*
// @match *://simplyaweeb.com/manga/*
// @match *://animevibe.wtf/ani/*
// @match *://animemate.xyz/ani/*
// @match *://wuxiaworld.site/novel/*
// @match *://www.anime-on-demand.de/anime/*
// @match *://edelgardescans.com/*
// @match *://hatigarmscanz.net/*
// @match *://leviatanscans.com/*
// @match *://methodscans.com/*
// @match *://the-nonames.com/*
// @match *://reaperscans.com/*
// @match *://lynxscans.com/*
// @match *://skscans.com/*
// @match *://zeroscans.com/*
// @match *://reader.deathtollscans.net/*
// @match *://reader.kireicake.com/*
// @match *://sensescans.com/reader*
// @match *://manhuaplus.com/manga*
// @match *://readm.org/manga/*
// @match *://tioanime.com/anime/*
// @match *://tioanime.com/ver/*
// @match *://yugenani.me/*
// @match *://*.mangasee123.com/manga*
// @match *://*.mangasee123.com/read-online*
// @match *://animetribes.ru/watch/*
// @match *://*.okanime.com/animes/*
// @match *://*.okanime.com/movies/*
// @match *://*.okanime.tv/animes/*
// @match *://*.okanime.tv/movies/*
// @match *://bs.to/serie/*
// @match *://pantsubase.tv/anime/*
// @match *://pantsubase.tv/watch/*
// @match *://animeowl.net/*
// @match *://chill-game.com/*
// @match *://*.asurascans.com/*
// @match *://naniscans.com/*
// @match *://merakiscans.com/*
// @match *://an1me.nl/*
// @match *://mangajar.com/manga/*
// @match *://animedao.to/*
// @match *://*.otakustv.com/anime/*
// @match *://demo.komga.org/*
// @match *://animewho.com/*
// @match *://animesuge.io/anime/*
// @match *://toonily.net/manga/*
// @match *://fumetsu.pl/anime/*
// @match *://www.nonstopscans.com/*
// @match *://frixysubs.pl/odcinki.html?id=*
// @match *://frixysubs.pl/ogladaj.html?id=*
// @match *://guya.moe/*
// @match *://cubari.moe/*
// @match *://mangahub.io/*
// @match *://comick.fun/*
// @match *://*.anime-shitai.com/*
// @match *://kangaryu-team.fr/*
// @match *://www.japanread.cc/*
// @match *://catmanga.org/*
// @match *://mangasushi.net/manga*
// @match *://arangscans.com/manga*
// @match *://hunlight-scans.info/*
// @match *://tritinia.com/manga*
// @match *://readmanhua.net/manga*
// @match *://flamescans.org/*
// @match *://immortalupdates.com/manga*
// @match *://zoro.to/*
// @match *://www.funimation.com/shows/*
// @match *://www.funimation.com/*/shows/*
// @match *://kitsune.tv/*
// @match *://beta.kitsune.tv/*
// @match *://animesonline.org/*
// @match *://lhtranslation.net/*
// @match *://*.openload.co/*
// @match *://*.openload.pw/*
// @match *://*.streamango.com/*
// @match *://*.mp4upload.com/*
// @match *://*.mcloud.to/*
// @match *://*.mcloud2.to/*
// @match *://*.prettyfast.to/*
// @match *://*.rapidvideo.com/*
// @match *://*.rapidvid.to/*
// @match *://*.static.crunchyroll.com/*
// @match *://*.static.vrv.co/*
// @match *://*.vidstreaming.io/*
// @match *://*.vidstreaming.me/*
// @match *://*.xstreamcdn.com/*
// @match *://*.gcloud.live/*
// @match *://*.oload.tv/*
// @match *://*.mail.ru/*
// @match *://*.myvi.ru/*
// @match *://*.sibnet.ru/*
// @match *://*.tune.pk/*
// @match *://*.vimple.ru/*
// @match *://*.href.li/*
// @match *://*.vk.com/*
// @match *://*.cloudvideo.tv/*
// @match *://*.fembed.net/*
// @match *://*.fembed.com/*
// @match *://*.animeproxy.info/*
// @match *://*.feurl.com/*
// @match *://*.embedsito.com/v/*
// @match *://*.fcdn.stream/v/*
// @match *://*.fcdn.stream/e/*
// @match *://*.vaplayer.xyz/v/*
// @match *://*.vaplayer.xyz/e/*
// @match *://*.femax20.com/v/*
// @match *://*.femax20.com/e/*
// @match *://*.youpload.co/*
// @match *://*.yourupload.com/*
// @match *://*.vidlox.me/*
// @match *://*.kwik.cx/*
// @match *://*.mega.nz/*
// @match *://*.animeflv.net/*
// @match *://*.hqq.tv/*
// @match *://waaw.tv/*
// @match *://*.jkanime.net/*
// @match *://*.ok.ru/*
// @match *://*.novelplanet.me/*
// @match *://*.stream.proxer.me/*
// @match *://*.stream.proxer.net/*
// @match *://verystream.com/*
// @match *://*.animeultima.eu/e/*
// @match *://*.animeultima.eu/faststream/*
// @match *://*.animeultima.to/e/*
// @match *://*.animeultima.to/faststream/*
// @match *://*.vidoza.net/*
// @match *://crazyload.co/*
// @match *://gounlimited.to/*
// @match *://www.ani-stream.com/*
// @match *://flex.aniflex.org/public/dist/*
// @match *://animedaisuki.moe/embed/*
// @match *://*.wakanim.tv/*/*/*/embeddedplayer/*
// @match *://superitu.com/embed/*
// @match *://www.dailymotion.com/embed/*
// @match *://vev.io/embed/*
// @match *://vev.red/embed/*
// @match *://www.funimation.com/player/*
// @match *://jwpstream.com/jwps/yplayer.php*
// @match *://www.vaplayer.xyz/v/*
// @match *://mp4.sh/embed/*
// @match *://embed.mystream.to/*
// @match *://*.bitchute.com/embed/*
// @match *://*.streamcherry.com/embed/*
// @match *://*.clipwatching.com/*
// @match *://*.flix555.com/*
// @match *://*.vshare.io/v/*
// @match *://ebd.cda.pl/*
// @match *://*.replay.watch/*
// @match *://*.playhydrax.com/*
// @match *://hydrax.net/*
// @match *://*.hydracdn.network/*
// @match *://*.streamium.xyz/*
// @match *://animo-pace-stream.io/*
// @match *://*.pstream.net/e/*
// @match *://*.animefever.tv/embed/*
// @match *://*.haloani.ru/*
// @match *://*.moeclip.com/v/*
// @match *://*.moeclip.com/embed/*
// @match *://*.mixdrop.co/e/*
// @match *://*.mixdrop.to/e/*
// @match *://gdriveplayer.me/embed*
// @match *://sendvid.net/v/*
// @match *://sendvid.com/embed/*
// @match *://streamz.cc/*
// @match *://*.vidbm.com/embed-*
// @match *://*.vidbem.com/embed-*
// @match *://*.cloudhost.to/*/mediaplayer/*/_embed.php?*
// @match *://*.letsupload.co/*/mediaplayer/*/_embed.php?*
// @match *://player.mangakyo.me/stream/embed.php*
// @match *://streamtape.com/*
// @match *://streamtape.net/*
// @match *://streamtape.xyz/*
// @match *://streamtape.to/*
// @match *://strcloud.in/*
// @match *://strcloud.link/*
// @match *://streamta.pe/*
// @match *://strtape.tech/*
// @match *://reproductor.monoschinos.com/*
// @match *://uptostream.com/iframe/*
// @match *://easyload.io/e/*
// @match *://*.googleusercontent.com/gadgets/*
// @match *://animedesu.pl/player/desu.php?v=*
// @match *://*.animevibe.wtf/players/*.php*
// @match *://*.animemate.xyz/players/*.php*
// @match *://*.animixplay.to/api/live*
// @match *://third-party.animekisa.tv/player-*.php?*
// @match *://cloud9.to/e*/*
// @match *://*.okanime.com/cdn/*/embed/?*
// @match *://*.okgaming.org/I/*
// @match *://*.gogo-stream.com/streaming.php?*
// @match *://*.gogo-stream.com/load.php?*
// @match *://*.gogo-stream.com/loadserver.php?*
// @match *://*.gogo-play.net/streaming.php?*
// @match *://*.gogo-play.net/load.php?*
// @match *://*.gogo-play.net/loadserver.php?*
// @match *://*.gogo-play.tv/streaming.php?*
// @match *://*.gogo-play.tv/load.php?*
// @match *://*.gogo-play.tv/loadserver.php?*
// @match *://*.streamani.net/streaming.php?*
// @match *://*.streamani.net/load.php?*
// @match *://*.streamani.net/loadserver.php?*
// @match *://vivo.sx/embed/*
// @match *://ani.googledrive.stream/vidstreaming/*
// @match *://play.api-web.site/anime/*
// @match *://www.animelab.com/*
// @match *://vidstream.pro/e/*
// @match *://vidstreamz.online/embed/*
// @match *://vidstream.pro/embed/*
// @match *://streamsb.net/*
// @match *://streamsb.com/*
// @match *://sbembed.com/*
// @match *://sbvideo.net/*
// @match *://sbplay.org/*
// @match *://dood.to/*
// @match *://dood.watch/*
// @match *://doodstream.com/*
// @match *://vcdn.space/v/*
// @match *://youtube.googleapis.com/embed/*drive.google.com*
// @match *://hdvid.tv/*
// @match *://vidfast.co/*
// @match *://supervideo.tv/*
// @match *://jetload.net/*
// @match *://saruch.co/*
// @match *://vidmoly.me/*
// @match *://upstream.to/*
// @match *://abcvideo.cc/*
// @match *://aparat.cam/*
// @match *://vudeo.net/*
// @match *://voe.sx/*
// @match *://vidoo.tv/*
// @match *://nxload.com/*
// @match *://videobin.co/*
// @match *://uqload.com/*
// @match *://evoload.io/*
// @match *://yugenani.me/e/*
// @match *://kaa-play.com/*
// @match *://kaa-play.me/*
// @match *://betaplayer.life/*
// @match *://animeshouse.net/gcloud/*
// @match *://animato.me/embed/*
// @match *://animesonline.org/*/*id=*
// @match *://kimanime.ru/AnimeIframe/*
// @match *://akaneshinjou.github.io/*
// @match *://akane-shinjou.github.io/*
// @match *://andhaetg.github.io/*
// @match *://akaneshinjou.netlify.app/*
// @match *://vidcloud.spb.ru/*
// @match *://vidcloud.one/*
// @match *://*.streamhd.cc/*
// @exclude *myanimelist.net/anime/season*
// @exclude *myanimelist.net/anime/producer*
// @exclude *myanimelist.net/manga/magazine*
// @exclude *myanimelist.net/anime/genre*
// @exclude *myanimelist.net/manga/genre*
// @exclude *gogoanime*.*/
// @exclude *gogoanime*.*/*.html*
// @exclude *gogoanime*.*/anime-List*
// @exclude *gogoanime*.*/user*
// @exclude *gogoanime*.*/genre/*
// @exclude *gogoanime*.*/sub-category/*
// @exclude *animego*.*/
// @exclude *animego*.*/*.html*
// @exclude *animego*.*/anime-List*
// @exclude *animego*.*/user*
// @exclude *animego*.*/genre/*
// @exclude *animego*.*/sub-category/*
// @exclude *://*.branitube.net/lista/filter/*
// @exclude *://*.branitube.net/lista/pagina/*
// @exclude *://jkanime.net/
// @exclude *://jkanime.net/letra/*
// @exclude *://jkanime.net/buscar/*
// @exclude *://jkanime.net/terminos-condiciones/
// @exclude *://www.animezone.pl/anime/lista*
// @exclude *://www.animezone.pl/anime/sezony*
// @exclude *://www.animezone.pl/anime/ranking*
// @exclude *://www.animezone.pl/anime/nadchodzace*
// @exclude *://www.animezone.pl/anime/premiery*
// @exclude *://www.animezone.pl/anime/filmy*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @resource material.css https://code.getmdl.io/1.3.0/material.indigo-pink.min.css
// @resource materialFont.css https://fonts.googleapis.com/icon?family=Material+Icons
// @resource material.js https://greasyfork.org/scripts/377924-material-design-lite-mal-sync/code/material-design-lite%20MAL-Sync.js?version=671593
// @run-at document_start
// @connect myanimelist.net
// @connect kissanimelist.firebaseio.com
// @connect graphql.anilist.co
// @connect media.kitsu.io
// @connect api.simkl.com
// @connect api.malsync.moe
// @connect *
// @downloadURL https://update.greasyfork.org/scripts/372847/MAL-Sync%20%28Deprecated%20on%20Greasyfork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/372847/MAL-Sync%20%28Deprecated%20on%20Greasyfork%29.meta.js
// ==/UserScript==
 
var i18n = {"Search":"Site Search","Show":"Show","Help":"Help","Update":"Update","Add":"Add","Reset":"Reset","Remove":"Remove","Loading":"Loading","Select":"Select","Yes":"Yes","Ok":"Ok","No":"No","Cancel":"Cancel","updated":"Updated","removed":"Removed","NothingFound":"Nothing Found","Not_Found":"Not Found!","NoEntries":"No Entries","fullscreen":"fullscreen","close":"close","All":"All","Anime":"Anime","Manga":"Manga","Package_Description":"Integrates MyAnimeList/AniList/Kitsu/Simkl into various sites, with auto episode tracking.","UI_Status":"Status:","UI_Status_watching_anime":"Watching","UI_Status_watching_manga":"Reading","UI_Status_Completed":"Completed","UI_Status_OnHold":"On-Hold","UI_Status_Dropped":"Dropped","UI_Status_planTo_anime":"Plan to Watch","UI_Status_planTo_manga":"Plan to Read","UI_Status_Rewatching_anime":"Rewatching","UI_Status_Rewatching_manga":"Rereading","UI_Episode":"Episode:","UI_Volume":"Volume:","UI_Chapter":"Chapter:","UI_Score":"Your Score:","UI_Score_Not_Rated":"Not rated","UI_Score_Masterpiece":"(10) Masterpiece","UI_Score_Great":"(9) Great","UI_Score_VeryGood":"(8) Very Good","UI_Score_Good":"(7) Good","UI_Score_Fine":"(6) Fine","UI_Score_Average":"(5) Average","UI_Score_Bad":"(4) Bad","UI_Score_VeryBad":"(3) Very Bad","UI_Score_Horrible":"(2) Horrible","UI_Score_Appalling":"(1) Appalling","UI_Rules":"Rules","syncPage_flashm_resumeMsg":"Resume at $1","syncPage_flashm_sync_anime":"Update $1 to episode $2","syncPage_flashm_sync_manga":"Update $1 to chapter $2","syncPage_flashm_sync_undefined_undo":"Undo","syncPage_flashm_sync_undefined_wrong":"Wrong?","syncPage_flashm_failded":"Update failed","syncPage_flashConfirm_complete":"Set as completed?","syncPage_flashConfirm_start_anime":"Start watching?","syncPage_flashConfirm_rewatch_finish_anime":"Finish rewatching?","syncPage_flashConfirm_rewatch_finish_manga":"Finish rereading?","syncPage_flashConfirm_start_manga":"Start reading?","syncPage_flashConfirm_rewatch_start_anime":"Rewatch Anime?","syncPage_flashConfirm_rewatch_start_manga":"Reread Manga?","syncPage_flashConfirm_Anime_Correct":"Is \"$1\" correct?","syncPage_flash_player_error":"Player not detected. Please manually update it here.","syncPage_malObj_addAnime":"Add to $1","syncPage_malObj_nextEp_anime":"Episode $1","syncPage_malObj_nextEp_manga":"Chapter $1","syncPage_flashConfirm_offsetHandler_1":"A possible Episode offset of $1 was detected. Is that correct? ","anilistClass_authentication":"Token saved you can close this page now","kitsuClass_authentication_text":"To login with Kitsu, you need to enter your account's e-mail and password.<br>Your credentials are not stored on your computer or anywhere else.<br>They are directly sent to Kitsu. Only the returned access token is saved.<br>","kitsuClass_authentication_Password":"Password","kitsuClass_authentication_Login":"Login","kitsuClass_authentication_Success":"Token saved you can close this page now","kitsuClass_authentication_Wrong":"Credentials wrong","bookmarksItem_Years":"Years","bookmarksItem_Year":"Year","bookmarksItem_Days":"Days","bookmarksItem_Day":"Day","bookmarksItem_Hours":"Hours","bookmarksItem_Hour":"Hour","bookmarksItem_mins":"mins","bookmarksItem_min":"min","bookmarksItem_secs":"seconds","bookmarksItem_sec":"second","bookmarksItem_now":"Now","bookmarksItem_ago":"$1 ago","prediction_Episode_anime":"Next episode estimated in $1","prediction_Last_anime":"Last episode released $1 ago","prediction_Episode_manga":"Next chapter estimated in $1","prediction_Last_manga":"Last chapter released $1 ago","prediction_next":"Next in $1","prediction_incomplete":"Incomplete","prediction_ongoing":"Ongoing","prediction_complete":"Complete","prediction_Airing":"Airing in $1","correction_Offset":"Episode Offset","correction_Offset_text":"Input the episode offset, if an anime has 12 episodes, but uses the numbers 0-11 rather than 1-12, you simply type \" +1 \" in the episode offset.","correction_WrongUrl":"Only change this URL if it points to the wrong anime page on MAL.","correction_Search":"Correction Search","correction_Search_text":"This field is for finding an anime, when you need to correct the \"MyAnimeList URL\" shown above.<br>To make a search, simply begin typing the name of an anime, and a list with results will automatically appear as you type.","correction_NoMal":"If the Anime/Manga can't be found on MAL","correction_NoEntry":"No entry on MyAnimeList","correction_NewOffset":"New Offset ($1) set.","correction_OffsetReset":"Offset reset","correction_NewUrl":"New URL '$1' set.","correction_NewUrlReset":"MyAnimeList URL reset","correction_DBRequest":"Submit database correction request?","overview_Continue_anime":"Continue watching","overview_Continue_manga":"Continue reading","overview_Next_Episode_anime":"Next Episode","overview_Next_Episode_manga":"Next Chapter","overview_Resume_Episode_anime":"Resume Episode","overview_Resume_Episode_manga":"Resume Chapter","overview_EditDetails":"Edit Details","overview_Characters":"Characters","overview_OpeningTheme":"Opening Theme:","overview_EndingTheme":"Ending Theme:","search_Type":"Type:","search_Score":"Score:","search_Year":"Year:","settings_General":"General","settings_Mode":"Mode","settings_Authenticate":"Authenticate","settings_LocalSync":"Local storage fallback","settings_LocalSync_Import":"Import","settings_LocalSync_Export":"Export","settings_Animesync":"Anime sync","settings_Animesync_Video":"Video","settings_Animesync_Instant":"Instant","settings_Animesync_Manual":"Manual","settings_Mangasync":"Manga sync","settings_AutoTracking_Video":"Update on $1% of video progress","settings_AutoTracking_Instant":"Delay instant autotracking by $1 seconds","settings_StreamingSite":"Streaming Site Links","settings_StreamingSite_text":"If disabled, the streaming site will no longer appear in an anime’s sidebar on MyAnimeList/AniList/Kitsu/Simkl.","settings_Thumbnails":"Thumbnails","settings_Thumbnails_text":"The option is for resizing the thumbnails on MyAnimeList eg. thumbnails for characters, people, recommendations, etc.","settings_Thumbnails_Large":"Large","settings_Thumbnails_Medium":"Medium","settings_Thumbnails_Small":"Small","settings_Thumbnails_Default":"MAL Default","settings_FriendScore":"Friend scores on detail page","settings_epPredictions":"Estimate episode number","settings_malTags":"Use Tags/Notes","settings_malTags_Text":"If enabled: The streaming page that you have used last is permanently (across browsers) saved in the tags/Notes section in your list. The saved string in the tag section is ugly, only really recommended if you dont use the tag/notes section.","settings_malContinue":"Continue watching links","settings_malResume":"Resume watching links","settings_usedPage":"Last used page links","settings_miniMAL_floatButtonStealth":"Stealth UI mode","settings_miniMAL_minimizeBigPopup":"Minimize big pop-ups","settings_miniMAL_floatButtonCorrection":"Remap floating button to the correction UI","settings_miniMAL_floatButtonHide":"Hide miniMAL floating menu button","settings_miniMAL_autoCloseMinimal":"Clicking outside closes miniMAL","settings_miniMAL_Display":"Display to the","settings_miniMAL_popup":"Extension Popup","settings_miniMAL_theme":"Theme","settings_miniMAL_window":"Open in separate window","settings_miniMAL_Display_Left":"Left","settings_miniMAL_Display_Right":"Right","settings_miniMAL_Height":"Height (px / %)","settings_miniMAL_Width":"Width (px / %)","settings_Shortcuts":"Shortcuts","settings_miniMAL_Open":"Open miniMAL","settings_miniMAL_NotSet":"Not Set","settings_loadPTWForProgress":"Load PTW/PTR for Progress evaluation","settings_Video_Player":"Video Player","settings_Video_Fullscreen":"Auto fullscreen","settings_Video_Resume":"Auto resume","settings_autoNextEp":"Autoplay next episode","settings_Shortcuts_Correction":"Open anime relation correction popup","settings_Shortcuts_Sync":"Set episode/chapter as read","settings_Shortcuts_Next_Episode":"Open next episode shortcut","settings_Shortcuts_Skip_Forward":"Skips the opening","settings_Shortcuts_Skip_Backward":"Jump back to opening's beginning","settings_Shortcuts_Click":"Click to enter shortcut","settings_introSkip":"Set opening skip length ($1 seconds)","settings_UpdateCheck":"Update Check","settings_UpdateCheck_Text":"Checks for new episodes in the background.","settings_Interval":"Interval","settings_Interval_Off":"Off","settings_Interval_Default_Anime":"Default Anime","settings_Interval_Default_Manga":"Default Manga","settings_ProgressCheck":"Progress Check","settings_Notifications":"Notifications","settings_Debugging":"Debugging","settings_ETC":"ETC","settings_Userscriptmode":"Userscript mode","settings_Userscriptmode_Text":"Disables the content script. This makes it possible to have the extension and userscript enabled at the same time.","settings_highlightAllEp":"Highlight all Episodes/Chapters","settings_highlightAllEp_Text":"This option will highlight all watched chapters/episodes in the list you can find on some Anime/Manga sites","settings_ClearCache":"Clear Cache","settings_presenceHidePage":"Show MAL-Sync icon instead of page icon","settings_enabled":"Enabled","settings_shortcut_tooltip":"It is not recommended to set the shortcut to a single key","settings_progress_dropdown":"Estimation Source:","settings_progress_disabled":"Disabled","settings_progress_default":"Default","settings_website_button":"Websites","settings_custom_domains_button":"Custom domains","settings_clean_tags_button":"Clean Tags","settings_more_info":"More Info","settings_presenceShowButtons":"Show button to view the anime/manga on MAL or another provider","updateCheck_Refresh":"Refresh","updateCheck_StartCheck":"Start Check","updateCheck_NotificationCheck":"Notification Check","updateCheck_Episode":"Episode","updateCheck_Message":"Message","updateCheck_NotificationHistory":"Notification History","minimalApp_Overview":"Overview","minimalApp_Reviews":"Reviews","minimalApp_Recommendations":"Recommendations","minimalApp_Settings":"Settings","minimalClass_Popup":"Please allow pop-ups for this website","minimalClass_versionMsg":"Updated to version $1 $2CHANGELOG</a>]","minimalClass_versionMsg_Text_1":"Thank you for installing MAL-Sync","minimalClass_versionMsg_Text_2":"Having Questions?","minimalClass_versionMsg_Text_3":"Open Source Code:","minimalClass_versionMsg_Text_4":"uBlock users please subscribe to this filter list! This fixes some problems like broken images","installPage_Mode":"Please select which Anime database you want use:","installPage_Howto":"How to use?","installPage_Howto_Description":"Just open an episode or chapter on any of the <a target=\"_blank\" href=\"https://github.com/MALSync/MALSync#supported-pages-\">supported pages</a>. The sync waits until 85% of the video is watched. For mangas it syncs on page load. This can be changed in the <a class=\"open-settings\" href=\"#\">settings</a>.","installPage_Wrong":"It syncs to the wrong MAL entry?","installPage_Wrong_Description":"You can easily change the relation like shown in the gif below. An episode offset can be set on that page too.","Anilist_Authenticate":"Please Authenticate <a target=\"_blank\" href=\"https://anilist.co/api/v2/oauth/authorize?client_id=1487&response_type=token\">Here</a>","Emby_Authenticate":"MAL-Sync needs an Emby API key to work. More infos <a href=\"https://github.com/MediaBrowser/Emby/wiki/Api-Key-Authentication#creating-an-api-key\" target=\"_blank\">Here</a>","Error_Authenticate":"Please Authenticate <a target=\"_blank\" href=\"$1\">Here</a>","Discord_rpc_browsing":"Browsing $1","discord_rpc_view_anime":"View Anime","discord_rpc_view_manga":"View Manga","nextEpShort_no_support":"This page doesn't support opening the next episode","nextEpShort_no_nextEp":"Couldn't find the next episode","settings_filler":"Check for filler/recap episodes","settings_filler_text":"This will check if the episode is marked as a filler/recap on MyAnimeList","filler_filler_confirm":"This episode has been marked as a filler on MyAnimeList, do you want to skip?","filler_recap_confirm":"This episode has been marked as a recap on MyAnimeList, do you want to skip?"}
/*! For license information please see malsync.user.js.LICENSE.txt */
!function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: !1,
            exports: {}
        };
        return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__),
        module.l = !0, module.exports;
    }
    __webpack_require__.m = modules, __webpack_require__.c = installedModules, __webpack_require__.d = function(exports, name, getter) {
        __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
            enumerable: !0,
            get: getter
        });
    }, __webpack_require__.r = function(exports) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(exports, "__esModule", {
            value: !0
        });
    }, __webpack_require__.t = function(value, mode) {
        if (1 & mode && (value = __webpack_require__(value)), 8 & mode) return value;
        if (4 & mode && "object" == typeof value && value && value.__esModule) return value;
        var ns = Object.create(null);
        if (__webpack_require__.r(ns), Object.defineProperty(ns, "default", {
            enumerable: !0,
            value: value
        }), 2 & mode && "string" != typeof value) for (var key in value) __webpack_require__.d(ns, key, function(key) {
            return value[key];
        }.bind(null, key));
        return ns;
    }, __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function() {
            return module.default;
        } : function() {
            return module;
        };
        return __webpack_require__.d(getter, "a", getter), getter;
    }, __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 9);
}([ function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__), __webpack_require__.d(__webpack_exports__, "storage", (function() {
        return storage;
    })), __webpack_require__.d(__webpack_exports__, "request", (function() {
        return request;
    })), __webpack_require__.d(__webpack_exports__, "settings", (function() {
        return settings;
    })), __webpack_require__.d(__webpack_exports__, "type", (function() {
        return type;
    }));
    var _storage_userscriptLegacy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5), _request_requestUserscriptLegacy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6), _settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8);
    const storage = _storage_userscriptLegacy__WEBPACK_IMPORTED_MODULE_0__.a, request = _request_requestUserscriptLegacy__WEBPACK_IMPORTED_MODULE_1__.a, settings = _settings__WEBPACK_IMPORTED_MODULE_2__.a, type = "userscript";
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__), __webpack_require__.d(__webpack_exports__, "log", (function() {
        return log;
    })), __webpack_require__.d(__webpack_exports__, "error", (function() {
        return error;
    })), __webpack_require__.d(__webpack_exports__, "info", (function() {
        return info;
    })), __webpack_require__.d(__webpack_exports__, "debug", (function() {
        return debug;
    })), __webpack_require__.d(__webpack_exports__, "m", (function() {
        return m;
    }));
    const log = Function.prototype.bind.call(console.log, console, "%cMAL-Sync", "background-color: #2e51a2; color: white; padding: 2px 10px; border-radius: 3px;"), error = Function.prototype.bind.call(console.error, console, "%cMAL-Sync", "background-color: #8f0000; color: white; padding: 2px 10px; border-radius: 3px;"), info = Function.prototype.bind.call(console.info, console, "%cMAL-Sync", "background-color: wheat; color: black; padding: 2px 10px; border-radius: 3px;"), debug = Function.prototype.bind.call(console.debug, console, "%cMAL-Sync", "background-color: steelblue; color: black; padding: 2px 10px; border-radius: 3px;"), m = (name, color = "", blocks = []) => {
        let fontColor = "white";
        color || (color = function(str) {
            if (!str) return "#ffffff";
            str = String(str);
            let hash = 0;
            for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
            let colour = "#";
            for (let i = 0; i < 3; i++) {
                colour += ("00" + (hash >> 8 * i & 255).toString(16)).substr(-2);
            }
            return colour;
        }(name)), "#" === color[0] && (fontColor = parseInt(color.replace("#", ""), 16) > 8388607.5 ? "#000" : "#fff");
        const style = `background-color: ${color}; color: ${fontColor}; padding: 2px 10px; border-radius: 3px; margin-left: -5px; border-left: 1px solid white;`;
        blocks.push({
            name: name,
            style: style
        });
        const temp = {
            m: (name2, color2 = "") => m(name2, color2, [ ...blocks ])
        }, moduleText = blocks.reduce((sum, el) => `${sum}%c${el.name}`, ""), moduleStyle = blocks.map(el => el.style);
        return temp.log = Function.prototype.bind.call(console.log, console, "%cM " + moduleText, "background-color: #2e51a2; color: white; padding: 2px 10px; border-radius: 3px;", ...moduleStyle),
        temp.error = Function.prototype.bind.call(console.error, console, "%cM " + moduleText, "background-color: #8f0000; color: white; padding: 2px 10px; border-radius: 3px;", ...moduleStyle),
        temp.info = Function.prototype.bind.call(console.info, console, "%cM " + moduleText, "background-color: wheat; color: black; padding: 2px 10px; border-radius: 3px;", ...moduleStyle),
        temp.debug = Function.prototype.bind.call(console.debug, console, "%cM " + moduleText, "background-color: steelblue; color: black; padding: 2px 10px; border-radius: 3px;", ...moduleStyle),
        temp;
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__), function(j, api, con, utils) {
        __webpack_require__.d(__webpack_exports__, "urlPart", (function() {
            return urlPart;
        })), __webpack_require__.d(__webpack_exports__, "urlStrip", (function() {
            return urlStrip;
        })), __webpack_require__.d(__webpack_exports__, "urlParam", (function() {
            return urlParam;
        })), __webpack_require__.d(__webpack_exports__, "getBaseText", (function() {
            return getBaseText;
        })), __webpack_require__.d(__webpack_exports__, "generateUniqueID", (function() {
            return generateUniqueID;
        })), __webpack_require__.d(__webpack_exports__, "favicon", (function() {
            return favicon;
        })), __webpack_require__.d(__webpack_exports__, "watching", (function() {
            return watching;
        })), __webpack_require__.d(__webpack_exports__, "planTo", (function() {
            return planTo;
        })), __webpack_require__.d(__webpack_exports__, "episode", (function() {
            return episode;
        })), __webpack_require__.d(__webpack_exports__, "syncRegex", (function() {
            return syncRegex;
        })), __webpack_require__.d(__webpack_exports__, "status", (function() {
            return status;
        })), __webpack_require__.d(__webpack_exports__, "getselect", (function() {
            return getselect;
        })), __webpack_require__.d(__webpack_exports__, "absoluteLink", (function() {
            return absoluteLink;
        })), __webpack_require__.d(__webpack_exports__, "parseHtml", (function() {
            return parseHtml;
        })), __webpack_require__.d(__webpack_exports__, "urlChangeDetect", (function() {
            return urlChangeDetect;
        })), __webpack_require__.d(__webpack_exports__, "fullUrlChangeDetect", (function() {
            return fullUrlChangeDetect;
        })), __webpack_require__.d(__webpack_exports__, "changeDetect", (function() {
            return changeDetect;
        })), __webpack_require__.d(__webpack_exports__, "waitUntilTrue", (function() {
            return waitUntilTrue;
        })), __webpack_require__.d(__webpack_exports__, "getAsyncWaitUntilTrue", (function() {
            return getAsyncWaitUntilTrue;
        })), __webpack_require__.d(__webpack_exports__, "checkDoubleExecution", (function() {
            return checkDoubleExecution;
        })), __webpack_require__.d(__webpack_exports__, "getUrlFromTags", (function() {
            return getUrlFromTags;
        })), __webpack_require__.d(__webpack_exports__, "setUrlInTags", (function() {
            return setUrlInTags;
        })), __webpack_require__.d(__webpack_exports__, "setResumeWaching", (function() {
            return setResumeWaching;
        })), __webpack_require__.d(__webpack_exports__, "getResumeWaching", (function() {
            return getResumeWaching;
        })), __webpack_require__.d(__webpack_exports__, "setContinueWaching", (function() {
            return setContinueWaching;
        })), __webpack_require__.d(__webpack_exports__, "getContinueWaching", (function() {
            return getContinueWaching;
        })), __webpack_require__.d(__webpack_exports__, "setEntrySettings", (function() {
            return setEntrySettings;
        })), __webpack_require__.d(__webpack_exports__, "getEntrySettings", (function() {
            return getEntrySettings;
        })), __webpack_require__.d(__webpack_exports__, "handleMalImages", (function() {
            return handleMalImages;
        })), __webpack_require__.d(__webpack_exports__, "getTooltip", (function() {
            return getTooltip;
        })), __webpack_require__.d(__webpack_exports__, "timeDiffToText", (function() {
            return timeDiffToText;
        })), __webpack_require__.d(__webpack_exports__, "canHideTabs", (function() {
            return canHideTabs;
        })), __webpack_require__.d(__webpack_exports__, "statusTag", (function() {
            return statusTag;
        })), __webpack_require__.d(__webpack_exports__, "notifications", (function() {
            return notifications;
        })), __webpack_require__.d(__webpack_exports__, "timeCache", (function() {
            return timeCache;
        })), __webpack_require__.d(__webpack_exports__, "flashm", (function() {
            return flashm;
        })), __webpack_require__.d(__webpack_exports__, "flashConfirm", (function() {
            return flashConfirm;
        })), __webpack_require__.d(__webpack_exports__, "lazyload", (function() {
            return lazyload;
        })), __webpack_require__.d(__webpack_exports__, "elementInViewport", (function() {
            return elementInViewport;
        })), __webpack_require__.d(__webpack_exports__, "wait", (function() {
            return wait;
        })), __webpack_require__.d(__webpack_exports__, "pageUrl", (function() {
            return pageUrl;
        })), __webpack_require__.d(__webpack_exports__, "returnYYYYMMDD", (function() {
            return returnYYYYMMDD;
        }));
        var __awaiter = function(thisArg, _arguments, P, generator) {
            return new (P || (P = Promise))((function(resolve, reject) {
                function fulfilled(value) {
                    try {
                        step(generator.next(value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function rejected(value) {
                    try {
                        step(generator.throw(value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function step(result) {
                    var value;
                    result.done ? resolve(result.value) : (value = result.value, value instanceof P ? value : new P((function(resolve) {
                        resolve(value);
                    }))).then(fulfilled, rejected);
                }
                step((generator = generator.apply(thisArg, _arguments || [])).next());
            }));
        };
        function urlPart(url, part) {
            if (!url) return "";
            const urlParts = url.split("/");
            return urlParts[part] ? urlParts[part].replace(/[#?].*/, "") : "";
        }
        function urlStrip(url) {
            return url.replace(/[#?].*/, "");
        }
        function urlParam(url, name) {
            const results = new RegExp(`[?&]${name}=([^&#]*)`).exec(url);
            return null === results ? null : decodeURI(results[1]) || 0;
        }
        function getBaseText(element) {
            let text = element.text();
            return element.children().each((function() {
                text = text.replace(j.$(this).text(), "");
            })), text;
        }
        function generateUniqueID(arraySize = 10) {
            const array = new Uint32Array(arraySize);
            return window.crypto.getRandomValues(array), Array.from(array, value => value.toString(16)).join("");
        }
        function favicon(domain) {
            const res = domain.match(/^(https?:\/\/)?[^/]+/);
            return res && (domain = res[0]), "https://favicon.malsync.moe/?domain=" + domain;
        }
        function watching(type) {
            return "manga" === type ? "Reading" : "Watching";
        }
        function planTo(type) {
            return "manga" === type ? "Plan to Read" : "Plan to Watch";
        }
        function episode(type) {
            return "manga" === type ? api.storage.lang("UI_Chapter") : api.storage.lang("UI_Episode");
        }
        const syncRegex = /(^settings\/.*|^updateCheckTime$|^tempVersion$|^local:\/\/|^list-tagSettings$)/;
        var status;
        function getselect(data, name) {
            let temp = data.split(`name="${name}"`)[1].split("</select>")[0];
            if (temp.indexOf('selected="selected"') > -1) {
                temp = temp.split("<option");
                for (let i = 0; i < temp.length; ++i) if (temp[i].indexOf('selected="selected"') > -1) return temp[i].split('value="')[1].split('"')[0];
            }
            return "";
        }
        function absoluteLink(url, domain) {
            return void 0 === url || url.startsWith("http") || ("/" !== url.charAt(0) && (url = "/" + url),
            url = domain + url), url;
        }
        function parseHtml(text) {
            return (new DOMParser).parseFromString("<!doctype html><body>" + text, "text/html").body.textContent;
        }
        function urlChangeDetect(callback) {
            let currentPage = window.location.href;
            return setInterval((function() {
                currentPage !== window.location.href && (currentPage = window.location.href, callback());
            }), 100);
        }
        function fullUrlChangeDetect(callback, strip = !1) {
            let currentPage = "";
            const intervalId = setInterval((function() {
                const url = strip ? urlStrip(window.location.href) : window.location.href;
                currentPage !== url && (currentPage = url, callback());
            }), 100);
            return Number(intervalId);
        }
        function changeDetect(callback, func) {
            let currentPage = func();
            const intervalId = setInterval((function() {
                const temp = func();
                void 0 !== temp && currentPage !== temp && (currentPage = func(), callback());
            }), 500);
            return Number(intervalId);
        }
        function waitUntilTrue(condition, callback, interval = 100) {
            const intervalId = setInterval((function() {
                condition() && (clearInterval(intervalId), callback());
            }), interval);
            return intervalId;
        }
        function getAsyncWaitUntilTrue(condition, interval = 100) {
            let intervalId, rejectThis;
            const reset = () => {
                clearTimeout(intervalId), rejectThis && rejectThis("AsyncWait stopped");
            };
            return {
                asyncWaitUntilTrue: () => (reset(), new Promise((resolve, reject) => {
                    rejectThis = reject, intervalId = waitUntilTrue(condition, () => resolve(), interval);
                })),
                reset: reset
            };
        }
        !function(status) {
            status[status.watching = 1] = "watching", status[status.completed = 2] = "completed",
            status[status.onhold = 3] = "onhold", status[status.dropped = 4] = "dropped", status[status.planToWatch = 6] = "planToWatch";
        }(status || (status = {}));
        const doubleId = Math.random();
        function checkDoubleExecution() {
            $(".mal-sync-double-detect").length && $(".mal-sync-double-detect").each((function(index) {
                $(this).text() !== doubleId.toString() && alert("Double execution detected! Please run MAL-Sync once only.");
            })), $("body").after(j.html(`<div class="mal-sync-double-detect" style="display: none;">${doubleId.toString()}</div>`));
        }
        function getUrlFromTags(tags) {
            return /malSync::[\d\D]+::/.test(tags) ? atobURL(tags.split("malSync::")[1].split("::")[0]) : /last::[\d\D]+::/.test(tags) ? atobURL(tags.split("last::")[1].split("::")[0]) : void 0;
            function atobURL(encoded) {
                try {
                    return atob(encoded);
                } catch (e) {
                    return encoded;
                }
            }
        }
        function setUrlInTags(url, tags) {
            if ("" === url) return tags = tags.replace(/,?(malSync|last)::[^ \n]+?::/, "");
            if (!api.settings.get("malTags")) return tags;
            const addition = `malSync::${btoa(url)}::`;
            return tags = /(last|malSync)::[\d\D]+::/.test(tags) ? tags.replace(/(last|malSync)::[^^]*?::/, addition) : `${tags},${addition}`;
        }
        function setResumeWaching(url, ep, type, id) {
            return __awaiter(this, void 0, void 0, (function*() {
                return api.storage.set(`resume/${type}/${id}`, {
                    url: url,
                    ep: ep
                });
            }));
        }
        function getResumeWaching(type, id) {
            return __awaiter(this, void 0, void 0, (function*() {
                if (api.settings.get("malResume")) return api.storage.get(`resume/${type}/${id}`);
            }));
        }
        function setContinueWaching(url, ep, type, id) {
            return __awaiter(this, void 0, void 0, (function*() {
                return api.storage.set(`continue/${type}/${id}`, {
                    url: url,
                    ep: ep
                });
            }));
        }
        function getContinueWaching(type, id) {
            return __awaiter(this, void 0, void 0, (function*() {
                if (api.settings.get("malContinue")) return api.storage.get(`continue/${type}/${id}`);
            }));
        }
        function setEntrySettings(type, id, options, tags = "") {
            return __awaiter(this, void 0, void 0, (function*() {
                const tempOptions = {};
                if (options) {
                    for (const key in options) switch (key) {
                      case "u":
                      case "p":
                        tempOptions[key] = options[key];
                    }
                    api.settings.get("malTags") ? tags = setUrlInTags(JSON.stringify(tempOptions), tags) : yield api.storage.set(`tagSettings/${type}/${id}`, JSON.stringify(tempOptions));
                }
                return Object.values(tempOptions).find(el => Boolean(el)) || (tags = setUrlInTags("", tags),
                api.settings.get("malTags") || (yield api.storage.remove(`tagSettings/${type}/${id}`))),
                tags;
            }));
        }
        function getEntrySettings(type, id, tags = "") {
            return __awaiter(this, void 0, void 0, (function*() {
                const tempOptions = {
                    u: null,
                    c: null,
                    r: null,
                    p: ""
                };
                if (api.settings.get("malTags")) {
                    const tagString = getUrlFromTags(tags);
                    if (tagString) if ("{" === tagString[0]) try {
                        const temp = JSON.parse(tagString);
                        for (const key in tempOptions) temp[key] && (tempOptions[key] = temp[key]);
                    } catch (e) {
                        con.error(e);
                    } else tempOptions.u = tagString;
                } else {
                    let temp = yield api.storage.get(`tagSettings/${type}/${id}`);
                    if (temp) {
                        temp = JSON.parse(temp);
                        for (const key in tempOptions) temp[key] && (tempOptions[key] = temp[key]);
                    }
                }
                const continueUrlObj = yield getContinueWaching(type, id);
                continueUrlObj && (tempOptions.c = continueUrlObj);
                const resumeUrlObj = yield getResumeWaching(type, id);
                return resumeUrlObj && (tempOptions.r = resumeUrlObj), api.settings.get("usedPage") || (tempOptions.u = null),
                tempOptions;
            }));
        }
        function handleMalImages(url) {
            return -1 !== url.indexOf("questionmark") ? api.storage.assetUrl("questionmark.gif") : url;
        }
        function getTooltip(text, style = "", direction = "top") {
            const rNumber = Math.floor(1e3 * Math.random() + 1);
            return `<div id="tt${rNumber}" class="icon material-icons" style="font-size:16px; line-height: 0; color: #7f7f7f; padding-bottom: 20px; padding-left: 3px; ${style}">contact_support</div>  <div class="mdl-tooltip mdl-tooltip--${direction} mdl-tooltip--large" for="tt${rNumber}">${text}</div>`;
        }
        function timeDiffToText(delta) {
            let text = "";
            delta /= 1e3;
            const diffYears = Math.floor(delta / 31536e3);
            delta -= 31536e3 * diffYears, diffYears && (text += diffYears + "y ");
            const diffDays = Math.floor(delta / 86400);
            delta -= 86400 * diffDays, diffDays && (text += diffDays + "d ");
            const diffHours = Math.floor(delta / 3600) % 24;
            delta -= 3600 * diffHours, diffHours && diffDays < 2 && (text += diffHours + "h ");
            const diffMinutes = Math.floor(delta / 60) % 60;
            return delta -= 60 * diffMinutes, diffMinutes && !diffDays && diffHours < 3 && (text += diffMinutes + "min "),
            text;
        }
        function canHideTabs() {
            return "undefined" != typeof browser && void 0 !== browser.tabs.hide;
        }
        function statusTag(status, type, id) {
            const info = {
                anime: {
                    1: {
                        class: "watching",
                        text: "CW",
                        title: "Watching"
                    },
                    2: {
                        class: "completed",
                        text: "CMPL",
                        title: "Completed"
                    },
                    3: {
                        class: "on-hold",
                        text: " HOLD",
                        title: "On-Hold"
                    },
                    4: {
                        class: "dropped",
                        text: "DROP",
                        title: "Dropped"
                    },
                    6: {
                        class: "plantowatch",
                        text: "PTW",
                        title: "Plan to Watch"
                    }
                },
                manga: {
                    1: {
                        class: "reading",
                        text: "CR",
                        title: "Reading"
                    },
                    2: {
                        class: "completed",
                        text: "CMPL",
                        title: "Completed"
                    },
                    3: {
                        class: "on-hold",
                        text: " HOLD",
                        title: "On-Hold"
                    },
                    4: {
                        class: "dropped",
                        text: "DROP",
                        title: "Dropped"
                    },
                    6: {
                        class: "plantoread",
                        text: "PTR",
                        title: "Plan to Read"
                    }
                }
            };
            if ($.each([ 1, 2, 3, 4, 6 ], (function(i, el) {
                info.anime[info.anime[el].title] = info.anime[el], info.manga[info.manga[el].title] = info.manga[el];
            })), status) {
                const tempInfo = info[type][status];
                return ` <a href="https://myanimelist.net/ownlist/${type}/${id}/edit?hideLayout=1" title="${tempInfo.title}" class="Lightbox_AddEdit button_edit ${tempInfo.class}">${tempInfo.text}</a>`;
            }
            return !1;
        }
        function notifications(url, title, message, iconUrl = "") {
            const messageObj = {
                type: "basic",
                title: title,
                message: message,
                iconUrl: iconUrl
            };
            con.log("Notification", url, messageObj), api.storage.get("notificationHistory").then(history => {
                void 0 === history && (history = []), "object" == typeof history && (history.length >= 10 && history.shift(),
                history.push({
                    url: url,
                    title: messageObj.title,
                    message: messageObj.message,
                    iconUrl: messageObj.iconUrl,
                    timestamp: Date.now()
                }), api.storage.set("notificationHistory", history));
            });
            try {
                return chrome.notifications.create(url, messageObj);
            } catch (e) {
                con.error(e);
            }
        }
        function timeCache(key, dataFunction, ttl) {
            return __awaiter(this, void 0, void 0, (function*() {
                const value = yield api.storage.get(key);
                if ("object" == typeof value && (new Date).getTime() < value.timestamp) return value.data;
                const result = yield dataFunction();
                return api.storage.set(key, {
                    data: result,
                    timestamp: (new Date).getTime() + ttl
                }).then(() => result);
            }));
        }
        function flashm(text, options) {
            j.$("#flash-div-top").length || function() {
                api.storage.addStyle('.flashinfo{\n                    transition: max-height 2s, opacity 2s 2s;\n                 }\n                 .mini-stealth .flashinfo{\n                    opacity: 0;\n                 }\n                  #flashinfo-div.hover.mini-stealth .flashinfo.type-update{\n                    opacity: 0.7;\n                 }\n                 #flashinfo-div.hover .flashinfo{\n                    opacity: 1;\n                 }\n                 .flashinfo:hover{\n                    max-height:5000px !important;\n                    z-index: 2147483647;\n                    opacity: 1;\n                    transition: max-height 2s;\n                 }\n                 .flashinfo .synopsis{\n                    transition: max-height 2s, max-width 2s ease 2s;\n                 }\n                 .flashinfo:hover .synopsis{\n                    max-height:9999px !important;\n                    max-width: 500px !important;\n                    transition: max-height 2s;\n                 }\n                 #flashinfo-div{\n                  z-index: 2;\n                  transition: 2s;\n                 }\n                 #flashinfo-div:hover, #flashinfo-div.hover{\n                  z-index: 2147483647;\n                 }\n                 #flashinfo-div.player-error {\n                   z-index: 2147483647;\n                 }\n                 #flashinfo-div.player-error .type-update{\n                  overflow: visible !important;\n                  opacity: 1 !important;\n                 }\n                 #flashinfo-div.player-error .player-error{\n                  display: block !important\n                 }\n\n                 #flash-div-top, #flash-div-bottom, #flashinfo-div{\n                    font-family: "Helvetica","Arial",sans-serif;\n                    color: white;\n                    font-size: 14px;\n                    font-weight: 400;\n                    line-height: 17px;\n                 }\n                 #flash-div-top h2, #flash-div-bottom h2, #flashinfo-div h2{\n                    font-family: "Helvetica","Arial",sans-serif;\n                    color: white;\n                    font-size: 14px;\n                    font-weight: 700;\n                    line-height: 17px;\n                    padding: 0;\n                    margin: 0;\n                 }\n                 #flash-div-top a, #flash-div-bottom a, #flashinfo-div a{\n                    color: #DF6300;\n                 }');
                let extraClass = "";
                api.settings.get("floatButtonStealth") && (extraClass = "mini-stealth");
                j.$("body").after(j.html(`<div id="flash-div-top" style="text-align: center;pointer-events: none;position: fixed;top:-5px;width:100%;z-index: 2147483647;left: 0;"></div>        <div id="flash-div-bottom" style="text-align: center;pointer-events: none;position: fixed;bottom:0px;width:100%;z-index: 2147483647;left: 0;"><div id="flash" style="display:none;  background-color: red;padding: 20px; margin: 0 auto;max-width: 60%;          -webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 20px;background:rgba(227,0,0,0.6);"></div></div>        <div id="flashinfo-div" class="${extraClass}" style="text-align: center;pointer-events: none;position: fixed;bottom:0px;width:100%;left: 0;">`));
            }(), con.log("[Flash] Message:", text);
            let colorF = "#323232";
            void 0 !== options && void 0 !== options.error && options.error && (colorF = "#3e0808");
            let flashdiv = "#flash-div-bottom";
            void 0 !== options && void 0 !== options.position && options.position && (flashdiv = "#flash-div-" + options.position);
            let messClass = "flash";
            if (void 0 !== options && void 0 !== options.type && options.type) {
                const tempClass = "type-" + options.type;
                j.$(`${flashdiv} .${tempClass}, #flashinfo-div .${tempClass}`).removeClass(tempClass).fadeOut({
                    duration: 1e3,
                    queue: !1,
                    complete() {
                        j.$(this).remove();
                    }
                }), messClass += " " + tempClass;
            }
            let flashmEl, mess = `<div class="${messClass}" style="display:none;">        <div style="display:table; pointer-events: all; padding: 14px 24px 14px 24px; margin: 0 auto; margin-top: 5px; max-width: 60%; -webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 2px;color: white;background:${colorF}; ">          ${text}        </div>      </div>`;
            return void 0 !== options && void 0 !== options.hoverInfo && options.hoverInfo ? (messClass += " flashinfo",
            mess = `<div class="${messClass}" style="display:none; max-height: 5000px; overflow: hidden;"><div style="display:table; pointer-events: all; margin: 0 auto; margin-top: -2px; max-width: 60%; -webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 2px;color: white;background:${colorF}; position: relative;"><div style="max-height: 60vh; overflow-y: auto; padding: 14px 24px 14px 24px;">${text}</div></div></div>`,
            j.$("#flashinfo-div").addClass("hover"), flashmEl = j.$(j.html(mess)).appendTo("#flashinfo-div"),
            void 0 !== options && void 0 !== options.minimized && options.minimized && flashmEl.css("max-height", "8px")) : flashmEl = j.$(j.html(mess)).appendTo(flashdiv),
            void 0 !== options && void 0 !== options.permanent && options.permanent ? flashmEl.slideDown(800) : void 0 !== options && void 0 !== options.hoverInfo && options.hoverInfo ? flashmEl.slideDown(800).delay(4e3).queue((function() {
                j.$("#flashinfo-div").removeClass("hover"), flashmEl.css("max-height", "8px");
            })) : flashmEl.slideDown(800).delay(4e3).slideUp(800, () => {
                j.$(this).remove();
            }), flashmEl;
        }
        function flashConfirm(message, type, yesCall = (() => {}), cancelCall = (() => {}), yesNo = !1) {
            return __awaiter(this, void 0, void 0, (function*() {
                return new Promise((function(resolve, reject) {
                    let yesText = api.storage.lang("Ok"), noText = api.storage.lang("Cancel");
                    yesNo && (yesText = api.storage.lang("Yes"), noText = api.storage.lang("No"));
                    const flasmessage = flashm(message = `<div style="text-align: center;">${message}</div><div style="display: flex; justify-content: space-around;"><button class="Yes" style="background-color: transparent; border: none; color: rgb(255,64,129);margin-top: 10px; cursor:pointer;">${yesText}</button><button class="Cancel" style="background-color: transparent; border: none; color: rgb(255,64,129);margin-top: 10px; cursor:pointer;">${noText}</button></div>`, {
                        permanent: !0,
                        position: "top",
                        type: type
                    });
                    flasmessage.find(".Yes").click((function(evt) {
                        resolve(!0), j.$(evt.target).parentsUntil(".flash").fadeOut(300, (function() {
                            j.$(this).remove();
                        })), yesCall();
                    })), flasmessage.find(".Cancel").click((function(evt) {
                        resolve(!1), j.$(evt.target).parentsUntil(".flash").fadeOut(300, (function() {
                            j.$(this).remove();
                        })), cancelCall();
                    }));
                }));
            }));
        }
        let lazyloaded = !1, lazyimages = [];
        function lazyload(doc, scrollElement = ".mdl-layout__content") {
            function loadImage(el, fn) {
                if (!j.$(el).is(":visible")) return !1;
                if (j.$(el).hasClass("lazyBack")) j.$(el).css("background-image", `url(${el.getAttribute("data-src")})`).removeClass("lazyBack"); else {
                    const img = new Image, src = el.getAttribute("data-src");
                    img.onload = function() {
                        el.parent ? el.parent.replaceChild(img, el) : el.src = src, fn && fn();
                    }, img.src = src;
                }
            }
            for (let i = 0; i < lazyimages.length; i++) $(lazyimages[i]).addClass("init");
            lazyimages = [];
            const query = doc.find("img.lazy.init, .lazyBack.init"), processScroll = function() {
                for (let i = 0; i < lazyimages.length; i++) utils.elementInViewport(lazyimages[i], 600) && loadImage(lazyimages[i], (function() {
                    lazyimages.splice(i, i);
                })), $(lazyimages[i]).length || lazyimages.splice(i, i);
            };
            for (let i = 0; i < query.length; i++) lazyimages.push(query[i]), $(query[i]).removeClass("init");
            processScroll(), lazyloaded || (lazyloaded = !0, doc.find(scrollElement).scroll((function() {
                processScroll();
            })));
        }
        function elementInViewport(el, horizontalOffset = 0) {
            const rect = el.getBoundingClientRect();
            return rect.top >= 0 && rect.left >= 0 && rect.top - horizontalOffset <= (window.innerHeight || document.documentElement.clientHeight);
        }
        function wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        function pageUrl(page, type, id) {
            switch (page) {
              case "mal":
                return `https://myanimelist.net/${type}/${id}`;
 
              case "anilist":
                return `https://anilist.co/${type}/${id}`;
 
              case "kitsu":
                return `https://kitsu.io/${type}/${id}`;
 
              case "simkl":
                return `https://simkl.com/${type}/${id}`;
 
              default:
                throw page + " not a valid page";
            }
        }
        function returnYYYYMMDD(numFromToday = 0) {
            const d = new Date;
            d.setDate(d.getDate() + numFromToday);
            const month = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1, day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
            return `${d.getFullYear()}-${month}-${day}`;
        }
    }.call(this, __webpack_require__(3), __webpack_require__(0), __webpack_require__(1), __webpack_require__(2));
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__), __webpack_require__.d(__webpack_exports__, "$", (function() {
        return $;
    })), __webpack_require__.d(__webpack_exports__, "html", (function() {
        return html;
    }));
    var dompurify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
    const $ = jQuery;
    function html(htmlContent) {
        return dompurify__WEBPACK_IMPORTED_MODULE_0__.sanitize(htmlContent, {
            SAFE_FOR_JQUERY: !0,
            ALLOW_UNKNOWN_PROTOCOLS: !0,
            ADD_ATTR: [ "target" ]
        });
    }
}, function(module, exports, __webpack_require__) {
    module.exports = function() {
        "use strict";
        var hasOwnProperty = Object.hasOwnProperty, setPrototypeOf = Object.setPrototypeOf, isFrozen = Object.isFrozen, freeze = Object.freeze, seal = Object.seal, create = Object.create, _ref = "undefined" != typeof Reflect && Reflect, apply = _ref.apply, construct = _ref.construct;
        apply || (apply = function(fun, thisValue, args) {
            return fun.apply(thisValue, args);
        }), freeze || (freeze = function(x) {
            return x;
        }), seal || (seal = function(x) {
            return x;
        }), construct || (construct = function(Func, args) {
            return new (Function.prototype.bind.apply(Func, [ null ].concat(function(arr) {
                if (Array.isArray(arr)) {
                    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
                    return arr2;
                }
                return Array.from(arr);
            }(args))));
        });
        var func, arrayForEach = unapply(Array.prototype.forEach), arrayPop = unapply(Array.prototype.pop), arrayPush = unapply(Array.prototype.push), stringToLowerCase = unapply(String.prototype.toLowerCase), stringMatch = unapply(String.prototype.match), stringReplace = unapply(String.prototype.replace), stringIndexOf = unapply(String.prototype.indexOf), stringTrim = unapply(String.prototype.trim), regExpTest = unapply(RegExp.prototype.test), typeErrorCreate = (func = TypeError,
        function() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
            return construct(func, args);
        });
        function unapply(func) {
            return function(thisArg) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];
                return apply(func, thisArg, args);
            };
        }
        function addToSet(set, array) {
            setPrototypeOf && setPrototypeOf(set, null);
            for (var l = array.length; l--; ) {
                var element = array[l];
                if ("string" == typeof element) {
                    var lcElement = stringToLowerCase(element);
                    lcElement !== element && (isFrozen(array) || (array[l] = lcElement), element = lcElement);
                }
                set[element] = !0;
            }
            return set;
        }
        function clone(object) {
            var newObject = create(null), property = void 0;
            for (property in object) apply(hasOwnProperty, object, [ property ]) && (newObject[property] = object[property]);
            return newObject;
        }
        var html = freeze([ "a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr" ]), svg = freeze([ "svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "audio", "canvas", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "video", "view", "vkern" ]), svgFilters = freeze([ "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence" ]), mathMl = freeze([ "math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover" ]), text = freeze([ "#text" ]), html$1 = freeze([ "accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "xmlns" ]), svg$1 = freeze([ "accent-height", "accumulate", "additive", "alignment-baseline", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "targetx", "targety", "transform", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan" ]), mathMl$1 = freeze([ "accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns" ]), xml = freeze([ "xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink" ]), MUSTACHE_EXPR = seal(/\{\{[\s\S]*|[\s\S]*\}\}/gm), ERB_EXPR = seal(/<%[\s\S]*|[\s\S]*%>/gm), DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]/), ARIA_ATTR = seal(/^aria-[\-\w]+$/), IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i), ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        function _toConsumableArray$1(arr) {
            if (Array.isArray(arr)) {
                for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
                return arr2;
            }
            return Array.from(arr);
        }
        var getGlobal = function() {
            return "undefined" == typeof window ? null : window;
        }, _createTrustedTypesPolicy = function(trustedTypes, document) {
            if ("object" !== (void 0 === trustedTypes ? "undefined" : _typeof(trustedTypes)) || "function" != typeof trustedTypes.createPolicy) return null;
            var suffix = null;
            document.currentScript && document.currentScript.hasAttribute("data-tt-policy-suffix") && (suffix = document.currentScript.getAttribute("data-tt-policy-suffix"));
            var policyName = "dompurify" + (suffix ? "#" + suffix : "");
            try {
                return trustedTypes.createPolicy(policyName, {
                    createHTML: function(html$$1) {
                        return html$$1;
                    }
                });
            } catch (_) {
                return console.warn("TrustedTypes policy " + policyName + " could not be created."),
                null;
            }
        };
        return function createDOMPurify() {
            var window = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : getGlobal(), DOMPurify = function(root) {
                return createDOMPurify(root);
            };
            if (DOMPurify.version = "2.1.1", DOMPurify.removed = [], !window || !window.document || 9 !== window.document.nodeType) return DOMPurify.isSupported = !1,
            DOMPurify;
            var originalDocument = window.document, document = window.document, DocumentFragment = window.DocumentFragment, HTMLTemplateElement = window.HTMLTemplateElement, Node = window.Node, NodeFilter = window.NodeFilter, _window$NamedNodeMap = window.NamedNodeMap, NamedNodeMap = void 0 === _window$NamedNodeMap ? window.NamedNodeMap || window.MozNamedAttrMap : _window$NamedNodeMap, Text = window.Text, Comment = window.Comment, DOMParser = window.DOMParser, trustedTypes = window.trustedTypes;
            if ("function" == typeof HTMLTemplateElement) {
                var template = document.createElement("template");
                template.content && template.content.ownerDocument && (document = template.content.ownerDocument);
            }
            var trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, originalDocument), emptyHTML = trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML("") : "", _document = document, implementation = _document.implementation, createNodeIterator = _document.createNodeIterator, getElementsByTagName = _document.getElementsByTagName, createDocumentFragment = _document.createDocumentFragment, importNode = originalDocument.importNode, documentMode = {};
            try {
                documentMode = clone(document).documentMode ? document.documentMode : {};
            } catch (_) {}
            var hooks = {};
            DOMPurify.isSupported = implementation && void 0 !== implementation.createHTMLDocument && 9 !== documentMode;
            var MUSTACHE_EXPR$$1 = MUSTACHE_EXPR, ERB_EXPR$$1 = ERB_EXPR, DATA_ATTR$$1 = DATA_ATTR, ARIA_ATTR$$1 = ARIA_ATTR, IS_SCRIPT_OR_DATA$$1 = IS_SCRIPT_OR_DATA, ATTR_WHITESPACE$$1 = ATTR_WHITESPACE, IS_ALLOWED_URI$$1 = IS_ALLOWED_URI, ALLOWED_TAGS = null, DEFAULT_ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray$1(html), _toConsumableArray$1(svg), _toConsumableArray$1(svgFilters), _toConsumableArray$1(mathMl), _toConsumableArray$1(text))), ALLOWED_ATTR = null, DEFAULT_ALLOWED_ATTR = addToSet({}, [].concat(_toConsumableArray$1(html$1), _toConsumableArray$1(svg$1), _toConsumableArray$1(mathMl$1), _toConsumableArray$1(xml))), FORBID_TAGS = null, FORBID_ATTR = null, ALLOW_ARIA_ATTR = !0, ALLOW_DATA_ATTR = !0, ALLOW_UNKNOWN_PROTOCOLS = !1, SAFE_FOR_TEMPLATES = !1, WHOLE_DOCUMENT = !1, SET_CONFIG = !1, FORCE_BODY = !1, RETURN_DOM = !1, RETURN_DOM_FRAGMENT = !1, RETURN_DOM_IMPORT = !1, RETURN_TRUSTED_TYPE = !1, SANITIZE_DOM = !0, KEEP_CONTENT = !0, IN_PLACE = !1, USE_PROFILES = {}, FORBID_CONTENTS = addToSet({}, [ "annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp" ]), DATA_URI_TAGS = null, DEFAULT_DATA_URI_TAGS = addToSet({}, [ "audio", "video", "img", "source", "image", "track" ]), URI_SAFE_ATTRIBUTES = null, DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, [ "alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "summary", "title", "value", "style", "xmlns" ]), CONFIG = null, formElement = document.createElement("form"), _parseConfig = function(cfg) {
                CONFIG && CONFIG === cfg || (cfg && "object" === (void 0 === cfg ? "undefined" : _typeof(cfg)) || (cfg = {}),
                cfg = clone(cfg), ALLOWED_TAGS = "ALLOWED_TAGS" in cfg ? addToSet({}, cfg.ALLOWED_TAGS) : DEFAULT_ALLOWED_TAGS,
                ALLOWED_ATTR = "ALLOWED_ATTR" in cfg ? addToSet({}, cfg.ALLOWED_ATTR) : DEFAULT_ALLOWED_ATTR,
                URI_SAFE_ATTRIBUTES = "ADD_URI_SAFE_ATTR" in cfg ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR) : DEFAULT_URI_SAFE_ATTRIBUTES,
                DATA_URI_TAGS = "ADD_DATA_URI_TAGS" in cfg ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS) : DEFAULT_DATA_URI_TAGS,
                FORBID_TAGS = "FORBID_TAGS" in cfg ? addToSet({}, cfg.FORBID_TAGS) : {}, FORBID_ATTR = "FORBID_ATTR" in cfg ? addToSet({}, cfg.FORBID_ATTR) : {},
                USE_PROFILES = "USE_PROFILES" in cfg && cfg.USE_PROFILES, ALLOW_ARIA_ATTR = !1 !== cfg.ALLOW_ARIA_ATTR,
                ALLOW_DATA_ATTR = !1 !== cfg.ALLOW_DATA_ATTR, ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || !1,
                SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || !1, WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || !1,
                RETURN_DOM = cfg.RETURN_DOM || !1, RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || !1,
                RETURN_DOM_IMPORT = cfg.RETURN_DOM_IMPORT || !1, RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || !1,
                FORCE_BODY = cfg.FORCE_BODY || !1, SANITIZE_DOM = !1 !== cfg.SANITIZE_DOM, KEEP_CONTENT = !1 !== cfg.KEEP_CONTENT,
                IN_PLACE = cfg.IN_PLACE || !1, IS_ALLOWED_URI$$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI$$1,
                SAFE_FOR_TEMPLATES && (ALLOW_DATA_ATTR = !1), RETURN_DOM_FRAGMENT && (RETURN_DOM = !0),
                USE_PROFILES && (ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray$1(text))),
                ALLOWED_ATTR = [], !0 === USE_PROFILES.html && (addToSet(ALLOWED_TAGS, html), addToSet(ALLOWED_ATTR, html$1)),
                !0 === USE_PROFILES.svg && (addToSet(ALLOWED_TAGS, svg), addToSet(ALLOWED_ATTR, svg$1),
                addToSet(ALLOWED_ATTR, xml)), !0 === USE_PROFILES.svgFilters && (addToSet(ALLOWED_TAGS, svgFilters),
                addToSet(ALLOWED_ATTR, svg$1), addToSet(ALLOWED_ATTR, xml)), !0 === USE_PROFILES.mathMl && (addToSet(ALLOWED_TAGS, mathMl),
                addToSet(ALLOWED_ATTR, mathMl$1), addToSet(ALLOWED_ATTR, xml))), cfg.ADD_TAGS && (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS && (ALLOWED_TAGS = clone(ALLOWED_TAGS)),
                addToSet(ALLOWED_TAGS, cfg.ADD_TAGS)), cfg.ADD_ATTR && (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR && (ALLOWED_ATTR = clone(ALLOWED_ATTR)),
                addToSet(ALLOWED_ATTR, cfg.ADD_ATTR)), cfg.ADD_URI_SAFE_ATTR && addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR),
                KEEP_CONTENT && (ALLOWED_TAGS["#text"] = !0), WHOLE_DOCUMENT && addToSet(ALLOWED_TAGS, [ "html", "head", "body" ]),
                ALLOWED_TAGS.table && (addToSet(ALLOWED_TAGS, [ "tbody" ]), delete FORBID_TAGS.tbody),
                freeze && freeze(cfg), CONFIG = cfg);
            }, _forceRemove = function(node) {
                arrayPush(DOMPurify.removed, {
                    element: node
                });
                try {
                    node.parentNode.removeChild(node);
                } catch (_) {
                    node.outerHTML = emptyHTML;
                }
            }, _removeAttribute = function(name, node) {
                try {
                    arrayPush(DOMPurify.removed, {
                        attribute: node.getAttributeNode(name),
                        from: node
                    });
                } catch (_) {
                    arrayPush(DOMPurify.removed, {
                        attribute: null,
                        from: node
                    });
                }
                node.removeAttribute(name);
            }, _initDocument = function(dirty) {
                var doc = void 0, leadingWhitespace = void 0;
                if (FORCE_BODY) dirty = "<remove></remove>" + dirty; else {
                    var matches = stringMatch(dirty, /^[\r\n\t ]+/);
                    leadingWhitespace = matches && matches[0];
                }
                var dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
                try {
                    doc = (new DOMParser).parseFromString(dirtyPayload, "text/html");
                } catch (_) {}
                if (!doc || !doc.documentElement) {
                    var body = (doc = implementation.createHTMLDocument("")).body;
                    body.parentNode.removeChild(body.parentNode.firstElementChild), body.outerHTML = dirtyPayload;
                }
                return dirty && leadingWhitespace && doc.body.insertBefore(document.createTextNode(leadingWhitespace), doc.body.childNodes[0] || null),
                getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
            }, _createIterator = function(root) {
                return createNodeIterator.call(root.ownerDocument || root, root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT, (function() {
                    return NodeFilter.FILTER_ACCEPT;
                }), !1);
            }, _isClobbered = function(elm) {
                return !(elm instanceof Text || elm instanceof Comment || "string" == typeof elm.nodeName && "string" == typeof elm.textContent && "function" == typeof elm.removeChild && elm.attributes instanceof NamedNodeMap && "function" == typeof elm.removeAttribute && "function" == typeof elm.setAttribute && "string" == typeof elm.namespaceURI);
            }, _isNode = function(object) {
                return "object" === (void 0 === Node ? "undefined" : _typeof(Node)) ? object instanceof Node : object && "object" === (void 0 === object ? "undefined" : _typeof(object)) && "number" == typeof object.nodeType && "string" == typeof object.nodeName;
            }, _executeHook = function(entryPoint, currentNode, data) {
                hooks[entryPoint] && arrayForEach(hooks[entryPoint], (function(hook) {
                    hook.call(DOMPurify, currentNode, data, CONFIG);
                }));
            }, _sanitizeElements = function(currentNode) {
                var content = void 0;
                if (_executeHook("beforeSanitizeElements", currentNode, null), _isClobbered(currentNode)) return _forceRemove(currentNode),
                !0;
                if (stringMatch(currentNode.nodeName, /[\u0080-\uFFFF]/)) return _forceRemove(currentNode),
                !0;
                var tagName = stringToLowerCase(currentNode.nodeName);
                if (_executeHook("uponSanitizeElement", currentNode, {
                    tagName: tagName,
                    allowedTags: ALLOWED_TAGS
                }), ("svg" === tagName || "math" === tagName) && 0 !== currentNode.querySelectorAll("p, br").length) return _forceRemove(currentNode),
                !0;
                if (!_isNode(currentNode.firstElementChild) && (!_isNode(currentNode.content) || !_isNode(currentNode.content.firstElementChild)) && regExpTest(/<[!/\w]/g, currentNode.innerHTML) && regExpTest(/<[!/\w]/g, currentNode.textContent)) return _forceRemove(currentNode),
                !0;
                if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
                    if (KEEP_CONTENT && !FORBID_CONTENTS[tagName] && "function" == typeof currentNode.insertAdjacentHTML) try {
                        var htmlToInsert = currentNode.innerHTML;
                        currentNode.insertAdjacentHTML("AfterEnd", trustedTypesPolicy ? trustedTypesPolicy.createHTML(htmlToInsert) : htmlToInsert);
                    } catch (_) {}
                    return _forceRemove(currentNode), !0;
                }
                return "noscript" !== tagName && "noembed" !== tagName || !regExpTest(/<\/no(script|embed)/i, currentNode.innerHTML) ? (SAFE_FOR_TEMPLATES && 3 === currentNode.nodeType && (content = currentNode.textContent,
                content = stringReplace(content, MUSTACHE_EXPR$$1, " "), content = stringReplace(content, ERB_EXPR$$1, " "),
                currentNode.textContent !== content && (arrayPush(DOMPurify.removed, {
                    element: currentNode.cloneNode()
                }), currentNode.textContent = content)), _executeHook("afterSanitizeElements", currentNode, null),
                !1) : (_forceRemove(currentNode), !0);
            }, _isValidAttribute = function(lcTag, lcName, value) {
                if (SANITIZE_DOM && ("id" === lcName || "name" === lcName) && (value in document || value in formElement)) return !1;
                if (ALLOW_DATA_ATTR && regExpTest(DATA_ATTR$$1, lcName)) ; else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$$1, lcName)) ; else {
                    if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) return !1;
                    if (URI_SAFE_ATTRIBUTES[lcName]) ; else if (regExpTest(IS_ALLOWED_URI$$1, stringReplace(value, ATTR_WHITESPACE$$1, ""))) ; else if ("src" !== lcName && "xlink:href" !== lcName && "href" !== lcName || "script" === lcTag || 0 !== stringIndexOf(value, "data:") || !DATA_URI_TAGS[lcTag]) if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$$1, stringReplace(value, ATTR_WHITESPACE$$1, ""))) ; else if (value) return !1;
                }
                return !0;
            }, _sanitizeAttributes = function(currentNode) {
                var attr = void 0, value = void 0, lcName = void 0, l = void 0;
                _executeHook("beforeSanitizeAttributes", currentNode, null);
                var attributes = currentNode.attributes;
                if (attributes) {
                    var hookEvent = {
                        attrName: "",
                        attrValue: "",
                        keepAttr: !0,
                        allowedAttributes: ALLOWED_ATTR
                    };
                    for (l = attributes.length; l--; ) {
                        var _attr = attr = attributes[l], name = _attr.name, namespaceURI = _attr.namespaceURI;
                        if (value = stringTrim(attr.value), lcName = stringToLowerCase(name), hookEvent.attrName = lcName,
                        hookEvent.attrValue = value, hookEvent.keepAttr = !0, hookEvent.forceKeepAttr = void 0,
                        _executeHook("uponSanitizeAttribute", currentNode, hookEvent), value = hookEvent.attrValue,
                        !hookEvent.forceKeepAttr && (_removeAttribute(name, currentNode), hookEvent.keepAttr)) if (regExpTest(/\/>/i, value)) _removeAttribute(name, currentNode); else {
                            SAFE_FOR_TEMPLATES && (value = stringReplace(value, MUSTACHE_EXPR$$1, " "), value = stringReplace(value, ERB_EXPR$$1, " "));
                            var lcTag = currentNode.nodeName.toLowerCase();
                            if (_isValidAttribute(lcTag, lcName, value)) try {
                                namespaceURI ? currentNode.setAttributeNS(namespaceURI, name, value) : currentNode.setAttribute(name, value),
                                arrayPop(DOMPurify.removed);
                            } catch (_) {}
                        }
                    }
                    _executeHook("afterSanitizeAttributes", currentNode, null);
                }
            }, _sanitizeShadowDOM = function _sanitizeShadowDOM(fragment) {
                var shadowNode = void 0, shadowIterator = _createIterator(fragment);
                for (_executeHook("beforeSanitizeShadowDOM", fragment, null); shadowNode = shadowIterator.nextNode(); ) _executeHook("uponSanitizeShadowNode", shadowNode, null),
                _sanitizeElements(shadowNode) || (shadowNode.content instanceof DocumentFragment && _sanitizeShadowDOM(shadowNode.content),
                _sanitizeAttributes(shadowNode));
                _executeHook("afterSanitizeShadowDOM", fragment, null);
            };
            return DOMPurify.sanitize = function(dirty, cfg) {
                var body = void 0, importedNode = void 0, currentNode = void 0, oldNode = void 0, returnNode = void 0;
                if (dirty || (dirty = "\x3c!--\x3e"), "string" != typeof dirty && !_isNode(dirty)) {
                    if ("function" != typeof dirty.toString) throw typeErrorCreate("toString is not a function");
                    if ("string" != typeof (dirty = dirty.toString())) throw typeErrorCreate("dirty is not a string, aborting");
                }
                if (!DOMPurify.isSupported) {
                    if ("object" === _typeof(window.toStaticHTML) || "function" == typeof window.toStaticHTML) {
                        if ("string" == typeof dirty) return window.toStaticHTML(dirty);
                        if (_isNode(dirty)) return window.toStaticHTML(dirty.outerHTML);
                    }
                    return dirty;
                }
                if (SET_CONFIG || _parseConfig(cfg), DOMPurify.removed = [], "string" == typeof dirty && (IN_PLACE = !1),
                IN_PLACE) ; else if (dirty instanceof Node) 1 === (importedNode = (body = _initDocument("\x3c!----\x3e")).ownerDocument.importNode(dirty, !0)).nodeType && "BODY" === importedNode.nodeName || "HTML" === importedNode.nodeName ? body = importedNode : body.appendChild(importedNode); else {
                    if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && -1 === dirty.indexOf("<")) return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
                    if (!(body = _initDocument(dirty))) return RETURN_DOM ? null : emptyHTML;
                }
                body && FORCE_BODY && _forceRemove(body.firstChild);
                for (var nodeIterator = _createIterator(IN_PLACE ? dirty : body); currentNode = nodeIterator.nextNode(); ) 3 === currentNode.nodeType && currentNode === oldNode || _sanitizeElements(currentNode) || (currentNode.content instanceof DocumentFragment && _sanitizeShadowDOM(currentNode.content),
                _sanitizeAttributes(currentNode), oldNode = currentNode);
                if (oldNode = null, IN_PLACE) return dirty;
                if (RETURN_DOM) {
                    if (RETURN_DOM_FRAGMENT) for (returnNode = createDocumentFragment.call(body.ownerDocument); body.firstChild; ) returnNode.appendChild(body.firstChild); else returnNode = body;
                    return RETURN_DOM_IMPORT && (returnNode = importNode.call(originalDocument, returnNode, !0)),
                    returnNode;
                }
                var serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
                return SAFE_FOR_TEMPLATES && (serializedHTML = stringReplace(serializedHTML, MUSTACHE_EXPR$$1, " "),
                serializedHTML = stringReplace(serializedHTML, ERB_EXPR$$1, " ")), trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
            }, DOMPurify.setConfig = function(cfg) {
                _parseConfig(cfg), SET_CONFIG = !0;
            }, DOMPurify.clearConfig = function() {
                CONFIG = null, SET_CONFIG = !1;
            }, DOMPurify.isValidAttribute = function(tag, attr, value) {
                CONFIG || _parseConfig({});
                var lcTag = stringToLowerCase(tag), lcName = stringToLowerCase(attr);
                return _isValidAttribute(lcTag, lcName, value);
            }, DOMPurify.addHook = function(entryPoint, hookFunction) {
                "function" == typeof hookFunction && (hooks[entryPoint] = hooks[entryPoint] || [],
                arrayPush(hooks[entryPoint], hookFunction));
            }, DOMPurify.removeHook = function(entryPoint) {
                hooks[entryPoint] && arrayPop(hooks[entryPoint]);
            }, DOMPurify.removeHooks = function(entryPoint) {
                hooks[entryPoint] && (hooks[entryPoint] = []);
            }, DOMPurify.removeAllHooks = function() {
                hooks = {};
            }, DOMPurify;
        }();
    }();
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    (function(j) {
        __webpack_require__.d(__webpack_exports__, "a", (function() {
            return userscriptLegacy;
        }));
        var __awaiter = function(thisArg, _arguments, P, generator) {
            return new (P || (P = Promise))((function(resolve, reject) {
                function fulfilled(value) {
                    try {
                        step(generator.next(value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function rejected(value) {
                    try {
                        step(generator.throw(value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function step(result) {
                    var value;
                    result.done ? resolve(result.value) : (value = result.value, value instanceof P ? value : new P((function(resolve) {
                        resolve(value);
                    }))).then(fulfilled, rejected);
                }
                step((generator = generator.apply(thisArg, _arguments || [])).next());
            }));
        };
        const userscriptLegacy = {
            set(key, value) {
                return __awaiter(this, void 0, void 0, (function*() {
                    GM_setValue(key, value);
                }));
            },
            get(key) {
                return __awaiter(this, void 0, void 0, (function*() {
                    return GM_getValue(key);
                }));
            },
            remove(key) {
                return __awaiter(this, void 0, void 0, (function*() {
                    GM_deleteValue(key);
                }));
            },
            list() {
                return __awaiter(this, void 0, void 0, (function*() {
                    const reverseArray = {};
                    return j.$.each(GM_listValues(), (function(index, cache) {
                        reverseArray[cache] = index;
                    })), reverseArray;
                }));
            },
            addStyle(css) {
                return __awaiter(this, void 0, void 0, (function*() {
                    GM_addStyle(css);
                }));
            },
            version: () => GM_info.script.version,
            lang(selector, args) {
                let message = i18n[selector];
                if (void 0 !== args) for (let argIndex = 0; argIndex < args.length; argIndex++) message = message.replace("$" + (argIndex + 1), args[argIndex]);
                return message;
            },
            assetUrl: filename => "https://raw.githubusercontent.com/MALSync/MALSync/master/assets/assets/" + filename,
            injectCssResource(res, head) {
                head.append(j.$("<style>").attr("rel", "stylesheet").attr("type", "text/css").html(GM_getResourceText(res)));
            },
            injectjsResource(res, head) {
                const s = document.createElement("script");
                s.text = GM_getResourceText(res), s.onload = function() {
                    this.remove();
                }, head.get(0).appendChild(s);
            },
            updateDom(head) {
                const s = document.createElement("script");
                s.text = "\n        document.getElementsByTagName('head')[0].onclick = function(e){\n          try{\n            componentHandler.upgradeDom();\n          }catch(e){\n            console.log(e);\n            setTimeout(function(){\n              componentHandler.upgradeDom();\n            },500);\n          }\n        }",
                s.onload = function() {
                    this.remove();
                }, head.get(0).appendChild(s);
            },
            storageOnChanged(cb) {}
        };
    }).call(this, __webpack_require__(3));
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    (function(con, api) {
        __webpack_require__.d(__webpack_exports__, "a", (function() {
            return requestUserscriptLegacy;
        }));
        var _background_notifications__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7), __awaiter = function(thisArg, _arguments, P, generator) {
            return new (P || (P = Promise))((function(resolve, reject) {
                function fulfilled(value) {
                    try {
                        step(generator.next(value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function rejected(value) {
                    try {
                        step(generator.throw(value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function step(result) {
                    var value;
                    result.done ? resolve(result.value) : (value = result.value, value instanceof P ? value : new P((function(resolve) {
                        resolve(value);
                    }))).then(fulfilled, rejected);
                }
                step((generator = generator.apply(thisArg, _arguments || [])).next());
            }));
        };
        const requestUserscriptLegacy = {
            xhr(method, url) {
                return __awaiter(this, void 0, void 0, (function*() {
                    return new Promise((resolve, reject) => {
                        const request = {
                            method: method,
                            url: url,
                            synchronous: !1,
                            headers: {},
                            data: null,
                            onload(response) {
                                if (console.log(response), 429 === response.status) return con.error("RATE LIMIT"),
                                api.storage.set("rateLimit", !0), void setTimeout(() => {
                                    api.storage.set("rateLimit", !1), resolve(requestUserscriptLegacy.xhr(method, url));
                                }, 1e4);
                                const responseObj = {
                                    finalUrl: response.finalUrl,
                                    responseText: response.responseText,
                                    status: response.status
                                };
                                resolve(responseObj);
                            }
                        };
                        "object" == typeof url && (request.url = url.url, request.headers = url.headers,
                        request.data = url.data), request.url.includes("malsync.moe") && (request.headers.version = api.storage.version(),
                        request.headers.type = "userscript"), GM_xmlhttpRequest(request);
                    });
                }));
            },
            notification(options) {
                var _a;
                GM_notification({
                    title: options.title,
                    text: options.text,
                    image: null !== (_a = options.image) && void 0 !== _a ? _a : _background_notifications__WEBPACK_IMPORTED_MODULE_0__.a,
                    timeout: options.sticky ? 0 : 10,
                    onclick: () => {
                        window.open(options.url, "_blank");
                    }
                });
            }
        };
    }).call(this, __webpack_require__(1), __webpack_require__(0));
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    (function(con) {
        __webpack_require__.d(__webpack_exports__, "a", (function() {
            return defaultImg;
        }));
        const defaultImg = "https://raw.githubusercontent.com/MALSync/MALSync/master/assets/icons/icon128.png";
    }).call(this, __webpack_require__(1));
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    (function(api, con, utils) {
        __webpack_require__.d(__webpack_exports__, "a", (function() {
            return settingsObj;
        }));
        var __awaiter = function(thisArg, _arguments, P, generator) {
            return new (P || (P = Promise))((function(resolve, reject) {
                function fulfilled(value) {
                    try {
                        step(generator.next(value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function rejected(value) {
                    try {
                        step(generator.throw(value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function step(result) {
                    var value;
                    result.done ? resolve(result.value) : (value = result.value, value instanceof P ? value : new P((function(resolve) {
                        resolve(value);
                    }))).then(fulfilled, rejected);
                }
                step((generator = generator.apply(thisArg, _arguments || [])).next());
            }));
        };
        const settingsObj = {
            options: {
                autoTrackingModeanime: "video",
                autoTrackingModemanga: "instant",
                enablePages: {},
                forceEn: !1,
                rpc: !0,
                presenceHidePage: !1,
                presenceShowButtons: !0,
                userscriptModeButton: !1,
                syncMode: "MAL",
                syncModeSimkl: "MAL",
                localSync: !0,
                delay: 0,
                videoDuration: 85,
                malTags: !1,
                malContinue: !0,
                malResume: !0,
                usedPage: !0,
                epPredictions: !0,
                theme: "auto",
                minimalWindow: !1,
                posLeft: "left",
                miniMALonMal: !1,
                floatButtonStealth: !1,
                minimizeBigPopup: !1,
                floatButtonCorrection: !1,
                floatButtonHide: !1,
                autoCloseMinimal: !1,
                outWay: !0,
                miniMalWidth: "500px",
                miniMalHeight: "90%",
                malThumbnail: 100,
                friendScore: !0,
                loadPTWForProgress: !1,
                quicklinks: [ "9anime", "Crunchyroll", "Gogoanime", "Twistmoe", "Mangadex", "MangaNato", "AnimeSimple", "animepahe", "MangaFox", "MangaSee", "YugenAnime", "AniMixPlay", "Zoro", "Funimation", "Hulu", "Netflix", "AnimeLab", "Hidive", "Vrv", "VIZ", "MangaPlus" ],
                autofull: !1,
                autoresume: !1,
                autoNextEp: !1,
                highlightAllEp: !1,
                checkForFiller: !0,
                introSkip: 85,
                introSkipFwd: [ 17, 39 ],
                introSkipBwd: [ 17, 37 ],
                nextEpShort: [],
                correctionShort: [ 67 ],
                syncShort: [],
                progressInterval: 120,
                progressIntervalDefaultAnime: "en/sub",
                progressIntervalDefaultManga: "en/sub",
                progressNotifications: !0,
                updateCheckNotifications: !0,
                bookMarksList: !1,
                customDomains: [],
                anilistToken: "",
                anilistOptions: {
                    displayAdultContent: !0,
                    scoreFormat: "POINT_10"
                },
                kitsuToken: "",
                kitsuOptions: {
                    titleLanguagePreference: "canonical",
                    sfwFilter: !1,
                    ratingSystem: "regular"
                },
                simklToken: "",
                malToken: "",
                malRefresh: ""
            },
            init() {
                return __awaiter(this, void 0, void 0, (function*() {
                    for (const key in this.options) {
                        const store = yield api.storage.get("settings/" + key);
                        void 0 !== store && (this.options[key] = store);
                    }
                    return con.log("Settings", this.options), api.storage.storageOnChanged((changes, namespace) => {
                        if ("sync" === namespace) for (const key in changes) {
                            const storageChange = changes[key];
                            /^settings\//i.test(key) && (this.options[key.replace("settings/", "")] = storageChange.newValue,
                            con.info(`Update ${key} option to ${storageChange.newValue}`));
                        }
                        if ("local" === namespace && changes.rateLimit) try {
                            changes.rateLimit.newValue ? (con.log("Rate limited"), utils.flashm("Rate limited. Retrying in a moment", {
                                error: !0,
                                type: "rate",
                                permanent: !0
                            })) : (con.log("No Rate limited"), $(".type-rate").remove());
                        } catch (e) {
                            con.error(e);
                        }
                    }), this;
                }));
            },
            get(name) {
                return this.options[name];
            },
            set(name, value) {
                if (!Object.prototype.hasOwnProperty.call(this.options, name)) {
                    const err = Error(name + " is not a defined option");
                    throw con.error(err), err;
                }
                return this.options[name] = value, api.storage.set("settings/" + name, value);
            },
            getAsync(name) {
                return __awaiter(this, void 0, void 0, (function*() {
                    const value = yield api.storage.get("settings/" + name);
                    return void 0 === value && void 0 !== this.options[name] ? this.options[name] : value;
                }));
            }
        };
    }).call(this, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2));
}, function(module, exports, __webpack_require__) {
    "use strict";
    (function(utils, api) {
        console.log("%cMAL-Sync", "font-size: 40px; padding-bottom: 3px; color: white; text-shadow: -1px -1px #2e51a2, 1px -1px #2e51a2, -1px 1px #2e51a2, 1px 1px #2e51a2, 2px 2px #2e51a2, 3px 3px #2e51a2;", "Version: " + api.storage.version()),
        utils.flashm('\n    <div style="max-width: 800px;">\n      <a href="https://malsync.moe/" style="display: block; text-decoration: none; font-size: 20px; margin-bottom: 15px; color: #f43b7a;">Mal-Sync</a>\n      <div style="text-align: left;">\n        Because of a limitiation in the Greasyfork platform, we can\'t continue to provide the script on there.\n        Please delete this userscript, don\'t forget to backup everything you need, and use the webextensions or the github hosted version of the userscript.\n      </div>\n      <a style="display: block; margin-top: 10px; color: #f43b7a; text-align: left;" href="https://chrome.google.com/webstore/detail/mal-sync/kekjfbackdeiabghhcdklcdoekaanoel?hl=en">Chrome</a>\n      <a style="display: block; margin-top: 10px; color: #f43b7a; text-align: left;" href="https://addons.mozilla.org/en-US/firefox/addon/mal-sync/">Firefox</a>\n      <a style="display: block; margin-top: 10px; color: #f43b7a; text-align: left;" href="https://github.com/MALSync/MALSync/releases/latest/download/malsync.user.js">Userscript</a>\n    </div>\n    ', {
            permanent: !0,
            position: "top"
        });
    }).call(this, __webpack_require__(2), __webpack_require__(0));
} ]);