// ==UserScript==
// @name        Waller Walla
// @namespace   mafia.maxmed
// @author      Mafia[610357]
// @description Effective for outsider hit filtering wall target of faction to avoid early discharge
// @icon        data:image/png;base64,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
// @include     https://www.torn.com/factions.php*
// @include     https://www.torn.com/loader.php?sid=attack&user2ID=*
// @version     2.7.2
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require     https://cdn.bootcss.com/vue/2.5.16/vue.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.13/index.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/less.js/4.1.3/less.min.js
// @require     https://cdn.jsdelivr.net/npm/numeral@2.0.6/numeral.min.js
// @resource    eluicss https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.13/theme-chalk/index.min.css
// @resource    element-icons https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.13/theme-chalk/fonts/element-icons.woff
// @run-at      document-start
// @grant       unsafeWindow
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant       GM_addValueChangeListener
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/490359/Waller%20Walla.user.js
// @updateURL https://update.greasyfork.org/scripts/490359/Waller%20Walla.meta.js
// ==/UserScript==

var initPage = false
var faction = {}
var maxmed = JSON.parse(localStorage.maxmed || '{}')
var opener;

var eluicss = GM_getResourceText("eluicss");
GM_addStyle(eluicss);
lessInput = `
  @font-face {
    font-family: element-icons;
    src: url(${GM_getResourceURL('element-icons')}),
  }

  #maxmedapp {
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
  }

  #maxmedapp .el-drawer__body {
    padding: 10px
  }

  .d .header-wrapper-top .container {
    z-index: 888 !important;
  }

  .el-table--mini .el-table__cell {
    padding: 2px 0;
  }

  .el-link.el-link--primary  {
    font-size: 12px;
  }

  h5 {
    padding: 5px;
    color: #000;
  }

  .custNotify {
      height: 40px;
      width: 42px;
      color: #ff5722;
      cursor: pointer;
      right: -6px !important;
      top: 220px !important;
      padding: 8px 30px 14px 10px;
  }


  .custNotify h2 {
      font-size: 14px !important;
      margin-top: -8px !important;
      margin-left: -8px;
  }

  .notiBS {
      height: 130px;
      width: 115px;
      color: #ff5722;
      right: -6px !important;
      top: 220px !important;
      z-index: 2222 !important;
  }

  .notiBS p {
    line-height: 1.3;
    font-size: 11px !important;
  }

  span.spandrawer,sub {
    color: #0b8f89
  }

  .el-drawer__header {
    margin-bottom: -20px !important;
  }

  .lastatus {
    margin-right: 3px;
  }

  .lastatus.online { color: #9bd024; }
  .lastatus.idle { color: #daa60a;}
  .lastatus.offline { color: #c6c6c6; }

  .la,.lvbs { font-size: 11px;}
  span.lower { color: #8bc34a; }
  span.higher { color: #f44336; }

  #holdncheck {
    display: block;
    color: #373737;
    text-decoration: none;
    margin-top: 10px;
    font-weight: bolder;
    position: absolute;
    margin-left: -23px;
    background-color: #fbe62dab;
    padding: 2px;
    transform: rotate(315deg);
  }
`;

less.render(lessInput, {}).then(output => {
  // output.css = string of css
  // output.map = string of sourcemap
  // output.imports = array of string filenames of the imports referenced

  GM_addStyle(output.css)
}, err => {
  console.error(err)
})

