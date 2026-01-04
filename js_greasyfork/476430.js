// ==UserScript==
// @name         zerbland mod
// @namespace    -
// @version      v1071
// @description  face2face
// @author       Serplent
// @match        zombs.io
// @match        localhost
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476430/zerbland%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/476430/zerbland%20mod.meta.js
// ==/UserScript==

let codec = new BinCodec();
game.script = {}
window.containedSessions = [];
window.SessionSaverIP = 'localhost:8000'
let allowed1 = false;
let e_PacketId = {
    "0": "PACKET_ENTITY_UPDATE",
    "1": "PACKET_PLAYER_COUNTER_UPDATE",
    "2": "PACKET_SET_WORLD_DIMENSIONS",
    "3": "PACKET_INPUT",
    "4": "PACKET_ENTER_WORLD",
    "5": "PACKET_PRE_ENTER_WORLD",
    "6": "PACKET_ENTER_WORLD2",
    "7": "PACKET_PING",
    "9": "PACKET_RPC",
    "PACKET_ENTITY_UPDATE": 0,
    "PACKET_PLAYER_COUNTER_UPDATE": 1,
    "PACKET_SET_WORLD_DIMENSIONS": 2,
    "PACKET_INPUT": 3,
    "PACKET_ENTER_WORLD": 4,
    "PACKET_PRE_ENTER_WORLD": 5,
    "PACKET_ENTER_WORLD2": 6,
    "PACKET_PING": 7,
    "PACKET_RPC": 9
};

