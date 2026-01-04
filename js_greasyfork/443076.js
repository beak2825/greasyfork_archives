// ==UserScript==
// @name        IG FortBattle Rotacja
// @include      http*://*.the-west.*/game.php*
// @version     1.0
// @author      Igorajs
// @description Lepsze wyświetlanie rotacji.
// @namespace https://greasyfork.org/users/899082
// @downloadURL https://update.greasyfork.org/scripts/443076/IG%20FortBattle%20Rotacja.user.js
// @updateURL https://update.greasyfork.org/scripts/443076/IG%20FortBattle%20Rotacja.meta.js
// ==/UserScript==
window.IG_rt = null;
window.IG_rtchar = null;
    FortBattle.flashShowCharacterInfo = function(fortId, playerId, healthNow, healthMax, totalDmg, lastDmg, shotat, bonusdata, char) {
        var cachekey = fortId + ':' + playerId;
        var cache = FortBattle.characterCache;
        var infopage, selfDefender, isDef, parsedData = JSON.parse(bonusdata), isAllied = parsedData.offense + parsedData.defense + parsedData.leadbonus != 0;
        if (cache.hasOwnProperty(cachekey)) {
            infopage = cache[cachekey];
            $('#fort_battle_' + fortId + '_infoarea').html(infopage.replace(/%hpWidth%/g, Math.floor(healthNow / healthMax * 85)).replace(/%healthNow%/g, healthNow).replace(/%healthMax%/g, healthMax).replace(/%totalDmg%/g, totalDmg).replace(/%lastDmg%/g, lastDmg).replace(/%bonusOffense%/g, parsedData.offense).replace(/%bonusDefense%/g, parsedData.defense).replace(/%bonusLead%/g, parsedData.leadbonus).replace(/%bonusDamage%/g, parsedData.damagebonus).replace(/%resistance%/g, parsedData.resistance).replace(/%teaminfo%/g, isAllied ? 'block' : 'none'));
            return;
        }
        if (char) {
            if(char.westPlayerId == Character.playerId){
                window.IG_rtchar = char;
                if(char.destinycell !== char.position){
                    $('.IG_rotacja').css( "color", "green" );
                }
                else{
                    $('.IG_rotacja').css( "color", "red" );
                    window.IG_rt = false;
                }
            }

            cache[cachekey] = FortBattle.getCharDataSheet({
                name: char.name,
                avatar: char.avatar,
                level: char.level,
                town: char.town,
                weapon: ItemManager.get(char.weapon).name,
                damage: {
                    damage_min: char.damage.damagemin,
                    damage_max: char.damage.damagemax
                },
                resistance: parsedData.resistance
            });
            FortBattle.flashShowCharacterInfo(fortId, playerId, healthNow, healthMax, totalDmg, lastDmg, shotat, bonusdata);
            return;
        }
        selfDefender = FortBattle.flashData['info' + fortId].isDefender;
        isDef = (!isAllied && !selfDefender) || (isAllied && selfDefender);
        Ajax.remoteCallMode('fort_battlepage', 'getPlayerDatasheet', {
            fort_id: fortId,
            playerId: playerId,
            isDefender: isDef
        }, function(resp) {
            cache[cachekey] = FortBattle.getCharDataSheet(resp);
            FortBattle.flashShowCharacterInfo(fortId, playerId, healthNow, healthMax, totalDmg, lastDmg, shotat, bonusdata);
        });
    }
    FortBattleWindow.showCharacterInfo = function() {
        var char = this.highlightPlayer;
        if(char.westPlayerId == Character.playerId){
            window.IG_rtchar = char;
        }
        if (!char) {
            FortBattle.flashHideCharacterInfo(this.fortId);
            return;
        }
        FortBattle.flashShowCharacterInfo(this.fortId, char.westPlayerId, char.health, char.healthmax, char.causeddamage, char.shotdmg, char.shotat, JSON.stringify(char.bonusinfo), char);
        $('.fort_battle_infoarea').append("<div class='IG_rotacja'>Rotacja</div>");
        if(IG_rtchar){
            if(IG_rt){
                $('.IG_rotacja').css( "color", "green" );
            }
            else{
                if(IG_rtchar.destinycell !== IG_rtchar.position && IG_rt){
                    $('.IG_rotacja').css( "color", "green" );
                }
                else{
                    $('.IG_rotacja').css( "color", "red" );
                    window.IG_rt = false;
                }
            }
        }
    }
    ;
FortBattleWindow.setSwapState = function (swapState) {
    $('.battleground_thick_arrow canvas').toggleClass('swapping', swapState);
    if(IG_rtchar.destinycell !== IG_rtchar.position && swapState){
        $('.IG_rotacja').css( "color", "green" );
        window.IG_rt = true;
    }
    else{
        $('.IG_rotacja').css( "color", "red" );
        window.IG_rt = false;
    }
};
    FortBattleWindow.updateBattleInfo = function() {
        var acnt = 0;
        var dcnt = 0;
        var c, j;
        for (j = 0; j < this.characters.length; j++) {
            c = this.characters[j];
            if (c.dead)
                continue;
            if (c.team > 0)
                acnt += 1;
            else
                dcnt += 1;
        }
        $('.IG_rotacja').css( "color", "red" );
        window.IG_rt = false;
        FortBattle.flashUpdateBattleInfo(this.fortId, acnt, dcnt);
    }
    ;