var app = new Vue({
  data: {
      title: 'Waller Walla',
      drawer: false,
      faction: { walls:[], members:[]},
      allTargets: [],
      recentTargets: {},
      onlineTargets: {},
      idleTargets: {},
      offlineTargets: {},
      showList: false,
      totalWalls: 0,
      noOfWall: [],
      isLoading: false,
      selectTarget: 'Recent',
      preferCol: 'Level',
      objMon: {
        btnName: "Targets Updater",
        isActive: false,
        timeInterval: 0
      },
      mybs: {},
      prestart: maxmed.prestart ?? false
  },
  mounted() {
    _this = this
    opener = this.$notify({
      title: 'Waller Walla',
      showClose: false,
      offset: 100,
      duration: 0,
      iconClass: 'el-icon-aim',
      customClass: 'custNotify',
      onClick: function() {
          if(maxmed.hasOwnProperty('apikey')) {
            _this.drawer = true;
          }
          else {
            this.$prompt('Please input your correct API key (Public Access atleast)', 'API KEY required', {
              confirmButtonText: 'OK',
              cancelButtonText: 'Cancel',
              dangerouslyUseHTMLString: true
            }).then(async ({ value }) => {
              resp = await fetch('https://api.torn.com/faction/?selections=basic&comment=maxmed&key=' + value)
              data = await resp.json()

              if(data.error) {
                this.$message.error({
                  message: data.error.error
                });
              }
              else {
                maxmed.apikey = value
                localStorage.maxmed = JSON.stringify(maxmed)
                this.$message({
                  type: 'success',
                  message: 'Your API successfully added and saved',
                  onClose: () => location.reload()
                });
              }
            }).catch(() => {
              this.$message.error({
                type: 'info',
                message: 'Input canceled'
              });
            });
          }
      }
      });
  },
  methods: {
      handleClose: function() {
          this.drawer = false
      },

      loadwall: function() {

      },

      loadlist: async function() {
        try {
          this.isLoading = true
          const { recentTargets, onlineTargets, idleTargets, offlineTargets } = await this.fetchTarget()

          this.recentTargets.offwall = recentTargets.filter( f => !_this.faction.members.find( member => member.userID == f.userID))
          this.recentTargets.onwall = recentTargets.filter( f => _this.faction.members.find( member => member.userID == f.userID)).map( m => { return Object.assign(m,{ wall: _this.faction.members.find( f => f.userID == m.userID).wall })})

          this.onlineTargets.offwall = onlineTargets.filter( f => !_this.faction.members.find( member => member.userID == f.userID))
          this.onlineTargets.onwall = onlineTargets.filter( f => _this.faction.members.find( member => member.userID == f.userID)).map( m => { return Object.assign(m,{ wall: _this.faction.members.find( f => f.userID == m.userID).wall })})

          this.idleTargets.offwall = idleTargets.filter( f => !_this.faction.members.find( member => member.userID == f.userID))
          this.idleTargets.onwall = idleTargets.filter( f => _this.faction.members.find( member => member.userID == f.userID)).map( m => { return Object.assign(m,{ wall: _this.faction.members.find( f => f.userID == m.userID).wall })})

          this.offlineTargets.offwall = offlineTargets.filter( f => !_this.faction.members.find( member => member.userID == f.userID))
          this.offlineTargets.onwall = offlineTargets.filter( f => _this.faction.members.find( member => member.userID == f.userID)).map( m => { return Object.assign(m,{ wall: _this.faction.members.find( f => f.userID == m.userID).wall })})

          this.selectTarget = 'Recent'
          this.showList = true

          this.isLoading = false

          // self battle stats for comparison with enemy battle stats
          resp = await fetch('https://api.torn.com/user/?selections=battlestats&comment=maxmed&key=' + maxmed.apikey)
          data = await resp.json()

          if(!data.error) {
            const { defense, dexterity, speed, strength, total } = data;
            this.mybs = { defense, dexterity, speed, strength, total }
            maxmed.mybs = this.mybs;
            localStorage.maxmed = JSON.stringify(maxmed)
          }
        } catch (error) {}

      },

      initAttack: function(uid,mode) {
        if(mode == 1) {
          eval('this.' + this.selectTarget.toLowerCase() + 'Targets.offwall.splice(this.' + this.selectTarget.toLowerCase() + 'Targets.offwall.findIndex( f => f.userID == uid),1)')
        }
        else if(mode == 2) {
          eval('this.' + this.selectTarget.toLowerCase() + 'Targets.onwall.splice(this.' + this.selectTarget.toLowerCase() + 'Targets.onwall.findIndex( f => f.userID == uid),1)')
        }

        window.open('https://www.torn.com/loader2.php?sid=getInAttack&user2ID='+uid, "_attack", 'width=800, height=800')
      },

      reset: function() {
        initPage = false
        this.isLoading = true
        window.location.href = "#"
      },

      btnMon: function() {
        if(this.objMon.timeInterval) {
          this.objMon.timeInterval = 0
          this.objMon.btnName = "Targets Updater"
        }
        else {
          this.$prompt('This will auto update target list and consume your API key usage. Please enter the number of seconds below where target will auto updated every X seconds.', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel'
          }).then(async ({ value }) => {
            if(isNaN(value)) {
              this.$message.error('Incorrect number of seconds')
            }
            else {
              this.objMon.timeInterval = value
              this.objMon.btnName = "Stop!"
              this.objMon.isActive = true
              this.updateTarget(value)
            }
          })
        }
      },

      updateTarget: function(s) {
        _this = this;
        this.selectTarget = 'All'

        async function runningUpdate(v) {

          try {
            const { allTargets } = await _this.fetchTarget()
            _this.allTargets = allTargets
          } catch (error) {
            _this.objMon.timeInterval = 0;
          }

          setTimeout(() => {
            if(_this.objMon.timeInterval) {
              runningUpdate(v);
            }
          }, (v * 1000))

        }

        runningUpdate(s)
      },

      fetchTarget: async function() {
        _this = this
        resp = await fetch('https://api.torn.com/faction/' + this.faction.ID + '?selections=&comment=maxmed&key=' + maxmed.apikey)
        data = await resp.json()


        if(data.error) {
          this.$message.error({
            message: data.error.error
          });

          this.drawer = false
          localStorage.removeItem('maxmed')
          delete maxmed.apikey

          throw new Error(data.error.error)
        }

        else {
          timenow = (new Date()).getTime() / 1000
          diffTime = timenow - (60 * 5) // 5 minutes

          allTargets = Object.entries(data.members)
                        .filter( f => f[1].status.state == 'Okay')
                        .map( m => {
                            const { level, name, last_action, status } = m[1]
                            diffTS = parseInt(timenow - last_action.timestamp)
                            last_action.relative = diffTS < 60 ? `${diffTS} secs` : last_action.relative.replace('minute','min').replace('ago','').replace('0 min','1 min')
                            return { level, name, last_action, status, userID: Number(m[0]) }
                        })
                        .sort( (a,b) => b.last_action.timestamp - a.last_action.timestamp)

          recentTargets = allTargets.filter( f => f.last_action.timestamp > diffTime)
          onlineTargets = allTargets.filter( f => f.last_action.status == 'Online')
          idleTargets = allTargets.filter( f => f.last_action.status == 'Idle')
          offlineTargets = allTargets.filter( f => f.last_action.status == 'Offline')

          return { allTargets, recentTargets, onlineTargets, idleTargets, offlineTargets }
        }
      },

      resetAPIkey: function() {
        this.$confirm('Are you sure to remove your API key ?','Removing API key', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
              })
            .then(() => {
              this.drawer = false
              localStorage.removeItem('maxmed')
              delete maxmed.apikey
              this.$message.success('API key successfully deleted')
            })
      },

      swPrestart: (v) => {
        maxmed.prestart = v
        localStorage.maxmed = JSON.stringify(maxmed)
      }
  },
  filters: {
    stats: s => s ? numeral(s).format('0.0a').toUpperCase() : '-'
  }
});

