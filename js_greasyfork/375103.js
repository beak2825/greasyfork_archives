// ==UserScript==
// @name TW - TEST
// @namespace http://your.homepage/
// @version 0.3
// @description
// @author krikri72
// @include http*://*.the-west.*/game.php*
// @grant none
// @history 0.1 Implémentation du bouton dans le menu contextuel
// @history 0.1.1 Implémentation de l'interface
// @history 0.1.2 Implémantation de la localisation du joueur + centralisation sur la map
// @description test
// @downloadURL https://update.greasyfork.org/scripts/375103/TW%20-%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/375103/TW%20-%20TEST.meta.js
// ==/UserScript==

//Attributs
var AptitudeEnum = {
    CONSTRUIRE : {id: "id_build", nameF: "Construire", nameTW: "build",value: 0},
    PUISSANCE : {id: "id_punch", nameF: "Puissance", nameTW: "punch",value: 0},
    TENACITE : {id: "id_tough", nameF: "Ténacité", nameTW: "tough",value: 0},
    PERSEVERANCE : {id: "id_endurance", nameF: "Persévérance", nameTW: "endurance",value: 0},
    POINT_DE_VIE : {id: "id_health", nameF: "Point de vie", nameTW: "health",value: 0},
    MONTER_A_CHEVAL : {id: "id_ride", nameF: "Monter à cheval", nameTW: "ride",value: 0},
    REFLEXE : {id: "id_reflex", nameF: "Reflexe", nameTW: "reflex",value: 0},
    EVITER : {id: "id_dodge", nameF: "Eviter", nameTW: "dodge",value: 0},
    SE_CACHER : {id: "id_hide", nameF: "Se cacher", nameTW: "hide",value: 0},
    NAGER : {id: "id_swim", nameF: "Nager", nameTW: "swim",value: 0},
    VISER : {id: "id_aim", nameF: "Viser", nameTW: "aim",value: 0},
    TIRER : {id: "id_shot", nameF: "Tirer", nameTW: "shot",value: 0},
    PIEGER : {id: "id_pitfall", nameF: "Piéger", nameTW: "pitfall",value: 0},
    DEXTERITE : {id: "id_finger_dexterity", nameF: "Dextérité", nameTW: "finger_dexterity",value: 0},
    REPARER : {id: "id_repair", nameF: "Réparer", nameTW: "repair",value: 0},
    DIRIGER : {id: "id_leadership", nameF: "Diriger", nameTW: "leadership",value: 0},
    TACTIQUE : {id: "id_tactic", nameF: "Tactique", nameTW: "tactic",value: 0},
    MARCHANDER : {id: "id_trade", nameF: "Marchander", nameTW: "trade",value: 0},
    MANIER_LES_ANIMAUX : {id: "id_animal", nameF: "Manier les animaux", nameTW: "animal",value: 0},
    PRESTANCE : {id: "id_appearance", nameF: "Prestance", nameTW: "appearance",value: 0}
};

var AttributEnum = {
    FORCE : {id: "id_strength", nameF: "Force", nameTW: "strength", aptitudes: [AptitudeEnum.CONSTRUIRE, AptitudeEnum.PUISSANCE, AptitudeEnum.TENACITE, AptitudeEnum.PERSEVERANCE, AptitudeEnum.POINT_DE_VIE],value: 0},
    MOBILITE : {id: "id_flexibility", nameF: "Mobilité", nameTW: "flexibility", aptitudes: [AptitudeEnum.MONTER_A_CHEVAL, AptitudeEnum.REFLEXE, AptitudeEnum.EVITER, AptitudeEnum.SE_CACHER, AptitudeEnum.NAGER],value: 0},
    HABILITE : {id: "id_dexterity", nameF: "Habilité", nameTW: "dexterity", aptitudes: [AptitudeEnum.VISER, AptitudeEnum.TIRER, AptitudeEnum.PIEGER, AptitudeEnum.DEXTERITE, AptitudeEnum.REPARER],value: 0},
    CHARISME : {id: "id_charisma", nameF: "Charisme", nameTW: "charisma", aptitudes: [AptitudeEnum.DIRIGER, AptitudeEnum.TACTIQUE, AptitudeEnum.MARCHANDER, AptitudeEnum.MANIER_LES_ANIMAUX, AptitudeEnum.PRESTANCE],value: 0}
};

