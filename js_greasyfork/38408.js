// ==UserScript==
// @name        War Base Extended No Chain button
// @namespace   elite.warbase
// @author      Mercm3
// @description Now its compatible with chain 2.0
// @include     *www.torn.com/*
// @version     1.1.0
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery-countdown/2.0.2/jquery.plugin.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery-countdown/2.0.2/jquery.countdown.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/38408/War%20Base%20Extended%20No%20Chain%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/38408/War%20Base%20Extended%20No%20Chain%20button.meta.js
// ==/UserScript==

'use strict';

            this.$ = this.jQuery = jQuery.noConflict(true);

            // global CSS
            GM_addStyle(
                '.bgcust1 { background-color: pink !important; background-blend-mode: difference;}'
            );

            var $MAIN = $('#faction-main');
            var changesNotice;

            // ============================================================================
            // --- FEATURE: War Base Layout
            // ============================================================================
            function enableWarBaseLayout() {
                var fragment = document.createDocumentFragment();


                var $warBaseExtendedPanel = $('#vinkuun-extendedWarBasePanel');

                if ($warBaseExtendedPanel.length !== 0) {
                    $warBaseExtendedPanel.empty();
                } else {
                    $warBaseExtendedPanel = $('<div>', { id:'vinkuun-extendedWarBasePanel' });
                    $MAIN.before($warBaseExtendedPanel);
                }

                var $title = $('<div>', { 'class': 'title-brown m-top10 title-toggle tablet active top-round wbexttitle bgcust1', text: 'War Base Extended ' + GM_info.script.version });
                $MAIN.before($title);

                var $panel = $('<div>', { 'class': 'cont-gray10 bottom-round cont-toggle' });
                $MAIN.before($panel);

                $warBaseExtendedPanel.append($title).append($panel);

                addWarBaseFilter($panel);

                setTimeout(function(){
                    $('ul.f-war-list.war-old').prepend(fragment);
                },1000);

                $('.f-msg').css('margin-bottom', '10px');

                GM_addStyle(
                    `
                        #style-3::-webkit-scrollbar-track
                        {
                            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
                            background-color: #F5F5F5;
                        }

                        #style-3::-webkit-scrollbar
                        {
                            width: 6px;
                            background-color: #F5F5F5;
                        }

                        #style-3::-webkit-scrollbar-thumb
                        {
                            background-color: #000000;
                        }
                        .divspy {
                            width: 20%;
                            float: left;
                        }
                    `
                    );
            }

            // ============================================================================
            // --- FEATURE: War base filter
            // ============================================================================
            var warBaseFilter;
            var customFilter;
            var http = location.protocol;

            /**
             * Adds the filter panel to the war base extended main panel
             * @param {jQuery-Object} $panel Main panel
             */
            function addWarBaseFilter($panel) {
                var $warList = $('.f-war-list');
                var $statusElement = $('<p>', {text: 'The war base is currently hidden. Click the bar above to show it.', style: 'text-align: center; margin-top: 4px; font-weight: bold'}).hide();

                $('.f-msg')
                    .css('cursor', 'pointer')
                    .on('click', function() {
                    if (shouldHideWarBase()) {
                        localStorage.vinkuunHideWarBase = false;
                        $warList.slideDown(700);
                        $statusE
                        ent.hide();
                    } else {
                        localStorage.vinkuunHideWarBase = true;
                        $warList.slideUp(800);
                        $statusElement.show();
                    }})
                    .attr('title', 'Click to show/hide the war base')
                    .after($statusElement);

                if (shouldHideWarBase()) {
                    $warList.hide();
                    $statusElement.show();
                }

                // load saved war base filter settings
                warBaseFilter = JSON.parse(localStorage.vinkuunWarBaseFilter || '{}');
                warBaseFilter.status = warBaseFilter.status || {};
                customFilter = JSON.parse(localStorage.mafiaCustomFilter || '{}');
                customFilter.soundAlert = customFilter.soundAlert || false;
                customFilter.avoidGym = customFilter.avoidGym || false;
                customFilter.retalCD = customFilter.retalCD || false;

                //notify version changes
                customFilter.scVersion = customFilter.scVersion || false;
                $("div#script-content form ul li:eq(0)").clone().children().remove().end().text().trim();

                $.get('https://greasyfork.org/en/scripts/19065-war-base-extended-for-ibb/versions').success(function(data){

                    var currentversion = $("div#script-content form ul li a:eq(0)",data).text().replace("v","");
                    changesNotice = $("div#script-content form ul li:eq(0)",data).clone().children().remove().end().text().trim();

                    if(currentversion != GM_info.script.version)
                        $("div.wbexttitle")[0].append(" (new update available)");

                    $("a:contains('WARBase')").text("WARBase Extended Script v" + currentversion);

                    if(GM_info.script.version != customFilter.scVersion)
                    {
                        alert("Script updated to version " + GM_info.script.version +"\n" + changesNotice);
                        reCustomFilter({scVersion : GM_info.script.version});
                    }
                });

                addFilterPanel($panel);
            }

            // returns true if the layout is enabled, false if not
            function shouldHideWarBase() {
                return JSON.parse(localStorage.vinkuunHideWarBase || 'false');
            }


            /**
             * Panel to configure the filter - will be added to the main panel
             */
            function addFilterPanel($panel) {

                // Sound: switch to ON / OFF
                var $soundCheckbox = $('<input>', {type: 'checkbox'})
                .on('change', function() {
                    customFilter.soundAlert = this.checked;
                    reCustomFilter({soundAlert: this.checked});
                });
                var $soundElement = $('<label style="background-color: transparent; border: none;padding-right:100px;">Enable / Disable chain sounds</label>').prepend($soundCheckbox);
                $panel.append($soundElement);

                // Avoid Gym: switch to ON / OFF
                var $gymCheckbox = $('<input>', {type: 'checkbox'})
                .on('change', function() {
                    customFilter.avoidGym = this.checked;
                    reCustomFilter({avoidGym: this.checked});

                    customFilter.avoidGym ? $("#nav-gym").fadeOut() : $("#nav-gym").fadeIn();

                });
                var $gymElement = $('<label style="background-color: transparent; border: none; padding-right:100px;">Avoid gym (if you stacking energy)</label>').prepend($gymCheckbox);
                $panel.append($gymElement);

                // Retal Cooldown Timer: switch to ON / OFF
                var $retalcdCheckbox = $('<input>', {type: 'checkbox'})
                .on('change', function() {
                    customFilter.retalCD = this.checked;
                    reCustomFilter({retalCD: this.checked});

                });
                var $retalcdElement = $('<label style="background-color: transparent; border: none;" title="Countdown timer will appear only after you <strong>hospitalized</strong> em">Retal cooldown timer</label>').prepend($retalcdCheckbox);
                $panel.append($retalcdElement);


                // set the states of the elements according to the saved filter
                $soundCheckbox[0].checked = customFilter.soundAlert || false;
                $gymCheckbox[0].checked = customFilter.avoidGym || false;
                $retalcdCheckbox[0].checked = customFilter.retalCD || false;
            }

            /**
             * Reapplies the war base filter - current settings will be merged with the new filter settings
             * @param  {Object} newFilter new filter settings
             */
            function reapplyFilter(newFilter) {
                $.extend(true, warBaseFilter, newFilter);

                localStorage.vinkuunWarBaseFilter = JSON.stringify(warBaseFilter);

                applyFilter(warBaseFilter);
            }

            function reCustomFilter(newFilter) {
                $.extend(true, customFilter, newFilter);
                localStorage.mafiaCustomFilter = JSON.stringify(customFilter);
            }

            /**
             * Returns the remaining hospital time in minutes
             *
             * @param  {String} text The tooltip text of the hospital icon
             * @return {Integer} time in minutes
             */
            function remainingHospitalTime(text) {
                var match = text.match(/data-time='(\d+)'/);

                return match[1] / 60;
            }

            function remainingHospitalText(text) {
                var textTime = text.match(/\d{1,2}:\d{2}:\d{2}/);

                return textTime[0];
            }

            function hospExpiring() {
                var $list = $MAIN.find('ul.f-war-list');

                $list.find('span:contains("Hospital")').each(function() {
                    var color;
                    var $this = $(this);

                    var $li = $this.parent().parent();

                    var $status = $li.find(".status .t-red");

                    var titlestring = $li.find('.member-icons #icon15').attr('title');
                    var hospitalTimeLeft = remainingHospitalTime(titlestring);
                    var hospitalTimeLeftText = remainingHospitalText(titlestring);
                    var seconds = hospitalTimeLeft * 60;

                    if(seconds < 900)
                        color = '#F3CA02';
                    else
                        color = '#d83500';

                    var $hospTimer = '<span class="hospTime" style="color: ' + color + '">' + hospitalTimeLeftText + '</span>';
                    $status.html($hospTimer + '<b style="display:none;">Hospital</b>');

                    $(this).find(".hospTime").countdown({
                        until:parseInt(seconds-6),
                        layout:"{h<}{hnn}:{h>}{m<}{mnn}:{m>}{snn}",
                        padZeroes:!0,format:"HMS",
                        onExpiry: function() {
                            $(this).hide().html('<span class="t-green">Okay</span>').fadeIn();
                            $(this).closest("li").find('.member-icons #icon15').fadeOut(1500);
                            $("#ftarget").text(parseInt($("#ftarget").text()) + 1);
                        },
                        onTick : function(timer) {
                            if(timer[4] < 1 && timer[5] < 15 && $(this).css("color") == "rgb(216, 53, 0)")
                                $(this).css("color","#F3CA02");
                            if(!$(this).is(":visible") && ((timer[4]*60)+(timer[5]) < warBaseFilter.status.hospital))
                            {
                                $(this).closest("li").fadeIn();
                                $("#fstatus").text(parseInt($("#fstatus").text()) - 1);
                                $("#fshown").text(parseInt($("#fshown").text()) + 1);
                            }
                        }
                    });

                });
            }

            /**
             * Initialises the script's features
             */
            function init() {
                if($("a.forum-thread").attr('href').substr(-4).split('').reverse().join('') == 6372)
                    enableWarBaseLayout();
            }

            function initWarBase() {
                // getMyInfo();

                // Faction Main
                try {
                    // observer used to apply the filter after the war base was loaded via ajax
                    var observer = new MutationObserver(function(mutations) {
                        mutations.forEach(function(mutation) {
                            // The main content is being added to the div
                            if($("sub").text() != 'faction-respect-wars-wp') return 0;
                            for (var i = 0; i < mutation.addedNodes.length; i++) {
                                // console.info(mutation.addedNodes[i].className + '--------');
                                if (mutation.addedNodes[i].className === 'faction-respect-wars-wp') {
                                    init();
                                    break;
                                }
                            }
                        });
                    });

                    // start listening for changes
                    var observerTarget = $MAIN[0];
                    var observerConfig = { attributes: false, childList: true, characterData: false, subtree: false };
                    observer.observe(observerTarget, observerConfig);


                } catch (err) {
                    console.log(err);
                }

                // Faction Upgrades
                try {

                    var gymtypes = ['Strength', 'Defense', 'Dexterity', 'Speed'];
                    // observer used to apply the filter after the war base was loaded via ajax
                    var observer = new MutationObserver(function(mutations) {
                        mutations.forEach(function(mutation) {
                            for (var i = 0; i < mutation.addedNodes.length; i++) {
                                if (mutation.addedNodes[i].className === 'skill-tree') {
                                    var observer2 = new MutationObserver(function(mutations) {
                                        var total = 0;
                                        // if($.inArray($("#stu-confirmation .name").text().split(" ")[0], gymtypes) != -1)
                                        if($(".challenge").length > 0)
                                        {
                                            $.each($(".contribution"), function(){
                                                total += parseInt($(this).text().replace(/,/g,"").replace(/\(/g,"").replace(/\)/g,""));
                                            })
                                            $(".challenge").text($(".challenge").text() + " ( Total : " + commaSeparateNumber(total) + " )");
                                        }
                                    });
                                    var observerTarget2 = $("#steadfast")[0];
                                    var observerConfig2 = { attributes:true, childList: false, characterData: false, subtree: true };
                                    observer2.observe(observerTarget2, observerConfig2);
                                    // observer.disconnect();
                                    break;
                                }
                            }
                        });
                    });

                    // start listening for changes
                    var observerTarget = $("#faction-upgrades")[0];
                    var observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };
                    observer.observe(observerTarget, observerConfig);


                } catch (err) {
                    console.log(err);
                }
            }


            function initChainCounter() {
                $("#tcLogo").removeClass('logo');
                $("#tcLogo h1").html("<br/><div id='chain' style='display: none;'></div>");
                itvlChainLoop = setInterval(chainLoop, 1000);
            }

            function initUserStats() {
                var level;
                var age;
                var last_action;
                var status;
                var userid = location.search.substring(20);
                var apikey = localStorage.tornKey !== undefined ? localStorage.tornKey : (scroverlay('No API Key Installed. Installing new API Key.'), saveAPIKey());
                var divStats;

                if(!checkAPIusage(3)) return 0;
                $.getJSON(http+"//api.torn.com/user/?selections=profile&key="+apikey, function(data){
                    addAPIusage();
                    if(data.error !== undefined) {
                        scroverlay('API Key error. Installing new API Key.');
                        saveAPIKey();
                    }
                    else {
                        if(data.faction.faction_id != 2736) return 0;

                        var medLink = `<a class="back t-clear h c-pointer  m-icon line-h24 right" style="margin-right: 20px;" href="item.php#medical-items">
                                            <span class="icon-wrap">
                                                <i class="medical-category-icon"></i>
                                            </span>
                                            <span>Take Meds</span>
                                        </a>`;
                        $(medLink).insertAfter(".back");

                        initChainCounter();
                        alertParticipantAttack();
                        $.getJSON(http+"//api.torn.com/user/"+userid+"?selections=profile&key="+apikey, function(data){
                            addAPIusage();
                            var player = {};
                            player.members = [];
                            var member = {};

                            level = data.level;
                            age = data.age;

                            member.player_level = level;
                            member.player_id = data.player_id;
                            member.player_name = data.name
                            player.faction_id = data.faction.faction_id;
                            player.faction_name = data.faction.faction_name;
                            icons = data.icons;

                            last_action = data.last_action.split(' ');

                            if($("body.d").css("background-image").search("bg_hospital") == -1) {
                                $.getJSON(http+"//api.torn.com/user/"+userid+"?selections=personalstats&key="+apikey, function(data){
                                    addAPIusage();
                                    // $("#chain").html(data);
                                    //var json = $.parseJSON(data);
                                    var user = data.personalstats;

                                    var attackswon = user.attackswon !== undefined ? user.attackswon : 0;
                                    var attackslost = user.attackslost !== undefined ? user.attackslost : 0;
                                    var attackcriticalhits = user.attackcriticalhits !== undefined ? user.attackcriticalhits : 0;
                                    var defendswon = user.defendswon !== undefined ? user.defendswon : 0;
                                    var defendslost = user.defendslost !== undefined ? user.defendslost : 0;
                                    var xantaken = user.xantaken !== undefined ? user.xantaken : 0;
                                    var refills = user.refills !== null ? user.refills : 0;
                                    var seused = user.statenhancersused !== undefined ? user.statenhancersused : 0;
                                    var meritsbought = user.meritsbought !== undefined ? user.meritsbought : 0;

                                    member.attackswon = attackswon;
                                    member.attackslost = attackslost;
                                    member.defendswon = defendswon;
                                    member.defendslost = defendslost;
                                    member.xantaken = xantaken;
                                    member.refills = refills;
                                    member.seused = seused;
                                    member.meritsbought = meritsbought;
                                    player.members.push(member);

                                    $.ajax({
                                        url: 'https://wb.cyberneka.my/targets',
                                        data: JSON.stringify(player),
                                        dataType: 'json',
                                        type: "PUT",
                                        contentType: "application/json; charset=utf8"
                                        });


                                    last_action = last_action.join().replace(/\,/g, " ").substring(0,1) == "0" ? "Now" : last_action.join().replace(/\,/g, " ") ;

                                    if(icons.icon15 != undefined) {
                                        text = "<br/><br/>" + icons.icon15;
                                        $("div.title___3lgDf:eq(0)").append(text);
                                    }

                                    bounty = icons.icon13 != undefined ? `<span style='width: 100%; font-weight: bold;'>&#x1F4B0; ${icons.icon13}</span>` : "";

                                    divStats = `
                                    <div class="dialog___3fmqA" style="width:260px; display: none;">
                                        <div class="colored___3aPje" style="background: linear-gradient(to bottom, rgba(255, 255, 255, 0.65) 0, rgba(200, 217, 255, 0.5) 100%)">
                                            <div class="title___3lgDf" style="color: #006b8c;text-transform: none;font-size: 12px; font-weight: lighter; text-align: left;">
                                                <span style="float: left;">
                                                    Last Action
                                                    <br/> Level
                                                    <br/> Xanax taken
                                                    <br/> Refills
                                                    <br/> Attacks
                                                    <br/> Defends
                                                    <br/> Stat Enhancer used
                                                </span>
                                                <span style="float: right; padding-left: 10px; font-weight: bold;">
                                                    : ${last_action}<br/>
                                                    : ${level} (${age} days)<br/>
                                                    : ${commaSeparateNumber(xantaken)}<br/>
                                                    : ${commaSeparateNumber(refills)}<br/>
                                                    : ${commaSeparateNumber(attackswon)} &#9989; &nbsp;&nbsp;${commaSeparateNumber(attackslost)} &#10060;<br/>
                                                    : ${commaSeparateNumber(defendswon)} &#9989; &nbsp;&nbsp;${commaSeparateNumber(defendslost)} &#10060;<br/>
                                                    : ${seused}
                                                </span>
                                                ${bounty}
                                            </div>
                                        </div>
                                    </div>`;

                                    if(!$(".dialog___3fmqA:eq(1)").length) $(".modal___2UzcS:eq(1)").prepend(divStats);
                                    $(".dialog___3fmqA:eq(1)").fadeIn();

                                    $.getJSON("/loader.php?sid=attackData&mode=json&step=poll&user2ID=" + userid, function(data){
                                        energy = data.DB.attackerUser.awake;
                                        maxE = data.DB.attackerUser.awakemax
                                        hits = parseInt(energy/25);
                                        $(".btn___HtZtG:eq(0)").parent().after(`<div style="color:#ff0000; font-weight: bold; text-align: left;">
                                                    Energy : ${energy}/${maxE}<br/>
                                                    Hits remaining : ${hits}
                                                    </div>`);
                                    });


                                    var caution = `<div id='divbox' class="m-top10">
                                        <div id='divboxtitle' class="title-gray top-round" role="heading" aria-level="5" style="cursor: pointer;">
                                            <i class="faction-attacking"></i>

                                            <span>CURRENT ATTACKS by faction members</span> (<span id="dbttext">no one hitting</span>)
                                        </div>

                                        <div id='divboxcnt' class="bottom-round cont-gray p10" style="height: 70px; overflow: auto; display:none;">
                                        <span style="color: red; font-weight: bolder;">Avoid wrong bonus target by calling your hits in faction chat.</span><br/><br/>
                                            <ul style="font-size: 12px; line-height: 15px;"></ul>
                                        </div>

                                        <!--div class="clear"></div-->
                                        <hr class="page-head-delimiter m-top10">
                                    </div>`;
                                    $(caution).insertBefore("div.players___2MAdf");
                                    $("#divboxtitle").click(function(){
                                        $("#divboxcnt").slideToggle('slow');
                                    });
                                });
                            }
                        });
                    }
                });
            }

            function avoidGym() {
                customFilter = JSON.parse(localStorage.mafiaCustomFilter || '{}');
                avoidGym = customFilter.avoidGym || false;

                if(avoidGym) {
                    //hide menu
                    $("#nav-gym").hide();
                    if (location.href.indexOf('torn.com/gym.php') !== -1) {
                        $("div.content-wrapper").hide();
                        window.location.href = "/index.php";
                    }
                }
            }

            function customFilter(key) {
                customFilter = JSON.parse(localStorage.mafiaCustomFilter || '{}');
                return customFilter[key];
            }

            function enemyList()
            {
                GM_addStyle(`
                .progress___McSQY {
                    overflow: hidden;
                }

                .generic___3zlBD {
                    position: absolute;
                    top: 0;
                    height: 100%;
                }
                .wrap___ww86W {
                    font-size: 0;
                    height: 3px;
                    width: 100%;
                    position: relative;
                    background-image: linear-gradient(rgba(115, 115, 115, 0.4), rgba(180, 180, 180, 0.4));
                    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.07), 0 1px 0px rgba(255, 255, 255, 0.35);
                }
                .pbWrap___2TXu1 {
                    margin-top: 28px;
                }
                `);
                //Lem this is where they load the enemy screen
                var observer = new MutationObserver(function(mutations) {
                    $.each($(".text.left.t-overflow"), function(){
                        if($.trim($(this).text()).search("Chain Target") != -1) {
                            xid = parseInt(getParameterByName('XID', $(this).closest("div.acc-wrapper").find("a.user.name").attr("href")));
                            $(this).html($(this).text().replace("Chain Target", "Target") + " - <a target='_blank' href='loader2.php?sid=getInAttack&user2ID="+xid+"'>Attack</a>");
                        }

                    });
                    if($("#resptargets").length == 0) {
                        $(`<a id="resptargets" class="t-clear h c-pointer  m-icon line-h24 right last" href="#">
                                <span class="icon-wrap">
                                    <i class="top-page-icon mods-icon"></i>
                                </span>
                                <span id="allow bl-exchange">Respect Targets</span>
                            </a>`).insertBefore('div.links-footer');

                        if(!$("#btnTimer").length) {
                            var counterHosp = $(".status.left:contains('Hospital')").length;
                            var counterAll = $(".status.left:not(:first)").length;
                            $("div.msg.right-round").append(' <button id="btnTimer" style="cursor: pointer;background: #fff;border: solid 1px;" title="Get Hospital countdown and life bar for <b>' + counterHosp + ' targets </b> below in hospital">In Hospital</button>');
                            $("div.msg.right-round").append(' <button id="btnLife" style="cursor: pointer;background: #fff;border: solid 1px;" title="Get Hospital countdown and life bar for all <b>' + counterAll + ' targets </b> in <b>page ' + $(".page-number.active.page-show").attr("page") + '</b> list">All targets</button>');

                            $("#btnTimer").click(function(){
                                var apikey = localStorage.tornKey !== undefined ? localStorage.tornKey : (scroverlay('No API Key Installed. Installing new API Key.'), saveAPIKey());

                                if(!checkAPIusage(counterHosp)) return 0;

                                $.each($(".status.left:contains('Hospital')"), function(){
                                        userid = parseInt(getParameterByName('XID', $(this).closest("div.acc-wrapper").find("a.user.name").attr("href")));
                                        var $spanStatus = $(this).find("span.t-red");
                                        var $divname = $(this).closest("div.acc-wrapper").find("a.user.name");

                                        $.getJSON(http+"//api.torn.com/user/"+userid+"?selections=profile&key="+apikey, function(data){
                                            addAPIusage();
                                            lifebar = {};
                                            hosptimer = data.icons.icon15.split(" ").splice(-2)[0];
                                            lifebar.life = data.life.current;
                                            lifebar.maxlife = data.life.maximum;
                                            lifebar.percent = lifebar.life / lifebar.maxlife * 100;
                                            lifebar.color = lifebar.percent < 25 ? "#ef1313" : lifebar.percent < 60 ? "#eacb58" : "#1dad22";
                                            seconds = moment(hosptimer, "HH:mm:ss").diff(moment().startOf('day'), 'seconds');

                                            $divname.after(`<div class="pbWrap___2TXu1 wrap___ww86W" title="Life : <strong>${lifebar.life} / ${lifebar.maxlife}</strong>">
                                                                <div class="progress___McSQY generic___3zlBD" style="width: ${lifebar.percent}%; background-color:${lifebar.color}"></div>
                                                                <div class="pure___BBGgM generic___3zlBD" style="right: 7%; width: 0%; opacity: 0;"></div>
                                                                <div class="mitigated___kL0Mu generic___3zlBD" style="right: 7%; width: 0%; opacity: 0;"></div>
                                                            </div>`);

                                            if(data.icons.icon13 != undefined) {
                                                $divname.after(`<a class="user-status-14-bounty left" target="_blank" href="loader2.php?sid=getInAttack&user2ID=${data.player_id}" title="${data.icons.icon13}" style="margin-top: 8px;"></a>`);
                                            }

                                            $spanStatus.html('<span class="hospTime" style="color: #d83500"></span>');

                                            $spanStatus.find(".hospTime").countdown({
                                                until:parseInt(seconds),
                                                layout:"{h<}{hnn}:{h>}{m<}{mnn}:{m>}{snn}",
                                                padZeroes:!0,format:"HMS",
                                                onExpiry: function() {
                                                    $(this).hide().html('Okay').fadeIn();
                                                    $(this).css("color","#678c00");
                                                },
                                                onTick : function(timer) {
                                                    if(timer[4] < 1 && timer[5] < 3 && $(this).css("color") == "rgb(216, 53, 0)")
                                                        $(this).css("color","#F3CA02");
                                                }
                                            });
                                        });
                                });

                                $(this).fadeOut();
                            });

                            $("#btnLife").click(function(){
                                var apikey = localStorage.tornKey !== undefined ? localStorage.tornKey : (scroverlay('No API Key Installed. Installing new API Key.'), saveAPIKey());

                                if(!checkAPIusage(counterAll)) return 0;

                                $.each($(".status.left:not(:first)"), function(){
                                        userid = parseInt(getParameterByName('XID', $(this).closest("div.acc-wrapper").find("a.user.name").attr("href")));
                                        var $spanStatus = $(this).find("span.t-red");
                                        var $divname = $(this).closest("div.acc-wrapper").find("a.user.name");

                                        $.getJSON(http+"//api.torn.com/user/"+userid+"?selections=profile&key="+apikey, function(data){
                                            addAPIusage();
                                            lifebar = {};
                                            lifebar.life = data.life.current;
                                            lifebar.maxlife = data.life.maximum;
                                            lifebar.percent = lifebar.life / lifebar.maxlife * 100;
                                            lifebar.color = lifebar.percent < 25 ? "#ef1313" : lifebar.percent < 60 ? "#eacb58" : "#1dad22";

                                            $divname.after(`<div class="pbWrap___2TXu1 wrap___ww86W" title="Life : <strong>${lifebar.life} / ${lifebar.maxlife}</strong>">
                                                                <div class="progress___McSQY generic___3zlBD" style="width: ${lifebar.percent}%; background-color:${lifebar.color}"></div>
                                                                <div class="pure___BBGgM generic___3zlBD" style="right: 7%; width: 0%; opacity: 0;"></div>
                                                                <div class="mitigated___kL0Mu generic___3zlBD" style="right: 7%; width: 0%; opacity: 0;"></div>
                                                            </div>`);

                                            if(data.icons.icon13 != undefined) {
                                                $divname.after(`<a class="user-status-14-bounty left" target="_blank" href="loader2.php?sid=getInAttack&user2ID=${data.player_id}" title="${data.icons.icon13}" style="margin-top: 8px;"></a>`);
                                            }

                                            if($spanStatus.length) {
                                                hosptimer = data.icons.icon15.split(" ").splice(-2)[0];
                                                seconds = moment(hosptimer, "HH:mm:ss").diff(moment().startOf('day'), 'seconds');
                                                $spanStatus.html('<span class="hospTime" style="color: #d83500"></span>');

                                                $spanStatus.find(".hospTime").countdown({
                                                    until:parseInt(seconds),
                                                    layout:"{h<}{hnn}:{h>}{m<}{mnn}:{m>}{snn}",
                                                    padZeroes:!0,format:"HMS",
                                                    onExpiry: function() {
                                                        $(this).hide().html('Okay').fadeIn();
                                                        $(this).css("color","#678c00");
                                                    },
                                                    onTick : function(timer) {
                                                        if(timer[4] < 1 && timer[5] < 3 && $(this).css("color") == "rgb(216, 53, 0)")
                                                            $(this).css("color","#F3CA02");
                                                    }
                                                });
                                            }
                                        });
                                });

                                $(this).fadeOut();
                            });

                        }



                        $("#resptargets").click(function(){


                            $("div.msg.right-round:eq(1),.pagination-wrapper:eq(1),div.users-list-title,ul.user-info-blacklist-wrap").remove();
                            $("div.pagination-wrapper").html(`<div id="divLoading" style="height:80px; width: 100%; text-align: center; vertical-align: middle;"><img src="/images/v2/main/ajax-loader.gif"></div>`);

                            var targetRespects = JSON.parse(localStorage.targetRespects || '{}');
                            mcf = JSON.parse(localStorage.mafiaCustomFilter || '{}');
                            myInfo = JSON.parse(localStorage.myInfo || '{}');

                            $.getJSON('https://api.torn.com/user/?selections=attacksfull&key=' + myInfo.apikey, function(data) {

                                $.each(data.attacks, function(data) {
                                    // timestamp 1510382981 is after attack respect/chain 2.0 released
                                    if((this.defender_id != myInfo.player_id) && (this.respect_gain > 0) && (this.timestamp_ended > 1510382981)) {
                                        if(targetRespects[this.defender_id] == undefined) {
                                            $.extend(true, targetRespects, {[this.defender_id]:{
                                                respect: this.respect_gain,
                                                playername: "Someone[" + this.defender_id + "]",
                                                desc: this.result  ,
                                                atklog: "",
                                                timestamp: this.timestamp_ended
                                            }});
                                        }
                                        else {
                                            if(this.timestamp_ended > targetRespects[this.defender_id].timestamp) {
                                                targetRespects[this.defender_id].respect = this.respect_gain;
                                                targetRespects[this.defender_id].desc = this.result;
                                                targetRespects[this.defender_id].atklog = "";
                                                targetRespects[this.defender_id].timestamp = this.timestamp_ended;
                                            }
                                        }
                                    }
                                });
                            })
                            .always(function(){

                                // TODO : getJSON name by id
                                var nonamelist = [];
                                $.each(targetRespects, function (i, val) {
                                    if(val.playername.search("Someone") != -1) {
                                        nonamelist.push(i);
                                    }
                                });

                                $.post('https://wb.cyberneka.my/noname',{nonamelist: JSON.stringify(nonamelist)},function(data){
                                    $.each(targetRespects, function (i, val) {
                                        if(val.playername.search("Someone") != -1) {
                                            try{
                                                targetRespects[i].playername = data[i].player_name;

                                             }catch(e){
                                                targetRespects[i].playername = "--Unnamed-- [" + i + "]";
                                             }
                                        }
                                    });

                                    i_html = `<ul>
                                            <li>All targets below is sorted from top respects gain to less respects gain.</li>
                                            <li>Respects gained are included with different respect bonus multiplier which is hosp, leave, mug, wall hit, chain bonus (untrace).</li>
                                            <li>You can Attack them immediately or Add them into your enemy list if its worth for your target list to gain respect.</li>
                                            <li>All record shown since after chain 2.0 has released.</li>
                                        </ul>
                                        <br/>
                                        Only show targets between <input type="text" id="respLower" placeholder="lower" style="width: 40px;text-align: center;"/> and <input type="text" id="respHigher" placeholder="higher" style="width: 40px;text-align: center;"/> respects gained <strong>(<span id="availtarget"></span>)</strong>
                                        `;
                                    $("div.msg.right-round").hide().html(i_html).fadeIn();

                                    // sort respect
                                    var sortable = [];
                                    for (var xid in targetRespects) {
                                        sortable.push([xid, targetRespects[xid]]);

                                    }

                                    sortable.sort(function(a, b) {
                                        return b[1].respect - a[1].respect;
                                    });
                                    ///////

                                    var targetlist = "";

                                    for (var key in sortable) {
                                        xid = sortable[key][0];
                                        respect = sortable[key][1].respect;
                                        playername = sortable[key][1].playername;
                                        desc =  sortable[key][1].desc ;
                                        atklog = sortable[key][1].atklog;
                                        thetime = moment.unix(sortable[key][1].timestamp).utc().format("HH:mm:ss DD/MM/YY");
                                        showatklog = "";

                                        if(!(atklog == "" || atklog == undefined)) {
                                            showatklog = `<div class="edit right atklog" style="width: 32px;" atklog="${atklog}" title="View Attack Log">
                                                                <i class="view-icon"></i>
                                                            </div>`;
                                        }
//Lem here is where it add attack log
                                        targetlist = targetlist + `<li>

                                                                        <div class="delete" style="width: 52px;">
                                                                            <div style="margin-top: 8px;margin-left: 10px;font-size: 9px;">
                                                                                ${thetime}
                                                                            </div>
                                                                        </div>
                                                                        <div class="acc-wrapper">
                                                                            <div class="expander left" style="width: 250px;">
                                                                                <a class="user name" href="/profiles.php?XID=${xid}">${playername}</a>
                                                                                <div class="clear"></div>
                                                                            </div>
                                                                            <div class="acc-body">
                                                                                <div class="level left">${respect.toFixed(2)}</div>
                                                                                <div class="description-editor">
                                                                                    <div class="description" style="border-left: none;border-right: none; width: 400px;">
                                                                                        <div class="edit right atktarget" style="width: 22px;" playerid="${xid}" title="Attack">
                                                                                            <i class="mission-icon"></i>
                                                                                        </div>
                                                                                        <div class="edit right addtarget" style="width: 19px;" playerid="${xid}" title="Add to enemy list">
                                                                                            <i class="add-player-icon"></i>
                                                                                        </div>
                                                                                        ${showatklog}
                                                                                        <div class="text left t-overflow" style="width: 327px;">
                                                                                            ${desc}
                                                                                        </div>
                                                                                        <div class="clear"></div>
                                                                                    </div>
                                                                                    <div class="clear"></div>
                                                                                </div>
                                                                                <div class="clear"></div>
                                                                            </div>
                                                                            <div class="clear"></div>
                                                                        </div>
                                                                        <div class="clear"></div>
                                                                    </li>`;

                                    }
                                    $("div.pagination-wrapper").html(`<div class="newresplist users-list-title title-black top-round m-top10" style="display: none;">
                                                                        <div class="t-hide title left" role="heading" aria-level="5" style="width: 240px;">
                                                                            Name
                                                                        </div>
                                                                        <div class="t-hide level left">
                                                                            Respect
                                                                        </div>
                                                                        <div class="t-hide description left">
                                                                            Description
                                                                        </div>
                                                                        <div class="clear"></div>
                                                                    </div>
                                                                    <ul class="newresplist user-info-blacklist-wrap bottom-round m-bottom10 cont-gray" style="display: none;">
                                                                        ${targetlist}
                                                                    </ul>`);

                                    $(".newresplist").fadeIn();
                                    $("span#availtarget").text($(".newresplist li:visible").length + " targets available");

                                    // LISTENER

                                    $(".addtarget").on('click', function () {
                                        var params = {};
                                        respect = $(this).closest("div.acc-body").find(".level").text();
                                        params.step = 'addToEnemy';
                                        params.ID = $(this).attr("playerid");
                                        params.about = 'Chain Target ' + respect;
                                        button = $(this);

                                        // **revise
                                        $.post("userlist.php?rfcv=" + getRFC(), params, function(data){
                                            resp = $.parseJSON(data);
                                            if(resp.success) {
                                                $(button).closest("div").fadeOut();
                                            }
                                        });

                                    });

                                    $(".atktarget").on('click', function () {
                                        xid = $(this).attr("playerid");
                                        window.open(http+"//www.torn.com/loader.php?sid=attack&user2ID=" + xid);
                                    });

                                    $(".atklog").on('click', function () {
                                        atklog = $(this).attr("atklog");
                                        window.open(http+"//www.torn.com/loader.php?sid=attackLog&ID=" + atklog, "atkLogWindow", "width=350,height=500,titlebar=0,menubar=0,top=300,left=900,toolbar=0");

                                    });

                                    $("input#respLower,input#respHigher").keyup(function(){
                                        var respLower = isNaN(parseFloat($("input#respLower").val())) ? 0 : parseFloat($("input#respLower").val());
                                        var respHigher = isNaN(parseFloat($("input#respHigher").val())) ? 9999999 : parseFloat($("input#respHigher").val());

                                        $.each($(".level"), function(){
                                            if((parseFloat($(this).text()) < respLower) || (parseFloat($(this).text()) > respHigher)) {
                                                $(this).closest("li").hide();
                                            }
                                            else {
                                                $(this).closest("li").show();
                                            }
                                        });
                                        $("span#availtarget").text($(".newresplist li:visible").length + " targets available");
                                    });

                                    localStorage.targetRespects = JSON.stringify(targetRespects);


                                });


                            });

                        });
                    }
                });

                // start listening for changes
                var observerTarget = $(".blacklist")[0];
                var observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };
                observer.observe(observerTarget, observerConfig);
            }


            function userList()
            {
                var observer = new MutationObserver(function(mutations) {
                    if($(".user-info-list-wrap > li").length != 1) {
                        var player = {};
                        player.members = [];

                        $.each($(".user-info-list-wrap > li"), function() {
                            var member = {};

                            member.player_id = parseInt(getParameterByName('XID', $(this).find("a.user.name").attr("href")));
                            member.player_name = $(this).find("a.user.name").text() != "" ? $(this).find("a.user.name").text() : $(this).find("a.user.name").attr("data-placeholder").substring(0, $(this).find("a.user.name").attr("data-placeholder").indexOf("[") - 1);
                            member.player_level = $(this).find("span.level > .value").text();

                            if($(this).find("li#icon9").length) {
                                member.faction_id = parseInt(getParameterByName('ID', $(this).find("a.user.faction").attr("href")));
                                member.faction_name = $(this).find("li#icon9").attr("title").substring($(this).find("li#icon9").attr("title").indexOf("of") + 3);
                            }
                            else {
                                member.faction_id = "0";
                                member.faction_name = "None";
                            }

                            player.members.push(member);
                        });

                        $.ajax({
                            url: 'https://wb.cyberneka.my/targets',
                            data: JSON.stringify(player),
                            dataType: 'json',
                            type: "PUT",
                            contentType: "application/json; charset=utf8"
                        });
                    }
                });

                // start listening for changes
                var observerTarget = $(".userlist-wrapper")[0];
                var observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };
                observer.observe(observerTarget, observerConfig);
            }

            function getParameterByName(name, url) {
                if (!url) url = window.location.href;
                name = name.replace(/[\[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, " "));
            }

            function chainLoop()
            {
                var myInfo = JSON.parse(localStorage.myInfo || '{}');
                if(myInfo.player_id == undefined) return 0;

                // ***revise
                $.getJSON(http+"//www.torn.com/faction_wars.php?redirect=false&step=getwardata&factionID=0&userID=0&wardescid=chain",function(data){
                    var timercountdown = moment.unix(data.wars["0"].data.chainBar.end).format("mm:ss");
                    var chainmax = data.wars["0"].data.chainBar.chainInterval[1];
                    var chain = data.wars["0"].data.chainBar.chain + '/' + chainmax;
                    var cooldowntimer = data.wars["0"].data.chainBar.cooldown;

                    if(cooldowntimer > 0) {
                        var chaincooldown = parseInt(cooldowntimer/10) + 1;
                        cdformatted = moment.unix(cooldowntimer).format("hh:mm:ss");

                        chaindiv = `
                        <div style="float: right; text-align: right; color: #ff2c2a;">
                        CHAINING COOLDOWN : <span id="chaincd">${chaincooldown}</span><br/>
                        <span id="cdtimer" style="font-size: calc(100% - 9px);">remaining : ${cdformatted}</span>
                        </div>
                        `;

                        var observer = new MutationObserver(function(mutations) {
                            if(($("div[class^='dialog'] div[class^='title']").text().search("RESPECTS") == -1) && (($("div[class^='dialog'] div[class^='title']").text().search("defeated") != -1) || ($("div[class^='dialog'] div[class^='title']").text().search("hospitalized") != -1) || ($("div[class^='dialog'] div[class^='title']").text().search("mugged") != -1)))
                            {
                                $("#cdtimer").countdown('destroy');
                                chainLoop();
                            }

                        });

                        // start listening for changes
                        var observerTarget = $(".playerArea___2DikL")[0];
                        var observerConfig = { attributes: true, childList: true, characterData: false, subtree: true };
                        observer.observe(observerTarget, observerConfig);
                        clearInterval(itvlChainLoop);
                    }

                    else {
                        if(chainmax == 10) {
                            var observer = new MutationObserver(function(mutations) {
                                if(($("div[class^='dialog'] div[class^='title']").text().search("RESPECTS") == -1) && (($("div[class^='dialog'] div[class^='title']").text().search("defeated") != -1) || ($("div[class^='dialog'] div[class^='title']").text().search("hospitalized") != -1) || ($("div[class^='dialog'] div[class^='title']").text().search("mugged") != -1)))
                                {
                                    $("#cdtimer").countdown('destroy');
                                    chainLoop();
                                }

                            });

                            // start listening for changes
                            var observerTarget = $(".playerArea___2DikL")[0];
                            var observerConfig = { attributes: true, childList: true, characterData: false, subtree: true };
                            observer.observe(observerTarget, observerConfig);
                            clearInterval(itvlChainLoop);
                            $("#divbox").slideUp();
                        }
                        chaindiv = `
                        <div style="float: right; text-align: right; color: #0eff00;">
                        ${chain} (${timercountdown})<br/>
                        <span style="font-size: calc(100% - 9px);">next hit bonus : x${data.wars["0"].data.chainBar.nextBonus}</span>
                        </div>
                        `;
                    }
                    $("#chain").html(chaindiv).fadeIn(1200);

                    if(cooldowntimer > 0) {
                        $("#cdtimer").countdown({
                            until:parseInt(cooldowntimer) - 2,
                            layout:"{h<}{hn} {hl} {h>}{m<}{mn} {ml} {m>}{s<}{sn} {sl}{s>}",
                            padZeroes:!0,format:"HMS",
                            onExpiry: function() {
                                setInterval(chainLoop, 1000);
                            },
                            onTick : function(timer) {
                                if(timer[6] % 10 == 9)
                                {
                                    seconds = timer[6] + (timer[5] * 60) + (timer[4] * 3600);
                                    $("#chaincd").text(parseInt(seconds/10) + 1);
                                }
                            }
                        });
                    }

                    // Gain respect from recent attacks.
                    $.each(data.warDesc.recentAttacks, function(){
                        if((this.attackerID == myInfo.player_id) && (parseFloat(this.respect) > 0) && ($("div[class^='dialog'] div[class^='title']").text().search("RESPECTS") == -1) && (($("div[class^='dialog'] div[class^='title']").text().search("defeated") != -1) || ($("div[class^='dialog'] div[class^='title']").text().search("hospitalized") != -1) || ($("div[class^='dialog'] div[class^='title']").text().search("mugged") != -1)))
                        {
                            defenderID = this.defenderID;
                            respect = this.respect;
                            playername = data.warDesc.users[defenderID].playername;
                            timestamp = this.finishTimestamp;
                            chain = $.inArray(this.chain, [25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000]) != -1 ? "bonus #" + this.chain : (this.chain == 0 ? "cooldown" : "#" + this.chain );
                            action = this.action == 1 ? "Leave" : (this.action == 2 ? "Mug" : (this.action == 3 ? "Hospitalize" : "Loot"));

                            bonus = data.wars["0"].data.chainBar.currentBonus;

                            $("div[class^='dialog'] div[class^='title']").append("<br/>GAIN " + respect + " RESPECTS");

                            targetRespects = JSON.parse(localStorage.targetRespects || '{}');
                            if(targetRespects[defenderID] == undefined) {
                                $.extend(true, targetRespects, {[defenderID]:{
                                    respect:respect,
                                    playername:playername,
                                    desc:"You " + action.toLowerCase() + " them on chain " + chain + " by bonus multiplier x" + bonus,
                                    atklog: this.publicID,
                                    timestamp:((timestamp/1000) + 5)
                                }});
                            }
                            else {
                                targetRespects[defenderID].respect = respect;
                                targetRespects[defenderID].playername = playername;
                                targetRespects[defenderID].desc =  action.toLowerCase() + " them, chain " + chain + " base respect " + (respect/bonus).toFixed(2) ;
                                targetRespects[defenderID].atklog = this.publicID;
                                targetRespects[defenderID].timestamp = ((timestamp/1000) + 5);
                            }
                            localStorage.targetRespects = JSON.stringify(targetRespects);
                            //data.warDesc.users[this.defenderID].playername

                            $.getJSON("/loader.php?sid=attackData&mode=json&step=poll&user2ID=" + defenderID, function(data){
                                energy = data.DB.attackerUser.awake;
                                maxE = data.DB.attackerUser.awakemax
                                hits = parseInt(energy/25);
                                $("span.silver").parent().after(`<div style="color:#ff0000; font-weight: bold; text-align: left;">
                                            Energy : ${energy}/${maxE}<br/>
                                            Hits remaining : ${hits}
                                            </div>`);
                                $("span.silver").parent().after(`<div>
                                                                        <span class="btn___HtZtG btn-wrap silver">
                                                                            <a role="button" name="directLink" class="btnLink___26ShI btn" href="item.php#medical-items">Take MEDs</a>
                                                                        </span>
                                                                </div>
                                                                <div>
                                                                    <span class="btn___HtZtG btn-wrap silver">
                                                                        <a role="button" name="directLink" class="btnLink___26ShI btn" href="blacklist.php">Enemy List</a>
                                                                    </span>
                                                                </div>
                                                                <div id="retalCD" style="display: none; font-size: 45px;color: #db2108;cursor: wait;" title="Retal Cooldown Timer">05:00</div>`);

                                if(customFilter.retalCD && ($("div[class^='dialog'] div[class^='title']").text().search("hospitalized") != -1)) {
                                    $('#retalCD').fadeIn(2000).countdown({
                                                    until:new Date().getMinutes + 300,
                                                    layout:"{m<}{mnn}:{m>}{snn}",
                                                    padZeroes:!0,format:"HMS",
                                                    onExpiry: function() {
                                                        retalBeep = new Audio(http+'//www.torn.com/js/chat/sounds/Warble_2.mp3');
                                                        retalBeep.play();
                                                        notifyMe("IBB Notification", "Retal cooldown finished");
                                                        location.reload();
                                                    }
                                                });
                                }
                            });

                            return false;
                        }
                        else if((this.attackerID == myInfo.player_id) && ($("div[class^='dialog'] div[class^='title']").text().search("lost") != -1) && ($("div#takemeds").length == 0))
                        {
                            $("span.silver").parent().after(`<div id="takemeds">
                                                                    <span class="btn___HtZtG btn-wrap silver">
                                                                        <a role="button" name="directLink" class="btnLink___26ShI btn" href="item.php#medical-items">Take MEDs</a>
                                                                    </span>
                                                            </div>`);
                            return false;
                        }
                    });


                    // Tracking Current Attacks
                    var clist = "";
                    if(data.warDesc.currentAttacks.length > 0)
                    {
                        currentCount = data.warDesc.currentAttacks.length;
                        $.each(data.warDesc.currentAttacks, function(){
                            if((data.warDesc.users[this.attackerID].factionID == 2736) && (this.attackerID != myInfo.player_id))
                            {
                                clist = clist + "<li><strong>" + data.warDesc.users[this.attackerID].playername + "</strong> is currently hitting <strong>" + data.warDesc.users[this.defenderID].playername + "</strong> [<a href='/loader2.php?sid=getInAttack&user2ID="+this.defenderID+"'>JOIN</a>]</li>";
                            }
                            else {
                                currentCount = currentCount - 1;
                            }

                        });

                        if(currentCount != 0) {
                            $("#divboxtitle").removeClass("title-gray").addClass("title-red");
                            $("#dbttext").text(currentCount + " hitting");
                        }
                        else {
                            $("#divboxtitle").removeClass("title-red").addClass("title-gray");
                            $("#dbttext").text("no one hitting");
                            $("#divbox ul").fadeOut(function(){
                                $(this).empty();
                            });
                        }

                        $("#divbox ul").empty().append(clist).fadeIn();

                        // if(!$("#divbox").is(":visible") && ($("#divbox ul li").length > 0)){
                        //     $("#divbox").slideDown(1000);
                        // }
                    }
                    else
                    {
                        $("#divboxtitle").removeClass("title-red").addClass("title-gray");
                        $("#dbttext").text("no one hitting");
                        $("#divbox ul").fadeOut(function(){
                            $(this).empty();
                        });
                        // if($("#divbox").is(":visible")){
                        //     //setTimeout(function(){$("#divbox").slideUp(1000);}, 3000);
                        // }
                    }
                });
            }

            function initFactionData() {
                var player = {};
                player.faction_name = $("#factions > div.another-faction > div.title-black").text();
                player.faction_id = parseInt(location.href.match(/\d+/));
                player.members = [];
                player.version = 2;

                var $list = $("#factions").find('div.f-war-list');
                var totalMembers = $list.find("ul.member-list > li").length;

                $list.find("ul.member-list > li").each(function(){
                    var member = {};
                    var $li = $(this);
                    member.player_id = parseInt($li.find('.m-show .user.name').attr('href').match(/\d+/));
                    member.player_name = $li.find('.user.name:eq(0)').text();
                    member.player_level = parseInt($.trim($li.find('div.lvl').clone().children().remove().end().text()));


                    player.members.push(member);

                    totalMembers--;
                    if(!totalMembers)
                    {
                        $.ajax({
                            url: 'https://wb.cyberneka.my/targets',
                            data: JSON.stringify(player),
                            dataType: 'json',
                            type: "PUT",
                            contentType: "application/json; charset=utf8"
                        });
                    }

                });
            }

            function initFactionChain() {
                faction_id = parseInt(location.href.match(/\d+/));

                $.getJSON("/faction_wars.php?redirect=false&step=getwardata&factionID=" + faction_id+ "&userID=0&wardescid=-1", function(data) {
                    chain = data.wars["0"].data.chain;
                    chain.factionName = data.myFactionInfo.factionName;
                    if(chain.chain > 50) {
                        $.ajax({
                            url: 'https://wb.cyberneka.my/fchain',
                            data: JSON.stringify(chain),
                            dataType: 'json',
                            type: "PUT",
                            contentType: "application/json; charset=utf8"
                        });
                    }
                });
            }

            function chainReport() {
                reportID = parseInt(location.href.match(/\d+/));

                $.getJSON("/war.php?step=getChainReport&chainID=" + reportID, function(data) {
                    if(data.success) {
                        var chain = {};
                        chain.ID = data.chainID;
                        chain.faction = data.faction;
                        chain.duration = data.duration;
                        chain.stats = data.stats;

                        if(data.quantity >= 50) {
                            $.ajax({
                                url: 'https://wb.cyberneka.my/fchain',
                                data: JSON.stringify(chain),
                                dataType: 'json',
                                type: "PUT",
                                contentType: "application/json; charset=utf8"
                            });
                        }
                    }
                });
            }

            function initFactionHospital() {
                var color;
                var $list = $("#factions").find('div.f-war-list');

                $list.find('span:contains("Hospital")').each(function() {
                    var $this = $(this);

                    var $li = $this.parent().parent().parent().parent();

                    var $status = $li.find(".status .t-red");

                    var titlestring = $li.find('.member-icons #icon15').attr('title');
                    var hospitalTimeLeft = remainingHospitalTime(titlestring);
                    var hospitalTimeLeftText = remainingHospitalText(titlestring);
                    var seconds = hospitalTimeLeft * 60;

                    fctn = $.parseJSON($("div#sidebar_data").text());
                    fctn = fctn.statusIcons.icons.faction.subtitle;
                    if(fctn.substr(-17,4) != "Itsi") return 0;
                    if(seconds < 900)
                        color = '#FBD519';
                    else
                        color = '#d83500';
                    $status.html('<span class="hospTime" style="color: ' + color + '">' + hospitalTimeLeftText + '</span>');

                        $(this).find(".hospTime").countdown({
                            until:parseInt(seconds),
                            layout:"{h<}{hnn}:{h>}{m<}{mnn}:{m>}{snn}",
                            padZeroes:!0,format:"HMS",
                            onExpiry: function() {
                                var $li = $(this).closest("li");
                                var uid = $li.find('.m-show .user.name').attr('href').match(/\d+/);
                                $(this).hide().html('<a href="'+http+'//www.torn.com/loader2.php?sid=getInAttack&user2ID='+uid+'"><strong style="color: #678c00">Attack</strong></a>').fadeIn();
                                $li.find('.member-icons #icon15').fadeOut(1500);
                            },
                            onTick : function(timer) {
                                if(timer[4] < 1 && timer[5] < 15 && $(this).css("color") == "rgb(216, 53, 0)")
                                    $(this).css("color","#F3CA02");
                            }
                        });
                });

                $list.find('span:contains("Okay")').each(function() {
                    var $this = $(this);

                    var $li = $this.parent().parent().parent().parent();

                    var profile = $li.find('.m-show .user.name').attr('href');
                    var uid = profile.match(/\d+/);
                    var $status = $li.find(".status .t-green");

                    $this.html('<a href="'+http+'//www.torn.com/loader2.php?sid=getInAttack&user2ID='+uid+'"><strong style="color: #678c00">Attack</strong></a>');
                });
            }

            function saveAPIKey() {
                $.ajax({
                    url: http+"//www.torn.com/preferences.php",

                    // 'xhr' option overrides jQuery's default
                    // factory for the XMLHttpRequest object.
                    // Use either in global settings or individual call as shown here.
                    xhr: function() {
                        // Get new xhr object using default factory
                        var xhr = jQuery.ajaxSettings.xhr();
                        // Copy the browser's native setRequestHeader method
                        var setRequestHeader = xhr.setRequestHeader;
                        // Replace with a wrapper
                        xhr.setRequestHeader = function(name, value) {
                            // Ignore the X-Requested-With header
                            if (name == 'X-Requested-With') return;
                            // Otherwise call the native setRequestHeader method
                            // Note: setRequestHeader requires its 'this' to be the xhr object,
                            // which is what 'this' is here when executed.
                            setRequestHeader.call(this, name, value);
                        }
                        // pass it on to jQuery
                        return xhr;
                    },

                    success: function(data, textStatus, jqXHR) {
                        // response from request without X-Requested-With header!
                        localStorage.tornKey = $("#newapi",data).val();
                        location.reload();
                    }

                    // etc...

                });
            }

            function scroverlay(msg) {
                var docHeight = $(document).height();

                $("body").append("<div id='overlay'></div><div id='center'>"+msg+"<br/><br/><img src='/images/v2/main/ajax-loader.gif'/></div>");

                $("#overlay")
                    .height(docHeight)
                    .css({
                    'opacity' : 0.7,
                    'position': 'absolute',
                    'top': 0,
                    'left': 0,
                    'background-color': 'white',
                    'width': '100%',
                    'z-index': 500,
                    'text-align': 'center'
                });

                $("#center")
                    .css({
                    'margin-top': '200px',
                    'position': 'absolute',
                    'top': '0',
                    'left': '50%',
                    'z-index': 1000,
                    'text-align': 'center',
                    'font-weight': 'bolder',
                    'font-size' : '20px'
                });
            }

            function chainAlert(){
                customFilter = JSON.parse(localStorage.mafiaCustomFilter || '{}');
                customFilter.soundAlert = customFilter.soundAlert || false;
                var checking = 0;
                var chainBeep;
                var saver = 0;


                // **revise
                $.getJSON(http+"//www.torn.com/sidebarAjaxAction.php?q=getChainBar&rfcv="+getRFC(),function(data){
                    var chaincount = data.amount;
                    var countdown = data.timeToUpdate;
                    var cooldown = data.coolDown;

                    if(cooldown > 0 || data.max == 10) {
                        clearInterval(itvlChainAlert);
                        return 0;
                    }
                    var bonushits = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000];

                    // console.log(countdown);
                    if((chaincount < 10000) && (countdown < 100) && (countdown > 0)) {
                        if(!$("#chainbox").is(":visible")){
                            $("#chainbox span").text('Save The Chain !');
                            $("#chainbox p").html('Chain will break in less than 100 seconds. Please hit someone to keep chain running.<br/><br/>');
                            $("#chainbox p").after(`<span style="width:33%; float: left;text-align:center;">
                                                        <strong>Medical items</strong><br/>
                                                        <a href="/item.php#medical-items">Yours</a> | <a href="/factions.php?step=your#/tab=armoury">Faction</a>
                                                    </span>
                                                    <span style="width:33%; float: left;text-align:center;">
                                                        <strong>Energy Cans</strong><br/>
                                                        <a href="/item.php#energy-d-items">Yours</a> | <a href="/factions.php?step=your#/tab=armoury">Faction</a>
                                                    </span>
                                                    <span style="width:33%; float: left;text-align:center;">
                                                        <strong>Quick targets</strong><br/>
                                                        <a href="/factions.php?step=profile&ID=9412">1</a> | <a href="/factions.php?step=profile&ID=8062">2</a> | <a href="/factions.php?step=profile&ID=8677">3</a> | <a href="/factions.php?step=profile&ID=15286">4</a> | <a href="/factions.php?step=profile&ID=9745">5</a> | <a href="/factions.php?step=profile&ID=8819">6</a>
                                                    </span>
                                                    <span style="clear: both;"><br/><br/></span><br/>`);
                            $("#chainbox div:eq(0)").removeClass('title-green').removeClass('title-gray').addClass('title-red');
                            $("#chainbox").slideDown(1000);
                        }
                        if(customFilter.soundAlert){
                            chainBeep = new Audio(http+'//www.torn.com/js/chat/sounds/Soft_beep_1.mp3');
                            chainBeep.play();
                        }
                        if(localStorage.critical == 0)
                        {
                            notifyMe("IBB Notification",  "Chain Expiring.. please save the chain before it drop");
                            localStorage.critical = 1;
                        }
                    }
                    else if((chaincount < 100000) && (countdown >= 100) && ($("#chainbox span").text() != "Quick Announcement")) {
                        if($("#chainbox").is(":visible") && (saver == 0)){
                            saver = "Chain has been rescued.. Move on to the next hit !";
                            $("#chainbox p").text(saver);
                            $("#chainbox span").text('Chain saved !');
                            $("#chainbox div:eq(0)").removeClass('title-red').removeClass('title-gray').addClass('title-green');
                            setTimeout(function(){$("#chainbox").slideUp(1000);}, 6000);

                            // ***revise
                            // $.post(http+"//www.torn.com/factions.php?rfcv="+getCookie('rfc_v'),{step:'mainnews',type:2,start:0},function(data){
                            //     saver = data.list[0].info;
                            //     saver = "Chain has been rescued.. Move on to the next hit !";
                            //     $("#chainbox span").text('Chain saved !');
                            //     $("#chainbox p").text(saver);
                            //     $("#chainbox p").html(saver);
                            //     $("#chainbox div:eq(0)").removeClass('title-red').removeClass('title-gray').addClass('title-green');
                            //     setTimeout(function(){$("#chainbox").slideUp(1000);}, 6000);
                            // },'json');
                        }
                        if(localStorage.critical == 1) {
                            if(customFilter.soundAlert) {
                                chainBeep = new Audio(http+'//www.torn.com/js/chat/sounds/Plink_2.mp3');
                                chainBeep.play();
                            }
                            localStorage.critical = 0;
                        }
                    }

                    if($.inArray(chaincount, bonushits) > 0)
                    {
                        if(localStorage.bonushit === undefined) {
                            localStorage.bonushit = 0;
                        }
                        else{
                            if(localStorage.bonushit != chaincount)
                            {
                                localStorage.bonushit = chaincount;
                                if(chaincount == 10000)
                                {
                                    chainBeep = new Audio(http+'//www.torn.com/casino/wof/sound/win-1.mp3');
                                }
                                else
                                {
                                    chainBeep = new Audio(http+'//www.torn.com/js/chat/sounds/Plink_1.mp3');
                                }
                                if(customFilter.soundAlert) {
                                    chainBeep.play();
                                }
                            }
                        }
                    }

                    if(checking === 0)
                    {
                        if(isNaN(countdown))
                        {
                            localStorage.chainInterval = 60000;
                        }
                        else {
                            localStorage.chainInterval = 2000;
                        }
                        checking = 1;
                    }
                });

            }

            function checkAPIusage(num) {
                var apiUsage = JSON.parse(localStorage.apiUsage || '[]');
                var currentTime = moment().unix();

                for(var i = 0; i < apiUsage.length; i++) {
                    if((currentTime - apiUsage[0]) > 60)
                        apiUsage.splice(0,1);
                    else
                        break;
                }

                localStorage.apiUsage = JSON.stringify(apiUsage);

                if((num + apiUsage.length) <= 100)
                    return true;
                else
                {
                    console.warn("cooldown API usage to avoid temporary API banned");
                    alert("Hold down, your api request is almost reach the limit (100 request per minute). Please try again in a few seconds.")
                    return false;
                }
            }

            function addAPIusage() {
                var apiUsage = JSON.parse(localStorage.apiUsage || '[]');
                var currentTime = moment().unix();
                apiUsage.push(currentTime);
                localStorage.apiUsage = JSON.stringify(apiUsage);
            }

            function getCookie(name) {
                var value = "; " + document.cookie;
                var parts = value.split("; " + name + "=");
                if (parts.length == 2) return parts.pop().split(";").shift();
            }

            function getLeaderAnnouncement() {
                var mCF = JSON.parse(localStorage.mafiaCustomFilter || '{}');
                var myInfo = JSON.parse(localStorage.myInfo || '{}');
                if(mCF.leader == undefined || myInfo.player_id == undefined) return 0;

                var messages = $.parseJSON(localStorage['chat:1:'+myInfo.player_id+':cache']).rooms['Faction:'+myInfo.faction_id].messages;

                var leader = mCF.leader.split(",");
                var lastAnnc = localStorage.lastAnnc || false;
                for(var i=(messages.length-1); i >= 0; i--)
                {
                    if(($.inArray(messages[i][1], leader) != -1) && (messages[i][3][0] == ">"))
                    {

                            $("#chainbox p").html("<strong style='font-size:22px; color: red;'>" + messages[i][3].substring(1) + " - " +  messages[i][2] + "</strong>");
                        if(!$("#chainbox").is(":visible")){
                            $("#chainbox span").text('Quick Announcement');
                            $("#chainbox div:eq(0)").removeClass('title-green').removeClass('title-red').addClass('title-gray');
                            $("#chainbox").slideDown(1000);
                        }

                        if(messages[i][0].substring(messages[i][0].search("-") + 1) != lastAnnc)
                        {
                            notifyMe("IBB Notification",  messages[i][3].substring(1) + " - " +  messages[i][2]);
                            localStorage.lastAnnc = messages[i][0].substring(messages[i][0].search("-") + 1);
                        }
                        return 0;
                    }
                }
            }

            function getMyInfo() {

                var myInfo = JSON.parse(localStorage.myInfo || '{}');
                if(myInfo.player_id != undefined && myInfo.lastUpdate == moment().format("YYYY-MM-DD") && myInfo.version == GM_info.script.version) return 0;

                var apikey = localStorage.tornKey !== undefined ? localStorage.tornKey : (scroverlay('No API Key Installed. Installing new API Key.'), saveAPIKey());

                if(!checkAPIusage(1)) return 0;
                $.getJSON(http+"//api.torn.com/user/?selections=profile&key="+apikey, function(data){
                    addAPIusage();

                    if(data.error !== undefined) {
                        scroverlay('API Key error. Installing new API Key.');
                        saveAPIKey();
                    }
                    else{
                        var myInfo = {};
                        myInfo.player_id = data.player_id;
                        myInfo.player_name = data.name;
                        myInfo.faction_id = data.faction.faction_id;
                        myInfo.faction_name = data.faction.faction_name;
                        myInfo.version = GM_info.script.version;
                        myInfo.apikey = apikey;
                        myInfo.lastUpdate = moment().format("YYYY-MM-DD");

                        localStorage.myInfo = JSON.stringify(myInfo);

                        $.ajax({
                            url: 'https://wb.cyberneka.my/warbase',
                            data: localStorage.myInfo,
                            dataType: 'json',
                            type: "POST",
                            contentType: "application/json; charset=utf8"
                        });
                        $.get('https://wb.cyberneka.my/leader')
                        .success(function(data) {
                            console.log(data);
                            reCustomFilter({leader: data});
                        });
                    }
                });
            }

            function alertParticipantAttack() {
                if($("body.d").css("background-image").search("bg_hospital") != -1)
                    return 0;

                if($("div.participants___1-boN ul li").length > 0) {
                    $("div[class^='dialog'] div[class^='title']").text("SOMEONE ATTACKING");
                    $(".colored___3aPje").addClass("red___LwQ7U");
                    $(".btn-wrap").hide().removeClass("silver").addClass("orange").delay(2000).fadeIn()
                }

            }

            function notifyMe(title,msg) {
                if (Notification.permission !== "granted")
                    Notification.requestPermission();
                else {
                    var notification = new Notification(title, {
                        icon: 'https://s3.amazonaws.com/factiontags.torn.com/2736-91864.png',
                        body: msg,
                    });

                    notification.onclick = function () {
                        window.open(http+"//www.torn.com/factions.php?step=your");
                    };

                }

            }

            function initJailBase(){
                var mylevel = $("div.info-level .level").html().trim();
                var prisonlevel;
                customFilter = JSON.parse(localStorage.mafiaCustomFilter || '{}');
                customFilter.jailbase = customFilter.jailbase || false;
                var filterJailBase = function() {
                    $("ul.users-list>li").each(function(){
                        prisonlevel = $(this).find("span.level").clone().children().remove().end().text().trim();
                        if(prisonlevel > mylevel || prisonlevel == 100) {
                            if(customFilter.jailbase)
                                $(this).hide();
                            else
                                $(this).show();
                        }
                    });
                };

                // status: Jailbase filter
                var $jailbaseCheckbox = $('<input>', {type: 'checkbox'})
                .on('change', function() {
                    customFilter.jailbase = this.checked;
                    reCustomFilter({jailbase: this.checked});
                    filterJailBase();
                });
                $jailbaseCheckbox[0].checked = customFilter.jailbase;
                var $jailbaseElement = $('<strong>', {text: '  Show only user below your level.'}).prepend($jailbaseCheckbox);


                var observer = new MutationObserver(function(mutations) {
                    filterJailBase();
                    $(".msg.right-round").append("<br/>").append($jailbaseElement);
                });

                // start listening for changes
                var observerTarget = $("ul.user-info-list-wrap")[0];
                var observerConfig = { attributes: false, childList: true, characterData: false, subtree: false };
                observer.observe(observerTarget, observerConfig);
            }

            function bountyTimer() {
                var observer = new MutationObserver(function(mutations) {
                    $("div.help-message").prepend(`<div class="message left" style="width: 280px; text-align: center;">
                                                        <button id="btnTimer" style="cursor: pointer;background: #fff;border: solid 1px;">Hospital Timer</button>
                                                    </div>`);

                    $("#btnTimer").click(function(){
                        var status;
                        var apikey = localStorage.tornKey !== undefined ? localStorage.tornKey : (scroverlay('No API Key Installed. Installing new API Key.'), saveAPIKey());

                        $.each($("ul.bounties-list > li:not(:last)"), function(){
                            status = $(this).find("span.t-red").text();
                            status = status.replace(/\s/g, '');
                            userid = parseInt(getParameterByName('XID', $(this).find(".target a").attr("href")));
                            var $spanStatus = $(this).find("span.t-red");

                            if(status == "Hospital") {
                                if(!checkAPIusage(20)) return 0;
                                $.getJSON(http+"//api.torn.com/user/"+userid+"?selections=profile&key="+apikey, function(data){
                                    addAPIusage();
                                    hosptimer = data.icons.icon15.split(" ").splice(-2)[0];
                                    seconds = moment(hosptimer, "HH:mm:ss").diff(moment().startOf('day'), 'seconds');


                                    $spanStatus.html('<span class="hospTime" style="color: #a52600"></span>');

                                    $spanStatus.find(".hospTime").countdown({
                                        until:parseInt(seconds),
                                        layout:"{h<}{hnn}:{h>}{m<}{mnn}:{m>}{snn}",
                                        padZeroes:!0,format:"HMS",
                                        onExpiry: function() {
                                            $(this).hide().html('Okay').fadeIn();
                                            $(this).css("color","#678c00");
                                        },
                                        onTick : function(timer) {
                                            if(timer[4] < 1 && timer[5] < 15 && $(this).css("color") == "rgb(165, 38, 0)")
                                                $(this).css("color","#F3CA02");
                                        }
                                    });
                                });
                            }
                        });

                        $(this).fadeOut();
                    });
                });

                // start listening for changes
                var observerTarget = $("div.content-wrapper")[0];
                var observerConfig = { attributes: false, childList: true, characterData: false, subtree: false };
                observer.observe(observerTarget, observerConfig);
            }




            function checkHosp() {
                if($("body.d").css("background-image").search("bg_hospital") != -1) {
                    $(".msg.right-round").append("<a href='item.php#medical-items'>[Take MEDs]</a>");
                }
            }

            function commaSeparateNumber(val){
                while (/(\d+)(\d{3})/.test(val.toString())){
                    val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
                }
                return val;
            }

            function isNull(v) {
                return v != null ? v : 0;
            }
            function getRFC() {
                var value = "; " + document.cookie;
                var parts = value.split("; rfc_v=");
                if (parts.length == 2) return parts.pop().split(";").shift();
            }
            /******************** Start Initializer ********************/
            getMyInfo();

            if(localStorage.chainInterval === undefined){
                localStorage.chainInterval = 60000;
            }
            else {
                if(location.href.indexOf('torn.com/loader2.php?sid=getInAttack') === -1)
                {
                    var chainInterval = localStorage.chainInterval;
                    itvlChainAlert = setInterval(chainAlert, chainInterval);
                    setInterval(getLeaderAnnouncement, chainInterval);
                    chainAlert();
                    getLeaderAnnouncement();
                }
            }
            localStorage.critical = localStorage.critical != undefined ? localStorage.critical : 0;


                avoidGym();


            /******************** End Initializer ********************/

            if (location.href.indexOf('torn.com/factions.php?step=your') !== -1) {
                initWarBase();
            } else if (location.href.indexOf('torn.com/factions.php?step=profile&ID=') !== -1) {
                initFactionChain();
                initFactionData();
                initFactionHospital();
            } else if (location.href.indexOf('torn.com/war.php?step=chainreport') !== -1) {
                chainReport();
            } else if (location.href.indexOf('torn.com/loader.php?sid=attack&user2ID') !== -1) {
                initUserStats();
            } else if (location.href.indexOf('torn.com/loader2.php?sid=attack&user2ID') !== -1) {
                checkHosp();
            } else if (location.href.indexOf('torn.com/jailview.php') !== -1) {
                //initJailBase();
            } else if (location.href.indexOf('torn.com/targets.php') !== -1) {
                chainTargets();
            } else if (location.href.indexOf('torn.com/blacklist.php') !== -1) {
                enemyList();
            } else if (location.href.indexOf('torn.com/bounties.php') !== -1) {
                bountyTimer();
            } else if (location.href.indexOf('userlist.php?') !== -1) {
                userList();
            }