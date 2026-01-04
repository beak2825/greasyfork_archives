// ==UserScript==
// @name        VV XP
// @namespace   kire12
// @match       https://myforge.vulcanforged.com/MyEarnings*
// @match       https://myforge-old.vulcanforged.com/MyEarnings*
// @match       https://myforge-vechain.vulcanforged.com/MyEarnings*
// @grant       none
// @license MIT
// @version     2.5.0
// @author      -
// @description XP Dashboard for VulcanVerse and other VulcanForged games.
// @require     https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/decimal.js/10.3.1/decimal.min.js
// @downloadURL https://update.greasyfork.org/scripts/441027/VV%20XP.user.js
// @updateURL https://update.greasyfork.org/scripts/441027/VV%20XP.meta.js
// ==/UserScript==

// @changelog   https://www.notion.so/kire12/VV-XP-Dashboard-Changelog-65b661cc2c59458b9ef837e09344b7f6

window.vv_vue = false

const vvxp_main = /* html */ `
<div class="row gx-4">
    <div class="col-xl-12 mb-4">
        <style>
            .vvTitle {
                font-family: "Trueno Bold"
            }

            .icon-button {
                cursor: pointer
            }

            .vvxp-table td,
            .vvxp-table th {
                padding: 0;
            }

            .vvxp-hyperlink {
                color: white
            }

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

            .strikethrough {
                text-decoration: line-through;
            }

            .total-border {
                margin-top: 0.5rem;
                font-weight: bold;
                border-top: 2px solid;
            }

            .center {
                text-align: center;
            }

            .right-padding {
                padding-right: 0.25rem;
            }

            tr.tr-outline {
                outline: thin solid;
            }

            tr.tr-padding>td,
            tr.tr-padding>th {
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

            .vvxp-table {
                font-size: 12px;
            }
        </style>

        <div id="vvxp_main" class="col-auto" v-cloak></div>

    </div>
</div>`



