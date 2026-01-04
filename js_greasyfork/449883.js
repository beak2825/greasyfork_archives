// ==UserScript==
// @name        VV XP (old)
// @namespace   kire12
// @match       https://myforge-old.vulcanforged.com/MyWallet/Lava*
// @grant       none
// @license MIT
// @version     2.0.13
// @author      -
// @description XP Dashboard for VulcanVerse and other VulcanForged games.
// @require     https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @downloadURL https://update.greasyfork.org/scripts/449883/VV%20XP%20%28old%29.user.js
// @updateURL https://update.greasyfork.org/scripts/449883/VV%20XP%20%28old%29.meta.js
// ==/UserScript==
 
window.vv_vue = false
 
const vvxp_main = /* html */ `
<section class="p-2 p-md-3 p-lg-5 p-xxl-5">
    <style>
        #vvxp_main .hoverRow:hover {
            background-color: #303030;
        }
 
        #vvxp_main button {
            color: white;
        }
 
        #vvxp_main button:disabled {
            color: gray;
            pointer-events: initial;
            cursor: not-allowed;
        }
 
        #vvxp_main input[type="number"] {
            width: 50px;
        }
 
        .quadrant-heading {
            margin-top: 0.5rem;
        }
 
        .landmark :not(.visited-landmark) {
            color: white;
        }
 
        .bullet:before {
            content: '• '
        }
 
        .visited-landmark {
            text-decoration: line-through;
        }
 
        .total-border {
            margin-top: 0.5rem;
            font-weight: bold;
            border-top: 2px solid;
        }
 
        .center  {
            text-align: center;
        }
        
        .right-padding {
            padding-right: 0.25rem;
        }
 
        tr.tr-outline {
            outline: thin solid;
        }
 
        tr.tr-padding > td, tr.tr-padding > th {
            padding: 0.25rem;
        }
 
        .td-padding-right {
            padding: 0.25rem;
        }
 
        .td-align-top {
            vertical-align: top;
        }
 
        .bold {
            font-weight: bold;
        }
 
        .red {
            color: red;
        }
 
        
    </style>
 
    <div id="vvxp_main" class="col-auto" v-cloak></div>
    
</section>
`
 
 
 
