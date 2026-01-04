// ==UserScript==
// @name         GGn Non-wiki Edit Helper
// @namespace    none
// @version      2.3.2
// @author       ingts
// @description  Make non-wiki edits from the group page and auto search for web links
// @match        https://gazellegames.net/torrents.php?id=*
// @match        https://gazellegames.net/torrents.php?action=editgroup&groupid=*
// @require      https://update.greasyfork.org/scripts/541342/GGn%20Corner%20Button.js
// @connect      *
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/485160/GGn%20Non-wiki%20Edit%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/485160/GGn%20Non-wiki%20Edit%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class Site {
constructor({name, inputId, inputPattern, searchUrl, selectors, useGenericSearch}) {
            this.name = name;
            this.searchUrl = searchUrl;
            this.inputId = inputId;
            this.inputPattern = inputPattern;
            this.selectors = selectors;
            this.useGenericSearch = useGenericSearch;
        }
    }

    class ReviewSite extends Site {
constructor({
                        name,
                        searchUrl,
                        scoreInputId,
                        scoreInputMax,
                        step,
                        urlInputId,
                        inputPattern,
                        selectors,
                        useGenericSearch
                    }) {
            super({
                name: name,
                inputId: urlInputId,
                inputPattern: inputPattern,
                searchUrl: searchUrl,
                selectors: selectors,
                useGenericSearch: useGenericSearch
            });
            this.scoreInputMax = scoreInputMax;
            this.step = step;
            this.scoreInputId = scoreInputId;
        }
    }

    const reviewSites = {
        meta: new ReviewSite({
            name: 'Metascore',
            searchUrl: 'https://www.metacritic.com/search/NAME?category=13&page=1',
            scoreInputId: 'meta',
            scoreInputMax: '100',
            step: '1',
            urlInputId: 'metauri',
            inputPattern: '.*metacritic.com/game/.*/critic-reviews/.*'
        }),
        ign: new ReviewSite({
            name: 'IGN',
            scoreInputId: 'ignscore',
            scoreInputMax: '10',
            step: '0.1',
            urlInputId: 'ignuri',
            inputPattern: '.*ign.com/articles/.*',
            searchUrl: 'https://www.google.com/search?q=site:*.ign.com/articles+NAME%20review',
            useGenericSearch: true
        }),
        gamespot: new ReviewSite({
            name: 'GameSpot',
            searchUrl: 'https://www.gamespot.com/search/?i=reviews&q=NAME',
            scoreInputId: 'gamespotscore',
            scoreInputMax: '10',
            step: '0.1',
            urlInputId: 'gamespotscoreuri',
            inputPattern: '.*gamespot.com/reviews/.*'
        }),
    };

    const sites = {
        gameswebsite: new Site({
            name: 'Games Website',
            searchUrl: 'https://www.google.com/search?q=NAME%20game%20official%20website%20-site:store.steampowered.com%20-site:steamcommunity.com%20-site:*.wikipedia.org%20-site:itch.io%20-site:vndb.org%20-site:gog.com%20-site:epicgames.com',
            inputId: 'gameswebsiteuri',
            inputPattern: '.*',
            useGenericSearch: true
        }),
        wikipedia: new Site({
            name: 'Wikipedia',
            inputId: 'wikipediauri',
            inputPattern: '^(https?://|)[a-z][a-z].wikipedia.org/wiki/.*?$',
            searchUrl: 'https://www.google.com/search?q=NAME%20site:wikipedia.org'
        }),
        giantbomb: new Site({
            name: 'Giantbomb',
            inputId: 'giantbomburi',
            inputPattern: '^(https?://|)(www.|)giantbomb.com/.*?$',
            searchUrl: 'https://giantbomb.com/wiki/index.php?title=Category:Games&pagefrom=NAME',
            selectors: ['#mw-pages > div > div a']
        }),
        vndb: new Site({
            name: 'VNDB',
            inputId: 'vndburi',
            inputPattern: '^(https?://|)(www.|)vndb.org/v[0-9]*?$',
            searchUrl: 'https://vndb.org/v/all?sq=NAME'
        }),
        howlongtobeat: new Site({
            name: 'HowLongToBeat',
            inputId: 'howlongtobeaturi',
            inputPattern: '^https://howlongtobeat.com/game/[0-9]*?$',
            searchUrl: 'https://howlongtobeat.com/?q=NAME'
        }),
        amazon: new Site({
            name: 'Amazon',
            inputId: 'amazonuri',
            inputPattern: '^(https?://|)(www.|)amazon.(..|...|.....)/.*?$',
            searchUrl: 'https://www.google.com/search?q=site:amazon.*%20NAME',
            useGenericSearch: true
        }),
        gamefaqs: new Site({
            name: 'GameFAQs',
            inputId: 'gamefaqsuri',
            inputPattern: '^(https?://|)(www.|)gamefaqs.(gamespot.|)com/.*?$',
            searchUrl: 'https://gamefaqs.gamespot.com/search?game=NAME'
        }),
        mobygames: new Site({
            name: 'Moby Games',
            inputId: 'mobygamesuri',
            inputPattern: '^(https?://|)(www.|)mobygames.com/(game|browse/games)/.*?$',
            searchUrl: 'https://www.mobygames.com/search/?q=NAME&type=game',
            selectors: ['td b a', 'td b + span']
        }),
        steam: new Site({
            name: 'Steam',
            inputId: 'steamuri',
            inputPattern: '^(https?://|)store.steampowered.com/(app|sub)/.*?$',
            searchUrl: 'https://store.steampowered.com/search/?term=NAME&category1=998&ndl=1',
            selectors: ['#search_result_container a']
        }),
        gog: new Site({
            name: 'GOG',
            inputId: 'goguri',
            inputPattern: '^(https?://|)(www.|)gog.com/(en/)?game/.*?$',
            searchUrl: 'https://www.gog.com/games?query=NAME'
        }),
        humble: new Site({
            name: 'Humble Bundle',
            inputId: 'humbleuri',
            inputPattern: '.*humblebundle.com/store/.*',
            searchUrl: 'https://www.humblebundle.com/store/search?search=NAME'
        }),
        itch: new Site({
            name: 'Itch.io',
            inputId: 'itchuri',
            inputPattern: '^(https?://|).*?.itch.io/.*?$',
            searchUrl: 'https://www.google.com/search?q=site:itch.io%20NAME',
            useGenericSearch: true
        }),
        pcwiki: new Site({
            name: 'PCGamingWiki',
            inputId: 'pcwikiuri',
            inputPattern: '^(https?://|)(www.|)pcgamingwiki.com/wiki/.*?$',
            searchUrl: 'https://pcgamingwiki.com/w/index.php?search=NAME&fulltext=1'
        }),
        epicgames: new Site({
            name: 'Epic Games',
            inputId: 'epicgamesuri',
            inputPattern: '^(https?://|)(www.|store.|)epicgames.com/(store/|)en-US/(p|product)/[a-z0-9-]+(/home)?$',
            searchUrl: 'https://www.epicgames.com/store/en-US/browse?q=NAME&sortBy=relevancy&category=Game',
            useGenericSearch: 'epicgames.com'
        }),
        nexusmods: new Site({
            name: 'Nexus Mods',
            inputId: 'nexusmodsuri',
            inputPattern: '^(http(s)?://|)(www.|)nexusmods.com/.*?$',
            searchUrl: 'https://www.google.com/search?q=site:nexusmods.com/games%20NAME',
        }),
        itunesstore: new Site({
            name: 'iTunes',
            inputId: 'itunesuri',
            inputPattern: '^(https?://|)(itunes|music|apps).apple.com/.*?$',
            searchUrl: 'https://www.google.com/search?q=NAME%20site:apps.apple.com/*/%20-inurl:?l=',
            useGenericSearch: true
        }),
        nintendo: new Site({
            name: 'Nintendo',
            inputId: 'nintendouri',
            inputPattern: '^(https?://|)(www.|ec.|store-jp.)nintendo.(com|co.uk|co.jp)/.*[a-zA-Z0-9-]+(.html)?/?$',
            searchUrl: 'https://www.nintendo.com/en-gb/Search/Search-299117.html?q=NAME',
            useGenericSearch: 'nintendo.com'
        }),
        googleplay: new Site({
            name: 'Google Play',
            inputId: 'googleplayuri',
            inputPattern: '^(https?://|)play.google.com/store/apps/.*?$',
            searchUrl: 'https://play.google.com/store/search?q=NAME&c=apps'
        }),
        psn: new Site({
            name: 'PSN',
            inputId: 'psnuri',
            inputPattern: '^(https?://|)(www.|)(jp.|)(store.|)playstation.com/.*(games|title|[a-z][a-z]-[a-z][a-z]/product)/.*?$',
            searchUrl: 'https://www.playstation.com/en-us/search/?q=NAME&category=games'
        }),
        oculus: new Site({
            name: 'Oculus',
            inputId: 'oculusuri',
            inputPattern: '^https?:\\/\\/(www.|)meta\\.com\\/experiences\\/.+$',
            searchUrl: 'https://www.meta.com/experiences/search/?q=NAME',
            useGenericSearch: 'meta.com',
        }),
        rpggeek: new Site({
            name: 'RPGGeek',
            inputId: 'rpggeekuri',
            inputPattern: '^(https?://|)(www.|)rpggeek.com/rpg[A-Za-z]*?/.*?$',
            searchUrl: 'https://rpggeek.com/geeksearch.php?action=search&objecttype=rpg&q=NAME',
            selectors: ['a.primary']
        }),
        rpgnet: new Site({
            name: 'RPG.net',
            inputId: 'rpgneturi',
            inputPattern: '^(https?://|)index.rpg.net/display-entry.phtml?mainid=[0-9]*?$',
            searchUrl: 'https://index.rpg.net/display-search.phtml?key=title&value=NAME',
            selectors: ['a[href*=mainid']
        }),
        drivethrurpg: new Site({
            name: 'DriveThruRPG',
            inputId: 'drivethrurpguri',
            inputPattern: '^(https?://|)(www.|)drivethrurpg.com/product/[0-9]*?/.*?$',
            searchUrl: 'https://drivethrurpg.com/browse.php?keywords=NAME'
        }),
        boardgamegeek: new Site({
            name: 'BoardGameGeek',
            inputId: 'boardgamegeekuri',
            inputPattern: '^(https?://|)(www.|)boardgamegeek.com/boardgame/.*?$',
            searchUrl: 'https://boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q=NAME',
            selectors: ['a.primary', '.smallerfont.dull']
        }),
        vgmdb: new Site({
            name: 'VGMdb',
            inputId: 'vgmdburi',
            inputPattern: '',
            searchUrl: 'https://vgmdb.net/search?q=NAME'
        }),
        discogs: new Site({
            name: 'Discogs',
            inputId: 'discogsuri',
            inputPattern: '',
            searchUrl: 'https://www.discogs.com/search/?type=release&q=NAME',
            selectors: ['.search_result_title', '.card-artist-name']
        }),
        bandcamp: new Site({
            name: 'Bandcamp',
            inputId: 'bandcampuri',
            inputPattern: '',
            searchUrl: 'https://bandcamp.com/search?q=NAME&item_type=a'
        }),
        musicbrainz: new Site({
            name: 'MusicBrainz',
            inputId: 'musicbrainzuri',
            inputPattern: '',
            searchUrl: 'https://musicbrainz.org/search?type=release&method=indexed&query=NAME',
            selectors: ['.tbl td:nth-child(1) a:has(bdi)', '.tbl td:nth-child(2) a:nth-of-type(1)']
        }),
        itunes: new Site({
            name: 'iTunes',
            inputId: 'itunesuri',
            inputPattern: '',
            searchUrl: 'https://www.google.com/search?q=NAME%20site:music.apple.com/*/album%20-inurl:?l=',
            useGenericSearch: true
        }),
        googleplaybooks: new Site({
            name: 'Google Play Books',
            inputId: 'googleplaybooksuri',
            inputPattern: '',
            searchUrl: 'https://play.google.com/store/search?c=books&q=NAME',
            selectors: ['a:has(div.Epkrse)']
        }),
        goodreads: new Site({
            name: 'Goodreads',
            inputId: 'goodreadsuri',
            inputPattern: '',
            searchUrl: 'https://www.goodreads.com/search?utf8=%E2%9C%93&query=NAME',
            selectors: ['.bookTitle', '.authorName']
        }),
    };

    var _GM_xmlhttpRequest = (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : undefined)();