var calculEnCours = false;
var player_name, profil_player;


//Mise en place icone du menu contextuel
var icon =$('<div></div>').attr({
        'class': 'menulink',
        'title': 'The-West TEST'
    }).css({
        'background': 'url(https://www.aht.li/3313294/dudu.png)',
        'background-position': '0px 0px',
        'background-repeat': 'no-repeat'
    }).click(function() {
        openWindow();
    });
    var bottom = $('<div></div>').attr({
        'class': 'menucontainer_bottom'
    });

$('#ui_menubar .ui_menucontainer:last').after($('<div></div>').attr({
    'class': 'ui_menucontainer',
    'id': 'TEST'
}).append(icon).append(bottom));

/*
* Ouverture de la fenêtre de script
*/
function openWindow() {
    var url_html = "https://sd-g1.archive-host.com/membres/up/4cb3ab538ce2e53d17337662345af8960363b70e/Script/Fichiers/V03/html.txt";
    var url_version = "https://sd-g1.archive-host.com/membres/up/4cb3ab538ce2e53d17337662345af8960363b70e/Script/Fichiers/V03/last_version.txt";
    var input_player;

    //Version
    $.get(url_version, {}).done(function(data) {
        checkVersion(data.last_version);
    });

    //html
    $.get(url_html, {}).done(function(data) {
        input_player = data.html_form;

        //Creation de l'onglet "Localisation"
        var localisation_tab = $(new west.gui.Scrollpane().appendContent(input_player).getMainDiv()).css('margin-top','6px');

        //Ouverture de la popUp
        wman.open("TW_Test").setTitle("TEST").setMiniTitle('TEST').addTab("Localisation").appendToContentPane(localisation_tab);

        //Localisation et centrer
        $('#id_research_map').click(function() {
            player_name = $('#id_player').val();
            resetData();
            $("#id_skills_player").hide();
            $("#id_info_duel").hide();
            locateAndCenter(player_name);
        });

        //Calculer stat tenue
        $('#id_calculate_stat').click(function() {
            player_name = $('#id_player').val();
            if (!calculEnCours) {
                resetData();
                calculateStat(player_name);
            }
        });

        //Event change player
        $('#id_player').change(function() {
            resetData();
        });

        $("#id_skills_player").hide();
        $("#id_info_duel").hide();
    }).fail(function() {
            new UserMessage("Erreur", UserMessage.TYPE_ERROR).show();
    });
};

/*
* Gestion du versoning
*/
function checkVersion(last_version) {
    var url_script = "https://greasyfork.org/fr/scripts/375103-tw-test/code.user.js";
    var version_script = GM_info.script.version;

    if (parseFloat(last_version) > version_script) {
        var updatedialog = new west.gui.Dialog("Versioning Script", "Version v" + last_version, west.gui.Dialog.SYS_WARNING).addButton("Mettre à jour", function() {
            updatedialog.hide();
            location.href = url_script;
        }).addButton('cancel').show();
    }
};

/*
* Remise a zero des donnees
*/
function resetData() {
    //Effacer les précédentes données
    Object.values(AttributEnum).forEach(function(attribut) {
        attribut.value = 0;
        document.getElementById(attribut.id).innerHTML = attribut.value;
    });
    Object.values(AptitudeEnum).forEach(function(aptitude) {
        aptitude.value = 0;
        document.getElementById(aptitude.id).innerHTML = aptitude.value;
    });
    //Message d'erreur
    $('#error').text("");
};

function getDataPlayer(player_name, callback) {
    if (player_name != "") {
        return Ajax.remoteCallMode('ranking', 'get_data', {
            search: player_name,
            tab: "experience"
        }).done(function(json_list_player) {
            if (json_list_player.error)
                 new UserMessage(json_list_player.message, UserMessage.TYPE_ERROR).show();
            //Parcourir les resultats
            player_search = json_list_player.ranking.filter(player => player.name == player_name);
        }).fail(function() {
                new UserMessage("Erreur", UserMessage.TYPE_ERROR).show();
        });
    } else {
        $("#id_skills_player").hide();
        $("#id_info_duel").hide();
        $('#error').text("Veuillez saisir un pseudo d'un joueur");
    }
}