let jsons = [
    {
        name: 'BuildingShopPrices',
        response: {
            json: '[{"Name":"Wall","Class":"PlayerObject","GoldCosts":[0,5,30,60,80,100,250,800],"WoodCosts":[2,0,0,0,0,0,0,0],"StoneCosts":[0,2,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0,0],"Width":47.99,"Height":47.99,"Health":[150,200,300,400,600,800,1500,2500],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[5,7,12,17,25,40,80,250]},{"Name":"GoldStash","Class":"GoldStash","GoldCosts":[0,5000,10000,16000,20000,32000,100000,400000],"WoodCosts":[0,0,0,0,0,0,0,0],"StoneCosts":[0,0,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0,0],"Width":95.99,"Height":95.99,"Health":[1500,1800,2300,3000,5000,8000,12000,20000],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[50,60,70,90,110,150,400,700]},{"Name":"GoldMine","Class":"GoldMine","GoldCosts":[0,200,300,600,800,1200,8000,30000],"WoodCosts":[5,15,25,35,45,55,700,1600],"StoneCosts":[5,15,25,35,45,55,700,1600],"TokenCosts":[0,0,0,0,0,0,0,0],"Width":95.99,"Height":95.99,"Health":[150,250,350,500,800,1400,1800,2800],"GoldPerSecond":[4,6,7,10,12,15,25,35],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[5,7,12,17,25,40,70,120]},{"Name":"Door","Class":"Door","GoldCosts":[0,10,50,70,150,200,400,800],"WoodCosts":[5,5,0,0,0,0,0,0],"StoneCosts":[5,5,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0,0],"Width":47.99,"Height":47.99,"Health":[150,200,300,500,700,1000,1500,2000],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,1000],"HealthRegenPerSecond":[5,7,12,17,25,40,70,100]},{"Name":"CannonTower","Class":"Tower","GoldCosts":[0,100,200,600,1200,2000,8000,35000],"WoodCosts":[15,25,30,40,60,80,300,800],"StoneCosts":[15,25,40,50,80,120,300,800],"TokenCosts":[0,0,0,0,0,0,0,0],"TowerRadius":[500,500,500,500,600,600,600,600],"MsBetweenFires":[1000,769,625,500,400,350,250,250],"Height":95.99,"Width":95.99,"Health":[150,200,400,800,1200,1600,2200,3600],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[2,5,10,20,40,80,110,150],"DamageToZombies":[20,30,50,70,120,150,200,300],"DamageToPlayers":[5,5,6,6,7,7,8,8],"DamageToPets":[5,5,5,5,5,5,6,8],"DamageToNeutrals":[250,350,450,550,650,750,850,1000],"ProjectileLifetime":[1000,1000,1000,1000,1000,1000,1000,1000],"ProjectileVelocity":[60,65,70,70,75,80,100,140],"ProjectileName":"CannonProjectile","ProjectileAoe":[true,true,true,true,true,true,true,true],"ProjectileAoeRadius":[250,250,250,250,250,250,250,250],"ProjectileCollisionRadius":[10,10,10,10,10,10,10,10]},{"Name":"ArrowTower","Class":"ArrowTower","GoldCosts":[0,100,200,600,1200,2000,8000,35000],"WoodCosts":[5,25,30,40,50,70,300,800],"StoneCosts":[5,20,30,40,60,80,300,800],"TokenCosts":[0,0,0,0,0,0,0,0],"TowerRadius":[600,650,700,750,800,850,900,1000],"MsBetweenFires":[400,333,285,250,250,250,250,250],"Height":95.99,"Width":95.99,"Health":[150,200,400,800,1200,1600,2200,3600],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[2,5,10,20,40,80,110,150],"DamageToZombies":[20,40,70,120,180,250,400,500],"DamageToPlayers":[5,5,6,6,7,7,8,8],"DamageToPets":[5,5,5,5,5,5,6,6],"DamageToNeutrals":[250,350,450,550,650,750,850,1000],"ProjectileLifetime":[1300,1300,1300,1300,1300,1300,1300,1300],"ProjectileVelocity":[60,65,70,70,75,80,120,140],"ProjectileName":"ArrowProjectile","ProjectileAoe":[false,false,false,false,false,false,false,false],"ProjectileCollisionRadius":[10,10,10,10,10,10,10,10]},{"Name":"Harvester","Class":"Harvester","GoldCosts":[0,100,200,600,1200,2000,8000,10000],"WoodCosts":[5,25,30,40,50,70,300,600],"StoneCosts":[5,20,30,40,60,80,300,600],"TokenCosts":[0,0,0,0,0,0,0,0],"Height":95.99,"Width":95.99,"Health":[150,200,400,800,1200,1600,2200,2800],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[2,5,10,20,40,80,110,130],"HarvestAmount":[2.5,4.65,4.55,7.2,8.25,10,13.5,16],"HarvestCooldown":[1500,1400,1300,1200,1100,1000,900,800],"HarvestMax":[400,800,1200,1600,2000,2400,2800,3600],"HarvestRange":[300,300,300,300,300,300,300,300],"DepositCostPerMinute":[200,300,350,500,600,700,1200,1400],"DepositMax":[800,1200,1400,2000,2400,2800,4800,6000],"MaxYawDeviation":[70,70,70,70,70,70,70,70]},{"Name":"BombTower","Class":"Tower","GoldCosts":[0,100,200,600,1200,2000,8000,35000],"WoodCosts":[10,25,40,50,80,120,300,800],"StoneCosts":[10,25,40,50,80,120,300,800],"TokenCosts":[0,0,0,0,0,0,0,0],"TowerRadius":[1000,1000,1000,1000,1000,1000,1000,1000],"MsBetweenFires":[1000,1000,1000,1000,1000,1000,900,900],"Height":95.99,"Width":95.99,"Health":[150,200,400,800,1200,1600,2200,3600],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[2,5,10,20,40,80,110,150],"DamageToZombies":[30,60,100,140,200,600,1200,1600],"DamageToPlayers":[9,9,10,10,11,11,12,12],"DamageToPets":[10,10,10,10,10,10,10,10],"DamageToNeutrals":[250,350,450,550,650,750,850,1000],"ProjectileLifetime":[1000,1000,1000,1000,1000,1000,1000,1000],"ProjectileVelocity":[20,20,20,20,20,20,20,20],"ProjectileName":"BombProjectile","ProjectileAoe":[true,true,true,true,true,true,true,true],"ProjectileIgnoresCollisions":[true,true,true,true,true,true,true,true],"ProjectileAoeRadius":[250,250,250,250,250,250,250,250],"ProjectileCollisionRadius":[10,10,10,10,10,10,10,10],"ProjectileMaxRange":[1000,1000,1000,1000,1000,1000,1000,1000]},{"Name":"MagicTower","Class":"MagicTower","GoldCosts":[0,100,200,600,1200,2000,8000,35000],"WoodCosts":[15,25,40,50,70,100,300,800],"StoneCosts":[15,25,40,50,70,100,300,800],"TokenCosts":[0,0,0,0,0,0,0,0],"TowerRadius":[400,400,400,400,400,400,400,400],"MsBetweenFires":[800,800,700,600,500,400,300,300],"Height":95.99,"Width":95.99,"Health":[150,200,400,800,1200,1600,2200,3600],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[2,5,10,20,40,80,110,150],"DamageToZombies":[10,20,40,50,70,80,120,160],"DamageToPlayers":[5,5,5,6,6,6,7,7],"DamageToPets":[5,5,5,5,5,5,5,5],"DamageToNeutrals":[250,350,450,550,650,750,850,1000],"ProjectileLifetime":[500,500,500,500,500,500,500,500],"ProjectileVelocity":[45,45,45,45,45,45,45,45],"ProjectileName":"FireballProjectile","ProjectileAoe":[true,true,true,true,true,true,true,true],"ProjectileAoeRadius":[100,100,100,100,100,100,100,100],"ProjectileCollisionRadius":[10,10,10,10,10,10,10,10]},{"Name":"MeleeTower","Class":"MeleeTower","GoldCosts":[0,100,200,600,1200,2000,8000,35000],"WoodCosts":[10,25,30,40,50,70,300,800],"StoneCosts":[10,20,30,40,60,80,300,800],"TokenCosts":[0,0,0,0,0,0,0,0],"TowerRadius":[110,110,110,110,110,110,110,110],"MsBetweenFires":[400,333,285,250,250,250,250,250],"Height":95.99,"Width":95.99,"Health":[200,400,800,1200,1600,2200,4000,9000],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[2,5,10,20,40,80,220,350],"DamageToZombies":[80,120,200,280,500,1000,2000,3000],"DamageToPlayers":[5,6,7,8,9,10,11,12],"DamageToPets":[5,5,5,5,5,5,6,6],"DamageToNeutrals":[250,350,450,550,650,750,850,1000],"MaxYawDeviation":[30,30,30,30,30,30,30,30]},{"Name":"SlowTrap","Class":"Trap","GoldCosts":[0,100,200,400,600,800,1000,1500],"WoodCosts":[5,25,30,40,50,70,300,800],"StoneCosts":[5,20,30,40,60,80,300,800],"TokenCosts":[0,0,0,0,0,0,0,0],"Height":47.99,"Width":47.99,"Health":[150,200,400,800,1200,1600,2200,3000],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[2,5,10,20,40,80,110,150],"SlowDuration":[2500,2500,2500,3000,3000,3250,3500,4000],"SlowAmount":[0.4,0.45,0.5,0.55,0.6,0.65,0.7,0.7]}]'
        },
        opcode: 9
    },
    {
        name: 'ItemShopPrices',
        response: {
            json: '[{"Name":"Spear","Class":"MeleeWeapon","MsBetweenFires":[250,250,250,250,250,250,250],"DamageToZombies":[30,80,120,300,2000,8000,10000],"DamageToNeutrals":[50,80,100,200,250,400,600],"DamageToBuildings":[0.75,1.5,2.25,3,3.75,4.5,5.25],"DamageToPlayers":[15,16,17,18,20,22,22],"DamageToPets":[3,3.5,4,4.5,5,5.5,5.5],"GoldCosts":[1400,2800,5600,11200,22500,45000,90000],"StoneCosts":[0,0,0,0,0,0,0],"WoodCosts":[0,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0],"Range":[100,100,100,100,100,100,100],"MaxYawDeviation":[50,50,50,50,50,50,50]},{"Name":"Pickaxe","Class":"MeleeWeapon","MsBetweenFires":[300,300,285,250,200,200,200],"DamageToZombies":[20,20,20,20,20,20,20],"DamageToBuildings":[0,0,0,0,0,0,0],"DamageToPlayers":[0,0,0,0,0,0,0],"DamageToNeutrals":[10,10,10,10,10,10,10],"DamageToPets":[0,0,0,0,0,0,0],"GoldCosts":[0,1000,3000,6000,8000,24000,90000],"StoneCosts":[0,0,0,0,0,0,0],"WoodCosts":[0,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0],"Range":[100,100,100,100,100,100,100],"MaxYawDeviation":[70,70,70,70,70,70,70],"IsTool":true,"HarvestCount":[1,2,2,3,3,4,6]},{"Name":"Bow","Class":"RangedWeapon","DamageToZombies":[20,40,100,300,2400,10000,14000],"DamageToBuildings":[2,2.3,2.5,2.7,3,3,3],"DamageToPlayers":[22,24,26,28,30,32,32],"DamageToNeutrals":[50,100,150,200,250,400,700],"DamageToPets":[2,2.3,2.5,2.7,3,3,3],"GoldCosts":[100,400,2000,7000,24000,30000,90000],"StoneCosts":[0,0,0,0,0,0,0],"WoodCosts":[0,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0],"MsBetweenFires":[500,500,500,500,500,500,500],"ChargeTime":[150,150,150,150,150,150,150],"ProjectileVelocity":[100,100,100,100,100,100,100],"ProjectileName":"BowProjectile","ProjectileCollisionRadius":[10,10,10,10,10,10,10],"ProjectileLifetime":[550,550,550,550,550,550,550]},{"Name":"Bomb","Class":"RangedWeapon","GoldCosts":[100,400,3000,5000,24000,30000,90000],"DamageToNeutrals":[50,100,150,200,250,300,500],"StoneCosts":[0,0,0,0,0,0,0],"WoodCosts":[0,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0],"MsBetweenFires":[500,500,500,500,500,500,500],"DamageToZombies":[10,30,80,150,1200,6000,9000],"DamageToBuildings":[1,1,1,1,1,1,1],"DamageToPlayers":[20,22,24,26,28,30,30],"DamageToPets":[1,1,1,1,1,1,1],"ProjectileVelocity":[40,40,40,40,40,40,40],"ProjectileName":"BombProjectile","ProjectileCollisionRadius":[10,10,10,10,10,10,10],"ProjectileLifetime":[700,700,700,700,700,700,700],"ProjectileAoe":[true,true,true,true,true,true,true],"ProjectileAoeRadius":[50,50,50,50,50,50,50],"ProjectileIgnoresCollisions":[false,false,false,false,false,false,false],"ProjectileMaxRange":[700,700,700,700,700,700,700]},{"Name":"HealthPotion","Class":"HealthPotion","GoldCosts":[100],"StoneCosts":[0],"WoodCosts":[0],"TokenCosts":[0],"PurchaseCooldown":15000},{"Name":"ZombieShield","Class":"ZombieShield","GoldCosts":[1000,3000,7000,14000,18000,22000,24000,30000,45000,70000],"StoneCosts":[0,0,0,0,0,0,0,0,0,0],"WoodCosts":[0,0,0,0,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0,0,0,0],"Health":[500,1000,1800,4000,10000,20000,35000,50000,65000,85000],"RechargePerSecond":[50,100,200,400,1000,2000,3500,5000,6500,8500],"MsBeforeRecharge":[10000,9000,8000,7000,6000,6000,6000,6000,6000,6000]},{"Name":"Pause","Class":"Pause","GoldCosts":[10000],"StoneCosts":[0],"WoodCosts":[0],"TokenCosts":[0],"PurchaseCooldown":240000},{"Name":"PetMiner","Class":"Pet","GoldCosts":[0,0,0,0,0,0,0,0],"WoodCosts":[0,0,0,0,0,0,0,0],"StoneCosts":[0,0,0,0,0,0,0,0],"TokenCosts":[0,100,100,100,100,200,200,300],"CollisionRadius":25,"Health":[400,800,1500,3000,5000,8000,10000,16000],"MsBeforeRegen":[8000,8000,8000,8000,8000,8000,8000,8000],"HealthRegenPerSecond":[5,5,5,5,5,5,5,5],"Speed":[30,32,34,35,35,37,37,38],"DamageToNeutrals":[80,100,150,200,250,400,500,600],"HarvestCount":[1,1,2,2,3,3,4,4],"Ranged":[false,false,false,false,false,false,false,false],"CanAttackPlayers":[false,false,false,false,false,false,false,false],"CanMine":[true,true,true,true,true,true,true,true],"LeashRange":[500,500,500,500,500,500,500,500],"HarvestLeashRange":[0,0,0,0,0,0,0,0],"AttackRange":[80,80,80,80,80,80,80,80],"MsBetweenFires":[500,450,450,400,400,380,380,350],"EvolvesAtLevel":[0,8,16,24,32,48,64,96],"ExperienceFromMiningPerHalfSecond":[1,1,1,1,1,1,1,1]},{"Name":"PetCARL","Class":"Pet","GoldCosts":[0,0,0,0,0,0,0,0],"WoodCosts":[0,0,0,0,0,0,0,0],"StoneCosts":[0,0,0,0,0,0,0,0],"TokenCosts":[0,100,100,100,100,200,200,300],"CollisionRadius":25,"Health":[400,800,1500,3000,5000,8000,10000,16000],"MsBeforeRegen":[8000,8000,8000,8000,8000,8000,8000,8000],"HealthRegenPerSecond":[5,5,5,5,5,5,5,5],"Speed":[30,32,34,35,35,37,37,38],"DamageToNeutrals":[80,100,150,200,250,400,500,600],"Ranged":[false,false,false,false,false,false,false,false],"CanAttackPlayers":[true,true,true,true,true,true,true,true],"LeashRange":[500,500,500,500,500,500,500,500],"AttackRange":[80,80,80,80,80,80,80,80],"MsBetweenFires":[500,490,490,490,480,480,470,470],"ProjectileLifetime":[1000,1000,1000,1000,1000,1000,1000,1000],"ProjectileVelocity":[60,60,60,60,60,60,60,60],"ProjectileName":"PetCARLProjectile","ProjectileAoe":[true,true,true,true,true,true,true,true],"ProjectileAoeRadius":[250,250,250,250,250,250,250,250],"ProjectileCollisionRadius":[10,10,10,10,10,10,10,10],"DamageToZombies":[30,100,400,600,1000,3000,6000,8000],"DamageToPlayers":[30,31,32,33,34,35,36,37],"DamageToBuildings":[2,2,2,3,3,3,4,4],"EvolvesAtLevel":[0,8,16,24,32,48,64,96],"ExperienceFromZombies":[30,28,25,25,25,25,25,25],"ExperienceFromNeutrals":[30,28,25,25,25,25,25,25]},{"Name":"HatHorns","Class":"Hat","GoldCosts":[0],"WoodCosts":[0],"StoneCosts":[0],"TokenCosts":[0]},{"Name":"PetHealthPotion","Class":"PetHealthPotion","GoldCosts":[100],"StoneCosts":[0],"WoodCosts":[0],"TokenCosts":[0]},{"Name":"PetWhistle","Class":"PetWhistle","GoldCosts":[0],"StoneCosts":[0],"WoodCosts":[0],"TokenCosts":[0]},{"Name":"PetRevive","Class":"PetRevive","GoldCosts":[0],"StoneCosts":[0],"WoodCosts":[0],"TokenCosts":[0]}]'
        },
        opcode: 9
    },
    {
        name: 'Spells',
        response: {
            json: '[{"Name":"HealTowersSpell","VisualLifetime":10000,"VisualRadius":600,"Cooldown":[240000],"IsCooldownForParty":true,"Healing":[{"Type":"Tower","Amount":[50],"Over":[10000],"Radius":[600]}],"GoldCosts":[1000],"WoodCosts":[0],"StoneCosts":[0],"TokenCosts":[0]}]'
        },
        opcode: 9
    }
];
game.script.codec = new BinCodec();
let codecJSON = '{"attributeMaps":{"667546015":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1},{"name":"lastPetDamage","type":3},{"name":"lastPetDamageTick","type":1},{"name":"lastPetDamageTarget","type":1},{"name":"firingTick","type":1},{"name":"experience","type":1},{"name":"stoneGain","type":3},{"name":"woodGain","type":3},{"name":"stoneGainTick","type":1},{"name":"woodGainTick","type":1}],"742594995":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1}],"1059671174":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"firingTick","type":1},{"name":"lastDamagedTick","type":1}],"1372600389":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"hits","type":8}],"1496910567":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"firingTick","type":1}],"1566069472":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1}],"1672634632":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1}],"1816895259":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1}],"2092990061":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1}],"2093252446":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"hits","type":8}],"2347737811":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"reconnectSecret","type":4},{"name":"name","type":4},{"name":"score","type":13},{"name":"baseSpeed","type":3},{"name":"speedAttribute","type":3},{"name":"availableSkillPoints","type":2},{"name":"experience","type":3},{"name":"level","type":1},{"name":"msBetweenFires","type":3},{"name":"aimingYaw","type":2},{"name":"energy","type":3},{"name":"maxEnergy","type":3},{"name":"energyRegenerationRate","type":3},{"name":"kills","type":2},{"name":"weaponName","type":4},{"name":"weaponTier","type":1},{"name":"firingTick","type":1},{"name":"startChargingTick","type":1},{"name":"stone","type":15},{"name":"wood","type":15},{"name":"gold","type":15},{"name":"token","type":15},{"name":"wave","type":1},{"name":"partyId","type":1},{"name":"zombieShieldHealth","type":3},{"name":"zombieShieldMaxHealth","type":3},{"name":"isPaused","type":1},{"name":"isInvulnerable","type":1},{"name":"lastPetDamage","type":3},{"name":"lastPetDamageTick","type":1},{"name":"lastPetDamageTarget","type":1},{"name":"lastDamage","type":3},{"name":"lastDamageTick","type":1},{"name":"lastDamageTarget","type":1},{"name":"hatName","type":4},{"name":"petUid","type":1},{"name":"isBuildingWalking","type":10}],"2402467733":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1}],"2462472648":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1}],"2464630638":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1}],"2899981078":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1},{"name":"harvestMax","type":1},{"name":"stone","type":1},{"name":"wood","type":1},{"name":"firingTick","type":1},{"name":"deposit","type":3},{"name":"depositMax","type":3},{"name":"lastHarvestedBy","type":4}],"2969697641":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1},{"name":"towerYaw","type":3},{"name":"firingTick","type":1},{"name":"healingTick","type":1}]},"entityTypeNames":{"667546015":"Pet","742594995":"GoldMine","1059671174":"Zombie","1372600389":"Stone","1496910567":"Neutral","1566069472":"PlayerObject","1672634632":"NeutralCamp","1816895259":"GameProjectile","2092990061":"Trap","2093252446":"Tree","2347737811":"GamePlayer","2402467733":"GoldStash","2462472648":"Spell","2464630638":"Door","2899981078":"Harvester","2969697641":"Tower"},"rpcMaps":[{"name":"Shutdown","parameters":[{"name":"reason","type":3},{"name":"shutdownUnix","type":0}],"isArray":false,"index":0},{"name":"ReceiveChatMessage","parameters":[{"name":"displayName","type":3},{"name":"channel","type":3},{"name":"message","type":3},{"name":"uid","type":0}],"isArray":false,"index":1},{"name":"SendChatMessage","parameters":[{"name":"channel","type":3},{"name":"message","type":3}],"isArray":false,"index":2},{"name":"Login","parameters":[{"name":"token","type":3}],"isArray":false,"index":3},{"name":"LoginResponse","parameters":[{"name":"json","type":3}],"isArray":false,"index":4},{"name":"AccountSession","parameters":[{"name":"json","type":3}],"isArray":false,"index":5},{"name":"Metrics","parameters":[{"name":"minFps","type":2},{"name":"maxFps","type":2},{"name":"currentFps","type":2},{"name":"averageFps","type":2},{"name":"framesRendered","type":2},{"name":"framesInterpolated","type":2},{"name":"framesExtrapolated","type":2},{"name":"allocatedNetworkEntities","type":2},{"name":"currentClientLag","type":2},{"name":"minClientLag","type":2},{"name":"maxClientLag","type":2},{"name":"currentPing","type":2},{"name":"minPing","type":2},{"name":"maxPing","type":2},{"name":"averagePing","type":2},{"name":"longFrames","type":2},{"name":"stutters","type":2},{"name":"group","type":0},{"name":"isMobile","type":0},{"name":"timeResets","type":2},{"name":"maxExtrapolationTime","type":2},{"name":"extrapolationIncidents","type":2},{"name":"totalExtrapolationTime","type":2},{"name":"differenceInClientTime","type":2}],"isArray":false,"index":6},{"name":"DayCycle","parameters":[{"name":"cycleStartTick","type":0},{"name":"nightEndTick","type":0},{"name":"dayEndTick","type":0},{"name":"isDay","type":0}],"isArray":false,"index":7},{"name":"MakeBuilding","parameters":[{"name":"x","type":1},{"name":"y","type":1},{"name":"type","type":3},{"name":"yaw","type":1}],"isArray":false,"index":8},{"name":"BuildingShopPrices","parameters":[{"name":"json","type":3}],"isArray":false,"index":9},{"name":"ItemShopPrices","parameters":[{"name":"json","type":3},{"name":"json","type":3}],"isArray":false,"index":10},{"name":"LocalBuilding","parameters":[{"name":"x","type":1},{"name":"y","type":1},{"name":"type","type":3},{"name":"dead","type":0},{"name":"uid","type":0},{"name":"tier","type":0}],"isArray":true,"index":11},{"name":"Dead","parameters":[{"name":"stashDied","type":0}],"isArray":false,"index":12},{"name":"Admin","parameters":[{"name":"password","type":3},{"name":"command","type":3}],"isArray":false,"index":13},{"name":"UpgradeBuilding","parameters":[{"name":"uid","type":0}],"isArray":false,"index":14},{"name":"DeleteBuilding","parameters":[{"name":"uid","type":0}],"isArray":false,"index":15},{"name":"BuyItem","parameters":[{"name":"itemName","type":3},{"name":"tier","type":0}],"isArray":false,"index":16},{"name":"SetItem","parameters":[{"name":"itemName","type":3},{"name":"tier","type":0},{"name":"stacks","type":0}],"isArray":false,"index":17},{"name":"EquipItem","parameters":[{"name":"itemName","type":3},{"name":"tier","type":0}],"isArray":false,"index":18},{"name":"SetOpenParty","parameters":[{"name":"isOpen","type":0}],"isArray":false,"index":19},{"name":"SetPartyName","parameters":[{"name":"partyName","type":3}],"isArray":false,"index":20},{"name":"SetPartyMemberCanSell","parameters":[{"name":"uid","type":0},{"name":"canSell","type":0}],"isArray":false,"index":21},{"name":"JoinParty","parameters":[{"name":"partyId","type":0}],"isArray":false,"index":22},{"name":"JoinPartyByShareKey","parameters":[{"name":"partyShareKey","type":3}],"isArray":false,"index":23},{"name":"PartyApplicant","parameters":[{"name":"displayName","type":3},{"name":"applicantUid","type":0}],"isArray":false,"index":24},{"name":"PartyApplicantDecide","parameters":[{"name":"applicantUid","type":0},{"name":"accepted","type":0}],"isArray":false,"index":25},{"name":"PartyApplicantDenied","parameters":[],"isArray":false,"index":26},{"name":"PartyApplicantExpired","parameters":[{"name":"applicantUid","type":0}],"isArray":false,"index":27},{"name":"PartyShareKey","parameters":[{"name":"partyShareKey","type":3}],"isArray":false,"index":28},{"name":"PartyInfo","parameters":[{"name":"playerUid","type":0},{"name":"displayName","type":3},{"name":"isLeader","type":0},{"name":"canSell","type":0}],"isArray":true,"index":29},{"name":"AddParty","parameters":[{"name":"partyId","type":0},{"name":"partyName","type":3},{"name":"isOpen","type":0},{"name":"memberCount","type":0}],"isArray":false,"index":30},{"name":"RemoveParty","parameters":[{"name":"partyId","type":0}],"isArray":false,"index":31},{"name":"Leaderboard","parameters":[{"name":"name","type":3},{"name":"uid","type":0},{"name":"rank","type":0},{"name":"score","type":4},{"name":"wave","type":0}],"isArray":true,"index":32},{"name":"Failure","parameters":[{"name":"category","type":3},{"name":"reason","type":3},{"name":"x","type":0},{"name":"y","type":0},{"name":"type","type":3}],"isArray":false,"index":33},{"name":"RecallPet","parameters":[],"isArray":false,"index":34},{"name":"LeaveParty","parameters":[],"isArray":false,"index":35},{"name":"KickParty","parameters":[{"name":"uid","type":0}],"isArray":false,"index":36},{"name":"AddDepositToHarvester","parameters":[{"name":"uid","type":0},{"name":"deposit","type":2}],"isArray":false,"index":37},{"name":"CollectHarvester","parameters":[{"name":"uid","type":0}],"isArray":false,"index":38},{"name":"CastSpell","parameters":[{"name":"spell","type":3},{"name":"x","type":1},{"name":"y","type":1},{"name":"tier","type":0}],"isArray":false,"index":39},{"name":"CastSpellResponse","parameters":[{"name":"spell","type":3},{"name":"cooldown","type":0},{"name":"cooldownStartTick","type":0}],"isArray":false,"index":40},{"name":"Spells","parameters":[{"name":"json","type":3}],"isArray":false,"index":41},{"name":"SetPartyList","parameters":[{"name":"partyId","type":0},{"name":"partyName","type":3},{"name":"isOpen","type":0},{"name":"memberCount","type":0}],"isArray":true,"index":42}],"rpcMapsByName":{"Shutdown":{"name":"Shutdown","parameters":[{"name":"reason","type":3},{"name":"shutdownUnix","type":0}],"isArray":false,"index":0},"ReceiveChatMessage":{"name":"ReceiveChatMessage","parameters":[{"name":"displayName","type":3},{"name":"channel","type":3},{"name":"message","type":3},{"name":"uid","type":0}],"isArray":false,"index":1},"SendChatMessage":{"name":"SendChatMessage","parameters":[{"name":"channel","type":3},{"name":"message","type":3}],"isArray":false,"index":2},"Login":{"name":"Login","parameters":[{"name":"token","type":3}],"isArray":false,"index":3},"LoginResponse":{"name":"LoginResponse","parameters":[{"name":"json","type":3}],"isArray":false,"index":4},"AccountSession":{"name":"AccountSession","parameters":[{"name":"json","type":3}],"isArray":false,"index":5},"Metrics":{"name":"Metrics","parameters":[{"name":"minFps","type":2},{"name":"maxFps","type":2},{"name":"currentFps","type":2},{"name":"averageFps","type":2},{"name":"framesRendered","type":2},{"name":"framesInterpolated","type":2},{"name":"framesExtrapolated","type":2},{"name":"allocatedNetworkEntities","type":2},{"name":"currentClientLag","type":2},{"name":"minClientLag","type":2},{"name":"maxClientLag","type":2},{"name":"currentPing","type":2},{"name":"minPing","type":2},{"name":"maxPing","type":2},{"name":"averagePing","type":2},{"name":"longFrames","type":2},{"name":"stutters","type":2},{"name":"group","type":0},{"name":"isMobile","type":0},{"name":"timeResets","type":2},{"name":"maxExtrapolationTime","type":2},{"name":"extrapolationIncidents","type":2},{"name":"totalExtrapolationTime","type":2},{"name":"differenceInClientTime","type":2}],"isArray":false,"index":6},"DayCycle":{"name":"DayCycle","parameters":[{"name":"cycleStartTick","type":0},{"name":"nightEndTick","type":0},{"name":"dayEndTick","type":0},{"name":"isDay","type":0}],"isArray":false,"index":7},"MakeBuilding":{"name":"MakeBuilding","parameters":[{"name":"x","type":1},{"name":"y","type":1},{"name":"type","type":3},{"name":"yaw","type":1}],"isArray":false,"index":8},"BuildingShopPrices":{"name":"BuildingShopPrices","parameters":[{"name":"json","type":3}],"isArray":false,"index":9},"ItemShopPrices":{"name":"ItemShopPrices","parameters":[{"name":"json","type":3},{"name":"json","type":3}],"isArray":false,"index":10},"LocalBuilding":{"name":"LocalBuilding","parameters":[{"name":"x","type":1},{"name":"y","type":1},{"name":"type","type":3},{"name":"dead","type":0},{"name":"uid","type":0},{"name":"tier","type":0}],"isArray":true,"index":11},"Dead":{"name":"Dead","parameters":[{"name":"stashDied","type":0}],"isArray":false,"index":12},"Admin":{"name":"Admin","parameters":[{"name":"password","type":3},{"name":"command","type":3}],"isArray":false,"index":13},"UpgradeBuilding":{"name":"UpgradeBuilding","parameters":[{"name":"uid","type":0}],"isArray":false,"index":14},"DeleteBuilding":{"name":"DeleteBuilding","parameters":[{"name":"uid","type":0}],"isArray":false,"index":15},"BuyItem":{"name":"BuyItem","parameters":[{"name":"itemName","type":3},{"name":"tier","type":0}],"isArray":false,"index":16},"SetItem":{"name":"SetItem","parameters":[{"name":"itemName","type":3},{"name":"tier","type":0},{"name":"stacks","type":0}],"isArray":false,"index":17},"EquipItem":{"name":"EquipItem","parameters":[{"name":"itemName","type":3},{"name":"tier","type":0}],"isArray":false,"index":18},"SetOpenParty":{"name":"SetOpenParty","parameters":[{"name":"isOpen","type":0}],"isArray":false,"index":19},"SetPartyName":{"name":"SetPartyName","parameters":[{"name":"partyName","type":3}],"isArray":false,"index":20},"SetPartyMemberCanSell":{"name":"SetPartyMemberCanSell","parameters":[{"name":"uid","type":0},{"name":"canSell","type":0}],"isArray":false,"index":21},"JoinParty":{"name":"JoinParty","parameters":[{"name":"partyId","type":0}],"isArray":false,"index":22},"JoinPartyByShareKey":{"name":"JoinPartyByShareKey","parameters":[{"name":"partyShareKey","type":3}],"isArray":false,"index":23},"PartyApplicant":{"name":"PartyApplicant","parameters":[{"name":"displayName","type":3},{"name":"applicantUid","type":0}],"isArray":false,"index":24},"PartyApplicantDecide":{"name":"PartyApplicantDecide","parameters":[{"name":"applicantUid","type":0},{"name":"accepted","type":0}],"isArray":false,"index":25},"PartyApplicantDenied":{"name":"PartyApplicantDenied","parameters":[],"isArray":false,"index":26},"PartyApplicantExpired":{"name":"PartyApplicantExpired","parameters":[{"name":"applicantUid","type":0}],"isArray":false,"index":27},"PartyShareKey":{"name":"PartyShareKey","parameters":[{"name":"partyShareKey","type":3}],"isArray":false,"index":28},"PartyInfo":{"name":"PartyInfo","parameters":[{"name":"playerUid","type":0},{"name":"displayName","type":3},{"name":"isLeader","type":0},{"name":"canSell","type":0}],"isArray":true,"index":29},"AddParty":{"name":"AddParty","parameters":[{"name":"partyId","type":0},{"name":"partyName","type":3},{"name":"isOpen","type":0},{"name":"memberCount","type":0}],"isArray":false,"index":30},"RemoveParty":{"name":"RemoveParty","parameters":[{"name":"partyId","type":0}],"isArray":false,"index":31},"Leaderboard":{"name":"Leaderboard","parameters":[{"name":"name","type":3},{"name":"uid","type":0},{"name":"rank","type":0},{"name":"score","type":4},{"name":"wave","type":0}],"isArray":true,"index":32},"Failure":{"name":"Failure","parameters":[{"name":"category","type":3},{"name":"reason","type":3},{"name":"x","type":0},{"name":"y","type":0},{"name":"type","type":3}],"isArray":false,"index":33},"RecallPet":{"name":"RecallPet","parameters":[],"isArray":false,"index":34},"LeaveParty":{"name":"LeaveParty","parameters":[],"isArray":false,"index":35},"KickParty":{"name":"KickParty","parameters":[{"name":"uid","type":0}],"isArray":false,"index":36},"AddDepositToHarvester":{"name":"AddDepositToHarvester","parameters":[{"name":"uid","type":0},{"name":"deposit","type":2}],"isArray":false,"index":37},"CollectHarvester":{"name":"CollectHarvester","parameters":[{"name":"uid","type":0}],"isArray":false,"index":38},"CastSpell":{"name":"CastSpell","parameters":[{"name":"spell","type":3},{"name":"x","type":1},{"name":"y","type":1},{"name":"tier","type":0}],"isArray":false,"index":39},"CastSpellResponse":{"name":"CastSpellResponse","parameters":[{"name":"spell","type":3},{"name":"cooldown","type":0},{"name":"cooldownStartTick","type":0}],"isArray":false,"index":40},"Spells":{"name":"Spells","parameters":[{"name":"json","type":3}],"isArray":false,"index":41},"SetPartyList":{"name":"SetPartyList","parameters":[{"name":"partyId","type":0},{"name":"partyName","type":3},{"name":"isOpen","type":0},{"name":"memberCount","type":0}],"isArray":true,"index":42}}}'
window.firstmsg;
const onMessageHandler = (event) => {
    game.network.emitter.emit(e_PacketId[event.opcode], event);
};

