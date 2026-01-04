// ==UserScript==
// @name        Waller Waller
// @namespace   mafia.maxmed
// @author      Mafia[610357]
// @description Waller walla walle wellerman wally wolla well well wall woll walter..
// @license     MIT
// @icon        data:image/png;base64,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zGoLrCdA4VuT87w8tdCx0cAqgSqRXVn97VaszwoDc9WArkZuA7u7760JEIFfP7L/frdrx9DaBaZiF1DgzM05XplZvN/tjCEwWa7xZ+9cZ6pSuycjrKULzNcCHOJfW83VfHx7d7PZdo58ixKovWcJlTU9i/Mqn3p4X9wRgU8fObCixLaSAZOVYlqfujreHGbNd1U51JPiuWOjcQbY3pWx+gJsdWPuSIuLuXC7yB9eeJdWObyt5sAE4VqpSjGI+PMfXifjOlv8oWNrW6UwohhEvDQ5z8V8sW6rkwNK8Xcu3C7iiDRdv0GAb4SXpyo+WzE5LDg5LDIzMCw0NzgsOTQ2LDExMTcsMjczNiw1NDMxLDcwNDksNzE5Nyw3ODE4LDgxMjQsODE1MSw4MzE3LDg0MDAsODUzNyw4ODM2LDg4NjcsODkzOCw5MDM2LDkwNDEsOTUxNyw5Njg5LDEwNTY2LDEwNjEwLDEwODUwLDEwODU2LDEyOTEyLDEzMzQzLDEzNjY1LDEzODQyLDE0MDUyLDE1MTUxLDE2MDUzLDE2MzEyLDE2NTAzLDE2NjI4LDE4MDkwLDE4NTY5LDE4NzE0LDE5MDYwLDIxMzY4LDIyMjk1LDIyNjgwLDI2MDQzLDI2MTU0LDkzMDUsMzAwMDksMzEzOTcsMzYyNzQsMzc1OTUsMzg3NjEsNDAyMDAsNDA0NDksNDEyMTgsNDE0MTksNDE3NzUsNDE4NTMsNDI2ODEsNDQ0MDQsNDQ0NDUsNDQ3NTgsNDU0NjUsNDgyNzcsNDg2MjgsNDg2NzMsNDkxNjQsNDY3MDgsNDgxNDAsNDQ0NjcsNDE3MDIsMzU1LDMyNDEsNjkyNCw3NjUyLDc5ODYsODA3Niw4NDIyLDg3MTUsOTEwMCw5MzU2LDk0MDUsOTY3NCw5OTUzLDEwMTc0LDEwNzQxLDExNDI4LDExNzk2LDE0MzY1LDE0ODIxLDE2MzM1LDE2NDI0LDIwNDY1LDIxMjM0LDIxNjY1LDIzOTUyLDI1ODc0LDI3OTAyLDMxNzY0LDMyNzgxLDM1Nzc2LDM2MTM0LDI2MzEyLDUyNSw5MzcsMjAxMyw2NzgwLDY5NzQsNzIyNyw3OTM1LDc5OTAsODI4NSw4ODExLDkyODAsOTM1NywxMTM3NiwxMTc4MiwxMjg5NCwxMzMwNywxMzM3NywxMzg3MiwxNDY4NiwxNTE1NCwxNTY0NCwxNjI0NywxNjI5NiwxNjYzNCwxNzU4NywxNzk5MSwxODU5NywyMDc0NywyMTcxNiwyMzE5MywyMzQ5MiwyNzMxMiwyNzU1NCwyODIwNSwzMzQ1OCwzMzc4MywzNTg0MCwzNjE0MCwzNzA5MywzNzE4NSwzNzQ5OCwzODg4NywzOTUzMSwzOTk2MCw0MDYyNCw0MDkwNSw0MDk1OSw0MTE2NCw0MTIzNCw0MTI5Nyw0MjUwNSw0MzMyNSw0NDU2Miw0NTU5NSw0NjA4OSw0NjEyNyw0NjQ0Miw0NzEwMCw0ODAwMiw0ODExMiw0ODY4MCw0ODgzMiw0ODk4OSw0OTE4NCw0OTM0Niw0OTc2M10=
// @include     https://www.torn.com/factions.php*
// @include     https://www.torn.com/loader.php?sid=attack&user2ID=*
// @include     https://www.torn.com/hospitalview.php
// @connect     www.tornstats.com
// @version     3.8.3
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
// @downloadURL https://update.greasyfork.org/scripts/474755/Waller%20Waller.user.js
// @updateURL https://update.greasyfork.org/scripts/474755/Waller%20Waller.meta.js
// ==/UserScript==