// LANDMARKS
Vue.component('vvxp-landmarks', {
    template: /* html */ `
<div class="p-4 CurrentLavaStatus">
    <div class="col text-uppercase">
        <h4 class="GredientText">{{title}}</h4>
    </div>

    <table class="vvxp-table">
        <tr>
            <td class="center right-padding" :class="{'text-white': !quadrant_bonus}">{{quadrant_bonus_text}}
            </td>
            <td>Quadrant bonus (20&nbsp;XP)</td>
        </tr>
        <tr>
            <td class="center right-padding td-align-top" :class="{'text-white': !all_landmarks_visited}">{{quota_bonus_text}}</td>
            <td>{{total_landmarks}} Landmarks visited (10&nbsp;XP&nbsp;each)</td>
        </tr>
    </table>

    <div v-for="quadrant in quadrants">
        <div class="TruenoSemiBold Fsize_14 text-uppercase quadrant-heading">{{quadrant}}</div>
        <div v-for="landmark in daily_landmarks.filter(landmark => landmark.quadrant == quadrant)" class='landmark bullet'>
            <span v-if="landmark.count > 1">(x{{landmark.count}})</span>
            <span :class="{'visited-landmark': landmark.visited}">{{landmark.names.slice(-1)[0]}}</span>
        </div>
    </div>
    <!-- Troy (not yet) -->
    <div class="total-border">{{total_xp}} XP total earned</div>
</div>`,
    props: {
        entries: { type: Array }
    },
    computed: {
        landmarkEntries() {
            return this.entries.filter(entry => entry.detailMessage.toLowerCase().includes(this.detailMessage.toLowerCase()))
        },

        quadrant_entry() {
            return this.entries.filter(entry => entry.detailMessage.toLowerCase().includes(this.quadrant_detailMessage.toLowerCase()))
        },

        quadrant_bonus() {
            return !!this.quadrant_entry.length
        },

        quadrant_bonus_text() {
            const count = this.quadrant_entry.length
            if (count == 0)
                return '✖'
            else if (count == 1)
                return '✅'
            else if (count > 1)
                return `✅x${count}`
        },

        count_landmarks() {
            return this.landmarkEntries.length
        },

        total_landmarks() {
            return this.known_landmarks.length
        },

        all_landmarks_visited() {
            return this.daily_landmarks.every(landmark => landmark.visited)
        },

        quota_bonus_text() {
            if (this.all_landmarks_visited)
                return '✅'
            else
                return `${this.count_landmarks}\xa0/`
        },

        quadrants() {
            return uniqueArr(this.known_landmarks.map(landmark => landmark.quadrant))
        },

        daily_landmarks() {
            return this.known_landmarks.map(landmark => {

                const possible_names = landmark.names
                let matches = []

                possible_names.forEach(name => {
                    const match = this.landmarkEntries.filter(entry => !!entry.detailMessage.toLowerCase().includes(`[Visit ${name}]`.toLowerCase()))
                    matches.push(match)
                })

                landmark.matches = matches.filter(match => match.length).flat() // 2022-09-02 There was a VV update that reset landmark run, so it was possible to visit landmarks twice for XP. This will catch if this happens.

                landmark.count = landmark.matches.length
                landmark.visited = landmark.count > 0
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
            quadrant_detailMessage: 'Landmark On Each Quadrant]',
            // rename below to known_landmarks. add header for UNKNOWN quadrant, and list any there that don't know, in anticipation of troy release, and to catch 'Unknown Landmark' that on etime for necropolis. then replace capitals
            known_landmarks: [{
                names: ['ENTRANCE TO THE MINOTAUR LABYRINTH', "Minotaur's Labyrinth"],
                quadrant: 'Boreas'
            }, {
                names: ['Harpies Nest'],
                quadrant: 'Boreas'
            }, {
                names: ['Fortress of The Wind'],
                quadrant: 'Boreas'
            }, {
                names: ['Lair of the Cyclops'],
                quadrant: 'Boreas'
            }, {
                names: ['Deep Forest'],
                quadrant: 'Arcadia'
            }, {
                names: ['Summer Palace'],
                quadrant: 'Arcadia'
            }, {
                names: ['Druid Shrine'],
                quadrant: 'Arcadia'
            }, {
                names: ['Woodlands of Ambrosia'],
                quadrant: 'Arcadia'
            }, {
                names: ['Wineries of the Nectar of the Gods'],
                quadrant: 'Arcadia'
            }, {
                names: ['Shrine to Tethys', 'SHRINE TO TETHIS', 'Shrine of Tethis'],
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
                names: ['The Necropolis'], // Was 'Unknown Landmark' one day
                quadrant: 'Hades'
            }, {
                names: ['Palace of the Dead'],
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

    <table class="vvxp-table">
        <tr>
            <td class="center right-padding" :class="{'text-white': !quadrant_bonus}">{{quadrant_bonus_text}}
            </td>
            <td>Quadrant bonus (20&nbsp;XP)</td>
        </tr>
        <tr>
            <td class="center right-padding td-align-top" :class="{'text-white': quota_not_met}">{{quota_bonus_text}}</td>
            <td>{{quota_goal}} Daily Forages (25&nbsp;XP)</td>
        </tr>
    </table>

    <br>
    <table class="vvxp-table">
        <tr>
            <th class="center">Count</th>
            <th class="center">Total</th>
            <th>Forage Type</th>
            <th>Drop %</th>
        </tr>
        <tr v-for="rarity in daily_forages">
            <td class="center">{{rarity.count}}</td>
            <td class="center">{{rarity.total_xp}} XP</td>
            <td class="td-padding-right">{{rarity.type}} ({{rarity.xp}}&nbsp;XP)</td>
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
</div>`,
    props: {
        entries: { type: Array }
    },
    computed: {
        forageEntries() {
            return this.entries.filter(entry => entry.detailMessage.toLowerCase().includes(this.detailMessage.toLowerCase()))
        },


        quadrant_entry() {
            return this.entries.filter(entry => entry.detailMessage.toLowerCase().includes(this.quadrant_detailMessage.toLowerCase()))
        },

        quadrant_bonus() {
            return !!this.quadrant_entry.length
        },

        quadrant_bonus_text() {
            const count = this.quadrant_entry.length
            if (count == 0)
                return '✖'
            else if (count == 1)
                return '✅'
            else if (count > 1)
                return `✅x${count}`
        },


        quota_entry() {
            return this.entries.filter(entry => entry.detailMessage.toLowerCase().includes(this.quota_detailMessage.toLowerCase()))
        },

        quota_bonus() {
            const count = this.quota_entry.length
            if (count == 0) return false
            else if (count == 1) return '✅'
            else if (count > 1) return `✅x${count}` // possible bug where "Daily 10 FORAGES" happens twice in a day
            // return !!this.quota_entry.length
        },

        quota_bonus_text() {
            const count = this.quota_entry.length
            if (count == 0)
                return `${this.count_forages}\xa0/` // \xa0 is &nbsp; to keep from wrapping line
            else if (count == 1)
                return '✅'
            else if (count > 1)
                return `✅x${count}`
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
            quadrant_detailMessage: 'Forage On Each Quadrant]',
            quota_detailMessage: '10 FORAGES]',
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

    <table class="vvxp-table">
        <tr>
            <td class="center right-padding" :class="{'text-white': !quadrant_bonus}">{{quadrant_bonus_text}}</td>
            <td>Quadrant bonus (20&nbsp;XP)</td>
        </tr>
        <tr>
            <td class="center right-padding td-align-top" :class="{'text-white': !quota_met}">{{quota_bonus_text}}</td>
            <td>{{quota_goal}} Daily Battles (50&nbsp;XP)</td>
        </tr>
    </table>

    <br>
    <table class="vvxp-table">
        <tr class="tr-padding">
            <th class="center">Count</th>
            <th class="center">Total</th>
            <th></th>
        </tr>
        <tr class="tr-outline tr-padding">
            <td class="center">{{count_battles}}</td>
            <td class="center">{{battle_total_xp}} XP</td>
            <td>Battles (1&nbsp;XP)</td>
        </tr>
    </table>

    <div class="total-border">{{total_xp}} XP total earned</div>
</div>`,
    props: {
        entries: { type: Array }
    },
    computed: {
        battleEntries() {
            return this.entries.filter(entry => entry.detailMessage.toLowerCase().includes(this.detailMessage.toLowerCase()))
        },


        quadrant_entry() {
            return this.entries.filter(entry => entry.detailMessage.toLowerCase().includes(this.quadrant_detailMessage.toLowerCase()))
        },

        quadrant_bonus() {
            return !!this.quadrant_entry.length
        },

        quadrant_bonus_text() {
            const count = this.quadrant_entry.length
            if (count == 0)
                return '✖'
            else if (count == 1)
                return '✅'
            else if (count > 1)
                return `✅x${count}`
        },

        quota_entry() {
            return this.entries.filter(entry => entry.detailMessage.toLowerCase().includes(this.quota_detailMessage.toLowerCase()))
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

        quota_bonus_text() {
            const count = this.quota_entry.length
            if (count == 0)
                return `${this.count_battles}\xa0/` // \xa0 is &nbsp; to keep from wrapping line
            else if (count == 1)
                return '✅'
            else if (count > 1)
                return `✅x${count}`
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
            quadrant_detailMessage: 'Fight On Each Quadrant]',
            quota_detailMessage: '10 Fight Wins]',
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

    <table class="vvxp-table">
        <tr class="tr-padding">
            <th class="center">Count</th>
            <th class="center">Total</th>
            <th></th>
        </tr>
        <tr class="tr-outline tr-padding">
            <td class="center">{{count_quests}}</td>
            <td class="center">{{total_xp_day}} XP</td>
            <td>Quests (XP&nbsp;varies)</td>
        </tr>
    </table>
    
    <div class="total-border">{{total_xp_day}} XP total earned (on {{active_date}})</div>
    
    <div v-if="!beforeDate['dailyQuestsAdded']">
        <br>
        <div class="TruenoSemiBold Fsize_14 text-uppercase quadrant-heading">Daily</div>

        <table class="vvxp-table" :title='daily_rewards'>
            <tr class="tr-padding">
                <th class="center">Done</th>
                <th>Quest</th>
            </tr>
            <tr v-for="quest in daily_quests" class="tr-padding hoverRow">
                <td class="center">{{quest.completed}}</td>
                <td>{{quest.name}}</td>
            </tr>
        <!--
            <tr class="tr-outline tr-padding">
                <td class="center">{{forage_totals.count}}</td>
                <td class="center">{{forage_totals.total_xp}} XP</td>
                <td>Average:<br><span class="bold">{{forage_totals.average}} XP/forage</span></td>
            </tr>
        -->
        </table>
    </div>

    <br>
    <div class="TruenoSemiBold Fsize_14 text-uppercase quadrant-heading">Weekly</div>
    <!--
    <div v-for="quest in weekly_quests" class='landmark bullet'>
        <span :class="{'visited-landmark': quest.completed}">{{quest.name}}</span>
    </div>
    -->
    
    <table class="vvxp-table">
        <tr class="tr-padding">
            <th class="center">Done</th>
            <!--<th class="center">Total</th>-->
            <th>Quest</th>
            <th>Reward</th>
        </tr>
        <tr v-for="quest in weekly_quests" class="tr-padding hoverRow" :title="'Objective: ' + quest.objective">
            <td class="center">{{quest.completed}}</td>
            <!--<td class="center">{{quest.total_xp}}&nbsp;XP</td>-->
            <td>{{quest.name}} ({{quest.xp}}&nbsp;XP)</td>
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

    <div v-if="!beforeDate['eventQuestsAdded'] && event_quests.length">
        <br>
        <div class="TruenoSemiBold Fsize_14 text-uppercase quadrant-heading">Events</div>

        <table class="vvxp-table">
            <tr class="tr-padding">
                <th class="center">XP</th>
                <th>Quest</th>
            </tr>
            <tr v-for="quest in event_quests" class="tr-padding hoverRow">
                <td class="center">{{quest.amount}}</td>
                <td>{{quest.detailMessage.replace('VulcanVerse [Quest - ', '').replace(/\]$/, '')}}</td>
            </tr>
        </table>
    </div>

</div>

    `,
    props: {
        entries: { type: Array },
        weeklyEntries: { type: Array },
        active_date: { type: String },
        xWeeksAgo: { type: String },
        beforeDate: { type: Object }

    },
    computed: {
        questEntries() {
            return this.entries.filter(entry => entry.detailMessage.toLowerCase().includes(this.detailMessage.toLowerCase()))
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

        dailyQuestEntries() {
            return this.entries.filter(entry => entry.detailMessage.toLowerCase().includes(this.detailMessage_dailyQuest.toLowerCase()))
        },

        daily_quests() {
            const daily_done = this.dailyQuestEntries.length

            if (daily_done == 0) {
                return [{
                    name: 'Daily Quest #1',
                    completed: '✖'
                }, {
                    name: 'Daily Quest #2',
                    completed: '✖'
                }]
            }

            else if (daily_done == 1) {
                const entry = this.dailyQuestEntries[0]
                const detailMessage = entry.detailMessage.split('[')[1].replace(']', '') // `VulcanVerse [Arcadia Daily Quest]`
                const xp = entry.amount

                return [{
                    name: `${detailMessage} (${xp} XP)`,
                    completed: '✅'
                }, {
                    name: 'Daily Quest #2',
                    completed: '✖'
                }]
            }

            else if (daily_done > 1) {
                return this.dailyQuestEntries.reverse().map(entry => {
                    const detailMessage = entry.detailMessage.split('[')[1].replace(']', '') // `VulcanVerse [Arcadia Daily Quest]`
                    const xp = entry.amount

                    return {
                        name: `${detailMessage} (${xp} XP)`,
                        completed: '✅'
                    }
                })
            }


            return this.dailyQuestEntries.map(quest => {


                const match = this.weeklyQuestEntries.filter(entry => entry.detailMessage.toLowerCase().includes(`${quest.name}]`.toLowerCase()))//.includes(`[Quest -  ${quest.name}]`))
                quest.count = match.length
                quest.total_xp = ssr(match)


                quest.completed = !!quest.count ? (quest.count == 1 ? '✅' : `✅x${quest.count}`) : '✖' //!!quest.count //!!this.weeklyQuestEntries.find(entry => entry.detailMessage.toLowerCase().includes(`[Quest ${quest.name}]`.toLowerCase()))

                return quest
            })
        },


        weeklyQuestEntries() {
            return this.entriesSinceMonday.filter(entry => entry.detailMessage.toLowerCase().includes(this.detailMessage_weeklyQuest.toLowerCase()))
        },

        weekly_quests() {
            return this.quests.map(quest => {


                const match = this.weeklyQuestEntries.filter(entry => entry.detailMessage.toLowerCase().includes(`${quest.name}]`.toLowerCase()))//.includes(`[Quest -  ${quest.name}]`))
                quest.count = match.length
                quest.total_xp = ssr(match)


                quest.completed = !!quest.count ? (quest.count == 1 ? '✅' : `✅x${quest.count}`) : '✖' //!!quest.count //!!this.weeklyQuestEntries.find(entry => entry.detailMessage.toLowerCase().includes(`[Quest ${quest.name}]`.toLowerCase()))

                return quest
            })
        },

        event_quests() {
            if (this.beforeDate["eventQuestsAdded"])
                return []

            else {
                const weeklyQuests = this.weeklyQuestEntries

                const questsNotWeekly = weeklyQuests.filter(entry => {
                    const isMatch = this.quests2.some(weeklyEntry => {
                        return entry.detailMessage.toLowerCase().includes(('VulcanVerse [Quest - ' + weeklyEntry.name).toLowerCase())
                    })
                    return !isMatch // Return true if there's no match (keep the element)
                })

                return questsNotWeekly
            }
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

        quests() {
            if (this.beforeDate["dailyQuestsAdded"])
                return this.quests0

            else if (this.beforeDate["dailyQuestsUpdated1"])
                return this.quests1

            else
                return this.quests2
        },


        daily_rewards() {
            if (this.beforeDate["dailyQuestsAdded"])
                return ''

            else if (this.beforeDate["dailyQuestsUpdated1"])
                return 'Rewards:\n10-18 XP'

            else
                return 'Rewards:\n10-25 XP\nGold for non-max rolled value.\nOpal for max rolled value.' // https://discord.com/channels/759537056153337906/868871721892065321/1018856873270726736
        },

    },
    data() {
        return {
            title: 'Quests',
            detailMessage: 'Quest',
            detailMessage_weeklyQuest: '[Quest',
            detailMessage_dailyQuest: 'Daily Quest]',
            quests0: [
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
            ], // https://vulcanforgedco.medium.com/vulcanverse-roadmap-reveal-c35278813e33

            quests1: [
                {
                    "name": "Buried Treasure",
                    "xp": 5,
                    "reward": "",
                    "quest_giver": "",
                    "quest_giver_location": "",
                    "objective": "Forage 5 unique plots"
                },
                {
                    "name": "Bleed for the Dead",
                    "xp": 5,
                    "reward": "",
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
                    "objective": "25 forages"
                },
                {
                    "name": "A Thirst for Blood",
                    "xp": 5,
                    "reward": "",
                    "quest_giver": "",
                    "quest_giver_location": "Arcadia",
                    "objective": "Win 5 fights"
                },
                {
                    "name": "A New Robe",
                    "xp": 5,
                    "reward": "",
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
                    "xp": 5,
                    "reward": "",
                    "quest_giver": "",
                    "quest_giver_location": "Arcadia? Notus?",
                    "objective": "Visit Hades, Arcadia, Boreas"
                },
                {
                    "name": "Map the World",
                    "xp": 5,
                    "reward": "",
                    "quest_giver": "",
                    "quest_giver_location": "",
                    "objective": "Visit each quadrant and VC"
                },
                {
                    "name": "What lies beneath",
                    "xp": 25,
                    "reward": "Crystal x1",
                    "quest_giver": "",
                    "quest_giver_location": "",
                    "objective": "25 forages"
                },
                {
                    "name": "Baubles for a Queen",
                    "xp": 5,
                    "reward": "",
                    "quest_giver": "",
                    "quest_giver_location": "Notus",
                    "objective": "Forage 3 Halite"
                },
                {
                    "name": "Punishment",
                    "xp": 5,
                    "reward": "",
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
            ],


            quests2: [
                {
                    "name": "Buried Treasure",
                    "xp": 5,
                    "reward": "",
                    "quest_giver": "",
                    "quest_giver_location": "",
                    "objective": "Forage 5 unique plots"
                },
                {
                    "name": "Bleed for the Dead",
                    "xp": 5,
                    "reward": "",
                    "quest_giver": "",
                    "quest_giver_location": "",
                    "objective": "Take 2500 damage in fight"
                },
                {
                    "name": "Fly the Flag",
                    "xp": 30,
                    "reward": "Terracotta x5",
                    "quest_giver": "",
                    "quest_giver_location": "",
                    "objective": "25 forages"
                },
                {
                    "name": "A Thirst for Blood",
                    "xp": 5,
                    "reward": "",
                    "quest_giver": "",
                    "quest_giver_location": "Arcadia",
                    "objective": "Win 5 fights"
                },
                {
                    "name": "A New Robe",
                    "xp": 5,
                    "reward": "",
                    "quest_giver": "",
                    "quest_giver_location": "Arcadia",
                    "objective": "Forage 5 Thread"
                },
                {
                    "name": "Failure is a Lesson Learned",
                    "xp": 30,
                    "reward": "Terracotta x5",
                    "quest_giver": "",
                    "quest_giver_location": "",
                    "objective": "Lose 5 fights"
                },
                {
                    "name": "Deliver Riddles",
                    "xp": 5,
                    "reward": "",
                    "quest_giver": "",
                    "quest_giver_location": "Arcadia? Notus?",
                    "objective": "Visit Hades, Arcadia, Boreas"
                },
                {
                    "name": "Map the World",
                    "xp": 5,
                    "reward": "",
                    "quest_giver": "",
                    "quest_giver_location": "",
                    "objective": "Visit each quadrant and VC"
                },
                {
                    "name": "What lies beneath",
                    "xp": 30,
                    "reward": "Terracotta x5",
                    "quest_giver": "",
                    "quest_giver_location": "",
                    "objective": "25 forages"
                },
                {
                    "name": "Baubles for a Queen",
                    "xp": 5,
                    "reward": "",
                    "quest_giver": "",
                    "quest_giver_location": "Notus",
                    "objective": "Forage 3 Halite"
                },
                {
                    "name": "Punishment",
                    "xp": 5,
                    "reward": "",
                    "quest_giver": "",
                    "quest_giver_location": "",
                    "objective": "Deal 1000 damage in fight"
                },
                {
                    "name": "Sightseeing",
                    "xp": 30,
                    "reward": "Terracotta x5",
                    "quest_giver": "",
                    "quest_giver_location": "",
                    "objective": "Visit each quadrant and VC"
                }
            ]
        }
    }
})



// FISHING
Vue.component('vvxp-fishing', {
    template: /* html */ `
<div class="p-4 CurrentLavaStatus">
    <div class="col text-uppercase">
        <h4 class="GredientText">{{title}}</h4>
    </div>

    <table class="vvxp-table">
        <tr>
            <th class="center">Count</th>
            <th class="center">Total</th>
            <th>Fishing Type</th>
            <th>Catch %</th>
        </tr>
        <tr v-for="rarity in daily_fishing">
            <td class="center">{{rarity.count}}</td>
            <td class="center">{{rarity.total_xp}} XP</td>
            <td class="td-padding-right">{{rarity.type}} ({{rarity.xp}}&nbsp;XP)</td>
            <td>{{rarity.percent}}%</td>
        </tr>
        <tr class="tr-outline tr-padding">
            <td class="center">{{fishing_totals.count}}</td>
            <td class="center">{{fishing_totals.total_xp}} XP</td>
            <td>Average:<br><span class="bold">{{fishing_totals.average}} XP/fishing</span></td>
        </tr>
    </table>

    <div class="total-border">{{total_xp}} XP total earned</div>

    <!--
    <div class="TruenoSemiBold Fsize_14 text-uppercase quadrant-heading">Weekly Average</div>
    -->
</div>`,
    props: {
        entries: { type: Array }
    },
    computed: {
        fishingEntries() {
            return this.entries.filter(entry => entry.detailMessage.toLowerCase().includes(this.detailMessage.toLowerCase()))
        },

        count_fishing() {
            return this.fishingEntries.length
        },

        daily_fishing() {
            return this.rarities.map(rarity => {
                rarity.count = this.fishingEntries.filter(fishing => fishing.amount == rarity.xp).length
                rarity.total_xp = rarity.count * rarity.xp
                rarity.percent = round((rarity.count / this.fishingEntries.length) * 100, 2)
                return rarity
            })
        },

        fishing_totals() {
            const count = ssr(this.daily_fishing, 'count')
            const total_xp = ssr(this.daily_fishing, 'total_xp')
            const average = round((total_xp / count), 2)

            return {
                count,
                total_xp,
                average
            }
        },

        total_xp() {
            return ssr(this.fishingEntries)
        }
    },
    data() {
        return {
            title: 'Fishing',
            detailMessage: '[Fishing]',
            rarities: [{
                type: 'None or Common',
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
            }],
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

    <table class="vvxp-table">
        <tr>
            <td class="center right-padding" :class="{'text-white': !trades_bonus}">{{trades_bonus_text}}</td>
            <td>5 Trades (10&nbsp;XP)</td>
        </tr>
        <tr>
            <td class="center right-padding" :class="{'text-white': !activity_bonus}">{{activity_bonus_text}}</td>
            <td>1 hour activity (10&nbsp;XP)</td>
        </tr>
        <tr>
            <td class="center right-padding" :class="{'text-white': !merchant_complete}">{{merchant_text}}</td>
            <td>10 Merchant Exchanges (2&nbsp;XP each)</td>
        </tr>
        <tr>
            <td class="center right-padding" :class="{'text-white': !boss_complete}" :title="boss_xp + ' XP'">{{boss_text}}</td>
            <td :title="boss_tooltip">Defeated Boss</td>
        </tr>
    </table>

    <div class="total-border">{{total_xp}} XP total earned</div>

</div>`,
    props: {
        entries: { type: Array }
    },
    computed: {
        trades_entries() {
            return this.entries.filter(entry => entry.detailMessage.toLowerCase().includes(this.trades_detailMessage.toLowerCase()))
        },

        trades_bonus() {
            return !!this.trades_entries.length
        },

        trades_xp() {
            return ssr(this.trades_entries)
        },

        trades_bonus_text() {
            const count = this.trades_entries.length
            if (count == 0)
                return '✖'
            else if (count == 1)
                return '✅'
            else if (count > 1)
                return `✅x${count}`
        },


        activity_entries() {
            return this.entries.filter(entry => entry.detailMessage.toLowerCase().includes(this.activity_detailMessage.toLowerCase()))
        },

        activity_bonus() {
            return !!this.activity_entries.length
        },

        activity_xp() {
            return ssr(this.activity_entries)
        },

        activity_bonus_text() {
            const count = this.activity_entries.length
            if (count == 0)
                return '✖'
            else if (count == 1)
                return '✅'
            else if (count > 1)
                return `✅x${count}`
        },


        merchant_entries() {
            return this.entries.filter(entry => entry.detailMessage.toLowerCase().includes(this.merchant_detailMessage.toLowerCase()))
        },

        merchant_complete() {
            return this.merchant_entries.length >= 10
        },

        merchant_xp() {
            return ssr(this.merchant_entries)
        },

        merchant_text() {
            const count = this.merchant_entries.length
            if (count < 10)
                return '✖'
            else if (count == 10)
                return '✅'
            else if (count > 10)
                return `✅x${count}`
        },


        boss_entries() {
            return this.entries.filter(entry => entry.detailMessage.toLowerCase().includes(this.boss_detailMessage.toLowerCase()))
        },

        boss_complete() {
            return this.boss_entries.length >= 10
        },

        boss_xp() {
            return ssr(this.boss_entries)
        },

        boss_text() {
            const count = this.boss_entries.length
            if (count == 0)
                return '✖'
            else if (count == 1)
                return '✅'
            else if (count > 1)
                return `✅x${count}`
        },


        total_xp() {
            return this.trades_xp + this.activity_xp + this.merchant_xp + this.boss_xp
        }
    },
    data() {
        return {
            title: 'Other',
            trades_detailMessage: '[Daily trades]',
            activity_detailMessage: '[Daily Activity]',
            merchant_detailMessage: '[Merchant Exchange]',
            boss_detailMessage: '[Defeated Boss]', // released 2024-07-24
            boss_tooltip: `1 place: 10 gold, 300 XP
2 place: 7 gold, 200 XP
3 place: 5 gold, 150 XP
4 place: 15 silver, 2 gold, 100 XP
5-9 places: 5 silver, 1 gold, 50 XP
10> places: 5 silver, 25 XP`,
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

    <table class="vvxp-table">
        <tr>
            <td class="center right-padding" :class="{'text-white': !dailyWins_bonus}">{{dailyWins_bonus_text}}</td>
            <td>10 Daily Wins yesterday (100&nbsp;XP)</td>
        </tr>
    </table>

    <br>

    <table class="vvxp-table">
        <tr class="tr-padding">
            <th class="center">Count</th>
            <th class="center">Total</th>
            <th></th>
        </tr>
        <!-- 2023-03-01 Win changed from 10XP to 20XP and loss from 3XP to 6XP based on https://vulcanforgedco.medium.com/going-berserk-for-a-third-time-f791fbaae696 -->
        <tr>
            <td class="center">{{win_count}}</td>
            <td class="center">{{win_total_xp}} XP</td>
            <td v-html="win_label"></td>
            </tr>
            <tr>
            <td class="center">{{loss_count}}</td>
            <td class="center">{{loss_total_xp}} XP</td>
            <td v-html="loss_label"></td>
        </tr>
        <tr class="tr-outline tr-padding">
            <td class="center">{{total_count}}</td>
            <td class="center">{{total_xp}} XP</td>
            <td>Average:<br><span class="bold">{{match_average}} XP/match</span></td>
        </tr>
    </table>

    <br>
    <div>Win rate: {{win_rate}}%</div>

    <div class="total-border">{{total_xp}} XP total earned</div>

    <br>
    <div>XP info for each league and outcome:</div>
    <table class="vvxp-table">
        <tr class="tr-padding">
            <th>League</th>
            <th>W/L</th>
            <th>XP</th>
            <th>Game Pass XP</th>
        </tr>
        <tr v-for="leagueOutcome in xpPerLeague">
            <td>{{leagueOutcome.league}}</td>
            <td>{{leagueOutcome.outcome}}
            <td>{{leagueOutcome.xp}}&nbsp;XP</td>
            <td>{{leagueOutcome.xp * 11 / 10}}&nbsp;XP</td>
        </tr>
    </table>

</div>

    `,
    props: {
        entries: { type: Array }
    },
    computed: {

        berserkEntries() {
            return this.entries.filter(entry => entry.message.toLowerCase().includes(this.message.toLowerCase()))
        },


        win_entries() {
            return this.berserkEntries.filter(entry => entry.detailMessage.toLowerCase() == this.win_detailMessage.toLowerCase() || entry.detailMessage.toLowerCase() == this.winBoosted_detailMessage.toLowerCase())
        },

        loss_entries() {
            return this.berserkEntries.filter(entry => entry.detailMessage.toLowerCase() == this.loss_detailMessage.toLowerCase() || entry.detailMessage.toLowerCase() == this.lossBoosted_detailMessage.toLowerCase())
        },


        win_count() {
            return this.win_entries.length
        },

        loss_count() {
            return this.loss_entries.length
        },


        win_total_xp() {
            return round(ssr(this.win_entries), 2)
        },

        loss_total_xp() {
            return round(ssr(this.loss_entries), 2)
        },


        total_count() {
            return this.win_count + this.loss_count
        },

        total_xp() {
            return round(this.win_total_xp + this.loss_total_xp, 2)
        },


        xp_per_win() {
            const xp = round(this.win_total_xp / this.win_count, 2)
            return xp ? xp : 0
        },

        xp_per_loss() {
            const xp = round(this.loss_total_xp / this.loss_count, 2)
            return xp ? xp : 0
        },


        win_label() {
            return this.xp_per_win ? `Win (Avg. ${this.xp_per_win}&nbsp;XP each)` : 'Win'
        },

        loss_label() {
            return this.xp_per_loss ? `Loss (Avg. ${this.xp_per_loss}&nbsp;XP each)` : 'Loss'
        },


        match_average() {
            return round((this.total_xp / this.total_count), 2)
        },

        win_rate() {
            const matchCount = this.win_count + this.loss_count
            return matchCount > 0 ? ((this.win_count / matchCount) * 100).toFixed(2) : 0
        },


        dailyWins_entries() {
            return this.entries.filter(entry => entry.message.toLowerCase() == this.dailyWins_message.toLowerCase())
        },

        dailyWins_bonus() {
            return !!this.dailyWins_entries.length
        },

        dailyWins_xp() {
            return ssr(this.dailyWins_entries)
        },

        dailyWins_bonus_text() {
            const count = this.dailyWins_entries.length
            if (count == 0)
                return '✖'
            else if (count == 1)
                return '✅'
            else if (count > 1)
                return `✅x${count}`
        },
    },
    data() {
        return {
            title: 'Berserk',
            message: 'Berserk',
            win_detailMessage: 'Win',
            loss_detailMessage: 'Loss',
            winBoosted_detailMessage: 'Win (10% Boosted)',
            lossBoosted_detailMessage: 'Loss (10% Boosted)',
            dailyWins_message: '100 XP reward for win 10 Berserk Games',
            // expectedLogs: [{
            //     id: 'Starter Win',
            //     detailMessage: 'Win',
            //     amount: '6'
            // }, {
            //     id: 'Starter Loss',
            //     detailMessage: 'Loss',
            //     amount: '2'
            // }, {
            //     id: 'Starter Win Boosted',
            //     detailMessage: 'Win (10% Boosted)',
            //     amount: '6.6'
            // }, {
            //     id: 'Starter Loss Boosted',
            //     detailMessage: 'Loss (10% Boosted)',
            //     amount: '2.2'
            // }, {
            //     id: 'Ranked Win',
            //     detailMessage: 'Win',
            //     amount: '20'
            // }, {
            //     id: 'Ranked Loss',
            //     detailMessage: 'Loss',
            //     amount: '6'
            // }, {
            //     id: 'Ranked Win Boosted',
            //     detailMessage: 'Win (10% Boosted)',
            //     amount: '22'
            // }, {
            //     id: 'Ranked Loss Boosted',
            //     detailMessage: 'Loss (10% Boosted)',
            //     amount: '6.6'
            // }],
            // xpPerLeaguePreSeason5: [{
            //     league: 'Starter',
            //     outcome: 'Loss',
            //     xp: 2
            // }, {
            //     league: 'Starter',
            //     outcome: 'Win',
            //     xp: 6
            // }, {
            //     league: 'Ranked',
            //     outcome: 'Loss',
            //     xp: 6
            // }, {
            //     league: 'Ranked',
            //     outcome: 'Win',
            //     xp: 20
            // },],
            xpPerLeague: [{
                league: 'Unranked',
                outcome: 'Loss',
                xp: 5
            }, {
                league: 'Unranked',
                outcome: 'Win',
                xp: 15
            }, {
                league: 'Ranked',
                outcome: 'Loss',
                xp: 6
            }, {
                league: 'Ranked',
                outcome: 'Win',
                xp: 20
            },]
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
    <div v-if="this.beforeDate['earliestDetails']">VulcanVerse XP Function details not available.</div>
    <br>
    <table v-if="!this.beforeDate['earliestDetails']" class="vvxp-table">
        <thead style="font-weight: bold;">
            <tr>
                <td>Dailies</td>
                <td style="text-align:center;">Done</td>
                <td style="text-align:center; min-width: 50px;">Quota</td>
                <td style="text-align:center;">Quad</td>
                <td style="text-align:right; min-width: 50px;">Earned</td>
            </tr>
        </thead>
        <tbody>
            <tr v-for="daily in dailies" class="hoverRow" :title="titleMessage(daily.name)">
                <td>{{daily.name}}</td>
                <td style="text-align:center;">{{daily.count}}</td>
                <td style="text-align:center;">{{daily.remaining_for_bonus}}</td>
                <td style="text-align:center;">{{daily.quadrant_bonus ? '✅' : '✖'}}</td>
                <td style="text-align:right;">{{daily.xp_total}}</td>
            </tr>
            <tr class="hoverRow">
                <td>1hr Activity</td>
                <td style="text-align:center;">{{daily_activity}}</td>
                <td></td>
                <td></td>
                <td style="text-align:right;">{{daily_activity == "✅" ? "10 XP" : "0 XP"}}</td>
            </tr>
            <tr class="hoverRow">
                <td>5 Trades</td>
                <td style="text-align:center;">{{daily_trades}}</td>
                <td></td>
                <td></td>
                <td style="text-align:right;">{{daily_trades == "✅" ? "10 XP" : "0 XP"}}</td>
            </tr>
            <tr class="hoverRow">
                <td>10 Merchant Exchanges</td>
                <td style="text-align:center;">{{merchant.done}}</td>
                <td style="text-align:center;">{{merchant.quota}}</td>
                <td></td>
                <td style="text-align:right;">{{merchant.xp_total}} XP</td>
            </tr>
            <tr v-if="vv_quests" :title="vv_quests.title_popup" class="hoverRow">
                <td>Quests</td>
                <td style="text-align:center;">{{vv_quests.done_count}}</td>
                <td></td>
                <td></td>
                <td style="text-align:right;">{{vv_quests.xp_earned}}</td>
            </tr>
            <tr class="hoverRow">
                <td>Fishing</td>
                <td style="text-align:center;">{{vv_fishing.count}}</td>
                <td></td>
                <td></td>
                <td style="text-align:right;">{{vv_fishing.xp}} XP</td>
            </tr>
        </tbody>
    </table>
    <br>
    <table class="vvxp-table">
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
        entriesByDate: { type: Array },
        beforeDate: { type: Object }
    },
    computed: {

        daily_activity() { // 1 hour activity bonus
            const activity_detail = '[Daily Activity]'
            const activity_detail_match = this.entriesByDate.find(entry => entry.detailMessage.toLowerCase().includes(activity_detail.toLowerCase()))
            const activity_bonus = !!activity_detail_match ? '✅' : '✖'
            return activity_bonus
        },

        daily_trades() { // 5 trades bonus
            const trade_detail = '[Daily TRADES]'
            const trade_detail_match = this.entriesByDate.find(entry => entry.detailMessage.toLowerCase().includes(trade_detail.toLowerCase()))
            const trade_bonus = !!trade_detail_match ? '✅' : '✖'
            return trade_bonus
        },

        merchant() { // 10 merchant exchanges
            const merchant_detail = '[Merchant Exchange]'
            const merchant_detail_matches = this.entriesByDate.filter(entry => entry.detailMessage.toLowerCase().includes(merchant_detail.toLowerCase()))
            const count = merchant_detail_matches.length
            return {
                done: count < 10 ? count : "✅",
                quota: count < 10 ? (10 - count) + " remaining" : "",
                xp_total: merchant_detail_matches.reduce((acc, entry) => acc + entry.amount, 0)
            }
        },

        remaining_landmarks() {
            const remaining = this.landmarks.map(landmark => {
                const filter = this.entriesByDate.find(entry => {
                    return landmark.names.reduce((acc, name) => {
                        if (entry.detailMessage.toLowerCase().includes(`[Visit ${name}]`.toLowerCase()))
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
            const forages_arr = this.entriesByDate.filter(entry => entry.detailMessage.toLowerCase().includes('[Foraging]'.toLowerCase()))

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
                quadrant_detail: 'LANDMARK ON EACH QUADRANT]',
                quadrant_bonus: false,
                xp_total: 0
            }, {
                name: 'Forages',
                bonus_requirement: 10,
                detail_text: '[Foraging]',
                count: '-',
                quota_detail: '10 FORAGES]'.toLowerCase(),
                quadrant_detail: 'FORAGE ON EACH QUADRANT]',
                remaining_for_bonus: '-',
                quadrant_bonus: false,
                xp_total: 0
            }, {
                name: 'Battles',
                bonus_requirement: 10,
                detail_text: '[Fight Won]',
                count: '-',
                quota_detail: '10 FIGHT WINS]'.toLowerCase(),
                quadrant_detail: 'FIGHT ON EACH QUADRANT]',
                remaining_for_bonus: '-',
                quadrant_bonus: false,
                xp_total: 0
            }]

            return dailies = dailies.map(daily => {
                const detailMessageMatches = this.entriesByDate.filter(entry => entry.detailMessage.toLowerCase().includes(daily.detail_text.toLowerCase()))
                const count = detailMessageMatches.length
                daily.count = count

                const quota_detail = this.entriesByDate.find(entry => entry.detailMessage.toLowerCase().includes(daily.quota_detail))
                const quota_bonus = !!quota_detail

                daily.remaining_for_bonus = (!quota_bonus && count < daily.bonus_requirement) ? daily.bonus_requirement - count + ' remaining' : '✅'
                const quadrant_detail = this.entriesByDate.find(entry => entry.detailMessage.toLowerCase().includes(daily.quadrant_detail.toLowerCase()))
                daily.quadrant_bonus = !!quadrant_detail

                daily.xp_total = detailMessageMatches.reduce((acc, entry) => acc + entry.amount, 0) + (quota_bonus ? quota_detail.amount : 0) + (daily.quadrant_bonus ? quadrant_detail.amount : 0) + ' XP'

                return daily
            })
        },

        xpCategoryTotalsByDate() {
            const categories = [...new Set(this.entriesByDate.map(entry => entry.detailMessage.split(' [')[0]))]
            let totals = categories.map(category => {
                const total = this.entriesByDate.filter(entry => entry.detailMessage.split(' [')[0].trim() == category.trim())
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
            const questMatches = this.entriesByDate.filter(entry => entry.detailMessage.toLowerCase().includes(detail_text.toLowerCase()))

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
        },

        vv_fishing() {
            const detailMessage = '[Fishing]'
            const fishingEntries = this.entriesByDate.filter(entry => entry.detailMessage.toLowerCase().includes(detailMessage.toLowerCase()))
            return {
                count: fishingEntries.length,
                xp: ssr(fishingEntries)
            }
        }
    },
    data() {
        return {
            title: 'Overview',
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
    template: /* html */ `<div id="vvxp_main" class="BlurlyBox border rounded-1 p-3 h-100" v-cloak style="font-size: 0.75em">
    <h4><span class="TextGradient vvTitle">XP DASHBOARD</span> <span class="icon-button" @click="sectionsToShow.dashboard = !sectionsToShow.dashboard">{{sectionsToShow.dashboard ? '–' : '+'}}</span></h4>

    <div class="row g-3 mb-4" v-show="sectionsToShow.dashboard">

        <div class="col-lg-4">
            <div class="p-4 CurrentLavaStatus">
                <div>
                    <label><input class="" type="number" v-model.number="settings.numberOfWeeksToLoad" @keyup.enter="reload" :disabled="!earliestLoadedDate"> Number of weeks to load.</label>
                    <span v-if="reachedLastLoadedDate" class="red">← Increase and reload.</span>
                </div>
                <a class="btn BtnBorder w-100 py-2 mt-auto" @click="reload">Reload</a>
                <div>{{loadedEntries.length}} entries loaded.</div>
                <br>
                <div class="center">
                    <button class="btn" @click="subtractDay" :disabled="reachedLastLoadedDate || !earliestLoadedDate">←</button>
                    <input class="" type="date" v-model="active_date" :max="today" :min="earliestLoadedDate" :disabled="!earliestLoadedDate">
                    <button class="btn" @click="addDay" :disabled="isToday || !earliestLoadedDate">→</button>
                    <h4>{{relativeDate}}</h4>
                    <div v-if="reachedLastLoadedDate" class="red">Last day of loaded entries. See above to load more.</div>
                </div>
                <br>
                <div>Time until next reset for dailies: {{timeRemaining}}</div>
                <div v-if="!beforeDate['dailyQuestsAdded'] && beforeDate['dailyQuestsUpdated1']">
                    <br>
                    <div class="red">From 2022-09-02 thru 2022-09-11, the daily reset was 2100 UTC instead of 0000 UTC. Since this dashboard treats each day as starting at 0000 UTC, there may be some discreprancies.</div>
                </div>
                <br>
                <br>
                <h4><span class="icon-button" @click="sectionsToShow.secondrow = !sectionsToShow.secondrow">{{sectionsToShow.secondrow ? '–' : '+'}}</span></h4>
            </div>
        </div>

        <div class="col-lg-4">
            <vvxp-overview :entriesByDate="entriesByDate" :beforeDate="beforeDate"></vvxp-overview>
        </div>

        <div class="col-lg-4">
            <vvxp-forages :entries="entriesByDate"></vvxp-forages>
        </div>

    </div>
    
    <div class="row g-3 mb-4" v-show="sectionsToShow.dashboard && sectionsToShow.secondrow">
        <div class="col-lg-4">
            <vvxp-landmarks :entries="entriesByDate"></vvxp-landmarks>
        </div>

        <div class="col-lg-4">
            <vvxp-quests :entries="entriesByDate" :weeklyEntries="entriesByWeek" :active_date="active_date" :xWeeksAgo="xWeeksAgo" :beforeDate="beforeDate"></vvxp-quests>
        </div>

        <div class="col-lg-4">
            <vvxp-battles :entries="entriesByDate"></vvxp-battles>

            <br>
            <vvxp-fishing :entries="entriesByDate"></vvxp-fishing>

            <br>
            <vvxp-other :entries="entriesByDate"></vvxp-other>
        </div>
    </div>

    <div class="row g-3 mb-4" v-show="sectionsToShow.dashboard">

        <div class="col-lg-4">
            <vvxp-berserk :entries="entriesByDate"></vvxp-berserk>
            <br>

            <!-- RESOURCES -->
            <div class="p-4 CurrentLavaStatus">
                <div class="col text-uppercase">
                    <h4 class="GredientText">Resources</h4>
                </div>

                <div class="bullet"><a class="vvxp-hyperlink" href="https://www.vulcanverselore.com/HouseOfRecords/index.php/Landmark_visit_rewards" target="_blank" rel="noopener noreferrer">Landmarks Wiki</a></div>
                <div class="bullet"><a class="vvxp-hyperlink" href="https://vv.vulcanforged.com/Vulcanites" target="_blank" rel="noopener noreferrer">Vulcanite Stats</a> (for foraging and battles)</div>
                <!--
                <div class="bullet">
                    <a class="vvxp-hyperlink" href="https://onedrive.live.com/view.aspx?resid=451F8E01CD020113!105&ithint=file%2cxlsx&authkey=!AMyWuzs-AR00Yq8" target="_blank" rel="noopener noreferrer">Foraging Spreadsheet</a>
                    (<a class="vvxp-hyperlink" href="https://discord.com/channels/759537056153337906/870998406200459274/962514701105913877" target="_blank" rel="noopener noreferrer">source</a>)
                </div>
                -->
                <div class="bullet"><a class="vvxp-hyperlink" href="https://docs.vulcanforged.com/" target="_blank" rel="noopener noreferrer">Official VulcanForged documentation</a></div>

                <br>
                <div class="total-border"></div>

                <br>Link to this userscript: <a class="vvxp-hyperlink" href="https://greasyfork.org/en/scripts/441027-vv-xp/" target="_blank" rel="noopener noreferrer">VV XP</a>
                <br>
                <br>All feedback welcome!
                <br>Share feature suggestions and report bugs in the VulcanForged Discord Channel:
                <br><a class="vvxp-hyperlink" href="https://discord.com/channels/759537056153337906/974649458153373696" target="_blank" rel="noopener noreferrer">#community-developers</a>
                <br>Tag the creator: <strong>@Kire12</strong>

                <!-- NEWS -->
            </div>
        </div>


        <div class="col-lg-8">
            <div class="col text-uppercase">
                <h4 class="GredientText">Loaded Entries</h4>
            </div>

            <div style="margin: 24px 0 15px;">
                <label>Showing <input class="" type="number" v-model.number="settings.numberOfEntriesToShow" :max="filteredEntries.length" min="0"> / {{filteredEntries.length}} entries. (Showing many entries slows down the page.) Filter by: 
                    <select v-model="filterSelected">
                        <option v-for="option in filterOptions" :value="option.value">
                          {{ option.text }}
                        </option>
                      </select>
                </label>
            </div>
            <table v-show="settings.numberOfEntriesToShow > 0" class="vvxp-table">
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
`, created() {
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
        timeRemainingBug: 'N/A',
        settings: {
            numberOfWeeksToLoad: 1,
            numberOfEntriesToShow: 20 // set this to zero to hide
        },
        active_date: moment.utc().toISOString().split('T')[0],
        numberOfWeeksSetToLoad: 0,
        sectionsToShow: {
            dashboard: true,
            secondrow: true
        },
        notableDates: { // version date releases
            "earliestDate": "2021-07-07",
            "earliestDetails": "2022-03-05", // Earliest date that contains details
            "dailyQuestsAdded": "2022-09-02", // Broken daily quests introduced. Dailies reset midday. Weekly quest XP and rewards changed. Reset time at 2100 UTC.
            "dailyQuestsUpdated1": "2022-09-12", // Dailies reset midday. Weekly quest XP and rewards changed. "detailMessage"es now append: "Time UTC:9/12/2022 9:12:14 PM"
            "eventQuestsAdded": "2024-03-03", // Unique weekly quests testing CYOQ system
        },

        filterSelected: 'All',
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

        filterOptions() {
            const entry_messages = this.loadedEntries.map(entry => entry.message)
            const unique_entry_messages = [...new Set(entry_messages)]
            const options = unique_entry_messages.map(message => ({ text: message, value: message }))

            const all_options = [
                { text: 'All', value: 'All' },
                ...options
            ]

            if (!all_options.map(option => option.text).includes(this.filterSelected)) { // in case an option is selected, and fewer entries are reloaded no longer containing that option
                this.filterSelected = 'All'
            }

            return all_options
        },

        beforeDate() {
            let obj = {}

            Object.keys(this.notableDates).forEach(key => {
                const date = this.notableDates[key]
                obj[key] = moment(this.active_date).isBefore(date)
            })

            return obj
        },


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

        filteredEntries() {
            if (this.filterSelected == 'All') {
                return this.loadedEntries
            } else {
                return this.loadedEntries.filter(entry => entry.message == this.filterSelected)
            }
        },

        shownEntries() {
            return this.filteredEntries.slice(0, Math.min(this.settings.numberOfEntriesToShow, this.filteredEntries.length))
        },



        xWeeksAgo() {
            // const days = Math.round(this.settings.numberOfWeeksToLoad * 7)
            // return moment(this.today).subtract(days, 'days').format('YYYY-MM-DD')
            const weeksAgo = moment(this.today).subtract(this.settings.numberOfWeeksToLoad, 'weeks').format('YYYY-MM-DD')
            return moment(weeksAgo).isAfter(this.notableDates.earliestDate) ? weeksAgo : this.notableDates.earliestDate
        },
    },
    methods: {

        init() {
            $('#Earnings .tab-content .mb-5').eq(0).prepend(vvxp_main)

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
            this.today = moment.utc().toISOString().split('T')[0]

            $.ajax({
                type: "POST",
                url: "/MyEarnings/Get_Lava_Earned_Spent",
                cache: false,
                data: {
                    type: 'Credit',
                    section: 'XP',
                    start: 0,
                    length: 999999999,
                    Dapp: 0,
                    startDate: `${this.xWeeksAgo} 00:00:00.0000000`,
                    endDate: `${this.today} 23:59:59.9999999`,
                    __RequestVerificationToken: GetAntiForgeyToken()
                },
                success: function (Response) {
                    if (Response.data === undefined) {// Means user was logged out
                        console.log("No data in response. Reloading page...", Response)
                        location.reload()
                        return
                    }

                    if (Response.data.length > 0) {

                        // console.log(Response)
                        vv_vue.loadedEntries = Response.data
                            .map(entry => { // To make cleaner and make sure script doesn't break, as of 2022-09-12
                                entry.detailMessage = entry.detailMessage.split('Time UTC')[0].trim()
                                return entry
                            })

                        vv_vue.numberOfWeeksSetToLoad = vv_vue.settings.numberOfWeeksToLoad
                        vv_vue.today = moment.utc().toISOString().split('T')[0]

                    }
                    else {
                        console.log("Error !!!", Response)
                    }


                }
            })
        },

        startTimer() {
            setInterval(() => {
                this.timeRemaining = moment.utc().add(1, 'days').startOf('day').subtract(moment()).format('H:mm:ss')
                this.timeRemainingBug = moment.utc().add(1, 'days').startOf('day').subtract(moment()).subtract(3, 'hours').format('H:mm:ss')
            }, 1000)
        },

        convertTime(date) {
            return moment.utc(date).local().format('YYYY-MM-DD HH:mm:ss');
        },

        filterEntriesByDate(text) {
            return this.entriesByDate.filter(entry => entry.detailMessage.toLowerCase().includes(text.toLowerCase()))
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