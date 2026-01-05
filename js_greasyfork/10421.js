// ==UserScript==
// @name           Alpacabot
// @namespace      http://penple.org
// @description    Steam Monster Game Bot
// @include        *steamcommunity.com/minigame/towerattack/
// @version 1.0.3
// @downloadURL https://update.greasyfork.org/scripts/10421/Alpacabot.user.js
// @updateURL https://update.greasyfork.org/scripts/10421/Alpacabot.meta.js
// ==/UserScript==
(function(){
    textStatus = null, textTime = null;
    last_ticks = 0;
 
    // Checks if game is initialized
    function isReady() {
        return (g_Minigame && g_Minigame.m_CurrentScene && g_Minigame.m_CurrentScene.m_rgGameData && g_Minigame.m_CurrentScene.m_bRunning && g_Minigame.m_CurrentScene.m_UI.m_bUIReady && g_Minigame.m_CurrentScene.m_Container && g_Minigame.m_CurrentScene.m_containerUI);
    }
 
    // Buys an upgrade if it's affordable
    function upgrade(index, name) {
        var scene = g_Minigame.m_CurrentScene;
       
        if (scene.m_rgPlayerUpgrades[index].cost_for_next_level < scene.m_rgPlayerData.gold && $J("#upgr_"+index+":visible")) {
            status('Upgrading '+name);
            scene.TryUpgrade($J("#upgr_"+index+" .link"));
            scene.m_rgPlayerData.gold = scene.m_rgPlayerData.gold - scene.m_rgPlayerUpgrades[index].cost_for_next_level;
        }
    }
 
    // Adds text via PIXI JS
    function addText(textString, x, y, color, fontSize) {
        var scene = g_Minigame.m_CurrentScene;
       
        var text = new PIXI.Text(textString, {font: fontSize+"px 'Press Start 2P'", fill: color, stroke: '#000', strokeThickness: 2, align:"left"});
        text.x = x;
        text.y = y;
       
        scene.m_containerUI.addChild(text);
        text.container = scene.m_containerUI;
        scene.m_rgClickNumbers.push(text);
       
        return text;
    }
   
    function intro() {
        // Check if game is fully initialized
        if (!isReady()) {
            // Wait until it is ready
            setTimeout(function(){intro()}, 500);
            return;
        }
 
        var scene = g_Minigame.m_CurrentScene;
 
        addText("Alpacabot 1.0.3", 750, 535, "#e1b21e", 15);
        textStatus = addText("", 370, 500, "#ffffff", 14);
        textTime = addText("", 370, 518, "#ffffff", 14);

        // Now that everything is ready, queue main routine
        setInterval(function(){bawt()}, 10^-20);
    }
 
    function getTimeString() {
        var date = new Date();
        return (date.getHours() < 10 ? "0":"")+date.getHours().toString()+"."+(date.getMinutes() < 10 ? "0":"")+date.getMinutes().toString()+"."+(date.getSeconds() < 10 ? "0":"")+date.getSeconds().toString();
    }
 
    function status(text) {
        console.log(text);
        if (!textStatus) { return; }
        textStatus._text = getTimeString()+' '+text;
        textStatus.updateText();
    }
 
    function bawt() {
        if (!isReady()) {
            // No point in continuing
            return;
        }
 
        if (textTime) {
            textTime._text = getTimeString();
            textTime.updateText();
        }
 
        var scene = g_Minigame.m_CurrentScene;
        var lanes = scene.m_rgGameData.lanes;
        var lane = lanes[scene.m_rgPlayerData.current_lane];
       
        if (scene.m_nBGTicks >= (last_ticks + 100)) {
            // Time to check for upgrades, let's not do this each interval
           
            upgrade(1, "Auto-fire Cannon");
            upgrade(9, "Advanced Targeting");
            upgrade(21, "Farming Equipment");
            upgrade(19, "Boss Loot");
            upgrade(3, "Fire Elemental Damage");
            upgrade(4, "Water Elemental Damage");
            upgrade(5, "Air Elemental Damage");
            upgrade(6, "Earth Elemental Damage");
            upgrade(0, "Light Armor");
            upgrade(8, "Heavy Armor");
            upgrade(20, "Energy Shields");
            upgrade(2, "Armor Piercing Round");
            upgrade(10, "Explosive Rounds");
            upgrade(7, "Lucky Shot");
           
            last_ticks = scene.m_nBGTicks;
        }
       
        // Try all available abilities
        $J("#abilitiescontainer > .abilitytemplate:visible").each(function(i){
            if ($J(this).attr("id") && !$J(this).hasClass("active")) {
                var id = parseInt($J(this).attr("id").replace(/[^0-9]+/, ""));
                if (scene.m_rgTuningData.abilities[id]) {
                    scene.TryAbility($J(this).find(".link"));
                }
            }
        });
 
        if (scene.m_bIsDead || scene.m_rgPlayerData.hp <= 0) {
            // Automatic respawn if we're dead
            status('Respawning ..');
            RespawnPlayer();
        } else {
            // Do we have a target?
            var element = scene.m_rgGameData.lanes[scene.m_rgPlayerData.current_lane].element;
            var enemy = scene.GetEnemy(scene.m_rgPlayerData.current_lane, scene.m_rgPlayerData.target);
            // var enemy = scene.GetCurrentEnemyData();
 
            // No target, find a new target
            if (!enemy) {
                status('Finding target ..');
                for (var l = 0; l < scene.m_rgGameData.lanes.length; l++) {
                    for (var i = 0; i < scene.m_rgGameData.lanes[l].enemies.length; i++) {
                        enemy = scene.GetEnemy(l, i);
                        if (enemy) { break; }
                    }
                    if (enemy) { break; }
                }
            }
 
            if (scene.m_rgPlayerData.hp > 0 && enemy && enemy.m_data.hp > 0) {
                // Click!
                // scene.DoClick(mouseData);
                // scene.ClearNewPlayer();
 
                var element = scene.m_rgGameData.lanes[scene.m_rgPlayerData.current_lane].element;
                var damage = scene.CalculateDamage(scene.m_rgPlayerTechTree.damage_per_click, element);
 
                if (damage > 0) {
                    scene.DoClickEffect(damage, enemy.m_Sprite.position.x - 50, enemy.m_Sprite.position.y - 100, scene.m_containerParticles);
                    scene.SpawnEmitter(g_rgEmitterCache.click_burst, enemy.m_Sprite.position.x - scene.m_containerParticles.position.x, enemy.m_Sprite.position.y);
                    enemy.TakeDamage();
                    // status('Attacking!');
                }
            }
 
            // Does current lane have enemies?
            if (lane.enemies[0].hp == 0 && lane.enemies[1].hp == 0 && lane.enemies[2].hp == 0) {
                status('Changing lane ..');
                for (var i = 0; i <= 2; i++) {
                    if (lanes[i].enemies[0] && (lanes[i].enemies[0].hp > 0 || lanes[i].enemies[1].hp > 0 || lanes[i].enemies[2].hp > 0)) {
                        scene.TryChangeLane(i);
                        break;
                    }
                }
                // scene.TryChangeLane(Math.floor(Math.random()*3));
            }
        }
    }
 
    intro(); // Action!
}());