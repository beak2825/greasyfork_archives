// ==UserScript==
// @name         皇室战争卡组分数助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  依据个人卡牌等级显示推荐卡组的分数，以便更好选择卡组打天梯。
// @author       jy
// @match        http://statsroyale.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://code.jquery.com/jquery-3.2.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/38917/%E7%9A%87%E5%AE%A4%E6%88%98%E4%BA%89%E5%8D%A1%E7%BB%84%E5%88%86%E6%95%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/38917/%E7%9A%87%E5%AE%A4%E6%88%98%E4%BA%89%E5%8D%A1%E7%BB%84%E5%88%86%E6%95%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var mjq=jQuery.noConflict(true);
    var cardsRarity={"Skeletons":{"rarity":"Common"},"Ice+Spirit":{"rarity":"Common"},"Goblins":{"rarity":"Common"},"Spear+Goblins":{"rarity":"Common"},"Fire+Spirits":{"rarity":"Common"},"Bats":{"rarity":"Common"},"Knight":{"rarity":"Common"},"Archers":{"rarity":"Common"},"Minions":{"rarity":"Common"},"Bomber":{"rarity":"Common"},"Goblin+Gang":{"rarity":"Common"},"Skeleton+Barrel":{"rarity":"Common"},"Barbarians":{"rarity":"Common"},"Minion+Horde":{"rarity":"Common"},"Royal+Giant":{"rarity":"Common"},"Elite+Barbarians":{"rarity":"Common"},"Skeleton+Army":{"rarity":"Epic"},"Guards":{"rarity":"Epic"},"Baby+Dragon":{"rarity":"Epic"},"Dark+Prince":{"rarity":"Epic"},"Hunter":{"rarity":"Epic"},"Balloon":{"rarity":"Epic"},"Witch":{"rarity":"Epic"},"Prince":{"rarity":"Epic"},"Bowler":{"rarity":"Epic"},"Executioner":{"rarity":"Epic"},"Cannon+Cart":{"rarity":"Epic"},"Giant+Skeleton":{"rarity":"Epic"},"P.E.K.K.A":{"rarity":"Epic"},"Golem":{"rarity":"Epic"},"Ice+Wizard":{"rarity":"Legendary"},"Princess":{"rarity":"Legendary"},"Miner":{"rarity":"Legendary"},"Bandit":{"rarity":"Legendary"},"Royal+Ghost":{"rarity":"Legendary"},"Lumberjack":{"rarity":"Legendary"},"Inferno+Dragon":{"rarity":"Legendary"},"Electro+Wizard":{"rarity":"Legendary"},"Night+Witch":{"rarity":"Legendary"},"Magic+Archer":{"rarity":"Legendary"},"Sparky":{"rarity":"Legendary"},"Lava+Hound":{"rarity":"Legendary"},"Mega+Knight":{"rarity":"Legendary"},"Ice+Golem":{"rarity":"Rare"},"Mega+Minion":{"rarity":"Rare"},"Dart+Goblin":{"rarity":"Rare"},"Valkyrie":{"rarity":"Rare"},"Musketeer":{"rarity":"Rare"},"Mini+P.E.K.K.A":{"rarity":"Rare"},"Hog+Rider":{"rarity":"Rare"},"Battle+Ram":{"rarity":"Rare"},"Flying+Machine":{"rarity":"Rare"},"Zappies":{"rarity":"Rare"},"Giant":{"rarity":"Rare"},"Wizard":{"rarity":"Rare"},"Three+Musketeers":{"rarity":"Rare"},"Cannon":{"rarity":"Common"},"Mortar":{"rarity":"Common"},"Tesla":{"rarity":"Common"},"X-Bow":{"rarity":"Epic"},"Tombstone":{"rarity":"Rare"},"Furnace":{"rarity":"Rare"},"Goblin+Hut":{"rarity":"Rare"},"Inferno+Tower":{"rarity":"Rare"},"Bomb+Tower":{"rarity":"Rare"},"Elixir+Collector":{"rarity":"Rare"},"Barbarian+Hut":{"rarity":"Rare"},"Zap":{"rarity":"Common"},"Arrows":{"rarity":"Common"},"Mirror":{"rarity":"Epic"},"Rage":{"rarity":"Epic"},"Goblin+Barrel":{"rarity":"Epic"},"Tornado":{"rarity":"Epic"},"Clone":{"rarity":"Epic"},"Freeze":{"rarity":"Epic"},"Poison":{"rarity":"Epic"},"Lightning":{"rarity":"Epic"},"The+Log":{"rarity":"Legendary"},"Graveyard":{"rarity":"Legendary"},"Heal":{"rarity":"Rare"},"Fireball":{"rarity":"Rare"},"Rocket":{"rarity":"Rare"}};
    console.log(cardsRarity);
    var cardsData={};
    setTimeout(run,10);
    function run(){

        if(mjq('.profileCards__cards').length>0){

            var dbtn=mjq('<button/>').html('copy card level').attr('type','button');
            //var textarea=mjq('<textarea/>').attr('id','fakeyou').attr('style','position:fixed;bottom:50px;right:40px;padding:10px;width:400px;height:800px;');
            mjq('#refresh-profile-text').after(dbtn);
            dbtn.click(function(){
                mjq('.profileCards__card').each(function(){
                    var level=mjq(this).find('.profileCards__level').html();
                    level=level.replace('Lvl ','');
                    if(!level){
                        level='0';
                    }

                    var name=mjq(this).find('a').attr('href');
                    name=name.replace('http://statsroyale.com/card/','');
                    name=name.replace('/card/','');
                    //console.log(name,level);
                    cardsData[name]=cardsRarity[name];
                    cardsData[name]['level']=parseInt(level);


                });
                console.log(cardsData);
                GM_setValue("cards_data",cardsData);
                alert('success');
            });

        }
        if(mjq('.popularDecks__decks').length>0){
            cardsData=GM_getValue("cards_data");
            var levelMax={'Common':13,'Rare':11,'Epic':8,'Legendary':5};
            mjq('.popularDecks__deck').each(function(){
                var score=0;
                mjq(this).find('a').each(function(){
                    var a=mjq(this);
                    var name=a.attr('href');
                    name=name.replace('http://statsroyale.com/card/','');
                    name=name.replace('/card/','');
                    if(cardsData[name]){
                        var level=cardsData[name]['level'];
                        var rarity=cardsData[name]['rarity'];
                        var scs=0;
                        scs=(level*12.5)/levelMax[rarity];
                        //scs=scs.toFixed(2);
                        a.find('img').after(''+level+'/'+scs.toFixed(2));
                        score+=scs;
                    }
                    //console.log(score);
                });
                console.log(score);
                mjq(this).find('.popularDecks__footer').after('<span style="color:red;">'+(score.toFixed(2))+'</span>');
                if(score>70){
                    mjq(this).css('border','3px solid red');
                }
            });

        }
        if(mjq('.cards__cards').length>0){
            var btnSave=mjq('<button/>').html('save data').attr('type','button');
            btnSave.click(function(){
                //cardsData=GM_getValue("cards_data");
                var baseData={};
                mjq('.cards__card').each(function(){
                    var thiscard=this;
                    mjq(this).find('a').each(function(){
                        var a=mjq(this);
                        var name=a.attr('href');
                        name=name.replace('http://statsroyale.com/card/','');
                        name=name.replace('/card/','');
                        console.log(name);
                        baseData[name]={};
                        baseData[name]['rarity']=mjq(thiscard).attr('data-rarity');
                    });
                });
                console.log(JSON.stringify(baseData));
                //GM_setValue("cards_data",cardsData);
                //alert('save success');
            });
            mjq('.cards__filters').after(btnSave);
        }

    }
})();