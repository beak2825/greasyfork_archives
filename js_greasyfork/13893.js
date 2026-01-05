// ==UserScript==
// @name TW - Inventory Data
// @namespace http://your.homepage/
// @version 0.8
// @description Récupération de données liés aux items dans l'inventaire du joueur
// @author krikri72
// @include http*://*.the-west.*/game.php*
// @grant none
// @history 	0.4     Prise en compte des bonus / level
// @history 	0.5     Prise en compte des améliorations pour les bonus / lvl + Simplication du chargement des listes d'items
// @history 	0.6     Remise de l'export sous forme txt
// @history 	0.7     Amélioration du code + Arrondi 5 chiffres pour bonus
// @history 	0.8     Mise à jour image
// @downloadURL https://update.greasyfork.org/scripts/13893/TW%20-%20Inventory%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/13893/TW%20-%20Inventory%20Data.meta.js
// ==/UserScript==
var icon = $('<div></div>').attr({
                'class': 'menulink',
                'title': 'TW - Inventory Data'
            }).css({
                'background': 'url(https://www.aht.li/3313286/sav-size.png)',
                'background-position': '0px 0px',
                'background-repeat': 'no-repeat'
            }).click(function() {
                start();
            });
            var bottom = $('<div></div>').attr({
                'class': 'menucontainer_bottom'
            });
            $('#ui_menubar .ui_menucontainer:last').after($('<div></div>').attr({
                'class': 'ui_menucontainer',
                'id': 'TEST'
            }).append(icon).append(bottom));