class Connection {
    constructor(type, url) {
        this.WebSocket = new WebSocket(document.getElementsByClassName("dropdown")[0].value);

        this.WebSocket.binaryType = "arraybuffer";

        this.type = type || "user";

        this.userId = null;

        this.WebSocket.onopen = this.onOpen.bind(this);
    };

    encode(e) {
        return new Uint8Array(game.script.codec.encode(9, {
            name: "message",
            msg: e
        }));
    };

    decode(e) {
        return game.script.codec.decode(e).response.msg;
    };

    sendMessage(m) {
        if (this.WebSocket.readyState == this.WebSocket.OPEN) {
            this.WebSocket.send(this.encode(m));
        };
    };

    onOpen() {
        this.sendMessage("plsverify");
    };
};
class Client extends Connection {
    constructor() {
        super("user");
        this.activeSessions = {};
        this.WebSocket.onmessage = this.onMessage.bind(this);
        this.WebSocket.onclose = this.onClose.bind(this);
        this.notAllowedCharsInHTML = new Map([["<", '&lt;'], [">", '&gt;']]);
    };

    onMessage(m) {
        let x = new Uint8Array(m.data);
        if (x[0] == 0 || x[0] == 8) {
            if (x[0] == 8) x[0] = 9;
            let obj = game.network.codec.decode(x);
            if (obj.opcode == 0) {
                onMessageHandler(obj);
            }
            if (obj.opcode == 9) {
                onMessageHandler(obj);
            }
            return;
        }
        let msg = this.decode(m.data);

        if (msg.startsWith("encodeyounoob")) {
            let encoded = this.cipher("thisisblack")(msg.split(",  ;")[1]);
            this.sendMessage(`decodednoob,  ;${encoded}`);
        }

        if (msg == "accesssuccess") {
            this.sendMessage(this.type);
        }

        if (msg.startsWith("id")) {
            this.clientId = parseInt(msg.split(",  ;")[1]);
        };
        if (msg.startsWith("sessions")) {
            let args = msg.split(",  ;");
            this.activeSessions = JSON.parse(args[1]);
            document.getElementsByClassName("savedsessions")[0].innerHTML = "";
            let counter = 0;
            Object.values(this.activeSessions).sort((a, b) => a.sessionUserId - b.sessionUserId).forEach(e => {
                counter++;
                if ((counter % 2) == 0) {
                    $("savedsessions").innerHTML += `<button onclick="client.verify(${e.actualUserId})">${e.sessionName ? this.Sanitize(e.sessionName) : "Session"} [${e.actualUserId} | ${e.sessionUserId}]</button><br>`;
                } else {
                    $("savedsessions").innerHTML += `<button onclick="client.verify(${e.actualUserId})">${e.sessionName ? this.Sanitize(e.sessionName) : "Session"} [${e.actualUserId} | ${e.sessionUserId}]</button>&nbsp&nbsp`;
                }
            });
        }
        if (msg.startsWith("data")) {
            let obj = JSON.parse(msg.split(",  ;")[1]);

            if (obj.opcode == 0) {
                let entities = {};

                obj.entities.forEach(k => {
                    entities[k[0]] = k[1];
                });

                onMessageHandler({
                    tick: obj.tick,
                    entities: entities,
                    byteSize: obj.byteSize,
                    opcode: obj.opcode
                });
            };

            if (obj.opcode == 9) {
                onMessageHandler(obj);
            };
        };

        if (msg.startsWith("verifydata")) {
            let args = msg.split(",  ;");

            let data = JSON.parse(args[1]);
            console.log(data)

            let codec = JSON.parse(codecJSON);

            for (let i in codec) {
                game.network.codec[i] = codec[i];
            };
            game.network.codec.sortedUidsByType = data.sortedUidsByType;
            game.network.codec.removedEntities = data.removedEntities;
            game.network.codec.absentEntitiesFlags = data.absentEntitiesFlags;
            game.network.codec.updatedEntityFlags = data.updatedEntityFlags;
            game.network.socket = {
                readyState: 1
            }
            game.network.socket.send = (e) => this.sendBuffer(new Uint8Array(e));

            game.network.sendPacket = (e, t) => {
                if (e == 4 || e == 5 || e == 6 || e == 7) return;

                this.sendPacket(e, t);
            };

            game.options.serverId = data.serverId;
            game.network.connectionOptions = game.options.servers[data.serverId];

            game.options.nickname = data.syncNeeds[0].effectiveDisplayName;

            game.world.inWorld = true;

            if (data.useRequiredEquipment) {
                document.useRequiredEquipment = true;
            };

            if (data.petActivated) {
                window.activated = true;
            };

            for (let i = 0; i < jsons.length; i++) {
                onMessageHandler(jsons[i]);
            };

            for (let i = 0; i < data.syncNeeds.length; i++) {
                onMessageHandler(data.syncNeeds[i]);
            };

            for (let i = 0; i < data.messages.length; i++) {
                onMessageHandler({
                    name: "ReceiveChatMessage",
                    response: data.messages[i],
                    opcode: 9
                });
            };

            if (data.castSpellResponse && data.castSpellResponse.cooldownStartTick && (data.tick - data.castSpellResponse.cooldownStartTick) * 50 < 240000) {
                onMessageHandler({
                    name: 'CastSpellResponse',
                    response: data.castSpellResponse,
                    opcode: 9
                });
            };

            if (data.isPaused) {
                game.ui.onLocalItemUpdate({
                    itemName: 'Pause',
                    tier: 1,
                    stacks: 1
                });
                game.ui.emit('wavePaused');
            };

            for (let i in data.inventory) {
                onMessageHandler({
                    name: "SetItem",
                    response: {
                        itemName: data.inventory[i].itemName,
                        tier: data.inventory[i].tier,
                        stacks: data.inventory[i].stacks
                    },
                    opcode: 9
                });
            };
            console.log(data.localBuildings)
            onMessageHandler({
                name: "LocalBuilding",
                response: data.localBuildings,
                opcode: 9
            });

            let entities = {};

            data.entities.forEach(k => {
                entities[k[0]] = k[1];
            });

            onMessageHandler({
                tick: data.tick,
                entities: entities,
                byteSize: data.byteSize,
                opcode: 0
            });
        };
    };