// LANDMARKS
Vue.component('vvxp-landmarks', {
    template: /* html */ `
 
<div class="p-4 CurrentLavaStatus">
    <div class="col text-uppercase">
        <h4 class="GredientText">{{title}}</h4>
    </div>
 
    <table>
        <tr>
            <td class="center right-padding" :class="{'text-white': !quadrant_bonus}">{{quadrant_bonus ? '✅' : '✖'}}</td>
            <td>Quadrant bonus (20 XP)</td>
        </tr>
        <tr>
            <td class="center right-padding td-align-top" :class="{'text-white': !all_landmarks}">
                <span v-if="all_landmarks">✅</span>
                <span v-else>{{count_landmarks}}&nbsp;/</span>
            </td>
            <td>{{total_landmarks}} Landmarks visited (10 XP each)</td>
        </tr>
    </table>
 
    <div v-for="quadrant in quadrants">
        <div class="TruenoSemiBold Fsize_14 text-uppercase quadrant-heading">{{quadrant}}</div>
        <div v-for="landmark in daily_landmarks.filter(landmark => landmark.quadrant == quadrant)" class='landmark bullet'>
            <span :class="{'visited-landmark': landmark.visited}">{{landmark.names.slice(-1)[0]}}</span>
        </div>
    </div>
    <!-- Troy (not yet) -->
    <div class="total-border">{{total_xp}} XP total earned</div>
</div>
 
    `,
    props: {
        entries: { type: Array }
    },
    computed: {
        landmarkEntries() {
            return this.entries.filter(entry => entry.detailMessage.includes(this.detailMessage))
        },
 
        quadrant_entry() {
            return this.entries.filter(entry => entry.detailMessage.includes(this.quadrant_detailMessage))
        },
 
        quadrant_bonus() {
            return !!this.quadrant_entry.length
        },
 
        count_landmarks() {
            return this.landmarkEntries.length
        },
 
        total_landmarks() {
            return this.landmarks.length
        },
 
        all_landmarks() {
            return this.count_landmarks >= this.total_landmarks
        },
 
        quadrants() {
            return uniqueArr(this.landmarks.map(landmark => landmark.quadrant))
        },
 
        daily_landmarks() {
            return this.landmarks.map(landmark => {
                landmark.visited = !!landmark.names.find(name => !!this.landmarkEntries.find(entry => entry.detailMessage.includes(`[Visit ${name}]`)))
                return landmark
            })
        },
 
        total_xp() {
            return ssr(this.landmarkEntries) + ssr(this.quadrant_entry)
        }
    },
    data() {
        return {
            title: 'Landmarks',
            detailMessage: '[Visit ',
            quadrant_detailMessage: '[Daily LANDMARK ON EACH QUADRANT]',
            landmarks: [{
                names: ['ENTRANCE TO THE MINOTAUR LABYRINTH', "Minotaur's Labyrinth"],
                quadrant: 'Boreas'
            }, {
                names: ['HARPIES NEST', 'Harpies Nest'],
                quadrant: 'Boreas'
            }, {
                names: ['FORTRESS OF THE WIND', 'Fortress of The Wind'],
                quadrant: 'Boreas'
            }, {
                names: ['LAIR OF THE CYCLOPS', 'Lair of the Cyclops'],
                quadrant: 'Boreas'
            }, {
                names: ['DEEP FOREST', 'Deep Forest'],
                quadrant: 'Arcadia'
            }, {
                names: ['SUMMER PALACE', 'Summer Palace'],
                quadrant: 'Arcadia'
            }, {
                names: ['DRUID SHRINE', 'Druid Shrine'],
                quadrant: 'Arcadia'
            }, {
                names: ['WOODLANDS OF AMBROSIA', 'Woodlands of Ambrosia'],
                quadrant: 'Arcadia'
            }, {
                names: ['WINERIES OF THE NECTAR OF THE GODS', 'Wineries of the Nectar of the Gods'],
                quadrant: 'Arcadia'
            }, {
                names: ['SHRINE TO TETHIS', 'Shrine of Tethis'],
                quadrant: 'Notus'
            }, {
                names: ['PYRAMID MAUSOLEUM 1', 'Pyramid Mausoleum A'],
                quadrant: 'Notus'
            }, {
                names: ['PYRAMID MAUSOLEUM 3', 'Pyramid Mausoleum C'],
                quadrant: 'Notus'
            }, {
                names: ['PYRAMID MAUSOLEUM 2', 'Pyramid Mausoleum B'],
                quadrant: 'Notus'
            }, {
                names: ['PLANES OF THE HOLLOWING DARKNESS', 'Plains of the Howling Darkness'],
                quadrant: 'Hades'
            }, {
                names: ['THE NECROPOLIS', 'Unknown Landmark', 'The Necropolis'],
                quadrant: 'Hades'
            }, {
                names: ['PALACE OF THE DEAD', 'Palace of the Dead'],
                quadrant: 'Hades'
            }],
        }
    }
})
 
 
// FORAGES
Vue.component('vvxp-forages', {
    template: /* html */ `
 
<div class="p-4 CurrentLavaStatus">
    <div class="col text-uppercase">
        <h4 class="GredientText">{{title}}</h4>
    </div>
 
    <table>
        <tr>
            <td class="center right-padding" :class="{'text-white': !quadrant_bonus}">{{quadrant_bonus ? '✅' : '✖'}}</td>
            <td>Quadrant bonus (20 XP)</td>
        </tr>
        <tr>
            <td class="center right-padding td-align-top" :class="{'text-white': quota_not_met}">
                <span v-if="quota_bonus">{{quota_bonus}}</span>
                <span v-if="quota_not_met">{{count_forages}}&nbsp;/</span>
            </td>
            <td>{{quota_goal}} Daily Forages (25 XP)</td>
        </tr>
    </table>
 
    <br>
    <table>
        <tr>
            <th class="center">Count</th>
            <th class="center">Total</th>
            <th>Forage Type</th>
            <th>Drop %</th>
        </tr>
        <tr v-for="rarity in daily_forages">
            <td class="center">{{rarity.count}}</td>
            <td class="center">{{rarity.total_xp}} XP</td>
            <td class="td-padding-right">{{rarity.type}} ({{rarity.xp}} XP)</td>
            <td>{{rarity.percent}}%</td>
        </tr>
        <tr class="tr-outline tr-padding">
            <td class="center">{{forage_totals.count}}</td>
            <td class="center">{{forage_totals.total_xp}} XP</td>
            <td>Average:<br><span class="bold">{{forage_totals.average}} XP/forage</span></td>
        </tr>
    </table>
 
    <div class="total-border">{{total_xp}} XP total earned</div>
 
    <!--
    <div class="TruenoSemiBold Fsize_14 text-uppercase quadrant-heading">Weekly Average</div>
    -->
</div>
 
    `,
    props: {
        entries: { type: Array }
    },
    computed: {
        forageEntries() {
            return this.entries.filter(entry => entry.detailMessage.includes(this.detailMessage))
        },
 
 
        quadrant_entry() {
            return this.entries.filter(entry => entry.detailMessage.includes(this.quadrant_detailMessage))
        },
 
        quadrant_bonus() {
            return !!this.quadrant_entry.length
        },
 
 
        quota_entry() {
            return this.entries.filter(entry => entry.detailMessage.includes(this.quota_detailMessage))
        },
 
        quota_bonus() {
            const count = this.quota_entry.length
            if (count == 0) return false
            else if (count == 1) return '✅'
            else if (count > 1) return `✅x${count}` // possible bug where "Daily 10 FORAGES" happens twice in a day
            // return !!this.quota_entry.length
        },
 
 
        count_forages() {
            return this.forageEntries.length
        },
 
        quota_not_met() {
            return this.count_forages < this.quota_goal
        },
 
 
        daily_forages() {
            return this.rarities.map(rarity => {
                rarity.count = this.forageEntries.filter(forage => forage.amount == rarity.xp).length
                rarity.total_xp = rarity.count * rarity.xp
                rarity.percent = round((rarity.count / this.forageEntries.length) * 100, 2)
                return rarity
            })
        },
 
        forage_totals() {
            const count = ssr(this.daily_forages, 'count')
            const total_xp = ssr(this.daily_forages, 'total_xp')
            const average = round((total_xp / count), 2)
 
            return {
                count,
                total_xp,
                average
            }
        },
 
        total_xp() {
            return ssr(this.forageEntries) + ssr(this.quadrant_entry) + ssr(this.quota_entry)
        }
    },
    data() {
        return {
            title: 'Forages',
            detailMessage: '[Foraging]',
            quadrant_detailMessage: '[Daily FORAGE ON EACH QUADRANT]',
            quota_detailMessage: '[Daily 10 FORAGES]',
            quota_goal: 10,
            rarities: [{
                type: 'Common',
                xp: 1
            }, {
                type: 'Rare',
                xp: 2
            }, {
                type: 'Epic',
                xp: 3
            }, {
                type: 'Mythic',
                xp: 4
            }, {
                type: 'Legendary',
                xp: 5
            }],
        }
    }
})
 
 
// BATTLES
Vue.component('vvxp-battles', {
    template: /* html */ `
<div class="p-4 CurrentLavaStatus">
    <div class="col text-uppercase">
        <h4 class="GredientText">{{title}}</h4>
    </div>
 
    <table>
        <tr>
            <td class="center right-padding" :class="{'text-white': !quadrant_bonus}">{{quadrant_bonus ? '✅' : '✖'}}</td>
            <td>Quadrant bonus (20 XP)</td>
        </tr>
        <tr>
            <td class="center right-padding td-align-top" :class="{'text-white': !quota_met}">
                <span v-if="quota_met">✅</span>
                <span v-else>{{count_battles}}&nbsp;/</span>
            </td>
            <td>{{quota_goal}} Daily Battles (50 XP)</td>
        </tr>
    </table>
 
    <br>
    <table>
        <tr class="tr-padding">
            <th class="center">Count</th>
            <th class="center">Total</th>
            <th></th>
        </tr>
        <tr class="tr-outline tr-padding">
            <td class="center">{{count_battles}}</td>
            <td class="center">{{battle_total_xp}} XP</td>
            <td>Battles (1 XP)</td>
        </tr>
    </table>
 
    <div class="total-border">{{total_xp}} XP total earned</div>
 
</div>
 
    `,
    props: {
        entries: { type: Array }
    },
    computed: {
        battleEntries() {
            return this.entries.filter(entry => entry.detailMessage.includes(this.detailMessage))
        },
 
 
        quadrant_entry() {
            return this.entries.filter(entry => entry.detailMessage.includes(this.quadrant_detailMessage))
        },
 
        quadrant_bonus() {
            return !!this.quadrant_entry.length
        },
 
 
        quota_entry() {
            return this.entries.filter(entry => entry.detailMessage.includes(this.quota_detailMessage))
        },
 
        quota_bonus() {
            return !!this.quota_entry.length
        },
 
 
        count_battles() {
            return this.battleEntries.length
        },
 
        quota_met() {
            return this.count_battles >= this.quota_goal
        },
 
        battle_total_xp() {
            return ssr(this.battleEntries)
        },
 
        total_xp() {
            return this.battle_total_xp + ssr(this.quadrant_entry) + ssr(this.quota_entry)
        }
    },
    data() {
        return {
            title: 'Battles',
            detailMessage: '[Fight Won]',
            quadrant_detailMessage: '[Daily FIGHT ON EACH QUADRANT]',
            quota_detailMessage: '[Daily 10 FIGHT WINS]',
            quota_goal: 10,
        }
    }
})
 
 
 
