// ==UserScript==
// @name         Munzee Badges
// @version      0.13
// @description  Show the hidden badges
// @author       rabe85
// @match        https://www.munzee.com/m/*/badges/
// @match        https://www.munzee.com/m/*/badges/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @namespace    https://greasyfork.org/users/156194
// @downloadURL https://update.greasyfork.org/scripts/37153/Munzee%20Badges.user.js
// @updateURL https://update.greasyfork.org/scripts/37153/Munzee%20Badges.meta.js
// ==/UserScript==

// Bekannte Fehler:
// - Wechsel-Link nach komplett eingefügten Kategorien funktioniert nicht


(function() {
    'use strict';

    function munzee_badges() {

        var dev = 0;

        // Einstellungen laden
        var munzee_setting_badge_show = GM_getValue('munzee_setting_badge_show', 'Platzhalter'); // 'Badges' oder 'Platzhalter' anzeigen

        // Einstellungen speichern - Badges
        function save_settings_showbadges() {
            GM_setValue('munzee_setting_badge_show', 'Badges');
            location.reload();
        }

        // Einstellungen speichern - Platzhalter
        function save_settings_hidebadges() {
            GM_setValue('munzee_setting_badge_show', 'Platzhalter');
            location.reload();
        }

        // Fancybox CSS laden
        var load_fancybox_css = document.createElement('link');
        load_fancybox_css.rel = 'StyleSheet';
        load_fancybox_css.type = 'text/css';
        load_fancybox_css.href = 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.1.25/jquery.fancybox.min.css';
        document.head.appendChild(load_fancybox_css);

        // Fancybox Script laden
        var load_fancybox_script = document.createElement('script');
        load_fancybox_script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.1.25/jquery.fancybox.min.js';
        document.body.appendChild(load_fancybox_script);

        // Bootstrap Script laden
        var bootstrap_script_start = document.createElement('script');
        var bootstrap_script_function = document.createTextNode('$(window).load(function(){ $(\'.badge-helper-inserts\').popover(); });');
        bootstrap_script_start.appendChild(bootstrap_script_function);
        document.head.appendChild(bootstrap_script_start);

        // Badges Style (schwarz/weiß)
        var missing_badges_style = document.createElement("STYLE");
        var missing_badges_text = document.createTextNode(".black_white {filter: url(\"data:image/svg xml; nowhitespace: afterproperty;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale\"); filter: gray; -webkit-filter: grayscale(100%); -webkit-transition: all .6s ease; -webkit-backface-visibility: hidden; } .black_white:hover {filter: none; -webkit-filter: grayscale(0%);}");
        missing_badges_style.appendChild(missing_badges_text);
        document.head.appendChild(missing_badges_style);

        var url_path = window.location.pathname;
        var url_array = url_path.split("/");
        var url_array_lenght = url_array.length - 1;
        var url_switch = url_array[url_array_lenght];

        // url_array[123]
        // 0 - leer
        // 1 - m
        // 2 - *Username*
        // 3 - Kategorie

        if(url_array[3] == 'badges') {

            // Funktion - Badge einfügen
            function insert_badge(name, desc, img_badge, img_platzhalter) {
                if(munzee_setting_badge_show == 'Platzhalter') {
                    return '<li class="badge-helper-inserts" data-container="body" data-toggle="popover" data-placement="top" data-trigger="hover" data-html="true" data-title="' + name + '" data-content="<div class=\'badge-desc\'>' + desc + '</div>" data-original-title="' + name + '" title="' + name + '"><img src="https://munzee.global.ssl.fastly.net/images/new_badges/small/' + img_platzhalter + '.png" class="black_white"> <p class="name">' + name + '</p> </li>';
                } else if(munzee_setting_badge_show == 'Badges') {
                    return '<li class="badge-helper-inserts" data-container="body" data-toggle="popover" data-placement="top" data-trigger="hover" data-html="true" data-title="' + name + '" data-content="<div class=\'badge-desc\'>' + desc + '</div>" data-original-title="' + name + '" title="' + name + '"><img src="https://munzee.global.ssl.fastly.net/images/new_badges/small/' + img_badge + '.png" class="black_white"> <p class="name">' + name + '</p> </li>';
                } else {
                    return '';
                }
            }

            // Fehlende Badges anzeigen
            var badge_category = '';
            var badge_category_before1 = '';
            var badge_category_before2 = '';
            var badge_category_before3 = '';
            var badge_category_count = 0;
            var badge_category_count_inserts = 0;
            var missing_badges0 = document.getElementsByClassName('badge-category');
            for(var mb = 0, missing_badges; !!(missing_badges=missing_badges0[mb]); mb++) {
                badge_category_before3 = badge_category_before2;
                badge_category_before2 = badge_category_before1;
                badge_category_before1 = badge_category;
                badge_category = missing_badges.innerHTML;
                badge_category_count = mb + badge_category_count_inserts;
                var replace_link = '';

                // Badges / Platzhalter umschalten
                var badge_preview_link = '';
                var badge_preview_link_inserts = '';
                if(munzee_setting_badge_show == 'Platzhalter') {
                    badge_preview_link = '<div style="float:right; cursor: pointer;" id="save_settings_showbadges' + badge_category_count + '">Show Badges</div>';
                    missing_badges.insertAdjacentHTML('beforebegin', badge_preview_link);
                    document.getElementById('save_settings_showbadges' + badge_category_count).addEventListener("click", save_settings_showbadges, false);
                } else {
                    badge_preview_link = '<div style="float:right; cursor: pointer;" id="save_settings_hidebadges' + badge_category_count + '">Hide Badges</div>';
                    missing_badges.insertAdjacentHTML('beforebegin', badge_preview_link);
                    document.getElementById('save_settings_hidebadges' + badge_category_count).addEventListener("click", save_settings_hidebadges, false);
                }

                if(badge_category == 'Capture Badges') {
                    var badge_capture_innerHTML = document.getElementsByClassName('list-inline')[badge_category_count];
                    if(dev == 1) { missing_badges.innerHTML = badge_category_count + '. ' + missing_badges.innerHTML; }

                    // todo

                }

                else if(badge_category == 'Mythological Badges') {
                    var badge_myth_innerHTML = document.getElementsByClassName('list-inline')[badge_category_count];
                    if(dev == 1) { missing_badges.innerHTML = badge_category_count + '. ' + missing_badges.innerHTML; }

                    // Unicorn
                    var badge_myth_unicorn500 = insert_badge('Fourth Class Unicorn Soldier', 'Capture 500 unique Unicorn Munzees', 'unicorn500', 'unicorn100_null');
                    var badge_myth_unicorn1000 = insert_badge('Fifth Class Unicorn General', 'Capture 1000 unique Unicorn Munzees', 'unicorn1000', 'unicorn100_null');
                    var badge_myth_unicorn1500 = insert_badge('Sixth Class Unicorn Master', 'Capture 1500 unique Unicorn Munzees', 'unicorn1500', 'unicorn100_null');

                    // Leprechaun
                    var badge_myth_leprechaun500 = insert_badge('Fourth Class Leprechaun Soldier', 'Capture 500 unique Leprechaun Munzees', 'leprechaun500', 'leprechaun100_null');
                    var badge_myth_leprechaun1000 = insert_badge('Fifth Class Leprechaun General', 'Capture 1000 unique Leprechaun Munzees', 'leprechaun1000', 'leprechaun100_null');
                    var badge_myth_leprechaun1500 = insert_badge('Sixth Class Leprechaun Master', 'Capture 1500 unique Leprechaun Munzees', 'leprechaun1500', 'leprechaun100_null');

                    // Dragon
                    var badge_myth_dragon500 = insert_badge('Fourth Class Dragon Soldier', 'Capture 500 unique Dragon Munzees', 'dragon500', 'dragon100_null');
                    var badge_myth_dragon1000 = insert_badge('Fifth Class Dragon General', 'Capture 1000 unique Dragon Munzees', 'dragon1000', 'dragon100_null');
                    var badge_myth_dragon1500 = insert_badge('Sixth Class Dragon Master', 'Capture 1500 unique Dragon Munzees', 'dragon1500', 'dragon100_null');

                    // Yeti
                    var badge_myth_yeti500 = insert_badge('Fourth Class Yeti Soldier', 'Capture 500 unique Yeti Munzees', 'yeti500', 'cyeti3_null');
                    var badge_myth_yeti1000 = insert_badge('Fifth Class Yeti General', 'Capture 1000 unique Yeti Munzees', 'yeti1000', 'cyeti3_null');
                    var badge_myth_yeti1500 = insert_badge('Sixth Class Yeti Master', 'Capture 1500 unique Yeti Munzees', 'yeti1500', 'cyeti3_null');

                    // Faun
                    var badge_myth_faun500 = insert_badge('Polis Faun General', 'Capture 500 unique Faun Munzees', 'faun500', 'faunl3_null');
                    var badge_myth_faun1000 = insert_badge('Kingdom Faun Commander', 'Capture 1000 unique Faun Munzees', 'faun1000', 'faunl3_null');
                    var badge_myth_faun1500 = insert_badge('Imperial Faun Master', 'Capture 1500 unique Faun Munzees', 'faun1500', 'faunl3_null');

                    // Hydra
                    var badge_myth_hydra500 = insert_badge('Polis Hydra General', 'Capture 500 unique Hydra Munzees', 'hydra500', 'hydral3_null');
                    var badge_myth_hydra1000 = insert_badge('Kingdom Hydra Commander', 'Capture 1000 unique Hydra Munzees', 'hydra1000', 'hydral3_null');
                    var badge_myth_hydra1500 = insert_badge('Imperial Hydra Master', 'Capture 1500 unique Hydra Munzees', 'hydra1500', 'hydral3_null');

                    // Pegasus
                    var badge_myth_pegasus500 = insert_badge('Polis Pegasus General', 'Capture 500 unique Pegasus Munzees', 'pegasus500', 'pegasusl3_null');
                    var badge_myth_pegasus1000 = insert_badge('Kingdom Pegasus Commander', 'Capture 1000 unique Pegasus Munzees', 'pegasus1000', 'pegasusl3_null');
                    var badge_myth_pegasus1500 = insert_badge('Imperial Pegasus Master', 'Capture 1500 unique Pegasus Munzees', 'pegasus1500', 'pegasusl3_null');

                    // Cyclops
                    var badge_myth_cyclops500 = insert_badge('Polis Cyclops General', 'Capture 500 unique Cyclops Munzees', 'cycl4', 'cycl4_null');
                    var badge_myth_cyclops1000 = insert_badge('Kingdom Cyclops Commander', 'Capture 1000 unique Cyclops Munzees', 'cycl5', 'cycl5_null');
                    var badge_myth_cyclops1500 = insert_badge('Imperial Cyclops Master', 'Capture 1500 unique Cyclops Munzees', 'cycl6', 'cycl6_null');

                    // Mermaid
                    var badge_myth_mermaid500 = insert_badge('Maritime Mermaid General', 'Capture 500 unique Mermaid Munzees', 'merm4', 'merm4_null');
                    var badge_myth_mermaid1000 = insert_badge('Naval Mermaid Commander', 'Capture 1000 unique Mermaid Munzees', 'merm5', 'merm5_null');
                    var badge_myth_mermaid1500 = insert_badge('Imperial Mermaid Master', 'Capture 1500 unique Mermaid Munzees', 'merm6', 'merm6_null');

                    // Fairy
                    var badge_myth_fairy500 = insert_badge('Faithful Fairy General', 'Capture 500 unique Fairy Munzees', 'fer4', 'fer3_null');
                    var badge_myth_fairy1000 = insert_badge('Kingdom Fairy Commander', 'Capture 1000 unique Fairy Munzees', 'fer5', 'fer3_null');
                    var badge_myth_fairy1500 = insert_badge('Imperial Fairy Master', 'Capture 1500 unique Fairy Munzees', 'fer6', 'fer3_null');

                    // Banshee
                    var badge_myth_banshee500 = insert_badge('Brittle Banshee General', 'Capture 500 unique Banshee Munzees', 'bansh4', 'bansh3_null');
                    var badge_myth_banshee1000 = insert_badge('Kingdom Banshee Commander', 'Capture 1000 unique Banshee Munzees', 'bansh5', 'bansh3_null');
                    var badge_myth_banshee1500 = insert_badge('Imperial Banshee Master', 'Capture 1500 unique Banshee Munzees', 'bansh6', 'bansh3_null');

                    // Nymph
                    var badge_myth_nymph500 = insert_badge('Polis Nymph General', 'Capture 500 unique Nymph Munzees', 'nymph4', 'nymph3_null');
                    var badge_myth_nymph1000 = insert_badge('Kingdom Nymph Commander', 'Capture 1000 unique Nymph Munzees', 'nymph5', 'nymph3_null');
                    var badge_myth_nymph1500 = insert_badge('Imperial Nymph Master', 'Capture 1500 unique Nymph Munzees', 'nymph6', 'nymph3_null');


                    var badge_myth0 = badge_myth_innerHTML.getElementsByClassName('badge-helper');
                    var badge_myth0_length = badge_myth0.length;
                    var badge_myth_text_now = '';
                    var badge_myth_text_before = '';
                    var badge_myth_exist_array = [];
                    for(var bm = 0, badge_myth; !!(badge_myth=badge_myth0[bm]); bm++) {
                        badge_myth_text_now = badge_myth.getAttribute("data-title");

                        if(badge_myth_text_now == 'First Class Leprechaun Finder') {
                            if(badge_myth_text_before == 'Fifth Class Unicorn General') {
                                badge_myth.insertAdjacentHTML('beforebegin', badge_myth_unicorn1500);
                            } else {
                                if(badge_myth_text_before == 'Fourth Class Unicorn Soldier') {
                                    badge_myth.insertAdjacentHTML('beforebegin', badge_myth_unicorn1000 + badge_myth_unicorn1500);
                                } else {
                                    if(badge_myth_text_before == 'Third Class Unicorn Trainer') {
                                        badge_myth.insertAdjacentHTML('beforebegin', badge_myth_unicorn500 + badge_myth_unicorn1000 + badge_myth_unicorn1500);
                                    }
                                }
                            }
                        }

                        if(badge_myth_text_now == 'First Class Dragon Finder') {
                            if(badge_myth_text_before == 'Fifth Class Leprechaun General') {
                                badge_myth.insertAdjacentHTML('beforebegin', badge_myth_leprechaun1500);
                            } else {
                                if(badge_myth_text_before == 'Fourth Class Leprechaun Soldier') {
                                    badge_myth.insertAdjacentHTML('beforebegin', badge_myth_leprechaun1000 + badge_myth_leprechaun1500);
                                } else {
                                    if(badge_myth_text_before == 'Third Class Leprechaun Trainer') {
                                        badge_myth.insertAdjacentHTML('beforebegin', badge_myth_leprechaun500 + badge_myth_leprechaun1000 + badge_myth_leprechaun1500);
                                    }
                                }
                            }
                        }

                        if(badge_myth_text_now == 'First Class Yeti Finder') {
                            if(badge_myth_text_before == 'Fifth Class Dragon General') {
                                badge_myth.insertAdjacentHTML('beforebegin', badge_myth_dragon1500);
                            } else {
                                if(badge_myth_text_before == 'Fourth Class Dragon Soldier') {
                                    badge_myth.insertAdjacentHTML('beforebegin', badge_myth_dragon1000 + badge_myth_dragon1500);
                                } else {
                                    if(badge_myth_text_before == 'Third Class Dragon Trainer') {
                                        badge_myth.insertAdjacentHTML('beforebegin', badge_myth_dragon500 + badge_myth_dragon1000 + badge_myth_dragon1500);
                                    }
                                }
                            }
                        }

                        if(badge_myth_text_now == 'Hoplite Faun Finder') {
                            if(badge_myth_text_before == 'Fifth Class Yeti General') {
                                badge_myth.insertAdjacentHTML('beforebegin', badge_myth_yeti1500);
                            } else {
                                if(badge_myth_text_before == 'Fourth Class Yeti Soldier') {
                                    badge_myth.insertAdjacentHTML('beforebegin', badge_myth_yeti1000 + badge_myth_yeti1500);
                                } else {
                                    if(badge_myth_text_before == 'Third Class Yeti Trainer') {
                                        badge_myth.insertAdjacentHTML('beforebegin', badge_myth_yeti500 + badge_myth_yeti1000 + badge_myth_yeti1500);
                                    }
                                }
                            }
                        }

                        if(badge_myth_text_now == 'Hoplite Hydra Finder') {
                            if(badge_myth_text_before == 'Kingdom Faun Commander') {
                                badge_myth.insertAdjacentHTML('beforebegin', badge_myth_faun1500);
                            } else {
                                if(badge_myth_text_before == 'Polis Faun General') {
                                    badge_myth.insertAdjacentHTML('beforebegin', badge_myth_faun1000 + badge_myth_faun1500);
                                } else {
                                    if(badge_myth_text_before == 'Brigadier Faun Trainer') {
                                        badge_myth.insertAdjacentHTML('beforebegin', badge_myth_faun500 + badge_myth_faun1000 + badge_myth_faun1500);
                                    }
                                }
                            }
                        }

                        if(badge_myth_text_now == 'Hoplite Pegasus Finder') {
                            if(badge_myth_text_before == 'Kingdom Hydra Commander') {
                                badge_myth.insertAdjacentHTML('beforebegin', badge_myth_hydra1500);
                            } else {
                                if(badge_myth_text_before == 'Polis Hydra General') {
                                    badge_myth.insertAdjacentHTML('beforebegin', badge_myth_hydra1000 + badge_myth_hydra1500);
                                } else {
                                    if(badge_myth_text_before == 'Brigadier Hydra Trainer') {
                                        badge_myth.insertAdjacentHTML('beforebegin', badge_myth_hydra500 + badge_myth_hydra1000 + badge_myth_hydra1500);
                                    }
                                }
                            }
                        }

                        if(badge_myth_text_now == 'Hoplite Cyclops Finder') {
                            if(badge_myth_text_before == 'Kingdom Pegasus Commander') {
                                badge_myth.insertAdjacentHTML('beforebegin', badge_myth_pegasus1500);
                            } else {
                                if(badge_myth_text_before == 'Polis Pegasus General') {
                                    badge_myth.insertAdjacentHTML('beforebegin', badge_myth_pegasus1000 + badge_myth_pegasus1500);
                                } else {
                                    if(badge_myth_text_before == 'Brigadier Pegasus Trainer') {
                                        badge_myth.insertAdjacentHTML('beforebegin', badge_myth_pegasus500 + badge_myth_pegasus1000 + badge_myth_pegasus1500);
                                    }
                                }
                            }
                        }

                        if(badge_myth_text_now == 'Aquatic Mermaid Finder') {
                            if(badge_myth_text_before == 'Kingdom Cyclops Commander') {
                                badge_myth.insertAdjacentHTML('beforebegin', badge_myth_cyclops1500);
                            } else {
                                if(badge_myth_text_before == 'Polis Cyclops General') {
                                    badge_myth.insertAdjacentHTML('beforebegin', badge_myth_cyclops1000 + badge_myth_cyclops1500);
                                } else {
                                    if(badge_myth_text_before == 'Brigadier Cyclops Trainer') {
                                        badge_myth.insertAdjacentHTML('beforebegin', badge_myth_cyclops500 + badge_myth_cyclops1000 + badge_myth_cyclops1500);
                                    }
                                }
                            }
                        }

                        if(badge_myth_text_now == 'Frolicking Fairy Finder') {
                            if(badge_myth_text_before == 'Naval Mermaid Commander') {
                                badge_myth.insertAdjacentHTML('beforebegin', badge_myth_mermaid1500);
                            } else {
                                if(badge_myth_text_before == 'Maritime Mermaid General') {
                                    badge_myth.insertAdjacentHTML('beforebegin', badge_myth_mermaid1000 + badge_myth_mermaid1500);
                                } else {
                                    if(badge_myth_text_before == 'Oceanic Mermaid Trainer') {
                                        badge_myth.insertAdjacentHTML('beforebegin', badge_myth_mermaid500 + badge_myth_mermaid1000 + badge_myth_mermaid1500);
                                    }
                                }
                            }
                        }

                        if(badge_myth_text_now == 'Bashful Banshee Finder') {
                            if(badge_myth_text_before == 'Kingdom Fairy Commander') {
                                badge_myth.insertAdjacentHTML('beforebegin', badge_myth_fairy1500);
                            } else {
                                if(badge_myth_text_before == 'Faithful Fairy General') {
                                    badge_myth.insertAdjacentHTML('beforebegin', badge_myth_fairy1000 + badge_myth_fairy1500);
                                } else {
                                    if(badge_myth_text_before == 'Fantastic Fairy Trainer') {
                                        badge_myth.insertAdjacentHTML('beforebegin', badge_myth_fairy500 + badge_myth_fairy1000 + badge_myth_fairy1500);
                                    }
                                }
                            }
                        }

                        if(badge_myth_text_now == 'Naive Nymph Finder') {
                            if(badge_myth_text_before == 'Kingdom Banshee Commander') {
                                badge_myth.insertAdjacentHTML('beforebegin', badge_myth_banshee1500);
                            } else {
                                if(badge_myth_text_before == 'Brittle Banshee General') {
                                    badge_myth.insertAdjacentHTML('beforebegin', badge_myth_banshee1000 + badge_myth_banshee1500);
                                } else {
                                    if(badge_myth_text_before == 'Brackish Banshee Trainer') {
                                        badge_myth.insertAdjacentHTML('beforebegin', badge_myth_banshee500 + badge_myth_banshee1000 + badge_myth_banshee1500);
                                    }
                                }
                            }
                        }

                        if(badge_myth_text_now == '??? Finder') {
                            if(badge_myth_text_before == 'Kingdom Nymph Commander') {
                                badge_myth.insertAdjacentHTML('beforebegin', badge_myth_nymph1500);
                            } else {
                                if(badge_myth_text_before == 'Polis Nymph General') {
                                    badge_myth.insertAdjacentHTML('beforebegin', badge_myth_nymph1000 + badge_myth_nymph1500);
                                } else {
                                    if(badge_myth_text_before == 'Natural Nymph Trainer') {
                                        badge_myth.insertAdjacentHTML('beforebegin', badge_myth_nymph500 + badge_myth_nymph1000 + badge_myth_nymph1500);
                                    }
                                }
                            }
                        }

                        badge_myth_exist_array.push(badge_myth_text_now);
                        badge_myth_text_before = badge_myth_text_now;
                    }

                    // Myth nach letztem Badge ausgeben - aktuell Nymph
                    var badge_myth_exist_array_last = badge_myth_exist_array[badge_myth_exist_array.length - 1];
                    if(badge_myth_exist_array_last == 'Natural Nymph Trainer') {
                        badge_myth_innerHTML.getElementsByClassName('badge-helper')[badge_myth0.length - 1].insertAdjacentHTML('afterend', badge_myth_nymph500 + badge_myth_nymph1000 + badge_myth_nymph1500);
                    } else {
                        if(badge_myth_exist_array_last == 'Polis Nymph General') {
                            badge_myth_innerHTML.getElementsByClassName('badge-helper')[badge_myth0.length - 1].insertAdjacentHTML('afterend', badge_myth_nymph1000 + badge_myth_nymph1500);
                        } else {
                            if(badge_myth_exist_array_last == 'Kingdom Nymph Commander') {
                                badge_myth_innerHTML.getElementsByClassName('badge-helper')[badge_myth0.length - 1].insertAdjacentHTML('afterend', badge_myth_nymph1500);
                            }
                        }
                    }

                }

                else if(badge_category == 'Pouch Creatures Badges') {
                    var badge_pouch_innerHTML = document.getElementsByClassName('list-inline')[badge_category_count];
                    if(dev == 1) { missing_badges.innerHTML = badge_category_count + '. ' + missing_badges.innerHTML; }

                    // Tuli
                    var badge_pouch_tuli50 = insert_badge('Silver Tuli Searcher', 'Capture 50 Unique Tuli Pouch Creature Munzees', 'tuli50', 'tuli50_null');
                    var badge_pouch_tuli100 = insert_badge('Gold Tuli Specialist', 'Capture 100 Unique Tuli Pouch Creature Munzees', 'tuli100', 'tuli100_null');
                    var badge_pouch_tulimber50 = insert_badge('Silver Tulimber Searcher', 'Capture 50 Unique Tulimber Pouch Creature Munzees', 'tulimber50', 'tulimber50_null');
                    var badge_pouch_tulimber100 = insert_badge('Gold Tulimber Specialist', 'Capture 100 Unique Tulimber Pouch Creature Munzees', 'tulimber100', 'tulimber100_null');
                    var badge_pouch_tuliferno50 = insert_badge('Silver Tuliferno Searcher', 'Capture 50 Unique Tuliferno Pouch Creature Munzees', 'tuliferno50', 'tuliferno50_null');
                    var badge_pouch_tuliferno100 = insert_badge('Gold Tuliferno Specialist', 'Capture 100 Unique Tuliferno Pouch Creature Munzees', 'tuliferno100', 'tuliferno100_null');

                    // Vesi
                    var badge_pouch_vesi50 = insert_badge('Silver Vesi Searcher', 'Capture 50 Unique Vesi Pouch Creature Munzees', 'vesi50', 'vesi50_null');
                    var badge_pouch_vesi100 = insert_badge('Gold Vesi Specialist', 'Capture 100 Unique Vesi Pouch Creature Munzees', 'vesi100', 'vesi100_null');
                    var badge_pouch_vesial50 = insert_badge('Silver Vesial Searcher', 'Capture 50 Unique Vesial Pouch Creature Munzees', 'vesial50', 'vesial50_null');
                    var badge_pouch_vesial100 = insert_badge('Gold Vesial Specialist', 'Capture 100 Unique Vesial Pouch Creature Munzees', 'vesial100', 'vesial100_null');
                    var badge_pouch_vesisaur50 = insert_badge('Silver Vesisaur Searcher', 'Capture 50 Unique Vesisaur Pouch Creature Munzees', 'vesisaur50', 'vesisaur50_null');
                    var badge_pouch_vesisaur100 = insert_badge('Gold Vesisaur Specialist', 'Capture 100 Unique Vesisaur Pouch Creature Munzees', 'vesisaur100', 'vesisaur100_null');

                    // Muru
                    var badge_pouch_muru50 = insert_badge('Silver Muru Searcher', 'Capture 50 Unique Muru Pouch Creature Munzees', 'muru50', 'muru50_null');
                    var badge_pouch_muru100 = insert_badge('Gold Muru Specialist', 'Capture 100 Unique Muru Pouch Creature Munzees', 'muru100', 'muru100_null');
                    var badge_pouch_muruchi50 = insert_badge('Silver Muruchi Searcher', 'Capture 50 Unique Muruchi Pouch Creature Munzees', 'muruchi50', 'muruchi50_null');
                    var badge_pouch_muruchi100 = insert_badge('Gold Muruchi Specialist', 'Capture 100 Unique Muruchi Pouch Creature Munzees', 'muruchi100', 'muruchi100_null');
                    var badge_pouch_murutain50 = insert_badge('Silver Murutain Searcher', 'Capture 50 Unique Murutain Pouch Creature Munzees', 'murutain50', 'murutain50_null');
                    var badge_pouch_murutain100 = insert_badge('Gold Murutain Specialist', 'Capture 100 Unique Murutain Pouch Creature Munzees', 'murutain100', 'murutain100_null');

                    // Hadavale (MHQ Pouch)
                    var badge_pouch_hadavale5 = insert_badge('Silver Hadavale Searcher', 'Capture 5 Unique Hadavale Pouch Creature Munzees', 'hada5', 'hada5_null');
                    var badge_pouch_hadavale15 = insert_badge('Gold Hadavale Specialist', 'Capture 15 Unique Hadavale Pouch Creature Munzees', 'hada15', 'hada15_null');

                    // Mitmegu + Variaten: Rohimegu, Lokemegu, Jootmegu
                    var badge_pouch_mitmegu50 = insert_badge('Silver Mitmegu Searcher', 'Capture 50 Unique Mitmegu Pouch Creature Munzees', 'mitme2', 'mitme2_null');
                    var badge_pouch_mitmegu100 = insert_badge('Gold Mitmegu Specialist', 'Capture 100 Unique Mitmegu Pouch Creature Munzees', 'mitme3', 'mitme3_null');
                    var badge_pouch_rohimegu50 = insert_badge('Silver Rohimegu Searcher', 'Capture 50 Unique Rohimegu Pouch Creature Munzees', 'rohi2', 'rohi2_null');
                    var badge_pouch_rohimegu100 = insert_badge('Gold Rohimegu Specialist', 'Capture 100 Unique Rohimegu Pouch Creature Munzees', 'rohi3', 'rohi3_null');
                    var badge_pouch_lokemegu50 = insert_badge('Silver Lokemegu Searcher', 'Capture 50 Unique Lokemegu Pouch Creature Munzees', 'loke2', 'loke2_null');
                    var badge_pouch_lokemegu100 = insert_badge('Gold Lokemegu Specialist', 'Capture 100 Unique Lokemegu Pouch Creature Munzees', 'loke3', 'loke3_null');
                    var badge_pouch_jootmegu50 = insert_badge('Silver Jootmegu Searcher', 'Capture 50 Unique Jootmegu Pouch Creature Munzees', 'joot2', 'joot2_null');
                    var badge_pouch_jootmegu100 = insert_badge('Gold Jootmegu Specialist', 'Capture 100 Unique Jootmegu Pouch Creature Munzees', 'joot3', 'joot3_null');

                    // Pimedus
                    var badge_pouch_pimedus50 = insert_badge('Silver Pimedus Searcher', 'Capture 50 Unique Pimedus Pouch Creature Munzees', 'pimedus2', 'pimedus2_null');
                    var badge_pouch_pimedus100 = insert_badge('Gold Pimedus Specialist', 'Capture 100 Unique Pimedus Pouch Creature Munzees', 'pimedus3', 'pimedus3_null');

                    // Puffle
                    var badge_pouch_puffle50 = insert_badge('Silver Puffle Searcher', 'Capture 50 Unique Puffle Pouch Creature Munzees', 'puffle50', 'puffle50_null');
                    var badge_pouch_puffle100 = insert_badge('Gold Puffle Specialist', 'Capture 100 Unique Puffle Pouch Creature Munzees', 'puffle100', 'puffle100_null');
                    var badge_pouch_pufrain50 = insert_badge('Silver Pufrain Searcher', 'Capture 50 Unique Pufrain Pouch Creature Munzees', 'pufrain50', 'pufrain50_null');
                    var badge_pouch_pufrain100 = insert_badge('Gold Pufrain Specialist', 'Capture 100 Unique Pufrain Pouch Creature Munzees', 'pufrain100', 'pufrain100_null');
                    var badge_pouch_puflawn50 = insert_badge('Silver Puflawn Searcher', 'Capture 50 Unique Puflawn Pouch Creature Munzees', 'puflawn50', 'puflawn50_null');
                    var badge_pouch_puflawn100 = insert_badge('Gold Puflawn Specialist', 'Capture 100 Unique Puflawn Pouch Creature Munzees', 'puflawn100', 'puflawn100_null');

                    // Magnetus
                    var badge_pouch_magnetus50 = insert_badge('Silver Magnetus Searcher', 'Capture 50 Unique Magnetus Pouch Creature Munzees', 'magnetus2', 'magnetus2_null');
                    var badge_pouch_magnetus100 = insert_badge('Gold Magnetus Specialist', 'Capture 100 Unique Magnetus Pouch Creature Munzees', 'magnetus3', 'magnetus3_null');


                    var badge_pouch0 = badge_pouch_innerHTML.getElementsByClassName('badge-helper');
                    var badge_pouch0_length = badge_pouch0.length;
                    var badge_pouch_text_now = '';
                    var badge_pouch_text_before = '';
                    var badge_pouch_exist_array = [];
                    for(var bp = 0, badge_pouch; !!(badge_pouch=badge_pouch0[bp]); bp++) {
                        badge_pouch_text_now = badge_pouch.getAttribute("data-title");

                        if(badge_pouch_text_now == 'Bronze Tulimber Scout') {
                            if(badge_pouch_text_before == 'Silver Tuli Searcher') {
                                badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_tuli100);
                            } else {
                                if(badge_pouch_text_before == 'Bronze Tuli Scout') {
                                    badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_tuli50 + badge_pouch_tuli100);
                                }
                            }
                        }

                        if(badge_pouch_text_now == 'Bronze Tuliferno Scout') {
                            if(badge_pouch_text_before == 'Silver Tulimber Searcher') {
                                badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_tulimber100);
                            } else {
                                if(badge_pouch_text_before == 'Bronze Tulimber Scout') {
                                    badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_tulimber50 + badge_pouch_tulimber100);
                                }
                            }
                        }

                        if(badge_pouch_text_now == 'Bronze Vesi Scout') {
                            if(badge_pouch_text_before == 'Silver Tuliferno Searcher') {
                                badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_tuliferno100);
                            } else {
                                if(badge_pouch_text_before == 'Bronze Tuliferno Scout') {
                                    badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_tuliferno50 + badge_pouch_tuliferno100);
                                }
                            }
                        }

                        if(badge_pouch_text_now == 'Bronze Vesial Scout') {
                            if(badge_pouch_text_before == 'Silver Vesi Searcher') {
                                badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_vesi100);
                            } else {
                                if(badge_pouch_text_before == 'Bronze Vesi Scout') {
                                    badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_vesi50 + badge_pouch_vesi100);
                                }
                            }
                        }

                        if(badge_pouch_text_now == 'Bronze Vesisaur Scout') {
                            if(badge_pouch_text_before == 'Silver Vesial Searcher') {
                                badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_vesial100);
                            } else {
                                if(badge_pouch_text_before == 'Bronze Vesial Scout') {
                                    badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_vesial50 + badge_pouch_vesial100);
                                }
                            }
                        }

                        if(badge_pouch_text_now == 'Bronze Muru Scout') {
                            if(badge_pouch_text_before == 'Silver Vesisaur Searcher') {
                                badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_vesisaur100);
                            } else {
                                if(badge_pouch_text_before == 'Bronze Vesisaur Scout') {
                                    badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_vesisaur50 + badge_pouch_vesisaur100);
                                }
                            }
                        }

                        if(badge_pouch_text_now == 'Bronze Muruchi Scout') {
                            if(badge_pouch_text_before == 'Silver Muru Searcher') {
                                badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_muru100);
                            } else {
                                if(badge_pouch_text_before == 'Bronze Muru Scout') {
                                    badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_muru50 + badge_pouch_muru100);
                                }
                            }
                        }

                        if(badge_pouch_text_now == 'Bronze Murutain Scout') {
                            if(badge_pouch_text_before == 'Silver Muruchi Searcher') {
                                badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_muruchi100);
                            } else {
                                if(badge_pouch_text_before == 'Bronze Muruchi Scout') {
                                    badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_muruchi50 + badge_pouch_muruchi100);
                                }
                            }
                        }

                        if(badge_pouch_text_now == 'Bronze Hadavale Scout') {
                            if(badge_pouch_text_before == 'Silver Murutain Searcher') {
                                badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_murutain100);
                            } else {
                                if(badge_pouch_text_before == 'Bronze Murutain Scout') {
                                    badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_murutain50 + badge_pouch_murutain100);
                                }
                            }
                        }

                        if(badge_pouch_text_now == 'Bronze Mitmegu Scout') {
                            if(badge_pouch_text_before == 'Silver Hadavale Searcher') {
                                badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_hadavale15);
                            } else {
                                if(badge_pouch_text_before == 'Bronze Hadavale Scout') {
                                    badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_hadavale5 + badge_pouch_hadavale15);
                                }
                            }
                        }

                        if(badge_pouch_text_now == 'Bronze Rohimegu Scout') {
                            if(badge_pouch_text_before == 'Silver Mitmegu Searcher') {
                                badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_mitmegu100);
                            } else {
                                if(badge_pouch_text_before == 'Bronze Mitmegu Scout') {
                                    badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_mitmegu50 + badge_pouch_mitmegu100);
                                }
                            }
                        }

                        if(badge_pouch_text_now == 'Bronze Lokemegu Scout') {
                            if(badge_pouch_text_before == 'Silver Rohimegu Searcher') {
                                badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_rohimegu100);
                            } else {
                                if(badge_pouch_text_before == 'Bronze Rohimegu Scout') {
                                    badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_rohimegu50 + badge_pouch_rohimegu100);
                                }
                            }
                        }

                        if(badge_pouch_text_now == 'Bronze Jootmegu Scout') {
                            if(badge_pouch_text_before == 'Silver Lokemegu Searcher') {
                                badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_lokemegu100);
                            } else {
                                if(badge_pouch_text_before == 'Bronze Lokemegu Scout') {
                                    badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_lokemegu50 + badge_pouch_lokemegu100);
                                }
                            }
                        }

                        if(badge_pouch_text_now == 'Bronze Pimedus Scout') {
                            if(badge_pouch_text_before == 'Silver Jootmegu Searcher') {
                                badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_jootmegu100);
                            } else {
                                if(badge_pouch_text_before == 'Bronze Jootmegu Scout') {
                                    badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_jootmegu50 + badge_pouch_jootmegu100);
                                }
                            }
                        }

                        if(badge_pouch_text_now == 'Bronze Puffle Scout') {
                            if(badge_pouch_text_before == 'Silver Pimedus Searcher') {
                                badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_pimedus100);
                            } else {
                                if(badge_pouch_text_before == 'Bronze Pimedus Scout') {
                                    badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_pimedus50 + badge_pouch_pimedus100);
                                }
                            }
                        }

                        if(badge_pouch_text_now == 'Bronze Pufrain Scout') {
                            if(badge_pouch_text_before == 'Silver Puffle Searcher') {
                                badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_puffle100);
                            } else {
                                if(badge_pouch_text_before == 'Bronze Puffle Scout') {
                                    badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_puffle50 + badge_pouch_puffle100);
                                }
                            }
                        }

                        if(badge_pouch_text_now == 'Bronze Puflawn Scout') {
                            if(badge_pouch_text_before == 'Silver Pufrain Searcher') {
                                badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_pufrain100);
                            } else {
                                if(badge_pouch_text_before == 'Bronze Pufrain Scout') {
                                    badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_pufrain50 + badge_pouch_pufrain100);
                                }
                            }
                        }

                        if(badge_pouch_text_now == 'Bronze Magnetus Scout') {
                            if(badge_pouch_text_before == 'Silver Puflawn Searcher') {
                                badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_puflawn100);
                            } else {
                                if(badge_pouch_text_before == 'Bronze Puflawn Scout') {
                                    badge_pouch.insertAdjacentHTML('beforebegin', badge_pouch_puflawn50 + badge_pouch_puflawn100);
                                }
                            }
                        }

                        badge_pouch_exist_array.push(badge_pouch_text_now);
                        badge_pouch_text_before = badge_pouch_text_now;
                    }


                    // Pouch nach letztem Badge ausgeben - aktuell Magnetus
                    var badge_pouch_exist_array_last = badge_pouch_exist_array[badge_pouch_exist_array.length - 1];
                    if(badge_pouch_exist_array_last == 'Bronze Magnetus Scout') {
                        badge_pouch_innerHTML.getElementsByClassName('badge-helper')[badge_pouch0.length - 1].insertAdjacentHTML('afterend', badge_pouch_magnetus50 + badge_pouch_magnetus100);
                    } else {
                        if(badge_pouch_exist_array_last == 'Silver Magnetus Searcher') {
                            badge_pouch_innerHTML.getElementsByClassName('badge-helper')[badge_pouch0.length - 1].insertAdjacentHTML('afterend', badge_pouch_magnetus100);
                        }
                    }

                }

                else if(badge_category == 'Deploy Badges') {
                    var badge_deploy_innerHTML = document.getElementsByClassName('list-inline')[badge_category_count];
                    if(dev == 1) { missing_badges.innerHTML = badge_category_count + '. ' + missing_badges.innerHTML; }

                    // todo

                }

                else if(badge_category == 'Munzee Badges') {
                    var badge_munzee_innerHTML = document.getElementsByClassName('list-inline')[badge_category_count];
                    if(dev == 1) { missing_badges.innerHTML = badge_category_count + '. ' + missing_badges.innerHTML; }

                    // todo

                }

                else if(badge_category == 'Zodiacs Badges') {
                    var badge_zodiacs_innerHTML = document.getElementsByClassName('list-inline')[badge_category_count];
                    if(dev == 1) { missing_badges.innerHTML = badge_category_count + '. ' + missing_badges.innerHTML; }

                    var badge_zodiacs_scorpio = insert_badge('Scorpio', 'Capture or Deploy a Scorpio Munzee', 'scorpio', 'drum1_null');
                    var badge_zodiacs_sagittarius = insert_badge('Sagittarius', 'Capture or Deploy a Sagittarius Munzee', 'sagittarius', 'drum1_null');
                    var badge_zodiacs_capricorn = insert_badge('Capricorn', 'Capture or Deploy a Capricorn Munzee', 'capricorn', 'drum1_null');
                    var badge_zodiacs_aquarius = insert_badge('Aquarius', 'Capture or Deploy a Aquarius Munzee', 'aquarius', 'drum1_null');
                    var badge_zodiacs_pisces = insert_badge('Pisces', 'Capture or Deploy a Pisces Munzee', 'pisces', 'drum1_null');
                    var badge_zodiacs_aries = insert_badge('Aries', 'Capture or Deploy a Aries Munzee', 'aries', 'drum1_null');
                    var badge_zodiacs_taurus = insert_badge('Taurus', 'Capture or Deploy a Taurus Munzee', 'taurus', 'drum1_null');
                    var badge_zodiacs_gemini = insert_badge('Gemini', 'Capture or Deploy a Gemini Munzee', 'gemini', 'drum1_null');
                    var badge_zodiacs_cancer = insert_badge('Cancer', 'Capture or Deploy a Cancer Munzee', 'cancer', 'drum1_null');
                    var badge_zodiacs_leo = insert_badge('Leo', 'Capture or Deploy a Leo Munzee', 'leo', 'drum1_null');
                    var badge_zodiacs_virgo = insert_badge('Virgo', 'Capture or Deploy a Virgo Munzee', 'virgo', 'drum1_null');
                    var badge_zodiacs_libra = insert_badge('Libra', 'Capture or Deploy a Libra Munzee', 'libra', 'drum1_null');

                    var badge_zodiacs_dogchinesezodiac = insert_badge('Dog', 'Capture or Deploy a Dog Chinese Munzee', 'dogchinesezodiac', 'drum1_null');
                    var badge_zodiacs_pigchinesezodiac = insert_badge('Pig', 'Capture or Deploy a Pig Chinese Munzee', 'pigchinesezodiac', 'drum1_null');
                    var badge_zodiacs_ratchinesezodiac = insert_badge('Rat', 'Capture or Deploy a Rat Chinese Munzee', 'ratchinesezodiac', 'drum1_null');
                    var badge_zodiacs_oxchinesezodiac = insert_badge('Ox', 'Capture or Deploy a Ox Chinese Munzee', 'oxchinesezodiac', 'drum1_null');
                    var badge_zodiacs_tigerchinesezodiac = insert_badge('Tiger', 'Capture or Deploy a Tiger Chinese Munzee', 'tigerchinesezodiac', 'drum1_null');
                    var badge_zodiacs_rabbitchinesezodiac = insert_badge('Rabbit', 'Capture or Deploy a Rabbit Chinese Munzee', 'rabbitchinesezodiac', 'drum1_null');
                    var badge_zodiacs_dragonchinesezodiac = insert_badge('Dragon', 'Capture or Deploy a Dragon Chinese Munzee', 'dragonchinesezodiac', 'drum1_null');
                    var badge_zodiacs_snakechinesezodiac = insert_badge('Snake', 'Capture or Deploy a Snake Chinese Munzee', 'snakechinesezodiac', 'drum1_null');
                    var badge_zodiacs_horsechinesezodiac = insert_badge('Horse', 'Capture or Deploy a Horse Chinese Munzee', 'horsechinesezodiac', 'drum1_null');
                    var badge_zodiacs_goatchinesezodiac = insert_badge('Goat', 'Capture or Deploy a Goat Chinese Munzee', 'goatchinesezodiac', 'drum1_null');
                    var badge_zodiacs_monkeychinesezodiac = insert_badge('Monkey', 'Capture or Deploy a Monkey Chinese Munzee', 'monkeychinesezodiac', 'drum1_null');
                    var badge_zodiacs_roosterchinesezodiac = insert_badge('Rooster', 'Capture or Deploy a Rooster Chinese Munzee', 'roosterchinesezodiac', 'drum1_null');

                    if(!badge_zodiacs_innerHTML) {
                        missing_badges.nextElementSibling.remove();
                        missing_badges.insertAdjacentHTML('afterend', '<ul id="badges-listing" class="list-inline">' + badge_zodiacs_scorpio + badge_zodiacs_sagittarius + badge_zodiacs_capricorn + badge_zodiacs_aquarius + badge_zodiacs_pisces + badge_zodiacs_aries + badge_zodiacs_taurus + badge_zodiacs_gemini + badge_zodiacs_cancer + badge_zodiacs_leo + badge_zodiacs_virgo + badge_zodiacs_libra + badge_zodiacs_dogchinesezodiac + badge_zodiacs_pigchinesezodiac + badge_zodiacs_ratchinesezodiac + badge_zodiacs_oxchinesezodiac + badge_zodiacs_tigerchinesezodiac + badge_zodiacs_rabbitchinesezodiac + badge_zodiacs_dragonchinesezodiac + badge_zodiacs_snakechinesezodiac + badge_zodiacs_horsechinesezodiac + badge_zodiacs_goatchinesezodiac + badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac + '</ul>');
                    } else {
                        var badge_zodiacs_position = 0;
                        var badge_zodiacs_insert = '';
                        var badge_zodiacs_stop = 0;
                        var badge_zodiacs0 = badge_zodiacs_innerHTML.getElementsByClassName('badge-helper');
                        var badge_zodiacs_length = badge_zodiacs_innerHTML.getElementsByClassName('badge-helper').length;
                        for(var bz = 0, badge_zodiacs; !!(badge_zodiacs=badge_zodiacs0[bz]); bz++) {
                            var badge_zodiacs_title = badge_zodiacs.getAttribute("data-title");
                            badge_zodiacs_insert = '';
                            badge_zodiacs_stop = 0;
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 1) { if(badge_zodiacs_title != 'Scorpio') { badge_zodiacs_insert += badge_zodiacs_scorpio; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 2; } }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 2) { if(badge_zodiacs_title != 'Sagittarius') { badge_zodiacs_insert += badge_zodiacs_sagittarius; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 3; } }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 3) { if(badge_zodiacs_title != 'Capricorn') { badge_zodiacs_insert += badge_zodiacs_capricorn; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 4; } }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 4) { if(badge_zodiacs_title != 'Aquarius') { badge_zodiacs_insert += badge_zodiacs_aquarius; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 5; } }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 5) { if(badge_zodiacs_title != 'Pisces') { badge_zodiacs_insert += badge_zodiacs_pisces; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 6; } }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 6) { if(badge_zodiacs_title != 'Aries') { badge_zodiacs_insert += badge_zodiacs_aries; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 7; } }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 7) { if(badge_zodiacs_title != 'Taurus') { badge_zodiacs_insert += badge_zodiacs_taurus; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 8; } }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 8) { if(badge_zodiacs_title != 'Gemini') { badge_zodiacs_insert += badge_zodiacs_gemini; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 9; } }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 9) { if(badge_zodiacs_title != 'Cancer') { badge_zodiacs_insert += badge_zodiacs_cancer; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 10; } }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 10) { if(badge_zodiacs_title != 'Leo') { badge_zodiacs_insert += badge_zodiacs_leo; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 11; } }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 11) { if(badge_zodiacs_title != 'Virgo') { badge_zodiacs_insert += badge_zodiacs_virgo; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 12; } }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 12) { if(badge_zodiacs_title != 'Libra') { badge_zodiacs_insert += badge_zodiacs_libra; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 13; } }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 13) { if(badge_zodiacs_title != 'Dog') { badge_zodiacs_insert += badge_zodiacs_dogchinesezodiac; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 14; } }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 14) { if(badge_zodiacs_title != 'Pig') { badge_zodiacs_insert += badge_zodiacs_pigchinesezodiac; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 15; } }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 15) { if(badge_zodiacs_title != 'Rat') { badge_zodiacs_insert += badge_zodiacs_ratchinesezodiac; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 16;} }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 16) { if(badge_zodiacs_title != 'Ox') { badge_zodiacs_insert += badge_zodiacs_oxchinesezodiac; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 17;} }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 17) { if(badge_zodiacs_title != 'Tiger') { badge_zodiacs_insert += badge_zodiacs_tigerchinesezodiac; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 18;} }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 18) { if(badge_zodiacs_title != 'Rabbit') { badge_zodiacs_insert += badge_zodiacs_rabbitchinesezodiac; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 19;} }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 19) { if(badge_zodiacs_title != 'Dragon') { badge_zodiacs_insert += badge_zodiacs_dragonchinesezodiac; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 20;} }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 20) { if(badge_zodiacs_title != 'Snake') { badge_zodiacs_insert += badge_zodiacs_snakechinesezodiac; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 21;} }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 21) { if(badge_zodiacs_title != 'Horse') { badge_zodiacs_insert += badge_zodiacs_horsechinesezodiac; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 22;} }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 22) { if(badge_zodiacs_title != 'Goat') { badge_zodiacs_insert += badge_zodiacs_goatchinesezodiac; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 23;} }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 23) { if(badge_zodiacs_title != 'Monkey') { badge_zodiacs_insert += badge_zodiacs_monkeychinesezodiac; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 24;} }
                            if(badge_zodiacs_stop === 0 && badge_zodiacs_position <= 24) { if(badge_zodiacs_title != 'Rooster') { badge_zodiacs_insert += badge_zodiacs_roosterchinesezodiac; } else { badge_zodiacs_stop = 1; badge_zodiacs_position = 25;} }
                            if(badge_zodiacs_insert !== '') { badge_zodiacs.insertAdjacentHTML('beforebegin', badge_zodiacs_insert); }

                            if(badge_zodiacs_length == bz + 1) {
                                if(badge_zodiacs_title == 'Scorpio') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_sagittarius + badge_zodiacs_capricorn + badge_zodiacs_aquarius + badge_zodiacs_pisces + badge_zodiacs_aries + badge_zodiacs_taurus + badge_zodiacs_gemini + badge_zodiacs_cancer + badge_zodiacs_leo + badge_zodiacs_virgo + badge_zodiacs_libra + badge_zodiacs_dogchinesezodiac + badge_zodiacs_pigchinesezodiac + badge_zodiacs_ratchinesezodiac + badge_zodiacs_oxchinesezodiac + badge_zodiacs_tigerchinesezodiac + badge_zodiacs_rabbitchinesezodiac + badge_zodiacs_dragonchinesezodiac + badge_zodiacs_snakechinesezodiac + badge_zodiacs_horsechinesezodiac + badge_zodiacs_goatchinesezodiac + badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac); }
                                else if(badge_zodiacs_title == 'Sagittarius') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_capricorn + badge_zodiacs_aquarius + badge_zodiacs_pisces + badge_zodiacs_aries + badge_zodiacs_taurus + badge_zodiacs_gemini + badge_zodiacs_cancer + badge_zodiacs_leo + badge_zodiacs_virgo + badge_zodiacs_libra + badge_zodiacs_dogchinesezodiac + badge_zodiacs_pigchinesezodiac + badge_zodiacs_ratchinesezodiac + badge_zodiacs_oxchinesezodiac + badge_zodiacs_tigerchinesezodiac + badge_zodiacs_rabbitchinesezodiac + badge_zodiacs_dragonchinesezodiac + badge_zodiacs_snakechinesezodiac + badge_zodiacs_horsechinesezodiac + badge_zodiacs_goatchinesezodiac + badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac); }
                                else if(badge_zodiacs_title == 'Capricorn') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_aquarius + badge_zodiacs_pisces + badge_zodiacs_aries + badge_zodiacs_taurus + badge_zodiacs_gemini + badge_zodiacs_cancer + badge_zodiacs_leo + badge_zodiacs_virgo + badge_zodiacs_libra + badge_zodiacs_dogchinesezodiac + badge_zodiacs_pigchinesezodiac + badge_zodiacs_ratchinesezodiac + badge_zodiacs_oxchinesezodiac + badge_zodiacs_tigerchinesezodiac + badge_zodiacs_rabbitchinesezodiac + badge_zodiacs_dragonchinesezodiac + badge_zodiacs_snakechinesezodiac + badge_zodiacs_horsechinesezodiac + badge_zodiacs_goatchinesezodiac + badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac); }
                                else if(badge_zodiacs_title == 'Aquarius') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_pisces + badge_zodiacs_aries + badge_zodiacs_taurus + badge_zodiacs_gemini + badge_zodiacs_cancer + badge_zodiacs_leo + badge_zodiacs_virgo + badge_zodiacs_libra + badge_zodiacs_dogchinesezodiac + badge_zodiacs_pigchinesezodiac + badge_zodiacs_ratchinesezodiac + badge_zodiacs_oxchinesezodiac + badge_zodiacs_tigerchinesezodiac + badge_zodiacs_rabbitchinesezodiac + badge_zodiacs_dragonchinesezodiac + badge_zodiacs_snakechinesezodiac + badge_zodiacs_horsechinesezodiac + badge_zodiacs_goatchinesezodiac + badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac); }
                                else if(badge_zodiacs_title == 'Pisces') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_aries + badge_zodiacs_taurus + badge_zodiacs_gemini + badge_zodiacs_cancer + badge_zodiacs_leo + badge_zodiacs_virgo + badge_zodiacs_libra + badge_zodiacs_dogchinesezodiac + badge_zodiacs_pigchinesezodiac + badge_zodiacs_ratchinesezodiac + badge_zodiacs_oxchinesezodiac + badge_zodiacs_tigerchinesezodiac + badge_zodiacs_rabbitchinesezodiac + badge_zodiacs_dragonchinesezodiac + badge_zodiacs_snakechinesezodiac + badge_zodiacs_horsechinesezodiac + badge_zodiacs_goatchinesezodiac + badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac); }
                                else if(badge_zodiacs_title == 'Aries') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_taurus + badge_zodiacs_gemini + badge_zodiacs_cancer + badge_zodiacs_leo + badge_zodiacs_virgo + badge_zodiacs_libra + badge_zodiacs_dogchinesezodiac + badge_zodiacs_pigchinesezodiac + badge_zodiacs_ratchinesezodiac + badge_zodiacs_oxchinesezodiac + badge_zodiacs_tigerchinesezodiac + badge_zodiacs_rabbitchinesezodiac + badge_zodiacs_dragonchinesezodiac + badge_zodiacs_snakechinesezodiac + badge_zodiacs_horsechinesezodiac + badge_zodiacs_goatchinesezodiac + badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac); }
                                else if(badge_zodiacs_title == 'Taurus') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_gemini + badge_zodiacs_cancer + badge_zodiacs_leo + badge_zodiacs_virgo + badge_zodiacs_libra + badge_zodiacs_dogchinesezodiac + badge_zodiacs_pigchinesezodiac + badge_zodiacs_ratchinesezodiac + badge_zodiacs_oxchinesezodiac + badge_zodiacs_tigerchinesezodiac + badge_zodiacs_rabbitchinesezodiac + badge_zodiacs_dragonchinesezodiac + badge_zodiacs_snakechinesezodiac + badge_zodiacs_horsechinesezodiac + badge_zodiacs_goatchinesezodiac + badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac); }
                                else if(badge_zodiacs_title == 'Gemini') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_cancer + badge_zodiacs_leo + badge_zodiacs_virgo + badge_zodiacs_libra + badge_zodiacs_dogchinesezodiac + badge_zodiacs_pigchinesezodiac + badge_zodiacs_ratchinesezodiac + badge_zodiacs_oxchinesezodiac + badge_zodiacs_tigerchinesezodiac + badge_zodiacs_rabbitchinesezodiac + badge_zodiacs_dragonchinesezodiac + badge_zodiacs_snakechinesezodiac + badge_zodiacs_horsechinesezodiac + badge_zodiacs_goatchinesezodiac + badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac); }
                                else if(badge_zodiacs_title == 'Cancer') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_leo + badge_zodiacs_virgo + badge_zodiacs_libra + badge_zodiacs_dogchinesezodiac + badge_zodiacs_pigchinesezodiac + badge_zodiacs_ratchinesezodiac + badge_zodiacs_oxchinesezodiac + badge_zodiacs_tigerchinesezodiac + badge_zodiacs_rabbitchinesezodiac + badge_zodiacs_dragonchinesezodiac + badge_zodiacs_snakechinesezodiac + badge_zodiacs_horsechinesezodiac + badge_zodiacs_goatchinesezodiac + badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac); }
                                else if(badge_zodiacs_title == 'Leo') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_virgo + badge_zodiacs_libra + badge_zodiacs_dogchinesezodiac + badge_zodiacs_pigchinesezodiac + badge_zodiacs_ratchinesezodiac + badge_zodiacs_oxchinesezodiac + badge_zodiacs_tigerchinesezodiac + badge_zodiacs_rabbitchinesezodiac + badge_zodiacs_dragonchinesezodiac + badge_zodiacs_snakechinesezodiac + badge_zodiacs_horsechinesezodiac + badge_zodiacs_goatchinesezodiac + badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac); }
                                else if(badge_zodiacs_title == 'Virgo') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_libra + badge_zodiacs_dogchinesezodiac + badge_zodiacs_pigchinesezodiac + badge_zodiacs_ratchinesezodiac + badge_zodiacs_oxchinesezodiac + badge_zodiacs_tigerchinesezodiac + badge_zodiacs_rabbitchinesezodiac + badge_zodiacs_dragonchinesezodiac + badge_zodiacs_snakechinesezodiac + badge_zodiacs_horsechinesezodiac + badge_zodiacs_goatchinesezodiac + badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac); }
                                else if(badge_zodiacs_title == 'Libra') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_dogchinesezodiac + badge_zodiacs_pigchinesezodiac + badge_zodiacs_ratchinesezodiac + badge_zodiacs_oxchinesezodiac + badge_zodiacs_tigerchinesezodiac + badge_zodiacs_rabbitchinesezodiac + badge_zodiacs_dragonchinesezodiac + badge_zodiacs_snakechinesezodiac + badge_zodiacs_horsechinesezodiac + badge_zodiacs_goatchinesezodiac + badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac); }
                                else if(badge_zodiacs_title == 'Dog') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_pigchinesezodiac + badge_zodiacs_ratchinesezodiac + badge_zodiacs_oxchinesezodiac + badge_zodiacs_tigerchinesezodiac + badge_zodiacs_rabbitchinesezodiac + badge_zodiacs_dragonchinesezodiac + badge_zodiacs_snakechinesezodiac + badge_zodiacs_horsechinesezodiac + badge_zodiacs_goatchinesezodiac + badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac); }
                                else if(badge_zodiacs_title == 'Pig') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_ratchinesezodiac + badge_zodiacs_oxchinesezodiac + badge_zodiacs_tigerchinesezodiac + badge_zodiacs_rabbitchinesezodiac + badge_zodiacs_dragonchinesezodiac + badge_zodiacs_snakechinesezodiac + badge_zodiacs_horsechinesezodiac + badge_zodiacs_goatchinesezodiac + badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac); }
                                else if(badge_zodiacs_title == 'Rat') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_oxchinesezodiac + badge_zodiacs_tigerchinesezodiac + badge_zodiacs_rabbitchinesezodiac + badge_zodiacs_dragonchinesezodiac + badge_zodiacs_snakechinesezodiac + badge_zodiacs_horsechinesezodiac + badge_zodiacs_goatchinesezodiac + badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac); }
                                else if(badge_zodiacs_title == 'Ox') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_tigerchinesezodiac + badge_zodiacs_rabbitchinesezodiac + badge_zodiacs_dragonchinesezodiac + badge_zodiacs_snakechinesezodiac + badge_zodiacs_horsechinesezodiac + badge_zodiacs_goatchinesezodiac + badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac); }
                                else if(badge_zodiacs_title == 'Tiger') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_rabbitchinesezodiac + badge_zodiacs_dragonchinesezodiac + badge_zodiacs_snakechinesezodiac + badge_zodiacs_horsechinesezodiac + badge_zodiacs_goatchinesezodiac + badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac); }
                                else if(badge_zodiacs_title == 'Rabbit') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_dragonchinesezodiac + badge_zodiacs_snakechinesezodiac + badge_zodiacs_horsechinesezodiac + badge_zodiacs_goatchinesezodiac + badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac); }
                                else if(badge_zodiacs_title == 'Dragon') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_snakechinesezodiac + badge_zodiacs_horsechinesezodiac + badge_zodiacs_goatchinesezodiac + badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac); }
                                else if(badge_zodiacs_title == 'Snake') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_horsechinesezodiac + badge_zodiacs_goatchinesezodiac + badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac); }
                                else if(badge_zodiacs_title == 'Horse') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_goatchinesezodiac + badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac); }
                                else if(badge_zodiacs_title == 'Goat') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_monkeychinesezodiac + badge_zodiacs_roosterchinesezodiac); }
                                else if(badge_zodiacs_title == 'Monkey') { badge_zodiacs.insertAdjacentHTML('afterend', badge_zodiacs_roosterchinesezodiac); }
                            }
                        }
                    }

                }

                else if(badge_category == 'Munzee Special Badges') {
                    var badge_munzee_special_innerHTML = document.getElementsByClassName('list-inline')[badge_category_count];
                    if(dev == 1) { missing_badges.innerHTML = badge_category_count + '. ' + missing_badges.innerHTML; }

                    var badge_munzee_special_goldenunicorn = insert_badge('Monthly Video Contest Winner', 'Win the monthly video contest!', 'goldenunicorn', 'videocontest_null');
                    var badge_munzee_special_clean1 = insert_badge('Reduce', 'Capture 1 Recycle Icon', 'clean1', '1k_null');
                    var badge_munzee_special_clean2 = insert_badge('Reuse', 'Capture 50 Recycle Icons', 'clean2', '1k_null');
                    var badge_munzee_special_clean3 = insert_badge('Recycle', 'Capture 100 Recycle Icons', 'clean3', '1k_null');
                    var badge_munzee_special_clean4 = insert_badge('Recycling Basket', 'Capture 500 Recycle Icons', 'clean4', '1k_null');
                    var badge_munzee_special_clean5 = insert_badge('Recycling Bin', 'Capture 1000 Recycle Icons', 'clean5', '1k_null');
                    var badge_munzee_special_clean6 = insert_badge('Recycling Can', 'Capture 2500 Recycle Icons', 'clean6', '1k_null');
                    var badge_munzee_special_clean7 = insert_badge('Recycling Dumpster', 'Capture 5000 Recycle Icons', 'clean7', '1k_null');

                    // todo

                }

                else if(badge_category == 'Premium Membership Badges') {
                    var badge_premium_membership_innerHTML = document.getElementsByClassName('list-inline')[badge_category_count];
                    if(dev == 1) { missing_badges.innerHTML = badge_category_count + '. ' + missing_badges.innerHTML; }

                    var badge_premium_membership2 = insert_badge('Premium Member 2.0', 'Deploy 2 Premium Munzees', 'pm2', 'pm2_null');
                    var badge_premium_membership3 = insert_badge('Premium Member 3.0', 'Deploy 3 Premium Munzees', 'pm3', 'pm3_null');
                    var badge_premium_membership4 = insert_badge('Premium Member 4.0', 'Deploy 4 Premium Munzees', 'pm4', 'pm4_null');
                    var badge_premium_membership5 = insert_badge('Premium Member 5.0', 'Deploy 5 Premium Munzees', 'pm5', 'pm5_null');
                    var badge_premium_membership6 = insert_badge('Premium Member 6.0', 'Deploy 6 Premium Munzees', 'pm6', 'pm6_null');
                    var badge_premium_membership7 = insert_badge('Premium Member 7.0', 'Deploy 7 Premium Munzees', 'pm7', 'pm7_null');
                    var badge_premium_membership8 = insert_badge('Premium Member 8.0', 'Deploy 8 Premium Munzees', 'pm8', 'pm8_null');

                    var badge_premium_membership_length = badge_premium_membership_innerHTML.getElementsByClassName('badge-helper').length;
                    if(badge_premium_membership_length == 1) {
                        badge_premium_membership_innerHTML.insertAdjacentHTML('beforeend', badge_premium_membership2 + badge_premium_membership3 + badge_premium_membership4 + badge_premium_membership5 + badge_premium_membership6 + badge_premium_membership7 + badge_premium_membership8);
                    } else {
                        if(badge_premium_membership_length == 2) {
                            badge_premium_membership_innerHTML.insertAdjacentHTML('beforeend', badge_premium_membership3 + badge_premium_membership4 + badge_premium_membership5 + badge_premium_membership6 + badge_premium_membership7 + badge_premium_membership8);
                        } else {
                            if(badge_premium_membership_length == 3) {
                                badge_premium_membership_innerHTML.insertAdjacentHTML('beforeend', badge_premium_membership4 + badge_premium_membership5 + badge_premium_membership6 + badge_premium_membership7 + badge_premium_membership8);
                            } else {
                                if(badge_premium_membership_length == 4) {
                                    badge_premium_membership_innerHTML.insertAdjacentHTML('beforeend', badge_premium_membership5 + badge_premium_membership6 + badge_premium_membership7 + badge_premium_membership8);
                                } else {
                                    if(badge_premium_membership_length == 5) {
                                        badge_premium_membership_innerHTML.insertAdjacentHTML('beforeend', badge_premium_membership6 + badge_premium_membership7 + badge_premium_membership8);
                                    } else {
                                        if(badge_premium_membership_length == 6) {
                                            badge_premium_membership_innerHTML.insertAdjacentHTML('beforeend', badge_premium_membership7 + badge_premium_membership8);
                                        } else {
                                            if(badge_premium_membership_length == 7) {
                                                badge_premium_membership_innerHTML.insertAdjacentHTML('beforeend', badge_premium_membership8);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                }

                else if(badge_category == 'MHQ Visit Badges') {
                    var badge_mhq_visit_innerHTML = document.getElementsByClassName('list-inline')[badge_category_count];
                    if(dev == 1) { missing_badges.innerHTML = badge_category_count + '. ' + missing_badges.innerHTML; }

                    // todo

                }

                else if(badge_category == 'Meet &amp; Greet Badges') {
                    var badge_meet_greet_innerHTML = document.getElementsByClassName('list-inline')[badge_category_count];
                    if(dev == 1) { missing_badges.innerHTML = badge_category_count + '. ' + missing_badges.innerHTML; }

                    // Komplett fehlende Kategorie 'MHQ Visit Badges' nachbilden
                    if(badge_category_count !== 0 && badge_category_before1 != 'MHQ Visit Badges') {
                        missing_badges.insertAdjacentHTML('beforebegin', '<h4 style="border-bottom: 1px solid #d3d3d3; padding-bottom: 7px;">MHQ Visit Badges</h4><ul id="badges-listing" class="list-inline">Keine Badges vorhanden.</ul>' + badge_preview_link);
                        badge_category_count_inserts++;
                    }

                    var badge_meet_greet_makers = insert_badge('Meet the Makers', 'Howdy! At some point in time you met a member of the Team!', 'makers', 'familyjewels_null');
                    var badge_meet_greet_reseller = insert_badge('Reseller', 'Thanks for buying from a Munzee Authorized Reseller!', 'reseller', '1k_null');
                    var badge_meet_greet_robtour = insert_badge('Rob Tour', 'You met Rob along his Munzee 4th Birthday Tour! Make sure you try on his hat ... backwards.', 'robtour', '1k_null'); // archiviert?
                    var badge_meet_greet_matttour = insert_badge('Matt Tour', 'You met Matt along his Munzee 4th Birthday Tour! Hope you enjoyed the swim in his piercing eyes.', 'matttour', '1k_null'); // archiviert?
                    var badge_meet_greet_meetmatt = insert_badge('Meet Matt', 'Director of Media and Player Relations ... what a mouthful of a title. Give Matt a high five!', 'meetmatt', '1k_null');
                    var badge_meet_greet_meetlouise = insert_badge('Meet Louise', 'Cor blimey, would you Adam & Eve it? You\'ve caught up with Louise, our Munzee Events Manager!', 'meetlouise', '1k_null');
                    var badge_meet_greet_trey = insert_badge('The 3rd', 'You\'ve met ZeeSon!', 'trey', '1k_null');
                    var badge_meet_greet_meetdaniel = insert_badge('Meet Daniel', 'Hey, you met Daniel! Hope you had a good time! Prost!', 'meetdaniel', '1k_null');
                    var badge_meet_greet_robnc15 = insert_badge('Rob in NC', 'Thanks for participating, hope you have fun!', 'robnc15', '1k_null'); // archiviert?
                    var badge_meet_greet_robelk = insert_badge('Rob Elk', 'You earned this wild badge watching the elk rut in PA!', 'robelk', 'deployfire1_null'); // archiviert?
                    var badge_meet_greet_meetskylar = insert_badge('Meet Skylar', 'You met Ms. Wheelchair Texas USA 2015!', 'meetskylar', '1k_null');
                    var badge_meet_greet_dylan = insert_badge('Meet Dylan', 'As former Master of Media and current EventCzar, Dylan wears many hats and many more suits. Congrats on meeting the Master of Many Things!', 'dylan', 'watson_null');
                    var badge_meet_greet_adminextraordinaire = insert_badge('Admin Extraordinaire', 'She may hold all the power, but she also works late hours. You\'ve met Wylie- the Eventzee Admin!', 'adminextraordinaire', 'deployfire1_null');
                    var badge_meet_greet_robbie = insert_badge('Meet Robbie', 'You\'ve met WallaBee\'s Manager! Time to forage!', 'robbie', 'deployfire1_null');
                    var badge_meet_greet_scott = insert_badge('Meet Scott', 'Bow Down when you come to my town. Bow down when we west-ward bound cuz we aint no haters like you. Bow Down to a cofounder that\'s greater than you.', 'scott', 'seeker_null');
                    var badge_meet_greet_judy = insert_badge('Meet Judy', 'You have met the one and only Judy! High fives!', 'judy', '1k_null');
                    var badge_meet_greet_hammock = insert_badge('Meet Hammock', 'Sorry about that.', 'hammock', '1k_null');
                    var badge_meet_greet_trish = insert_badge('Meet Trish', 'Finally, I got a badge.', 'trish', '1k_null');
                    var badge_meet_greet_rw = insert_badge('Road Warriors', 'Congratulations! You met Dale n Barb #Roadwarriors on their travels. Hope you asked for some stickers!', 'rw', 'cnomad25_null');
                    var badge_meet_greet_john = insert_badge('Meet John', 'It\'s Dangerous to Go Alone! Take This.', 'john', 'deployfire1_null');
                    var badge_meet_greet_gcv = insert_badge('The GCV', 'Smile you\'re on camera! You\'ve met mayberryman, The GCV! Be sure to scan his referral code.', 'gcv', '1k_null');
                    var badge_meet_greet_m_craig = insert_badge('Meet Craig', 'You\'ve met Craig, the CEO of Freeze Tag! Be sure to let him know how much fun you\'re having!', 'm_craig', '1k_null');
                    var badge_meet_greet_m_mick = insert_badge('Meet Mick', 'You\'ve met Mick, the CFO of Freeze Tag! He\'s like our scout leader: He keeps us in check and makes sure we have fun!', 'm_mick', '1k_null');
                    var badge_meet_greet_m_mari = insert_badge('Meet Mari', 'You\'ve met Mari, one half of the Munzee Cosplayers duo! When she\'s not at conventions, she\'s masquerading at Munzee Events!', 'm_mari', '1k_null');
                    var badge_meet_greet_m_tamara = insert_badge('Meet Tamara', 'You\'ve met Tamara, one half of the Munzee Cosplayers duo! Her unconventional costumes are a sight to see!', 'm_tamara', '1k_null');
                    var badge_meet_greet_m_teraca = insert_badge('Meet Teraca', 'You\'ve met Teraca, who somehow manages to juggle the maniacs at MHQ! Only a mother of two could handle this crew!', 'm_teraca', '1k_null');
                    var badge_meet_greet_m_andy = insert_badge('Meet Andy', 'You\'ve met Andy, the artist behind WallaBee! This badge design is almost as busy as he is!', 'm_andy', '1k_null');
                    var badge_meet_greet_m_mizak = insert_badge('Meet Mizak', 'You\'ve met Mizak, the mysterious surfing sasquatch! Just kidding, David loves WallaBee so much he volunteers his time time as a web developer!', 'm_mizak', '1k_null');
                    var badge_meet_greet_m_rob = insert_badge('Meet Rob', 'You\'ve met Rob, President of Freeze Tag and all things gameplay! Whether it\'s playing with Bees or Zees, he wears many hats!', 'm_rob', '1k_null');

                    if(!badge_meet_greet_innerHTML) {
                        missing_badges.nextElementSibling.remove();
                        missing_badges.insertAdjacentHTML('afterend', '<ul id="badges-listing" class="list-inline">' + badge_meet_greet_makers + badge_meet_greet_reseller + badge_meet_greet_meetmatt + badge_meet_greet_meetlouise + badge_meet_greet_trey + badge_meet_greet_meetdaniel + badge_meet_greet_meetskylar + badge_meet_greet_dylan + badge_meet_greet_adminextraordinaire + badge_meet_greet_robbie + badge_meet_greet_scott + badge_meet_greet_judy + badge_meet_greet_hammock + badge_meet_greet_trish + badge_meet_greet_rw + badge_meet_greet_john + badge_meet_greet_gcv + badge_meet_greet_m_craig + badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob + '</ul>');
                    } else {
                        var badge_meet_greet_position = 0;
                        var badge_meet_greet_insert = '';
                        var badge_meet_greet_insert_matt = 0;
                        var badge_meet_greet_insert_3rd = 0;
                        var badge_meet_greet_stop = 0;
                        var badge_meet_greet_list_exist = [];
                        var badge_meet_greet0 = badge_meet_greet_innerHTML.getElementsByClassName('badge-helper');
                        var badge_meet_greet_length = badge_meet_greet_innerHTML.getElementsByClassName('badge-helper').length;
                        for(var bmg = 0, badge_meet_greet; !!(badge_meet_greet=badge_meet_greet0[bmg]); bmg++) {
                            var badge_meet_greet_title = badge_meet_greet.getAttribute("data-title");
                            badge_meet_greet_list_exist.push(badge_meet_greet_title);
                            badge_meet_greet_insert = '';
                            badge_meet_greet_stop = 0;
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 1) { if(badge_meet_greet_title != 'Meet the Makers') { badge_meet_greet_insert += badge_meet_greet_makers; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 2; } }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 2) { if(badge_meet_greet_title != 'Reseller') { badge_meet_greet_insert += badge_meet_greet_reseller; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 3; } }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 3) { if(badge_meet_greet_title != 'Rob Tour') { /*badge_meet_greet_insert += badge_meet_greet_robtour;*/ } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 4; } }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 4) { if(badge_meet_greet_title != 'Matt Tour') { /*badge_meet_greet_insert += badge_meet_greet_matttour;*/ } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 5; } }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 5) { if(badge_meet_greet_title != 'Meet Matt') { badge_meet_greet_insert += badge_meet_greet_meetmatt; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 6; } }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 6) { if(badge_meet_greet_title != 'Meet Louise') { badge_meet_greet_insert += badge_meet_greet_meetlouise; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 7; } }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 7) { if(badge_meet_greet_title != 'The 3rd') { badge_meet_greet_insert += badge_meet_greet_trey; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 8; } }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 8) { if(badge_meet_greet_title != 'Meet Daniel') { badge_meet_greet_insert += badge_meet_greet_meetdaniel; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 9; } }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 9) { if(badge_meet_greet_title != 'Meet Matt') { badge_meet_greet_insert += badge_meet_greet_meetmatt; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 10; } }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 10) { if(badge_meet_greet_title != 'Rob in NC') { /*badge_meet_greet_insert += badge_meet_greet_robnc15;*/ } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 11; } }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 11) { if(badge_meet_greet_title != 'Rob Elk') { /*badge_meet_greet_insert += badge_meet_greet_robelk;*/ } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 12; } }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 12) { if(badge_meet_greet_title != 'The 3rd') { badge_meet_greet_insert += badge_meet_greet_trey; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 13; } }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 13) { if(badge_meet_greet_title != 'Meet Skylar') { badge_meet_greet_insert += badge_meet_greet_meetskylar; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 14; } }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 14) { if(badge_meet_greet_title != 'The 3rd') { badge_meet_greet_insert += badge_meet_greet_trey; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 15; } }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 15) { if(badge_meet_greet_title != 'Meet Dylan') { badge_meet_greet_insert += badge_meet_greet_dylan; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 16; } }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 16) { if(badge_meet_greet_title != 'Admin Extraordinaire') { badge_meet_greet_insert += badge_meet_greet_adminextraordinaire; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 17; } }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 17) { if(badge_meet_greet_title != 'Meet Robbie') { badge_meet_greet_insert += badge_meet_greet_robbie; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 18; } }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 18) { if(badge_meet_greet_title != 'Meet Scott') { badge_meet_greet_insert += badge_meet_greet_scott; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 19; } }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 19) { if(badge_meet_greet_title != 'Meet Judy') { badge_meet_greet_insert += badge_meet_greet_judy; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 20; } }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 20) { if(badge_meet_greet_title != 'Meet Hammock') { badge_meet_greet_insert += badge_meet_greet_hammock; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 21; } }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 21) { if(badge_meet_greet_title != 'Meet Trish') { badge_meet_greet_insert += badge_meet_greet_trish; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 22; } }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 22) { if(badge_meet_greet_title != 'Road Warriors') { badge_meet_greet_insert += badge_meet_greet_rw; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 23;} }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 23) { if(badge_meet_greet_title != 'Meet John') { badge_meet_greet_insert += badge_meet_greet_john; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 24;} }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 24) { if(badge_meet_greet_title != 'The GCV') { badge_meet_greet_insert += badge_meet_greet_gcv; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 25;} }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 25) { if(badge_meet_greet_title != 'Meet Craig') { badge_meet_greet_insert += badge_meet_greet_m_craig; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 26;} }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 26) { if(badge_meet_greet_title != 'Meet Mick') { badge_meet_greet_insert += badge_meet_greet_m_mick; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 27;} }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 27) { if(badge_meet_greet_title != 'Meet Mari') { badge_meet_greet_insert += badge_meet_greet_m_mari; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 28;} }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 28) { if(badge_meet_greet_title != 'Meet Tamara') { badge_meet_greet_insert += badge_meet_greet_m_tamara; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 29;} }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 29) { if(badge_meet_greet_title != 'Meet Teraca') { badge_meet_greet_insert += badge_meet_greet_m_teraca; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 30;} }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 30) { if(badge_meet_greet_title != 'Meet Andy') { badge_meet_greet_insert += badge_meet_greet_m_andy; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 31;} }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 31) { if(badge_meet_greet_title != 'Meet Mizak') { badge_meet_greet_insert += badge_meet_greet_m_mizak; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 32;} }
                            if(badge_meet_greet_stop === 0 && badge_meet_greet_position <= 32) { if(badge_meet_greet_title != 'Meet Rob') { badge_meet_greet_insert += badge_meet_greet_m_rob; } else { badge_meet_greet_stop = 1; badge_meet_greet_position = 33;} }
                            if(badge_meet_greet_insert !== '') { badge_meet_greet.insertAdjacentHTML('beforebegin', badge_meet_greet_insert); }

                            if(badge_meet_greet_length == bmg + 1) {
                                if(badge_meet_greet_title == 'Meet the Makers') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_reseller + badge_meet_greet_meetmatt + badge_meet_greet_meetlouise + badge_meet_greet_trey + badge_meet_greet_meetdaniel + badge_meet_greet_meetskylar + badge_meet_greet_dylan + badge_meet_greet_adminextraordinaire + badge_meet_greet_robbie + badge_meet_greet_scott + badge_meet_greet_judy + badge_meet_greet_hammock + badge_meet_greet_trish + badge_meet_greet_rw + badge_meet_greet_john + badge_meet_greet_gcv + badge_meet_greet_m_craig + badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'Reseller') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_meetmatt + badge_meet_greet_meetlouise + badge_meet_greet_trey + badge_meet_greet_meetdaniel + badge_meet_greet_meetskylar + badge_meet_greet_dylan + badge_meet_greet_adminextraordinaire + badge_meet_greet_robbie + badge_meet_greet_scott + badge_meet_greet_judy + badge_meet_greet_hammock + badge_meet_greet_trish + badge_meet_greet_rw + badge_meet_greet_john + badge_meet_greet_gcv + badge_meet_greet_m_craig + badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'Meet Matt') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_meetlouise + badge_meet_greet_trey + badge_meet_greet_meetdaniel + badge_meet_greet_meetskylar + badge_meet_greet_dylan + badge_meet_greet_adminextraordinaire + badge_meet_greet_robbie + badge_meet_greet_scott + badge_meet_greet_judy + badge_meet_greet_hammock + badge_meet_greet_trish + badge_meet_greet_rw + badge_meet_greet_john + badge_meet_greet_gcv + badge_meet_greet_m_craig + badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'Meet Louise') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_trey + badge_meet_greet_meetdaniel + badge_meet_greet_meetskylar + badge_meet_greet_dylan + badge_meet_greet_adminextraordinaire + badge_meet_greet_robbie + badge_meet_greet_scott + badge_meet_greet_judy + badge_meet_greet_hammock + badge_meet_greet_trish + badge_meet_greet_rw + badge_meet_greet_john + badge_meet_greet_gcv + badge_meet_greet_m_craig + badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'The 3rd') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_meetdaniel + badge_meet_greet_meetskylar + badge_meet_greet_dylan + badge_meet_greet_adminextraordinaire + badge_meet_greet_robbie + badge_meet_greet_scott + badge_meet_greet_judy + badge_meet_greet_hammock + badge_meet_greet_trish + badge_meet_greet_rw + badge_meet_greet_john + badge_meet_greet_gcv + badge_meet_greet_m_craig + badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'Meet Daniel') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_meetskylar + badge_meet_greet_dylan + badge_meet_greet_adminextraordinaire + badge_meet_greet_robbie + badge_meet_greet_scott + badge_meet_greet_judy + badge_meet_greet_hammock + badge_meet_greet_trish + badge_meet_greet_rw + badge_meet_greet_john + badge_meet_greet_gcv + badge_meet_greet_m_craig + badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'Meet Skylar') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_dylan + badge_meet_greet_adminextraordinaire + badge_meet_greet_robbie + badge_meet_greet_scott + badge_meet_greet_judy + badge_meet_greet_hammock + badge_meet_greet_trish + badge_meet_greet_rw + badge_meet_greet_john + badge_meet_greet_gcv + badge_meet_greet_m_craig + badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'Meet Dylan') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_adminextraordinaire + badge_meet_greet_robbie + badge_meet_greet_scott + badge_meet_greet_judy + badge_meet_greet_hammock + badge_meet_greet_trish + badge_meet_greet_rw + badge_meet_greet_john + badge_meet_greet_gcv + badge_meet_greet_m_craig + badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'Admin Extraordinaire') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_robbie + badge_meet_greet_scott + badge_meet_greet_judy + badge_meet_greet_hammock + badge_meet_greet_trish + badge_meet_greet_rw + badge_meet_greet_john + badge_meet_greet_gcv + badge_meet_greet_m_craig + badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'Meet Robbie') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_scott + badge_meet_greet_judy + badge_meet_greet_hammock + badge_meet_greet_trish + badge_meet_greet_rw + badge_meet_greet_john + badge_meet_greet_gcv + badge_meet_greet_m_craig + badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'Meet Scott') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_judy + badge_meet_greet_hammock + badge_meet_greet_trish + badge_meet_greet_rw + badge_meet_greet_john + badge_meet_greet_gcv + badge_meet_greet_m_craig + badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'Meet Judy') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_hammock + badge_meet_greet_trish + badge_meet_greet_rw + badge_meet_greet_john + badge_meet_greet_gcv + badge_meet_greet_m_craig + badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'Meet Hammock') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_trish + badge_meet_greet_rw + badge_meet_greet_john + badge_meet_greet_gcv + badge_meet_greet_m_craig + badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'Meet Trish') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_rw + badge_meet_greet_john + badge_meet_greet_gcv + badge_meet_greet_m_craig + badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'Road Warriors') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_john + badge_meet_greet_gcv + badge_meet_greet_m_craig + badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'Meet John') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_gcv + badge_meet_greet_m_craig + badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'The GCV') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_m_craig + badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'Meet Craig') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'Meet Mick') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'Meet Mari') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'Meet Tamara') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'Meet Teraca') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'Meet Andy') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_m_mizak + badge_meet_greet_m_rob); }
                                else if(badge_meet_greet_title == 'Meet Mizak') { badge_meet_greet.insertAdjacentHTML('afterend', badge_meet_greet_m_rob); }
                            }
                        }

                        // Doppelte 'Meet Matt' und 'The 3rd' erkennen und löschen
                        var badge_meet_greet_remove_count = 0;
                        var badge_meet_greet_list_exist_inserts = [];
                        var badge_meet_greet0_new = badge_meet_greet_innerHTML.getElementsByClassName('badge-helper-inserts');
                        for(var bmg_new = 0, badge_meet_greet_new; !!(badge_meet_greet_new=badge_meet_greet0_new[bmg_new]); bmg_new++) {
                            var badge_meet_greet_new_title = badge_meet_greet_new.getAttribute('data-title');
                            if(badge_meet_greet_list_exist.indexOf(badge_meet_greet_new_title) != -1) {
                                badge_meet_greet_new.setAttribute('data-title', 'remove');
                                badge_meet_greet_remove_count++;
                            }
                            if(badge_meet_greet_list_exist_inserts.indexOf(badge_meet_greet_new_title) != -1) {
                                badge_meet_greet_new.setAttribute('data-title', 'remove');
                                badge_meet_greet_remove_count++;
                            } else {
                                badge_meet_greet_list_exist_inserts.push(badge_meet_greet_new_title);
                            }
                        }
                        if(badge_meet_greet_remove_count !== 0) {
                            var badge_meet_greet0_remove = badge_meet_greet_innerHTML.querySelectorAll('li[data-title="remove"]');
                            for(var bmg_remove = 0, badge_meet_greet_remove; !!(badge_meet_greet_remove=badge_meet_greet0_remove[bmg_remove]); bmg_remove++) {
                                badge_meet_greet_remove.remove();
                            }
                        }

                    }
                }

                else if(badge_category == 'Leaderboard Badges') {
                    var badge_leaderboard_innerHTML = document.getElementsByClassName('list-inline')[badge_category_count];
                    if(dev == 1) { missing_badges.innerHTML = badge_category_count + '. ' + missing_badges.innerHTML; }

                    // Komplett fehlende Kategorien 'MHQ Visit Badges' und 'Meet & Greet Badges' nachbilden
                    badge_meet_greet_makers = insert_badge('Meet the Makers', 'Howdy! At some point in time you met a member of the Team!', 'makers', 'familyjewels_null');
                    badge_meet_greet_reseller = insert_badge('Reseller', 'Thanks for buying from a Munzee Authorized Reseller!', 'reseller', '1k_null');
                    badge_meet_greet_robtour = insert_badge('Rob Tour', 'You met Rob along his Munzee 4th Birthday Tour! Make sure you try on his hat ... backwards.', 'robtour', '1k_null'); // archiviert?
                    badge_meet_greet_matttour = insert_badge('Matt Tour', 'You met Matt along his Munzee 4th Birthday Tour! Hope you enjoyed the swim in his piercing eyes.', 'matttour', '1k_null'); // archiviert?
                    badge_meet_greet_meetmatt = insert_badge('Meet Matt', 'Director of Media and Player Relations ... what a mouthful of a title. Give Matt a high five!', 'meetmatt', '1k_null');
                    badge_meet_greet_meetlouise = insert_badge('Meet Louise', 'Cor blimey, would you Adam & Eve it? You\'ve caught up with Louise, our Munzee Events Manager!', 'meetlouise', '1k_null');
                    badge_meet_greet_trey = insert_badge('The 3rd', 'You\'ve met ZeeSon!', 'trey', '1k_null');
                    badge_meet_greet_meetdaniel = insert_badge('Meet Daniel', 'Hey, you met Daniel! Hope you had a good time! Prost!', 'meetdaniel', '1k_null');
                    badge_meet_greet_robnc15 = insert_badge('Rob in NC', 'Thanks for participating, hope you have fun!', 'robnc15', '1k_null'); // archiviert?
                    badge_meet_greet_robelk = insert_badge('Rob Elk', 'You earned this wild badge watching the elk rut in PA!', 'robelk', 'deployfire1_null'); // archiviert?
                    badge_meet_greet_meetskylar = insert_badge('Meet Skylar', 'You met Ms. Wheelchair Texas USA 2015!', 'meetskylar', '1k_null');
                    badge_meet_greet_dylan = insert_badge('Meet Dylan', 'As former Master of Media and current EventCzar, Dylan wears many hats and many more suits. Congrats on meeting the Master of Many Things!', 'dylan', 'watson_null');
                    badge_meet_greet_adminextraordinaire = insert_badge('Admin Extraordinaire', 'She may hold all the power, but she also works late hours. You\'ve met Wylie- the Eventzee Admin!', 'adminextraordinaire', 'deployfire1_null');
                    badge_meet_greet_robbie = insert_badge('Meet Robbie', 'You\'ve met WallaBee\'s Manager! Time to forage!', 'robbie', 'deployfire1_null');
                    badge_meet_greet_scott = insert_badge('Meet Scott', 'Bow Down when you come to my town. Bow down when we west-ward bound cuz we aint no haters like you. Bow Down to a cofounder that\'s greater than you.', 'scott', 'seeker_null');
                    badge_meet_greet_judy = insert_badge('Meet Judy', 'You have met the one and only Judy! High fives!', 'judy', '1k_null');
                    badge_meet_greet_hammock = insert_badge('Meet Hammock', 'Sorry about that.', 'hammock', '1k_null');
                    badge_meet_greet_trish = insert_badge('Meet Trish', 'Finally, I got a badge.', 'trish', '1k_null');
                    badge_meet_greet_rw = insert_badge('Road Warriors', 'Congratulations! You met Dale n Barb #Roadwarriors on their travels. Hope you asked for some stickers!', 'rw', 'cnomad25_null');
                    badge_meet_greet_john = insert_badge('Meet John', 'It\'s Dangerous to Go Alone! Take This.', 'john', 'deployfire1_null');
                    badge_meet_greet_gcv = insert_badge('The GCV', 'Smile you\'re on camera! You\'ve met mayberryman, The GCV! Be sure to scan his referral code.', 'gcv', '1k_null');
                    badge_meet_greet_m_craig = insert_badge('Meet Craig', 'You\'ve met Craig, the CEO of Freeze Tag! Be sure to let him know how much fun you\'re having!', 'm_craig', '1k_null');
                    badge_meet_greet_m_mick = insert_badge('Meet Mick', 'You\'ve met Mick, the CFO of Freeze Tag! He\'s like our scout leader: He keeps us in check and makes sure we have fun!', 'm_mick', '1k_null');
                    badge_meet_greet_m_mari = insert_badge('Meet Mari', 'You\'ve met Mari, one half of the Munzee Cosplayers duo! When she\'s not at conventions, she\'s masquerading at Munzee Events!', 'm_mari', '1k_null');
                    badge_meet_greet_m_tamara = insert_badge('Meet Tamara', 'You\'ve met Tamara, one half of the Munzee Cosplayers duo! Her unconventional costumes are a sight to see!', 'm_tamara', '1k_null');
                    badge_meet_greet_m_teraca = insert_badge('Meet Teraca', 'You\'ve met Teraca, who somehow manages to juggle the maniacs at MHQ! Only a mother of two could handle this crew!', 'm_teraca', '1k_null');
                    badge_meet_greet_m_andy = insert_badge('Meet Andy', 'You\'ve met Andy, the artist behind WallaBee! This badge design is almost as busy as he is!', 'm_andy', '1k_null');
                    badge_meet_greet_m_mizak = insert_badge('Meet Mizak', 'You\'ve met Mizak, the mysterious surfing sasquatch! Just kidding, David loves WallaBee so much he volunteers his time time as a web developer!', 'm_mizak', '1k_null');
                    badge_meet_greet_m_rob = insert_badge('Meet Rob', 'You\'ve met Rob, President of Freeze Tag and all things gameplay! Whether it\'s playing with Bees or Zees, he wears many hats!', 'm_rob', '1k_null');

                    if(badge_category_count !== 0 && badge_category_before2 != 'MHQ Visit Badges' && badge_category_before1 != 'Meet &amp; Greet Badges') {
                        var badge_mhq_visit_missing_insert = '';
                        var badge_meet_greet_missing_insert = '';

                        // MHQ Visit Badges
                        badge_mhq_visit_missing_insert = '<h4 style="border-bottom: 1px solid #d3d3d3; padding-bottom: 7px;">MHQ Visit Badges</h4><ul id="badges-listing" class="list-inline">Keine Badges vorhanden.</ul>' + badge_preview_link;

                        // Meet & Greet Badges
                        badge_meet_greet_missing_insert = '<h4 style="border-bottom: 1px solid #d3d3d3; padding-bottom: 7px;">Meet & Greet Badges</h4><ul id="badges-listing" class="list-inline">' + badge_meet_greet_makers + badge_meet_greet_reseller + badge_meet_greet_meetmatt + badge_meet_greet_meetlouise + badge_meet_greet_trey + badge_meet_greet_meetdaniel + badge_meet_greet_meetskylar + badge_meet_greet_dylan + badge_meet_greet_adminextraordinaire + badge_meet_greet_robbie + badge_meet_greet_scott + badge_meet_greet_judy + badge_meet_greet_hammock + badge_meet_greet_trish + badge_meet_greet_rw + badge_meet_greet_john + badge_meet_greet_gcv + badge_meet_greet_m_craig + badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob + '</ul>' + badge_preview_link;

                        missing_badges.insertAdjacentHTML('beforebegin', badge_mhq_visit_missing_insert + badge_meet_greet_missing_insert);
                        badge_category_count_inserts += 2;
                    }
                    // Komplett fehlende Kategorie 'Meet & Greet Badges' nachbilden
                    else if(badge_category_count !== 0 && badge_category_before1 != 'Meet &amp; Greet Badges') {
                        missing_badges.insertAdjacentHTML('beforebegin', '<h4 style="border-bottom: 1px solid #d3d3d3; padding-bottom: 7px;">Meet & Greet Badges</h4><ul id="badges-listing" class="list-inline">' + badge_meet_greet_makers + badge_meet_greet_reseller + badge_meet_greet_meetmatt + badge_meet_greet_meetlouise + badge_meet_greet_trey + badge_meet_greet_meetdaniel + badge_meet_greet_meetskylar + badge_meet_greet_dylan + badge_meet_greet_adminextraordinaire + badge_meet_greet_robbie + badge_meet_greet_scott + badge_meet_greet_judy + badge_meet_greet_hammock + badge_meet_greet_trish + badge_meet_greet_rw + badge_meet_greet_john + badge_meet_greet_gcv + badge_meet_greet_m_craig + badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob + '</ul>' + badge_preview_link);
                        badge_category_count_inserts++;
                    }

                    var badge_leaderboard_king = insert_badge('#1', 'Be the #1 player in the world!', 'king', 'cap_null');
                    var badge_leaderboard_qw = insert_badge('#1 Queen of the World', 'Be the #1 player in the world!', 'qw', 'cap_null');
                    var badge_leaderboard_top10 = insert_badge('Top 10', 'Made it to the top 10', 'top10', 'cap_null');
                    var badge_leaderboard_top50 = insert_badge('Top 50', 'Made it to the top 50', 'top50', 'cap_null');
                    var badge_leaderboard_top100 = insert_badge('Top 100', 'Made it to the top 100', 'top100', 'cap_null');
                    var badge_leaderboard_top500 = insert_badge('Top 500', 'Made it to the top 500', 'top500', 'cap_null');
                    var badge_leaderboard_top1000 = insert_badge('Top 1000', 'Made it to the top 1000', 'top1000', 'cap_null');
                    var badge_leaderboard_top2000 = insert_badge('Top 2000', 'Made it to the top 2000', 'top2000', 'cap_null');
                    var badge_leaderboard_winner = insert_badge('Winner', '#1 player in the world on the daily leaderboard', 'winner', 'capsuperstreak_null');
                    var badge_leaderboard_1stloser = insert_badge('First Loser', '#2 player in the world on the daily leaderboard', '1stloser', 'capsuperstreak_null');
                    var badge_leaderboard_lucky = insert_badge('Lucky', '#7 player in the world on the daily leaderboard', 'lucky', 'capsuperstreak_null');
                    var badge_leaderboard_unlucky = insert_badge('Unlucky', '#13 player in the world on the daily leaderboard', 'unlucky', 'capsuperstreak_null');
                    var badge_leaderboard_lead21 = insert_badge('Blackjack', '#21 player in the world on the daily leaderboard', 'lead21', 'capsuperstreak_null');
                    var badge_leaderboard_lead42 = insert_badge('The Meaning of Life', '#42 player in the world on the daily leaderboard', 'lead42', 'capsuperstreak_null');
                    var badge_leaderboard_lead50 = insert_badge('Halfway', '#50 player in the world on the daily leaderboard', 'lead50', 'capsuperstreak_null');
                    var badge_leaderboard_lead100 = insert_badge('The Final Spot', '#100 player in the world on the daily leaderboard', 'lead100', 'capsuperstreak_null');

                    if(!badge_leaderboard_innerHTML) {
                        missing_badges.nextElementSibling.remove();
                        missing_badges.insertAdjacentHTML('afterend', '<ul id="badges-listing" class="list-inline">' + badge_leaderboard_king + badge_leaderboard_qw + badge_leaderboard_top10 + badge_leaderboard_top50 + badge_leaderboard_top100 + badge_leaderboard_top500 + badge_leaderboard_top1000 + badge_leaderboard_top2000 + badge_leaderboard_winner + badge_leaderboard_1stloser + badge_leaderboard_lucky + badge_leaderboard_unlucky + badge_leaderboard_lead21 + badge_leaderboard_lead42 + badge_leaderboard_lead50 + badge_leaderboard_lead100 + '</ul>');
                    } else {
                        var badge_leaderboard_position = 0;
                        var badge_leaderboard_insert = '';
                        var badge_leaderboard_stop = 0;
                        var badge_leaderboard0 = badge_leaderboard_innerHTML.getElementsByClassName('badge-helper');
                        var badge_leaderboard_length = badge_leaderboard_innerHTML.getElementsByClassName('badge-helper').length;
                        for(var bl = 0, badge_leaderboard; !!(badge_leaderboard=badge_leaderboard0[bl]); bl++) {
                            var badge_leaderboard_title = badge_leaderboard.getAttribute("data-title");
                            badge_leaderboard_insert = '';
                            badge_leaderboard_stop = 0;
                            if(badge_leaderboard_stop === 0 && badge_leaderboard_position <= 1) { if(badge_leaderboard_title != '#1') { badge_leaderboard_insert += badge_leaderboard_king; } else { badge_leaderboard_stop = 1; badge_leaderboard_position = 2; } }
                            if(badge_leaderboard_stop === 0 && badge_leaderboard_position <= 2) { if(badge_leaderboard_title != '#1 Queen of the World') { badge_leaderboard_insert += badge_leaderboard_qw; } else { badge_leaderboard_stop = 1; badge_leaderboard_position = 3; } }
                            if(badge_leaderboard_stop === 0 && badge_leaderboard_position <= 3) { if(badge_leaderboard_title != 'Top 10') { badge_leaderboard_insert += badge_leaderboard_top10; } else { badge_leaderboard_stop = 1; badge_leaderboard_position = 4; } }
                            if(badge_leaderboard_stop === 0 && badge_leaderboard_position <= 4) { if(badge_leaderboard_title != 'Top 50') { badge_leaderboard_insert += badge_leaderboard_top50; } else { badge_leaderboard_stop = 1; badge_leaderboard_position = 5; } }
                            if(badge_leaderboard_stop === 0 && badge_leaderboard_position <= 5) { if(badge_leaderboard_title != 'Top 100') { badge_leaderboard_insert += badge_leaderboard_top100; } else { badge_leaderboard_stop = 1; badge_leaderboard_position = 6; } }
                            if(badge_leaderboard_stop === 0 && badge_leaderboard_position <= 6) { if(badge_leaderboard_title != 'Top 500') { badge_leaderboard_insert += badge_leaderboard_top500; } else { badge_leaderboard_stop = 1; badge_leaderboard_position = 7; } }
                            if(badge_leaderboard_stop === 0 && badge_leaderboard_position <= 7) { if(badge_leaderboard_title != 'Top 1000') { badge_leaderboard_insert += badge_leaderboard_top1000; } else { badge_leaderboard_stop = 1; badge_leaderboard_position = 8; } }
                            if(badge_leaderboard_stop === 0 && badge_leaderboard_position <= 8) { if(badge_leaderboard_title != 'Top 2000') { badge_leaderboard_insert += badge_leaderboard_top2000; } else { badge_leaderboard_stop = 1; badge_leaderboard_position = 9; } }
                            if(badge_leaderboard_stop === 0 && badge_leaderboard_position <= 9) { if(badge_leaderboard_title != 'Winner') { badge_leaderboard_insert += badge_leaderboard_winner; } else { badge_leaderboard_stop = 1; badge_leaderboard_position = 10; } }
                            if(badge_leaderboard_stop === 0 && badge_leaderboard_position <= 10) { if(badge_leaderboard_title != 'First Loser') { badge_leaderboard_insert += badge_leaderboard_1stloser; } else { badge_leaderboard_stop = 1; badge_leaderboard_position = 11; } }
                            if(badge_leaderboard_stop === 0 && badge_leaderboard_position <= 11) { if(badge_leaderboard_title != 'Lucky') { badge_leaderboard_insert += badge_leaderboard_lucky; } else { badge_leaderboard_stop = 1; badge_leaderboard_position = 12; } }
                            if(badge_leaderboard_stop === 0 && badge_leaderboard_position <= 12) { if(badge_leaderboard_title != 'Unlucky') { badge_leaderboard_insert += badge_leaderboard_unlucky; } else { badge_leaderboard_stop = 1; badge_leaderboard_position = 13; } }
                            if(badge_leaderboard_stop === 0 && badge_leaderboard_position <= 13) { if(badge_leaderboard_title != 'Blackjack') { badge_leaderboard_insert += badge_leaderboard_lead21; } else { badge_leaderboard_stop = 1; badge_leaderboard_position = 14; } }
                            if(badge_leaderboard_stop === 0 && badge_leaderboard_position <= 14) { if(badge_leaderboard_title != 'The Meaning of Life') { badge_leaderboard_insert += badge_leaderboard_lead42; } else { badge_leaderboard_stop = 1; badge_leaderboard_position = 15; } }
                            if(badge_leaderboard_stop === 0 && badge_leaderboard_position <= 15) { if(badge_leaderboard_title != 'Halfway') { badge_leaderboard_insert += badge_leaderboard_lead50; } else { badge_leaderboard_stop = 1; badge_leaderboard_position = 16;} }
                            if(badge_leaderboard_stop === 0 && badge_leaderboard_position <= 16) { if(badge_leaderboard_title != 'The Final Spot') { badge_leaderboard_insert += badge_leaderboard_lead100; } else { badge_leaderboard_stop = 1; badge_leaderboard_position = 17;} }
                            if(badge_leaderboard_insert !== '') { badge_leaderboard.insertAdjacentHTML('beforebegin', badge_leaderboard_insert); }

                            if(badge_leaderboard_length == bl + 1) {
                                /* if(badge_leaderboard_title == '#1') { badge_leaderboard.insertAdjacentHTML('afterend', badge_leaderboard_qw + badge_leaderboard_top10 + badge_leaderboard_top50 + badge_leaderboard_top100 + badge_leaderboard_top500 + badge_leaderboard_top1000 + badge_leaderboard_top2000 + badge_leaderboard_winner + badge_leaderboard_1stloser + badge_leaderboard_lucky + badge_leaderboard_unlucky + badge_leaderboard_lead21 + badge_leaderboard_lead42 + badge_leaderboard_lead50 + badge_leaderboard_lead100); }
                                else if(badge_leaderboard_title == '#1 Queen of the World') { badge_leaderboard.insertAdjacentHTML('afterend', badge_leaderboard_top10 + badge_leaderboard_top50 + badge_leaderboard_top100 + badge_leaderboard_top500 + badge_leaderboard_top1000 + badge_leaderboard_top2000 + badge_leaderboard_winner + badge_leaderboard_1stloser + badge_leaderboard_lucky + badge_leaderboard_unlucky + badge_leaderboard_lead21 + badge_leaderboard_lead42 + badge_leaderboard_lead50 + badge_leaderboard_lead100); }
                                else if(badge_leaderboard_title == 'Top 10') { badge_leaderboard.insertAdjacentHTML('afterend', badge_leaderboard_top50 + badge_leaderboard_top100 + badge_leaderboard_top500 + badge_leaderboard_top1000 + badge_leaderboard_top2000 + badge_leaderboard_winner + badge_leaderboard_1stloser + badge_leaderboard_lucky + badge_leaderboard_unlucky + badge_leaderboard_lead21 + badge_leaderboard_lead42 + badge_leaderboard_lead50 + badge_leaderboard_lead100); }
                                else if(badge_leaderboard_title == 'Top 50') { badge_leaderboard.insertAdjacentHTML('afterend', badge_leaderboard_top100 + badge_leaderboard_top500 + badge_leaderboard_top1000 + badge_leaderboard_top2000 + badge_leaderboard_winner + badge_leaderboard_1stloser + badge_leaderboard_lucky + badge_leaderboard_unlucky + badge_leaderboard_lead21 + badge_leaderboard_lead42 + badge_leaderboard_lead50 + badge_leaderboard_lead100); }
                                else if(badge_leaderboard_title == 'Top 100') { badge_leaderboard.insertAdjacentHTML('afterend', badge_leaderboard_top500 + badge_leaderboard_top1000 + badge_leaderboard_top2000 + badge_leaderboard_winner + badge_leaderboard_1stloser + badge_leaderboard_lucky + badge_leaderboard_unlucky + badge_leaderboard_lead21 + badge_leaderboard_lead42 + badge_leaderboard_lead50 + badge_leaderboard_lead100); }
                                else if(badge_leaderboard_title == 'Top 500') { badge_leaderboard.insertAdjacentHTML('afterend', badge_leaderboard_top1000 + badge_leaderboard_top2000 + badge_leaderboard_winner + badge_leaderboard_1stloser + badge_leaderboard_lucky + badge_leaderboard_unlucky + badge_leaderboard_lead21 + badge_leaderboard_lead42 + badge_leaderboard_lead50 + badge_leaderboard_lead100); }
                                else if(badge_leaderboard_title == 'Top 1000') { badge_leaderboard.insertAdjacentHTML('afterend', badge_leaderboard_top2000 + badge_leaderboard_winner + badge_leaderboard_1stloser + badge_leaderboard_lucky + badge_leaderboard_unlucky + badge_leaderboard_lead21 + badge_leaderboard_lead42 + badge_leaderboard_lead50 + badge_leaderboard_lead100); }
                                else*/ if(badge_leaderboard_title == 'Top 2000') { badge_leaderboard.insertAdjacentHTML('afterend', badge_leaderboard_winner + badge_leaderboard_1stloser + badge_leaderboard_lucky + badge_leaderboard_unlucky + badge_leaderboard_lead21 + badge_leaderboard_lead42 + badge_leaderboard_lead50 + badge_leaderboard_lead100); }
                                else if(badge_leaderboard_title == 'Winner') { badge_leaderboard.insertAdjacentHTML('afterend', badge_leaderboard_1stloser + badge_leaderboard_lucky + badge_leaderboard_unlucky + badge_leaderboard_lead21 + badge_leaderboard_lead42 + badge_leaderboard_lead50 + badge_leaderboard_lead100); }
                                else if(badge_leaderboard_title == 'First Loser') { badge_leaderboard.insertAdjacentHTML('afterend', badge_leaderboard_lucky + badge_leaderboard_unlucky + badge_leaderboard_lead21 + badge_leaderboard_lead42 + badge_leaderboard_lead50 + badge_leaderboard_lead100); }
                                else if(badge_leaderboard_title == 'Lucky') { badge_leaderboard.insertAdjacentHTML('afterend', badge_leaderboard_unlucky + badge_leaderboard_lead21 + badge_leaderboard_lead42 + badge_leaderboard_lead50 + badge_leaderboard_lead100); }
                                else if(badge_leaderboard_title == 'Unlucky') { badge_leaderboard.insertAdjacentHTML('afterend', badge_leaderboard_lead21 + badge_leaderboard_lead42 + badge_leaderboard_lead50 + badge_leaderboard_lead100); }
                                else if(badge_leaderboard_title == 'Blackjack') { badge_leaderboard.insertAdjacentHTML('afterend', badge_leaderboard_lead42 + badge_leaderboard_lead50 + badge_leaderboard_lead100); }
                                else if(badge_leaderboard_title == 'The Meaning of Life') { badge_leaderboard.insertAdjacentHTML('afterend', badge_leaderboard_lead50 + badge_leaderboard_lead100); }
                                else if(badge_leaderboard_title == 'Halfway') { badge_leaderboard.insertAdjacentHTML('afterend', badge_leaderboard_lead100); }
                            }
                        }
                    }

                }

                else if(badge_category == 'Clan Badges') {
                    var badge_clan_innerHTML = document.getElementsByClassName('list-inline')[badge_category_count];
                    if(dev == 1) { missing_badges.innerHTML = badge_category_count + '. ' + missing_badges.innerHTML; }

                    // Komplett fehlende Kategorien 'MHQ Visit Badges', 'Meet & Greet Badges' und 'Leaderboard Badges' einfügen
                    badge_meet_greet_makers = insert_badge('Meet the Makers', 'Howdy! At some point in time you met a member of the Team!', 'makers', 'familyjewels_null');
                    badge_meet_greet_reseller = insert_badge('Reseller', 'Thanks for buying from a Munzee Authorized Reseller!', 'reseller', '1k_null');
                    badge_meet_greet_robtour = insert_badge('Rob Tour', 'You met Rob along his Munzee 4th Birthday Tour! Make sure you try on his hat ... backwards.', 'robtour', '1k_null'); // archiviert?
                    badge_meet_greet_matttour = insert_badge('Matt Tour', 'You met Matt along his Munzee 4th Birthday Tour! Hope you enjoyed the swim in his piercing eyes.', 'matttour', '1k_null'); // archiviert?
                    badge_meet_greet_meetmatt = insert_badge('Meet Matt', 'Director of Media and Player Relations ... what a mouthful of a title. Give Matt a high five!', 'meetmatt', '1k_null');
                    badge_meet_greet_meetlouise = insert_badge('Meet Louise', 'Cor blimey, would you Adam & Eve it? You\'ve caught up with Louise, our Munzee Events Manager!', 'meetlouise', '1k_null');
                    badge_meet_greet_trey = insert_badge('The 3rd', 'You\'ve met ZeeSon!', 'trey', '1k_null');
                    badge_meet_greet_meetdaniel = insert_badge('Meet Daniel', 'Hey, you met Daniel! Hope you had a good time! Prost!', 'meetdaniel', '1k_null');
                    badge_meet_greet_robnc15 = insert_badge('Rob in NC', 'Thanks for participating, hope you have fun!', 'robnc15', '1k_null'); // archiviert?
                    badge_meet_greet_robelk = insert_badge('Rob Elk', 'You earned this wild badge watching the elk rut in PA!', 'robelk', 'deployfire1_null'); // archiviert?
                    badge_meet_greet_meetskylar = insert_badge('Meet Skylar', 'You met Ms. Wheelchair Texas USA 2015!', 'meetskylar', '1k_null');
                    badge_meet_greet_dylan = insert_badge('Meet Dylan', 'As former Master of Media and current EventCzar, Dylan wears many hats and many more suits. Congrats on meeting the Master of Many Things!', 'dylan', 'watson_null');
                    badge_meet_greet_adminextraordinaire = insert_badge('Admin Extraordinaire', 'She may hold all the power, but she also works late hours. You\'ve met Wylie- the Eventzee Admin!', 'adminextraordinaire', 'deployfire1_null');
                    badge_meet_greet_robbie = insert_badge('Meet Robbie', 'You\'ve met WallaBee\'s Manager! Time to forage!', 'robbie', 'deployfire1_null');
                    badge_meet_greet_scott = insert_badge('Meet Scott', 'Bow Down when you come to my town. Bow down when we west-ward bound cuz we aint no haters like you. Bow Down to a cofounder that\'s greater than you.', 'scott', 'seeker_null');
                    badge_meet_greet_judy = insert_badge('Meet Judy', 'You have met the one and only Judy! High fives!', 'judy', '1k_null');
                    badge_meet_greet_hammock = insert_badge('Meet Hammock', 'Sorry about that.', 'hammock', '1k_null');
                    badge_meet_greet_trish = insert_badge('Meet Trish', 'Finally, I got a badge.', 'trish', '1k_null');
                    badge_meet_greet_rw = insert_badge('Road Warriors', 'Congratulations! You met Dale n Barb #Roadwarriors on their travels. Hope you asked for some stickers!', 'rw', 'cnomad25_null');
                    badge_meet_greet_john = insert_badge('Meet John', 'It\'s Dangerous to Go Alone! Take This.', 'john', 'deployfire1_null');
                    badge_meet_greet_gcv = insert_badge('The GCV', 'Smile you\'re on camera! You\'ve met mayberryman, The GCV! Be sure to scan his referral code.', 'gcv', '1k_null');
                    badge_meet_greet_m_craig = insert_badge('Meet Craig', 'You\'ve met Craig, the CEO of Freeze Tag! Be sure to let him know how much fun you\'re having!', 'm_craig', '1k_null');
                    badge_meet_greet_m_mick = insert_badge('Meet Mick', 'You\'ve met Mick, the CFO of Freeze Tag! He\'s like our scout leader: He keeps us in check and makes sure we have fun!', 'm_mick', '1k_null');
                    badge_meet_greet_m_mari = insert_badge('Meet Mari', 'You\'ve met Mari, one half of the Munzee Cosplayers duo! When she\'s not at conventions, she\'s masquerading at Munzee Events!', 'm_mari', '1k_null');
                    badge_meet_greet_m_tamara = insert_badge('Meet Tamara', 'You\'ve met Tamara, one half of the Munzee Cosplayers duo! Her unconventional costumes are a sight to see!', 'm_tamara', '1k_null');
                    badge_meet_greet_m_teraca = insert_badge('Meet Teraca', 'You\'ve met Teraca, who somehow manages to juggle the maniacs at MHQ! Only a mother of two could handle this crew!', 'm_teraca', '1k_null');
                    badge_meet_greet_m_andy = insert_badge('Meet Andy', 'You\'ve met Andy, the artist behind WallaBee! This badge design is almost as busy as he is!', 'm_andy', '1k_null');
                    badge_meet_greet_m_mizak = insert_badge('Meet Mizak', 'You\'ve met Mizak, the mysterious surfing sasquatch! Just kidding, David loves WallaBee so much he volunteers his time time as a web developer!', 'm_mizak', '1k_null');
                    badge_meet_greet_m_rob = insert_badge('Meet Rob', 'You\'ve met Rob, President of Freeze Tag and all things gameplay! Whether it\'s playing with Bees or Zees, he wears many hats!', 'm_rob', '1k_null');

                    if(badge_category_count !== 0 && badge_category_before3 != 'MHQ Visit Badges' && badge_category_before2 != 'Meet &amp; Greet Badges' && badge_category_before1 != 'Leaderboard Badges') {
                        badge_mhq_visit_missing_insert = '';
                        badge_meet_greet_missing_insert = '';
                        var badge_leaderboard_missing_insert = '';

                        // MHQ Visit Badges
                        badge_mhq_visit_missing_insert = '<h4 style="border-bottom: 1px solid #d3d3d3; padding-bottom: 7px;">MHQ Visit Badges</h4><ul id="badges-listing" class="list-inline">Keine Badges vorhanden.</ul>' + badge_preview_link;

                        // Meet & Greet Badges
                        badge_meet_greet_missing_insert = '<h4 style="border-bottom: 1px solid #d3d3d3; padding-bottom: 7px;">Meet & Greet Badges</h4><ul id="badges-listing" class="list-inline">' + badge_meet_greet_makers + badge_meet_greet_reseller + badge_meet_greet_meetmatt + badge_meet_greet_meetlouise + badge_meet_greet_trey + badge_meet_greet_meetdaniel + badge_meet_greet_meetskylar + badge_meet_greet_dylan + badge_meet_greet_adminextraordinaire + badge_meet_greet_robbie + badge_meet_greet_scott + badge_meet_greet_judy + badge_meet_greet_hammock + badge_meet_greet_trish + badge_meet_greet_rw + badge_meet_greet_john + badge_meet_greet_gcv + badge_meet_greet_m_craig + badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob + '</ul>' + badge_preview_link;

                        // Leaderboard Badges
                        badge_leaderboard_missing_insert = '<h4 style="border-bottom: 1px solid #d3d3d3; padding-bottom: 7px;">Leaderboard Badges</h4><ul id="badges-listing" class="list-inline">' + badge_leaderboard_king + badge_leaderboard_qw + badge_leaderboard_top10 + badge_leaderboard_top50 + badge_leaderboard_top100 + badge_leaderboard_top500 + badge_leaderboard_top1000 + badge_leaderboard_top2000 + badge_leaderboard_winner + badge_leaderboard_1stloser + badge_leaderboard_lucky + badge_leaderboard_unlucky + badge_leaderboard_lead21 + badge_leaderboard_lead42 + badge_leaderboard_lead50 + badge_leaderboard_lead100 + '</ul>' + badge_preview_link;

                        missing_badges.insertAdjacentHTML('beforebegin', badge_mhq_visit_missing_insert + badge_meet_greet_missing_insert + badge_leaderboard_missing_insert);
                        badge_category_count_inserts += 3;
                    }
                    // Komplett fehlende Kategorien 'Meet & Greet Badges' und 'Leaderboard Badges' nachbilden
                    else if(badge_category_count !== 0 && badge_category_before2 != 'Meet & Greet Badges' && badge_category_before1 != 'Leaderboard Badges') {
                        badge_meet_greet_missing_insert = '';
                        badge_leaderboard_missing_insert = '';

                        // Meet & Greet Badges
                        badge_meet_greet_missing_insert = '<h4 style="border-bottom: 1px solid #d3d3d3; padding-bottom: 7px;">Meet & Greet Badges</h4><ul id="badges-listing" class="list-inline">' + badge_meet_greet_makers + badge_meet_greet_reseller + badge_meet_greet_meetmatt + badge_meet_greet_meetlouise + badge_meet_greet_trey + badge_meet_greet_meetdaniel + badge_meet_greet_meetskylar + badge_meet_greet_dylan + badge_meet_greet_adminextraordinaire + badge_meet_greet_robbie + badge_meet_greet_scott + badge_meet_greet_judy + badge_meet_greet_hammock + badge_meet_greet_trish + badge_meet_greet_rw + badge_meet_greet_john + badge_meet_greet_gcv + badge_meet_greet_m_craig + badge_meet_greet_m_mick + badge_meet_greet_m_mari + badge_meet_greet_m_tamara + badge_meet_greet_m_teraca + badge_meet_greet_m_andy + badge_meet_greet_m_mizak + badge_meet_greet_m_rob + '</ul>' + badge_preview_link;

                        // Leaderboard Badges
                        badge_leaderboard_missing_insert = '<h4 style="border-bottom: 1px solid #d3d3d3; padding-bottom: 7px;">Leaderboard Badges</h4><ul id="badges-listing" class="list-inline">' + badge_leaderboard_king + badge_leaderboard_qw + badge_leaderboard_top10 + badge_leaderboard_top50 + badge_leaderboard_top100 + badge_leaderboard_top500 + badge_leaderboard_top1000 + badge_leaderboard_top2000 + badge_leaderboard_winner + badge_leaderboard_1stloser + badge_leaderboard_lucky + badge_leaderboard_unlucky + badge_leaderboard_lead21 + badge_leaderboard_lead42 + badge_leaderboard_lead50 + badge_leaderboard_lead100 + '</ul>' + badge_preview_link;

                        missing_badges.insertAdjacentHTML('beforebegin', badge_meet_greet_missing_insert + badge_leaderboard_missing_insert);
                        badge_category_count_inserts += 2;
                    }
                    // Komplett fehlende Kategorie 'Leaderboard Badges' nachbilden
                    else if(badge_category_count !== 0 && badge_category_before1 != 'Leaderboard Badges') {
                        missing_badges.insertAdjacentHTML('beforebegin', '<h4 style="border-bottom: 1px solid #d3d3d3; padding-bottom: 7px;">Leaderboard Badges</h4><ul id="badges-listing" class="list-inline">' + badge_leaderboard_king + badge_leaderboard_qw + badge_leaderboard_top10 + badge_leaderboard_top50 + badge_leaderboard_top100 + badge_leaderboard_top500 + badge_leaderboard_top1000 + badge_leaderboard_top2000 + badge_leaderboard_winner + badge_leaderboard_1stloser + badge_leaderboard_lucky + badge_leaderboard_unlucky + badge_leaderboard_lead21 + badge_leaderboard_lead42 + badge_leaderboard_lead50 + badge_leaderboard_lead100 + '</ul>' + badge_preview_link);
                        badge_category_count_inserts++;
                    }

                    // No hidden clan badges

                }

                else if(badge_category == 'Social Badges') {
                    var badge_social_innerHTML = document.getElementsByClassName('list-inline')[badge_category_count];
                    if(dev == 1) { missing_badges.innerHTML = badge_category_count + '. ' + missing_badges.innerHTML; }

                    // No hidden social badges

                }

                else if(badge_category == 'Destination Badges') {
                    var badge_destination_innerHTML = document.getElementsByClassName('list-inline')[badge_category_count];
                    if(dev == 1) { missing_badges.innerHTML = badge_category_count + '. ' + missing_badges.innerHTML; }

                    // No hidden destination badges

                }

                else if(badge_category == 'Rover Badges') {
                    var badge_rover_innerHTML = document.getElementsByClassName('list-inline')[badge_category_count];
                    if(dev == 1) { missing_badges.innerHTML = badge_category_count + '. ' + missing_badges.innerHTML; }

                    // No hidden rover badges

                }

                else if(badge_category == 'Eventzee Badges') {
                    var badge_eventzee_innerHTML = document.getElementsByClassName('list-inline')[badge_category_count];
                    if(dev == 1) { missing_badges.innerHTML = badge_category_count + '. ' + missing_badges.innerHTML; }

                    // No hidden eventzee badges

                }

                else if(badge_category == 'ZeeOps Badges') {
                    var badge_zeeops_innerHTML = document.getElementsByClassName('list-inline')[badge_category_count];
                    if(dev == 1) { missing_badges.innerHTML = badge_category_count + '. ' + missing_badges.innerHTML; }

                    var badge_zeeops_5zeeops3 = insert_badge('Walkie-Talkie Watch 2.0', 'Complete 5 Basic Operations in ZeeOps', '5zeeops3', '5zeeops3_null');
                    var badge_zeeops_5zeeops7 = insert_badge('Night Vision Goggles 2.0', 'Complete 5 Advanced Operations in ZeeOps', '5zeeops7', '5zeeops7_null');
                    var badge_zeeops_5zeeops10 = insert_badge('Laser Pen 2.0', 'Complete 5 Mega Operations in ZeeOps', '5zeeops10', '5zeeops10_null');
                    var badge_zeeops_5zeeops14 = insert_badge('Grappling Hook Briefcase 2.0', 'Complete 5 Ultra Operations in ZeeOps', '5zeeops14', '5zeeops14_null');

                    var badge_zeeops_count = 0;
                    var badge_zeeops_count_inserts = 0;
                    var badge_zeeops0 = badge_zeeops_innerHTML.getElementsByClassName('badge-helper');
                    var badge_zeeops_length = badge_zeeops_innerHTML.getElementsByClassName('badge-helper').length;
                    for(var bzo = 0, badge_zeeops; !!(badge_zeeops=badge_zeeops0[bzo]); bzo++) {
                        badge_zeeops_count = bzo + badge_zeeops_count_inserts;
                        var badge_zeeops_text = badge_zeeops.getAttribute("data-title");

                        if(badge_zeeops_count == 2 && badge_zeeops_text != 'Walkie-Talkie Watch 2.0') {
                            badge_zeeops.insertAdjacentHTML('beforebegin', badge_zeeops_5zeeops3);
                            badge_zeeops_count_inserts++;
                        }
                        if(badge_zeeops_count == 4 && badge_zeeops_text != 'Night Vision Goggles 2.0') {
                            badge_zeeops.insertAdjacentHTML('beforebegin', badge_zeeops_5zeeops7);
                            badge_zeeops_count_inserts++;
                        }
                        if(badge_zeeops_count == 6 && badge_zeeops_text != 'Laser Pen 2.0') {
                            badge_zeeops.insertAdjacentHTML('beforebegin', badge_zeeops_5zeeops10);
                            badge_zeeops_count_inserts++;
                        }
                        if(badge_zeeops_count == 8 && badge_zeeops_text != 'Grappling Hook Briefcase 2.0') {
                            badge_zeeops.insertAdjacentHTML('beforebegin', badge_zeeops_5zeeops14);
                            badge_zeeops_count_inserts++;
                        }
                        if(badge_zeeops_length == 5 && badge_zeeops_count == 6) {
                            badge_zeeops.insertAdjacentHTML('afterend', badge_zeeops_5zeeops14);
                            badge_zeeops_count_inserts++;
                        }
                    }

                }

                else if(badge_category == 'Event Host Badges') {
                    var badge_event_host_innerHTML = document.getElementsByClassName('list-inline')[badge_category_count];
                    if(dev == 1) { missing_badges.innerHTML = badge_category_count + '. ' + missing_badges.innerHTML; }

                    // todo

                }

                else if(badge_category == 'Event Badges') {
                    var badge_event_innerHTML = document.getElementsByClassName('list-inline')[badge_category_count];
                    if(dev == 1) { missing_badges.innerHTML = badge_category_count + '. ' + missing_badges.innerHTML; }

                    // Komplett fehlende Kategorie 'Event Host Badges' nachbilden
                    if(badge_category_count !== 0 && badge_category_before1 != 'Event Host Badges') {
                        missing_badges.insertAdjacentHTML('beforebegin', '<h4 style="border-bottom: 1px solid #d3d3d3; padding-bottom: 7px;">Event Host Badges</h4><ul id="badges-listing" class="list-inline">Keine Badges vorhanden.</ul>' + badge_preview_link);
                        badge_category_count_inserts++;
                    }

                    // todo

                }

                else if(badge_category == 'Fitness Badges') {
                    var badge_fitness_innerHTML = document.getElementsByClassName('list-inline')[badge_category_count];
                    if(dev == 1) { missing_badges.innerHTML = badge_category_count + '. ' + missing_badges.innerHTML; }

                    // No hidden fitness badges

                }

                else if(badge_category == 'Coinz Badges') {
                    var badge_coinz_innerHTML = document.getElementsByClassName('list-inline')[badge_category_count];
                    if(dev == 1) { missing_badges.innerHTML = badge_category_count + '. ' + missing_badges.innerHTML; }

                    var badge_coinz_coinvisit100 = insert_badge('The Claw', 'Visit 100 Munzee Coins', 'coinvisit100', 'sampler_null');
                    var badge_coinz_coinvisit500 = insert_badge('Skee Ball', 'Visit 500 Munzee Coins', 'coinvisit500', 'sampler_null');
                    var badge_coinz_coinvisit1000 = insert_badge('Munzee Arcade', 'Visit 1000 Munzee Coins', 'coinvisit1000', 'sampler_null');

                    var badge_coinz_count = 0;
                    var badge_coinz0 = badge_coinz_innerHTML.getElementsByClassName('badge-helper');
                    for(var bc = 0, badge_coinz; !!(badge_coinz=badge_coinz0[bc]); bc++) {
                        badge_coinz_count++;
                        var badge_coinz_text = badge_coinz.getAttribute("data-title");

                        if(badge_coinz_count == 1 && badge_coinz_text != 'The Claw') {
                            badge_coinz.insertAdjacentHTML('beforebegin', badge_coinz_coinvisit100 + badge_coinz_coinvisit500 + badge_coinz_coinvisit1000);
                            break;
                        } else {
                            if(badge_coinz_count == 2 && badge_coinz_text != 'Skee Ball') {
                                badge_coinz.insertAdjacentHTML('beforebegin', badge_coinz_coinvisit500 + badge_coinz_coinvisit1000);
                                break;
                            } else {
                                if(badge_coinz_count == 3 && badge_coinz_text != 'Munzee Arcade') {
                                    badge_coinz.insertAdjacentHTML('beforebegin', badge_coinz_coinvisit1000);
                                    break;
                                }
                            }
                        }
                    }
                }

            }

            // Großes Badgebild verlinken und Platzhalter ersetzen - Alte Badges
            var badge_big00 = document.getElementsByClassName('badge-helper');
            for(var bb0 = 0, badge_big0; !!(badge_big0=badge_big00[bb0]); bb0++) {
                var badge_small0_link = badge_big0.getElementsByTagName('IMG')[0].getAttribute('src');
                var badge_big0_link = badge_small0_link.replace('small/','');
                if(munzee_setting_badge_show == 'Badges') {
                    var badge_small0_link_showbadges = badge_small0_link.replace('_null','');
                    if(badge_small0_link_showbadges != badge_small0_link) {
                        badge_big0.getElementsByTagName('IMG')[0].setAttribute('src', badge_small0_link_showbadges);
                        badge_big0.getElementsByTagName("IMG")[0].setAttribute('class', 'black_white');
                        badge_big0_link = badge_small0_link_showbadges.replace('small/','');
                    }
                }
                var badge0_link = '<a data-fancybox data-type="image" href="javascript:;" style="color: #000000;" data-src="' + badge_big0_link + '">' + badge_big0.innerHTML + '</a>';
                badge_big0.innerHTML = badge0_link;
            }

            // Großes Badgebild verlinken und Platzhalter ersetzen - Neu eingefügte Badges
            var badge_big01 = document.getElementsByClassName('badge-helper-inserts');
            for(var bb1 = 0, badge_big1; !!(badge_big1=badge_big01[bb1]); bb1++) {
                var badge_small1_link = badge_big1.getElementsByTagName('IMG')[0].getAttribute('src');
                var badge_big1_link = badge_small1_link.replace('small/','');
                if(munzee_setting_badge_show == 'Badges') {
                    var badge_small1_link_showbadges = badge_small1_link.replace('_null','');
                    if(badge_small1_link_showbadges != badge_small1_link) {
                        badge_big1.getElementsByTagName('IMG')[0].setAttribute('src', badge_small1_link_showbadges);
                        badge_big1.getElementsByTagName("IMG")[0].setAttribute('class', 'black_white');
                        badge_big1_link = badge_small1_link_showbadges.replace('small/','');
                    }
                }
                var badge1_link = '<a data-fancybox data-type="image" href="javascript:;" style="color: #000000;" data-src="' + badge_big1_link + '">' + badge_big1.innerHTML + '</a>';
                badge_big1.innerHTML = badge1_link;
            }

        }

    }

    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        munzee_badges();
    } else {
        document.addEventListener("DOMContentLoaded", munzee_badges, false);
    }

})();