    verify(id) {
        if (!(!document.location.hash || document.location.hash.length < 2)) {
            game.network.emitter._events.PACKET_ENTER_WORLD[5] = (data) => {
                if (!data.allowed || game.ui.components.Intro.reconnectKey) return;

                /*setTimeout(() => {
                    let psk = game.ui.components.Intro.partyShareKey;

                    Object.keys(game.ui.buildings).length ? game.ui.getComponent("PopupOverlay").showConfirmation(`Are you sure you want to join by share key ${psk}? You are in a base already.`, 1e4, () => {
                        game.ui.getComponent("PopupOverlay").showConfirmation(`Are you sure you want to join by share key ${psk}? Double check just for safety.`, 1e4, () => {
                            game.network.sendRpc({
                                name: 'JoinPartyByShareKey',
                                partyShareKey: psk
                            });
                        });
                    }) : game.network.sendRpc({
                        name: 'JoinPartyByShareKey',
                        partyShareKey: psk
                    });
                }, 1000);*/
            };
        };

        this.sendMessage(`verify,  ;${id}`);

        this.connectedToId = id;
    };

    sendPacket(opcode, data) {
        let buffer = new Uint8Array(game.network.codec.encode(opcode, data));
        let arr = [1];
        for (let i = 0; i < buffer.length; i++) {
            arr.push(buffer[i]);
        }
        this.WebSocket.send(new Uint8Array(arr));
    }
    sendBuffer(buffer) {
        let arr = [2];
        for (let i = 0; i < buffer.length; i++) {
            arr.push(buffer[i]);
        }
        this.WebSocket.send(new Uint8Array(arr));
    }

    createSession(sessionname, name, sid, psk) {
        this.sendMessage(`createsession,  ;${sessionname},  ;${name},  ;${sid},  ;${psk}`);
    };

    getSessions() {
        this.sendMessage("getsessions");
    };

    disconnect() {
        this.WebSocket.close();
    };

    closeSession(id) {
        this.sendMessage("closesession,  ;" + id);
    };

    enableAutoHeal(id = this.connectedToId) {
        this.sendMessage("eah,  ;" + id);
    };

    enableAutoRespawn(id = this.connectedToId) {
        this.sendMessage("ear,  ;" + id);
    };

    enableTowerAlarm(id = this.connectedToId) {
        this.sendMessage("eta,  ;" + id);
    };

    enableStashAlarm(id = this.connectedToId) {
        this.sendMessage("esa,  ;" + id);
    };

    enableDeathAlarm(id = this.connectedToId) {
        this.sendMessage("eda,  ;" + id);
    };