function getProfilPlayer(player_search, callback) {
     if (player_search.length > 0) {
        return Ajax.remoteCallMode('profile', 'init', {
                playerId: player_search[0].player_id
            }).done(function(json_profil) {
                if (json_profil.error) {
                    new UserMessage(json_profil.message, UserMessage.TYPE_ERROR).show();
                }
                profil_player = json_profil;
            }).fail(function() {
                    new UserMessage("Erreur", UserMessage.TYPE_ERROR).show();
            });
    } else {
        $("#id_skills_player").hide();
        $("#id_info_duel").hide();
        $('#error').text("Le pseudo saisi est inconnu");
    }
}

function getInfoDuel(profil_player) {
    var wanted = profil_player.wanted;
    $('#id_lvl_duel').text(wanted.duellevel);
    $('#id_dead_amount').text(wanted.amount != null ? wanted.amount : 0);
    $('#id_not_dead_amount').text(wanted.not_dead_amount != null ? wanted.not_dead_amount : 0);
    
    if (wanted.isDuelable) {
        $('#id_ko').text("Oui");
    } else {
        $('#id_ko').text("Non");
    }
}

/*
* Localisation et centrer le joueur sur la map
*/
function locateAndCenter(player_name){
     var _dataPlayer = getDataPlayer(player_name);
    if (_dataPlayer !== undefined) {
        _dataPlayer.done(function() {
            var _profilPlayer = getProfilPlayer(player_search);
             if (_profilPlayer !== undefined) {
                _profilPlayer.done(function() {
                    getInfoDuel(profil_player);
                    Map.center(profil_player.x,profil_player.y);
                });
            }
        });
    }
};

/*
* Calculer les statistiques de la tenue du joueur})
*/
function calculateStat(player_name){
    var _dataPlayer = getDataPlayer(player_name);
    if (_dataPlayer !== undefined) {
        _dataPlayer.done(function() {
            var _profilPlayer = getProfilPlayer(player_search);
             if (_profilPlayer !== undefined) {
                _profilPlayer.done(function() {
                    $("#id_info_duel").show();
                    $("#id_skills_player").show();
                    calculEnCours = true;
                    getInfoDuel(profil_player);
                    getSkillPlayer(profil_player);
                });
            }
        });
    }
};

/*
* Recuperation des stats des fringues du joueur
*/
function getSkillPlayer(json_profil) {
    var tab_wear = [];
    var attributesAndSkills=[];
    var setNameList = [];

    Object.entries(json_profil.wear).forEach(([key, value]) => {
        if (key !== "player_id")
            tab_wear.push(ItemManager.get(parseInt(value)));
    });

    tab_wear.forEach(function(wear) {
        if (wear !== undefined) {
            var item_level= wear.item_level;
            var find = false;
            var isLvlBonus;

            setNameList.forEach(function(setN) {
                if (setN.name === wear.set) {
                    setN.nbr++;
                    find = true;
                }
            });

            //Ajout stat tenue non bonus niveau
            attributesAndSkills.push(wear.bonus.attributes);
            attributesAndSkills.push(wear.bonus.skills);

            attributesAndSkills.forEach(function(attributeOrSkill) {
                Object.entries(attributeOrSkill).forEach(([key, value]) => {
                    calculateDetailsStat(key, value, json_profil.level, false, item_level);
                });
                isLvlBonus = false;
            });

            //Ajout stat tenue bonus niveau
            attributesAndSkills = [];
            var obj;
            var key;
            var value;
            wear.bonus.item.forEach(function(item) {
                if (item.bonus !== undefined) {
                    obj = {
                        name: item.bonus.name,
                        value: item.bonus.value
                    };
                    key = Object.entries(obj)[0][1];
                    value = Object.entries(obj)[1][1];

                   calculateDetailsStat(key, value, json_profil.level, true, item_level);
                }
                isLvlBonus = true;
            });
            if (!find) {
                    var set = {};
                    set.name = wear.set;
                    set.nbr = 1;
                    set.lvlbonus = isLvlBonus;
                    setNameList.push(set);
            }
        }
    });

    var url_set = "https://sd-g1.archive-host.com/membres/up/4cb3ab538ce2e53d17337662345af8960363b70e/Script/Fichiers/V03/sets.txt";
    $.get(url_set, {}).done(function(data) {
        setNameList.forEach(function(setN) {
            Object.entries(data).forEach(([key, value]) => {
                if (key == setN.name) {
                    Object.entries(value).forEach(([key, value]) => {
                        Object.entries(value).forEach(([key, value]) => {
                             if (key == setN.nbr) {
                                Object.entries(value).forEach(([key, value]) => {
                                    calculateDetailsStat(key, value, json_profil.level, setN.lvlbonus, 0);
                                });
                             }
                        });
                    });
                }
            });
        });
        calculEnCours = false;
    });
};