// REQUEST & RESPONSE INTERCEPTOR
const { fetch: originalFetch } = unsafeWindow;
unsafeWindow.fetch = async (...args) => {
    let [resource, config] = args;
    let response = await originalFetch(resource, config);

    const json = () => response.clone().json()
                      .then((data) => {
                        data = { ...data };

                        if(response.url.indexOf('?sid=attackData') != -1) {
                          if(maxmed.prestart && data.DB.error?.includes('in hospital')) {
                            data.DB.defenderUser.playername += ' [In Hospital]'
                            delete data.DB.error
                            delete data.startErrorTitle
                          }
                        }

                        return data
                      })

    response.json = json;
    response.text = async () =>JSON.stringify(await json());

    if(response.url.indexOf('page.php?sid=factionsProfile&step=getInfo') != -1) {
        response.json().then( r => factionInfo(r))
    }

    if(response.url.indexOf('faction_wars.php?redirect=false&step=getwardata') != -1) {
        response.json().then( r => factionWars(r))
    }

    if(response.url.indexOf('faction_wars.php?redirect=false&step=getwarusers') != -1) {
        response.json().then( r => wallMembers(response.url, r))
    }

    if(response.url.indexOf('?sid=attackData') != -1) {
      response.json().then( r => attackScreen(r))
    }

    if(response.url.indexOf('?step=getMiniProfile') != -1) {
      response.json().then( r => removeLink(r))
    }

    return response;
};

