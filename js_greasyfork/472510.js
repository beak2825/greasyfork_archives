// ==UserScript==
// @name         Territory Cooldown
// @namespace    mafia.ttcd
// @version      1.2.0
// @description  Check current Territory cooldown
// @author       Mafia [610357]
// @match        https://www.torn.com/city.php
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js
// @require      https://cdn.bootcss.com/vue/2.5.16/vue.min.js
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      BSD
// @downloadURL https://update.greasyfork.org/scripts/472510/Territory%20Cooldown.user.js
// @updateURL https://update.greasyfork.org/scripts/472510/Territory%20Cooldown.meta.js
// ==/UserScript==

// GM_addStyle(GM_getResourceText('jquery_ui_css'))
GM_addStyle(`
    #ttcd {
        position: fixed;
        top: 76px;
        left: 0px;
        padding: 13px;
        z-index: 9999;
        width: 240px;
    }

    span.tname {
        display: block;
        width: 50px;
        font-size: 14px;
        float: left;
        margin-right: 20px;
        clear: left;
        padding: 4px;
        text-align: center;
        font-weight: bolder;
        cursor: pointer;
    }
    
    span.tname.nap::after {
        content: ' ✌';
        display: inline-block;
    }
    
    span.end {
        display: block;
        width: 100px;
        float: left;
        font-size: 11px;
        text-align: center;
    }
    
    span.countdown {
        display: block;
        float: left;
        padding: 5px; 
        font-size: 11px;
    }
    
    .popup li:nth-child(even) {
       color:#4ef7bd;
    }
    
    .popup li span { margin-top: 10px;}
    .popup {
        height: 600px;
        width: 300px;
        overflow: scroll;
        background: #454545;
        position: sticky;
        display: none;
        border-radius: 0px 7px 7px 7px;
        padding: 10px;
    }
    
    #ttcd input {
        width: 250px;
        height: 20px;
        border: solid #2f2f2f 1px;
        text-align: center;
        text-transform: uppercase;
        margin: 0px 5px;
        font-size: 12px;
        font-weight: 900;
        background-color: #dbdbdb40;
        color: #1a1a1a;
    }

    ::-webkit-scrollbar {
        width: 0px;
        background: transparent; /* make scrollbar transparent */
    }

    #ttcd button.open {
        font-size: 20px;
        font-weight: bolder;
        height: 40px;
        background: #454545;
        color: #1baf7e;
        cursor: pointer;
    }

`)

var template = `
<button @click="showList" class="open">Map Cooldown</button>

    <div class="popup">
        <h2 style="font-size: 14px; margin-top: 4px; display: block; text-align: center;">{{faction}}</h2>

        <sub>Quick check TTs here : (comma/space seperated)</sub>
        <input v-model="search" />
        <ul>
        <li v-for="tt of ttcds">
            <span class="tname" @click="loadTerr(tt.name)" :class="{ nap: tt.isNAP }" :title="tt.title">{{tt.name}}</span>
            <span class="end">{{tt.at}}</span>
            <span class="countdown">{{tt.countdown}}</span>
        </li>
        </ul>
    </div>
`
$("#chatRoot").after("<div id='ttcd'>"+template+"</div>")


var app = new Vue({
    data: {
        data:[],
        faction: '',
        updater: 0,
        search: '',
        isFullView: false,
        show: false
    },
    mounted() {
        data = torn.model.get()

        setInterval(() => { this.updater++ }, 1000);
        setTimeout(() => {
            this.isFullView = data.isShowTerr
            this.faction = data.factionOwnTerritories.factionName[data.factionOwnTerritories.factionID]
            this.data = Object.entries(data.factionOwnTerritories.factionWarTimeOuts).map( m => {
                return {name: data.collectionById[m[0]].get('name'), timeout: m[1], at: moment(m[1]).utc().format('DD/MM/YYYY HH:mm:ss TCT'), countdown: '', isNAP: false, title: 'Warred this TT recently'}
            })

            Object.entries( data.factionOwnTerritories.factionNAPs ).map( m => Object.keys(data.factionOwnTerritories.territories[m[0]])
                                                                                     .forEach( f => {
                                                                                        const name = data.collectionById[f].get('name');
                                                                                        found = this.data.find( n => n.name == name)

                                                                                        if(!found){
                                                                                            this.data.push({
                                                                                                name,
                                                                                                timeout:m[1], at:moment(f).utc().format('DD/MM/YYYY HH:mm:ss TCT'),
                                                                                                countdown: '',
                                                                                                isNAP: true,
                                                                                                title: 'NAP with ' + data.factionOwnTerritories.factionName[m[0]]
                                                                                            })
                                                                                        }
                                                                                        else {
                                                                                            Object.assign(found, {
                                                                                                isNAP: true,
                                                                                                title: 'Warred this TT recently & NAP with ' + data.factionOwnTerritories.factionName[m[0]]
                                                                                            })
                                                                                        }
                                                                                     })
                                                                    )

        this.data.sort((a,b) => a.timeout - b.timeout)
        }, 3000);
        
    },
    methods: {
        showList() {
            if(!this.show) {                
                if(this.isFullView) {
                    $(".popup").slideDown()
                }
                else {
                    alert('Please allow map loaded first OR enable Full Territory View')
                    this.show = false
                }
            }
            else {
                $(".popup").slideUp()
            }

            this.show = !this.show
        },
        loadTerr(t) {
            torn.setPositionByTerrName(t)
        }
    },
    computed: {
        ttcds() {
            this.updater;
            that = this
            alltts = this.data
            for (let index = 0; index < alltts.length; index++) {
                const element = alltts[index];
                duration =  moment.duration(moment(element.timeout).subtract(moment()).valueOf())
                days = duration.days()
                hours = duration.hours()
                minutes = duration.minutes()
                seconds = duration.seconds()
                element.countdown = (days ? duration.days() + 'd ' : '') + (days || hours ? duration.hours() + 'h ' : '') + (days || hours || minutes ? duration.minutes() + 'm ' : '') + (days || hours || minutes || seconds ? duration.seconds() + 's' : '')
            }
            result = this.search.length ? alltts.filter( f => that.search.toUpperCase().split(/[ ,]+/).includes(f.name)) : alltts

            return result;
        }
    }
})

app.$mount('#ttcd')