// QUESTS
Vue.component('vvxp-quests', {
    template: /* html */ `
<div class="p-4 CurrentLavaStatus">
    <div class="col text-uppercase">
        <h4 class="GredientText">{{title}}</h4>
    </div>
 
    <table>
        <tr class="tr-padding">
            <th class="center">Count</th>
            <th class="center">Total</th>
            <th></th>
        </tr>
        <tr class="tr-outline tr-padding">
            <td class="center">{{count_quests}}</td>
            <td class="center">{{total_xp_day}} XP</td>
            <td>Quests (XP varies)</td>
        </tr>
    </table>
    
    <div class="total-border">{{total_xp_day}} XP total earned (on {{active_date}})</div>
 
    <br>
    <div class="TruenoSemiBold Fsize_14 text-uppercase quadrant-heading">Weekly</div>
    <!--
    <div v-for="quest in weekly_quests" class='landmark bullet'>
        <span :class="{'visited-landmark': quest.completed}">{{quest.name}}</span>
    </div>
    -->
    
    <table>
        <tr class="tr-padding">
            <th class="center">Done</th>
            <!--<th class="center">Total</th>-->
            <th>Quest</th>
            <th>Reward</th>
        </tr>
        <tr v-for="quest in weekly_quests" class="tr-padding hoverRow" :title="'Objective: ' + quest.objective">
            <td class="center">{{quest.completed}}</td>
            <!--<td class="center">{{quest.total_xp}} XP</td>-->
            <td>{{quest.name}} ({{quest.xp}} XP)</td>
            <td>{{quest.reward}}</td>
        </tr>
    <!--
        <tr class="tr-outline tr-padding">
            <td class="center">{{forage_totals.count}}</td>
            <td class="center">{{forage_totals.total_xp}} XP</td>
            <td>Average:<br><span class="bold">{{forage_totals.average}} XP/forage</span></td>
        </tr>
    -->
    </table>
    
    <div class="total-border">{{total_xp_week}} XP total earned (from {{weeklyQuestsDate.start}} thru {{active_date}})</div>
    <div class="red" v-if="weeklyQuestsDate.notFullyLoaded">Week's entries not fully loaded.<br>Increase: "Number of weeks to load."</div>
 
</div>
 
    `,
    props: {
        entries: { type: Array },
        weeklyEntries: { type: Array },
        active_date: { type: String },
        xWeeksAgo: { type: String },
 
    },
    computed: {
        questEntries() {
            return this.entries.filter(entry => entry.detailMessage.includes(this.detailMessage))
        },
 
        count_quests() {
            return this.questEntries.length
        },
 
        total_xp_day() {
            return ssr(this.questEntries)
        },
 
 
        prevMonday() {
            return moment(this.active_date).isoWeekday(1).format('YYYY-MM-DD')
        },
 
        entriesSinceMonday() {
            return this.weeklyEntries.filter(entry => {
                const entry_date = entry.logDate.split('T')[0]
                return !moment(entry_date).isBefore(this.prevMonday) && !moment(entry_date).isAfter(this.active_date)
            })
        },
 
 
        weeklyQuestEntries() {
            return this.entriesSinceMonday.filter(entry => entry.detailMessage.includes(this.detailMessage))
        },
 
        weekly_quests() {
            return this.quests.map(quest => {
 
 
                const match = this.weeklyQuestEntries.filter(entry => entry.detailMessage.includes(`${quest.name}]`))//.includes(`[Quest -  ${quest.name}]`))
                quest.count = match.length
                quest.total_xp = ssr(match)
 
 
                quest.completed = !!quest.count ? (quest.count == 1 ? '✅' : `✅x${quest.count}`) : '✖' //!!quest.count //!!this.weeklyQuestEntries.find(entry => entry.detailMessage.includes(`[Quest ${quest.name}]`))
 
                return quest
            })
        },
 
        total_xp_week() {
            return ssr(this.weekly_quests, "total_xp")
        },
 
        weeklyQuestsDate() {
            const check = moment(this.xWeeksAgo).isAfter(this.prevMonday)
            return {
                start: check ? this.xWeeksAgo : this.prevMonday,
                notFullyLoaded: check
            }
        },
    },
    data() {
        return {
            title: 'Quests',
            detailMessage: '[Quest ',
            quests: [
                {
                    "name": "Buried Treasure",
                    "xp": 5,
                    "reward": "Terracotta x20",
                    "quest_giver": "",
                    "quest_giver_location": "",
                    "objective": "Forage 5 unique plots"
                },
                {
                    "name": "Bleed for the Dead",
                    "xp": 5,
                    "reward": "Soil x25",
                    "quest_giver": "",
                    "quest_giver_location": "",
                    "objective": "Take 2500 damage in fight"
                },
                {
                    "name": "Fly the Flag",
                    "xp": 25,
                    "reward": "Crystal x1",
                    "quest_giver": "",
                    "quest_giver_location": "",
                    "objective": "15 forages"
                },
                {
                    "name": "A Thirst for Blood",
                    "xp": 10,
                    "reward": "Terracotta x25",
                    "quest_giver": "",
                    "quest_giver_location": "Arcadia",
                    "objective": "Win 5 fights"
                },
                {
                    "name": "A New Robe",
                    "xp": 10,
                    "reward": "Leather x10",
                    "quest_giver": "",
                    "quest_giver_location": "Arcadia",
                    "objective": "Forage 5 Thread"
                },
                {
                    "name": "Failure is a Lesson Learned",
                    "xp": 25,
                    "reward": "Crystal x1",
                    "quest_giver": "",
                    "quest_giver_location": "",
                    "objective": "Lose 5 fights"
                },
                {
                    "name": "Deliver Riddles",
                    "xp": 10,
                    "reward": "Wood x25",
                    "quest_giver": "",
                    "quest_giver_location": "Arcadia? Notus?",
                    "objective": "Visit Hades, Arcadia, Boreas"
                },
                {
                    "name": "Map the World",
                    "xp": 15,
                    "reward": "Wood x10",
                    "quest_giver": "",
                    "quest_giver_location": "",
                    "objective": "Visit each quadrant and VC"
                },
                {
                    "name": "What lies beneath",
                    "xp": 10,
                    "reward": "Crystal x1",
                    "quest_giver": "",
                    "quest_giver_location": "",
                    "objective": "10 forages"
                },
                {
                    "name": "Baubles for a Queen",
                    "xp": 10,
                    "reward": "Soil x10",
                    "quest_giver": "",
                    "quest_giver_location": "Notus",
                    "objective": "Forage 3 Halite"
                },
                {
                    "name": "Punishment",
                    "xp": 15,
                    "reward": "Copper x10",
                    "quest_giver": "",
                    "quest_giver_location": "",
                    "objective": "Deal 1000 damage in fight"
                },
                {
                    "name": "Sightseeing",
                    "xp": 25,
                    "reward": "Crystal x1",
                    "quest_giver": "",
                    "quest_giver_location": "",
                    "objective": "Visit each quadrant and VC"
                }
            ] // https://vulcanforgedco.medium.com/vulcanverse-roadmap-reveal-c35278813e33
        }
    }
})
 
 
 
 
// OTHER
Vue.component('vvxp-other', {
    template: /* html */ `
<div class="p-4 CurrentLavaStatus">
    <div class="col text-uppercase">
        <h4 class="GredientText">{{title}}</h4>
    </div>
 
    <table>
        <tr>
            <td class="center right-padding" :class="{'text-white': !trades_bonus}">{{trades_bonus ? '✅' : '✖'}}</td>
            <td>5 Trades (10 XP)</td>
        </tr>
        <tr>
            <td class="center right-padding" :class="{'text-white': !activity_bonus}">{{activity_bonus ? '✅' : '✖'}}</td>
            <td>1 hour activity (10 XP)</td>
        </tr>
    </table>
 
    <div class="total-border">{{total_xp}} XP total earned</div>
 
</div>
 
    `,
    props: {
        entries: { type: Array }
    },
    computed: {
        trades_entries() {
            return this.entries.filter(entry => entry.detailMessage.includes(this.trades_detailMessage))
        },
 
        trades_bonus() {
            return !!this.trades_entries.length
        },
 
        trades_xp() {
            return ssr(this.trades_entries)
        },
 
 
        activity_entries() {
            return this.entries.filter(entry => entry.detailMessage.includes(this.activity_detailMessage))
        },
 
        activity_bonus() {
            return !!this.activity_entries.length
        },
 
        activity_xp() {
            return ssr(this.activity_entries)
        },
 
 
        total_xp() {
            return this.trades_xp + this.activity_xp
        }
    },
    data() {
        return {
            title: 'Other',
            trades_detailMessage: '[Daily TRADES]',
            activity_detailMessage: '[Daily Activity]',
        }
    }
})
 
 
 