function getFullUrl(response, element) {
        const link = element.href ?? element.src;
        return link.startsWith('https://gazellegames')
            ? (new URL(response.finalUrl).origin + link).replace('https://gazellegames.net', '')
            : link
    }
function promiseXHR(url, options = {}) {
        if (!Object.hasOwn(options, 'timeout'))
            options.timeout = 10000;

        return new Promise((resolve, reject) => {
            _GM_xmlhttpRequest({
                url,
                ...options,
                onabort: (response) => {
                    reject(response);
                },
                onerror: (response) => {
                    reject(response);
                },
                ontimeout: (response) => {
                    reject(response);
                },
                onload: (response) => {
                    resolve(response);
                },
            });
        })
    }
function getSettings(array) {
        const obj = {};

        for (const [key, defaultVal] of array) {
            let gmValue = GM_getValue(key);
            if (typeof gmValue === 'undefined') {
                GM_setValue(key, defaultVal);
                obj[key] = defaultVal;
                continue
            }
            obj[key] = gmValue;
        }

        return obj
    }

    const ggnToGamefaqsPlatform = new Map([
        ["Mac", "Macintosh"],
        ["iOS", "iOS (iPhone/iPad)"],
        ["Apple Bandai Pippin", "Bandai Pippin"],
        ["Apple II", "Apple II"],
        ["Android", "Android"],
        ["DOS", "PC"],
        ["Windows", "PC"],
        ["Xbox", "Xbox"],
        ["Xbox 360", "Xbox 360"],
        ["Game Boy", "Game Boy"],
        ["Game Boy Advance", "Game Boy Advance"],
        ["Game Boy Color", "Game Boy Color"],
        ["NES", "NES"],
        ["Nintendo 64", "Nintendo 64"],
        ["Nintendo 3DS", "3DS"],
        ["New Nintendo 3DS", "3DS"],
        ["Nintendo DS", "DS"],
        ["Nintendo GameCube", "GameCube"],
        ["Pokemon Mini", "Pokemon Mini"],
        ["SNES", "Super Nintendo"],
        ["Switch", "Nintendo Switch"],
        ["Virtual Boy", "Virtual Boy"],
        ["Wii", "Wii"],
        ["Wii U", "Wii U"],
        ["PlayStation 1", "PlayStation"],
        ["PlayStation 2", "PlayStation 2"],
        ["PlayStation 3", "PlayStation 3"],
        ["PlayStation 4", "PlayStation 4"],
        ["PlayStation 5", "PlayStation 5"],
        ["PlayStation Portable", "PSP"],
        ["PlayStation Vita", "PlayStation Vita"],
        ["Dreamcast", "Dreamcast"],
        ["Game Gear", null],
        ["Master System", "Sega Master System"],
        ["Mega Drive", "Genesis"],
        ["Pico", "Sega Pico"],
        ["Saturn", "Saturn"],
        ["SG-1000", "SG-1000"],
        ["Atari 2600", "Atari 2600"],
        ["Atari 5200", "Atari 5200"],
        ["Atari 7800", "Atari 7800"],
        ["Atari Jaguar", "Jaguar"],
        ["Atari Lynx", "Lynx"],
        ["Atari ST", "Atari ST"],
        ["Amstrad CPC", "Amstrad CPC"],
        ["Bandai WonderSwan", "WonderSwan"],
        ["Bandai WonderSwan Color", "WonderSwan Color"],
        ["Commodore 64", "Commodore 64"],
        ["Commodore 128", null],
        ["Commodore Amiga", "Amiga"],
        ["Amiga CD32", "Amiga CD32"],
        ["Commodore Plus-4", null],
        ["Commodore VIC-20", "VIC-20"],
        ["NEC PC-98", "NEC PC98"],
        ["NEC PC-FX", null],
        ["NEC SuperGrafx", null],
        ["NEC TurboGrafx-16", "TurboGrafx-16"],
        ["ZX Spectrum", "Sinclair ZX81/Spectrum"],
        ["MSX", "MSX"],
        ["MSX 2", ""],
        ["Game.com", "Game.com"],
        ["Gizmondo", "Gizmondo"],
        ["V.Smile", null],
        ["CreatiVision", "CreatiVision"],
        ["Board Game", null],
        ["Card Game", null],
        ["Miniature Wargames", null],
        ["Pen and Paper RPG", null],
        ["3DO", "3D0"],
        ["Casio Loopy", "Casio Loopy"],
        ["Casio PV-1000", "Casio PV-1000"],
        ["Colecovision", "Colecovision"],
        ["Emerson Arcadia 2001", "Arcadia 2001"],
        ["Entex Adventure Vision", "Adventurevision"],
        ["Epoch Super Casette Vision", null],
        ["Fairchild Channel F", "Channel F"],
        ["Funtech Super Acan", null],
        ["GamePark GP32", "GP32"],
        ["General Computer Vectrex", "Vectrex"],
        ["Interactive DVD", null],
        ["Linux", "Linux"],
        ["Hartung Game Master", null],
        ["Magnavox-Phillips Odyssey", "Odyssey"],
        ["Mattel Intellivision", "Intellivision"],
        ["Memotech MTX", null],
        ["Miles Gordon Sam Coupe", ""],
        ["Nokia N-Gage", "N-Gage"],
        ["Oculus Quest", "Oculus Quest"],
        ["Ouya", "Ouya"],
        ["Philips Videopac+", null],
        ["Philips CD-i", "CD-I"],
        ["Phone/PDA", "Mobile"],
        ["RCA Studio II", "RCA Studio II"],
        ["Sharp X1", "Sharp X1"],
        ["Sharp X68000", "Sharp X68000"],
        ["SNK Neo Geo", "SNK Neo Geo"],
        ["SNK Neo Geo Pocket", "SNK Neo Geo Pocket"],
        ["Taito Type X", null],
        ["Tandy Color Computer", "Tandy Color Computer"],
        ["Tangerine Oric", "Oric 1/Atmos"],
        ["Thomson MO5", null],
        ["Watara Supervision", "SuperVision"],
        ["Retro - Other", null],
    ]);
    const ggnToVndbPlatform = new Map([
        ["Windows", "win"],
        ["Linux", "lin"],
        ["Mac", "mac"],
        ["3DO", "tdo"],
        ["iOS", "ios"],
        ["Android", "and"],
        ["DOS", "dos"],
        ["Dreamcast", "drc"],
        ["NES", "nes"],
        ["SNES", "sfc"],
        ["Game Boy Advance", "gba"],
        ["Game Boy Color", "gbc"],
        ["MSX", "msx"],
        ["Nintendo DS", "nds"],
        ["Switch", "swi"],
        ["Wii", "wii"],
        ["Wii U", "wiu"],
        ["Nintendo 3DS", "n3d"],
        ["NEC PC-98", "p98"],
        ["NEC TurboGrafx-16", "pce"],
        ["NEC PC-FX", "pcf"],
        ["PlayStation Portable", "psp"],
        ["PlayStation 1", "ps1"],
        ["PlayStation 2", "ps2"],
        ["PlayStation 3", "ps3"],
        ["PlayStation 4", "ps4"],
        ["PlayStation 5", "ps5"],
        ["PlayStation Vita", "psv"],
        ["Mega Drive", "smd"],
        ["Saturn", "sat"],
        ["Sharp X1", "x1s"],
        ["Sharp X68000", "x68"],
        ["Xbox", "xb1"],
        ["Xbox 360", "xb3"],
    ]);