/*
* Calcul des statistiques de la tenue
*/
function calculateDetailsStat(key, value, lvl_player, isBonusNiveau, lvl_item) {
    switch (key) {
        case (AttributEnum.FORCE.nameTW):
            AttributEnum.FORCE.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AttributEnum.FORCE.id).innerHTML = AttributEnum.FORCE.value;
            AttributEnum.FORCE.aptitudes.forEach(function(aptitude) {
                calculateDetailsStat(aptitude.nameTW, value, lvl_player, isBonusNiveau, lvl_item);
            });
            break;
        case (AttributEnum.MOBILITE.nameTW):
            AttributEnum.MOBILITE.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AttributEnum.MOBILITE.id).innerHTML = AttributEnum.MOBILITE.value;
            AttributEnum.MOBILITE.aptitudes.forEach(function(aptitude) {
                calculateDetailsStat(aptitude.nameTW, value, lvl_player, isBonusNiveau, lvl_item);
            });
            break;
        case (AttributEnum.HABILITE.nameTW):
            AttributEnum.HABILITE.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AttributEnum.HABILITE.id).innerHTML = AttributEnum.HABILITE.value;
            AttributEnum.HABILITE.aptitudes.forEach(function(aptitude) {
                calculateDetailsStat(aptitude.nameTW, value, lvl_player, isBonusNiveau, lvl_item);
            });
            break;
        case (AttributEnum.CHARISME.nameTW):
            AttributEnum.CHARISME.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AttributEnum.CHARISME.id).innerHTML = AttributEnum.CHARISME.value;
            AttributEnum.CHARISME.aptitudes.forEach(function(aptitude) {
                calculateDetailsStat(aptitude.nameTW, value, lvl_player, isBonusNiveau, lvl_item);
            });
            break;
        case (AptitudeEnum.CONSTRUIRE.nameTW):
            AptitudeEnum.CONSTRUIRE.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AptitudeEnum.CONSTRUIRE.id).innerHTML = AptitudeEnum.CONSTRUIRE.value;
            break;
        case (AptitudeEnum.PUISSANCE.nameTW):
            AptitudeEnum.PUISSANCE.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AptitudeEnum.PUISSANCE.id).innerHTML = AptitudeEnum.PUISSANCE.value;
            break;
        case (AptitudeEnum.TENACITE.nameTW):
            AptitudeEnum.TENACITE.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AptitudeEnum.TENACITE.id).innerHTML = AptitudeEnum.TENACITE.value;
            break;
        case (AptitudeEnum.PERSEVERANCE.nameTW):
            AptitudeEnum.PERSEVERANCE.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AptitudeEnum.PERSEVERANCE.id).innerHTML = AptitudeEnum.PERSEVERANCE.value;
            break;
        case (AptitudeEnum.POINT_DE_VIE.nameTW):
            AptitudeEnum.POINT_DE_VIE.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AptitudeEnum.POINT_DE_VIE.id).innerHTML = AptitudeEnum.POINT_DE_VIE.value;
            break;
        case (AptitudeEnum.MONTER_A_CHEVAL.nameTW):
            AptitudeEnum.MONTER_A_CHEVAL.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AptitudeEnum.MONTER_A_CHEVAL.id).innerHTML = AptitudeEnum.MONTER_A_CHEVAL.value;
            break;
        case (AptitudeEnum.REFLEXE.nameTW):
            AptitudeEnum.REFLEXE.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AptitudeEnum.REFLEXE.id).innerHTML = AptitudeEnum.REFLEXE.value;
            break;
        case (AptitudeEnum.EVITER.nameTW):
            AptitudeEnum.EVITER.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AptitudeEnum.EVITER.id).innerHTML = AptitudeEnum.EVITER.value;
            break;
        case (AptitudeEnum.SE_CACHER.nameTW):
            AptitudeEnum.SE_CACHER.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AptitudeEnum.SE_CACHER.id).innerHTML = AptitudeEnum.SE_CACHER.value;
            break;
        case (AptitudeEnum.NAGER.nameTW):
            AptitudeEnum.NAGER.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AptitudeEnum.NAGER.id).innerHTML = AptitudeEnum.NAGER.value;
            break;
        case (AptitudeEnum.VISER.nameTW):
            AptitudeEnum.VISER.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AptitudeEnum.VISER.id).innerHTML = AptitudeEnum.VISER.value;
            break;
        case (AptitudeEnum.TIRER.nameTW):
            AptitudeEnum.TIRER.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AptitudeEnum.TIRER.id).innerHTML = AptitudeEnum.TIRER.value;
            break;
        case (AptitudeEnum.PIEGER.nameTW):
            AptitudeEnum.PIEGER.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AptitudeEnum.PIEGER.id).innerHTML = AptitudeEnum.PIEGER.value;
            break;
        case (AptitudeEnum.DEXTERITE.nameTW):
            AptitudeEnum.DEXTERITE.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AptitudeEnum.DEXTERITE.id).innerHTML = AptitudeEnum.DEXTERITE.value;
            break;
        case (AptitudeEnum.REPARER.nameTW):
            AptitudeEnum.REPARER.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AptitudeEnum.REPARER.id).innerHTML = AptitudeEnum.REPARER.value;
            break;
        case (AptitudeEnum.DIRIGER.nameTW):
            AptitudeEnum.DIRIGER.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AptitudeEnum.DIRIGER.id).innerHTML = AptitudeEnum.DIRIGER.value;
            break;
        case (AptitudeEnum.TACTIQUE.nameTW):
            AptitudeEnum.TACTIQUE.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AptitudeEnum.TACTIQUE.id).innerHTML = AptitudeEnum.TACTIQUE.value;
            break;
        case (AptitudeEnum.MARCHANDER.nameTW):
            AptitudeEnum.MARCHANDER.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AptitudeEnum.MARCHANDER.id).innerHTML = AptitudeEnum.MARCHANDER.value;
            break;
        case (AptitudeEnum.MANIER_LES_ANIMAUX.nameTW):
            AptitudeEnum.MANIER_LES_ANIMAUX.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AptitudeEnum.MANIER_LES_ANIMAUX.id).innerHTML = AptitudeEnum.MANIER_LES_ANIMAUX.value;
            break;
        case (AptitudeEnum.PRESTANCE.nameTW):
            AptitudeEnum.PRESTANCE.value += bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item);
            document.getElementById(AptitudeEnum.PRESTANCE.id).innerHTML = AptitudeEnum.PRESTANCE.value;
            break;
    }
}

/*
* Calcul des statistiques de la tenue
*/
function bonusOrNotBonusLevel(value, lvl_player, isBonusNiveau, lvl_item) {
     var calculateValue = value;
     var bonus_lvl = 0;
        
    bonus_lvl = 0.1 * value * parseFloat(lvl_item);

    if (isBonusNiveau) {
        calculateValue = Math.ceil(lvl_player * value)  + Math.ceil(lvl_player * bonus_lvl);
    } else {
        calculateValue = Math.ceil(value);
    }
    return calculateValue;
};