// BERSERK
Vue.component('vvxp-berserk', {
    template: /* html */ `
<div class="p-4 CurrentLavaStatus">
    <div class="col text-uppercase">
        <h4 class="GredientText">{{title}}</h4>
    </div>
 
    <table>
        <tr class="tr-padding">
            <th class="center">Count</th>
            <th class="center">Total</th>
            <th></th>
        </tr>
        <tr>
            <td class="center">{{win_count}}</td>
            <td class="center">{{win_total_xp}} XP</td>
            <td>Win (10 XP)</td>
        </tr>
        <tr>
            <td class="center">{{loss_count}}</td>
            <td class="center">{{loss_total_xp}} XP</td>
            <td>Loss (3 XP)</td>
        </tr>
        <tr class="tr-outline tr-padding">
            <td class="center">{{total_count}}</td>
            <td class="center">{{total_xp}} XP</td>
            <td>Average:<br><span class="bold">{{match_average}} XP/match</span></td>
        </tr>
    </table>
 
    <br>
    <div>W/L ratio: {{match_ratio}}</div>
 
    <div class="total-border">{{total_xp}} XP total earned</div>
 
</div>
 
    `,
    props: {
        entries: { type: Array }
    },
    computed: {
        berserkEntries() {
            return this.entries.filter(entry => entry.message.includes(this.message))
        },
 
 
        win_entries() {
            return this.berserkEntries.filter(entry => entry.detailMessage.includes(this.win_detailMessage))
        },
 
 
        loss_entries() {
            return this.berserkEntries.filter(entry => entry.detailMessage.includes(this.loss_detailMessage))
        },
 
        win_count() {
            return this.win_entries.length
        },
 
 
        loss_count() {
            return this.loss_entries.length
        },
 
        win_total_xp() {
            return ssr(this.win_entries)
        },
 
 
        loss_total_xp() {
            return ssr(this.loss_entries)
        },
 
        total_count() {
            return this.win_count + this.loss_count
        },
 
        total_xp() {
            return this.win_total_xp + this.loss_total_xp
        },
 
        match_average() {
            return round((this.total_xp / this.total_count), 2)
        },
 
        match_ratio() {
            if (!this.win_count || !this.loss_count)
                return `N/A`
            else return round((this.win_count / this.loss_count), 2)
        }
    },
    data() {
        return {
            title: 'Berserk',
            message: 'Berserk',
            win_detailMessage: 'Win',
            loss_detailMessage: 'Loss'
        }
    }
})
 
 
// OVERVIEW
Vue.component('vvxp-overview', {
    template: /* html */ `
<div class="p-4 CurrentLavaStatus">
    <div class="col text-uppercase">
        <h4 class="GredientText">{{title}}</h4>
    </div>
    <div v-if="!detailsAvailable">VulcanVerse XP Function details not available.</div>
    <table v-if="detailsAvailable">
        <thead style="font-weight: bold;">
            <tr>
                <td>Dailies</td>
                <td style="text-align:center;">Done</td>
                <td style="text-align:center; min-width: 50px;">Quota</td>
                <td>Quad</td>
                <td style="text-align:center; min-width: 50px;">Earned</td>
            </tr>
        </thead>
        <tbody>
            <tr v-for="daily in dailies" class="hoverRow" :title="titleMessage(daily.name)">
                <td>{{daily.name}}</td>
                <td style="text-align:center;">{{daily.count}}</td>
                <td style="text-align:center;">{{daily.remaining_for_bonus}}</td>
                <td style="text-align:center;">{{daily.quadrant_bonus ? '✅' : '✖'}}</td>
                <td>{{daily.xp_total}}</td>
            </tr>
            <tr class="hoverRow">
                <td>1hr Activity</td>
                <td style="text-align:center;">{{daily_activity}}</td>
                <td></td>
                <td></td>
                <td>{{daily_activity == "✅" ? "10 XP" : "0 XP"}}</td>
            </tr>
            <tr class="hoverRow">
                <td>5 Trades</td>
                <td style="text-align:center;">{{daily_trades}}</td>
                <td></td>
                <td></td>
                <td>{{daily_trades == "✅" ? "10 XP" : "0 XP"}}</td>
            </tr>
            <tr v-if="vv_quests" :title="vv_quests.title_popup" class="hoverRow">
                <td>Quests</td>
                <td style="text-align:center;">{{vv_quests.done_count}}</td>
                <td></td>
                <td></td>
                <td>{{vv_quests.xp_earned}}</td>
            </tr>
        </tbody>
    </table>
    <br>
    <table>
        <thead style="font-weight: bold;">
            <tr>
                <td style="width: 50px;">Totals</td>
                <td>Function</td>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in xpCategoryTotalsByDate">
                <td>{{item.total}}</td>
                <td>{{item.category}}</td>
            </tr>
        </tbody>
    </table>
    <div style="font-weight: bold; border-top: 1px solid;">{{xpByDate}} XP total</div>
</div>
 
    `,
    props: {
        entriesByDate: { type: Array }
    },
    computed: {
 
        detailsAvailable() {
            return !moment(this.active_date).isBefore(this.earliestDetailsDate)
        },
 
        daily_activity() { // 1 hour activity bonus
            const activity_detail = '[Daily Activity]'
            const activity_detail_match = this.entriesByDate.find(entry => entry.detailMessage.includes(activity_detail))
            const activity_bonus = !!activity_detail_match ? '✅' : '✖'
            return activity_bonus
        },
 
        daily_trades() { // 5 trades bonus
            const trade_detail = '[Daily TRADES]'
            const trade_detail_match = this.entriesByDate.find(entry => entry.detailMessage.includes(trade_detail))
            const trade_bonus = !!trade_detail_match ? '✅' : '✖'
            return trade_bonus
        },
 
        remaining_landmarks() {
            const remaining = this.landmarks.map(landmark => {
                const filter = this.entriesByDate.find(entry => {
                    return landmark.names.reduce((acc, name) => {
                        if (entry.detailMessage.includes(`[Visit ${name}]`))
                            return acc += 1
                        else
                            return acc
                    }, 0) > 0
                })
                if (!filter) return `[${landmark.quadrant}] ${landmark.names.slice(-1)[0]}` // show latest name
                else return ''
            }).filter(x => x != '')
 
 
            if (remaining.length) {
                remaining.unshift('Remaining:')
                return remaining.join('\n')
            }
            else return 'Remaining: None'
        },
 
        foraged_rarities() {
            const forages_arr = this.entriesByDate.filter(entry => entry.detailMessage.includes('[Foraging]'))
 
            const forages = forages_arr.reduce((acc, entry) => {
                const xp = entry.amount
                if (xp == 1) acc.common += 1
                if (xp == 2) acc.rare += 1
                if (xp == 3) acc.epic += 1
                if (xp == 4) acc.mythic += 1
                if (xp == 5) acc.legendary += 1
                return acc
            }, {
                common: 0,
                rare: 0,
                epic: 0,
                mythic: 0,
                legendary: 0
            })
            return `Forages by rarity:
${forages.common} - Common (1 XP)
${forages.rare} - Rare (2 XP)
${forages.epic} - Epic (3 XP)
${forages.mythic} - Mythic (4 XP)
${forages.legendary} - Legendary (5 XP)`
        },
 
        xpByDate() {
            return this.entriesByDate.reduce((acc, entry) => acc += entry.amount, 0)
        },
 
        dailies() {
            let dailies = [{
                name: 'Landmarks',
                bonus_requirement: 16,
                detail_text: '[Visit ',
                count: '-',
                remaining_for_bonus: '-',
                quadrant_detail: '[Daily LANDMARK ON EACH QUADRANT]',
                quadrant_bonus: false,
                xp_total: 0
            }, {
                name: 'Forages',
                bonus_requirement: 10,
                detail_text: '[Foraging]',
                count: '-',
                quota_detail: '[Daily 10 FORAGES]',
                quadrant_detail: '[Daily FORAGE ON EACH QUADRANT]',
                remaining_for_bonus: '-',
                quadrant_bonus: false,
                xp_total: 0
            }, {
                name: 'Battles',
                bonus_requirement: 10,
                detail_text: '[Fight Won]',
                count: '-',
                quota_detail: '[Daily 10 FIGHT WINS]',
                quadrant_detail: '[Daily FIGHT ON EACH QUADRANT]',
                remaining_for_bonus: '-',
                quadrant_bonus: false,
                xp_total: 0
            }]
 
            return dailies = dailies.map(daily => {
                const detailMessageMatches = this.entriesByDate.filter(entry => entry.detailMessage.includes(daily.detail_text))
                const count = detailMessageMatches.length
                daily.count = count
 
                const quota_detail = this.entriesByDate.find(entry => entry.detailMessage.includes(daily.quota_detail))
                const quota_bonus = !!quota_detail
 
                daily.remaining_for_bonus = (!quota_bonus && count < daily.bonus_requirement) ? daily.bonus_requirement - count + ' remaining' : '✅'
                const quadrant_detail = this.entriesByDate.find(entry => entry.detailMessage.includes(daily.quadrant_detail))
                daily.quadrant_bonus = !!quadrant_detail
 
                daily.xp_total = detailMessageMatches.reduce((acc, entry) => acc + entry.amount, 0) + (quota_bonus ? quota_detail.amount : 0) + (daily.quadrant_bonus ? quadrant_detail.amount : 0) + ' XP'
 
                return daily
            })
        },
 
        xpCategoryTotalsByDate() {
            const categories = [...new Set(this.entriesByDate.map(entry => entry.detailMessage.split(' [')[0]))]
            let totals = categories.map(category => {
                const total = this.entriesByDate.filter(entry => entry.detailMessage.split(' [')[0].includes(category))
                    .reduce((acc, entry) => acc += entry.amount, 0)
                return {
                    category,
                    total
                }
            })
 
            return totals
        },
 
        vv_quests() {
            const detail_text = '[Quest - '
            const questMatches = this.entriesByDate.filter(entry => entry.detailMessage.includes(detail_text))
 
            if (!questMatches.length)
                return false
 
            const title_popup = `Quests completed:\n` + questMatches.map(entry => entry.detailMessage.replace(/^VulcanVerse \[Quest - /, '').replace(/\]$/, '').trim()).join('\n')
 
            const done_count = questMatches.length
 
            const xp_earned = questMatches.reduce((acc, entry) => acc + entry.amount, 0) + ' XP'
 
            return {
                title_popup,
                done_count,
                xp_earned,
            }
        }
    },
    data() {
        return {
            title: 'Overview',
            earliestDetailsDate: '2022-03-05',
            landmarks: [{
                names: ['ENTRANCE TO THE MINOTAUR LABYRINTH', "Minotaur's Labyrinth"],
                quadrant: 'Boreas'
            }, {
                names: ['HARPIES NEST', 'Harpies Nest'],
                quadrant: 'Boreas'
            }, {
                names: ['FORTRESS OF THE WIND', 'Fortress of The Wind'],
                quadrant: 'Boreas'
            }, {
                names: ['LAIR OF THE CYCLOPS', 'Lair of the Cyclops'],
                quadrant: 'Boreas'
            }, {
                names: ['DEEP FOREST', 'Deep Forest'],
                quadrant: 'Arcadia'
            }, {
                names: ['SUMMER PALACE', 'Summer Palace'],
                quadrant: 'Arcadia'
            }, {
                names: ['DRUID SHRINE', 'Druid Shrine'],
                quadrant: 'Arcadia'
            }, {
                names: ['WOODLANDS OF AMBROSIA', 'Woodlands of Ambrosia'],
                quadrant: 'Arcadia'
            }, {
                names: ['WINERIES OF THE NECTAR OF THE GODS', 'Wineries of the Nectar of the Gods'],
                quadrant: 'Arcadia'
            }, {
                names: ['SHRINE TO TETHIS', 'Shrine of Tethis'],
                quadrant: 'Notus'
            }, {
                names: ['PYRAMID MAUSOLEUM 1', 'Pyramid Mausoleum A'],
                quadrant: 'Notus'
            }, {
                names: ['PYRAMID MAUSOLEUM 3', 'Pyramid Mausoleum C'],
                quadrant: 'Notus'
            }, {
                names: ['PYRAMID MAUSOLEUM 2', 'Pyramid Mausoleum B'],
                quadrant: 'Notus'
            }, {
                names: ['PLANES OF THE HOLLOWING DARKNESS', 'Plains of the Howling Darkness'],
                quadrant: 'Hades'
            }, {
                names: ['THE NECROPOLIS', 'Unknown Landmark', 'The Necropolis'],
                quadrant: 'Hades'
            }, {
                names: ['PALACE OF THE DEAD', 'Palace of the Dead'],
                quadrant: 'Hades'
            }],
        }
    },
    methods: {
        titleMessage(daily_name) {
            if (daily_name == 'Landmarks')
                return this.remaining_landmarks
 
            if (daily_name == 'Forages')
                return this.foraged_rarities
 
            return ''
        },
    }
})
 
 
 
