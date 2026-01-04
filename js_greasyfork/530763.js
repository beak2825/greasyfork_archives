// ==UserScript==
// @name            Detailed Host Settings
// @description     Reorganizes the details for host settings in the detailed host settings list.
// @author          Jezzarimu / Sibuna (Usernames at Planets.Nu)
// @include         http://planets.nu/*
// @include         http://*.planets.nu/*
// @include         https://planets.nu/*
// @include         https://*.planets.nu/*
// @version         0.07 - Beta Release
// @namespace https://greasyfork.org/users/859074
// @downloadURL https://update.greasyfork.org/scripts/530763/Detailed%20Host%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/530763/Detailed%20Host%20Settings.meta.js
// ==/UserScript==

/*
Reorganizes and hides unused details for host settings in the detailed host settings list.

Please send any comments or bug reports to Jezzarimu.

Version History:
    0.07 - Changed visibility on Web Diplomacy Level to include team games
    0.06 - Removed displaying homeworld clans and homeworld starbase in a wandering tribes game
    0.05 - Changed text from all caps to mixed case
    0.04 - Added necessary utility function to the script
    0.03 - Grouped minerals and refactored
    0.02 - Hides Extra planets and Extra ships if set to 0
    0.01 - Beta Release
*/

async function wrapper () {
    let game

    const createElementWithExtraData = function (...args) {
    if(args.length == 0)
        return document.createElement('')
    let element = document.createElement(args.shift())
    while(args.length !== 0) {
        let property = args.shift()
        switch(property) {
            case 'onclick':
            case 'textContent':
                element[property] = args.shift()
                break;
            case 'addEventListener':
                element[property](args.shift(), args.shift())
                break;
            case 'children':
                let children = args.shift()
                for(const child of children){
                    element.append(child)
                }
                break;
            case 'style':
                let styles = args.shift()
                while(styles.length > 1) {
                    element[property].setProperty(styles.shift(), styles.shift())
                }
                break;
            case 'checked':
            case 'disabled':
                element.setAttribute(property, undefined)
                break;
            case '':
                break;
            default:
                element.setAttribute(property, args.shift())
        }
    }
    return element
    }

    const GetRequest = async function (api, method='GET', value=null) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open(method, api);
            xhr.onload = function () {
                if (this.status === 200 && this.readyState == this.DONE && JSON.parse(xhr.response)?.['success'] !== false) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: this.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: this.statusText
                });
            };
            xhr.send(value);
        });
    }
    const LowMediumHighFunction = (input) => {
        switch(input) {
            case 1:
                return 'Low'
            case 2:
                return 'Medium'
            case 3:
                return 'High'
            default:
                return 'Error!'
        }
    }
    const ValueStringConversion = (outputArray, input) => {
        for(let i=0; i<outputArray.length; i+=2) {
            if(input == outputArray[i])
                return outputArray[i+1];
        }
        if(outputArray.length%2==1) {
            return outputArray[outputArray.length-1]
        }
        return null
    }
    const Race = {
        UserChoice: 0,
        Federation: 1,
        Lizard: 2,
        Bird: 3,
        Fury: 4,
        Privateer: 5,
        Cyborg: 6,
        Crystal: 7,
        EvilEmpire: 8,
        Robots: 9,
        Rebel: 10,
        ColoniesOfMan: 11,
        Horwasp: 12
    }
    Race.keys = Object.keys(Race)
    Object.freeze(Race)
    const WinCondition = Object.freeze({
        DiplomaticPlanets: 1,
        TotalPlanets: 2,
        MilitaryScore: 3,
        FixedTurn: 4,
        AllPlanets: 5,
        TopAdvance: 7,
        VictoryScore: 8,
    });
    const RaceAvailable = (raceNumber) => {
        if(game.players.some((player) => player.raceid == raceNumber || player.raceid == '1'+raceNumber.toString().padStart(2, '0') || (player.raceid == 0 && !game.settings.disallowedraces.split(',').some((race) => race == raceNumber)))) {
            return true
        }
        return false
    }
    //key: [shown name, help data, shown output, show/hide]
    const keyNameToTextData = {
        _settings: {},
        get settings() {return this._settings},
        set settings(v) {this._settings = v},
        get '__Map Parameters'() {return GroupThese('mapheight', 'mapwidth', 'mapshape', 'sphere')},
        get '__Planet Distribution'() {return GroupThese('numplanets', 'verycloseplanets', 'closeplanets', 'closeplanetrangeinc' , 'otherplanetsminhomeworlddist')},
        get '__Native Parameters'() {return GroupThese('nativeprobability', 'maxnativeclans', 'minnativeclans', 'nativegovernmentlevel', 'nativetaxrateadjustments')},
        get '__neutronium'() {return GroupThese('neutroniumlevel', 'neusurfacemax', 'neugroundmax')},
        get '__duranium'() {return GroupThese('duraniumlevel', 'dursurfacemax', 'durgroundmax')},
        get '__tritanium'() {return GroupThese('tritaniumlevel', 'trisurfacemax', 'trigroundmax')},
        get '__molybdenum'() {return GroupThese('molybdenumlevel', 'molsurfacemax', 'molgroundmax')},
        get '__Game Details'() { return GroupThese('name', 'turn', 'nexthost', 'hoststart', 'hostcompleted', 'lastinvite', 'gamepassword')}
    }
    
    Object.assign(keyNameToTextData, 
        {
        'acceleratedturns': [
            "Accelerated Turns",
            "", 
            ()=>{return keyNameToTextData.settings.acceleratedturns}, 
            true
        ],
        'aicanchangediplomacy': [
            "AI Diplomacy", 
            "", 
            ()=>{return keyNameToTextData.settings.aicanchangediplomacy}, 
            true
        ],
        'alliessharefullinfo': [
            "Allied Share Info", 
            "", 
            ()=>{return keyNameToTextData.settings.alliessharefullinfo}, 
            true
        ],
        'allshareintel': [
            'All Share Intel', 
            '', 
            ()=>{return keyNameToTextData.settings.allshareintel}, 
            ()=>{return keyNameToTextData.settings.allshareintel}
        ],
        'allvisible': [
            'All Visible', 
            '', 
            ()=>{return keyNameToTextData.settings.allvisible}, 
            ()=>{return keyNameToTextData.settings.allvisible}
        ],
        'alwaysuseendturn': [
            'Always Use End Turn', 
            '', 
            ()=>{return keyNameToTextData.settings.alwaysuseendturn}, 
            true
        ],
        'assimilationrateadjustment': [
            'Assimilation Rate Adjustment', 
            '', 
            ()=>{return keyNameToTextData.settings.assimilationrateadjustment}, 
            ()=>{return keyNameToTextData.settings.assimilationrateadjustment}
        ],
        'averagedensitypercent': [
            'Average Density', 
            'Average density of minerals in the ground', 
            ()=>{return keyNameToTextData.settings.averagedensitypercent}, 
            true
        ],
        'balanceadjustment': [
            'Balance Adjustment', 
            '', 
            ()=>{return keyNameToTextData.settings.balanceadjustment}, 
            true
        ],
        'birdshaveenlighten': [
            'Birds Have Enlighten', 
            '', 
            ()=>{return keyNameToTextData.settings.birdshaveenlighten}, 
            ()=>{return !keyNameToTextData.settings.campaignmode}
        ],
        'bringhomesectorships': [
            'Bring Home Sector Ships', 
            '', 
            ()=>{return keyNameToTextData.settings.bringhomesectorships}, 
            false
        ],
        'buildqueueplanetid': [
            'Build Queue Planet ID', 
            '', 
            ()=>{return keyNameToTextData.settings.buildqueueplanetid}, 
            false
        ],
        'burrowsimprovemining': [
            'Burrows Improve Mining', 
            '', 
            ()=>{return keyNameToTextData.settings.burrowsimprovemining}, 
            ()=>{return RaceAvailable(Race.Horwasp)}
        ],
        'campaignmode': [
            'Campaign Mode', 
            'If true, players will be able to use the Campaign Advantages that they have researched. Campaign Advantages for each player are locked in on the first host.', 
            ()=>{return keyNameToTextData.settings.campaignmode}, 
            ()=>{return keyNameToTextData.settings.campaignmode}
        ],
        'centerextraplanets': [
            'Center Extra Planets', 
            'This is the number of planets, in excess of the Homeworld, that the center player (first player slot) has at the beginning of the game.', 
            ()=>{return keyNameToTextData.settings.centerextraplanets}, 
            ()=>{return !keyNameToTextData.settings.wanderingtribescount && !(keyNameToTextData.settings.hwdistribution-4)}
        ],
        'centerextraships': [
            'Center Extra Ships', 
            'This is the number of ships, in excess of the Medium Deep Space Freighter, that the center player (first player slot) has at the beginning of the game.', 
            ()=>{return keyNameToTextData.settings.centerextraships}, 
            ()=>{return !keyNameToTextData.settings.wanderingtribescount && !(keyNameToTextData.settings.hwdistribution-4)}
        ],
        'chainedintercept': [
            'Chained Intercept', 
            '', 
            ()=>{return keyNameToTextData.settings.chainedintercept}, 
            true
        ],
        'chunnelstabilizationeverywhere': [
            'Chunnel Stabilization Everywhere',
            '',
            ()=>{return keyNameToTextData.settings.chunnelstabilizationeverywhere},
            true
        ],
        'cloakandintercept': [
            'Cloak and Intercept', 
            'If true, Bird players receive the Cloak and Intercept advantage without having to research it. This only applies in non-campaign games.', 
            ()=>{return keyNameToTextData.settings.cloakandintercept}, 
            ()=>{return !keyNameToTextData.settings.campaignmode}
        ],
        'cloakfail': [
            'Cloak Failure Chance',
            '',
            ()=>{return keyNameToTextData.settings.cloakfail},
            true
        ],
        'cloningenabled': [
            'Cloning Enabled', 
            'This feature allows cloning (including advanced cloning in Campaign games, if researched) or disallows all cloning.', 
            ()=>{return keyNameToTextData.settings.cloningenabled}, 
            true
        ],
        'closeplanetrangeinc': [
            'Close Planet Range Inc',
            '',
            ()=>{return keyNameToTextData.settings.closeplanetrangeinc},
            ()=>{return !!keyNameToTextData.settings.closeplanetrangeinc}
        ],
        'closeplanets': [
            'Planets Between 81 LY and 162 LY From HW', 
            'This is the minimum number of planets more than 81 light-years from the Homeworld, but less than 162 light-years.', 
            ()=>{return keyNameToTextData.settings.closeplanets}, 
            true
        ],
        'colonisttaxrateadjustments': [
            'Colonist Tax Rate Adjustments',
            '',
            ()=>{return keyNameToTextData.settings.colonisttaxrateadjustments},
            ()=>{return keyNameToTextData.settings.colonisttaxrateadjustments}
        ],
        'combatrng': [
            'Combat RNG',
            'This feature allows either the Classic RNG (Random Number Generator) or an Expanded RNG to be used in Combat.',
            () => {return ValueStringConversion([0, 'Classic RNG', 1, 'Expanded RNG', keyNameToTextData.settings.combatrng], keyNameToTextData.settings.combatrng)},
            true
        ],
        'computerbuilddelay': [
            'Computer Build Delay',
            '',
            ()=>{return keyNameToTextData.settings.computerbuilddelay},
            true
        ],
        'computerbuildships': [
            'Computer Build Ships',
            '',
            ()=>{return keyNameToTextData.settings.computerbuildships},
            true
        ],
        'computerplayerrangelimitation': [
            'Computer/Player Range Limitation',
            '',
            ()=>{return keyNameToTextData.settings.computerplayerrangelimitation},
            true
        ],
        'computerreplacedrops': [
            'Computer Replace Drops',
            '',
            ()=>{return keyNameToTextData.settings.computerreplacedrops},
            true
        ],
        'crystalwebimmunity': [
            'Crystal Web Immunity',
            '',
            () => {return ValueStringConversion([0, 'Crystal immune to all webs', 1, 'Crystal immune to non-crystal webs', 2, 'Crystal immune only to own webs', keyNameToTextData.settings.crystalwebimmunity], keyNameToTextData.settings.crystalwebimmunity)},
            true
        ],
        'cyborgmaxnativetaxrateadjustment': [
            'Cyborg Max Native Tax Rate',
            '',
            ()=>{return Number.parseInt(keyNameToTextData.settings.cyborgmaxnativetaxrateadjustment) + 20 + '%'},
            true
        ],
        'deadradius': [
            'Dead Radius',
            '',
            ()=>{return keyNameToTextData.settings.deadradius},
            true
        ],
        'debrisdiskpercent': [
            'Debris Disk Percent',
            '',
            ()=>{return keyNameToTextData.settings.debrisdiskpercent},
            ()=>{return !!keyNameToTextData.settings.ndebrisdiscs}
        ],
        'debrisdiskversion': [
            'Debris Disk Version',
            '',
            ()=>{return keyNameToTextData.settings.debrisdiskversion},
            ()=>{return !!keyNameToTextData.settings.ndebrisdiscs}
        ],
        'defensepostsblocksensorsweep': [
            'Defense Posts Block Sensor Sweep',
            '',
            ()=>{return keyNameToTextData.settings.defensepostsblocksensorsweep},
            true
        ],
        'destroyplanetcausesfear': [
            'Destroy Planet Causes Fear',
            '',
            ()=>{return keyNameToTextData.settings.destroyplanetcausesfear},
            ()=>{return keyNameToTextData.settings.campaignmode && RaceAvailable(Race.EvilEmpire)}
        ],
        'developmentfactor': [
            'Development Factor',
            '',
            ()=>{return keyNameToTextData.settings.developmentfactor},
            true
        ],
        'directtransferammo': [
            'Direct Transfer Ammo',
            '',
            ()=>{return keyNameToTextData.settings.directtransferammo},
            true
        ],
        'directtransfermc': [
            'Direct Transfer MC',
            '',
            ()=>{return keyNameToTextData.settings.directtransfermc},
            true
        ],
        'disallowedraces': [
            'Disallowed Races', 
            'Races that players are not allowed to choose when slot is set to "User Chooses Race"', 
            ()=>{return keyNameToTextData.settings.disallowedraces.split(',').map(val => {return Race.keys[val]}).join(', ')}, 
            () => {return RaceAvailable(Race.UserChoice)}
        ],
        'discussionid': [
            'Discussion ID',
            '',
            ()=>{return keyNameToTextData.settings.discussionid},
            false
        ],
        'dumppartsdumpstorps': [
            'Dump Parts/Dump Torps',
            '',
            ()=>{return keyNameToTextData.settings.dumppartsdumpstorps},
            true
        ],
        'duraniumlevel': [
            'Duranium Level',
            '',
            ()=>{return keyNameToTextData.settings.duraniumlevel},
            true
        ],
        'durgroundmax': [
            'Duranium Ground Max',
            '',
            ()=>{return keyNameToTextData.settings.durgroundmax},
            true
        ],
        'dursurfacemax': [
            'Duranium Surface Max',
            '',
            ()=>{return keyNameToTextData.settings.dursurfacemax},
            true
        ],
        'emorkslegacy': [
            'Emorks Legacy',
            '',
            ()=>{return keyNameToTextData.settings.emorkslegacy},
            () => {return !game.game.isprivate}
        ],
        'endturn': [
            'End Turn',
            'This is the number of turns in a game with a Win Condition of Fixed Turn.',
            ()=>{return keyNameToTextData.settings.endturn},
            () => {return game.game.wincondition == WinCondition.FixedTurn}
        ],
        'entryportalplayers': [
            'Entry Portal Players',
            '',
            ()=>{return keyNameToTextData.settings.entryportalplayers},
            false
        ],
        'extraplanets': [
            'Extra Planets', 
            'This is the number of planets, in excess of the Homeworld, that each player has at the beginning of the game.', 
            ()=>{return keyNameToTextData.settings.extraplanets}, 
            ()=>{return keyNameToTextData.settings.wanderingtribescount == 0 && keyNameToTextData.settings.extraplanets > 0}
        ],
        'extraplanetsrandomloc': [
            'Extra Planets Random Location', 
            'If true, extra planets will be scattered across the map.', 
            ()=>{return keyNameToTextData.settings.extraplanetsrandomloc}, 
            ()=>{return keyNameToTextData.settings.wanderingtribescount == 0 && keyNameToTextData.settings.extraplanets > 0}
        ],
        'extraships': [
            'Extra Ships', 
            'This is the number of ships, in excess of the initial Medium Deep Space Freighter, that each player has at the beginning of the game.', 
            ()=>{return keyNameToTextData.settings.extraships}, 
            ()=>{return keyNameToTextData.settings.wanderingtribescount == 0 && keyNameToTextData.settings.extraships > 0}
        ],
        'extrashipsrandomloc': [
            'Extra Ships Random Location', 
            'If true, extra starships will be scattered across the map.', 
            ()=>{return keyNameToTextData.settings.extrashipsrandomloc}, 
            ()=>{return keyNameToTextData.settings.wanderingtribescount == 0 && keyNameToTextData.settings.extraships > 0}
        ],
        'fascistdoublebeams': [
            'Fury Double Beams', 
            'If true, Fury players receive the 2X Faster Beams advantage without having to research it. This only applies in non-campaign games.', 
            ()=>{return keyNameToTextData.settings.fascistdoublebeams}, 
            () => {return game.settings.campaignmode == false && RaceAvailable(Race.Fury)}
        ],
        'fcodesbdx': [
            'Beam Down FCs', 
            'If true, this feature enables starships to beam down part of the funds they have on-board.', 
            ()=>{return keyNameToTextData.settings.fcodesbdx}, 
            true
        ],
        'fcodesextraalchemy': [
            'Extra Alchemy FCs', 
            'If true, this enables the NAD, NAT, and NAM Friendly Codes for the Merlin.', 
            ()=>{return keyNameToTextData.settings.fcodesextraalchemy}, 
            true
        ],
        'fcodesmustmatchgsx': [
            'Match GSX', 
            'If true, this requires that both the starship being given and the starship receiving the gift have the same, case sensitive, Friendly Code.', 
            ()=>{return keyNameToTextData.settings.fcodesmustmatchgsx}, 
            true
        ],
        'fcodesrbx': [
            'Regular Build FCs',
            '',
            ()=>{return keyNameToTextData.settings.fcodesrbx},
            true
        ],
        'fightorfail': [
            'FoF Minimum', 
            ' When this field is set to a non-zero value, and a player falls below that number of planets at any time after turn 30, that player will be removed from the game.', 
            ()=>{return keyNameToTextData.settings.fightorfail}, 
            () => {return !!keyNameToTextData.settings.fightorfail && !keyNameToTextData.settings.fofincrement}
        ],
        'fixedstartpositions': [
            'Fixed Start Positions',
            '',
            () => {return keyNameToTextData.settings.fixedstartpositions},
            true
        ],
        'fofaccelrate': [
            'FoF Accel Rate',
            '',
            ()=>{return keyNameToTextData.settings.fofaccelrate},
            false
        ],
        'fofaccelstartdate': [
            'FoF Accel Start Date',
            '',
            ()=>{return keyNameToTextData.settings.fofaccelstartdate},
            false
        ],
        'fofaccelstartturn': [
            'FoF Accel Start Turn',
            '',
            ()=>{return keyNameToTextData.settings.fofaccelstartturn},
            false
        ],
        'fofactiveturn': [
            'FoF Active Turn',
            '',
            ()=>{return keyNameToTextData.settings.fofactiveturn},
            false
        ],
        'fofbyteam': [
            'FoF By Team',
            '',
            ()=>{return keyNameToTextData.settings.fofbyteam},
            ()=>{return keyNameToTextData.settings.fightorfail || keyNameToTextData.settings.fofincrement}
        ],
        'fofincrement': [
            'FoF Increment', 
            'When this field is set to a non-zero value, every time that number of turns passes, the Fight or Fail Planets value is incremented.', 
            ()=>{return keyNameToTextData.settings.fofincrement}, 
            ()=>{return !!keyNameToTextData.settings.fofincrement}
        ],
        'freestarbasefighters5adjustment': [
            'Free Starbase Fighter 5 Adjustment',
            '',
            ()=>{return keyNameToTextData.settings.freestarbasefighters5adjustment},
            ()=>{return !!keyNameToTextData.settings.freestarbasefighters5adjustment}
        ],
        'galacticpower': [
            'Galactic Power', 
            'If true, Gorbies always fight on the left', 
            ()=>{return keyNameToTextData.settings.galacticpower}, 
            ()=>{return !!keyNameToTextData.settings.campaignmode}
        ],
        'gamepassword': [
            'Game Password', 
            'You can add a password to a game, so that only players to whom you provide the password may join the game.', 
            ()=>{return !!keyNameToTextData.settings.gamepassword}, 
            false
        ],
        'groundattackadjustments': [
            'Ground Attack Adjustments',
            '',
            ()=>{return keyNameToTextData.settings.groundattackadjustments},
            ()=>{return !!keyNameToTextData.settings.groundattackadjustments}
        ],
        'hideplayerselection': [
            'Hide Player Selection',
            '',
            ()=>{return keyNameToTextData.settings.hideplayerselection},
            true
        ],
        'hideraceselection': [
            'Hide Race Selection',
            '',
            ()=>{return keyNameToTextData.settings.hideraceselection},
            true
        ],
        'highidfixchunnelusepodhullid': [
            'High ID Fix Chunnel Use Pod Hull ID',
            '',
            ()=>{return keyNameToTextData.settings.highidfixchunnelusepodhullid},
            ()=>{return RaceAvailable(Race.Cyborg)}
        ],
        'highidfixfightertransferoffset': [
            'High ID Fix Fighter Transfer Offset',
            '',
            () => {return keyNameToTextData.settings.highidfixfightertransferoffset},
            ()=>{return RaceAvailable(Race.EvilEmpire)}
        ],
        'hivesdetectlife': [
            'Hives Detect Life',
            '',
            () => {return keyNameToTextData.settings.hivesdetectlife},
            ()=>{return RaceAvailable(Race.Horwasp)}
        ],
        'homesectorshipvaluemax': [
            'Home Sector Ship Value Max',
            '',
            () => {return keyNameToTextData.settings.homesectorshipvaluemax},
            false
        ],
        'homesectorshipvaluemin': [
            'Home Sector Ship Value Min',
            '',
            () => {return keyNameToTextData.settings.homesectorshipvaluemin},
            false
        ],
        'homeworldclans': [
            'Homeworld Clans',
            'This is the number of clans that the Homeworlds have at the beginning of Turn 1.',
            () => {return keyNameToTextData.settings.homeworldclans},
            () => {return !(keyNameToTextData.settings.wanderingtribescount > 0)}
        ],
        'homeworldhasstarbase': [
            'Homeworld Has Starbase', 
            'If true, this causes each Homeworld to have a starbase when the game starts.', 
            () => {return keyNameToTextData.settings.homeworldhasstarbase}, 
            () => {return !(keyNameToTextData.settings.wanderingtribescount > 0)}
        ],
        'homeworldresources': [
            'Homeworld Resources',
            'This indicates the amount of minerals that a Homeworld will have initially.',
            ()=>{return LowMediumHighFunction(keyNameToTextData.settings.homeworldresources)},
            true
        ],
        'horwaspfighterlossclankill': [
            'Horwasp Fighter Loss Clan Kill',
            '',
            () => {return keyNameToTextData.settings.horwaspfighterlossclankill},
            ()=>{return RaceAvailable(Race.Horwasp)}
        ],
        'horwaspscanrobotmodifier': [
            'Horwasp Scan Robot Modifier',
            '',
            () => {return keyNameToTextData.settings.horwaspscanrobotmodifier},
            ()=>{return RaceAvailable(Race.Horwasp) && RaceAvailable(Race.Robots)}
        ],
        'hostcompleted': [
            'Host Completed',
            '',
            () => {return keyNameToTextData.settings.hostcompleted},
            true
        ],
        'hoststart': [
            'Host Start',
            '',
            () => {return keyNameToTextData.settings.hoststart},
            true
        ],
        'hwdistribution': [
            'Homeworld Distribution',
            'This describes how the Homeworlds are to be distributed on the map.',
            ()=>{return ValueStringConversion([1, 'Random Spaced', 2, 'Circular', 3, 'Left and Right', 4, 'One vs. Circle', keyNameToTextData.settings.hwdistribution], keyNameToTextData.settings.hwdistribution)},
            () => {return !(keyNameToTextData.settings.wanderingtribescount > 0) || keyNameToTextData.settings.wanderingtribesdist == 0}
        ],
        'hwlosthappinesslosscolonists': [
            'Colonist Happiness Lost on Lost Homeworld',
            'The amount of Happiness lost by colonists at all your planets if you lose your Homeworld',
            () => {return keyNameToTextData.settings.hwlosthappinesslosscolonists},
            true
        ],
        'hwlosthappinesslossnatives': [
            'Native Happiness Lost on Lost Homeworld',
            'The amount of Happiness lost by native at all your planets if you lose your Homeworld',
            () => {return keyNameToTextData.settings.hwlosthappinesslossnatives},
            true
        ],
        'id': [
            'ID',
            '',
            () => {return keyNameToTextData.settings.id},
            false
        ],
        'isacademy': [
            'Academy Game',
            '',
            () => {return keyNameToTextData.settings.isacademy},
            () => {return keyNameToTextData.settings.isacademy}
        ],
        'joininggroupindex': [
            'Joining Group Index',
            '',
            () => {return keyNameToTextData.settings.joininggroupindex},
            false
        ],
        'killrace': [
            'Kill Race', 
            'If true, when a race "dies" by resigning or being dropped without a replacement, all the starships and starbases of that race are destroyed.', 
            () => {return keyNameToTextData.settings.killrace}, 
            true
        ],
        'lastinvite': [
            'Last Invite',
            '',
            () => {return keyNameToTextData.settings.lastinvite},
            true
        ],
        'levelid': [
            'Level ID',
            '',
            () => {return keyNameToTextData.settings.levelid},
            false
        ],
        'mapheight': [
            'Map Height',
            '',
            () => {return `${keyNameToTextData.settings.mapheight} LY`},
            true
        ],
        'mapshape': [
            'Map Shape',
            'This is the overall shape of the cluster\'s star map.',
            ()=>{return ValueStringConversion([0, 'Round', 1, 'Rectangular', 2, 'Irregular Round', keyNameToTextData.settings.mapshape], keyNameToTextData.settings.mapshape)},
            true
        ],
        'mapwidth': [
            'Map Width',
            '',
            () => {return `${keyNameToTextData.settings.mapwidth} LY`},
            true
        ],
        'maxadvantage': [
            'Max Advantage',
            'This is the maximum number of Advantage Points that a player can have in a Campaign game.',
            () => {return keyNameToTextData.settings.maxadvantage},
            ()=>{return !!keyNameToTextData.settings.campaignmode}
        ],
        'maxallies': [
            'Max Allies',
            'This is the maximum number of Full Alliances that a player can have active at one time.',
            () => {return keyNameToTextData.settings.maxallies},
            true
        ],
        'maxhissersperplanet': [
            'Max Hissers Per Planet',
            '',
            () => {return keyNameToTextData.settings.maxhissersperplanet},
            ()=>{return !!keyNameToTextData.settings.maxhissersperplanet && RaceAvailable(Race.Lizard)}
        ],
        'maxioncloudsperstorm': [
            'Max Ion Clouds Per Storm',
            '',
            () => {return keyNameToTextData.settings.maxioncloudsperstorm},
            ()=>{return keyNameToTextData.settings.nuionstorms!=false && keyNameToTextData.settings.maxions}
        ],
        'maxions': [
            'Maximum number of Ion Storms',
            'This is the maximum number of Ion Disturbances that might exist in the map.',
            () => {return keyNameToTextData.settings.maxions},
            () => {return keyNameToTextData.settings.maxions}
        ],
        'maxnativeclans': [
            'Max Starting Native Clans',
            'This is the maximum number of native clans.',
            () => {return keyNameToTextData.settings.maxnativeclans},
            true
        ],
        'maxplayersperrace': [
            'Max Players Per Race',
            'This is the maximum number of players who may enter a game with the same race.',
            () => {return keyNameToTextData.settings.maxplayersperrace},
            ()=>{return RaceAvailable(Race.UserChoice)}
        ],
        'maxsafepassage': [
            'Max Safe Passage',
            'This is the maximum number of Safe Passage or higher settings that a player can have active at one time.',
            () => {return keyNameToTextData.settings.maxsafepassage},
            true
        ],
        'maxshareintel': [
            'Max Share Intel',
            'This is the maximum number of Share Intel or higher settings that a player can have active at one time.',
            () => {return keyNameToTextData.settings.maxshareintel},
            true
        ],
        'maxwormholes': [
            'Maximum Wormholes',
            'This is the maximum number of Wormholes that might exist in the map.',
            () => {return keyNameToTextData.settings.maxwormholes},
            ()=> {return !!keyNameToTextData.settings.maxwormholes}
        ],
        'meteorshowerchance': [
            'Meteor Shower Chance',
            '',
            () => {return keyNameToTextData.settings.meteorshowerchance},
            true
        ],
        'militaryscorepercent': [
            'Military Score Percent',
            '',
            () => {return keyNameToTextData.settings.militaryscorepercent},
            ()=> {return game.game.wincondition == WinCondition.MilitaryScore}
        ],
        'minefieldsvisible': [
            'Minefields Visible',
            '',
            () => {return keyNameToTextData.settings.minefieldsvisible},
            () => {return keyNameToTextData.settings.minefieldsvisible}
        ],
        'mining200adjustment': [
            'Mining 200 Adjustment',
            '',
            () => {return keyNameToTextData.settings.mining200adjustment},
            ()=> {return !!keyNameToTextData.settings.mining200adjustment}
        ],
        'minnativeclans': [
            'Minimum Starting Native Clans',
            ' This is the minimum number of native clans.',
            () => {return keyNameToTextData.settings.minnativeclans},
            true
        ],
        'molgroundmax': [
            'Molybdenum Ground Max',
            '',
            () => {return keyNameToTextData.settings.molgroundmax},
            true
        ],
        'molsurfacemax': [
            'Molybdenum Surface Max',
            '',
            () => {return keyNameToTextData.settings.molsurfacemax},
            true
        ],
        'molybdenumlevel': [
            'Molybdenum Level',
            '',
            () => {return keyNameToTextData.settings.molybdenumlevel},
            true
        ],
        'name': [
            'Name',
            '',
            () => {return keyNameToTextData.settings.name == 'default' ? `Sector ${game.game.id}` : keyNameToTextData.settings.name},
            true
        ],
        'nativegovernmentlevel': [
            'Average Native Government Level',
            '',
            () => {return LowMediumHighFunction(keyNameToTextData.settings.nativegovernmentlevel)},
            true
        ],
        'nativeprobability': [
            'Native Probability',
            '',
            () => {return keyNameToTextData.settings.nativeprobability+'%'},
            true
        ],
        'nativetaxrateadjustments': [
            'Native Tax Rate Adjustments',
            '',
            () => {return keyNameToTextData.settings.nativetaxrateadjustments},
            ()=>{return !!keyNameToTextData.settings.nativetaxrateadjustments}
        ],
        'ncircles': [
            'NCircles',
            '',
            () => {return keyNameToTextData.settings.ncircles},
            true
        ],
        'ndebrisdiscs': [
            'Number of Debris Disks',
            'This is the number of debris disks that are created in the map.',
            () => {return keyNameToTextData.settings.ndebrisdiscs},
            ()=>{return !!keyNameToTextData.settings.ndebrisdiscs}
        ],
        'nebulas': [
            'Number of Nebulas',
            ' This is the number of nebulae in the map.',
            () => {return keyNameToTextData.settings.nebulas},
            ()=>{return !!keyNameToTextData.settings.nebulas}
        ],
        'neugroundmax': [
            'Neutronium Ground Max',
            '',
            () => {return keyNameToTextData.settings.neugroundmax},
            true
        ],
        'neusurfacemax': [
            'Neutronium Surface Max',
            '',
            () => {return keyNameToTextData.settings.neusurfacemax},
            true
        ],
        'neutroniumlevel': [
            'Neutronium Level',
            '',
            () => {return keyNameToTextData.settings.neutroniumlevel},
            true
        ],
        'nexthost': [
            'Next Host',
            '',
            () => {return keyNameToTextData.settings.nexthost == '1/1/0001 12:00:00 AM' ? game.game.nexthost : keyNameToTextData.settings.nexthost},
            true
        ],
        'nextlevelid': [
            'Next Level ID',
            '',
            () => {return keyNameToTextData.settings.nextlevelid},
            false
        ],
        'nextplanets': [
            'Next Planets',
            '',
            () => {return keyNameToTextData.settings.nextplanets},
            false
        ],
        'nochunnelhives': [
            'No Chunnel Hives',
            '',
            () => {return keyNameToTextData.settings.nochunnelhives},
            ()=>{return RaceAvailable(Race.Cyborg) && RaceAvailable(Race.Horwasp)}
        ],
        'nohomeworld': [
            'No Homeworld',
            '',
            () => {return keyNameToTextData.settings.nohomeworld},
            () => {return !!keyNameToTextData.settings.nohomeworld}
        ],
        'nominefields': [
            'No Minefields',
            '',
            () => {return keyNameToTextData.settings.nominefields},
            () => {return !!keyNameToTextData.settings.nominefields}
        ],
        'nosupplies': [
            'No Supplies',
            '',
            () => {return keyNameToTextData.settings.nosupplies},
            () => {return !!keyNameToTextData.settings.nosupplies}
        ],
        'nowarpwells': [
            'No Warpwells',
            '',
            () => {return keyNameToTextData.settings.nowarpwells},
            () => {return !!keyNameToTextData.settings.nowarpwells}
        ],
        'nowebfriendlycodes': [
            'No Web Friendly Codes',
            '',
            () => {return keyNameToTextData.settings.nowebfriendlycodes},
            ()=>{return RaceAvailable(Race.Crystal)}
        ],
        'nowebsinotherids': [
            'No Webs in Other IDs',
            '',
            () => {return keyNameToTextData.settings.nowebsinotherids},
            ()=>{return RaceAvailable(Race.Crystal)}
        ],
        'nuionstorms': [
            'Cloudy Ion Storms', 
            'If true, Ion Disturbances are cloudy. Normal Ion Disturbances have the same voltage throughout while cloudy Ion Disturbances have different voltages in different sections.', 
            () => {return keyNameToTextData.settings.nuionstorms}, 
            ()=>{return !!keyNameToTextData.settings.maxions}
        ],
        'numplanets': [
            'Number of Planets',
            'This is the number of planets in the map.',
            () => {return keyNameToTextData.settings.numplanets},
            true
        ],
        'orderedgroupjoindays': [
            'Ordered Group Join Days',
            '',
            () => {return keyNameToTextData.settings.orderedgroupjoindays},
            false
        ],
        'otherplanetsminhomeworlddist': [
            'Other Planets Min Homeworld Distance',
            'This is the minimum distance that other planets are allowed to be to a Homeworld.',
            () => {return keyNameToTextData.settings.otherplanetsminhomeworlddist},
            true
        ],
        'planetaryproductionqueue': [
            'Build Type',
            ()=>{return `https://help.planets.nu/queue-${keyNameToTextData.settings.planetaryproductionqueue?'p':''}pq`},
            () => {return keyNameToTextData.settings.planetaryproductionqueue?'Planetary Production Queue':'Production Queue'},
            ()=>{return keyNameToTextData.settings.shiplimittype == 0 && keyNameToTextData.settings.productionqueue == true}
        ],
        'planetlevelmax': [
            'Planet Level Max',
            '',
            () => {return keyNameToTextData.settings.planetlevelmax},
            ()=>{return !!this.setings.planetlevelmax}
        ],
        'planetscanrange': [
            'Planet Scan Range',
            'This is the distance that a planet or planetoid shows up on scanners.',
            () => {return keyNameToTextData.settings.planetscanrange},
            true
        ],
        'playerselectrace': [
            'Player Select Race',
            '',
            () => {return keyNameToTextData.settings.playerselectrace},
            ()=>{return keyNameToTextData.settings.playerselectrace == true}
        ],
        'plsextraships': [
            'PLS Extra Ships',
            'This number is added to the above value (Ships per Planet) to generate a player\'s calculated ship limit.',
            () => {return keyNameToTextData.settings.plsextraships},
            ()=>{return keyNameToTextData.settings.shiplimittype == 1 && !!keyNameToTextData.settings.plsextraships}
        ],
        'plsminships': [
            'Minimum Ship Limit', 
            'This is the minimum ship limit that a player can have, regardless of the number of planets they control.', 
            () => {return keyNameToTextData.settings.plsminships}, 
            ()=>{return keyNameToTextData.settings.shiplimittype == 1 && !!keyNameToTextData.settings.plsminships}
        ],
        'plsshipsperplanet': [
            'Ships per Planet',
            'This is the number of starships that are added to a player\'s ship limit for each planet the player controls.',
            () => {return keyNameToTextData.settings.plsshipsperplanet},
            ()=>{return keyNameToTextData.settings.shiplimittype == 1}
        ],
        'ppqminbuilds': [
            'PPQ Min Builds',
            '',
            () => {return keyNameToTextData.settings.ppqminbuilds},
            () => {return keyNameToTextData.settings.shiplimittype == 0 && keyNameToTextData.settings.productionqueue == true && keyNameToTextData.settings.planetaryproductionqueue == true}
        ],
        'presetadvantages': [
            'Preset Advantanges',
            '',
            () => {return keyNameToTextData.settings.presetadvantages},
            () => {return keyNameToTextData.settings.presetadvantages == true}
        ],
        'presethulls': [
            'Preset Hulls',
            '',
            () => {return keyNameToTextData.settings.presethulls},
            () => {return keyNameToTextData.settings.presethulls == true}
        ],
        'presethullsbyrace': [
            'Preset Hulls By Race',
            '',
            () => {return keyNameToTextData.settings.presethullsbyrace},
            () => {return keyNameToTextData.settings.presethullsbyrace != ''}
        ],
        'productionbasecost': [
            'Production Base Cost',
            '',
            () => {return keyNameToTextData.settings.productionbasecost},
            () => {return keyNameToTextData.settings.shiplimittype == 0}
        ],
        'productionqueue': [
            'Build Type',
            'https://help.planets.nu/queue-pbp',
            () => {return 'Priority Build Points'},
            () => {return keyNameToTextData.settings.shiplimittype == 0 && keyNameToTextData.settings.productionqueue == false}
        ],
        'productionsmallshipset': [
            'Production Small Ship Set',
            '',
            () => {return keyNameToTextData.settings.productionsmallshipset},
            () => {return keyNameToTextData.settings.shiplimittype == 0}
        ],
        'productionstarbaseoutput': [
            'Production Starbase Output',
            '',
            () => {return keyNameToTextData.settings.productionstarbaseoutput},
            () => {return keyNameToTextData.settings.shiplimittype == 0}
        ],
        'productionstarbasereward': [
            'Production Starbase Reward',
            '',
            () => {return keyNameToTextData.settings.productionstarbasereward},
            () => {return keyNameToTextData.settings.shiplimittype == 0}
        ],
        'quantumtorpedomissrateforgravitonics': [
            'QT miss rate for Gravitonics',
            '',
            () => {return `${keyNameToTextData.settings.quantumtorpedomissrateforgravitonics}%`},
            ()=>{return RaceAvailable(Race.Federation) && RaceAvailable(Race.Privateer) && (keyNameToTextData.settings.campaignmode == true || keyNameToTextData.settings.quantumtorpedos == true)}
        ],
        'quantumtorpedos': [
            'Quantum Torpedos',
            '',
            () => {return keyNameToTextData.settings.quantumtorpedos},
            ()=>{return RaceAvailable(Race.Federation) && keyNameToTextData.settings.campaignmode == false}
        ],
        'racehullsonlycloakandintercept': [
            'C&I on Race Hulls only',
            '',
            () => {return keyNameToTextData.settings.racehullsonlycloakandintercept},
            ()=>{return RaceAvailable(Race.Bird) && (keyNameToTextData.settings.campaignmode == true || keyNameToTextData.settings.cloakandintercept == true)}
        ],
        'racehullsonlyfascistdoublebeams': [
            '2x Beams on Race Hulls only',
            '',
            () => {return keyNameToTextData.settings.racehullsonlyfascistdoublebeams},
            ()=>{return RaceAvailable(Race.Fury) && (keyNameToTextData.settings.campaignmode == true || keyNameToTextData.settings.fascistdoublebeams == true)}
        ],
        'racehullsonlyhiss': [
            'Hiss on Race Hulls only',
            '',
            () => {return keyNameToTextData.settings.racehullsonlyhiss},
            ()=>{return RaceAvailable(Race.Lizard)}
        ],
        'randomplayerslots': [
            'Random Player Slots',
            '',
            () => {return keyNameToTextData.settings.randomplayerslots},
            true
        ],
        'reinforcementsallowed': [
            'Reinforcements Allowed',
            '',
            () => {return keyNameToTextData.settings.reinforcementsallowed},
            () => {return keyNameToTextData.settings.reinforcementsallowed}
        ],
        'repairshipreplacessagefrigate': [
            'Repair Ship Replaces Sage Frigate',
            '',
            () => {return keyNameToTextData.settings.repairshipreplacessagefrigate},
            ()=>{return RaceAvailable(Race.Robots) || RaceAvailable(Race.Rebel)}
        ],
        'runningstart': [
            'Running Start',
            '',
            () => {return keyNameToTextData.settings.runningstart},
            true
        ],
        'sapphirenowebimmunity': [
            'Sapphire No Web Immunity',
            '',
            () => {return keyNameToTextData.settings.sapphirenowebimmunity},
            () => {return RaceAvailable(Race.Crystal) && keyNameToTextData.settings.campaignmode == true}
        ],
        'sensorsweepcombatpodscanrange': [
            'Sensor Sweep Combat Pod Scan Range',
            '',
            () => {return keyNameToTextData.settings.sensorsweepcombatpodscanrange},
            () => {return RaceAvailable(Race.Horwasp)}
        ],
        'sensorsweepnoncombatpodscanrange': [
            'Sensor Sweep Noncombat Pod Scan Range',
            '',
            () => {return keyNameToTextData.settings.sensorsweepnoncombatpodscanrange},
            () => {return RaceAvailable(Race.Horwasp)}
        ],
        'shiplimit': [
            'Ship Limit',
            'This is the maximum number of starships that can be built in the normal build queue.',
            () => {return keyNameToTextData.settings.shiplimit},
            () => {return keyNameToTextData.settings.shiplimittype == 0}
        ],
        'shiplimittype': [
            'Build Type',
            'https://help.planets.nu/queue-pls',
            () => {return 'Planets Limit Ships'},
            () => {return keyNameToTextData.settings.shiplimittype}
        ],
        'shipscanrange': [
            'Ship Scan Range',
            'This is the distance that ships show up on scanners.',
            () => {return keyNameToTextData.settings.shipscanrange},
            true
        ],
        'showallexplosions': [
            'Show All Explosions',
            '',
            () => {return keyNameToTextData.settings.showallexplosions},
            true
        ],
        'shuffleteampositions': [
            'Shuffle Team Positions', 
            'If true, the position of the teams, and of the players within the team, are randomized when placed on their homeworlds.', 
            () => {return keyNameToTextData.settings.shuffleteampositions}, 
            ()=>{return game.players.some(p=>p.teamid>0)}
        ],
        'snapgridsize': [
            'Snap Grid Size',
            '',
            () => {return keyNameToTextData.settings.snapgridsize},
            true
        ],
        'sphere': [
            'Map Wraparound', 
            'If true, this enables a wrap-around map', 
            () => {return keyNameToTextData.settings.sphere}, 
            () => {return keyNameToTextData.settings.sphere}
        ],
        'sscruiserinterceptinterference': [
            'SS Cruiser Intercept Interference',
            '',
            () => {return keyNameToTextData.settings.sscruiserinterceptinterference},
            ()=>{return RaceAvailable(Race.EvilEmpire)}
        ],
        'starbasefightertransfer': [
            'Starbase Fighter Transfer', 
            'If true, Empire players receive the Starbase Fighter Transfer advantage without having to research it. This only applies in non-campaign games.', 
            () => {return keyNameToTextData.settings.starbasefightertransfer}, 
            ()=>{return keyNameToTextData.settings.campaignmode == false && RaceAvailable(Race.EvilEmpire)}
        ],
        'stars': [
            'Number of Stars',
            'This is the number of star clusters in the map.',
            () => {return keyNameToTextData.settings.stars},
            () => {return !!keyNameToTextData.settings.stars}
        ],
        'stealthmode': [
            'Stealth Mode', 
            'If true, this causes all of the scores, except planet count, to be concealed.', 
            () => {return keyNameToTextData.settings.stealthmode}, 
            true
        ],
        'storyid': [
            'Story ID',
            '',
            () => {return keyNameToTextData.settings.storyid},
            true
        ],
        'structuredecayrate': [
            'Structure Decay Rate',
            '',
            () => {return keyNameToTextData.settings.structuredecayrate},
            true
        ],
        'superspyadvanced': [
            'Super Spy Advanced', 
            'If true, Bird players receive the Super Spy Advanced advantage without having to research it. This only applies in non-campaign games.', 
            () => {return keyNameToTextData.settings.superspyadvanced}, 
            ()=>{return keyNameToTextData.settings.campaignmode == false && RaceAvailable(Race.Bird)}
        ],
        'supertransportfuelmod': [
            'Super Transport Fuel Mod',
            '',
            () => {return keyNameToTextData.settings.supertransportfuelmod},
            true
        ],
        'teamsize': [
            'Team Size',
            '',
            () => {return keyNameToTextData.settings.teamsize},
            false
        ],
        'topadvancecount': [
            'Top Advance Count',
            '',
            () => {return keyNameToTextData.settings.topadvancecount},
            ()=>{return game.game.wincondition == WinCondition.TopAdvance}
        ],
        'torpedoset': [
            'Torpedo Set',
            '',
            () => {return ValueStringConversion([0, 'Classic Torpedo Set', 1, '2021 Campaign Torp Set', 2, '2024 Campaign Torp Set', 3, '2025 Standard Torp Set', keyNameToTextData.settings.torpedoset],keyNameToTextData.settings.torpedoset)},
            true
        ],
        'transferoverloadprioritizeammo': [
            'Transfer Overload Prioritize Ammo',
            '',
            () => {return keyNameToTextData.settings.transferoverloadprioritizeammo},
            true
        ],
        'trigroundmax': [
            'Tritanium Ground Max',
            '',
            () => {return keyNameToTextData.settings.trigroundmax},
            true
        ],
        'trisurfacemax': [
            'Tritanium Surface Max',
            '',
            () => {return keyNameToTextData.settings.trisurfacemax},
            true
        ],
        'tritaniumlevel': [
            'Tritanium Level',
            '',
            () => {return keyNameToTextData.settings.tritaniumlevel},
            true
        ],
        'turn': [
            'Turn',
            '',
            () => {return keyNameToTextData.settings.turn},
            true
        ],
        'unlimitedammo': [
            'Unlimited Ammo',
            '',
            () => {return keyNameToTextData.settings.unlimitedammo},
            () => {return !!keyNameToTextData.settings.unlimitedammo}
        ],
        'unlimitedfuel': [
            'Unlimited Fuel',
            '',
            () => {return keyNameToTextData.settings.unlimitedfuel},
            () => {return !!keyNameToTextData.settings.unlimitedfuel}
        ],
        'verycloseplanets': [
            'Planets < 81 LY From HW',
            '',
            () => {return keyNameToTextData.settings.verycloseplanets},
            true
        ],
        'victorycountdown': [
            'Victory Countdown',
            '',
            () => {return keyNameToTextData.settings.victorycountdown},
            true
        ],
        //Setting this value to any value other than "0" will cause a Wandering Tribes game to be created. It will also cause the "Wandering Tribes Starting Locations" 
        //parameter to be visible, and cause the "Homeworld - Has Starbase", "Homeworld - Resources", "Homeworld - Clans", "Extra Starting Planets", "Extra Starting Ships",
        //"Extra Starting Planets - Center Player" and "Extra Starting Ships - Center Player" "Extra Planets Randomly Located", "Extra Ships Randomly Located" parameters to be removed.
        'wanderingtribescount': [
            'Wandering Tribes Count',
            'This is the number of Super Transport Freighters that each player starts with.',
            () => {return keyNameToTextData.settings.wanderingtribescount},
            ()=>{return keyNameToTextData.settings.wanderingtribescount > 0}
        ],
        'wanderingtribesdist': [
            'Wandering Tribes Distribution',
            'This describes how the Homeworlds are to be distributed on the map.',
            () => {return ValueStringConversion([0, 'Use Homeworld Area', 1, 'Everyone At The Center Point', 2, 'Random (ships do not start together)', keyNameToTextData.settings.wanderingtribesdist], keyNameToTextData.settings.wanderingtribesdist)},
            () => {return keyNameToTextData.settings.wanderingtribescount > 0}
        ],
        'webdiplomacylevel': [
            'Webmine Diplomacy Level',
            '',
            () => {return ValueStringConversion([ 0, 'Safe Passage Grants Immunity', 3, 'Share Intel Grants Immunity', 4, 'Alliance Grants Immunity', keyNameToTextData.settings.webdiplomacylevel], keyNameToTextData.settings.webdiplomacylevel)},
            () => {return RaceAvailable(Race.Crystal) && (keyNameToTextData.settings.maxsafepassage > 0 || keyNameToTextData.settings.teamsize > 0)}
        ],
        'wormholemix': [
            'Wormhole Mix',
            'This is the percentage of Wormholes that allow travelling in both directions.',
            () => {return `${keyNameToTextData.settings.wormholemix}%`},
            () => {return keyNameToTextData.settings.maxwormholes > 0}
        ],
        'wormholescanrange': [
            'Wormhole Scan Range', 
            'This is the distance, in light-years, at which a Sensor Sweep mission will detect a Wormhole.', 
            () => {return keyNameToTextData.settings.wormholescanrange}, 
            () => {return keyNameToTextData.settings.maxwormholes > 0}
        ],
        'neutrinostars': [
            'Neutrino Stars',
            '',
            () => {return keyNameToTextData.settings.neutrinostars},
            () => {return keyNameToTextData.settings.neutrinostars}
        ],
        'blackholes' : [
            'Black Holes',
            '',
            () => {return keyNameToTextData.settings.blackholes},
            () => {return keyNameToTextData.settings.blackholes}
        ],
        'migtransportreplacesmigscout' : [
            'migtransportreplacesmigscout',
            '',
            () => {return keyNameToTextData.settings.migtransportreplacesmigscout},
            () => {return keyNameToTextData.settings.migtransportreplacesmigscout}
        ],
        'saurianlightfrigatereplacessaurian' : [
            'saurianlightfrigatereplacessaurian',
            '',
            () => {return keyNameToTextData.settings.saurianlightfrigatereplacessaurian},
            () => {return keyNameToTextData.settings.saurianlightfrigatereplacessaurian}
        ],
        'scorpiuscarrierreplacesscorpiuslight' : [
            'scorpiuscarrierreplacesscorpiuslight',
            '',
            () => {return keyNameToTextData.settings.scorpiuscarrierreplacesscorpiuslight},
            () => {return keyNameToTextData.settings.scorpiuscarrierreplacesscorpiuslight}
        ],
        'sscruiseriireplacessscruiser' : [
            'sscruiseriireplacessscruiser',
            '',
            () => {return keyNameToTextData.settings.sscruiseriireplacessscruiser},
            () => {return keyNameToTextData.settings.sscruiseriireplacessscruiser}
        ],
        'sscarrierplusreplacessscarrier' : [
            'sscarrierplusreplacessscarrier',
            '',
            () => {return keyNameToTextData.settings.sscarrierplusreplacessscarrier},
            () => {return keyNameToTextData.settings.sscarrierplusreplacessscarrier}
        ],
        'skyfireplusreplacesskyfire' : [
            'skyfireplusreplacesskyfire',
            '',
            () => {return keyNameToTextData.settings.skyfireplusreplacesskyfire},
            () => {return keyNameToTextData.settings.skyfireplusreplacesskyfire}
        ],
        'd7creplacesd7a' : [
            'd7creplacesd7a',
            '',
            () => {return keyNameToTextData.settings.d7creplacesd7a},
            () => {return keyNameToTextData.settings.d7creplacesd7a}
        ],
        'quietusplusreplacesquietus' : [
            'quietusplusreplacesquietus',
            '',
            () => {return keyNameToTextData.settings.quietusplusreplacesquietus},
            () => {return keyNameToTextData.settings.quietusplusreplacesquietus}
        ],
        'cybernautlightreplacescybernaut' : [
            'cybernautlightreplacescybernaut',
            '',
            () => {return keyNameToTextData.settings.cybernautlightreplacescybernaut},
            () => {return keyNameToTextData.settings.cybernautlightreplacescybernaut}
        ],
        'moscowinterceptinterference' : [
            'moscowinterceptinterference',
            '',
            () => {return keyNameToTextData.settings.moscowinterceptinterference},
            () => {return keyNameToTextData.settings.moscowinterceptinterference}
        ],
        'scoutsplanetimmunity' : [
            'scoutsplanetimmunity',
            '',
            () => {return keyNameToTextData.settings.scoutsplanetimmunity},
            () => {return keyNameToTextData.settings.scoutsplanetimmunity}
        ],
        'hrossfightertransfer' : [
            'hrossfightertransfer',
            '',
            () => {return keyNameToTextData.settings.hrossfightertransfer},
            () => {return keyNameToTextData.settings.hrossfightertransfer}
        ],
        'victoryscorepointsneededsolo' : [
            'victoryscorepointsneededsolo',
            '',
            () => {return keyNameToTextData.settings.victoryscorepointsneededsolo},
            () => {return game.game.wincondition == WinCondition.VictoryScore}
        ],
        'victoryscorepointsneededally' : [
            'victoryscorepointsneededally',
            '',
            () => {return keyNameToTextData.settings.victoryscorepointsneededally},
            () => {return game.game.wincondition == WinCondition.VictoryScore}
        ],
        'victoryscorepointsperplanet' : [
            'victoryscorepointsperplanet',
            '',
            () => {return keyNameToTextData.settings.victoryscorepointsperplanet},
            () => {return game.game.wincondition == WinCondition.VictoryScore}
        ],
        'victoryscorepointsperstarbase' : [
            'victoryscorepointsperstarbase',
            '',
            () => {return keyNameToTextData.settings.victoryscorepointsperstarbase},
            () => {return game.game.wincondition == WinCondition.VictoryScore}
        ],
        'victoryscorepointsperhighpop' : [
            'victoryscorepointsperhighpop',
            '',
            () => {return keyNameToTextData.settings.victoryscorepointsperhighpop},
            () => {return game.game.wincondition == WinCondition.VictoryScore}
        ],
        'victoryscoreclansforhighpop' : [
            'victoryscoreclansforhighpop',
            '',
            () => {return keyNameToTextData.settings.victoryscoreclansforhighpop},
            () => {return game.game.wincondition == WinCondition.VictoryScore}
        ],
        'victoryscorepointsperbonus' : [
            'victoryscorepointsperbonus',
            '',
            () => {return keyNameToTextData.settings.victoryscorepointsperbonus},
            () => {return game.game.wincondition == WinCondition.VictoryScore}
        ],
    })

    const removeFunction = (obj) => {
        let  value = typeof obj == 'function' ? obj() : obj
        return value
    }

    const GroupThese = (...args) => {
        let output = []
        let first 
        while(!keyNameToTextData?.[first]?.[3] && args.length > 0) first = args.shift()
        if(!first) output = ['','',()=>{return ''},false]
        else {
            output[0] = keyNameToTextData[first][0]
            output[1]=''
            let others = `${keyNameToTextData[first][2]()}`
            for(const str of args) {
                if(removeFunction(keyNameToTextData[str][3])) {
                    others += `\n${keyNameToTextData[str][0]}: ${keyNameToTextData[str][2]()}`
                }
            }
            output[2]=()=>{
                return others
            }
            output[3] = true
            return output
        }
    }

    const AreAnyParamsVisible = (array) => {
        return array.some(parm =>{return !(keyNameToTextData[parm]) || ((typeof keyNameToTextData[parm][3] == 'function' || keyNameToTextData[parm][3] instanceof Function) && keyNameToTextData[parm][3]()) || ((typeof keyNameToTextData[parm][3] == 'boolean' || keyNameToTextData[parm][3] instanceof Boolean) && keyNameToTextData[parm][3])})
    }

    const categories = {
        'Game Details': {
            visibility: true,
            parameters: ['__Game Details']
        },
        'Game Settings': {
            visibility: true,
            parameters: [
                'campaignmode', 
                'maxadvantage', 
                'chainedintercept', 
                'cloakfail', 
                'cloningenabled', 
                'colonisttaxrateadjustments', 
                'combatrng', 
                'computerreplacedrops', 
                'defensepostsblocksensorsweep', 
                'directtransferammo', 
                'directtransfermc', 
                'dumppartsdumpstorps', 
                'emorkslegacy', 
                'fcodesbdx', 
                'fcodesextraalchemy', 
                'fcodesmustmatchgsx', 
                'fcodesrbx', 
                'groundattackadjustments', 
                'hwlosthappinesslosscolonists', 
                'hwlosthappinesslossnatives', 
                'showallexplosions', 
                'stealthmode', 
                'structuredecayrate', 
                'torpedoset', 
                'transferoverloadprioritizeammo',
                'meteorshowerchance', 
            ], 
        },
        'Build Settings': {
            visibility: true,
            parameters: [
                //Ship Build Type
                'shiplimittype', 'productionqueue', 'planetaryproductionqueue',
                // Classic, Production Queue, Priority Production Queue
                'shiplimit','ppqminbuilds', 'productionbasecost', 'productionsmallshipset', 'productionstarbaseoutput', 'productionstarbasereward',
                //Planets Limit Ships
                'plsshipsperplanet', 'plsminships', 'plsextraships',
            ],
        },
        'Map Settings': {
            visibility: true,
            subcategories: {
                'Map': {
                    visibility: true,
                    parameters: [
                        //Map Parameters
                        '__Map Parameters',
                        //Planet Distribution
                        '__Planet Distribution',
                        //Native Details
                        '__Native Parameters',
                    ],
                },
                'Stellar Phenomena': {
                    get visibility() {return AreAnyParamsVisible(categories['Map Settings'].subcategories['Stellar Phenomena'].parameters)},
                    parameters: [
                        'maxions', 'nuionstorms', 'maxioncloudsperstorm', 
                        'stars', 
                        'ndebrisdiscs', 'debrisdiskpercent', 'debrisdiskversion', 
                        'nebulas', 
                        'maxwormholes', 'wormholemix', 'wormholescanrange',
                        'neutrinostars',
                        'blackholes'
                    ],
                }, 
                'Starting Conditions': {
                    visibility: true,
                    parameters: [
                        'acceleratedturns', 
                        'nohomeworld', 
                        'runningstart', 
                        'shuffleteampositions', 
                        'wanderingtribescount', 
                        'wanderingtribesdist', 
                        'extraplanets', 
                        'extraplanetsrandomloc', 
                        'extraships', 
                        'extrashipsrandomloc', 
                        'fixedstartpositions', 
                        'homeworldclans', 
                        'homeworldhasstarbase', 
                        'homeworldresources', 
                        'hwdistribution', 
                        'centerextraplanets', 
                        'centerextraships'
                    ]
                },
                'Mineral': {
                    visibility: true,
                    parameters: [
                        'averagedensitypercent',
                        '__neutronium',
                        '__duranium',
                        '__tritanium',
                        '__molybdenum',
                    ]
                },
                'Scan': {
                    visibility: true,
                    parameters: ['planetscanrange', 'shipscanrange', 'sensorsweepcombatpodscanrange', 'sensorsweepnoncombatpodscanrange', ]
                }, 
            }
        },
        'Player Settings': {
            visibility: true,
            parameters: ['teamsize', 'randomplayerslots', 'maxplayersperrace', 'playerselectrace',  'disallowedraces'],
        },
        'Ship Settings': {
            visibility: true,
            parameters: ['supertransportfuelmod', 'scoutsplanetimmunity'],
        },
        'Win/Loss Conditions': {
            visibility: true,
            parameters: [
                //All
                'victorycountdown',
                //Fight Or Fail
                'fightorfail', 'fofaccelrate' /* Unused? */, 'fofaccelstartdate' /* Unused? */, 'fofaccelstartturn', 'fofactiveturn' /* Unused? */, 'fofbyteam', 'fofincrement',
                //Loss
                'killrace',
                //Military Score
                'militaryscorepercent',
                //Fixed Turn
                'endturn',
                //Top Advance
                'topadvancecount',
                //Victory Score
                'victoryscorepointsneededsolo', 'victoryscorepointsneededally', 'victoryscorepointsperplanet', 'victoryscorepointsperstarbase', 'victoryscorepointsperhighpop', 'victoryscoreclansforhighpop', 'victoryscorepointsperbonus'
            ],
        },
        'Diplomacy Settings': {
            visibility: true,
            parameters: ['alliessharefullinfo','aicanchangediplomacy', 'maxallies', 'maxshareintel', 'maxsafepassage'],
        },
        'Race Settings':{
            get visibility(){return Array.from(Object.values(categories['Race Settings'].subcategories)).map(race=>{return race.visibility}).some(v=>v)},
            subcategories: {
                'Federation': {
                    get visibility() {return RaceAvailable(Race.Federation) && AreAnyParamsVisible(categories['Race Settings'].subcategories['Federation'].parameters)},
                    parameters: ['quantumtorpedos', 'quantumtorpedomissrateforgravitonics'],
                }, 
                'Lizard': {
                    get visibility() {return RaceAvailable(Race.Lizard) && AreAnyParamsVisible(categories['Race Settings'].subcategories['Lizard'].parameters)},
                    parameters: ['maxhissersperplanet', 'mining200adjustment', 'racehullsonlyhiss', 'saurianlightfrigatereplacessaurian'],
                },
                'Bird': {
                    get  visibility() {return RaceAvailable(Race.Bird) && AreAnyParamsVisible(categories['Race Settings'].subcategories['Bird'].parameters)},
                    parameters: ['birdshaveenlighten', 'cloakandintercept', 'racehullsonlycloakandintercept', 'superspyadvanced', 'skyfireplusreplacesskyfire', 'quietusplusreplacesquietus']
                },
                'Fury': {
                    get visibility() {return RaceAvailable(Race.Fury) && AreAnyParamsVisible(categories['Race Settings'].subcategories['Fury'].parameters)},
                    parameters: ['fascistdoublebeams', 'racehullsonlyfascistdoublebeams', 'd7creplacesd7a']
                },
                'Privateer': {
                    get visibility() {return RaceAvailable(Race.Privateer) && AreAnyParamsVisible(categories['Race Settings'].subcategories['Privateer'].parameters)},
                    parameters: ['skyfireplusreplacesskyfire', 'd7creplacesd7a'],
                },
                'Cyborg': {
                    get visibility() {return RaceAvailable(Race.Cyborg) && AreAnyParamsVisible(categories['Race Settings'].subcategories['Cyborg'].parameters)},
                    parameters: ['assimilationrateadjustment', 'chunnelstabilizationeverywhere', 'cyborgmaxnativetaxrateadjustment', 'highidfixchunnelusepodhullid']
                },
                'Crystal': {
                    get visibility() {return RaceAvailable(Race.Crystal) && AreAnyParamsVisible(categories['Race Settings'].subcategories['Crystal'].parameters)},
                    parameters: ['crystalwebimmunity', 'nowebfriendlycodes', 'nowebsinotherids', 'sapphirenowebimmunity', 'webdiplomacylevel']
                },
                'Evil Empire': {
                    get visibility() {return RaceAvailable(Race.EvilEmpire) && AreAnyParamsVisible(categories['Race Settings'].subcategories['Evil Empire'].parameters)},
                    parameters: ['destroyplanetcausesfear', 'freestarbasefighters5adjustment', 'galacticpower', 'highidfixfightertransferoffset', 'sscruiserinterceptinterference', 'starbasefightertransfer', 'migtransportreplacesmigscout', 'sscruiseriireplacessscruiser', 'sscarrierplusreplacessscarrier', 'moscowinterceptinterference', 'hrossfightertransfer']
                },
                'Robots': {
                    get visibility() {return RaceAvailable(Race.Robots) && AreAnyParamsVisible(categories['Race Settings'].subcategories['Robots'].parameters)},
                    parameters: ['cybernautlightreplacescybernaut']
                },
                'Rebels': {
                    get visibility() {return RaceAvailable(Race.Rebel) && AreAnyParamsVisible(categories['Race Settings'].subcategories['Rebels'].parameters)},
                    parameters: ['repairshipreplacessagefrigate']
                },
                'Colonies of Man': {
                    get visibility() {return RaceAvailable(Race.ColoniesOfMan) && AreAnyParamsVisible(categories['Race Settings'].subcategories['Colonies of Man'].parameters)},
                    parameters: ['scorpiuscarrierreplacesscorpiuslight']
                },
                'Horwasp': {
                    get visibility() {return RaceAvailable(Race.Horwasp) && AreAnyParamsVisible(categories['Race Settings'].subcategories['Horwasp'].parameters)},
                    parameters: ['burrowsimprovemining', 'hivesdetectlife', 'horwaspfighterlossclankill', 'horwaspscanrobotmodifier', 'nochunnelhives']
                },
            },
        },   
        'Training Settings': {
            get visibility() {AreAnyParamsVisible(categories['Training Settings'].parameters)},
            parameters: ['allshareintel', 'allvisible', 'isacademy', 'minefieldsvisible', 'nominefields', 'nosupplies', 'nowarpwells', 'unlimitedammo', 'unlimitedfuel', ]
        },
        'Unknown Settings': {
            visibility: true,
            parameters: ['alwaysuseendturn', 'balanceadjustment', 'deadradius', 'developmentfactor', 'discussionid', 'hideplayerselection', 'hideraceselection', 'id', 'joininggroupindex', 'ncircles', 'orderedgroupjoindays', 'snapgridsize', 'storyid', 'presetadvantages', 'presethulls', 'presethullsbyrace']
        },
        'Hidden Settings': {
            visibility: false,
            parameters: [
                'computerbuilddelay', 
                'computerbuildships', 
                'computerplayerrangelimitation', 
                'bringhomesectorships', 
                'buildqueueplanetid', 
                'entryportalplayers', 
                'homesectorshipvaluemax', 
                'homesectorshipvaluemin', 
                'levelid', 
                'nextlevelid', 
                'nextplanets', 
                'planetlevelmax', 
                'reinforcementsallowed',
                //Hidden due to being in a grouping
                'mapheight', 'mapwidth', 'mapshape', 'sphere', //__Map Parameters
                'numplanets', 'verycloseplanets', 'closeplanets', 'closeplanetrangeinc' , 'otherplanetsminhomeworlddist', //__Planet Distribution
                'nativeprobability', 'maxnativeclans', 'minnativeclans', 'nativegovernmentlevel', 'nativetaxrateadjustments', //__Native Parameters
                'neugroundmax', 'neusurfacemax', 'neutroniumlevel', //'__neutronium'
                'durgroundmax', 'dursurfacemax', 'duraniumlevel', //'__duranium'
                'trigroundmax', 'trisurfacemax', 'tritaniumlevel', //'__tritanium'
                'molgroundmax', 'molsurfacemax', 'molybdenumlevel', //'__molybdenum'
                'name', 'turn', 'nexthost', 'hoststart', 'hostcompleted', 'lastinvite', 'gamepassword', //__Game Details
            ]
        },
        'Uncategorized': {
            get visibility() {return categories['Uncategorized'].parameters.length > 0},
            parameters: []
        }
    }
    const addAllSettings = (settings, object) => {
        const contains = (object, parameter) => {
            let returnValue = false
            if(object.parameters) {returnValue |= object.parameters.includes(parameter)}
            else {
                for(const key in object?.subcategories ?? object) {
                    returnValue |= contains((object?.subcategories ?? object)[key], parameter)
                    if(returnValue) {
                        break
                    }
                }
            }
            return returnValue
        }
        for(const key in settings) {
            if(!contains(object, key)) {categories['Uncategorized'].parameters.push(key)}
        }
    }
    const createHTML = (obj) => {
        if(obj.parameters) {
            return obj.parameters.filter(p=>keyNameToTextData[p]?removeFunction(keyNameToTextData[p][3]):true).map(p=>{return createElementWithExtraData('label', 'style', ['white-space', 'pre-wrap', 'text-transform', 'inherit'], 'textContent', `${keyNameToTextData[p]?.[0] ?? p}: ${keyNameToTextData[p]?.[2]() ?? game.settings[p]}\n\r${keyNameToTextData[p]?.[1]?removeFunction(keyNameToTextData[p][1])+'\n\r\n':''}`)})
        } else if (obj.subcategories) {
            return Array.from(Object.keys(obj.subcategories)).filter(k=>obj.subcategories[k].visibility).map(k=> {return createElementWithExtraData('fieldset', 'id', k, 'children', [
                createElementWithExtraData('legend', 'style', ['white-space', 'pre-wrap'], 'textContent', ' '+k),
                ...createHTML(obj.subcategories[k])
            ])})
        } else {
            return createElementWithExtraData('form', 'children', [
                ...Array.from(Object.keys(obj)).filter(k=>obj[k].visibility).map(k=> {return createElementWithExtraData('fieldset', 'id', k, 'children', [
                    createElementWithExtraData('legend', 'textContent', k),
                    ...createHTML(obj[k])
                ])})
            ])
        }
    }
    const watchForSettings = async (mutationList, observer) => {
        for(const mutation of mutationList) {
            if(mutation.target.id == 'etabcontent') {
                let target = mutation.target.querySelector('#eallsettings')
                if(target) {
                    let urlParts = window.location.href.split('/')
                    if (urlParts[urlParts.length-1] == 'settings') {
                        game = JSON.parse(await GetRequest(`https://api.planets.nu/game/loadinfo?gameid=${urlParts[urlParts.length-2]}`));
                        if(game) {
                            keyNameToTextData.settings = game.settings
                            addAllSettings(game.settings, categories)
                            let html = createHTML(categories, 0)
                            target.replaceChildren(html)
                        }
                    }
                }
            }
        }
    }
    const observer = new MutationObserver(watchForSettings)
    observer.observe(document, {subtree:true, childList:true, attributes:true, attributeFilter:['id']})
}
var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";
document.body.appendChild(script);