factionInfo = function(r) {
    app.$set(app.faction, 'info', r )
    app.title = 'Waller Walla of ' + r.infoPanel.factionName
}

factionWars = function(r) {

  if(!initPage) {
    initPage = true
    walls = r.wars.filter(f => f.type == 'territory').filter( f => f.myFaction.membersQuantity).map( m => m.ID)
    app.totalWalls = walls.length
    app.$set(app.faction, 'warData', r )
    app.$set(app.faction, 'ID', r.factionID )
    app.$set(app.faction, 'walls', walls )
    app.$set(app.faction, 'members', [] )
    app.showList = false
    app.noOfWall = []
    app.isLoading = false
    app.objMon.isActive = false
    app.objMon.btnName = "Targets Updater"


    GM_xmlhttpRequest ( {
      method:     "GET",
      url:        `https://www.tornstats.com/api/v2/${maxmed.apikey}/spy/faction/${r.factionID}`,
      headers:    {
          "Content-Type": "application/json"
      },
      onload: response =>{
          spies = JSON.parse(response.responseText)
          app.$set(app.faction, 'spies', spies.faction?.members ?? {})
      },
      onerror: () => {}
    })
  }
}

wallMembers = async function(url, r) {
  wallID = (new URLSearchParams(url)).get('warID');
  const { territoryName, enemyFaction: { factionName: enemyFaction } } = app.faction.warData.wars.find( f => f.key == wallID)
  index = app.faction.walls.indexOf(wallID)

  wall = { wallID, territoryName, enemyFaction }

  if(index != -1) {

    app.noOfWall.push(app.faction.walls.splice(index,1))
    app.faction.members = app.faction.members.concat(r.warDesc.members.filter( f => f.factionID == app.faction.ID )
                          .map( m => {
                            const {userID,name,level,joinTimestamp} = m;
                            return {userID,name,level,joinTimestamp,wall}
                          }))
  }

  GM_setValue('waller', JSON.stringify(app.faction.members.concat(r.warDesc.members.filter( f => f.factionID == app.faction.ID )
                                                                                    .map( m => {
                                                                                      const {userID,name,level,joinTimestamp} = m;
                                                                                      return {userID,name,level,joinTimestamp,wall}
                                                                                    }))
  ))
}

attackScreen = r => {
  if(maxmed.prestart && r.DB.defenderUser.playername.includes('[In Hospital]')) {
    if(!$("#holdncheck").length) {
      setTimeout(() => {
        $("button:contains(Start fight)").before('<a id="holdncheck" href="https://www.torn.com/profiles.php?XID=' + r.DB.defenderUser.userID + '">hold&amp;check</a>')
      }, 10);
    }
  }

  else {
    if($("#holdncheck").length) {
      $("#holdncheck").fadeOut()
    }
  }
}

removeLink = r => {
  if(r.userStatus.status.type == 'okay' && $("#holdncheck").length) {
    $("#holdncheck").remove()
  }
}