window.vv_vue = new Vue({
    el: '#vvxp_main',
    template: /* html */ `
<div id="vvxp_main" class="col-auto" v-cloak>
    <h1 class="my-3">XP Dashboard</h1>
 
    <div class="row g-3 mb-4"">
 
        <div class="col-lg-3">
            <div class="p-4 CurrentLavaStatus">
                <div>
                    <label><input class="" type="number" v-model.number="settings.numberOfWeeksToLoad" @keyup.enter="reload" :disabled="!earliestLoadedDate"> Number of weeks to load.</label>
                    <span v-if="reachedLastLoadedDate" class="red">← Increase and reload.</span>
                </div>
                <a class="btn BtnGradientOrange w-100 py-2 mt-auto" @click="reload">Reload</a>
                <div>Time until next reset for dailies: {{timeRemaining}}</div>
                <br>
                <div class="center">
                    <button class="btn" @click="subtractDay" :disabled="reachedLastLoadedDate || !earliestLoadedDate">←</button>
                    <input class="" type="date" v-model="active_date" :max="today" :min="earliestLoadedDate" :disabled="!earliestLoadedDate">
                    <button class="btn" @click="addDay" :disabled="isToday || !earliestLoadedDate">→</button>
                    <h4>{{relativeDate}}</h4>
                    <div v-if="reachedLastLoadedDate" class="red">Last day of loaded entries. See above to load more.</div>
                </div>
            </div>
            <br>
            
            <vvxp-overview :entriesByDate="entriesByDate"></vvxp-overview>
 
            <br>
            <vvxp-other :entries="entriesByDate"></vvxp-other>
        </div>
 
        <div class="col-lg-3">
            <vvxp-landmarks :entries="entriesByDate"></vvxp-landmarks>
        </div>
 
        <div class="col-lg-3">
            <vvxp-forages :entries="entriesByDate"></vvxp-forages>
            <br>
            <vvxp-battles :entries="entriesByDate"></vvxp-battles>
        </div>
 
        <div class="col-lg-3">
            <vvxp-quests :entries="entriesByDate" :weeklyEntries="entriesByWeek" :active_date="active_date" :xWeeksAgo="xWeeksAgo"></vvxp-quests>
        </div>
 
    </div>
 
    <div class="row g-3 mb-4">
        
    <div class="col-lg-3">
            <vvxp-berserk :entries="entriesByDate"></vvxp-berserk>
            <br>
    
            <!-- RESOURCES -->
            <div class="p-4 CurrentLavaStatus">
                <div class="col text-uppercase">
                    <h4 class="GredientText">Resources</h4>
                </div>
                
                <div class="bullet"><a href="https://www.vulcanverselore.com/HouseOfRecords/index.php/Landmark_visit_rewards" target="_blank" rel="noopener noreferrer">Landmarks Wiki</a></div>
                <div class="bullet"><a href="https://vv.vulcanforged.com/Vulcanites" target="_blank" rel="noopener noreferrer">Vulcanite Stats</a> (for foraging and battles)</div>
                <div class="bullet">
                <a href="https://onedrive.live.com/view.aspx?resid=451F8E01CD020113!105&ithint=file%2cxlsx&authkey=!AMyWuzs-AR00Yq8" target="_blank" rel="noopener noreferrer">Foraging Spreadsheet</a>
                (<a href="https://discord.com/channels/759537056153337906/870998406200459274/962514701105913877" target="_blank" rel="noopener noreferrer">source</a>)
                </div>
                <div class="bullet"><a href="https://docs.vulcanforged.com/" target="_blank" rel="noopener noreferrer">Official VulcanForged documentation</a></div>
                
                
                <br><div class="total-border"></div>
 
                <br>Link to this userscript: <a href="https://greasyfork.org/en/scripts/441027-vv-xp/" target="_blank" rel="noopener noreferrer">VV XP</a>
                <br>
                <br>All feedback welcome!
                <br>Share feature suggestions and report bugs in the
                <br>VulcanForged Discord Channel: <a href="https://discord.com/channels/759537056153337906/974649458153373696" target="_blank" rel="noopener noreferrer">#community-developers</a>
                <br>Tag the creator: <strong>@Kire12</strong>
 
                <!-- NEWS -->
            </div>
        </div>
 
 
        <div class="col-lg-9">
            <div style="margin: 24px 0 15px;">
                <label>Showing <input class="" type="number" v-model.number="settings.numberOfEntriesToShow" :max="loadedEntries.length" min="0"> / {{loadedEntries.length}} entries. (Showing many entries slows down the page.)</label>
            </div>
            <table v-show="settings.numberOfEntriesToShow > 0">
                <thead style="font-weight: bold;">
                    <tr class="tr-padding">
                        <td style="width: 50px;">XP</td>
                        <td style="width: 150px;">Date-time</td>
                        <td style="width: 150px;">Local Date-time</td>
                        <td>Message</td>
                        <td>Detail Message</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="entry in shownEntries" class="hoverRow tr-padding">
                        <td>{{entry.amount}}</td>
                        <td>{{entry.logDate}}</td>
                        <td>{{convertTime(entry.logDate)}}</td>
                        <td>{{entry.message}}</td>
                        <td>{{entry.detailMessage}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
    `,
    created() {
        // console.log('created')
        this.init()
    },
    mounted() {
        this.reload()
    },
    data: {
        today: moment.utc().toISOString().split('T')[0],
        loadedEntries: [],
        timeRemaining: 'N/A',
        settings: {
            numberOfWeeksToLoad: 1,
            numberOfEntriesToShow: 15 // set this to zero to hide
        },
        active_date: moment.utc().toISOString().split('T')[0],
        numberOfWeeksSetToLoad: 0,
        earliestDate: '2021-07-07'
    },
    computed: {
 
        // active_date2: { // non-working workaround for input date in different locale https://discord.com/channels/958025800509161472/958247945243852830/961359879841398825
        //     get() {
        //         const format = moment.localeData().longDateFormat('L')
        //         var a = moment(this.active_date, 'YYYY-MM-DD').format(format)
        //         console.log({ a })
        //         return a
        //     },
        //     set(newValue) {
        //         const format = moment.localeData().longDateFormat('L')
        //         const b = moment(newValue, format).format('YYYY-MM-DD')
        //         console.log({ b })
        //         this.active_date = b
        //     }
        // },
        entriesByDate() {
            return this.loadedEntries.filter(entry => entry.logDate.split('T')[0] == this.active_date)
        },
 
        entriesByWeek() {
            return this.loadedEntries.filter(entry => {
                const entry_date = entry.logDate.split('T')[0]
                const oneWeekPrev = moment(this.active_date).subtract(1, 'weeks').format('YYYY-MM-DD')
                return moment(entry_date).isAfter(oneWeekPrev) && !moment(entry_date).isAfter(this.active_date)
            })
        },
 
 
        earliestLoadedDate() {
            if (!this.loadedEntries.length) return false
            return this.loadedEntries.slice(-1)[0].logDate.split('T')[0]
        },
 
        reachedLastLoadedDate() {
            // return false
            if (//this.loadedEntries.length == this.numberOfEntriesSetToLoad && // if < then may be first day of account
                !moment(this.active_date).isAfter(this.earliestLoadedDate) &&
                this.earliestLoadedDate)
                return true
            else return false
        }, // set a watcher on this, then increase as needed
 
        isToday() {
            return !moment(this.active_date).isBefore(this.today)
        },
 
        relativeDate() {
            if (!this.loadedEntries.length) return 'Loading...'
 
            const diff = moment(this.today).diff(moment(this.active_date), 'days')
 
            if (diff == 0) {
                return 'Today'
            } else if (diff == 1) {
                return `1 day ago`
            } else {
                return `${diff} days ago`
            }
        },
 
        shownEntries() {
            return this.loadedEntries.slice(0, Math.min(this.settings.numberOfEntriesToShow, this.loadedEntries.length))
        },
 
 
 
        xWeeksAgo() {
            // const days = Math.round(this.settings.numberOfWeeksToLoad * 7)
            // return moment(this.today).subtract(days, 'days').format('YYYY-MM-DD')
            const weeksAgo = moment(this.today).subtract(this.settings.numberOfWeeksToLoad, 'weeks').format('YYYY-MM-DD')
            return moment(weeksAgo).isAfter(this.earliestDate) ? weeksAgo : this.earliestDate
        },
    },
    methods: {
 
        init() {
            $('#Earnings').before(vvxp_main)
 
            // console.log('mounted')
 
            this.startTimer()
        },
 
        click() {
            alert('clicked')
        },
 
        addDay() {
            this.active_date = moment(this.active_date).add(1, 'days').format('YYYY-MM-DD')
        },
 
        subtractDay() {
            this.active_date = moment(this.active_date).subtract(1, 'days').format('YYYY-MM-DD')
        },
 
        reload() {
            $.ajax({
                type: "POST",
                url: "/MyWallet/Get_Lava_Earned_Spent",
                cache: false,
                data: {
                    type: 'Credit',
                    section: 'XP',
                    pageNo: 0,
                    pageSize: 999999999,
                    start: `${this.xWeeksAgo} 00:00:00.0000000`,
                    end: `${this.today} 23:59:59.9999999`,
                    __RequestVerificationToken: GetAntiForgeyToken()
                },
                // type=Credit&section=XP&pageNo=0&pageSize=10&start=2022-05-26+00%3A00%3A00.0000000&end=2022-05-27+23%3A59%3A59.9999999
                success: function (Response) {
                    if (Response.status == 1) {
 
                        // console.log(Response.data)
                        vv_vue.loadedEntries = Response.data
                        vv_vue.numberOfWeeksSetToLoad = vv_vue.settings.numberOfWeeksToLoad
                        vv_vue.today = moment.utc().toISOString().split('T')[0]
 
                    }
                    else {
                        console.log("Error !!!", Response.message, "error")
                    }
 
 
                }
            })
        },
 
        startTimer() {
            setInterval(() => {
                this.timeRemaining = moment.utc().add(1, 'days').startOf('day').subtract(moment()).format('H:mm:ss')
            }, 1000)
        },
 
        convertTime(date) {
            return moment.utc(date).local().format('YYYY-MM-DD HH:mm:ss');
        },
 
        filterEntriesByDate(text) {
            return this.entriesByDate.filter(entry => entry.detailMessage.includes(text))
        }
    }
})
 