const settings = getSettings([
        ['columns', 3],
        ['max_results', 2],
        ['auto_search', true],
        ['auto_search_reviews', true],
        ['check_first_word', true],
        ['refresh_after_submit', false],
        ['default_unchecked', false],
        ['add_wayback_links', false],
        ['search_sites', {
            meta: true,
            ign: true,
            gamespotscore: true,
            gameswebsite: true,
            wikipedia: true,
            giantbomb: true,
            vndb: true,
            howlongtobeat: true,
            amazon: true,
            gamefaqs: true,
            mobygames: true,
            steam: true,
            gog: true,
            humble: true,
            itch: true,
            pcwiki: true,
            epicgames: true,
            nexusmods: true,
            nintendo: true,
            googleplay: true,
            psn: true,
            oculus: true,
            rpggeek: true,
            rpgnet: true,
            drivethrurpg: true,
            boardgamegeek: true,
            vgmdb: true,
            discogs: true,
            bandcamp: true,
            itunes: true,
            musicbrainz: true,
            googleplaybooks: true,
            goodreads: true
        }],
    ]);

    const commonSites = [sites.gameswebsite, sites.wikipedia, sites.amazon],
        commonGameSites = [sites.giantbomb],
consoleAndPcAndMobileSites = [sites.vndb, sites.gamefaqs, sites.howlongtobeat, sites.mobygames],
        commonPcSites = [sites.steam, sites.gog, sites.humble, sites.pcwiki],
        windowsAndMacSites = [sites.epicgames],
        windowsSites = [sites.nexusmods],
        macAndiOSSites = [sites.itunesstore],
        androidSites = [sites.googleplay],
        pcAndPPrpgSites = [sites.itch],
        playstation4Sites = [sites.psn],
        switchAndWiiSites = [sites.nintendo],
        oculusSites = [sites.oculus],
        PPrpgSites = [sites.rpggeek, sites.rpgnet, sites.drivethrurpg],
        boardGameSites = [sites.boardgamegeek],
        ostSites = [sites.vgmdb, sites.discogs, sites.bandcamp, sites.musicbrainz, sites.itunes],
        ebookSites = [sites.googleplaybooks, sites.goodreads];

    let form, bottomLeftContainer, bottomRightContainer, submitButton, trailerInput;