$(document).ready(function() {
    var template = `
    <el-drawer
      :title="title"
      :visible.sync="drawer"
      :size="355"
      :before-close="handleClose">
      <div style="padding: 10px; text-align: center;" v-if="!showList">
        <div v-if="faction.walls.length" >
          <el-link type="primary" :href="'#/war/'+faction.walls[0]" @click.prevent="loadwall" :underline="false" style="font-size: 26px; font-weight: bolder; display: block; margin-bottom: 10px;">Next ( {{ noOfWall.length }} / {{ totalWalls }} )</el-link>
          <span class="spandrawer">Just [NEXT] to collect every wall sitter, there are <strong>{{ totalWalls }} walls</strong> currently sitting by their members</span>
        </div>
        <el-button type="primary" @click="loadlist" v-if="!faction.walls.length" size="small" :loading="isLoading">Load Targets</el-button>

        <el-row type="flex" justify="center" style="margin-top:50px;">
          <el-col :span="11"><span class="spandrawer">Ability Pre Start Fight</span></el-col>
          <el-col :span="4"><el-switch v-model="prestart" @change="swPrestart"></el-switch></el-col>
        </el-row>

        <el-row type="flex" justify="center" style="margin-top:20px;">
          <el-col :span="24">
            <el-button type="text" size="mini" @click="resetAPIkey">Reset API key</el-button>
          </el-col>
        </el-row>
      </div>

      <div v-if="showList">

        <el-row type="flex" justify="center" style="margin:10px;">
          <el-col :span="24">
            <el-button type="warning" @click="reset" size="small" :loading="isLoading">Reset wall targets</el-button>
            <el-button type="info" @click="btnMon" size="small">{{ objMon.btnName }}</el-button>
          </el-col>
        </el-row>

        <el-row type="flex" justify="center" v-if="!objMon.isActive">
          <el-col :span="20">
            <el-radio-group v-model="selectTarget" size="mini">
              <el-tooltip effect="dark" content="last 5 minutes activity" placement="bottom"><el-radio-button label="Recent"></el-radio-button></el-tooltip>
              <el-radio-button label="Online"></el-radio-button>
              <el-radio-button label="Idle"></el-radio-button>
              <el-radio-button label="Offline"></el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>

        <el-row type="flex" justify="center" v-if="!objMon.isActive">
          <el-col :span="20">
            <el-radio-group v-model="preferCol" size="mini" style="margin-top: 5px;">
              <el-radio-button label="Level"></el-radio-button>
              <el-tooltip effect="dark" content="require API Key used in Torn-Stats and permission to faction spies" placement="bottom"><el-radio-button label="Battle Stats" :disabled="!Object.keys(faction.spies).length"></el-radio-button></el-tooltip>
            </el-radio-group>
          </el-col>
        </el-row>


        <h5 v-if="objMon.isActive">Available Targets <el-tag type="info" size="mini">{{ allTargets.length }}</el-tag></h5>
        <sub v-if="objMon.isActive">{{ objMon.timeInterval ? 'updated every ' + objMon.timeInterval + ' seconds' : 'timer inactive' }}</sub>
        <el-table :data="allTargets" border stripe size="mini" empty-text="No available target" max-height="'none'" v-if="objMon.isActive">
          <el-table-column
            prop="name"
            label="Targets"
            :width="182">
            <template slot-scope="x">
            <el-tooltip effect="dark" :content="x.row.last_action.status" placement="top">
              <span :class="'lastatus ' + x.row.last_action.status.toLowerCase()">⬤</span>
            </el-tooltip>
            <el-link type="primary" @click="initAttack(x.row.userID, 3)" :underline="false">{{ x.row.name }}</el-link>
            </template>
          </el-table-column>

          <el-table-column
              v-if="preferCol == 'Level'"
              prop="level"
              label="Level"
              align="center"
              class-name="lvbs"
              :width="60">
          </el-table-column>

          <el-table-column
              v-if="preferCol != 'Level'"
              label="BS"
              align="center"
              class-name="lvbs"
              :width="60">
              <template slot-scope="x">
                <el-tooltip effect="dark" placement="left">
                <div slot="content">
                  DEF: {{ faction.spies[x.row.userID]?.spy?.defense ?? 0 | stats }}<br/>
                  DEX: {{ faction.spies[x.row.userID]?.spy?.dexterity ?? 0 | stats }}<br/>
                  STR: {{ faction.spies[x.row.userID]?.spy?.strength ?? 0 | stats }}<br/>
                  SPD: {{ faction.spies[x.row.userID]?.spy?.speed ?? 0 | stats }}
                </div>
                <span :class="(faction.spies[x.row.userID]?.spy?.total ?? 0) < mybs.total ? 'lower' : 'higher'">{{ faction.spies[x.row.userID]?.spy?.total ?? 0 | stats }}</span>
                </el-tooltip>
              </template>
          </el-table-column>

          <el-table-column
            prop="last_action.relative"
            align="center"
            label="Last Action"
            class-name="la"
            :width="75">
          </el-table-column>
        </el-table>

        <h5 v-if="!objMon.isActive">Non-Wall targets <el-tag type="info" size="mini">{{ eval(selectTarget.toLowerCase() + 'Targets.offwall.length') }}</el-tag></h5>
        <sub v-if="objMon.isActive">updated every {{ objMon.timeInterval }} seconds</sub>
        <el-table :data="eval(selectTarget.toLowerCase() + 'Targets.offwall')" border stripe size="mini" empty-text="No available target" :max-height="250" v-if="!objMon.isActive">
          <el-table-column
            prop="name"
            label="Targets"
            :width="182">
            <template slot-scope="x">
            <el-tooltip effect="dark" :content="x.row.last_action.status" placement="top">
              <span :class="'lastatus ' + x.row.last_action.status.toLowerCase()">⬤</span>
            </el-tooltip>
            <el-link type="primary" @click="initAttack(x.row.userID, 1)" :underline="false">{{ x.row.name }}</el-link>
            </template>
          </el-table-column>

          <el-table-column
              v-if="preferCol == 'Level'"
              prop="level"
              label="Level"
              align="center"
              class-name="lvbs"
              :width="60">
          </el-table-column>

          <el-table-column
              v-if="preferCol != 'Level'"
              label="BS"
              align="center"
              class-name="lvbs"
              :width="60">
              <template slot-scope="x">
                <el-tooltip effect="dark" placement="left">
                <div slot="content">
                  DEF: {{ faction.spies[x.row.userID]?.spy?.defense ?? 0 | stats }}<br/>
                  DEX: {{ faction.spies[x.row.userID]?.spy?.dexterity ?? 0 | stats }}<br/>
                  STR: {{ faction.spies[x.row.userID]?.spy?.strength ?? 0 | stats }}<br/>
                  SPD: {{ faction.spies[x.row.userID]?.spy?.speed ?? 0 | stats }}
                </div>
                <span :class="(faction.spies[x.row.userID]?.spy?.total ?? 0) < mybs.total ? 'lower' : 'higher'">{{ faction.spies[x.row.userID]?.spy?.total ?? 0 | stats }}</span>
                </el-tooltip>
              </template>
          </el-table-column>

          <el-table-column
            prop="last_action.relative"
            align="center"
            label="Last Action"
            class-name="la"
            :width="75">
          </el-table-column>
        </el-table>


        <h5 v-if="!objMon.isActive">Wall targets <el-tag type="info" size="mini">{{ eval(selectTarget.toLowerCase() + 'Targets.onwall.length') }}</el-tag></h5>
        <el-table :data="eval(selectTarget.toLowerCase() + 'Targets.onwall')" border stripe size="mini" empty-text="No available target" v-if="!objMon.isActive">
          <el-table-column
            prop="name"
            label="Targets"
            :width="132">
            <template slot-scope="x">
            <el-tooltip effect="dark" :content="x.row.last_action.status" placement="top">
              <span :class="'lastatus ' + x.row.last_action.status.toLowerCase()">⬤</span>
            </el-tooltip>
            <el-link type="primary" @click="initAttack(x.row.userID, 2)" :underline="false">{{ x.row.name }}</el-link>
            </template>
          </el-table-column>

          <el-table-column
              prop="wall"
              label="Wall"
              :width="50">
            <template slot-scope="x">
              <el-tooltip effect="dark" :content="x.row.wall.enemyFaction" placement="right">
                <el-link type="primary" :href="'#/war/'+x.row.wall.wallID" :underline="false">{{ x.row.wall.territoryName }}</el-link>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column
              v-if="preferCol == 'Level'"
              prop="level"
              label="Level"
              align="center"
              class-name="lvbs"
              :width="60">
          </el-table-column>

          <el-table-column
              v-if="preferCol != 'Level'"
              label="BS"
              align="center"
              class-name="lvbs"
              :width="60">
              <template slot-scope="x">
                <el-tooltip effect="dark" placement="left">
                <div slot="content">
                  DEF: {{ faction.spies[x.row.userID]?.spy?.defense ?? 0 | stats }}<br/>
                  DEX: {{ faction.spies[x.row.userID]?.spy?.dexterity ?? 0 | stats }}<br/>
                  STR: {{ faction.spies[x.row.userID]?.spy?.strength ?? 0 | stats }}<br/>
                  SPD: {{ faction.spies[x.row.userID]?.spy?.speed ?? 0 | stats }}
                </div>
                <span :class="(faction.spies[x.row.userID]?.spy?.total ?? 0) < mybs.total ? 'lower' : 'higher'">{{ faction.spies[x.row.userID]?.spy?.total ?? 0 | stats }}</span>
                </el-tooltip>
              </template>
          </el-table-column>

          <el-table-column
            prop="last_action.relative"
            align="center"
            label="Last Action"
            class-name="la"
            :width="75">
          </el-table-column>
        </el-table>

      </div>
    </el-drawer>
    `

  if(location.href.indexOf('https://www.torn.com/loader.php?sid=attack&user2ID') != -1) {
    $("body").append(`<div id="maxmedapp"></div>`)
    let isNotified = false
    let userID = (new URLSearchParams(location.href)).get('user2ID')

    GM_addValueChangeListener("waller", function(key, oldValue, newValue, remote) {
      let waller = JSON.parse(newValue ?? '[]')

      target = waller.find( f => f.userID == userID)
      if(!isNotified && target) {
        app.$message.warning({
          message:'Currently sitting in ' + target.wall.territoryName + ' wall',
          duration: 0
        })
        isNotified = true
      }
    })

    waller = JSON.parse(GM_getValue('waller') ?? "[]")

    target = waller.find( f => f.userID == userID)

    if(!isNotified && target) {
      app.$message.warning({
        message:'Currently sitting in ' + target.wall.territoryName + ' wall',
        duration: 0
      })

      isNotified = true
    }

    // opener.close()
    GM_xmlhttpRequest ( {
      method:     "GET",
      url:        `https://www.tornstats.com/api/v2/${maxmed.apikey}/spy/user/${userID}`,
      headers:    {
          "Content-Type": "application/json"
      },
      onload: response =>{
          spy = JSON.parse(response.responseText)

          if(spy.status) {
            spy = spy.spy

            app.$notify({
              title: 'B.Stats',
              offset: 100,
              showClose: false,
              dangerouslyUseHTMLString: true,
              customClass: 'notiBS',
              duration: 0,
              message: `DEF: <span class="${spy.defense < maxmed.mybs.defense ? 'lower' : 'higher'}">${app.$options.filters.stats(spy.defense)}</span><br/>DEX: <span class="${spy.dexterity < maxmed.mybs.dexterity ? 'lower' : 'higher'}">${app.$options.filters.stats(spy.dexterity)}</span><br/>STR: <span class="${spy.strength < maxmed.mybs.strength ? 'lower' : 'higher'}">${app.$options.filters.stats(spy.strength)}</span><br/>SPD :<span class="${spy.speed < maxmed.mybs.speed ? 'lower' : 'higher'}">${app.$options.filters.stats(spy.speed)}</span><br/>Total: <span class="${spy.total < maxmed.mybs.total ? 'lower' : 'higher'}">${app.$options.filters.stats(spy.total)}</span>`
            })
          }

          else {
            opener.close()
          }
      },
      onerror: (e) => { console.log(e)}
    })
  }

  else {
    $("body").append(`<div id="maxmedapp">${template}</div>`)
  }

  app.$mount('#maxmedapp')
});