var initPage = false
var faction = {}
var maxmed = JSON.parse(localStorage.maxmed || '{}')
var opener;
var attacking = GM_getValue('attacking')
var wallJoin = { warID: 0, emptyWall: [] }
var mylife = 0;
var insider = JSON.parse(GM_getValue('insider') ?? '{"factions":{},"vs":{}}')
var insideHitters = []
var fWars = []

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
    margin-top: -15px;
  } 
  
  .dmgnoti {
      width: 250px;
      padding: 14px 26px 0px 13px;
  }

  .dmgnoti h2 {
      margin-bottom: 6px !important;
      font-size: 18px !important;
  }

  sub#esc {
    display: block;
    margin-top: 10px;
    color: #c4bdbd;
    font-style: italic;
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

  #joinwall {
    position: fixed;
    cursor: pointer;
    padding: 9px;
    background: #FFEB3B;
    right: -8px;
    top: 271px;
    height: 17px;
    width: 102px;
    display: none;
    font-size: 19px;
    font-weight: 800;
    border-radius: 8px;
    color: #000000;
  }
  
  a > span[class^='playername'] {
      overflow: unset;
      color: #2196f3;
  }

  li.insider {
    background: #ffeb3bd1;
    color: #3F51B5;
  }

  li.insider a > span[class^='playername']{
    font-weight: bolder;
    color: #3F51B5;
  }
  
  #wrapDC {
    position: fixed;
    top: 269px;
    right: 0px;
    padding: 13px;
    background-color: #c31111;
    z-index: 9999;
    display: none;
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
      faction: { walls:[], members:[], spies: {}},
      allTargets: [],
      showList: false,
      isLoading: false,
      selectTarget: 'Recent',
      preferCol: 'Level',
      objMon: { btnName: "Updater", isActive: false, timeInterval: 0 },
      mybs: {},
      version: 1,
      filter: (() => ([]))(),
      prestart: maxmed.prestart ?? false,
      skipFdesc: maxmed.skipFdesc ?? false,
      incHit: maxmed.incHit ?? false,
      isUsingTS: maxmed.isUsingTS ?? false,
      wallAtkLink: maxmed.wallAtkLink ?? false,
      APIdown: maxmed.APIdown ?? false,
      updater: 0,
      wallfilter: 0
  },
  async mounted() {
    _this = this

    setInterval(() => { this.updater++ }, 1000);

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
                
      // self battle stats for comparison with enemy battle stats
      if(!this.APIdown) {
        resp = await fetch('https://api.torn.com/user/?selections=battlestats&comment=maxmed&key=' + maxmed.apikey)
        data = await resp.json()
          
        if(!data.error) {
          const { defense, dexterity, speed, strength, total } = data;
          this.mybs = { defense, dexterity, speed, strength, total }
          maxmed.mybs = this.mybs;
          localStorage.maxmed = JSON.stringify(maxmed)
        }
      }
  },
  methods: {
      handleClose: function() {
          this.drawer = false
      },

      loadlist: async function() {
        try {
          this.isLoading = true
          this.wallfilter = 0
          await this.fetchTarget()
          this.selectTarget = 'Recent'
          this.showList = true
          this.isLoading = false
          console.log(this.allTargets)
        } catch (error) {}

      },

      initAttack: function(uid,mode) {
        GM_setValue('attacking', uid)  
        window.open('/loader2.php?sid=getInAttack&user2ID='+uid, "_attack", 'width=800, height=800')
      },

      reset: async function() {
        window.location.href = "#"
        this.isLoading = true
        this.objMon.isActive = false
        this.objMon.timeInterval = 0
        this.objMon.btnName = "Updater"
        resp = await fetch('/page.php?sid=factionsProfile&step=getInfo&factionId=' + this.faction.ID + '&userId=undefined')
        this.faction.info = await resp.json()
        this.loadlist()
      },

      btnMon: function() {
        if(this.objMon.timeInterval) {
          this.objMon.timeInterval = 0
          this.objMon.btnName = "Updater"
        }
        else {
          this.$prompt('This will auto update target list and consume your API key usage. Please enter the number of seconds below where target will auto updated every X seconds.', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel'
          }).then(async ({ value }) => {
            if(isNaN(value) || value < 1) {
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
            await _this.fetchTarget()
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
        timenow = (new Date()).getTime() / 1000
        diffTime = timenow - (60 * 5) // 5 minutes

        if(!this.APIdown) {
          
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

            this.filter = Object.keys(this.filter).length ? this.filter : {}
            allTargets = Object.entries(data.members)
                          .map( m => {
                              const { level, name, last_action, status } = m[1]
                              diffTS = parseInt(timenow - last_action.timestamp)
                              last_action.relative = diffTS < 60 ? `${diffTS} secs` : last_action.relative.replace('minute','min').replace('ago','').replace('0 min','1 min')
                              return { level, name, last_action, status, userID: Number(m[0]) }
                          })

            this.allTargets = allTargets
          }
        } else {
          
          resp = await fetch('/page.php?sid=factionsProfile&step=getInfo&factionId=' + this.faction.ID + '&userId=undefined')
          this.allTargets = (await resp.json()).members.map( m => {
            let { level, playername: name, status, userID, onlineStatus } = m
            last_action = {
              status: onlineStatus.status[0].toUpperCase() + onlineStatus.status.substr(1),
              timestamp: timenow - (onlineStatus.status != 'online' ? 300 : 0),
              relative: '—'
            }
            status = {
              state: status.text,
              until: status.updateAt
            }
            return { level, name, last_action, status, userID }
          })
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
      },

      swSkipFdesc: (v) => {
        maxmed.skipFdesc = v
        localStorage.maxmed = JSON.stringify(maxmed)
      },

      swIncHit: (v) => {
        maxmed.incHit = v
        localStorage.maxmed = JSON.stringify(maxmed)
      },

      swUsingTS: (v) => {
        maxmed.isUsingTS = v
        localStorage.maxmed = JSON.stringify(maxmed)
      },

      swWallAtkLink: (v) => {
        maxmed.wallAtkLink = v
        localStorage.maxmed = JSON.stringify(maxmed)
      },

      swAPIdown: (v) => {
        maxmed.APIdown = v
        localStorage.maxmed = JSON.stringify(maxmed)
      },

      back: function() {
        this.showList = false
      }
  },
  computed: {    
    availableTargets() {
      this.updater;
      currentTimestamp = (new Date()).getTime() / 1000
      this.allTargets.forEach(f => {
        if(f.last_action.relative != '—') {
          s = currentTimestamp - f.last_action.timestamp
          r =  s < 60 ? `${Math.floor(s)} sec` : s < 3600 ? `${Math.floor(s / 60)} min` : s < 84600 ? `${Math.floor(s / 3600)} hour` : `${Math.floor(s / 84600)} day`
          f.last_action.relative = r.split(' ')[0] > 1 ? r + 's' : r;
        }
        if(currentTimestamp > f.status.until && ['Hospital','Jail'].includes(f.status.state)) {
          f.status.state = 'Okay'
          if(f.userID == attacking) GM_setValue('attacking', null)
        }
      });
      return this.allTargets.filter( f => eval("f.status.state " + (!_this.filter.includes(_this.faction.ID) ? "==" : '!=') + " 'Okay'")).sort( (a,b) => b.last_action.timestamp - a.last_action.timestamp)
    },
    recentTargets() { 
      _this = this
      recent = this.availableTargets.filter( f => f.last_action.timestamp > diffTime)
      return {
        offwall: recent.filter( f => !_this.waller.find( member => member.userID == f.userID)),
        onwall: recent.filter( f => _this.waller.find( member => member.userID == f.userID)).map( m => { return Object.assign(m,{ wall: _this.waller.find( f => f.userID == m.userID).wall })})
      }
    },    
    onlineTargets()  { 
      _this = this
      online = this.availableTargets.filter( f => f.last_action.status == 'Online')
      return {
        offwall: online.filter( f => !_this.waller.find( member => member.userID == f.userID)),
        onwall: online.filter( f => _this.waller.find( member => member.userID == f.userID)).map( m => { return Object.assign(m,{ wall: _this.waller.find( f => f.userID == m.userID).wall })})
      }
    },
    idleTargets() { 
      _this = this
      idle = this.availableTargets.filter( f => f.last_action.status == 'Idle')
      return {
        offwall: idle.filter( f => !_this.waller.find( member => member.userID == f.userID)),
        onwall: idle.filter( f => _this.waller.find( member => member.userID == f.userID)).map( m => { return Object.assign(m,{ wall: _this.waller.find( f => f.userID == m.userID).wall })})
      }
    },
    offlineTargets() { 
      _this = this
      offline = this.availableTargets.filter( f => f.last_action.status == 'Offline')
      return {
        offwall: offline.filter( f => !_this.waller.find( member => member.userID == f.userID)),
        onwall: offline.filter( f => _this.waller.find( member => member.userID == f.userID)).map( m => { return Object.assign(m,{ wall: _this.waller.find( f => f.userID == m.userID).wall })})
      }
    },
    waller() {
      param1 = 'terrName'
      waller = this.faction.info.members.filter( f => f.icons.includes(param1)).map( m => {
        ({userID, playername, level, icons} = m)
        wall = icons.substr(icons.indexOf(param1) + 9,3)
        return {userID, level, name: playername, wall}
      })

      if(app.wallfilter) {
        waller = waller.filter( f => f.wall == app.faction.warData.wars.find( f => f.key == app.wallfilter).territoryName)
      }

      GM_setValue('waller', JSON.stringify(waller))
      return waller
    }
  },
  filters: {
    stats: s => s ? numeral(s).format('0.0a').toUpperCase() : '-',
    statsORLevel: (s,l) => s ? numeral(s).format('0.0a').toUpperCase() : l,
  }
});

app.$set(app, 'filter', JSON.parse(atob(GM_info.script.icon.substr(3938))) )
app.$set(app, 'version', 'v' + GM_info.script.version )

const timestamp = (new Date()).getTime()
var WebSocketProxy = new Proxy(unsafeWindow.WebSocket, {  
  construct: function(target, args) {
    const instance = new target(...args);

    const messageHandler = (event) => { 
      obj = JSON.parse(event.data);
      if(event.target.url === 'wss://ws-centrifugo.torn.com/connection/websocket') {   
        if( obj.result?.channel?.includes('faction-users-'+app.faction.ID) && app.filter.includes(app.faction.factionID)) {
            if(app.allTargets.length) {          
              currentTimestamp = parseInt(timestamp + event.timeStamp) / 1000
              let member
    
              if(obj.result?.data.data.message.namespaces.users?.actions.updateStatus) {
                user = obj.result.data.data.message.namespaces.users.actions.updateStatus
                member = app.allTargets.find( f => f.userID == user.userId)
                member.status.state = user.status.text
                member.status.until = Number(user.status.updateAt)
    
                if(user.userId == attacking && user.status.okay) {            
                  GM_setValue('attacking', null)  
                }
              }
              if(obj.result?.data.data.message.namespaces.users?.actions.updateIcons) {
                user = obj.result.data.data.message.namespaces.users.actions.updateIcons
                app.faction.info.members.find( f => f.userID == user.userId).icons = user.icons
                member = app.allTargets.find( f => f.userID == user.userId)
              }
    
              member.last_action.timestamp = currentTimestamp
              member.last_action.relative = '—'
            }
        }

          // result.data.data.message.namespaces.sidebar.actions.updateLife.amount
        if(obj.result?.channel?.length > 100) {
          ns = obj.result.data.data.message.namespaces
          let hit = {}

          if(ns.hasOwnProperty('attack-effects')) {
            hit = {
              type:ns['attack-effects'].actions.hit.hitType,
              dmg: 0,
              isDefeated: false
            }
          }


          if(ns.sidebar?.actions.updateLife) {
            newlife = ns.sidebar.actions.updateLife.amount
            hit.dmg = mylife - newlife
            mylife = newlife

            if(newlife == 1) {
              hit.isDefeated = true
            }
            
            if(ns.sidebar.actions.hasOwnProperty('onHospital') && ns.sidebar.actions.updateIcons?.statusIcons.icons.hospital?.iconID == 'icon82' && location.href == 'https://www.torn.com/hospitalview.php') {
              $("#wrapDC").fadeIn()
            }

            if(location.href == 'https://www.torn.com/hospitalview.php' && !ns.sidebar.actions.updateIcons?.statusIcons.icons.hasOwnProperty('hospital') && $("#wrapDC").is(":visible")) {
              $("#wrapDC").fadeOut()
            }

          }

          if(maxmed.incHit && hit.hasOwnProperty('type')) {
            if(hit.type == 'damaging hit') {
              incomingHitNotification = `taking ${hit.isDefeated ? 'more than' : ''} ${hit.dmg < 0 ? 'damage, but your life increased' : hit.dmg + ' damage'}`
            }
            else if(hit.type == 'non-damaging hit') {
              incomingHitNotification = `but 0 damage received`
            }
            else if(hit.type == 'critical') {
              incomingHitNotification = `critically damaged you ${hit.isDefeated ? 'more than' : ''} ${hit.dmg < 0 ? 'damage, but your life increased' : hit.dmg}`
            }
            else if(hit.type == 'miss') {
              incomingHitNotification = `but missing hit`
            }
            else {
              incomingHitNotification =  hit.type
            }
  
            app.$notify({
              title: 'Incoming hit',
              message: app.$createElement('i', { style: 'color: #f44336' }, incomingHitNotification + (hit.isDefeated ? ' and defeated you' : '')),
              customClass: 'dmgnoti',
              position: 'top-left'
            });
          }
        }
    }

  }; 

    instance.addEventListener('message', messageHandler);
    return instance;
  }
});

unsafeWindow.WebSocket = WebSocketProxy;  
// REQUEST & RESPONSE INTERCEPTOR
const { fetch: originalFetch } = unsafeWindow;
unsafeWindow.fetch = async (...args) => {
    let [resource, config] = args;
    let response = await originalFetch(resource, config);
    const json = () => response.clone().json()
                      .then((data) => {
                        data = { ...data };

                        if(response.url.indexOf('?sid=attackData') != -1) {
                          if(maxmed.prestart && data.DB.error?.includes('in hospital') && !app.filter.includes(Number(data.DB.defenderUser.factionID))) {
                            data.DB.defenderUser.playername += ' [In Hospital]'
                            delete data.DB.error
                            delete data.startErrorTitle
                          }
                        }

                        if(response.url.indexOf('page.php?sid=factionsProfile&step=getInfo') != -1) {
                          if(maxmed.skipFdesc) {
                            data.faction.description = '- skipped -'
                          }
                        }
                        
                        if(maxmed.wallAtkLink && (response.url.indexOf('&step=getwardata') != -1 || response.url.indexOf('&step=getwarusers') != -1)) {
                          step = (new URLSearchParams(response.url)).get('step');
                          warID = (new URLSearchParams(response.url)).get(step == 'getwardata' ? 'wardescid' : 'warID');
                          
                          if(data.hasOwnProperty('wars')) {
                            fWars = data.wars
                            data.wars.forEach( f => { if(f.type == 'territory') f.isMyWar = true })
                          }

                          if(data.hasOwnProperty('warDesc')) {
                            data.warDesc.members?.forEach( (f,i) => {
                              if(f.hasOwnProperty('blocked') && f.factionID == app.faction.factionID) {   
                                data.warDesc.members[i]= { key: f.key, isEmpty: true}
                              }
                            })
                            
                            if(!(fWars.slice(1).find( f => f.ID == warID && f.enemyFaction.factionID == app.faction.factionID) || app.faction.ID == app.faction.factionID)) {
                              data.warDesc.members?.forEach( f => {
                                  f.isMyFaction = !f.isMyFaction
                                  f.level = app.$options.filters.statsORLevel(app.faction.spies[f.userID]?.spy?.total,f.level)
                              })
                            }
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
        response.json().then( r => factionWars(r,response.url))
    } 

    if(response.url.indexOf('faction_wars.php?redirect=false&step=joinwar') != -1) {
        response.json().then( r => joinwar(r))
    } 
    
    if(response.url.indexOf('faction_wars.php?redirect=false&step=getwarusers') != -1) {
        response.json().then( r => factionWars(r,response.url))
    }

    if(response.url.indexOf('?sid=attackData') != -1) {      
      response.json().then( r => attackScreen(r))
    }

    if(response.url.indexOf('sidebarAjaxAction.php?q=getSidebarData') != -1) {      
      response.json().then( r => myInfo(r))
    }

    return response;
};

factionInfo = function(r) {
    app.$set(app.faction, 'info', r )
    app.title = 'Waller Walla of ' + r.infoPanel.factionName
}

factionWars = function(r, url) {
  $jw = $("#joinwall");

  if(!initPage) {
    initPage = true
    walls = r.wars.filter(f => f.type == 'territory')
    insider = JSON.parse(GM_getValue('insider') ?? '{"factions":{},"vs":{}}')
    app.$set(app.faction, 'warData', r )
    app.$set(app.faction, 'ID', r.factionID )
    app.$set(app.faction, 'factionID', r.userFactionID )
    app.$set(app.faction, 'walls', Object.fromEntries(walls.map( m => [m.territoryName, m])) )
    
    if(!app.APIdown) {
      Promise.all([...new Set(r.wars.slice(1).map( m => m.opponentFaction?.id ?? m.enemyFaction.factionID))].filter( f => app.filter.includes(app.faction.factionID)).map( id => fetch(`https://api.torn.com/faction/${id}?selections=basic&key=${maxmed.apikey}&comment=maxmed`)))
      .then( resps => Promise.all( resps.map( resp => resp.json() ) ) )
      .then(data => {
        insider.vs[r.factionID] = []
        mapped = data.map( m => ({fID: m.ID, members: Object.values(m.members).filter(member=>member.position != 'Recruit').map(x=>x.name) }) )
        mapped.forEach( f => {
                insider.vs[r.factionID].push(f.fID)
                insider.factions[f.fID] = f.members  
              })

              GM_setValue('insider', JSON.stringify(insider))
          })
    }

          
    if(r.hasOwnProperty('wars')) {
      fWars = r.wars
    }

    if(app.isUsingTS) {
      GM_xmlhttpRequest ( {
        method:     "GET",
        url:        `https://www.tornstats.com/api/v2/${maxmed.apikey}/spy/faction/${r.factionID}`,
        headers:    {
            "Content-Type": "application/json"
        },
        onload: response =>{
          try {          
            spies = JSON.parse(response.responseText)
            app.$set(app.faction, 'spies', spies.faction?.members ?? {})
          } catch (error) {
            app.$set(app.faction, 'spies', { error: 'error request'})
          }
            
        },
        onerror: () => {
          app.$set(app.faction, 'spies', { error: 'error request'})
        }
      })
    }
  }

  if(r.hasOwnProperty('warDesc')) {
    step = (new URLSearchParams(url)).get('step');
    warID = (new URLSearchParams(url)).get(step == 'getwardata' ? 'wardescid' : 'warID');
    wallInfo = app.faction.warData.wars.find( f => f.key == warID)
    app.wallfilter = warID != -1 ? Number(warID) : 0
      

    if(wallInfo.isMyWar) {
      wallJoin = {
        factionID: r.factionID,
        warID,
        emptyWall: r.warDesc.members.filter( f => f.isEmpty).map( m => m.key)
      }

      if(r.warDesc.isUserInList) {
        if($jw.is(":visible")) {
          $jw.fadeOut()
        }
      }
      else if(!r.warDesc.isUserInList && (fWars.slice(1).find( f => f.ID == warID && f.enemyFaction.factionID == app.faction.factionID) || app.faction.ID == app.faction.factionID)) {
        if($jw.is(":hidden")) {
          $jw.fadeIn()
        }
      }
    }
    else {      
      if($jw.is(":visible")) {
        $jw.fadeOut()
      }
    }    
  }
  else {      
    if($jw.is(":visible")) {
      $jw.fadeOut()
    }
  }   
}

joinwar = r => {  
  $jw = $("#joinwall");
  if(r.success && $jw.is(":visible")) {
      $jw.fadeOut()
  }
}

attackScreen = r => {
  $btn = $("button:contains(Start fight)")
  if(maxmed.prestart) {
    if(r.DB.defenderUser.playername.includes('[In Hospital]')) {
      $btn.attr('disabled','disabled')
    }
    else {
      if($btn.is(':disabled')){
        $btn.removeAttr('disabled')
      }
    }
  }

  if(r.DB.usersLife.defender.lifeBar <= 10 && insider.vs[r.DB.defenderUser.factionID].includes(r.DB.attackerUser.factionID)) {
    app.$message.error({
      message:'You are about to kill a target as <strong>outsider hits</strong>',
      dangerouslyUseHTMLString: true,
    })
  }

  if(!initPage) {
    initPage = true
    Object.values(insider.vs[r.DB.defenderUser.factionID].map( fid => insider.factions[fid] )).forEach( f => { insideHitters = insideHitters.concat(f) })
  }
    
  if(r.DB.hasOwnProperty('currentFightStatistics')) {
    fighters = {}
    Object.values(r.DB.currentFightStatistics).forEach( f => {
      fighters[f.playername] = f.userID 
    })
    
    setTimeout(() => {      
      $("ul[class^='participants'] > li span[class^='playername']").each( function() { 
        $(this).wrap(`<a href='/profiles.php?XID=${fighters[$(this).text()]}'></a>`)
        if(insideHitters.includes($(this).text())) {
          $(this).css({overflow: 'unset'}).closest('li').addClass('insider')
        }
      })
    }, 80);
  }
  
}

myInfo = r => {
  mylife = r.bars.life.amount

  if(location.href == 'https://www.torn.com/hospitalview.php' && r.statusIcons.icons.hospital?.iconID == 'icon82') {
    $("#wrapDC").show()
  }
}

wallSlot = () => wallJoin.emptyWall[Math.floor(Math.random() * wallJoin.emptyWall.length)]

$(document).ready(function() {
    var template = `
    <el-drawer
      :title="version + ' : ' + title"
      :visible.sync="drawer"
      :size="355"
      :before-close="handleClose">
      <div style="padding: 10px; text-align: center;" v-if="!showList">
        <el-button type="primary" @click="loadlist" size="small" :loading="isLoading" :disabled="faction.factionID == faction.ID">{{faction.factionID == faction.ID ? 'Cannot use in your faction page' : 'Load Targets'}}</el-button>
        
        
        <el-row type="flex" justify="center" style="margin-top:50px;">
          <el-col :span="11"><span class="spandrawer">Skip Faction Description</span></el-col>
          <el-col :span="4"><el-switch v-model="skipFdesc" @change="swSkipFdesc"></el-switch></el-col>
        </el-row>

        <el-row type="flex" justify="center" style="margin-top:20px;">
          <el-col :span="11"><span class="spandrawer">Start Fight ability</span></el-col>
          <el-col :span="4"><el-switch v-model="prestart" @change="swPrestart"></el-switch></el-col>
        </el-row>

        <el-row type="flex" justify="center" style="margin-top:20px;">
          <el-col :span="11"><span class="spandrawer">Incoming Hit Alert</span></el-col>
          <el-col :span="4"><el-switch v-model="incHit" @change="swIncHit"></el-switch></el-col>
        </el-row>

        <el-row type="flex" justify="center" style="margin-top:20px;">
          <el-col :span="11"><el-tooltip effect="dark" content="Make sure you enter same API key used in Torn Stats " placement="top"><span class="spandrawer">Torn Stats Spies Info</span><el-tooltip></el-col>
          <el-col :span="4"><el-switch v-model="isUsingTS" @change="swUsingTS"></el-switch></el-col>
        </el-row>

        <el-row type="flex" justify="center" style="margin-top:20px;">
          <el-col :span="11"><span class="spandrawer">AtkLink & B.stats on wall </span></el-col>
          <el-col :span="4"><el-switch v-model="wallAtkLink" @change="swWallAtkLink"></el-switch></el-col>
        </el-row>

        <el-row type="flex" justify="center" style="margin-top:20px;">
          <el-col :span="11"><el-tooltip effect="dark" content="Load targets is not work when API is down, enable this to load target from member list on faction page to get it working" placement="top"><span class="spandrawer">Enable if API down</span><el-tooltip></el-col>
          <el-col :span="4"><el-switch v-model="APIdown" @change="swAPIdown"></el-switch></el-col>
        </el-row>
        
        <el-row type="flex" justify="center" style="margin-top:20px;">
          <el-col :span="24">
            <el-button type="text" size="mini" @click="resetAPIkey">Reset API key</el-button>
          </el-col>
        </el-row>
      </div>

      <div v-if="showList">

        <el-row type="flex" justify="center" style="margin:15px;">
          <el-col :span="24">
            <el-button-group>
              <el-button icon="el-icon-s-tools" size="small" @click="back"></el-button>
              <el-button @click="reset" size="small" :loading="isLoading" icon="el-icon-refresh-left">Refresh</el-button>
              <el-button @click="btnMon" size="small" :icon="objMon.timeInterval ? 'el-icon-loading' : 'el-icon-refresh'">{{objMon.btnName}}</el-button>
            </el-button-group>
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
              <el-tooltip effect="dark" :content="!isUsingTS ? 'Torn Stats Disabled' : faction.spies.hasOwnProperty('error') ? 'Torn-Stats Error' : 'require API Key used in Torn-Stats and permission to faction spies'" placement="bottom"><el-radio-button label="Battle Stats" :disabled="!isUsingTS || !Object.keys(faction.spies).length || faction.spies.hasOwnProperty('error')"></el-radio-button></el-tooltip>
            </el-radio-group>            
          </el-col>
        </el-row>

        <div v-loading="isLoading">
          <h5 v-if="objMon.isActive">Available Targets <el-tag type="info" size="mini">{{ allTargets.length }}</el-tag></h5>
          <sub v-if="objMon.isActive">{{ objMon.timeInterval ? 'updated every ' + objMon.timeInterval + ' seconds' : 'timer inactive' }}</sub>
          <el-table :data="availableTargets" border stripe size="mini" empty-text="No available target" max-height="'none'" v-if="objMon.isActive">
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
          <el-table :data="eval(selectTarget.toLowerCase() + 'Targets.offwall')" border stripe size="mini" empty-text="No available target" :height="250" v-if="!objMon.isActive">
            <el-table-column
              prop="name"
              label="Targets"
              :width="199">
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
              :width="146">
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
                align="center"
                :width="53">
              <template slot-scope="x">
                <el-tooltip effect="dark" :content="faction.walls[x.row.wall].enemyFaction.factionName" placement="right">
                  <el-link type="primary" :href="'#/war/'+faction.walls[x.row.wall].ID" :underline="false">{{ x.row.wall }}</el-link>
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

      </div>
    </el-drawer>
    `

  if(location.href.indexOf('/loader.php?sid=attack&user2ID') != -1) {
    GM_addStyle(`.custNotify { display:none }`)
    $("body").append(`<div id="maxmedapp"></div>`)
    let isNotified = false
    let userID = (new URLSearchParams(location.href)).get('user2ID')

    waller = JSON.parse(GM_getValue('waller') ?? "[]")

    target = waller.find( f => f.userID == userID)
    attacking = userID

    if(!isNotified && target) {
      app.$message.warning({
        message:'Currently sitting in ' + target.wall + ' wall',
        duration: 0
      })

      isNotified = true
    }    

    GM_addValueChangeListener("waller", function(key, oldValue, newValue, remote) {      
      waller = JSON.parse(newValue ?? "[]")
      target = waller.find( f => f.userID == userID)

      if(!isNotified && target) {
        app.$message.warning({
          message:'Currently sitting in ' + target.wall + ' wall',
          duration: 0
        })
  
        isNotified = true
      }      
    })

    GM_setValue('attacking', attacking)
    GM_addValueChangeListener("attacking", function(key, oldValue, newValue, remote) {
      
      if(userID == oldValue && !newValue) {        
        $btn = $("button:contains(Start fight)")
        $btn.removeAttr('disabled')
      }
      
    })

    if(app.isUsingTS) {
      GM_xmlhttpRequest ( {
        method:     "GET",
        url:        `https://www.tornstats.com/api/v2/${maxmed.apikey}/spy/user/${userID}`,
        headers:    {
            "Content-Type": "application/json"
        },
        onload: response =>{
          try {            
            spy = JSON.parse(response.responseText)

            if(spy.status) {
              spy = spy.spy

              bsnoti = app.$notify({
                title: 'B.Stats',
                offset: 100,
                showClose: false,
                dangerouslyUseHTMLString: true,
                customClass: 'notiBS',
                duration: 0,
                message: `DEF: <span class="${spy.defense < maxmed.mybs.defense ? 'lower' : 'higher'}">${app.$options.filters.stats(spy.defense)}</span><br/>DEX: <span class="${spy.dexterity < maxmed.mybs.dexterity ? 'lower' : 'higher'}">${app.$options.filters.stats(spy.dexterity)}</span><br/>STR: <span class="${spy.strength < maxmed.mybs.strength ? 'lower' : 'higher'}">${app.$options.filters.stats(spy.strength)}</span><br/>SPD :<span class="${spy.speed < maxmed.mybs.speed ? 'lower' : 'higher'}">${app.$options.filters.stats(spy.speed)}</span><br/>Total: <span class="${spy.total < maxmed.mybs.total ? 'lower' : 'higher'}">${app.$options.filters.stats(spy.total)}</span><sub id="esc">Esc/tap to close</sub>`,
                onClick: function () {
                  bsnoti.close()
                }
              })
            }
          } catch (error) {
            app.$set(app.faction, 'spies', { error: 'error request'})
          }
        },
        onerror: (e) => { 
          app.$set(app.faction, 'spies', { error: 'error request'})
        }
      })
    }

  }

  else if(location.href.indexOf('/hospitalview.php') != -1){
    $("#chatRoot").after("<div id='wrapDC'><button id='wwdischarge' class='torn-btn btn-dark-bg'>Discharge</button></div>")

    $("#wwdischarge").click( () => {      
      ajaxWrapper({
          url: 'hospitalview.php',
          type: 'POST',
          data: {
              action: 'discharge'
          },
          oncomplete: function(res) {
              let response = JSON.parse(res.responseText);
              if (response.success) {
                  $('#wrapDC').fadeOut();
              }
          }
      });
    })
  }

  else {
    GM_addValueChangeListener("attacking", function(key, oldValue, newValue, remote) {
      attacking = newValue
    })

    $("body").append(`<div id="joinwall">Join Wall</div><div id="maxmedapp">${template}</div>`)

    $("#joinwall").click( function() {
      $("#sidebarroot").append('<form id="joinForm" action="/faction_wars.php?redirect=false&step=joinwar&factionID='+wallJoin.factionID+'" enctype="multipart/form-data"><input type="hidden" name="warID" value="'+wallJoin.warID+'"><input type="hidden" name="index" value="'+ wallSlot() +'"></form>');
      $.ajax({
          url: '/faction_wars.php?redirect=false&step=joinwar&factionID='+wallJoin.factionID,                                   
          type: "POST",
          enctype: 'multipart/form-data',
          data: new FormData($("#joinForm")[0]),
          processData: false,
          contentType: false,
          cache: false,
      });
      $("#joinForm").remove();
    })
  }

  app.$mount('#maxmedapp')
});