    enableDisconnectAlarm(id = this.connectedToId) {
        this.sendMessage("edca,  ;" + id);
    };

    disableAutoHeal(id = this.connectedToId) {
        this.sendMessage("dah,  ;" + id);
    };

    disableAutoRespawn(id = this.connectedToId) {
        this.sendMessage("dar,  ;" + id);
    };

    disableTowerAlarm(id = this.connectedToId) {
        this.sendMessage("dta,  ;" + id);
    };

    disableStashAlarm(id = this.connectedToId) {
        this.sendMessage("dsa,  ;" + id);
    };

    disableDeathAlarm(id = this.connectedToId) {
        this.sendMessage("dda,  ;" + id);
    };

    disableDisconnectAlarm(id = this.connectedToId) {
        this.sendMessage("ddca,  ;" + id);
    };
    reconnect(id = this.connectedToId, closed) {
        !closed && (this.reconnecting = true);
        this.disconnect();
        this.WebSocket = new Connection().WebSocket;
        this.WebSocket.onopen = this.onOpen.bind(this);
        this.WebSocket.onmessage = this.onMessage.bind(this);
        this.WebSocket.onclose = this.onClose.bind(this);
        this.WebSocket.addEventListener("open", () => {
            this.verify(id);
        })
    }
    onClose() {
        if (this.reconnecting) {
            this.reconnecting = false;
            return;
        }
        setTimeout(() => {
            this.reconnect(this.connectedToId, true);
        }, 1000);
    }
    Sanitize(e) {
        let text = "";
        for (let i = 0; i < e.length; i++) {
            this.notAllowedCharsInHTML.has(e[i]) ? text += this.notAllowedCharsInHTML.get(e[i]) : text += e[i];
        }
        return text;
    }
    cipher(salt) {
        const textToChars = text => text.split('').map(c => c.charCodeAt(0));
        const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
        const applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code);
        return text => text.split('').map(textToChars).map(applySaltToChar).map(byteHex).join('');
    }
    changePassword(password) {
        this.sendMessage("changehasaccess,  ;" + password);
    }
    getLeaderboardData() {
        this.sendMessage("getleaderboarddata");
    }
};

window.sendSession = () => {
    window.client.createSession(
        document.getElementsByClassName("Session_sessionName")[0].value,
        document.getElementsByClassName("Session_altsName")[0].value,
        document.getElementsByClassName("Session_altsServerId")[0].value,
        document.getElementsByClassName("Session_altsPsk")[0].value);
};

window.closeSession = () => {
    let id = parseInt(document.getElementsByClassName("Session_closeSessionId")[0].value);

    id in window.client.activeSessions && window.client.closeSession(document.getElementsByClassName("Session_closeSessionId")[0].value);
};

window.changeSession = () => {
    client.reconnect();
};

window.changesessionname = () => {
    let id = parseInt(document.getElementsByClassName("changesessionnameinput")[0].value);
    let name = document.getElementsByClassName("changesessionnameinput2")[0].value;
    client.sendMessage(`changesessionname,  ;${id},  ;${name}`);
}
window.changesessionid = () => {
    let id = parseInt(document.getElementsByClassName("changesessionidinput")[0].value);
    let name = document.getElementsByClassName("changesessionidinput2")[0].value;
    client.sendMessage(`changesessionid,  ;${id},  ;${name}`);
}

document.getElementsByClassName("hud-intro-corner-bottom-left")[0].innerHTML = `
    <h1 style="color: white">Session Saver</h1><br>
    <input type="text" style="width: 160px; border-radius: 3px; border: 2px solid rgb(0, 0, 0, 0.4); height: 40px; padding: 6px;; margin-top: 10px;" placeholder='Session ID?' class='Session_closeSessionId' maxlength='29'>&nbsp
    <button class='btn btn-red' style='width: 160px; margin-top: 10px;' onclick='window.closeSession()'>Close Session</button><br>
    <input style="width: 80px; border-radius: 3px; border: 2px solid rgb(0, 0, 0, 0.4); height: 40px; margin-top: 10px;" class="changesessionnameinput" type="text" placeholder="id">&nbsp
    <input style="width: 80px; border-radius: 3px; border: 2px solid rgb(0, 0, 0, 0.4); height: 40px; margin-top: 10px;" class="changesessionnameinput2" type="text" placeholder="name">
    <button class="btn btn-blue" style='width: 160px; margin-top: 10px;' onclick="window.changesessionname();">Change Name</button><br>
    <select class='btn btn-white dropdown' style='width: 160px; margin-top: 10px;'>
      <option value="wss://sex/" selected>LOCALHOST</option>
    </select>
    <button class='btn btn-white' style='width: 160px; margin-top: 10px;' onclick='window.changeSession()'>Change Session</button>
    <br><br>
    <hr>
    <div class='savedsessions'></div>
    <br>
    <hr>
`;
document.getElementsByClassName("hud-intro-left")[0].setAttribute("style", "width: 400px; height: 260px; margin-top: 15px; overflow: auto; float: margin-right: 100px;");
window.createSession = (psk) => {
    client.createSession(
        game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value].name.replaceAll(' ', '').replace('#', '').toLowerCase(),
        document.getElementsByClassName('hud-intro-name')[0].value,
        game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value].id,
        'xy'
    );
};
document.getElementsByClassName("hud-intro-form")[0].insertAdjacentHTML("beforeend", `<button class="btn btn-green hud-intro-play" onclick="window.createSession()">Create Session</button>`);

game.script.client = new Client();
window.client = game.script.client;

game.network.sendRpc4 = game.network.sendRpc;
game.network.sendRpc = (e) => {
    if (e.name == "SendChatMessage") {
        let commands = ["ab", "au", "atb", "apr", "aph", "rpt", "pt", "aaz", "aa", "pl", "arf", "ahrc", "ape", "lock", "20u"];
        let ex = [null, e.message.replace(/[^\!]/g, ""), e.message.split(" ")[0].replaceAll("!", "")];
        if (ex[2] == "lock") client.sendMessage("lock");
        if (ex && ex[2] && commands.includes(ex[2]) && ex[2] !== "lock") client.sendMessage(`${ex[1] == '!' ? 'e' : 'd'}${ex[2]}`);
    }
    game.network.sendRpc4(e);
}
game.network.sendRpc2 = game.network.sendRpc;
game.network.sendRpc = (e) => {
    if (e.name == "SendChatMessage") {
        e.message == "?alt" ? window.sendAlt() : 0;
        e.message == "?spear" ? window.wsSpear = !window.wsSpear : 0;
        e.message == "?spam" ? window.wsSpam = !window.wsSpam : 0;
        e.message == "?fill" ? window.filler = !window.filler : 0;
        e.message == "?bomb" ? window.wsBomb = !window.wsBomb : 0;
        e.message == "?rndmalt" ? window.randomAlt = !window.randomAlt : 0;
        e.message == "?rndmaltj" ? window.randomAltJoinToYou = !window.randomAltJoinToYou : 0;
        e.message == "?ahrc" ? window.ahrc = !window.ahrc : 0;
        e.message == "?1b1s" ? window.auto1by1Stash = !window.auto1by1Stash : 0;
        e.message == "?1b1" ? window.auto1by1MouseWithClick = !window.auto1by1MouseWithClick : 0;
        e.message == "?delLast" ? window.mySockets[window.mySockets.length - 1].close() : 0;
        e.message == "?saveBase" ? window.saveBase() : 0;
        e.message == "?autoBuildSaved" ? window.buildSaved = !window.buildSaved : 0;
        e.message == "?ms" ? window.moveToMouse = !window.moveToMouse : 0;
        e.message == "?lck" ? window.lockPos = !window.lockPos : 0;
        e.message == "?ssal" ? window.ssal() : 0;
        e.message == "?search121" ? window.searchWithWave(121) : 0;
        window.mySockets.forEach(ws => {
            e.message == "?delall" ? ws.close() : 0;
            e.message == "?ctrl" ? ws.control = true : 0;
            e.message == "?uctrl" ? ws.control = false : 0;
            e.message == `?ctrl ${ws.cloneId}` ? ws.control = true : 0;
            e.message == `?uctrl ${ws.cloneId}` ? ws.control = false : 0;
            e.message == `?del ${ws.cloneId}` ? ws.close() : 0;
        })
        console.log(`Command Received ${e.message}`)
        if (e.message.startsWith("?")) {
            return;
        }
    }
    game.network.sendRpc2(e)
}
let styles = document.createElement("style");
styles.appendChild(document.createTextNode(`
#hud-menu-party {
    top: 51%;
    width: 610px;
    height: 480px;
}
.hud-menu-party .hud-party-tag {
    width: 120px;
}
.hud-menu-party .hud-party-share {
    width: 280px;
}
`));
document.head.appendChild(styles);
styles.type = "text/css";
game.renderer.ground.setVisible(false)
let getRss = false;
function counter(e = 0) {
    if (e <= -0.99949999999999999e24) {
        return Math.round(e/-1e23)/-10 + "TT";
    }
    if (e <= -0.99949999999999999e21) {
        return Math.round(e/-1e20)/-10 + "TB";
    }
    if (e <= -0.99949999999999999e18) {
        return Math.round(e/-1e17)/-10 + "TM";
    }
    if (e <= -0.99949999999999999e15) {
        return Math.round(e/-1e14)/-10 + "TK";
    }
    if (e <= -0.99949999999999999e12) {
        return Math.round(e/-1e11)/-10 + "T";
    }
    if (e <= -0.99949999999999999e9) {
        return Math.round(e/-1e8)/-10 + "B";
    }
    if (e <= -0.99949999999999999e6) {
        return Math.round(e/-1e5)/-10 + "M";
    }
    if (e <= -0.99949999999999999e3) {
        return Math.round(e/-1e2)/-10 + "K";
    }
    if (e <= 0.99949999999999999e3) {
        return Math.round(e) + "";
    }
    if (e <= 0.99949999999999999e6) {
        return Math.round(e/1e2)/10 + "K";
    }
    if (e <= 0.99949999999999999e9) {
        return Math.round(e/1e5)/10 + "M";
    }
    if (e <= 0.99949999999999999e12) {
        return Math.round(e/1e8)/10 + "B";
    }
    if (e <= 0.99949999999999999e15) {
        return Math.round(e/1e11)/10 + "T";
    }
    if (e <= 0.99949999999999999e18) {
        return Math.round(e/1e14)/10 + "TK";
    }
    if (e <= 0.99949999999999999e21) {
        return Math.round(e/1e17)/10 + "TM";
    }
    if (e <= 0.99949999999999999e24) {
        return Math.round(e/1e20)/10 + "TB";
    }
    if (e <= 0.99949999999999999e27) {
        return Math.round(e/1e+23)/10 + "TT";
    }
    if (e >= 0.99949999999999999e27) {
        return Math.round(e/1e+23)/10 + "TT";
    }
}
document.addEventListener("keydown", e => {
    if(document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        if (e.key == '-') {
            getRss = !getRss;
        }
    }
})
let id = 0;
window.addEventListener("keydown", e => {
    switch (e.keyCode) {
        case 69:
            if (window.randomAlt) {
                let randomAlt = window.mySockets[id];
                id++
                game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: randomAlt.psk.response.partyShareKey });
                if (id == window.mySockets.length) {
                    id = 0;
                }
            };
            if (window.randomAltJoinToYou) {
                let randomAlt = window.mySockets[id];
                id++
                if (randomAlt.network) {
                    randomAlt.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: game.ui.getPlayerPartyShareKey() });
                }
                if (id == window.mySockets.length) {
                    id = 0;
                }
            };
            break;
    };
});
function GetGoldStash() {
    for (let i in game.ui.buildings) {
        if (game.ui.buildings[i].type == "GoldStash") {
            return game.ui.buildings[i];
        }
    }
}
window.saveBase = () => {
    let buildings = Game.currentGame.ui.buildings;
    let base = "";
    let stash = GetGoldStash();
    if (stash == undefined) {
        return
    }
    let stashPosition = {
        x: stash.x,
        y: stash.y
    }
    for (var uid in buildings) {
        if (!buildings.hasOwnProperty(uid)) {
            continue
        }
        let obj = buildings[uid]
        let x = Game.currentGame.ui.buildings[obj.uid].x - stashPosition.x
        let y = Game.currentGame.ui.buildings[obj.uid].y - stashPosition.y
        let building = Game.currentGame.ui.buildings[obj.uid].type
        let yaw = 0;
        base += "PlaceBuilding(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + building + "', " + yaw + ");";
    }
    window.savedBase = base;
}
window.buildSavedBase = function () {
    var waitForGoldStash = setInterval(function () {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            stash = GetGoldStash();
            if (stash == undefined) return
            stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            var basecode = window.savedBase;
            basecode = new Function(basecode)
            return basecode()
        }
    }, 275)
}
let dimension = 1;