function start(){
    //Variables
    var isSkills;
    var isArmeBDF = false;
    var reg_espace = new RegExp("[ ]+", "g");
    var reg_plus = new RegExp("[+]", "g");
    var reg_virgule = new RegExp("[,]", "g");
    var bonusA = 0;
    
    //Propriétés Joueur
    //var lvlPlayer = Character.level;
    
    //Propriétés Item
    var EnumProprieteItems = {
        BALISE : {value: ""},
        NAME : {value: ""},
        LEVEL : {value: ""},
        LEVEL_AME : {value: ""},
        TYPE : {value: ""}
    };
    
    //Propriétés Dégats
    var EnumDegats = {
        DEGAT_MINI : {value: 0},
        DEGAT_MAXI : {value: 0}
    };
    var damage;
    
    //Bonus
    var bonus;
    var stringBonus, bonusLevel, nameSkill, tabSkill;
    
    //Aptitudes
    var attributes;
    
    //Attributs
    var skills;
        
    //Enumération skills
    var EnumSkills = {
        DIRIGER : {value: 0, nameF: "Diriger", nameTW: "leadership"}, 
        VISER : {value: 0, nameF: "Viser", nameTW: "aim"}, 
        EVITER : {value: 0, nameF: "Éviter", nameTW: "dodge"}, 
        SE_CACHER : {value: 0, nameF: "Se cacher", nameTW: "hide"}, 
        PERSEVERANCE : {value: 0, nameF: "Persévérance", nameTW: "endurance"}, 
        POINTS_DE_VIE : {value: 0, nameF: "Points de vie", nameTW: "health"},
        FORCE : {value: 0, nameF: "Force", nameTW: "strength"}, 
        MOBILITE : {value: 0, nameF: "Mobilité", nameTW: "flexibility"}, 
        HABILITE : {value: 0, nameF: "Habilité", nameTW: "dexterity"}, 
        CHARISME : {value: 0, nameF: "Charisme", nameTW: "charisma"}, 
        DEGAT : {value: 0, nameF: "dégâts"}
    };
    
    //Enumération type item
    var EnumType = {
        ANIMAL : {nameTW: "animal", nameF: "Animal", liste:Bag.items_by_type.animal}, 
        ARME_BDF : {nameTW: "left_arm", nameF: "Arme BDF", liste:Bag.items_by_type.left_arm}, 
        ARME_DUDU : {nameTW: "right_arm", nameF: "Arme Dudu", liste:Bag.items_by_type.right_arm}, 
        PANTALON : {nameTW: "pants", nameF: "Pantalon", liste:Bag.items_by_type.pants}, 
        HABILLEMENT : {nameTW: "body", nameF: "Habillement", liste:Bag.items_by_type.body}, 
        COLLIER : {nameTW: "neck", nameF: "Collier", liste:Bag.items_by_type.neck},
        BOTTE : {nameTW: "foot", nameF: "Botte", liste:Bag.items_by_type.foot}, 
        CEINTURE : {nameTW: "belt", nameF: "Ceinture", liste:Bag.items_by_type.belt},
        CHAPEAU : {nameTW: "head", nameF: "Chapeau", liste:Bag.items_by_type.head},
        PRODUIT : {nameTW: "yield", nameF: "Produit", liste:Bag.items_by_type.yield}
    };
    
    var listeItem = recuperationItems();
    var item, stringExport = '';
    for (i = 0; i < listeItem.length; i++)
    {
        item = ItemManager.get(parseInt(listeItem[i]));
        
        //Traitement des propriétés
        traitementProprietes();
        
        //Traitement des bonus
        bonus = item.bonus.item;
        if (bonus.length > 0)
            traitementBonus();
        
        //Traitement des dégâts
        damage = item.damage;
        if (EnumType.ARME_BDF.nameTW == EnumProprieteItems.TYPE)
            traitementDamages();
        
        //Traitement des aptitudes
        attributes = item.bonus.attributes;
        if (attributes != null)
            traitementAttributes();
        
        //Traitement des attributs
        skills = item.bonus.skills;
        if (skills != null)
            traitementSkills();
        
        if (!isBonusBDF())
            stringExport += ecrireInfos();
        else
            stringExport += ecrireInfos();
         
        remiseAZero();
    }
    console.log(stringExport);
    
    //Export document
    document.location = "data:text/tab-separated-values," + encodeURIComponent(stringExport);
    
    function recuperationItems(){
        var liste = EnumType.ANIMAL.liste + ',';
        liste += EnumType.CEINTURE.liste + ',';
        liste += EnumType.HABILLEMENT.liste + ',';
        liste += EnumType.BOTTE.liste + ',';
        liste += EnumType.ARME_DUDU.liste + ',';
        liste += EnumType.CHAPEAU.liste + ',';
        liste += EnumType.COLLIER.liste + ',';
        liste += EnumType.PANTALON.liste + ',';
        liste += EnumType.ARME_BDF.liste + ',';
        liste += EnumType.PRODUIT.liste;
        return liste.split(reg_virgule);
    }
    
    function traitementProprietes(){
        EnumProprieteItems.BALISE = item.item_id;
        EnumProprieteItems.NAME = item.name;
        EnumProprieteItems.LEVEL = item.level;
        EnumProprieteItems.LEVEL_AME = item.item_level;
        EnumProprieteItems.TYPE = item.type;
    };
    
    function traitementBonus(){
        for (j = 0; j < bonus.length; j++){
            stringBonus = bonus[j].desc;
            tabSkill = stringBonus.split(reg_espace);

            bonusLevel = tabSkill[0].replace(reg_plus,"");
            
            if (tabSkill.length == 5)
                nameSkill = tabSkill[1] + ' ' + tabSkill[2];
            else if (tabSkill.length == 6)
                nameSkill = tabSkill[1] + ' ' + tabSkill[2] + ' ' + tabSkill[3];
            else 
                nameSkill = tabSkill[1];
            ajoutBonus();
        };    
    };
    
    function ajoutBonus(){
        //var addBonus = Math.ceil(bonusLevel * parseInt(lvlPlayer)); // A enlever TW pas besoin 
        if (EnumProprieteItems.LEVEL_AME > 0)
            bonusA = 0.1 * EnumProprieteItems.LEVEL_AME;
        var value = Math.round((parseFloat(bonusLevel) + bonusA * parseFloat(bonusLevel))*100000)/100000;
        switch (nameSkill) {
            case (EnumSkills.DEGAT.nameF):
                EnumSkills.DEGAT.value = value;
                break;
            case (EnumSkills.DIRIGER.nameF):
                EnumSkills.DIRIGER.value = value;
                break;
            case (EnumSkills.VISER.nameF):
                EnumSkills.VISER.value = value;
                break;
            case (EnumSkills.EVITER.nameF):
                EnumSkills.EVITER.value = value;
                break;
            case (EnumSkills.SE_CACHER.nameF):
                EnumSkills.SE_CACHER.value = value;
                break;
            case (EnumSkills.PERSEVERANCE.nameF):
                EnumSkills.PERSEVERANCE.value = value;
                break;
            case (EnumSkills.POINTS_DE_VIE.nameF):
                EnumSkills.POINTS_DE_VIE.value = value;
                break;
            case (EnumSkills.FORCE.nameF):
                EnumSkills.FORCE.value = value;
                break;
            case (EnumSkills.MOBILITE.nameF):
                EnumSkills.MOBILITE.value = value;
                break;
            case (EnumSkills.HABILITE.nameF):
                EnumSkills.HABILITE.value = value;
                break;
            case (EnumSkills.CHARISME.nameF):
               EnumSkills.CHARISME.value = value;
                break;
        };
    };
    
    function traitementAttributes(){
        if (attributes[EnumSkills.FORCE.nameTW] != null)
            EnumSkills.POINTS_DE_VIE.value = EnumSkills.PERSEVERANCE.value = parseInt(attributes[EnumSkills.FORCE.nameTW]);
        if (attributes[EnumSkills.MOBILITE.nameTW] != null)
            EnumSkills.EVITER.value = EnumSkills.SE_CACHER.value = parseInt(attributes[EnumSkills.MOBILITE.nameTW]);
        if (attributes[EnumSkills.HABILITE.nameTW] != null)
            EnumSkills.VISER.value = parseInt(attributes[EnumSkills.HABILITE.nameTW]); 
        if (attributes[EnumSkills.CHARISME.nameTW] != null)
            EnumSkills.DIRIGER.value = parseInt(attributes[EnumSkills.CHARISME.nameTW]);
    };
    
    function traitementSkills(){
        if (skills[EnumSkills.DIRIGER.nameTW] != null)
            EnumSkills.DIRIGER.value = parseInt(EnumSkills.DIRIGER.value) + parseInt(skills[EnumSkills.DIRIGER.nameTW]);
        if (skills[EnumSkills.VISER.nameTW] != null)
            EnumSkills.VISER.value = parseInt(EnumSkills.VISER.value) + parseInt(skills[EnumSkills.VISER.nameTW]);
        if (skills[EnumSkills.EVITER.nameTW] != null)
            EnumSkills.EVITER.value = parseInt(EnumSkills.EVITER.value) + parseInt(skills[EnumSkills.EVITER.nameTW]);
        if (skills[EnumSkills.SE_CACHER.nameTW] != null)
            EnumSkills.SE_CACHER.value = parseInt(EnumSkills.SE_CACHER.value) + parseInt(skills[EnumSkills.SE_CACHER.nameTW]);
        if (skills[EnumSkills.PERSEVERANCE.nameTW] != null)
            EnumSkills.PERSEVERANCE.value = parseInt(EnumSkills.PERSEVERANCE.value) + parseInt(skills[EnumSkills.PERSEVERANCE.nameTW]);
        if (skills[EnumSkills.POINTS_DE_VIE.nameTW] != null)
            EnumSkills.POINTS_DE_VIE.value = parseInt(EnumSkills.POINTS_DE_VIE.value) + parseInt(skills[EnumSkills.POINTS_DE_VIE.nameTW]);
    };
    
    
    function isBonusBDF(){
        var sommeBonus = EnumSkills.DIRIGER.value + EnumSkills.VISER.value + EnumSkills.EVITER.value + EnumSkills.SE_CACHER.value + EnumSkills.PERSEVERANCE.value + EnumSkills.POINTS_DE_VIE.value + EnumSkills.FORCE.value + EnumSkills.CHARISME.value + EnumSkills.MOBILITE.value + EnumSkills.HABILITE.value;
        if (sommeBonus == 0)
            isSkills = false;
        else
            isSkills = true;
    }
    
    function remiseAZero(){
        EnumSkills.DIRIGER.value =  EnumSkills.VISER.value = EnumSkills.EVITER.value = EnumSkills.SE_CACHER.value = EnumSkills.PERSEVERANCE.value = EnumSkills.POINTS_DE_VIE.value = 0;
        EnumSkills.FORCE.value = EnumSkills.MOBILITE.value = EnumSkills.HABILITE.value = EnumSkills.CHARISME.value = 0;
        EnumSkills.DEGAT.value = EnumDegats.DEGAT_MAXI.value = EnumDegats.DEGAT_MINI.value = 0;
        bonus = skills = attributes = null;
        bonusA = 0;
        isArmeBDF = false;
        lvlAItem = 0;
    };
    
    function ecrireInfos(){
        var detail = '[item=' + EnumProprieteItems.BALISE + ']';
        detail += ' | ';
        switch (EnumProprieteItems.TYPE) {
            case EnumType.ANIMAL.nameTW:
                detail += EnumType.ANIMAL.nameF;
                break;
            case EnumType.CEINTURE.nameTW:
                detail += EnumType.CEINTURE.nameF;
                break;
            case EnumType.BOTTE.nameTW:
                detail += EnumType.BOTTE.nameF;
                break;
            case EnumType.HABILLEMENT.nameTW:
                detail += EnumType.HABILLEMENT.nameF;
                break;
            case EnumType.ARME_DUDU.nameTW:
                detail += EnumType.ARME_DUDU.nameF;
                break;
            case EnumType.ARME_BDF.nameTW:
                detail += EnumType.ARME_BDF.nameF;
                break; 
            case EnumType.COLLIER.nameTW:
                detail += EnumType.COLLIER.nameF;
                break;
            case EnumType.PANTALON.nameTW:
                detail += EnumType.PANTALON.nameF;
                break;
            case EnumType.CHAPEAU.nameTW:
                detail += EnumType.CHAPEAU.nameF;
                break; 
            case EnumType.PRODUIT.nameTW:
                detail += EnumType.PRODUIT.nameF;
                break;
        };
        detail += ' | ' + EnumProprieteItems.NAME;
        if (EnumProprieteItems.LEVEL_AME != 0)
            detail += '(' + EnumProprieteItems.LEVEL_AME + ' lvlA)';
        detail += ' | ' + EnumProprieteItems.LEVEL;
        if (isSkills) {
            detail += ' |';
            if (EnumSkills.FORCE.value != 0)
                detail += ' Force : ' + EnumSkills.FORCE.value; 
            if (EnumSkills.MOBILITE.value != 0)
                detail += ' Mobilité : ' + EnumSkills.MOBILITE.value;
            if (EnumSkills.HABILITE.value != 0)
                detail += ' Habilité : ' + EnumSkills.HABILITE.value;
            if (EnumSkills.CHARISME.value != 0)
                detail += ' Charisme : ' + EnumSkills.CHARISME.value;
            if (EnumSkills.DIRIGER.value != 0)
                detail += ' Diriger : ' + EnumSkills.DIRIGER.value;
            if (EnumSkills.VISER.value != 0)
                detail += ' Viser : ' + EnumSkills.VISER.value; 
            if (EnumSkills.EVITER.value != 0)
                detail += ' Eviter : ' + EnumSkills.EVITER.value; 
            if (EnumSkills.SE_CACHER.value != 0)
                detail += ' Se cacher : ' + EnumSkills.SE_CACHER.value;
            if (EnumSkills.PERSEVERANCE.value != 0)
                detail += ' Persévérence : ' + EnumSkills.PERSEVERANCE.value;
            if (EnumSkills.POINTS_DE_VIE.value != 0)
                detail += ' Points de vie : ' + EnumSkills.POINTS_DE_VIE.value;
        }
        if (isArmeBDF) 
            detail += ' | Dégâts Mini : ' + EnumDegats.DEGAT_MINI.value + '; Dégâts Maxi : ' + EnumDegats.DEGAT_MAXI.value;
        if (EnumSkills.DEGAT.value != 0)
            detail += ' | Bonus dégâts : ' + EnumSkills.DEGAT.value;
        detail += '\n';
        if (!isSkills && !isArmeBDF)
            detail = '';
        return detail;
    };
    
    function traitementDamages(){
        isArmeBDF = true;
        if (EnumProprieteItems.LEVEL_AME > 0)
            bonusA = EnumProprieteItems.LEVEL_AME * 0.1;
        EnumDegats.DEGAT_MAXI.value = Math.floor(damage.damage_max + bonusA * damage.damage_max);
        EnumDegats.DEGAT_MINI.value = Math.floor(damage.damage_min + bonusA * damage.damage_min);
    };
};