const max_results = settings.max_results;
    const isEditPage = location.href.includes('editgroup');
    let auto_search = settings.auto_search && !isEditPage;

    GM_addStyle(
`
        .nwe-loading {
            color: #736C70
        }

        .nwe-notfound {
            color: #937f21
        }

        form .sidecontainer {
            display: flex;
            gap: 2px;

            button {
                height: 30px;
            }
        }

        .extralinks {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            row-gap: 4px;

            label {
                display: flex;
                align-items: center;
            }
        }
    `);

    let groupname = '',
        encodedGroupname = '',
        groupnameFirstWord = '',
        platform = document.getElementById('user_script_data').dataset.platform,
        isAdult = false;

    function replaceSearchUrl(searchUrl) {
        return searchUrl.replace('NAME', encodedGroupname)
    }

    if (isEditPage) {
        isAdult = sessionStorage.getItem('isAdult');
        sessionStorage.clear();
        groupname = document.querySelector('h2 a').textContent.replace(/:| -/g, '');
        setAlternateNames(groupname);

        let reviewsTable;
        if (platform) {
            reviewsTable = document.getElementById('reviews_table').firstElementChild;
            reviewsTable.style.display = 'flex';
            reviewsTable.style.flexDirection = 'column';
            delete sites.itunes;
            trailerInput = document.getElementById('trailer');
            addSteamTrailerButton();
        } else {
            delete sites.itunesstore;
        }

        const weblinksEditContainer = document.getElementById('weblinks_edit');
        form = weblinksEditContainer.closest('form');
        addBottomContainer(reviewsTable);

        const allSites = [...Object.values(reviewSites), ...Object.values(sites)];
        for (const tr of weblinksEditContainer.querySelectorAll('tr')) {
            const input = tr.querySelector('input[type=url]');
            const searchLink = tr.firstElementChild.firstElementChild;

            if (input.value && settings.add_wayback_links) {
                searchLink.insertAdjacentHTML('afterend', `<a href="https://web.archive.org/web/*/${input.value}" target="_blank">[W]</a>`);
            }
            const site = allSites.find(site => site.inputId === input.id);
            if (site) {
                const newSearchUrl = replaceSearchUrl(site.searchUrl);
                site.searchUrl = newSearchUrl;
                searchLink.href = newSearchUrl;
            }
        }

        const vndbValue = getInputValueOrCheckedLink(sites.vndb.inputId);
        if (vndbValue) addVndbSearchButton();
        addCheckboxesInputHandler();
        addSubmitHandler();
    } else {
        if (groupContentDiv && !document.querySelector("#group_nofo_bigdiv > div.head").textContent.includes("Application")) {
            isAdult = !!document.querySelector("#group_tags a[href*='adult']");
            sessionStorage.setItem('isAdult', isAdult);

            if (typeof GM_getValue('corner_button') === 'boolean')
GM_setValue('corner_button', undefined);

            createCornerButton('right', 'Non-wiki Edit Helper', e => {
                if (e.shiftKey) auto_search = false;
                e.target.remove();
                runGroup();
            });

            if (auto_search) {
                GM_registerMenuCommand('Run (without auto search)', () => {
                    auto_search = false;
                    runGroup();
                });
            }
        }
    }

    function searchAndAddBottomButtons(reviews, isHandler) {
        function doReviews() {
            if (isAdult)
                insertAdultPresentText(reviews);
            else {
                searchReviews(reviews);
            }
        }

        if (isEditPage) {
            if (reviews) doReviews();

            const links = document.getElementById('weblinks_edit').firstElementChild;
            for (const tr of links.children) {
                const secondTd = tr.children[1];
                secondTd.style.display = 'flex';
                secondTd.style.flexDirection = 'column';
                secondTd.querySelector('br').remove();
            }
            searchSites();
        } else {
            if (auto_search || isHandler) {
                if (settings.auto_search_reviews) doReviews();
                searchSites();
            }
        }
    }

    async function runGroup() {
        GM_addStyle(
`
            #nwehelper table input[type=url] {
                width: 100%;
            }

            .nwe-title {
                padding-right: 6px;
                white-space: nowrap;
            }

            #nwehelper-links td:nth-of-type(2) {
                width: 100%;
                display: flex;
                flex-direction: column;
            }
        `);

        if (settings.columns > 1) {
            GM_addStyle(
`
                #nwehelper-links {
                    display: grid;
                    grid-template-columns: repeat(${(GM_getValue('columns'))}, 1fr);
                    row-gap: 6px;
                    column-gap: 15px;
                }

                #nwehelper form {
                    margin: 0 1%;
                }
            `
            );
        } else {
            GM_addStyle(
`
                #nwehelper form {
                    width: 80%;
                    margin: 0 auto;
                }

                .nwe-title {
                    text-align: right;
                    width: 1px;
                }
            `
            );
        }

        const infoHeader = document.querySelector("#group_nofo_bigdiv > div.head").textContent;
        const isEbookGroup = infoHeader.includes('Book');

        const {groupName, year, pegi, trailer} = document.getElementById('user_script_data').dataset;

        groupname = platform ? groupName : groupName.replace(/(.*) by .*/, '$1').trim();
        setAlternateNames(groupname);

        const ratingMap = new Map([
            ['3+', '1'],
            ['7+', '3'],
            ['12+', '5'],
            ['16+', '7'],
            ['18+', '9'],
            ['N/A', '13'],
        ]);

        document.getElementById('grouplinks').insertAdjacentHTML('afterend',
`
            <section id="nwehelper" class="box">
                <div class="head" style="width: 100%;">Non-wiki Edit Helper</div>
                <form>
                    <input type="hidden" name="action" value="nonwikiedit">
                    <input type="hidden" name="groupid" value=${new URL(location.href).searchParams.get('id')}>
                    <div style="display: flex;gap: 5%;margin-bottom: 15px;">
                        ${isEbookGroup ? '' : `<label>Year:
                            <input type="number" min="1940" max="2100" name="year" size="10" value=${year}>
                            <input type="hidden" name="oldyear" value=${year}>
                        </label>`}
                        ${platform ? `<label>Age Rating: <select name="rating">
                            <option value="3+">3+</option>
                            <option value="7+">7+</option>
                            <option value="12+">12+</option>
                            <option value="16+">16+</option>
                            <option value="18+">18+</option>
                            <option value="N/A">N/A</option>
                        </select>
                        <input type="hidden" name="oldrating" value=${ratingMap.get(pegi)}>
                        </label>` : ''}
                    </div>
                    ${platform ? `<table style="margin: 0 auto 20px;">
                            <tbody id="nwehelper-reviews" style="display:flex;gap: 2%"></tbody>
                        </table>` : ''}
                    <table>
                        <tbody id="nwehelper-links"></tbody>
                    </table>
                    <input type="submit" style="justify-content: center">
                </form>
            </section>
        `);

        form = document.querySelector('#nwehelper form');
        const reviewsBody = document.getElementById('nwehelper-reviews');
        const linksBody = document.getElementById('nwehelper-links');
        const bottomContainer = addBottomContainer(reviewsBody);
        const ratingEl = form.querySelector('select[name=rating]');
        if (ratingEl) ratingEl.value = pegi;

        if (platform) {
            for (const [key, {
                name,
                inputId,
                inputPattern,
                scoreInputId,
                scoreInputMax,
                searchUrl,
                step
            }] of Object.entries(reviewSites)) {
                const ratingDiv = document.querySelector(`.ratings.${scoreInputId.replace('score', '')}`);
                const href = ratingDiv?.parentElement.href;
                reviewSites[key].searchUrl = replaceSearchUrl(searchUrl);

                reviewsBody.insertAdjacentHTML('beforeend',
`
                    <tr>
                        <td class="nwe-title" style="text-align: right;">
                            ${href ? `<a href=${href} target="_blank">${name}</a>` : name}<br>
                            <a href=${searchUrl.replace('NAME', encodedGroupname)} target="_blank">[S]</a>
                        </td>
                        <td>
                            <input type="number" id=${scoreInputId} name=${scoreInputId} min="0" max=${scoreInputMax}
                                   step=${step} value=${ratingDiv?.firstElementChild.textContent ?? ''}>
                            / ${scoreInputMax}
                            <input type="url" id=${inputId} name=${inputId} pattern=${inputPattern}
                                   value=${href?.replace('http:', 'https:') ?? ''}>
                        </td>
                    </tr>
                `);
            }
        }

        const specialTitles = new Map([
            ['itchuri', 'Itch'],
            ['rpgneturi', 'RPGnet']
        ]);
function insertRows(sites) {
            sites.forEach(site => {
                const specialTitle = specialTitles.get(site.inputId);
                const anchorTitle = specialTitle ? specialTitle : site.name.replace(/ /g, '');
                const searchUrl = replaceSearchUrl(site.searchUrl);
                site.searchUrl = searchUrl;

                const href = document.querySelector(`a[title=${anchorTitle}]`)?.href ?? '';
                linksBody.insertAdjacentHTML('beforeend',
`
                    <tr>
                        <td class="nwe-title">${href ? `<a href=${href} target="_blank">${(site.name)}</a>` : site.name}
                            <a href=${searchUrl} target="_blank">[S]</a>
                            ${(href && settings.add_wayback_links) ? `<a href="https://web.archive.org/web/*/${href}" target="_blank">[W]</a>` : ''}
                        </td>
                        <td style="width: 100%;">
                            <input type="url" id=${site.inputId} name=${site.inputId}
                                   ${site.inputPattern ? `pattern=${site.inputPattern}` : ''} title=${anchorTitle}
                                   value=${site.inputId === 'gameswebsiteuri' ? href : href.replace('http:', 'https:')}>
                        </td>
                    </tr>
                `);
            });
        }

        if (platform) {
            insertRows(commonSites);
            insertRows(commonGameSites);
            if (!['Pen and Paper RPG', 'Board Game'].includes(platform))
                insertRows(consoleAndPcAndMobileSites);
            if (['Windows', 'Mac', 'Linux'].includes(platform))
                insertRows(commonPcSites);
            if (['Windows', 'Mac'].includes(platform))
                insertRows(windowsAndMacSites);
            if (['Pen and Paper RPG', 'Board Game', 'Windows', 'Mac', 'Linux'].includes(platform))
                insertRows(pcAndPPrpgSites);
            if (platform === 'Windows')
                insertRows(windowsSites);
            if (['Mac', 'iOS'].includes(platform))
                insertRows(macAndiOSSites);
            if (platform === 'Android')
                insertRows(androidSites);
            if (platform === 'PlayStation 4')
                insertRows(playstation4Sites);
            if (platform === 'Switch' || platform.includes('Wii'))
                insertRows(switchAndWiiSites);
            if (platform === 'Oculus Quest')
                insertRows(oculusSites);
            if (platform === 'Pen and Paper RPG')
                insertRows(PPrpgSites);
            if (platform === 'Board Game')
                insertRows(boardGameSites);
            delete sites.itunes;

            bottomContainer.insertAdjacentHTML('beforebegin',
`
                <div style="margin: 10px 0 10px 0;">Trailer
                    <a href="https://www.youtube.com/results?filters=short&lclk=short&search_query=${groupname}+game+trailer"
                       target="_blank">[S]
                    </a>
                    <input type="url" size="80" style="margin-left: 20px;" id="trailer" name="trailer"
                           value=${trailer?.replace('http:', 'https:') ?? ''}>
                </div>`);

            trailerInput = document.getElementById('trailer');
            addSteamTrailerButton();
        } else {
            if (infoHeader.includes('OST')) {
                delete sites.itunesstore;
                insertRows(ostSites);
            } else {
                insertRows(commonSites);
                insertRows(ebookSites);
            }
        }

        for (const input of form.querySelectorAll('input[type=url]')) {
            input.addEventListener('input', () => {
                    if (input.validity.typeMismatch) {
                        input.setCustomValidity('Enter a URL');
                    } else if (input.validity.patternMismatch) {
                        input.setCustomValidity('Invalid URL format');
                    } else input.setCustomValidity('');
                }
            );
        }

        searchAndAddBottomButtons(reviewsBody);
        addCheckboxesInputHandler();
        addSubmitHandler();

        const vndbValue = getInputValueOrCheckedLink(sites.vndb.inputId);
        if (vndbValue) {
            auto_search ? addVndbLinks(vndbValue) : addVndbSearchButton();
        }
    }

    function setAlternateNames(groupname) {
        encodedGroupname = encodeURIComponent(groupname);
        groupnameFirstWord = groupname.replace(/[ :].*/, '');
}

    function addUncheckButton(el, isReviews) {
        if (settings.default_unchecked) return
        const button = document.createElement('button');
        bottomRightContainer.append(button);
        button.type = 'button';
        button.textContent = `Uncheck ${isReviews ? 'Reviews' : 'All'}`;
        button.addEventListener('click', () => el.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = false));
        bottomRightContainer.append(button);
    }

    function addSubmitHandler() {
        const p = [];

        function findReviewDetails(url, scoreSelector, scoreInput, urlInput) {
            p.push(promiseXHR(url)
                .then(r => {
                    const doc = parseDoc(r);
                    const score = doc.querySelector(scoreSelector);
                    if (!score) return
                    scoreInput.value = score.textContent;
                    urlInput.value = r.finalUrl;
                })
            );
        }

        form.addEventListener('submit', e => {
            submitButton.value = 'Submitting';
            submitButton.disabled = true;
            submitButton.style.removeProperty('outline');
            e.preventDefault();
            let reviewTable, linksTable;

            if (isEditPage) {
                reviewTable = document.getElementById('reviews_table')?.firstElementChild;
                linksTable = document.getElementById('weblinks_edit').firstElementChild;
            } else {
                reviewTable = document.getElementById('nwehelper-reviews');
                linksTable = document.getElementById('nwehelper-links');
            }

            if (reviewTable) {
                for (const tr of reviewTable.children) {
                    const checked = tr.querySelector('input:checked');
                    const scoreInput = tr.querySelector('input[type=number]');
                    if (scoreInput.value || !checked) continue
                    const checkedHref = checked.previousElementSibling.href;
                    const urlInput = tr.querySelector('input[type=url]');
                    switch (scoreInput.id) {
                        case "meta":
                            const platformMap = new Map([
                                ["Windows", "pc"],
                                ["Mac", "pc"],
                                ["Linux", "pc"],
                                ["PlayStation 1", "playstation"],
                                ["PlayStation 2", "playstation-2"],
                                ["PlayStation 3", "playstation-3"],
                                ["PlayStation 4", "playstation-4"],
                                ["PlayStation 5", "playstation-5"],
                                ["Switch", "nintendo-switch"],
                                ["Wii U", "wii-u"],
                                ["iOS", "ios-iphoneipad"],
                                ["Nintendo DS", "ds"],
                                ["Nintendo 3DS", "3ds"],
                                ["Dreamcast", "dreamcast"],
                                ["Xbox", "xbox"],
                                ["Xbox 360", "xbox-360"],
                                ["PlayStation Portable", "psp"],
                                ["PlayStation Vita", "playstation-vita"],
                                ["Game Boy Advance", "game-boy-advance"],
                                ["Nintendo GameCube", "gamecube"],
                                ["Oculus Quest", "meta-quest"],
                            ]);
                            const matchedPlatform = platformMap.get(platform);
                            if (!matchedPlatform) continue
                            findReviewDetails(`${checkedHref}${checkedHref.endsWith('/') ? '' : '/'}critic-reviews/?platform=${matchedPlatform}`, 'div[title*=Metascore]', scoreInput, urlInput);
                            break
                        case "ignscore":
                            findReviewDetails(checkedHref, '.review-score figcaption', scoreInput, urlInput);
                            break
                        case "gamespotscore":
                            findReviewDetails(checkedHref, '.review-ring-score__score', scoreInput, urlInput);
                    }
                }
            }

            const extralinksLabels = Array.from(document.querySelectorAll('.extralinks label'))
                .filter(l => l.firstElementChild.checked);

            for (const tr of linksTable.children) {
                const urlInput = tr.querySelector('input[type=url]');
                const checked = tr.querySelector('input:checked');
                const matchingLink = extralinksLabels.find(label => label.firstElementChild.name === urlInput.id);
                const url = matchingLink ? matchingLink.children[1].href : checked ? checked.previousElementSibling.href : '';
                if (!url) continue
                if (urlInput.id === sites.gamefaqs.inputId) {
                    p.push(findGameFaqsPlatformPage(url, urlInput));
                    continue
                }
                urlInput.value = url;

                if (!isEditPage && urlInput.value && !document.querySelector(`a[title=${urlInput.title}]`))
document.body.insertAdjacentHTML('beforeend', `<a href=${urlInput.value} title=${urlInput.title} style="display:none;"></a>`);
            }

            const gamewebsite = linksTable.querySelector(`input[name=${sites.gameswebsite.inputId}]`);
            if (gamewebsite?.value && !gamewebsite.value.startsWith('https')) {
                const httpsUrl = gamewebsite.value.replace('http', 'https');
                p.push(promiseXHR(httpsUrl, {timeout: 5000}).then(r => {
                    if (r.status === 200) gamewebsite.value = r.finalUrl;
                }));
            }

            Promise.allSettled(p)
                .then(async () => {
                    if (!form.reportValidity()) {
                        submitButton.value = 'Submit';
                        submitButton.disabled = false;
                        return
                    }
                    if (isEditPage) {
                        for (const checkbox of form.querySelectorAll('input[type=checkbox][name]')) {
checkbox.removeAttribute('name');
                        }
                        form.submit();
                        return
                    }

                    const formdata = new FormData(form);
                    const newFormData = new FormData();

                    for (const key of formdata.keys()) {
                        const filteredValues = formdata.getAll(key)
                            .filter(value => value !== 'on');
for (const value of filteredValues) {
                            newFormData.append(key, value);
                        }
                    }
fetch('torrents.php', {
                        method: 'post',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        body: new URLSearchParams(newFormData)
                    })
                        .then(r => {
                            if (!(r.ok && r.redirected)) {
                                console.log(r);
                                throw Error
                            }
                            submitButton.value = 'Submit';
                            submitButton.disabled = false;
                            submitButton.style.outline = 'lightgreen 1px solid';
                            if (settings.refresh_after_submit) location.reload();
                        })
                        .catch(() => {
                            submitButton.disabled = false;
                            alert('Failed');
                        });
                });
        });
    }

    function addBottomContainer(reviews) {
        const div = document.createElement('div');
        div.id = 'nwehelper-bottom';
        div.style.cssText = `display: flex;
    justify-content: space-between;
    width: 70%;
    margin: 15px auto 0 auto;
    align-items: center;`;
        submitButton = form.querySelector('input[type=submit]');
        submitButton.style.margin = 'auto';
        form.append(div);
        form.insertBefore(div, submitButton);
        div.append(submitButton);

        bottomRightContainer = document.createElement('div');
        bottomRightContainer.className = 'sidecontainer';
        bottomRightContainer.style.justifyContent = 'end';
        div.append(bottomRightContainer);
        bottomLeftContainer = document.createElement('div');
        bottomLeftContainer.className = 'sidecontainer';
        div.prepend(bottomLeftContainer);
        if (!auto_search || isEditPage) {
            addSearchButton('Search All', () => searchAndAddBottomButtons(reviews, true));
        }
        return div
    }

    function addCheckboxesInputHandler() {
        form.addEventListener('input', e => {
            const target = e.target;
            if (target.type !== 'checkbox' && !target.checked) return
            const closestTd = target.closest('td');
            const name = target.name || closestTd.firstElementChild.name;

            const checkboxes = [];
            let tdAdded = false;
            for (const input of form.querySelectorAll(`input[name=${name}]`)) {
if (input.type === 'checkbox') checkboxes.push(input);
                else if (!tdAdded) {
                    checkboxes.push(...input.closest('td').querySelectorAll('input[type=checkbox]'));
                    tdAdded = true;
                }
            }

            for (const c of checkboxes) {
                if (c !== target) {
                    c.checked = false;
                }
            }
        });
    }

    function insertAdultPresentText(reviewsBody) {
        reviewsBody.insertAdjacentHTML('afterend', `<p style="color:antiquewhite;">Group is tagged adult: skipped searching reviews</p>`);
    }