// TODO
// - use localStorage to save settings of entries to load/show.
// - Make number inputs scrollable/clickable to increase/decrease.
// - Show breakdown of lava earnings per day (based on type automatically, including landmark run and earning share)
// - catch all for VulcanVerse functions that are not supported
// show entries of selected day, instead of all (or add as option)
// hide panels until xp list is loaded, to prevent prematurely showing incomplete or NAN
 
// TODO Ideas: Include how much XP every bonus is worth. Table for XP earned daily for past month, with average. Donation address
 
// - save settings in local stroage
// - daily, weekly, and full histroical (of what's loaded) views.
// full historical will be a table going down, with averages of forages, etc. Columns for each panel category.
 
// Tsukasa suggests hourly XP totals because lava distributed every hour at X:56. I could add a column to the right of xp entries full list, which matches lava income with xp by hour, and how much lava per xp or hour.
// fjzdm - hourly lava reset timer
// mark quest reset time too (monday)
 
// use built-in calendar for start/end dates
 
// 2022-07-02 Wow, today I noticed that Xp and Lava tables have a calendar filter, and I can fetch by start/end date in the API! This will make things so much easier.
// Before, I thought I would have to programtically guess-and-check to get all entries from a week. This will make things a breeze, and will clean up the interface more!
 
 
function uniqueArr(arr) {
    return [...new Set(arr)]
}
 
// ssr = simple sum reduce
function ssr(arr, field = 'amount') {
    if (!arr) return 0
    return arr.reduce((acc, entry) => acc += entry[field], 0)
}
 
function round(value, precision) {
    if (isNaN(value)) value = 0
    var multiplier = Math.pow(10, precision || 0)
    const num = Math.round(value * multiplier) / multiplier
    return num//.toFixed(precision)
}