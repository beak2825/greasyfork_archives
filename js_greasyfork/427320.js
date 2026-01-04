// ==UserScript==
// @name           [IMDb] Quick Search
// @name:tr        [IMDb] Hızlı Arama
// @description    It adds quick seach buttons for other sites on IMDb.
// @description:tr IMDb'ye başka siteler için hızlı arama butonu ekler.
// @author         nht.ctn
// @namespace      https://github.com/nhtctn
// @version        2.70

// @license        MIT
// @icon           https://images2.imgbox.com/a2/50/J4jKvYWH_o.png

// @match          *://*.imdb.com/title/*
// @match          *://subscene.com/subtitles/title?q=*
// @match          *://*turkanime.co/?q=*

// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_addValueChangeListener
// @grant          GM_registerMenuCommand
// @run-at         document-idle

// @require	       https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require        https://greasyfork.org/scripts/427315-url-based-search-for-some-websites/code/URL%20Based%20Search%20for%20Some%20Websites.js?version=936416
// @downloadURL https://update.greasyfork.org/scripts/427320/%5BIMDb%5D%20Quick%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/427320/%5BIMDb%5D%20Quick%20Search.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
/* global $ */

(function() {
    'use strict';

`
// @match      *://*turkanime.net/?q=*
`

//	const crtl = {
//		topBar: 1, //
//		//================================================================
//		torrent: 1, // If you dont want a group, turn the value of it to 0.
//		anime: 1,
//		drama: 1,
//	};

//        URL Variables:         @Movie             @Series          @Episode         @Non-English

//        %title%         ->     Fight Club         Dexter           Dexter           Parasite
//        %year%          ->     1999               2006             ""               2019
//        %title_year%    ->     Fight Club 1999    Dexter           Dexter           Parasite 2019        // This variable calls year for only movies, not series. If you want year in both case, use this: %title%+%year%
//        %org_title%     ->     Fight Club         Dexter           ""               Gisaengchung         // Actually it returns same as %title% in episode pages. It is not possible to get orginal title from there.
//        %imdbid%        ->     0137523            0773262          0773262          6751668
//        %ttimdbid%      ->     tt0137523          tt0773262        tt0773262        tt6751668

	const sites = [
		{ name: "PlanetDP",            hidden: 1, url: "https://www.planetdp.org/movie/search?title=%ttimdbid%",                        icon: "https://images2.imgbox.com/fc/77/EFoYyf12_o.png", },
		{ name: "PlanetDP Forum",      hidden: 1, url: "http://forum.planetdp.org/index.php?/search/&q=%title%",                        icon: "https://images2.imgbox.com/b9/1d/mMZ0k950_o.png", },
		{ name: 'IMDB Kutusu (Forum)', hidden: 1, url: 'http://forum.planetdp.org/index.php?/search/&q=%ttimdbid%',                     icon: 'https://images2.imgbox.com/a0/de/q9nkl3Ot_o.png', },
		{ name: 'ForumDP TAG',         hidden: 1, url: 'http://forum.planetdp.org/index.php?/tags/%ttimdbid%',                          icon: 'https://images2.imgbox.com/11/27/hxxGZh9x_o.png', },
		{ name: 'Youtube',             hidden: 0, url: 'https://www.youtube.com/results?search_query=%title%+trailer',                  icon: 'https://images2.imgbox.com/43/65/k7wbhSal_o.png', },
		{ name: 'Official Website',    hidden: 0, url: 'https://www.google.com.tr/search?q=%title%+official+website',                   icon: 'https://images2.imgbox.com/63/af/U8W35AyF_o.png', },
		{ name: 'TheMovieDB',          hidden: 0, url: 'https://www.themoviedb.org/search?query=%title%',                               icon: 'https://images2.imgbox.com/cc/ba/AmRxFc36_o.png', },
		{ name: 'TheTVDB',             hidden: 0, url: 'https://www.thetvdb.com/search?query=%title%',                                  icon: 'https://images2.imgbox.com/85/50/WViQFyra_o.png', },
		{ name: 'BeyazPerde',          hidden: 0, url: 'https://www.beyazperde.com/aramak/?q=%title%',                                  icon: 'https://images2.imgbox.com/15/ce/BydtnSMH_o.png', },
		{ name: 'Rottentomatoes',      hidden: 0, url: 'http://www.rottentomatoes.com/search/?search=%title%',                          icon: 'https://images2.imgbox.com/fc/0a/pm8N3AWv_o.png', },
		{ name: 'Metacritic',          hidden: 0, url: 'https://www.metacritic.com/search/all/%title%/results',                         icon: 'https://images2.imgbox.com/ce/b0/OmF70Xo6_o.png', },
		{ name: 'Trakt',               hidden: 0, url: 'https://trakt.tv/search/imdb?query=%ttimdbid%',                                 icon: 'https://images2.imgbox.com/b9/55/Scyuh64R_o.png', },
		{ name: 'IcheckMovies',        hidden: 0, url: 'http://www.icheckmovies.com/search/movies/?query=%ttimdbid%',                   icon: 'https://images2.imgbox.com/f2/d6/fQRQ8Quz_o.png', },
		{ name: 'Letterboxd',          hidden: 0, url: 'https://letterboxd.com/search/films/%ttimdbid%',                                icon: 'https://images2.imgbox.com/26/8f/a0pCUa2W_o.png', },
		{ name: 'Criticker',           hidden: 0, url: 'https://www.criticker.com/?search=%ttimdbid%',                                  icon: 'https://images2.imgbox.com/f4/83/L04pazdG_o.png', },
		{ name: 'ALLMOVIE',            hidden: 1, url: 'https://www.allmovie.com/search/movies/%title%',                                icon: 'https://images2.imgbox.com/41/7a/D8XGwR4Q_o.png', },
		{ name: 'Douban',              hidden: 0, url: 'https://movie.douban.com/subject_search?search_text=%ttimdbid%',                icon: 'https://images2.imgbox.com/96/6a/yxMwQBW9_o.png', },
		{ name: 'Box Office Mojo',     hidden: 0, url: 'http://www.boxofficemojo.com/search/?q=%title%',                                icon: 'https://images2.imgbox.com/07/8a/WdNKBfjC_o.png', },
		{ name: 'Sinemalar',           hidden: 0, url: 'https://www.sinemalar.com/ara/?type=all&q=%title%',                             icon: 'https://images2.imgbox.com/81/40/1miFBH85_o.png', },
		{ name: 'TVShow Time',         hidden: 0, url: 'https://www.google.com.tr/search?q=%title%+TVShow+Time',                        icon: 'https://images2.imgbox.com/b0/f1/yl82CbyK_o.png', },
		{ name: 'TVmaze',              hidden: 0, url: 'http://www.tvmaze.com/search?q=%title%',                                        icon: 'https://images2.imgbox.com/88/3a/nfS7SSXY_o.png', },
		{ name: 'MyDramaList',         hidden: 0, url: 'https://mydramalist.com/search?q=%title%',                                      icon: 'https://images2.imgbox.com/18/9d/voQieZdD_o.png', },
		{ name: 'MAL',                 hidden: 0, url: 'https://myanimelist.net/search/all?q=%title%',                                  icon: 'https://images2.imgbox.com/bf/8b/cQ2UnZIa_o.png', },
		{ name: 'AniDB',               hidden: 1, url: 'https://anidb.net/perl-bin/animedb.pl?adb.search=%title%&show=search&do.search=search', icon: 'https://images2.imgbox.com/3b/c9/eeUYC5n7_o.png', },
		{ name: 'LiveChart',           hidden: 1, url: 'https://www.livechart.me/search?q=%title%',                                     icon: 'https://images2.imgbox.com/85/08/C91WXD3m_o.png', },
		{ name: 'RARBG',               hidden: 0, url: 'https://rarbgmirror.com/torrents.php?search=%imdbid%',                          icon: 'https://images2.imgbox.com/34/0b/bCrT9fHL_o.png', },
		{ name: '1337x',               hidden: 0, url: 'https://www.1337x.to/sort-search/%title_year%/time/desc/1/',                    icon: 'https://images2.imgbox.com/1d/9e/mgOmJEvI_o.png', },
		{ name: 'TorrentGalaxy',       hidden: 0, url: 'https://torrentgalaxy.to/torrents.php?search=%ttimdbid%&sort=id&sort=id&order=desc', icon: 'https://images2.imgbox.com/c2/27/dGkG9vjT_o.png', },
		{ name: 'PSA',                 hidden: 0, url: 'https://psa.re/?s=%title%',                                                     icon: 'https://images2.imgbox.com/26/c1/2OXmz3tN_o.png', },
		{ name: 'YTS',                 hidden: 0, url: 'https://yts.mx/browse-movies/%ttimdbid%/',                                      icon: 'https://images2.imgbox.com/88/6b/8VxoDUos_o.png', },
		{ name: 'RuTracker',           hidden: 0, url: 'http://rutracker.org/forum/tracker.php?nm=%title_year%',                        icon: 'https://images2.imgbox.com/24/5d/kj3YSoFr_o.png', },
		{ name: 'Zamunda',             hidden: 0, url: 'http://zamunda.net/bananas?&search=%title_year%',                               icon: 'https://images2.imgbox.com/89/58/BcmHxuVW_o.png', },
		{ name: 'BTN',                 hidden: 1, url: 'http://broadcasthe.net/torrents.php?searchstr=%title_year%',                    icon: 'https://images2.imgbox.com/d4/a1/PXzzpDjb_o.png', },
		{ name: 'TorrentDay',          hidden: 0, url: 'http://www.torrentday.com/browse.php?search=%title_year%',                      icon: 'https://images2.imgbox.com/01/c0/sELs3Ft4_o.png', },
		{ name: 'CinemaGeddon',        hidden: 1, url: 'http://cinemageddon.net/browse.php?search=%imdbid%',                            icon: 'https://images2.imgbox.com/0d/9c/rkhfaakh_o.png', },
		{ name: 'KaraGarga',           hidden: 0, url: 'https://karagarga.in/browse.php?search=%imdbid%&search_type=imdb',              icon: 'https://images2.imgbox.com/cc/ea/EMx6RWyb_o.png', },
		{ name: 'Hd-T',                hidden: 1, url: 'http://hd-torrents.org/torrents.php?search=%imdbid%',                           icon: 'https://images2.imgbox.com/c1/e7/LFKIWxpN_o.png', },
		{ name: 'Filelist',            hidden: 1, url: 'http://filelist.ro/browse.php?search=%imdbid%',                                 icon: 'https://images2.imgbox.com/9e/2e/R3yGIQm7_o.png', },
		{ name: 'IPT',                 hidden: 1, url: 'http://www.iptorrents.com/t?q=%ttimdbid%',                                      icon: 'https://images2.imgbox.com/0b/49/AwbWiNMY_o.png', },
		{ name: 'PrivateHD',           hidden: 1, url: 'https://privatehd.to/torrents?in=1&search=%title%&order=age&sort=desc',         icon: 'https://images2.imgbox.com/64/a7/KBgM8R4y_o.png', },
		{ name: 'TurkTorrent',         hidden: 0, url: 'https://turktorrent.us/?p=torrents&pid=10&search_type=name&keywords=%ttimdbid%',icon: 'https://images2.imgbox.com/79/1f/Jbd4Vu5n_o.png', },
		{ name: 'Ekşi',                hidden: 1, url: 'https://eksisozluk.com/?q=%title%',                                             icon: 'https://images2.imgbox.com/e2/78/4Fejmpfi_o.png', },
		{ name: 'Vikipedi',            hidden: 1, url: 'https://www.google.com.tr/search?q=%title_year%+Turkish+Wikipedia',             icon: 'https://images2.imgbox.com/11/c7/bY5WbObT_o.png', },
		{ name: 'Wikipedia',           hidden: 0, url: 'https://www.google.com.tr/search?q=%title_year%+English+Wikipedia',             icon: 'https://images2.imgbox.com/cd/e0/OgTwm1AC_o.png', },
		{ name: 'Fandom',              hidden: 0, url: 'http://fandom.wikia.com/?s=%title%',                                            icon: 'https://images2.imgbox.com/18/73/EDiJiEBk_o.png', },
		{ name: 'IMP Awards',          hidden: 1, url: 'http://impawards.com/search.php?search_data=%title%',                           icon: 'https://images2.imgbox.com/fc/78/oxUxSfB5_o.png', },
		{ name: 'Fanart',              hidden: 0, url: 'https://fanart.tv/?sect=3&s=%title%',                                           icon: 'https://images2.imgbox.com/4b/40/6zjbxrch_o.png', },
		{ name: 'FirstShowing',        hidden: 1, url: 'https://www.firstshowing.net/?s=%title%',                                       icon: 'https://images2.imgbox.com/79/b3/F8dpZuZD_o.png', },
		{ name: 'Subscene',            hidden: 0, url: 'http://subscene.com/subtitles/title?q=%title%',                                 icon: 'https://images2.imgbox.com/b0/3b/SY0apigg_o.png', },
		{ name: 'OpenSubtitles',       hidden: 0, url: 'https://www.opensubtitles.org/en/search/sublanguageid-eng,tur/imdbid-%imdbid%', icon: 'https://images2.imgbox.com/60/3c/I7sFiFdm_o.png', },
		{ name: 'Addic7ed',            hidden: 0, url: 'https://www.addic7ed.com/search.php?search=%title%',                            icon: 'https://images2.imgbox.com/79/66/O9utGGF8_o.png', },
		{ name: 'Podnapisi',           hidden: 1, url: 'https://www.podnapisi.net/en/subtitles/search/?keywords=%title%',               icon: 'https://images2.imgbox.com/ed/a7/1tY9szFy_o.png', },
		{ name: "PlanetDP",            hidden: 0, url: "https://www.planetdp.org/movie/search?title=%ttimdbid%",                        icon: "https://images2.imgbox.com/fc/77/EFoYyf12_o.png", },
		{ name: 'Türkçe Altyazı',      hidden: 1, url: 'http://www.turkcealtyazi.org/find.php?cat=sub&find=%ttimdbid%',                 icon: 'https://images2.imgbox.com/b1/11/4ULjZm1K_o.png', },
		{ name:'Quick Search Settings',hidden: 0, url: '#',                                                                             icon: 'https://images2.imgbox.com/eb/2f/REuxbKkD_o.png', },

//		{name: "", hidden: 0, url: "", icon: "",}
//		{name: "", hidden: 0, url: "", icon: "",}
	];

	const torrentSites = [
		{ name: 'RARBG',               url: 'https://rarbgmirror.com/torrents.php?search=%imdbid%',                          icon: 'https://images2.imgbox.com/34/0b/bCrT9fHL_o.png', },
		{ name: '1337x',               url: 'https://www.1337x.to/sort-search/%title_year%/time/desc/1/',                    icon: 'https://images2.imgbox.com/1d/9e/mgOmJEvI_o.png', },
		{ name: 'Zooqle',              url: 'https://zooqle.com/search?q=%title_year%&s=ns&v=t&sd=d',                        icon: 'https://images2.imgbox.com/25/3b/Sd8La3js_o.png', },
		{ name: 'TorrentGalaxy',       url: 'https://torrentgalaxy.to/torrents.php?search=%ttimdbid%&sort=id&sort=id&order=desc', icon: 'https://images2.imgbox.com/c2/27/dGkG9vjT_o.png', },
		{ name: 'ETTV',                url: 'https://www.ettv.tv/torrents-search.php?search=%title%&sort=id&order=desc',     icon: 'https://images2.imgbox.com/fa/3e/zi3h52EA_o.png', },
		{ name: 'PSA',                 url: 'http://psarips.com/?s=%title_year%',                                            icon: 'https://images2.imgbox.com/26/c1/2OXmz3tN_o.png', },
		{ name: 'RuTracker',           url: 'http://rutracker.org/forum/tracker.php?nm=%title_year%',                        icon: 'https://images2.imgbox.com/24/5d/kj3YSoFr_o.png', },
		{ name: 'Zamunda',             url: 'http://zamunda.net/bananas?&search=%title_year%',                               icon: 'https://images2.imgbox.com/89/58/BcmHxuVW_o.png', },
		{ name: 'BTN',                 url: 'http://broadcasthe.net/torrents.php?searchstr=%title_year%',                    icon: 'https://images2.imgbox.com/d4/a1/PXzzpDjb_o.png', },
		{ name: 'TorrentDay',          url: 'http://www.torrentday.com/browse.php?search=%title_year%',                      icon: 'https://images2.imgbox.com/01/c0/sELs3Ft4_o.png', },
		{ name: 'CinemaGeddon',        url: 'http://cinemageddon.net/browse.php?search=%imdbid%',                            icon: 'https://images2.imgbox.com/0d/9c/rkhfaakh_o.png', },
		{ name: 'KaraGarga',           url: 'https://karagarga.in/browse.php?search=%imdbid%&search_type=imdb',              icon: 'https://images2.imgbox.com/cc/ea/EMx6RWyb_o.png', },
		{ name: 'Hd-T',                url: 'http://hd-torrents.org/torrents.php?search=%imdbid%',                           icon: 'https://images2.imgbox.com/c1/e7/LFKIWxpN_o.png', },
		{ name: 'Filelist',            url: 'http://filelist.ro/browse.php?search=%imdbid%',                                 icon: 'https://images2.imgbox.com/9e/2e/R3yGIQm7_o.png', },
		{ name: 'IPT',                 url: 'http://www.iptorrents.com/t?q=%ttimdbid%',                                      icon: 'https://images2.imgbox.com/0b/49/AwbWiNMY_o.png', },
		{ name: 'PrivateHD',           url: 'https://privatehd.to/torrents?in=1&search=%title%&order=age&sort=desc',         icon: 'https://images2.imgbox.com/64/a7/KBgM8R4y_o.png', },
		{ name: 'TurkTorrent',         url: 'https://turktorrent.us/?p=torrents&pid=10&q=%ttimdbid%',                        icon: 'https://images2.imgbox.com/79/1f/Jbd4Vu5n_o.png', },
	];

	var drama_sites = [
		{ name: 'MyDramaList',         url: 'https://mydramalist.com/search?q=%title%',                                      icon: 'https://images2.imgbox.com/18/9d/voQieZdD_o.png', },
		{ name: 'AsianWiki',           url: 'https://asianwiki.com/index.php?title=Special%3ASearch&search=%title%',         icon: 'https://images2.imgbox.com/73/a6/kUDT1yO9_o.png', },
		{ name: 'Hancinema',           url: 'https://www.hancinema.net/googlesearch.php?cx=partner-pub-1612871806153672%3A2t41l1-gajp&cof=FORID%3A10&ie=ISO-8859-1&hl=en&q=%title%', icon: 'https://images2.imgbox.com/46/c6/qxK0R7S4_o.png',	},
		{ name: 'Viki',                url: 'https://www.viki.com/search?q=%title%&type=series',                             icon: 'https://images2.imgbox.com/9c/46/Flf1ykIh_o.png', },
		{ name: 'Soompi',              url: 'https://www.soompi.com/search?query=%title%',                                   icon: 'https://images2.imgbox.com/d9/ab/4jDFz2WS_o.png', },
		{ name: 'DramaBeans',          url: 'https://www.dramabeans.com/?s=%title%',                                         icon: 'https://images2.imgbox.com/62/c1/2mKN3cII_o.png', },
	  ];

	var anime_sites = [
		{ name: 'MAL',                 url: 'https://myanimelist.net/search/all?q=%title%',                                  icon: 'https://images2.imgbox.com/bf/8b/cQ2UnZIa_o.png', },
		{ name: 'AniDB',               url: 'https://anidb.net/perl-bin/animedb.pl?adb.search=%title%&show=search&do.search=search', icon: 'https://images2.imgbox.com/3b/c9/eeUYC5n7_o.png', },
		{ name: 'ANN',                 url: 'https://www.animenewsnetwork.com/search?q=%title%',                             icon: 'https://images2.imgbox.com/64/ca/uWlLBCwp_o.png', },
		{ name: 'LiveChart',           url: 'https://www.livechart.me/search?q=%title%',                                     icon: 'https://images2.imgbox.com/85/08/C91WXD3m_o.png', },
		{ name: 'AniList',             url: 'https://anilist.co/search/anime?search=%title%',                                icon: 'https://images2.imgbox.com/98/a6/NfPnZ1Hy_o.png', },
		{ name: 'Kitsu',               url: 'https://kitsu.io/anime?&text=%title%',                                          icon: 'https://images2.imgbox.com/88/c9/Q9wsiMwc_o.png', },
		{ name: 'aniSearch',           url: 'https://www.anisearch.com/anime/index/?page=1&char=all&text=%title%&smode=2',   icon: 'https://images2.imgbox.com/9c/a3/gMmGqWe7_o.png', },
		{ name: 'Nyaa',                url: 'https://nyaa.si/?&q=%org_title%',                                               icon: 'https://images2.imgbox.com/ae/83/Wt7miqlB_o.png', },
		{ name: 'AnimeTosho',          url: 'https://animetosho.org/search?q=%org_title%',                                   icon: 'https://images2.imgbox.com/95/99/ielNsiUu_o.png', },
		{ name: 'AniDex',              url: 'https://anidex.info/?q=%org_title%',                                            icon: 'https://images2.imgbox.com/b4/e1/uCD81F45_o.png', },
		{ name: 'AnimeBytes',          url: 'https://animebytes.tv/torrents.php?searchstr=%title%&force_default=1',          icon: 'https://images2.imgbox.com/aa/58/vsP6uAXE_o.png', },
		{ name: 'BakaBT',              url: 'https://bakabt.me/browse.php?q=%title%',                                        icon: 'https://images2.imgbox.com/6a/b8/4qBbiNge_o.png', },
		{ name: 'RuTracker',           url: 'http://rutracker.org/forum/search_cse.php?q=%org_title%',                       icon: 'https://images2.imgbox.com/24/5d/kj3YSoFr_o.png', },
        { name: 'TürkAnime',           url: 'http://www.turkanime.tv/?q=%title%',                                            icon: 'https://images2.imgbox.com/48/1b/6S4bA8pN_o.png', },
	];

	// Update Requirements
	// V-2.31 => v-2.40
	if (GM_getValue("myVersion") == null) {
		GM_setValue("myVersion", GM_info.script.version);
		let up = GM_getValue("mySites");
		up.push({name:'Quick Search Settings', hidden: 0, url: '#', icon: 'https://images2.imgbox.com/eb/2f/REuxbKkD_o.png',});
        GM_setValue("mySites", up);
	}

	// Styles
	GM_addStyle(`
	.quick-search {margin-left: 0; margin-right: 0; padding-bottom: 4px; padding-top: 6px;}
	.quick-search > div {display: flex; justify-content: flex-start; flex-wrap: wrap; height: unset; padding: 0.3rem 0.4rem; border-radius: 3px; background: #313131;}
	.quick-search button {padding: 0.2rem!important; opacity: 0.7; background: transparent; border: none; width: 33.5px; display: flex; justify-content: center; border-radius: 4px;}
	.quick-search button:hover {opacity: 1; background: #80808063;}
	.quick-search a {display: flex;}
	.quick-search img {height: 1.4rem; width: 1.4rem;}
	.settinsButOn {position: relative; padding-right: 50px!important;}
	#qs-separator {position: absolute; top: 0; right: 45px; height: 100%; width: 2.5px; background: #1f1f1f;}
	#qs-settingsButton {position: absolute; top: 0; bottom: 0; margin: 0.3em 0.4em; right: 0; align-items: center; cursor: pointer;}

@media only screen and (max-width: 1290px) and (min-width: 0px){
	.settinsButOn {padding-right: 0.4em!important;}
	#qs-separator {display: none;}
	#qs-settingsButton {position: relative; margin: 0;}
}
@media only screen and (max-width: 600px) and (min-width: 0px){
	.watchContainerClone {padding: 0!important;}
	.quick-search {padding-bottom: 0;}
	.quick-search > div {justify-content: center;}
}
`);

	// Title edit
	const titleEdit=(t) => {
		return t
			.replace(/[\/\\()~?<>{}]/g, "") //remove bad chars
			.replace("&amp;","%26") //replace & with code
			.replace("&", "%26")
			.replace('"', '%22')
			.replace("#", "%23")
			.replace("$", "%24")
			.replace("%", "%25")
			.replace("'", "%27")
			.replace("*", "%2A")
			.replace("-", "%2D")
		;
	};

	// ID
	const regex = /\/title\/(tt\d+)\/?/;
    const pageUrl = window.location.href;
	var ttImdbId = regex.exec( pageUrl )[1];

	// Variables
	var isSerial = ($('.episode-guide-text').length > 0) ? true : false;
	var language = $('[data-testid="title-details-languages"]').text().trim();
	var genre = $('[data-testid="genres"]').text().trim();

	// Design
	let oldDesign = $('[data-testid="hero-title-block__title"]').length > 0;
	if (oldDesign) GM_addStyle('.quick-search button {width: 28.8px;}');
    let refEl = (oldDesign) ? '[data-testid="hero-title-block__title"]' : '[data-testid="hero__pageTitle"]';

	// Titles
	var title = titleEdit( $(refEl).text().trim() );
	var orgTitle = titleEdit( $('[data-testid="hero-title-block__original-title"]').text().replace(/Original title: /i,"").trim() );
	orgTitle = (orgTitle == "") ? title : orgTitle;
	title = ( (language.search( /English/i ) > 0) && (title != orgTitle) ) ? orgTitle : title; // For users with local title setting.
	var year = $($('title')[0]).text().replace(/.+\(.*?(\d{4}).*\) - IMDb/, "$1");
	var titleYear = isSerial ? title : title + " " + year;

	// Episode Page
	var episodeCheck = $('[data-testid="hero-subnav-bar-season-episode-numbers-section"]').length > 0;
	if (episodeCheck) {
		let parent = $('[data-testid="hero-title-block__series-link"]');
		ttImdbId = regex.exec( parent.attr("href") )[1];
		title = parent.text();
		orgTitle = title;
		titleYear = title;
	}

	// Anime & Drama
	var isDrama;
	var isAnime;
	if (language.search( /(Korean|Japanese|Mandarin|Chinese|Tagalog|Cantonese)/i ) >= 0 && language.search( /English/i ) < 0 && genre.search( /Animation/i ) < 0) {isDrama = true;}
	if (language.search( /Japanese/i ) >= 0 && language.search( /English/i ) < 0 && genre.search( /Animation/i ) >= 0) {isAnime = true;}

	// Functions
	const url=(u) => {
		return u
			.replace("%ttimdbid%", ttImdbId)
			.replace("%imdbid%", ttImdbId.replace("tt",""))
			.replace("%title%", title)
			.replace("%year%", year)
			.replace("%title_year%", titleYear)
			.replace("%org_title%", orgTitle)
		;
	};
	const refPos = (p_ref, nthParent) => {
		let ref = document.querySelector(p_ref);
		for (let x = 0; x < nthParent; x++) {
			ref = ref.parentElement;
		}
		let refInf = ref.getBoundingClientRect();
		let width = refInf.width;
        let paddingL = window.getComputedStyle(ref, null).getPropertyValue('padding-left');
		return {
			top: (window.scrollY + refInf.top) + "px",
			bottom: (window.scrollY + refInf.bottom) + "px",
			left: refInf.left + "px",
			width: width + "px",
            paddingL: paddingL,
		};
	};
	const putBtns=(group, id, ref) => {
		// Delete some margin
		$(':not(#searchOn) >' + ref).parent().parent().children().css("margin-bottom", "0px" );
		// Create clone area
		let cloneArea = $('.watchContainerClone');
		if (cloneArea.length <= 0) {
			$('body').prepend('<div class="watchContainerClone" style="position: absolute; z-index: 100; padding-top: 1rem;"></div>');
			cloneArea = $('.watchContainerClone');
		}
		let pos = refPos(ref, 2);
		cloneArea.css("top", pos.bottom).css("left", pos.left).css("width", pos.width).css("padding", "0 " + pos.paddingL);
		// Put bar
		let bar = '<div class="quick-search" id="' + id + '"><div class="ipc-btn--core-baseAlt ipc-secondary-button"></div></div>';
		cloneArea.prepend(bar);
		// Put buttons
		group.forEach(function(s) {
			if (s.hidden != 1 && s.name != "Quick Search Settings") {
				$('#' + id + ' > div:first-child').append('<button title="' + s.name + '"><a href="' + url(s.url) + '" target="_blank"><img src="' + s.icon + '"></img></a></button>');
			}
		});
		// Settings button
		let settingObj = arrayFilter(group, "name", "Quick Search Settings");
		if (settingObj[0].hidden != 1) {
			$('#' + id + ' > div:first-child').addClass("settinsButOn");
			$('#' + id + ' > div:first-child').append('<div id="qs-separator"></div><button id="qs-settingsButton" title="Quick Search Settings"><a><img src="https://images2.imgbox.com/eb/2f/REuxbKkD_o.png"></img></a></button>');
			$('#qs-settingsButton').click(function() {
				$('[data-testid="hero-subnav-bar-all-topics-button"]').click();
				waitForKeyElements('[data-testid="promptable"]', promptable1, true);
				waitForKeyElements('.ipc-promptable-base__content > div:not([data-testid="loader"])', promptable2, true);
			});
		}

		// Position and space for Clone
//		if (crtl.topBar) {
			cloneArea.css("padding-top", 0);
			let cloneHeight = document.querySelector('.watchContainerClone').getBoundingClientRect().height + "px";
			$(':not(#searchOn) >' + ref).parent().parent().css("margin-bottom", cloneHeight );
//		}
//		else {
//			let cloneHeight = document.querySelector('.watchContainerClone').getBoundingClientRect().height + "px";
//			//$(ref).css("padding-top", cloneHeight );
//			//$('[data-testid="tm-box-wl-button"], [data-testid="tm-box-addtolist-button"]').css("min-height", "48px");
//		}
	};

	// Put Search Buttons
//	if (crtl.topBar) {

	// Saved Site Settings
	var savedSites = null;
	function refresh() {
		savedSites = GM_getValue("mySites");
		if (savedSites != null) {
			putBtns(savedSites, 'searchOn', refEl);
		}
		else {
			putBtns(sites, 'searchOn', refEl);
		}
	}

	refresh();
	GM_addValueChangeListener("mySites", function() {
		$('#searchOn').remove();
		refresh();
		$('#qs-variables').remove();
		promptable2( $('.ipc-promptable-base__content > div:not([data-testid="loader"])') );
	});
	window.addEventListener("resize", function() {
		$('#searchOn').remove();
		refresh();
	});
//	}
//	else {
//		if (crtl.torrent && !isAnime) {putBtns(torrentSites, 'torrent_searchOn', '[data-testid="tm-box-wl-button"]');}
//		putBtns(sites, "searchOn", '[data-testid="tm-box-wl-button"]');
//		if (crtl.anime && isAnime) {putBtns(anime_sites, 'anime_searchOn', '[data-testid="tm-box-wl-button"]');}
//		if (crtl.drama && isDrama) {putBtns(drama_sites, 'drama_searchOn', '[data-testid="tm-box-wl-button"]');}
//	}

// ================

	GM_addStyle(`
	.tg {width: 100%; border-collapse:collapse; border-spacing:0;}
	.tg td{font-size:14px; overflow:hidden; padding: 4px 10px;word-break:normal; background: #313131;}
	.tg th{font-size:14px; font-weight:700; overflow:hidden;padding:5px 10px;word-break:normal; background: linear-gradient(45deg, black, transparent);}
	.tg td > div {display: flex; justify-content: space-evenly; cursor: pointer;}
	.qs-info {height: 1rem;}
	.tg #qs-settings td img {height: 1.8rem;}
	.changeIcon {height: 1.8rem; width: 1.8rem; border-radius: 1.8em; background: #414141;}
	.tg td input {width: 100%}
	.tg .tg-0lax{text-align:left;vertical-align:top}
	#qs-settings tr.hidden > td > * {opacity: 0.4;}
	#qs-settings tr.hidden .hideSite.hide {display: none;}
	#qs-settings tr:not(.hidden) .hideSite.show {display: none;}
	#qs-settings .missing input, #qs-settings .missing .changeIcon {background: #ff5f5f;}
	#qs-buttons {margin: 15px 0 25px 0; display: flex; gap: 5px;}
	#qs-buttons > * {cursor: pointer;}
	`);

	let variableHTML = `
<table class="tg">
<thead>
  <tr>
    <th class="tg-0lax" style="width: 10px;">Icon</th>
    <th class="tg-0lax" style="width: 200px;">Name</th>
    <th class="tg-0lax" style="width: 600px;">Url</th>
    <th class="tg-0lax" style="width: 90px;">Action</th>
  </tr>
</thead>
<tbody id="qs-settings">
</tbody>
</table>
<div id="qs-buttons">
  <button id="addNewSite">Add New</button>
  <button id="returnDefault">Return to Default</button>
  <button id="saveSites" style="margin-left: auto;">Save</button>
</div>
<table class="tg">
<thead>
  <tr>
    <th class="tg-0lax">URL Variables</th>
    <th class="tg-0lax">@Movie</th>
    <th class="tg-0lax">@Series</th>
    <th class="tg-0lax">@Episode</th>
    <th class="tg-0lax">@Non-English</th>
	<th class="tg-0lax" style="width: 30px;">Info</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0lax">%title%</td>
    <td class="tg-0lax">Fight Club</td>
    <td class="tg-0lax">Dexter</td>
    <td class="tg-0lax">Dexter</td>
    <td class="tg-0lax">Parasite</td>
	<td class="tg-0lax"></td>
  </tr>
  <tr>
    <td class="tg-0lax">%year%</td>
    <td class="tg-0lax">1999</td>
    <td class="tg-0lax">2006</td>
    <td class="tg-0lax">""</td>
    <td class="tg-0lax">2019</td>
	<td class="tg-0lax"></td>
  </tr>
  <tr>
    <td class="tg-0lax">%title_year%</td>
    <td class="tg-0lax">Fight Club 1999</td>
    <td class="tg-0lax">Dexter</td>
    <td class="tg-0lax">Dexter</td>
    <td class="tg-0lax">Parasite 2019</td>
	<td class="tg-0lax"><div>
	  <img class="qs-info" src="https://images2.imgbox.com/d7/7c/wecjvHiD_o.png" title="This variable calls year for only movies, not series.&#013;If you want year in both case, use this: %title%+%year%">
	</div></td>
  </tr>
  <tr>
    <td class="tg-0lax">%org_title%</td>
    <td class="tg-0lax">Fight Club</td>
    <td class="tg-0lax">Dexter</td>
    <td class="tg-0lax">""</td>
    <td class="tg-0lax">Gisaengchung</td>
	<td class="tg-0lax"><div>
	  <img class="qs-info" src="https://images2.imgbox.com/d7/7c/wecjvHiD_o.png" title="Actually it returns same as %title% in episode pages.&#013;It is not possible to get orginal title from there.">
	</div></td>
  </tr>
  <tr>
    <td class="tg-0lax">%imdbid%</td>
    <td class="tg-0lax">0137523</td>
    <td class="tg-0lax">0773262</td>
    <td class="tg-0lax">0773262</td>
    <td class="tg-0lax">6751668</td>
	<td class="tg-0lax"></td>
  </tr>
  <tr>
    <td class="tg-0lax">%ttimdbid%</td>
    <td class="tg-0lax">tt0137523</td>
    <td class="tg-0lax">tt0773262</td>
    <td class="tg-0lax">tt0773262</td>
    <td class="tg-0lax">tt6751668</td>
	<td class="tg-0lax"></td>
  </tr>
</tbody>
</table>
`;

	const menu_command_id = GM_registerMenuCommand("Quick Search Settings", function() {
			$('[data-testid="hero-subnav-bar-all-topics-button"]').click();
			waitForKeyElements('[data-testid="promptable"]', promptable1, true);
			waitForKeyElements('.ipc-promptable-base__content > div:not([data-testid="loader"])', promptable2, true);
		}, "qs-settings");

	const disableSave = () => $("#saveSites").prop('disabled', true);
	const activateSave = () => $("#saveSites").prop('disabled', false);
	function promptable1(p) {
		//p.find('.all-topics-dialog__panel').removeClass("all-topics-dialog__panel").addClass("648-settings-dialog__panel");
		p.find('.ipc-prompt-header').html('<div class="ipc-title ipc-title--title ipc-title--baseAlt ipc-title--on-textPrimary ipc-prompt-header__text ipc-prompt-header__title"><hgroup><h3 class="ipc-title__text">Quick Search Settings</h3></hgroup></div>');
		p.find('.ipc-prompt-header__title').css("margin", "0");
		p.find('.ipc-promptable-base__panel').css("max-width", "900px");
	}
	function promptable2(c) {
		c.html('<div id="qs-variables">' + variableHTML + '</div>');
		$('#addNewSite').click(function(){addNew();});
		$('#returnDefault').click(function(){
			if(confirm("Are you sure you want to return default settings? All your changes will be deleted.")) returnDefault();
		});
		$('#saveSites').click(function(s){saveSites(s);});
		let listSites = GM_getValue("mySites");
		if (listSites == null) listSites = sites;
		for (let x = 0; x < listSites.length; x++) {
			if (listSites[x].name != "Quick Search Settings") addNew(listSites[x]);
		}
		// Settings button
		let settingObj = arrayFilter(listSites, "name", "Quick Search Settings");
		if (settingObj[0].hidden != 1) addNew( {name:'Quick Search Settings', hidden: 0, url: '#', icon: 'https://images2.imgbox.com/eb/2f/REuxbKkD_o.png',} );
		else addNew( {name:'Quick Search Settings', hidden: 1, url: '#', icon: 'https://images2.imgbox.com/eb/2f/REuxbKkD_o.png',} );

	}
	function changeIcon(t) {
		let e = t.currentTarget;
		let oldIcon = $(e).children('img').length > 0 ? $(e).children('img').attr("src") : "";
		let icon = prompt("Enter an icon (url or base64)", oldIcon);
		if (icon != null) {
			$(e).html('<img src="' + icon + '">');
			activateSave();
		}
	}
	function deleteSite(t) {
		let e = t.currentTarget;
		let c = confirm("Are you sure?");
		if (c) {
			$(e).closest("tr").remove();
			activateSave();
		}
	}
	function hideShowSite(t) {
		let e = t.currentTarget;
		$(e).closest("tr").toggleClass("hidden");
		activateSave();
	}
	function addNew(saved) {
		$('#qs-settings').append(`
		<tr>
		  <td class="tg-0lax"><div class="changeIcon" title="Click for change"></div></td>
		  <td class="tg-0lax"><input class="siteName"></input></td>
		  <td class="tg-0lax"><input class="siteUrl"></input></td>
		  <td class="tg-0lax">
		    <div>
		      <div class="hideSite hide" title="Hide"><img src="https://images2.imgbox.com/66/0c/8Wt4JVqM_o.png"></div>
			  <div class="hideSite show" title="Show"><img src="https://images2.imgbox.com/51/c9/JKXmwZQF_o.png"></div>
			  <div class="deleteSite" title="Delete"><img src="https://images2.imgbox.com/3c/b7/BmSWolK7_o.png"></div>
			</div>
		</tr>`);
		$('.changeIcon:last').click(function(t){changeIcon(t);});
		$('.deleteSite:last').click(function(t){deleteSite(t);});
		$('.hideSite.hide:last, .hideSite.show:last').click(function(t){hideShowSite(t);});
		if (saved != null) {
			$('.changeIcon:last').append('<img src="' + saved.icon + '">');
			$('.siteName:last').val(saved.name);
			$('.siteUrl:last').val(saved.url);
			$('.hideSite:last').closest('tr').addClass(saved.hidden == 1 ? "hidden" : "");
			if (saved.name == "Quick Search Settings") {
				$('.siteName:last').prop('disabled', true).css("background", "white").attr("id", "setting-option");
				$('.siteUrl:last').prop('disabled', true).css("background", "white");
				$('.deleteSite:last').css("display", "none").after('<div class="lockedSite" title="You can\'t edit or delete.&#013;Only hide and unhide."><img src="https://images2.imgbox.com/3c/52/zq0Z92io_o.png"></div>');
			}
		}
		else {
			swaper( $('.siteName:last').closest('tr'), $('#setting-option').closest('tr') );
		}
		activateSave();
	}
	function returnDefault() {
		GM_setValue("mySites", null);
	}
	function saveSites(t) {
		// Check
		let missCheck = false;
		$("#qs-settings > tr").each(function(a, b){
			if ($(b).find('.siteName').val() == "" || $(b).find('.siteUrl').val() == "" || $(b).find('.changeIcon > img').attr("src") == "" || $(b).find('.changeIcon > img').attr("src") == null) {
				missCheck = true;
				$(b).closest('tr').addClass("missing");
			}
			else {
				$(b).closest('tr').removeClass("missing");
			}
		});
		// Save
		if (!missCheck) {
			let mySites = $("#qs-settings > tr").map(function(a, b){
				return {
					name: $(b).find('.siteName').val(),
					url: $(b).find('.siteUrl').val(),
					icon: $(b).find('.changeIcon > img').attr("src"),
					hidden: $(b).hasClass("hidden"),
				};
			}).toArray();
			GM_setValue("mySites", mySites);
		}
		else {
			alert("There is missing info at highlighted websites. Please fill it and try again.");
		}
		// Style
		disableSave();
		$('#qs-settings input').change(function(){
			activateSave();
		});
	}

	function swaper(el1, el2) {
		$(el1).before('<div id="dummyDiv1"></div>');
		$(el2).before('<div id="dummyDiv2"></div>');
		$(el1).appendTo('#dummyDiv2').unwrap('#dummyDiv2');
		$(el2).appendTo('#dummyDiv1').unwrap('#dummyDiv1');
	}
    function arrayFilter(array, type, typeValue) {
        var newArray = [];
        for (let x = 0; x < array.length; x++) {
            if (array[x] != null) {
                if (array[x][type] == typeValue) {
                    newArray.push(array[x]);
                }
            }
        }
        return newArray;
    }
    function waitForKeyElements (
        selectorTxt,    /* Required: The jQuery selector string that
                            specifies the desired element(s).
                        */
        actionFunction, /* Required: The code to run when elements are
                            found. It is passed a jNode to the matched
                            element.
                        */
        bWaitOnce,      /* Optional: If false, will continue to scan for
                            new elements even after the first match is
                            found.
                        */
        iframeSelector  /* Optional: If set, identifies the iframe to
                            search.
                        */
    ) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined")
            targetNodes     = $(selectorTxt);
        else
            targetNodes     = $(iframeSelector).contents ()
                                               .find (selectorTxt);

        if (targetNodes  &&  targetNodes.length > 0) {
            btargetsFound   = true;
            /*--- Found target node(s).  Go through each and act if they
                are new.
            */
            targetNodes.each ( function () {
                var jThis        = $(this);
                var alreadyFound = jThis.data ('alreadyFound')  ||  false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound     = actionFunction (jThis);
                    if (cancelFound)
                        btargetsFound   = false;
                    else
                        jThis.data ('alreadyFound', true);
                }
            } );
        }
        else {
            btargetsFound   = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj      = waitForKeyElements.controlObj  ||  {};
        var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
        var timeControl     = controlObj [controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval (timeControl);
            delete controlObj [controlKey];
        }
        else {
            //--- Set a timer, if needed.
            if ( ! timeControl) {
                timeControl = setInterval ( function () {
                        waitForKeyElements (    selectorTxt,
                                                actionFunction,
                                                bWaitOnce,
                                                iframeSelector
                                            );
                    },
                    300
                );
                controlObj [controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj   = controlObj;
    }

})();