function throwNotFound(items, key) {
        if (!items || items.length < 1) throw Error('notfound', {cause: 'notfound'})

        if (platform && settings.check_first_word) {
const arr = Array.from(items);
            arr.length = Math.min(max_results, items.length);
            const lowerGroupname = groupnameFirstWord.toLowerCase();

            if (arr.every(item => {
                let text = '';
                if (item instanceof Node) text = findTextNode(item)?.toLowerCase().trim();
                else text = key ? item[key].toLowerCase() : item.toLowerCase();
                const b = text?.startsWith(lowerGroupname);
                return b === null ? false : !b
            })) {
                throw Error('notfound', {cause: 'notfound'})
            }
        }
    }

    function searchReviews(reviews) {
        if (!platform) return
        Promise.allSettled([
            searchAndAddElements(reviewSites.meta, (r, tr, ld) => {
                const ratedGames = r.response.data.items.filter(i => i.criticScoreSummary.score);
                throwNotFound(ratedGames, 'title');

                for (let i = 0; i < Math.min(max_results, ratedGames.length); i++) {
                    const {criticScoreSummary: {score}, title, slug} = ratedGames[i];
                    setAnchorProperties(addElementsToRow(tr, ld, i), `${title} (${score})`, `https://www.metacritic.com/game/${slug}`);
                }
            }, `https://backend.metacritic.com/finder/metacritic/search/${encodedGroupname}/web?apiKey=1MOZgmNFxvmljaQR1X9KAij9Mo4xAY3u&mcoTypeId=13&limit=10`, {responseType: "json"}),
            searchAndAddElements(reviewSites.ign),
            searchAndAddElements(reviewSites.gamespot, (r, tr, ld) => {
                const results = r.response.results.filter(i => i.typeName === 'Review');
                throwNotFound(results, 'title');
                for (let i = 0; i < Math.min(max_results, results.length); i++) {
                    const {title, dateDisplay, url} = results[i];
                    setAnchorProperties(addElementsToRow(tr, ld, i), `${title} (${dateDisplay})`, `https://www.gamespot.com${url}`);
                }
            }, `https://www.gamespot.com/jsonsearch/?header=1&i=reviews&module=autocomplete&q=${encodedGroupname}`, {
                headers: {
                    referer: 'https://www.gamespot.com/',
                    'Content-Type': 'application/json',
                    'x-requested-with': 'XMLHttpRequest'
                },
                responseType: "json",
            }),
        ]).then(() => {
            if (reviews.querySelector('input[type=checkbox]'))
                addUncheckButton(reviews, true);
        });
    }

    function genericSearchWithLinkReplacement(r, tr, ld, replacePattern, replacement) {
        const doc = parseDoc(r);
        const genericSearchSelector = getGenericSearchSelectors(r.finalUrl)[0];
        const anchors = [...doc.querySelectorAll(genericSearchSelector)];
        throwNotFound(anchors);
        anchors.forEach(a => a.href = a.href.replace(replacePattern, replacement));
        const added = new Set();
        const filtered = anchors.filter(a => added.has(a.href) ? false : added.add(a.href));
for (let i = 0; i < Math.min(max_results, filtered.length); i++) {
            setAnchorProperties(addElementsToRow(tr, ld, i), findTextNode(filtered[i]), filtered[i].href);
        }
    }

    function doItunes(r, tr, ld) {
        genericSearchWithLinkReplacement(r, tr, ld, /\.com\/.*?\/(.*\/)/, '.com/$1');
}

    function searchSites() {
        Promise.allSettled([
            searchAndAddElements(sites.gameswebsite),
            searchAndAddElements(sites.wikipedia, (r, tr, ld) => {
                const pages = r.response?.query?.pages;
                const values = Object.values(pages ?? {});
                const sorted = values.sort((a, b) => a.index - b.index);
throwNotFound(sorted, 'title');
                for (let i = 0; i < Math.min(max_results, sorted.length); i++) {
                    setAnchorProperties(addElementsToRow(tr, ld, i), sorted[i].title, sorted[i].fullurl);
                }
            }, `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodedGroupname}&prop=info&inprop=url&format=json`, {responseType: "json"}),
            searchAndAddElements(sites.giantbomb),
            searchVNDB(),
            searchHLTB(),

            searchAndAddElements(sites.amazon, (r, tr, ld) =>
                genericSearchWithLinkReplacement(r, tr, ld, /(.*\.com\/).*(dp\/.*?(?=\/|$))/,
                    (match, p1, p2) => p1 && p2 ? p1 + p2 : match)),

            searchAndAddElements(sites.gamefaqs, (r, tr, ld) => {
                let res = r.response;
                throwNotFound(res[0].game_name ? res : [], 'game_name');
                res.length--;
for (let i = 0; i < Math.min(max_results, res.length); i++) {
                    setAnchorProperties(addElementsToRow(tr, ld, i), res[i].game_name, `https://gamefaqs.gamespot.com${res[i].url}`);
                }
            }, `https://gamefaqs.gamespot.com/ajax/home_game_search?term=&term=${encodedGroupname}`, {responseType: "json"}),
            searchAndAddElements(sites.mobygames),

            searchAndAddElements(sites.steam, (r, tr, ld) => {
                const doc = parseDoc(r);
                const anchors = Array.from(doc.querySelectorAll(sites.steam.selectors[0]));
                throwNotFound(anchors);
                anchors.forEach(anchor => anchor.href = /.*\d+\/.*?\//.exec(anchor.href)?.[0] ?? anchor.href);
const years = doc.querySelectorAll('.search_released.responsive_secondrow');
                for (let i = 0; i < Math.min(max_results, anchors.length); i++) {
                    setAnchorProperties(addElementsToRow(tr, ld, i), `${findTextNode(anchors[i])}, ${years[i].textContent}`, anchors[i].href);
                }
                addSteamTrailerButton();
            }),
            searchAndAddElements(sites.gog, (r, tr, ld) => {
                    const products = r.response.products;
                    throwNotFound(products, 'title');
                    for (let i = 0; i < Math.min(max_results, products.length); i++) {
                        setAnchorProperties(addElementsToRow(tr, ld, i), products[i].title, products[i].storeLink);
                    }
                }, `https://catalog.gog.com/v1/catalog?limit=${max_results}&query=like%3A${encodedGroupname}&systems=${platform === 'Mac' ? 'osx' : platform?.toLowerCase() ?? ''}&productType=in%3Agame`,
                {responseType: "json"}),

            searchAndAddElements(sites.humble, (r, tr, ld) => {
                const results = r.response.results;
                throwNotFound(results, 'human_name');
                for (let i = 0; i < Math.min(max_results, results.length); i++) {
                    setAnchorProperties(addElementsToRow(tr, ld, i), results[i].human_name, `https://www.humblebundle.com/store/${results[i].human_url}`);
                }
            }, `https://www.humblebundle.com/store/api/search?search=${encodedGroupname}&request=1`, {responseType: "json"}),
            searchAndAddElements(sites.itunesstore, doItunes),

            searchAndAddElements(sites.itch, undefined),
            searchAndAddElements(sites.pcwiki, (r, tr, ld) => {
                const [, titles, , links] = r.response;
                throwNotFound(titles);
                for (let i = 0; i < Math.min(max_results, titles.length); i++) {
                    setAnchorProperties(addElementsToRow(tr, ld, i), titles[i], links[i]);
                }
            }, `https://www.pcgamingwiki.com/w/api.php?action=opensearch&format=json&formatversion=2&search=${encodedGroupname}`, {responseType: "json"}),
            searchAndAddElements(sites.nexusmods, (r, tr, ld) => {
                const doc = parseDoc(r);
                let anchors = doc.querySelectorAll(getGenericSearchSelectors(r.finalUrl)[0]);
                throwNotFound(anchors);
                anchors = Array.from(anchors)
                    .filter(a => !a.href.includes('next.nexusmods') && a.href.includes('/games') && !a.href.includes('/mods'));
for (let i = 0; i < Math.min(max_results, anchors.length); i++) {
                    setAnchorProperties(addElementsToRow(tr, ld, i), findTextNode(anchors[i]), anchors[i].href);
                }
            }),

            searchAndAddElements(sites.epicgames, undefined),

            searchAndAddElements(sites.psn, (r, tr, ld) => {
                const doc = parseDoc(r);
                const titles = doc.querySelectorAll('.sub-grid .search-results__tile__content-title');
                throwNotFound(titles);
                for (let i = 0; i < Math.min(max_results, titles.length); i++) {
                    setAnchorProperties(addElementsToRow(tr, ld, i), titles[i].textContent, titles[i].closest('a'));
                }
            }),

            searchAndAddElements(sites.googleplay, (r, tr, ld) => {
                const doc = parseDoc(r);
                const anchors = doc.querySelectorAll('a[href^="/store/apps"]');
                throwNotFound(anchors);
                for (let i = 0; i < Math.min(max_results, anchors.length); i++) {
                    setAnchorProperties(addElementsToRow(tr, ld, i),
                        findTextNode(anchors[i]) || findTextNode(anchors[i].nextElementSibling.querySelector('img').nextElementSibling),
                        getFullUrl(r, anchors[i]));
                }
            }),
            searchAndAddElements(sites.nintendo, undefined,
                `https://www.google.com/search?q=site:*nintendo.com OR site:*nintendo.co.uk OR site:*nintendo.co.jp AND inurl:JP OR inurl:ja OR inurl:Games OR inurl:games OR inurl:list ${encodedGroupname}`),
            searchAndAddElements(sites.oculus, (r, tr, ld) =>
                genericSearchWithLinkReplacement(r, tr, ld, /\?srsltid.*/, '')),

            searchAndAddElements(sites.rpggeek),
            searchAndAddElements(sites.rpgnet),
            searchAndAddElements(sites.drivethrurpg, (r, tr, ld) => {
                    const data = r.response.data;
                    if (data.length < 1) throw Error('notfound', {cause: 'notfound'})
                    for (let i = 0; i < Math.min(max_results, data.length); i++) {
                        const {productId, description: {name, slug}} = data[i].attributes;
                        setAnchorProperties(addElementsToRow(tr, ld, i), name, `https://drivethrurpg.com/product/${productId}/${slug}`);
                    }
                }, `https://api.drivethrurpg.com/api/vBeta/products?page=1&groupId=1&keyword=${encodedGroupname}&order%5BmatchWeight%5D=desc&siteId=10&includeRatedContent=true&status=1&partial=false`,
                {responseType: "json"}),

            searchAndAddElements(sites.boardgamegeek),

            searchAndAddElements(sites.vgmdb, (r, tr, ld) => {
                const text = r.responseText;
                throwNotFound(text);
                const lines = text.split('\n');
                for (let i = 0; i < Math.min(max_results, lines.length); i++) {
                    const [album, _, path, __] = lines[i].split('\t');
                    setAnchorProperties(addElementsToRow(tr, ld, i), album, `https://vgmdb.net${path}`);
                }
            }, `https://vgmdb.net/db/ajax-autocomplete.php?q=${encodedGroupname}&limit=${max_results}`),
            searchAndAddElements(sites.discogs),
            searchAndAddElements(sites.bandcamp, (r, tr, ld) => {
                const doc = parseDoc(r);
                const anchors = doc.querySelectorAll('.heading a');
                throwNotFound(anchors);
                const artists = doc.querySelectorAll('.subhead');
                for (let i = 0; i < Math.min(max_results, anchors.length); i++) {
                    setAnchorProperties(addElementsToRow(tr, ld, i), anchors[i].textContent + artists[i].textContent, anchors[i].href.replace(/(\?from=.*)/, ''));
                }
            }),
            searchAndAddElements(sites.musicbrainz),
            searchAndAddElements(sites.itunes, doItunes),

            searchAndAddElements(sites.googleplaybooks),
            searchAndAddElements(sites.goodreads),
        ]).then(() => {
            if (form.querySelector('input[type=checkbox]'))
                addUncheckButton(form);
        });
    }

    function addSteamTrailerButton() {
        if (!document.getElementById(sites.steam.inputId)) return

        trailerInput.insertAdjacentHTML('afterend', `<button type=button style="margin-left: 5px;">Get Steam trailer</button>`);
        trailerInput.nextElementSibling.onclick = () => {
            const value = getInputValueOrCheckedLink(sites.steam.inputId);
            if (!value) {
                alert('No Steam link set or checked');
                return
            }
            const appId = /\d+/.exec(value)[0];
            promiseXHR(`https://store.steampowered.com/api/appdetails?appids=${appId}`, {responseType: "json",})
                .then(r =>
                    trailerInput.value = r.response[appId].data.movies?.find(m => m.dash_av1).dash_av1.split("?")[0] ?? "");
        };
    }

    async function searchHLTB() {
        if (!settings.search_sites['howlongtobeat']) return

        const [tr, loading] = addLoadingToRow(sites.howlongtobeat.inputId);
        if (!tr) return
        let token = localStorage.getItem('nwe_hltb_token');

        function getToken() {
            return promiseXHR('https://howlongtobeat.com/api/search/init', {
                headers: {
                    referer: 'https://howlongtobeat.com',
                    'Content-Type': 'application/json',
                },
                responseType: "json",
            }).then(r => localStorage.setItem('nwe_hltb_token', token = r.response.token))
        }

        function run() {
            return promiseXHR(`https://howlongtobeat.com/api/search`, {
                method: 'POST',
                headers: {
                    referer: 'https://howlongtobeat.com',
                    'Content-Type': 'application/json',
                    "x-auth-token": token
                },
                responseType: "json",
                data: JSON.stringify({
                    "searchType": "games",
                    "searchTerms": groupname.split(' '),
                    "size": max_results,
                    "searchOptions": {
                        "games": {
                            "userId": 0,
                            "platform": "",
                            "sortCategory": "popular",
                            "rangeCategory": "main",
                            "rangeTime": {
                                "min": null,
                                "max": null
                            },
                            "gameplay": {
                                "perspective": "",
                                "flow": "",
                                "genre": "",
                                "difficulty": ""
                            }
                        }
                    }
                })
            })
                .then(r => {
                    if (r.status === 403) throw Error('invalid token')
                    if (r.status !== 200) throw Error
                    debugger
                    const data = r.response.data;
                    throwNotFound(data, 'game_name');
                    for (let i = 0; i < Math.min(max_results, data.length); i++) {
                        const {game_id, game_name} = data[i];
                        setAnchorProperties(addElementsToRow(tr, loading, i), game_name, `https://howlongtobeat.com/game/${game_id}`);
                    }
                })
        }

        if (!token) {
            await getToken().then(run);
        } else {
            run().catch(async e => {
                if (e?.cause === 'notfound') {
                    loading.textContent = 'Nothing Found';
                    loading.className = 'nwe-notfound';
                } else if (e?.message === 'invalid token') {
                    loading.textContent = 'Getting new token';
                    await getToken().then(run);
                } else {
                    console.error('hltb', e);
                    loading.textContent = 'Error';
                    loading.style.color = 'red';
                }
            });
        }
    }


    async function searchVNDB() {
        if (!settings.search_sites['vndb']) return

        const aliases = document.querySelector('#group_aliases strong')
            ?.nextSibling.textContent.split(', ').filter(a => a && !/[A-Z]{2}\d{4,}/.test(a));
const titles = [groupname, ...aliases || []];
        let found = false;
        for (const title of titles) {
            await new Promise(resolve => {
                searchAndAddElements(sites.vndb, (r, tr, ld) => {
                    const results = r.response.results;
                    if (results.length < 1) {
                        resolve(1);
                        throwNotFound(results, 'title');
                    }
                    found = true;
                    results.forEach(({
                                         title,
                                         released,
                                         id
                                     }, i) => setAnchorProperties(addElementsToRow(tr, ld, i), `${title}, ${released}`, `https://vndb.org/${id}`));
                    resolve(1);
                }, 'https://api.vndb.org/kana/vn', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    responseType: "json",
                    data: JSON.stringify({
                        'filters': ['search', '=', `${title}`],
                        'fields': 'title, released, id, alttitle, titles.title',
                        "sort": "title",
                        'results': max_results
                    })
                });
            });
            if (found) break
        }
        if (found) {
            addVndbSearchButton();
        }
    }

    function addVndbLinks(value) {
        const vnid = /v\d+/.exec(value)[0];
        const links = promiseXHR('https://api.vndb.org/kana/vn', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            responseType: "json",
            data: JSON.stringify(
                {
                    "filters": ["id", "=", vnid],
                    "fields": "extlinks.label, extlinks.url, extlinks.name, extlinks.id",
                    "results": 1
                })
        });
        const releases = promiseXHR('https://api.vndb.org/kana/release', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            responseType: "json",
            data: JSON.stringify(
                {
                    "filters": ["and", ["vn", "=", ["id", "=", vnid]], ["official", "=", 1], ["platform", "=", `${ggnToVndbPlatform.get(platform)}`]],
                    "fields": "extlinks.label, extlinks.url, extlinks.name, extlinks.id",
                    "results": 100
                })
        });

        Promise.all([links, releases]).then(r => {
            const vnLinks = r[0].response.results[0].extlinks;
            const vndbSiteNames = ['website', 'steam', 'itch', 'appstore', 'nintendo_jp', 'playstation_jp', 'gog'];
            const releasesLinks = r[1].response.results.flatMap(release => release.extlinks)
                .filter(extlink => vndbSiteNames.some(name => name === extlink.name));

            const allLinks = new Set(vnLinks.concat(releasesLinks));

            const links = [];
            const vndbToGgnSiteName = new Map([
                ['website', 'gameswebsiteuri'],
                ['pcgamingwiki', 'pcwikiuri'],
                ['appstore', 'itunesuri'],
                ['gamefaqs_game', 'gamefaqsuri'],
            ]);
            for (const link of allLinks) {
                const ggnName = vndbToGgnSiteName.get(link.name);
                const name = ggnName ?
                    ggnName : link.name.endsWith('wiki') ?
                        'wikipediauri' : link.name.replace('playstation', 'psn')
                        .replace(/_[a-z]{2}/, '') + 'uri';
if (form.querySelector(`input[name=${name}]`)) {
                    link.name = name;
                    links.push(link);
                }
            }

            const div = document.createElement('div');
            bottomLeftContainer.parentNode.insertAdjacentElement('beforebegin', div);
            div.innerHTML = `<h3 style="grid-column: span 6">VNDB Links</h3>`;
            div.className = 'extralinks';
            if (links.length > 0) {
                for (const {name, url, label} of links) {
                    div.insertAdjacentHTML('beforeend', `
            <label>
                <input type="checkbox" name=${name}>
                <a href=${url} target="_blank">${label}</a>
            </label>`);
                    const c = div.querySelectorAll(`input[name="${name}"]`);
                    const value1 = form.querySelector(`input[type=url][name=${name}]`).value;
                    if (!c[0].checked && !value1) c[0].click();
                }
                return
            }
            div.insertAdjacentHTML('beforeend', `<p class="nwe-notfound">Nothing found</p>`);
        });
    }

    function getInputValueOrCheckedLink(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return
        const tr = input.closest('tr');
        const checked = tr.querySelector("input:checked");
        return checked?.previousElementSibling.href ?? input?.value
    }

    function addVndbSearchButton() {
        addSearchButton('Get VNDB Links', () => {
            const value = getInputValueOrCheckedLink(sites.vndb.inputId);
            if (!value) {
                alert('No VNDB link set or checked');
                return
            }
            addVndbLinks(value);
        });
    }

    function addSearchButton(text, cb) {
        const button = document.createElement('button');
        button.textContent = text;
        button.type = 'button';
        bottomLeftContainer.append(button);
        button.onclick = () => {
            button.remove();
            cb();
        };
    }

    async function findGameFaqsPlatformPage(url, input) {
        const pageResponse = await promiseXHR(url);
        const doc = parseDoc(pageResponse);
        const platformName = doc.querySelector('span.header_more').textContent.trim();
        const matchedPlatform = ggnToGamefaqsPlatform.get(platform);
        if (matchedPlatform && matchedPlatform === platformName) {
            input.value = url;
            return
        }
        const platformLinks = doc.querySelectorAll('#header_more_menu a');
        const platformLink = Array.from(platformLinks).find(a => matchedPlatform === a.textContent.trim());
        if (!platformLink) return
        input.value = getFullUrl(pageResponse, platformLink);
    }

    const parser = new DOMParser();

    function parseDoc(response) {
        return parser.parseFromString(response.responseText, 'text/html')
    }

    function setAnchorProperties(anchor, text, url) {
        anchor.textContent = text.trim();
        anchor.href = url;
    }