const onWindowResize = () => {
    const renderer = Game.currentGame.renderer;
    let canvasWidth = window.innerWidth * window.devicePixelRatio;
    let canvasHeight = window.innerHeight * window.devicePixelRatio;
    let ratio = Math.max(canvasWidth / (1920 * dimension), canvasHeight / (1080 * dimension));
    renderer.scale = ratio;
    renderer.entities.setScale(ratio);
    renderer.ui.setScale(ratio);
    renderer.renderer.resize(canvasWidth, canvasHeight);
    renderer.viewport.width = renderer.renderer.width / renderer.scale + 2 * renderer.viewportPadding;
    renderer.viewport.height = renderer.renderer.height / renderer.scale + 2 * renderer.viewportPadding;
}

onWindowResize()

window.addEventListener("resize", () => {
    onWindowResize()
})

window.dpr = (e) => {
    window.devicePixelRatio = e
    onWindowResize()
}
let wheelzoom = true;
window.addEventListener("wheel", function (e, t = 1.003) {
    if (!wheelzoom) return
    if (e.deltaY > 0) {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                dimension = dimension * t
                onWindowResize()
            }, i * 5)
        };
    } else if (e.deltaY <= 1) {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                dimension = dimension / t
                onWindowResize()
            }, i * 5)
        };
    }
});
game.network.addEntityUpdateHandler((e) => {
    if (getRss) {
        !allowed1 && (allowed1 = true);
    }
    if (getRss || allowed1) {
        for (let i in game.renderer.npcs.attachments) {
            if (game.renderer.npcs.attachments[i].fromTick.name) {
                let player = game.renderer.npcs.attachments[i];
                let wood_1 = counter(player.targetTick.wood);
                let stone_1 = counter(player.targetTick.stone);
                let gold_1 = counter(player.targetTick.gold);
                let token_1 = counter(player.targetTick.token);
                let px_1 = counter(player.targetTick.position.x);
                let py_1 = counter(player.targetTick.position.y);
                let timeout_1 = "";
                if (getRss && !player.targetTick.oldName) {
                    player.targetTick.oldName = player.targetTick.name;
                    player.targetTick.oldWood = wood_1;
                    player.targetTick.oldStone = stone_1;
                    player.targetTick.oldGold = gold_1;
                    player.targetTick.oldToken = token_1;
                    player.targetTick.oldPX = px_1;
                    player.targetTick.oldPY = py_1;
                    player.targetTick.info = `
${player.targetTick.oldName}; score: ${player.targetTick.score.toLocaleString()}, W: ${wood_1}, S: ${stone_1}, G: ${gold_1}, T: ${token_1}
x: ${Math.round(player.targetTick.position.x)}, y: ${Math.round(player.targetTick.position.y)}, partyId: ${Math.round(player.targetTick.partyId)} [${game.ui.parties[player.targetTick.partyId] && game.ui.parties[player.targetTick.partyId].memberCount}/4]
                    `;
                    player.targetTick.name = game.renderer.npcs.attachments[i].targetTick.info;
                }
                if (!getRss && player.targetTick.oldName) {
                    player.targetTick.info = player.targetTick.oldName;
                    player.targetTick.name = game.renderer.npcs.attachments[i].targetTick.info;
                    player.targetTick.oldName = null;
                }
                if (getRss) {
                    if (player.targetTick.oldGold !== gold_1 || player.targetTick.oldWood !== wood_1 || player.targetTick.oldStone !== stone_1 || player.targetTick.oldToken !== token_1 || player.targetTick.oldPX !== px_1 || player.targetTick.oldPY !== py_1) {
                        player.targetTick.oldWood = wood_1;
                        player.targetTick.oldStone = stone_1;
                        player.targetTick.oldGold = gold_1;
                        player.targetTick.oldToken = token_1;
                        player.targetTick.oldPX = px_1;
                        player.targetTick.oldPY = py_1;

                        player.targetTick.info = `
${player.targetTick.oldName}; score: ${player.targetTick.score.toLocaleString()}, W: ${wood_1}, S: ${stone_1}, G: ${gold_1}, T: ${token_1}
x: ${Math.round(player.targetTick.position.x)}, y: ${Math.round(player.targetTick.position.y)}, partyId: ${Math.round(player.targetTick.partyId)}  [${game.ui.parties[player.targetTick.partyId] && game.ui.parties[player.targetTick.partyId].memberCount}/4]
                        `;

                        player.targetTick.name = game.renderer.npcs.attachments[i].targetTick.info;
                    };
                };
            };
        };
    };
    if (!getRss) {
        allowed1 = false;
    };
    if (window.filler) {
        let s = 32;
        let p = window.mySockets[window.mySockets.length - 1].players;
        if (p !== 32) {
            window.sendAlt();
        }
    }
    if (window.buildSaved) {
        if (!window.autobuildtimeout) {
            window.autobuildtimeout = true;
            setTimeout(() => { window.autobuildtimeout = false; }, 75)
            if (GetGoldStash !== undefined) {
                window.buildSavedBase();
            }
        }
    }
    if (window.ahrc) {
        Object.values(game.ui.buildings).forEach(obj => {
            game.network.sendPacket(9, { name: "CollectHarvester", uid: obj.uid });
            obj.type == "Harvester" && obj.tier == 1 ? game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 0.07 }) : 0;
            obj.type == "Harvester" && obj.tier == 2 ? game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 0.11 }) : 0;
            obj.type == "Harvester" && obj.tier == 3 ? game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 0.17 }) : 0;
            obj.type == "Harvester" && obj.tier == 4 ? game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 0.22 }) : 0;
            obj.type == "Harvester" && obj.tier == 5 ? game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 0.25 }) : 0;
            obj.type == "Harvester" && obj.tier == 6 ? game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 0.28 }) : 0;
            obj.type == "Harvester" && obj.tier == 7 ? game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 0.42 }) : 0;
            obj.type == "Harvester" && obj.tier == 8 ? game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 0.65 }) : 0;
        });
    }
})
function msToTime(s) {
    function pad(n, z) {
        z = z || 2;

        return ('00' + n).slice(-z);
    };

    var ms = s % 1000;
    s = (s - ms) / 1000;

    var secs = s % 60;
    s = (s - secs) / 60;

    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
};
    document.getElementsByClassName("hud-party-actions")[0].insertAdjacentHTML("afterend", `
  <button class="btn btn-blue" style="width: 120px;margin: 10px 0 0 0;" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk').value })">Join Party</button>
  <input id="psk" style="margin: 10px 15px 0 15px;width: 280px;" placeholder="Party share key... (not link!)" value="" class="btn" />
  <button class="btn btn-red" style="width: 120px;margin: 10px 0 0 0;box-shadow: none;" onclick="Game.currentGame.network.sendRpc({name: 'LeaveParty'});">Leave</button>
`);
let showpriv = true;
function checkStatus(party) {
    if (showpriv == true) {
        if(party.isOpen == 1) {
            return '<small>Public.<small/>';
        } else if(!party.isOpen == 1) {
            return '<small>Private.<small/>';
        }
    } else {
        return '';
    }
};
let partyCheck = (all_parties) => {
    document.getElementsByClassName('hud-party-grid')[0].innerHTML = '';

    for (let i in all_parties) {
        let parties = all_parties[i];
        let tab = document.createElement('div');
        tab.classList.add('hud-party-link');
        tab.classList.add('custom-party');
        tab.id = parties.partyId;
        tab.isPublic = parties.isOpen;
        tab.name = parties.partyName;
        tab.members = parties.memberCount;
        tab.innerHTML = `
                <a>${parties.partyName}<a/>
                <small>id: ${parties.partyId}, </small> <span>${parties.memberCount}/4,<span/> ${checkStatus(parties)}
            `;

        if(parties.memberCount == 4) {
            tab.classList.add('is-disabled');
        } else {
            tab.style.display = 'block';
        }
        setTimeout(() => {
            if (parties.partyId == game.ui.playerPartyId) tab.classList.add('is-active');
        }, 1000);
        if (parties.isOpen !== 1) {
            tab.style.display = '';
        }
        tab.addEventListener('click', function() {
            let isJoining = true;
            if(tab.isPublic == 1 && tab.members < 4) {
                isJoining = true;
                game.network.sendRpc({
                    name: 'JoinParty',
                    partyId: Math.floor(tab.id)
                });
                if(isJoining == true) {
                    document.getElementsByClassName('hud-party-grid')[0].classList.add('is-disabled');
                    document.getElementsByClassName('hud-party-link')[0].classList.add('is-disabled');
                    setTimeout(() => {
                        document.getElementsByClassName('hud-party-grid')[0].classList.remove('is-disabled');
                        document.getElementsByClassName('hud-party-link')[0].classList.remove('is-disabled');
                    }, 27500);
                }
            } else if(!tab.isPublic == 1) {
                isJoining = false;
                game.ui.components.PopupOverlay.showHint("You can't request private parties!");
            }
        });
        document.getElementsByClassName('hud-party-grid')[0].appendChild(tab);
    };
};
game.network.addRpcHandler("SetPartyList", (e) => { partyCheck(e) });
//get active sockets
let targetPos = { x: 0, y: 0 };
window.mySockets = [];
window.activeSockets = [];
setInterval(() => {
    window.mySockets.forEach(socket => {
        if(socket.myPlayer) {
            window.activeSockets[socket.cloneId] = socket;
        }
    })
}, 100)
function getWssOrWS() {
    if (window.location.protocol === 'https:') {
        return "wss"
    } else {
         return "ws"
    }
}
window.sendAlt = () => {
    let mousePosition;
    let isTrue = true;
    let altElem = document.createElement('div');
    let connectionOptions = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value];
    let url = getWssOrWS() + '://' + connectionOptions.hostname + ':' + connectionOptions.port;
    let ws = new WebSocket(url)
    ws.altElem = altElem;
    ws.binaryType = "arraybuffer";
    ws.control = true;
    ws.aimingYaw = 1;
    ws.reversedYaw = false;
    ws.onclose = () => {
        ws.isclosed = true;
        altElem.remove();
        window.reconnect && window.sendWs();
    };
    ws.onmessage = msg => {
        if (new Uint8Array(msg.data)[0] == 5) {
            ws.network = new game.networkType();
            ws.network.sendPacket = (e, t) => {
                if (!ws.isclosed) {
                    ws.send(new Uint8Array(ws.network.codec.encode(e, t)));
                };
            };
            ws.network.sendInput = (t) => {
                ws.network.sendPacket(3, t);
            };
            ws.network.sendRpc = (t) => {
                ws.network.sendPacket(9, t);
            };
            wasmmodule((e) => {
                ws.network.sendPacket(4, {
                    displayName: game.options.nickname + "",
                    extra: e[5].extra
                });
                ws.EnterWorld2Response = e[6];
            }, new Uint8Array(msg.data), game.options.servers[game.options.serverId].ipAddress);
            return;
        };
        ws.data = ws.network.codec.decode(msg.data);
        if (isTrue) {
            isTrue = !isTrue;
            setTimeout(() => {
                altElem.classList.add('hud-map-player');
                document.getElementsByClassName('hud-map')[0].appendChild(altElem);
            }, 1000);
            ws.network.sendInput({ up: 1 });
            ws.mouseUp = 1;
            ws.mouseDown = 0;
            ws.f = false;
            function mouseMoved(e, x, y, d) {
                ws.aimingYaw = e;
                if (ws.mouseDown && !ws.mouseUp) {
                    ws.network.sendInput({ mouseMovedWhileDown: e, worldX: x, worldY: y, distance: d });
                }
                if (!ws.mouseDown && ws.mouseUp) {
                    ws.network.sendInput({ mouseMoved: e, worldX: x, worldY: y, distance: d });
                }
            }
            document.addEventListener('mousemove', mousemove => {
                if (ws.control && !window.lockPos) {
                    if (!ws.isclosed) {
                        mousePosition = game.renderer.screenToWorld(mousemove.clientX, mousemove.clientY);
                        if (ws.myPlayer) {
                            if (ws.myPlayer.position) {
                                mouseMoved(game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + mousePosition.x) * 100, (-ws.myPlayer.position.y + mousePosition.y) * 100), Math.floor(mousePosition.x), Math.floor(mousePosition.y), Math.floor(game.inputPacketCreator.distanceToCenter((-ws.myPlayer.position.x + mousePosition.x) * 100, (-ws.myPlayer.position.y + mousePosition.y) * 100) / 100));
                            }
                        }
                    }
                }
            })
            let SendRpc = ws.network.sendRpc;
            let SendInput = ws.network.sendInput;
            function isInputFieldActive() {
                const tagName = document.activeElement.tagName.toLowerCase();
                return tagName === "input" || tagName === "textarea";
            }
            function handleKeyPress(e) {
                if (!ws.isclosed && ws.control && !isInputFieldActive()) {
                    switch (e.keyCode) {
                        case 81:
                            setTimeout(() => {
                                const nextWeapon = getNextWeapon();
                                ws.network.sendRpc({ name: 'EquipItem', itemName: nextWeapon, tier: ws.inventory[nextWeapon].tier });
                            }, 100);
                            break;
                        case 72:
                            ws.network.sendRpc({ name: 'LeaveParty' });
                            break;
                        case 74:
                            ws.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: game.ui.playerPartyShareKey });
                            break;
                        case 32:
                            setTimeout(() => {
                                ws.network.sendInput({ space: 0 });
                                ws.network.sendInput({ space: 1 });
                            }, 100);
                            break;
                        case 46:
                            ws.network.sendRpc({ name: "DeleteBuilding", uid: ws.myPet.uid });
                            break;
                        default:
                            handleItemActions(e.keyCode);
                            break;
                    }
                }
            }
            function getNextWeapon() {
                const weaponOrder = ['Pickaxe', 'Spear', 'Bow', 'Bomb'];
                let foundCurrent = false;

                for (let i in weaponOrder) {
                    if (foundCurrent) {
                        if (ws.inventory[weaponOrder[i]]) {
                            return weaponOrder[i];
                        }
                    } else if (weaponOrder[i] == ws.myPlayer.weaponName) {
                        foundCurrent = true;
                    }
                }

                return 'Pickaxe';
            }
            function handleItemActions(keyCode) {
                switch (keyCode) {
                    case 82:
                        ws.network.sendRpc({ name: "BuyItem", itemName: "HealthPotion", tier: 1 });
                        ws.network.sendRpc({ name: "EquipItem", itemName: "HealthPotion", tier: 1 });
                        break;

                    case 78:
                        ws.network.sendRpc({ "name": "EquipItem", "itemName": "PetCARL", "tier": 1 });
                        ws.network.sendRpc({ "name": "BuyItem", "itemName": "PetCARL", "tier": 1 });
                        break;

                    case 77:
                        ws.network.sendRpc({ "name": "BuyItem", "itemName": "PetRevive", "tier": 1 });
                        ws.network.sendRpc({ "name": "EquipItem", "itemName": "PetRevive", "tier": 1 });
                        ws.network.sendRpc({ "name": "BuyItem", "itemName": "PetCARL", "tier": ws.inventory.PetCARL.tier + 1 });
                        ws.network.sendRpc({ "name": "BuyItem", "itemName": "PetMiner", "tier": ws.inventory.PetMiner.tier + 1 });
                        break;

                    default:
                        break;
                }
            }
            document.addEventListener('keydown', handleKeyPress);
            function handleMouseDown(e) {
                let mouseToWorld = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);
                if (!ws.isclosed && e.which === 3 && ws.control) {
                    if (window.moveToMouse) {
                        window.moveToMouse = false;
                        window.moveaway = true;
                        ws.network.sendInput({ mouseMoved: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + mouseToWorld.x) * 100, (-ws.myPlayer.position.y + mouseToWorld.y) * 100) });
                        ws.automove = true;
                        if (ws.myPlayer.position.y - mouseToWorld.y > 1) {
                            ws.network.sendInput({ up: 0 });
                        } else {
                            ws.network.sendInput({ up: 1 });
                        }
                        if (-ws.myPlayer.position.y + mouseToWorld.y > 1) {
                            ws.network.sendInput({ down: 0 });
                        } else {
                            ws.network.sendInput({ down: 1 });
                        }
                        if (-ws.myPlayer.position.x + mouseToWorld.x > 1) {
                            ws.network.sendInput({ right: 0 });
                        } else {
                            ws.network.sendInput({ right: 1 });
                        }
                        if (ws.myPlayer.position.x - mouseToWorld.x > 1) {
                            ws.network.sendInput({ left: 0 });
                        } else {
                            ws.network.sendInput({ left: 1 });
                        }
                    } else {
                        ws.network.sendInput({ mouseMoved: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + mouseToWorld.x) * 100, (-ws.myPlayer.position.y + mouseToWorld.y) * 100) });
                        if (ws.myPlayer.position.y - mouseToWorld.y > 1) {
                            ws.network.sendInput({ up: 0 });
                        } else {
                            ws.network.sendInput({ up: 1 });
                        }
                        if (-ws.myPlayer.position.y + mouseToWorld.y > 1) {
                            ws.network.sendInput({ down: 0 });
                        } else {
                            ws.network.sendInput({ down: 1 });
                        }
                        if (-ws.myPlayer.position.x + mouseToWorld.x > 1) {
                            ws.network.sendInput({ right: 0 });
                        } else {
                            ws.network.sendInput({ right: 1 });
                        }
                        if (ws.myPlayer.position.x - mouseToWorld.x > 1) {
                            ws.network.sendInput({ left: 0 });
                        } else {
                            ws.network.sendInput({ left: 1 });
                        }
                    }
                }
                if (ws.control && !e.button && !ws.isclosed) {
                    ws.mouseDown = 1;
                    ws.mouseUp = 0;
                    ws.network.sendInput({ mouseDown: ws.aimingYaw, worldX: Math.floor(mousePosition.x), worldY: Math.floor(mousePosition.y), distance: Math.floor(game.inputPacketCreator.distanceToCenter((-ws.myPlayer.position.x + mousePosition.x) * 100, (-ws.myPlayer.position.y + mousePosition.y) * 100) / 100) });
                }
            }

            function handleMouseUp(e) {
                if (!ws.isclosed && ws.control) {
                    if (e.which === 3) {
                        ws.network.sendInput({ up: 0 });
                        ws.network.sendInput({ down: 0 });
                        ws.network.sendInput({ right: 0 });
                        ws.network.sendInput({ left: 0 });
                        if (window.moveaway) {
                            window.moveToMouse = true;
                            window.moveaway = false;
                        }
                    }
                    if (!e.button) {
                        ws.mouseUp = 1;
                        ws.mouseDown = 0;
                        ws.network.sendInput({ mouseUp: 1, worldX: Math.floor(mousePosition.x), worldY: Math.floor(mousePosition.y), distance: Math.floor(game.inputPacketCreator.distanceToCenter((-ws.myPlayer.position.x + mousePosition.x) * 100, (-ws.myPlayer.position.y + mousePosition.y) * 100) / 100) });
                    }
                }
                if (window.lockPos && e.button == 2) {
                    targetPos = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);
                }
            }

            document.getElementsByClassName("hud")[0].addEventListener("mousedown", handleMouseDown);
            document.getElementsByClassName("hud")[0].addEventListener("mouseup", handleMouseUp);
            function handleItemPurchase(itemName) {
                if (ws.control) {
                    ws.network.sendRpc({ name: "BuyItem", itemName: itemName, tier: ws.inventory[itemName] ? (ws.inventory[itemName].tier + 1) : 1 });
                }
            }
            document.getElementsByClassName("hud-shop-item")[0].addEventListener('click', () => handleItemPurchase("Pickaxe"));
            document.getElementsByClassName("hud-shop-item")[1].addEventListener('click', () => handleItemPurchase("Spear"));
            document.getElementsByClassName("hud-shop-item")[2].addEventListener('click', () => handleItemPurchase("Bow"));
            document.getElementsByClassName("hud-shop-item")[3].addEventListener('click', () => handleItemPurchase("Bomb"));
            document.getElementsByClassName("hud-shop-item")[4].addEventListener('click', () => {
                if (ws.control) {
                    ws.network.sendRpc({ name: "BuyItem", itemName: "ZombieShield", tier: ws.inventory.ZombieShield ? (ws.inventory.ZombieShield.tier + 1) : 1 });
                }
            });
            document.getElementsByClassName("hud-respawn-btn")[0].addEventListener('click', () => {
                if (ws.control) {
                    ws.network.sendRpc({ respawn: 1 });
                }
            });
            function handleEquipItem(itemName) {
                if (ws.control) {
                    ws.network.sendRpc({ name: "EquipItem", itemName: itemName, tier: ws.inventory[itemName].tier });
                }
            }
            for (let i = 0; i < 7; i++) {
                document.getElementsByClassName("hud-toolbar-item")[i].addEventListener('mouseup', (e) => {
                    if (ws.control && !e.button) {
                        const itemNames = ["Pickaxe", "Spear", "Bow", "Bomb", "HealthPotion", "PetHealthPotion", null];
                        const itemName = itemNames[i];
                        if (itemName) {
                            handleEquipItem(itemName);
                        } else {
                            ws.automove = !ws.automove;
                            if (ws.automove) {
                                window.move = true;
                            } else {
                                window.move = false;
                            }
                        }
                    }
                });
            }
            game.network.addRpcHandler("PartyShareKey", () => {
                altElem.style.display = (ws.psk.response.partyShareKey !== game.ui.getPlayerPartyShareKey()) ? "block" : "none";
            });
            window.closeAllSockets = () => {
                ws.close();
                window.mySockets = [];
            }
        }
        if (ws.data.uid) {
            ws.uid = ws.data.uid;
            ws.dataInfo = ws.data;
            ws.inventory = {};
            ws.buildings = {};
            ws.lb = {}
            ws.playerUid = game.world.getMyUid();
            ws.network.sendInput({space: 1});
            ws.network.sendRpc({name: "BuyItem", itemName: "PetCARL", tier: 1})
            ws.network.sendRpc({name: "BuyItem", itemName: "PetMiner", tier: 1})
        }
        if (ws.data.entities) {
            if (ws.data.entities[ws.uid].name) {
                ws.myPlayer = ws.data.entities[ws.uid];
            }
            for (let player in ws.myPlayer) {
                if (ws.myPlayer[player] !== ws.data.entities[ws.uid][player] && ws.data.entities[ws.uid][player] !== undefined) {
                    ws.myPlayer[player] = ws.data.entities[ws.uid][player];
                }
            }
            if (ws.myPlayer.petUid) {
                if (ws.data.entities[ws.myPlayer.petUid]) {
                    if (ws.data.entities[ws.myPlayer.petUid].model) {
                        ws.myPet = ws.data.entities[ws.myPlayer.petUid];
                    }
                }
                for (let pet in ws.myPet) {
                    if (ws.data.entities[ws.myPlayer.petUid]) {
                        if (ws.myPet[pet] !== ws.data.entities[ws.myPlayer.petUid][pet] && ws.data.entities[ws.myPlayer.petUid][pet] !== undefined) {
                            ws.myPet[pet] = ws.data.entities[ws.myPlayer.petUid][pet]
                        }
                    }
                }
            }
            altElem.style.left = (Math.round(ws.myPlayer.position.x) / game.world.getHeight() * 100) + '%';
            altElem.style.top = (Math.round(ws.myPlayer.position.y) / game.world.getWidth() * 100) + '%';
        }
        if (ws.data.name == "PartyInfo") {
            ws.partyInfo = ws.data.response;
            for (let i in ws.partyInfo) {
                if (ws.partyInfo[i].playerUid == ws.uid && ws.partyInfo[i].isLeader) {
                    ws.network.sendRpc({ name: "SetPartyMemberCanSell", uid: game.world.myUid, canSell: 1 });
                }
            }
        }
        if (ws.data.name == "SetPartyList") {
            ws.parties = {};
            ws.players = 0;
            ws.data.response.forEach(e => {
                ws.parties[e.partyId] = e;
                ws.players += e.memberCount;
            });
        }
        if (ws.data.name == "SetItem") {
            ws.inventory[ws.data.response.itemName] = ws.data.response;
            if (!ws.inventory[ws.data.response.itemName].stacks) {
                delete ws.inventory[ws.data.response.itemName];
            };
        };
        if ((game.world.entities[ws.uid] && game.world.getEntityByUid(ws.uid))) {
            window.mySockets.forEach(wss => {
                let {
                    uid,
                    cloneId
                } = wss;

                if (((game.world.entities[uid] && game.world.getEntityByUid(uid))) && (game.world.getEntityByUid(uid)).targetTick) {
                    (game.world.getEntityByUid(uid)).isVerified = true;

                    if (!getRss) {
                        (game.world.getEntityByUid(uid)).targetTick.info = (cloneId).toString();
                    } else {
                        (game.world.getEntityByUid(uid)).targetTick.oldName = (cloneId).toString();
                    };
                };
            });
        };
        if (window.mySockets[ws.cloneId - 1]) {
            window.mySockets[ws.cloneId - 1] = ws;
        }
        if (ws.data.name == "Leaderboard") {
            for (let i in ws.data.response) ws.lb[ws.data.response[i].rank + 1] = ws.data.response[i];
        }
        if (ws.space < 6) {
            ws.space++;
        };
        if (ws.space == 3) {
            ws.network.sendPacket(3, { space: 1 });
        };
        if (ws.space == 6) {
            ws.network.sendPacket(3, { space: 0 });
        };
        if (ws.data.name == "PartyShareKey") {
            ws.psk = ws.data;
            altElem.style.display = (ws.psk.response.partyShareKey !== game.ui.getPlayerPartyShareKey()) ? "block" : "none";
        }
        if (ws.data.name == "Dead") {
            ws.network.sendInput({ respawn: 1 });
        }
        ws.moveToward = (position) => {
            let x = Math.round(position.x);
            let y = Math.round(position.y);
            let myX = Math.round(ws.myPlayer.position.x);
            let myY = Math.round(ws.myPlayer.position.y);
            let offset = 5;
            if (-myX + x > offset) ws.network.sendInput({ left: 0 }); else ws.network.sendInput({ left: 1 });
            if (myX - x > offset) ws.network.sendInput({ right: 0 }); else ws.network.sendInput({ right: 1 });
            if (-myY + y > offset) ws.network.sendInput({ up: 0 }); else ws.network.sendInput({ up: 1 });
            if (myY - y > offset) ws.network.sendInput({ down: 0 }); else ws.network.sendInput({ down: 1 });
        };
        if (window.lockPos) {
            if (!ws.isclosed) {
                if (window.moveToMouse) window.moveToMouse = false;
                if (!ws.automove) ws.automove = true;
                if (ws.myPlayer) {
                    if (ws.myPlayer.position) {
                        ws.network.sendInput({ mouseMoved: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + targetPos.x) * 100, (-ws.myPlayer.position.y + targetPos.y) * 100) });
                        let x = Math.round(targetPos.x);
                        let y = Math.round(targetPos.y);
                        let myX = Math.round(ws.myPlayer.position.x);
                        let myY = Math.round(ws.myPlayer.position.y);
                        let offset = 5;
                        if (-myX + x > offset) ws.network.sendInput({ left: 0 }); else ws.network.sendInput({ left: 1 });
                        if (myX - x > offset) ws.network.sendInput({ right: 0 }); else ws.network.sendInput({ right: 1 });
                        if (-myY + y > offset) ws.network.sendInput({ up: 0 }); else ws.network.sendInput({ up: 1 });
                        if (myY - y > offset) ws.network.sendInput({ down: 0 }); else ws.network.sendInput({ down: 1 });
                    }
                }
            }
        }
        if (window.moveToMouse) {
            let mouseToWorld = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);
            if (!ws.automove) ws.automove = true;
            if (ws.myPlayer) {
                if (ws.myPlayer.position) {
                    ws.network.sendInput({ mouseMoved: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + mouseToWorld.x) * 100, (-ws.myPlayer.position.y + mouseToWorld.y) * 100) });
                    ws.moveToward(game.renderer.screenToWorld(game.inputManager.mousePosition.x, game.inputManager.mousePosition.y))
                }
            }
        };
        if (window.auto1by1Stash) {
            if (ws.myPlayer) {
                if (findNearestAltToStash().uid == ws.uid) {
                    ws.network.sendInput({ space: 0 })
                    ws.network.sendInput({ space: 1 })
                }
            }
        }
        switch (ws.data.opcode) {
            case 0:
                if (window.wsSpear) {
                    !ws.inventory.Spear ? ws.network.sendPacket(9, { name: "BuyItem", itemName: "Spear", tier: 1 }) : 0;
                    ws.inventory.Spear ? ws.network.sendPacket(9, { name: "BuyItem", itemName: "Spear", tier: ws.inventory.Spear.tier }) : 0;
                    ws.myPlayer.weaponName !== "Spear" ? ws.network.sendPacket(9, { name: "EquipItem", itemName: "Spear", tier: ws.inventory.Spear.tier }) : 0;
                }
                if (window.wsBomb) {
                    !ws.inventory.Bomb ? ws.network.sendPacket(9, { name: "BuyItem", itemName: "Bomb", tier: 1 }) : 0;
                    ws.inventory.Bomb ? ws.network.sendPacket(9, { name: "BuyItem", itemName: "Bomb", tier: ws.inventory.Bomb.tier }) : 0;
                    ws.myPlayer.weaponName !== "Bomb" ? ws.network.sendPacket(9, { name: "EquipItem", itemName: "Bomb", tier: ws.inventory.Bomb.tier }) : 0;
                }
                if (window.wsSpam) {
                    ws.myPlayer && ws.network.sendRpc({name: "SendChatMessage", channel: "Local", message: '.................................................................................................................)"><img src onerror="open(`'});
                };
                if (!ws.isclosed) {
                    if (window.auto1by1MouseWithClick) {
                        if (ws.myPlayer) {
                            if (mouse1b1s().uid == ws.uid) {
                                ws.control = true;
                            } else {
                                ws.control = false;
                            };
                        };
                    };
                }
                for (let i in game.world.entities) {
                    if (game.world.entities[i].entityClass === "PlayerEntity" && game.world.entities[i].fromTick.uid === ws.uid) {
                        var hexValue = "1234567890abcdef";
                        var hexLength = 6;
                        var hex = "";
                        for (let i = 0; i < hexLength; i++) hex += hexValue[Math.floor(Math.random() * hexValue.length)];
                        let hr = hexToRgb(hex);
                        game.world.entities[i].currentModel.nameEntity.setColor(hr[0], hr[1], hr[2]);
                    };
                };
                if (ws.myPet) {
                    for (let i in window.mySockets) {
                        if (ws.myPlayer.lastPetDamageTarget == window.mySockets[i].uid || ws.myPlayer.lastPetDamageTarget == game.world.getMyUid()) {
                            ws.network.sendRpc({ name: "EquipItem", itemName: "PetWhistle", tier: 1 });
                        };
                    };
                };
                if (ws.myPlayer) {
                    ws.network.sendRpc({ name: "BuyItem", itemName: "HealthPotion", tier: 1 })
                    let playerHealth = (ws.myPlayer.health / ws.myPlayer.maxHealth) * 100;
                    if (playerHealth <= 10) {
                        ws.network.sendRpc({ name: "EquipItem", itemName: "HealthPotion", tier: 1 })
                    }
                }
                break;
            case 4:
                if (!window.mySockets[window.mySockets.length]) {
                    ws.cloneId = window.mySockets.length + 1;
                    window.mySockets[window.mySockets.length] = ws;
                };
                ws.pop = ws.data.players;
                ws.EnterWorld2Response && ws.send(ws.EnterWorld2Response);
                try {
                    ws.network.sendRpc({ name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey });
                    setTimeout(() => {
                        ws.control = false;
                    }, 500);
                } catch (e) {
                    ws.close();
                };
                break;
        };
    }
}
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(result){
        var r= parseInt(result[1], 16);
        var g= parseInt(result[2], 16);
        var b= parseInt(result[3], 16);
        return [r, g, b];
    }
    return null;
};

