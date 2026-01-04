// ==UserScript==
// @name        War Base Extended for IBB
// @namespace   mafia.warbase
// @author      Mafia[610357]
// @description Now its compatible with chain 2.0
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAIAAACRXR/mAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAc1JREFUeNrsmD1rwkAYgM/UUiTVQoRIKdTSXcXVRXDxF/gLkkHQzdkf4KCTg0vASfzYdI+4uDjpIigN2EUNbfArlVSrHSx+pLW1uZfS4W7KcTzJk3vf3HsX0wP6j41CRItoES2iRbSIFtFCCCHz9up+vd4feEqlJrHYtns7HJpZ9thd1Hpda7dHPP95yBgIM1u0z8dw3N1sZolEQEDIIFI07UgkzgMBfBA4tyiatoXD+KDZ2OM1SVKrVYQQw3H6uPj9z9igQa3XbneTp2oud1MuUzS9e9HjCX46iBvEhSjOm01wECC3VtMpOAigZfF697tLWcYHcbXsxaIumdRaDR80mPLWYNB6WBU+4qKqk0wGH4Rct5ay3Of5hSjig5Bai8GAsttBQEgti9t9nU5fxuP4oEEtTZIUQVAE4fN3x0Sj+KBBrc1iPeL5R4dDk6SDrRLLfjNhJ4IAQRxns/pNnNOJCQJovSkKOAigdcYw4CCA1oXLBQ7iatmSyatQSL889nqYIHDx2ZSRl0IBE4Q/kI3y+VWngwkCa81brS+PZb8FIbXGpVLf4wEBd7mlCMJBlWg09ruTSuWHEByZJGOgifwAJ1pEi2gRLaL11+19ACraBcMQcCwBAAAAAElFTkSuQmCC
// @include     *www.torn.com/*
// @version     4.0.12
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery-countdown/2.0.2/jquery.plugin.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery-countdown/2.0.2/jquery.countdown.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/367975/War%20Base%20Extended%20for%20IBB.user.js
// @updateURL https://update.greasyfork.org/scripts/367975/War%20Base%20Extended%20for%20IBB.meta.js
// ==/UserScript==