function addElementsToRow(tr, loading, index) {
        loading.remove();
        const label = document.createElement('label');

        if (isEditPage) {
            label.style.maxWidth = '400px';
        }
        label.style.display = 'flex';
        label.style.alignItems = 'center';

        tr.children[1].append(label);
        const anchor = document.createElement('a');
        anchor.target = '_blank';
        anchor.style.flex = '1';
        anchor.style.wordBreak = 'break-all';
        anchor.style.color = '#BBB4B8';
        label.append(anchor);
        label.insertAdjacentHTML('beforeend',
            `<input type="checkbox" style="padding-left: 5px;" ${(index > 0 ? '' : settings.default_unchecked ? '' : 'checked')}>`);
return anchor
    }

    function addLoadingToRow(id) {
        const tr = document.getElementById(id)?.closest('tr');
        if (!tr) return []
        const urlInput = tr.querySelector('input[type=url]');
        if (urlInput.value) {
            if (urlInput.pattern) {
                const matchesPattern = new RegExp(urlInput.pattern).test(urlInput.value);
                if (matchesPattern) return []
                urlInput.style.outline = '1px solid orange';
            } else return []
        }

        const loading = document.createElement('span');
        loading.textContent = 'Loading';
        loading.className = 'nwe-loading';
        tr.children[1].append(loading);
        return [tr, loading]
    }

    async function genericSearch(searchUrl) {
        searchUrl = searchUrl.includes('http') ? searchUrl : `https://www.google.com/search?q=site:${searchUrl}%20${encodedGroupname}`;
        const googleRes = promiseXHR(searchUrl, {timeout: 5000});
        if ((await googleRes).status === 200) return googleRes

        const ddgParam = searchUrl
            .replace('https://www.google.com/search?q=', '')
            .replace('%20-inurl:?l=', '');

        console.log(`%c searching DDG for ${ddgParam}`, 'color: #d790df');
        const ddgRes = promiseXHR('https://lite.duckduckgo.com/lite/', {
            method: 'POST',
            body: `q=${ddgParam}`,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            timeout: 5000
        });
        if ((await ddgRes).status === 200) return ddgRes

        const yandexUrl = searchUrl
            .replace('https://www.google.com/search?q=', 'https://yandex.com/search/?text=')
            .replace('%20-inurl:?l=', '');

        console.log(`%c searching Yandex ${yandexUrl}`, 'color: #d790df');
        const yandexRes = promiseXHR(yandexUrl, {timeout: 5000});
        if ((await yandexRes).status === 200) return yandexRes

        return Promise.reject()
    }

    function getGenericSearchSelectors(finalUrl) {
        return finalUrl.includes('google.com') ? ['#search a:has(h3)']
            : finalUrl.includes('duckduckgo.com') ? ['.result__a']
                : finalUrl.includes('yandex.com') ? ['.content a:has(h2)']
                    : ['']
    }