const measureDistance = (obj1, obj2) => {
    if (!(obj1.x && obj1.y && obj2.x && obj2.y)) return Infinity;
    let xDif = obj2.x - obj1.x;
    let yDif = obj2.y - obj1.y;
    return Math.abs((xDif ** 2) + (yDif ** 2));
};
let findNearestAltToStash = () => {
    if (window.mySockets.length < 1) return;
    let altArray = [];
    let targetGoldStash = Object.values(Game.currentGame.world.entities).find(building => building.fromTick.model == "GoldStash");
    window.mySockets.forEach(ws => {
        altArray.push(ws.myPlayer);
    });
    if (altArray.length < 1) return;
    altArray.sort((a, b) => measureDistance(targetGoldStash.fromTick.position, a.position) - measureDistance(targetGoldStash.fromTick.position, b.position));
    return altArray[0];
};

window.findNearestAlt = findNearestAltToStash;

let mouse1b1s = () => {
    if (window.mySockets.length < 1) return;
    let altArray = [];
    let mouse = game.world.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);
    window.mySockets.forEach(ws => {
        altArray.push(ws.myPlayer);
    });
    if (altArray.length < 1) return;
    altArray.sort((a, b) => measureDistance(mouse, a.position) - measureDistance(mouse, b.position));
    return altArray[0];
};

window.mouse1b1s = mouse1b1s;