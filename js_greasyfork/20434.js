// ==UserScript==
// @name            StarRepublik Tools
// @name:bg         StarRepublik Инструменти
// @name:ro         Unelte StarRepublik
// @description     Various enhancements and tools for StarRepublik
// @description:bg  Различни подобрения и инструменти за StarRepublik
// @description:ro  Diverse îmbunătățiri și unelte pentru StarRepublik
// @namespace       http://www.linuxmint.ro/
// @version         1.7.6
// @license         CC BY 4.0
// @author          Nicolae Crefelean
// @include         https://www.starrepublik.com/*
// @include         https://starrepublik.com/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/20434/StarRepublik%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/20434/StarRepublik%20Tools.meta.js
// ==/UserScript==

if (typeof jQuery !== "undefined") {
    $(function() {

        // add custom styles
        $('head').append('<style></style>');
        $('style')
            .append('#srtools { font-size: 13px; padding: 5px; background-color: #121925; border-radius: 2px; margin-top: 5px; margin-bottom: 10px }')
            .append('#srtoolsopt { display: none }')
            .append('.srtselect { height: 30px; background-color: #121925; color: #cecece; border: 1px solid #595959; border-radius: 2px; padding: 2px }');

        var currentPage = document.location.pathname,
            srtVersion = GM_info.script.version,
            srtLetters = ['α', 'β', 'γ'],
            srtEffectDelay = 150,
            srtLocale = {
                bg: {
                    name: 'Български',
                    medalsStr: 'Медали',
                    starshipPartsPointsStr: 'Изисквани Седмични турнирни точки',
                    baseDamage: 'Bаза щети',
                    battles: 'Битките',
                    move: 'Ход',
                    building: 'Cграда',
                    myLocation: 'Моето място',
                    encloseInFrame: 'Приложете в рамка',
                    open: 'Отворено',
                    close: 'Затвори',
                    total: 'Общо',
                    download: 'Изтегли',
                    csvMembersList: 'Списък с членовете CSV',
                    refreshStatistics: 'Обнови'
                },
                en: {
                    name: 'English',
                    medalStr: 'Medals',
                    starshipPartsPointsStr: 'Weekly tournament points required',
                    baseDamage: 'Base damage',
                    battles: 'Battles',
                    move: 'Move',
                    building: 'Building',
                    myLocation: 'My location',
                    encloseInFrame: 'Enclose in frame',
                    open: 'Open',
                    close: 'Close',
                    total: 'Total',
                    download: 'Download',
                    csvMembersList: 'CSV Members List',
                    refreshStatistics: 'Refresh'
                },
                es: {
                    name: 'Español',
                    medalStr: 'Medallas',
                    starshipPartsPointsStr: 'Puntos de torneo semanal necesaria',
                    baseDamage: 'Daño base',
                    battles: 'Batallas',
                    move: 'Moverse',
                    building: 'Edificio',
                    myLocation: 'Mi ubicación',
                    encloseInFrame: 'Encerrar en un marco',
                    open: 'Abrir',
                    close: 'Cerrar',
                    total: 'Total',
                    download: 'Descargar',
                    csvMembersList: 'Lista de Miembros CSV',
                    refreshStatistics: 'Recarga'
                },
                it: {
                    name: 'Italiano',
                    medalStr: 'Medaglie',
                    starshipPartsPointsStr: 'Punti Torneo Settimanale richiesti',
                    baseDamage: 'Danno base',
                    battles: 'Battaglie',
                    move: 'Spostati',
                    building: 'Costruzione',
                    myLocation: 'La tua posizione',
                    encloseInFrame: 'Incornicia',
                    open: 'Aperto',
                    close: 'Chiudi',
                    total: 'Total',
                    download: 'Scaricare',
                    csvMembersList: 'Lista utenti CSV',
                    refreshStatistics: 'Ricarica'
                },
                ro: {
                    name: 'Română',
                    medalStr: 'Medalii',
                    starshipPartsPointsStr: 'Puncte necesare în turneul săptămânal',
                    baseDamage: 'Daune de bază',
                    battles: 'Bătălii',
                    move: 'Mutare',
                    building: 'Clădire',
                    myLocation: 'Locația mea',
                    encloseInFrame: 'Încadrează în ramă',
                    open: 'Deschide',
                    close: 'Închide',
                    total: 'Total',
                    download: 'Descarcă',
                    csvMembersList: 'Lista de membri CSV',
                    refreshStatistics: 'Reîncarcă'
                },
                sr: {
                    name: 'Srpski',
                    medalStr: 'Medalje',
                    starshipPartsPointsStr: 'Delovi zvezdane krstarice',
                    baseDamage: 'Bazna steta',
                    battles: 'Bitke',
                    move: 'Predji na',
                    building: 'Zgrada',
                    myLocation: 'Moja lokacija',
                    encloseInFrame: 'Priložiti u okviru',
                    open: 'Otvoren',
                    close: 'Blizu',
                    total: 'Ukupno',
                    download: 'Preuzimanje',
                    csvMembersList: 'CSV Lista članova',
                    refreshStatistics: 'Obnovi'
                }
            },
            defaultLang = getLocale(),
            muMemberList = [],
            csvData = [];

        // adds the StarRepublik Tools settings box on the sidebar
        if ($('.stardate').length > 0) {
            $('.stardate').after('<div class="row-fluid" id="srtools"></div>');
            $('#srtools')
                .html('<div class="text-center">StarRepublik Tools v' + srtVersion + '</div>')
                .append('<div class="text-center" role="button" id="srtoggle">&#9660; ' + getString('open') + ' &#9660;</div>')
                .append('<div id="srtoolsopt"></div>');
            $('#srtoolsopt').append('<select class="form-control srtselect"></select>');
            $.each(srtLocale, function(i, v) {
                $('.srtselect').append('<option value="' + i + '"' + (i === defaultLang ? ' selected' : '') + '>' + v.name + '</option>');
            });
        }

        // Event handler for the StarRepublik Tools option box visibility toggler
        $('#srtoggle').on('click', function() {
            if ($('#srtoolsopt').is(':visible')) {
                $('#srtoolsopt').slideUp(srtEffectDelay);
                $('#srtoggle').html('&#9660; ' + getString('open') + ' &#9660;');
            } else {
                $('#srtoolsopt').slideDown(srtEffectDelay);
                $('#srtoggle').html('&#9650; ' + getString('close') + ' &#9650;');
            }
        });

        // Adds links to the Battles and the Change location pages.
        $('.dropdown:eq(0) > .dropdown-menu')
            .append('<li><a href="/change-location/">' + getString('move') + '</a></li>');

        // Set the default language as English, or if the browser requests
        // a language available in the script, it will choose it automatically.
        // The language can also be changed by the user. Refresh required.
        function setLocale(lang) {
            if (localStorage.locale === undefined) {
                var langList = navigator.languages,
                    language = 'en',
                    found = false;
                for (let i=0; !found; i++) {
                    if (srtLocale[langList[i]] !== undefined) {
                        language = langList[i];
                        found = true;
                    }
                }
                localStorage.locale = language;
                return;
            }
            if (lang !== undefined && lang in srtLocale) {
                localStorage.locale = lang;
            }
        }

        // Returns the default locale and sets one if not available.
        function getLocale() {
            if (localStorage.locale === undefined) {
                setLocale();
            }
            return localStorage.locale;
        }

        // Returns a string based on its identifier. Defaults to English if missing.
        function getString(id) {
            let lang = getLocale();
            var str = srtLocale[lang][id] === undefined ? (srtLocale.en[id] === undefined ? id : srtLocale.en[id]) : srtLocale[lang][id];
            return str;
        }

        // Event handler for the language switcher.
        $('.srtselect').change(function() {
            setLocale(this.value);
        });

        // Return the base damage.
        function getBaseDamage(skill, rank) {
            return Math.round(Math.pow(10 * skill * (1 + rank / 20), 0.8));
        }

        // Add the base damage data to the military wings on the user profile page.
        function getBaseDamageStats() {
            var d = {
                skills: {
                    interceptor: $('.skills:eq(3) .skill:eq(1) .skill-value').text().trim(),
                    bomber: $('.skills:eq(3) .skill:eq(2) .skill-value').text().trim(),
                    fighter: $('.skills:eq(3) .skill:eq(3) .skill-value').text().trim()
                },
                rank: $('.military-rank:eq(0) .description img').attr('src').split('/').pop().split('_')[0]
            },
                baseDamage = {
                    interceptor: 0,
                    bomber: 0,
                    fighter: 0
                };
            baseDamage.interceptor = getBaseDamage(d.skills.interceptor, d.rank);
            baseDamage.bomber = getBaseDamage(d.skills.bomber, d.rank);
            baseDamage.fighter = getBaseDamage(d.skills.fighter, d.rank);
            $('#baseI').html(getString('baseDamage') + ': ' + baseDamage.interceptor + '<br>+20% = ' + Math.round(baseDamage.interceptor * 1.2));
            $('#baseB').html(getString('baseDamage') + ': ' + baseDamage.bomber + '<br>+20% = ' + Math.round(baseDamage.bomber * 1.2));
            $('#baseF').html(getString('baseDamage') + ': ' + baseDamage.fighter + '<br>+20% = ' + Math.round(baseDamage.fighter * 1.2));
        }

        // Creates the HTML/CSS/JS foundation for the base damage tooltips in the user profile.
        function addBaseDamageTooltips() {
            $('style')
                .append('.skill-desc > .description { position: absolute; z-index: 10; margin-top: -153px; margin-left: -7px; width: 100%; background-color: #070d15; border: 1px solid #101924; padding: 10px; border-radius: 3px }');
            $('.skills:eq(3) .skill:eq(1)').addClass('description-container skill-desc')
                .append('<div style="display: none;" class="description"><div class="row-fluid" id="baseI"></div></div>');
            $('.skills:eq(3) .skill:eq(2)').addClass('description-container skill-desc')
                .append('<div style="display: none;" class="description"><div class="row-fluid" id="baseB"></div></div>');
            $('.skills:eq(3) .skill:eq(3)').addClass('description-container skill-desc')
                .append('<div style="display: none;" class="description"><div class="row-fluid" id="baseF"></div></div>');
            $('.skills:eq(3) .skill').slice(1, 4).hover(function() {
                $(this).find(".description").toggle();
            });
        }

        // Displays the number of medals and total Credits earned (in the user profile).
        function calcCredits() {
            var rewards = {
                hard_worker: 5,
                expert: 5,
                political_activist: 5,
                congress_member: 10,
                country_leader: 20,
                prosperous_journalist: 2,
                media_mogul: 5,
                society_builder: 20,
                weekly_runner: 100,
                hunter: 5,
                wing_commander: 2,
                battle_hero: 5,
                deft_shooter: 3,
                ace: 10,
                rebellion_hero: 10,
                juggernaut: 20,
                patriot: 5,
                faithfull_ally: 5,
                super_soldier: 5
            },
                medal_count = 0,
                earned_credits = 0,
                medal_name,
                medal_counter;
            $('.medals-list li').each(function() {
                medal_name = $(this).find('img').attr('src').split('/').pop().split('.')[0];
                medal_counter = Number($(this).find('.medal-quantity').text().trim());
                if (medal_name in rewards) {
                    earned_credits += rewards[medal_name] * medal_counter;
                    medal_count += medal_counter;
                }
            });
            $('.achievements').last().append(' (' + medal_count + ': ' + earned_credits + ' Cr)');
        }

        // Code executed while viewing a user profile.
        if (/^\/profile\/[0-9]+\/$/.test(currentPage)) {
            addBaseDamageTooltips();
            getBaseDamageStats();
            calcCredits();
        }

        // add percentages for all squadrons in the damage statistics
        function addStatsRefresh() {
//            damageStatsUpdateLock = true;
            var squadronPoints,
                refreshButton = '<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" id="refresh-statistics">' + getString('refreshStatistics') + '</div>';

            if ($('#refresh-statistics').length === 0) {
                $('style').append('#refresh-statistics { cursor: pointer }');
                $('.battle-damage-statistics .header .attacker').attr('class',$('.battle-damage-statistics .header .attacker').attr('class').replace(/5/g, '4'));
                $('.battle-damage-statistics .header .defender').attr('class',$('.battle-damage-statistics .header .defender').attr('class').replace(/5/g, '4'));
                $('.battle-damage-statistics .header .close-statistics').before(refreshButton);
            }

            $('#refresh-statistics').on('click', function() {
                $('.damage-statistics').click();
            });
//            damageStatsUpdateLock = false;
        }

        // Reset the medals data (on the battlefield).
        function clearTopMedals() {
            var medals = ['.defender-ds', '.attacker-ds', '.defender-bh', '.attacker-bh', '.defender-ace', '.attacker-ace'],
                medal;
            for (let i = 0; i < 7; i++) {
                medal = medals[i];
                $(medal + ' a').removeAttr('href');
                $(medal + ' a img').removeAttr('src');
                $(medal + ' div.username').text('');
                $(medal + ' span.damage').text('');
                $(medal + ' span.shoots').text('');
            }
        }

        // Build and place the squadron switcher next to the stats Close button (on the battlefield).
        function addSquadronSwitcher() {
            if (!$('#sqadronSwitcher').length) {
                var squads = [],
                    sclass;
                $('.medals-statistics-cnt .close-statistics').attr('class',$('.medals-statistics-cnt .close-statistics').attr('class').replace(/4/g, '1'));
                for (let i = 1; i < 4; i++) {
                    sclass = 'squadSwitch' + ($('.medals-statistics').data('squadron') == i ? ' btn-primary' : '');
                    squads.push("<a role='button' class='btn " + sclass + "'>" + srtLetters[i - 1] + "</a>");
                }
                $('.medals-statistics-cnt .close-statistics').before("<div class='col-lg-3 col-md-3 col-sm-3 col-xs-3' id='sqadronSwitcher'>" + squads.join('') + "</div>");

                // Event handler for clicking the squadron switcher buttons (on the battlefield).
                $('.squadSwitch').on("click", function() {
                    var squad = srtLetters.indexOf($(this).text());
                    clearTopMedals();
                    $('.squadSwitch').removeClass('btn-primary');
                    $('.squadSwitch:eq(' + squad + ')').addClass('btn-primary');
                    $('.medals-statistics').data('squadron', squad + 1).click();
                });
            }
        }

        // Retrieves the battle time
        function getBattleTime() {
            return Number($('script:contains("battleTimer")').text().split('\n')[2].replace(/\D/g,''));
        }

        // returns the battle ID from the battlefield
        function getBattleId() {
            return Number(currentPage.split("/")[3]);
        }

        // returns true|false if a battle exists, based on the ID
        function changeButton(id, which) {
            if (id !== Number(id)) {
                return false;
            }
            $.ajax({
                method: "HEAD",
                url: "/military/battle/" + id + "/",
                complete: function(xhr) {
                    var prevBtn = "<a id='srtprevbat' role='button' class='btn btn-primary'>&lt;&lt;&lt;</a>",
                        nextBtn = "<a id='srtnextbat' role='button' class='btn btn-primary'>&gt;&gt;&gt;</a>",
                        battleExists = false;
                    battleExists = (xhr.status === 200);
                    switch (which) {
                        case 'prev': {
                            $('#srtprevholder').append(prevBtn);
                            if (battleExists) {
                                $('#srtprevbat').attr('href', '/military/battle/' + id + '/');
                            } else {
                                $('#srtprevbat').attr('class', 'btn btn-secondary').text('---');
                            }
                        }
                            break;
                        case 'next': {
                            $('#srtnextholder').append(nextBtn);
                            if (battleExists) {
                                $('#srtnextbat').attr('href', '/military/battle/' + id + '/');
                            } else {
                                $('#srtnextbat').attr('class', 'btn btn-secondary').text('---');
                            }
                        }
                    }
                }
            });
        }

        // Code executed while viewing the battlefield
        if (/^\/military\/battle\//.test(currentPage)) {
            $('.battle-statistics').css('margin-top', '-35px');
            var battleId,
                srtPrevHolder = "<div class='col-xs-1' id='srtprevholder'></div>",
                srtNextHolder = "<div class='col-xs-1 col-xs-offset-10' id='srtnextholder'></div>",
                damageStatsUpdateLock = false;

            $('.medals-statistics-cnt').bind('DOMSubtreeModified', function(e) {
                if (e.target.innerHTML.length > 1) {
                    addSquadronSwitcher();
                }
            });

            $('.damage-statistics-cnt').bind('DOMSubtreeModified', function(e) {
                if (damageStatsUpdateLock === false && e.target.innerHTML.length > 1) {
                    addStatsRefresh();
                }
            });

            $(".main-container .content").append("<div class='row'>" + srtPrevHolder + srtNextHolder + "</div>");
            battleId = getBattleId();
            changeButton(battleId - 1, 'prev');
            changeButton(battleId + 1, 'next');

            // Set the width of the statistics overlay to the same width as the battlefield.
            $('.battle-statistics').css('width', '100%');
        }

        // Code executed while viewing the Society page of a country.
        // Counts the number of sectors owned by a country and adds it to the section header.
        if (/^\/country\/society\//.test(currentPage)) {
            var sectors = $('.country-content ul:last li').length;
            $('.country-content ul:last > div').append(' (' + sectors + ')');
        }

        // Code executed while viewing the Congress candidature proposal page.
        if (/^\/politics\/congress-proposal\/$/.test(currentPage)) {
            $('#id_sector').addClass('srtselect');
            getCandidatesBySector();
        }

        // Returns the country ID of the displayed country on the Congress candidature proposal page.
        function getCountryFromCongressProposal() {
            return $('.country-header div:eq(1) a').attr('href').split('/')[3];
        }

        // Calculates the number of candidates per sector and adds them in the sector selector.
        function getCandidatesBySector() {
            $.get('/politics/congress-candidates/' + getCountryFromCongressProposal() + '/', function(data) {
                if ($(data).find('.bordered-list li').length > 0) {
                    var sectors = {},
                        sector;
                    $(data).find('.bordered-list li').each(function() {
                        sector = $(this).find('.sector').text().trim();
                        if (sector in sectors) {
                            sectors[sector] += 1;
                        } else {
                            sectors[sector] = 1;
                        }
                    });
                    $('#sector option').each(function() {
                        if (this.value !== '') {
                            let current = this.innerHTML;
                            this.innerHTML += " (" + (sectors[current] > 4 ? '!!! ' : '') + (current in sectors ? sectors[current] : 0) + "/5)";
                        }
                    });
                }
            });
        }

        // Code executed while viewing the storage.
        if (/^\/storage\/$/.test(currentPage)) {
            var minParts = Math.min(
                itemsCount('ion_ammo'),
                itemsCount('ion_stock'),
                itemsCount('ion_chip')
            );
            setCannonPartBalance(minParts);
            setWeaponBalance(minParts);
            addStarshipPartsRequirements();
        }

        // Returns the number of items by image name (in the storage).
        function itemsCount(img) {
            return Number($('.storage-list:eq(0) li img[src="/media/images/products/' + img + '.png"]').parent().next().text().trim()) || 0;
        }

        // Add the positive/negative sign to non-zero balances (for storage items).
        function setBalance(num) {
            return (num === 0 ? '' : (num > 0 ? '-' : '+')) + Math.abs(num).toString();
        }

        // Add the balance to each weapon type (in the storage).
        function setWeaponBalance(cannons) {
            var weaponMultiplier = {'q1': 10, 'q2': 8, 'q3': 6, 'q4': 4, 'q5': 2},
                quality,
                balance;
            for (let i = 1; i < 6; i++) {
                quality = 'q' + i.toString();
                balance = setBalance(cannons * weaponMultiplier[quality] - itemsCount('weapon_' + quality));
                $('.item-creation-list li img[src="/media/images/products/weapon_' + quality + '.png"]').attr('alt', quality).parent().next().text(balance);
            }
        }

        // Add the balance to each cannon part (in the storage).
        function setCannonPartBalance(count) {
            var cannonParts = {1: 'ammo', 2: 'stock', 3: 'chip'},
                balance;
            $('.item-creation-list:last .item-to-create .quantity').text(count).prev().find('img').attr('alt', 'cannons');
            for (let i = 1; i < 4; i++) {
                balance = setBalance(count - itemsCount('ion_' + cannonParts[i]));
                $('.item-creation-list:last img[src="/media/images/products/ion_' + cannonParts[i] + '.png"]').attr('alt', cannonParts[i]).parent().next().text(balance);
            }
        }

        // Adds the Starship parts requirements in the user storage.
        function addStarshipPartsRequirements() {
            var req = [1500, 2000, 2500, 2750, 5000],
                reqText = getString('starshipPartsPointsStr');
            $('.item-details').css('z-index', '1');
            $('.storage-list:eq(1) li').each(function(i, v) {
                $(v).find('.item-name').append('<div class="details">' + reqText + ': ' + req[i] + '</div>');
            });
        }

        // Code executed while viewing the congress candidates page.
        if (/^\/politics\/congress-candidates\//.test(currentPage)) {
            buildCongressCandidatesArticle();
        }

        // Build the congress candidates list in BB-code format.
        function getCongressCandidatesList() {
            if ($('.bordered-list li').length > 0) {
                var congressCandidatesList = {},
                    cit;
                $('.bordered-list li').each(function() {
                    cit = {};
                    cit.cname = $(this).find('.name').text().trim();
                    cit.curl = $(this).find('.name a').attr('href').trim();
                    cit.sector = '[b]' + $(this).find('.sector').text().trim() + '[/b]';
                    cit.pname = $(this).find('.party').text().trim();
                    cit.purl = $(this).find('.party a').attr('href').trim();

                    if (!(cit.sector in congressCandidatesList)) {
                        congressCandidatesList[cit.sector] = {};
                    }

                    cit.bbcit = '[url=https://www.starrepublik.com' + cit.curl + ']' + cit.cname + '[/url]';
                    cit.bbprt = '[url=https://www.starrepublik.com' + cit.purl + ']' + cit.pname + '[/url]';
                    congressCandidatesList[cit.sector][cit.bbcit] = cit.bbprt;
                });
                return congressCandidatesList;
            }
        }

        // Build the congress candidates text area and populate it with data.
        function buildCongressCandidatesArticle() {
            var congressCandidatesArticle = '',
                list = getCongressCandidatesList();
            if (list) {
                $.each(list, function(index, value) {
                    congressCandidatesArticle += "\n" + index + "\n";
                    $.each(value, function(idx, val) {
                        congressCandidatesArticle += idx + ' - ' + val + "\n";
                    });
                });
                congressCandidatesArticle = "[center]" + congressCandidatesArticle.trim() + "[/center]";
                $('.party-content > .section-header.politics').append(' [<span id="toggleArticle" style="cursor: pointer">+</span>]');
                $('.bordered-list').before("<div id='congressCandidatesArticle' class='col-md-12' style='display: none'><p><textarea class='form-control' style='resize: vertical'>" + congressCandidatesArticle + "</textarea></p></div>");
            }
        }

        // Event handler for clicking the congress candidates list button.
        $('#toggleArticle').click(function () {
            if ($('#congressCandidatesArticle').css('display') === 'none') {
                $('#congressCandidatesArticle').slideDown(srtEffectDelay);
                $('#toggleArticle').html('&mdash;');
            } else {
                $('#congressCandidatesArticle').slideUp(srtEffectDelay);
                $('#toggleArticle').html('+');
            }
        });

        // Get the comment count for a given article id.
        function getComments() {
            $('.articles-list li').each(function() {
                var article = $(this).find('.publication-date'),
                    link = $(this).find('.title a').attr('href'),
                    commimg = '<img src="/media/images/main/comments.png">',
                    comments;
                $.get(link, function(data) {
                    comments = '&bull; ' + commimg + '  ' + $(data).find('.commentator').length;
                    $(article).append('<span class="artcomments">' + comments + '</span>');
                });
            });
        }

        // Add the comment count for the articles on the main page and the newspaper page.
        if ($('.newspaper-content').length) {
            $('style')
                .append('.artcomments { margin-left: 5px }')
                .append('.artcomments img { height: 10px; margin-top: -2px }');
            getComments();
        }

        // Code executed while viewing an article - adds endorsement count and Credits amount, plus comment count.
        if (/\/newspaper\/article\/[0-9]+/.test(currentPage)) {
            $('style').append('.thumbnail { background-color: #20314f; display: table; border: 0 }');
            $('.article .text').html($('.article .text').html().replace(/\[e\](.*?)\[\/e\]/gi, '<div class="thumbnail text-center">$1</div>'));
            if ($('.endorsers').length) {
                var blue = $('.endorsers .blue').length,
                    green = $('.endorsers .green').length,
                    red = $('.endorsers .red').length,
                    total = blue + green + red,
                    credits = blue * 1 + green * 0.5 + red * 0.25;
                $('.endorsers').prev().append(' (' + total + ': ' + credits + ' Cr)');
            }
            if ($('.commentator').length) {
                $('.comments-list div.social').append(' (' + $('.commentator').length + ')');
            }
        }

        // Code executed while creating or editing an article.
        if (/^\/newspaper\/(write|edit)-article\//.test(currentPage)) {
            myBbcodeSettings.markupSet.push({ closeWith:'[/e]', key: 'E', name:getString('encloseInFrame'), openWith:'[e]'});
            $('#id_text').markItUpRemove();
            $('#id_text').markItUp(myBbcodeSettings);
            var srtbbselect = $('.markItUpHeader ul li').last().attr('class').split(/\s/)[1];
            $('style').append('.bbcode .' + srtbbselect + ' a { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAElBMVEUAAAAAAAAAAAAAAAAAAAAAAADgKxmiAAAABXRSTlMAEKCm3Dwyid4AAAAlSURBVHgBY2DFCWggxcyIFTADpZgYsAKmESI1KsXChBWw4EtRANDOA/lDmlQ4AAAAAElFTkSuQmCC); background-size: cover }');
        }

        // Code executed while viewing the rankings section
        if (/\/rankings\/*/.test(currentPage)) {
            $(".rankings-selector > a").each(function (i, e) { e.title = e.querySelector("div").textContent.trim(); });
        }

        // Code executed while viewing the weekly damage stats page
        if (/\/rankings\/citizen-damage\/[0-9]+\/[1-3]\//.test(currentPage)) {
            var damage_list = $('.rankings-list li div.value').text().split(/[\s]+/),
                damage_totals = damage_list.slice(2, damage_list.length - 1).reduce(function(a, b) { return a + parseInt(b); }, 0);
            $('.rankings-list').before('<div class="col-lg-11 col-md-11 col-sm-11 col-xs-11 text-right">' + getString('total') + ": " + damage_totals.toLocaleString() + '</li>');
        }

        // Code executed while viewing the alliance pages
        if (/\/country\/alliance\/[0-9]+\//.test(currentPage)) {
            var countries = $('.protection-agreement-list li').length;
            $('.section-header.social:eq(1)').append(' (' + countries + ')');
        }

        // returns the ID of yur Military Unit
        function getMuId() {
            return currentPage.split('/').reverse()[1];
        }

        // builds the CSV Data for download
        function buildCsvData() {
            var output = "",
                file = document.createElement('a');

            $.each(muMemberList, function(i, v) {
                if (typeof(v) !== "undefined") {
                    var arr = [];
                    arr.push('https://www.starrepublik.com/profile/' + String(i) + '/');
                    arr.push('"' + v + '"');
                    csvData.push(arr);
                }
            });

            $.each(csvData, function(index, member) {
                output += member.join("\t") + "\n";
            });

            file.href = 'data:text/csv;charset=utf-8,' + encodeURI(output);
            file.target = '_blank';
            file.download = 'mu' + getMuId() + '.csv';
            file.click();
        }

        // builds the list of the Military Unit members
        function buildList(page) {
            var index = 1;
            if (page === Number(page) && page !== index) {
                index = page;
            }
            $.get('/military/members/' + getMuId() + '/' + index + '/', function(data) {
                var muMembersPages = {
                    current: 1,
                    total: 1
                };

                $(data).find('.mu-content ul.bordered-list li').each(function(i, v) {
                    var muMemberProfileId,
                        muMemberName;
                    if (i > 0) {
                        muMemberProfileId = $(v).find('.member a').attr('href').split('/').reverse()[1];
                        muMemberName = $(v).find('.member').text().trim();
                        muMemberList[muMemberProfileId] = muMemberName;
                    }
                });

                muMembersPages.current = Number($(data).find('.pagination .current').text().trim());
                muMembersPages.total = Number($(data).find('.pagination a').last().prev().text().trim());

                if (muMembersPages.current < muMembersPages.total) {
                    buildList(muMembersPages.current + 1);
                } else {
                    buildCsvData();
                }
            });
        }

        // add the download link on the MU page
        if (/\/military\/unit\/[0-9]+\//.test(currentPage)) {
            $('.profile-header div:eq(1)').append(getString('download') + ': <a id="muMembersCsv" role="button">' + getString('csvMembersList') + '</a>');

            $('#muMembersCsv').on('click', function() {
                buildList();
            });
        }

        // Code executed on the Galaxy map page.
        if (/^\/galaxy-map\/$/.test(currentPage)) {
            $('style').append('.srtmapdef { border: 1px solid #1e81b1 !important; box-shadow: 0 0 5px #1e81b1 }');
            $('#owner-selector').addClass('srtmapdef');
            $('.selectors-row img').each(function(i, e) {
                let title = e.id.split(/-/)[0];
                title = title[0].toUpperCase() + title.slice(1);
                e.title = title;
            });
            $('.selectors-row img').click(function() {
                $('.selectors-row img').removeClass('srtmapdef');
                $(this).addClass('srtmapdef');
            });
        }
    });
} else {
    if (["png", "jpg", "jpeg", "gif", "css", "js"].indexOf(currentPage.split(".").pop().toLowerCase()) === -1) {
        console.log("jQuery is not loaded, so the StarRepublik Tools were not loaded. If jQuery is supposed to be loaded, the game might have a (temporary) JavaScript/jQuery error, or other scripts/extensions are interfering with the game's own scripts.");
    }
}