function searchAndAddElements(site, func, url, options) {
        if (!site || !settings.search_sites[site.inputId.replace('uri', '')]) return
        const [tr, loading] = addLoadingToRow(site.inputId);
        if (!tr) return Promise.resolve()

        const useGenericSearch = site.useGenericSearch;
        const searchPromise = useGenericSearch
            ? genericSearch(typeof useGenericSearch === 'string' ? useGenericSearch : site.searchUrl)
: promiseXHR(url ?? site.searchUrl, {...options, timeout: 8000});

        return searchPromise
            .then(async res => {
                if (res.status !== 200) {
                    console.error(res, url);
                    throw Error()
                }
                if (func) {
                    await func(res, tr, loading);
                } else {
                    const doc = parseDoc(res);
                    const selectors = site.selectors?.length > 0 ? site.selectors : getGenericSearchSelectors(res.finalUrl);

                    const selectedAnchors = doc.querySelectorAll(selectors[0]);

                    throwNotFound(selectedAnchors);
                    for (let i = 0; i < Math.min(max_results, selectedAnchors.length); i++) {
                        let text = findTextNode(selectedAnchors[i]);
                        if (selectors.length > 1) {
                            for (let j = 1; j < selectors.length; j++) {
                                const elements = doc.querySelectorAll(selectors[j]);
                                const otherText = findTextNode(elements[i]);
                                if (otherText)
                                    text += ', ' + otherText;
                            }
                        }
                        const anchor = addElementsToRow(tr, loading, i);
                        setAnchorProperties(anchor, text, getFullUrl(res, selectedAnchors[i]));
                    }
                }
            })
            .catch(e => {
                if (e?.cause === 'notfound') {
                    loading.textContent = 'Nothing Found';
                    loading.className = 'nwe-notfound';
                } else {
                    console.error(url, e);
                    loading.textContent = 'Error';
                    loading.style.color = 'red';
                }
            })
    }
function findTextNode(node) {
        if (!node) return ''

        if (node.nodeType === 3 && /\S/.test(node.nodeValue)) {
            return node.nodeValue.trim()
        }

        if (node.childNodes.length < 1) return null

        for (const childNode of node.childNodes) {
            const text = findTextNode(childNode);
            if (text) return text
        }

        return null
    }

})();