'use strict';

            this.$ = this.jQuery = jQuery.noConflict(true);

            // global CSS
            GM_addStyle(
                '.bgcust1 { background-color: pink !important; background-blend-mode: difference;}'
            );

            var $MAIN = $('#faction-main');
            var changesNotice;
            var chaincurrent;

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
                        $statusElement.hide();
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
                if(window.btoa($("a.forum-thread").attr('href').substr(-4).split('').reverse().join('')) == "NjM3Mg==")
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
                                        GM_addStyle(`
                                            span.spancr { cursor: pointer; padding: 0px 3px; color: cadetblue; margin: 0px 20px;}
                                            span.spancr:hover { color: #8ee0e2;}
                                        `);
                                        var total = 0;
                                        var expList = {};
                                        var json;
                                        var duration;


                                        var myInfo = JSON.parse(localStorage.myInfo || '{}');
                                        $.get('https://itsibitsi.blog/steadfast',{id:myInfo.player_id},function(data){
                                            var thetime = parseInt(data);
                                            var livetime = function(time) {
                                                duration = moment.duration(Math.abs(moment.unix(time).diff(moment())));
                                                duration = duration.days() + ' days ' + duration.hours() + ' hours ' + duration.minutes() + ' minutes ' + duration.seconds() + ' seconds ';
                                                $("#sftrduration").text(duration);
                                            }

                                            if($("#stu-confirmation div.desc:contains('Steadfast')").length) {
                                                $("#stu-confirmation div.desc").append(`<span class="contributors-links">
                                                            <span id="crSet" class="spancr" style="display: none;">Start IBB Steadfast Tracking</span>
                                                            <span id="crClr" class="spancr" style="display: none;">Stop Tracking</span>
                                                            <span id="crExp" class="spancr" style="display: none;">Generate report</span>
                                                        </span>`);

                                            if(!isNaN(thetime)) {
                                                $("#stu-confirmation div.desc .description").after(`<div class="description"><br/>Steadfast tracking has been set from <strong>${moment.unix(thetime).utc().format('MMMM D, YYYY kk:mm:ss TCT')}</strong><br/>Length of tracking : <strong id="sftrduration"></strong></div>`);
                                                $("#crClr,#crExp").show();
                                                lenintv = setInterval(function(){ livetime(data); }, 1000);
                                            }
                                            else {
                                                $("#crSet").show();
                                            }

                                                $("#crSet").click(function(){
                                                    $("div.loader").addClass('waiting');
                                                    $(this).text("Setting up...").delay(3000).fadeOut();
                                                    obj = {};
                                                    obj.id = myInfo.player_id;
                                                    var steadfast = {};
                                                    var n = 4;
                                                    for(i = 36; i <= 39;i++) {
                                                        $.post('https://www.torn.com/factions.php?rfcv=' + getRFC(), {step: 'upgradeConfirm', type: i, level: 1}, function(data){
                                                            data = JSON.parse(data);
                                                            var bs = data.contributors["0"]["0"].challenge;

                                                            steadfast[bs] = {};
                                                            $.each(data.contributors, function(){
                                                                $.each(this, function(){
                                                                    var obj = {};
                                                                    obj[this.userid] = {name:this.playername, userID:this.userid, energy:parseInt(this.total.replace(/,/g,''))};
                                                                    $.extend(steadfast[bs], obj);
                                                                });
                                                            });
                                                            thetime = moment().unix();
                                                            obj.time = thetime;
                                                            n--;

                                                            if(!n) {
                                                                obj.json = JSON.stringify(steadfast);

                                                                $.ajax({
                                                                    url: 'https://itsibitsi.blog/steadfast',
                                                                    data: JSON.stringify(obj),
                                                                    dataType: 'json',
                                                                    type: "PUT",
                                                                    contentType: "application/json; charset=utf8"
                                                                });
                                                                $("#stu-confirmation div.desc .description").after(`<div class="description"><br/>Steadfast tracking has been set from <strong>${moment.unix(obj.time).utc().format('MMMM D, YYYY kk:mm:ss TCT')}</strong><br/>Length of tracking : <strong id="sftrduration"></strong></div>`);
                                                                lenintv = setInterval(function(){ livetime(obj.time); }, 1000);
                                                                $("#crClr,#crExp").fadeIn();
                                                                $("div.loader").removeClass('waiting');

                                                            }
                                                        });
                                                    }
                                                });
                                                $("#crExp").click(function(){
                                                    $(this).text("Generating...");
                                                    var btn = this;
                                                    $("div.loader").addClass('waiting');
                                                    $.getJSON('https://itsibitsi.blog/steadfast', {id:myInfo.player_id, time:thetime},function(data) {
                                                        var startpoint = JSON.parse(data.json);
                                                        var steadfast = {};
                                                        var exportObj = {};
                                                        var n = 4;
                                                        for(i = 36; i <= 39;i++) {
                                                            $.post('https://www.torn.com/factions.php?rfcv=' + getRFC(), {step: 'upgradeConfirm', type: i, level: 1}, function(data){
                                                                data = JSON.parse(data);
                                                                var bs = data.contributors["0"]["0"].challenge;
                                                                var diff;

                                                                steadfast[bs] = {};
                                                                $.each(data.contributors, function(){
                                                                    $.each(this, function(){
                                                                        if(startpoint[bs].hasOwnProperty(this.userid)) {
                                                                            if(parseInt(this.total.replace(/,/g,'')) - startpoint[bs][this.userid].energy) {
                                                                                if(!exportObj.hasOwnProperty(this.userid)){
                                                                                    var obj = {};
                                                                                    obj[this.userid] = {name:this.playername, strength:0, speed:0, defense:0, dexterity:0, total:0};
                                                                                    $.extend(exportObj, obj);
                                                                                }
                                                                                diff = parseInt(this.total.replace(/,/g,'')) - startpoint[bs][this.userid].energy;
                                                                                exportObj[this.userid][bs.substr(3)] = diff;
                                                                                exportObj[this.userid].total += diff;
                                                                            }
                                                                        }
                                                                    });
                                                                });
                                                                n--;

                                                                if(!n) {
                                                                    json = JSON.stringify(exportObj);
                                                                    $("div.loader").removeClass('waiting');
                                                                    var duration = moment.duration(Math.abs(moment.unix(startpoint.start).diff(moment())));
                                                                    duration = duration.days() + ' days ' + duration.hours() + ' hours ' + duration.minutes() + ' minutes ';
                                                                    alert("Steadfast Tracking Report has been generated successfully. You can export now.");
                                                                    $(btn).off().text("Export now").click(function(){
                                                                        $("#userword").val(json).select();
                                                                        document.execCommand("cut");
                                                                        window.open("https://json-csv.com");
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });

                                                });
                                            }

                                            $("#crClr").click(function(){
                                                if(confirm("Are you sure to stop current steadfast tracking?")) {
                                                    $("#stu-confirmation div.desc .description:eq(1):last").fadeOut().remove();
                                                    clearInterval(lenintv);
                                                    obj = {hash:window.btoa(myInfo.player_id),time:thetime};
                                                    $.ajax({
                                                        url: 'https://itsibitsi.blog/steadfast',
                                                        data: JSON.stringify(obj),
                                                        dataType: 'json',
                                                        type: "DELETE",
                                                        contentType: "application/json; charset=utf8"
                                                    });
                                                    alert('Current steadfast tracking has been stopped.');
                                                    $(this).hide();
                                                    $("#crSet").text("Start IBB Steadfast Tracking").fadeIn();
                                                    $("#crExp").fadeOut();
                                                }
                                            });
                                        });

                                        if($(".challenge").length > 0)
                                        {
                                            $.each($(".contribution"), function(){
                                                total += parseInt($(this).text().replace(/,/g,"").replace(/\(/g,"").replace(/\)/g,""));
                                            });

                                            $(".challenge").text($(".challenge").text() + " ( Total : " + commaSeparateNumber(total) + " )");
                                        }
                                    });
                                    var observerTarget2 = $("#steadfast")[0];
                                    var observerConfig2 = { attributes:true, childList: true, characterData: false, subtree: true };
                                    observer2.observe(observerTarget2, observerConfig2);
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
                $("#tcLogo").css("height", "5px").removeClass('logo');
                $("#tcLogo h1").html("<br/><div id='chain' style='display: none; position: absolute;'></div>");
                itvlChainLoop = setInterval(chainLoop, 1800);
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
                $.getJSON(http+"//api.torn.com/user/?selections=profile,bars,personalstats&key="+apikey, function(data){
                    addAPIusage();
                    if(data.error !== undefined) {
                        scroverlay('API Key error. Installing new API Key.');
                        saveAPIKey();
                    }
                    else {
                        if(data.faction.faction_id != 2736) return 0;

                        GM_addStyle(
                            `
                                b.stred { color: red; }
                                b.stgreen { color: green; }
                            `
                            );

                        var medLink = `<a class="back t-clear h c-pointer  m-icon line-h24 right" style="margin-right: 20px;" href="item.php#medical-items">
                                            <span class="icon-wrap">
                                                <i class="medical-category-icon"></i>
                                            </span>
                                            <span>Take Meds</span>
                                        </a>`;
                        $(medLink).insertAfter(".back");

                        var energy = data.energy.current;
                        var maxE = data.energy.maximum;
                        var hits = parseInt(energy/25);
                        var mystats = data.personalstats;

                        initChainCounter();
                        alertParticipantAttack();
                        $.getJSON(http+"//api.torn.com/user/"+userid+"?selections=profile,personalstats&key="+apikey, function(data){
                            addAPIusage();
                            respectgain();
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

                                    var myxantaken = mystats.xantaken !== undefined ? mystats.xantaken : 0;
                                    var myrefills = mystats.refills !== null ? mystats.refills : 0;

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
                                        url: 'https://itsibitsi.blog/targets',
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
                                            <div class="title___3lgDf" style="color: #006b8c;text-transform: none;font-size: 12px; font-weight: lighter; text-align: left; width: 250px;">
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
                                                    : <b class="${xantaken > myxantaken ? "stred" : "stgreen"}" title="You : <b>${commaSeparateNumber(myxantaken)}</b>">${commaSeparateNumber(xantaken)}</b><br/>
                                                    : <b class="${xantaken > myrefills ? "stred" : "stgreen"}" title="You : <b>${commaSeparateNumber(myrefills)}</b>">${commaSeparateNumber(refills)}</b><br/>
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

                                    $(".btn___HtZtG:eq(0)").parent().after(`<div style="color:#ff0000; font-weight: bold; text-align: left;">
                                                Energy : ${energy}/${maxE}<br/>
                                                Hits remaining : ${hits}
                                                </div>`);
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

                var observer = new MutationObserver(function(mutations) {

                    if($("input.description").length != 0) {
                        try{
                            $("input.description").val(getParameterByName("desc"));
                         }catch(e){
                         }
                    }

                    $.each($(".text.left.t-overflow"), function(){
                        if($.trim($(this).text()).search("Chain Target") != -1) {
                            xid = parseInt(getParameterByName('XID', $(this).closest("div.acc-wrapper").find("a.user.name").attr("href")));
                            $(this).html($(this).text().replace("Chain Target", "Target") + " - <a target='_blank' href='loader2.php?sid=getInAttack&user2ID="+xid+"'>Attack</a>");
                        }
                    });
                    if($("#resptargets").length == 0) {
                        $(`<a id="resptargets" class="t-clear h c-pointer  m-icon line-h24 right last" href="#" style="color: #0a8e9c;">
                                <span class="icon-wrap">
                                    <i class="top-page-icon mods-icon"></i>
                                </span>
                                <span id="allow bl-exchange">Respect Targets</span>
                            </a>`).insertBefore('div.links-footer');

                        if(!$("#btnTimer").length) {
                            var counterHosp = $(".status.left:contains('Hospital')").length;
                            var counterAll = $(".status.left:not(:first)").length;
                            $("div.info-msg-cont:not(.green) div.msg.right-round").append(' <button id="btnTimer" style="cursor: pointer;background: #fff;border: solid 1px;" title="Get Hospital countdown and life bar for <b>' + counterHosp + ' targets </b> below in hospital">In Hospital</button>');
                            $("div.info-msg-cont:not(.green) div.msg.right-round").append(' <button id="btnLife" style="cursor: pointer;background: #fff;border: solid 1px;" title="Get Hospital countdown and life bar for all <b>' + counterAll + ' targets </b> in <b>page ' + $(".page-number.active.page-show").attr("page") + '</b> list">All targets</button>');

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
                                                respect: parseFloat(this.respect_gain),
                                                playername: "Someone[" + this.defender_id + "]",
                                                desc: this.result,
                                                atklog: "",
                                                timestamp: this.timestamp_ended
                                            }});
                                        }
                                        else {
                                            if(this.timestamp_ended > targetRespects[this.defender_id].timestamp) {
                                                targetRespects[this.defender_id].respect = parseFloat(this.respect_gain);
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

                                $.post('https://itsibitsi.blog/noname',{nonamelist: JSON.stringify(nonamelist)},function(data){
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
                                        desc = sortable[key][1].desc;
                                        atklog = sortable[key][1].atklog;
                                        thetime = moment.unix(sortable[key][1].timestamp).utc().format("HH:mm:ss DD/MM/YY");
                                        showatklog = "";

                                        if(!(atklog == "" || atklog == undefined)) {
                                            showatklog = `<div class="edit right atklog" style="width: 32px;" atklog="${atklog}" title="View Attack Log">
                                                                <i class="view-icon"></i>
                                                            </div>`;
                                        }

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
                            url: 'https://itsibitsi.blog/targets',
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

            function chainMax(current) {
                var arr = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000];

                for(var i = 0; i < arr.length; i++) {

                    if(current < arr[i]) {
                        return arr[i];
                        break;
                    }
                }
            }

            function chainLoop()
            {
                var myInfo = JSON.parse(localStorage.myInfo || '{}');
                if(myInfo.player_id == undefined) return 0;

                // ***revise
                var apikey = localStorage.tornKey !== undefined ? localStorage.tornKey : (scroverlay('No API Key Installed. Installing new API Key.'), saveAPIKey());

                if(!checkAPIusage(1)) return 0;
                $.getJSON(http+"//api.torn.com/faction/?selections=chain&key="+apikey,function(data){
                    addAPIusage();
                    var timercountdown = moment.unix(data.chain.timeout).format("mm:ss");
                    var chainmax = chainMax(data.chain.current);
                    chaincurrent = data.chain.current;
                    var chain = chaincurrent + '/' + chainmax;
                    var cooldowntimer = data.chain.cooldown;

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
                        <span style="font-size: calc(100% - 9px);">next hit bonus : x${data.chain.modifier}</span>
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

                });
            }

            function chainReport() {
                GM_addStyle(`
                    span.spancr { cursor: pointer; padding: 0px 3px; color: cadetblue;}
                `);
                var observer = new MutationObserver(function(mutations) {
                    if($(".report-title-faction-name").length) {
                        $("canvas").css("cursor", "wait");
                        $.getJSON('war.php?step=getChainReport&chainID='+getParameterByName('chainID',location.url), function(data){
                            var totalRespects = data.graph["0"].data;
                            var respectGains = data.graph["1"].data;
                            var bonusHit = data.graph["3"].data;
                            var txtBonus = '';
                            var members = data.members;
                            var respects = parseFloat(data.stats.respect.replace(/,/g,''));
                            var chain = parseInt(data.quantity);
                            var totalBonus = 0;

                            $.each(bonusHit, function() {
                                if(this[1] !== 0) {
                                    txtBonus += "#" + commaSeparateNumber(this[1]) + " --- " + commaSeparateNumber(this[2]) + "\n";
                                    totalBonus += this[2];
                                }
                            });



                            $(".report-stats-rows:eq(0)").append('<li class="report-stats-row"><i class="icon-chain-stat-respect" title="Average Respect"></i><span class="report-stat-name">Avg Respect 1</span><span class="report-stat-value">' + (respects/chain).toFixed(2) + '</span></li>');
                            $(".report-stats-rows:eq(1)").append('<li class="report-stats-row"><i class="icon-chain-stat-respect" title="Average Respect excluded Bonus hits and respect (Normal Hits)"></i><span class="report-stat-name">Avg Respect 2</span><span class="report-stat-value">' + ((respects-totalBonus)/(chain-bonusHit.length)).toFixed(2) + '</span></li>');
                            $(".report-stats-rows:eq(2)").append('<li class="report-stats-row"><i class="icon-chain-stat-chain" title="Chain"></i>Report : <span id="crAdd" class="spancr">Add</span> | <span id="crClear" class="spancr">Clear</span> | <span id="crExp" class="spancr">Export</span><input type="text" id="crClipboard" style="display: none;"/></li>');

                            $("span#crAdd").click(function(){
                                var expMembers = JSON.parse(localStorage.chainreport || '{}' );
                                expMembers.chain = expMembers.chain === undefined ? 1 : ++expMembers.chain;



                                var parseReport = function() {
                                    $.each(members, function() {
                                        if(expMembers.hasOwnProperty(this.userID)){

                                            expMembers[this.userID].name = this.playername;
                                            expMembers[this.userID].attacks += parseInt(this.attacks);
                                            expMembers[this.userID].attacks2 += (parseInt(this.attacks) - parseInt(this.mugs));
                                            expMembers[this.userID].respect += parseFloat(this.respect);
                                            expMembers[this.userID].wallhits += parseInt(this.wars);
                                            expMembers[this.userID].leaves += parseInt(this.leaves);
                                            expMembers[this.userID].hosps += parseInt(this.hosps);
                                            expMembers[this.userID].mugs += parseInt(this.mugs);
                                            expMembers[this.userID].assists += parseInt(this.assists);
                                            expMembers[this.userID].draws += parseInt(this.draws);
                                            expMembers[this.userID].escapes += parseInt(this.escapes);
                                            expMembers[this.userID].losses += parseInt(this.losses);
                                            expMembers[this.userID].energyused += ((parseInt(this.attacks) + parseInt(this.assists) + parseInt(this.draws) + parseInt(this.escapes) + parseInt(this.losses)) * 25);
                                            expMembers[this.userID].energywasted += ((parseInt(this.draws) + parseInt(this.escapes) + parseInt(this.losses)) * 25);
                                            expMembers[this.userID].bonus += parseInt(this.bonuses);
                                        }
                                        else {
                                            expMembers[this.userID] = {
                                                name:this.playername,
                                                attacks:parseInt(this.attacks),
                                                attacks2:parseInt(this.attacks) - parseInt(this.mugs),
                                                respect:parseFloat(this.respect),
                                                wallhits:parseInt(this.wars),
                                                leaves:parseInt(this.leaves),
                                                hosps:parseInt(this.hosps),
                                                mugs:parseInt(this.mugs),
                                                assists:parseInt(this.assists),
                                                draws:parseInt(this.draws),
                                                escapes:parseInt(this.escapes),
                                                losses:parseInt(this.losses),
                                                energyused:(parseInt(this.attacks) + parseInt(this.assists) + parseInt(this.draws) + parseInt(this.escapes) + parseInt(this.losses)) * 25,
                                                energywasted:(parseInt(this.draws) + parseInt(this.escapes) + parseInt(this.losses)) * 25,
                                                bonus:parseInt(this.bonuses)
                                            }
                                        }
                                    });
                                    localStorage.chainreport = JSON.stringify(expMembers);
                                    alert(expMembers.chain + ' chain report(s) successfully added.');
                                }

                                if(expMembers.chain === 1) {
                                    $.getJSON("https://api.torn.com/faction/2736?selections=basic&key=S3VZj7UV", function(data) {

                                        $.each(data.members, function(xid,obj){
                                            expMembers[xid] = {
                                                name:obj.name,
                                                attacks:0,
                                                attacks2:0,
                                                respect:0,
                                                wallhits:0,
                                                leaves:0,
                                                hosps:0,
                                                mugs:0,
                                                assists:0,
                                                draws:0,
                                                escapes:0,
                                                losses:0,
                                                energyused:0,
                                                energywasted:0,
                                                bonus:0
                                            }
                                        });

                                        parseReport();
                                    });
                                }

                                else {
                                    parseReport();
                                }
                            });

                            $("span#crClear").click(function(){
                                localStorage.removeItem("chainreport");
                                alert('Successfully cleared');
                            });

                            $("span#crExp").click(function(){
                                var expdata = JSON.parse(localStorage.chainreport || '{}');
                                delete expdata.chain;
                                $.each(expdata, function() {
                                    this.respect = parseFloat(this.respect).toFixed(3);
                                    this.avgrespect = this.attacks == 0 ? 0 : (parseFloat(this.respect) / parseInt(this.attacks)).toFixed(3);
                                });

                                $("input#crClipboard").val(JSON.stringify(expdata)).show().select();
                                document.execCommand ("copy");
                                $("input#crClipboard").hide();
                                alert("Data has been exported and copied to your clipboard. Visit https://json-csv.com to paste and convert to table. Press OK will open web https://json-csv.com/.")
                                window.open("https://json-csv.com",'chainreport');
                                localStorage.removeItem("chainreport");
                            });

                            $("canvas").css("cursor", "pointer").click(function(){
                                var hit = parseInt(prompt("Chain #number :",data.quantity));
                                try {
                                    var index = respectGains.findIndex(function(v,i){ if(v[1] == hit) return i;});
                                    alert(`CHAIN AT #${hit}\nTotal Respects : ${commaSeparateNumber(totalRespects[index][1])} \nRespect Gain : ${commaSeparateNumber(respectGains[index][2])} \n ---------------------------------------------- \nBONUS HIT SUMMARY \n${txtBonus}
                                    `);
                                }
                                catch(e) {
                                    alert("Chain #number must below than " + data.quantity);
                                }
                            });
                        });
                        observer.disconnect();
                    }
                });

                // start listening for changes
                var observerTarget = $("#chain-report-react-root")[0];
                var observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };
                observer.observe(observerTarget, observerConfig);

            }

            function respectgain() {
                var apikey = localStorage.tornKey !== undefined ? localStorage.tornKey : (scroverlay('No API Key Installed. Installing new API Key.'), saveAPIKey());

                var observer = new MutationObserver(function(mutations) {
                    if(($("div[class^='dialog']:eq(1) div[class^='title']").text().search("RESPECT") == -1) && (($("div[class^='dialog']:eq(0) div[class^='title']").text().search("defeated") != -1) || ($("div[class^='dialog']:eq(0) div[class^='title']").text().search("hospitalized") != -1) || ($("div[class^='dialog']:eq(0) div[class^='title']").text().search("mugged") != -1)))
                    {

                        if(!checkAPIusage(1)) return 0;
                        $.getJSON(http+"//api.torn.com/user/?selections=attacks,bars&key="+apikey,function(data){
                            addAPIusage();
                            var obj = data.attacks[Object.keys(data.attacks)[99]];

                            defenderID = obj.defender_id;
                            respect = parseFloat(obj.respect_gain);
                            playername = obj.defender_name;
                            timestamp = obj.timestamp_ended;
                            chain = $.inArray((chaincurrent + 1), [25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000]) != -1 ? "bonus #" + (chaincurrent + 1) : ((chaincurrent + 1) == 0 ? "cooldown" : "#" + (chaincurrent + 1) );
                            action = obj.result;

                            targetRespects = JSON.parse(localStorage.targetRespects || '{}');
                            if(targetRespects[defenderID] == undefined) {
                                $.extend(true, targetRespects, {[defenderID]:{
                                    respect:respect,
                                    playername:playername,
                                    desc:"You " + action.toLowerCase() + " them on chain " + chain,
                                    timestamp:((timestamp/1000) + 5)
                                }});
                            }
                            else {
                                targetRespects[defenderID].respect = respect;
                                targetRespects[defenderID].playername = playername;
                                targetRespects[defenderID].desc = "You " + action.toLowerCase() + " them on chain " + chain;
                                targetRespects[defenderID].timestamp = ((timestamp/1000) + 5);
                            }
                            localStorage.targetRespects = JSON.stringify(targetRespects);

                            energy = data.energy.current;
                            maxE = data.energy.maximum;
                            hits = parseInt(energy/25);
                            $("button.silver___3xq-2").parent().after(`<div style="color:#ff0000; font-weight: bold; text-align: left;">
                                        Energy : ${energy}/${maxE}<br/>
                                        Hits remaining : ${hits}
                                        </div>`);
                            $("button.silver___3xq-2").parent().after(`<div>
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

                            $(".modal___2UzcS:eq(1)").prepend(`
                            <div class="dialog___3fmqA" style="width:260px;">
                                <div class="colored___3aPje" style="background: linear-gradient(to bottom, rgba(255, 255, 255, 0.65) 0, rgba(200, 217, 255, 0.5) 100%)">
                                    <div class="title___3lgDf">GAIN  ${respect} RESPECT</div>
                                    <div><button id="addTarget" class="btn___bn3W1 btn___HtZtG silver___3xq-2">ADD TARGET</button></div>
                                    <div class="title___3lgDf" style="color: #006b8c;">WORTH RESPECT GAINS ?</div>
                                    <div class="title___3lgDf" style="color: #006b8c;font-weight: 100; text-transform: none;">Ideally to add them if they are not wall targets and gain more than 4 respect</div>
                                </div>
                            </div>`);

                            $("#addTarget").click(function(){
                                location.href = "/blacklist.php#/p=add&XID=" + defenderID + "&desc=Chain Target " + respect.toFixed(2);
                            });

                            if(customFilter.retalCD && ($("div[class^='dialog']:eq(0) div[class^='title']").text().search("hospitalized") != -1)) {
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
                    }
                    else if(($("div[class^='dialog'] div[class^='title']").text().search("lost") != -1) && ($("div#takemeds").length == 0))
                    {
                        $("button.silver___3xq-2").parent().after(`<div id="takemeds">
                                                                <span class="btn___HtZtG btn-wrap silver">
                                                                    <a role="button" name="directLink" class="btnLink___26ShI btn" href="item.php#medical-items">Take MEDs</a>
                                                                </span>
                                                        </div>`);
                        return false;
                    }
                });
                // start listening for changes
                var observerTarget = $("div.players___2MAdf")[0];
                var observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };
                observer.observe(observerTarget, observerConfig);


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
                            url: 'https://itsibitsi.blog/targets',
                            data: JSON.stringify(player),
                            dataType: 'json',
                            type: "PUT",
                            contentType: "application/json; charset=utf8"
                        });
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
                            url: 'https://itsibitsi.blog/warbase',
                            data: localStorage.myInfo,
                            dataType: 'json',
                            type: "POST",
                            contentType: "application/json; charset=utf8"
                        });
                        $.get('https://itsibitsi.blog/leader')
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
                                            $(this).closest("ul").css("background-color","").removeClass("highlight-active");
                                        },
                                        onTick : function(timer) {
                                            if(timer[4] < 1 && timer[5] < 15 && $(this).css("color") == "rgb(165, 38, 0)")
                                                $(this).css("color","#F3CA02");

                                            if(timer[4] < 1 && timer[5] < 2 && !$(this).closest("ul").hasClass("highlight-active"))
                                                $(this).closest("ul").css("background-color","#f5fdc9").addClass("highlight-active");
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


            function chainTargets() {
            GM_addStyle(`
            #search input[type="text"] {
                width: 100px;height: 20px;
                font-size: 16px;
                text-align: center;
            }

            #results {
                padding: 40px 0px;
            }
            .bottom-round {
                border-radius: 0 0 5px 5px;
            }

            ol, ul {
                list-style: none;
            }
            .target-list>li:first-child {
                font-weight: 700;
                border-top: 0;
            }
            .target-list>li .transaction {
                border-top: 1px solid #FFF;
            }

            .target-list>li.title .transaction>li.player {
                font-size: 12px;
                padding-top: 10px;
                padding-bottom: 10px;
                text-align: center;
            }

            .target-list .transaction>li {
            float: left;
            padding: 10px;
            line-height: 14px;
            margin-top: -1px;
            border-right: 1px solid #CCC;
            border-left: 1px solid #FFF;
            width: 250px;
            }
            .target-list .transaction>li.player {
            width: 250px;
            font-size: 12px;
            text-align: left;
            }
            .target-list li:not(:first-child) .transaction>li.attacks,.target-list li:not(:first-child) .transaction>li.defends {
            font-size: 10px;
            text-align: right;
            padding: 3.5px 10px;
            }
            .target-list>li .transaction {
            border-top: 1px solid #FFF;
            }
            .target-list .transaction>li .transaction-date, .target-list .transaction>li .transaction-time {
            display: inline-block;
            }

            .target-list>li:first-child .transaction>li {
                margin-top: 0;
            }

            .target-list>li .transaction>li.player {
                width: 230px;
            }

            .target-list .transaction>li:first-child {
                border-left: 0;
            }

            .target-list .transaction>li.faction {
                width: 240px;
                font-size:12px;
            }

            .target-list .transaction>li {
                width: 39px;
                background-color: #fbfbfb;
            }
            .target-list .transaction>li.attacks,.target-list .transaction>li.defends,.target-list .transaction>li.level,.target-list .transaction>li.xanax,.target-list .transaction>li.refills,.target-list .transaction>li.seused,.target-list .transaction>li.merits {
                text-align: center;
            }
            .target-list .transaction>li.hit{
                width: 14px;
            }
            .target-list>li, .d .property-option .upkeep-opt .upkeep-payments>li {
            border-top: 1px solid #dcdcdc;
            }
            .add-player-icon {
                cursor: pointer;
            }
            .d .property-option .lease-input>li.clear, .target-list .transaction>li.clear {
            float: none;
            width: 0;
            padding: 0;
            margin: 0;
            border: none;
            }
            .d .ladda-button {
            color: #333;
            left: 300px;
            border: 0;
            padding: 4px 18px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            text-shadow: 0 1px 0 rgba(255,255,255,.4);
            border-radius: 3px;
            -webkit-appearance: none;
            -webkit-font-smoothing: antialiased;
            -webkit-tap-highlight-color: transparent;
            background: linear-gradient(to bottom,#d7d7d7 0,#7c7c7c 80%,#8a8a8a 100%);
            box-shadow: 2px 0 2px rgba(255,255,255,.2) inset, -2px 1px 2px rgba(255,255,255,.2) inset;
            overflow: hidden;
            position: relative;
            text-transform: uppercase;
            }
            .d .ladda-button, .d .ladda-button .ladda-spinner, .d .ladda-button .ladda-label {
            -webkit-transition: .3s cubic-bezier(.175,.885,.32,1.275) all!important;
            -moz-transition: .3s cubic-bezier(.175,.885,.32,1.275) all!important;
            -ms-transition: .3s cubic-bezier(.175,.885,.32,1.275) all!important;
            -o-transition: .3s cubic-bezier(.175,.885,.32,1.275) all!important;
            transition: .3s cubic-bezier(.175,.885,.32,1.275) all!important;
            }.d .ladda-button:hover {
            background: linear-gradient(to bottom,#fff 0,#acacac 93%,#b1b1b1 98%);
            }`);
                $("title").text("Chain Targets | TORN");
                $("h4").text("CHAIN TARGETS");
                $("div.main-wrap").removeClass("error-404").html("");

                $(`<div id="search">
                <p>Xanax between <input type="text" id="xanmin" maxlength="5" placeholder="minimum"> and <input type="text" id="xanmax" maxlength="5" placeholder="maximum"></p>
                <br/>
                <p>Level between <input type="text" id="lvlmin" maxlength="2" placeholder="minimum"> and <input type="text" id="lvlmax" maxlength="3" placeholder="maximum"></p>
                <br/>
                <p>Refills between <input type="text" id="refmin" maxlength="5" placeholder="minimum"> and <input type="text" id="refmax" maxlength="5" placeholder="maximum"></p>
                <br/>
                <p>Faction ID <input type="text" id="faction_id" maxlength="5" placeholder="optional"></p>
                <br/>
                <p><button id="findTargets">Find Targets</button></p>
                </div>`)
                .appendTo("div.main-wrap");

                $("<div id='results'>").appendTo("div.main-wrap");

                $(`
        <p>
        To help us keep more targets, please visit some other faction page. <br>
        <br>
        ** Click icon to add target to your enemy list. In future, you can refer your enemy list to quick access hitting your target also it can be accessed using your mobile. <br>
        ** It is recommended spending your points to make more space for your enemy list to save more favorite targets. <br/>
        ** Visit page blacklist / enemy list to view a list of your recent hits and click menu "Respect Targets". All targets sorted by top respect gain (see image below)<br/>
        <br/>
        <img src="https://image.prntscr.com/image/pnhlWNpmSbSVQkq435Wzwg.png" style="border: 1px #ccc solid;">

        </p>`).appendTo("div#results");

                $("#findTargets").click(findTargets);

            }

            function findTargets() {
                var params = {};
                var apikey = localStorage.tornKey !== undefined ? localStorage.tornKey : (scroverlay('No API Key Installed. Installing new API Key.'), saveAPIKey());

                if($("#xanmin").val() || $("#xanmax").val())
                {
                    params.xanmin = parseInt($("#xanmin").val());
                    params.xanmax = parseInt($("#xanmax").val());
                }

                if($("#lvlmin").val() || $("#lvlmax").val())
                {
                    params.lvlmin = parseInt($("#lvlmin").val());
                    params.lvlmax = parseInt($("#lvlmax").val());
                }

                if($("#refmin").val() || $("#refmax").val())
                {
                    params.refmin = parseInt($("#refmin").val());
                    params.refmax = parseInt($("#refmax").val());
                }

                if($("#faction_id").val())
                {
                    params.faction_id = parseInt($("#faction_id").val());
                }

                $.getJSON(http+"//api.torn.com/user/?selections=profile&key="+apikey, function(data){
                    params.faction = data.faction;

                    $.getJSON(http+"//itsibitsi.blog/targets", params)
                    .done(function(data){
                        $("#results").html(`
                        <div id="targetlists" class="control-tab-section ui-tabs-panel ui-widget-content ui-corner-bottom"
                            role="tabpanel" >
                            <div class="target-wrap">
                                <div class="vault-trans-wrap">
                                    <div class="title-black top-round">Target results</div>
                                    <ul class="target-list cont-gray bottom-round">
                                        <li class="title">
                                            <ul class="transaction">
                                                <li class="player">Player</li>
                                                <li class="faction">Faction</li>
                                                <li class="level">Level</li>
                                                <li class="xanax">Xanax</li>
                                                <li class="refills">Refills</li>
                                                <li class="seused">SE</li>
                                                <li class="merits">Merits</li>
                                                <li class="attacks">Atks</li>
                                                <li class="defends">Defs</li>
                                                <li class="hit">Hit?</li>
                                                <li class="clear"></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>`);

                        $.each(data, function () {
                            faction = this.faction_id != 0 ? `<a href="https://www.torn.com/factions.php?step=profile&ID=${this.faction_id}">${this.faction_name}[${this.faction_id}]</a>` : "&nbsp;";
                            $("div#targetlists ul.target-list > li:last-child").after(`
                                <li id="${this.player_id}">
                                    <ul class="transaction">
                                        <li class="player">
                                            <a href="https://www.torn.com/profiles.php?XID=${this.player_id}">${this.player_name}[${this.player_id}]</a>
                                            <span class="icon-wrap" title="Add <strong>${this.player_name}</strong> to your enemy list"><i class="add-player-icon" id="${this.player_id}"></i></span>
                                        </li>
                                        <li class="faction">${faction}</li>
                                        <li class="level">${isNull(this.player_level)}</li>
                                        <li class="xanax">${isNull(this.xantaken)}</li>
                                        <li class="refills">${isNull(this.refills)}</li>
                                        <li class="seused">${isNull(this.seused)}</li>
                                        <li class="merits">${isNull(this.meritsbought)}</li>
                                        <li class="attacks">${isNull(this.attackswon)}<br/>${isNull(this.attackslost)}</li>
                                        <li class="defends">${isNull(this.defendswon)}<br/>${isNull(this.defendslost)}</li>
                                        <li class="hit"><a target="_blank" href="https://www.torn.com/loader.php?sid=attack&user2ID=${this.player_id}">Hit</a></li>
                                        <li class="clear"></li>
                                    </ul>
                                </li>`);
                        });

                        $(".add-player-icon").on('click', function () {
                            var params = {};
                            params.step = 'addToEnemy';
                            params.ID = $(this).attr("id");
                            params.about = 'Chain Target';
                            button = $(this);

                            // **revise
                            $.post("userlist.php?rfcv=" + getRFC(), params, function(data){
                                resp = $.parseJSON(data);
                                if(resp.success) {
                                    $(button).closest("span").fadeOut();
                                }
                            });

                        });
                    })
                    .error(function(){
                        $("#results").html('No data found.');
                    });
                });



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

            var chainalert = `<div id='chainbox' class="m-top10" style="display:none;">
            <div class="title-red top-round" role="heading" aria-level="5">
            <i class="point-timer-icon"></i>

            <span></span>
            </div>
            <div class="bottom-round cont-gray p10">
            <p></p>
            </div>
            <!--div class="clear"></div-->
            <hr class="page-head-delimiter m-top10">
            </div>`;

            $('div.content-wrapper').prepend(chainalert);

            if (Notification.permission !== "granted")
                Notification.requestPermission();

            // custom button navigation for targets
            $("div#nav-my_faction").closest("div").after(function(){
                var $navTargets =  $(this).clone();
                $navTargets.find("div").attr("id", "nav-targets").css('background-color', '#faefc7');
                $navTargets.find("a").attr("href","/targets.php");
                // $navTargets.find("i").removeClass("my-faction-navigation-icons").addClass("staff-navigation-icons");
                $navTargets.find("span").text("Chain Targets");
                return $navTargets;
                });

                avoidGym();


            /******************** End Initializer ********************/

            if (location.href.indexOf('torn.com/factions.php?step=your') !== -1) {
                initWarBase();
            } else if (location.href.indexOf('torn.com/factions.php?step=profile&ID=') !== -1) {
                initFactionData();
                initFactionHospital();
            } else if (location.href.indexOf('torn.com/loader.php?sid=attack&user2ID') !== -1) {
                initUserStats();
            } else if (location.href.indexOf('torn.com/loader2.php?sid=attack&user2ID') !== -1) {
                checkHosp();
            } else if (location.href.indexOf('torn.com/targets.php') !== -1) {
                chainTargets();
            } else if (location.href.indexOf('torn.com/blacklist.php') !== -1) {
                enemyList();
            } else if (location.href.indexOf('torn.com/bounties.php') !== -1) {
                bountyTimer();
            } else if (location.href.indexOf('userlist.php?') !== -1) {
                userList();
            } else if (location.href.indexOf('war.php?step=chainreport') !== -1) {
                chainReport();
            }